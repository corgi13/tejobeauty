import { UserPreferencesService } from "./user-preferences.service";
export declare class UserPreferencesController {
    private readonly userPreferencesService;
    constructor(userPreferencesService: UserPreferencesService);
    getUserLanguage(userId: string, user: any): Promise<{
        error: string;
        language?: undefined;
    } | {
        language: string;
        error?: undefined;
    }>;
    setUserLanguage(userId: string, language: string, user: any): Promise<any>;
    getEmailPreferences(userId: string, user: any): Promise<any>;
    updateEmailPreferences(userId: string, preferences: any, user: any): Promise<any>;
}
