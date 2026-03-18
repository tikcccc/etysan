import { useState } from "react";
import {
  procurementKpis,
  procurementOrders,
  procurementRates,
  procurementVendors,
} from "../data/procurement.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import StorySpotlight from "./StorySpotlight.jsx";

const procurementTabs = [
  { id: "operations", label: "Operations" },
  { id: "rates", label: "Rates & Vendors" },
];

const workflowSteps = [
  { id: 1, label: "Req / Quote" },
  { id: 2, label: "Approval" },
  { id: 3, label: "PO Issued" },
  { id: 4, label: "Delivery" },
  { id: 5, label: "QS Handover" },
];

export default function ProcurementPage() {
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const [activeTab, setActiveTab] = useState("operations");
  const [selectedOrder, setSelectedOrder] = useState(0);
  const orders = procurementOrders.map((order) =>
    resolveRecord("procurementOrders", order)
  );

  const order = orders[selectedOrder];
  const deliveryDemoOrder = orders.find((item) => item.step >= 4) || order;
  const openRequisitionPage = () =>
    openPageWorkspace("procurementRequisition", {}, "procurement");
  const openOrderPage = (record) =>
    openPageWorkspace("procurementOrder", { record }, "procurement");
  const openDeliveryPage = (record) =>
    openPageWorkspace("procurementDelivery", { record }, "procurement");

  return (
    <section className="module-page procurement-page" aria-label="Procurement">
      <div className="module-tabs" role="tablist" aria-label="Procurement sections">
        {procurementTabs.map((tab) => (
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

      {activeTab === "operations" ? (
        <div className="module-layout">
          <div className="module-main">
            <StorySpotlight
              title="PR to delivery verification"
              description="Route requisitions through approval, delivery note verification, and three-way match handover to QS."
              tags={["Delivery Note", "GRN", "Invoice variance"]}
              primaryAction={{
                label: "Open delivery match",
                onClick: () => openOrderPage(deliveryDemoOrder),
              }}
              secondaryAction={{
                label: "Start requisition",
                onClick: openRequisitionPage,
              }}
              metrics={[
                { label: "Priority order", value: deliveryDemoOrder?.id || "PO-25-8822" },
                { label: "Current stage", value: deliveryDemoOrder?.status || "Delivery Pending" },
              ]}
            />
            <div className="module-kpis">
              {procurementKpis.map((kpi) => (
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
                    <p className="panel-label">Purchase orders</p>
                    <h3>Active requisitions</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={openRequisitionPage}
                  >
                    New requisition
                  </button>
                </div>
                <div className="data-table proc-orders-table">
                  <div className="data-head">
                    <span>PO ID</span>
                    <span>Vendor / Item</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Action</span>
                  </div>
                  {orders.map((row, index) => (
                    <button
                      key={row.id}
                      type="button"
                      className={`data-row ${index === selectedOrder ? "active" : ""}`}
                      onClick={() => {
                        setSelectedOrder(index);
                        openOrderPage(row);
                      }}
                    >
                      <span className="mono">{row.id}</span>
                      <span>
                        <strong>{row.vendor}</strong>
                        <span className="data-sub">{row.item}</span>
                      </span>
                      <span>{row.amount}</span>
                      <span className={`status ${row.status.toLowerCase().replace(/\s/g, "-")}`}>
                        {row.status}
                      </span>
                      <span className="data-link">Track</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel span-5">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Order lifecycle</p>
                    <h3>Tracking</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => openOrderPage(order)}
                  >
                    Timeline
                  </button>
                </div>
                {order ? (
                  <div className="workflow-card">
                    <div className="workflow-summary">
                      <p className="workflow-title">{order.id}</p>
                      <p className="workflow-sub">{order.vendor}</p>
                      <p className="workflow-meta">{order.item}</p>
                    </div>
                    <div className="stepper compact">
                      {workflowSteps.map((step) => (
                        <div
                          key={step.id}
                          className={`step ${order.step >= step.id ? "done" : ""}`}
                        >
                          <span>{step.id}</span>
                          <div>
                            <p>{step.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="workflow-meta-grid">
                      <div>
                        <p>Requester</p>
                        <strong>{order.requester}</strong>
                      </div>
                      <div>
                        <p>Project</p>
                        <strong>{order.project}</strong>
                      </div>
                    </div>
                    {order.step === 4 ? (
                      <div className="warning-card">
                        <p>Action required: Verify delivery note.</p>
                        <button
                          className="primary-button"
                          type="button"
                          onClick={() => openDeliveryPage(order)}
                        >
                          Scan delivery note
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>

              <section className="panel span-12">
                <div className="panel-header">
                  <div>
                    <p className="panel-label">Delivery control</p>
                    <h3>Pending receipts</h3>
                  </div>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => openOrderPage(order)}
                  >
                    Export
                  </button>
                </div>
                <div className="list-stack">
                  {orders.map((row) => (
                    <button
                      key={row.id}
                      className="list-row list-row-button"
                      type="button"
                      onClick={() =>
                        row.step === 4 ? openDeliveryPage(row) : openOrderPage(row)
                      }
                    >
                      <div>
                        <p className="list-title">{row.item}</p>
                        <p className="list-meta">{row.id} · {row.vendor}</p>
                      </div>
                      <span className={`status ${row.status.toLowerCase().replace(/\s/g, "-")}`}>
                        {row.status}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Approvals</p>
                <h3>Awaiting decision</h3>
              </div>
              <div className="list-stack">
                  <div className="list-row compact">
                    <div>
                      <p className="list-title">Quotation analysis</p>
                      <p className="list-meta">PO-25-8821 · &gt; $100k</p>
                    </div>
                    <span className="status urgent">Urgent</span>
                  </div>
                <div className="list-row compact">
                  <div>
                    <p className="list-title">Delivery note missing</p>
                    <p className="list-meta">PO-25-8822</p>
                  </div>
                  <span className="status review">Pending</span>
                </div>
              </div>
            </section>

            <section className="rail-card">
              <div>
                <p className="panel-label">Quick actions</p>
                <h3>Procurement tools</h3>
              </div>
              <div className="rail-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={openRequisitionPage}
                >
                  New requisition
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setActiveTab("rates")}
                >
                  Vendor review
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setActiveTab("rates")}
                >
                  Rate catalog
                </button>
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {activeTab === "rates" ? (
        <div className="module-layout">
          <div className="module-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Annual rate contracts</p>
                  <h3>Transportation, supply, scrap</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openWorkspace("infoBoard", {
                      badge: `${procurementRates.length} contracts`,
                      moduleLabel: "Procurement",
                      sections: [
                        {
                          title: "Annual rate contracts",
                          items: procurementRates.map((rate) => ({
                            title: `${rate.id} · ${rate.vendor}`,
                            detail: `${rate.category} · ${rate.rate}`,
                            meta: `Expires ${rate.expiry}`,
                            badge: rate.status,
                            badgeTone: rate.status === "Active" ? "approved" : "review",
                          })),
                        },
                      ],
                      subtitle: "Transportation, supply, and scrap contracts under annual rate control.",
                      title: "Annual rate register",
                    })
                  }
                >
                  New rate
                </button>
              </div>
              <div className="data-table proc-rates-table">
                <div className="data-head">
                  <span>Contract ID</span>
                  <span>Category</span>
                  <span>Vendor</span>
                  <span>Rate</span>
                  <span>Expiry</span>
                </div>
                {procurementRates.map((rate) => (
                  <div key={rate.id} className="data-row">
                    <span className="mono">{rate.id}</span>
                    <span>{rate.category}</span>
                    <span>{rate.vendor}</span>
                    <span>{rate.rate}</span>
                    <span>{rate.expiry}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Vendor compliance</p>
                  <h3>Preferred suppliers</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openWorkspace("infoBoard", {
                      badge: `${procurementVendors.length} vendors`,
                      moduleLabel: "Procurement",
                      sections: [
                        {
                          title: "Vendor compliance",
                          items: procurementVendors.map((vendor) => ({
                            title: vendor.name,
                            detail: `${vendor.category} · Rating ${vendor.rating}`,
                            badge: vendor.compliance,
                            badgeTone:
                              vendor.compliance === "Active" ? "approved" : "review",
                          })),
                        },
                      ],
                      subtitle: "Preferred supplier register and compliance watchlist.",
                      title: "Vendor audit log",
                    })
                  }
                >
                  Audit log
                </button>
              </div>
              <div className="list-stack">
                {procurementVendors.map((vendor) => (
                  <div key={vendor.name} className="list-row">
                    <div>
                      <p className="list-title">{vendor.name}</p>
                      <p className="list-meta">{vendor.category} · Rating {vendor.rating}</p>
                    </div>
                    <span className="status review">{vendor.compliance}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Compliance</p>
                <h3>Vendor due dates</h3>
              </div>
              <div className="data-list">
                <div className="data-item">
                  <span>Audits due</span>
                  <strong>3 vendors</strong>
                </div>
                <div className="data-item">
                  <span>Rate renewals</span>
                  <strong>5 contracts</strong>
                </div>
                <div className="data-item">
                  <span>Risk flags</span>
                  <strong>2 vendors</strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
