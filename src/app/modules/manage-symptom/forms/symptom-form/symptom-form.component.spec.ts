import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomFormComponent } from './symptom-form.component';

describe('SymptomFormComponent', () => {
  let component: SymptomFormComponent;
  let fixture: ComponentFixture<SymptomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymptomFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
