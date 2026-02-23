import { router } from "../trpc";
import { userRouter } from "./user.router";
import { pinRouter } from "./pins.router";

export const appRouter = router({
	user: userRouter,
	pin: pinRouter,
});

export type AppRouter = typeof appRouter;
