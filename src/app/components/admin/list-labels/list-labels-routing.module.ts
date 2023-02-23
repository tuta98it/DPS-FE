import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListLabelsComponent } from './list-labels.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListLabelsComponent }
	])],
	exports: [RouterModule]
})
export class ListLabelsRoutingModule { }
