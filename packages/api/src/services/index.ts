import { db, repositories } from "@repo/db";
import { makeUserService } from "./user.service";
import { makePinService } from "./pins.service";
import { makeTagService } from "./tag.service";
import { makeCommentService } from "./comment.service";
import { makeModificationService } from "./modification.service";

const commentService = makeCommentService(repositories, db);

export const services = {
  user: makeUserService(repositories, db),
  pin: makePinService(repositories, { comment: commentService }, db),
  tag: makeTagService(repositories, db),
  comment: commentService,
  modification: makeModificationService(repositories, db),
};

export type Services = typeof services;
