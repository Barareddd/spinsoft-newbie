import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { AppConfigService } from '../services/app-config.service'
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagePersonService {
  public personData = new BehaviorSubject<any>({})
  public riskData = new BehaviorSubject<any>({})
  // public personDataPub: Observable<any> = this.personData.asObservable()
  constructor(private env: AppConfigService, private http: HttpClient) {
    // this.personData = new BehaviorSubject<any>({})
  }

  searchUser(personId: string): Observable<{}> {
    return this.http.get<Observable<{}>>(`${this.env.config.url_edit_person}/users/${personId}`, { observe: 'response' })
  }

  getMonitoring(userId: string) {
    return this.http.get<Observable<{}>>(`${this.env.config.url_edit_person}/users/${userId}/monitoring`, { observe: 'response' })
  }

  getQuarantine(userId: string) {
    return this.http.get<Observable<{}>>(`${this.env.config.url_edit_person}/users/${userId}/quarantine`, { observe: 'response' })
  }

  updateMonitoring(userId: string, monitoringData: any) {
    return this.http.get<Observable<{}>>(`${this.env.config.url_edit_person}/users/${userId}/disease/${monitoringData.disease_id}/monitoring/${monitoringData.monitor_lap}/phase/${monitoringData.phase}`, monitoringData)
  }

  putQuarantineStatus(userId: string,) {
    return this.http.put<Observable<{}>>(`${this.env.config.url_edit_person}/users/${userId}/quarantine-status`,
      { "status": false }, { observe: 'response' })
  }

  putQuarantineLocation(userId: string, locationData: any) {
    return this.http.put<Observable<{}>>(`${this.env.config.url_edit_person}/users/${userId}/quarantine`,
    locationData, { observe: 'response' })
  }

  

  putContactStatus(userId: string, personId: string, statusType: number, monitorLap: number, diseaseId: number) {
    return this.http.put<Observable<{}>>(`${this.env.config.url_edit_person}/users/${userId}/contact-status-type`,
      { "person_id": personId, "contact_status_type": statusType, "monitor_lap": monitorLap, "disease_id": diseaseId }, { observe: 'response' })
  }

  putMonirotingPhase(userId: string,  diseaseId: number, monitorLap: number, phaseData: any) {
    let params: any[] = phaseData
    params = params.map(d => { 
      delete d.duration_phase
      delete d.ended_date
      delete d.started_date
      delete d.updated_ts
      return d
     } )
    return this.http.put<Observable<{}>>(`${this.env.config.url_edit_person}/users/${userId}/disease/${diseaseId}/monitoring/${monitorLap}`,
    phaseData, { observe: 'response' })
  }

  


  setPersonData(personData: Object) {
    this.personData.next(personData)
  }

  getPersonData() {
    return this.personData.asObservable()
  }

  setAllRiskData(riskData: Object) {
    this.riskData.next(riskData)
  }

  getAllRiskData() {
    return this.riskData.asObservable()
  }

  searchLocation(keyword: string) {
    return this.http.get<Observable<{}>>(`${this.env.config.url_longdo_api}/mapsearch/json/search?keyword=${keyword}&limit=20&key=${this.env.config.longdo_key}`, { observe: 'response' })
  }
}
