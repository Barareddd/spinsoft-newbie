import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseMapFormComponent } from './disease-map-form.component';

describe('DiseaseMapFormComponent', () => {
  let component: DiseaseMapFormComponent;
  let fixture: ComponentFixture<DiseaseMapFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseMapFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseMapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
