import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const watchHistory = await storage.upsertWatchHistory(req.body);
      res.json(watchHistory);
    } catch (error) {
      console.error('Error upserting watch history:', error);
      res.status(500).json({ error: 'Failed to upsert watch history' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
