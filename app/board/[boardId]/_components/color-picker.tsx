"use client";

import { useState } from "react";
import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canavas";

interface ColorPickerProps {
    onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
    // State to track the user-selected custom color
    const [customColor, setCustomColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0
    });

    // Update custom color based on the input value (hex)
    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hexColor = e.target.value;
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const newColor: Color = { r, g, b };
        setCustomColor(newColor);
        onChange(newColor);  // Immediately update the color on change
    };


    return (
        <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
            {/* Predefined Color Buttons */}
            <ColorButton
                onClick={onChange}
                color={{
                    r: 243,
                    g: 82,
                    b: 35
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 34,
                    g: 150,
                    b: 243
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 50,
                    g: 205,
                    b: 50
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 255,
                    g: 215,
                    b: 0
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 128,
                    g: 0,
                    b: 128
                }}
            />

            {/* Custom Color Button */}
            <ColorButton onClick={onChange} color={customColor} />

            {/* Color Input (for selecting custom color) */}
            <input
                type="color"
                className="w-8 h-8 cursor-pointer"
                onChange={handleCustomColorChange}
                value={colorToHex(customColor)}
            />
        </div>
    );
};

interface ColorButtonProps {
    onClick: (color: Color) => void;
    color: Color;
}

const ColorButton = ({
    onClick,
    color
}: ColorButtonProps) => {
    return (
        <button
            className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
            onClick={() => onClick(color)}
        >
            <div
                className="h-8 w-8 rounded-md border border-neutral-300"
                style={{
                    background: colorToCss(color)
                }}
            ></div>
        </button>
    );
};

// Helper function to convert Color object to hex string
const colorToHex = (color: Color): string => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g
        .toString(16)
        .padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
};
