import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardWithForcedLogin implements CanActivate {
  constructor(public router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isDoneLoading$.pipe(
      filter((isDone) => isDone),
      switchMap((_) => this.authService.isAuthenticated$),
      tap((isAuthenticated) => {
        console.log("isAuthenticated:", isAuthenticated); // เพิ่มบรรทัดนี้เพื่อ console.log ค่า isAuthenticated
        if (!isAuthenticated) {
          this.router.navigate(["/auth/login"]);
        }
      })
    );
    // return of(true);
  }
}
