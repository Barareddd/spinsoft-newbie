import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
// import { AuthService, UserType } from '../../../../../../modules/auth';
import { AuthService } from '../../../../../../modules/auth/services/auth.service'
import { Router } from '@angular/router';
import { UserModel } from '../../../../../../modules/auth/models/user.model';
import { UsersTable } from '../../../../../../_fake/users.table'

export type UserType = UserModel | undefined;

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  // user$: Observable<UserType>;
  langs = languages;
  _user: any
  private unsubscribe: Subscription[] = [];

  constructor(
    private auth: AuthService,
    public router: Router,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    new Observable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    this._user = this.auth.identityClaims || UsersTable.users[0]
}

  logout() {
    this.auth.logout();
    // document.location.reload();
    // localStorage.clear()
    // this.currentUserSubject.next(null)
    // this.router.navigate(['/auth/login'])
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
