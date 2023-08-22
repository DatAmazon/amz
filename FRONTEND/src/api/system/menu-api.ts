import type { MenuResult } from '../../interface/layout/menu.interface';
import type { Notice } from '@/interface/layout/notice.interface';
import type { AxiosRequestConfig } from 'axios';
import { request } from '../request-configuration';
import { ApiDefine } from '../define-api';


export const getMenuList = (config: AxiosRequestConfig = {}) => request<MenuResult>('get', ApiDefine.MENU, {}, config);

export const getNoticeList = (config: AxiosRequestConfig = {}) => request<Notice[]>('get', ApiDefine.NOTICE, {}, config);
