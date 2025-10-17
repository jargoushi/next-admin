'use client';

import React, { useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: 'default' | 'destructive';
  resolve?: (value: boolean) => void;
}

/**
 * 确认对话框 Hook
 * 替换原生的 confirm 弹窗，提供更美观的 UI
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    title: '确认操作',
    description: '您确定要执行此操作吗？',
    confirmText: '确认',
    cancelText: '取消',
    variant: 'default',
  });

  const confirm = useCallback((options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: options.title || '确认操作',
        description: options.description || '您确定要执行此操作吗？',
        confirmText: options.confirmText || '确认',
        cancelText: options.cancelText || '取消',
        variant: options.variant || 'default',
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
    state.resolve?.(true);
  }, [state.resolve, state]);

  const handleCancel = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
    state.resolve?.(false);
  }, [state.resolve, state]);

  const ConfirmDialog = useCallback(() => {
    const handleOpenChange = (open: boolean) => {
      if (!open) {
        handleCancel();
      }
    };

    return React.createElement(
      AlertDialog,
      { open: state.open, onOpenChange: handleOpenChange },
      React.createElement(
        AlertDialogContent,
        null,
        React.createElement(
          AlertDialogHeader,
          null,
          React.createElement(AlertDialogTitle, null, state.title),
          React.createElement(AlertDialogDescription, null, state.description)
        ),
        React.createElement(
          AlertDialogFooter,
          null,
          React.createElement(AlertDialogCancel, null, state.cancelText),
          React.createElement(
            AlertDialogAction,
            {
              onClick: handleConfirm,
              className:
                state.variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : '',
            },
            state.confirmText
          )
        )
      )
    );
  }, [state, handleConfirm, handleCancel]);

  return {
    confirm,
    ConfirmDialog,
  };
}
