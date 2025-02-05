import { router, publicProcedure } from '../trpc';
import { prisma } from '../prisma';
import { z } from 'zod';

const userRouter = router({
  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });
      return { id: user.id };
    }),
});

export { userRouter };
