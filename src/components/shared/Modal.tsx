import React, { useEffect } from 'react';
import './Modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  slideUp?: boolean;
}

export function Modal({ isOpen, onClose, children, slideUp = false }: Props) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-panel ${slideUp ? 'modal-slide-up' : 'modal-center'}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
