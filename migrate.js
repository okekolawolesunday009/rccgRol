import { createClient } from '@supabase/supabase-js';
import { audioSermons } from './src/data/audioSermons.js';
import { videoSermons } from './src/data/videoSermons.js';
import { events } from './src/data/events.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('Note: SUPABASE_SERVICE_ROLE_KEY is the service_role key from Supabase dashboard, not the anon key.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateData() {
  console.log('Starting data migration....');

  try {
    // Migrate audio sermons
    console.log('Migrating audio sermons...');
    for (const sermon of audioSermons) {
      const { data, error } = await supabase
        .from('audio_sermons')
        .insert({
          title: sermon.title,
          speaker: sermon.speaker,
          audio_url: sermon.audioUrl,
          duration: sermon.duration,
          date: sermon.date,
          description: sermon.description,
          series: sermon.series,
        })
        .select();

      if (error) {
        console.error('Error inserting audio sermon:', error);
      } else {
        console.log(`Inserted audio sermon: ${sermon.title}`);
      }
    }

    // Migrate video sermons
    console.log('Migrating video sermons...');
    for (const sermon of videoSermons) {
      const { data, error } = await supabase
        .from('video_sermons')
        .insert({
          title: sermon.title,
          speaker: sermon.speaker,
          video_url: sermon.videoUrl,
          thumbnail: sermon.thumbnail,
          duration: sermon.duration,
          date: sermon.date,
          description: sermon.description,
        })
        .select();

      if (error) {
        console.error('Error inserting video sermon:', error);
      } else {
        console.log(`Inserted video sermon: ${sermon.title}`);
      }
    }

    // Migrate events
    console.log('Migrating events...');
    for (const event of events) {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: event.title,
          date: event.date,
          month: event.month,
          time: event.time,
          location: event.location,
          description: event.description,
          cta_label: event.ctaLabel,
        })
        .select();

      if (error) {
        console.error('Error inserting event:', error);
      } else {
        console.log(`Inserted event: ${event.title}`);
      }
    }

    console.log('Data migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();