// Represents an RGB color with red, green, and blue components.
export type Color = {
    r: number; // Red component (0-255)
    g: number; // Green component (0-255)
    b: number; // Blue component (0-255)
};

// Represents a camera position in a 2D space (x, y coordinates).
export type Camera = {
    x: number; // X-coordinate of the camera
    y: number; // Y-coordinate of the camera
};

// Enum representing the different types of layers that can exist on the canvas.
export enum LayerType {
    Rectangle, // Represents a rectangular shape layer
    Ellipse,   // Represents an elliptical shape layer
    Path,      // Represents a path or freeform shape layer
    Text,      // Represents a text layer
    Note       // Represents a note or annotation layer
}

// Represents a rectangle layer with dimensions and fill color.
export type RectangleLayer = {
    type: LayerType.Rectangle; // Specifies that this is a rectangle layer
    x: number;    // X-coordinate of the rectangle's top-left corner
    y: number;    // Y-coordinate of the rectangle's top-left corner
    width: number;  // Width of the rectangle
    height: number; // Height of the rectangle
    fill: Color;    // Fill color of the rectangle
    value?: string; // Optional text or value associated with the rectangle
    fontFamily?: string;

};

// Represents an ellipse layer with dimensions and fill color.
export type EllipseLayer = {
    type: LayerType.Ellipse; // Specifies that this is an ellipse layer
    x: number;    // X-coordinate of the ellipse's center
    y: number;    // Y-coordinate of the ellipse's center
    width: number;  // Width of the ellipse (diameter along the x-axis)
    height: number; // Height of the ellipse (diameter along the y-axis)
    fill: Color;    // Fill color of the ellipse
    value?: string; // Optional text or value associated with the ellipse
    fontFamily?: string;

};

// Represents a path layer with a series of points.
export type PathLayer = {
    type: LayerType.Path; // Specifies that this is a path layer
    x: number;    // X-coordinate of the path's start point
    y: number;    // Y-coordinate of the path's start point
    width: number;  // Width of the path
    height: number; // Height of the path
    fill: Color;    // Fill color of the path
    points: number[][]; // List of points (as x, y coordinates) representing the path
    value?: string;     // Optional text or value associated with the path
    fontFamily?: string;

};

// Represents a text layer with content, position, and fill color.
export type TextLayer = {
    type: LayerType.Text; // Specifies that this is a text layer
    x: number;    // X-coordinate of the text's position
    y: number;    // Y-coordinate of the text's position
    width: number;  // Width of the text box
    height: number; // Height of the text box
    fill: Color;    // Fill color of the text
    value?: string; // The actual text content of the layer
    fontFamily?: string; // The actual text content of the layer
};

// Represents a note layer with dimensions and content.
export type NoteLayer = {
    type: LayerType.Note; // Specifies that this is a note layer
    x: number;    // X-coordinate of the note's position
    y: number;    // Y-coordinate of the note's position
    width: number;  // Width of the note box
    height: number; // Height of the note box
    fill: Color;    // Fill color of the note
    value?: string; // Optional text or content of the note
    fontFamily?: string;
};

// Represents a point in 2D space with x, y coordinates and optional width/height (for rectangles or bounding boxes).
export type Point = {
    x: number;    // X-coordinate
    y: number;    // Y-coordinate
};
export type XYWH = {
    x: number;    // X-coordinate
    y: number;    // Y-coordinate
    width: number;  // Width (optional, for defining dimensions)
    height: number; // Height (optional, for defining dimensions)
};

// Enum to define which side of an object is being interacted with.
export enum Side {
    Top = 1,    // Top side of the object
    Bottom = 2, // Bottom side of the object
    Left = 4,   // Left side of the object
    Right = 8,  // Right side of the object
}

// Type alias representing the possible states of the canvas.
// Each state contains different properties, depending on the interaction mode.
export type CanvasState =
    | {
        mode: CanvasMode.None;        // No interaction is taking place.
    }
    | {
        mode: CanvasMode.SelectionNet; // User is selecting multiple elements using a selection box/net.
        origin: Point;                 // Starting point of the selection box.
        current?: Point;               // Current point of the selection box (if dragging).
    }
    | {
        mode: CanvasMode.Translating;  // Elements on the canvas are being moved or dragged.
        current: Point;                // Current position of the element being moved.
    }
    | {
        mode: CanvasMode.Inserting;    // User is inserting a new element onto the canvas.
        layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text | LayerType.Note; // Type of element being inserted.
    }
    | {
        mode: CanvasMode.Pressing;     // User is pressing an element, possibly to resize or move it.
        origin: Point;                 // Starting point of the press interaction.
    }
    | {
        mode: CanvasMode.Pencil;       // User is using a freehand drawing tool (pencil).
    }
    | {
        mode: CanvasMode.Resizing;     // User is resizing an element on the canvas.
        initialBounds: XYWH;           // Initial dimensions and position of the element being resized.
        corner: Side;                  // Which corner of the element is being dragged for resizing.
    };

// Enum to define various interaction modes for the canvas.
export enum CanvasMode {
    None,          // No specific interaction mode is active.
    Pressing,      // User is pressing on an object, which might lead to resizing or moving.
    SelectionNet,  // User is selecting multiple objects using a selection area (net).
    Translating,   // User is moving objects across the canvas.
    Inserting,     // User is inserting new objects onto the canvas.
    Resizing,      // User is resizing elements on the canvas.
    Pencil,        // User is drawing freehand on the canvas (like using a pencil).
}


export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer | NoteLayer