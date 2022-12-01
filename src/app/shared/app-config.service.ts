import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../environments/environment';
import { Injectable, Type, CompilerOptions, NgModuleRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AppConfig } from '../models/app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config = new AppConfig();
  
  constructor(private http: HttpClient) {}

  static bootstrap<TM>(
    moduleType: Type<TM>,
    compilerOptions?: CompilerOptions | CompilerOptions[]
  ): Promise<NgModuleRef<TM>> {
    return platformBrowserDynamic().bootstrapModule(
      moduleType,
      compilerOptions
    );
  }

  load() {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          DataType: 'application/json',
        },
      };
      this.http.get(`../../assets/config/${environment.env}.json`, options).subscribe({
        next: (data: any) => {
          this.setConfig(data);
          resolve(true);
        },
        error: (error) => {
          console.log('error', error)
          this.errorHandler(error)
        }
      });
    });
  }

  private setConfig = (data: any): void => {
    this.config.api.baseUrl = 'https://' + data.api.baseUrl;
    this.config.api.fileUrl = 'https://' + data.api.fileUrl;
    this.config.deepzoom.baseUrl = 'https://' + data.deepzoom.baseUrl;
    this.config.layout = data.layout;
    this.config.slogan = data.slogan;
  };

  private errorHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || 'Server Error'));
  }

  getConfig = () => this.config;
}
