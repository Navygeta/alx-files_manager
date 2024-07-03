import { createClient } from 'redis';
import { promisify } from 'util';

// RedisClient class to handle common Redis commands
class RedisClient {
  constructor() {
    // Create a new Redis client
    this.client = createClient();

    // Handle connection errors
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  // Check if the Redis client is connected
  isAlive() {
    return this.client.connected;
  }

  // Get a value from Redis for the given key
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    return redisGet(key); // Removed unnecessary await
  }

  // Set a key-value pair in Redis with an optional expiration time (in seconds)
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    if (time) {
      await this.client.expire(key, time);
    }
  }

  // Delete a key-value pair from Redis
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

// Create a singleton instance of RedisClient
const redisClient = new RedisClient();

// Export the Redis client instance
module.exports = redisClient;
