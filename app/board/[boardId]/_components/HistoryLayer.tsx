import { Hint } from "@/app/(dashboard)/_components/hint";
import { Button } from "@/components/ui/button";
import { colorToCss } from "@/lib/utils";
import { LayerType } from "@/types/canavas";
import { useStorage } from "@liveblocks/react/suspense";
import { Circle, MousePointer2, Pencil, Square, StickyNote, Type } from "lucide-react";
import { memo } from "react";

interface HistoryLayerProps {
    id: string;

}

export const HistoryLayer = memo(({ id }: HistoryLayerProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
        return null;
    }

    const renderLayerIcon = (type: LayerType) => {
        switch (layer.type) {
            case LayerType.Rectangle:
                return (
                    <div className="w-6 h-6 rounded">
                        <Square className="w-6 h-6" fill={layer.fill ? colorToCss(layer.fill) : '#000'} />
                    </div>
                );


            case LayerType.Ellipse:
                return (
                    <div className="w-6 h-6 rounded">
                        <Circle className="w-6 h-6" fill={layer.fill ? colorToCss(layer.fill) : '#000'} />
                    </div>
                );
            case LayerType.Path:
                return (
                    <div className="w-6 h-6 rounded">
                        <Pencil className="w-6 h-6" />
                    </div>
                );
            case LayerType.Text:
                return (
                    <div className="w-6 h-6 rounded">
                        <Type className="w-6 h-6" />
                    </div>
                );
            case LayerType.Note:
                return (
                    <div className="w-6 h-6 rounded">
                        <StickyNote className="w-6 h-6" fill={layer.fill ? colorToCss(layer.fill) : '#000'} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div >
            {renderLayerIcon(layer.type)} {/* Render the icon for the layer type */}
        </div>

    );
});

HistoryLayer.displayName = 'HistoryLayer';
