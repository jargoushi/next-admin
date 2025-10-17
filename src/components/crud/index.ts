// 导出所有CRUD相关组件和类型
export { CrudPage } from './CrudPage';
export { GenericTable } from './GenericTable';
export { GenericSearchForm } from './GenericSearchForm';
export { GenericEditDialog } from './GenericEditDialog';
export { GenericPagination } from './GenericPagination';
export { useCrud } from '@/hooks/useCrud';

// 导出类型
export type {
  CrudConfig,
  TableColumn,
  SearchField,
  EditField,
  CrudState,
  CrudActions,
  UseCrudReturn,
} from '@/types/crud';
