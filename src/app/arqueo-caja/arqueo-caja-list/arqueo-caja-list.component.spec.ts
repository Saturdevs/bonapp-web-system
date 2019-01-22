import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueoCajaListComponent } from './arqueo-caja-list.component';

describe('ArqueoCajaListComponent', () => {
  let component: ArqueoCajaListComponent;
  let fixture: ComponentFixture<ArqueoCajaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArqueoCajaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueoCajaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
