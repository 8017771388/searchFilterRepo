import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskCalendarComponent } from './add-task-calendar.component';

describe('AddTaskCalendarComponent', () => {
  let component: AddTaskCalendarComponent;
  let fixture: ComponentFixture<AddTaskCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaskCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
