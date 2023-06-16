import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadAppRoutingModule } from './download-app-routing.module';
import { DownloadAppComponent } from './download-app.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '../shared/pagination/pagination.module'
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    DownloadAppComponent
  ],
  imports: [
    CommonModule,
    DownloadAppRoutingModule,
    WidgetsModule,
    InlineSVGModule,
    AutocompleteLibModule,
    QRCodeModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
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
  providers: []
})
export class DownloadAppModule { }
