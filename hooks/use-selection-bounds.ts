import { Layer, XYWH } from "@/types/canavas";
import { shallow, useSelf, useStorage } from "@liveblocks/react/suspense";
import { root } from "postcss";

// Bounding box function that computes the bounds for an array of layers
const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];

    // If no layers are provided, return null
    if (!first) {
        return null;
    }

    // Initialize the bounding box edges using the first layer's properties
    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;

    // Loop through all layers to calculate the outer bounds
    for (let i = 1; i < layers.length; i++) {
        const { x, y, width, height } = layers[i];

        // Update left, right, top, and bottom based on the layer's position and size
        if (left > x) {
            left = x;
        }
        if (right < x + width) {
            right = x + width;
        }
        if (top > y) {
            top = y;
        }
        if (bottom < y + height) {
            bottom = y + height;
        }
    }

    // Return the bounding box coordinates and size
    return { x: left, y: top, width: right - left, height: bottom - top };
};

// Hook to calculate the selection bounds based on the selected layers
export const useSelectionBounds = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useStorage((root) => {
        const selectedLayers = selection
            .map((layerId) => root.layers.get(layerId))
            .filter((layer): layer is Layer => Boolean(layer)); // Filter out undefined values and narrow type to Layer

        // Pass the filtered layers to the boundingBox function
        return boundingBox(selectedLayers);
    }, shallow);
};
