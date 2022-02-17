import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqblplconnectComponent } from './eqblplconnect.component';

describe('EqblplconnectComponent', () => {
  let component: EqblplconnectComponent;
  let fixture: ComponentFixture<EqblplconnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqblplconnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqblplconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
