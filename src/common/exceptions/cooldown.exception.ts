import { ForbiddenException } from '@nestjs/common';
import { DISCORD_COMMAND_COOLDOWN_SECONDS } from 'src/constants';

export class CooldownException extends ForbiddenException {
  constructor(public remainingTime: number) {
    super(
      `⏳Slow down! Try again in ${(DISCORD_COMMAND_COOLDOWN_SECONDS - remainingTime / 1000).toFixed(0)} seconds.`,
    );
  }
}
