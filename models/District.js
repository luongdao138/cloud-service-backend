import pkg from 'mongoose';
const { Schema, model } = pkg;

const DistrictSchema = new Schema({
  province_id: {
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

export default model('District', DistrictSchema);
