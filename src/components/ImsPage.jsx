import { useState } from "react";
import {
  imsQualityKpis,
  imsComplaints,
  imsPermits,
  imsTraining,
  imsInspections,
} from "../data/ims.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function ImsPage() {
  const [activeTab, setActiveTab] = useState("quality");
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const complaintRecords = imsComplaints.map((record) =>
    resolveRecord("imsComplaints", record)
  );
  const permitRecords = imsPermits.map((record) => resolveRecord("imsPermits", record));
  const inspectionRecords = imsInspections.map((record) =>
    resolveRecord("imsInspections", record)
  );

  const openComplaintPage = (record = null) =>
    openPageWorkspace(
      "imsComplaint",
      record ? { record } : {},
      "ims"
    );

  const openPermitPage = (record = null) =>
    openPageWorkspace(
      "imsPermit",
      record ? { record } : {},
      "ims"
    );

  const openInspectionPage = (record = null) =>
    openPageWorkspace(
      "imsInspection",
      record ? { record } : {},
      "ims"
    );

  const openImsInfoBoard = (title, subtitle, sections, badge, badgeTone = "info") =>
    openWorkspace("infoBoard", {
      moduleLabel: "IMS",
      title,
      subtitle,
      badge,
      badgeTone,
      sections,
    });

  return (
    <section className="module-page ims-page" aria-label="IMS">
      <div className="ims-toggle" role="tablist" aria-label="IMS sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "quality"}
          className={activeTab === "quality" ? "active" : ""}
          onClick={() => setActiveTab("quality")}
        >
          IMS - Quality
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "environmental"}
          className={activeTab === "environmental" ? "active" : ""}
          onClick={() => setActiveTab("environmental")}
        >
          IMS - Environmental
        </button>
      </div>

      {activeTab === "quality" ? (
        <div className="module-layout">
          <div className="module-main">
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
                  <p className="panel-label">Client complaint record</p>
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
          </aside>
        </div>
      ) : null}

      {activeTab === "environmental" ? (
        <div className="module-layout">
          <div className="module-main">
            <div className="module-grid-layout">
              <section className="panel span-7">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Permit & license</p>
                    <h3>Expiration tracking</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => openPermitPage(permitRecords[2] || permitRecords[0])}
                  >
                    Renewal log
                  </button>
                </div>
                <div className="permit-list">
                  {permitRecords.map((permit) => (
                    <button
                      key={permit.id}
                      className="permit-item permit-item-button"
                      type="button"
                      onClick={() => openPermitPage(permit)}
                    >
                      <div>
                        <p className="permit-title">{permit.type}</p>
                        <p className="permit-meta">
                          {permit.id} · {permit.authority}
                        </p>
                      </div>
                      <div className="permit-status">
                        <span
                          className={`status ${permit.status
                            .toLowerCase()
                            .replace(/\s/g, "-")}`}
                        >
                          {permit.status}
                        </span>
                        <span className="permit-expiry">Exp: {permit.expiry}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel span-5">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Env training</p>
                    <h3>Recent sessions</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() =>
                      openImsInfoBoard(
                        "Environmental training roster",
                        "Upcoming drills and completed briefings linked to the environmental module.",
                        [
                          {
                            title: "Sessions",
                            items: imsTraining.map((item) => ({
                              title: item.title,
                              detail: item.date,
                              meta: item.action,
                            })),
                          },
                        ],
                        `${imsTraining.length} sessions`
                      )
                    }
                  >
                    View roster
                  </button>
                </div>
                <div className="list-stack">
                  {imsTraining.map((item) => (
                    <div key={item.title} className="list-row">
                      <div>
                        <p className="list-title">{item.title}</p>
                        <p className="list-meta">{item.date}</p>
                      </div>
                      <span className="data-link">{item.action}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Monthly inspection</p>
                  <h3>Environmental inspection records</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openInspectionPage(inspectionRecords[0])}
                >
                  Start inspection
                </button>
              </div>
              <div className="ims-record-grid ims-record-grid--wide">
                {inspectionRecords.map((ins) => (
                  <button
                    key={ins.id}
                    className="ims-record-card ims-record-button"
                    type="button"
                    onClick={() => openInspectionPage(ins)}
                  >
                    <div className="ims-record-head">
                      <div>
                        <p className="ims-record-title">{ins.id}</p>
                        <p className="ims-record-meta">
                          {ins.date} · {ins.location}
                        </p>
                      </div>
                      <span
                        className={`status ${ins.status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {ins.status}
                      </span>
                    </div>
                    <p className="ims-record-meta">Inspector: {ins.inspector}</p>
                    <div className="ims-record-split">
                      <div>
                        <p className="ims-record-caption">Findings</p>
                        {ins.issues > 0 ? (
                          <span className="thumbs">
                            {Array.from({ length: ins.issues }).map((_, idx) => (
                              <span key={idx} className="thumb" />
                            ))}
                          </span>
                        ) : (
                          <span className="data-sub">No issues</span>
                        )}
                      </div>
                      <div>
                        <p className="ims-record-caption">Rectified</p>
                        {ins.rectified > 0 ? (
                          <span className="thumbs">
                            {Array.from({ length: ins.rectified }).map((_, idx) => (
                              <span key={idx} className="thumb resolved" />
                            ))}
                            {ins.issues > ins.rectified ? (
                              <span className="thumb upload">+</span>
                            ) : null}
                          </span>
                        ) : (
                          <span className="data-link">Upload proof</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Environmental alerts</p>
                <h3>Expiring permits</h3>
              </div>
              <div className="list-stack">
                {permitRecords.map((permit) => (
                  <button
                    key={permit.id}
                    className="list-row compact list-row-button"
                    type="button"
                    onClick={() => openPermitPage(permit)}
                  >
                    <div>
                      <p className="list-title">{permit.type}</p>
                      <p className="list-meta">{permit.expiry}</p>
                    </div>
                    <span
                      className={`status ${permit.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {permit.status}
                    </span>
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
