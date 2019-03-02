import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionListConfigComponent } from './section-list-config.component';

describe('SectionListConfigComponent', () => {
  let component: SectionListConfigComponent;
  let fixture: ComponentFixture<SectionListConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionListConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionListConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
