import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  job: text("job"),
  bio: text("bio"),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  age: true,
  job: true,
  bio: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Interest = typeof interests.$inferSelect;
export type InsertMoodReaction = z.infer<typeof insertMoodReactionSchema>;
export type MoodReaction = typeof moodReactions.$inferSelect;
export type UpdateUserLocation = z.infer<typeof updateUserLocationSchema>;
export type UpdateUserOnlineStatus = z.infer<typeof updateUserOnlineStatusSchema>;
