import { TestBed } from '@angular/core/testing';

import { MenuAvailablesResolverService } from './menu-availables-resolver.service';

describe('MenuAvailablesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuAvailablesResolverService = TestBed.get(MenuAvailablesResolverService);
    expect(service).toBeTruthy();
  });
});
