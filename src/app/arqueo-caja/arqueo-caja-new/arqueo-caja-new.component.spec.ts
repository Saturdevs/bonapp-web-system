import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueoCajaNewComponent } from './arqueo-caja-new.component';

describe('ArqueoCajaNewComponent', () => {
  let component: ArqueoCajaNewComponent;
  let fixture: ComponentFixture<ArqueoCajaNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArqueoCajaNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueoCajaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
