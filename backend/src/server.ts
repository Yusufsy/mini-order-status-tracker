import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { orderRouter } from './router/order';
import { t } from './trpc';

const appRouter = t.router({
  orders: orderRouter,
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'], 
    credentials: true, 
  }));  

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  }),
);

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
