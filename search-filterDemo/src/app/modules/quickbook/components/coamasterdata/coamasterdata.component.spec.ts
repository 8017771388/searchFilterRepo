import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoamasterdataComponent } from './coamasterdata.component';

describe('CoamasterdataComponent', () => {
  let component: CoamasterdataComponent;
  let fixture: ComponentFixture<CoamasterdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoamasterdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoamasterdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
