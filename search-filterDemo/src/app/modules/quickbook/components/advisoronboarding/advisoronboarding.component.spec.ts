import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoronboardingComponent } from './advisoronboarding.component';

describe('AdvisoronboardingComponent', () => {
  let component: AdvisoronboardingComponent;
  let fixture: ComponentFixture<AdvisoronboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisoronboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoronboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
