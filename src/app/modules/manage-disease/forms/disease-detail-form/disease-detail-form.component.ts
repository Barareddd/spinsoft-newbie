import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-disease-detail-form',
  templateUrl: './disease-detail-form.component.html',
  styleUrls: ['./disease-detail-form.component.scss']
})
export class DiseaseDetailFormComponent implements OnInit {

  @Input() form: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
