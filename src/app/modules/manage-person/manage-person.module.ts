import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePersonRouting } from './manage-person.routing.module';
import { ViewMonitoringComponent } from './view-monitoring/view-monitoring.component';
import { EditMonitorComponent } from './edit-monitor/edit-monitor.component';
import { SearchPersonComponent } from './search-person/search-person.component';
import { ViewPersonComponent } from './view-person/view-person.component';
import { WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../services/helper/customDatePicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
// import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip/tooltip.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localeSimplifiedThai from '@angular/common/locales/th';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeSimplifiedThai, 'th-TH');
import { ThaiDatePipe } from '../../services/helper/thai-date.pipe'

@NgModule({
  declarations: [
    ViewMonitoringComponent,
    EditMonitorComponent,
    SearchPersonComponent,
    ViewPersonComponent,
    ThaiDatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ManagePersonRouting,
    WidgetsModule,
    InlineSVGModule,
    AutocompleteLibModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    // NgbTooltipModule
    NgbModule,
  ],
  providers: [
    // { provide: DateAdapter, useClass: AppDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    // { provide: LOCALE_ID, useValue: "th-TH" }

    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: "th-TH" }
  ]
})
export class ManagePersonModule { }
