import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadAppComponent } from './download-app.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'download',
        component: DownloadAppComponent,
      },
      { path: '', redirectTo: 'lists', pathMatch: 'full' },
      { path: '**', redirectTo: 'lists', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadAppRoutingModule { }
