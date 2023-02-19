import { Test, TestingModule } from '@nestjs/testing';
import { CentralRoleResolver } from './central-role.resolver';

describe('CentralRoleResolver', () => {
  let resolver: CentralRoleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CentralRoleResolver],
    }).compile();

    resolver = module.get<CentralRoleResolver>(CentralRoleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
