import { Base, Browser, ChildProperty, Complex, Component, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Observer, Property, Touch, addClass, append, attributes, closest, compile, createElement, debounce, detach, extend, formatUnit, getEnumValue, getInstance, getUniqueID, isBlazor, isNullOrUndefined, prepend, print, removeClass, select, selectAll, setStyleAttribute } from '@syncfusion/ej2-base';
import { Toolbar } from '@syncfusion/ej2-navigations';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Dialog, Popup, getScrollableParent, isCollide } from '@syncfusion/ej2-popups';
import { ColorPicker, NumericTextBox, Uploader } from '@syncfusion/ej2-inputs';
import { Button, CheckBox, RadioButton } from '@syncfusion/ej2-buttons';

/** @hidden */
const created = 'create';
/** @hidden */
const destroyed = 'destroy';
/** @hidden */
const load = 'load';
/**
 * Specifies RichTextEditor internal events
 */
/** @hidden */
const initialLoad = 'initial-load';
/** @hidden */
const initialEnd = 'initial-end';
/** @hidden */
const iframeMouseDown = 'iframe-click';
/** @hidden */
const destroy = 'destroy';
/** @hidden */
const toolbarClick = 'toolbarClick';
/** @hidden */
const toolbarRefresh = 'toolbar-refresh';
/** @hidden */
const refreshBegin = 'refresh-begin';
/** @hidden */
const toolbarUpdated = 'toolbar-updated';
/** @hidden */
const bindOnEnd = 'bind-on-end';
/** @hidden */
const renderColorPicker = 'render-color-picker';
/** @hidden */
const htmlToolbarClick = 'html-toolbar-click';
/** @hidden */
const markdownToolbarClick = 'markdown-toolbar-click';
/** @hidden */
const destroyColorPicker = 'destroy-color-picker';
/** @hidden */
const modelChanged = 'model-changed';
/** @hidden */
const keyUp = 'keyUp';
/** @hidden */
const keyDown = 'keyDown';
/** @hidden */
const mouseUp = 'mouseUp';
/** @hidden */
const toolbarCreated = 'toolbarCreated';
/** @hidden */
const toolbarRenderComplete = 'toolbarRenderComplete';
/** @hidden */
const enableFullScreen = 'enableFullScreen';
/** @hidden */
const disableFullScreen = 'disableFullScreen';
/** @hidden */
const dropDownSelect = 'dropDownSelect';
/** @hidden */
const beforeDropDownItemRender = 'beforeDropDownItemRender';
/** @hidden */
const execCommandCallBack = 'execCommandCallBack';
/** @hidden */
const imageToolbarAction = 'image-toolbar-action';
/** @hidden */
const linkToolbarAction = 'link-toolbar-action';
/** @hidden */
const resizeStart = 'resizeStart';
/** @hidden */
const onResize = 'resizing';
/** @hidden */
const resizeStop = 'resizeStop';
/** @hidden */
const undo = 'undo';
/** @hidden */
const redo = 'redo';
/** @hidden */
const insertLink = 'insertLink';
/** @hidden */
const unLink = 'unLink';
/** @hidden */
const editLink = 'editLink';
/** @hidden */
const openLink = 'openLink';
/** @hidden */
const actionBegin = 'actionBegin';
/** @hidden */
const actionComplete = 'actionComplete';
/** @hidden */
const toolbarStatusUpdate = 'toolbarStatusUpdate';
/** @hidden */
const actionSuccess = 'actionSuccess';
/** @hidden */
const updateToolbarItem = 'updateToolbarItem';
/** @hidden */
const insertImage = 'insertImage';
/** @hidden */
const insertCompleted = 'insertCompleted';
/** @hidden */
const imageLeft = 'justifyLeft';
/** @hidden */
const imageRight = 'justifyRight';
/** @hidden */
const imageCenter = 'justifyCenter';
/** @hidden */
const imageBreak = 'break';
/** @hidden */
const imageInline = 'inline';
/** @hidden */
const imageLink = 'insertImgLink';
/** @hidden */
const imageAlt = 'imgAltText';
/** @hidden */
const imageDelete = 'delete';
/** @hidden */
const imageCaption = 'caption';
/** @hidden */
const imageSize = 'imageSize';
/** @hidden */
const sourceCode = 'sourceCode';
/** @hidden */
const updateSource = 'updateSource';
/** @hidden */
const toolbarOpen = 'toolbarOpen';
/** @hidden */
const beforeDropDownOpen = 'beforeDropDownOpen';
/** @hidden */
const selectionSave = 'selection-save';
/** @hidden */
const selectionRestore = 'selection-restore';
/** @hidden */
const expandPopupClick = 'expandPopupClick';
/** @hidden */
const count = 'count';
/** @hidden */
const contentFocus = 'contentFocus';
/** @hidden */
const contentBlur = 'contentBlur';
/** @hidden */
const mouseDown = 'mouseDown';
/** @hidden */
const sourceCodeMouseDown = 'sourceCodeMouseDown';
/** @hidden */
const editAreaClick = 'editAreaClick';
/** @hidden */
const scroll = 'scroll';
/** @hidden */
const colorPickerChanged = 'colorPickerChanged';
/** @hidden */
const tableColorPickerChanged = 'tableColorPickerChanged';
/** @hidden */
const focusChange = 'focusChange';
/** @hidden */
const selectAll$1 = 'selectAll';
/** @hidden */
const selectRange = 'selectRange';
/** @hidden */
const getSelectedHtml = 'getSelectedHtml';
/** @hidden */
const renderInlineToolbar = 'renderInlineToolbar';
/** @hidden */
const paste = 'paste-content';
/** @hidden */
const imgModule = 'imageModule';
/** @hidden */
const rtlMode = 'rtl-mode';
/** @hidden */
const createTable = 'createTable';
/** @hidden */
const docClick = 'docClick';
/** @hidden */
const tableToolbarAction = 'table-toolbar-action';
/** @hidden */
const checkUndo = 'checkUndoStack';
/** @hidden */
const readOnlyMode = 'readOnlyMode';
/** @hidden */
const pasteClean = 'pasteClean';
/** @hidden */
const beforeDialogOpen = 'beforeDialogOpen';
/** @hidden */
const dialogOpen = 'dialogOpen';
/** @hidden */
const dialogClose = 'dialogClose';
/** @hidden */
const beforeQuickToolbarOpen = 'beforeQuickToolbarOpen';
/** @hidden */
const quickToolbarOpen = 'quickToolbarOpen';
/** @hidden */
const quickToolbarClose = 'quickToolbarClose';
/** @hidden */
const popupHide = 'popupHide';
/** @hidden */
const imageSelected = 'imageSelected';
/** @hidden */
const imageUploading = 'imageUploading';
/** @hidden */
const imageUploadSuccess = 'imageUploadSuccess';
/** @hidden */
const imageUploadFailed = 'imageUploadFailed';
/** @hidden */
const imageRemoving = 'imageRemoving';

/**
 * RichTextEditor classes defined here.
 */
/** @hidden */
const CLS_RTE = 'e-richtexteditor';
/** @hidden */
const CLS_RTL = 'e-rtl';
/** @hidden */

/** @hidden */
const CLS_DISABLED = 'e-disabled';
/** @hidden */
const CLS_SCRIPT_SHEET = 'rte-iframe-script-sheet';
/** @hidden */
const CLS_STYLE_SHEET = 'rte-iframe-style-sheet';
/** @hidden */
const CLS_TOOLBAR = 'e-rte-toolbar';
/** @hidden */
const CLS_TB_FIXED = 'e-rte-tb-fixed';
/** @hidden */
const CLS_TB_FLOAT = 'e-rte-tb-float';
/** @hidden */
const CLS_TB_ABS_FLOAT = 'e-rte-tb-abs-float';
/** @hidden */
const CLS_INLINE = 'e-rte-inline';
/** @hidden */

/** @hidden */
const CLS_RTE_EXPAND_TB = 'e-rte-tb-expand';
/** @hidden */
const CLS_FULL_SCREEN = 'e-rte-full-screen';
/** @hidden */
const CLS_QUICK_TB = 'e-rte-quick-toolbar';
/** @hidden */
const CLS_POP = 'e-rte-pop';
/** @hidden */
const CLS_QUICK_POP = 'e-rte-quick-popup';
/** @hidden */
const CLS_QUICK_DROPDOWN = 'e-quick-dropdown';
/** @hidden */
const CLS_IMAGE_POP = 'e-rte-image-popup';
/** @hidden */
const CLS_INLINE_POP = 'e-rte-inline-popup';
/** @hidden */
const CLS_INLINE_DROPDOWN = 'e-rte-inline-dropdown';
/** @hidden */
const CLS_DROPDOWN_POPUP = 'e-rte-dropdown-popup';
/** @hidden */
const CLS_DROPDOWN_ICONS = 'e-rte-dropdown-icons';
/** @hidden */
const CLS_DROPDOWN_ITEMS = 'e-rte-dropdown-items';
/** @hidden */
const CLS_DROPDOWN_BTN = 'e-rte-dropdown-btn';
/** @hidden */
const CLS_RTE_CONTENT = 'e-rte-content';
/** @hidden */
const CLS_TB_ITEM = 'e-toolbar-item';
/** @hidden */

/** @hidden */
const CLS_TB_WRAP = 'e-toolbar-wrapper';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
const CLS_SHOW = 'e-show';
/** @hidden */
const CLS_HIDE = 'e-hide';
/** @hidden */
const CLS_VISIBLE = 'e-visible';
/** @hidden */
const CLS_FOCUS = 'e-focused';
/** @hidden */
const CLS_RM_WHITE_SPACE = 'e-remove-white-space';
/** @hidden */
const CLS_IMGRIGHT = 'e-imgright';
/** @hidden */
const CLS_IMGLEFT = 'e-imgleft';
/** @hidden */
const CLS_IMGCENTER = 'e-imgcenter';
/** @hidden */
const CLS_IMGBREAK = 'e-imgbreak';
/** @hidden */
const CLS_CAPTION = 'e-img-caption';
/** @hidden */
const CLS_CAPINLINE = 'e-caption-inline';
/** @hidden */
const CLS_IMGINLINE = 'e-imginline';
/** @hidden */
const CLS_COUNT = 'e-rte-character-count';
/** @hidden */
const CLS_WARNING = 'e-warning';
/** @hidden */
const CLS_ERROR = 'e-error';
/** @hidden */
const CLS_ICONS = 'e-icons';
/** @hidden */
const CLS_ACTIVE = 'e-active';
/** @hidden */
const CLS_EXPAND_OPEN = 'e-expand-open';
/** @hidden */
const CLS_RTE_ELEMENTS = 'e-rte-elements';
/** @hidden */
const CLS_TB_BTN = 'e-tbar-btn';
/** @hidden */
const CLS_HR_SEPARATOR = 'e-rte-horizontal-separator';
/** @hidden */
const CLS_TB_IOS_FIX = 'e-tbar-ios-fixed';
/** @hidden */
const CLS_TB_STATIC = 'e-tb-static';
/** @hidden */
const CLS_FORMATS_TB_BTN = 'e-formats-tbar-btn';
/** @hidden */
const CLS_FONT_NAME_TB_BTN = 'e-font-name-tbar-btn';
/** @hidden */
const CLS_FONT_SIZE_TB_BTN = 'e-font-size-tbar-btn';
/** @hidden */
const CLS_FONT_COLOR_TARGET = 'e-rte-fontcolor-element';
/** @hidden */
const CLS_BACKGROUND_COLOR_TARGET = 'e-rte-backgroundcolor-element';
/** @hidden */
const CLS_COLOR_CONTENT = 'e-rte-color-content';
/** @hidden */
const CLS_FONT_COLOR_DROPDOWN = 'e-rte-fontcolor-dropdown';
/** @hidden */
const CLS_BACKGROUND_COLOR_DROPDOWN = 'e-rte-backgroundcolor-dropdown';
/** @hidden */
const CLS_COLOR_PALETTE = 'e-rte-square-palette';
/** @hidden */
const CLS_FONT_COLOR_PICKER = 'e-rte-fontcolor-colorpicker';
/** @hidden */
const CLS_BACKGROUND_COLOR_PICKER = 'e-rte-backgroundcolor-colorpicker';
/** @hidden */
const CLS_RTE_READONLY = 'e-rte-readonly';
/** @hidden */
const CLS_TABLE_SEL = 'e-cell-select';
/** @hidden */
const CLS_TB_DASH_BOR = 'e-dashed-border';
/** @hidden */
const CLS_TB_ALT_BOR = 'e-alternate-border';
/** @hidden */
const CLS_TB_COL_RES = 'e-column-resize';
/** @hidden */
const CLS_TB_ROW_RES = 'e-row-resize';
/** @hidden */
const CLS_TB_BOX_RES = 'e-table-box';
/** @hidden */
const CLS_RTE_HIDDEN = 'e-rte-hidden';
/** @hidden */
const CLS_RTE_PASTE_KEEP_FORMAT = 'e-rte-keepformat';
/** @hidden */
const CLS_RTE_PASTE_REMOVE_FORMAT = 'e-rte-removeformat';
/** @hidden */
const CLS_RTE_PASTE_PLAIN_FORMAT = 'e-rte-plainformat';
/** @hidden */
const CLS_RTE_PASTE_OK = 'e-rte-pasteok';
/** @hidden */
const CLS_RTE_PASTE_CANCEL = 'e-rte-pastecancel';
/** @hidden */
const CLS_RTE_DIALOG_MIN_HEIGHT = 'e-rte-dialog-minheight';

/**
 * Defines types of Render
 * @hidden
 */
var RenderType;
(function (RenderType) {
    /**  Defines RenderType as Toolbar */
    RenderType[RenderType["Toolbar"] = 0] = "Toolbar";
    /**  Defines RenderType as Content */
    RenderType[RenderType["Content"] = 1] = "Content";
    /**  Defines RenderType as Popup */
    RenderType[RenderType["Popup"] = 2] = "Popup";
    /**  Defines RenderType as LinkToolbar */
    RenderType[RenderType["LinkToolbar"] = 3] = "LinkToolbar";
    /**  Defines RenderType as TextToolbar */
    RenderType[RenderType["TextToolbar"] = 4] = "TextToolbar";
    /**  Defines RenderType as ImageToolbar */
    RenderType[RenderType["ImageToolbar"] = 5] = "ImageToolbar";
    /**  Defines RenderType as InlineToolbar */
    RenderType[RenderType["InlineToolbar"] = 6] = "InlineToolbar";
    /**  Defines RenderType as TableToolbar */
    RenderType[RenderType["TableToolbar"] = 7] = "TableToolbar";
})(RenderType || (RenderType = {}));
var ToolbarType;
(function (ToolbarType) {
    /**  Defines ToolbarType as Standard */
    ToolbarType["Expand"] = "Expand";
    /**  Defines ToolbarType as MultiRow */
    ToolbarType["MultiRow"] = "MultiRow";
})(ToolbarType || (ToolbarType = {}));

// tslint:disable
/**
 * Export items model
 */
let templateItems = ['alignments', 'formats', 'fontname', 'fontsize', 'fontcolor', 'backgroundcolor', 'align', 'display', 'tablerows', 'tablecolumns', 'tablecellhorizontalalign', 'tablecellverticalalign', 'styles'];
let tools = {
    'alignments': {
        'id': 'Alignments',
        'icon': 'e-alignments',
        'tooltip': 'Alignments',
        'command': 'Alignments',
        'subCommand': 'Alignments'
    },
    'justifyleft': {
        'id': 'JustifyLeft',
        'icon': 'e-justify-left',
        'tooltip': 'JustifyLeft',
        'command': 'Alignments',
        'subCommand': 'JustifyLeft'
    },
    'justifycenter': {
        'id': 'JustifyCenter',
        'icon': 'e-justify-center',
        'tooltip': 'JustifyCenter',
        'command': 'Alignments',
        'subCommand': 'JustifyCenter'
    },
    'justifyright': {
        'id': 'JustifyRight',
        'icon': 'e-justify-right',
        'tooltip': 'JustifyRight',
        'command': 'Alignments',
        'subCommand': 'JustifyRight'
    },
    'justifyfull': {
        'id': 'JustifyFull',
        'icon': 'e-justify-full',
        'tooltip': 'JustifyFull',
        'command': 'Alignments',
        'subCommand': 'JustifyFull'
    },
    'fontname': {
        'id': 'FontName',
        'icon': 'e-font-name',
        'tooltip': 'Font Name',
        'command': 'Font',
        'subCommand': 'FontName'
    },
    'fontsize': {
        'id': 'FontSize',
        'icon': 'e-font-size',
        'tooltip': 'Font Size',
        'command': 'Font',
        'subCommand': 'FontSize'
    },
    'fontcolor': {
        'id': 'FontColor',
        'icon': 'e-font-color',
        'tooltip': 'Font Color',
        'command': 'Font',
        'subCommand': 'FontColor',
        'value': '#ff0000ff'
    },
    'backgroundcolor': {
        'id': 'BackgroundColor',
        'icon': 'e-background-color',
        'tooltip': 'Background Color',
        'command': 'Font',
        'subCommand': 'BackgroundColor',
        'value': '#ffff00ff'
    },
    'bold': {
        'id': 'Bold',
        'icon': 'e-bold',
        'tooltip': 'Bold',
        'command': 'Style',
        'subCommand': 'Bold'
    },
    'italic': {
        'id': 'Italic',
        'icon': 'e-italic',
        'tooltip': 'Italic',
        'command': 'Style',
        'subCommand': 'Italic'
    },
    'underline': {
        'id': 'Underline',
        'icon': 'e-underline',
        'tooltip': 'Underline',
        'command': 'Style',
        'subCommand': 'Underline'
    },
    'strikethrough': {
        'id': 'StrikeThrough',
        'icon': 'e-strike-through',
        'tooltip': 'StrikeThrough',
        'command': 'Style',
        'subCommand': 'StrikeThrough'
    },
    'clearformat': {
        'id': 'ClearFormat',
        'icon': 'e-clear-format',
        'tooltip': 'Clear Format',
        'command': 'Clear',
        'subCommand': 'ClearFormat'
    },
    'clearall': {
        'id': 'ClearAll',
        'icon': 'e-clear-all',
        'tooltip': 'Clear All',
        'command': 'Clear',
        'subCommand': 'ClearAll'
    },
    'cut': {
        'id': 'Cut',
        'icon': 'e-cut',
        'tooltip': 'Cut',
        'command': 'ClipBoard',
        'subCommand': 'Cut'
    },
    'copy': {
        'id': 'Copy',
        'icon': 'e-copy',
        'tooltip': 'Copy',
        'command': 'ClipBoard',
        'subCommand': 'Copy'
    },
    'paste': {
        'id': 'Paste',
        'icon': 'e-paste',
        'tooltip': 'Paste',
        'command': 'ClipBoard',
        'subCommand': 'Paste'
    },
    'unorderedlist': {
        'id': 'UnorderedList',
        'icon': 'e-unorder-list',
        'tooltip': 'Bulleted List',
        'command': 'Lists',
        'subCommand': 'UL'
    },
    'orderedlist': {
        'id': 'OrderedList',
        'icon': 'e-order-list',
        'tooltip': 'Numbered List',
        'command': 'Lists',
        'subCommand': 'OL'
    },
    'indent': {
        'id': 'Indent',
        'icon': 'e-indent',
        'tooltip': 'Increase Indent',
        'command': 'Indents',
        'subCommand': 'Indent'
    },
    'outdent': {
        'id': 'Outdent',
        'icon': 'e-outdent',
        'tooltip': 'Decrease Indent',
        'command': 'Indents',
        'subCommand': 'Outdent'
    },
    'undo': {
        'id': 'Undo',
        'icon': 'e-undo',
        'tooltip': 'Undo',
        'command': 'Actions',
        'subCommand': 'Undo'
    },
    'redo': {
        'id': 'Redo',
        'icon': 'e-redo',
        'tooltip': 'Redo',
        'command': 'Actions',
        'subCommand': 'Redo'
    },
    'superscript': {
        'id': 'SuperScript',
        'icon': 'e-super-script',
        'tooltip': 'Superscript',
        'command': 'Effects',
        'subCommand': 'SuperScript'
    },
    'subscript': {
        'id': 'SubScript',
        'icon': 'e-sub-script',
        'tooltip': 'Subscript',
        'command': 'Effects',
        'subCommand': 'SubScript'
    },
    'createlink': {
        'id': 'CreateLink',
        'icon': 'e-create-link',
        'tooltip': 'Insert Hyperlink',
        'command': 'Links',
        'subCommand': 'CreateLink'
    },
    'openlink': {
        'id': 'OpenLink',
        'icon': 'e-open-link',
        'tooltip': 'Open Link',
        'command': 'Links',
        'subCommand': 'OpenLink'
    },
    'editlink': {
        'id': 'EditLink',
        'icon': 'e-edit-link',
        'tooltip': 'Edit Link',
        'command': 'Links',
        'subCommand': 'EditLink'
    },
    'removelink': {
        'id': 'RemoveLink',
        'icon': 'e-remove-link',
        'tooltip': 'Remove Link',
        'command': 'Links',
        'subCommand': 'RemoveLink'
    },
    'image': {
        'id': 'Image',
        'icon': 'e-image',
        'tooltip': 'Insert Image',
        'command': 'Images',
        'subCommand': 'Image'
    },
    'createtable': {
        'id': 'CreateTable',
        'icon': 'e-create-table',
        'tooltip': 'Create Table',
        'command': 'Table',
        'subCommand': 'CreateTable'
    },
    'removetable': {
        'id': 'removeTable',
        'icon': 'e-remove-table',
        'tooltip': 'Remove Table',
        'command': 'removeTable',
        'subCommand': 'removeTable'
    },
    'replace': {
        'id': 'Replace',
        'icon': 'e-replace',
        'tooltip': 'Replace',
        'command': 'Images',
        'subCommand': 'Replace'
    },
    'align': {
        'id': 'Align',
        'icon': 'e-align',
        'tooltip': 'Align',
        'command': 'Images',
        'subCommand': 'Align'
    },
    'caption': {
        'id': 'Caption',
        'icon': 'e-caption',
        'tooltip': 'Image Caption',
        'command': 'Images',
        'subCommand': 'Caption'
    },
    'remove': {
        'id': 'Remove',
        'icon': 'e-remove',
        'tooltip': 'Remove',
        'command': 'Images',
        'subCommand': 'Remove'
    },
    'openimagelink': {
        'id': 'OpenImageLink',
        'icon': 'e-open-link',
        'tooltip': 'Open Link',
        'command': 'Images',
        'subCommand': 'OpenImageLink'
    },
    'editimagelink': {
        'id': 'EditImageLink',
        'icon': 'e-edit-link',
        'tooltip': 'Edit Link',
        'command': 'Images',
        'subCommand': 'EditImageLink'
    },
    'removeimagelink': {
        'id': 'RemoveImageLink',
        'icon': 'e-remove-link',
        'tooltip': 'Remove Link',
        'command': 'Images',
        'subCommand': 'RemoveImageLink'
    },
    'insertlink': {
        'id': 'InsertLink',
        'icon': 'e-insert-link',
        'tooltip': 'Insert Link',
        'command': 'Images',
        'subCommand': 'InsertLink'
    },
    'display': {
        'id': 'Display',
        'icon': 'e-display',
        'tooltip': 'Display',
        'command': 'Images',
        'subCommand': 'Display'
    },
    'alttext': {
        'id': 'AltText',
        'icon': 'e-alt-text',
        'tooltip': 'Alternative Text',
        'command': 'Images',
        'subCommand': 'AltText'
    },
    'dimension': {
        'id': 'Dimension',
        'icon': 'e-dimension',
        'tooltip': 'Change Size',
        'command': 'Images',
        'subCommand': 'Dimension'
    },
    'fullscreen': {
        'id': 'Maximize',
        'icon': 'e-maximize',
        'tooltip': 'Maximize',
        'command': 'View',
        'subCommand': 'Maximize'
    },
    'maximize': {
        'id': 'Maximize',
        'icon': 'e-maximize',
        'tooltip': 'Maximize',
        'command': 'FullScreen',
        'subCommand': 'Maximize'
    },
    'minimize': {
        'id': 'Minimize',
        'icon': 'e-minimize',
        'tooltip': 'Minimize',
        'command': 'FullScreen',
        'subCommand': 'Minimize'
    },
    'lowercase': {
        'id': 'LowerCase',
        'icon': 'e-lower-case',
        'tooltip': 'Lower Case',
        'command': 'Casing',
        'subCommand': 'LowerCase'
    },
    'uppercase': {
        'id': 'UpperCase',
        'icon': 'e-upper-case',
        'tooltip': 'Upper Case',
        'command': 'Casing',
        'subCommand': 'UpperCase'
    },
    'print': {
        'id': 'Print',
        'icon': 'e-print',
        'tooltip': 'Print',
        'command': 'Print',
        'subCommand': 'Print'
    },
    'formats': {
        'id': 'Formats',
        'icon': 'e-formats',
        'tooltip': 'Formats',
        'command': 'Formats',
        'subCommand': 'Formats'
    },
    'sourcecode': {
        'id': 'SourceCode',
        'icon': 'e-source-code',
        'tooltip': 'Source Code',
        'command': 'SourceCode',
        'subCommand': 'SourceCode'
    },
    'preview': {
        'id': 'Preview',
        'icon': 'e-preview',
        'tooltip': 'Preview',
        'command': 'Preview',
        'subCommand': 'Preview'
    },
    'viewside': {
        'id': 'ViewSide',
        'icon': 'e-view-side',
        'tooltip': 'ViewSide',
        'command': 'ViewSide',
        'subCommand': 'ViewSide'
    },
    'insertcode': {
        'id': 'InsertCode',
        'icon': 'e-insert-code',
        'tooltip': 'Insert Code',
        'command': 'InsertCode',
        'subCommand': 'InsertCode'
    },
    'tableheader': {
        'id': 'TableHeader',
        'icon': 'e-table-header',
        'tooltip': 'Table Header',
        'command': 'Table',
        'subCommand': 'TableHeader'
    },
    'tableremove': {
        'id': 'TableRemove',
        'icon': 'e-table-remove',
        'tooltip': 'Table Remove',
        'command': 'Table',
        'subCommand': 'TableRemove'
    },
    'tablerows': {
        'id': 'TableRows',
        'icon': 'e-table-rows',
        'tooltip': 'Table Rows',
        'command': 'Table',
        'subCommand': 'TableRows'
    },
    'tablecolumns': {
        'id': 'TableColumns',
        'icon': 'e-table-columns',
        'tooltip': 'Table Columns',
        'command': 'Table',
        'subCommand': 'TableColumns'
    },
    'tablecellbackground': {
        'id': 'TableCellBackground',
        'icon': 'e-table-cell-background',
        'tooltip': 'Table Cell Background',
        'command': 'Table',
        'subCommand': 'TableCellBackground'
    },
    'tablecellhorizontalalign': {
        'id': 'TableCellHorizontalAlign',
        'icon': 'e-table-cell-horizontalAlign',
        'tooltip': 'Table Cell HorizontalAlign',
        'command': 'Table',
        'subCommand': 'TableCellHorizontalAlign'
    },
    'tablecellverticalalign': {
        'id': 'TableCellVerticalAlign',
        'icon': 'e-table-cell-verticalAlign',
        'tooltip': 'Table Cell VerticalAlign',
        'command': 'Table',
        'subCommand': 'TableCellVerticalAlign'
    },
    'tableeditproperties': {
        'id': 'TableEditProperties',
        'icon': 'e-table-edit-properties',
        'tooltip': 'Table Edit Properties',
        'command': 'Table',
        'subCommand': 'TableEditProperties'
    },
    'styles': {
        'id': 'Styles',
        'icon': 'e-table-styles',
        'tooltip': 'Styles',
        'command': 'Table',
        'subCommand': 'Styles'
    }
};
let alignmentLocale = [
    { locale: 'alignmentsDropDownLeft', value: 'JustifyLeft' },
    { locale: 'alignmentsDropDownCenter', value: 'JustifyCenter' },
    { locale: 'alignmentsDropDownRight', value: 'JustifyRight' },
    { locale: 'alignmentsDropDownJustify', value: 'JustifyFull' }
];
let alignmentItems = [
    { iconCss: 'e-icons e-justify-left', text: 'Align Left', command: 'Alignments', subCommand: 'JustifyLeft' },
    { iconCss: 'e-icons e-justify-center', text: 'Align Center', command: 'Alignments', subCommand: 'JustifyCenter' },
    { iconCss: 'e-icons e-justify-right', text: 'Align Right', command: 'Alignments', subCommand: 'JustifyRight' },
    { iconCss: 'e-icons e-justify-full', text: 'Align Justify', command: 'Alignments', subCommand: 'JustifyFull' }
];
let imageAlignItems = [
    { iconCss: 'e-icons e-justify-left', command: 'Images', subCommand: 'JustifyLeft' },
    { iconCss: 'e-icons e-justify-center', command: 'Images', subCommand: 'JustifyCenter' },
    { iconCss: 'e-icons e-justify-right', command: 'Images', subCommand: 'JustifyRight' },
];
let displayLocale = [
    { locale: 'imageDisplayDropDownInline', value: 'Inline' },
    { locale: 'imageDisplayDropDownBreak', value: 'Break' }
];
let imageDisplayItems = [
    { text: 'Inline', cssClass: 'e-inline', command: 'Images', subCommand: 'Inline' },
    { text: 'Break', cssClass: 'e-break', command: 'Images', subCommand: 'Break' },
];
let tableRowLocale = [
    { locale: 'tableInsertRowDropDownBefore', value: 'InsertRowBefore' },
    { locale: 'tableInsertRowDropDownAfter', value: 'InsertRowAfter' },
    { locale: 'tableInsertRowDropDownDelete', value: 'DeleteRow' }
];
let tableRowsItems = [
    { iconCss: 'e-icons e-insert-row-before', text: 'Insert row before', command: 'Table', subCommand: 'InsertRowBefore' },
    { iconCss: 'e-icons e-insert-row-after', text: 'Insert row after', command: 'Table', subCommand: 'InsertRowAfter' },
    { iconCss: 'e-icons e-delete-row', text: 'Delete row', command: 'Table', subCommand: 'DeleteRow' },
];
let tableColumnLocale = [
    { locale: 'tableInsertColumnDropDownLeft', value: 'InsertColumnLeft' },
    { locale: 'tableInsertColumnDropDownRight', value: 'InsertColumnRight' },
    { locale: 'tableInsertColumnDropDownDelete', value: 'DeleteColumn' }
];
let tableColumnsItems = [
    { iconCss: 'e-icons e-insert-column-left', text: 'Insert column left', command: 'Table', subCommand: 'InsertColumnLeft' },
    { iconCss: 'e-icons e-insert-column-right', text: 'Insert column right', command: 'Table', subCommand: 'InsertColumnRight' },
    { iconCss: 'e-icons e-delete-column', text: 'Delete column', command: 'Table', subCommand: 'DeleteColumn' },
];
let tableVerticalLocale = [
    { locale: 'tableVerticalAlignDropDownTop', value: 'AlignTop' },
    { locale: 'tableVerticalAlignDropDownMiddle', value: 'AlignMiddle' },
    { locale: 'tableVerticalAlignDropDownBottom', value: 'AlignBottom' }
];
let TableCellVerticalAlignItems = [
    { iconCss: 'e-icons e-align-top', text: 'Align Top', command: 'Table', subCommand: 'AlignTop' },
    { iconCss: 'e-icons e-align-middle', text: 'Align Middle', command: 'Table', subCommand: 'AlignMiddle' },
    { iconCss: 'e-icons e-align-bottom', text: 'Align Bottom', command: 'Table', subCommand: 'AlignBottom' },
];
let tableStyleLocale = [
    { locale: 'tableStylesDropDownDashedBorder', value: 'Dashed' },
    { locale: 'tableStylesDropDownAlternateRows', value: 'Alternate' }
];
let TableStyleItems = [
    { text: 'Dashed Borders', cssClass: 'e-dashed-borders', command: 'Table', subCommand: 'Dashed' },
    { text: 'Alternate Rows', cssClass: 'e-alternate-rows', command: 'Table', subCommand: 'Alternate' }
];
function getLocale(self, localeItems, item) {
    for (let i = 0; localeItems.length > i; i++) {
        if (localeItems[i].value === item.subCommand) {
            return self.localeObj.getConstant(localeItems[i].locale);
        }
    }
    return item.text;
}
function updateDropDownLocale(self) {
    alignmentItems.forEach((item, i) => {
        alignmentItems[i].text = getLocale(self, alignmentLocale, alignmentItems[i]);
    });
    imageDisplayItems.forEach((item, i) => {
        imageDisplayItems[i].text = getLocale(self, displayLocale, imageDisplayItems[i]);
    });
    tableRowsItems.forEach((item, i) => {
        tableRowsItems[i].text = getLocale(self, tableRowLocale, tableRowsItems[i]);
    });
    tableColumnsItems.forEach((item, i) => {
        tableColumnsItems[i].text = getLocale(self, tableColumnLocale, tableColumnsItems[i]);
    });
    TableCellVerticalAlignItems.forEach((item, i) => {
        TableCellVerticalAlignItems[i].text = getLocale(self, tableVerticalLocale, TableCellVerticalAlignItems[i]);
    });
    TableStyleItems.forEach((item, i) => {
        TableStyleItems[i].text = getLocale(self, tableStyleLocale, TableStyleItems[i]);
    });
}

// tslint:disable
/**
 * Export default locale
 */
let defaultLocale = {
    'alignments': 'Alignments',
    'justifyLeft': 'Align Left',
    'justifyCenter': 'Align Center',
    'justifyRight': 'Align Right',
    'justifyFull': 'Align Justify',
    'fontName': 'Font Name',
    'fontSize': 'Font Size',
    'fontColor': 'Font Color',
    'backgroundColor': 'Background Color',
    'bold': 'Bold',
    'italic': 'Italic',
    'underline': 'Underline',
    'strikethrough': 'Strikethrough',
    'clearFormat': 'Clear Format',
    'clearAll': 'Clear All',
    'cut': 'Cut',
    'copy': 'Copy',
    'paste': 'Paste',
    'unorderedList': 'Bulleted List',
    'orderedList': 'Numbered List',
    'indent': 'Increase Indent',
    'outdent': 'Decrease Indent',
    'undo': 'Undo',
    'redo': 'Redo',
    'superscript': 'Superscript',
    'subscript': 'Subscript',
    'createLink': 'Insert Hyperlink',
    'openLink': 'Open Link',
    'editLink': 'Edit Link',
    'removeLink': 'Remove Link',
    'image': 'Insert Image',
    'replace': 'Replace',
    'align': 'Align',
    'caption': 'Image Caption',
    'remove': 'Remove',
    'insertLink': 'Insert Link',
    'display': 'Display',
    'altText': 'Alternative Text',
    'dimension': 'Change Size',
    'fullscreen': 'Maximize',
    'maximize': 'Maximize',
    'minimize': 'Minimize',
    'lowerCase': 'Lower Case',
    'upperCase': 'Upper Case',
    'print': 'Print',
    'formats': 'Formats',
    'sourcecode': 'Code View',
    'preview': 'Preview',
    'viewside': 'ViewSide',
    'insertCode': 'Insert Code',
    'linkText': 'Display Text',
    'linkTooltipLabel': 'Title',
    'linkWebUrl': 'Web Address',
    'linkTitle': 'Enter a title',
    'linkurl': 'http://example.com',
    'linkOpenInNewWindow': 'Open Link in New Window',
    'linkHeader': 'Insert Link',
    'dialogInsert': 'Insert',
    'dialogCancel': 'Cancel',
    'dialogUpdate': 'Update',
    'imageHeader': 'Insert Image',
    'imageLinkHeader': 'You can also provide a link from the web',
    'mdimageLink': 'Please provide a URL for your image',
    'imageUploadMessage': 'Drop image here or browse to upload',
    'imageDeviceUploadMessage': 'Click here to upload',
    'imageAlternateText': 'Alternate Text',
    'alternateHeader': 'Alternative Text',
    'browse': 'Browse',
    'imageUrl': 'http://example.com/image.png',
    'imageCaption': 'Caption',
    'imageSizeHeader': 'Image Size',
    'imageHeight': 'Height',
    'imageWidth': 'Width',
    'textPlaceholder': 'Enter Text',
    'inserttablebtn': 'Insert Table',
    'tabledialogHeader': 'Insert Table',
    'tableWidth': 'Width',
    'cellpadding': 'Cell Padding',
    'cellspacing': 'Cell Spacing',
    'columns': 'Number of columns',
    'rows': 'Number of rows',
    'tableRows': 'Table Rows',
    'tableColumns': 'Table Columns',
    'tableCellHorizontalAlign': 'Table Cell Horizontal Align',
    'tableCellVerticalAlign': 'Table Cell Vertical Align',
    'createTable': 'Create Table',
    'removeTable': 'Remove Table',
    'tableHeader': 'Table Header',
    'tableRemove': 'Table Remove',
    'tableCellBackground': 'Table Cell Background',
    'tableEditProperties': 'Table Edit Properties',
    'styles': 'Styles',
    'insertColumnLeft': 'Insert Column Left',
    'insertColumnRight': 'Insert Column Right',
    'deleteColumn': 'Delete Column',
    'insertRowBefore': 'Insert Row Before',
    'insertRowAfter': 'Insert Row After',
    'deleteRow': 'Delete Row',
    'tableEditHeader': 'Edit Table',
    'TableHeadingText': 'Heading',
    'TableColText': 'Col',
    'imageInsertLinkHeader': 'Insert Link',
    'editImageHeader': 'Edit Image',
    "alignmentsDropDownLeft": 'Align Left',
    "alignmentsDropDownCenter": 'Align Center',
    "alignmentsDropDownRight": 'Align Right',
    "alignmentsDropDownJustify": 'Align Justify',
    "imageDisplayDropDownInline": 'Inline',
    "imageDisplayDropDownBreak": 'Break',
    "tableInsertRowDropDownBefore": 'Insert row before',
    "tableInsertRowDropDownAfter": 'Insert row after',
    "tableInsertRowDropDownDelete": 'Delete row',
    "tableInsertColumnDropDownLeft": 'Insert column left',
    "tableInsertColumnDropDownRight": 'Insert column right',
    "tableInsertColumnDropDownDelete": 'Delete column',
    "tableVerticalAlignDropDownTop": 'Align Top',
    "tableVerticalAlignDropDownMiddle": 'Align Middle',
    "tableVerticalAlignDropDownBottom": 'Align Bottom',
    "tableStylesDropDownDashedBorder": 'Dashed Borders',
    "tableStylesDropDownAlternateRows": 'Alternate Rows',
    'pasteFormat': 'Paste Format',
    'pasteFormatContent': 'Choose the formatting action',
    'plainText': 'Plain Text',
    'cleanFormat': 'Clean',
    'keepFormat': 'Keep',
    'pasteDialogOk': 'OK',
    'pasteDialogCancel': 'Cancel'
};
let toolsLocale = {
    'alignments': 'alignments',
    'justifyleft': 'justifyLeft',
    'justifycenter': 'justifyCenter',
    'justifyright': 'justifyRight',
    'justifyfull': 'justifyFull',
    'fontname': 'fontName',
    'fontsize': 'fontSize',
    'fontcolor': 'fontColor',
    'backgroundcolor': 'backgroundColor',
    'bold': 'bold',
    'italic': 'italic',
    'underline': 'underline',
    'strikethrough': 'strikethrough',
    'clearformat': 'clearFormat',
    'clearall': 'clearAll',
    'cut': 'cut',
    'copy': 'copy',
    'paste': 'paste',
    'unorderedlist': 'unorderedList',
    'orderedlist': 'orderedList',
    'indent': 'indent',
    'outdent': 'outdent',
    'undo': 'undo',
    'redo': 'redo',
    'superscript': 'superscript',
    'subscript': 'subscript',
    'createlink': 'createLink',
    'openlink': 'openLink',
    'editlink': 'editLink',
    'removelink': 'removeLink',
    'openimagelink': 'openLink',
    'editimagelink': 'editLink',
    'removeimagelink': 'removeLink',
    'image': 'image',
    'replace': 'replace',
    'align': 'align',
    'caption': 'caption',
    'remove': 'remove',
    'insertlink': 'insertLink',
    'display': 'display',
    'alttext': 'altText',
    'dimension': 'dimension',
    'fullscreen': 'fullscreen',
    'maximize': 'maximize',
    'minimize': 'minimize',
    'lowercase': 'lowerCase',
    'uppercase': 'upperCase',
    'print': 'print',
    'formats': 'formats',
    'sourcecode': 'sourcecode',
    'preview': 'preview',
    'viewside': 'viewside',
    'insertcode': 'insertCode',
    'tablerows': 'tableRows',
    'tablecolumns': 'tableColumns',
    'tablecellhorizontalalign': 'tableCellHorizontalAlign',
    'tablecellverticalalign': 'tableCellVerticalAlign',
    'createtable': 'createTable',
    'removetable': 'removeTable',
    'tableheader': 'tableHeader',
    'tableremove': 'tableRemove',
    'tablecellbackground': 'tableCellBackground',
    'tableeditproperties': 'tableEditProperties',
    'styles': 'styles',
    'insertcolumnleft': 'insertColumnLeft',
    'insertcolumnright': 'insertColumnRight',
    'deletecolumn': 'deleteColumn',
    'aligntop': 'AlignTop',
    'alignmiddle': 'AlignMiddle',
    'alignbottom': 'AlignBottom',
    'insertrowbefore': 'insertRowBefore',
    'insertrowafter': 'insertRowAfter',
    'deleterow': 'deleteRow'
};

/**
 * Exports util methods used by RichTextEditor.
 */
let undoRedoItems = ['Undo', 'Redo'];
function getIndex(val, items) {
    let index = -1;
    items.some((item, i) => {
        if (typeof item === 'string' && val === item.toLocaleLowerCase()) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}
function hasClass(element, className) {
    let hasClass = false;
    if (element.classList.contains(className)) {
        hasClass = true;
    }
    return hasClass;
}
function getDropDownValue(items, value, type, returnType) {
    let data;
    let result;
    for (let k = 0; k < items.length; k++) {
        if (type === 'value' && items[k].value.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
        else if (type === 'text' && items[k].text.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
        else if (type === 'subCommand' && items[k].subCommand.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
    }
    if (!isNullOrUndefined(data)) {
        switch (returnType) {
            case 'text':
                result = data.text;
                break;
            case 'value':
                result = data.value;
                break;
            case 'iconCss':
                result = data.iconCss;
                break;
        }
    }
    return result;
}
function isIDevice() {
    let result = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}
function getFormattedFontSize(value) {
    if (isNullOrUndefined(value)) {
        return '';
    }
    return value;
}
function pageYOffset(e, parentElement, isIFrame) {
    let y = 0;
    if (isIFrame) {
        y = window.pageYOffset + parentElement.getBoundingClientRect().top + e.clientY;
    }
    else {
        y = e.pageY;
    }
    return y;
}
function getTooltipText(item, serviceLocator) {
    let i10n = serviceLocator.getService('rteLocale');
    let itemLocale = toolsLocale[item];
    let tooltipText = i10n.getConstant(itemLocale);
    return tooltipText;
}
function setToolbarStatus(e, isPopToolbar) {
    let dropDown = e.dropDownModule;
    let data = e.args;
    let keys = Object.keys(e.args);
    for (let key of keys) {
        for (let j = 0; j < e.tbItems.length; j++) {
            let item = e.tbItems[j].subCommand;
            let itemStr = item && item.toLocaleLowerCase();
            if (item && (itemStr === key) || (item === 'UL' && key === 'unorderedlist') || (item === 'OL' && key === 'orderedlist')) {
                if (typeof data[key] === 'boolean') {
                    if (data[key] === true) {
                        addClass([e.tbElements[j]], [CLS_ACTIVE]);
                    }
                    else {
                        removeClass([e.tbElements[j]], [CLS_ACTIVE]);
                    }
                }
                else if ((typeof data[key] === 'string' || data[key] === null) &&
                    getIndex(key, e.parent.toolbarSettings.items) > -1) {
                    let value = ((data[key]) ? data[key] : '');
                    let result = '';
                    switch (key) {
                        case 'formats':
                            if (isNullOrUndefined(dropDown.formatDropDown) || isPopToolbar ||
                                (!isNullOrUndefined(dropDown.formatDropDown) && dropDown.formatDropDown.isDestroyed)) {
                                return;
                            }
                            let formatItems = e.parent.format.types;
                            result = getDropDownValue(formatItems, value, 'subCommand', 'text');
                            let formatContent = isNullOrUndefined(e.parent.format.default) ? formatItems[0].text :
                                e.parent.format.default;
                            dropDown.formatDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.format.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + (isNullOrUndefined(result) ? formatContent : result) +
                                '</span></span>');
                            dropDown.formatDropDown.dataBind();
                            break;
                        case 'alignments':
                            if (isNullOrUndefined(dropDown.alignDropDown) ||
                                (!isNullOrUndefined(dropDown.alignDropDown) && dropDown.alignDropDown.isDestroyed)) {
                                return;
                            }
                            let alignItems = alignmentItems;
                            result = getDropDownValue(alignItems, value, 'subCommand', 'iconCss');
                            dropDown.alignDropDown.iconCss = isNullOrUndefined(result) ? 'e-icons e-justify-left' : result;
                            dropDown.alignDropDown.dataBind();
                            break;
                        case 'fontname':
                            if (isNullOrUndefined(dropDown.fontNameDropDown) || isPopToolbar ||
                                (!isNullOrUndefined(dropDown.fontNameDropDown) && dropDown.fontNameDropDown.isDestroyed)) {
                                return;
                            }
                            let fontNameItems = e.parent.fontFamily.items;
                            result = getDropDownValue(fontNameItems, value, 'value', 'text');
                            let fontNameContent = isNullOrUndefined(e.parent.fontFamily.default) ? fontNameItems[0].text :
                                e.parent.fontFamily.default;
                            let name = (isNullOrUndefined(result) ? fontNameContent : result);
                            e.tbElements[j].title = name;
                            dropDown.fontNameDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontFamily.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + name + '</span></span>');
                            dropDown.fontNameDropDown.dataBind();
                            break;
                        case 'fontsize':
                            if (isNullOrUndefined(dropDown.fontSizeDropDown) ||
                                (!isNullOrUndefined(dropDown.fontSizeDropDown) && dropDown.fontSizeDropDown.isDestroyed)) {
                                return;
                            }
                            let fontSizeItems = e.parent.fontSize.items;
                            let fontSizeContent = isNullOrUndefined(e.parent.fontSize.default) ? fontSizeItems[1].text :
                                e.parent.fontSize.default;
                            result = getDropDownValue(fontSizeItems, (value === '' ? fontSizeContent.replace(/\s/g, '') : value), 'value', 'text');
                            dropDown.fontSizeDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontSize.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + getFormattedFontSize(result) + '</span></span>');
                            dropDown.fontSizeDropDown.dataBind();
                            break;
                    }
                }
            }
        }
    }
}
function getCollection(items) {
    if (typeof items === 'object') {
        return items;
    }
    else {
        return [items];
    }
}
function getTBarItemsIndex(items, toolbarItems) {
    let itemsIndex = [];
    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < toolbarItems.length; j++) {
            if (toolbarItems[j].type === 'Separator') {
                continue;
            }
            else {
                if (items[i] === 'OrderedList' && toolbarItems[j].subCommand === 'OL') {
                    itemsIndex.push(j);
                    break;
                }
                else if (items[i] === 'UnorderedList' && toolbarItems[j].subCommand === 'UL') {
                    itemsIndex.push(j);
                    break;
                }
                else if (items[i] === toolbarItems[j].subCommand) {
                    itemsIndex.push(j);
                    break;
                }
            }
        }
    }
    return itemsIndex;
}
function updateUndoRedoStatus(baseToolbar, undoRedoStatus) {
    let i = 0;
    let trgItems = getTBarItemsIndex(getCollection(undoRedoItems), baseToolbar.toolbarObj.items);
    let tbItems = selectAll('.' + CLS_TB_ITEM, baseToolbar.toolbarObj.element);
    let keys = Object.keys(undoRedoStatus);
    for (let key of keys) {
        let target = tbItems[trgItems[i]];
        if (target) {
            baseToolbar.toolbarObj.enableItems(target, undoRedoStatus[key]);
        }
        i++;
    }
}
/**
 * To dispatch the event manually
 * @hidden
 */
function dispatchEvent(element, type) {
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
}
function parseHtml(value) {
    let tempNode = createElement('template');
    tempNode.innerHTML = value;
    if (tempNode.content instanceof DocumentFragment) {
        return tempNode.content;
    }
    else {
        return document.createRange().createContextualFragment(value);
    }
}
function getTextNodesUnder(docElement, node) {
    let nodes = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 3) {
            nodes.push(node);
        }
        else {
            nodes = nodes.concat(getTextNodesUnder(docElement, node));
        }
    }
    return nodes;
}
function toObjectLowerCase(obj) {
    let convertedValue = {};
    let keys = Object.keys(obj);
    for (let i = 0; i < Object.keys(obj).length; i++) {
        convertedValue[keys[i].toLocaleLowerCase()] = obj[keys[i]];
    }
    return convertedValue;
}
function getEditValue(value, rteObj) {
    let val;
    if (value !== null && value !== '') {
        val = rteObj.enableHtmlEncode ? updateTextNode(decode(value)) : updateTextNode(value);
        rteObj.setProperties({ value: val }, true);
    }
    else {
        val = rteObj.enableHtmlEncode ? '&lt;p&gt;&lt;br/&gt;&lt;/p&gt;' : '<p><br/></p>';
    }
    return val;
}
function updateTextNode(value) {
    let tempNode = document.createElement('div');
    tempNode.innerHTML = value;
    let childNodes = tempNode.childNodes;
    if (childNodes.length > 0) {
        [].slice.call(childNodes).forEach((childNode) => {
            if (childNode.nodeType === Node.TEXT_NODE && childNode.parentNode === tempNode
                && childNode.textContent.trim() !== '') {
                let defaultTag = document.createElement('p');
                let parentNode = childNode.parentNode;
                parentNode.insertBefore(defaultTag, childNode);
                defaultTag.appendChild(childNode);
            }
        });
    }
    return tempNode.innerHTML;
}
function isEditableValueEmpty(value) {
    return (value === '<p><br></p>' || value === '&lt;p&gt;&lt;br&gt;&lt;/p&gt;' || value === '') ? true : false;
}
function decode(value) {
    return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
        .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
        .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
        .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
}

/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 * @hidden
 */
class ToolbarRenderer {
    /**
     * Constructor for toolbar renderer module
     */
    constructor(parent) {
        this.parent = parent;
        this.wireEvent();
    }
    wireEvent() {
        this.parent.on(destroy, this.unWireEvent, this);
    }
    unWireEvent() {
        this.parent.off(destroy, this.unWireEvent);
        if (this.popupOverlay) {
            EventHandler.remove(this.popupOverlay, 'click touchmove', this.onPopupOverlay);
        }
    }
    toolbarBeforeCreate(e) {
        if (this.mode === 'Extended') {
            e.enableCollision = false;
        }
    }
    toolbarCreated() {
        this.parent.notify(toolbarCreated, this);
    }
    toolbarClicked(args) {
        if (this.parent.readonly || !this.parent.enabled) {
            return;
        }
        this.parent.notify(toolbarClick, args);
        this.parent.trigger('toolbarClick', args);
    }
    dropDownSelected(args) {
        this.parent.notify(dropDownSelect, args);
        this.onPopupOverlay();
    }
    beforeDropDownItemRender(args) {
        if (this.parent.readonly || !this.parent.enabled) {
            return;
        }
        this.parent.notify(beforeDropDownItemRender, args);
    }
    dropDownOpen(args) {
        if (Browser.isDevice && !args.element.parentElement.classList.contains(CLS_QUICK_DROPDOWN)) {
            this.popupModal(args.element.parentElement);
        }
        this.parent.notify(selectionSave, args);
    }
    dropDownClose(args) {
        this.parent.notify(selectionRestore, args);
    }
    renderToolbar(args) {
        this.setPanel(args.target);
        this.renderPanel();
        this.mode = args.overflowMode;
        args.rteToolbarObj.toolbarObj = new Toolbar({
            items: args.items,
            width: '100%',
            overflowMode: args.overflowMode,
            beforeCreate: this.toolbarBeforeCreate.bind(this),
            created: this.toolbarCreated.bind(this),
            clicked: this.toolbarClicked.bind(this),
            enablePersistence: args.enablePersistence,
            enableRtl: args.enableRtl
        });
        args.rteToolbarObj.toolbarObj.isStringTemplate = true;
        args.rteToolbarObj.toolbarObj.createElement = this.parent.createElement;
        args.rteToolbarObj.toolbarObj.appendTo(args.target);
    }
    renderDropDownButton(args) {
        let css;
        args.element.classList.add(CLS_DROPDOWN_BTN);
        css = args.cssClass + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN;
        if (this.parent.inlineMode.enable && Browser.isDevice) {
            css = css + ' ' + CLS_INLINE_DROPDOWN;
        }
        let proxy = this;
        let dropDown = new DropDownButton({
            items: args.items,
            iconCss: args.iconCss,
            cssClass: css,
            content: args.content,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            select: this.dropDownSelected.bind(this),
            beforeOpen: (args) => {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    args.cancel = true;
                    return;
                }
                for (let index = 0; index < args.element.childNodes.length; index++) {
                    let divNode = this.parent.createElement('div');
                    divNode.innerHTML = dropDown.content.trim();
                    if (divNode.textContent.trim() !== ''
                        && args.element.childNodes[index].textContent.trim() === divNode.textContent.trim()) {
                        if (!args.element.childNodes[index].classList.contains('e-active')) {
                            addClass([args.element.childNodes[index]], 'e-active');
                        }
                    }
                    else {
                        removeClass([args.element.childNodes[index]], 'e-active');
                    }
                }
                proxy.parent.notify(beforeDropDownOpen, args);
            },
            close: this.dropDownClose.bind(this),
            open: this.dropDownOpen.bind(this),
            beforeItemRender: this.beforeDropDownItemRender.bind(this)
        });
        dropDown.isStringTemplate = true;
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        args.element.tabIndex = -1;
        let popupElement = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        return dropDown;
    }
    onPopupOverlay(args) {
        if (!isNullOrUndefined(this.popupOverlay)) {
            closest(this.popupOverlay, '.e-popup-container').style.display = 'none';
            this.popupOverlay.style.display = 'none';
            removeClass([this.popupOverlay], 'e-popup-overlay');
        }
    }
    setIsModel(element) {
        if (!closest(element, '.e-popup-container')) {
            let popupContainer = this.parent.createElement('div', {
                className: 'e-rte-modal-popup e-popup-container e-center'
            });
            element.parentNode.insertBefore(popupContainer, element);
            popupContainer.appendChild(element);
            popupContainer.style.zIndex = element.style.zIndex;
            popupContainer.style.display = 'flex';
            element.style.position = 'relative';
            addClass([element], 'e-popup-modal');
            this.popupOverlay = this.parent.createElement('div', { className: 'e-popup-overlay' });
            this.popupOverlay.style.zIndex = (parseInt(element.style.zIndex, null) - 1).toString();
            this.popupOverlay.style.display = 'block';
            popupContainer.appendChild(this.popupOverlay);
            EventHandler.add(this.popupOverlay, 'click touchmove', this.onPopupOverlay, this);
        }
        else {
            element.parentElement.style.display = 'flex';
            this.popupOverlay = element.nextElementSibling;
            this.popupOverlay.style.display = 'block';
            addClass([this.popupOverlay], 'e-popup-overlay');
        }
    }
    paletteSelection(dropDownArgs, currentElement) {
        let ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
        let colorbox = [].slice.call(selectAll('.e-tile', ele.parentElement));
        removeClass(colorbox, 'e-selected');
        let style = currentElement.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
        (colorbox.filter((colorbox) => {
            if (colorbox.style.backgroundColor === style) {
                addClass([colorbox], 'e-selected');
            }
        }));
    }
    renderColorPickerDropDown(args, item, colorPicker) {
        let proxy = this;
        let css = CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN + ((this.parent.inlineMode) ? (' ' + CLS_INLINE_DROPDOWN) : '');
        css += (' ' + ((item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_DROPDOWN : CLS_FONT_COLOR_DROPDOWN));
        let content = proxy.parent.createElement('span', { className: CLS_COLOR_CONTENT });
        let inlineEle = proxy.parent.createElement('span', { className: args.cssClass });
        let range;
        inlineEle.style.borderBottomColor = (item === 'backgroundcolor') ?
            proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
        content.appendChild(inlineEle);
        let dropDown = new DropDownButton({
            target: colorPicker.element.parentElement, cssClass: css,
            enablePersistence: this.parent.enablePersistence, enableRtl: this.parent.enableRtl,
            beforeOpen: (dropDownArgs) => {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    dropDownArgs.cancel = true;
                    return;
                }
                let element = (dropDownArgs.event) ? dropDownArgs.event.target : null;
                proxy.currentElement = dropDown.element;
                proxy.currentDropdown = dropDown;
                proxy.paletteSelection(dropDownArgs, proxy.currentElement);
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    dropDownArgs.cancel = true;
                    let colorpickerValue = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        element.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
                    proxy.parent.notify(selectionRestore, {});
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    let parentNode = range.startContainer.parentNode;
                    if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                        (closest(range.startContainer.parentNode, 'td,th')) ||
                        (proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')))
                        && range.collapsed) {
                        proxy.parent.notify(tableColorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    else {
                        proxy.parent.notify(colorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    return;
                }
                else {
                    let ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
                    let inst = getInstance(ele, ColorPicker);
                    inst.showButtons = (dropDownArgs.element.querySelector('.e-color-palette')) ? false : true;
                    inst.dataBind();
                }
                dropDownArgs.element.onclick = (args) => {
                    if (args.target.classList.contains('e-cancel')) {
                        dropDown.toggle();
                    }
                };
            },
            open: (dropDownArgs) => {
                this.setColorPickerContentWidth(colorPicker);
                let ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
                let focusEle;
                if (dropDownArgs.element.querySelector('.e-color-palette')) {
                    focusEle = ele.parentElement.querySelector('.e-palette');
                }
                else {
                    focusEle = ele.parentElement.querySelector('e-handler');
                }
                if (focusEle) {
                    focusEle.focus();
                }
                if (Browser.isDevice) {
                    this.popupModal(dropDownArgs.element.parentElement);
                }
                this.pickerRefresh(dropDownArgs);
            },
            beforeClose: (dropDownArgs) => {
                let element = (dropDownArgs.event) ? dropDownArgs.event.target : null;
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    let colorpickerValue = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        element.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
                    /* tslint:enable */
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                        closest(range.startContainer.parentNode, 'td,th')) && range.collapsed) {
                        proxy.parent.notify(tableColorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    else {
                        proxy.parent.notify(colorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    return;
                }
            },
            close: (dropDownArgs) => {
                proxy.parent.notify(selectionRestore, {});
                let dropElement = closest(dropDownArgs.element.parentElement, '.e-popup-container');
                if (dropElement) {
                    dropElement.style.display = 'none';
                    dropElement.lastElementChild.style.display = 'none';
                    removeClass([dropElement.lastElementChild], 'e-popup-overlay');
                }
            }
        });
        dropDown.isStringTemplate = true;
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        let popupElement = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        dropDown.element.insertBefore(content, dropDown.element.querySelector('.e-caret'));
        args.element.tabIndex = -1;
        dropDown.element.removeAttribute('type');
        dropDown.element.onmousedown = () => { proxy.parent.notify(selectionSave, {}); };
        return dropDown;
    }
    pickerRefresh(dropDownArgs) {
        if (this.parent.backgroundColor.mode === 'Picker') {
            let popupElem = dropDownArgs.element.parentElement;
            popupElem.style.width = (popupElem.offsetWidth + 5).toString() + 'px';
            getInstance(popupElem, Popup).refreshPosition(popupElem);
            popupElem.style.width = (popupElem.offsetWidth - 5).toString() + 'px';
        }
    }
    popupModal(element) {
        let popupInst = getInstance(element, Popup);
        popupInst.relateTo = document.body;
        popupInst.position = { X: 0, Y: 0 };
        popupInst.targetType = 'container';
        popupInst.collision = { X: 'fit', Y: 'fit' };
        popupInst.offsetY = 4;
        popupInst.dataBind();
        this.setIsModel(element);
    }
    setColorPickerContentWidth(colorPicker) {
        let colorPickerContent = colorPicker.element.nextSibling;
        if (colorPickerContent.style.width === '0px') {
            colorPickerContent.style.width = '';
            let borderWidth = parseInt(getComputedStyle(colorPickerContent).borderBottomWidth, 10);
            colorPickerContent.style.width = formatUnit(colorPickerContent.children[0].offsetWidth
                + borderWidth + borderWidth);
        }
    }
    renderColorPicker(args, item) {
        let proxy = this;
        this.colorPicker = new ColorPicker({
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            inline: true,
            created: () => {
                let value = (item === 'backgroundcolor') ? proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
                this.colorPicker.setProperties({ value: value });
            },
            mode: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.mode : proxy.parent.fontColor.mode),
            modeSwitcher: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.modeSwitcher : proxy.parent.fontColor.modeSwitcher),
            beforeTileRender: (args) => {
                args.element.classList.add(CLS_COLOR_PALETTE);
            },
            change: (colorPickerArgs) => {
                let colorpickerValue = colorPickerArgs.currentValue.rgba;
                colorPickerArgs.item = {
                    command: args.command,
                    subCommand: args.subCommand,
                    value: colorpickerValue
                };
                proxy.parent.notify(selectionRestore, {});
                proxy.currentElement.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor = colorpickerValue;
                let range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                    closest(range.startContainer.parentNode, 'td,th')) && range.collapsed) {
                    proxy.parent.notify(tableColorPickerChanged, colorPickerArgs);
                }
                else {
                    proxy.parent.notify(colorPickerChanged, colorPickerArgs);
                }
                proxy.currentDropdown.toggle();
            },
            beforeModeSwitch: (args) => {
                this.colorPicker.showButtons = args.mode === 'Palette' ? false : true;
            }
        });
        this.colorPicker.isStringTemplate = true;
        this.colorPicker.columns = (item === 'backgroundcolor') ? this.parent.backgroundColor.columns : this.parent.fontColor.columns;
        this.colorPicker.presetColors = (item === 'backgroundcolor') ? this.parent.backgroundColor.colorCode :
            this.parent.fontColor.colorCode;
        this.colorPicker.cssClass = (item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_PICKER : CLS_FONT_COLOR_PICKER;
        this.colorPicker.createElement = this.parent.createElement;
        this.colorPicker.appendTo(document.body.querySelector(args.target));
        return this.colorPicker;
    }
    /**
     * The function is used to render RichTextEditor toolbar
     */
    renderPanel() {
        this.getPanel().classList.add(CLS_TOOLBAR);
    }
    /**
     * Get the toolbar element of RichTextEditor
     * @return {Element}
     */
    getPanel() {
        return this.toolbarPanel;
    }
    /**
     * Set the toolbar element of RichTextEditor
     * @param  {Element} panel
     */
    setPanel(panel) {
        this.toolbarPanel = panel;
    }
}

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
class BaseToolbar {
    constructor(parent, serviceLocator) {
        this.tools = {};
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
        if (this.parent.toolbarSettings && Object.keys(this.parent.toolbarSettings.itemConfigs).length > 0) {
            extend(this.tools, tools, toObjectLowerCase(this.parent.toolbarSettings.itemConfigs), true);
        }
        else {
            this.tools = tools;
        }
    }
    addEventListener() {
        this.parent.on(rtlMode, this.setRtl, this);
        this.parent.on(destroy, this.removeEventListener, this);
    }
    removeEventListener() {
        this.parent.off(rtlMode, this.setRtl);
        this.parent.off(destroy, this.removeEventListener);
    }
    setRtl(args) {
        if (!isNullOrUndefined(this.toolbarObj)) {
            this.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    }
    getTemplateObject(itemStr, container) {
        let tagName;
        switch (itemStr) {
            case 'fontcolor':
            case 'backgroundcolor':
                tagName = 'span';
                break;
            default:
                tagName = 'button';
                break;
        }
        return {
            command: this.tools[itemStr.toLocaleLowerCase()].command,
            subCommand: this.tools[itemStr.toLocaleLowerCase()].subCommand,
            template: this.parent.createElement(tagName, {
                id: this.parent.getID() + '_' + container
                    + '_' + this.tools[itemStr.toLocaleLowerCase()].id
            }).outerHTML,
            tooltipText: getTooltipText(itemStr, this.locator)
        };
    }
    getObject(item, container) {
        let itemStr = item.toLowerCase();
        if (templateItems.indexOf(itemStr) !== -1) {
            return this.getTemplateObject(itemStr, container);
        }
        else {
            switch (itemStr) {
                case '|':
                    return { type: 'Separator' };
                case '-':
                    return { type: 'Separator', cssClass: CLS_HR_SEPARATOR };
                default:
                    return {
                        id: this.parent.getID() + '_' + container + '_' + this.tools[itemStr.toLocaleLowerCase()].id,
                        prefixIcon: this.tools[itemStr.toLocaleLowerCase()].icon,
                        tooltipText: getTooltipText(itemStr, this.locator),
                        command: this.tools[itemStr.toLocaleLowerCase()].command,
                        subCommand: this.tools[itemStr.toLocaleLowerCase()].subCommand
                    };
            }
        }
    }
    /**
     * @hidden
     */
    getItems(tbItems, container) {
        if (this.parent.toolbarSettings.items.length < 1) {
            return [];
        }
        let items = [];
        for (let item of tbItems) {
            switch (typeof item) {
                case 'string':
                    items.push(this.getObject(item, container));
                    break;
                default:
                    items.push(item);
            }
        }
        return items;
    }
    getToolbarOptions(args) {
        return {
            target: args.target,
            rteToolbarObj: this,
            items: this.getItems(args.items, args.container),
            overflowMode: args.mode,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl
        };
    }
    render(args) {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        this.toolbarRenderer.renderToolbar(this.getToolbarOptions(args));
    }
}

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
class DropDownButtons {
    constructor(parent, serviceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    initializeInstance() {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
    }
    beforeRender(args) {
        let item = args.item;
        if (item.cssClass) {
            addClass([args.element], item.cssClass);
        }
        if (item.command === 'Alignments' || item.subCommand === 'JustifyLeft'
            || item.subCommand === 'JustifyRight' || item.subCommand === 'JustifyCenter') {
            args.element.setAttribute('title', getTooltipText(item.subCommand.toLocaleLowerCase(), this.locator));
        }
    }
    dropdownContent(width, type, content) {
        return ('<span style="display: inline-flex;' + 'width:' + ((type === 'quick') ? 'auto' : width) + '" >' +
            '<span class="e-rte-dropdown-btn-text">' + content + '</span></span>');
    }
    renderDropDowns(args) {
        this.initializeInstance();
        let type = args.containerType;
        let tbElement = args.container;
        templateItems.forEach((item) => {
            let targetElement = undefined;
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                    case 'formats':
                        targetElement = select('#' + this.parent.getID() + '_' + type + '_Formats', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        let formatItem = this.parent.format.types.slice();
                        formatItem.forEach((item) => {
                            Object.defineProperties(item, {
                                command: { value: 'Formats', enumerable: true }, subCommand: { value: item.value, enumerable: true }
                            });
                        });
                        let formatContent = isNullOrUndefined(this.parent.format.default) ? formatItem[0].text :
                            this.parent.format.default;
                        this.formatDropDown = this.toolbarRenderer.renderDropDownButton({
                            iconCss: ((type === 'quick') ? 'e-formats e-icons' : ''),
                            content: this.dropdownContent(this.parent.format.width, type, ((type === 'quick') ? '' : getDropDownValue(formatItem, formatContent, 'text', 'text'))),
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_FORMATS_TB_BTN,
                            itemName: 'Formats', items: formatItem, element: targetElement
                        });
                        break;
                    case 'fontname':
                        targetElement = select('#' + this.parent.getID() + '_' + type + '_FontName', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        let fontItem = this.parent.fontFamily.items.slice();
                        fontItem.forEach((item) => {
                            Object.defineProperties(item, {
                                command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontName', enumerable: true }
                            });
                        });
                        let fontNameContent = isNullOrUndefined(this.parent.fontFamily.default) ? fontItem[0].text :
                            this.parent.fontFamily.default;
                        this.fontNameDropDown = this.toolbarRenderer.renderDropDownButton({
                            iconCss: ((type === 'quick') ? 'e-font-name e-icons' : ''),
                            content: this.dropdownContent(this.parent.fontFamily.width, type, ((type === 'quick') ? '' : getDropDownValue(fontItem, fontNameContent, 'text', 'text'))),
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_FONT_NAME_TB_BTN,
                            itemName: 'FontName', items: fontItem, element: targetElement
                        });
                        if (!isNullOrUndefined(this.parent.fontFamily.default)) {
                            this.getEditNode().style.fontFamily = this.parent.fontFamily.default;
                        }
                        break;
                    case 'fontsize':
                        targetElement = select('#' + this.parent.getID() + '_' + type + '_FontSize', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        let fontsize = this.parent.fontSize.items.slice();
                        fontsize.forEach((item) => {
                            Object.defineProperties(item, {
                                command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontSize', enumerable: true }
                            });
                        });
                        let fontSizeContent = isNullOrUndefined(this.parent.fontSize.default) ? fontsize[1].text :
                            this.parent.fontSize.default;
                        this.fontSizeDropDown = this.toolbarRenderer.renderDropDownButton({
                            content: this.dropdownContent(this.parent.fontSize.width, type, getFormattedFontSize(getDropDownValue(fontsize, fontSizeContent.replace(/\s/g, ''), 'value', 'text'))),
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_FONT_SIZE_TB_BTN,
                            itemName: 'FontSize', items: fontsize, element: targetElement
                        });
                        if (!isNullOrUndefined(this.parent.fontSize.default)) {
                            this.getEditNode().style.fontSize = this.parent.fontSize.default;
                        }
                        break;
                    case 'alignments':
                        targetElement = select('#' + this.parent.getID() + '_' + type + '_Alignments', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        this.alignDropDown = this.toolbarRenderer.renderDropDownButton({
                            iconCss: 'e-justify-left e-icons',
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS,
                            itemName: 'Alignments', items: alignmentItems, element: targetElement
                        });
                        break;
                    case 'align':
                        this.imageAlignmentDropDown(type, tbElement, targetElement);
                        break;
                    case 'display':
                        this.imageDisplayDropDown(type, tbElement, targetElement);
                        break;
                    case 'tablerows':
                        this.rowDropDown(type, tbElement, targetElement);
                        break;
                    case 'tablecolumns':
                        this.columnDropDown(type, tbElement, targetElement);
                        break;
                    case 'tablecellverticalalign':
                        this.verticalAlignDropDown(type, tbElement, targetElement);
                        break;
                    case 'styles':
                        this.tableStylesDropDown(type, tbElement, targetElement);
                        break;
                }
            }
        });
    }
    getUpdateItems(items, value) {
        let dropDownItems = items.slice();
        dropDownItems.forEach((item) => {
            Object.defineProperties(item, {
                command: { value: (value === 'Format' ? 'Formats' : 'Font'), enumerable: true },
                subCommand: { value: (value === 'Format' ? item.value : value), enumerable: true }
            });
        });
        return dropDownItems;
    }
    onPropertyChanged(model) {
        let newProp = model.newProp;
        let type;
        let content;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'fontFamily':
                    if (this.fontNameDropDown) {
                        for (let fontFamily of Object.keys(newProp.fontFamily)) {
                            switch (fontFamily) {
                                case 'default':
                                case 'width':
                                    let fontItems = this.fontNameDropDown.items;
                                    type = !isNullOrUndefined(closest(this.fontNameDropDown.element, '.' + CLS_QUICK_TB)) ?
                                        'quick' : 'toolbar';
                                    let fontNameContent = isNullOrUndefined(this.parent.fontFamily.default) ? fontItems[0].text :
                                        this.parent.fontFamily.default;
                                    content = this.dropdownContent(this.parent.fontFamily.width, type, ((type === 'quick') ? '' : getDropDownValue(fontItems, fontNameContent, 'text', 'text')));
                                    this.fontNameDropDown.setProperties({ content: content });
                                    if (!isNullOrUndefined(this.parent.fontFamily.default)) {
                                        this.getEditNode().style.fontFamily = this.parent.fontFamily.default;
                                    }
                                    else {
                                        this.getEditNode().style.removeProperty('font-family');
                                    }
                                    break;
                                case 'items':
                                    this.fontNameDropDown.setProperties({
                                        items: this.getUpdateItems(newProp.fontFamily.items, 'FontSize')
                                    });
                                    break;
                            }
                        }
                    }
                    break;
                case 'fontSize':
                    if (this.fontSizeDropDown) {
                        for (let fontSize of Object.keys(newProp.fontSize)) {
                            switch (fontSize) {
                                case 'default':
                                case 'width':
                                    let fontsize = this.fontSizeDropDown.items;
                                    type = !isNullOrUndefined(closest(this.fontSizeDropDown.element, '.' + CLS_QUICK_TB)) ? 'quick' : 'toolbar';
                                    let fontSizeContent = isNullOrUndefined(this.parent.fontSize.default) ? fontsize[1].text :
                                        this.parent.fontSize.default;
                                    content = this.dropdownContent(this.parent.fontSize.width, type, getFormattedFontSize(getDropDownValue(fontsize, fontSizeContent.replace(/\s/g, ''), 'value', 'text')));
                                    this.fontSizeDropDown.setProperties({ content: content });
                                    if (!isNullOrUndefined(this.parent.fontSize.default)) {
                                        this.getEditNode().style.fontSize = this.parent.fontSize.default;
                                    }
                                    else {
                                        this.getEditNode().style.removeProperty('font-size');
                                    }
                                    break;
                                case 'items':
                                    this.fontSizeDropDown.setProperties({
                                        items: this.getUpdateItems(newProp.fontSize.items, 'FontSize')
                                    });
                                    break;
                            }
                        }
                    }
                    break;
                case 'format':
                    if (this.formatDropDown) {
                        for (let format of Object.keys(newProp.format)) {
                            switch (format) {
                                case 'default':
                                case 'width':
                                    let formatItems = this.formatDropDown.items;
                                    type = !isNullOrUndefined(closest(this.formatDropDown.element, '.' + CLS_QUICK_TB)) ? 'quick' : 'toolbar';
                                    let formatContent = isNullOrUndefined(this.parent.format.default) ? formatItems[0].text :
                                        this.parent.format.default;
                                    content = this.dropdownContent(this.parent.format.width, type, ((type === 'quick') ? '' : getDropDownValue(formatItems, formatContent, 'text', 'text')));
                                    this.formatDropDown.setProperties({ content: content });
                                    break;
                                case 'types':
                                    this.formatDropDown.setProperties({
                                        items: this.getUpdateItems(newProp.format.types, 'Format')
                                    });
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
    }
    getEditNode() {
        return this.parent.contentModule.getEditPanel();
    }
    rowDropDown(type, tbElement, targetElement) {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableRows', tbElement);
        if (targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
            return;
        }
        this.tableRowsDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-rows e-icons',
            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_QUICK_DROPDOWN,
            itemName: 'TableRows',
            items: tableRowsItems,
            element: targetElement
        });
    }
    columnDropDown(type, tbElement, targetElement) {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableColumns', tbElement);
        if (targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
            return;
        }
        this.tableColumnsDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-columns e-icons',
            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_QUICK_DROPDOWN,
            itemName: 'TableColumns',
            items: tableColumnsItems,
            element: targetElement
        });
    }
    verticalAlignDropDown(type, tbElement, targetElement) {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_TableCellVerticalAlign', tbElement);
        if (targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
            return;
        }
        this.tableCellVerticalAlignDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-table-cell-ver-align e-icons',
            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_QUICK_DROPDOWN,
            itemName: 'TableCellVerticalAlign',
            items: TableCellVerticalAlignItems,
            element: targetElement
        });
    }
    imageDisplayDropDown(type, tbElement, targetElement) {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_Display', tbElement);
        if (targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
            return;
        }
        this.displayDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-display e-icons',
            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_QUICK_DROPDOWN,
            itemName: 'Display',
            items: imageDisplayItems,
            element: targetElement
        });
    }
    imageAlignmentDropDown(type, tbElement, targetElement) {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_Align', tbElement);
        if (targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
            return;
        }
        this.imageAlignDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-justify-left e-icons',
            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ICONS + ' ' + CLS_QUICK_DROPDOWN,
            itemName: 'Align',
            items: imageAlignItems,
            element: targetElement
        });
    }
    tableStylesDropDown(type, tbElement, targetElement) {
        targetElement = select('#' + this.parent.getID() + '_' + type + '_Styles', tbElement);
        if (targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
            return;
        }
        this.imageAlignDropDown = this.toolbarRenderer.renderDropDownButton({
            iconCss: 'e-style e-icons',
            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ICONS + ' ' + CLS_QUICK_DROPDOWN,
            itemName: 'Styles',
            items: this.parent.tableSettings.styles,
            element: targetElement
        });
    }
    removeDropDownClasses(target) {
        removeClass([target], [
            CLS_DROPDOWN_BTN,
            CLS_DROPDOWN_POPUP,
            CLS_DROPDOWN_ICONS,
            CLS_DROPDOWN_ITEMS
        ]);
    }
    destroyDropDowns() {
        if (this.formatDropDown) {
            this.removeDropDownClasses(this.formatDropDown.element);
            this.formatDropDown.destroy();
        }
        if (this.fontNameDropDown) {
            this.removeDropDownClasses(this.fontNameDropDown.element);
            this.fontNameDropDown.destroy();
        }
        if (this.fontSizeDropDown) {
            this.removeDropDownClasses(this.fontSizeDropDown.element);
            this.fontSizeDropDown.destroy();
        }
        if (this.alignDropDown) {
            this.removeDropDownClasses(this.alignDropDown.element);
            this.alignDropDown.destroy();
        }
        if (this.imageAlignDropDown) {
            this.removeDropDownClasses(this.imageAlignDropDown.element);
            this.imageAlignDropDown.destroy();
        }
        if (this.displayDropDown) {
            this.removeDropDownClasses(this.displayDropDown.element);
            this.displayDropDown.destroy();
        }
        if (this.tableRowsDropDown) {
            this.removeDropDownClasses(this.tableRowsDropDown.element);
            this.tableRowsDropDown.destroy();
        }
        if (this.tableColumnsDropDown) {
            this.removeDropDownClasses(this.tableColumnsDropDown.element);
            this.tableColumnsDropDown.destroy();
        }
        if (this.tableCellVerticalAlignDropDown) {
            this.removeDropDownClasses(this.tableCellVerticalAlignDropDown.element);
            this.tableCellVerticalAlignDropDown.destroy();
        }
    }
    setRtl(args) {
        if (this.formatDropDown) {
            this.formatDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.fontNameDropDown) {
            this.fontNameDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.fontSizeDropDown) {
            this.fontSizeDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.alignDropDown) {
            this.alignDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.imageAlignDropDown) {
            this.imageAlignDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.displayDropDown) {
            this.displayDropDown.setProperties({ enableRtl: args.enableRtl });
        }
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(beforeDropDownItemRender, this.beforeRender, this);
        this.parent.on(iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(rtlMode, this.setRtl, this);
        this.parent.on(destroy, this.removeEventListener, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
    }
    onIframeMouseDown() {
        dispatchEvent(document, 'mousedown');
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(rtlMode, this.setRtl);
        this.parent.off(beforeDropDownItemRender, this.beforeRender);
        this.parent.off(destroy, this.removeEventListener);
        this.parent.off(modelChanged, this.onPropertyChanged);
    }
}

/**
 * ServiceLocator
 * @hidden
 */
class ServiceLocator {
    constructor() {
        this.services = {};
    }
    register(name, type) {
        if (isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    }
    getService(name) {
        if (isNullOrUndefined(this.services[name])) {
            throw `The service ${name} is not registered`;
        }
        return this.services[name];
    }
}

/**
 * RendererFactory
 * @hidden
 */
class RendererFactory {
    constructor() {
        this.rendererMap = {};
    }
    addRenderer(name, type) {
        let rName = getEnumValue(RenderType, name);
        if (isNullOrUndefined(this.rendererMap[rName])) {
            this.rendererMap[rName] = type;
        }
    }
    getRenderer(name) {
        let rName = getEnumValue(RenderType, name);
        if (isNullOrUndefined(this.rendererMap[rName])) {
            throw `The renderer ${rName} is not found`;
        }
        else {
            return this.rendererMap[rName];
        }
    }
}

/**
 * `ToolbarAction` module is used to toolbar click action
 */
class ToolbarAction {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
        this.serviceLocator = new ServiceLocator;
        this.serviceLocator.register('rendererFactory', new RendererFactory);
    }
    addEventListener() {
        this.parent.on(toolbarClick, this.toolbarClick, this);
        this.parent.on(dropDownSelect, this.dropDownSelect, this);
        this.parent.on(colorPickerChanged, this.renderSelection, this);
        this.parent.on(destroy, this.removeEventListener, this);
    }
    toolbarClick(args) {
        if (isNullOrUndefined(args.item)) {
            return;
        }
        if (!isNullOrUndefined(args.item.controlParent)) {
            let activeEle = args.item.controlParent
                .activeEle;
            if (activeEle) {
                activeEle.tabIndex = -1;
            }
        }
        this.parent.notify(htmlToolbarClick, args);
        this.parent.notify(markdownToolbarClick, args);
    }
    dropDownSelect(e) {
        this.parent.notify(selectionRestore, {});
        if (!(document.body.contains(document.body.querySelector('.e-rte-quick-toolbar'))
            && e.item && (e.item.command === 'Images' || e.item.command === 'Display' || e.item.command === 'Table'))) {
            let value = e.item.controlParent && this.parent.quickToolbarModule && this.parent.quickToolbarModule.tableQTBar
                && this.parent.quickToolbarModule.tableQTBar.element.contains(e.item.controlParent.element) ? 'Table' : null;
            this.parent.formatter.process(this.parent, e, e.originalEvent, value);
        }
        this.parent.notify(selectionSave, {});
    }
    renderSelection(args) {
        this.parent.notify(selectionRestore, {});
        this.parent.formatter.process(this.parent, args, args.originalEvent, null);
        this.parent.notify(selectionSave, {});
    }
    removeEventListener() {
        this.parent.off(toolbarClick, this.toolbarClick);
        this.parent.off(dropDownSelect, this.dropDownSelect);
        this.parent.off(colorPickerChanged, this.renderSelection);
        this.parent.off(destroy, this.removeEventListener);
    }
}

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
class Toolbar$1 {
    constructor(parent, serviceLocator) {
        this.parent = parent;
        this.isToolbar = false;
        this.locator = serviceLocator;
        this.isTransformChild = false;
        this.renderFactory = this.locator.getService('rendererFactory');
        updateDropDownLocale(this.parent);
        this.renderFactory.addRenderer(RenderType.Toolbar, new ToolbarRenderer(this.parent));
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        this.baseToolbar = new BaseToolbar(this.parent, this.locator);
        this.addEventListener();
        if (this.parent.toolbarSettings && Object.keys(this.parent.toolbarSettings.itemConfigs).length > 0) {
            extend(this.tools, tools, toObjectLowerCase(this.parent.toolbarSettings.itemConfigs), true);
        }
        else {
            this.tools = tools;
        }
    }
    initializeInstance() {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.editableElement = this.contentRenderer.getEditPanel();
        this.editPanel = this.contentRenderer.getPanel();
    }
    toolbarBindEvent() {
        if (!this.parent.inlineMode.enable) {
            this.keyBoardModule = new KeyboardEvents(this.getToolbarElement(), {
                keyAction: this.toolBarKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
            });
        }
    }
    toolBarKeyDown(e) {
        switch (e.action) {
            case 'escape':
                this.parent.contentModule.getEditPanel().focus();
                break;
        }
    }
    createToolbarElement() {
        this.tbElement = this.parent.createElement('div', { id: this.parent.getID() + '_toolbar' });
        if (!Browser.isDevice && this.parent.inlineMode.enable && isIDevice()) {
            return;
        }
        else {
            if (this.parent.toolbarSettings.enableFloating && !this.parent.inlineMode.enable) {
                this.tbWrapper = this.parent.createElement('div', {
                    id: this.parent.getID() + '_toolbar_wrapper',
                    innerHTML: this.tbElement.outerHTML,
                    className: CLS_TB_WRAP
                });
                this.tbElement = this.tbWrapper.firstElementChild;
                this.parent.element.insertBefore(this.tbWrapper, this.editPanel);
            }
            else {
                this.parent.element.insertBefore(this.tbElement, this.editPanel);
            }
        }
    }
    getToolbarMode() {
        let tbMode;
        switch (this.parent.toolbarSettings.type) {
            case ToolbarType.Expand:
                tbMode = 'Extended';
                break;
            default:
                tbMode = 'MultiRow';
        }
        return tbMode;
    }
    checkToolbarResponsive(ele) {
        if (!Browser.isDevice || isIDevice()) {
            return false;
        }
        this.baseToolbar.render({
            container: ((this.parent.inlineMode.enable) ? 'quick' : 'toolbar'),
            items: this.parent.toolbarSettings.items,
            mode: 'MultiRow',
            target: ele
        });
        addClass([ele], ['e-rte-tb-mobile']);
        if (this.parent.inlineMode.enable) {
            this.addFixedTBarClass();
        }
        else {
            addClass([ele], [CLS_TB_STATIC]);
        }
        this.wireEvents();
        this.dropDownModule.renderDropDowns({
            container: ele,
            containerType: ((this.parent.inlineMode.enable) ? 'quick' : 'toolbar'),
            items: this.parent.toolbarSettings.items
        });
        this.parent.notify(renderColorPicker, {
            container: this.tbElement,
            containerType: ((this.parent.inlineMode.enable) ? 'quick' : 'toolbar'),
            items: this.parent.toolbarSettings.items
        });
        return true;
    }
    checkIsTransformChild() {
        this.isTransformChild = false;
        let transformElements = selectAll('[style*="transform"]', document);
        for (let i = 0; i < transformElements.length; i++) {
            if (!isNullOrUndefined(transformElements[i].contains) && transformElements[i].contains(this.parent.element)) {
                this.isTransformChild = true;
                break;
            }
        }
    }
    toggleFloatClass(e) {
        let topValue;
        let isBody = false;
        let isFloat = false;
        let scrollParent;
        let floatOffset = this.parent.floatingToolbarOffset;
        if (e && this.parent.iframeSettings.enable && this.parent.inputElement.ownerDocument === e.target) {
            scrollParent = e.target.body;
        }
        else if (e && e.target !== document) {
            scrollParent = e.target;
        }
        else {
            isBody = true;
            scrollParent = document.body;
        }
        let tbHeight = this.getToolbarHeight() + this.getExpandTBarPopHeight();
        if (this.isTransformChild) {
            topValue = 0;
            let scrollParentRelativeTop = 0;
            let trgHeight = this.parent.element.offsetHeight;
            if (isBody) {
                let bodyStyle = window.getComputedStyle(scrollParent);
                scrollParentRelativeTop = parseFloat(bodyStyle.marginTop.split('px')[0]) + parseFloat(bodyStyle.paddingTop.split('px')[0]);
            }
            let targetTop = this.parent.element.getBoundingClientRect().top;
            let scrollParentYOffset = (Browser.isMSPointer && isBody) ? window.pageYOffset : scrollParent.parentElement.scrollTop;
            let scrollParentRect = scrollParent.getBoundingClientRect();
            let scrollParentTop = (!isBody) ? scrollParentRect.top : (scrollParentRect.top + scrollParentYOffset);
            let outOfRange = ((targetTop - ((!isBody) ? scrollParentTop : 0)) + trgHeight > tbHeight + floatOffset) ? false : true;
            if (targetTop > (scrollParentTop + floatOffset) || targetTop < -trgHeight || ((targetTop < 0) ? outOfRange : false)) {
                isFloat = false;
                removeClass([this.tbElement], [CLS_TB_ABS_FLOAT]);
            }
            else if (targetTop < (scrollParentTop + floatOffset)) {
                if (targetTop < 0) {
                    topValue = (-targetTop) + scrollParentTop;
                }
                else {
                    topValue = scrollParentTop - targetTop;
                }
                topValue = (isBody) ? topValue - scrollParentRelativeTop : topValue;
                addClass([this.tbElement], [CLS_TB_ABS_FLOAT]);
                isFloat = true;
            }
        }
        else {
            let parent = this.parent.element.getBoundingClientRect();
            if (window.innerHeight < parent.top) {
                return;
            }
            topValue = (e && e.target !== document) ? scrollParent.getBoundingClientRect().top : 0;
            if ((parent.bottom < (floatOffset + tbHeight + topValue)) || parent.bottom < 0 || parent.top > floatOffset + topValue) {
                isFloat = false;
            }
            else if (parent.top < floatOffset) {
                isFloat = true;
            }
        }
        if (!isFloat) {
            removeClass([this.tbElement], [CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement, { top: 0 + 'px', width: '100%' });
        }
        else {
            addClass([this.tbElement], [CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement, { width: this.parent.element.offsetWidth + 'px', top: (floatOffset + topValue) + 'px' });
        }
    }
    renderToolbar() {
        this.initializeInstance();
        this.createToolbarElement();
        if (this.checkToolbarResponsive(this.tbElement)) {
            return;
        }
        if (this.parent.inlineMode.enable) {
            this.parent.notify(renderInlineToolbar, {});
        }
        else {
            this.baseToolbar.render({
                container: 'toolbar',
                items: this.parent.toolbarSettings.items,
                mode: this.getToolbarMode(),
                target: this.tbElement
            });
            if (!this.parent.inlineMode.enable) {
                if (this.parent.toolbarSettings.enableFloating) {
                    this.checkIsTransformChild();
                    this.toggleFloatClass();
                }
                if (this.parent.toolbarSettings.type === ToolbarType.Expand) {
                    addClass([this.parent.element], [CLS_RTE_EXPAND_TB]);
                }
            }
        }
        this.wireEvents();
        if (this.parent.inlineMode.enable && !isIDevice()) {
            this.addFixedTBarClass();
        }
        if (!this.parent.inlineMode.enable) {
            this.dropDownModule.renderDropDowns({
                container: this.tbElement,
                containerType: 'toolbar',
                items: this.parent.toolbarSettings.items
            });
            this.parent.notify(renderColorPicker, {
                container: this.tbElement,
                containerType: 'toolbar',
                items: this.parent.toolbarSettings.items
            });
            this.refreshToolbarOverflow();
        }
        let divEle = this.parent.element.querySelector('.e-rte-srctextarea');
        let iframeEle = this.parent.element.querySelector('.e-source-content');
        if ((!this.parent.iframeSettings.enable && (!isNullOrUndefined(divEle) && divEle.style.display === 'block')) ||
            (this.parent.iframeSettings.enable && (!isNullOrUndefined(iframeEle) && iframeEle.style.display === 'block'))) {
            this.parent.notify(updateToolbarItem, {
                targetItem: 'SourceCode', updateItem: 'Preview',
                baseToolbar: this.parent.getBaseToolbarObject()
            });
            this.parent.disableToolbarItem(this.parent.toolbarSettings.items);
        }
    }
    addFixedTBarClass() {
        addClass([this.tbElement], [CLS_TB_FIXED]);
    }
    removeFixedTBarClass() {
        removeClass([this.tbElement], [CLS_TB_FIXED]);
    }
    showFixedTBar() {
        addClass([this.tbElement], [CLS_SHOW]);
        if (Browser.isIos) {
            addClass([this.tbElement], [CLS_TB_IOS_FIX]);
        }
    }
    hideFixedTBar() {
        (!this.isToolbar) ? removeClass([this.tbElement], [CLS_SHOW, CLS_TB_IOS_FIX]) : this.isToolbar = false;
    }
    updateItem(args) {
        let item = this.tools[args.updateItem.toLocaleLowerCase()];
        let trgItem = this.tools[args.targetItem.toLocaleLowerCase()];
        let index = getTBarItemsIndex(getCollection(trgItem.subCommand), args.baseToolbar.toolbarObj.items)[0];
        if (!isNullOrUndefined(index)) {
            let prefixId = this.parent.inlineMode.enable ? '_quick_' : '_toolbar_';
            args.baseToolbar.toolbarObj.items[index].id = this.parent.getID() + prefixId + item.id;
            args.baseToolbar.toolbarObj.items[index].prefixIcon = item.icon;
            args.baseToolbar.toolbarObj.items[index].tooltipText = item.tooltip;
            args.baseToolbar.toolbarObj.items[index].subCommand = item.subCommand;
            args.baseToolbar.toolbarObj.dataBind();
        }
        else {
            this.addTBarItem(args, 0);
        }
    }
    updateToolbarStatus(args) {
        if (!this.tbElement || (this.parent.inlineMode.enable && (isIDevice() || !Browser.isDevice))) {
            return;
        }
        let options = {
            args: args,
            dropDownModule: this.dropDownModule,
            parent: this.parent,
            tbElements: selectAll('.' + CLS_TB_ITEM, this.tbElement),
            tbItems: this.baseToolbar.toolbarObj.items
        };
        setToolbarStatus(options, (this.parent.inlineMode.enable ? true : false));
    }
    fullScreen(e) {
        this.parent.fullScreenModule.showFullScreen(e);
    }
    hideScreen(e) {
        this.parent.fullScreenModule.hideFullScreen(e);
    }
    getBaseToolbar() {
        return this.baseToolbar;
    }
    addTBarItem(args, index) {
        args.baseToolbar.toolbarObj.addItems([args.baseToolbar.getObject(args.updateItem, 'toolbar')], index);
    }
    enableTBarItems(baseToolbar, items, isEnable, muteToolbarUpdate) {
        let trgItems = getTBarItemsIndex(getCollection(items), baseToolbar.toolbarObj.items);
        this.tbItems = selectAll('.' + CLS_TB_ITEM, baseToolbar.toolbarObj.element);
        for (let i = 0; i < trgItems.length; i++) {
            let item = this.tbItems[trgItems[i]];
            if (item) {
                baseToolbar.toolbarObj.enableItems(item, isEnable);
            }
        }
        if (!select('.e-rte-srctextarea', this.parent.element) && !muteToolbarUpdate) {
            updateUndoRedoStatus(baseToolbar, this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
    }
    removeTBarItems(items) {
        if (isNullOrUndefined(this.baseToolbar.toolbarObj)) {
            this.baseToolbar = this.parent.getBaseToolbarObject();
        }
        let trgItems = getTBarItemsIndex(getCollection(items), this.baseToolbar.toolbarObj.items);
        this.tbItems = (this.parent.inlineMode.enable) ? selectAll('.' + CLS_TB_ITEM, this.baseToolbar.toolbarObj.element)
            : selectAll('.' + CLS_TB_ITEM, this.parent.element);
        for (let i = 0; i < trgItems.length; i++) {
            this.baseToolbar.toolbarObj.removeItems(this.tbItems[trgItems[i]]);
        }
    }
    getExpandTBarPopHeight() {
        let popHeight = 0;
        if (this.parent.toolbarSettings.type === ToolbarType.Expand && this.tbElement.classList.contains('e-extended-toolbar')) {
            let expandPopup = select('.e-toolbar-extended', this.tbElement);
            if (expandPopup && this.tbElement.classList.contains('e-expand-open')
                || expandPopup && expandPopup.classList.contains('e-popup-open')) {
                addClass([expandPopup], [CLS_VISIBLE]);
                popHeight = popHeight + expandPopup.offsetHeight;
                removeClass([expandPopup], [CLS_VISIBLE]);
            }
            else {
                removeClass([this.tbElement], [CLS_EXPAND_OPEN]);
            }
        }
        return popHeight;
    }
    getToolbarHeight() {
        return this.tbElement.offsetHeight;
    }
    getToolbarElement() {
        return select('.' + CLS_TOOLBAR, this.parent.element);
    }
    refreshToolbarOverflow() {
        this.baseToolbar.toolbarObj.refreshOverflow();
    }
    isToolbarDestroyed() {
        return this.baseToolbar.toolbarObj && !this.baseToolbar.toolbarObj.isDestroyed;
    }
    destroyToolbar() {
        if (this.isToolbarDestroyed()) {
            this.parent.unWireScrollElementsEvents();
            this.unWireEvents();
            this.parent.notify(destroyColorPicker, {});
            this.dropDownModule.destroyDropDowns();
            this.baseToolbar.toolbarObj.destroy();
            this.removeEventListener();
            removeClass([this.parent.element], [CLS_RTE_EXPAND_TB]);
            let tbWrapper = select('.' + CLS_TB_WRAP, this.parent.element);
            let tbElement = select('.' + CLS_TOOLBAR, this.parent.element);
            if (!isNullOrUndefined(tbWrapper)) {
                detach(tbWrapper);
            }
            else if (!isNullOrUndefined(tbElement)) {
                detach(tbElement);
            }
        }
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        if (this.isToolbarDestroyed()) {
            this.destroyToolbar();
            if (this.keyBoardModule) {
                this.keyBoardModule.destroy();
            }
        }
    }
    scrollHandler(e) {
        if (!this.parent.inlineMode.enable) {
            if (this.parent.toolbarSettings.enableFloating && this.getDOMVisibility(this.tbElement)) {
                this.toggleFloatClass(e.args);
            }
        }
    }
    getDOMVisibility(el) {
        if (!el.offsetParent && el.offsetWidth === 0 && el.offsetHeight === 0) {
            return false;
        }
        return true;
    }
    mouseDownHandler() {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.showFixedTBar();
        }
    }
    focusChangeHandler() {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.isToolbar = false;
            this.hideFixedTBar();
        }
    }
    dropDownBeforeOpenHandler() {
        this.isToolbar = true;
    }
    toolbarMouseDownHandler(e) {
        let trg = closest(e.target, '.e-hor-nav');
        if (trg && this.parent.toolbarSettings.type === ToolbarType.Expand && !isNullOrUndefined(trg)) {
            if (!trg.classList.contains('e-nav-active')) {
                removeClass([this.tbElement], [CLS_EXPAND_OPEN]);
                this.parent.setContentHeight('toolbar', false);
            }
            else {
                addClass([this.tbElement], [CLS_EXPAND_OPEN]);
                this.parent.setContentHeight('toolbar', true);
            }
        }
        else if (Browser.isDevice || this.parent.inlineMode.enable) {
            this.isToolbar = true;
        }
        if (isNullOrUndefined(trg) && this.parent.toolbarSettings.type === ToolbarType.Expand) {
            removeClass([this.tbElement], [CLS_EXPAND_OPEN]);
        }
    }
    wireEvents() {
        if (this.parent.inlineMode.enable && isIDevice()) {
            return;
        }
        EventHandler.add(this.tbElement, 'click mousedown', this.toolbarMouseDownHandler, this);
    }
    unWireEvents() {
        EventHandler.remove(this.tbElement, 'click mousedown', this.toolbarMouseDownHandler);
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.dropDownModule = new DropDownButtons(this.parent, this.locator);
        this.toolbarActionModule = new ToolbarAction(this.parent);
        this.parent.on(initialEnd, this.renderToolbar, this);
        this.parent.on(scroll, this.scrollHandler, this);
        this.parent.on(bindOnEnd, this.toolbarBindEvent, this);
        this.parent.on(toolbarUpdated, this.updateToolbarStatus, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(refreshBegin, this.onRefresh, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(enableFullScreen, this.fullScreen, this);
        this.parent.on(disableFullScreen, this.hideScreen, this);
        this.parent.on(updateToolbarItem, this.updateItem, this);
        this.parent.on(beforeDropDownOpen, this.dropDownBeforeOpenHandler, this);
        this.parent.on(expandPopupClick, this.parent.setContentHeight, this.parent);
        this.parent.on(focusChange, this.focusChangeHandler, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(sourceCodeMouseDown, this.mouseDownHandler, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialEnd, this.renderToolbar);
        this.parent.off(scroll, this.scrollHandler);
        this.parent.off(bindOnEnd, this.toolbarBindEvent);
        this.parent.off(toolbarUpdated, this.updateToolbarStatus);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(destroy, this.destroy);
        this.parent.off(enableFullScreen, this.parent.fullScreenModule.showFullScreen);
        this.parent.off(disableFullScreen, this.parent.fullScreenModule.hideFullScreen);
        this.parent.off(updateToolbarItem, this.updateItem);
        this.parent.off(beforeDropDownOpen, this.dropDownBeforeOpenHandler);
        this.parent.off(expandPopupClick, this.parent.setContentHeight);
        this.parent.off(focusChange, this.focusChangeHandler);
        this.parent.off(mouseDown, this.mouseDownHandler);
        this.parent.off(sourceCodeMouseDown, this.mouseDownHandler);
    }
    onRefresh() {
        this.refreshToolbarOverflow();
        this.parent.setContentHeight('', true);
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(e) {
        if (!isNullOrUndefined(e.newProp.inlineMode)) {
            for (let prop of Object.keys(e.newProp.inlineMode)) {
                switch (prop) {
                    case 'enable':
                        this.refreshToolbar();
                        break;
                }
            }
        }
        if (e.module !== this.getModuleName()) {
            return;
        }
        this.refreshToolbar();
    }
    refreshToolbar() {
        if (isNullOrUndefined(this.baseToolbar.toolbarObj)) {
            this.baseToolbar = this.parent.getBaseToolbarObject();
        }
        let tbWrapper = select('.' + CLS_TB_WRAP, this.parent.element);
        let tbElement = select('.' + CLS_TOOLBAR, this.parent.element);
        if (tbElement || tbWrapper) {
            this.destroyToolbar();
        }
        if (this.parent.toolbarSettings.enable) {
            this.addEventListener();
            this.renderToolbar();
            this.parent.wireScrollElementsEvents();
            if (!select('.e-rte-srctextarea', this.parent.element)) {
                updateUndoRedoStatus(this.baseToolbar, this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
            }
        }
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'toolbar';
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KeyboardEvents_1;
let keyCode = {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'control': 17,
    'alt': 18,
    'pause': 19,
    'capslock': 20,
    'space': 32,
    'escape': 27,
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36,
    'leftarrow': 37,
    'uparrow': 38,
    'rightarrow': 39,
    'downarrow': 40,
    'insert': 45,
    'delete': 46,
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    'semicolon': 186,
    'plus': 187,
    'comma': 188,
    'minus': 189,
    'dot': 190,
    'forwardslash': 191,
    'graveaccent': 192,
    'openbracket': 219,
    'backslash': 220,
    'closebracket': 221,
    'singlequote': 222,
    ']': 221,
    '[': 219,
    '=': 187
};
/**
 * KeyboardEvents class enables you to bind key action desired key combinations for ex., Ctrl+A, Delete, Alt+Space etc.
 * ```html
 * <div id='testEle'>  </div>;
 * <script>
 *   let node: HTMLElement = document.querySelector('#testEle');
 *   let kbInstance = new KeyboardEvents({
 *       element: node,
 *       keyConfigs:{ selectAll : 'ctrl+a' },
 *       keyAction: function (e:KeyboardEvent, action:string) {
 *           // handler function code
 *       }
 *   });
 * </script>
 * ```
 * @hidden
 */
let KeyboardEvents$1 = KeyboardEvents_1 = class KeyboardEvents$$1 extends Base {
    /**
     * Initializes the KeyboardEvents
     * @param {HTMLElement} element
     * @param {KeyboardEventsModel} options
     */
    constructor(element, options) {
        super(options, element);
        /**
         * To handle a key press event returns null
         */
        this.keyPressHandler = (e) => {
            let isAltKey = e.altKey;
            let isCtrlKey = e.ctrlKey;
            let isShiftKey = e.shiftKey;
            let curkeyCode = e.which;
            let keys = Object.keys(this.keyConfigs);
            for (let key of keys) {
                let configCollection = this.keyConfigs[key].split(',');
                for (let rconfig of configCollection) {
                    let rKeyObj = KeyboardEvents_1.getKeyConfigData(rconfig.trim());
                    if (isAltKey === rKeyObj.altKey && isCtrlKey === rKeyObj.ctrlKey &&
                        isShiftKey === rKeyObj.shiftKey && curkeyCode === rKeyObj.keyCode) {
                        e.action = key;
                    }
                }
            }
            if (this.keyAction) {
                this.keyAction(e);
            }
        };
        this.bind();
    }
    /**
     * Unwire bound events and destroy the instance.
     * @return {void}
     */
    destroy() {
        this.unwireEvents();
        super.destroy();
    }
    /**
     * Function can be used to specify certain action if a property is changed
     * @param newProp
     * @param oldProp
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        // No code are needed
    }
    ;
    bind() {
        this.wireEvents();
    }
    /**
     * To get the module name, returns 'keyboard'.
     * @private
     */
    getModuleName() {
        return 'keyboard';
    }
    /**
     * Wiring event handlers to events
     */
    wireEvents() {
        this.element.addEventListener(this.eventName, this.keyPressHandler);
    }
    /**
     * Unwiring event handlers to events
     */
    unwireEvents() {
        this.element.removeEventListener(this.eventName, this.keyPressHandler);
    }
    /**
     * To get the key configuration data
     * @param {string} config - configuration data
     * returns {KeyData}
     */
    static getKeyConfigData(config) {
        if (config in this.configCache) {
            return this.configCache[config];
        }
        let keys = config.toLowerCase().split('+');
        let keyData = {
            altKey: (keys.indexOf('alt') !== -1 ? true : false),
            ctrlKey: (keys.indexOf('ctrl') !== -1 ? true : false),
            shiftKey: (keys.indexOf('shift') !== -1 ? true : false),
            keyCode: null
        };
        if (keys[keys.length - 1].length > 1 && !!Number(keys[keys.length - 1])) {
            keyData.keyCode = Number(keys[keys.length - 1]);
        }
        else {
            keyData.keyCode = KeyboardEvents_1.getKeyCode(keys[keys.length - 1]);
        }
        KeyboardEvents_1.configCache[config] = keyData;
        return keyData;
    }
    // Return the keycode value as string 
    static getKeyCode(keyVal) {
        return keyCode[keyVal] || keyVal.toUpperCase().charCodeAt(0);
    }
};
KeyboardEvents$1.configCache = {};
__decorate([
    Property({})
], KeyboardEvents$1.prototype, "keyConfigs", void 0);
__decorate([
    Property('keyup')
], KeyboardEvents$1.prototype, "eventName", void 0);
__decorate([
    Event()
], KeyboardEvents$1.prototype, "keyAction", void 0);
KeyboardEvents$1 = KeyboardEvents_1 = __decorate([
    NotifyPropertyChanges
], KeyboardEvents$1);

/**
 * `Color Picker` module is used to handle ColorPicker actions.
 */
class ColorPickerInput {
    constructor(parent, serviceLocator) {
        this.tools = {};
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
        if (this.parent.toolbarSettings && Object.keys(this.parent.toolbarSettings.itemConfigs).length > 0) {
            extend(this.tools, tools, toObjectLowerCase(this.parent.toolbarSettings.itemConfigs), true);
        }
        else {
            this.tools = tools;
        }
    }
    initializeInstance() {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
    }
    renderColorPickerInput(args) {
        this.initializeInstance();
        let suffixID = args.containerType;
        let tbElement = args.container;
        let targetID;
        let options;
        templateItems.forEach((item) => {
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                    case 'fontcolor':
                        targetID = this.parent.getID() + '_' + suffixID + '_FontColor_Target';
                        let fontNode = this.parent.createElement('input');
                        fontNode.id = targetID;
                        fontNode.classList.add(CLS_FONT_COLOR_TARGET);
                        document.body.appendChild(fontNode);
                        options = {
                            cssClass: this.tools[item.toLocaleLowerCase()].icon
                                + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_ICONS,
                            value: this.tools[item.toLocaleLowerCase()].value,
                            command: this.tools[item.toLocaleLowerCase()].command,
                            subCommand: this.tools[item.toLocaleLowerCase()].subCommand,
                            element: select('#' + this.parent.getID() + '_' + suffixID + '_FontColor', tbElement),
                            target: ('#' + targetID)
                        };
                        this.fontColorPicker = this.toolbarRenderer.renderColorPicker(options, 'fontcolor');
                        this.fontColorDropDown = this.toolbarRenderer.renderColorPickerDropDown(options, 'fontcolor', this.fontColorPicker);
                        break;
                    case 'backgroundcolor':
                        targetID = this.parent.getID() + '_' + suffixID + '_BackgroundColor_Target';
                        let backNode = this.parent.createElement('input');
                        backNode.id = targetID;
                        backNode.classList.add(CLS_BACKGROUND_COLOR_TARGET);
                        document.body.appendChild(backNode);
                        options = {
                            cssClass: this.tools[item.toLocaleLowerCase()].icon
                                + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_ICONS,
                            value: this.tools[item.toLocaleLowerCase()].value,
                            command: this.tools[item.toLocaleLowerCase()].command,
                            subCommand: this.tools[item.toLocaleLowerCase()].subCommand,
                            element: select('#' + this.parent.getID() + '_' + suffixID + '_BackgroundColor', tbElement),
                            target: ('#' + targetID)
                        };
                        this.backgroundColorPicker = this.toolbarRenderer.renderColorPicker(options, 'backgroundcolor');
                        this.backgroundColorDropDown = this.toolbarRenderer.renderColorPickerDropDown(options, 'backgroundcolor', this.backgroundColorPicker);
                        break;
                }
            }
        });
    }
    destroy() {
        this.removeEventListener();
        this.destroyColorPicker();
    }
    destroyColorPicker() {
        if (this.fontColorPicker && !this.fontColorPicker.isDestroyed) {
            this.fontColorPicker.destroy();
        }
        if (this.backgroundColorPicker && !this.backgroundColorPicker.isDestroyed) {
            this.backgroundColorPicker.destroy();
        }
        if (this.fontColorDropDown && !this.fontColorDropDown.isDestroyed) {
            let innerEle = this.fontColorDropDown.element.querySelector('.e-rte-color-content');
            if (innerEle) {
                detach(innerEle);
            }
            this.fontColorDropDown.destroy();
        }
        if (this.backgroundColorDropDown && !this.backgroundColorDropDown.isDestroyed) {
            let innerEle = this.backgroundColorDropDown.element.querySelector('.e-rte-color-content');
            if (innerEle) {
                detach(innerEle);
            }
            this.backgroundColorDropDown.destroy();
        }
    }
    setRtl(args) {
        if (this.fontColorPicker) {
            this.fontColorPicker.setProperties({ enableRtl: args.enableRtl });
            this.fontColorDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.backgroundColorPicker) {
            this.backgroundColorPicker.setProperties({ enableRtl: args.enableRtl });
            this.backgroundColorDropDown.setProperties({ enableRtl: args.enableRtl });
        }
    }
    addEventListener() {
        this.parent.on(toolbarRenderComplete, this.renderColorPickerInput, this);
        this.parent.on(rtlMode, this.setRtl, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(destroyColorPicker, this.destroyColorPicker, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
    }
    onPropertyChanged(model) {
        let newProp = model.newProp;
        let element;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'fontColor':
                    if (this.fontColorPicker) {
                        for (let font of Object.keys(newProp.fontColor)) {
                            switch (font) {
                                case 'default':
                                    this.fontColorPicker.setProperties({ value: newProp.fontColor.default });
                                    element = this.fontColorDropDown.element;
                                    let fontBorder = element.querySelector('.' + this.tools['fontcolor'].icon);
                                    fontBorder.style.borderBottomColor = newProp.fontColor.default;
                                    break;
                                case 'mode':
                                    this.fontColorPicker.setProperties({ mode: newProp.fontColor.mode });
                                    break;
                                case 'columns':
                                    this.fontColorPicker.setProperties({ columns: newProp.fontColor.columns });
                                    break;
                                case 'colorCode':
                                    this.fontColorPicker.setProperties({ presetColors: newProp.fontColor.colorCode });
                                    break;
                                case 'modeSwitcher':
                                    this.fontColorPicker.setProperties({ modeSwitcher: newProp.fontColor.modeSwitcher });
                                    break;
                            }
                        }
                    }
                    break;
                case 'backgroundColor':
                    if (this.backgroundColorPicker) {
                        for (let background of Object.keys(newProp.backgroundColor)) {
                            switch (background) {
                                case 'default':
                                    this.backgroundColorPicker.setProperties({ value: newProp.backgroundColor.default });
                                    element = this.backgroundColorDropDown.element;
                                    let backgroundBorder = element.querySelector('.' + this.tools['backgroundcolor'].icon);
                                    backgroundBorder.style.borderBottomColor = newProp.backgroundColor.default;
                                    break;
                                case 'mode':
                                    this.backgroundColorPicker.setProperties({ mode: newProp.backgroundColor.mode });
                                    break;
                                case 'columns':
                                    this.backgroundColorPicker.setProperties({ columns: newProp.backgroundColor.columns });
                                    break;
                                case 'colorCode':
                                    this.backgroundColorPicker.setProperties({ presetColors: newProp.backgroundColor.colorCode });
                                    break;
                                case 'modeSwitcher':
                                    this.backgroundColorPicker.setProperties({ modeSwitcher: newProp.backgroundColor.modeSwitcher });
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
    }
    removeEventListener() {
        this.parent.off(toolbarRenderComplete, this.renderColorPickerInput);
        this.parent.off(destroy, this.destroy);
        this.parent.off(rtlMode, this.setRtl);
        this.parent.off(destroyColorPicker, this.destroyColorPicker);
        this.parent.off(modelChanged, this.onPropertyChanged);
    }
}

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
class BaseQuickToolbar {
    constructor(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.isDOMElement = false;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.popupRenderer = this.renderFactory.getRenderer(RenderType.Popup);
        this.dropDownButtons = new DropDownButtons(this.parent, this.locator);
        this.colorPickerObj = new ColorPickerInput(this.parent, this.locator);
    }
    appendPopupContent() {
        this.toolbarElement = this.parent.createElement('div', { className: CLS_QUICK_TB });
        this.element.appendChild(this.toolbarElement);
    }
    render(args) {
        let className;
        if (args.popupType === 'Image') {
            className = CLS_IMAGE_POP;
        }
        else if (args.popupType === 'Inline') {
            className = CLS_INLINE_POP;
        }
        else {
            className = '';
        }
        let popupId = getUniqueID(args.popupType + '_Quick_Popup');
        this.stringItems = args.toolbarItems;
        this.element = this.parent.createElement('div', { id: popupId, className: className + ' ' + CLS_RTE_ELEMENTS });
        this.element.setAttribute('aria-owns', this.parent.getID());
        this.appendPopupContent();
        this.createToolbar(args.toolbarItems, args.mode);
        this.popupRenderer.renderPopup(this);
        this.addEventListener();
    }
    createToolbar(items, mode) {
        this.quickTBarObj = new BaseToolbar(this.parent, this.locator);
        this.quickTBarObj.render({
            container: 'quick',
            target: this.toolbarElement,
            items: items,
            mode: mode
        });
        this.quickTBarObj.toolbarObj.refresh();
    }
    setPosition(e) {
        let x;
        let y;
        let imgWrapper = closest(e.target, '.e-img-caption');
        let target = !isNullOrUndefined(imgWrapper) ? imgWrapper : e.target;
        addClass([this.toolbarElement], [CLS_RM_WHITE_SPACE]);
        let targetOffsetTop = target.offsetTop;
        let parentOffsetTop = window.pageYOffset + e.parentData.top;
        if ((targetOffsetTop - e.editTop) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) - e.popHeight - 5;
        }
        else if (((e.editTop + e.editHeight) - (targetOffsetTop + target.offsetHeight)) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) + target.offsetHeight + 5;
        }
        else {
            y = e.y;
        }
        if (target.offsetWidth > e.popWidth) {
            x = (target.offsetWidth / 2) - (e.popWidth / 2) + e.parentData.left + target.offsetLeft;
        }
        else {
            x = e.parentData.left + target.offsetLeft;
        }
        this.popupObj.position.X = ((x + e.popWidth) > e.parentData.right) ? e.parentData.right - e.popWidth : x;
        this.popupObj.position.Y = y;
        this.popupObj.dataBind();
        removeClass([this.toolbarElement], [CLS_RM_WHITE_SPACE]);
    }
    checkCollision(e, viewPort, type) {
        let x;
        let y;
        let parentTop = e.parentData.top;
        let contentTop = e.windowY + parentTop + e.tBarElementHeight;
        let collision = [];
        if (viewPort === 'document') {
            collision = isCollide(e.popup);
        }
        else {
            collision = isCollide(e.popup, e.parentElement);
        }
        for (let i = 0; i < collision.length; i++) {
            switch (collision[i]) {
                case 'top':
                    if (viewPort === 'document') {
                        y = e.windowY;
                    }
                    else {
                        y = (window.pageYOffset + parentTop) + e.tBarElementHeight;
                    }
                    break;
                case 'bottom':
                    let posY;
                    if (viewPort === 'document') {
                        if (type === 'inline') {
                            posY = (e.y - e.popHeight - 10);
                        }
                        else {
                            if ((e.windowHeight - (parentTop + e.tBarElementHeight)) > e.popHeight) {
                                if ((contentTop - e.windowHeight) > e.popHeight) {
                                    posY = (contentTop + (e.windowHeight - parentTop)) - e.popHeight;
                                }
                                else {
                                    posY = contentTop;
                                }
                            }
                            else {
                                posY = e.windowY + (parentTop + e.tBarElementHeight);
                            }
                        }
                    }
                    else {
                        if (e.target.tagName !== 'IMG') {
                            posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 10;
                        }
                        else {
                            posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 5;
                        }
                    }
                    y = posY;
                    break;
                case 'right':
                    if (type === 'inline') {
                        x = e.windowWidth - (e.popWidth + e.bodyRightSpace + 10);
                    }
                    else {
                        x = e.x - e.popWidth;
                    }
                    break;
                case 'left':
                    if (type === 'inline') {
                        x = 0;
                    }
                    else {
                        x = e.parentData.left;
                    }
                    break;
            }
        }
        this.popupObj.position.X = (x) ? x : this.popupObj.position.X;
        this.popupObj.position.Y = (y) ? y : this.popupObj.position.Y;
        this.popupObj.dataBind();
    }
    showPopup(x, y, target) {
        let eventArgs = isBlazor() ? { cancel: false, targetElement: target } :
            { popup: this.popupObj, cancel: false, targetElement: target };
        this.parent.trigger(beforeQuickToolbarOpen, eventArgs, (beforeQuickToolbarArgs) => {
            if (!beforeQuickToolbarArgs.cancel) {
                let editPanelTop;
                let editPanelHeight;
                let bodyStyle = window.getComputedStyle(document.body);
                let bodyRight = parseFloat(bodyStyle.marginRight.split('px')[0]) + parseFloat(bodyStyle.paddingRight.split('px')[0]);
                let windowHeight = window.innerHeight;
                let windowWidth = window.innerWidth;
                let parent = this.parent.element;
                let toolbarAvail = !isNullOrUndefined(this.parent.getToolbar());
                let tbHeight = toolbarAvail && this.parent.toolbarModule.getToolbarHeight();
                let expTBHeight = toolbarAvail && this.parent.toolbarModule.getExpandTBarPopHeight();
                let tBarHeight = (toolbarAvail) ? (tbHeight + expTBHeight) : 0;
                addClass([this.element], [CLS_HIDE]);
                if (Browser.isDevice && !isIDevice()) {
                    addClass([this.parent.getToolbar()], [CLS_HIDE]);
                }
                if (this.parent.iframeSettings.enable) {
                    let cntEle = this.contentRenderer.getPanel().contentWindow;
                    editPanelTop = cntEle.pageYOffset;
                    editPanelHeight = cntEle.innerHeight;
                }
                else {
                    let cntEle = closest(target, '.' + CLS_RTE_CONTENT);
                    editPanelTop = (cntEle) ? cntEle.scrollTop : 0;
                    editPanelHeight = (cntEle) ? cntEle.offsetHeight : 0;
                }
                if (!this.parent.inlineMode.enable && !closest(target, 'table')) {
                    this.parent.disableToolbarItem(this.parent.toolbarSettings.items);
                    this.parent.enableToolbarItem(['Undo', 'Redo']);
                }
                append([this.element], document.body);
                this.popupObj.position.X = x + 20;
                this.popupObj.position.Y = y + ((this.parent.iframeSettings.enable) ? 35 : 20);
                this.popupObj.dataBind();
                this.popupObj.element.classList.add('e-popup-open');
                this.dropDownButtons.renderDropDowns({
                    container: this.toolbarElement,
                    containerType: 'quick',
                    items: this.stringItems
                });
                this.colorPickerObj.renderColorPickerInput({
                    container: this.toolbarElement,
                    containerType: 'quick',
                    items: this.stringItems
                });
                let showPopupData = {
                    x: x, y: y,
                    target: target,
                    editTop: editPanelTop,
                    editHeight: editPanelHeight,
                    popup: this.popupObj.element,
                    popHeight: this.popupObj.element.offsetHeight,
                    popWidth: this.popupObj.element.offsetWidth,
                    parentElement: parent,
                    bodyRightSpace: bodyRight,
                    windowY: window.pageYOffset,
                    windowHeight: windowHeight,
                    windowWidth: windowWidth,
                    parentData: parent.getBoundingClientRect(),
                    tBarElementHeight: tBarHeight
                };
                if (target.tagName === 'IMG') {
                    this.setPosition(showPopupData);
                }
                if (!this.parent.inlineMode.enable) {
                    this.checkCollision(showPopupData, 'parent', '');
                }
                this.checkCollision(showPopupData, 'document', ((this.parent.inlineMode.enable) ? 'inline' : ''));
                this.popupObj.element.classList.remove('e-popup-open');
                removeClass([this.element], [CLS_HIDE]);
                this.popupObj.show({ name: 'ZoomIn', duration: (Browser.isIE ? 250 : 400) });
                setStyleAttribute(this.element, {
                    maxWidth: this.parent.element.offsetWidth + 'px'
                });
                addClass([this.element], [CLS_POP]);
                this.isDOMElement = true;
            }
        });
    }
    hidePopup() {
        let viewSourcePanel = this.parent.sourceCodeModule.getViewPanel();
        if (Browser.isDevice && !isIDevice()) {
            removeClass([this.parent.getToolbar()], [CLS_HIDE]);
        }
        if (!isNullOrUndefined(this.parent.getToolbar()) && !this.parent.inlineMode.enable) {
            if (isNullOrUndefined(viewSourcePanel) || viewSourcePanel.style.display === 'none') {
                this.parent.enableToolbarItem(this.parent.toolbarSettings.items);
            }
        }
        this.removeEleFromDOM();
        this.isDOMElement = false;
    }
    /**
     * @hidden
     */
    addQTBarItem(item, index) {
        this.quickTBarObj.toolbarObj.addItems(this.quickTBarObj.getItems(item, 'toolbar'), index);
    }
    /**
     * @hidden
     */
    removeQTBarItem(index) {
        this.quickTBarObj.toolbarObj.removeItems(index);
    }
    removeEleFromDOM() {
        let element = this.popupObj.element;
        if (this.isDOMElement) {
            this.dropDownButtons.destroyDropDowns();
            this.colorPickerObj.destroyColorPicker();
            removeClass([this.element], [CLS_POP]);
            detach(element);
            let args = isBlazor() ? null : this.popupObj;
            this.parent.trigger(quickToolbarClose, args);
        }
    }
    updateStatus(args) {
        let options = {
            args: args,
            dropDownModule: this.dropDownButtons,
            parent: this.parent,
            tbElements: selectAll('.' + CLS_TB_ITEM, this.element),
            tbItems: this.quickTBarObj.toolbarObj.items
        };
        setToolbarStatus(options, true);
        if (!select('.e-rte-srctextarea', this.parent.element)) {
            updateUndoRedoStatus(this.parent.getBaseToolbarObject(), this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
    }
    /**
     * Destroys the Quick toolbar.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.popupObj.destroy();
            this.removeEleFromDOM();
        }
        this.removeEventListener();
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        if (this.parent.inlineMode.enable) {
            this.parent.on(toolbarUpdated, this.updateStatus, this);
        }
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(e) {
        if (!isNullOrUndefined(e.newProp.inlineMode)) {
            for (let prop of Object.keys(e.newProp.inlineMode)) {
                switch (prop) {
                    case 'enable':
                        if (e.newProp.inlineMode.enable) {
                            this.parent.on(toolbarUpdated, this.updateStatus, this);
                        }
                        else {
                            this.parent.off(toolbarUpdated, this.updateStatus);
                        }
                        break;
                }
            }
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(destroy, this.destroy);
        this.parent.off(modelChanged, this.onPropertyChanged);
        if (this.parent.inlineMode.enable) {
            this.parent.off(toolbarUpdated, this.updateStatus);
        }
    }
}

/**
 * `Popup renderer` module is used to render popup in RichTextEditor.
 * @hidden
 */
class PopupRenderer {
    /**
     * Constructor for popup renderer module
     */
    constructor(parent) {
        this.parent = parent;
    }
    quickToolbarOpen() {
        let args = isBlazor() ? null : this.popupObj;
        this.parent.trigger(quickToolbarOpen, args);
    }
    renderPopup(args) {
        this.setPanel(args.element);
        this.renderPanel();
        args.popupObj = new Popup(args.element, {
            targetType: 'relative',
            relateTo: this.parent.element,
            open: this.quickToolbarOpen.bind(this)
        });
        this.popupObj = args.popupObj;
        args.popupObj.hide();
    }
    /**
     * The function is used to add popup class in Quick Toolbar
     */
    renderPanel() {
        this.getPanel().classList.add(CLS_QUICK_POP);
    }
    /**
     * Get the popup element of RichTextEditor
     * @return {Element}
     */
    getPanel() {
        return this.popupPanel;
    }
    /**
     * Set the popup element of RichTextEditor
     * @param  {Element} panel
     */
    setPanel(panel) {
        this.popupPanel = panel;
    }
}

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
class QuickToolbar {
    constructor(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.renderFactory.addRenderer(RenderType.Popup, new PopupRenderer(this.parent));
        this.addEventListener();
    }
    formatItems(items) {
        let formattedItems = [];
        items.forEach((item) => {
            if (typeof item === 'string') {
                switch (item.toLocaleLowerCase()) {
                    case 'open':
                        formattedItems.push('openLink');
                        break;
                    case 'edit':
                        formattedItems.push('editLink');
                        break;
                    case 'unlink':
                        formattedItems.push('removeLink');
                        break;
                    default:
                        formattedItems.push(item);
                        break;
                }
            }
            else {
                formattedItems.push(item);
            }
        });
        return formattedItems;
    }
    getQTBarOptions(popType, mode, items, type) {
        return {
            popupType: popType,
            toolbarItems: items,
            mode: mode,
            renderType: type
        };
    }
    createQTBar(popupType, mode, items, type) {
        if (items.length < 1) {
            return null;
        }
        let qTBar = new BaseQuickToolbar(this.parent, this.locator);
        qTBar.render(this.getQTBarOptions(popupType, mode, this.formatItems(items), type));
        return qTBar;
    }
    initializeQuickToolbars() {
        this.parent.quickToolbarModule = this;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        if (this.parent.inlineMode.enable && this.parent.inlineMode.onSelection && isIDevice()) {
            EventHandler.add(this.contentRenderer.getDocument(), 'selectionchange', this.selectionChangeHandler, this);
        }
    }
    onMouseDown(e) {
        this.parent.isBlur = false;
        this.parent.isRTE = true;
    }
    renderQuickToolbars() {
        if (this.linkQTBar || this.imageQTBar || this.textQTBar || this.tableQTBar) {
            return;
        }
        this.linkQTBar = this.createQTBar('Link', 'Scrollable', this.parent.quickToolbarSettings.link, RenderType.LinkToolbar);
        this.renderFactory.addRenderer(RenderType.LinkToolbar, this.linkQTBar);
        this.textQTBar = this.createQTBar('Text', 'Scrollable', this.parent.quickToolbarSettings.text, RenderType.TextToolbar);
        this.renderFactory.addRenderer(RenderType.TextToolbar, this.textQTBar);
        this.imageQTBar = this.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        this.renderFactory.addRenderer(RenderType.ImageToolbar, this.imageQTBar);
        this.tableQTBar = this.createQTBar('Table', 'MultiRow', this.parent.quickToolbarSettings.table, RenderType.TableToolbar);
        this.renderFactory.addRenderer(RenderType.TableToolbar, this.tableQTBar);
        if (this.linkQTBar) {
            EventHandler.add(this.linkQTBar.element, 'mousedown', this.onMouseDown, this);
        }
        if (this.imageQTBar) {
            EventHandler.add(this.imageQTBar.element, 'mousedown', this.onMouseDown, this);
        }
        if (this.textQTBar) {
            EventHandler.add(this.textQTBar.element, 'mousedown', this.onMouseDown, this);
        }
        if (this.tableQTBar) {
            EventHandler.add(this.tableQTBar.element, 'mousedown', this.onMouseDown, this);
        }
    }
    renderInlineQuickToolbar() {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            addClass([this.parent.element], [CLS_INLINE]);
            this.inlineQTBar = this.createQTBar('Inline', 'MultiRow', this.parent.toolbarSettings.items, RenderType.InlineToolbar);
            this.renderFactory.addRenderer(RenderType.InlineToolbar, this.inlineQTBar);
            EventHandler.add(this.inlineQTBar.element, 'mousedown', this.onMouseDown, this);
        }
    }
    showInlineQTBar(x, y, target) {
        this.inlineQTBar.showPopup(x, y, target);
    }
    hideInlineQTBar() {
        if (this.inlineQTBar && !hasClass(this.inlineQTBar.element, 'e-popup-close')) {
            this.inlineQTBar.hidePopup();
        }
    }
    /**
     * Method for hidding the quick toolbar
     * @hidden
     */
    hideQuickToolbars() {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close') && document.body.contains(this.linkQTBar.element)) {
            this.linkQTBar.hidePopup();
        }
        if (this.textQTBar && !hasClass(this.textQTBar.element, 'e-popup-close') && document.body.contains(this.textQTBar.element)) {
            this.textQTBar.hidePopup();
        }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close') && document.body.contains(this.imageQTBar.element)) {
            this.imageQTBar.hidePopup();
        }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close') && document.body.contains(this.tableQTBar.element)) {
            this.tableQTBar.hidePopup();
        }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            this.hideInlineQTBar();
        }
    }
    deBounce(x, y, target) {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => { this.showInlineQTBar(x, y, target); }, 1000);
    }
    mouseUpHandler(e) {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            let coordinates;
            coordinates = e.args.touches ? e.args.changedTouches[0] : e.args;
            let range = this.parent.getRange();
            let target = e.args.target;
            if (isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
                if (isIDevice() && e.touchData && e.touchData.prevClientX !== e.touchData.clientX
                    && e.touchData.prevClientY !== e.touchData.clientY) {
                    return;
                }
                this.hideInlineQTBar();
                this.offsetX = coordinates.pageX;
                this.offsetY = pageYOffset(coordinates, this.parent.element, this.parent.iframeSettings.enable);
                if (target.nodeName === 'TEXTAREA') {
                    this.showInlineQTBar(this.offsetX, this.offsetY, target);
                }
                else {
                    let closestAnchor = closest(target, 'a');
                    target = closestAnchor ? closestAnchor : target;
                    if (target.tagName !== 'IMG' && target.tagName !== 'A' && (!closest(target, 'td,th') || !range.collapsed)) {
                        if (this.parent.inlineMode.onSelection && range.collapsed) {
                            return;
                        }
                        this.target = target;
                        this.showInlineQTBar(this.offsetX, this.offsetY, target);
                    }
                }
            }
        }
    }
    keyDownHandler() {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    }
    inlineQTBarMouseDownHandler() {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    }
    keyUpHandler(e) {
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            if (this.parent.inlineMode.onSelection) {
                return;
            }
            let args = e.args;
            this.deBounce(this.offsetX, this.offsetY, args.target);
        }
    }
    selectionChangeHandler(e) {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => { this.onSelectionChange(e); }, 1000);
    }
    onSelectionChange(e) {
        if (!isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
            return;
        }
        let selection = this.contentRenderer.getDocument().getSelection();
        if (!selection.isCollapsed) {
            this.mouseUpHandler({ args: e });
        }
    }
    getInlineBaseToolbar() {
        return this.inlineQTBar && this.inlineQTBar.quickTBarObj;
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        if (this.linkQTBar) {
            EventHandler.remove(this.linkQTBar.element, 'mousedown', this.onMouseDown);
            this.linkQTBar.destroy();
        }
        if (this.textQTBar) {
            EventHandler.remove(this.textQTBar.element, 'mousedown', this.onMouseDown);
            this.textQTBar.destroy();
        }
        if (this.imageQTBar) {
            EventHandler.remove(this.imageQTBar.element, 'mousedown', this.onMouseDown);
            this.imageQTBar.destroy();
        }
        if (this.tableQTBar) {
            EventHandler.remove(this.tableQTBar.element, 'mousedown', this.onMouseDown);
            this.tableQTBar.destroy();
        }
        if (this.inlineQTBar) {
            EventHandler.remove(this.inlineQTBar.element, 'mousedown', this.onMouseDown);
            if (isIDevice()) {
                EventHandler.remove(document, 'selectionchange', this.selectionChangeHandler);
            }
            this.inlineQTBar.destroy();
        }
        this.removeEventListener();
    }
    wireInlineQTBarEvents() {
        this.parent.on(mouseUp, this.mouseUpHandler, this);
        this.parent.on(mouseDown, this.inlineQTBarMouseDownHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(sourceCodeMouseDown, this.mouseUpHandler, this);
        this.parent.on(renderInlineToolbar, this.renderInlineQuickToolbar, this);
    }
    unWireInlineQTBarEvents() {
        this.parent.off(mouseUp, this.mouseUpHandler);
        this.parent.off(mouseDown, this.inlineQTBarMouseDownHandler);
        this.parent.off(keyDown, this.keyDownHandler);
        this.parent.off(keyUp, this.keyUpHandler);
        this.parent.off(sourceCodeMouseDown, this.mouseUpHandler);
        this.parent.off(renderInlineToolbar, this.renderInlineQuickToolbar);
    }
    toolbarUpdated(args) {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close')) {
            this.linkQTBar.hidePopup();
        }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
            this.imageQTBar.hidePopup();
        }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) {
            this.tableQTBar.hidePopup();
        }
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initialEnd, this.initializeQuickToolbars, this);
        this.parent.on(mouseDown, this.renderQuickToolbars, this);
        this.parent.on(toolbarUpdated, this.toolbarUpdated, this);
        this.wireInlineQTBarEvents();
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.on(scroll, this.hideQuickToolbars, this);
        }
        this.parent.on(focusChange, this.hideQuickToolbars, this);
        this.parent.on(iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.on(rtlMode, this.setRtl, this);
    }
    onKeyDown(e) {
        let args = e.args;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
                this.imageQTBar.hidePopup();
            }
        }
    }
    onIframeMouseDown() {
        this.hideQuickToolbars();
        this.hideInlineQTBar();
    }
    setRtl(args) {
        if (this.inlineQTBar) {
            this.inlineQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.imageQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.linkQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialEnd, this.initializeQuickToolbars);
        this.parent.off(mouseDown, this.renderQuickToolbars);
        this.parent.off(toolbarUpdated, this.toolbarUpdated);
        this.unWireInlineQTBarEvents();
        this.parent.off(modelChanged, this.onPropertyChanged);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.off(scroll, this.hideQuickToolbars);
        }
        this.parent.off(focusChange, this.hideQuickToolbars);
        this.parent.off(destroy, this.destroy);
        this.parent.off(iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(keyDown, this.onKeyDown);
        this.parent.off(rtlMode, this.setRtl);
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(e) {
        if (!isNullOrUndefined(e.newProp.quickToolbarSettings)) {
            for (let prop of Object.keys(e.newProp.quickToolbarSettings)) {
                switch (prop) {
                    case 'actionOnScroll':
                        if (e.newProp.quickToolbarSettings.actionOnScroll === 'none') {
                            this.parent.off(scroll, this.hideQuickToolbars);
                        }
                        else {
                            this.parent.on(scroll, this.hideQuickToolbars, this);
                        }
                        break;
                }
            }
        }
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (this.inlineQTBar) {
            removeClass([this.parent.element], [CLS_INLINE]);
            this.unWireInlineQTBarEvents();
            this.hideInlineQTBar();
        }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            addClass([this.parent.element], [CLS_INLINE]);
            this.wireInlineQTBarEvents();
        }
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'quickToolbar';
    }
}

/**
 * `Count` module is used to handle Count actions.
 */
class Count {
    constructor(parent, serviceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    initializeInstance() {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.editPanel = this.contentRenderer.getEditPanel();
    }
    renderCount() {
        this.initializeInstance();
        this.element = this.parent.createElement('span', { className: CLS_COUNT });
        this.contentRenderer.getPanel().parentElement.appendChild(this.element);
        this.appendCount();
        if (this.parent.maxLength !== -1) {
            this.charCountBackground(this.htmlLength);
        }
    }
    appendCount() {
        let htmlText = this.parent.editorMode === 'Markdown' ? this.editPanel.value.trim() :
            this.editPanel.textContent.trim();
        this.htmlLength = htmlText.length;
        let string = this.parent.maxLength === -1 ? this.htmlLength : this.htmlLength + ' / ' + this.parent.maxLength;
        this.element.innerHTML = string;
    }
    charCountBackground(htmlLength) {
        let percentage = (htmlLength / this.parent.maxLength) * 100;
        if (percentage < 85) {
            this.element.classList.remove(CLS_WARNING);
            this.element.classList.remove(CLS_ERROR);
        }
        else if (percentage > 85 && percentage <= 90) {
            this.element.classList.remove(CLS_ERROR);
            this.element.classList.add(CLS_WARNING);
        }
        else if (percentage > 90) {
            this.element.classList.remove(CLS_WARNING);
            this.element.classList.add(CLS_ERROR);
        }
    }
    /**
     * @hidden
     */
    refresh() {
        if (!isNullOrUndefined(this.editPanel)) {
            this.appendCount();
            if (this.parent.maxLength !== -1) {
                this.charCountBackground(this.htmlLength);
            }
        }
    }
    /**
     * Destroys the Count.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    toggle(e) {
        this.element.style.display = (e.member === 'viewSource') ? 'none' : 'block';
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.parent.showCharCount) {
            this.parent.on(initialEnd, this.renderCount, this);
            this.parent.on(keyUp, this.refresh, this);
            this.parent.on(count, this.refresh, this);
            this.parent.on(refreshBegin, this.refresh, this);
            this.parent.on(mouseDown, this.refresh, this);
            this.parent.on(destroy, this.destroy, this);
            this.parent.on(sourceCode, this.toggle, this);
            this.parent.on(updateSource, this.toggle, this);
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            detach(this.element);
        }
        this.parent.off(initialEnd, this.renderCount);
        this.parent.off(keyUp, this.refresh);
        this.parent.off(refreshBegin, this.refresh);
        this.parent.off(count, this.refresh);
        this.parent.off(mouseDown, this.refresh);
        this.parent.off(destroy, this.destroy);
        this.parent.off(sourceCode, this.toggle);
        this.parent.off(updateSource, this.toggle);
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'count';
    }
}

/**
 * MarkdownSelection internal module
 * @hidden
 */
class MarkdownSelection {
    getLineNumber(textarea, point) {
        return textarea.value.substr(0, point).split('\n').length;
    }
    getSelectedText(textarea) {
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        return textarea.value.substring(start, end);
    }
    getAllParents(value) {
        return value.split('\n');
    }
    getSelectedLine(textarea) {
        let lines = this.getAllParents(textarea.value);
        let index = this.getLineNumber(textarea, textarea.selectionStart);
        return lines[index - 1];
    }
    getLine(textarea, index) {
        let lines = this.getAllParents(textarea.value);
        return lines[index];
    }
    getSelectedParentPoints(textarea) {
        let lines = this.getAllParents(textarea.value);
        let start = this.getLineNumber(textarea, textarea.selectionStart);
        let end = this.getLineNumber(textarea, textarea.selectionEnd);
        let parents = this.getSelectedText(textarea).split('\n');
        let selectedPoints = [];
        let selectedLine = lines[start - 1];
        let startLength = lines.slice(0, start - 1).join('').length;
        let firstPoint = {};
        firstPoint.line = start - 1;
        firstPoint.start = startLength + firstPoint.line;
        firstPoint.end = selectedLine !== '' ? firstPoint.start +
            selectedLine.length + 1 : firstPoint.start + selectedLine.length;
        firstPoint.text = selectedLine;
        selectedPoints.push(firstPoint);
        if (parents.length > 1) {
            for (let i = 1; i < parents.length - 1; i++) {
                let points = {};
                points.line = selectedPoints[i - 1].line + 1;
                points.start = parents[i] !== '' ? selectedPoints[i - 1].end : selectedPoints[i - 1].end;
                points.end = points.start + parents[i].length + 1;
                points.text = parents[i];
                selectedPoints.push(points);
            }
            let lastPoint = {};
            lastPoint.line = selectedPoints[selectedPoints.length - 1].line + 1;
            lastPoint.start = selectedPoints[selectedPoints.length - 1].end;
            lastPoint.end = lastPoint.start + lines[end - 1].length + 1;
            lastPoint.text = lines[end - 1];
            selectedPoints.push(lastPoint);
        }
        return selectedPoints;
    }
    setSelection(textarea, start, end) {
        textarea.setSelectionRange(start, end);
        textarea.focus();
    }
    save(start, end) {
        this.selectionStart = start;
        this.selectionEnd = end;
    }
    restore(textArea) {
        this.setSelection(textArea, this.selectionStart, this.selectionEnd);
    }
    isStartWith(line, command) {
        let isStart = false;
        if (line) {
            let reg = line.trim() === command.trim() ?
                new RegExp('^(' + this.replaceSpecialChar(command.trim()) + ')', 'gim') :
                new RegExp('^(' + this.replaceSpecialChar(command) + ')', 'gim');
            isStart = reg.test(line.trim());
        }
        return isStart;
    }
    replaceSpecialChar(value) {
        return value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '\\$&');
    }
    isClear(parents, regex) {
        let isClear = false;
        for (let i = 0; i < parents.length; i++) {
            if (new RegExp(regex, 'gim').test(parents[i].text)) {
                return true;
            }
        }
        return isClear;
    }
    getSelectedInlinePoints(textarea) {
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let selection = this.getSelectedText(textarea);
        return { start: start, end: end, text: selection };
    }
}

/**
 * MarkdownToolbarStatus module for refresh the toolbar status
 */
class MarkdownToolbarStatus {
    constructor(parent) {
        this.toolbarStatus = {
            bold: false,
            italic: false,
            subscript: false,
            superscript: false,
            strikethrough: false,
            orderedlist: false,
            uppercase: false,
            inlinecode: false,
            unorderedlist: false,
            underline: false,
            alignments: null,
            backgroundcolor: null,
            fontcolor: null,
            fontname: null,
            fontsize: null,
            formats: null
        };
        this.selection = new MarkdownSelection();
        this.parent = parent;
        this.element = this.parent.contentModule.getEditPanel();
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(destroy, this.removeEventListener, this);
    }
    removeEventListener() {
        this.parent.off(toolbarRefresh, this.onRefreshHandler);
        this.parent.off(destroy, this.onRefreshHandler);
    }
    onRefreshHandler(args) {
        let parentsLines = this.selection.getSelectedParentPoints(this.element);
        this.toolbarStatus = {
            orderedlist: args.documentNode ? false : this.isListsApplied(parentsLines, 'OL'),
            unorderedlist: args.documentNode ? false : this.isListsApplied(parentsLines, 'UL'),
            formats: this.currentFormat(parentsLines, args.documentNode),
            bold: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('Bold'),
            italic: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('Italic'),
            inlinecode: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('InlineCode'),
            strikethrough: args.documentNode ? false :
                this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('StrikeThrough'),
            subscript: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('SubScript'),
            superscript: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('SuperScript'),
            uppercase: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('UpperCase')
        };
        if (this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('InlineCode')) {
            this.toolbarStatus.formats = 'pre';
        }
        this.parent.notify(toolbarUpdated, this.toolbarStatus);
    }
    isListsApplied(lines, type) {
        let isApply = true;
        if (type === 'OL') {
            for (let i = 0; i < lines.length; i++) {
                let lineSplit = lines[i].text.trim().split(' ', 2)[0] + ' ';
                if (!/^[\d.]+[ ]+$/.test(lineSplit)) {
                    isApply = false;
                    break;
                }
            }
        }
        else {
            for (let i = 0; i < lines.length; i++) {
                if (!this.selection.isStartWith(lines[i].text, this.parent.formatter.listTags[type])) {
                    isApply = false;
                    break;
                }
            }
        }
        return isApply;
    }
    currentFormat(lines, documentNode) {
        let format = 'p';
        let keys = Object.keys(this.parent.formatter.formatTags);
        let direction = this.element.selectionDirection;
        let checkLine = direction === 'backward' ? lines[0].text : lines[lines.length - 1].text;
        for (let i = 0; !documentNode && i < keys.length; i++) {
            if (keys[i] !== 'pre' && this.selection.isStartWith(checkLine, this.parent.formatter.formatTags[keys[i]])) {
                format = keys[i];
                break;
            }
            else if (keys[i] === 'pre') {
                if (this.codeFormat()) {
                    format = keys[i];
                    break;
                }
            }
        }
        return format;
    }
    codeFormat() {
        let isFormat = false;
        let textArea = this.parent.inputElement;
        let start = textArea.selectionStart;
        let splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];
        let splitText = splitAt(start)(textArea.value);
        let cmdPre = this.parent.formatter.formatTags.pre;
        let selectedText = this.getSelectedText(textArea);
        if (selectedText !== '' && selectedText === selectedText.toLocaleUpperCase()) {
            return true;
        }
        else if (selectedText === '') {
            let beforeText = textArea.value.substr(splitText[0].length - 1, 1);
            let afterText = splitText[1].substr(0, 1);
            if ((beforeText !== '' && afterText !== '' && beforeText.match(/[a-z]/i)) &&
                beforeText === beforeText.toLocaleUpperCase() && afterText === afterText.toLocaleUpperCase()) {
                return true;
            }
        }
        if ((this.isCode(splitText[0], cmdPre) && this.isCode(splitText[1], cmdPre)) &&
            (splitText[0].match(this.multiCharRegx(cmdPre)).length % 2 === 1 &&
                splitText[1].match(this.multiCharRegx(cmdPre)).length % 2 === 1)) {
            isFormat = true;
        }
        return isFormat;
    }
    getSelectedText(textarea) {
        return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    }
    isCode(text, cmd) {
        return text.search('\\' + cmd + '') !== -1;
    }
    multiCharRegx(cmd) {
        return new RegExp('(\\' + cmd + ')', 'g');
    }
}

/**
 * `ExecCommandCallBack` module is used to run the editor manager command
 */
class ExecCommandCallBack {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(execCommandCallBack, this.commandCallBack, this);
        this.parent.on(destroy, this.removeEventListener, this);
    }
    commandCallBack(args) {
        if (args.requestType !== 'Undo' && args.requestType !== 'Redo') {
            this.parent.formatter.saveData();
        }
        this.parent.notify(toolbarRefresh, { args: args });
        this.parent.notify(count, {});
    }
    removeEventListener() {
        this.parent.off(execCommandCallBack, this.commandCallBack);
        this.parent.off(destroy, this.removeEventListener);
    }
}

/**
 * Constant values for Common
 */
/* Keydown event trigger
 * @hidden
 */
const KEY_DOWN = 'keydown';
/* Undo and Redo action HTML plugin events
 * @hidden
 */
const ACTION = 'action';
/* Formats plugin events
 * @hidden
 */
const FORMAT_TYPE = 'format-type';
/* Keydown handler event trigger
 * @hidden
 */
const KEY_DOWN_HANDLER = 'keydown-handler';
/* List plugin events
 * @hidden
 */
const LIST_TYPE = 'list-type';
/* Keyup handler event trigger
 * @hidden
 */
const KEY_UP_HANDLER = 'keyup-handler';
/* Keyup event trigger
 * @hidden
 */
const KEY_UP = 'keyup';
/* Model changed plugin event trigger
 * @hidden
 */
const MODEL_CHANGED_PLUGIN = 'model_changed_plugin';
/* Model changed event trigger
 * @hidden
 */
const MODEL_CHANGED = 'model_changed';
/* PasteCleanup plugin for MSWord content
 * @hidden
 */
const MS_WORD_CLEANUP_PLUGIN = 'ms_word_cleanup_plugin';
/* PasteCleanup for MSWord content
 * @hidden
 */
const MS_WORD_CLEANUP = 'ms_word_cleanup';

/**
 * Formatter
 * @hidden
 */
class Formatter {
    /**
     * To execute the command
     * @param  {IRichTextEditor} self
     * @param  {ActionBeginEventArgs} args
     * @param  {MouseEvent|KeyboardEvent} event
     * @param  {IItemCollectionArgs} value
     */
    process(self, args, event, value) {
        let selection = self.contentModule.getDocument().getSelection();
        let range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
        let saveSelection;
        if (self.editorMode === 'HTML') {
            saveSelection = this.editorManager.nodeSelection.save(range, self.contentModule.getDocument());
        }
        if (!isNullOrUndefined(args)
            && args.item.command
            && args.item.command !== 'Table'
            && args.item.command !== 'Actions'
            && args.item.command !== 'Links'
            && args.item.command !== 'Images'
            && range
            && !(self.contentModule.getEditPanel().contains(this.getAncestorNode(range.commonAncestorContainer))
                || self.contentModule.getEditPanel() === range.commonAncestorContainer
                || self.contentModule.getPanel() === range.commonAncestorContainer)) {
            return;
        }
        if (isNullOrUndefined(args)) {
            let action = event.action;
            if (action !== 'tab' && action !== 'enter' && action !== 'space' && action !== 'escape') {
                args = {};
                if (self.editorMode === 'Markdown' && action === 'insert-table') {
                    value = {
                        'headingText': self.localeObj.getConstant('TableHeadingText'),
                        'colText': self.localeObj.getConstant('TableColText')
                    };
                }
                let items = {
                    originalEvent: event, cancel: false,
                    requestType: action || (event.key + 'Key'),
                    itemCollection: value
                };
                extend(args, args, items, true);
                if (isBlazor()) {
                    delete args.item;
                    delete args.itemCollection;
                }
                self.trigger(actionBegin, args, (actionBeginArgs) => {
                    if (actionBeginArgs.cancel) {
                        if (action === 'paste' || action === 'cut' || action === 'copy') {
                            event.preventDefault();
                        }
                    }
                });
            }
            if ((event.which === 9 && self.tableModule ? self.tableModule.ensureInsideTableList : false) || event.which !== 9) {
                this.editorManager.observer.notify((event.type === 'keydown' ? KEY_DOWN : KEY_UP), {
                    event: event,
                    callBack: this.onSuccess.bind(this, self),
                    value: value
                });
            }
        }
        else if (!isNullOrUndefined(args) && args.item.command && args.item.subCommand && ((args.item.command !== args.item.subCommand
            && args.item.command !== 'Font')
            || ((args.item.subCommand === 'FontName' || args.item.subCommand === 'FontSize') && args.name === 'dropDownSelect')
            || ((args.item.subCommand === 'BackgroundColor' || args.item.subCommand === 'FontColor')
                && args.name === 'colorPickerChanged'))) {
            extend(args, args, { requestType: args.item.subCommand, cancel: false, itemCollection: value }, true);
            self.trigger(actionBegin, args, (actionBeginArgs) => {
                if (!actionBeginArgs.cancel) {
                    if (this.getUndoRedoStack().length === 0 && actionBeginArgs.item.command !== 'Links'
                        && actionBeginArgs.item.command !== 'Images') {
                        this.saveData();
                    }
                    self.isBlur = false;
                    self.contentModule.getEditPanel().focus();
                    if (self.editorMode === 'HTML') {
                        saveSelection.restore();
                    }
                    let command = actionBeginArgs.item.subCommand.toLocaleLowerCase();
                    if (command === 'paste' || command === 'cut' || command === 'copy') {
                        self.clipboardAction(command, event);
                    }
                    else {
                        this.editorManager.observer.notify(checkUndo, { subCommand: actionBeginArgs.item.subCommand });
                        this.editorManager.execCommand(actionBeginArgs.item.command, actionBeginArgs.item.subCommand, event, this.onSuccess.bind(this, self), actionBeginArgs.item.value, value, ('#' + self.getID() + ' iframe'));
                    }
                }
            });
        }
        if (isNullOrUndefined(event) || event && event.action !== 'copy') {
            this.enableUndo(self);
        }
    }
    getAncestorNode(node) {
        node = node.nodeType === 3 ? node.parentNode : node;
        return node;
    }
    onKeyHandler(self, e) {
        this.editorManager.observer.notify(KEY_UP, {
            event: e, callBack: () => {
                this.enableUndo(self);
            }
        });
    }
    onSuccess(self, events) {
        if (isNullOrUndefined(events.event) || (events && events.event.action !== 'copy')) {
            this.enableUndo(self);
            self.notify(execCommandCallBack, events);
        }
        if (isBlazor()) {
            delete events.elements;
        }
        self.trigger(actionComplete, events, (callbackArgs) => {
            self.setPlaceHolder();
            if (callbackArgs.requestType === 'Images' || callbackArgs.requestType === 'Links' && self.editorMode === 'HTML') {
                let args = callbackArgs;
                if (callbackArgs.requestType === 'Links' && callbackArgs.event &&
                    callbackArgs.event.type === 'keydown' &&
                    callbackArgs.event.keyCode === 32) {
                    return;
                }
                self.notify(insertCompleted, {
                    args: args.event, type: callbackArgs.requestType, isNotify: true,
                    elements: args.elements
                });
            }
            self.autoResize();
        });
    }
    /**
     * Save the data for undo and redo action.
     */
    saveData(e) {
        this.editorManager.undoRedoManager.saveData(e);
    }
    getUndoStatus() {
        return this.editorManager.undoRedoManager.getUndoStatus();
    }
    getUndoRedoStack() {
        return this.editorManager.undoRedoManager.undoRedoStack;
    }
    enableUndo(self) {
        let status = this.getUndoStatus();
        if (self.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            updateUndoRedoStatus(self.quickToolbarModule.inlineQTBar.quickTBarObj, status);
            self.trigger(toolbarStatusUpdate, status);
        }
        else {
            if (self.toolbarModule) {
                updateUndoRedoStatus(self.toolbarModule.baseToolbar, status);
                self.trigger(toolbarStatusUpdate, status);
            }
        }
    }
}

/**
 * Constant values for Markdown Parser
 */
/* List plugin events
 * @hidden
 */
const LISTS_COMMAND = 'lists-commands';
/* selectioncommand plugin events
 * @hidden
 */
const selectionCommand = 'command-type';
/* Link plugin events
 * @hidden
 */
const LINK_COMMAND = 'link-commands';
/* Clear plugin events
 * @hidden
 */
const CLEAR_COMMAND = 'clear-commands';
/* Table plugin events
 * @hidden
 */
const MD_TABLE = 'insert-table';

/**
 * Lists internal component
 * @hidden
 */
class MDLists {
    /**
     * Constructor for creating the Lists plugin
     * @hidden
     */
    constructor(options) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(LISTS_COMMAND, this.applyListsHandler, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
        this.parent.observer.on(KEY_UP_HANDLER, this.keyUpHandler, this);
    }
    keyDownHandler(event) {
        switch (event.event.which) {
            case 9:
                this.tabKey(event);
                break;
        }
        switch (event.event.action) {
            case 'ordered-list':
                this.applyListsHandler({ subCommand: 'OL', callBack: event.callBack });
                event.event.preventDefault();
                break;
            case 'unordered-list':
                this.applyListsHandler({ subCommand: 'UL', callBack: event.callBack });
                event.event.preventDefault();
                break;
        }
    }
    keyUpHandler(event) {
        switch (event.event.which) {
            case 13:
                this.enterKey(event);
                break;
        }
    }
    tabKey(event) {
        let textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let parents = this.selection.getSelectedParentPoints(textArea);
        let addedLength = 0;
        let isNotFirst = this.isNotFirstLine(textArea, parents[0]);
        if (!isNotFirst && !event.event.shiftKey) {
            this.restore(textArea, start, end + addedLength, event);
            return;
        }
        let listFormat = this.olListType();
        let regex = this.getListRegex();
        this.currentAction = this.getAction(parents[0].text);
        for (let i = 0; i < parents.length; i++) {
            let prevIndex = event.event.shiftKey ? parents[i].line - 1 : parents[i].line - 1;
            let prevLine = this.selection.getLine(textArea, prevIndex);
            if (prevLine && (!event.event.shiftKey && isNotFirst || (event.event.shiftKey))) {
                let prevLineSplit = prevLine.split('. ');
                let tabSpace = '\t';
                let tabSpaceLength = event.event.shiftKey ? -tabSpace.length : tabSpace.length;
                let splitTab = parents[i].text.split('\t');
                if (event.event.shiftKey && splitTab.length === 1) {
                    break;
                }
                if (this.currentAction === 'OL' && /^\d+$/.test(prevLineSplit[0].trim()) && listFormat) {
                    event.event.preventDefault();
                    parents[i].text = event.event.shiftKey ? splitTab.splice(1, splitTab.length).join('\t') : tabSpace + parents[i].text;
                    let curTabSpace = this.getTabSpace(parents[i].text);
                    let prevTabSpace = this.getTabSpace(prevLine);
                    let splitText = parents[i].text.split('. ');
                    if (curTabSpace === prevTabSpace) {
                        this.changeTextAreaValue(splitText, this.nextOrderedListValue(prevLineSplit[0].trim()), event, textArea, parents, i, end);
                    }
                    else if (prevTabSpace < curTabSpace) {
                        this.changeTextAreaValue(splitText, '1. ', event, textArea, parents, i, end);
                    }
                    else {
                        for (; prevTabSpace.length > curTabSpace.length; null) {
                            prevIndex = prevIndex - 1;
                            prevLine = this.selection.getLine(textArea, prevIndex);
                            let prevLineSplit = prevLine.trim().split('. ');
                            if (/^\d+$/.test(prevLineSplit[0])) {
                                prevTabSpace = this.getTabSpace(prevLine);
                                if (prevTabSpace.length <= curTabSpace.length) {
                                    this.changeTextAreaValue(splitText, this.nextOrderedListValue(prevLineSplit[0]), event, textArea, parents, i, end);
                                    break;
                                }
                            }
                        }
                    }
                }
                else if (this.currentAction === 'UL' && regex.test(prevLine.trim()) || !listFormat) {
                    event.event.preventDefault();
                    parents[i].text = event.event.shiftKey ? splitTab.splice(1, splitTab.length).join('\t') : tabSpace + parents[i].text;
                    textArea.value = textArea.value.substr(0, parents[i].start) + parents[i].text + '\n' +
                        textArea.value.substr(parents[i].end, textArea.value.length);
                }
                start = i === 0 ? start + tabSpaceLength : start;
                addedLength += tabSpaceLength;
                if (parents.length !== 1) {
                    for (let j = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ? parents[j].start + tabSpaceLength : parents[j].start;
                        parents[j].end = parents[j].end + tabSpaceLength;
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, event);
    }
    changeTextAreaValue(splitText, prefixValue, event, textArea, parents, k, end) {
        let prefix = prefixValue;
        splitText.splice(0, 1);
        let textAreaLength = this.selection.getAllParents(textArea.value).length;
        let changedList = '';
        let curTabSpace = this.getTabSpace(parents[k].text);
        let prefixNumber = parseInt(prefix.split('.')[0], null);
        let nestedTabSpace = this.getTabSpace(parents[k].text);
        let nestedlistorder = true;
        let nestedListStart = true;
        let curTabSpaceLength;
        let nextPrefixValue = -1;
        let traversIncreased = true;
        let nextLineLength = 0;
        let lineBreak = '';
        changedList = (this.selection.getLine(textArea, parents[0].line + 1) !== '') ?
            '' : changedList + textArea.value.substr(parents[0].end, textArea.value.length);
        for (let i = 1; i < textAreaLength &&
            !isNullOrUndefined(this.selection.getLine(textArea, parents[0].line + i))
            && this.selection.getLine(textArea, parents[0].line + i) !== ''; i++) {
            let nextLine = this.selection.getLine(textArea, parents[0].line + i);
            let nextTabSpace = this.getTabSpace(nextLine);
            let nextLineSplit = nextLine.split('. ');
            if (nextLineSplit.length === 1) {
                changedList += textArea.value.substr(parents[0].end + nextLineLength, textArea.value.length);
                break;
            }
            else {
                nextLineLength += nextLine.length;
                let shiftTabTargetList = false;
                curTabSpaceLength = event.event.shiftKey ? curTabSpace.length + 1 : curTabSpace.length - 1;
                if (nextTabSpace.length > nestedTabSpace.length) {
                    traversIncreased = false;
                }
                if (curTabSpace.length !== nextTabSpace.length && nextTabSpace.length < nestedTabSpace.length) {
                    nestedListStart = true;
                    nestedlistorder = false;
                    shiftTabTargetList = event.event.shiftKey &&
                        curTabSpace.length === nextTabSpace.length ? (nestedListStart = false, true) : false;
                }
                else if (traversIncreased && event.event.shiftKey &&
                    curTabSpace.length === nextTabSpace.length && nextTabSpace.length === nestedTabSpace.length) {
                    nestedListStart = false;
                    shiftTabTargetList = true;
                }
                lineBreak = changedList === '' ? '' : '\n';
                if (curTabSpaceLength === nextTabSpace.length && nestedListStart) {
                    let nextPrefix = event.event.shiftKey ?
                        (nextPrefixValue++, this.nextOrderedListValue(nextPrefixValue.toString()))
                        : this.previousOrderedListValue(nextLineSplit[0]);
                    nextLineSplit.splice(0, 1);
                    changedList = changedList + lineBreak + nextTabSpace + nextPrefix + nextLineSplit.join('. ');
                }
                else if (curTabSpace.length === nextTabSpace.length && nestedlistorder || shiftTabTargetList) {
                    let nextPrefix = this.nextOrderedListValue(prefixNumber.toString());
                    prefixNumber++;
                    nextLineSplit.splice(0, 1);
                    changedList = changedList + lineBreak + nextTabSpace + nextPrefix + nextLineSplit.join('. ');
                }
                else {
                    changedList = changedList + lineBreak + nextLine;
                    nestedListStart = false;
                }
                nestedTabSpace = this.getTabSpace(nextLine);
            }
        }
        parents[k].text = this.getTabSpace(parents[k].text) + prefix + splitText.join('. ') + '\n';
        textArea.value = textArea.value.substr(0, parents[k].start) + parents[k].text + changedList;
    }
    getTabSpace(line) {
        let split = line.split('\t');
        let tabs = '';
        for (let i = 0; i < split.length; i++) {
            if (split[i] === '') {
                tabs += '\t';
            }
            else {
                break;
            }
        }
        return tabs;
    }
    isNotFirstLine(textArea, points) {
        let currentLine = points.text;
        let prevIndex = points.line - 1;
        let prevLine = this.selection.getLine(textArea, prevIndex);
        let regex = this.getListRegex();
        let isNotFirst = false;
        let regexFirstCondition;
        if (prevLine) {
            this.currentAction = this.getAction(prevLine);
            let prevLineSplit = prevLine.split('. ');
            regexFirstCondition = this.currentAction === 'OL' ? /^\d+$/.test(prevLineSplit[0].trim()) : regex.test(prevLine.trim());
        }
        if (prevLine && regexFirstCondition) {
            let curTabSpace = this.getTabSpace(currentLine);
            let prevTabSpace = this.getTabSpace(prevLine);
            isNotFirst = curTabSpace === prevTabSpace ? true : isNotFirst;
            for (; prevTabSpace.length > curTabSpace.length; null) {
                prevIndex = prevIndex - 1;
                prevLine = this.selection.getLine(textArea, prevIndex);
                let prevLineSplit = prevLine.trim().split('. ');
                let regexSecondCondition = this.currentAction === 'OL' ?
                    /^\d+$/.test(prevLineSplit[0]) : regex.test(prevLine.trim());
                if (regexSecondCondition) {
                    prevTabSpace = this.getTabSpace(prevLine);
                    if (prevTabSpace.length <= curTabSpace.length) {
                        isNotFirst = true;
                        break;
                    }
                }
            }
        }
        return isNotFirst;
    }
    getAction(line) {
        let ol = line.split('. ')[0];
        let currentState = /^\d+$/.test(ol.trim());
        let ul = line.trim().split(new RegExp('^(' + this.selection.replaceSpecialChar(this.syntax.UL).trim() + ')'))[1];
        return (currentState ? 'OL' : ul ? 'UL' : 'NOTLIST');
    }
    nextOrderedListValue(previousLine) {
        let currentValue = parseInt(previousLine, null);
        let nextValue = currentValue + 1;
        return nextValue.toString() + '. ';
    }
    previousOrderedListValue(previousLine) {
        let currentValue = parseInt(previousLine, null);
        let nextValue = currentValue - 1;
        return nextValue.toString() + '. ';
    }
    enterKey(event) {
        let textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let parents = this.selection.getSelectedParentPoints(textArea);
        let prevLine = this.selection.getLine(textArea, parents[0].line - 1);
        let listFormat = this.olListType();
        let regex = this.getListRegex();
        let prevLineSplit = prevLine.split('. ');
        this.currentAction = this.getAction(prevLine);
        let addedLength = 0;
        if (this.currentAction === 'OL' && prevLineSplit.length > 1 && /^\d+$/.test(prevLineSplit[0].trim()) && listFormat
            && prevLineSplit[1] !== '') {
            let tabSpace = this.getTabSpace(prevLine);
            this.currentAction = this.getAction(prevLine);
            let prefix = this.nextOrderedListValue(prevLineSplit[0]);
            parents[0].text = tabSpace + prefix + parents[0].text;
            let textAreaLength = this.selection.getAllParents(textArea.value).length;
            let changedList = '\n';
            let curTabSpace = this.getTabSpace(prevLine);
            let nestedTabSpace = this.getTabSpace(parents[0].text);
            let nestedListOrder = true;
            for (let i = 1; i < textAreaLength &&
                textArea.value.substr(parents[0].end, textArea.value.length) !== ''; i++) {
                let nextLine = this.selection.getLine(textArea, parents[0].line + i);
                if (isNullOrUndefined(nextLine)) {
                    changedList = changedList + '';
                }
                else {
                    let nextLineSplit = nextLine.split('. ');
                    let nextTabSpace = this.getTabSpace(nextLine);
                    if (nextTabSpace.length < nestedTabSpace.length) {
                        nestedListOrder = false;
                    }
                    if (nextLineSplit.length > 1 && /^\d+$/.test(nextLineSplit[0].trim()) &&
                        curTabSpace.length === nextTabSpace.length && nestedListOrder) {
                        let nextPrefix = this.nextOrderedListValue(nextLineSplit[0]);
                        nextLineSplit.splice(0, 1);
                        changedList = changedList + nextTabSpace + nextPrefix + nextLineSplit.join('. ') + '\n';
                    }
                    else {
                        changedList = changedList + nextLine + '\n';
                        nestedTabSpace = this.getTabSpace(nextLine);
                    }
                }
            }
            textArea.value = textArea.value.substr(0, parents[0].start) + curTabSpace +
                prefix + this.selection.getLine(textArea, parents[0].line) + changedList;
            start = start + prefix.length + tabSpace.length;
            addedLength += prefix.length + tabSpace.length;
        }
        else if (this.currentAction === 'UL' && regex.test(prevLine.trim()) &&
            prevLine.trim().replace(regex, '') !== '' || this.currentAction === 'OL' && !listFormat) {
            let tabSpace = this.getTabSpace(prevLine);
            let prefix = this.syntax[this.currentAction];
            parents[0].text = tabSpace + prefix + parents[0].text +
                (parents[0].text.trim().length > 0 ? '\n' : '');
            textArea.value = textArea.value.substr(0, parents[0].start) + parents[0].text +
                textArea.value.substr(parents[0].end, textArea.value.length);
            start = start + prefix.length + tabSpace.length;
            addedLength += prefix.length + tabSpace.length;
        }
        this.restore(textArea, start, end + addedLength, event);
    }
    olListType() {
        let olSyntaxList = this.syntax.OL.split('.,');
        let listType = olSyntaxList.length === 1 ? null :
            parseInt(olSyntaxList[2].trim(), null) - parseInt(olSyntaxList[0].trim(), null);
        if (listType) {
            return 1;
        }
        else {
            return 0;
        }
    }
    applyListsHandler(e) {
        let textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        this.currentAction = e.subCommand;
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let addedLength = 0;
        let startLength = 0;
        let endLength = 0;
        let parents = this.selection.getSelectedParentPoints(textArea);
        let prefix = '';
        let listFormat;
        let regex;
        listFormat = this.olListType();
        let perfixObj = {};
        for (let i = 0; i < parents.length; i++) {
            if (listFormat) {
                regex = this.currentAction === 'OL' ? i + listFormat + '. ' : this.syntax[this.currentAction];
            }
            else {
                regex = this.currentAction === 'OL' ? this.syntax.OL : this.syntax[this.currentAction];
            }
            if (!this.selection.isStartWith(parents[i].text, regex)) {
                if (parents[i].text === '' && i === 0) {
                    this.selection.save(start, end);
                    if (parents.length !== 1) {
                        for (let j = i; j < parents.length; j++) {
                            parents[j].start = j !== 0 ? 1 + parents[j].start : parents[j].start;
                            parents[j].end = 1 + parents[j].end;
                        }
                    }
                }
                let preLineTabSpaceLength = !isNullOrUndefined(parents[i - 1]) ?
                    this.getTabSpace(parents[i - 1].text).length : 0;
                let replace = this.appliedLine(parents[i].text, regex, perfixObj, preLineTabSpaceLength);
                prefix = replace.line ? prefix : regex;
                parents[i].text = replace.line ? replace.line : prefix + parents[i].text;
                replace.space = replace.space ? replace.space : 0;
                textArea.value = textArea.value.substr(0, parents[i].start + endLength) + parents[i].text + '\n' +
                    textArea.value.substr(parents[i].end, textArea.value.length);
                start = i === 0 ? (start + prefix.length + replace.space) > 0 ?
                    start + prefix.length + replace.space : 0 : start;
                addedLength += prefix.length + replace.space;
                if (parents.length !== 1) {
                    for (let j = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ? prefix.length +
                            parents[j].start + replace.space : parents[j].start;
                        parents[j].end = prefix.length + parents[j].end + replace.space;
                    }
                }
                this.restore(textArea, start, end + addedLength, null);
            }
            else {
                parents[i].text = parents[i].text.replace(regex, '');
                textArea.value = textArea.value.substr(0, parents[i].start + endLength) + parents[i].text + '\n' +
                    textArea.value.substr(parents[i].end + endLength, textArea.value.length);
                endLength -= regex.length;
                startLength = regex.length;
                this.restore(textArea, start - startLength, end + endLength, null);
            }
        }
        this.restore(textArea, null, null, e);
    }
    appliedLine(line, prefixPattern, perfixObj, preTabSpaceLength) {
        let points = {};
        let regex = new RegExp('^[' + this.syntax.UL.trim() + ']');
        let lineSplit = line.split('. ');
        let currentPrefix = lineSplit[0] + '. ';
        let isExist = regex.test(line.trim()) || line.trim() === this.syntax.OL.trim()
            || line.trim() === this.syntax.UL.trim() || /^\d+$/.test(lineSplit[0].trim());
        let listFormat = this.olListType();
        let curTabSpaceLength = this.getTabSpace(line).length;
        if (this.currentAction === 'OL' && listFormat) {
            perfixObj[curTabSpaceLength.toString()] = !isNullOrUndefined(perfixObj[curTabSpaceLength.toString()]) ?
                perfixObj[curTabSpaceLength.toString()].valueOf() + 1 : 1;
            prefixPattern = perfixObj[curTabSpaceLength.toString()].valueOf().toString() + '. ';
            if (!isNullOrUndefined(preTabSpaceLength) && preTabSpaceLength > curTabSpaceLength) {
                perfixObj[preTabSpaceLength.toString()] = 0;
            }
        }
        if (isExist) {
            let replace;
            let pattern;
            if (regex.test(line.trim())) {
                pattern = this.syntax.UL;
                replace = prefixPattern;
                points.space = prefixPattern.trim().length - this.syntax.UL.trim().length;
            }
            else if (/^\d+$/.test(lineSplit[0].trim()) && listFormat) {
                pattern = lineSplit[0].trim() + '. ';
                replace = prefixPattern;
                points.space = this.syntax.UL.trim().length - currentPrefix.trim().length;
            }
            else if (/^\d+$/.test(lineSplit[0].trim())) {
                pattern = lineSplit[0].trim() + '. ';
                replace = this.syntax.UL;
                points.space = this.syntax.UL.trim().length - currentPrefix.trim().length;
            }
            points.line = line.replace(pattern, replace);
        }
        return points;
    }
    restore(textArea, start, end, event) {
        if (!isNullOrUndefined(start) && !isNullOrUndefined(start)) {
            this.selection.save(start, end);
        }
        if (!isNullOrUndefined(event)) {
            this.selection.restore(textArea);
        }
        if (event && event.callBack) {
            event.callBack({
                requestType: this.currentAction,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
    getListRegex() {
        let regex = '';
        let configKey = Object.keys(this.syntax);
        for (let j = 0; j < configKey.length; j++) {
            let syntax = this.selection.replaceSpecialChar(this.syntax[configKey[j]]);
            regex += regex === '' ? '^(' + syntax + ')|^(' + syntax.trim() + ')' :
                '|^(' + syntax + ')|^(' + syntax.trim() + ')';
        }
        return new RegExp(regex);
    }
}

/**
 * MDFormats internal plugin
 * @hidden
 */
class MDFormats {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(options) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(FORMAT_TYPE, this.applyFormats, this);
    }
    applyFormats(e) {
        e.subCommand = e.subCommand.toLowerCase();
        let textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let parents = this.selection.getSelectedParentPoints(textArea);
        if (this.isAppliedFormat(parents) === e.subCommand) {
            if (e.subCommand === 'pre') {
                if (parents.length > 1) {
                    this.applyCodeBlock(textArea, e, parents);
                }
                else {
                    return;
                }
            }
            this.cleanFormat(textArea);
            this.restore(textArea, textArea.selectionStart, textArea.selectionEnd, e);
            return;
        }
        if (e.subCommand === 'p') {
            this.cleanFormat(textArea);
            this.restore(textArea, textArea.selectionStart, textArea.selectionEnd, e);
            return;
        }
        else {
            if ((e.subCommand === 'pre' && parents.length !== 1) || e.subCommand !== 'pre') {
                this.cleanFormat(textArea, e.subCommand);
            }
        }
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let addedLength = 0;
        parents = this.selection.getSelectedParentPoints(textArea);
        if (e.subCommand === 'pre') {
            if (parents.length > 1) {
                this.applyCodeBlock(textArea, e, parents);
            }
            else {
                extend(e, e, { subCommand: 'InlineCode' }, true);
                this.parent.observer.notify(selectionCommand, e);
            }
            return;
        }
        for (let i = 0; i < parents.length; i++) {
            if (parents[i].text !== '' && !this.selection.isStartWith(parents[i].text, '\\' + this.syntax[e.subCommand])) {
                parents[i].text = this.syntax[e.subCommand] + parents[i].text;
                textArea.value = textArea.value.substr(0, parents[i].start) + parents[i].text + '\n' +
                    textArea.value.substr(parents[i].end, textArea.value.length);
                start = i === 0 ? start + this.syntax[e.subCommand].length : start;
                addedLength += this.syntax[e.subCommand].length;
                if (parents.length !== 1) {
                    for (let j = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ?
                            this.syntax[e.subCommand].length + parents[j].start : parents[j].start;
                        parents[j].end = this.syntax[e.subCommand].length + parents[j].end;
                    }
                }
            }
            else if (parents[i].text === '' && i === 0) {
                this.selection.save(start, end);
                if (parents.length !== 1) {
                    for (let j = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ? 1 + parents[j].start : parents[j].start;
                        parents[j].end = 1 + parents[j].end;
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, e);
    }
    clearRegex() {
        let regex = '';
        let configKey = Object.keys(this.syntax);
        for (let j = 0; j < configKey.length && configKey[j] !== 'pre' && configKey[j] !== 'p'; j++) {
            regex += regex === '' ? '^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j]].trim()) + ')' :
                '|^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j]].trim()) + ')';
        }
        return regex;
    }
    cleanFormat(textArea, command) {
        let parents = this.selection.getSelectedParentPoints(textArea);
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let removeLength = 0;
        if (this.selection.isClear(parents, this.clearRegex())) {
            for (let i = 0; i < parents.length; i++) {
                let configKey = Object.keys(this.syntax);
                for (let j = 0; parents[i].text !== '' && j < configKey.length; j++) {
                    let removeText = this.syntax[configKey[j]];
                    if (configKey[j] === command) {
                        continue;
                    }
                    let regex = new RegExp('^(' + this.selection.replaceSpecialChar(removeText) + ')', 'gim');
                    if (regex.test(parents[i].text)) {
                        parents[i].text = parents[i].text.replace(regex, '');
                        textArea.value = textArea.value.substr(0, parents[i].start) + parents[i].text + '\n' +
                            textArea.value.substr(parents[i].end, textArea.value.length);
                        start = i === 0 ? (start - (removeText.length)) > 0 ? start - (removeText.length) : 0 : start;
                        removeLength += removeText.length;
                        if (parents.length !== 1) {
                            for (let k = 0; k < parents.length; k++) {
                                parents[k].start = k !== 0 ?
                                    parents[k].start - removeText.length : parents[k].start;
                                parents[k].end = parents[k].end - removeText.length;
                            }
                        }
                        break;
                    }
                }
                if (parents[i].text === '' && i === 0) {
                    this.selection.save(start, end);
                    if (parents.length !== 1) {
                        for (let j = i; j < parents.length; j++) {
                            parents[j].start = j !== 0 ? 1 + parents[j].start : parents[j].start;
                            parents[j].end = 1 + parents[j].end;
                        }
                    }
                }
            }
            this.restore(textArea, start, end - removeLength);
        }
    }
    applyCodeBlock(textArea, event, parents) {
        let command = event.subCommand;
        let start = parents[0].start;
        let end = parents[parents.length - 1].end;
        let parentLines = this.selection.getAllParents(textArea.value);
        let firstPrevText = parentLines[parents[0].line - 1];
        let lastNextText = parentLines[(parents.length + 1) + 1];
        if (!this.selection.isStartWith(firstPrevText, this.syntax.pre.split('\n')[0]) &&
            !this.selection.isStartWith(lastNextText, this.syntax.pre.split('\n')[0])) {
            let lines = textArea.value.substring(start, end).split('\n');
            let lastLine = lines[lines.length - 1] === '' ? '' : '\n';
            textArea.value = textArea.value.substr(0, start) + this.syntax[command] + textArea.value.substring(start, end) +
                lastLine + this.syntax[command] +
                textArea.value.substr(end, textArea.value.length);
            start = this.selection.selectionStart + this.syntax[command].length;
            end = this.selection.selectionEnd + this.syntax[command].length - 1;
        }
        else {
            let cmd = this.syntax[command];
            let selection = this.parent.markdownSelection.getSelectedInlinePoints(textArea);
            let startNo = textArea.value.substr(0, textArea.selectionStart).lastIndexOf(cmd);
            let endNo = textArea.value.substr(textArea.selectionEnd, textArea.selectionEnd).indexOf(cmd);
            endNo = endNo + selection.end;
            let repStartText = this.replaceAt(textArea.value.substr(0, selection.start), cmd, '', startNo, selection.start);
            let repEndText = this.replaceAt(textArea.value.substr(selection.end, textArea.value.length), cmd, '', 0, endNo);
            textArea.value = repStartText + selection.text + repEndText;
            start = this.selection.selectionStart - cmd.length;
            end = this.selection.selectionEnd - cmd.length;
        }
        this.restore(textArea, start, end, event);
    }
    replaceAt(input, search, replace, start, end) {
        return input.slice(0, start)
            + input.slice(start, end).replace(search, replace)
            + input.slice(end);
    }
    restore(textArea, start, end, event) {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: event.subCommand,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
    isAppliedFormat(lines, documentNode) {
        let format = 'p';
        let configKey = Object.keys(this.syntax);
        let keys = Object.keys(this.syntax);
        let direction = this.parent.element.selectionDirection;
        let checkLine = direction === 'backward' ? lines[0].text : lines[lines.length - 1].text;
        for (let i = 0; !documentNode && i < keys.length; i++) {
            if (keys[i] !== 'pre' && this.selection.isStartWith(checkLine, this.syntax[keys[i]])) {
                format = keys[i];
                break;
            }
            else if (keys[i] === 'pre') {
                let parentLines = this.selection.getAllParents(this.parent.element.value);
                let firstPrevText = parentLines[lines[0].line - 1];
                let lastNextText = parentLines[lines.length + 1];
                if (this.selection.isStartWith(firstPrevText, this.syntax[keys[i]].split('\n')[0]) &&
                    this.selection.isStartWith(lastNextText, this.syntax[keys[i]].split('\n')[0])) {
                    format = keys[i];
                    break;
                }
            }
        }
        return format;
    }
}

/**
 * SelectionCommands internal component
 * @hidden
 */
class MDSelectionFormats {
    constructor(parent) {
        extend(this, this, parent, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(selectionCommand, this.applyCommands, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
    }
    keyDownHandler(e) {
        switch (e.event.action) {
            case 'bold':
                this.applyCommands({ subCommand: 'Bold', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'italic':
                this.applyCommands({ subCommand: 'Italic', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'strikethrough':
                this.applyCommands({ subCommand: 'StrikeThrough', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'uppercase':
                this.applyCommands({ subCommand: 'UpperCase', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'lowercase':
                this.applyCommands({ subCommand: 'LowerCase', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'superscript':
                this.applyCommands({ subCommand: 'SuperScript', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'subscript':
                this.applyCommands({ subCommand: 'SubScript', callBack: e.callBack });
                e.event.preventDefault();
                break;
        }
    }
    isBold(text, cmd) {
        return text.search('\\' + cmd + '\\' + cmd + '') !== -1;
    }
    isItalic(text, cmd) {
        return text.search('\\' + cmd) !== -1;
    }
    isMatch(text, cmd) {
        let matchText = [''];
        switch (cmd) {
            case this.syntax.Italic:
                matchText = text.match(this.singleCharRegx(cmd));
                break;
            case this.syntax.InlineCode:
                matchText = text.match(this.singleCharRegx(cmd));
                break;
            case this.syntax.StrikeThrough:
                matchText = text.match(this.singleCharRegx(cmd));
                break;
        }
        return matchText;
    }
    multiCharRegx(cmd) {
        return new RegExp('(\\' + cmd + '\\' + cmd + ')', 'g');
    }
    singleCharRegx(cmd) {
        return new RegExp('(\\' + cmd + ')', 'g');
    }
    isAppliedCommand(cmd) {
        let isFormat = false;
        let textArea = this.parent.element;
        let start = textArea.selectionStart;
        let splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];
        let splitText = splitAt(start)(textArea.value);
        let cmdB = this.syntax.Bold.substr(0, 1);
        let cmdI = this.syntax.Italic;
        let selectedText = this.parent.markdownSelection.getSelectedText(textArea);
        if (selectedText !== '' && selectedText === selectedText.toLocaleUpperCase() && cmd === 'UpperCase') {
            return true;
        }
        else if (selectedText === '') {
            let beforeText = textArea.value.substr(splitText[0].length - 1, 1);
            let afterText = splitText[1].substr(0, 1);
            if ((beforeText !== '' && afterText !== '' && beforeText.match(/[a-z]/i)) &&
                beforeText === beforeText.toLocaleUpperCase() && afterText === afterText.toLocaleUpperCase() && cmd === 'UpperCase') {
                return true;
            }
        }
        if (!(this.isBold(splitText[0], cmdB)) && !(this.isItalic(splitText[0], cmdI)) && !(this.isBold(splitText[1], cmdB)) &&
            !(this.isItalic(splitText[1], cmdI))) {
            if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.StrikeThrough)) &&
                !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.StrikeThrough))) &&
                (this.isMatch(splitText[0], this.syntax.StrikeThrough).length % 2 === 1 &&
                    this.isMatch(splitText[1], this.syntax.StrikeThrough).length % 2 === 1) && cmd === 'StrikeThrough') {
                isFormat = true;
            }
            if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.InlineCode)) &&
                !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.InlineCode))) &&
                (this.isMatch(splitText[0], this.syntax.InlineCode).length % 2 === 1 &&
                    this.isMatch(splitText[1], this.syntax.InlineCode).length % 2 === 1) && cmd === 'InlineCode') {
                isFormat = true;
            }
            if ((!isNullOrUndefined(splitText[0].match(/\<sub>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sub>/g))) &&
                (splitText[0].match(/\<sub>/g).length % 2 === 1 &&
                    splitText[1].match(/\<\/sub>/g).length % 2 === 1) && cmd === 'SubScript') {
                isFormat = true;
            }
            if ((!isNullOrUndefined(splitText[0].match(/\<sup>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sup>/g))) &&
                (splitText[0].match(/\<sup>/g).length % 2 === 1 && splitText[1].match(/\<\/sup>/g).length % 2 === 1) &&
                cmd === 'SuperScript') {
                isFormat = true;
            }
        }
        if ((this.isBold(splitText[0], cmdB) && this.isBold(splitText[1], cmdB)) &&
            (splitText[0].match(this.multiCharRegx(cmdB)).length % 2 === 1 &&
                splitText[1].match(this.multiCharRegx(cmdB)).length % 2 === 1) && cmd === 'Bold') {
            isFormat = true;
        }
        splitText[0] = this.isBold(splitText[0], cmdB) ? splitText[0].replace(this.multiCharRegx(cmdB), '$%@') : splitText[0];
        splitText[1] = this.isBold(splitText[1], cmdB) ? splitText[1].replace(this.multiCharRegx(cmdB), '$%@') : splitText[1];
        if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.Italic)) &&
            !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.Italic))) &&
            (this.isMatch(splitText[0], this.syntax.Italic).length % 2 === 1 &&
                this.isMatch(splitText[1], this.syntax.Italic).length % 2 === 1) && cmd === 'Italic') {
            isFormat = true;
        }
        if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.StrikeThrough)) &&
            !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.StrikeThrough))) &&
            (this.isMatch(splitText[0], this.syntax.StrikeThrough).length % 2 === 1 &&
                this.isMatch(splitText[1], this.syntax.StrikeThrough).length % 2 === 1) && cmd === 'StrikeThrough') {
            isFormat = true;
        }
        if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.InlineCode)) &&
            !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.InlineCode))) &&
            (this.isMatch(splitText[0], this.syntax.InlineCode).length % 2 === 1 &&
                this.isMatch(splitText[1], this.syntax.InlineCode).length % 2 === 1) && cmd === 'InlineCode') {
            isFormat = true;
        }
        if ((!isNullOrUndefined(splitText[0].match(/\<sub>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sub>/g))) &&
            (splitText[0].match(/\<sub>/g).length % 2 === 1 && splitText[1].match(/\<\/sub>/g).length % 2 === 1) && cmd === 'SubScript') {
            isFormat = true;
        }
        if ((!isNullOrUndefined(splitText[0].match(/\<sup>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sup>/g))) &&
            (splitText[0].match(/\<sup>/g).length % 2 === 1 && splitText[1].match(/\<\/sup>/g).length % 2 === 1) && cmd === 'SuperScript') {
            isFormat = true;
        }
        return isFormat;
    }
    applyCommands(e) {
        this.currentAction = e.subCommand;
        let textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let addedLength = 0;
        let selection = this.parent.markdownSelection.getSelectedInlinePoints(textArea);
        if (this.isAppliedCommand(e.subCommand) && selection.text !== '') {
            let startCmd = this.syntax[e.subCommand];
            let endCmd = e.subCommand === 'SubScript' ? '</sub>' :
                e.subCommand === 'SuperScript' ? '</sup>' : this.syntax[e.subCommand];
            let startLength = (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') ? 0 : startCmd.length;
            let startNo = textArea.value.substr(0, selection.start).lastIndexOf(startCmd);
            let endNo = textArea.value.substr(selection.end, textArea.value.length).indexOf(endCmd);
            endNo = endNo + selection.end;
            let repStartText = this.replaceAt(textArea.value.substr(0, selection.start), startCmd, '', startNo, selection.start);
            let repEndText = this.replaceAt(textArea.value.substr(selection.end, textArea.value.length), endCmd, '', 0, endNo);
            textArea.value = repStartText + selection.text + repEndText;
            this.restore(textArea, start - startLength, end - startLength, e);
            return;
        }
        if (selection.text !== '' && !this.isApplied(selection, e.subCommand)) {
            addedLength = (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') ? 0 :
                this.syntax[e.subCommand].length;
            let repStart = textArea.value.substr(selection.start - this.syntax[e.subCommand].length, this.syntax[e.subCommand].length);
            let repEnd;
            if ((repStart === e.subCommand) || ((selection.start - this.syntax[e.subCommand].length ===
                textArea.value.indexOf(this.syntax[e.subCommand])) && (selection.end === textArea.value.lastIndexOf(this.syntax[e.subCommand]) || selection.end === textArea.value.lastIndexOf('</' + this.syntax[e.subCommand].substring(1, 5))))) {
                if (e.subCommand === 'SubScript' || e.subCommand === 'SuperScript') {
                    repEnd = textArea.value.substr(selection.end, this.syntax[e.subCommand].length + 1);
                }
                else {
                    repEnd = textArea.value.substr(selection.end, this.syntax[e.subCommand].length);
                }
                let repStartText = this.replaceAt(textArea.value.substr(0, selection.start), repStart, '', selection.start - this.syntax[e.subCommand].length, selection.start);
                let repEndText = this.replaceAt(textArea.value.substr(selection.end, textArea.value.length), repEnd, '', 0, repEnd.length);
                textArea.value = repStartText + selection.text + repEndText;
                this.restore(textArea, start - addedLength, end - addedLength, e);
            }
            else {
                if (e.subCommand === 'SubScript' || e.subCommand === 'SuperScript') {
                    selection.text = this.syntax[e.subCommand] + selection.text
                        + '</' + this.syntax[e.subCommand].substring(1, 5);
                }
                else if (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') {
                    selection.text = (e.subCommand === 'UpperCase') ? selection.text.toUpperCase()
                        : selection.text.toLowerCase();
                }
                else {
                    selection.text = this.syntax[e.subCommand] + selection.text + this.syntax[e.subCommand];
                }
                textArea.value = textArea.value.substr(0, selection.start) + selection.text +
                    textArea.value.substr(selection.end, textArea.value.length);
                this.restore(textArea, start + addedLength, end + addedLength, e);
            }
        }
        else if (e.subCommand !== 'UpperCase' && e.subCommand !== 'LowerCase') {
            if (e.subCommand === 'SubScript' || e.subCommand === 'SuperScript') {
                selection.text = this.textReplace(selection.text, e.subCommand);
                selection.text = this.syntax[e.subCommand] + selection.text
                    + '</' + this.syntax[e.subCommand].substring(1, 5);
            }
            else {
                selection.text = this.textReplace(selection.text, e.subCommand);
                selection.text = this.syntax[e.subCommand] + selection.text + this.syntax[e.subCommand];
            }
            textArea.value = textArea.value.substr(0, selection.start)
                + selection.text + textArea.value.substr(selection.end, textArea.value.length);
            addedLength = this.syntax[e.subCommand].length;
            if (selection.start === selection.end) {
                this.restore(textArea, start + addedLength, end + addedLength, e);
            }
            else {
                this.restore(textArea, start + addedLength, end - addedLength, e);
            }
        }
        else {
            this.restore(textArea, start, end, e);
        }
        this.parent.undoRedoManager.saveData();
    }
    replaceAt(input, search, replace, start, end) {
        return input.slice(0, start)
            + input.slice(start, end).replace(search, replace)
            + input.slice(end);
    }
    restore(textArea, start, end, event) {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: this.currentAction,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
    textReplace(text, command) {
        let regx = this.singleCharRegx(this.syntax[command]);
        switch (command) {
            case 'Bold':
                regx = this.multiCharRegx(this.syntax[command].substr(0, 1));
                text = text.replace(regx, '');
                break;
            case 'Italic':
                if (!this.isBold(text, this.syntax[command].substr(0, 1))) {
                    text = text.replace(regx, '');
                }
                else {
                    let regxB = this.multiCharRegx(this.syntax[command].substr(0, 1));
                    let repText = text;
                    repText = repText.replace(regxB, '$%@').replace(regx, '');
                    let regxTemp = new RegExp('\\$%@', 'g');
                    text = repText.replace(regxTemp, this.syntax[command].substr(0, 1) + this.syntax[command].substr(0, 1));
                }
                break;
            case 'StrikeThrough':
                text = text.replace(regx, '');
                break;
            case 'InlineCode':
                text = text.replace(regx, '');
                break;
            case 'SubScript':
                text = text.replace(/<sub>/g, '').replace(/<\/sub>/g, '');
                break;
            case 'SuperScript':
                text = text.replace(/<sup>/g, '').replace(/<\/sup>/g, '');
                break;
        }
        return text;
    }
    isApplied(line, command) {
        let regx = this.singleCharRegx(this.syntax[command]);
        switch (command) {
            case 'SubScript':
            case 'SuperScript':
                regx = this.singleCharRegx(this.syntax[command]);
                return regx.test(line.text);
            case 'Bold':
            case 'StrikeThrough':
                regx = this.multiCharRegx(this.syntax[command].substr(0, 1));
                return regx.test(line.text);
            case 'UpperCase':
            case 'LowerCase':
                regx = new RegExp('^[' + this.syntax[command] + ']*$', 'g');
                return regx.test(line.text);
            case 'Italic':
                let regTest;
                let regxB = this.multiCharRegx(this.syntax[command].substr(0, 1));
                if (regxB.test(line.text)) {
                    let repText = line.text;
                    repText = repText.replace(regxB, '$%#');
                    regTest = regx.test(repText);
                }
                else {
                    regTest = regx.test(line.text);
                }
                return regTest;
            case 'InlineCode':
                return regx.test(line.text);
        }
    }
}

/**
 * Default Markdown formats config for adapter
 */
const markdownFormatTags = {
    'h6': '###### ',
    'h5': '##### ',
    'h4': '#### ',
    'h3': '### ',
    'h2': '## ',
    'h1': '# ',
    'blockquote': '> ',
    'pre': '```\n',
    'p': ''
};
/**
 * Default selection formats config for adapter
 */
const markdownSelectionTags = {
    'Bold': '**',
    'Italic': '*',
    'StrikeThrough': '~~',
    'InlineCode': '`',
    'SubScript': '<sub>',
    'SuperScript': '<sup>',
    'UpperCase': 'A-Z',
    'LowerCase': 'a-z'
};
/**
 * Default Markdown lists config for adapter
 */
const markdownListsTags = {
    'OL': '1. ',
    'UL': '- ',
};
/**
 * Default html key config for adapter
 */
const htmlKeyConfig = {
    'toolbar-focus': 'alt+f10',
    'escape': '27',
    'insert-link': 'ctrl+k',
    'insert-image': 'ctrl+shift+i',
    'insert-table': 'ctrl+shift+e',
    'undo': 'ctrl+z',
    'redo': 'ctrl+y',
    'copy': 'ctrl+c',
    'cut': 'ctrl+x',
    'paste': 'ctrl+v',
    'bold': 'ctrl+b',
    'italic': 'ctrl+i',
    'underline': 'ctrl+u',
    'strikethrough': 'ctrl+shift+s',
    'uppercase': 'ctrl+shift+u',
    'lowercase': 'ctrl+shift+l',
    'superscript': 'ctrl+shift+=',
    'subscript': 'ctrl+=',
    'indents': 'ctrl+]',
    'outdents': 'ctrl+[',
    'html-source': 'ctrl+shift+h',
    'full-screen': 'ctrl+shift+f',
    'decrease-fontsize': 'ctrl+shift+<',
    'increase-fontsize': 'ctrl+shift+>',
    'justify-center': 'ctrl+e',
    'justify-full': 'ctrl+j',
    'justify-left': 'ctrl+l',
    'justify-right': 'ctrl+r',
    'clear-format': 'ctrl+shift+r',
    'ordered-list': 'ctrl+shift+o',
    'unordered-list': 'ctrl+alt+o',
    'space': '32',
    'enter': '13',
    'tab': 'tab',
    'delete': '46'
};
/**
 * Default  markdown key config for adapter
 */
const markdownKeyConfig = {
    'toolbar-focus': 'alt+f10',
    'escape': '27',
    'insert-link': 'ctrl+k',
    'insert-image': 'ctrl+shift+i',
    'insert-table': 'ctrl+shift+e',
    'undo': 'ctrl+z',
    'redo': 'ctrl+y',
    'copy': 'ctrl+c',
    'cut': 'ctrl+x',
    'paste': 'ctrl+v',
    'bold': 'ctrl+b',
    'italic': 'ctrl+i',
    'strikethrough': 'ctrl+shift+s',
    'uppercase': 'ctrl+shift+u',
    'lowercase': 'ctrl+shift+l',
    'superscript': 'ctrl+shift+=',
    'subscript': 'ctrl+=',
    'full-screen': 'ctrl+shift+f',
    'ordered-list': 'ctrl+shift+o',
    'unordered-list': 'ctrl+alt+o'
};
/**
 * PasteCleanup Grouping of similar functionality tags
 */
const pasteCleanupGroupingTags = {
    'b': ['strong'],
    'strong': ['b'],
    'i': ['emp', 'cite'],
    'emp': ['i', 'cite'],
    'cite': ['i', 'emp']
};
/**
 * PasteCleanup Grouping of similar functionality tags
 */
const listConversionFilters = {
    'first': 'MsoListParagraphCxSpFirst',
    'middle': 'MsoListParagraphCxSpMiddle',
    'last': 'MsoListParagraphCxSpLast'
};
/**
 * Dom-Node Grouping of self closing tags
 * @hidden
 */
const selfClosingTags = [
    'BR',
    'IMG'
];

/**
 * `Undo` module is used to handle undo actions.
 */
class UndoRedoCommands {
    constructor(parent, options) {
        this.undoRedoStack = [];
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    addEventListener() {
        let debounceListener = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(KEY_UP_HANDLER, debounceListener, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(ACTION, this.onAction, this);
        this.parent.observer.on(MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
    }
    onPropertyChanged(props) {
        for (let prop of Object.keys(props.newProp)) {
            switch (prop) {
                case 'undoRedoSteps':
                    this.undoRedoSteps = props.newProp.undoRedoSteps;
                    break;
                case 'undoRedoTimer':
                    this.undoRedoTimer = props.newProp.undoRedoTimer;
                    break;
            }
        }
    }
    removeEventListener() {
        let debounceListener = debounce(this.keyUp, 300);
        this.parent.observer.off(KEY_UP_HANDLER, debounceListener);
        this.parent.observer.off(KEY_DOWN_HANDLER, this.keyDown);
        this.parent.observer.off(ACTION, this.onAction);
        this.parent.observer.off(MODEL_CHANGED_PLUGIN, this.onPropertyChanged);
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
    onAction(e) {
        if (e.subCommand === 'Undo') {
            this.undo(e);
        }
        else {
            this.redo(e);
        }
    }
    keyDown(e) {
        let event = e.event;
        let proxy = this;
        switch (event.action) {
            case 'undo':
                event.preventDefault();
                proxy.undo(e);
                break;
            case 'redo':
                event.preventDefault();
                proxy.redo(e);
                break;
        }
    }
    keyUp(e) {
        if (e.event.keyCode !== 17 && !e.event.ctrlKey) {
            this.saveData(e);
        }
    }
    /**
     * MD collection stored string format.
     * @method saveData
     * @return {void}
     */
    saveData(e) {
        let textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let textValue = this.parent.element.value;
        let changEle = { text: textValue, start: start, end: end };
        if (this.undoRedoStack.length >= this.steps) {
            this.undoRedoStack = this.undoRedoStack.slice(0, this.steps + 1);
        }
        if (this.undoRedoStack.length > 1 && (this.undoRedoStack[this.undoRedoStack.length - 1].start === start) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].end === end)) {
            return;
        }
        this.undoRedoStack.push(changEle);
        this.steps = this.undoRedoStack.length - 1;
        if (this.steps > this.undoRedoSteps) {
            this.undoRedoStack.shift();
            this.steps--;
        }
        if (e && e.callBack) {
            e.callBack();
        }
    }
    /**
     * Undo the editable text.
     * @method undo
     * @return {void}
     */
    undo(e) {
        if (this.steps > 0) {
            this.currentAction = 'Undo';
            let start = this.undoRedoStack[this.steps - 1].start;
            let end = this.undoRedoStack[this.steps - 1].end;
            let removedContent = this.undoRedoStack[this.steps - 1].text;
            this.parent.element.value = removedContent;
            this.parent.element.focus();
            this.steps--;
            this.restore(this.parent.element, start, end, e);
        }
    }
    /**
     * Redo the editable text.
     * @method redo
     * @return {void}
     */
    redo(e) {
        if (this.undoRedoStack[this.steps + 1] != null) {
            this.currentAction = 'Redo';
            let start = this.undoRedoStack[this.steps + 1].start;
            let end = this.undoRedoStack[this.steps + 1].end;
            this.parent.element.value = this.undoRedoStack[this.steps + 1].text;
            this.parent.element.focus();
            this.steps++;
            this.restore(this.parent.element, start, end, e);
        }
    }
    restore(textArea, start, end, event) {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: this.currentAction,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
    getUndoStatus() {
        let status = { undo: false, redo: false };
        if (this.steps > 0) {
            status.undo = true;
        }
        if (this.undoRedoStack[this.steps + 1] != null) {
            status.redo = true;
        }
        return status;
    }
}

/**
 * Link internal component
 * @hidden
 */
class MDLink {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(LINK_COMMAND, this.createLink, this);
    }
    createLink(e) {
        let textArea = this.parent.element;
        textArea.focus();
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let text = (e.subCommand === 'Image') ? this.selection.getSelectedText(textArea) : e.item.text;
        let startOffset = (e.subCommand === 'Image') ? (start + 2) : (start + 1);
        let endOffset = (e.subCommand === 'Image') ? (end + 2) : (end + 1);
        text = (e.subCommand === 'Image') ? '![' + text + '](' + e.item.url + ')' : '[' + text + '](' + e.item.url + ')';
        textArea.value = textArea.value.substr(0, start)
            + text + textArea.value.substr(end, textArea.value.length);
        this.parent.markdownSelection.setSelection(textArea, startOffset, endOffset);
        this.restore(textArea, startOffset, endOffset, e);
    }
    restore(textArea, start, end, event) {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: event.subCommand,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
}

/**
 * Link internal component
 * @hidden
 */
class MDTable {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(options) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(MD_TABLE, this.createTable, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    }
    removeEventListener() {
        this.parent.observer.off(MD_TABLE, this.createTable);
        this.parent.observer.off(KEY_DOWN_HANDLER, this.onKeyDown);
    }
    destroy() {
        this.removeEventListener();
    }
    onKeyDown(e) {
        if (e.event.action === 'insert-table') {
            e.item = e.value;
            this.createTable(e);
        }
    }
    createTable(e) {
        this.element = this.parent.element;
        let start = this.element.selectionStart;
        let end = this.element.selectionEnd;
        let textAreaInitial;
        textAreaInitial = this.element.value;
        this.locale = e;
        this.selection.save(start, end);
        this.restore(this.element.selectionStart, this.element.selectionEnd, null);
        this.insertTable(start, end, textAreaInitial, e);
    }
    getTable() {
        let table = '';
        table += this.textNonEmpty();
        table += this.tableHeader(this.locale);
        table += this.tableCell(this.locale);
        return table;
    }
    tableHeader(e) {
        let text = '';
        for (let i = 1; i <= 2; i++) {
            text += '|';
            for (let j = 1; j <= 2; j++) {
                if (i === 1) {
                    text += e.item.headingText + ' ' + j + '|';
                }
                else {
                    text += '---------|';
                }
            }
            text += this.insertLine();
        }
        return text;
    }
    tableCell(e) {
        let text = '';
        for (let i = 1; i <= 2; i++) {
            text += '|';
            for (let j = 1; j <= 2; j++) {
                text += e.item.colText + ' ' + this.convertToLetters(i) + j + '|';
            }
            text += this.insertLine();
        }
        text += this.insertLine();
        return text;
    }
    insertLine() {
        let dummyElement = document.createElement('div');
        dummyElement.innerHTML = '\n';
        return dummyElement.textContent;
    }
    insertTable(start, end, textAreaInitial, e) {
        let parentText = this.selection.getSelectedParentPoints(this.element);
        let lastLineSplit = parentText[parentText.length - 1].text.split(' ', 2);
        let syntaxArr = this.getFormatTag();
        if (lastLineSplit.length < 2) {
            this.element.value = this.updateValue(this.getTable());
            this.makeSelection(textAreaInitial, start, end);
        }
        else {
            if (this.ensureFormatApply(parentText[parentText.length - 1].text)) {
                this.checkValid(start, end, this.getTable(), textAreaInitial, e, lastLineSplit, parentText, syntaxArr);
            }
            else {
                this.element.value = this.updateValue(this.getTable());
                this.makeSelection(textAreaInitial, start, end);
            }
        }
        this.restore(this.element.selectionStart, this.element.selectionEnd, e);
    }
    makeSelection(textAreaInitial, start, end) {
        end = start + (textAreaInitial.length > 0 ? 12 : 10); //end is added 12 or 10 because to make the table heading selected
        start += textAreaInitial.length > 0 ? 3 : 1; // Start is added 3 or 1 because new lines are added when inserting table
        this.selection.setSelection(this.element, start, end);
    }
    getFormatTag() {
        let syntaxFormatKey = Object.keys(this.syntaxTag.Formats);
        let syntaxListKey = Object.keys(this.syntaxTag.List);
        let syntaxArr = [];
        for (let i = 0; i < syntaxFormatKey.length; i++) {
            syntaxArr.push(this.syntaxTag.Formats[syntaxFormatKey[i]]);
        }
        for (let j = 0; j < syntaxListKey.length; j++) {
            syntaxArr.push(this.syntaxTag.List[syntaxListKey[j]]);
        }
        return syntaxArr;
    }
    ensureFormatApply(line) {
        let formatTags = this.getFormatTag();
        let formatSplitZero = line.trim().split(' ', 2)[0] + ' ';
        for (let i = 0; i < formatTags.length; i++) {
            if (formatSplitZero === formatTags[i] || /^[\d.]+[ ]+$/.test(formatSplitZero)) {
                return true;
            }
        }
        return false;
    }
    ensureStartValid(firstLine, parentText) {
        let firstLineSplit = parentText[0].text.split(' ', 2);
        for (let i = firstLine + 1; i <= firstLine + firstLineSplit[0].length + 1; i++) {
            if (this.element.selectionStart === i || this.element.selectionEnd === i) {
                return false;
            }
        }
        return true;
    }
    ensureEndValid(lastLine, formatSplitLength) {
        for (let i = lastLine + 1; i <= lastLine + formatSplitLength + 1; i++) {
            if (this.element.selectionEnd === i) {
                return false;
            }
        }
        return true;
    }
    updateValueWithFormat(formatSplit, text) {
        let textApplyFormat = this.element.value.substring(this.element.selectionEnd, this.element.value.length);
        text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
        return this.element.value.substr(0, this.element.selectionStart) + text;
    }
    updateValue(text) {
        return this.element.value.substr(0, this.element.selectionStart) + text +
            this.element.value.substr(this.element.selectionEnd, this.element.value.length);
    }
    checkValid(start, end, text, textAreaInitial, e, formatSplit, parentText, syntaxArr) {
        if (this.ensureStartValid(parentText[0].start, parentText) &&
            this.ensureEndValid(parentText[parentText.length - 1].start, formatSplit[0].length)) {
            if (start === parentText[0].start) {
                if (start !== end && end !== (parentText[parentText.length - 1].end - 1)) {
                    this.element.value = this.updateValueWithFormat(formatSplit, text);
                }
                else {
                    this.element.value = this.updateValue(text);
                }
            }
            else if (end === parentText[parentText.length - 1].end - 1) {
                this.element.value = this.updateValue(text);
            }
            else {
                this.element.value = this.updateValueWithFormat(formatSplit, text);
            }
            this.makeSelection(textAreaInitial, start, end);
        }
    }
    convertToLetters(rowNumber) {
        let baseChar = ('A').charCodeAt(0);
        let letters = '';
        do {
            rowNumber -= 1;
            letters = String.fromCharCode(baseChar + (rowNumber % 26)) + letters;
            rowNumber = (rowNumber / 26) >> 0;
        } while (rowNumber > 0);
        return letters;
    }
    textNonEmpty() {
        let emptyText = '';
        if (this.isCursorBased() || this.isSelectionBased()) {
            if (this.element.value.length > 0) {
                emptyText += this.insertLine();
                emptyText += this.insertLine(); // to append two new line when textarea having content.               
            }
        }
        return emptyText;
    }
    isCursorBased() {
        return this.element.selectionStart === this.element.selectionEnd;
    }
    isSelectionBased() {
        return this.element.selectionStart !== this.element.selectionEnd;
    }
    restore(start, end, event) {
        this.selection.save(start, end);
        this.selection.restore(this.element);
        if (event && event.callBack) {
            event.callBack({
                requestType: event.subCommand,
                selectedText: this.selection.getSelectedText(this.element),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
}

/**
 * Link internal component
 * @hidden
 */
class ClearFormat {
    /**
     * Constructor for creating the clear format plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(CLEAR_COMMAND, this.clear, this);
    }
    replaceRegex(data) {
        return data.replace(/\*/ig, '\\*').replace(/\&/ig, '\\&')
            .replace(/\-/ig, '\\-').replace(/\^/ig, '\\^')
            .replace(/\$/ig, '\\$').replace(/\./ig, '\\.')
            .replace(/\|/ig, '\\|').replace(/\?/ig, '\\?')
            .replace(/\+/ig, '\\+').replace(/\-/ig, '\\-')
            .replace(/\&/ig, '\\&');
    }
    clearSelectionTags(text) {
        let data = this.parent.selectionTags;
        let keys = Object.keys(data);
        for (let num = 0; num < keys.length; num++) {
            let key = keys[num];
            if (data.hasOwnProperty(key) && data[key] !== '') {
                let expString = this.replaceRegex(data[key]);
                let regExp;
                let startExp;
                let endExp;
                if (data[key] === '<sup>') {
                    regExp = new RegExp('<sup>(.*?)<\/sup>', 'ig');
                }
                else if (data[key] === '<sub>') {
                    regExp = new RegExp('<sub>(.*?)<\/sub>', 'ig');
                }
                else {
                    regExp = new RegExp(expString + '(.*?)' + expString, 'ig');
                }
                startExp = data[key].length;
                endExp = (data[key] === '<sup>' || data[key] === '<sub>') ? data[key].length + 1 : data[key].length;
                let val = text.match(regExp);
                for (let index = 0; val && index < val.length && val[index] !== ''; index++) {
                    text = text.replace(val[index], val[index].substr(startExp, val[index].length - endExp - startExp));
                }
            }
        }
        return text;
    }
    clearFormatTags(text) {
        let lines = text.split('\n');
        return this.clearFormatLines(lines);
    }
    clearFormatLines(lines) {
        let tags = [this.parent.formatTags, this.parent.listTags];
        let str = '';
        for (let len = 0; len < lines.length; len++) {
            for (let num = 0; num < tags.length; num++) {
                let data = tags[num];
                let keys = Object.keys(data);
                for (let index = 0; index < keys.length; index++) {
                    let key = keys[index];
                    if (data.hasOwnProperty(key) && data[key] !== '') {
                        if (lines[len].indexOf(data[key]) === 0) {
                            lines[len] = lines[len].replace(data[key], '');
                            lines[len] = this.clearFormatLines([lines[len]]);
                        }
                    }
                }
            }
            str = str + lines[len] + ((len !== lines.length - 1) ? '\n' : '');
        }
        return str;
    }
    clear(e) {
        let textArea = this.parent.element;
        textArea.focus();
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let text = this.selection.getSelectedText(textArea);
        text = this.clearSelectionTags(text);
        text = this.clearFormatTags(text);
        textArea.value = textArea.value.substr(0, start)
            + text + textArea.value.substr(end, textArea.value.length);
        this.parent.markdownSelection.setSelection(textArea, start, start + text.length);
        this.restore(textArea, start, start + text.length, e);
    }
    restore(textArea, start, end, event) {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: event.subCommand,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
}

/**
 * MarkdownParser internal component
 * @hidden
 */
class MarkdownParser {
    /**
     * Constructor for creating the component
     * @hidden
     */
    constructor(options) {
        this.initialize();
        extend(this, this, options, true);
        this.observer = new Observer(this);
        this.markdownSelection = new MarkdownSelection();
        this.listObj = new MDLists({ parent: this, syntax: this.listTags });
        this.formatObj = new MDFormats({ parent: this, syntax: this.formatTags });
        this.undoRedoManager = new UndoRedoCommands(this, options.options);
        this.mdSelectionFormats = new MDSelectionFormats({ parent: this, syntax: this.selectionTags });
        this.linkObj = new MDLink(this);
        this.tableObj = new MDTable({ parent: this, syntaxTag: ({ Formats: this.formatTags, List: this.listTags }) });
        this.clearObj = new ClearFormat(this);
        this.wireEvents();
    }
    initialize() {
        this.formatTags = markdownFormatTags;
        this.listTags = markdownListsTags;
        this.selectionTags = markdownSelectionTags;
    }
    wireEvents() {
        this.observer.on(KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(KEY_UP, this.editorKeyUp, this);
        this.observer.on(MODEL_CHANGED, this.onPropertyChanged, this);
    }
    onPropertyChanged(props) {
        this.observer.notify(MODEL_CHANGED_PLUGIN, props);
    }
    editorKeyDown(e) {
        this.observer.notify(KEY_DOWN_HANDLER, e);
    }
    editorKeyUp(e) {
        this.observer.notify(KEY_UP_HANDLER, e);
    }
    execCommand(command, value, event, callBack, text, exeValue) {
        switch (command.toLocaleLowerCase()) {
            case 'lists':
                this.observer.notify(LISTS_COMMAND, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'formats':
                this.observer.notify(FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'actions':
                this.observer.notify(ACTION, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'style':
            case 'effects':
            case 'casing':
                this.observer.notify(selectionCommand, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'links':
            case 'images':
                this.observer.notify(LINK_COMMAND, { subCommand: value, event: event, callBack: callBack, item: exeValue });
                break;
            case 'table':
                switch (value.toString().toLocaleLowerCase()) {
                    case 'createtable':
                        this.observer.notify(MD_TABLE, { subCommand: value, item: exeValue, event: event, callBack: callBack });
                        break;
                }
                break;
            case 'clear':
                this.observer.notify(CLEAR_COMMAND, { subCommand: value, event: event, callBack: callBack });
                break;
        }
    }
}

/**
 * Markdown adapter
 * @hidden
 */
class MarkdownFormatter extends Formatter {
    constructor(options) {
        super();
        this.initialize();
        extend(this, this, options, true);
        if (options && this.element) {
            this.updateFormatter(this.element, document, options.options);
        }
    }
    initialize() {
        this.keyConfig = markdownKeyConfig;
        this.formatTags = markdownFormatTags;
        this.listTags = markdownListsTags;
        this.selectionTags = markdownSelectionTags;
    }
    /**
     * Update the formatter of RichTextEditor
     * @param  {Element} editElement
     * @param  {Document} doc
     */
    updateFormatter(editElement, doc, options) {
        if (editElement) {
            this.editorManager = new MarkdownParser({
                element: editElement,
                formatTags: this.formatTags,
                listTags: this.listTags,
                selectionTags: this.selectionTags,
                options: options
            });
        }
    }
}

/**
 * Markdown module is used to render RichTextEditor as Markdown editor content
 * @hidden
 */
class MarkdownRender {
    /**
     * Constructor for content renderer module
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * The function is used to render RichTextEditor content div
     */
    renderPanel() {
        let rteObj = this.parent;
        let div = this.parent.createElement('div', { id: this.parent.getID() + '_view', className: 'e-rte-content' });
        this.editableElement = this.parent.createElement('textarea', {
            className: 'e-content',
            id: this.parent.getID() + '_editable-content'
        });
        div.appendChild(this.editableElement);
        this.setPanel(div);
        rteObj.element.appendChild(div);
    }
    /**
     * Get the content div element of RichTextEditor
     * @return {Element}
     */
    getPanel() {
        return this.contentPanel;
    }
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     */
    getEditPanel() {
        return this.editableElement;
    }
    /**
     * Returns the text content as string.
     * @return {string}
     */
    getText() {
        return this.getEditPanel().value;
    }
    /**
     * Set the content div element of RichTextEditor
     * @param  {Element} panel
     */
    setPanel(panel) {
        this.contentPanel = panel;
    }
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     */
    getDocument() {
        return this.getEditPanel().ownerDocument;
    }
}

/**
 * `MarkdownEditor` module is used to markdown editor
 */
class MarkdownEditor {
    constructor(parent, serviceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    /**
     * Destroys the Markdown.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.saveSelection = new MarkdownSelection();
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(initialEnd, this.render, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(markdownToolbarClick, this.onToolbarClick, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(selectAll$1, this.selectAll, this);
        this.parent.on(getSelectedHtml, this.getSelectedHtml, this);
        this.parent.on(selectionSave, this.onSelectionSave, this);
        this.parent.on(selectionRestore, this.onSelectionRestore, this);
        this.parent.on(readOnlyMode, this.updateReadOnly, this);
    }
    updateReadOnly() {
        if (this.parent.readonly) {
            this.parent.contentModule.getEditPanel().setAttribute('readonly', 'readonly');
            addClass([this.parent.element], CLS_RTE_READONLY);
        }
        else {
            this.parent.contentModule.getEditPanel().removeAttribute('readonly');
            removeClass([this.parent.element], CLS_RTE_READONLY);
        }
    }
    onSelectionSave() {
        let textArea = this.parent.contentModule.getEditPanel();
        this.saveSelection.save(textArea.selectionStart, textArea.selectionEnd);
    }
    onSelectionRestore(e) {
        this.contentRenderer.getEditPanel().focus();
        let textArea = this.parent.contentModule.getEditPanel();
        this.saveSelection.restore(textArea);
    }
    onToolbarClick(args) {
        let text;
        let startOffset;
        let endOffset;
        let item = args.item;
        if (this.parent.editorMode === 'Markdown') {
            let textArea = this.parent.contentModule.getEditPanel();
            textArea.focus();
            startOffset = textArea.selectionStart;
            endOffset = textArea.selectionEnd;
            text = textArea.value.substring(startOffset, endOffset);
        }
        switch (item.subCommand) {
            case 'Maximize':
                this.parent.notify(enableFullScreen, { args: args });
                break;
            case 'Minimize':
                this.parent.notify(disableFullScreen, { args: args });
                break;
            case 'CreateLink':
                this.parent.notify(insertLink, { member: 'link', args: args, text: text, module: 'Markdown' });
                break;
            case 'Image':
                this.parent.notify(insertImage, { member: 'image', args: args, text: text, module: 'Markdown' });
                break;
            case 'CreateTable':
                let tableConstant = {
                    'headingText': this.parent.localeObj.getConstant('TableHeadingText'),
                    'colText': this.parent.localeObj.getConstant('TableColText')
                };
                this.parent.formatter.process(this.parent, args, args.originalEvent, tableConstant);
                break;
            default:
                this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                break;
        }
    }
    instantiateRenderer() {
        this.renderFactory.addRenderer(RenderType.Content, new MarkdownRender(this.parent));
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialEnd, this.render);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(destroy, this.destroy);
        this.parent.off(markdownToolbarClick, this.onToolbarClick);
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(selectAll$1, this.selectAll);
        this.parent.off(getSelectedHtml, this.getSelectedHtml);
        this.parent.off(selectionSave, this.onSelectionSave);
        this.parent.off(selectionRestore, this.onSelectionRestore);
        this.parent.off(readOnlyMode, this.updateReadOnly);
    }
    render() {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        let editElement = this.contentRenderer.getEditPanel();
        let option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.formatter)) {
            this.parent.formatter = new MarkdownFormatter({
                element: editElement,
                options: option
            });
        }
        else {
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new MarkdownToolbarStatus(this.parent);
        }
        this.parent.notify(bindOnEnd, {});
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(e) {
        // On property code change here
        if (!isNullOrUndefined(e.newProp.formatter)) {
            let editElement = this.contentRenderer.getEditPanel();
            let option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'markdownEditor';
    }
    /**
     * For selecting all content in RTE
     * @private
     */
    selectAll() {
        this.parent.formatter.editorManager.markdownSelection.setSelection(this.parent.contentModule.getEditPanel(), 0, this.parent.contentModule.getEditPanel().value.length);
    }
    /**
     * For get a selected text in RTE
     * @private
     */
    getSelectedHtml(e) {
        e.callBack(this.parent.formatter.editorManager.markdownSelection.getSelectedText(this.parent.contentModule.getEditPanel()));
    }
}

/**
 * Constant values for EditorManager
 */
/* Image plugin events
 * @hidden
 */
const IMAGE = 'INSERT-IMAGE';
const TABLE = 'INSERT-TABLE';
const LINK = 'INSERT-LINK';
const INSERT_ROW = 'INSERT-ROW';
const INSERT_COLUMN = 'INSERT-COLUMN';
const DELETEROW = 'DELETE-ROW';
const DELETECOLUMN = 'DELETE-COLUMN';
const REMOVETABLE = 'REMOVE-TABLE';
const TABLEHEADER = 'TABLE-HEADER';
const TABLE_VERTICAL_ALIGN = 'TABLE_VERTICAL_ALIGN';
/* Alignments plugin events
 * @hidden
 */
const ALIGNMENT_TYPE = 'alignment-type';
/* Indents plugin events
 * @hidden
 */
const INDENT_TYPE = 'indent-type';
/* Constant tag names
 */
/** @hidden */
const DEFAULT_TAG = 'p';
/** @hidden */
const BLOCK_TAGS = ['address', 'article', 'aside', 'audio', 'blockquote',
    'canvas', 'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav',
    'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr', 'ul', 'video'];
/** @hidden */
const IGNORE_BLOCK_TAGS = ['td', 'th'];
/** @hidden */
const TABLE_BLOCK_TAGS = ['table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr'];
/* Selection plugin events
 * @hidden
 */
const SELECTION_TYPE = 'selection-type';
/* Insert HTML plugin events
 * @hidden
 */
const INSERTHTML_TYPE = 'inserthtml-type';
/* Insert Text plugin events
 * @hidden
 */
const INSERT_TEXT_TYPE = 'insert-text-type';
/* Clear Format HTML plugin events
 * @hidden
 */
const CLEAR_TYPE = 'clear-type';

/**
 * `Selection` module is used to handle RTE Selections.
 */
class NodeSelection {
    constructor() {
        this.startNodeName = [];
        this.endNodeName = [];
    }
    saveInstance(range, body) {
        this.range = range.cloneRange();
        this.rootNode = this.documentFromRange(range);
        this.body = body;
        this.startContainer = this.getNodeArray(range.startContainer, true);
        this.endContainer = this.getNodeArray(range.endContainer, false);
        this.startOffset = range.startOffset;
        this.endOffset = range.endOffset;
        this.html = this.body.innerHTML;
        return this;
    }
    documentFromRange(range) {
        return (9 === range.startContainer.nodeType) ? range.startContainer : range.startContainer.ownerDocument;
    }
    getRange(docElement) {
        let select$$1 = this.get(docElement);
        let range = select$$1 && select$$1.rangeCount > 0 ? select$$1.getRangeAt(select$$1.rangeCount - 1) : docElement.createRange();
        return (range.startContainer !== docElement || range.endContainer !== docElement
            || range.startOffset || range.endOffset || (range.setStart(docElement.body, 0), range.collapse(!0)), range);
    }
    get(docElement) {
        return docElement.defaultView.getSelection();
    }
    save(range, docElement) {
        range = (range) ? range.cloneRange() : this.getRange(docElement);
        return this.saveInstance(range, docElement.body);
    }
    getIndex(node) {
        let index;
        let num = 0;
        node = !node.previousSibling && node.tagName === 'BR' ? node : node.previousSibling;
        if (node) {
            for (let type = node.nodeType; node; null) {
                index = node.nodeType;
                num++;
                type = index;
                node = node.previousSibling;
            }
        }
        return num;
    }
    isChildNode(nodeCollection, parentNode) {
        for (let index = 0; index < parentNode.childNodes.length; index++) {
            if (nodeCollection.indexOf(parentNode.childNodes[index]) > -1) {
                return true;
            }
        }
        return false;
    }
    getNode(startNode, endNode, nodeCollection) {
        if (endNode === startNode &&
            (startNode.nodeType === 3 || !startNode.firstChild || nodeCollection.indexOf(startNode.firstChild) !== -1
                || this.isChildNode(nodeCollection, startNode))) {
            return null;
        }
        if (nodeCollection.indexOf(startNode.firstChild) === -1 && startNode.firstChild && !this.isChildNode(nodeCollection, startNode)) {
            return startNode.firstChild;
        }
        if (startNode.nextSibling) {
            return startNode.nextSibling;
        }
        if (!startNode.parentNode) {
            return null;
        }
        else {
            return startNode.parentNode;
        }
    }
    getNodeCollection(range) {
        let startNode = range.startContainer.childNodes[range.startOffset]
            || range.startContainer;
        let endNode = range.endContainer.childNodes[(range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer;
        if (startNode === endNode && startNode.childNodes.length === 0) {
            return [startNode];
        }
        let nodeCollection = [];
        do {
            if (nodeCollection.indexOf(startNode) === -1) {
                nodeCollection.push(startNode);
            }
            startNode = this.getNode(startNode, endNode, nodeCollection);
        } while (startNode);
        return nodeCollection;
    }
    getParentNodeCollection(range) {
        return this.getParentNodes(this.getNodeCollection(range), range);
    }
    getParentNodes(nodeCollection, range) {
        nodeCollection = nodeCollection.reverse();
        for (let index = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection.indexOf(nodeCollection[index].parentNode) !== -1)
                || (nodeCollection[index].nodeType === 3 &&
                    range.startContainer !== range.endContainer &&
                    range.startContainer.parentNode !== range.endContainer.parentNode)) {
                nodeCollection.splice(index, 1);
                index--;
            }
            else if (nodeCollection[index].nodeType === 3) {
                nodeCollection[index] = nodeCollection[index].parentNode;
            }
        }
        return nodeCollection;
    }
    getSelectionNodeCollection(range) {
        return this.getSelectionNodes(this.getNodeCollection(range));
    }
    getSelectionNodes(nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        for (let index = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeType !== 3 || nodeCollection[index].textContent.trim() === '') {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    }
    getInsertNodeCollection(range) {
        return this.getInsertNodes(this.getNodeCollection(range));
    }
    getInsertNodes(nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        for (let index = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection[index].childNodes.length !== 0 &&
                nodeCollection[index].nodeType !== 3) ||
                (nodeCollection[index].nodeType === 3 &&
                    nodeCollection[index].textContent === '')) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    }
    getNodeArray(node, isStart, root) {
        let array = [];
        ((isStart) ? (this.startNodeName = []) : (this.endNodeName = []));
        for (; node !== (root ? root : this.rootNode); null) {
            (isStart) ? this.startNodeName.push(node.nodeName.toLowerCase()) : this.endNodeName.push(node.nodeName.toLowerCase());
            array.push(this.getIndex(node));
            node = node.parentNode;
        }
        return array;
    }
    setRangePoint(range, isvalid, num, size) {
        let node = this.rootNode;
        let index = num.length;
        let constant = size;
        for (; index--; null) {
            node = node && node.childNodes[num[index]];
        }
        if (node && constant >= 0) {
            range[isvalid ? 'setStart' : 'setEnd'](node, constant);
        }
        return range;
    }
    restore() {
        let range = this.range.cloneRange();
        range = this.setRangePoint(range, true, this.startContainer, this.startOffset);
        range = this.setRangePoint(range, false, this.endContainer, this.endOffset);
        this.selectRange(this.rootNode, range);
        return range;
    }
    selectRange(docElement, range) {
        this.setRange(docElement, range);
        this.save(range, docElement);
    }
    setRange(docElement, range) {
        let selection = this.get(docElement);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    setSelectionText(docElement, startNode, endNode, startIndex, endIndex) {
        let range = docElement.createRange();
        range.setStart(startNode, startIndex);
        range.setEnd(endNode, endIndex);
        this.setRange(docElement, range);
    }
    setSelectionContents(docElement, element) {
        let range = docElement.createRange();
        range.selectNode(element);
        this.setRange(docElement, range);
    }
    setSelectionNode(docElement, element) {
        let range = docElement.createRange();
        range.selectNodeContents(element);
        this.setRange(docElement, range);
    }
    getSelectedNodes(docElement) {
        return this.getNodeCollection(this.getRange(docElement));
    }
    Clear(docElement) {
        this.get(docElement).removeAllRanges();
    }
    insertParentNode(docElement, newNode, range) {
        range.surroundContents(newNode);
        this.selectRange(docElement, range);
    }
    setCursorPoint(docElement, element, point) {
        let range = docElement.createRange();
        let selection = docElement.defaultView.getSelection();
        range.setStart(element, point);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

/**
 * `Selection` module is used to handle RTE Selections.
 */

const markerClassName = {
    startSelection: 'e-editor-select-start',
    endSelection: 'e-editor-select-end'
};
/**
 * DOMNode internal plugin
 * @hidden
 */
class DOMNode {
    /**
     * Constructor for creating the DOMNode plugin
     * @hidden
     */
    constructor(parent, currentDocument) {
        this.parent = parent;
        this.nodeSelection = new NodeSelection();
        this.currentDocument = currentDocument;
    }
    contents(element) {
        return (element && 'IFRAME' !== element.tagName ? Array.prototype.slice.call(element.childNodes || []) : []);
    }
    isBlockNode(element) {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) >= 0));
    }
    isLink(element) {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && 'a' === element.tagName.toLowerCase()));
    }
    blockParentNode(element) {
        for (; element && element.parentNode !== this.parent && ((!element.parentNode ||
            !this.hasClass(element.parentNode, 'e-node-inner'))); null) {
            element = element.parentNode;
            if (this.isBlockNode(element)) {
                return element;
            }
        }
        return element;
    }
    rawAttributes(element) {
        let rawAttr = {};
        let attributes$$1 = element.attributes;
        if (attributes$$1.length > 0) {
            for (let d = 0; d < attributes$$1.length; d++) {
                let e = attributes$$1[d];
                rawAttr[e.nodeName] = e.value;
            }
        }
        return rawAttr;
    }
    attributes(element) {
        if (!element) {
            return '';
        }
        let attr = '';
        let rawAttr = this.rawAttributes(element);
        let orderRawAttr = Object.keys(rawAttr).sort();
        for (let e = 0; e < orderRawAttr.length; e++) {
            let attrKey = orderRawAttr[e];
            let attrValue = rawAttr[attrKey];
            /* tslint:disable */
            if (attrValue.indexOf("'") < 0 && attrValue.indexOf('"') >= 0) {
                attr += ' ' + attrKey + "='" + attrValue + "'";
            }
            else if (attrValue.indexOf('"') >= 0 && attrValue.indexOf("'") >= 0) {
                /* tslint:enable */
                attrValue = attrValue.replace(/"/g, '&quot;');
                attr += ' ' + attrKey + '="' + attrValue + '"';
            }
            else {
                attr += ' ' + attrKey + '="' + attrValue + '"';
            }
        }
        return attr;
    }
    clearAttributes(element) {
        for (let attr = element.attributes, c = attr.length - 1; c >= 0; c--) {
            let key = attr[c];
            element.removeAttribute(key.nodeName);
        }
    }
    openTagString(element) {
        return '<' + element.tagName.toLowerCase() + this.attributes(element) + '>';
    }
    closeTagString(element) {
        return '</' + element.tagName.toLowerCase() + '>';
    }
    createTagString(tagName, relativeElement, innerHTML) {
        return '<' + tagName.toLowerCase() + this.attributes(relativeElement) + '>' + innerHTML + '</' + tagName.toLowerCase() + '>';
    }
    isList(element) {
        return !!element && ['UL', 'OL'].indexOf(element.tagName) >= 0;
    }
    isElement(element) {
        return element === this.parent;
    }
    isEditable(element) {
        return ((!element.getAttribute || element.getAttribute('contenteditable') === 'true')
            && ['STYLE', 'SCRIPT'].indexOf(element.tagName) < 0);
    }
    hasClass(element, className) {
        return element && element.classList && element.classList.contains(className);
    }
    replaceWith(element, value) {
        let parentNode = element.parentNode;
        parentNode.insertBefore(this.parseHTMLFragment(value), element);
        detach(element);
    }
    parseHTMLFragment(value) {
        /* tslint:disable */
        let temp = createElement('template');
        temp.innerHTML = value;
        if (temp.content instanceof DocumentFragment) {
            return temp.content;
        }
        else {
            return document.createRange().createContextualFragment(value);
        }
        /* tslint:enable */
    }
    wrap(element, wrapper) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper = element.previousSibling;
        wrapper.appendChild(element);
        return wrapper;
    }
    insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    wrapInner(parent, wrapper) {
        parent.appendChild(wrapper);
        wrapper = parent.querySelector('.e-rte-wrap-inner');
        wrapper.classList.remove('e-rte-wrap-inner');
        if (wrapper.classList.length === 0) {
            wrapper.removeAttribute('class');
        }
        while (parent.firstChild !== wrapper) {
            wrapper.appendChild(parent.firstChild);
        }
        return wrapper;
    }
    unWrap(element) {
        let parent = element.parentNode;
        let unWrapNode = [];
        while (element.firstChild) {
            unWrapNode.push(element.firstChild);
            parent.insertBefore(element.firstChild, element);
        }
        unWrapNode = unWrapNode.length > 0 ? unWrapNode : [element.parentNode];
        parent.removeChild(element);
        return unWrapNode;
    }
    getSelectedNode(element, index) {
        if (element.nodeType === Node.ELEMENT_NODE && element.childNodes.length > 0 &&
            element.childNodes[index - 1] && element.childNodes[index - 1].nodeType === Node.ELEMENT_NODE &&
            (element.childNodes[index - 1].classList.contains(markerClassName.startSelection) ||
                element.childNodes[index - 1].classList.contains(markerClassName.endSelection))) {
            element = element.childNodes[index - 1];
        }
        else if (element.nodeType === Node.ELEMENT_NODE && element.childNodes.length > 0 && element.childNodes[index]) {
            element = element.childNodes[index];
        }
        if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentNode;
        }
        return element;
    }
    nodeFinds(element, elements) {
        let existNodes = [];
        for (let i = 0; i < elements.length; i++) {
            if (element.contains(elements[i]) && element !== elements[i]) {
                existNodes.push(elements[i]);
            }
        }
        return existNodes;
    }
    isEditorArea() {
        let range = this.getRangePoint(0);
        let element;
        for (element = range.commonAncestorContainer; element && !this.isElement(element); null) {
            element = element.parentNode;
        }
        return !!this.isElement(element);
    }
    getRangePoint(point) {
        let selection = this.getSelection();
        let ranges = [];
        if (selection && selection.getRangeAt && selection.rangeCount) {
            ranges = [];
            for (let f = 0; f < selection.rangeCount; f++) {
                ranges.push(selection.getRangeAt(f));
            }
        }
        else {
            ranges = [this.currentDocument.createRange()];
        }
        return 'undefined' !== typeof point ? ranges[point] : ranges;
    }
    getSelection() {
        return this.nodeSelection.get(this.currentDocument);
    }
    getPreviousNode(element) {
        element = element.previousElementSibling;
        for (; element && element.textContent === '\n'; null) {
            element = element.previousElementSibling;
        }
        return element;
    }
    encode(value) {
        let divNode = document.createElement('div');
        divNode.innerText = value;
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }
    saveMarker(save, action) {
        let start = this.parent.querySelector('.' + markerClassName.startSelection);
        let end = this.parent.querySelector('.' + markerClassName.endSelection);
        let startTextNode;
        let endTextNode;
        if (start.textContent === '' && isNullOrUndefined(end) && action !== 'tab') {
            if (start.childNodes.length === 1 && start.childNodes[0].nodeName === 'BR') {
                start.innerHTML = '&#65279;&#65279;<br>';
            }
            else {
                start.innerHTML = '&#65279;&#65279;';
            }
        }
        if (this.hasClass(start, markerClassName.startSelection) && start.classList.length > 1) {
            let replace = this.createTagString(DEFAULT_TAG, start, this.encode(start.textContent));
            this.replaceWith(start, replace);
            start = this.parent.querySelector('.' + markerClassName.startSelection);
            start.classList.remove(markerClassName.startSelection);
            startTextNode = start.childNodes[0];
        }
        else {
            startTextNode = this.unWrap(start)[0];
        }
        if (this.hasClass(end, markerClassName.endSelection) && end.classList.length > 1) {
            let replace = this.createTagString(DEFAULT_TAG, end, this.encode(end.textContent));
            this.replaceWith(end, replace);
            end = this.parent.querySelector('.' + markerClassName.endSelection);
            end.classList.remove(markerClassName.endSelection);
            endTextNode = end.childNodes[0];
        }
        else {
            endTextNode = end ? this.unWrap(end)[0] : startTextNode;
        }
        save.startContainer = save.getNodeArray(startTextNode, true);
        save.endContainer = save.getNodeArray(endTextNode, false);
        return save;
    }
    marker(className, textContent) {
        return '<span class="' + className + '">' + textContent + '</span>';
    }
    setMarker(save) {
        let range = save.range;
        let start = (range.startContainer.childNodes[range.startOffset]
            || range.startContainer);
        let end = (range.endContainer.childNodes[(range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer);
        if ((start.nodeType === Node.ELEMENT_NODE && end.nodeType === Node.ELEMENT_NODE) && (start.contains(end) || end.contains(start))) {
            let existNode = start.contains(end) ? start : end;
            let isElement = existNode.nodeType !== Node.TEXT_NODE;
            if (isElement) {
                let nodes = [];
                let textNodes = [];
                for (let node = existNode; existNode.contains(node); null) {
                    if (nodes.indexOf(node) < 0 && node.childNodes && node.childNodes.length) {
                        nodes.push(node);
                        node = node.childNodes[0];
                    }
                    else if (node.nextSibling) {
                        node = node.nextSibling;
                    }
                    else if (node.parentNode) {
                        node = node.parentNode;
                        nodes.push(node);
                    }
                    if (textNodes.indexOf(node) < 0 && (node.nodeType === Node.TEXT_NODE ||
                        (IGNORE_BLOCK_TAGS.indexOf(node.parentNode.tagName.toLocaleLowerCase()) >= 0
                            && node.tagName === 'BR'))) {
                        textNodes.push(node);
                    }
                }
                if (textNodes.length) {
                    start = start.contains(end) ? textNodes[0] : start;
                    end = textNodes[textNodes.length - 1];
                }
            }
        }
        if (start !== end) {
            if (start.nodeType !== Node.TEXT_NODE && start.tagName === 'BR' &&
                IGNORE_BLOCK_TAGS.indexOf(start.parentNode.tagName.toLocaleLowerCase()) >= 0) {
                this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
                let markerStart = range.startContainer.querySelector('.' + markerClassName.startSelection);
                markerStart.appendChild(start);
            }
            else {
                this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
            }
            if (end.nodeType !== Node.TEXT_NODE && end.tagName === 'BR' &&
                IGNORE_BLOCK_TAGS.indexOf(end.parentNode.tagName.toLocaleLowerCase()) >= 0) {
                this.replaceWith(end, this.marker(markerClassName.endSelection, this.encode(end.textContent)));
                let markerEnd = range.endContainer.querySelector('.' + markerClassName.endSelection);
                markerEnd.appendChild(end);
            }
            else {
                this.ensureSelfClosingTag(end, markerClassName.endSelection, range);
            }
        }
        else {
            this.ensureSelfClosingTag(start, markerClassName.startSelection, range);
        }
    }
    ensureSelfClosingTag(start, className, range) {
        if (start.nodeType === 3) {
            this.replaceWith(start, this.marker(className, this.encode(start.textContent)));
        }
        else if (start.tagName === 'BR') {
            this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
            let markerStart = range.startContainer.querySelector('.' + markerClassName.startSelection);
            markerStart.appendChild(start);
        }
        else {
            if (start.tagName === 'IMG') {
                let parNode = document.createElement('p');
                start.parentElement.insertBefore(parNode, start);
                parNode.appendChild(start);
                start = parNode.children[0];
            }
            for (let i = 0; i < selfClosingTags.length; i++) {
                start = start.tagName === selfClosingTags[i] ? start.parentNode : start;
            }
            let marker = this.marker(className, '');
            append([this.parseHTMLFragment(marker)], start);
        }
    }
    createTempNode(element) {
        let textContent = element.textContent;
        if (element.tagName === 'BR') {
            let wrapper = '<' + DEFAULT_TAG + '></' + DEFAULT_TAG + '>';
            let node = element.parentNode;
            if (IGNORE_BLOCK_TAGS.indexOf(node.tagName.toLocaleLowerCase()) >= 0) {
                element = this.wrap(element, this.parseHTMLFragment(wrapper));
            }
        }
        else if (((element.nodeType !== Node.TEXT_NODE &&
            (element.classList.contains(markerClassName.startSelection) ||
                element.classList.contains(markerClassName.endSelection))) ||
            textContent.replace(/\n/g, '').replace(/(^ *)|( *$)/g, '').length > 0 ||
            textContent.length && textContent.indexOf('\n') < 0)) {
            let wrapper = '<' + DEFAULT_TAG + '></' + DEFAULT_TAG + '>';
            let target = element;
            element = this.wrap(element, this.parseHTMLFragment(wrapper));
            let ignoreBr = target.nodeType === Node.ELEMENT_NODE && target.firstChild && target.firstChild.nodeName === 'BR'
                && (target.classList.contains(markerClassName.startSelection) ||
                    target.classList.contains(markerClassName.endSelection));
            if (!ignoreBr && element.nextElementSibling && element.nextElementSibling.tagName === 'BR') {
                element.appendChild(element.nextElementSibling);
            }
        }
        return element;
    }
    getImageTagInSelection() {
        let selection = this.getSelection();
        if (this.isEditorArea() && selection.rangeCount) {
            return selection.focusNode.querySelectorAll('img');
        }
        return null;
    }
    blockNodes() {
        let collectionNodes = [];
        let selection = this.getSelection();
        if (this.isEditorArea() && selection.rangeCount) {
            let ranges = this.getRangePoint();
            for (let j = 0; j < ranges.length; j++) {
                let parentNode;
                let range = ranges[j];
                let startNode = this.getSelectedNode(range.startContainer, range.startOffset);
                let endNode = this.getSelectedNode(range.endContainer, range.endOffset);
                if (this.isBlockNode(startNode) && collectionNodes.indexOf(startNode) < 0) {
                    collectionNodes.push(startNode);
                }
                parentNode = this.blockParentNode(startNode);
                if (parentNode && collectionNodes.indexOf(parentNode) < 0) {
                    if (IGNORE_BLOCK_TAGS.indexOf(parentNode.tagName.toLocaleLowerCase()) >= 0 && (startNode.tagName === 'BR' ||
                        startNode.nodeType === Node.TEXT_NODE ||
                        startNode.classList.contains(markerClassName.startSelection) ||
                        startNode.classList.contains(markerClassName.endSelection))) {
                        let tempNode = startNode.previousSibling &&
                            startNode.previousSibling.nodeType === Node.TEXT_NODE ?
                            startNode.previousSibling : startNode;
                        if (!startNode.nextSibling && !startNode.previousSibling && startNode.tagName === 'BR') {
                            collectionNodes.push(tempNode);
                        }
                        else {
                            collectionNodes.push(this.createTempNode(tempNode));
                        }
                    }
                    else {
                        collectionNodes.push(parentNode);
                    }
                }
                let nodes = [];
                for (let node = startNode; node !== endNode && node !== this.parent; null) {
                    if (nodes.indexOf(node) < 0 && node.childNodes && node.childNodes.length) {
                        nodes.push(node);
                        node = node.childNodes[0];
                    }
                    else if (node && (node.tagName === 'BR' || (node.nodeType === Node.TEXT_NODE &&
                        node.textContent.trim() !== '') || (node.nodeType !== Node.TEXT_NODE &&
                        (node.classList.contains(markerClassName.startSelection) ||
                            node.classList.contains(markerClassName.endSelection)))) &&
                        IGNORE_BLOCK_TAGS.indexOf(node.parentNode.tagName.toLocaleLowerCase()) >= 0) {
                        node = this.createTempNode(node);
                    }
                    else if (node.nextSibling && (node.nextSibling.tagName === 'BR' ||
                        node.nextSibling.nodeType === Node.TEXT_NODE ||
                        node.nextSibling.classList.contains(markerClassName.startSelection) ||
                        node.nextSibling.classList.contains(markerClassName.endSelection)) &&
                        IGNORE_BLOCK_TAGS.indexOf(node.nextSibling.parentNode.tagName.toLocaleLowerCase()) >= 0) {
                        node = this.createTempNode(node.nextSibling);
                    }
                    else if (node.nextSibling) {
                        node = node.nextSibling;
                    }
                    else if (node.parentNode) {
                        node = node.parentNode;
                        nodes.push(node);
                    }
                    if (collectionNodes.indexOf(node) < 0 && node.nodeType === Node.ELEMENT_NODE &&
                        IGNORE_BLOCK_TAGS.indexOf(node.parentNode.tagName.toLocaleLowerCase()) >= 0 &&
                        (node.classList.contains(markerClassName.startSelection) ||
                            node.classList.contains(markerClassName.endSelection))) {
                        collectionNodes.push(this.createTempNode(node));
                    }
                    if (this.isBlockNode(node) && this.ignoreTableTag(node) && nodes.indexOf(node) < 0 &&
                        collectionNodes.indexOf(node) < 0 && (node !== endNode || range.endOffset > 0)) {
                        collectionNodes.push(node);
                    }
                    if (node.nodeName === 'IMG' && node.parentElement.contentEditable === 'true') {
                        collectionNodes.push(node);
                    }
                }
                parentNode = this.blockParentNode(endNode);
                if (parentNode && this.ignoreTableTag(parentNode) && collectionNodes.indexOf(parentNode) < 0 &&
                    parentNode.previousElementSibling.tagName !== 'IMG') {
                    collectionNodes.push(parentNode);
                }
            }
        }
        for (let i = collectionNodes.length - 1; i > 0; i--) {
            let nodes = this.nodeFinds(collectionNodes[i], collectionNodes);
            if (nodes.length) {
                let listNodes = collectionNodes[i].querySelectorAll('ul, ol');
                if (collectionNodes[i].tagName === 'LI' && listNodes.length > 0) {
                    continue;
                }
                else {
                    collectionNodes.splice(i, 1);
                }
            }
        }
        return collectionNodes;
    }
    ignoreTableTag(element) {
        return !(TABLE_BLOCK_TAGS.indexOf(element.tagName.toLocaleLowerCase()) >= 0);
    }
}

/**
 * Exports common util methods used by RichTextEditor.
 */
function isIDevice$1() {
    let result = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}
function setEditFrameFocus(editableElement, selector) {
    if (editableElement.nodeName === 'BODY' && !isNullOrUndefined(selector)) {
        let iframe = top.window.document.querySelector(selector);
        if (!isNullOrUndefined(iframe)) {
            iframe.contentWindow.focus();
        }
    }
}

/**
 * Lists internal component
 * @hidden
 */
class Lists {
    /**
     * Constructor for creating the Lists plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.domNode = this.parent.domNode;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(LIST_TYPE, this.applyListsHandler, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
    }
    testList(elem) {
        let olListRegex = [/^[\d]+[.]+$/,
            /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})[.]$/gi,
            /^[a-zA-Z][.]+$/];
        let elementStart = !isNullOrUndefined(elem) ? elem.innerText.trim().split('.')[0] + '.' : null;
        if (!isNullOrUndefined(elementStart)) {
            for (let i = 0; i < olListRegex.length; i++) {
                if (olListRegex[i].test(elementStart)) {
                    return true;
                }
            }
        }
        return false;
    }
    testCurrentList(range) {
        let olListStartRegex = [/^[1]+[.]+$/, /^[i]+[.]+$/, /^[a]+[.]+$/];
        if (!isNullOrUndefined(range.startContainer.textContent.slice(0, range.startOffset))) {
            for (let i = 0; i < olListStartRegex.length; i++) {
                if (olListStartRegex[i].test(range.startContainer.textContent.slice(0, range.startOffset))) {
                    return true;
                }
            }
        }
        return false;
    }
    spaceList(e) {
        let range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        let startNode = this.parent.domNode.getSelectedNode(range.startContainer, range.startOffset);
        let endNode = this.parent.domNode.getSelectedNode(range.endContainer, range.endOffset);
        let preElement = startNode.previousElementSibling;
        let nextElement = startNode.nextElementSibling;
        let preElemULStart = !isNullOrUndefined(preElement) ?
            preElement.innerText.trim().substring(0, 1) : null;
        let nextElemULStart = !isNullOrUndefined(nextElement) ?
            nextElement.innerText.trim().substring(0, 1) : null;
        let startElementOLTest = this.testCurrentList(range);
        let preElementOLTest = this.testList(preElement);
        let nextElementOLTest = this.testList(nextElement);
        if (!preElementOLTest && !nextElementOLTest && preElemULStart !== '*' && nextElemULStart !== '*') {
            if (startElementOLTest) {
                range.startContainer.textContent = range.startContainer.textContent.slice(range.startOffset, range.startContainer.textContent.length);
                this.applyListsHandler({ subCommand: 'OL', callBack: e.callBack });
                e.event.preventDefault();
            }
            else if (range.startContainer.textContent.slice(0, range.startOffset) === '*') {
                range.startContainer.textContent = range.startContainer.textContent.slice(range.startOffset, range.startContainer.textContent.length);
                this.applyListsHandler({ subCommand: 'UL', callBack: e.callBack });
                e.event.preventDefault();
            }
        }
    }
    keyDownHandler(e) {
        if (e.event.which === 32) {
            this.spaceList(e);
        }
        if (e.event.which === 9) {
            let range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
            let blockNodes;
            let startOffset = range.startOffset;
            let endOffset = range.endOffset;
            let startNode = this.parent.domNode.getSelectedNode(range.startContainer, range.startOffset);
            let endNode = this.parent.domNode.getSelectedNode(range.endContainer, range.endOffset);
            if ((startNode === endNode && (startNode.nodeName === 'BR' || startNode.nodeName === '#text') &&
                IGNORE_BLOCK_TAGS.indexOf(startNode.parentNode.tagName.toLocaleLowerCase()) >= 0)) {
                return;
            }
            else {
                if (!(e.event.action && e.event.action === 'indent')) {
                    this.domNode.setMarker(this.saveSelection);
                }
                blockNodes = this.domNode.blockNodes();
            }
            let nodes = [];
            let isNested = true;
            for (let i = 0; i < blockNodes.length; i++) {
                if (blockNodes[i].parentNode.tagName === 'LI') {
                    nodes.push(blockNodes[i].parentNode);
                }
                else if (blockNodes[i].tagName === 'LI' && blockNodes[i].childNodes[0].tagName !== 'P' &&
                    (blockNodes[i].childNodes[0].tagName !== 'OL' &&
                        blockNodes[i].childNodes[0].tagName !== 'UL')) {
                    nodes.push(blockNodes[i]);
                }
            }
            if (nodes.length > 1 || nodes.length && ((startOffset === 0 && endOffset === 0) || e.ignoreDefault)) {
                e.event.preventDefault();
                e.event.stopPropagation();
                this.currentAction = this.getAction(nodes[0]);
                if (e.event.shiftKey) {
                    this.revertList(nodes);
                    this.revertClean();
                }
                else {
                    isNested = this.nestedList(nodes);
                }
                if (isNested) {
                    this.cleanNode();
                    this.parent.editableElement.focus();
                }
                if (!(e.event.action && e.event.action === 'indent')) {
                    this.saveSelection = this.domNode.saveMarker(this.saveSelection);
                    this.saveSelection.restore();
                    if (e.callBack) {
                        e.callBack({
                            requestType: this.currentAction,
                            editorMode: 'HTML',
                            range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                            elements: this.parent.domNode.blockNodes(),
                            event: e.event
                        });
                    }
                }
            }
            else {
                if (!(e.event.action && e.event.action === 'indent')) {
                    if (e.event && e.event.shiftKey && e.event.key === 'Tab') {
                        e.event.action = 'tab';
                    }
                    this.saveSelection = this.domNode.saveMarker(this.saveSelection, e.event.action);
                    this.saveSelection.restore();
                }
            }
        }
        else {
            switch (e.event.action) {
                case 'ordered-list':
                    this.applyListsHandler({ subCommand: 'OL', callBack: e.callBack });
                    e.event.preventDefault();
                    break;
                case 'unordered-list':
                    this.applyListsHandler({ subCommand: 'UL', callBack: e.callBack });
                    e.event.preventDefault();
                    break;
            }
        }
    }
    getAction(element) {
        let parentNode = element.parentNode;
        return (parentNode.nodeName === 'OL' ? 'OL' : 'UL');
    }
    revertClean() {
        let collectionNodes = this.parent.editableElement.querySelectorAll('ul, ol');
        for (let i = 0; i < collectionNodes.length; i++) {
            let listNodes = collectionNodes[i].querySelectorAll('ul, ol');
            if (listNodes.length > 0) {
                for (let j = 0; j < listNodes.length; j++) {
                    let prevSibling = listNodes[j].previousSibling;
                    if (prevSibling && prevSibling.tagName === 'LI') {
                        prevSibling.appendChild(listNodes[j]);
                    }
                }
            }
        }
    }
    noPreviousElement(elements) {
        let firstNode;
        let firstNodeOL;
        let siblingListOL = elements.querySelectorAll('ol, ul');
        let siblingListLI = elements
            .querySelectorAll('li');
        let siblingListLIFirst = this.domNode.contents(siblingListLI[0])[0];
        if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
            firstNode = siblingListLI[0];
        }
        else {
            firstNodeOL = siblingListOL[0];
        }
        if (firstNode) {
            for (let h = this.domNode.contents(elements)[0]; h && !this.domNode.isList(h); null) {
                let nextSibling = h.nextSibling;
                prepend([h], firstNode);
                setStyleAttribute(elements, { 'list-style-type': 'none' });
                setStyleAttribute(firstNode, { 'list-style-type': '' });
                h = nextSibling;
            }
        }
        else if (firstNodeOL) {
            let nestedElement = createElement('li');
            prepend([nestedElement], firstNodeOL);
            for (let h = this.domNode.contents(elements)[0]; h && !this.domNode.isList(h); null) {
                let nextSibling = h.nextSibling;
                nestedElement.appendChild(h);
                h = nextSibling;
            }
            prepend([firstNodeOL], elements.parentNode);
            detach(elements);
            let nestedElementLI = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], firstNodeOL.parentNode);
            append([firstNodeOL], nestedElementLI);
        }
        else {
            let nestedElementLI = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], elements.parentNode);
            let nestedElement = createElement(elements.parentNode.tagName);
            prepend([nestedElement], nestedElementLI);
            append([elements], nestedElement);
        }
    }
    nestedList(elements) {
        let isNested = false;
        for (let i = 0; i < elements.length; i++) {
            let prevSibling = this.domNode.getPreviousNode(elements[i]);
            if (prevSibling) {
                isNested = true;
                let firstNode;
                let firstNodeLI;
                let siblingListOL = elements[i].querySelectorAll('ol, ul');
                let siblingListLI = elements[i]
                    .querySelectorAll('li');
                let siblingListLIFirst = this.domNode.contents(siblingListLI[0])[0];
                if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
                    firstNodeLI = siblingListLI[0];
                }
                else {
                    firstNode = siblingListOL[0];
                }
                if (firstNode) {
                    let nestedElement = createElement('li');
                    prepend([nestedElement], firstNode);
                    for (let h = this.domNode.contents(elements[i])[0]; h && !this.domNode.isList(h); null) {
                        let nextSibling = h.nextSibling;
                        nestedElement.appendChild(h);
                        h = nextSibling;
                    }
                    append([firstNode], prevSibling);
                    detach(elements[i]);
                }
                else if (firstNodeLI) {
                    if (prevSibling.tagName === 'LI') {
                        for (let h = this.domNode.contents(elements[i])[0]; h && !this.domNode.isList(h); null) {
                            let nextSibling = h.nextSibling;
                            prepend([h], firstNodeLI);
                            setStyleAttribute(elements[i], { 'list-style-type': 'none' });
                            setStyleAttribute(firstNodeLI, { 'list-style-type': '' });
                            h = nextSibling;
                        }
                        append([firstNodeLI.parentNode], prevSibling);
                        detach(elements[i]);
                    }
                }
                else {
                    if (prevSibling.tagName === 'LI') {
                        let nestedElement = createElement(elements[i].parentNode.tagName);
                        append([nestedElement], prevSibling);
                        append([elements[i]], nestedElement);
                    }
                }
            }
            else {
                let element = elements[i];
                isNested = true;
                this.noPreviousElement(element);
            }
        }
        return isNested;
    }
    applyListsHandler(e) {
        let range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.currentAction = e.subCommand;
        this.domNode.setMarker(this.saveSelection);
        let listsNodes = this.domNode.blockNodes();
        for (let i = 0; i < listsNodes.length; i++) {
            if (listsNodes[i].tagName !== 'LI' && 'LI' === listsNodes[i].parentNode.tagName) {
                listsNodes[i] = listsNodes[i].parentNode;
            }
        }
        this.applyLists(listsNodes, this.currentAction, e.selector);
        if (e.callBack) {
            e.callBack({
                requestType: this.currentAction,
                event: e.event,
                editorMode: 'HTML',
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes()
            });
        }
    }
    applyLists(elements, type, selector) {
        if (this.isRevert(elements, type)) {
            this.revertList(elements);
            this.removeEmptyListElements();
        }
        else {
            this.checkLists(elements, type);
            for (let i = 0; i < elements.length; i++) {
                if ('LI' !== elements[i].tagName) {
                    let elemAtt = elements[i].tagName === 'IMG' ? '' : this.domNode.attributes(elements[i]);
                    let openTag = '<' + type + '>';
                    let closeTag = '</' + type + '>';
                    let newTag = 'li' + elemAtt;
                    let replaceHTML = (elements[i].tagName.toLowerCase() === DEFAULT_TAG ? elements[i].innerHTML :
                        elements[i].outerHTML);
                    let innerHTML = this.domNode.createTagString(newTag, null, replaceHTML);
                    let collectionString = openTag + innerHTML + closeTag;
                    this.domNode.replaceWith(elements[i], collectionString);
                }
            }
        }
        this.cleanNode();
        this.parent.editableElement.focus();
        if (isIDevice$1()) {
            setEditFrameFocus(this.parent.editableElement, selector);
        }
        this.saveSelection = this.domNode.saveMarker(this.saveSelection);
        this.saveSelection.restore();
    }
    removeEmptyListElements() {
        let listElem = this.parent.editableElement.querySelectorAll('ol, ul');
        for (let i = 0; i < listElem.length; i++) {
            if (listElem[i].textContent.trim() === '') {
                detach(listElem[i]);
            }
        }
    }
    isRevert(nodes, tagName) {
        let isRevert = true;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName !== 'LI') {
                return false;
            }
            if (nodes[i].parentNode.tagName !== tagName) {
                isRevert = false;
            }
        }
        return isRevert;
    }
    checkLists(nodes, tagName) {
        let nodesTemp = [];
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i].parentNode;
            if (nodes[i].tagName === 'LI' && node.tagName !== tagName && nodesTemp.indexOf(node) < 0) {
                nodesTemp.push(node);
            }
        }
        for (let j = nodesTemp.length - 1; j >= 0; j--) {
            let h = nodesTemp[j];
            let replace = '<' + tagName.toLowerCase() + ' '
                + this.domNode.attributes(h) + '>' + h.innerHTML + '</' + tagName.toLowerCase() + '>';
            this.domNode.replaceWith(nodesTemp[j], replace);
        }
    }
    cleanNode() {
        let liParents = this.parent.editableElement.querySelectorAll('ol + ol, ul + ul');
        for (let c = 0; c < liParents.length; c++) {
            let node = liParents[c];
            if (this.domNode.isList(node.previousElementSibling) &&
                this.domNode.openTagString(node) === this.domNode.openTagString(node.previousElementSibling)) {
                let contentNodes = this.domNode.contents(node);
                for (let f = 0; f < contentNodes.length; f++) {
                    node.previousElementSibling.appendChild(contentNodes[f]);
                }
                node.parentNode.removeChild(node);
            }
        }
    }
    findUnSelected(temp, elements) {
        temp = temp.slice().reverse();
        if (temp.length > 0) {
            let rightIndent = [];
            let indentElements = [];
            let lastElement = elements[elements.length - 1];
            let lastElementChild = [];
            let childElements = [];
            lastElementChild = (lastElement.childNodes);
            for (let z = 0; z < lastElementChild.length; z++) {
                if (lastElementChild[z].tagName === 'OL' || lastElementChild[z].tagName === 'UL') {
                    let childLI = lastElementChild[z]
                        .querySelectorAll('li');
                    if (childLI.length > 0) {
                        for (let y = 0; y < childLI.length; y++) {
                            childElements.push(childLI[y]);
                        }
                    }
                }
            }
            for (let i = 0; i < childElements.length; i++) {
                let count = 0;
                for (let j = 0; j < temp.length; j++) {
                    if (!childElements[i].contains((temp[j]))) {
                        count = count + 1;
                    }
                }
                if (count === temp.length) {
                    indentElements.push(childElements[i]);
                }
            }
            if (indentElements.length > 0) {
                for (let x = 0; x < indentElements.length; x++) {
                    if (this.domNode.contents(indentElements[x])[0].nodeName !== 'OL' &&
                        this.domNode.contents(indentElements[x])[0].nodeName !== 'UL') {
                        rightIndent.push(indentElements[x]);
                    }
                }
            }
            if (rightIndent.length > 0) {
                this.nestedList(rightIndent);
            }
        }
    }
    revertList(elements) {
        let temp = [];
        for (let i = elements.length - 1; i >= 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                if (elements[j].contains((elements[i])) || elements[j] === elements[i]) {
                    temp.push(elements[i]);
                    elements.splice(i, 1);
                    break;
                }
            }
        }
        this.findUnSelected(temp, elements);
        let viewNode = [];
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            let parentNode = elements[i].parentNode;
            let className = element.getAttribute('class');
            if (temp.length === 0) {
                let siblingList = elements[i].querySelectorAll('ul, ol');
                let firstNode = siblingList[0];
                if (firstNode) {
                    let child = firstNode
                        .querySelectorAll('li');
                    if (child) {
                        let nestedElement = createElement(firstNode.tagName);
                        append([nestedElement], firstNode.parentNode);
                        let nestedElementLI = createElement('li', { styles: 'list-style-type: none;' });
                        append([nestedElementLI], nestedElement);
                        append([firstNode], nestedElementLI);
                    }
                }
            }
            if (element.parentNode.insertBefore(this.closeTag(parentNode.tagName), element), 'LI' === parentNode.parentNode.tagName) {
                element.parentNode.insertBefore(this.closeTag('LI'), element);
            }
            else {
                if (DEFAULT_TAG && 0 === element.querySelectorAll(BLOCK_TAGS.join(', ')).length) {
                    let wrapperclass = isNullOrUndefined(className) ? ' class="e-rte-wrap-inner"' :
                        ' class="' + className + ' e-rte-wrap-inner"';
                    let wrapper = '<' + DEFAULT_TAG + wrapperclass +
                        this.domNode.attributes(parentNode) + '></' + DEFAULT_TAG + '>';
                    this.domNode.wrapInner(element, this.domNode.parseHTMLFragment(wrapper));
                }
                else if (this.domNode.contents(element)[0].nodeType === 3) {
                    let replace = this.domNode.createTagString(DEFAULT_TAG, parentNode, this.parent.domNode.encode(this.domNode.contents(element)[0].textContent));
                    this.domNode.replaceWith(this.domNode.contents(element)[0], replace);
                }
                else if (this.domNode.contents(element)[0].classList.contains(markerClassName.startSelection) ||
                    this.domNode.contents(element)[0].classList.contains(markerClassName.endSelection)) {
                    let replace = this.domNode.createTagString(DEFAULT_TAG, parentNode, this.domNode.contents(element)[0].outerHTML);
                    this.domNode.replaceWith(this.domNode.contents(element)[0], replace);
                }
                else {
                    let childNode = element.firstChild;
                    className = childNode.getAttribute('class');
                    attributes(childNode, this.domNode.rawAttributes(parentNode));
                    if (className && childNode.getAttribute('class')) {
                        attributes(childNode, { 'class': className + ' ' + childNode.getAttribute('class') });
                    }
                }
                append([this.openTag('LI')], element);
                prepend([this.closeTag('LI')], element);
            }
            this.domNode.insertAfter(this.openTag(parentNode.tagName), element);
            if (parentNode.parentNode.tagName === 'LI') {
                parentNode = parentNode.parentNode.parentNode;
            }
            if (viewNode.indexOf(parentNode) < 0) {
                viewNode.push(parentNode);
            }
        }
        for (let i = 0; i < viewNode.length; i++) {
            let node = viewNode[i];
            let nodeInnerHtml = node.innerHTML;
            let closeTag = /<span class="e-rte-list-close-([a-z]*)"><\/span>/g;
            let openTag = /<span class="e-rte-list-open-([a-z]*)"><\/span>/g;
            nodeInnerHtml = nodeInnerHtml.replace(closeTag, '</$1>');
            nodeInnerHtml = nodeInnerHtml.replace(openTag, '<$1 ' + this.domNode.attributes(node) + '>');
            this.domNode.replaceWith(node, this.domNode.openTagString(node) + nodeInnerHtml.trim() + this.domNode.closeTagString(node));
        }
        let emptyUl = this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (let i = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
        let emptyLi = this.parent.editableElement.querySelectorAll('li:empty');
        for (let i = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
    }
    openTag(type) {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-open-' + type.toLowerCase() + '"></span>');
    }
    closeTag(type) {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-close-' + type.toLowerCase() + '"></span>');
    }
}

/**
 * Formats internal component
 * @hidden
 */
class Formats {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(FORMAT_TYPE, this.applyFormats, this);
    }
    getParentNode(node) {
        for (; node.parentNode && node.parentNode !== this.parent.editableElement; null) {
            node = node.parentNode;
        }
        return node;
    }
    applyFormats(e) {
        let range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let save = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        let formatsNodes = this.parent.domNode.blockNodes();
        for (let i = 0; i < formatsNodes.length; i++) {
            let parentNode;
            let replaceHTML;
            if (e.subCommand.toLowerCase() === 'blockquote') {
                parentNode = this.getParentNode(formatsNodes[i]);
                replaceHTML = this.parent.domNode.isList(parentNode) ||
                    parentNode.tagName === 'TABLE' ? parentNode.outerHTML : parentNode.innerHTML;
            }
            else {
                parentNode = formatsNodes[i];
                replaceHTML = parentNode.innerHTML;
            }
            if (e.subCommand.toLowerCase() === parentNode.tagName.toLowerCase() ||
                isNullOrUndefined(parentNode.parentNode) || parentNode.tagName === 'LI') {
                continue;
            }
            this.cleanFormats(parentNode, e.subCommand);
            let replaceTag = this.parent.domNode.createTagString(e.subCommand, parentNode, replaceHTML.replace(/>\s+</g, '><'));
            this.parent.domNode.replaceWith(parentNode, replaceTag);
        }
        this.parent.editableElement.focus();
        save = this.parent.domNode.saveMarker(save);
        if (isIDevice$1()) {
            setEditFrameFocus(this.parent.editableElement, e.selector);
        }
        save.restore();
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes()
            });
        }
    }
    cleanFormats(element, tagName) {
        let ignoreAttr = ['display', 'font-size', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-weight'];
        tagName = tagName.toLowerCase();
        for (let i = 0; i < ignoreAttr.length && (tagName !== 'p' && tagName !== 'blockquote' && tagName !== 'pre'); i++) {
            element.style.removeProperty(ignoreAttr[i]);
        }
    }
}

/**
 * Node appending methods.
 * @hidden
 */
class InsertMethods {
    static WrapBefore(textNode, parentNode, isAfter) {
        parentNode.innerText = textNode.textContent;
        (!isAfter) ? this.AppendBefore(parentNode, textNode) : this.AppendBefore(parentNode, textNode, true);
        if (textNode.parentNode) {
            textNode.parentNode.removeChild(textNode);
        }
        return parentNode.childNodes[0];
    }
    static Wrap(childNode, parentNode) {
        this.AppendBefore(parentNode, childNode);
        parentNode.appendChild(childNode);
        return childNode;
    }
    static unwrap(node) {
        let parent = node.parentNode;
        let child = [];
        for (; node.firstChild; null) {
            child.push(parent.insertBefore(node.firstChild, node));
        }
        parent.removeChild(node);
        return child;
    }
    static AppendBefore(textNode, parentNode, isAfter) {
        return (parentNode.parentNode) ? ((!isAfter) ? parentNode.parentNode.insertBefore(textNode, parentNode)
            : parentNode.parentNode.insertBefore(textNode, parentNode.nextSibling)) :
            parentNode;
    }
}

/**
 * Split the Node based on selection
 * @hidden
 */
class NodeCutter {
    constructor() {
        this.position = -1;
        this.nodeSelection = new NodeSelection();
    }
    // Split Selection Node
    GetSpliceNode(range, node) {
        node = this.SplitNode(range, node, true);
        node = this.SplitNode(range, node, false);
        return node;
    }
    SplitNode(range, node, isCollapsed) {
        if (node) {
            let clone = range.cloneRange();
            let parent = node.parentNode;
            let index = this.nodeSelection.getIndex(node);
            clone.collapse(isCollapsed);
            (isCollapsed) ? clone.setStartBefore(node) : clone.setEndAfter(node);
            let fragment = clone.extractContents();
            if (isCollapsed) {
                node = parent.childNodes[index];
                fragment = this.spliceEmptyNode(fragment, false);
                if (fragment && fragment.childNodes.length > 0) {
                    let isEmpty = (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName !== 'IMG'
                        && isNullOrUndefined(fragment.querySelector('img')) && fragment.textContent === '') ? true : false;
                    if (!isEmpty) {
                        if (node) {
                            InsertMethods.AppendBefore(fragment, node);
                        }
                        else {
                            parent.appendChild(fragment);
                            let divNode = document.createElement('div');
                            divNode.innerHTML = '&#65279;&#65279;';
                            node = divNode.firstChild;
                            parent.appendChild(node);
                        }
                    }
                }
            }
            else {
                node = parent.childNodes.length > 1 ? parent.childNodes[index] :
                    parent.childNodes[0];
                fragment = this.spliceEmptyNode(fragment, true);
                if (fragment && fragment.childNodes.length > 0) {
                    let isEmpty = (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName !== 'IMG'
                        && isNullOrUndefined(fragment.querySelector('img')) && fragment.textContent === '') ? true : false;
                    if (!isEmpty) {
                        if (node) {
                            InsertMethods.AppendBefore(fragment, node, true);
                        }
                        else {
                            parent.appendChild(fragment);
                            let divNode = document.createElement('div');
                            divNode.innerHTML = '&#65279;&#65279;';
                            parent.insertBefore(divNode.firstChild, parent.firstChild);
                            node = parent.firstChild;
                        }
                    }
                }
            }
            return node;
        }
        else {
            return null;
        }
    }
    spliceEmptyNode(fragment, isStart) {
        let len;
        if (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName === '#text' &&
            fragment.childNodes[0].textContent === '' || fragment.textContent === '') {
            len = -1;
        }
        else {
            len = fragment.childNodes.length - 1;
        }
        if (len > -1 && !isStart) {
            this.spliceEmptyNode(fragment.childNodes[len], isStart);
        }
        else if (len > -1) {
            this.spliceEmptyNode(fragment.childNodes[0], isStart);
        }
        else if (fragment.nodeType !== 3 && fragment.nodeType !== 11) {
            fragment.parentNode.removeChild(fragment);
        }
        return fragment;
    }
    // Cursor Position split
    GetCursorStart(indexes, index, isStart) {
        indexes = (isStart) ? indexes : indexes.reverse();
        let position = indexes[0];
        for (let num = 0; num < indexes.length && ((isStart) ? (indexes[num] < index) : (indexes[num] >= index)); num++) {
            position = indexes[num];
        }
        return position;
    }
    GetCursorRange(docElement, range, node) {
        let cursorRange = docElement.createRange();
        let indexes = [];
        indexes.push(0);
        let str = this.TrimLineBreak(node.data);
        let index = str.indexOf(' ', 0);
        while (index !== -1) {
            if (indexes.indexOf(index) < 0) {
                indexes.push(index);
            }
            if (new RegExp('\\s').test(str[index - 1]) && (indexes.indexOf(index - 1) < 0)) {
                indexes.push(index - 1);
            }
            if (new RegExp('\\s').test(str[index + 1])) {
                indexes.push(index + 1);
            }
            index = str.indexOf(' ', (index + 1));
        }
        indexes.push(str.length);
        if ((indexes.indexOf(range.startOffset) >= 0)
            || ((indexes.indexOf(range.startOffset - 1) >= 0) && (range.startOffset !== 1
                || (range.startOffset === 1 && new RegExp('\\s').test(str[0])))
                || ((indexes[indexes.length - 1] - 1) === range.startOffset))) {
            cursorRange = range;
            this.position = 1;
        }
        else {
            let startOffset = this.GetCursorStart(indexes, range.startOffset, true);
            this.position = range.startOffset - startOffset;
            cursorRange.setStart(range.startContainer, startOffset);
            cursorRange.setEnd(range.startContainer, this.GetCursorStart(indexes, range.startOffset, false));
        }
        return cursorRange;
    }
    GetCursorNode(docElement, range, node) {
        return this.GetSpliceNode(this.GetCursorRange(docElement, range, node), node);
    }
    TrimLineBreak(line) {
        return line.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
    }
}

/**
 * Insert a HTML Node or Text
 * @hidden
 */
class InsertHtml {
    static Insert(docElement, insertNode, editNode) {
        let node;
        if (typeof insertNode === 'string') {
            let divNode = document.createElement('div');
            divNode.innerHTML = insertNode;
            node = divNode.firstChild;
        }
        else {
            node = insertNode;
        }
        let nodeSelection = new NodeSelection();
        let nodeCutter = new NodeCutter();
        let range = nodeSelection.getRange(docElement);
        let isCollapsed = range.collapsed;
        let nodes = nodeSelection.getInsertNodeCollection(range);
        let closestParentNode = (node.nodeName.toLowerCase() === 'table') ? this.closestEle(nodes[0].parentNode, editNode) : nodes[0];
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) === -1))) {
            let preNode = nodeCutter.GetSpliceNode(range, closestParentNode);
            let sibNode = preNode.previousSibling;
            let parentNode = preNode.parentNode;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            }
            else {
                let lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement);
                lasNode = isNullOrUndefined(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            range.extractContents();
            if (insertNode.tagName === 'TABLE') {
                this.removeEmptyElements(editNode);
            }
            for (let index = 0; index < nodes.length; index++) {
                if (nodes[index].nodeType !== 3 && nodes[index].parentNode != null) {
                    if (nodes[index].nodeName === 'IMG') {
                        continue;
                    }
                    nodes[index].parentNode.removeChild(nodes[index]);
                }
            }
            if (sibNode) {
                InsertMethods.AppendBefore(node, sibNode, true);
            }
            else {
                let previousNode = null;
                while (parentNode !== editNode && parentNode.firstChild &&
                    (parentNode.textContent.trim() === '')) {
                    let parentNode1 = parentNode.parentNode;
                    previousNode = parentNode;
                    parentNode = parentNode1;
                }
                if (previousNode !== null) {
                    parentNode = previousNode;
                }
                if (parentNode.firstChild && parentNode.contentEditable !== 'true') {
                    if (parentNode.textContent.trim() === '') {
                        InsertMethods.AppendBefore(node, parentNode, false);
                        detach(parentNode);
                    }
                    else {
                        InsertMethods.AppendBefore(node, parentNode.firstChild, false);
                    }
                }
                else {
                    parentNode.appendChild(node);
                }
            }
            if (node.nodeType !== 3) {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.childNodes.length);
            }
            else {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.textContent.length);
            }
        }
        else {
            range.deleteContents();
            if (Browser.isIE) {
                let frag = docElement.createDocumentFragment();
                frag.appendChild(node);
                range.insertNode(frag);
            }
            else {
                range.insertNode(node);
            }
            if (node.nodeType !== 3 && node.childNodes.length > 0) {
                nodeSelection.setSelectionText(docElement, node, node, 1, 1);
            }
            else if (node.nodeType !== 3) {
                nodeSelection.setSelectionContents(docElement, node);
            }
            else {
                nodeSelection.setSelectionText(docElement, node, node, node.textContent.length, node.textContent.length);
            }
        }
    }
    static findDetachEmptyElem(element) {
        let removableElement;
        if (!isNullOrUndefined(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' && element.parentElement.contentEditable !== 'true') {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            }
            else {
                removableElement = element;
            }
        }
        else {
            removableElement = null;
        }
        return removableElement;
    }
    static removeEmptyElements(element) {
        let emptyElements = element.querySelectorAll(':empty');
        for (let i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR') {
                let detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNullOrUndefined(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    }
    static closestEle(element, editNode) {
        let el = element;
        while (el && el.nodeType === 1) {
            if (el.parentNode === editNode ||
                (!isNullOrUndefined(el.parentNode.tagName) &&
                    IGNORE_BLOCK_TAGS.indexOf(el.parentNode.tagName.toLocaleLowerCase()) !== -1)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    }
}

/**
 * Link internal component
 * @hidden
 */
class LinkCommand {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(LINK, this.linkCommand, this);
    }
    linkCommand(e) {
        switch (e.value.toString().toLocaleLowerCase()) {
            case 'createlink':
            case 'editlink':
                this.createLink(e);
                break;
            case 'openlink':
                this.openLink(e);
                break;
            case 'removelink':
                this.removeLink(e);
                break;
        }
    }
    createLink(e) {
        let closestAnchor = (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent.length > 0) &&
            closest(e.item.selectParent[0], 'a');
        closestAnchor = !isNullOrUndefined(closestAnchor) ? closestAnchor :
            (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent.length > 0) ? (e.item.selectParent[0]) : null;
        if (!isNullOrUndefined(closestAnchor) && closestAnchor.tagName === 'A') {
            let anchorEle = closestAnchor;
            anchorEle.setAttribute('href', e.item.url);
            anchorEle.setAttribute('title', e.item.title);
            anchorEle.innerText = e.item.text;
            if (!isNullOrUndefined(e.item.target)) {
                anchorEle.setAttribute('target', e.item.target);
            }
            else {
                anchorEle.removeAttribute('target');
            }
            e.item.selection.setSelectionText(this.parent.currentDocument, anchorEle, anchorEle, 1, 1);
            e.item.selection.restore();
        }
        else {
            let anchor = createElement('a', {
                className: 'e-rte-anchor', attrs: {
                    href: e.item.url,
                    title: isNullOrUndefined(e.item.title) || e.item.title === '' ? e.item.url : e.item.title
                }
            });
            if (!isNullOrUndefined(e.item.target)) {
                anchor.setAttribute('target', e.item.target);
            }
            anchor.innerText = e.item.text === '' ? e.item.url : e.item.text;
            e.item.selection.restore();
            InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
            if (e.event && e.event.type === 'keydown' && (e.event.keyCode === 32
                || e.event.keyCode === 13)) {
                let startContainer = e.item.selection.range.startContainer;
                startContainer.textContent = this.removeText(startContainer.textContent, e.item.text);
            }
            else {
                let startIndex = e.item.action === 'Paste' ? anchor.childNodes[0].textContent.length : 0;
                e.item.selection.setSelectionText(this.parent.currentDocument, anchor.childNodes[0], anchor.childNodes[0], startIndex, anchor.childNodes[0].textContent.length);
            }
        }
        if (e.callBack) {
            e.callBack({
                requestType: 'Links',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    removeText(text, val) {
        let arr = text.split(' ');
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr.join(' ') + ' ';
    }
    openLink(e) {
        document.defaultView.open(e.item.url, e.item.target);
        this.callBack(e);
    }
    removeLink(e) {
        this.parent.domNode.setMarker(e.item.selection);
        let closestAnchor = closest(e.item.selectParent[0], 'a');
        let selectParent = closestAnchor ? closestAnchor : e.item.selectParent[0];
        let parent = selectParent.parentNode;
        let child = [];
        for (; selectParent.firstChild; null) {
            child.push(parent.insertBefore(selectParent.firstChild, selectParent));
        }
        parent.removeChild(selectParent);
        if (child && child.length === 1) {
            e.item.selection.startContainer = e.item.selection.getNodeArray(child[child.length - 1], true);
            e.item.selection.endContainer = e.item.selection.startContainer;
        }
        e.item.selection = this.parent.domNode.saveMarker(e.item.selection);
        e.item.selection.restore();
        this.callBack(e);
    }
    callBack(e) {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
}

/**
 * Formats internal component
 * @hidden
 */
class Alignments {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.alignments = {
            'JustifyLeft': 'left',
            'JustifyCenter': 'center',
            'JustifyRight': 'right',
            'JustifyFull': 'justify'
        };
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(ALIGNMENT_TYPE, this.applyAlignment, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    }
    onKeyDown(e) {
        switch (e.event.action) {
            case 'justify-center':
                this.applyAlignment({ subCommand: 'JustifyCenter', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'justify-full':
                this.applyAlignment({ subCommand: 'JustifyFull', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'justify-left':
                this.applyAlignment({ subCommand: 'JustifyLeft', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'justify-right':
                this.applyAlignment({ subCommand: 'JustifyRight', callBack: e.callBack });
                e.event.preventDefault();
                break;
        }
    }
    getTableNode(range) {
        let startNode = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer : range.startContainer.parentNode;
        let cellNode = closest(startNode, 'td,th');
        return [cellNode];
    }
    applyAlignment(e) {
        let isTableAlign = e.value === 'Table' ? true : false;
        let range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let save = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        if (!isTableAlign) {
            this.parent.domNode.setMarker(save);
            let alignmentNodes = this.parent.domNode.blockNodes();
            for (let i = 0; i < alignmentNodes.length; i++) {
                let parentNode = alignmentNodes[i];
                setStyleAttribute(parentNode, { 'text-align': this.alignments[e.subCommand] });
            }
            let imageTags = this.parent.domNode.getImageTagInSelection();
            for (let i = 0; i < imageTags.length; i++) {
                let elementNode = [];
                elementNode.push(imageTags[i]);
                this.parent.imgObj.imageCommand({
                    item: {
                        selectNode: elementNode
                    },
                    subCommand: e.subCommand,
                    value: e.subCommand,
                    callBack: e.callBack,
                    selector: e.selector
                });
            }
            this.parent.editableElement.focus();
            save = this.parent.domNode.saveMarker(save);
            if (isIDevice$1()) {
                setEditFrameFocus(this.parent.editableElement, e.selector);
            }
            save.restore();
        }
        else {
            setStyleAttribute(this.getTableNode(range)[0], { 'text-align': this.alignments[e.subCommand] });
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: (isTableAlign ? this.getTableNode(range) : this.parent.domNode.blockNodes())
            });
        }
    }
}

/**
 * Indents internal component
 * @hidden
 */
class Indents {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.indentValue = 20;
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(INDENT_TYPE, this.applyIndents, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    }
    onKeyDown(e) {
        switch (e.event.action) {
            case 'indents':
                this.applyIndents({ subCommand: 'Indent', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'outdents':
                this.applyIndents({ subCommand: 'Outdent', callBack: e.callBack });
                e.event.preventDefault();
                break;
        }
    }
    applyIndents(e) {
        let range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let save = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        let indentsNodes = this.parent.domNode.blockNodes();
        let parentNodes = indentsNodes.slice();
        let listsNodes = [];
        for (let i = 0; i < parentNodes.length; i++) {
            if (parentNodes[i].tagName !== 'LI' && 'LI' === parentNodes[i].parentNode.tagName) {
                indentsNodes.splice(indentsNodes.indexOf(parentNodes[i]), 1);
                listsNodes.push(parentNodes[i].parentNode);
            }
            else if (parentNodes[i].tagName === 'LI') {
                indentsNodes.splice(indentsNodes.indexOf(parentNodes[i]), 1);
                listsNodes.push(parentNodes[i]);
            }
        }
        if (listsNodes.length > 0) {
            this.parent.observer.notify(KEY_DOWN_HANDLER, {
                event: {
                    preventDefault: () => { return; },
                    stopPropagation: () => { return; },
                    shiftKey: (e.subCommand === 'Indent' ? false : true),
                    which: 9,
                    action: 'indent'
                },
                ignoreDefault: true
            });
        }
        for (let i = 0; i < indentsNodes.length; i++) {
            let parentNode = indentsNodes[i];
            let marginLeft = parentNode.style.marginLeft;
            let indentsValue;
            if (e.subCommand === 'Indent') {
                indentsValue = marginLeft === '' ? this.indentValue + 'px' : parseInt(marginLeft, null) + this.indentValue + 'px';
                parentNode.style.marginLeft = indentsValue;
            }
            else {
                indentsValue = (marginLeft === '' || marginLeft === '0px') ? '' : parseInt(marginLeft, null) - this.indentValue + 'px';
                parentNode.style.marginLeft = indentsValue;
            }
        }
        this.parent.editableElement.focus();
        if (isIDevice$1()) {
            setEditFrameFocus(this.parent.editableElement, e.selector);
        }
        save = this.parent.domNode.saveMarker(save);
        save.restore();
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes()
            });
        }
    }
}

/**
 * RichTextEditor classes defined here.
 */
/** @hidden */
const CLASS_IMAGE_RIGHT = 'e-imgright';
const CLASS_IMAGE_LEFT = 'e-imgleft';
const CLASS_IMAGE_CENTER = 'e-imgcenter';
const CLASS_IMAGE_BREAK = 'e-imgbreak';
const CLASS_CAPTION = 'e-img-caption';
const CLASS_CAPTION_INLINE = 'e-caption-inline';
const CLASS_IMAGE_INLINE = 'e-imginline';

/**
 * Link internal component
 * @hidden
 */
class ImageCommand {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(IMAGE, this.imageCommand, this);
    }
    imageCommand(e) {
        switch (e.value.toString().toLocaleLowerCase()) {
            case 'image':
            case 'replace':
                this.createImage(e);
                break;
            case 'insertlink':
                this.insertImageLink(e);
                break;
            case 'openimagelink':
                this.openImageLink(e);
                break;
            case 'editimagelink':
                this.editImageLink(e);
                break;
            case 'removeimagelink':
                this.removeImageLink(e);
                break;
            case 'remove':
                this.removeImage(e);
                break;
            case 'alttext':
                this.insertAltTextImage(e);
                break;
            case 'dimension':
                this.imageDimension(e);
                break;
            case 'caption':
                this.imageCaption(e);
                break;
            case 'justifyleft':
                this.imageJustifyLeft(e);
                break;
            case 'justifycenter':
                this.imageJustifyCenter(e);
                break;
            case 'justifyright':
                this.imageJustifyRight(e);
                break;
            case 'inline':
                this.imageInline(e);
                break;
            case 'break':
                this.imageBreak(e);
                break;
        }
    }
    createImage(e) {
        if (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent[0].tagName === 'IMG') {
            let imgEle = e.item.selectParent[0];
            imgEle.setAttribute('src', e.item.url);
            imgEle.setAttribute('alt', e.item.altText);
        }
        else {
            let imgElement = createElement('img', {
                className: 'e-rte-image ' + e.item.cssClass, attrs: {
                    width: (isNullOrUndefined(e.item.width) || isNullOrUndefined(e.item.width.width)) ? 'auto' :
                        e.item.width.width,
                    height: (isNullOrUndefined(e.item.height) || isNullOrUndefined(e.item.height.height)) ? 'auto' :
                        e.item.height.height,
                    alt: (e.item.altText !== '') ? e.item.altText : ''
                }
            });
            imgElement.setAttribute('src', isNullOrUndefined(e.item.url) ? '' : e.item.url);
            imgElement.style.minWidth = (isNullOrUndefined(e.item.width) || isNullOrUndefined(e.item.width.minWidth)) ? 0 + 'px' :
                e.item.width.minWidth + 'px';
            imgElement.style.maxWidth = (isNullOrUndefined(e.item.width) || isNullOrUndefined(e.item.width.maxWidth)) ? null :
                e.item.width.maxWidth + 'px';
            imgElement.style.minHeight = (isNullOrUndefined(e.item.height) || isNullOrUndefined(e.item.height.minHeight)) ? 0 + 'px' :
                e.item.height.minHeight + 'px';
            imgElement.style.maxHeight = (isNullOrUndefined(e.item.height) || isNullOrUndefined(e.item.height.maxHeight)) ? null :
                e.item.height.maxHeight + 'px';
            if (!isNullOrUndefined(e.item.selection)) {
                e.item.selection.restore();
            }
            if (!isNullOrUndefined(e.selector) && e.selector === 'pasteCleanupModule') {
                e.callBack({ requestType: 'Image',
                    editorMode: 'HTML',
                    event: e.event,
                    range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                    elements: [imgElement]
                });
            }
            else {
                InsertHtml.Insert(this.parent.currentDocument, imgElement, this.parent.editableElement);
            }
        }
        if (e.callBack && (isNullOrUndefined(e.selector) || !isNullOrUndefined(e.selector) && e.selector !== 'pasteCleanupModule')) {
            e.callBack({
                requestType: 'Image',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    insertImageLink(e) {
        let anchor = createElement('a', {
            attrs: {
                href: e.item.url
            }
        });
        if (e.item.selectNode[0].parentElement.classList.contains('e-img-wrap')) {
            e.item.selection.restore();
            anchor.setAttribute('contenteditable', 'true');
        }
        anchor.appendChild(e.item.selectNode[0]);
        if (!isNullOrUndefined(e.item.target)) {
            anchor.setAttribute('target', e.item.target);
        }
        InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
        this.callBack(e);
    }
    openImageLink(e) {
        document.defaultView.open(e.item.url, e.item.target);
        this.callBack(e);
    }
    removeImageLink(e) {
        let selectParent = e.item.selectParent[0];
        if (selectParent.classList.contains('e-img-caption')) {
            let capImgWrap = select('.e-img-wrap', selectParent);
            let textEle = select('.e-img-inner', selectParent);
            let newTextEle = textEle.cloneNode(true);
            detach(select('a', selectParent));
            detach(textEle);
            capImgWrap.appendChild(e.item.insertElement);
            capImgWrap.appendChild(newTextEle);
        }
        else {
            detach(selectParent);
            if (Browser.isIE) {
                e.item.selection.restore();
            }
            InsertHtml.Insert(this.parent.currentDocument, e.item.insertElement, this.parent.editableElement);
        }
        this.callBack(e);
    }
    editImageLink(e) {
        e.item.selectNode[0].parentElement.href = e.item.url;
        if (isNullOrUndefined(e.item.target)) {
            e.item.selectNode[0].parentElement.removeAttribute('target');
        }
        else {
            e.item.selectNode[0].parentElement.target = e.item.target;
        }
        this.callBack(e);
    }
    removeImage(e) {
        if (closest(e.item.selectNode[0], 'a')) {
            detach(closest(e.item.selectNode[0], 'a'));
        }
        else if (!isNullOrUndefined(closest(e.item.selectNode[0], '.' + CLASS_CAPTION))) {
            detach(closest(e.item.selectNode[0], '.' + CLASS_CAPTION));
        }
        else {
            detach(e.item.selectNode[0]);
        }
        this.callBack(e);
    }
    insertAltTextImage(e) {
        e.item.selectNode[0].setAttribute('alt', e.item.altText);
        this.callBack(e);
    }
    imageDimension(e) {
        let selectNode = e.item.selectNode[0];
        selectNode.style.height = '';
        selectNode.style.width = '';
        selectNode.width = e.item.width;
        selectNode.height = e.item.height;
        this.callBack(e);
    }
    imageCaption(e) {
        InsertHtml.Insert(this.parent.currentDocument, e.item.insertElement, this.parent.editableElement);
        this.callBack(e);
    }
    imageJustifyLeft(e) {
        let selectNode = e.item.selectNode[0];
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_LEFT);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], CLASS_IMAGE_RIGHT);
            addClass([selectNode.parentElement], CLASS_IMAGE_LEFT);
        }
        else {
            addClass([selectNode], CLASS_IMAGE_LEFT);
        }
        this.callBack(e);
    }
    imageJustifyCenter(e) {
        let selectNode = e.item.selectNode[0];
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_LEFT);
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_CENTER);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], CLASS_IMAGE_LEFT);
            removeClass([selectNode.parentElement], CLASS_IMAGE_RIGHT);
            addClass([selectNode.parentElement], CLASS_IMAGE_CENTER);
        }
        else {
            addClass([selectNode], CLASS_IMAGE_CENTER);
        }
        this.callBack(e);
    }
    imageJustifyRight(e) {
        let selectNode = e.item.selectNode[0];
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_LEFT);
            addClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_RIGHT);
        }
        if (selectNode.parentElement.nodeName === 'A') {
            removeClass([selectNode.parentElement], CLASS_IMAGE_LEFT);
            addClass([selectNode.parentElement], CLASS_IMAGE_RIGHT);
        }
        else {
            addClass([selectNode], CLASS_IMAGE_RIGHT);
        }
        this.callBack(e);
    }
    imageInline(e) {
        let selectNode = e.item.selectNode[0];
        selectNode.removeAttribute('class');
        addClass([selectNode], 'e-rte-image');
        addClass([selectNode], CLASS_IMAGE_INLINE);
        if (!isNullOrUndefined(closest(selectNode, '.' + CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_BREAK);
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_CENTER);
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_LEFT);
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_CAPTION_INLINE);
        }
        this.callBack(e);
    }
    imageBreak(e) {
        let selectNode = e.item.selectNode[0];
        selectNode.removeAttribute('class');
        addClass([selectNode], CLASS_IMAGE_BREAK);
        addClass([selectNode], 'e-rte-image');
        if (!isNullOrUndefined(closest(selectNode, '.' + CLASS_CAPTION))) {
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_CAPTION_INLINE);
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_CENTER);
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_LEFT);
            removeClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_RIGHT);
            addClass([closest(selectNode, '.' + CLASS_CAPTION)], CLASS_IMAGE_BREAK);
        }
        this.callBack(e);
    }
    callBack(e) {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
}

/**
 * Link internal component
 * @hidden
 */
class TableCommand {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(TABLE, this.createTable, this);
        this.parent.observer.on(INSERT_ROW, this.insertRow, this);
        this.parent.observer.on(INSERT_COLUMN, this.insertColumn, this);
        this.parent.observer.on(DELETEROW, this.deleteRow, this);
        this.parent.observer.on(DELETECOLUMN, this.deleteColumn, this);
        this.parent.observer.on(REMOVETABLE, this.removeTable, this);
        this.parent.observer.on(TABLEHEADER, this.tableHeader, this);
        this.parent.observer.on(TABLE_VERTICAL_ALIGN, this.tableVerticalAlign, this);
    }
    createTable(e) {
        let table = createElement('table', { className: 'e-rte-table' });
        let tblBody = createElement('tbody');
        table.style.width = e.item.width.width;
        let tdWid = parseInt(e.item.width.width, 10) / e.item.columns;
        for (let i = 0; i < e.item.row; i++) {
            let row = createElement('tr');
            for (let j = 0; j < e.item.columns; j++) {
                let cell = createElement('td');
                cell.appendChild(createElement('br'));
                cell.style.width = tdWid + '%';
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
        table.appendChild(tblBody);
        e.item.selection.restore();
        InsertHtml.Insert(this.parent.currentDocument, table, this.parent.editableElement);
        this.removeEmptyNode();
        e.item.selection.setSelectionText(this.parent.currentDocument, table.querySelector('td'), table.querySelector('td'), 0, 0);
        table.querySelector('td').classList.add('e-cell-select');
        if (e.callBack) {
            e.callBack({
                requestType: 'Table',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: [table]
            });
        }
        return table;
    }
    removeEmptyNode() {
        let emptyUl = this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (let i = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
        let emptyLiChild = this.parent.editableElement.querySelectorAll('li *:empty');
        for (let i = 0; i < emptyLiChild.length; i++) {
            detach(emptyLiChild[i]);
            if (emptyLiChild.length === i + 1) {
                emptyLiChild = this.parent.editableElement.querySelectorAll('li *:empty');
                i = -1;
            }
        }
        let emptyLi = this.parent.editableElement.querySelectorAll('li:empty');
        for (let i = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
    }
    insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    insertRow(e) {
        let selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        if (selectedCell.nodeName.toLowerCase() === 'th' && e.item.subCommand === 'InsertRowBefore') {
            return;
        }
        let curRow = closest(selectedCell, 'tr');
        let newRow;
        if (selectedCell.nodeName.toLowerCase() !== 'th') {
            newRow = closest(selectedCell, 'tr').cloneNode(true);
            let tabCell = Array.prototype.slice.call(newRow.querySelectorAll('td'));
            Array.prototype.forEach.call(tabCell, (cell) => {
                cell.innerHTML = '';
                cell.appendChild(createElement('br'));
                cell.removeAttribute('class');
            });
        }
        else {
            let childNodes = curRow.childNodes;
            newRow = createElement('tr');
            for (let i = 0; i < childNodes.length; i++) {
                let tdElement = createElement('td');
                tdElement.appendChild(createElement('br'));
                newRow.appendChild(tdElement);
            }
        }
        (e.item.subCommand === 'InsertRowBefore') ?
            curRow.parentElement.insertBefore(newRow, curRow) : this.insertAfter(newRow, curRow);
        e.item.selection.setSelectionText(this.parent.currentDocument, e.item.selection.range.startContainer, e.item.selection.range.startContainer, 0, 0);
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    insertColumn(e) {
        let selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        selectedCell = (selectedCell.nodeName !== 'TD') ? closest(selectedCell, 'td,th') : selectedCell;
        let curRow = closest(selectedCell, 'tr');
        let curCell;
        let allRows = closest((curRow), 'table').rows;
        let colIndex = Array.prototype.slice.call(curRow.querySelectorAll('th,td')).indexOf(selectedCell);
        let width = parseInt(e.item.width, 10) / (curRow.querySelectorAll('td,th').length + 1);
        for (let j = 0; j < closest(curRow, 'table').querySelectorAll('th,td').length; j++) {
            closest(curRow, 'table').querySelectorAll('th,td')[j].style.width = width + '%';
        }
        for (let i = 0; i < allRows.length; i++) {
            curCell = allRows[i].querySelectorAll('th,td')[colIndex];
            let colTemplate = curCell.cloneNode(true);
            colTemplate.innerHTML = '';
            colTemplate.appendChild(createElement('br'));
            colTemplate.removeAttribute('class');
            (e.item.subCommand === 'InsertColumnLeft') ? curCell.parentElement.insertBefore(colTemplate, curCell) :
                this.insertAfter(colTemplate, curCell);
        }
        e.item.selection.setSelectionText(this.parent.currentDocument, selectedCell, selectedCell, 0, 0);
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    deleteColumn(e) {
        let selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        let selectedCellIndex = selectedCell.cellIndex;
        let parentTable = closest(selectedCell, 'table');
        let curRow = closest(selectedCell, 'tr');
        let allRows = closest(curRow, 'table').rows;
        if (curRow.querySelectorAll('th,td').length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        }
        else {
            for (let i = 0; i < allRows.length; i++) {
                allRows[i].deleteCell(selectedCellIndex);
                if (Browser.isIE) {
                    e.item.selection.setSelectionText(this.parent.currentDocument, parentTable.querySelector('td'), parentTable.querySelector('td'), 0, 0);
                    parentTable.querySelector('td, th').classList.add('e-cell-select');
                }
            }
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    deleteRow(e) {
        let selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        let selectedRowIndex = selectedCell.parentNode.rowIndex;
        let parentTable = closest(selectedCell, 'table');
        if (parentTable.rows.length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        }
        else {
            if (selectedCell.tagName === 'TH') {
                detach(parentTable.querySelector('thead'));
            }
            else {
                parentTable.deleteRow(selectedRowIndex);
            }
            e.item.selection.setSelectionText(this.parent.currentDocument, parentTable.querySelector('td'), parentTable.querySelector('td'), 0, 0);
            parentTable.querySelector('td, th').classList.add('e-cell-select');
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    removeTable(e) {
        let selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        let seletedTable = closest(selectedCell.parentElement, 'table');
        if (seletedTable) {
            e.item.selection.restore();
            detach(seletedTable);
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    tableHeader(e) {
        let headerExit = false;
        let selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        let table = closest(selectedCell.parentElement, 'table');
        [].slice.call(table.childNodes).forEach((el) => {
            if (el.nodeName === 'THEAD') {
                headerExit = true;
            }
        });
        if (table && !headerExit) {
            let cellCount = table.querySelector('tr').childElementCount;
            let header = table.createTHead();
            let row = header.insertRow(0);
            for (let i = 0; i < cellCount; i++) {
                let th = createElement('th');
                th.appendChild(createElement('br'));
                row.appendChild(th);
            }
        }
        else {
            table.deleteTHead();
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
    tableVerticalAlign(e) {
        if (e.item.subCommand === 'AlignTop') {
            e.item.tableCell.style.verticalAlign = 'top';
        }
        else if (e.item.subCommand === 'AlignMiddle') {
            e.item.tableCell.style.verticalAlign = 'middle';
        }
        else {
            e.item.tableCell.style.verticalAlign = 'bottom';
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
}

/**
 * Is formatted or not.
 * @hidden
 */
class IsFormatted {
    getFormattedNode(node, format, endNode) {
        let parentNode = this.getFormatParent(node, format, endNode);
        if (parentNode !== null && parentNode !== endNode) {
            return parentNode;
        }
        return null;
    }
    getFormatParent(node, format, endNode) {
        do {
            node = node.parentNode;
        } while (node && (node !== endNode) && !this.isFormattedNode(node, format));
        return node;
    }
    isFormattedNode(node, format) {
        switch (format) {
            case 'bold':
                return IsFormatted.isBold(node);
            case 'italic':
                return IsFormatted.isItalic(node);
            case 'underline':
                return IsFormatted.isUnderline(node);
            case 'strikethrough':
                return IsFormatted.isStrikethrough(node);
            case 'superscript':
                return IsFormatted.isSuperscript(node);
            case 'subscript':
                return IsFormatted.isSubscript(node);
            case 'fontcolor':
                return this.isFontColor(node);
            case 'fontname':
                return this.isFontName(node);
            case 'fontsize':
                return this.isFontSize(node);
            case 'backgroundcolor':
                return this.isBackgroundColor(node);
            default:
                return false;
        }
    }
    static isBold(node) {
        let validTags = ['strong', 'b'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.fontWeight === 'bold') {
            return true;
        }
        else {
            return false;
        }
    }
    static isItalic(node) {
        let validTags = ['em', 'i'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.fontStyle === 'italic') {
            return true;
        }
        else {
            return false;
        }
    }
    static isUnderline(node) {
        let validTags = ['u'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.textDecoration === 'underline') {
            return true;
        }
        else {
            return false;
        }
    }
    static isStrikethrough(node) {
        let validTags = ['del', 'strike'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.textDecoration === 'line-through') {
            return true;
        }
        else {
            return false;
        }
    }
    static isSuperscript(node) {
        let validTags = ['sup'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }
    static isSubscript(node) {
        let validTags = ['sub'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }
    isFontColor(node) {
        let color = node.style && node.style.color;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            color !== null && color !== '' && color !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    isBackgroundColor(node) {
        let backColor = node.style && node.style.backgroundColor;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            backColor !== null && backColor !== '' && backColor !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    isFontSize(node) {
        let size = node.style && node.style.fontSize;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            size !== null && size !== '' && size !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    isFontName(node) {
        let name = node.style && node.style.fontFamily;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            name !== null && name !== '' && name !== undefined) {
            return true;
        }
        else {
            return false;
        }
    }
}
// Get Formatted Node
IsFormatted.inlineTags = [
    'a',
    'abbr',
    'acronym',
    'b',
    'bdo',
    'big',
    'cite',
    'code',
    'dfn',
    'em',
    'i',
    'kbd',
    'label',
    'q',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'tt',
    'u',
    'var'
];

/**
 * `Selection` module is used to handle RTE Selections.
 */
class SelectionCommands {
    static applyFormat(docElement, format, endNode, value, selector) {
        let validFormats = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase', 'fontcolor', 'fontname', 'fontsize', 'backgroundcolor'];
        if (validFormats.indexOf(format) > -1) {
            let domSelection = new NodeSelection();
            let nodeCutter = new NodeCutter();
            let isFormatted = new IsFormatted();
            let range = domSelection.getRange(docElement);
            let save = domSelection.save(range, docElement);
            let nodes = domSelection.getSelectionNodeCollection(range);
            let isCollapsed = false;
            let isFormat = false;
            let isCursor = false;
            let isFontStyle = (['fontcolor', 'fontname', 'fontsize', 'backgroundcolor'].indexOf(format) > -1);
            if (range.collapsed) {
                if (nodes.length > 0) {
                    isCollapsed = true;
                    range = nodeCutter.GetCursorRange(docElement, range, nodes[0]);
                }
                else if (range.startContainer.nodeName.toLowerCase() !== 'td') {
                    let cursorNode = this.insertCursorNode(docElement, domSelection, range, isFormatted, nodeCutter, format, value, endNode);
                    domSelection.endContainer = domSelection.startContainer = domSelection.getNodeArray(cursorNode, true);
                    domSelection.endOffset = domSelection.startOffset = 1;
                }
            }
            isCursor = range.collapsed;
            for (let index = 0; index < nodes.length; index++) {
                let formatNode = isFormatted.getFormattedNode(nodes[index], format, endNode);
                if (index === 0 && formatNode === null) {
                    isFormat = true;
                }
                if (formatNode !== null && (!isFormat || isFontStyle)) {
                    nodes[index] = this.removeFormat(nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value, domSelection);
                }
                else {
                    nodes[index] = this.insertFormat(docElement, nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value);
                }
                domSelection = this.applySelection(nodes, domSelection, nodeCutter, index, isCollapsed);
            }
            if (isIDevice$1()) {
                setEditFrameFocus(endNode, selector);
            }
            save.restore();
        }
    }
    static insertCursorNode(docElement, domSelection, range, isFormatted, nodeCutter, format, value, endNode) {
        let cursorNodes = domSelection.getNodeCollection(range);
        let cursorFormat = (cursorNodes.length > 0) ? isFormatted.getFormattedNode(cursorNodes[0], format, endNode) : null;
        let cursorNode = null;
        if (cursorFormat) {
            cursorNode = cursorNodes[0];
            InsertMethods.unwrap(cursorFormat);
            cursorNodes[0] = InsertMethods.Wrap(cursorNodes[0], this.GetFormatNode(format, value));
        }
        else {
            cursorNode = this.getInsertNode(docElement, range, format, value).firstChild;
        }
        return cursorNode;
    }
    static removeFormat(nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value, domSelection) {
        let splitNode = null;
        if (!(range.startContainer === range.endContainer && range.startOffset === 0
            && range.endOffset === range.startContainer.length)) {
            let nodeIndex = [];
            let cloneNode = nodes[index];
            do {
                nodeIndex.push(domSelection.getIndex(cloneNode));
                cloneNode = cloneNode.parentNode;
            } while (cloneNode && (cloneNode !== formatNode));
            cloneNode = splitNode = nodeCutter.GetSpliceNode(range, formatNode);
            if (!isCursor) {
                while (cloneNode && cloneNode.childNodes.length > 0 && ((nodeIndex.length - 1) >= 0)
                    && (cloneNode.childNodes.length > nodeIndex[nodeIndex.length - 1])) {
                    cloneNode = cloneNode.childNodes[nodeIndex[nodeIndex.length - 1]];
                    nodeIndex.pop();
                }
                if (cloneNode.nodeType === 3 && !(isCursor && cloneNode.nodeValue === '')) {
                    nodes[index] = cloneNode;
                }
                else {
                    let divNode = document.createElement('div');
                    divNode.innerHTML = '&#65279;&#65279;';
                    if (cloneNode.nodeType !== 3) {
                        cloneNode.insertBefore(divNode.firstChild, cloneNode.firstChild);
                        nodes[index] = cloneNode.firstChild;
                    }
                    else {
                        cloneNode.parentNode.insertBefore(divNode.firstChild, cloneNode);
                        nodes[index] = cloneNode.previousSibling;
                        cloneNode.parentNode.removeChild(cloneNode);
                    }
                }
            }
            else {
                let lastNode = splitNode;
                for (; lastNode.firstChild !== null && lastNode.firstChild.nodeType !== 3; null) {
                    lastNode = lastNode.firstChild;
                }
                lastNode.innerHTML = '&#65279;&#65279;';
                nodes[index] = lastNode.firstChild;
            }
        }
        let child = InsertMethods.unwrap(formatNode);
        if (child.length > 0 && isFontStyle) {
            for (let num = 0; num < child.length; num++) {
                child[num] = InsertMethods.Wrap(child[num], this.GetFormatNode(format, value));
            }
            if (format === 'fontsize') {
                let liElement = nodes[index].parentElement;
                let parentElement = nodes[index].parentElement;
                while (!isNullOrUndefined(parentElement) && parentElement.tagName.toLowerCase() !== 'li') {
                    parentElement = parentElement.parentElement;
                    liElement = parentElement;
                }
                if (!isNullOrUndefined(liElement) && liElement.tagName.toLowerCase() === 'li' &&
                    liElement.textContent.trim() === nodes[index].textContent.trim()) {
                    liElement.style.fontSize = value;
                }
            }
        }
        return nodes[index];
    }
    static insertFormat(docElement, nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value) {
        if (!isCursor) {
            if ((formatNode === null && isFormat) || isFontStyle) {
                nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index]);
                nodes[index].textContent = nodeCutter.TrimLineBreak(nodes[index].textContent);
                if (format === 'uppercase' || format === 'lowercase') {
                    nodes[index].textContent = (format === 'uppercase') ? nodes[index].textContent.toLocaleUpperCase()
                        : nodes[index].textContent.toLocaleLowerCase();
                }
                else if (!(isFontStyle === true && value === '')) {
                    let element = this.GetFormatNode(format, value);
                    if (format === 'fontsize') {
                        let liElement = nodes[index].parentElement;
                        let parentElement = nodes[index].parentElement;
                        while (!isNullOrUndefined(parentElement) && parentElement.tagName.toLowerCase() !== 'li') {
                            parentElement = parentElement.parentElement;
                            liElement = parentElement;
                        }
                        if (!isNullOrUndefined(liElement) && liElement.tagName.toLowerCase() === 'li' &&
                            liElement.textContent.trim() === nodes[index].textContent.trim()) {
                            liElement.style.fontSize = value;
                        }
                        nodes[index] = this.applyStyles(nodes, index, element);
                    }
                    else {
                        nodes[index] = this.applyStyles(nodes, index, element);
                    }
                }
            }
            else {
                nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index]);
            }
        }
        else {
            if (format !== 'uppercase' && format !== 'lowercase') {
                let element = this.getInsertNode(docElement, range, format, value);
                nodes[index] = element.firstChild;
                nodeCutter.position = 1;
            }
            else {
                nodeCutter.position = range.startOffset;
            }
        }
        return nodes[index];
    }
    static applyStyles(nodes, index, element) {
        nodes[index] = (index === (nodes.length - 1)) ? InsertMethods.Wrap(nodes[index], element)
            : InsertMethods.WrapBefore(nodes[index], element, true);
        nodes[index] = this.getChildNode(nodes[index], element);
        return nodes[index];
    }
    static getInsertNode(docElement, range, format, value) {
        let element = this.GetFormatNode(format, value);
        element.innerHTML = '&#65279;&#65279;';
        if (Browser.isIE) {
            let frag = docElement.createDocumentFragment();
            frag.appendChild(element);
            range.insertNode(frag);
        }
        else {
            range.insertNode(element);
        }
        return element;
    }
    static getChildNode(node, element) {
        if (node === undefined || node === null) {
            element.innerHTML = '&#65279;';
            node = element.firstChild;
        }
        return node;
    }
    static applySelection(nodes, domSelection, nodeCutter, index, isCollapsed) {
        if (nodes.length === 1 && !isCollapsed) {
            domSelection.startContainer = domSelection.getNodeArray(nodes[index], true);
            domSelection.endContainer = domSelection.startContainer;
            domSelection.startOffset = 0;
            domSelection.endOffset = nodes[index].textContent.length;
        }
        else if (nodes.length === 1 && isCollapsed) {
            domSelection.startContainer = domSelection.getNodeArray(nodes[index], true);
            domSelection.endContainer = domSelection.startContainer;
            domSelection.startOffset = nodeCutter.position;
            domSelection.endOffset = nodeCutter.position;
        }
        else if (index === 0) {
            domSelection.startContainer = domSelection.getNodeArray(nodes[index], true);
            domSelection.startOffset = 0;
        }
        else if (index === nodes.length - 1) {
            domSelection.endContainer = domSelection.getNodeArray(nodes[index], false);
            domSelection.endOffset = nodes[index].textContent.length;
        }
        return domSelection;
    }
    static GetFormatNode(format, value) {
        let node;
        switch (format) {
            case 'bold':
                return document.createElement('strong');
            case 'italic':
                return document.createElement('em');
            case 'underline':
                node = document.createElement('span');
                node.style.textDecoration = 'underline';
                return node;
            case 'strikethrough':
                node = document.createElement('span');
                node.style.textDecoration = 'line-through';
                return node;
            case 'superscript':
                return document.createElement('sup');
            case 'subscript':
                return document.createElement('sub');
            case 'fontcolor':
                node = document.createElement('span');
                node.style.color = value;
                node.style.textDecoration = 'inherit';
                return node;
            case 'fontname':
                node = document.createElement('span');
                node.style.fontFamily = value;
                return node;
            case 'fontsize':
                node = document.createElement('span');
                node.style.fontSize = value;
                return node;
            default:
                node = document.createElement('span');
                node.style.backgroundColor = value;
                return node;
        }
    }
}

/**
 * Selection EXEC internal component
 * @hidden
 */
class SelectionBasedExec {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(SELECTION_TYPE, this.applySelection, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
    }
    keyDownHandler(e) {
        let validFormats = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase'];
        if (e.event.ctrlKey && validFormats.indexOf(e.event.action) > -1) {
            e.event.preventDefault();
            SelectionCommands.applyFormat(this.parent.currentDocument, e.event.action, this.parent.editableElement);
            this.callBack(e, e.event.action);
        }
    }
    applySelection(e) {
        SelectionCommands.applyFormat(this.parent.currentDocument, e.subCommand.toLocaleLowerCase(), this.parent.editableElement, e.value, e.selector);
        this.callBack(e, e.subCommand);
    }
    callBack(event, action) {
        if (event.callBack) {
            event.callBack({
                requestType: action,
                event: event.event,
                editorMode: 'HTML',
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
}

/**
 * Selection EXEC internal component
 * @hidden
 */
class InsertHtmlExec {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(INSERTHTML_TYPE, this.applyHtml, this);
    }
    applyHtml(e) {
        InsertHtml.Insert(this.parent.currentDocument, e.value, this.parent.editableElement);
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
}

/**
 * `Clear Format` module is used to handle Clear Format.
 */
class ClearFormat$1 {
    static clear(docElement, endNode, selector) {
        let nodeSelection = new NodeSelection();
        let nodeCutter = new NodeCutter();
        let range = nodeSelection.getRange(docElement);
        let isCollapsed = range.collapsed;
        let nodes = nodeSelection.getInsertNodeCollection(range);
        let save = nodeSelection.save(range, docElement);
        if (!isCollapsed) {
            let preNode = nodeCutter.GetSpliceNode(range, nodes[0]);
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            }
            else {
                let lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1]);
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            let exactNodes = nodeSelection.getNodeCollection(range);
            let cloneSelectNodes = exactNodes.slice();
            this.clearInlines(nodeSelection.getSelectionNodes(cloneSelectNodes), cloneSelectNodes, nodeSelection.getRange(docElement), nodeCutter, endNode);
            this.reSelection(docElement, save, exactNodes);
            range = nodeSelection.getRange(docElement);
            exactNodes = nodeSelection.getNodeCollection(range);
            let cloneParentNodes = exactNodes.slice();
            this.clearBlocks(docElement, cloneParentNodes, endNode, nodeCutter, nodeSelection);
            if (isIDevice$1()) {
                setEditFrameFocus(endNode, selector);
            }
            this.reSelection(docElement, save, exactNodes);
        }
    }
    static reSelection(docElement, save, exactNodes) {
        let selectionNodes = save.getInsertNodes(exactNodes);
        save.startContainer = save.getNodeArray(selectionNodes[0], true, docElement);
        save.startOffset = 0;
        save.endContainer = save.getNodeArray(selectionNodes[selectionNodes.length - 1], false, docElement);
        let endIndexNode = selectionNodes[selectionNodes.length - 1];
        save.endOffset = (endIndexNode.nodeType === 3) ? endIndexNode.textContent.length
            : endIndexNode.childNodes.length;
        save.restore();
    }
    static clearBlocks(docElement, nodes, endNode, nodeCutter, nodeSelection) {
        let parentNodes = [];
        for (let index = 0; index < nodes.length; index++) {
            if (this.BLOCK_TAGS.indexOf(nodes[index].nodeName.toLocaleLowerCase()) > -1
                && parentNodes.indexOf(nodes[index]) === -1) {
                parentNodes.push(nodes[index]);
            }
            else if ((this.BLOCK_TAGS.indexOf(nodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1)
                && parentNodes.indexOf(nodes[index].parentNode) === -1
                && endNode !== nodes[index].parentNode) {
                parentNodes.push(nodes[index].parentNode);
            }
        }
        parentNodes = this.spliceParent(parentNodes, nodes)[0];
        parentNodes = this.removeParent(parentNodes);
        this.unWrap(docElement, parentNodes, nodeCutter, nodeSelection);
    }
    static spliceParent(parentNodes, nodes) {
        for (let index1 = 0; index1 < parentNodes.length; index1++) {
            let len = parentNodes[index1].childNodes.length;
            for (let index2 = 0; index2 < len; index2++) {
                if ((nodes.indexOf(parentNodes[index1].childNodes[index2]) > 0)
                    && (parentNodes[index1].childNodes[index2].childNodes.length > 0)) {
                    nodes = this.spliceParent([parentNodes[index1].childNodes[index2]], nodes)[1];
                }
                if ((nodes.indexOf(parentNodes[index1].childNodes[index2]) <= -1) &&
                    (parentNodes[index1].childNodes[index2].textContent.trim() !== '')) {
                    for (let index3 = 0; index3 < len; index3++) {
                        if (nodes.indexOf(parentNodes[index1].childNodes[index3]) > -1) {
                            nodes.splice(nodes.indexOf(parentNodes[index1].childNodes[index3]), 1);
                        }
                    }
                    index2 = parentNodes[index1].childNodes.length;
                    let parentIndex = parentNodes.indexOf(parentNodes[index1].parentNode);
                    let nodeIndex = nodes.indexOf(parentNodes[index1].parentNode);
                    if (parentIndex > -1) {
                        parentNodes.splice(parentIndex, 1);
                    }
                    if (nodeIndex > -1) {
                        nodes.splice(nodeIndex, 1);
                    }
                    let elementIndex = nodes.indexOf(parentNodes[index1]);
                    if (elementIndex > -1) {
                        nodes.splice(elementIndex, 1);
                    }
                    parentNodes.splice(index1, 1);
                    index1--;
                }
            }
        }
        return [parentNodes, nodes];
    }
    static removeChild(parentNodes, parentNode) {
        let count = parentNode.childNodes.length;
        if (count > 0) {
            for (let index = 0; index < count; index++) {
                if (parentNodes.indexOf(parentNode.childNodes[index]) > -1) {
                    parentNodes = this.removeChild(parentNodes, parentNode.childNodes[index]);
                    parentNodes.splice(parentNodes.indexOf(parentNode.childNodes[index]), 1);
                }
            }
        }
        return parentNodes;
    }
    static removeParent(parentNodes) {
        for (let index = 0; index < parentNodes.length; index++) {
            if (parentNodes.indexOf(parentNodes[index].parentNode) > -1) {
                parentNodes = this.removeChild(parentNodes, parentNodes[index]);
                parentNodes.splice(index, 1);
                index--;
            }
        }
        return parentNodes;
    }
    static unWrap(docElement, parentNodes, nodeCutter, nodeSelection) {
        for (let index1 = 0; index1 < parentNodes.length; index1++) {
            if (this.NONVALID_TAGS.indexOf(parentNodes[index1].nodeName.toLowerCase()) > -1
                && parentNodes[index1].parentNode
                && this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1].parentNode.nodeName.toLowerCase()) > -1) {
                nodeSelection.setSelectionText(docElement, parentNodes[index1], parentNodes[index1], 0, parentNodes[index1].childNodes.length);
                InsertMethods.unwrap(nodeCutter.GetSpliceNode(nodeSelection.getRange(docElement), parentNodes[index1].parentNode));
            }
            if (parentNodes[index1].nodeName.toLocaleLowerCase() !== 'p') {
                if (this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1].nodeName.toLowerCase()) < 0
                    && parentNodes[index1].parentNode.nodeName.toLocaleLowerCase() !== 'p'
                    && !((parentNodes[index1].nodeName.toLocaleLowerCase() === 'blockquote'
                        || parentNodes[index1].nodeName.toLocaleLowerCase() === 'li')
                        && this.IGNORE_PARENT_TAGS.indexOf(parentNodes[index1].childNodes[0].nodeName.toLocaleLowerCase()) > -1)
                    && !(parentNodes[index1].childNodes.length === 1
                        && parentNodes[index1].childNodes[0].nodeName.toLocaleLowerCase() === 'p')) {
                    InsertMethods.Wrap(parentNodes[index1], docElement.createElement('p'));
                }
                let childNodes = InsertMethods.unwrap(parentNodes[index1]);
                if (childNodes.length === 1
                    && childNodes[0].parentNode.nodeName.toLocaleLowerCase() === 'p') {
                    InsertMethods.Wrap(parentNodes[index1], docElement.createElement('p'));
                    InsertMethods.unwrap(parentNodes[index1]);
                }
                for (let index2 = 0; index2 < childNodes.length; index2++) {
                    if (this.NONVALID_TAGS.indexOf(childNodes[index2].nodeName.toLowerCase()) > -1) {
                        this.unWrap(docElement, [childNodes[index2]], nodeCutter, nodeSelection);
                    }
                    else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].nodeName.toLocaleLowerCase() !== 'p') {
                        let blockNodes = this.removeParent([childNodes[index2]]);
                        this.unWrap(docElement, blockNodes, nodeCutter, nodeSelection);
                    }
                    else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].parentNode.nodeName.toLocaleLowerCase() === childNodes[index2].nodeName.toLocaleLowerCase()) {
                        InsertMethods.unwrap(childNodes[index2]);
                    }
                    else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].nodeName.toLocaleLowerCase() === 'p') {
                        InsertMethods.Wrap(childNodes[index2], docElement.createElement('p'));
                        InsertMethods.unwrap(childNodes[index2]);
                    }
                }
            }
            else {
                InsertMethods.Wrap(parentNodes[index1], docElement.createElement('p'));
                InsertMethods.unwrap(parentNodes[index1]);
            }
        }
    }
    static clearInlines(textNodes, nodes, range, nodeCutter, endNode) {
        for (let index = 0; index < textNodes.length; index++) {
            if (textNodes[index].parentNode &&
                IsFormatted.inlineTags.indexOf(textNodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1) {
                nodeCutter.GetSpliceNode(range, textNodes[index].parentNode);
                this.removeInlineParent(textNodes[index].parentNode);
            }
        }
    }
    static removeInlineParent(textNodes) {
        let nodes = InsertMethods.unwrap(textNodes);
        for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].parentNode.childNodes.length === 1
                && IsFormatted.inlineTags.indexOf(nodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index].parentNode);
            }
            else if (IsFormatted.inlineTags.indexOf(nodes[index].nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index]);
            }
        }
    }
}
ClearFormat$1.BLOCK_TAGS = ['address', 'article', 'aside', 'blockquote',
    'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'li', 'main', 'nav',
    'noscript', 'ol', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr', 'ul'];
ClearFormat$1.NONVALID_PARENT_TAGS = ['thead', 'tbody', 'ul', 'ol', 'table', 'tfoot', 'tr'];
ClearFormat$1.IGNORE_PARENT_TAGS = ['ul', 'ol', 'table'];
ClearFormat$1.NONVALID_TAGS = ['thead', 'tbody', 'figcaption', 'td', 'tr',
    'th', 'tfoot', 'figcaption', 'li'];

/**
 * Clear Format EXEC internal component
 * @hidden
 */
class ClearFormatExec {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(CLEAR_TYPE, this.applyClear, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    }
    onKeyDown(e) {
        switch (e.event.action) {
            case 'clear-format':
                this.applyClear({ subCommand: 'ClearFormat', callBack: e.callBack });
                e.event.preventDefault();
                break;
        }
    }
    applyClear(e) {
        if (e.subCommand === 'ClearFormat') {
            ClearFormat$1.clear(this.parent.currentDocument, this.parent.editableElement, e.selector);
            if (e.callBack) {
                e.callBack({
                    requestType: e.subCommand,
                    event: e.event,
                    editorMode: 'HTML',
                    range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
                });
            }
        }
    }
}

/**
 * `Undo` module is used to handle undo actions.
 */
class UndoRedoManager {
    constructor(parent, options) {
        this.undoRedoStack = [];
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.addEventListener();
    }
    addEventListener() {
        let debounceListener = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(KEY_UP_HANDLER, debounceListener, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(ACTION, this.onAction, this);
        this.parent.observer.on(MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
    }
    onPropertyChanged(props) {
        for (let prop of Object.keys(props.newProp)) {
            switch (prop) {
                case 'undoRedoSteps':
                    this.undoRedoSteps = props.newProp.undoRedoSteps;
                    break;
                case 'undoRedoTimer':
                    this.undoRedoTimer = props.newProp.undoRedoTimer;
                    break;
            }
        }
    }
    removeEventListener() {
        this.parent.observer.off(KEY_UP_HANDLER, this.keyUp);
        this.parent.observer.off(KEY_DOWN_HANDLER, this.keyDown);
        this.parent.observer.off(ACTION, this.onAction);
    }
    onAction(e) {
        if (e.subCommand === 'Undo') {
            this.undo(e);
        }
        else {
            this.redo(e);
        }
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
    keyDown(e) {
        let event = e.event;
        let proxy = this;
        switch (event.action) {
            case 'undo':
                event.preventDefault();
                proxy.undo(e);
                break;
            case 'redo':
                event.preventDefault();
                proxy.redo(e);
                break;
        }
    }
    keyUp(e) {
        if (e.event.keyCode !== 17 && !e.event.ctrlKey) {
            this.saveData(e);
        }
    }
    /**
     * RTE collection stored html format.
     * @method saveData
     * @return {void}
     */
    saveData(e) {
        let range = new NodeSelection().getRange(this.parent.currentDocument);
        let save = new NodeSelection().save(range, this.parent.currentDocument);
        let htmlText = this.parent.editableElement.innerHTML;
        let changEle = { text: htmlText, range: save };
        if (this.undoRedoStack.length >= this.steps) {
            this.undoRedoStack = this.undoRedoStack.slice(0, this.steps + 1);
        }
        if (this.undoRedoStack.length > 1 && (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.collapsed === range.collapsed)
            && (this.undoRedoStack[this.undoRedoStack.length - 1].range.startOffset === save.range.startOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.endOffset === save.range.endOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.startContainer === save.range.startContainer) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].text.trim() === changEle.text.trim())) {
            return;
        }
        this.undoRedoStack.push(changEle);
        this.steps = this.undoRedoStack.length - 1;
        if (this.steps > this.undoRedoSteps) {
            this.undoRedoStack.shift();
            this.steps--;
        }
        if (e && e.callBack) {
            e.callBack();
        }
    }
    /**
     * Undo the editable text.
     * @method undo
     * @return {void}
     */
    undo(e) {
        if (this.steps > 0) {
            let range = this.undoRedoStack[this.steps - 1].range;
            let removedContent = this.undoRedoStack[this.steps - 1].text;
            this.parent.editableElement.innerHTML = removedContent;
            this.parent.editableElement.focus();
            if (isIDevice$1()) {
                setEditFrameFocus(this.parent.editableElement, e.selector);
            }
            range.restore();
            this.steps--;
            if (e.callBack) {
                e.callBack({
                    requestType: 'Undo',
                    editorMode: 'HTML',
                    range: range,
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument),
                    event: e.event
                });
            }
        }
    }
    /**
     * Redo the editable text.
     * @method redo
     * @return {void}
     */
    redo(e) {
        if (this.undoRedoStack[this.steps + 1] != null) {
            let range = this.undoRedoStack[this.steps + 1].range;
            this.parent.editableElement.innerHTML = this.undoRedoStack[this.steps + 1].text;
            this.parent.editableElement.focus();
            if (isIDevice$1()) {
                setEditFrameFocus(this.parent.editableElement, e.selector);
            }
            range.restore();
            this.steps++;
            if (e.callBack) {
                e.callBack({
                    requestType: 'Redo',
                    editorMode: 'HTML',
                    range: range,
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument),
                    event: e.event
                });
            }
        }
    }
    getUndoStatus() {
        let status = { undo: false, redo: false };
        if (this.steps > 0) {
            status.undo = true;
        }
        if (this.undoRedoStack[this.steps + 1] != null) {
            status.redo = true;
        }
        return status;
    }
}

/**
 * PasteCleanup for MsWord content
 * @hidden
 */
class MsWordPaste {
    constructor(parent) {
        this.olData = [
            'decimal',
            'lower-alpha',
            'lower-roman',
            'upper-alpha',
            'upper-roman',
            'lower-greek'
        ];
        this.ulData = [
            'disc',
            'square',
            'circle',
            'disc',
            'square',
            'circle'
        ];
        this.ignorableNodes = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
            'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
            'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
            'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
            'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
            'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
            'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
        this.blockNode = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
            'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
            'object', 'ol', 'pre', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
            'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
        this.removableElements = ['o:p', 'style'];
        this.listContents = [];
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(MS_WORD_CLEANUP_PLUGIN, this.wordCleanup, this);
    }
    wordCleanup(e) {
        let wordPasteStyleConfig = e.allowedStylePropertiesArray;
        let listNodes = [];
        let tempHTMLContent = e.args.clipboardData.getData('text/HTML');
        let elm = createElement('p');
        elm.innerHTML = tempHTMLContent;
        let patern = /class='?Mso|style='[^ ]*\bmso-/i;
        let patern2 = /class="?Mso|style="[^ ]*\bmso-/i;
        if (patern.test(tempHTMLContent) || patern2.test(tempHTMLContent)) {
            tempHTMLContent = tempHTMLContent.replace(/<img[^>]+>/i, '');
            listNodes = this.cleanUp(elm, listNodes);
            this.listConverter(listNodes);
            this.styleCorrection(elm, wordPasteStyleConfig);
            this.removingComments(elm);
            this.removeUnwantedElements(elm);
            this.removeEmptyElements(elm);
            this.breakLineAddition(elm);
            this.removeClassName(elm);
            e.callBack(elm.innerHTML);
        }
        else {
            e.callBack(elm.innerHTML);
        }
    }
    removeClassName(elm) {
        let elmWithClass = elm.querySelectorAll('*[class]');
        for (let i = 0; i < elmWithClass.length; i++) {
            elmWithClass[i].removeAttribute('class');
        }
    }
    breakLineAddition(elm) {
        let allElements = elm.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].children.length === 0 && allElements[i].innerHTML === '&nbsp;') {
                let detachableElement = this.findDetachElem(allElements[i]);
                let brElement = createElement('br');
                detachableElement.parentElement.insertBefore(brElement, detachableElement);
                detach(detachableElement);
            }
        }
    }
    findDetachElem(element) {
        let removableElement;
        if (element.parentElement.textContent.trim() === '' && element.parentElement.tagName !== 'TD') {
            removableElement = this.findDetachElem(element.parentElement);
        }
        else {
            removableElement = element;
        }
        return removableElement;
    }
    removeUnwantedElements(elm) {
        let innerElement = elm.innerHTML;
        for (let i = 0; i < this.removableElements.length; i++) {
            let regExpStartElem = new RegExp('<' + this.removableElements[i] + '>', 'g');
            let regExpEndElem = new RegExp('</' + this.removableElements[i] + '>', 'g');
            innerElement = innerElement.replace(regExpStartElem, '');
            innerElement = innerElement.replace(regExpEndElem, '');
        }
        elm.innerHTML = innerElement;
        elm.querySelectorAll(':empty');
    }
    findDetachEmptyElem(element) {
        let removableElement;
        if (!isNullOrUndefined(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '') {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            }
            else {
                removableElement = element;
            }
        }
        else {
            removableElement = null;
        }
        return removableElement;
    }
    removeEmptyElements(element) {
        let emptyElements = element.querySelectorAll(':empty');
        for (let i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR') {
                let detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                detach(detachableElement);
            }
        }
    }
    styleCorrection(elm, wordPasteStyleConfig) {
        let styleElement = elm.querySelectorAll('style');
        if (styleElement.length > 0) {
            let styles = styleElement[0].innerHTML.match(/[\S ]+\s+{[\s\S]+?}/gi);
            let styleClassObject = !isNullOrUndefined(styles) ? this.findStyleObject(styles) : null;
            let keys = Object.keys(styleClassObject);
            let values = keys.map((key) => { return styleClassObject[key]; });
            values = this.removeUnwantedStyle(values, wordPasteStyleConfig);
            this.filterStyles(elm, wordPasteStyleConfig);
            let resultElem;
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].split('.')[0] === '') {
                    resultElem = elm.getElementsByClassName(keys[i].split('.')[1]);
                }
                else if (keys[i].split('.').length === 1 && keys[i].split('.')[0].indexOf('@') >= 0) {
                    continue;
                }
                else if (keys[i].split('.').length === 1 && keys[i].split('.')[0].indexOf('@') < 0) {
                    resultElem = elm.getElementsByTagName(keys[i]);
                }
                else {
                    resultElem = elm.querySelectorAll(keys[i]);
                }
                for (let j = 0; j < resultElem.length; j++) {
                    let styleProperty = resultElem[j].getAttribute('style');
                    if (!isNullOrUndefined(styleProperty) && styleProperty.trim() !== '') {
                        let valueSplit = values[i].split(';');
                        for (let k = 0; k < valueSplit.length; k++) {
                            if (styleProperty.indexOf(valueSplit[k].split(':')[0]) >= 0) {
                                valueSplit.splice(k, 1);
                                k--;
                            }
                        }
                        values[i] = valueSplit.join(';') + ';';
                        let changedValue = values[i] + styleProperty;
                        resultElem[j].setAttribute('style', changedValue);
                    }
                    else {
                        resultElem[j].setAttribute('style', values[i]);
                    }
                }
            }
        }
    }
    filterStyles(elm, wordPasteStyleConfig) {
        let elmWithStyles = elm.querySelectorAll('*[style]');
        for (let i = 0; i < elmWithStyles.length; i++) {
            let elemStyleProperty = elmWithStyles[i].getAttribute('style').split(';');
            let styleValue = '';
            for (let j = 0; j < elemStyleProperty.length; j++) {
                if (wordPasteStyleConfig.indexOf(elemStyleProperty[j].split(':')[0].trim()) >= 0) {
                    styleValue += elemStyleProperty[j] + ';';
                }
            }
            elmWithStyles[i].setAttribute('style', styleValue);
        }
    }
    removeUnwantedStyle(values, wordPasteStyleConfig) {
        for (let i = 0; i < values.length; i++) {
            let styleValues = values[i].split(';');
            values[i] = '';
            for (let j = 0; j < styleValues.length; j++) {
                if (wordPasteStyleConfig.indexOf(styleValues[j].split(':')[0]) >= 0) {
                    values[i] += styleValues[j] + ';';
                }
            }
        }
        return values;
    }
    findStyleObject(styles) {
        let styleClassObject = {};
        for (let i = 0; i < styles.length; i++) {
            let tempStyle = styles[i];
            let classNameCollection = tempStyle.replace(/([\S ]+\s+){[\s\S]+?}/gi, '$1');
            let stylesCollection = tempStyle.replace(/[\S ]+\s+{([\s\S]+?)}/gi, '$1');
            classNameCollection = classNameCollection.replace(/^[\s]|[\s]$/gm, '');
            stylesCollection = stylesCollection.replace(/^[\s]|[\s]$/gm, '');
            classNameCollection = classNameCollection.replace(/\n|\r|\n\r/g, '');
            stylesCollection = stylesCollection.replace(/\n|\r|\n\r/g, '');
            for (let classNames = classNameCollection.split(', '), j = 0; j < classNames.length; j++) {
                styleClassObject[classNames[j]] = stylesCollection;
            }
        }
        return styleClassObject;
    }
    removingComments(elm) {
        let innerElement = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    }
    cleanUp(node, listNodes) {
        let tempCleaner = [];
        let prevflagState;
        let allNodes = node.querySelectorAll('*');
        for (let index = 0; index < allNodes.length; index++) {
            if (this.ignorableNodes.indexOf(allNodes[index].nodeName) === -1 ||
                (allNodes[index].nodeType === 3 && allNodes[index].textContent.trim() === '')) {
                tempCleaner.push(allNodes[index]);
                continue;
            }
            else if (allNodes[index].className &&
                allNodes[index].className.toLowerCase().indexOf('msolistparagraph') !== -1) {
                listNodes.push(allNodes[index]);
            }
            if (prevflagState && (this.blockNode.indexOf(allNodes[index].nodeName.toLowerCase()) !== -1) &&
                !(allNodes[index].className &&
                    allNodes[index].className.toLowerCase().indexOf('msolistparagraph') !== -1)) {
                listNodes.push(null);
            }
            if (this.blockNode.indexOf(allNodes[index].nodeName.toLowerCase()) !== -1) {
                if (allNodes[index].className &&
                    allNodes[index].className.toLowerCase().indexOf('msolistparagraph') !== -1) {
                    prevflagState = true;
                }
                else {
                    prevflagState = false;
                }
            }
        }
        if (listNodes.length && (listNodes[listNodes.length - 1] !== null)) {
            listNodes.push(null);
        }
        return listNodes;
    }
    listConverter(listNodes) {
        let level;
        let data = [];
        let collection = [];
        let content = '';
        let stNode;
        for (let i = 0; i < listNodes.length; i++) {
            if (listNodes[i] === null) {
                data.push({ content: this.makeConversion(collection), node: listNodes[i - 1] });
                collection = [];
                continue;
            }
            content = listNodes[i].getAttribute('style');
            if (content && content.indexOf('level') !== -1) {
                level = parseInt(content.charAt(content.indexOf('level') + 5), null);
            }
            else {
                level = 1;
            }
            this.listContents = [];
            this.getListContent(listNodes[i]);
            let type;
            if (!isNullOrUndefined(this.listContents[0])) {
                type = this.listContents[0].trim().length > 1 ? 'ol' : 'ul';
                let tempNode = [];
                for (let j = 1; j < this.listContents.length; j++) {
                    tempNode.push(this.listContents[j]);
                }
                collection.push({ listType: type, content: tempNode, nestedLevel: level });
            }
        }
        stNode = listNodes.shift();
        while (stNode) {
            let elemColl = [];
            for (let temp1 = 0; temp1 < data.length; temp1++) {
                if (data[temp1].node === stNode) {
                    for (let index = 0; index < data[temp1].content.childNodes.length; index++) {
                        elemColl.push(data[temp1].content.childNodes[index]);
                    }
                    for (let index = 0; index < elemColl.length; index++) {
                        stNode.parentElement.insertBefore(elemColl[index], stNode);
                    }
                    break;
                }
            }
            stNode.remove();
            stNode = listNodes.shift();
            if (!stNode) {
                stNode = listNodes.shift();
            }
        }
    }
    makeConversion(collection) {
        let root = createElement('div');
        let temp;
        let pLevel = 1;
        let prevList;
        let listCount = 0;
        let elem;
        for (let index = 0; index < collection.length; index++) {
            let pElement = createElement('p');
            pElement.innerHTML = collection[index].content.join(' ');
            if ((collection[index].nestedLevel === 1) && listCount === 0 && collection[index].content) {
                root.appendChild(temp = createElement(collection[index].listType));
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            }
            else if (collection[index].nestedLevel === pLevel) {
                if (prevList.parentElement.tagName.toLowerCase() === collection[index].listType) {
                    prevList.parentElement.appendChild(prevList = createElement('li'));
                    prevList.appendChild(pElement);
                }
                else {
                    temp = createElement(collection[index].listType);
                    prevList.parentElement.parentElement.appendChild(temp);
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                }
            }
            else if (collection[index].nestedLevel > pLevel) {
                for (let j = 0; j < collection[index].nestedLevel - pLevel; j++) {
                    prevList.appendChild(temp = createElement(collection[index].listType));
                    prevList = createElement('li', { styles: 'list-style-type: none;' });
                    temp.appendChild(prevList);
                }
                prevList.appendChild(pElement);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                temp.childNodes[0].style.listStyle =
                    this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            }
            else if (collection[index].nestedLevel === 1) {
                if (root.lastChild.tagName.toLowerCase() === collection[index].listType) {
                    temp = root.lastChild;
                }
                else {
                    root.appendChild(temp = createElement(collection[index].listType));
                }
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            }
            else {
                elem = prevList;
                while (elem.parentElement) {
                    elem = elem.parentElement;
                    if (elem.attributes.getNamedItem('level')) {
                        if (parseInt(elem.attributes.getNamedItem('level').textContent, null) === collection[index].nestedLevel) {
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            elem.appendChild(prevList);
                            break;
                        }
                        else if (collection[index].nestedLevel > parseInt(elem.attributes.getNamedItem('level').textContent, null)) {
                            elem.appendChild(temp = createElement(collection[index].listType));
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            temp.appendChild(prevList);
                            temp.setAttribute('level', collection[index].nestedLevel.toString());
                            temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                            break;
                        }
                    }
                    continue;
                }
            }
            pLevel = collection[index].nestedLevel;
            listCount++;
        }
        return root;
    }
    getListStyle(listType, nestedLevel) {
        nestedLevel = (nestedLevel > 0) ? nestedLevel - 1 : nestedLevel;
        if (listType === 'ol') {
            return (nestedLevel < this.olData.length ? this.olData[nestedLevel] : this.olData[0]);
        }
        else {
            return (nestedLevel < this.ulData.length ? this.ulData[nestedLevel] : this.ulData[0]);
        }
    }
    getListContent(elem) {
        this.listContents.push(elem.firstElementChild.textContent.trim());
        detach(elem.firstElementChild);
        this.listContents.push(elem.innerHTML);
    }
}

/**
 * Insert a Text Node or Text
 * @hidden
 */
class InsertTextExec {
    /**
     * Constructor for creating the InsertText plugin
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.observer.on(INSERT_TEXT_TYPE, this.insertText, this);
    }
    insertText(e) {
        let node = document.createTextNode(e.value);
        InsertHtml.Insert(this.parent.currentDocument, node);
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    }
}

/**
 * EditorManager internal component
 * @hidden
 */
class EditorManager {
    /**
     * Constructor for creating the component
     * @hidden
     */
    constructor(options) {
        this.currentDocument = options.document;
        this.editableElement = options.editableElement;
        this.nodeSelection = new NodeSelection();
        this.domNode = new DOMNode(this.editableElement, this.currentDocument);
        this.observer = new Observer(this);
        this.listObj = new Lists(this);
        this.formatObj = new Formats(this);
        this.alignmentObj = new Alignments(this);
        this.indentsObj = new Indents(this);
        this.linkObj = new LinkCommand(this);
        this.imgObj = new ImageCommand(this);
        this.selectionObj = new SelectionBasedExec(this);
        this.inserthtmlObj = new InsertHtmlExec(this);
        this.insertTextObj = new InsertTextExec(this);
        this.clearObj = new ClearFormatExec(this);
        this.tableObj = new TableCommand(this);
        this.undoRedoManager = new UndoRedoManager(this, options.options);
        this.msWordPaste = new MsWordPaste(this);
        this.wireEvents();
    }
    wireEvents() {
        this.observer.on(KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(KEY_UP, this.editorKeyUp, this);
        this.observer.on(KEY_UP, this.editorKeyUp, this);
        this.observer.on(MODEL_CHANGED, this.onPropertyChanged, this);
        this.observer.on(MS_WORD_CLEANUP, this.onWordPaste, this);
    }
    onWordPaste(e) {
        this.observer.notify(MS_WORD_CLEANUP_PLUGIN, e);
    }
    onPropertyChanged(props) {
        this.observer.notify(MODEL_CHANGED_PLUGIN, props);
    }
    editorKeyDown(e) {
        this.observer.notify(KEY_DOWN_HANDLER, e);
    }
    editorKeyUp(e) {
        this.observer.notify(KEY_UP_HANDLER, e);
    }
    execCommand(command, value, event, callBack, text, exeValue, selector) {
        switch (command.toLocaleLowerCase()) {
            case 'lists':
                this.observer.notify(LIST_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'formats':
                this.observer.notify(FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'alignments':
                this.observer.notify(ALIGNMENT_TYPE, {
                    subCommand: value, event: event, callBack: callBack,
                    selector: selector,
                    value: exeValue
                });
                break;
            case 'indents':
                this.observer.notify(INDENT_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'links':
                this.observer.notify(LINK, { command: command, value: value, item: exeValue, event: event, callBack: callBack });
                break;
            case 'images':
                this.observer.notify(IMAGE, {
                    command: command, value: value, item: exeValue, event: event, callBack: callBack, selector: selector
                });
                break;
            case 'table':
                switch (value.toString().toLocaleLowerCase()) {
                    case 'createtable':
                        this.observer.notify(TABLE, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'insertrowbefore':
                    case 'insertrowafter':
                        this.observer.notify(INSERT_ROW, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'insertcolumnleft':
                    case 'insertcolumnright':
                        this.observer.notify(INSERT_COLUMN, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'deleterow':
                        this.observer.notify(DELETEROW, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'deletecolumn':
                        this.observer.notify(DELETECOLUMN, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'tableremove':
                        this.observer.notify(REMOVETABLE, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'tableheader':
                        this.observer.notify(TABLEHEADER, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'aligntop':
                    case 'alignmiddle':
                    case 'alignbottom':
                        this.observer.notify(TABLE_VERTICAL_ALIGN, { item: exeValue, event: event, callBack: callBack });
                        break;
                }
                break;
            case 'font':
            case 'style':
            case 'effects':
            case 'casing':
                this.observer.notify(SELECTION_TYPE, { subCommand: value, event: event, callBack: callBack, value: text, selector: selector });
                break;
            case 'inserthtml':
                this.observer.notify(INSERTHTML_TYPE, { subCommand: value, callBack: callBack, value: text });
                break;
            case 'inserttext':
                this.observer.notify(INSERT_TEXT_TYPE, { subCommand: value, callBack: callBack, value: text });
                break;
            case 'clear':
                this.observer.notify(CLEAR_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'actions':
                this.observer.notify(ACTION, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
        }
    }
}

/**
 * HTML adapter
 * @hidden
 */
class HTMLFormatter extends Formatter {
    constructor(options) {
        super();
        this.initialize();
        extend(this, this, options, true);
        if (this.currentDocument && this.element) {
            this.updateFormatter(this.element, this.currentDocument, options.options);
        }
    }
    initialize() {
        this.keyConfig = htmlKeyConfig;
    }
    /**
     * Update the formatter of RichTextEditor
     * @param  {Element} editElement
     * @param  {Document} doc
     */
    updateFormatter(editElement, doc, options) {
        if (editElement && doc) {
            this.editorManager = new EditorManager({
                document: doc,
                editableElement: editElement,
                options: options
            });
        }
    }
}

/**
 * Update Toolbar Status
 * @hidden
 */
const statusCollection = {
    bold: false,
    italic: false,
    subscript: false,
    superscript: false,
    strikethrough: false,
    orderedlist: false,
    unorderedlist: false,
    underline: false,
    alignments: null,
    backgroundcolor: null,
    fontcolor: null,
    fontname: null,
    fontsize: null,
    formats: null,
    createlink: false
};
class ToolbarStatus {
    static get(docElement, targetNode, formatNode, fontSize, fontName, documentNode) {
        let formatCollection = JSON.parse(JSON.stringify(statusCollection));
        let nodeCollection = JSON.parse(JSON.stringify(statusCollection));
        let nodeSelection = new NodeSelection();
        let nodes = documentNode ? [documentNode] : nodeSelection.getNodeCollection(nodeSelection.getRange(docElement));
        let nodesLength = nodes.length;
        for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].nodeType !== 3 || (nodesLength > 1 && nodes[index].nodeType === 3 && nodes[index].textContent.trim() === '')) {
                nodes.splice(index, 1);
                index--;
            }
        }
        for (let index = 0; index < nodes.length; index++) {
            formatCollection = this.getFormatParent(docElement, formatCollection, nodes[index], targetNode, formatNode, fontSize, fontName);
            if ((index === 0 && formatCollection.bold) || !formatCollection.bold) {
                nodeCollection.bold = formatCollection.bold;
            }
            if ((index === 0 && formatCollection.italic) || !formatCollection.italic) {
                nodeCollection.italic = formatCollection.italic;
            }
            if ((index === 0 && formatCollection.underline) || !formatCollection.underline) {
                nodeCollection.underline = formatCollection.underline;
            }
            if ((index === 0 && formatCollection.strikethrough) || !formatCollection.strikethrough) {
                nodeCollection.strikethrough = formatCollection.strikethrough;
            }
            if ((index === 0 && formatCollection.superscript) || !formatCollection.superscript) {
                nodeCollection.superscript = formatCollection.superscript;
            }
            if ((index === 0 && formatCollection.subscript) || !formatCollection.subscript) {
                nodeCollection.subscript = formatCollection.subscript;
            }
            if ((index === 0 && formatCollection.fontcolor) || !formatCollection.fontcolor) {
                nodeCollection.fontcolor = formatCollection.fontcolor;
            }
            if ((index === 0 && formatCollection.fontname) || !formatCollection.fontname) {
                nodeCollection.fontname = formatCollection.fontname;
            }
            if ((index === 0 && formatCollection.fontsize) || !formatCollection.fontsize) {
                nodeCollection.fontsize = formatCollection.fontsize;
            }
            if ((index === 0 && formatCollection.backgroundcolor) || !formatCollection.backgroundcolor) {
                nodeCollection.backgroundcolor = formatCollection.backgroundcolor;
            }
            if ((index === 0 && formatCollection.orderedlist) || !formatCollection.orderedlist) {
                nodeCollection.orderedlist = formatCollection.orderedlist;
            }
            if ((index === 0 && formatCollection.unorderedlist) || !formatCollection.unorderedlist) {
                nodeCollection.unorderedlist = formatCollection.unorderedlist;
            }
            if ((index === 0 && formatCollection.alignments) || !formatCollection.alignments) {
                nodeCollection.alignments = formatCollection.alignments;
            }
            if ((index === 0 && formatCollection.formats) || !formatCollection.formats) {
                nodeCollection.formats = formatCollection.formats;
            }
            if ((index === 0 && formatCollection.createlink) || !formatCollection.createlink) {
                nodeCollection.createlink = formatCollection.createlink;
            }
            formatCollection = JSON.parse(JSON.stringify(statusCollection));
        }
        return nodeCollection;
    }
    static getFormatParent(docElement, formatCollection, node, targetNode, formatNode, fontSize, fontName) {
        if (targetNode.contains(node) ||
            (node.nodeType === 3 && targetNode.nodeType !== 3 && targetNode.contains(node.parentNode))) {
            do {
                formatCollection = this.isFormattedNode(docElement, formatCollection, node, formatNode, fontSize, fontName);
                node = node.parentNode;
            } while (node && (node !== targetNode));
        }
        return formatCollection;
    }
    static isFormattedNode(docElement, formatCollection, node, formatNode, fontSize, fontName) {
        if (!formatCollection.bold) {
            formatCollection.bold = IsFormatted.isBold(node);
        }
        if (!formatCollection.italic) {
            formatCollection.italic = IsFormatted.isItalic(node);
        }
        if (!formatCollection.underline) {
            formatCollection.underline = IsFormatted.isUnderline(node);
        }
        if (!formatCollection.strikethrough) {
            formatCollection.strikethrough = IsFormatted.isStrikethrough(node);
        }
        if (!formatCollection.superscript) {
            formatCollection.superscript = IsFormatted.isSuperscript(node);
        }
        if (!formatCollection.subscript) {
            formatCollection.subscript = IsFormatted.isSubscript(node);
        }
        if (!formatCollection.fontcolor) {
            formatCollection.fontcolor = this.isFontColor(docElement, node);
        }
        if (!formatCollection.fontname) {
            formatCollection.fontname = this.isFontName(docElement, node, fontName);
        }
        if (!formatCollection.fontsize) {
            formatCollection.fontsize = this.isFontSize(node, fontSize);
        }
        if (!formatCollection.backgroundcolor) {
            formatCollection.backgroundcolor = this.isBackgroundColor(node);
        }
        if (!formatCollection.orderedlist) {
            formatCollection.orderedlist = this.isOrderedList(node);
        }
        if (!formatCollection.unorderedlist) {
            formatCollection.unorderedlist = this.isUnorderedList(node);
        }
        if (!formatCollection.alignments) {
            formatCollection.alignments = this.isAlignment(node);
        }
        if (!formatCollection.formats) {
            formatCollection.formats = this.isFormats(node, formatNode);
        }
        if (!formatCollection.createlink) {
            formatCollection.createlink = this.isLink(node);
        }
        return formatCollection;
    }
    static isFontColor(docElement, node) {
        let color = node.style && node.style.color;
        if ((color === null || color === undefined || color === '') && node.nodeType !== 3) {
            color = this.getComputedStyle(docElement, node, 'color');
        }
        if (color !== null && color !== '' && color !== undefined) {
            return color;
        }
        else {
            return null;
        }
    }
    static isLink(node) {
        if (node.nodeName.toLocaleLowerCase() === 'a') {
            return true;
        }
        else {
            return false;
        }
    }
    static isBackgroundColor(node) {
        let backColor = node.style && node.style.backgroundColor;
        if (backColor !== null && backColor !== '' && backColor !== undefined) {
            return backColor;
        }
        else {
            return null;
        }
    }
    static isFontSize(node, fontSize) {
        let size = node.style && node.style.fontSize;
        if ((size !== null && size !== '' && size !== undefined)
            && (fontSize === null || fontSize === undefined || (fontSize.indexOf(size) > -1))) {
            return size;
        }
        else {
            return null;
        }
    }
    static isFontName(docElement, node, fontName) {
        let name = node.style && node.style.fontFamily;
        if ((name === null || name === undefined || name === '') && node.nodeType !== 3) {
            name = this.getComputedStyle(docElement, node, 'font-family');
        }
        let index = null;
        if ((name !== null && name !== '' && name !== undefined)
            && (fontName === null || fontName === undefined || (fontName.filter((value, pos) => {
                let pattern = new RegExp(name, 'i');
                if ((value.replace(/"/g, '').replace(/ /g, '') === name.replace(/"/g, '').replace(/ /g, '')) ||
                    (value.search(pattern) > -1)) {
                    index = pos;
                }
            }) && (index !== null)))) {
            return (index !== null) ? fontName[index] : name.replace(/"/g, '');
        }
        else {
            return null;
        }
    }
    static isOrderedList(node) {
        if (node.nodeName.toLocaleLowerCase() === 'ol') {
            return true;
        }
        else {
            return false;
        }
    }
    static isUnorderedList(node) {
        if (node.nodeName.toLocaleLowerCase() === 'ul') {
            return true;
        }
        else {
            return false;
        }
    }
    static isAlignment(node) {
        let align = node.style && node.style.textAlign;
        if (align === 'left') {
            return 'justifyleft';
        }
        else if (align === 'center') {
            return 'justifycenter';
        }
        else if (align === 'right') {
            return 'justifyright';
        }
        else if (align === 'justify') {
            return 'justifyfull';
        }
        else {
            return null;
        }
    }
    static isFormats(node, formatNode) {
        if (((formatNode === undefined || formatNode === null)
            && BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) > -1)
            || (formatNode !== null && formatNode !== undefined
                && formatNode.indexOf(node.nodeName.toLocaleLowerCase()) > -1)) {
            return node.nodeName.toLocaleLowerCase();
        }
        else {
            return null;
        }
    }
    static getComputedStyle(docElement, node, prop) {
        return docElement.defaultView.getComputedStyle(node, null).getPropertyValue(prop);
    }
}

/**
 * HtmlToolbarStatus module for refresh the toolbar status
 */
class HtmlToolbarStatus {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(destroy, this.removeEventListener, this);
    }
    removeEventListener() {
        this.parent.off(toolbarRefresh, this.onRefreshHandler);
    }
    onRefreshHandler(args) {
        let fontsize = [];
        let fontName = [];
        let formats = [];
        this.parent.fontSize.items.forEach((item) => { fontsize.push(item.value); });
        this.parent.fontFamily.items.forEach((item) => { fontName.push(item.value); });
        this.parent.format.types.forEach((item) => {
            formats.push(item.value.toLocaleLowerCase());
        });
        this.toolbarStatus = ToolbarStatus.get(this.parent.contentModule.getDocument(), this.parent.contentModule.getEditPanel(), formats, fontsize, fontName, args.documentNode);
        this.parent.notify(toolbarUpdated, this.toolbarStatus);
    }
}

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 */
class ContentRender {
    /**
     * Constructor for content renderer module
     */
    constructor(parent, serviceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
    }
    /**
     * The function is used to render RichTextEditor content div
     */
    renderPanel() {
        let rteObj = this.parent;
        let div = this.parent.createElement('div', { className: 'e-rte-content', id: this.parent.getID() + 'rte-view' });
        let rteContent = getEditValue(rteObj.value, rteObj);
        this.editableElement = this.parent.createElement('div', {
            className: 'e-content',
            id: this.parent.getID() + '_rte-edit-view',
            attrs: {
                'contenteditable': 'true'
            },
            innerHTML: rteContent
        });
        div.appendChild(this.editableElement);
        this.setPanel(div);
        rteObj.element.appendChild(div);
    }
    /**
     * Get the content div element of RichTextEditor
     * @return {Element}
     */
    getPanel() {
        return this.contentPanel;
    }
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     */
    getEditPanel() {
        return this.editableElement;
    }
    /**
     * Returns the text content as string.
     * @return {string}
     */
    getText() {
        return this.getEditPanel().textContent;
    }
    /**
     * Set the content div element of RichTextEditor
     * @param {Element} panel
     */
    setPanel(panel) {
        this.contentPanel = panel;
    }
    /**
     * Get the document of RichTextEditor
     * @return {Document}
     */
    getDocument() {
        return this.getEditPanel().ownerDocument;
    }
}

/* tslint:disable */
const IFRAMEHEADER = `
<!DOCTYPE html> 
    <html>
         <head>
            <meta charset='utf-8' /> 
            <style>
                @charset "UTF-8";
                body {
                    font-family: "Roboto", sans-serif;
                    font-size: 14px;
                }
                html, body{height: 100%;margin: 0;}
                body.e-cursor{cursor:default}
                span.e-selected-node	{background-color: #939393;color: white;}
                span.e-selected-node.e-highlight {background-color: #1d9dd8;}
                body{color:#333;word-wrap:break-word;padding: 8px;box-sizing: border-box;}
                .e-rte-image {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}
                .e-img-caption { display: inline-block; float: none; margin: 5px auto; max-width: 100%;position: relative;}
                .e-img-caption.e-caption-inline {display: inline-block;float: none;margin: 5px auto;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));position: relativetext-align: center;vertical-align: bottom;}
                .e-img-inner {box-sizing: border-box;display: block;font-size: 16px;font-weight: initial;margin: auto;opacity: .9;text-align: center;width: 100%;}
                .e-img-wrap {display: inline-block;margin: auto;padding: 0;text-align: center;width: 100%;}
                .e-imgleft {float: left;margin: 0 5px 0 0;text-align: left;}
                .e-imgright {float: right;margin: 0 0 0 5px;text-align: right;}
                .e-imgcenter {cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}
                .e-control img:not(.e-resize) {border: 2px solid transparent; z-index: 1000}
                .e-imginline {display: inline-block;float: none;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));vertical-align: bottom;}
                .e-imgbreak {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}
                .e-rte-image.e-img-focus:not(.e-resize) {border: solid 2px #4a90e2;}
                img::selection { background: transparent;color: transparent;}
                span.e-rte-imageboxmark {  width: 10px; height: 10px; position: absolute; display: block; background: #4a90e2; border: 1px solid #fff; z-index: 1000;}
                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }
                .e-mob-rte span.e-rte-imageboxmark { background: #fff; border: 1px solid #4a90e2; border-radius: 15px; height: 20px; width: 20px; }
                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }
                .e-rte-content .e-content img.e-resize { z-index: 1000; }
                .e-img-caption .e-img-inner { outline: 0; }
                .e-img-caption .e-rte-image.e-imgright, .e-img-caption .e-rte-image.e-imgleft { float: none; margin: 0;}
                body{box-sizing: border-box;min-height: 100px;outline: 0 solid transparent;overflow-x: auto;padding: 16px;position: relative;text-align: inherit;z-index: 2;}
                p{margin: 0 0 10px;margin-bottom: 10px;}
                li{margin-bottom: 10px;}
                h1{font-size: 2.17em;font-weight: 400;line-height: 1;margin: 10px 0;}
                h2{font-size: 1.74em;font-weight: 400;margin: 10px 0;}
                h3{font-size: 1.31em;font-weight: 400;margin: 10px 0;}
                h4{font-size: 1em;font-weight: 400;margin: 0;}
                h5{font-size: 00.8em;font-weight: 400;margin: 0;}
                h6{font-size: 00.65em;font-weight: 400;margin: 0;}
                blockquote{margin: 10px 0;margin-left: 0;padding-left: 5px;border-left: solid 2px #5c5c5c;}
                pre{background-color: inherit;border: 0;border-radius: 0;color: #333;font-size: inherit;line-height: inherit;margin: 0 0 10px;overflow: visible;padding: 0;white-space: pre-wrap;word-break: inherit;word-wrap: break-word;}
                strong, b{font-weight: 700;}
                a{text-decoration: none;user-select: auto;}
                a:hover{text-decoration: underline;};
                p:last-child, pre:last-child, blockquote:last-child{margin-bottom: 0;}
                h3+h4, h4+h5, h5+h6{margin-top: 00.6em;}
                ul:last-child{margin-bottom: 0;}
                table { border-collapse: collapse; empty-cells: show;}
                table td,table th {border: 1px solid #BDBDBD; height: 20px; vertical-align: middle;}
                table.e-alternate-border tbody tr:nth-child(2n) {background-color: #F5F5F5;}
                table th {background-color: #E0E0E0;}
                table.e-dashed-border td,table.e-dashed-border th { border: 1px dashed #BDBDBD} 
                table .e-cell-select {border: 1px double #4a90e2;}
                span.e-table-box { cursor: nwse-resize; display: block; height: 10px; position: absolute; width: 10px; }
                span.e-table-box.e-rmob {height: 14px;width: 14px;}
                .e-row-resize, .e-column-resize { background-color: transparent; background-repeat: repeat; bottom: 0;cursor: col-resize;height: 1px;overflow: visible;position: absolute;width: 1px; }
                .e-row-resize { cursor: row-resize; height: 1px;}
                .e-table-rhelper { cursor: col-resize; opacity: .87;position: absolute;}
                .e-table-rhelper.e-column-helper { width: 1px; }
                .e-table-rhelper.e-row-helper {height: 1px;}
                .e-reicon::before { border-bottom: 6px solid transparent; border-right: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; position: absolute; right: 4px; top: 4px; width: 20px; }
                .e-reicon::after { border-bottom: 6px solid transparent; border-left: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; left: 4px; position: absolute; top: 4px; width: 20px; z-index: 3; }
                .e-row-helper.e-reicon::after { top: 10px; transform: rotate(90deg); }
                .e-row-helper.e-reicon::before { left: 4px; top: -20px; transform: rotate(90deg); }
                span.e-table-box { background-color: #ffffff; border: 1px solid #BDBDBD; }
                span.e-table-box.e-rbox-select { background-color: #BDBDBD; border: 1px solid #BDBDBD; }
                .e-table-rhelper { background-color: #4a90e2;}
            </style>
        </head>`;
/* tslint:enable */
/**
 * Content module is used to render RichTextEditor content
 * @hidden
 */
class IframeContentRender extends ContentRender {
    /**
     * The function is used to render RichTextEditor iframe
     */
    renderPanel() {
        let rteObj = this.parent;
        let rteContent = getEditValue(rteObj.value, rteObj);
        let iFrameBodyContent = '<body spellcheck="false" autocorrect="off" contenteditable="true">' +
            rteContent + '</body></html>';
        let iFrameContent = IFRAMEHEADER + iFrameBodyContent;
        let iframe = this.parent.createElement('iframe', {
            innerHTML: iFrameContent,
            id: this.parent.getID() + '_rte-view',
            className: 'e-rte-content',
            styles: 'display:block;'
        });
        this.setPanel(iframe);
        rteObj.element.appendChild(iframe);
        iframe.contentDocument.body.id = this.parent.getID() + '_rte-edit-view';
        iframe.contentDocument.body.setAttribute('aria-owns', this.parent.getID());
        iframe.contentDocument.open();
        iFrameContent = this.setThemeColor(iFrameContent, { color: '#333' });
        iframe.contentDocument.write(iFrameContent);
        iframe.contentDocument.close();
    }
    setThemeColor(content, styles) {
        let fontColor = getComputedStyle(this.parent.element, '.e-richtexteditor').getPropertyValue('color');
        return content.replace(styles.color, fontColor);
    }
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     */
    getEditPanel() {
        let editNode;
        if (!isNullOrUndefined(this.contentPanel.contentDocument)) {
            editNode = this.contentPanel.contentDocument.body;
        }
        else {
            editNode = this.parent.inputElement;
        }
        return editNode;
    }
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     */
    getDocument() {
        return this.getEditPanel().ownerDocument;
    }
}

/**
 * SanitizeHtmlHelper for sanitize the value.
 */
const removeTags = [
    'script',
    'iframe[src]',
    'link[href*="javascript:"]',
    'object[type="text/x-scriptlet"]',
    'object[data^="data:text/html;base64"]',
    'img[src^="data:text/html;base64"]',
    '[src^="javascript:"]',
    '[dynsrc^="javascript:"]',
    '[lowsrc^="javascript:"]',
    '[type^="application/x-shockwave-flash"]'
];
const removeAttrs = [
    { attribute: 'href', selector: '[href*="javascript:"]' },
    { attribute: 'background', selector: '[background^="javascript:"]' },
    { attribute: 'style', selector: '[style*="javascript:"]' },
    { attribute: 'style', selector: '[style*="expression("]' },
    { attribute: 'href', selector: 'a[href^="data:text/html;base64"]' }
];
const jsEvents = ['onchange',
    'onclick',
    'onmouseover',
    'onmouseout',
    'onkeydown',
    'onload',
    'onerror',
    'onblur',
    'onfocus',
    'onbeforeload',
    'onbeforeunload',
    'onkeyup',
    'onsubmit',
    'onafterprint',
    'onbeforeonload',
    'onbeforeprint',
    'onblur',
    'oncanplay',
    'oncanplaythrough',
    'onchange',
    'onclick',
    'oncontextmenu',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'ondurationchange',
    'onemptied',
    'onended',
    'onerror',
    'onerror',
    'onfocus',
    'onformchange',
    'onforminput',
    'onhaschange',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onload',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onmessage',
    'onmousedown',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onmousewheel',
    'onoffline',
    'onoine',
    'ononline',
    'onpagehide',
    'onpageshow',
    'onpause',
    'onplay',
    'onplaying',
    'onpopstate',
    'onprogress',
    'onratechange',
    'onreadystatechange',
    'onredo',
    'onresize',
    'onscroll',
    'onseeked',
    'onseeking',
    'onselect',
    'onstalled',
    'onstorage',
    'onsubmit',
    'onsuspend',
    'ontimeupdate',
    'onundo',
    'onunload',
    'onvolumechange',
    'onwaiting',
    'onmouseenter',
    'onmouseleave',
    'onmousewheel',
    'onstart',
    'onpropertychange'
];
class SanitizeHtmlHelper {
    initialize(value, parent) {
        let item = {
            selectors: {
                tags: removeTags,
                attributes: removeAttrs
            },
            helper: null
        };
        parent.trigger('beforeSanitizeHtml', item);
        if (item.helper) {
            value = item.helper(value);
        }
        if (!item.cancel) {
            value = this.serializeValue(item, value);
        }
        return value;
    }
    serializeValue(item, value) {
        this.removeAttrs = item.selectors.attributes;
        this.removeTags = item.selectors.tags;
        this.wrapElement = document.createElement('div');
        this.wrapElement.innerHTML = value;
        this.removeXssTags();
        this.removeJsEvents();
        this.removeXssAttrs();
        return this.wrapElement.innerHTML;
    }
    removeXssTags() {
        let elements = this.wrapElement.querySelectorAll(this.removeTags.join(','));
        if (elements.length > 0) {
            elements.forEach((element) => {
                detach(element);
            });
        }
    }
    removeJsEvents() {
        let elements = this.wrapElement.querySelectorAll('[' + jsEvents.join('],[') + ']');
        if (elements.length > 0) {
            elements.forEach((element) => {
                jsEvents.forEach((attr) => {
                    if (element.hasAttribute(attr)) {
                        element.removeAttribute(attr);
                    }
                });
            });
        }
    }
    removeXssAttrs() {
        this.removeAttrs.forEach((item, index) => {
            let elements = this.wrapElement.querySelectorAll(item.selector);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.removeAttribute(item.attribute);
                });
            }
        });
    }
}

/**
 * `HtmlEditor` module is used to HTML editor
 */
class HtmlEditor {
    constructor(parent, serviceLocator) {
        this.rangeCollection = [];
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.sanitize = new SanitizeHtmlHelper();
        this.addEventListener();
    }
    /**
     * Destroys the Markdown.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    sanitizeHelper(value) {
        value = this.sanitize.initialize(value, this.parent);
        return value;
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.nodeSelectionObj = new NodeSelection();
        this.colorPickerModule = new ColorPickerInput(this.parent, this.locator);
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(htmlToolbarClick, this.onToolbarClick, this);
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.on(renderColorPicker, this.renderColorPicker, this);
        this.parent.on(initialEnd, this.render, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(selectAll$1, this.selectAll, this);
        this.parent.on(selectRange, this.selectRange, this);
        this.parent.on(getSelectedHtml, this.getSelectedHtml, this);
        this.parent.on(selectionSave, this.onSelectionSave, this);
        this.parent.on(selectionRestore, this.onSelectionRestore, this);
        this.parent.on(readOnlyMode, this.updateReadOnly, this);
        this.parent.on(paste, this.onPaste, this);
    }
    updateReadOnly() {
        if (this.parent.readonly) {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'false' });
            addClass([this.parent.element], CLS_RTE_READONLY);
        }
        else {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'true' });
            removeClass([this.parent.element], CLS_RTE_READONLY);
        }
    }
    onSelectionSave() {
        let currentDocument = this.contentRenderer.getDocument();
        let range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    }
    onSelectionRestore(e) {
        this.parent.isBlur = false;
        this.contentRenderer.getEditPanel().focus();
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    }
    onKeyDown(e) {
        if (e.args.keyCode === 9 && this.parent.enableTabKey) {
            let range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
            let parentNode = this.nodeSelectionObj.getParentNodeCollection(range);
            if (!((parentNode[0].nodeName === 'LI' || closest(parentNode[0], 'li') ||
                closest(parentNode[0], 'table')) && range.startOffset === 0)) {
                e.args.preventDefault();
                if (!e.args.shiftKey) {
                    InsertHtml.Insert(this.contentRenderer.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.rangeCollection.push(this.nodeSelectionObj.getRange(this.contentRenderer.getDocument()));
                }
                else if (this.rangeCollection.length > 0 &&
                    this.rangeCollection[this.rangeCollection.length - 1].startContainer.textContent.length === 4) {
                    let textCont = this.rangeCollection[this.rangeCollection.length - 1].startContainer;
                    this.nodeSelectionObj.setSelectionText(this.contentRenderer.getDocument(), textCont, textCont, 0, textCont.textContent.length);
                    InsertHtml.Insert(this.contentRenderer.getDocument(), document.createTextNode(''));
                    this.rangeCollection.pop();
                }
            }
        }
        if (e.args.action === 'space' ||
            e.args.action === 'enter') {
            this.spaceLink(e.args);
        }
    }
    onPaste(e) {
        let regex = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (e.text.match(regex)) {
            e.args.preventDefault();
            let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            let saveSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            let httpRegex = new RegExp(/([^\S]|^)(((https?\:\/\/)))/gi);
            let wwwRegex = new RegExp(/([^\S]|^)(((www\.))(\S+))/gi);
            let enterSplitText = e.text.split('\n');
            let contentInnerElem = '';
            for (let i = 0; i < enterSplitText.length; i++) {
                if (enterSplitText[i].trim() === '') {
                    contentInnerElem += '<p><br></p>';
                }
                else {
                    let contentWithSpace = '';
                    let spaceBetweenContent = true;
                    let spaceSplit = enterSplitText[i].split(' ');
                    for (let j = 0; j < spaceSplit.length; j++) {
                        if (spaceSplit[j].trim() === '') {
                            contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
                        }
                        else {
                            spaceBetweenContent = false;
                            contentWithSpace += spaceSplit[j] + ' ';
                        }
                    }
                    contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
                }
            }
            let divElement = this.parent.createElement('div');
            divElement.innerHTML = contentInnerElem;
            let paraElem = divElement.querySelectorAll('p');
            for (let i = 0; i < paraElem.length; i++) {
                let splitTextContent = paraElem[i].innerHTML.split(' ');
                let resultSplitContent = '';
                for (let j = 0; j < splitTextContent.length; j++) {
                    if (splitTextContent[j].match(httpRegex) || splitTextContent[j].match(wwwRegex)) {
                        resultSplitContent += '<a className="e-rte-anchor" href="' + splitTextContent[j] +
                            '" title="' + splitTextContent[j] + '">' + splitTextContent[j] + ' </a>';
                    }
                    else {
                        resultSplitContent += splitTextContent[j] + ' ';
                    }
                }
                paraElem[i].innerHTML = resultSplitContent.trim();
            }
            if (!isNullOrUndefined(this.parent.pasteCleanupModule)) {
                e.callBack(divElement.innerHTML);
            }
            else {
                this.parent.executeCommand('insertHTML', divElement);
            }
        }
    }
    spaceLink(e) {
        let range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
        let selectNodeEle = this.nodeSelectionObj.getParentNodeCollection(range);
        let text = range.startContainer.textContent.substr(0, range.endOffset);
        let splitText = text.split(' ');
        let urlText = splitText[splitText.length - 1];
        let urlTextRange = range.startOffset - (text.length - splitText[splitText.length - 1].length);
        urlText = urlText.slice(0, urlTextRange);
        let regex = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
            let selection = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
            let url = urlText.indexOf('http') > -1 ? urlText : 'http://' + urlText;
            let selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            let value = {
                url: url,
                selection: selection, selectParent: selectParent,
                text: urlText,
                title: '',
                target: '_blank'
            };
            this.parent.formatter.process(this.parent, {
                item: {
                    'command': 'Links',
                    'subCommand': 'CreateLink'
                }
            }, e, value);
        }
    }
    onToolbarClick(args) {
        let save;
        let selectNodeEle;
        let selectParentEle;
        let item = args.item;
        let closestElement = closest(args.originalEvent.target, '.e-rte-quick-popup');
        if (closestElement && !closestElement.classList.contains('e-rte-inline-popup')) {
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                if (isIDevice$1() && item.command === 'Images') {
                    this.nodeSelectionObj.restore();
                }
                let range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
                save = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            if (item.command === 'Images') {
                this.parent.notify(imageToolbarAction, {
                    member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Links') {
                this.parent.notify(linkToolbarAction, {
                    member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Table') {
                this.parent.notify(tableToolbarAction, {
                    member: 'table', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
        }
        else {
            let linkDialog = this.parent.element.querySelector('#' + this.parent.getID() + '_rtelink');
            let imageDialog = this.parent.element.querySelector('#' + this.parent.getID() + '_image');
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                let range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
                if (isNullOrUndefined(linkDialog) && isNullOrUndefined(imageDialog)) {
                    save = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
                }
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            switch (item.subCommand) {
                case 'Maximize':
                    this.parent.notify(enableFullScreen, { args: args });
                    break;
                case 'Minimize':
                    this.parent.notify(disableFullScreen, { args: args });
                    break;
                case 'CreateLink':
                    this.parent.notify(insertLink, {
                        member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'Print':
                    this.parent.print();
                    break;
                case 'Image':
                    this.parent.notify(insertImage, {
                        member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'CreateTable':
                    this.parent.notify(createTable, {
                        member: 'table', args: args, selection: save
                    });
                    break;
                case 'SourceCode':
                    this.parent.notify(sourceCode, { member: 'viewSource', args: args });
                    break;
                case 'Preview':
                    this.parent.notify(updateSource, { member: 'updateSource', args: args });
                    break;
                case 'FontColor':
                case 'BackgroundColor':
                    break;
                default:
                    this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                    break;
            }
        }
    }
    renderColorPicker(args) {
        this.colorPickerModule.renderColorPickerInput(args);
    }
    instantiateRenderer() {
        if (this.parent.iframeSettings.enable) {
            this.renderFactory.addRenderer(RenderType.Content, new IframeContentRender(this.parent, this.locator));
        }
        else {
            this.renderFactory.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialEnd, this.render);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(htmlToolbarClick, this.onToolbarClick);
        this.parent.off(renderColorPicker, this.renderColorPicker);
        this.parent.off(destroy, this.destroy);
        this.parent.off(keyDown, this.onKeyDown);
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(selectAll$1, this.selectAll);
        this.parent.off(selectRange, this.selectRange);
        this.parent.off(getSelectedHtml, this.getSelectedHtml);
        this.parent.off(selectionSave, this.onSelectionSave);
        this.parent.off(selectionRestore, this.onSelectionRestore);
        this.parent.off(readOnlyMode, this.updateReadOnly);
        this.parent.off(paste, this.onPaste);
    }
    render() {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        let editElement = this.contentRenderer.getEditPanel();
        let option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.formatter)) {
            let formatterClass = new HTMLFormatter({
                currentDocument: this.contentRenderer.getDocument(),
                element: editElement,
                options: option
            });
            this.parent.setProperties({ formatter: formatterClass }, true);
        }
        else {
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
        this.parent.notify(bindOnEnd, {});
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(e) {
        // On property code change here
        if (!isNullOrUndefined(e.newProp.formatter)) {
            let editElement = this.contentRenderer.getEditPanel();
            let option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'htmlEditor';
    }
    /**
     * For selecting all content in RTE
     * @private
     */
    selectAll() {
        let nodes = getTextNodesUnder(this.parent.contentModule.getDocument(), this.parent.contentModule.getEditPanel());
        this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.parent.contentModule.getDocument(), nodes[0], nodes[nodes.length - 1], 0, nodes[nodes.length - 1].textContent.length);
    }
    /**
     * For selecting all content in RTE
     * @private
     */
    selectRange(e) {
        this.parent.formatter.editorManager.nodeSelection.setRange(this.parent.contentModule.getDocument(), e.range);
    }
    /**
     * For get a selected text in RTE
     * @private
     */
    getSelectedHtml(e) {
        e.callBack(this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument()).toString());
    }
}

/**
 * PasteCleanup module called when pasting content in RichTextEditor
 */
class PasteCleanup {
    constructor(parent, serviceLocator) {
        this.inlineNode = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'button',
            'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input',
            'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
            'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
            'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.i10n = serviceLocator.getService('rteLocale');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
        this.addEventListener();
    }
    addEventListener() {
        this.nodeSelectionObj = new NodeSelection();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(pasteClean, this.pasteClean, this);
        this.parent.on(destroy, this.destroy, this);
    }
    destroy() {
        this.removeEventListener();
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(pasteClean, this.pasteClean);
        this.parent.off(destroy, this.destroy);
    }
    pasteClean(e) {
        let args = {
            requestType: 'Paste',
            editorMode: this.parent.editorMode,
            event: e
        };
        let value = null;
        let imageproperties;
        if (e.args && !isNullOrUndefined(e.args.clipboardData)) {
            value = e.args.clipboardData.getData('text/html');
        }
        if (e.args && value !== null && this.parent.editorMode === 'HTML') {
            if (value.length === 0) {
                value = e.args.clipboardData.getData('text/plain');
                let file = e && e.args.clipboardData &&
                    e.args.clipboardData.items.length > 0 ?
                    e.args.clipboardData.items[0].getAsFile() : null;
                this.parent.notify(paste, {
                    file: file,
                    args: e.args,
                    text: value,
                    callBack: (b) => {
                        imageproperties = b;
                        if (typeof (imageproperties) === 'object') {
                            this.parent.formatter.editorManager.execCommand('Images', 'Image', e.args, this.imageFormatting.bind(args), 'pasteCleanup', imageproperties, 'pasteCleanupModule');
                        }
                        else {
                            value = imageproperties;
                        }
                    }
                });
                let htmlRegex = new RegExp(/<\/[a-z][\s\S]*>/i);
                if (!htmlRegex.test(value)) {
                    let enterSplitText = value.split('\n');
                    let contentInnerElem = '';
                    for (let i = 0; i < enterSplitText.length; i++) {
                        if (enterSplitText[i].trim() === '') {
                            contentInnerElem += '<p><br></p>';
                        }
                        else {
                            let contentWithSpace = '';
                            let spaceBetweenContent = true;
                            let spaceSplit = enterSplitText[i].split(' ');
                            for (let j = 0; j < spaceSplit.length; j++) {
                                if (spaceSplit[j].trim() === '') {
                                    contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
                                }
                                else {
                                    spaceBetweenContent = false;
                                    contentWithSpace += spaceSplit[j] + ' ';
                                }
                            }
                            contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
                        }
                    }
                    let divElement = this.parent.createElement('div');
                    divElement.innerHTML = contentInnerElem;
                    value = divElement.innerHTML;
                }
            }
            else if (value.length > 0) {
                this.parent.formatter.editorManager.observer.notify(MS_WORD_CLEANUP, {
                    args: e.args,
                    text: e.text,
                    allowedStylePropertiesArray: this.parent.pasteCleanupSettings.allowedStyleProps,
                    callBack: (a) => {
                        value = a;
                    }
                });
            }
            this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
            let currentDocument = this.contentRenderer.getDocument();
            let range = this.nodeSelectionObj.getRange(currentDocument);
            this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
            if (this.parent.pasteCleanupSettings.prompt) {
                e.args.preventDefault();
                this.pasteDialog(value, args);
            }
            else if (this.parent.pasteCleanupSettings.plainText) {
                e.args.preventDefault();
                this.plainFormatting(value, args);
            }
            else if (this.parent.pasteCleanupSettings.keepFormat) {
                e.args.preventDefault();
                this.formatting(value, false, args);
            }
            else {
                e.args.preventDefault();
                this.formatting(value, true, args);
            }
        }
    }
    /**
     * Method for image formatting when pasting
     * @hidden
     */
    imageFormatting(args) {
        let imageElement = this.parent.createElement('span');
        imageElement.appendChild(args.elements[0]);
        let imageValue = imageElement.innerHTML;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        let currentDocument = this.contentRenderer.getDocument();
        let range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        if (this.parent.pasteCleanupSettings.prompt) {
            this.pasteDialog(imageValue, args);
        }
        else if (this.parent.pasteCleanupSettings.plainText) {
            this.plainFormatting(imageValue, args);
        }
        else if (this.parent.pasteCleanupSettings.keepFormat) {
            this.formatting(imageValue, false, args);
        }
        else {
            this.formatting(imageValue, true, args);
        }
    }
    radioRender() {
        let keepRadioButton = new RadioButton({ label: 'Keep', name: 'pasteOption', checked: true });
        keepRadioButton.isStringTemplate = true;
        let keepFormatElement = this.parent.element.querySelector('#keepFormating');
        keepRadioButton.appendTo(keepFormatElement);
        let cleanRadioButton = new RadioButton({ label: 'Clean', name: 'pasteOption' });
        cleanRadioButton.isStringTemplate = true;
        let cleanFormatElement = this.parent.element.querySelector('#cleanFormat');
        cleanRadioButton.appendTo(cleanFormatElement);
        let plainTextRadioButton = new RadioButton({ label: 'Plain Text', name: 'pasteOption' });
        plainTextRadioButton.isStringTemplate = true;
        let plainTextElement = this.parent.element.querySelector('#plainTextFormat');
        plainTextRadioButton.appendTo(plainTextElement);
    }
    selectFormatting(value, args) {
        let keepFormatElement = this.parent.element.querySelector('#keepFormating');
        let cleanFormatElement = this.parent.element.querySelector('#cleanFormat');
        if (keepFormatElement.checked) {
            this.formatting(value, false, args);
        }
        else if (cleanFormatElement.checked) {
            this.formatting(value, true, args);
        }
        else {
            this.plainFormatting(value, args);
        }
    }
    pasteDialog(value, args) {
        let dialogModel = {
            buttons: [
                {
                    click: () => {
                        if (!dialog.isDestroyed) {
                            this.selectFormatting(value, args);
                            dialog.hide();
                            let argument = isBlazor() ? null : dialog;
                            this.dialogRenderObj.close(argument);
                            dialog.destroy();
                        }
                    },
                    buttonModel: {
                        isPrimary: true,
                        cssClass: 'e-flat ' + CLS_RTE_PASTE_OK,
                        content: this.i10n.getConstant('pasteDialogOk')
                    }
                },
                {
                    click: () => {
                        if (!dialog.isDestroyed) {
                            dialog.hide();
                            let args = isBlazor() ? null : dialog;
                            this.dialogRenderObj.close(args);
                            dialog.destroy();
                        }
                    },
                    buttonModel: {
                        cssClass: 'e-flat ' + CLS_RTE_PASTE_CANCEL,
                        content: this.i10n.getConstant('pasteDialogCancel')
                    }
                }
            ],
            header: this.i10n.getConstant('pasteFormat'),
            content: this.i10n.getConstant('pasteFormatContent') + '<br/><div><div style="padding-top:24px;">' +
                '<input type="radio" class="' + CLS_RTE_PASTE_KEEP_FORMAT + '" id="keepFormating"/>' +
                '</div><div style="padding-top:20px;"><input type="radio" class="' + CLS_RTE_PASTE_REMOVE_FORMAT + '" id="cleanFormat"/></div>' +
                '<div style="padding-top:20px;"><input type="radio" class="' + CLS_RTE_PASTE_PLAIN_FORMAT + '" id="plainTextFormat"/></div></div>',
            target: this.parent.element,
            width: '300px',
            height: '265px',
            cssClass: CLS_RTE_DIALOG_MIN_HEIGHT,
            isModal: true
        };
        let dialog = this.dialogRenderObj.render(dialogModel);
        let rteDialogWrapper = this.parent.element.querySelector('#' + this.parent.getID()
            + '_pasteCleanupDialog');
        if (rteDialogWrapper !== null && rteDialogWrapper.innerHTML !== '') {
            this.destroyDialog(rteDialogWrapper);
        }
        if (rteDialogWrapper === null) {
            rteDialogWrapper = this.parent.createElement('div', {
                id: this.parent.getID() + '_pasteCleanupDialog'
            });
            this.parent.element.appendChild(rteDialogWrapper);
        }
        dialog.appendTo(rteDialogWrapper);
        this.radioRender();
        dialog.show();
    }
    destroyDialog(rteDialogWrapper) {
        let rteDialogContainer = this.parent.element.querySelector('.e-dlg-container');
        detach(rteDialogContainer);
        let rteDialogWrapperChildLength = rteDialogWrapper.children.length;
        for (let i = 0; i < rteDialogWrapperChildLength; i++) {
            detach(rteDialogWrapper.children[0]);
        }
    }
    formatting(value, clean, args) {
        let clipBoardElem = this.parent.createElement('div', { className: 'pasteContent', styles: 'display:inline;' });
        clipBoardElem.innerHTML = value;
        if (this.parent.pasteCleanupSettings.deniedTags !== null) {
            clipBoardElem = this.deniedTags(clipBoardElem);
        }
        if (clean) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        }
        else if (this.parent.pasteCleanupSettings.deniedAttrs !== null) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        }
        if (this.parent.pasteCleanupSettings.allowedStyleProps !== null) {
            clipBoardElem = this.allowedStyle(clipBoardElem);
        }
        this.saveSelection.restore();
        this.parent.executeCommand('insertHTML', clipBoardElem);
        this.parent.notify(toolbarRefresh, {});
        extend(args, { elements: [clipBoardElem] }, true);
        this.parent.formatter.onSuccess(this.parent, args);
    }
    //Plain Formatting
    plainFormatting(value, args) {
        let clipBoardElem = this.parent.createElement('div');
        clipBoardElem.innerHTML = value;
        this.detachInlineElements(clipBoardElem);
        let text = this.getTextContent(clipBoardElem);
        let resultElement = this.parent.createElement('div', { className: 'pasteContent', styles: 'display:inline;' });
        resultElement.innerHTML = text;
        this.saveSelection.restore();
        this.parent.executeCommand('insertHTML', resultElement);
        extend(args, { elements: [resultElement] }, true);
        this.parent.formatter.onSuccess(this.parent, args);
    }
    detachInlineElements(element) {
        while (!isNullOrUndefined(element)) {
            let isInlineElement = false;
            for (let j = 0; j < this.inlineNode.length && !isInlineElement; j++) {
                if (element.tagName.toLocaleLowerCase() === this.inlineNode[j]) {
                    let node = element.nextElementSibling ?
                        element.nextElementSibling : element.parentElement.nextElementSibling;
                    if (!isNullOrUndefined(element.childNodes[0]) && element.childNodes[0].textContent !== '') {
                        element.parentElement.insertBefore(this.getTextNode(element), element);
                    }
                    detach(element);
                    element = node;
                    isInlineElement = true;
                }
            }
            if (!isNullOrUndefined(element)) {
                if (isInlineElement) {
                    element = element;
                }
                else if (element.firstElementChild) {
                    element = element.firstElementChild;
                }
                else if (element.nextElementSibling) {
                    element = element.nextElementSibling;
                }
                else if (!isNullOrUndefined(element.parentElement) && element.parentElement.nextElementSibling) {
                    element = element.parentElement.nextElementSibling;
                }
                else {
                    element = null;
                }
            }
            else {
                element = null;
            }
        }
    }
    getTextNode(element) {
        let rootElement = this.parent.createElement('span');
        rootElement.innerHTML = element.textContent;
        return rootElement.childNodes[0];
    }
    insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    getTextContent(element) {
        let result;
        let text;
        result = '';
        let brElement = element.nodeType === 1 ? element.querySelectorAll('br') : null;
        if (brElement) {
            for (let i = 0; i < brElement.length; i++) {
                if (!isNullOrUndefined(brElement[i].previousSibling)) {
                    let resultElement = this.parent.createElement('div');
                    resultElement.innerHTML = brElement[i].previousSibling.textContent;
                    detach(brElement[i].previousSibling);
                    brElement[i].parentElement.insertBefore(resultElement, brElement[i]);
                }
                if (i + 1 === brElement.length && !isNullOrUndefined(brElement[i].nextSibling)) {
                    let divNextElement = this.parent.createElement('div');
                    divNextElement.innerHTML = brElement[i].nextSibling.textContent;
                    detach(brElement[i].nextSibling);
                    this.insertAfter(divNextElement, brElement[i]);
                }
                detach(brElement[i]);
            }
        }
        if (element.children.length === 0 && element.textContent.trim() !== '') {
            text = '<p>' + element.textContent + '</p>';
            result += text;
        }
        else {
            for (let i = 0; i < element.children.length; i++) {
                if (!isNullOrUndefined(element.children[i])) {
                    text = this.getTextContent(element.children[i]);
                }
                else {
                    text = '<p>' + element.children[i].textContent + '</p>';
                }
                result += text;
            }
        }
        return result;
    }
    //GroupingTags
    tagGrouping(deniedTags) {
        let groupingTags = [...deniedTags];
        let keys = Object.keys(pasteCleanupGroupingTags);
        let values = keys.map((key) => { return pasteCleanupGroupingTags[key]; });
        let addTags = [];
        for (let i = 0; i < groupingTags.length; i++) {
            //The value split using '[' because to reterive the tag name from the user given format which may contain tag with attributes
            if (groupingTags[i].split('[').length > 1) {
                groupingTags[i] = groupingTags[i].split('[')[0].trim();
            }
            if (keys.indexOf(groupingTags[i]) > -1) {
                for (let j = 0; j < values[keys.indexOf(groupingTags[i])].length; j++) {
                    if (groupingTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0 &&
                        addTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0) {
                        addTags.push(values[keys.indexOf(groupingTags[i])][j]);
                    }
                }
            }
        }
        return deniedTags = deniedTags.concat(addTags);
    }
    //Filter Attributes in Denied Tags
    attributesfilter(deniedTags) {
        for (let i = 0; i < deniedTags.length; i++) {
            if (deniedTags[i].split('[').length > 1) {
                let userAttributes = deniedTags[i].split('[')[1].split(']')[0].split(',');
                let allowedAttributeArray = [];
                let deniedAttributeArray = [];
                for (let j = 0; j < userAttributes.length; j++) {
                    userAttributes[j].indexOf('!') < 0 ? allowedAttributeArray.push(userAttributes[j].trim())
                        : deniedAttributeArray.push(userAttributes[j].split('!')[1].trim());
                }
                let allowedAttribute = allowedAttributeArray.length > 1 ?
                    (allowedAttributeArray.join('][')) : (allowedAttributeArray.join());
                let deniedAttribute = deniedAttributeArray.length > 1 ? deniedAttributeArray.join('][') : (deniedAttributeArray.join());
                if (deniedAttribute.length > 0) {
                    let select$$1 = allowedAttribute !== '' ? deniedTags[i].split('[')[0] +
                        '[' + allowedAttribute + ']' : deniedTags[i].split('[')[0];
                    deniedTags[i] = select$$1 + ':not([' + deniedAttribute + '])';
                }
                else {
                    deniedTags[i] = deniedTags[i].split('[')[0] + '[' + allowedAttribute + ']';
                }
            }
        }
        return deniedTags;
    }
    //Denied Tags
    deniedTags(clipBoardElem) {
        let deniedTags = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedTags) ? [] :
            [...this.parent.pasteCleanupSettings.deniedTags];
        deniedTags = this.attributesfilter(deniedTags);
        deniedTags = this.tagGrouping(deniedTags);
        for (let i = 0; i < deniedTags.length; i++) {
            let removableElement = clipBoardElem.querySelectorAll(deniedTags[i]);
            for (let j = removableElement.length - 1; j >= 0; j--) {
                let parentElem = removableElement[j].parentNode;
                while (removableElement[j].firstChild) {
                    parentElem.insertBefore(removableElement[j].firstChild, removableElement[j]);
                }
                parentElem.removeChild(removableElement[j]);
            }
        }
        return clipBoardElem;
    }
    //Denied Attributes
    deniedAttributes(clipBoardElem, clean) {
        let deniedAttrs = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedAttrs) ? [] :
            [...this.parent.pasteCleanupSettings.deniedAttrs];
        if (clean) {
            deniedAttrs.push('style');
        }
        for (let i = 0; i < deniedAttrs.length; i++) {
            let removableAttrElement = clipBoardElem.
                querySelectorAll('[' + deniedAttrs[i] + ']');
            for (let j = 0; j < removableAttrElement.length; j++) {
                removableAttrElement[j].removeAttribute(deniedAttrs[i]);
            }
        }
        return clipBoardElem;
    }
    //Allowed Style Properties
    allowedStyle(clipBoardElem) {
        let allowedStyleProps = isNullOrUndefined(this.parent.pasteCleanupSettings.allowedStyleProps) ? [] :
            [...this.parent.pasteCleanupSettings.allowedStyleProps];
        allowedStyleProps.push('list-style-type', 'list-style');
        let styleElement = clipBoardElem.querySelectorAll('[style]');
        for (let i = 0; i < styleElement.length; i++) {
            let allowedStyleValue = '';
            let allowedStyleValueArray = [];
            let styleValue = styleElement[i].getAttribute('style').split(';');
            for (let k = 0; k < styleValue.length; k++) {
                if (allowedStyleProps.indexOf(styleValue[k].split(':')[0].trim()) >= 0) {
                    allowedStyleValueArray.push(styleValue[k]);
                }
            }
            styleElement[i].removeAttribute('style');
            allowedStyleValue = allowedStyleValueArray.join(';').trim() === '' ?
                allowedStyleValueArray.join(';') : allowedStyleValueArray.join(';') + ';';
            if (allowedStyleValue) {
                styleElement[i].setAttribute('style', allowedStyleValue);
            }
        }
        return clipBoardElem;
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'pasteCleanup';
    }
}

/**
 * Action export
 */

/**
 * Formatter
 */

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 */
class Render {
    /**
     * Constructor for render module
     */
    constructor(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.renderer = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    /**
     * To initialize RichTextEditor header, content and footer rendering
     */
    render() {
        let rteObj = this.parent;
        this.contentRenderer = this.renderer.getRenderer(RenderType.Content);
        this.contentRenderer.renderPanel();
    }
    /**
     * Refresh the entire RichTextEditor.
     * @return {void}
     */
    refresh(e = { requestType: 'refresh' }) {
        this.parent.notify(`${e.requestType}-begin`, e);
    }
    /**
     * Destroy the entire RichTextEditor.
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(modelChanged, this.refresh, this);
        this.parent.on(keyUp, this.keyUp, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(modelChanged, this.refresh);
        this.parent.off(keyUp, this.keyUp);
    }
    keyUp(e) {
        if (this.parent.editorMode === 'HTML') {
            switch (e.args.which) {
                case 46:
                case 8:
                    let childNodes = this.parent.contentModule.getEditPanel().childNodes;
                    if ((childNodes.length === 0) ||
                        (childNodes.length === 1 && ((childNodes[0].tagName === 'BR') ||
                            (childNodes[0].tagName === 'P' &&
                                (childNodes[0].childNodes.length === 0 || childNodes[0].textContent === ''))))) {
                        let node = this.parent.contentModule.getEditPanel();
                        node.innerHTML = '<p><br/></p>';
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.contentModule.getDocument(), node.childNodes[0], 0);
                    }
                    break;
            }
        }
    }
}

/**
 * `Link` module is used to handle undo actions.
 */
class Link {
    constructor(parent, serviceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService('rteLocale');
        this.addEventListener();
        this.serviceLocator = serviceLocator;
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(insertLink, this.linkDialog, this);
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.on(insertCompleted, this.showLinkQuickToolbar, this);
        this.parent.on(linkToolbarAction, this.onToolbarAction, this);
        this.parent.on(iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(unLink, this.removeLink, this);
        this.parent.on(editLink, this.editLink, this);
        this.parent.on(openLink, this.openLink, this);
        this.parent.on(editAreaClick, this.editAreaClickHandler, this);
    }
    onToolbarAction(args) {
        let item = args.args.item;
        switch (item.subCommand) {
            case 'OpenLink':
                this.parent.notify(openLink, args);
                break;
            case 'EditLink':
                this.parent.notify(editLink, args);
                break;
            case 'RemoveLink':
                this.parent.notify(unLink, args);
                break;
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(insertLink, this.linkDialog);
        this.parent.off(keyDown, this.onKeyDown);
        this.parent.off(insertCompleted, this.showLinkQuickToolbar);
        this.parent.off(linkToolbarAction, this.onToolbarAction);
        this.parent.off(unLink, this.removeLink);
        this.parent.off(iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(editLink, this.editLink);
        this.parent.off(openLink, this.openLink);
        this.parent.off(editAreaClick, this.editAreaClickHandler);
    }
    onIframeMouseDown() {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
        }
    }
    showLinkQuickToolbar(e) {
        if (e.args.action !== 'enter' && e.args.action !== 'space') {
            let pageX;
            let pageY;
            if (e.type !== 'Links' || isNullOrUndefined(this.parent.quickToolbarModule) ||
                isNullOrUndefined(this.parent.quickToolbarModule.linkQTBar)) {
                return;
            }
            this.quickToolObj = this.parent.quickToolbarModule;
            let parentTop = this.parent.element.getBoundingClientRect().top;
            let parentLeft = this.parent.element.getBoundingClientRect().left;
            let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            let target;
            [].forEach.call(e.elements, (element, index) => {
                if (index === 0) {
                    target = ((element.nodeName === '#text') ? (element.parentNode) : element);
                }
            });
            if (e.isNotify) {
                let tbElement = this.parent.toolbarModule.getToolbarElement();
                let linkTop = target.getBoundingClientRect().top;
                let linkLeft = target.getBoundingClientRect().left;
                let linkPos = linkTop - parentTop;
                let tbHeight = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
                pageX = (this.parent.iframeSettings.enable) ? parentLeft + linkLeft : target.getBoundingClientRect().left;
                pageY = window.pageYOffset + ((this.parent.iframeSettings.enable) ?
                    (parentTop + tbHeight + linkTop) : (parentTop + linkPos));
            }
            else {
                let args;
                args = e.args.touches ? e.args.changedTouches[0] : args = e.args;
                pageX = (this.parent.iframeSettings.enable) ? window.pageXOffset + parentLeft + args.clientX : args.pageX;
                pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset + parentTop + args.clientY : args.pageY;
            }
            if (this.quickToolObj.linkQTBar) {
                this.quickToolObj.linkQTBar.showPopup(pageX, pageY, range.endContainer);
            }
        }
    }
    hideLinkQuickToolbar() {
        if (this.quickToolObj && this.quickToolObj.linkQTBar && document.body.contains(this.quickToolObj.linkQTBar.element)) {
            this.quickToolObj.linkQTBar.hidePopup();
        }
    }
    editAreaClickHandler(e) {
        let args = e.args;
        let showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.linkQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            let target = args.target;
            target = this.getAnchorNode(target);
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            let isPopupOpen = this.quickToolObj.linkQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'A' && !target.contains(target.querySelector('img'))) {
                if (isPopupOpen) {
                    return;
                }
                this.showLinkQuickToolbar({
                    args: args,
                    isNotify: false,
                    type: 'Links',
                    elements: [args.target]
                });
            }
            else {
                this.hideLinkQuickToolbar();
            }
        }
    }
    onKeyDown(event) {
        let originalEvent = event.args;
        switch (originalEvent.action) {
            case 'escape':
                if (!isNullOrUndefined(this.dialogObj)) {
                    this.dialogObj.close();
                }
                break;
            case 'insert-link':
                if (this.parent.editorMode === 'HTML') {
                    let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
                    let save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
                    let selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
                    let selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
                    let eventArgs = {
                        args: event.args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    };
                    this.linkDialog(eventArgs);
                }
                else {
                    let textArea = this.parent.contentModule.getEditPanel();
                    this.parent.formatter.editorManager.markdownSelection.save(textArea.selectionStart, textArea.selectionEnd);
                    this.linkDialog({
                        args: {
                            item: { command: 'Links', subCommand: 'Link' },
                            originalEvent: originalEvent
                        },
                        member: 'link',
                        text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(this.parent.contentModule.getEditPanel()),
                        module: 'Markdown',
                        name: 'insertLink'
                    });
                }
                originalEvent.preventDefault();
                break;
        }
    }
    linkDialog(e, inputDetails) {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
            return;
        }
        if (this.parent.editorMode === 'HTML' && (e.selectParent.length > 0 &&
            !isNullOrUndefined(e.selectParent[0].classList) &&
            e.selectParent[0].classList.contains('e-rte-anchor')) && isNullOrUndefined(inputDetails)) {
            this.editLink(e);
            return;
        }
        let selectText;
        let linkWebAddress = this.i10n.getConstant('linkWebUrl');
        let linkDisplayText = this.i10n.getConstant('linkText');
        let linkTooltip = this.i10n.getConstant('linkTooltipLabel');
        let urlPlace = this.i10n.getConstant('linkurl');
        let textPlace = this.i10n.getConstant('textPlaceholder');
        let title = this.i10n.getConstant('linkTitle');
        let linkDialogEle = this.parent.createElement('div', { className: 'e-rte-link-dialog', id: this.rteID + '_rtelink' });
        this.parent.element.appendChild(linkDialogEle);
        let linkContent = this.parent.createElement('div', {
            className: 'e-rte-linkcontent', id: this.rteID + '_linkContent'
        });
        let htmlTextbox = (this.parent.editorMode === 'HTML') ? '<label>' + linkTooltip +
            '</label></div><div class="e-rte-field">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder = "' + title + '" class="e-input e-rte-linkTitle"></div>' +
            '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
            '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>' : '';
        let content = '<div class="e-rte-label"><label>' + linkWebAddress + '</label></div>' + '<div class="e-rte-field">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder="' + urlPlace + '" class="e-input e-rte-linkurl"/></div>' +
            '<div class="e-rte-label">' + '<label>' + linkDisplayText + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" spellcheck="false" class="e-input e-rte-linkText" placeholder="' + textPlace + '">' +
            '</div><div class="e-rte-label">' + htmlTextbox;
        let contentElem = parseHtml(content);
        linkContent.appendChild(contentElem);
        let linkTarget = linkContent.querySelector('.e-rte-linkTarget');
        let linkUrl = linkContent.querySelector('.e-rte-linkurl');
        let linkText = linkContent.querySelector('.e-rte-linkText');
        let linkTitle = linkContent.querySelector('.e-rte-linkTitle');
        let linkOpenLabel = this.i10n.getConstant('linkOpenInNewWindow');
        this.checkBoxObj = new CheckBox({ label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl });
        this.checkBoxObj.isStringTemplate = true;
        this.checkBoxObj.createElement = this.parent.createElement;
        this.checkBoxObj.appendTo(linkTarget);
        selectText = (this.parent.editorMode === 'HTML') ? e.selection.getRange(this.parent.contentModule.getDocument()).toString() :
            e.text;
        let linkInsert = this.i10n.getConstant('dialogInsert');
        let linkCancel = this.i10n.getConstant('dialogCancel');
        let selection = e.selection;
        let selectObj = { selfLink: this, selection: e.selection, selectParent: e.selectParent, args: e.args };
        let dialogModel = {
            header: this.i10n.getConstant('linkHeader'),
            content: linkContent,
            cssClass: CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '310px', height: 'inherit',
            isModal: Browser.isDevice,
            buttons: [{
                    click: this.insertlink.bind(selectObj),
                    buttonModel: { content: linkInsert, cssClass: 'e-flat e-insertLink', isPrimary: true }
                },
                { click: this.cancelDialog.bind(selectObj), buttonModel: { cssClass: 'e-flat', content: linkCancel } }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event) => {
                this.parent.isBlur = false;
                if (event && event.event.returnValue) {
                    if (this.parent.editorMode === 'HTML') {
                        selection.restore();
                    }
                    else {
                        this.parent.formatter.editorManager.markdownSelection.restore(this.parent.contentModule.getEditPanel());
                    }
                }
                this.dialogObj.destroy();
                detach(this.dialogObj.element);
                let args = isBlazor() ? null : this.dialogObj;
                this.dialogRenderObj.close(args);
                this.dialogObj = null;
            },
        };
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(linkDialogEle);
        linkDialogEle.style.maxHeight = 'inherit';
        if (!isNullOrUndefined(inputDetails)) {
            linkUrl.value = inputDetails.url;
            linkText.value = inputDetails.text;
            linkTitle.value = inputDetails.title;
            (inputDetails.target) ? this.checkBoxObj.checked = true : this.checkBoxObj.checked = false;
            this.dialogObj.header = inputDetails.header;
            this.dialogObj.element.querySelector('.e-insertLink').textContent = inputDetails.btnText;
        }
        this.checkUrl(false);
        if ((this.parent.editorMode === 'HTML' && ((!isNullOrUndefined(selectText) && selectText !== '') &&
            (e.selection.range.startOffset === 0) || e.selection.range.startOffset !== e.selection.range.endOffset))
            || e.module === 'Markdown') {
            linkText.value = selectText;
        }
        EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        if (this.quickToolObj) {
            this.hideLinkQuickToolbar();
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    }
    insertlink(e) {
        let linkEle = this.selfLink.dialogObj.element;
        let linkUrl = linkEle.querySelector('.e-rte-linkurl').value;
        let linkText = linkEle.querySelector('.e-rte-linkText').value;
        let linkTitle;
        if (this.selfLink.parent.editorMode === 'HTML') {
            linkTitle = linkEle.querySelector('.e-rte-linkTitle').value;
        }
        let target = (this.selfLink.checkBoxObj.checked) ? '_blank' : null;
        if (linkUrl === '') {
            this.selfLink.checkUrl(true);
            return;
        }
        if (!this.selfLink.isUrl(linkUrl)) {
            linkText = (linkText === '') ? linkUrl : linkText;
            if (!this.selfLink.parent.enableAutoUrl) {
                linkUrl = linkUrl.indexOf('http') > -1 ? linkUrl : 'http://' + linkUrl;
            }
            else {
                linkUrl = linkUrl;
            }
        }
        else {
            this.selfLink.checkUrl(false);
        }
        let proxy = this.selfLink;
        if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(closest(this.selection.range.startContainer.parentNode, '#' + proxy.parent.contentModule.getPanel().id))) {
            proxy.parent.contentModule.getEditPanel().focus();
            if (Browser.isIE && proxy.parent.iframeSettings.enable) {
                this.selection.restore();
            }
            let range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
            this.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.parent.contentModule.getDocument());
            this.selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        let value = {
            url: linkUrl, text: linkText, title: linkTitle, target: target,
            selection: this.selection, selectParent: this.selectParent
        };
        if (document.body.contains(proxy.dialogObj.element)) {
            this.selfLink.dialogObj.hide({ returnValue: false });
        }
        if (isIDevice$1() && proxy.parent.iframeSettings.enable) {
            select('iframe', proxy.parent.element).contentWindow.focus();
        }
        if (proxy.parent.editorMode === 'HTML') {
            this.selection.restore();
        }
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        this.selfLink.parent.formatter.process(this.selfLink.parent, this.args, this.args.originalEvent, value);
        this.selfLink.parent.contentModule.getEditPanel().focus();
    }
    isUrl(url) {
        let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    }
    checkUrl(e) {
        let linkEle = this.dialogObj.element;
        let linkUrl = linkEle.querySelector('.e-rte-linkurl');
        if (e) {
            addClass([linkUrl], 'e-error');
            linkUrl.setSelectionRange(0, linkUrl.value.length);
            linkUrl.focus();
        }
        else {
            removeClass([linkUrl], 'e-error');
        }
    }
    removeLink(e) {
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.parent.formatter.process(this.parent, e.args, e.args, {
            selectNode: e.selectNode, selectParent: e.selectParent, selection: e.selection,
            subCommand: e.args.item.subCommand
        });
        if (isIDevice$1() && this.parent.iframeSettings.enable) {
            select('iframe', this.parent.element).contentWindow.focus();
        }
        else {
            this.parent.contentModule.getEditPanel().focus();
        }
        this.hideLinkQuickToolbar();
    }
    openLink(e) {
        let selectParentEle = this.getAnchorNode(e.selectParent[0]);
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            this.parent.formatter.process(this.parent, e.args, e.args, {
                url: selectParentEle.href,
                target: selectParentEle.target === '' ? '_self' : '_blank', selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
        }
    }
    getAnchorNode(element) {
        let selectParent = closest(element, 'a');
        return (selectParent ? selectParent : element);
    }
    editLink(e) {
        let selectParentEle = this.getAnchorNode(e.selectParent[0]);
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            let linkUpdate = this.i10n.getConstant('dialogUpdate');
            let inputDetails = {
                url: selectParentEle.getAttribute('href'), text: selectParentEle.innerText,
                title: selectParentEle.title, target: selectParentEle.target,
                header: this.i10n.getConstant('editLink'), btnText: linkUpdate
            };
            this.linkDialog(e, inputDetails);
        }
    }
    cancelDialog(e) {
        this.selfLink.parent.isBlur = false;
        this.selfLink.dialogObj.hide({ returnValue: true });
        if (isIDevice$1()) {
            this.selection.restore();
        }
        else {
            this.selfLink.parent.contentModule.getEditPanel().focus();
        }
    }
    onDocumentClick(e) {
        let target = e.target;
        if (!isNullOrUndefined(this.dialogObj) && ((!closest(target, '#' + this.dialogObj.element.id) && this.parent.toolbarSettings.enable &&
            this.parent.getToolbarElement() && !this.parent.getToolbarElement().contains(e.target)) ||
            (((this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target)) ||
                this.parent.inlineMode.enable) && !closest(target, '#' + this.parent.getID() + '_toolbar_CreateLink') &&
                !target.querySelector('#' + this.parent.getID() + '_toolbar_CreateLink')))) {
            this.dialogObj.hide({ returnValue: true });
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'link';
    }
}

/**
 * `Image` module is used to handle image actions.
 */
class Image {
    constructor(parent, serviceLocator) {
        this.pageX = null;
        this.pageY = null;
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService('rteLocale');
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
        this.addEventListener();
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.on(insertImage, this.insertImage, this);
        this.parent.on(insertCompleted, this.showImageQuickToolbar, this);
        this.parent.on(imageToolbarAction, this.onToolbarAction, this);
        this.parent.on(imageCaption, this.caption, this);
        this.parent.on(imageDelete, this.deleteImg, this);
        this.parent.on(imageLink, this.insertImgLink, this);
        this.parent.on(imageAlt, this.insertAltText, this);
        this.parent.on(editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(imageSize, this.imageSize, this);
        this.parent.on(dropDownSelect, this.alignmentSelect, this);
        this.parent.on(initialEnd, this.afterRender, this);
        this.parent.on(paste, this.imagePaste, this);
        this.parent.on(destroy, this.removeEventListener, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(keyDown, this.onKeyDown);
        this.parent.off(insertImage, this.insertImage);
        this.parent.off(insertCompleted, this.showImageQuickToolbar);
        this.parent.off(imageCaption, this.caption);
        this.parent.off(imageToolbarAction, this.onToolbarAction);
        this.parent.off(imageDelete, this.deleteImg);
        this.parent.off(imageLink, this.insertImgLink);
        this.parent.off(imageAlt, this.insertAltText);
        this.parent.off(editAreaClick, this.editAreaClickHandler);
        this.parent.off(iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(imageSize, this.imageSize);
        this.parent.off(dropDownSelect, this.alignmentSelect);
        this.parent.off(initialEnd, this.afterRender);
        this.parent.off(paste, this.imagePaste);
        this.parent.off(destroy, this.removeEventListener);
        if (!isNullOrUndefined(this.contentModule)) {
            EventHandler.remove(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick);
            this.parent.formatter.editorManager.observer.off(checkUndo, this.undoStack);
            if (this.parent.insertImageSettings.resize) {
                EventHandler.remove(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.contentModule.getDocument(), 'mousedown', this.onDocumentClick);
            }
        }
    }
    onIframeMouseDown() {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
        }
    }
    afterRender() {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        EventHandler.add(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick, this);
        if (this.parent.insertImageSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.contentModule.getDocument(), 'mousedown', this.onDocumentClick, this);
        }
    }
    undoStack(args) {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (let i = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                let temp = this.parent.createElement('div');
                let contentElem = parseHtml(this.parent.formatter.getUndoRedoStack()[i].text);
                temp.appendChild(contentElem);
                let img = temp.querySelectorAll('img');
                if (temp.querySelector('.e-img-resize') && img.length > 0) {
                    for (let j = 0; j < img.length; j++) {
                        img[j].style.outline = '';
                    }
                    detach(temp.querySelector('.e-img-resize'));
                    this.parent.formatter.getUndoRedoStack()[i].text = temp.innerHTML;
                }
            }
        }
    }
    resizeEnd(e) {
        this.resizeBtnInit();
        this.imgEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) {
            removeClass([e.target.parentElement], 'e-mob-span');
        }
        let args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(resizeStop, args);
        let pageX = this.getPointX(e);
        let pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + e.clientY : e.pageY;
        this.parent.formatter.editorManager.observer.on(checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
    }
    resizeStart(e) {
        if (e.target.tagName === 'IMG') {
            this.parent.preventDefaultResize(e);
            let img = e.target;
            if (this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
                detach(this.imgResizeDiv);
            }
            this.imageResize(img);
        }
        if (e.target.classList.contains('e-rte-imageboxmark')) {
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            e.preventDefault();
            e.stopImmediatePropagation();
            this.resizeBtnInit();
            if (this.quickToolObj) {
                this.quickToolObj.imageQTBar.hidePopup();
            }
            if (e.target.classList.contains('e-rte-topLeft')) {
                this.resizeBtnStat.topLeft = true;
            }
            if (e.target.classList.contains('e-rte-topRight')) {
                this.resizeBtnStat.topRight = true;
            }
            if (e.target.classList.contains('e-rte-botLeft')) {
                this.resizeBtnStat.botLeft = true;
            }
            if (e.target.classList.contains('e-rte-botRight')) {
                this.resizeBtnStat.botRight = true;
            }
            if (Browser.isDevice && this.contentModule.getEditPanel().contains(this.imgResizeDiv) &&
                !this.imgResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.imgResizeDiv], 'e-mob-span');
            }
            else {
                let args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
                this.parent.trigger(resizeStart, args, (resizeStartArgs) => {
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }
    imageClick(e) {
        if (Browser.isDevice) {
            if ((e.target.tagName === 'IMG' &&
                e.target.parentElement.tagName === 'A') ||
                (e.target.tagName === 'IMG')) {
                this.contentModule.getEditPanel().setAttribute('contenteditable', 'false');
                e.target.focus();
            }
            else {
                if (!this.parent.readonly) {
                    this.contentModule.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if (e.target.tagName === 'IMG' &&
            e.target.parentElement.tagName === 'A') {
            e.preventDefault();
        }
    }
    imageResize(e) {
        this.resizeBtnInit();
        this.imgEle = e;
        addClass([this.imgEle], 'e-resize');
        this.imgResizeDiv = this.parent.createElement('span', { className: 'e-img-resize', id: this.rteID + '_imgResize' });
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-topLeft', styles: 'cursor: nwse-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-topRight', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-botLeft', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-botRight', styles: 'cursor: nwse-resize'
        }));
        if (Browser.isDevice) {
            addClass([this.imgResizeDiv], 'e-mob-rte');
        }
        e.style.outline = '2px solid #4a90e2';
        this.imgResizePos(e, this.imgResizeDiv);
        this.resizeImgDupPos(e);
        this.contentModule.getEditPanel().appendChild(this.imgResizeDiv);
        EventHandler.add(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing, this);
    }
    getPointX(e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    }
    getPointY(e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageY;
        }
        else {
            return e.pageY;
        }
    }
    imgResizePos(e, imgResizeDiv) {
        let pos = this.calcPos(e);
        let top = pos.top;
        let left = pos.left;
        let imgWid = e.width;
        let imgHgt = e.height;
        let borWid = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + image outline width
        let devWid = ((Browser.isDevice) ? 0 : 2); // span border width
        imgResizeDiv.querySelector('.e-rte-botLeft').style.left = (left - borWid) + 'px';
        imgResizeDiv.querySelector('.e-rte-botLeft').style.top = ((imgHgt - borWid) + top) + 'px';
        imgResizeDiv.querySelector('.e-rte-botRight').style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        imgResizeDiv.querySelector('.e-rte-botRight').style.top = ((imgHgt - borWid) + top) + 'px';
        imgResizeDiv.querySelector('.e-rte-topRight').style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        imgResizeDiv.querySelector('.e-rte-topRight').style.top = (top - (borWid)) + 'px';
        imgResizeDiv.querySelector('.e-rte-topLeft').style.left = (left - borWid) + 'px';
        imgResizeDiv.querySelector('.e-rte-topLeft').style.top = (top - borWid) + 'px';
    }
    calcPos(elem) {
        let ignoreOffset = ['TD', 'TH', 'TABLE'];
        let parentOffset = { top: 0, left: 0 };
        let offset = elem.getBoundingClientRect();
        let doc = elem.ownerDocument;
        let offsetParent = ((elem.offsetParent && (elem.offsetParent.classList.contains('e-img-caption') ||
            ignoreOffset.indexOf(elem.offsetParent.tagName) > -1)) ?
            closest(elem, '#' + this.parent.getID() + '_rte-edit-view') : elem.offsetParent) || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            offsetParent.style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = offsetParent.getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    }
    setAspectRatio(img, expectedX, expectedY) {
        if (isNullOrUndefined(img.width)) {
            return;
        }
        let width = img.style.width !== '' ? parseInt(img.style.width, 10) : img.width;
        let height = img.style.height !== '' ? parseInt(img.style.height, 10) : img.height;
        if (width > height) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc((width / height * expectedY), (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            }
            else if (img.style.width !== '') {
                img.style.width = (width / height * expectedY) + 'px';
                img.style.height = expectedY + 'px';
            }
            else {
                img.setAttribute('width', (width / height * expectedY).toString());
                img.setAttribute('height', expectedY.toString());
            }
        }
        else if (height > width) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            }
            else if (img.style.width !== '') {
                img.style.width = expectedX + 'px';
                img.style.height = (height / width * expectedX) + 'px';
            }
            else {
                img.setAttribute('width', expectedX.toString());
                img.setAttribute('height', (height / width * expectedX).toString());
            }
        }
        else {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            }
            else if (img.style.width !== '') {
                img.style.width = expectedX + 'px';
                img.style.height = expectedX + 'px';
            }
            else {
                img.setAttribute('width', expectedX.toString());
                img.setAttribute('height', expectedX.toString());
            }
        }
    }
    pixToPerc(expected, parentEle) {
        return expected / parseFloat(getComputedStyle(parentEle).width) * 100;
    }
    imgDupMouseMove(width, height, e) {
        let args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(onResize, args, (resizingArgs) => {
            if (resizingArgs.cancel) {
                this.cancelResizeAction();
            }
            else {
                if ((parseInt(this.parent.insertImageSettings.minWidth, 10) >= parseInt(width, 10) ||
                    parseInt(this.parent.insertImageSettings.maxWidth, 10) <= parseInt(width, 10))) {
                    return;
                }
                if (!this.parent.insertImageSettings.resizeByPercent &&
                    (parseInt(this.parent.insertImageSettings.minHeight, 10) >= parseInt(height, 10) ||
                        parseInt(this.parent.insertImageSettings.maxHeight, 10) <= parseInt(height, 10))) {
                    return;
                }
                this.imgEle.parentElement.style.cursor = 'pointer';
                this.setAspectRatio(this.imgEle, parseInt(width, 10), parseInt(height, 10));
                this.resizeImgDupPos(this.imgEle);
                this.imgResizePos(this.imgEle, this.imgResizeDiv);
                this.parent.setContentHeight('', false);
            }
        });
    }
    resizing(e) {
        let pageX = this.getPointX(e);
        let pageY = this.getPointY(e);
        let mouseX = (this.resizeBtnStat.botLeft || this.resizeBtnStat.topLeft) ? -(pageX - this.pageX) : (pageX - this.pageX);
        let mouseY = (this.resizeBtnStat.topLeft || this.resizeBtnStat.topRight) ? -(pageY - this.pageY) : (pageY - this.pageY);
        let width = parseInt(this.imgDupPos.width, 10) + mouseX;
        let height = parseInt(this.imgDupPos.height, 10) + mouseY;
        this.pageX = pageX;
        this.pageY = pageY;
        if (this.resizeBtnStat.botRight) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
        else if (this.resizeBtnStat.botLeft) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
        else if (this.resizeBtnStat.topRight) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
        else if (this.resizeBtnStat.topLeft) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
    }
    cancelResizeAction() {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.imgEle && this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            detach(this.imgResizeDiv);
            this.imgEle.style.outline = '';
            this.imgResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
        }
    }
    resizeImgDupPos(e) {
        this.imgDupPos = {
            width: (e.style.height !== '') ? this.imgEle.style.width : e.width + 'px',
            height: (e.style.height !== '') ? this.imgEle.style.height : e.height + 'px'
        };
    }
    resizeBtnInit() {
        return this.resizeBtnStat = { botLeft: false, botRight: false, topRight: false, topLeft: false };
    }
    onToolbarAction(args) {
        if (isIDevice$1()) {
            this.parent.notify(selectionRestore, {});
        }
        let item = args.args.item;
        switch (item.subCommand) {
            case 'Replace':
                this.parent.notify(insertImage, args);
                break;
            case 'Caption':
                this.parent.notify(imageCaption, args);
                break;
            case 'InsertLink':
                this.parent.notify(imageLink, args);
                break;
            case 'AltText':
                this.parent.notify(imageAlt, args);
                break;
            case 'Remove':
                this.parent.notify(imageDelete, args);
                break;
            case 'Dimension':
                this.parent.notify(imageSize, args);
                break;
            case 'OpenImageLink':
                this.openImgLink(args);
                break;
            case 'EditImageLink':
                this.editImgLink(args);
                break;
            case 'RemoveImageLink':
                this.removeImgLink(args);
                break;
        }
    }
    openImgLink(e) {
        let target = e.selectParent[0].parentNode.target === '' ? '_self' : '_blank';
        this.parent.formatter.process(this.parent, e.args, e.args, {
            url: e.selectParent[0].parentNode.href, target: target, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand
        });
    }
    editImgLink(e) {
        let selectParentEle = e.selectParent[0].parentNode;
        let linkUpdate = this.i10n.getConstant('dialogUpdate');
        let inputDetails = {
            url: selectParentEle.href, target: selectParentEle.target,
            header: 'Edit Link', btnText: linkUpdate
        };
        this.insertImgLink(e, inputDetails);
    }
    removeImgLink(e) {
        if (Browser.isIE) {
            this.contentModule.getEditPanel().focus();
        }
        e.selection.restore();
        let isCapLink = (this.contentModule.getEditPanel().contains(this.captionEle) && select('a', this.captionEle)) ?
            true : false;
        let selectParent = isCapLink ? [this.captionEle] : [e.selectNode[0].parentElement];
        this.parent.formatter.process(this.parent, e.args, e.args, {
            insertElement: e.selectNode[0], selectParent: selectParent, selection: e.selection,
            subCommand: e.args.item.subCommand
        });
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            if (!isNullOrUndefined(e.selectParent)) {
                removeClass([e.selectParent[0]], 'e-img-focus');
            }
        }
        if (isCapLink) {
            select('.e-img-inner', this.captionEle).focus();
        }
    }
    onKeyDown(event) {
        let originalEvent = event.args;
        let range;
        let save;
        let selectNodeEle;
        let selectParentEle;
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection)) {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                (selectParentEle[0].tagName === 'IMG') && selectParentEle[0].parentElement) {
                let prev = selectParentEle[0].parentElement.childNodes[0];
                if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                    this.remvoeResizEle();
                }
                this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.contentModule.getDocument(), prev, prev, prev.textContent.length, prev.textContent.length);
                removeClass([selectParentEle[0]], 'e-img-focus');
                this.quickToolObj.imageQTBar.hidePopup();
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && selectNodeEle[0].nodeName === 'IMG') {
                originalEvent.preventDefault();
                let event = {
                    selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                    args: {
                        item: { command: 'Images', subCommand: 'Remove' },
                        originalEvent: originalEvent
                    }
                };
                this.deleteImg(event);
            }
            if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                this.remvoeResizEle();
            }
        }
        switch (originalEvent.action) {
            case 'escape':
                if (!isNullOrUndefined(this.dialogObj)) {
                    this.dialogObj.close();
                }
                break;
            case 'insert-image':
                if (this.parent.editorMode === 'HTML') {
                    this.insertImage({
                        args: {
                            item: { command: 'Images', subCommand: 'Image' },
                            originalEvent: originalEvent
                        },
                        selectNode: selectNodeEle,
                        selection: save,
                        selectParent: selectParentEle
                    });
                }
                else {
                    this.insertImage({
                        args: {
                            item: { command: 'Images', subCommand: 'Image' },
                            originalEvent: originalEvent
                        },
                        member: 'image',
                        text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(this.parent.contentModule.getEditPanel()),
                        module: 'Markdown',
                        name: 'insertImage'
                    });
                }
                originalEvent.preventDefault();
                break;
        }
    }
    alignmentSelect(e) {
        let item = e.item;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Images') {
            return;
        }
        let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        let selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (selectNodeEle[0].nodeName === 'IMG') ? selectNodeEle : [this.imgEle];
        let args = { args: e, selectNode: selectNodeEle };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        switch (item.subCommand) {
            case 'JustifyLeft':
                this.justifyImageLeft(args);
                break;
            case 'JustifyCenter':
                this.justifyImageCenter(args);
                break;
            case 'JustifyRight':
                this.justifyImageRight(args);
                break;
            case 'Inline':
                this.inline(args);
                break;
            case 'Break':
                this.break(args);
                break;
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            removeClass([selectNodeEle[0]], 'e-img-focus');
        }
        this.cancelResizeAction();
    }
    imageWithLinkQTBarItemUpdate() {
        let separator;
        let items = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].getAttribute('title') === this.i10n.getConstant('openLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('editLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('removeLink')) {
                addClass([items[i]], 'e-link-groups');
                items[i].style.display = 'none';
            }
            else if (items[i].getAttribute('title') === 'Insert Link') {
                items[i].style.display = '';
            }
            else if (items[i].classList.contains('e-rte-horizontal-separator')) {
                separator = items[i];
                detach(items[i]);
            }
        }
        let newItems = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item:not(.e-link-groups)');
        this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
    }
    showImageQuickToolbar(e) {
        if (e.type !== 'Images' || isNullOrUndefined(this.parent.quickToolbarModule)
            || isNullOrUndefined(this.parent.quickToolbarModule.imageQTBar)) {
            return;
        }
        this.quickToolObj = this.parent.quickToolbarModule;
        let args = e.args;
        let target;
        [].forEach.call(e.elements, (element, index) => {
            if (index === 0) {
                target = element;
            }
        });
        if (target && !closest(target, 'a')) {
            this.imageWithLinkQTBarItemUpdate();
        }
        if (target.nodeName === 'IMG') {
            addClass([target], ['e-img-focus']);
        }
        let pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
        if (this.parent.quickToolbarModule.imageQTBar) {
            if (e.isNotify) {
                setTimeout(() => { this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target); }, 400);
            }
            else {
                this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target);
            }
        }
    }
    hideImageQuickToolbar() {
        if (!isNullOrUndefined(this.contentModule.getEditPanel().querySelector('.e-img-focus'))) {
            removeClass([this.contentModule.getEditPanel().querySelector('.e-img-focus')], 'e-img-focus');
            if (this.quickToolObj && this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
            }
        }
    }
    editAreaClickHandler(e) {
        let args = e.args;
        let showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.imageQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            let target = args.target;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            let isPopupOpen = this.quickToolObj.imageQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'IMG' && this.parent.quickToolbarModule) {
                if (isPopupOpen) {
                    return;
                }
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                if (isIDevice$1()) {
                    this.parent.notify(selectionSave, e);
                }
                addClass([target], 'e-img-focus');
                let items = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
                let separator;
                if (closest(target, 'a')) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].getAttribute('title') === this.i10n.getConstant('openLink') ||
                            items[i].getAttribute('title') === this.i10n.getConstant('editLink') ||
                            items[i].getAttribute('title') === this.i10n.getConstant('removeLink')) {
                            items[i].style.display = '';
                            removeClass([items[i]], 'e-link-groups');
                        }
                        else if (items[i].getAttribute('title') === 'Insert Link') {
                            items[i].style.display = 'none';
                        }
                        else if (items[i].classList.contains('e-rte-horizontal-separator')) {
                            separator = items[i];
                            detach(items[i]);
                        }
                    }
                    let newItems = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item:not(.e-link-groups)');
                    this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
                }
                else if (!closest(target, 'a')) {
                    this.imageWithLinkQTBarItemUpdate();
                }
                this.showImageQuickToolbar({ args: args, type: 'Images', elements: [args.target] });
            }
            else {
                this.hideImageQuickToolbar();
            }
        }
    }
    insertImgLink(e, inputDetails) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            let linkWrap = this.parent.createElement('div', { className: 'e-img-linkwrap' });
            let linkUrl = this.i10n.getConstant('linkurl');
            let content = '<div class="e-rte-field">' +
                '<input type="text" data-role ="none" class="e-input e-img-link" spellcheck="false" placeholder="' + linkUrl + '"/></div>' +
                '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
                '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>';
            let contentElem = parseHtml(content);
            linkWrap.appendChild(contentElem);
            let linkTarget = linkWrap.querySelector('.e-rte-linkTarget');
            let inputLink = linkWrap.querySelector('.e-img-link');
            let linkOpenLabel = this.i10n.getConstant('linkOpenInNewWindow');
            this.checkBoxObj = new CheckBox({
                label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl, change: (e) => {
                    if (e.checked) {
                        target = '_blank';
                    }
                    else {
                        target = null;
                    }
                }
            });
            this.checkBoxObj.isStringTemplate = true;
            this.checkBoxObj.createElement = this.parent.createElement;
            this.checkBoxObj.appendTo(linkTarget);
            let target = this.checkBoxObj.checked ? '_blank' : null;
            let linkUpdate = this.i10n.getConstant('dialogUpdate');
            let linkargs = {
                args: e.args,
                selfImage: this, selection: e.selection,
                selectNode: e.selectNode, selectParent: e.selectParent, link: inputLink, target: target
            };
            this.dialogObj.setProperties({
                height: 'inherit',
                width: '290px',
                header: this.parent.localeObj.getConstant('imageInsertLinkHeader'),
                content: linkWrap,
                position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: (e) => { this.insertlink(linkargs); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-link', isPrimary: true
                        }
                    }]
            });
            if (!isNullOrUndefined(inputDetails)) {
                inputLink.value = inputDetails.url;
                (inputDetails.target) ? this.checkBoxObj.checked = true : this.checkBoxObj.checked = false;
                this.dialogObj.header = inputDetails.header;
            }
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    }
    insertAltText(e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        let altText = this.i10n.getConstant('altText');
        if (!isNullOrUndefined(this.dialogObj)) {
            let altWrap = this.parent.createElement('div', { className: 'e-img-altwrap' });
            let altHeader = this.i10n.getConstant('alternateHeader');
            let linkUpdate = this.i10n.getConstant('dialogUpdate');
            let getAlt = (e.selectNode[0].getAttribute('alt') === null) ? '' :
                e.selectNode[0].getAttribute('alt');
            let content = '<div class="e-rte-field">' +
                '<input type="text" spellcheck="false" value="' + getAlt + '" class="e-input e-img-alt" placeholder="' + altText + '"/>' +
                '</div>';
            let contentElem = parseHtml(content);
            altWrap.appendChild(contentElem);
            let inputAlt = altWrap.querySelector('.e-img-alt');
            let altArgs = {
                args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode,
                alt: inputAlt
            };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: altHeader, content: altWrap, position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: (e) => { this.insertAlt(altArgs); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-alt', isPrimary: true
                        }
                    }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    }
    insertAlt(e) {
        if (!isNullOrUndefined(e.alt)) {
            e.selection.restore();
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            let altText = e.alt.value;
            this.parent.formatter.process(this.parent, e.args, e.args, {
                altText: altText, selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
            this.dialogObj.hide({ returnValue: false });
        }
    }
    insertlink(e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let url = e.link.value;
        if (url === '') {
            addClass([e.link], 'e-error');
            e.link.setSelectionRange(0, url.length);
            e.link.focus();
            return;
        }
        if (!this.isUrl(url)) {
            url = 'http://' + url;
        }
        else {
            removeClass([e.link], 'e-error');
        }
        let proxy = e.selfImage;
        if (proxy.parent.editorMode === 'HTML') {
            e.selection.restore();
        }
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (e.selectNode[0].parentElement.nodeName === 'A') {
            proxy.parent.formatter.process(proxy.parent, e.args, e.args, {
                url: url, target: proxy.checkBoxObj.checked ? '_blank' : null, selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
            proxy.dialogObj.hide({ returnValue: true });
            return;
        }
        proxy.parent.formatter.process(proxy.parent, e.args, e.args, {
            url: url, target: proxy.checkBoxObj.checked ? '_blank' : null, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand, selection: e.selection
        });
        let captionEle = closest(e.selectNode[0], '.e-img-caption');
        if (captionEle) {
            select('.e-img-inner', captionEle).focus();
        }
        proxy.dialogObj.hide({ returnValue: false });
    }
    isUrl(url) {
        let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    }
    deleteImg(e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
            this.remvoeResizEle();
        }
        this.parent.formatter.process(this.parent, e.args, e.args, {
            selectNode: e.selectNode,
            captionClass: CLS_CAPTION,
            subCommand: e.args.item.subCommand
        });
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
        }
        this.cancelResizeAction();
    }
    caption(e) {
        let selectNode = e.selectNode[0];
        if (selectNode.nodeName !== 'IMG') {
            return;
        }
        e.selection.restore();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.cancelResizeAction();
        addClass([selectNode], 'e-rte-image');
        let subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Caption';
        if (!isNullOrUndefined(closest(selectNode, '.' + CLS_CAPTION))) {
            detach(closest(selectNode, '.' + CLS_CAPTION));
            if (Browser.isIE) {
                this.contentModule.getEditPanel().focus();
                e.selection.restore();
            }
            if (selectNode.parentElement.tagName === 'A') {
                this.parent.formatter.process(this.parent, e.args, e.args, { insertElement: selectNode.parentElement, selectNode: e.selectNode, subCommand: subCommand });
            }
            else {
                this.parent.formatter.process(this.parent, e.args, e.args, { insertElement: selectNode, selectNode: e.selectNode, subCommand: subCommand });
            }
        }
        else {
            this.captionEle = this.parent.createElement('span', {
                className: CLS_CAPTION,
                attrs: { contenteditable: 'false', draggable: 'false' }
            });
            let imgWrap = this.parent.createElement('span', { className: 'e-img-wrap' });
            let imgInner = this.parent.createElement('span', { className: 'e-img-inner', attrs: { contenteditable: 'true' } });
            let parent = e.selectNode[0].parentElement;
            if (parent.tagName === 'A') {
                parent.setAttribute('contenteditable', 'true');
            }
            imgWrap.appendChild(parent.tagName === 'A' ? parent : e.selectNode[0]);
            imgWrap.appendChild(imgInner);
            let imgCaption = this.i10n.getConstant('imageCaption');
            imgInner.innerHTML = imgCaption;
            this.captionEle.appendChild(imgWrap);
            if (selectNode.classList.contains(CLS_IMGINLINE)) {
                addClass([this.captionEle], CLS_CAPINLINE);
            }
            if (selectNode.classList.contains(CLS_IMGBREAK)) {
                addClass([this.captionEle], CLS_IMGBREAK);
            }
            if (selectNode.classList.contains(CLS_IMGLEFT)) {
                addClass([this.captionEle], CLS_IMGLEFT);
            }
            if (selectNode.classList.contains(CLS_IMGRIGHT)) {
                addClass([this.captionEle], CLS_IMGRIGHT);
            }
            if (selectNode.classList.contains(CLS_IMGCENTER)) {
                addClass([this.captionEle], CLS_IMGCENTER);
            }
            this.parent.formatter.process(this.parent, e.args, e.args, { insertElement: this.captionEle, selectNode: e.selectNode, subCommand: subCommand });
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.contentModule.getDocument(), imgInner.childNodes[0], imgInner.childNodes[0], 0, imgInner.childNodes[0].textContent.length);
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            removeClass([selectNode], 'e-img-focus');
        }
    }
    imageSize(e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            let imgSizeHeader = this.i10n.getConstant('imageSizeHeader');
            let linkUpdate = this.i10n.getConstant('dialogUpdate');
            let dialogContent = this.imgsizeInput(e);
            let selectObj = { args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: imgSizeHeader, content: dialogContent, position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: (e) => { this.insertSize(selectObj); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-size', isPrimary: true
                        }
                    }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    }
    break(e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    inline(e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        let subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    justifyImageLeft(e) {
        let subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyLeft';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    justifyImageRight(e) {
        let subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyRight';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    justifyImageCenter(e) {
        let subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyCenter';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    }
    imagDialog(e) {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
            return;
        }
        let imgDialog = this.parent.createElement('div', { className: 'e-rte-img-dialog', id: this.rteID + '_image' });
        this.parent.element.appendChild(imgDialog);
        let imgInsert = this.i10n.getConstant('dialogInsert');
        let imglinkCancel = this.i10n.getConstant('dialogCancel');
        let imgHeader = this.i10n.getConstant('imageHeader');
        let selection = e.selection;
        let selectObj = { selfImage: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        let dialogModel = {
            header: imgHeader,
            cssClass: CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px', height: 'inherit',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: Browser.isDevice,
            buttons: [{
                    click: this.insertImageUrl.bind(selectObj),
                    buttonModel: { content: imgInsert, cssClass: 'e-flat e-insertImage', isPrimary: true }
                },
                {
                    click: (e) => { this.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: imglinkCancel }
                }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event) => {
                this.parent.isBlur = false;
                if (event && event.event.returnValue) {
                    if (this.parent.editorMode === 'HTML') {
                        selection.restore();
                    }
                    else {
                        this.parent.formatter.editorManager.markdownSelection.restore(this.parent.contentModule.getEditPanel());
                    }
                }
                this.dialogObj.destroy();
                detach(this.dialogObj.element);
                let args = isBlazor() ? null : this.dialogObj;
                this.dialogRenderObj.close(args);
                this.dialogObj = null;
            },
        };
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(imgDialog);
        imgDialog.style.maxHeight = 'inherit';
        if (this.quickToolObj) {
            if (this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
                if (!isNullOrUndefined(e.selectParent)) {
                    removeClass([e.selectParent[0]], 'e-img-focus');
                }
            }
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    }
    cancelDialog(e) {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true });
    }
    onDocumentClick(e) {
        let target = e.target;
        if (target.nodeName === 'IMG') {
            this.imgEle = target;
        }
        if (!isNullOrUndefined(this.dialogObj) && ((!closest(target, '#' + this.dialogObj.element.id) && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target) &&
                !closest(target, '#' + this.parent.getID() + '_toolbar_Image') &&
                !target.querySelector('#' + this.parent.getID() + '_toolbar_Image')))) {
            this.dialogObj.hide({ returnValue: true });
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        if (e.target.tagName !== 'IMG' && this.imgResizeDiv && !(this.quickToolObj &&
            this.quickToolObj.imageQTBar && this.quickToolObj.imageQTBar.element.contains(e.target)) &&
            this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
        if (target.tagName !== 'IMG' && this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
            this.remvoeResizEle();
            this.contentModule.getEditPanel().querySelector('img').style.outline = '';
        }
    }
    remvoeResizEle() {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.contentModule.getEditPanel().querySelector('.e-img-resize'));
    }
    imageUrlPopup(e) {
        let imgUrl = this.parent.createElement('div', { className: 'imgUrl' });
        let placeUrl = this.i10n.getConstant('imageUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-img-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false' }
        });
        imgUrl.appendChild(this.inputUrl);
        return imgUrl;
    }
    insertImageUrl(e) {
        let proxy = this.selfImage;
        let url = proxy.inputUrl.value;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (!isNullOrUndefined(proxy.uploadUrl) && proxy.uploadUrl.url !== '') {
            proxy.uploadUrl.cssClass = (proxy.parent.insertImageSettings.display === 'inline' ?
                CLS_IMGINLINE : CLS_IMGBREAK);
            proxy.dialogObj.hide({ returnValue: false });
            proxy.parent.formatter.process(proxy.parent, this.args, this.args.originalEvent, proxy.uploadUrl);
            proxy.uploadUrl.url = '';
            if (proxy.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                proxy.imgEle.style.outline = '';
                proxy.remvoeResizEle();
            }
        }
        else if (url !== '') {
            if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(closest(this.selection.range.startContainer.parentNode, '#' + proxy.contentModule.getPanel().id))) {
                proxy.contentModule.getEditPanel().focus();
                let range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
                this.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.contentModule.getDocument());
                this.selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            let regex = /[\w-]+.(jpg|png|jpeg|gif)/g;
            let matchUrl = (!isNullOrUndefined(url.match(regex)) && proxy.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            let value = {
                cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? CLS_IMGINLINE : CLS_IMGBREAK),
                url: url, selection: this.selection, altText: matchUrl,
                selectParent: this.selectParent, width: {
                    width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                    maxWidth: proxy.parent.insertImageSettings.maxWidth
                },
                height: {
                    height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                    maxHeight: proxy.parent.insertImageSettings.maxHeight
                }
            };
            proxy.parent.formatter.process(proxy.parent, this.args, this.args.originalEvent, value);
            proxy.dialogObj.hide({ returnValue: false });
        }
    }
    imgsizeInput(e) {
        let selectNode = e.selectNode[0];
        let imgHeight = this.i10n.getConstant('imageHeight');
        let imgWidth = this.i10n.getConstant('imageWidth');
        let imgSizeWrap = this.parent.createElement('div', { className: 'e-img-sizewrap' });
        let widthVal = (selectNode.getAttribute('width') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('width'))) ? selectNode.width : selectNode.getClientRects()[0].width;
        let heightVal = (selectNode.getAttribute('height') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('height'))) ? selectNode.height : selectNode.getClientRects()[0].height;
        let content = '<div class="e-rte-label"><label>' + imgWidth +
            '</label></div><div class="e-rte-field"><input type="text" data-role ="none" id="imgwidth" class="e-img-width" value=' +
            widthVal
            + ' /></div>' +
            '<div class="e-rte-label">' + '<label>' + imgHeight + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" id="imgheight" class="e-img-height" value=' +
            heightVal
            + ' /></div>';
        let contentElem = parseHtml(content);
        imgSizeWrap.appendChild(contentElem);
        let widthNum = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minWidth,
            max: this.parent.insertImageSettings.maxWidth,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.isStringTemplate = true;
        widthNum.createElement = this.parent.createElement;
        widthNum.appendTo(imgSizeWrap.querySelector('#imgwidth'));
        let heightNum = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minHeight,
            max: this.parent.insertImageSettings.maxHeight,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        heightNum.isStringTemplate = true;
        heightNum.createElement = this.parent.createElement;
        heightNum.appendTo(imgSizeWrap.querySelector('#imgheight'));
        return imgSizeWrap;
    }
    insertSize(e) {
        e.selection.restore();
        let proxy = e.selfImage;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        let dialogEle = proxy.dialogObj.element;
        let width = parseFloat(dialogEle.querySelector('.e-img-width').value);
        let height = parseFloat(dialogEle.parentElement.querySelector('.e-img-height').value);
        proxy.parent.formatter.process(this.parent, e.args, e.args, {
            width: width, height: height, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand
        });
        if (this.imgResizeDiv) {
            proxy.imgResizePos(e.selectNode[0], this.imgResizeDiv);
        }
        proxy.dialogObj.hide({ returnValue: true });
    }
    insertImage(e) {
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            let dialogContent = this.parent.createElement('div', { className: 'e-img-content' });
            if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
                || this.parent.editorMode === 'HTML') {
                dialogContent.appendChild(this.imgUpload(e));
            }
            let linkHeader = this.parent.createElement('div', { className: 'e-linkheader' });
            let linkHeaderText = this.i10n.getConstant('imageLinkHeader');
            if (this.parent.editorMode === 'HTML') {
                linkHeader.innerHTML = linkHeaderText;
            }
            else {
                linkHeader.innerHTML = this.i10n.getConstant('mdimageLink');
            }
            dialogContent.appendChild(linkHeader);
            dialogContent.appendChild(this.imageUrlPopup(e));
            if (e.selectNode && e.selectNode[0].nodeName === 'IMG') {
                this.dialogObj.setProperties({
                    header: this.parent.localeObj.getConstant('editImageHeader'), content: dialogContent
                });
                this.dialogObj.element.querySelector('.e-insertImage').textContent = this.parent.localeObj.getConstant('dialogUpdate');
            }
            else {
                this.dialogObj.setProperties({ content: dialogContent }, false);
            }
            this.dialogObj.element.style.maxHeight = 'inherit';
            if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
                || this.parent.editorMode === 'HTML') {
                dialogContent.querySelector('#' + this.rteID + '_insertImage').focus();
            }
            else {
                dialogContent.querySelector('.e-img-url').focus();
            }
        }
    }
    imgUpload(e) {
        let save;
        let selectParent;
        let proxy = this;
        let iframe = proxy.parent.iframeSettings.enable;
        if (proxy.parent.editorMode === 'HTML' &&
            (!iframe && isNullOrUndefined(closest(e.selection.range.startContainer.parentNode, '#' + this.contentModule.getPanel().id))
                || (iframe && !hasClass(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'), 'e-lib')))) {
            this.contentModule.getEditPanel().focus();
            let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        else {
            save = e.selection;
            selectParent = e.selectParent;
        }
        let uploadParentEle = this.parent.createElement('div', { className: 'e-img-uploadwrap e-droparea' });
        let deviceImgUpMsg = this.i10n.getConstant('imageDeviceUploadMessage');
        let imgUpMsg = this.i10n.getConstant('imageUploadMessage');
        let span = this.parent.createElement('span', { className: 'e-droptext' });
        let spanMsg = this.parent.createElement('span', {
            className: 'e-rte-upload-text', innerHTML: ((Browser.isDevice) ? deviceImgUpMsg : imgUpMsg)
        });
        span.appendChild(spanMsg);
        let btnEle = this.parent.createElement('button', {
            className: 'e-browsebtn', id: this.rteID + '_insertImage',
            attrs: { autofocus: 'true', type: 'button' }
        });
        span.appendChild(btnEle);
        uploadParentEle.appendChild(span);
        let browserMsg = this.i10n.getConstant('browse');
        let button = new Button({ content: browserMsg, enableRtl: this.parent.enableRtl });
        button.isStringTemplate = true;
        button.createElement = this.parent.createElement;
        button.appendTo(btnEle);
        let btnClick = (Browser.isDevice) ? span : btnEle;
        EventHandler.add(btnClick, 'click', this.fileSelect, this);
        let uploadEle = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        uploadParentEle.appendChild(uploadEle);
        let altText;
        this.uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl,
            },
            dropArea: span, multiple: false, enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            selected: (e) => {
                this.parent.trigger(imageSelected, e, (e) => {
                    altText = e.filesData[0].name;
                    if (this.parent.editorMode === 'HTML' && isNullOrUndefined(this.parent.insertImageSettings.path)) {
                        let reader = new FileReader();
                        reader.addEventListener('load', (e) => {
                            let url = this.parent.insertImageSettings.saveFormat === 'Base64' ? reader.result :
                                URL.createObjectURL(proxy.url(reader.result));
                            proxy.uploadUrl = {
                                url: url, selection: save, altText: altText, selectParent: selectParent,
                                width: {
                                    width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                                    maxWidth: proxy.parent.insertImageSettings.maxWidth
                                }, height: {
                                    height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                                    maxHeight: proxy.parent.insertImageSettings.maxHeight
                                }
                            };
                            proxy.inputUrl.setAttribute('disabled', 'true');
                        });
                        reader.readAsDataURL(e.filesData[0].rawFile);
                    }
                });
            },
            uploading: (e) => {
                this.parent.trigger(imageUploading, e);
            },
            success: (e) => {
                this.parent.trigger(imageUploadSuccess, e, (e) => {
                    if (!isNullOrUndefined(this.parent.insertImageSettings.path)) {
                        let url = this.parent.insertImageSettings.path + e.file.name;
                        proxy.uploadUrl = {
                            url: url, selection: save, altText: altText, selectParent: selectParent,
                            width: {
                                width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                                maxWidth: proxy.parent.insertImageSettings.maxWidth
                            },
                            height: {
                                height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                                maxHeight: proxy.parent.insertImageSettings.maxHeight
                            }
                        };
                        proxy.inputUrl.setAttribute('disabled', 'true');
                    }
                });
            },
            failure: (e) => {
                this.parent.trigger(imageUploadFailed, e);
            },
            removing: () => {
                this.parent.trigger(imageRemoving, e, (e) => {
                    proxy.inputUrl.removeAttribute('disabled');
                    proxy.uploadUrl.url = '';
                });
            }
        });
        this.uploadObj.isStringTemplate = true;
        this.uploadObj.createElement = this.parent.createElement;
        this.uploadObj.appendTo(uploadEle);
        return uploadParentEle;
    }
    fileSelect() {
        this.dialogObj.element.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
    }
    imagePaste(args) {
        if (args.text.length === 0) {
            let proxy = this;
            let reader = new FileReader();
            args.args.preventDefault();
            reader.addEventListener('load', (e) => {
                let url = {
                    cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? CLS_IMGINLINE : CLS_IMGBREAK),
                    url: this.parent.insertImageSettings.saveFormat === 'Base64' ? reader.result :
                        URL.createObjectURL(proxy.url(reader.result)),
                    width: {
                        width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                        maxWidth: proxy.parent.insertImageSettings.maxWidth
                    },
                    height: {
                        height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                        maxHeight: proxy.parent.insertImageSettings.maxHeight
                    }
                };
                if (!isNullOrUndefined(args.callBack)) {
                    args.callBack(url);
                    return;
                }
                else {
                    proxy.parent.formatter.process(proxy.parent, { item: { command: 'Images', subCommand: 'Image' } }, args.args, url);
                }
            });
            reader.readAsDataURL(args.file);
        }
    }
    url(dataurl) {
        let arr = dataurl.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'image';
    }
}

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 */
class ViewSource {
    /**
     * Constructor for view source module
     */
    constructor(parent, locator) {
        this.parent = parent;
        let serviceLocator = locator;
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(sourceCode, this.sourceCode, this);
        this.parent.on(initialEnd, this.onInitialEnd, this);
        this.parent.on(updateSource, this.updateSourceCode, this);
    }
    onInitialEnd() {
        this.parent.formatter.editorManager.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    }
    removeEventListener() {
        this.unWireEvent();
        this.parent.off(sourceCode, this.sourceCode);
        this.parent.off(updateSource, this.updateSourceCode);
        this.parent.off(initialEnd, this.onInitialEnd);
        this.parent.formatter.editorManager.observer.off(KEY_DOWN_HANDLER, this.onKeyDown);
    }
    getSourceCode() {
        return this.parent.createElement('textarea', { className: 'e-rte-srctextarea' });
    }
    wireEvent(element) {
        this.keyboardModule = new KeyboardEvents$1(element, {
            keyAction: this.previewKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
        EventHandler.add(this.previewElement, 'mousedown', this.mouseDownHandler, this);
    }
    unWireEvent() {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        if (this.previewElement) {
            EventHandler.remove(this.previewElement, 'mousedown', this.mouseDownHandler);
        }
    }
    wireBaseKeyDown() {
        this.parent.keyboardModule = new KeyboardEvents$1(this.contentModule.getEditPanel(), {
            keyAction: this.parent.keyDown.bind(this.parent), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
    }
    unWireBaseKeyDown() {
        this.parent.keyboardModule.destroy();
    }
    mouseDownHandler(e) {
        this.parent.notify(sourceCodeMouseDown, { args: e });
    }
    previewKeyDown(event) {
        switch (event.action) {
            case 'html-source':
                this.updateSourceCode(event);
                event.preventDefault();
                break;
        }
    }
    onKeyDown(e) {
        switch (e.event.action) {
            case 'html-source':
                e.event.preventDefault();
                this.sourceCode(e);
                e.callBack({
                    requestType: 'SourceCode',
                    editorMode: 'HTML',
                    event: e.event
                });
                break;
        }
    }
    sourceCode(args) {
        this.parent.isBlur = false;
        this.parent.trigger(actionBegin, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        let tbItems = selectAll('.' + CLS_TB_ITEM, this.parent.element);
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        this.parent.notify(updateToolbarItem, {
            targetItem: 'SourceCode', updateItem: 'Preview',
            baseToolbar: this.parent.getBaseToolbarObject()
        });
        if (isNullOrUndefined(this.previewElement)) {
            this.previewElement = this.getSourceCode();
        }
        this.parent.updateValueData();
        if (this.parent.iframeSettings.enable) {
            let rteContent;
            if (isNullOrUndefined(this.parent.element.querySelector('#' + this.parent.element.id + '_source-view'))) {
                rteContent = this.parent.createElement('div', {
                    className: 'e-source-content', id: this.parent.element.id + '_source-view'
                });
            }
            else {
                rteContent = this.parent.element.querySelector('#' + this.parent.element.id + '_source-view');
            }
            rteContent.appendChild(this.previewElement);
            this.parent.element.appendChild(rteContent);
            rteContent.style.height = this.contentModule.getPanel().style.height;
            rteContent.style.marginTop = this.contentModule.getPanel().style.marginTop;
            this.getPanel().value = this.getTextAreaValue();
            this.contentModule.getPanel().style.display = 'none';
            rteContent.style.display = 'block';
        }
        else {
            this.contentModule.getPanel().appendChild(this.previewElement);
            this.getPanel().value = this.getTextAreaValue();
            this.contentModule.getEditPanel().style.display = 'none';
            this.previewElement.style.display = 'block';
        }
        this.parent.isBlur = false;
        this.parent.disableToolbarItem(this.parent.toolbarSettings.items);
        this.parent.enableToolbarItem('SourceCode');
        if (this.parent.getToolbar()) {
            removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
        }
        removeClass(tbItems, [CLS_ACTIVE]);
        this.parent.setContentHeight('sourceCode', true);
        this.wireEvent(this.previewElement);
        this.unWireBaseKeyDown();
        this.previewElement.focus();
        this.parent.updateValue();
        if (!isNullOrUndefined(this.parent.placeholder) && !this.parent.iframeSettings.enable) {
            let placeHolderWrapper = this.parent.element.querySelector('.rte-placeholder');
            placeHolderWrapper.style.display = 'none';
        }
        this.parent.trigger(actionComplete, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        this.parent.invokeChangeEvent();
    }
    updateSourceCode(args) {
        this.parent.isBlur = false;
        this.parent.trigger(actionBegin, { requestType: 'Preview', targetItem: 'Preview', args: args });
        let editHTML = this.getPanel();
        this.parent.notify(updateToolbarItem, {
            targetItem: 'Preview', updateItem: 'SourceCode',
            baseToolbar: this.parent.getBaseToolbarObject()
        });
        let serializeValue = this.parent.serializeValue(editHTML.value);
        let value = (serializeValue === null || serializeValue === '') ? '<p><br/></p>' : serializeValue;
        if (this.parent.iframeSettings.enable) {
            editHTML.parentElement.style.display = 'none';
            this.contentModule.getPanel().style.display = 'block';
            this.contentModule.getEditPanel().innerHTML = value;
        }
        else {
            editHTML.style.display = 'none';
            this.contentModule.getEditPanel().style.display = 'block';
            this.contentModule.getEditPanel().innerHTML = value;
        }
        this.parent.isBlur = false;
        this.parent.enableToolbarItem(this.parent.toolbarSettings.items);
        if (this.parent.getToolbar()) {
            removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
        }
        this.parent.setContentHeight('preview', true);
        this.unWireEvent();
        this.wireBaseKeyDown();
        this.contentModule.getEditPanel().focus();
        this.parent.updateValue();
        if (!isNullOrUndefined(this.parent.placeholder) && this.contentModule.getEditPanel().innerText.length === 0) {
            let placeHolderWrapper = this.parent.element.querySelector('.rte-placeholder');
            placeHolderWrapper.style.display = 'block';
        }
        this.parent.trigger(actionComplete, { requestType: 'Preview', targetItem: 'Preview', args: args });
        this.parent.formatter.enableUndo(this.parent);
        this.parent.invokeChangeEvent();
    }
    getTextAreaValue() {
        return (this.contentModule.getEditPanel().innerHTML === '<p><br></p>' ||
            this.contentModule.getEditPanel().innerHTML.length === 12) ||
            (this.contentModule.getEditPanel().childNodes.length === 1 &&
                this.contentModule.getEditPanel().childNodes[0].tagName === 'P' &&
                this.contentModule.getEditPanel().innerHTML.length === 7) ? '' : this.parent.value;
    }
    getPanel() {
        return this.parent.element.querySelector('.e-rte-srctextarea');
    }
    getViewPanel() {
        return (this.parent.iframeSettings.enable && this.getPanel()) ? this.getPanel().parentElement : this.getPanel();
    }
    /**
     * Destroy the entire RichTextEditor.
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * `Table` module is used to handle table actions.
 */
class Table {
    constructor(parent, serviceLocator) {
        this.ensureInsideTableList = true;
        this.pageX = null;
        this.pageY = null;
        this.moveEle = null;
        this.parent = parent;
        this.rteID = parent.element.id;
        this.l10n = serviceLocator.getService('rteLocale');
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
        this.addEventListener();
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(createTable, this.renderDlgContent, this);
        this.parent.on(initialEnd, this.afterRender, this);
        this.parent.on(docClick, this.docClick, this);
        this.parent.on(editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(tableToolbarAction, this.onToolbarAction, this);
        this.parent.on(dropDownSelect, this.dropdownSelect, this);
        this.parent.on(keyDown, this.keyDown, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(createTable, this.renderDlgContent);
        this.parent.off(initialEnd, this.afterRender);
        this.parent.off(docClick, this.docClick);
        this.parent.off(editAreaClick, this.editAreaClickHandler);
        this.parent.off(tableToolbarAction, this.onToolbarAction);
        this.parent.off(dropDownSelect, this.dropdownSelect);
        this.parent.off(mouseDown, this.cellSelect);
        this.parent.off(tableColorPickerChanged, this.setBGColor);
        this.parent.off(keyDown, this.keyDown);
    }
    afterRender() {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        this.parent.on(tableColorPickerChanged, this.setBGColor, this);
        this.parent.on(mouseDown, this.cellSelect, this);
        if (this.parent.tableSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
        }
        if (!Browser.isDevice && this.parent.tableSettings.resize) {
            EventHandler.add(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper, this);
        }
    }
    dropdownSelect(e) {
        let item = e.item;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Table') {
            return;
        }
        let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        let args = {
            args: e,
            selection: this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument()),
            selectParent: this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)
        };
        switch (item.subCommand) {
            case 'InsertRowBefore':
            case 'InsertRowAfter':
                this.addRow(args.selection, e);
                break;
            case 'InsertColumnLeft':
            case 'InsertColumnRight':
                this.addColumn(args.selection, e);
                break;
            case 'DeleteColumn':
            case 'DeleteRow':
                this.removeRowColumn(args.selection, e);
                break;
            case 'AlignTop':
            case 'AlignMiddle':
            case 'AlignBottom':
                this.verticalAlign(args, e);
                break;
            case 'Dashed':
            case 'Alternate':
                this.tableStyles(args, item.subCommand);
                break;
        }
    }
    keyDown(e) {
        let event = e.args;
        let proxy = this;
        switch (event.action) {
            case 'escape':
                break;
            case 'insert-table':
                if (this.parent.editorMode === 'HTML') {
                    let docElement = this.parent.contentModule.getDocument();
                    let range = this.parent.formatter.editorManager.nodeSelection.getRange(docElement);
                    let selection = this.parent.formatter.editorManager.nodeSelection.save(range, docElement);
                    let args = {
                        originalEvent: e.args,
                        item: {
                            command: 'Table',
                            subCommand: 'CreateTable'
                        }
                    };
                    this.insertTableDialog({
                        self: this,
                        args: args, selection: selection
                    });
                }
                event.preventDefault();
                break;
        }
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) && this.contentModule) {
            let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            let selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
            let ele = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)[0];
            ele = (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') ? ele.parentElement : ele;
            if ((event.keyCode === 8 || event.keyCode === 46)) {
                if (ele && ele.tagName === 'TBODY') {
                    event.preventDefault();
                    proxy.removeTable(selection, event, true);
                }
                else if (ele && ele.querySelectorAll('table').length > 0) {
                    this.removeResizeEle();
                }
            }
            if (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') {
                let closestTd = closest(ele, 'td');
                ele = !isNullOrUndefined(closestTd) && this.parent.inputElement.contains(closestTd) ? closestTd : ele;
            }
            if (ele && (ele.tagName === 'TD' || ele.tagName === 'TH')) {
                switch (event.keyCode) {
                    case 9:
                    case 37:
                    case 39:
                        proxy.tabSelection(event, selection, ele);
                        break;
                    case 40:
                    case 38:
                        proxy.tableArrowNavigation(event, selection, ele);
                        break;
                }
            }
        }
    }
    onToolbarAction(args) {
        let item = args.args.item;
        switch (item.subCommand) {
            case 'TableHeader':
                this.tableHeader(args.selection, args.args);
                break;
            case 'TableRemove':
                this.removeTable(args.selection, args.args);
                break;
            case 'TableEditProperties':
                this.editTable(args);
                break;
        }
    }
    verticalAlign(args, e) {
        let tdEle = (args.selection.range.startContainer.nodeName === 'TD' ||
            args.selection.range.startContainer.nodeName === 'TH') ? args.selection.range.startContainer :
            args.selection.range.startContainer.parentNode;
        if (tdEle.nodeName !== 'TD' && tdEle.nodeName !== 'TH') {
            return;
        }
        this.parent.formatter.process(this.parent, e, e, { tableCell: tdEle, subCommand: e.item.subCommand });
    }
    tableStyles(args, command) {
        let table = closest(args.selectParent[0], 'table');
        if (command === 'Dashed') {
            (this.parent.element.classList.contains(CLS_TB_DASH_BOR)) ?
                this.parent.element.classList.remove(CLS_TB_DASH_BOR) : this.parent.element.classList.add(CLS_TB_DASH_BOR);
            (table.classList.contains(CLS_TB_DASH_BOR)) ? table.classList.remove(CLS_TB_DASH_BOR) :
                table.classList.add(CLS_TB_DASH_BOR);
        }
        if (command === 'Alternate') {
            (this.parent.element.classList.contains(CLS_TB_ALT_BOR)) ?
                this.parent.element.classList.remove(CLS_TB_ALT_BOR) : this.parent.element.classList.add(CLS_TB_ALT_BOR);
            (table.classList.contains(CLS_TB_ALT_BOR)) ? table.classList.remove(CLS_TB_ALT_BOR) :
                table.classList.add(CLS_TB_ALT_BOR);
        }
        this.parent.formatter.saveData();
        this.parent.formatter.editorManager.nodeSelection.restore();
    }
    insideList(range) {
        let blockNodes = this.parent.formatter.editorManager.domNode.blockNodes();
        let nodes = [];
        for (let i = 0; i < blockNodes.length; i++) {
            if (blockNodes[i].parentNode.tagName === 'LI') {
                nodes.push(blockNodes[i].parentNode);
            }
            else if (blockNodes[i].tagName === 'LI' && blockNodes[i].childNodes[0].tagName !== 'P' &&
                (blockNodes[i].childNodes[0].tagName !== 'OL' &&
                    blockNodes[i].childNodes[0].tagName !== 'UL')) {
                nodes.push(blockNodes[i]);
            }
        }
        if (nodes.length > 1 || nodes.length && ((range.startOffset === 0 && range.endOffset === 0))) {
            this.ensureInsideTableList = true;
            return true;
        }
        else {
            this.ensureInsideTableList = false;
            return false;
        }
    }
    tabSelection(event, selection, ele) {
        let insideList = this.insideList(selection.range);
        if ((event.keyCode === 37 || event.keyCode === 39) && selection.range.startContainer.nodeType === 3 ||
            insideList) {
            return;
        }
        event.preventDefault();
        ele.classList.remove(CLS_TABLE_SEL);
        if (!event.shiftKey && event.keyCode !== 37) {
            let nextElement = (!isNullOrUndefined(ele.nextSibling)) ? ele.nextSibling :
                (!isNullOrUndefined(closest(ele, 'tr').nextSibling) ? closest(ele, 'tr').nextSibling.childNodes[0] :
                    (!isNullOrUndefined(closest(ele, 'table').nextSibling)) ?
                        (closest(ele, 'table').nextSibling.nodeName.toLowerCase() === 'td') ?
                            closest(ele, 'table').nextSibling : ele : ele);
            if (ele === nextElement && ele.nodeName === 'TH') {
                nextElement = closest(ele, 'table').rows[1].cells[0];
            }
            if (event.keyCode === 39 && ele === nextElement) {
                nextElement = closest(ele, 'table').nextSibling;
            }
            if (nextElement) {
                (nextElement.textContent.trim() !== '' && closest(nextElement, 'td')) ?
                    selection.setSelectionNode(this.contentModule.getDocument(), nextElement) :
                    selection.setSelectionText(this.contentModule.getDocument(), nextElement, nextElement, 0, 0);
            }
            if (ele === nextElement && event.keyCode !== 39 && nextElement) {
                this.addRow(selection, event, true);
                nextElement = nextElement.parentElement.nextSibling.firstChild;
                (nextElement.textContent.trim() !== '' && closest(nextElement, 'td')) ?
                    selection.setSelectionNode(this.contentModule.getDocument(), nextElement) :
                    selection.setSelectionText(this.contentModule.getDocument(), nextElement, nextElement, 0, 0);
            }
        }
        else {
            let prevElement = (!isNullOrUndefined(ele.previousSibling)) ? ele.previousSibling :
                (!isNullOrUndefined(closest(ele, 'tr').previousSibling) ?
                    closest(ele, 'tr').previousSibling.childNodes[closest(ele, 'tr').previousSibling.childNodes.length - 1] :
                    (!isNullOrUndefined(closest(ele, 'table').previousSibling)) ?
                        (closest(ele, 'table').previousSibling.nodeName.toLowerCase() === 'td') ? closest(ele, 'table').previousSibling :
                            ele : ele);
            if (ele === prevElement && ele.cellIndex === 0 &&
                closest(ele, 'table').tHead) {
                let clsTble = closest(ele, 'table');
                prevElement = clsTble.rows[0].cells[clsTble.rows[0].cells.length - 1];
            }
            if (event.keyCode === 37 && ele === prevElement) {
                prevElement = closest(ele, 'table').previousSibling;
            }
            if (prevElement) {
                (prevElement.textContent.trim() !== '' && closest(prevElement, 'td')) ?
                    selection.setSelectionNode(this.contentModule.getDocument(), prevElement) :
                    selection.setSelectionText(this.contentModule.getDocument(), prevElement, prevElement, 0, 0);
            }
        }
    }
    tableArrowNavigation(event, selection, ele) {
        let selText = selection.range.startContainer;
        if ((event.keyCode === 40 && selText.nodeType === 3 && (selText.nextSibling && selText.nextSibling.nodeName === 'BR' ||
            selText.parentNode && selText.parentNode.nodeName !== 'TD')) ||
            (event.keyCode === 38 && selText.nodeType === 3 && (selText.previousSibling && selText.previousSibling.nodeName === 'BR' ||
                selText.parentNode && selText.parentNode.nodeName !== 'TD'))) {
            return;
        }
        event.preventDefault();
        ele.classList.remove(CLS_TABLE_SEL);
        if (event.keyCode === 40) {
            ele = (!isNullOrUndefined(closest(ele, 'tr').nextSibling)) ?
                closest(ele, 'tr').nextSibling.children[ele.cellIndex] :
                (closest(ele, 'table').tHead && ele.nodeName === 'TH') ?
                    closest(ele, 'table').rows[1].cells[ele.cellIndex] :
                    (!isNullOrUndefined(closest(ele, 'table').nextSibling)) ? closest(ele, 'table').nextSibling :
                        ele;
        }
        else {
            ele = (!isNullOrUndefined(closest(ele, 'tr').previousSibling)) ?
                closest(ele, 'tr').previousSibling.children[ele.cellIndex] :
                (closest(ele, 'table').tHead && ele.nodeName !== 'TH') ?
                    closest(ele, 'table').tHead.rows[0].cells[ele.cellIndex] :
                    (!isNullOrUndefined(closest(ele, 'table').previousSibling)) ? closest(ele, 'table').previousSibling :
                        ele;
        }
        if (ele) {
            selection.setSelectionText(this.contentModule.getDocument(), ele, ele, 0, 0);
        }
    }
    setBGColor(args) {
        let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
        let selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
        let selectedCell = selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? closest(selectedCell.parentNode, 'td,th') : closest(selectedCell, 'td, th');
        if (selectedCell && (selectedCell.nodeName === 'TD' || selectedCell.nodeName === 'TH')) {
            let items = closest(selectedCell, 'table').querySelectorAll('.' + CLS_TABLE_SEL);
            for (let i = 0; i < items.length; i++) {
                items[i].style.backgroundColor = args.item.value;
            }
            this.parent.formatter.saveData();
        }
    }
    hideTableQuickToolbar() {
        if (this.quickToolObj && this.quickToolObj.tableQTBar && document.body.contains(this.quickToolObj.tableQTBar.element)) {
            this.quickToolObj.tableQTBar.hidePopup();
        }
    }
    tableHeader(selection, e) {
        this.parent.formatter.process(this.parent, e, e.originalEvent, { selection: selection, subCommand: e.item.subCommand });
    }
    editAreaClickHandler(e) {
        let args = e.args;
        let showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.tableQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            let target = args.target;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            let isPopupOpen = this.quickToolObj.tableQTBar.element.classList.contains('e-rte-pop');
            if (isPopupOpen) {
                return;
            }
            let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
            let closestTable = closest(target, 'table');
            if (target && target.nodeName !== 'A' && target.nodeName !== 'IMG' && (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable)))
                && !(range.startContainer.nodeType === 3 && !range.collapsed)) {
                let range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                let pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
                    this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
                this.quickToolObj.tableQTBar.showPopup(args.pageX, pageY, target);
                this.parent.formatter.editorManager.nodeSelection.restore();
            }
            else {
                this.hideTableQuickToolbar();
            }
        }
    }
    tableCellSelect(e) {
        let target = e.target;
        let row = Array.prototype.slice.call(target.parentElement.parentElement.children).indexOf(target.parentElement);
        let col = Array.prototype.slice.call(target.parentElement.children).indexOf(target);
        let list = this.dlgDiv.querySelectorAll('.e-rte-tablecell');
        Array.prototype.forEach.call(list, (item) => {
            let parentIndex = Array.prototype.slice.call(item.parentElement.parentElement.children).indexOf(item.parentElement);
            let cellIndex = Array.prototype.slice.call(item.parentElement.children).indexOf(item);
            removeClass([item], 'e-active');
            if (parentIndex <= row && cellIndex <= col) {
                addClass([item], 'e-active');
            }
        });
        this.tblHeader.innerHTML = (col + 1) + 'x' + (row + 1);
    }
    tableCellLeave(e) {
        removeClass(this.dlgDiv.querySelectorAll('.e-rte-tablecell'), 'e-active');
        addClass([this.dlgDiv.querySelector('.e-rte-tablecell')], 'e-active');
        this.tblHeader.innerHTML = 1 + 'x' + 1;
    }
    tableCellClick(e) {
        let target = e.target;
        let row = Array.prototype.slice.call(target.parentElement.parentElement.children).indexOf(target.parentElement) + 1;
        let col = Array.prototype.slice.call(target.parentElement.children).indexOf(target) + 1;
        this.self.tableInsert(row, col, e, this);
    }
    tableInsert(row, col, e, selectionObj) {
        let proxy = (selectionObj.self) ? selectionObj.self : this;
        let startContainer = selectionObj.selection.range.startContainer;
        if (startContainer.nodeName === 'P' && startContainer.textContent.trim() === '' && !(startContainer.childNodes.length > 0)) {
            startContainer.innerHTML = '<br />';
        }
        let parentNode = startContainer.parentNode;
        if (proxy.parent.editorMode === 'HTML' &&
            ((proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')) ||
                (!proxy.parent.iframeSettings.enable && isNullOrUndefined(closest(parentNode, '#' + proxy.contentModule.getPanel().id))))) {
            proxy.contentModule.getEditPanel().focus();
            let range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
            selectionObj.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.contentModule.getDocument());
        }
        let value = {
            row: row, columns: col, width: {
                minWidth: proxy.parent.tableSettings.minWidth,
                maxWidth: proxy.parent.tableSettings.maxWidth,
                width: proxy.parent.tableSettings.width,
            },
            selection: selectionObj.selection
        };
        if (proxy.popupObj) {
            proxy.popupObj.hide();
        }
        if (proxy.editdlgObj) {
            proxy.editdlgObj.hide();
        }
        proxy.parent.formatter.process(proxy.parent, selectionObj.args, selectionObj.args.originalEvent, value);
        proxy.contentModule.getEditPanel().focus();
        proxy.parent.on(mouseDown, proxy.cellSelect, proxy);
    }
    cellSelect(e) {
        let target = e.args.target;
        let tdNode = closest(target, 'td,th');
        target = (target.nodeName !== 'TD' && tdNode && this.parent.contentModule.getEditPanel().contains(tdNode)) ?
            tdNode : target;
        removeClass(this.contentModule.getEditPanel().querySelectorAll('table td, table th'), CLS_TABLE_SEL);
        if (target && (target.tagName === 'TD' || target.tagName === 'TH')) {
            target.removeAttribute('class');
            addClass([target], CLS_TABLE_SEL);
            this.curTable = (this.curTable) ? this.curTable : closest(target, 'table');
            this.removeResizeEle();
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper);
            }
        }
    }
    resizeHelper(e) {
        let target = e.target || e.targetTouches[0].target;
        let closestTable = closest(target, 'table');
        if (target.nodeName === 'TABLE' || target.nodeName === 'TD' || target.nodeName === 'TH') {
            this.curTable = (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable))
                && (target.nodeName === 'TD' || target.nodeName === 'TH') ?
                closestTable : target;
            this.removeResizeEle();
            this.tableResizeEleCreation(this.curTable, e);
        }
    }
    tableResizeEleCreation(table, e) {
        this.parent.preventDefaultResize(e);
        let columns = Array.prototype.slice.call(table.rows[0].cells, 1);
        let rows = [];
        for (let i = 0; i < table.rows.length; i++) {
            rows.push(Array.prototype.slice.call(table.rows[i].cells, 0, 1)[0]);
        }
        let height = parseInt(getComputedStyle(table).height, 10);
        let width = parseInt(getComputedStyle(table).width, 10);
        let pos = this.calcPos(table);
        for (let i = 0; columns.length > i; i++) {
            let colReEle = this.parent.createElement('span', {
                className: CLS_TB_COL_RES, attrs: {
                    'data-col': (i + 1).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            colReEle.style.cssText = 'height: ' + height + 'px; width: 4px; top: ' + pos.top +
                'px; left:' + (pos.left + this.calcPos(columns[i]).left) + 'px;';
            this.contentModule.getEditPanel().appendChild(colReEle);
        }
        for (let i = 0; rows.length > i; i++) {
            let rowReEle = this.parent.createElement('span', {
                className: CLS_TB_ROW_RES, attrs: {
                    'data-row': (i).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            rowReEle.style.cssText = 'width: ' + width + 'px; height: 4px; top: ' +
                (this.calcPos(rows[i]).top + pos.top + rows[i].offsetHeight - 2) +
                'px; left:' + (this.calcPos(rows[i]).left + pos.left) + 'px;';
            this.contentModule.getEditPanel().appendChild(rowReEle);
        }
        let tableReBox = this.parent.createElement('span', {
            className: CLS_TB_BOX_RES, attrs: {
                'data-col': columns.length.toString(), 'unselectable': 'on', 'contenteditable': 'false'
            }
        });
        tableReBox.style.cssText = 'top: ' + (pos.top + height - 4) +
            'px; left:' + (pos.left + width - 4) + 'px;';
        if (Browser.isDevice) {
            tableReBox.classList.add('e-rmob');
        }
        this.contentModule.getEditPanel().appendChild(tableReBox);
    }
    removeResizeEle() {
        let item = this.contentModule.getEditPanel().querySelectorAll('.e-column-resize, .e-row-resize, .e-table-box');
        if (item.length > 0) {
            for (let i = 0; i < item.length; i++) {
                detach(item[i]);
            }
        }
    }
    calcPos(elem) {
        let parentOffset = {
            top: 0,
            left: 0
        };
        let offset = elem.getBoundingClientRect();
        let doc = elem.ownerDocument;
        let offsetParent = elem.offsetParent || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            offsetParent.style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent.nodeName === 'TD' && elem.nodeName === 'TABLE') {
            offsetParent = closest(offsetParent, '.e-control');
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = offsetParent.getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    }
    getPointX(e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    }
    getPointY(e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageY;
        }
        else {
            return e.pageY;
        }
    }
    resizeStart(e) {
        if (Browser.isDevice) {
            this.resizeHelper(e);
        }
        let target = e.target;
        if (target.classList.contains(CLS_TB_COL_RES) ||
            target.classList.contains(CLS_TB_ROW_RES) ||
            target.classList.contains(CLS_TB_BOX_RES)) {
            e.preventDefault();
            this.parent.preventDefaultResize(e);
            removeClass(this.curTable.querySelectorAll('td,th'), CLS_TABLE_SEL);
            this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            this.resizeBtnInit();
            this.hideTableQuickToolbar();
            if (target.classList.contains(CLS_TB_COL_RES)) {
                this.resizeBtnStat.column = true;
                this.columnEle = this.curTable.rows[0].cells[parseInt(target.getAttribute('data-col'), 10)];
                this.colIndex = this.columnEle.cellIndex;
                this.moveEle = e.target;
                this.appendHelper();
            }
            if (target.classList.contains(CLS_TB_ROW_RES)) {
                this.rowEle = this.curTable.rows[parseInt(target.getAttribute('data-row'), 10)];
                this.resizeBtnStat.row = true;
                this.appendHelper();
            }
            if (target.classList.contains(CLS_TB_BOX_RES)) {
                this.resizeBtnStat.tableBox = true;
            }
            if (Browser.isDevice && this.helper && !this.helper.classList.contains('e-reicon')) {
                this.helper.classList.add('e-reicon');
                EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
                EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
            }
            else {
                let args = isBlazor() ? { requestType: 'Table' } : { event: e, requestType: 'Table' };
                this.parent.trigger(resizeStart, args, (resizeStartArgs) => {
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }
    removeHelper(e) {
        let cls = e.target.classList;
        if (!(cls.contains('e-reicon')) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper);
            }
            this.pageX = null;
            this.helper = null;
        }
    }
    appendHelper() {
        this.helper = this.parent.createElement('div', {
            className: 'e-table-rhelper'
        });
        if (Browser.isDevice) {
            this.helper.classList.add('e-reicon');
        }
        this.contentModule.getEditPanel().appendChild(this.helper);
        this.setHelperHeight();
    }
    setHelperHeight() {
        let pos = this.calcPos(this.curTable);
        if (this.resizeBtnStat.column) {
            this.helper.classList.add('e-column-helper');
            this.helper.style.cssText = 'height: ' + getComputedStyle(this.curTable).height + '; top: ' +
                pos.top + 'px; left:' + (pos.left + this.calcPos(this.columnEle).left - 1) + 'px;';
        }
        else {
            this.helper.classList.add('e-row-helper');
            this.helper.style.cssText = 'width: ' + getComputedStyle(this.curTable).width + '; top: ' +
                (this.calcPos(this.rowEle).top + pos.top + this.rowEle.offsetHeight) +
                'px; left:' + (this.calcPos(this.rowEle).left + pos.left) + 'px;';
        }
    }
    updateHelper() {
        let pos = this.calcPos(this.curTable);
        if (this.resizeBtnStat.column) {
            let left = pos.left + this.calcPos(this.columnEle).left - 1;
            this.helper.style.left = left + 'px';
        }
        else {
            let top = this.calcPos(this.rowEle).top + pos.top + this.rowEle.offsetHeight;
            this.helper.style.top = top + 'px';
        }
    }
    resizing(e) {
        let pageX = this.getPointX(e);
        let pageY = this.getPointY(e);
        let mouseX = (this.parent.enableRtl) ? -(pageX - this.pageX) : (pageX - this.pageX);
        let mouseY = (this.parent.enableRtl) ? -(pageY - this.pageY) : (pageY - this.pageY);
        this.pageX = pageX;
        this.pageY = pageY;
        let args = isBlazor() ? { requestType: 'table' } : { event: e, requestType: 'table' };
        this.parent.trigger(onResize, args, (resizingArgs) => {
            if (resizingArgs.cancel) {
                this.cancelResizeAction();
            }
            else {
                let tableReBox = this.contentModule.getEditPanel().querySelector('.e-table-box');
                let tableWidth = parseInt(getComputedStyle(this.curTable).width, 10);
                let tableHeight = parseInt(getComputedStyle(this.curTable).height, 10);
                let paddingSize = +getComputedStyle(this.contentModule.getEditPanel()).paddingRight.match(/\d/g).join('');
                let rteWidth = this.contentModule.getEditPanel().offsetWidth - paddingSize * 2;
                if (this.resizeBtnStat.column) {
                    let cellColl = this.curTable.rows[0].cells;
                    let width = parseFloat(this.columnEle.offsetWidth.toLocaleString());
                    let actualwid = width - mouseX;
                    let totalwid = parseFloat(this.columnEle.offsetWidth.toLocaleString()) +
                        parseFloat(cellColl[this.colIndex - 1].offsetWidth.toLocaleString());
                    for (let i = 0; i < this.curTable.rows.length; i++) {
                        if ((totalwid - actualwid) > 20 && actualwid > 20) {
                            let leftColumnWidth = totalwid - actualwid;
                            let rightColWidth = actualwid;
                            this.curTable.rows[i].cells[this.colIndex - 1].style.width =
                                this.convertPixelToPercentage(leftColumnWidth, tableWidth) + '%';
                            this.curTable.rows[i].cells[this.colIndex].style.width =
                                this.convertPixelToPercentage(rightColWidth, tableWidth) + '%';
                        }
                    }
                    this.updateHelper();
                }
                else if (this.resizeBtnStat.row) {
                    this.parent.preventDefaultResize(e);
                    let height = parseFloat(this.rowEle.clientHeight.toString()) + mouseY;
                    if (height > 20) {
                        this.rowEle.style.height = height + 'px';
                    }
                    this.curTable.style.height = '';
                    tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                        'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
                    this.updateHelper();
                }
                else if (this.resizeBtnStat.tableBox) {
                    if (!Browser.isDevice) {
                        EventHandler.remove(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper);
                    }
                    let widthType = this.curTable.style.width.indexOf('%') > -1;
                    this.curTable.style.width = widthType ? this.convertPixelToPercentage(tableWidth + mouseX, rteWidth) + '%'
                        : tableWidth + mouseX + 'px';
                    this.curTable.style.height = tableHeight + mouseY + 'px';
                    tableReBox.classList.add('e-rbox-select');
                    tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                        'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
                }
            }
        });
    }
    convertPixelToPercentage(value, offsetValue) {
        return (value / offsetValue) * 100;
    }
    cancelResizeAction() {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        this.removeResizeEle();
    }
    resizeEnd(e) {
        this.resizeBtnInit();
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.contentModule.getEditPanel().querySelector('.e-table-box') &&
            this.contentModule.getEditPanel().contains(this.contentModule.getEditPanel().querySelector('.e-table-box'))) {
            if (!Browser.isDevice) {
                EventHandler.add(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper, this);
            }
            this.removeResizeEle();
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper);
                this.helper = null;
            }
            this.pageX = null;
            this.pageY = null;
            this.moveEle = null;
        }
        let args = isBlazor() ? { requestType: 'table' } : { event: e, requestType: 'table' };
        this.parent.trigger(resizeStop, args);
        this.parent.formatter.saveData();
    }
    resizeBtnInit() {
        return this.resizeBtnStat = { column: false, row: false, tableBox: false };
    }
    addRow(selectCell, e, tabkey) {
        let cmd;
        if (tabkey) {
            cmd = {
                item: { command: 'Table', subCommand: 'InsertRowAfter' }
            };
        }
        let value = {
            selection: selectCell,
            subCommand: (tabkey) ? cmd.item.subCommand : e.item.subCommand
        };
        this.parent.formatter.process(this.parent, (tabkey) ? cmd : e, e, value);
    }
    addColumn(selectCell, e) {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, width: this.parent.tableSettings.width, subCommand: e.item.subCommand });
    }
    removeRowColumn(selectCell, e) {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: e.item.subCommand });
        this.hideTableQuickToolbar();
    }
    removeTable(selection, args, delKey) {
        let cmd;
        if (delKey) {
            cmd = { item: { command: 'Table', subCommand: 'TableRemove' } };
        }
        let value = {
            selection: selection,
            subCommand: (delKey) ? cmd.item.subCommand : args.item.subCommand
        };
        this.parent.formatter.process(this.parent, (delKey) ? cmd : args, args.originalEvent, value);
        this.contentModule.getEditPanel().focus();
        this.removeResizeEle();
        this.hideTableQuickToolbar();
    }
    renderDlgContent(args) {
        if (Browser.isDevice || this.parent.inlineMode.enable) {
            this.insertTableDialog(args);
            return;
        }
        if (this.popupObj) {
            this.popupObj.hide();
            return;
        }
        this.hideTableQuickToolbar();
        let header = '1X1';
        let insertbtn = this.l10n.getConstant('inserttablebtn');
        this.dlgDiv = this.parent.createElement('div', { className: 'e-rte-table-popup', id: this.rteID + '_table' });
        this.tblHeader = this.parent.createElement('div', { className: 'e-rte-popup-header' });
        this.tblHeader.innerHTML = header;
        this.dlgDiv.appendChild(this.tblHeader);
        let tableDiv = this.parent.createElement('div', { className: 'e-rte-table-span' });
        this.drawTable(tableDiv, args);
        this.dlgDiv.appendChild(tableDiv);
        this.dlgDiv.appendChild(this.parent.createElement('span', { className: 'e-span-border' }));
        let btnEle = this.parent.createElement('button', {
            className: 'e-insert-table-btn', id: this.rteID + '_insertTable',
            attrs: { type: 'button' }
        });
        this.dlgDiv.appendChild(btnEle);
        let button = new Button({
            iconCss: 'e-icons e-create-table', content: insertbtn, cssClass: 'e-flat',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        button.isStringTemplate = true;
        button.appendTo(btnEle);
        EventHandler.add(btnEle, 'click', this.insertTableDialog, { self: this, args: args.args, selection: args.selection });
        this.parent.getToolbar().appendChild(this.dlgDiv);
        let target = args.args.originalEvent.target;
        target = target.classList.contains('e-toolbar-item') ? target.firstChild : target.parentElement;
        this.popupObj = new Popup(this.dlgDiv, {
            targetType: 'relative',
            relateTo: target,
            collision: { X: 'fit', Y: 'none' },
            offsetY: 8,
            viewPortElement: this.parent.element,
            position: { X: 'left', Y: 'bottom' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: (event) => {
                this.parent.isBlur = false;
                this.popupObj.destroy();
                detach(this.popupObj.element);
                this.popupObj = null;
            }
        });
        addClass([this.popupObj.element], 'e-popup-open');
        this.popupObj.refreshPosition(target);
    }
    docClick(e) {
        let target = e.args.target;
        if (target && target.classList && ((this.popupObj && !closest(target, '#' + this.popupObj.element.id) ||
            (this.editdlgObj && !closest(target, '#' + this.editdlgObj.element.id)))) && !target.classList.contains('e-create-table') &&
            target.offsetParent && !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown')) {
            if (this.popupObj) {
                this.popupObj.hide();
            }
            if (this.editdlgObj) {
                this.editdlgObj.hide();
            }
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        let closestEle = closest(target, 'td');
        let isExist = closestEle && this.parent.contentModule.getEditPanel().contains(closestEle) ? true : false;
        if (target && target.tagName !== 'TD' && target.tagName !== 'TH' && !isExist &&
            closest(target, '.e-rte-quick-popup') === null && target.offsetParent &&
            !target.offsetParent.classList.contains('e-quick-dropdown') &&
            !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown') && !closest(target, '.e-rte-dropdown-popup')
            && !closest(target, '.e-rte-elements')) {
            removeClass(this.parent.element.querySelectorAll('table td'), CLS_TABLE_SEL);
            if (!Browser.isIE) {
                this.hideTableQuickToolbar();
            }
        }
        if (target && target.classList && !target.classList.contains(CLS_TB_COL_RES) &&
            !target.classList.contains(CLS_TB_ROW_RES) && !target.classList.contains(CLS_TB_BOX_RES)) {
            this.removeResizeEle();
        }
    }
    drawTable(tableDiv, args) {
        let rowDiv;
        let tableCell;
        for (let row = 0; row < 3; row++) {
            rowDiv = this.parent.createElement('div', { className: 'e-rte-table-row', attrs: { 'data-column': '' + row } });
            for (let col = 0; col < 10; col++) {
                let display = (row > 2) ? 'none' : 'inline-block';
                tableCell = this.parent.createElement('div', { className: 'e-rte-tablecell e-default', attrs: { 'data-cell': '' + col } });
                rowDiv.appendChild(tableCell);
                tableCell.style.display = display;
                if (col === 0 && row === 0) {
                    addClass([tableCell], 'e-active');
                }
                EventHandler.add(tableCell, 'mousemove', this.tableCellSelect, this);
                EventHandler.add(rowDiv, 'mouseleave', this.tableCellLeave, this);
                EventHandler.add(tableCell, 'mouseup', this.tableCellClick, { self: this, args: args.args, selection: args.selection });
            }
            tableDiv.appendChild(rowDiv);
        }
    }
    editTable(args) {
        this.createDialog(args);
        let editContent = this.tableDlgContent(args);
        let update = this.l10n.getConstant('dialogUpdate');
        let cancel = this.l10n.getConstant('dialogCancel');
        let editHeader = this.l10n.getConstant('tableEditHeader');
        this.editdlgObj.setProperties({
            height: 'initial', width: '290px', content: editContent, header: editHeader,
            buttons: [{
                    click: this.applyProperties.bind(this, args),
                    buttonModel: { content: update, cssClass: 'e-flat e-size-update', isPrimary: true }
                },
                {
                    click: (e) => { this.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
                }]
        });
        this.editdlgObj.element.style.maxHeight = 'none';
        this.editdlgObj.content.querySelector('input').focus();
    }
    insertTableDialog(args) {
        let proxy = (this.self) ? this.self : this;
        if (proxy.popupObj) {
            proxy.popupObj.hide();
        }
        proxy.createDialog(args);
        let dlgContent = proxy.tableCellDlgContent();
        let insert = proxy.l10n.getConstant('dialogInsert');
        let cancel = proxy.l10n.getConstant('dialogCancel');
        proxy.editdlgObj.setProperties({
            height: 'initial', width: '290px', content: dlgContent,
            buttons: [{
                    click: proxy.customTable.bind(this, args),
                    buttonModel: { content: insert, cssClass: 'e-flat e-insert-table', isPrimary: true }
                },
                {
                    click: (e) => { proxy.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
                }]
        });
        proxy.editdlgObj.element.style.maxHeight = 'none';
        proxy.editdlgObj.content.querySelector('input').focus();
    }
    tableCellDlgContent() {
        let tableColumn = this.l10n.getConstant('columns');
        let tableRow = this.l10n.getConstant('rows');
        let tableWrap = this.parent.createElement('div', { className: 'e-cell-wrap' });
        let content = '<div class="e-rte-field"><input type="text" '
            + ' data-role ="none" id="tableColumn" class="e-table-column"/></div>'
            + '<div class="e-rte-field"><input type="text" data-role ="none" id="tableRow" class="e-table-row" /></div>';
        let contentElem = parseHtml(content);
        tableWrap.appendChild(contentElem);
        this.columnTextBox = new NumericTextBox({
            format: 'n0',
            min: 1,
            value: 3,
            placeholder: tableColumn,
            floatLabelType: 'Auto',
            max: 50,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.columnTextBox.isStringTemplate = true;
        this.columnTextBox.appendTo(tableWrap.querySelector('#tableColumn'));
        this.rowTextBox = new NumericTextBox({
            format: 'n0',
            min: 1,
            value: 3,
            placeholder: tableRow,
            floatLabelType: 'Auto',
            max: 50,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.rowTextBox.isStringTemplate = true;
        this.rowTextBox.appendTo(tableWrap.querySelector('#tableRow'));
        return tableWrap;
    }
    createDialog(args) {
        if (this.editdlgObj) {
            this.editdlgObj.hide({ returnValue: true });
            return;
        }
        let tableDialog = this.parent.createElement('div', { className: 'e-rte-edit-table', id: this.rteID + '_tabledialog' });
        this.parent.element.appendChild(tableDialog);
        let insert = this.l10n.getConstant('dialogInsert');
        let cancel = this.l10n.getConstant('dialogCancel');
        let header = this.l10n.getConstant('tabledialogHeader');
        let dialogModel = {
            header: header,
            cssClass: CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px', height: 'initial',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: Browser.isDevice,
            buttons: [{
                    buttonModel: { content: insert, cssClass: 'e-flat e-insert-table', isPrimary: true }
                },
                {
                    click: (e) => { this.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
                }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event) => {
                this.parent.isBlur = false;
                this.editdlgObj.destroy();
                detach(this.editdlgObj.element);
                this.dialogRenderObj.close(event);
                this.editdlgObj = null;
            }
        };
        this.editdlgObj = this.dialogRenderObj.render(dialogModel);
        this.editdlgObj.appendTo(tableDialog);
        if (this.quickToolObj && this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
            this.quickToolObj.inlineQTBar.hidePopup();
        }
    }
    customTable(args, e) {
        let proxy = (this.self) ? this.self : this;
        if (proxy.rowTextBox.value && proxy.columnTextBox.value) {
            let argument = ((Browser.isDevice || (!isNullOrUndefined(args.args)
                && !isNullOrUndefined(args.args.originalEvent) &&
                args.args.originalEvent.action === 'insert-table')
                || proxy.parent.inlineMode.enable) ? args : this);
            proxy.tableInsert(proxy.rowTextBox.value, proxy.columnTextBox.value, e, argument);
        }
    }
    cancelDialog(e) {
        this.parent.isBlur = false;
        this.editdlgObj.hide({ returnValue: true });
    }
    applyProperties(args, e) {
        let dialogEle = this.editdlgObj.element;
        let table = closest(args.selectNode[0], 'table');
        table.style.width = dialogEle.querySelector('.e-table-width').value + 'px';
        table.cellPadding = dialogEle.querySelector('.e-cell-padding').value;
        table.cellSpacing = dialogEle.querySelector('.e-cell-spacing').value;
        this.parent.formatter.saveData();
        this.editdlgObj.hide({ returnValue: true });
    }
    tableDlgContent(e) {
        let selectNode = e.selectParent[0];
        let tableWidth = this.l10n.getConstant('tableWidth');
        let cellPadding = this.l10n.getConstant('cellpadding');
        let cellSpacing = this.l10n.getConstant('cellspacing');
        let tableWrap = this.parent.createElement('div', { className: 'e-table-sizewrap' });
        let widthVal = closest(selectNode, 'table').getClientRects()[0].width;
        let content = '<div class="e-rte-field"><input type="text" data-role ="none" id="tableWidth" class="e-table-width" '
            + ' /></div>' + '<div class="e-rte-field"><input type="text" data-role ="none" id="cellPadding" class="e-cell-padding" />'
            + ' </div><div class="e-rte-field"><input type="text" data-role ="none" id="cellSpacing" class="e-cell-spacing" /></div>';
        let contentElem = parseHtml(content);
        tableWrap.appendChild(contentElem);
        let widthNum = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: widthVal,
            placeholder: tableWidth,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.isStringTemplate = true;
        widthNum.appendTo(tableWrap.querySelector('#tableWidth'));
        let padding = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: 0,
            placeholder: cellPadding,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        padding.isStringTemplate = true;
        padding.appendTo(tableWrap.querySelector('#cellPadding'));
        let spacing = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: 0,
            placeholder: cellSpacing,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        spacing.isStringTemplate = true;
        spacing.appendTo(tableWrap.querySelector('#cellSpacing'));
        return tableWrap;
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'table';
    }
}

/**
 * Models
 */

/** @hidden  */
const executeGroup = {
    'bold': {
        command: 'Style',
        subCommand: 'Bold',
        value: 'strong'
    },
    'italic': {
        command: 'Style',
        subCommand: 'Italic',
        value: 'em'
    },
    'underline': {
        command: 'Style',
        subCommand: 'Underline',
        value: 'span'
    },
    'strikeThrough': {
        command: 'Style',
        subCommand: 'StrikeThrough',
        value: 'span'
    },
    'superscript': {
        command: 'Effects',
        subCommand: 'SuperScript',
        value: 'sup'
    },
    'subscript': {
        command: 'Effects',
        subCommand: 'SubScript',
        value: 'sub'
    },
    'uppercase': {
        command: 'Casing',
        subCommand: 'UpperCase'
    },
    'lowercase': {
        command: 'Casing',
        subCommand: 'LowerCase'
    },
    'fontColor': {
        command: 'font',
        subCommand: 'fontcolor',
        value: '#ff0000'
    },
    'fontName': {
        command: 'font',
        subCommand: 'fontname',
        value: 'Segoe UI'
    },
    'fontSize': {
        command: 'font',
        subCommand: 'fontsize',
        value: '10pt'
    },
    'backColor': {
        command: 'font',
        subCommand: 'backgroundcolor',
        value: '#ffff00'
    },
    'justifyCenter': {
        command: 'Alignments',
        subCommand: 'JustifyCenter'
    },
    'justifyFull': {
        command: 'Alignments',
        subCommand: 'JustifyFull'
    },
    'justifyLeft': {
        command: 'Alignments',
        subCommand: 'JustifyLeft'
    },
    'justifyRight': {
        command: 'Alignments',
        subCommand: 'JustifyRight'
    },
    'undo': {
        command: 'Actions',
        subCommand: 'Undo'
    },
    'redo': {
        command: 'Actions',
        subCommand: 'Redo'
    },
    'createLink': {
        command: 'Links',
        subCommand: 'createLink'
    },
    'createImage': {
        command: 'Images',
        subCommand: 'Images'
    },
    'formatBlock': {
        command: 'Formats',
        value: 'P'
    },
    'heading': {
        command: 'Formats',
        value: 'H1'
    },
    'indent': {
        command: 'Indents',
        subCommand: 'Indent'
    },
    'outdent': {
        command: 'Indents',
        subCommand: 'Outdent'
    },
    'insertHTML': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: ''
    },
    'insertText': {
        command: 'InsertText',
        subCommand: 'InsertText',
        value: ''
    },
    'insertHorizontalRule': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<hr/>'
    },
    'insertImage': {
        command: 'Images',
        subCommand: 'Image',
    },
    'insertBrOnReturn': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<br/>'
    },
    'insertOrderedList': {
        command: 'Lists',
        value: 'OL'
    },
    'insertUnorderedList': {
        command: 'Lists',
        value: 'UL'
    },
    'insertParagraph': {
        command: 'Formats',
        value: 'P'
    },
    'removeFormat': {
        command: 'Clear',
        subCommand: 'ClearFormat'
    }
};

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const predefinedItems = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments',
    'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo'];
const fontFamily = [
    { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
    { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
    { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' },
    { text: 'Impact', value: 'Impact,Charcoal,sans-serif', cssClass: 'e-impact' },
    { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif', cssClass: 'e-tahoma' },
    { text: 'Times New Roman', value: 'Times New Roman,Times,serif', cssClass: 'e-times-new-roman' },
    { text: 'Verdana', value: 'Verdana,Geneva,sans-serif', cssClass: 'e-verdana' }
];
const fontSize = [
    { text: '8 pt', value: '8pt' },
    { text: '10 pt', value: '10pt' },
    { text: '12 pt', value: '12pt' },
    { text: '14 pt', value: '14pt' },
    { text: '18 pt', value: '18pt' },
    { text: '24 pt', value: '24pt' },
    { text: '36 pt', value: '36pt' }
];
const formatItems = [
    { text: 'Paragraph', value: 'P', cssClass: 'e-paragraph' },
    { text: 'Code', value: 'Pre', cssClass: 'e-code' },
    { text: 'Quotation', value: 'BlockQuote', cssClass: 'e-quote' },
    { text: 'Heading 1', value: 'H1', cssClass: 'e-h1' },
    { text: 'Heading 2', value: 'H2', cssClass: 'e-h2' },
    { text: 'Heading 3', value: 'H3', cssClass: 'e-h3' },
    { text: 'Heading 4', value: 'H4', cssClass: 'e-h4' }
];
const fontColor = {
    'Custom': [
        '', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
        '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
        '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
        '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
        '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
        '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000'
    ]
};
const backgroundColor = {
    'Custom': [
        '', '#000000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff0000', '#000080', '#800080', '#996633',
        '#f2f2f2', '#808080', '#ffffcc', '#b3ffb3', '#ccffff', '#ccccff', '#ffcccc', '#ccccff', '#ff80ff', '#f2e6d9',
        '#d9d9d9', '#595959', '#ffff80', '#80ff80', '#b3ffff', '#8080ff', '#ff8080', '#8080ff', '#ff00ff', '#dfbf9f',
        '#bfbfbf', '#404040', '#ffff33', '#33ff33', '#33ffff', '#3333ff', '#ff3333', '#0000b3', '#b300b3', '#c68c53',
        '#a6a6a6', '#262626', '#e6e600', '#00b300', '#009999', '#000099', '#b30000', '#000066', '#660066', '#86592d',
        '#7f7f7f', '#0d0d0d', '#999900', '#006600', '#006666', '#000066', '#660000', '#00004d', '#4d004d', '#734d26',
    ]
};
/**
 * Configures the toolbar settings of the RichTextEditor.
 */
class ToolbarSettings extends ChildProperty {
}
__decorate$2([
    Property(true)
], ToolbarSettings.prototype, "enable", void 0);
__decorate$2([
    Property(true)
], ToolbarSettings.prototype, "enableFloating", void 0);
__decorate$2([
    Property(ToolbarType.Expand)
], ToolbarSettings.prototype, "type", void 0);
__decorate$2([
    Property(predefinedItems)
], ToolbarSettings.prototype, "items", void 0);
__decorate$2([
    Property({})
], ToolbarSettings.prototype, "itemConfigs", void 0);
/**
 * Configures the image settings of the RichTextEditor.
 */
class ImageSettings extends ChildProperty {
}
__decorate$2([
    Property(['.jpeg', '.jpg', '.png'])
], ImageSettings.prototype, "allowedTypes", void 0);
__decorate$2([
    Property('inline')
], ImageSettings.prototype, "display", void 0);
__decorate$2([
    Property('Blob')
], ImageSettings.prototype, "saveFormat", void 0);
__decorate$2([
    Property('auto')
], ImageSettings.prototype, "width", void 0);
__decorate$2([
    Property('auto')
], ImageSettings.prototype, "height", void 0);
__decorate$2([
    Property(null)
], ImageSettings.prototype, "saveUrl", void 0);
__decorate$2([
    Property(null)
], ImageSettings.prototype, "path", void 0);
__decorate$2([
    Property(true)
], ImageSettings.prototype, "resize", void 0);
__decorate$2([
    Property(0)
], ImageSettings.prototype, "minWidth", void 0);
__decorate$2([
    Property(null)
], ImageSettings.prototype, "maxWidth", void 0);
__decorate$2([
    Property(0)
], ImageSettings.prototype, "minHeight", void 0);
__decorate$2([
    Property(null)
], ImageSettings.prototype, "maxHeight", void 0);
__decorate$2([
    Property(false)
], ImageSettings.prototype, "resizeByPercent", void 0);
class TableSettings extends ChildProperty {
}
__decorate$2([
    Property('100%')
], TableSettings.prototype, "width", void 0);
__decorate$2([
    Property(TableStyleItems)
], TableSettings.prototype, "styles", void 0);
__decorate$2([
    Property(true)
], TableSettings.prototype, "resize", void 0);
__decorate$2([
    Property(0)
], TableSettings.prototype, "minWidth", void 0);
__decorate$2([
    Property(null)
], TableSettings.prototype, "maxWidth", void 0);
/**
 * Configures the quick toolbar settings of the RichTextEditor.
 */
class QuickToolbarSettings extends ChildProperty {
}
__decorate$2([
    Property(true)
], QuickToolbarSettings.prototype, "enable", void 0);
__decorate$2([
    Property(false)
], QuickToolbarSettings.prototype, "showOnRightClick", void 0);
__decorate$2([
    Property('hide')
], QuickToolbarSettings.prototype, "actionOnScroll", void 0);
__decorate$2([
    Property(['Open', 'Edit', 'UnLink'])
], QuickToolbarSettings.prototype, "link", void 0);
__decorate$2([
    Property(['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink', 'OpenImageLink', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension'])
], QuickToolbarSettings.prototype, "image", void 0);
__decorate$2([
    Property(['Cut', 'Copy', 'Paste'])
], QuickToolbarSettings.prototype, "text", void 0);
__decorate$2([
    Property(['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles'])
], QuickToolbarSettings.prototype, "table", void 0);
/**
 * Configures the Paste Cleanup settings of the RichTextEditor.
 */
class PasteCleanupSettings extends ChildProperty {
}
__decorate$2([
    Property(false)
], PasteCleanupSettings.prototype, "prompt", void 0);
__decorate$2([
    Property(null)
], PasteCleanupSettings.prototype, "deniedAttrs", void 0);
__decorate$2([
    Property(['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width'])
], PasteCleanupSettings.prototype, "allowedStyleProps", void 0);
__decorate$2([
    Property(null)
], PasteCleanupSettings.prototype, "deniedTags", void 0);
__decorate$2([
    Property(true)
], PasteCleanupSettings.prototype, "keepFormat", void 0);
__decorate$2([
    Property(false)
], PasteCleanupSettings.prototype, "plainText", void 0);
/**
 * Configures the font family settings of the RichTextEditor.
 */
class FontFamily extends ChildProperty {
}
__decorate$2([
    Property(null)
], FontFamily.prototype, "default", void 0);
__decorate$2([
    Property('65px')
], FontFamily.prototype, "width", void 0);
__decorate$2([
    Property(fontFamily)
], FontFamily.prototype, "items", void 0);
/**
 * Configures the font size settings of the RichTextEditor.
 */
class FontSize extends ChildProperty {
}
__decorate$2([
    Property(null)
], FontSize.prototype, "default", void 0);
__decorate$2([
    Property('35px')
], FontSize.prototype, "width", void 0);
__decorate$2([
    Property(fontSize)
], FontSize.prototype, "items", void 0);
/**
 * Configures the format settings of the RichTextEditor.
 */
class Format extends ChildProperty {
}
__decorate$2([
    Property(null)
], Format.prototype, "default", void 0);
__decorate$2([
    Property('65px')
], Format.prototype, "width", void 0);
__decorate$2([
    Property(formatItems)
], Format.prototype, "types", void 0);
/**
 * Configures the font Color settings of the RichTextEditor.
 */
class FontColor extends ChildProperty {
}
__decorate$2([
    Property('#ff0000')
], FontColor.prototype, "default", void 0);
__decorate$2([
    Property('Palette')
], FontColor.prototype, "mode", void 0);
__decorate$2([
    Property(10)
], FontColor.prototype, "columns", void 0);
__decorate$2([
    Property(fontColor)
], FontColor.prototype, "colorCode", void 0);
__decorate$2([
    Property(false)
], FontColor.prototype, "modeSwitcher", void 0);
/**
 * Configures the background Color settings of the RichTextEditor.
 */
class BackgroundColor extends ChildProperty {
}
__decorate$2([
    Property('#ffff00')
], BackgroundColor.prototype, "default", void 0);
__decorate$2([
    Property('Palette')
], BackgroundColor.prototype, "mode", void 0);
__decorate$2([
    Property(10)
], BackgroundColor.prototype, "columns", void 0);
__decorate$2([
    Property(backgroundColor)
], BackgroundColor.prototype, "colorCode", void 0);
__decorate$2([
    Property(false)
], BackgroundColor.prototype, "modeSwitcher", void 0);

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Objects used for configuring the iframe resources properties.
 */
class Resources extends ChildProperty {
}
__decorate$3([
    Property([])
], Resources.prototype, "styles", void 0);
__decorate$3([
    Property([])
], Resources.prototype, "scripts", void 0);
/**
 * Configures the iframe settings of the RTE.
 */
class IFrameSettings extends ChildProperty {
}
__decorate$3([
    Property(false)
], IFrameSettings.prototype, "enable", void 0);
__decorate$3([
    Property(null)
], IFrameSettings.prototype, "attributes", void 0);
__decorate$3([
    Complex({}, Resources)
], IFrameSettings.prototype, "resources", void 0);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the inlineMode property of the RTE.
 */
class InlineMode extends ChildProperty {
}
__decorate$4([
    Property(false)
], InlineMode.prototype, "enable", void 0);
__decorate$4([
    Property(true)
], InlineMode.prototype, "onSelection", void 0);

function setAttributes(htmlAttributes, rte, isFrame, initial) {
    let target;
    if (isFrame) {
        let iFrame = rte.contentModule.getDocument();
        target = iFrame.querySelector('body');
    }
    else {
        target = rte.element;
    }
    if (Object.keys(htmlAttributes).length) {
        for (let htmlAttr of Object.keys(htmlAttributes)) {
            if (htmlAttr === 'class') {
                target.classList.add(htmlAttributes[htmlAttr]);
            }
            else if (htmlAttr === 'disabled' && htmlAttributes[htmlAttr] === 'disabled') {
                rte.enabled = false;
                rte.setEnable();
            }
            else if (htmlAttr === 'readonly' && htmlAttributes[htmlAttr] === 'readonly') {
                rte.readonly = true;
                rte.setReadOnly(initial);
            }
            else if (htmlAttr === 'style') {
                target.setAttribute('style', htmlAttributes[htmlAttr]);
            }
            else if (htmlAttr === 'tabindex') {
                rte.inputElement.setAttribute('tabindex', htmlAttributes[htmlAttr]);
            }
            else if (htmlAttr === 'placeholder') {
                rte.placeholder = htmlAttributes[htmlAttr];
                rte.setPlaceHolder();
            }
            else {
                let validateAttr = ['name', 'required'];
                if (validateAttr.indexOf(htmlAttr) > -1) {
                    rte.valueContainer.setAttribute(htmlAttr, htmlAttributes[htmlAttr]);
                }
                else {
                    target.setAttribute(htmlAttr, htmlAttributes[htmlAttr]);
                }
            }
        }
    }
}

/**
 * `FullScreen` module is used to maximize and minimize screen
 */
class FullScreen {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    showFullScreen(event) {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown') {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        this.scrollableParent = getScrollableParent(this.parent.element);
        if (!this.parent.element.classList.contains(CLS_FULL_SCREEN)) {
            this.parent.trigger(actionBegin, { requestType: 'Maximize', targetItem: 'Maximize', args: event });
            if (this.parent.toolbarSettings.enableFloating &&
                !this.parent.inlineMode.enable && this.parent.toolbarSettings.enable) {
                this.parent.getToolbarElement().style.width = '100%';
                this.parent.getToolbarElement().style.top = '0px';
            }
            this.parent.element.classList.add(CLS_FULL_SCREEN);
            this.toggleParentOverflow(true);
            this.parent.setContentHeight();
            if (this.parent.toolbarModule) {
                if (!this.parent.getBaseToolbarObject().toolbarObj.items[0].properties) {
                    this.parent.getBaseToolbarObject().toolbarObj.removeItems(0);
                }
                if (Browser.isDevice) {
                    this.parent.toolbarModule.removeFixedTBarClass();
                }
                this.parent.toolbarModule.updateItem({
                    targetItem: 'Maximize',
                    updateItem: 'Minimize',
                    baseToolbar: this.parent.getBaseToolbarObject()
                });
            }
            this.parent.trigger(actionComplete, { requestType: 'Maximize', targetItem: 'Maximize', args: event });
        }
    }
    hideFullScreen(event) {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown') {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        if (this.parent.element.classList.contains(CLS_FULL_SCREEN)) {
            this.parent.element.classList.remove(CLS_FULL_SCREEN);
            let elem = document.querySelectorAll('.e-rte-overflow');
            for (let i = 0; i < elem.length; i++) {
                removeClass([elem[i]], ['e-rte-overflow']);
            }
            this.parent.trigger(actionBegin, { requestType: 'Minimize', targetItem: 'Minimize', args: event });
            this.parent.setContentHeight();
            if (this.parent.toolbarModule) {
                if (!this.parent.getBaseToolbarObject().toolbarObj.items[0].properties) {
                    this.parent.getBaseToolbarObject().toolbarObj.removeItems(0);
                }
                this.parent.toolbarModule.updateItem({
                    targetItem: 'Minimize',
                    updateItem: 'Maximize',
                    baseToolbar: this.parent.getBaseToolbarObject()
                });
                if (Browser.isDevice && this.parent.inlineMode.enable) {
                    this.parent.toolbarModule.addFixedTBarClass();
                }
            }
            this.parent.trigger(actionComplete, { requestType: 'Minimize', targetItem: 'Minimize', args: event });
        }
    }
    toggleParentOverflow(isAdd) {
        if (isNullOrUndefined(this.scrollableParent)) {
            return;
        }
        for (let i = 0; i < this.scrollableParent.length; i++) {
            if (this.scrollableParent[i].nodeName === '#document') {
                let elem = document.querySelector('body');
                addClass([elem], ['e-rte-overflow']);
            }
            else {
                let elem = this.scrollableParent[i];
                addClass([elem], ['e-rte-overflow']);
            }
        }
    }
    onKeyDown(event) {
        let originalEvent = event.args;
        switch (originalEvent.action) {
            case 'full-screen':
                this.showFullScreen(event.args);
                originalEvent.preventDefault();
                break;
            case 'escape':
                this.hideFullScreen(event.args);
                originalEvent.preventDefault();
                break;
        }
    }
    addEventListener() {
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.on(destroy, this.destroy, this);
    }
    removeEventListener() {
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.off(destroy, this.removeEventListener);
    }
    destroy() {
        if (this.parent.element.classList.contains(CLS_FULL_SCREEN)) {
            this.toggleParentOverflow(false);
        }
        this.removeEventListener();
    }
}

/**
 * Dialog Renderer
 */
class DialogRenderer {
    constructor(parent) {
        this.parent = parent;
    }
    render(e) {
        let dlgObj;
        if (isNullOrUndefined(e.beforeOpen)) {
            e.beforeOpen = this.beforeOpen.bind(this);
        }
        if (isNullOrUndefined(e.open)) {
            e.open = this.open.bind(this);
        }
        if (isNullOrUndefined(e.close)) {
            e.close = this.close.bind(this);
        }
        dlgObj = new Dialog(e);
        dlgObj.isStringTemplate = true;
        return dlgObj;
    }
    beforeOpen(args) {
        this.parent.trigger(beforeDialogOpen, args);
    }
    open(args) {
        this.parent.trigger(dialogOpen, args);
    }
    close(args) {
        this.parent.trigger(dialogClose, args);
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the RichTextEditor component.
 * ```html
 * <textarea id="rte"></textarea>
 * <script>
 *  var rteObj = new RichTextEditor();
 *  rteObj.appendTo("#rte");
 * </script>
 * ```
 */
let RichTextEditor = class RichTextEditor extends Component {
    constructor(options, element) {
        super(options, element);
        this.defaultResetValue = null;
        /**
         * @hidden
         */
        this.isFocusOut = false;
        /**
         * @hidden
         */
        this.isRTE = false;
        /**
         * @hidden
         */
        this.isBlur = true;
        this.needsID = true;
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        if (this.toolbarSettings.enable) {
            modules.push({ member: 'toolbar', args: [this, this.serviceLocator] });
            modules.push({
                member: 'link',
                args: [this, this.serviceLocator]
            });
            modules.push({
                member: 'table',
                args: [this, this.serviceLocator]
            });
            modules.push({
                member: 'image',
                args: [this, this.serviceLocator]
            });
            if (this.quickToolbarSettings.enable) {
                modules.push({ member: 'quickToolbar', args: [this, this.serviceLocator] });
            }
        }
        if (this.showCharCount) {
            modules.push({ member: 'count', args: [this, this.serviceLocator] });
        }
        if (this.editorMode === 'Markdown') {
            modules.push({ member: 'markdownEditor', args: [this, this.serviceLocator] });
        }
        if (this.editorMode === 'HTML') {
            modules.push({ member: 'htmlEditor', args: [this, this.serviceLocator] });
            modules.push({ member: 'pasteCleanup', args: [this, this.serviceLocator] });
        }
        return modules;
    }
    updateEnable() {
        if (this.enabled) {
            removeClass([this.element], CLS_DISABLED);
            this.element.setAttribute('aria-disabled', 'false');
            if (!isNullOrUndefined(this.htmlAttributes.tabindex)) {
                this.inputElement.setAttribute('tabindex', this.htmlAttributes.tabindex);
            }
            else {
                this.inputElement.setAttribute('tabindex', '0');
            }
        }
        else {
            if (this.getToolbar()) {
                removeClass(this.getToolbar().querySelectorAll('.' + CLS_ACTIVE), CLS_ACTIVE);
                removeClass([this.getToolbar()], [CLS_TB_FLOAT, CLS_TB_ABS_FLOAT]);
            }
            addClass([this.element], CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
            this.inputElement.setAttribute('tabindex', '-1');
        }
    }
    setEnable() {
        this.updateEnable();
        (this.enabled) ? this.eventInitializer() : this.unWireEvents();
    }
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    preRender() {
        this.onBlurHandler = this.blurHandler.bind(this);
        this.onFocusHandler = this.focusHandler.bind(this);
        this.onResizeHandler = this.resizeHandler.bind(this);
        this.clickPoints = { clientX: 0, clientY: 0 };
        this.initialValue = this.value;
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
        this.setContainer();
        this.persistData();
        setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        attributes(this.element, { role: 'application' });
    }
    persistData() {
        if (this.enablePersistence && this.originalElement.tagName === 'TEXTAREA') {
            let data = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(isNullOrUndefined(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        }
    }
    ;
    setContainer() {
        this.originalElement = this.element.cloneNode(true);
        if (this.value === null || this.valueTemplate !== null) {
            this.setValue();
        }
        if (this.element.hasAttribute('tabindex')) {
            this.htmlAttributes = { 'tabindex': this.element.getAttribute('tabindex') };
            this.element.removeAttribute('tabindex');
        }
        if (!this.isBlazor()) {
            this.element.innerHTML = '';
        }
        let invalidAttr = ['class', 'style', 'id', 'ejs-for'];
        let htmlAttr = {};
        for (let a = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(/^data-val/.test(this.element.attributes[a].name))) { // data-val for asp.net core data annotation validation.
                htmlAttr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(htmlAttr, this.htmlAttributes, htmlAttr);
        this.setProperties({ htmlAttributes: htmlAttr }, true);
        if (!isNullOrUndefined(this.htmlAttributes.id)) {
            this.element.id = this.htmlAttributes.id;
        }
        if (this.element.tagName === 'TEXTAREA') {
            let rteOuterWrapper = this.createElement('div', {
                className: this.element.getAttribute('class')
            });
            if (!this.isBlazor()) {
                this.element.innerHTML = '';
            }
            this.element.parentElement.insertBefore(rteOuterWrapper, this.element);
            this.valueContainer = this.element;
            removeClass([this.valueContainer], this.element.getAttribute('class').split(' '));
            this.element = rteOuterWrapper;
        }
        else {
            this.valueContainer = this.createElement('textarea', {
                id: this.getID() + '-value'
            });
        }
        this.valueContainer.name = this.getID();
        addClass([this.valueContainer], CLS_RTE_HIDDEN);
        this.element.appendChild(this.valueContainer);
    }
    getPersistData() {
        return this.addOnPersist(['value']);
    }
    /**
     * Focuses the RichTextEditor component
     * @public
     */
    focusIn() {
        if (this.enabled) {
            this.inputElement.focus();
            this.focusHandler({});
        }
    }
    /**
     * Blurs the RichTextEditor component
     * @public
     */
    focusOut() {
        if (this.enabled) {
            this.inputElement.blur();
            this.blurHandler({});
        }
    }
    /**
     * Selects all the content in RichTextEditor
     * @public
     */
    selectAll() {
        this.notify(selectAll$1, {});
    }
    /**
     * Selects a content range or an element
     * @param {Range} range - Specify the range which you want to select within the content.
     * The method used to select a particular sentence or word or entire document.
     * @public
     */
    selectRange(range) {
        this.notify(selectRange, { range: range });
    }
    /**
     * Retrieves the HTML markup content from currently selected content of RichTextEditor.
     * @public
     */
    getSelection() {
        let str = '';
        this.notify(getSelectedHtml, {
            callBack: (txt) => {
                str = txt;
            }
        });
        return str;
    }
    /**
     * Executes the commands
     * @param {CommandName} CommandName - Specifies the name of the command to be executed.
     * @param {string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs} value - Specifies the value that you want to execute.
     * @public
     */
    executeCommand(commandName, value) {
        value = this.htmlPurifier(commandName, value);
        if (this.editorMode === 'HTML') {
            let range = this.getRange();
            if (this.iframeSettings.enable) {
                this.formatter.editorManager.nodeSelection.Clear(this.element.ownerDocument);
            }
            let toFocus = (this.iframeSettings.enable &&
                range.startContainer === this.inputElement) ? true : !this.inputElement.contains(range.startContainer);
            if (toFocus) {
                this.focusIn();
            }
        }
        let tool = executeGroup[commandName];
        this.formatter.editorManager.execCommand(tool.command, tool.subCommand ? tool.subCommand : (value ? value : tool.value), null, null, (value ? value : tool.value), (value ? value : tool.value));
    }
    htmlPurifier(command, value) {
        if (this.editorMode === 'HTML') {
            switch (command) {
                case 'insertHTML':
                    if (typeof value === 'string') {
                        value = this.htmlEditorModule.sanitizeHelper(value);
                    }
                    else {
                        value = this.htmlEditorModule.sanitizeHelper(value.outerHTML);
                    }
                    break;
                case 'insertImage':
                    let temp = this.createElement('img', {
                        attrs: {
                            src: value.url
                        }
                    });
                    let imageValue = this.htmlEditorModule.sanitizeHelper(temp.outerHTML);
                    let url = (imageValue !== '' && (this.createElement('div', {
                        innerHTML: imageValue
                    }).firstElementChild).getAttribute('src')) || null;
                    url = !isNullOrUndefined(url) ? url : '';
                    value.url = url;
                    break;
                case 'createLink':
                    let tempNode = this.createElement('a', {
                        attrs: {
                            href: value.url
                        }
                    });
                    let linkValue = this.htmlEditorModule.sanitizeHelper(tempNode.outerHTML);
                    let href = (linkValue !== '' && (this.createElement('div', {
                        innerHTML: linkValue
                    }).firstElementChild).getAttribute('href')) || null;
                    href = !isNullOrUndefined(href) ? href : '';
                    value.url = href;
                    break;
            }
        }
        return value;
    }
    encode(value) {
        let divNode = this.createElement('div');
        divNode.innerText = value.trim();
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    render() {
        if (this.value && !this.valueTemplate) {
            this.setProperties({ value: this.serializeValue(this.value) }, true);
        }
        this.renderModule = new Render(this, this.serviceLocator);
        this.sourceCodeModule = new ViewSource(this, this.serviceLocator);
        this.notify(initialLoad, {});
        this.trigger(load);
        this.RTERender();
        let execCommandCallBack$$1 = new ExecCommandCallBack(this);
        this.notify(initialEnd, {});
        if (this.toolbarSettings.enable && this.toolbarSettings.type === 'Expand' && !isNullOrUndefined(this.getToolbar()) &&
            (this.toolbarSettings.items.indexOf('Undo') > -1 && this.toolbarSettings.items.indexOf('Redo') > -1)) {
            this.disableToolbarItem(['Undo', 'Redo']);
        }
        this.setContentHeight();
        if (this.value !== null) {
            if (!this.isBlazor()) {
                this.valueContainer.defaultValue = this.value;
            }
            else {
                this.defaultResetValue = this.value;
            }
        }
        (!this.enabled) ? this.unWireEvents() : this.eventInitializer();
        this.renderComplete();
    }
    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    eventInitializer() {
        this.wireEvents();
    }
    /**
     * For internal use only - keydown the event handler;
     * @private
     */
    keyDown(e) {
        this.notify(keyDown, { member: 'keydown', args: e });
        this.restrict(e);
        if (this.formatter.getUndoRedoStack().length === 0) {
            this.formatter.saveData();
        }
        if (e.action && e.action !== 'paste' || e.which === 9) {
            this.formatter.process(this, null, e);
            switch (e.action) {
                case 'toolbar-focus':
                    if (this.toolbarSettings.enable) {
                        let selector = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
                        this.toolbarModule.baseToolbar.toolbarObj.element.querySelector(selector).focus();
                    }
                    break;
                case 'escape':
                    this.contentModule.getEditPanel().focus();
                    break;
            }
        }
        if (!isNullOrUndefined(this.placeholder)) {
            this.setPlaceHolder();
        }
        this.autoResize();
    }
    keyUp(e) {
        this.notify(keyUp, { member: 'keyup', args: e });
        let allowedKeys = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46;
        if (((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys) || (this.editorMode === 'Markdown'
            && ((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys)) && !this.inlineMode.enable) {
            this.formatter.onKeyHandler(this, e);
        }
        if (this.inputElement && this.inputElement.textContent.length !== 0) {
            this.notify(toolbarRefresh, { args: e });
        }
        if (!isNullOrUndefined(this.placeholder)) {
            this.setPlaceHolder();
        }
    }
    /**
     * @hidden
     */
    serializeValue(value) {
        if (this.editorMode === 'HTML' && !isNullOrUndefined(value)) {
            if (this.enableHtmlEncode) {
                value = this.htmlEditorModule.sanitizeHelper(decode(value));
                value = this.encode(value);
            }
            else {
                value = this.htmlEditorModule.sanitizeHelper(value);
            }
        }
        return value;
    }
    /**
     * This method will clean up the HTML against cross-site scripting attack and return the HTML as string.
     * It's only applicable to editorMode as `HTML`.
     * @param {string} value - Specifies the value that you want to sanitize.
     * @return {string}
     */
    sanitizeHtml(value) {
        return this.serializeValue(value);
    }
    updateValue(value) {
        if (isNullOrUndefined(value)) {
            let inputVal = this.inputElement.innerHTML;
            this.setProperties({ value: isEditableValueEmpty(inputVal) ? null : inputVal });
        }
        else {
            this.setProperties({ value: value });
        }
    }
    triggerEditArea(e) {
        if (!isIDevice()) {
            this.notify(editAreaClick, { member: 'editAreaClick', args: e });
        }
        else {
            let touch = (e.touches ? e.changedTouches[0] : e);
            if (this.clickPoints.clientX === touch.clientX && this.clickPoints.clientY === touch.clientY) {
                this.notify(editAreaClick, { member: 'editAreaClick', args: e });
            }
        }
    }
    notifyMouseUp(e) {
        let touch = (e.touches ? e.changedTouches[0] : e);
        this.notify(mouseUp, { member: 'mouseUp', args: e,
            touchData: { prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && this.inputElement.textContent.length !== 0) ||
            (this.editorMode === 'Markdown' && this.inputElement.value.length !== 0))) {
            this.notify(toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
    }
    mouseUp(e) {
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            let target = e.target;
            let closestTable = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.contentModule.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
    }
    /**
     * @hidden
     */
    ensureModuleInjected(module) {
        return this.getInjectedModules().indexOf(module) >= 0;
    }
    /**
     * @hidden
     */
    onCopy() {
        this.contentModule.getDocument().execCommand('copy', false, null);
    }
    /**
     * @hidden
     */
    onCut() {
        this.contentModule.getDocument().execCommand('cut', false, null);
    }
    /**
     * @hidden
     */
    onPaste(e) {
        let evenArgs = {
            originalEvent: e,
            cancel: false,
            requestType: 'Paste'
        };
        this.trigger(actionBegin, evenArgs, (pasteArgs) => {
            let currentLength = this.getText().length;
            let selectionLength = this.getSelection().length;
            let pastedContentLength = (isNullOrUndefined(e) || isNullOrUndefined(e.clipboardData))
                ? 0 : e.clipboardData.getData('text/plain').length;
            let totalLength = (currentLength - selectionLength) + pastedContentLength;
            if (!pasteArgs.cancel && (this.maxLength === -1 || totalLength < this.maxLength)) {
                if (!isNullOrUndefined(this.pasteCleanupModule)) {
                    this.notify(pasteClean, { args: e });
                }
                else {
                    let args = { requestType: 'Paste', editorMode: this.editorMode, event: e };
                    let value = null;
                    if (e && !isNullOrUndefined(e.clipboardData)) {
                        value = e.clipboardData.getData('text/plain');
                    }
                    let file = e && e.clipboardData && e.clipboardData.items.length > 0 ?
                        e.clipboardData.items[0].getAsFile() : null;
                    if (value !== null) {
                        this.notify(paste, {
                            file: file,
                            args: e,
                            text: value
                        });
                    }
                    setTimeout(() => { this.formatter.onSuccess(this, args); }, 0);
                }
            }
            else {
                e.preventDefault();
            }
        });
    }
    /**
     * @hidden
     */
    clipboardAction(action, event) {
        switch (action.toLowerCase()) {
            case 'cut':
                this.onCut();
                this.formatter.onSuccess(this, {
                    requestType: 'Cut',
                    editorMode: this.editorMode,
                    event: event
                });
                break;
            case 'copy':
                this.onCopy();
                this.formatter.onSuccess(this, {
                    requestType: 'Copy',
                    editorMode: this.editorMode,
                    event: event
                });
                break;
            case 'paste':
                this.onPaste(event);
                break;
        }
    }
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.notify(destroy, {});
        this.destroyDependentModules();
        if (!isNullOrUndefined(this.timeInterval)) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        this.unWireEvents();
        if (this.originalElement.tagName === 'TEXTAREA') {
            this.element.parentElement.insertBefore(this.valueContainer, this.element);
            this.valueContainer.id = this.getID();
            this.valueContainer.removeAttribute('name');
            detach(this.element);
            if (this.originalElement.innerHTML.trim() !== '') {
                this.valueContainer.value = this.originalElement.innerHTML.trim();
                this.setProperties({ value: (!isNullOrUndefined(this.initialValue) ? this.initialValue : null) }, true);
            }
            else {
                this.valueContainer.value = !this.isBlazor() ? this.valueContainer.defaultValue : this.defaultResetValue;
            }
            this.element = this.valueContainer;
            for (let i = 0; i < this.originalElement.classList.length; i++) {
                addClass([this.element], this.originalElement.classList[i]);
            }
            removeClass([this.element], CLS_RTE_HIDDEN);
        }
        else {
            if (this.originalElement.innerHTML.trim() !== '') {
                this.element.innerHTML = this.originalElement.innerHTML.trim();
                this.setProperties({ value: (!isNullOrUndefined(this.initialValue) ? this.initialValue : null) }, true);
            }
            else {
                this.element.innerHTML = '';
            }
        }
        if (this.placeholder && this.placeHolderWrapper) {
            this.placeHolderWrapper = null;
        }
        if (!isNullOrUndefined(this.cssClass)) {
            removeClass([this.element], this.cssClass);
        }
        this.removeHtmlAttributes();
        this.removeAttributes();
        super.destroy();
    }
    removeHtmlAttributes() {
        if (this.htmlAttributes) {
            let keys = Object.keys(this.htmlAttributes);
            for (let i = 0; i < keys.length && this.element.hasAttribute(keys[i]); i++) {
                this.element.removeAttribute(keys[i]);
            }
        }
    }
    removeAttributes() {
        if (!this.enabled) {
            removeClass([this.element], CLS_DISABLED);
        }
        if (this.enableRtl) {
            removeClass([this.element], CLS_RTL);
        }
        if (this.readonly) {
            removeClass([this.element], CLS_RTE_READONLY);
        }
        if (this.element.style.width !== '' && this.originalElement.style.width === '') {
            this.element.style.removeProperty('width');
        }
        if (this.element.style.height !== '' && this.originalElement.style.height === '') {
            this.element.style.removeProperty('height');
        }
        this.element.removeAttribute('aria-disabled');
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
    }
    destroyDependentModules() {
        /* destroy dependent modules */
        this.renderModule.destroy();
        this.formatter.editorManager.undoRedoManager.destroy();
        this.sourceCodeModule.destroy();
    }
    /**
     * Returns the HTML or Text inside the RichTextEditor.
     * @return {Element}
     */
    getContent() {
        if (this.iframeSettings.enable && isBlazor()) {
            return this.inputElement;
        }
        else {
            return this.contentModule.getPanel();
        }
    }
    /**
     * Returns the text content as string.
     * @return {string}
     */
    getText() {
        return this.contentModule.getText();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'richtexteditor';
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    let val;
                    let nVal = newProp[prop];
                    val = this.editorMode === 'HTML' ? getEditValue(nVal, this) : nVal;
                    if (!isNullOrUndefined(nVal) && nVal !== '') {
                        this.value = this.serializeValue(((this.enableHtmlEncode) ? this.encode(decode(val)) : val));
                    }
                    this.updatePanelValue();
                    this.setPlaceHolder();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'valueTemplate':
                    this.setValue();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'width':
                    this.setWidth(newProp[prop]);
                    if (this.toolbarSettings.enable) {
                        this.toolbarModule.refreshToolbarOverflow();
                        this.resizeHandler();
                    }
                    break;
                case 'height':
                    this.setHeight(newProp[prop]);
                    this.setContentHeight();
                    this.autoResize();
                    break;
                case 'readonly':
                    this.setReadOnly(false);
                    break;
                case 'cssClass':
                    this.element.classList.remove(oldProp[prop]);
                    this.setCssClass(newProp[prop]);
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'enableRtl':
                    this.updateRTL();
                    break;
                case 'placeholder':
                    this.placeholder = newProp[prop];
                    this.setPlaceHolder();
                    break;
                case 'htmlAttributes':
                    setAttributes(this.htmlAttributes, this, false, false);
                    break;
                case 'iframeSettings':
                    let frameSetting = oldProp[prop];
                    if (frameSetting.resources) {
                        let iframe = this.contentModule.getDocument();
                        let header = iframe.querySelector('head');
                        let files;
                        if (frameSetting.resources.scripts) {
                            files = header.querySelectorAll('.' + CLS_SCRIPT_SHEET);
                            this.removeSheets(files);
                        }
                        if (frameSetting.resources.styles) {
                            files = header.querySelectorAll('.' + CLS_STYLE_SHEET);
                            this.removeSheets(files);
                        }
                    }
                    this.setIframeSettings();
                    break;
                case 'locale':
                    super.refresh();
                    break;
                case 'inlineMode':
                    this.notify(modelChanged, { module: 'quickToolbar', newProp: newProp, oldProp: oldProp });
                    this.setContentHeight();
                    break;
                case 'toolbarSettings':
                    this.notify(modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                    this.setContentHeight();
                    break;
                case 'maxLength':
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'showCharCount':
                    if (newProp[prop] && this.countModule) {
                        this.countModule.renderCount();
                    }
                    else if (newProp[prop] === false && this.countModule) {
                        this.countModule.destroy();
                    }
                    break;
                case 'enableHtmlEncode':
                    this.updateValueData();
                    this.updatePanelValue();
                    this.setPlaceHolder();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'undoRedoSteps':
                case 'undoRedoTimer':
                    this.formatter.editorManager.observer.notify(MODEL_CHANGED, { newProp: newProp, oldProp: oldProp });
                    break;
                case 'quickToolbarSettings':
                    newProp.quickToolbarSettings.showOnRightClick ? this.wireContextEvent() : this.unWireContextEvent();
                    this.notify(modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
                default:
                    this.notify(modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
            }
        }
    }
    /**
     * @hidden
     */
    updateValueData() {
        if (this.enableHtmlEncode) {
            this.setProperties({ value: this.encode(decode(this.inputElement.innerHTML)) }, true);
        }
        else {
            this.setProperties({
                value: /<[a-z][\s\S]*>/i.test(this.inputElement.innerHTML) ? this.inputElement.innerHTML :
                    decode(this.inputElement.innerHTML)
            });
        }
    }
    removeSheets(srcList) {
        let i;
        for (i = 0; i < srcList.length; i++) {
            detach(srcList[i]);
        }
    }
    updatePanelValue() {
        let value = this.value;
        value = (this.enableHtmlEncode && this.value) ? decode(value) : value;
        if (value) {
            if (this.valueContainer) {
                this.valueContainer.value = (this.enableHtmlEncode) ? this.value : value;
            }
            if (this.editorMode === 'HTML' && this.inputElement && this.inputElement.innerHTML.trim() !== value.trim()) {
                this.inputElement.innerHTML = value;
            }
            else if (this.editorMode === 'Markdown' && this.inputElement
                && this.inputElement.value.trim() !== value.trim()) {
                this.inputElement.value = value;
            }
        }
        else {
            if (this.editorMode === 'HTML') {
                this.inputElement.innerHTML = '<p><br/></p>';
            }
            else {
                this.inputElement.value = '';
            }
            if (this.valueContainer) {
                this.valueContainer.value = '';
            }
        }
        if (this.showCharCount) {
            this.countModule.refresh();
        }
    }
    setHeight(height) {
        if (height !== 'auto') {
            this.element.style.height = formatUnit(height);
        }
        else {
            this.element.style.height = 'auto';
        }
    }
    setPlaceHolder() {
        if (this.inputElement && this.placeholder && this.iframeSettings.enable !== true) {
            if (this.editorMode !== 'Markdown') {
                if (!this.placeHolderWrapper) {
                    this.placeHolderWrapper = this.createElement('span', { className: 'rte-placeholder' });
                    if (this.inputElement) {
                        this.inputElement.parentElement.insertBefore(this.placeHolderWrapper, this.inputElement);
                    }
                    attributes(this.placeHolderWrapper, {
                        'style': 'font-size: 16px; padding: 16px; margin-left: 0px; margin-right: 0px;'
                    });
                }
                this.placeHolderWrapper.innerHTML = this.placeholder;
                if (this.inputElement.textContent.length !== 0) {
                    this.placeHolderWrapper.style.display = 'none';
                }
                else {
                    this.placeHolderWrapper.style.display = 'block';
                }
            }
            else {
                this.inputElement.setAttribute('placeholder', this.placeholder);
            }
        }
    }
    setWidth(width) {
        if (width !== 'auto') {
            setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        }
        else {
            this.element.style.width = 'auto';
        }
    }
    setCssClass(cssClass) {
        if (!isNullOrUndefined(cssClass)) {
            this.element.classList.add(cssClass);
        }
    }
    updateRTL() {
        this.notify(rtlMode, { enableRtl: this.enableRtl });
        if (this.enableRtl) {
            this.element.classList.add(CLS_RTL);
        }
        else {
            this.element.classList.remove(CLS_RTL);
        }
    }
    updateReadOnly() {
        this.notify(readOnlyMode, { editPanel: this.inputElement, mode: this.readonly });
    }
    setReadOnly(initial) {
        this.updateReadOnly();
        if (!initial) {
            if (this.readonly && this.enabled) {
                this.unbindEvents();
            }
            else if (this.enabled) {
                this.bindEvents();
            }
        }
    }
    /**
     * By default, prints all the pages of the RichTextEditor.
     * @return {void}
     */
    print() {
        let printWind;
        let printArgs = {
            element: this.inputElement,
            requestType: 'print',
            cancel: false
        };
        this.trigger(actionBegin, printArgs, (printingArgs) => {
            printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
            if (Browser.info.name === 'msie') {
                printWind.resizeTo(screen.availWidth, screen.availHeight);
            }
            printWind = print(this.inputElement, printWind);
            if (!printingArgs.cancel) {
                let actionArgs = {
                    requestType: 'print'
                };
                this.trigger(actionComplete, actionArgs);
            }
        });
    }
    /**
     * Refresh the view of the editor.
     * @public
     */
    refreshUI() {
        this.renderModule.refresh();
    }
    /**
     * Shows the RichTextEditor component in full-screen mode.
     */
    showFullScreen() {
        if (this.readonly) {
            return;
        }
        this.fullScreenModule.showFullScreen();
    }
    /**
     * Enables the give toolbar items in the RichTextEditor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be enable in Rich Text Editor’s Toolbar.
     * @public
     */
    enableToolbarItem(items, muteToolbarUpdate) {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, true, muteToolbarUpdate);
    }
    /**
     * Disables the given toolbar items in the RichTextEditor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be disable in Rich Text Editor’s Toolbar.
     * @public
     */
    disableToolbarItem(items, muteToolbarUpdate) {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, false, muteToolbarUpdate);
    }
    /**
     * Removes the give toolbar items from the RichTextEditor component.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be remove from Rich Text Editor’s Toolbar.
     * @public
     */
    removeToolbarItem(items) {
        this.toolbarModule.removeTBarItems(items);
    }
    /**
     * Get the selected range from the RichTextEditor's content.
     * @public
     * @deprecated
     */
    getRange() {
        return this.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
    }
    initializeServices() {
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('rteLocale', this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale));
        this.serviceLocator.register('dialogRenderObject', new DialogRenderer(this));
    }
    RTERender() {
        let rendererFactory = this.serviceLocator.getService('rendererFactory');
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.fullScreenModule = new FullScreen(this);
        this.renderModule.render();
        this.inputElement = this.contentModule.getEditPanel();
        this.setHeight(this.height);
        setAttributes(this.htmlAttributes, this, false, true);
        if (this.iframeSettings) {
            this.setIframeSettings();
        }
        this.setCssClass(this.cssClass);
        this.updateEnable();
        this.setPlaceHolder();
        this.updateRTL();
        this.updateReadOnly();
        this.updatePanelValue();
        if (this.enableHtmlEncode && !isNullOrUndefined(this.value)) {
            this.setProperties({ value: this.encode(decode(this.value)) });
        }
    }
    setIframeSettings() {
        if (this.iframeSettings.resources) {
            let styleSrc = this.iframeSettings.resources.styles;
            let scriptSrc = this.iframeSettings.resources.scripts;
            if (this.iframeSettings.resources.scripts.length > 0) {
                this.InjectSheet(true, scriptSrc);
            }
            if (this.iframeSettings.resources.styles.length > 0) {
                this.InjectSheet(false, styleSrc);
            }
        }
        if (this.iframeSettings.attributes) {
            setAttributes(this.iframeSettings.attributes, this, true, false);
        }
    }
    InjectSheet(scriptSheet, srcList) {
        try {
            if (srcList && srcList.length > 0) {
                let iFrame = this.contentModule.getDocument();
                let target = iFrame.querySelector('head');
                for (let i = 0; i < srcList.length; i++) {
                    if (scriptSheet) {
                        let scriptEle = this.createScriptElement();
                        scriptEle.src = srcList[i];
                        target.appendChild(scriptEle);
                    }
                    else {
                        let styleEle = this.createStyleElement();
                        styleEle.href = srcList[i];
                        target.appendChild(styleEle);
                    }
                }
            }
        }
        catch (e) {
            return;
        }
    }
    createScriptElement() {
        let scriptEle = this.createElement('script', {
            className: CLS_SCRIPT_SHEET
        });
        scriptEle.type = 'text/javascript';
        return scriptEle;
    }
    createStyleElement() {
        let styleEle = this.createElement('link', {
            className: CLS_STYLE_SHEET
        });
        styleEle.rel = 'stylesheet';
        return styleEle;
    }
    isBlazor() {
        return ((Object.keys(window).indexOf('ejsInterop') === -1) ? false : true);
    }
    setValue() {
        if (this.valueTemplate) {
            if (typeof this.valueTemplate === 'string') {
                this.setProperties({ value: this.valueTemplate });
            }
            else {
                let compiledString;
                compiledString = compile(this.valueTemplate);
                let compiledTemplate = compiledString({});
                for (let i = 0; i < compiledTemplate.length; i++) {
                    let item = compiledTemplate[i];
                    append([item], this.element);
                }
                this.setProperties({ value: this.element.innerHTML.trim() });
            }
        }
        else {
            let innerHtml = !isNullOrUndefined(this.element.innerHTML) && this.element.innerHTML.replace(/<(\/?|\!?)(!--!--)>/g, '').trim();
            if (innerHtml !== '') {
                if (this.element.tagName === 'TEXTAREA') {
                    this.setProperties({ value: decode(innerHtml) });
                }
                else {
                    this.setProperties({ value: innerHtml });
                }
            }
        }
    }
    setContentHeight(target, isExpand) {
        let heightValue;
        let topValue = 0;
        let cntEle = (this.sourceCodeModule.getPanel() &&
            this.sourceCodeModule.getPanel().parentElement.style.display === 'block') ? this.sourceCodeModule.getPanel().parentElement :
            this.contentModule.getPanel();
        let rteHeight = this.element.offsetHeight;
        let tbHeight = this.getToolbar() ? this.toolbarModule.getToolbarHeight() : 0;
        let expandPopHeight = this.getToolbar() ? this.toolbarModule.getExpandTBarPopHeight() : 0;
        if (this.toolbarSettings.type === ToolbarType.Expand && isExpand && target !== 'preview') {
            heightValue = (this.height === 'auto') ? 'auto' : rteHeight - (tbHeight + expandPopHeight) + 'px';
            topValue = (!this.toolbarSettings.enableFloating) ? expandPopHeight : 0;
        }
        else {
            if (this.height === 'auto' && !(this.element.classList.contains('e-rte-full-screen'))) {
                heightValue = 'auto';
            }
            else {
                heightValue = rteHeight - tbHeight + 'px';
            }
        }
        setStyleAttribute(cntEle, { height: heightValue, marginTop: topValue + 'px' });
        if (this.iframeSettings.enable && target === 'sourceCode') {
            let codeElement = select('.' + CLS_RTE_CONTENT, this.element);
            setStyleAttribute(codeElement, { height: heightValue, marginTop: topValue + 'px' });
        }
        if (this.toolbarSettings.enableFloating && this.getToolbar() && !this.inlineMode.enable) {
            if (isExpand) {
                setStyleAttribute(this.getToolbar().parentElement, { height: (tbHeight + expandPopHeight) + 'px' });
            }
            else {
                setStyleAttribute(this.getToolbar().parentElement, { height: tbHeight + 'px' });
            }
        }
        this.autoResize();
    }
    /**
     * Retrieves the HTML from RichTextEditor.
     * @public
     */
    getHtml() {
        return this.value;
    }
    /**
     * Shows the source HTML/MD markup.
     * @public
     */
    showSourceCode() {
        if (this.readonly) {
            return;
        }
        this.notify(sourceCode, {});
    }
    /**
     * Returns the maximum number of characters in the Rich Text Editor.
     * @public
     */
    getCharCount() {
        let htmlText = this.editorMode === 'Markdown' ? this.inputElement.value.trim() :
            this.inputElement.textContent.trim();
        return htmlText.length;
    }
    /**
     * @hidden
     */
    getBaseToolbarObject() {
        let tbObj;
        if (this.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            tbObj = this.quickToolbarModule && this.quickToolbarModule.getInlineBaseToolbar();
        }
        else {
            tbObj = this.toolbarModule && this.toolbarModule.getBaseToolbar();
        }
        return tbObj;
    }
    /**
     * @hidden
     */
    getToolbar() {
        return this.toolbarModule ? this.toolbarModule.getToolbarElement() : null;
    }
    /**
     * @hidden
     */
    getToolbarElement() {
        return this.toolbarModule && this.toolbarModule.getToolbarElement();
    }
    getID() {
        return (this.originalElement.tagName === 'TEXTAREA' ? this.valueContainer.id : this.element.id);
    }
    mouseDownHandler(e) {
        let touch = (e.touches ? e.changedTouches[0] : e);
        addClass([this.element], [CLS_FOCUS]);
        this.preventDefaultResize(e);
        this.notify(mouseDown, { args: e });
        this.clickPoints = { clientX: touch.clientX, clientY: touch.clientY };
    }
    preventImgResize(e) {
        if (e.target.nodeName.toLocaleLowerCase() === 'img') {
            e.preventDefault();
        }
    }
    preventDefaultResize(e) {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().addEventListener('mscontrolselect', this.preventImgResize);
        }
        else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', false, 'false');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', false, 'false');
        }
    }
    defaultResize(e) {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().removeEventListener('mscontrolselect', this.preventImgResize);
        }
        else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', true, 'true');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', true, 'true');
        }
    }
    resizeHandler() {
        let isExpand = false;
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            this.toolbarModule.refreshToolbarOverflow();
            isExpand = this.toolbarModule.baseToolbar.toolbarObj.element.classList.contains(CLS_EXPAND_OPEN);
        }
        this.setContentHeight('', isExpand);
    }
    scrollHandler(e) {
        this.notify(scroll, { args: e });
    }
    focusHandler(e) {
        if ((!this.isRTE || this.isFocusOut) && !this.readonly) {
            this.isRTE = this.isFocusOut ? false : true;
            this.isFocusOut = false;
            addClass([this.element], [CLS_FOCUS]);
            if (this.editorMode === 'HTML') {
                this.cloneValue = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                    this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
            }
            else {
                this.cloneValue = this.inputElement.value === '' ? null :
                    this.inputElement.value;
            }
            let active = document.activeElement;
            if (active === this.element || active === this.getToolbarElement() || active === this.contentModule.getEditPanel()
                || (this.iframeSettings.enable && active === this.contentModule.getPanel())
                || active.closest('.e-rte-toolbar') === this.getToolbarElement()) {
                this.contentModule.getEditPanel().focus();
                if (!isNullOrUndefined(this.getToolbarElement())) {
                    this.getToolbarElement().setAttribute('tabindex', '-1');
                    let items = this.getToolbarElement().querySelectorAll('[tabindex="0"]');
                    if (items.length !== 0) {
                        items.forEach((element) => {
                            element.setAttribute('tabindex', '-1');
                        });
                    }
                }
            }
            this.preventDefaultResize(e);
            this.trigger('focus', { event: e, isInteracted: Object.keys(e).length === 0 ? false : true });
            if (!isNullOrUndefined(this.saveInterval) && this.saveInterval > 0) {
                this.timeInterval = setInterval(this.updateIntervalValue.bind(this), this.saveInterval);
            }
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
        if (!isNullOrUndefined(this.getToolbarElement())) {
            let toolbarItem = this.getToolbarElement().querySelectorAll('input,select,button,a,[tabindex]');
            toolbarItem.forEach((item) => {
                if (!item.hasAttribute('tabindex') || item.getAttribute('tabindex') !== '-1') {
                    item.setAttribute('tabindex', '-1');
                }
            });
        }
    }
    getUpdatedValue() {
        let value;
        if (this.editorMode === 'HTML') {
            value = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
        }
        else {
            value = this.inputElement.value === '' ? null :
                this.inputElement.value;
        }
        return value;
    }
    updateIntervalValue() {
        this.setProperties({ value: this.getUpdatedValue() }, true);
        this.valueContainer.value = this.value;
        this.invokeChangeEvent();
    }
    onDocumentClick(e) {
        let target = e.target;
        let rteElement = closest(target, '.' + CLS_RTE);
        if (!this.element.contains(e.target) && document !== e.target && rteElement !== this.element &&
            !closest(target, '[aria-owns="' + this.getID() + '"]')) {
            this.isBlur = true;
            this.isRTE = false;
        }
        this.notify(docClick, { args: e });
    }
    blurHandler(e) {
        let trg = e.relatedTarget;
        if (trg) {
            let rteElement = closest(trg, '.' + CLS_RTE);
            if (rteElement && rteElement === this.element) {
                this.isBlur = false;
                if (trg === this.getToolbarElement()) {
                    trg.setAttribute('tabindex', '-1');
                }
            }
            else if (closest(trg, '[aria-owns="' + this.getID() + '"]')) {
                this.isBlur = false;
            }
            else {
                this.isBlur = true;
                trg = null;
            }
        }
        if (this.isBlur && isNullOrUndefined(trg)) {
            removeClass([this.element], [CLS_FOCUS]);
            this.notify(focusChange, {});
            let value = this.getUpdatedValue();
            this.setProperties({ value: value });
            this.notify(toolbarRefresh, { args: e, documentNode: document });
            this.invokeChangeEvent();
            this.isFocusOut = true;
            this.isBlur = false;
            dispatchEvent(this.valueContainer, 'focusout');
            this.defaultResize(e);
            this.trigger('blur', { event: e, isInteracted: Object.keys(e).length === 0 ? false : true });
            if (!isNullOrUndefined(this.timeInterval)) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        }
        else {
            this.isRTE = true;
        }
    }
    invokeChangeEvent() {
        let eventArgs = {
            value: this.value
        };
        if (this.value !== this.cloneValue) {
            this.trigger('change', eventArgs);
            this.cloneValue = this.value;
        }
    }
    /**
     * @hidden
     */
    wireScrollElementsEvents() {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.add(this.contentModule.getPanel(), 'scroll', this.scrollHandler, this);
        }
    }
    wireContextEvent() {
        if (this.quickToolbarSettings.showOnRightClick) {
            EventHandler.add(this.inputElement, 'contextmenu', this.contextHandler, this);
            if (Browser.isDevice) {
                this.touchModule = new Touch(this.inputElement, { tapHold: this.touchHandler.bind(this), tapHoldThreshold: 500 });
            }
        }
    }
    unWireContextEvent() {
        EventHandler.remove(this.inputElement, 'contextmenu', this.contextHandler);
        if (Browser.isDevice && this.touchModule) {
            this.touchModule.destroy();
        }
    }
    /**
     * @hidden
     */
    unWireScrollElementsEvents() {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.remove(this.contentModule.getPanel(), 'scroll', this.scrollHandler);
        }
    }
    touchHandler(e) {
        this.notifyMouseUp(e.originalEvent);
        this.triggerEditArea(e.originalEvent);
    }
    contextHandler(e) {
        let closestElem = closest(e.target, 'a, table, img');
        if (this.inlineMode.onSelection === false || (!isNullOrUndefined(closestElem) && this.inputElement.contains(closestElem)
            && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A'))) {
            e.preventDefault();
        }
    }
    resetHandler() {
        let defaultValue = this.valueContainer.defaultValue.trim();
        this.setProperties({ value: defaultValue === '' ? null : (this.isBlazor() ? this.defaultResetValue : defaultValue) });
    }
    /**
     * @hidden
     */
    autoResize() {
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                setTimeout(() => { this.setAutoHeight(this.inputElement); }, 0);
            }
            else if (this.iframeSettings.enable) {
                let iframeElement = this.element.querySelector('#' + this.getID() + '_rte-view');
                setTimeout(() => { this.setAutoHeight(iframeElement); }, 0);
            }
        }
        else {
            this.inputElement.style.overflow = null;
        }
    }
    setAutoHeight(element) {
        element.style.height = '';
        element.style.height = this.inputElement.scrollHeight + 'px';
        element.style.overflow = 'hidden';
    }
    wireEvents() {
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        if (this.readonly && this.enabled) {
            return;
        }
        this.bindEvents();
    }
    restrict(e) {
        if (this.maxLength >= 0) {
            let element = e.currentTarget.textContent.trim();
            let array = [8, 16, 17, 37, 38, 39, 40, 46, 65];
            let arrayKey;
            for (let i = 0; i <= array.length - 1; i++) {
                if (e.which === array[i]) {
                    if (e.ctrlKey && e.which === 65) {
                        return;
                    }
                    else if (e.which !== 65) {
                        arrayKey = array[i];
                        return;
                    }
                }
            }
            if ((element.length >= this.maxLength && this.maxLength !== -1) && e.which !== arrayKey) {
                e.preventDefault();
            }
        }
    }
    bindEvents() {
        this.keyboardModule = new KeyboardEvents$1(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs: Object.assign({}, this.formatter.keyConfig, this.keyConfig), eventName: 'keydown'
        });
        let formElement = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30), this);
        EventHandler.add(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler, this);
        this.wireContextEvent();
        this.formatter.editorManager.observer.on(KEY_DOWN_HANDLER, this.editorKeyDown, this);
        this.element.ownerDocument.defaultView.addEventListener('resize', this.onResizeHandler, true);
        if (this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'focusin', this.focusHandler, this);
            EventHandler.add(this.inputElement, 'focusout', this.blurHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, 'scroll', this.scrollHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown, this);
        }
        this.wireScrollElementsEvents();
    }
    onIframeMouseDown(e) {
        this.isBlur = false;
        this.notify(iframeMouseDown, e);
    }
    editorKeyDown(e) {
        switch (e.event.action) {
            case 'copy':
                this.onCopy();
                break;
            case 'cut':
                this.onCut();
                break;
        }
        if (e.callBack && (e.event.action === 'copy' || e.event.action === 'cut' || e.event.action === 'delete')) {
            e.callBack({
                requestType: e.event.action,
                editorMode: 'HTML',
                event: e.event
            });
        }
    }
    unWireEvents() {
        this.element.removeEventListener('focusin', this.onFocusHandler, true);
        this.element.removeEventListener('focusout', this.onBlurHandler, true);
        if (this.readonly && this.enabled) {
            return;
        }
        this.unbindEvents();
    }
    unbindEvents() {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        let formElement = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30));
        EventHandler.remove(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler);
        this.unWireContextEvent();
        if (this.formatter) {
            this.formatter.editorManager.observer.off(KEY_DOWN_HANDLER, this.editorKeyDown);
        }
        this.element.ownerDocument.defaultView.removeEventListener('resize', this.onResizeHandler, true);
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.scrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
        }
        this.unWireScrollElementsEvents();
    }
};
__decorate$1([
    Complex({}, ToolbarSettings)
], RichTextEditor.prototype, "toolbarSettings", void 0);
__decorate$1([
    Complex({}, QuickToolbarSettings)
], RichTextEditor.prototype, "quickToolbarSettings", void 0);
__decorate$1([
    Complex({}, PasteCleanupSettings)
], RichTextEditor.prototype, "pasteCleanupSettings", void 0);
__decorate$1([
    Complex({}, IFrameSettings)
], RichTextEditor.prototype, "iframeSettings", void 0);
__decorate$1([
    Complex({}, ImageSettings)
], RichTextEditor.prototype, "insertImageSettings", void 0);
__decorate$1([
    Complex({}, TableSettings)
], RichTextEditor.prototype, "tableSettings", void 0);
__decorate$1([
    Property(0)
], RichTextEditor.prototype, "floatingToolbarOffset", void 0);
__decorate$1([
    Complex({}, InlineMode)
], RichTextEditor.prototype, "inlineMode", void 0);
__decorate$1([
    Property('100%')
], RichTextEditor.prototype, "width", void 0);
__decorate$1([
    Property(false)
], RichTextEditor.prototype, "enablePersistence", void 0);
__decorate$1([
    Property({})
], RichTextEditor.prototype, "htmlAttributes", void 0);
__decorate$1([
    Property(null)
], RichTextEditor.prototype, "placeholder", void 0);
__decorate$1([
    Property(false)
], RichTextEditor.prototype, "readonly", void 0);
__decorate$1([
    Property(true)
], RichTextEditor.prototype, "enabled", void 0);
__decorate$1([
    Property(false)
], RichTextEditor.prototype, "enableHtmlEncode", void 0);
__decorate$1([
    Property('auto')
], RichTextEditor.prototype, "height", void 0);
__decorate$1([
    Property(null)
], RichTextEditor.prototype, "cssClass", void 0);
__decorate$1([
    Property(null)
], RichTextEditor.prototype, "value", void 0);
__decorate$1([
    Property(30)
], RichTextEditor.prototype, "undoRedoSteps", void 0);
__decorate$1([
    Property(300)
], RichTextEditor.prototype, "undoRedoTimer", void 0);
__decorate$1([
    Property('HTML')
], RichTextEditor.prototype, "editorMode", void 0);
__decorate$1([
    Property(null)
], RichTextEditor.prototype, "keyConfig", void 0);
__decorate$1([
    Property(false)
], RichTextEditor.prototype, "showCharCount", void 0);
__decorate$1([
    Property(false)
], RichTextEditor.prototype, "enableTabKey", void 0);
__decorate$1([
    Property(false)
], RichTextEditor.prototype, "enableAutoUrl", void 0);
__decorate$1([
    Property(-1)
], RichTextEditor.prototype, "maxLength", void 0);
__decorate$1([
    Complex({}, Format)
], RichTextEditor.prototype, "format", void 0);
__decorate$1([
    Complex({}, FontFamily)
], RichTextEditor.prototype, "fontFamily", void 0);
__decorate$1([
    Complex({}, FontSize)
], RichTextEditor.prototype, "fontSize", void 0);
__decorate$1([
    Complex({}, FontColor)
], RichTextEditor.prototype, "fontColor", void 0);
__decorate$1([
    Complex({}, BackgroundColor)
], RichTextEditor.prototype, "backgroundColor", void 0);
__decorate$1([
    Property(null)
], RichTextEditor.prototype, "valueTemplate", void 0);
__decorate$1([
    Property(10000)
], RichTextEditor.prototype, "saveInterval", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "actionBegin", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "actionComplete", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "beforeDialogOpen", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "dialogOpen", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "dialogClose", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "beforeQuickToolbarOpen", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "quickToolbarOpen", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "quickToolbarClose", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "toolbarStatusUpdate", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "imageSelected", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "imageUploading", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "imageUploadSuccess", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "imageUploadFailed", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "imageRemoving", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "created", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "destroyed", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "beforeSanitizeHtml", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "blur", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "toolbarClick", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "focus", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "change", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "resizing", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "resizeStart", void 0);
__decorate$1([
    Event()
], RichTextEditor.prototype, "resizeStop", void 0);
__decorate$1([
    Property(null)
], RichTextEditor.prototype, "formatter", void 0);
RichTextEditor = __decorate$1([
    NotifyPropertyChanges
], RichTextEditor);

/**
 * Base export
 */

/**
 * Services
 */

/**
 * RichTextEditor component exported items
 */

/**
 * Base export
 */

/**
 * Base export
 */

/**
 * Base export
 */

/**
 * Base export
 */

/**
 * Export all markdown plugins
 */

/**
 * Base export
 */

/**
 * Export the common module
 */

/**
 * RichTextEditor component exported items
 */

export { Toolbar$1 as Toolbar, KeyboardEvents$1 as KeyboardEvents, BaseToolbar, BaseQuickToolbar, QuickToolbar, Count, ColorPickerInput, MarkdownToolbarStatus, ExecCommandCallBack, ToolbarAction, MarkdownEditor, HtmlEditor, PasteCleanup, HTMLFormatter, Formatter, MarkdownFormatter, ContentRender, Render, ToolbarRenderer, Link, Image, ViewSource, Table, RichTextEditor, RenderType, ToolbarType, executeGroup, created, destroyed, load, initialLoad, initialEnd, iframeMouseDown, destroy, toolbarClick, toolbarRefresh, refreshBegin, toolbarUpdated, bindOnEnd, renderColorPicker, htmlToolbarClick, markdownToolbarClick, destroyColorPicker, modelChanged, keyUp, keyDown, mouseUp, toolbarCreated, toolbarRenderComplete, enableFullScreen, disableFullScreen, dropDownSelect, beforeDropDownItemRender, execCommandCallBack, imageToolbarAction, linkToolbarAction, resizeStart, onResize, resizeStop, undo, redo, insertLink, unLink, editLink, openLink, actionBegin, actionComplete, toolbarStatusUpdate, actionSuccess, updateToolbarItem, insertImage, insertCompleted, imageLeft, imageRight, imageCenter, imageBreak, imageInline, imageLink, imageAlt, imageDelete, imageCaption, imageSize, sourceCode, updateSource, toolbarOpen, beforeDropDownOpen, selectionSave, selectionRestore, expandPopupClick, count, contentFocus, contentBlur, mouseDown, sourceCodeMouseDown, editAreaClick, scroll, colorPickerChanged, tableColorPickerChanged, focusChange, selectAll$1 as selectAll, selectRange, getSelectedHtml, renderInlineToolbar, paste, imgModule, rtlMode, createTable, docClick, tableToolbarAction, checkUndo, readOnlyMode, pasteClean, beforeDialogOpen, dialogOpen, dialogClose, beforeQuickToolbarOpen, quickToolbarOpen, quickToolbarClose, popupHide, imageSelected, imageUploading, imageUploadSuccess, imageUploadFailed, imageRemoving, ServiceLocator, RendererFactory, EditorManager, IMAGE, TABLE, LINK, INSERT_ROW, INSERT_COLUMN, DELETEROW, DELETECOLUMN, REMOVETABLE, TABLEHEADER, TABLE_VERTICAL_ALIGN, ALIGNMENT_TYPE, INDENT_TYPE, DEFAULT_TAG, BLOCK_TAGS, IGNORE_BLOCK_TAGS, TABLE_BLOCK_TAGS, SELECTION_TYPE, INSERTHTML_TYPE, INSERT_TEXT_TYPE, CLEAR_TYPE, Lists, markerClassName, DOMNode, Alignments, Indents, Formats, LinkCommand, InsertMethods, InsertHtml, IsFormatted, NodeCutter, ImageCommand, SelectionCommands, SelectionBasedExec, ClearFormat$1 as ClearFormat, ClearFormatExec, UndoRedoManager, TableCommand, statusCollection, ToolbarStatus, NodeSelection, MarkdownParser, LISTS_COMMAND, selectionCommand, LINK_COMMAND, CLEAR_COMMAND, MD_TABLE, MDLists, MDFormats, MarkdownSelection, UndoRedoCommands, MDSelectionFormats, MDLink, markdownFormatTags, markdownSelectionTags, markdownListsTags, htmlKeyConfig, markdownKeyConfig, pasteCleanupGroupingTags, listConversionFilters, selfClosingTags, KEY_DOWN, ACTION, FORMAT_TYPE, KEY_DOWN_HANDLER, LIST_TYPE, KEY_UP_HANDLER, KEY_UP, MODEL_CHANGED_PLUGIN, MODEL_CHANGED, MS_WORD_CLEANUP_PLUGIN, MS_WORD_CLEANUP };
//# sourceMappingURL=ej2-richtexteditor.es2015.js.map
