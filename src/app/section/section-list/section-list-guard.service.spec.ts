import { TestBed } from '@angular/core/testing';

import { SectionListGuardService } from './section-list-guard.service';

describe('SectionListGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectionListGuardService = TestBed.get(SectionListGuardService);
    expect(service).toBeTruthy();
  });
});
