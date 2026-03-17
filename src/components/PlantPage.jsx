import { useState } from "react";
import {
  plantKpis,
  plantFleet,
  plantJobs,
  plantInspections,
  plantTransfers,
  plantDisposals,
} from "../data/plant.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const plantTabs = [
  { id: "fleet", label: "Fleet Control" },
  { id: "maintenance", label: "Maintenance & Logistics" },
];

const draftJobSeed = {
  id: "JOB-49020",
  plantId: "GEN-09",
  desc: "Cooling system inspection and battery replacement",
  requestDate: "2026-02-05",
  status: "In Progress",
  cost: "$3,800",
};

const draftTransferSeed = {
  id: "TR-011",
  detail: "GEN-09: Depot → Site J2401B1",
  status: "Pending transport",
};

export default function PlantPage() {
  const [activeTab, setActiveTab] = useState("fleet");
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const fleetRecords = plantFleet.map((record) => resolveRecord("plantFleet", record));
  const jobRecords = plantJobs.map((record) => resolveRecord("plantJobs", record));
  const inspectionRecords = plantInspections.map((record) =>
    resolveRecord("plantInspections", record)
  );
  const transferRecords = plantTransfers.map((record) =>
    resolveRecord("plantTransfers", record)
  );

  const openJobPage = (record = draftJobSeed) =>
    openPageWorkspace("plantJobSheet", { record }, "plant");

  const openTransferPage = (record = draftTransferSeed) =>
    openPageWorkspace("plantTransfer", { record }, "plant");

  const openInspectionPage = (record = inspectionRecords[0]) =>
    openPageWorkspace("plantInspection", { record }, "plant");

  const openPlantInfoBoard = (title, subtitle, sections, badge, badgeTone = "info") =>
    openWorkspace("infoBoard", {
      moduleLabel: "Plant",
      title,
      subtitle,
      badge,
      badgeTone,
      sections,
    });

  const findInspectionByPlant = (plantId) =>
    inspectionRecords.find((record) => record.plantId === plantId) || inspectionRecords[0];

  return (
    <section className="module-page plant-page" aria-label="Plant management">
      <div className="module-tabs" role="tablist" aria-label="Plant sections">
        {plantTabs.map((tab) => (
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

      {activeTab === "fleet" ? (
        <div className="module-layout">
          <div className="module-main">
            <div className="module-kpis">
              {plantKpis.map((kpi) => (
                <article key={kpi.label} className="kpi-card">
                  <p className="overview-label">{kpi.label}</p>
                  <h3 className="overview-value neutral">{kpi.value}</h3>
                  <p className="kpi-delta">{kpi.note}</p>
                </article>
              ))}
            </div>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Plant inventory</p>
                  <h3>Fleet status by site</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openPlantInfoBoard(
                      "RCD / fleet report",
                      "Export-ready asset view for utilization, maintenance, and inspection planning.",
                      [
                        {
                          title: "Fleet snapshot",
                          items: fleetRecords.map((plant) => ({
                            title: `${plant.id} · ${plant.name}`,
                            detail: `${plant.brand} · ${plant.location}`,
                            meta: `Last check ${plant.lastCheck}`,
                            badge: plant.status,
                            badgeTone:
                              plant.status === "Operational" ? "approved" : "warning",
                          })),
                        },
                      ],
                      `${fleetRecords.length} assets`
                    )
                  }
                >
                  Export RCD report
                </button>
              </div>
              <div className="data-table plant-inventory-table">
                <div className="data-head">
                  <span>Plant ID</span>
                  <span>Description / Brand</span>
                  <span>Location</span>
                  <span>Status</span>
                  <span>Last Check</span>
                </div>
                {fleetRecords.map((plant) => (
                  <button
                    key={plant.id}
                    type="button"
                    className="data-row table-row-button"
                    onClick={() => openInspectionPage(findInspectionByPlant(plant.id))}
                  >
                    <span className="mono">{plant.id}</span>
                    <span>
                      <strong>{plant.name}</strong>
                      <span className="data-sub">{plant.brand}</span>
                    </span>
                    <span>{plant.location}</span>
                    <span
                      className={`status ${
                        plant.status === "Operational" ? "approved" : "urgent"
                      }`}
                    >
                      {plant.status}
                    </span>
                    <span>{plant.lastCheck}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Inspections</p>
                  <h3>Upcoming permits</h3>
                </div>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openInspectionPage(inspectionRecords[0])}
                >
                  Schedule
                </button>
              </div>
              <div className="list-stack">
                {inspectionRecords.map((ins) => (
                  <button
                    key={ins.id}
                    className="list-row list-row-button"
                    type="button"
                    onClick={() => openInspectionPage(ins)}
                  >
                    <div>
                      <p className="list-title">
                        {ins.plantId} · {ins.type} inspection
                      </p>
                      <p className="list-meta">{ins.date}</p>
                    </div>
                    <span className="status review">{ins.result}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Maintenance alerts</p>
                <h3>Jobs in progress</h3>
              </div>
              <div className="list-stack">
                {jobRecords.map((job) => (
                  <button
                    key={job.id}
                    className="list-row compact list-row-button"
                    type="button"
                    onClick={() => openJobPage(job)}
                  >
                    <div>
                      <p className="list-title">{job.plantId}</p>
                      <p className="list-meta">{job.desc}</p>
                    </div>
                    <span className="status pending">{job.status}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {activeTab === "maintenance" ? (
        <div className="module-layout">
          <div className="module-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Job sheets</p>
                  <h3>Repair & maintenance</h3>
                </div>
                <button className="ghost-button" type="button" onClick={() => openJobPage()}>
                  New job sheet
                </button>
              </div>
              <div className="data-table plant-jobs-table">
                <div className="data-head">
                  <span>Job ID</span>
                  <span>Plant</span>
                  <span>Description</span>
                  <span>Status</span>
                  <span>Cost</span>
                </div>
                {jobRecords.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className="data-row table-row-button"
                    onClick={() => openJobPage(job)}
                  >
                    <span className="mono">{job.id}</span>
                    <span>{job.plantId}</span>
                    <span>{job.desc}</span>
                    <span className="status review">{job.status}</span>
                    <span>{job.cost}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Transfer & disposal</p>
                  <h3>Logistics workflow</h3>
                </div>
                <button className="ghost-button" type="button" onClick={() => openTransferPage()}>
                  Create transfer
                </button>
              </div>
              <div className="module-grid-layout">
                <div className="panel span-6 nested">
                  <h4>Recent transfers</h4>
                  <div className="list-stack">
                    {transferRecords.map((item) => (
                      <button
                        key={item.id}
                        className="list-row compact list-row-button"
                        type="button"
                        onClick={() => openTransferPage(item)}
                      >
                        <div>
                          <p className="list-title">{item.detail}</p>
                          <p className="list-meta">{item.id}</p>
                        </div>
                        <span className="status pending">{item.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="panel span-6 nested">
                  <h4>Material disposal</h4>
                  <div className="list-stack">
                    {plantDisposals.map((item) => (
                      <button
                        key={item.id}
                        className="list-row compact list-row-button"
                        type="button"
                        onClick={() =>
                          openPlantInfoBoard(
                            "Material disposal log",
                            "Scrap and waste disposal approvals linked to plant operations.",
                            [
                              {
                                title: "Disposal items",
                                items: plantDisposals.map((disposal) => ({
                                  title: disposal.detail,
                                  detail: disposal.id,
                                  badge: disposal.status,
                                  badgeTone: "review",
                                })),
                              },
                            ],
                            `${plantDisposals.length} items`,
                            "review"
                          )
                        }
                      >
                        <div>
                          <p className="list-title">{item.detail}</p>
                          <p className="list-meta">{item.id}</p>
                        </div>
                        <span className="status review">{item.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="module-rail">
            <section className="rail-card">
              <div>
                <p className="panel-label">Logistics tools</p>
                <h3>Quick actions</h3>
              </div>
              <div className="rail-actions">
                <button className="primary-button" type="button" onClick={() => openTransferPage()}>
                  Transfer request
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() =>
                    openPlantInfoBoard(
                      "Disposal approval register",
                      "Logged scrap disposal requests waiting for follow-up and approval evidence.",
                      [
                        {
                          title: "Register",
                          items: plantDisposals.map((item) => ({
                            title: item.detail,
                            detail: item.id,
                            badge: item.status,
                            badgeTone: "review",
                          })),
                        },
                      ],
                      "Register"
                    )
                  }
                >
                  Disposal log
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openInspectionPage(inspectionRecords[0])}
                >
                  Permit register
                </button>
              </div>
            </section>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
