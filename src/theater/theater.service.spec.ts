import { Test, TestingModule } from '@nestjs/testing';
import { TheaterService } from './theater.service';

describe('TheaterService', () => {
  let service: TheaterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TheaterService],
    }).compile();

    service = module.get<TheaterService>(TheaterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
