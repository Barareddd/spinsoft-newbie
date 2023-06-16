import { Component, OnInit, Input, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { AppConfigService } from '../../../services/app-config.service'
import { MasterDataService } from '../../../services/master-data.service'
import * as moment from 'moment'
import { BackendDdcCareService } from '../../../services/backend-ddc-care.service'
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service'

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  @Input() data: any
  @Output() backToCreateQRCode: EventEmitter<any> = new EventEmitter();

  size_qr: any = 300
  size_icon: any = 70

  person_type: any
  contact_status: any
  disease: any
  template: any
  expire_date_human: any
  token: any

  qrcode_detail: any
  ref_key: any

  mode: any = "create_qrcode"

  constructor(
    private router: Router,
    private environment: AppConfigService,
    private masterDataService: MasterDataService,
    private backendService: BackendDdcCareService,
    private ref: ChangeDetectorRef,
    private swal: SweetalertService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.data)
    const qrcode_id = this.activatedroute.snapshot.paramMap.get('id')
    console.log(qrcode_id)
    if (!qrcode_id) {
      this.mode = "create_qrcode"
      this.getPersonTypeByID(this.data?.data?.person_type)
      this.getCloseContactTypeByID(this.data?.data?.contact_status)
      this.getDiseaseByID(this.data?.data?.disease_id)
      this.getHumanDate(this.data?.data?.expiration_ts)
      this.getTemplateByID(this.data?.data?.template_id)
      this.token = this.environment.config.url_register + "/register?token=" + this.data.data.token
      this.ref_key = this.data?.data?.id
    } else {
      this.mode = "view_qrcode"
      this.getQRCodeDetail(qrcode_id)
    }
  }

  getQRCodeDetail(id: any) {
    console.log('getQRCodeDetail', id)
    // this.backendService.getQRCodeByID(id).subscribe((data: any) => {
    //   if (data.status == 200) {
    //     console.log(data)
    //   }
    // }, error => {
    //   // console.log(error)
    //   this.swal.alertError(error.error, error.message, "")
    // })
    const qr_item = localStorage.getItem('qr_item')
    this.qrcode_detail = JSON.parse(qr_item!)
    console.log(this.qrcode_detail)
    this.disease = this.qrcode_detail?.disease_name_th
    this.template = this.qrcode_detail?.template_title
    this.getHumanDate(this.qrcode_detail?.expiration_ts)
    this.getPersonTypeByID(this.qrcode_detail?.person_type)
    this.getCloseContactTypeByID(this.qrcode_detail?.contact_status)
    this.token = this.environment.config.url_register + "/register?token=" + this.qrcode_detail?.token
    this.ref_key = id
  }

  downloadQRCode() {
    var node: any = document.getElementById('content-qr');
    const filename = this.environment.config.qrcode_filename_prefix + this.ref_key + '.jpeg'
    htmlToImage.toPng(node)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  backAndReset() {
    console.log('backAndReset');
    this.backToCreateQRCode.emit(true)
  }

  backToCreate() {
    console.log('backToCreate');
    this.router.navigate(['/app/manage-qrcode/create']);
  }

  backToLists() {
    this.router.navigate(['/app/manage-qrcode/lists']);
  }

  openLink() {
    window.open(this.token, '_blank')
  }

  getPersonTypeByID(id: any) {
    this.masterDataService.getPersonTypeByID(id).subscribe((data: any) => {
      console.log(data)
      this.person_type = data?.person_type_name
    })
  }

  getCloseContactTypeByID(id: any) {
    this.masterDataService.getCloseContactTypeByID(id).subscribe((data: any) => {
      console.log(data)
      this.contact_status = data?.contact_name
    })
  }

  getDiseaseByID(id: any) {
    this.masterDataService.getDiseaseByID(id).subscribe((data: any) => {
      console.log(data)
      this.disease = data?.disease_name_th
    })
  }

  getHumanDate(ts: any) {
    moment.locale('th')
    this.expire_date_human = moment.unix(ts).add(543, 'year').format('LL');
  }

  getTemplateByID(template_id: any) {
    this.backendService.getTemplateByID(template_id).subscribe((data) => {
      if (data.status == 200) {
        this.template = data.body
        this.template = this.template?.data?.title
        this.ref.detectChanges();
      }
    })
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   console.log(event.target.innerWidth)
  //   this.size_qr = event.target.innerWidth / 1.9
  //   this.size_icon = event.target.innerWidth / 10
  // }

}
