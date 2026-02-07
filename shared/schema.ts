import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  job: text("job"),
  bio: text("bio"),
  location: text("location"),
  zodiacSign: text("zodiac_sign"),
  profileImage: text("profile_image").default("/default-avatar.png"),
  coverImage: text("cover_image").default("/default-cover.png"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isOnline: integer("is_online", { mode: "boolean" }).default(false),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
});

export const interests = sqliteTable("interests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
});

export const moodReactions = sqliteTable("mood_reactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  emoji: text("emoji").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const videoConnections = sqliteTable("video_connections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userOneId: integer("user_one_id").notNull().references(() => users.id),
  userTwoId: integer("user_two_id").notNull().references(() => users.id),
  startedAt: text("started_at").default(sql`CURRENT_TIMESTAMP`),
  endedAt: text("ended_at"),
  duration: integer("duration"), // in seconds
  userOnePicked: integer("user_one_picked", { mode: "boolean" }).default(false),
  userTwoPicked: integer("user_two_picked", { mode: "boolean" }).default(false),
});

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userOneId: integer("user_one_id").notNull().references(() => users.id),
  userTwoId: integer("user_two_id").notNull().references(() => users.id),
  videoConnectionId: integer("video_connection_id").notNull().references(() => videoConnections.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  matchId: integer("match_id").notNull().references(() => matches.id),
  content: text("content").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
  age: true,
  job: true,
  bio: true,
  location: true,
  zodiacSign: true,
  profileImage: true,
  coverImage: true,
  latitude: true,
  longitude: true,
});

export const insertInterestSchema = createInsertSchema(interests).pick({
  userId: true,
  name: true,
});

export const updateUserLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const updateUserOnlineStatusSchema = z.object({
  isOnline: z.boolean(),
});

export const insertMoodReactionSchema = createInsertSchema(moodReactions).pick({
  fromUserId: true,
  toUserId: true,
  emoji: true,
});

export const insertVideoConnectionSchema = createInsertSchema(videoConnections).pick({
  userOneId: true,
  userTwoId: true,
});

export const updateVideoConnectionSchema = createInsertSchema(videoConnections).pick({
  endedAt: true,
  duration: true,
});

export const updatePickStatusSchema = z.object({
  userOnePicked: z.boolean().optional(),
  userTwoPicked: z.boolean().optional()
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  userOneId: true,
  userTwoId: true,
  videoConnectionId: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  fromUserId: true,
  toUserId: true,
  matchId: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Interest = typeof interests.$inferSelect;
export type InsertMoodReaction = z.infer<typeof insertMoodReactionSchema>;
export type MoodReaction = typeof moodReactions.$inferSelect;
export type InsertVideoConnection = z.infer<typeof insertVideoConnectionSchema>;
export type UpdateVideoConnection = z.infer<typeof updateVideoConnectionSchema>;
export type UpdatePickStatus = z.infer<typeof updatePickStatusSchema>;
export type VideoConnection = typeof videoConnections.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type UpdateUserLocation = z.infer<typeof updateUserLocationSchema>;
export type UpdateUserOnlineStatus = z.infer<typeof updateUserOnlineStatusSchema>;

// User Recommendations table for personalized connections
export const userRecommendations = sqliteTable("user_recommendations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  recommendedUserId: integer("recommended_user_id").notNull().references(() => users.id),
  score: real("score").notNull(), // recommendation score from 0.0 to 1.0
  reason: text("reason"), // reason for the recommendation (e.g., "Similar interests", "Near you")
  isViewed: integer("is_viewed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertRecommendationSchema = createInsertSchema(userRecommendations).pick({
  userId: true,
  recommendedUserId: true,
  score: true,
  reason: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof userRecommendations.$inferSelect;

// Reports table for safety
export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reporterUserId: integer("reporter_user_id").notNull().references(() => users.id),
  reportedUserId: integer("reported_user_id").notNull().references(() => users.id),
  reason: text("reason").notNull(), // inappropriate, harassment, fake_profile, spam, other
  description: text("description"),
  videoConnectionId: integer("video_connection_id"),
  status: text("status").notNull().default("pending"), // pending, reviewed, resolved
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  reporterUserId: true,
  reportedUserId: true,
  reason: true,
  description: true,
  videoConnectionId: true,
});

export const reportReasonEnum = z.enum(["inappropriate", "harassment", "fake_profile", "spam", "other"]);

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// Blocks table for safety
export const blocks = sqliteTable("blocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blockerUserId: integer("blocker_user_id").notNull().references(() => users.id),
  blockedUserId: integer("blocked_user_id").notNull().references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertBlockSchema = createInsertSchema(blocks).pick({
  blockerUserId: true,
  blockedUserId: true,
});

export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type Block = typeof blocks.$inferSelect;

// Availability windows for scheduling
export const availabilityWindows = sqliteTable("availability_windows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sun-Sat)
  startTime: text("start_time").notNull(), // "HH:MM"
  endTime: text("end_time").notNull(), // "HH:MM"
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(true),
  specificDate: text("specific_date"), // nullable, for one-time windows
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertAvailabilityWindowSchema = createInsertSchema(availabilityWindows).pick({
  userId: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  isRecurring: true,
  specificDate: true,
});

export type InsertAvailabilityWindow = z.infer<typeof insertAvailabilityWindowSchema>;
export type AvailabilityWindow = typeof availabilityWindows.$inferSelect;

// Speed Rolls table
export const speedRolls = sqliteTable("speed_rolls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  targetUserId: integer("target_user_id").notNull().references(() => users.id),
  compatibilityScore: real("compatibility_score").notNull(),
  matchReason: text("match_reason"),
  status: text("status").notNull().default("pending"), // pending, accepted, declined, expired
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  respondedAt: text("responded_at"),
});

export const insertSpeedRollSchema = createInsertSchema(speedRolls).pick({
  userId: true,
  targetUserId: true,
  compatibilityScore: true,
  matchReason: true,
});

export type InsertSpeedRoll = z.infer<typeof insertSpeedRollSchema>;
export type SpeedRoll = typeof speedRolls.$inferSelect;
