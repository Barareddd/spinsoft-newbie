import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit {

  @Input() form: FormGroup;

  answer_type: any = [
    {
      title: "text",
      value: "ข้อความ"
    },
    {
      title: "number",
      value: "ตัวเลข"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onAnswerRequireChange(e: any) {
    console.log(e.target.checked)
    this.form.controls['answer_require'].setValue(e.target.checked ? 1 : 0)
    console.log(this.form.value)
  }

  onAnswerTypeChange() {
    if (this.form.get('answer_type')?.value == 'text') {
      this.form.controls['answer_condition_min'].setValue(0)
    } else {
      this.form.controls['answer_condition_min'].setValue('')
    }
    this.form.controls['answer_condition_max'].setValue('')
  }

  onStatusChange(e: any) {
    console.log(e.target.checked)
    this.form.controls['active'].setValue(e.target.checked ? 1 : 0)
    console.log(this.form.value)
  }

}
