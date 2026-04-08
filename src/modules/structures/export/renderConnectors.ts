import PptxGenJS from 'pptxgenjs';
import type { SceneConnector } from './types';
import type { CoordinateMapper } from './coordinateMapper';

function toHex(color: string): string {
  if (color === 'white') return 'FFFFFF';
  return color.replace('#', '');
}

export function renderConnector(
  slide: PptxGenJS.Slide,
  connector: SceneConnector,
  mapper: CoordinateMapper,
): void {
  const x1 = mapper.toSlideX(connector.sourceX);
  const y1 = mapper.toSlideY(connector.sourceY);
  const x2 = mapper.toSlideX(connector.targetX);
  const y2 = mapper.toSlideY(connector.targetY);

  const lx = Math.min(x1, x2);
  const ly = Math.min(y1, y2);
  const lw = Math.abs(x2 - x1) || 0.01;
  const lh = Math.abs(y2 - y1) || 0.01;

  const flipH = x2 < x1;
  const flipV = y2 < y1;

  const lineWidthPt = connector.lineWidth >= 2.5 ? 2 : 1;

  slide.addShape('line', {
    x: lx,
    y: ly,
    w: lw,
    h: lh,
    flipH,
    flipV,
    line: {
      color: toHex(connector.lineColor),
      width: lineWidthPt,
      dashType: connector.lineDash === 'dashed' ? 'dash' : 'solid',
    },
    objectName: `connector_${connector.id}_line`,
  });

  if (connector.label) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const labelW = 0.6;
    const labelH = 0.2;

    slide.addText(connector.label, {
      x: midX - labelW / 2,
      y: midY - labelH / 2,
      w: labelW,
      h: labelH,
      fontSize: 7,
      color: '334155',
      fontFace: 'Calibri',
      align: 'center',
      valign: 'middle',
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.5 },
      objectName: `connector_${connector.id}_label`,
    });
  }
}
