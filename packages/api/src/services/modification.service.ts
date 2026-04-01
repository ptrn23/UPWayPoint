import type { Database, ModificationRepository } from "@repo/db";

export function makeModificationService(
  repositories: { modification: ModificationRepository },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
