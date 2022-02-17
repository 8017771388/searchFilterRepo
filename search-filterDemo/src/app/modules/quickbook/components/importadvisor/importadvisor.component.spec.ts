import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadvisorComponent } from './importadvisor.component';

describe('ImportadvisorComponent', () => {
  let component: ImportadvisorComponent;
  let fixture: ComponentFixture<ImportadvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
