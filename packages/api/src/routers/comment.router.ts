import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adminProcedure, router, userProcedure } from "../trpc";
import z from "zod";

export const commentRouter = router({
	create: userProcedure
		.input(
			z.object({
				message: z.string(),
				pinId: z.string(),
				parentId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.services.comment.create({
				...input,
				ownerId: ctx.user.id,
			});
		}),
	getCurrentUsersComments: userProcedure.query(async ({ ctx }) => {
		return await ctx.services.comment.getByUserId(ctx.user.id);
	}),

	getCount: adminProcedure.query(async ({ ctx }) => {
		return await ctx.services.comment.getCount();
	}),
});

type CommentRouter = typeof commentRouter;
export type CommentRouterOutputs = inferRouterOutputs<CommentRouter>;
export type CommentRouterInputs = inferRouterInputs<CommentRouter>;
