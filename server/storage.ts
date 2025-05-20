import { 
  users, type User, type InsertUser, 
  contacts, type Contact, type InsertContact,
  logos, type Logo, type InsertLogo,
  portfolioItems, type PortfolioItem, type InsertPortfolioItem,
  siteSettings, type SiteSettings, type UpdateSiteSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact management
  createContact(contact: Omit<InsertContact, "privacy">): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getContactsByDateRange(startDate: Date, endDate: Date): Promise<Contact[]>;
  
  // Logo management
  createLogo(logo: InsertLogo): Promise<Logo>;
  getLogos(): Promise<Logo[]>;
  deleteLogo(id: number): Promise<boolean>;
  
  // Portfolio management
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getPortfolioItems(): Promise<PortfolioItem[]>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  // Site settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: UpdateSiteSettings): Promise<SiteSettings>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact management
  async createContact(contactData: Omit<InsertContact, "privacy">): Promise<Contact> {
    const [contact] = await db.insert(contacts).values({
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      businessType: contactData.businessType,
      message: contactData.message
    }).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContactsByDateRange(startDate: Date, endDate: Date): Promise<Contact[]> {
    return await db.select().from(contacts).where(
      and(
        gte(contacts.createdAt, startDate),
        lte(contacts.createdAt, endDate)
      )
    ).orderBy(desc(contacts.createdAt));
  }

  // Logo management
  async createLogo(logo: InsertLogo): Promise<Logo> {
    const [newLogo] = await db.insert(logos).values(logo).returning();
    return newLogo;
  }

  async getLogos(): Promise<Logo[]> {
    return await db.select().from(logos).orderBy(desc(logos.createdAt));
  }

  async deleteLogo(id: number): Promise<boolean> {
    const result = await db.delete(logos).where(eq(logos.id, id)).returning();
    return result.length > 0;
  }

  // Portfolio management
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [newItem] = await db.insert(portfolioItems).values(item).returning();
    return newItem;
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    const result = await db.delete(portfolioItems).where(eq(portfolioItems.id, id)).returning();
    return result.length > 0;
  }

  // Site settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings);
    return settings || undefined;
  }

  async updateSiteSettings(settings: UpdateSiteSettings): Promise<SiteSettings> {
    // Verifica se esiste già un record
    const existing = await this.getSiteSettings();
    
    if (existing) {
      // Aggiorna il record esistente
      const [updated] = await db.update(siteSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Crea un nuovo record
      const [created] = await db.insert(siteSettings)
        .values({ ...settings })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
