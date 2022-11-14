import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarkTypesComponent } from './mark-types.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MarkTypesComponent }
	])],
	exports: [RouterModule]
})
export class MarkTypesRoutingModule { }
