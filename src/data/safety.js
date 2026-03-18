export const overviewCards = [
  { label: "Days Without Incident", value: "142 Days", tone: "positive" },
  { label: "Active Workers on Site", value: "348", tone: "info" },
  { label: "Pending Rectifications", value: "5", tone: "warning" },
  { label: "Training Compliance", value: "98.2%", tone: "neutral" },
];

export const trainingAlerts = [
  {
    worker: "Lee Siu Lung",
    course: "CWRA Safety Induction",
    expiry: "2026-02-12",
    status: "Due soon",
  },
  {
    worker: "Cheung Wai",
    course: "Site Supervisor Briefing",
    expiry: "2026-02-05",
    status: "Overdue",
  },
];

export const workers = [
  {
    id: "W-0922",
    name: "Chan Tai Man",
    trade: "Rigger",
    hkid: "HKID: ****123(4)",
    greenCard: "Green Card: 2026-05-12",
    ocrVerified: true,
    safetyScore: 92,
    accessStatus: "Granted",
    location: "Zone B",
  },
  {
    id: "W-0925",
    name: "Lee Siu Lung",
    trade: "Welder",
    hkid: "HKID: ****567(8)",
    greenCard: "Green Card: 2025-11-01",
    ocrVerified: true,
    safetyScore: 88,
    accessStatus: "Granted",
    location: "Zone A",
  },
  {
    id: "W-0930",
    name: "Cheung Wai",
    trade: "General Labor",
    hkid: "HKID: ****999(0)",
    greenCard: "Green Card: 2025-10-01",
    ocrVerified: true,
    safetyScore: 54,
    accessStatus: "Denied",
    location: "Gate 1",
  },
];

export const incidents = [
  {
    ref: "INC-2026-001",
    title: "Near miss on temporary access route",
    date: "2026-01-29",
    stage: 1,
    type: "Near miss",
    severity: "High",
    site: "Site A",
    location: "Zone 3 temporary access route",
    occurredAt: "2026-01-29 10:15",
    workerId: "W-0922",
    workerName: "Chan Tai Man",
    reportedBy: "Safety Officer Chan",
    subcontractor: "East Harbor Steelworks",
    immediateAction:
      "Area isolated, lifting path held, and first aid team stood by.",
    rootCause:
      "Temporary access route was not segregated from the lifting path during material unloading.",
    correctiveAction:
      "Reissue the access route, add barricades, and brief the lifting crew before restart.",
    investigator: "Site Safety Manager",
    dueDate: "2026-01-31",
    nextAction: "Submit preliminary report and route management review.",
    linkedApproval: "IM-2026-008",
    linkedTraining: "Toolbox Talk - Access route segregation",
  },
  {
    ref: "INC-2026-002",
    title: "Minor injury in workshop cutting area",
    date: "2026-01-27",
    stage: 2,
    type: "Minor injury",
    severity: "Medium",
    site: "Site B",
    location: "Workshop steel cutting bay",
    occurredAt: "2026-01-27 14:40",
    workerId: "W-0925",
    workerName: "Lee Siu Lung",
    reportedBy: "Foreman Wong",
    subcontractor: "Metro Fitout Engineering",
    immediateAction:
      "First aid completed and the cutting bay isolated pending supervisor check.",
    rootCause:
      "Work bench layout pushed the worker into the material handling path during trimming.",
    correctiveAction:
      "Reset the bench layout, update the workshop SOP, and issue a refresher briefing.",
    investigator: "Assistant Safety Manager",
    dueDate: "2026-01-30",
    nextAction:
      "Collect witness statement and close RCA with toolbox talk acknowledgement.",
    linkedApproval: "IM-2026-008",
    linkedTraining: "Toolbox Talk - Workshop cutting controls",
  },
];

export const inspectionForms = [
  {
    name: "Daily Crane Inspection",
    id: "F-001",
    updated: "2025-10-01",
    submissions: 142,
  },
  {
    name: "Hot Work Permit",
    id: "F-002",
    updated: "2025-09-15",
    submissions: 56,
  },
  {
    name: "Site Induction Checklist",
    id: "F-003",
    updated: "2025-01-20",
    submissions: 890,
  },
];
