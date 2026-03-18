export const dmsLibraries = [
  { id: "project", label: "Project DMS" },
  { id: "safety", label: "Safety DMS" },
];

export const dmsPhases = [
  { name: "Tender", count: 18 },
  { name: "Design", count: 24 },
  { name: "Construction", count: 56 },
  { name: "Handover", count: 12 },
];

export const dmsCategories = [
  { code: "PR-A1", name: "Tender Docs", count: 6 },
  { code: "PR-A2", name: "Incoming Correspondence", count: 12 },
  { code: "PR-A3", name: "Outgoing Correspondence", count: 9 },
  { code: "PR-A4", name: "Site Daily Report", count: 14 },
  { code: "PR-A5", name: "Architectural / Structural Instruction", count: 5 },
  { code: "PR-A6", name: "Site Meeting", count: 8 },
  { code: "PR-A7", name: "Approval Letter / Drawing / Consent", count: 7 },
  { code: "PR-A8", name: "BA10 and TCP", count: 4 },
  { code: "PR-A9", name: "Works (Predrill, BP, SHP, DP, KP)", count: 11 },
  { code: "PR-A10", name: "Inspection Form / Photos", count: 10 },
  { code: "PR-A11", name: "Order Form", count: 3 },
  { code: "PR-A12", name: "Master Programme", count: 2 },
  { code: "PR-A13", name: "Incident Report", count: 6 },
  { code: "PR-A14", name: "As-Built Record", count: 7 },
  { code: "PR-A15", name: "Conditional Survey / CCTV / TTA", count: 4 },
  { code: "PR-A16", name: "Complaint Record", count: 5 },
  { code: "PR-A17", name: "Handover Record", count: 2 },
];

export const dmsDocuments = [
  {
    id: "DMS-2441",
    title: "Site Letter - East Harbor Materials",
    category: "Incoming Correspondence",
    phase: "Construction",
    owner: "J. Wong",
    updated: "Jan 29",
    status: "Review",
    type: "PDF",
    size: "2.4 MB",
    ocr: true,
    encrypted: true,
    externalAccess: "Consultant (expires Feb 10)",
    library: "Project",
  },
  {
    id: "DMS-2440",
    title: "Daily Report - West Kowloon",
    category: "Site Daily Report",
    phase: "Construction",
    owner: "C. Lau",
    updated: "Jan 29",
    status: "Approved",
    type: "XLSX",
    size: "1.1 MB",
    ocr: true,
    encrypted: true,
    externalAccess: "None",
    library: "Project",
  },
  {
    id: "DMS-2433",
    title: "Drawing Revision B - Terminal Upgrade",
    category: "Approval Letter / Drawing / Consent",
    phase: "Design",
    owner: "M. Chan",
    updated: "Jan 28",
    status: "Pending",
    type: "DWG",
    size: "6.8 MB",
    ocr: true,
    encrypted: true,
    externalAccess: "Consultant (expires Feb 10)",
    library: "Project",
  },
  {
    id: "DMS-2427",
    title: "Inspection Photos - Pile Cap",
    category: "Inspection Form / Photos",
    phase: "Construction",
    owner: "S. Ahmed",
    updated: "Jan 28",
    status: "External",
    type: "ZIP",
    size: "18.2 MB",
    ocr: true,
    encrypted: true,
    externalAccess: "Sub-con (expires Feb 5)",
    library: "Safety",
  },
  {
    id: "DMS-2411",
    title: "Tender Clarification Set",
    category: "Tender Docs",
    phase: "Tender",
    owner: "L. Ho",
    updated: "Jan 26",
    status: "Archive",
    type: "PDF",
    size: "4.6 MB",
    ocr: false,
    encrypted: true,
    externalAccess: "None",
    library: "Project",
  },
];

export const dmsApprovals = [
  {
    step: "Requester",
    name: "Project Team",
    status: "Complete",
  },
  {
    step: "Reviewer",
    name: "QS Team",
    status: "In review",
  },
  {
    step: "Approver",
    name: "Director",
    status: "Pending",
  },
  {
    step: "Executive",
    name: "Executive Board",
    status: "Pending",
  },
];

export const dmsMeta = [
  { label: "Version", value: "Rev B" },
  { label: "OCR Status", value: "Indexed" },
  { label: "Watermark", value: "Enabled" },
  { label: "Encryption", value: "End-to-end" },
];

export const dmsExternalAccess = [
  { name: "AEC Consultants", scope: "Drawing set", expiry: "Feb 10" },
  { name: "East Harbor Sub-con", scope: "Site memo", expiry: "Feb 5" },
];

export const dmsFolderCards = [
  {
    name: "Incoming Mail",
    category: "Incoming Correspondence",
    subtitle: "Correspondence intake",
    count: 12,
    updated: "2h ago",
    tone: "blue",
  },
  {
    name: "Daily Reports",
    category: "Site Daily Report",
    subtitle: "Construction logs",
    count: 14,
    updated: "Today",
    tone: "teal",
  },
  {
    name: "Drawings",
    category: "Approval Letter / Drawing / Consent",
    subtitle: "Design revisions",
    count: 9,
    updated: "Yesterday",
    tone: "amber",
  },
  {
    name: "Site Photos",
    category: "Inspection Form / Photos",
    subtitle: "Inspection evidence",
    count: 10,
    updated: "Jan 28",
    tone: "violet",
  },
  {
    name: "Tender",
    category: "Tender Docs",
    subtitle: "Clarifications",
    count: 6,
    updated: "Jan 26",
    tone: "slate",
  },
];
