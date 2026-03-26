import { router } from "../trpc";
import { userRouter } from "./user.router";
import { pinRouter } from "./pins.router";
import { tagRouter } from "./tag.router";
import { commentRouter } from "./comment.router";
import { modificationRouter } from "./modification.router";

export const appRouter = router({
	user: userRouter,
	pin: pinRouter,
	tag: tagRouter,
	comment: commentRouter,
	modification: modificationRouter,
});

export type AppRouter = typeof appRouter;

export type {
	PinRouterOutputs,
	PinRouterInputs,
} from "./pins.router";
