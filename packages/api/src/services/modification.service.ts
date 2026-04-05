import type { Database, ModificationRepository } from "@repo/db";

export function makeModificationService(
	repositories: { modification: ModificationRepository },
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	db: Database,
) {
	async function getAllPending() {
		return await repositories.modification.getPending();
	}

	async function getAllPendingByUser(id: string) {
		return await repositories.modification.getByUserId(id);
	}
	async function userCancel(modId: string) {
		return await repositories.modification.deleteModification(modId);
	}

	return {
		getAllPending,
		getAllPendingByUser,
		userCancel,
	};
}

export type ModificationService = ReturnType<typeof makeModificationService>;
