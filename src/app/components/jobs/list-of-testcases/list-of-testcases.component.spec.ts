import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfTestcasesComponent } from './list-of-testcases.component';

describe('ListOfTestcasesComponent', () => {
  let component: ListOfTestcasesComponent;
  let fixture: ComponentFixture<ListOfTestcasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfTestcasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfTestcasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
