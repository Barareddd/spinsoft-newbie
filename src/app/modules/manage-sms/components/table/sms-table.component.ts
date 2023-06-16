import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-sms-table',
  templateUrl: './sms-table.component.html',
  styleUrls: ['./sms-table.component.scss']
})
export class SmsTableComponent implements OnInit {

  @Input() sms_lists: any
  @Output() removeByID: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  getHumanDateTH(ts: any) {
    return moment.unix(ts).locale('th').add(543, 'year').format('ll')
  }

  removeSMS(id: any) {
    this.removeByID.emit(id)
  }

}
