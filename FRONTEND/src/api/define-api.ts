export const ApiDefine = {
  LOG_IN: "auth/login",
  LOG_OUT: "auth/logout",
  MENU: {
    GET_BY_USER: "menus",
    GET_ALL: "menus/get-all"
  },
  USER: {
    CREATE: "users",
    UPDATE: "users",
    DELETE: "users",
    GET_DATA: "users",
    INFO: "users/profile",
  },
  NOTICE: "users/notice",
  GROUP: "groups"
};
enum data {
  LOG_IN = "auth/login",
  LOG_OUT = "auth/logout",
  MENU = "menus",
  USER = "user",
  USER_CREATE = "user",
  USER_UPDATE = "user",
  USER_DELETE = "user",
  NOTICE = "users/notice",
}
export const ApiList = (key: string) => {
  const indexOfKey = Object.keys(data).indexOf(key);
  return Object.values(data)[indexOfKey];
}