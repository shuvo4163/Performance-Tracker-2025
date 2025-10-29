import type { Express } from "express";
import { createServer, type Server } from "http";
import { getUncachableYouTubeClient, extractVideoId } from "./youtube";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/youtube/video-info", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const videoId = extractVideoId(url);
      if (!videoId) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
      }

      const youtube = await getUncachableYouTubeClient();
      const response = await youtube.videos.list({
        part: ['snippet', 'statistics'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      const title = video.snippet?.title || "";
      const views = parseInt(video.statistics?.viewCount || "0", 10);

      res.json({ title, views });
    } catch (error) {
      console.error("YouTube API error:", error);
      res.status(500).json({ error: "Failed to fetch video information" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
