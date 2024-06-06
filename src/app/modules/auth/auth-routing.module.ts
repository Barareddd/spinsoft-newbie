import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./components/login/login.component";
import { LogoutComponent } from "./components/logout/logout.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "/",
        component: DashboardComponent,
      },
      {
        path: "login",
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: "logout",
        component: LogoutComponent,
      },
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "**", redirectTo: "login", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
