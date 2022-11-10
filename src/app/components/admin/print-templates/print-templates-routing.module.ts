import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrintTemplatesComponent } from './print-templates.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PrintTemplatesComponent }
	])],
	exports: [RouterModule]
})
export class PrintTemplatesRoutingModule { }
