import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { verification, user, session, account, pins } from "./schema";

export type Session = InferSelectModel<typeof session>;
export type User = InferSelectModel<typeof user>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;
export type Pin = InferSelectModel<typeof pins>;
export type CreatePin = InferInsertModel<typeof pins>;
export type UpdatePin = Partial<CreatePin>;
