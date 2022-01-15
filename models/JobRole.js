import pkg from 'mongoose';
const { Schema, model } = pkg;

const JobRoleSchema = new Schema({
  title: {
    type: String,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
});

const JobRole = model('JobRole', JobRoleSchema);

export default JobRole;
