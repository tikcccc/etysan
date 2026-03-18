import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { imsComplaints } from "../data/ims.js";
import { procurementOrders } from "../data/procurement.js";
import { qsPayments } from "../data/qs.js";
import { workers } from "../data/safety.js";

const inspectionStory = {
  id: "PAT-219",
  title: "Tower crane pre-start checklist",
  zone: "Zone B",
  due: "2026-01-29 16:00",
};

export default function DemoPathways() {
  const { navigateToView, openPageWorkspace, resolveRecord } = useWorkspace();
  const transferredWorker = workers.find((worker) => worker.name === "Chan Tai Man") || workers[0];
  const procurementRecords = procurementOrders.map((order) =>
    resolveRecord("procurementOrders", order)
  );
  const complaintRecords = imsComplaints.map((record) =>
    resolveRecord("imsComplaints", record)
  );
  const paymentRecords = qsPayments.map((record) =>
    resolveRecord("qsPayments", record)
  );
  const deliveryOrder =
    procurementRecords.find((order) => order.step === 4) ||
    procurementRecords.find((order) => order.step >= 4) ||
    procurementRecords[0];
  const paymentOrder =
    procurementRecords.find((order) => order.step >= 5) ||
    procurementRecords.find((order) => order.step >= 4) ||
    procurementRecords[0];
  const openComplaint =
    complaintRecords.find((record) => record.status === "Open") || complaintRecords[0];
  const openPayment = paymentRecords[0];

  const stories = [
    {
      id: "worker-transfer",
      module: "Safety",
      title: "Cross-site worker profile",
      detail:
        "Load training, accident, and certificate history at Site B without re-registration.",
      highlights: ["Scan card / search ID", "Site A history", "HR deep link"],
    },
    {
      id: "toolbox-talk",
      module: "Safety",
      title: "Toolbox Talk attendance",
      detail:
        "Capture high-volume attendance with tap card, manual fallback, and automatic training record updates.",
      highlights: ["Tap card", "Manual mode", "Training sync"],
    },
    {
      id: "ad-hoc-issue",
      module: "Safety",
      title: "Ad-hoc issue closure",
      detail:
        "Log field issues on mobile, assign subcontractors, and close with rectification evidence.",
      highlights: ["Mobile capture", "Assign subcontractor", "Audit trail"],
    },
    {
      id: "procurement-match",
      module: "Procurement",
      title: "PR to delivery and three-way match",
      detail:
        "Route requisitions into delivery verification and invoice variance control before QS handover.",
      highlights: ["Delivery note / GRN", "Invoice variance", "QS handover"],
    },
    {
      id: "complaint-car",
      module: "IMS",
      title: "Complaint to CAR closure",
      detail:
        "Register complaints, assign investigation, issue CAR, and close with signed records.",
      highlights: ["Investigator", "Root cause", "E-sign close"],
    },
    {
      id: "payment-certificate",
      module: "QS",
      title: "Payment certificate review",
      detail:
        "Review OCR extraction, linked delivery records, revision handling, and final certification.",
      highlights: ["OCR extracted", "Delivery note link", "Director certify"],
    },
  ];

  function openStory(storyId) {
    switch (storyId) {
      case "worker-transfer":
        openPageWorkspace("safetyWorkerProfile", { record: transferredWorker }, "safety");
        return;
      case "toolbox-talk":
        openPageWorkspace("safetyAttendance", {}, "safety");
        return;
      case "ad-hoc-issue":
        openPageWorkspace("safetyInspection", { record: inspectionStory }, "safety");
        return;
      case "procurement-match":
        openPageWorkspace("procurementDelivery", { record: deliveryOrder }, "procurement");
        return;
      case "complaint-car":
        openPageWorkspace("imsComplaint", { record: openComplaint }, "ims");
        return;
      case "payment-certificate":
        openPageWorkspace(
          "qsPayment",
          {
            linkedOrder: paymentOrder,
            record: openPayment,
          },
          "qs"
        );
        return;
      default:
        return;
    }
  }

  function openModule(storyId) {
    const viewMap = {
      "worker-transfer": "safety",
      "toolbox-talk": "safety",
      "ad-hoc-issue": "safety",
      "procurement-match": "procurement",
      "complaint-car": "ims",
      "payment-certificate": "qs",
    };

    navigateToView(viewMap[storyId] || "home");
  }

  return (
    <section className="panel demo-pathways-panel" aria-labelledby="demo-pathways-title">
      <div className="demo-pathways-head">
        <div className="demo-pathways-copy">
          <p className="panel-label">Priority workflows</p>
          <h2 id="demo-pathways-title">Operational workflows</h2>
          <p className="demo-pathways-detail">
            Cross-module workflows with live status, approvals, and linked records
            presented in one operational workspace.
          </p>
        </div>
        <div className="demo-pathways-summary">
          <span className="demo-summary-pill">Integrated workflow</span>
          <span className="demo-summary-pill">Linked approvals</span>
          <span className="demo-summary-pill">Controlled records</span>
          <span className="demo-summary-pill">Audit ready</span>
        </div>
      </div>

      <div className="demo-pathways-grid">
        {stories.map((story, index) => (
          <article key={story.id} className="demo-story-card">
            <div className="demo-story-top">
              <span className="demo-story-step">{String(index + 1).padStart(2, "0")}</span>
              <span className="demo-story-module">{story.module}</span>
            </div>
            <div className="demo-story-copy">
              <h3 className="demo-story-title">{story.title}</h3>
              <p className="demo-story-detail">{story.detail}</p>
            </div>
            <div className="demo-story-tags">
              {story.highlights.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
            <div className="demo-story-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => openStory(story.id)}
              >
                Open workflow
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => openModule(story.id)}
              >
                Go to module
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
