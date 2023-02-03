export class Constants {
  public static readonly FIREBASE_TOKEN = 'fb-token';
  public static readonly OBJECT_ID_EMPTY = "000000000000000000000000";

  public static readonly TABLE_PARAM = {
    PAGE_SIZE: 40,
  }

  public static readonly LAYOUT = {
    FULL: 0,
    DUAL: 1
  }
  public static readonly LAYOUT_CONFIG = {
    VT: "VT",
    DEFAULT: "default"
  }
  public static readonly ACTIONS = {
    EDIT: 0,
    DELETE: 1,
  }
  public static readonly CASE_STUDY_ACTIONS = {
    OPEN_SLIDE: 0,
    REFRESH: 1,
    EDIT: 2,
    UPLOAD_SLIDE: 3,
    EDIT_PATIENT: 4,
    SHARE: 5,
    DELETE: 6,
  }
  public static readonly REPORT_ACTIONS = {
    DISCARD: 0,
    SAVE: 1,
    APPROVE: 2,
    UNAPPROVE: 3,
    PRINT: 4,
    ADD: 5,
    KEY_IMAGES: 6,
    HISTORY: 7,
  }
  public static readonly UPLOAD_STATUS = {
    UPLOADING: 1,
    PROCESSING: 2,
    COMPLETED: 4,
    ERROR: 69
  }
  public static readonly UPLOAD_STATUS_LABEL = {
    [Constants.UPLOAD_STATUS.UPLOADING]: { label: 'Đang tải lên', color: 'text-orange-500' },
    [Constants.UPLOAD_STATUS.PROCESSING]: { label: 'Đang xử lý', color: 'text-orange-500' },
    [Constants.UPLOAD_STATUS.COMPLETED]: { label: 'Đã hoàn thành', color: 'text-green-500' },
    [Constants.UPLOAD_STATUS.ERROR]: { label: 'Thất bại', color: 'text-red-500' },
  }

  public static readonly UPLOAD_PROCESS_TYPE = {
    PROCESS_DONE: 'ProcessDone',
    PROCESS_ERROR: 'ProcessError',
    SERVICE_ERROR: 'ServiceError'
  }
  public static readonly REQUEST_TYPES = [
    {label: 'Tế bào học', value: "0"},
    {label: 'Mô bệnh học', value: "1"},
  ];
  public static readonly GENDERS = [
    {label: 'Nam', value: "1"},
    {label: 'Nữ', value: "0"},
  ];
  public static readonly PATIENT_TYPES = [
    {label: 'Nội trú', value: "0"},
    {label: 'Ngoại trú', value: "1"},
  ];
  public static readonly MACHINE_TYPES = [
    {label: 'Motic', value: "1"},
    {label: 'Máy khác', value: "0"},
    {label: 'Ảnh chụp từ camera', value: "2"},
  ];
  public static readonly REPORT_STATES = [
    {label: 'Đã chụp', value: "0"},
    {label: 'Đang đọc', value: "1"},
    {label: 'Chờ duyệt', value: "2"},
    {label: 'Đang duyệt', value: "3"},
    {label: 'Đã duyệt', value: "4"},
  ];
  public static readonly FILTER_STATES_1 = [
    {label: 'Tất cả', value: 10},
    {label: 'Đã chụp', value: 1},
    {label: 'Chưa chụp', value: 0}
  ];
  public static readonly FILTER_STATES_2 = [
    {label: 'Tất cả', value: 10},
    {label: 'Đã đọc', value: 1},
    {label: 'Chưa đọc', value: 0}
  ];
  public static readonly FILTER_STATES_3 = [
    {label: 'Tất cả', value: 10},
    {label: 'Đã duyệt', value: 1},
    {label: 'Chưa duyệt', value: 0}
  ];
  public static readonly FILTER_STATES_4 = [
    {label: 'Tất cả', value: 10},
    {label: 'Đã in', value: 1},
    {label: 'Chưa in', value: 0}
  ];
  public static readonly SHARED_PERIODS = [
    {label: '4 tiếng', value: 4},
    {label: '8 tiếng', value: 8},
    {label: '1 ngày', value: 24},
    {label: '2 ngày', value: 48},
    {label: '3 ngày', value: 72},
    {label: '1 tuần', value: 168},
    {label: '2 tuần', value: 336},
    {label: '3 tuần', value: 504},
    {label: '1 tháng', value: 720},
    {label: 'Vô thời hạn', value: -1},
  ];
  public static readonly REPORT_EDITING_STATES = {
    READING: 1,
    APPROVING: 3,
  };
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
  public static readonly ORDER_DOCTOR = "Bác sĩ chỉ định";
  public static readonly ADMIN = "admin";
  public static readonly DEMO = "Demo";
  public static readonly MANAGER = "Quản lý";
  public static readonly UPDATECASESTUDY = "Sửa thông tin ca chụp";
  public static readonly REMOTE_READ_DOCTOR = "Bác sĩ đọc từ xa";
  public static readonly REQUEST_REMOTE_READ = "Yêu cầu đọc từ xa";
  public static readonly ASSIGN = "Assign";
  public static readonly MANAGE_BRANCH = "Quản lý branch";
  public static readonly MANAGE_USER = "Quản lý user";
  public static readonly MANAGE_GROUP = "Quản lý group user";
  public static readonly MANAGE_CATEGORY = "Quản lý danh mục";
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
