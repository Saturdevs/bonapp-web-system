import { TestBed, inject } from '@angular/core/testing';

import { TableListResolverService } from './table-list-resolver.service';

describe('TableListResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableListResolverService]
    });
  });

  it('should be created', inject([TableListResolverService], (service: TableListResolverService) => {
    expect(service).toBeTruthy();
  }));
});
