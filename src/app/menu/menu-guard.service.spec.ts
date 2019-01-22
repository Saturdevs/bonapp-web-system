/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuGuardService } from './menu-guard.service';

describe('MenuGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuGuardService]
    });
  });

  it('should ...', inject([MenuGuardService], (service: MenuGuardService) => {
    expect(service).toBeTruthy();
  }));
});
