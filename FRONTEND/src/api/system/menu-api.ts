import type { MenuResult } from '../../interface/layout/menu.interface';
import type { Notice } from '@/interface/layout/notice.interface';
import type { AxiosRequestConfig } from 'axios';
import { request } from '../request-configuration';
import { ApiDefine } from '../define-api';

export const getMenuAll = (config: AxiosRequestConfig = {}) => request<MenuResult>('get', ApiDefine.MENU.GET_ALL, {}, config);

export const getMenuByUser = (config: AxiosRequestConfig = {}) => request<MenuResult>('get', ApiDefine.MENU.GET_BY_USER, {}, config);

export const getNoticeList = (config: AxiosRequestConfig = {}) => request<Notice[]>('get', ApiDefine.NOTICE, {}, config);
