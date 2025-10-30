import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface MockSeries {
  id: string;
  title: string;
  posterUrl: string;
  videoUrl: string;
  episodeCount: number;
  genre: string;
  rating: number;
  description: string;
  year: number;
  tags?: string[];
  rank?: number;
  isNew?: boolean;
  releaseDate?: string;
}

interface MockComingSoonSeries {
  id: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
  description: string;
  genre: string;
}

async function clearExistingData() {
  console.log('Clearing existing data...');

  await supabase.from('consumption_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('reward_coin_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('purchase_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('user_tasks_completed').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('user_points_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('daily_reward_claims').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('episodes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('series').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('redeemable_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Existing data cleared!');
}

async function seedSeries(seriesData: MockSeries[], category: string) {
  console.log(`Seeding ${category} series...`);

  for (const series of seriesData) {
    const { data: insertedSeries, error: seriesError } = await supabase
      .from('series')
      .insert({
        title: series.title,
        synopsis: series.description,
        poster_url: series.posterUrl,
        is_coming_soon: false,
        release_date: series.releaseDate,
        genre: series.genre,
        rating: series.rating,
        year: series.year,
        tags: series.tags || [],
        rank: series.rank,
        is_new: series.isNew || false,
      })
      .select()
      .single();

    if (seriesError) {
      console.error(`Error inserting series ${series.title}:`, seriesError);
      continue;
    }

    console.log(`  ✓ Inserted: ${series.title}`);

    const episodes = [];
    for (let i = 1; i <= series.episodeCount; i++) {
      episodes.push({
        series_id: insertedSeries.id,
        episode_number: i,
        title: `Episode ${i}`,
        video_url: series.videoUrl,
      });
    }

    const { error: episodesError } = await supabase
      .from('episodes')
      .insert(episodes);

    if (episodesError) {
      console.error(`Error inserting episodes for ${series.title}:`, episodesError);
    } else {
      console.log(`    Added ${episodes.length} episodes`);
    }
  }
}

async function seedComingSoon(comingSoonData: MockComingSoonSeries[]) {
  console.log('Seeding coming soon series...');

  for (const series of comingSoonData) {
    const { error } = await supabase
      .from('series')
      .insert({
        title: series.title,
        synopsis: series.description,
        poster_url: series.posterUrl,
        is_coming_soon: true,
        release_date: series.releaseDate,
        genre: series.genre,
        rating: null,
        year: null,
        tags: [],
        rank: null,
        is_new: false,
      });

    if (error) {
      console.error(`Error inserting coming soon series ${series.title}:`, error);
    } else {
      console.log(`  ✓ Inserted: ${series.title}`);
    }
  }
}

async function seedRedeemableItems() {
  console.log('Seeding redeemable items...');

  const items = [
    {
      title: '5-Day Membership Extension',
      points_cost: 1000,
      reward_type: 'membership',
      reward_value: 5,
    },
    {
      title: '100 Coins',
      points_cost: 500,
      reward_type: 'coins',
      reward_value: 100,
    },
    {
      title: '500 Coins',
      points_cost: 2000,
      reward_type: 'coins',
      reward_value: 500,
    },
  ];

  const { error } = await supabase.from('redeemable_items').insert(items);

  if (error) {
    console.error('Error inserting redeemable items:', error);
  } else {
    console.log(`  ✓ Inserted ${items.length} redeemable items`);
  }
}

async function main() {
  console.log('Starting database seeding...\n');
  console.log('⚠️  Make sure you have run the migration SQL in your Supabase SQL Editor first!');
  console.log('    Location: server/migrations/001_initial_schema.sql\n');

  await clearExistingData();

  const popularSeries: MockSeries[] = [
    { id: 'pop1', title: 'The Kingdom', posterUrl: '/posters/The_Kingdom_historical_drama_poster_3d8b72d2.png', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 120, genre: 'Historical Drama', rating: 4.8, description: 'An epic tale of power, betrayal, and legacy', year: 2024, tags: ['Drama', 'Historical'] },
    { id: 'pop2', title: 'Love in Lagos', posterUrl: '/posters/Love_in_Lagos_romance_poster_c762e8e9.png', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 95, genre: 'Romance', rating: 4.6, description: 'Modern love story set in bustling Lagos', year: 2024, tags: ['Romance', 'Urban'] },
    { id: 'pop3', title: 'Night Tales', posterUrl: '/posters/Night_Tales_supernatural_thriller_poster_264c2306.png', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 87, genre: 'Supernatural Thriller', rating: 4.7, description: 'Mysterious happenings after dark', year: 2024, tags: ['Thriller', 'Supernatural'] },
    { id: 'pop4', title: 'Street Tales', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_4.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 110, genre: 'Drama', rating: 4.5, description: 'Stories from the streets of Accra', year: 2024, tags: ['Drama', 'Urban'] },
    { id: 'pop5', title: 'African Queen', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_5.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 78, genre: 'Romance', rating: 4.9, description: 'A modern retelling of classic African royalty tales', year: 2024, tags: ['Romance', 'Historical'] },
    { id: 'pop6', title: 'City Lights', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_6.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 92, genre: 'Drama', rating: 4.4, description: 'Life and ambitions in the big city', year: 2024, tags: ['Drama', 'Urban'] },
  ];

  const newSeries: MockSeries[] = [
    { id: 'new1', title: 'Desert Rose', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_landscape_1.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 45, genre: 'Romance', rating: 4.7, description: 'A love story blooming in the Sahara', year: 2025, isNew: true, tags: ['Romance', 'Adventure'] },
    { id: 'new2', title: 'Hidden Secrets', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_landscape_2.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 38, genre: 'Mystery', rating: 4.6, description: 'Uncovering dark family secrets in Cape Town', year: 2025, isNew: true, tags: ['Mystery', 'Thriller'] },
    { id: 'new3', title: 'Night Tales', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_landscape_3.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 52, genre: 'Thriller', rating: 4.8, description: 'Supernatural encounters in Nairobi after dark', year: 2025, isNew: true, tags: ['Thriller', 'Supernatural'] },
    { id: 'new4', title: 'Family Ties', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_landscape_4.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 88, genre: 'Drama', rating: 4.5, description: 'Multi-generational family saga in Addis Ababa', year: 2025, isNew: true, tags: ['Drama', 'Family'] },
    { id: 'new5', title: 'Street Dreams', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_landscape_5.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 73, genre: 'Action', rating: 4.4, description: 'Young hustlers chasing success in Johannesburg', year: 2025, isNew: true, tags: ['Action', 'Drama'] },
  ];

  const rankingSeries: MockSeries[] = [
    { id: 'rank1', title: 'Love & War', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_7.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 145, genre: 'Romance', rating: 4.9, description: 'Epic romance during turbulent times', year: 2024, rank: 1, tags: ['Romance', 'Drama', 'Historical'] },
    { id: 'rank2', title: 'The Royal Court', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_8.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 132, genre: 'Drama', rating: 4.8, description: 'Intrigue and politics in the royal palace', year: 2024, rank: 2, tags: ['Drama', 'Historical'] },
    { id: 'rank3', title: 'Sunset Boulevard', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_9.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 118, genre: 'Drama', rating: 4.7, description: 'Dreams and reality on the coast', year: 2024, rank: 3, tags: ['Drama', 'Romance'] },
    { id: 'rank4', title: 'The Hustle', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_10.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 105, genre: 'Action', rating: 4.6, description: 'Street-smart entrepreneurs making it big', year: 2024, rank: 4, tags: ['Action', 'Drama'] },
    { id: 'rank5', title: 'Broken Promises', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_11.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 97, genre: 'Drama', rating: 4.5, description: 'Betrayal and redemption in modern Africa', year: 2024, rank: 5, tags: ['Drama'] },
    { id: 'rank6', title: 'Hearts Entangled', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_12.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 89, genre: 'Romance', rating: 4.4, description: 'Complex love triangles and relationships', year: 2024, rank: 6, tags: ['Romance', 'Drama'] },
    { id: 'rank7', title: 'The Village Chief', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_13.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 76, genre: 'Drama', rating: 4.3, description: 'Traditional leadership meets modern challenges', year: 2024, rank: 7, tags: ['Drama', 'Cultural'] },
    { id: 'rank8', title: 'Midnight Call', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_14.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 68, genre: 'Thriller', rating: 4.2, description: 'Mystery calls lead to dangerous adventures', year: 2024, rank: 8, tags: ['Thriller', 'Mystery'] },
    { id: 'rank9', title: 'Golden Dreams', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_15.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 61, genre: 'Drama', rating: 4.1, description: 'Chasing success against all odds', year: 2024, rank: 9, tags: ['Drama', 'Inspiration'] },
    { id: 'rank10', title: 'River\'s Edge', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_16.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 54, genre: 'Drama', rating: 4.0, description: 'Life by the riverbanks', year: 2024, rank: 10, tags: ['Drama', 'Family'] },
  ];

  const kumawoodSeries: MockSeries[] = [
    { id: 'kuma1', title: 'Asante Kingdom', posterUrl: 'https://res.cloudinary.com/demo/image/upload/w_400,h_600,c_fill/sample.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 65, genre: 'Historical', rating: 4.7, description: 'Tales from the great Asante Empire', year: 2024, tags: ['Historical', 'Cultural', 'Drama'] },
    { id: 'kuma2', title: 'Kumasi Love', posterUrl: 'https://res.cloudinary.com/demo/image/upload/w_400,h_600,c_fill/e_grayscale/sample.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 72, genre: 'Romance', rating: 4.6, description: 'Romance blooms in Kumasi', year: 2024, tags: ['Romance', 'Comedy', 'Cultural'] },
    { id: 'kuma3', title: 'The Akan Warrior', posterUrl: 'https://res.cloudinary.com/demo/image/upload/w_400,h_600,c_fill/e_sepia/sample.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 58, genre: 'Action', rating: 4.5, description: 'Epic battles and heroic deeds', year: 2024, tags: ['Action', 'Historical', 'Adventure'] },
    { id: 'kuma4', title: 'Village Comedy', posterUrl: 'https://res.cloudinary.com/demo/image/upload/w_400,h_600,c_fill/e_brightness:30/sample.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 81, genre: 'Comedy', rating: 4.8, description: 'Hilarious village antics', year: 2024, tags: ['Comedy', 'Cultural'] },
    { id: 'kuma5', title: 'Traditional Healer', posterUrl: 'https://res.cloudinary.com/demo/image/upload/w_400,h_600,c_fill/e_blur:300/sample.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 47, genre: 'Drama', rating: 4.4, description: 'Ancient medicine meets modern skepticism', year: 2024, tags: ['Drama', 'Cultural', 'Spiritual'] },
    { id: 'kuma6', title: 'Market Queen', posterUrl: 'https://res.cloudinary.com/demo/image/upload/w_400,h_600,c_fill/e_tint:50:blue/sample.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 69, genre: 'Drama', rating: 4.6, description: 'Power and rivalry in the marketplace', year: 2024, tags: ['Drama', 'Business'] },
  ];

  const naijaSeries: MockSeries[] = [
    { id: 'naija1', title: 'Lagos Hustle', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_23.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 93, genre: 'Drama', rating: 4.8, description: 'Survival and success in Lagos', year: 2024, tags: ['Drama', 'Urban', 'Business'] },
    { id: 'naija2', title: 'Yoruba Romance', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_24.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 76, genre: 'Romance', rating: 4.7, description: 'Love stories with Yoruba traditions', year: 2024, tags: ['Romance', 'Cultural'] },
    { id: 'naija3', title: 'Abuja Chronicles', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_25.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 64, genre: 'Drama', rating: 4.5, description: 'Political intrigue in the capital', year: 2024, tags: ['Drama', 'Political'] },
    { id: 'naija4', title: 'Igbo Billionaire', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_26.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 88, genre: 'Drama', rating: 4.6, description: 'Wealth, power, and family loyalty', year: 2024, tags: ['Drama', 'Business', 'Family'] },
    { id: 'naija5', title: 'Port Harcourt Nights', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_27.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 71, genre: 'Thriller', rating: 4.4, description: 'Dark secrets in the oil city', year: 2024, tags: ['Thriller', 'Mystery'] },
    { id: 'naija6', title: 'Calabar Beauty', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_portrait_28.jpg', videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/placeholder_video.mp4', episodeCount: 55, genre: 'Romance', rating: 4.7, description: 'Beauty pageant meets true love', year: 2024, tags: ['Romance', 'Drama'] },
  ];

  const comingSoonSeries: MockComingSoonSeries[] = [
    { id: 'coming1', title: 'Empire Rising', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_coming_soon_1.jpg', releaseDate: 'December 2025', description: 'The birth of a new African empire', genre: 'Historical Drama' },
    { id: 'coming2', title: 'Cyber Lagos', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_coming_soon_2.jpg', releaseDate: 'January 2026', description: 'Tech revolution in West Africa', genre: 'Sci-Fi Drama' },
    { id: 'coming3', title: 'Sahara Crossing', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_coming_soon_3.jpg', releaseDate: 'February 2026', description: 'Epic journey across the desert', genre: 'Adventure' },
    { id: 'coming4', title: 'Island Mysteries', posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/placeholder_coming_soon_4.jpg', releaseDate: 'March 2026', description: 'Supernatural events on a remote island', genre: 'Mystery Thriller' },
  ];

  try {
    await seedSeries(popularSeries, 'Popular');
    await seedSeries(newSeries, 'New');
    await seedSeries(rankingSeries, 'Ranking');
    await seedSeries(kumawoodSeries, 'Kumawood');
    await seedSeries(naijaSeries, 'Naija');
    await seedComingSoon(comingSoonSeries);
    await seedRedeemableItems();

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();