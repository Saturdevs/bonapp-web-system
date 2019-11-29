import { TestBed } from '@angular/core/testing';

import { MenuHascategoryResolverService } from './menu-hascategory-resolver.service';

describe('MenuHascategoryResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuHascategoryResolverService = TestBed.get(MenuHascategoryResolverService);
    expect(service).toBeTruthy();
  });
});
