import type { LoginParams, LoginResult, LogoutParams, LogoutResult } from '../../interface/user/login.interface';
import { ApiDefine } from '../define-api'
import { request } from '../request-configuration';

export const apiLogin = (data: LoginParams) => request<LoginResult>('post', ApiDefine.LOG_IN, data);
export const apiLogout = (data: LogoutParams) => request<LogoutResult>('post', ApiDefine.LOG_OUT, data);