import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/database";
import { modification } from "../db/schema";
import type { Modification, CreateModification } from "../db/types";

export function makeModificationRepository(db: Database) {
	async function create(
		details: CreateModification,
	): Promise<Modification | undefined> {
		const [m] = await db.insert(modification).values(details).returning();
		return m;
	}

	async function getPending() {
		return await db.query.modification.findMany({
			where: eq(modification.status, "PENDING"),
		});
	}

	async function getById(id: string) {
		return await db.query.modification.findFirst({
			where: eq(modification.id, id),
		});
	}

	async function getByUserPinId(userId: string, pinId: string) {
		return await db.query.modification.findFirst({
			where: and(
				eq(modification.pinId, pinId),
				eq(modification.userId, userId),
			),
			orderBy: desc(modification.createdAt),
		});
	}

	async function applyModification(id: string, adminId: string) {
		return await db
			.update(modification)
			.set({ status: "APPLIED", reviewedBy: adminId, reviewedAt: new Date() })
			.where(eq(modification.id, id));
	}

	async function rejectModification(id: string, adminId: string) {
		return await db
			.update(modification)
			.set({ status: "REJECTED", reviewedBy: adminId, reviewedAt: new Date() })
			.where(eq(modification.id, id));
	}

	return {
		create,
		getPending,
		getById,
		applyModification,
		rejectModification,
		getByUserPinId,
	};
}

export type ModificationRepository = ReturnType<
	typeof makeModificationRepository
>;
