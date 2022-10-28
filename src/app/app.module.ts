import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './components/layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';
import { AppConfigService } from './shared/app-config.service';
import { CustomHttpInterceptor } from './shared/interceptors/custom-http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from './shared/notification.service';
export function configServiceFactory(config: AppConfigService) {
  return () => config.load();
}
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      AppLayoutModule,
      AppRoutingModule,
      ToastModule,
      // AppStateModule,
    ],
    providers: [
      { provide: LocationStrategy, useClass: PathLocationStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
      MessageService,
      NotificationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
