import "server-only";
import { cache } from "react";
import { createCallerFactory, createContext } from "./trpc";
import { appRouter, type AppRouter } from "./routers";

const createCaller = createCallerFactory(appRouter);

// Type of the actual caller object
type ServerCaller = ReturnType<AppRouter["createCaller"]>;

// Type of the function that returns the caller
export const serverUserCaller = cache(
	async (req: Request): Promise<ServerCaller> => {
		const context = await createContext({ req });
		return createCaller(context);
	},
);
