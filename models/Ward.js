import pkg from 'mongoose';
const { Schema, model } = pkg;

const WardSchema = new Schema({
  district_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: String,
  crawl_id: {
    type: String,
    unique: true,
  },
});

export default model('Ward', WardSchema);
