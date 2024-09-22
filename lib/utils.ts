import { Camera, Color, Layer, LayerType, PathLayer, Point, Side, XYWH } from "@/types/canavas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Generate 5 random colors for different connections
const COLORS = Array.from({ length: 5 }, () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hex color
  return `#${randomColor.padStart(6, "0")}`; // Ensure the hex code is 6 digits
});

// Maps a connection ID to a color based on the array of random colors
export function connectionIdToColor(connectionIdToColor: number): string {
  return COLORS[connectionIdToColor % COLORS.length]; // Assign color cyclically from the COLORS array
}

// Merges Tailwind CSS classes intelligently
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // Merges the class names using tailwind-merge and clsx
}

// Converts a pointer event to a point on the canvas, adjusting for the camera's position
export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x, // Adjust X based on camera position
    y: Math.round(e.clientY) - camera.y, // Adjust Y based on camera position
  };
}

// Converts a color object (RGB) into a CSS-compatible hex string
export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`; // Convert RGB values to hex and pad them if needed
}

// Function to resize the bounds of a selected element based on the side/corner and new pointer position
export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  // Copy the initial bounds into the result object
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  // Handle resizing from the left side or corners involving the left
  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width); // Adjust the X position
    result.width = Math.abs(bounds.x + bounds.width - point.x); // Adjust the width
  }

  // Handle resizing from the right side or corners involving the right
  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x); // Adjust the X position
    result.width = Math.abs(bounds.x - point.x); // Adjust the width
  }

  // Handle resizing from the top side or corners involving the top
  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height); // Adjust the Y position
    result.height = Math.abs(bounds.y + bounds.height - point.y); // Adjust the height
  }

  // Handle resizing from the bottom side or corners involving the bottom
  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.x, bounds.y); // Adjust the X position
    result.height = Math.abs(bounds.y - point.y); // Adjust the height
  }

  return result; // Return the updated bounds
}


export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = []

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);

    if (layer == null) {
      continue;
    }
    const { x, y, width, height } = layer;
    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }
  return ids;
}

export function getContrastingTextColor(color: Color) {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

  return luminance > 182 ? "black " : 'white';
};

export function penPointsToPathLayer(
  points: number[][],
  color: Color,
): PathLayer {
  if (points.length < 2) {
    throw new Error('Cannot Transformpoints with less than 2 points');
  }
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY
  let right = Number.NEGATIVE_INFINITY
  let bottom = Number.NEGATIVE_INFINITY

  for (const point of points) {
    const [x, y] = point;

    if (left > x) {
      left = x;
    }

    if (top > y) {
      top = y;
    }

    if (right < x) {
      right = x;
    }

    if (bottom < y) {
      bottom = y;
    }
  }
  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure])
  };
};


export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('2');
  return d.join(" ");

}