import type { Database, ModificationRepository } from "@repo/db";

export function makeModificationService(
	repositories: { modification: ModificationRepository },
	db: Database,
) {
	async function getAllPending() {
		return await repositories.modification.getPending();
	}

	return {
		getAllPending,
	};
}

export type ModificationService = ReturnType<typeof makeModificationService>;
