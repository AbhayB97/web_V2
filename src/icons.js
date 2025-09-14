// Simple SVG icons (original) styled with currentColor
const base = (d, viewBox = '0 0 24 24') => `
  <svg viewBox="${viewBox}" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${d}
  </svg>`;

export const iconUser = base('<path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4"/><path d="M4 20a8 8 0 0 1 16 0"/>');
export const iconGear = base('<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.11-1.26l2.12-1.55-2-3.46-2.49 1a7 7 0 0 0-2.18-1.26l-.38-2.64h-4l-.38 2.64A7 7 0 0 0 7.48 5.5l-2.49-1-2 3.46 2.12 1.55A7 7 0 0 0 5 12a7 7 0 0 0 .11 1.26L3 14.81l2 3.46 2.49-1a7 7 0 0 0 2.18 1.26l.38 2.64h4l.38-2.64a7 7 0 0 0 2.18-1.26l2.49 1 2-3.46-2.12-1.55A7 7 0 0 0 19 12Z"/>');
export const iconBriefcase = base('<path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>');
export const iconMail = base('<path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/><path d="m22 8-10 7L2 8"/>');
export const iconDoc = base('<path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/>');
export const iconFolder = base('<path d="M3 7h6l2 2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/>');
export const iconMonitor = base('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10"/>');
export const iconPaper = base('<path d="M8 4h7l5 5v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M15 4v4h4"/><path d="M10 12h8M10 16h8"/>');

