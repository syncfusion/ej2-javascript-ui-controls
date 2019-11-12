import { Browser, ChildProperty, Collection, ComplexFactory, Property, createElement } from '@syncfusion/ej2-base';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**   @private  */
let getGradientType = (obj) => {
    switch (obj.type) {
        case 'Linear':
            return LinearGradient;
        case 'Radial':
            return RadialGradient;
        default:
            return LinearGradient;
    }
};
/**
 * Layout Model module defines the styles and types to arrange objects in containers
 */
class Thickness {
    constructor(left, right, top, bottom) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
}
/**
 * Defines the space to be left between an object and its immediate parent
 */
class Margin extends ChildProperty {
}
__decorate([
    Property(0)
], Margin.prototype, "left", void 0);
__decorate([
    Property(0)
], Margin.prototype, "right", void 0);
__decorate([
    Property(0)
], Margin.prototype, "top", void 0);
__decorate([
    Property(0)
], Margin.prototype, "bottom", void 0);
/**
 * Defines the different colors and the region of color transitions
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let stopscol: StopModel[] = [];
 * let stops1: StopModel = { color: 'white', offset: 0, opacity: 0.7 };
 * stopscol.push(stops1);
 * let stops2: StopModel = { color: 'red', offset: 0, opacity: 0.3 };
 * stopscol.push(stops2);
 * let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
 * let nodes: NodeModel[] = [{ id: 'node1', width: 100, height: 100,
 * style: { gradient: gradient }
 * }];
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: nodes,
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */
class Stop extends ChildProperty {
    /**
     * @private
     * Returns the name of class Stop
     */
    getClassName() {
        return 'Stop';
    }
}
__decorate([
    Property('')
], Stop.prototype, "color", void 0);
__decorate([
    Property(0)
], Stop.prototype, "offset", void 0);
__decorate([
    Property(1)
], Stop.prototype, "opacity", void 0);
/**
 * Paints the node with a smooth transition from one color to another color
 */
class Gradient extends ChildProperty {
}
__decorate([
    Collection([], Stop)
], Gradient.prototype, "stops", void 0);
__decorate([
    Property('None')
], Gradient.prototype, "type", void 0);
__decorate([
    Property('')
], Gradient.prototype, "id", void 0);
/**
 * Defines the linear gradient of styles
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let stopscol: StopModel[] = [];
 * let stops1: StopModel = { color: 'white', offset: 0, opacity: 0.7 };
 * stopscol.push(stops1);
 * let stops2: StopModel = { color: 'red', offset: 0, opacity: 0.3 };
 * stopscol.push(stops2);
 * let gradient: LinearGradientModel = { x1: 0, x2: 50, y1: 0, y2: 50, stops: stopscol, type: 'Linear' };
 * let nodes: NodeModel[] = [{ id: 'node1', width: 100, height: 100,
 * style: { gradient: gradient }
 * }];
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: nodes,
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */
/**
 * Paints the node with linear color transitions
 */
class LinearGradient extends Gradient {
}
__decorate([
    Property(0)
], LinearGradient.prototype, "x1", void 0);
__decorate([
    Property(0)
], LinearGradient.prototype, "x2", void 0);
__decorate([
    Property(0)
], LinearGradient.prototype, "y1", void 0);
__decorate([
    Property(0)
], LinearGradient.prototype, "y2", void 0);
/**
 * A focal point defines the beginning of the gradient, and a circle defines the end point of the gradient
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let stopscol: StopModel[] = [];
 * let stops1: StopModel = { color: 'white', offset: 0, opacity: 0.7 };
 * stopscol.push(stops1);
 * let stops2: StopModel = { color: 'red', offset: 0, opacity: 0.3 };
 * stopscol.push(stops2);
 * let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
 * let nodes: NodeModel[] = [{ id: 'node1', width: 100, height: 100,
 * style: { gradient: gradient }
 * }];
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: nodes,
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */
class RadialGradient extends Gradient {
}
__decorate([
    Property(0)
], RadialGradient.prototype, "cx", void 0);
__decorate([
    Property(0)
], RadialGradient.prototype, "cy", void 0);
__decorate([
    Property(0)
], RadialGradient.prototype, "fx", void 0);
__decorate([
    Property(0)
], RadialGradient.prototype, "fy", void 0);
__decorate([
    Property(50)
], RadialGradient.prototype, "r", void 0);
/**
 * Defines the style of shape/path
 */
class ShapeStyle extends ChildProperty {
}
__decorate([
    Property('white')
], ShapeStyle.prototype, "fill", void 0);
__decorate([
    Property('black')
], ShapeStyle.prototype, "strokeColor", void 0);
__decorate([
    Property('')
], ShapeStyle.prototype, "strokeDashArray", void 0);
__decorate([
    Property(1)
], ShapeStyle.prototype, "strokeWidth", void 0);
__decorate([
    Property(1)
], ShapeStyle.prototype, "opacity", void 0);
__decorate([
    ComplexFactory(getGradientType)
], ShapeStyle.prototype, "gradient", void 0);
/**
 * Defines the stroke style of a path
 */
class StrokeStyle extends ShapeStyle {
}
__decorate([
    Property('transparent')
], StrokeStyle.prototype, "fill", void 0);
/**
 * Defines the appearance of text
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let style: TextStyleModel = { strokeColor: 'black', opacity: 0.5, strokeWidth: 1 };
 * let node: NodeModel;
 * node = {
 * ...
 * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
 * annotations : [{
 * content: 'text', style: style }];
 * ...
 * };
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: [node],
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */
class TextStyle extends ShapeStyle {
}
__decorate([
    Property('black')
], TextStyle.prototype, "color", void 0);
__decorate([
    Property('Arial')
], TextStyle.prototype, "fontFamily", void 0);
__decorate([
    Property(12)
], TextStyle.prototype, "fontSize", void 0);
__decorate([
    Property(false)
], TextStyle.prototype, "italic", void 0);
__decorate([
    Property(false)
], TextStyle.prototype, "bold", void 0);
__decorate([
    Property('CollapseSpace')
], TextStyle.prototype, "whiteSpace", void 0);
__decorate([
    Property('WrapWithOverflow')
], TextStyle.prototype, "textWrapping", void 0);
__decorate([
    Property('Center')
], TextStyle.prototype, "textAlign", void 0);
__decorate([
    Property('None')
], TextStyle.prototype, "textDecoration", void 0);
__decorate([
    Property('Wrap')
], TextStyle.prototype, "textOverflow", void 0);
__decorate([
    Property('transparent')
], TextStyle.prototype, "fill", void 0);

/**
 * enum module defines the public enumerations
 */
/**
 * Defines the container/canvas transform
 * Self - Sets the transform type as Self
 * Parent - Sets the transform type as Parent
 */
var RotateTransform;
(function (RotateTransform) {
    /** Self - Sets the transform type as Self */
    RotateTransform[RotateTransform["Self"] = 1] = "Self";
    /** Parent - Sets the transform type as Parent */
    RotateTransform[RotateTransform["Parent"] = 2] = "Parent";
})(RotateTransform || (RotateTransform = {}));
/** Enables/Disables The element actions
 * None - Diables all element actions are none
 * ElementIsPort - Enable element action is port
 * ElementIsGroup - Enable element action as Group
 * @private
 */
var ElementAction;
(function (ElementAction) {
    /** Disables all element actions are none  */
    ElementAction[ElementAction["None"] = 0] = "None";
    /** Enable the element action is Port  */
    ElementAction[ElementAction["ElementIsPort"] = 2] = "ElementIsPort";
    /** Enable the element action as Group  */
    ElementAction[ElementAction["ElementIsGroup"] = 4] = "ElementIsGroup";
})(ElementAction || (ElementAction = {}));
/**
 * Defines the constraints to enable/disable certain features of connector.
 * * None - Interaction of the connectors cannot be done.
 * * Select - Selects the connector.
 * * Delete - Delete the connector.
 * * Drag - Drag the connector.
 * * DragSourceEnd - Drag the source end of the connector.
 * * DragTargetEnd - Drag the target end of the connector.
 * * DragSegmentThump - Drag the segment thumb of the connector.
 * * AllowDrop - Allow to drop a node.
 * * Bridging - Creates bridge  on intersection of two connectors.
 * * BridgeObstacle -
 * * InheritBridging - Creates bridge  on intersection of two connectors.
 * * PointerEvents - Sets the pointer events.
 * * Tooltip - Displays a tooltip for the connectors.
 * * InheritToolTip - Displays a tooltip for the connectors.
 * * Interaction - Features of the connector used for interaction.
 * * ReadOnly - Enables ReadOnly
 * * Default - Default features of the connector.
 * @aspNumberEnum
 * @IgnoreSingular
 */
var ConnectorConstraints;
(function (ConnectorConstraints) {
    /** Disable all connector Constraints. */
    ConnectorConstraints[ConnectorConstraints["None"] = 1] = "None";
    /** Enables connector to be selected. */
    ConnectorConstraints[ConnectorConstraints["Select"] = 2] = "Select";
    /** Enables connector to be Deleted. */
    ConnectorConstraints[ConnectorConstraints["Delete"] = 4] = "Delete";
    /** Enables connector to be Dragged. */
    ConnectorConstraints[ConnectorConstraints["Drag"] = 8] = "Drag";
    /** Enables connectors source end to be selected. */
    ConnectorConstraints[ConnectorConstraints["DragSourceEnd"] = 16] = "DragSourceEnd";
    /** Enables connectors target end to be selected. */
    ConnectorConstraints[ConnectorConstraints["DragTargetEnd"] = 32] = "DragTargetEnd";
    /** Enables control point and end point of every segment in a connector for editing. */
    ConnectorConstraints[ConnectorConstraints["DragSegmentThumb"] = 64] = "DragSegmentThumb";
    /** Enables AllowDrop constraints to the  connector. */
    ConnectorConstraints[ConnectorConstraints["AllowDrop"] = 128] = "AllowDrop";
    /** Enables bridging to the connector. */
    ConnectorConstraints[ConnectorConstraints["Bridging"] = 256] = "Bridging";
    /** Enables or Disables Bridge Obstacles with overlapping of connectors. */
    ConnectorConstraints[ConnectorConstraints["BridgeObstacle"] = 512] = "BridgeObstacle";
    /** Enables bridging to the connector. */
    ConnectorConstraints[ConnectorConstraints["InheritBridging"] = 1024] = "InheritBridging";
    /** Used to set the pointer events. */
    ConnectorConstraints[ConnectorConstraints["PointerEvents"] = 2048] = "PointerEvents";
    /** Enables or disables tool tip for the connectors */
    ConnectorConstraints[ConnectorConstraints["Tooltip"] = 4096] = "Tooltip";
    /** Enables or disables tool tip for the connectors */
    ConnectorConstraints[ConnectorConstraints["InheritTooltip"] = 8192] = "InheritTooltip";
    /** Enables Interaction. */
    ConnectorConstraints[ConnectorConstraints["Interaction"] = 4218] = "Interaction";
    /** Enables ReadOnly */
    ConnectorConstraints[ConnectorConstraints["ReadOnly"] = 16384] = "ReadOnly";
    /** Enables all constraints. */
    ConnectorConstraints[ConnectorConstraints["Default"] = 11838] = "Default";
})(ConnectorConstraints || (ConnectorConstraints = {}));
/** Enables/Disables the handles of the selector
 * Rotate - Enable Rotate Thumb
 * ConnectorSource - Enable Connector source point
 * ConnectorTarget - Enable Connector target point
 * ResizeNorthEast - Enable ResizeNorthEast Resize
 * ResizeEast - Enable ResizeEast Resize
 * ResizeSouthEast - Enable ResizeSouthEast Resize
 * ResizeSouth - Enable ResizeSouth Resize
 * ResizeSouthWest - Enable ResizeSouthWest Resize
 * ResizeWest - Enable ResizeWest Resize
 * ResizeNorthWest - Enable ResizeNorthWest Resize
 * ResizeNorth - Enable ResizeNorth Resize
 * Default - Enables all constraints
 * @private
 */
var ThumbsConstraints;
(function (ThumbsConstraints) {
    /** Enable Rotate Thumb  */
    ThumbsConstraints[ThumbsConstraints["Rotate"] = 2] = "Rotate";
    /** Enable Connector source point  */
    ThumbsConstraints[ThumbsConstraints["ConnectorSource"] = 4] = "ConnectorSource";
    /** Enable Connector target point  */
    ThumbsConstraints[ThumbsConstraints["ConnectorTarget"] = 8] = "ConnectorTarget";
    /** Enable ResizeNorthEast Resize  */
    ThumbsConstraints[ThumbsConstraints["ResizeNorthEast"] = 16] = "ResizeNorthEast";
    /** Enable ResizeEast Resize  */
    ThumbsConstraints[ThumbsConstraints["ResizeEast"] = 32] = "ResizeEast";
    /** Enable ResizeSouthEast Resize */
    ThumbsConstraints[ThumbsConstraints["ResizeSouthEast"] = 64] = "ResizeSouthEast";
    /** Enable ResizeSouth Resize */
    ThumbsConstraints[ThumbsConstraints["ResizeSouth"] = 128] = "ResizeSouth";
    /** Enable ResizeSouthWest Resize */
    ThumbsConstraints[ThumbsConstraints["ResizeSouthWest"] = 256] = "ResizeSouthWest";
    /** Enable ResizeWest Resize */
    ThumbsConstraints[ThumbsConstraints["ResizeWest"] = 512] = "ResizeWest";
    /** Enable ResizeNorthWest Resize */
    ThumbsConstraints[ThumbsConstraints["ResizeNorthWest"] = 1024] = "ResizeNorthWest";
    /** Enable ResizeNorth Resize */
    ThumbsConstraints[ThumbsConstraints["ResizeNorth"] = 2048] = "ResizeNorth";
    /** Enables all constraints */
    ThumbsConstraints[ThumbsConstraints["Default"] = 4094] = "Default";
})(ThumbsConstraints || (ThumbsConstraints = {}));
/**
 * Defines the visibility of the selector handles
 * None - Hides all the selector elements
 * ConnectorSourceThumb - Shows/hides the source thumb of the connector
 * ConnectorTargetThumb - Shows/hides the target thumb of the connector
 * ResizeSouthEast - Shows/hides the bottom right resize handle of the selector
 * ResizeSouthWest - Shows/hides the bottom left resize handle of the selector
 * ResizeNorthEast - Shows/hides the top right resize handle of the selector
 * ResizeNorthWest - Shows/hides the top left resize handle of the selector
 * ResizeEast - Shows/hides the middle right resize handle of the selector
 * ResizeWest - Shows/hides the middle left resize handle of the selector
 * ResizeSouth - Shows/hides the bottom center resize handle of the selector
 * ResizeNorth - Shows/hides the top center resize handle of the selector
 * Rotate - Shows/hides the rotate handle of the selector
 * UserHandles - Shows/hides the user handles of the selector
 * Resize - Shows/hides all resize handles of the selector
 * @aspNumberEnum
 * @IgnoreSingular
 */
var SelectorConstraints;
(function (SelectorConstraints) {
    /** Hides all the selector elements */
    SelectorConstraints[SelectorConstraints["None"] = 1] = "None";
    /** Shows/hides the source thumb of the connector */
    SelectorConstraints[SelectorConstraints["ConnectorSourceThumb"] = 2] = "ConnectorSourceThumb";
    /** Shows/hides the target thumb of the connector */
    SelectorConstraints[SelectorConstraints["ConnectorTargetThumb"] = 4] = "ConnectorTargetThumb";
    /** Shows/hides the bottom right resize handle of the selector */
    SelectorConstraints[SelectorConstraints["ResizeSouthEast"] = 8] = "ResizeSouthEast";
    /** Shows/hides the bottom left resize handle of the selector */
    SelectorConstraints[SelectorConstraints["ResizeSouthWest"] = 16] = "ResizeSouthWest";
    /** Shows/hides the top right resize handle of the selector */
    SelectorConstraints[SelectorConstraints["ResizeNorthEast"] = 32] = "ResizeNorthEast";
    /** Shows/hides the top left resize handle of the selector */
    SelectorConstraints[SelectorConstraints["ResizeNorthWest"] = 64] = "ResizeNorthWest";
    /** Shows/hides the middle right resize handle of the selector  */
    SelectorConstraints[SelectorConstraints["ResizeEast"] = 128] = "ResizeEast";
    /** Shows/hides the middle left resize handle of the selector */
    SelectorConstraints[SelectorConstraints["ResizeWest"] = 256] = "ResizeWest";
    /** Shows/hides the bottom center resize handle of the selector */
    SelectorConstraints[SelectorConstraints["ResizeSouth"] = 512] = "ResizeSouth";
    /** Shows/hides the top center resize handle of the selector */
    SelectorConstraints[SelectorConstraints["ResizeNorth"] = 1024] = "ResizeNorth";
    /**  Shows/hides the rotate handle of the selector */
    SelectorConstraints[SelectorConstraints["Rotate"] = 2048] = "Rotate";
    /** Shows/hides the user handles of the selector */
    SelectorConstraints[SelectorConstraints["UserHandle"] = 4096] = "UserHandle";
    /** Shows/hides the default tooltip of nodes and connectors */
    SelectorConstraints[SelectorConstraints["ToolTip"] = 8192] = "ToolTip";
    /** Shows/hides all resize handles of the selector */
    SelectorConstraints[SelectorConstraints["ResizeAll"] = 2046] = "ResizeAll";
    /** Shows all handles of the selector  */
    SelectorConstraints[SelectorConstraints["All"] = 16382] = "All";
})(SelectorConstraints || (SelectorConstraints = {}));
/** @private */
var NoOfSegments;
(function (NoOfSegments) {
    NoOfSegments[NoOfSegments["Zero"] = 0] = "Zero";
    NoOfSegments[NoOfSegments["One"] = 1] = "One";
    NoOfSegments[NoOfSegments["Two"] = 2] = "Two";
    NoOfSegments[NoOfSegments["Three"] = 3] = "Three";
    NoOfSegments[NoOfSegments["Four"] = 4] = "Four";
    NoOfSegments[NoOfSegments["Five"] = 5] = "Five";
})(NoOfSegments || (NoOfSegments = {}));

/**
 * Size defines and processes the size(width/height) of the objects
 */
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    // /**   @private  */
    // public isEmpty(): boolean {
    //     return this.height === 0 && this.width === 0;
    // }
    /**   @private  */
    clone() {
        return new Size(this.width, this.height);
    }
}

/**
 * Rect defines and processes rectangular regions
 */
class Rect {
    constructor(x, y, width, height) {
        /**
         * Sets the x-coordinate of the starting point of a rectangular region
         * @default 0
         */
        this.x = Number.MAX_VALUE;
        /**
         * Sets the y-coordinate of the starting point of a rectangular region
         * @default 0
         */
        this.y = Number.MAX_VALUE;
        /**
         * Sets the width of a rectangular region
         * @default 0
         */
        this.width = 0;
        /**
         * Sets the height of a rectangular region
         * @default 0
         */
        this.height = 0;
        if (x === undefined || y === undefined) {
            x = y = Number.MAX_VALUE;
            width = height = 0;
        }
        else {
            if (width === undefined) {
                width = 0;
            }
            if (height === undefined) {
                height = 0;
            }
        }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**   @private  */
    get left() {
        return this.x;
    }
    /**   @private  */
    get right() {
        return this.x + this.width;
    }
    /**   @private  */
    get top() {
        return this.y;
    }
    /**   @private  */
    get bottom() {
        return this.y + this.height;
    }
    /**   @private  */
    get topLeft() {
        return { x: this.left, y: this.top };
    }
    /**   @private  */
    get topRight() {
        return { x: this.right, y: this.top };
    }
    /**   @private  */
    get bottomLeft() {
        return { x: this.left, y: this.bottom };
    }
    /**   @private  */
    get bottomRight() {
        return { x: this.right, y: this.bottom };
    }
    /**   @private  */
    get middleLeft() {
        return { x: this.left, y: this.y + this.height / 2 };
    }
    /**   @private  */
    get middleRight() {
        return { x: this.right, y: this.y + this.height / 2 };
    }
    /**   @private  */
    get topCenter() {
        return { x: this.x + this.width / 2, y: this.top };
    }
    /**   @private  */
    get bottomCenter() {
        return { x: this.x + this.width / 2, y: this.bottom };
    }
    /**   @private  */
    get center() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }
    /**   @private  */
    equals(rect1, rect2) {
        return rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height;
    }
    /**   @private  */
    uniteRect(rect) {
        let right = Math.max(Number.NaN === this.right || this.x === Number.MAX_VALUE ? rect.right : this.right, rect.right);
        let bottom = Math.max(Number.NaN === this.bottom || this.y === Number.MAX_VALUE ? rect.bottom : this.bottom, rect.bottom);
        this.x = Math.min(this.left, rect.left);
        this.y = Math.min(this.top, rect.top);
        this.width = right - this.x;
        this.height = bottom - this.y;
        return this;
    }
    /**   @private  */
    unitePoint(point) {
        if (this.x === Number.MAX_VALUE) {
            this.x = point.x;
            this.y = point.y;
            return;
        }
        let x = Math.min(this.left, point.x);
        let y = Math.min(this.top, point.y);
        let right = Math.max(this.right, point.x);
        let bottom = Math.max(this.bottom, point.y);
        this.x = x;
        this.y = y;
        this.width = right - this.x;
        this.height = bottom - this.y;
    }
    intersection(rect) {
        if (this.intersects(rect)) {
            let left = Math.max(this.left, rect.left);
            let top = Math.max(this.top, rect.top);
            let right = Math.min(this.right, rect.right);
            let bottom = Math.min(this.bottom, rect.bottom);
            return new Rect(left, top, right - left, bottom - top);
        }
        return Rect.empty;
    }
    /**   @private  */
    Inflate(padding) {
        this.x -= padding;
        this.y -= padding;
        this.width += padding * 2;
        this.height += padding * 2;
        return this;
    }
    // public Inflate(size: Size): Rect {
    //    this.x -= size.Width;
    //    this.y -= size.Height;
    //    this.width += size.Width * 2;
    //    this.height += size.Height * 2;
    //    return this;
    // }
    // public inflate(width: number, height: number): void {
    //     this.x -= width;
    //     this.y -= height;
    //     this.width += width * 2;
    //     this.height += height * 2;
    // }
    /**   @private  */
    intersects(rect) {
        if (this.right < rect.left || this.left > rect.right || this.top > rect.bottom || this.bottom < rect.top) {
            return false;
        }
        return true;
    }
    /**   @private  */
    containsRect(rect) {
        return this.left <= rect.left && this.right >= rect.right && this.top <= rect.top && this.bottom >= rect.bottom;
    }
    /**   @private  */
    containsPoint(point, padding = 0) {
        return this.left - padding <= point.x && this.right + padding >= point.x
            && this.top - padding <= point.y && this.bottom + padding >= point.y;
    }
    toPoints() {
        let points = [];
        points.push(this.topLeft);
        points.push(this.topRight);
        points.push(this.bottomLeft);
        points.push(this.bottomRight);
        return points;
    }
    /**   @private  */
    static toBounds(points) {
        let rect = new Rect();
        for (let pt of points) {
            rect.unitePoint(pt);
        }
        return rect;
    }
    scale(scaleX, scaleY) {
        this.width *= scaleX;
        this.height *= scaleY;
    }
    offset(offsetX, offsetY) {
        this.x += offsetX;
        this.y += offsetY;
    }
}
/**   @private  */
Rect.empty = new Rect(Number.MAX_VALUE, Number.MIN_VALUE, 0, 0);

/**
 * Matrix module is used to transform points based on offsets, angle
 */
/** @private */
var MatrixTypes;
(function (MatrixTypes) {
    MatrixTypes[MatrixTypes["Identity"] = 0] = "Identity";
    MatrixTypes[MatrixTypes["Translation"] = 1] = "Translation";
    MatrixTypes[MatrixTypes["Scaling"] = 2] = "Scaling";
    MatrixTypes[MatrixTypes["Unknown"] = 4] = "Unknown";
})(MatrixTypes || (MatrixTypes = {}));
/** @private */
class Matrix {
    constructor(m11, m12, m21, m22, offsetX, offsetY, type) {
        this.m11 = m11;
        this.m12 = m12;
        this.m21 = m21;
        this.m22 = m22;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        // if (type === undefined) {
        //     this.type = MatrixTypes.Unknown;
        // } else {
        //     this.type = type;
        // }
        this.type = type;
    }
}
/** @private */
function identityMatrix() {
    return new Matrix(1, 0, 0, 1, 0, 0, MatrixTypes.Identity);
}
/** @private */
function transformPointByMatrix(matrix, point) {
    let pt = multiplyPoint(matrix, point.x, point.y);
    return { x: Math.round(pt.x * 100) / 100, y: Math.round(pt.y * 100) / 100 };
}
/** @private */
function transformPointsByMatrix(matrix, points) {
    let transformedPoints = [];
    for (let point of points) {
        transformedPoints.push(transformPointByMatrix(matrix, point));
    }
    return transformedPoints;
}
/** @private */
function rotateMatrix(matrix, angle, centerX, centerY) {
    angle %= 360.0;
    multiplyMatrix(matrix, createRotationRadians(angle * 0.017453292519943295, centerX ? centerX : 0, centerY ? centerY : 0));
}
/** @private */
function scaleMatrix(matrix, scaleX, scaleY, centerX = 0, centerY = 0) {
    multiplyMatrix(matrix, createScaling(scaleX, scaleY, centerX, centerY));
}
/** @private */
function translateMatrix(matrix, offsetX, offsetY) {
    if (matrix.type & MatrixTypes.Identity) {
        matrix.type = MatrixTypes.Translation;
        setMatrix(matrix, 1.0, 0.0, 0.0, 1.0, offsetX, offsetY);
        return;
    }
    if (matrix.type & MatrixTypes.Unknown) {
        matrix.offsetX += offsetX;
        matrix.offsetY += offsetY;
        return;
    }
    matrix.offsetX += offsetX;
    matrix.offsetY += offsetY;
    matrix.type |= MatrixTypes.Translation;
}
/** @private */
function createScaling(scaleX, scaleY, centerX, centerY) {
    let result = identityMatrix();
    result.type = !(centerX || centerY) ? MatrixTypes.Scaling : MatrixTypes.Scaling | MatrixTypes.Translation;
    setMatrix(result, scaleX, 0.0, 0.0, scaleY, centerX - scaleX * centerX, centerY - scaleY * centerY);
    return result;
}
/** @private */
function createRotationRadians(angle, centerX, centerY) {
    let result = identityMatrix();
    let num = Math.sin(angle);
    let num2 = Math.cos(angle);
    let offsetX = centerX * (1.0 - num2) + centerY * num;
    let offsetY = centerY * (1.0 - num2) - centerX * num;
    result.type = MatrixTypes.Unknown;
    setMatrix(result, num2, num, -num, num2, offsetX, offsetY);
    return result;
}
/** @private */
function multiplyPoint(matrix, x, y) {
    switch (matrix.type) {
        case MatrixTypes.Identity: break;
        case MatrixTypes.Translation:
            x += matrix.offsetX;
            y += matrix.offsetY;
            break;
        case MatrixTypes.Scaling:
            x *= matrix.m11;
            y *= matrix.m22;
            break;
        case MatrixTypes.Translation | MatrixTypes.Scaling:
            x *= matrix.m11;
            x += matrix.offsetX;
            y *= matrix.m22;
            y += matrix.offsetY;
            break;
        default:
            let num = y * matrix.m21 + matrix.offsetX;
            let num2 = x * matrix.m12 + matrix.offsetY;
            x *= matrix.m11;
            x += num;
            y *= matrix.m22;
            y += num2;
            break;
    }
    return { x: x, y: y };
}
/** @private */
function multiplyMatrix(matrix1, matrix2) {
    let type = matrix1.type;
    let type2 = matrix2.type;
    if (type2 === MatrixTypes.Identity) {
        return;
    }
    if (type === MatrixTypes.Identity) {
        assignMatrix(matrix1, matrix2);
        matrix1.type = matrix2.type;
        return;
    }
    if (type2 === MatrixTypes.Translation) {
        matrix1.offsetX += matrix2.offsetX;
        matrix1.offsetY += matrix2.offsetY;
        if (type !== MatrixTypes.Unknown) {
            matrix1.type |= MatrixTypes.Translation;
        }
        return;
    }
    if (type !== MatrixTypes.Translation) {
        let num = type << 4 | type2;
        switch (num) {
            case 34:
                matrix1.m11 *= matrix2.m11;
                matrix1.m22 *= matrix2.m22;
                return;
            case 35:
                matrix1.m11 *= matrix2.m11;
                matrix1.m22 *= matrix2.m22;
                matrix1.offsetX = matrix2.offsetX;
                matrix1.offsetY = matrix2.offsetY;
                matrix1.type = (MatrixTypes.Translation | MatrixTypes.Scaling);
                return;
            case 36: break;
            default:
                {
                    switch (num) {
                        case 50:
                            matrix1.m11 *= matrix2.m11;
                            matrix1.m22 *= matrix2.m22;
                            matrix1.offsetX *= matrix2.m11;
                            matrix1.offsetY *= matrix2.m22;
                            return;
                        case 51:
                            matrix1.m11 *= matrix2.m11;
                            matrix1.m22 *= matrix2.m22;
                            matrix1.offsetX = matrix2.m11 * matrix1.offsetX + matrix2.offsetX;
                            matrix1.offsetY = matrix2.m22 * matrix1.offsetY + matrix2.offsetY;
                            return;
                        case 52: break;
                        default:
                            switch (num) {
                                case 66:
                                case 67:
                                case 68: break;
                                default: return;
                            }
                            break;
                    }
                    break;
                }
        }
        let result = identityMatrix();
        let m11New = matrix1.m11 * matrix2.m11 + matrix1.m12 * matrix2.m21;
        let m12New = matrix1.m11 * matrix2.m12 + matrix1.m12 * matrix2.m22;
        let m21New = matrix1.m21 * matrix2.m11 + matrix1.m22 * matrix2.m21;
        let m22New = matrix1.m21 * matrix2.m12 + matrix1.m22 * matrix2.m22;
        let offsetX = matrix1.offsetX * matrix2.m11 + matrix1.offsetY * matrix2.m21 + matrix2.offsetX;
        let offsetY = matrix1.offsetX * matrix2.m12 + matrix1.offsetY * matrix2.m22 + matrix2.offsetY;
        setMatrix(result, m11New, m12New, m21New, m22New, offsetX, offsetY);
        if (result.m21 || result.m12) {
            result.type = MatrixTypes.Unknown;
        }
        else {
            if (result.m11 && result.m11 !== 1.0 || result.m22 && result.m22 !== 1.0) {
                result.type = MatrixTypes.Scaling;
            }
            if (result.offsetX || result.offsetY) {
                result.type |= MatrixTypes.Translation;
            }
            if ((result.type & (MatrixTypes.Translation | MatrixTypes.Scaling)) === MatrixTypes.Identity) {
                result.type = MatrixTypes.Identity;
            }
            result.type = MatrixTypes.Scaling | MatrixTypes.Translation;
        }
        assignMatrix(matrix1, result);
        matrix1.type = result.type;
        return;
    }
    let offsetX = matrix1.offsetX;
    let offsetY = matrix1.offsetY;
    matrix1.offsetX = offsetX * matrix2.m11 + offsetY * matrix2.m21 + matrix2.offsetX;
    matrix1.offsetY = offsetX * matrix2.m12 + offsetY * matrix2.m22 + matrix2.offsetY;
    if (type2 === MatrixTypes.Unknown) {
        matrix1.type = MatrixTypes.Unknown;
        return;
    }
    matrix1.type = (MatrixTypes.Translation | MatrixTypes.Scaling);
}
/** @private */
function setMatrix(mat, m11, m12, m21, m22, x, y) {
    mat.m11 = m11;
    mat.m12 = m12;
    mat.m21 = m21;
    mat.m22 = m22;
    mat.offsetX = x;
    mat.offsetY = y;
}
/** @private */
function assignMatrix(matrix1, matrix2) {
    matrix1.m11 = matrix2.m11;
    matrix1.m12 = matrix2.m12;
    matrix1.m21 = matrix2.m21;
    matrix1.m22 = matrix2.m22;
    matrix1.offsetX = matrix2.offsetX;
    matrix1.offsetY = matrix2.offsetY;
    matrix1.type = matrix2.type;
}

/**
 * Defines the functionalities that need to access DOM
 */
function getChildNode(node) {
    let child;
    let collection = [];
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        for (let i = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[i];
            if (child.nodeType === 1) {
                collection.push(child);
            }
        }
    }
    else {
        collection = node.children;
    }
    return collection;
}
function translatePoints(element, points) {
    let translatedPts = [];
    for (let point of points) {
        let pt1 = {
            x: element.offsetX - element.actualSize.width * element.pivot.x + point.x,
            y: element.offsetY - element.actualSize.height * element.pivot.y + point.y
        };
        let matrix;
        let angle = element.rotateAngle + element.parentTransform;
        if (angle) {
            matrix = identityMatrix();
            rotateMatrix(matrix, angle, element.offsetX, element.offsetY);
        }
        if (matrix) {
            pt1 = transformPointByMatrix(matrix, pt1);
        }
        translatedPts.push(pt1);
    }
    return translatedPts;
}
/** @private */
function measurePath(data) {
    let path = 'pathTable';
    if (!window[path]) {
        window[path] = {};
    }
    if (data) {
        let measureElement = 'measureElement';
        window[measureElement].style.visibility = 'visible';
        let svg = window[measureElement].children[2];
        let element = getChildNode(svg)[0];
        element.setAttribute('d', data);
        //let bounds: SVGRect = element.getBBox();
        let bounds;
        if (window[path][data]) {
            bounds = window[path][data];
        }
        else {
            window[path][data] = bounds = element.getBBox();
        }
        let svgBounds = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        window[measureElement].style.visibility = 'hidden';
        return svgBounds;
    }
    return new Rect(0, 0, 0, 0);
}
function getTextOptions(element, maxWidth) {
    let options = {
        fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
        pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
        dashArray: element.style.strokeDashArray, opacity: element.style.opacity,
        visible: element.visible, id: element.id,
        width: maxWidth || element.actualSize.width, height: element.actualSize.height,
        x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
        y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5
    };
    options.fontSize = element.style.fontSize;
    options.fontFamily = element.style.fontFamily;
    options.textOverflow = element.style.textOverflow;
    options.textDecoration = element.style.textDecoration;
    options.doWrap = element.doWrap;
    options.whiteSpace = whiteSpaceToString(element.style.whiteSpace, element.style.textWrapping);
    options.content = element.content;
    options.textWrapping = element.style.textWrapping;
    options.breakWord = wordBreakToString(element.style.textWrapping);
    options.textAlign = textAlignToString(element.style.textAlign);
    options.color = element.style.color;
    options.italic = element.style.italic;
    options.bold = element.style.bold;
    options.dashArray = '';
    options.strokeWidth = 0;
    options.fill = '';
    return options;
}
function wrapSvgText(text, textValue) {
    let childNodes = [];
    let k = 0;
    let txtValue;
    let bounds1;
    let content = textValue || text.content;
    if (text.whiteSpace !== 'nowrap' && text.whiteSpace !== 'pre') {
        if (text.breakWord === 'breakall') {
            txtValue = '';
            txtValue += content[0];
            for (k = 0; k < content.length; k++) {
                bounds1 = bBoxText(txtValue, text);
                if (bounds1 >= text.width && txtValue.length > 0) {
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
                    txtValue = '';
                }
                else {
                    txtValue = txtValue + (content[k + 1] || '');
                    if (txtValue.indexOf('\n') > -1) {
                        txtValue = txtValue.replace('\n', '');
                    }
                    let width = bBoxText(txtValue, text);
                    if (Math.ceil(width) + 2 >= text.width && txtValue.length > 0) {
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                    if (k === content.length - 1 && txtValue.length > 0) {
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                }
            }
        }
        else {
            childNodes = wordWrapping(text, textValue);
        }
    }
    else {
        childNodes[childNodes.length] = { text: content, x: 0, dy: 0, width: bBoxText(content, text) };
    }
    return childNodes;
}
function wordWrapping(text, textValue) {
    let childNodes = [];
    let txtValue = '';
    let j = 0;
    let i = 0;
    let wrap = text.whiteSpace !== 'nowrap' ? true : false;
    let content = textValue || text.content;
    let eachLine = content.split('\n');
    let words;
    let newText;
    let existingWidth;
    let existingText;
    for (j = 0; j < eachLine.length; j++) {
        words = text.textWrapping !== 'NoWrap' ? eachLine[j].split(' ') : eachLine;
        for (i = 0; i < words.length; i++) {
            txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[i];
            newText = txtValue + (words[i + 1] || '');
            let width = bBoxText(newText, text);
            if (Math.floor(width) > text.width - 2 && txtValue.length > 0) {
                childNodes[childNodes.length] = {
                    text: txtValue, x: 0, dy: 0,
                    width: newText === txtValue ? width : (txtValue === existingText) ? existingWidth : bBoxText(txtValue, text)
                };
                txtValue = '';
            }
            else {
                if (i === words.length - 1) {
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                    txtValue = '';
                }
            }
            existingText = newText;
            existingWidth = width;
        }
    }
    return childNodes;
}
function wrapSvgTextAlign(text, childNodes) {
    let wrapBounds = { x: 0, width: 0 };
    let k = 0;
    let txtWidth;
    let width;
    for (k = 0; k < childNodes.length; k++) {
        txtWidth = childNodes[k].width;
        width = txtWidth;
        if (text.textAlign === 'left') {
            txtWidth = 0;
        }
        else if (text.textAlign === 'center') {
            if (txtWidth > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                txtWidth = 0;
            }
            else {
                txtWidth = -txtWidth / 2;
            }
        }
        else if (text.textAlign === 'right') {
            txtWidth = -txtWidth;
        }
        else {
            txtWidth = childNodes.length > 1 ? 0 : -txtWidth / 2;
        }
        childNodes[k].dy = text.fontSize * 1.2;
        childNodes[k].x = txtWidth;
        if (!wrapBounds) {
            wrapBounds = {
                x: txtWidth,
                width: width
            };
        }
        else {
            wrapBounds.x = Math.min(wrapBounds.x, txtWidth);
            wrapBounds.width = Math.max(wrapBounds.width, width);
        }
    }
    return wrapBounds;
}
/** @private */
function measureText(text, style, content, maxWidth, textValue) {
    let bounds = new Size(0, 0);
    let childNodes;
    let wrapBounds;
    let options = getTextOptions(text, maxWidth);
    text.childNodes = childNodes = wrapSvgText(options, textValue);
    text.wrapBounds = wrapBounds = wrapSvgTextAlign(options, childNodes);
    bounds.width = wrapBounds.width;
    if (text.wrapBounds.width >= maxWidth && options.textOverflow !== 'Wrap') {
        bounds.width = maxWidth;
    }
    bounds.height = childNodes.length * text.style.fontSize * 1.2;
    return bounds;
}
/** @private */
function getDiagramElement(elementId, contentId) {
    let diagramElement;
    let element;
    if (contentId) {
        element = document.getElementById(contentId);
    }
    diagramElement = (element) ? element.querySelector('#' + elementId) : document.getElementById(elementId);
    return diagramElement;
}
/** @private */
function createHtmlElement(elementType, attribute) {
    let element = createElement(elementType);
    setAttributeHtml(element, attribute);
    return element;
}
/** @private */
function setAttributeHtml(element, attributes) {
    let keys = Object.keys(attributes);
    for (let i = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
}
/**
 * @private
 */
function getAdornerLayerSvg(diagramId, index) {
    let adornerLayerSvg = null;
    let diagramElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
    let elementcoll;
    if (diagramElement) {
        elementcoll = diagramElement.getElementsByClassName('e-adorner-layer' + index);
        adornerLayerSvg = elementcoll[0];
    }
    return adornerLayerSvg;
}
/** @private */
function getSelectorElement(diagramId, index) {
    let adornerLayer = null;
    let adornerSvg = getAdornerLayerSvg(diagramId, index);
    if (adornerSvg) {
        adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement');
    }
    return adornerLayer;
}
/** @private */
function createMeasureElements() {
    let measureElement = 'measureElement';
    if (!window[measureElement]) {
        let divElement = createHtmlElement('div', {
            id: 'measureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        let text = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        let imageElement;
        imageElement = createHtmlElement('img', {});
        divElement.appendChild(imageElement);
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        divElement.appendChild(svg);
        let element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(element);
        let data = document.createTextNode('');
        let tSpan = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        svg.appendChild(tSpan);
        window[measureElement] = divElement;
        window[measureElement].usageCount = 1;
        document.body.appendChild(divElement);
    }
    else {
        window[measureElement].usageCount += 1;
    }
}
/** @private */
function measureImage(source, contentSize) {
    let measureElement = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    let imageElement = window[measureElement].children[1];
    imageElement.setAttribute('src', source);
    let bounds = imageElement.getBoundingClientRect();
    let width = bounds.width;
    let height = bounds.height;
    contentSize = new Size(width, height);
    window[measureElement].style.visibility = 'hidden';
    return contentSize;
}

/**
 * Implements the basic functionalities
 */
/** @private */
function randomId() {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let id = '';
    let num;
    for (let i = 0; i < 5; i++) {
        if ('crypto' in window && 'getRandomValues' in crypto) {
            let count = new Uint16Array(1);
            // tslint:disable-next-line:no-any
            let intCrypto = window.msCrypto || window.crypto;
            num = intCrypto.getRandomValues(count)[0] % (chars.length - 1);
        }
        else {
            num = Math.floor(Math.random() * chars.length);
        }
        if (i === 0 && num < 10) {
            i--;
            continue;
        }
        id += chars.substring(num, num + 1);
    }
    return id;
}
/** @private */
function cornersPointsBeforeRotation(ele) {
    let bounds = new Rect();
    let top = ele.offsetY - ele.actualSize.height * ele.pivot.y;
    let bottom = ele.offsetY + ele.actualSize.height * (1 - ele.pivot.y);
    let left = ele.offsetX - ele.actualSize.width * ele.pivot.x;
    let right = ele.offsetX + ele.actualSize.width * (1 - ele.pivot.x);
    let topLeft = { x: left, y: top };
    let topRight = { x: right, y: top };
    let bottomLeft = { x: left, y: bottom };
    let bottomRight = { x: right, y: bottom };
    bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    return bounds;
}
/** @private */
function rotateSize(size, angle) {
    let matrix = identityMatrix();
    rotateMatrix(matrix, angle, 0, 0);
    let topLeft = transformPointByMatrix(matrix, { x: 0, y: 0 });
    let topRight = transformPointByMatrix(matrix, { x: size.width, y: 0 });
    let bottomLeft = transformPointByMatrix(matrix, { x: 0, y: size.height });
    let bottomRight = transformPointByMatrix(matrix, { x: size.width, y: size.height });
    let minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    let minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    let maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    let maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    return new Size(maxX - minX, maxY - minY);
}
/** @private */
function getBounds(element) {
    let bounds = new Rect();
    let corners;
    corners = cornersPointsBeforeRotation(element);
    let middleLeft = corners.middleLeft;
    let topCenter = corners.topCenter;
    let bottomCenter = corners.bottomCenter;
    let middleRight = corners.middleRight;
    let topLeft = corners.topLeft;
    let topRight = corners.topRight;
    let bottomLeft = corners.bottomLeft;
    let bottomRight = corners.bottomRight;
    element.corners = {
        topLeft: topLeft, topCenter: topCenter, topRight: topRight, middleLeft: middleLeft,
        middleRight: middleRight, bottomLeft: bottomLeft, bottomCenter: bottomCenter, bottomRight: bottomRight
    };
    if (element.rotateAngle !== 0 || element.parentTransform !== 0) {
        let matrix = identityMatrix();
        rotateMatrix(matrix, element.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
        element.corners.topLeft = topLeft = transformPointByMatrix(matrix, topLeft);
        element.corners.topCenter = topCenter = transformPointByMatrix(matrix, topCenter);
        element.corners.topRight = topRight = transformPointByMatrix(matrix, topRight);
        element.corners.middleLeft = middleLeft = transformPointByMatrix(matrix, middleLeft);
        element.corners.middleRight = middleRight = transformPointByMatrix(matrix, middleRight);
        element.corners.bottomLeft = bottomLeft = transformPointByMatrix(matrix, bottomLeft);
        element.corners.bottomCenter = bottomCenter = transformPointByMatrix(matrix, bottomCenter);
        element.corners.bottomRight = bottomRight = transformPointByMatrix(matrix, bottomRight);
        //Set corners based on rotate angle
    }
    bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    element.corners.left = bounds.left;
    element.corners.right = bounds.right;
    element.corners.top = bounds.top;
    element.corners.bottom = bounds.bottom;
    element.corners.center = bounds.center;
    element.corners.width = bounds.width;
    element.corners.height = bounds.height;
    return bounds;
}
/** @private */
function textAlignToString(value) {
    let state = '';
    switch (value) {
        case 'Center':
            state = 'center';
            break;
        case 'Left':
            state = 'left';
            break;
        case 'Right':
            state = 'right';
            break;
    }
    return state;
}
/** @private */
function wordBreakToString(value) {
    let state = '';
    switch (value) {
        case 'Wrap':
            state = 'breakall';
            break;
        case 'NoWrap':
            state = 'keepall';
            break;
        case 'WrapWithOverflow':
            state = 'normal';
            break;
        case 'LineThrough':
            state = 'line-through';
            break;
    }
    return state;
}
function bBoxText(textContent, options) {
    let measureElement = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    let svg = window[measureElement].children[2];
    let text = getChildNode(svg)[1];
    text.textContent = textContent;
    text.setAttribute('style', 'font-size:' + options.fontSize + 'px; font-family:'
        + options.fontFamily + ';font-weight:' + (options.bold ? 'bold' : 'normal'));
    let bBox = text.getBBox().width;
    window[measureElement].style.visibility = 'hidden';
    return bBox;
}
/** @private */
function middleElement(i, j) {
    let m = 0;
    m = (i + j) / 2;
    return m;
}
/** @private */
function whiteSpaceToString(value, wrap) {
    if (wrap === 'NoWrap' && value === 'PreserveAll') {
        return 'pre';
    }
    let state = '';
    switch (value) {
        case 'CollapseAll':
            state = 'nowrap';
            break;
        case 'CollapseSpace':
            state = 'pre-line';
            break;
        case 'PreserveAll':
            state = 'pre-wrap';
            break;
    }
    return state;
}
/** @private */
function rotatePoint(angle, pivotX, pivotY, point) {
    if (angle !== 0) {
        let matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivotX, pivotY);
        return transformPointByMatrix(matrix, point);
    }
    return point;
}
/** @private */
function getOffset(topLeft, obj) {
    let offX = topLeft.x + obj.desiredSize.width * obj.pivot.x;
    let offY = topLeft.y + obj.desiredSize.height * obj.pivot.y;
    return {
        x: offX, y: offY
    };
}

/**
 * DiagramElement module defines the basic unit of diagram
 */
class DrawingElement {
    constructor() {
        /**
         * Sets/Gets the reference point of the element
         * ```html
         * <div id='diagram'></div>
         * ```
         * ```typescript
         * let stackPanel: StackPanel = new StackPanel();
         * stackPanel.offsetX = 300; stackPanel.offsetY = 200;
         * stackPanel.width = 100; stackPanel.height = 100;
         * stackPanel.style.fill = 'red';
         * stackPanel.pivot = { x: 0.5, y: 0.5 };
         * let diagram: Diagram = new Diagram({
         * ...
         * basicElements: [stackPanel],
         * ...
         * });
         * diagram.appendTo('#diagram');
         * ```
         */
        this.pivot = { x: 0.5, y: 0.5 };
        this.rotateValue = { x: 0, y: 0, angle: 0 };
        /**
         * Sets or gets whether the content of the element needs to be measured
         */
        this.isDirt = true;
        /**
         * Sets/Gets the x-coordinate of the element
         */
        this.offsetX = 0;
        /**
         * Sets/Gets the y-coordinate of the element
         */
        this.offsetY = 0;
        /**
         * Set the corner of the element
         */
        this.cornerRadius = 0;
        /**
         * Sets/Gets the minimum height of the element
         */
        this.minHeight = undefined;
        /**
         * Sets/Gets the minimum width of the element
         */
        this.minWidth = undefined;
        /**
         * Sets/Gets the maximum width of the element
         */
        this.maxWidth = undefined;
        /**
         * Sets/Gets the maximum height of the element
         */
        this.maxHeight = undefined;
        /**
         * Sets/Gets the width of the element
         */
        this.width = undefined;
        /**
         * Sets/Gets the height of the element
         */
        this.height = undefined;
        /**
         * Sets/Gets how the element has to be horizontally arranged with respect to its immediate parent
         * * Stretch - Stretches the diagram element throughout its immediate parent
         * * Left - Aligns the diagram element at the left of its immediate parent
         * * Right - Aligns the diagram element at the right of its immediate parent
         * * Center - Aligns the diagram element at the center of its immediate parent
         * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
         */
        this.horizontalAlignment = 'Auto';
        /**
         * Sets/Gets how the element has to be vertically arranged with respect to its immediate parent
         * * Stretch - Stretches the diagram element throughout its immediate parent
         * * Top - Aligns the diagram element at the top of its immediate parent
         * * Bottom - Aligns the diagram element at the bottom of its immediate parent
         * * Center - Aligns the diagram element at the center of its immediate parent
         * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
         */
        this.verticalAlignment = 'Auto';
        /**
         * Sets or gets whether the content of the element to be visible
         */
        this.visible = true;
        /**
         * Sets/Gets the rotate angle of the element
         */
        this.rotateAngle = 0;
        /**
         * Sets/Gets the margin of the element
         */
        this.margin = { left: 0, right: 0, top: 0, bottom: 0 };
        /**
         * Sets whether the element has to be aligned with respect to a point/with respect to its immediate parent
         * * Point - Diagram elements will be aligned with respect to a point
         * * Object - Diagram elements will be aligned with respect to its immediate parent
         */
        this.relativeMode = 'Point';
        /**
         * Sets whether the element has to be transformed based on its parent or not
         * * Self - Sets the transform type as Self
         * * Parent - Sets the transform type as Parent
         */
        /** @private */
        this.transform = RotateTransform.Self | RotateTransform.Parent;
        /**
         * Sets the style of the element
         */
        this.style = { fill: 'white', strokeColor: 'black', opacity: 1, strokeWidth: 1 };
        /**
         * Gets the minimum size that is required by the element
         */
        this.desiredSize = new Size();
        /**
         * Gets the size that the element will be rendered
         */
        this.actualSize = new Size();
        /**
         * Gets the rotate angle that is set to the immediate parent of the element
         */
        this.parentTransform = 0;
        /** @private */
        this.preventContainer = false;
        /**
         * Gets/Sets the boundary of the element
         */
        this.bounds = new Rect(0, 0, 0, 0);
        /**
         * Defines whether the element has to be measured or not
         */
        this.staticSize = false;
        /**
         * check whether the element is rect or not
         */
        /** @private */
        this.isRectElement = false;
        /** @private */
        this.isCalculateDesiredSize = true;
        /**
         * Defines whether the element is group or port
         */
        /** @private */
        this.elementActions = ElementAction.None;
        //private variables
        this.position = undefined;
        this.unitMode = undefined;
        /**   @private  */
        this.float = false;
        this.floatingBounds = undefined;
    }
    // public constructor() {
    //     this.id = randomId();
    // }
    /**
     * Sets the offset of the element with respect to its parent
     * @param x
     * @param y
     * @param mode
     */
    setOffsetWithRespectToBounds(x, y, mode) {
        this.unitMode = mode;
        this.position = { x: x, y: y };
    }
    /**
     * Gets the position of the element with respect to its parent
     * @param size
     */
    getAbsolutePosition(size) {
        if (this.position !== undefined) {
            if (this.unitMode === 'Absolute') {
                return this.position;
            }
            else {
                return {
                    x: this.position.x * size.width, y: this.position.y * size.height
                };
            }
        }
        return undefined;
    }
    get outerBounds() {
        return this.floatingBounds || this.bounds;
    }
    /**
     * used to set the outer bounds value
     * @private
     */
    set outerBounds(bounds) {
        this.floatingBounds = bounds;
    }
    /**
     * Measures the minimum space that the element requires
     * @param availableSize
     */
    measure(availableSize) {
        let width = this.width !== undefined ? this.width : (availableSize.width || 0) - this.margin.left - this.margin.right;
        let height = this.height !== undefined ? this.height : (availableSize.height || 0) - this.margin.top - this.margin.bottom;
        this.desiredSize = new Size(width, height);
        if (this.isCalculateDesiredSize) {
            this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        }
        return this.desiredSize;
    }
    /**
     * Arranges the element
     * @param desiredSize
     */
    arrange(desiredSize) {
        this.actualSize = desiredSize;
        this.updateBounds();
        return this.actualSize;
    }
    /**
     * Updates the bounds of the element
     */
    updateBounds() {
        this.bounds = getBounds(this);
    }
    /**
     * Validates the size of the element with respect to its minimum and maximum size
     * @param desiredSize
     * @param availableSize
     */
    validateDesiredSize(desiredSize, availableSize) {
        //Empty canvas
        if (this.isRectElement && !this.width && !this.minWidth && !this.maxWidth) {
            desiredSize.width = 50;
        }
        if (this.isRectElement && !this.height && !this.minHeight && !this.maxHeight) {
            desiredSize.height = 50;
        }
        if (desiredSize === undefined || this.width !== undefined &&
            this.height !== undefined) {
            desiredSize = desiredSize || new Size();
            desiredSize.width = this.width === undefined ? (availableSize.width || 0)
                - this.margin.left - this.margin.right : this.width;
            desiredSize.height = this.height === undefined ? (availableSize.height || 0)
                - this.margin.top - this.margin.bottom : this.height;
        }
        //Considering min values
        if (this.minWidth !== undefined) {
            desiredSize.width = Math.max(desiredSize.width, this.minWidth);
        }
        if (this.minHeight !== undefined) {
            desiredSize.height = Math.max(desiredSize.height, this.minHeight);
        }
        //Considering max values
        if (this.maxWidth !== undefined) {
            desiredSize.width = Math.min(desiredSize.width, this.maxWidth);
        }
        if (this.maxHeight !== undefined) {
            desiredSize.height = Math.min(desiredSize.height, this.maxHeight);
        }
        return desiredSize;
    }
}

/**
 * Container module is used to group related objects
 */
class Container extends DrawingElement {
    constructor() {
        super(...arguments);
        //private members    
        this.desiredBounds = undefined;
        /** @private */
        this.measureChildren = true;
        /**   @private  */
        this.prevRotateAngle = 0;
    }
    /**
     * returns whether the container has child elements or not
     */
    hasChildren() {
        if (this.children !== undefined && this.children.length > 0) {
            return true;
        }
        return false;
    }
    /**
     * Measures the minimum space that the container requires
     *
     * @param availableSize
     */
    measure(availableSize) {
        // measure the element and find the desired size
        this.desiredBounds = undefined;
        let desired = undefined;
        let child;
        let childBounds;
        if (this.hasChildren()) {
            //Measuring the children
            for (let i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (child.horizontalAlignment === 'Stretch' && !availableSize.width) {
                    availableSize.width = child.bounds.width;
                }
                if (child.verticalAlignment === 'Stretch' && !availableSize.height) {
                    availableSize.height = child.bounds.height;
                }
                let force = child.horizontalAlignment === 'Stretch' || child.verticalAlignment === 'Stretch';
                if (this.measureChildren || force || (child instanceof Container && child.measureChildren !== undefined)) {
                    child.measure(availableSize);
                }
                childBounds = this.GetChildrenBounds(child);
                if (child.horizontalAlignment !== 'Stretch' && child.verticalAlignment !== 'Stretch') {
                    if (this.desiredBounds === undefined) {
                        this.desiredBounds = childBounds;
                    }
                    else {
                        this.desiredBounds.uniteRect(childBounds);
                    }
                }
                else if (this.actualSize && !this.actualSize.width && !this.actualSize.height &&
                    !child.preventContainer && child.horizontalAlignment === 'Stretch' && child.verticalAlignment === 'Stretch') {
                    if (this.desiredBounds === undefined) {
                        this.desiredBounds = child.bounds;
                    }
                    else {
                        this.desiredBounds.uniteRect(child.bounds);
                    }
                }
            }
            if (this.desiredBounds !== undefined && this.rotateAngle !== 0) {
                let offsetPt = {
                    x: this.desiredBounds.x + this.desiredBounds.width * this.pivot.x,
                    y: this.desiredBounds.y + this.desiredBounds.height * this.pivot.y
                };
                let newPoint = rotatePoint(this.rotateAngle, undefined, undefined, offsetPt);
                this.desiredBounds.x = newPoint.x - this.desiredBounds.width * this.pivot.x;
                this.desiredBounds.y = newPoint.y - this.desiredBounds.height * this.pivot.y;
            }
            if (this.desiredBounds) {
                desired = new Size(this.desiredBounds.width, this.desiredBounds.height);
            }
        }
        desired = this.validateDesiredSize(desired, availableSize);
        this.stretchChildren(desired);
        this.desiredSize = desired;
        return desired;
    }
    /**
     * Arranges the container and its children
     * @param desiredSize
     */
    arrange(desiredSize) {
        let child;
        let childBounds = this.desiredBounds;
        if (childBounds) {
            let x = this.offsetX;
            let y = this.offsetY;
            this.offsetX = childBounds.x + childBounds.width * this.pivot.x;
            this.offsetY = childBounds.y + childBounds.height * this.pivot.y;
            // container has rotateAngle
            if (this.hasChildren()) {
                //Measuring the children
                for (let i = 0; i < this.children.length; i++) {
                    child = this.children[i];
                    let arrange = false;
                    if (child.horizontalAlignment === 'Stretch') {
                        child.offsetX = this.offsetX;
                        child.parentTransform = this.parentTransform + this.rotateAngle;
                        arrange = true;
                    }
                    if (child.verticalAlignment === 'Stretch') {
                        child.offsetY = this.offsetY;
                        child.parentTransform = this.parentTransform + this.rotateAngle;
                        arrange = true;
                    }
                    if (arrange || this.measureChildren || (child instanceof Container && child.measureChildren !== undefined)) {
                        child.arrange(child.desiredSize);
                    }
                }
            }
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        this.prevRotateAngle = this.rotateAngle;
        return desiredSize;
    }
    //protected methods
    /**
     * Stretches the child elements based on the size of the container
     * @param size
     */
    stretchChildren(size) {
        if (this.hasChildren()) {
            for (let child of this.children) {
                if (child.horizontalAlignment === 'Stretch' || child.desiredSize.width === undefined) {
                    child.desiredSize.width = size.width - child.margin.left - child.margin.right;
                }
                if (child.verticalAlignment === 'Stretch' || child.desiredSize.height === undefined) {
                    child.desiredSize.height = size.height - child.margin.top - child.margin.bottom;
                }
                if (child instanceof Container) {
                    child.stretchChildren(child.desiredSize);
                }
            }
        }
    }
    /**
     * Finds the offset of the child element with respect to the container
     * @param child
     * @param center
     */
    findChildOffsetFromCenter(child, center) {
        let topLeft = { x: center.x - child.desiredSize.width / 2, y: center.y - child.desiredSize.height / 2 };
        let offset = getOffset(topLeft, child);
        //Rotate based on child rotate angle
        offset = rotatePoint(child.rotateAngle, center.x, center.y, offset);
        //Rotate based on parent pivot
        offset = rotatePoint(this.rotateAngle + this.parentTransform, this.offsetX, this.offsetY, offset);
        child.offsetX = offset.x;
        child.offsetY = offset.y;
    }
    //private methods - check its need
    GetChildrenBounds(child) {
        let childSize;
        childSize = child.desiredSize.clone();
        let diffAngle = child.rotateAngle - this.rotateAngle;
        let refPoint = { x: child.offsetX, y: child.offsetY };
        let left = refPoint.x - childSize.width * child.pivot.x;
        let top = refPoint.y - childSize.height * child.pivot.y;
        let right = left + childSize.width;
        let bottom = top + childSize.height;
        let topLeft = { x: left, y: top };
        let topRight = { x: right, y: top };
        let bottomLeft = { x: left, y: bottom };
        let bottomRight = { x: right, y: bottom };
        topLeft = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, topLeft);
        topRight = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, topRight);
        bottomLeft = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, bottomLeft);
        bottomRight = rotatePoint(child.rotateAngle, child.offsetX, child.offsetY, bottomRight);
        if (this.rotateAngle !== 0) {
            topLeft = rotatePoint(-this.rotateAngle, undefined, undefined, topLeft);
            topRight = rotatePoint(-this.rotateAngle, undefined, undefined, topRight);
            bottomLeft = rotatePoint(-this.rotateAngle, undefined, undefined, bottomLeft);
            bottomRight = rotatePoint(-this.rotateAngle, undefined, undefined, bottomRight);
        }
        return Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    }
}

/**
 * TextElement is used to display text/annotations
 */
class TextElement extends DrawingElement {
    /**
     * set the id for each element
     */
    constructor() {
        super();
        /**
         * sets or gets the image source
         */
        this.textContent = '';
        /** @private */
        this.canMeasure = true;
        /** @private */
        this.canConsiderBounds = true;
        /** @private */
        this.doWrap = true;
        this.textNodes = [];
        /**
         * Defines the appearance of the text element
         */
        this.style = {
            color: 'black', fill: 'transparent', strokeColor: 'black',
            strokeWidth: 1, fontFamily: 'Arial', fontSize: 12, whiteSpace: 'CollapseSpace',
            textWrapping: 'WrapWithOverflow', textAlign: 'Center', italic: false, bold: false,
            textDecoration: 'None', strokeDashArray: '', opacity: 1,
            textOverflow: 'Wrap'
        };
        this.style.fill = 'transparent';
        this.style.strokeColor = 'transparent';
    }
    /**
     * gets the content for the text element
     */
    get content() {
        return this.textContent;
    }
    /**
     * sets the content for the text element
     */
    set content(value) {
        if (this.textContent !== value) {
            this.textContent = value;
            this.isDirt = true;
            this.doWrap = true;
        }
    }
    /**
     * sets the content for the text element
     */
    get childNodes() {
        return this.textNodes;
    }
    /**
     * gets the content for the text element
     */
    set childNodes(value) {
        this.textNodes = value;
    }
    /**
     * gets the wrapBounds for the text
     */
    get wrapBounds() {
        return this.textWrapBounds;
    }
    /**
     * sets the wrapBounds for the text
     */
    set wrapBounds(value) {
        this.textWrapBounds = value;
    }
    /** @private */
    refreshTextElement() {
        this.isDirt = true;
    }
    /**
     * Measures the minimum size that is required for the text element
     * @param availableSize
     */
    measure(availableSize) {
        let size;
        if (this.isDirt && this.canMeasure) {
            size = measureText(this, this.style, this.content, this.width || availableSize.width);
        }
        else {
            size = this.desiredSize;
        }
        if (this.width === undefined || this.height === undefined) {
            this.desiredSize = new Size(size.width, size.height);
        }
        else {
            this.desiredSize = new Size(this.width, this.height);
        }
        this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        return this.desiredSize;
    }
    /**
     * Arranges the text element
     * @param desiredSize
     */
    arrange(desiredSize) {
        if (desiredSize.width !== this.actualSize.width || desiredSize.height !== this.actualSize.height || this.isDirt) {
            this.doWrap = true;
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        this.isDirt = false;
        return this.actualSize;
    }
}

/**
 * Canvas module is used to define a plane(canvas) and to arrange the children based on margin
 */
class Canvas extends Container {
    constructor() {
        super(...arguments);
        /**
         * Not applicable for canvas
         *  @private
         */
        this.measureChildren = undefined;
    }
    /**
     * Measures the minimum space that the canvas requires
     * @param availableSize
     */
    measure(availableSize) {
        let desired = undefined;
        let desiredBounds = undefined;
        if (this.hasChildren()) {
            //Measuring the children
            for (let child of this.children) {
                if (child instanceof TextElement) {
                    if (child.canMeasure) {
                        availableSize.width = availableSize.width || this.maxWidth || this.minWidth;
                        child.measure(availableSize);
                    }
                    else {
                        break;
                    }
                }
                else if (!(child instanceof TextElement)) {
                    child.measure(availableSize);
                }
                let childSize = child.desiredSize.clone();
                if (child.rotateAngle !== 0) {
                    childSize = rotateSize(childSize, child.rotateAngle);
                }
                let right = childSize.width + child.margin.right;
                let bottom = childSize.height + child.margin.bottom;
                let childBounds = new Rect(child.margin.left, child.margin.top, right, bottom);
                if (child.float) {
                    let position = child.getAbsolutePosition(childSize);
                    if (position !== undefined) {
                        continue;
                    }
                }
                if ((!(child instanceof TextElement)) || (child instanceof TextElement && child.canConsiderBounds)) {
                    if (desiredBounds === undefined) {
                        desiredBounds = childBounds;
                    }
                    else {
                        desiredBounds.uniteRect(childBounds);
                    }
                }
            }
            if (desiredBounds) {
                let leftMargin = 0;
                let topMargin = 0;
                leftMargin = Math.max(desiredBounds.left, 0);
                topMargin = Math.max(desiredBounds.top, 0);
                desired = new Size(desiredBounds.width + leftMargin, desiredBounds.height + topMargin);
            }
        }
        desired = super.validateDesiredSize(desired, availableSize);
        super.stretchChildren(desired);
        this.desiredSize = desired;
        return desired;
    }
    /**
     * Arranges the child elements of the canvas
     */
    arrange(desiredSize) {
        this.outerBounds = new Rect();
        if (this.hasChildren()) {
            let y;
            let x;
            y = this.offsetY - desiredSize.height * this.pivot.y;
            x = this.offsetX - desiredSize.width * this.pivot.x;
            for (let child of this.children) {
                if ((child.transform & RotateTransform.Parent) !== 0) {
                    child.parentTransform = this.parentTransform + this.rotateAngle;
                    let childSize = child.desiredSize.clone();
                    let topLeft;
                    let center = { x: 0, y: 0 };
                    let childX = x;
                    let childY = y;
                    if (child.relativeMode === 'Point') {
                        let position = child.getAbsolutePosition(desiredSize);
                        if (position !== undefined) {
                            childX += position.x;
                            childY += position.y;
                        }
                    }
                    if (child.relativeMode === 'Object') {
                        topLeft = this.alignChildBasedOnParent(child, childSize, desiredSize, childX, childY);
                    }
                    else {
                        topLeft = this.alignChildBasedOnaPoint(child, childX, childY);
                    }
                    center = { x: topLeft.x + childSize.width / 2, y: topLeft.y + childSize.height / 2 };
                    if (child.rotateValue) {
                        let rotateValue = {
                            x: this.offsetX + (child.rotateValue.x || 0),
                            y: this.offsetY + (child.rotateValue.y || 0)
                        };
                        let centerPoint = { x: this.offsetX, y: this.offsetY };
                        let angle = child.rotateValue.angle | 0;
                        let matrix = identityMatrix();
                        rotateMatrix(matrix, angle, centerPoint.x, centerPoint.y);
                        center = transformPointByMatrix(matrix, rotateValue);
                    }
                    super.findChildOffsetFromCenter(child, center);
                }
                if ((child.horizontalAlignment === 'Stretch' || child.verticalAlignment === 'Stretch')) {
                    child.arrange(desiredSize);
                }
                else {
                    if (child instanceof TextElement && child.canMeasure) {
                        child.arrange(child.desiredSize);
                        this.outerBounds.uniteRect(child.outerBounds);
                    }
                    else if (!(child instanceof TextElement)) {
                        child.arrange(child.desiredSize);
                        this.outerBounds.uniteRect(child.outerBounds);
                    }
                }
            }
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        this.outerBounds.uniteRect(this.bounds);
        return desiredSize;
    }
    /**
     * Aligns the child element based on its parent
     * @param child
     * @param childSize
     * @param parentSize
     * @param x
     * @param y
     */
    alignChildBasedOnParent(child, childSize, parentSize, x, y) {
        switch (child.horizontalAlignment) {
            case 'Auto':
            case 'Left':
                x += child.margin.left;
                break;
            case 'Right':
                x += parentSize.width - childSize.width - child.margin.right;
                break;
            case 'Stretch':
            case 'Center':
                x += parentSize.width / 2 - childSize.width / 2;
                break;
        }
        switch (child.verticalAlignment) {
            case 'Auto':
            case 'Top':
                y += child.margin.top;
                break;
            case 'Bottom':
                y += parentSize.height - childSize.height - child.margin.bottom;
                break;
            case 'Stretch':
            case 'Center':
                y += parentSize.height / 2 - childSize.height / 2;
                break;
        }
        return { x: x, y: y };
    }
    /**
     * Aligns the child elements based on a point
     * @param child
     * @param x
     * @param y
     */
    alignChildBasedOnaPoint(child, x, y) {
        x += child.margin.left - child.margin.right;
        y += child.margin.top - child.margin.bottom;
        switch (child.horizontalAlignment) {
            case 'Auto':
            case 'Left':
                x = x;
                break;
            case 'Stretch':
            case 'Center':
                x -= child.desiredSize.width * child.pivot.x;
                break;
            case 'Right':
                x -= child.desiredSize.width;
                break;
        }
        switch (child.verticalAlignment) {
            case 'Auto':
            case 'Top':
                y = y;
                break;
            case 'Stretch':
            case 'Center':
                y -= child.desiredSize.height * child.pivot.y;
                break;
            case 'Bottom':
                y -= child.desiredSize.height;
                break;
        }
        return { x: x, y: y };
    }
}

/**
 * Diagram component exported items
 */

/**
 * ImageElement defines a basic image elements
 */
class ImageElement extends DrawingElement {
    /**
     * set the id for each element
     */
    constructor() {
        super();
        /**
         * sets or gets the image source
         */
        this.imageSource = '';
        /**
         * sets scaling factor of the image
         */
        this.imageScale = 'None';
        /**
         * sets the alignment of the image
         */
        this.imageAlign = 'None';
        /**
         * Sets how to stretch the image
         */
        this.stretch = 'Stretch';
    }
    /**
     * Gets the source for the image element
     */
    get source() {
        return this.imageSource;
    }
    /**
     * Sets the source for the image element
     */
    set source(value) {
        this.imageSource = value;
        this.isDirt = true;
    }
    /**
     * Measures minimum space that is required to render the image
     * @param availableSize
     */
    measure(availableSize) {
        if (this.isDirt && (this.stretch !== 'Stretch' || this.width === undefined && this.height === undefined)) {
            this.contentSize = measureImage(this.source, this.contentSize);
            this.isDirt = false;
        }
        if (this.width !== undefined && this.height !== undefined) {
            this.desiredSize = new Size(this.width, this.height);
            this.contentSize = this.desiredSize;
        }
        else {
            this.desiredSize = this.contentSize;
        }
        this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        return this.desiredSize;
    }
    /**
     * Arranges the image
     * @param desiredSize
     */
    arrange(desiredSize) {
        this.actualSize = new Size(this.desiredSize.width, this.desiredSize.height);
        this.updateBounds();
        return this.actualSize;
    }
}

/**
 * These utility methods help to process the data and to convert it to desired dimensions
 */
/** @private */
function processPathData(data) {
    let collection = [];
    let j;
    let arrayCollection = parsePathData(data);
    if (arrayCollection.length > 0) {
        for (let i = 0; i < arrayCollection.length; i++) {
            let ob = arrayCollection[i];
            let char = '';
            char = ob[0];
            switch (char.toLowerCase()) {
                case 'm':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({ command: char, x: ob[j], y: ob[j + 1] });
                        j = j + 1;
                        if (char === 'm') {
                            char = 'l';
                        }
                        else if (char === 'M') {
                            char = 'L';
                        }
                    }
                    break;
                case 'l':
                case 't':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({ command: char, x: ob[j], y: ob[j + 1] });
                        j = j + 1;
                    }
                    break;
                case 'h':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({ command: char, x: ob[j] });
                    }
                    break;
                case 'v':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({ command: char, y: ob[j] });
                    }
                    break;
                case 'z':
                    collection.push({ command: char });
                    break;
                case 'c':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({
                            command: char, x1: ob[j], y1: ob[j + 1], x2: ob[j + 2], y2: ob[j + 3], x: ob[j + 4], y: ob[j + 5]
                        });
                        j = j + 5;
                    }
                    break;
                case 's':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({ command: char, x2: ob[j], y2: ob[j + 1], x: ob[j + 2], y: ob[j + 3] });
                        j = j + 3;
                    }
                    break;
                case 'q':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({ command: char, x1: ob[j], y1: ob[j + 1], x: ob[j + 2], y: ob[j + 3] });
                        j = j + 3;
                    }
                    break;
                case 'a':
                    for (j = 1; j < ob.length; j++) {
                        collection.push({
                            command: char, r1: ob[j], r2: ob[j + 1], angle: ob[j + 2], largeArc: ob[j + 3],
                            sweep: ob[j + 4], x: ob[j + 5], y: ob[j + 6]
                        });
                        j = j + 6;
                    }
                    break;
            }
        }
    }
    return collection;
}
/** @private */
function parsePathData(data) {
    let tokenizer = /([a-z]+)|([+-]?(?:\d+\.?\d*|\.\d+))/gi;
    let current = [];
    let commands = [];
    let match = {};
    tokenizer.lastIndex = 0;
    let isExponential = false;
    match = tokenizer.exec(data);
    while (match) {
        if (match[1] === 'e') {
            isExponential = true;
        }
        else if (match[1]) {
            if (match[1].toLowerCase() === 'zm') {
                if (current.length) {
                    commands.push(current);
                }
                commands.push(['Z']);
                current = [match[1].substring(1, 2)];
            }
            else {
                if (current.length) {
                    commands.push(current);
                }
                current = [match[1]];
            }
            isExponential = false;
        }
        else {
            if (!current.length) {
                current = [];
            }
            if (!isExponential) {
                current.push(Number(match[2]));
            }
            isExponential = false;
        }
        match = tokenizer.exec(data);
    }
    if (current.length) {
        commands.push(current);
    }
    return commands;
}
/**
 * Used to find the path for rounded rect
 */
function getRectanglePath(cornerRadius, height, width) {
    let x = 0;
    let y = 0;
    let path = '';
    let points = [{ x: x + cornerRadius, y: y }, { x: x + width - cornerRadius, y: y },
        { x: x + width, y: y + cornerRadius }, { x: x + width, y: y + height - cornerRadius },
        { x: x + width - cornerRadius, y: y + height }, { x: x + cornerRadius, y: y + height },
        { x: x, y: y + height - cornerRadius }, { x: x, y: y + cornerRadius }
    ];
    let corners = [{ x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }];
    let corner = 0;
    let point2;
    let next;
    path = 'M' + points[0].x + ' ' + points[0].y;
    let i;
    for (i = 0; i < points.length; i = i + 2) {
        point2 = points[i + 1];
        path += 'L' + point2.x + ' ' + point2.y;
        next = points[i + 2] || points[0];
        path += 'Q' + corners[corner].x + ' ' + corners[corner].y + ' ' + next.x + ' ' + next.y;
        corner++;
    }
    return path;
}
/** @private */
function pathSegmentCollection(collection) {
    let x0;
    let y0;
    let x1;
    let y1;
    let x2;
    let y2;
    let x;
    let y;
    let length;
    let i;
    let segments = [];
    for (x = 0, y = 0, i = 0, length = collection.length; i < length; ++i) {
        let obj = collection[i];
        let seg = obj;
        let char = '';
        char = seg.command;
        if ('y1' in seg) {
            y1 = seg.y1;
        }
        if ('y2' in seg) {
            y2 = seg.y2;
        }
        if ('x1' in seg) {
            x1 = seg.x1;
        }
        if ('x2' in seg) {
            x2 = seg.x2;
        }
        if ('x' in seg) {
            x = seg.x;
        }
        if ('y' in seg) {
            y = seg.y;
        }
        let prev = segments[segments.length - 1];
        switch (char) {
            case 'M':
                segments.push({ command: 'M', x: x, y: y });
                break;
            case 'L':
                segments.push({ command: 'L', x0: x0, y0: y0, x: x, y: y });
                break;
            case 'H':
                segments.push({ command: 'L', x0: x0, y0: y0, x: x, y: y0 });
                break;
            case 'V':
                segments.push({ command: 'L', x0: x0, y0: y0, x: x0, y: y });
                break;
            case 'C':
                segments.push({ command: 'C', x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y });
                break;
            case 'S':
                if (prev) {
                    let ctrl;
                    if (prev.command === 'C' || prev.command === 'S') {
                        ctrl = { x: prev.x2, y: prev.y2 };
                    }
                    else {
                        ctrl = { x: x0, y: y0 };
                    }
                    let cpt2 = { x: 2 * x0 - ctrl.x, y: 2 * y0 - ctrl.y };
                    segments.push({ command: 'C', x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x2: x2, y2: y2, x: x, y: y });
                }
                break;
            case 'Q':
                //ctx.quadraticCurveTo(x1, y1, x, y);
                segments.push({ command: 'Q', x0: x0, y0: y0, x1: x1, y1: y1, x: x, y: y });
                break;
            case 'T':
                if (prev) {
                    let ctrl;
                    if (prev.command === 'Q') {
                        ctrl = { x: prev.x1, y: prev.y1 };
                    }
                    else {
                        ctrl = { x: x0, y: y0 };
                    }
                    let cpt2 = { x: 2 * x0 - ctrl.x, y: 2 * y0 - ctrl.y };
                    segments.push({ command: 'Q', x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x: x, y: y });
                }
                break;
            case 'A':
                let newSeg = seg;
                newSeg.command = 'A';
                segments.push(newSeg);
                break;
            case 'Z':
            case 'z':
                segments.push({ command: 'Z' });
                x = x0;
                y = y0;
                break;
        }
        x0 = x;
        y0 = y;
    }
    return segments;
}
/** @private */
function transformPath(arr, sX, sY, s, bX, bY, iX, iY) {
    let x1;
    let y1;
    let x2;
    let y2;
    let x;
    let y;
    let length;
    let i;
    let newSeg;
    for (x = 0, y = 0, i = 0, length = arr.length; i < length; ++i) {
        let obj = arr[i];
        let seg = obj;
        let char = seg.command;
        if ('x' in seg) {
            x = seg.x;
        }
        if ('y' in seg) {
            y = seg.y;
        }
        if ('y1' in seg) {
            y1 = seg.y1;
        }
        if ('y2' in seg) {
            y2 = seg.y2;
        }
        if ('x1' in seg) {
            x1 = seg.x1;
        }
        if ('x2' in seg) {
            x2 = seg.x2;
        }
        if (s) {
            if (x !== undefined) {
                x = scalePathData(x, sX, bX, iX);
            }
            if (y !== undefined) {
                y = scalePathData(y, sY, bY, iY);
            }
            if (x1 !== undefined) {
                x1 = scalePathData(x1, sX, bX, iX);
            }
            if (y1 !== undefined) {
                y1 = scalePathData(y1, sY, bY, iY);
            }
            if (x2 !== undefined) {
                x2 = scalePathData(x2, sX, bX, iX);
            }
            if (y2 !== undefined) {
                y2 = scalePathData(y2, sY, bY, iY);
            }
        }
        else {
            if (x !== undefined) {
                x = Number((x + sX).toFixed(2));
            }
            if (y !== undefined) {
                y = Number((y + sY).toFixed(2));
            }
            if (x1 !== undefined) {
                x1 = Number((x1 + sX).toFixed(2));
            }
            if (y1 !== undefined) {
                y1 = Number((y1 + sY).toFixed(2));
            }
            if (x2 !== undefined) {
                x2 = Number((x2 + sX).toFixed(2));
            }
            if (y2 !== undefined) {
                y2 = Number((y2 + sY).toFixed(2));
            }
        }
        let scaledPath = { x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2, r1: seg.r1, r2: seg.r2 };
        newSeg = updatedSegment(seg, char, scaledPath, s, sX, sY);
        if (newSeg) {
            arr[i] = newSeg;
        }
        // Record the start of a subpath
        
    }
    let pathData = getPathString(arr);
    return pathData;
}
/** @private */
function updatedSegment(segment, char, obj, isScale, sX, sY) {
    switch (char) {
        case 'M':
            segment.x = obj.x;
            segment.y = obj.y;
            break;
        case 'L':
            segment.x = obj.x;
            segment.y = obj.y;
            break;
        case 'H':
            segment.x = obj.x;
            break;
        case 'V':
            segment.y = obj.y;
            break;
        case 'C':
            segment.x = obj.x;
            segment.y = obj.y;
            segment.x1 = obj.x1;
            segment.y1 = obj.y1;
            segment.x2 = obj.x2;
            segment.y2 = obj.y2;
            break;
        case 'S':
            segment.x = obj.x;
            segment.y = obj.y;
            segment.x2 = obj.x2;
            segment.y2 = obj.y2;
            break;
        case 'Q':
            segment.x = obj.x;
            segment.y = obj.y;
            segment.x1 = obj.x1;
            segment.y1 = obj.y1;
            break;
        case 'T':
            segment.x = obj.x;
            segment.y = obj.y;
            break;
        case 'A':
            let r1 = obj.r1;
            let r2 = obj.r2;
            if (isScale) {
                obj.r1 = r1 = (r1 * sX);
                obj.r2 = r2 = (r2 * sY);
            }
            segment.x = obj.x;
            segment.y = obj.y;
            segment.r1 = obj.r1;
            segment.r2 = obj.r2;
            break;
        case 'z':
        case 'Z':
            segment = { command: 'Z' };
            break;
    }
    return segment;
}
/** @private */
function scalePathData(val, scaleFactor, oldOffset, newOffset) {
    if (val !== oldOffset) {
        if (newOffset !== oldOffset) {
            val = (((val * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)))
                + (newOffset - Number(oldOffset)));
        }
        else {
            val = ((Number(val) * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)));
        }
    }
    else {
        if (newOffset !== oldOffset) {
            val = newOffset;
        }
    }
    return Number(val.toFixed(2));
}
/** @private */
function splitArrayCollection(arrayCollection) {
    let x0;
    let y0;
    let x1;
    let y1;
    let x2;
    let y2;
    let x;
    let y;
    let length;
    let i;
    for (x = 0, y = 0, i = 0, length = arrayCollection.length; i < length; ++i) {
        let path = arrayCollection[i];
        let seg = path;
        let char = seg.command;
        if (/[MLHVCSQTA]/.test(char)) {
            if ('x' in seg) {
                seg.x = x = seg.x;
            }
            if ('y' in seg) {
                seg.y = y = seg.y;
            }
        }
        else {
            if ('x1' in seg) {
                seg.x1 = x1 = x + seg.x1;
            }
            if ('x2' in seg) {
                seg.x2 = x2 = x + seg.x2;
            }
            if ('y1' in seg) {
                seg.y1 = y1 = y + seg.y1;
            }
            if ('y2' in seg) {
                seg.y2 = y2 = y + seg.y2;
            }
            if ('x' in seg) {
                seg.x = x += seg.x;
            }
            if ('y' in seg) {
                seg.y = y += seg.y;
            }
            let newSeg;
            switch (char) {
                case 'm':
                case 'M':
                    newSeg = { command: 'M', x: x, y: y };
                    break;
                case 'l':
                case 'L':
                    newSeg = { command: 'L', x: x, y: y };
                    break;
                case 'h':
                case 'H':
                    newSeg = { command: 'H', x: x };
                    break;
                case 'v':
                case 'V':
                    newSeg = { command: 'V', y: y };
                    break;
                case 'c':
                case 'C':
                    newSeg = { command: 'C', x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2 };
                    break;
                case 's':
                case 'S':
                    newSeg = { command: 'S', x: x, y: y, x2: x2, y2: y2 };
                    break;
                case 'q':
                case 'Q':
                    newSeg = { command: 'Q', x: x, y: y, x1: x1, y1: y1 };
                    break;
                case 't':
                case 'T':
                    newSeg = { command: 'T', x: x, y: y };
                    break;
                case 'a':
                case 'A':
                    newSeg = { command: 'A', x: x, y: y };
                    newSeg.r1 = seg.r1;
                    newSeg.r2 = seg.r2;
                    newSeg.angle = seg.angle;
                    newSeg.largeArc = seg.largeArc;
                    newSeg.sweep = seg.sweep;
                    break;
                case 'z':
                case 'Z':
                    newSeg = { command: 'Z' };
                    x = x0;
                    y = y0;
                    newSeg = arrayCollection[i];
                    break;
            }
            if (newSeg) {
                arrayCollection[i] = newSeg;
            }
        }
        if (char === 'M' || char === 'm') {
            x0 = x;
            y0 = y;
        }
    }
    return arrayCollection;
}
/** @private */
function getPathString(arrayCollection) {
    let getNewString = '';
    let i;
    for (i = 0; i < arrayCollection.length; i++) {
        if (i === 0) {
            getNewString += getString(arrayCollection[i]);
        }
        else {
            getNewString += ' ' + getString(arrayCollection[i]);
        }
    }
    return getNewString;
}
/** @private */
function getString(obj) {
    let string = '';
    switch (obj.command) {
        case 'Z':
        case 'z':
            string = obj.command;
            break;
        case 'M':
        case 'm':
        case 'L':
        case 'l':
            string = obj.command + ' ' + obj.x + ' ' + obj.y;
            break;
        case 'C':
        case 'c':
            string = obj.command + ' ' + obj.x1 + ' ' + obj.y1 + ' ' + obj.x2 + ' ' + obj.y2 + ' ' + obj.x + ' ' + obj.y;
            break;
        case 'Q':
        case 'q':
            string = obj.command + ' ' + obj.x1 + ' ' + obj.y1 + ' ' + obj.x + ' ' + obj.y;
            break;
        case 'A':
        case 'a':
            let cmd = obj.command;
            let ang = obj.angle;
            let l = (obj.largeArc ? '1' : '0');
            let s = (obj.sweep ? '1' : '0');
            string = cmd + ' ' + obj.r1 + ' ' + obj.r2 + ' ' + ang + ' ' + l + ' ' + s + ' ' + obj.x + ' ' + obj.y;
            break;
        case 'H':
        case 'h':
            string = obj.command + ' ' + obj.x;
            break;
        case 'V':
        case 'v':
            string = obj.command + ' ' + obj.y;
            break;
        case 'S':
        case 's':
            string = obj.command + ' ' + obj.x2 + ' ' + obj.y2 + ' ' + obj.x + ' ' + obj.y;
            break;
        case 'T':
        case 't':
            string = obj.command + ' ' + obj.x + ' ' + obj.y;
    }
    return string;
}

/**
 * PathElement takes care of how to align the path based on offsetX and offsetY
 */
class PathElement extends DrawingElement {
    /**
     * set the id for each element
     */
    constructor() {
        super();
        /**
         * Gets or sets the geometry of the path element
         */
        this.pathData = '';
        /**
         * Gets/Sets whether the path has to be transformed to fit the given x,y, width, height
         */
        this.transformPath = true;
        /**
         * Gets/Sets the equivalent path, that will have the origin as 0,0
         */
        this.absolutePath = '';
        /**   @private  */
        this.canMeasurePath = false;
        //Private variables
        /**   @private  */
        this.absoluteBounds = new Rect();
    }
    /**
     * Gets the geometry of the path element
     */
    get data() {
        return this.pathData;
    }
    /**
     * Sets the geometry of the path element
     */
    set data(value) {
        if (this.pathData !== value) {
            this.pathData = value;
            this.isDirt = true;
        }
    }
    /**
     * Measures the minimum space that is required to render the element
     * @param availableSize
     */
    measure(availableSize) {
        //Performance issue - Avoiding measuring the connector path
        if (this.staticSize && this.width !== undefined && this.height !== undefined) {
            this.absoluteBounds = new Rect(this.offsetX - this.width * this.pivot.x, this.offsetY - this.height * this.pivot.y, this.width, this.height);
        }
        else if (this.isDirt && (this.transformPath || (this.width === undefined || this.height === undefined))
            && (!this.absoluteBounds || this.absoluteBounds.height === 0) || this.canMeasurePath) {
            //Measure the element only whent the path data is changed/ size is not specified
            this.absoluteBounds = measurePath(this.data ? this.data : '');
        }
        if (this.width === undefined) {
            this.desiredSize = new Size(this.absoluteBounds.width, this.height || this.absoluteBounds.height);
        }
        else if (this.height === undefined) {
            this.desiredSize = new Size(this.width || this.absoluteBounds.width, this.absoluteBounds.height);
        }
        else {
            this.desiredSize = new Size(this.width, this.height);
        }
        this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        this.canMeasurePath = false;
        return this.desiredSize;
    }
    /**
     * Arranges the path element
     * @param desiredSize
     */
    arrange(desiredSize) {
        if (this.isDirt || this.actualSize.width !== desiredSize.width || this.actualSize.height !== desiredSize.height) {
            this.isDirt = true;
            this.absolutePath = this.updatePath(this.data, this.absoluteBounds, desiredSize);
            if (!this.staticSize) {
                this.points = null;
            }
        }
        this.actualSize = this.desiredSize;
        this.updateBounds();
        this.isDirt = false;
        return this.actualSize;
    }
    /**
     * Translates the path to 0,0 and scales the path based on the actual size
     * @param pathData
     * @param bounds
     * @param actualSize
     */
    updatePath(pathData, bounds, actualSize) {
        let isScale = false;
        let newPathString = '';
        let scaleX = -bounds.x;
        let scaleY = -bounds.y;
        let arrayCollection = [];
        if (actualSize.width !== bounds.width || actualSize.height !== bounds.height) {
            scaleX = actualSize.width / Number(bounds.width ? bounds.width : 1);
            scaleY = actualSize.height / Number(bounds.height ? bounds.height : 1);
            isScale = true;
        }
        arrayCollection = processPathData(pathData);
        arrayCollection = splitArrayCollection(arrayCollection);
        if ((isScale || this.isDirt) && this.transformPath) {
            newPathString = transformPath(arrayCollection, scaleX, scaleY, isScale, bounds.x, bounds.y, 0, 0);
        }
        else {
            newPathString = getPathString(arrayCollection);
        }
        isScale = false;
        return newPathString;
    }
}

/**
 * Diagram component exported items
 */

/**
 * Diagram component exported items
 */

/**
 * Diagram component exported items
 */

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines and processes coordinates
 */
class Point extends ChildProperty {
    /**   @private  */
    static equals(point1, point2) {
        if (point1 === point2) {
            return true;
        }
        if (!point1 || !point2) {
            return false;
        }
        return !point1 || !point2 || point1.x === point2.x && point1.y === point2.y;
    }
    /**
     * check whether the points are given
     */
    static isEmptyPoint(point) {
        if (point.x && point.y) {
            return false;
        }
        return true;
    }
    /**   @private  */
    static transform(point, angle, length) {
        let pt = { x: 0, y: 0 };
        pt.x = Math.round((point.x + length * Math.cos(angle * Math.PI / 180)) * 100) / 100;
        pt.y = Math.round((point.y + length * Math.sin(angle * Math.PI / 180)) * 100) / 100;
        return pt;
    }
    /**   @private  */
    static findLength(s, e) {
        let length = Math.sqrt(Math.pow((s.x - e.x), 2) + Math.pow((s.y - e.y), 2));
        return length;
    }
    /**   @private  */
    static findAngle(point1, point2) {
        let angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        angle = (180 * angle / Math.PI);
        angle %= 360;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /**   @private  */
    static distancePoints(pt1, pt2) {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    }
    /**   @private  */
    static getLengthFromListOfPoints(points) {
        let length = 0;
        for (let j = 0; j < points.length - 1; j++) {
            length += this.distancePoints(points[j], points[j + 1]);
        }
        return length;
    }
    /**   @private  */
    static adjustPoint(source, target, isStart, length) {
        let pt = isStart ? { x: source.x, y: source.y } : { x: target.x, y: target.y };
        let angle;
        if (source.x === target.x) {
            if (source.y < target.y && isStart || source.y > target.y && !isStart) {
                pt.y += length;
            }
            else {
                pt.y -= length;
            }
        }
        else if (source.y === target.y) {
            if (source.x < target.x && isStart || source.x > target.x && !isStart) {
                pt.x += length;
            }
            else {
                pt.x -= length;
            }
        }
        else {
            if (isStart) {
                angle = this.findAngle(source, target);
                pt = this.transform(source, angle, length);
            }
            else {
                angle = this.findAngle(target, source);
                pt = this.transform(target, angle, length);
            }
        }
        return pt;
    }
    /**   @private  */
    static direction(pt1, pt2) {
        if (Math.abs(pt2.x - pt1.x) > Math.abs(pt2.y - pt1.y)) {
            return pt1.x < pt2.x ? 'Right' : 'Left';
        }
        else {
            return pt1.y < pt2.y ? 'Bottom' : 'Top';
        }
    }
    /**
     * @private
     * Returns the name of class Point
     */
    getClassName() {
        return 'Point';
    }
}
__decorate$1([
    Property(0)
], Point.prototype, "x", void 0);
__decorate$1([
    Property(0)
], Point.prototype, "y", void 0);

/**
 * Diagram component exported items
 */

// import { overFlow } from './../utility/base-util';
/**
 * Canvas Renderer
 */
/** @private */
class CanvasRenderer {
    /**   @private  */
    static getContext(canvas) {
        return canvas.getContext('2d');
    }
    setStyle(canvas, style) {
        let ctx = CanvasRenderer.getContext(canvas);
        if (style.fill === 'none') {
            style.fill = 'transparent';
        }
        if (style.stroke === 'none') {
            style.stroke = 'transparent';
        }
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.strokeWidth;
        if (style.strokeWidth === 0) {
            ctx.strokeStyle = 'transparent';
        }
        ctx.globalAlpha = style.opacity;
        let dashArray = [];
        if (style.dashArray) {
            dashArray = this.parseDashArray(style.dashArray);
        }
        ctx.setLineDash(dashArray);
        ctx.fillStyle = style.fill;
    }
    rotateContext(canvas, angle, x, y) {
        let ctx = CanvasRenderer.getContext(canvas);
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-x, -y);
    }
    setFontStyle(canvas, text) {
        let ctx = CanvasRenderer.getContext(canvas);
        let font = '';
        if (text.italic) {
            font += 'italic ';
        }
        if (text.bold) {
            font += 'bold ';
        }
        font += (text.fontSize) + 'px ';
        font += text.fontFamily;
        ctx.font = font;
    }
    /**   @private  */
    parseDashArray(dashArray) {
        let dashes = [];
        let separator = dashArray.indexOf(' ') !== -1 ? ' ' : ',';
        let splittedDashes = dashArray.split(separator);
        for (let i of splittedDashes) {
            dashes.push(Number(i));
        }
        return dashes;
    }
    //Rendering Part
    /**   @private  */
    drawRectangle(canvas, options) {
        if (options.visible === true) {
            if (options.cornerRadius) {
                options.data = getRectanglePath(options.cornerRadius, options.height, options.width);
                this.drawPath(canvas, options);
            }
            else {
                let ctx = CanvasRenderer.getContext(canvas);
                ctx.save();
                ctx.beginPath();
                let cornerRadius = options.cornerRadius;
                let pivotX = options.x + options.width * options.pivotX;
                let pivotY = options.y + options.height * options.pivotY;
                this.rotateContext(canvas, options.angle, pivotX, pivotY);
                this.setStyle(canvas, options);
                ctx.rect(options.x, options.y, options.width, options.height);
                ctx.fillRect(options.x, options.y, options.width, options.height);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    }
    /**   @private  */
    drawPath(canvas, options) {
        let collection = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        let ctx = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        let pivotY = options.y + options.height * options.pivotY;
        let pivotX = options.x + options.width * options.pivotX;
        this.rotateContext(canvas, options.angle, pivotX, pivotY);
        this.setStyle(canvas, options);
        ctx.translate(options.x, options.y);
        this.renderPath(canvas, options, collection);
        ctx.fill();
        ctx.translate(-options.x, -options.y);
        ctx.stroke();
        ctx.restore();
    }
    /**   @private  */
    renderPath(canvas, options, collection) {
        if (options.visible === true) {
            let ctx = CanvasRenderer.getContext(canvas);
            let x0;
            let y0;
            let x1;
            let y1;
            let x2;
            let y2;
            let x;
            let y;
            let length;
            let i;
            let segs = collection;
            for (x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                let obj = segs[i];
                let seg = obj;
                let char = seg.command;
                if ('x1' in seg) {
                    x1 = seg.x1;
                }
                if ('x2' in seg) {
                    x2 = seg.x2;
                }
                if ('y1' in seg) {
                    y1 = seg.y1;
                }
                if ('y2' in seg) {
                    y2 = seg.y2;
                }
                if ('x' in seg) {
                    x = seg.x;
                }
                if ('y' in seg) {
                    y = seg.y;
                }
                switch (char) {
                    case 'M':
                        ctx.moveTo(x, y);
                        seg.x = x;
                        seg.y = y;
                        break;
                    case 'L':
                        ctx.lineTo(x, y);
                        seg.x = x;
                        seg.y = y;
                        break;
                    case 'C':
                        ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
                        seg.x = x;
                        seg.y = y;
                        seg.x1 = x1;
                        seg.y1 = y1;
                        seg.x2 = x2;
                        seg.y2 = y2;
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(x1, y1, x, y);
                        seg.x = x;
                        seg.y = y;
                        seg.x1 = x1;
                        seg.y1 = y1;
                        break;
                    case 'A':
                        let curr = { x: x0, y: y0 };
                        let rx = seg.r1;
                        let ry = seg.r2;
                        let xAxisRotation = seg.angle * (Math.PI / 180.0);
                        let largeArc = seg.largeArc;
                        let sweep = seg.sweep;
                        let cp = { x: x, y };
                        let currp = {
                            x: Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                            y: -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                        };
                        let l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                        if (l > 1) {
                            rx *= Math.sqrt(l);
                            ry *= Math.sqrt(l);
                        }
                        let k = (Math.pow(ry, 2) * Math.pow(currp.x, 2));
                        let s = (largeArc === sweep ? -1 : 1) * Math.sqrt(((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - k) /
                            (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));
                        if (isNaN(s)) {
                            s = 0;
                        }
                        let cpp = { x: s * rx * currp.y / ry, y: s * -ry * currp.x / rx };
                        let centp = {
                            x: (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                            y: (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                        };
                        let a1 = this.a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                        let u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                        let v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                        let ad = this.a(u, v);
                        if (this.r(u, v) <= -1) {
                            ad = Math.PI;
                        }
                        if (this.r(u, v) >= 1) {
                            ad = 0;
                        }
                        
                        
                        
                        seg.centp = centp;
                        seg.xAxisRotation = xAxisRotation;
                        seg.rx = rx;
                        seg.ry = ry;
                        seg.a1 = a1;
                        seg.ad = ad;
                        seg.sweep = sweep;
                        if (ctx != null) {
                            let ra = rx > ry ? rx : ry;
                            let sx = rx > ry ? 1 : rx / ry;
                            let sy = rx > ry ? ry / rx : 1;
                            ctx.save();
                            ctx.translate(centp.x, centp.y);
                            ctx.rotate(xAxisRotation);
                            ctx.scale(sx, sy);
                            ctx.arc(0, 0, ra, a1, a1 + ad, !sweep);
                            ctx.scale(1 / sx, 1 / sy);
                            ctx.rotate(-xAxisRotation);
                            ctx.translate(-centp.x, -centp.y);
                            ctx.restore();
                        }
                        break;
                    case 'Z':
                    case 'z':
                        ctx.closePath();
                        x = x0;
                        y = y0;
                        break;
                }
                x0 = x;
                y0 = y;
            }
        }
    }
    /**   @private  */
    drawText(canvas, options) {
        if (options.content && options.visible === true) {
            let ctx = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options);
            let pivotX = options.x + options.width * options.pivotX;
            let pivotY = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
            this.setFontStyle(canvas, options);
            let i = 0;
            let childNodes = [];
            childNodes = options.childNodes;
            let wrapBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                let position = this.labelAlign(options, wrapBounds, childNodes);
                for (i = 0; i < childNodes.length; i++) {
                    let child = childNodes[i];
                    let offsetX = position.x + child.x - wrapBounds.x;
                    let offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8);
                    // if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                    //     child.text = overFlow(child.text, options);
                    // }
                    ctx.fillText(child.text, offsetX, offsetY);
                    if (options.textDecoration === 'Underline'
                        || options.textDecoration === 'Overline'
                        || options.textDecoration === 'LineThrough') {
                        let startPointX = offsetX;
                        let startPointY;
                        let textlength = ctx.measureText(child.text).width;
                        let endPointX = offsetX + textlength;
                        let endPointY;
                        switch (options.textDecoration) {
                            case 'Underline':
                                startPointY = offsetY + 2;
                                endPointY = offsetY + 2;
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                        }
                        ctx.beginPath();
                        ctx.moveTo(startPointX, startPointY);
                        ctx.lineTo(endPointX, endPointY);
                        ctx.strokeStyle = options.color;
                        ctx.lineWidth = options.fontSize * .08;
                        ctx.globalAlpha = options.opacity;
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }
    }
    //end region
    // vector magnitude
    m(v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
    // ratio between two vectors
    r(u, v) { return (u[0] * v[0] + u[1] * v[1]) / (this.m(u) * this.m(v)); }
    // angle between two vectors
    a(u, v) { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(this.r(u, v)); }
    getMeetOffset(arg, res, dest) {
        let max = Math.max(res, dest);
        let min = Math.min(res, dest);
        switch (arg) {
            case 'min': return 0;
            case 'mid': return (max - min) / 2;
            case 'max': return max - min;
            default: return 0;
        }
    }
    getSliceOffset(arg, res, dest, src) {
        switch (arg) {
            case 'min': return 0;
            case 'mid': return (res - dest) / 2 * src / res;
            case 'max': return (res - dest) * src / res;
            default: return 0;
        }
    }
    image(ctx, image, x, y, width, height, alignOptions) {
        ctx.beginPath();
        let srcWidth = image.width;
        let srcHeight = image.height;
        let destinationW = width;
        let destinationH = height;
        let resultWidth = 0;
        let resultHeight = 0;
        ctx.globalAlpha = alignOptions.opacity;
        if (alignOptions && alignOptions.alignment !== 'None') {
            let xalign = alignOptions.alignment.toLowerCase().substr(1, 3);
            let yalign = alignOptions.alignment.toLowerCase().substr(5, 3);
            if (alignOptions.scale === 'Slice') {
                let a = () => {
                    resultWidth = destinationW;
                    resultHeight = srcHeight * destinationW / srcWidth;
                };
                let b = () => {
                    resultWidth = srcWidth * destinationH / srcHeight;
                    resultHeight = destinationH;
                };
                if (destinationW > destinationH) {
                    a();
                    if (destinationH > resultHeight) {
                        b();
                    }
                }
                else if (destinationW === destinationH) {
                    if (srcWidth > srcHeight) {
                        b();
                    }
                    else {
                        a();
                    }
                }
                else {
                    b();
                    if (destinationW > resultWidth) {
                        a();
                    }
                }
                let x1 = this.getSliceOffset(xalign, resultWidth, destinationW, srcWidth);
                let y1 = this.getSliceOffset(yalign, resultHeight, destinationH, srcHeight);
                let sWidth = srcWidth - x1;
                let sHeight = srcHeight - y1;
                let dWidth = resultWidth - (x1 * (resultWidth / srcWidth));
                let dHeight = resultHeight - (y1 * (resultHeight / srcHeight));
                let canvas1 = createHtmlElement('canvas', { 'width': width.toString(), 'height': height.toString() });
                let ctx1 = canvas1.getContext('2d');
                ctx1.drawImage(image, x1, y1, sWidth, sHeight, 0, 0, dWidth, dHeight);
                ctx.drawImage(canvas1, x, y, width, height);
            }
            else if (alignOptions.scale === 'Meet') {
                let srcRatio = (srcHeight / srcWidth);
                let destRatio = (destinationH / destinationW);
                resultWidth = destRatio > srcRatio ? destinationW : destinationH / srcRatio;
                resultHeight = destRatio > srcRatio ? destinationW * srcRatio : destinationH;
                x += this.getMeetOffset(xalign, resultWidth, destinationW);
                y += this.getMeetOffset(yalign, resultHeight, destinationH);
                ctx.drawImage(image, 0, 0, srcWidth, srcHeight, x, y, resultWidth, resultHeight);
            }
            else {
                ctx.drawImage(image, x, y, width, height);
            }
        }
        else {
            ctx.drawImage(image, x, y, width, height);
        }
        ctx.closePath();
    }
    // text utility
    loadImage(ctx, obj, canvas, pivotX, pivotY) {
        this.rotateContext(canvas, obj.angle, pivotX, pivotY);
        let image = new Image();
        image.src = obj.source;
        this.image(ctx, image, obj.x, obj.y, obj.width, obj.height, obj);
    }
    /**   @private  */
    drawImage(canvas, obj, parentSvg, fromPalette) {
        if (obj.visible) {
            let ctx = CanvasRenderer.getContext(canvas);
            ctx.save();
            let pivotX = obj.x + obj.width * obj.pivotX;
            let pivotY = obj.y + obj.height * obj.pivotY;
            let imageObj = new Image();
            imageObj.src = obj.source;
            let id = ctx.canvas.id.split('_');
            let value = id[id.length - 1] === ('diagram' || 'diagramLayer') ? true : false;
            /**
             *  Since Clipping portion for node with slice option is not calculated properly
             * if (obj.sourceX !== undefined && obj.sourceY !== undefined && obj.sourceWidth !== undefined
             *  && obj.sourceHeight !== undefined) {
             *  ctx.drawImage(imageObj, obj.sourceX, obj.sourceY, obj.sourceWidth, obj.sourceHeight, obj.x, obj.y, obj.width, obj.height);
             *  } else {
             *             ctx.drawImage(imageObj, obj.x, obj.y, obj.width, obj.height);
             * }
             */
            if (!fromPalette) {
                this.loadImage(ctx, obj, canvas, pivotX, pivotY);
            }
            else {
                imageObj.onload = () => {
                    this.loadImage(ctx, obj, canvas, pivotX, pivotY);
                };
            }
            ctx.restore();
        }
    }
    /**   @private  */
    labelAlign(text, wrapBounds, childNodes) {
        let bounds = new Size(wrapBounds.width, childNodes.length * (text.fontSize * 1.2));
        let position = { x: 0, y: 0 };
        let labelX = text.x;
        let labelY = text.y;
        let offsetx = text.width * 0.5;
        let offsety = text.height * 0.5;
        let pointx = offsetx;
        let pointy = offsety;
        if (text.textAlign === 'left') {
            pointx = 0;
        }
        else if (text.textAlign === 'center') {
            if (wrapBounds.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                pointx = 0;
            }
            else {
                pointx = text.width * 0.5;
            }
        }
        else if (text.textAlign === 'right') {
            pointx = (text.width * 1);
        }
        position.x = labelX + pointx + (wrapBounds ? wrapBounds.x : 0);
        position.y = labelY + pointy - bounds.height / 2;
        return position;
    }
}
function refreshDiagramElements(canvas, drawingObjects, renderer) {
    for (let i = 0; i < drawingObjects.length; i++) {
        renderer.renderElement(drawingObjects[i], canvas, undefined);
    }
}

/**
 * Renderer module is used to render basic diagram elements
 */
/** @private */
class DrawingRenderer {
    constructor(name, isSvgMode) {
        /**   @private  */
        this.renderer = null;
        // private svgRenderer: SvgRenderer;
        /** @private */
        this.isSvgMode = true;
        this.diagramId = name;
        this.element = getDiagramElement(this.diagramId);
        this.isSvgMode = isSvgMode;
        this.renderer = new CanvasRenderer();
        //  this.svgRenderer = new SvgRenderer();
    }
    // /** @private */
    // public setLayers(): void {
    //     this.adornerSvgLayer = this.element.getElementsByClassName('e-adorner-layer')[0] as SVGSVGElement;
    // }
    /**   @private  */
    renderElement(element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue) {
        if (element instanceof Container) {
            this.renderContainer(element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue);
        }
        else if (element instanceof ImageElement) {
            this.renderImageElement(element, canvas, transform, parentSvg, fromPalette);
        }
        else if (element instanceof PathElement) {
            this.renderPathElement(element, canvas, transform, parentSvg, fromPalette);
        }
        else if (element instanceof TextElement) {
            this.renderTextElement(element, canvas, transform, parentSvg, fromPalette);
        }
        else {
            this.renderRect(element, canvas, transform, parentSvg);
        }
    }
    /**   @private  */
    renderImageElement(element, canvas, transform, parentSvg, fromPalette) {
        let options = this.getBaseAttributes(element, transform);
        options.cornerRadius = 0;
        // this.renderer.drawRectangle(canvas as HTMLCanvasElement, options as RectAttributes);
        // let sx: number; let sy: number;
        let imageWidth;
        let imageHeight;
        let sourceWidth;
        let sourceHeight;
        if (element.stretch === 'Stretch') {
            imageWidth = element.actualSize.width;
            imageHeight = element.actualSize.height;
        }
        else {
            let contentWidth = element.contentSize.width;
            let contentHeight = element.contentSize.height;
            let widthRatio = options.width / contentWidth;
            let heightRatio = options.height / contentHeight;
            let ratio;
            switch (element.stretch) {
                case 'Meet':
                    ratio = Math.min(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    options.x += Math.abs(options.width - imageWidth) / 2;
                    options.y += Math.abs(options.height - imageHeight) / 2;
                    break;
                case 'Slice':
                    widthRatio = options.width / contentWidth;
                    heightRatio = options.height / contentHeight;
                    ratio = Math.max(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    sourceWidth = options.width / imageWidth * contentWidth;
                    sourceHeight = options.height / imageHeight * contentHeight;
                    break;
                case 'None':
                    imageWidth = contentWidth;
                    imageHeight = contentHeight;
                    break;
            }
        }
        options.width = imageWidth;
        options.height = imageHeight;
        //Commented for code coverage
        //(options as ImageAttributes).sourceX = sx;
        //(options as ImageAttrib                                                                           utes).sourceY = sy;
        options.sourceWidth = sourceWidth;
        options.sourceHeight = sourceHeight;
        options.source = element.source;
        options.alignment = element.imageAlign;
        options.scale = element.imageScale;
        this.renderer.drawImage(canvas, options, parentSvg, fromPalette);
    }
    /**   @private  */
    renderPathElement(element, canvas, transform, parentSvg, fromPalette) {
        let options = this.getBaseAttributes(element, transform);
        options.data = element.absolutePath;
        options.data = element.absolutePath;
        let ariaLabel = element.id;
        if (!this.isSvgMode) {
            options.x = options.x;
            options.y = options.y;
        }
        this.renderer.drawPath(canvas, options);
    }
    /**   @private  */
    renderTextElement(element, canvas, transform, parentSvg, fromPalette) {
        let options = this.getBaseAttributes(element, transform);
        options.cornerRadius = 0;
        options.whiteSpace = whiteSpaceToString(element.style.whiteSpace, element.style.textWrapping);
        options.content = element.content;
        options.breakWord = wordBreakToString(element.style.textWrapping);
        options.textAlign = textAlignToString(element.style.textAlign);
        options.color = element.style.color;
        options.italic = element.style.italic;
        options.bold = element.style.bold;
        options.fontSize = element.style.fontSize;
        options.fontFamily = element.style.fontFamily;
        options.textOverflow = element.style.textOverflow;
        options.textDecoration = element.style.textDecoration;
        options.doWrap = element.doWrap;
        options.wrapBounds = element.wrapBounds;
        options.childNodes = element.childNodes;
        options.dashArray = '';
        options.strokeWidth = 0;
        options.fill = element.style.fill;
        let ariaLabel = element.content ? element.content : element.id;
        this.renderer.drawRectangle(canvas, options);
        this.renderer.drawText(canvas, options);
    }
    /**   @private  */
    renderContainer(group, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue) {
        transform = { tx: 0, ty: 0, scale: 1 };
        if (this.diagramId) {
            parentSvg = parentSvg;
        }
        this.renderRect(group, canvas, transform, parentSvg);
        if (group.hasChildren()) {
            let parentG;
            for (let child of group.children) {
                this.renderElement(child, parentG || canvas, htmlLayer, transform, parentSvg, true, fromPalette, indexValue);
            }
        }
    }
    /**   @private  */
    renderRect(element, canvas, transform, parentSvg) {
        let options = this.getBaseAttributes(element, transform);
        options.cornerRadius = element.cornerRadius || 0;
        let ariaLabel = element.id;
        this.renderer.drawRectangle(canvas, options);
    }
    /**   @private  */
    getBaseAttributes(element, transform) {
        let options = {
            width: element.actualSize.width, height: element.actualSize.height,
            x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
            y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
            fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
            dashArray: element.style.strokeDashArray || '', opacity: element.style.opacity,
            visible: element.visible, id: element.id, gradient: element.style.gradient,
        };
        if (transform) {
            options.x += transform.tx;
            options.y += transform.ty;
        }
        return options;
    }
}

/**
 * SVG Renderer
 */
/** @private */
class SvgRenderer {
    /**   @private  */
    parseDashArray(dashArray) {
        let dashes = [];
        return dashes;
    }
    /**   @private  */
    drawRectangle(svg, options, diagramId, onlyRect, isSelector, parentSvg, ariaLabel) {
        let id;
        if (options.id === svg.id) {
            id = options.id + '_container';
        }
        else {
            id = options.id;
        }
        let rect;
        if (!rect || isSelector) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            svg.appendChild(rect);
        }
        let attr = {
            'id': id, 'x': options.x.toString(), 'y': options.y.toString(), 'width': options.width.toString(),
            'height': options.height.toString(), 'visibility': options.visible ? 'visible' : 'hidden',
            'transform': 'rotate(' + options.angle + ','
                + (options.x + options.width * options.pivotX) + ',' + (options.y + options.height * options.pivotY) + ')',
            'rx': options.cornerRadius || 0, 'ry': options.cornerRadius || 0, 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        let poiterEvents = 'pointer-events';
        if (!ariaLabel) {
            attr[poiterEvents] = 'none';
        }
        setAttributeSvg(rect, attr);
        this.setSvgStyle(rect, options, diagramId);
    }
    /**   @private  */
    updateSelectionRegion(gElement, options) {
        let rect;
        rect = gElement.parentNode.getElementById(options.id);
        let attr;
        attr = {
            'id': options.id, 'x': options.x.toString(), 'y': options.y.toString(), 'width': options.width.toString(),
            'height': options.height.toString(), 'transform': 'rotate(' + options.angle + ','
                + (options.x + options.width * options.pivotX) + ',' + (options.y + options.height * options.pivotY) + ')',
            class: 'e-diagram-selected-region'
        };
        if (!rect) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            gElement.appendChild(rect);
        }
        this.setSvgStyle(rect, options);
        setAttributeSvg(rect, attr);
    }
    /**   @private  */
    createGElement(elementType, attribute) {
        let gElement = createSvgElement(elementType, attribute);
        return gElement;
    }
    /** @private */
    drawCircle(gElement, options, enableSelector, ariaLabel) {
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.setSvgStyle(circle, options);
        let classval = options.class || '';
        if (!enableSelector) {
            classval += ' e-disabled';
        }
        let attr = {
            'id': options.id,
            'cx': options.centerX,
            'cy': options.centerY,
            'r': options.radius,
            'visibility': options.visible ? 'visible' : 'hidden',
            'class': classval,
            'aria-label': ariaLabel ? ariaLabel['aria-label'] : ''
        };
        circle.style.display = options.visible ? 'block' : 'none';
        setAttributeSvg(circle, attr);
        gElement.appendChild(circle);
    }
    /**   @private  */
    setSvgStyle(svg, style, diagramId) {
        if (style.canApplyStyle || style.canApplyStyle === undefined) {
            if (style.fill === 'none') {
                style.fill = 'transparent';
            }
            if (style.stroke === 'none') {
                style.stroke = 'transparent';
            }
            let dashArray = [];
            let fill;
            if (style.dashArray !== undefined) {
                let canvasRenderer = new CanvasRenderer();
                dashArray = canvasRenderer.parseDashArray(style.dashArray);
            }
            fill = style.fill;
            if (style.stroke) {
                svg.setAttribute('stroke', style.stroke);
            }
            if (style.strokeWidth !== undefined && style.strokeWidth !== null) {
                svg.setAttribute('stroke-width', style.strokeWidth.toString());
            }
            if (dashArray) {
                svg.setAttribute('stroke-dasharray', dashArray.toString());
            }
            if (fill) {
                svg.setAttribute('fill', fill);
            }
        }
    }
    //end region
    // text utility
    /**   @private  */
    svgLabelAlign(text, wrapBound, childNodes) {
        let bounds = new Size(wrapBound.width, childNodes.length * (text.fontSize * 1.2));
        let pos = { x: 0, y: 0 };
        let x = 0;
        let y = 1.2;
        let offsetX = text.width * 0.5;
        let offsety = text.height * 0.5;
        let pointX = offsetX;
        let pointY = offsety;
        if (text.textAlign === 'left') {
            pointX = 0;
        }
        else if (text.textAlign === 'center') {
            if (wrapBound.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                pointX = 0;
            }
            else {
                pointX = text.width * 0.5;
            }
        }
        else if (text.textAlign === 'right') {
            pointX = (text.width * 1);
        }
        pos.x = x + pointX + (wrapBound ? wrapBound.x : 0);
        pos.y = y + pointY - bounds.height / 2;
        return pos;
    }
    /** @private */
    drawLine(gElement, options) {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.setSvgStyle(line, options);
        let pivotX = options.x + options.width * options.pivotX;
        let pivotY = options.y + options.height * options.pivotY;
        let attr = {
            'id': options.id,
            'x1': options.startPoint.x + options.x,
            'y1': options.startPoint.y + options.y,
            'x2': options.endPoint.x + options.x,
            'y2': options.endPoint.y + options.y,
            'stroke': options.stroke,
            'stroke-width': options.strokeWidth.toString(), 'opacity': options.opacity.toString(),
            'transform': 'rotate(' + options.angle + ' ' + pivotX + ' ' + pivotY + ')',
            'visibility': options.visible ? 'visible' : 'hidden',
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(line, attr);
        gElement.appendChild(line);
    }
    /**   @private  */
    drawPath(svg, options, diagramId, isSelector, parentSvg, ariaLabel) {
        let id;
        let x = Math.floor((Math.random() * 10) + 1);
        id = svg.id + '_shape' + x.toString();
        let collection = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        let shadowElement;
        if (parentSvg) {
            shadowElement = parentSvg.getElementById(options.id + '_groupElement_shadow');
            if (shadowElement) {
                shadowElement.parentNode.removeChild(shadowElement);
            }
        }
        let path;
        if (parentSvg) {
            path = parentSvg.getElementById(options.id);
        }
        if (!path || isSelector) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svg.appendChild(path);
        }
        this.renderPath(path, options, collection);
        let attr = {
            'id': options.id, 'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                + (options.y + options.height * options.pivotY) + ')' + 'translate(' + (options.x) + ',' + (options.y) + ')',
            'visibility': options.visible ? 'visible' : 'hidden', 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(path, attr);
        this.setSvgStyle(path, options, diagramId);
    }
    /**   @private  */
    renderPath(svg, options, collection) {
        let x1;
        let y1;
        let x2;
        let y2;
        let x;
        let y;
        let length;
        let i;
        let segments = collection;
        let d = '';
        for (x = 0, y = 0, i = 0, length = segments.length; i < length; ++i) {
            let obj = segments[i];
            let segment = obj;
            let char = segment.command;
            if ('x1' in segment) {
                x1 = segment.x1;
            }
            if ('x2' in segment) {
                x2 = segment.x2;
            }
            if ('y1' in segment) {
                y1 = segment.y1;
            }
            if ('y2' in segment) {
                y2 = segment.y2;
            }
            if ('x' in segment) {
                x = segment.x;
            }
            if ('y' in segment) {
                y = segment.y;
            }
            switch (char) {
                case 'M':
                    d = d + 'M' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'L':
                    d = d + 'L' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'C':
                    d = d + 'C' + x1.toString() + ',' + y1.toString() + ',' + x2.toString() + ',' + y2.toString() + ',';
                    d += x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'Q':
                    d = d + 'Q' + x1.toString() + ',' + y1.toString() + ',' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'A':
                    d = d + 'A' + segment.r1.toString() + ',' + segment.r2.toString() + ',' + segment.angle.toString() + ',';
                    d += segment.largeArc.toString() + ',' + segment.sweep + ',' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'Z':
                case 'z':
                    d = d + 'Z' + ' ';
                    break;
            }
        }
        svg.setAttribute('d', d);
    }
}
/** @private */
function setAttributeSvg(svg, attributes) {
    let keys = Object.keys(attributes);
    for (let i = 0; i < keys.length; i++) {
        svg.setAttribute(keys[i], attributes[keys[i]]);
    }
}
/** @private */
function createSvgElement(elementType, attribute) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttributeSvg(element, attribute);
    return element;
}
/** @private */
function createSvg(id, width, height) {
    let svgObj = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
    return svgObj;
}
function getParentSvg(element, targetElement, canvas) {
    if (element && element.id) {
        if (targetElement && targetElement === 'selector') {
            return this.pdfViewer.adornerSvgLayer;
        }
    }
    return canvas;
}

/**
 * Implements the drawing functionalities
 */
/** @private */
function findNearestPoint(reference, start, end) {
    let shortestPoint;
    let shortest = Point.findLength(start, reference);
    let shortest1 = Point.findLength(end, reference);
    if (shortest > shortest1) {
        shortestPoint = end;
    }
    else {
        shortestPoint = start;
    }
    let angleBWStAndEnd = Point.findAngle(start, end);
    let angleBWStAndRef = Point.findAngle(shortestPoint, reference);
    let r = Point.findLength(shortestPoint, reference);
    let vaAngle = angleBWStAndRef + ((angleBWStAndEnd - angleBWStAndRef) * 2);
    return {
        x: (shortestPoint.x + r * Math.cos(vaAngle * Math.PI / 180)),
        y: (shortestPoint.y + r * Math.sin(vaAngle * Math.PI / 180))
    };
}
/** @private */
function findElementUnderMouse(obj, position, padding) {
    return findTargetElement(obj.wrapper, position, padding);
}
/** @private */
function findTargetElement(container, position, padding) {
    for (let i = container.children.length - 1; i >= 0; i--) {
        let element = container.children[i];
        if (element && element.bounds.containsPoint(position, 0)) {
            if (element instanceof Container) {
                let target = this.findTargetElement(element, position);
                if (target) {
                    return target;
                }
            }
            if (element.bounds.containsPoint(position, 0)) {
                return element;
            }
        }
    }
    if (container.bounds.containsPoint(position, padding) && container.style.fill !== 'none') {
        return container;
    }
    return null;
}
/** @private */
function intersect3(lineUtil1, lineUtil2) {
    let point = { x: 0, y: 0 };
    let l1 = lineUtil1;
    let l2 = lineUtil2;
    let d = (l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
    let na = (l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1);
    let nb = (l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1);
    if (d === 0) {
        return { enabled: false, intersectPt: point };
    }
    let ua = na / d;
    let ub = nb / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        point.x = l1.x1 + (ua * (l1.x2 - l1.x1));
        point.y = l1.y1 + (ua * (l1.y2 - l1.y1));
        return { enabled: true, intersectPt: point };
    }
    return { enabled: false, intersectPt: point };
}
/** @private */
function intersect2(start1, end1, start2, end2) {
    let point = { x: 0, y: 0 };
    let lineUtil1 = getLineSegment(start1.x, start1.y, end1.x, end1.y);
    let lineUtil2 = getLineSegment(start2.x, start2.y, end2.x, end2.y);
    let line3 = intersect3(lineUtil1, lineUtil2);
    if (line3.enabled) {
        return line3.intersectPt;
    }
    else {
        return point;
    }
}
/** @private */
function getLineSegment(x1, y1, x2, y2) {
    return { 'x1': Number(x1) || 0, 'y1': Number(y1) || 0, 'x2': Number(x2) || 0, 'y2': Number(y2) || 0 };
}
/** @private */
function getPoints(element, corners, padding) {
    let line = [];
    padding = padding || 0;
    let left = { x: corners.topLeft.x - padding, y: corners.topLeft.y };
    let right = { x: corners.topRight.x + padding, y: corners.topRight.y };
    let top = { x: corners.bottomRight.x, y: corners.bottomRight.y - padding };
    let bottom = { x: corners.bottomLeft.x, y: corners.bottomLeft.y + padding };
    line.push(left);
    line.push(right);
    line.push(top);
    line.push(bottom);
    return line;
}
/** @private */
function getBezierDirection(src, tar) {
    if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
        return src.x < tar.x ? 'right' : 'left';
    }
    else {
        return src.y < tar.y ? 'bottom' : 'top';
    }
}
/** @private */
function updateStyle(changedObject, target) {
    //since text style model is the super set of shape style model, we used text style model
    let style = target.style;
    let textElement = target;
    for (let key of Object.keys(changedObject)) {
        switch (key) {
            case 'fill':
                style.fill = changedObject.fill;
                if (style instanceof StrokeStyle) {
                    /* tslint:disable:no-string-literal */
                    style['fill'] = 'transparent';
                }
                break;
            case 'textOverflow':
                style.textOverflow = changedObject.textOverflow;
                break;
            case 'opacity':
                style.opacity = changedObject.opacity;
                break;
            case 'strokeColor':
                style.strokeColor = changedObject.strokeColor;
                break;
            case 'strokeDashArray':
                style.strokeDashArray = changedObject.strokeDashArray;
                break;
            case 'strokeWidth':
                style.strokeWidth = changedObject.strokeWidth;
                break;
            case 'bold':
                style.bold = changedObject.bold;
                break;
            case 'color':
                style.color = changedObject.color;
                break;
            case 'textWrapping':
                style.textWrapping = changedObject.textWrapping;
                break;
            case 'fontFamily':
                style.fontFamily = changedObject.fontFamily;
                break;
            case 'fontSize':
                style.fontSize = changedObject.fontSize;
                break;
            case 'italic':
                style.italic = changedObject.italic;
                break;
            case 'textAlign':
                style.textAlign = changedObject.textAlign;
                break;
            case 'whiteSpace':
                style.whiteSpace = changedObject.whiteSpace;
                break;
            case 'textDecoration':
                style.textDecoration = changedObject.textDecoration;
                break;
        }
    }
    if (target instanceof TextElement) {
        textElement.refreshTextElement();
    }
}
/** @private */
function scaleElement(element, sw, sh, refObject) {
    if (element.width !== undefined && element.height !== undefined) {
        element.width *= sw;
        element.height *= sh;
    }
    if (element instanceof Container) {
        let matrix = identityMatrix();
        let width = refObject.width || refObject.actualSize.width;
        let height = refObject.height || refObject.actualSize.height;
        if (width !== undefined && height !== undefined) {
            let x = refObject.offsetX - width * refObject.pivot.x;
            let y = refObject.offsetY - height * refObject.pivot.y;
            let refPoint = {
                x: x + width * refObject.pivot.x,
                y: y + height * refObject.pivot.y
            };
            refPoint = rotatePoint(refObject.rotateAngle, refObject.offsetX, refObject.offsetY, refPoint);
            rotateMatrix(matrix, -refObject.rotateAngle, refPoint.x, refPoint.y);
            //    scaleMatrix(matrix, sw, sh, refPoint.x, refPoint.y);
            rotateMatrix(matrix, refObject.rotateAngle, refPoint.x, refPoint.y);
            for (let child of element.children) {
                if (child.width !== undefined && child.height !== undefined) {
                    let newPosition = transformPointByMatrix(matrix, { x: child.offsetX, y: child.offsetY });
                    child.offsetX = newPosition.x;
                    child.offsetY = newPosition.y;
                    scaleElement(child, sw, sh, refObject);
                }
            }
        }
    }
}
/** @private */
function contains(mousePosition, corner, padding) {
    if (mousePosition.x >= corner.x - padding && mousePosition.x <= corner.x + padding) {
        if (mousePosition.y >= corner.y - padding && mousePosition.y <= corner.y + padding) {
            return true;
        }
    }
    return false;
}
/** @private */
function getPoint(x, y, w, h, angle, offsetX, offsetY, cornerPoint) {
    let pivot = { x: 0, y: 0 };
    let trans = identityMatrix();
    rotateMatrix(trans, angle, offsetX, offsetY);
    switch (cornerPoint.x) {
        case 0:
            switch (cornerPoint.y) {
                case 0:
                    pivot = transformPointByMatrix(trans, ({ x: x, y: y }));
                    break;
                case 0.5:
                    pivot = transformPointByMatrix(trans, ({ x: x, y: y + h / 2 }));
                    break;
                case 1:
                    pivot = transformPointByMatrix(trans, ({ x: x, y: y + h }));
                    break;
            }
            break;
        case 0.5:
            switch (cornerPoint.y) {
                case 0:
                    pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y }));
                    break;
                case 0.5:
                    pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y + h / 2 }));
                    break;
                case 1:
                    pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y + h }));
                    break;
            }
            break;
        case 1:
            switch (cornerPoint.y) {
                case 0:
                    pivot = transformPointByMatrix(trans, ({ x: x + w, y: y }));
                    break;
                case 0.5:
                    pivot = transformPointByMatrix(trans, ({ x: x + w, y: y + h / 2 }));
                    break;
                case 1:
                    pivot = transformPointByMatrix(trans, ({ x: x + w, y: y + h }));
                    break;
            }
            break;
    }
    return { x: pivot.x, y: pivot.y };
}

/**
 * Diagram component exported items
 */

/**
 * Diagram component exported items
 */

export { Thickness, Margin, Stop, Gradient, LinearGradient, RadialGradient, ShapeStyle, StrokeStyle, TextStyle, Canvas, Container, DrawingElement, ImageElement, PathElement, TextElement, RotateTransform, ElementAction, ConnectorConstraints, ThumbsConstraints, SelectorConstraints, NoOfSegments, MatrixTypes, Matrix, identityMatrix, transformPointByMatrix, transformPointsByMatrix, rotateMatrix, scaleMatrix, translateMatrix, multiplyMatrix, Point, Rect, Size, CanvasRenderer, refreshDiagramElements, DrawingRenderer, SvgRenderer, setAttributeSvg, createSvgElement, createSvg, getParentSvg, randomId, cornersPointsBeforeRotation, rotateSize, getBounds, textAlignToString, wordBreakToString, bBoxText, middleElement, whiteSpaceToString, rotatePoint, getOffset, findNearestPoint, findElementUnderMouse, findTargetElement, intersect3, intersect2, getLineSegment, getPoints, getBezierDirection, updateStyle, scaleElement, contains, getPoint, getChildNode, translatePoints, measurePath, measureText, getDiagramElement, createHtmlElement, setAttributeHtml, getAdornerLayerSvg, getSelectorElement, createMeasureElements, measureImage, processPathData, parsePathData, getRectanglePath, pathSegmentCollection, transformPath, updatedSegment, scalePathData, splitArrayCollection, getPathString, getString };
//# sourceMappingURL=ej2-drawings.es2015.js.map
