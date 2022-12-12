import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportTemplatesComponent } from './report-templates.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ReportTemplatesComponent },
	])],
	exports: [RouterModule]
})
export class ReportTemplatesRoutingModule { }
