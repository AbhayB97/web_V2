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

export const iconNote = base(
  '<path d="M7 3h10a2 2 0 0 1 2 2v11l-4 4H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M15 16v4"/><path d="M9 9h6M9 13h4"/>'
);
export const iconPlus = base('<path d="M12 5v14"/><path d="M5 12h14"/>');
export const iconTrash = base(
  '<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/>'
);
export const iconArrowRight = base('<path d="m12 5 7 7-7 7"/><path d="M5 12h14"/>');

export const iconTerminal = base(
  '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="m8 9 4 3-4 3"/><path d="M12 17h4"/>'
);

export const iconChart = base(
  '<path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="10" width="3" height="6" rx="1"/><rect x="12" y="7" width="3" height="9" rx="1"/><rect x="17" y="12" width="3" height="4" rx="1"/>'
);

export const iconPalette = base(
  '<path d="M21 15a9 9 0 1 0-9 9 4 4 0 0 1-.9-7.9 1 1 0 0 0 .79-1.07A3 3 0 0 1 14.88 12H17a4 4 0 0 1 4 4Z"/><circle cx="7.5" cy="10.5" r="1.5"/><circle cx="12" cy="7.5" r="1.5"/><circle cx="16.5" cy="10.5" r="1.5"/><circle cx="11.5" cy="16.5" r="1.5"/>'
);

