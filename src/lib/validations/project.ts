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
  revenueModel: z.string().optional(),
  churnRate: z.number().optional(),
  ltv: z.number().optional(),
  appSize: z.string().optional(),
  ageRating: z.string().optional(),
  languages: z.string().optional(),
  lastUpdate: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  mau: z.number().optional(),
  last28DayRevenue: z.number().optional(),
  monthlyExpenses: z.number().optional(),
  pricingStrategy: z.enum(["FIXED", "OFFERS"]).optional(),
  isOffersAccepted: z.boolean().optional(),
  assetsIncluded: z.string().optional(),
  reasonForSelling: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
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
  fileUrl: z.string().url().optional().or(z.literal("")),
  fileType: z.string().optional().or(z.literal("")),
});
