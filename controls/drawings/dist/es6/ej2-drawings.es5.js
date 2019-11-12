import { Browser, ChildProperty, Collection, ComplexFactory, Property, createElement } from '@syncfusion/ej2-base';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**   @private  */
var getGradientType = function (obj) {
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
var Thickness = /** @__PURE__ @class */ (function () {
    function Thickness(left, right, top, bottom) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
    return Thickness;
}());
/**
 * Defines the space to be left between an object and its immediate parent
 */
var Margin = /** @__PURE__ @class */ (function (_super) {
    __extends(Margin, _super);
    function Margin() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Margin;
}(ChildProperty));
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
var Stop = /** @__PURE__ @class */ (function (_super) {
    __extends(Stop, _super);
    function Stop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @private
     * Returns the name of class Stop
     */
    Stop.prototype.getClassName = function () {
        return 'Stop';
    };
    __decorate([
        Property('')
    ], Stop.prototype, "color", void 0);
    __decorate([
        Property(0)
    ], Stop.prototype, "offset", void 0);
    __decorate([
        Property(1)
    ], Stop.prototype, "opacity", void 0);
    return Stop;
}(ChildProperty));
/**
 * Paints the node with a smooth transition from one color to another color
 */
var Gradient = /** @__PURE__ @class */ (function (_super) {
    __extends(Gradient, _super);
    function Gradient() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Gradient;
}(ChildProperty));
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
var LinearGradient = /** @__PURE__ @class */ (function (_super) {
    __extends(LinearGradient, _super);
    function LinearGradient() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return LinearGradient;
}(Gradient));
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
var RadialGradient = /** @__PURE__ @class */ (function (_super) {
    __extends(RadialGradient, _super);
    function RadialGradient() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return RadialGradient;
}(Gradient));
/**
 * Defines the style of shape/path
 */
var ShapeStyle = /** @__PURE__ @class */ (function (_super) {
    __extends(ShapeStyle, _super);
    function ShapeStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ShapeStyle;
}(ChildProperty));
/**
 * Defines the stroke style of a path
 */
var StrokeStyle = /** @__PURE__ @class */ (function (_super) {
    __extends(StrokeStyle, _super);
    function StrokeStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('transparent')
    ], StrokeStyle.prototype, "fill", void 0);
    return StrokeStyle;
}(ShapeStyle));
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
var TextStyle = /** @__PURE__ @class */ (function (_super) {
    __extends(TextStyle, _super);
    function TextStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return TextStyle;
}(ShapeStyle));

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
var Size = /** @__PURE__ @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    // /**   @private  */
    // public isEmpty(): boolean {
    //     return this.height === 0 && this.width === 0;
    // }
    /**   @private  */
    Size.prototype.clone = function () {
        return new Size(this.width, this.height);
    };
    return Size;
}());

/**
 * Rect defines and processes rectangular regions
 */
var Rect = /** @__PURE__ @class */ (function () {
    function Rect(x, y, width, height) {
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
    Object.defineProperty(Rect.prototype, "left", {
        /**   @private  */
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        /**   @private  */
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "top", {
        /**   @private  */
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        /**   @private  */
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "topLeft", {
        /**   @private  */
        get: function () {
            return { x: this.left, y: this.top };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "topRight", {
        /**   @private  */
        get: function () {
            return { x: this.right, y: this.top };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottomLeft", {
        /**   @private  */
        get: function () {
            return { x: this.left, y: this.bottom };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottomRight", {
        /**   @private  */
        get: function () {
            return { x: this.right, y: this.bottom };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "middleLeft", {
        /**   @private  */
        get: function () {
            return { x: this.left, y: this.y + this.height / 2 };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "middleRight", {
        /**   @private  */
        get: function () {
            return { x: this.right, y: this.y + this.height / 2 };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "topCenter", {
        /**   @private  */
        get: function () {
            return { x: this.x + this.width / 2, y: this.top };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottomCenter", {
        /**   @private  */
        get: function () {
            return { x: this.x + this.width / 2, y: this.bottom };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "center", {
        /**   @private  */
        get: function () {
            return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
        },
        enumerable: true,
        configurable: true
    });
    /**   @private  */
    Rect.prototype.equals = function (rect1, rect2) {
        return rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height;
    };
    /**   @private  */
    Rect.prototype.uniteRect = function (rect) {
        var right = Math.max(Number.NaN === this.right || this.x === Number.MAX_VALUE ? rect.right : this.right, rect.right);
        var bottom = Math.max(Number.NaN === this.bottom || this.y === Number.MAX_VALUE ? rect.bottom : this.bottom, rect.bottom);
        this.x = Math.min(this.left, rect.left);
        this.y = Math.min(this.top, rect.top);
        this.width = right - this.x;
        this.height = bottom - this.y;
        return this;
    };
    /**   @private  */
    Rect.prototype.unitePoint = function (point) {
        if (this.x === Number.MAX_VALUE) {
            this.x = point.x;
            this.y = point.y;
            return;
        }
        var x = Math.min(this.left, point.x);
        var y = Math.min(this.top, point.y);
        var right = Math.max(this.right, point.x);
        var bottom = Math.max(this.bottom, point.y);
        this.x = x;
        this.y = y;
        this.width = right - this.x;
        this.height = bottom - this.y;
    };
    Rect.prototype.intersection = function (rect) {
        if (this.intersects(rect)) {
            var left = Math.max(this.left, rect.left);
            var top_1 = Math.max(this.top, rect.top);
            var right = Math.min(this.right, rect.right);
            var bottom = Math.min(this.bottom, rect.bottom);
            return new Rect(left, top_1, right - left, bottom - top_1);
        }
        return Rect.empty;
    };
    /**   @private  */
    Rect.prototype.Inflate = function (padding) {
        this.x -= padding;
        this.y -= padding;
        this.width += padding * 2;
        this.height += padding * 2;
        return this;
    };
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
    Rect.prototype.intersects = function (rect) {
        if (this.right < rect.left || this.left > rect.right || this.top > rect.bottom || this.bottom < rect.top) {
            return false;
        }
        return true;
    };
    /**   @private  */
    Rect.prototype.containsRect = function (rect) {
        return this.left <= rect.left && this.right >= rect.right && this.top <= rect.top && this.bottom >= rect.bottom;
    };
    /**   @private  */
    Rect.prototype.containsPoint = function (point, padding) {
        if (padding === void 0) { padding = 0; }
        return this.left - padding <= point.x && this.right + padding >= point.x
            && this.top - padding <= point.y && this.bottom + padding >= point.y;
    };
    Rect.prototype.toPoints = function () {
        var points = [];
        points.push(this.topLeft);
        points.push(this.topRight);
        points.push(this.bottomLeft);
        points.push(this.bottomRight);
        return points;
    };
    /**   @private  */
    Rect.toBounds = function (points) {
        var rect = new Rect();
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var pt = points_1[_i];
            rect.unitePoint(pt);
        }
        return rect;
    };
    Rect.prototype.scale = function (scaleX, scaleY) {
        this.width *= scaleX;
        this.height *= scaleY;
    };
    Rect.prototype.offset = function (offsetX, offsetY) {
        this.x += offsetX;
        this.y += offsetY;
    };
    /**   @private  */
    Rect.empty = new Rect(Number.MAX_VALUE, Number.MIN_VALUE, 0, 0);
    return Rect;
}());

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
var Matrix = /** @__PURE__ @class */ (function () {
    function Matrix(m11, m12, m21, m22, offsetX, offsetY, type) {
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
    return Matrix;
}());
/** @private */
function identityMatrix() {
    return new Matrix(1, 0, 0, 1, 0, 0, MatrixTypes.Identity);
}
/** @private */
function transformPointByMatrix(matrix, point) {
    var pt = multiplyPoint(matrix, point.x, point.y);
    return { x: Math.round(pt.x * 100) / 100, y: Math.round(pt.y * 100) / 100 };
}
/** @private */
function transformPointsByMatrix(matrix, points) {
    var transformedPoints = [];
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var point = points_1[_i];
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
function scaleMatrix(matrix, scaleX, scaleY, centerX, centerY) {
    if (centerX === void 0) { centerX = 0; }
    if (centerY === void 0) { centerY = 0; }
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
    var result = identityMatrix();
    result.type = !(centerX || centerY) ? MatrixTypes.Scaling : MatrixTypes.Scaling | MatrixTypes.Translation;
    setMatrix(result, scaleX, 0.0, 0.0, scaleY, centerX - scaleX * centerX, centerY - scaleY * centerY);
    return result;
}
/** @private */
function createRotationRadians(angle, centerX, centerY) {
    var result = identityMatrix();
    var num = Math.sin(angle);
    var num2 = Math.cos(angle);
    var offsetX = centerX * (1.0 - num2) + centerY * num;
    var offsetY = centerY * (1.0 - num2) - centerX * num;
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
            var num = y * matrix.m21 + matrix.offsetX;
            var num2 = x * matrix.m12 + matrix.offsetY;
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
    var type = matrix1.type;
    var type2 = matrix2.type;
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
        var num = type << 4 | type2;
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
        var result = identityMatrix();
        var m11New = matrix1.m11 * matrix2.m11 + matrix1.m12 * matrix2.m21;
        var m12New = matrix1.m11 * matrix2.m12 + matrix1.m12 * matrix2.m22;
        var m21New = matrix1.m21 * matrix2.m11 + matrix1.m22 * matrix2.m21;
        var m22New = matrix1.m21 * matrix2.m12 + matrix1.m22 * matrix2.m22;
        var offsetX_1 = matrix1.offsetX * matrix2.m11 + matrix1.offsetY * matrix2.m21 + matrix2.offsetX;
        var offsetY_1 = matrix1.offsetX * matrix2.m12 + matrix1.offsetY * matrix2.m22 + matrix2.offsetY;
        setMatrix(result, m11New, m12New, m21New, m22New, offsetX_1, offsetY_1);
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
    var offsetX = matrix1.offsetX;
    var offsetY = matrix1.offsetY;
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
    var child;
    var collection = [];
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        for (var i = 0; i < node.childNodes.length; i++) {
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
    var translatedPts = [];
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var point = points_1[_i];
        var pt1 = {
            x: element.offsetX - element.actualSize.width * element.pivot.x + point.x,
            y: element.offsetY - element.actualSize.height * element.pivot.y + point.y
        };
        var matrix = void 0;
        var angle = element.rotateAngle + element.parentTransform;
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
    var path = 'pathTable';
    if (!window[path]) {
        window[path] = {};
    }
    if (data) {
        var measureElement = 'measureElement';
        window[measureElement].style.visibility = 'visible';
        var svg = window[measureElement].children[2];
        var element = getChildNode(svg)[0];
        element.setAttribute('d', data);
        //let bounds: SVGRect = element.getBBox();
        var bounds = void 0;
        if (window[path][data]) {
            bounds = window[path][data];
        }
        else {
            window[path][data] = bounds = element.getBBox();
        }
        var svgBounds = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        window[measureElement].style.visibility = 'hidden';
        return svgBounds;
    }
    return new Rect(0, 0, 0, 0);
}
function getTextOptions(element, maxWidth) {
    var options = {
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
    var childNodes = [];
    var k = 0;
    var txtValue;
    var bounds1;
    var content = textValue || text.content;
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
                    var width = bBoxText(txtValue, text);
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
    var childNodes = [];
    var txtValue = '';
    var j = 0;
    var i = 0;
    var wrap = text.whiteSpace !== 'nowrap' ? true : false;
    var content = textValue || text.content;
    var eachLine = content.split('\n');
    var words;
    var newText;
    var existingWidth;
    var existingText;
    for (j = 0; j < eachLine.length; j++) {
        words = text.textWrapping !== 'NoWrap' ? eachLine[j].split(' ') : eachLine;
        for (i = 0; i < words.length; i++) {
            txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[i];
            newText = txtValue + (words[i + 1] || '');
            var width = bBoxText(newText, text);
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
    var wrapBounds = { x: 0, width: 0 };
    var k = 0;
    var txtWidth;
    var width;
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
    var bounds = new Size(0, 0);
    var childNodes;
    var wrapBounds;
    var options = getTextOptions(text, maxWidth);
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
    var diagramElement;
    var element;
    if (contentId) {
        element = document.getElementById(contentId);
    }
    diagramElement = (element) ? element.querySelector('#' + elementId) : document.getElementById(elementId);
    return diagramElement;
}
/** @private */
function createHtmlElement(elementType, attribute) {
    var element = createElement(elementType);
    setAttributeHtml(element, attribute);
    return element;
}
/** @private */
function setAttributeHtml(element, attributes) {
    var keys = Object.keys(attributes);
    for (var i = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
}
/**
 * @private
 */
function getAdornerLayerSvg(diagramId, index) {
    var adornerLayerSvg = null;
    var diagramElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
    var elementcoll;
    if (diagramElement) {
        elementcoll = diagramElement.getElementsByClassName('e-adorner-layer' + index);
        adornerLayerSvg = elementcoll[0];
    }
    return adornerLayerSvg;
}
/** @private */
function getSelectorElement(diagramId, index) {
    var adornerLayer = null;
    var adornerSvg = getAdornerLayerSvg(diagramId, index);
    if (adornerSvg) {
        adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement');
    }
    return adornerLayer;
}
/** @private */
function createMeasureElements() {
    var measureElement = 'measureElement';
    if (!window[measureElement]) {
        var divElement = createHtmlElement('div', {
            id: 'measureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        var text = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        var imageElement = void 0;
        imageElement = createHtmlElement('img', {});
        divElement.appendChild(imageElement);
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        divElement.appendChild(svg);
        var element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(element);
        var data = document.createTextNode('');
        var tSpan = document.createElementNS('http://www.w3.org/2000/svg', 'text');
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
    var measureElement = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    var imageElement = window[measureElement].children[1];
    imageElement.setAttribute('src', source);
    var bounds = imageElement.getBoundingClientRect();
    var width = bounds.width;
    var height = bounds.height;
    contentSize = new Size(width, height);
    window[measureElement].style.visibility = 'hidden';
    return contentSize;
}

/**
 * Implements the basic functionalities
 */
/** @private */
function randomId() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var id = '';
    var num;
    for (var i = 0; i < 5; i++) {
        if ('crypto' in window && 'getRandomValues' in crypto) {
            var count = new Uint16Array(1);
            // tslint:disable-next-line:no-any
            var intCrypto = window.msCrypto || window.crypto;
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
    var bounds = new Rect();
    var top = ele.offsetY - ele.actualSize.height * ele.pivot.y;
    var bottom = ele.offsetY + ele.actualSize.height * (1 - ele.pivot.y);
    var left = ele.offsetX - ele.actualSize.width * ele.pivot.x;
    var right = ele.offsetX + ele.actualSize.width * (1 - ele.pivot.x);
    var topLeft = { x: left, y: top };
    var topRight = { x: right, y: top };
    var bottomLeft = { x: left, y: bottom };
    var bottomRight = { x: right, y: bottom };
    bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
    return bounds;
}
/** @private */
function rotateSize(size, angle) {
    var matrix = identityMatrix();
    rotateMatrix(matrix, angle, 0, 0);
    var topLeft = transformPointByMatrix(matrix, { x: 0, y: 0 });
    var topRight = transformPointByMatrix(matrix, { x: size.width, y: 0 });
    var bottomLeft = transformPointByMatrix(matrix, { x: 0, y: size.height });
    var bottomRight = transformPointByMatrix(matrix, { x: size.width, y: size.height });
    var minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    var maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    return new Size(maxX - minX, maxY - minY);
}
/** @private */
function getBounds(element) {
    var bounds = new Rect();
    var corners;
    corners = cornersPointsBeforeRotation(element);
    var middleLeft = corners.middleLeft;
    var topCenter = corners.topCenter;
    var bottomCenter = corners.bottomCenter;
    var middleRight = corners.middleRight;
    var topLeft = corners.topLeft;
    var topRight = corners.topRight;
    var bottomLeft = corners.bottomLeft;
    var bottomRight = corners.bottomRight;
    element.corners = {
        topLeft: topLeft, topCenter: topCenter, topRight: topRight, middleLeft: middleLeft,
        middleRight: middleRight, bottomLeft: bottomLeft, bottomCenter: bottomCenter, bottomRight: bottomRight
    };
    if (element.rotateAngle !== 0 || element.parentTransform !== 0) {
        var matrix = identityMatrix();
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
    var state = '';
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
    var state = '';
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
    var measureElement = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    var svg = window[measureElement].children[2];
    var text = getChildNode(svg)[1];
    text.textContent = textContent;
    text.setAttribute('style', 'font-size:' + options.fontSize + 'px; font-family:'
        + options.fontFamily + ';font-weight:' + (options.bold ? 'bold' : 'normal'));
    var bBox = text.getBBox().width;
    window[measureElement].style.visibility = 'hidden';
    return bBox;
}
/** @private */
function middleElement(i, j) {
    var m = 0;
    m = (i + j) / 2;
    return m;
}
/** @private */
function whiteSpaceToString(value, wrap) {
    if (wrap === 'NoWrap' && value === 'PreserveAll') {
        return 'pre';
    }
    var state = '';
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
        var matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivotX, pivotY);
        return transformPointByMatrix(matrix, point);
    }
    return point;
}
/** @private */
function getOffset(topLeft, obj) {
    var offX = topLeft.x + obj.desiredSize.width * obj.pivot.x;
    var offY = topLeft.y + obj.desiredSize.height * obj.pivot.y;
    return {
        x: offX, y: offY
    };
}

/**
 * DiagramElement module defines the basic unit of diagram
 */
var DrawingElement = /** @__PURE__ @class */ (function () {
    function DrawingElement() {
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
    DrawingElement.prototype.setOffsetWithRespectToBounds = function (x, y, mode) {
        this.unitMode = mode;
        this.position = { x: x, y: y };
    };
    /**
     * Gets the position of the element with respect to its parent
     * @param size
     */
    DrawingElement.prototype.getAbsolutePosition = function (size) {
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
    };
    Object.defineProperty(DrawingElement.prototype, "outerBounds", {
        get: function () {
            return this.floatingBounds || this.bounds;
        },
        /**
         * used to set the outer bounds value
         * @private
         */
        set: function (bounds) {
            this.floatingBounds = bounds;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Measures the minimum space that the element requires
     * @param availableSize
     */
    DrawingElement.prototype.measure = function (availableSize) {
        var width = this.width !== undefined ? this.width : (availableSize.width || 0) - this.margin.left - this.margin.right;
        var height = this.height !== undefined ? this.height : (availableSize.height || 0) - this.margin.top - this.margin.bottom;
        this.desiredSize = new Size(width, height);
        if (this.isCalculateDesiredSize) {
            this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        }
        return this.desiredSize;
    };
    /**
     * Arranges the element
     * @param desiredSize
     */
    DrawingElement.prototype.arrange = function (desiredSize) {
        this.actualSize = desiredSize;
        this.updateBounds();
        return this.actualSize;
    };
    /**
     * Updates the bounds of the element
     */
    DrawingElement.prototype.updateBounds = function () {
        this.bounds = getBounds(this);
    };
    /**
     * Validates the size of the element with respect to its minimum and maximum size
     * @param desiredSize
     * @param availableSize
     */
    DrawingElement.prototype.validateDesiredSize = function (desiredSize, availableSize) {
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
    };
    return DrawingElement;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Container module is used to group related objects
 */
var Container = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //private members    
        _this.desiredBounds = undefined;
        /** @private */
        _this.measureChildren = true;
        /**   @private  */
        _this.prevRotateAngle = 0;
        return _this;
    }
    /**
     * returns whether the container has child elements or not
     */
    Container.prototype.hasChildren = function () {
        if (this.children !== undefined && this.children.length > 0) {
            return true;
        }
        return false;
    };
    /**
     * Measures the minimum space that the container requires
     *
     * @param availableSize
     */
    Container.prototype.measure = function (availableSize) {
        // measure the element and find the desired size
        this.desiredBounds = undefined;
        var desired = undefined;
        var child;
        var childBounds;
        if (this.hasChildren()) {
            //Measuring the children
            for (var i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (child.horizontalAlignment === 'Stretch' && !availableSize.width) {
                    availableSize.width = child.bounds.width;
                }
                if (child.verticalAlignment === 'Stretch' && !availableSize.height) {
                    availableSize.height = child.bounds.height;
                }
                var force = child.horizontalAlignment === 'Stretch' || child.verticalAlignment === 'Stretch';
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
                var offsetPt = {
                    x: this.desiredBounds.x + this.desiredBounds.width * this.pivot.x,
                    y: this.desiredBounds.y + this.desiredBounds.height * this.pivot.y
                };
                var newPoint = rotatePoint(this.rotateAngle, undefined, undefined, offsetPt);
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
    };
    /**
     * Arranges the container and its children
     * @param desiredSize
     */
    Container.prototype.arrange = function (desiredSize) {
        var child;
        var childBounds = this.desiredBounds;
        if (childBounds) {
            var x = this.offsetX;
            var y = this.offsetY;
            this.offsetX = childBounds.x + childBounds.width * this.pivot.x;
            this.offsetY = childBounds.y + childBounds.height * this.pivot.y;
            // container has rotateAngle
            if (this.hasChildren()) {
                //Measuring the children
                for (var i = 0; i < this.children.length; i++) {
                    child = this.children[i];
                    var arrange = false;
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
    };
    //protected methods
    /**
     * Stretches the child elements based on the size of the container
     * @param size
     */
    Container.prototype.stretchChildren = function (size) {
        if (this.hasChildren()) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
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
    };
    /**
     * Finds the offset of the child element with respect to the container
     * @param child
     * @param center
     */
    Container.prototype.findChildOffsetFromCenter = function (child, center) {
        var topLeft = { x: center.x - child.desiredSize.width / 2, y: center.y - child.desiredSize.height / 2 };
        var offset = getOffset(topLeft, child);
        //Rotate based on child rotate angle
        offset = rotatePoint(child.rotateAngle, center.x, center.y, offset);
        //Rotate based on parent pivot
        offset = rotatePoint(this.rotateAngle + this.parentTransform, this.offsetX, this.offsetY, offset);
        child.offsetX = offset.x;
        child.offsetY = offset.y;
    };
    //private methods - check its need
    Container.prototype.GetChildrenBounds = function (child) {
        var childSize;
        childSize = child.desiredSize.clone();
        var diffAngle = child.rotateAngle - this.rotateAngle;
        var refPoint = { x: child.offsetX, y: child.offsetY };
        var left = refPoint.x - childSize.width * child.pivot.x;
        var top = refPoint.y - childSize.height * child.pivot.y;
        var right = left + childSize.width;
        var bottom = top + childSize.height;
        var topLeft = { x: left, y: top };
        var topRight = { x: right, y: top };
        var bottomLeft = { x: left, y: bottom };
        var bottomRight = { x: right, y: bottom };
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
    };
    return Container;
}(DrawingElement));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * TextElement is used to display text/annotations
 */
var TextElement = /** @__PURE__ @class */ (function (_super) {
    __extends$3(TextElement, _super);
    /**
     * set the id for each element
     */
    function TextElement() {
        var _this = _super.call(this) || this;
        /**
         * sets or gets the image source
         */
        _this.textContent = '';
        /** @private */
        _this.canMeasure = true;
        /** @private */
        _this.canConsiderBounds = true;
        /** @private */
        _this.doWrap = true;
        _this.textNodes = [];
        /**
         * Defines the appearance of the text element
         */
        _this.style = {
            color: 'black', fill: 'transparent', strokeColor: 'black',
            strokeWidth: 1, fontFamily: 'Arial', fontSize: 12, whiteSpace: 'CollapseSpace',
            textWrapping: 'WrapWithOverflow', textAlign: 'Center', italic: false, bold: false,
            textDecoration: 'None', strokeDashArray: '', opacity: 1,
            textOverflow: 'Wrap'
        };
        _this.style.fill = 'transparent';
        _this.style.strokeColor = 'transparent';
        return _this;
    }
    Object.defineProperty(TextElement.prototype, "content", {
        /**
         * gets the content for the text element
         */
        get: function () {
            return this.textContent;
        },
        /**
         * sets the content for the text element
         */
        set: function (value) {
            if (this.textContent !== value) {
                this.textContent = value;
                this.isDirt = true;
                this.doWrap = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextElement.prototype, "childNodes", {
        /**
         * sets the content for the text element
         */
        get: function () {
            return this.textNodes;
        },
        /**
         * gets the content for the text element
         */
        set: function (value) {
            this.textNodes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextElement.prototype, "wrapBounds", {
        /**
         * gets the wrapBounds for the text
         */
        get: function () {
            return this.textWrapBounds;
        },
        /**
         * sets the wrapBounds for the text
         */
        set: function (value) {
            this.textWrapBounds = value;
        },
        enumerable: true,
        configurable: true
    });
    /** @private */
    TextElement.prototype.refreshTextElement = function () {
        this.isDirt = true;
    };
    /**
     * Measures the minimum size that is required for the text element
     * @param availableSize
     */
    TextElement.prototype.measure = function (availableSize) {
        var size;
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
    };
    /**
     * Arranges the text element
     * @param desiredSize
     */
    TextElement.prototype.arrange = function (desiredSize) {
        if (desiredSize.width !== this.actualSize.width || desiredSize.height !== this.actualSize.height || this.isDirt) {
            this.doWrap = true;
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        this.isDirt = false;
        return this.actualSize;
    };
    return TextElement;
}(DrawingElement));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Canvas module is used to define a plane(canvas) and to arrange the children based on margin
 */
var Canvas = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Canvas, _super);
    function Canvas() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Not applicable for canvas
         *  @private
         */
        _this.measureChildren = undefined;
        return _this;
    }
    /**
     * Measures the minimum space that the canvas requires
     * @param availableSize
     */
    Canvas.prototype.measure = function (availableSize) {
        var desired = undefined;
        var desiredBounds = undefined;
        if (this.hasChildren()) {
            //Measuring the children
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
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
                var childSize = child.desiredSize.clone();
                if (child.rotateAngle !== 0) {
                    childSize = rotateSize(childSize, child.rotateAngle);
                }
                var right = childSize.width + child.margin.right;
                var bottom = childSize.height + child.margin.bottom;
                var childBounds = new Rect(child.margin.left, child.margin.top, right, bottom);
                if (child.float) {
                    var position = child.getAbsolutePosition(childSize);
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
                var leftMargin = 0;
                var topMargin = 0;
                leftMargin = Math.max(desiredBounds.left, 0);
                topMargin = Math.max(desiredBounds.top, 0);
                desired = new Size(desiredBounds.width + leftMargin, desiredBounds.height + topMargin);
            }
        }
        desired = _super.prototype.validateDesiredSize.call(this, desired, availableSize);
        _super.prototype.stretchChildren.call(this, desired);
        this.desiredSize = desired;
        return desired;
    };
    /**
     * Arranges the child elements of the canvas
     */
    Canvas.prototype.arrange = function (desiredSize) {
        this.outerBounds = new Rect();
        if (this.hasChildren()) {
            var y = void 0;
            var x = void 0;
            y = this.offsetY - desiredSize.height * this.pivot.y;
            x = this.offsetX - desiredSize.width * this.pivot.x;
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if ((child.transform & RotateTransform.Parent) !== 0) {
                    child.parentTransform = this.parentTransform + this.rotateAngle;
                    var childSize = child.desiredSize.clone();
                    var topLeft = void 0;
                    var center = { x: 0, y: 0 };
                    var childX = x;
                    var childY = y;
                    if (child.relativeMode === 'Point') {
                        var position = child.getAbsolutePosition(desiredSize);
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
                        var rotateValue = {
                            x: this.offsetX + (child.rotateValue.x || 0),
                            y: this.offsetY + (child.rotateValue.y || 0)
                        };
                        var centerPoint = { x: this.offsetX, y: this.offsetY };
                        var angle = child.rotateValue.angle | 0;
                        var matrix = identityMatrix();
                        rotateMatrix(matrix, angle, centerPoint.x, centerPoint.y);
                        center = transformPointByMatrix(matrix, rotateValue);
                    }
                    _super.prototype.findChildOffsetFromCenter.call(this, child, center);
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
    };
    /**
     * Aligns the child element based on its parent
     * @param child
     * @param childSize
     * @param parentSize
     * @param x
     * @param y
     */
    Canvas.prototype.alignChildBasedOnParent = function (child, childSize, parentSize, x, y) {
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
    };
    /**
     * Aligns the child elements based on a point
     * @param child
     * @param x
     * @param y
     */
    Canvas.prototype.alignChildBasedOnaPoint = function (child, x, y) {
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
    };
    return Canvas;
}(Container));

/**
 * Diagram component exported items
 */

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ImageElement defines a basic image elements
 */
var ImageElement = /** @__PURE__ @class */ (function (_super) {
    __extends$4(ImageElement, _super);
    /**
     * set the id for each element
     */
    function ImageElement() {
        var _this = _super.call(this) || this;
        /**
         * sets or gets the image source
         */
        _this.imageSource = '';
        /**
         * sets scaling factor of the image
         */
        _this.imageScale = 'None';
        /**
         * sets the alignment of the image
         */
        _this.imageAlign = 'None';
        /**
         * Sets how to stretch the image
         */
        _this.stretch = 'Stretch';
        return _this;
    }
    Object.defineProperty(ImageElement.prototype, "source", {
        /**
         * Gets the source for the image element
         */
        get: function () {
            return this.imageSource;
        },
        /**
         * Sets the source for the image element
         */
        set: function (value) {
            this.imageSource = value;
            this.isDirt = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Measures minimum space that is required to render the image
     * @param availableSize
     */
    ImageElement.prototype.measure = function (availableSize) {
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
    };
    /**
     * Arranges the image
     * @param desiredSize
     */
    ImageElement.prototype.arrange = function (desiredSize) {
        this.actualSize = new Size(this.desiredSize.width, this.desiredSize.height);
        this.updateBounds();
        return this.actualSize;
    };
    return ImageElement;
}(DrawingElement));

/**
 * These utility methods help to process the data and to convert it to desired dimensions
 */
/** @private */
function processPathData(data) {
    var collection = [];
    var j;
    var arrayCollection = parsePathData(data);
    if (arrayCollection.length > 0) {
        for (var i = 0; i < arrayCollection.length; i++) {
            var ob = arrayCollection[i];
            var char = '';
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
    var tokenizer = /([a-z]+)|([+-]?(?:\d+\.?\d*|\.\d+))/gi;
    var current = [];
    var commands = [];
    var match = {};
    tokenizer.lastIndex = 0;
    var isExponential = false;
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
    var x = 0;
    var y = 0;
    var path = '';
    var points = [{ x: x + cornerRadius, y: y }, { x: x + width - cornerRadius, y: y },
        { x: x + width, y: y + cornerRadius }, { x: x + width, y: y + height - cornerRadius },
        { x: x + width - cornerRadius, y: y + height }, { x: x + cornerRadius, y: y + height },
        { x: x, y: y + height - cornerRadius }, { x: x, y: y + cornerRadius }
    ];
    var corners = [{ x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }];
    var corner = 0;
    var point2;
    var next;
    path = 'M' + points[0].x + ' ' + points[0].y;
    var i;
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
    var x0;
    var y0;
    var x1;
    var y1;
    var x2;
    var y2;
    var x;
    var y;
    var length;
    var i;
    var segments = [];
    for (x = 0, y = 0, i = 0, length = collection.length; i < length; ++i) {
        var obj = collection[i];
        var seg = obj;
        var char = '';
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
        var prev = segments[segments.length - 1];
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
                    var ctrl = void 0;
                    if (prev.command === 'C' || prev.command === 'S') {
                        ctrl = { x: prev.x2, y: prev.y2 };
                    }
                    else {
                        ctrl = { x: x0, y: y0 };
                    }
                    var cpt2 = { x: 2 * x0 - ctrl.x, y: 2 * y0 - ctrl.y };
                    segments.push({ command: 'C', x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x2: x2, y2: y2, x: x, y: y });
                }
                break;
            case 'Q':
                //ctx.quadraticCurveTo(x1, y1, x, y);
                segments.push({ command: 'Q', x0: x0, y0: y0, x1: x1, y1: y1, x: x, y: y });
                break;
            case 'T':
                if (prev) {
                    var ctrl = void 0;
                    if (prev.command === 'Q') {
                        ctrl = { x: prev.x1, y: prev.y1 };
                    }
                    else {
                        ctrl = { x: x0, y: y0 };
                    }
                    var cpt2 = { x: 2 * x0 - ctrl.x, y: 2 * y0 - ctrl.y };
                    segments.push({ command: 'Q', x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x: x, y: y });
                }
                break;
            case 'A':
                var newSeg = seg;
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
    var x1;
    var y1;
    var x2;
    var y2;
    var x;
    var y;
    var length;
    var i;
    var newSeg;
    for (x = 0, y = 0, i = 0, length = arr.length; i < length; ++i) {
        var obj = arr[i];
        var seg = obj;
        var char = seg.command;
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
        var scaledPath = { x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2, r1: seg.r1, r2: seg.r2 };
        newSeg = updatedSegment(seg, char, scaledPath, s, sX, sY);
        if (newSeg) {
            arr[i] = newSeg;
        }
        // Record the start of a subpath
        
    }
    var pathData = getPathString(arr);
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
            var r1 = obj.r1;
            var r2 = obj.r2;
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
    var x0;
    var y0;
    var x1;
    var y1;
    var x2;
    var y2;
    var x;
    var y;
    var length;
    var i;
    for (x = 0, y = 0, i = 0, length = arrayCollection.length; i < length; ++i) {
        var path = arrayCollection[i];
        var seg = path;
        var char = seg.command;
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
            var newSeg = void 0;
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
    var getNewString = '';
    var i;
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
    var string = '';
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
            var cmd = obj.command;
            var ang = obj.angle;
            var l = (obj.largeArc ? '1' : '0');
            var s = (obj.sweep ? '1' : '0');
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

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * PathElement takes care of how to align the path based on offsetX and offsetY
 */
var PathElement = /** @__PURE__ @class */ (function (_super) {
    __extends$5(PathElement, _super);
    /**
     * set the id for each element
     */
    function PathElement() {
        var _this = _super.call(this) || this;
        /**
         * Gets or sets the geometry of the path element
         */
        _this.pathData = '';
        /**
         * Gets/Sets whether the path has to be transformed to fit the given x,y, width, height
         */
        _this.transformPath = true;
        /**
         * Gets/Sets the equivalent path, that will have the origin as 0,0
         */
        _this.absolutePath = '';
        /**   @private  */
        _this.canMeasurePath = false;
        //Private variables
        /**   @private  */
        _this.absoluteBounds = new Rect();
        return _this;
    }
    Object.defineProperty(PathElement.prototype, "data", {
        /**
         * Gets the geometry of the path element
         */
        get: function () {
            return this.pathData;
        },
        /**
         * Sets the geometry of the path element
         */
        set: function (value) {
            if (this.pathData !== value) {
                this.pathData = value;
                this.isDirt = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Measures the minimum space that is required to render the element
     * @param availableSize
     */
    PathElement.prototype.measure = function (availableSize) {
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
    };
    /**
     * Arranges the path element
     * @param desiredSize
     */
    PathElement.prototype.arrange = function (desiredSize) {
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
    };
    /**
     * Translates the path to 0,0 and scales the path based on the actual size
     * @param pathData
     * @param bounds
     * @param actualSize
     */
    PathElement.prototype.updatePath = function (pathData, bounds, actualSize) {
        var isScale = false;
        var newPathString = '';
        var scaleX = -bounds.x;
        var scaleY = -bounds.y;
        var arrayCollection = [];
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
    };
    return PathElement;
}(DrawingElement));

/**
 * Diagram component exported items
 */

/**
 * Diagram component exported items
 */

/**
 * Diagram component exported items
 */

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines and processes coordinates
 */
var Point = /** @__PURE__ @class */ (function (_super) {
    __extends$6(Point, _super);
    function Point() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**   @private  */
    Point.equals = function (point1, point2) {
        if (point1 === point2) {
            return true;
        }
        if (!point1 || !point2) {
            return false;
        }
        return !point1 || !point2 || point1.x === point2.x && point1.y === point2.y;
    };
    /**
     * check whether the points are given
     */
    Point.isEmptyPoint = function (point) {
        if (point.x && point.y) {
            return false;
        }
        return true;
    };
    /**   @private  */
    Point.transform = function (point, angle, length) {
        var pt = { x: 0, y: 0 };
        pt.x = Math.round((point.x + length * Math.cos(angle * Math.PI / 180)) * 100) / 100;
        pt.y = Math.round((point.y + length * Math.sin(angle * Math.PI / 180)) * 100) / 100;
        return pt;
    };
    /**   @private  */
    Point.findLength = function (s, e) {
        var length = Math.sqrt(Math.pow((s.x - e.x), 2) + Math.pow((s.y - e.y), 2));
        return length;
    };
    /**   @private  */
    Point.findAngle = function (point1, point2) {
        var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        angle = (180 * angle / Math.PI);
        angle %= 360;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    };
    /**   @private  */
    Point.distancePoints = function (pt1, pt2) {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    };
    /**   @private  */
    Point.getLengthFromListOfPoints = function (points) {
        var length = 0;
        for (var j = 0; j < points.length - 1; j++) {
            length += this.distancePoints(points[j], points[j + 1]);
        }
        return length;
    };
    /**   @private  */
    Point.adjustPoint = function (source, target, isStart, length) {
        var pt = isStart ? { x: source.x, y: source.y } : { x: target.x, y: target.y };
        var angle;
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
    };
    /**   @private  */
    Point.direction = function (pt1, pt2) {
        if (Math.abs(pt2.x - pt1.x) > Math.abs(pt2.y - pt1.y)) {
            return pt1.x < pt2.x ? 'Right' : 'Left';
        }
        else {
            return pt1.y < pt2.y ? 'Bottom' : 'Top';
        }
    };
    /**
     * @private
     * Returns the name of class Point
     */
    Point.prototype.getClassName = function () {
        return 'Point';
    };
    __decorate$1([
        Property(0)
    ], Point.prototype, "x", void 0);
    __decorate$1([
        Property(0)
    ], Point.prototype, "y", void 0);
    return Point;
}(ChildProperty));

/**
 * Diagram component exported items
 */

// import { overFlow } from './../utility/base-util';
/**
 * Canvas Renderer
 */
/** @private */
var CanvasRenderer = /** @__PURE__ @class */ (function () {
    function CanvasRenderer() {
    }
    /**   @private  */
    CanvasRenderer.getContext = function (canvas) {
        return canvas.getContext('2d');
    };
    CanvasRenderer.prototype.setStyle = function (canvas, style) {
        var ctx = CanvasRenderer.getContext(canvas);
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
        var dashArray = [];
        if (style.dashArray) {
            dashArray = this.parseDashArray(style.dashArray);
        }
        ctx.setLineDash(dashArray);
        ctx.fillStyle = style.fill;
    };
    CanvasRenderer.prototype.rotateContext = function (canvas, angle, x, y) {
        var ctx = CanvasRenderer.getContext(canvas);
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-x, -y);
    };
    CanvasRenderer.prototype.setFontStyle = function (canvas, text) {
        var ctx = CanvasRenderer.getContext(canvas);
        var font = '';
        if (text.italic) {
            font += 'italic ';
        }
        if (text.bold) {
            font += 'bold ';
        }
        font += (text.fontSize) + 'px ';
        font += text.fontFamily;
        ctx.font = font;
    };
    /**   @private  */
    CanvasRenderer.prototype.parseDashArray = function (dashArray) {
        var dashes = [];
        var separator = dashArray.indexOf(' ') !== -1 ? ' ' : ',';
        var splittedDashes = dashArray.split(separator);
        for (var _i = 0, splittedDashes_1 = splittedDashes; _i < splittedDashes_1.length; _i++) {
            var i = splittedDashes_1[_i];
            dashes.push(Number(i));
        }
        return dashes;
    };
    //Rendering Part
    /**   @private  */
    CanvasRenderer.prototype.drawRectangle = function (canvas, options) {
        if (options.visible === true) {
            if (options.cornerRadius) {
                options.data = getRectanglePath(options.cornerRadius, options.height, options.width);
                this.drawPath(canvas, options);
            }
            else {
                var ctx = CanvasRenderer.getContext(canvas);
                ctx.save();
                ctx.beginPath();
                var cornerRadius = options.cornerRadius;
                var pivotX = options.x + options.width * options.pivotX;
                var pivotY = options.y + options.height * options.pivotY;
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
    };
    /**   @private  */
    CanvasRenderer.prototype.drawPath = function (canvas, options) {
        var collection = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        var ctx = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        var pivotY = options.y + options.height * options.pivotY;
        var pivotX = options.x + options.width * options.pivotX;
        this.rotateContext(canvas, options.angle, pivotX, pivotY);
        this.setStyle(canvas, options);
        ctx.translate(options.x, options.y);
        this.renderPath(canvas, options, collection);
        ctx.fill();
        ctx.translate(-options.x, -options.y);
        ctx.stroke();
        ctx.restore();
    };
    /**   @private  */
    CanvasRenderer.prototype.renderPath = function (canvas, options, collection) {
        if (options.visible === true) {
            var ctx = CanvasRenderer.getContext(canvas);
            var x0 = void 0;
            var y0 = void 0;
            var x1 = void 0;
            var y1 = void 0;
            var x2 = void 0;
            var y2 = void 0;
            var x = void 0;
            var y = void 0;
            var length_1;
            var i = void 0;
            var segs = collection;
            for (x = 0, y = 0, i = 0, length_1 = segs.length; i < length_1; ++i) {
                var obj = segs[i];
                var seg = obj;
                var char = seg.command;
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
                        var curr = { x: x0, y: y0 };
                        var rx = seg.r1;
                        var ry = seg.r2;
                        var xAxisRotation = seg.angle * (Math.PI / 180.0);
                        var largeArc = seg.largeArc;
                        var sweep = seg.sweep;
                        var cp = { x: x, y: y };
                        var currp = {
                            x: Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                            y: -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                        };
                        var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                        if (l > 1) {
                            rx *= Math.sqrt(l);
                            ry *= Math.sqrt(l);
                        }
                        var k = (Math.pow(ry, 2) * Math.pow(currp.x, 2));
                        var s = (largeArc === sweep ? -1 : 1) * Math.sqrt(((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - k) /
                            (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));
                        if (isNaN(s)) {
                            s = 0;
                        }
                        var cpp = { x: s * rx * currp.y / ry, y: s * -ry * currp.x / rx };
                        var centp = {
                            x: (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                            y: (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                        };
                        var a1 = this.a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                        var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                        var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                        var ad = this.a(u, v);
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
                            var ra = rx > ry ? rx : ry;
                            var sx = rx > ry ? 1 : rx / ry;
                            var sy = rx > ry ? ry / rx : 1;
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
    };
    /**   @private  */
    CanvasRenderer.prototype.drawText = function (canvas, options) {
        if (options.content && options.visible === true) {
            var ctx = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options);
            var pivotX = options.x + options.width * options.pivotX;
            var pivotY = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
            this.setFontStyle(canvas, options);
            var i = 0;
            var childNodes = [];
            childNodes = options.childNodes;
            var wrapBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                var position = this.labelAlign(options, wrapBounds, childNodes);
                for (i = 0; i < childNodes.length; i++) {
                    var child = childNodes[i];
                    var offsetX = position.x + child.x - wrapBounds.x;
                    var offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8);
                    // if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                    //     child.text = overFlow(child.text, options);
                    // }
                    ctx.fillText(child.text, offsetX, offsetY);
                    if (options.textDecoration === 'Underline'
                        || options.textDecoration === 'Overline'
                        || options.textDecoration === 'LineThrough') {
                        var startPointX = offsetX;
                        var startPointY = void 0;
                        var textlength = ctx.measureText(child.text).width;
                        var endPointX = offsetX + textlength;
                        var endPointY = void 0;
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
    };
    //end region
    // vector magnitude
    CanvasRenderer.prototype.m = function (v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); };
    // ratio between two vectors
    CanvasRenderer.prototype.r = function (u, v) { return (u[0] * v[0] + u[1] * v[1]) / (this.m(u) * this.m(v)); };
    // angle between two vectors
    CanvasRenderer.prototype.a = function (u, v) { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(this.r(u, v)); };
    CanvasRenderer.prototype.getMeetOffset = function (arg, res, dest) {
        var max = Math.max(res, dest);
        var min = Math.min(res, dest);
        switch (arg) {
            case 'min': return 0;
            case 'mid': return (max - min) / 2;
            case 'max': return max - min;
            default: return 0;
        }
    };
    CanvasRenderer.prototype.getSliceOffset = function (arg, res, dest, src) {
        switch (arg) {
            case 'min': return 0;
            case 'mid': return (res - dest) / 2 * src / res;
            case 'max': return (res - dest) * src / res;
            default: return 0;
        }
    };
    CanvasRenderer.prototype.image = function (ctx, image, x, y, width, height, alignOptions) {
        ctx.beginPath();
        var srcWidth = image.width;
        var srcHeight = image.height;
        var destinationW = width;
        var destinationH = height;
        var resultWidth = 0;
        var resultHeight = 0;
        ctx.globalAlpha = alignOptions.opacity;
        if (alignOptions && alignOptions.alignment !== 'None') {
            var xalign = alignOptions.alignment.toLowerCase().substr(1, 3);
            var yalign = alignOptions.alignment.toLowerCase().substr(5, 3);
            if (alignOptions.scale === 'Slice') {
                var a = function () {
                    resultWidth = destinationW;
                    resultHeight = srcHeight * destinationW / srcWidth;
                };
                var b = function () {
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
                var x1 = this.getSliceOffset(xalign, resultWidth, destinationW, srcWidth);
                var y1 = this.getSliceOffset(yalign, resultHeight, destinationH, srcHeight);
                var sWidth = srcWidth - x1;
                var sHeight = srcHeight - y1;
                var dWidth = resultWidth - (x1 * (resultWidth / srcWidth));
                var dHeight = resultHeight - (y1 * (resultHeight / srcHeight));
                var canvas1 = createHtmlElement('canvas', { 'width': width.toString(), 'height': height.toString() });
                var ctx1 = canvas1.getContext('2d');
                ctx1.drawImage(image, x1, y1, sWidth, sHeight, 0, 0, dWidth, dHeight);
                ctx.drawImage(canvas1, x, y, width, height);
            }
            else if (alignOptions.scale === 'Meet') {
                var srcRatio = (srcHeight / srcWidth);
                var destRatio = (destinationH / destinationW);
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
    };
    // text utility
    CanvasRenderer.prototype.loadImage = function (ctx, obj, canvas, pivotX, pivotY) {
        this.rotateContext(canvas, obj.angle, pivotX, pivotY);
        var image = new Image();
        image.src = obj.source;
        this.image(ctx, image, obj.x, obj.y, obj.width, obj.height, obj);
    };
    /**   @private  */
    CanvasRenderer.prototype.drawImage = function (canvas, obj, parentSvg, fromPalette) {
        var _this = this;
        if (obj.visible) {
            var ctx_1 = CanvasRenderer.getContext(canvas);
            ctx_1.save();
            var pivotX_1 = obj.x + obj.width * obj.pivotX;
            var pivotY_1 = obj.y + obj.height * obj.pivotY;
            var imageObj = new Image();
            imageObj.src = obj.source;
            var id = ctx_1.canvas.id.split('_');
            var value = id[id.length - 1] === ('diagram' || 'diagramLayer') ? true : false;
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
                this.loadImage(ctx_1, obj, canvas, pivotX_1, pivotY_1);
            }
            else {
                imageObj.onload = function () {
                    _this.loadImage(ctx_1, obj, canvas, pivotX_1, pivotY_1);
                };
            }
            ctx_1.restore();
        }
    };
    /**   @private  */
    CanvasRenderer.prototype.labelAlign = function (text, wrapBounds, childNodes) {
        var bounds = new Size(wrapBounds.width, childNodes.length * (text.fontSize * 1.2));
        var position = { x: 0, y: 0 };
        var labelX = text.x;
        var labelY = text.y;
        var offsetx = text.width * 0.5;
        var offsety = text.height * 0.5;
        var pointx = offsetx;
        var pointy = offsety;
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
    };
    return CanvasRenderer;
}());
function refreshDiagramElements(canvas, drawingObjects, renderer) {
    for (var i = 0; i < drawingObjects.length; i++) {
        renderer.renderElement(drawingObjects[i], canvas, undefined);
    }
}

/**
 * Renderer module is used to render basic diagram elements
 */
/** @private */
var DrawingRenderer = /** @__PURE__ @class */ (function () {
    function DrawingRenderer(name, isSvgMode) {
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
    DrawingRenderer.prototype.renderElement = function (element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue) {
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
    };
    /**   @private  */
    DrawingRenderer.prototype.renderImageElement = function (element, canvas, transform, parentSvg, fromPalette) {
        var options = this.getBaseAttributes(element, transform);
        options.cornerRadius = 0;
        // this.renderer.drawRectangle(canvas as HTMLCanvasElement, options as RectAttributes);
        // let sx: number; let sy: number;
        var imageWidth;
        var imageHeight;
        var sourceWidth;
        var sourceHeight;
        if (element.stretch === 'Stretch') {
            imageWidth = element.actualSize.width;
            imageHeight = element.actualSize.height;
        }
        else {
            var contentWidth = element.contentSize.width;
            var contentHeight = element.contentSize.height;
            var widthRatio = options.width / contentWidth;
            var heightRatio = options.height / contentHeight;
            var ratio = void 0;
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
    };
    /**   @private  */
    DrawingRenderer.prototype.renderPathElement = function (element, canvas, transform, parentSvg, fromPalette) {
        var options = this.getBaseAttributes(element, transform);
        options.data = element.absolutePath;
        options.data = element.absolutePath;
        var ariaLabel = element.id;
        if (!this.isSvgMode) {
            options.x = options.x;
            options.y = options.y;
        }
        this.renderer.drawPath(canvas, options);
    };
    /**   @private  */
    DrawingRenderer.prototype.renderTextElement = function (element, canvas, transform, parentSvg, fromPalette) {
        var options = this.getBaseAttributes(element, transform);
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
        var ariaLabel = element.content ? element.content : element.id;
        this.renderer.drawRectangle(canvas, options);
        this.renderer.drawText(canvas, options);
    };
    /**   @private  */
    DrawingRenderer.prototype.renderContainer = function (group, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue) {
        transform = { tx: 0, ty: 0, scale: 1 };
        if (this.diagramId) {
            parentSvg = parentSvg;
        }
        this.renderRect(group, canvas, transform, parentSvg);
        if (group.hasChildren()) {
            var parentG = void 0;
            for (var _i = 0, _a = group.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.renderElement(child, parentG || canvas, htmlLayer, transform, parentSvg, true, fromPalette, indexValue);
            }
        }
    };
    /**   @private  */
    DrawingRenderer.prototype.renderRect = function (element, canvas, transform, parentSvg) {
        var options = this.getBaseAttributes(element, transform);
        options.cornerRadius = element.cornerRadius || 0;
        var ariaLabel = element.id;
        this.renderer.drawRectangle(canvas, options);
    };
    /**   @private  */
    DrawingRenderer.prototype.getBaseAttributes = function (element, transform) {
        var options = {
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
    };
    return DrawingRenderer;
}());

/**
 * SVG Renderer
 */
/** @private */
var SvgRenderer = /** @__PURE__ @class */ (function () {
    function SvgRenderer() {
    }
    /**   @private  */
    SvgRenderer.prototype.parseDashArray = function (dashArray) {
        var dashes = [];
        return dashes;
    };
    /**   @private  */
    SvgRenderer.prototype.drawRectangle = function (svg, options, diagramId, onlyRect, isSelector, parentSvg, ariaLabel) {
        var id;
        if (options.id === svg.id) {
            id = options.id + '_container';
        }
        else {
            id = options.id;
        }
        var rect;
        if (!rect || isSelector) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            svg.appendChild(rect);
        }
        var attr = {
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
        var poiterEvents = 'pointer-events';
        if (!ariaLabel) {
            attr[poiterEvents] = 'none';
        }
        setAttributeSvg(rect, attr);
        this.setSvgStyle(rect, options, diagramId);
    };
    /**   @private  */
    SvgRenderer.prototype.updateSelectionRegion = function (gElement, options) {
        var rect;
        rect = gElement.parentNode.getElementById(options.id);
        var attr;
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
    };
    /**   @private  */
    SvgRenderer.prototype.createGElement = function (elementType, attribute) {
        var gElement = createSvgElement(elementType, attribute);
        return gElement;
    };
    /** @private */
    SvgRenderer.prototype.drawCircle = function (gElement, options, enableSelector, ariaLabel) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.setSvgStyle(circle, options);
        var classval = options.class || '';
        if (!enableSelector) {
            classval += ' e-disabled';
        }
        var attr = {
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
    };
    /**   @private  */
    SvgRenderer.prototype.setSvgStyle = function (svg, style, diagramId) {
        if (style.canApplyStyle || style.canApplyStyle === undefined) {
            if (style.fill === 'none') {
                style.fill = 'transparent';
            }
            if (style.stroke === 'none') {
                style.stroke = 'transparent';
            }
            var dashArray = [];
            var fill = void 0;
            if (style.dashArray !== undefined) {
                var canvasRenderer = new CanvasRenderer();
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
    };
    //end region
    // text utility
    /**   @private  */
    SvgRenderer.prototype.svgLabelAlign = function (text, wrapBound, childNodes) {
        var bounds = new Size(wrapBound.width, childNodes.length * (text.fontSize * 1.2));
        var pos = { x: 0, y: 0 };
        var x = 0;
        var y = 1.2;
        var offsetX = text.width * 0.5;
        var offsety = text.height * 0.5;
        var pointX = offsetX;
        var pointY = offsety;
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
    };
    /** @private */
    SvgRenderer.prototype.drawLine = function (gElement, options) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.setSvgStyle(line, options);
        var pivotX = options.x + options.width * options.pivotX;
        var pivotY = options.y + options.height * options.pivotY;
        var attr = {
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
    };
    /**   @private  */
    SvgRenderer.prototype.drawPath = function (svg, options, diagramId, isSelector, parentSvg, ariaLabel) {
        var id;
        var x = Math.floor((Math.random() * 10) + 1);
        id = svg.id + '_shape' + x.toString();
        var collection = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        var shadowElement;
        if (parentSvg) {
            shadowElement = parentSvg.getElementById(options.id + '_groupElement_shadow');
            if (shadowElement) {
                shadowElement.parentNode.removeChild(shadowElement);
            }
        }
        var path;
        if (parentSvg) {
            path = parentSvg.getElementById(options.id);
        }
        if (!path || isSelector) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svg.appendChild(path);
        }
        this.renderPath(path, options, collection);
        var attr = {
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
    };
    /**   @private  */
    SvgRenderer.prototype.renderPath = function (svg, options, collection) {
        var x1;
        var y1;
        var x2;
        var y2;
        var x;
        var y;
        var length;
        var i;
        var segments = collection;
        var d = '';
        for (x = 0, y = 0, i = 0, length = segments.length; i < length; ++i) {
            var obj = segments[i];
            var segment = obj;
            var char = segment.command;
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
    };
    return SvgRenderer;
}());
/** @private */
function setAttributeSvg(svg, attributes) {
    var keys = Object.keys(attributes);
    for (var i = 0; i < keys.length; i++) {
        svg.setAttribute(keys[i], attributes[keys[i]]);
    }
}
/** @private */
function createSvgElement(elementType, attribute) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttributeSvg(element, attribute);
    return element;
}
/** @private */
function createSvg(id, width, height) {
    var svgObj = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
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
    var shortestPoint;
    var shortest = Point.findLength(start, reference);
    var shortest1 = Point.findLength(end, reference);
    if (shortest > shortest1) {
        shortestPoint = end;
    }
    else {
        shortestPoint = start;
    }
    var angleBWStAndEnd = Point.findAngle(start, end);
    var angleBWStAndRef = Point.findAngle(shortestPoint, reference);
    var r = Point.findLength(shortestPoint, reference);
    var vaAngle = angleBWStAndRef + ((angleBWStAndEnd - angleBWStAndRef) * 2);
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
    for (var i = container.children.length - 1; i >= 0; i--) {
        var element = container.children[i];
        if (element && element.bounds.containsPoint(position, 0)) {
            if (element instanceof Container) {
                var target = this.findTargetElement(element, position);
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
    var point = { x: 0, y: 0 };
    var l1 = lineUtil1;
    var l2 = lineUtil2;
    var d = (l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
    var na = (l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1);
    var nb = (l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1);
    if (d === 0) {
        return { enabled: false, intersectPt: point };
    }
    var ua = na / d;
    var ub = nb / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        point.x = l1.x1 + (ua * (l1.x2 - l1.x1));
        point.y = l1.y1 + (ua * (l1.y2 - l1.y1));
        return { enabled: true, intersectPt: point };
    }
    return { enabled: false, intersectPt: point };
}
/** @private */
function intersect2(start1, end1, start2, end2) {
    var point = { x: 0, y: 0 };
    var lineUtil1 = getLineSegment(start1.x, start1.y, end1.x, end1.y);
    var lineUtil2 = getLineSegment(start2.x, start2.y, end2.x, end2.y);
    var line3 = intersect3(lineUtil1, lineUtil2);
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
    var line = [];
    padding = padding || 0;
    var left = { x: corners.topLeft.x - padding, y: corners.topLeft.y };
    var right = { x: corners.topRight.x + padding, y: corners.topRight.y };
    var top = { x: corners.bottomRight.x, y: corners.bottomRight.y - padding };
    var bottom = { x: corners.bottomLeft.x, y: corners.bottomLeft.y + padding };
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
    var style = target.style;
    var textElement = target;
    for (var _i = 0, _a = Object.keys(changedObject); _i < _a.length; _i++) {
        var key = _a[_i];
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
        var matrix = identityMatrix();
        var width = refObject.width || refObject.actualSize.width;
        var height = refObject.height || refObject.actualSize.height;
        if (width !== undefined && height !== undefined) {
            var x = refObject.offsetX - width * refObject.pivot.x;
            var y = refObject.offsetY - height * refObject.pivot.y;
            var refPoint = {
                x: x + width * refObject.pivot.x,
                y: y + height * refObject.pivot.y
            };
            refPoint = rotatePoint(refObject.rotateAngle, refObject.offsetX, refObject.offsetY, refPoint);
            rotateMatrix(matrix, -refObject.rotateAngle, refPoint.x, refPoint.y);
            //    scaleMatrix(matrix, sw, sh, refPoint.x, refPoint.y);
            rotateMatrix(matrix, refObject.rotateAngle, refPoint.x, refPoint.y);
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.width !== undefined && child.height !== undefined) {
                    var newPosition = transformPointByMatrix(matrix, { x: child.offsetX, y: child.offsetY });
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
    var pivot = { x: 0, y: 0 };
    var trans = identityMatrix();
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
//# sourceMappingURL=ej2-drawings.es5.js.map
