import Province from '../models/Province.js';
import District from '../models/District.js';
import Ward from '../models/Ward.js';

import { BadRequestError } from '../errors/BadRequestError.js';

export default {
  getProvinces: async (req, res) => {
    const provinces = await Province.find({});
    return res.json({ provinces });
  },
  getDistricts: async (req, res) => {
    const { province_id } = req.query;
    if (!province_id) throw new BadRequestError('Province id is required!');

    const districts = await District.find({ province_id });
    return res.json({ districts });
  },
  getWards: async (req, res) => {
    const { district_id } = req.query;
    if (!district_id) throw new BadRequestError('District id is required!');

    const wards = await Ward.find({ district_id });
    return res.json({ wards });
  },
};
