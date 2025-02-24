import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { DiscordService } from 'src/discord/discord.service';

export const IS_PREMIUM_KEY = 'isPremium';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(private readonly discordService: DiscordService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const interaction = context
      .switchToRpc()
      .getData<[ChatInputCommandInteraction]>()[0];
    const userId = interaction.user.id;

    const isPremium = await this.discordService.isPremiumUser(userId);

    Reflect.defineMetadata(IS_PREMIUM_KEY, isPremium, context.getHandler());

    return true;
  }
}
