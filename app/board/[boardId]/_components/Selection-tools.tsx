"use client";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { ColorPicker } from "./color-picker";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import { memo, useState } from "react";
import { Camera, Color } from "@/types/canavas";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";
import { Hint } from "@/app/(dashboard)/_components/hint";

interface SelectionToolProps {
    camera: Camera;
    setLastUsedColor: (color: Color) => void;
}

const fontStyles = [
    { label: "Kalam", value: "'Kalam', cursive" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { label: "Palatino Linotype", value: "'Palatino Linotype', serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
    { label: "Impact", value: "Impact, sans-serif" },
    { label: "Lucida Console", value: "'Lucida Console', monospace" },
    { label: "Futura", value: "Futura, sans-serif" },
    { label: "Baskerville", value: "Baskerville, serif" },
    { label: "Garamond", value: "Garamond, serif" },
    { label: "Droid Sans", value: "'Droid Sans', sans-serif" },
    { label: "Roboto", value: "'Roboto', sans-serif" },
    { label: "Open Sans", value: "'Open Sans', sans-serif" },
    { label: "Lobster", value: "'Lobster', cursive" },
    { label: "Oswald", value: "'Oswald', sans-serif" },
    { label: "Raleway", value: "'Raleway', sans-serif" },
    { label: "Merriweather", value: "'Merriweather', serif" },
    { label: "Poppins", value: "'Poppins', sans-serif" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Playfair Display", value: "'Playfair Display', serif" },
    { label: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
    { label: "Yanone Kaffeesatz", value: "'Yanone Kaffeesatz', sans-serif" },
];


export const SelectionTools = memo(({ camera, setLastUsedColor }: SelectionToolProps) => {
    const [selectedFont, setSelectedFont] = useState(fontStyles[0].value); // Default to the first font
    const selection = useSelf((me) => me.presence.selection);

    // Bring layers to the front (end of array)
    const bringToFrontLayer = useMutation(({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const selectedIndices: number[] = [];

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection.includes(arr[i])) {
                selectedIndices.push(i);
            }
        }

        selectedIndices.sort((a, b) => a - b);

        selectedIndices.forEach((fromIndex) => {
            liveLayerIds.move(fromIndex, arr.length - 1);
        });
    }, [selection]);

    // Move layers to the back (start of array)
    const moveToBackLayer = useMutation(({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const selectedIndices: number[] = [];

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection.includes(arr[i])) {
                selectedIndices.push(i);
            }
        }

        selectedIndices.sort((a, b) => b - a);

        selectedIndices.forEach((fromIndex) => {
            liveLayerIds.move(fromIndex, 0);
        });
    }, [selection]);

    // Set fill color
    const setFill = useMutation(({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection.forEach((id) => {
            liveLayers.get(id)?.set("fill", fill);
        });
    }, [selection, setLastUsedColor]);

    // Set font style
    const setFontStyle = useMutation(({ storage }, fontFamily: string) => {
        const liveLayers = storage.get("layers");

        selection.forEach((id) => {
            liveLayers.get(id)?.set("fontFamily", fontFamily);
        });
        setSelectedFont(fontFamily); // Update the selected font
    }, [selection]);

    // Delete selected layers
    const deleteLayers = useMutation(({ storage }) => {
        const liveLayers = storage.get("layers");

        selection.forEach((id) => {
            liveLayers.delete(id);
        });
    }, [selection]);

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
        return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
        <div
            className="absolute p-3 rounded-xl bg-white shadow-sm border flex"
            style={{
                transform: `translate(calc(${x}px - 50%),calc(${y - 16}px - 100%))`,
            }}
        >
            <ColorPicker onChange={setFill} />
            <div className="flex flex-col gap-y-0.5">
                <Hint label="Bring to front" side="top" sideOffset={10}>
                    <Button variant="board" size="icon" onClick={bringToFrontLayer}>
                        <BringToFront />
                    </Button>
                </Hint>
                <Hint label="Send to back" side="bottom" sideOffset={10}>
                    <Button variant="board" size="icon" onClick={moveToBackLayer}>
                        <SendToBack />
                    </Button>
                </Hint>
            </div>
            <div className="flex flex-col items-center pl-2 ml-2 border-l border-neutral-200">
                <select
                    value={selectedFont} // Bind the select value to the state
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="border p-2 rounded"
                >
                    {/* Place the selected font first */}
                    {fontStyles
                        .filter((font) => font.value === selectedFont) // Ensure selected font is first
                        .concat(fontStyles.filter((font) => font.value !== selectedFont)) // Add remaining fonts
                        .map((font) => (
                            <option key={font.value} value={font.value}>
                                {font.label}
                            </option>
                        ))}
                </select>
                <Hint label="Delete" side="top" sideOffset={10}>
                    <Button variant="board" size="icon" onClick={deleteLayers}>
                        <Trash2 />
                    </Button>
                </Hint>
            </div>
        </div>
    );
});

SelectionTools.displayName = "SelectionTools";
