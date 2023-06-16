import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-symptom-form',
  templateUrl: './symptom-form.component.html',
  styleUrls: ['./symptom-form.component.scss']
})
export class SymptomFormComponent implements OnInit {

  @Input() form: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  onStatusChange(e: any) {
    console.log(e.target.checked)
    this.form.controls['active'].setValue(e.target.checked ? 1 : 0)
    console.log(this.form.value)
  }

}
