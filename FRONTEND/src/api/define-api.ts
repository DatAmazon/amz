
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
export const ApiDefine = {
  LOG_IN: "auth/login",
  LOG_OUT: "auth/logout",
  MENU : "menus",
  USER : {
    CREATE:"users",
    UPDATE:"users",
    DELETE:"users",
    GET_DATA:"users"
  },
  NOTICE : "users/notice",
}