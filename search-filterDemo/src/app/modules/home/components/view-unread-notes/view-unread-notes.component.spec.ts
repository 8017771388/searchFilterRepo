import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnreadNotesComponent } from './view-unread-notes.component';

describe('ViewUnreadNotesComponent', () => {
  let component: ViewUnreadNotesComponent;
  let fixture: ComponentFixture<ViewUnreadNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUnreadNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUnreadNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
