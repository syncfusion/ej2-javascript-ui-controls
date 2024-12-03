/**
 * enum module defines the public enumerations
 */


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
 * Defines the container/canvas transform
 * Self - Sets the transform type as Self
 * Parent - Sets the transform type as Parent
 */
export enum RotateTransform {
    /** Self - Sets the transform type as Self */
    Self = 1,
    /** Parent - Sets the transform type as Parent */
    Parent = 2
}

/** Enables/Disables The element actions
 * None - Diables all element actions are none
 * ElementIsPort - Enable element action is port
 * ElementIsGroup - Enable element action as Group 
 * @private
 */
export enum ElementAction {
    /** Disables all element actions are none  */
    None = 0,
    /** Enable the element action is Port  */
    ElementIsPort = 1 << 1,
    /** Enable the element action as Group  */
    ElementIsGroup = 1 << 2,
}

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
 * Defines the decorator shape of the connector
 * None - Sets the decorator shape as None
 * Arrow - Sets the decorator shape as Arrow
 * Diamond - Sets the decorator shape as Diamond
 * Butt - Sets the decorator shape as Butt
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
    /** None - Sets the decorator shape as None */
    'None' |
    /** Arrow - Sets the decorator shape as Arrow */
    'Arrow' |
    /** Diamond - Sets the decorator shape as Diamond */
    'Diamond' |
    /** Butt - Sets the decorator shape as Butt */
    'Butt' |
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
export type ClassifierShape = 'Class' | 'Interface' | 'Enumeration' | 'Inheritance' |
    'Association' | 'Aggregation' | 'Composition' | 'Realization' | 'Dependency';
/**
 * Defines the direction the uml connectors
 * * Default - Indicates the direction is Default.
 * * Directional - Indicates the direction is single Directional.
 * * BiDirectional - Indicates the direction is BiDirectional.
 */
export type AssociationFlow = 'Default' | 'Directional' | 'BiDirectional';
/**
 * Define the Multiplicity of uml connector shapes
 * * OneToOne - Indicates the connector multiplicity is OneToOne.
 * * OneToMany - Indicates the connector multiplicity is OneToMany.
 * * ManyToOne - Indicates the connector multiplicity is ManyToOne.
 * * ManyToOne - Indicates the connector multiplicity is ManyToOne.
 */
export type Multiplicity = 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToOne';
/**
 * Defines the segment type of the connector
 * Straight - Sets the segment type as Straight
 */
export type Segments =
    /** Straight - Sets the segment type as Straight */
    'Straight';

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
    /** Enables all constraints. */
    Default = 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 9 | 1 << 10 | 1 << 11 | 1 << 13
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
 * Detect the status of Crud operation performed in the diagram
 */
export type Status =
    'None' | 'New' | 'Update';

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

/** @private */
export enum NoOfSegments {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five
}

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
