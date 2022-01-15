import pkg from 'mongoose';
const { Schema, model } = pkg;

const ProvinceSchema = new Schema({
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

export default model('Province', ProvinceSchema);
