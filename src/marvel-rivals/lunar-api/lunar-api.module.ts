import { Module } from '@nestjs/common';
import { LunarApiService } from './lunar-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [LunarApiService],
  imports: [
    HttpModule.register({
      baseURL: 'https://mrapi.org/api',
    }),
  ],
  exports: [HttpModule],
})
export class LunarApiModule {}
