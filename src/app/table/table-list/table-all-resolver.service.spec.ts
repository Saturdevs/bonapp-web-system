import { TestBed, inject } from '@angular/core/testing';

import { TableAllResolverService } from './table-all-resolver.service';

describe('TableAllResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableAllResolverService]
    });
  });

  it('should be created', inject([TableAllResolverService], (service: TableAllResolverService) => {
    expect(service).toBeTruthy();
  }));
});
