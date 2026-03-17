import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import ProjectPhasePie from "./components/ProjectPhasePie.jsx";
import TaskPieCard from "./components/TaskPieCard.jsx";
import MemoBoard from "./components/MemoBoard.jsx";
import NotificationBoard from "./components/NotificationBoard.jsx";
import ApprovalQueue from "./components/ApprovalQueue.jsx";
import ProjectOverview from "./components/ProjectOverview.jsx";
import ModuleLauncher from "./components/ModuleLauncher.jsx";
import RolesPanel from "./components/RolesPanel.jsx";
import RightRail from "./components/RightRail.jsx";
import DmsPage from "./components/DmsPage.jsx";
import SafetyPage from "./components/SafetyPage.jsx";
import WebmailPage from "./components/WebmailPage.jsx";
import QsPage from "./components/QsPage.jsx";
import ProcurementPage from "./components/ProcurementPage.jsx";
import HrPage from "./components/HrPage.jsx";
import PlantPage from "./components/PlantPage.jsx";
import ImsPage from "./components/ImsPage.jsx";
import WorkspaceDrawer from "./components/WorkspaceDrawer.jsx";
import WorkspacePage from "./components/WorkspacePage.jsx";
import { WorkspaceContext } from "./context/WorkspaceContext.jsx";

export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [workspace, setWorkspace] = useState(null);
  const [pageWorkspace, setPageWorkspace] = useState(null);
  const [recordOverrides, setRecordOverrides] = useState({});

  const openWorkspace = (kind, payload = {}) => {
    setWorkspace({ kind, payload });
  };

  const openPageWorkspace = (kind, payload = {}, targetView = null) => {
    if (targetView) {
      setActiveView(targetView);
    }

    setWorkspace(null);
    setPageWorkspace({ kind, payload });
  };

  const closeWorkspace = () => {
    setWorkspace(null);
  };

  const closePageWorkspace = () => {
    setPageWorkspace(null);
  };

  const navigateToView = (view) => {
    setActiveView(view);
    setWorkspace(null);
    setPageWorkspace(null);
  };

  const updateRecord = (recordType, recordId, patch) => {
    if (!recordType || !recordId || !patch) {
      return;
    }

    setRecordOverrides((current) => ({
      ...current,
      [recordType]: {
        ...(current[recordType] || {}),
        [recordId]: {
          ...(current[recordType]?.[recordId] || {}),
          ...patch,
        },
      },
    }));
  };

  const resolveRecord = (recordType, record) => {
    if (!record) {
      return record;
    }

    const recordId = record.id || record.ref;

    if (!recordType || !recordId) {
      return record;
    }

    const override = recordOverrides[recordType]?.[recordId];

    return override ? { ...record, ...override } : record;
  };

  const workspaceContextValue = {
    activeView,
    closePageWorkspace,
    closeWorkspace,
    navigateToView,
    openPageWorkspace,
    openWorkspace,
    pageWorkspace,
    resolveRecord,
    updateRecord,
    workspace,
  };

  return (
    <WorkspaceContext.Provider value={workspaceContextValue}>
      <div className="app-shell">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        <Sidebar activeView={activeView} onViewChange={navigateToView} />
        <div className="main-shell">
          <Topbar activeView={activeView} />
          <main id="main" className="dashboard">
            {pageWorkspace ? (
              <WorkspacePage
                activeView={activeView}
                onClose={closePageWorkspace}
                openPageWorkspace={openPageWorkspace}
                openWorkspace={openWorkspace}
                resolveRecord={resolveRecord}
                updateRecord={updateRecord}
                workspace={pageWorkspace}
              />
            ) : null}
            {!pageWorkspace && activeView === "home" ? (
              <>
                <div className="dashboard-hero">
                  <ProjectPhasePie />
                  <TaskPieCard />
                </div>
                <div className="dashboard-layout">
                  <div className="dashboard-main">
                    <div className="dashboard-grid">
                      <MemoBoard />
                      <NotificationBoard />
                      <ApprovalQueue />
                      <ProjectOverview />
                      <ModuleLauncher />
                      <RolesPanel />
                    </div>
                  </div>
                  <RightRail />
                </div>
              </>
            ) : null}
            {!pageWorkspace && activeView === "webmail" ? <WebmailPage /> : null}
            {!pageWorkspace && activeView === "dms" ? <DmsPage /> : null}
            {!pageWorkspace && activeView === "safety" ? <SafetyPage /> : null}
            {!pageWorkspace && activeView === "qs" ? <QsPage /> : null}
            {!pageWorkspace && activeView === "procurement" ? <ProcurementPage /> : null}
            {!pageWorkspace && activeView === "hr" ? <HrPage /> : null}
            {!pageWorkspace && activeView === "plant" ? <PlantPage /> : null}
            {!pageWorkspace && activeView === "ims" ? <ImsPage /> : null}
          </main>
        </div>
      </div>
      <WorkspaceDrawer
        navigateToView={navigateToView}
        onClose={closeWorkspace}
        openPageWorkspace={openPageWorkspace}
        openWorkspace={openWorkspace}
        resolveRecord={resolveRecord}
        updateRecord={updateRecord}
        workspace={workspace}
      />
    </WorkspaceContext.Provider>
  );
}
