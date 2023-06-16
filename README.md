# One Stop Service Management Web UI Angular

## Initial Template การ Bypass Authentication

1. แก้ ไฟล์ [./src/app/modules/auth/services/auth-app-initializer.factory.ts]( ./src/app/modules/auth/services/auth-app-initializer.factory.ts)

``` 
export function authAppInitializerFactory(authService: AuthService): () => Promise<void> {
  return () => authService.runInitialLoginSequence();
}


```
เป็น
```
export function authAppInitializerFactory(authService: AuthService): () => Promise<void> {
  return () => Promise.resolve();
}
````

2. แก้ไขไฟล์ [./src/app/modules/auth/services/auth-guard-with-forced-login.service.ts]( ./src/app/modules/auth/services/auth-guard-with-forced-login.service.ts)


```
... 

canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> {
        return this.authService.isDoneLoading$.pipe(
             filter(isDone => isDone),
             switchMap(_ => this.authService.isAuthenticated$),
             tap(isAuthenticated => isAuthenticated || this.router.navigate(['/auth/login'])),
         );
    }

...
```
เป็น
```

import { Observable, of } from 'rxjs';

...

canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> {
        return of(true)
    }

```

3. แก้ไฟล์ [./src/app/_metronic/partials/layout/extras/dropdown-inner/user-inner/user-inner.component.ts](./src/app/_metronic/partials/layout/extras/dropdown-inner/user-inner/user-inner.component.ts)


```
...

ngOnInit(): void {
    asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    this._user = this.auth.identityClaims 
}

...
```
เป็น
```
...

import { UsersTable } from '../../../../../../_fake/users.table'

...

ngOnInit(): void {
    asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    this._user = this.auth.identityClaims || UsersTable.users[0]
}

```

4. แก้ไฟล์ 
[./src/app/_metronic/partials/layout/extras/dropdown-inner/user-inner/user-inner.component.html](./src/app/_metronic/partials/layout/extras/dropdown-inner/user-inner/user-inner.component.html)


```
...

<div class="d-flex flex-column">
        <div class="fw-bolder d-flex align-items-center fs-5">
          {{ _user.name }}
          <span class="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">Online</span>
        </div>
</div>

...

```

เป็น

```
...

<div class="d-flex flex-column">
        <div class="fw-bolder d-flex align-items-center fs-5">
          {{ _user.name || _user.username }}
          <span class="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">Online</span>
        </div>
</div>
...
```


## ถ้าต้องการเปิด Authen ก็ทำย้อนขั้นตอนด้านบนและไป Config ไฟล์ /app/modules/auth/services/auth-config.ts ตาม Authen Server ที่จะใช้