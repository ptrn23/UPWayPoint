import { db, repositories } from "@repo/db";
import { makeUserService } from "./user.service";
import { makePinService } from "./pins.service";

export const services = {
	user: makeUserService(repositories, db),
	pin: makePinService(repositories, db),
};

export type Services = typeof services;
