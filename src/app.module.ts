import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NecordModule } from 'necord';
import { ConfigModule } from '@nestjs/config';
import { IntentsBitField } from 'discord.js';
import { AppCommands } from './app.commands';
import { MarvelRivalsModule } from './marvel-rivals/marvel-rivals.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NecordModule.forRoot({
      token: process.env.DISCORD_BOT_TOKEN ?? '',
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
      ],
      development: ['546094494873944080'],
    }),
    MarvelRivalsModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppCommands],
})
export class AppModule {}
