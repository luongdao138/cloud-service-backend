import pkg from 'mongoose';
const { Schema, model } = pkg;

const CrawlSchema = new Schema(
  {
    crawled_at: {
      type: Date,
      default: Date.now,
    },
    web_url: { type: String },
    api_url: { type: String },
  },
  {
    _id: false,
  }
);

export default CrawlSchema;
