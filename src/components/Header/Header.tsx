import { useRef, useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatMoney } from '../../utils/formatting';
import './Header.css';

export function Header() {
  const { state, totalIncomePerMinute } = useGame();
  const prevMoney = useRef(state.money);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (state.money !== prevMoney.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 380);
      prevMoney.current = state.money;
      return () => clearTimeout(t);
    }
  }, [state.money]);

  return (
    <header className="header">
      <div className="header-left">
        <span className="header-store-name">🏪 Supermarkt</span>
      </div>
      <div className="header-right">
        <div className={`header-money ${pulse ? 'money-pulse' : ''}`}>
          <span className="header-money-icon">💰</span>
          <span className="header-money-value">{formatMoney(state.money)}</span>
        </div>
        <div className="header-income">
          <span className="header-income-icon">📈</span>
          <span className="header-income-value">{formatMoney(totalIncomePerMinute)}/min</span>
        </div>
      </div>
    </header>
  );
}
