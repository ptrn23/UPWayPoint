import { privateProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

const PinStatus = z.enum(["PENDING_VERIFICATION", "ACTIVE", "ARCHIVED", "DELETED"]);

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

    create: privateProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().optional(),
                latitude: z.number().min(-90).max(90),
                longitude: z.number().min(-180).max(180),
                status: PinStatus.optional(),
                ownerId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.services.pin.create(input);
        }),

    update: privateProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).optional(),
                description: z.string().optional(),
                latitude: z.number().min(-90).max(90).optional(),
                longitude: z.number().min(-180).max(180).optional(),
                status: PinStatus.optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.services.pin.update(id, data);
        }),

    delete: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.services.pin.deleteById(input.id);
        }),
});