export interface CoordinateMapper {
  toSlideX(chartX: number): number;
  toSlideY(chartY: number): number;
  toSlideW(chartW: number): number;
  toSlideH(chartH: number): number;
  scale: number;
}

const SLIDE_WIDTH = 13.333;
const SLIDE_HEIGHT = 7.5;
const MARGIN = 0.5;
const TITLE_HEIGHT = 0.4;

const CONTENT_WIDTH = SLIDE_WIDTH - 2 * MARGIN;
const CONTENT_HEIGHT = SLIDE_HEIGHT - 2 * MARGIN - TITLE_HEIGHT;

export function createCoordinateMapper(
  bounds: { x: number; y: number; width: number; height: number },
): CoordinateMapper {
  const scaleX = CONTENT_WIDTH / bounds.width;
  const scaleY = CONTENT_HEIGHT / bounds.height;
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = bounds.width * scale;
  const scaledHeight = bounds.height * scale;
  const offsetX = (CONTENT_WIDTH - scaledWidth) / 2;
  const offsetY = (CONTENT_HEIGHT - scaledHeight) / 2;

  return {
    scale,
    toSlideX(chartX: number) {
      return MARGIN + offsetX + (chartX - bounds.x) * scale;
    },
    toSlideY(chartY: number) {
      return MARGIN + TITLE_HEIGHT + offsetY + (chartY - bounds.y) * scale;
    },
    toSlideW(chartW: number) {
      return chartW * scale;
    },
    toSlideH(chartH: number) {
      return chartH * scale;
    },
  };
}
