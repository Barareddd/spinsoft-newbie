import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { AppConfigService } from '../services/app-config.service'
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendDdcCareService {

  constructor(private http: HttpClient, private environment: AppConfigService) { }

  // QR Code management

  createQRCode(data: any) {
    return this.http.post(this.environment.config.url_backend + '/qrcode', data, { observe: 'response' })
  }

  getQRCodeByID(id: any) {
    return this.http.get(this.environment.config.url_backend + '/qrcode/' + id, { observe: 'response' })
  }

  removeQRCode(id: any) {
    return this.http.delete(this.environment.config.url_backend + '/qrcode/' + id, { observe: 'response' })
  }

  getQRCodeLists(pagination: any, filter: any): Observable<any> {
    let param = '?page=' + pagination.page + '&per_page=' + pagination.limit + '&created_by=' + filter.user_name
    return this.http.get(this.environment.config.url_backend + '/qrcode' + param, { observe: 'response' })
  }

  // SMS
  createSMS(data: any) {
    return this.http.post(this.environment.config.url_backend + '/sms', data, { observe: 'response' })
  }

  removeSMS(id: any) {
    return this.http.delete(this.environment.config.url_backend + '/sms/' + id, { observe: 'response' })
  }
  getSMSLists(pagination: any, filter: any): Observable<any> {
    let param = '?page=' + pagination.page + '&limit=' + pagination.limit + '&created_by=' + filter.user_name + '&status=' + filter.status
    return this.http.get(this.environment.config.url_backend + '/sms' + param, { observe: 'response' })
  }

  // Template
  createTemplate(data: any) {
    return this.http.post(this.environment.config.url_backend + '/templates', data, { observe: 'response' })
  }

  updateTemplate(data: any, id: any) {
    return this.http.patch(this.environment.config.url_backend + '/templates/' + id, data, { observe: 'response' })
  }

  getTemplate(disease_id: any) {
    return this.http.get(this.environment.config.url_backend + '/templates?disease_id=' + disease_id, { observe: 'response' })
  }

  getAllTemplate() {
    let param = '?limit=1000'
    return this.http.get(this.environment.config.url_backend + '/templates' + param, { observe: 'response' })
  }

  getTemplateByID(template_id: any) {
    return this.http.get(this.environment.config.url_backend + '/templates/' + template_id, { observe: 'response' })
  }

  getTemplateByDiseaseID(disease_id: any) {
    return this.http.get(this.environment.config.url_backend + '/templates?disease_id=' + disease_id, { observe: 'response' })
  }

  removeTemplateFromDiseaseByID(template_id: any) {
    return this.http.delete(this.environment.config.url_backend + '/diseases/templates/' + template_id, { observe: 'response' })
  }

  // Disease
  createDisease(data: any) {
    return this.http.post(this.environment.config.url_backend + '/diseases', data, { observe: 'response' })
  }

  updateDisease(data: any, id: any) {
    return this.http.patch(this.environment.config.url_backend + '/diseases/' + id, data, { observe: 'response' })
  }

  getAllDisease(pagination: any, status: any) {
    let param = '?page=' + pagination.page + '&limit=' + pagination.limit + '&status=' + status
    return this.http.get(this.environment.config.url_backend + '/diseases' + param, { observe: 'response' })
  }

  getDiseaseByID(id: any) {
    return this.http.get(this.environment.config.url_backend + '/diseases/' + id, { observe: 'response' })
  }

  // Question
  createQuestion(data: any) {
    return this.http.post(this.environment.config.url_backend + '/questions', data, { observe: 'response' })
  }

  updateQuestion(data: any, id: any) {
    return this.http.patch(this.environment.config.url_backend + '/questions/' + id, data, { observe: 'response' })
  }

  getAllQuestion(pagination: any) {
    let param = '?page=' + pagination.page + '&limit=' + pagination.limit
    if (pagination?.active) {
      param += '&active=' + pagination.active
    }
    return this.http.get(this.environment.config.url_backend + '/questions' + param, { observe: 'response' })
  }

  getQuestionByID(id: any) {
    return this.http.get(this.environment.config.url_backend + '/questions/' + id, { observe: 'response' })
  }

  removeQuestionByID(id: any) {
    return this.http.delete(this.environment.config.url_backend + '/questions/' + id, { observe: 'response' })
  }

  // Symptom
  getAllSymptom(pagination: any) {
    let param = '?page=' + pagination.page + '&limit=' + pagination.limit
    if (pagination?.active) {
      param += '&active=' + pagination.active
    }
    return this.http.get(this.environment.config.url_backend + '/symptoms' + param, { observe: 'response' })
  }

  getSymptomByID(id: any) {
    return this.http.get(this.environment.config.url_backend + '/symptoms/' + id, { observe: 'response' })
  }

  createSymptom(data: any) {
    return this.http.post(this.environment.config.url_backend + '/symptoms', data, { observe: 'response' })
  }

  updateSymptom(data: any, id: any) {
    return this.http.patch(this.environment.config.url_backend + '/symptoms/' + id, data, { observe: 'response' })
  }

  removeSymptomByID(id: any) {
    return this.http.delete(this.environment.config.url_backend + '/symptoms/' + id, { observe: 'response' })
  }
}
