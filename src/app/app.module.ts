import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './components/layout/app.layout.module';
import { AppRoutingModule } from './app-routing.module';
import { AppConfigService } from './helpers/app-config.service';
import { AppStateModule } from './helpers/app-state/app-state.module';
export function configServiceFactory(config: AppConfigService) {
  return () => config.load();
}
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      AppRoutingModule,
      AppStateModule,
      AppLayoutModule
    ],
    providers: [
      { provide: LocationStrategy, useClass: PathLocationStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
