import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { SupportLabelingComponent } from './support-labeling.component';
import { DropdownModule } from 'primeng/dropdown';
import { LabelStatusPipe } from 'src/app/shared/pipes/label-status.pipe';

@NgModule({
    declarations: [SupportLabelingComponent,LabelStatusPipe],
    imports: [
        CommonModule,
        RippleModule,
        DialogModule,
        MTableModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        CommonModule,
        DropdownModule,
    ],
    exports: [SupportLabelingComponent],
})
export class SupportLabelingModule {}
