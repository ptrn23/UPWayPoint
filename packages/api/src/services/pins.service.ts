import type { CreatePin, Database, PinRepository } from "@repo/db";
import { TRPCError } from "@trpc/server";

export function makePinService(
	repositories: { pin: PinRepository },
	db: Database,
) {
	async function getAll() {
		return await repositories.pin.getAll();
	}

	async function getById(id: string) {
		return await repositories.pin.getById(id);
	}

	async function getByOwnerId(ownerId: string) {
		return await repositories.pin.getByOwnerId(ownerId);
	}

	async function getByStatus(status: string) {
		return await repositories.pin.getByStatus(status);
	}

	async function create(data: CreatePin) {
		return await repositories.pin.create(data);
	}

	async function update(
		id: string,
		data: Parameters<typeof repositories.pin.update>[1],
	) {
		return await repositories.pin.update(id, data);
	}

	async function deleteById(id: string, userId: string) {
		const pin = await getById(id);
		if (pin?.ownerId !== userId)
			throw new TRPCError({
				message: "User does not own this pin",
				code: "FORBIDDEN",
			});

		return await repositories.pin.deleteById(id);
	}

	return {
		getAll,
		getById,
		getByOwnerId,
		getByStatus,
		create,
		update,
		deleteById,
	};
}

export type PinService = ReturnType<typeof makePinService>;
