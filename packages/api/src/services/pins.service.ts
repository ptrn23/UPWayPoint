import type {
	CreatePin,
	Database,
	PinImagesRepository,
	PinRepository,
	PinTagsRepository,
} from "@repo/db";
import { TRPCError } from "@trpc/server";

export function makePinService(
	repositories: {
		pin: PinRepository;
		pinTags: PinTagsRepository;
		pinImages: PinImagesRepository;
	},
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

	async function create(data: CreatePin, tags: string[], imageURLs: string[]) {
		const res = await repositories.pin.create(data);

		if (!res)
			throw new TRPCError({
				message: "Failed to create pin",
				code: "BAD_REQUEST",
			});

		imageURLs.forEach(
			async (url) => await repositories.pinImages.create(url, res.id),
		);

		tags.forEach(async (t) => {
			await repositories.pinTags.create({
				pinId: res.id,
				tagId: t,
			});
		});

		return res;
	}

	async function update(
		id: string,
		data: Parameters<typeof repositories.pin.update>[1],
	) {
		return await repositories.pin.update(id, data);
	}

	async function userDeleteById(id: string, userId: string) {
		const pin = await getById(id);
		if (pin?.ownerId !== userId)
			throw new TRPCError({
				message: "User does not own this pin",
				code: "FORBIDDEN",
			});

		return await repositories.pin.userDeleteById(id);
	}

	async function adminDeleteById(id: string) {
		return await repositories.pin.adminDeleteById(id);
	}

	return {
		getAll,
		getById,
		getByOwnerId,
		getByStatus,
		create,
		update,
		userDeleteById,
		adminDeleteById,
	};
}

export type PinService = ReturnType<typeof makePinService>;
