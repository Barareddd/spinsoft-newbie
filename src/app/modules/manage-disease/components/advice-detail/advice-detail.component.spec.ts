import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceDetailComponent } from './advice-detail.component';

describe('AdviceDetailComponent', () => {
  let component: AdviceDetailComponent;
  let fixture: ComponentFixture<AdviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdviceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdviceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
