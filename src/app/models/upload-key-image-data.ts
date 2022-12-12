export interface IUploadKeyImageData {
  createKeyImage: boolean;
  isPrintKeyImage: boolean;
  keyImageTitle: string;
  keyImageNote: string;
}
export const INIT_UPLOAD_KEY_IMAGE_DATA: IUploadKeyImageData = {
  createKeyImage: false,
  isPrintKeyImage: false,
  keyImageTitle: '',
  keyImageNote: '',
};