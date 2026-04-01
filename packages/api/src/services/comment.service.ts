import type {
  CommentRepository,
  // Database,
  Comment,
  CommentWithReplies,
  CreateComment,
  UserRepository,
} from "@repo/db";

function nestComments(rows: Comment[]): CommentWithReplies[] {
  const map = new Map();
  const roots: CommentWithReplies[] = [];

  rows.forEach((row) => {
    map.set(row.id, { ...row, replies: [] });
  });

  rows.forEach((row) => {
    if (row.parentId) {
      map.get(row.parentId)?.replies.push(map.get(row.id));
    } else {
      roots.push(map.get(row.id));
      console.log(row.message, row.parentId);
    }
  });

  return roots;
}

export function makeCommentService(
  repositories: { comment: CommentRepository; user: UserRepository },
  // db: Database,
) {
  async function getByPinId(pinId: string) {
    const rows = await repositories.comment.getByPinId(pinId);

    return nestComments(rows);
  }

  async function create(data: CreateComment) {
    return await repositories.comment.create(data);
  }

  async function getByUserId(id: string) {
    return await repositories.comment.getByUserId(id);
  }

  async function getCount() {
    return await repositories.comment.getCount();
  }

  return {
    create,
    getByPinId,
    getByUserId,
    getCount,
  };
}

export type CommentService = ReturnType<typeof makeCommentService>;
