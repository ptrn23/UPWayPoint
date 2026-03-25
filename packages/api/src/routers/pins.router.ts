import { inferRouterInputs, inferRouterOutputs, TRPCError } from "@trpc/server";
import {
	adminProcedure,
	publicProcedure,
	router,
	userProcedure,
} from "../trpc";
import { z } from "zod";
import { pinCreationSchema } from "../schemas";

const PinStatus = z.enum([
	"PENDING_VERIFICATION",
	"ACTIVE",
	"ARCHIVED",
	"DELETED",
]);

const paginationSchema = z.object({
	limit: z.number().min(1).max(100).default(50),
	offset: z.number().min(0).default(0),
	status: PinStatus.optional(),
	ownerId: z.string().optional(),
	search: z.string().optional(),
});

const pinFilterSchema = z.object({
	status: PinStatus.optional(),
	ownerId: z.string().optional(),
	search: z.string().optional(),
});

export const pinRouter = router({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.services.pin.getAll();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.services.pin.getById(input.id);
		}),

	getSimpleById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.services.pin.getSimpleById(input.id);
		}),

	getCurrentUsersPins: userProcedure.query(async ({ ctx }) => {
		return ctx.services.pin.getByOwnerId(ctx.user.id);
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
				tags: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, tags, ...data } = input;
			return ctx.services.pin.requestUpdate(id, ctx.user.id, data, tags);
		}),

	applyUpdate: adminProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input;
			return ctx.services.pin.applyUpdate(id, ctx.user.id);
		}),

	rejectUpdate: adminProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input;
			return ctx.services.pin.rejectUpdate(id, ctx.user.id);
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

	getAllAdmin: adminProcedure
		.input(paginationSchema.extend(pinFilterSchema.shape).optional())
		.query(async ({ ctx, input }) => {
			const options = input
				? {
						limit: input.limit,
						offset: input.offset,
						status: input.status,
						ownerId: input.ownerId,
						search: input.search,
					}
				: {};
			return ctx.services.pin.getAllAdmin(options);
		}),

	getCount: adminProcedure
		.input(pinFilterSchema.optional())
		.query(async ({ ctx, input }) => {
			return ctx.services.pin.getCount({ status: input?.status });
		}),

	getStatusCounts: adminProcedure.query(async ({ ctx }) => {
		return ctx.services.pin.getStatusCounts();
	}),

	approve: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.services.pin.approvePin(input.id, ctx.user.id);
		}),

	reject: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.services.pin.rejectPin(input.id, ctx.user.id);
		}),

	// Admin update - can update any pin
	adminUpdate: adminProcedure
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
			return ctx.services.pin.adminUpdate(id, ctx.user.id, data);
		}),
});

type PinRouter = typeof pinRouter;
export type PinRouterOutputs = inferRouterOutputs<PinRouter>;
export type PinRouterInputs = inferRouterInputs<PinRouter>;
