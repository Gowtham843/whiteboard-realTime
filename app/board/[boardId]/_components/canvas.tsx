"use client"; // Directive that ensures this is a client-side component in Next.js.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Info from "./info"; // Component that likely displays board info (board name, etc.).
import Participants from "./participants"; // Component to display participants on the canvas.
import Toolbar from "./toolbar"; // Component for canvas toolbar (undo, redo, etc.).
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canavas"; // Importing types related to canvas state and camera position.
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useSelf, useStorage } from "@liveblocks/react/suspense"; // Liveblocks hooks for handling collaborative state.
import { CursorsPresence } from "./cursors-presencce"; // Component that displays user cursors (collaborative cursors).
import { colorToCss, connectionIdToColor, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils"; // Utility function to convert pointer events to canvas coordinates.
import { nanoid } from 'nanoid' // Generates unique IDs for layers.
import { LiveObject } from "@liveblocks/client"; // LiveObject from Liveblocks for creating collaborative data.
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./SelectionBox";
import { SelectionTools } from "./Selection-tools";
import { HistoryLayer } from "./HistoryLayer";
import { PathPreview } from "./PathPreview";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

interface CanvasProps {
    boardId: string; // Canvas props include the board ID (unique identifier for the canvas board).
}

const MAX_LAYERS = 1000; // Max number of layers allowed on the canvas.

export const Canvas = ({ boardId }: CanvasProps) => {

    // Retrieve layerIds from the shared storage.
    const layerIds = useStorage((root) => root.layerIds);

    const pencilDraft = useSelf((me) => me.presence.pencilDraft);

    // Local state for canvas mode (e.g., drawing, moving objects) and camera position (x, y coordinates).
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None, // Initial state is 'None', meaning no current interaction mode.
    });



    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 }); // Initial camera position set to (0, 0).

    // State to track the last color used by the user for filling shapes.
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0,
    });



    // Hooks from Liveblocks to manage undo/redo functionality and track history.
    useDisableScrollBounce();
    const history = useHistory(); // Keeps track of the history of canvas actions.
    const canUndo = useCanUndo(); // Checks if an undo action is possible.
    const canRedo = useCanRedo(); // Checks if a redo action is possible.

    const insertLayer = useMutation(({
        storage, setMyPresence
    }, layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, position: Point) => {

        const liveLayers = storage.get('layers');

        if (liveLayers.size >= MAX_LAYERS) {
            return { error: 'Maximum number of layers reached' };
        }

        const liveLayerIds = storage.get('layerIds');
        const LayerId = nanoid();

        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor
        });

        liveLayerIds.push(LayerId);
        liveLayers.set(LayerId, layer);


        setMyPresence({ selection: [LayerId] }, { addToHistory: true });

        setCanvasState({ mode: CanvasMode.None });

    }, [lastUsedColor]);




    // Function to handle translating (moving) selected layers on the canvas.
    const translateSelectedLayers = useMutation((
        { storage, self }, // Access storage and the user's presence.
        point: Point // The current pointer position.
    ) => {
        // Only perform the translation if the current mode is "Translating".
        if (canvasState.mode !== CanvasMode.Translating) {
            return;
        }

        // Calculate the offset (change in position) based on the pointer's movement.
        const Offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
        };

        // Retrieve the layers from shared storage.
        const liveLayers = storage.get('layers');

        // Loop through each selected layer and update its position.
        for (const id of self.presence.selection) {
            const layer = liveLayers.get(id);

            if (layer) {
                layer.update({
                    x: layer.get('x') + Offset.x, // Update the x-coordinate.
                    y: layer.get('y') + Offset.y, // Update the y-coordinate.
                });
            }
        }

        // Update the canvas state to track the current pointer position.
        setCanvasState({ mode: CanvasMode.Translating, current: point });

    }, [canvasState]);

    // Function to deselect all currently selected layers.
    const unSelectLayer = useMutation((
        { self, setMyPresence } // Access the user's presence and a function to update it.
    ) => {
        // If the user has any layers selected, clear the selection.
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true }); // Deselect and add this action to history for undo/redo.
        }
    }, []);

    // Function to update the selection net (drag selection box) and select intersecting layers.
    const updateSelectionNet = useMutation((
        { storage, setMyPresence }, // Access storage and a function to update the user's presence.
        current: Point, // The current pointer position.
        origin: Point // The starting position where the user began the selection.
    ) => {
        // Convert layers to an immutable form for easier manipulation.
        const layers = storage.get('layers').toImmutable();

        // Update the canvas state to reflect the ongoing selection net.
        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current,
        });

        // Find the layers that intersect with the selection rectangle and update the user's selection.
        const ids = findIntersectingLayersWithRectangle(
            layerIds, // The list of all layer IDs.
            layers,   // All layers currently in storage.
            origin,   // The starting point of the selection net.
            current   // The current pointer position (end of the selection net).
        );

        // Update the user's presence to select all intersecting layers.
        setMyPresence({ selection: ids });
    }, [layerIds]);

    // Function to start multi-selection (dragging a selection box).
    const startMultiSelection = useCallback((
        current: Point, // The current pointer position.
        origin: Point // The initial point where the selection started.
    ) => {
        // If the pointer has moved a certain distance, switch to selection net mode.
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            });
        }
    }, []);

    const insertPath = useMutation(
        ({ storage, self, setMyPresence }) => {
            const liveLayers = storage.get('layers');
            const { pencilDraft } = self.presence;


            // Optionally, handle cases where conditions might be problematic
            if (liveLayers.size > MAX_LAYERS) {
                setMyPresence({ pencilDraft: null });
                return;
            }
            if (pencilDraft == null) {
                setMyPresence({ pencilDraft: null });
                return
            }
            if (pencilDraft.length < 2) {
                setMyPresence({ pencilDraft: null });
                return;
            }

            const id = nanoid();

            liveLayers.set(
                id,
                new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
            );

            const liveLayerIds = storage.get('layerIds');
            liveLayerIds.push(id);

            setMyPresence({ pencilDraft: null });
            setCanvasState({ mode: CanvasMode.Pencil });
        },
        [lastUsedColor]
    );



    const startDrawing = useMutation((
        { setMyPresence },
        point: Point,
        pressure: number,
    ) => {

        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastUsedColor
        })
    }, [lastUsedColor]);

    const continueDrawing = useMutation((
        { self, setMyPresence },
        point: Point,
        e: React.PointerEvent,
    ) => {
        const { pencilDraft } = self.presence;

        if (
            canvasState.mode !== CanvasMode.Pencil ||
            e.buttons !== 1 ||
            pencilDraft == null
        ) {
            return
        }

        setMyPresence({
            cursor: point,
            pencilDraft:
                pencilDraft.length === 1 &&
                    pencilDraft[0][0] === point.x &&
                    pencilDraft[0][1] === point.y ? pencilDraft : [...pencilDraft, [point.x, point.y, e.pressure]],
        });
    }, [canvasState.mode])

    // Function to resize the selected layer based on user input.
    const resizeSelectedLayer = useMutation((
        { storage, self }, // Access storage and the user's presence.
        point: Point // The current pointer position.
    ) => {
        // Only perform the resize if the current mode is "Resizing".
        if (canvasState.mode !== CanvasMode.Resizing) {
            return;
        }

        // Calculate the new bounds (size and position) based on the user's input.
        const bounds = resizeBounds(
            canvasState.initialBounds, // The initial bounds of the layer before resizing started.
            canvasState.corner,        // The corner the user is resizing from.
            point                      // The current pointer position.
        );

        // Retrieve the layers from shared storage.
        const liveLayers = storage.get('layers');
        const layer = liveLayers.get(self.presence.selection[0]); // Get the first selected layer (single layer resize).

        // If the layer exists, update its size and position.
        if (layer) {
            layer.update(bounds);
        }
    }, [canvasState]);

    // Function to handle when the user clicks on a resize handle to start resizing.
    const onResizeHandlePointerDown = useCallback((
        corner: Side, // The corner of the layer the user is resizing.
        initialBounds: XYWH // The initial size and position of the layer.
    ) => {
        history.pause(); // Pause the history tracking to avoid recording intermediate states.
        setCanvasState({
            mode: CanvasMode.Resizing,  // Set the mode to "Resizing".
            initialBounds,              // Store the initial bounds of the layer.
            corner,                     // Store the corner the user is resizing from.
        });
    }, [history]); // Use history to allow undo/redo functionality.


    // Handles mouse wheel events to adjust the camera position (panning).
    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX, // Adjusts the x position of the camera based on the mouse wheel movement.
            y: camera.y - e.deltaY  // Adjusts the y position of the camera based on the mouse wheel movement.
        }));
    }, []);


    // Handles pointer (mouse or touch) movement events and updates the user's cursor position.
    const onPointerMove = useMutation((
        { setMyPresence }, // `setMyPresence` updates the current user's presence (cursor position).
        e: React.PointerEvent
    ) => {
        e.preventDefault(); // Prevents default browser behavior for pointer events.
        const current = pointerEventToCanvasPoint(e, camera); // Converts the pointer event coordinates to canvas coordinates.

        if (canvasState.mode === CanvasMode.Pressing) {
            startMultiSelection(current, canvasState.origin)
        } else if (canvasState.mode === CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin)
        }
        else if (canvasState.mode == CanvasMode.Translating) {
            translateSelectedLayers(current);
        }
        else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current);
        } else if (canvasState.mode === CanvasMode.Pencil) {
            continueDrawing(current, e);
        }

        setMyPresence({ cursor: current }); // Updates the user's presence with the current cursor position.
    }, [camera, canvasState, resizeSelectedLayer, continueDrawing, startMultiSelection, translateSelectedLayers, updateSelectionNet]);


    // Mutation to handle when the user's pointer (cursor) leaves the canvas area.
    const onPointerLeave = useMutation((
        { setMyPresence }, // Destructuring `setMyPresence` function to update user's presence.
    ) => {
        // When the pointer leaves the canvas, set the user's cursor to `null` and clear their selection.
        setMyPresence({ cursor: null });
    }, []);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        // If the canvas is in inserting mode, skip the pressing logic.
        if (canvasState.mode === CanvasMode.Inserting) {
            return;
        }

        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Pencil) {

            startDrawing(point, e.pressure)
            return;
        }

        // Handle normal selection logic
        setCanvasState({ origin: point, mode: CanvasMode.Pressing });

    }, [camera, canvasState.mode, setCanvasState, startDrawing]);


    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera); // Get the pointer's position on the canvas.

        if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
            unSelectLayer();
            setCanvasState({ mode: CanvasMode.None });
        }
        else if (canvasState.mode === CanvasMode.Pencil) {
            insertPath();
        }
        else if (canvasState.mode === CanvasMode.Inserting) {
            // Insert the new layer at the pointer position.
            insertLayer(canvasState.layerType, point);
            // Reset the canvas mode after the layer is inserted.
            setCanvasState({ mode: CanvasMode.None });
        } else {
            // For any other mode, ensure the canvas state is properly handled.
            setCanvasState({ mode: CanvasMode.None });
        }

        history.resume(); // Resume the history tracking after the pointer up action.
    }, [
        camera,
        canvasState,
        history,
        insertLayer,
        setCanvasState,
        unSelectLayer,
        insertPath
    ]);



    const selections = useOthersMapped((other) => other.presence.selection);
    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
            }
        }
        return layerIdsToColorSelection;

    }, [selections]);


    const onLayerPointerDown = useMutation(({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
        e.stopPropagation(); // Prevent event from bubbling up

        if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
            return; // Prevent action in these modes
        }

        history.pause();

        const point = pointerEventToCanvasPoint(e, camera);

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [setCanvasState, camera, history]);

    const deleteLayers = useDeleteLayers();
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                case 'z': {
                    if (e.ctrlKey || e.metaKey) {
                        history.undo();
                    }
                    break;
                }
                case 'y': {
                    if (e.ctrlKey || e.metaKey) {
                        history.redo();
                    }
                    break;
                }
                case 'Delete':
                    deleteLayers();
                    break;
                case 'd':
                    if (e.ctrlKey || e.metaKey) {
                        deleteLayers();
                    }
                    break;
            }
        }
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    }, [deleteLayers, history])

    return (
        // Main container for the canvas, which takes up full width and height, and disables touch interactions.
        <main className="w-full h-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                undo={history.undo}
                redo={history.redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />

            {layerIds.length !== 0 ? (
                <div className="absolute top-[25%] left-10 transform -translate-x-1/2 max-h-[60%] overflow-y-auto px-2 py-4 bg-white rounded-md shadow-lg flex flex-col gap-y-4 scrollbar-hide">
                    {layerIds.map((layerId) => (
                        <HistoryLayer
                            key={layerId}
                            id={layerId}
                        />
                    ))}
                </div>
            ) : (
                <div className="opacity-0">

                </div>
            )}


            <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />

            <svg className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}>

                <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
                    {layerIds.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
                    {
                        canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
                            <rect
                                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                            />
                        )
                    }
                    <CursorsPresence />
                    {pencilDraft != null && pencilDraft.length > 0 && (
                        <PathPreview
                            points={pencilDraft}
                            fill={colorToCss(lastUsedColor)}
                            x={0}
                            y={0}
                        />
                    )}
                </g>
            </svg>
        </main>
    );
};
function isPointInLayerBounds(point: { x: number; y: number; }, layerId: string): unknown {
    throw new Error("Function not implemented.");
}

