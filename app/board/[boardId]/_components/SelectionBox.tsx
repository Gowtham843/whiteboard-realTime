"use client"; // Directive that indicates this is a client-side component in Next.js.

import { useSelectionBounds } from "@/hooks/use-selection-bounds"; // Custom hook to get the bounds (x, y, width, height) of the selected elements.
import { LayerType, Side, XYWH } from "@/types/canavas"; // Importing types for layer and canvas properties.
import { useSelf, useStorage } from "@liveblocks/react/suspense"; // Liveblocks hooks to access self presence and shared storage.
import { memo } from "react"; // React `memo` to optimize performance by memoizing the component.

interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void; // Function to handle pointer down events on resize handles (when resizing a layer).
}

const HANDLE_WIDTH = 8; // Constant for the width of the resize handles.

export const SelectionBox = memo(({
    onResizeHandlePointerDown // Destructuring the prop to handle resize pointer down event.
}: SelectionBoxProps) => {

    // Gets the ID of the sole selected layer if there's only one selected layer.
    const soleLayerId = useSelf((me) => {
        // If the selection array has exactly one item, return its ID, otherwise return `null`.
        return me.presence.selection.length === 1 ? me.presence.selection[0] : null;
    });

    // Determines whether to show resize handles. Handles are not shown for `Path` type layers.
    const isShowingHandles = useStorage((root) => {
        // If a single layer is selected and its type is not `LayerType.Path`, return `true`.
        return soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path;
    });

    // Fetch the bounds (position and size) of the selected element(s) using a custom hook.
    const bounds = useSelectionBounds();

    // If no bounds are available (nothing selected), return `null` (do not render anything).
    if (!bounds) {
        return null;
    }

    return (
        <>
            {/* Main selection box - blue stroke around the selected element(s) */}
            <rect
                className="fill-transparent stroke-blue-500 stroke-2 pointer-events-none" // Transparent box with blue outline (2px stroke).
                style={{
                    transform: `translate(${bounds.x}px,${bounds.y}px)`, // Translate the box to the selected element's position.
                }}
                x={0} // X coordinate (top-left corner).
                y={0} // Y coordinate (top-left corner).
                width={bounds.width} // Width of the selection box based on the selected element(s).
                height={bounds.height} // Height of the selection box.
            />

            {/* Conditional rendering of resize handles, only shown if `isShowingHandles` is true */}
            {isShowingHandles && (
                <>
                    {/* Top-left resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'nwse-resize', // Cursor for diagonal resizing (top-left to bottom-right).
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px,${bounds.y - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation(); // Prevent event bubbling.
                            onResizeHandlePointerDown(Side.Top + Side.Left, bounds); // Pass `Top` and `Left` sides for top-left corner.
                        }}
                    />

                    {/* Top-right resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'nesw-resize', // Cursor for diagonal resizing (top-right to bottom-left).
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px,${bounds.y - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top + Side.Right, bounds); // Pass `Top` and `Right` sides for top-right corner.
                        }}
                    />

                    {/* Bottom-left resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'nesw-resize', // Cursor for diagonal resizing (bottom-left to top-right).
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px,${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds); // Pass `Bottom` and `Left` sides for bottom-left corner.
                        }}
                    />

                    {/* Bottom-right resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'nwse-resize', // Cursor for diagonal resizing (bottom-right to top-left).
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px,${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds); // Pass `Bottom` and `Right` sides for bottom-right corner.
                        }}
                    />

                    {/* Top edge (centered) resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'ns-resize', // Cursor for vertical resizing.
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,${bounds.y - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top, bounds); // Pass `Top` for top edge.
                        }}
                    />

                    {/* Bottom edge (centered) resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'ns-resize', // Cursor for vertical resizing.
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom, bounds); // Pass `Bottom` for bottom edge.
                        }}
                    />

                    {/* Left edge (centered) resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'ew-resize', // Cursor for horizontal resizing.
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px,${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Left, bounds); // Pass `Left` for left edge.
                        }}
                    />

                    {/* Right edge (centered) resize handle */}
                    <rect
                        className="fill-white stroke-2 stroke-blue-500"
                        style={{
                            cursor: 'ew-resize', // Cursor for horizontal resizing.
                            width: `${HANDLE_WIDTH}px`,
                            height: `${HANDLE_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px,${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Right, bounds); // Pass `Right` for right edge.
                        }}
                    />
                </>
            )}

        </>
    )
});

// Set a display name for the `SelectionBox` component, useful for debugging in React DevTools.
SelectionBox.displayName = "SelectionBox";
