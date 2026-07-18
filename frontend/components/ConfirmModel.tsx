"use client";
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Evet, Sil",
  cancelText = "Vazgeç",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-800 transition-colors">
        
        <h3 className="text-lg font-semibold text-[#1A1A2E] dark:text-gray-100 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#25253A] disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "İşleniyor..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;