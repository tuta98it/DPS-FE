import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomHttpInterceptor } from './shared/interceptors/custom-http.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from './shared/notification.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { FirebaseService } from './services/firebase.service';
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      ToastModule,
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
