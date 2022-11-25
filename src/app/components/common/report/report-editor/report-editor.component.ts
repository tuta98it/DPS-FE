import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'report-editor',
  templateUrl: './report-editor.component.html',
  styleUrls: ['./report-editor.component.scss']
})
export class ReportEditorComponent implements OnInit {
  fields: any[] = [];
  constructor() { 
    this.fields = [
      { key: 'microbodyDescribe', label: 'Mô tả vi thể', value: '' },
      { key: 'diagnose', label: 'Chẩn đoán', value: '' },
      { key: 'discuss', label: 'Bàn luận', value: '' },
      { key: 'recommendation', label: 'Khuyến nghị', value: '' },
      { key: 'consultation', label: 'Hội chẩn', value: '' },
    ];
  }

  ngOnInit(): void {
  }


}
