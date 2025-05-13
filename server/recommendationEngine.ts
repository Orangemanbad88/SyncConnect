import { User, InsertRecommendation } from "@shared/schema";
import { storage } from "./storage";

interface UserSimilarity {
  userId: number;
  score: number;
  reason: string;
}

/**
 * Recommendation Engine for the Sync app
 * Analyzes user data to generate personalized recommendations
 */
export class RecommendationEngine {
  
  /**
   * Generate recommendations for a specific user
   * @param userId The user ID to generate recommendations for
   * @param maxRecommendations Maximum number of recommendations to generate
   * @returns Promise resolving to true if recommendations were generated successfully
   */
  public async generateRecommendationsFor(userId: number, maxRecommendations: number = 5): Promise<boolean> {
    try {
      // Get the user we're generating recommendations for
      const user = await storage.getUser(userId);
      if (!user) {
        console.error(`Cannot generate recommendations: User ${userId} not found`);
        return false;
      }
      
      // Get all users to compare against
      const allUsers = await storage.getAllOnlineUsers();
      
      // Filter out the current user from potential matches
      const potentialMatches = allUsers.filter(potentialMatch => potentialMatch.id !== userId);
      
      if (potentialMatches.length === 0) {
        console.warn(`No potential matches found for user ${userId}`);
        return false;
      }
      
      // Calculate similarity scores for each potential match
      const similarityScores: UserSimilarity[] = await Promise.all(
        potentialMatches.map(async (potentialMatch) => {
          const { score, reason } = await this.calculateUserSimilarity(user, potentialMatch);
          return {
            userId: potentialMatch.id,
            score,
            reason
          };
        })
      );
      
      // Sort by similarity score (highest first)
      similarityScores.sort((a, b) => b.score - a.score);
      
      // Take the top recommendations
      const topRecommendations = similarityScores.slice(0, maxRecommendations);
      
      // Store recommendations in the database
      for (const recommendation of topRecommendations) {
        const recommendationData: InsertRecommendation = {
          userId: userId,
          recommendedUserId: recommendation.userId,
          score: recommendation.score,
          reason: recommendation.reason
        };
        
        await storage.createRecommendation(recommendationData);
      }
      
      console.log(`Generated ${topRecommendations.length} recommendations for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`Error generating recommendations for user ${userId}:`, error);
      return false;
    }
  }
  
  /**
   * Calculate similarity between two users based on multiple factors
   * @param user1 The first user
   * @param user2 The second user
   * @returns Object containing similarity score and reason for recommendation
   */
  private async calculateUserSimilarity(user1: User, user2: User): Promise<{ score: number, reason: string }> {
    // Initialize factors
    let locationScore = 0;
    let ageScore = 0;
    let interestsScore = 0;
    let zodiacScore = 0;
    let jobScore = 0;
    
    let primaryReason = "";
    let totalScore = 0;
    
    // Calculate location proximity (if available)
    if (user1.latitude && user1.longitude && user2.latitude && user2.longitude) {
      const distance = this.calculateDistance(
        user1.latitude, 
        user1.longitude, 
        user2.latitude, 
        user2.longitude
      );
      
      // Score based on distance (higher score for closer users)
      if (distance < 1) {
        locationScore = 0.9; // Very close
        primaryReason = "They're very close to your location";
      } else if (distance < 5) {
        locationScore = 0.7; // Fairly close
        primaryReason = "They're near your location";
      } else if (distance < 10) {
        locationScore = 0.5; // Moderate distance
        primaryReason = "They're in your area";
      } else if (distance < 20) {
        locationScore = 0.3; // Somewhat distant
      } else {
        locationScore = 0.1; // Far away
      }
    }
    
    // Calculate age compatibility (preference for similar ages)
    const ageDifference = Math.abs(user1.age - user2.age);
    if (ageDifference <= 2) {
      ageScore = 0.9;
      if (!primaryReason) primaryReason = "Similar age to you";
    } else if (ageDifference <= 5) {
      ageScore = 0.7;
      if (!primaryReason) primaryReason = "Close to your age";
    } else if (ageDifference <= 10) {
      ageScore = 0.4;
    } else {
      ageScore = 0.2;
    }
    
    // Calculate job similarity (if available)
    if (user1.job && user2.job) {
      // Simple check if job fields contain similar keywords
      const job1Lower = user1.job.toLowerCase();
      const job2Lower = user2.job.toLowerCase();
      
      // Check for common profession keywords
      const commonProfessions = [
        'engineer', 'developer', 'designer', 'manager', 
        'doctor', 'artist', 'teacher', 'student', 
        'consultant', 'analyst', 'writer', 'chef'
      ];
      
      for (const profession of commonProfessions) {
        if (job1Lower.includes(profession) && job2Lower.includes(profession)) {
          jobScore = 0.8;
          if (!primaryReason) primaryReason = "Similar profession";
          break;
        }
      }
      
      // If no direct match, still give some score for having jobs listed
      if (jobScore === 0) {
        jobScore = 0.3;
      }
    }
    
    // Check zodiac compatibility (if available)
    if (user1.zodiacSign && user2.zodiacSign) {
      const compatibleSigns = this.getCompatibleZodiacSigns(user1.zodiacSign);
      if (compatibleSigns.includes(user2.zodiacSign)) {
        zodiacScore = 0.7;
        if (!primaryReason) primaryReason = "Compatible zodiac signs";
      } else {
        zodiacScore = 0.3;
      }
    }
    
    // Fetch and compare interests (if available)
    const user1Interests = await storage.getUserInterests(user1.id);
    const user2Interests = await storage.getUserInterests(user2.id);
    
    if (user1Interests.length > 0 && user2Interests.length > 0) {
      const user1InterestNames = user1Interests.map(i => i.name.toLowerCase());
      const user2InterestNames = user2Interests.map(i => i.name.toLowerCase());
      
      // Count matching interests
      let matchingInterests = 0;
      for (const interest of user1InterestNames) {
        if (user2InterestNames.includes(interest)) {
          matchingInterests++;
        }
      }
      
      // Calculate score based on number of matching interests
      if (matchingInterests > 2) {
        interestsScore = 0.9;
        if (!primaryReason) primaryReason = "Several shared interests";
      } else if (matchingInterests > 0) {
        interestsScore = 0.6;
        if (!primaryReason) primaryReason = "Some shared interests";
      } else {
        interestsScore = 0.2;
      }
    }
    
    // Calculate weighted total score
    // Prioritize different factors
    totalScore = (
      locationScore * 0.3 + // 30% weight on location
      ageScore * 0.2 +      // 20% weight on age
      interestsScore * 0.25 + // 25% weight on shared interests
      zodiacScore * 0.1 +   // 10% weight on zodiac
      jobScore * 0.15       // 15% weight on profession
    );
    
    // Round to 2 decimal places
    totalScore = Math.round(totalScore * 100) / 100;
    
    // If no specific reason was identified, use a generic one
    if (!primaryReason) {
      primaryReason = "Potential match based on your profile";
    }
    
    return {
      score: totalScore,
      reason: primaryReason
    };
  }
  
  /**
   * Calculate distance between two geographical coordinates in miles
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadius = 3958.8; // miles
    const lat1Rad = this.toRadians(lat1);
    const lat2Rad = this.toRadians(lat2);
    const deltaLat = this.toRadians(lat2 - lat1);
    const deltaLon = this.toRadians(lon2 - lon1);
  
    const a = 
      Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
      Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadius * c;
  }
  
  private toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }
  
  /**
   * Get compatible zodiac signs for a given sign
   * This is a simplified compatibility matrix
   */
  private getCompatibleZodiacSigns(sign: string): string[] {
    const sign_lower = sign.toLowerCase();
    
    const compatibilityMap: Record<string, string[]> = {
      'aries': ['leo', 'sagittarius', 'gemini', 'aquarius'],
      'taurus': ['virgo', 'capricorn', 'cancer', 'pisces'],
      'gemini': ['libra', 'aquarius', 'aries', 'leo'],
      'cancer': ['scorpio', 'pisces', 'taurus', 'virgo'],
      'leo': ['aries', 'sagittarius', 'gemini', 'libra'],
      'virgo': ['taurus', 'capricorn', 'cancer', 'scorpio'],
      'libra': ['gemini', 'aquarius', 'leo', 'sagittarius'],
      'scorpio': ['cancer', 'pisces', 'virgo', 'capricorn'],
      'sagittarius': ['aries', 'leo', 'libra', 'aquarius'],
      'capricorn': ['taurus', 'virgo', 'scorpio', 'pisces'],
      'aquarius': ['gemini', 'libra', 'aries', 'sagittarius'],
      'pisces': ['cancer', 'scorpio', 'taurus', 'capricorn']
    };
    
    return compatibilityMap[sign_lower] || [];
  }
}

// Create singleton instance
export const recommendationEngine = new RecommendationEngine();