import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  updateUserLocationSchema, 
  updateUserOnlineStatusSchema,
  insertInterestSchema,
  insertMoodReactionSchema
} from "@shared/schema";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // get all users endpoint
  app.get("/api/users", async (req, res) => {
    try {
      const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : null;
      const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : null;
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : 10; // default 10 miles radius
      
      let users;
      if (latitude && longitude) {
        // Get nearby users if coordinates are provided
        users = await storage.getNearbyUsers(latitude, longitude, radius);
      } else {
        // Otherwise get all online users
        users = await storage.getAllOnlineUsers();
      }
      
      // Map distances (if coordinates provided)
      if (latitude && longitude) {
        users = users.map(user => {
          if (user.latitude && user.longitude) {
            const distance = calculateDistance(
              latitude, 
              longitude, 
              user.latitude, 
              user.longitude
            );
            return { ...user, distance: formatDistance(distance) };
          }
          return { ...user, distance: "Unknown" };
        });
      }
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // get user by id endpoint
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user interests
      const interests = await storage.getUserInterests(userId);
      
      res.json({ ...user, interests });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // create user endpoint
  app.post("/api/users", express.json(), async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  // update user location endpoint
  app.patch("/api/users/:id/location", express.json(), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const locationData = updateUserLocationSchema.parse(req.body);
      const updatedUser = await storage.updateUserLocation(userId, locationData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid location data" });
    }
  });
  
  // update user online status endpoint
  app.patch("/api/users/:id/status", express.json(), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const statusData = updateUserOnlineStatusSchema.parse(req.body);
      const updatedUser = await storage.updateUserOnlineStatus(userId, statusData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid status data" });
    }
  });
  
  // add interest to user endpoint
  app.post("/api/users/:id/interests", express.json(), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const interestData = insertInterestSchema.parse({ ...req.body, userId });
      const newInterest = await storage.addUserInterest(interestData);
      res.status(201).json(newInterest);
    } catch (error) {
      res.status(400).json({ message: "Invalid interest data" });
    }
  });
  
  // get user interests endpoint
  app.get("/api/users/:id/interests", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const interests = await storage.getUserInterests(userId);
      res.json(interests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interests" });
    }
  });

  // Mood Reactions API endpoints
  
  // Get reactions received by a user
  app.get("/api/users/:id/mood-reactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const reactions = await storage.getUserMoodReactions(userId);
      res.json(reactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching mood reactions' });
    }
  });

  // Get reactions between two users
  app.get("/api/users/:fromId/mood-reactions/:toId", async (req, res) => {
    try {
      const fromUserId = parseInt(req.params.fromId);
      const toUserId = parseInt(req.params.toId);
      const reactions = await storage.getMoodReactionsBetweenUsers(fromUserId, toUserId);
      res.json(reactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching mood reactions between users' });
    }
  });

  // Send a mood reaction
  app.post("/api/mood-reactions", express.json(), async (req, res) => {
    try {
      const result = insertMoodReactionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid mood reaction data',
          errors: result.error.errors 
        });
      }
      
      const reaction = await storage.addMoodReaction(result.data);
      res.status(201).json(reaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating mood reaction' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadius = 3958.8; // miles
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a = 
    Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadius * c;
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function formatDistance(distance: number): string {
  const miles = Math.round(distance * 10) / 10;
  return `${miles} miles away`;
}
