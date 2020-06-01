import { TestBed } from '@angular/core/testing';

import { UserRolesEditResolverService } from './user-roles-edit-resolver.service';

describe('UserRolesEditResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRolesEditResolverService = TestBed.inject(UserRolesEditResolverService);
    expect(service).toBeTruthy();
  });
});
