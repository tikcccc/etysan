import { notifications } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function NotificationBoard() {
  const { openWorkspace } = useWorkspace();

  return (
    <section className="panel span-6" aria-labelledby="notification-title">
      <div className="panel-header">
        <div>
          <p className="panel-label">Notifications</p>
          <h2 id="notification-title">Updates from other modules</h2>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() =>
            openWorkspace("notificationCenter", { initialTab: "notifications" })
          }
        >
          Open notification center
        </button>
      </div>
      <div className="notification-grid">
        {notifications.map((note) => (
          <button
            className="notification-card"
            key={note.title}
            type="button"
            onClick={() =>
              openWorkspace("notificationCenter", { initialTab: "notifications" })
            }
          >
            <p className="notification-title">{note.title}</p>
            <p className="notification-detail">{note.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
