import type { UserData, ModelGetData, ModelCreate } from '../../interface/user/user.interface';
import { ApiDefine } from '../define-api'
import { request } from '../request-configuration';

export const apiGetUsers = (data: ModelGetData) => request<UserData>('get', ApiDefine.USER.GET_DATA, data);
export const apiDeleteUsers = (id: any) => request<UserData>('delete', `${ApiDefine.USER.DELETE}/${id}`);
export const apiCreateUsers = (data: ModelCreate) => request<UserData>('post', ApiDefine.USER.CREATE, data);