import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["SaaS", "Mobile", "E-Commerce", "AI/ML", "Tools", "Marketplace"]),
  mmr: z.number().min(0),
  price: z.number().min(100, "Price must be at least $100"),
  techStack: z.string().min(2, "Tech stack is required"),
  storeUrl: z.string().url().optional().or(z.literal("")),
  screenshots: z.string().optional().or(z.literal("")),
});

export const OfferSchema = z.object({
  projectId: z.string().cuid(),
  amount: z.number().min(1, "Amount must be positive"),
  message: z.string().max(500).optional(),
});

export const MessageSchema = z.object({
  content: z.string().min(1).max(1000),
  receiverId: z.string().cuid(),
  projectId: z.string().cuid().optional(),
});
