import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment'
import { Router } from '@angular/router';

type Tabs =
  | 'disease_tab'
  | 'question_tab'
  | 'tracking_tab';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  disease_inactive_lists: any = []
  disease_active_lists: any = []
  disease_draft_lists: any = []

  activePageActive: any
  activePageInactive: any
  activePageDraft: any
  paginationInactive: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }
  paginationActive: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }
  paginationDraft: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }

  filter: any = {
    inactive: 0,
    active: 1,
    draft: 2
  }

  constructor(
    private backendService: BackendDdcCareService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  activeTab: Tabs = 'disease_tab';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.getAllDisease()
  }

  getHumanDate(ts: any) {
    return moment.unix(ts).add(543, 'year').format('YYYY-MM-DD');
  }

  getHumanDateTH(ts: any) {
    return moment.unix(ts).locale('th').add(543, 'year').format('ll')
  }

  getAllDisease() {
    forkJoin({
      requestDiseaseInactive: this.backendService.getAllDisease(this.paginationInactive, this.filter?.inactive).pipe(map((res) => res), catchError(e => of(e))),
      requestDiseaseActive: this.backendService.getAllDisease(this.paginationActive, this.filter?.active).pipe(map((res) => res), catchError(e => of(e))),
      requestDiseaseDraft: this.backendService.getAllDisease(this.paginationDraft, this.filter?.draft).pipe(map((res) => res), catchError(e => of(e)))
    })
      .subscribe(({ requestDiseaseInactive, requestDiseaseActive, requestDiseaseDraft }) => {
        console.log(requestDiseaseActive)
        if (requestDiseaseActive.status == 200) {
          this.disease_active_lists = requestDiseaseActive?.body;
          this.paginationActive = requestDiseaseActive?.body?.pagination
        }
        if (requestDiseaseInactive.status == 200) {
          this.disease_inactive_lists = requestDiseaseInactive?.body;
          this.paginationInactive = requestDiseaseInactive?.body?.pagination
        }
        if (requestDiseaseDraft.status == 200) {
          this.disease_draft_lists = requestDiseaseDraft?.body;
          this.paginationDraft = requestDiseaseDraft?.body?.pagination
        }
        console.log(requestDiseaseActive)
        console.log(requestDiseaseInactive)
        console.log(requestDiseaseDraft)
        this.ref.detectChanges();
      });
  }

  displayActivePageActive(activePageNumber: number) {
    this.paginationActive.page = activePageNumber
    // this.activePageActive.emit(activePageNumber)
    this.getAllDisease()
  }

  displayActivePageInactive(activePageNumber: number) {
    this.paginationInactive.page = activePageNumber
    // this.activePageInactive.emit(activePageNumber)
    this.getAllDisease()
  }

  displayActivePageDraft(activePageNumber: number) {
    this.paginationDraft.page = activePageNumber
    // this.activePageDraft.emit(activePageNumber)
    this.getAllDisease()
  }

  createDisease() {
    this.router.navigate(['/app/manage-disease/create']);
  }

}
