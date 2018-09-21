import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTestCaseComponent } from './update-test-case.component';

describe('UpdateTestCaseComponent', () => {
  let component: UpdateTestCaseComponent;
  let fixture: ComponentFixture<UpdateTestCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTestCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
