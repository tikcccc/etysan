import { useState } from "react";
import { qsKpis, qsPayments, qsAlerts, qsContracts, qsReviews } from "../data/qs.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const qsTabs = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Contracts & Records" },
];

const workflowSteps = [
  { id: 1, label: "Request", desc: "Site" },
  { id: 2, label: "Invoice", desc: "OCR" },
  { id: 3, label: "Verify", desc: "QS" },
  { id: 4, label: "Certify", desc: "Director" },
];

export default function QsPage() {
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPayment, setSelectedPayment] = useState(0);
  const payments = qsPayments.map((payment) =>
    resolveRecord("qsPayments", payment)
  );

  const payment = payments[selectedPayment];
  const openPaymentPage = (record) =>
    openPageWorkspace("qsPayment", { record }, "qs");
  const openQsInfoBoard = (title, subtitle, items, badge, badgeTone = "info") =>
    openWorkspace("infoBoard", {
      moduleLabel: "QS",
      title,
      subtitle,
      badge,
      badgeTone,
      sections: [
        {
          title: "Workflow details",
          items,
        },
      ],
    });

  return (
    <section className="module-page qs-page" aria-label="QS management">
      <div className="module-tabs" role="tablist" aria-label="QS sections">
        {qsTabs.map((tab) => (
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

      {activeTab === "overview" ? (
        <div className="module-layout">
          <div className="module-main">
            <div className="module-kpis">
              {qsKpis.map((kpi) => (
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
                    <p className="panel-label">Subcontractor payments</p>
                    <h3>Payment certificates (QS-B8)</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => openPaymentPage(payment)}
                  >
                    Filter
                  </button>
                </div>
                <div className="data-table qs-payments-table">
                  <div className="data-head">
                    <span>Cert ID</span>
                    <span>Subcontractor</span>
                    <span>Work</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>
                  {payments.map((row, index) => (
                    <button
                      key={row.id}
                      type="button"
                      className={`data-row ${index === selectedPayment ? "active" : ""}`}
                      onClick={() => {
                        setSelectedPayment(index);
                        openPaymentPage(row);
                      }}
                    >
                      <span className="mono">{row.id}</span>
                      <span>
                        <strong>{row.subcon}</strong>
                      </span>
                      <span>{row.work}</span>
                      <span>{row.amount}</span>
                      <span className={`status ${row.status.toLowerCase().replace(/\s/g, "-")}`}>
                        {row.status}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel span-5">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Workflow status</p>
                    <h3>Approval progress</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => openPaymentPage(payment)}
                  >
                    View log
                  </button>
                </div>
                {payment ? (
                  <div className="workflow-card">
                    <div className="workflow-summary">
                      <p className="workflow-title">{payment.id}</p>
                      <p className="workflow-sub">{payment.subcon}</p>
                      <p className="workflow-meta">{payment.work}</p>
                    </div>
                    <div className="stepper">
                      {workflowSteps.map((step) => (
                        <div
                          key={step.id}
                          className={`step ${payment.step >= step.id ? "done" : ""}`}
                        >
                          <span>{step.id}</span>
                          <div>
                            <p>{step.label}</p>
                            <small>{step.desc}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="workflow-actions">
                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => openPaymentPage(payment)}
                      >
                        Certify payment
                      </button>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => openPaymentPage(payment)}
                      >
                        Request revision
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="panel span-7">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Cost review</p>
                    <h3>Open review items</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => openPaymentPage(payment)}
                  >
                    Review queue
                  </button>
                </div>
                <div className="list-stack">
                  {qsReviews.map((review) => (
                    <div key={review.id} className="list-row">
                      <div>
                        <p className="list-title">{review.title}</p>
                        <p className="list-meta">
                          {review.id} · Owner {review.owner}
                        </p>
                      </div>
                      <span className="status pending">{review.status}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel span-5">
                <div>
                  <p className="panel-label">Insurance & claims</p>
                  <h3>Coverage tracking</h3>
                </div>
                <div className="highlight-card">
                  <p className="highlight-title">Project All Risk</p>
                  <p className="highlight-meta">Expires in 62 days</p>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() =>
                      openQsInfoBoard(
                        "Insurance policy review",
                        "Coverage register and renewal checkpoints for the active project policy.",
                        [
                          {
                            title: "Policy owner",
                            detail: "Commercial team coordinating insurer response and claims register.",
                            meta: "Owner C. Lau",
                            badge: "62 days left",
                            badgeTone: "warning",
                          },
                          {
                            title: "Renewal checklist",
                            detail: "Confirm insured amount, subcontractor extensions, and claim history.",
                            meta: "3 actions",
                          },
                        ],
                        "Policy",
                        "review"
                      )
                    }
                  >
                    Review policy
                  </button>
                </div>
              </section>
            </div>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">QS alerts</p>
                <h3>Immediate attention</h3>
              </div>
              <div className="alert-list">
                {qsAlerts.map((alert) => (
                  <div key={alert.title} className={`alert-item ${alert.tone}`}>
                    <p className="alert-title">{alert.title}</p>
                    <p className="alert-meta">{alert.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rail-card">
              <div>
                <p className="panel-label">Quick actions</p>
                <h3>Manage workflow</h3>
              </div>
              <div className="rail-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => openPaymentPage(payment)}
                >
                  Generate summary
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openQsInfoBoard(
                      "Variation order intake",
                      "Capture uploaded VO backup before the certification package is locked.",
                      [
                        {
                          title: "Required attachments",
                          detail: "Instruction, measurement backup, and subcontractor pricing breakdown.",
                          meta: "3 files",
                          badge: "Pending upload",
                          badgeTone: "warning",
                        },
                        {
                          title: "Routing",
                          detail: "Once uploaded, QS validates linkage to the payment certificate.",
                          meta: payment?.id || "QS-B8",
                        },
                      ],
                      "VO",
                      "warning"
                    )
                  }
                >
                  Upload VO
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openQsInfoBoard(
                      "Insurance register",
                      "Central list of active policies, claims, and renewal ownership.",
                      [
                        {
                          title: "Register status",
                          detail: "Project all risk, employee compensation, and third-party liability.",
                          meta: "3 active policies",
                          badge: "Current",
                          badgeTone: "approved",
                        },
                        {
                          title: "Next review",
                          detail: "Finance and QS reconcile premium allocation before month end.",
                          meta: "Due Jan 31",
                        },
                      ],
                      "Register",
                      "approved"
                    )
                  }
                >
                  Insurance register
                </button>
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {activeTab === "records" ? (
        <div className="module-layout">
          <div className="module-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Contracts</p>
                  <h3>Main contracts & subcontracts</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openQsInfoBoard(
                      "Contract onboarding",
                      "Prepare metadata and authority checks before a new contract record is added.",
                      [
                        {
                          title: "Required fields",
                          detail: "Employer, contract value, VO baseline, retention, and payment terms.",
                          meta: "5 fields",
                          badge: "Template ready",
                          badgeTone: "review",
                        },
                        {
                          title: "Authority route",
                          detail: "Commercial lead validates contract type before release to the register.",
                          meta: "QS -> Director",
                        },
                      ],
                      "Draft",
                      "review"
                    )
                  }
                >
                  Add contract
                </button>
              </div>
              <div className="data-table qs-contracts-table">
                <div className="data-head">
                  <span>Contract ID</span>
                  <span>Project / Type</span>
                  <span>Employer</span>
                  <span>Value</span>
                  <span>VO Count</span>
                </div>
                {qsContracts.map((contract) => (
                  <div key={contract.id} className="data-row">
                    <span className="mono">{contract.id}</span>
                    <span>
                      <strong>{contract.project}</strong>
                      <span className="data-sub">{contract.type}</span>
                    </span>
                    <span>{contract.employer}</span>
                    <span>{contract.value}</span>
                    <span>{contract.voCount}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Records</p>
                  <h3>Cost review & insurance log</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openQsInfoBoard(
                      "QS export package",
                      "Generate a controlled extract for reviews, insurance, and payment audits.",
                      [
                        {
                          title: "Workbook contents",
                          detail: "Cost review log, insurance register, and subcontract payment status.",
                          meta: "3 sheets",
                          badge: "Ready",
                          badgeTone: "approved",
                        },
                        {
                          title: "Audit note",
                          detail: "Exports include current filter state and user stamp.",
                          meta: "Lisa Ko",
                        },
                      ],
                      "Export"
                    )
                  }
                >
                  Export
                </button>
              </div>
              <div className="list-stack">
                {qsReviews.map((review) => (
                  <div key={review.id} className="list-row">
                    <div>
                      <p className="list-title">{review.title}</p>
                      <p className="list-meta">
                        {review.id} · Due {review.due}
                      </p>
                    </div>
                    <span className="status review">{review.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Record status</p>
                <h3>Tracking summary</h3>
              </div>
              <div className="data-list">
                <div className="data-item">
                  <span>Active contracts</span>
                  <strong>18</strong>
                </div>
                <div className="data-item">
                  <span>VOs under review</span>
                  <strong>6</strong>
                </div>
                <div className="data-item">
                  <span>Insurance files</span>
                  <strong>14</strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
