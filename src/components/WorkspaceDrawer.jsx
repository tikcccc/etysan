import { useEffect, useState } from "react";
import { approvals, notifications, tasks } from "../data/modules.js";
import {
  dmsApprovals,
  dmsExternalAccess,
  dmsCategories,
  dmsDocuments,
} from "../data/dms.js";
import { hrEmployees, hrInjuries, hrTraining } from "../data/hr.js";
import { imsComplaints, imsInspections, imsPermits } from "../data/ims.js";
import {
  plantDisposals,
  plantFleet,
  plantInspections,
  plantJobs,
  plantTransfers,
} from "../data/plant.js";
import { incidents, workers } from "../data/safety.js";
import { procurementOrders } from "../data/procurement.js";
import { qsPayments } from "../data/qs.js";

const inspectionChecklist = [
  "Access route clear and segregated",
  "Hot work permit displayed on zone board",
  "Temporary edge protection intact",
  "Assigned subcontractor notified",
];

const procurementApprovers = [
  "Head of Cost & Commercial",
  "Technical Director",
  "Director",
  "President",
  "Vice Chairman",
];

const qsExtractedFields = [
  { label: "Invoice", value: "INV-2026-2088" },
  { label: "Measurement period", value: "Jan 1 - Jan 31" },
  { label: "Retention", value: "$22,500" },
  { label: "Certified quantity", value: "1,820 m3" },
];

const hrProfilePresets = {
  "EMP-1029": {
    department: "Digital Delivery",
    phone: "+852 6123 4088",
    email: "kenneth.hong@tysan.local",
    emergency: "W. Hong · +852 9142 7712",
    payroll: "Monthly salary + OT allowance",
    currentSite: "Head Office / multi-project support",
    certificates: [
      { title: "Green Card", expiry: "2026-11-12", status: "Valid" },
      { title: "BIM coordinator certificate", expiry: "2027-04-30", status: "Valid" },
    ],
    transfers: [
      "Assigned to HQ PMO for digital reporting rollout",
      "Supported Kai Tak Terminal site handover",
    ],
  },
  "EMP-2044": {
    department: "Operations",
    phone: "+852 6530 1204",
    email: "alan.yeung@tysan.local",
    emergency: "J. Yeung · +852 9832 5014",
    payroll: "Monthly salary + site allowance",
    currentSite: "Site J2401B1",
    certificates: [
      { title: "Green Card", expiry: "2025-12-31", status: "Expiring Soon" },
      { title: "A12 T1/T2", expiry: "2026-08-16", status: "Valid" },
    ],
    transfers: [
      "Transferred from Tsing Yi Logistics Hub to West Kowloon Rail Extension",
      "Approved manpower request for night shift concrete pour",
    ],
  },
  "EMP-D-882": {
    department: "Plant & Site Labor",
    phone: "+852 6770 2228",
    email: "chan.tm@tysan.local",
    emergency: "C. Man · +852 9680 1233",
    payroll: "Daily wage + attendance bonus",
    currentSite: "Site J2405C2",
    certificates: [
      { title: "Green Card", expiry: "2025-10-01", status: "Expiring Soon" },
      { title: "Confined Space Safety", expiry: "2025-10-01", status: "Urgent" },
    ],
    transfers: [
      "Moved from depot rigging crew to Site J2405C2",
      "Flagged for refresher training before gate access renewal",
    ],
  },
};

const imsComplaintPresets = {
  "CMP-25-003": {
    severity: "Major",
    owner: "Phoebe Ngan",
    source: "Client complaint hotline",
    rootCause: "Night work acoustic screen not repositioned after delivery unloading.",
    action: "Re-route unloading, install temporary acoustic barrier, and retrain night foreman.",
    dueDate: "2025-10-28",
  },
  "CMP-25-004": {
    severity: "Moderate",
    owner: "Keith Ngai",
    source: "Consultant site walk",
    rootCause: "Dust suppression team missed gate handover after pump maintenance.",
    action: "Add daily handover checkpoint and assign standby water truck.",
    dueDate: "2025-10-31",
  },
  "CMP-25-009": {
    severity: "Major",
    owner: "Wilson Lam",
    source: "Project director escalation",
    rootCause: "Rectification photos uploaded after the contractual response window.",
    action: "Lock response SLA in NCR tracker and route photo proof to reviewer on submission.",
    dueDate: "2025-11-02",
  },
};

const plantAssetPresets = {
  "HBO-50": {
    serial: "SN-HBO-50-3321",
    hireMode: "Internal fleet",
    operator: "Tower Crane Team A",
    nextInspection: "2025-11-03",
  },
  "RCD-02": {
    serial: "SN-RCD-02-1187",
    hireMode: "Internal fleet",
    operator: "Depot maintenance crew",
    nextInspection: "2025-10-31",
  },
  "GEN-09": {
    serial: "SN-GEN-09-8802",
    hireMode: "External hire",
    operator: "Site J2405C2 utilities team",
    nextInspection: "2025-11-06",
  },
};

const plantInspectionChecklist = [
  "Operator checklist signed before start of shift",
  "Emergency stop and guards inspected",
  "Maintenance log attached to the machine",
  "Off-hire / idle status reviewed against utilization",
];

function statusClass(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function timelineStamp(value) {
  return `${value} · Audit trail recorded`;
}

function closeActionLabel(surface) {
  return surface === "page" ? "Back to module" : "Close panel";
}

function priorityTone(value = "") {
  if (value === "High") {
    return "urgent";
  }

  if (value === "Medium") {
    return "review";
  }

  return "approved";
}

function isNotificationTab(value) {
  return value === "tasks" || value === "approvals" || value === "notifications";
}

function findHrEmployeeByName(name = "") {
  return hrEmployees.find((employee) => employee.name === name) || null;
}

function enrichHrEmployee(seed) {
  if (!seed) {
    return { ...hrEmployees[0], ...hrProfilePresets[hrEmployees[0].id] };
  }

  if (seed.id) {
    return {
      ...seed,
      ...(hrProfilePresets[seed.id] || {}),
    };
  }

  if (seed.employee) {
    const existing = findHrEmployeeByName(seed.employee);

    if (existing) {
      return {
        ...existing,
        ...(hrProfilePresets[existing.id] || {}),
      };
    }

    return {
      id: `EMP-${seed.employee.replace(/[^A-Z0-9]+/gi, "").slice(0, 6).toUpperCase() || "TEMP"}`,
      name: seed.employee,
      role: "Site staff",
      type: "Monthly",
      site: "Shared workforce pool",
      greenCard: "Pending verification",
      status: "Active",
      department: "Operations",
      phone: "+852 6000 0000",
      email: `${seed.employee.toLowerCase().replace(/\s+/g, ".")}@tysan.local`,
      emergency: "Pending contact",
      payroll: "Pending payroll sync",
      currentSite: "Assigned through HR pool",
      certificates: [],
      transfers: ["Profile created from linked workflow record"],
    };
  }

  return {
    ...hrEmployees[0],
    ...(hrProfilePresets[hrEmployees[0].id] || {}),
  };
}

function findPlantAsset(plantId = "") {
  const asset = plantFleet.find((item) => item.id === plantId) || plantFleet[0];

  return {
    ...asset,
    ...(plantAssetPresets[asset.id] || {}),
  };
}

function WorkspaceShell({
  moduleLabel,
  title,
  subtitle,
  badge,
  badgeTone = "info",
  children,
  footer,
}) {
  return (
    <>
      <div className="workspace-header">
        <div className="workspace-header-main">
          <p className="workspace-eyebrow">{moduleLabel}</p>
          <h2 className="workspace-title">{title}</h2>
          {subtitle ? <p className="workspace-subtitle">{subtitle}</p> : null}
        </div>
        {badge ? (
          <span className={`workspace-badge ${badgeTone}`}>{badge}</span>
        ) : null}
      </div>
      <div className="workspace-scroll">{children}</div>
      {footer ? <div className="workspace-footer">{footer}</div> : null}
    </>
  );
}

function DrawerSection({ title, subtitle, children, aside }) {
  return (
    <section className="workspace-card">
      {(title || subtitle || aside) && (
        <div className="workspace-card-head">
          <div>
            {title ? <h3>{title}</h3> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

function MetaGrid({ items }) {
  return (
    <div className="workspace-meta-grid">
      {items.map((item) => (
        <div key={item.label} className="workspace-meta-item">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function StepRail({ steps, current }) {
  return (
    <div className="workspace-stepper">
      {steps.map((step, index) => {
        const tone =
          index < current ? "done" : index === current ? "active" : "";
        return (
          <div key={step.label} className={`workspace-step ${tone}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p>{step.label}</p>
              {step.detail ? <small>{step.detail}</small> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="workspace-timeline">
      {items.map((item) => (
        <div key={`${item.title}-${item.meta}`} className="workspace-timeline-row">
          <span className="workspace-timeline-dot" aria-hidden="true" />
          <div>
            <p className="workspace-timeline-title">{item.title}</p>
            <p className="workspace-timeline-meta">{item.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, helper, wide = false, children }) {
  return (
    <label className={`workspace-field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {children}
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}

function DocumentCanvas({ title, caption }) {
  return (
    <div className="workspace-document">
      <div className="workspace-document-bar">
        <strong>{title}</strong>
        <span>{caption}</span>
      </div>
      <div className="workspace-document-paper">
        <h4>{title}</h4>
        <p>
          Controlled issue copy. Review route, watermark policy, access scope,
          and audit metadata are attached to this document set.
        </p>
        <div className="workspace-document-lines">
          <span className="wide" />
          <span />
          <span />
          <span className="short" />
        </div>
      </div>
    </div>
  );
}

function MobileFrame({ title, subtitle, children }) {
  return (
    <div className="workspace-mobile">
      <div className="workspace-mobile-header">
        <div>
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        <span className="workspace-mobile-status">Live</span>
      </div>
      <div className="workspace-mobile-screen">{children}</div>
    </div>
  );
}

function InfoBoardWorkspace({ closeWorkspace, payload }) {
  return (
    <WorkspaceShell
      moduleLabel={payload.moduleLabel || "Operations"}
      title={payload.title}
      subtitle={payload.subtitle}
      badge={payload.badge}
      badgeTone={payload.badgeTone || "info"}
      footer={
        <button className="primary-button" type="button" onClick={closeWorkspace}>
          Close panel
        </button>
      }
    >
      <div className="workspace-stack">
        {payload.sections.map((section) => (
          <DrawerSection
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
          >
            <div className="workspace-info-list">
              {section.items.map((item) => (
                <article
                  key={`${section.title}-${item.title}`}
                  className="workspace-info-item"
                >
                  <div>
                    <p className="workspace-info-title">{item.title}</p>
                    {item.detail ? (
                      <p className="workspace-info-detail">{item.detail}</p>
                    ) : null}
                  </div>
                  <div className="workspace-info-meta">
                    {item.meta ? <span>{item.meta}</span> : null}
                    {item.badge ? (
                      <span className={`workspace-badge ${item.badgeTone || "muted"}`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </DrawerSection>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function NotificationCenterWorkspace({
  closeWorkspace,
  navigateToView,
  openPageWorkspace,
  openWorkspace,
  resolveRecord,
  workspace,
}) {
  const approvalQueue = approvals.map((item) => resolveRecord("approvals", item));
  const notificationTabs = [
    {
      id: "tasks",
      label: "To-do list",
      count: tasks.length,
      subtitle: "Outstanding work items and upcoming deliverables.",
    },
    {
      id: "approvals",
      label: "Pending approvals",
      count: approvalQueue.length,
      subtitle: "Decision items routed from QS, procurement, safety, and HR.",
    },
    {
      id: "notifications",
      label: "Notifications",
      count: notifications.length,
      subtitle: "Unread updates and reminders from connected modules.",
    },
  ];
  const initialTab =
    isNotificationTab(workspace?.payload?.initialTab)
      ? workspace.payload.initialTab
      : workspace?.kind === "approvalInbox"
        ? "approvals"
        : "tasks";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const activeTabMeta =
    notificationTabs.find((item) => item.id === activeTab) || notificationTabs[0];

  function openTaskTarget(task) {
    switch (task.module) {
      case "Environmental":
        openPageWorkspace?.(
          "imsInspection",
          { record: resolveRecord("imsInspections", imsInspections[0]) },
          "ims"
        );
        return;
      case "Project DMS":
        openPageWorkspace?.(
          "dmsReview",
          { record: resolveRecord("dmsDocuments", dmsDocuments[0]) },
          "dms"
        );
        return;
      case "Procurement":
        openPageWorkspace?.(
          "procurementOrder",
          { record: resolveRecord("procurementOrders", procurementOrders[0]) },
          "procurement"
        );
        return;
      case "Plant":
        openPageWorkspace?.(
          "plantInspection",
          { record: resolveRecord("plantInspections", plantInspections[0]) },
          "plant"
        );
        return;
      default:
        openWorkspace("infoBoard", {
          badge: task.priority,
          badgeTone:
            task.priority === "High"
              ? "urgent"
              : task.priority === "Medium"
                ? "review"
                : "approved",
          moduleLabel: task.module,
          sections: [
            {
              title: "Task detail",
              items: [
                {
                  title: task.title,
                  detail: `${task.module} · Due ${task.due}`,
                  badge: task.priority,
                  badgeTone:
                    task.priority === "High"
                      ? "urgent"
                      : task.priority === "Medium"
                        ? "review"
                        : "approved",
                },
              ],
            },
          ],
          subtitle: "Task routing and next action guidance.",
          title: "Task record",
        });
    }
  }

  function openNotificationTarget(item) {
    switch (item.title) {
      case "Safety":
        openPageWorkspace?.(
          "safetyIncident",
          { record: resolveRecord("safetyIncidents", incidents[0]) },
          "safety"
        );
        return;
      case "Procurement":
        openPageWorkspace?.(
          "procurementOrder",
          { record: resolveRecord("procurementOrders", procurementOrders[0]) },
          "procurement"
        );
        return;
      case "DMS / Material Summary":
        openPageWorkspace?.(
          "dmsReview",
          { record: resolveRecord("dmsDocuments", dmsDocuments[0]) },
          "dms"
        );
        return;
      case "Plant":
        openPageWorkspace?.(
          "plantJobSheet",
          { record: resolveRecord("plantJobs", plantJobs[0]) },
          "plant"
        );
        return;
      default:
        openWorkspace("infoBoard", {
          badge: "Unread",
          badgeTone: "review",
          moduleLabel: item.title,
          sections: [
            {
              title: item.title,
              items: [
                {
                  title: item.title,
                  detail: item.detail,
                  meta: "System notification",
                  badge: "Open",
                  badgeTone: "review",
                },
              ],
            },
          ],
          subtitle: "Notification routing, source module, and follow-up controls.",
          title: "Notification record",
        });
    }
  }

  return (
    <WorkspaceShell
      moduleLabel="Home"
      title="Notification Center"
      subtitle="Tabbed hub for action items, approvals, and cross-module notifications."
      badge={`${tasks.length + approvalQueue.length + notifications.length} live`}
      badgeTone="review"
      footer={
        <button className="primary-button" type="button" onClick={closeWorkspace}>
          Close panel
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <div className="workspace-tab-shell">
            <div className="workspace-tabs" role="tablist" aria-label="Notification center sections">
              {notificationTabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    id={`notification-tab-${tab.id}`}
                    className={`workspace-tab ${isActive ? "active" : ""}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`notification-panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="workspace-tab-label">{tab.label}</span>
                    <span className="workspace-tab-count">{tab.count}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === "tasks" ? (
              <DrawerSection
                title="To-do list"
                subtitle="Outstanding work items and upcoming deliverables."
              >
                <div
                  id="notification-panel-tasks"
                  className="workspace-table-list"
                  role="tabpanel"
                  aria-labelledby="notification-tab-tasks"
                >
                  {tasks.map((task) => (
                    <button
                      key={`${task.module}-${task.title}`}
                      className="workspace-table-row"
                      type="button"
                      onClick={() => openTaskTarget(task)}
                    >
                      <div>
                        <p className="workspace-info-title">{task.title}</p>
                        <p className="workspace-info-detail">
                          {task.module} · Due {task.due}
                        </p>
                      </div>
                      <div className="workspace-info-meta">
                        <span className={`workspace-badge ${priorityTone(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </DrawerSection>
            ) : null}

            {activeTab === "approvals" ? (
              <DrawerSection
                title="Pending approvals"
                subtitle="Decision items routed from QS, procurement, safety, and HR."
              >
                <div
                  id="notification-panel-approvals"
                  className="workspace-table-list"
                  role="tabpanel"
                  aria-labelledby="notification-tab-approvals"
                >
                  {approvalQueue.map((item) => (
                    <button
                      key={item.id}
                      className="workspace-table-row"
                      type="button"
                      onClick={() =>
                        openWorkspace("approvalRecord", {
                          record: item,
                        })
                      }
                    >
                      <div>
                        <p className="workspace-info-title">{item.title}</p>
                        <p className="workspace-info-detail">
                          {item.id} · {item.module} · Owner {item.owner}
                        </p>
                      </div>
                      <div className="workspace-info-meta">
                        <span>{item.due}</span>
                        <span className={`workspace-badge ${statusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </DrawerSection>
            ) : null}

            {activeTab === "notifications" ? (
              <DrawerSection
                title="Notifications"
                subtitle="Unread updates and reminders from connected modules."
              >
                <div
                  id="notification-panel-notifications"
                  className="workspace-table-list"
                  role="tabpanel"
                  aria-labelledby="notification-tab-notifications"
                >
                  {notifications.map((item) => (
                    <button
                      key={`${item.title}-${item.detail}`}
                      className="workspace-table-row"
                      type="button"
                      onClick={() => openNotificationTarget(item)}
                    >
                      <div>
                        <p className="workspace-info-title">{item.title}</p>
                        <p className="workspace-info-detail">{item.detail}</p>
                      </div>
                      <div className="workspace-info-meta">
                        <span className="workspace-badge review">Unread</span>
                      </div>
                    </button>
                  ))}
                </div>
              </DrawerSection>
            ) : null}
          </div>
        </div>

        <div className="workspace-stack">
          <DrawerSection title="Center summary">
            <MetaGrid
              items={[
                { label: "Current tab", value: activeTabMeta.label },
                { label: "Items shown", value: String(activeTabMeta.count) },
                { label: "To-do", value: `${tasks.length} open` },
                { label: "Approvals", value: `${approvalQueue.length} routed` },
                { label: "Notifications", value: `${notifications.length} unread` },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Category note" subtitle={activeTabMeta.subtitle}>
            <div className="workspace-note">
              <p>
                Tabs separate action queues from FYI updates, while keeping every
                item inside the same cross-module center.
              </p>
            </div>
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ApprovalRecordWorkspace({ payload, updateRecord }) {
  const record = payload.record;
  const [status, setStatus] = useState(record.status);
  const [timeline, setTimeline] = useState([
    {
      title: "Submitted into central workflow",
      meta: timelineStamp(`${record.id} · Routed by ${record.owner}`),
    },
    {
      title: "Reviewer SLA triggered",
      meta: timelineStamp(`Due ${record.due}`),
    },
  ]);

  const actionFooter = (
    <>
      <button
        className="secondary-button"
        type="button"
        onClick={() => {
          setStatus("Review");
          updateRecord("approvals", record.id, { status: "Review" });
          setTimeline((current) => [
            {
              title: "Returned for clarification",
              meta: timelineStamp("Comment added by reviewer"),
            },
            ...current,
          ]);
        }}
      >
        Return
      </button>
      <button
        className="primary-button"
        type="button"
        onClick={() => {
          setStatus("Approved");
          updateRecord("approvals", record.id, { status: "Approved" });
          setTimeline((current) => [
            {
              title: "Approved for downstream processing",
              meta: timelineStamp("Decision signed electronically"),
            },
            ...current,
          ]);
        }}
      >
        Approve
      </button>
    </>
  );

  return (
    <WorkspaceShell
      moduleLabel={record.module}
      title={record.title}
      subtitle="Formal approval record with SLA tracking, comments, and release controls."
      badge={status}
      badgeTone={statusClass(status)}
      footer={actionFooter}
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Record summary">
            <MetaGrid
              items={[
                { label: "Reference", value: record.id },
                { label: "Owner", value: record.owner },
                { label: "Module", value: record.module },
                { label: "Due", value: record.due },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Decision notes">
            <div className="workspace-note">
              <p>
                Supporting documentation has been verified against routing rules,
                responsibility matrix, and delegated authority limits.
              </p>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={status === "Approved" ? 3 : status === "Review" ? 1 : 2}
              steps={[
                { label: "Submitted", detail: "Requester" },
                { label: "Review", detail: "Reviewer" },
                { label: "Approval", detail: "Approver" },
                { label: "Released", detail: "System" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function DmsReviewWorkspace({
  payload,
  openWorkspace,
  updateRecord,
}) {
  const doc = payload.record;
  const [status, setStatus] = useState(doc.status);
  const [timeline, setTimeline] = useState([
    {
      title: "OCR and metadata indexing completed",
      meta: timelineStamp(`${doc.id} · ${doc.owner}`),
    },
    {
      title: "Review route assigned",
      meta: timelineStamp("QS Team -> Director"),
    },
    {
      title: "External share policy enforced",
      meta: timelineStamp(doc.externalAccess),
    },
  ]);

  const footer = (
    <>
      <button
        className="secondary-button"
        type="button"
        onClick={() => {
          setStatus("Review");
          updateRecord("dmsDocuments", doc.id, { status: "Review" });
          if (payload.source?.id) {
            updateRecord("approvals", payload.source.id, { status: "Review" });
          }
          setTimeline((current) => [
            {
              title: "Revision requested",
              meta: timelineStamp("Comment issued to document owner"),
            },
            ...current,
          ]);
        }}
      >
        Request amendment
      </button>
      <button
        className="ghost-button"
        type="button"
        onClick={() =>
          openWorkspace("dmsShare", {
            record: { ...doc, status },
          })
        }
      >
        Share externally
      </button>
      <button
        className="primary-button"
        type="button"
        onClick={() => {
          setStatus("Approved");
          updateRecord("dmsDocuments", doc.id, { status: "Approved" });
          if (payload.source?.id) {
            updateRecord("approvals", payload.source.id, { status: "Approved" });
          }
          setTimeline((current) => [
            {
              title: "Record approved for issue",
              meta: timelineStamp("Consultant link released with watermark"),
            },
            ...current,
          ]);
        }}
      >
        Approve for issue
      </button>
    </>
  );

  return (
    <WorkspaceShell
      moduleLabel="Document Management"
      title={doc.title}
      subtitle="Controlled review of record metadata, routing, and external access."
      badge={status}
      badgeTone={statusClass(status)}
      footer={footer}
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Controlled copy" subtitle={`${doc.id} · ${doc.category}`}>
            <DocumentCanvas title={doc.title} caption={`${doc.type} · ${doc.size}`} />
          </DrawerSection>
          <DrawerSection title="Record metadata">
            <MetaGrid
              items={[
                { label: "Library", value: `${doc.library} DMS` },
                { label: "Phase", value: doc.phase },
                { label: "Owner", value: doc.owner },
                { label: "Updated", value: doc.updated },
                { label: "OCR", value: doc.ocr ? "Indexed" : "Not required" },
                { label: "Encryption", value: doc.encrypted ? "Enabled" : "Standard" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Category routing">
            <div className="workspace-chip-grid">
              {dmsCategories.slice(0, 6).map((category) => (
                <span
                  key={category.code}
                  className={`workspace-chip ${
                    category.name === doc.category ? "active" : ""
                  }`}
                >
                  {category.code}
                </span>
              ))}
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Approval routing">
            <div className="workspace-approval-list">
              {dmsApprovals.map((step) => (
                <div key={step.step} className="workspace-approval-row">
                  <div>
                    <strong>{step.step}</strong>
                    <span>{step.name}</span>
                  </div>
                  <span className={`workspace-badge ${statusClass(step.status)}`}>
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title="External access">
            <div className="workspace-list">
              {dmsExternalAccess.map((item) => (
                <div key={item.name} className="workspace-list-row">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.scope}</span>
                  </div>
                  <span>{item.expiry}</span>
                </div>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function DmsUploadWorkspace({ closeWorkspace, payload }) {
  const [form, setForm] = useState({
    title: "Safety inspection evidence pack",
    category: dmsCategories[9]?.name || "Inspection Form / Photos",
    phase: "Construction",
    owner: "S. Ahmed",
    library: payload.library || "Project DMS",
    version: "Rev A",
    access: "Internal review",
    watermark: "Enabled",
  });
  const [submitted, setSubmitted] = useState(false);

  const footer = submitted ? (
    <button className="primary-button" type="button" onClick={closeWorkspace}>
      Close panel
    </button>
  ) : (
    <button
      className="primary-button"
      type="button"
      onClick={() => setSubmitted(true)}
    >
      Submit for review
    </button>
  );

  return (
    <WorkspaceShell
      moduleLabel="Document Management"
      title="New controlled record"
      subtitle="Create a governed document entry with routing, classification, and access policy."
      badge={submitted ? "Indexed" : "Draft"}
      badgeTone={submitted ? "approved" : "muted"}
      footer={footer}
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Record details">
            <div className="workspace-form-grid">
              <Field label="Title" wide>
                <input
                  className="workspace-input"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                />
              </Field>
              <Field label="Library">
                <select
                  className="workspace-select"
                  value={form.library}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, library: event.target.value }))
                  }
                >
                  <option>Project DMS</option>
                  <option>Safety DMS</option>
                </select>
              </Field>
              <Field label="Phase">
                <select
                  className="workspace-select"
                  value={form.phase}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phase: event.target.value }))
                  }
                >
                  <option>Tender</option>
                  <option>Design</option>
                  <option>Construction</option>
                  <option>Handover</option>
                </select>
              </Field>
              <Field label="Category" wide>
                <select
                  className="workspace-select"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                >
                  {dmsCategories.map((category) => (
                    <option key={category.code}>{category.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Owner">
                <input
                  className="workspace-input"
                  value={form.owner}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, owner: event.target.value }))
                  }
                />
              </Field>
              <Field label="Version">
                <input
                  className="workspace-input"
                  value={form.version}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, version: event.target.value }))
                  }
                />
              </Field>
              <Field label="External access">
                <select
                  className="workspace-select"
                  value={form.access}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, access: event.target.value }))
                  }
                >
                  <option>Internal review</option>
                  <option>Consultant issue</option>
                  <option>Subcontractor issue</option>
                </select>
              </Field>
              <Field label="Watermark">
                <select
                  className="workspace-select"
                  value={form.watermark}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      watermark: event.target.value,
                    }))
                  }
                >
                  <option>Enabled</option>
                  <option>Hidden internal</option>
                </select>
              </Field>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Review route">
            <StepRail
              current={submitted ? 3 : 1}
              steps={[
                { label: "Upload", detail: "Owner" },
                { label: "Index", detail: "System" },
                { label: "Review", detail: "QS" },
                { label: "Approve", detail: "Director" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Control summary">
            <MetaGrid
              items={[
                { label: "Classification", value: form.category },
                { label: "Retention", value: "Project controlled file" },
                { label: "Share mode", value: form.access },
                { label: "Watermark", value: form.watermark },
              ]}
            />
          </DrawerSection>
          {submitted ? (
            <DrawerSection title="Result">
              <div className="workspace-note success">
                <p>Record filed as DMS-2488 and routed for controlled review.</p>
              </div>
            </DrawerSection>
          ) : null}
        </div>
      </div>
    </WorkspaceShell>
  );
}

function DmsShareWorkspace({ closeWorkspace, payload }) {
  const doc = payload.record;
  const [form, setForm] = useState({
    recipient: "AEC Consultants",
    scope: doc.category,
    expiry: "2026-02-10",
    allowDownload: "View only",
    watermark: "Named watermark",
  });
  const [shared, setShared] = useState(false);

  return (
    <WorkspaceShell
      moduleLabel="Document Management"
      title="External share control"
      subtitle={doc.title}
      badge={shared ? "Link active" : "Draft link"}
      badgeTone={shared ? "approved" : "muted"}
      footer={
        <button
          className="primary-button"
          type="button"
          onClick={shared ? closeWorkspace : () => setShared(true)}
        >
          {shared ? "Close panel" : "Release secure link"}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Share scope">
            <div className="workspace-form-grid">
              <Field label="Recipient">
                <input
                  className="workspace-input"
                  value={form.recipient}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      recipient: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Expiry">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.expiry}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      expiry: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Access mode">
                <select
                  className="workspace-select"
                  value={form.allowDownload}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      allowDownload: event.target.value,
                    }))
                  }
                >
                  <option>View only</option>
                  <option>Download permitted</option>
                </select>
              </Field>
              <Field label="Watermark">
                <select
                  className="workspace-select"
                  value={form.watermark}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      watermark: event.target.value,
                    }))
                  }
                >
                  <option>Named watermark</option>
                  <option>Confidential watermark</option>
                </select>
              </Field>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Share controls">
            <MetaGrid
              items={[
                { label: "Document", value: doc.id },
                { label: "Category", value: doc.category },
                { label: "Recipient", value: form.recipient },
                { label: "Expiry", value: form.expiry },
              ]}
            />
          </DrawerSection>
          {shared ? (
            <DrawerSection title="Released">
              <div className="workspace-note success">
                <p>Secure link is active and logged in the external access register.</p>
              </div>
            </DrawerSection>
          ) : null}
        </div>
      </div>
    </WorkspaceShell>
  );
}

function SafetyInspectionWorkspace({ closeWorkspace, payload, surface }) {
  const inspection = payload.record || {
    id: "PAT-219",
    title: "Tower crane pre-start checklist",
    zone: "Zone B",
    due: "2026-01-29 16:00",
  };
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({
    severity: "Serious",
    zone: inspection.zone,
    subcontractor: "East Harbor Steelworks",
    dueDate: "2026-01-30",
    notes: "Unprotected cable edge on temporary platform access.",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Checklist opened on mobile",
      meta: timelineStamp(`${inspection.id} · Offline capable`),
    },
  ]);

  const actionLabel =
    stage === 1 ? "Assign issue" : stage === 2 ? "Record rectification" : "Verify close";

  function advance() {
    if (stage === 1) {
      setStage(2);
      setTimeline((current) => [
        {
          title: "Issue assigned to subcontractor",
          meta: timelineStamp(`${form.subcontractor} · Due ${form.dueDate}`),
        },
        ...current,
      ]);
      return;
    }

    if (stage === 2) {
      setStage(3);
      setTimeline((current) => [
        {
          title: "Rectification evidence uploaded",
          meta: timelineStamp("Before and after photos received"),
        },
        ...current,
      ]);
      return;
    }

    setStage(4);
    setTimeline((current) => [
      {
        title: "Issue verified and closed",
        meta: timelineStamp("Safety officer signed closure"),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="Safety"
      title="Ad-hoc issue workflow"
      subtitle={`${inspection.title} · ${inspection.zone}`}
      badge={stage === 4 ? "Closed" : stage === 3 ? "Verification" : "Open"}
      badgeTone={stage === 4 ? "approved" : stage === 3 ? "review" : "urgent"}
      footer={
        <button
          className="primary-button"
          type="button"
          onClick={stage === 4 ? closeWorkspace : advance}
        >
          {stage === 4 ? closeActionLabel(surface) : actionLabel}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Field capture">
            <MobileFrame title="Site patrol" subtitle={`${inspection.id} · ${inspection.due}`}>
              <div className="workspace-mobile-list">
                {inspectionChecklist.map((item) => (
                  <div key={item} className="workspace-mobile-item">
                    <span className="workspace-mobile-check" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </MobileFrame>
          </DrawerSection>
          <DrawerSection title="Issue form">
            <div className="workspace-form-grid">
              <Field label="Severity">
                <select
                  className="workspace-select"
                  value={form.severity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      severity: event.target.value,
                    }))
                  }
                >
                  <option>Minor</option>
                  <option>Serious</option>
                  <option>Immediate work stoppage</option>
                </select>
              </Field>
              <Field label="Zone">
                <input
                  className="workspace-input"
                  value={form.zone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, zone: event.target.value }))
                  }
                />
              </Field>
              <Field label="Assigned subcontractor" wide>
                <input
                  className="workspace-input"
                  value={form.subcontractor}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subcontractor: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Rectification due">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      dueDate: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Geo tag">
                <input className="workspace-input" value="Grid B4 / EL +12.5" readOnly />
              </Field>
              <Field label="Observation" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Log issue", detail: "Safety officer" },
                { label: "Assign", detail: "Subcontractor" },
                { label: "Rectify", detail: "Evidence upload" },
                { label: "Verify", detail: "Safety close-out" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Evidence">
            <div className="workspace-evidence-grid">
              <div className="workspace-evidence-card">
                <strong>Before</strong>
                <span>Photo and markup attached</span>
              </div>
              <div className="workspace-evidence-card">
                <strong>After</strong>
                <span>{stage >= 3 ? "Rectification image uploaded" : "Awaiting upload"}</span>
              </div>
            </div>
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function SafetyIncidentWorkspace({
  closeWorkspace,
  payload,
  surface,
  updateRecord,
}) {
  const record = payload.record || incidents[0];
  const [stage, setStage] = useState(record.stage || 1);
  const [preliminary, setPreliminary] = useState({
    type: "Minor Injury",
    location: "Site A - Zone 3",
    occurredAt: "2026-01-29 10:15",
    immediateAction: "Area isolated and first aid completed.",
  });
  const [investigation, setInvestigation] = useState({
    rootCause: "Temporary access route was not segregated from lifting path.",
    correctiveAction: "Reissue access route, update toolbox talk, and add barricade.",
    owner: "Site Safety Manager",
    dueDate: "2026-02-01",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Incident record created",
      meta: timelineStamp(record.ref),
    },
  ]);

  function submitStage() {
    if (stage === 1) {
      setStage(2);
      updateRecord("safetyIncidents", record.ref, { stage: 2 });
      if (payload.source?.id) {
        updateRecord("approvals", payload.source.id, { status: "Review" });
      }
      setTimeline((current) => [
        {
          title: "Preliminary report submitted",
          meta: timelineStamp(preliminary.occurredAt),
        },
        ...current,
      ]);
      return;
    }

    setStage(3);
    updateRecord("safetyIncidents", record.ref, { stage: 3 });
    if (payload.source?.id) {
      updateRecord("approvals", payload.source.id, { status: "Approved" });
    }
    setTimeline((current) => [
      {
        title: "Investigation closed with RCA",
        meta: timelineStamp(investigation.owner),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="Safety"
      title="Incident record"
      subtitle={record.ref}
      badge={stage === 3 ? "Closed" : stage === 2 ? "Investigation" : "Preliminary"}
      badgeTone={stage === 3 ? "approved" : stage === 2 ? "review" : "urgent"}
      footer={
        <button
          className="primary-button"
          type="button"
          onClick={stage === 3 ? closeWorkspace : submitStage}
        >
          {stage === 1
            ? "Submit preliminary"
            : stage === 2
              ? "Close investigation"
              : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Preliminary report">
            <div className="workspace-form-grid">
              <Field label="Incident type">
                <input
                  className="workspace-input"
                  value={preliminary.type}
                  onChange={(event) =>
                    setPreliminary((current) => ({
                      ...current,
                      type: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Location">
                <input
                  className="workspace-input"
                  value={preliminary.location}
                  onChange={(event) =>
                    setPreliminary((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Occurred at" wide>
                <input
                  className="workspace-input"
                  value={preliminary.occurredAt}
                  onChange={(event) =>
                    setPreliminary((current) => ({
                      ...current,
                      occurredAt: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Immediate action" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={preliminary.immediateAction}
                  onChange={(event) =>
                    setPreliminary((current) => ({
                      ...current,
                      immediateAction: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Investigation and RCA">
            <div className="workspace-form-grid">
              <Field label="Root cause" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={investigation.rootCause}
                  onChange={(event) =>
                    setInvestigation((current) => ({
                      ...current,
                      rootCause: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Corrective action" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={investigation.correctiveAction}
                  onChange={(event) =>
                    setInvestigation((current) => ({
                      ...current,
                      correctiveAction: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Action owner">
                <input
                  className="workspace-input"
                  value={investigation.owner}
                  onChange={(event) =>
                    setInvestigation((current) => ({
                      ...current,
                      owner: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Close due">
                <input
                  className="workspace-input"
                  type="date"
                  value={investigation.dueDate}
                  onChange={(event) =>
                    setInvestigation((current) => ({
                      ...current,
                      dueDate: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Preliminary", detail: "Initial record" },
                { label: "Investigation", detail: "Management review" },
                { label: "Closed", detail: "RCA signed" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Case summary">
            <MetaGrid
              items={[
                { label: "Reference", value: record.ref },
                { label: "Title", value: record.title },
                { label: "Status", value: stage === 3 ? "Closed" : "Open" },
                { label: "Manager alert", value: "Triggered" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function SafetyAttendanceWorkspace({ closeWorkspace, surface }) {
  const [mode, setMode] = useState("Tap card");
  const [sessionState, setSessionState] = useState("Ready");
  const [roster, setRoster] = useState(
    workers.map((worker, index) => ({
      ...worker,
      present: index === 0,
    }))
  );
  const presentCount = roster.filter((worker) => worker.present).length;

  return (
    <WorkspaceShell
      moduleLabel="Safety"
      title="Toolbox talk attendance"
      subtitle="Mass attendance capture with manual fallback and training record sync."
      badge={sessionState}
      badgeTone={sessionState === "Synced" ? "approved" : "review"}
      footer={
        <button
          className="primary-button"
          type="button"
          onClick={() =>
            sessionState === "Synced"
              ? closeWorkspace()
              : setSessionState((current) =>
                  current === "Ready" ? "Live" : current === "Live" ? "Synced" : "Synced"
                )
          }
        >
          {sessionState === "Ready"
            ? "Start session"
            : sessionState === "Live"
              ? "Sync attendance"
              : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Session setup">
            <div className="workspace-form-grid">
              <Field label="Topic">
                <input className="workspace-input" defaultValue="Lifting route segregation" />
              </Field>
              <Field label="Site">
                <input className="workspace-input" defaultValue="West Kowloon Rail Extension" />
              </Field>
              <Field label="Attendance mode">
                <select
                  className="workspace-select"
                  value={mode}
                  onChange={(event) => setMode(event.target.value)}
                >
                  <option>Tap card</option>
                  <option>Manual mode</option>
                </select>
              </Field>
              <Field label="Trainer">
                <input className="workspace-input" defaultValue="Safety Officer Chan" />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Attendance roster">
            <div className="workspace-list">
              {roster.map((worker) => (
                <label key={worker.id} className="workspace-list-row selectable">
                  <div>
                    <strong>{worker.name}</strong>
                    <span>
                      {worker.id} · {worker.trade}
                    </span>
                  </div>
                  <input
                    checked={worker.present}
                    type="checkbox"
                    onChange={() =>
                      setRoster((current) =>
                        current.map((item) =>
                          item.id === worker.id
                            ? { ...item, present: !item.present }
                            : item
                        )
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Attendance summary">
            <MetaGrid
              items={[
                { label: "Method", value: mode },
                { label: "Present", value: `${presentCount} workers` },
                { label: "Fallback", value: "Search by ID or phone" },
                { label: "Sync target", value: "HR + Safety records" },
              ]}
            />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function HrManpowerRequestWorkspace({ closeWorkspace, surface }) {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({
    project: "West Kowloon Rail Extension",
    position: "Site Engineer",
    employmentType: "Monthly",
    headcount: "2",
    neededBy: "2026-02-12",
    requestedBy: "Alan Yeung",
    approver: "Lisa Ko",
    justification: "Night shift structural pour and handover reporting coverage.",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Manpower request drafted",
      meta: timelineStamp(`${form.project} · ${form.position}`),
    },
  ]);

  function advance() {
    if (stage === 1) {
      setStage(2);
      setTimeline((current) => [
        {
          title: "Department approval routed",
          meta: timelineStamp(`${form.headcount} headcount requested by ${form.requestedBy}`),
        },
        ...current,
      ]);
      return;
    }

    setStage(3);
    setTimeline((current) => [
      {
        title: "Recruitment sourcing launched",
        meta: timelineStamp("Candidate shortlist and onboarding checklist created"),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="Human Resources"
      title="Online manpower request"
      subtitle="Project staffing request with headcount approval, sourcing, and onboarding preparation."
      badge={stage === 3 ? "Sourcing live" : stage === 2 ? "Approval route" : "Draft"}
      badgeTone={stage === 3 ? "approved" : stage === 2 ? "review" : "muted"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 1
            ? "Submit request"
            : stage === 2
              ? "Launch sourcing"
              : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Request details">
            <div className="workspace-form-grid">
              <Field label="Project">
                <input
                  className="workspace-input"
                  value={form.project}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, project: event.target.value }))
                  }
                />
              </Field>
              <Field label="Position">
                <input
                  className="workspace-input"
                  value={form.position}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, position: event.target.value }))
                  }
                />
              </Field>
              <Field label="Employment type">
                <select
                  className="workspace-select"
                  value={form.employmentType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      employmentType: event.target.value,
                    }))
                  }
                >
                  <option>Monthly</option>
                  <option>Daily</option>
                  <option>Subcontract support</option>
                </select>
              </Field>
              <Field label="Headcount">
                <input
                  className="workspace-input"
                  value={form.headcount}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, headcount: event.target.value }))
                  }
                />
              </Field>
              <Field label="Needed by">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.neededBy}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, neededBy: event.target.value }))
                  }
                />
              </Field>
              <Field label="Requested by">
                <input
                  className="workspace-input"
                  value={form.requestedBy}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      requestedBy: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Approver">
                <input
                  className="workspace-input"
                  value={form.approver}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, approver: event.target.value }))
                  }
                />
              </Field>
              <Field label="Justification" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={form.justification}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      justification: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Onboarding coverage">
            <div className="workspace-list">
              {[
                "Offer letter and contract template prepared",
                "Site induction, IT access, and payroll checklist linked",
                "Green Card / visa verification routed to compliance",
              ].map((item) => (
                <div key={item} className="workspace-list-row">
                  <div>
                    <strong>{item}</strong>
                    <span>HR workflow template ready</span>
                  </div>
                  <span>Included</span>
                </div>
              ))}
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Draft", detail: "Project request" },
                { label: "Approval", detail: "HR + department head" },
                { label: "Recruiting", detail: "Sourcing live" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Request summary">
            <MetaGrid
              items={[
                { label: "Project", value: form.project },
                { label: "Position", value: form.position },
                { label: "Headcount", value: form.headcount },
                { label: "Needed by", value: form.neededBy },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function HrProfileWorkspace({ closeWorkspace, openPageWorkspace, payload, surface }) {
  const employee = enrichHrEmployee(payload.employee || payload.record);
  const injuries = hrInjuries.filter((item) => item.status === "Open");
  const certificateTone = employee.certificates.some((item) => item.status !== "Valid")
    ? "warning"
    : "approved";

  return (
    <WorkspaceShell
      moduleLabel="Human Resources"
      title={employee.name}
      subtitle="Unified worker profile with certificates, payroll alignment, and multi-site history."
      badge={employee.status}
      badgeTone={employee.status === "Active" ? certificateTone : "review"}
      footer={
        <>
          <button
            className="secondary-button"
            type="button"
            onClick={() =>
              openPageWorkspace("hrLeave", {
                employee,
              })
            }
          >
            Apply leave
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() =>
              openPageWorkspace("hrCertificate", {
                employee,
              })
            }
          >
            Upload certificate
          </button>
          <button className="ghost-button" type="button" onClick={closeWorkspace}>
            {closeActionLabel(surface)}
          </button>
        </>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Profile summary">
            <MetaGrid
              items={[
                { label: "Employee ID", value: employee.id },
                { label: "Role", value: employee.role },
                { label: "Employment", value: employee.type },
                { label: "Current site", value: employee.currentSite || employee.site },
                { label: "Department", value: employee.department || "Operations" },
                { label: "Payroll", value: employee.payroll || "Payroll linked" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Certificates & compliance">
            <div className="workspace-list">
              {employee.certificates.map((item) => (
                <div key={`${employee.id}-${item.title}`} className="workspace-list-row">
                  <div>
                    <strong>{item.title}</strong>
                    <span>Expiry {item.expiry}</span>
                  </div>
                  <span className={`workspace-badge ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title="Site history">
            <Timeline
              items={employee.transfers.map((item) => ({
                title: item,
                meta: timelineStamp(employee.name),
              }))}
            />
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Contact & attendance">
            <MetaGrid
              items={[
                { label: "Phone", value: employee.phone || "+852 6000 0000" },
                { label: "Email", value: employee.email || "pending@tysan.local" },
                { label: "Emergency", value: employee.emergency || "Pending" },
                { label: "Clocking", value: employee.type === "Daily" ? "Card tap + gate sync" : "Clock-in / HR app" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Training status">
            <div className="workspace-list">
              {hrTraining
                .filter((record) => record.employee === employee.name)
                .map((record) => (
                  <div key={record.id} className="workspace-list-row">
                    <div>
                      <strong>{record.course}</strong>
                      <span>{record.id} · Expiry {record.expiry}</span>
                    </div>
                    <span className={`workspace-badge ${statusClass(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              {!hrTraining.some((record) => record.employee === employee.name) ? (
                <div className="workspace-note">
                  <p>No additional course record linked. Profile is still ready for site verification.</p>
                </div>
              ) : null}
            </div>
          </DrawerSection>
          <DrawerSection title="EC / incident watch">
            <div className={`workspace-note ${injuries.length ? "" : "success"}`}>
              <p>
                {injuries.length
                  ? `${injuries.length} open EC case(s) remain under HR review.`
                  : "No open injury or EC case is linked to this profile."}
              </p>
            </div>
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function HrLeaveWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const linkedEmployee = enrichHrEmployee(payload.employee || payload.record);
  const existingRecord = payload.record?.dates ? payload.record : null;
  const leaveDatePreset = existingRecord?.id === "L-2025-081"
    ? { startDate: "2025-11-01", endDate: "2025-11-03" }
    : existingRecord?.id === "L-2025-082"
      ? { startDate: "2025-10-25", endDate: "2025-10-25" }
      : { startDate: "2026-02-06", endDate: "2026-02-07" };
  const [stage, setStage] = useState(
    existingRecord?.status === "Approved" ? 3 : existingRecord?.status === "Pending" ? 2 : 1
  );
  const [form, setForm] = useState({
    employee: linkedEmployee.name,
    type: existingRecord?.type || "Annual Leave",
    startDate: leaveDatePreset.startDate,
    endDate: leaveDatePreset.endDate,
    handover: "Site diary and permit log handed to deputy engineer.",
    approver: "Lisa Ko",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Leave form opened",
      meta: timelineStamp(form.employee),
    },
  ]);

  function advance() {
    if (stage === 1) {
      setStage(2);
      if (existingRecord?.id) {
        updateRecord("hrLeaves", existingRecord.id, { status: "Pending" });
      }
      setTimeline((current) => [
        {
          title: "Leave request submitted",
          meta: timelineStamp(`${form.type} routed to ${form.approver}`),
        },
        ...current,
      ]);
      return;
    }

    setStage(3);
    if (existingRecord?.id) {
      updateRecord("hrLeaves", existingRecord.id, { status: "Approved" });
    }
    setTimeline((current) => [
      {
        title: "Payroll and attendance updated",
        meta: timelineStamp("Approved leave synced to allowance and roster"),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="Human Resources"
      title="Leave application"
      subtitle="Submit absence request, route approval, and sync attendance and payroll impact."
      badge={stage === 3 ? "Approved" : stage === 2 ? "Approval pending" : "Draft"}
      badgeTone={stage === 3 ? "approved" : stage === 2 ? "review" : "muted"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 1
            ? "Submit leave"
            : stage === 2
              ? "Approve leave"
              : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Leave details">
            <div className="workspace-form-grid">
              <Field label="Employee">
                <input
                  className="workspace-input"
                  value={form.employee}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, employee: event.target.value }))
                  }
                />
              </Field>
              <Field label="Leave type">
                <select
                  className="workspace-select"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, type: event.target.value }))
                  }
                >
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>No Pay Leave</option>
                </select>
              </Field>
              <Field label="Start date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startDate: event.target.value }))
                  }
                />
              </Field>
              <Field label="End date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.endDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endDate: event.target.value }))
                  }
                />
              </Field>
              <Field label="Approver">
                <input
                  className="workspace-input"
                  value={form.approver}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, approver: event.target.value }))
                  }
                />
              </Field>
              <Field label="Handover plan" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={form.handover}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, handover: event.target.value }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Coverage check">
            <div className="workspace-note">
              <p>Approved leave updates timesheet, site attendance, and allowance calculation in one flow.</p>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Draft", detail: "Employee" },
                { label: "Approval", detail: "Department head" },
                { label: "Payroll sync", detail: "Attendance + payroll" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Leave summary">
            <MetaGrid
              items={[
                { label: "Employee", value: form.employee },
                { label: "Type", value: form.type },
                { label: "Period", value: `${form.startDate} to ${form.endDate}` },
                { label: "Approver", value: form.approver },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function HrCertificateWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const employee = enrichHrEmployee(payload.employee || payload.record);
  const linkedRecord = payload.record?.course ? payload.record : null;
  const [stage, setStage] = useState(linkedRecord?.status === "Valid" ? 3 : 1);
  const [form, setForm] = useState({
    employee: employee.name,
    certificateType: linkedRecord?.course || employee.certificates[0]?.title || "Green Card",
    issueDate: "2025-11-01",
    expiryDate: linkedRecord?.expiry || "2028-11-01",
    reminder: "30",
    verifier: "HR Compliance Team",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Certificate record opened",
      meta: timelineStamp(form.employee),
    },
  ]);

  function advance() {
    if (stage === 1) {
      setStage(2);
      setTimeline((current) => [
        {
          title: "Certificate uploaded",
          meta: timelineStamp(`${form.certificateType} file stored in employee profile`),
        },
        ...current,
      ]);
      return;
    }

    setStage(3);
    if (linkedRecord?.id) {
      updateRecord("hrTraining", linkedRecord.id, {
        expiry: form.expiryDate,
        status: "Valid",
      });
    } else if (employee.id) {
      updateRecord("hrEmployees", employee.id, {
        greenCard: `Valid (${form.expiryDate.slice(0, 4)})`,
      });
    }
    setTimeline((current) => [
      {
        title: "Reminder schedule activated",
        meta: timelineStamp(`${form.reminder} day expiry reminder routed to HR and site lead`),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="Human Resources"
      title="Certificate upload & renewal"
      subtitle="Maintain Green Card and qualification validity with document upload and expiry reminders."
      badge={stage === 3 ? "Reminder active" : stage === 2 ? "Verification" : "Draft"}
      badgeTone={stage === 3 ? "approved" : stage === 2 ? "review" : "muted"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 1
            ? "Upload certificate"
            : stage === 2
              ? "Verify & activate reminder"
              : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Certificate details">
            <div className="workspace-form-grid">
              <Field label="Employee">
                <input className="workspace-input" value={form.employee} readOnly />
              </Field>
              <Field label="Certificate type">
                <input
                  className="workspace-input"
                  value={form.certificateType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      certificateType: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Issue date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.issueDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, issueDate: event.target.value }))
                  }
                />
              </Field>
              <Field label="Expiry date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.expiryDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, expiryDate: event.target.value }))
                  }
                />
              </Field>
              <Field label="Reminder window (days)">
                <input
                  className="workspace-input"
                  value={form.reminder}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, reminder: event.target.value }))
                  }
                />
              </Field>
              <Field label="Verifier">
                <input
                  className="workspace-input"
                  value={form.verifier}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, verifier: event.target.value }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Linked compliance checks">
            <div className="workspace-evidence-grid">
              <div className="workspace-evidence-card">
                <strong>Document vault</strong>
                <span>Scanned copy attached to employee file and renewal register.</span>
              </div>
              <div className="workspace-evidence-card">
                <strong>Reminder rule</strong>
                <span>Expiry alerts sent to HR, payroll, and site supervisor.</span>
              </div>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Upload", detail: "Document attached" },
                { label: "Verify", detail: "Compliance check" },
                { label: "Reminder", detail: "Expiry automation" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Profile impact">
            <MetaGrid
              items={[
                { label: "Employee", value: employee.name },
                { label: "Current site", value: employee.currentSite || employee.site },
                { label: "Verifier", value: form.verifier },
                { label: "Expiry", value: form.expiryDate },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ImsComplaintWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const sourceRecord = payload.record || imsComplaints[1];
  const preset = imsComplaintPresets[sourceRecord.id] || imsComplaintPresets["CMP-25-004"];
  const [stage, setStage] = useState(
    sourceRecord.status === "Closed" ? 4 : sourceRecord.status === "Investigation" ? 2 : 1
  );
  const [form, setForm] = useState({
    id: sourceRecord.id || "CMP-26-010",
    client: sourceRecord.client || "Client representative",
    subject: sourceRecord.subject || "New complaint",
    owner: preset.owner,
    severity: preset.severity,
    rootCause: preset.rootCause,
    action: preset.action,
    dueDate: preset.dueDate,
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Complaint record opened",
      meta: timelineStamp(`${form.id} · ${form.client}`),
    },
  ]);

  function advance() {
    if (stage === 1) {
      setStage(2);
      updateRecord("imsComplaints", form.id, { status: "Investigation" });
      setTimeline((current) => [
        {
          title: "Investigation started",
          meta: timelineStamp(`${form.owner} assigned as case owner`),
        },
        ...current,
      ]);
      return;
    }

    if (stage === 2) {
      setStage(3);
      updateRecord("imsComplaints", form.id, {
        status: "Under Review",
        car: `CAR-${form.id.slice(-3)}`,
      });
      setTimeline((current) => [
        {
          title: "CAR issued",
          meta: timelineStamp(`${form.action} due ${form.dueDate}`),
        },
        ...current,
      ]);
      return;
    }

    setStage(4);
    updateRecord("imsComplaints", form.id, {
      status: "Closed",
      signature: true,
      car: `CAR-${form.id.slice(-3)}`,
    });
    setTimeline((current) => [
      {
        title: "E-signature completed and case closed",
        meta: timelineStamp("Monthly quality summary queued for reporting"),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="IMS - Quality"
      title="Client complaint / CAR workflow"
      subtitle="Capture complaint, investigate root cause, issue CAR, and close with electronic signature."
      badge={
        stage === 4
          ? "Closed"
          : stage === 3
            ? "CAR issued"
            : stage === 2
              ? "Investigation"
              : "Open"
      }
      badgeTone={stage === 4 ? "approved" : stage >= 2 ? "warning" : "urgent"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 4 ? closeWorkspace : advance}>
          {stage === 1
            ? "Start investigation"
            : stage === 2
              ? "Issue CAR"
              : stage === 3
                ? "Close with e-sign"
                : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Complaint record">
            <div className="workspace-form-grid">
              <Field label="Reference">
                <input className="workspace-input" value={form.id} readOnly />
              </Field>
              <Field label="Client">
                <input
                  className="workspace-input"
                  value={form.client}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, client: event.target.value }))
                  }
                />
              </Field>
              <Field label="Subject" wide>
                <input
                  className="workspace-input"
                  value={form.subject}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, subject: event.target.value }))
                  }
                />
              </Field>
              <Field label="Case owner">
                <input
                  className="workspace-input"
                  value={form.owner}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, owner: event.target.value }))
                  }
                />
              </Field>
              <Field label="Severity">
                <select
                  className="workspace-select"
                  value={form.severity}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, severity: event.target.value }))
                  }
                >
                  <option>Minor</option>
                  <option>Moderate</option>
                  <option>Major</option>
                </select>
              </Field>
              <Field label="Root cause" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={form.rootCause}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      rootCause: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Corrective action" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={form.action}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, action: event.target.value }))
                  }
                />
              </Field>
              <Field label="Target close date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, dueDate: event.target.value }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Quality controls">
            <div className="workspace-note">
              <p>
                NCR/CAR route is bound to this complaint, and monthly quality summary will auto-pick up the closed case.
              </p>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Complaint", detail: "Client record" },
                { label: "Investigation", detail: "Root cause" },
                { label: "CAR", detail: "Corrective action" },
                { label: "E-sign close", detail: "Audit complete" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Case summary">
            <MetaGrid
              items={[
                { label: "Severity", value: form.severity },
                { label: "Source", value: preset.source },
                { label: "Owner", value: form.owner },
                { label: "CAR", value: `CAR-${form.id.slice(-3)}` },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ImsPermitWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const permit = payload.record || imsPermits[2];
  const [stage, setStage] = useState(permit.status === "Valid" ? 3 : 1);
  const [form, setForm] = useState({
    id: permit.id,
    type: permit.type,
    authority: permit.authority,
    expiry: permit.expiry,
    owner: "Environmental Manager",
    reminder: "21",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Renewal log opened",
      meta: timelineStamp(`${form.id} · Expiry ${form.expiry}`),
    },
  ]);

  function advance() {
    if (stage === 1) {
      setStage(2);
      updateRecord("imsPermits", form.id, { status: "Under Review" });
      setTimeline((current) => [
        {
          title: "Renewal package submitted",
          meta: timelineStamp(`${form.type} sent to ${form.authority}`),
        },
        ...current,
      ]);
      return;
    }

    setStage(3);
    updateRecord("imsPermits", form.id, {
      status: "Valid",
      expiry: "2026-11-10",
    });
    setTimeline((current) => [
      {
        title: "Permit renewed",
        meta: timelineStamp("Expiry reminder reset and permit register refreshed"),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="IMS - Environmental"
      title="Permit / license renewal"
      subtitle="Track expiring permit, route renewal, and keep reminder controls live."
      badge={stage === 3 ? "Renewed" : stage === 2 ? "Authority review" : permit.status}
      badgeTone={stage === 3 ? "approved" : stage === 2 ? "review" : "warning"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 1
            ? "Submit renewal"
            : stage === 2
              ? "Confirm renewed permit"
              : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Renewal details">
            <div className="workspace-form-grid">
              <Field label="Permit ID">
                <input className="workspace-input" value={form.id} readOnly />
              </Field>
              <Field label="Authority">
                <input
                  className="workspace-input"
                  value={form.authority}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, authority: event.target.value }))
                  }
                />
              </Field>
              <Field label="Permit type" wide>
                <input
                  className="workspace-input"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, type: event.target.value }))
                  }
                />
              </Field>
              <Field label="Current expiry">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.expiry}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, expiry: event.target.value }))
                  }
                />
              </Field>
              <Field label="Renewal owner">
                <input
                  className="workspace-input"
                  value={form.owner}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, owner: event.target.value }))
                  }
                />
              </Field>
              <Field label="Reminder window (days)">
                <input
                  className="workspace-input"
                  value={form.reminder}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, reminder: event.target.value }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Renewal pack">
            <div className="workspace-list">
              {[
                "Latest inspection record attached",
                "Authority submission receipt captured",
                "Reminder route to site, IMS, and project director",
              ].map((item) => (
                <div key={item} className="workspace-list-row">
                  <div>
                    <strong>{item}</strong>
                    <span>Permit control pack</span>
                  </div>
                  <span>Ready</span>
                </div>
              ))}
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Expiry watch", detail: "Reminder triggered" },
                { label: "Renewal", detail: "Authority review" },
                { label: "Active", detail: "Register refreshed" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Permit summary">
            <MetaGrid
              items={[
                { label: "Permit", value: form.type },
                { label: "Authority", value: form.authority },
                { label: "Expiry", value: form.expiry },
                { label: "Owner", value: form.owner },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ImsInspectionWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const inspection = payload.record || imsInspections[0];
  const [stage, setStage] = useState(inspection.status === "Completed" ? 3 : 2);
  const [findingCount, setFindingCount] = useState(inspection.issues || 2);
  const [rectifiedCount, setRectifiedCount] = useState(inspection.rectified || 0);
  const [timeline, setTimeline] = useState([
    {
      title: "Inspection record opened",
      meta: timelineStamp(`${inspection.id} · ${inspection.location}`),
    },
  ]);

  function advance() {
    if (stage <= 2) {
      const closedCount = Math.max(rectifiedCount, findingCount);
      setStage(3);
      setRectifiedCount(closedCount);
      updateRecord("imsInspections", inspection.id, {
        rectified: closedCount,
        status: "Completed",
      });
      setTimeline((current) => [
        {
          title: "Rectification evidence uploaded",
          meta: timelineStamp("Before / after photos and close-out verified"),
        },
        ...current,
      ]);
    }
  }

  return (
    <WorkspaceShell
      moduleLabel="IMS - Environmental"
      title="Environmental inspection"
      subtitle="Checklist execution with findings, photo evidence, and rectification close-out."
      badge={stage === 3 ? "Completed" : "In progress"}
      badgeTone={stage === 3 ? "approved" : "warning"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 3 ? closeActionLabel(surface) : "Close with rectification proof"}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Mobile inspection preview">
            <MobileFrame title={inspection.id} subtitle={`${inspection.location} · ${inspection.inspector}`}>
              <div className="workspace-mobile-list">
                {[
                  "Dust suppression log checked",
                  "Waste segregation area inspected",
                  "Permit displayed on environmental board",
                ].map((item) => (
                  <div key={item} className="workspace-mobile-item">
                    <span className="workspace-mobile-check" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </MobileFrame>
          </DrawerSection>
          <DrawerSection title="Findings & photo evidence">
            <div className="workspace-evidence-grid">
              <div className="workspace-evidence-card">
                <strong>Findings logged</strong>
                <span>{findingCount} issue(s) tagged with location and photo.</span>
              </div>
              <div className="workspace-evidence-card">
                <strong>Rectified</strong>
                <span>{rectifiedCount} issue(s) already closed with after-photo proof.</span>
              </div>
            </div>
            <div className="workspace-form-grid">
              <Field label="Issues found">
                <input
                  className="workspace-input"
                  value={findingCount}
                  onChange={(event) => setFindingCount(Number(event.target.value) || 0)}
                />
              </Field>
              <Field label="Rectified now">
                <input
                  className="workspace-input"
                  value={rectifiedCount}
                  onChange={(event) => setRectifiedCount(Number(event.target.value) || 0)}
                />
              </Field>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Checklist", detail: "Site walk" },
                { label: "Rectification", detail: "Before / after" },
                { label: "Closed", detail: "Audit complete" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Inspection summary">
            <MetaGrid
              items={[
                { label: "Reference", value: inspection.id },
                { label: "Inspector", value: inspection.inspector },
                { label: "Location", value: inspection.location },
                { label: "Status", value: stage === 3 ? "Completed" : "In progress" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function PlantJobSheetWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const job = payload.record || plantJobs[0];
  const asset = findPlantAsset(job.plantId);
  const [stage, setStage] = useState(job.status === "Completed" ? 3 : 2);
  const [form, setForm] = useState({
    id: job.id || "JOB-49020",
    plantId: job.plantId || asset.id,
    location: asset.location,
    mechanic: "Plant workshop team",
    issue: job.desc,
    hours: "6.5",
    parts: job.status === "Waiting Parts" ? "Hydraulic pump kit" : "Fasteners and welding rods",
    cost: job.cost,
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Job sheet opened",
      meta: timelineStamp(`${form.id} · ${form.plantId}`),
    },
  ]);

  function advance() {
    if (stage === 2) {
      setStage(3);
      updateRecord("plantJobs", form.id, {
        status: "Completed",
        cost: form.cost,
      });
      setTimeline((current) => [
        {
          title: "Maintenance completed",
          meta: timelineStamp(`${form.hours} labor hours and ${form.parts} booked to the asset`),
        },
        ...current,
      ]);
    }
  }

  return (
    <WorkspaceShell
      moduleLabel="Plant"
      title="Maintenance job sheet"
      subtitle="Record defect, labor, parts, and completion status for plant maintenance."
      badge={stage === 3 ? "Completed" : job.status}
      badgeTone={stage === 3 ? "approved" : "warning"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 3 ? closeActionLabel(surface) : "Complete maintenance"}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Job details">
            <div className="workspace-form-grid">
              <Field label="Job sheet ID">
                <input className="workspace-input" value={form.id} readOnly />
              </Field>
              <Field label="Plant ID">
                <input className="workspace-input" value={form.plantId} readOnly />
              </Field>
              <Field label="Location">
                <input
                  className="workspace-input"
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, location: event.target.value }))
                  }
                />
              </Field>
              <Field label="Assigned mechanic">
                <input
                  className="workspace-input"
                  value={form.mechanic}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, mechanic: event.target.value }))
                  }
                />
              </Field>
              <Field label="Issue" wide>
                <textarea
                  className="workspace-textarea"
                  rows={4}
                  value={form.issue}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, issue: event.target.value }))
                  }
                />
              </Field>
              <Field label="Labor hours">
                <input
                  className="workspace-input"
                  value={form.hours}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, hours: event.target.value }))
                  }
                />
              </Field>
              <Field label="Parts consumed">
                <input
                  className="workspace-input"
                  value={form.parts}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, parts: event.target.value }))
                  }
                />
              </Field>
              <Field label="Booked cost">
                <input
                  className="workspace-input"
                  value={form.cost}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, cost: event.target.value }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Workshop note">
            <div className="workspace-note">
              <p>
                Job sheet closure updates maintenance history, plant cost ledger, and utilization status.
              </p>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Defect logged", detail: "Site or depot" },
                { label: "Workshop", detail: "Repair in progress" },
                { label: "Completed", detail: "History updated" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Asset summary">
            <MetaGrid
              items={[
                { label: "Asset", value: asset.name },
                { label: "Serial", value: asset.serial },
                { label: "Hire mode", value: asset.hireMode },
                { label: "Next inspection", value: asset.nextInspection },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function PlantTransferWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const transfer = payload.record || plantTransfers[1];
  const plantId = transfer.detail.split(":")[0] || plantFleet[0].id;
  const asset = findPlantAsset(plantId);
  const [stage, setStage] = useState(transfer.status === "Completed" ? 3 : 2);
  const [form, setForm] = useState({
    id: transfer.id || "TR-011",
    plantId: asset.id,
    from: transfer.detail.includes("→")
      ? transfer.detail.split(": ")[1].split(" → ")[0]
      : asset.location,
    to: transfer.detail.includes("→")
      ? transfer.detail.split(" → ")[1]
      : "Site J2401B1",
    haulage: "Low-bed trailer",
    offHireDate: "2026-02-04",
    onHireDate: "2026-02-05",
    idleHours: "14",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Transfer note opened",
      meta: timelineStamp(`${form.id} · ${form.plantId}`),
    },
  ]);

  function advance() {
    if (stage === 2) {
      setStage(3);
      updateRecord("plantTransfers", form.id, { status: "Completed" });
      setTimeline((current) => [
        {
          title: "Transfer completed",
          meta: timelineStamp(`${form.plantId} arrived at ${form.to} and hire status updated`),
        },
        ...current,
      ]);
    }
  }

  return (
    <WorkspaceShell
      moduleLabel="Plant"
      title="Transfer note / off-hire"
      subtitle="Move plant between sites, track transport, and record off-hire or idle time."
      badge={stage === 3 ? "Completed" : transfer.status}
      badgeTone={stage === 3 ? "approved" : "review"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 3 ? closeActionLabel(surface) : "Confirm arrival & update hire"}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Transfer details">
            <div className="workspace-form-grid">
              <Field label="Transfer ID">
                <input className="workspace-input" value={form.id} readOnly />
              </Field>
              <Field label="Plant ID">
                <input className="workspace-input" value={form.plantId} readOnly />
              </Field>
              <Field label="From">
                <input
                  className="workspace-input"
                  value={form.from}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, from: event.target.value }))
                  }
                />
              </Field>
              <Field label="To">
                <input
                  className="workspace-input"
                  value={form.to}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, to: event.target.value }))
                  }
                />
              </Field>
              <Field label="Transport">
                <input
                  className="workspace-input"
                  value={form.haulage}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, haulage: event.target.value }))
                  }
                />
              </Field>
              <Field label="Off-hire date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.offHireDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      offHireDate: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="On-hire date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.onHireDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      onHireDate: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Idle hours">
                <input
                  className="workspace-input"
                  value={form.idleHours}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      idleHours: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
          <DrawerSection title="Linked disposal / utilization watch">
            <div className="workspace-list">
              {plantDisposals.map((item) => (
                <div key={item.id} className="workspace-list-row">
                  <div>
                    <strong>{item.detail}</strong>
                    <span>{item.id}</span>
                  </div>
                  <span className={`workspace-badge ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Requested", detail: "Transfer note" },
                { label: "Transport", detail: "Off-hire / idle tracked" },
                { label: "Received", detail: "Location updated" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Asset summary">
            <MetaGrid
              items={[
                { label: "Asset", value: asset.name },
                { label: "Location", value: asset.location },
                { label: "Operator", value: asset.operator },
                { label: "Hire mode", value: asset.hireMode },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function PlantInspectionWorkspace({ closeWorkspace, payload, surface, updateRecord }) {
  const inspection = payload.record || plantInspections[1];
  const asset = findPlantAsset(inspection.plantId);
  const [stage, setStage] = useState(inspection.result === "Satisfactory" ? 3 : 2);
  const [result, setResult] = useState(inspection.result);
  const [timeline, setTimeline] = useState([
    {
      title: "Inspection record opened",
      meta: timelineStamp(`${inspection.id} · ${inspection.plantId}`),
    },
  ]);

  function advance() {
    if (stage === 2) {
      setStage(3);
      setResult("Satisfactory");
      updateRecord("plantInspections", inspection.id, { result: "Satisfactory" });
      setTimeline((current) => [
        {
          title: "Rectification cleared",
          meta: timelineStamp("Checklist signed and plant returned to service"),
        },
        ...current,
      ]);
    }
  }

  return (
    <WorkspaceShell
      moduleLabel="Plant"
      title="Inspection record"
      subtitle="Daily / weekly / monthly inspection with checklist, rectification, and service release."
      badge={stage === 3 ? "Satisfactory" : result}
      badgeTone={stage === 3 ? "approved" : "warning"}
      footer={
        <button className="primary-button" type="button" onClick={stage === 3 ? closeWorkspace : advance}>
          {stage === 3 ? closeActionLabel(surface) : "Close rectification"}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Checklist">
            <div className="workspace-list">
              {plantInspectionChecklist.map((item) => (
                <div key={item} className="workspace-list-row">
                  <div>
                    <strong>{item}</strong>
                    <span>{inspection.type} inspection control</span>
                  </div>
                  <span>{stage === 3 ? "Checked" : "Review"}</span>
                </div>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title="Rectification note">
            <div className="workspace-note">
              <p>
                Inspection closure updates next permit schedule and releases the asset back to available stock.
              </p>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Inspection", detail: "Form 2 / 3 / 5" },
                { label: "Rectification", detail: "Action required" },
                { label: "Released", detail: "Return to service" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Asset summary">
            <MetaGrid
              items={[
                { label: "Plant ID", value: inspection.plantId },
                { label: "Asset", value: asset.name },
                { label: "Inspection type", value: inspection.type },
                { label: "Next check", value: asset.nextInspection },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ProcurementRequisitionWorkspace({ closeWorkspace, surface }) {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({
    jobNo: "J2401B1",
    requestDate: "2026-01-29",
    item: "Reinforcement Bar T40",
    quantity: "420 tons",
    deliveryDate: "2026-02-03",
    deliveryLocation: "West Kowloon site laydown yard",
    requester: "Alan Yeung",
    siteSupervisor: "Kent Wong",
    projectManager: "Lisa Ko",
    amount: "1200000",
  });
  const [timeline, setTimeline] = useState([
    {
      title: "Draft requisition opened",
      meta: timelineStamp(form.jobNo),
    },
  ]);
  const needsAnalysis = Number(form.amount) >= 100000;

  function advance() {
    if (stage === 1) {
      setStage(2);
      setTimeline((current) => [
        {
          title: "Requisition submitted",
          meta: timelineStamp(`Amount HKD ${Number(form.amount).toLocaleString()}`),
        },
        ...current,
      ]);
      return;
    }

    setStage(3);
    setTimeline((current) => [
      {
        title: "Purchase order generated",
        meta: timelineStamp("PO-26-9011 issued to approved vendor"),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="Procurement"
      title="Purchase requisition"
      subtitle="Formal request with quotation analysis threshold and delegated approvals."
      badge={stage === 3 ? "PO issued" : stage === 2 ? "Approval route" : "Draft"}
      badgeTone={stage === 3 ? "approved" : stage === 2 ? "review" : "muted"}
      footer={
        <button
          className="primary-button"
          type="button"
          onClick={stage === 3 ? closeWorkspace : advance}
        >
          {stage === 1
            ? "Submit requisition"
            : stage === 2
              ? "Issue purchase order"
              : closeActionLabel(surface)}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Request details">
            <div className="workspace-form-grid">
              <Field label="Job number">
                <input
                  className="workspace-input"
                  value={form.jobNo}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, jobNo: event.target.value }))
                  }
                />
              </Field>
              <Field label="Request date">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.requestDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      requestDate: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Item" wide>
                <input
                  className="workspace-input"
                  value={form.item}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, item: event.target.value }))
                  }
                />
              </Field>
              <Field label="Quantity">
                <input
                  className="workspace-input"
                  value={form.quantity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      quantity: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Required delivery">
                <input
                  className="workspace-input"
                  type="date"
                  value={form.deliveryDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      deliveryDate: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Delivery location" wide>
                <input
                  className="workspace-input"
                  value={form.deliveryLocation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      deliveryLocation: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Requester">
                <input
                  className="workspace-input"
                  value={form.requester}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      requester: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Site supervisor">
                <input
                  className="workspace-input"
                  value={form.siteSupervisor}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      siteSupervisor: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Project manager" wide>
                <input
                  className="workspace-input"
                  value={form.projectManager}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      projectManager: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Amount (HKD)" wide>
                <input
                  className="workspace-input"
                  type="number"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Workflow">
            <StepRail
              current={stage - 1}
              steps={[
                { label: "Requisition", detail: "Site" },
                { label: "Approval", detail: needsAnalysis ? "Quotation analysis" : "Threshold bypass" },
                { label: "PO issued", detail: "Procurement" },
              ]}
            />
          </DrawerSection>
          <DrawerSection
            title="Approval routing"
            subtitle={
              needsAnalysis
                ? "Amount exceeds Quotation Analysis threshold."
                : "Standard approval route applied."
            }
          >
            <div className="workspace-approval-list">
              {procurementApprovers.map((approver, index) => (
                <div key={approver} className="workspace-approval-row">
                  <div>
                    <strong>{approver}</strong>
                    <span>{index < stage ? "Decision routed" : "Pending route"}</span>
                  </div>
                  <span
                    className={`workspace-badge ${
                      index < stage ? "approved" : "pending"
                    }`}
                  >
                    {index < stage ? "Ready" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title="Commercial trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ProcurementOrderWorkspace({
  navigateToView,
  openPageWorkspace,
  openWorkspace,
  payload,
  surface,
}) {
  const order = payload.record || procurementOrders[0];
  const step = order.step;
  const status = order.status;
  const [timeline, setTimeline] = useState([
    {
      title: "Supplier selected from approved list",
      meta: timelineStamp(order.vendor),
    },
    {
      title: "Commercial validation completed",
      meta: timelineStamp(order.requester),
    },
  ]);

  function openDeliveryWorkflow() {
    if (surface === "page" && openPageWorkspace) {
      openPageWorkspace("procurementDelivery", { record: order });
      return;
    }

    openWorkspace("procurementDelivery", { record: order });
  }

  function openQsWorkflow() {
    if (navigateToView) {
      navigateToView("qs");
    }

    if (openPageWorkspace) {
      openPageWorkspace(
        "qsPayment",
        {
          linkedOrder: order,
          record: qsPayments[0],
        },
        "qs"
      );
      return;
    }

    openWorkspace("qsPayment", {
      linkedOrder: order,
      record: qsPayments[0],
    });
  }

  function openApprovalRoute() {
    const procurementApproval =
      approvals.find((item) => item.module === "Procurement") || approvals[0];

    openWorkspace("approvalRecord", {
      record: procurementApproval,
    });
  }

  const footer =
    step === 4 ? (
      <button
        className="primary-button"
        type="button"
        onClick={openDeliveryWorkflow}
      >
        Verify delivery note
      </button>
    ) : step === 5 ? (
      <button className="primary-button" type="button" onClick={openQsWorkflow}>
        Open QS payment
      </button>
    ) : (
      <button className="primary-button" type="button" onClick={openApprovalRoute}>
        Open approval route
      </button>
    );

  return (
    <WorkspaceShell
      moduleLabel="Procurement"
      title={order.id}
      subtitle={`${order.vendor} · ${order.item}`}
      badge={status}
      badgeTone={statusClass(status)}
      footer={footer}
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Order summary">
            <MetaGrid
              items={[
                { label: "Vendor", value: order.vendor },
                { label: "Item", value: order.item },
                { label: "Project", value: order.project },
                { label: "Requester", value: order.requester },
                { label: "Amount", value: order.amount },
                { label: "Status", value: status },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Linked documents">
            <div className="workspace-list">
              <div className="workspace-list-row">
                <div>
                  <strong>Quotation analysis report</strong>
                  <span>Commercial evaluation and approval pack</span>
                </div>
                <span>Attached</span>
              </div>
              <div className="workspace-list-row">
                <div>
                  <strong>Delivery note register</strong>
                  <span>Inbound control and site receiving</span>
                </div>
                <span>{step >= 4 ? "Live" : "Pending"}</span>
              </div>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Lifecycle">
            <StepRail
              current={Math.max(step - 1, 0)}
              steps={[
                { label: "Req / Quote", detail: "Site / supplier" },
                { label: "Approval", detail: "Delegated authority" },
                { label: "PO issued", detail: "Procurement" },
                { label: "Delivery", detail: "Site receiving" },
                { label: "QS handover", detail: "Commercial records" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Timeline">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ProcurementDeliveryWorkspace({
  navigateToView,
  openPageWorkspace,
  payload,
  surface,
  updateRecord,
}) {
  const order = payload.record || procurementOrders[1];
  const [form, setForm] = useState({
    noteNo: "DN-6651",
    receivedQty: order.item.includes("Helmets") ? "480 units" : "420 tons",
    receiver: "Kent Wong",
    condition: "Accepted",
  });
  const [confirmed, setConfirmed] = useState(false);

  function confirmReceipt() {
    setConfirmed(true);
    updateRecord("procurementOrders", order.id, {
      step: 5,
      status: "QS Handover",
    });
  }

  function openQsWorkflow() {
    if (navigateToView) {
      navigateToView("qs");
    }

    if (openPageWorkspace) {
      openPageWorkspace(
        "qsPayment",
        {
          linkedOrder: order,
          record: qsPayments[0],
        },
        "qs"
      );
      return;
    }
  }

  return (
    <WorkspaceShell
      moduleLabel="Procurement"
      title="Delivery note verification"
      subtitle={`${order.id} · ${order.vendor}`}
      badge={confirmed ? "Verified" : "Pending receipt"}
      badgeTone={confirmed ? "approved" : "warning"}
      footer={
        <button
          className="primary-button"
          type="button"
          onClick={confirmed && surface === "page" ? openQsWorkflow : confirmReceipt}
        >
          {confirmed && surface === "page" ? "Open QS handover" : "Confirm receipt"}
        </button>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="Receipt details">
            <div className="workspace-form-grid">
              <Field label="Delivery note">
                <input
                  className="workspace-input"
                  value={form.noteNo}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, noteNo: event.target.value }))
                  }
                />
              </Field>
              <Field label="Received quantity">
                <input
                  className="workspace-input"
                  value={form.receivedQty}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      receivedQty: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Receiver">
                <input
                  className="workspace-input"
                  value={form.receiver}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, receiver: event.target.value }))
                  }
                />
              </Field>
              <Field label="Condition">
                <select
                  className="workspace-select"
                  value={form.condition}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      condition: event.target.value,
                    }))
                  }
                >
                  <option>Accepted</option>
                  <option>Accepted with remarks</option>
                  <option>Rejected</option>
                </select>
              </Field>
            </div>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Linked outcome">
            <MetaGrid
              items={[
                { label: "Order", value: order.id },
                { label: "Vendor", value: order.vendor },
                { label: "Post receipt status", value: confirmed ? "QS Handover" : "Delivery Pending" },
                { label: "Finance packet", value: "Ready after verification" },
              ]}
            />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function QsPaymentWorkspace({ payload, updateRecord }) {
  const payment = payload.record || qsPayments[0];
  const linkedOrder = payload.linkedOrder;
  const [step, setStep] = useState(payment.step);
  const [status, setStatus] = useState(payment.status);
  const [reviewNote, setReviewNote] = useState(
    "Invoice OCR matched package values. Retention and material contra checked against site submission."
  );
  const [timeline, setTimeline] = useState([
    {
      title: "OCR extraction completed",
      meta: timelineStamp("Confidence 98.4%"),
    },
    {
      title: "Commercial review opened",
      meta: timelineStamp(payment.subcon),
    },
  ]);

  function certify() {
    setStep(4);
    setStatus("Approved");
    updateRecord("qsPayments", payment.id, { step: 4, status: "Approved" });
    if (payload.source?.id) {
      updateRecord("approvals", payload.source.id, { status: "Approved" });
    }
    setTimeline((current) => [
      {
        title: "Payment certificate signed",
        meta: timelineStamp("Director approval completed"),
      },
      ...current,
    ]);
  }

  function revise() {
    setStep(2);
    setStatus("Under Review");
    updateRecord("qsPayments", payment.id, {
      step: 2,
      status: "Under Review",
    });
    if (payload.source?.id) {
      updateRecord("approvals", payload.source.id, { status: "Review" });
    }
    setTimeline((current) => [
      {
        title: "Returned for revision",
        meta: timelineStamp("Commercial comment issued to subcontractor"),
      },
      ...current,
    ]);
  }

  return (
    <WorkspaceShell
      moduleLabel="QS"
      title={payment.id}
      subtitle={`${payment.subcon} · ${payment.work}`}
      badge={status}
      badgeTone={statusClass(status)}
      footer={
        <>
          <button className="secondary-button" type="button" onClick={revise}>
            Request revision
          </button>
          <button className="primary-button" type="button" onClick={certify}>
            Certify payment
          </button>
        </>
      }
    >
      <div className="workspace-content-grid">
        <div className="workspace-stack">
          <DrawerSection title="OCR extraction">
            <MetaGrid items={qsExtractedFields} />
          </DrawerSection>
          <DrawerSection title="Commercial review">
            <Field label="Review note" wide>
              <textarea
                className="workspace-textarea"
                rows={6}
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
              />
            </Field>
          </DrawerSection>
        </div>
        <div className="workspace-stack">
          <DrawerSection title="Approval chain">
            <StepRail
              current={Math.max(step - 1, 0)}
              steps={[
                { label: "Request", detail: "Site" },
                { label: "Invoice", detail: "OCR" },
                { label: "Verify", detail: "QS" },
                { label: "Certify", detail: "Director" },
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Payment summary">
            <MetaGrid
              items={[
                { label: "Subcontractor", value: payment.subcon },
                { label: "Work", value: payment.work },
                { label: "Amount", value: payment.amount },
                { label: "Status", value: status },
                ...(linkedOrder
                  ? [{ label: "Linked PO", value: linkedOrder.id }]
                  : []),
              ]}
            />
          </DrawerSection>
          <DrawerSection title="Audit trail">
            <Timeline items={timeline} />
          </DrawerSection>
        </div>
      </div>
    </WorkspaceShell>
  );
}

export function ActiveWorkspace(props) {
  const { workspace } = props;

  switch (workspace.kind) {
    case "notificationCenter":
      return <NotificationCenterWorkspace {...props} />;
    case "infoBoard":
      return <InfoBoardWorkspace {...props} payload={workspace.payload} />;
    case "approvalInbox":
      return <NotificationCenterWorkspace {...props} />;
    case "approvalRecord":
      return <ApprovalRecordWorkspace {...props} payload={workspace.payload} />;
    case "dmsReview":
      return <DmsReviewWorkspace {...props} payload={workspace.payload} />;
    case "dmsUpload":
      return <DmsUploadWorkspace {...props} payload={workspace.payload} />;
    case "dmsShare":
      return <DmsShareWorkspace {...props} payload={workspace.payload} />;
    case "safetyInspection":
      return <SafetyInspectionWorkspace {...props} payload={workspace.payload} />;
    case "safetyIncident":
      return <SafetyIncidentWorkspace {...props} payload={workspace.payload} />;
    case "safetyAttendance":
      return <SafetyAttendanceWorkspace {...props} payload={workspace.payload} />;
    case "hrManpowerRequest":
      return <HrManpowerRequestWorkspace {...props} payload={workspace.payload} />;
    case "hrProfile":
      return <HrProfileWorkspace {...props} payload={workspace.payload} />;
    case "hrLeave":
      return <HrLeaveWorkspace {...props} payload={workspace.payload} />;
    case "hrCertificate":
      return <HrCertificateWorkspace {...props} payload={workspace.payload} />;
    case "imsComplaint":
      return <ImsComplaintWorkspace {...props} payload={workspace.payload} />;
    case "imsPermit":
      return <ImsPermitWorkspace {...props} payload={workspace.payload} />;
    case "imsInspection":
      return <ImsInspectionWorkspace {...props} payload={workspace.payload} />;
    case "plantJobSheet":
      return <PlantJobSheetWorkspace {...props} payload={workspace.payload} />;
    case "plantTransfer":
      return <PlantTransferWorkspace {...props} payload={workspace.payload} />;
    case "plantInspection":
      return <PlantInspectionWorkspace {...props} payload={workspace.payload} />;
    case "procurementRequisition":
      return <ProcurementRequisitionWorkspace {...props} payload={workspace.payload} />;
    case "procurementOrder":
      return <ProcurementOrderWorkspace {...props} payload={workspace.payload} />;
    case "procurementDelivery":
      return <ProcurementDeliveryWorkspace {...props} payload={workspace.payload} />;
    case "qsPayment":
      return <QsPaymentWorkspace {...props} payload={workspace.payload} />;
    default:
      return (
        <WorkspaceShell
          moduleLabel="Operations"
          title="Workspace unavailable"
          subtitle="This workflow is not registered."
          badge="Unavailable"
          badgeTone="urgent"
          footer={
            <button
              className="primary-button"
              type="button"
              onClick={props.closeWorkspace}
            >
              Close panel
            </button>
          }
        />
      );
  }
}

export default function WorkspaceDrawer({
  navigateToView,
  openPageWorkspace,
  workspace,
  onClose,
  openWorkspace,
  updateRecord,
  resolveRecord,
}) {
  useEffect(() => {
    if (!workspace) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [workspace, onClose]);

  if (!workspace) {
    return null;
  }

  const workspaceKey =
    workspace.payload?.record?.id ||
    workspace.payload?.record?.ref ||
    workspace.kind;

  return (
    <div className="workspace-overlay">
      <button
        aria-label="Close workspace"
        className="workspace-backdrop"
        type="button"
        onClick={onClose}
      />
      <aside
        aria-label="Workflow workspace"
        aria-modal="true"
        className="workspace-panel"
        role="dialog"
      >
        <div className="workspace-panel-topbar">
          <span className="workspace-panel-label">Workspace</span>
          <button className="workspace-close" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="workspace-panel-body">
          <ActiveWorkspace
            closeWorkspace={onClose}
            key={workspaceKey}
            navigateToView={navigateToView}
            openPageWorkspace={openPageWorkspace}
            openWorkspace={openWorkspace}
            resolveRecord={resolveRecord}
            surface="drawer"
            updateRecord={updateRecord}
            workspace={workspace}
          />
        </div>
      </aside>
    </div>
  );
}
