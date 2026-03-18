import { DEPARTMENT_IDS } from '../../data/departments';
import { DepartmentCard } from './DepartmentCard';
import './DepartmentGrid.css';

export function DepartmentGrid() {
  return (
    <div className="dept-grid">
      {DEPARTMENT_IDS.map(id => (
        <DepartmentCard key={id} departmentId={id} />
      ))}
    </div>
  );
}
