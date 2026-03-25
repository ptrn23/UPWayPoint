import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router, userProcedure } from "../trpc";
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
			return ctx.services.comment.create({
				...input,
				ownerId: ctx.user.id,
			});
		}),
	getCurrentUsersComments: userProcedure.query(async ({ ctx }) => {
		return ctx.services.comment.getByUserId(ctx.user.id);
	}),
});

type CommentRouter = typeof commentRouter;
export type CommentRouterOutputs = inferRouterOutputs<CommentRouter>;
export type CommentRouterInputs = inferRouterInputs<CommentRouter>;
