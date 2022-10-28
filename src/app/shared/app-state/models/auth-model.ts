export interface AuthModel {
  userId?: string | null;
  userName?: string;
  avatar?: string;
  userTypes?: any[];
  isAuthenticated?: boolean;
  fullName?: string;
}
