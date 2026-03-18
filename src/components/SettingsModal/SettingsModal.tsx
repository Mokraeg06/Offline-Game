import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatMoney } from '../../utils/formatting';
import './SettingsModal.css';

export function SettingsScreen() {
  const { state, resetGame } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    } else {
      resetGame();
      setConfirmReset(false);
    }
  }

  return (
    <div className="settings-screen">
      <div className="settings-hero">
        <span className="settings-hero-icon">⚙️</span>
        <div>
          <h1 className="settings-hero-title">Einstellungen</h1>
          <p className="settings-hero-sub">Spielfortschritt & Infos</p>
        </div>
      </div>

      {/* Stats */}
      <div className="settings-section">
        <div className="settings-section-title">📊 Statistiken</div>
        <div className="settings-stat-row">
          <span className="settings-stat-label">Gesamtverdienst</span>
          <span className="settings-stat-val">{formatMoney(state.totalEarned)}</span>
        </div>
        <div className="settings-stat-row">
          <span className="settings-stat-label">Aktuelles Guthaben</span>
          <span className="settings-stat-val">{formatMoney(state.money)}</span>
        </div>
        <div className="settings-stat-row">
          <span className="settings-stat-label">Offline-Limit</span>
          <span className="settings-stat-val">{state.offlineEarningsCap}h</span>
        </div>
      </div>

      {/* How to play */}
      <div className="settings-section">
        <div className="settings-section-title">📖 So spielst du</div>
        <div className="settings-howto">
          <p>1. Stelle Mitarbeiter ein, um Kunden zu bedienen und Geld zu verdienen.</p>
          <p>2. Verbessere Abteilungen, um neue Produkte freizuschalten.</p>
          <p>3. Kaufe Forschungs-Upgrades für dauerhafte Boni.</p>
          <p>4. Das Spiel läuft auch offline weiter (bis zu {state.offlineEarningsCap} Stunden).</p>
        </div>
      </div>

      {/* Reset */}
      <div className="settings-section">
        <div className="settings-section-title">⚠️ Gefahrenzone</div>
        <button
          className={`settings-reset-btn ${confirmReset ? 'confirm' : ''}`}
          onClick={handleReset}
        >
          {confirmReset
            ? '❗ Wirklich zurücksetzen? (Nochmal tippen)'
            : '🗑 Spielstand zurücksetzen'}
        </button>
      </div>

      <div className="settings-footer">
        Idle Tankstellen Tycoon · v1.0
      </div>
    </div>
  );
}
