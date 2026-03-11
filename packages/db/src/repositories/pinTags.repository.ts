import type { Database } from "../db/database";
import { pinTags } from "../db/schema";
import type { CreatePinTags, PinTags } from "../db/types";

export function makePinTagsRepository(db: Database) {
	async function create(data: CreatePinTags): Promise<PinTags | undefined> {
		const [p] = await db.insert(pinTags).values(data).returning();
		return p;
	}

	return {
		create,
	};
}

export type PinTagsRepository = ReturnType<typeof makePinTagsRepository>;
