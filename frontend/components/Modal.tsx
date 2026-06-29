'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footerButtons?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footerButtons,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative z-10 w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col max-h-[85vh]',
              { 'max-w-sm': size === 'sm', 'max-w-md': size === 'md', 'max-w-xl': size === 'lg' }
            )}
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)] cursor-pointer" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 text-sm text-[var(--muted)] flex-1">{children}</div>
            {footerButtons && (
              <div className="flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] p-4 bg-[var(--surface-hover)]">
                {footerButtons}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
