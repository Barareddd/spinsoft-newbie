import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MasterDataService } from '../../../services/master-data.service'
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-view-monitoring',
  templateUrl: './view-monitoring.component.html',
  styleUrls: ['./view-monitoring.component.scss']
})
export class ViewMonitoringComponent implements OnInit {
  allRiskPersonData: any
  subscriber: Subscription
  personData: any
  monitoringData: any
  


  organization: any[]
  organizationFiltered: ReplaySubject<any[]> = new ReplaySubject<any[]>()

  locationType: any[]
  locationSub = new BehaviorSubject<any>(null);
  contactType: any

  constructor(
    private masterData: MasterDataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('monitoringSelected') != undefined) {
      this.monitoringData = JSON.parse(localStorage.getItem('monitoringSelected') || '{}')
      this.getMasterData()
    } else {
      this.router.navigate(['app/manage-person/view']);
    }
  }

  getMasterData() {
    this.masterData.getOrganization().subscribe(res => this.organization = res.data)

    this.masterData.getLocationType().subscribe((res: any) => {
      this.locationType = res.data.map((location: any) => { return { 'location_type': location.location_type, 'location_name': location.location_name } })
      this.locationSub.next(this.locationType)
    })

    this.masterData.getCloseContactType().subscribe((res: any) => {
      this.contactType = res.data
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

  goView() {
    this.router.navigate(['app/manage-person/view']);
  }

  goEditMonitoring() {
    localStorage.setItem('monitoringSelected', JSON.stringify(this.monitoringData))
    this.router.navigate(['/app/manage-person/editMonitoring'])
  }

}
