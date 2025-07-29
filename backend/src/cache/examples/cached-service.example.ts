import { Injectable } from "@nestjs/common";

import { CacheEvict } from "../decorators/cache-evict.decorator";
import { Cacheable } from "../decorators/cacheable.decorator";

@Injectable()
export class CachedServiceExample {
  /**
   * Example of a cacheable method
   */
  @Cacheable({
    keyPrefix: "user-profile",
    ttl: 300, // 5 minutes
    keyGenerator: (userId: string) => `user-profile:${userId}`,
    condition: (result) => result !== null, // Only cache non-null results
  })
  async getUserProfile(userId: string) {
    // Simulate expensive operation
    console.log(`Fetching user profile for ${userId} from database...`);

    // This would be a real database call
    return {
      id: userId,
      name: "John Doe",
      email: "john@example.com",
      lastLogin: new Date(),
    };
  }

  /**
   * Example of cache eviction
   */
  @CacheEvict({
    keyGenerator: (userId: string) => [`user-profile:${userId}`],
  })
  async updateUserProfile(userId: string, profileData: any) {
    console.log(`Updating user profile for ${userId}...`);

    // This would be a real database update
    return {
      id: userId,
      ...profileData,
      updatedAt: new Date(),
    };
  }

  /**
   * Example of evicting multiple cache entries
   */
  @CacheEvict({
    keys: ["user-list:active", "user-list:all"],
    keyPrefixes: ["user-profile:"],
  })
  async deleteUser(userId: string) {
    console.log(`Deleting user ${userId}...`);

    // This would be a real database deletion
    return { deleted: true, userId };
  }

  /**
   * Example of clearing all cache
   */
  @CacheEvict({
    allEntries: true,
  })
  async resetAllData() {
    console.log("Resetting all data...");

    // This would reset all data
    return { reset: true, timestamp: new Date() };
  }
}
