import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
	verification,
	user,
	session,
	account,
	pin,
	pinTags,
	tag,
	pinImages,
	comment,
	modification,
} from "./schema";

export type Session = InferSelectModel<typeof session>;
export type User = InferSelectModel<typeof user>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;
export type Tag = InferSelectModel<typeof tag>;
export type Comment = InferSelectModel<typeof comment>;
export type CreateComment = InferInsertModel<typeof comment>;
export type CommentWithReplies = Comment & {
	replies: CommentWithReplies[];
	authorName: string;
};

export type PinTags = InferSelectModel<typeof pinTags>;
export type PinImages = InferSelectModel<typeof pinImages>;
export type Modification = InferSelectModel<typeof modification>;
export type CreateModification = InferInsertModel<typeof modification>;
export type Pin = InferSelectModel<typeof pin>;

export type CreatePin = InferInsertModel<typeof pin>;
export type UpdatePin = Partial<CreatePin>;
export type PinWithTags =
	| {
			id: string;
			createdAt: Date;
			updatedAt: Date;
			title: string;
			status: string;
			latitude: number;
			longitude: number;
			description: string | null;
			ownerId: string;
			pinTags: {
				createdAt: Date;
				updatedAt: Date;
				pinId: string;
				tagId: string;
				tag: {
					id: string;
					createdAt: Date;
					updatedAt: Date;
					title: string;
					color: string | null;
				};
			}[];
	  }
	| undefined;

export type PinDetails =
	| (Pin & {
			pinTags: (PinTags & { tag: Tag })[];
			images: PinImages[];
			owner: string;
	  })
	| undefined;
export type PinDetailsSimple = Pin & { pinTags: (PinTags & { tag: Tag })[] };
export type CreatePinTags = InferInsertModel<typeof pinTags>;
