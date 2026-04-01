import type { Database, TagRepository } from "@repo/db";

export function makeTagService(
  repositories: { tag: TagRepository },
  db: Database,
) {
  async function getAll() {
    return await repositories.tag.getAll();
  }

  return {
    getAll,
  };
}

export type TagService = ReturnType<typeof makeTagService>;
