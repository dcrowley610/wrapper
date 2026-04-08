interface EntityShapeRendererProps {
  classificationKey: string;
  width: number;
  height: number;
  borderColor: string;
  fillColor: string;
}

const STROKE_WIDTH = 2;
const DETAIL_STROKE_WIDTH = 1.5;
const INSET = 2;

export function EntityShapeRenderer({
  classificationKey,
  width,
  height,
  borderColor,
  fillColor,
}: EntityShapeRendererProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderShape(classificationKey, width, height, borderColor, fillColor)}
    </svg>
  );
}

function renderShape(
  key: string,
  w: number,
  h: number,
  borderColor: string,
  fillColor: string,
) {
  const i = INSET;
  const iw = w - 2 * i;
  const ih = h - 2 * i;

  switch (key) {
    case 'partnership':
      // Triangle outline
      return (
        <polygon
          points={`${w / 2},${i} ${w - i},${h - i} ${i},${h - i}`}
          fill={fillColor}
          stroke={borderColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinejoin="round"
        />
      );

    case 'reverse_hybrid':
      // Rectangle with inverted internal triangle
      // Lines from top-left and top-right corners to bottom-center
      return (
        <g>
          <rect
            x={i} y={i} width={iw} height={ih}
            fill={fillColor}
            stroke={borderColor}
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={i} y1={i} x2={w / 2} y2={h - i}
            stroke={borderColor}
            strokeWidth={DETAIL_STROKE_WIDTH}
            opacity={0.4}
          />
          <line
            x1={w - i} y1={i} x2={w / 2} y2={h - i}
            stroke={borderColor}
            strokeWidth={DETAIL_STROKE_WIDTH}
            opacity={0.4}
          />
        </g>
      );

    case 'hybrid':
      // Rectangle with upright internal triangle
      // Lines from bottom-left and bottom-right corners to top-center
      return (
        <g>
          <rect
            x={i} y={i} width={iw} height={ih}
            fill={fillColor}
            stroke={borderColor}
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={i} y1={h - i} x2={w / 2} y2={i}
            stroke={borderColor}
            strokeWidth={DETAIL_STROKE_WIDTH}
            opacity={0.4}
          />
          <line
            x1={w - i} y1={h - i} x2={w / 2} y2={i}
            stroke={borderColor}
            strokeWidth={DETAIL_STROKE_WIDTH}
            opacity={0.4}
          />
        </g>
      );

    case 'disregarded':
      // Rectangle with inscribed oval touching midpoints of all four sides
      return (
        <g>
          <rect
            x={i} y={i} width={iw} height={ih}
            fill={fillColor}
            stroke={borderColor}
            strokeWidth={STROKE_WIDTH}
          />
          <ellipse
            cx={w / 2} cy={h / 2}
            rx={iw / 2} ry={ih / 2}
            fill="none"
            stroke={borderColor}
            strokeWidth={DETAIL_STROKE_WIDTH}
            opacity={0.4}
          />
        </g>
      );

    case 'corporation':
      // Plain rectangle outline
      return (
        <rect
          x={i} y={i} width={iw} height={ih}
          fill={fillColor}
          stroke={borderColor}
          strokeWidth={STROKE_WIDTH}
        />
      );

    case 'nonbx':
      // Filled gray rectangle
      return (
        <rect
          x={i} y={i} width={iw} height={ih}
          fill="#e2e8f0"
          stroke={borderColor}
          strokeWidth={STROKE_WIDTH}
        />
      );

    case 'asset':
      // Gray-filled oval
      return (
        <ellipse
          cx={w / 2} cy={h / 2}
          rx={iw / 2} ry={ih / 2}
          fill="#e2e8f0"
          stroke={borderColor}
          strokeWidth={STROKE_WIDTH}
        />
      );

    default:
      // Fallback: plain rectangle
      return (
        <rect
          x={i} y={i} width={iw} height={ih}
          fill={fillColor}
          stroke={borderColor}
          strokeWidth={STROKE_WIDTH}
        />
      );
  }
}
