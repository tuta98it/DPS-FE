import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../helpers/app-config.service';
import { Constants } from '../helpers/constants/constants';

@Injectable()
export abstract class Service {
  constructor(
    public httpClient: HttpClient,
    protected configService: AppConfigService
  ) {}

  get(url: string, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.get(
          this.configService.getConfig().api.baseUrl + url,
          {
            headers: this.createHeaders().set('skipLoading', 'true') || {},
            params,
            responseType: 'text',
          }
        );
      case 'blob':
        return this.httpClient.get(
          this.configService.getConfig().api.baseUrl + url,
          {
            headers: this.createHeaders().set('skipLoading', 'true') || {},
            params,
            responseType: 'blob',
          }
        );
      default:
        return this.httpClient.get(
          this.configService.getConfig().api.baseUrl + url,
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
    switch (responseType) {
      case 'text':
        return this.httpClient.post(
          this.configService.getConfig().api.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
            params,
          }
        );
      case 'blob':
        return this.httpClient.post(
          this.configService.getConfig().api.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'blob',
            params,
          }
        );
      case 'arraybuffer':
        return this.httpClient.post(
          this.configService.getConfig().api.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'blob',
            params,
          }
        );
      default:
        return this.httpClient.post(
          this.configService.getConfig().api.baseUrl + url,
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
          this.configService.getConfig().api.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
          }
        );
      default:
        return this.httpClient.put(
          this.configService.getConfig().api.baseUrl + url,
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
          this.configService.getConfig().api.baseUrl + url,
          data,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
          }
        );
      default:
        return this.httpClient.patch(
          this.configService.getConfig().api.baseUrl + url,
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
          this.configService.getConfig().api.baseUrl + url + id,
          {
            headers: this.createHeaders() || {},
            responseType: 'text',
          }
        );
      default:
        return this.httpClient.delete(
          this.configService.getConfig().api.baseUrl + url + id,
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
