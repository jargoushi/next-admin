// 业务模块统一导出
import { dictApi } from './dict';
import { userApi } from './user';

export { dictApi, userApi };

// 统一 API 对象
export const apiModules = {
  dict: dictApi,
  user: userApi,
} as const;
