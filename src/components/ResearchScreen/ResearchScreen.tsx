import { useGame } from '../../context/GameContext';
import { UPGRADES } from '../../data/upgrades';
import { DEPARTMENTS, DEPARTMENT_IDS } from '../../data/departments';
import { formatMoney } from '../../utils/formatting';
import type { DepartmentId } from '../../types';
import './ResearchScreen.css';

export function ResearchScreen() {
  const { state, dispatch } = useGame();

  function isPurchased(upgradeId: string, deptId: DepartmentId | 'global'): boolean {
    if (deptId === 'global') {
      return state.globalUpgrades.some(u => u.upgradeId === upgradeId && u.purchased);
    }
    return state.departments[deptId]?.upgrades.some(u => u.upgradeId === upgradeId && u.purchased) ?? false;
  }

  function isUnlocked(upgradeId: string, deptId: DepartmentId | 'global'): boolean {
    const upg = UPGRADES.find(u => u.id === upgradeId);
    if (!upg?.requiresUpgradeId) return true;
    return isPurchased(upg.requiresUpgradeId, deptId);
  }

  function renderSection(deptId: DepartmentId | 'global') {
    const sectionUpgrades = UPGRADES.filter(u => u.departmentId === deptId);
    if (sectionUpgrades.length === 0) return null;

    const def = deptId !== 'global' ? DEPARTMENTS[deptId] : null;
    const sectionName = deptId === 'global' ? '🌍 Global' : `${def!.emoji} ${def!.name}`;
    const sectionColor = deptId === 'global' ? '#f59e0b' : def!.color;

    return (
      <div key={deptId} className="research-section">
        <div className="research-section-title" style={{ borderLeftColor: sectionColor }}>
          {sectionName}
        </div>
        {sectionUpgrades.map(upg => {
          const purchased = isPurchased(upg.id, deptId);
          const unlocked = isUnlocked(upg.id, deptId);
          const canAfford = state.money >= upg.cost;
          const canBuy = !purchased && unlocked && canAfford;

          return (
            <div
              key={upg.id}
              className={`research-card ${purchased ? 'purchased' : ''} ${!unlocked ? 'locked' : ''}`}
            >
              <div className="research-card-info">
                <div className="research-card-name">
                  {purchased && <span className="research-check">✓ </span>}
                  {upg.name}
                </div>
                <div className="research-card-desc">{upg.description}</div>
                {!unlocked && upg.requiresUpgradeId && (
                  <div className="research-card-req">
                    🔒 Benötigt: {UPGRADES.find(u => u.id === upg.requiresUpgradeId)?.name}
                  </div>
                )}
              </div>
              <div className="research-card-right">
                {purchased ? (
                  <div className="research-card-done">Gekauft</div>
                ) : (
                  <button
                    className="research-buy-btn"
                    disabled={!canBuy}
                    onClick={() => dispatch({ type: 'PURCHASE_UPGRADE', payload: { upgradeId: upg.id } })}
                    style={canBuy ? { background: sectionColor } : undefined}
                  >
                    {formatMoney(upg.cost)}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="research-screen">
      <div className="research-hero">
        <div className="research-hero-icon">🔬</div>
        <div>
          <h1 className="research-hero-title">Forschung</h1>
          <p className="research-hero-sub">Verbessere deine Abteilungen dauerhaft</p>
        </div>
      </div>
      {DEPARTMENT_IDS.map(id => renderSection(id))}
      {renderSection('global')}
    </div>
  );
}
