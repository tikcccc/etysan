import { usefulLinks, chatContacts } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function RightRail() {
  const { openWorkspace } = useWorkspace();

  return (
    <aside className="dashboard-rail">
      <div className="rail-card">
        <p className="panel-label">Useful Links / App</p>
        <div className="link-grid">
          {usefulLinks.map((link) => (
            <button
              key={link}
              className="link-card"
              type="button"
              onClick={() =>
                openWorkspace("infoBoard", {
                  badge: "External",
                  badgeTone: "muted",
                  moduleLabel: "Links",
                  sections: [
                    {
                      title: "Registered quick links",
                      items: usefulLinks.map((item) => ({
                        title: item,
                        detail: "Pinned from the central application launcher.",
                        badge: item === link ? "Selected" : "Available",
                        badgeTone: item === link ? "review" : "muted",
                      })),
                    },
                  ],
                  subtitle: "Pinned tools and external references maintained by the platform team.",
                  title: "Quick links",
                })
              }
            >
              {link}
            </button>
          ))}
        </div>
      </div>
      <div className="rail-card">
        <p className="panel-label">Chat Box</p>
        <p className="rail-sub">Connect to departments</p>
        <div className="chat-list">
          {chatContacts.map((contact) => (
            <button
              key={contact}
              className="chat-item"
              type="button"
              onClick={() =>
                openWorkspace("infoBoard", {
                  badge: "Connected",
                  badgeTone: "approved",
                  moduleLabel: "Chat",
                  sections: [
                    {
                      title: "Department channels",
                      items: chatContacts.map((item) => ({
                        title: item,
                        detail: "Available for routed operational chat.",
                        badge: item === contact ? "Open" : "Standby",
                        badgeTone: item === contact ? "review" : "muted",
                      })),
                    },
                  ],
                  subtitle: "Internal communication channels for project, safety, and support coordination.",
                  title: `${contact} channel`,
                })
              }
            >
              <span className="chat-dot" />
              <span>{contact}</span>
            </button>
          ))}
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() =>
            openWorkspace("infoBoard", {
              badge: "Online",
              badgeTone: "approved",
              moduleLabel: "Chat",
              sections: [
                {
                  title: "Department channels",
                  items: chatContacts.map((item) => ({
                    title: item,
                    detail: "Presence, escalation, and attachment support enabled.",
                  })),
                },
              ],
              subtitle: "Persistent internal chat channels with department routing.",
              title: "Chat console",
            })
          }
        >
          Open chat console
        </button>
      </div>
      <div className="rail-card">
        <p className="panel-label">Future Plug-ins</p>
        <p className="rail-sub">
          Reserve slots for upcoming workflow apps and integrations.
        </p>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            openWorkspace("infoBoard", {
              badge: "Pipeline",
              badgeTone: "review",
              moduleLabel: "Integrations",
              sections: [
                {
                  title: "Requested integrations",
                  items: [
                    {
                      title: "Smart site safety connector",
                      detail: "API-first interface with event and evidence sync.",
                      badge: "In review",
                      badgeTone: "review",
                    },
                    {
                      title: "Payroll exchange",
                      detail: "Attendance and allowance transfer to payroll.",
                      badge: "Planned",
                      badgeTone: "muted",
                    },
                  ],
                },
              ],
              subtitle: "Registered integration requests and delivery readiness.",
              title: "Integration pipeline",
            })
          }
        >
          Request integration
        </button>
      </div>
    </aside>
  );
}
