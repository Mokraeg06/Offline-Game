import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatMoney } from '../../utils/formatting';
import { getCurrentVersion } from '../../utils/version';
import { ACHIEVEMENTS } from '../../data/achievements';
import { DEPARTMENTS, DEPARTMENT_IDS } from '../../data/departments';
import { computeDepartmentEarnings } from '../../utils/earnings';
import { PRESTIGE_THRESHOLD } from '../../store/gameState';
import './SettingsModal.css';

export function SettingsScreen() {
  const { state, resetGame, prestige } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmPrestige, setConfirmPrestige] = useState(false);

  const prestigeThreshold = PRESTIGE_THRESHOLD * Math.pow(state.prestigeCount + 1, 1.5);
  const canPrestige = state.totalEarned >= prestigeThreshold;
  const prestigeBonus = Math.round((state.prestigeCount + 1) * 15);
  const currentBonus = Math.round(state.prestigeCount * 15);

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    } else {
      resetGame();
      setConfirmReset(false);
    }
  }

  function handlePrestige() {
    if (!confirmPrestige) {
      setConfirmPrestige(true);
      setTimeout(() => setConfirmPrestige(false), 3000);
    } else {
      prestige();
      setConfirmPrestige(false);
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
        {state.prestigeCount > 0 && (
          <div className="settings-stat-row">
            <span className="settings-stat-label">Prestige-Level</span>
            <span className="settings-stat-val settings-prestige-val">✨ {state.prestigeCount} (+{currentBonus}%)</span>
          </div>
        )}
      </div>

      {/* Einnahmen-Übersicht */}
      <div className="settings-section">
        <div className="settings-section-title">💹 Einnahmen-Übersicht</div>
        {DEPARTMENT_IDS.map(id => {
          const def = DEPARTMENTS[id];
          const earn = computeDepartmentEarnings(state.departments[id], state.prestigeCount);
          const totalIncome = DEPARTMENT_IDS.reduce((sum, did) =>
            sum + computeDepartmentEarnings(state.departments[did], state.prestigeCount).moneyPerMinute, 0);
          const pct = totalIncome > 0 ? earn.moneyPerMinute / totalIncome : 0;
          return (
            <div key={id} className="settings-income-row">
              <span className="settings-income-emoji">{def.emoji}</span>
              <span className="settings-income-name">{def.name}</span>
              <div className="settings-income-bar-wrap">
                <div
                  className="settings-income-bar"
                  style={{ width: `${pct * 100}%`, background: def.color }}
                />
              </div>
              <span className="settings-income-val">{formatMoney(earn.moneyPerMinute)}/min</span>
            </div>
          );
        })}
      </div>

      {/* Prestige */}
      <div className="settings-section">
        <div className="settings-section-title">✨ Prestige</div>
        <p className="settings-prestige-desc">
          {canPrestige
            ? `Bereit für Prestige! Alles wird zurückgesetzt, aber du erhältst +${prestigeBonus}% globale Einnahmen dauerhaft.`
            : `Verdiene insgesamt ${formatMoney(prestigeThreshold)} um Prestige freizuschalten. (Noch ${formatMoney(prestigeThreshold - state.totalEarned)} fehlen)`}
        </p>
        {canPrestige && (
          <button
            className={`settings-prestige-btn ${confirmPrestige ? 'confirm' : ''}`}
            onClick={handlePrestige}
          >
            {confirmPrestige
              ? `❗ Wirklich Prestige? Alles wird zurückgesetzt!`
              : `✨ Prestige durchführen (+${prestigeBonus}% Einnahmen)`}
          </button>
        )}
      </div>

      {/* Achievements */}
      <div className="settings-section">
        <div className="settings-section-title">🏆 Erfolge ({state.achievements.length}/{ACHIEVEMENTS.length})</div>
        <div className="settings-achievements-grid">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = state.achievements.includes(ach.id);
            return (
              <div key={ach.id} className={`settings-achievement ${unlocked ? 'unlocked' : 'locked'}`}>
                <span className="settings-achievement-emoji">{unlocked ? ach.emoji : '🔒'}</span>
                <div className="settings-achievement-info">
                  <div className="settings-achievement-name">{ach.name}</div>
                  <div className="settings-achievement-desc">{ach.description}</div>
                </div>
              </div>
            );
          })}
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
          <p>5. Führe Prestige durch um dauerhafte Einnahmen-Multiplikatoren zu erhalten.</p>
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
        Idle Tankstellen Tycoon · v{getCurrentVersion()}
      </div>
    </div>
  );
}
