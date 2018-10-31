/**
 * Defines types of Render
 * @hidden
 */
export enum RenderType {
    /**  Defines RenderType as Toolbar */
    Toolbar,
    /**  Defines RenderType as Content */
    Content,
    /**  Defines RenderType as Content */
    Popup,
    /**  Defines RenderType as LinkToolbar */
    LinkToolbar,
    /**  Defines RenderType as TextToolbar */
    TextToolbar,
    /**  Defines RenderType as ImageToolbar */
    ImageToolbar,
    /**  Defines RenderType as ImageToolbar */
    InlineToolbar,

    TableToolbar
}

export type Action =
    /**  Defines current Action as Refresh */
    'refresh' |
    /** Defines current Action as Print */
    'print' |
    'Undo' |
    'Redo';

export type ActionOnScroll = 'hide' | 'none';

export enum ToolbarType {
    /**  Defines ToolbarType as Standard */
    Expand = 'Expand',
    /**  Defines ToolbarType as MultiRow */
    MultiRow = 'MultiRow'
}