import PptxGenJS from 'pptxgenjs';
import { getAllClassifications } from '../data/entityClassifications';
import { getAllJurisdictionFills, getAllConnectionStyles } from '../data/annotationStyles';

const LEGEND_RIGHT = 13.333 - 0.3;
const LEGEND_WIDTH = 2.8;
const LEGEND_LEFT = LEGEND_RIGHT - LEGEND_WIDTH;
const LEGEND_BOTTOM = 7.2;

const ROW_HEIGHT = 0.2;
const SECTION_GAP = 0.08;
const SWATCH_W = 0.22;
const SWATCH_H = 0.14;
const SWATCH_TEXT_GAP = 0.06;
const TEXT_X = LEGEND_LEFT + SWATCH_W + SWATCH_TEXT_GAP;
const TEXT_W = LEGEND_WIDTH - SWATCH_W - SWATCH_TEXT_GAP;

const SHAPE_FOR_CLASSIFICATION: Record<string, string> = {
  partnership: 'triangle',
  corporation: 'rect',
  reverse_hybrid: 'rect',
  hybrid: 'rect',
  disregarded: 'rect',
  nonbx: 'rect',
  asset: 'ellipse',
};

const FILL_FOR_CLASSIFICATION: Record<string, string> = {
  nonbx: 'E2E8F0',
  asset: 'E2E8F0',
};

let legendItemIndex = 0;

function legendName(suffix: string): string {
  return `legend_${suffix}`;
}

function legendItemName(): string {
  return `legend_item_${legendItemIndex++}`;
}

export function renderLegend(slide: PptxGenJS.Slide): void {
  legendItemIndex = 0;

  const classifications = getAllClassifications();
  const jurisdictionFills = getAllJurisdictionFills();
  const connectionStyles = getAllConnectionStyles();

  const hasJurisdictions = Object.keys(jurisdictionFills).length > 0;
  const hasConnections = Object.keys(connectionStyles).length > 0;

  let totalRows = 0;
  let totalSections = 0;

  totalRows += 1 + Object.keys(classifications).length;
  totalSections++;

  totalRows += 1 + 1;
  totalSections++;

  if (hasJurisdictions) {
    totalRows += 1 + 1 + Object.keys(jurisdictionFills).length;
    totalSections++;
  }

  if (hasConnections) {
    totalRows += 1 + Object.keys(connectionStyles).length;
    totalSections++;
  }

  const legendHeight = totalRows * ROW_HEIGHT + (totalSections - 1) * SECTION_GAP + 0.16;
  const legendTop = LEGEND_BOTTOM - legendHeight;

  slide.addShape('rect', {
    x: LEGEND_LEFT - 0.08,
    y: legendTop - 0.04,
    w: LEGEND_WIDTH + 0.16,
    h: legendHeight + 0.08,
    fill: { color: 'FFFFFF' },
    line: { color: 'E2E8F0', width: 0.75 },
    rectRadius: 0.04,
    objectName: legendName('bg'),
  });

  let y = legendTop;

  // ── Section 1: Entity Types ──
  y = renderSectionTitle(slide, 'Entity Types', y);

  for (const [key, cls] of Object.entries(classifications)) {
    const shape = SHAPE_FOR_CLASSIFICATION[key] ?? 'rect';
    const fill = FILL_FOR_CLASSIFICATION[key] ?? 'FFFFFF';

    slide.addShape(shape as 'rect', {
      x: LEGEND_LEFT,
      y: y + (ROW_HEIGHT - SWATCH_H) / 2,
      w: SWATCH_W,
      h: SWATCH_H,
      fill: { color: fill },
      line: { color: '1E293B', width: 0.75 },
      objectName: legendItemName(),
    });

    slide.addText(cls.label, {
      x: TEXT_X,
      y,
      w: TEXT_W,
      h: ROW_HEIGHT,
      fontSize: 7,
      color: '334155',
      fontFace: 'Calibri',
      valign: 'middle',
      objectName: legendItemName(),
    });

    y += ROW_HEIGHT;
  }

  y += SECTION_GAP;

  // ── Section 2: Ownership ──
  y = renderSectionTitle(slide, 'Ownership', y);

  slide.addShape('line', {
    x: LEGEND_LEFT,
    y: y + ROW_HEIGHT / 2,
    w: SWATCH_W,
    h: 0,
    line: { color: '334155', width: 1.5 },
    objectName: legendItemName(),
  });

  slide.addText('Ownership connection', {
    x: TEXT_X,
    y,
    w: TEXT_W,
    h: ROW_HEIGHT,
    fontSize: 7,
    color: '334155',
    fontFace: 'Calibri',
    valign: 'middle',
    objectName: legendItemName(),
  });

  y += ROW_HEIGHT;

  // ── Section 3: Jurisdiction ──
  if (hasJurisdictions) {
    y += SECTION_GAP;
    y = renderSectionTitle(slide, 'Jurisdiction', y);

    renderJurisdictionRow(slide, 'FFFFFF', 'US (default)', y);
    y += ROW_HEIGHT;

    for (const [, jf] of Object.entries(jurisdictionFills)) {
      renderJurisdictionRow(slide, jf.fillColor.replace('#', ''), jf.label, y);
      y += ROW_HEIGHT;
    }
  }

  // ── Section 4: Additional Connections ──
  if (hasConnections) {
    y += SECTION_GAP;
    y = renderSectionTitle(slide, 'Additional Connections', y);

    for (const [, cs] of Object.entries(connectionStyles)) {
      slide.addShape('line', {
        x: LEGEND_LEFT,
        y: y + ROW_HEIGHT / 2,
        w: SWATCH_W,
        h: 0,
        line: {
          color: cs.lineColor.replace('#', ''),
          width: 1.5,
          dashType: cs.lineStyle === 'dashed' ? 'dash' : 'solid',
        },
        objectName: legendItemName(),
      });

      slide.addText(cs.description, {
        x: TEXT_X,
        y,
        w: TEXT_W,
        h: ROW_HEIGHT,
        fontSize: 7,
        color: '334155',
        fontFace: 'Calibri',
        valign: 'middle',
        objectName: legendItemName(),
      });

      y += ROW_HEIGHT;
    }
  }
}

function renderSectionTitle(slide: PptxGenJS.Slide, title: string, y: number): number {
  slide.addText(title, {
    x: LEGEND_LEFT,
    y,
    w: LEGEND_WIDTH,
    h: ROW_HEIGHT,
    fontSize: 7,
    bold: true,
    color: '1E293B',
    fontFace: 'Calibri',
    valign: 'middle',
    objectName: legendItemName(),
  });
  return y + ROW_HEIGHT;
}

function renderJurisdictionRow(slide: PptxGenJS.Slide, fillHex: string, label: string, y: number): void {
  slide.addShape('rect', {
    x: LEGEND_LEFT,
    y: y + (ROW_HEIGHT - SWATCH_H) / 2,
    w: SWATCH_W,
    h: SWATCH_H,
    fill: { color: fillHex },
    line: { color: 'CBD5E1', width: 0.5 },
    objectName: legendItemName(),
  });

  slide.addText(label, {
    x: TEXT_X,
    y,
    w: TEXT_W,
    h: ROW_HEIGHT,
    fontSize: 7,
    color: '334155',
    fontFace: 'Calibri',
    valign: 'middle',
    objectName: legendItemName(),
  });
}
