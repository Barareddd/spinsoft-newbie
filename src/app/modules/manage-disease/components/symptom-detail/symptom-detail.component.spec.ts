import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomDetailComponent } from './symptom-detail.component';

describe('SymptomDetailComponent', () => {
  let component: SymptomDetailComponent;
  let fixture: ComponentFixture<SymptomDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymptomDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
