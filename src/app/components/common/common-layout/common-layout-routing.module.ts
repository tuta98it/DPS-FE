import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonLayoutComponent } from './common-layout/common-layout.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CommonLayoutComponent }
	])],
	exports: [RouterModule]
})
export class CommonLayoutRoutingModule { }
