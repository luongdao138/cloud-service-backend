import pkg from 'mongoose';
const { Schema, model } = pkg;
import CrawlSchema from './CrawlSchema.js';

const ReviewDetailSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    overall: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cloud_platform: {
    type: Schema.Types.ObjectId,
    ref: 'CloudPlatform',
    required: true,
  },
  review_detail: ReviewDetailSchema,
  published_at: {
     type: Date,
     default: Date.now
  },
  crawl: CrawlSchema,
});

export default model('Review', ReviewSchema);
