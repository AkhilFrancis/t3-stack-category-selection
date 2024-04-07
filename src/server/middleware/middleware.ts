/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from '@trpc/server';

export const isAuthenticated = async ({ ctx, next }: any) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });
    console.log(`user is `);
    console.log(user);
      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found.' });
      }
    
      if (!user.isVerified) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'User is not verified.' });
      }
    return next();
  };
