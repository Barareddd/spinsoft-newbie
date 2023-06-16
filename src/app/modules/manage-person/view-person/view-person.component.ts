import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ManagePersonService } from '../../../services/manage-person.service'
import { MasterDataService } from '../../../services/master-data.service'
import { SweetalertService } from '../../shared/sweetalert/sweetalert.service'
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Subject, debounceTime } from 'rxjs';
import { Location } from '@angular/common'

declare let longdo: any;

@Component({
  selector: 'app-view-person',
  templateUrl: './view-person.component.html',
  styleUrls: ['./view-person.component.scss']
})
export class ViewPersonComponent implements OnInit, OnDestroy {
  personSub = new BehaviorSubject<any>(null);
  monitoringSub = new BehaviorSubject<any>([]);
  quarantineSub = new BehaviorSubject<any>(null);
  nationality = new BehaviorSubject<any>(null);
  genders = new BehaviorSubject<any>(null);
  organization = new BehaviorSubject<any>(null);
  languages = new BehaviorSubject<any>(null);
  personType = new BehaviorSubject<any>(null);
  contactStatus = new BehaviorSubject<any>(null);
  diseases = new BehaviorSubject<any>(null)
  updateContactTypeStatus = new BehaviorSubject<any>(null);
  personData: any = {}
  monitoringData: any = []
  quarantineData: any = {}
  subscriber: Subscription
  map: any
  mapElement: HTMLElement
  mapShowMultiCard = true
  isEditMonitoringData: boolean = false
  haveHomeLocation = false
  editor: any = {}
  editorDate: any = {}

  icon_path_true: string = './assets/media/icons/duotune/arrows/arr085.svg'
  icon_path_false: string = './assets/media/icons/duotune/arrows/arr088.svg'

  historySearch: any[] = []
  searchDisplay = ''
  searchSelect: any
  mapObj: any = {}
  originMonitoringData: any = []
  isEditLocation = false
  locationSearchOption: any[] = []
  locationSelect: any
  searchLocationDisplay = ''
  locationSelectFromSearch: any

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;
  activeTab = 'Monitoring'
  // activeTab: string = 'kt_table_widget_5_tab_1';

  constructor(
    private personService: ManagePersonService,
    private masterData: MasterDataService,
    private router: Router,
    private detectRef: ChangeDetectorRef,
    private sweetAlert: SweetalertService,
    private _location: Location
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('historySearch')) {
      this.historySearch = JSON.parse(localStorage.getItem('historySearch') || '[]')
    }



    this.subscriber = this.personService.getPersonData().subscribe((person: any) => {

      if (!person['user_id']) {
        if (localStorage.getItem('personData')) {
          person = JSON.parse(localStorage.getItem('personData') || '{}')
        } else {
          this.router.navigate(['app/manage-person/search']);
        }
      }
      this.searchSelect = { 'person_id': person.person_id, 'firstname': person.firstname, 'lastname': person.lastname, 'displayName': `${person.person_id} ${person.firstname} ${person.lastname}` }

      this.getMasterData()
      localStorage.setItem('personData', JSON.stringify(person))
      this.getMonitoring(person['user_id'])
      this.getQuarantine(person['user_id'])

      this.personData = person
      this.calAge()
      this.personSub.next(person)
      this.getName()
    })

    this.subscription = this.modelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((val) => {
        if (typeof val === 'string' && val) {
          this.searchLocation(val)
        }
      });
  }


  selectEventHospitalSearch(item: any) {
    this.searchSelect = item['displayName']
    if (this.personData.person_id !== item.person_id && item.person_id) {
      this.search(item.person_id)
    }
  }

  clearSearch() {
    this.searchSelect = { 'displayName': '' }
  }

  onChangeSearch(val: string) {
    this.searchDisplay = this.searchDisplay.toUpperCase()
  }

  onFocus(val: any) {
    if (this.searchDisplay !== this.personData.person_id && this.searchDisplay) {
      this.search(this.searchDisplay)
    }
  }

  search(val: any) {
    // localStorage.setItem('search_person_id', `${val}`)
    this.personService.searchUser(val)
      .subscribe((res: any) => {
        if (res.status == 200 && res.body.data) {
          // this.haveResult.next(true)
          this.setActiveTab('Monitoring')
          this.personService.setPersonData(res.body.data)
          this.historySearch.push({
            'person_id': res.body.data.person_id,
            'firstname': res.body.data.firstname,
            'lastname': res.body.data.lastname,
            'displayName': `${res.body.data.person_id} ${res.body.data.firstname} ${res.body.data.lastname}`
          })
          this.historySearch = this.historySearch.filter((li, idx, self) => self.map(itm => itm.person_id).indexOf(li.person_id) === idx)
          localStorage.setItem('historySearch', JSON.stringify(this.historySearch))
          this.router.navigate(['app/manage-person/view']);
        } else {
          // this.haveResult.next(false)
        }
      }, err => {
        if (err.status == 404) {
          // this.haveResult.next(false)
        }
      })
  }


  getMasterData() {
    this.masterData.getNationality().subscribe(res => {
      this.nationality.next(res.data)
    })

    this.masterData.getGender().subscribe(res => {
      this.genders.next(res.data)
    })

    this.masterData.getLanguages().subscribe(res => {
      this.languages.next(res.data)
    })

    this.masterData.getOrganization().subscribe(res => {
      this.organization.next(res.data)
    })

    this.masterData.getPersonType().subscribe(res => {
      this.personType.next(res.data)
    })

    this.masterData.getCloseContactType().subscribe(res => {
      this.contactStatus.next(res.data)
    })

    this.masterData.getDisease().subscribe(res => {
      this.diseases.next(res.data)
    })

  }

  ngOnDestroy(): void {
    this.personSub.unsubscribe()
    this.monitoringSub.unsubscribe()
    this.nationality.unsubscribe()
    this.genders.unsubscribe()
    this.organization.unsubscribe()
    this.languages.unsubscribe()
    this.personType.unsubscribe()
    this.contactStatus.unsubscribe()
    this.subscriber.unsubscribe()
    this.subscription.unsubscribe()

    // Object.keys(this.mapObj).forEach((element: any) => {
    //   element.Overlays.clear()
    // });
    // this.map?.Overlays.clear()
    Object.keys(this.mapObj).forEach((index: any) => {
      this.mapObj[index].Overlays.clear()
    });

    // Object.keys(this.mapObj).forEach((element: any) => {
    //   element.Overlays.clear()
    // });
    // this.map?.Overlays.clear()
    Object.keys(this.mapObj).forEach((index: any) => {
      this.mapObj[index].Overlays.clear()
    });

  }


  activeClass(tab: string) {
    return tab === this.activeTab ? 'show active' : '';
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName
  }


  setTab(tab: string) {
    this.activeTab = tab;
  }

  getMonitoring(userId: string) {
    this.personService.getMonitoring(userId).subscribe((res: any) => {
      // res = MOCK_MONITORING_RESPONSE
      if (res.status == 200 && res['body']['data']) {
        // this.monitoringData = res['body']['data']
        this.monitoringData = this.setFormatDatePicker(res['body']['data'])
        this.originMonitoringData = JSON.stringify(this.monitoringData)
        this.monitoringSub.next(this.monitoringData)
        this.detectRef.detectChanges()
      } else {
        this.monitoringData = []
        this.monitoringSub.next([])
        this.detectRef.detectChanges()
      }

    }, err => {
      console.log(err)
    })
  }

  setFormatDatePicker(monitorData: any[]) {
    return monitorData.map((disease, index) => {
      for (let i = 0; i < disease['monitor_phase'].length; i++) {
        let phase = disease['monitor_phase'][i]
        phase['started_date'] = new Date(phase['started_ts'] * 1000)
        phase['ended_date'] = new Date(phase['ended_ts'] * 1000)
        if (i == 0) {
          phase['duration_phase'] = Math.floor((phase['ended_ts'] - phase['started_ts']) / (60 * 60 * 24)) + 2
        } else {
          phase['duration_phase'] = Math.floor((phase['ended_ts'] - phase['started_ts']) / (60 * 60 * 24)) + 1
        }
        disease['monitor_phase'][i] = phase
      }
      // disease['monitor_phase'].map((phase: any) => {
      //   phase['started_date'] = new Date(phase['started_ts'] * 1000)
      //   phase['ended_date'] = new Date(phase['ended_ts'] * 1000)
      //   if (index == 0) {
      //     phase['duration_phase'] = Math.floor((phase['ended_ts'] - phase['started_ts']) / (60 * 60 * 24)) + 2
      //   } else {
      //     phase['duration_phase'] = Math.floor((phase['ended_ts'] - phase['started_ts']) / (60 * 60 * 24)) + 1
      //   }

      //   return phase
      // })
      return disease
    });
  }

  calMin(timestamp: number) {
    const date = new Date(timestamp * 1000)
    return new Date(date.setDate(date.getDate() + 1))
  }

  calMax(timestamp: number) {
    const date = new Date(timestamp * 1000)
    return new Date(date.setDate(date.getDate() - 1))
  }

  calDatePhase(disease: number, phase: number, type: string) {

    this.detectRef.detectChanges()
    if (type == 'start') {
      this.monitoringData[disease]['monitor_phase'][phase]['started_ts'] = (this.monitoringData[disease]['monitor_phase'][phase]['started_date']).getTime() / 1000
      if (phase != 0) {
        const startDate = new Date(this.monitoringData[disease]['monitor_phase'][phase]['started_ts'] * 1000)
        this.monitoringData[disease]['monitor_phase'][phase - 1]['ended_date'] = new Date(startDate.setDate(startDate.getDate() - 1))
        this.monitoringData[disease]['monitor_phase'][phase - 1]['ended_ts'] = (this.monitoringData[disease]['monitor_phase'][phase - 1]['ended_date']).getTime() / 1000
        this.monitoringData[disease]['monitor_phase'][phase - 1]['duration_phase'] = Math.floor((this.monitoringData[disease]['monitor_phase'][phase - 1]['ended_ts'] - this.monitoringData[disease]['monitor_phase'][phase - 1]['started_ts']) / (60 * 60 * 24)) + 1
      }
      this.monitoringData[disease]['monitor_phase'][phase]['duration_phase'] = Math.floor((this.monitoringData[disease]['monitor_phase'][phase]['ended_ts'] - this.monitoringData[disease]['monitor_phase'][phase]['started_ts']) / (60 * 60 * 24)) + 1
    } else {
      const dateTime = (this.monitoringData[disease]['monitor_phase'][phase]['ended_date']).getTime() / 1000
      this.monitoringData[disease]['monitor_phase'][phase]['ended_ts'] = dateTime
      if (phase == 0) {
        this.monitoringData[disease]['monitor_phase'][phase]['duration_phase'] = Math.floor((this.monitoringData[disease]['monitor_phase'][phase]['ended_ts'] - this.monitoringData[disease]['monitor_phase'][phase]['started_ts']) / (60 * 60 * 24)) + 2
      } else {
        this.monitoringData[disease]['monitor_phase'][phase]['duration_phase'] = Math.floor((this.monitoringData[disease]['monitor_phase'][phase]['ended_ts'] - this.monitoringData[disease]['monitor_phase'][phase]['started_ts']) / (60 * 60 * 24)) + 1
      }

      if (phase != this.monitoringData[disease]['monitor_phase'].length - 1) {
        let endTime: any
        let endDate: any
        const startTime = dateTime
        const startDate = new Date(startTime * 1000)
        this.monitoringData[disease]['monitor_phase'][phase + 1]['started_date'] = new Date(startDate.setDate(startDate.getDate() + 1))

        this.monitoringData[disease]['monitor_phase'][phase + 1]['started_ts'] = (this.monitoringData[disease]['monitor_phase'][phase + 1]['started_date']).getTime() / 1000
        const durationPhase = this.monitoringData[disease]['monitor_phase'][phase + 1]['duration_phase']
        let tmpStartDate: any
        tmpStartDate = new Date(startTime * 1000)
        endTime = (new Date(tmpStartDate.setDate(tmpStartDate.getDate() + durationPhase))).getTime() / 1000
        endDate = new Date(endTime * 1000)
        this.monitoringData[disease]['monitor_phase'][phase + 1]['ended_date'] = endDate

        this.monitoringData[disease]['monitor_phase'][phase + 1]['ended_ts'] = endTime
        this.calDatePhase(disease, phase + 1, 'end')
      } else {
        // this.detectRef.detectChanges()
      }
    }


  }

  getQuarantine(userId: string) {
    this.personService.getQuarantine(userId).subscribe((res: any) => {
      // res = MOCK_LOCATION_REPONSE
      if (res.status == 200) {
        this.quarantineData = res['body']['data']

        this.quarantineSub.next(res['body']['data'])
        if (this.quarantineData) {
          const homeLocation = this.quarantineData['locations'].filter((loc: any) => { return loc['location_type'] == 1 })
          this.haveHomeLocation = homeLocation.length > 0
          this.quarantineData['update_ts'] = homeLocation[0] ? homeLocation[0]['updated_ts'] : 0
          this.detectRef.detectChanges()
          this.plotMarkMapMultiCard()
          // this.mapShowMultiCard ? this.plotMarkMapMultiCard(this.quarantineData['locations']) : this.plotMark(this.quarantineData['locations'])
        } else {
          this.haveHomeLocation = false
        }

      }
    }, err => {
      console.log(err)
    })
  }

  getName() {
    this.nationality.subscribe(nat => {
      if (nat) {
        const nation = this.nationality.getValue().filter((nation: any) => nation['nationality_code'] === this.personData.nationality)[0] || {}
        this.personData.nationality = nation['nationality_name_th'] || this.personData.nationality
      }
    })

    this.organization.subscribe((org: any[]) => {
      if (org) {
        const organize = this.organization.getValue().filter((orgEle: any) => orgEle.org_id === this.personData.org_id)[0] || {}
        this.personData['organization'] = organize['org_name'] || this.personData.org_id


        this.monitoringSub.subscribe((m) => {
          if (m.length > 0) {
            this.monitoringData.forEach((monitor: any) => {
              let orgFilted = org.filter(orgEle => orgEle.org_id === monitor.imported_org_id)
              monitor['imported_org_name'] = orgFilted.length > 0 ? orgFilted[0]['org_name'] : monitor.imported_org_id
              this.editor[monitor['disease_id']] = false
            });
          }
        })



      }
    })

    this.genders.subscribe(gender => {
      if (gender) {
        const gender = this.genders.getValue().filter((genderEle: any) => genderEle.gender_code === this.personData.gender)[0] || {}
        this.personData.gender = gender['gender_name_th'] || this.personData.gender
      }
    })


    this.languages.subscribe(lang => {
      if (lang) {
        const arrayLang: any[] = []
        this.personData.language.split(',').forEach((langCode: any) => {
          const languag = this.languages.getValue().filter((languagEle: any) => languagEle.language_code === langCode)[0] || {}
          arrayLang.push(languag['language_native'] || langCode)
        });
        this.personData.language = arrayLang.join(', ')

      }
    })


    this.personType.subscribe((pType: any[]) => {
      if (pType) {
        this.monitoringSub.subscribe((m) => {
          if (m.length > 0) {
            this.monitoringData.forEach((monitor: any) => {
              if (monitor.person_type.length == 4) {
                let prefix = monitor.person_type.slice(0, 2)
                let layer1 = pType.filter(type => type.person_type === prefix)
                let finalType = layer1.length != 0 ? layer1[0]['child'].filter((ch: any) => ch.person_type === monitor.person_type)[0].person_type_name : monitor.person_type
                monitor['person_type_name'] = finalType || monitor.person_type
              } else if (monitor.person_type.length == 2) {
                let layer1 = pType.filter(type => type.person_type === monitor.person_type)[0]
                monitor['person_type_name'] = layer1.person_type_name || monitor.person_type
              } else {
                monitor['person_type_name'] = monitor.person_type
              }
            })
          }
        })
      }
    })


    this.contactStatus.subscribe((cStatus: any[]) => {
      if (cStatus) {
        this.monitoringSub.subscribe((m) => {
          if (m.length > 0) {
            this.monitoringData.forEach((monitor: any) => {
              let contact = cStatus.filter(status => status.contact_status === monitor.contact_status_type)
              monitor['contact_name'] = contact.length > 0 ? contact[0]['contact_name'] : monitor.contact_status_type
            });
          }
        })
      }
    })

    this.diseases.subscribe((deseas: any[]) => {
      if (deseas) {
        this.monitoringSub.subscribe((m) => {
          if (m.length > 0) {
            this.monitoringData.forEach((monitor: any) => {
              let deseasFiltered = deseas.filter(de => de.disease_id == monitor.disease_id)
              monitor['disease_name'] = deseasFiltered.length > 0 ? deseasFiltered[0]['disease_name_th'] : monitor.disease_id
            });
          }
        })
      }
    })

  }

  plotMark(location: any[]) {
    const locationList: any[] = []
    this.map = new longdo.Map({
      placeholder: document.getElementById(`map`)
    });

    this.mapElement = document.getElementById('map') || new HTMLElement();

    location.forEach((loc, index) => {

      let lat = loc['location_selected']['coordinates']['lat']
      let lon = loc['location_selected']['coordinates']['lng']
      locationList.push({ lon: lon, lat: lat })
      let markOptine = loc['location_type'] == 1 ? {
        icon: {
          html: `<span>${loc['location_name']}</span><img src="../../../../assets/media/icons/duotune/maps/map008.svg" width="50" height="50">`,
        },
        visibleRange: { min: 1, max: 20 },
        weight: longdo.OverlayWeight.Top
      } : {
        icon: {
          html: `<span>${loc['location_name']}</span><img src="../../../../assets/media/icons/duotune/maps/map001.svg" width="50" height="50">`,
        },
        visibleRange: { min: 1, max: 20 },
        weight: longdo.OverlayWeight.Top
      }
      let facMark = new longdo.Marker({ lon: lon, lat: lat },
        markOptine
      )
      this.map.Overlays.add(facMark);
      // this.map.location({ lon: lon, lat: lat }, true);
    })

    this.map.bound(longdo.Util.locationBound(locationList));
    // this.map.zoom(15, true, false)
  }

  plotMarkMapMultiCard() {
    if (!this.quarantineData) {
      return
    }

    const location = this.quarantineData['locations']
    const locationList: any[] = []
    // const locationList: any[] = []
    // this.map = new longdo.Map({
    //   placeholder: document.getElementById(`map`)
    // });

    // this.mapElement = document.getElementById('map') || new HTMLElement();


    location.forEach((loc: any, index: number) => {
      this.mapObj[index] = new longdo.Map({
        placeholder: document.getElementById(`map${index}`) || new HTMLElement()
      })
      let lat = loc['location_selected']['coordinates']['lat']
      let lon = loc['location_selected']['coordinates']['lng']
      locationList.push({ lon: lon, lat: lat })
      let markOptine = loc['location_type'] == 1 ? {
        icon: {
          html: `<img src="../../../../assets/media/icons/duotune/maps/map008.svg" width="50" height="50">`,
        },
        visibleRange: { min: 1, max: 20 },
        weight: longdo.OverlayWeight.Top
      } : {
        visibleRange: { min: 1, max: 20 },
        weight: longdo.OverlayWeight.Top,
        // draggable: true
      }

      let facMark = new longdo.Marker({ lon: lon, lat: lat },
        markOptine
      )

      this.mapObj[index].Overlays.clear()

      this.mapObj[index].Overlays.add(facMark);
      // this.mapObj[index].location({ lon: lon, lat: lat }, true);
      this.mapObj[index].bound(longdo.Util.locationBound([{ lon: lon, lat: lat }]));
      this.mapObj[index].zoom(15, true, false)
      this.mapObj[index].resize()
      // this.mapObj[index].bound(longdo.Util.locationBound(loc));
      // mapObj[index].zoomRange({ min: 13, max: 20 });
    })
  }



  calAge() {
    let timestampBirth = new Date(this.personData['birthdate']).getTime()
    this.personData['age'] = Math.floor(((new Date()).getTime() - (timestampBirth)) / (1000 * 60 * 60 * 24 * 365));
  }

  goViewMonitoring(monitor: any) {
    localStorage.setItem('monitoringSelected', JSON.stringify(monitor))
    const allRiskData = { 'personData': this.personData, 'monitoringData': this.monitoringData, 'quarantineData': this.quarantineData }
    localStorage.setItem('allRiskData', JSON.stringify(allRiskData))
    this.map?.Overlays.clear()
    this.mapElement?.remove()
    this.router.navigate(['/app/manage-person/viewMonitoring'])
  }

  goEditMonitoring(monitor: any) {
    localStorage.setItem('monitoringSelected', JSON.stringify(monitor))
    const allRiskData = { 'personData': this.personData, 'monitoringData': this.monitoringData, 'quarantineData': this.quarantineData }
    localStorage.setItem('allRiskData', JSON.stringify(allRiskData))
    this.map?.Overlays.clear()
    this.mapElement?.remove()
    this.router.navigate(['/app/manage-person/editMonitoring'])
  }

  back() {
    Object.keys(this.mapObj).forEach((index: any) => {
      this.mapObj[index].Overlays.clear()
    });
    this._location.back()
  }

  setAllRiskData() {
    if (!this.isEditMonitoringData) {
      const allRiskData = { 'personData': this.personData, 'monitoringData': this.monitoringData, 'quarantineData': this.quarantineData }
      this.personService.setAllRiskData(allRiskData)
      localStorage.setItem('allRiskData', JSON.stringify(allRiskData))
    }

    this.isEditMonitoringData = !this.isEditMonitoringData;
  }

  sendNotificationUpdateLocation() {
    this.sweetAlert.alertConfirm('ระบบจะส่งการแจ้งเตือน', `ไปคุณยัง "${this.personData.firstname} ${this.personData.lastname}" ให้ทำการเลือกตำแหน่งใหม่อีกครั้ง`, 'ยืนยัน', 'ยกเลิก').then(result => {
      if (result.isConfirmed) {
        this.sweetAlert.showProgress('กรุณารอสักครู่...', '', 'ตกลง', 'ยกเลิก')

        this.personService.putQuarantineStatus(this.personData.user_id).subscribe(res => {
          if (res.status == 200) {
            this.sweetAlert.closeProgrss()
            this.sweetAlert.alertSuccessSetTimeOut('สำเร็จ', 'ระบบจะส่งการแจ้งเตือนให้ทำการเลือกตำแหน่งใหม่อีกครั้งสำเร็จ', 2000)
          } else {
            this.sweetAlert.closeProgrss()
            this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ระบบจะไม่สามารถส่งการแจ้งเตือนให้ทำการเลือกตำแหน่งใหม่ได้', 2000)
          }
        }, err => {
          console.log(err)
          this.sweetAlert.closeProgrss()
          this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ระบบจะไม่สามารถส่งการแจ้งเตือนให้ทำการเลือกตำแหน่งใหม่ได้', 2000)
        })
      }
    })

  }

  enableEdit(deseas_id: any, status: boolean) {
    this.editor[deseas_id] = status;
    this.editorDate[deseas_id] =
      this.detectRef.detectChanges()
    if (!status) {
      this.monitoringData = JSON.parse(this.originMonitoringData) || []
      this.monitoringSub.next(this.monitoringData)
      this.detectRef.detectChanges()
    }
  }

  updateMonitoring(diseaseId: any) {
    const selectMonitor = this.monitoringData.filter((monitor: any) => monitor.disease_id === diseaseId)
    const originMonitor = JSON.parse(this.originMonitoringData).filter((monitor: any) => monitor.disease_id === diseaseId)
    if (selectMonitor.length > 0) {
      const monitor = selectMonitor[0]
      const OgMonitor = originMonitor[0]
      this.sweetAlert.alertConfirm('ต้องการบันทึกข้อมูลใช่หรือไม่', '', 'บันทึก', 'ยกเลิก').then(result => {
        if (result.isConfirmed) {
          this.updateContactStatus(monitor, diseaseId)
          this.updateContactTypeStatus.subscribe(status => {
            if (status) {
              this.personService.putMonirotingPhase(this.personData['user_id'], monitor['disease_id'], monitor['monitor_lap'], monitor.monitor_phase)
                .subscribe(res => {
                  if (res.status == 200) {
                    this.getMonitoring(this.personData['user_id'])
                    // this.getName()
                    this.sweetAlert.alertSuccessSetTimeOut('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 2000)
                  }
                  //  else {
                  //   this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลได้', 2000)
                  // }
                  this.editor[monitor.disease_id] = false
                }, err => {
                  this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลได้', 2000)
                })
            }
          })
        }
      })
    }
  }

  updateContactStatus(monitor: any, diseaseId: any) {
    const originMonitor = JSON.parse(this.originMonitoringData).filter((m: any) => m.disease_id === diseaseId)
    const OgMonitor = originMonitor[0]
    if (OgMonitor.contact_status_type !== monitor.contact_status_type) {
      this.personService.putContactStatus(this.personData['user_id'], this.personData['person_id'], monitor.contact_status_type, monitor['monitor_lap'], monitor['disease_id']).subscribe(res => {
        if (res.status == 200) {
          this.updateContactTypeStatus.next(true)
        }
      }, err => {
        console.log(err)
        this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลประเภทผู้สัมผัสได้', 2000)
        this.updateContactTypeStatus.next(false)
      })
    } else {
      this.updateContactTypeStatus.next(true)
    }
  }


  confirmInfected(monitor: any) {
    this.sweetAlert.alertConfirmDanger('ต้องการยืนยันสถานะติดเชื้อใช่หรือไม่', '', 'ยืนยัน', 'ยกเลิก').then(result => {
      if (result.isConfirmed) {
        this.personService.putContactStatus(this.personData['user_id'], this.personData['person_id'], 4, monitor['monitor_lap'], monitor['disease_id']).subscribe(res => {
          if (res.status == 200) {
            this.sweetAlert.alertSuccessSetTimeOut('สำเร็จ', 'ยืนยันสถานะติดเชื้อสำเร็จ', 2000)
            this.getMonitoring(this.personData.user_id)
          } else {
            this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถยืนยันสถานะติดเชื้อได้', 2000)
          }
        }, err => {
          console.log(err)
          this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถยืนยันสถานะติดเชื้อได้', 2000)
        })
      }
    })
  }

  editLocation() {
    this.isEditLocation = true
    this.locationSelectFromSearch = {}
    this.locationSelectFromSearch['lat'] = this.mapObj[1].location()['lat']
    this.locationSelectFromSearch['lon'] = this.mapObj[1].location()['lon']
    this.plotNewLocation()
    this.mapObj[1].Event.bind('overlayDrop', (overlay: any) => {
      this.locationSelectFromSearch['lat'] = overlay.location()['lat']
      this.locationSelectFromSearch['lon'] = overlay.location()['lon']
      this.locationSelectFromSearch['address'] = ''
    });

    this.mapObj[1].Event.bind('doubleClick', (e: any) => {
      this.mapObj[1].zoomRange({ min: 15, max: 15 });
      this.locationSelectFromSearch['lat'] = this.mapObj[1].location()['lat']
      this.locationSelectFromSearch['lon'] = this.mapObj[1].location()['lon']
      this.plotNewLocation()
      this.mapObj[1].zoomRange({ min: 1, max: 20 });
    });
  }

  cancelEditLocation() {
    let lat = this.quarantineData['locations'][1]['location_selected']['coordinates']['lat']
    let lon = this.quarantineData['locations'][1]['location_selected']['coordinates']['lng']
    this.locationSelectFromSearch['lat'] = lat
    this.locationSelectFromSearch['lon'] = lon
    this.plotNewLocation()
    this.isEditLocation = false
  }

  plotNewLocation() {
    let lat = this.locationSelectFromSearch['lat']
    let lon = this.locationSelectFromSearch['lon']
    this.mapObj[1].Overlays.clear()
    this.detectRef.detectChanges()
    let markOptine = {
      // visibleRange: { min: 1, max: 20 },
      weight: longdo.OverlayWeight.Top,
      draggable: true
    }

    let facMark = new longdo.Marker({ lon: lon, lat: lat },
      markOptine
    )
    this.mapObj[1].Overlays.add(facMark);
    this.mapObj[1].bound(longdo.Util.locationBound([{ lon: lon, lat: lat }]));
    this.mapObj[1].zoom(15, true, false)
    this.mapObj[1].resize()
  }


  selectEventLocationlSearch(item: any) {
    if (item['name'] && item['lat'] && item['lon']) {
      this.locationSelectFromSearch = item
      this.plotNewLocation()
    }
  }


  clearLocationSearch() {
    // this.locationSelect = { 'name': '' }
    this.searchLocationDisplay = ''
    this.locationSearchOption = []
  }

  onChangeLocationSearch(val: any) {
    if (val) {
      this.modelChanged.next(val)
    }
  }

  // onChangeLocationSearch(val: string) {
  //   // this.searchLocationDisplay = this.searchLocationDisplay.toUpperCase()
  //   console.log(val)
  //   if (typeof this.searchLocationDisplay === 'string' && this.searchLocationDisplay) {
  //     if (val.length > 3 || val.length % 3 == 0) {
  //       this.personService.searchLocation(this.searchLocationDisplay).subscribe((res: any) => {
  //         // this.searchLocationDisplay = ''
  //         this.locationSearchOption = res['body']['data']
  //         this.detectRef.detectChanges()

  //         console.log(this.locationSearchOption)
  //       }, err => {
  //         console.log(err)
  //         // this.detectRef.detectChanges()
  //       })
  //     }
  //   }

  // }

  searchLocation(keyword: string) {
    this.personService.searchLocation(keyword).subscribe((res: any) => {
      if (res['body']['data'].length != 0) {
        this.locationSearchOption = res['body']['data']
        this.locationSearchOption = this.locationSearchOption.filter(item => { return item['name'] && item['lat'] && item['lon'] })
        this.detectRef.detectChanges()
      }
    }, err => {
      console.log(err)
      this.detectRef.detectChanges()
    })
  }

  updateLocation() {
    this.sweetAlert.alertConfirmDanger('ต้องการแก้ไขตำแหน่งใช่หรือไม่', '', 'ยืนยัน', 'ยกเลิก').then(result => {
      const quarantineData = this.quarantineData['locations'][1]
      let location = {
        "locations": [
          {
            "location_type": quarantineData['location_type'],
            "location_name": quarantineData['location_name'],
            "location_selected": {
              "accuracy": quarantineData['location_selected']['accuracy'],
              "coordinates": {
                "lat": this.locationSelectFromSearch['lat'],
                "lng": this.locationSelectFromSearch['lon']
              }
            }
          }
        ]
      }
      this.personService.putQuarantineLocation(this.personData['user_id'], location).subscribe(res => {
        this.isEditLocation = false
        this.detectRef.detectChanges()
        this.sweetAlert.alertSuccessSetTimeOut('สำเร็จ', 'แก้ไขตำแหน่งสำเร็จ', 2000)
        this.getQuarantine(this.personData.user_id)
        this.clearLocationSearch()
      }, err => {
        console.log(err)
        this.sweetAlert.alertErrorSetTimeOut('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขตำแหน่งได้', 2000)
      })
    })
  }

}
