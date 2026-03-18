import { roles, officeTeams, siteTeams } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function RolesPanel() {
  const { openWorkspace } = useWorkspace();

  return (
    <section className="panel span-4" aria-labelledby="roles-title">
      <div className="panel-header">
        <div>
          <p className="panel-label">Approval Roles</p>
          <h2 id="roles-title">Department access matrix</h2>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() =>
            openWorkspace("infoBoard", {
              badge: `${roles.length} roles`,
              moduleLabel: "Access Control",
              sections: [
                {
                  title: "Approval roles",
                  items: roles.map((role) => ({
                    title: role,
                    detail: "Role-based access and delegated workflow control.",
                    badge: "Active",
                    badgeTone: "approved",
                  })),
                },
                {
                  title: "Office teams",
                  items: officeTeams.map((team) => ({ title: team })),
                },
                {
                  title: "Site teams",
                  items: siteTeams.map((team) => ({ title: team })),
                },
              ],
              subtitle: "RBAC matrix across office and site operating teams.",
              title: "Permission registry",
            })
          }
        >
          Manage permissions
        </button>
      </div>
      <div className="roles-grid">
        {roles.map((role) => (
          <span key={role} className="chip">
            {role}
          </span>
        ))}
      </div>
      <div className="team-grid">
        <div>
          <p className="panel-label">Office</p>
          <div className="team-tags">
            {officeTeams.map((team) => (
              <span key={team} className="tag">
                {team}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="panel-label">Site</p>
          <div className="team-tags">
            {siteTeams.map((team) => (
              <span key={team} className="tag">
                {team}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
