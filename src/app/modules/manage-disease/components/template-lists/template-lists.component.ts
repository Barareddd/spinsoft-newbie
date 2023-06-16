import { Component, OnInit, Input, ViewChild, Output, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, EditModalComponent } from '../../../../_metronic/partials';
import { MasterDataService } from '../../../../services/master-data.service'
import { BackendDdcCareService } from '../../../../services/backend-ddc-care.service'
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SweetalertService } from '../../../shared/sweetalert/sweetalert.service';

@Component({
  selector: 'app-template-lists',
  templateUrl: './template-lists.component.html',
  styleUrls: ['./template-lists.component.scss']
})
export class TemplateListsComponent implements OnInit {

  form: FormGroup

  template: any
  template_id: any

  @Input() templates: any;
  @Input() disease_detail: any;
  @Input() disease_id: any
  @Output() refresh_list: any

  modalConfig: ModalConfig = {
    modalTitle: 'ข้อมูลการติดตาม',
    dismissButtonLabel: 'ปิด',
    closeButtonLabel: 'บันทึก'
  };
  closeModalResult: any

  quarantine_lists: any

  @ViewChild('modalEditTemplate') private modalShowTemplateComponent: EditModalComponent;
  constructor(
    private masterDataService: MasterDataService,
    private backendService: BackendDdcCareService,
    private swal: SweetalertService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllLocationType()
    this.initForm()
  }

  async openModalShowTemplate(template_id: any) {
    this.template_id = template_id
    this.getTemplateByID(template_id)
    return await this.modalShowTemplateComponent.open({ size: 'lg', backdrop: 'static', scrollable: true }).then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });

    // return await this.modalComponent.open();
  }

  getTemplateByID(template_id: any) {
    this.backendService.getTemplateByID(template_id).subscribe((data: any) => {
      if (data.status == 200) {
        this.template = data.body.data
        console.log(this.template)
        this.initFormValue()
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

  initForm() {
    this.form = this.fb.group({
      disease_id: [this.disease_id, Validators.required],
      title: ['', Validators.required],
      monitoring_option: this.fb.array([], Validators.required),
      active: [''],
    });
  }

  initFormValue() {
    this.form.controls['title'].setValue(this.template?.title)
    this.form.controls['active'].setValue(this.template?.active)
    this.form.controls['disease_id'].setValue(this.template?.disease_id)
    this.populateTemplate()
  }

  populateTemplate() {
    const template = this.form.get('monitoring_option') as FormArray;
    template.clear();
    this.template?.monitoring_option.forEach((item: any) => {
      template.push(this.createTemplate(item))
    });
    console.log(this.form.value)
  }

  populateQuarantinePoints(data: any) {
    let tmp: any = []
    data.map((item: any) => {
      tmp.push(item?.location_type)
    })
    return tmp
  }

  createTemplate(data: any) {
    data = data || { phase: null, days: null, quarantine_status: null, tracking_status: null, quarantine_points: this.fb.array([]) }
    console.log(data.quarantine_points)
    return this.fb.group({
      phase: data.phase,
      days: data.days,
      quarantine_status: data.quarantine_status,
      tracking_status: data.tracking_status,
      quarantine_points: this.fb.array(this.populateQuarantinePoints(data.quarantine_points))
    });
  }

  prepareData() {
    let data = this.form.value
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

  saveFormEdit(e: any) {
    console.log(e)
    console.log(this.form.value)
    let data = this.prepareData()
    console.log(data)
    this.markFormGroupTouched(this.form);
    if (!this.form.invalid && e) {
      this.backendService.updateTemplate(data, this.template_id).subscribe((data: any) => {
        if (data.status == 200) {
          this.swal.alertSuccess("แก้ไขรูปแบบการติดตามสำเร็จ", "", "รับทราบ")
          this.getTemplateByID(this.disease_id)
          // this.form.reset()
        }
      })
    } else {
      this.swal.alertWarning("Warning!", "กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "รับทราบ")
      console.log(this.form.value)
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

  removeTemplate(id: any) {

    this.swal.alertConfirmDanger("ลบข้อมูลรูปแบบการติดตามหรือไม่", "", "ลบ", "ยกเลิก").then((result: any) => {
      if (result.value) {
        console.log('remove template', id)
        this.backendService.removeTemplateFromDiseaseByID(id).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal.alertSuccess("ลบข้อมูลรูปแบบการติดตามสำเร็จ", "", "รับทราบ")
            this.getTemplateByDiseaseID()
          }
        }, (error: any) => {
          this.swal.alertError("Error status: " + error.status, error.error, "รับทราบ")
        })
      }
    })
  }

  getTemplateByDiseaseID() {
    this.backendService.getTemplateByDiseaseID(this.disease_id).subscribe((data: any) => {
      if (data.status == 200) {
        this.templates = data.body
        console.log(this.templates)
      }
      this.ref.detectChanges();
    })
  }
}