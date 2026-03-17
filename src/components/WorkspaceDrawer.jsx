import { useEffect, useState } from "react";
import { approvals } from "../data/modules.js";
import {
  dmsApprovals,
  dmsExternalAccess,
  dmsCategories,
} from "../data/dms.js";
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

function statusClass(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function timelineStamp(value) {
  return `${value} · Audit trail recorded`;
}

function closeActionLabel(surface) {
  return surface === "page" ? "Back to module" : "Close panel";
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

function ApprovalInboxWorkspace({ closeWorkspace, openWorkspace, resolveRecord }) {
  const queue = approvals.map((item) => resolveRecord("approvals", item));

  return (
    <WorkspaceShell
      moduleLabel="Approvals"
      title="Approval Inbox"
      subtitle="All routed decisions, grouped by module and due date."
      badge={`${queue.length} pending`}
      badgeTone="warning"
      footer={
        <button className="primary-button" type="button" onClick={closeWorkspace}>
          Close panel
        </button>
      }
    >
      <div className="workspace-stack">
        <DrawerSection
          title="Routed approvals"
          subtitle="Open any record to review workflow status and supporting material."
        >
          <div className="workspace-table-list">
            {queue.map((item) => (
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
      <button className="primary-button" type="button" onClick={() => openWorkspace("approvalInbox")}>
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
    case "infoBoard":
      return <InfoBoardWorkspace {...props} payload={workspace.payload} />;
    case "approvalInbox":
      return <ApprovalInboxWorkspace {...props} />;
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
            navigateToView={props.navigateToView}
            openPageWorkspace={props.openPageWorkspace}
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
