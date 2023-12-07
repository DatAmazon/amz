import { QueryModel } from "../base/api.interface";
import { MongoModel } from "../base/mongo-model.interface";
import { MenuChild } from "../layout/menu.interface";
export interface MenuPermission extends MenuChild, MongoModel {
    search: boolean | false,
    exportExcel: boolean | false,
    viewXml: boolean | false,
    getXml: boolean | false,
    children?: string | undefined
}
export interface GroupPermission {
    code: string,
    name: string,
    menus: Array<MenuPermission>
}
export interface GroupPermissionFullModel extends GroupPermission, MongoModel {

}

export interface GroupPermissionQuery extends QueryModel {
    code?: string,
    name?: string
}