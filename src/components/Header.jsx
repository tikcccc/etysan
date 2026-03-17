const navItems = ["Dashboard", "Modules", "Workflows", "Compliance", "Support"];

export default function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">e</div>
        <div>
          <p className="brand-name">e-Tysan System</p>
          <p className="brand-subtitle">Digital Operations Platform</p>
        </div>
      </div>
      <nav className="nav" aria-label="Primary">
        {navItems.map((item) => (
          <button key={item} className="nav-link" type="button">
            {item}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <button className="ghost-button" type="button">
          Search Docs
        </button>
        <button className="primary-button" type="button">
          New Request
        </button>
      </div>
    </header>
  );
}
