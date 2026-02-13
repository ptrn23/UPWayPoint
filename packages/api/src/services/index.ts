import { db, repositories } from "@repo/db";
import { makeUserService } from "./user.service";

export const services = {
	user: makeUserService(repositories, db),
};

export type Services = typeof services;
