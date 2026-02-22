import { router, userProcedure } from "../trpc";

export const userRouter = router({
	getCurrent: userProcedure.query(async ({ ctx }) => {
		const id = ctx.user.id;
		return ctx.services.user.getById(id);
	}),
});
