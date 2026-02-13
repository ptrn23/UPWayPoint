import { eq } from "drizzle-orm";
import type { Database } from "../db/database";
import { user } from "../db/schema";

export function makeUserRepository(db: Database) {
	async function getById(id: string) {
		const query = await db.select().from(user).where(eq(user.id, id)).limit(1);
		return query[0];
	}
	return { getById };
}
export type UserRepository = ReturnType<typeof makeUserRepository>;
