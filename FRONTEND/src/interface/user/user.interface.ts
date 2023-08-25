import type { Role } from './login.interface';
import type { Device } from '@/interface/layout/index.interface';
import type { MenuChild } from '@/interface/layout/menu.interface';

export type Locale = 'zh_CN' | 'en_US';

export interface UserState {
  username: string;
  /** menu list for init tagsView */
  menuList: MenuChild[];
  /** login status */
  logged: boolean;
  role: Role;
  /** user's device */
  device: Device;
  /** menu collapsed status */
  collapsed: boolean;
  /** notification count */
  noticeCount: number;
  /** user's language */
  locale: Locale;
  /** Is first time to view the site ? */
  newUser: boolean;
}

export interface docsUser {
  _id: string,
  username: String;
  name: String;
  email: String;
  active: boolean;
  role: String;
}
export interface UserData {
  docs: docsUser[];
  totalDocs: Number;
  offset: Number;
  limit: Number;
  totalPages: Number;
  page: Number;
  pagingCounter: Number
}

export interface GetDataParram {
  page: Number;
  size: Number;
  email?: String;
  name?: String;
}