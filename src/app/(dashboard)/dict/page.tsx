'use client';

import { Badge } from '@/components/ui/badge';
import { CrudPage } from '@/components/crud';
import { dictCrudConfig } from './config';

/**
 * 字典管理页面
 * 使用通用CRUD组件实现
 */
export default function DictPage() {
  // 增强配置，添加自定义渲染函数
  const enhancedConfig = {
    ...dictCrudConfig,
    table: {
      ...dictCrudConfig.table,
      columns: dictCrudConfig.table.columns.map((column) => {
        // 为状态列添加自定义渲染
        if (column.key === 'status') {
          return {
            ...column,
            render: (value: unknown) => {
              const status = value as string;
              return (
                <Badge variant={status === '1' ? 'default' : 'secondary'}>
                  {status === '1' ? '启用' : '禁用'}
                </Badge>
              );
            },
          };
        }

        // 为数据类型列添加自定义渲染
        if (column.key === 'dataType') {
          return {
            ...column,
            render: (value: unknown) => {
              const dataType = value as number;
              return (
                <Badge variant={dataType === 0 ? 'default' : 'outline'}>
                  {dataType === 0 ? '系统' : '业务'}
                </Badge>
              );
            },
          };
        }

        return column;
      }),
    },
  };

  return <CrudPage config={enhancedConfig} />;
}
