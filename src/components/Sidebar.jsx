import {
  sidebarPrimary,
  sidebarModules,
  projectOptions,
} from "../data/modules.js";

export default function Sidebar({ activeView = "home", onViewChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">e</div>
        <div>
          <p className="brand-name">e-Tysan</p>
          <p className="brand-subtitle">Integrated Operations Platform</p>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Project</p>
        <label className="project-switch sidebar-switch" htmlFor="project-select">
          <span>Active</span>
          <select id="project-select" defaultValue={projectOptions[1]}>
            {projectOptions.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Core</p>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {sidebarPrimary.map((item) => (
            <button
              key={item}
              className={`sidebar-link ${
                (item === "Home" && activeView === "home") ||
                (item === "Webmail" && activeView === "webmail")
                  ? "active"
                  : ""
              }`}
              type="button"
              onClick={() => {
                if (item === "Home") {
                  onViewChange?.("home");
                }
                if (item === "Webmail") {
                  onViewChange?.("webmail");
                }
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Applications</p>
        <nav className="sidebar-nav" aria-label="Module navigation">
          {sidebarModules.map((item) => (
            <button
              key={item}
              className={`sidebar-link ${
                (item === "DMS" && activeView === "dms") ||
                (item === "Safety (4S)" && activeView === "safety") ||
                (item === "Procurement" && activeView === "procurement") ||
                (item === "Plant" && activeView === "plant") ||
                (item === "QS" && activeView === "qs") ||
                (item === "HR" && activeView === "hr") ||
                (item === "IMS" && activeView === "ims")
                  ? "active"
                  : ""
              }`}
              type="button"
              onClick={() => {
                if (item === "DMS") {
                  onViewChange?.("dms");
                }
                if (item === "Safety (4S)") {
                  onViewChange?.("safety");
                }
                if (item === "Procurement") {
                  onViewChange?.("procurement");
                }
                if (item === "Plant") {
                  onViewChange?.("plant");
                }
                if (item === "QS") {
                  onViewChange?.("qs");
                }
                if (item === "HR") {
                  onViewChange?.("hr");
                }
                if (item === "IMS") {
                  onViewChange?.("ims");
                }
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-foot">
        <p className="sidebar-label">System Status</p>
        <div className="status-card">
          <span className="status-dot" />
          <div>
            <p className="status-title">All services operational</p>
            <p className="status-meta">Last sync 3 minutes ago</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
