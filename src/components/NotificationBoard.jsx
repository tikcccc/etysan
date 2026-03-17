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
            openWorkspace("infoBoard", {
              badge: `${notifications.length} live`,
              moduleLabel: "Operations",
              sections: [
                {
                  title: "Cross-module updates",
                  items: notifications.map((note) => ({
                    title: note.title,
                    detail: note.detail,
                    badge: "Unread",
                    badgeTone: "review",
                  })),
                },
              ],
              subtitle: "System-triggered updates across project, procurement, safety, and plant records.",
              title: "Notification Center",
            })
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
              openWorkspace("infoBoard", {
                badge: "Unread",
                badgeTone: "review",
                moduleLabel: note.title,
                sections: [
                  {
                    title: note.title,
                    items: [
                      {
                        title: note.title,
                        detail: note.detail,
                        meta: "System notification",
                        badge: "Open",
                        badgeTone: "review",
                      },
                    ],
                  },
                ],
                subtitle: "Notification routing, source module, and follow-up controls.",
                title: "Notification record",
              })
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
