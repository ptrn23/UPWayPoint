import { router } from "../trpc";
import { userRouter } from "./user.router";
import { pinRouter } from "./pins.router";
import { tagRouter } from "./tag.router";
import { commentRouter } from "./comment.router";

export const appRouter = router({
	user: userRouter,
	pin: pinRouter,
	tag: tagRouter,
	comment: commentRouter,
});

export type AppRouter = typeof appRouter;

export type {
	PinRouterOutputs,
	PinRouterInputs,
} from "./pins.router";
