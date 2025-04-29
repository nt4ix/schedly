import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email").notNull().unique(),
  timezone: text("timezone").default("UTC"),
  profilePicture: text("profile_picture"),
  created_at: timestamp("created_at").defaultNow()
});

// Availability model for user's schedulable time slots
export const availabilities = pgTable("availabilities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6, 0 is Sunday
  startTime: text("start_time").notNull(), // Format: HH:MM
  endTime: text("end_time").notNull(), // Format: HH:MM
});

// Calendar connections for users
export const calendarConnections = pgTable("calendar_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // "google", "outlook", "apple"
  tokenData: text("token_data"), // Store safely, in real app should be encrypted
  refreshToken: text("refresh_token"),
  connected: boolean("connected").default(true),
  created_at: timestamp("created_at").defaultNow()
});

// Meeting types configured by users
export const meetingTypes = pgTable("meeting_types", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
  description: text("description"),
  color: text("color").default("#1C4A1C"),
  location: text("location"), // Can be a URL for video calls
  slug: text("slug").notNull(), // For shareable URL
  created_at: timestamp("created_at").defaultNow()
});

// Scheduled meetings
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  meetingTypeId: integer("meeting_type_id").notNull().references(() => meetingTypes.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Host user ID
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  timezone: text("timezone").notNull(),
  location: text("location"),
  attendees: jsonb("attendees").default([]), // Array of {email, name}
  confirmed: boolean("confirmed").default(false),
  created_at: timestamp("created_at").defaultNow()
});

// Onboarding progress
export const onboardingProgress = pgTable("onboarding_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  currentStep: integer("current_step").default(1),
  calendarConnected: boolean("calendar_connected").default(false),
  availabilitySet: boolean("availability_set").default(false), 
  profileComplete: boolean("profile_complete").default(false),
  completed: boolean("completed").default(false)
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, created_at: true });

export const insertAvailabilitySchema = createInsertSchema(availabilities)
  .omit({ id: true });

export const insertCalendarConnectionSchema = createInsertSchema(calendarConnections)
  .omit({ id: true, created_at: true });

export const insertMeetingTypeSchema = createInsertSchema(meetingTypes)
  .omit({ id: true, created_at: true });

export const insertMeetingSchema = createInsertSchema(meetings)
  .omit({ id: true, created_at: true });

export const insertOnboardingProgressSchema = createInsertSchema(onboardingProgress)
  .omit({ id: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type Availability = typeof availabilities.$inferSelect;

export type InsertCalendarConnection = z.infer<typeof insertCalendarConnectionSchema>;
export type CalendarConnection = typeof calendarConnections.$inferSelect;

export type InsertMeetingType = z.infer<typeof insertMeetingTypeSchema>;
export type MeetingType = typeof meetingTypes.$inferSelect;

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

export type InsertOnboardingProgress = z.infer<typeof insertOnboardingProgressSchema>;
export type OnboardingProgress = typeof onboardingProgress.$inferSelect;

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  availabilities: many(availabilities),
  calendarConnections: many(calendarConnections),
  meetingTypes: many(meetingTypes),
  meetings: many(meetings),
  onboardingProgress: one(onboardingProgress, {
    fields: [users.id],
    references: [onboardingProgress.userId],
  }),
}));

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  user: one(users, {
    fields: [availabilities.userId],
    references: [users.id],
  }),
}));

export const calendarConnectionsRelations = relations(calendarConnections, ({ one }) => ({
  user: one(users, {
    fields: [calendarConnections.userId],
    references: [users.id],
  }),
}));

export const meetingTypesRelations = relations(meetingTypes, ({ one, many }) => ({
  user: one(users, {
    fields: [meetingTypes.userId],
    references: [users.id],
  }),
  meetings: many(meetings),
}));

export const meetingsRelations = relations(meetings, ({ one }) => ({
  user: one(users, {
    fields: [meetings.userId],
    references: [users.id],
  }),
  meetingType: one(meetingTypes, {
    fields: [meetings.meetingTypeId],
    references: [meetingTypes.id],
  }),
}));

export const onboardingProgressRelations = relations(onboardingProgress, ({ one }) => ({
  user: one(users, {
    fields: [onboardingProgress.userId],
    references: [users.id],
  }),
}));
