import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionNewComponent } from './section-new.component';

describe('SectionNewComponent', () => {
  let component: SectionNewComponent;
  let fixture: ComponentFixture<SectionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
