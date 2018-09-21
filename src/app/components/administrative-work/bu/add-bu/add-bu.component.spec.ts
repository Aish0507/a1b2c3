import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBuComponent } from './add-bu.component';

describe('AddBuComponent', () => {
  let component: AddBuComponent;
  let fixture: ComponentFixture<AddBuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
