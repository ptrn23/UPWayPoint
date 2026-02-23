import { eq, desc } from "drizzle-orm";
import type { Database } from "../db/database";
import { pins } from "../db/schema";

export function makePinRepository(_db_: Database) {
    async function getAll() {
        const query = await _db_.select().from(pins).orderBy(desc(pins.createdAt));
        return query;
    }

    async function getById(_id_: string) {
        const query = await _db_.select().from(pins).where(eq(pins.id, _id_)).limit(1);
        return query[0];
    }

    async function getByOwnerId(_ownerId_: string) {
        const query = await _db_.select().from(pins).where(eq(pins.ownerId, _ownerId_)).orderBy(desc(pins.createdAt));
        return query;
    }

    async function getByStatus(_status_: string) {
        const query = await _db_.select().from(pins).where(eq(pins.status, _status_)).orderBy(desc(pins.createdAt));
        return query;
    }

    async function create(_data_: typeof pins.$inferInsert) {
        const [pin] = await _db_.insert(pins).values(_data_).returning();
        return pin;
    }

    async function update(_id_: string, _data_: Partial<typeof pins.$inferInsert>) {
        const [pin] = await _db_.update(pins).set({ ..._data_, updatedAt: new Date() }).where(eq(pins.id, _id_)).returning();
        return pin;
    }

    async function deleteById(_id_: string) {
        const [deleted] = await _db_.delete(pins).where(eq(pins.id, _id_)).returning();
        return deleted ? true : false;
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