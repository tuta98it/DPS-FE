import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BodyPartsComponent } from './body-parts.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: BodyPartsComponent }
	])],
	exports: [RouterModule]
})
export class BodyPartsRoutingModule { }
