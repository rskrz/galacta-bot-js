import { applyDecorators, UseGuards, UseFilters } from '@nestjs/common';
import { CooldownGuard } from '../guards/cooldown.guard';
import { CooldownExceptionFilter } from '../filters/cooldown-exception.filter';
import { PremiumGuard } from '../guards/premium.guard';

export function UseCooldown() {
  return applyDecorators(
    UseGuards(PremiumGuard, CooldownGuard),
    UseFilters(CooldownExceptionFilter),
  );
}
