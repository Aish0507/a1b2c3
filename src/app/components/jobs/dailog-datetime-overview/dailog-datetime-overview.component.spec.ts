import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogDatetimeOverviewComponent } from './dailog-datetime-overview.component';

describe('DailogDatetimeOverviewComponent', () => {
  let component: DailogDatetimeOverviewComponent;
  let fixture: ComponentFixture<DailogDatetimeOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogDatetimeOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogDatetimeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
