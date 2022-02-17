import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGoalComponent } from './add-new-goal.component';

describe('AddNewGoalComponent', () => {
  let component: AddNewGoalComponent;
  let fixture: ComponentFixture<AddNewGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
