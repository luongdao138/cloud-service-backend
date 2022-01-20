import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import User from './models/User.js';
import Review from './models/Review.js';
import Industry from './models/Industry.js';
import CompanySize from './models/CompanySize.js';
import Province from './models/Province.js';
import District from './models/District.js';
import Ward from './models/Ward.js';
import JobRole from './models/JobRole.js';
import locationData from './locationData.js';
import CloudPlatform from './models/CloudPlatform.js';

export const crawlData = async () => {
  const url = 'https://clutch.co/cloud/profile/amazon-web-services-aws#review-74249';
  const res = await fetch(url);
  const html = await res.text();

  const $ = cheerio.load(html);

  $('div.views-row').each(async (i, el) => {
    const job_title = $(el)
      .find('.reviewer-col .group-fdb-interview .__relative .field:first-child')
      .text()
      .trim();
    const name = $(el)
      .find('.reviewer-col .group-fdb-interview .__relative .field:nth-child(2)')
      .text()
      .trim();
    const company_industry = $(el)
      .find('.reviewer-col .group-fdb-interview .field-name-field-fdb-user-industry .field-item')
      .text()
      .trim();
    const company_size = $(el)
      .find('.reviewer-col .group-fdb-interview .field-name-field-fdb-company-size .field-item')
      .text()
      .trim();

    let newUser = new User({
      name,
      job_title,
      picture_url: 'https://www.clipartmax.com/png/middle/424-4242023_fa-user-circle-icon.png',
      company: {
        industry: company_industry,
        size: company_size,
      },
    });
    newUser = await newUser.save();

    const heading = $(el).find('.row .project-col h2.smallfont_mobile').text().trim();
    const overall = $(el).find('.row .project-col h2.hidden-xs').text().trim();
    const published_at = $(el).find('.row .project-col h5.date').first().text().trim();
    const rating = Number(
      $(el).find('.row .review-col .field-name-field-fdb-overall-rating p.help-block').text().trim()
    );

    let newReviewDetail = new ReviewDetail({
      heading,
      overall,
      rating,
    });
    newReviewDetail = await newReviewDetail.save();

    let newReview = new Review({
      cloud_platform: '6199a2b119425b127bfbc9d4',
      review_detail: newReviewDetail._id,
      user: newUser._id,
      published_at,
      crawl: {
        web_url: url,
      },
    });
    newReview = await newReview.save();
  });
};

const companySizes = [
  {
    title: '1-10 employees',
    value: '1-10',
    type: 'small',
  },
  {
    title: '11-50 employees',
    value: '11-50',
    type: 'small',
  },
  {
    title: '51-200 employees',
    value: '201-500',
    type: 'small',
  },
  {
    title: '501-1000 employees',
    value: '501-1000',
    type: 'med',
  },
  {
    title: '1001-5000 employees',
    value: '1001-5000',
    type: 'med',
  },
  {
    title: '5001-10.000 employees',
    value: '5001-10000',
    type: 'large',
  },
  {
    title: '10.000+ employees',
    value: '10000+',
    type: 'large',
  },
];

const jobroles = [
  {
    title: 'Account Manager',
    value: 'acm',
  },
  {
    title: 'Administrative Assistant',
    value: 'ada',
  },
  {
    title: 'Administrator',
    value: 'adm',
  },
  {
    title: 'Advisor',
    value: 'adv',
  },
  {
    title: 'Analyst',
    value: 'ana',
  },
  {
    title: 'Board Member',
    value: 'bom',
  },
  {
    title: 'C-Level Executive',
    value: 'cle',
  },
  {
    title: 'Consultant',
    value: 'cst',
  },

  {
    title: 'Contributor',
    value: 'ctr',
  },
  {
    title: 'Director',
    value: 'dir',
  },
  {
    title: 'Employee',
    value: 'emp',
  },
  {
    title: 'Engineer',
    value: 'eng',
  },
  {
    title: 'Former Employee',
    value: 'fem',
  },
  {
    title: 'General Manager',
    value: 'gma',
  },
  {
    title: 'Manager',
    value: 'man',
  },
  {
    title: 'Partner',
    value: 'par',
  },
  {
    title: 'Program Manager',
    value: 'pma',
  },
  {
    title: 'Representative',
    value: 'rep',
  },
  {
    title: 'Project Manager',
    value: 'pja',
  },
  {
    title: 'Retiree',
    value: 'ret',
  },
  {
    title: 'Strategist',
    value: 'str',
  },
  {
    title: 'Supervisor',
    value: 'sup',
  },
  {
    title: 'Team Lead',
    value: 'tel',
  },
  {
    title: 'Technician',
    value: 'tec',
  },
  {
    title: 'Vice-President',
    value: 'vpr',
  },
];

const industries = [
  {
    title: 'Accounting',
    value: 'acc',
  },
  {
    title: 'Airlines/Aviation',
    value: 'air',
  },
  {
    title: 'Alternative Dispute Resolution',
    value: 'adr',
  },
  {
    title: 'Alternative Medicine',
    value: 'alm',
  },
  {
    title: 'Animation',
    value: 'ani',
  },
  {
    title: 'Apparel & Fashion',
    value: 'app',
  },
  {
    title: 'Architecture & Planning',
    value: 'arp',
  },
  {
    title: 'Arts & Crafts',
    value: 'arc',
  },
  {
    title: 'Automotive',
    value: 'aut',
  },
  {
    title: 'Banking',
    value: 'bak',
  },
  {
    title: 'Biotechnology',
    value: 'bit',
  },
  {
    title: 'Broadcast Media',
    value: 'brm',
  },
  {
    title: 'Building Meterials',
    value: 'bum',
  },
  {
    title: 'Business Supplies & Equipment',
    value: 'bse',
  },
  {
    title: 'Capital Markets',
    value: 'cam',
  },
  {
    title: 'Chemicals',
    value: 'cme',
  },
  {
    title: 'Civic & Social Organization',
    value: 'cso',
  },
  {
    title: 'Civil Engineering',
    value: 'civ',
  },
  {
    title: 'Commercial Real Estate',
    value: 'cre',
  },
  {
    title: 'Computer & Network Security',
    value: 'cns',
  },
  {
    title: 'Computer Games',
    value: 'cog',
  },
  {
    title: 'Computer Hardware',
    value: 'coh',
  },
  {
    title: 'Computer Networking',
    value: 'con',
  },
  {
    title: 'Computer Software',
    value: 'cos',
  },
  {
    title: 'Construction',
    value: 'cst',
  },
  {
    title: 'Consumer Electronics',
    value: 'coe',
  },
  {
    title: 'Consumer Goods',
    value: 'csg',
  },
  {
    title: 'Computer Services',
    value: 'cps',
  },
  {
    title: 'Cosmetic',
    value: 'coc',
  },
  {
    title: 'Defense & Space',
    value: 'des',
  },
  {
    title: 'Design',
    value: 'deg',
  },
  {
    title: 'Education Management',
    value: 'edu',
  },
  {
    title: 'E-Learning',
    value: 'ele',
  },
  {
    title: 'Electrical & Electronic Manufacturing',
    value: 'eem',
  },
  {
    title: 'Entertainment',
    value: 'ent',
  },
  {
    title: 'Environment Services',
    value: 'env',
  },
  {
    title: 'Events Services',
    value: 'evs',
  },
  {
    title: 'Executive Office',
    value: 'exo',
  },
  {
    title: 'Facilities Services',
    value: 'fas',
  },
  {
    title: 'Farming',
    value: 'far',
  },
  {
    title: 'Financial Services',
    value: 'fis',
  },
  {
    title: 'Fishery',
    value: 'fiy',
  },
  {
    title: 'Fine Art',
    value: 'fia',
  },
  {
    title: 'Food & Beverages',
    value: 'fob',
  },
  {
    title: 'Food Production',
    value: 'fop',
  },
  {
    title: 'Fundraising',
    value: 'fun',
  },
  {
    title: 'Gambling & Casinos',
    value: 'gam',
  },
  {
    title: 'Glass, Ceramics & Concrete',
    value: 'gcc',
  },
  {
    title: 'Goverment Administration',
    value: 'goa',
  },
  {
    title: 'Graphic Design',
    value: 'grd',
  },
  {
    title: 'Health, Wellness and Fitness',
    value: 'hwf',
  },
  {
    title: 'Hospital & Health Care',
    value: 'hhc',
  },
  {
    title: 'Hostipality',
    value: 'hoy',
  },
  {
    title: 'Human Resources',
    value: 'hur',
  },
  {
    title: 'Import & Export',
    value: 'ime',
  },
  {
    title: 'Individual & Family Services',
    value: 'ifs',
  },
  {
    title: 'Industrial Automation',
    value: 'ina',
  },
  {
    title: 'Infomation Technology & Services',
    value: 'its',
  },
  {
    title: 'Insurance',
    value: 'ine',
  },
  {
    title: 'International Affairs',
    value: 'iaf',
  },
  {
    title: 'International Trade & Development',
    value: 'itd',
  },
  {
    title: 'Internet',
    value: 'itt',
  },
  {
    title: 'Investment Banking',
    value: 'ivb',
  },
  {
    title: 'Judiciary',
    value: 'jud',
  },
  {
    title: 'Law Enforcement',
    value: 'lae',
  },
  {
    title: 'Law Practice',
    value: 'lop',
  },
  {
    title: 'Legal Services',
    value: 'les',
  },
  {
    title: 'Legislative Office',
    value: 'leo',
  },
  {
    title: 'Leisure, Travel & Tourism',
    value: 'ltt',
  },
  {
    title: 'Libraries',
    value: 'lib',
  },
  {
    title: 'Logistic & Supply Chain',
    value: 'lsc',
  },
  {
    title: 'Luxury Goods & Jewelry',
    value: 'lgj',
  },
  {
    title: 'Machinery',
    value: 'may',
  },
  {
    title: 'Management Consulting',
    value: 'mac',
  },
  {
    title: 'Maritime',
    value: 'mar',
  },
  {
    title: 'Market Research',
    value: 'mre',
  },
  {
    title: 'Marketing & Advitising',
    value: 'maa',
  },
  {
    title: 'Mechanical Or Industrial Engineering',
    value: 'mie',
  },
  {
    title: 'Media Production',
    value: 'mep',
  },
  {
    title: 'Medical Device',
    value: 'mdd',
  },
  {
    title: 'Medical Pratice',
    value: 'mpr',
  },
  {
    title: 'Military',
    value: 'mil',
  },
  {
    title: 'Mining & Metals',
    value: 'mim',
  },
  {
    title: 'Motion Pictures & Film',
    value: 'mpf',
  },
  {
    title: 'Museum & Institutions',
    value: 'mui',
  },
  {
    title: 'Music',
    value: 'mus',
  },
  {
    title: 'Nanotechnology',
    value: 'nan',
  },
  {
    title: 'Newspapers',
    value: 'nep',
  },
  {
    title: 'Non-profit Orginazation Management',
    value: 'nom',
  },
  {
    title: 'Oil & Energy',
    value: 'oie',
  },
  {
    title: 'Online Media',
    value: 'onm',
  },
  {
    title: 'Outsoucing/Offshoring',
    value: 'oog',
  },
  {
    title: 'Package/Freight Delivery',
    value: 'pfd',
  },
  {
    title: 'Packaging & Containers',
    value: 'pac',
  },
  {
    title: 'Paper & Forest Products',
    value: 'pfp',
  },
  {
    title: 'Performing Arts',
    value: 'pea',
  },
  {
    title: 'Pharmaceuticals',
    value: 'pha',
  },
  {
    title: 'Philanthropy',
    value: 'phi',
  },
  {
    title: 'Photography',
    value: 'pho',
  },
  {
    title: 'Plastics',
    value: 'pla',
  },
  {
    title: 'Political Organization',
    value: 'poo',
  },
  {
    title: 'Primary/Secondary Education',
    value: 'pse',
  },
  {
    title: 'Printing',
    value: 'pri',
  },
  {
    title: 'Professional Training & Coaching',
    value: 'ptc',
  },
  {
    title: 'Public Policy',
    value: 'pup',
  },
  {
    title: 'Public Relations & Communications',
    value: 'prc',
  },
  {
    title: 'Public Safety',
    value: 'pus',
  },
  {
    title: 'Publishing',
    value: 'pig',
  },
  {
    title: 'Railroad Manfacture',
    value: 'ram',
  },
  {
    title: 'Ranching',
    value: 'ran',
  },
  {
    title: 'Real Estate',
    value: 'ree',
  },
  {
    title: 'Recreational Facilities & Services',
    value: 'rfs',
  },
  {
    title: 'Religious Institutions',
    value: 'rei',
  },
  {
    title: 'Renewables & Enviroment',
    value: 'ret',
  },
  {
    title: 'Research',
    value: 'res',
  },
  {
    title: 'Restaurants',
    value: 'rtr',
  },
  {
    title: 'Retail',
    value: 'rel',
  },
  {
    title: 'Security & Investigation',
    value: 'sei',
  },
  {
    title: 'Semiconductors',
    value: 'sem',
  },
  {
    title: 'Shipbuilding',
    value: 'shi',
  },
  {
    title: 'Sporting Goods',
    value: 'spo',
  },
  {
    title: 'Sports',
    value: 'sps',
  },
  {
    title: 'Staffing & Recruiting',
    value: 'str',
  },
  {
    title: 'Telecommunications',
    value: 'tel',
  },
  {
    title: 'Textiles',
    value: 'tex',
  },
  {
    title: 'Translation & Localization',
    value: 'trl',
  },
  {
    title: 'Transportation/Trucking/Railroad',
    value: 'ttr',
  },
  {
    title: 'Utilities',
    value: 'uti',
  },
  {
    title: 'Venture Capital & Private Equity',
    value: 'vce',
  },
  {
    title: 'Veterinary',
    value: 'vet',
  },
  {
    title: 'Warehousing',
    value: 'war',
  },
  {
    title: 'Wholesale',
    value: 'who',
  },
  {
    title: 'Wire and Spirits',
    value: 'was',
  },
  {
    title: 'Wireless',
    value: 'wir',
  },
  {
    title: 'Writing & Editing',
    value: 'wre',
  },
];

export const insertData = async () => {
  await Industry.insertMany(industries);
  await CompanySize.insertMany(companySizes);
  await JobRole.insertMany(jobroles);
};

export const insertLocationData = async () => {
  let provinces = [];
  let districts = [];
  let wards = [];
  for (let province of locationData.data) {
    const newPro = {
      name: province.name,
      type: province.type,
      crawl_id: province.level1_id,
    };
    const newDis = province.level2s.map((item) => {
      const newWar = item.level3s.map((item2) => ({
        name: item2.name,
        type: item2.type,
        district_id: item.level2_id,
        crawl_id: item2.level3_id,
      }));
      wards = wards.concat(newWar);

      return {
        name: item.name,
        type: item.type,
        province_id: province.level1_id,
        crawl_id: item.level2_id,
      };
    });
    provinces.push(newPro);
    districts = districts.concat(newDis);
  }

  await Province.insertMany(provinces);
  await District.insertMany(districts);
  await Ward.insertMany(wards);
};

export const refactorClouds = async () => {
  try {
    const clouds = await CloudPlatform.find({});

    const promises = clouds.map(async (cloud) => {
      console.log(cloud);
      const reviews = await Review.find({ cloud_platform: cloud._id });
      const review_count = await Review.find({ cloud_platform: cloud._id }).countDocuments();
      let rating_distribution = [];

      for (let review of reviews) {
        const d = rating_distribution.find(
          (x) => x.name === review.review_detail.rating.toString()
        );

        if (d) {
          d.count++;
        } else {
          rating_distribution.push({ name: review.review_detail.rating.toString(), count: 1 });
        }
      }

      // const rating_average;
      const totalStars = reviews.reduce((acc, current) => {
        return acc + current.review_detail.rating;
      }, 0);
      let rating_average = review_count === 0 ? 0 : totalStars / review_count;
      rating_average = Number(rating_average.toFixed(2));
      cloud.stats = { review_count, rating_average, rating_distribution };
      await cloud.save();
      console.log({ rating_average, rating_distribution, review_count });
      console.log(typeof rating_average);
      return cloud;
    });

    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
};

export const removeCloudReviews = async () => {
  await Review.deleteMany({ cloud_platform: '6199a2b119425b127bfbc9d4' });
  console.log('Delete successfully!');
};
