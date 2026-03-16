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

export default function App() {
  const [activeView, setActiveView] = useState("home");

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="main-shell">
        <Topbar activeView={activeView} />
        <main id="main" className="dashboard">
          {activeView === "home" ? (
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
          {activeView === "webmail" ? <WebmailPage /> : null}
          {activeView === "dms" ? <DmsPage /> : null}
          {activeView === "safety" ? <SafetyPage /> : null}
          {activeView === "qs" ? <QsPage /> : null}
          {activeView === "procurement" ? <ProcurementPage /> : null}
          {activeView === "hr" ? <HrPage /> : null}
          {activeView === "plant" ? <PlantPage /> : null}
          {activeView === "ims" ? <ImsPage /> : null}
        </main>
      </div>
    </div>
  );
}
