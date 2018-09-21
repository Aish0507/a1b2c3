import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAcComponent } from './user-ac.component';

describe('UserAcComponent', () => {
  let component: UserAcComponent;
  let fixture: ComponentFixture<UserAcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
