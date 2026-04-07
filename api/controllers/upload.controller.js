import cloudinary from '../config/cloudinary.js';
import { errorHandler } from '../utils/error.js';

export const uploadImage = async (req, res, next) => {
  try {
    const { file, folder = 'mern-estate' } = req.body;

    if (!file || typeof file !== 'string') {
      return next(errorHandler(400, 'Image file is required.'));
    }

    if (!file.startsWith('data:image/')) {
      return next(errorHandler(400, 'Only image uploads are supported.'));
    }

    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'image',
    });

    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};
