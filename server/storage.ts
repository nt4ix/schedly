import {
  users, type User, type InsertUser,
  availabilities, type Availability, type InsertAvailability,
  calendarConnections, type CalendarConnection, type InsertCalendarConnection,
  meetingTypes, type MeetingType, type InsertMeetingType,
  meetings, type Meeting, type InsertMeeting,
  onboardingProgress, type OnboardingProgress, type InsertOnboardingProgress
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { pool } from "./db";

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Availability operations
  getAvailabilitiesByUserId(userId: number): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, availability: Partial<Availability>): Promise<Availability | undefined>;
  deleteAvailability(id: number): Promise<boolean>;
  
  // Calendar connection operations
  getCalendarConnectionsByUserId(userId: number): Promise<CalendarConnection[]>;
  createCalendarConnection(connection: InsertCalendarConnection): Promise<CalendarConnection>;
  updateCalendarConnection(id: number, connection: Partial<CalendarConnection>): Promise<CalendarConnection | undefined>;
  deleteCalendarConnection(id: number): Promise<boolean>;
  
  // Meeting type operations
  getMeetingTypesByUserId(userId: number): Promise<MeetingType[]>;
  getMeetingTypeBySlug(userId: number, slug: string): Promise<MeetingType | undefined>;
  createMeetingType(meetingType: InsertMeetingType): Promise<MeetingType>;
  updateMeetingType(id: number, meetingType: Partial<MeetingType>): Promise<MeetingType | undefined>;
  deleteMeetingType(id: number): Promise<boolean>;
  
  // Meeting operations
  getMeetingsByUserId(userId: number): Promise<Meeting[]>;
  getMeeting(id: number): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<Meeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: number): Promise<boolean>;
  
  // Onboarding progress operations
  getOnboardingProgressByUserId(userId: number): Promise<OnboardingProgress | undefined>;
  createOnboardingProgress(progress: InsertOnboardingProgress): Promise<OnboardingProgress>;
  updateOnboardingProgress(userId: number, progress: Partial<OnboardingProgress>): Promise<OnboardingProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private availabilities: Map<number, Availability>;
  private calendarConnections: Map<number, CalendarConnection>;
  private meetingTypes: Map<number, MeetingType>;
  private meetings: Map<number, Meeting>;
  private onboardingProgress: Map<number, OnboardingProgress>;
  
  private currentUserId: number;
  private currentAvailabilityId: number;
  private currentCalendarConnectionId: number;
  private currentMeetingTypeId: number;
  private currentMeetingId: number;
  private currentOnboardingProgressId: number;
  
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.availabilities = new Map();
    this.calendarConnections = new Map();
    this.meetingTypes = new Map();
    this.meetings = new Map();
    this.onboardingProgress = new Map();
    
    this.currentUserId = 1;
    this.currentAvailabilityId = 1;
    this.currentCalendarConnectionId = 1;
    this.currentMeetingTypeId = 1;
    this.currentMeetingId = 1;
    this.currentOnboardingProgressId = 1;
    
    // Create memory session store
    const MemoryStoreSession = MemoryStore(session);
    this.sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const timestamp = new Date();
    const user: User = { ...insertUser, id, created_at: timestamp };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Availability operations
  async getAvailabilitiesByUserId(userId: number): Promise<Availability[]> {
    return Array.from(this.availabilities.values()).filter(
      (availability) => availability.userId === userId
    );
  }
  
  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const id = this.currentAvailabilityId++;
    const availability: Availability = { ...insertAvailability, id };
    this.availabilities.set(id, availability);
    return availability;
  }
  
  async updateAvailability(id: number, updateData: Partial<Availability>): Promise<Availability | undefined> {
    const availability = this.availabilities.get(id);
    if (!availability) return undefined;
    
    const updatedAvailability = { ...availability, ...updateData };
    this.availabilities.set(id, updatedAvailability);
    return updatedAvailability;
  }
  
  async deleteAvailability(id: number): Promise<boolean> {
    return this.availabilities.delete(id);
  }
  
  // Calendar connection operations
  async getCalendarConnectionsByUserId(userId: number): Promise<CalendarConnection[]> {
    return Array.from(this.calendarConnections.values()).filter(
      (connection) => connection.userId === userId
    );
  }
  
  async createCalendarConnection(insertConnection: InsertCalendarConnection): Promise<CalendarConnection> {
    const id = this.currentCalendarConnectionId++;
    const timestamp = new Date();
    const connection: CalendarConnection = { ...insertConnection, id, created_at: timestamp };
    this.calendarConnections.set(id, connection);
    return connection;
  }
  
  async updateCalendarConnection(
    id: number, 
    updateData: Partial<CalendarConnection>
  ): Promise<CalendarConnection | undefined> {
    const connection = this.calendarConnections.get(id);
    if (!connection) return undefined;
    
    const updatedConnection = { ...connection, ...updateData };
    this.calendarConnections.set(id, updatedConnection);
    return updatedConnection;
  }
  
  async deleteCalendarConnection(id: number): Promise<boolean> {
    return this.calendarConnections.delete(id);
  }
  
  // Meeting type operations
  async getMeetingTypesByUserId(userId: number): Promise<MeetingType[]> {
    return Array.from(this.meetingTypes.values()).filter(
      (meetingType) => meetingType.userId === userId
    );
  }
  
  async getMeetingTypeBySlug(userId: number, slug: string): Promise<MeetingType | undefined> {
    return Array.from(this.meetingTypes.values()).find(
      (meetingType) => meetingType.userId === userId && meetingType.slug === slug
    );
  }
  
  async createMeetingType(insertMeetingType: InsertMeetingType): Promise<MeetingType> {
    const id = this.currentMeetingTypeId++;
    const timestamp = new Date();
    const meetingType: MeetingType = { ...insertMeetingType, id, created_at: timestamp };
    this.meetingTypes.set(id, meetingType);
    return meetingType;
  }
  
  async updateMeetingType(id: number, updateData: Partial<MeetingType>): Promise<MeetingType | undefined> {
    const meetingType = this.meetingTypes.get(id);
    if (!meetingType) return undefined;
    
    const updatedMeetingType = { ...meetingType, ...updateData };
    this.meetingTypes.set(id, updatedMeetingType);
    return updatedMeetingType;
  }
  
  async deleteMeetingType(id: number): Promise<boolean> {
    return this.meetingTypes.delete(id);
  }
  
  // Meeting operations
  async getMeetingsByUserId(userId: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(
      (meeting) => meeting.userId === userId
    );
  }
  
  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }
  
  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = this.currentMeetingId++;
    const timestamp = new Date();
    const meeting: Meeting = { ...insertMeeting, id, created_at: timestamp };
    this.meetings.set(id, meeting);
    return meeting;
  }
  
  async updateMeeting(id: number, updateData: Partial<Meeting>): Promise<Meeting | undefined> {
    const meeting = this.meetings.get(id);
    if (!meeting) return undefined;
    
    const updatedMeeting = { ...meeting, ...updateData };
    this.meetings.set(id, updatedMeeting);
    return updatedMeeting;
  }
  
  async deleteMeeting(id: number): Promise<boolean> {
    return this.meetings.delete(id);
  }
  
  // Onboarding progress operations
  async getOnboardingProgressByUserId(userId: number): Promise<OnboardingProgress | undefined> {
    return Array.from(this.onboardingProgress.values()).find(
      (progress) => progress.userId === userId
    );
  }
  
  async createOnboardingProgress(insertProgress: InsertOnboardingProgress): Promise<OnboardingProgress> {
    const id = this.currentOnboardingProgressId++;
    const progress: OnboardingProgress = { ...insertProgress, id };
    this.onboardingProgress.set(id, progress);
    return progress;
  }
  
  async updateOnboardingProgress(
    userId: number, 
    updateData: Partial<OnboardingProgress>
  ): Promise<OnboardingProgress | undefined> {
    const progress = Array.from(this.onboardingProgress.values()).find(
      (progress) => progress.userId === userId
    );
    
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updateData };
    this.onboardingProgress.set(progress.id, updatedProgress);
    return updatedProgress;
  }
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }
  
  // Availability operations
  async getAvailabilitiesByUserId(userId: number): Promise<Availability[]> {
    return db
      .select()
      .from(availabilities)
      .where(eq(availabilities.userId, userId));
  }
  
  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const [availability] = await db
      .insert(availabilities)
      .values(insertAvailability)
      .returning();
    return availability;
  }
  
  async updateAvailability(id: number, updateData: Partial<Availability>): Promise<Availability | undefined> {
    const [updatedAvailability] = await db
      .update(availabilities)
      .set(updateData)
      .where(eq(availabilities.id, id))
      .returning();
    return updatedAvailability || undefined;
  }
  
  async deleteAvailability(id: number): Promise<boolean> {
    const result = await db
      .delete(availabilities)
      .where(eq(availabilities.id, id));
    return true; // In Drizzle ORM, delete doesn't return count
  }
  
  // Calendar connection operations
  async getCalendarConnectionsByUserId(userId: number): Promise<CalendarConnection[]> {
    return db
      .select()
      .from(calendarConnections)
      .where(eq(calendarConnections.userId, userId));
  }
  
  async createCalendarConnection(insertConnection: InsertCalendarConnection): Promise<CalendarConnection> {
    const [connection] = await db
      .insert(calendarConnections)
      .values(insertConnection)
      .returning();
    return connection;
  }
  
  async updateCalendarConnection(
    id: number, 
    updateData: Partial<CalendarConnection>
  ): Promise<CalendarConnection | undefined> {
    const [updatedConnection] = await db
      .update(calendarConnections)
      .set(updateData)
      .where(eq(calendarConnections.id, id))
      .returning();
    return updatedConnection || undefined;
  }
  
  async deleteCalendarConnection(id: number): Promise<boolean> {
    await db
      .delete(calendarConnections)
      .where(eq(calendarConnections.id, id));
    return true;
  }
  
  // Meeting type operations
  async getMeetingTypesByUserId(userId: number): Promise<MeetingType[]> {
    return db
      .select()
      .from(meetingTypes)
      .where(eq(meetingTypes.userId, userId));
  }
  
  async getMeetingTypeBySlug(userId: number, slug: string): Promise<MeetingType | undefined> {
    const [meetingType] = await db
      .select()
      .from(meetingTypes)
      .where(and(
        eq(meetingTypes.userId, userId),
        eq(meetingTypes.slug, slug)
      ));
    return meetingType || undefined;
  }
  
  async createMeetingType(insertMeetingType: InsertMeetingType): Promise<MeetingType> {
    const [meetingType] = await db
      .insert(meetingTypes)
      .values(insertMeetingType)
      .returning();
    return meetingType;
  }
  
  async updateMeetingType(id: number, updateData: Partial<MeetingType>): Promise<MeetingType | undefined> {
    const [updatedMeetingType] = await db
      .update(meetingTypes)
      .set(updateData)
      .where(eq(meetingTypes.id, id))
      .returning();
    return updatedMeetingType || undefined;
  }
  
  async deleteMeetingType(id: number): Promise<boolean> {
    await db
      .delete(meetingTypes)
      .where(eq(meetingTypes.id, id));
    return true;
  }
  
  // Meeting operations
  async getMeetingsByUserId(userId: number): Promise<Meeting[]> {
    return db
      .select()
      .from(meetings)
      .where(eq(meetings.userId, userId));
  }
  
  async getMeeting(id: number): Promise<Meeting | undefined> {
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, id));
    return meeting || undefined;
  }
  
  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const [meeting] = await db
      .insert(meetings)
      .values(insertMeeting)
      .returning();
    return meeting;
  }
  
  async updateMeeting(id: number, updateData: Partial<Meeting>): Promise<Meeting | undefined> {
    const [updatedMeeting] = await db
      .update(meetings)
      .set(updateData)
      .where(eq(meetings.id, id))
      .returning();
    return updatedMeeting || undefined;
  }
  
  async deleteMeeting(id: number): Promise<boolean> {
    await db
      .delete(meetings)
      .where(eq(meetings.id, id));
    return true;
  }
  
  // Onboarding progress operations
  async getOnboardingProgressByUserId(userId: number): Promise<OnboardingProgress | undefined> {
    const [progress] = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId));
    return progress || undefined;
  }
  
  async createOnboardingProgress(insertProgress: InsertOnboardingProgress): Promise<OnboardingProgress> {
    const [progress] = await db
      .insert(onboardingProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }
  
  async updateOnboardingProgress(
    userId: number, 
    updateData: Partial<OnboardingProgress>
  ): Promise<OnboardingProgress | undefined> {
    const [updatedProgress] = await db
      .update(onboardingProgress)
      .set(updateData)
      .where(eq(onboardingProgress.userId, userId))
      .returning();
    return updatedProgress || undefined;
  }
}

export const storage = new DatabaseStorage();
