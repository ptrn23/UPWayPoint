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

	async function getByPinId(pinId: string) {
		return await repositories.modification.getByPinId(pinId);
	}

	return {
		getAllPending,
		getAllPendingByUser,
		userCancel,
		getByPinId,
	};
}

export type ModificationService = ReturnType<typeof makeModificationService>;
