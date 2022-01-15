import pkg from 'mongoose';
const { Schema, model } = pkg;

const CompanySizeSchema = new Schema({
  title: {
    type: String,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['small', 'med', 'large'],
    default: 'small',
  },
});

const CompanySize = model('CompanySize', CompanySizeSchema);

export default CompanySize;
