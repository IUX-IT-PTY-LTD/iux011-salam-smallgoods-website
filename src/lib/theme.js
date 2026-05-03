import { adminDb } from '@/lib/firebaseAdmin';

export const DEFAULT_THEME = {
  colorSurface:          '#E8D0A8',
  colorSurfaceRaised:    '#FBF0DC',
  colorSurfaceMid:       '#F5E4C4',
  colorSurfaceStrong:    '#F8EDD4',
  colorSurfaceStrongMid: '#F0E0BC',
  colorSurfaceHi:        '#FFFAF2',
  colorInk:              '#2A0D04',
  colorBody:             '#5A3020',
  colorMuted:            '#7A5040',
  colorShadow:           '#B8784A',
  colorShadowStrong:     '#A06838',
  colorShadowInset:      '#D4A870',
  colorAccent:           '#CC3A20',
  colorAccentDark:       '#B02808',
  colorAccentShadow:     '#7A1808',
  colorAccentHi:         '#E05030',
  colorStatusOk:         '#3E6B2A',
  colorStatusOkDk:       '#2E5220',
  colorStatusOkSh:       '#1E3A10',
  colorStatusErr:        '#A83020',
  colorStatusErrDk:      '#7A1808',
  colorStatusErrSh:      '#4A0C00',
  colorFooterBg:         '#1A0804',
  colorFooterBg2:        '#2A1208',
  colorFooterText:       '#EDD5B0',
  colorFooterMuted:      '#B89070',
};

// camelCase token key → CSS custom property name
function tokenToCssVar(key) {
  return '--' + key.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase());
}

export async function getTheme() {
  try {
    const snap = await adminDb.doc('site_theme/config').get();
    return snap.exists ? snap.data() : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function buildThemeCss(theme = {}) {
  const merged = { ...DEFAULT_THEME, ...theme };
  const lines = Object.entries(merged)
    .filter(([k]) => k.startsWith('color'))
    .map(([k, v]) => `  ${tokenToCssVar(k)}: ${v};`);
  return `:root {\n${lines.join('\n')}\n}`;
}
