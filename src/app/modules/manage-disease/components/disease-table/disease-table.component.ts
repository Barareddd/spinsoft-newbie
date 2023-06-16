import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-disease-table',
  templateUrl: './disease-table.component.html',
  styleUrls: ['./disease-table.component.scss']
})
export class DiseaseTableComponent implements OnInit {

  @Input() disease_lists: any

  constructor() { }

  ngOnInit(): void {
  }

  getHumanDateTH(ts: any) {
    return moment.unix(ts).locale('th').add(543, 'year').format('ll')
  }

}
