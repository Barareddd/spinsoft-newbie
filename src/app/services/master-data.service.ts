import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { AppConfigService } from '../services/app-config.service'
import { Observable, of } from 'rxjs';
// import from master data
import _diseases from '../../assets/environments/master_data/diseases.json';
import _persontype from '../../assets/environments/master_data/persontype.json';
import _contactstatus from '../../assets/environments/master_data/contactstatus.json';
import _gender from '../../assets/environments/master_data/gender.json';
import _nationality from '../../assets/environments/master_data/nationality.json';
import _languages from '../../assets/environments/master_data/languages.json';
import _organization from '../../assets/environments/master_data/organization.json';
import _locationtype from '../../assets/environments/master_data/locationtype.json';
import _symptoms from '../../assets/environments/master_data/symptoms.json';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  // master_data_floder = 'assets/environments/master_data'
  // private _organization = this.master_data_floder + '/organization.json';

  constructor(private http: HttpClient, private environment: AppConfigService) { }

  getPersonType(): Observable<any> {
    return of(_persontype)
  }

  getCloseContactType(): Observable<any> {
    return of(_contactstatus)
  }

  getDisease(): Observable<any> {
    return of(_diseases)
  }

  getOrganization(): Observable<any> {
    // return this.http.get(this._organization)
    return of(_organization)
  }

  getPersonTypeByID(id: any): Observable<any> {
    // let data = _persontype?.data?.filter((x: any) => x.person_type == id)
    let data = this.getChildPersonType(_persontype?.data)
    data = data.filter((x: any) => x.person_type == id)
    return of(data[0])
  }

  getCloseContactTypeByID(id: any): Observable<any> {
    const data = _contactstatus?.data?.filter((x: any) => x.contact_status == id)
    return of(data[0])
  }

  getDiseaseByID(id: any): Observable<any> {
    const data = _diseases?.data?.filter((x: any) => x.disease_id == id)
    return of(data[0])
  }

  getOrganizationByID(id: any): Observable<any> {
    const data = _organization?.data?.filter((x: any) => x.org_id == id)
    return of(data[0])
  }


  getChildPersonType(data: any) {
    let tmp: any = []
    data.map((item: any) => {
      if (item?.child && item?.child.length > 0) {
        item.is_parent = true
        tmp.push(item)
        item?.child.map((item2: any) => {
          item2.is_parent = false
          tmp.push(item2)
        })
      } else {
        item.is_parent = false
        tmp.push(item)
      }
    })
    return tmp
  }

  getGender(): Observable<any> {
    return of(_gender)
  }

  getNationality(): Observable<any> {
    return of(_nationality)
  }

  getLanguages(): Observable<any> {
    return of(_languages)
  }

  getLocationType(): Observable<any> {
    return of(_locationtype)
  }

  getSymptomsByID(id: any): Observable<any> {
    const data = _symptoms?.data?.filter((x: any) => x.id == id)
    return of(data[0])
  }

}
