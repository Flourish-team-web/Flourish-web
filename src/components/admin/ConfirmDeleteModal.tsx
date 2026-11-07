'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  itemType?: string;
  message?: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType = 'item',
  message,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  const displayTitle = title || `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;
  const displayMessage =
    message ||
    (itemName
      ? `Are you sure you want to permanently delete "${itemName}"? This action cannot be undone.`
      : `Are you sure you want to permanently delete this ${itemType}? This action cannot be undone.`);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isDeleting && onClose()}
      title={displayTitle}
      className="max-w-md w-full bg-white border border-[#E2E8F0] shadow-2xl p-6 rounded-2xl"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3.5 p-3.5 bg-rose-50/80 border border-rose-200/80 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs text-[#475569] leading-relaxed pt-0.5">
            <p className="font-medium text-[#0F172A] mb-1">Permanent Deletion Warning</p>
            <p>{displayMessage}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F1F5F9]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-60 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/25 transition-all cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

