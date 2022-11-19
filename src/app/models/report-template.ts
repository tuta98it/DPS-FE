export interface ReportTemplate {
  templateId?: string;
  templateName?: string;
  templateExtName?: string;
  hasChild?: boolean;
  parentName?: string;
  parentId?: string;
  microbodyDescrible?: string;
  diagnose?: string;
  discuss?: string;
  recommendation?: string;
  consultaion?: string;
}
export const INIT_REPORT_TEMPLATE: ReportTemplate = {
  templateId: '',
  templateName: '',
  templateExtName: '',
  hasChild: false,
  parentName: '',
  parentId: '',
  microbodyDescrible: '',
  diagnose: '',
  discuss: '',
  recommendation: '',
  consultaion: '',
};