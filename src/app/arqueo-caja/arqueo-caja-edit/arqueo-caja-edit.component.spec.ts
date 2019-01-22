import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueoCajaEditComponent } from './arqueo-caja-edit.component';

describe('ArqueoCajaEditComponent', () => {
  let component: ArqueoCajaEditComponent;
  let fixture: ComponentFixture<ArqueoCajaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArqueoCajaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueoCajaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
