import { Component, OnDestroy, OnInit, AfterViewChecked } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ManagePersonService } from '../../../services/manage-person.service';
import { MasterDataService } from '../../../services/master-data.service'
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service'
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import * as _moment from 'moment';
const moment = _moment;

declare let longdo: any;

@Component({
  selector: 'app-edit-monitor',
  templateUrl: './edit-monitor.component.html',
  styleUrls: ['./edit-monitor.component.scss']
})
export class EditMonitorComponent implements OnInit, OnDestroy, AfterViewChecked {
  allRiskPersonData: any
  subscriber: Subscription
  monitoringData: any
  personData: any
  contactStatusSelected: any


  organization: any[]
  organizationFiltered: ReplaySubject<any[]> = new ReplaySubject<any[]>()
  locationType: any[]
  locationSub = new BehaviorSubject<any>(null);
  monitorEdited: any
  userId: string
  contactType: any[]
  quarantinePoint: any[] = []

  constructor(
    private personService: ManagePersonService,
    private masterData: MasterDataService,
    private router: Router,
    private sweetAlert: SweetalertService,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('monitoringSelected') != undefined && localStorage.getItem('allRiskData') != undefined) {
      this.monitoringData = JSON.parse(localStorage.getItem('monitoringSelected') || '{}')
      this.personData = JSON.parse(localStorage.getItem('allRiskData') || '{}')['personData']
      this.contactStatusSelected = this.monitoringData.contact_status_type
      this.getMasterData()
      this.convertFormatMonitoringData()
    } else {
      this.router.navigate(['app/manage-person/view']);
    }
  }


  updateMonitoring() {
    // let strMonitor = JSON.stringify(this.monitoringData)
    // this.monitorEdited = JSON.parse(strMonitor)
    // this.monitorEdited = this.revertFormatMonitoringData()
    // console.log(this.monitorEdited)
    // this.router.navigate(['/app/manage-person/viewMonitoring'])

    if (this.isDataChange()) {
      this.sweetAlert.alertConfirm('ต้องแก้ไขข้อมูลใช่หรือไม่', '', 'ใช่', 'ไม่').then(result => {
        if (result.isConfirmed) {
          
          this.personService.putContactStatus(this.personData['user_id'], this.personData['person_id'], this.contactStatusSelected, this.monitoringData['monitor_lap'], this.monitoringData['disease_id']).subscribe(res => {
            if (res.status == 200) {
              this.monitoringData['contact_status_type'] = this.contactStatusSelected
              console.log(this.contactType)
              this.monitoringData['contact_name'] = this.contactType.filter((type: any) => type['contact_status'] == this.contactStatusSelected)[0] ['contact_name'] || ''
              this.sweetAlert.alertSuccessSetTimeOut('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 2000)
              this.getMonitoring(this.personData['user_id'])
            } else {
              this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลได้', 2000)
            }
          }, err => {
            this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลได้', 2000)
          })
        }
      })
    }
    console.log(this.monitoringData['contact_status_type'], this.contactStatusSelected)

  }

  isDataChange() {
    return this.monitoringData['contact_status_type'] != this.contactStatusSelected
  }

  convertFormatMonitoringData() {
    this.monitoringData['monitor_phase'] = this.monitoringData['monitor_phase'].map((phase: any) => {
      phase['started_date'] = moment.unix(phase['started_ts']).format("YYYY-MM-DD")
      phase['ended_date'] = moment.unix(phase['ended_ts']).format("YYYY-MM-DD")
      phase['quarantine_point_type'] = phase['quarantine_points'].map((point: any) => { return point.location_type })
      return phase
    })
  }

  revertFormatMonitoringData() {
    let strMonitor = JSON.stringify(this.monitoringData)
    this.monitorEdited = JSON.parse(strMonitor)

    return this.monitorEdited.map((monitor: any) => {
      monitor['monitor_phase'] = monitor['monitor_phase'].map((phase: any) => {
        // จัด format ให้เป็น unix timestamp
        phase['started_ts'] = moment(phase['started_ts']).unix()
        phase['ended_ts'] = moment(phase['ended_ts']).unix()
        return phase
      })
      return monitor
    })
  }

  ngOnDestroy() {
    // this.subscriber.unsubscribe()
  }



  getMasterData() {
    this.masterData.getOrganization().subscribe(res => this.organization = res.data)

    this.masterData.getLocationType().subscribe((res: any) => {
      this.locationType = res.data.map((location: any) => { return { 'location_type': location.location_type, 'location_name': location.location_name } })
      this.locationSub.next(this.locationType)
    })

    this.masterData.getCloseContactType().subscribe((res: any) => {
      this.contactType = res.data.filter((d: any) => { return d.contact_status != 4 })
    })
  }

  getMonitoring(userId: string) {
    this.personService.getMonitoring(userId).subscribe((res: any) => {
      if (res.status == 200 && res['body']['data']) {
        // this.monitoringData = res['body']['data']
        // localStorage.setItem('monitoringSelected', )
        const allRiskData = JSON.parse(localStorage.getItem('allRiskData') || '{}')
        allRiskData['monitoringData'] = this.monitoringData
        localStorage.setItem('allRiskData', JSON.stringify(allRiskData))
        localStorage.setItem('monitoringSelected', JSON.stringify(this.monitoringData))
        this.router.navigate(['/app/manage-person/viewMonitoring'])
      }
    }, err => {
      console.log(err)
    })
  }



  orgDisplay(org: any) {
    return org ? org['org_name'] : ''
  }

  filterOrg(name: string): any[] {
    if (typeof name === 'string') {
      return this.organization.filter(org =>
        org ? org['org_name'].toLowerCase().indexOf(name.toLowerCase()) >= 0 : []).slice(0, 5)
    } else {
      return this.organization.filter(() => true)
    }
  }

  ngAfterViewChecked() {

  }

  goView() {
    this.router.navigate(['/app/manage-person/view'])
  }



}
