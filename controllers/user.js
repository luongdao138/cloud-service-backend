import { BadRequestError } from '../errors/BadRequestError.js';
import User from '../models/User.js';
import JobRole from '../models/JobRole.js';
import CompanySize from '../models/CompanySize.js';
import Industry from '../models/Industry.js';
import format64 from '../helpers/upload.js';
import { uploadFile } from '../helpers/cloudinary.js';

const userController = {
  getUser: async (req, res) => {
    const { full } = req.query;
    if (!full) {
      return res.json({ user: req.user });
    } else {
      let user = req.user;
      const job_role = await JobRole.findById(user.job_role);
      const company_size = await CompanySize.findById(user.company.size);
      const company_industry = await Industry.findById(user.company.industry);

      console.log({ ...user });

      return res.json({
        user: {
          ...user,
          job_role,
          company: {
            ...user.company._doc,
            size: company_size,
            industry: company_industry,
          },
        },
      });
    }
  },
  updateUser: async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    if (user._id.toString() !== id?.toString()) throw new BadRequestError('Action not allowed!');

    let newUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    return res.json({ user: newUser, msg: 'Update user successfully!' });
  },
  uploadAvatar: async (req, res) => {
    console.log(req.file);
    if (req.file) {
      const { content } = format64(req.file);
      const { public_id, secure_url } = await uploadFile(content);
      // postObj.image = public_id;
      const user = req.user;
      await User.findByIdAndUpdate(user._id, { picture_url: secure_url });
      return res.json({ msg: 'Success', picture_url: secure_url });
    } else {
      throw new BadRequestError('Image is required!');
    }
  },
};

export default userController;
