/**
 * This file contains the root router of your tRPC-backend
 */
import { router, publicProcedure } from '../trpc';
import { userRouter } from './user';
import { whatsappRouter } from './whatsapp';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  whatsapp: whatsappRouter,

  user: userRouter,

  randomNumber: publicProcedure.subscription(async function* () {
    while (true) {
      yield Math.random();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }),
});

export type AppRouter = typeof appRouter;
