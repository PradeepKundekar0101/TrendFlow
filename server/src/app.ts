// app.ts
import express from "express";
import { balanceRouter } from "./routes/balance";
import { userRouter } from "./routes/user";
import { onrampRouter } from "./routes/onramp";
import { symbolRouter } from "./routes/symbol";
import { orderBookRouter } from "./routes/orderBook";
import { orderRouter } from "./routes/order";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Options Trading App");
});

app.use('/api/v1/balance', balanceRouter);
app.use('/api/v1/orderbook', orderBookRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/onramp', onrampRouter);
app.use('/api/v1/symbol', symbolRouter);
app.use('/api/v1/order', orderRouter);

export default app;