import PptxGenJS from 'pptxgenjs';
import type { StructureChartScene } from './types';
import { createCoordinateMapper } from './coordinateMapper';
import { renderNodeShape } from './renderShapes';
import { renderConnector } from './renderConnectors';
import { renderLegend } from './renderLegend';
import { postProcessPptx } from './postProcess';

function formatDate(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export async function generateAndDownloadPptx(
  scene: StructureChartScene,
  filename = 'structure-chart.pptx',
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';

  const slide = pptx.addSlide();
  const mapper = createCoordinateMapper(scene.bounds);

  // Title (top-center, only if non-empty)
  if (scene.title.trim()) {
    slide.addText(scene.title, {
      x: 2.5,
      y: 0.15,
      w: 8.333,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: '1E293B',
      fontFace: 'Calibri',
      align: 'center',
    });
  }

  // Confidentiality header (top-right, always)
  slide.addText(
    [
      { text: formatDate(), options: { fontSize: 8, bold: true, color: 'FF0000' } },
      { text: '\nHighly Confidential and Trade Secret', options: { fontSize: 8, bold: true, color: 'FF0000' } },
      { text: '\nFor Internal Use Only', options: { fontSize: 8, bold: true, color: 'FF0000' } },
    ],
    {
      x: 9.833,
      y: 0.08,
      w: 3.0,
      h: 0.5,
      fontFace: 'Calibri',
      align: 'right',
      valign: 'top',
    },
  );

  // Connectors first (behind shapes)
  for (const connector of scene.connectors) {
    renderConnector(slide, connector, mapper);
  }

  // Nodes on top
  for (const node of scene.nodes) {
    renderNodeShape(slide, node, mapper);
  }

  // Legend (bottom-right)
  renderLegend(slide);

  const rawBlob = (await pptx.write({ outputType: 'blob' })) as Blob;
  const processedBlob = await postProcessPptx(rawBlob, scene);
  downloadBlob(processedBlob, filename);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
