import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { MasterDataService } from '../../../services/master-data.service'
import { AppConfigService } from '../../../services/app-config.service'
import * as moment from 'moment'
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service'

type Tabs =
  | 'waiting_tab'
  | 'sending_tab'
  | 'registered_tab'
  | 'unregistered_tab';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  sms_waiting_lists: any
  sms_sending_lists: any
  sms_registered_lists: any
  sms_unregistered_lists: any
  disease_lists: any
  template_lists: any
  org_lists: any

  // pagination
  activePage: any
  paginationWaiting: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }
  paginationSending: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }
  paginationRegistered: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }
  paginationUnregistered: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }

  filterWaiting: any = {
    user_name: "",
    status: "WAITING"
  }
  filterSending: any = {
    user_name: "",
    status: "SENDING"
  }
  filterRegistered: any = {
    user_name: "",
    status: "REGISTERED"
  }
  filterUnregistered: any = {
    user_name: "",
    status: "UNREGISTERED"
  }

  constructor(
    private router: Router,
    private backendService: BackendDdcCareService,
    private masterDataService: MasterDataService,
    private swal: SweetalertService,
    private environment: AppConfigService,
    private ref: ChangeDetectorRef,
  ) { }

  activeTab: Tabs = 'waiting_tab';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.initAllData()
  }

  createSMS() {
    this.router.navigate(['/app/manage-sms/create']);
  }

  initAllData() {
    const user = JSON.parse(localStorage.getItem('id_token_claims_obj')!)
    this.filterWaiting.user_name = user?.user_name
    this.filterSending.user_name = user?.user_name
    this.filterRegistered.user_name = user?.user_name
    this.filterUnregistered.user_name = user?.user_name
    forkJoin({
      requestSMSWaiting: this.backendService.getSMSLists(this.paginationWaiting, this.filterWaiting).pipe(map((res) => res), catchError(e => of(e))),
      requestSMSSending: this.backendService.getSMSLists(this.paginationSending, this.filterSending).pipe(map((res) => res), catchError(e => of(e))),
      requestSMSRegistered: this.backendService.getSMSLists(this.paginationRegistered, this.filterRegistered).pipe(map((res) => res), catchError(e => of(e))),
      requestSMSUnregistered: this.backendService.getSMSLists(this.paginationUnregistered, this.filterUnregistered).pipe(map((res) => res), catchError(e => of(e))),
      requestDisease: this.masterDataService.getDisease(),
      requestAllTemplate: this.backendService.getAllTemplate(),
      requestOrg: this.masterDataService.getOrganization()
    })
      .subscribe(({
        requestSMSWaiting,
        requestSMSSending,
        requestSMSRegistered,
        requestSMSUnregistered,
        requestDisease,
        requestAllTemplate,
        requestOrg
      }) => {
        // receive data
        this.sms_waiting_lists = requestSMSWaiting.body;
        this.sms_sending_lists = requestSMSSending.body;
        this.sms_registered_lists = requestSMSRegistered.body;
        this.sms_unregistered_lists = requestSMSUnregistered.body;
        // receive pagination
        this.paginationWaiting = this.sms_waiting_lists?.pagination ? this.sms_waiting_lists?.pagination : this.paginationWaiting
        this.paginationSending = this.sms_sending_lists?.pagination ? this.sms_sending_lists?.pagination : this.paginationSending
        this.paginationRegistered = this.sms_registered_lists?.pagination ? this.sms_registered_lists?.pagination : this.paginationRegistered
        this.paginationUnregistered = this.sms_unregistered_lists?.pagination ? this.sms_unregistered_lists?.pagination : this.paginationUnregistered
        // receive other
        this.disease_lists = requestDisease.data;
        this.template_lists = requestAllTemplate.body
        this.org_lists = requestOrg.data
        // map data for show
        this.mapDisease()
        this.mapTemplate()
        this.mapOrg()
        this.ref.detectChanges();
        // if (this.environment.config.env_mode == "develop") {
        //   console.log('sms_waiting_lists', this.sms_waiting_lists)
        //   console.log('sms_sending_lists', this.sms_sending_lists)
        //   console.log('sms_registered_lists', this.sms_registered_lists)
        //   console.log('sms_unregistered_lists', this.sms_unregistered_lists)
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

  mapDisease() {
    this.sms_waiting_lists?.data?.map((sms: any) => {
      this.disease_lists.map((item: any) => {
        if (item.disease_id == sms.disease_id) {
          sms.disease_name_th = item.disease_name_th
        }
      })
    })
    this.sms_sending_lists?.data?.map((sms: any) => {
      this.disease_lists.map((item: any) => {
        if (item.disease_id == sms.disease_id) {
          sms.disease_name_th = item.disease_name_th
        }
      })
    })
    this.sms_registered_lists?.data?.map((sms: any) => {
      this.disease_lists.map((item: any) => {
        if (item.disease_id == sms.disease_id) {
          sms.disease_name_th = item.disease_name_th
        }
      })
    })
    this.sms_unregistered_lists?.data?.map((sms: any) => {
      this.disease_lists.map((item: any) => {
        if (item.disease_id == sms.disease_id) {
          sms.disease_name_th = item.disease_name_th
        }
      })
    })
  }

  mapTemplate() {
    this.sms_waiting_lists?.data?.map((sms: any) => {
      this.template_lists?.data?.map((item: any) => {
        if (item.id == sms.template_id) {
          sms.template_title = item.title
        }
      })
    })
    this.sms_sending_lists?.data?.map((sms: any) => {
      this.template_lists?.data?.map((item: any) => {
        if (item.id == sms.template_id) {
          sms.template_title = item.title
        }
      })
    })
    this.sms_registered_lists?.data?.map((sms: any) => {
      this.template_lists?.data?.map((item: any) => {
        if (item.id == sms.template_id) {
          sms.template_title = item.title
        }
      })
    })
    this.sms_unregistered_lists?.data?.map((sms: any) => {
      this.template_lists?.data?.map((item: any) => {
        if (item.id == sms.template_id) {
          sms.template_title = item.title
        }
      })
    })
  }

  mapOrg() {
    this.sms_waiting_lists?.data?.map((sms: any) => {
      this.org_lists?.map((item: any) => {
        if (item.org_id == sms.imported_org_id) {
          sms.imported_org_name = item.org_name
        }
      })
    })
    this.sms_sending_lists?.data?.map((sms: any) => {
      this.org_lists?.map((item: any) => {
        if (item.org_id == sms.imported_org_id) {
          sms.imported_org_name = item.org_name
        }
      })
    })
    this.sms_registered_lists?.data?.map((sms: any) => {
      this.org_lists?.map((item: any) => {
        if (item.org_id == sms.imported_org_id) {
          sms.imported_org_name = item.org_name
        }
      })
    })
    this.sms_unregistered_lists?.data?.map((sms: any) => {
      this.org_lists?.map((item: any) => {
        if (item.org_id == sms.imported_org_id) {
          sms.imported_org_name = item.org_name
        }
      })
    })
  }

  displayActivePageWaiting(activePageNumber: number) {
    this.activePage = activePageNumber
    this.paginationWaiting.page = activePageNumber
    this.initAllData()
  }
  displayActivePageSending(activePageNumber: number) {
    this.activePage = activePageNumber
    this.paginationSending.page = activePageNumber
    this.initAllData()
  }
  displayActivePageRegistered(activePageNumber: number) {
    this.activePage = activePageNumber
    this.paginationRegistered.page = activePageNumber
    this.initAllData()
  }
  displayActivePageUnregistered(activePageNumber: number) {
    this.activePage = activePageNumber
    this.paginationUnregistered.page = activePageNumber
    this.initAllData()
  }

  removeSMS(id: any) {
    console.log('remove', id)
    this.swal.alertConfirmDanger('ยืนยันการลบ', 'ลบ SMS ' + id + ' หรือไม่', 'ลบ', 'ยกเลิก').then((result: any) => {
      if (result.value) {
        this.backendService.removeSMS(id).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal.alertSuccessSetTimeOut("", "ลบ SMS " + id + " สำเร็จ", 2000)
            this.initAllData()
          }
        }, error => {
          this.swal.alertWarning("", error["message"], "")
        })
      }
    })
  }

}
