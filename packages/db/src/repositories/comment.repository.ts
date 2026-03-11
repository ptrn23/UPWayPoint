import { sql } from "drizzle-orm";
import type { Database } from "../db/database";
import type { Comment, CreateComment } from "../db/types";
import { comment } from "../db/schema";

export function makeCommentRepository(db: Database) {
	async function create(data: CreateComment) {
		const [c] = await db.insert(comment).values(data).returning();
		return c;
	}

	async function getByPinId(
		pinId: string,
		maxDepth: number = 3,
	): Promise<(Comment & { authorName: string })[]> {
		try {
			const result = await db.execute(sql`
    WITH RECURSIVE comment_tree AS (
      -- Base case: top-level comment (no parent)
      SELECT
				c.id, c.message, c.owner_id, c.parent_id, c.pin_id, c.deleted_at, c.created_at, c.updated_at,
				u.name AS author_name,
				0 AS depth
      FROM comment c
			LEFT JOIN "user" u ON c.owner_id = u.id
      WHERE pin_id = ${pinId} AND parent_id IS NULL

      UNION ALL

      -- Recursive case: get replies up to maxDepth
      SELECT
				c.id, c.message, c.owner_id, c.parent_id, c.pin_id, c.deleted_at, c.created_at, c.updated_at,
				u.name AS author_name,
				ct.depth + 1
      FROM comment c
			LEFT JOIN "user" u ON c.owner_id = u.id
      INNER JOIN comment_tree ct ON c.parent_id = ct.id
      WHERE ct.depth < ${maxDepth}
    )
    SELECT * FROM comment_tree
    ORDER BY depth, created_at DESC
  `);

			return result.map((row) => {
				return {
					id: row.id,
					message: row.message,
					pinId: row.pin_id,
					parentId: row.parent_id,
					ownerId: row.owner_id,
					authorName: row.author_name,
					createdAt: row.created_at,
					updatedAt: row.updated_at,
					deletedAt: row.deleted_at,
				} as Comment & { authorName: string };
			});
		} catch (e) {
			console.error("Raw DB error:", e);
			throw e;
		}
	}
	return {
		create,
		getByPinId,
	};
}

export type CommentRepository = ReturnType<typeof makeCommentRepository>;
