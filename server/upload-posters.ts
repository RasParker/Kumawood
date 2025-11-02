
import { cloudinary } from './cloudinary';
import * as fs from 'fs';
import * as path from 'path';

const posterMappings = [
  { file: 'City_Lights_Urban_Drama_1fb774a4.png', id: 'pop6', title: 'City Lights' },
  { file: 'Hidden_Secrets_Mystery_Thriller_acdb21a0.png', id: 'new2', title: 'Hidden Secrets' },
  { file: 'Night_Tales_Supernatural_Thriller_088491d2.png', id: 'new3', title: 'Night Tales' },
  { file: 'Family_Ties_Drama_d83a84fc.png', id: 'new4', title: 'Family Ties' },
  { file: 'Street_Dreams_Action_Drama_83359a2b.png', id: 'new5', title: 'Street Dreams' },
  { file: 'Love_&_War_Romance_e1086570.png', id: 'rank1', title: 'Love & War' },
  { file: 'The_Royal_Court_Drama_1aee74f1.png', id: 'rank2', title: 'The Royal Court' },
  { file: 'Sunset_Boulevard_Romance_4143283a.png', id: 'rank3', title: 'Sunset Boulevard' },
  { file: 'The_Hustle_Action_Drama_3a083bee.png', id: 'rank4', title: 'The Hustle' },
  { file: 'Broken_Promises_Drama_5324c50e.png', id: 'rank5', title: 'Broken Promises' },
  { file: 'Hearts_Entangled_Romance_df4d7bdb.png', id: 'rank6', title: 'Hearts Entangled' },
  { file: 'The_Village_Chief_Drama_c8df332f.png', id: 'rank7', title: 'The Village Chief' },
  { file: 'Midnight_Call_Thriller_e63a2423.png', id: 'rank8', title: 'Midnight Call' },
  { file: 'Golden_Dreams_Inspirational_4da97a2d.png', id: 'rank9', title: 'Golden Dreams' },
  { file: "River's_Edge_Family_Drama_04b580d3.png", id: 'rank10', title: "River's Edge" },
  { file: 'Kumasi_Love_Romance_Comedy_dbc1dcb2.png', id: 'kuma2', title: 'Kumasi Love' },
  { file: 'The_Akan_Warrior_Action_cabc90fb.png', id: 'kuma3', title: 'The Akan Warrior' },
  { file: 'Traditional_Healer_Drama_4f419a3a.png', id: 'kuma5', title: 'Traditional Healer' },
  { file: 'Market_Queen_Drama_e759c5ca.png', id: 'kuma6', title: 'Market Queen' },
  { file: 'Abuja_Chronicles_Political_a014a6d7.png', id: 'naija3', title: 'Abuja Chronicles' },
  { file: 'Igbo_Billionaire_Drama_72e3367a.png', id: 'naija4', title: 'Igbo Billionaire' },
  { file: 'Port_Harcourt_Nights_Thriller_b0e57159.png', id: 'naija5', title: 'Port Harcourt Nights' },
  { file: 'Empire_Rising_Historical_abb8e0ad.png', id: 'coming1', title: 'Empire Rising' },
  { file: 'Cyber_Lagos_Sci-Fi_53be7e8f.png', id: 'coming2', title: 'Cyber Lagos' },
  { file: 'Sahara_Crossing_Adventure_eb42d9e2.png', id: 'coming3', title: 'Sahara Crossing' },
  { file: 'Island_Mysteries_Thriller_a47c3ab8.png', id: 'coming4', title: 'Island Mysteries' },
];

interface UploadResult {
  id: string;
  title: string;
  url: string;
  publicId: string;
}

async function uploadPoster(filePath: string, seriesId: string, title: string): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'afrishorts/posters',
      public_id: `${seriesId}_${title.replace(/\s+/g, '_').replace(/'/g, '')}`,
      resource_type: 'image',
      overwrite: true,
    });

    console.log(`✓ Uploaded ${title}: ${result.secure_url}`);

    return {
      id: seriesId,
      title,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`✗ Failed to upload ${title}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Starting poster upload to Cloudinary...\n');

  const results: UploadResult[] = [];
  const imagesDir = path.join(process.cwd(), 'attached_assets', 'generated_images');

  for (const mapping of posterMappings) {
    const filePath = path.join(imagesDir, mapping.file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠ Skipping ${mapping.title}: File not found`);
      continue;
    }

    try {
      const result = await uploadPoster(filePath, mapping.id, mapping.title);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${mapping.title}`);
    }
  }

  console.log(`\n✅ Successfully uploaded ${results.length} of ${posterMappings.length} posters\n`);

  console.log('URL Mapping:');
  console.log(JSON.stringify(results, null, 2));

  const outputFile = path.join(process.cwd(), 'poster-urls.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n📝 URLs saved to: ${outputFile}`);
}

main().catch(console.error);
