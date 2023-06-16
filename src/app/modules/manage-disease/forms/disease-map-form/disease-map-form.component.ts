import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, UntypedFormControl } from '@angular/forms';
import { BackendDdcCareService } from '../../../../services/backend-ddc-care.service'
import { ModalConfig, EditModalComponent } from '../../../../_metronic/partials';
import { SweetalertService } from '../../../shared/sweetalert/sweetalert.service';

@Component({
  selector: 'app-disease-map-form',
  templateUrl: './disease-map-form.component.html',
  styleUrls: ['./disease-map-form.component.scss']
})
export class DiseaseMapFormComponent implements OnInit {

  @Input() form: FormGroup;

  formSymptom: FormGroup;
  formQuestion: FormGroup;

  symptoms_lists: any;
  questions_lists: any;

  risk_level: any = [
    { id: 1, title: "เสี่ยงต่ำ" },
    { id: 2, title: "เสี่ยงปานกลาง" },
    { id: 3, title: "เสี่ยงสูง" },
  ]

  modalConfig: ModalConfig = {
    modalTitle: 'แก้ไขข้อมูลโรค',
    dismissButtonLabel: 'ยกเลิก',
    closeButtonLabel: 'บันทึก'
  };
  closeModalResult: any

  @ViewChild('modalAddSymptom') private modalAddSymptomComponent: EditModalComponent;
  @ViewChild('modalAddQuestion') private modalAddQuestionComponent: EditModalComponent;
  constructor(
    private fb: FormBuilder,
    private swal: SweetalertService,
    private backendService: BackendDdcCareService
  ) { }

  ngOnInit(): void {
    this.getAllSymptom()
    this.getAllQuestion()
    this.initFormSymptom()
    this.initFormQuestion()
  }

  get symptoms() {
    return this.form.controls["symptoms"] as FormArray;
  }

  addSymptoms() {
    const symptomsForm = this.fb.group({
      id: ['', Validators.required],
      level: ['', Validators.required]
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
      id: ['', Validators.required],
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

  getAllSymptom() {
    let pagination = {
      page: '',
      active: 1,
      limit: 1000
    }
    this.backendService.getAllSymptom(pagination).subscribe((data: any) => {
      if (data.status == 200) {
        this.symptoms_lists = data.body
        console.log('symptoms_lists', this.symptoms_lists)
      }
    })
  }

  getAllQuestion() {
    let pagination = {
      page: '',
      active: 1,
      limit: 1000
    }
    this.backendService.getAllQuestion(pagination).subscribe((data: any) => {
      if (data.status == 200) {
        this.questions_lists = data.body
        console.log('questions_lists', this.questions_lists)
      }
    })
  }

  getAnswerTypeByID(id: any) {
    let res = '-'
    this.questions_lists?.data.map((item: any) => {
      if (item.id == id) {
        res = item.answer_type
      }
    })
    return res
  }

  getAnswerConditionByID(id: any) {
    let res = '-'
    this.questions_lists?.data.map((item: any) => {
      if (item.id == id) {
        res = item.answer_condition
      }
    })
    return res
  }

  initFormSymptom() {
    this.formSymptom = this.fb.group({
      common_term_th: ['', [Validators.required]],
      common_term_en: [''],
      technical_term: [''],
      code_icd10: [''],
      code_r506: [''],
      active: [1],
    });
  }

  initFormQuestion() {
    this.formQuestion = this.fb.group({
      question_name_th: ['', [Validators.required]],
      question_name_en: [''],
      description_th: [''],
      description_en: [''],
      answer_type: ['', [Validators.required]],
      answer_condition: [''],
      answer_condition_min: ['', [Validators.required]],
      answer_condition_max: ['', [Validators.required]],
      answer_unit: [''],
      answer_require: [0],
      active: [1],
    });
  }

  async openModalAddSymptom() {
    this.initFormSymptom()
    this.modalConfig.modalTitle = "เพิ่มข้อมูลอาการ"
    console.log("openModalAddSymptom")
    return await this.modalAddSymptomComponent.open({ size: 'md', backdrop: 'static', scrollable: true }).then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });
  }

  async openModalAddQuestion() {
    this.initFormQuestion()
    this.modalConfig.modalTitle = "เพิ่มข้อมูลคำถาม"
    console.log("openModalAddQuestion")
    return await this.modalAddQuestionComponent.open({ size: 'lg', backdrop: 'static', scrollable: true }).then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });
  }

  saveFormAddSymptom(e: any) {
    console.log(e)
    if (!this.formSymptom.invalid && e) {
      this.markFormGroupTouched(this.formSymptom);
      let data = this.formSymptom.value
      this.backendService.createSymptom(data).subscribe((data) => {
        if (data.status == 201) {
          this.swal.alertSuccess("เพิ่มข้อมูลอาการสำเร็จ", "", "รับทราบ")
          this.formSymptom.reset()
          this.getAllSymptom()
        }
      }, ((error: any) => {
        this.swal.alertError(error.status, error.statusText, "รับทราบ")
        this.formSymptom.reset()
      }))
    } else {
      // this.getFormValidationErrors()
      console.log('invalid', this.formSymptom.invalid)
      console.log(this.formSymptom.value)
      this.swal.alertWarning("Warning!", "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "รับทราบ")
    }
  }

  prepareSaveQuestion() {
    let data = this.formQuestion.value
    let tmp_obj = {
      min: Number(this.formQuestion.get('answer_condition_min')?.value),
      max: Number(this.formQuestion.get('answer_condition_max')?.value)
    }
    data.answer_condition = tmp_obj
    delete data.answer_condition_min
    delete data.answer_condition_max
    this.formQuestion.get('answer_condition_min')?.clearValidators();
    this.formQuestion.get('answer_condition_min')?.updateValueAndValidity();
    this.formQuestion.get('answer_condition_max')?.clearValidators();
    this.formQuestion.get('answer_condition_max')?.updateValueAndValidity();
    return data
  }

  saveFormAddQuestion(e: any) {
    console.log(e)
    const data = this.prepareSaveQuestion()
    console.log(data)
    if (!this.formQuestion.invalid && e) {
      // this.markFormGroupTouched(this.form);
      this.backendService.createQuestion(data).subscribe((data) => {
        if (data.status == 201) {
          this.swal.alertSuccess("เพิ่มข้อมูลคำถามสำเร็จ", "", "รับทราบ")
          this.getAllQuestion()
        }
      })
    } else {
      // this.getFormValidationErrors()
      // this.form.controls['imported_org_id'].setValue(this.selected_org_json)
      console.log('invalid', this.formQuestion.invalid)
      console.log(this.formQuestion.value)
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

}
