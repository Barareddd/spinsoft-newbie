import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDiseaseRoutingModule } from './manage-disease-routing.module';
import { ListsComponent } from './lists/lists.component';
import { CreateComponent } from './create/create.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DetailComponent } from './detail/detail.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { DiseaseDetailFormComponent } from './forms/disease-detail-form/disease-detail-form.component';
import { DiseaseDetailComponent } from './components/disease-detail/disease-detail.component';
import { SymptomDetailComponent } from './components/symptom-detail/symptom-detail.component';
import { AdviceDetailComponent } from './components/advice-detail/advice-detail.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { DiseaseMapFormComponent } from './forms/disease-map-form/disease-map-form.component';
import { TemplateFormComponent } from './forms/template-form/template-form.component';
import { TemplateDetailComponent } from './components/template-detail/template-detail.component';
import { TemplateListsComponent } from './components/template-lists/template-lists.component';
import { AppPreviewComponent } from './components/app-preview/app-preview.component';
import { ManageSymptomModule } from '../manage-symptom/manage-symptom.module'
import { PaginationModule } from '../shared/pagination/pagination.module';
import { DiseaseTableComponent } from './components/disease-table/disease-table.component'

@NgModule({
  declarations: [
    ListsComponent,
    CreateComponent,
    DetailComponent,
    DiseaseDetailFormComponent,
    DiseaseDetailComponent,
    SymptomDetailComponent,
    AdviceDetailComponent,
    QuestionDetailComponent,
    DiseaseMapFormComponent,
    TemplateFormComponent,
    TemplateDetailComponent,
    TemplateListsComponent,
    AppPreviewComponent,
    DiseaseTableComponent,
  ],
  imports: [
    CommonModule,
    ManageDiseaseRoutingModule,
    ModalsModule,
    WidgetsModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ManageSymptomModule,
    PaginationModule
  ]
})
export class ManageDiseaseModule { }
