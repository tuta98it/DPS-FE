import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../shared/app-config.service';
import { Constants } from '../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export abstract class Service {
  baseUrl = '';
  constructor(
    public httpClient: HttpClient,
    protected configService: AppConfigService
  ) {
    if (this.configService.getConfig().api.baseUrl) {
      this.baseUrl = this.configService.getConfig().api.baseUrl;
    } else {
      this.configService.load().then(() => {
        this.baseUrl = this.configService.getConfig().api.baseUrl;
      });
    }
  }

  get(url: string, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.get(
          this.baseUrl + url,
          {
            headers: this.createHeaders().set('skipLoading', 'true') || {},
            params,
            responseType: 'text',
          }
        );
      case 'blob':
        return this.httpClient.get(
          this.baseUrl + url,
          {
            headers: this.createHeaders().set('skipLoading', 'true') || {},
            params,
            responseType: 'blob',
          }
        );
      default:
        return this.httpClient.get(
          this.baseUrl + url,
          {
            headers: this.createHeaders().set('skipLoading', 'true') || {},
            params,
          }
        );
    }
  }

  post(
    url: string,
    data: any,
    params?: {},
    responseType?: string
  ): Observable<any> {
    console.log('post', this.baseUrl + url)
    switch (responseType) {
      case 'text':
        return this.httpClient.post(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
            params,
          }
        );
      case 'blob':
        return this.httpClient.post(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'blob',
            params,
          }
        );
      case 'arraybuffer':
        return this.httpClient.post(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'blob',
            params,
          }
        );
      default:
        return this.httpClient.post(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            params,
          }
        );
    }
  }

  put(url: string, data: any, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.put(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
          }
        );
      default:
        return this.httpClient.put(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
          }
        );
    }
  }
  
  patch(url: string, data: any, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.patch(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
          }
        );
      default:
        return this.httpClient.patch(
          this.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
          }
        );
    }
  }

  delete(url: string, id: any, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.delete(
          this.baseUrl + url + id,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
          }
        );
      default:
        return this.httpClient.delete(
          this.baseUrl + url + id,
          {
            headers: this.createHeaders() || {},
          }
        );
    }
  }

  public createHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
  }
  private getToken(): string {
    return localStorage.getItem(Constants.TOKEN) ?? '';
  }
}
