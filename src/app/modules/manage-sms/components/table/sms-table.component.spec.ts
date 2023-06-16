import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTableComponent } from './sms-table.component';

describe('TableComponent', () => {
  let component: SmsTableComponent;
  let fixture: ComponentFixture<SmsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmsTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SmsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
