import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

const templateRouter = router({
  hello: publicProcedure
    .input(z.string())
    .output(z.string())
    .query(async ({ input }) => {
      return `Hello, ${input}!`;
    }),

  goodbye: publicProcedure.output(z.string()).mutation(async () => {
    return 'Goodbye!';
  }),
});

export { templateRouter };
