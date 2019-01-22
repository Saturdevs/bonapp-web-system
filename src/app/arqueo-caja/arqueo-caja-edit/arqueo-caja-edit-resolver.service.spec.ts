import { TestBed, inject } from '@angular/core/testing';

import { ArqueoCajaEditResolverService } from './arqueo-caja-edit-resolver.service';

describe('ArqueoCajaEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArqueoCajaEditResolverService]
    });
  });

  it('should be created', inject([ArqueoCajaEditResolverService], (service: ArqueoCajaEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});
