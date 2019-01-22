import { TestBed, inject } from '@angular/core/testing';

import { MenuResolverService } from './menu-resolver.service';

describe('MenuResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuResolverService]
    });
  });

  it('should be created', inject([MenuResolverService], (service: MenuResolverService) => {
    expect(service).toBeTruthy();
  }));
});
