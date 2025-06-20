import { pgTable, text, varchar, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  businessType: text("business_type").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const logos = pgTable("logos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  websiteUrl: text("website_url").notNull(), // Link al sito realizzato
  coverImage: text("cover_image").notNull(), // Foto di copertina
  featured: boolean("featured").default(false), // Per visualizzazione in home
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  metaPixelId: text("meta_pixel_id"),
  otherTracking: text("other_tracking"),
  paypalPaymentUrl: text("paypal_payment_url"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  status: text("status", { enum: ["draft", "published"] }).default("draft").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPostCategories = pgTable("blog_post_categories", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id, { onDelete: "cascade" }).notNull(),
  categoryId: integer("category_id").references(() => blogCategories.id, { onDelete: "cascade" }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts)
  .omit({ id: true, createdAt: true })
  .extend({
    privacy: z.boolean().refine(val => val === true, {
      message: 'Devi accettare la privacy policy',
    }),
  });

export const insertLogoSchema = createInsertSchema(logos)
  .omit({ id: true, createdAt: true });

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems)
  .omit({ id: true, createdAt: true, sortOrder: true });

export const landingGalleryImages = pgTable("landing_gallery_images", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileName: varchar("file_name", { length: 255 }),
  filePath: varchar("file_path", { length: 500 }),
  imageUrl: varchar("image_url", { length: 500 }), // Backward compatibility
  altText: varchar("alt_text", { length: 255 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const updateSiteSettingsSchema = createInsertSchema(siteSettings)
  .omit({ id: true, updatedAt: true });

export type LandingGalleryImage = typeof landingGalleryImages.$inferSelect;
export type InsertLandingGalleryImage = typeof landingGalleryImages.$inferInsert;

// Landing page spots tracking
export const landingSpots = pgTable("landing_spots", {
  id: serial("id").primaryKey(),
  totalSpots: integer("total_spots").default(10),
  reservedSpots: integer("reserved_spots").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type LandingSpot = typeof landingSpots.$inferSelect;
export type InsertLandingSpot = typeof landingSpots.$inferInsert;

export const insertBlogPostSchema = createInsertSchema(blogPosts)
  .omit({ id: true, createdAt: true, updatedAt: true, publishedAt: true });

export const updateBlogPostSchema = createInsertSchema(blogPosts)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export const insertBlogCategorySchema = createInsertSchema(blogCategories)
  .omit({ id: true, createdAt: true });

export const insertLandingGalleryImageSchema = createInsertSchema(landingGalleryImages)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    sortOrder: z.number().default(0),
    isActive: z.boolean().default(true)
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertLogo = z.infer<typeof insertLogoSchema>;
export type Logo = typeof logos.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;

export type InsertLandingGalleryImage = z.infer<typeof insertLandingGalleryImageSchema>;
export type LandingGalleryImage = typeof landingGalleryImages.$inferSelect;
