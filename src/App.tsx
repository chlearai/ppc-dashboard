import { useState } from 'react';
import { ArrowUpRight, Bell, CheckCircle2, Command, PanelLeft } from 'lucide-react';
import { CampaignArchitect } from './components/CampaignArchitect';
import { OperatorDashboard } from './components/OperatorDashboard';
import { navItems } from './data/strategy';

function App() {
  const [activeModule, setActiveModule] = useState('Campaign Architect');

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Command size={20} />
          </div>
          <div>
            <strong>AI PPC Operator</strong>
            <span>Google Ads + Meta Ads</span>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.label;

            return (
              <button
                className={isActive ? 'nav-item active' : 'nav-item'}
                key={item.label}
                onClick={() => setActiveModule(item.label)}
                type="button"
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="native-setup">
          <p>Native setup model</p>
          <span>Accounts stay configured inside Google Ads and Meta Ads. This app plans, reviews, and approves.</span>
        </div>
      </aside>

      <section className="main-stage">
        <header className="topbar">
          <button className="icon-button" type="button" aria-label="Collapse sidebar">
            <PanelLeft size={18} />
          </button>

          <div className="page-title">
            <p>Professional campaign planning and optimization</p>
            <h1>{activeModule}</h1>
          </div>

          <div className="top-actions">
            <span className="sync-pill">
              <CheckCircle2 size={16} />
              Approval mode on
            </span>
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button type="button">
              Open build guide
              <ArrowUpRight size={16} />
            </button>
          </div>
        </header>

        <nav className="mobile-module-switcher" aria-label="Mobile module navigation">
          {navItems.map((item) => (
            <button
              className={activeModule === item.label ? 'active' : ''}
              key={item.label}
              onClick={() => setActiveModule(item.label)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {activeModule === 'Campaign Architect' ? <CampaignArchitect /> : <OperatorDashboard />}
      </section>
    </main>
  );
}

export default App;
