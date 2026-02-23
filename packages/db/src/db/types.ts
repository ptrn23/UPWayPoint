import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { verification, user, session, account, pins } from "./schema";

export type Session = InferSelectModel<typeof session>;
export type User = InferSelectModel<typeof user>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;
export type Pins = InferSelectModel<typeof pins>;
