import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogBuildOverviewComponent } from './dailog-build-overview.component';

describe('DailogBuildOverviewComponent', () => {
  let component: DailogBuildOverviewComponent;
  let fixture: ComponentFixture<DailogBuildOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogBuildOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogBuildOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
