import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
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
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  isOnline: boolean("is_online").default(false),
});

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
});

export const moodReactions = pgTable("mood_reactions", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoConnections = pgTable("video_connections", {
  id: serial("id").primaryKey(),
  userOneId: integer("user_one_id").notNull().references(() => users.id),
  userTwoId: integer("user_two_id").notNull().references(() => users.id),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  duration: integer("duration"), // in seconds
  userOnePicked: boolean("user_one_picked").default(false),
  userTwoPicked: boolean("user_two_picked").default(false),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  userOneId: integer("user_one_id").notNull().references(() => users.id),
  userTwoId: integer("user_two_id").notNull().references(() => users.id),
  videoConnectionId: integer("video_connection_id").notNull().references(() => videoConnections.id),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  matchId: integer("match_id").notNull().references(() => matches.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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
