
import { storage } from './storage';

const posterMappings = {
  'African Queen': 'African_Queen_romance_poster_a9f4e1b2',
  'Village Comedy': 'Village_Comedy_comedy_poster_7c3d9e5f',
  'Yoruba Romance': 'Yoruba_Romance_romance_poster_4b8a2c1d',
  'Modern Marriage': 'Modern_Marriage_drama_poster_6e9f3a8b',
  'Calabar Beauty': 'Calabar_Beauty_romance_poster_2d7c4f9e',
};

async function updatePosterUrls(cloudinaryUrls: Record<string, string>) {
  try {
    const allSeries = await storage.getSeries();
    
    for (const [seriesTitle, publicId] of Object.entries(posterMappings)) {
      const series = allSeries.find(s => s.title === seriesTitle);
      
      if (series) {
        // Find the Cloudinary URL for this poster
        const posterFileName = Object.keys(cloudinaryUrls).find(key => 
          key.startsWith(publicId)
        );
        
        if (posterFileName) {
          const cloudinaryUrl = cloudinaryUrls[posterFileName];
          
          await storage.updateSeries(series.id, {
            posterUrl: cloudinaryUrl,
          });
          
          console.log(`✓ Updated ${seriesTitle} with Cloudinary URL: ${cloudinaryUrl}`);
        } else {
          console.log(`✗ No Cloudinary URL found for ${seriesTitle}`);
        }
      } else {
        console.log(`✗ Series not found: ${seriesTitle}`);
      }
    }
    
    console.log('\n✓ All poster URLs updated successfully!');
  } catch (error) {
    console.error('Error updating poster URLs:', error);
  }
}

// Example usage - you'll need to paste the Cloudinary URLs here after running upload-posters.ts
const cloudinaryUrls = {
  // Paste the URLs from upload-posters.ts output here
  // Example format:
  // 'African_Queen_romance_poster_a9f4e1b2.png': 'https://res.cloudinary.com/...',
};

updatePosterUrls(cloudinaryUrls);
