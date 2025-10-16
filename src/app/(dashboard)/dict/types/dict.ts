// 字典管理相关类型定义

// 字典类型查询参数
export interface DictTypeParams {
  dictName?: string;
  dictType?: string;
  status?: string;
  serviceName?: string;
  dataType?: string;
}

// 字典类型实体
export interface DictType {
  dictId: string;
  serviceName: string;
  dictName: string;
  dictType: string;
  status: string;
  createUserNickName: string;
  createTime: string;
  updateUserNickName?: string;
  updateTime?: string;
  remark?: string;
  dataType: number;
}

// 字典类型列表响应
export interface DictTypeListResponse {
  records: DictType[];
  total: string;
  size: string;
  current: string;
  pages: string;
}

// 字典类型分页查询请求
export interface DictTypePageRequest {
  params: DictTypeParams;
  current: number;
  size: number;
}

// 字典类型分页查询响应
export interface DictTypePageResponse {
  data: DictTypeListResponse;
  code: number;
  serviceCode: string;
  msg: string;
}
