import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViewNotesComponent } from './add-view-notes.component';

describe('AddViewNotesComponent', () => {
  let component: AddViewNotesComponent;
  let fixture: ComponentFixture<AddViewNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddViewNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddViewNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
