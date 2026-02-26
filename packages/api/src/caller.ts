import "server-only";
import { cache } from "react";
import { createCallerFactory, createContext } from "./trpc";
import { appRouter, type AppRouter } from "./routers";

const createCaller = createCallerFactory(appRouter);

type ServerCaller = ReturnType<AppRouter["createCaller"]>;

export const serverUserCaller = cache(
	async (req: Request): Promise<ServerCaller> => {
		const context = await createContext({ req });
		return createCaller(context);
	},
);
