import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWatchHistorySchema, insertUserFollowingSchema, insertUserReminderSchema } from "@shared/schema";
import { cloudinary } from "./cloudinary";
import { supabase } from "./supabase";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { id, email } = req.body;
      if (!id || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const existingUser = await storage.getUser(id);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id,
          email,
          password: '',
          coins: 0,
          reward_coins: 0,
          points: 0,
          has_membership: false,
          membership_expires_at: null,
          check_in_streak: 0,
          last_check_in_date: null,
          ads_watched_today: 0,
          autoplay_preference: true,
          language_preference: 'en',
          allow_mobile_download: false,
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      res.status(201).json(data);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  app.get('/api/series/popular', async (_req, res) => {
    try {
      const series = await storage.getPopularSeries();
      res.json(series);
    } catch (error) {
      console.error('Error fetching popular series:', error);
      res.status(500).json({ error: 'Failed to fetch popular series' });
    }
  });

  app.get('/api/series/new', async (_req, res) => {
    try {
      const series = await storage.getNewSeries();
      res.json(series);
    } catch (error) {
      console.error('Error fetching new series:', error);
      res.status(500).json({ error: 'Failed to fetch new series' });
    }
  });

  app.get('/api/series/ranking', async (_req, res) => {
    try {
      const series = await storage.getRankingSeries();
      res.json(series);
    } catch (error) {
      console.error('Error fetching ranking series:', error);
      res.status(500).json({ error: 'Failed to fetch ranking series' });
    }
  });

  app.get('/api/series/trending', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const series = await storage.getTrendingSeries(limit);
      res.json(series);
    } catch (error) {
      console.error('Error fetching trending series:', error);
      res.status(500).json({ error: 'Failed to fetch trending series' });
    }
  });

  app.get('/api/series/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const series = await storage.searchSeriesByTitle(query);
      res.json(series);
    } catch (error) {
      console.error('Error searching series:', error);
      res.status(500).json({ error: 'Failed to search series' });
    }
  });

  app.get('/api/series/kumawood', async (_req, res) => {
    try {
      const series = await storage.getKumawoodSeries();
      res.json(series);
    } catch (error) {
      console.error('Error fetching Kumawood series:', error);
      res.status(500).json({ error: 'Failed to fetch Kumawood series' });
    }
  });

  app.get('/api/series/naija', async (_req, res) => {
    try {
      const series = await storage.getNaijaSeries();
      res.json(series);
    } catch (error) {
      console.error('Error fetching Naija series:', error);
      res.status(500).json({ error: 'Failed to fetch Naija series' });
    }
  });

  app.get('/api/series/coming-soon', async (_req, res) => {
    try {
      const series = await storage.getComingSoonSeries();
      res.json(series);
    } catch (error) {
      console.error('Error fetching coming soon series:', error);
      res.status(500).json({ error: 'Failed to fetch coming soon series' });
    }
  });

  app.get('/api/series/:id', async (req, res) => {
    try {
      const series = await storage.getSeriesById(req.params.id);
      if (!series) {
        return res.status(404).json({ error: 'Series not found' });
      }
      res.json(series);
    } catch (error) {
      console.error('Error fetching series:', error);
      res.status(500).json({ error: 'Failed to fetch series' });
    }
  });

  app.get('/api/series/:id/episodes', async (req, res) => {
    try {
      const episodes = await storage.getEpisodesBySeriesId(req.params.id);
      res.json(episodes);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      res.status(500).json({ error: 'Failed to fetch episodes' });
    }
  });

  app.get('/api/redeemable-items', async (_req, res) => {
    try {
      const items = await storage.getAllRedeemableItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching redeemable items:', error);
      res.status(500).json({ error: 'Failed to fetch redeemable items' });
    }
  });

  app.get('/api/series/:seriesId/episodes/:episodeNumber', async (req, res) => {
    try {
      const episode = await storage.getEpisodeBySeriesAndNumber(
        req.params.seriesId,
        parseInt(req.params.episodeNumber)
      );
      if (!episode) {
        return res.status(404).json({ error: 'Episode not found' });
      }
      res.json(episode);
    } catch (error) {
      console.error('Error fetching episode:', error);
      res.status(500).json({ error: 'Failed to fetch episode' });
    }
  });

  app.get('/api/episodes/:episodeId/unlock-status/:userId', async (req, res) => {
    try {
      const isUnlocked = await storage.isEpisodeUnlocked(req.params.userId, req.params.episodeId);
      res.json({ isUnlocked });
    } catch (error) {
      console.error('Error checking episode unlock status:', error);
      res.status(500).json({ error: 'Failed to check episode unlock status' });
    }
  });

  app.post('/api/episodes/:episodeId/unlock', async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const result = await storage.unlockEpisode(userId, req.params.episodeId);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error unlocking episode:', error);
      res.status(500).json({ error: 'Failed to unlock episode' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  app.post('/api/watch-history', async (req, res) => {
    try {
      const validatedData = insertWatchHistorySchema.parse(req.body);
      const watchHistory = await storage.upsertWatchHistory(validatedData);
      res.json(watchHistory);
    } catch (error) {
      console.error('Error upserting watch history:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error.message });
      }
      res.status(500).json({ error: 'Failed to upsert watch history' });
    }
  });

  app.get('/api/episodes/random-first', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const episodesWithSeries = await storage.getRandomFirstEpisodes(limit);
      res.json(episodesWithSeries);
    } catch (error) {
      console.error('Error fetching random first episodes:', error);
      res.status(500).json({ error: 'Failed to fetch random first episodes' });
    }
  });

  app.post('/api/user-following', async (req, res) => {
    try {
      const validatedData = insertUserFollowingSchema.parse(req.body);
      const following = await storage.addUserFollowing(validatedData);
      res.json(following);
    } catch (error) {
      console.error('Error adding user following:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error.message });
      }
      res.status(500).json({ error: 'Failed to add user following' });
    }
  });

  app.delete('/api/user-following/:userId/:seriesId', async (req, res) => {
    try {
      await storage.removeUserFollowing(req.params.userId, req.params.seriesId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing user following:', error);
      res.status(500).json({ error: 'Failed to remove user following' });
    }
  });

  app.get('/api/user-following/:userId/:seriesId', async (req, res) => {
    try {
      const isFollowing = await storage.isUserFollowingSeries(req.params.userId, req.params.seriesId);
      res.json({ isFollowing });
    } catch (error) {
      console.error('Error checking user following:', error);
      res.status(500).json({ error: 'Failed to check user following' });
    }
  });

  app.post('/api/user-reminders', async (req, res) => {
    try {
      const validatedData = insertUserReminderSchema.parse(req.body);
      const reminder = await storage.addUserReminder(validatedData);
      res.json(reminder);
    } catch (error) {
      console.error('Error adding user reminder:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error.message });
      }
      res.status(500).json({ error: 'Failed to add user reminder' });
    }
  });

  app.delete('/api/user-reminders/:userId/:seriesId', async (req, res) => {
    try {
      await storage.removeUserReminder(req.params.userId, req.params.seriesId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing user reminder:', error);
      res.status(500).json({ error: 'Failed to remove user reminder' });
    }
  });

  app.get('/api/user-reminders/:userId', async (req, res) => {
    try {
      const reminders = await storage.getUserReminders(req.params.userId);
      res.json(reminders);
    } catch (error) {
      console.error('Error fetching user reminders:', error);
      res.status(500).json({ error: 'Failed to fetch user reminders' });
    }
  });

  app.get('/api/user-following/:userId', async (req, res) => {
    try {
      const following = await storage.getUserFollowingSeries(req.params.userId);
      res.json(following);
    } catch (error) {
      console.error('Error fetching user following:', error);
      res.status(500).json({ error: 'Failed to fetch user following' });
    }
  });

  app.get('/api/watch-history/:userId', async (req, res) => {
    try {
      const history = await storage.getUserWatchHistory(req.params.userId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching watch history:', error);
      res.status(500).json({ error: 'Failed to fetch watch history' });
    }
  });

  app.post('/api/user-following/bulk-delete', async (req, res) => {
    try {
      const { userId, seriesIds } = req.body;
      if (!userId || !Array.isArray(seriesIds)) {
        return res.status(400).json({ error: 'Invalid request data' });
      }
      await storage.bulkDeleteUserFollowing(userId, seriesIds);
      res.json({ success: true });
    } catch (error) {
      console.error('Error bulk deleting user following:', error);
      res.status(500).json({ error: 'Failed to bulk delete user following' });
    }
  });

  app.post('/api/user-reminders/bulk-delete', async (req, res) => {
    try {
      const { userId, seriesIds } = req.body;
      if (!userId || !Array.isArray(seriesIds)) {
        return res.status(400).json({ error: 'Invalid request data' });
      }
      await storage.bulkDeleteUserReminders(userId, seriesIds);
      res.json({ success: true });
    } catch (error) {
      console.error('Error bulk deleting user reminders:', error);
      res.status(500).json({ error: 'Failed to bulk delete user reminders' });
    }
  });

  app.post('/api/watch-history/bulk-delete', async (req, res) => {
    try {
      const { userId, seriesIds } = req.body;
      if (!userId || !Array.isArray(seriesIds)) {
        return res.status(400).json({ error: 'Invalid request data' });
      }
      await storage.bulkDeleteWatchHistory(userId, seriesIds);
      res.json({ success: true });
    } catch (error) {
      console.error('Error bulk deleting watch history:', error);
      res.status(500).json({ error: 'Failed to bulk delete watch history' });
    }
  });

  app.post('/api/upload/image', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'afrishorts/images',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });

      res.json({
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  app.post('/api/upload/video', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'afrishorts/videos',
            resource_type: 'video',
            allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
            chunk_size: 6000000,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });

      res.json({
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
        duration: (result as any).duration,
        format: (result as any).format,
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      res.status(500).json({ error: 'Failed to upload video' });
    }
  });

  app.delete('/api/upload/:publicId', async (req, res) => {
    try {
      const adminToken = req.headers['x-admin-token'];
      
      if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin token' });
      }

      const publicId = decodeURIComponent(req.params.publicId);
      const resourceType = req.query.type === 'video' ? 'video' : 'image';
      
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      res.json(result);
    } catch (error) {
      console.error('Error deleting asset:', error);
      res.status(500).json({ error: 'Failed to delete asset' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
