import { Test, TestingModule } from '@nestjs/testing';
import { MarvelRivalsApiService } from './marvel-rivals-api.service';

describe('MarvelRivalsApiService', () => {
  let service: MarvelRivalsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarvelRivalsApiService],
    }).compile();

    service = module.get<MarvelRivalsApiService>(MarvelRivalsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
