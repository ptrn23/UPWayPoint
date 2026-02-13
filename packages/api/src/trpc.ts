import { initTRPC, TRPCError } from "@trpc/server";
import { services } from "./services";
import { auth } from "@repo/auth";

export async function createContext(opts: { req: Request }) {
	const data = await auth.api.getSession({ headers: opts.req.headers });
	if (!data?.session)
		throw new TRPCError({
			message: "Session does not exist",
			code: "BAD_REQUEST",
		});

	try {
		const user = await services.user.getById(data?.session.userId);

		return {
			user,
			services,
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>;

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.user)
		throw new TRPCError({
			message: "User is not logged in",
			code: "UNAUTHORIZED",
		});
	return next({
		// we need to do all this because otherwise the user will be undefined
		ctx: {
			...ctx,
			user: ctx.user,
		},
	});
});
