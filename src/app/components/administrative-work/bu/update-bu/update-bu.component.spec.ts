import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBuComponent } from './update-bu.component';

describe('UpdateBuComponent', () => {
  let component: UpdateBuComponent;
  let fixture: ComponentFixture<UpdateBuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
