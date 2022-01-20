import pkg from 'mongoose';
const { Schema, model } = pkg;

const CompanySchema = new Schema(
  {
    name: {
      type: String,
    },
    size: {
      type: Schema.Types.ObjectId,
      ref: 'CompanySize',
    },
    industry: {
      type: Schema.Types.ObjectId,
      ref: 'Industry',
    },
  },
  {
    _id: false,
  }
);

const LocationSchema = new Schema(
  {
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    match: /^[\w\.]+@([a-zA-Z0-9]+\.)+[a-zA-Z]+$/g,
  },
  password: {
    type: String,
  },
  job_title: String,
  job_role: {
    type: Schema.Types.ObjectId,
    ref: 'JobRole',
  },
  picture_url: String,
  company: CompanySchema,
  location: LocationSchema,
  is_private: {
    type: Boolean,
    default: false,
  },
  favorite_products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Cloud_Platform',
    },
  ],
});

export default model('User', UserSchema);
