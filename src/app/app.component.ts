import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppConfigService } from './shared/app-config.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        private primengConfig: PrimeNGConfig,
        public configService: AppConfigService,   
    ) {
        if (!this.configService.getConfig().api.baseUrl) {
          this.configService.load().then(() => {
          });
        }
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
