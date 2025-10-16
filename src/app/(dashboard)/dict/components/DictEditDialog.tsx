'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { DictType } from '@/types/dict';

interface DictEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dict?: DictType | null;
  onSubmit: (data: DictType) => Promise<void>;
  loading?: boolean;
}

export function DictEditDialog({
  open,
  onOpenChange,
  dict,
  onSubmit,
  loading = false,
}: DictEditDialogProps) {
  const [formData, setFormData] = useState<Partial<DictType>>({
    dictName: '',
    dictType: '',
    serviceName: '',
    status: '0',
    dataType: 0,
    remark: '',
  });

  // 当字典数据变化时，更新表单数据
  useEffect(() => {
    if (dict) {
      setFormData({
        dictId: dict.dictId,
        dictName: dict.dictName,
        dictType: dict.dictType,
        serviceName: dict.serviceName,
        status: dict.status,
        dataType: dict.dataType,
        remark: dict.remark || '',
        createUserNickName: dict.createUserNickName,
        updateUserNickName: dict.updateUserNickName,
      });
    } else {
      // 重置表单
      setFormData({
        dictName: '',
        dictType: '',
        serviceName: '',
        status: '0',
        dataType: 0,
        remark: '',
      });
    }
  }, [dict]);

  const handleInputChange = (field: keyof DictType, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dictName?.trim() || !formData.dictType?.trim() || !formData.serviceName?.trim()) {
      return;
    }

    try {
      // 提交数据时确保包含所有必需字段
      const submitData: DictType = {
        dictId: formData.dictId || '',
        dictName: formData.dictName || '',
        dictType: formData.dictType || '',
        serviceName: formData.serviceName || '',
        status: formData.status || '0',
        dataType: Number(formData.dataType) || 0,
        remark: formData.remark || '',
        createUserNickName: formData.createUserNickName || '',
        updateUserNickName: formData.updateUserNickName || '',
        createTime: dict?.createTime || '',
        updateTime: dict?.updateTime || '',
      };

      await onSubmit(submitData);
      onOpenChange(false);
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dict ? '编辑字典' : '新增字典'}</DialogTitle>
          <DialogDescription>
            {dict ? '修改字典类型配置信息' : '创建新的字典类型配置'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dictName" className="text-right">
                字典名称
              </Label>
              <Input
                id="dictName"
                value={formData.dictName || ''}
                onChange={(e) => handleInputChange('dictName', e.target.value)}
                className="col-span-3"
                placeholder="请输入字典名称"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dictType" className="text-right">
                字典类型
              </Label>
              <Input
                id="dictType"
                value={formData.dictType || ''}
                onChange={(e) => handleInputChange('dictType', e.target.value)}
                className="col-span-3"
                placeholder="请输入字典类型"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceName" className="text-right">
                服务名称
              </Label>
              <Input
                id="serviceName"
                value={formData.serviceName || ''}
                onChange={(e) => handleInputChange('serviceName', e.target.value)}
                className="col-span-3"
                placeholder="请输入服务名称"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                状态
              </Label>
              <Select
                value={formData.status || '0'}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">启用</SelectItem>
                  <SelectItem value="1">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataType" className="text-right">
                数据类型
              </Label>
              <Select
                value={String(formData.dataType || 0)}
                onValueChange={(value) => handleInputChange('dataType', Number(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="请选择数据类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">系统字典</SelectItem>
                  <SelectItem value="1">业务字典</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remark" className="text-right">
                备注
              </Label>
              <Textarea
                id="remark"
                value={formData.remark || ''}
                onChange={(e) => handleInputChange('remark', e.target.value)}
                className="col-span-3"
                placeholder="请输入备注信息"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dict ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
