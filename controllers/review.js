import { BadRequestError } from '../errors/BadRequestError.js';
import CloudPlatform from '../models/CloudPlatform.js';
import Review from '../models/Review.js';

export default {
  addReview: async (req, res) => {
    const user = req.user;

    let review = await Review.findOne({
      user: user._id,
      cloud_platform: req.body.cloud_platform,
    });
    if (review) throw new BadRequestError("You've already reviewed this cloud service!");

    let cloud = await CloudPlatform.findById(req.body.cloud_platform);
    if (!cloud) throw new BadRequestError('Cloud does not exist!');

    review = new Review({ ...req.body, user: user._id });

    review = await review.save();

    // cập nhật lại cloud
    let oldStats = cloud.stats;
    console.log(oldStats);
    oldStats.review_count++;

    let isFound = false;
    oldStats.rating_distribution = oldStats.rating_distribution.map((x) => {
      if (x.name === review.review_detail.rating.toString()) {
        x.count++;
        isFound = true;
      }
      return x;
    });

    if (!isFound)
      oldStats.rating_distribution.push({ name: review.review_detail.rating.toString(), count: 1 });

    const totalRating = oldStats.review_count;
    const totalStars = oldStats.rating_distribution.reduce((acc, current) => {
      return acc + Number(current.name) * current.count;
    }, 0);
    const rating_average = totalStars / totalRating;
    oldStats.rating_average = Number(rating_average.toFixed(2));

    cloud.stats = oldStats;

    await cloud.save();

    return res.status(201).json({ review });
  },
  getReviewsOfUser: async (req, res) => {
    const user = req.user;

    const reviews = await Review.find({ user: user._id }).populate({
      path: 'cloud_platform',
      model: CloudPlatform,
      select: '_id name logo',
    });

    return res.json({ reviews });
  },
  deleteReview: async (req, res) => {
    const user = req.user;
    const id = req.params.id;

    let review = await Review.findById(id);
    if (!review) throw new BadRequestError('Cloud service not found!');

    if (user._id.toString() !== review.user.toString()) {
      throw new BadRequestError('Action not allowed!');
    }

    let cloud = await CloudPlatform.findById(review.cloud_platform);
    let oldStats = cloud.stats;
    oldStats.review_count--;

    oldStats.rating_distribution = oldStats.rating_distribution.map((x) => {
      if (x.name === review.review_detail.rating.toString()) {
        x.count--;
      }
      return x;
    });

    const totalRating = oldStats.review_count;
    const totalStars = oldStats.rating_distribution.reduce((acc, current) => {
      return acc + Number(current.name) * current.count;
    }, 0);
    const rating_average = totalRating === 0 ? 0 : totalStars / totalRating;
    oldStats.rating_average = Number(rating_average.toFixed(2));

    cloud.stats = oldStats;

    await cloud.save();

    await Review.findByIdAndDelete(id);

    return res.json({ msg: 'Success' });
  },
  getReviewDetail: async (req, res) => {
    const id = req.params.id;

    let review = await Review.findById(id);
    if (!review) throw new BadRequestError('Cloud service not found!');

    return res.json({ review });
  },
  updateReview: async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    let review = await Review.findById(id);
    if (!review) throw new BadRequestError('Cloud service not found!');

    let cloud = await CloudPlatform.findById(review.cloud_platform);

    if (user._id.toString() !== review.user.toString()) {
      throw new BadRequestError('Action not allowed!');
    }
    const oldRating = review.review_detail.rating;
    review = await Review.findByIdAndUpdate(id, req.body, { new: true });

    let oldStats = cloud.stats;

    let isFound = false;
    oldStats.rating_distribution = oldStats.rating_distribution.map((x) => {
      if (x.name === review.review_detail.rating.toString()) {
        x.count++;
        isFound = true;
      }
      if (x.name === oldRating.toString()) {
        x.count--;
      }
      return x;
    });

    if (!isFound)
      oldStats.rating_distribution.push({ name: review.review_detail.rating.toString(), count: 1 });

    const totalRating = oldStats.review_count;
    const totalStars = oldStats.rating_distribution.reduce((acc, current) => {
      return acc + Number(current.name) * current.count;
    }, 0);
    const rating_average = totalStars / totalRating;
    oldStats.rating_average = Number(rating_average.toFixed(2));

    cloud.stats = oldStats;

    await cloud.save();

    return res.json({ review });
  },
};
