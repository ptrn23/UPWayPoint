import { db } from "./db/database";
import {
	makeUserRepository,
	makePinRepository,
	makeTagRepository,
	makePinImagesRepository,
} from "./repositories";
import { makePinTagsRepository } from "./repositories/pinTags.repository";

export const repositories = {
	user: makeUserRepository(db),
	pin: makePinRepository(db),
	pinTags: makePinTagsRepository(db),
	tag: makeTagRepository(db),
	pinImages: makePinImagesRepository(db),
};

export * from "./db/database";
export * as schema from "./db/schema";
export * from "./db/schema";
export * from "./db/types";
export * from "./repositories";
