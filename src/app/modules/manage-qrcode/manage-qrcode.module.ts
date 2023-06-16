import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageQrcodeRoutingModule } from './manage-qrcode-routing.module';
import { ListsComponent } from './lists/lists.component';
import { CreateComponent } from './create/create.component';
import { ResultComponent } from './result/result.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './customDatePicker';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '../shared/pagination/pagination.module'
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    ListsComponent,
    CreateComponent,
    ResultComponent
  ],
  imports: [
    CommonModule,
    ManageQrcodeRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    AutocompleteLibModule,
    QRCodeModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    ModalsModule,
    MatSelectModule,
    NgxMatSelectSearchModule
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
export class ManageQrcodeModule { }
