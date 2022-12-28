import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonLayoutComponent } from './common-layout/common-layout.component';
import { ShareStudyComponent } from '../share-study/share-study.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'share/:token', component: ShareStudyComponent },
		{ path: '', component: CommonLayoutComponent },
	])],
	exports: [RouterModule]
})
export class CommonLayoutRoutingModule { }
