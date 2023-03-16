import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import {
    INIT_SEARCH_CASE_STUDY,
    SearchCaseStudy,
} from 'src/app/models/search-case-study';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { SortEvent } from 'primeng/api';
import { file } from 'jszip';
//
// import { ProductService } from '../../service/productservice';

@Component({
    selector: 'case-study-table',
    templateUrl: './case-study-table.component.html',
    styleUrls: ['./case-study-table.component.scss'],
})
export class CaseStudyTableComponent implements OnInit {
    @Input() caseStudies: any[] = [];
    @Input() tableHeight = 300;
    @Input() rows = 0;
    @Input() loading = false;
    @Input() isRelatedList = false;
    // input searchData

    @Output() onLazyLoad = new EventEmitter<any>();

    @Output() onAction = new EventEmitter<any>();

    @Output() onSelectCaseStudy = new EventEmitter<any>();
    actions!: MenuItem[];
    selectedCaseStudy: any = {};
    cols!: any[];
    @ViewChild('caseStudyTable') caseStudyTable!: Table;
    clickTimer: any;

    layoutConfig = '';
    REPORT_STATES = Constants.REPORT_STATES;
    REQUEST_TYPES = Constants.REQUEST_TYPES;
    LAYOUT_CONFIG = Constants.LAYOUT_CONFIG;
    FILTER_STATES_1 = Constants.FILTER_STATES_1;
    FILTER_STATES_2 = Constants.FILTER_STATES_2;
    FILTER_STATES_3 = Constants.FILTER_STATES_3;
    FILTER_STATES_4 = Constants.FILTER_STATES_4;

    @Input() searchData: SearchCaseStudy = JSON.parse(
        JSON.stringify(INIT_SEARCH_CASE_STUDY)
    );
    @Output() onSearch = new EventEmitter<any>();
    private sortOder = true;

    isSearchTable = false;

    _isShowSearch = false;
    @Input() set isShowSearch(value: boolean) {
        this._isShowSearch = value;
        this.isShowSearchChange.emit(value);
    }
    get isShowSearch() {
        return this._isShowSearch;
    }
    @Output() isShowSearchChange = new EventEmitter<any>();

    @ViewChild('sltDateRange') sltDateRange!: OverlayPanel;

    // products1: Product[];
    constructor(
        private viewerState: ViewerStateService,
        private notification: NotificationService,
        public configService: AppConfigService // private productService: ProductService
    ) {
        this.layoutConfig = this.configService.getConfig().layout;
        this.cols = [
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                isExSort: true,
                width: '12rem',
            },
            {
                field: 'patientsName',
                header: 'Tên bệnh nhân',
                isExSort: true,
                width: '12rem',
            },
            {
                field: 'patientCode',
                header: 'Mã bệnh nhân',
                isExSort: false,
                width: '10rem',
            },
            {
                field: 'createdTime',
                header: 'Ngày lấy mẫu',
                isExSort: true,
                width: '10rem',
            },
            {
                field: 'specimensCode',
                header: 'Mã bệnh phẩm',
                isExSort: false,
                width: '10rem',
            },
            {
                field: 'requestTypeLabel',
                header: 'Loại yêu cầu',
                isExSort: true,
                width: '10rem',
            },
            {
                field: 'slideCount',
                header: 'Số lam kính',
                isExSort: true,
                width: '8.5rem',
            },
            {
                field: 'bodyPart',
                header: 'Vị trí lấy mẫu',
                isExSort: true,
                width: '10rem',
            },
            {
                field: 'sourceHospital',
                header: 'Nơi gửi mẫu',
                isExSort: true,
                width: '15rem',
            },
            {
                field: 'clinicalDiagnosis',
                header: 'Chẩn đoán',
                isExSort: false,
                width: '15rem',
            },
            {
                field: 'conclusion',
                header: 'Kết luận',
                isExSort: false,
                width: '18.5rem',
            },
        ];
        if (this.layoutConfig == Constants.LAYOUT_CONFIG.VT) {
            this.cols.splice(
                3,
                0,
                ...[
                    {
                        field: 'hasSlide',
                        header: 'Đã chụp',
                        isExSort: false,
                        width: '7rem',
                    },
                    {
                        field: 'hasConclusion',
                        header: 'Đã đọc',
                        isExSort: false,
                        width: '7rem',
                    },
                    {
                        field: 'isApprove',
                        header: 'Đã duyệt',
                        isExSort: false,
                        width: '7rem',
                    },
                    {
                        field: 'isPrint',
                        header: 'Đã in',
                        isExSort: false,
                        width: '7rem',
                    },
                ]
            );
        }
    }

    ngOnInit() {
        this.actions = [
            {
                label: 'Mở SlideViewer',
                icon: 'pi pi-fw pi-external-link',
                command: () => this.openViewer(this.selectedCaseStudy),
            },
            {
                label: 'Cập nhật worklist',
                icon: 'pi pi-fw pi-sync',
                command: () =>
                    this.onAction.emit({
                        action: Constants.CASE_STUDY_ACTIONS.REFRESH,
                    }),
                visible: !this.isRelatedList,
            },
            {
                label: 'Sửa chi tiết ca khám',
                icon: 'pi pi-fw pi-file-edit',
                command: () =>
                    this.onAction.emit({
                        action: Constants.CASE_STUDY_ACTIONS.EDIT,
                        data: this.selectedCaseStudy,
                    }),
                visible: this.layoutConfig == Constants.LAYOUT_CONFIG.DEFAULT,
            },
            {
                label: 'Tải lên lam kính',
                icon: 'pi pi-fw pi-upload',
                command: () =>
                    this.onAction.emit({
                        action: Constants.CASE_STUDY_ACTIONS.UPLOAD_SLIDE,
                        data: this.selectedCaseStudy,
                    }),
            },
            {
                label: 'Sửa thông tin bệnh nhân',
                icon: 'pi pi-fw pi-user-edit',
                command: () =>
                    this.onAction.emit({
                        action: Constants.CASE_STUDY_ACTIONS.EDIT_PATIENT,
                        data: this.selectedCaseStudy,
                    }),
                visible: this.layoutConfig == Constants.LAYOUT_CONFIG.DEFAULT,
            },
            {
                label: 'Share ca khám',
                icon: 'pi pi-fw pi-share-alt',
                command: () =>
                    this.onAction.emit({
                        action: Constants.CASE_STUDY_ACTIONS.SHARE,
                        data: this.selectedCaseStudy,
                    }),
            },
            {
                label: 'Xóa ca khám',
                icon: 'pi pi-fw pi-trash',
                command: () =>
                    this.onAction.emit({
                        action: Constants.CASE_STUDY_ACTIONS.DELETE,
                        data: this.selectedCaseStudy,
                    }),
            },
        ];

        //
        // this.productService.getProductsSmall().then(data => this.products1 = data);
    }

    onRowSelect(event: any, data: any) {
        if (event.detail == 1) {
            this.clickTimer = setTimeout(() => {
                this.selectedCaseStudy = data;
                this.onSelectCaseStudy.emit(data);
            }, 300);
        }
    }

    resetScrollTop() {
        this.caseStudyTable.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }

    openViewer(caseStudy: any) {
        if (caseStudy.slideCount) {
            // this.selectedCaseStudy = caseStudy;
            // this.onSelectCaseStudy.emit(caseStudy);
            clearTimeout(this.clickTimer);

            let newTab: IViewerTab = {
                caseStudyId: caseStudy.caseStudyId,
                patientsName: caseStudy.patientsName,
                createdTime: caseStudy.createdTime,
            };
            this.viewerState.openTab(newTab);
        } else {
            this.notification.warn('Chưa có lam kính cho ca khám này');
        }
    }

    // Luật sắp xếp
    customSort(col: any) {
        var dataField = col.field;
        console.log(dataField);
        dataField = dataField.charAt(0).toUpperCase() + dataField.slice(1);
        console.log(dataField);
        if (col.isExSort) {
            this.onSearch.emit({
                patientName: '',
                patientCode: '',
                requestType: '',
                from: this.searchData.from,
                to: this.searchData.to,
                approveFrom: '',
                approveTo: '',
                page: 1,
                pageSize: 50,
                status: this.searchData.status,
                conclusion: '',
                diagnose: '',
                specimensCode: '',
                sort: [
                    {
                        field: dataField,
                        dir: this.sortOder ? 'dsc' : 'asc',
                    },
                ],
                hasSlide: 10,
                hasConclusion: 10,
                isApprove: 10,
                isPrint: 10,
            });
        }

        //Đảo chiều thứ tự sắp xếp
        this.sortOder = !this.sortOder;
        // console.log(event);
        console.log('test function customSort()');

        // if (event.data) {
        //     event.data.sort((data1, data2) => {
        //         if (event.field) {
        //             let value1 = data1[event.field];
        //             let value2 = data2[event.field];
        //             let result = null;

        //             if (value1 == null && value2 != null) result = -1;
        //             else if (value1 != null && value2 == null) result = 1;
        //             else if (value1 == null && value2 == null) result = 0;
        //             else if (
        //                 typeof value1 === 'string' &&
        //                 typeof value2 === 'string'
        //             )
        //                 result = value1.localeCompare(value2);
        //             else
        //                 result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

        //             if (event.order) {
        //                 return event.order * result;
        //             }
        //         }
        //     });
        // }
    }
}
