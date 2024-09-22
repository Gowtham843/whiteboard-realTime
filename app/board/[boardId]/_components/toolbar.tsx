
import { Circle, MousePointer2, Pen, PenBox, PenSquare, PenTool, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react";
import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canavas";



interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
};

const Toolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo
}: ToolbarProps) => {
    return (
        <div className="absolute left-[50%] -translate-x-[50%] bottom-10 flex flex-row gap-x-4">
            <div className="bg-white rounded-md p-1.5 flex gap-x-1 flex-row items-center shadow-lg">
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    onClick={() => setCanvasState({ mode: CanvasMode.None })}
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton
                    label="Text"
                    icon={Type}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Text
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Text
                    }
                />
                <ToolButton
                    label="Sticky Note"
                    icon={StickyNote}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Note
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Note
                    }
                />
                <ToolButton
                    label="Recetangle"
                    icon={Square}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Rectangle
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Rectangle
                    }
                />
                <ToolButton
                    label="Circle"
                    icon={Circle}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Ellipse
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Ellipse
                    }
                />
                <ToolButton
                    label="Pen"
                    icon={PenTool}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Pencil
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Pencil 
                    }
                />

            </div>
            <div className="bg-white rounded-md flex flex-row p-1.5 items-center shadow-md">
                <ToolButton
                    label="Undo"
                    icon={Undo2}
                    onClick={undo}
                    isDisabled={!canUndo}
                />
                <ToolButton
                    label="Redo"
                    icon={Redo2}
                    onClick={redo}
                    isDisabled={!canRedo}
                />

            </div>
        </div>
    )
};

export default Toolbar;


export const ToolbarSkeleton = () => {
    return (
        <div className="absolute left-[50%] -translate-x-[50%] bottom-10 flex flex-row gap-x-4 w-[400px] shadow-md rounded-md h-[50px] bg-white opacity-75" />
    )
}