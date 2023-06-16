import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, UntypedFormControl } from '@angular/forms';
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { AuthService } from '../../auth/services/auth.service'
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service'
import { ModalConfig, ShowModalComponent } from '../../../_metronic/partials';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  form: FormGroup;

  _user: any

  symptoms_lists: any
  questions_lists: any

  risk_level: any = [
    { id: 1, title: "เสี่ยงต่ำ" },
    { id: 2, title: "เสี่ยงปานกลาง" },
    { id: 3, title: "เสี่ยงสูง" },
  ]

  modalConfig: ModalConfig = {
    modalTitle: 'ตัวอย่างการแสดงผลบนแอปพลิเคชัน',
    dismissButtonLabel: 'ปิด',
    closeButtonLabel: 'บันทึก'
  };
  closeModalResult: any

  @ViewChild('modalPreview') private modalPreviewComponent: ShowModalComponent;
  constructor(
    private fb: FormBuilder,
    private backendService: BackendDdcCareService,
    private auth: AuthService,
    private swal: SweetalertService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getAllSymptom()
    this.getAllQuestion()
  }

  initForm() {
    this.form = this.fb.group({
      name_th: ['', [Validators.required]],
      name_en: [''],
      code_icd10: [''],
      code_r506: [''],
      status: ['1'],
      created_by: [''],
      symptoms: this.fb.array([]),
      questions: this.fb.array([]),
      medical_advice_risk1_th: [''],
      medical_advice_risk1_en: [''],
      medical_advice_risk2_th: [''],
      medical_advice_risk2_en: [''],
      medical_advice_risk3_th: [''],
      medical_advice_risk3_en: [''],
    });
  }

  get symptoms() {
    return this.form.controls["symptoms"] as FormArray;
  }

  addSymptoms() {
    const symptomsForm = this.fb.group({
      id: [''],
      level: ['']
    });
    this.symptoms.push(symptomsForm);
  }

  deleteSymptoms(symptomsIndex: number) {
    this.symptoms.removeAt(symptomsIndex);
  }

  get questions() {
    return this.form.controls["questions"] as FormArray;
  }

  addQuestions() {
    const questionsForm = this.fb.group({
      id: [''],
      question_name_th: [''],
      answer_type: [''],
      answer_condition: [''],
      answer_unit: [''],
      answer_require: ['-'],
    });
    this.questions.push(questionsForm);
  }

  deleteQuestions(questionsIndex: number) {
    this.questions.removeAt(questionsIndex);
  }

  getAllSymptom() {
    let pagination = {
      page: '',
      limit: 1000
    }
    this.backendService.getAllSymptom(pagination).subscribe((data: any) => {
      if (data.status == 200) {
        this.symptoms_lists = data.body
        console.log(this.symptoms_lists)
      }
    })
  }

  getAllQuestion() {
    let pagination = {
      page: '',
      limit: 1000
    }
    this.backendService.getAllQuestion(pagination).subscribe((data: any) => {
      if (data.status == 200) {
        this.questions_lists = data.body
        console.log('questions_lists', this.questions_lists)
      }
    })
  }

  onQuestionChange(form: any) {
    this.questions_lists?.data.forEach((item: any) => {
      if (item.id == form.controls.id.value) {
        form.controls['question_name_th'].setValue(item.question_name_th)
        form.controls['answer_type'].setValue(item.answer_type)
        form.controls['answer_condition'].setValue(item.answer_condition)
        form.controls['answer_require'].setValue(item.answer_require)
        form.controls['answer_unit'].setValue(item.answer_unit)
        return
      }
    });
    return
  }

  prepareData(status: any) {
    let data = this.form.value
    this._user = this.auth.identityClaims
    data.created_by = this._user?.user_name
    data.status = status
    let medical_advice = [
      {
        symptom_level: 1,
        th: this.form.get('medical_advice_risk1_th')?.value,
        en: this.form.get('medical_advice_risk1_en')?.value
      },
      {
        symptom_level: 2,
        th: this.form.get('medical_advice_risk2_th')?.value,
        en: this.form.get('medical_advice_risk2_en')?.value
      },
      {
        symptom_level: 3,
        th: this.form.get('medical_advice_risk3_th')?.value,
        en: this.form.get('medical_advice_risk3_en')?.value
      },
    ]
    data.medical_advice = medical_advice
    delete data.medical_advice_risk1_th
    delete data.medical_advice_risk1_en
    delete data.medical_advice_risk2_th
    delete data.medical_advice_risk2_en
    delete data.medical_advice_risk3_th
    delete data.medical_advice_risk3_en
    data.questions.map((item: any) => {
      delete item.question_name_th
      delete item.answer_unit
      delete item.answer_type
      delete item.answer_require
      delete item.answer_condition
    })
    console.log(data)
    return data
  }

  async createDisease(status: any) {
    // this.changeDatePicker()
    // this.changeOrg()
    const data = this.prepareData(status)

    if (!this.form.invalid) {
      this.swal.alertConfirm('บันทึกข้อมูลหรือไม่?', '', 'บันทึก', 'ยกเลิก').then((result: any) => {
        if (result.value) {
          // this.markFormGroupTouched(this.form);
          this.backendService.createDisease(data).subscribe((data) => {
            if (data.status == 201) {
              this.swal.alertSuccess("บันทึกข้อมูลสำเร็จ", "", "รับทราบ")
              this.resetForm()
            }
          })
        }
      }, error => {
        this.swal.alertWarning("", error["message"], "")
      })
    } else {
      this.getFormValidationErrors()
      // this.form.controls['imported_org_id'].setValue(this.selected_org_json)
      console.log('invalid', this.form.invalid)
      console.log(this.form.value)
      this.swal.alertWarning("Warning!", "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "รับทราบ")
    }


  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: any = this.form.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  resetForm() {
    this.form.reset()
    this.initForm()
  }

  async openModalPreview() {
    return await this.modalPreviewComponent.open().then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });

    // return await this.modalComponent.open();
  }
}
