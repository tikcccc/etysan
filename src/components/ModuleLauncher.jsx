import { modules } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const moduleViewMap = {
  B: "webmail",
  C: "dms",
  D: "dms",
  E: "safety",
  F: "ims",
  G: "environmental",
  H: "qs",
  I: "procurement",
  J: "hr",
  K: "plant",
};

export default function ModuleLauncher() {
  const { navigateToView, openWorkspace } = useWorkspace();

  return (
    <section className="panel span-7" aria-labelledby="modules-title">
      <div className="panel-header">
        <div>
          <p className="panel-label">Functional Apps B-K</p>
          <h2 id="modules-title">Launch an internal application</h2>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() =>
            openWorkspace("infoBoard", {
              badge: `${modules.length} modules`,
              moduleLabel: "Applications",
              sections: [
                {
                  title: "Registered applications",
                  items: modules.map((module) => ({
                    title: `${module.code} · ${module.name}`,
                    detail: module.summary,
                    meta: module.tags.join(" / "),
                    badge: "Available",
                    badgeTone: "approved",
                  })),
                },
              ],
              subtitle: "Application catalog, ownership scope, and module access registration.",
              title: "Module administration",
            })
          }
        >
          Manage modules
        </button>
      </div>
      <div className="module-grid">
        {modules.map((module) => (
          <button
            key={module.code}
            className="module-tile"
            type="button"
            onClick={() => navigateToView(moduleViewMap[module.code] || "home")}
          >
            <div className="module-header">
              <span className="module-code">{module.code}</span>
              <div>
                <p className="module-name">{module.name}</p>
                <p className="module-summary">{module.summary}</p>
              </div>
            </div>
            <div className="module-tags">
              {module.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
