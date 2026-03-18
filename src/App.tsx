import './App.css';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header/Header';
import { DepartmentGrid } from './components/DepartmentGrid/DepartmentGrid';
import { DepartmentModal } from './components/DepartmentModal/DepartmentModal';
import { ResearchScreen } from './components/ResearchScreen/ResearchScreen';
import { SettingsScreen } from './components/SettingsModal/SettingsModal';
import { OfflineEarningsModal } from './components/OfflineEarningsModal/OfflineEarningsModal';
import './components/NavBar/NavBar.css';

function GameUI() {
  const { uiState, setUIState } = useGame();
  const { activeTab } = uiState;

  return (
    <>
      <Header />

      <main className="app-content">
        {activeTab === 'store'    && <DepartmentGrid />}
        {activeTab === 'research' && <ResearchScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Bottom nav */}
      <nav className="navbar">
        <button
          className={`navbar-btn ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => setUIState(prev => ({ ...prev, activeTab: 'store' }))}
        >
          <span className="navbar-icon">🏪</span>
          <span className="navbar-label">Shop</span>
        </button>
        <button
          className={`navbar-btn ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => setUIState(prev => ({ ...prev, activeTab: 'research' }))}
        >
          <span className="navbar-icon">🔬</span>
          <span className="navbar-label">Forschung</span>
        </button>
        <button
          className={`navbar-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setUIState(prev => ({ ...prev, activeTab: 'settings' }))}
        >
          <span className="navbar-icon">⚙️</span>
          <span className="navbar-label">Einstellungen</span>
        </button>
      </nav>

      {/* Modals */}
      <DepartmentModal />
      <OfflineEarningsModal />
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}

export default App;
