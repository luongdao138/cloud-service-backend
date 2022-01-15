import Industry from '../models/Industry.js';
import CompanySize from '../models/CompanySize.js';
import JobRole from '../models/JobRole.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

const statsController = {
  getFilters: async (req, res) => {
    const companySizes = await CompanySize.find({});
    const industries = await Industry.find({});
    const jobRoles = await JobRole.find({});
    return res.json({ companySizes, industries, jobRoles });
  },
  getStats: async (req, res) => {
    const reviewCount = await Review.countDocuments({});
    const userCount = await User.countDocuments({});
    return res.json({
      reviewCount,
      userCount,
    });
  },
};

export default statsController;
