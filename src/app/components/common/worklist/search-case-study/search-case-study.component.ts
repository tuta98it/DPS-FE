import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY, SearchCaseStudy } from 'src/app/models/search-case-study';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'search-case-study',
  templateUrl: './search-case-study.component.html',
  styleUrls: ['./search-case-study.component.scss']
})
export class SearchCaseStudyComponent implements OnInit {
  _visible = false;
  @Input() set visible(value: boolean) {
    if (!value) {
      this.searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
    }
    this._visible = value;
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  
  REQUEST_TYPES = Constants.REQUEST_TYPES;
  REPORT_STATES = Constants.REPORT_STATES;
  searchData: SearchCaseStudy = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));

  constructor() { }

  ngOnInit(): void {
  }

  onSearchEmit() {
    this.onSearch.emit(this.searchData);
    this.visible = false;
  }
}
