import type { CrudConfig, ApiResponse } from '@/types/crud';
import type { DictType, DictTypePageResponse } from '@/types/dict';
import { dictApi } from '@/lib/api/modules/dict';

/**
 * 字典管理模块CRUD配置
 */

// 适配器函数：将 DictTypePageResponse 转换为 ApiResponse<DictType[]>
const adaptDictResponse = (response: DictTypePageResponse): ApiResponse<DictType[]> => {
  // 检查响应结构
  if (!response || !response.data) {
    return {
      code: -1,
      message: '响应格式错误',
      data: [],
      success: false,
    };
  }

  // 提取数据和分页信息
  const records = response.data.data?.records || [];
  const total = response.data.data?.total || '0';

  // 创建包含分页信息的响应
  const result = {
    code: response.code || 200,
    message: response.msg || 'success',
    data: records,
    success: response.code === 200,
    // 添加分页元数据
    total: Number(total) || records.length,
  };

  return result;
};

// 适配器函数：安全地转换 Partial<DictType> 到 dictApi.create 需要的参数类型
const adaptCreateParams = (data: Partial<DictType>) => {
  // 确保必需字段存在
  return {
    serviceName: data.serviceName || '',
    dictName: data.dictName || '',
    dictType: data.dictType || '',
    status: data.status || '1',
    createUserNickName: data.createUserNickName || '',
    dataType: data.dataType || 0,
    remark: data.remark,
  };
};
export const dictCrudConfig: CrudConfig<DictType> = {
  title: '字典管理',

  // API配置
  api: {
    getList: async (params) => {
      const response = await dictApi.getPageList(params);
      return adaptDictResponse(response);
    },
    create: async (data) => {
      const createParams = adaptCreateParams(data);
      const result = await dictApi.create(createParams);
      return {
        code: result.code,
        message: result.msg,
        data: { ...createParams, dictId: result.data || '' } as DictType, // 返回创建的数据作为 DictType
        success: result.code === 200,
      };
    },
    update: async (id, data) => {
      const result = await dictApi.update(id as string, data);
      return {
        code: result.code,
        message: result.msg,
        data: { ...data, dictId: id } as DictType, // 返回更新后的数据
        success: result.code === 200,
      };
    },
    delete: async (id) => {
      const result = await dictApi.delete(id as string);
      return {
        code: result.code,
        message: result.msg,
        data: true, // 删除操作返回布尔值
        success: result.code === 200,
      };
    },
  },

  // 表格配置
  table: {
    rowKey: 'dictId',
    showSelection: true,
    showIndex: true,
    columns: [
      {
        key: 'dictName',
        title: '字典名称',
        dataIndex: 'dictName',
        width: 200,
      },
      {
        key: 'dictType',
        title: '字典类型',
        dataIndex: 'dictType',
        width: 180,
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 100,
        align: 'center' as const,
      },
      {
        key: 'serviceName',
        title: '服务名称',
        dataIndex: 'serviceName',
        width: 150,
      },
      {
        key: 'dataType',
        title: '数据类型',
        dataIndex: 'dataType',
        width: 100,
        align: 'center' as const,
      },
      {
        key: 'createUserNickName',
        title: '创建人',
        dataIndex: 'createUserNickName',
        width: 120,
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        width: 160,
      },
    ],
  },

  // 搜索表单配置
  search: {
    fields: [
      {
        name: 'dictName',
        label: '字典名称',
        type: 'input',
        placeholder: '请输入字典名称',
      },
      {
        name: 'dictType',
        label: '字典类型',
        type: 'input',
        placeholder: '请输入字典类型',
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        placeholder: '请选择状态',
        defaultValue: 'all',
        options: [
          { label: '全部', value: 'all' },
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' },
        ],
      },
      {
        name: 'serviceName',
        label: '服务名称',
        type: 'input',
        placeholder: '请输入服务名称',
      },
      {
        name: 'dataType',
        label: '数据类型',
        type: 'select',
        placeholder: '请选择数据类型',
        defaultValue: '0',
        options: [
          { label: '系统字典', value: '0' },
          { label: '业务字典', value: '1' },
        ],
      },
    ],
    defaultParams: {
      dictName: '',
      dictType: '',
      status: 'all',
      serviceName: '',
      dataType: '0',
    },
  },

  // 编辑表单配置
  edit: {
    fields: [
      {
        name: 'dictName',
        label: '字典名称',
        type: 'input',
        placeholder: '请输入字典名称',
        required: true,
        rules: [{ required: true, message: '字典名称不能为空' }],
      },
      {
        name: 'dictType',
        label: '字典类型',
        type: 'input',
        placeholder: '请输入字典类型',
        required: true,
        rules: [{ required: true, message: '字典类型不能为空' }],
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        placeholder: '请选择状态',
        defaultValue: '1',
        required: true,
        options: [
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' },
        ],
      },
      {
        name: 'serviceName',
        label: '服务名称',
        type: 'input',
        placeholder: '请输入服务名称',
        required: true,
        rules: [{ required: true, message: '服务名称不能为空' }],
      },
      {
        name: 'dataType',
        label: '数据类型',
        type: 'select',
        placeholder: '请选择数据类型',
        defaultValue: 0,
        required: true,
        options: [
          { label: '系统字典', value: 0 },
          { label: '业务字典', value: 1 },
        ],
      },
      {
        name: 'remark',
        label: '备注',
        type: 'textarea',
        placeholder: '请输入备注信息',
        span: 2,
      },
    ],
    layout: 'vertical',
  },

  // 分页配置
  pagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: true,
    pageSizeOptions: [10, 20, 50, 100],
    defaultPageSize: 10,
  },

  // 权限配置
  permissions: {
    create: true,
    edit: true,
    delete: true,
    export: false,
    import: false,
  },

  // 功能配置
  features: {
    enableSearch: true,
    enableRefresh: true,
    enableExport: false,
    enableImport: false,
    enableBatchDelete: true,
  },
};
