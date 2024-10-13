import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
    // Get all categories.tsx, optionally filter by name or title
    getAll: protectedProcedure
        .input(z.object({ name: z.string().optional(), title: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            const categories = await ctx.db.category.findMany({
                where: {
                    ...(input.name ? { name: { contains: input.name } } : {}),
                    ...(input.title ? { title: { contains: input.title } } : {}),
                },
            });
            return categories;
        }),
    getAllInfinite: protectedProcedure
        .input(
            z.object({
                name: z.string().optional(), // Search term for name
                title: z.string().optional(), // Search term for title
                cursor: z.number().optional(), // Cursor for pagination
                limit: z.number().min(1).max(100).default(10), // Limit of items per page
            })
        )
        .query(async ({ ctx, input }) => {
            const { name, title, cursor, limit } = input;

            // Fetch the categories.tsx from the database, filtered by name and title if provided
            const categories = await ctx.db.category.findMany({
                where: {
                    AND: [
                        name ? { name: { contains: name } } : {},
                        title ? { title: { contains: title } } : {},
                    ],
                },
                take: limit + 1, // Fetch one more than the limit to check if there's more data
                cursor: cursor ? { id: cursor } : undefined, // If there's a cursor, use it to fetch the next batch
                orderBy: {
                    id: "asc", // Order by id (or any other field you'd like)
                },
            });

            // Check if there are more categories.tsx beyond the current limit
            let nextCursor: typeof cursor | undefined = undefined;
            if (categories.length > limit) {
                const nextItem = categories.pop(); // Remove the extra item from the result
                nextCursor = nextItem?.id; // Set the next cursor to the last item’s id
            }

            return {
                categories,
                nextCursor, // Provide the cursor for the next page
            };
        }),
    // Get a category by ID
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const category = await ctx.db.category.findUnique({
                where: { id: input.id },
            });
            return category;
        }),

    // Create a new category
    create: protectedProcedure
        .input(z.object({ name: z.string().min(1), title: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const category = await ctx.db.category.create({
                data: {
                    name: input.name,
                    title: input.title,
                },
            });
            return category;
        }),

    // Update a category by ID
    update: protectedProcedure
        .input(z.object({ id: z.number(), name: z.string().min(1), title: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const updatedCategory = await ctx.db.category.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    title: input.title,
                },
            });
            return updatedCategory;
        }),

    // Delete a category by ID
    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.category.delete({
                where: { id: input.id },
            });
            return { success: true };
        }),

    // Fetch (posts) by category name
    getPostsByCategoryName: protectedProcedure
        .input(z.object({ name: z.string() }))
        .query(async ({ ctx, input }) => {
            const category = await ctx.db.category.findUnique({
                where: { name: input.name },
                include: { posts: true },
            });

            if (!category) {
                throw new Error(`Category with name ${input.name} not found`);
            }

            return category.posts;
        }),
});
