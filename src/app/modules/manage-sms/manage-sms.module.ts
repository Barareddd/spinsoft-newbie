import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSMSRoutingModule } from '../manage-sms/manage-sms-routing.module';
import { ListsComponent } from '../manage-sms/lists/lists.component';
import { CreateComponent } from '../manage-sms/create/create.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { AppDateAdapter, APP_DATE_FORMATS } from '../manage-qrcode/customDatePicker';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '../shared/pagination/pagination.module'
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SmsTableComponent } from './components/table/sms-table.component';
import { IMaskModule } from 'angular-imask';

@NgModule({
  declarations: [
    ListsComponent,
    CreateComponent,
    SmsTableComponent
  ],
  imports: [
    CommonModule,
    ManageSMSRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    AutocompleteLibModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    ModalsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    IMaskModule
  ],
  exports: [
    MatDatepickerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: "en-EN" }
  ]
})
export class ManageSMSModule { }
