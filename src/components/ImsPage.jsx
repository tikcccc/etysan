import { imsQualityKpis, imsComplaints } from "../data/ims.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import StorySpotlight from "./StorySpotlight.jsx";

export default function ImsPage() {
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const complaintRecords = imsComplaints.map((record) =>
    resolveRecord("imsComplaints", record)
  );

  const openComplaintPage = (record = null) =>
    openPageWorkspace("imsComplaint", record ? { record } : {}, "ims");

  const openImsInfoBoard = (title, subtitle, sections, badge, badgeTone = "info") =>
    openWorkspace("infoBoard", {
      moduleLabel: "IMS - Quality",
      title,
      subtitle,
      badge,
      badgeTone,
      sections,
    });

  const focusComplaint = complaintRecords[1] || complaintRecords[0];
  const investigationCount = complaintRecords.filter(
    (row) => row.status === "Investigation"
  ).length;
  const openCount = complaintRecords.filter((row) => row.status === "Open").length;

  return (
    <section className="module-page ims-page" aria-label="IMS quality">
      <div className="module-layout">
        <div className="module-main">
          <StorySpotlight
            eyebrow="Complaint lifecycle"
            title="Client complaint -> CAR -> Closure"
            description="Route complaint intake, case owner assignment, CAR issue, closure notification, and signed closure in one quality workspace."
            tags={["Case owner", "Root cause", "Closure notice"]}
            primaryAction={{
              label: "Open complaint workflow",
              onClick: () => openComplaintPage(focusComplaint),
            }}
            secondaryAction={{
              label: "Generate monthly summary",
              onClick: () =>
                openImsInfoBoard(
                  "Monthly quality summary",
                  "Open complaints, CAR status, and signed closures queued for reporting.",
                  [
                    {
                      title: "Quality roll-up",
                      items: complaintRecords.slice(0, 4).map((row) => ({
                        title: row.subject,
                        detail: `${row.id} · ${row.client}`,
                        meta: row.date,
                        badge: row.status,
                        badgeTone:
                          row.status === "Closed"
                            ? "approved"
                            : row.status === "Investigation"
                              ? "warning"
                              : "review",
                      })),
                    },
                  ],
                  "Monthly"
                ),
            }}
            metrics={[
              { label: "Focus complaint", value: focusComplaint?.id || "CMP-25-004" },
              { label: "Open cases", value: `${openCount}` },
              { label: "Investigation", value: `${investigationCount}` },
            ]}
          />

          <div className="module-kpis">
            {imsQualityKpis.map((kpi) => (
              <article key={kpi.label} className="kpi-card">
                <p className="overview-label">{kpi.label}</p>
                <h3 className="overview-value neutral">{kpi.value}</h3>
              </article>
            ))}
          </div>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Complaint register</p>
                <h3>Quality management workflow</h3>
              </div>
              <button className="ghost-button" type="button" onClick={() => openComplaintPage()}>
                New complaint
              </button>
            </div>
            <div className="ims-record-grid">
              {complaintRecords.map((row) => (
                <button
                  key={row.id}
                  className="ims-record-card ims-record-button"
                  type="button"
                  onClick={() => openComplaintPage(row)}
                >
                  <div className="ims-record-head">
                    <div>
                      <p className="ims-record-title">{row.id}</p>
                      <p className="ims-record-meta">
                        {row.client} · {row.date}
                      </p>
                    </div>
                    <span
                      className={`status ${row.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="ims-record-body">{row.subject}</p>
                  <div className="ims-record-foot">
                    <span className="data-link">{row.car}</span>
                    <span className="data-link">
                      {row.signature ? "Signed" : "Sign now"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="panel-footer">
              <button
                className="ghost-button"
                type="button"
                onClick={() =>
                  openImsInfoBoard(
                    "Monthly quality summary",
                    "Open complaints, CAR status, and signed closures queued for reporting.",
                    [
                      {
                        title: "Quality roll-up",
                        items: complaintRecords.slice(0, 4).map((row) => ({
                          title: row.subject,
                          detail: `${row.id} · ${row.client}`,
                          meta: row.date,
                          badge: row.status,
                          badgeTone:
                            row.status === "Closed"
                              ? "approved"
                              : row.status === "Investigation"
                                ? "warning"
                                : "review",
                        })),
                      },
                    ],
                    "Monthly"
                  )
                }
              >
                Generate monthly summary
              </button>
            </div>
          </section>
        </div>

        <aside className="module-rail">
          <section className="rail-card">
            <div>
              <p className="panel-label">Quality control</p>
              <h3>CAR follow-up</h3>
            </div>
            <div className="list-stack">
              {complaintRecords.map((row) => (
                <button
                  key={row.id}
                  className="list-row compact list-row-button"
                  type="button"
                  onClick={() => openComplaintPage(row)}
                >
                  <div>
                    <p className="list-title">{row.subject}</p>
                    <p className="list-meta">{row.car}</p>
                  </div>
                  <span
                    className={`status ${row.status
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {row.status}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rail-card">
            <div>
              <p className="panel-label">Reporting hook</p>
              <h3>Closure summary</h3>
            </div>
            <div className="list-stack">
              <div className="list-row compact">
                <div>
                  <p className="list-title">Signed closures</p>
                  <p className="list-meta">Ready for monthly issue</p>
                </div>
                <span className="status approved">
                  {complaintRecords.filter((row) => row.signature).length}
                </span>
              </div>
              <div className="list-row compact">
                <div>
                  <p className="list-title">Open complaints</p>
                  <p className="list-meta">Monitor before CAR issue</p>
                </div>
                <span className="status review">{openCount}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
