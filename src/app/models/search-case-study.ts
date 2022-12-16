export interface SearchCaseStudy {
  patientName: string;
  patientCode: string;
  requestType: string;
  from: Date | string;
  to: Date | string;
  approveFrom: string;
  approveTo: string;
  page: number;
  pageSize: number;
  status: any;
  conclusion: string;
  diagnose: string;
  specimensCode: string;
  sort: any[];
}
export const INIT_SEARCH_CASE_STUDY : SearchCaseStudy = {
  patientName: '',
  patientCode: '',
  requestType: '',
  from: '',
  to: '',
  approveFrom: '',
  approveTo: '',
  page: 1,
  pageSize: 50,
  status: '',
  conclusion: '',
  diagnose: '',
  specimensCode: '',
  sort: []
};