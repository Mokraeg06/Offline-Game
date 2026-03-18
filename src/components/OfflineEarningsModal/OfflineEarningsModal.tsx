import { useGame } from '../../context/GameContext';
import { Modal } from '../shared/Modal';
import { formatMoney, formatDuration } from '../../utils/formatting';
import './OfflineEarningsModal.css';

export function OfflineEarningsModal() {
  const { uiState, closeModal } = useGame();
  const isOpen = uiState.activeModal === 'offline_earnings';

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="offline-modal">
        <div className="offline-modal-icon">🛒</div>
        <h2 className="offline-modal-title">Willkommen zurück!</h2>
        <p className="offline-modal-sub">
          Du warst <strong>{formatDuration(uiState.offlineEarningsDurationMs)}</strong> offline
        </p>
        <div className="offline-modal-amount">
          <span className="offline-modal-amount-label">Verdient während Abwesenheit</span>
          <span className="offline-modal-amount-value">
            💰 {formatMoney(uiState.offlineEarningsAmount)}
          </span>
        </div>
        <button className="offline-modal-btn" onClick={closeModal}>
          Einsammeln! 🎉
        </button>
      </div>
    </Modal>
  );
}
