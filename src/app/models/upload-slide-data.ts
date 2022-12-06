export interface IUploadSlideData {
  uploadId: string;
  patientName?: string;
  fileName?: string;
  newFileName?: string;
  caseStudyId?: string;
  markerType?: string;
  isMotic?: string;
  createTime?: Date | null;
  userId?: string;
  userName?: string;
}
export const INIT_UPLOAD_SLIDE_DATA: IUploadSlideData = {
  uploadId: '',
  patientName: '',
  fileName: '',
  newFileName: '',
  caseStudyId: '',
  markerType: '',
  isMotic: '',
  createTime: null,
  userId: '',
  userName: '',
};