import { ActiveWorkspace } from "./WorkspaceDrawer.jsx";

const viewLabels = {
  dms: "Document Management",
  hr: "Human Resources",
  home: "Home",
  ims: "IMS",
  plant: "Plant",
  procurement: "Procurement",
  qs: "QS",
  safety: "Safety",
  webmail: "Webmail",
};

function getWorkspaceKey(workspace) {
  return (
    workspace?.payload?.record?.id ||
    workspace?.payload?.record?.ref ||
    workspace?.kind
  );
}

export default function WorkspacePage({
  activeView,
  onClose,
  openPageWorkspace,
  openWorkspace,
  resolveRecord,
  updateRecord,
  workspace,
}) {
  if (!workspace) {
    return null;
  }

  return (
    <section className="workspace-page" aria-label="Workflow page">
      <div className="workspace-page-topbar">
        <div className="workspace-page-trail">
          <button className="workspace-page-back" type="button" onClick={onClose}>
            Back to {viewLabels[activeView] || "module"}
          </button>
          <span className="workspace-page-divider" aria-hidden="true">
            /
          </span>
          <div>
            <p className="workspace-page-label">Workflow page</p>
            <p className="workspace-page-note">
              Full-page task flow for long-form input, status progression, and audit trail.
            </p>
          </div>
        </div>
        <button className="ghost-button" type="button" onClick={onClose}>
          Close page
        </button>
      </div>

      <div className="workspace-page-surface">
        <ActiveWorkspace
          closeWorkspace={onClose}
          key={getWorkspaceKey(workspace)}
          openPageWorkspace={openPageWorkspace}
          openWorkspace={openWorkspace}
          resolveRecord={resolveRecord}
          surface="page"
          updateRecord={updateRecord}
          workspace={workspace}
        />
      </div>
    </section>
  );
}
