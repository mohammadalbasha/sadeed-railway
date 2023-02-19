import { Test, TestingModule } from '@nestjs/testing';
import { CentralRoleService } from './central-role.service';

describe('CentralRoleService', () => {
  let service: CentralRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CentralRoleService],
    }).compile();

    service = module.get<CentralRoleService>(CentralRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
