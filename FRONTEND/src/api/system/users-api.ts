import type { UserData, ModelGetData, ModelUser, ModelUserById } from '../../interface/user/user.interface';
import { ApiDefine } from '../define-api'
import { request } from '../request-configuration';

export const apiGetUsers = (data: ModelGetData) => request<UserData>('get', ApiDefine.USER.GET_DATA, data);
export const apiGetUsersInfo = () => request<ModelUserById>('get', ApiDefine.USER.INFO);
export const apiCreateUsers = (data: ModelUser) => request<UserData>('post', ApiDefine.USER.CREATE, data);
export const apiUpdateUsers = (id: any, data: ModelUser) => request<UserData>('put', `${ApiDefine.USER.UPDATE}/${id}`, data);
export const apiDeleteUsers = (id: any) => request<UserData>('delete', `${ApiDefine.USER.DELETE}/${id}`);
export const apiGetUsersById = (id: any) => request<ModelUserById>('get', `${ApiDefine.USER.GET_DATA}/${id}`);