import { MongoModel } from "../base/mongo-model.interface";

export interface MenuItem extends MongoModel {
  /** menu item code */
  menuId: string;
  menuName: {
    zh_CN: string;
    en_US: string;
    vi_VI: String;
  };
  menuIcon?: string;
  menuPath: string;
  data: MenuItem[];
}

export interface MenuResult {
  /** auth token */
  code: string;
  data: MenuItem[];
  message: string;
}

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];
