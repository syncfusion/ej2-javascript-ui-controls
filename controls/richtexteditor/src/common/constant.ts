/**
 * Constant values for Common
 */

/**
 * Keydown event trigger
 *
 * @hidden
 */
export const KEY_DOWN: string = 'keydown';

/**
 * Undo and Redo action HTML plugin events
 *
 * @hidden
 */
export const ACTION: string = 'action';

/**
 * Formats plugin events
 *
 * @hidden
 */
export const FORMAT_TYPE: string = 'format-type';

/**
 * Keydown handler event trigger
 *
 * @hidden
 */
export const KEY_DOWN_HANDLER: string = 'keydown-handler';

/**
 * List plugin events
 *
 * @hidden
 */
export const LIST_TYPE: string = 'list-type';

/**
 * Code Block plugin events
 *
 * @hidden
 */
export const CODE_BLOCK: string = 'code-block';

/**
 * Keyup handler event trigger
 *
 * @hidden
 */
export const KEY_UP_HANDLER: string = 'keyup-handler';

/**
 * Keyup event trigger
 *
 * @hidden
 */
export const KEY_UP: string = 'keyup';
/**
 * Model changed plugin event trigger
 *
 * @hidden
 */
export const MODEL_CHANGED_PLUGIN: string = 'model_changed_plugin';

/**
 * Model changed event trigger
 *
 * @hidden
 */
export const MODEL_CHANGED: string = 'model_changed';

/**
 * PasteCleanup plugin for MSWord content
 *
 * @hidden
 */
export const MS_WORD_CLEANUP_PLUGIN: string = 'ms_word_cleanup_plugin';

/**
 * PasteCleanup for MSWord content
 *
 * @hidden
 */
export const MS_WORD_CLEANUP: string = 'ms_word_cleanup';

/**
 * ActionBegin event callback
 *
 * @hidden
 */
export const ON_BEGIN: string = 'onBegin';

/**
 * Callback for spacelist action
 *
 * @hidden
 */
export const SPACE_ACTION: string = 'actionBegin';


/**
 * Format painter event constant
 *
 * @hidden
 */
export const FORMAT_PAINTER_ACTIONS: string = 'format_painter_actions';

/**
 * AI Assistant Event constant
 *
 * @hidden
 */
export const AI_ASSISTANT_ACTIONS: string = 'ai_assistant_actions';

/**
 * Blockquotes enter prevent when on list is applied event constant
 *
 * @hidden
 */
export const BLOCKQUOTE_LIST_HANDLE: string = 'blockquote_list_handled';


/**
 * Emoji picker event constant
 *
 * @hidden
 */
export const EMOJI_PICKER_ACTIONS: string = 'emoji_picker_actions';

/**
 * Auto format event constant
 *
 * @hidden
 */
export const AUTO_FORMAT_ACTIONS: string = 'auto_format_actions';

/**
 * Mouse down event constant
 *
 * @hidden
 */
export const MOUSE_DOWN: string = 'mouseDown';

/**
 * destroy event constant
 *
 * @hidden
 */
export const DESTROY: string = 'destroy';
/**
 * internal_destroy event constant
 *
 * @hidden
 */
export const INTERNAL_DESTROY: string = 'internal_destroy';
/**
 * code block indentation event constant
 *
 * @hidden
 */
export const CODEBLOCK_INDENTATION: string = 'codeblock_indentation';
/**
 * code block indentation event constant
 *
 * @hidden
 */
export const CODEBLOCK_DISABLETOOLBAR: string = 'codeblock_disabletoolbar';
/**
 * @hidden
 * @private
 */
export const CLS_RTE_TABLE_RESIZE: string = 'e-rte-table-resize';
/**
 * @hidden
 * @private
 */
export const CLS_TB_ROW_INSERT: string = 'e-tb-row-insert';
/**
 * @hidden
 * @private
 */
export const CLS_TB_COL_INSERT: string = 'e-tb-col-insert';
/**
 * @hidden
 * @private
 */
export const CLS_TB_DASH_BOR: string = 'e-dashed-border';

/**
 * @hidden
 * @private
 */
export const CLS_TB_ALT_BOR: string = 'e-alternate-border';
/**
 * @hidden
 * @private
 */
export const CLS_TB_COL_RES: string = 'e-column-resize';
/**
 * @hidden
 * @private
 */
export const CLS_TB_ROW_RES: string = 'e-row-resize';
/**
 * @hidden
 * @private
 */
export const CLS_TB_BOX_RES: string = 'e-table-box';
/**
 * @hidden
 * @private
 */
export const CLS_IMG_FOCUS: string = 'e-img-focus';
/**
 * @hidden
 * @private
 */
export const CLS_TABLE_SEL: string = 'e-cell-select';
/**
 * @hidden
 * @private
 */
export const CLS_TABLE_SEL_END: string = 'e-cell-select-end';
/**
 * @hidden
 * @private
 */
export const CLS_TABLE_MULTI_CELL: string = 'e-multi-cells-select';
export const CLS_AUD_FOCUS: string = 'e-audio-focus';
/**
 * @hidden
 * @private
 */
export const CLS_VID_FOCUS: string = 'e-video-focus';
/**
 * @hidden
 * @private
 */
export const CLS_RTE_DRAG_IMAGE: string = 'e-rte-drag-image';
/**
 * @hidden
 * @private
 */
export const CLS_RESIZE: string = 'e-resize';

/**
 * @hidden
 * @private
 */
export const hideTableQuickToolbar: string = 'hideTableQuickToolbar';
/**
 * @hidden
 * @private
 */
export const touchStart: string = 'touchStart';
/**
 * @hidden
 * @private
 */
export const touchEnd: string = 'touchEnd';
/**
 * @hidden
 * @private
 */
export const cut: string = 'cut';
/**
 * @hidden
 * @private
 */
export const dragEnterEvent: string = 'dragEnter_Event';
/**
 * @hidden
 * @private
 */
export const dragOverEvent: string = 'dragOver_Event';
/**
 * @hidden
 * @private
 */
export const dragStartEvent: string = 'dragStart_Event';
/**
 * @hidden
 * @private
 */
export const dropEvent: string = 'drop_Event';
/**
 * @hidden
 * @private
 */
export const dragEnter: string = 'dragEnter';
/**
 * @hidden
 * @private
 */
export const dragDrop: string = 'dragDrop';
/**
 * @hidden
 * @private
 */
export const dragOver: string = 'dragOver';
/**
 * @hidden
 * @private
 */
export const dropEventHandler: string = 'drop';
/**
 * @hidden
 * @deprecated
 */
export const supportedUnits: string[] = ['px', 'em', 'rem', 'pt', 'cm', 'mm', 'in', 'pc', 'vw', 'vh', 'vmin', 'vmax'];
/**
 * @hidden
 * @deprecated
 */
export const conversionFactors: Record<string, Record<string, number>> = {
    'px': {
        'px': 1,
        'em': 0.0625,
        'rem': 0.0625,
        'pt': 0.75,
        'cm': 0.0264583,
        'mm': 0.0026458,
        'in': 0.0104167,
        'pc': 0.0625,
        'vw': 0.00625,
        'vh': 0.00625,
        'vmin': 0.00625,
        'vmax': 0.00625
    },
    'em': {
        'px': 16,
        'em': 1,
        'rem': 1,
        'pt': 12,
        'cm': 0.423333,
        'mm': 0.0423333,
        'in': 0.166667,
        'pc': 0.0625,
        'vw': 1,
        'vh': 1,
        'vmin': 1,
        'vmax': 1
    },
    'rem': {
        'px': 16,
        'em': 1,
        'rem': 1,
        'pt': 12,
        'cm': 0.423333,
        'mm': 0.0423333,
        'in': 0.166667,
        'pc': 0.0625,
        'vw': 1,
        'vh': 1,
        'vmin': 1,
        'vmax': 1
    },
    'pt': {
        'px': 1.33333,
        'em': 0.0833333,
        'rem': 0.0833333,
        'pt': 1,
        'cm': 0.0352778,
        'mm': 0.0035278,
        'in': 0.0138889,
        'pc': 0.0416667,
        'vw': 0.00416667,
        'vh': 0.00416667,
        'vmin': 0.00416667,
        'vmax': 0.00416667
    },
    'cm': {
        'px': 37.7953,
        'em': 2.3622,
        'rem': 2.3622,
        'pt': 28.3465,
        'cm': 1,
        'mm': 0.1,
        'in': 0.393701,
        'pc': 0.148148,
        'vw': 0.0377953,
        'vh': 0.0377953,
        'vmin': 0.0377953,
        'vmax': 0.0377953
    },
    'mm': {
        'px': 3.77953,
        'em': 0.23622,
        'rem': 0.23622,
        'pt': 2.83465,
        'cm': 10,
        'mm': 1,
        'in': 0.0393701,
        'pc': 0.0148148,
        'vw': 0.00377953,
        'vh': 0.00377953,
        'vmin': 0.00377953,
        'vmax': 0.00377953
    },
    'in': {
        'px': 96,
        'em': 6,
        'rem': 6,
        'pt': 72,
        'cm': 2.54,
        'mm': 25.4,
        'in': 1,
        'pc': 0.375,
        'vw': 0.09375,
        'vh': 0.09375,
        'vmin': 0.09375,
        'vmax': 0.09375
    },
    'pc': {
        'px': 16,
        'em': 1,
        'rem': 1,
        'pt': 12,
        'cm': 0.423333,
        'mm': 0.0423333,
        'in': 0.166667,
        'pc': 1,
        'vw': 0.0625,
        'vh': 0.0625,
        'vmin': 0.0625,
        'vmax': 0.0625
    },
    'vw': {
        'px': 160,
        'em': 10,
        'rem': 10,
        'pt': 120,
        'cm': 4.23333,
        'mm': 0.423333,
        'in': 1.66667,
        'pc': 0.625,
        'vw': 1,
        'vh': 1,
        'vmin': 1,
        'vmax': 1
    },
    'vh': {
        'px': 160,
        'em': 10,
        'rem': 10,
        'pt': 120,
        'cm': 4.23333,
        'mm': 0.423333,
        'in': 1.66667,
        'pc': 0.625,
        'vw': 1,
        'vh': 1,
        'vmin': 1,
        'vmax': 1
    },
    'vmin': {
        'px': 160,
        'em': 10,
        'rem': 10,
        'pt': 120,
        'cm': 4.23333,
        'mm': 0.423333,
        'in': 1.66667,
        'pc': 0.625,
        'vw': 1,
        'vh': 1,
        'vmin': 1,
        'vmax': 1
    },
    'vmax': {
        'px': 160,
        'em': 10,
        'rem': 10,
        'pt': 120,
        'cm': 4.23333,
        'mm': 0.423333,
        'in': 1.66667,
        'pc': 0.625,
        'vw': 1,
        'vh': 1,
        'vmin': 1,
        'vmax': 1
    }
};
