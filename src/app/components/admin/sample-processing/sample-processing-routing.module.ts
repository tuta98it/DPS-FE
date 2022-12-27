import { NgModule } from '@angular/core';
import { RouterModule,} from '@angular/router';
import { SampleProcessingComponent } from './sample-processing.component';


@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: SampleProcessingComponent}
  ])],
  exports: [RouterModule]
})
export class SampleProcessingRoutingModule { }
