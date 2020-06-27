import { TestBed } from '@angular/core/testing';

import { MenuAvailablesWithCategoriesResolverService } from './menu-availables-with-categories-resolver.service';

describe('MenuAvailablesWithCategoriesResolverService', () => {
  let service: MenuAvailablesWithCategoriesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuAvailablesWithCategoriesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
