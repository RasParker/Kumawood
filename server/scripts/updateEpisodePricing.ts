import { supabase } from '../supabase';

async function updateEpisodePricing() {
  console.log('Updating episode pricing...\n');
  
  console.log('Setting episodes 1-10 to free (0 coins)...');
  const { data: freeEpisodes, error: freeError } = await supabase
    .from('episodes')
    .update({
      is_free: true,
      cost_in_coins: 0
    })
    .lte('episode_number', 10)
    .gte('episode_number', 1);

  if (freeError) {
    console.error('Error updating free episodes:', freeError);
    return;
  }

  console.log('✓ Episodes 1-10 set to free\n');

  console.log('Setting episodes 11+ to 50 coins...');
  const { data: paidEpisodes, error: paidError } = await supabase
    .from('episodes')
    .update({
      is_free: false,
      cost_in_coins: 50
    })
    .gt('episode_number', 10);

  if (paidError) {
    console.error('Error updating paid episodes:', paidError);
    return;
  }

  console.log('✓ Episodes 11+ set to 50 coins\n');

  const { count: freeCount } = await supabase
    .from('episodes')
    .select('*', { count: 'exact', head: true })
    .eq('is_free', true);

  const { count: paidCount } = await supabase
    .from('episodes')
    .select('*', { count: 'exact', head: true })
    .eq('is_free', false);

  console.log('\nSummary:');
  console.log(`  Free episodes: ${freeCount}`);
  console.log(`  Paid episodes: ${paidCount}`);
  console.log('\nEpisode pricing updated successfully! 🎉');
}

updateEpisodePricing()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error updating episode pricing:', error);
    process.exit(1);
  });
