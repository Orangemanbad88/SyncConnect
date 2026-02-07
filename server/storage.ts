import {
  users,
  interests,
  moodReactions,
  videoConnections,
  matches,
  messages,
  userRecommendations,
  reports,
  blocks,
  availabilityWindows,
  speedRolls,
  type User,
  type InsertUser,
  type Interest,
  type InsertInterest,
  type MoodReaction,
  type InsertMoodReaction,
  type VideoConnection,
  type InsertVideoConnection,
  type UpdateVideoConnection,
  type UpdatePickStatus,
  type Match,
  type InsertMatch,
  type Message,
  type InsertMessage,
  type UpdateUserLocation,
  type UpdateUserOnlineStatus,
  type Recommendation,
  type InsertRecommendation,
  type Report,
  type InsertReport,
  type Block,
  type InsertBlock,
  type AvailabilityWindow,
  type InsertAvailabilityWindow,
  type SpeedRoll,
  type InsertSpeedRoll
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLocation(id: number, location: UpdateUserLocation): Promise<User | undefined>;
  updateUserOnlineStatus(id: number, status: UpdateUserOnlineStatus): Promise<User | undefined>;
  getNearbyUsers(latitude: number, longitude: number, radius: number): Promise<User[]>;
  getUserInterests(userId: number): Promise<Interest[]>;
  addUserInterest(interest: InsertInterest): Promise<Interest>;
  getAllOnlineUsers(): Promise<User[]>;
  
  // Mood Reactions methods
  addMoodReaction(reaction: InsertMoodReaction): Promise<MoodReaction>;
  getUserMoodReactions(userId: number): Promise<MoodReaction[]>;
  getMoodReactionsBetweenUsers(fromUserId: number, toUserId: number): Promise<MoodReaction[]>;
  
  // Video Connection methods
  createVideoConnection(connection: InsertVideoConnection): Promise<VideoConnection>;
  getVideoConnection(id: number): Promise<VideoConnection | undefined>;
  updateVideoConnection(id: number, update: UpdateVideoConnection): Promise<VideoConnection | undefined>;
  updatePickStatus(id: number, userId: number, picked: boolean): Promise<VideoConnection | undefined>;
  getUserVideoConnections(userId: number): Promise<VideoConnection[]>;
  
  // Match methods
  createMatch(match: InsertMatch): Promise<Match>;
  getMatch(id: number): Promise<Match | undefined>;
  getMatchByUsers(userOneId: number, userTwoId: number): Promise<Match | undefined>;
  getUserMatches(userId: number): Promise<Match[]>;
  deactivateMatch(id: number): Promise<Match | undefined>;
  
  // Messages methods
  sendMessage(message: InsertMessage): Promise<Message>;
  getConversation(matchId: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{ matchId: number, otherUserId: number, latestMessage: Message }[]>;
  markMessagesAsRead(matchId: number, toUserId: number): Promise<void>;
  
  // Recommendation methods
  getRecommendationsForUser(userId: number, limit?: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  markRecommendationAsViewed(id: number): Promise<Recommendation | undefined>;
  
  // Report methods
  createReport(report: InsertReport): Promise<Report>;
  getReportsForUser(userId: number): Promise<Report[]>;

  // Block methods
  createBlock(block: InsertBlock): Promise<Block>;
  removeBlock(blockerUserId: number, blockedUserId: number): Promise<boolean>;
  isBlocked(userId1: number, userId2: number): Promise<boolean>;
  getBlockedUserIds(userId: number): Promise<number[]>;

  // Availability methods
  getUserAvailability(userId: number): Promise<AvailabilityWindow[]>;
  setUserAvailability(userId: number, windows: InsertAvailabilityWindow[]): Promise<AvailabilityWindow[]>;
  deleteAvailabilityWindow(id: number): Promise<boolean>;
  getAvailableUsersNow(): Promise<number[]>;

  // Speed Roll methods
  createSpeedRoll(roll: InsertSpeedRoll): Promise<SpeedRoll>;
  getSpeedRoll(id: number): Promise<SpeedRoll | undefined>;
  updateSpeedRollStatus(id: number, status: string): Promise<SpeedRoll | undefined>;
  getUserSpeedRollsToday(userId: number): Promise<number>;
  getPendingSpeedRollForUser(targetUserId: number): Promise<SpeedRoll | undefined>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userInterests: Map<number, Interest[]>;
  private moodReactions: Map<number, MoodReaction>;
  private videoConnections: Map<number, VideoConnection>;
  private matches: Map<number, Match>;
  private messages: Map<number, Message>;
  private recommendations: Map<number, Recommendation>;
  private reports_store: Map<number, Report>;
  private blocks_store: Map<number, Block>;
  private availabilityWindows_store: Map<number, AvailabilityWindow>;
  private speedRolls_store: Map<number, SpeedRoll>;
  currentId: number;
  interestId: number;
  moodReactionId: number;
  videoConnectionId: number;
  matchId: number;
  messageId: number;
  recommendationId: number;
  reportId: number;
  blockId: number;
  availabilityWindowId: number;
  speedRollId: number;
  sessionStore: session.Store;
  
  // Video Connection methods
  async createVideoConnection(connection: InsertVideoConnection): Promise<VideoConnection> {
    const id = this.videoConnectionId++;
    const newConnection: VideoConnection = {
      ...connection,
      id,
      startedAt: new Date().toISOString(),
      endedAt: null,
      duration: null,
      userOnePicked: false,
      userTwoPicked: false,
    };
    this.videoConnections.set(id, newConnection);
    return newConnection;
  }
  
  async getVideoConnection(id: number): Promise<VideoConnection | undefined> {
    return this.videoConnections.get(id);
  }
  
  async updateVideoConnection(id: number, update: UpdateVideoConnection): Promise<VideoConnection | undefined> {
    const connection = this.videoConnections.get(id);
    if (!connection) return undefined;
    
    const updatedConnection = { ...connection, ...update };
    this.videoConnections.set(id, updatedConnection);
    return updatedConnection;
  }
  
  async updatePickStatus(id: number, userId: number, picked: boolean): Promise<VideoConnection | undefined> {
    const connection = this.videoConnections.get(id);
    if (!connection) return undefined;
    
    let updatedConnection: VideoConnection;
    
    if (connection.userOneId === userId) {
      updatedConnection = { ...connection, userOnePicked: picked };
    } else if (connection.userTwoId === userId) {
      updatedConnection = { ...connection, userTwoPicked: picked };
    } else {
      return undefined;
    }
    
    this.videoConnections.set(id, updatedConnection);
    return updatedConnection;
  }
  
  async getUserVideoConnections(userId: number): Promise<VideoConnection[]> {
    const connections: VideoConnection[] = [];
    for (const connection of this.videoConnections.values()) {
      if (connection.userOneId === userId || connection.userTwoId === userId) {
        connections.push(connection);
      }
    }
    return connections;
  }
  
  // Match methods
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchId++;
    const newMatch: Match = {
      ...match,
      id,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }
  
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }
  
  async getMatchByUsers(userOneId: number, userTwoId: number): Promise<Match | undefined> {
    for (const match of this.matches.values()) {
      if ((match.userOneId === userOneId && match.userTwoId === userTwoId) ||
          (match.userOneId === userTwoId && match.userTwoId === userOneId)) {
        return match;
      }
    }
    return undefined;
  }
  
  async getUserMatches(userId: number): Promise<Match[]> {
    const matches: Match[] = [];
    for (const match of this.matches.values()) {
      if ((match.userOneId === userId || match.userTwoId === userId) && match.isActive) {
        matches.push(match);
      }
    }
    return matches;
  }
  
  async deactivateMatch(id: number): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, isActive: false };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }
  
  // Messages methods
  async sendMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const newMessage: Message = {
      ...message,
      id,
      content: message.content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }
  
  async getConversation(matchId: number): Promise<Message[]> {
    const conversation: Message[] = [];
    for (const message of this.messages.values()) {
      if (message.matchId === matchId) {
        conversation.push(message);
      }
    }
    return conversation.sort((a, b) =>
      (a.createdAt || '').localeCompare(b.createdAt || '')
    );
  }
  
  async getUserConversations(userId: number): Promise<{ matchId: number, otherUserId: number, latestMessage: Message }[]> {
    const matches = await this.getUserMatches(userId);
    const conversations: { matchId: number, otherUserId: number, latestMessage: Message }[] = [];
    
    for (const match of matches) {
      const messages = await this.getConversation(match.id);
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        const otherUserId = match.userOneId === userId ? match.userTwoId : match.userOneId;
        conversations.push({
          matchId: match.id,
          otherUserId,
          latestMessage,
        });
      }
    }
    
    return conversations;
  }
  
  async markMessagesAsRead(matchId: number, toUserId: number): Promise<void> {
    for (const [id, message] of this.messages.entries()) {
      if (message.matchId === matchId && message.toUserId === toUserId && !message.isRead) {
        this.messages.set(id, { ...message, isRead: true });
      }
    }
  }

  constructor() {
    this.users = new Map();
    this.userInterests = new Map();
    this.moodReactions = new Map();
    this.videoConnections = new Map();
    this.matches = new Map();
    this.messages = new Map();
    this.recommendations = new Map();
    this.reports_store = new Map();
    this.blocks_store = new Map();
    this.availabilityWindows_store = new Map();
    this.speedRolls_store = new Map();
    this.currentId = 1;
    this.interestId = 1;
    this.moodReactionId = 1;
    this.videoConnectionId = 1;
    this.matchId = 1;
    this.messageId = 1;
    this.recommendationId = 1;
    this.reportId = 1;
    this.blockId = 1;
    this.availabilityWindowId = 1;
    this.speedRollId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    // Run async seed
    this.seedData();
  }
  
  // Recommendation methods
  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    for (const recommendation of this.recommendations.values()) {
      if (recommendation.userId === userId && !recommendation.isViewed) {
        recommendations.push(recommendation);
      }
    }
    
    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);
    
    // Return limited number of recommendations
    return recommendations.slice(0, limit);
  }
  
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationId++;
    const now = new Date();
    
    const newRecommendation: Recommendation = {
      ...recommendation,
      id,
      reason: recommendation.reason ?? null,
      isViewed: false,
      createdAt: now.toISOString(),
    };
    
    this.recommendations.set(id, newRecommendation);
    return newRecommendation;
  }
  
  async markRecommendationAsViewed(id: number): Promise<Recommendation | undefined> {
    const recommendation = this.recommendations.get(id);
    
    if (!recommendation) {
      return undefined;
    }
    
    const updatedRecommendation: Recommendation = {
      ...recommendation,
      isViewed: true,
    };
    
    this.recommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }

  private async seedData() {
    // Hash the default password once for all seed users
    const hashedPassword = await hashPassword("password");

    // Seed with sample users for development
    const sampleUsers = [
      {
        username: "michael",
        email: "michael@example.com",
        password: "password",
        fullName: "Michael Johnson",
        age: 28,
        job: "Software Engineer",
        bio: "Coffee enthusiast, coding wizard, and hiking addict. Looking to meet new people in the city!",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        username: "sarah",
        email: "sarah@example.com",
        password: "password",
        fullName: "Sarah Williams",
        age: 24,
        job: "Graphic Designer",
        bio: "Creative soul with a passion for art and design. Coffee addict and dog lover seeking meaningful connections.",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7145,
        longitude: -74.0028,
      },
      {
        username: "james",
        email: "james@example.com",
        password: "password",
        fullName: "James Smith",
        age: 31,
        job: "Marketing Director",
        bio: "Marketing expert by day, amateur chef by night. Looking for someone to share culinary adventures with.",
        profileImage: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7112,
        longitude: -74.0123,
      },
      {
        username: "emma",
        email: "emma@example.com",
        password: "password",
        fullName: "Emma Davis",
        age: 27,
        job: "Photographer",
        bio: "Professional photographer with an eye for beauty in everyday moments. Lover of sunsets and spontaneous adventures.",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7132,
        longitude: -74.0082,
      },
      {
        username: "david",
        email: "david@example.com",
        password: "password",
        fullName: "David Brown",
        age: 29,
        job: "Chef",
        bio: "Culinary artist who believes food is the universal language of love. Looking for my taste-tester in crime.",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7150,
        longitude: -74.0120,
      },
      // New nearby users
      {
        username: "olivia",
        email: "olivia@example.com",
        password: "password",
        fullName: "Olivia Wilson",
        age: 26,
        job: "Architect",
        bio: "Design enthusiast with a passion for urban spaces. Looking for someone to explore the city's hidden architectural gems.",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7095,
        longitude: -74.0143,
      },
      {
        username: "noah",
        email: "noah@example.com",
        password: "password",
        fullName: "Noah Turner",
        age: 30,
        job: "Music Producer",
        bio: "Creating beats and melodies is my passion. Seeking someone who appreciates good music and spontaneous jam sessions.",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7160,
        longitude: -74.0037,
      },
      {
        username: "sophia",
        email: "sophia@example.com",
        password: "password",
        fullName: "Sophia Martinez",
        age: 25,
        job: "Yoga Instructor",
        bio: "Finding balance through mindfulness and movement. Let's connect over coffee and talk about our journeys to inner peace.",
        profileImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7201,
        longitude: -74.0090,
      },
      {
        username: "ethan",
        email: "ethan@example.com",
        password: "password",
        fullName: "Ethan Reynolds",
        age: 33,
        job: "Financial Analyst",
        bio: "Numbers by day, foodie by night. Always on the hunt for the best ramen spots in the city. Care to join?",
        profileImage: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7157,
        longitude: -74.0171,
      },
      {
        username: "ava",
        email: "ava@example.com",
        password: "password",
        fullName: "Ava Thompson",
        age: 28,
        job: "Dance Instructor",
        bio: "Dancing through life one step at a time. Looking for someone who can keep up with my rhythm both on and off the dance floor.",
        profileImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
        latitude: 40.7180,
        longitude: -74.0065,
      },
    ];

    // Create sample users with hashed passwords
    for (const userData of sampleUsers) {
      const user = await this.createUser({
        ...userData,
        password: hashedPassword, // Use the pre-hashed password
      });

      // Set some users as online for demo purposes
      if (["michael", "sarah", "emma", "david", "olivia", "noah", "sophia", "ava"].includes(user.username)) {
        await this.updateUserOnlineStatus(user.id, { isOnline: true });
      }

      // Add interests for Michael
      if (user.username === "michael") {
        await this.addUserInterest({ userId: user.id, name: "Hiking" });
        await this.addUserInterest({ userId: user.id, name: "Photography" });
        await this.addUserInterest({ userId: user.id, name: "Coding" });
        await this.addUserInterest({ userId: user.id, name: "Coffee" });
        await this.addUserInterest({ userId: user.id, name: "Travel" });
      }
    }

    console.log("Seed data created with hashed passwords");
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      fullName: insertUser.fullName,
      age: insertUser.age,
      job: insertUser.job || null,
      bio: insertUser.bio || null,
      location: insertUser.location || null,
      zodiacSign: insertUser.zodiacSign || null,
      profileImage: insertUser.profileImage || null,
      coverImage: insertUser.coverImage || null,
      latitude: insertUser.latitude || null,
      longitude: insertUser.longitude || null,
      isOnline: false,
      isVerified: false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLocation(id: number, location: UpdateUserLocation): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserOnlineStatus(id: number, status: UpdateUserOnlineStatus): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      isOnline: status.isOnline,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getNearbyUsers(latitude: number, longitude: number, radius: number): Promise<User[]> {
    // Simple calculation for demo purposes using the Haversine formula
    const users = Array.from(this.users.values());
    
    return users.filter(user => {
      if (!user.latitude || !user.longitude) return false;
      
      // Calculate distance using Haversine formula
      const earthRadius = 3958.8; // miles
      const lat1 = this.toRadians(latitude);
      const lat2 = this.toRadians(user.latitude);
      const deltaLat = this.toRadians(user.latitude - latitude);
      const deltaLng = this.toRadians(user.longitude - longitude);

      const a = 
        Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
        Math.cos(lat1) * Math.cos(lat2) * 
        Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = earthRadius * c;

      return distance <= radius;
    });
  }

  private toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  async getUserInterests(userId: number): Promise<Interest[]> {
    return this.userInterests.get(userId) || [];
  }

  async addUserInterest(interest: InsertInterest): Promise<Interest> {
    const id = this.interestId++;
    const newInterest: Interest = { ...interest, id };
    
    const userInterests = this.userInterests.get(interest.userId) || [];
    userInterests.push(newInterest);
    this.userInterests.set(interest.userId, userInterests);
    
    return newInterest;
  }

  async getAllOnlineUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isOnline);
  }

  // Mood Reactions methods
  async addMoodReaction(reaction: InsertMoodReaction): Promise<MoodReaction> {
    const id = this.moodReactionId++;
    const now = new Date();
    
    const newReaction: MoodReaction = {
      id,
      fromUserId: reaction.fromUserId,
      toUserId: reaction.toUserId,
      emoji: reaction.emoji,
      createdAt: now.toISOString()
    };
    
    this.moodReactions.set(id, newReaction);
    return newReaction;
  }

  async getUserMoodReactions(userId: number): Promise<MoodReaction[]> {
    // Get all reactions received by a user
    return Array.from(this.moodReactions.values())
      .filter(reaction => reaction.toUserId === userId);
  }

  async getMoodReactionsBetweenUsers(fromUserId: number, toUserId: number): Promise<MoodReaction[]> {
    // Get all reactions between two specific users
    return Array.from(this.moodReactions.values())
      .filter(reaction => 
        (reaction.fromUserId === fromUserId && reaction.toUserId === toUserId) ||
        (reaction.fromUserId === toUserId && reaction.toUserId === fromUserId)
      );
  }
  // Report methods
  async createReport(report: InsertReport): Promise<Report> {
    const id = this.reportId++;
    const newReport: Report = {
      ...report,
      id,
      description: report.description ?? null,
      videoConnectionId: report.videoConnectionId ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.reports_store.set(id, newReport);
    return newReport;
  }

  async getReportsForUser(userId: number): Promise<Report[]> {
    return Array.from(this.reports_store.values())
      .filter(r => r.reportedUserId === userId);
  }

  // Block methods
  async createBlock(block: InsertBlock): Promise<Block> {
    // Check if already blocked
    for (const b of this.blocks_store.values()) {
      if (b.blockerUserId === block.blockerUserId && b.blockedUserId === block.blockedUserId) {
        return b;
      }
    }
    const id = this.blockId++;
    const newBlock: Block = {
      ...block,
      id,
      createdAt: new Date().toISOString(),
    };
    this.blocks_store.set(id, newBlock);
    return newBlock;
  }

  async removeBlock(blockerUserId: number, blockedUserId: number): Promise<boolean> {
    for (const [id, block] of this.blocks_store.entries()) {
      if (block.blockerUserId === blockerUserId && block.blockedUserId === blockedUserId) {
        this.blocks_store.delete(id);
        return true;
      }
    }
    return false;
  }

  async isBlocked(userId1: number, userId2: number): Promise<boolean> {
    for (const block of this.blocks_store.values()) {
      if ((block.blockerUserId === userId1 && block.blockedUserId === userId2) ||
          (block.blockerUserId === userId2 && block.blockedUserId === userId1)) {
        return true;
      }
    }
    return false;
  }

  async getBlockedUserIds(userId: number): Promise<number[]> {
    const blockedIds: number[] = [];
    for (const block of this.blocks_store.values()) {
      if (block.blockerUserId === userId) {
        blockedIds.push(block.blockedUserId);
      }
    }
    return blockedIds;
  }

  // Availability methods
  async getUserAvailability(userId: number): Promise<AvailabilityWindow[]> {
    return Array.from(this.availabilityWindows_store.values())
      .filter(w => w.userId === userId);
  }

  async setUserAvailability(userId: number, windows: InsertAvailabilityWindow[]): Promise<AvailabilityWindow[]> {
    // Remove existing windows for user
    for (const [id, w] of this.availabilityWindows_store.entries()) {
      if (w.userId === userId) {
        this.availabilityWindows_store.delete(id);
      }
    }
    // Add new windows
    const result: AvailabilityWindow[] = [];
    for (const window of windows) {
      const id = this.availabilityWindowId++;
      const newWindow: AvailabilityWindow = {
        ...window,
        id,
        userId,
        isRecurring: window.isRecurring ?? true,
        specificDate: window.specificDate ?? null,
        createdAt: new Date().toISOString(),
      };
      this.availabilityWindows_store.set(id, newWindow);
      result.push(newWindow);
    }
    return result;
  }

  async deleteAvailabilityWindow(id: number): Promise<boolean> {
    return this.availabilityWindows_store.delete(id);
  }

  async getAvailableUsersNow(): Promise<number[]> {
    const now = new Date();
    const currentDay = now.getDay(); // 0-6
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    const availableUserIds = new Set<number>();

    for (const window of this.availabilityWindows_store.values()) {
      const matchesDay = window.isRecurring
        ? window.dayOfWeek === currentDay
        : window.specificDate === today;

      if (matchesDay && currentTime >= window.startTime && currentTime <= window.endTime) {
        availableUserIds.add(window.userId);
      }
    }

    return Array.from(availableUserIds);
  }

  // Speed Roll methods
  async createSpeedRoll(roll: InsertSpeedRoll): Promise<SpeedRoll> {
    const id = this.speedRollId++;
    const newRoll: SpeedRoll = {
      ...roll,
      id,
      matchReason: roll.matchReason ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
      respondedAt: null,
    };
    this.speedRolls_store.set(id, newRoll);
    return newRoll;
  }

  async getSpeedRoll(id: number): Promise<SpeedRoll | undefined> {
    return this.speedRolls_store.get(id);
  }

  async updateSpeedRollStatus(id: number, status: string): Promise<SpeedRoll | undefined> {
    const roll = this.speedRolls_store.get(id);
    if (!roll) return undefined;
    const updated: SpeedRoll = {
      ...roll,
      status,
      respondedAt: status !== "pending" ? new Date().toISOString() : roll.respondedAt,
    };
    this.speedRolls_store.set(id, updated);
    return updated;
  }

  async getUserSpeedRollsToday(userId: number): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    for (const roll of this.speedRolls_store.values()) {
      if (roll.userId === userId && roll.createdAt && roll.createdAt.startsWith(today)) {
        count++;
      }
    }
    return count;
  }

  async getPendingSpeedRollForUser(targetUserId: number): Promise<SpeedRoll | undefined> {
    for (const roll of this.speedRolls_store.values()) {
      if (roll.targetUserId === targetUserId && roll.status === "pending") {
        return roll;
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
