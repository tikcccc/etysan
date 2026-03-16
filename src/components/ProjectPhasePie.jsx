import { projects } from "../data/modules.js";

const phaseOrder = ["Tender", "Design", "Construction", "Handover"];
const phasePalette = {
  Tender: "#f2b94f",
  Design: "#7aa1d2",
  Construction: "#2dc98f",
  Handover: "#9aa7b8",
};

const formatPercent = (value) => `${Math.round(value)}%`;

export default function ProjectPhasePie() {
  const counts = projects.reduce((acc, project) => {
    const key = project.phase || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const phases = [
    ...phaseOrder,
    ...Object.keys(counts).filter((phase) => !phaseOrder.includes(phase)),
  ];

  const segments = phases.map((phase) => ({
    label: phase,
    count: counts[phase] || 0,
    color: phasePalette[phase] || "#5b6b7f",
  }));

  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  let current = 0;
  const gradientStops = segments
    .filter((segment) => segment.count > 0)
    .map((segment) => {
      const start = current;
      const slice = (segment.count / total) * 360;
      const end = start + slice;
      current = end;
      return `${segment.color} ${start}deg ${end}deg`;
    });

  const background =
    total > 0
      ? `conic-gradient(${gradientStops.join(", ")})`
      : "conic-gradient(#e6edf3 0deg 360deg)";

  const summary = segments
    .filter((segment) => segment.count > 0)
    .map((segment) => `${segment.label} ${segment.count}`)
    .join(", ");

  return (
    <section
      className="panel project-phase-card"
      aria-label="Project phase distribution"
    >
      <div className="panel-header">
        <div>
          <p className="panel-label">Portfolio</p>
          <h2>Project phase mix</h2>
          <p className="panel-sub">
            Current active projects grouped by delivery phase.
          </p>
        </div>
        <button className="ghost-button" type="button">
          View portfolio
        </button>
      </div>
      <div className="phase-chart">
        <div
          className="phase-pie"
          style={{ background }}
          role="img"
          aria-label={`Project phases: ${summary || "No active projects"}`}
        >
          <div className="phase-pie-center">
            <span className="phase-total">{total}</span>
            <span className="phase-total-label">Projects</span>
          </div>
        </div>
        <div className="phase-legend">
          {segments.map((segment) => {
            const percent = total
              ? formatPercent((segment.count / total) * 100)
              : "0%";
            return (
              <div key={segment.label} className="phase-legend-row">
                <span
                  className="phase-legend-dot"
                  style={{ background: segment.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="phase-legend-label">{segment.label}</p>
                  <p className="phase-legend-meta">
                    {segment.count} · {percent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
