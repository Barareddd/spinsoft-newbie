import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-question-lists',
  templateUrl: './question-lists.component.html',
  styleUrls: ['./question-lists.component.scss']
})
export class QuestionListsComponent implements OnInit {

  @Input() lists: any
  @Input() pagination: any
  @Output() editByID: EventEmitter<any> = new EventEmitter();
  @Output() removeByID: EventEmitter<any> = new EventEmitter();
  @Output() activePage: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  getHumanDate(ts: any) {
    return moment.unix(ts).add(543, 'year').format('YYYY-MM-DD');
  }

  getHumanDateTH(ts: any) {
    return moment.unix(ts).locale('th').add(543, 'year').format('ll')
  }

  edit(id: any) {
    this.editByID.emit(id)
  }

  remove(id: any) {
    this.removeByID.emit(id)
  }

  displayActivePage(activePageNumber: number) {
    this.pagination.page = activePageNumber
    this.activePage.emit(activePageNumber)
  }

}
