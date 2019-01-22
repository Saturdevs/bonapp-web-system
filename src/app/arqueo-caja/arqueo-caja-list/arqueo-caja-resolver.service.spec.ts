import { TestBed, inject } from '@angular/core/testing';

import { ArqueoCajaResolverService } from './arqueo-caja-resolver.service';

describe('ArqueoCajaResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArqueoCajaResolverService]
    });
  });

  it('should be created', inject([ArqueoCajaResolverService], (service: ArqueoCajaResolverService) => {
    expect(service).toBeTruthy();
  }));
});
