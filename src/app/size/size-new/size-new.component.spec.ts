import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeNewComponent } from './size-new.component';

describe('SizeNewComponent', () => {
  let component: SizeNewComponent;
  let fixture: ComponentFixture<SizeNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
