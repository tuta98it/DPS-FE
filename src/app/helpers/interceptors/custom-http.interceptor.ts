import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AppConfigService } from '../app-config.service';
import { Constants } from '../constants/constants';
import { NotificationService } from '../notification.service';
@Injectable()
export class CustomHttpInterceptor  implements HttpInterceptor {
  baseUrl = '';
  constructor(
    private notification: NotificationService,
    public configService: AppConfigService,
  ) {
    this.loadConfig();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any>  {
    const token = localStorage.getItem(Constants.TOKEN)
    const isApiUrl = request.url.includes(this.baseUrl);
    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    return next.handle(request).pipe(
      map((res: HttpEvent<any>) => {
        if (res instanceof HttpResponse) {
          if (res.body.isValid === false) {
            this.notification.error('Có lỗi xảy ra', res.body.errors[0].errorMessage);
          }
        }
        return res;
      }),
      catchError((error:HttpErrorResponse) => {
        this.notification.error('Có lỗi xảy ra', '');
        return throwError(() => error);
      }));
  }

  loadConfig() {
    if (this.configService.getConfig().api.baseUrl) {
      this.baseUrl = this.configService.getConfig().api.baseUrl;
    } else {
      this.configService.load().then(() => {
        this.baseUrl = this.configService.getConfig().api.baseUrl;
      });
    }
  }
}
