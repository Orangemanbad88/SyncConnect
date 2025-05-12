import { 
  users, 
  interests,
  moodReactions,
  videoConnections,
  matches,
  messages,
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
  type UpdateUserOnlineStatus
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  currentId: number;
  interestId: number;
  moodReactionId: number;
  videoConnectionId: number;
  matchId: number;
  messageId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.userInterests = new Map();
    this.moodReactions = new Map();
    this.videoConnections = new Map();
    this.matches = new Map();
    this.messages = new Map();
    this.currentId = 1;
    this.interestId = 1;
    this.moodReactionId = 1;
    this.videoConnectionId = 1;
    this.matchId = 1;
    this.messageId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    this.seedData();
  }

  private seedData() {
    // Seed with sample users for development
    const sampleUsers = [
      {
        username: "michael",
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

    // Create sample users
    sampleUsers.forEach((userData) => {
      this.createUser(userData).then((user) => {
        // Set some users as online for demo purposes
        if (["michael", "sarah", "emma", "david", "olivia", "noah", "sophia", "ava"].includes(user.username)) {
          this.updateUserOnlineStatus(user.id, { isOnline: true });
        }

        // Add interests for Michael
        if (user.username === "michael") {
          this.addUserInterest({ userId: user.id, name: "Hiking" });
          this.addUserInterest({ userId: user.id, name: "Photography" });
          this.addUserInterest({ userId: user.id, name: "Coding" });
          this.addUserInterest({ userId: user.id, name: "Coffee" });
          this.addUserInterest({ userId: user.id, name: "Travel" });
        }
      });
    });
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
      isOnline: false
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
      createdAt: now
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
}

export const storage = new MemStorage();
