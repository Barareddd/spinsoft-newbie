import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../services/app-config.service'

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent implements OnInit {

  download_link_android: any
  download_link_ios: any

  title_android: string = "DDC-Care สำหรับ Android"
  title_ios: string = "DDC-Care สำหรับ iOS"

  icon_android: string = "assets/media/logos/icon-android.png"
  icon_ios: string = "assets/media/logos/icon-ios.png"

  constructor(private environment: AppConfigService) { }

  ngOnInit(): void {
    this.download_link_android = this.environment.config.download_link_android
    this.download_link_ios = this.environment.config.download_link_ios
  }

}
