import { useState } from "react";
import {
  dmsLibraries,
  dmsCategories,
  dmsDocuments,
  dmsApprovals,
  dmsMeta,
  dmsExternalAccess,
  dmsFolderCards,
} from "../data/dms.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import StorySpotlight from "./StorySpotlight.jsx";

const statusFilters = [
  "All files",
  "In review",
  "Pending",
  "Approved",
  "External",
  "Archived",
];
const viewModes = ["List", "Grid"];

const monthIndexMap = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseUpdatedValue(value = "") {
  const [month, day] = value.split(" ");
  const monthIndex = monthIndexMap[month];

  if (monthIndex === undefined) {
    return 0;
  }

  return new Date(2026, monthIndex, Number(day) || 1).getTime();
}

function parseSizeValue(value = "") {
  const match = value.match(/([\d.]+)\s*(KB|MB|GB)/i);

  if (!match) {
    return 0;
  }

  const amount = Number(match[1]);
  const unit = match[2].toUpperCase();

  if (unit === "GB") {
    return amount * 1024 * 1024;
  }

  if (unit === "MB") {
    return amount * 1024;
  }

  return amount;
}

export default function DmsPage() {
  const { openPageWorkspace, openWorkspace, resolveRecord } = useWorkspace();
  const [activeLibrary, setActiveLibrary] = useState(
    dmsLibraries[0]?.id || "project"
  );
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState(statusFilters[0]);
  const [viewMode, setViewMode] = useState(viewModes[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("Updated");
  const [activeCategory, setActiveCategory] = useState(null);
  const libraryDocuments = dmsDocuments
    .map((doc) => resolveRecord("dmsDocuments", doc))
    .filter((doc) => doc.library?.toLowerCase() === activeLibrary);
  const filteredDocuments = [...libraryDocuments]
    .filter((doc) => {
      if (activeCategory && doc.category !== activeCategory) {
        return false;
      }

      switch (activeStatusFilter) {
        case "In review":
          return doc.status === "Review";
        case "Pending":
          return doc.status === "Pending";
        case "Approved":
          return doc.status === "Approved";
        case "External":
          return doc.status === "External";
        case "Archived":
          return doc.status === "Archive";
        default:
          return true;
      }
    })
    .filter((doc) => {
      const keyword = searchQuery.trim().toLowerCase();

      if (!keyword) {
        return true;
      }

      return [
        doc.title,
        doc.id,
        doc.owner,
        doc.category,
        doc.phase,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    })
    .sort((left, right) => {
      switch (sortMode) {
        case "Owner":
          return left.owner.localeCompare(right.owner);
        case "Size":
          return parseSizeValue(right.size) - parseSizeValue(left.size);
        case "Created":
        case "Updated":
        default:
          return parseUpdatedValue(right.updated) - parseUpdatedValue(left.updated);
      }
    });
  const selectedDoc =
    filteredDocuments.find((doc) => doc.id === selectedDocId) ??
    filteredDocuments[0] ??
    libraryDocuments[0] ??
    dmsDocuments[0];
  const activeLibraryLabel =
    dmsLibraries.find((library) => library.id === activeLibrary)?.label ||
    "Project DMS";
  const reviewDocument =
    libraryDocuments.find(
      (doc) => doc.status === "Review" || doc.status === "Pending"
    ) ?? selectedDoc;
  const signalCards = [
    {
      label: "Needs review",
      value: `${libraryDocuments.filter((doc) => doc.status === "Review").length}`,
      note: "Controlled copies awaiting reviewer action",
    },
    {
      label: "Pending approval",
      value: `${libraryDocuments.filter((doc) => doc.status === "Pending").length}`,
      note: "Records queued for release approval",
    },
    {
      label: "Secure issue",
      value: `${libraryDocuments.filter((doc) => doc.externalAccess !== "None").length}`,
      note: "Links under expiry and watermark control",
    },
    {
      label: "Indexed records",
      value: `${libraryDocuments.filter((doc) => doc.ocr).length}`,
      note: "Searchable metadata and OCR available",
    },
  ];
  const breadcrumbs = [
    activeLibraryLabel,
    selectedDoc?.phase ?? "All phases",
    activeCategory ?? selectedDoc?.category ?? "All categories",
  ];
  const detailMeta = selectedDoc
    ? [
        { label: "Doc ID", value: selectedDoc.id },
        { label: "Owner", value: selectedDoc.owner },
        { label: "Phase", value: selectedDoc.phase },
        { label: "Library", value: `${selectedDoc.library} DMS` },
        ...dmsMeta,
        { label: "External Access", value: selectedDoc.externalAccess },
      ]
    : [];
  const hasActiveFilters =
    Boolean(activeCategory) ||
    activeStatusFilter !== statusFilters[0] ||
    searchQuery.trim().length > 0;
  const openUploadPage = () =>
    openPageWorkspace(
      "dmsUpload",
      {
        library: activeLibraryLabel,
      },
      "dms"
    );
  const openReviewPage = (record) =>
    openPageWorkspace("dmsReview", { record }, "dms");
  const resetFilters = () => {
    setActiveCategory(null);
    setActiveStatusFilter(statusFilters[0]);
    setSearchQuery("");
    setSelectedDocId(null);
  };
  const openDownloadBoard = (record) =>
    openWorkspace("infoBoard", {
      badge: record.type,
      badgeTone: "muted",
      moduleLabel: "Document Management",
      sections: [
        {
          title: "Download package",
          items: [
            {
              title: record.title,
              detail: `${record.id} · ${record.size}`,
              meta: "Watermark retained on export",
            },
          ],
        },
      ],
      subtitle: "Document export request with controlled issue safeguards.",
      title: "File export",
    });
  const toggleCategory = (category) => {
    setActiveCategory((current) => (current === category ? null : category));
    setSelectedDocId(null);
  };

  return (
    <section className="dms dms-browser">
      <StorySpotlight
        eyebrow="Document control"
        title="Controlled issue and external release"
        description="Register records, route approvals, and release secure links with watermark and expiry control from a single document workspace."
        tags={[activeLibraryLabel, "Version register", "Secure link"]}
        primaryAction={{
          label: "Create controlled issue",
          onClick: openUploadPage,
        }}
        secondaryAction={{
          label: "Open review workspace",
          onClick: () => openReviewPage(reviewDocument),
        }}
        metrics={[
          { label: "Priority file", value: reviewDocument?.id || "DMS-2441" },
          { label: "Release state", value: reviewDocument?.status || "Review" },
        ]}
      />

      <div className="kpi-bar dms-kpi-bar">
        {signalCards.map((item) => (
          <article key={item.label} className="kpi-card">
            <p className="kpi-label">{item.label}</p>
            <div className="kpi-value">
              <h3 className="overview-value neutral">{item.value}</h3>
            </div>
            <p className="kpi-delta">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="dms-command">
        <div>
          <p className="eyebrow">Library workspace</p>
          <div
            className="dms-view-toggle dms-library-toggle"
            role="tablist"
            aria-label="DMS libraries"
          >
            {dmsLibraries.map((library) => (
              <button
                key={library.id}
                type="button"
                role="tab"
                aria-selected={activeLibrary === library.id}
                className={activeLibrary === library.id ? "active" : ""}
                onClick={() => {
                  setActiveLibrary(library.id);
                  setActiveCategory(null);
                  setActiveStatusFilter(statusFilters[0]);
                  setSearchQuery("");
                  setSelectedDocId(null);
                }}
              >
                {library.label}
              </button>
            ))}
          </div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((crumb, index) => (
                <li
                  key={crumb}
                  className={index === breadcrumbs.length - 1 ? "active" : ""}
                >
                  {crumb}
                </li>
              ))}
            </ol>
          </nav>
          <p className="dms-path-meta">
            {libraryDocuments.length} files | {dmsCategories.length} controlled categories | Last update 2 hours ago
          </p>
        </div>
        <div className="dms-command-actions">
          <div className="dms-view-toggle" role="group" aria-label="View mode">
            {viewModes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={viewMode === mode ? "active" : ""}
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={openUploadPage}
          >
            Upload record
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() =>
              openWorkspace("infoBoard", {
                badge: "Configured",
                moduleLabel: "Document Management",
                sections: [
                  {
                    title: "Folder templates",
                    items: dmsCategories.slice(0, 6).map((category) => ({
                      title: `${category.code} · ${category.name}`,
                      detail: `${category.count} active records`,
                      badge: "Template",
                      badgeTone: "muted",
                    })),
                  },
                ],
                subtitle: "Controlled folder structures, record categories, and retention grouping.",
                title: "Folder structure",
              })
            }
          >
            Folder structure
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() =>
              openWorkspace("dmsShare", {
                record: selectedDoc,
              })
            }
          >
            Secure issue
          </button>
        </div>
      </div>

      <div className="dms-browser-layout">
        <aside className="dms-side">
          <div className="dms-panel dms-panel--folders">
            <p className="panel-label">Folder tree</p>
            <div className="folder-tree">
              {dmsCategories.map((category) => (
                <button
                  key={category.code}
                  className={`folder-item ${
                    activeCategory === category.name ? "active" : ""
                  }`}
                  type="button"
                  onClick={() => toggleCategory(category.name)}
                >
                  <span className="folder-code">{category.code}</span>
                  <span className="folder-name">{category.name}</span>
                  <span className="folder-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="dms-panel">
            <p className="panel-label">Quick access</p>
            <div className="quick-links">
              <button
                className="quick-link"
                type="button"
                onClick={() =>
                  openWorkspace("infoBoard", {
                    badge: "Shared",
                    badgeTone: "review",
                    moduleLabel: "Document Management",
                    sections: [
                      {
                        title: "Shared links",
                        items: dmsExternalAccess.map((item) => ({
                          title: item.name,
                          detail: item.scope,
                          meta: `Expires ${item.expiry}`,
                        })),
                      },
                    ],
                    subtitle: "Externally issued records with time-bound access control.",
                    title: "Shared with me",
                  })
                }
              >
                Shared links
              </button>
              <button
                className="quick-link"
                type="button"
                onClick={() =>
                  openWorkspace("infoBoard", {
                    badge: `${dmsApprovals.length} routed`,
                    badgeTone: "review",
                    moduleLabel: "Document Management",
                    sections: [
                      {
                        title: "Controlled review queue",
                        items: dmsApprovals.map((step) => ({
                          title: step.name,
                          detail: step.step,
                          badge: step.status,
                          badgeTone:
                            step.status === "Approved"
                              ? "approved"
                              : step.status === "Pending"
                                ? "review"
                                : "muted",
                        })),
                      },
                    ],
                    subtitle: "DMS-specific review routing for controlled document issue.",
                    title: "Pending review",
                  })
                }
              >
                Review queue
              </button>
              <button
                className="quick-link"
                type="button"
                onClick={() =>
                  openWorkspace("infoBoard", {
                    badge: "Expiring",
                    badgeTone: "warning",
                    moduleLabel: "Document Management",
                    sections: [
                      {
                        title: "Expiring access",
                        items: dmsExternalAccess.map((item) => ({
                          title: item.name,
                          detail: item.scope,
                          meta: `Expires ${item.expiry}`,
                          badge: item.expiry,
                          badgeTone: "warning",
                        })),
                      },
                    ],
                    subtitle: "Time-limited external links and release governance.",
                    title: "Expiring links",
                  })
                }
              >
                Expiring access
              </button>
            </div>
          </div>
        </aside>

        <section className="dms-center">
          <div className="dms-center-toolbar">
            <div className="dms-search">
              <span className="search-icon">Search</span>
              <input
                type="search"
                placeholder="Search by title, ID, owner"
                aria-label="Search documents"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="dms-filter-row">
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  className={`status-filter ${
                    activeStatusFilter === filter ? "active" : ""
                  }`}
                  type="button"
                  onClick={() => setActiveStatusFilter(filter)}
                >
                  {filter}
                </button>
              ))}
              <label className="filter">
                <span>Sort</span>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                  <option value="Updated">Last updated</option>
                  <option value="Created">Date created</option>
                  <option value="Owner">Owner</option>
                  <option value="Size">File size</option>
                </select>
              </label>
              {hasActiveFilters ? (
                <button className="ghost-button" type="button" onClick={resetFilters}>
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>

          <div className="folder-grid">
            {dmsFolderCards.map((folder) => (
              <button
                key={folder.name}
                className={`folder-card tone-${folder.tone} ${
                  activeCategory === folder.category ? "active" : ""
                }`}
                type="button"
                onClick={() => toggleCategory(folder.category)}
              >
                <div className="folder-card-head">
                  <p className="folder-title">{folder.name}</p>
                  <span className="folder-count-pill">{folder.count} files</span>
                </div>
                <p className="folder-meta">{folder.subtitle}</p>
                <p className="folder-update">Updated {folder.updated}</p>
              </button>
            ))}
          </div>

          {filteredDocuments.length ? (
            viewMode === "List" ? (
              <div className="dms-files">
                <div className="dms-file-head">
                  <span>Name</span>
                  <span>Owner</span>
                  <span>Status</span>
                  <span>Updated</span>
                  <span>Size</span>
                  <span>Actions</span>
                </div>
                {filteredDocuments.map((doc) => (
                  <article
                    key={doc.id}
                    className={`dms-file-row ${doc.id === selectedDoc.id ? "active" : ""}`}
                    onClick={() => setSelectedDocId(doc.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedDocId(doc.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="file-main">
                      <div className={`file-icon type-${doc.type.toLowerCase()}`}>
                        {doc.type}
                      </div>
                      <div className="file-info">
                        <p className="file-title">{doc.title}</p>
                        <p className="file-sub">
                          {doc.id} | {doc.category}
                        </p>
                        <div className="file-tags">
                          <span className="file-tag">{doc.phase}</span>
                          {doc.ocr ? <span className="file-tag">OCR</span> : null}
                          {doc.encrypted ? (
                            <span className="file-tag">Encrypted</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <span className="file-owner">{doc.owner}</span>
                    <span className={`status-chip ${doc.status.toLowerCase()}`}>
                      {doc.status}
                    </span>
                    <span className="file-updated">{doc.updated}</span>
                    <span className="file-size">{doc.size}</span>
                    <span className="file-actions">
                      <button
                        className="file-action"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openReviewPage(doc);
                        }}
                      >
                        Review
                      </button>
                      <button
                        className="file-action ghost"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDownloadBoard(doc);
                        }}
                      >
                        Download
                      </button>
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="dms-document-grid">
                {filteredDocuments.map((doc) => (
                  <article
                    key={doc.id}
                    className={`dms-document-card ${
                      doc.id === selectedDoc.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedDocId(doc.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedDocId(doc.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="dms-document-top">
                      <div className="file-main">
                        <div className={`file-icon type-${doc.type.toLowerCase()}`}>
                          {doc.type}
                        </div>
                        <div className="file-info">
                          <p className="file-title">{doc.title}</p>
                          <p className="file-sub">{doc.id}</p>
                        </div>
                      </div>
                      <span className={`status-chip ${doc.status.toLowerCase()}`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="dms-document-summary">
                      {doc.category} · {doc.owner}
                    </p>
                    <div className="file-tags">
                      <span className="file-tag">{doc.phase}</span>
                      <span className="file-tag">{doc.size}</span>
                      {doc.ocr ? <span className="file-tag">OCR</span> : null}
                      {doc.externalAccess !== "None" ? (
                        <span className="file-tag">Secure issue</span>
                      ) : null}
                    </div>
                    <div className="dms-document-footer">
                      <span>{doc.updated}</span>
                      <div className="file-actions">
                        <button
                          className="file-action"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openReviewPage(doc);
                          }}
                        >
                          Review
                        </button>
                        <button
                          className="file-action ghost"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openWorkspace("dmsShare", {
                              record: doc,
                            });
                          }}
                        >
                          Issue
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : (
            <div className="dms-empty-state">
              <p>No controlled records match the current filters.</p>
              <button className="ghost-button" type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </section>

        <aside className="dms-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className={`file-icon type-${selectedDoc.type.toLowerCase()}`}>
                {selectedDoc.type}
              </div>
              <div>
                <p className="panel-label">Current record</p>
                <h3>{selectedDoc.title}</h3>
                <p className="preview-sub">
                  {selectedDoc.id} | {selectedDoc.category}
                </p>
              </div>
            </div>

            <div className="preview-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => openReviewPage(selectedDoc)}
              >
                Open review
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() =>
                  openWorkspace("dmsShare", {
                    record: selectedDoc,
                  })
                }
              >
                Secure issue
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => openDownloadBoard(selectedDoc)}
              >
                Download
              </button>
            </div>

            <div className="preview-sheet" aria-hidden="true">
              <div className="preview-line wide" />
              <div className="preview-line" />
              <div className="preview-line" />
              <div className="preview-line short" />
            </div>

            <div className="preview-meta">
              {detailMeta.map((item) => (
                <div key={item.label} className="preview-meta-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="preview-section">
              <p className="panel-label">Issue route</p>
              <div className="approval-list">
                {dmsApprovals.map((step) => (
                  <div key={step.step} className="approval-row">
                    <div>
                      <p className="approval-step">{step.step}</p>
                      <p className="approval-name">{step.name}</p>
                    </div>
                    <span
                      className={`pill ${step.status.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="preview-section">
              <p className="panel-label">Access register</p>
              <div className="external-list">
                {dmsExternalAccess.map((item) => (
                  <div key={item.name} className="external-item">
                    <div>
                      <p className="external-name">{item.name}</p>
                      <p className="external-scope">{item.scope}</p>
                    </div>
                    <span className="external-expiry">
                      Expires {item.expiry}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
