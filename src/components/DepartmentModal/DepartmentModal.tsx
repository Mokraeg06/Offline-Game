import { useGame, useDepartmentEarnings } from '../../context/GameContext';
import { Modal } from '../shared/Modal';
import { formatMoney, formatNumber } from '../../utils/formatting';
import { DEPARTMENTS } from '../../data/departments';
import './DepartmentModal.css';

export function DepartmentModal() {
  const { uiState, closeModal } = useGame();
  const isOpen = uiState.activeModal === 'department' && uiState.activeDepartmentId !== null;
  const deptId = uiState.activeDepartmentId;

  if (!deptId) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} slideUp>
      <DepartmentModalContent deptId={deptId} onClose={closeModal} />
    </Modal>
  );
}

function DepartmentModalContent({ deptId, onClose }: { deptId: import('../../types').DepartmentId; onClose: () => void }) {
  const { dispatch, state } = useGame();
  const earn = useDepartmentEarnings(deptId);
  const def = DEPARTMENTS[deptId];
  const deptState = state.departments[deptId];

  const canHire = deptState.employees < earn.maxEmployees && state.money >= earn.hireCost;
  const atMax = deptState.employees >= earn.maxEmployees;
  const canUpgrade = state.money >= earn.upgradeCost;

  return (
    <div className="dept-modal">
      {/* Header row */}
      <div className="dept-modal-header">
        <div className="dept-modal-level" style={{ background: def.color }}>
          <span className="dept-modal-level-label">LEVEL</span>
          <span className="dept-modal-level-num">{deptState.level}</span>
        </div>
        <div className="dept-modal-title">
          <h2 className="dept-modal-name">{def.name.toUpperCase()}</h2>
          <p className="dept-modal-desc">{earn.currentProduct.description}</p>
        </div>
        <button className="dept-modal-close" onClick={onClose}>✕</button>
      </div>

      {/* Product info */}
      <div className="dept-modal-product-row">
        <span className="dept-modal-product-emoji">{earn.currentProduct.emoji}</span>
        <div className="dept-modal-product-details">
          <div className="dept-modal-product-name">{earn.currentProduct.name}</div>
          <div className="dept-modal-price-row">
            <span className="dept-modal-label">GRUNDPREIS</span>
            <span className="dept-modal-price">💰 {formatMoney(earn.currentProduct.basePrice)}</span>
          </div>
          {earn.nextProduct && (
            <div className="dept-modal-next-row">
              <span className="dept-modal-label">NÄCHSTES PRODUKT</span>
              <span className="dept-modal-next-level" style={{ color: def.color }}>
                LEVEL {earn.nextProduct.unlockLevel}
              </span>
            </div>
          )}
          <div className="dept-modal-emp-row">
            <span className="dept-modal-label">MITARBEITER 👥</span>
            <span className="dept-modal-emp-count">{deptState.employees}/{earn.maxEmployees}</span>
            <span className="dept-modal-emp-mult" style={{ color: def.color }}>
              💰×{(earn.incomeMultiplier * earn.customerMultiplier).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats bars */}
      <div className="dept-modal-stats">
        <div className="dept-modal-stat dept-modal-stat-green">
          <span className="dept-modal-stat-label">GESAMTPRODUKT WERT</span>
          <span className="dept-modal-stat-val">💰 {formatMoney(earn.totalProductValue)}</span>
        </div>
        <div className="dept-modal-stat dept-modal-stat-blue">
          <span className="dept-modal-stat-label">BEDIENTE KUNDEN</span>
          <span className="dept-modal-stat-val">👥 {formatNumber(earn.effectiveCustomersPerMinute)}/min</span>
        </div>
      </div>

      {/* Hire button */}
      {!atMax && (
        <div className="dept-modal-section">
          <button
            className="dept-modal-hire-btn"
            disabled={!canHire}
            onClick={() => dispatch({ type: 'HIRE_EMPLOYEE', payload: { departmentId: deptId } })}
          >
            <span>👤 Mitarbeiter einstellen</span>
            <span className="dept-modal-hire-cost">💰 {formatMoney(earn.hireCost)}</span>
          </button>
        </div>
      )}

      {/* Upgrade button */}
      <div className="dept-modal-section">
        <button
          className="dept-modal-upgrade-btn"
          disabled={!canUpgrade}
          onClick={() => dispatch({ type: 'UPGRADE_DEPARTMENT', payload: { departmentId: deptId } })}
        >
          <div className="dept-modal-upgrade-text">
            <span className="dept-modal-upgrade-icon">⬆</span>
            <div>
              <div className="dept-modal-upgrade-title">ABTEILUNG VERBESSERN</div>
              <div className="dept-modal-upgrade-sub">
                {earn.nextProduct
                  ? `Nächstes Produkt: ${earn.nextProduct.name} (Lv.${earn.nextProduct.unlockLevel})`
                  : 'Einnahmen steigern'}
              </div>
            </div>
          </div>
          <span className="dept-modal-upgrade-cost">💰 {formatMoney(earn.upgradeCost)}</span>
        </button>
      </div>

      {/* Product timeline */}
      <div className="dept-modal-section">
        <div className="dept-modal-timeline-label">{def.name.toUpperCase()}</div>
        <div className="dept-modal-timeline">
          {def.products.map((product, i) => {
            const isUnlocked = product.unlockLevel <= deptState.level;
            const isCurrent = product.id === earn.currentProduct.id;
            const isNext = earn.nextProduct?.id === product.id;
            return (
              <div key={product.id} className="dept-modal-timeline-item">
                <div
                  className={`dept-modal-timeline-circle ${isCurrent ? 'current' : ''} ${isNext ? 'next' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
                  style={isCurrent ? { borderColor: def.color } : undefined}
                >
                  <span className="dept-modal-timeline-emoji">
                    {isUnlocked ? product.emoji : '🔒'}
                  </span>
                </div>
                <div className={`dept-modal-timeline-level ${isCurrent ? 'current-lv' : ''}`}
                  style={isCurrent ? { color: def.color } : undefined}>
                  {product.unlockLevel}
                </div>
                <div className="dept-modal-timeline-mult">
                  💰×{(product.basePrice / def.products[0].basePrice).toFixed(1)}
                </div>
                {i < def.products.length - 1 && (
                  <div className={`dept-modal-timeline-line ${isUnlocked ? 'line-unlocked' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
