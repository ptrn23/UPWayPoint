import { privateProcedure, router } from "../trpc";

export const userRouter = router({
	getCurrent: privateProcedure.query(async ({ ctx }) => {
		const id = ctx.user.id;
		return ctx.services.user.getById(id);
	}),
});
