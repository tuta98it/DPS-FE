import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppConfigService } from './shared/app-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private primengConfig: PrimeNGConfig,
    public configService: AppConfigService,
    private translateService: TranslateService
  ) {
    if (!this.configService.getConfig().api.baseUrl) {
      this.configService.load().then(() => {
      });
    }
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('vi');
  }

  ngAfterViewInit() {
    console.log('lang ');
    this.translateService.use('vi');
    this.translateService
      .get('primeng')
      .subscribe(res => this.primengConfig.setTranslation(res));
  }

  translate(lang: string) {
    console.log(lang);
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe(res => this.primengConfig.setTranslation(res));
  }
}
