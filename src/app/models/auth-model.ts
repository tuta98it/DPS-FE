export interface IAuthModel {
  userId?: string | null;
  userName?: string;
  avatar?: string;
  userTypes?: any[];
  isAuthenticated?: boolean;
  fullName?: string;
}
export const INIT_AUTH_MODEL: IAuthModel = {
  userId: '',
  userName: '',
  avatar: '',
  userTypes: [],
  isAuthenticated: false,
  fullName: ''
};