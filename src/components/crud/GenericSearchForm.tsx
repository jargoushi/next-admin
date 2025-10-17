'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Search, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { SearchField } from '@/types/crud';
import { cn } from '@/lib/utils';

interface GenericSearchFormProps {
  fields: SearchField[];
  defaultParams?: Record<string, unknown>;
  onSearch: (params: Record<string, unknown>) => void;
  onReset?: () => void;
  loading?: boolean;
  collapsed?: boolean;
  collapsible?: boolean;
  className?: string;
  span?: number;
}

/**
 * 通用搜索表单组件
 * 支持多种字段类型和动态布局
 */
export function GenericSearchForm({
  fields,
  defaultParams = {},
  onSearch,
  onReset,
  loading = false,
  collapsed = false,
  collapsible = false,
  className = '',
  span = 3,
}: GenericSearchFormProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [formData, setFormData] = useState<Record<string, unknown>>(defaultParams);

  // 生成表单验证schema
  const generateSchema = useCallback(() => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny = z.any();

      // 根据字段类型设置schema
      switch (field.type) {
        case 'input':
          fieldSchema = z.string().optional();
          break;
        case 'select':
          fieldSchema = z.string().optional();
          break;
        case 'number':
          fieldSchema = z.number().optional();
          break;
        case 'daterange':
          fieldSchema = z.array(z.string()).optional();
          break;
        default:
          fieldSchema = z.any().optional();
      }

      // 应用验证规则
      if (field.rules && field.rules.length > 0) {
        field.rules.forEach((rule) => {
          if (rule.required) {
            fieldSchema = z.string().min(1, `${field.label}不能为空`);
          }
        });
      }

      schemaFields[field.name] = fieldSchema;
    });

    return z.object(schemaFields);
  }, [fields]);

  const formSchema = generateSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultParams,
  });

  // 同步外部状态变化到表单
  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  // 处理字段值变化
  const handleFieldChange = useCallback((fieldName: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  // 提交搜索
  const handleSearch = useCallback(
    (values: Record<string, unknown>) => {
      // 处理特殊值，例如空字符串转换为undefined
      const searchParams = Object.entries(values).reduce(
        (acc, [key, value]) => {
          if (value === '' || value === null || value === undefined) {
            // 跳过空值
            return acc;
          }
          if (key === 'status' && value === 'all') {
            // 状态字段特殊处理
            return acc;
          }
          acc[key] = value;
          return acc;
        },
        {} as Record<string, unknown>
      );

      onSearch(searchParams);
    },
    [onSearch]
  );

  // 重置表单
  const handleReset = useCallback(() => {
    form.reset(defaultParams);
    setFormData(defaultParams);
    onReset?.();
  }, [form, defaultParams, onReset]);

  // 渲染表单字段
  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'input':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-1', `col-span-${field.span || span}`)}>
                <FormLabel className="text-sm">{field.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.placeholder || `请输入${field.label}`}
                    disabled={field.disabled || loading}
                    value={(formField.value as string) || ''}
                    onChange={(e) => {
                      formField.onChange(e);
                      handleFieldChange(field.name, e.target.value);
                    }}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-1', `col-span-${field.span || span}`)}>
                <FormLabel className="text-sm">{field.label}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    formField.onChange(value);
                    handleFieldChange(field.name, value);
                  }}
                  value={(formField.value as string) || ''}
                  disabled={field.disabled || loading}
                >
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={field.placeholder || `请选择${field.label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-1', `col-span-${field.span || span}`)}>
                <FormLabel className="text-sm">{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={field.placeholder || `请输入${field.label}`}
                    disabled={field.disabled || loading}
                    value={(formField.value as number) || ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined;
                      formField.onChange(value);
                      handleFieldChange(field.name, value);
                    }}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  // 过滤可见字段
  const visibleFields = fields.filter((field) => field.visible !== false);
  const displayFields = isCollapsed && collapsible ? visibleFields.slice(0, span) : visibleFields;

  return (
    <Card className={cn('p-4', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {displayFields.map(renderField)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} size="sm">
                <Search className="mr-2 h-4 w-4" />
                搜索
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                size="sm"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                重置
              </Button>
            </div>

            {collapsible && visibleFields.length > span && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-muted-foreground h-8 px-2"
              >
                {isCollapsed ? (
                  <>
                    展开更多
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    收起
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
}
