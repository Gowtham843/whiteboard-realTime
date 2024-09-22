import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canavas"; // Importing the `RectangleLayer` type to define the structure of the rectangle layer.

interface RectanglePreviewProps {
    id: string; // Unique identifier for the rectangle layer.
    layer: RectangleLayer; // The layer object representing the rectangle's properties (position, size, etc.).
    onPointerDown: (e: React.PointerEvent, id: string) => void; // Function to handle pointer down events (mouse/touch), passing the event and the rectangle's id.
    selectionColor?: string; // Optional property to set the rectangle's selection color.
}

// Functional component to render a preview of a rectangle layer on the canvas.
export const RectanglePreview = ({
    id,
    layer, // Destructure the `layer` prop to access rectangle properties.
    onPointerDown, // Function to handle pointer down events.
    selectionColor // Optional selection color for the rectangle.
}: RectanglePreviewProps) => {

    // Destructure the properties of the rectangle from the layer object.
    const { x, y, height, width, fill } = layer;

    return (
        // SVG `rect` element representing the rectangle.
        <rect
            className="drop-shadow-md" // Adds a drop shadow to the rectangle for a visual effect.

            // Event handler for when the rectangle is clicked or touched.
            // Calls `onPointerDown` function with the event and rectangle's id.
            onPointerDown={(e) => onPointerDown(e, id)}

            // CSS style to translate (move) the rectangle to its x and y position.
            style={{
                transform: `translate(${x}px,${y}px)`, // Moves the rectangle to its position on the canvas.
            }}

            // Set initial x and y to 0 as the rectangle is moved via the `transform` style.
            x={0}
            y={0}

            // Width and height of the rectangle, taken from the layer object.
            width={width}
            height={height}

            // Stroke width for the rectangle's border.
            strokeWidth={2}
            //fill the color by getting fill value in layer
            fill={fill ? colorToCss(fill) : '#000'}

            // Border color for the rectangle. Initially set to "transparent."
            stroke={selectionColor || "transparent"}
        />
    )
}
