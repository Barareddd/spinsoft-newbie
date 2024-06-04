import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PatientPersonComponent } from './patient-person.component';

const routes: Routes = [
  {
    path: '',
    component: PatientPersonComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatDatepickerModule
  ],
  exports: [RouterModule],
})
export class ManagePatientRouting { }
