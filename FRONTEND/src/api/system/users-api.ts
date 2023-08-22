import type { UserData, GetDataParram } from '../../interface/user/user.interface';
import { ApiDefine } from '../define-api'
import { request } from '../request-configuration';

export const apiGetUsers = (data: GetDataParram) => request<UserData>('get', ApiDefine.USER, data);