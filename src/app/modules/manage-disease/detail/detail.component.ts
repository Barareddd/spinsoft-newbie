import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { MasterDataService } from '../../../services/master-data.service'
import { Location } from '@angular/common'
import { ModalConfig, EditModalComponent } from '../../../_metronic/partials';
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service';

type Tabs =
  | 'disease_tab'
  | 'question_tab'
  | 'tracking_tab';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;

  quarantine_lists: any

  symptoms_lists: any
  questions_lists: any
  questions_detail: any

  disease_id: any
  disease_detail: any
  templates: any
  symptoms_tmp: any = [
    { level: 1, id: [] },
    { level: 2, id: [] },
    { level: 3, id: [] },
  ]
  questions_tmp: any = []

  modalConfig: ModalConfig = {
    modalTitle: 'แก้ไขข้อมูลโรค',
    dismissButtonLabel: 'ยกเลิก',
    closeButtonLabel: 'บันทึก'
  };
  closeModalResult: any

  @ViewChild('modal') private modalComponent: EditModalComponent;
  @ViewChild('modal2') private modal2Component: EditModalComponent;
  @ViewChild('modalAddTemplate') private modalAddTemplateComponent: EditModalComponent;
  constructor(
    private activatedroute: ActivatedRoute,
    private backendService: BackendDdcCareService,
    private masterDataService: MasterDataService,
    private fb: FormBuilder,
    private swal: SweetalertService,
    private _location: Location,
    private ref: ChangeDetectorRef) { }

  activeTab: Tabs = 'disease_tab';

  setTab(tab: Tabs) {
    this.activeTab = tab;
    if (tab == "tracking_tab") {
      this.getTemplateByDiseaseID(this.disease_id)
    }
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.disease_id = this.activatedroute.snapshot.paramMap.get('id')
    this.getDiseaseByID(this.disease_id)
    this.activatedroute.queryParams
      .subscribe(params => {
        if (params.tab) {
          this.setTab(params.tab)
        }
      }
      );
    this.initForm1()
    this.initForm2()
    this.initForm3()
    this.getAllQuestion()
    this.getAllLocationType()
  }

  initForm1() {
    this.form1 = this.fb.group({
      name_th: ['', [Validators.required]],
      name_en: [''],
      code_icd10: [''],
      code_r506: [''],
      status: [''],
    });
  }

  initForm2() {
    this.form2 = this.fb.group({
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

  initForm3() {
    this.form3 = this.fb.group({
      disease_id: [this.disease_id, Validators.required],
      title: ['', Validators.required],
      monitoring_option: this.fb.array([], Validators.required),
      active: [1],
    });
  }

  initFormEdit() {
    this.initFormValue1()
    this.initFormValue2()
  }

  initFormValue1() {
    this.form1.controls['name_th'].setValue(this.disease_detail?.data?.name_th)
    this.form1.controls['name_en'].setValue(this.disease_detail?.data?.name_en)
    this.form1.controls['code_icd10'].setValue(this.disease_detail?.data?.code_icd10)
    this.form1.controls['code_r506'].setValue(this.disease_detail?.data?.code_r506)
    this.form1.controls['status'].setValue(this.disease_detail?.data?.status)
  }

  initFormValue2() {
    // patchValue advice
    this.disease_detail?.data?.medical_advice?.map((item: any) => {
      this.form2.controls['medical_advice_risk' + item.symptom_level + '_th'].setValue(item.th)
      this.form2.controls['medical_advice_risk' + item.symptom_level + '_en'].setValue(item.en)
    })
    // patchValue symptoms
    this.populateSymptom()
    // patchValue questions
    this.populateQuestions()
    // this.form2.controls['questions'].map((item: any) => {
    //   this.form2.controls['medical_advice_risk' + item.symptom_level + '_th'].setValue(item.th)
    //   this.form2.controls['medical_advice_risk' + item.symptom_level + '_en'].setValue(item.en)
    // })
    console.log(this.form2.value)
  }

  createSymptom(data: any) {
    data = data || { id: null, level: null }
    return this.fb.group({
      id: data.id,
      level: data.level,
    });
  }

  populateSymptom() {
    const symptoms = this.form2.get('symptoms') as FormArray;
    symptoms.clear();
    this.disease_detail?.data?.symptoms.forEach((item: any) => {
      symptoms.push(this.createSymptom(item))
    });
  }

  createQuestions(data: any) {
    data = data || { id: null, level: null }
    return this.fb.group({
      id: data.id,
      question_name_th: data.question_name_th,
      answer_type: data.answer_type,
      answer_condition: data.answer_condition,
      answer_unit: data.answer_unit,
      answer_require: data.answer_require,
    });
  }

  populateQuestions() {
    const questions = this.form2.get('questions') as FormArray;
    questions.clear();
    this.disease_detail?.data?.questions.forEach((item: any) => {
      questions.push(this.createQuestions(item))
    });
  }

  getDiseaseByID(id: any) {
    this.backendService.getDiseaseByID(id).subscribe((data: any) => {
      if (data.status == 200) {
        this.disease_detail = data.body
        this.initFormEdit()
        console.log(this.disease_detail)
        // for show symptoms
        this.symptoms_tmp = [
          { level: 1, id: [] },
          { level: 2, id: [] },
          { level: 3, id: [] },
        ]
        this.disease_detail?.data?.symptoms?.map((item: any) => {
          this.symptoms_tmp.map((val: any) => {
            if (val.level == item.level) {
              val.id.push(item.id)
            }
          })
        })
        // for show questions
        this.questions_tmp = []
        this.disease_detail?.data?.questions?.map((item: any) => {
          this.getQuestionByID(item.id)
        })
      }
      console.log(this.disease_detail)
      this.ref.detectChanges();
    })
  }

  getTemplateByDiseaseID(id: any) {
    this.backendService.getTemplateByDiseaseID(id).subscribe((data: any) => {
      if (data.status == 200) {
        this.templates = data.body
        console.log(this.templates)
      }
      this.ref.detectChanges();
    })
  }

  getQuestionByID(id: any) {
    this.backendService.getQuestionByID(id).subscribe((data: any) => {
      if (data.status == 200) {
        console.log(data.body?.data)
        this.questions_tmp.push(data.body?.data)
        console.log(this.questions_tmp)
      }
      this.ref.detectChanges();
    })
  }

  getAllQuestion() {
    let pagination = {
      page: '',
      limit: 1000
    }
    this.backendService.getAllQuestion(pagination).subscribe((data: any) => {
      if (data.status == 200) {
        this.questions_detail = data.body
        console.log('questions_detail', this.questions_detail)
      }
    })
  }

  getAllLocationType() {
    this.masterDataService.getLocationType().subscribe((data: any) => {
      console.log(data)
      this.quarantine_lists = data.data
      console.log('quarantine_lists', this.quarantine_lists)
    })
  }

  onStatusChange(e: any) {
    console.log(e.target.checked)
    this.form1.controls['status'].setValue(e.target.checked ? 1 : 0)
    console.log(this.form1.value)
  }

  async openModalEdit() {
    console.log("openModalEdit")
    return await this.modalComponent.open({ size: 'lg', backdrop: 'static', scrollable: true }).then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });

    // return await this.modalComponent.open();
  }

  async openModal2Edit() {
    console.log("openModalEdit")
    return await this.modal2Component.open({ size: 'lg', backdrop: 'static', scrollable: true }).then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });

    // return await this.modalComponent.open();
  }

  async openModalAddTemplate() {
    this.modalConfig.modalTitle = "เพิ่มข้อมูลการติดตาม"
    console.log("openModalAddTemplate")
    return await this.modalAddTemplateComponent.open({ size: 'lg', backdrop: 'static', scrollable: true }).then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });

    // return await this.modalComponent.open();
  }

  saveForm1(e: any) {
    console.log(e)
    if (!this.form1.invalid && e) {
      // this.markFormGroupTouched(this.form);
      let data = this.form1.value
      this.backendService.updateDisease(data, this.disease_id).subscribe((data) => {
        if (data.status == 200) {
          this.swal.alertSuccess("แก้ไขข้อมูลสำเร็จ", "", "รับทราบ")
          this.getDiseaseByID(this.disease_id)
        }
      })
    } else {
      // this.getFormValidationErrors()
      // this.form.controls['imported_org_id'].setValue(this.selected_org_json)
      console.log('invalid', this.form1.invalid)
      console.log(this.form1.value)
      this.swal.alertWarning("Warning!", "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "รับทราบ")
    }
  }

  prepareData2(status: any) {
    let data = this.form2.value
    // this._user = this.auth.identityClaims
    let medical_advice = [
      {
        symptom_level: 1,
        th: this.form2.get('medical_advice_risk1_th')?.value,
        en: this.form2.get('medical_advice_risk1_en')?.value
      },
      {
        symptom_level: 2,
        th: this.form2.get('medical_advice_risk2_th')?.value,
        en: this.form2.get('medical_advice_risk2_en')?.value
      },
      {
        symptom_level: 3,
        th: this.form2.get('medical_advice_risk3_th')?.value,
        en: this.form2.get('medical_advice_risk3_en')?.value
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

  prepareData3(status: any) {
    let data = this.form3.value
    let phase = 0
    data.disease_id = parseInt(data.disease_id)
    data.monitoring_option.map((item: any) => {
      // map phase
      phase++
      item.phase = phase
      item.days = parseInt(item.days)
      // map quarantine points
      let q_tmp: any = []
      item.quarantine_points.map((p: any) => {
        this.quarantine_lists.map((q: any) => {
          if (q.location_type == parseInt(p)) {
            let tmp: any = {}
            tmp.location_type = q.location_type
            tmp.location_name = q.location_name
            q_tmp.push(tmp)
          }
        })
      })
      item.quarantine_points = q_tmp
    })
    return data
  }

  saveForm2(e: any) {
    console.log(e)
    if (!this.form2.invalid && e) {
      // this.markFormGroupTouched(this.form);
      let data = this.prepareData2(0)
      this.backendService.updateDisease(data, this.disease_id).subscribe((data) => {
        if (data.status == 200) {
          this.swal.alertSuccess("แก้ไขข้อมูลสำเร็จ", "", "รับทราบ")
          this.getDiseaseByID(this.disease_id)
        }
      })
    } else {
      // this.getFormValidationErrors()
      // this.form.controls['imported_org_id'].setValue(this.selected_org_json)
      console.log('invalid', this.form2.invalid)
      console.log(this.form2.value)
      this.swal.alertWarning("Warning!", "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "รับทราบ")
    }
  }

  saveForm3(e: any) {
    console.log(e)
    console.log(this.form3.value)
    let data = this.prepareData3(0)
    console.log(data)
    this.markFormGroupTouched(this.form3);
    if (!this.form3.invalid && e) {
      this.backendService.createTemplate(data).subscribe((data: any) => {
        if (data.status == 201) {
          this.swal.alertSuccess("สร้างรูปแบบการติดตามสำเร็จ", "", "รับทราบ")
          this.getTemplateByDiseaseID(this.disease_id)
          this.form3.reset()
        }
      })
    } else {
      this.swal.alertWarning("Warning!", "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "รับทราบ")
      console.log(this.form3.value)
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
