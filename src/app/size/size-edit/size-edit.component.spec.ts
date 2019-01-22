import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeEditComponent } from './size-edit.component';

describe('SizeEditComponent', () => {
  let component: SizeEditComponent;
  let fixture: ComponentFixture<SizeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
