import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adminProcedure, router, userProcedure } from "../trpc";
import z from "zod";
export const modificationRouter = router({
	getPending: adminProcedure.query(async ({ ctx }) => {
		return await ctx.services.modification.getAllPending();
	}),
	getPendingByUser: userProcedure.query(async ({ ctx }) => {
		return await ctx.services.modification.getAllPendingByUser(ctx.user.id);
	}),
	userCancelMod: userProcedure
		.input(z.object({ modId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.modification.userCancel(input.modId);
		}),
});

type ModificationRouter = typeof modificationRouter;
export type ModificationRouterOutputs = inferRouterOutputs<ModificationRouter>;
export type ModificationRouterInputs = inferRouterInputs<ModificationRouter>;
