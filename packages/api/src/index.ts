import { userRouter } from "./routers/user.router";
import { router } from "./trpc";

const appRouter = router({
	user: userRouter,
});

export { appRouter };

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
export { createContext } from "./trpc";
