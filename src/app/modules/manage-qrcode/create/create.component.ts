import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterDataService } from '../../../services/master-data.service'
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { AppConfigService } from '../../../services/app-config.service'
import * as moment from 'moment'
import { AuthService } from '../../auth/services/auth.service'
import { ModalConfig, SelectLocationModalComponent, ModalComponent } from '../../../_metronic/partials';
import { debounceTime, distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service'

declare let longdo: any;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, AfterViewInit, OnDestroy {

  map: any
  currentLocation: any

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  closeModalResult: any

  // status
  token_received: boolean = false

  // initial
  person_type_lists: any;
  close_contact_type_lists: any;
  disease_lists: any;
  tmp_organization_lists: any;
  organization_lists: any;
  template_lists: any;
  template_detail: any;
  has_coordinates: boolean = false
  is_loading_org_lists: boolean = false
  qrcode_data: any
  org_profile: any

  minDate: Date;
  maxDate: Date;

  form: FormGroup;

  _user: any

  icon_path_true: string = './assets/media/icons/duotune/arrows/arr085.svg'
  icon_path_false: string = './assets/media/icons/duotune/arrows/arr088.svg'

  // auto complete section
  timeout: any = null;
  min_keyword = 3
  reserved_word = ['คลินิก', 'โรงพยาบาล']
  hint_msg: any = 'เลือกหน่วยงานหรือโรงพยาบาล'
  hint_reserved: any = ''
  found_length: any = -1
  noResult = 'ไม่พบหน่วยงานที่ค้นหา';
  display_hint: Boolean = false
  display_hint_reserved: Boolean = false
  selected_org: any
  initialVal: any = { id: "12254", name: "กรมควบคุมโรค" }

  public filteredDiseaseLists: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredOrganizationLists: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  /** control for the selected bank */
  public diseaseCtrl: UntypedFormControl = new UntypedFormControl();

  /** control for the MatSelect filter keyword */
  public diseaseFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public organizationFilterCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild('diseaseSelect', { static: true }) diseaseSelect: MatSelect;
  @ViewChild('orgSelect', { static: true }) orgSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  @ViewChild('modal') private modalComponent: SelectLocationModalComponent;
  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private backendService: BackendDdcCareService,
    private fb: FormBuilder,
    private swal: SweetalertService,
    private environment: AppConfigService,
    private auth: AuthService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.org_profile = JSON.parse(localStorage.getItem('org_profile')!)
    this.initForm()
    this.initDatePickerOption()
    this.getPersonType()
    this.getCloseContactType()
    this.getDisease()
    this.getOrganization()
    this.initDefaultOrg()

    // load the initial disease list
    this.filteredDiseaseLists.next(this.disease_lists.slice());
    // load the initial org list
    this.filteredOrganizationLists.next(this.organization_lists.slice());

    // listen for search field value changes
    this.diseaseFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDisease();
      });

    // listen for search field value changes
    this.organizationFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((val) => {
        if (val) {
          this.filterOrganization();
        }
      });
  }

  ngAfterViewInit() {
    this.setInitialDiseaseValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async openModalSelectLocation() {
    console.log("openModalSelectLocation")
    return await this.modalComponent.open().then((result) => {
      this.closeModalResult = `Closed with: ${result}`;
      console.log('Closed with: ', this.closeModalResult)
    }, (reason) => {
      // this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Dismissed', reason)
    });
  }

  saveLocation(e: any) {
    console.log('location', e)
    this.form.controls['coordinates'].setValue(e.lat + ',' + e.lon)
  }

  // ##################################### START ORG FUNCTION #####################################

  isReservedWord(val: any) {
    let result = this.reserved_word.map(item => {
      if (item.includes(val)) return true
      return false
    })
    return result.includes(true)
  }

  showHintReserved() {
    this.found_length = -1
    this.organization_lists = []
    this.display_hint_reserved = true
    this.hint_reserved = 'หลีกเลี่ยงการใช้คำค้นหา เช่น ' + this.reserved_word.join()
  }

  hideHintReserved() {
    this.display_hint_reserved = false
  }

  clearHint() {
    this.found_length = -1
    this.hideHintReserved()
  }

  initOrgList(keyword: string) {
    console.log('init lists')
    this.organization_lists = []
    let found: any = []

    // filter by org_level
    const org_id = this.org_profile?.org_id
    const org_level = this.org_profile?.org_level
    const area_code = this.org_profile?.area_code
    if (this.environment.config.env_mode == "develop") {
      console.log('org filter by org_level', org_level)
    }
    switch (org_level) {
      case "02": {
        // area_code xx, xx|xx|xx
        const area_code_arr = area_code.split('|')
        found = this.tmp_organization_lists?.filter((item: any) => {
          return area_code_arr.indexOf(item['province_code']) != -1
        })
        break;
      }
      case "03": case "04": {
        // area_code xx, xxxx
        found = this.tmp_organization_lists?.filter((item: any) => {
          return item['tambon_code'].startsWith(area_code)
        })
        break;
      }
      case "05": {
        // use org_id
        found = this.tmp_organization_lists?.filter((item: any) => {
          return item['org_id'] == org_id
        })
        break;
      }
      default: {
        //statements; 
        found = this.tmp_organization_lists
        break;
      }
    }

    if (this.environment.config.env_mode == "develop") {
      console.log('found after filter by org_level', found.length)
    }

    // filter by keyword
    // keyword = this.organizationFilterCtrl?.value
    // found = found?.filter((item: any) => {
    //   return item['org_name'].includes(keyword)
    // })

    // if (found.length <= 1000) {
    this.organization_lists = found
    // }

    // Object.keys(found).map((v) => {
    //   this.organization_lists.push({ org_id: found[v]['org_id'], org_name: found[v]['org_name'] });
    // })

    // this.organization_lists = this.sortObj(this.organization_lists)
    // console.log('found ' + this.organization_lists.length + ' record(s)')
    // console.log('lists', this.organization_lists)
    // this.found_length = this.organization_lists.length
    // this.is_loading_org_lists = false
    // this.ref.detectChanges();
  }

  sortObj(obj: any) {
    return obj.sort(function (a: any, b: any) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
  }

  sortByDueDate(data: any, pattern: any) {
    if (pattern == "ASC") {
      data.sort((a: any, b: any) => {
        return a.created_ts - b.created_ts
      });
    }
    if (pattern == "DESC") {
      data.sort((a: any, b: any) => {
        return b.created_ts - a.created_ts
      });
    }
  }

  initDefaultOrg() {
    // this.organization_lists.push({ id: this.org_profile.org_id, name: this.org_profile.org_name });
    this.form.controls['imported_org_id'].setValue(this.org_profile?.org_id);
  }

  // ##################################### END ORG FUNCTION #####################################

  initForm() {
    this.form = this.fb.group({
      register_type: ['QRCODE', [Validators.required]],
      register_condition: [''],
      expiration_ts: ['', [Validators.required]],
      imported_org_id: ['', [Validators.required]],
      coordinates: [''],
      contact_status: ['', [Validators.required]],
      person_type: ['', [Validators.required]],
      template_id: ['', [Validators.required]],
      disease_id: ['', [Validators.required]],
      created_by: ['', [Validators.required]],
    });
  }

  setCoordinatesDisplay(value: boolean) {
    this.has_coordinates = value
    if (value) {
      this.form.get('coordinates')?.addValidators(Validators.required);
      this.form.controls['coordinates'].setValue(this.org_profile?.location)
      this.initMap()
    } else {
      this.form.get('coordinates')?.clearValidators()
      this.form.controls['coordinates'].setValue('')
    }
  }

  initDatePickerOption() {
    const currentDay = new Date();
    const qrcode_max_day_expiration = this.environment.config.qrcode_max_day_expiration || 30
    this.minDate = new Date(currentDay.setDate(currentDay.getDate() + 1))
    this.maxDate = new Date(currentDay.setDate(currentDay.getDate() + qrcode_max_day_expiration))
  }

  backToLists() {
    this.router.navigate(['/app/manage-qrcode/lists']);
  }

  getPersonType() {
    this.masterDataService.getPersonType().subscribe((data) => {
      this.person_type_lists = data.data
      this.person_type_lists = this.person_type_lists.filter((item: any) => item.active)
      this.person_type_lists = this.getChildPersonType(this.person_type_lists)
      console.log(this.person_type_lists)
      this.ref.detectChanges();
      if (this.environment.config.env_mode == "develop") {
        console.log('person_type_lists', this.person_type_lists)
      }
    })
  }

  getChildPersonType(data: any) {
    let tmp: any = []
    data.map((item: any) => {
      if (item?.child && item?.child.length > 0 && item?.active) {
        let tmp2: any = []
        tmp.push(item)
        item?.child.map((item2: any) => {
          tmp2.push(item2)
        })
        item.sub = tmp2
      } else {
        let tmp2: any = []
        tmp2.push(item)
        item.sub = tmp2
        tmp.push(item)
      }
    })
    return tmp
  }

  getCloseContactType() {
    this.masterDataService.getCloseContactType().subscribe((data) => {
      this.ref.detectChanges();
      this.close_contact_type_lists = data.data
      // เอา "ผู้ติดเชืื้อ" ออก
      const indexOfObject = this.close_contact_type_lists.findIndex((object: any) => {
        return object.contact_status === 4;
      });
      console.log(indexOfObject); // 👉️ 1

      if (indexOfObject !== -1) {
        this.close_contact_type_lists.splice(indexOfObject, 1);
      }
      if (this.environment.config.env_mode == "develop") {
        console.log('close_contact_type_lists', this.close_contact_type_lists)
      }
    })
  }

  getDisease() {
    this.masterDataService.getDisease().subscribe((data: any) => {
      this.disease_lists = data.data
      this.disease_lists = this.disease_lists.filter((item: any) => item.active)
      this.sortByDueDate(this.disease_lists, "DESC")
      this.ref.detectChanges();
      if (this.environment.config.env_mode == "develop") {
        console.log('disease_lists', this.disease_lists)
      }
    })
  }

  getOrganization() {
    this.masterDataService.getOrganization().subscribe((data) => {
      this.tmp_organization_lists = data.data
      const org_level = this.org_profile?.org_level
      if (this.environment.config.env_mode == "develop") {
        console.log('organization_lists', this.tmp_organization_lists.length)
        console.log('org_level', this.org_profile)
      }
      // if (org_level == "05") {
      this.initOrgList('')
      // }
    })
  }

  getTemplate() {
    this.template_detail = []
    this.setCoordinatesDisplay(false)
    const disease_id = this.form.get('disease_id')?.value || ''
    if (disease_id == '') {
      return
    }
    this.backendService.getTemplate(disease_id).subscribe((data) => {
      if (data.status == 200) {
        this.template_lists = data.body
        this.ref.detectChanges();
        if (this.environment.config.env_mode == "develop") {
          console.log('template_lists', this.template_lists)
        }
      }
    })
  }

  getQuarantineLabel(data: any) {
    let arr: any = []
    data.map((item: any) => {
      arr.push(item.location_name)
    })
    if (arr.length > 0) {
      return arr.join(', ')
    }
    return '-'
  }

  getTemplateByID() {
    const template_id = this.form.get('template_id')?.value || ''
    this.template_detail = []
    this.backendService.getTemplateByID(template_id).subscribe((data) => {
      if (data.status == 200) {
        this.template_detail = data.body
        this.setCoordinatesDisplay(this.chkDisplayCoordinates())
        this.ref.detectChanges();
        if (this.environment.config.env_mode == "develop") {
          console.log('template_detail', this.template_detail)
        }
      }
    })
  }

  chkDisplayCoordinates() {
    let bool = false
    this.template_detail?.data?.monitoring_option?.map((item: any) => {
      item?.quarantine_points.map((i: any) => {
        if (i.location_type == 2) {
          bool = true
        }
      })
    })
    return bool
  }

  changeDatePicker(): any {
    // convert to timestamp
    this.form.controls['expiration_ts'].setValue((moment(this.form.value.expiration_ts).valueOf() / 1000).toString())
    if (this.environment.config.env_mode == "develop") {
      console.log(this.form.get('expiration_ts')?.value)
    }
  }

  getCreatedBy() {
    this._user = this.auth.identityClaims
    this.form.controls['created_by'].setValue(this._user?.user_name)
  }

  initMap() {
    console.log('initMap')
    this.map = new longdo.Map({
      placeholder: document.getElementById('map')
    });

    // this.map = new longdo.Marker({ lon: 100.6011052429676, lat: 14.077817097589847 },
    //   {
    //     title: 'Marker',
    //     icon: { url: 'https://map.longdo.com/mmmap/images/pin_mark.png', offset: { x: 12, y: 45 } },
    //     detail: 'Drag me',
    //     visibleRange: { min: 7, max: 9 },
    //     draggable: true,
    //     weight: longdo.OverlayWeight.Top,
    //   });

    this.map.Search.placeholder(
      document.getElementById('map')
    );
    var self = this
    // this.map.Event.bind('location', function () {
    //   self.currentLocation = self.map.location(); // Cross hair location
    // });
    this.map.Event.bind('click', function () {
      var mouseLocation = self.map.location(longdo.LocationMode.Pointer);
      mouseLocation.draggable = true
      self.map.Overlays.clear();
      self.map.Overlays.add(new longdo.Marker(mouseLocation));
      self.currentLocation = mouseLocation
      self.form.controls['coordinates'].setValue(self.currentLocation.lat + ',' + self.currentLocation.lon)
      // console.log(self.currentLocation)
      self.ref.detectChanges();
    });

  }

  getCurrentLocation() {
    this.map.location(longdo.LocationMode.Geolocation);
    this.currentLocation = this.map.location()
    this.map.Overlays.clear();
    this.map.Overlays.add(new longdo.Marker(this.currentLocation));
    this.form.controls['coordinates'].setValue(this.currentLocation.lat + ',' + this.currentLocation.lon)
    this.ref.detectChanges();
  }

  prepareData() {
    let data = this.form.value
    this._user = this.auth.identityClaims
    // data.imported_org_id = this.selected_org
    data.expiration_ts = moment(this.form.value.expiration_ts).valueOf() / 1000
    data.created_by = this._user?.user_name
    // convert ti int
    data.template_id = +this.form.get('template_id')?.value
    data.contact_status = +this.form.get('contact_status')?.value
    data.disease_id = +this.form.get('disease_id')?.value
    // this.selected_org_json = this.form.get('imported_org_id')?.value
    // this.form.controls['imported_org_id'].setValue(this.selected_org)
    return data
  }

  async createQRCode() {
    // this.changeDatePicker()
    // this.changeOrg()
    this.getCreatedBy()
    const data = this.prepareData()
    this.markFormGroupTouched(this.form);
    if (!this.form.invalid) {
      if (this.environment.config.env_mode == "develop") {
        console.log('invalid', this.form.invalid)
        console.log(this.form.value)
      }
      this.backendService.createQRCode(data).subscribe((data) => {
        if (data.status == 201) {
          this.qrcode_data = data.body
          if (this.qrcode_data?.data?.token != '') {
            this.token_received = true
            this.ref.detectChanges();
          } else {
            console.log('token', this.qrcode_data?.data?.token)
          }
          if (this.environment.config.env_mode == "develop") {
            console.log('qrcode_data', this.qrcode_data)
          }
        }
      })
    } else {
      this.getFormValidationErrors()
      this.swal.alertWarning("กรุณากรอกข้อมูลให้ถูกต้อง", "", "รับทราบ")
      // this.form.controls['imported_org_id'].setValue(this.selected_org_json)
      console.log('invalid', this.form.invalid)
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

  resetForm(e: any) {
    this.form.reset()
    this.initForm()
    console.log(e)
    this.token_received = false
    this.organization_lists = []
    // this.tmp_organization_lists = null
    this.template_lists = []
    this.template_detail = []
    this.setCoordinatesDisplay(false)
    this.qrcode_data = []
    this.selected_org = ''
    this.initDefaultOrg()
    this.ref.detectChanges();
  }

  protected setInitialDiseaseValue() {
    this.filteredDiseaseLists
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        // this.diseaseSelect.compareWith = (a: any, b: any) => a && b && a.disease_id === b.disease_id;
      });
    console.log(this.filteredDiseaseLists)
  }

  protected filterOrganization() {
    if (!this.organization_lists) {
      return;
    }
    // get the search keyword
    let search = this.organizationFilterCtrl.value;
    if (this.organization_lists?.length == 0) {
      this.initOrgList(search)
    }
    if (!search) {
      this.filteredOrganizationLists.next(this.organization_lists.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the org
    if (this.org_profile?.org_id == "12254" && search.length >= 3) {
      this.filteredOrganizationLists.next(
        this.tmp_organization_lists.filter((ds: any) => ds.org_name.toLowerCase().indexOf(search) > -1)
      );
      return
    }
    this.filteredOrganizationLists.next(
      this.organization_lists.filter((ds: any) => ds.org_name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterDisease() {
    if (!this.disease_lists) {
      return;
    }
    // get the search keyword
    let search = this.diseaseFilterCtrl.value;
    if (!search) {
      this.filteredDiseaseLists.next(this.disease_lists.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredDiseaseLists.next(
      this.disease_lists.filter((ds: any) => ds.disease_name_th.toLowerCase().indexOf(search) > -1)
    );
  }
}
