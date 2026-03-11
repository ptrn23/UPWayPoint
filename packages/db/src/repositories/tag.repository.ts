import { desc } from "drizzle-orm";
import type { Database } from "../db/database";
import { tag } from "../db/schema";
import type { Tag } from "../db/types";

export function makeTagRepository(db: Database) {
	async function getAll(): Promise<Tag[]> {
		const query = await db.select().from(tag).orderBy(desc(tag.createdAt));
		return query;
	}

	return {
		getAll,
	};
}

export type TagRepository = ReturnType<typeof makeTagRepository>;
