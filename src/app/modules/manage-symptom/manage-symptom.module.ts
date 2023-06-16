import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSymptomRoutingModule } from '../manage-symptom/manage-symptom-routing.module';
import { ListsComponent } from '../manage-symptom/lists/lists.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { SymptomListsComponent } from './components/symptom-lists/symptom-lists.component';
import { QuestionListsComponent } from './components/question-lists/question-lists.component';
import { SymptomFormComponent } from './forms/symptom-form/symptom-form.component';
import { QuestionFormComponent } from './forms/question-form/question-form.component';
import { PaginationModule } from '../shared/pagination/pagination.module'

@NgModule({
  declarations: [
    ListsComponent,
    SymptomListsComponent,
    QuestionListsComponent,
    SymptomFormComponent,
    QuestionFormComponent
  ],
  imports: [
    CommonModule,
    ManageSymptomRoutingModule,
    ModalsModule,
    WidgetsModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    PaginationModule
  ],
  exports: [
    SymptomFormComponent,
    QuestionFormComponent
  ]
})
export class ManageSymptomModule { }
