import { eq, desc } from "drizzle-orm";
import type { Database } from "../db/database";
import { pin } from "../db/schema";
import type { CreatePin, Pin, PinWithTags, UpdatePin } from "../db/types";

export function makePinRepository(db: Database) {
	async function getAll(): Promise<Pin[]> {
		const query = await db.select().from(pin).orderBy(desc(pin.createdAt));
		return query;
	}

	async function getById(id: string): Promise<PinWithTags | undefined> {
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

	async function getByOwnerId(ownerId: string): Promise<Pin[]> {
		const query = await db
			.select()
			.from(pin)
			.where(eq(pin.ownerId, ownerId))
			.orderBy(desc(pin.createdAt));
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

	async function deleteById(id: string): Promise<boolean> {
		const [deleted] = await db.delete(pin).where(eq(pin.id, id)).returning();
		return !!deleted;
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

export type PinRepository = ReturnType<typeof makePinRepository>;
