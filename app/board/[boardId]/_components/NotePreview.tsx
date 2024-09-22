import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { NoteLayer } from "@/types/canavas";
import { useMutation } from "@liveblocks/react";

import { Kalam } from "next/font/google"
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

const font = Kalam({
    subsets: ['latin'],
    weight: ['400']
});

const CalculateFontSize = (width: number, height: number) => {
    const maxFontSize = 70;
    const scaleFactor = 0.5;
    const fontSizeBasedonHeight = height * scaleFactor
    const fontSizeBasedonWidth = width * scaleFactor

    return Math.min(fontSizeBasedonHeight, fontSizeBasedonWidth, maxFontSize);
}

interface NotePreviewProps {
    id: string;
    layer: NoteLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const NotePreview = ({
    id,
    layer,
    onPointerDown,
    selectionColor
}: NotePreviewProps) => {
    const { x, y, height, width, fill, value } = layer;

    const updateValue = useMutation((
        { storage },
        newValue: string
    ) => {
        const livelayers = storage.get('layers');
        livelayers.get(id)?.set('value', newValue)
    }, []);

    const handleContentCHange = (e: ContentEditableEvent) => {
        updateValue(e.target.value);
    }


    return (
        <foreignObject
            x={x}
            y={y}
            width={width}
            height={height}
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                outline: selectionColor ? `1px solid ${selectionColor}` : "none",
                backgroundColor: fill ? colorToCss(fill) : '#000'
            }}
            className="shadow-md drop-shadow-xl"
        >
            <ContentEditable
                html={value || ' '}
                onChange={handleContentCHange}
                className={cn(
                    "h-full w-full flex items-center justify-center text-center outline-none",
                    font.className
                )}
                style={{
                    fontSize: CalculateFontSize(width, height),
                    color: fill ? getContrastingTextColor(fill) : '#000',
                    fontFamily: layer.fontFamily || "default-font", // Apply the selected font
                }}
            />
            {value?.trim() === '' && (
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center text-gray-400 pointer-events-none">
                    Text
                </div>
            )}
        </foreignObject>
    )
}