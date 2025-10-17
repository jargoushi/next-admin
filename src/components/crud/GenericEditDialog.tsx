'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import type { EditField } from '@/types/crud';
import { cn } from '@/lib/utils';

interface GenericEditDialogProps<T extends Record<string, unknown>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: T | null;
  fields: EditField<T>[];
  onSubmit: (data: Partial<T>) => Promise<void>;
  mode?: 'create' | 'edit';
  title?: string;
  description?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  layout?: 'horizontal' | 'vertical' | 'inline';
  className?: string;
}

/**
 * 通用编辑对话框组件
 * 支持多种字段类型和动态表单布局
 */
export function GenericEditDialog<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  record,
  fields,
  onSubmit,
  mode = 'create',
  title,
  description,
  width = 'md',
  layout = 'vertical',
  className = '',
}: GenericEditDialogProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 生成表单验证schema
  const generateSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny = z.any();

      // 根据字段类型设置schema
      switch (field.type) {
        case 'input':
        case 'textarea':
          fieldSchema = z.string().optional();
          break;
        case 'select':
        case 'radio':
          fieldSchema = z.string().optional();
          break;
        case 'number':
          fieldSchema = z.number().optional();
          break;
        case 'switch':
          fieldSchema = z.boolean().optional();
          break;
        default:
          fieldSchema = z.any().optional();
      }

      // 应用验证规则
      if (field.rules && field.rules.length > 0) {
        field.rules.forEach((rule) => {
          if (rule.required) {
            if (field.type === 'number') {
              fieldSchema = z.number().refine((val) => val !== undefined && !isNaN(val), {
                message: `${field.label}必须是数字`,
              });
            } else {
              fieldSchema = z.string().min(1, `${field.label}不能为空`);
            }
          }
          if (rule.min && (field.type === 'input' || field.type === 'textarea')) {
            fieldSchema = (fieldSchema as z.ZodString).min(
              rule.min,
              `${field.label}至少${rule.min}个字符`
            );
          }
          if (rule.max && (field.type === 'input' || field.type === 'textarea')) {
            fieldSchema = (fieldSchema as z.ZodString).max(
              rule.max,
              `${field.label}最多${rule.max}个字符`
            );
          }
          if (rule.min && field.type === 'number') {
            fieldSchema = (fieldSchema as z.ZodNumber).min(
              rule.min,
              `${field.label}不能小于${rule.min}`
            );
          }
          if (rule.max && field.type === 'number') {
            fieldSchema = (fieldSchema as z.ZodNumber).max(
              rule.max,
              `${field.label}不能大于${rule.max}`
            );
          }
          if (rule.pattern && (field.type === 'input' || field.type === 'textarea')) {
            fieldSchema = (fieldSchema as z.ZodString).regex(
              rule.pattern,
              `${field.label}格式不正确`
            );
          }
        });
      }

      schemaFields[field.name as string] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const formSchema = generateSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  // 当record变化时重置表单
  useEffect(() => {
    if (open) {
      const defaultValues = fields.reduce(
        (acc, field) => {
          const fieldName = field.name as string;
          const value = record?.[fieldName] ?? field.defaultValue;
          acc[fieldName] = value;
          return acc;
        },
        {} as Record<string, unknown>
      );

      form.reset(defaultValues);
    }
  }, [open, record, fields, form]);

  // 提交表单
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values as Partial<T>);
      // 成功后由父组件关闭对话框
    } catch {
      // 错误已经在上层处理，这里不需要额外处理
    } finally {
      setIsSubmitting(false);
    }
  };

  // 获取对话框宽度样式
  const getWidthClass = () => {
    switch (width) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-3xl';
      case '2xl':
        return 'max-w-4xl';
      default:
        return 'max-w-lg';
    }
  };

  // 渲染表单字段
  const renderField = (field: EditField<T>) => {
    if (field.visible === false) {
      return null;
    }

    const formFieldName = field.name as string;

    switch (field.type) {
      case 'input':
        return (
          <FormField
            key={formFieldName}
            control={form.control}
            name={formFieldName}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-2', `col-span-${field.span || 1}`)}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.placeholder || `请输入${field.label}`}
                    disabled={field.disabled || isSubmitting}
                    value={(formField.value as string) || ''}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                {field.rules?.find((rule) => rule.message) && (
                  <FormDescription>
                    {field.rules.find((rule) => rule.message)?.message}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <FormField
            key={formFieldName}
            control={form.control}
            name={formFieldName}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-2', `col-span-${field.span || 1}`)}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder || `请输入${field.label}`}
                    disabled={field.disabled || isSubmitting}
                    rows={4}
                    value={(formField.value as string) || ''}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                {field.rules?.find((rule) => rule.message) && (
                  <FormDescription>
                    {field.rules.find((rule) => rule.message)?.message}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={formFieldName}
            control={form.control}
            name={formFieldName}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-2', `col-span-${field.span || 1}`)}>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  value={(formField.value as string) || ''}
                  disabled={field.disabled || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
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
                {field.rules?.find((rule) => rule.message) && (
                  <FormDescription>
                    {field.rules.find((rule) => rule.message)?.message}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <FormField
            key={formFieldName}
            control={form.control}
            name={formFieldName}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-2', `col-span-${field.span || 1}`)}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={field.placeholder || `请输入${field.label}`}
                    disabled={field.disabled || isSubmitting}
                    value={(formField.value as number) || ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined;
                      formField.onChange(value);
                    }}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                {field.rules?.find((rule) => rule.message) && (
                  <FormDescription>
                    {field.rules.find((rule) => rule.message)?.message}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'switch':
        return (
          <FormField
            key={formFieldName}
            control={form.control}
            name={formFieldName}
            render={({ field: formField }) => (
              <FormItem
                className={cn(
                  'flex flex-row items-center justify-between rounded-lg border p-4',
                  `col-span-${field.span || 1}`
                )}
              >
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{field.label}</FormLabel>
                  {field.rules?.find((rule) => rule.message) && (
                    <FormDescription>
                      {field.rules.find((rule) => rule.message)?.message}
                    </FormDescription>
                  )}
                </div>
                <FormControl>
                  <Switch
                    checked={(formField.value as boolean) || false}
                    onCheckedChange={formField.onChange}
                    disabled={field.disabled || isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'radio':
        return (
          <FormField
            key={formFieldName}
            control={form.control}
            name={formFieldName}
            render={({ field: formField }) => (
              <FormItem className={cn('space-y-3', `col-span-${field.span || 1}`)}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    value={(formField.value as string) || ''}
                    disabled={field.disabled || isSubmitting}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option) => (
                      <div key={String(option.value)} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={String(option.value)}
                          id={`${formFieldName}-${option.value}`}
                        />
                        <Label htmlFor={`${formFieldName}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.rules?.find((rule) => rule.message) && (
                  <FormDescription>
                    {field.rules.find((rule) => rule.message)?.message}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        // 自定义渲染
        if (field.render) {
          return (
            <FormField
              key={formFieldName}
              control={form.control}
              name={formFieldName}
              render={({ field: formField }) => (
                <FormItem className={cn('space-y-2', `col-span-${field.span || 1}`)}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {field.render?.(formField.value, record || ({} as T), form)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }
        return null;
    }
  };

  // 过滤可见字段
  const visibleFields = fields.filter((field) => field.visible !== false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(getWidthClass(), className)}>
        <DialogHeader>
          <DialogTitle>{title || (mode === 'create' ? '新建' : '编辑')}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div
              className={cn('grid gap-4', layout === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1')}
            >
              {visibleFields.map(renderField)}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? '创建' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
