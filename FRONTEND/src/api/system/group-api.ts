
import type { AxiosRequestConfig } from 'axios';
import { request } from '../request-configuration';
import { ApiDefine } from '../define-api';
import { GroupPermission, GroupPermissionFullModel, GroupPermissionQuery } from '@/interface/group-permission/group.interface';
import { MongoQueryResponseModel, MinvoiceResponseModel } from '@/interface/base/api.interface';


export const getGroupPermission = (query: GroupPermissionQuery, config: AxiosRequestConfig = {}) => request<MongoQueryResponseModel<GroupPermissionFullModel>>('get', ApiDefine.GROUP, query, config);
export const deleteGroupPermission = (groupCode: string, config: AxiosRequestConfig = {}) => request<null>('delete', `${ApiDefine.GROUP}/${groupCode}`, {}, config);
export const updateGroupPermission = (groupCode: string, groupPermission: GroupPermission, config: AxiosRequestConfig = {}) => request<GroupPermission>('put', `${ApiDefine.GROUP}/${groupCode}`, groupPermission, config);
export const createGroupPermission = (groupPermission: GroupPermission, config: AxiosRequestConfig = {}) => request<GroupPermission>('post', ApiDefine.GROUP, groupPermission, config);
export const getGroupPermissionByCode = (code: string, config: AxiosRequestConfig = {}) => request<MinvoiceResponseModel<GroupPermissionFullModel>>('get', `${ApiDefine.GROUP}/${code}`, {}, config);
export const getGroupPermissionByUser = (config: AxiosRequestConfig = {}) => request<MinvoiceResponseModel<GroupPermissionFullModel>>('get', `${ApiDefine.GROUP}/by-user`, null, config);