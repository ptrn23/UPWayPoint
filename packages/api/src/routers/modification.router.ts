import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adminProcedure, router } from "../trpc";
export const modificationRouter = router({
	getPending: adminProcedure.query(async ({ ctx }) => {
		return await ctx.services.modification.getAllPending();
	}),
});

type ModificationRouter = typeof modificationRouter;
export type ModificationRouterOutputs = inferRouterOutputs<ModificationRouter>;
export type ModificationRouterInputs = inferRouterInputs<ModificationRouter>;
