// 业务模块统一导出
import { dictApi } from './dict';

export { dictApi };

// 统一 API 对象
export const apiModules = {
  dict: dictApi,
} as const;
