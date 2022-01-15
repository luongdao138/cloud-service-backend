import pkg from 'mongoose';
const { Schema, model } = pkg;

const IndustrySchema = new Schema({
  title: {
    type: String,
  },
  value: {
    type: String,
    unique: true,
    required: true,
  },
});

const Industry = model('Industry', IndustrySchema);

export default Industry;
