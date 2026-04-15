import { eq, desc, ilike, and, count, gte, lte } from "drizzle-orm";
import type { Database } from "../db/database";
import { pin } from "../db/schema";
import type {
	CreatePin,
	Pin,
	PinWithTags,
	PinDetails,
	UpdatePin,
	PinDetailsSimple,
	PinTags,
	Tag,
} from "../db/types";

export type PinStatus =
	| "PENDING_VERIFICATION"
	| "ACTIVE"
	| "ARCHIVED"
	| "DELETED";

export interface GetAllPinsAdminOptions {
	limit?: number;
	offset?: number;
	status?: PinStatus;
	ownerId?: string;
	search?: string;
}

export interface GetPinCountOptions {
	status?: PinStatus;
}

export function makePinRepository(db: Database) {
	async function getAll(): Promise<PinWithTags[]> {
		const query = await db.query.pin.findMany({
			with: { pinTags: { with: { tag: true } } },
		});
		return query;
	}

	async function getById(id: string): Promise<PinDetails | undefined> {
		const query = await db.query.pin.findFirst({
			where: eq(pin.id, id),
			with: {
				pinTags: {
					with: {
						tag: true,
					},
				},
				images: true,
				owner: true,
			},
		});

		if (!query) return;

		return { ...query, owner: query?.owner.name ?? "Unknown" };
	}

	async function getSimpleById(
		id: string,
	): Promise<PinDetailsSimple | undefined> {
		const query = await db.query.pin.findFirst({
			where: eq(pin.id, id),
			with: {
				pinTags: {
					with: {
						tag: true,
					},
				},
			},
		});

		return query;
	}

	async function getByOwnerId(
		ownerId: string,
	): Promise<(Pin & { pinTags: (PinTags & { tag: Tag })[] })[]> {
		const query = await db.query.pin.findMany({
			where: eq(pin.ownerId, ownerId),
			orderBy: desc(pin.createdAt),
			with: {
				pinTags: {
					with: {
						tag: true,
					},
				},
			},
		});
		return query;
	}

	async function getByStatus(status: string): Promise<Pin[]> {
		const query = await db
			.select()
			.from(pin)
			.where(eq(pin.status, status))
			.orderBy(desc(pin.createdAt));
		return query;
	}

	async function create(data: CreatePin): Promise<Pin | undefined> {
		const [p] = await db.insert(pin).values(data).returning();
		return p;
	}

	async function update(id: string, data: UpdatePin): Promise<Pin | undefined> {
		const [p] = await db
			.update(pin)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(pin.id, id))
			.returning();
		return p;
	}

	async function userDeleteById(id: string): Promise<boolean> {
		const [deleted] = await db
			.update(pin)
			.set({ status: "DELETED", updatedAt: new Date() })
			.where(eq(pin.id, id))
			.returning();
		return !!deleted;
	}

	async function adminDeleteById(id: string): Promise<boolean> {
		const [deleted] = await db.delete(pin).where(eq(pin.id, id)).returning();
		return !!deleted;
	}

	async function getAllAdmin(
		options?: GetAllPinsAdminOptions,
	): Promise<(Pin & { pinTags: (PinTags & { tag: Tag })[]; owner: string })[]> {
		const limit = options?.limit ?? 50;
		const offset = options?.offset ?? 0;

		let whereClause = undefined;
		if (options?.status || options?.ownerId || options?.search) {
			const conditions = [];
			if (options.status) {
				conditions.push(eq(pin.status, options.status));
			}
			if (options.ownerId) {
				conditions.push(eq(pin.ownerId, options.ownerId));
			}
			if (options.search) {
				conditions.push(ilike(pin.title, `%${options.search}%`));
			}
			if (conditions.length > 0) {
				whereClause = and(...conditions);
			}
		}

		const query = await db.query.pin.findMany({
			where: whereClause,
			orderBy: desc(pin.createdAt),
			limit: limit,
			offset: offset,
			with: {
				pinTags: {
					with: {
						tag: true,
					},
				},
				owner: true,
			},
		});

		return query.map((q) => {
			return { ...q, owner: q.owner.name };
		});
	}

	async function getCount(options?: GetPinCountOptions): Promise<number> {
		const result = await db
			.select({ count: count() })
			.from(pin)
			.where(options?.status ? eq(pin.status, options.status) : undefined);
		return result[0]?.count ?? 0;
	}

	async function getStatusCounts(): Promise<Record<PinStatus, number>> {
		const statuses: PinStatus[] = [
			"PENDING_VERIFICATION",
			"ACTIVE",
			"ARCHIVED",
			"DELETED",
		];
		const result: Record<PinStatus, number> = {
			PENDING_VERIFICATION: 0,
			ACTIVE: 0,
			ARCHIVED: 0,
			DELETED: 0,
		};

		for (const status of statuses) {
			const countResult = await db
				.select({ count: count() })
				.from(pin)
				.where(eq(pin.status, status));
			result[status] = countResult[0]?.count ?? 0;
		}

		return result;
	}

	async function isSimilar(lat: number, lng: number, title: string) {
		const minLat = lat - 0.001;
		const maxLat = lat + 0.001;
		const minLng = lng - 0.001;
		const maxLng = lng + 0.001;

		const exists = await db.query.pin.findFirst({
			where: and(
				gte(pin.latitude, minLat),
				lte(pin.latitude, maxLat),
				gte(pin.longitude, minLng),
				lte(pin.longitude, maxLng),
				eq(pin.title, title),
			),
		});

		return !!exists;
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
		getSimpleById,
		isSimilar,
	};
}

export type PinRepository = ReturnType<typeof makePinRepository>;
