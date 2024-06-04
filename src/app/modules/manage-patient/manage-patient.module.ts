import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManagePatientRouting } from "./manage-patient.routing.module";
import { WidgetsModule } from "../../_metronic/partials";
import { InlineSVGModule } from "ng-inline-svg-2";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {
  MatNativeDateModule,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../../services/helper/customDatePicker";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
// import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip/tooltip.module'
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import localeSimplifiedThai from "@angular/common/locales/th";
import { registerLocaleData } from "@angular/common";

registerLocaleData(localeSimplifiedThai, "th-TH");

import { PatientPersonComponent } from "./patient-person.component";

@NgModule({
  declarations: [PatientPersonComponent],
  imports: [
    CommonModule,
    FormsModule,
    ManagePatientRouting,
    ReactiveFormsModule,
  ],
  providers: [
    // { provide: DateAdapter, useClass: AppDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    // { provide: LOCALE_ID, useValue: "th-TH" }
    // { provide: DateAdapter, useClass: AppDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    // { provide: LOCALE_ID, useValue: "th-TH" }
  ],
})
export class ManagePatientModule {}
