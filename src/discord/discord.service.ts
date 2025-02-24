import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  DISCORD_APPLICATION_ID,
  DISCORD_COMMAND_COOLDOWN_SECONDS,
  DISCORD_COMMAND_RATE_LIMIT_USAGE_COUNT,
  DISCORD_COMMAND_RATE_LIMIT_WINDOW_MS,
} from 'src/constants';
import { DiscordEntitlement } from './discord.interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class DiscordService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private getCooldownKey(userId: string, command: string) {
    return `cooldown:${userId}:${command}`;
  }

  private getRateLimitKey(userId: string, command: string) {
    return `ratelimit:${userId}:${command}`;
  }

  public async getEntitlements() {
    const { data } = await firstValueFrom(
      this.httpService.get<DiscordEntitlement[]>(
        `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/entitlements`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        },
      ),
    );
    return data;
  }

  async isPremiumUser(userId: string) {
    const entitlements = await this.getEntitlements();
    return entitlements.some((entitlement) => entitlement.user_id === userId);
  }

  async enforceShortCooldown(
    userId: string,
    command: string,
    cooldownTime = DISCORD_COMMAND_COOLDOWN_SECONDS,
  ): Promise<number> {
    const spamKey = this.getCooldownKey(userId, command);
    const exists = await this.redis.get(spamKey);
    const now = Date.now();

    if (exists) {
      return now - parseInt(exists);
    }

    await this.redis.set(spamKey, now, 'EX', cooldownTime);
    return 0;
  }

  async enforceRateLimit(
    userId: string,
    command: string,
    limit = DISCORD_COMMAND_RATE_LIMIT_USAGE_COUNT,
    window = DISCORD_COMMAND_RATE_LIMIT_WINDOW_MS,
  ): Promise<{ remaining: number; isLimited: boolean }> {
    const key = this.getRateLimitKey(userId, command);
    const now = Date.now();

    await this.redis.zremrangebyscore(key, 0, now - window);

    const usageCount = await this.redis.zcard(key);

    if (usageCount >= limit) {
      return { remaining: limit - usageCount, isLimited: true };
    }

    // Add the current usage with a timestamp
    await this.redis.zadd(key, now, now);

    // Set expiry for the key to auto-clear old data
    await this.redis.expire(key, window);

    return { remaining: limit - usageCount - 1, isLimited: false };
  }
}
