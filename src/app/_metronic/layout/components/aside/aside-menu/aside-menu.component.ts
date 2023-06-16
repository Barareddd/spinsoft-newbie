import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../../../services/app-config.service'

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  download_page: string = "inactive";

  constructor(private environment: AppConfigService) { }

  ngOnInit(): void {
    this.download_page = this.environment.config.download_app_page
  }
}
