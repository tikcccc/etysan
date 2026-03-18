import { useState } from "react";
import { imsPermits, imsInspections } from "../data/ims.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import StorySpotlight from "./StorySpotlight.jsx";

const typeFilters = [
  { id: "all", label: "All permits" },
  { id: "cnp", label: "CNP" },
  { id: "epd", label: "EPD permits" },
  { id: "other", label: "Other controls" },
];

const statusFilters = [
  "All status",
  "Renewal due",
  "Authority review",
  "Active",
];

function parseExpiryDate(value = "") {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function matchesTypeFilter(permit, activeType) {
  if (activeType === "all") {
    return true;
  }

  if (activeType === "cnp") {
    return permit.type.includes("CNP");
  }

  if (activeType === "epd") {
    return permit.authority === "EPD";
  }

  return permit.authority !== "EPD";
}

function matchesStatusFilter(permit, activeStatus) {
  switch (activeStatus) {
    case "Renewal due":
      return permit.status === "Expiring Soon" || permit.status === "Urgent";
    case "Authority review":
      return permit.lifecycleStage === "Authority review";
    case "Active":
      return permit.lifecycleStage === "Active";
    default:
      return true;
  }
}

export default function EnvironmentalPage() {
  const { openPageWorkspace, resolveRecord } = useWorkspace();
  const [activeType, setActiveType] = useState("all");
  const [activeStatus, setActiveStatus] = useState(statusFilters[0]);
  const [selectedPermitId, setSelectedPermitId] = useState("GW-RN0122");
  const [searchQuery, setSearchQuery] = useState("");

  const permitRecords = imsPermits
    .map((record) => resolveRecord("imsPermits", record))
    .sort((left, right) => parseExpiryDate(left.expiry) - parseExpiryDate(right.expiry));
  const inspectionRecords = imsInspections.map((record) =>
    resolveRecord("imsInspections", record)
  );
  const filteredPermits = permitRecords.filter((permit) => {
    if (!matchesTypeFilter(permit, activeType) || !matchesStatusFilter(permit, activeStatus)) {
      return false;
    }

    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      permit.id,
      permit.type,
      permit.authority,
      permit.site,
      permit.owner,
      permit.scope,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword));
  });
  const selectedPermit =
    filteredPermits.find((permit) => permit.id === selectedPermitId) ||
    permitRecords.find((permit) => permit.id === selectedPermitId) ||
    filteredPermits[0] ||
    permitRecords[0];
  const cnpPermit =
    permitRecords.find((permit) => permit.type.includes("CNP")) || selectedPermit;
  const urgentPermit =
    permitRecords.find((permit) => permit.status === "Urgent") || permitRecords[0];
  const authorityReviewCount = permitRecords.filter(
    (permit) => permit.lifecycleStage === "Authority review"
  ).length;
  const renewalDueCount = permitRecords.filter(
    (permit) => permit.status === "Expiring Soon" || permit.status === "Urgent"
  ).length;
  const validCount = permitRecords.filter((permit) => permit.status === "Valid").length;
  const preparationCount = permitRecords.filter(
    (permit) => permit.lifecycleStage === "Renewal preparation"
  ).length;
  const lifecycleSummary = [
    {
      label: "Application pack",
      detail: "Attachments, measurement summary, and site submission.",
      count: `${preparationCount} preparing`,
      active: selectedPermit?.lifecycleStage === "Renewal preparation",
    },
    {
      label: "Authority review",
      detail: "EPD / FSD acknowledgement and clarification handling.",
      count: `${authorityReviewCount} live`,
      active: selectedPermit?.lifecycleStage === "Authority review",
    },
    {
      label: "Active validity",
      detail: "Approved permit in force with board display and control notes.",
      count: `${validCount} valid`,
      active: selectedPermit?.lifecycleStage === "Active",
    },
    {
      label: "Renewal watch",
      detail: "Expiry alert, reminder route, and next submission date.",
      count: `${renewalDueCount} due`,
      active:
        selectedPermit?.status === "Expiring Soon" || selectedPermit?.status === "Urgent",
    },
  ];
  const signalCards = [
    {
      label: "Renewal due",
      value: `${renewalDueCount}`,
      note: "Permits inside the reminder window",
    },
    {
      label: "Authority review",
      value: `${authorityReviewCount}`,
      note: "Packs pending external confirmation",
    },
    {
      label: "Active permits",
      value: `${validCount}`,
      note: "Current valid approvals on register",
    },
    {
      label: "Linked inspections",
      value: `${inspectionRecords.length}`,
      note: "Supporting evidence available for follow-up",
    },
  ];
  const hasFilters =
    activeType !== "all" ||
    activeStatus !== statusFilters[0] ||
    searchQuery.trim().length > 0;

  const openPermitPage = (record = selectedPermit) =>
    openPageWorkspace("imsPermit", record ? { record } : {}, "environmental");
  const openInspectionPage = (record = null, permit = selectedPermit) => {
    const nextRecord =
      record ||
      inspectionRecords.find((item) => item.id === permit?.linkedInspection) ||
      inspectionRecords[0];

    openPageWorkspace("imsInspection", nextRecord ? { record: nextRecord } : {}, "environmental");
  };
  const openTrainingPage = (permit = selectedPermit) =>
    openPageWorkspace(
      "environmentalTraining",
      permit ? { permit } : {},
      "environmental"
    );
  const openPermitBoard = (permit = selectedPermit) =>
    openPageWorkspace(
      "environmentalPack",
      permit ? { permit } : {},
      "environmental"
    );
  const resetFilters = () => {
    setActiveType("all");
    setActiveStatus(statusFilters[0]);
    setSearchQuery("");
  };

  return (
    <section
      className="module-page environmental environmental-page"
      aria-label="Environmental management"
    >
      <StorySpotlight
        eyebrow="Environmental management"
        title="Environmental permit and CNP lifecycle"
        description="Track application pack, authority review, active validity, and renewal handoff in one controlled register linked to inspection evidence."
        tags={["CNP", "Renewal control", "Validity register"]}
        primaryAction={{
          label: "Open CNP lifecycle",
          onClick: () => openPermitPage(cnpPermit),
        }}
        secondaryAction={{
          label: "Open control pack",
          onClick: () => openPermitBoard(cnpPermit),
        }}
        metrics={[
          { label: "Focus permit", value: cnpPermit?.id || "GW-RN0122" },
          { label: "Authority queue", value: `${authorityReviewCount} packs` },
          { label: "Next expiry", value: urgentPermit?.expiry || "2025-11-02" },
        ]}
      />

      <div className="dms-command environmental-command">
        <div>
          <p className="eyebrow">Environmental workspace</p>
          <div
            className="dms-view-toggle dms-library-toggle"
            role="tablist"
            aria-label="Permit filters"
          >
            {typeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={activeType === filter.id}
                className={activeType === filter.id ? "active" : ""}
                onClick={() => setActiveType(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="dms-path-meta">
            {permitRecords.length} active permits | {renewalDueCount} inside renewal window |{" "}
            {authorityReviewCount} under authority review
          </p>
        </div>

        <div className="dms-command-actions">
          <button className="primary-button" type="button" onClick={() => openPermitPage(cnpPermit)}>
            Start renewal pack
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => openInspectionPage(null, cnpPermit)}
          >
            Inspection board
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => openTrainingPage(cnpPermit)}
          >
            Training roster
          </button>
        </div>
      </div>

      <div className="environmental-shell">
        <div className="environmental-main">
          <div className="environmental-overview-grid">
            {signalCards.map((item) => (
              <article key={item.label} className="dms-signal-card">
                <p className="kpi-label">{item.label}</p>
                <h3 className="overview-value neutral">{item.value}</h3>
                <p className="kpi-delta">{item.note}</p>
              </article>
            ))}
          </div>

          <section className="dms-panel environmental-register-panel">
            <div className="dms-results-header">
              <div>
                <p className="panel-label">Permit register</p>
                <h3>Environmental approvals and renewal queue</h3>
              </div>
              <p className="dms-path-meta">{filteredPermits.length} records shown</p>
            </div>

            <div className="environmental-toolbar">
              <div className="dms-search environmental-search">
                <span className="search-icon">Search</span>
                <input
                  type="search"
                  placeholder="Search permit ID, type, owner, site"
                  aria-label="Search environmental permits"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <div className="dms-filter-row environmental-filter-row">
                {statusFilters.map((filter) => (
                  <button
                    key={filter}
                    className={`status-filter ${activeStatus === filter ? "active" : ""}`}
                    type="button"
                    onClick={() => setActiveStatus(filter)}
                  >
                    {filter}
                  </button>
                ))}
                {hasFilters ? (
                  <button className="ghost-button" type="button" onClick={resetFilters}>
                    Clear filters
                  </button>
                ) : null}
              </div>
            </div>

            <div className="environmental-step-grid">
              {lifecycleSummary.map((step) => (
                <div
                  key={step.label}
                  className={`environmental-step ${step.active ? "active" : ""}`}
                >
                  <div className="environmental-step-head">
                    <p className="environmental-step-title">{step.label}</p>
                    <span className="environmental-step-count">{step.count}</span>
                  </div>
                  <p className="environmental-step-detail">{step.detail}</p>
                </div>
              ))}
            </div>

            {filteredPermits.length ? (
              <div className="environmental-register">
                {filteredPermits.map((permit) => (
                  <button
                    key={permit.id}
                    className={`environmental-permit-card ${
                      selectedPermit?.id === permit.id ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => setSelectedPermitId(permit.id)}
                  >
                    <div className="environmental-permit-head">
                      <div>
                        <p className="environmental-permit-title">{permit.type}</p>
                        <p className="environmental-permit-meta">
                          {permit.id} · {permit.authority} · {permit.site}
                        </p>
                      </div>
                      <span
                        className={`status ${permit.status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {permit.status}
                      </span>
                    </div>
                    <p className="environmental-permit-body">{permit.scope}</p>
                    <div className="environmental-permit-foot">
                      <div>
                        <span>Lifecycle</span>
                        <strong>{permit.lifecycleStage}</strong>
                      </div>
                      <div>
                        <span>Expiry</span>
                        <strong>{permit.expiry}</strong>
                      </div>
                      <div>
                        <span>Next action</span>
                        <strong>{permit.nextAction}</strong>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="dms-empty-state">
                <p>No permit records match the current filters.</p>
                <button className="ghost-button" type="button" onClick={resetFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>

        {selectedPermit ? (
          <aside className="environmental-preview">
            <div className="preview-card">
              <div className="preview-header">
                <div className="environmental-icon" aria-hidden="true">
                  ENV
                </div>
                <div>
                  <p className="panel-label">Current permit</p>
                  <h3>{selectedPermit.type}</h3>
                  <p className="preview-sub">
                    {selectedPermit.id} | {selectedPermit.site}
                  </p>
                </div>
              </div>

              <div className="preview-actions">
                <button className="primary-button" type="button" onClick={() => openPermitPage(selectedPermit)}>
                  Open lifecycle
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openInspectionPage(null, selectedPermit)}
                >
                  Latest inspection
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openTrainingPage(selectedPermit)}
                >
                  Training record
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => openPermitBoard(selectedPermit)}
                >
                  Control pack
                </button>
              </div>

              <div className="preview-meta">
                {[
                  { label: "Permit ID", value: selectedPermit.id },
                  { label: "Authority", value: selectedPermit.authority },
                  { label: "Owner", value: selectedPermit.owner },
                  { label: "Expiry", value: selectedPermit.expiry },
                  { label: "Lifecycle", value: selectedPermit.lifecycleStage },
                  { label: "Linked inspection", value: selectedPermit.linkedInspection },
                ].map((item) => (
                  <div key={item.label} className="preview-meta-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="preview-section">
                <p className="panel-label">Control pack</p>
                <div className="environmental-linked-list">
                  {(selectedPermit.pack || []).map((item) => (
                    <div key={item} className="environmental-linked-item">
                      <div>
                        <p className="external-name">{item}</p>
                        <p className="external-scope">{selectedPermit.nextAction}</p>
                      </div>
                      <span className="external-expiry">Ready</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-section">
                <p className="panel-label">Linked records</p>
                <div className="environmental-linked-list">
                  <button
                    className="list-row list-row-button"
                    type="button"
                    onClick={() => openInspectionPage(null, selectedPermit)}
                  >
                    <div>
                      <p className="list-title">{selectedPermit.linkedInspection}</p>
                      <p className="list-meta">Inspection evidence</p>
                    </div>
                    <span className="data-link">Open</span>
                  </button>
                  <button
                    className="list-row list-row-button"
                    type="button"
                    onClick={() => openTrainingPage(selectedPermit)}
                  >
                    <div>
                      <p className="list-title">{selectedPermit.linkedTraining}</p>
                      <p className="list-meta">Training / briefing record</p>
                    </div>
                    <span className="data-link">View</span>
                  </button>
                  <button
                    className="list-row list-row-button"
                    type="button"
                    onClick={() => openPermitBoard(selectedPermit)}
                  >
                    <div>
                      <p className="list-title">Environmental control pack</p>
                      <p className="list-meta">Linked DMS issue and renewal documents</p>
                    </div>
                    <span className="data-link">Open</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
