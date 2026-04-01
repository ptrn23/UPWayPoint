import { db } from "./db/database";
import {
  makeUserRepository,
  makePinRepository,
  makeTagRepository,
  makePinImagesRepository,
  makeCommentRepository,
  makeModificationRepository,
  makePinTagsRepository,
} from "./repositories";

export const repositories = {
  user: makeUserRepository(db),
  pin: makePinRepository(db),
  pinTags: makePinTagsRepository(db),
  tag: makeTagRepository(db),
  pinImages: makePinImagesRepository(db),
  comment: makeCommentRepository(db),
  modification: makeModificationRepository(db),
};

export * from "./db/database";
export * as schema from "./db/schema";
export * from "./db/schema";
export * from "./db/types";
export * from "./repositories";
