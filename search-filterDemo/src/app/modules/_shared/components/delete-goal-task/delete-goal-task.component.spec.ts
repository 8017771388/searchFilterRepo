import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGoalTaskComponent } from './delete-goal-task.component';

describe('DeleteGoalTaskComponent', () => {
  let component: DeleteGoalTaskComponent;
  let fixture: ComponentFixture<DeleteGoalTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGoalTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGoalTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
