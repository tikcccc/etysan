import { tasks } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const priorityOrder = ["High", "Medium", "Low"];
const priorityPalette = {
  High: "#d04444",
  Medium: "#d67b00",
  Low: "#1f8f63",
};

const formatPercent = (value) => `${Math.round(value)}%`;

export default function TaskPieCard() {
  const { openWorkspace } = useWorkspace();
  const counts = tasks.reduce((acc, task) => {
    const key = task.priority || "Low";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const segments = priorityOrder.map((priority) => ({
    label: priority,
    count: counts[priority] || 0,
    color: priorityPalette[priority],
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
    .map((segment) => `${segment.label} ${segment.count}`)
    .join(", ");

  return (
    <section className="panel task-pie-card" aria-label="Task overview">
      <div className="panel-header">
        <div>
          <p className="panel-label">Task Management</p>
          <h2>Priority mix</h2>
          <p className="panel-sub">Active tasks grouped by urgency.</p>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() =>
            openWorkspace("infoBoard", {
              badge: `${total} open`,
              moduleLabel: "Task Management",
              sections: [
                {
                  title: "Assigned work",
                  items: tasks.map((task) => ({
                    title: task.title,
                    detail: `${task.module} · Due ${task.due}`,
                    badge: task.priority,
                    badgeTone:
                      task.priority === "High"
                        ? "urgent"
                        : task.priority === "Medium"
                          ? "review"
                          : "approved",
                  })),
                },
              ],
              subtitle: "Current user workload grouped by urgency and delivery date.",
              title: "Task board",
            })
          }
        >
          Open task board
        </button>
      </div>
      <div className="task-pie-layout">
        <div
          className="task-pie"
          style={{ background }}
          role="img"
          aria-label={`Task priorities: ${summary}`}
        >
          <div className="task-pie-center">
            <span className="task-total">{total}</span>
            <span className="task-total-label">Tasks</span>
          </div>
        </div>
        <div className="task-legend">
          {segments.map((segment) => {
            const percent = total
              ? formatPercent((segment.count / total) * 100)
              : "0%";
            return (
              <div key={segment.label} className="task-legend-row">
                <span
                  className="task-legend-dot"
                  style={{ background: segment.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="task-legend-label">{segment.label}</p>
                  <p className="task-legend-meta">
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
