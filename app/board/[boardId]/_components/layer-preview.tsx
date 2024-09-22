import { LayerType } from "@/types/canavas"; // Importing `LayerType` enum which defines the different types of layers (e.g., Rectangle, Ellipse, etc.).
import { useStorage } from "@liveblocks/react/suspense"; // `useStorage` hook from Liveblocks to access shared canvas storage.
import { memo } from "react"; // Importing `memo` from React to optimize performance by preventing unnecessary re-renders.
import { RectanglePreview } from "./rectangle-preview"; // Importing the `RectanglePreview` component, which renders a rectangle layer.
import { EllipsePreview } from "./EllipsePreview";
import { TextPreview } from "./textPreview";
import { NotePreview } from "./NotePreview";
import { PathPreview } from "./PathPreview";
import { colorToCss } from "@/lib/utils";

interface LayerPreviewProps {

    id: string; // The ID of the layer to be rendered.
    onLayerPointerDown: (e: React.PointerEvent, LayerId: string) => void; // Function to handle pointer down (click/touch) events on the layer.
    selectionColor?: string; // Optional color to be used when the layer is selected.
}

// `LayerPreview` component that renders different types of layers based on the layer's type.
export const LayerPreview = memo(({
    id, // ID of the current layer.
    onLayerPointerDown, // Function to handle pointer down events on the layer.
    selectionColor // Optional selection color.
}: LayerPreviewProps) => {
    // Using `useStorage` to access the layer data from the shared storage (fetched by ID).
    const layer = useStorage((root) => root.layers.get(id));


    // If the layer doesn't exist in storage (e.g., has been deleted or not found), return `null` to avoid rendering.
    if (!layer) {
        return null;
    }
    // `switch` statement to render the appropriate preview based on the layer's type.
    switch (layer.type) {
        case LayerType.Rectangle: // If the layer is a rectangle, render `RectanglePreview`.
            return (
                <RectanglePreview
                    id={id} // Pass the layer ID.
                    layer={layer} // Pass the rectangle layer data.
                    onPointerDown={onLayerPointerDown} // Handle pointer down event (e.g., selecting the layer).
                    selectionColor={selectionColor} // Optional selection color if the layer is selected.
                />
            );

        case LayerType.Ellipse:
            return (
                <EllipsePreview
                    id={id} // Pass the layer ID.
                    layer={layer} // Pass the rectangle layer data.
                    onPointerDown={onLayerPointerDown} // Handle pointer down event (e.g., selecting the layer).
                    selectionColor={selectionColor} // Optional selection color if the layer is selected.
                />
            )

        case LayerType.Text:
            return (
                <TextPreview
                    id={id} // Pass the layer ID.
                    layer={layer} // Pass the rectangle layer data.
                    onPointerDown={onLayerPointerDown} // Handle pointer down event (e.g., selecting the layer).
                    selectionColor={selectionColor} // Optional selection color if the layer is selected.
                />
            )


        case LayerType.Note:
            return (
                <NotePreview
                    id={id} // Pass the layer ID.
                    layer={layer} // Pass the rectangle layer data.
                    onPointerDown={onLayerPointerDown} // Handle pointer down event (e.g., selecting the layer).
                    selectionColor={selectionColor} // Optional selection color if the layer is selected.
                />
            )

        case LayerType.Path:
            return (
                <PathPreview
                    x={layer.x}
                    y={layer.y}
                    points={layer.points} // Pass the rectangle layer data.
                    onPointerDown={(e) => onLayerPointerDown(e, id)} // Handle pointer down event (e.g., selecting the layer).
                    fill={layer.fill ? colorToCss(layer.fill) : '#000'}
                    stroke={selectionColor} // Optional selection color if the layer is selected.
                />
            )

        default:
            // If the layer type is not recognized, log a warning message.
            console.warn("Unknown Layer type");
    }
});

// Explicitly set the display name for `LayerPreview` to assist with debugging in React DevTools.
LayerPreview.displayName = "LayerPreview";
