import PptxGenJS from 'pptxgenjs';
import type { SceneNode } from './types';
import type { CoordinateMapper } from './coordinateMapper';

type ShapeRenderer = (
  slide: PptxGenJS.Slide,
  node: SceneNode,
  mapper: CoordinateMapper,
) => void;

function toHex(color: string): string {
  if (color === 'white') return 'FFFFFF';
  if (color === 'none') return 'FFFFFF';
  return color.replace('#', '');
}

const SHAPE_RENDERERS: Record<string, ShapeRenderer> = {
  corporation: renderCorporation,
  partnership: renderPartnership,
  reverse_hybrid: renderReverseHybrid,
  hybrid: renderHybrid,
  disregarded: renderDisregarded,
  nonbx: renderNonbx,
  asset: renderAsset,
};

export function renderNodeShape(
  slide: PptxGenJS.Slide,
  node: SceneNode,
  mapper: CoordinateMapper,
): void {
  const renderer = SHAPE_RENDERERS[node.classificationKey] ?? renderCorporation;
  renderer(slide, node, mapper);
  renderNodeText(slide, node, mapper);
}

// ── Shape renderers ──

function renderCorporation(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  slide.addShape('rect', {
    x: mapper.toSlideX(node.x),
    y: mapper.toSlideY(node.y),
    w: mapper.toSlideW(node.width),
    h: mapper.toSlideH(node.height),
    fill: { color: toHex(node.fillColor) },
    line: { color: toHex(node.borderColor), width: 1.5 },
    objectName: `entity_${node.id}_shape`,
  });
}

function renderPartnership(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  slide.addShape('triangle', {
    x: mapper.toSlideX(node.x),
    y: mapper.toSlideY(node.y),
    w: mapper.toSlideW(node.width),
    h: mapper.toSlideH(node.height),
    fill: { color: toHex(node.fillColor) },
    line: { color: toHex(node.borderColor), width: 1.5 },
    objectName: `entity_${node.id}_shape`,
  });
}

function renderReverseHybrid(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  const x = mapper.toSlideX(node.x);
  const y = mapper.toSlideY(node.y);
  const w = mapper.toSlideW(node.width);
  const h = mapper.toSlideH(node.height);

  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: toHex(node.fillColor) },
    line: { color: toHex(node.borderColor), width: 1.5 },
    objectName: `entity_${node.id}_shape`,
  });

  slide.addShape('line', {
    x, y, w: w / 2, h,
    line: { color: toHex(node.borderColor), width: 0.75, transparency: 60 },
    objectName: `entity_${node.id}_detail_0`,
  });

  slide.addShape('line', {
    x: x + w / 2, y, w: w / 2, h,
    line: { color: toHex(node.borderColor), width: 0.75, transparency: 60 },
    flipH: true,
    objectName: `entity_${node.id}_detail_1`,
  });
}

function renderHybrid(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  const x = mapper.toSlideX(node.x);
  const y = mapper.toSlideY(node.y);
  const w = mapper.toSlideW(node.width);
  const h = mapper.toSlideH(node.height);

  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: toHex(node.fillColor) },
    line: { color: toHex(node.borderColor), width: 1.5 },
    objectName: `entity_${node.id}_shape`,
  });

  slide.addShape('line', {
    x, y, w: w / 2, h,
    line: { color: toHex(node.borderColor), width: 0.75, transparency: 60 },
    flipV: true,
    objectName: `entity_${node.id}_detail_0`,
  });

  slide.addShape('line', {
    x: x + w / 2, y, w: w / 2, h,
    line: { color: toHex(node.borderColor), width: 0.75, transparency: 60 },
    flipH: true,
    flipV: true,
    objectName: `entity_${node.id}_detail_1`,
  });
}

function renderDisregarded(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  const x = mapper.toSlideX(node.x);
  const y = mapper.toSlideY(node.y);
  const w = mapper.toSlideW(node.width);
  const h = mapper.toSlideH(node.height);

  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: toHex(node.fillColor) },
    line: { color: toHex(node.borderColor), width: 1.5 },
    objectName: `entity_${node.id}_shape`,
  });

  slide.addShape('ellipse', {
    x, y, w, h,
    fill: { type: 'none' },
    line: { color: toHex(node.borderColor), width: 0.75, transparency: 60 },
    objectName: `entity_${node.id}_detail_0`,
  });
}

function renderNonbx(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  slide.addShape('rect', {
    x: mapper.toSlideX(node.x),
    y: mapper.toSlideY(node.y),
    w: mapper.toSlideW(node.width),
    h: mapper.toSlideH(node.height),
    fill: { color: 'E2E8F0' },
    line: { color: toHex(node.borderColor), width: 1.5 },
    objectName: `entity_${node.id}_shape`,
  });
}

function renderAsset(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  slide.addShape('ellipse', {
    x: mapper.toSlideX(node.x),
    y: mapper.toSlideY(node.y),
    w: mapper.toSlideW(node.width),
    h: mapper.toSlideH(node.height),
    fill: { color: 'E2E8F0' },
    line: { color: toHex(node.borderColor), width: 1.5 },
    objectName: `entity_${node.id}_shape`,
  });
}

// ── Node text (split into label + description) ──

function renderNodeText(slide: PptxGenJS.Slide, node: SceneNode, mapper: CoordinateMapper) {
  const isTriangle = node.classificationKey === 'partnership';
  const isAsset = node.classificationKey === 'asset';

  let x = mapper.toSlideX(node.x);
  let y = mapper.toSlideY(node.y);
  let w = mapper.toSlideW(node.width);
  let h = mapper.toSlideH(node.height);

  // Constrain text area for non-rectangular shapes
  if (isTriangle) {
    x += w * 0.2;
    y += h * 0.4;
    w *= 0.6;
    h *= 0.55;
  } else if (isAsset) {
    x += w * 0.15;
    y += h * 0.15;
    w *= 0.7;
    h *= 0.7;
  }

  const labelSize = isTriangle ? 8 : 9;
  const descSize = isTriangle ? 6 : 7;
  const labelH = h * 0.5;
  const descH = h * 0.5;

  // Primary text box: entity name
  slide.addText(node.label, {
    x, y, w, h: labelH,
    align: 'center',
    valign: 'bottom',
    fontFace: 'Calibri',
    fontSize: labelSize,
    bold: true,
    color: '1E293B',
    shrinkText: true,
    margin: [0, 4, 0, 4],
    objectName: `entity_${node.id}_label`,
  });

  // Secondary text box: classification description
  slide.addText(node.description, {
    x, y: y + labelH, w, h: descH,
    align: 'center',
    valign: 'top',
    fontFace: 'Calibri',
    fontSize: descSize,
    color: '64748B',
    shrinkText: true,
    margin: [0, 4, 0, 4],
    objectName: `entity_${node.id}_desc`,
  });
}
