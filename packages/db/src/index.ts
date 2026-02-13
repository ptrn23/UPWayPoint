import { db } from "./db/database";
import { makeUserRepository } from "./repositories";

export const repositories = {
	user: makeUserRepository(db),
};

export * from "./db/database";
export * as schema from "./db/schema";
export * from "./db/schema";
export * from "./db/types";
export * from "./repositories";
