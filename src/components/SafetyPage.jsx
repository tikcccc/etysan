import {
  overviewCards,
  trainingAlerts,
  workers,
  incidents,
  inspectionForms,
} from "../data/safety.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const commandTags = [
  { label: "Gate sync", value: "Live", tone: "ok" },
  { label: "Offline queue", value: "3 pending", tone: "warning" },
  { label: "CWRA cards", value: "Connected", tone: "info" },
];

const inspectionQueue = [
  {
    id: "PAT-219",
    title: "Tower crane pre-start checklist",
    zone: "Zone B",
    due: "2026-01-29 16:00",
    status: "In progress",
  },
  {
    id: "PAT-220",
    title: "Scaffold tag audit",
    zone: "Zone A",
    due: "2026-01-29 18:30",
    status: "Pending",
  },
  {
    id: "PAT-221",
    title: "Permit to work: Hot work",
    zone: "Workshop",
    due: "2026-01-30 09:00",
    status: "Scheduled",
  },
];

const workflowChain = [
  {
    role: "Safety Manager",
    mode: "Parallel approval",
    status: "Approved",
    time: "09:20",
  },
  {
    role: "Site Supervisor",
    mode: "Parallel approval",
    status: "Pending",
    time: "Due 15:00",
  },
  {
    role: "Project Director",
    mode: "Sequential",
    status: "Next",
    time: "Auto notify",
  },
];

const dataOperations = [
  { label: "Offline sync", value: "3 forms waiting" },
  { label: "API status", value: "HR + Payroll connected" },
  { label: "Exports", value: "PDF / Excel ready" },
];

export default function SafetyPage() {
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const blockedWorkers = workers.filter((worker) => worker.accessStatus === "Denied");
  const lowScoreWorkers = workers.filter(
    (worker) => worker.safetyScore < 70 && worker.accessStatus !== "Denied"
  );
  const incidentRecords = incidents.map((incident) =>
    resolveRecord("safetyIncidents", incident)
  );
  const totalSubmissions = inspectionForms.reduce(
    (total, form) => total + form.submissions,
    0
  );

  const metrics = [
    ...overviewCards,
    {
      label: "Gate access blocks",
      value: `${blockedWorkers.length}`,
      tone: "alert",
    },
    {
      label: "Active form templates",
      value: `${inspectionForms.length}`,
      tone: "info",
    },
  ];

  const criticalAlerts = [
    ...trainingAlerts.map((alert) => ({
      id: `training-${alert.worker}`,
      type: "Training",
      title: alert.course,
      meta: `${alert.worker} · Expiry ${alert.expiry}`,
      status: alert.status === "Overdue" ? "critical" : "warning",
      badge: alert.status,
    })),
    ...blockedWorkers.map((worker) => ({
      id: `access-${worker.id}`,
      type: "Access",
      title: `${worker.name} access blocked`,
      meta: `${worker.location} · Score ${worker.safetyScore}%`,
      status: "critical",
      badge: "Access denied",
    })),
    ...lowScoreWorkers.map((worker) => ({
      id: `score-${worker.id}`,
      type: "Score",
      title: `${worker.name} safety score review`,
      meta: `${worker.location} · ${worker.safetyScore}%`,
      status: "warning",
      badge: "Review",
    })),
  ].slice(0, 5);

  const complianceCard = overviewCards.find(
    (card) => card.label === "Training Compliance"
  );

  const openInspectionPage = (record = null) =>
    openPageWorkspace(
      "safetyInspection",
      record ? { record } : {},
      "safety"
    );

  const openIncidentPage = (record = null) =>
    openPageWorkspace(
      "safetyIncident",
      record ? { record } : {},
      "safety"
    );

  const openAttendancePage = () =>
    openPageWorkspace("safetyAttendance", {}, "safety");

  const openDataBoard = (title, subtitle, items, badge, badgeTone = "info") =>
    openWorkspace("infoBoard", {
      moduleLabel: "Safety",
      title,
      subtitle,
      badge,
      badgeTone,
      sections: [
        {
          title: "Data exchange",
          items,
        },
      ],
    });

  return (
    <section className="safety safety-command" aria-label="Safety management">
      <div className="safety-command-bar">
        <div className="command-main">
          <p className="eyebrow">Safety mission control</p>
          <h2>Industrial safety command center</h2>
          <p className="command-sub">
            Digitized inspections, incident reporting, training compliance, and
            access control with audit-ready workflows.
          </p>
          <div className="command-tags">
            {commandTags.map((tag) => (
              <span key={tag.label} className={`command-tag ${tag.tone}`}>
                {tag.label}: <strong>{tag.value}</strong>
              </span>
            ))}
          </div>
        </div>
        <div className="safety-command-actions">
          <div className="command-status">
            <span className="command-status-dot" aria-hidden="true" />
            <div>
              <p className="command-status-title">Gate sync live</p>
              <p className="command-status-meta">
                Last sync 2 min ago · Offline queue 3
              </p>
            </div>
          </div>
          <div className="command-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => openInspectionPage()}
            >
              Start inspection
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => openIncidentPage(incidentRecords[0])}
            >
              Report incident
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={openAttendancePage}
            >
              Create form
            </button>
          </div>
        </div>
      </div>

      <div className="safety-layout">
        <div className="safety-main">
          <div className="safety-metrics">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <p className="metric-label">{metric.label}</p>
                <p className={`metric-value ${metric.tone}`}>{metric.value}</p>
              </article>
            ))}
          </div>

          <div className="safety-grid">
            <section className="panel span-7 safety-panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Inspection & patrol</p>
                  <h3>Live checklist queue</h3>
                  <p className="panel-sub">
                    Mobile-first checklists with offline mode and geo-tags.
                  </p>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openInspectionPage(inspectionQueue[0])}
                >
                  Open mobile
                </button>
              </div>
              <div className="inspection-list">
                {inspectionQueue.map((item) => (
                  <button
                    key={item.id}
                    className="inspection-item inspection-item-button"
                    type="button"
                    onClick={() => openInspectionPage(item)}
                  >
                    <div className="inspection-meta">
                      <p className="inspection-title">{item.title}</p>
                      <p className="inspection-sub">
                        {item.zone} · Due {item.due}
                      </p>
                    </div>
                    <span
                      className={`status-tag ${item.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel span-5 safety-panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Incident reporting</p>
                  <h3>2-stage pipeline to RCA</h3>
                  <p className="panel-sub">
                    Preliminary reports auto-escalate to investigation.
                  </p>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openIncidentPage(incidentRecords[0])}
                >
                  View log
                </button>
              </div>
              <div className="incident-stream">
                {incidentRecords.map((incident) => (
                  <button
                    key={incident.ref}
                    className="incident-row incident-row-button"
                    type="button"
                    onClick={() => openIncidentPage(incident)}
                  >
                    <div className="incident-meta">
                      <span className="mono">{incident.ref}</span>
                      <span>{incident.date}</span>
                    </div>
                    <p className="incident-title">{incident.title}</p>
                    <div className="incident-progress">
                      <div className="incident-progress-bar">
                        <span style={{ width: `${incident.stage * 33.33}%` }} />
                      </div>
                      <div className="incident-steps">
                        <span className={incident.stage >= 1 ? "active" : ""}>
                          Preliminary
                        </span>
                        <span className={incident.stage >= 2 ? "active" : ""}>
                          Investigation
                        </span>
                        <span className={incident.stage >= 3 ? "active" : ""}>
                          Closed
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel span-7 safety-panel safety-panel--builder">
              <div className="builder-header">
                <div>
                  <p className="panel-label">No-code form builder</p>
                  <h3>Drag, drop, deploy</h3>
                  <p className="panel-sub">
                    Conditional logic, calculation fields, and template
                    governance built in.
                  </p>
                </div>
                <div className="builder-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={openAttendancePage}
                  >
                    Create template
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={openAttendancePage}
                  >
                    Template library
                  </button>
                </div>
              </div>
              <div className="builder-metrics">
                <div>
                  <p className="builder-label">Total submissions</p>
                  <p className="builder-value">{totalSubmissions}</p>
                </div>
                <div>
                  <p className="builder-label">Mobile sync</p>
                  <p className="builder-value">Offline ready</p>
                </div>
              </div>
              <div className="form-grid">
                {inspectionForms.map((form) => (
                  <div key={form.id} className="form-card">
                    <div>
                      <p className="form-title">{form.name}</p>
                      <p className="form-meta">
                        {form.id} · Updated {form.updated}
                      </p>
                    </div>
                    <div className="form-count">
                      <strong>{form.submissions}</strong>
                      <span>Submissions</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel span-5 safety-panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Worker registry & access</p>
                  <h3>Register once, work anywhere</h3>
                  <p className="panel-sub">
                    OCR verified IDs with real-time gate enforcement.
                  </p>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={openAttendancePage}
                >
                  OCR scan ID
                </button>
              </div>
              <div className="registry-snapshot">
                {workers.slice(0, 3).map((worker) => (
                  <div key={worker.id} className="registry-item">
                    <span className="mono">{worker.id}</span>
                    <div>
                      <p className="registry-name">{worker.name}</p>
                      <p className="registry-meta">
                        {worker.trade} · {worker.greenCard}
                      </p>
                    </div>
                    <span
                      className={`pill ${worker.accessStatus.toLowerCase()}`}
                    >
                      {worker.accessStatus}
                    </span>
                    <div>
                      <span className="score-bar">
                        <span style={{ width: `${worker.safetyScore}%` }} />
                      </span>
                      <span className="score-note">
                        Score {worker.safetyScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="registry-actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openWorkspace("infoBoard", {
                      badge: `${workers.length} workers`,
                      moduleLabel: "Safety",
                      sections: [
                        {
                          title: "Worker registry",
                          items: workers.map((worker) => ({
                            title: `${worker.id} · ${worker.name}`,
                            detail: `${worker.trade} · ${worker.location}`,
                            meta: `${worker.greenCard} · Score ${worker.safetyScore}%`,
                            badge: worker.accessStatus,
                            badgeTone:
                              worker.accessStatus === "Granted" ? "approved" : "urgent",
                          })),
                        },
                      ],
                      subtitle: "Centralized worker identity, card validity, and access control.",
                      title: "Worker registry",
                    })
                  }
                >
                  View full registry
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={openAttendancePage}
                >
                  New worker
                </button>
              </div>
            </section>
          </div>
        </div>

        <aside className="safety-rail">
          <section className="rail-card safety-alert-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Critical alerts</p>
                <h3>Immediate action required</h3>
              </div>
              <span className="pill overdue">High risk</span>
            </div>
            <div className="alert-list">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.status}`}>
                  <p className="alert-tag">{alert.type}</p>
                  <p className="alert-title">{alert.title}</p>
                  <div className="alert-meta">
                    <span>{alert.meta}</span>
                    <span className={`alert-pill ${alert.status}`}>
                      {alert.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rail-card safety-training-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">E-training & CWRA</p>
                <h3>Compliance {complianceCard?.value || "—"}</h3>
              </div>
              <button
                className="ghost-button"
                type="button"
                onClick={openAttendancePage}
              >
                Training hub
              </button>
            </div>
            <div className="training-alerts compact">
              {trainingAlerts.map((alert) => (
                <div key={alert.worker} className="training-alert">
                  <div>
                    <p className="training-worker">{alert.worker}</p>
                    <p className="training-course">{alert.course}</p>
                  </div>
                  <div className="training-meta">
                    <span>{alert.expiry}</span>
                    <span
                      className={`pill ${alert.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rail-card safety-workflow-panel">
            <div>
              <p className="panel-label">Smart workflows</p>
              <h3>Permit approval chain</h3>
            </div>
            <div className="workflow-chain">
              {workflowChain.map((step) => (
                <div key={step.role} className="workflow-step">
                  <div>
                    <p className="workflow-role">{step.role}</p>
                    <p className="workflow-meta">{step.mode}</p>
                  </div>
                  <div className="workflow-status">
                    <span
                      className={`status-tag ${step.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {step.status}
                    </span>
                    <span className="workflow-time">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rail-card safety-data-panel">
            <div>
              <p className="panel-label">Data & integrations</p>
              <h3>Audit-ready exports</h3>
            </div>
            <div className="data-list">
              {dataOperations.map((item) => (
                <div key={item.label} className="data-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <div className="data-actions">
              <button
                className="ghost-button"
                type="button"
                onClick={() =>
                  openDataBoard(
                    "Safety PDF export",
                    "Compiled patrol, incident, and training packets for audit issue.",
                    [
                      {
                        title: "Audit pack",
                        detail: "Incident RCA, patrol checklist, and worker acknowledgement.",
                        meta: "Last built 10:22",
                        badge: "Ready",
                        badgeTone: "approved",
                      },
                      {
                        title: "Distribution rule",
                        detail: "Watermarked PDF bundle for PM, Safety Manager, and client rep.",
                        meta: "3 recipients",
                      },
                    ],
                    "PDF"
                  )
                }
              >
                Export PDF
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() =>
                  openDataBoard(
                    "Safety Excel export",
                    "Structured extract for patrol trends, attendance, and corrective actions.",
                    [
                      {
                        title: "Dataset scope",
                        detail: "Patrol findings, training expiry, and blocked gate access records.",
                        meta: "3 sheets",
                        badge: "Prepared",
                        badgeTone: "review",
                      },
                      {
                        title: "Refresh cadence",
                        detail: "Workbook refreshes after each mobile sync batch.",
                        meta: "2 min lag",
                      },
                    ],
                    "Excel",
                    "review"
                  )
                }
              >
                Export Excel
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  openDataBoard(
                    "Safety API gateway",
                    "Connected endpoints for HR, payroll, and site access integrations.",
                    [
                      {
                        title: "Live integrations",
                        detail: "Worker registry, payroll attendance sync, and gate access validation.",
                        meta: "3 endpoints",
                        badge: "Live",
                        badgeTone: "approved",
                      },
                      {
                        title: "Pending queue",
                        detail: "Offline patrol submissions waiting to publish from mobile devices.",
                        meta: "3 records",
                        badge: "Queued",
                        badgeTone: "warning",
                      },
                    ],
                    "API",
                    "approved"
                  )
                }
              >
                Open API
              </button>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
