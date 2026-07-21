import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret',
  secure: true,
});

export async function uploadImageBuffer(buffer: Buffer, folder = 'rccg-lp17'): Promise<string> {
  if (!process.env.CLOUDINARY_API_KEY) {
    console.warn('CLOUDINARY_API_KEY not set, using mock upload url');
    return 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
}
