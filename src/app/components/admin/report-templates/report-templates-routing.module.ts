import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportTemplatesComponent } from './import-templates/import-templates.component';
import { ReportTemplatesComponent } from './report-templates.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ReportTemplatesComponent },
        { path: 'import', component: ImportTemplatesComponent }
	])],
	exports: [RouterModule]
})
export class ReportTemplatesRoutingModule { }
