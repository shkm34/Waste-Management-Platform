
import React, { useEffect, useRef } from "react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean; // if true, make confirm look destructive
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Do you want to confirm?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  // prevent background scroll while modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // focus confirm button when open
  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
      onClick={onBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-2 p-3 border-t bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md bg-white border text-gray-700 hover:bg-gray-100"
          >
            {cancelText}
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-3 py-1.5 text-sm rounded-md font-medium ${
              destructive
                ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
