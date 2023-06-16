import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMonitoringComponent } from './view-monitoring/view-monitoring.component';
import { SearchPersonComponent } from './search-person/search-person.component';
import { ViewPersonComponent } from './view-person/view-person.component';
import { EditMonitorComponent } from './edit-monitor/edit-monitor.component'
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'search',
        component: SearchPersonComponent,
      },
      {
        path: 'view',
        component: ViewPersonComponent,
      },
      {
        path: 'viewMonitoring',
        component: ViewMonitoringComponent,
      },
      {
        path: 'editMonitoring',
        component: EditMonitorComponent,
      },
      { path: '', redirectTo: 'search', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatDatepickerModule
  ],
  exports: [RouterModule],
})
export class ManagePersonRouting { }
