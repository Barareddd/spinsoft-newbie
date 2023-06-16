import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-disease-detail',
  templateUrl: './disease-detail.component.html',
  styleUrls: ['./disease-detail.component.scss']
})
export class DiseaseDetailComponent implements OnInit {

  @Input() disease_detail: any;

  constructor() { }

  ngOnInit(): void {
  }

}
