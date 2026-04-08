import JSZip from 'jszip';
import type { StructureChartScene } from './types';

const PPT_NS = 'http://schemas.openxmlformats.org/presentationml/2006/main';
const DRAWING_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main';
type ShapeContainerTag = 'sp' | 'grpSp' | 'cxnSp' | 'pic' | 'graphicFrame';

interface Transform {
  x: number;
  y: number;
  cx: number;
  cy: number;
}

export async function postProcessPptx(
  blob: Blob,
  scene: StructureChartScene,
): Promise<Blob> {
  const zip = await JSZip.loadAsync(blob);
  const slideFile = zip.file('ppt/slides/slide1.xml');
  if (!slideFile) return blob;

  const xml = await slideFile.async('string');
  const doc = parseSlideXml(xml);
  if (!doc) return blob;

  let nextId = findMaxId(doc) + 1;
  const groupIds = new Map<string, number>();

  for (const node of scene.nodes) {
    const groupId = nextId++;
    groupIds.set(node.id, groupId);
    groupShapesByNamePrefix(doc, `entity_${node.id}_`, `entityGroup_${node.id}`, groupId);
  }

  groupShapesByNamePrefix(doc, 'legend_', 'legendGroup', nextId++);

  zip.file('ppt/slides/slide1.xml', serializeSlideXml(doc));
  return zip.generateAsync({ type: 'blob' });
}

function parseSlideXml(xml: string): XMLDocument | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  if (doc.getElementsByTagName('parsererror').length > 0) {
    console.warn('[PPTX export] Unable to parse slide XML; skipping post-processing.');
    return null;
  }

  return doc;
}

function serializeSlideXml(doc: XMLDocument): string {
  return new XMLSerializer().serializeToString(doc);
}

function findMaxId(doc: XMLDocument): number {
  let maxId = 0;

  for (const element of getElementsByLocalName(doc, 'cNvPr')) {
    const id = Number.parseInt(element.getAttribute('id') ?? '', 10);
    if (Number.isFinite(id)) {
      maxId = Math.max(maxId, id);
    }
  }

  return maxId;
}

function groupShapesByNamePrefix(
  doc: XMLDocument,
  namePrefix: string,
  groupName: string,
  groupId: number,
): boolean {
  const spTree = findSpTree(doc);
  if (!spTree) return false;

  const matches = getChildShapeContainers(spTree).filter((child) => {
    const name = getShapeName(child);
    return isGroupableNamedShape(child, namePrefix, name);
  });

  if (matches.length === 0) return false;

  const transforms = matches
    .map(extractTransform)
    .filter((transform): transform is Transform => transform !== null);

  if (transforms.length === 0) {
    console.warn(`[PPTX export] No transforms found while grouping "${groupName}".`);
    return false;
  }

  const minX = Math.min(...transforms.map((t) => t.x));
  const minY = Math.min(...transforms.map((t) => t.y));
  const maxX = Math.max(...transforms.map((t) => t.x + t.cx));
  const maxY = Math.max(...transforms.map((t) => t.y + t.cy));

  const insertionPoint = matches[0];
  const group = createGroupShape(doc, groupName, groupId, {
    x: minX,
    y: minY,
    cx: maxX - minX,
    cy: maxY - minY,
  });

  spTree.insertBefore(group, insertionPoint);

  for (const match of matches) {
    group.appendChild(match);
  }
  return true;
}

function createGroupShape(
  doc: XMLDocument,
  groupName: string,
  groupId: number,
  transform: Transform,
): Element {
  const grpSp = createPresentationElement(doc, 'grpSp');

  const nvGrpSpPr = createPresentationElement(doc, 'nvGrpSpPr');
  const cNvPr = createPresentationElement(doc, 'cNvPr');
  cNvPr.setAttribute('id', String(groupId));
  cNvPr.setAttribute('name', groupName);
  nvGrpSpPr.append(
    cNvPr,
    createPresentationElement(doc, 'cNvGrpSpPr'),
    createPresentationElement(doc, 'nvPr'),
  );

  const grpSpPr = createPresentationElement(doc, 'grpSpPr');
  const xfrm = createDrawingElement(doc, 'xfrm');
  xfrm.append(
    createOffset(doc, transform.x, transform.y),
    createExtent(doc, transform.cx, transform.cy),
    createChildOffset(doc, transform.x, transform.y),
    createChildExtent(doc, transform.cx, transform.cy),
  );
  grpSpPr.appendChild(xfrm);

  grpSp.append(nvGrpSpPr, grpSpPr);
  return grpSp;
}

function createOffset(doc: XMLDocument, x: number, y: number): Element {
  const off = createDrawingElement(doc, 'off');
  off.setAttribute('x', String(x));
  off.setAttribute('y', String(y));
  return off;
}

function createExtent(doc: XMLDocument, cx: number, cy: number): Element {
  const ext = createDrawingElement(doc, 'ext');
  ext.setAttribute('cx', String(cx));
  ext.setAttribute('cy', String(cy));
  return ext;
}

function createChildOffset(doc: XMLDocument, x: number, y: number): Element {
  const chOff = createDrawingElement(doc, 'chOff');
  chOff.setAttribute('x', String(x));
  chOff.setAttribute('y', String(y));
  return chOff;
}

function createChildExtent(doc: XMLDocument, cx: number, cy: number): Element {
  const chExt = createDrawingElement(doc, 'chExt');
  chExt.setAttribute('cx', String(cx));
  chExt.setAttribute('cy', String(cy));
  return chExt;
}

function extractTransform(element: Element): Transform | null {
  const xfrm = getFirstDescendantByLocalName(element, 'xfrm');
  if (!xfrm) return null;

  const off = getChildByLocalName(xfrm, 'off');
  const ext = getChildByLocalName(xfrm, 'ext');
  if (!off || !ext) return null;

  const x = Number.parseInt(off.getAttribute('x') ?? '', 10);
  const y = Number.parseInt(off.getAttribute('y') ?? '', 10);
  const cx = Number.parseInt(ext.getAttribute('cx') ?? '', 10);
  const cy = Number.parseInt(ext.getAttribute('cy') ?? '', 10);

  if (![x, y, cx, cy].every(Number.isFinite)) {
    return null;
  }

  return { x, y, cx, cy };
}

function findSpTree(doc: XMLDocument): Element | null {
  return getFirstElementByLocalName(doc, 'spTree');
}

function getShapeName(element: Element): string | null {
  const cNvPr = getFirstDescendantByLocalName(element, 'cNvPr');
  return cNvPr?.getAttribute('name') ?? null;
}

function isGroupableNamedShape(element: Element, namePrefix: string, name: string | null): boolean {
  if (element.localName !== 'sp') {
    return false;
  }

  if (typeof name !== 'string' || !name.startsWith(namePrefix)) {
    return false;
  }

  return !name.startsWith('connector_') && !name.startsWith('cxn_');
}

function getChildShapeContainers(parent: Element): Element[] {
  return Array.from(parent.children).filter((child): child is Element => isShapeContainer(child));
}

function isShapeContainer(element: Element): element is Element {
  const tag = element.localName as ShapeContainerTag;
  return tag === 'sp' || tag === 'grpSp' || tag === 'cxnSp' || tag === 'pic' || tag === 'graphicFrame';
}

function getFirstElementByLocalName(root: ParentNode, localName: string): Element | null {
  return getElementsByLocalName(root, localName)[0] ?? null;
}

function getFirstDescendantByLocalName(root: ParentNode, localName: string): Element | null {
  return getFirstElementByLocalName(root, localName);
}

function getChildByLocalName(parent: Element, localName: string): Element | null {
  for (const child of Array.from(parent.children)) {
    if (child.localName === localName) {
      return child;
    }
  }
  return null;
}

function getElementsByLocalName(root: ParentNode, localName: string): Element[] {
  if ('getElementsByTagNameNS' in root) {
    return Array.from(root.getElementsByTagNameNS('*', localName));
  }
  return [];
}

function createPresentationElement(doc: XMLDocument, localName: string): Element {
  return doc.createElementNS(PPT_NS, `p:${localName}`);
}

function createDrawingElement(doc: XMLDocument, localName: string): Element {
  return doc.createElementNS(DRAWING_NS, `a:${localName}`);
}
