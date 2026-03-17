import { projects } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function ProjectOverview() {
  const { openWorkspace } = useWorkspace();

  const portfolioPayload = {
    badge: `${projects.length} active`,
    moduleLabel: "Portfolio",
    sections: [
      {
        title: "Active projects",
        items: projects.map((project) => ({
          title: project.name,
          detail: `Location ${project.location} · Next ${project.next}`,
          meta: `${project.progress}% complete`,
          badge: project.phase,
          badgeTone: "muted",
        })),
      },
    ],
    subtitle: "Delivery phase, progress, and next committed actions across the active portfolio.",
    title: "Portfolio view",
  };

  return (
    <section className="panel span-4" aria-labelledby="projects-title">
      <div className="panel-header">
        <div>
          <p className="panel-label">Projects</p>
          <h2 id="projects-title">Active portfolio</h2>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() => openWorkspace("infoBoard", portfolioPayload)}
        >
          View portfolio
        </button>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.name}>
            <div>
              <h3>{project.name}</h3>
              <p className="project-meta">
                {project.location} - {project.phase}
              </p>
            </div>
            <div className="project-progress">
              <div className="progress">
                <span style={{ width: `${project.progress}%` }} />
              </div>
              <span>{project.progress}%</span>
            </div>
            <p className="project-next">Next: {project.next}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
