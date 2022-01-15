import CloudPlatform from '../models/CloudPlatform.js';
import Review from '../models/Review.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import User from '../models/User.js';
import CompanySize from '../models/CompanySize.js';
import Industry from '../models/Industry.js';
import JobRole from '../models/JobRole.js';

const cloudController = {
  getCloud: async (req, res) => {
    const { id } = req.params;

    const cloud = await CloudPlatform.findById(id);
    if (!cloud) {
      throw new NotFoundError(`Can not find cloud with id ${id}`);
    }
    return res.json({
      cloud,
    });
  },
  getClouds: async (req, res) => {
    const { search, order, fields } = req.query;
    const queryObject = {};
    if (search) {
      queryObject.name = { $regex: search, $options: 'i' };
    }

    let result = CloudPlatform.find(queryObject);
    const total_results = await CloudPlatform.countDocuments(queryObject);

    if (order) {
      const sortList = order.split(',').join(' ');
      result = result.sort(sortList);
    }

    if (fields) {
      const fieldList = fields.split(',').join(' ');
      result = result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const clouds = await result;

    return res.json({
      clouds,
      pagination: {
        total_results,
        limit,
        page,
      },
    });
  },
  getCloudReviews: async (req, res) => {
    let { search, sort, companySizeList, industryList, ratingList, fields } = req.query;
    const { id } = req.params;

    const cloud = await CloudPlatform.findById(id);
    if (!cloud) {
      throw new NotFoundError(`Can not find cloud with id ${id}`);
    }

    const queryObject = { cloud_platform: id };
    if (search) {
      queryObject['$or'] = [
        { 'review_detail.heading': { $regex: search, $options: 'i' } },
        { 'review_detail.overall': { $regex: search, $options: 'i' } },
      ];
    }

    if (ratingList) {
      ratingList = ratingList.split(',').map((x) => Number(x));
      queryObject['review_detail.rating'] = { $in: ratingList };
    }

    let result = Review.find(queryObject);
    result = result.populate({
      path: 'user',
      model: User,
      populate: [
        {
          path: 'company.size',
          model: CompanySize,
          select: 'title value type -_id',
        },
        {
          path: 'company.industry',
          model: Industry,
          select: 'title value -_id',
        },
        {
          path: 'job_role',
          model: JobRole,
          select: 'title -_id',
        },
      ],
    });

    if (sort) {
      sort = sort.split(',').join(' ');
      result = result.sort(sort);
    } else {
      result = result.sort('-published_at');
    }

    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      result = result.select(fieldsList);
    }

    result = await result;

    if (!sort || sort.includes('published_at')) {
      result = result.sort((a, b) => {
        return b.published_at.getTime() - a.published_at.getTime();
      });
    }

    // filter by companySize
    if (companySizeList) {
      companySizeList = companySizeList.split(',');
      result = result.filter((x) => companySizeList.includes(x.user?.company?.size?.type));
    }

    // filter by industry
    if (industryList) {
      industryList = industryList.split(',');
      result = result.filter((x) => industryList.includes(x.user?.company?.industry?.value));
    }

    // stats
    let companySizeStats = {};
    let ratingStats = {};
    let industryStats = {};
    result.forEach((r) => {
      if (companySizeStats[r.user.company.size.type]) {
        companySizeStats[r.user.company.size.type]++;
      } else {
        companySizeStats[r.user.company.size.type] = 1;
      }
      if (ratingStats[r.review_detail.rating]) {
        ratingStats[r.review_detail.rating]++;
      } else {
        ratingStats[r.review_detail.rating] = 1;
      }

      if (industryStats[r.user.company.industry.value]) {
        industryStats[r.user.company.industry.value]++;
      } else {
        industryStats[r.user.company.industry.value] = 1;
      }
    });

    const total_results = result.length;

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    result = result.slice((page - 1) * limit, page * limit);

    return res.json({
      reviews: result,
      pagination: {
        page,
        limit,
        total_results,
      },
      stats: {
        companySizeStats,
        ratingStats,
        industryStats,
      },
    });
  },
};

export default cloudController;
