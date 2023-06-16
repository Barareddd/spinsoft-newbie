import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { ManagePersonService } from '../../../services/manage-person.service'
import { BehaviorSubject } from 'rxjs'
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-person',
  templateUrl: './search-person.component.html',
  styleUrls: ['./search-person.component.scss']
})
export class SearchPersonComponent implements OnInit, OnDestroy {
  personId: string = ''
  haveResult = new BehaviorSubject<boolean>(true);
  historySearch: any[] = []

  constructor(
    private personService: ManagePersonService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.haveResult.next(true)
    // if (localStorage.getItem('search_person_id')) {
    //   this.personId = localStorage.getItem('search_person_id') || ''
    // }

    if (localStorage.getItem('historySearch')) {
      this.historySearch = JSON.parse(localStorage.getItem('historySearch') || '[]')
    }

  }


  ngOnDestroy(): void {
    this.haveResult.unsubscribe()
  }

  inputToUpperCase() {
    this.personId = this.personId.toLocaleUpperCase()
    if (this.personId === '') {
      this.haveResult.next(true)
    }
  }

  openFromHistory(person_id: string) {
    this.personId = person_id
    this.search()
  }

  search() {
    // localStorage.setItem('search_person_id', `${this.personId}`)
    this.personService.searchUser(this.personId)
      .subscribe((res: any) => {
        if (res.status == 200 && res.body.data) {
          this.haveResult.next(true)
          this.personService.setPersonData(res.body.data)
          this.historySearch.push({
          'person_id': res.body.data.person_id, 
          'firstname': res.body.data.firstname, 
          'lastname': res.body.data.lastname,
          'displayName': `${res.body.data.person_id} ${res.body.data.firstname} ${res.body.data.lastname}`
        })
          this.historySearch = this.historySearch.filter((li, idx, self) => self.map(itm => itm.person_id).indexOf(li.person_id) === idx)
          localStorage.setItem('historySearch', JSON.stringify(this.historySearch))
          this.router.navigate(['app/manage-person/view']);
        } else {
          this.haveResult.next(false)
        }
      }, err => {
        if (err.status == 404) {
          this.haveResult.next(false)
        }
      })
  }

} 
