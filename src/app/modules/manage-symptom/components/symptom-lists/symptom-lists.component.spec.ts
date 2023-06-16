import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomListsComponent } from './symptom-lists.component';

describe('SymptomListsComponent', () => {
  let component: SymptomListsComponent;
  let fixture: ComponentFixture<SymptomListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymptomListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
