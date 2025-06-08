import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  type: text("type", { enum: ["video", "image", "link"] }).notNull(),
  url: text("url").notNull(), // Video URL, Image URL, or Website URL
  thumbnailUrl: text("thumbnail_url"), // For videos and images
  websiteUrl: text("website_url"), // For link type items
  tags: text("tags").array(),
  featured: boolean("featured").default(false), // For home page display
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  metaPixelId: text("meta_pixel_id"),
  otherTracking: text("other_tracking"),
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
  .omit({ id: true, createdAt: true });

export const updateSiteSettingsSchema = createInsertSchema(siteSettings)
  .omit({ id: true, updatedAt: true });

export const insertBlogPostSchema = createInsertSchema(blogPosts)
  .omit({ id: true, createdAt: true, updatedAt: true, publishedAt: true });

export const updateBlogPostSchema = createInsertSchema(blogPosts)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export const insertBlogCategorySchema = createInsertSchema(blogCategories)
  .omit({ id: true, createdAt: true });

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
