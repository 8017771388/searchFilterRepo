import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildCorePlanComponent } from './build-core-plan.component';

describe('BuildCorePlanComponent', () => {
  let component: BuildCorePlanComponent;
  let fixture: ComponentFixture<BuildCorePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildCorePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildCorePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
