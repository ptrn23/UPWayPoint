import type {
	CreatePin,
	Database,
	PinImagesRepository,
	PinRepository,
	PinTagsRepository,
	GetAllPinsAdminOptions,
	GetPinCountOptions,
	PinStatus,
} from "@repo/db";
import { TRPCError } from "@trpc/server";
import type { CommentService } from "./comment.service";

export function makePinService(
	repositories: {
		pin: PinRepository;
		pinTags: PinTagsRepository;
		pinImages: PinImagesRepository;
	},
	services: { comment: CommentService },
	db: Database,
) {
	async function getAll() {
		return await repositories.pin.getAll();
	}

	async function getById(id: string) {
		const pin = await repositories.pin.getById(id);
		const comments = await services.comment.getByPinId(id);
		return { ...pin, comments: comments };
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

	async function getAllAdmin(options?: GetAllPinsAdminOptions) {
		return await repositories.pin.getAllAdmin(options);
	}

	async function getCount(options?: GetPinCountOptions) {
		return await repositories.pin.getCount(options);
	}

	async function getStatusCounts() {
		return await repositories.pin.getStatusCounts();
	}

	async function getByIdWithOwner(id: string) {
		return await repositories.pin.getByIdWithOwner(id);
	}

	async function approvePin(id: string) {
		const result = await repositories.pin.update(id, { status: "ACTIVE" });
		if (!result)
			throw new TRPCError({
				message: "Failed to approve pin",
				code: "NOT_FOUND",
			});
		return result;
	}

	async function rejectPin(id: string) {
		const result = await repositories.pin.update(id, { status: "ARCHIVED" });
		if (!result)
			throw new TRPCError({
				message: "Failed to reject pin",
				code: "NOT_FOUND",
			});
		return result;
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
		getAllAdmin,
		getCount,
		getStatusCounts,
		getByIdWithOwner,
		approvePin,
		rejectPin,
	};
}

export type PinService = ReturnType<typeof makePinService>;
