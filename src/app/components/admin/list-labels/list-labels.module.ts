import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { ListLabelsComponent } from './list-labels.component';
import { ListLabelsRoutingModule } from './list-labels-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChipModule } from 'primeng/chip';


@NgModule({
    declarations: [ListLabelsComponent],
    imports: [
        RippleModule,
        DialogModule,
        MTableModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        CommonModule,
        ListLabelsRoutingModule,
        InputSwitchModule,
        ChipModule
    ],
})
export class ListLabelsModule {}
