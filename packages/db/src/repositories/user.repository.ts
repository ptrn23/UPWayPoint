import { eq, ilike, desc, count, and } from "drizzle-orm";
import type { Database } from "../db/database";
import { user } from "../db/schema";
import type { User } from "../db/types";

export interface GetAllUsersOptions {
	limit?: number;
	offset?: number;
	role?: "user" | "admin";
	search?: string;
}

export interface GetUserCountOptions {
	role?: "user" | "admin";
}

export function makeUserRepository(db: Database) {
	async function getById(id: string): Promise<User | undefined> {
		const query = await db.select().from(user).where(eq(user.id, id)).limit(1);
		return query[0];
	}

	async function getAll(options?: GetAllUsersOptions): Promise<User[]> {
		const limit = options?.limit ?? 50;
		const offset = options?.offset ?? 0;

		let whereClause = undefined;
		if (options?.role || options?.search) {
			const conditions = [];
			if (options.role) {
				conditions.push(eq(user.userRole, options.role));
			}
			if (options.search) {
				conditions.push(ilike(user.name, `%${options.search}%`));
			}
			const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
		}

		const query = await db
			.select()
			.from(user)
			.where(whereClause)
			.orderBy(desc(user.createdAt))
			.limit(limit)
			.offset(offset);
		return query;
	}

	async function getCount(options?: GetUserCountOptions): Promise<number> {
		const result = await db
			.select({ count: count() })
			.from(user)
			.where(options?.role ? eq(user.userRole, options.role) : undefined);
		return result[0]?.count ?? 0;
	}

	return { getById, getAll, getCount };
}
export type UserRepository = ReturnType<typeof makeUserRepository>;
