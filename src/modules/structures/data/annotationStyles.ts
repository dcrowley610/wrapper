import type { BorderOverlay, ConnectionStyle, JurisdictionFill } from '../types';

// ── Jurisdiction fill colors ──

const JURISDICTION_FILLS: Record<string, JurisdictionFill> = {
  'United Kingdom': {
    label: 'United Kingdom',
    fillColor: '#dbeafe',
  },
  'Cayman Islands': {
    label: 'Cayman Islands',
    fillColor: '#fef3c7',
  },
  Luxembourg: {
    label: 'Luxembourg',
    fillColor: '#dcfce7',
  },
};

export function getJurisdictionFill(key: string): JurisdictionFill | undefined {
  return JURISDICTION_FILLS[key];
}

export function getAllJurisdictionFills(): Record<string, JurisdictionFill> {
  return JURISDICTION_FILLS;
}

// ── Border overlays ──

const BORDER_OVERLAYS: Record<string, BorderOverlay> = {
  // None defined yet — ready for future use
};

export function getBorderOverlay(key: string): BorderOverlay | undefined {
  return BORDER_OVERLAYS[key];
}

export function getAllBorderOverlays(): Record<string, BorderOverlay> {
  return BORDER_OVERLAYS;
}

// ── Additional connection line styles ──

const CONNECTION_STYLES: Record<string, ConnectionStyle> = {
  'non-economic': {
    label: 'Non-economic',
    description: 'Non-economic connection',
    lineColor: '#334155',
    lineStyle: 'dashed',
  },
};

export function getConnectionStyle(key: string): ConnectionStyle | undefined {
  return CONNECTION_STYLES[key];
}

export function getAllConnectionStyles(): Record<string, ConnectionStyle> {
  return CONNECTION_STYLES;
}
