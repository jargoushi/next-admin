'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, RotateCcw } from 'lucide-react';
import type { DictTypeParams } from '../types/dict';

interface DictSearchProps {
  onSearch: (params: DictTypeParams) => void;
  loading?: boolean;
}

export function DictSearch({ onSearch, loading = false }: DictSearchProps) {
  const [searchParams, setSearchParams] = useState<DictTypeParams>({
    dictName: '',
    dictType: '',
    status: 'all',
    serviceName: '',
    dataType: '0',
  });

  const handleInputChange = (field: keyof DictTypeParams, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    // 过滤掉空值参数
    const filteredParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key as keyof DictTypeParams] = value;
      }
      return acc;
    }, {} as DictTypeParams);

    onSearch(filteredParams);
  };

  const handleReset = () => {
    const defaultParams = {
      dictName: '',
      dictType: '',
      status: 'all',
      serviceName: '',
      dataType: '0',
    };
    setSearchParams(defaultParams);
    onSearch({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>字典搜索</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">字典名称</label>
            <Input
              placeholder="请输入字典名称"
              value={searchParams.dictName || ''}
              onChange={(e) => handleInputChange('dictName', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">字典类型</label>
            <Input
              placeholder="请输入字典类型"
              value={searchParams.dictType || ''}
              onChange={(e) => handleInputChange('dictType', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">状态</label>
            <Select
              value={searchParams.status || 'all'}
              onValueChange={(value) => handleInputChange('status', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="0">启用</SelectItem>
                <SelectItem value="1">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">服务名称</label>
            <Input
              placeholder="请输入服务名称"
              value={searchParams.serviceName || ''}
              onChange={(e) => handleInputChange('serviceName', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">数据类型</label>
            <Select
              value={searchParams.dataType || '0'}
              onValueChange={(value) => handleInputChange('dataType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择数据类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">系统字典</SelectItem>
                <SelectItem value="1">业务字典</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            搜索
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
