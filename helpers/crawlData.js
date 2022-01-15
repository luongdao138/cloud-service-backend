import fetch from 'node-fetch';

const getData = async () => {
  try {
    const res = await fetch(
      'https://www.gartner.com/reviews/api2-proxy/reviews/market/vendor/filter?vendorSeoName=amazon-web-services&marketSeoName=public-cloud-iaas&productSeoName=amazon-web-services&startIndex=1&endIndex=100&filters=%7B%22months%22%3A%5B%5D%2C%22products%22%3A%5B%5D%2C%22reviewRating%22%3A%5B%5D%2C%22companySize%22%3A%5B%5D%2C%22industry%22%3A%5B%5D%2C%22deploymentRegion%22%3A%5B%5D%2C%22jobRole%22%3A%5B%5D%2C%22tags%22%3A%5B%5D%7D&sort=-helpfulness'
    );
    const data = await res.json();
  } catch (error) {
    console.log(error);
  }
};

getData();
