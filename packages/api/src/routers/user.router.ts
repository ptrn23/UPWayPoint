import { router, userProcedure, adminProcedure } from "../trpc";
import { z } from "zod";

const paginationSchema = z.object({
	limit: z.number().min(1).max(100).default(50),
	offset: z.number().min(0).default(0),
	role: z.enum(["user", "admin"]).optional(),
	search: z.string().optional(),
});

const userFilterSchema = z.object({
	role: z.enum(["user", "admin"]).optional(),
	search: z.string().optional(),
});

export const userRouter = router({
	getCurrent: userProcedure.query(async ({ ctx }) => {
		const id = ctx.user.id;
		return ctx.services.user.getById(id);
	}),

	getAll: adminProcedure
		.input(paginationSchema.extend(userFilterSchema.shape).optional())
		.query(async ({ ctx, input }) => {
			const options = input
				? {
						limit: input.limit,
						offset: input.offset,
						role: input.role,
						search: input.search,
					}
				: {};
			return ctx.services.user.getAll(options);
		}),

	getCount: adminProcedure
		.input(userFilterSchema.optional())
		.query(async ({ ctx, input }) => {
			return ctx.services.user.getCount({ role: input?.role });
		}),
});
