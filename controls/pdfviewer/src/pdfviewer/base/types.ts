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
    'CommentTool';

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
// tslint:disable-next-line:max-line-length
export type AnnotationType = 'None' | 'Highlight' | 'Underline' | 'Strikethrough' | 'Line' | 'Arrow' | 'Rectangle' | 'Circle' | 'Polygon' | 'Distance' | 'Perimeter' | 'Area' | 'Radius' | 'Volume' | 'FreeText';

/**
 * Enum LineHeadStyle for line and arrow annotation
 */
export type LineHeadStyle = 'None' | 'Closed' | 'Open' | 'Square' | 'Round' | 'Diamond';

/**
 * Enum unit for calibration annotation
 */
export type CalibrationUnit = 'pt' | 'in' | 'mm' | 'cm' | 'p' | 'ft';

/**
 * Enum unit for ContextMenu Actions
 */
export type ContextMenuAction = 'None' | 'MouseUp' | 'RightClick';

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
 * Enum unit for text alignment
 */
export type TextAlignment = 'Left' | 'Right' | 'Center' | 'Justify';