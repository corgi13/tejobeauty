import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma.service";

@Injectable()
export class UserPreferencesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get the user's preferred language
   * @param userId The user ID
   * @returns The user's preferred language or 'en' as default
   */
  async getUserLanguage(userId: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { language: true },
      });

      return user?.language || "en";
    } catch (error) {
      console.error(`Error getting user language: ${error.message}`);
      return "en"; // Default to English
    }
  }

  /**
   * Set the user's preferred language
   * @param userId The user ID
   * @param language The language code
   * @returns The updated user
   */
  async setUserLanguage(userId: string, language: string): Promise<any> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { language },
        select: { id: true, email: true, language: true },
      });
    } catch (error) {
      console.error(`Error setting user language: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the user's email preferences
   * @param userId The user ID
   * @returns The user's email preferences
   */
  async getEmailPreferences(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          emailMarketingConsent: true,
          emailOrderUpdates: true,
          emailProductUpdates: true,
        },
      });

      return (
        user || {
          emailMarketingConsent: false,
          emailOrderUpdates: true,
          emailProductUpdates: false,
        }
      );
    } catch (error) {
      console.error(`Error getting email preferences: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update the user's email preferences
   * @param userId The user ID
   * @param preferences The email preferences
   * @returns The updated user
   */
  async updateEmailPreferences(userId: string, preferences: any): Promise<any> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          emailMarketingConsent: preferences.emailMarketingConsent,
          emailOrderUpdates: preferences.emailOrderUpdates,
          emailProductUpdates: preferences.emailProductUpdates,
        },
        select: {
          id: true,
          email: true,
          emailMarketingConsent: true,
          emailOrderUpdates: true,
          emailProductUpdates: true,
        },
      });
    } catch (error) {
      console.error(`Error updating email preferences: ${error.message}`);
      throw error;
    }
  }
}
