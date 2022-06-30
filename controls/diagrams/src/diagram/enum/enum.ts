/**
 * enum module defines the public enumerations
 */


/**
 * @private
 */
export enum BlazorAction {
    /** Return the layout value is true when doLayout is called   */
    Default = 0,
    /** Need to return the layout value when doLayout is called  */
    expandNode = 1 << 1,
    /** Enabled during the mouse interaction  */
    interaction = 1 << 2,
    /** Enable when the group action start in history */
    GroupingInProgress = 1 << 3,
    /** Enable when the group action start to clone another group node */
    GroupClipboardInProcess = 1 << 4,
    /** Enable when the clear the object to prevent the server update */
    ClearObject = 1 << 5
}
/**
 * Defines how the diagram elements have to be aligned with respect to its immediate parent
 * * Stretch - Stretches the diagram element throughout its immediate parent
 * * Left - Aligns the diagram element at the left of its immediate parent
 * * Right - Aligns the diagram element at the right of its immediate parent
 * * Center - Aligns the diagram element at the center of its immediate parent
 * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
 */
export type HorizontalAlignment =
    /**
     * Stretch - Stretches the diagram element throughout its immediate parent
     */
    'Stretch' |
    /**
     * Left - Aligns the diagram element at the left of its immediate parent
     */
    'Left' |
    /**
     * Right - Aligns the diagram element at the right of its immediate parent
     */
    'Right' |
    /**
     * Center - Aligns the diagram element at the center of its immediate parent
     */
    'Center' |
    /**
     * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     */
    'Auto';

/**
 * Defines how the diagram elements have to be aligned with respect to its immediate parent
 * * Stretch - Stretches the diagram element throughout its immediate parent
 * * Top - Aligns the diagram element at the top of its immediate parent
 * * Bottom - Aligns the diagram element at the bottom of its immediate parent
 * * Center - Aligns the diagram element at the center of its immediate parent
 * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
 */
export type VerticalAlignment =
    /**
     * Stretch - Stretches the diagram element throughout its immediate parent
     */
    'Stretch' |
    /**
     * Top - Aligns the diagram element at the top of its immediate parent
     */
    'Top' |
    /**
     * Bottom - Aligns the diagram element at the bottom of its immediate parent
     */
    'Bottom' |
    /**
     * Center - Aligns the diagram element at the center of its immediate parent
     */
    'Center' |
    /**
     * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     */
    'Auto';


/**
 * Defines how the diagram elements have to be flipped with respect to its immediate parent
 * * FlipHorizontal - Translate the diagram element throughout its immediate parent
 * * FlipVertical - Rotate the diagram element throughout its immediate parent
 * * Both - Rotate  and Translate the diagram element throughout its immediate parent
 * * None - Set the flip Direction as None
 */
export type FlipDirection =
    /**
     * FlipHorizontal - Translate the diagram element throughout its immediate parent
     */
    'Horizontal' |
    /**
     * FlipVertical - Rotate the diagram element throughout its immediate parent
     */
    'Vertical' |
    /**
     * Both - Rotate  and Translate the diagram element throughout its immediate parent
     */
    'Both' |
    /**
     * None - Set the flip Direction as None
     */
    'None';

/**
 * Allows you to flip only the node or along with port and label
 * * All - Flips port and label along the node
 * * Label - Flips label along with the node
 * * Port - Flips port along with the node
 * * None - Flips only the node
 */
export type FlipMode =
    /**
     * All - Flips port and label along the node
     */
    'All' |
    /**
     * Label - Flips label along with the node
     */
    'Label' |
    /**
     * Port - Flips port along with the node
     */
    'Port' |
    /**
     * None - Flips only the node
     */
    'None';


/**
 * Defines the orientation of the Page
 * Landscape - Display with page Width is more than the page Height.
 * Portrait - Display with page Height is more than the page width.
 */

export type PageOrientation =
    /**
     * Landscape - Display with page Width is more than the page Height
     */
    'Landscape' |
    /**
     * Portrait - Display with page Height is more than the page width
     */
    'Portrait';

/**
 * Defines the orientation of the layout
 * * TopToBottom - Renders the layout from top to bottom
 * * BottomToTop - Renders the layout from bottom to top
 * * LeftToRight - Renders the layout from left to right
 * * RightToLeft - Renders the layout from right to left
 */
export type LayoutOrientation =
    /**
     * TopToBottom - Renders the layout from top to bottom
     */
    'TopToBottom' |
    /**
     * BottomToTop - Renders the layout from bottom to top
     */
    'BottomToTop' |
    /**
     * LeftToRight - Renders the layout from left to right
     */
    'LeftToRight' |
    /**
     * RightToLeft - Renders the layout from right to left
     */
    'RightToLeft';

/**
 * Defines the types of the automatic layout
 * * None - None of the layouts is applied
 * * HierarchicalTree - Defines the type of the layout as Hierarchical Tree
 * * OrganizationalChart - Defines the type of the layout as Organizational Chart
 * * ComplexHierarchicalTree - Defines the type of the layout as complex HierarchicalTree
 * * RadialTree - Defines the type of the layout as Radial tree
 */
export type LayoutType =
    /**
     * None - None of the layouts is applied
     */
    'None' |
    /**
     * HierarchicalTree - Defines the type of the layout as Hierarchical Tree
     */
    'HierarchicalTree' |
    /**
     * RadialTree - Defines the type of the layout as Radial Tree
     */
    'RadialTree' |
    /**
     * OrganizationalChart - Defines the type of the layout as Organizational Chart
     */
    'OrganizationalChart' |
    /**
     * SymmetricalLayout - Defines the type of the layout as SymmetricalLayout
     */
    'SymmetricalLayout' |
    /**
     * ComplexHierarchicalTree - Defines the type of the layout as complex HierarchicalTree
     */
    'ComplexHierarchicalTree' |
    /**
     * MindMap - Defines the type of the layout as MindMap
     */
    'MindMap';
/**
 * Alignment position
 * Left - Sets the branch type as Left
 * Right - Sets the branch type as Right
 * SubLeft - Sets the branch type as SubLeft
 * SubRight - Sets the branch type as SubRight
 * Root - Sets the branch type as Root
 */
export type BranchTypes =
    /**
     * Left - Sets the branch type as Left
     */
    'Left' |
    /**
     * Right - Sets the branch type as Right
     */
    'Right' |
    /**
     * SubLeft - Sets the branch type as SubLeft
     */
    'SubLeft' |
    /**
     * SubRight - Sets the branch type as SubRight
     */
    'SubRight' |
    /**
     * Root - Sets the branch type as Root
     */
    'Root';

/**
 * Defines how the first segments have to be defined in a layout
 * Auto - Defines the first segment direction based on the type of the layout
 * Orientation - Defines the first segment direction based on the orientation of the layout
 * Custom - Defines the first segment direction dynamically by the user
 */
export type ConnectionDirection =
    /**
     * Auto - Defines the first segment direction based on the type of the layout
     */
    'Auto' |
    /**
     * Orientation - Defines the first segment direction based on the orientation of the layout
     */
    'Orientation' |
    /**
     * Custom - Defines the first segment direction dynamically by the user
     */
    'Custom';

/**
 * Defines where the user handles have to be aligned
 * Top - Aligns the user handles at the top of an object
 * Bottom - Aligns the user handles at the bottom of an object
 * Left - Aligns the user handles at the left of an object
 * Right - Aligns the user handles at the right of an object
 */
export type Side =
    /**
     * Top - Aligns the user handles at the top of an object
     */
    'Top' |
    /**
     * Bottom - Aligns the user handles at the bottom of an object
     */
    'Bottom' |
    /**
     * Left - Aligns the user handles at the left of an object
     */
    'Left' |
    /**
     * Right - Aligns the user handles at the right of an object
     */
    'Right';

/**
 * Defines how the connectors have to be routed in a layout
 * Default - Routes the connectors like a default diagram
 * Layout - Routes the connectors based on the type of the layout
 */
export type ConnectorSegments =
    /**
     * Default - Routes the connectors like a default diagram
     */
    'Default' |
    /**
     * Layout - Routes the connectors based on the type of the layout
     */
    'Layout';

/**
 * Defines how the annotations have to be aligned with respect to its immediate parent
 * Center - Aligns the annotation at the center of a connector segment
 * Before - Aligns the annotation before a connector segment
 * After - Aligns the annotation after a connector segment
 */
export type AnnotationAlignment =
    /**
     * Center - Aligns the annotation at the center of a connector segment
     */
    'Center' |
    /**
     * Before - Aligns the annotation before a connector segment
     */
    'Before' |
    /**
     * After - Aligns the annotation after a connector segment
     */
    'After';

/**
 * Defines how the fixedUserHandle have to be aligned with respect to its immediate parent
 * Center - Aligns the fixedUserHandle at the center of a connector segment
 * Before - Aligns the fixedUserHandle before a connector segment
 * After - Aligns the fixedUserHandle after a connector segment
 */
export type FixedUserHandleAlignment =
    /**
     * Center - Aligns the fixedUserHandle at the center of a connector segment
     */
    'Center' |
    /**
     * Before - Aligns the fixedUserHandle before a connector segment
     */
    'Before' |
    /**
     * After - Aligns the fixedUserHandle after a connector segment
     */
    'After';

/**
 * Defines the type of the port
 * Point - Sets the type of the port as Point
 * Path - Sets the type of the port as Path
 * Dynamic - Sets the type of the port as Dynamic
 */
export type PortTypes =
    /**
     * Point - Sets the type of the port as Point
     */
    'Point' |
    /**
     * Path - Sets the type of the port as Path
     */
    'Path' |
    /**
     * Dynamic - Sets the type of the port as Dynamic
     */
    'Dynamic';

/**
 * Defines the type of the annotation
 * Shape - Sets the annotation type as Shape
 * Path - Sets the annotation type as Path
 */
export type AnnotationTypes =
    /**
     * Shape - Sets the annotation type as Shape
     */
    'Shape' |
    /**
     * Path - Sets the annotation type as Path
     */
    'Path';

/**
 * File Format type for export.
 * JPG - Save the file in JPG Format
 * PNG - Saves the file in PNG Format
 * BMP - Save the file in BMP Format
 * SVG - save the file in SVG format
 *
 * @IgnoreSingular
 */
export type FileFormats =
    /** JPG-Save the file in JPG Format  */
    'JPG' |
    /** PNG - Save the file in PNG Format */
    'PNG' |
    /** BMP - Save the file in BMP format */
    'BMP' |
    /** SVG - Saves the file in SVG format */
    'SVG';

/**
 * Defines whether the diagram has to be exported as an image or it has to be converted as image url
 * Download
 * Data
 *
 * @IgnoreSingular
 */
export type ExportModes =
    /** Download - Download the image */
    'Download' |
    /** Data - Converted as image url */
    'Data';

/**
 * Defines the region that has to be drawn as an image
 * PageSettings -  With the given page settings image has to be exported.
 * Content - The diagram content is export
 * CustomBounds - Exported with given bounds.
 *
 * @IgnoreSingular
 */

export type DiagramRegions =
    /** PageSettings -  With the given page settings image has to be exported. */
    'PageSettings' |
    /** Content - The diagram content is export */
    'Content' |
    /** CustomBounds - Exported with given bounds. */
    'CustomBounds';

/**
 * Defines the type of annotation template
 * String -  Defines annotation template to be in string
 * Template - Defines annotation template to be in html content
 *
 * @IgnoreSingular
 */

export type AnnotationType =
    /** String -  Defines annotation template to be in string */
    'String' |
    /** Template - Defines annotation template to be in html content */
    'Template';

/**
 * Constraints to define when a port has to be visible
 * Visible - Always shows the port
 * Hidden - Always hides the port
 * Hover - Shows the port when the mouse hovers over a node
 * Connect - Shows the port when a connection end point is dragged over a node
 * Default - By default the ports will be visible when a node is hovered and being tried to connect
 *
 * @aspNumberEnum
 */
export enum PortVisibility {
    /** Always shows the port */
    Visible = 1 << 0,
    /** Always hides the port */
    Hidden = 1 << 1,
    /** Shows the port when the mouse hovers over a node */
    Hover = 1 << 2,
    /** Shows the port when a connection end point is dragged over a node */
    Connect = 1 << 3
}
/**
 * Defines the constraints to Enables / Disables some features of Snapping.
 * None - Snapping does not happen
 * ShowHorizontalLines - Displays only the horizontal gridlines in diagram.
 * ShowVerticalLines - Displays only the Vertical gridlines in diagram.
 * ShowLines - Display both Horizontal and Vertical gridlines.
 * SnapToHorizontalLines - Enables the object to snap only with horizontal gridlines.
 * SnapToVerticalLines - Enables the object to snap only with horizontal gridlines.
 * SnapToLines - Enables the object to snap with both horizontal and Vertical gridlines.
 * snapToObject - Enables the object to snap with the other objects in the diagram.
 *
 * @IgnoreSingular
 * @aspNumberEnum
 */

export enum SnapConstraints {
    /** None - Snapping does not happen */
    None = 0,
    /** ShowHorizontalLines - Displays only the horizontal gridlines in diagram. */
    ShowHorizontalLines = 1 << 0,
    /** ShowVerticalLines - Displays only the Vertical gridlines in diagram  */
    ShowVerticalLines = 1 << 1,
    /** ShowLines - Display both Horizontal and Vertical gridlines */
    ShowLines = 1 | 2,
    /** SnapToHorizontalLines - Enables the object to snap only with horizontal gridlines */
    SnapToHorizontalLines = 1 << 2,
    /** SnapToVerticalLines - Enables the object to snap only with horizontal gridlines */
    SnapToVerticalLines = 1 << 3,
    /** SnapToLines - Enables the object to snap with both horizontal and Vertical gridlines */
    SnapToLines = 4 | 8,
    /** SnapToObject - Enables the object to snap with the other objects in the diagram. */
    SnapToObject = 1 << 4,
    /** Shows gridlines and enables snapping */
    All = 1 | 2 | 4 | 8 | 16
}

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
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum SelectorConstraints {
    /** Hides all the selector elements */
    None = 1 << 0,
    /** Shows/hides the source thumb of the connector */
    ConnectorSourceThumb = 1 << 1,
    /** Shows/hides the target thumb of the connector */
    ConnectorTargetThumb = 1 << 2,
    /** Shows/hides the bottom right resize handle of the selector */
    ResizeSouthEast = 1 << 3,
    /** Shows/hides the bottom left resize handle of the selector */
    ResizeSouthWest = 1 << 4,
    /** Shows/hides the top right resize handle of the selector */
    ResizeNorthEast = 1 << 5,
    /** Shows/hides the top left resize handle of the selector */
    ResizeNorthWest = 1 << 6,
    /** Shows/hides the middle right resize handle of the selector  */
    ResizeEast = 1 << 7,
    /** Shows/hides the middle left resize handle of the selector */
    ResizeWest = 1 << 8,
    /** Shows/hides the bottom center resize handle of the selector */
    ResizeSouth = 1 << 9,
    /** Shows/hides the top center resize handle of the selector */
    ResizeNorth = 1 << 10,
    /**  Shows/hides the rotate handle of the selector */
    Rotate = 1 << 11,
    /** Shows/hides the user handles of the selector */
    UserHandle = 1 << 12,
    /** Shows/hides the default tooltip of nodes and connectors */
    ToolTip = 1 << 13,
    /** Shows/hides all resize handles of the selector */
    ResizeAll = ResizeSouthEast | ResizeSouthWest | ResizeNorthEast |
    ResizeNorthWest | ResizeEast | ResizeWest | ResizeSouth | ResizeNorth | ConnectorSourceThumb | ConnectorTargetThumb,
    /** Shows all handles of the selector  */
    All = ResizeAll | UserHandle | Rotate | ToolTip
}

/**
 * Defines the type of the panel
 * None - Defines that the panel will not rearrange its children. Instead, it will be positioned based on its children.
 * Canvas - Defines the type of the panel as Canvas
 * Stack - Defines the type of the panel as Stack
 * Grid - Defines the type of the panel as Grid
 * WrapPanel - Defines the type of the panel as WrapPanel
 */
export type Panels =
    /** None - Defines that the panel will not rearrange its children. Instead, it will be positioned based on its children. */
    'None' |
    /** Canvas - Defines the type of the panel as Canvas */
    'Canvas' |
    /** Stack - Defines the type of the panel as Stack */
    'Stack' |
    /** Grid - Defines the type of the panel as Grid */
    'Grid' |
    /** WrapPanel - Defines the type of the panel as WrapPanel */
    'WrapPanel';

/**
 * Defines the orientation
 * Horizontal - Sets the orientation as Horizontal
 * Vertical - Sets the orientation as Vertical
 */
export type Orientation =
    /** Horizontal - Sets the orientation as Horizontal */
    'Horizontal' |
    /** Vertical - Sets the orientation as Vertical */
    'Vertical';


/**
 * Defines the orientation
 * Horizontal - Sets the orientation as Horizontal
 * Vertical - Sets the orientation as Vertical
 */
export type ContainerTypes =
    /** Canvas - Sets the ContainerTypes as Canvas */
    'Canvas' |
    /** Stack - Sets the ContainerTypes as Stack */
    'Stack' |
    /** Grid - Sets the ContainerTypes as Grid */
    'Grid';

/**
 * Defines the reference with respect to which the diagram elements have to be aligned
 * Point - Diagram elements will be aligned with respect to a point
 * Object - Diagram elements will be aligned with respect to its immediate parent
 */
export type RelativeMode =
    /** Point - Diagram elements will be aligned with respect to a point */
    'Point' |
    /** Object - Diagram elements will be aligned with respect to its immediate parent */
    'Object';

/**
 * Defines how to wrap the text when it exceeds the element bounds
 * WrapWithOverflow - Wraps the text so that no word is broken
 * Wrap - Wraps the text and breaks the word, if necessary
 * NoWrap - Text will no be wrapped
 */
export type TextWrap =
    /** WrapWithOverflow - Wraps the text so that no word is broken */
    'WrapWithOverflow' |
    /** Wrap - Wraps the text and breaks the word, if necessary */
    'Wrap' |
    /** NoWrap - Text will no be wrapped */
    'NoWrap';

/**
 * Defines how to handle the text when it exceeds the element bounds
 * Wrap - Wraps the text to next line, when it exceeds its bounds
 * Ellipsis - It truncates the overflown text and represents the clipping with an ellipsis
 * Clip - It clips the overflow text
 */
export type TextOverflow =
    /** Wrap - Wraps the text to next line, when it exceeds its bounds */
    'Wrap' |
    /** Ellipsis - It truncates the overflown text and represents the clipping with an ellipsis */
    'Ellipsis' |
    /** Clip - It clips the overflow text */
    'Clip';

/**
 * Defines how to show tooltip
 * Auto - Shows the tooltip on drag, scale, and rotate the object
 * Custom - Shows the tooltip for the diagram element
 */
export type TooltipMode =
    /** Auto - It shows the tooltip On drag,scale,rotate the object */
    'Auto' |
    /** Custom - It shows tooltip based on object */
    'Custom';

/**
 * Defines the mode of the alignment based on which the elements should be aligned
 * Object - Aligns the objects based on the first object in the selected list
 * Selector - Aligns the objects based on the  the selector bounds
 */
export type AlignmentMode =
    /** Object - Aligns the objects based on the first object in the selected list */
    'Object' |
    /** Selector - Aligns the objects based on the  the selector bounds */
    'Selector';

/**
 * Defines the alignment options
 * Left - Aligns the objects at the left of the selector bounds
 * Right - Aligns the objects at the right of the selector bounds
 * Center - Aligns the objects at the horizontal center of the selector bounds
 * Top - Aligns the objects at the top of the selector bounds
 * Bottom - Aligns the objects at the bottom of the selector bounds
 * Middle - Aligns the objects at the vertical center of the selector bounds
 */
export type AlignmentOptions =
    /** Left - Aligns the objects at the left of the selector bounds */
    'Left' |
    /** Right - Aligns the objects at the right of the selector bounds */
    'Right' |
    /** Center - Aligns the objects at the horizontal center of the selector bounds */
    'Center' |
    /** Top - Aligns the objects at the top of the selector bounds */
    'Top' |
    /** Bottom - Aligns the objects at the bottom of the selector bounds */
    'Bottom' |
    /** Middle - Aligns the objects at the vertical center of the selector bounds */
    'Middle';

/**
 * Defines the distribution options
 * RightToLeft - Distributes the objects based on the distance between the right and left sides of the adjacent objects
 * Left - Distributes the objects based on the distance between the left sides of the adjacent objects
 * Right - Distributes the objects based on the distance between the right sides of the adjacent objects
 * Center - Distributes the objects based on the distance between the center of the adjacent objects
 * BottomToTop - Distributes the objects based on the distance between the bottom and top sides of the adjacent objects
 * Top - Distributes the objects based on the distance between the top sides of the adjacent objects
 * Bottom - Distributes the objects based on the distance between the bottom sides of the adjacent objects
 * Middle - Distributes the objects based on the distance between the vertical center of the adjacent objects
 */
export type DistributeOptions =
    /** RightToLeft - Distributes the objects based on the distance between the right and left sides of the adjacent objects */
    'RightToLeft' |
    /** Left - Distributes the objects based on the distance between the left sides of the adjacent objects */
    'Left' |
    /** Right - Distributes the objects based on the distance between the right sides of the adjacent objects */
    'Right' |
    /** Center - Distributes the objects based on the distance between the center of the adjacent objects */
    'Center' |
    /** BottomToTop - Distributes the objects based on the distance between the bottom and top sides of the adjacent objects */
    'BottomToTop' |
    /** Top - Distributes the objects based on the distance between the top sides of the adjacent objects */
    'Top' |
    /** Bottom - Distributes the objects based on the distance between the bottom sides of the adjacent objects */
    'Bottom' |
    /** Middle - Distributes the objects based on the distance between the vertical center of the adjacent objects */
    'Middle';

/**
 * Defines the sizing options
 * Width - Scales the width of the selected objects
 * Height - Scales the height of the selected objects
 * Size - Scales the selected objects both vertically and horizontally
 */
export type SizingOptions =
    /** Width - Scales the width of the selected objects */
    'Width' |
    /** Height - Scales the height of the selected objects */
    'Height' |
    /** Size - Scales the selected objects both vertically and horizontally */
    'Size';

/**
 * Defines how to handle the empty space and empty lines of a text
 * PreserveAll - Preserves all empty spaces and empty lines
 * CollapseSpace - Collapses the consequent spaces into one
 * CollapseAll - Collapses all consequent empty spaces and empty lines
 */
export type WhiteSpace =
    /** PreserveAll - Preserves all empty spaces and empty lines */
    'PreserveAll' |
    /** CollapseSpace - Collapses the consequent spaces into one */
    'CollapseSpace' |
    /** CollapseAll - Collapses all consequent empty spaces and empty lines */
    'CollapseAll';

/**
 * Defines how to handle the rubber band selection
 * CompleteIntersect - Selects the objects that are contained within the selected region
 * PartialIntersect - Selects the objects that are partially intersected with the selected region
 */
export type RubberBandSelectionMode =
    /** CompleteIntersect - Selects the objects that are contained within the selected region */
    'CompleteIntersect' |
    /** PartialIntersect - Selects the objects that are partially intersected with the selected region */
    'PartialIntersect';

/**
 * Defines the rendering mode of the diagram
 * SVG - Renders the diagram objects as SVG elements
 * Canvas - Renders the diagram in a canvas
 */
export type RenderingMode =
    /** SVG - Renders the diagram objects as SVG elements */
    'SVG' |
    /** Canvas - Renders the diagram in a canvas */
    'Canvas';



/**
 * Defines the connection point of the connectors in the layout
 * SamePoint - Connectors will connect with same point in the layout
 * DifferentPoint - Connectors will connect with different points in the layout
 */
export enum ConnectionPointOrigin {
    /** SamePoint - Connectors will connect with same point in the layout */
    SamePoint = 'SamePoint',
    /** DifferentPoint - Connectors will connect with different points in the layout */
    DifferentPoint = 'DifferentPoint',

}


/**
 * Defines the child nodes need to arranged in linear manner in layout
 * Linear - Child nodes will be arranged in linear manner
 * Nonlinear - Child nodes will be arranged in not linear manner
 */
export enum ChildArrangement {
    /** Linear - Child nodes will be arranged in linear manner */
    Linear = 'Linear',
    /** Nonlinear - Child nodes will be arranged in not linear manner */
    Nonlinear = 'Nonlinear',

}

/**
 * Defines the gird rendering pattern
 * Lines - Render the line for the grid
 * Dots - Render the dot for the grid
 */
export type GridType =
    /** Lines - Render the diagram Grid in Line format */
    'Lines' |
    /** Lines - Render the diagram Grid in Dot format */
    'Dots';

/**
 * Defines how to decorate the text
 * Overline - Decorates the text with a line above the text
 * Underline - Decorates the text with an underline
 * LineThrough - Decorates the text by striking it with a line
 * None - Text will not have any specific decoration
 */
export type TextDecoration =
    /** Overline - Decorates the text with a line above the text */
    'Overline' |
    /** Underline - Decorates the text with an underline */
    'Underline' |
    /** LineThrough - Decorates the text by striking it with a line */
    'LineThrough' |
    /** None - Text will not have any specific decoration */
    'None';

/**
 * Defines how to open the annotation hyperlink in the new tab, current tab or new window
 */
 export type LinkTarget = 
 /**Opens hyperlink in the same tab */
 'CurrentTab' |
 /**Opens hyperlink in the new tab */
 'NewTab'   |
 /**Opens hyperlink in the new window*/
 'NewWindow';
    
/**
 * Defines how the text has to be aligned
 * Left - Aligns the text at the left of the text bounds
 * Right - Aligns the text at the right of the text bounds
 * Center - Aligns the text at the center of the text bounds
 * Justify - Aligns the text in a justified manner
 */
export type TextAlign =
    /** Left - Aligns the text at the left of the text bounds */
    'Left' |
    /** Right - Aligns the text at the right of the text bounds */
    'Right' |
    /** Center - Aligns the text at the center of the text bounds */
    'Center' |
    /** Justify - Aligns the text in a justified manner */
    'Justify';

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
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum ConnectorConstraints {
    /** Disable all connector Constraints. */
    None = 1 << 0,
    /** Enables connector to be selected. */
    Select = 1 << 1,
    /** Enables connector to be Deleted. */
    Delete = 1 << 2,
    /** Enables connector to be Dragged. */
    Drag = 1 << 3,
    /** Enables connectors source end to be selected. */
    DragSourceEnd = 1 << 4,
    /** Enables connectors target end to be selected. */
    DragTargetEnd = 1 << 5,
    /** Enables control point and end point of every segment in a connector for editing. */
    DragSegmentThumb = 1 << 6,
    /** Enables AllowDrop constraints to the  connector. */
    AllowDrop = 1 << 7,
    /** Enables bridging to the connector. */
    Bridging = 1 << 8,
    /** Enables or Disables Bridge Obstacles with overlapping of connectors. */
    BridgeObstacle = 1 << 9,
    /** Enables bridging to the connector. */
    InheritBridging = 1 << 10,
    /** Used to set the pointer events. */
    PointerEvents = 1 << 11,
    /** Enables or disables tool tip for the connectors */
    Tooltip = 1 << 12,
    /** Enables or disables tool tip for the connectors */
    InheritTooltip = 1 << 13,
    /** Enables Interaction. */
    Interaction = 1 << 1 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 12,
    /** Enables ReadOnly */
    ReadOnly = 1 << 14,
    /** Enables or disables routing to the connector. */
    LineRouting = 1 << 15,
    /** Enables or disables routing to the connector. */
    InheritLineRouting = 1 << 16,
    /** Enables or disables near node padding to the connector. */
    ConnectToNearByNode = 1 << 17,
    /** Enables or disables near port padding to the connector. */
    ConnectToNearByPort = 1 << 18,
    /** Enables or disables Enables or disables near port and node padding to the connector. */
    ConnectToNearByElement = 1 << 17 | 1 << 18,
    /** Enables all constraints. */
    Default = 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 9 | 1 << 10 | 1 << 11 | 1 << 13 | 1 << 16 | 1 << 17 | 1 << 18
}


/**
 * Enables/Disables the annotation constraints
 * ReadOnly - Enables/Disables the ReadOnly Constraints
 * InheritReadOnly - Enables/Disables the InheritReadOnly Constraints
 * Select -Enables/Disable select support for the annotation
 * Drag - Enables/Disable drag support for the annotation
 * Resize - Enables/Disable resize support for the annotation
 * Rotate - Enables/Disable rotate support for the annotation
 * Interaction - Enables annotation to inherit the interaction option
 * None - Disable all annotation constraints
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum AnnotationConstraints {
    /** Enables/Disables the ReadOnly Constraints */
    ReadOnly = 1 << 1,
    /** Enables/Disables the InheritReadOnly Constraints */
    InheritReadOnly = 1 << 2,
    /** Enables/Disable select support for the annotation */
    Select = 1 << 3,
    /** Enables/Disable drag support for the annotation */
    Drag = 1 << 4,
    /** Enables/Disable resize support for the annotation */
    Resize = 1 << 5,
    /** Enables/Disable rotate support for the annotation */
    Rotate = 1 << 6,
    /** Enables annotation to inherit the interaction option */
    Interaction = 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6,
    /** Disable all annotation Constraints */
    None = 0
}

/**
 * Enables/Disables certain features of node
 * None - Disable all node Constraints
 * Select - Enables node to be selected
 * Drag - Enables node to be Dragged
 * Rotate - Enables node to be Rotate
 * Shadow - Enables node to display shadow
 * PointerEvents - Enables node to provide pointer  option
 * Delete - Enables node to delete
 * InConnect - Enables node to provide in connect option
 * OutConnect - Enables node to provide out connect option
 * Individual - Enables node to provide individual resize option
 * Expandable - Enables node to provide Expandable option
 * AllowDrop - Enables node to provide allow to drop option
 * Inherit - Enables node to inherit the interaction option
 * ResizeNorthEast - Enable ResizeNorthEast of the node
 * ResizeEast - Enable ResizeEast of the node
 * ResizeSouthEast - Enable ResizeSouthEast of the node
 * ResizeSouth - Enable ResizeSouthWest of the node
 * ResizeSouthWest - Enable ResizeSouthWest of the node
 * ResizeSouth - Enable ResizeSouth of the node
 * ResizeSouthWest - Enable ResizeSouthWest of the node
 * ResizeWest - Enable ResizeWest of the node
 * ResizeNorth - Enable ResizeNorth of the node
 * Resize - Enables the Aspect ratio fo the node
 * AspectRatio - Enables the Aspect ratio fo the node
 * Tooltip - Enables or disables tool tip for the Nodes
 * InheritTooltip - Enables or disables tool tip for the Nodes
 * ReadOnly - Enables the  ReadOnly support for Annotation
 * Default - Enables all constraints
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum NodeConstraints {
    /** Disable all node Constraints. */
    None = 0,
    /** Enables node to be selected. */
    Select = 1 << 1,
    /** Enables node to be Dragged. */
    Drag = 1 << 2,
    /** Enables node to be Rotate. */
    Rotate = 1 << 3,
    /** Enables node to display shadow. */
    Shadow = 1 << 4,
    /** Enables node to provide pointer  option */
    PointerEvents = 1 << 5,
    /** Enables node to delete */
    Delete = 1 << 6,
    /** Enables node to provide in connect option */
    InConnect = 1 << 7,
    /** Enables node to provide out connect option */
    OutConnect = 1 << 8,
    /** Enables node to provide individual resize option */
    Individual = 1 << 9,
    /** Enables node to provide Expandable option */
    Expandable = 1 << 10,
    /** Enables node to provide allow to drop option */
    AllowDrop = 1 << 11,
    /** Enables node to inherit the interaction option */
    Inherit = 1 << 1 | 1 << 2 | 1 << 3 | 1 << 6,
    /** Enable ResizeNorthEast of the node  */
    ResizeNorthEast = 1 << 12,
    /** Enable ResizeEast of the node  */
    ResizeEast = 1 << 13,
    /** Enable ResizeSouthEast of the node  */
    ResizeSouthEast = 1 << 14,
    /** Enable ResizeSouth of the node  */
    ResizeSouth = 1 << 15,
    /** Enable ResizeSouthWest of the node  */
    ResizeSouthWest = 1 << 16,
    /** Enable ResizeWest of the node  */
    ResizeWest = 1 << 17,
    /** Enable ResizeNorthWest of the node  */
    ResizeNorthWest = 1 << 18,
    /** Enable ResizeNorth of the node  */
    ResizeNorth = 1 << 19,
    /** Enable Resize of the node  */
    Resize = 1 << 12 | 1 << 13 | 1 << 14 | 1 << 15 | 1 << 16 | 1 << 17 | 1 << 18 | 1 << 19,
    /** Enables the Aspect ratio fo the node */
    AspectRatio = 1 << 20,
    /** Enables or disables tool tip for the Nodes */
    Tooltip = 1 << 21,
    /** Enables or disables tool tip for the Nodes */
    InheritTooltip = 1 << 22,
    /** Enables the  ReadOnly support for Annotation */
    ReadOnly = 1 << 23,
    /** hide all resize support for node */
    HideThumbs = 1 << 24,
    /** Enables or disables child in parent for the swimLane node */
    AllowMovingOutsideLane = 1 << 25,
    /** Enables all constraints */
    Default = 1 << 1 | 1 << 2 | 1 << 3 | 1 << 6 | 1 << 7 | 1 << 8 |
    1 << 9 | 1 << 10 | 1 << 5 | 1 << 12 | 1 << 13 |
    1 << 14 | 1 << 15 | 1 << 16 | 1 << 17 | 1 << 18 | 1 << 19 | 1 << 22
}

/** Enables/Disables The element actions
 * None - Diables all element actions are none
 * ElementIsPort - Enable element action is port
 * ElementIsGroup - Enable element action as Group
 *
 * @private
 */
export enum ElementAction {
    /** Disables all element actions are none  */
    None = 0,
    /** Enable the element action is Port  */
    ElementIsPort = 1 << 1,
    /** Enable the element action as Group  */
    ElementIsGroup = 1 << 2,
     /** Enable the element action if swimlaneHeader is rendered  */
     HorizontalLaneHeader = 1 << 3,

}

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
 *
 * @private
 */
export enum ThumbsConstraints {
    /** Enable Rotate Thumb  */
    Rotate = 1 << 1,
    /** Enable Connector source point  */
    ConnectorSource = 1 << 2,
    /** Enable Connector target point  */
    ConnectorTarget = 1 << 3,
    /** Enable ResizeNorthEast Resize  */
    ResizeNorthEast = 1 << 4,
    /** Enable ResizeEast Resize  */
    ResizeEast = 1 << 5,
    /** Enable ResizeSouthEast Resize */
    ResizeSouthEast = 1 << 6,
    /** Enable ResizeSouth Resize */
    ResizeSouth = 1 << 7,
    /** Enable ResizeSouthWest Resize */
    ResizeSouthWest = 1 << 8,
    /** Enable ResizeWest Resize */
    ResizeWest = 1 << 9,
    /** Enable ResizeNorthWest Resize */
    ResizeNorthWest = 1 << 10,
    /** Enable ResizeNorth Resize */
    ResizeNorth = 1 << 11,
    /** Enables all constraints */
    Default = 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7 | 1 << 8 | 1 << 9 | 1 << 10 | 1 << 11,

}

/**
 * Enables/Disables certain features of diagram
 * None - Disable DiagramConstraints constraints
 * Bridging - Enables/Disable Bridging support for connector
 * UndoRedo - Enables/Disable the Undo/Redo support
 * Tooltip - Enables/Disable Tooltip support
 * UserInteraction - Enables/Disable UserInteraction support for the diagram
 * ApiUpdate - Enables/Disable ApiUpdate support for the diagram
 * PageEditable - Enables/Disable PageEditable support for the diagram
 * Zoom - Enables/Disable Zoom support for the diagram
 * PanX - Enables/Disable PanX support for the diagram
 * PanY - Enables/Disable PanY support for the diagram
 * Pan - Enables/Disable Pan support the diagram
 * ZoomTextEdit - Enables/Disables zooming the text box while editing the text
 * Virtualization - Enables/Disable Virtualization support the diagram
 * Default - Enables/Disable all constraints
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum DiagramConstraints {
    /** Disable DiagramConstraints constraints */
    None = 1 << 0,
    /** Enables/Disable Bridging support for connector */
    Bridging = 1 << 1,
    /** Enables/Disable the Undo/Redo support */
    UndoRedo = 1 << 2,
    /** Enables/Disable Tooltip support */
    Tooltip = 1 << 3,
    /** Enables/Disable UserInteraction support for the diagram */
    UserInteraction = 1 << 4,
    /** Enables/Disable ApiUpdate support for the diagram */
    ApiUpdate = 1 << 5,
    /** Enables/Disable PageEditable support for the diagram */
    PageEditable = 1 << 4 | 1 << 5,
    /** Enables/Disable Zoom support for the diagram */
    Zoom = 1 << 6,
    /** Enables/Disable PanX support for the diagram */
    PanX = 1 << 7,
    /** Enables/Disable PanY support for the diagram */
    PanY = 1 << 8,
    /** Enables/Disable Pan support the diagram */
    Pan = 1 << 7 | 1 << 8,
    /** Enables/Disables zooming the text box while editing the text */
    ZoomTextEdit = 1 << 9,
    /** Enables/Disable Virtualization support the diagram */
    Virtualization = 1 << 10,
    /** Enables/ Disable the line routing */
    LineRouting = 1 << 11,
    /** Enables/Disable all constraints */
    Default = 1 << 2 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7 | 1 << 8
}

/**
 * Activates the diagram tools
 * None - Enables/Disable single select support for the diagram
 * SingleSelect - Enables/Disable single select support for the diagram
 * MultipleSelect - Enables/Disable MultipleSelect select support for the diagram
 * ZoomPan - Enables/Disable ZoomPan support for the diagram
 * DrawOnce - Enables/Disable continuousDraw support for the diagram
 * ContinuousDraw - Enables/Disable continuousDraw support for the diagram
 * Default - Enables/Disable all constraints
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum DiagramTools {
    /** Disable all constraints */
    None = 0,
    /** Enables/Disable single select support for the diagram */
    SingleSelect = 1 << 0,
    /** Enables/Disable MultipleSelect select support for the diagram */
    MultipleSelect = 1 << 1,
    /** Enables/Disable ZoomPan support for the diagram */
    ZoomPan = 1 << 2,
    /** Enables/Disable DrawOnce support for the diagram */
    DrawOnce = 1 << 3,
    /** Enables/Disable continuousDraw support for the diagram */
    ContinuousDraw = 1 << 4,
    /** Enables/Disable all constraints */
    Default = 1 << 0 | 1 << 1,
}

/**
 * Defines the bridge direction
 * Top - Defines the direction of the bridge as Top
 * Bottom - Defines the direction of the bridge as Bottom
 * Left - Sets the bridge direction as left
 * Right - Sets the bridge direction as right
 */
export type BridgeDirection =
    /** Top - Defines the direction of the bridge as Top */
    'Top' |
    /** Bottom - Defines the direction of the bridge as Bottom */
    'Bottom' |
    /** Left - Sets the bridge direction as left */
    'Left' |
    /** Right - Sets the bridge direction as right */
    'Right';

/**
 * Defines the type of the gradient
 * Linear - Sets the type of the gradient as Linear
 * Radial - Sets the type of the gradient as Radial
 */
export type GradientType =
    /** None - Sets the type of the gradient as None */
    'None' |
    /** Linear - Sets the type of the gradient as Linear */
    'Linear' |
    /** Radial - Sets the type of the gradient as Radial */
    'Radial';

/**
 * Defines the shape of a node
 * Path - Sets the type of the node as Path
 * Text - Sets the type of the node as Text
 * Image - Sets the type of the node as Image
 * Basic - Sets the type of the node as Basic
 * Flow - Sets the type of the node as Flow
 * Bpmn - Sets the type of the node as Bpmn
 * Native - Sets the type of the node as Native
 * HTML - Sets the type of the node as HTML
 */
export type Shapes =
    /** Basic - Sets the type of the node as Basic */
    'Basic' |
    /** Path - Sets the type of the node as Path */
    'Path' |
    /** Text - Sets the type of the node as Text */
    'Text' |
    /** Image - Sets the type of the node as Image */
    'Image' |
    /** Flow - Sets the type of the node as Flow */
    'Flow' |
    /** Bpmn - Sets the type of the node as Bpmn */
    'Bpmn' |
    /** Native - Sets the type of the node as Native */
    'Native' |
    /** HTML - Sets the type of the node as HTML */
    'HTML' |
    /** UMLActivity - Sets the type of the node as UMLActivity */
    'UmlActivity' |
    /** UMLClassifier - Sets the type of the node as UMLClassifier */
    'UmlClassifier' |
    /** SwimLane - Sets the type of the node as SwimLane */
    'SwimLane';
/**
 * None - Scale value will be set as None for the image
 * Meet - Scale value Meet will be set for the image
 * Slice - Scale value Slice will be set for the image
 */
// collections of  scale values for the image
export type Scale =
    /** None - Scale value will be set as None for the image */
    'None' |
    /** Meet - Scale value Meet will be set for the image */
    'Meet' |
    /** Slice - Scale value Slice will be set for the image */
    'Slice';

/**
 * None - Alignment value will be set as none
 * XMinYMin - smallest X value of the view port and  smallest Y value of the view port
 * XMidYMin - midpoint X value of the view port and  smallest Y value of the view port
 * XMaxYMin - maximum X value of the view port and  smallest Y value of the view port
 * XMinYMid - smallest X value of the view port and midpoint Y value of the view port
 * XMidYMid - midpoint X value of the view port and midpoint Y value of the view port
 * XMaxYMid - maximum X value of the view port and midpoint Y value of the view port
 * XMinYMax - smallest X value of the view port and maximum Y value of the view port
 * XMidYMax - midpoint X value of the view port and maximum Y value of the view port
 * XMaxYMax - maximum X value of the view port and maximum Y value of the view port
 */
//collection of alignment values for the image
export type ImageAlignment =
    /** None - Alignment value will be set as none */
    'None' |
    /** XMinYMin - smallest X value of the view port and  smallest Y value of the view port */
    'XMinYMin' |
    /** XMidYMin - midpoint X value of the view port and  smallest Y value of the view port */
    'XMidYMin' |
    /** XMaxYMin - maximum X value of the view port and  smallest Y value of the view port */
    'XMaxYMin' |
    /** XMinYMid - smallest X value of the view port and midpoint Y value of the view port */
    'XMinYMid' |
    /** XMidYMid - midpoint X value of the view port and midpoint Y value of the view port */
    'XMidYMid' |
    /** XMaxYMid - maximum X value of the view port and midpoint Y value of the view port */
    'XMaxYMid' |
    /** XMinYMax - smallest X value of the view port and maximum Y value of the view port */
    'XMinYMax' |
    /** XMidYMax - midpoint X value of the view port and maximum Y value of the view port */
    'XMidYMax' |
    /** XMaxYMax - maximum X value of the view port and maximum Y value of the view port */
    'XMaxYMax';

/**
 * Defines the type of the flow shape
 * Process - Sets the type of the flow shape as Process
 * Decision - Sets the type of the flow shape as Decision
 * Document - Sets the type of the flow shape as Document
 * PreDefinedProcess - Sets the type of the flow shape as PreDefinedProcess
 * Terminator - Sets the type of the flow shape as Terminator
 * PaperTap - Sets the type of the flow shape as PaperTap
 * DirectData - Sets the type of the flow shape as DirectData
 * SequentialData - Sets the type of the flow shape as SequentialData
 * MultiData - Sets the type of the flow shape as MultiData
 * Collate - Sets the type of the flow shape as Collate
 * SummingJunction - Sets the type of the flow shape as SummingJunction
 * Or - Sets the type of the flow shape as Or
 * InternalStorage - Sets the type of the flow shape as InternalStorage
 * Extract - Sets the type of the flow shape as Extract
 * ManualOperation - Sets the type of the flow shape as ManualOperation
 * Merge - Sets the type of the flow shape as Merge
 * OffPageReference - Sets the type of the flow shape as OffPageReference
 * SequentialAccessStorage - Sets the type of the flow shape as SequentialAccessStorage
 * Annotation - Sets the type of the flow shape as Annotation
 * Annotation2 - Sets the type of the flow shape as Annotation2
 * Data - Sets the type of the flow shape as Data
 * Card - Sets the type of the flow shape as Card
 * Delay - Sets the type of the flow shape as Delay
 * Preparation - Sets the type of the flow shape as Preparation
 * Display - Sets the type of the flow shape as Display
 * ManualInput - Sets the type of the flow shape as ManualInput
 * LoopLimit - Sets the type of the flow shape as LoopLimit
 * StoredData - Sets the type of the flow shape as StoredData
 */
export type FlowShapes =
    /** Terminator - Sets the type of the flow shape as Terminator */
    'Terminator' |
    /** Process - Sets the type of the flow shape as Process */
    'Process' |
    /** Decision - Sets the type of the flow shape as Decision */
    'Decision' |
    /** Document - Sets the type of the flow shape as Document */
    'Document' |
    /** PreDefinedProcess - Sets the type of the flow shape as PreDefinedProcess */
    'PreDefinedProcess' |
    /** PaperTap - Sets the type of the flow shape as PaperTap */
    'PaperTap' |
    /** DirectData - Sets the type of the flow shape as DirectData */
    'DirectData' |
    /** SequentialData - Sets the type of the flow shape as SequentialData */
    'SequentialData' |
    /** Sort - Sets the type of the flow shape as Sort */
    'Sort' |
    /** MultiDocument - Sets the type of the flow shape as MultiDocument */
    'MultiDocument' |
    /** Collate - Sets the type of the flow shape as Collate */
    'Collate' |
    /** SummingJunction - Sets the type of the flow shape as SummingJunction */
    'SummingJunction' |
    /** Or - Sets the type of the flow shape as Or */
    'Or' |
    /** InternalStorage - Sets the type of the flow shape as InternalStorage */
    'InternalStorage' |
    /** Extract - Sets the type of the flow shape as Extract */
    'Extract' |
    /** ManualOperation - Sets the type of the flow shape as ManualOperation */
    'ManualOperation' |
    /** Merge - Sets the type of the flow shape as Merge */
    'Merge' |
    /** OffPageReference - Sets the type of the flow shape as OffPageReference */
    'OffPageReference' |
    /** SequentialAccessStorage - Sets the type of the flow shape as SequentialAccessStorage */
    'SequentialAccessStorage' |
    /** Annotation - Sets the type of the flow shape as Annotation */
    'Annotation' |
    /** Annotation2 - Sets the type of the flow shape as Annotation2 */
    'Annotation2' |
    /** Data - Sets the type of the flow shape as Data */
    'Data' |
    /** Card - Sets the type of the flow shape as Card */
    'Card' |
    /** Delay - Sets the type of the flow shape as Delay */
    'Delay' |
    /** Preparation - Sets the type of the flow shape as Preparation */
    'Preparation' |
    /** Display - Sets the type of the flow shape as Display */
    'Display' |
    /** ManualInput - Sets the type of the flow shape as ManualInput */
    'ManualInput' |
    /** LoopLimit - Sets the type of the flow shape as LoopLimit */
    'LoopLimit' |
    /** StoredData - Sets the type of the flow shape as StoredData */
    'StoredData';


/**
 * Defines the basic shapes
 * Rectangle - Sets the type of the basic shape as Rectangle
 * Ellipse - Sets the type of the basic shape as Ellipse
 * Hexagon - Sets the type of the basic shape as Hexagon
 * Parallelogram - Sets the type of the basic shape as Parallelogram
 * Triangle - Sets the type of the basic shape as Triangle
 * Plus - Sets the type of the basic shape as Plus
 * Star - Sets the type of the basic shape as Star
 * Pentagon - Sets the type of the basic shape as Pentagon
 * Heptagon - Sets the type of the basic shape as Heptagon
 * Octagon - Sets the type of the basic shape as Octagon
 * Trapezoid - Sets the type of the basic shape as Trapezoid
 * Decagon - Sets the type of the basic shape as Decagon
 * RightTriangle - Sets the type of the basic shape as RightTriangle
 * Cylinder - Sets the type of the basic shape as Cylinder
 * Diamond - Sets the type of the basic shape as Diamond
 */
export type BasicShapes =
    /** Rectangle - Sets the type of the basic shape as Rectangle */
    'Rectangle' |
    /** Ellipse - Sets the type of the basic shape as Ellipse */
    'Ellipse' |
    /** Hexagon - Sets the type of the basic shape as Hexagon */
    'Hexagon' |
    /** Parallelogram - Sets the type of the basic shape as Parallelogram */
    'Parallelogram' |
    /** Triangle - Sets the type of the basic shape as Triangle */
    'Triangle' |
    /** Plus - Sets the type of the basic shape as Plus */
    'Plus' |
    /** Star - Sets the type of the basic shape as Star */
    'Star' |
    /** Pentagon - Sets the type of the basic shape as Pentagon */
    'Pentagon' |
    /** Heptagon - Sets the type of the basic shape as Heptagon */
    'Heptagon' |
    /** Octagon - Sets the type of the basic shape as Octagon */
    'Octagon' |
    /** Trapezoid - Sets the type of the basic shape as Trapezoid */
    'Trapezoid' |
    /** Decagon - Sets the type of the basic shape as Decagon */
    'Decagon' |
    /** RightTriangle - Sets the type of the basic shape as RightTriangle */
    'RightTriangle' |
    /** Cylinder - Sets the type of the basic shape as Cylinder */
    'Cylinder' |
    /** Diamond - Sets the type of the basic shape as Diamond */
    'Diamond' |
    /** Polygon - Sets the type of the basic shape as Polygon */
    'Polygon';

/**
 * Defines the type of the Bpmn Shape
 * Event - Sets the type of the Bpmn Shape as Event
 * Gateway - Sets the type of the Bpmn Shape as Gateway
 * Message - Sets the type of the Bpmn Shape as Message
 * DataObject - Sets the type of the Bpmn Shape as DataObject
 * DataSource - Sets the type of the Bpmn Shape as DataSource
 * Activity - Sets the type of the Bpmn Shape as Activity
 * Group - Sets the type of the Bpmn Shape as Group
 * TextAnnotation - Represents the shape as Text Annotation
 */
export type BpmnShapes =
    /** Event - Sets the type of the Bpmn Shape as Event */
    'Event' |
    /** Gateway - Sets the type of the Bpmn Shape as Gateway */
    'Gateway' |
    /** Message - Sets the type of the Bpmn Shape as Message */
    'Message' |
    /** DataObject - Sets the type of the Bpmn Shape as DataObject */
    'DataObject' |
    /** DataSource - Sets the type of the Bpmn Shape as DataSource */
    'DataSource' |
    /** Activity - Sets the type of the Bpmn Shape as Activity */
    'Activity' |
    /** Group - Sets the type of the Bpmn Shape as Group */
    'Group' |
    /** TextAnnotation - Represents the shape as Text Annotation */
    'TextAnnotation';

/**
 * Defines the type of the UMLActivity Shape
 * Action - Sets the type of the UMLActivity Shape as Action
 * Decision - Sets the type of the UMLActivity Shape as Decision
 * MergeNode - Sets the type of the UMLActivity Shape as MergeNode
 * InitialNode - Sets the type of the UMLActivity Shape as InitialNode
 * FinalNode - Sets the type of the UMLActivity Shape as FinalNode
 * ForkNode - Sets the type of the UMLActivity Shape as ForkNode
 * JoinNode - Sets the type of the UMLActivity Shape as JoinNode
 * TimeEvent - Represents the UMLActivity shape as TimeEvent
 *
 * @IgnoreSingular
 */
export type UmlActivityShapes =
    /** Action - Sets the type of the UMLActivity Shape as Action */
    'Action' |
    /** Decision - Sets the type of the UMLActivity Shape as Decision */
    'Decision' |
    /** MergeNode - Sets the type of the UMLActivity Shape as MergeNode */
    'MergeNode' |
    /** InitialNode - Sets the type of the UMLActivity Shape as InitialNode */
    'InitialNode' |
    /** FinalNode - Sets the type of the UMLActivity Shape as FinalNode */
    'FinalNode' |
    /** ForkNode - Sets the type of the UMLActivity Shape as ForkNode */
    'ForkNode' |
    /** JoinNode - Sets the type of the UMLActivity Shape as JoinNode */
    'JoinNode' |
    /** TimeEvent - Represents the shape as TimeEvent */
    'TimeEvent' |
    /** AcceptingEvent - Sets the type of the UMLActivity Shape as AcceptingEvent */
    'AcceptingEvent' |
    /** SendSignal - Sets the type of the UMLActivity Shape as SendSignal */
    'SendSignal' |
    /** ReceiveSignal - Sets the type of the UMLActivity Shape as ReceiveSignal */
    'ReceiveSignal' |
    /** StructuredNode - Sets the type of the UMLActivity Shape as StructuredNode */
    'StructuredNode' |
    /** Note - Sets the type of the UMLActivity Shape as Note */
    'Note';

/**
 * Defines the type of the UMLActivity flows
 * Object - Sets the type of the UMLActivity Flow as Object
 * Control - Sets the type of the UMLActivity Flow as Control
 * Exception - Sets the type of the UMLActivity Flow as Exception
 *
 * @IgnoreSingular
 */
export type UmlActivityFlows =
    /** Object - Sets the type of the UMLActivity Flow as Object */
    'Object' |
    /** Control - Sets the type of the UMLActivity Flow as Control */
    'Control' |
    /** Exception - Sets the type of the UMLActivity Flow as Exception */
    'Exception';

/**
 * Defines the type of the Bpmn Events
 * Start - Sets the type of the Bpmn Event as Start
 * Intermediate - Sets the type of the Bpmn Event as Intermediate
 * End - Sets the type of the Bpmn Event as End
 * NonInterruptingStart - Sets the type of the Bpmn Event as NonInterruptingStart
 * NonInterruptingIntermediate - Sets the type of the Bpmn Event as NonInterruptingIntermediate
 * ThrowingIntermediate - Sets the type of the Bpmn Event as ThrowingIntermediate
 */
export type BpmnEvents =
    /** Sets the type of the Bpmn Event as Start */
    'Start' |
    /** Sets the type of the Bpmn Event as Intermediate */
    'Intermediate' |
    /** Sets the type of the Bpmn Event as End */
    'End' |
    /** Sets the type of the Bpmn Event as NonInterruptingStart */
    'NonInterruptingStart' |
    /** Sets the type of the Bpmn Event as NonInterruptingIntermediate */
    'NonInterruptingIntermediate' |
    /** Sets the type of the Bpmn Event as ThrowingIntermediate */
    'ThrowingIntermediate';

/**
 * Defines the type of the Bpmn Triggers
 * None - Sets the type of the trigger as None
 * Message - Sets the type of the trigger as Message
 * Timer - Sets the type of the trigger as Timer
 * Escalation - Sets the type of the trigger as Escalation
 * Link - Sets the type of the trigger as Link
 * Error - Sets the type of the trigger as Error
 * Compensation - Sets the type of the trigger as Compensation
 * Signal - Sets the type of the trigger as Signal
 * Multiple - Sets the type of the trigger as Multiple
 * Parallel - Sets the type of the trigger as Parallel
 * Cancel - Sets the type of the trigger as Cancel
 * Conditional - Sets the type of the trigger as Conditional
 * Terminate - Sets the type of the trigger as Terminate
 */
export type BpmnTriggers =
    /** None - Sets the type of the trigger as None */
    'None' |
    /** Message - Sets the type of the trigger as Message */
    'Message' |
    /** Timer - Sets the type of the trigger as Timer */
    'Timer' |
    /** Escalation - Sets the type of the trigger as Escalation */
    'Escalation' |
    /** Link - Sets the type of the trigger as Link */
    'Link' |
    /** Error - Sets the type of the trigger as Error */
    'Error' |
    /** Compensation - Sets the type of the trigger as Compensation */
    'Compensation' |
    /** Signal - Sets the type of the trigger as Signal */
    'Signal' |
    /** Multiple - Sets the type of the trigger as Multiple */
    'Multiple' |
    /** Parallel - Sets the type of the trigger as Parallel */
    'Parallel' |
    /** Cancel - Sets the type of the trigger as Cancel */
    'Cancel' |
    /** Conditional - Sets the type of the trigger as Conditional */
    'Conditional' |
    /** Terminate - Sets the type of the trigger as Terminate */
    'Terminate';

/**
 * Defines the type of the Bpmn gateways
 * None - Sets the type of the gateway as None
 * Exclusive - Sets the type of the gateway as Exclusive
 * Inclusive - Sets the type of the gateway as Inclusive
 * Parallel - Sets the type of the gateway as Parallel
 * Complex - Sets the type of the gateway as Complex
 * EventBased - Sets the type of the gateway as EventBased
 * ExclusiveEventBased - Sets the type of the gateway as ExclusiveEventBased
 * ParallelEventBased - Sets the type of the gateway as ParallelEventBased
 */
export type BpmnGateways =
    /** None - Sets the type of the gateway as None */
    'None' |
    /** Exclusive - Sets the type of the gateway as Exclusive */
    'Exclusive' |
    /** Inclusive - Sets the type of the gateway as Inclusive */
    'Inclusive' |
    /** Parallel - Sets the type of the gateway as Parallel */
    'Parallel' |
    /** Complex - Sets the type of the gateway as Complex */
    'Complex' |
    /** EventBased - Sets the type of the gateway as EventBased */
    'EventBased' |
    /** ExclusiveEventBased - Sets the type of the gateway as ExclusiveEventBased */
    'ExclusiveEventBased' |
    /** ParallelEventBased - Sets the type of the gateway as ParallelEventBased */
    'ParallelEventBased';

/**
 * Defines the type of the Bpmn Data Objects
 * None - Sets the type of the data object as None
 * Input - Sets the type of the data object as Input
 * Output - Sets the type of the data object as Output
 */
export type BpmnDataObjects =
    /** None - Sets the type of the data object as None */
    'None' |
    /** Input - Sets the type of the data object as Input */
    'Input' |
    /** Output - Sets the type of the data object as Output */
    'Output';

/**
 * Defines the type of the Bpmn Activity
 * None - Sets the type of the Bpmn Activity as None
 * Task - Sets the type of the Bpmn Activity as Task
 * SubProcess - Sets the type of the Bpmn Activity as SubProcess
 */
export type BpmnActivities =
    /** Task - Sets the type of the Bpmn Activity as Task */
    'Task' |
    /** None - Sets the type of the Bpmn Activity as None */
    'None' |
    /** SubProcess - Sets the type of the Bpmn Activity as SubProcess */
    'SubProcess';

/**
 * Defines the type of the Bpmn Loops
 * None - Sets the type of the Bpmn loop as None
 * Standard - Sets the type of the Bpmn loop as Standard
 * ParallelMultiInstance - Sets the type of the Bpmn loop as ParallelMultiInstance
 * SequenceMultiInstance - Sets the type of the Bpmn loop as SequenceMultiInstance
 */
export type BpmnLoops =
    /** None - Sets the type of the Bpmn loop as None */
    'None' |
    /** Standard - Sets the type of the Bpmn loop as Standard */
    'Standard' |
    /** ParallelMultiInstance - Sets the type of the Bpmn loop as ParallelMultiInstance */
    'ParallelMultiInstance' |
    /** SequenceMultiInstance - Sets the type of the Bpmn loop as SequenceMultiInstance */
    'SequenceMultiInstance';

/**
 * Defines the type of the Bpmn Tasks
 * None - Sets the type of the Bpmn Tasks as None
 * Service - Sets the type of the Bpmn Tasks as Service
 * Receive - Sets the type of the Bpmn Tasks as Receive
 * Send - Sets the type of the Bpmn Tasks as Send
 * InstantiatingReceive - Sets the type of the Bpmn Tasks as InstantiatingReceive
 * Manual - Sets the type of the Bpmn Tasks as Manual
 * BusinessRule - Sets the type of the Bpmn Tasks as BusinessRule
 * User - Sets the type of the Bpmn Tasks as User
 * Script - Sets the type of the Bpmn Tasks as Script
 */
export type BpmnTasks =
    /** None - Sets the type of the Bpmn Tasks as None */
    'None' |
    /** Service - Sets the type of the Bpmn Tasks as Service */
    'Service' |
    /** Receive - Sets the type of the Bpmn Tasks as Receive */
    'Receive' |
    /** Send - Sets the type of the Bpmn Tasks as Send */
    'Send' |
    /** InstantiatingReceive - Sets the type of the Bpmn Tasks as InstantiatingReceive */
    'InstantiatingReceive' |
    /** Manual - Sets the type of the Bpmn Tasks as Manual */
    'Manual' |
    /** BusinessRule - Sets the type of the Bpmn Tasks as BusinessRule */
    'BusinessRule' |
    /** User - Sets the type of the Bpmn Tasks as User */
    'User' |
    /** Script - Sets the type of the Bpmn Tasks as Script */
    'Script';

/**
 * Defines the type of the Bpmn Subprocess
 * None - Sets the type of the Sub process as None
 * Transaction - Sets the type of the Sub process as Transaction
 * Event - Sets the type of the Sub process as Event
 */
export type BpmnSubProcessTypes =
    /** None - Sets the type of the Sub process as None */
    'None' |
    /** Transaction - Sets the type of the Sub process as Transaction */
    'Transaction' |
    /** Event - Sets the type of the Sub process as Event */
    'Event';

/**
 * Defines the type of the Bpmn boundary
 * Default - Sets the type of the boundary as Default
 * Call - Sets the type of the boundary as Call
 * Event - Sets the type of the boundary as Event
 */
export type BpmnBoundary =
    /** Default - Sets the type of the boundary as Default */
    'Default' |
    /** Call - Sets the type of the boundary as Call */
    'Call' |
    /** Event - Sets the type of the boundary as Event */
    'Event';

/**
 * Defines the connection shapes
 * Bpmn - Sets the type of the connection shape as Bpmn
 */
export type ConnectionShapes =
    /** None - Sets the type of the connection shape as None */
    'None' |
    /** Bpmn - Sets the type of the connection shape as Bpmn */
    'Bpmn' |
    /** UMLActivity - Sets the type of the connection shape as UMLActivity */
    'UmlActivity' |
    /** UMLClassifier - Sets the type of the connection shape as UMLClassifier */
    'UmlClassifier';

/**
 * Defines the type of the Bpmn flows
 * Sequence - Sets the type of the Bpmn Flow as Sequence
 * Association - Sets the type of the Bpmn Flow as Association
 * Message - Sets the type of the Bpmn Flow as Message
 */
export type BpmnFlows =
    /** Sequence - Sets the type of the Bpmn Flow as Sequence */
    'Sequence' |
    /** Association - Sets the type of the Bpmn Flow as Association */
    'Association' |
    /** Message - Sets the type of the Bpmn Flow as Message */
    'Message';

/**
 * Defines the type of the Bpmn Association Flows
 * Default - Sets the type of Association flow as Default
 * Directional - Sets the type of Association flow as Directional
 * BiDirectional - Sets the type of Association flow as BiDirectional
 */
export type BpmnAssociationFlows =
    /** Default - Sets the type of Association flow as Default */
    'Default' |
    /** Directional - Sets the type of Association flow as Directional */
    'Directional' |
    /** BiDirectional - Sets the type of Association flow as BiDirectional */
    'BiDirectional';

/**
 * Defines the type of the Bpmn Message Flows
 * Default - Sets the type of the Message flow as Default
 * InitiatingMessage - Sets the type of the Message flow as InitiatingMessage
 * NonInitiatingMessage - Sets the type of the Message flow as NonInitiatingMessage
 */
export type BpmnMessageFlows =
    /** Default - Sets the type of the Message flow as Default */
    'Default' |
    /** InitiatingMessage - Sets the type of the Message flow as InitiatingMessage */
    'InitiatingMessage' |
    /** NonInitiatingMessage - Sets the type of the Message flow as NonInitiatingMessage */
    'NonInitiatingMessage';

/**
 * Defines the type of the Bpmn Sequence flows
 * Default - Sets the type of the sequence flow as Default
 * Normal - Sets the type of the sequence flow as Normal
 * Conditional - Sets the type of the sequence flow as Conditional
 */
export type BpmnSequenceFlows =
    /** Normal - Sets the type of the sequence flow as Normal */
    'Normal' |
    /** Default - Sets the type of the sequence flow as Default */
    'Default' |
    /** Conditional - Sets the type of the sequence flow as Conditional */
    'Conditional';

/**
 * Defines the segment type of the connector
 * Straight - Sets the segment type as Straight
 * Orthogonal - Sets the segment type as Orthogonal
 * Polyline - Sets the segment type as Polyline
 * Bezier - Sets the segment type as Bezier
 */
export type Segments =
    /** Straight - Sets the segment type as Straight */
    'Straight' |
    /** Orthogonal - Sets the segment type as Orthogonal */
    'Orthogonal' |
    /** Polyline - Sets the segment type as Polyline */
    'Polyline' |
    /** Bezier - Sets the segment type as Bezier */
    'Bezier';

/**
 * Defines the decorator shape of the connector
 * None - Sets the decorator shape as None
 * Arrow - Sets the decorator shape as Arrow
 * Diamond - Sets the decorator shape as Diamond
 * Path - Sets the decorator shape as Path
 * OpenArrow - Sets the decorator shape as OpenArrow
 * Circle - Sets the decorator shape as Circle
 * Square - Sets the decorator shape as Square
 * Fletch - Sets the decorator shape as Fletch
 * OpenFetch - Sets the decorator shape as OpenFetch
 * IndentedArrow - Sets the decorator shape as Indented Arrow
 * OutdentedArrow - Sets the decorator shape as Outdented Arrow
 * DoubleArrow - Sets the decorator shape as DoubleArrow
 */
export type DecoratorShapes =
    /** Arrow - Sets the decorator shape as Arrow */
    'Arrow' |
    /** None - Sets the decorator shape as None */
    'None' |
    /** Diamond - Sets the decorator shape as Diamond */
    'Diamond' |
    /** OpenArrow - Sets the decorator shape as OpenArrow */
    'OpenArrow' |
    /** Circle - Sets the decorator shape as Circle */
    'Circle' |
    /** Square - Sets the decorator shape as Square */
    'Square' |
    /** Fletch - Sets the decorator shape as Fletch */
    'Fletch' |
    /** OpenFetch - Sets the decorator shape as OpenFetch */
    'OpenFetch' |
    /** IndentedArrow - Sets the decorator shape as Indented Arrow */
    'IndentedArrow' |
    /** OutdentedArrow - Sets the decorator shape as Outdented Arrow */
    'OutdentedArrow' |
    /** DoubleArrow - Sets the decorator shape as DoubleArrow */
    'DoubleArrow' |
    /** Custom - Sets the decorator shape as Custom */
    'Custom';

/**
 * Defines the segmentThumb shape of the connector
 * Rhombus - Sets the segmentThumb shape as Rhombus
 * Square - Sets the segmentThumb shape as Square
 * Rectangle - Sets the segmentThumb shape as Rectangle
 * Ellipse - Sets the segmentThumb shape as Ellipse
 * Arrow - Sets the segmentThumb shape as Arrow
 * Diamond - Sets the segmentThumb shape as Diamond
 * OpenArrow - Sets the segmentThumb shape as OpenArrow
 * Circle - Sets the segmentThumb shape as Circle
 * Fletch - Sets the segmentThumb shape as Fletch
 * OpenFetch - Sets the segmentThumb shape as OpenFetch
 * IndentedArrow - Sets the segmentThumb shape as Indented Arrow
 * OutdentedArrow - Sets the segmentThumb shape as Outdented Arrow
 * DoubleArrow - Sets the segmentThumb shape as DoubleArrow
 */
 export type SegmentThumbShapes =

 /** Rhombus - Sets the segmentThumb shape as Rhombus */
 'Rhombus'  |
 /** Square - Sets the segmentThumb shape as Square */
 'Square'   |
 /** Rectangle - Sets the segmentThumb shape as Rectangle */
 'Rectangle'|
 /** Ellipse - Sets the segmentThumb shape as Ellipse */
 'Ellipse'   |
 /** Arrow - Sets the segmentThumb shape as Arrow */
 'Arrow' |
 /** Diamond - Sets the segmentThumb shape as Diamond */
 'Diamond' |
 /** OpenArrow - Sets the segmentThumb shape as OpenArrow */
 'OpenArrow' |
 /** Circle - Sets the segmentThumb shape as Circle */
 'Circle' |
 /** Fletch - Sets the segmentThumb shape as Fletch */
 'Fletch' |
 /** OpenFetch - Sets the segmentThumb shape as OpenFetch */
 'OpenFetch' |
 /** IndentedArrow - Sets the segmentThumb shape as Indented Arrow */
 'IndentedArrow' |
 /** OutdentedArrow - Sets the segmentThumb shape as Outdented Arrow */
 'OutdentedArrow' |
 /** DoubleArrow - Sets the segmentThumb shape as DoubleArrow */
 'DoubleArrow' ;

/**
 * Defines the shape of the ports
 * X - Sets the decorator shape as X
 * Circle - Sets the decorator shape as Circle
 * Square - Sets the decorator shape as Square
 * Custom - Sets the decorator shape as Custom
 */
export type PortShapes =
    /** X - Sets the decorator shape as X */
    'X' |
    /** Circle - Sets the decorator shape as Circle */
    'Circle' |
    /** Square - Sets the decorator shape as Square */
    'Square' |
    /** Custom - Sets the decorator shape as Custom */
    'Custom';
/**
 * Defines the unit mode
 * Absolute - Sets the unit mode type as Absolute
 * Fraction - Sets the unit mode type as Fraction
 */
export type UnitMode =
    /** Absolute - Sets the unit mode type as Absolute */
    'Absolute' |
    /** Fraction - Sets the unit mode type as Fraction */
    'Fraction';

/**
 * Defines the property change entry type
 * PositionChanged - Sets the entry type as PositionChanged
 * Align - Sets the entry type as Align
 * Distribute - Sets the entry type as Distribute
 * SizeChanged - Sets the entry type as SizeChanged
 * Sizing - Sets the entry type as Sizing
 * RotationChanged - Sets the entry type as RotationChanged
 * ConnectionChanged - Sets the entry type as ConnectionChanged
 * PropertyChanged - Sets the entry type as PropertyChanged
 * CollectionChanged - Sets the entry type as CollectionChanged
 * StartGroup - Sets the entry type as StartGroup
 * EndGroup - Sets the entry type as EndGroup
 * Group - Sets the entry type as Group
 * UnGroup - Sets the entry type as UnGroup
 * SegmentChanged - Sets the entry type as SegmentChanged
 * LabelCollectionChanged - Sets the entry type as LabelCollectionChanged
 * PortCollectionChanged - Sets the entry type as PortCollectionChanged
 */
export type EntryType =
    /** PositionChanged - Sets the entry type as PositionChanged */
    'PositionChanged' |
    /** Align - Sets the entry type as Align */
    'Align' |
    /** Distribute - Sets the entry type as Distribute */
    'Distribute' |
    /** SizeChanged - Sets the entry type as SizeChanged */
    'SizeChanged' |
    /** Sizing - Sets the entry type as Sizing */
    'Sizing' |
    /** RotationChanged - Sets the entry type as RotationChanged */
    'RotationChanged' |
    /** ConnectionChanged - Sets the entry type as ConnectionChanged */
    'ConnectionChanged' |
    /** PropertyChanged - Sets the entry type as PropertyChanged */
    'PropertyChanged' |
    /** CollectionChanged - Sets the entry type as CollectionChanged */
    'CollectionChanged' |
    /** StartGroup - Sets the entry type as StartGroup */
    'StartGroup' |
    /** EndGroup - Sets the entry type as EndGroup */
    'EndGroup' |
    /** Group - Sets the entry type as Group */
    'Group' |
    /** UnGroup - Sets the entry type as UnGroup */
    'UnGroup' |
    /** SegmentChanged - Sets the entry type as SegmentChanged */
    'SegmentChanged' |
    /** LabelCollectionChanged - Sets the entry type as LabelCollectionChanged */
    'LabelCollectionChanged' |
    /** PortCollectionChanged - Sets the entry type as PortCollectionChanged */
    'PortCollectionChanged' |
    /** PortPositionChanged - Sets the entry type as PortPositionChanged */
    'PortPositionChanged' |
    /** AnnotationPropertyChanged - Sets the entry type as AnnotationPropertyChanged */
    'AnnotationPropertyChanged' |
    /** ChildCollectionChanged - Sets the entry type as ChildCollectionChanged used for add and remove a child collection in a container */
    'ChildCollectionChanged' |
    /** StackNodeChanged - Sets the entry type as StackNodePositionChanged */
    'StackChildPositionChanged' |
    /** ColumnWidthChanged - Sets the entry type as ColumnWidthChanged */
    'ColumnWidthChanged' |
    /** RowHeightChanged - Sets the entry type as RowHeightChanged */
    'RowHeightChanged' |
    /** LanePositionChanged - Sets the entry type as LanePositionChanged */
    'LanePositionChanged' |
    /** PhaseCollectionChanged - Sets the entry type as PhaseCollectionChanged */
    'PhaseCollectionChanged' |
    /** LaneCollectionChanged - Sets the entry type as LaneCollectionChanged */
    'LaneCollectionChanged' |
    /** SendForward - Sets the entry type as sendForward */
    'SendForward' |
    /** SendBackward - Sets the entry type as sendBackward */
    'SendBackward' |
    /** BringToFront - Sets the entry type as bringToFront */
    'BringToFront' |
    /** SendToBack - Sets the entry type as sendToBack */
    'SendToBack' |
    /** AddChildToGroupNode - Sets the entry type as  AddChildToGroupNode */
    'AddChildToGroupNode';
/**
 * Defines the entry category type
 * Internal - Sets the entry category type as Internal
 * External - Sets the entry category type as External
 */
export type EntryCategory =
    /** Internal - Sets the entry category type as Internal */
    'Internal' |
    /** External - Sets the entry category type as External */
    'External';
/**
 * Defines the entry change type
 * Insert - Sets the entry change type as Insert
 * Remove - Sets the entry change type as Remove
 */
export type EntryChangeType =
    /** Insert - Sets the entry change type as Insert */
    'Insert' |
    /** Remove - Sets the entry change type as Remove */
    'Remove';

/**
 * Defines the container/canvas transform
 * Self - Sets the transform type as Self
 * Parent - Sets the transform type as Parent
 */
export enum Transform {
    /** Self - Sets the transform type as Self */
    Self = 1,
    /** Parent - Sets the transform type as Parent */
    Parent = 2
}

/**
 * Defines the nudging direction
 * Left - Nudge the object in the left direction
 * Right - Nudge the object in the right direction
 * Up - Nudge the object in the up direction
 * Down - Nudge the object in the down direction
 */
export type NudgeDirection =
    /** Left - Nudge the object in the left direction */
    'Left' |
    /** Right - Nudge the object in the right direction */
    'Right' |
    /** Up - Nudge the object in the up direction */
    'Up' |
    /** Down - Nudge the object in the down direction */
    'Down';

/**
 * Defines the diagrams stretch
 * None - Sets the stretch type for diagram as None
 * Stretch - Sets the stretch type for diagram as Stretch
 * Meet - Sets the stretch type for diagram as Meet
 * Slice - Sets the stretch type for diagram as Slice
 */
export type Stretch =
    /** None - Sets the stretch type for diagram as None */
    'None' |
    /** Stretch - Sets the stretch type for diagram as Stretch */
    'Stretch' |
    /** Meet - Sets the stretch type for diagram as Meet */
    'Meet' |
    /** Slice - Sets the stretch type for diagram as Slice */
    'Slice';

/**
 * Defines the BoundaryConstraints for the diagram
 * Infinity - Allow the interactions to take place at the infinite height and width
 * Diagram - Allow the interactions to take place around the diagram height and width
 * Page - Allow the interactions to take place around the page height and width
 */

export type BoundaryConstraints =
    /** Infinity - Allow the interactions to take place at the infinite height and width */
    'Infinity' |
    /** Diagram - Allow the interactions to take place around the diagram height and width */
    'Diagram' |
    /** Page - Allow the interactions to take place around the page height and width */
    'Page';

/**
 * Defines the rendering mode for diagram
 * Canvas - Sets the rendering mode type as Canvas
 * Svg - Sets the rendering mode type as Svg
 */
export enum RenderMode {
    /** Canvas - Sets the rendering mode type as Canvas */
    Canvas,
    /** Svg - Sets the rendering mode type as Svg */
    Svg
}
/**
 * Defines the objects direction
 * Left - Sets the direction type as Left
 * Right - Sets the direction type as Right
 * Top - Sets the direction type as Top
 * Bottom - Sets the direction type as Bottom
 */
export type Direction =
    /** Left - Sets the direction type as Left */
    'Left' |
    /** Right - Sets the direction type as Right */
    'Right' |
    /** Top - Sets the direction type as Top */
    'Top' |
    /** Bottom - Sets the direction type as Bottom */
    'Bottom';

/**
 * Defines the scrollable region of diagram
 * Diagram - Enables scrolling to view the diagram content
 * Infinity - Diagram will be extended, when we try to scroll the diagram
 */
export type ScrollLimit =
    /** Diagram - Enables scrolling to view the diagram content */
    'Diagram' |
    /** Infinity - Diagram will be extended, when we try to scroll the diagram */
    'Infinity' |
    /** Limited - Diagram scrolling will be limited */
    'Limited';

/**
 * Sets a combination of key modifiers, on recognition of which the command will be executed.They are
 * * None - no modifiers are pressed
 * * Control - ctrl key
 * * Meta - meta key im mac
 * * Alt - alt key
 * * Shift - shift key
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */

export enum KeyModifiers {
    /** No modifiers are pressed */
    None = 0,
    /** The CTRL key */
    Control = 1 << 0,
    /** The Meta key pressed in Mac */
    Meta = 1 << 0,
    /** The ALT key */
    Alt = 1 << 1,
    /** The Shift key */
    Shift = 1 << 2
}

/**
 * Sets the key value, on recognition of which the command will be executed. They are
 * * none - no key
 * * Number0 = The 0 key
 * * Number1 = The 1 key
 * * Number2 = The 2 key
 * * Number3 = The 3 key
 * * Number4 = The 4 key
 * * Number5 = The 5 key
 * * Number6 = The 6 key
 * * Number7 = The 7 key
 * * Number8 = The 8 key
 * * Number9 = The 9 key
 * * Number0 = The 0 key
 * * BackSpace = The BackSpace key
 * * F1 = The f1 key
 * * F2 = The f2 key
 * * F3 = The f3 key
 * * F4 = The f4 key
 * * F5 = The f5 key
 * * F6 = The f6 key
 * * F7 = The f7 key
 * * F8 = The f8 key
 * * F9 = The f9 key
 * * F10 = The f10 key
 * * F11 = The f11 key
 * * F12 = The f12 key
 * * A = The a key
 * * B = The b key
 * * C = The c key
 * * D = The d key
 * * E = The e key
 * * F = The f key
 * * G = The g key
 * * H = The h key
 * * I = The i key
 * * J = The j key
 * * K = The k key
 * * L = The l key
 * * M = The m key
 * * N = The n key
 * * O = The o key
 * * P = The p key
 * * Q = The q key
 * * R = The r key
 * * S = The s key
 * * T = The t key
 * * U = The u key
 * * V = The v key
 * * W = The w key
 * * X = The x key
 * * Y = The y key
 * * Z = The z key
 * * Left = The left key
 * * Right = The right key
 * * Top = The top key
 * * Bottom = The bottom key
 * * Escape = The Escape key
 * * Tab = The tab key
 * * Delete = The delete key
 * * Enter = The enter key
 * * The Space key
 * * The page up key
 * * The page down key
 * * The end key
 * * The home key
 * * The Minus
 * * The Plus
 * * The Star
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */

export enum Keys {
    /** No key pressed */
    None = null,
    /** The 0 key */
    Number0 = 0,
    /** The 1 key */
    Number1 = 1,
    /** The 2 key */
    Number2 = 2,
    /** The 3 key */
    Number3 = 3,
    /** The 4 key */
    Number4 = 4,
    /** The 5 key */
    Number5 = 5,
    /** The 6 key */
    Number6 = 6,
    /** The 7 key */
    Number7 = 7,
    /** The 8 key */
    Number8 = 8,
    /** The 9 key */
    Number9 = 9,
    /** The A key */
    A = 65,
    /** The B key */
    B = 66,
    /** The C key */
    C = 67,
    /** The D key */
    D = 68,
    /** The E key */
    E = 69,
    /** The F key */
    F = 70,
    /** The G key */
    G = 71,
    /** The H key */
    H = 72,
    /** The I key */
    I = 73,
    /** The J key */
    J = 74,
    /** The K key */
    K = 75,
    /** The L key */
    L = 76,
    /** The M key */
    M = 77,
    /** The N key */
    N = 78,
    /** The O key */
    O = 79,
    /** The P key */
    P = 80,
    /** The Q key */
    Q = 81,
    /** The R key */
    R = 82,
    /** The S key */
    S = 83,
    /** The T key */
    T = 84,
    /** The U key */
    U = 85,
    /** The V key */
    V = 86,
    /** The W key */
    W = 87,
    /** The X key */
    X = 88,
    /** The Y key */
    Y = 89,
    /** The Z key */
    Z = 90,
    /** The left arrow key */
    Left = 37,
    /** The up arrow key */
    Up = 38,
    /** The right arrow key */
    Right = 39,
    /** The down arrow key */
    Down = 40,
    /** The Escape key */
    Escape = 27,
    /** The Space key */
    Space = 32,
    /** The page up key */
    PageUp = 33,
    /** The Space key */
    PageDown = 34,
    /** The Space key */
    End = 35,
    /** The Space key */
    Home = 36,
    /** The delete key */
    Delete = 46,
    /** The tab key */
    Tab = 9,
    /** The enter key */
    Enter = 13,
    /** The BackSpace key */
    BackSpace = 8,
    /** The F1 key */
    F1 = 112,
    /** The F2 key */
    F2 = 113,
    /** The F3 key */
    F3 = 114,
    /** The F4 key */
    F4 = 115,
    /** The F5 key */
    F5 = 116,
    /** The F6 key */
    F6 = 117,
    /** The F7 key */
    F7 = 118,
    /** The F8 key */
    F8 = 119,
    /** The F9 key */
    F9 = 120,
    /** The F10 key */
    F10 = 121,
    /** The F111 key */
    F11 = 122,
    /** The F12 key */
    F12 = 123,
    /** The Star */
    Star = 56,
    /** The Plus */
    Plus = 187,
    /** The Minus */
    Minus = 189
}
/**
 * Enables/Disables certain actions of diagram
 * * Render - Indicates the diagram is in render state.
 * * PublicMethod - Indicates the diagram public method is in action.
 * * ToolAction - Indicates the diagram Tool is in action.
 * * UndoRedo - Indicates the diagram undo/redo is in action.
 * * TextEdit - Indicates the text editing is in progress.
 * * Group - Indicates the group is in progress.
 * * Clear - Indicates diagram have clear all.
 * * PreventClearSelection - prevents diagram from clear selection
 */
export enum DiagramAction {
    /** Indicates the diagram is in render state.r */
    Render = 1 << 1,
    /** Indicates the diagram public method is in action. */
    PublicMethod = 1 << 2,
    /** Indicates the diagram Tool is in action. */
    ToolAction = 1 << 3,
    /** Indicates the diagram undo/redo is in action. */
    UndoRedo = 1 << 4,
    /** Indicates the text editing is in progress. */
    TextEdit = 1 << 5,
    /** Indicates the group is in progress. */
    Group = 1 << 6,
    /** Indicates diagram have clear all. */
    Clear = 1 << 7,
    /** prevents diagram from clear selection. */
    PreventClearSelection = 1 << 8,
    /** Indicates whether drag or rotate tool has been activated */
    Interactions = 1 << 9,
    /** Use to prevent the history during some action in diagram */
    PreventHistory = 1 << 10,
    /** Use to prevent the icon while expand a node in diagram */
    PreventIconsUpdate = 1 << 11,
    /** Use to prevent the collection change event while dragging lane from palette and over it in diagram */
    PreventCollectionChangeOnDragOver = 1 << 12,
    /** Use to prevent the z order on dragging the diagram elements */
    PreventZIndexOnDragging = 1 << 13,
    /** Indicates whether group dragging has been activated */
    isGroupDragging = 1 << 14,
    /** Indicates whether drag is initiated by mouse  */
    DragUsingMouse = 1 << 15,
    /** Indicates whether decorator property is changed or not */
    DecoratorPropertyChange = 1 << 16, 
    /** Avoid dropping of child nodes into the swim lane */
    PreventLaneContainerUpdate = 1 << 17
}
/** @private */
export type DiagramHistoryAction = 'AddNodeToLane';
/**
 * Defines the Selector type to be drawn
 * None - Draws Normal selector with resize handles
 * Symbol - Draws only the rectangle for the selector
 */
export enum RendererAction {
    /** None - Draws Normal selector with resize handles */
    None = 1 << 1,
    /** DrawSelectorBorder - Draws only the Border for the selector */
    DrawSelectorBorder = 1 << 2,
    /** PreventRenderSelector - Avoid the render of selector during interaction */
    PreventRenderSelector = 1 << 3
}

export enum RealAction {
    None = 0,
    PreventDrag = 1 << 1,
    PreventScale = 1 << 2,
    PreventDataInit = 1 << 3,
    /** Indicates when the diagram is scrolled horizontal using scroll bar */
    hScrollbarMoved = 1 << 4,
    /** Indicates when the diagram is scrolled vertical using scroll bar */
    vScrollbarMoved = 1 << 5,
    /** Indicates whether animation happens or not  */
    AnimationClick = 1 << 6,
    /** Enable the group action */
    EnableGroupAction = 1 << 7,
    /** Indicate action in Progress */
    PanInProgress = 1 << 8,
    /** Indicate overview action  */
    OverViewAction = 1 << 9
}

/** @private */
export enum ScrollActions {
    None = 0,
    /** Indicates when the scroll properties are changed using property change */
    PropertyChange = 1 << 10,
    /** Indicates when the scroll properties are changed using interaction */
    Interaction = 1 << 11
}

/** @private */
export enum NoOfSegments {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five
}

/** @private */
export type SourceTypes = 'HierarchicalData' | 'MindMap';

/**
 * Defines the relative mode of the tooltip
 * Object - sets the tooltip position relative to the node
 * Mouse - sets the tooltip position relative to the mouse
 */
export type TooltipRelativeMode =
    /** Object - sets the tooltip position relative to the node */
    'Object' |
    /** Mouse - sets the tooltip position relative to the mouse */
    'Mouse';

/**
 * Collections of icon content shapes.
 * None
 * Minus - sets the icon shape as minus
 * Plus - sets the icon shape as Plus
 * ArrowUp - sets the icon shape as ArrowUp
 * ArrowDown - sets the icon shape as ArrowDown
 * Template - sets the icon shape based on  the given  custom template
 * Path - sets the icon shape based on the given  custom Path
 */
export type IconShapes =
    /** None - sets the icon shape as None */
    'None' |
    /** Minus - sets the icon shape as minus */
    'Minus' |
    /** Plus - sets the icon shape as Plus */
    'Plus' |
    /** ArrowUp - sets the icon shape as ArrowUp */
    'ArrowUp' |
    /** ArrowDown - sets the icon shape as ArrowDown */
    'ArrowDown' |
    /** Template - sets the icon shape based on  the given  custom template */
    'Template' |
    /** Path - sets the icon shape based on the given  custom Path */
    'Path';

/**
 * Defines the collection of sub tree orientations in an organizational chart
 * Vertical - Aligns the child nodes in vertical manner
 * Horizontal - Aligns the child nodes in horizontal manner
 */
export type SubTreeOrientation =
    /** Horizontal - Aligns the child nodes in horizontal manner */
    'Horizontal' |
    /** Vertical - Aligns the child nodes in vertical manner */
    'Vertical';
/**
 * Defines the collection of sub tree alignments in an organizational chart
 * Left - Aligns the child nodes at the left of the parent in a horizontal/vertical sub tree
 * Right - Aligns the child nodes at the right of the parent in a horizontal/vertical sub tree
 * Center - Aligns the child nodes at the center of the parent in a horizontal sub tree
 * Alternate - Aligns the child nodes at both left and right sides of the parent in a vertical sub tree
 * Balanced - Aligns the child nodes in multiple rows to balance the width and height of the horizontal sub tree
 */
export type SubTreeAlignments =
    /** Left - Aligns the child nodes at the left of the parent in a horizontal/vertical sub tree */
    'Left' |
    /** Right - Aligns the child nodes at the right of the parent in a horizontal/vertical sub tree */
    'Right' |
    /** Center - Aligns the child nodes at the center of the parent in a horizontal sub tree */
    'Center' |
    /** Alternate - Aligns the child nodes at both left and right sides of the parent in a vertical sub tree */
    'Alternate' |
    /** Balanced - Aligns the child nodes in multiple rows to balance the width and height of the horizontal sub tree */
    'Balanced';

/**
 * events of diagram
 *
 * @private
 */
export enum DiagramEvent {
    'collectionChange', 'rotateChange', 'positionChange', 'propertyChange', 'selectionChange', 'sizeChange', 'drop',
    'sourcePointChange', 'targetPointChange', 'connectionChange', 'animationComplete', 'click', 'doubleClick',
    'scrollChange', 'dragEnter', 'dragLeave', 'dragOver', 'textEdit', 'paletteSelectionChange', 'historyChange',
    'mouseEnter', 'mouseLeave', 'mouseOver', 'expandStateChange', 'segmentCollectionChange', 'commandExecute', 'historyStateChange',
    'onUserHandleMouseDown', 'onUserHandleMouseUp', 'onUserHandleMouseEnter', 'onUserHandleMouseLeave', 'onImageLoad',
    'onDoBindingInit', 'keyUp', 'keyDown', 'fixedUserHandleClick'
}
/**
 * @private
 */
export type HistoryChangeAction =
    /** Node - Defines the history entry type is node */
    'CustomAction' |
    /** Connector - Defines the history entry type is Connector */
    'Undo' |
    /** Selector - Defines the history entry type is Selector Model */
    'Redo';

export type HistoryEntryType =
    /** Node - Defines the history entry type is node */
    'Node' |
    /** Connector - Defines the history entry type is Connector */
    'Connector' |
    /** Selector - Defines the history entry type is Selector Model */
    'Selector' |
    /** Diagram - Defines the history entry type is Diagram */
    'Diagram' |
    /** ShapeAnnotation - Defines the history entry type is ShapeAnnotation Model */
    'ShapeAnnotation' |
    /** PathAnnotation - Defines the history entry type is PathAnnotation Model */
    'PathAnnotation' |
    /** PortObject - Defines the history entry type is PortObject */
    'PortObject' |
    /** Object - Defines the history entry type is Custom Object */
    'Object';
/**
 * Defines the zoom type
 * ZoomIn - Zooms in the diagram control
 * ZoomOut - Zooms out the diagram control
 */
export type ZoomTypes =
    /** ZoomIn - Zooms in the diagram control */
    'ZoomIn' |
    /** ZoomOut - Zooms out the diagram control */
    'ZoomOut';

/**
 * Defines how the diagram has to fit into view
 * Page - Fits the diagram content within the viewport
 * Width - Fits the width of the diagram content within the viewport
 * Height - Fits the height of the diagram content within the viewport
 */
export type FitModes =
    /** Page - Fits the diagram content within the viewport */
    'Page' |
    /** Width - Fits the width of the diagram content within the viewport */
    'Width' |
    /** Height - Fits the height of the diagram content within the viewport */
    'Height';

/** Enables/Disables certain features of port connection
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum PortConstraints {
    /** Disable all constraints  */
    None = 1 << 0,
    /** Enables connections with connector  */
    Drag = 1 << 1,
    /** Enables to create the connection when mouse hover on the port  */
    Draw = 1 << 2,
    /** Enables to only connect the target end of connector */
    InConnect = 1 << 3,
    /** Enables to only connect the source end of connector */
    OutConnect = 1 << 4,
    /** Enables all constraints */
    Default = 1 << 3 | 1 << 4
}

/**
 * Defines the type of the object
 * Port - Sets the port type as object
 * Annotations - Sets the annotation type as object
 */
export type ObjectTypes =
    /** Port - Sets the port type as object */
    'Port' |
    /** Annotations - Sets the annotation type as object */
    'Annotations';

/**
 * Defines the selection change state
 * Interaction - Sets the selection change state as Interaction
 * Commands - Sets the selection change state as Commands
 * Keyboard - Sets the selection change state as Keyboard
 * Unknown - Sets the selection change state as Unknown
 */
export type SelectionChangeCause =
    /** Interaction - Sets the selection change state as Interaction */
    'Interaction' |
    /** Commands - Sets the selection change state as Commands */
    'Commands' |
    /** Keyboard - Sets the selection change state as Keyboard */
    'Keyboard' |
    /** Unknown - Sets the selection change state as Unknown */
    'Unknown';

/**
 * Defines the change state
 * Changing - Sets the event state as Changing
 * Changed - Sets the event state as Changed
 * canceled - Sets the event state as canceled
 */
export type EventState =
    /** Changing - Sets the event state as Changing */
    'Changing' |
    /** Changed - Sets the event state as Changed */
    'Changed' |
    /** canceled - Sets the event state as canceled */
    'Cancelled';

/**
 * Defines the state of the interactions such as drag, resize and rotate
 * Start - Sets the interaction state as Start
 * Progress - Sets the interaction state as Progress
 * Completed - Sets the interaction state as Completed
 */
export type State =
    /** Start - Sets the interaction state as Start */
    'Start' |
    /** Progress - Sets the interaction state as Progress */
    'Progress' |
    /** Completed - Sets the interaction state as Completed */
    'Completed';

/**
 * Returns which mouse button is clicked.
 * Left - Whenever the left button of the mouse is clicked, ‘Left’ is returned.
 * Progress - Whenever the mouse wheel is clicked, ‘Middle’ is returned.
 * Completed - Whenever the right button of the mouse is clicked, ‘Right’ is returned.
 */
export type MouseButtons =
    /** Left - Whenever the left button of the mouse is clicked, ‘Left’ is returned. */
    'Left' |
    /** Middle - Whenever the mouse wheel is clicked, ‘Middle’ is returned. */
    'Middle' |
    /** Right - Whenever the right button of the mouse is clicked, ‘Right’ is returned. */
    'Right';

/**
 * Defines whether an object is added/removed from diagram
 * Addition - Sets the ChangeType as Addition
 * Removal - Sets the ChangeType as Removal
 */
export type ChangeType =
    /** Addition - Sets the ChangeType as Addition */
    'Addition' |
    /** Removal - Sets the ChangeType as Removal */
    'Removal';

/**
 * Defines the accessibility element
 * NodeModel - Sets the accessibility element as NodeModel
 * ConnectorModel - Sets the accessibility element as ConnectorModel
 * PortModel - Sets the accessibility element as PortModel
 * TextElement - Sets the accessibility element as TextElement
 * IconShapeModel - Sets the accessibility element as IconShapeModel
 * DecoratorModel - Sets the accessibility element as DecoratorModel
 */
export type accessibilityElement =
    /** NodeModel - Sets the accessibility element as NodeModel */
    'NodeModel' |
    /** ConnectorModel - Sets the accessibility element as ConnectorModel */
    'ConnectorModel' |
    /** PortModel - Sets the accessibility element as PortModel */
    'PortModel' |
    /** TextElement - Sets the accessibility element as TextElement */
    'TextElement' |
    /** IconShapeModel - Sets the accessibility element as IconShapeModel */
    'IconShapeModel' |
    /** DecoratorModel - Sets the accessibility element as DecoratorModel */
    'DecoratorModel';
/**
 * Defines the context menu click
 * contextMenuClick - Sets the context menu click as contextMenuClick
 */
export const contextMenuClick: string =
    /** contextMenuClick - Sets the context menu click as contextMenuClick */
    'contextMenuClick';

/**
 * Defines the context menu open
 * contextMenuOpen - Sets the context menu open as contextMenuOpen
 */
export const contextMenuOpen: string =
    /** contextMenuOpen - Sets the context menu open as contextMenuOpen */
    'contextMenuOpen';

/**
 * Defines the context menu Before Item Render
 * contextMenuBeforeItemRender - Sets the context menu open as contextMenuBeforeItemRender
 */
export const contextMenuBeforeItemRender: string =
    /** contextMenuBeforeItemRender - Sets the context menu open as contextMenuBeforeItemRender */
    'contextMenuBeforeItemRender';
/**
 * Detect the status of Crud operation performed in the diagram
 */
export type Status =
    'None' | 'New' | 'Update';
/**
 * Enables/Disables scope of the uml shapes
 * * Public - Indicates the scope is public.
 * * Protected - Indicates the scope is protected.
 * * Private - Indicates the scope is private.
 * * Package - Indicates the scope is package.
 */
export type UmlScope = 'Public' | 'Protected' | 'Private' | 'Package';
/**
 * Enables/Disables shape of the uml classifier shapes
 * * Package - Indicates the scope is public.
 * * Class - Indicates the scope is protected.
 * * Interface - Indicates the scope is private.
 * * Enumeration - Indicates the scope is package.
 * * CollapsedPackage - Indicates the scope is public.
 * * Inheritance - Indicates the scope is protected.
 * * Association - Indicates the scope is private.
 * * Aggregation - Indicates the scope is package.
 * * Composition - Indicates the scope is public.
 * * Realization - Indicates the scope is protected.
 * * DirectedAssociation - Indicates the scope is private.
 * * Dependency - Indicates the scope is package.
 */
export type ClassifierShape = 'Aggregation' | 'Class' | 'Interface' | 'Enumeration' | 'Inheritance' |
'Association' | 'Composition' | 'Realization' | 'Dependency';
/**
 * Defines the direction the uml connectors
 * * Default - Indicates the direction is Default.
 * * Directional - Indicates the direction is single Directional.
 * * BiDirectional - Indicates the direction is BiDirectional.
 */
export type AssociationFlow = 'Directional' | 'Default' | 'BiDirectional';
/**
 * Define the Multiplicity of uml connector shapes
 * * OneToOne - Indicates the connector multiplicity is OneToOne.
 * * OneToMany - Indicates the connector multiplicity is OneToMany.
 * * ManyToOne - Indicates the connector multiplicity is ManyToOne.
 */
export type Multiplicity = 'OneToOne' | 'OneToMany' | 'ManyToOne';

/**
 * Defines the visibility of the control points in the Bezier connector
 */
export enum ControlPointsVisibility {
    /** None - Hides all the control points of the Bezier connector*/
    None = 1 << 0,
    /** Source - Shows the source control point*/
    Source = 1 << 1,
    /** Target - Shows the target control point*/
    Target = 1 << 2,
    /** Intermediate - Shows the intermediate control points*/
    Intermediate = 1 << 3,
    /** All - Shows all the control points of the Bezier connector*/
    All = 1 << 1 | 1 << 2 | 1 << 3
}

/**
 * Defines the editing mode of the intermediate point of two bezier curve
 */
export type BezierSegmentEditOrientation =
    /** BiDirectional - Allows the intermediate points to be dragged either vertical or horizontal direction only */
    'BiDirectional' |
    /** FreeForm - Allows the intermediate points to be dragged in any direction */
    'FreeForm';

export enum BezierSmoothness {
    /** Disable all smoothness Constraints. */
    None = 0,
    /** Enables the  SymmetricAngle for a bezier segment to the angle between the control point as same. */
    SymmetricAngle = 1 << 1,
    /** Enables the SymmetricDistance for bezier segment to the distance between the control point as same. */
    SymmetricDistance = 1 << 2,
    /** Enables the symmetric for bezier segment to the distance and angle between the control point as same. */
    Default = 1 << 1 | 1 << 2
}