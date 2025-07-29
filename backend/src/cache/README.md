# Caching System

This module provides a comprehensive caching solution for the Tejo Nails platform using Redis as the primary cache store with in-memory fallback for development.

## Features

- **Redis Integration**: Primary cache store with automatic fallback to in-memory cache
- **Cache Service**: High-level API for cache operations
- **Decorators**: Easy-to-use decorators for method-level caching
- **Cache Warming**: Automatic cache warming on application startup
- **Cache Management**: Admin endpoints for cache management
- **Interceptors**: Automatic caching and eviction based on decorators

## Configuration

### Environment Variables

```env
# Redis Configuration
REDIS_URL=redis://138.199.226.201:6379

# Cache Configuration
CACHE_WARM_ON_START=true
```

### Module Setup

The cache module is automatically configured and imported in the main application module.

## Usage

### Basic Cache Operations

```typescript
import { CacheService } from "./cache/cache.service";

@Injectable()
export class MyService {
  constructor(private readonly cacheService: CacheService) {}

  async getData(id: string) {
    const cacheKey = this.cacheService.generateKey("data", id);

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        // Expensive operation
        return await this.fetchDataFromDatabase(id);
      },
      300, // Cache for 5 minutes
    );
  }
}
```

### Using Decorators

```typescript
import { Cacheable, CacheEvict } from "./cache/decorators";

@Injectable()
export class UserService {
  @Cacheable({
    keyPrefix: "user",
    ttl: 300,
    keyGenerator: (id: string) => `user:${id}`,
  })
  async getUser(id: string) {
    return await this.userRepository.findById(id);
  }

  @CacheEvict({
    keyGenerator: (id: string) => [`user:${id}`],
  })
  async updateUser(id: string, data: any) {
    return await this.userRepository.update(id, data);
  }
}
```

## Cache Keys

The system uses a hierarchical key structure:

- `products:list:{skip}:{take}:{categoryId}:{isActive}` - Product listings
- `product:{id}` - Individual products by ID
- `product:slug:{slug}` - Individual products by slug
- `categories:list:all` - All categories
- `categories:tree` - Category tree structure
- `settings:common` - Common application settings

## Cache Management

### Admin Endpoints

- `GET /api/cache/stats` - Get cache statistics
- `DELETE /api/cache/clear` - Clear all cache
- `DELETE /api/cache/key/:key` - Delete specific cache key
- `GET /api/cache/key/:key` - Get specific cache key value
- `POST /api/cache/warm-up?type=all` - Warm up cache
- `POST /api/cache/invalidate/products` - Invalidate product cache
- `POST /api/cache/invalidate/categories` - Invalidate category cache

### Cache Warming

The system automatically warms up commonly accessed data on startup:

- Popular products (first 20)
- All active categories
- Common application settings

## Best Practices

### 1. Cache Key Naming

Use descriptive, hierarchical keys:

```typescript
// Good
const key = this.cacheService.generateKey("user", "profile", userId);

// Bad
const key = `user_${userId}`;
```

### 2. TTL Selection

Choose appropriate TTL values based on data volatility:

- Static data (categories): 10-30 minutes
- Semi-static data (products): 3-5 minutes
- Dynamic data (user sessions): 1-2 minutes
- Frequently changing data: Don't cache or use very short TTL

### 3. Cache Invalidation

Always invalidate related cache entries when data changes:

```typescript
@CacheEvict({
  keyGenerator: (productId: string) => [
    `product:${productId}`,
    `product:slug:*`, // Would need pattern matching
    'products:list:*', // Would need pattern matching
  ],
})
async updateProduct(productId: string, data: any) {
  // Update logic
}
```

### 4. Error Handling

The cache service includes built-in error handling and will gracefully degrade if Redis is unavailable.

### 5. Memory Management

Monitor cache memory usage and set appropriate limits:

- Max items: 1000 (configurable)
- Default TTL: 5 minutes
- Automatic eviction of expired items

## Monitoring

### Cache Hit Rates

Monitor cache effectiveness through:

- Cache hit/miss ratios
- Response time improvements
- Database query reduction

### Memory Usage

Monitor Redis memory usage and adjust limits as needed.

## Development vs Production

### Development

- Uses in-memory cache if Redis is not available
- Cache warming is disabled by default
- Shorter TTL values for faster development

### Production

- Requires Redis connection
- Cache warming enabled on startup
- Longer TTL values for better performance
- Monitoring and alerting for cache failures

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check REDIS_URL environment variable
   - Verify Redis server is running
   - Check network connectivity

2. **Cache Not Working**
   - Verify decorators are properly applied
   - Check if interceptor is registered
   - Review cache key generation

3. **Memory Issues**
   - Monitor Redis memory usage
   - Adjust max items limit
   - Review TTL values

### Debug Mode

Enable debug logging to see cache operations:

```typescript
// In development
console.log("Cache operation:", { key, operation, result });
```
