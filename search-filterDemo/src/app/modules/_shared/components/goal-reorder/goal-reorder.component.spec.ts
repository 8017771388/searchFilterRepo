import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalReorderComponent } from './goal-reorder.component';

describe('GoalReorderComponent', () => {
  let component: GoalReorderComponent;
  let fixture: ComponentFixture<GoalReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
