export class Constants {
  public static readonly OBJECT_ID_EMPTY = "000000000000000000000000";
  public static readonly LAYOUT = {
    FULL: 0,
    DUAL: 1
  }
  public static readonly ACTIONS = {
    EDIT: 0,
    DELETE: 1,
  }
}
export class StorageKeys {
  public static readonly TOKEN = 'dps-token';
  public static readonly USER = 'dps-user';
  public static readonly LAYOUT = 'dps-layout';
}

export class Roles {
  public static readonly TECHNICIAN = "Kỹ thuật viên";
  public static readonly DOCTOR = "Bác sĩ";
  public static readonly DOCTOR_READ = "Bác sĩ đọc";
  public static readonly DOCTOR_APPROVE = "Bác sĩ duyệt";
  public static readonly DOCTOR_WATCH = "Bác sĩ xem";
  public static readonly ADMIN = "admin";
  public static readonly DEMO = "Demo";
  public static readonly MANAGER = "Quản lý";
  public static readonly UPDATECASESTUDY = "Sửa thông tin ca chụp";
  public static readonly REMOTE_READ_DOCTOR = "Bác sĩ đọc từ xa";
  public static readonly REQUEST_REMOTE_READ = "Yêu cầu đọc từ xa";
  public static readonly ASSIGN = "Assign";
  public static readonly MANAGE_BRANCH = "Quản lý branch";
  public static readonly MANGAGE_USER = "Quản lý user";
  public static readonly MANGAGE_GROUP = "Quản lý group user";
  public static readonly MANAGE_TEMPLATE = "Quản lý mẫu báo cáo / mẫu in";
  public static readonly MANAGE_MARKTYPE = "Quản lý phương pháp nhuộm";
  public static readonly MANAGE_CS_STATUS = "Quản lý trạng trái ca chụp";
  public static readonly MANAGE_ASSIGN_DOCTOR = "Quản lý DS BS chỉ định";
  public static readonly MANAGE_CS_LOG = "Quản lý log ca chụp";
  public static readonly SHARE_CASESTUDY = "Share ca chụp";
  public static readonly SYSTEM_CONFIG = "Cấu hình hệ thống";
  public static readonly EDIT_AFTER_PRINT = "Sửa kết quả khi in";
  public static readonly DELETE_CASESTUDY = "Xóa Ca Khám";
  public static readonly DELETE_SLIDE = "Xóa Slide";
}