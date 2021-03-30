/* eslint-disable */
/**
 * Enum toolbarItem for toolbar settings
 */
export type ToolbarItem =
    'OpenOption' |
    'PageNavigationTool' |
    'MagnificationTool' |
    'PanTool' |
    'SelectionTool' |
    'SearchOption' |
    'PrintOption' |
    'DownloadOption' |
    'UndoRedoTool' |
    'AnnotationEditTool' |
    'CommentTool' |
    'SubmitForm';

/**
 * Enum AnnotationToolbarItem for annotation toolbar settings
 */
export type AnnotationToolbarItem =
    'HighlightTool' |
    'UnderlineTool' |
    'StrikethroughTool' |
    'ShapeTool' |
    'CalibrateTool' |
    'ColorEditTool' |
    'StrokeColorEditTool' |
    'ThicknessEditTool' |
    'OpacityEditTool' |
    'AnnotationDeleteTool' |
    'StampAnnotationTool' |
    'HandWrittenSignatureTool' |
    'InkAnnotationTool' |
    'FreeTextAnnotationTool' |
    'FontFamilyAnnotationTool' |
    'FontSizeAnnotationTool' |
    'FontStylesAnnotationTool' |
    'FontAlignAnnotationTool' |
    'FontColorAnnotationTool'|
    'CommentPanelTool';
/**
 * Enum LinkTarget for hyperlink navigation
 */
export type LinkTarget = 'CurrentTab' | 'NewTab' | 'NewWindow';
/**
 * Enum InteractionMode for interaction mode
 */
export type InteractionMode = 'TextSelection' | 'Pan';

/**
 * Enum AnnotationType for specifying Annotations
 */
// eslint-disable-next-line max-len
export type AnnotationType = 'None' | 'Highlight' | 'Underline' | 'Strikethrough' | 'Line' | 'Arrow' | 'Rectangle' | 'Circle' | 'Polygon' | 'Distance' | 'Perimeter' | 'Area' | 'Radius' | 'Volume' | 'FreeText' | 'HandWrittenSignature' | 'Ink' | 'Stamp' | 'Image' | 'StickyNotes';

/**
 * Enum LineHeadStyle for line and arrow annotation
 */
export type LineHeadStyle = 'None' | 'Closed' | 'Open' | 'Square' | 'Round' | 'Diamond'| 'Butt';

/**
 * Enum unit for calibration annotation
 */
export type CalibrationUnit = 'pt' | 'in' | 'mm' | 'cm' | 'p' | 'ft'| 'ft_in' | 'm';

/**
 * Enum for comment status of the annotation
 */
export enum CommentStatus {
    None = 1,
    Accepted = 2,
    Canceled = 3,
    Completed = 4,
    Rejected = 5
}

/**
 * Enum unit for ContextMenu Actions
 */
export type ContextMenuAction = 'None' | 'MouseUp' | 'RightClick';

/**
 * Enum unit for FormFieldType
 */
export type FormFieldType = 'Textbox' | 'Password' | 'CheckBox' | 'RadioButton' | 'DropDown' | 'ListBox' | 'SignatureField';

/**
 * Enum for font styles
 */
export enum FontStyle {
    None = 0,
    Bold = 1,
    Italic = 2,
    Underline = 4,
    Strikethrough = 8,
}

/**
 * enum for context menu items
 */
export enum ContextMenuItem {
    Copy = 0,
    Highlight = 1,
    Cut = 2,
    Underline = 4,
    Paste = 8,
    Delete = 16,
    ScaleRatio = 32,
    Strikethrough = 64,
    Properties = 128,
    Comment = 256,
}

/**
 * Enum for signature type
 */
export enum SignatureType {
    Draw = 'Draw',
    Type = 'Type',
    Image = 'Image'
}

/**
 * Enum unit for text alignment
 */
export type TextAlignment = 'Left' | 'Right' | 'Center' | 'Justify';

/**
 * Enum for annotation selector shapes
 */
export type AnnotationResizerShape = 'Square' | 'Circle';

/**
 * Enum for annotation resizer location
 */
export enum AnnotationResizerLocation {
    Corners = 1,
    Edges = 2
}

/**
 * set the ZoomMode on rendering
 */
export type ZoomMode = 'Default' | 'FitToWidth' | 'FitToPage';

/**
 * Enum for Print Mode
 */
export type PrintMode = 'Default' | 'NewWindow' ;

/**
 * Enum for cursor type
 */
export enum CursorType {
    auto = 'auto',
    crossHair = 'crosshair',
    e_resize = 'e-resize',
    ew_resize = 'ew-resize',
    grab = 'grab',
    grabbing = 'grabbing',
    move = 'move',
    n_resize = 'n-resize',
    ne_resize = 'ne-resize',
    ns_resize = 'ns-resize',
    nw_resize = 'nw-resize',
    pointer = 'pointer',
    s_resize = 's-resize',
    se_resize = 'se-resize',
    sw_resize = 'sw-resize',
    text = 'text',
    w_resize = 'w-resize'
}

/**
 * Enum type for Dynamic Stamp Items
 */
export enum DynamicStampItem {
    Revised = 'Revised',
    Reviewed = 'Reviewed',
    Received = 'Received',
    Approved = 'Approved',
    Confidential = 'Confidential',
    NotApproved = 'NotApproved'
}

/**
 * Enum type for Sign Stamp Items
 */
export enum SignStampItem  {
    Witness =  'Witness',
    InitialHere = 'InitialHere',
    SignHere = 'SignHere',
    Accepted = 'Accepted',
    Rejected = 'Rejected'
}

/**
 * Enum type for Standard Business Stamp Items
 */
export enum StandardBusinessStampItem {
    Approved = 'Approved',
    NotApproved = 'NotApproved',
    Draft = 'Draft',
    Final = 'Final',
    Completed = 'Completed',
    Confidential = 'Confidential',
    ForPublicRelease = 'ForPublicRelease',
    NotForPublicRelease = 'NotForPublicRelease',
    ForComment = 'ForComment',
    Void = 'Void',
    PreliminaryResults = 'PreliminaryResults',
    InformationOnly = 'InformationOnly'
}

/**
 * Enum type for allowed interactions for locked annotations
 */
export enum AllowedInteraction  {
    Select =  'Select',
    Move = 'Move',
    Resize = 'Resize',
    Delete = 'Delete',
    None = 'None',
    PropertyChange = 'PropertyChange'
}

/**
 * Enum type for signature mode for signature fields
 */
export type SignatureFitMode = 'Default' | 'Stretch' ;

/**
 * Enum type for export annotation file types
 */
export enum AnnotationDataFormat {
    Json = 'Json',
    Xfdf = 'Xfdf',
}
