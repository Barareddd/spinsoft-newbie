import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-advice-detail',
  templateUrl: './advice-detail.component.html',
  styleUrls: ['./advice-detail.component.scss']
})
export class AdviceDetailComponent implements OnInit {

  @Input() disease_detail: any;

  constructor() { }

  ngOnInit(): void {
  }

}
