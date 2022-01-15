import { v2 as cloudinary } from 'cloudinary';

const uploadFile = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      upload_preset: 'huong_mern',
    });
    return {
      public_id: uploadResponse.public_id,
      secure_url: uploadResponse.secure_url,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export { uploadFile };
