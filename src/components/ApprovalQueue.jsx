import { approvals } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function ApprovalQueue() {
  const { openWorkspace, resolveRecord } = useWorkspace();
  const queue = approvals.map((item) => resolveRecord("approvals", item));

  return (
    <section className="panel span-8" aria-labelledby="approval-title">
      <div className="panel-header">
        <div>
          <p className="panel-label">To-Do List</p>
          <h2 id="approval-title">Pending actions waiting for review</h2>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() => openWorkspace("notificationCenter")}
        >
          Open notification center
        </button>
      </div>
      <div className="table">
        <div className="table-head">
          <span>ID</span>
          <span>Item</span>
          <span>Module</span>
          <span>Owner</span>
          <span>Due</span>
          <span>Status</span>
        </div>
        {queue.map((item) => (
          <button
            className="table-row table-row-button"
            key={item.id}
            type="button"
            onClick={() =>
              openWorkspace("approvalRecord", {
                record: item,
              })
            }
          >
            <span className="mono">{item.id}</span>
            <span>{item.title}</span>
            <span>{item.module}</span>
            <span>{item.owner}</span>
            <span>{item.due}</span>
            <span className={`status ${item.status.toLowerCase().replace(/\s/g, "-")}`}>
              {item.status}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
