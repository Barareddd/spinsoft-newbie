import { Component, OnInit, Input } from '@angular/core';
import { MasterDataService } from '../../../../services/master-data.service'

@Component({
  selector: 'app-symptom-detail',
  templateUrl: './symptom-detail.component.html',
  styleUrls: ['./symptom-detail.component.scss']
})
export class SymptomDetailComponent implements OnInit {

  @Input() symptoms: any;
  @Input() disease_detail: any;

  constructor(private masterDataService: MasterDataService) { }

  ngOnInit(): void {
    console.log(this.symptoms)
  }

  getSymptomsTitleByArrID(arr_id: any) {
    let title: any = []
    arr_id.forEach((id: any) => {
      this.masterDataService.getSymptomsByID(id).subscribe((data: any) => {
        if (data) {
          title.push(data?.common_term_th)
        } else {
          title.push(id)
        }
      })
    });
    return title
  }

}
