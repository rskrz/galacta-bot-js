import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { EXCLUDED_PHRASES } from 'src/constants';

@Injectable()
export class GeminiService {
  constructor(private readonly httpService: HttpService) {}
  async getUsernamesFromImage(imageUrl: string, mimeType: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          description: 'List of player usernames',
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
            description: 'Player username',
            nullable: false,
          },
        },
      },
    });

    const { data } = await firstValueFrom(
      this.httpService.get<Buffer>(imageUrl, {
        responseType: 'arraybuffer',
      }),
    );

    const prompt = 'Parse the usernames from this video game image.';

    const result = await model.generateContent([
      prompt,
      {
        inlineData: { data: data.toString('base64'), mimeType },
      },
    ]);

    const usernames = JSON.parse(result.response.text()) as string[];

    const filteredUsernames = usernames.filter(
      (name) => !EXCLUDED_PHRASES.includes(name),
    );

    return filteredUsernames.slice(-6);
  }
}
