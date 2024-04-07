import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { isAuthenticated } from '~/server/middleware/middleware';

export const categoryRouter = createTRPCRouter({
  list: publicProcedure
    .use(isAuthenticated)
    .input(z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.pageSize;
      const take = input.pageSize;

      const [categories, total] = await ctx.db.$transaction([
        ctx.db.category.findMany({
          take,
          skip,
        }),
        ctx.db.category.count(),
      ]);

      const totalPages = Math.ceil(total / input.pageSize);
      return { categories, totalPages };
    }),

  toggleSelection: publicProcedure
    .use(isAuthenticated)
    .input(z.object({
      categoryId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.userId;
      const selection = await ctx.db.userCategory.findFirst({
        where: {
          userId: userId,
          categoryId: input.categoryId,
        },
      });
      const category = await ctx.db.category.findFirst({
        where: {
          id: input.categoryId,
        },
      });
      if(!category) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No category found with this id',
          });
      }
      if (selection) {
        await ctx.db.userCategory.delete({
          where: { id: selection.id },
        });
      } else {
        await ctx.db.userCategory.create({
          data: {
            userId: userId!,
            categoryId: input.categoryId,
          },
        });
      }

      return { success: true };
    }),

  getUserCategories: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
      
    // Fetch categories that the user has selected
    const selectedCategories = await ctx.db.userCategory
        .findMany({
        where: {
            userId: userId,
        },
          select: {
            category: true,
          },
        });
      
        // Return the list of categories
        return selectedCategories.map((uc) => uc.category);
      }),
});

export type CategoryRouter = typeof categoryRouter;
