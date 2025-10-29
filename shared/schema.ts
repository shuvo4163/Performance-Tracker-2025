import { z } from "zod";

// Performance Entry Schema
export const performanceEntrySchema = z.object({
  id: z.string(),
  date: z.string().optional().or(z.literal("")), // Date field for the entry
  link: z.string().url().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  views: z.number().optional(),
  reach: z.number().optional(),
  engagement: z.number().optional(),
  voiceArtist: z.string().optional().or(z.literal("")),
  scriptWriter: z.string().optional().or(z.literal("")),
  videoEditor: z.string().optional().or(z.literal("")),
  topicSelector: z.string().optional().or(z.literal("")),
  mojoReporter: z.string().optional().or(z.literal("")),
  jelaReporter: z.string().optional().or(z.literal("")),
  photoCard: z.string().optional().or(z.literal("")),
  seo: z.string().optional().or(z.literal("")),
  websiteNews: z.string().optional().or(z.literal("")),
  contentStatus: z.enum([
    "writing",
    "footage",
    "voiceover",
    "thumbnail",
    "editing",
    "ready",
    "alldone",
    "published"
  ]).optional(),
  createdAt: z.string(), // ISO date string
});

export const insertPerformanceEntrySchema = performanceEntrySchema.omit({ id: true, createdAt: true });

export type PerformanceEntry = z.infer<typeof performanceEntrySchema>;
export type InsertPerformanceEntry = z.infer<typeof insertPerformanceEntrySchema>;

// Admin Settings Schema
export const adminSettingsSchema = z.object({
  currentMonth: z.string(), // Format: "YYYY-MM"
  employeeOfMonthMessage: z.string(),
});

export type AdminSettings = z.infer<typeof adminSettingsSchema>;

// YouTube Video Info Response
export const youtubeVideoInfoSchema = z.object({
  title: z.string(),
  views: z.number(),
});

export type YouTubeVideoInfo = z.infer<typeof youtubeVideoInfoSchema>;

// Employee Data Schema
export const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  designation: z.string().optional().or(z.literal("")),
  holiday: z.string().optional().or(z.literal("")),
  salary: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  officeShift: z.string().optional().or(z.literal("")),
  officeInTime: z.string().optional().or(z.literal("")),
  officeOutTime: z.string().optional().or(z.literal("")),
  remarks: z.string().optional().or(z.literal("")),
  createdAt: z.string(),
});

export const insertEmployeeSchema = employeeSchema.omit({ id: true, createdAt: true });

export type Employee = z.infer<typeof employeeSchema>;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

// Jela Reporter Data Schema
export const jelaReporterSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  designation: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  remarks: z.string().optional().or(z.literal("")),
  createdAt: z.string(),
});

export const insertJelaReporterSchema = jelaReporterSchema.omit({ id: true, createdAt: true });

export type JelaReporter = z.infer<typeof jelaReporterSchema>;
export type InsertJelaReporter = z.infer<typeof insertJelaReporterSchema>;
