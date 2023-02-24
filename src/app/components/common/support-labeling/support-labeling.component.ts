import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
@Component({
    selector: 'app-support-labeling',
    templateUrl: './support-labeling.component.html',
    styleUrls: ['./support-labeling.component.scss'],
})
export class SupportLabelingComponent implements OnInit {
    loading = false;
    readingMode = 1;
    searchData = {
        skip: 0,
        take: 40,
        labelStatus: 0,
    };
    total = 0;
    filterLabelStatus = Constants.LABEL_STATUS;
    filterReadingMode = [{ label: 'Editing', value: 1 }];
    filterLabelStatusDisplay: any[] = [];
    filterReadingModeDisplay: any[] = [];
    lstCaseStudy = [];
    _authSubscription: Subscription;
    currentUser = INIT_AUTH_MODEL;
    selectedCaseStudy: any;

    constructor(
        private fb: FormBuilder,
        private notification: NotificationService,
        private caseStudyService: CaseStudyService,
        private authState: AuthStateService
    ) {
        this.filterLabelStatusDisplay = this.filterLabelStatus;
        this.filterReadingModeDisplay = this.filterReadingMode;
        this._authSubscription = this.authState.subscribe((m: IAuthModel) => {
            this.currentUser = m;
            if (this.currentUser.userTypes?.includes('admin')) {
                this.filterReadingModeDisplay.push({
                    label: 'Reviewing',
                    value: 2,
                });
            }
        });
    }

    ngOnInit() {
        this.getList();
    }

    getList() {
        this.loading = true;
        this.caseStudyService
            .getListCaseStudyLabel(this.searchData)
            .subscribe({
                next: (res) => {
                    // this.lstCaseStudy = res.data;
                    if (res.isValid) {
                        this.lstCaseStudy = res.jsonData.data;
                        this.total = res.jsonData.total;
                        console.log(this.total);
                    }
                },
            })
            .add(() => {
                this.loading = false;
            });
    }

    selectCaseStudy(caseStudy: any) {
        this.selectedCaseStudy = caseStudy;
    }

    filterReadingModeChange(data: any) {
        if (data.value === 2) {
            this.searchData.labelStatus = 1;
            this.filterLabelStatusDisplay = this.filterLabelStatus.filter(
                (el) => el.value === 0 || el.value === 1
            );
        } else {
            this.searchData.labelStatus = 0;
            this.filterLabelStatusDisplay = this.filterLabelStatus;
        }
        this.getList();
    }
    filterLabelStatusChange(data: any) {
        this.getList();
    }
    onPageChange(data: any) {
        this.searchData.skip = data.first;
        this.searchData.take = data.rows;
        this.getList();
    }
}
