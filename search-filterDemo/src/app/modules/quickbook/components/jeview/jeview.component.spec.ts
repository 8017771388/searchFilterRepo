import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeviewComponent } from './jeview.component';

describe('JeviewComponent', () => {
  let component: JeviewComponent;
  let fixture: ComponentFixture<JeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
