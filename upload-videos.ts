import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as fs from 'fs';

const videoDir = path.join(process.cwd(), 'temp_videos');
const videoFiles = fs.readdirSync(videoDir).filter(f => f.startsWith('episode') && f.endsWith('.mp4'));

async function uploadVideos() {
  const results = [];
  
  for (const file of videoFiles) {
    const filePath = path.join(videoDir, file);
    const episodeNum = file.match(/episode(\d+)/)?.[1] || '0';
    const publicId = `episode${episodeNum}_sample`;
    
    try {
      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'afrishorts/videos',
        public_id: publicId,
        resource_type: 'video',
        overwrite: true,
      });
      
      results.push({
        episode: parseInt(episodeNum),
        file: file,
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
      });
      
      console.log(`✓ Uploaded: ${publicId} (${result.duration}s)`);
    } catch (error) {
      console.error(`✗ Failed to upload ${file}:`, error);
    }
  }
  
  // Save results to JSON
  fs.writeFileSync('video-urls.json', JSON.stringify(results, null, 2));
  console.log('\n✅ All videos uploaded! URLs saved to video-urls.json');
  console.log(JSON.stringify(results, null, 2));
}

uploadVideos();
