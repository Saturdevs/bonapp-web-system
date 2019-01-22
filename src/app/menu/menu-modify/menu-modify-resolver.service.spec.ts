import { TestBed, inject } from '@angular/core/testing';

import { MenuModifyResolverService } from './menu-modify-resolver.service';

describe('MenuModifyResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuModifyResolverService]
    });
  });

  it('should be created', inject([MenuModifyResolverService], (service: MenuModifyResolverService) => {
    expect(service).toBeTruthy();
  }));
});
