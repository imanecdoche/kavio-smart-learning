import React from 'react';
import DialogWrapper from './DialogWrapper';
import Button from './Button';

/**
 * Custom Confirmation Dialog
 * Replaces native window.confirm
 * Adheres to:
 * - Desktop centered modal, mobile bottom panel
 * - Single handler rule (no double close buttons)
 * - Clear distinction for destructive actions
 */
export const ConfirmDialog = ({
  isOpen,
  title = 'Confirmation Required',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <DialogWrapper isOpen={isOpen} onClose={onCancel} title={title} maxWidth="sm">
      <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
        {message}
      </p>

      {/* Action group: Equal size, fixed layout, no outline */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? 'primary' : 'primary'}
          isDestructive={isDestructive}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </DialogWrapper>
  );
};

export default ConfirmDialog;
