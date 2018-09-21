import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfJobsComponent } from './list-of-jobs.component';

describe('ListOfJobsComponent', () => {
  let component: ListOfJobsComponent;
  let fixture: ComponentFixture<ListOfJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
