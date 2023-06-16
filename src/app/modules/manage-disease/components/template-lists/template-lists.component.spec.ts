import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListsComponent } from './template-lists.component';

describe('TemplateListsComponent', () => {
  let component: TemplateListsComponent;
  let fixture: ComponentFixture<TemplateListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
