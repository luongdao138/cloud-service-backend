import dotEnv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './database/connectDB.js';
import 'express-async-errors';

// routes
import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
import errorHandlerMiddleware from './middlewares/errorHandler.js';
import crawlRouter from './routes/crawl.js';
import cloudRouter from './routes/clouds.js';
import statsRouter from './routes/stats.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import locationRouter from './routes/location.js';
import reviewRouter from './routes/review.js';
// import { refactorClouds } from './crawlData.js';

dotEnv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500'] })
);

console.log(process.env.CLOUD_API_KEY);

app.get('/', (req, res) => {
  return res.json({
    message: 'Hello cloud service',
  });
});

// apply route middlewares
app.use('/api/v1/crawl', crawlRouter);
app.use('/api/v1/clouds', cloudRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use('*', notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const start = async function () {
  try {
    await connectDB(process.env.MONGODB_URI);
    // await insertLocationData();
    // await refactorClouds();
    // await removeCloudReviews();
    await app.listen(PORT);
    console.log(`server listening on port ${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
