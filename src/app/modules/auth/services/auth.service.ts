/* eslint-disable brace-style */
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  OAuthErrorEvent,
  OAuthService,
  OAuthModuleConfig,
} from "angular-oauth2-oidc";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { UserModel } from "../models/user.model";
import { authConfig } from "./auth-config";

import { HttpClient } from "@angular/common/http";

export type UserType = UserModel | undefined;

@Injectable({ providedIn: "root" })
export class AuthService {
  private configUrl = "assets/environments/auth-config.json";
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
  currentUser$: Observable<UserType>;
  currentUserSubject: BehaviorSubject<UserType>;
  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  loadAndConfigureAuth(): Promise<void> {
    return this.loadAuthConfig()
      .toPromise()
      .then((config) => {
        const authConfig = {
          issuer: config.issuer,
          clientId: config.clientId,
          responseType: config.responseType,
          requireHttps: config.requireHttps,
          redirectUri: config.redirectUri,
          scope: config.scope,
          silentRefreshTimeout: config.silentRefreshTimeout,
          sessionChecksEnabled: config.sessionChecksEnabled,
          sessionCheckIntervall: config.sessionCheckIntervall,
          showDebugInformation: config.showDebugInformation,
          clearHashAfterLogin: config.clearHashAfterLogin,
          nonceStateSeparator: config.nonceStateSeparator,
        };
        // Configure OAuthService with the dynamic config
        this.oauthService.configure(authConfig);
        return this.runInitialLoginSequence();
      });
  }

  private loadAuthConfig(): Observable<any> {
    return this.http.get(this.configUrl);
  }

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map((values) => values.every((b) => b)));

  private navigateToLoginPage() {
    // TODO: Remember current URL
    this.router.navigateByUrl("/");
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private http: HttpClient,
    private oAuthModuleConfig: OAuthModuleConfig
  ) {
    // Useful for debugging:
    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthErrorEvent) {
        console.error("OAuthErrorEvent Object:", event);
        this.login();
      } else {
        console.log("OAuthEvent Object:", event);
      }

      this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
      this.currentUser$ = this.currentUserSubject.asObservable();
    });

    window.addEventListener("storage", (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== "access_token" && event.key !== null) {
        return;
      }

      console.warn(
        "Noticed changes to access_token (most likely from another tab), updating isAuthenticated"
      );
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );

      if (!this.oauthService.hasValidAccessToken()) {
        this.navigateToLoginPage();
      }
    });

    this.oauthService.events.subscribe((_) => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events
      .pipe(filter((e) => ["token_received"].includes(e.type)))
      .subscribe((e) => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(filter((e) => ["user_profile_loaded"].includes(e.type)))
      .subscribe((e) => {});

    this.oauthService.events
      .pipe(
        filter((e) => ["session_terminated", "session_error"].includes(e.type))
      )
      .subscribe((e) => this.navigateToLoginPage());

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public runInitialLoginSequence(): Promise<void> {
    if (location.hash) {
      console.log("Encountered hash fragment, plotting as table...");
      console.table(
        location.hash
          .substr(1)
          .split("&")
          .map((kvp) => kvp.split("="))
      );
    }

    const originalCheckSession = () => OAuthService.prototype.checkSession;
    OAuthService.prototype.checkSession = function () {
      const originalIssuer = this.issuer;
      const sessionCheckIFrameOrigin = new URL(
        this.sessionCheckIFrameUrl || this.issuer || ""
      ).origin;

      this.issuer = sessionCheckIFrameOrigin;

      originalCheckSession();

      this.issuer = originalIssuer;
    };

    return this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then(() => this.oauthService.tryLogin())
      .then(() => {
        console.log(
          "this.oauthService.hasValidAccessToken",
          this.oauthService.hasValidAccessToken()
        );
        if (this.oauthService.hasValidAccessToken()) {
          this.router.navigateByUrl("/dashboard"); // เปลี่ยนเป็น /dashboard
          return Promise.resolve();
        }

        return this.oauthService
          .silentRefresh()
          .then(() => Promise.resolve())
          .catch((result) => {
            const errorResponsesRequiringUserInteraction = [
              "interaction_required",
              "login_required",
              "account_selection_required",
              "consent_required",
            ];

            if (
              result &&
              result.reason &&
              errorResponsesRequiringUserInteraction.indexOf(
                result.reason.error
              ) >= 0
            ) {
              console.warn(
                "User interaction is needed to log in, we will wait for the user to manually log in."
              );
              return Promise.resolve();
            }

            return Promise.reject(result);
          });
      })
      .then(() => {
        this.isDoneLoadingSubject$.next(true);

        if (
          this.oauthService.state &&
          this.oauthService.state !== "undefined" &&
          this.oauthService.state !== "null"
        ) {
          let stateUrl = this.oauthService.state;
          if (stateUrl.startsWith("/") === false) {
            stateUrl = decodeURIComponent(stateUrl);
          }
          console.log(
            `There was state of ${this.oauthService.state}, so we are sending you to: ${stateUrl}`
          );
          this.router.navigateByUrl(stateUrl);
        }
      })
      .catch(() => this.isDoneLoadingSubject$.next(true));
  }

  public login(targetUrl?: string) {
    this.oauthService.initCodeFlow(targetUrl || "/dashboard");
  }

  public logout() {
    this.oauthService.logOut();
    localStorage.clear();
  }

  public refresh() {
    this.oauthService.silentRefresh();
  }

  public hasValidToken() {
    return this.oauthService.hasValidAccessToken();
  }

  public get accessToken() {
    return this.oauthService.getAccessToken();
  }
  public get refreshToken() {
    return this.oauthService.getRefreshToken();
  }
  public get identityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }
  public get idToken() {
    return this.oauthService.getIdToken();
  }
  public get logoutUrl() {
    return this.oauthService.logoutUrl;
  }
}
