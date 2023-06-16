import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-app-preview',
  templateUrl: './app-preview.component.html',
  styleUrls: ['./app-preview.component.scss']
})
export class AppPreviewComponent implements OnInit {

  form: FormGroup
  preview_current_step: any = 1
  preview_final_step: any = 0

  summary_data: any
  summary_symptom: any

  symptom_lists: any = [
    {
      id: 21,
      code_icd10: "H531",
      code_r506: "",
      technical_term: "Photophobia",
      common_term_th: "กลัวแสง",
      common_term_en: "Photophobia",
      count_disease: 0,
      active: 1,
      created_ts: 1657523083,
      updated_ts: 1657523083
    },
    {
      id: 23,
      code_icd10: "F60-",
      code_r506: "",
      technical_term: "Aggressive",
      common_term_th: "ก้าวร้าว",
      common_term_en: "Aggressive",
      count_disease: 0,
      active: 1,
      created_ts: 1657523083,
      updated_ts: 1657523083
    },
    {
      id: 30,
      code_icd10: "R25",
      code_r506: "",
      technical_term: "Muscle twitching",
      common_term_th: "แขนขากระตุก",
      common_term_en: "Muscle twitching",
      count_disease: 0,
      active: 1,
      created_ts: 1657523083,
      updated_ts: 1657523083
    }
  ]

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initAppPreviewForm()
    this.calcStep()
  }

  calcStep() {
    const questions: FormArray = this.form.get('questions') as FormArray;
    this.preview_final_step = questions.length + 1
  }

  initAppPreviewForm() {
    this.form = this.formBuilder.group({
      symptoms: this.formBuilder.array([]),
      questions: this.formBuilder.array([]),
    })
  }

  onSymptomChange(e: any) {
    const symptoms: FormArray = this.form.get('symptoms') as FormArray;

    if (e.target.checked) {
      const checkbox = document.getElementById(
        'clear_symptom',
      ) as HTMLInputElement | null;
      if (checkbox != null) {
        checkbox.checked = false;
      }
      symptoms.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      symptoms.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          symptoms.removeAt(i);
          return;
        }
        i++;
      });
    }
    // console.log('symptoms', symptoms.value)
  }

  onClearSymptom(e: any) {
    if (e.target.checked) {
      const symptoms: FormArray = this.form.get('symptoms') as FormArray;
      while (symptoms.length !== 0) {
        const checkbox = document.getElementById(
          'symptom_' + symptoms.value[0],
        ) as HTMLInputElement | null;
        if (checkbox != null) {
          checkbox.checked = false;
        }
        symptoms.removeAt(0)
      }
      // console.log('symptoms', symptoms.value)
    }
  }

  nextStep() {
    this.preview_current_step++
    if (this.preview_current_step == this.preview_final_step + 1) {
      this.summarySymtoms()
    }
  }

  backStep() {
    this.preview_current_step--
    if (this.preview_current_step == 1) {
      this.resetPreview()
    }
  }

  summarySymtoms() {
    this.summary_symptom = []
    const symptoms: FormArray = this.form.get('symptoms') as FormArray;
    symptoms.controls.forEach((id: any) => {
      this.symptom_lists.map((item: any) => {
        console.log(id.value)
        console.log(item)
        if (id.value == item.id) {
          this.summary_symptom.push(item.common_term_th)
        }
      })
    });
    console.log(this.summary_symptom)
  }

  fakeSendData() {
    this.preview_current_step = 88
  }

  showResult() {
    this.preview_current_step = 99
  }

  resetPreview() {
    this.preview_current_step = 1
    this.summary_symptom = []
    this.initAppPreviewForm()
    this.calcStep()
  }

  getCurrentDate() {
    let date = new Date()
    return date.setFullYear(date.getFullYear() + 543);
  }

}
