import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { MasterDataService } from '../../../services/master-data.service'
import { AppConfigService } from '../../../services/app-config.service'
import * as moment from 'moment'
import { forkJoin, Observable } from 'rxjs';
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service'

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  qrcode_lists: any
  disease_lists: any
  template_lists: any
  org_lists: any

  // pagination
  activePage: any
  pagination: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }

  filter: any = {
    user_name: ""
  }

  constructor(
    private router: Router,
    private backendService: BackendDdcCareService,
    private masterDataService: MasterDataService,
    private swal: SweetalertService,
    private ref: ChangeDetectorRef,
    private environment: AppConfigService,) { }

  ngOnInit(): void {
    this.initAllData()
  }

  createQR() {
    this.router.navigate(['/app/manage-qrcode/create']);
  }

  initAllData() {
    const user = JSON.parse(localStorage.getItem('id_token_claims_obj')!)
    this.filter.user_name = user?.user_name
    forkJoin({
      requestQR: this.backendService.getQRCodeLists(this.pagination, this.filter),
      requestDisease: this.masterDataService.getDisease(),
      requestAllTemplate: this.backendService.getAllTemplate(),
      requestOrg: this.masterDataService.getOrganization()
    })
      .subscribe(({ requestQR, requestDisease, requestAllTemplate, requestOrg }) => {
        this.qrcode_lists = requestQR.body;
        this.pagination = this.qrcode_lists?.pagination
        this.disease_lists = requestDisease.data;
        this.template_lists = requestAllTemplate.body
        this.org_lists = requestOrg.data
        this.mapDisease()
        this.mapTemplate()
        this.mapOrg()
        this.ref.detectChanges();
        // if (this.environment.config.env_mode == "develop") {
        //   console.log('qrcode_lists', this.qrcode_lists)
        //   console.log('disease_lists', this.disease_lists)
        //   console.log('template_lists', this.template_lists)
        //   console.log('org_lists', this.org_lists)
        // }
      });
  }

  getHumanDate(ts: any) {
    return moment.unix(ts).add(543, 'year').format('YYYY-MM-DD');
  }

  getHumanDateTH(ts: any) {
    return moment.unix(ts).locale('th').add(543, 'year').format('ll')
  }

  daySince(ts: any) {
    const date_1 = new Date().getTime()
    const date_2 = new Date(ts * 1000).getTime()
    const datediff = date_2 - date_1
    const human = Math.floor(datediff / (1000 * 60 * 60 * 24))
    if (human == 0) return 'วันสุดท้าย'
    if (human > 0) return 'อีก ' + human + ' วัน'
    if (human < 0) return 'หมดอายุ'
    // return human > 0 ? 'อีก ' + human + ' วัน' : 'หมดอายุ'
  }

  mapDisease() {
    this.qrcode_lists?.data?.map((qr: any) => {
      this.disease_lists.map((item: any) => {
        if (item.disease_id == qr.disease_id) {
          qr.disease_name_th = item.disease_name_th
        }
      })
    })
  }

  mapTemplate() {
    this.qrcode_lists?.data?.map((qr: any) => {
      this.template_lists?.data?.map((item: any) => {
        if (item.id == qr.template_id) {
          qr.template_title = item.title
        }
      })
    })
  }

  mapOrg() {
    this.qrcode_lists?.data?.map((qr: any) => {
      this.org_lists?.map((item: any) => {
        if (item.org_id == qr.imported_org_id) {
          qr.imported_org_name = item.org_name
        }
      })
    })
  }

  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber
    this.pagination.page = activePageNumber
    this.initAllData()
  }

  viewQRCodeDetail(item: any) {
    localStorage.setItem('qr_item', JSON.stringify(item))
    this.router.navigate(['/app/manage-qrcode/result/' + item.id]);
  }

  removeQR(id: any) {
    console.log('remove', id)
    this.swal.alertConfirmDanger('ยืนยันการลบ', 'ลบ QR Code ' + id + ' หรือไม่', 'ลบ', 'ยกเลิก').then((result: any) => {
      if (result.value) {
        this.backendService.removeQRCode(id).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal.alertSuccessSetTimeOut("", "ลบ QR Code " + id + " สำเร็จ", 2000)
            this.initAllData()
          }
        }, error => {
          this.swal.alertWarning("", error["message"], "")
        })
      }
    })
  }
}
