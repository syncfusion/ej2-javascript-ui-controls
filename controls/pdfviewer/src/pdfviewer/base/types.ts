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
    'FormDesignerEditTool' |
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
 * Enum value of form designer toolbar item.
 */
export type FormDesignerToolbarItem =
'TextboxTool' |
'PasswordTool' |
'CheckBoxTool' |
'RadioButtonTool' |
'DropdownTool' |
'ListboxTool' |
'DrawSignatureTool' |
'DeleteTool';

/**
 * Enum LinkTarget for hyperlink navigation
 */
export type LinkTarget = 'CurrentTab' | 'NewTab' | 'NewWindow';
/**
 * Enum InteractionMode for interaction mode
 */
export type InteractionMode = 'TextSelection' | 'Pan';
/**
 * Enum type for Signature Items
 */
export type SignatureItem = 'Signature' | 'Initial';

/**
 * Enum AnnotationType for specifying Annotations
 */
// eslint-disable-next-line max-len
export type AnnotationType = 'None' | 'Highlight' | 'Underline' | 'Strikethrough' | 'Line' | 'Arrow' | 'Rectangle' | 'Circle' | 'Polygon' | 'Distance' | 'Perimeter' | 'Area' | 'Radius' | 'Volume' | 'FreeText' | 'HandWrittenSignature' | 'Initial' | 'Ink' | 'Stamp' | 'Image' | 'StickyNotes';

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
export type FormFieldType = 'Textbox' | 'Password' | 'CheckBox' | 'RadioButton' | 'DropDown' | 'ListBox' | 'SignatureField' | 'InitialField';

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

export enum DisplayMode {
    /** Draw - Display only the draw option in the signature dialog. */
    Draw = 1 << 0,
    /** Text - Display only the type option in the signature dialog. */
    Text = 1 << 1,
    /** Upload - Display only the upload option in the signature dialog. */
    Upload = 1 << 2
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
    // eslint-disable-next-line
    e_resize = 'e-resize',
    // eslint-disable-next-line
    ew_resize = 'ew-resize',
    grab = 'grab',
    grabbing = 'grabbing',
    move = 'move',
    // eslint-disable-next-line
    n_resize = 'n-resize',
    // eslint-disable-next-line
    ne_resize = 'ne-resize',
    // eslint-disable-next-line
    ns_resize = 'ns-resize',
    // eslint-disable-next-line
    nw_resize = 'nw-resize',
    pointer = 'pointer',
    // eslint-disable-next-line
    s_resize = 's-resize',
    // eslint-disable-next-line
    se_resize = 'se-resize',
    // eslint-disable-next-line
    sw_resize = 'sw-resize',
    text = 'text',
    // eslint-disable-next-line
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
