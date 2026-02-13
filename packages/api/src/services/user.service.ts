import type { Database, UserRepository } from "@repo/db";

export function makeUserService(
	repositories: { user: UserRepository },
	db: Database,
) {
	async function getById(id: string) {
		return await repositories.user.getById(id);
	}

	return { getById };
}
