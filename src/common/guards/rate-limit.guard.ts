import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { DiscordService } from 'src/discord/discord.service';
import { IS_PREMIUM_KEY } from './premium.guard';
import { Reflector } from '@nestjs/core';
import { RateLimitException } from '../exceptions/rate-limit.exception';

export const REMAINING_USES_KEY = 'remainingUses';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly discordService: DiscordService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPremium = this.reflector.get<boolean>(
      IS_PREMIUM_KEY,
      context.getHandler(),
    );

    if (isPremium) {
      Reflect.defineMetadata(REMAINING_USES_KEY, -1, context.getHandler());
      return true;
    }

    const interaction = context
      .switchToRpc()
      .getData<[ChatInputCommandInteraction]>()[0];
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }

    const { remaining, isLimited } = await this.discordService.enforceRateLimit(
      interaction.user.id,
      interaction.commandName,
    );

    if (isLimited) {
      throw new RateLimitException();
    }

    Reflect.defineMetadata(REMAINING_USES_KEY, remaining, context.getHandler());

    return true;
  }
}
