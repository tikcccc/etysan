import { useState } from "react";
import {
  hrKpis,
  hrEmployees,
  hrLeaves,
  hrAlerts,
  hrMemos,
  hrTraining,
  hrInjuries,
} from "../data/hr.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import StorySpotlight from "./StorySpotlight.jsx";

const hrTabs = [
  { id: "dashboard", label: "HR Dashboard" },
  { id: "people", label: "People & Leave" },
  { id: "training", label: "Training & Compliance" },
];

export default function HrPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const employeeRecords = hrEmployees.map((employee) =>
    resolveRecord("hrEmployees", employee)
  );
  const leaveRecords = hrLeaves.map((leave) => resolveRecord("hrLeaves", leave));
  const trainingRecords = hrTraining.map((record) => resolveRecord("hrTraining", record));

  const findEmployeeByName = (name) =>
    employeeRecords.find((employee) => employee.name === name) || null;

  const openProfilePage = (record = employeeRecords[0]) =>
    openPageWorkspace("hrProfile", { record }, "hr");

  const openManpowerPage = () =>
    openPageWorkspace("hrManpowerRequest", {}, "hr");

  const openLeavePage = (record = null, employee = null) =>
    openPageWorkspace(
      "hrLeave",
      {
        ...(record ? { record } : {}),
        ...(employee ? { employee } : {}),
      },
      "hr"
    );

  const openCertificatePage = ({ employee = null, record = null } = {}) =>
    openPageWorkspace(
      "hrCertificate",
      {
        ...(employee ? { employee } : {}),
        ...(record ? { record } : {}),
      },
      "hr"
    );

  const openHrInfoBoard = (title, subtitle, sections, badge, badgeTone = "info") =>
    openWorkspace("infoBoard", {
      moduleLabel: "Human Resources",
      title,
      subtitle,
      badge,
      badgeTone,
      sections,
    });

  return (
    <section className="module-page hr-page" aria-label="Human resources">
      <div className="module-tabs" role="tablist" aria-label="HR sections">
        {hrTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`module-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" ? (
        <div className="module-layout">
          <div className="module-main">
            <StorySpotlight
              eyebrow="Cross-site profile"
              title="Cross-site worker compliance view"
              description="Consolidate certificates, training history, and site movement in one worker profile."
              tags={["Green Card", "Transfer history", "Expiry alerts"]}
              primaryAction={{
                label: "Open worker profile",
                onClick: () => openProfilePage(employeeRecords[2] || employeeRecords[0]),
              }}
              secondaryAction={{
                label: "Upload certificate",
                onClick: () =>
                  openCertificatePage({
                    employee: employeeRecords[2] || employeeRecords[0],
                  }),
              }}
              metrics={[
                {
                  label: "Worker",
                  value: (employeeRecords[2] || employeeRecords[0])?.name || "Chan Tai Man",
                },
                {
                  label: "Status",
                  value: (employeeRecords[2] || employeeRecords[0])?.greenCard || "Expiring Soon",
                },
              ]}
            />
            <div className="module-kpis">
              {hrKpis.map((kpi) => (
                <article key={kpi.label} className="kpi-card">
                  <p className="overview-label">{kpi.label}</p>
                  <h3 className="overview-value neutral">{kpi.value}</h3>
                  <p className="kpi-delta">{kpi.note}</p>
                </article>
              ))}
            </div>

            <div className="module-grid-layout">
              <section className="panel span-7">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Compliance alerts</p>
                    <h3>Urgent employee actions</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => openProfilePage(employeeRecords[2] || employeeRecords[0])}
                  >
                    View registry
                  </button>
                </div>
                <div className="alert-list">
                  {hrAlerts.map((alert, index) => (
                    <button
                      key={alert.title}
                      className={`alert-item ${alert.tone} list-row-button`}
                      type="button"
                      onClick={() => openProfilePage(employeeRecords[index] || employeeRecords[0])}
                    >
                      <p className="alert-title">{alert.title}</p>
                      <p className="alert-meta">{alert.detail}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel span-5">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Announcements</p>
                    <h3>HR memos</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() =>
                      openHrInfoBoard(
                        "HR memo center",
                        "Internal notices and policy updates shared with office and site teams.",
                        [
                          {
                            title: "Current memos",
                            items: hrMemos.map((memo) => ({
                              title: memo.title,
                              detail: memo.detail,
                              meta: memo.date,
                            })),
                          },
                        ],
                        `${hrMemos.length} live`
                      )
                    }
                  >
                    New memo
                  </button>
                </div>
                <div className="list-stack">
                  {hrMemos.map((memo) => (
                    <div key={memo.title} className="list-row">
                      <div>
                        <p className="list-title">{memo.title}</p>
                        <p className="list-meta">{memo.detail}</p>
                      </div>
                      <span className="list-date">{memo.date}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel span-12">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Attendance</p>
                    <h3>Today summary</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() =>
                      openHrInfoBoard(
                        "Attendance & payroll sync",
                        "Daily clocking, leave, and allowance data ready for payroll transfer.",
                        [
                          {
                            title: "Today",
                            items: [
                              {
                                title: "Workforce present",
                                detail: "96% on duty across active sites",
                                meta: "Clock in/out live",
                              },
                              {
                                title: "On leave",
                                detail: "42 staff already reflected in attendance ledger",
                                meta: "Payroll synced",
                              },
                            ],
                          },
                        ],
                        "Live sync",
                        "approved"
                      )
                    }
                  >
                    View timesheets
                  </button>
                </div>
                <div className="attendance-grid">
                  <div>
                    <p className="attendance-label">Workforce present</p>
                    <p className="attendance-value">96%</p>
                    <div className="progress-bar">
                      <span style={{ width: "96%" }} />
                    </div>
                  </div>
                  <div className="attendance-cards">
                    <div>
                      <p>Late in</p>
                      <strong>14</strong>
                    </div>
                    <div>
                      <p>Fieldwork</p>
                      <strong>8</strong>
                    </div>
                    <div>
                      <p>On leave</p>
                      <strong>42</strong>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Quick actions</p>
                <h3>HR operations</h3>
              </div>
              <div className="rail-actions">
                <button className="primary-button" type="button" onClick={openManpowerPage}>
                  New hire
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openLeavePage(
                      leaveRecords[0],
                      findEmployeeByName(leaveRecords[0]?.employee)
                    )
                  }
                >
                  Approve leave
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openCertificatePage({
                      employee: employeeRecords[2] || employeeRecords[0],
                      record: trainingRecords[1] || trainingRecords[0],
                    })
                  }
                >
                  Upload certificate
                </button>
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {activeTab === "people" ? (
        <div className="module-layout">
          <div className="module-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Employee directory</p>
                  <h3>Personnel information</h3>
                </div>
                <button className="ghost-button" type="button" onClick={openManpowerPage}>
                  Add staff
                </button>
              </div>
              <div className="data-table hr-employees-table">
                <div className="data-head">
                  <span>ID</span>
                  <span>Name / Role</span>
                  <span>Type / Site</span>
                  <span>Green card</span>
                  <span>Status</span>
                </div>
                {employeeRecords.map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    className="data-row table-row-button"
                    onClick={() => openProfilePage(emp)}
                  >
                    <span className="mono">{emp.id}</span>
                    <span>
                      <strong>{emp.name}</strong>
                      <span className="data-sub">{emp.role}</span>
                    </span>
                    <span>
                      {emp.type}
                      <span className="data-sub">{emp.site}</span>
                    </span>
                    <span>{emp.greenCard}</span>
                    <span className="status approved">{emp.status}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Leave requests</p>
                  <h3>Attendance & approvals</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openLeavePage(null, employeeRecords[1] || employeeRecords[0])}
                >
                  Apply leave
                </button>
              </div>
              <div className="data-table hr-leave-table">
                <div className="data-head">
                  <span>ID</span>
                  <span>Employee</span>
                  <span>Type</span>
                  <span>Dates</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                {leaveRecords.map((leave) => (
                  <button
                    key={leave.id}
                    type="button"
                    className="data-row table-row-button"
                    onClick={() =>
                      openLeavePage(leave, findEmployeeByName(leave.employee) || employeeRecords[0])
                    }
                  >
                    <span className="mono">{leave.id}</span>
                    <span>{leave.employee}</span>
                    <span>{leave.type}</span>
                    <span>
                      {leave.dates}
                      <span className="data-sub">{leave.days} day(s)</span>
                    </span>
                    <span className={`status ${leave.status.toLowerCase().replace(/\s/g, "-")}`}>
                      {leave.status}
                    </span>
                    <span className="data-link">View</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Attendance</p>
                <h3>Summary</h3>
              </div>
              <div className="data-list">
                <div className="data-item">
                  <span>Workforce present</span>
                  <strong>96%</strong>
                </div>
                <div className="data-item">
                  <span>Late in</span>
                  <strong>14</strong>
                </div>
                <div className="data-item">
                  <span>Fieldwork</span>
                  <strong>8</strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {activeTab === "training" ? (
        <div className="module-layout">
          <div className="module-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Training records</p>
                  <h3>Certification & renewal</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openCertificatePage({
                      employee: findEmployeeByName(trainingRecords[0]?.employee) || employeeRecords[0],
                      record: trainingRecords[0],
                    })
                  }
                >
                  Log training
                </button>
              </div>
              <div className="data-table hr-training-table">
                <div className="data-head">
                  <span>Record ID</span>
                  <span>Course</span>
                  <span>Employee</span>
                  <span>Expiry</span>
                  <span>Status</span>
                </div>
                {trainingRecords.map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    className="data-row table-row-button"
                    onClick={() =>
                      openCertificatePage({
                        employee: findEmployeeByName(record.employee) || employeeRecords[0],
                        record,
                      })
                    }
                  >
                    <span className="mono">{record.id}</span>
                    <span>{record.course}</span>
                    <span>{record.employee}</span>
                    <span>{record.expiry}</span>
                    <span className={`status ${record.status.toLowerCase().replace(/\s/g, "-")}`}>
                      {record.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Work injury</p>
                  <h3>EC case management</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openProfilePage(employeeRecords[2] || employeeRecords[0])}
                >
                  Open case DB
                </button>
              </div>
              <div className="list-stack">
                {hrInjuries.map((injury) => (
                  <div key={injury.id} className="list-row">
                    <div>
                      <p className="list-title">{injury.title}</p>
                      <p className="list-meta">{injury.detail}</p>
                    </div>
                    <span className="status urgent">{injury.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Compliance</p>
                <h3>Expiring cards</h3>
              </div>
              <div className="alert-list">
                {hrAlerts.map((alert, index) => (
                  <button
                    key={alert.title}
                    className={`alert-item ${alert.tone} list-row-button`}
                    type="button"
                    onClick={() => openProfilePage(employeeRecords[index] || employeeRecords[0])}
                  >
                    <p className="alert-title">{alert.title}</p>
                    <p className="alert-meta">{alert.detail}</p>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
