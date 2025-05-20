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
  description: text("description").notNull(),
  businessImageUrl: text("business_image_url").notNull(),
  websiteImageUrl: text("website_image_url").notNull(),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  metaPixelId: text("meta_pixel_id"),
  otherTracking: text("other_tracking"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
