import { Component, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

declare let longdo: any;

@Component({
  selector: 'app-select-location-modal',
  templateUrl: './select-location-modal.component.html',
  styleUrls: ['./select-location-modal.component.scss']
})
export class SelectLocationModalComponent {
  closeResult = '';

  map: any
  currentLocation: any

  @Input() public modalConfig: ModalConfig;
  @Output() emitLocation: EventEmitter<any> = new EventEmitter();
  @ViewChild('modal') private modalContent: TemplateRef<SelectLocationModalComponent>;
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  initMap() {
    console.log('initMap')
    this.map = new longdo.Map({
      placeholder: document.getElementById('map')
    });
    this.map.Search.placeholder(
      document.getElementById('map')
    );
    var self = this
    this.map.Event.bind('location', function () {
      self.currentLocation = self.map.location(); // Cross hair location
    });

  }

  seachMap() {
    const search = document.getElementById('search');
    this.map.Search.search('คลองหลวง', null);
    // suggest.style.display = 'none';
  }

  getCustomLocation() {
    this.currentLocation = this.map.location()
    console.log(this.currentLocation)
  }

  getCurrentLocation() {
    this.currentLocation = this.map.location(longdo.LocationMode.Geolocation);
    // this.map.location(this.currentLocation, true);
    // var marker = new longdo.Marker(this.currentLocation,
    //   {
    //     title: 'Marker',
    //     icon: {
    //       url: 'https://map.longdo.com/mmmap/images/pin_mark.png',
    //       offset: { x: 12, y: 45 }
    //     },
    //     detail: 'Drag me',
    //     visibleRange: { min: 7, max: 9 },
    //     draggable: true,
    //     weight: longdo.OverlayWeight.Top,
    //   });
    // this.map.Overlays.add(marker);
    // this.map.zoom(15, true, true)
    console.log(this.currentLocation?.location)
    console.log(this.map)
  }

  // open(content: any) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  saveLocation() {
    this.emitLocation.emit(this.currentLocation)
    this.close()
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
      this.initMap()
    });
  }

  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
      // console.log(c)
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      return;
    }

    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
