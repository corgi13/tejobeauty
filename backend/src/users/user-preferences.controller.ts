import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";

import { UserPreferencesService } from "./user-preferences.service";
import { User } from "../auth/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("api/users")
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get(":userId/language")
  async getUserLanguage(@Param("userId") userId: string, @User() user: any) {
    // Ensure the user is accessing their own data
    if (user.id !== userId) {
      return { error: "Unauthorized" };
    }

    const language = await this.userPreferencesService.getUserLanguage(userId);
    return { language };
  }

  @Put(":userId/language")
  async setUserLanguage(
    @Param("userId") userId: string,
    @Body("language") language: string,
    @User() user: any,
  ) {
    // Ensure the user is updating their own data
    if (user.id !== userId) {
      return { error: "Unauthorized" };
    }

    const updatedUser = await this.userPreferencesService.setUserLanguage(
      userId,
      language,
    );
    return updatedUser;
  }

  @Get(":userId/email-preferences")
  async getEmailPreferences(
    @Param("userId") userId: string,
    @User() user: any,
  ) {
    // Ensure the user is accessing their own data
    if (user.id !== userId) {
      return { error: "Unauthorized" };
    }

    const preferences =
      await this.userPreferencesService.getEmailPreferences(userId);
    return preferences;
  }

  @Put(":userId/email-preferences")
  async updateEmailPreferences(
    @Param("userId") userId: string,
    @Body() preferences: any,
    @User() user: any,
  ) {
    // Ensure the user is updating their own data
    if (user.id !== userId) {
      return { error: "Unauthorized" };
    }

    const updatedUser =
      await this.userPreferencesService.updateEmailPreferences(
        userId,
        preferences,
      );
    return updatedUser;
  }
}
