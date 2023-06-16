import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { CreateComponent } from './create/create.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lists',
        component: ListsComponent,
      },
      {
        path: 'create',
        component: CreateComponent,
      },
      {
        path: 'result/:id',
        component: ResultComponent,
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
export class ManageQrcodeRoutingModule { }
