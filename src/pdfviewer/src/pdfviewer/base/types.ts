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
    'AnnotationEditTool';

/**
 * Enum AnnotationToolbarItem for annotation toolbar settings
 */
export type AnnotationToolbarItem =
    'HighlightTool' |
    'UnderlineTool' |
    'StrikethroughTool' |
    'ColorEditTool' |
    'OpacityEditTool' |
    'AnnotationDeleteTool';
/**
 * Enum LinkTarget for hyperlink navigation
 */
    export type LinkTarget = 'CurrentTab'| 'NewTab' |'NewWindow';
/**
 * Enum InteractionMode for interaction mode
 */
    export type InteractionMode = 'TextSelection' | 'Pan';

/**
 * Enum AnnotationType for specifying Annotations
 */
export type AnnotationType = 'None' | 'Highlight' | 'Underline' | 'Strikethrough';