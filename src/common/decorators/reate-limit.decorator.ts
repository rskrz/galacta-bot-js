import { applyDecorators, UseGuards, UseFilters } from '@nestjs/common';
import { PremiumGuard } from '../guards/premium.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { RateLimitExceptionFilter } from '../filters/rate-limit-exception.filter';

export function UseRateLimit() {
  return applyDecorators(
    UseGuards(PremiumGuard, RateLimitGuard),
    UseFilters(RateLimitExceptionFilter),
  );
}
