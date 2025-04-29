import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertAvailabilitySchema, 
  insertCalendarConnectionSchema, 
  insertMeetingTypeSchema, 
  insertMeetingSchema, 
  insertOnboardingProgressSchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import express from "express";
import { setupAuth } from "./auth";

// Helper function to handle validation errors
function handleValidationError(err: unknown, res: Response) {
  if (err instanceof z.ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({ message: validationError.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: () => void) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if username is already taken
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Check if email is already taken
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create user
      const user = await storage.createUser(userData);
      
      // Create onboarding progress
      await storage.createOnboardingProgress({
        userId: user.id,
        currentStep: 1,
        calendarConnected: false,
        availabilitySet: false,
        profileComplete: false,
        completed: false
      });

      // Set up session
      req.session.userId = user.id;

      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("schedly.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // User routes
  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      if (id !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      if (id !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent updating username and password for simplicity
      const { username, password, ...updatableFields } = req.body;
      
      const updatedUser = await storage.updateUser(id, updatableFields);
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Availability routes
  app.get("/api/availability", requireAuth, async (req, res) => {
    try {
      const availabilities = await storage.getAvailabilitiesByUserId(req.session.userId);
      res.json(availabilities);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.post("/api/availability", requireAuth, async (req, res) => {
    try {
      const availabilityData = {
        ...insertAvailabilitySchema.parse(req.body),
        userId: req.session.userId
      };

      const availability = await storage.createAvailability(availabilityData);
      res.status(201).json(availability);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/availability/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid availability ID" });
      }

      const existingAvailability = await storage.updateAvailability(id, req.body);
      if (!existingAvailability) {
        return res.status(404).json({ message: "Availability not found" });
      }

      if (existingAvailability.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(existingAvailability);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/availability/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid availability ID" });
      }

      // Need to get availability first to check ownership
      const existingAvailability = await storage.updateAvailability(id, {});
      if (!existingAvailability) {
        return res.status(404).json({ message: "Availability not found" });
      }

      if (existingAvailability.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteAvailability(id);
      res.json({ message: "Availability deleted successfully" });
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Calendar connection routes
  app.get("/api/calendar-connections", requireAuth, async (req, res) => {
    try {
      const connections = await storage.getCalendarConnectionsByUserId(req.session.userId);
      res.json(connections);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.post("/api/calendar-connections", requireAuth, async (req, res) => {
    try {
      const connectionData = {
        ...insertCalendarConnectionSchema.parse(req.body),
        userId: req.session.userId
      };

      const connection = await storage.createCalendarConnection(connectionData);
      
      // Update onboarding progress
      const onboarding = await storage.getOnboardingProgressByUserId(req.session.userId);
      if (onboarding) {
        await storage.updateOnboardingProgress(req.session.userId, {
          calendarConnected: true
        });
      }
      
      res.status(201).json(connection);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/calendar-connections/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid connection ID" });
      }

      // Need to get connection first to check ownership
      const existingConnection = await storage.updateCalendarConnection(id, {});
      if (!existingConnection) {
        return res.status(404).json({ message: "Connection not found" });
      }

      if (existingConnection.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteCalendarConnection(id);
      res.json({ message: "Calendar connection removed successfully" });
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Meeting type routes
  app.get("/api/meeting-types", requireAuth, async (req, res) => {
    try {
      const meetingTypes = await storage.getMeetingTypesByUserId(req.session.userId);
      res.json(meetingTypes);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.post("/api/meeting-types", requireAuth, async (req, res) => {
    try {
      const meetingTypeData = {
        ...insertMeetingTypeSchema.parse(req.body),
        userId: req.session.userId
      };

      const meetingType = await storage.createMeetingType(meetingTypeData);
      res.status(201).json(meetingType);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/meeting-types/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meeting type ID" });
      }

      // Need to get meeting type first to check ownership
      const existingMeetingType = await storage.updateMeetingType(id, {});
      if (!existingMeetingType) {
        return res.status(404).json({ message: "Meeting type not found" });
      }

      if (existingMeetingType.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedMeetingType = await storage.updateMeetingType(id, req.body);
      res.json(updatedMeetingType);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/meeting-types/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meeting type ID" });
      }

      // Need to get meeting type first to check ownership
      const existingMeetingType = await storage.updateMeetingType(id, {});
      if (!existingMeetingType) {
        return res.status(404).json({ message: "Meeting type not found" });
      }

      if (existingMeetingType.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteMeetingType(id);
      res.json({ message: "Meeting type deleted successfully" });
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Meeting routes
  app.get("/api/meetings", requireAuth, async (req, res) => {
    try {
      const meetings = await storage.getMeetingsByUserId(req.session.userId);
      res.json(meetings);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.post("/api/meetings", requireAuth, async (req, res) => {
    try {
      const meetingData = {
        ...insertMeetingSchema.parse(req.body),
        userId: req.session.userId
      };

      const meeting = await storage.createMeeting(meetingData);
      res.status(201).json(meeting);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.get("/api/meetings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meeting ID" });
      }

      const meeting = await storage.getMeeting(id);
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      if (meeting.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(meeting);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/meetings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meeting ID" });
      }

      const existingMeeting = await storage.getMeeting(id);
      if (!existingMeeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      if (existingMeeting.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedMeeting = await storage.updateMeeting(id, req.body);
      res.json(updatedMeeting);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/meetings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meeting ID" });
      }

      const existingMeeting = await storage.getMeeting(id);
      if (!existingMeeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      if (existingMeeting.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteMeeting(id);
      res.json({ message: "Meeting deleted successfully" });
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Onboarding progress routes
  app.get("/api/onboarding", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getOnboardingProgressByUserId(req.session.userId);
      if (!progress) {
        return res.status(404).json({ message: "Onboarding progress not found" });
      }

      res.json(progress);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/onboarding", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const existingProgress = await storage.getOnboardingProgressByUserId(userId);
      
      if (!existingProgress) {
        // Create if it doesn't exist
        const newProgress = await storage.createOnboardingProgress({
          userId,
          currentStep: req.body.currentStep || 1,
          calendarConnected: req.body.calendarConnected || false,
          availabilitySet: req.body.availabilitySet || false,
          profileComplete: req.body.profileComplete || false,
          completed: req.body.completed || false
        });
        return res.json(newProgress);
      }
      
      const updatedProgress = await storage.updateOnboardingProgress(userId, req.body);
      res.json(updatedProgress);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Public booking routes
  app.get("/api/booking/:username/:slug", async (req, res) => {
    try {
      const { username, slug } = req.params;
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Find meeting type by slug
      const meetingType = await storage.getMeetingTypeBySlug(user.id, slug);
      if (!meetingType) {
        return res.status(404).json({ message: "Meeting type not found" });
      }
      
      // Get user's availability
      const availabilities = await storage.getAvailabilitiesByUserId(user.id);
      
      // Return booking information
      const { password, ...userPublicInfo } = user;
      res.json({
        user: userPublicInfo,
        meetingType,
        availabilities
      });
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Schedule a meeting as a guest
  app.post("/api/booking/:username/:slug", async (req, res) => {
    try {
      const { username, slug } = req.params;
      const { startTime, endTime, attendees, timezone } = req.body;
      
      if (!startTime || !endTime || !attendees || !timezone) {
        return res.status(400).json({ message: "Missing required booking information" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Find meeting type by slug
      const meetingType = await storage.getMeetingTypeBySlug(user.id, slug);
      if (!meetingType) {
        return res.status(404).json({ message: "Meeting type not found" });
      }
      
      // Create the meeting
      const meeting = await storage.createMeeting({
        meetingTypeId: meetingType.id,
        userId: user.id,
        title: meetingType.name,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        timezone,
        location: meetingType.location || "To be determined",
        attendees,
        confirmed: true
      });
      
      res.status(201).json({
        message: "Meeting scheduled successfully",
        meeting
      });
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
