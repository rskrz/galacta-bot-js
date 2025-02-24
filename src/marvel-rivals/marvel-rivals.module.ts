import { Module } from '@nestjs/common';
import { MarvelRivalsApiService } from './marvel-rivals-api.service';
import { LunarApiModule } from './lunar-api/lunar-api.module';
import { LunarApiService } from './lunar-api/lunar-api.service';
import { MarvelRivalsCommands } from './marvel-rivals.commands';
import { MarvelRivalsService } from './marvel-rivals.service';
import { GeminiModule } from 'src/gemini/gemini.module';
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  providers: [
    {
      provide: MarvelRivalsApiService,
      useClass: LunarApiService,
    },
    MarvelRivalsCommands,
    MarvelRivalsService,
  ],
  imports: [LunarApiModule, GeminiModule, DiscordModule],
  exports: [MarvelRivalsApiService],
})
export class MarvelRivalsModule {}
