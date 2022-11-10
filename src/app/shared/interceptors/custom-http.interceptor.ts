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
import { Router } from '@angular/router';
@Injectable()
export class CustomHttpInterceptor  implements HttpInterceptor {
  baseUrl = '';
  constructor(
    private notification: NotificationService,
    private router: Router,
    public configService: AppConfigService,
  ) {
    this.baseUrl = this.configService.getConfig().api.baseUrl;
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
        if (error.status == 403) {
          this.router.navigate(['/login']);
        } else {
          this.notification.error('Có lỗi xảy ra', '');
        }
        return throwError(() => error);
      }));
  }
}
