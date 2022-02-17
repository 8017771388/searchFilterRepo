import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoamaintenanceComponent } from './coamaintenance.component';

describe('CoamaintenanceComponent', () => {
  let component: CoamaintenanceComponent;
  let fixture: ComponentFixture<CoamaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoamaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoamaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
