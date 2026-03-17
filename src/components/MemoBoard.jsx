import { memos } from "../data/modules.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function MemoBoard() {
  const { openWorkspace } = useWorkspace();

  const memoSections = [
    {
      title: "Latest circulars",
      items: memos.map((memo) => ({
        title: memo.title,
        detail: memo.detail,
        badge: "Issued",
        badgeTone: "approved",
      })),
    },
  ];

  return (
    <section className="panel span-6" aria-labelledby="memo-title">
      <div className="panel-header">
        <div>
          <p className="panel-label">What's New</p>
          <h2 id="memo-title">Latest company memos</h2>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() =>
            openWorkspace("infoBoard", {
              badge: "Current",
              moduleLabel: "Corporate",
              sections: memoSections,
              subtitle: "Company communications, policy updates, and issued notices.",
              title: "Memo Center",
            })
          }
        >
          View all memos
        </button>
      </div>
      <div className="memo-list">
        {memos.map((memo) => (
          <article className="memo-item" key={memo.title}>
            <div>
              <p className="memo-title">{memo.title}</p>
              <p className="memo-detail">{memo.detail}</p>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() =>
                openWorkspace("infoBoard", {
                  badge: "Issued",
                  moduleLabel: "Corporate",
                  sections: [
                    {
                      title: memo.title,
                      items: [
                        {
                          title: memo.title,
                          detail: memo.detail,
                          meta: "Acknowledgement required",
                          badge: "Memo",
                          badgeTone: "approved",
                        },
                      ],
                    },
                  ],
                  subtitle: "Controlled memo distribution and acknowledgement tracking.",
                  title: "Memo record",
                })
              }
            >
              Open
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
