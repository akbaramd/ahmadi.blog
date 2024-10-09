import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const tagRouter = createTRPCRouter({
    // Get all tags, optionally filter by name or title
    getAll: protectedProcedure
        .input(z.object({ name: z.string().optional(), title: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            const tags = await ctx.db.tag.findMany({
                where: {
                    ...(input.name ? { name: { contains: input.name } } : {}),
                    ...(input.title ? { title: { contains: input.title } } : {}),
                },
            });
            return tags;
        }),


    // Get a tag by ID
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const tag = await ctx.db.tag.findUnique({
                where: { id: input.id },
            });
            return tag;
        }),

    // Create a new tag
    create: protectedProcedure
        .input(z.object({ name: z.string().min(1), title: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const tag = await ctx.db.tag.create({
                data: {
                    name: input.name,
                    title: input.title,
                },
            });
            return tag;
        }),

    // Update a tag by ID
    update: protectedProcedure
        .input(z.object({ id: z.number(), name: z.string().min(1), title: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const updatedTag = await ctx.db.tag.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    title: input.title,
                },
            });
            return updatedTag;
        }),

    // Delete a tag by ID
    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.tag.delete({
                where: { id: input.id },
            });
            return { success: true };
        }),

    // Fetch posts by tag name
    getPostsByTagName: protectedProcedure
        .input(z.object({ name: z.string() }))
        .query(async ({ ctx, input }) => {
            const tag = await ctx.db.tag.findUnique({
                where: { name: input.name },
                include: { posts: true },
            });

            if (!tag) {
                throw new Error(`Tag with name ${input.name} not found`);
            }

            return tag.posts;
        }),
});
