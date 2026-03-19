import { useGame } from '../../context/GameContext';
import { DEPARTMENT_IDS, DEPARTMENTS } from '../../data/departments';
import { computeDepartmentEarnings } from '../../utils/earnings';
import { formatMoney } from '../../utils/formatting';
import { DepartmentCard } from './DepartmentCard';
import './DepartmentGrid.css';

export function DepartmentGrid() {
  const { state } = useGame();

  // Compute earnings for all departments to rank them + find next goal
  const allEarnings = DEPARTMENT_IDS.map(id => ({
    id,
    earn: computeDepartmentEarnings(state.departments[id], state.prestigeCount),
    deptState: state.departments[id],
  }));

  // Rank by income (highest = rank 1)
  const sorted = [...allEarnings].sort((a, b) => b.earn.moneyPerMinute - a.earn.moneyPerMinute);
  const rankMap: Record<string, number> = {};
  sorted.forEach((entry, i) => { rankMap[entry.id] = i + 1; });

  // Next goal: cheapest hire the player is working towards
  const notMaxed = allEarnings.filter(e => e.deptState.employees < e.earn.maxEmployees);
  const cheapest = notMaxed.sort((a, b) => a.earn.hireCost - b.earn.hireCost)[0];
  const deficit = cheapest ? cheapest.earn.hireCost - state.money : 0;
  const showGoal = cheapest && deficit > 0 && deficit < cheapest.earn.hireCost * 4;

  return (
    <div>
      {showGoal && (
        <div className="dept-next-goal">
          <span className="dept-next-goal-icon">💡</span>
          <span>
            Noch {formatMoney(deficit)} bis zur nächsten Einstellung bei{' '}
            <strong>{DEPARTMENTS[cheapest.id].name}</strong>
          </span>
        </div>
      )}
      <div className="dept-grid">
        {DEPARTMENT_IDS.map(id => (
          <DepartmentCard key={id} departmentId={id} rank={rankMap[id]} />
        ))}
      </div>
    </div>
  );
}
