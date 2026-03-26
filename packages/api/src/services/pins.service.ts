import type {
	CreatePin,
	Database,
	PinImagesRepository,
	PinRepository,
	PinTagsRepository,
	GetAllPinsAdminOptions,
	GetPinCountOptions,
	ModificationRepository,
	UpdatePin,
} from "@repo/db";
import { TRPCError } from "@trpc/server";
import type { CommentService } from "./comment.service";

export function makePinService(
	repositories: {
		pin: PinRepository;
		pinTags: PinTagsRepository;
		pinImages: PinImagesRepository;
		modification: ModificationRepository;
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
		const modifications = await repositories.modification.getByPinId(id);
		return { ...pin, comments: comments, modifications: modifications };
	}

	async function getSimpleById(id: string) {
		const pin = await repositories.pin.getSimpleById(id);
		return pin;
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
		const { status, ...dataWithoutStatus } = data;
		await repositories.modification.create({
			userId: data.ownerId,
			pinId: res.id,
			after: { data: dataWithoutStatus, tags: tags },
			status: data.status === "ACTIVE" ? "APPLIED" : "PENDING",
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

	async function adminUpdate(id: string, userId: string, data: UpdatePin) {
		const exists = await repositories.pin.getById(id);

		if (!exists)
			throw new TRPCError({
				message: "Pin does not exist",
				code: "NOT_FOUND",
			});

		const updatedPin = await repositories.pin.update(id, data);

		await repositories.modification.create({
			pinId: id,
			userId,
			after: { data: data },
			status: "APPLIED",
		});

		return updatedPin;
	}

	async function requestUpdate(
		id: string,
		userId: string,
		data: UpdatePin,
		tags: string[],
	) {
		const exists = await repositories.pin.getById(id);

		if (!exists)
			throw new TRPCError({
				message: "Pin does not exist",
				code: "NOT_FOUND",
			});

		return await repositories.modification.create({
			pinId: id,
			userId,
			after: { data: data, tags: tags },
		});
	}

	async function applyUpdate(id: string, adminId: string) {
		const pendingModification = await repositories.modification.getById(id);
		if (!pendingModification)
			throw new TRPCError({
				message: "Modification does not exist",
				code: "NOT_FOUND",
			});
		const after = pendingModification.after as {
			data: { title?: string; description?: string };
			tags: string[];
		};

		const updatedPin = await repositories.pin.update(
			pendingModification.pinId,
			after.data,
		);

		if (after.tags.length > 0) {
			await repositories.pinTags.deleteTagByPinId(pendingModification.pinId);
			await repositories.pinTags.create({
				pinId: pendingModification.pinId,
				tagId: after.tags[0]!,
			}); // change this to handle multiple tags in the future
		}

		await repositories.modification.applyModification(id, adminId);

		return updatedPin;
	}

	async function rejectUpdate(id: string, adminId: string) {
		const pendingModification = await repositories.modification.getById(id);

		if (!pendingModification)
			throw new TRPCError({
				message: "Modification does not exist",
				code: "NOT_FOUND",
			});

		return await repositories.modification.rejectModification(id, adminId);
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

	async function approvePin(id: string, adminId: string) {
		const result = await repositories.pin.update(id, { status: "ACTIVE" });
		if (!result)
			throw new TRPCError({
				message: "Failed to approve pin",
				code: "NOT_FOUND",
			});

		const initialMod = await repositories.modification.getByUserPinId(
			result.ownerId,
			id,
		);

		if (!!initialMod)
			await repositories.modification.applyModification(initialMod.id, adminId);

		return result;
	}

	async function rejectPin(id: string, adminId: string) {
		const result = await repositories.pin.update(id, { status: "ARCHIVED" });
		if (!result)
			throw new TRPCError({
				message: "Failed to reject pin",
				code: "NOT_FOUND",
			});

		const initialMod = await repositories.modification.getByUserPinId(
			result.ownerId,
			id,
		);

		if (initialMod)
			await repositories.modification.rejectModification(
				initialMod.id,
				adminId,
			);

		return result;
	}

	return {
		getAll,
		getById,
		getByOwnerId,
		getByStatus,
		create,
		requestUpdate,
		rejectUpdate,
		applyUpdate,
		userDeleteById,
		adminDeleteById,
		getAllAdmin,
		getCount,
		getStatusCounts,
		approvePin,
		rejectPin,
		getSimpleById,
		adminUpdate,
	};
}

export type PinService = ReturnType<typeof makePinService>;
