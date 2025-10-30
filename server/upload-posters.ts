
import { cloudinary } from './cloudinary';
import fs from 'fs';
import path from 'path';

async function uploadPoster(filePath: string, publicId: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'afrishorts/images',
      public_id: publicId,
      resource_type: 'image',
    });
    console.log(`Uploaded ${publicId}: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${publicId}:`, error);
    return null;
  }
}

async function uploadAllPosters() {
  const postersDir = path.join(__dirname, '../client/public/posters');
  const files = fs.readdirSync(postersDir);
  
  const urls: Record<string, string> = {};
  
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const filePath = path.join(postersDir, file);
      const publicId = file.replace(/\.[^/.]+$/, ''); // Remove extension
      const url = await uploadPoster(filePath, publicId);
      if (url) {
        urls[file] = url;
      }
    }
  }
  
  console.log('\n=== All Cloudinary URLs ===');
  console.log(JSON.stringify(urls, null, 2));
}

uploadAllPosters();
