import { expect, test } from "vitest";
import { createCallerFactory } from "../src/trpc";
import { appRouter } from "../src/routers";
import { services } from "../src/services";

interface TestSession {
	userId: string;
}

async function createTestContext(opts: { session: TestSession }) {
	try {
		const user = await services.user.getById(opts.session.userId);
		return {
			user,
			services,
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function setupTestCaller() {
	const createCaller = createCallerFactory(appRouter);
	const context = await createTestContext({
		session: { userId: "non-existent_user" },
	});
	return createCaller(context);
}

test("[AUTH TEST]: non-existent (no account) user should not be able to create pins", async () => {
	const caller = await setupTestCaller();

	// try create a pin with the userId in the session
	await expect(
		caller.pin.create({
			title: "pin",
			latitude: 1.0,
			longitude: 1.0,
			ownerId: "non-existent_user",
			description: "",
			status: "PENDING_VERIFICATION",
		}),
	).rejects.toMatchObject({
		code: "UNAUTHORIZED",
	});

	// try create a pin with random userId
	await expect(
		caller.pin.create({
			title: "pin",
			latitude: 1.0,
			longitude: 1.0,
			ownerId: "some-other-id",
			description: "",
			status: "PENDING_VERIFICATION",
		}),
	).rejects.toMatchObject({
		code: "UNAUTHORIZED",
	});

	// try create a pin with random userId and missing info
	await expect(
		caller.pin.create({
			title: "pin",
			latitude: 1.0,
			longitude: 1.0,
			ownerId: "missing-pin-info",
		}),
	).rejects.toMatchObject({
		code: "UNAUTHORIZED",
	});
});

test("[AUTH TEST]: non-existent (no account) user should not be able to update pins", async () => {
	const caller = await setupTestCaller();

	// try to activate pin
	await expect(
		caller.pin.update({ id: "no-pin-id", status: "ACTIVE" }),
	).rejects.toMatchObject({
		code: "UNAUTHORIZED",
	});

	// try to archive pin
	await expect(
		caller.pin.update({ id: "no-pin-id", status: "ARCHIVED" }),
	).rejects.toMatchObject({
		code: "UNAUTHORIZED",
	});

	// try to mark pin for deletion
	await expect(
		caller.pin.update({ id: "no-pin-id", status: "DELETED" }),
	).rejects.toMatchObject({
		code: "UNAUTHORIZED",
	});
});

test("[AUTH TEST]: non-existent (no account) user should not be able to delete pins", async () => {
	const caller = await setupTestCaller();

	// try to delete pin
	await expect(caller.pin.delete({ id: "no-pin-id" })).rejects.toMatchObject({
		code: "UNAUTHORIZED",
	});
});

test("[CONNECTION TEST]: fetching pins", async () => {
	const caller = await setupTestCaller();
	const pins = await caller.pin.getAll();

	// connection test fetching
	expect(Array.isArray(pins)).toBe(true);
	expect(pins.length).toBeGreaterThanOrEqual(0);
});
