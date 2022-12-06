import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { PrintTemplateService } from 'src/app/services/print-template.service';

@Component({
  selector: 'app-print-template-detail',
  templateUrl: './print-template-detail.component.html',
  styleUrls: ['./print-template-detail.component.scss']
})
export class PrintTemplateDetailComponent implements OnInit {

  formId: String = '';
  
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;
  
  baseUrl = '';

  @ViewChild("viewerContainer") viewerContainer!: ElementRef;

  private routeSubscription: any;

  constructor(
    private authState: AuthStateService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    protected configService: AppConfigService,
    protected printTemplateService: PrintTemplateService
  ) {
    this._authSubscription = this.authState.subscribe( (m: IAuthModel) => {
      this.currentUser = m;
      console.log(m);
    });

    this.baseUrl = this.configService.getConfig().api.baseUrl;
    var j = this.baseUrl.indexOf('/api');
    if(j > 0)
      this.baseUrl = this.baseUrl.substring(0, j);

    //bind functions for iframe
    (<any>window).getListCommonInfos= this.getListCommonInfos.bind(this);
    (<any>window).getFormData= this.getFormData.bind(this);
    (<any>window).saveForm= this.saveForm.bind(this);
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.formId = params['id'];
      if(this.formId == undefined)
        this.formId = '';
      
      // if(this.formId == undefined || this.formId == '') {
      //   this.formId = 'new'; //gen objectId?
      // }

      setTimeout(() => {
        this.addViewer(this.formId);
      }, 100);
   });
  }

  addViewer(id: String) {
    const newContainer = this.renderer.createElement('div');
    this.renderer.setAttribute(newContainer, 'id', 'form-'+id);
    this.renderer.addClass(newContainer, 'w-full');
    this.renderer.addClass(newContainer, 'h-auto');
    this.renderer.addClass(newContainer, 'relative');

    const newIFrame = this.renderer.createElement('iframe');
    this.renderer.setAttribute(newIFrame, 'id', '0');
    this.renderer.setAttribute(newIFrame, 'style', 'border:none;width:100%;top:0;left:0;right:0;bottom:0;position:absolute;height:100%;');
    this.renderer.setAttribute(newIFrame, 'src', '/html/print-template/form-viewer.html?domain=' + this.baseUrl + '&formId=' + id + '&userId=' + this.currentUser.userId + '&username=' + this.currentUser.userName + '&hasOT=false');

    this.renderer.appendChild(newContainer, newIFrame);
    this.renderer.appendChild(this.viewerContainer.nativeElement, newContainer);
  }

  /////////////////////////////////////////////////////////
  // functions for iframe form-viewer.html
  ////////////////////////////////////////////////////////
  getListCommonInfos(callback:any) {
    this.printTemplateService.getListCommonInfos().subscribe({
      next: (res) => {
        if (res.isValid) {
          if(callback != undefined) {
            //add type string: 0, image: 1
            res.jsonData.forEach((obj: any) => {
              if(obj.defaultField != undefined && obj.defaultField.indexOf('Image') > -1)
                obj.type = 1;
              else
                obj.type = 0;
            });

            callback(res.jsonData);
          }
            
        }
      }
    });
  }

  getFormData(formId:String, callback:any) {
    this.printTemplateService.getFormData(formId).subscribe({
      next: (res) => {
        if (res.isValid) {
          if(callback != undefined)
            callback(res.jsonData);
        }
      }
    });
  }

  saveForm(formData:any, callback:any) {
    this.printTemplateService.saveFormData(formData).subscribe({
      next: (res) => {
        if (res.isValid) {
          if(callback != undefined) {
            res.jsonData.isValid = res.isValid;
            callback(res.jsonData);
          }
        }
        else {
          if(callback != undefined) {
            callback(res);
          }
        }
      }
    });
  }

  // functions for iframe - END
  ////////////////////////////////////////////////////////

}
