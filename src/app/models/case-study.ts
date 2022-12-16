export interface ICaseStudy {
  id: string,
  patientId: string,
  bodyPart: string,
  clinicalDiagnosis: string,
  requestType: string,
  description: string,
  sourceHospital: string,
  modalityDoctor?: string,
  specimensCode: string,
  visitCode: string,
  createTime: any,
  specimensDates: any,
  modalityCode: string,
  modalityName: string,
  staff?: string,
  quantity?: string,
  numberOfSlideManual?: number
}
export const INIT_CASE_STUDY : ICaseStudy = {
  id: '',
  patientId: '',
  bodyPart: '',
  clinicalDiagnosis: '',
  requestType: '',
  description: '',
  sourceHospital: '',
  modalityDoctor: '',
  specimensCode: '',
  visitCode: '',
  createTime: null,
  specimensDates: null,
  modalityCode: '',
  modalityName: '',
  staff: '',
  quantity: '',
  numberOfSlideManual: 0
};