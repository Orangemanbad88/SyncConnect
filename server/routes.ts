import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  updateUserLocationSchema,
  updateUserOnlineStatusSchema,
  insertInterestSchema,
  insertMoodReactionSchema,
  insertRecommendationSchema,
  reportReasonEnum,
  insertAvailabilityWindowSchema
} from "@shared/schema";
import { WebSocketServer, WebSocket } from 'ws';
import express from "express";
import { setupAuth } from './auth';
import { recommendationEngine } from './recommendationEngine';

// Module-scope connected users map so REST endpoints can send WebSocket messages
const connectedUsers = new Map<number, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // get all users endpoint
  app.get("/api/users", async (req, res) => {
    try {
      const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : null;
      const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : null;
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : 10;

      // Validate coordinates if provided
      if (latitude !== null && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
        return res.status(400).json({ message: "Invalid latitude. Must be between -90 and 90." });
      }
      if (longitude !== null && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
        return res.status(400).json({ message: "Invalid longitude. Must be between -180 and 180." });
      }

      let users;
      if (latitude && longitude) {
        users = await storage.getNearbyUsers(latitude, longitude, radius);
      } else {
        users = await storage.getAllOnlineUsers();
      }

      // Filter out blocked users if authenticated
      if (req.isAuthenticated()) {
        const blockedIds = await storage.getBlockedUserIds((req.user as any).id);
        if (blockedIds.length > 0) {
          users = users.filter(user => !blockedIds.includes(user.id));
        }
      }

      // Map distances (if coordinates provided)
      if (latitude && longitude) {
        users = users.map(user => {
          if (user.latitude && user.longitude) {
            const distance = calculateDistance(latitude, longitude, user.latitude, user.longitude);
            return { ...user, distance: formatDistance(distance) };
          }
          return { ...user, distance: "Unknown" };
        });
      }

      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: "Unable to fetch users. Please try again later." });
    }
  });
  
  // get user by id endpoint
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const interests = await storage.getUserInterests(userId);
      res.json({ ...user, interests });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: "Unable to fetch user profile. Please try again." });
    }
  });

  // create user endpoint
  app.post("/api/users", express.json(), async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid user data. Please check all fields." });
      }
      res.status(500).json({ message: "Unable to create user. Please try again." });
    }
  });

  // update user location endpoint
  app.patch("/api/users/:id/location", express.json(), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const locationData = updateUserLocationSchema.parse(req.body);
      const updatedUser = await storage.updateUserLocation(userId, locationData);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error: any) {
      console.error('Error updating location:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid location data" });
      }
      res.status(500).json({ message: "Unable to update location. Please try again." });
    }
  });

  // update user online status endpoint
  app.patch("/api/users/:id/status", express.json(), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const statusData = updateUserOnlineStatusSchema.parse(req.body);
      const updatedUser = await storage.updateUserOnlineStatus(userId, statusData);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error: any) {
      console.error('Error updating status:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid status data" });
      }
      res.status(500).json({ message: "Unable to update status. Please try again." });
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

  // Recommendation API endpoints
  
  // Get recommendations for a user
  app.get("/api/users/:id/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recommendations = await storage.getRecommendationsForUser(userId, limit);
      
      // Fetch full user data for each recommendation
      const recommendationsWithUserData = await Promise.all(
        recommendations.map(async (rec) => {
          const user = await storage.getUser(rec.recommendedUserId);
          return {
            ...rec,
            user
          };
        })
      );
      
      res.json(recommendationsWithUserData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching recommendations' });
    }
  });

  // Create a recommendation
  app.post("/api/recommendations", express.json(), async (req, res) => {
    try {
      const result = insertRecommendationSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid recommendation data',
          errors: result.error.errors 
        });
      }
      
      const recommendation = await storage.createRecommendation(result.data);
      res.status(201).json(recommendation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating recommendation' });
    }
  });

  // Mark recommendation as viewed
  app.patch("/api/recommendations/:id/viewed", async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      const updatedRecommendation = await storage.markRecommendationAsViewed(recommendationId);
      
      if (!updatedRecommendation) {
        return res.status(404).json({ message: 'Recommendation not found' });
      }
      
      res.json(updatedRecommendation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating recommendation' });
    }
  });
  
  // Generate recommendations for a user
  app.post("/api/users/:id/generate-recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const count = req.body.count || 5; // Default to 5 recommendations
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Generate recommendations using the recommendation engine
      const success = await recommendationEngine.generateRecommendationsFor(userId, count);
      
      if (success) {
        // Get the newly generated recommendations
        const recommendations = await storage.getRecommendationsForUser(userId);
        
        // Fetch full user data for each recommendation
        const recommendationsWithUserData = await Promise.all(
          recommendations.map(async (rec) => {
            const user = await storage.getUser(rec.recommendedUserId);
            return {
              ...rec,
              user
            };
          })
        );
        
        res.json(recommendationsWithUserData);
      } else {
        res.status(400).json({ message: 'Failed to generate recommendations' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while generating recommendations' });
    }
  });

  // === Safety & Trust API endpoints ===

  // Create a report
  app.post("/api/reports", express.json(), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { reportedUserId, reason, description, videoConnectionId } = req.body;
      const reasonResult = reportReasonEnum.safeParse(reason);
      if (!reasonResult.success) {
        return res.status(400).json({ message: "Invalid report reason" });
      }
      const report = await storage.createReport({
        reporterUserId: (req.user as any).id,
        reportedUserId,
        reason,
        description: description || null,
        videoConnectionId: videoConnectionId || null,
      });
      res.status(201).json(report);
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Block a user
  app.post("/api/blocks", express.json(), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { blockedUserId } = req.body;
      if (!blockedUserId) {
        return res.status(400).json({ message: "blockedUserId is required" });
      }
      const block = await storage.createBlock({
        blockerUserId: (req.user as any).id,
        blockedUserId,
      });
      res.status(201).json(block);
    } catch (error) {
      console.error('Error blocking user:', error);
      res.status(500).json({ message: "Failed to block user" });
    }
  });

  // Unblock a user
  app.delete("/api/blocks/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const blockedUserId = parseInt(req.params.userId);
      const removed = await storage.removeBlock((req.user as any).id, blockedUserId);
      if (removed) {
        res.json({ message: "User unblocked" });
      } else {
        res.status(404).json({ message: "Block not found" });
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      res.status(500).json({ message: "Failed to unblock user" });
    }
  });

  // Get blocked user IDs
  app.get("/api/blocks", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const blockedIds = await storage.getBlockedUserIds((req.user as any).id);
      res.json(blockedIds);
    } catch (error) {
      console.error('Error getting blocked users:', error);
      res.status(500).json({ message: "Failed to get blocked users" });
    }
  });

  // === Availability API endpoints ===

  // Get user availability
  app.get("/api/users/:id/availability", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const windows = await storage.getUserAvailability(userId);
      res.json(windows);
    } catch (error) {
      console.error('Error getting availability:', error);
      res.status(500).json({ message: "Failed to get availability" });
    }
  });

  // Set user availability (replace all)
  app.put("/api/users/:id/availability", express.json(), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = parseInt(req.params.id);
      if ((req.user as any).id !== userId) {
        return res.status(403).json({ message: "Cannot set availability for other users" });
      }
      const { windows } = req.body;
      if (!Array.isArray(windows)) {
        return res.status(400).json({ message: "windows array required" });
      }
      const result = await storage.setUserAvailability(userId, windows);
      res.json(result);
    } catch (error) {
      console.error('Error setting availability:', error);
      res.status(500).json({ message: "Failed to set availability" });
    }
  });

  // Get currently available users
  app.get("/api/users/available/now", async (req, res) => {
    try {
      const userIds = await storage.getAvailableUsersNow();
      res.json(userIds);
    } catch (error) {
      console.error('Error getting available users:', error);
      res.status(500).json({ message: "Failed to get available users" });
    }
  });

  // === Speed Roll API endpoints ===

  // Get speed roll status for current user
  app.get("/api/speed-roll/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = (req.user as any).id;
      const rollsUsedToday = await storage.getUserSpeedRollsToday(userId);
      const pendingRoll = await storage.getPendingSpeedRollForUser(userId);
      res.json({
        rollsUsedToday,
        rollsRemaining: Math.max(0, 5 - rollsUsedToday),
        pendingRoll: pendingRoll || null,
      });
    } catch (error) {
      console.error('Error getting speed roll status:', error);
      res.status(500).json({ message: "Failed to get speed roll status" });
    }
  });

  // Perform a speed roll
  app.post("/api/speed-roll", express.json(), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 1. Check daily limit
      const rollsUsedToday = await storage.getUserSpeedRollsToday(userId);
      if (rollsUsedToday >= 5) {
        return res.status(429).json({
          message: "Daily limit reached (5 per day)",
          rollsRemaining: 0,
        });
      }

      // 2. Get online users, filter blocked
      const allOnline = await storage.getAllOnlineUsers();
      const blockedIds = await storage.getBlockedUserIds(userId);
      let candidates = allOnline.filter(u =>
        u.id !== userId && !blockedIds.includes(u.id)
      );

      // Filter out users who already have a pending roll
      const filteredCandidates = [];
      for (const candidate of candidates) {
        const pending = await storage.getPendingSpeedRollForUser(candidate.id);
        if (!pending) {
          filteredCandidates.push(candidate);
        }
      }
      candidates = filteredCandidates;

      // 3. Calculate compatibility scores, require >= 0.35
      const scored = await Promise.all(
        candidates.map(async (candidate) => {
          const { score, reason } = await recommendationEngine.calculateUserSimilarity(user, candidate);
          return { candidate, score, reason };
        })
      );

      const eligible = scored.filter(s => s.score >= 0.35);

      // 4. Check distance <= 5 miles
      const nearby = eligible.filter(s => {
        if (!user.latitude || !user.longitude || !s.candidate.latitude || !s.candidate.longitude) {
          return true; // Allow if no location data
        }
        const dist = calculateDistance(user.latitude, user.longitude, s.candidate.latitude, s.candidate.longitude);
        return dist <= 5;
      });

      if (nearby.length === 0) {
        return res.status(404).json({ message: "No compatible users available right now" });
      }

      // 5. Pick top candidate
      nearby.sort((a, b) => b.score - a.score);
      const top = nearby[0];

      // 6. Create speed roll record
      const roll = await storage.createSpeedRoll({
        userId,
        targetUserId: top.candidate.id,
        compatibilityScore: top.score,
        matchReason: top.reason,
      });

      // 7. Send WebSocket notification to target
      const targetWs = connectedUsers.get(top.candidate.id);
      if (targetWs && targetWs.readyState === WebSocket.OPEN) {
        targetWs.send(JSON.stringify({
          type: 'speed-roll-incoming',
          rollId: roll.id,
          fromUser: {
            id: user.id,
            fullName: user.fullName,
            profileImage: user.profileImage,
            age: user.age,
            job: user.job,
          },
          compatibilityScore: top.score,
        }));
      }

      // 8. Set 30s server timeout to auto-expire
      setTimeout(async () => {
        const currentRoll = await storage.getSpeedRoll(roll.id);
        if (currentRoll && currentRoll.status === "pending") {
          await storage.updateSpeedRollStatus(roll.id, "expired");
          // Notify roller
          const rollerWs = connectedUsers.get(userId);
          if (rollerWs && rollerWs.readyState === WebSocket.OPEN) {
            rollerWs.send(JSON.stringify({
              type: 'speed-roll-expired',
              rollId: roll.id,
            }));
          }
          // Notify target
          const tWs = connectedUsers.get(top.candidate.id);
          if (tWs && tWs.readyState === WebSocket.OPEN) {
            tWs.send(JSON.stringify({
              type: 'speed-roll-expired',
              rollId: roll.id,
            }));
          }
        }
      }, 30000);

      // 9. Return roll data
      const remainingRolls = Math.max(0, 5 - (rollsUsedToday + 1));
      res.status(201).json({
        roll,
        targetUser: {
          id: top.candidate.id,
          fullName: top.candidate.fullName,
          profileImage: top.candidate.profileImage,
          age: top.candidate.age,
          job: top.candidate.job,
        },
        remainingRolls,
      });
    } catch (error) {
      console.error('Error performing speed roll:', error);
      res.status(500).json({ message: "Failed to perform speed roll" });
    }
  });

  // Respond to a speed roll
  app.post("/api/speed-roll/:id/respond", express.json(), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const rollId = parseInt(req.params.id);
      const { response } = req.body; // "accepted" or "declined"

      if (response !== "accepted" && response !== "declined") {
        return res.status(400).json({ message: "Response must be 'accepted' or 'declined'" });
      }

      const roll = await storage.getSpeedRoll(rollId);
      if (!roll) {
        return res.status(404).json({ message: "Speed roll not found" });
      }
      if (roll.status !== "pending") {
        return res.status(400).json({ message: "Speed roll already responded to" });
      }
      if (roll.targetUserId !== (req.user as any).id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updated = await storage.updateSpeedRollStatus(rollId, response);

      // Notify the roller via WebSocket
      const rollerWs = connectedUsers.get(roll.userId);
      if (rollerWs && rollerWs.readyState === WebSocket.OPEN) {
        if (response === "accepted") {
          const targetUser = await storage.getUser(roll.targetUserId);
          rollerWs.send(JSON.stringify({
            type: 'speed-roll-accepted',
            rollId,
            targetUser: targetUser ? {
              id: targetUser.id,
              fullName: targetUser.fullName,
              profileImage: targetUser.profileImage,
              age: targetUser.age,
            } : null,
          }));
        } else {
          rollerWs.send(JSON.stringify({
            type: 'speed-roll-declined',
            rollId,
          }));
        }
      }

      res.json(updated);
    } catch (error) {
      console.error('Error responding to speed roll:', error);
      res.status(500).json({ message: "Failed to respond to speed roll" });
    }
  });

  // Get conversations list for inbox
  app.get("/api/conversations", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = (req.user as any).id;
      const conversations = await storage.getUserConversations(userId);

      // Enrich with other user's profile
      const enriched = await Promise.all(
        conversations.map(async (conv) => {
          const otherUser = await storage.getUser(conv.otherUserId);
          return {
            matchId: conv.matchId,
            otherUser: otherUser
              ? {
                  id: otherUser.id,
                  fullName: otherUser.fullName,
                  profileImage: otherUser.profileImage,
                  isOnline: otherUser.isOnline,
                }
              : null,
            latestMessage: conv.latestMessage,
          };
        })
      );

      // Sort by latest message timestamp, newest first
      enriched.sort((a, b) => {
        const aTime = a.latestMessage?.createdAt || '';
        const bTime = b.latestMessage?.createdAt || '';
        return String(bTime).localeCompare(String(aTime));
      });

      res.json(enriched);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  const httpServer = createServer(app);

  // Setup WebSocket server for WebRTC signaling
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    let userId = 0; // Initialize with invalid ID
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data.type);
        
        // Handle different types of messages
        switch(data.type) {
          case 'register':
            // Register a user with their ID
            if (typeof data.userId === 'number' && data.userId > 0) {
              userId = data.userId;
              connectedUsers.set(userId, ws);
              console.log(`User ${userId} registered`);
            } else {
              console.error('Invalid user ID provided for registration');
            }
            break;
            
          case 'offer':
            // Forward offer to the target user
            const targetUserWsForOffer = connectedUsers.get(data.target);
            if (targetUserWsForOffer && targetUserWsForOffer.readyState === ws.OPEN) {
              console.log(`Forwarding offer from ${data.from} to ${data.target}`);
              targetUserWsForOffer.send(JSON.stringify({
                type: 'offer',
                offer: data.offer,
                from: data.from
              }));
            } else {
              // Target user not connected
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Target user not connected',
                target: data.target
              }));
            }
            break;
            
          case 'answer':
            // Forward answer to the target user
            const targetUserWsForAnswer = connectedUsers.get(data.target);
            if (targetUserWsForAnswer && targetUserWsForAnswer.readyState === ws.OPEN) {
              console.log(`Forwarding answer from ${data.from} to ${data.target}`);
              targetUserWsForAnswer.send(JSON.stringify({
                type: 'answer',
                answer: data.answer,
                from: data.from
              }));
            }
            break;
            
          case 'ice-candidate':
            // Forward ICE candidate to the target user
            const targetUserWsForIce = connectedUsers.get(data.target);
            if (targetUserWsForIce && targetUserWsForIce.readyState === ws.OPEN) {
              console.log(`Forwarding ICE candidate from ${data.from} to ${data.target}`);
              targetUserWsForIce.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: data.candidate,
                from: data.from
              }));
            }
            break;
            
          case 'call-request':
            // Forward call request to the target user
            const targetUserWsForCall = connectedUsers.get(data.target);
            if (targetUserWsForCall && targetUserWsForCall.readyState === ws.OPEN) {
              console.log(`Forwarding call request from ${data.from} to ${data.target}`);
              targetUserWsForCall.send(JSON.stringify({
                type: 'call-request',
                from: data.from,
                fromUser: data.fromUser
              }));
            } else {
              // Target user not connected
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Target user not online',
                target: data.target
              }));
            }
            break;
            
          case 'call-response':
            // Forward call response to the target user
            const targetUserWsForResponse = connectedUsers.get(data.target);
            if (targetUserWsForResponse && targetUserWsForResponse.readyState === ws.OPEN) {
              console.log(`Forwarding call response (${data.accepted}) from ${data.from} to ${data.target}`);
              targetUserWsForResponse.send(JSON.stringify({
                type: 'call-response',
                from: data.from,
                accepted: data.accepted
              }));
            }
            break;
            
          case 'hang-up':
            // Forward hang up to the target user
            const targetUserWsForHangup = connectedUsers.get(data.target);
            if (targetUserWsForHangup && targetUserWsForHangup.readyState === ws.OPEN) {
              console.log(`Forwarding hang up from ${data.from} to ${data.target}`);
              targetUserWsForHangup.send(JSON.stringify({
                type: 'hang-up',
                from: data.from
              }));
            }
            break;

          case 'spark-question':
            // Forward spark question to call partner
            const targetUserWsForSpark = connectedUsers.get(data.target);
            if (targetUserWsForSpark && targetUserWsForSpark.readyState === ws.OPEN) {
              targetUserWsForSpark.send(JSON.stringify({
                type: 'spark-question',
                question: data.question,
                from: data.from
              }));
            }
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log(`WebSocket connection closed${userId > 0 ? ' for user ' + userId : ''}`);
      if (userId > 0) {
        connectedUsers.delete(userId);
      }
    });
  });

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
