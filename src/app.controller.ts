import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpException,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { InteractionType, InteractionResponseType } from 'discord.js';
import nacl from 'tweetnacl'; // Import tweetnacl for crypto operations

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post('/interactions')
  // handleInteraction(
  //   @Body() body: any,
  //   @Headers('X-Signature-Ed25519') signature: string,
  //   @Headers('X-Signature-Timestamp') timestamp: string,
  // ) {
  //   console.log('GOT INTERACTION');
  //   console.log(body);
  //   if (!this.isValidSignature(signature, timestamp, body)) {
  //     throw new ForbiddenException('Invalid signature');
  //   }

  //   if (!body.type) {
  //     throw new HttpException('something fucked up', 400);
  //   }

  //   if (body.type === InteractionType.Ping) {
  //     // Respond to PING with PONG
  //     return { type: InteractionResponseType.Pong };
  //   }

  //   // Default response for unsupported interaction types
  //   return { type: InteractionResponseType.Pong };
  // }

  // private isValidSignature(
  //   signature: string,
  //   timestamp: string,
  //   body: any,
  // ): boolean {
  //   // Create the message to verify by combining timestamp and body
  //   const bodyString = JSON.stringify(body);
  //   const message = timestamp + bodyString;

  //   // Convert the public key and signature into Uint8Arrays
  //   const publicKey = Buffer.from(process.env.PUBLIC_KEY ?? '', 'hex');
  //   const signatureBytes = Buffer.from(signature, 'hex');
  //   const messageBytes = Buffer.from(message, 'utf8');

  //   // Verify the signature using tweetnacl
  //   const res = nacl.sign.detached.verify(
  //     messageBytes,
  //     signatureBytes,
  //     publicKey,
  //   );
  //   console.log('REQUEST IS VALID: ' + res);
  //   return res;
  // }
}
