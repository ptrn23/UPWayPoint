import { db } from "./db/database";
import { makeUserRepository, makePinRepository } from "./repositories";

export const repositories = {
	user: makeUserRepository(db),
	pin: makePinRepository(db),
};

export * from "./db/database";
export * as schema from "./db/schema";
export * from "./db/schema";
export * from "./db/types";
export * from "./repositories";
