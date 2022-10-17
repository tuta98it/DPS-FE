import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './components/layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      AppRoutingModule,
      AppLayoutModule
    ],
    providers: [
      { provide: LocationStrategy, useClass: PathLocationStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
