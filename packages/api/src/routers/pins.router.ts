import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adminProcedure, publicProcedure, router, userProcedure } from "../trpc";
import { z } from "zod";
import { pinCreationSchema } from "../schemas";

const PinStatus = z.enum([
	"PENDING_VERIFICATION",
	"ACTIVE",
	"ARCHIVED",
	"DELETED",
]);

export const pinRouter = router({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.services.pin.getAll();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.services.pin.getById(input.id);
		}),

	getByOwnerId: publicProcedure
		.input(z.object({ ownerId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.services.pin.getByOwnerId(input.ownerId);
		}),

	getByStatus: publicProcedure
		.input(z.object({ status: PinStatus }))
		.query(async ({ ctx, input }) => {
			return ctx.services.pin.getByStatus(input.status);
		}),

	userCreate: userProcedure
		.input(pinCreationSchema)
		.mutation(async ({ ctx, input }) => {
			return ctx.services.pin.create(
				{
					...input,
					status: PinStatus.enum.PENDING_VERIFICATION,
					ownerId: ctx.user.id,
				},
				input.tags,
				input.imageURLs,
			);
		}),
	
	adminCreate: adminProcedure
		.input(pinCreationSchema)
		.mutation(async ({ ctx, input }) => {
			return ctx.services.pin.create(
				{
					...input,
					status: PinStatus.enum.ACTIVE,
					ownerId: ctx.user.id,
				},
				input.tags,
				input.imageURLs,
			);
		}),

	update: userProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).optional(),
				description: z.string().optional(),
				latitude: z.number().min(-90).max(90).optional(),
				longitude: z.number().min(-180).max(180).optional(),
				status: PinStatus.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.services.pin.update(id, data);
		}),

	userDelete: userProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.services.pin.userDeleteById(input.id, ctx.user.id);
		}),
	
	adminDelete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.services.pin.adminDeleteById(input.id);
		}),
});

type PinRouter = typeof pinRouter;
export type PinRouterOutputs = inferRouterOutputs<PinRouter>;
export type PinRouterInputs = inferRouterInputs<PinRouter>;
