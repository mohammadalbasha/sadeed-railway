import { Test, TestingModule } from '@nestjs/testing';
import { IpResolver } from './ip.resolver';

describe('IpResolver', () => {
  let resolver: IpResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpResolver],
    }).compile();

    resolver = module.get<IpResolver>(IpResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
