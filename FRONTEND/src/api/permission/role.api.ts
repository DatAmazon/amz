import type { GetRoleResult } from '@/interface/permission/role.interface';

import { request } from '../request-configuration';

/** get role list api */
export const apiGetRoleList = () => request<GetRoleResult>('get', '/permission/role');
