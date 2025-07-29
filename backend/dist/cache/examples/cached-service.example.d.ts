export declare class CachedServiceExample {
    getUserProfile(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        lastLogin: Date;
    }>;
    updateUserProfile(userId: string, profileData: any): Promise<any>;
    deleteUser(userId: string): Promise<{
        deleted: boolean;
        userId: string;
    }>;
    resetAllData(): Promise<{
        reset: boolean;
        timestamp: Date;
    }>;
}
