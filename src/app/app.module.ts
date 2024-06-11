import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ClipboardModule } from "ngx-clipboard";
import { TranslateModule } from "@ngx-translate/core";
import { InlineSVGModule } from "ng-inline-svg-2";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { OAuthModule } from "angular-oauth2-oidc";
import { AppConfigService } from "./services/app-config.service";
import { CoreModule } from "../app/modules/auth/services/core.module";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { JwtInterceptor } from "./_helper/jwt.interceptor";
import { IMaskModule } from "angular-imask";
import { FakeAPIService } from "./_fake/fake-api.service"; // Assuming this is for fake API

import { AuthService } from "./modules/auth"; // Import AuthService
import { AuthGuardWithForcedLogin } from "./modules/auth/services/auth-guard-with-forced-login.service"; // Import AuthGuard
import { TodoService } from "./services/todo.service";

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

export function authAppInitializerFactory(
  authService: AuthService
): () => Promise<void> {
  return () => authService.runInitialLoginSequence();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    OAuthModule.forRoot(),
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AutocompleteLibModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
  ],
  providers: [
    AppConfigService,
    TodoService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: authAppInitializerFactory,
      multi: true,
      deps: [AuthService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthService, // Register AuthService
    AuthGuardWithForcedLogin, // Register AuthGuardWithForcedLogin
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
