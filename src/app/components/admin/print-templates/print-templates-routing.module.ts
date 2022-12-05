import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrintTemplatesComponent } from './print-templates.component';
import { PrintTemplateDetailComponent } from './print-template-detail/print-template-detail.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ 
			path: '', 
			component: PrintTemplatesComponent 
		},
		{ 
			path: 'detail', 
			component: PrintTemplateDetailComponent 
		},
		{ 
			path: 'detail/:id', 
			component: PrintTemplateDetailComponent 
		},
	])],
	exports: [RouterModule]
})
export class PrintTemplatesRoutingModule { }
