import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment'
import { ModalConfig, EditModalComponent } from '../../../_metronic/partials';
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service';

type Tabs =
  | 'kt_table_widget_5_tab_1'
  | 'kt_table_widget_5_tab_2'
  | 'kt_table_widget_5_tab_3';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  formSymptom: FormGroup;
  formQuestion: FormGroup;

  symptom_lists: any = []
  question_lists: any = []

  symptom: any = []
  question: any = []

  symptom_id: any
  question_id: any

  paginationSymptom: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }
  paginationQuestion: any = {
    "limit": 10,
    "offset": 0,
    "page": 1,
    "pages": 0,
    "total": 0
  }
  modalConfig: ModalConfig = {
    modalTitle: 'แก้ไขข้อมูลโรค',
    dismissButtonLabel: 'ยกเลิก',
    closeButtonLabel: 'บันทึก'
  };
  closeModalResult: any

  @ViewChild('modalAddSymptom') private modalAddSymptomComponent: EditModalComponent;
  @ViewChild('modalEditSymptom') private modalEditSymptomComponent: EditModalComponent;
  @ViewChild('modalAddQuestion') private modalAddQuestionComponent: EditModalComponent;
  @ViewChild('modalEditQuestion') private modalEditQuestionComponent: EditModalComponent;
  constructor(
    private backendService: BackendDdcCareService,
    private swal: SweetalertService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) { }

  activeTab: Tabs = 'kt_table_widget_5_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.getAllData()
    this.initFormSymptom()
    this.initFormQuestion()
  }

  getHumanDate(ts: any) {
    return moment.unix(ts).add(543, 'year').format('YYYY-MM-DD');
  }

  displayActivePageSymptom(activePageNumber: number) {
    this.paginationSymptom.page = activePageNumber
    this.getAllData()
  }

  displayActivePageQuestion(activePageNumber: number) {
    this.paginationQuestion.page = activePageNumber
    this.getAllData()
  }

  getAllData() {
    forkJoin({
      requestSymptom: this.backendService.getAllSymptom(this.paginationSymptom).pipe(map((res) => res), catchError(e => of(e))),
      requestQuestion: this.backendService.getAllQuestion(this.paginationQuestion).pipe(map((res) => res), catchError(e => of(e))),
    })
      .subscribe(({ requestSymptom, requestQuestion }) => {
        if (requestSymptom.status == 200) {
          this.symptom_lists = requestSymptom?.body;
          this.paginationSymptom = requestSymptom?.body?.pagination
        }
        if (requestQuestion.status == 200) {
          this.question_lists = requestQuestion?.body;
          this.paginationQuestion = requestQuestion?.body?.pagination
        }
        this.ref.detectChanges();
      });
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

  initFormSymptomValue() {
    this.formSymptom.controls['common_term_th'].setValue(this.symptom?.common_term_th)
    this.formSymptom.controls['common_term_en'].setValue(this.symptom?.common_term_en)
    this.formSymptom.controls['technical_term'].setValue(this.symptom?.technical_term)
    this.formSymptom.controls['code_icd10'].setValue(this.symptom?.code_icd10)
    this.formSymptom.controls['code_r506'].setValue(this.symptom?.code_r506)
    this.formSymptom.controls['active'].setValue(this.symptom?.active)
  }

  initFormQuestionValue() {
    this.formQuestion.controls['question_name_th'].setValue(this.question?.question_name_th)
    this.formQuestion.controls['question_name_en'].setValue(this.question?.question_name_en)
    this.formQuestion.controls['description_th'].setValue(this.question?.description_th)
    this.formQuestion.controls['description_en'].setValue(this.question?.description_en)
    this.formQuestion.controls['answer_type'].setValue(this.question?.answer_type)
    this.formQuestion.controls['answer_condition_min'].setValue(this.question?.answer_condition?.min)
    this.formQuestion.controls['answer_condition_max'].setValue(this.question?.answer_condition?.max)
    this.formQuestion.controls['answer_unit'].setValue(this.question?.answer_unit)
    this.formQuestion.controls['answer_require'].setValue(this.question?.answer_require)
    this.formQuestion.controls['active'].setValue(this.question?.active)
  }

  getSymptomByID(id: any) {
    this.backendService.getSymptomByID(id).subscribe((data: any) => {
      console.log(data)
      if (data.status == 200) {
        this.symptom = data?.body?.data
        this.initFormSymptomValue()
      }
    })
  }

  getQuestionByID(id: any) {
    this.backendService.getQuestionByID(id).subscribe((data: any) => {
      console.log(data)
      if (data.status == 200) {
        this.question = data?.body?.data
        this.initFormQuestionValue()
      }
    })
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

  async openModalEditSymptom(id: any) {
    this.getSymptomByID(id)
    this.symptom_id = id
    this.modalConfig.modalTitle = "แก้ไขข้อมูลอาการ"
    console.log("openModalEditSymptom")
    return await this.modalEditSymptomComponent.open({ size: 'md', backdrop: 'static', scrollable: true }).then((result) => {
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

  async openModalEditQuestion(id: any) {
    this.getQuestionByID(id)
    this.question_id = id
    this.modalConfig.modalTitle = "แก้ไขข้อมูลคำถาม"
    console.log("openModalEditQuestion")
    return await this.modalEditQuestionComponent.open({ size: 'lg', backdrop: 'static', scrollable: true }).then((result) => {
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
          this.getAllData()
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

  saveFormEditSymptom(e: any) {
    if (!this.formSymptom.invalid && e) {
      this.markFormGroupTouched(this.formSymptom);
      let data = this.formSymptom.value
      this.backendService.updateSymptom(data, this.symptom_id).subscribe((data) => {
        if (data.status == 200) {
          this.swal.alertSuccess("แก้ไขข้อมูลอาการสำเร็จ", "", "รับทราบ")
          this.formSymptom.reset()
          this.getAllData()
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
          this.getAllData()
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

  saveFormEditQuestion(e: any) {
    console.log(e)
    const data = this.prepareSaveQuestion()
    console.log(data)
    if (!this.formQuestion.invalid && e) {
      // this.markFormGroupTouched(this.form);
      this.backendService.updateQuestion(data, this.question_id).subscribe((data) => {
        if (data.status == 200) {
          this.swal.alertSuccess("แก้ไขข้อมูลคำถามสำเร็จ", "", "รับทราบ")
          this.getAllData()
        }
      })
    } else {
      // this.getFormValidationErrors()
      console.log('invalid', this.formQuestion.invalid)
      console.log(this.formQuestion.value)
      this.swal.alertWarning("Warning!", "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "รับทราบ")
    }
  }

  removeSymptom(id: any) {
    this.swal.alertConfirmDanger("ลบอาการหรือไม่", "", "ลบ", "ยกเลิก").then((result: any) => {
      if (result.value) {
        this.backendService.removeSymptomByID(id).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal.alertSuccess("ลบอาการสำเร็จ", "", "รับทราบ")
            this.getAllData()
          }
        }, ((error: any) => {
          this.swal.alertError(error.status, error.statusText, "รับทราบ")
        }))
      }
    })
  }

  removeQuestion(id: any) {
    this.swal.alertConfirmDanger("ลบคำถามหรือไม่", "", "ลบ", "ยกเลิก").then((result: any) => {
      if (result.value) {
        this.backendService.removeQuestionByID(id).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal.alertSuccess("ลบคำถามสำเร็จ", "", "รับทราบ")
            this.getAllData()
          }
        }, ((error: any) => {
          this.swal.alertError(error.status, error.statusText, "รับทราบ")
        }))
      }
    })
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

  getFormValidationErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const controlErrors: any = form.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
}
