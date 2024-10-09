import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      bio: z.string().max(160).optional(),
      socials: z.array(
        z.object({
          title: z.string(),
          link: z.string().url(),
        })
      ).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { name, email, bio, socials } = input;

      // Update user profile information
      const updatedUser = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name,
          email,
          bio,
        },
      });

      // If socials are provided, update them
      if (socials && socials.length > 0) {
        // First, clear existing socials
        await ctx.db.socials.deleteMany({
          where: {
            userId: ctx.session.user.id,
          },
        });

        // Then, add new socials
        await ctx.db.socials.createMany({
          data: socials.map((social) => ({
            userId: ctx.session.user.id,
            title: social.title,
            link: social.link,
          })),
        });
      }

      return updatedUser;
    }),

  // Get user profile information
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        socials: true, // Include social links
      },
    });

    return user;
  }),
});
