import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorePlanComponent } from './core-plan.component';

describe('CorePlanComponent', () => {
  let component: CorePlanComponent;
  let fixture: ComponentFixture<CorePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
