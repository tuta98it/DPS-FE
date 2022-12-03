export interface ISlideNotification {
  id: string;
  caseStudyId?: string;
  fileName?: string;
  uploadProgress?: number;
  fileSize?: number;
  fileSizeStr?: string;
  patientName?: string;
  state?: number;
  modifiedDate?: Date | null;
}
export const INIT_SLIDE_NOTIFICATION: ISlideNotification = {
  id: '',
  caseStudyId: '',
  fileName: '',
  uploadProgress: 0,
  fileSize: 0,
  fileSizeStr: '',
  patientName: '',
  state: 0,
  modifiedDate: null,
};