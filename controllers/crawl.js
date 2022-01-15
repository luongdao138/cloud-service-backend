import CloudPlatform from '../models/CloudPlatform.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

export default {
  insertCloudPlatforms: async (req, res) => {
    const cloudData = req.body;
    let newCloudData = cloudData.map((item) => ({
      name: item.name,
      logo: item.logo,
      seo_name: item.seo_name,
      vendor: item.vendor,
      stats: {
        review_count: item.review_rating?.count || 0,
        rating_average: item.review_rating?.value || 0,
        rating_distribution: item.rating_distribution || [],
      },
      crawl: item.crawl,
    }));
    newCloudData = await CloudPlatform.insertMany(newCloudData);
    return res.json({ msg: 'Success', cloudData: newCloudData });
  },
  addUser: async (req, res) => {
    let newUser = req.body;
    newUser = new User(newUser);
    newUser = await newUser.save();

    return res.status(201).json({ user: newUser });
  },
  addReview: async (req, res) => {
    let { review, reviewDetail } = req.body;
    review = new Review({
      ...review,
      published_at: new Date(review.published_at),
      review_detail: reviewDetail,
    });
    review = await review.save();
    return res.json({ review });
  },
  getAllCloudPlatforms: async (req, res) => {
    const clouds = await CloudPlatform.find({});
    return res.json({ cloud_platforms: clouds });
  },
};
