import type { Toast as ToastType } from '../../types';
import './Toast.css';

interface Props {
  toasts: ToastType[];
}

export function ToastContainer({ toasts }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span className="toast-emoji">{t.emoji}</span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
