import { useGame, useDepartmentEarnings } from '../../context/GameContext';
import { ProgressBar } from '../shared/ProgressBar';
import { formatMoney } from '../../utils/formatting';
import type { DepartmentId } from '../../types';
import { DEPARTMENTS } from '../../data/departments';
import './DepartmentCard.css';

interface Props {
  departmentId: DepartmentId;
}

export function DepartmentCard({ departmentId }: Props) {
  const { dispatch, openDepartment, state } = useGame();
  const earn = useDepartmentEarnings(departmentId);
  const def = DEPARTMENTS[departmentId];
  const deptState = state.departments[departmentId];

  const canHire = deptState.employees < earn.maxEmployees && state.money >= earn.hireCost;
  const atMax = deptState.employees >= earn.maxEmployees;

  function onHire(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch({ type: 'HIRE_EMPLOYEE', payload: { departmentId } });
  }

  return (
    <div
      className="dept-card"
      style={{ borderLeftColor: def.color }}
      onClick={() => openDepartment(departmentId)}
    >
      <div className="dept-card-top">
        <span className="dept-card-emoji">{earn.currentProduct.emoji}</span>
        <div className="dept-card-info">
          <div className="dept-card-name">{def.name}</div>
          <div className="dept-card-product">{earn.currentProduct.name}</div>
        </div>
        <div className="dept-card-level" style={{ background: def.color }}>
          Lv.{deptState.level}
        </div>
      </div>

      <div className="dept-card-earnings">
        <span className="dept-card-money">{formatMoney(earn.moneyPerMinute)}/min</span>
      </div>

      <ProgressBar
        value={deptState.employees}
        max={earn.maxEmployees}
        color={def.color}
        height={5}
      />

      <div className="dept-card-bottom">
        <span className="dept-card-emp">
          👥 {deptState.employees}/{earn.maxEmployees}
        </span>
        <button
          className="dept-hire-btn"
          disabled={!canHire}
          onClick={onHire}
          style={canHire ? { background: def.color } : undefined}
        >
          {atMax ? 'Max' : `+1 💰${formatMoney(earn.hireCost)}`}
        </button>
      </div>
    </div>
  );
}
