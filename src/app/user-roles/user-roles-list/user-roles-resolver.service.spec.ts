import { TestBed } from '@angular/core/testing';

import { UserRolesResolverService } from './user-roles-resolver.service';

describe('UserRolesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRolesResolverService = TestBed.inject(UserRolesResolverService);
    expect(service).toBeTruthy();
  });
});
