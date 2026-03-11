import { eq, desc } from "drizzle-orm";
import type { Database } from "../db/database";
import { pins } from "../db/schema";
import type { CreatePin, Pin, UpdatePin } from "../db/types";

export function makePinRepository(db: Database) {
	async function getAll(): Promise<Pin[]> {
		const query = await db.select().from(pins).orderBy(desc(pins.createdAt));
		return query;
	}

	async function getById(id: string): Promise<Pin | undefined> {
		const query = await db.select().from(pins).where(eq(pins.id, id)).limit(1);
		return query[0];
	}

	async function getByOwnerId(ownerId: string): Promise<Pin[]> {
		const query = await db
			.select()
			.from(pins)
			.where(eq(pins.ownerId, ownerId))
			.orderBy(desc(pins.createdAt));
		return query;
	}

	async function getByStatus(status: string): Promise<Pin[]> {
		const query = await db
			.select()
			.from(pins)
			.where(eq(pins.status, status))
			.orderBy(desc(pins.createdAt));
		return query;
	}

	async function create(data: CreatePin): Promise<Pin | undefined> {
		const [pin] = await db.insert(pins).values(data).returning();
		return pin;
	}

	async function update(id: string, data: UpdatePin): Promise<Pin | undefined> {
		const [pin] = await db
			.update(pins)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(pins.id, id))
			.returning();
		return pin;
	}

	async function deleteById(id: string): Promise<boolean> {
		const [deleted] = await db.delete(pins).where(eq(pins.id, id)).returning();
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
