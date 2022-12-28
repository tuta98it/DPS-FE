export interface IViewerTab {
  caseStudyId: string;
  patientsName?: string;
  createdTime?: string;
  sharedToken?: string;
}
export const INIT_VIEWER_TAB: IViewerTab = {
  caseStudyId: '',
  patientsName: '',
  createdTime: '',
  sharedToken: ''
};