import pkg from 'mongoose';
import CrawlSchema from './CrawlSchema.js';
const { Schema, model } = pkg;

const DetailSchema = new Schema(
  {
    name: { type: String, required: true },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const StatsSchema = new Schema(
  {
    review_count: {
      type: Number,
      default: 0,
    },
    rating_average: {
      type: Number,
      default: 0,
    },
    rating_distribution: [DetailSchema],
  },
  {
    _id: false,
  }
);

const VendorSchema = new Schema(
  {
    name: String,
    seoName: String,
  },
  {
    _id: false,
  }
);

const CloudPlatformSchema = new Schema({
  name: {
    type: String,
    maxlength: 100,
    minlength: 2,
    trim: true,
    required: true,
  },
  logo: String,
  vendor: VendorSchema,
  seo_name: String,
  stats: StatsSchema,
  crawl: CrawlSchema,
});

export default model('Cloud_Platform', CloudPlatformSchema);
