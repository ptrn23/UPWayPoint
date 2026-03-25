import type { Database, UserRepository } from "@repo/db";
import type { GetAllUsersOptions, GetUserCountOptions } from "@repo/db";

export function makeUserService(
	repositories: { user: UserRepository },
	db: Database,
) {
	async function getById(id: string) {
		return await repositories.user.getById(id);
	}

	async function getAll(options?: GetAllUsersOptions) {
		return await repositories.user.getAll(options);
	}

	async function getCount(options?: GetUserCountOptions) {
		return await repositories.user.getCount(options);
	}

	return { getById, getAll, getCount };
}
