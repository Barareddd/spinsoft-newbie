import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseDetailFormComponent } from './disease-detail-form.component';

describe('DiseaseDetailFormComponent', () => {
  let component: DiseaseDetailFormComponent;
  let fixture: ComponentFixture<DiseaseDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseDetailFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
