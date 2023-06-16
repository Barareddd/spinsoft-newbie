import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'setting',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'app/manage-qrcode',
    loadChildren: () =>
      import('../modules/manage-qrcode/manage-qrcode.module').then(
        (m) => m.ManageQrcodeModule
      ),
  },
  {
    path: 'app/manage-sms',
    loadChildren: () =>
      import('../modules/manage-sms/manage-sms.module').then(
        (m) => m.ManageSMSModule
      ),
  },
  {
    path: 'app/manage-disease',
    loadChildren: () =>
      import('../modules/manage-disease/manage-disease.module').then(
        (m) => m.ManageDiseaseModule
      ),
  },
  {
    path: 'app/manage-symptom',
    loadChildren: () =>
      import('../modules/manage-symptom/manage-symptom.module').then(
        (m) => m.ManageSymptomModule
      ),
  },
  {
    path: 'app/manage-person',
    loadChildren: () =>
      import('../modules/manage-person/manage-person.module').then(
        (m) => m.ManagePersonModule
      ),
  },
  {
    path: 'app/application',
    loadChildren: () =>
      import('../modules/download-app/download-app.module').then(
        (m) => m.DownloadAppModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
