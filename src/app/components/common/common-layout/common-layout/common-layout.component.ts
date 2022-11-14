import { Component, OnInit } from '@angular/core';
import { Constants, StorageKeys } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss']
})
export class CommonLayoutComponent implements OnInit {
  LAYOUT = Constants.LAYOUT;
  isVisibleSelectLayout = false;
  selectedLayout = Constants.LAYOUT.FULL;
  currentSelectedLayout = Constants.LAYOUT.FULL;
  constructor() {
    let layout = localStorage.getItem(StorageKeys.LAYOUT);
    if (layout !== null) {
      this.selectedLayout = +layout;
      this.currentSelectedLayout = this.selectedLayout;
    }
  }

  ngOnInit(): void {
  }

  saveLayout() {
    this.selectedLayout = this.currentSelectedLayout;
    localStorage.setItem(StorageKeys.LAYOUT, this.selectedLayout.toString());
    this.isVisibleSelectLayout = false;
  }

  onSelectLayout(event: any) {
    this.isVisibleSelectLayout = true;
  }
}
