import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() quarantine_lists: any

  constructor(private fb: FormBuilder, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    // init 1 block
    this.addMonitoringOption()
  }

  get monitoring_option() {
    return this.form.controls["monitoring_option"] as FormArray;
  }

  addMonitoringOption() {
    const monitoringOptionForm = this.fb.group({
      phase: [''],
      days: ['', Validators.required],
      tracking_status: [false, Validators.required],
      quarantine_status: [false, Validators.required],
      quarantine_points: this.fb.array([]),
    });
    this.monitoring_option.push(monitoringOptionForm);
  }

  onQuarantinePointsChange(form: any, e: any) {
    const quarantine_points: FormArray = form.get('quarantine_points') as FormArray;

    if (e.target.checked) {
      quarantine_points.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      quarantine_points.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          quarantine_points.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.log(form.value)
  }

  deleteMonitoringOption(monitoringOptionIndex: number) {
    this.monitoring_option.removeAt(monitoringOptionIndex);
  }

  onTrackingStatusChange(form: any, e: any) {
    form.controls['tracking_status'].setValue(e.target.checked)
    console.log(form.value)
  }

  onQuarantineStatusChange(form: any, e: any) {
    form.controls['quarantine_status'].setValue(e.target.checked)
    if (e.target.checked) {
      form.controls['quarantine_points'].push(new FormControl('1'))
    } else {
      // form.controls['quarantine_points'].array([]);
      while (form.controls['quarantine_points'].length !== 0) {
        form.controls['quarantine_points'].removeAt(0)
      }
    }

    console.log(form.value)
    this.ref.detectChanges();
  }

  checkInsertCase(e: any, i: any) {
    return e.indexOf(i.toString()) > -1
  }
}
