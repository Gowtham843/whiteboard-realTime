import { colorToCss } from "@/lib/utils";
import { EllipseLayer } from "@/types/canavas"; // Importing the `EllipseLayer` type to define the structure of the ellipse layer.

interface EllipsePreviewProps {
    id: string; // Unique identifier for the ellipse layer.
    layer: EllipseLayer; // The layer object representing the ellipse's properties (position, size, etc.).
    onPointerDown: (e: React.PointerEvent, id: string) => void; // Function to handle pointer down events (mouse/touch), passing the event and the ellipse's id.
    selectionColor?: string; // Optional property to set the ellipse's selection color.
}

// Functional component to render a preview of an ellipse layer on the canvas.
export const EllipsePreview = ({
    id,
    layer, // Destructure the `layer` prop to access ellipse properties.
    onPointerDown, // Function to handle pointer down events.
    selectionColor // Optional selection color for the ellipse.
}: EllipsePreviewProps) => {

    return (
        // SVG `ellipse` element representing the ellipse.
        <ellipse
            className="drop-shadow-md" // Adds a drop shadow to the ellipse for a visual effect.

            // Event handler for when the ellipse is clicked or touched.
            // Calls `onPointerDown` function with the event and ellipse's id.
            onPointerDown={(e) => onPointerDown(e, id)}

            // Position the ellipse by translating it to its `x` and `y` position.
            cx={layer.x + layer.width / 2} // Set `cx` to the horizontal center of the ellipse.
            cy={layer.y + layer.height / 2} // Set `cy` to the vertical center of the ellipse.

            // Define the radii for the ellipse, half of width and height.
            rx={layer.width / 2}
            ry={layer.height / 2}

            // Set the fill color of the ellipse. Defaults to black if no fill is provided.
            fill={layer.fill ? colorToCss(layer.fill) : '#000'}

            // Border color for the ellipse. Defaults to transparent if no selection color is provided.
            stroke={selectionColor || "transparent"}

            strokeWidth="2"
        />
    )
}
