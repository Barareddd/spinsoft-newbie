import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { OAuthErrorEvent, OAuthService } from "angular-oauth2-oidc";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { UserModel } from "../models/user.model";
import { MasterDataService } from "../../../services/master-data.service";

export type UserType = UserModel | undefined;

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  currentUser$: Observable<UserType>;
  currentUserSubject: BehaviorSubject<UserType>;

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map((values) => values.every((b) => b)));

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private masterDataService: MasterDataService
  ) {
    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthErrorEvent) {
        console.error("OAuthErrorEvent Object:", event);
        // this.login();
      } else {
        console.log("OAuthEvent Object:", event);
      }
      // this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
      // this.currentUser$ = this.currentUserSubject.asObservable();
    });

    window.addEventListener("storage", (event) => {
      if (
        typeof event.key === "string" &&
        event.key !== "access_token" &&
        event.key !== null
      ) {
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

    this.oauthService.events
      .pipe(filter((e) => ["token_received"].includes(e.type)))
      .subscribe(() => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(filter((e) => ["user_profile_loaded"].includes(e.type)))
      .subscribe(() => this.handleNewToken());

    this.oauthService.events
      .pipe(
        filter((e) => ["session_terminated", "session_error"].includes(e.type))
      )
      .subscribe(() => this.navigateToLoginPage());

    this.oauthService.setupAutomaticSilentRefresh();
  }

  private navigateToLoginPage() {
    this.router.navigateByUrl("/auth/login");
  }

  private handleNewToken() {
    const org_profile = localStorage.getItem("org_profile");
    if (!org_profile) {
      const claims = localStorage.getItem("id_token_claims_obj");
      const claimjson = JSON.parse(claims || "{}");
      const org_id = claimjson?.orgId;
      if (org_id) {
        this.masterDataService
          .getOrganizationByID(org_id)
          .subscribe((data: any) => {
            localStorage.setItem("org_profile", JSON.stringify(data));
            console.log("set org_profile");
          });
      } else {
        console.log("org undefined");
      }
    } else {
      console.log("org_profile already exists");
    }
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
    // localStorage.clear();

    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => this.oauthService.tryLogin())
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.isAuthenticatedSubject$.next(true);
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
          if (!stateUrl.startsWith("/")) {
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
    this.oauthService.initCodeFlow(targetUrl || "/home");
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

  public get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  public get idToken() {
    return this.oauthService.getIdToken();
  }

  public get logoutUrl() {
    return this.oauthService.logoutUrl;
  }
}
