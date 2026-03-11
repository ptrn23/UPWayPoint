import type { Database } from "../db/database";
import { pinImages } from "../db/schema";
import type { PinImages } from "../db/types";

export function makePinImagesRepository(db: Database) {
	async function create(
		url: string,
		pinId: string,
	): Promise<PinImages | undefined> {
		const [i] = await db
			.insert(pinImages)
			.values({ pinId: pinId, url: url })
			.returning();
		return i;
	}

	return {
		create,
	};
}

export type PinImagesRepository = ReturnType<typeof makePinImagesRepository>;
