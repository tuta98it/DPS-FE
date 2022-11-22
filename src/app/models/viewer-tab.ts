export interface IViewerTab {
  caseStudyId: string;
  patientsName?: string;
  createdTime?: string;
}
export const INIT_VIEWER_TAB: IViewerTab = {
  caseStudyId: '',
  patientsName: '',
  createdTime: '',
};