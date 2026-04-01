import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const tagRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.services.tag.getAll();
  }),
});

type TagRouter = typeof tagRouter;
export type TagRouterOutputs = inferRouterOutputs<TagRouter>;
export type TagRouterInputs = inferRouterInputs<TagRouter>;
