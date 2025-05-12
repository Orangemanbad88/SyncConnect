import { 
  users, 
  interests, 
  type User, 
  type InsertUser, 
  type Interest, 
  type InsertInterest,
  type UpdateUserLocation,
  type UpdateUserOnlineStatus
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userInterests: Map<number, Interest[]>;
  currentId: number;
  interestId: number;

  constructor() {
    this.users = new Map();
    this.userInterests = new Map();
    this.currentId = 1;
    this.interestId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed with sample users for development
    const sampleUsers: InsertUser[] = [
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
    ];

    // Create sample users
    sampleUsers.forEach((userData) => {
      this.createUser(userData).then((user) => {
        // Set some users as online for demo purposes
        if (["michael", "sarah", "emma", "david"].includes(user.username)) {
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
    const user: User = { ...insertUser, id, isOnline: false };
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
}

export const storage = new MemStorage();
