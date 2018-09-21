import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserAcComponent } from './add-user-ac.component';

describe('AddUserAcComponent', () => {
  let component: AddUserAcComponent;
  let fixture: ComponentFixture<AddUserAcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserAcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserAcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
