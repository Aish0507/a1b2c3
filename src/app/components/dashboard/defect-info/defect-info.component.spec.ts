import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectInfoComponent } from './defect-info.component';

describe('DefectInfoComponent', () => {
  let component: DefectInfoComponent;
  let fixture: ComponentFixture<DefectInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
