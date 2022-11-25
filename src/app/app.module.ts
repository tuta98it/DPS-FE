import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomHttpInterceptor } from './shared/interceptors/custom-http.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { NotificationService } from './shared/notification.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { FirebaseService } from './services/firebase.service';
import { NotificationModule } from './shared/components/notification/notification.module';
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      NotificationModule,
      CommonModule,
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireMessagingModule
    ],
    providers: [
      FirebaseService,
      { provide: LocationStrategy, useClass: PathLocationStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
      MessageService,
      NotificationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
