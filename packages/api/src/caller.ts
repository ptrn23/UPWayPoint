import "server-only";
import { cache } from "react";
import { createCallerFactory, createContextFromHeaders } from "./trpc";
import { appRouter, type AppRouter } from "./routers";

const createCaller = createCallerFactory(appRouter);

type ServerCaller = ReturnType<AppRouter["createCaller"]>;

export const serverUserCaller = cache(
	async (headers: Headers): Promise<ServerCaller> => {
		const context = await createContextFromHeaders({ headers });
		return createCaller(context);
	},
);
