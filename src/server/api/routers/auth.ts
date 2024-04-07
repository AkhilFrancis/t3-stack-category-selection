import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { generateToken } from '~/server/utils/jwt';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(5),
    }))
    .mutation(async ({ ctx, input }) => {
      const userExists = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (userExists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const otp = "123456";
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          otp,
        },
      });
      const token = generateToken(user.id);
      return { id: user.id, email: user.email, token };
    }),
  
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found with this email',
        });
      }

      const passwordValid = await bcrypt.compare(input.password, user.password);
      if (!passwordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid password',
        });
      }

      const token = generateToken(user.id);
      return { id: user.id, email: user.email, token };
    }),
    verifyOtp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      otp: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Find the user by email
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
  
      // Check if OTP matches and verify the user
      if (user.otp === input.otp) {
        await ctx.db.user.update({
          where: { email: input.email },
          data: { isVerified: true },
        });
  
        // Generate a token now that the user is verified
        const token = generateToken(user.id);
        return { success: true, token };
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid OTP',
        });
      }
    }),
  
});

export type AuthRouter = typeof authRouter;
