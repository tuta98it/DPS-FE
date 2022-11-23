export interface ICaseStudy {
  id: string,
  patientId: string,
  bodyPart: string,
  clinicalDiagnosis: string,
  requestType: string,
  description: string,
  sourceHospital: string,
  specimensCode: string,
  visitCode: string,
  createTime: string,
  modalityCode: string,
  modalityName: string
}
export const INIT_CASE_STUDY : ICaseStudy = {
  id: '',
  patientId: '',
  bodyPart: '',
  clinicalDiagnosis: '',
  requestType: '',
  description: '',
  sourceHospital: '',
  specimensCode: '',
  visitCode: '',
  createTime: '',
  modalityCode: '',
  modalityName: ''
};