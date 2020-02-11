import { Base, Browser, ChildProperty, Complex, Component, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Observer, Property, SanitizeHtmlHelper, Touch, addClass, append, attributes, closest, compile, createElement, debounce, detach, extend, formatUnit, getEnumValue, getInstance, getUniqueID, isBlazor, isNullOrUndefined, prepend, print, removeClass, select, selectAll, setStyleAttribute } from '@syncfusion/ej2-base';
import { Toolbar } from '@syncfusion/ej2-navigations';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Dialog, Popup, getScrollableParent, isCollide } from '@syncfusion/ej2-popups';
import { ColorPicker, NumericTextBox, Uploader } from '@syncfusion/ej2-inputs';
import { Button, CheckBox, RadioButton } from '@syncfusion/ej2-buttons';

/**
 * @hidden
 * @deprecated
 */
var created = 'create';
/**
 * @hidden
 * @deprecated
 */
var destroyed = 'destroy';
/**
 * @hidden
 * @deprecated
 */
var load = 'load';
/**
 * Specifies RichTextEditor internal events
 */
/**
 * @hidden
 * @deprecated
 */
var initialLoad = 'initial-load';
/**
 * @hidden
 * @deprecated
 */
var initialEnd = 'initial-end';
/**
 * @hidden
 * @deprecated
 */
var iframeMouseDown = 'iframe-click';
/**
 * @hidden
 * @deprecated
 */
var destroy = 'destroy';
/**
 * @hidden
 * @deprecated
 */
var toolbarClick = 'toolbarClick';
/**
 * @hidden
 * @deprecated
 */
var toolbarRefresh = 'toolbar-refresh';
/**
 * @hidden
 * @deprecated
 */
var refreshBegin = 'refresh-begin';
/**
 * @hidden
 * @deprecated
 */
var toolbarUpdated = 'toolbar-updated';
/**
 * @hidden
 * @deprecated
 */
var bindOnEnd = 'bind-on-end';
/**
 * @hidden
 * @deprecated
 */
var renderColorPicker = 'render-color-picker';
/**
 * @hidden
 * @deprecated
 */
var htmlToolbarClick = 'html-toolbar-click';
/**
 * @hidden
 * @deprecated
 */
var markdownToolbarClick = 'markdown-toolbar-click';
/**
 * @hidden
 * @deprecated
 */
var destroyColorPicker = 'destroy-color-picker';
/**
 * @hidden
 * @deprecated
 */
var modelChanged = 'model-changed';
/**
 * @hidden
 * @deprecated
 */
var keyUp = 'keyUp';
/**
 * @hidden
 * @deprecated
 */
var keyDown = 'keyDown';
/**
 * @hidden
 * @deprecated
 */
var mouseUp = 'mouseUp';
/**
 * @hidden
 * @deprecated
 */
var toolbarCreated = 'toolbarCreated';
/**
 * @hidden
 * @deprecated
 */
var toolbarRenderComplete = 'toolbarRenderComplete';
/**
 * @hidden
 * @deprecated
 */
var enableFullScreen = 'enableFullScreen';
/**
 * @hidden
 * @deprecated
 */
var disableFullScreen = 'disableFullScreen';
/**
 * @hidden
 * @deprecated
 */
var dropDownSelect = 'dropDownSelect';
/**
 * @hidden
 * @deprecated
 */
var beforeDropDownItemRender = 'beforeDropDownItemRender';
/**
 * @hidden
 * @deprecated
 */
var execCommandCallBack = 'execCommandCallBack';
/**
 * @hidden
 * @deprecated
 */
var imageToolbarAction = 'image-toolbar-action';
/**
 * @hidden
 * @deprecated
 */
var linkToolbarAction = 'link-toolbar-action';
/**
 * @hidden
 * @deprecated
 */
var resizeStart = 'resizeStart';
/**
 * @hidden
 * @deprecated
 */
var onResize = 'resizing';
/**
 * @hidden
 * @deprecated
 */
var resizeStop = 'resizeStop';
/**
 * @hidden
 * @deprecated
 */
var undo = 'undo';
/**
 * @hidden
 * @deprecated
 */
var redo = 'redo';
/**
 * @hidden
 * @deprecated
 */
var insertLink = 'insertLink';
/**
 * @hidden
 * @deprecated
 */
var unLink = 'unLink';
/**
 * @hidden
 * @deprecated
 */
var editLink = 'editLink';
/**
 * @hidden
 * @deprecated
 */
var openLink = 'openLink';
/**
 * @hidden
 * @deprecated
 */
var actionBegin = 'actionBegin';
/**
 * @hidden
 * @deprecated
 */
var actionComplete = 'actionComplete';
/**
 * @hidden
 * @deprecated
 */
var toolbarStatusUpdate = 'toolbarStatusUpdate';
/**
 * @hidden
 * @deprecated
 */
var actionSuccess = 'actionSuccess';
/**
 * @hidden
 * @deprecated
 */
var updateToolbarItem = 'updateToolbarItem';
/**
 * @hidden
 * @deprecated
 */
var insertImage = 'insertImage';
/**
 * @hidden
 * @deprecated
 */
var insertCompleted = 'insertCompleted';
/**
 * @hidden
 * @deprecated
 */
var imageLeft = 'justifyLeft';
/**
 * @hidden
 * @deprecated
 */
var imageRight = 'justifyRight';
/**
 * @hidden
 * @deprecated
 */
var imageCenter = 'justifyCenter';
/**
 * @hidden
 * @deprecated
 */
var imageBreak = 'break';
/**
 * @hidden
 * @deprecated
 */
var imageInline = 'inline';
/**
 * @hidden
 * @deprecated
 */
var imageLink = 'insertImgLink';
/**
 * @hidden
 * @deprecated
 */
var imageAlt = 'imgAltText';
/**
 * @hidden
 * @deprecated
 */
var imageDelete = 'delete';
/**
 * @hidden
 * @deprecated
 */
var imageCaption = 'caption';
/**
 * @hidden
 * @deprecated
 */
var imageSize = 'imageSize';
/**
 * @hidden
 * @deprecated
 */
var sourceCode = 'sourceCode';
/**
 * @hidden
 * @deprecated
 */
var updateSource = 'updateSource';
/**
 * @hidden
 * @deprecated
 */
var toolbarOpen = 'toolbarOpen';
/**
 * @hidden
 * @deprecated
 */
var beforeDropDownOpen = 'beforeDropDownOpen';
/**
 * @hidden
 * @deprecated
 */
var selectionSave = 'selection-save';
/**
 * @hidden
 * @deprecated
 */
var selectionRestore = 'selection-restore';
/**
 * @hidden
 * @deprecated
 */
var expandPopupClick = 'expandPopupClick';
/**
 * @hidden
 * @deprecated
 */
var count = 'count';
/**
 * @hidden
 * @deprecated
 */
var contentFocus = 'contentFocus';
/**
 * @hidden
 * @deprecated
 */
var contentBlur = 'contentBlur';
/**
 * @hidden
 * @deprecated
 */
var mouseDown = 'mouseDown';
/**
 * @hidden
 * @deprecated
 */
var sourceCodeMouseDown = 'sourceCodeMouseDown';
/**
 * @hidden
 * @deprecated
 */
var editAreaClick = 'editAreaClick';
/**
 * @hidden
 * @deprecated
 */
var scroll = 'scroll';
/**
 * @hidden
 * @deprecated
 */
var contentscroll = 'contentscroll';
/**
 * @hidden
 * @deprecated
 */
var colorPickerChanged = 'colorPickerChanged';
/**
 * @hidden
 * @deprecated
 */
var tableColorPickerChanged = 'tableColorPickerChanged';
/**
 * @hidden
 * @deprecated
 */
var focusChange = 'focusChange';
/**
 * @hidden
 * @deprecated
 */
var selectAll$1 = 'selectAll';
/**
 * @hidden
 * @deprecated
 */
var selectRange = 'selectRange';
/**
 * @hidden
 * @deprecated
 */
var getSelectedHtml = 'getSelectedHtml';
/**
 * @hidden
 * @deprecated
 */
var renderInlineToolbar = 'renderInlineToolbar';
/**
 * @hidden
 * @deprecated
 */
var paste = 'paste-content';
/**
 * @hidden
 * @deprecated
 */
var imgModule = 'imageModule';
/**
 * @hidden
 * @deprecated
 */
var rtlMode = 'rtl-mode';
/**
 * @hidden
 * @deprecated
 */
var createTable = 'createTable';
/**
 * @hidden
 * @deprecated
 */
var docClick = 'docClick';
/**
 * @hidden
 * @deprecated
 */
var tableToolbarAction = 'table-toolbar-action';
/**
 * @hidden
 * @deprecated
 */
var checkUndo = 'checkUndoStack';
/**
 * @hidden
 * @deprecated
 */
var readOnlyMode = 'readOnlyMode';
/**
 * @hidden
 * @deprecated
 */
var pasteClean = 'pasteClean';
/**
 * @hidden
 * @deprecated
 */
var beforeDialogOpen = 'beforeDialogOpen';
/**
 * @hidden
 * @deprecated
 */
var dialogOpen = 'dialogOpen';
/**
 * @hidden
 * @deprecated
 */
var dialogClose = 'dialogClose';
/**
 * @hidden
 * @deprecated
 */
var beforeQuickToolbarOpen = 'beforeQuickToolbarOpen';
/**
 * @hidden
 * @deprecated
 */
var quickToolbarOpen = 'quickToolbarOpen';
/**
 * @hidden
 * @deprecated
 */
var quickToolbarClose = 'quickToolbarClose';
/**
 * @hidden
 * @deprecated
 */
var popupHide = 'popupHide';
/**
 * @hidden
 * @deprecated
 */
var imageSelected = 'imageSelected';
/**
 * @hidden
 * @deprecated
 */
var imageUploading = 'imageUploading';
/**
 * @hidden
 * @deprecated
 */
var imageUploadSuccess = 'imageUploadSuccess';
/**
 * @hidden
 * @deprecated
 */
var imageUploadFailed = 'imageUploadFailed';
/**
 * @hidden
 * @deprecated
 */
var imageRemoving = 'imageRemoving';
/**
 * @hidden
 * @deprecated
 */
var drop = 'drop';
/**
 * @hidden
 * @deprecated
 */
var xhtmlValidation = 'xhtmlValidation';

/**
 * RichTextEditor classes defined here.
 */
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE = 'e-richtexteditor';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTL = 'e-rtl';
/**
 * @hidden
 * @deprecated
 */
var CLS_CONTENT = 'e-content';
/**
 * @hidden
 * @deprecated
 */
var CLS_DISABLED = 'e-disabled';
/**
 * @hidden
 * @deprecated
 */
var CLS_SCRIPT_SHEET = 'rte-iframe-script-sheet';
/**
 * @hidden
 * @deprecated
 */
var CLS_STYLE_SHEET = 'rte-iframe-style-sheet';
/**
 * @hidden
 * @deprecated
 */
var CLS_TOOLBAR = 'e-rte-toolbar';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_FIXED = 'e-rte-tb-fixed';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_FLOAT = 'e-rte-tb-float';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_ABS_FLOAT = 'e-rte-tb-abs-float';
/**
 * @hidden
 * @deprecated
 */
var CLS_INLINE = 'e-rte-inline';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_INLINE = 'e-rte-tb-inline';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_EXPAND_TB = 'e-rte-tb-expand';
/**
 * @hidden
 * @deprecated
 */
var CLS_FULL_SCREEN = 'e-rte-full-screen';
/**
 * @hidden
 * @deprecated
 */
var CLS_QUICK_TB = 'e-rte-quick-toolbar';
/**
 * @hidden
 * @deprecated
 */
var CLS_POP = 'e-rte-pop';
/**
 * @hidden
 * @deprecated
 */
var CLS_QUICK_POP = 'e-rte-quick-popup';
/**
 * @hidden
 * @deprecated
 */
var CLS_QUICK_DROPDOWN = 'e-quick-dropdown';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMAGE_POP = 'e-rte-image-popup';
/**
 * @hidden
 * @deprecated
 */
var CLS_INLINE_POP = 'e-rte-inline-popup';
/**
 * @hidden
 * @deprecated
 */
var CLS_INLINE_DROPDOWN = 'e-rte-inline-dropdown';
/**
 * @hidden
 * @deprecated
 */
var CLS_DROPDOWN_POPUP = 'e-rte-dropdown-popup';
/**
 * @hidden
 * @deprecated
 */
var CLS_DROPDOWN_ICONS = 'e-rte-dropdown-icons';
/**
 * @hidden
 * @deprecated
 */
var CLS_DROPDOWN_ITEMS = 'e-rte-dropdown-items';
/**
 * @hidden
 * @deprecated
 */
var CLS_DROPDOWN_BTN = 'e-rte-dropdown-btn';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_CONTENT = 'e-rte-content';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_ITEM = 'e-toolbar-item';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_EXTENDED = 'e-toolbar-extended';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_WRAP = 'e-toolbar-wrapper';
/**
 * @hidden
 * @deprecated
 */
var CLS_POPUP = 'e-popup';
/**
 * @hidden
 * @deprecated
 */
var CLS_SEPARATOR = 'e-separator';
/**
 * @hidden
 * @deprecated
 */
var CLS_MINIMIZE = 'e-minimize';
/**
 * @hidden
 * @deprecated
 */
var CLS_MAXIMIZE = 'e-maximize';
/**
 * @hidden
 * @deprecated
 */
var CLS_BACK = 'e-back';
/**
 * @hidden
 * @deprecated
 */
var CLS_SHOW = 'e-show';
/**
 * @hidden
 * @deprecated
 */
var CLS_HIDE = 'e-hide';
/**
 * @hidden
 * @deprecated
 */
var CLS_VISIBLE = 'e-visible';
/**
 * @hidden
 * @deprecated
 */
var CLS_FOCUS = 'e-focused';
/**
 * @hidden
 * @deprecated
 */
var CLS_RM_WHITE_SPACE = 'e-remove-white-space';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMGRIGHT = 'e-imgright';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMGLEFT = 'e-imgleft';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMGCENTER = 'e-imgcenter';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMGBREAK = 'e-imgbreak';
/**
 * @hidden
 * @deprecated
 */
var CLS_CAPTION = 'e-img-caption';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_CAPTION = 'e-rte-img-caption';
/**
 * @hidden
 * @deprecated
 */
var CLS_CAPINLINE = 'e-caption-inline';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMGINLINE = 'e-imginline';
/**
 * @hidden
 * @deprecated
 */
var CLS_COUNT = 'e-rte-character-count';
/**
 * @hidden
 * @deprecated
 */
var CLS_WARNING = 'e-warning';
/**
 * @hidden
 * @deprecated
 */
var CLS_ERROR = 'e-error';
/**
 * @hidden
 * @deprecated
 */
var CLS_ICONS = 'e-icons';
/**
 * @hidden
 * @deprecated
 */
var CLS_ACTIVE = 'e-active';
/**
 * @hidden
 * @deprecated
 */
var CLS_EXPAND_OPEN = 'e-expand-open';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_ELEMENTS = 'e-rte-elements';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_BTN = 'e-tbar-btn';
/**
 * @hidden
 * @deprecated
 */
var CLS_HR_SEPARATOR = 'e-rte-horizontal-separator';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_IOS_FIX = 'e-tbar-ios-fixed';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_STATIC = 'e-tb-static';
/**
 * @hidden
 * @deprecated
 */
var CLS_FORMATS_TB_BTN = 'e-formats-tbar-btn';
/**
 * @hidden
 * @deprecated
 */
var CLS_FONT_NAME_TB_BTN = 'e-font-name-tbar-btn';
/**
 * @hidden
 * @deprecated
 */
var CLS_FONT_SIZE_TB_BTN = 'e-font-size-tbar-btn';
/**
 * @hidden
 * @deprecated
 */
var CLS_FONT_COLOR_TARGET = 'e-rte-fontcolor-element';
/**
 * @hidden
 * @deprecated
 */
var CLS_BACKGROUND_COLOR_TARGET = 'e-rte-backgroundcolor-element';
/**
 * @hidden
 * @deprecated
 */
var CLS_COLOR_CONTENT = 'e-rte-color-content';
/**
 * @hidden
 * @deprecated
 */
var CLS_FONT_COLOR_DROPDOWN = 'e-rte-fontcolor-dropdown';
/**
 * @hidden
 * @deprecated
 */
var CLS_BACKGROUND_COLOR_DROPDOWN = 'e-rte-backgroundcolor-dropdown';
/**
 * @hidden
 * @deprecated
 */
var CLS_COLOR_PALETTE = 'e-rte-square-palette';
/**
 * @hidden
 * @deprecated
 */
var CLS_FONT_COLOR_PICKER = 'e-rte-fontcolor-colorpicker';
/**
 * @hidden
 * @deprecated
 */
var CLS_BACKGROUND_COLOR_PICKER = 'e-rte-backgroundcolor-colorpicker';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_READONLY = 'e-rte-readonly';
/**
 * @hidden
 * @deprecated
 */
var CLS_TABLE_SEL = 'e-cell-select';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_DASH_BOR = 'e-dashed-border';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_ALT_BOR = 'e-alternate-border';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_COL_RES = 'e-column-resize';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_ROW_RES = 'e-row-resize';
/**
 * @hidden
 * @deprecated
 */
var CLS_TB_BOX_RES = 'e-table-box';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_HIDDEN = 'e-rte-hidden';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_PASTE_KEEP_FORMAT = 'e-rte-keepformat';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_PASTE_REMOVE_FORMAT = 'e-rte-removeformat';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_PASTE_PLAIN_FORMAT = 'e-rte-plainformat';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_PASTE_OK = 'e-rte-pasteok';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_PASTE_CANCEL = 'e-rte-pastecancel';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_DIALOG_MIN_HEIGHT = 'e-rte-dialog-minheight';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_RES_HANDLE = 'e-resize-handle';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_RES_EAST = 'e-south-east';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_IMAGE = 'e-rte-image';
/**
 * @hidden
 * @deprecated
 */
var CLS_RESIZE = 'e-resize';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMG_FOCUS = 'e-img-focus';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_DRAG_IMAGE = 'e-rte-drag-image';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_UPLOAD_POPUP = 'e-rte-upload-popup';
/**
 * @hidden
 * @deprecated
 */
var CLS_POPUP_OPEN = 'e-popup-open';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMG_RESIZE = 'e-img-resize';
/**
 * @hidden
 * @deprecated
 */
var CLS_DROPAREA = 'e-droparea';
/**
 * @hidden
 * @deprecated
 */
var CLS_IMG_INNER = 'e-img-inner';
/**
 * @hidden
 * @deprecated
 */
var CLS_UPLOAD_FILES = 'e-upload-files';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_DIALOG_UPLOAD = 'e-rte-dialog-upload';
/**
 * @hidden
 * @deprecated
 */
var CLS_RTE_RES_CNT = 'e-rte-resize';
/**
 * @hidden
 * @deprecated
 */
var CLS_CUSTOM_TILE = 'e-custom-tile';
/**
 * @hidden
 * @deprecated
 */
var CLS_NOCOLOR_ITEM = 'e-nocolor-item';
/**
 * @hidden
 * @deprecated
 */
var CLS_TABLE_BORDER = 'e-rte-table-border';

/**
 * Defines types of Render
 * @hidden
 * @deprecated
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
var templateItems = ['alignments', 'formats', 'fontname', 'fontsize', 'fontcolor', 'backgroundcolor', 'align', 'display', 'tablerows', 'tablecolumns', 'tablecellhorizontalalign', 'tablecellverticalalign', 'styles'];
var tools = {
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
        'command': 'Formats',
        'subCommand': 'Pre'
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
var alignmentLocale = [
    { locale: 'alignmentsDropDownLeft', value: 'JustifyLeft' },
    { locale: 'alignmentsDropDownCenter', value: 'JustifyCenter' },
    { locale: 'alignmentsDropDownRight', value: 'JustifyRight' },
    { locale: 'alignmentsDropDownJustify', value: 'JustifyFull' }
];
var alignmentItems = [
    { iconCss: 'e-icons e-justify-left', text: 'Align Left', command: 'Alignments', subCommand: 'JustifyLeft' },
    { iconCss: 'e-icons e-justify-center', text: 'Align Center', command: 'Alignments', subCommand: 'JustifyCenter' },
    { iconCss: 'e-icons e-justify-right', text: 'Align Right', command: 'Alignments', subCommand: 'JustifyRight' },
    { iconCss: 'e-icons e-justify-full', text: 'Align Justify', command: 'Alignments', subCommand: 'JustifyFull' }
];
var imageAlignItems = [
    { iconCss: 'e-icons e-justify-left', command: 'Images', subCommand: 'JustifyLeft' },
    { iconCss: 'e-icons e-justify-center', command: 'Images', subCommand: 'JustifyCenter' },
    { iconCss: 'e-icons e-justify-right', command: 'Images', subCommand: 'JustifyRight' },
];
var displayLocale = [
    { locale: 'imageDisplayDropDownInline', value: 'Inline' },
    { locale: 'imageDisplayDropDownBreak', value: 'Break' }
];
var imageDisplayItems = [
    { text: 'Inline', cssClass: 'e-inline', command: 'Images', subCommand: 'Inline' },
    { text: 'Break', cssClass: 'e-break', command: 'Images', subCommand: 'Break' },
];
var tableRowLocale = [
    { locale: 'tableInsertRowDropDownBefore', value: 'InsertRowBefore' },
    { locale: 'tableInsertRowDropDownAfter', value: 'InsertRowAfter' },
    { locale: 'tableInsertRowDropDownDelete', value: 'DeleteRow' }
];
var tableRowsItems = [
    { iconCss: 'e-icons e-insert-row-before', text: 'Insert row before', command: 'Table', subCommand: 'InsertRowBefore' },
    { iconCss: 'e-icons e-insert-row-after', text: 'Insert row after', command: 'Table', subCommand: 'InsertRowAfter' },
    { iconCss: 'e-icons e-delete-row', text: 'Delete row', command: 'Table', subCommand: 'DeleteRow' },
];
var tableColumnLocale = [
    { locale: 'tableInsertColumnDropDownLeft', value: 'InsertColumnLeft' },
    { locale: 'tableInsertColumnDropDownRight', value: 'InsertColumnRight' },
    { locale: 'tableInsertColumnDropDownDelete', value: 'DeleteColumn' }
];
var tableColumnsItems = [
    { iconCss: 'e-icons e-insert-column-left', text: 'Insert column left', command: 'Table', subCommand: 'InsertColumnLeft' },
    { iconCss: 'e-icons e-insert-column-right', text: 'Insert column right', command: 'Table', subCommand: 'InsertColumnRight' },
    { iconCss: 'e-icons e-delete-column', text: 'Delete column', command: 'Table', subCommand: 'DeleteColumn' },
];
var tableVerticalLocale = [
    { locale: 'tableVerticalAlignDropDownTop', value: 'AlignTop' },
    { locale: 'tableVerticalAlignDropDownMiddle', value: 'AlignMiddle' },
    { locale: 'tableVerticalAlignDropDownBottom', value: 'AlignBottom' }
];
var TableCellVerticalAlignItems = [
    { iconCss: 'e-icons e-align-top', text: 'Align Top', command: 'Table', subCommand: 'AlignTop' },
    { iconCss: 'e-icons e-align-middle', text: 'Align Middle', command: 'Table', subCommand: 'AlignMiddle' },
    { iconCss: 'e-icons e-align-bottom', text: 'Align Bottom', command: 'Table', subCommand: 'AlignBottom' },
];
var tableStyleLocale = [
    { locale: 'tableStylesDropDownDashedBorder', value: 'Dashed' },
    { locale: 'tableStylesDropDownAlternateRows', value: 'Alternate' }
];
var TableStyleItems = [
    { text: 'Dashed Borders', cssClass: 'e-dashed-borders', command: 'Table', subCommand: 'Dashed' },
    { text: 'Alternate Rows', cssClass: 'e-alternate-rows', command: 'Table', subCommand: 'Alternate' }
];
function getLocale(self, localeItems, item) {
    for (var i = 0; localeItems.length > i; i++) {
        if (localeItems[i].value === item.subCommand) {
            return self.localeObj.getConstant(localeItems[i].locale);
        }
    }
    return item.text;
}
function updateDropDownLocale(self) {
    alignmentItems.forEach(function (item, i) {
        alignmentItems[i].text = getLocale(self, alignmentLocale, alignmentItems[i]);
    });
    imageDisplayItems.forEach(function (item, i) {
        imageDisplayItems[i].text = getLocale(self, displayLocale, imageDisplayItems[i]);
    });
    tableRowsItems.forEach(function (item, i) {
        tableRowsItems[i].text = getLocale(self, tableRowLocale, tableRowsItems[i]);
    });
    tableColumnsItems.forEach(function (item, i) {
        tableColumnsItems[i].text = getLocale(self, tableColumnLocale, tableColumnsItems[i]);
    });
    TableCellVerticalAlignItems.forEach(function (item, i) {
        TableCellVerticalAlignItems[i].text = getLocale(self, tableVerticalLocale, TableCellVerticalAlignItems[i]);
    });
    TableStyleItems.forEach(function (item, i) {
        TableStyleItems[i].text = getLocale(self, tableStyleLocale, TableStyleItems[i]);
    });
}

// tslint:disable
/**
 * Export default locale
 */
var defaultLocale = {
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
var toolsLocale = {
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
var undoRedoItems = ['Undo', 'Redo'];
function getIndex(val, items) {
    var index = -1;
    items.some(function (item, i) {
        if (typeof item === 'string' && val === item.toLocaleLowerCase()) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}
function hasClass(element, className) {
    var hasClass = false;
    if (element.classList.contains(className)) {
        hasClass = true;
    }
    return hasClass;
}
function getDropDownValue(items, value, type, returnType) {
    var data;
    var result;
    for (var k = 0; k < items.length; k++) {
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
    var result = false;
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
    var y = 0;
    if (isIFrame) {
        y = window.pageYOffset + parentElement.getBoundingClientRect().top + e.clientY;
    }
    else {
        y = e.pageY;
    }
    return y;
}
function getTooltipText(item, serviceLocator) {
    var i10n = serviceLocator.getService('rteLocale');
    var itemLocale = toolsLocale[item];
    var tooltipText = i10n.getConstant(itemLocale);
    return tooltipText;
}
function setToolbarStatus(e, isPopToolbar) {
    var dropDown = e.dropDownModule;
    var data = e.args;
    var keys = Object.keys(e.args);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        for (var j = 0; j < e.tbItems.length; j++) {
            var item = e.tbItems[j].subCommand;
            var itemStr = item && item.toLocaleLowerCase();
            if (item && (itemStr === key) || (item === 'UL' && key === 'unorderedlist') || (item === 'OL' && key === 'orderedlist') ||
                (itemStr === 'pre' && key === 'insertcode')) {
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
                    var value = ((data[key]) ? data[key] : '');
                    var result = '';
                    switch (key) {
                        case 'formats':
                            if (isNullOrUndefined(dropDown.formatDropDown) || isPopToolbar ||
                                (!isNullOrUndefined(dropDown.formatDropDown) && dropDown.formatDropDown.isDestroyed)) {
                                return;
                            }
                            var formatItems = e.parent.format.types;
                            result = getDropDownValue(formatItems, value, 'subCommand', 'text');
                            var formatContent = isNullOrUndefined(e.parent.format.default) ? formatItems[0].text :
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
                            var alignItems = alignmentItems;
                            result = getDropDownValue(alignItems, value, 'subCommand', 'iconCss');
                            dropDown.alignDropDown.iconCss = isNullOrUndefined(result) ? 'e-icons e-justify-left' : result;
                            dropDown.alignDropDown.dataBind();
                            break;
                        case 'fontname':
                            if (isNullOrUndefined(dropDown.fontNameDropDown) || isPopToolbar ||
                                (!isNullOrUndefined(dropDown.fontNameDropDown) && dropDown.fontNameDropDown.isDestroyed)) {
                                return;
                            }
                            var fontNameItems = e.parent.fontFamily.items;
                            result = getDropDownValue(fontNameItems, value, 'value', 'text');
                            var fontNameContent = isNullOrUndefined(e.parent.fontFamily.default) ? fontNameItems[0].text :
                                e.parent.fontFamily.default;
                            var name_1 = (isNullOrUndefined(result) ? fontNameContent : result);
                            e.tbElements[j].title = name_1;
                            dropDown.fontNameDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontFamily.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + name_1 + '</span></span>');
                            dropDown.fontNameDropDown.dataBind();
                            break;
                        case 'fontsize':
                            if (isNullOrUndefined(dropDown.fontSizeDropDown) ||
                                (!isNullOrUndefined(dropDown.fontSizeDropDown) && dropDown.fontSizeDropDown.isDestroyed)) {
                                return;
                            }
                            var fontSizeItems = e.parent.fontSize.items;
                            var fontSizeContent = isNullOrUndefined(e.parent.fontSize.default) ? fontSizeItems[1].text :
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
    var itemsIndex = [];
    for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < toolbarItems.length; j++) {
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
                else if (items[i] === 'InsertCode' && toolbarItems[j].subCommand === 'Pre') {
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
    var i = 0;
    var trgItems = getTBarItemsIndex(getCollection(undoRedoItems), baseToolbar.toolbarObj.items);
    var tbItems = selectAll('.' + CLS_TB_ITEM, baseToolbar.toolbarObj.element);
    var keys = Object.keys(undoRedoStatus);
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        var target = tbItems[trgItems[i]];
        if (target) {
            baseToolbar.toolbarObj.enableItems(target, undoRedoStatus[key]);
        }
        i++;
    }
}
/**
 * To dispatch the event manually
 * @hidden
 * @deprecated
 */
function dispatchEvent(element, type) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
}
function parseHtml(value) {
    var tempNode = createElement('template');
    tempNode.innerHTML = value;
    if (tempNode.content instanceof DocumentFragment) {
        return tempNode.content;
    }
    else {
        return document.createRange().createContextualFragment(value);
    }
}
function getTextNodesUnder(docElement, node) {
    var nodes = [];
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
    var convertedValue = {};
    var keys = Object.keys(obj);
    for (var i = 0; i < Object.keys(obj).length; i++) {
        convertedValue[keys[i].toLocaleLowerCase()] = obj[keys[i]];
    }
    return convertedValue;
}
function getEditValue(value, rteObj) {
    var val;
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
    var tempNode = document.createElement('div');
    tempNode.innerHTML = value;
    var childNodes = tempNode.childNodes;
    if (childNodes.length > 0) {
        [].slice.call(childNodes).forEach(function (childNode) {
            if ((childNode.nodeType === Node.TEXT_NODE && childNode.parentNode === tempNode
                && childNode.textContent.trim() !== '') || (childNode.nodeName === 'IMG' &&
                childNode.parentNode === tempNode)) {
                var defaultTag = document.createElement('p');
                var parentNode = childNode.parentNode;
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
function sanitizeHelper(value, parent) {
    if (parent.enableHtmlSanitizer) {
        var item = SanitizeHtmlHelper.beforeSanitize();
        var beforeEvent = {
            cancel: false,
            helper: null
        };
        extend(item, item, beforeEvent);
        parent.trigger('beforeSanitizeHtml', item);
        if (item.cancel && !isNullOrUndefined(item.helper)) {
            value = item.helper(value);
        }
        else if (!item.cancel) {
            value = SanitizeHtmlHelper.serializeValue(item, value);
        }
    }
    return value;
}
//Converting the base64 url to blob
function convertToBlob(dataUrl) {
    var arr = dataUrl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 * @hidden
 * @deprecated
 */
var ToolbarRenderer = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for toolbar renderer module
     */
    function ToolbarRenderer(parent) {
        this.parent = parent;
        this.wireEvent();
    }
    ToolbarRenderer.prototype.wireEvent = function () {
        this.parent.on(destroy, this.unWireEvent, this);
    };
    ToolbarRenderer.prototype.unWireEvent = function () {
        this.parent.off(destroy, this.unWireEvent);
        if (this.popupOverlay) {
            EventHandler.remove(this.popupOverlay, 'click touchmove', this.onPopupOverlay);
        }
        this.removePopupContainer();
    };
    ToolbarRenderer.prototype.toolbarBeforeCreate = function (e) {
        if (this.mode === 'Extended') {
            e.enableCollision = false;
        }
    };
    ToolbarRenderer.prototype.toolbarCreated = function () {
        this.parent.notify(toolbarCreated, this);
    };
    ToolbarRenderer.prototype.toolbarClicked = function (args) {
        if (this.parent.readonly || !this.parent.enabled) {
            return;
        }
        this.parent.notify(toolbarClick, args);
        this.parent.trigger('toolbarClick', args);
    };
    ToolbarRenderer.prototype.dropDownSelected = function (args) {
        this.parent.notify(dropDownSelect, args);
        this.onPopupOverlay();
    };
    ToolbarRenderer.prototype.beforeDropDownItemRender = function (args) {
        if (this.parent.readonly || !this.parent.enabled) {
            return;
        }
        this.parent.notify(beforeDropDownItemRender, args);
    };
    ToolbarRenderer.prototype.dropDownOpen = function (args) {
        if (Browser.isDevice && !args.element.parentElement.classList.contains(CLS_QUICK_DROPDOWN)) {
            this.popupModal(args.element.parentElement);
        }
        this.parent.notify(selectionSave, args);
    };
    ToolbarRenderer.prototype.dropDownClose = function (args) {
        this.removePopupContainer();
        this.parent.notify(selectionRestore, args);
    };
    ToolbarRenderer.prototype.removePopupContainer = function () {
        if (Browser.isDevice && !isNullOrUndefined(this.popupContainer)) {
            detach(this.popupContainer);
            this.popupContainer = undefined;
        }
    };
    /**
     * renderToolbar method
     * @hidden
     * @deprecated
     */
    ToolbarRenderer.prototype.renderToolbar = function (args) {
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
    };
    /**
     * renderDropDownButton method
     * @hidden
     * @deprecated
     */
    ToolbarRenderer.prototype.renderDropDownButton = function (args) {
        var _this = this;
        var css;
        args.element.classList.add(CLS_DROPDOWN_BTN);
        css = args.cssClass + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN;
        if (this.parent.inlineMode.enable && Browser.isDevice) {
            css = css + ' ' + CLS_INLINE_DROPDOWN;
        }
        var proxy = this;
        var dropDown = new DropDownButton({
            items: args.items,
            iconCss: args.iconCss,
            cssClass: css,
            content: args.content,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            select: this.dropDownSelected.bind(this),
            beforeOpen: function (args) {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    args.cancel = true;
                    return;
                }
                for (var index = 0; index < args.element.childNodes.length; index++) {
                    var divNode = _this.parent.createElement('div');
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
        var popupElement = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        return dropDown;
    };
    ToolbarRenderer.prototype.onPopupOverlay = function (args) {
        if (!isNullOrUndefined(this.popupOverlay)) {
            closest(this.popupOverlay, '.e-popup-container').style.display = 'none';
            this.popupOverlay.style.display = 'none';
            removeClass([this.popupOverlay], 'e-popup-overlay');
        }
    };
    ToolbarRenderer.prototype.setIsModel = function (element) {
        if (!closest(element, '.e-popup-container')) {
            this.popupContainer = this.parent.createElement('div', {
                className: 'e-rte-modal-popup e-popup-container e-center'
            });
            element.parentNode.insertBefore(this.popupContainer, element);
            this.popupContainer.appendChild(element);
            this.popupContainer.style.zIndex = element.style.zIndex;
            this.popupContainer.style.display = 'flex';
            element.style.position = 'relative';
            addClass([element], 'e-popup-modal');
            this.popupOverlay = this.parent.createElement('div', { className: 'e-popup-overlay' });
            this.popupOverlay.style.zIndex = (parseInt(element.style.zIndex, null) - 1).toString();
            this.popupOverlay.style.display = 'block';
            this.popupContainer.appendChild(this.popupOverlay);
            EventHandler.add(this.popupOverlay, 'click touchmove', this.onPopupOverlay, this);
        }
        else {
            element.parentElement.style.display = 'flex';
            this.popupOverlay = element.nextElementSibling;
            this.popupOverlay.style.display = 'block';
            addClass([this.popupOverlay], 'e-popup-overlay');
        }
    };
    ToolbarRenderer.prototype.paletteSelection = function (dropDownArgs, currentElement) {
        var ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
        var colorbox = [].slice.call(selectAll('.e-tile', ele.parentElement));
        removeClass(colorbox, 'e-selected');
        var style = currentElement.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
        (colorbox.filter(function (colorbox) {
            if (colorbox.style.backgroundColor === style) {
                addClass([colorbox], 'e-selected');
            }
        }));
    };
    /**
     * renderColorPickerDropDown method
     * @hidden
     * @deprecated
     */
    ToolbarRenderer.prototype.renderColorPickerDropDown = function (args, item, colorPicker) {
        var _this = this;
        var proxy = this;
        var css = CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN + ((this.parent.inlineMode) ? (' ' + CLS_INLINE_DROPDOWN) : '');
        css += (' ' + ((item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_DROPDOWN : CLS_FONT_COLOR_DROPDOWN));
        var content = proxy.parent.createElement('span', { className: CLS_COLOR_CONTENT });
        var inlineEle = proxy.parent.createElement('span', { className: args.cssClass });
        var range;
        inlineEle.style.borderBottomColor = (item === 'backgroundcolor') ?
            proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
        content.appendChild(inlineEle);
        var dropDown = new DropDownButton({
            target: colorPicker.element.parentElement, cssClass: css,
            enablePersistence: this.parent.enablePersistence, enableRtl: this.parent.enableRtl,
            beforeOpen: function (dropDownArgs) {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    dropDownArgs.cancel = true;
                    return;
                }
                var element = (dropDownArgs.event) ? dropDownArgs.event.target : null;
                proxy.currentElement = dropDown.element;
                proxy.currentDropdown = dropDown;
                proxy.paletteSelection(dropDownArgs, proxy.currentElement);
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    dropDownArgs.cancel = true;
                    var colorpickerValue = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        element.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
                    proxy.parent.notify(selectionRestore, {});
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    var parentNode = range.startContainer.parentNode;
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
                    var ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
                    var inst = getInstance(ele, ColorPicker);
                    inst.showButtons = (dropDownArgs.element.querySelector('.e-color-palette')) ? false : true;
                    inst.dataBind();
                }
                dropDownArgs.element.onclick = function (args) {
                    if (args.target.classList.contains('e-cancel')) {
                        dropDown.toggle();
                    }
                };
            },
            open: function (dropDownArgs) {
                _this.setColorPickerContentWidth(colorPicker);
                var focusEle;
                var ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
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
                    _this.popupModal(dropDownArgs.element.parentElement);
                }
                _this.pickerRefresh(dropDownArgs);
            },
            beforeClose: function (dropDownArgs) {
                var element = (dropDownArgs.event) ? dropDownArgs.event.target : null;
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    var colorpickerValue = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
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
            close: function (dropDownArgs) {
                proxy.parent.notify(selectionRestore, {});
                var dropElement = closest(dropDownArgs.element.parentElement, '.e-popup-container');
                if (dropElement) {
                    dropElement.style.display = 'none';
                    dropElement.lastElementChild.style.display = 'none';
                    removeClass([dropElement.lastElementChild], 'e-popup-overlay');
                }
                if (Browser.isDevice && !isNullOrUndefined(dropElement)) {
                    detach(dropElement);
                }
            }
        });
        dropDown.isStringTemplate = true;
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        var popupElement = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        dropDown.element.insertBefore(content, dropDown.element.querySelector('.e-caret'));
        args.element.tabIndex = -1;
        dropDown.element.removeAttribute('type');
        dropDown.element.onmousedown = function () { proxy.parent.notify(selectionSave, {}); };
        dropDown.element.onkeydown = function () { proxy.parent.notify(selectionSave, {}); };
        return dropDown;
    };
    ToolbarRenderer.prototype.pickerRefresh = function (dropDownArgs) {
        if (this.parent.backgroundColor.mode === 'Picker') {
            var popupElem = dropDownArgs.element.parentElement;
            popupElem.style.width = (popupElem.offsetWidth + 5).toString() + 'px';
            getInstance(popupElem, Popup).refreshPosition(popupElem);
            popupElem.style.width = (popupElem.offsetWidth - 5).toString() + 'px';
        }
    };
    ToolbarRenderer.prototype.popupModal = function (element) {
        var popupInst = getInstance(element, Popup);
        popupInst.relateTo = document.body;
        popupInst.position = { X: 0, Y: 0 };
        popupInst.targetType = 'container';
        popupInst.collision = { X: 'fit', Y: 'fit' };
        popupInst.offsetY = 4;
        popupInst.dataBind();
        this.setIsModel(element);
    };
    ToolbarRenderer.prototype.setColorPickerContentWidth = function (colorPicker) {
        var colorPickerContent = colorPicker.element.nextSibling;
        if (colorPickerContent.style.width === '0px') {
            colorPickerContent.style.width = '';
            var borderWidth = parseInt(getComputedStyle(colorPickerContent).borderBottomWidth, 10);
            colorPickerContent.style.width = formatUnit(colorPickerContent.children[0].offsetWidth
                + borderWidth + borderWidth);
        }
    };
    /**
     * renderColorPicker method
     * @hidden
     * @deprecated
     */
    ToolbarRenderer.prototype.renderColorPicker = function (args, item) {
        var _this = this;
        var proxy = this;
        this.colorPicker = new ColorPicker({
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            inline: true,
            created: function () {
                var value = (item === 'backgroundcolor') ? proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
                _this.colorPicker.setProperties({ value: value });
            },
            mode: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.mode : proxy.parent.fontColor.mode),
            modeSwitcher: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.modeSwitcher : proxy.parent.fontColor.modeSwitcher),
            beforeTileRender: function (args) {
                args.element.classList.add(CLS_COLOR_PALETTE);
                args.element.classList.add(CLS_CUSTOM_TILE);
                if (args.value === '') {
                    args.element.classList.add(CLS_NOCOLOR_ITEM);
                }
            },
            change: function (colorPickerArgs) {
                var colorpickerValue = colorPickerArgs.currentValue.rgba;
                colorPickerArgs.item = {
                    command: args.command,
                    subCommand: args.subCommand,
                    value: colorpickerValue
                };
                proxy.parent.notify(selectionRestore, {});
                proxy.currentElement.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor = colorpickerValue;
                var range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                    closest(range.startContainer.parentNode, 'td,th')) && range.collapsed) {
                    proxy.parent.notify(tableColorPickerChanged, colorPickerArgs);
                }
                else {
                    proxy.parent.notify(colorPickerChanged, colorPickerArgs);
                }
                proxy.currentDropdown.toggle();
            },
            beforeModeSwitch: function (args) {
                _this.colorPicker.showButtons = args.mode === 'Palette' ? false : true;
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
    };
    /**
     * The function is used to render RichTextEditor toolbar
     * @hidden
     * @deprecated
     */
    ToolbarRenderer.prototype.renderPanel = function () {
        this.getPanel().classList.add(CLS_TOOLBAR);
    };
    /**
     * Get the toolbar element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    ToolbarRenderer.prototype.getPanel = function () {
        return this.toolbarPanel;
    };
    /**
     * Set the toolbar element of RichTextEditor
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ToolbarRenderer.prototype.setPanel = function (panel) {
        this.toolbarPanel = panel;
    };
    return ToolbarRenderer;
}());

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
var BaseToolbar = /** @__PURE__ @class */ (function () {
    function BaseToolbar(parent, serviceLocator) {
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
    BaseToolbar.prototype.addEventListener = function () {
        this.parent.on(rtlMode, this.setRtl, this);
        this.parent.on(destroy, this.removeEventListener, this);
    };
    BaseToolbar.prototype.removeEventListener = function () {
        this.parent.off(rtlMode, this.setRtl);
        this.parent.off(destroy, this.removeEventListener);
    };
    BaseToolbar.prototype.setRtl = function (args) {
        if (!isNullOrUndefined(this.toolbarObj)) {
            this.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    };
    BaseToolbar.prototype.getTemplateObject = function (itemStr, container) {
        var tagName;
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
    };
    /**
     * getObject method
     * @hidden
     * @deprecated
     */
    BaseToolbar.prototype.getObject = function (item, container) {
        var itemStr = item.toLowerCase();
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
    };
    /**
     * @hidden
     * @deprecated
     */
    BaseToolbar.prototype.getItems = function (tbItems, container) {
        var _this = this;
        if (this.parent.toolbarSettings.items.length < 1) {
            return [];
        }
        var items = [];
        var _loop_1 = function (item) {
            switch (typeof item) {
                case 'string':
                    items.push(this_1.getObject(item, container));
                    break;
                default:
                    if (!isNullOrUndefined(item.click)) {
                        var proxy_1 = item;
                        var callback_1 = proxy_1.click;
                        proxy_1.click = function () {
                            if (proxy_1.undo && _this.parent.formatter.getUndoRedoStack().length === 0) {
                                _this.parent.formatter.saveData();
                            }
                            callback_1.call(_this);
                            if (proxy_1.undo) {
                                _this.parent.formatter.saveData();
                            }
                        };
                    }
                    items.push(item);
            }
        };
        var this_1 = this;
        for (var _i = 0, tbItems_1 = tbItems; _i < tbItems_1.length; _i++) {
            var item = tbItems_1[_i];
            _loop_1(item);
        }
        return items;
    };
    BaseToolbar.prototype.getToolbarOptions = function (args) {
        return {
            target: args.target,
            rteToolbarObj: this,
            items: this.getItems(args.items, args.container),
            overflowMode: args.mode,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl
        };
    };
    /**
     * render method
     * @hidden
     * @deprecated
     */
    BaseToolbar.prototype.render = function (args) {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        this.toolbarRenderer.renderToolbar(this.getToolbarOptions(args));
    };
    return BaseToolbar;
}());

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
var DropDownButtons = /** @__PURE__ @class */ (function () {
    function DropDownButtons(parent, serviceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    DropDownButtons.prototype.initializeInstance = function () {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
    };
    DropDownButtons.prototype.beforeRender = function (args) {
        var item = args.item;
        if (item.cssClass) {
            addClass([args.element], item.cssClass);
        }
        if (item.command === 'Alignments' || item.subCommand === 'JustifyLeft'
            || item.subCommand === 'JustifyRight' || item.subCommand === 'JustifyCenter') {
            args.element.setAttribute('title', getTooltipText(item.subCommand.toLocaleLowerCase(), this.locator));
        }
    };
    DropDownButtons.prototype.dropdownContent = function (width, type, content) {
        return ('<span style="display: inline-flex;' + 'width:' + ((type === 'quick') ? 'auto' : width) + '" >' +
            '<span class="e-rte-dropdown-btn-text">' + content + '</span></span>');
    };
    /**
     * renderDropDowns method
     * @hidden
     * @deprecated
     */
    DropDownButtons.prototype.renderDropDowns = function (args) {
        var _this = this;
        this.initializeInstance();
        var type = args.containerType;
        var tbElement = args.container;
        templateItems.forEach(function (item) {
            var targetElement = undefined;
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                    case 'formats':
                        targetElement = select('#' + _this.parent.getID() + '_' + type + '_Formats', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        var formatItem = _this.parent.format.types.slice();
                        formatItem.forEach(function (item) {
                            Object.defineProperties(item, {
                                command: { value: 'Formats', enumerable: true }, subCommand: { value: item.value, enumerable: true }
                            });
                        });
                        var formatContent = isNullOrUndefined(_this.parent.format.default) ? formatItem[0].text :
                            _this.parent.format.default;
                        _this.formatDropDown = _this.toolbarRenderer.renderDropDownButton({
                            iconCss: ((type === 'quick') ? 'e-formats e-icons' : ''),
                            content: _this.dropdownContent(_this.parent.format.width, type, ((type === 'quick') ? '' : getDropDownValue(formatItem, formatContent, 'text', 'text'))),
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_FORMATS_TB_BTN,
                            itemName: 'Formats', items: formatItem, element: targetElement
                        });
                        break;
                    case 'fontname':
                        targetElement = select('#' + _this.parent.getID() + '_' + type + '_FontName', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        var fontItem = _this.parent.fontFamily.items.slice();
                        fontItem.forEach(function (item) {
                            Object.defineProperties(item, {
                                command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontName', enumerable: true }
                            });
                        });
                        var fontNameContent = isNullOrUndefined(_this.parent.fontFamily.default) ? fontItem[0].text :
                            _this.parent.fontFamily.default;
                        _this.fontNameDropDown = _this.toolbarRenderer.renderDropDownButton({
                            iconCss: ((type === 'quick') ? 'e-font-name e-icons' : ''),
                            content: _this.dropdownContent(_this.parent.fontFamily.width, type, ((type === 'quick') ? '' : getDropDownValue(fontItem, fontNameContent, 'text', 'text'))),
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_FONT_NAME_TB_BTN,
                            itemName: 'FontName', items: fontItem, element: targetElement
                        });
                        if (!isNullOrUndefined(_this.parent.fontFamily.default)) {
                            _this.getEditNode().style.fontFamily = _this.parent.fontFamily.default;
                        }
                        break;
                    case 'fontsize':
                        targetElement = select('#' + _this.parent.getID() + '_' + type + '_FontSize', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        var fontsize = _this.parent.fontSize.items.slice();
                        fontsize.forEach(function (item) {
                            Object.defineProperties(item, {
                                command: { value: 'Font', enumerable: true }, subCommand: { value: 'FontSize', enumerable: true }
                            });
                        });
                        var fontSizeContent = isNullOrUndefined(_this.parent.fontSize.default) ? fontsize[1].text :
                            _this.parent.fontSize.default;
                        _this.fontSizeDropDown = _this.toolbarRenderer.renderDropDownButton({
                            content: _this.dropdownContent(_this.parent.fontSize.width, type, getFormattedFontSize(getDropDownValue(fontsize, fontSizeContent.replace(/\s/g, ''), 'value', 'text'))),
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS + ' ' + CLS_FONT_SIZE_TB_BTN,
                            itemName: 'FontSize', items: fontsize, element: targetElement
                        });
                        if (!isNullOrUndefined(_this.parent.fontSize.default)) {
                            _this.getEditNode().style.fontSize = _this.parent.fontSize.default;
                        }
                        break;
                    case 'alignments':
                        targetElement = select('#' + _this.parent.getID() + '_' + type + '_Alignments', tbElement);
                        if (isNullOrUndefined(targetElement) || targetElement.classList.contains(CLS_DROPDOWN_BTN)) {
                            return;
                        }
                        _this.alignDropDown = _this.toolbarRenderer.renderDropDownButton({
                            iconCss: 'e-justify-left e-icons',
                            cssClass: CLS_DROPDOWN_POPUP + ' ' + CLS_DROPDOWN_ITEMS,
                            itemName: 'Alignments', items: alignmentItems, element: targetElement
                        });
                        break;
                    case 'align':
                        _this.imageAlignmentDropDown(type, tbElement, targetElement);
                        break;
                    case 'display':
                        _this.imageDisplayDropDown(type, tbElement, targetElement);
                        break;
                    case 'tablerows':
                        _this.rowDropDown(type, tbElement, targetElement);
                        break;
                    case 'tablecolumns':
                        _this.columnDropDown(type, tbElement, targetElement);
                        break;
                    case 'tablecellverticalalign':
                        _this.verticalAlignDropDown(type, tbElement, targetElement);
                        break;
                    case 'styles':
                        _this.tableStylesDropDown(type, tbElement, targetElement);
                        break;
                }
            }
        });
    };
    DropDownButtons.prototype.getUpdateItems = function (items, value) {
        var dropDownItems = items.slice();
        dropDownItems.forEach(function (item) {
            Object.defineProperties(item, {
                command: { value: (value === 'Format' ? 'Formats' : 'Font'), enumerable: true },
                subCommand: { value: (value === 'Format' ? item.value : value), enumerable: true }
            });
        });
        return dropDownItems;
    };
    DropDownButtons.prototype.onPropertyChanged = function (model) {
        var newProp = model.newProp;
        var type;
        var content;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'fontFamily':
                    if (this.fontNameDropDown) {
                        for (var _b = 0, _c = Object.keys(newProp.fontFamily); _b < _c.length; _b++) {
                            var fontFamily = _c[_b];
                            switch (fontFamily) {
                                case 'default':
                                case 'width':
                                    var fontItems = this.fontNameDropDown.items;
                                    type = !isNullOrUndefined(closest(this.fontNameDropDown.element, '.' + CLS_QUICK_TB)) ?
                                        'quick' : 'toolbar';
                                    var fontNameContent = isNullOrUndefined(this.parent.fontFamily.default) ? fontItems[0].text :
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
                        for (var _d = 0, _e = Object.keys(newProp.fontSize); _d < _e.length; _d++) {
                            var fontSize = _e[_d];
                            switch (fontSize) {
                                case 'default':
                                case 'width':
                                    var fontsize = this.fontSizeDropDown.items;
                                    type = !isNullOrUndefined(closest(this.fontSizeDropDown.element, '.' + CLS_QUICK_TB)) ? 'quick' : 'toolbar';
                                    var fontSizeContent = isNullOrUndefined(this.parent.fontSize.default) ? fontsize[1].text :
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
                        for (var _f = 0, _g = Object.keys(newProp.format); _f < _g.length; _f++) {
                            var format = _g[_f];
                            switch (format) {
                                case 'default':
                                case 'width':
                                    var formatItems = this.formatDropDown.items;
                                    type = !isNullOrUndefined(closest(this.formatDropDown.element, '.' + CLS_QUICK_TB)) ? 'quick' : 'toolbar';
                                    var formatContent = isNullOrUndefined(this.parent.format.default) ? formatItems[0].text :
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
    };
    DropDownButtons.prototype.getEditNode = function () {
        return this.parent.contentModule.getEditPanel();
    };
    DropDownButtons.prototype.rowDropDown = function (type, tbElement, targetElement) {
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
    };
    DropDownButtons.prototype.columnDropDown = function (type, tbElement, targetElement) {
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
    };
    DropDownButtons.prototype.verticalAlignDropDown = function (type, tbElement, targetElement) {
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
    };
    DropDownButtons.prototype.imageDisplayDropDown = function (type, tbElement, targetElement) {
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
    };
    DropDownButtons.prototype.imageAlignmentDropDown = function (type, tbElement, targetElement) {
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
    };
    DropDownButtons.prototype.tableStylesDropDown = function (type, tbElement, targetElement) {
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
    };
    DropDownButtons.prototype.removeDropDownClasses = function (target) {
        removeClass([target], [
            CLS_DROPDOWN_BTN,
            CLS_DROPDOWN_POPUP,
            CLS_DROPDOWN_ICONS,
            CLS_DROPDOWN_ITEMS
        ]);
    };
    /**
     * destroyDropDowns method
     * @hidden
     * @deprecated
     */
    DropDownButtons.prototype.destroyDropDowns = function () {
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
    };
    DropDownButtons.prototype.setRtl = function (args) {
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
    };
    DropDownButtons.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(beforeDropDownItemRender, this.beforeRender, this);
        this.parent.on(iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(rtlMode, this.setRtl, this);
        this.parent.on(destroy, this.removeEventListener, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
    };
    DropDownButtons.prototype.onIframeMouseDown = function () {
        dispatchEvent(document, 'mousedown');
    };
    DropDownButtons.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(rtlMode, this.setRtl);
        this.parent.off(beforeDropDownItemRender, this.beforeRender);
        this.parent.off(destroy, this.removeEventListener);
        this.parent.off(modelChanged, this.onPropertyChanged);
    };
    return DropDownButtons;
}());

/**
 * ServiceLocator
 * @hidden
 * @deprecated
 */
var ServiceLocator = /** @__PURE__ @class */ (function () {
    function ServiceLocator() {
        this.services = {};
    }
    /**
     * register method
     * @hidden
     * @deprecated
     */
    ServiceLocator.prototype.register = function (name, type) {
        if (isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    };
    /**
     * getService method
     * @hidden
     * @deprecated
     */
    ServiceLocator.prototype.getService = function (name) {
        if (isNullOrUndefined(this.services[name])) {
            throw "The service " + name + " is not registered";
        }
        return this.services[name];
    };
    return ServiceLocator;
}());

/**
 * RendererFactory
 * @hidden
 * @deprecated
 */
var RendererFactory = /** @__PURE__ @class */ (function () {
    function RendererFactory() {
        this.rendererMap = {};
    }
    /**
     * addRenderer method
     * @hidden
     * @deprecated
     */
    RendererFactory.prototype.addRenderer = function (name, type) {
        var rName = getEnumValue(RenderType, name);
        if (isNullOrUndefined(this.rendererMap[rName])) {
            this.rendererMap[rName] = type;
        }
    };
    /**
     * getRenderer method
     * @hidden
     * @deprecated
     */
    RendererFactory.prototype.getRenderer = function (name) {
        var rName = getEnumValue(RenderType, name);
        if (isNullOrUndefined(this.rendererMap[rName])) {
            throw "The renderer " + rName + " is not found";
        }
        else {
            return this.rendererMap[rName];
        }
    };
    return RendererFactory;
}());

/**
 * `ToolbarAction` module is used to toolbar click action
 */
var ToolbarAction = /** @__PURE__ @class */ (function () {
    function ToolbarAction(parent) {
        this.parent = parent;
        this.addEventListener();
        this.serviceLocator = new ServiceLocator;
        this.serviceLocator.register('rendererFactory', new RendererFactory);
    }
    ToolbarAction.prototype.addEventListener = function () {
        this.parent.on(toolbarClick, this.toolbarClick, this);
        this.parent.on(dropDownSelect, this.dropDownSelect, this);
        this.parent.on(colorPickerChanged, this.renderSelection, this);
        this.parent.on(destroy, this.removeEventListener, this);
    };
    ToolbarAction.prototype.toolbarClick = function (args) {
        if (isNullOrUndefined(args.item)) {
            return;
        }
        if (!isNullOrUndefined(args.item.controlParent)) {
            var activeEle = args.item.controlParent
                .activeEle;
            if (activeEle) {
                activeEle.tabIndex = -1;
            }
        }
        this.parent.notify(htmlToolbarClick, args);
        this.parent.notify(markdownToolbarClick, args);
    };
    ToolbarAction.prototype.dropDownSelect = function (e) {
        this.parent.notify(selectionRestore, {});
        if (!(document.body.contains(document.body.querySelector('.e-rte-quick-toolbar'))
            && e.item && (e.item.command === 'Images' || e.item.command === 'Display' || e.item.command === 'Table'))) {
            var value = e.item.controlParent && this.parent.quickToolbarModule && this.parent.quickToolbarModule.tableQTBar
                && this.parent.quickToolbarModule.tableQTBar.element.contains(e.item.controlParent.element) ? 'Table' : null;
            this.parent.formatter.process(this.parent, e, e.originalEvent, value);
        }
        this.parent.notify(selectionSave, {});
    };
    ToolbarAction.prototype.renderSelection = function (args) {
        this.parent.notify(selectionRestore, {});
        this.parent.formatter.process(this.parent, args, args.originalEvent, null);
        this.parent.notify(selectionSave, {});
    };
    ToolbarAction.prototype.removeEventListener = function () {
        this.parent.off(toolbarClick, this.toolbarClick);
        this.parent.off(dropDownSelect, this.dropDownSelect);
        this.parent.off(colorPickerChanged, this.renderSelection);
        this.parent.off(destroy, this.removeEventListener);
    };
    return ToolbarAction;
}());

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
var Toolbar$1 = /** @__PURE__ @class */ (function () {
    function Toolbar$$1(parent, serviceLocator) {
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
    Toolbar$$1.prototype.initializeInstance = function () {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.editableElement = this.contentRenderer.getEditPanel();
        this.editPanel = this.contentRenderer.getPanel();
    };
    Toolbar$$1.prototype.toolbarBindEvent = function () {
        if (!this.parent.inlineMode.enable) {
            this.keyBoardModule = new KeyboardEvents(this.getToolbarElement(), {
                keyAction: this.toolBarKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
            });
        }
    };
    Toolbar$$1.prototype.toolBarKeyDown = function (e) {
        switch (e.action) {
            case 'escape':
                this.parent.contentModule.getEditPanel().focus();
                break;
        }
    };
    Toolbar$$1.prototype.createToolbarElement = function () {
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
    };
    Toolbar$$1.prototype.getToolbarMode = function () {
        var tbMode;
        switch (this.parent.toolbarSettings.type) {
            case ToolbarType.Expand:
                tbMode = 'Extended';
                break;
            default:
                tbMode = 'MultiRow';
        }
        return tbMode;
    };
    Toolbar$$1.prototype.checkToolbarResponsive = function (ele) {
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
    };
    Toolbar$$1.prototype.checkIsTransformChild = function () {
        this.isTransformChild = false;
        var transformElements = selectAll('[style*="transform"]', document);
        for (var i = 0; i < transformElements.length; i++) {
            if (!isNullOrUndefined(transformElements[i].contains) && transformElements[i].contains(this.parent.element)) {
                this.isTransformChild = true;
                break;
            }
        }
    };
    Toolbar$$1.prototype.toggleFloatClass = function (e) {
        var topValue;
        var isBody = false;
        var isFloat = false;
        var scrollParent;
        var floatOffset = this.parent.floatingToolbarOffset;
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
        var tbHeight = this.getToolbarHeight() + this.getExpandTBarPopHeight();
        if (this.isTransformChild) {
            topValue = 0;
            var scrollParentRelativeTop = 0;
            var trgHeight = this.parent.element.offsetHeight;
            if (isBody) {
                var bodyStyle = window.getComputedStyle(scrollParent);
                scrollParentRelativeTop = parseFloat(bodyStyle.marginTop.split('px')[0]) + parseFloat(bodyStyle.paddingTop.split('px')[0]);
            }
            var targetTop = this.parent.element.getBoundingClientRect().top;
            var scrollParentYOffset = (Browser.isMSPointer && isBody) ? window.pageYOffset : scrollParent.parentElement.scrollTop;
            var scrollParentRect = scrollParent.getBoundingClientRect();
            var scrollParentTop = (!isBody) ? scrollParentRect.top : (scrollParentRect.top + scrollParentYOffset);
            var outOfRange = ((targetTop - ((!isBody) ? scrollParentTop : 0)) + trgHeight > tbHeight + floatOffset) ? false : true;
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
            var parent_1 = this.parent.element.getBoundingClientRect();
            if (window.innerHeight < parent_1.top) {
                return;
            }
            topValue = (e && e.target !== document) ? scrollParent.getBoundingClientRect().top : 0;
            if ((parent_1.bottom < (floatOffset + tbHeight + topValue)) || parent_1.bottom < 0 || parent_1.top > floatOffset + topValue) {
                isFloat = false;
            }
            else if (parent_1.top < floatOffset) {
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
    };
    Toolbar$$1.prototype.renderToolbar = function () {
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
        var divEle = this.parent.element.querySelector('.e-rte-srctextarea');
        var iframeEle = this.parent.element.querySelector('.e-source-content');
        if ((!this.parent.iframeSettings.enable && (!isNullOrUndefined(divEle) && divEle.style.display === 'block')) ||
            (this.parent.iframeSettings.enable && (!isNullOrUndefined(iframeEle) && iframeEle.style.display === 'block'))) {
            this.parent.notify(updateToolbarItem, {
                targetItem: 'SourceCode', updateItem: 'Preview',
                baseToolbar: this.parent.getBaseToolbarObject()
            });
            this.parent.disableToolbarItem(this.parent.toolbarSettings.items);
        }
    };
    /**
     * addFixedTBarClass method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.addFixedTBarClass = function () {
        addClass([this.tbElement], [CLS_TB_FIXED]);
    };
    /**
     * removeFixedTBarClass method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.removeFixedTBarClass = function () {
        removeClass([this.tbElement], [CLS_TB_FIXED]);
    };
    Toolbar$$1.prototype.showFixedTBar = function () {
        addClass([this.tbElement], [CLS_SHOW]);
        if (Browser.isIos) {
            addClass([this.tbElement], [CLS_TB_IOS_FIX]);
        }
    };
    Toolbar$$1.prototype.hideFixedTBar = function () {
        (!this.isToolbar) ? removeClass([this.tbElement], [CLS_SHOW, CLS_TB_IOS_FIX]) : this.isToolbar = false;
    };
    /**
     * updateItem method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.updateItem = function (args) {
        var item = this.tools[args.updateItem.toLocaleLowerCase()];
        var trgItem = this.tools[args.targetItem.toLocaleLowerCase()];
        var index = getTBarItemsIndex(getCollection(trgItem.subCommand), args.baseToolbar.toolbarObj.items)[0];
        if (!isNullOrUndefined(index)) {
            var prefixId = this.parent.inlineMode.enable ? '_quick_' : '_toolbar_';
            args.baseToolbar.toolbarObj.items[index].id = this.parent.getID() + prefixId + item.id;
            args.baseToolbar.toolbarObj.items[index].prefixIcon = item.icon;
            args.baseToolbar.toolbarObj.items[index].tooltipText = item.tooltip;
            args.baseToolbar.toolbarObj.items[index].subCommand = item.subCommand;
            args.baseToolbar.toolbarObj.dataBind();
        }
        else {
            this.addTBarItem(args, 0);
        }
    };
    Toolbar$$1.prototype.updateToolbarStatus = function (args) {
        if (!this.tbElement || (this.parent.inlineMode.enable && (isIDevice() || !Browser.isDevice))) {
            return;
        }
        var options = {
            args: args,
            dropDownModule: this.dropDownModule,
            parent: this.parent,
            tbElements: selectAll('.' + CLS_TB_ITEM, this.tbElement),
            tbItems: this.baseToolbar.toolbarObj.items
        };
        setToolbarStatus(options, (this.parent.inlineMode.enable ? true : false));
    };
    Toolbar$$1.prototype.fullScreen = function (e) {
        this.parent.fullScreenModule.showFullScreen(e);
    };
    Toolbar$$1.prototype.hideScreen = function (e) {
        this.parent.fullScreenModule.hideFullScreen(e);
    };
    /**
     * getBaseToolbar method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.getBaseToolbar = function () {
        return this.baseToolbar;
    };
    /**
     * addTBarItem method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.addTBarItem = function (args, index) {
        args.baseToolbar.toolbarObj.addItems([args.baseToolbar.getObject(args.updateItem, 'toolbar')], index);
    };
    /**
     * enableTBarItems method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.enableTBarItems = function (baseToolbar, items, isEnable, muteToolbarUpdate) {
        var trgItems = getTBarItemsIndex(getCollection(items), baseToolbar.toolbarObj.items);
        this.tbItems = selectAll('.' + CLS_TB_ITEM, baseToolbar.toolbarObj.element);
        for (var i = 0; i < trgItems.length; i++) {
            var item = this.tbItems[trgItems[i]];
            if (item) {
                baseToolbar.toolbarObj.enableItems(item, isEnable);
            }
        }
        if (!select('.e-rte-srctextarea', this.parent.element) && !muteToolbarUpdate) {
            updateUndoRedoStatus(baseToolbar, this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
    };
    /**
     * removeTBarItems method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.removeTBarItems = function (items) {
        if (isNullOrUndefined(this.baseToolbar.toolbarObj)) {
            this.baseToolbar = this.parent.getBaseToolbarObject();
        }
        var trgItems = getTBarItemsIndex(getCollection(items), this.baseToolbar.toolbarObj.items);
        this.tbItems = (this.parent.inlineMode.enable) ? selectAll('.' + CLS_TB_ITEM, this.baseToolbar.toolbarObj.element)
            : selectAll('.' + CLS_TB_ITEM, this.parent.element);
        for (var i = 0; i < trgItems.length; i++) {
            this.baseToolbar.toolbarObj.removeItems(this.tbItems[trgItems[i]]);
        }
    };
    /**
     * getExpandTBarPopHeight method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.getExpandTBarPopHeight = function () {
        var popHeight = 0;
        if (this.parent.toolbarSettings.type === ToolbarType.Expand && this.tbElement.classList.contains('e-extended-toolbar')) {
            var expandPopup = select('.e-toolbar-extended', this.tbElement);
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
    };
    /**
     * getToolbarHeight method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.getToolbarHeight = function () {
        return this.tbElement.offsetHeight;
    };
    /**
     * getToolbarElement method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.getToolbarElement = function () {
        return select('.' + CLS_TOOLBAR, this.parent.element);
    };
    /**
     * refreshToolbarOverflow method
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.refreshToolbarOverflow = function () {
        this.baseToolbar.toolbarObj.refreshOverflow();
    };
    Toolbar$$1.prototype.isToolbarDestroyed = function () {
        return this.baseToolbar.toolbarObj && !this.baseToolbar.toolbarObj.isDestroyed;
    };
    Toolbar$$1.prototype.destroyToolbar = function () {
        if (this.isToolbarDestroyed()) {
            this.parent.unWireScrollElementsEvents();
            this.unWireEvents();
            this.parent.notify(destroyColorPicker, {});
            this.dropDownModule.destroyDropDowns();
            this.baseToolbar.toolbarObj.destroy();
            this.removeEventListener();
            removeClass([this.parent.element], [CLS_RTE_EXPAND_TB]);
            var tbWrapper = select('.' + CLS_TB_WRAP, this.parent.element);
            var tbElement = select('.' + CLS_TOOLBAR, this.parent.element);
            if (!isNullOrUndefined(tbWrapper)) {
                detach(tbWrapper);
            }
            else if (!isNullOrUndefined(tbElement)) {
                detach(tbElement);
            }
        }
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.destroy = function () {
        if (this.isToolbarDestroyed()) {
            this.destroyToolbar();
            if (this.keyBoardModule) {
                this.keyBoardModule.destroy();
            }
        }
    };
    Toolbar$$1.prototype.scrollHandler = function (e) {
        if (!this.parent.inlineMode.enable) {
            if (this.parent.toolbarSettings.enableFloating && this.getDOMVisibility(this.tbElement)) {
                this.toggleFloatClass(e.args);
            }
        }
    };
    Toolbar$$1.prototype.getDOMVisibility = function (el) {
        if (!el.offsetParent && el.offsetWidth === 0 && el.offsetHeight === 0) {
            return false;
        }
        return true;
    };
    Toolbar$$1.prototype.mouseDownHandler = function () {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.showFixedTBar();
        }
    };
    Toolbar$$1.prototype.focusChangeHandler = function () {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.isToolbar = false;
            this.hideFixedTBar();
        }
    };
    Toolbar$$1.prototype.dropDownBeforeOpenHandler = function () {
        this.isToolbar = true;
    };
    Toolbar$$1.prototype.tbFocusHandler = function (e) {
        var activeElm = document.activeElement;
        var isToolbaractive = closest(activeElm, '.e-rte-toolbar');
        if (activeElm === this.parent.getToolbarElement() || isToolbaractive === this.parent.getToolbarElement()) {
            var toolbarItem = this.parent.getToolbarElement().querySelectorAll('.e-expended-nav');
            for (var i = 0; i < toolbarItem.length; i++) {
                if (isNullOrUndefined(this.parent.getToolbarElement().querySelector('.e-insert-table-btn'))) {
                    toolbarItem[i].setAttribute('tabindex', '0');
                }
                else {
                    toolbarItem[i].setAttribute('tabindex', '1');
                }
            }
        }
    };
    Toolbar$$1.prototype.tbKeydownHandler = function (e) {
        if (e.target.classList.contains('e-dropdown-btn') ||
            e.target.getAttribute('id') === this.parent.getID() + '_toolbar_CreateTable') {
            e.target.setAttribute('tabindex', '0');
        }
    };
    Toolbar$$1.prototype.toolbarMouseDownHandler = function (e) {
        var trg = closest(e.target, '.e-hor-nav');
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
    };
    Toolbar$$1.prototype.wireEvents = function () {
        if (this.parent.inlineMode.enable && isIDevice()) {
            return;
        }
        EventHandler.add(this.tbElement, 'click mousedown', this.toolbarMouseDownHandler, this);
        EventHandler.add(this.tbElement, 'focusin', this.tbFocusHandler, this);
        EventHandler.add(this.tbElement, 'keydown', this.tbKeydownHandler, this);
    };
    Toolbar$$1.prototype.unWireEvents = function () {
        EventHandler.remove(this.tbElement, 'click mousedown', this.toolbarMouseDownHandler);
        EventHandler.remove(this.tbElement, 'focusin', this.tbFocusHandler);
        EventHandler.remove(this.tbElement, 'keydown', this.tbKeydownHandler);
    };
    Toolbar$$1.prototype.addEventListener = function () {
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
    };
    Toolbar$$1.prototype.removeEventListener = function () {
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
    };
    Toolbar$$1.prototype.onRefresh = function () {
        this.refreshToolbarOverflow();
        this.parent.setContentHeight('', true);
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    Toolbar$$1.prototype.onPropertyChanged = function (e) {
        if (!isNullOrUndefined(e.newProp.inlineMode)) {
            for (var _i = 0, _a = Object.keys(e.newProp.inlineMode); _i < _a.length; _i++) {
                var prop = _a[_i];
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
    };
    Toolbar$$1.prototype.refreshToolbar = function () {
        if (isNullOrUndefined(this.baseToolbar.toolbarObj)) {
            this.baseToolbar = this.parent.getBaseToolbarObject();
        }
        var tbWrapper = select('.' + CLS_TB_WRAP, this.parent.element);
        var tbElement = select('.' + CLS_TOOLBAR, this.parent.element);
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
    };
    /**
     * For internal use only - Get the module name.
     */
    Toolbar$$1.prototype.getModuleName = function () {
        return 'toolbar';
    };
    return Toolbar$$1;
}());

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
var keyCode = {
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
 * @deprecated
 */
var KeyboardEvents$1 = /** @__PURE__ @class */ (function (_super) {
    __extends(KeyboardEvents$$1, _super);
    /**
     * Initializes the KeyboardEvents
     * @param {HTMLElement} element
     * @param {KeyboardEventsModel} options
     */
    function KeyboardEvents$$1(element, options) {
        var _this = _super.call(this, options, element) || this;
        /**
         * To handle a key press event returns null
         */
        _this.keyPressHandler = function (e) {
            var isAltKey = e.altKey;
            var isCtrlKey = e.ctrlKey;
            var isShiftKey = e.shiftKey;
            var curkeyCode = e.which;
            var keys = Object.keys(_this.keyConfigs);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var configCollection = _this.keyConfigs[key].split(',');
                for (var _a = 0, configCollection_1 = configCollection; _a < configCollection_1.length; _a++) {
                    var rconfig = configCollection_1[_a];
                    var rKeyObj = KeyboardEvents_1.getKeyConfigData(rconfig.trim());
                    if (isAltKey === rKeyObj.altKey && isCtrlKey === rKeyObj.ctrlKey &&
                        isShiftKey === rKeyObj.shiftKey && curkeyCode === rKeyObj.keyCode) {
                        e.action = key;
                    }
                }
            }
            if (_this.keyAction) {
                _this.keyAction(e);
            }
        };
        _this.bind();
        return _this;
    }
    KeyboardEvents_1 = KeyboardEvents$$1;
    /**
     * Unwire bound events and destroy the instance.
     * @return {void}
     */
    KeyboardEvents$$1.prototype.destroy = function () {
        this.unwireEvents();
        _super.prototype.destroy.call(this);
    };
    /**
     * Function can be used to specify certain action if a property is changed
     * @param newProp
     * @param oldProp
     * @returns {void}
     * @private
     */
    KeyboardEvents$$1.prototype.onPropertyChanged = function (newProp, oldProp) {
        // No code are needed
    };
    
    KeyboardEvents$$1.prototype.bind = function () {
        this.wireEvents();
    };
    /**
     * To get the module name, returns 'keyboard'.
     * @private
     */
    KeyboardEvents$$1.prototype.getModuleName = function () {
        return 'keyboard';
    };
    /**
     * Wiring event handlers to events
     */
    KeyboardEvents$$1.prototype.wireEvents = function () {
        this.element.addEventListener(this.eventName, this.keyPressHandler);
    };
    /**
     * Unwiring event handlers to events
     */
    KeyboardEvents$$1.prototype.unwireEvents = function () {
        this.element.removeEventListener(this.eventName, this.keyPressHandler);
    };
    /**
     * To get the key configuration data
     * @param {string} config - configuration data
     * returns {KeyData}
     */
    KeyboardEvents$$1.getKeyConfigData = function (config) {
        if (config in this.configCache) {
            return this.configCache[config];
        }
        var keys = config.toLowerCase().split('+');
        var keyData = {
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
    };
    // Return the keycode value as string 
    KeyboardEvents$$1.getKeyCode = function (keyVal) {
        return keyCode[keyVal] || keyVal.toUpperCase().charCodeAt(0);
    };
    var KeyboardEvents_1;
    KeyboardEvents$$1.configCache = {};
    __decorate([
        Property({})
    ], KeyboardEvents$$1.prototype, "keyConfigs", void 0);
    __decorate([
        Property('keyup')
    ], KeyboardEvents$$1.prototype, "eventName", void 0);
    __decorate([
        Event()
    ], KeyboardEvents$$1.prototype, "keyAction", void 0);
    KeyboardEvents$$1 = KeyboardEvents_1 = __decorate([
        NotifyPropertyChanges
    ], KeyboardEvents$$1);
    return KeyboardEvents$$1;
}(Base));

/**
 * `Color Picker` module is used to handle ColorPicker actions.
 */
var ColorPickerInput = /** @__PURE__ @class */ (function () {
    function ColorPickerInput(parent, serviceLocator) {
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
    ColorPickerInput.prototype.initializeInstance = function () {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
    };
    /**
     * renderColorPickerInput method
     * @hidden
     * @deprecated
     */
    ColorPickerInput.prototype.renderColorPickerInput = function (args) {
        var _this = this;
        this.initializeInstance();
        var suffixID = args.containerType;
        var tbElement = args.container;
        var targetID;
        var options;
        templateItems.forEach(function (item) {
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                    case 'fontcolor':
                        targetID = _this.parent.getID() + '_' + suffixID + '_FontColor_Target';
                        var fontNode = _this.parent.createElement('input');
                        fontNode.id = targetID;
                        fontNode.classList.add(CLS_FONT_COLOR_TARGET);
                        document.body.appendChild(fontNode);
                        options = {
                            cssClass: _this.tools[item.toLocaleLowerCase()].icon
                                + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_ICONS,
                            value: _this.tools[item.toLocaleLowerCase()].value,
                            command: _this.tools[item.toLocaleLowerCase()].command,
                            subCommand: _this.tools[item.toLocaleLowerCase()].subCommand,
                            element: select('#' + _this.parent.getID() + '_' + suffixID + '_FontColor', tbElement),
                            target: ('#' + targetID)
                        };
                        _this.fontColorPicker = _this.toolbarRenderer.renderColorPicker(options, 'fontcolor');
                        _this.fontColorDropDown = _this.toolbarRenderer.renderColorPickerDropDown(options, 'fontcolor', _this.fontColorPicker);
                        break;
                    case 'backgroundcolor':
                        targetID = _this.parent.getID() + '_' + suffixID + '_BackgroundColor_Target';
                        var backNode = _this.parent.createElement('input');
                        backNode.id = targetID;
                        backNode.classList.add(CLS_BACKGROUND_COLOR_TARGET);
                        document.body.appendChild(backNode);
                        options = {
                            cssClass: _this.tools[item.toLocaleLowerCase()].icon
                                + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_ICONS,
                            value: _this.tools[item.toLocaleLowerCase()].value,
                            command: _this.tools[item.toLocaleLowerCase()].command,
                            subCommand: _this.tools[item.toLocaleLowerCase()].subCommand,
                            element: select('#' + _this.parent.getID() + '_' + suffixID + '_BackgroundColor', tbElement),
                            target: ('#' + targetID)
                        };
                        _this.backgroundColorPicker = _this.toolbarRenderer.renderColorPicker(options, 'backgroundcolor');
                        _this.backgroundColorDropDown = _this.toolbarRenderer.renderColorPickerDropDown(options, 'backgroundcolor', _this.backgroundColorPicker);
                        break;
                }
            }
        });
    };
    ColorPickerInput.prototype.destroy = function () {
        this.removeEventListener();
        this.destroyColorPicker();
    };
    /**
     * destroyColorPicker method
     * @hidden
     * @deprecated
     */
    ColorPickerInput.prototype.destroyColorPicker = function () {
        if (this.fontColorPicker && !this.fontColorPicker.isDestroyed) {
            this.fontColorPicker.destroy();
        }
        if (this.backgroundColorPicker && !this.backgroundColorPicker.isDestroyed) {
            this.backgroundColorPicker.destroy();
        }
        if (this.fontColorDropDown && !this.fontColorDropDown.isDestroyed) {
            var innerEle = this.fontColorDropDown.element.querySelector('.e-rte-color-content');
            if (innerEle) {
                detach(innerEle);
            }
            this.fontColorDropDown.destroy();
        }
        if (this.backgroundColorDropDown && !this.backgroundColorDropDown.isDestroyed) {
            var innerEle = this.backgroundColorDropDown.element.querySelector('.e-rte-color-content');
            if (innerEle) {
                detach(innerEle);
            }
            this.backgroundColorDropDown.destroy();
        }
    };
    ColorPickerInput.prototype.setRtl = function (args) {
        if (this.fontColorPicker) {
            this.fontColorPicker.setProperties({ enableRtl: args.enableRtl });
            this.fontColorDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.backgroundColorPicker) {
            this.backgroundColorPicker.setProperties({ enableRtl: args.enableRtl });
            this.backgroundColorDropDown.setProperties({ enableRtl: args.enableRtl });
        }
    };
    ColorPickerInput.prototype.addEventListener = function () {
        this.parent.on(toolbarRenderComplete, this.renderColorPickerInput, this);
        this.parent.on(rtlMode, this.setRtl, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(destroyColorPicker, this.destroyColorPicker, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
    };
    ColorPickerInput.prototype.onPropertyChanged = function (model) {
        var newProp = model.newProp;
        var element;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'fontColor':
                    if (this.fontColorPicker) {
                        for (var _b = 0, _c = Object.keys(newProp.fontColor); _b < _c.length; _b++) {
                            var font = _c[_b];
                            switch (font) {
                                case 'default':
                                    this.fontColorPicker.setProperties({ value: newProp.fontColor.default });
                                    element = this.fontColorDropDown.element;
                                    var fontBorder = element.querySelector('.' + this.tools['fontcolor'].icon);
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
                        for (var _d = 0, _e = Object.keys(newProp.backgroundColor); _d < _e.length; _d++) {
                            var background = _e[_d];
                            switch (background) {
                                case 'default':
                                    this.backgroundColorPicker.setProperties({ value: newProp.backgroundColor.default });
                                    element = this.backgroundColorDropDown.element;
                                    var backgroundBorder = element.querySelector('.' + this.tools['backgroundcolor'].icon);
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
    };
    ColorPickerInput.prototype.removeEventListener = function () {
        this.parent.off(toolbarRenderComplete, this.renderColorPickerInput);
        this.parent.off(destroy, this.destroy);
        this.parent.off(rtlMode, this.setRtl);
        this.parent.off(destroyColorPicker, this.destroyColorPicker);
        this.parent.off(modelChanged, this.onPropertyChanged);
    };
    return ColorPickerInput;
}());

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
var BaseQuickToolbar = /** @__PURE__ @class */ (function () {
    function BaseQuickToolbar(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.isDOMElement = false;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.popupRenderer = this.renderFactory.getRenderer(RenderType.Popup);
        this.dropDownButtons = new DropDownButtons(this.parent, this.locator);
        this.colorPickerObj = new ColorPickerInput(this.parent, this.locator);
    }
    BaseQuickToolbar.prototype.appendPopupContent = function () {
        this.toolbarElement = this.parent.createElement('div', { className: CLS_QUICK_TB });
        this.element.appendChild(this.toolbarElement);
    };
    /**
     * render method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.render = function (args) {
        var className;
        if (args.popupType === 'Image') {
            className = CLS_IMAGE_POP;
        }
        else if (args.popupType === 'Inline') {
            className = CLS_INLINE_POP;
        }
        else {
            className = '';
        }
        var popupId = getUniqueID(args.popupType + '_Quick_Popup');
        this.stringItems = args.toolbarItems;
        this.element = this.parent.createElement('div', { id: popupId, className: className + ' ' + CLS_RTE_ELEMENTS });
        this.element.setAttribute('aria-owns', this.parent.getID());
        this.appendPopupContent();
        this.createToolbar(args.toolbarItems, args.mode);
        this.popupRenderer.renderPopup(this);
        this.addEventListener();
    };
    BaseQuickToolbar.prototype.createToolbar = function (items, mode) {
        this.quickTBarObj = new BaseToolbar(this.parent, this.locator);
        this.quickTBarObj.render({
            container: 'quick',
            target: this.toolbarElement,
            items: items,
            mode: mode
        });
        this.quickTBarObj.toolbarObj.refresh();
    };
    BaseQuickToolbar.prototype.setPosition = function (e) {
        var x;
        var y;
        var imgWrapper = closest(e.target, '.e-img-caption');
        var target = !isNullOrUndefined(imgWrapper) ? imgWrapper : e.target;
        addClass([this.toolbarElement], [CLS_RM_WHITE_SPACE]);
        var targetOffsetTop = target.offsetTop;
        var parentOffsetTop = window.pageYOffset + e.parentData.top;
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
        this.popupObj.position.Y = (y >= 0) ? y : e.y + 5;
        this.popupObj.dataBind();
        removeClass([this.toolbarElement], [CLS_RM_WHITE_SPACE]);
    };
    BaseQuickToolbar.prototype.checkCollision = function (e, viewPort, type) {
        var x;
        var y;
        var parentTop = e.parentData.top;
        var contentTop = e.windowY + parentTop + e.tBarElementHeight;
        var collision = [];
        if (viewPort === 'document') {
            collision = isCollide(e.popup);
        }
        else {
            collision = isCollide(e.popup, e.parentElement);
        }
        for (var i = 0; i < collision.length; i++) {
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
                    var posY = void 0;
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
    };
    /**
     * showPopup method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.showPopup = function (x, y, target) {
        var _this = this;
        var eventArgs = isBlazor() ? { cancel: false, targetElement: target } :
            { popup: this.popupObj, cancel: false, targetElement: target };
        this.parent.trigger(beforeQuickToolbarOpen, eventArgs, function (beforeQuickToolbarArgs) {
            if (!beforeQuickToolbarArgs.cancel) {
                var editPanelTop = void 0;
                var editPanelHeight = void 0;
                var bodyStyle = window.getComputedStyle(document.body);
                var bodyRight = parseFloat(bodyStyle.marginRight.split('px')[0]) + parseFloat(bodyStyle.paddingRight.split('px')[0]);
                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;
                var parent_1 = _this.parent.element;
                var toolbarAvail = !isNullOrUndefined(_this.parent.getToolbar());
                var tbHeight = toolbarAvail && _this.parent.toolbarModule.getToolbarHeight();
                var expTBHeight = toolbarAvail && _this.parent.toolbarModule.getExpandTBarPopHeight();
                var tBarHeight = (toolbarAvail) ? (tbHeight + expTBHeight) : 0;
                addClass([_this.element], [CLS_HIDE]);
                if (Browser.isDevice && !isIDevice()) {
                    addClass([_this.parent.getToolbar()], [CLS_HIDE]);
                }
                if (_this.parent.iframeSettings.enable) {
                    var cntEle = _this.contentRenderer.getPanel().contentWindow;
                    editPanelTop = cntEle.pageYOffset;
                    editPanelHeight = cntEle.innerHeight;
                }
                else {
                    var cntEle = closest(target, '.' + CLS_RTE_CONTENT);
                    editPanelTop = (cntEle) ? cntEle.scrollTop : 0;
                    editPanelHeight = (cntEle) ? cntEle.offsetHeight : 0;
                }
                if (!_this.parent.inlineMode.enable && !closest(target, 'table')) {
                    _this.parent.disableToolbarItem(_this.parent.toolbarSettings.items);
                    _this.parent.enableToolbarItem(['Undo', 'Redo']);
                }
                append([_this.element], document.body);
                _this.popupObj.position.X = x + 20;
                _this.popupObj.position.Y = y + ((_this.parent.iframeSettings.enable) ? 35 : 20);
                _this.popupObj.dataBind();
                _this.popupObj.element.classList.add('e-popup-open');
                _this.dropDownButtons.renderDropDowns({
                    container: _this.toolbarElement,
                    containerType: 'quick',
                    items: _this.stringItems
                });
                _this.colorPickerObj.renderColorPickerInput({
                    container: _this.toolbarElement,
                    containerType: 'quick',
                    items: _this.stringItems
                });
                var showPopupData = {
                    x: x, y: y,
                    target: target,
                    editTop: editPanelTop,
                    editHeight: editPanelHeight,
                    popup: _this.popupObj.element,
                    popHeight: _this.popupObj.element.offsetHeight,
                    popWidth: _this.popupObj.element.offsetWidth,
                    parentElement: parent_1,
                    bodyRightSpace: bodyRight,
                    windowY: window.pageYOffset,
                    windowHeight: windowHeight,
                    windowWidth: windowWidth,
                    parentData: parent_1.getBoundingClientRect(),
                    tBarElementHeight: tBarHeight
                };
                if (target.tagName === 'IMG') {
                    _this.setPosition(showPopupData);
                }
                if (!_this.parent.inlineMode.enable) {
                    _this.checkCollision(showPopupData, 'parent', '');
                }
                _this.checkCollision(showPopupData, 'document', ((_this.parent.inlineMode.enable) ? 'inline' : ''));
                _this.popupObj.element.classList.remove('e-popup-open');
                removeClass([_this.element], [CLS_HIDE]);
                _this.popupObj.show({ name: 'ZoomIn', duration: (Browser.isIE ? 250 : 400) });
                setStyleAttribute(_this.element, {
                    maxWidth: _this.parent.element.offsetWidth + 'px'
                });
                addClass([_this.element], [CLS_POP]);
                _this.isDOMElement = true;
            }
        });
    };
    /**
     * hidePopup method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.hidePopup = function () {
        var viewSourcePanel = this.parent.sourceCodeModule.getViewPanel();
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
    };
    /**
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.addQTBarItem = function (item, index) {
        this.quickTBarObj.toolbarObj.addItems(this.quickTBarObj.getItems(item, 'toolbar'), index);
    };
    /**
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.removeQTBarItem = function (index) {
        this.quickTBarObj.toolbarObj.removeItems(index);
    };
    BaseQuickToolbar.prototype.removeEleFromDOM = function () {
        var element = this.popupObj.element;
        if (this.isDOMElement) {
            this.dropDownButtons.destroyDropDowns();
            this.colorPickerObj.destroyColorPicker();
            removeClass([this.element], [CLS_POP]);
            detach(element);
            var args = isBlazor() ? { element: this.popupObj.element } : this.popupObj;
            this.parent.trigger(quickToolbarClose, args);
        }
    };
    BaseQuickToolbar.prototype.updateStatus = function (args) {
        var options = {
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
    };
    /**
     * Destroys the Quick toolbar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.destroy = function () {
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.popupObj.destroy();
            this.removeEleFromDOM();
        }
        this.removeEventListener();
    };
    /**
     * addEventListener method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        if (this.parent.inlineMode.enable) {
            this.parent.on(toolbarUpdated, this.updateStatus, this);
        }
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.onPropertyChanged = function (e) {
        if (!isNullOrUndefined(e.newProp.inlineMode)) {
            for (var _i = 0, _a = Object.keys(e.newProp.inlineMode); _i < _a.length; _i++) {
                var prop = _a[_i];
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
    };
    /**
     * removeEventListener method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(destroy, this.destroy);
        this.parent.off(modelChanged, this.onPropertyChanged);
        if (this.parent.inlineMode.enable) {
            this.parent.off(toolbarUpdated, this.updateStatus);
        }
    };
    return BaseQuickToolbar;
}());

/**
 * `Popup renderer` module is used to render popup in RichTextEditor.
 * @hidden
 * @deprecated
 */
var PopupRenderer = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for popup renderer module
     */
    function PopupRenderer(parent) {
        this.parent = parent;
    }
    PopupRenderer.prototype.quickToolbarOpen = function () {
        var args = isBlazor() ? { element: this.popupObj.element } : this.popupObj;
        this.parent.trigger(quickToolbarOpen, args);
    };
    /**
     * renderPopup method
     * @hidden
     * @deprecated
     */
    PopupRenderer.prototype.renderPopup = function (args) {
        this.setPanel(args.element);
        this.renderPanel();
        args.popupObj = new Popup(args.element, {
            targetType: 'relative',
            relateTo: this.parent.element,
            open: this.quickToolbarOpen.bind(this)
        });
        this.popupObj = args.popupObj;
        args.popupObj.hide();
    };
    /**
     * The function is used to add popup class in Quick Toolbar
     * @hidden
     * @deprecated
     */
    PopupRenderer.prototype.renderPanel = function () {
        this.getPanel().classList.add(CLS_QUICK_POP);
    };
    /**
     * Get the popup element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    PopupRenderer.prototype.getPanel = function () {
        return this.popupPanel;
    };
    /**
     * Set the popup element of RichTextEditor
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    PopupRenderer.prototype.setPanel = function (panel) {
        this.popupPanel = panel;
    };
    return PopupRenderer;
}());

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
var QuickToolbar = /** @__PURE__ @class */ (function () {
    function QuickToolbar(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.renderFactory.addRenderer(RenderType.Popup, new PopupRenderer(this.parent));
        this.addEventListener();
    }
    QuickToolbar.prototype.formatItems = function (items) {
        var formattedItems = [];
        items.forEach(function (item) {
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
    };
    QuickToolbar.prototype.getQTBarOptions = function (popType, mode, items, type) {
        return {
            popupType: popType,
            toolbarItems: items,
            mode: mode,
            renderType: type
        };
    };
    /**
     * createQTBar method
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.createQTBar = function (popupType, mode, items, type) {
        if (items.length < 1) {
            return null;
        }
        var qTBar = new BaseQuickToolbar(this.parent, this.locator);
        qTBar.render(this.getQTBarOptions(popupType, mode, this.formatItems(items), type));
        return qTBar;
    };
    QuickToolbar.prototype.initializeQuickToolbars = function () {
        this.parent.quickToolbarModule = this;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        if (this.parent.inlineMode.enable && this.parent.inlineMode.onSelection && isIDevice()) {
            EventHandler.add(this.contentRenderer.getDocument(), 'selectionchange', this.selectionChangeHandler, this);
        }
    };
    QuickToolbar.prototype.onMouseDown = function (e) {
        this.parent.isBlur = false;
        this.parent.isRTE = true;
    };
    QuickToolbar.prototype.renderQuickToolbars = function () {
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
    };
    QuickToolbar.prototype.renderInlineQuickToolbar = function () {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            addClass([this.parent.element], [CLS_INLINE]);
            this.inlineQTBar = this.createQTBar('Inline', 'MultiRow', this.parent.toolbarSettings.items, RenderType.InlineToolbar);
            this.renderFactory.addRenderer(RenderType.InlineToolbar, this.inlineQTBar);
            EventHandler.add(this.inlineQTBar.element, 'mousedown', this.onMouseDown, this);
        }
    };
    QuickToolbar.prototype.showInlineQTBar = function (x, y, target) {
        if (this.parent.readonly) {
            return;
        }
        this.inlineQTBar.showPopup(x, y, target);
    };
    QuickToolbar.prototype.hideInlineQTBar = function () {
        if (this.inlineQTBar && !hasClass(this.inlineQTBar.element, 'e-popup-close')) {
            this.inlineQTBar.hidePopup();
        }
    };
    /**
     * Method for hidding the quick toolbar
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.hideQuickToolbars = function () {
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
    };
    QuickToolbar.prototype.deBounce = function (x, y, target) {
        var _this = this;
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(function () { _this.showInlineQTBar(x, y, target); }, 1000);
    };
    QuickToolbar.prototype.mouseUpHandler = function (e) {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            var coordinates = void 0;
            coordinates = e.args.touches ? e.args.changedTouches[0] : e.args;
            var range = this.parent.getRange();
            var target = e.args.target;
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
                    var closestAnchor = closest(target, 'a');
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
    };
    QuickToolbar.prototype.keyDownHandler = function () {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    };
    QuickToolbar.prototype.inlineQTBarMouseDownHandler = function () {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    };
    QuickToolbar.prototype.keyUpHandler = function (e) {
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            if (this.parent.inlineMode.onSelection) {
                return;
            }
            var args = e.args;
            this.deBounce(this.offsetX, this.offsetY, args.target);
        }
    };
    QuickToolbar.prototype.selectionChangeHandler = function (e) {
        var _this = this;
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(function () { _this.onSelectionChange(e); }, 1000);
    };
    QuickToolbar.prototype.onSelectionChange = function (e) {
        if (!isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
            return;
        }
        var selection = this.contentRenderer.getDocument().getSelection();
        if (!selection.isCollapsed) {
            this.mouseUpHandler({ args: e });
        }
    };
    /**
     * getInlineBaseToolbar method
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.getInlineBaseToolbar = function () {
        return this.inlineQTBar && this.inlineQTBar.quickTBarObj;
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.destroy = function () {
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
    };
    QuickToolbar.prototype.wireInlineQTBarEvents = function () {
        this.parent.on(mouseUp, this.mouseUpHandler, this);
        this.parent.on(mouseDown, this.inlineQTBarMouseDownHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(sourceCodeMouseDown, this.mouseUpHandler, this);
        this.parent.on(renderInlineToolbar, this.renderInlineQuickToolbar, this);
    };
    QuickToolbar.prototype.unWireInlineQTBarEvents = function () {
        this.parent.off(mouseUp, this.mouseUpHandler);
        this.parent.off(mouseDown, this.inlineQTBarMouseDownHandler);
        this.parent.off(keyDown, this.keyDownHandler);
        this.parent.off(keyUp, this.keyUpHandler);
        this.parent.off(sourceCodeMouseDown, this.mouseUpHandler);
        this.parent.off(renderInlineToolbar, this.renderInlineQuickToolbar);
    };
    QuickToolbar.prototype.toolbarUpdated = function (args) {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close')) {
            this.linkQTBar.hidePopup();
        }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
            this.imageQTBar.hidePopup();
        }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) {
            this.tableQTBar.hidePopup();
        }
    };
    /**
     * addEventListener
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initialEnd, this.initializeQuickToolbars, this);
        this.parent.on(mouseDown, this.renderQuickToolbars, this);
        this.parent.on(toolbarUpdated, this.toolbarUpdated, this);
        this.parent.on(drop, this.renderQuickToolbars, this);
        this.wireInlineQTBarEvents();
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.on(scroll, this.hideQuickToolbars, this);
            this.parent.on(contentscroll, this.hideQuickToolbars, this);
        }
        this.parent.on(focusChange, this.hideQuickToolbars, this);
        this.parent.on(iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.on(rtlMode, this.setRtl, this);
    };
    QuickToolbar.prototype.onKeyDown = function (e) {
        var args = e.args;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
                this.imageQTBar.hidePopup();
            }
        }
    };
    QuickToolbar.prototype.onIframeMouseDown = function () {
        this.hideQuickToolbars();
        this.hideInlineQTBar();
    };
    QuickToolbar.prototype.setRtl = function (args) {
        if (this.inlineQTBar) {
            this.inlineQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.imageQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.linkQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    };
    /**
     * removeEventListener
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.removeEventListener = function () {
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
            this.parent.off(contentscroll, this.hideQuickToolbars);
        }
        this.parent.off(focusChange, this.hideQuickToolbars);
        this.parent.off(destroy, this.destroy);
        this.parent.off(iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(keyDown, this.onKeyDown);
        this.parent.off(rtlMode, this.setRtl);
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.onPropertyChanged = function (e) {
        if (!isNullOrUndefined(e.newProp.quickToolbarSettings)) {
            for (var _i = 0, _a = Object.keys(e.newProp.quickToolbarSettings); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'actionOnScroll':
                        if (e.newProp.quickToolbarSettings.actionOnScroll === 'none') {
                            this.parent.off(scroll, this.hideQuickToolbars);
                            this.parent.off(contentscroll, this.hideQuickToolbars);
                        }
                        else {
                            this.parent.on(scroll, this.hideQuickToolbars, this);
                            this.parent.on(contentscroll, this.hideQuickToolbars, this);
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
    };
    /**
     * For internal use only - Get the module name.
     */
    QuickToolbar.prototype.getModuleName = function () {
        return 'quickToolbar';
    };
    return QuickToolbar;
}());

/**
 * `Count` module is used to handle Count actions.
 */
var Count = /** @__PURE__ @class */ (function () {
    function Count(parent, serviceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    Count.prototype.initializeInstance = function () {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.editPanel = this.contentRenderer.getEditPanel();
        this.addEventListener();
    };
    /**
     * renderCount method
     * @hidden
     * @deprecated
     */
    Count.prototype.renderCount = function () {
        this.initializeInstance();
        this.element = this.parent.createElement('span', { className: CLS_COUNT });
        this.contentRenderer.getPanel().parentElement.appendChild(this.element);
        this.appendCount();
        if (this.parent.maxLength !== -1) {
            this.charCountBackground(this.htmlLength);
        }
    };
    Count.prototype.appendCount = function () {
        var htmlText = this.parent.editorMode === 'Markdown' ? this.editPanel.value.trim() :
            this.editPanel.textContent.trim();
        this.htmlLength = htmlText.length;
        var string = this.parent.maxLength === -1 ? this.htmlLength : this.htmlLength + ' / ' + this.parent.maxLength;
        this.element.innerHTML = string;
    };
    Count.prototype.charCountBackground = function (htmlLength) {
        var percentage = (htmlLength / this.parent.maxLength) * 100;
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
    };
    /**
     * @hidden
     * @deprecated
     */
    Count.prototype.refresh = function () {
        if (!isNullOrUndefined(this.editPanel)) {
            this.appendCount();
            if (this.parent.maxLength !== -1) {
                this.charCountBackground(this.htmlLength);
            }
        }
    };
    /**
     * Destroys the Count.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    Count.prototype.destroy = function () {
        if (this.element && !isNullOrUndefined(document.querySelector('.' + CLS_COUNT))) {
            detach(this.element);
        }
        this.removeEventListener();
    };
    Count.prototype.toggle = function (e) {
        this.element.style.display = (e.member === 'viewSource') ? 'none' : 'block';
    };
    Count.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initialEnd, this.renderCount, this);
        this.parent.on(keyUp, this.refresh, this);
        this.parent.on(count, this.refresh, this);
        this.parent.on(refreshBegin, this.refresh, this);
        this.parent.on(mouseDown, this.refresh, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(sourceCode, this.toggle, this);
        this.parent.on(updateSource, this.toggle, this);
    };
    Count.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialEnd, this.renderCount);
        this.parent.off(keyUp, this.refresh);
        this.parent.off(refreshBegin, this.refresh);
        this.parent.off(count, this.refresh);
        this.parent.off(mouseDown, this.refresh);
        this.parent.off(destroy, this.destroy);
        this.parent.off(sourceCode, this.toggle);
        this.parent.off(updateSource, this.toggle);
    };
    /**
     * For internal use only - Get the module name.
     */
    Count.prototype.getModuleName = function () {
        return 'count';
    };
    return Count;
}());

/**
 * MarkdownSelection internal module
 * @hidden
 * @deprecated
 */
var MarkdownSelection = /** @__PURE__ @class */ (function () {
    function MarkdownSelection() {
    }
    /**
     * markdown getLineNumber method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.getLineNumber = function (textarea, point) {
        return textarea.value.substr(0, point).split('\n').length;
    };
    /**
     * markdown getSelectedText method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.getSelectedText = function (textarea) {
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        return textarea.value.substring(start, end);
    };
    /**
     * markdown getAllParents method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.getAllParents = function (value) {
        return value.split('\n');
    };
    /**
     * markdown getSelectedLine method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.getSelectedLine = function (textarea) {
        var lines = this.getAllParents(textarea.value);
        var index = this.getLineNumber(textarea, textarea.selectionStart);
        return lines[index - 1];
    };
    /**
     * markdown getLine method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.getLine = function (textarea, index) {
        var lines = this.getAllParents(textarea.value);
        return lines[index];
    };
    /**
     * markdown getSelectedParentPoints method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.getSelectedParentPoints = function (textarea) {
        var lines = this.getAllParents(textarea.value);
        var start = this.getLineNumber(textarea, textarea.selectionStart);
        var end = this.getLineNumber(textarea, textarea.selectionEnd);
        var parents = this.getSelectedText(textarea).split('\n');
        var selectedPoints = [];
        var selectedLine = lines[start - 1];
        var startLength = lines.slice(0, start - 1).join('').length;
        var firstPoint = {};
        firstPoint.line = start - 1;
        firstPoint.start = startLength + firstPoint.line;
        firstPoint.end = selectedLine !== '' ? firstPoint.start +
            selectedLine.length + 1 : firstPoint.start + selectedLine.length;
        firstPoint.text = selectedLine;
        selectedPoints.push(firstPoint);
        if (parents.length > 1) {
            for (var i = 1; i < parents.length - 1; i++) {
                var points = {};
                points.line = selectedPoints[i - 1].line + 1;
                points.start = parents[i] !== '' ? selectedPoints[i - 1].end : selectedPoints[i - 1].end;
                points.end = points.start + parents[i].length + 1;
                points.text = parents[i];
                selectedPoints.push(points);
            }
            var lastPoint = {};
            lastPoint.line = selectedPoints[selectedPoints.length - 1].line + 1;
            lastPoint.start = selectedPoints[selectedPoints.length - 1].end;
            lastPoint.end = lastPoint.start + lines[end - 1].length + 1;
            lastPoint.text = lines[end - 1];
            selectedPoints.push(lastPoint);
        }
        return selectedPoints;
    };
    /**
     * markdown setSelection method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.setSelection = function (textarea, start, end) {
        textarea.setSelectionRange(start, end);
        textarea.focus();
    };
    /**
     * markdown save method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.save = function (start, end) {
        this.selectionStart = start;
        this.selectionEnd = end;
    };
    /**
     * markdown restore method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.restore = function (textArea) {
        this.setSelection(textArea, this.selectionStart, this.selectionEnd);
    };
    /**
     * markdown isStartWith method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.isStartWith = function (line, command) {
        var isStart = false;
        if (line) {
            var reg = line.trim() === command.trim() ?
                new RegExp('^(' + this.replaceSpecialChar(command.trim()) + ')', 'gim') :
                new RegExp('^(' + this.replaceSpecialChar(command) + ')', 'gim');
            isStart = reg.test(line.trim());
        }
        return isStart;
    };
    /**
     * markdown replaceSpecialChar method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.replaceSpecialChar = function (value) {
        return value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '\\$&');
    };
    /**
     * markdown isClear method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.isClear = function (parents, regex) {
        var isClear = false;
        for (var i = 0; i < parents.length; i++) {
            if (new RegExp(regex, 'gim').test(parents[i].text)) {
                return true;
            }
        }
        return isClear;
    };
    /**
     * markdown getSelectedInlinePoints method
     * @hidden
     * @deprecated
     */
    MarkdownSelection.prototype.getSelectedInlinePoints = function (textarea) {
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        var selection = this.getSelectedText(textarea);
        return { start: start, end: end, text: selection };
    };
    return MarkdownSelection;
}());

/**
 * MarkdownToolbarStatus module for refresh the toolbar status
 */
var MarkdownToolbarStatus = /** @__PURE__ @class */ (function () {
    function MarkdownToolbarStatus(parent) {
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
    MarkdownToolbarStatus.prototype.addEventListener = function () {
        this.parent.on(toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(destroy, this.removeEventListener, this);
    };
    MarkdownToolbarStatus.prototype.removeEventListener = function () {
        this.parent.off(toolbarRefresh, this.onRefreshHandler);
        this.parent.off(destroy, this.onRefreshHandler);
    };
    MarkdownToolbarStatus.prototype.onRefreshHandler = function (args) {
        var parentsLines = this.selection.getSelectedParentPoints(this.element);
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
    };
    MarkdownToolbarStatus.prototype.isListsApplied = function (lines, type) {
        var isApply = true;
        if (type === 'OL') {
            for (var i = 0; i < lines.length; i++) {
                var lineSplit = lines[i].text.trim().split(' ', 2)[0] + ' ';
                if (!/^[\d.]+[ ]+$/.test(lineSplit)) {
                    isApply = false;
                    break;
                }
            }
        }
        else {
            for (var i = 0; i < lines.length; i++) {
                if (!this.selection.isStartWith(lines[i].text, this.parent.formatter.listTags[type])) {
                    isApply = false;
                    break;
                }
            }
        }
        return isApply;
    };
    MarkdownToolbarStatus.prototype.currentFormat = function (lines, documentNode) {
        var format = 'p';
        var keys = Object.keys(this.parent.formatter.formatTags);
        var direction = this.element.selectionDirection;
        var checkLine = direction === 'backward' ? lines[0].text : lines[lines.length - 1].text;
        for (var i = 0; !documentNode && i < keys.length; i++) {
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
    };
    MarkdownToolbarStatus.prototype.codeFormat = function () {
        var isFormat = false;
        var textArea = this.parent.inputElement;
        var start = textArea.selectionStart;
        var splitAt = function (index) { return function (x) { return [x.slice(0, index), x.slice(index)]; }; };
        var splitText = splitAt(start)(textArea.value);
        var cmdPre = this.parent.formatter.formatTags.pre;
        var selectedText = this.getSelectedText(textArea);
        if (selectedText !== '' && selectedText === selectedText.toLocaleUpperCase()) {
            return true;
        }
        else if (selectedText === '') {
            var beforeText = textArea.value.substr(splitText[0].length - 1, 1);
            var afterText = splitText[1].substr(0, 1);
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
    };
    MarkdownToolbarStatus.prototype.getSelectedText = function (textarea) {
        return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    };
    MarkdownToolbarStatus.prototype.isCode = function (text, cmd) {
        return text.search('\\' + cmd + '') !== -1;
    };
    MarkdownToolbarStatus.prototype.multiCharRegx = function (cmd) {
        return new RegExp('(\\' + cmd + ')', 'g');
    };
    return MarkdownToolbarStatus;
}());

/**
 * `ExecCommandCallBack` module is used to run the editor manager command
 */
var ExecCommandCallBack = /** @__PURE__ @class */ (function () {
    function ExecCommandCallBack(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    ExecCommandCallBack.prototype.addEventListener = function () {
        this.parent.on(execCommandCallBack, this.commandCallBack, this);
        this.parent.on(destroy, this.removeEventListener, this);
    };
    ExecCommandCallBack.prototype.commandCallBack = function (args) {
        if (args.requestType !== 'Undo' && args.requestType !== 'Redo') {
            this.parent.formatter.saveData();
        }
        this.parent.notify(toolbarRefresh, { args: args });
        this.parent.notify(count, {});
    };
    ExecCommandCallBack.prototype.removeEventListener = function () {
        this.parent.off(execCommandCallBack, this.commandCallBack);
        this.parent.off(destroy, this.removeEventListener);
    };
    return ExecCommandCallBack;
}());

/**
 * Constant values for Common
 */
/**
 * Keydown event trigger
 * @hidden
 */
var KEY_DOWN = 'keydown';
/**
 * Undo and Redo action HTML plugin events
 * @hidden
 */
var ACTION = 'action';
/**
 * Formats plugin events
 * @hidden
 */
var FORMAT_TYPE = 'format-type';
/**
 * Keydown handler event trigger
 * @hidden
 */
var KEY_DOWN_HANDLER = 'keydown-handler';
/**
 * List plugin events
 * @hidden
 */
var LIST_TYPE = 'list-type';
/**
 * Keyup handler event trigger
 * @hidden
 */
var KEY_UP_HANDLER = 'keyup-handler';
/**
 * Keyup event trigger
 * @hidden
 */
var KEY_UP = 'keyup';
/**
 * Model changed plugin event trigger
 * @hidden
 */
var MODEL_CHANGED_PLUGIN = 'model_changed_plugin';
/**
 * Model changed event trigger
 * @hidden
 */
var MODEL_CHANGED = 'model_changed';
/**
 * PasteCleanup plugin for MSWord content
 * @hidden
 */
var MS_WORD_CLEANUP_PLUGIN = 'ms_word_cleanup_plugin';
/**
 * PasteCleanup for MSWord content
 * @hidden
 */
var MS_WORD_CLEANUP = 'ms_word_cleanup';

/**
 * Formatter
 * @hidden
 * @deprecated
 */
var Formatter = /** @__PURE__ @class */ (function () {
    function Formatter() {
    }
    /**
     * To execute the command
     * @param  {IRichTextEditor} self
     * @param  {ActionBeginEventArgs} args
     * @param  {MouseEvent|KeyboardEvent} event
     * @param  {IItemCollectionArgs} value
     * @hidden
     * @deprecated
     */
    Formatter.prototype.process = function (self, args, event, value) {
        var _this = this;
        var selection = self.contentModule.getDocument().getSelection();
        var range = (selection.rangeCount > 0) ? selection.getRangeAt(selection.rangeCount - 1) : null;
        var saveSelection;
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
            var action_1 = event.action;
            if (action_1 !== 'tab' && action_1 !== 'enter' && action_1 !== 'space' && action_1 !== 'escape') {
                args = {};
                if (self.editorMode === 'Markdown' && action_1 === 'insert-table') {
                    value = {
                        'headingText': self.localeObj.getConstant('TableHeadingText'),
                        'colText': self.localeObj.getConstant('TableColText')
                    };
                }
                var items = {
                    originalEvent: event, cancel: false,
                    requestType: action_1 || (event.key + 'Key'),
                    itemCollection: value
                };
                extend(args, args, items, true);
                if (isBlazor()) {
                    delete args.item;
                    delete args.itemCollection;
                }
                self.trigger(actionBegin, args, function (actionBeginArgs) {
                    if (actionBeginArgs.cancel) {
                        if (action_1 === 'paste' || action_1 === 'cut' || action_1 === 'copy') {
                            event.preventDefault();
                        }
                    }
                });
            }
            var isTableModule = isNullOrUndefined(self.tableModule) ? true : self.tableModule ?
                self.tableModule.ensureInsideTableList : false;
            if ((event.which === 9 && isTableModule) || event.which !== 9) {
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
            self.trigger(actionBegin, args, function (actionBeginArgs) {
                if (!actionBeginArgs.cancel) {
                    if (_this.getUndoRedoStack().length === 0 && actionBeginArgs.item.command !== 'Links'
                        && actionBeginArgs.item.command !== 'Images') {
                        _this.saveData();
                    }
                    self.isBlur = false;
                    self.contentModule.getEditPanel().focus();
                    if (self.editorMode === 'HTML') {
                        saveSelection.restore();
                    }
                    var command = actionBeginArgs.item.subCommand.toLocaleLowerCase();
                    if (command === 'paste' || command === 'cut' || command === 'copy') {
                        self.clipboardAction(command, event);
                    }
                    else {
                        _this.editorManager.observer.notify(checkUndo, { subCommand: actionBeginArgs.item.subCommand });
                        _this.editorManager.execCommand(actionBeginArgs.item.command, actionBeginArgs.item.subCommand, event, _this.onSuccess.bind(_this, self), actionBeginArgs.item.value, actionBeginArgs.item.subCommand === 'Pre' && args.name === 'dropDownSelect' ?
                            { name: args.name } : value, ('#' + self.getID() + ' iframe'));
                    }
                }
            });
        }
        if (isNullOrUndefined(event) || event && event.action !== 'copy') {
            this.enableUndo(self);
        }
    };
    Formatter.prototype.getAncestorNode = function (node) {
        node = node.nodeType === 3 ? node.parentNode : node;
        return node;
    };
    /**
     * onKeyHandler method
     * @hidden
     * @deprecated
     */
    Formatter.prototype.onKeyHandler = function (self, e) {
        var _this = this;
        this.editorManager.observer.notify(KEY_UP, {
            event: e, callBack: function () {
                _this.enableUndo(self);
            }
        });
    };
    /**
     * onSuccess method
     * @hidden
     * @deprecated
     */
    Formatter.prototype.onSuccess = function (self, events) {
        if (isNullOrUndefined(events.event) || (events && events.event.action !== 'copy')) {
            this.enableUndo(self);
            self.notify(execCommandCallBack, events);
        }
        if (isBlazor()) {
            delete events.elements;
        }
        self.trigger(actionComplete, events, function (callbackArgs) {
            self.setPlaceHolder();
            if (callbackArgs.requestType === 'Images' || callbackArgs.requestType === 'Links' && self.editorMode === 'HTML') {
                var args = callbackArgs;
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
    };
    /**
     * Save the data for undo and redo action.
     * @hidden
     * @deprecated
     */
    Formatter.prototype.saveData = function (e) {
        this.editorManager.undoRedoManager.saveData(e);
    };
    /**
     * getUndoStatus method
     * @hidden
     * @deprecated
     */
    Formatter.prototype.getUndoStatus = function () {
        return this.editorManager.undoRedoManager.getUndoStatus();
    };
    /**
     * getUndoRedoStack method
     * @hidden
     * @deprecated
     */
    Formatter.prototype.getUndoRedoStack = function () {
        return this.editorManager.undoRedoManager.undoRedoStack;
    };
    /**
     * enableUndo method
     * @hidden
     * @deprecated
     */
    Formatter.prototype.enableUndo = function (self) {
        var status = this.getUndoStatus();
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
    };
    return Formatter;
}());

/**
 * Constant values for Markdown Parser
 */
/**
 * List plugin events
 * @hidden
 */
var LISTS_COMMAND = 'lists-commands';
/**
 * selectioncommand plugin events
 * @hidden
 */
var selectionCommand = 'command-type';
/**
 * Link plugin events
 * @hidden
 */
var LINK_COMMAND = 'link-commands';
/**
 * Clear plugin events
 * @hidden
 */
var CLEAR_COMMAND = 'clear-commands';
/**
 * Table plugin events
 * @hidden
 */
var MD_TABLE = 'insert-table';

/**
 * Lists internal component
 * @hidden
 */
var MDLists = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Lists plugin
     * @hidden
     */
    function MDLists(options) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    MDLists.prototype.addEventListener = function () {
        this.parent.observer.on(LISTS_COMMAND, this.applyListsHandler, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
        this.parent.observer.on(KEY_UP_HANDLER, this.keyUpHandler, this);
    };
    MDLists.prototype.keyDownHandler = function (event) {
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
    };
    MDLists.prototype.keyUpHandler = function (event) {
        switch (event.event.which) {
            case 13:
                this.enterKey(event);
                break;
        }
    };
    MDLists.prototype.tabKey = function (event) {
        var textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var parents = this.selection.getSelectedParentPoints(textArea);
        var addedLength = 0;
        var isNotFirst = this.isNotFirstLine(textArea, parents[0]);
        if (!isNotFirst && !event.event.shiftKey) {
            this.restore(textArea, start, end + addedLength, event);
            return;
        }
        var listFormat = this.olListType();
        var regex = this.getListRegex();
        this.currentAction = this.getAction(parents[0].text);
        for (var i = 0; i < parents.length; i++) {
            var prevIndex = event.event.shiftKey ? parents[i].line - 1 : parents[i].line - 1;
            var prevLine = this.selection.getLine(textArea, prevIndex);
            if (prevLine && (!event.event.shiftKey && isNotFirst || (event.event.shiftKey))) {
                var prevLineSplit = prevLine.split('. ');
                var tabSpace = '\t';
                var tabSpaceLength = event.event.shiftKey ? -tabSpace.length : tabSpace.length;
                var splitTab = parents[i].text.split('\t');
                if (event.event.shiftKey && splitTab.length === 1) {
                    break;
                }
                if (this.currentAction === 'OL' && /^\d+$/.test(prevLineSplit[0].trim()) && listFormat) {
                    event.event.preventDefault();
                    parents[i].text = event.event.shiftKey ? splitTab.splice(1, splitTab.length).join('\t') : tabSpace + parents[i].text;
                    var curTabSpace = this.getTabSpace(parents[i].text);
                    var prevTabSpace = this.getTabSpace(prevLine);
                    var splitText = parents[i].text.split('. ');
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
                            var prevLineSplit_1 = prevLine.trim().split('. ');
                            if (/^\d+$/.test(prevLineSplit_1[0])) {
                                prevTabSpace = this.getTabSpace(prevLine);
                                if (prevTabSpace.length <= curTabSpace.length) {
                                    this.changeTextAreaValue(splitText, this.nextOrderedListValue(prevLineSplit_1[0]), event, textArea, parents, i, end);
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
                    for (var j = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ? parents[j].start + tabSpaceLength : parents[j].start;
                        parents[j].end = parents[j].end + tabSpaceLength;
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, event);
    };
    MDLists.prototype.changeTextAreaValue = function (splitText, prefixValue, event, textArea, parents, k, end) {
        var prefix = prefixValue;
        splitText.splice(0, 1);
        var textAreaLength = this.selection.getAllParents(textArea.value).length;
        var changedList = '';
        var curTabSpace = this.getTabSpace(parents[k].text);
        var prefixNumber = parseInt(prefix.split('.')[0], null);
        var nestedTabSpace = this.getTabSpace(parents[k].text);
        var nestedlistorder = true;
        var nestedListStart = true;
        var curTabSpaceLength;
        var nextPrefixValue = -1;
        var traversIncreased = true;
        var nextLineLength = 0;
        var lineBreak = '';
        changedList = (this.selection.getLine(textArea, parents[0].line + 1) !== '') ?
            '' : changedList + textArea.value.substr(parents[0].end, textArea.value.length);
        for (var i = 1; i < textAreaLength &&
            !isNullOrUndefined(this.selection.getLine(textArea, parents[0].line + i))
            && this.selection.getLine(textArea, parents[0].line + i) !== ''; i++) {
            var nextLine = this.selection.getLine(textArea, parents[0].line + i);
            var nextTabSpace = this.getTabSpace(nextLine);
            var nextLineSplit = nextLine.split('. ');
            if (nextLineSplit.length === 1) {
                changedList += textArea.value.substr(parents[0].end + nextLineLength, textArea.value.length);
                break;
            }
            else {
                nextLineLength += nextLine.length;
                var shiftTabTargetList = false;
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
                    var nextPrefix = event.event.shiftKey ?
                        (nextPrefixValue++, this.nextOrderedListValue(nextPrefixValue.toString()))
                        : this.previousOrderedListValue(nextLineSplit[0]);
                    nextLineSplit.splice(0, 1);
                    changedList = changedList + lineBreak + nextTabSpace + nextPrefix + nextLineSplit.join('. ');
                }
                else if (curTabSpace.length === nextTabSpace.length && nestedlistorder || shiftTabTargetList) {
                    var nextPrefix = this.nextOrderedListValue(prefixNumber.toString());
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
    };
    MDLists.prototype.getTabSpace = function (line) {
        var split = line.split('\t');
        var tabs = '';
        for (var i = 0; i < split.length; i++) {
            if (split[i] === '') {
                tabs += '\t';
            }
            else {
                break;
            }
        }
        return tabs;
    };
    MDLists.prototype.isNotFirstLine = function (textArea, points) {
        var currentLine = points.text;
        var prevIndex = points.line - 1;
        var prevLine = this.selection.getLine(textArea, prevIndex);
        var regex = this.getListRegex();
        var isNotFirst = false;
        var regexFirstCondition;
        if (prevLine) {
            this.currentAction = this.getAction(prevLine);
            var prevLineSplit = prevLine.split('. ');
            regexFirstCondition = this.currentAction === 'OL' ? /^\d+$/.test(prevLineSplit[0].trim()) : regex.test(prevLine.trim());
        }
        if (prevLine && regexFirstCondition) {
            var curTabSpace = this.getTabSpace(currentLine);
            var prevTabSpace = this.getTabSpace(prevLine);
            isNotFirst = curTabSpace === prevTabSpace ? true : isNotFirst;
            for (; prevTabSpace.length > curTabSpace.length; null) {
                prevIndex = prevIndex - 1;
                prevLine = this.selection.getLine(textArea, prevIndex);
                var prevLineSplit = prevLine.trim().split('. ');
                var regexSecondCondition = this.currentAction === 'OL' ?
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
    };
    MDLists.prototype.getAction = function (line) {
        var ol = line.split('. ')[0];
        var currentState = /^\d+$/.test(ol.trim());
        var ul = line.trim().split(new RegExp('^(' + this.selection.replaceSpecialChar(this.syntax.UL).trim() + ')'))[1];
        return (currentState ? 'OL' : ul ? 'UL' : 'NOTLIST');
    };
    MDLists.prototype.nextOrderedListValue = function (previousLine) {
        var currentValue = parseInt(previousLine, null);
        var nextValue = currentValue + 1;
        return nextValue.toString() + '. ';
    };
    MDLists.prototype.previousOrderedListValue = function (previousLine) {
        var currentValue = parseInt(previousLine, null);
        var nextValue = currentValue - 1;
        return nextValue.toString() + '. ';
    };
    MDLists.prototype.enterKey = function (event) {
        var textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var parents = this.selection.getSelectedParentPoints(textArea);
        var prevLine = this.selection.getLine(textArea, parents[0].line - 1);
        var listFormat = this.olListType();
        var regex = this.getListRegex();
        var prevLineSplit = [];
        if (!isNullOrUndefined(prevLine)) {
            prevLineSplit = prevLine.split('. ');
            this.currentAction = this.getAction(prevLine);
        }
        var addedLength = 0;
        if (this.currentAction === 'OL' && prevLineSplit.length > 1 && /^\d+$/.test(prevLineSplit[0].trim()) && listFormat
            && prevLineSplit[1] !== '') {
            var tabSpace = this.getTabSpace(prevLine);
            this.currentAction = this.getAction(prevLine);
            var prefix = this.nextOrderedListValue(prevLineSplit[0]);
            parents[0].text = tabSpace + prefix + parents[0].text;
            var textAreaLength = this.selection.getAllParents(textArea.value).length;
            var changedList = '\n';
            var curTabSpace = this.getTabSpace(prevLine);
            var nestedTabSpace = this.getTabSpace(parents[0].text);
            var nestedListOrder = true;
            for (var i = 1; i < textAreaLength &&
                textArea.value.substr(parents[0].end, textArea.value.length) !== ''; i++) {
                var nextLine = this.selection.getLine(textArea, parents[0].line + i);
                if (isNullOrUndefined(nextLine)) {
                    changedList = changedList + '';
                }
                else {
                    var nextLineSplit = nextLine.split('. ');
                    var nextTabSpace = this.getTabSpace(nextLine);
                    if (nextTabSpace.length < nestedTabSpace.length) {
                        nestedListOrder = false;
                    }
                    if (nextLineSplit.length > 1 && /^\d+$/.test(nextLineSplit[0].trim()) &&
                        curTabSpace.length === nextTabSpace.length && nestedListOrder) {
                        var nextPrefix = this.nextOrderedListValue(nextLineSplit[0]);
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
            var tabSpace = this.getTabSpace(prevLine);
            var prefix = this.syntax[this.currentAction];
            parents[0].text = tabSpace + prefix + parents[0].text +
                (parents[0].text.trim().length > 0 ? '\n' : '');
            textArea.value = textArea.value.substr(0, parents[0].start) + parents[0].text +
                textArea.value.substr(parents[0].end, textArea.value.length);
            start = start + prefix.length + tabSpace.length;
            addedLength += prefix.length + tabSpace.length;
        }
        this.restore(textArea, start, end + addedLength, event);
    };
    MDLists.prototype.olListType = function () {
        var olSyntaxList = this.syntax.OL.split('.,');
        var listType = olSyntaxList.length === 1 ? null :
            parseInt(olSyntaxList[2].trim(), null) - parseInt(olSyntaxList[0].trim(), null);
        if (listType) {
            return 1;
        }
        else {
            return 0;
        }
    };
    MDLists.prototype.applyListsHandler = function (e) {
        var textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        this.currentAction = e.subCommand;
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var addedLength = 0;
        var startLength = 0;
        var endLength = 0;
        var parents = this.selection.getSelectedParentPoints(textArea);
        var prefix = '';
        var listFormat;
        var regex;
        listFormat = this.olListType();
        var perfixObj = {};
        for (var i = 0; i < parents.length; i++) {
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
                        for (var j = i; j < parents.length; j++) {
                            parents[j].start = j !== 0 ? 1 + parents[j].start : parents[j].start;
                            parents[j].end = 1 + parents[j].end;
                        }
                    }
                }
                var preLineTabSpaceLength = !isNullOrUndefined(parents[i - 1]) ?
                    this.getTabSpace(parents[i - 1].text).length : 0;
                var replace = this.appliedLine(parents[i].text, regex, perfixObj, preLineTabSpaceLength);
                prefix = replace.line ? prefix : regex;
                parents[i].text = replace.line ? replace.line : prefix + parents[i].text;
                replace.space = replace.space ? replace.space : 0;
                textArea.value = textArea.value.substr(0, parents[i].start + endLength) + parents[i].text + '\n' +
                    textArea.value.substr(parents[i].end, textArea.value.length);
                start = i === 0 ? (start + prefix.length + replace.space) > 0 ?
                    start + prefix.length + replace.space : 0 : start;
                addedLength += prefix.length + replace.space;
                if (parents.length !== 1) {
                    for (var j = i; j < parents.length; j++) {
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
    };
    MDLists.prototype.appliedLine = function (line, prefixPattern, perfixObj, preTabSpaceLength) {
        var points = {};
        var regex = new RegExp('^[' + this.syntax.UL.trim() + ']');
        var lineSplit = line.split('. ');
        var currentPrefix = lineSplit[0] + '. ';
        var isExist = regex.test(line.trim()) || line.trim() === this.syntax.OL.trim()
            || line.trim() === this.syntax.UL.trim() || /^\d+$/.test(lineSplit[0].trim());
        var listFormat = this.olListType();
        var curTabSpaceLength = this.getTabSpace(line).length;
        if (this.currentAction === 'OL' && listFormat) {
            perfixObj[curTabSpaceLength.toString()] = !isNullOrUndefined(perfixObj[curTabSpaceLength.toString()]) ?
                perfixObj[curTabSpaceLength.toString()].valueOf() + 1 : 1;
            prefixPattern = perfixObj[curTabSpaceLength.toString()].valueOf().toString() + '. ';
            if (!isNullOrUndefined(preTabSpaceLength) && preTabSpaceLength > curTabSpaceLength) {
                perfixObj[preTabSpaceLength.toString()] = 0;
            }
        }
        if (isExist) {
            var replace = void 0;
            var pattern = void 0;
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
    };
    MDLists.prototype.restore = function (textArea, start, end, event) {
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
    };
    MDLists.prototype.getListRegex = function () {
        var regex = '';
        var configKey = Object.keys(this.syntax);
        for (var j = 0; j < configKey.length; j++) {
            var syntax = this.selection.replaceSpecialChar(this.syntax[configKey[j]]);
            regex += regex === '' ? '^(' + syntax + ')|^(' + syntax.trim() + ')' :
                '|^(' + syntax + ')|^(' + syntax.trim() + ')';
        }
        return new RegExp(regex);
    };
    return MDLists;
}());

/**
 * MDFormats internal plugin
 * @hidden
 * @deprecated
 */
var MDFormats = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function MDFormats(options) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    MDFormats.prototype.addEventListener = function () {
        this.parent.observer.on(FORMAT_TYPE, this.applyFormats, this);
    };
    MDFormats.prototype.applyFormats = function (e) {
        e.subCommand = e.subCommand.toLowerCase();
        var textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        var parents = this.selection.getSelectedParentPoints(textArea);
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
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var addedLength = 0;
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
        for (var i = 0; i < parents.length; i++) {
            if (parents[i].text !== '' && !this.selection.isStartWith(parents[i].text, '\\' + this.syntax[e.subCommand])) {
                parents[i].text = this.syntax[e.subCommand] + parents[i].text;
                textArea.value = textArea.value.substr(0, parents[i].start) + parents[i].text + '\n' +
                    textArea.value.substr(parents[i].end, textArea.value.length);
                start = i === 0 ? start + this.syntax[e.subCommand].length : start;
                addedLength += this.syntax[e.subCommand].length;
                if (parents.length !== 1) {
                    for (var j = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ?
                            this.syntax[e.subCommand].length + parents[j].start : parents[j].start;
                        parents[j].end = this.syntax[e.subCommand].length + parents[j].end;
                    }
                }
            }
            else if (parents[i].text === '' && i === 0) {
                this.selection.save(start, end);
                if (parents.length !== 1) {
                    for (var j = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ? 1 + parents[j].start : parents[j].start;
                        parents[j].end = 1 + parents[j].end;
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, e);
    };
    MDFormats.prototype.clearRegex = function () {
        var regex = '';
        var configKey = Object.keys(this.syntax);
        for (var j = 0; j < configKey.length && configKey[j] !== 'pre' && configKey[j] !== 'p'; j++) {
            regex += regex === '' ? '^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j]].trim()) + ')' :
                '|^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j]].trim()) + ')';
        }
        return regex;
    };
    MDFormats.prototype.cleanFormat = function (textArea, command) {
        var parents = this.selection.getSelectedParentPoints(textArea);
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var removeLength = 0;
        if (this.selection.isClear(parents, this.clearRegex())) {
            for (var i = 0; i < parents.length; i++) {
                var configKey = Object.keys(this.syntax);
                for (var j = 0; parents[i].text !== '' && j < configKey.length; j++) {
                    var removeText = this.syntax[configKey[j]];
                    if (configKey[j] === command) {
                        continue;
                    }
                    var regex = new RegExp('^(' + this.selection.replaceSpecialChar(removeText) + ')', 'gim');
                    if (regex.test(parents[i].text)) {
                        parents[i].text = parents[i].text.replace(regex, '');
                        textArea.value = textArea.value.substr(0, parents[i].start) + parents[i].text + '\n' +
                            textArea.value.substr(parents[i].end, textArea.value.length);
                        start = i === 0 ? (start - (removeText.length)) > 0 ? start - (removeText.length) : 0 : start;
                        removeLength += removeText.length;
                        if (parents.length !== 1) {
                            for (var k = 0; k < parents.length; k++) {
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
                        for (var j = i; j < parents.length; j++) {
                            parents[j].start = j !== 0 ? 1 + parents[j].start : parents[j].start;
                            parents[j].end = 1 + parents[j].end;
                        }
                    }
                }
            }
            this.restore(textArea, start, end - removeLength);
        }
    };
    MDFormats.prototype.applyCodeBlock = function (textArea, event, parents) {
        var command = event.subCommand;
        var start = parents[0].start;
        var end = parents[parents.length - 1].end;
        var parentLines = this.selection.getAllParents(textArea.value);
        var firstPrevText = parentLines[parents[0].line - 1];
        var lastNextText = parentLines[(parents.length + 1) + 1];
        if (!this.selection.isStartWith(firstPrevText, this.syntax.pre.split('\n')[0]) &&
            !this.selection.isStartWith(lastNextText, this.syntax.pre.split('\n')[0])) {
            var lines = textArea.value.substring(start, end).split('\n');
            var lastLine = lines[lines.length - 1] === '' ? '' : '\n';
            textArea.value = textArea.value.substr(0, start) + this.syntax[command] + textArea.value.substring(start, end) +
                lastLine + this.syntax[command] +
                textArea.value.substr(end, textArea.value.length);
            start = this.selection.selectionStart + this.syntax[command].length;
            end = this.selection.selectionEnd + this.syntax[command].length - 1;
        }
        else {
            var cmd = this.syntax[command];
            var selection = this.parent.markdownSelection.getSelectedInlinePoints(textArea);
            var startNo = textArea.value.substr(0, textArea.selectionStart).lastIndexOf(cmd);
            var endNo = textArea.value.substr(textArea.selectionEnd, textArea.selectionEnd).indexOf(cmd);
            endNo = endNo + selection.end;
            var repStartText = this.replaceAt(textArea.value.substr(0, selection.start), cmd, '', startNo, selection.start);
            var repEndText = this.replaceAt(textArea.value.substr(selection.end, textArea.value.length), cmd, '', 0, endNo);
            textArea.value = repStartText + selection.text + repEndText;
            start = this.selection.selectionStart - cmd.length;
            end = this.selection.selectionEnd - cmd.length;
        }
        this.restore(textArea, start, end, event);
    };
    MDFormats.prototype.replaceAt = function (input, search, replace, start, end) {
        return input.slice(0, start)
            + input.slice(start, end).replace(search, replace)
            + input.slice(end);
    };
    MDFormats.prototype.restore = function (textArea, start, end, event) {
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
    };
    MDFormats.prototype.isAppliedFormat = function (lines, documentNode) {
        var format = 'p';
        var configKey = Object.keys(this.syntax);
        var keys = Object.keys(this.syntax);
        var direction = this.parent.element.selectionDirection;
        var checkLine = direction === 'backward' ? lines[0].text : lines[lines.length - 1].text;
        for (var i = 0; !documentNode && i < keys.length; i++) {
            if (keys[i] !== 'pre' && this.selection.isStartWith(checkLine, this.syntax[keys[i]])) {
                format = keys[i];
                break;
            }
            else if (keys[i] === 'pre') {
                var parentLines = this.selection.getAllParents(this.parent.element.value);
                var firstPrevText = parentLines[lines[0].line - 1];
                var lastNextText = parentLines[lines.length + 1];
                if (this.selection.isStartWith(firstPrevText, this.syntax[keys[i]].split('\n')[0]) &&
                    this.selection.isStartWith(lastNextText, this.syntax[keys[i]].split('\n')[0])) {
                    format = keys[i];
                    break;
                }
            }
        }
        return format;
    };
    return MDFormats;
}());

/**
 * SelectionCommands internal component
 * @hidden
 * @deprecated
 */
var MDSelectionFormats = /** @__PURE__ @class */ (function () {
    function MDSelectionFormats(parent) {
        extend(this, this, parent, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    MDSelectionFormats.prototype.addEventListener = function () {
        this.parent.observer.on(selectionCommand, this.applyCommands, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
    };
    MDSelectionFormats.prototype.keyDownHandler = function (e) {
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
    };
    MDSelectionFormats.prototype.isBold = function (text, cmd) {
        return text.search('\\' + cmd + '\\' + cmd + '') !== -1;
    };
    MDSelectionFormats.prototype.isItalic = function (text, cmd) {
        return text.search('\\' + cmd) !== -1;
    };
    MDSelectionFormats.prototype.isMatch = function (text, cmd) {
        var matchText = [''];
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
    };
    MDSelectionFormats.prototype.multiCharRegx = function (cmd) {
        return new RegExp('(\\' + cmd + '\\' + cmd + ')', 'g');
    };
    MDSelectionFormats.prototype.singleCharRegx = function (cmd) {
        return new RegExp('(\\' + cmd + ')', 'g');
    };
    /**
     * markdown isAppliedCommand method
     * @hidden
     * @deprecated
     */
    MDSelectionFormats.prototype.isAppliedCommand = function (cmd) {
        var isFormat = false;
        var textArea = this.parent.element;
        var start = textArea.selectionStart;
        var splitAt = function (index) { return function (x) { return [x.slice(0, index), x.slice(index)]; }; };
        var splitText = splitAt(start)(textArea.value);
        var cmdB = this.syntax.Bold.substr(0, 1);
        var cmdI = this.syntax.Italic;
        var selectedText = this.parent.markdownSelection.getSelectedText(textArea);
        if (selectedText !== '' && selectedText === selectedText.toLocaleUpperCase() && cmd === 'UpperCase') {
            return true;
        }
        else if (selectedText === '') {
            var beforeText = textArea.value.substr(splitText[0].length - 1, 1);
            var afterText = splitText[1].substr(0, 1);
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
    };
    MDSelectionFormats.prototype.applyCommands = function (e) {
        this.currentAction = e.subCommand;
        var textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var addedLength = 0;
        var selection = this.parent.markdownSelection.getSelectedInlinePoints(textArea);
        if (this.isAppliedCommand(e.subCommand) && selection.text !== '') {
            var startCmd = this.syntax[e.subCommand];
            var endCmd = e.subCommand === 'SubScript' ? '</sub>' :
                e.subCommand === 'SuperScript' ? '</sup>' : this.syntax[e.subCommand];
            var startLength = (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') ? 0 : startCmd.length;
            var startNo = textArea.value.substr(0, selection.start).lastIndexOf(startCmd);
            var endNo = textArea.value.substr(selection.end, textArea.value.length).indexOf(endCmd);
            endNo = endNo + selection.end;
            var repStartText = this.replaceAt(textArea.value.substr(0, selection.start), startCmd, '', startNo, selection.start);
            var repEndText = this.replaceAt(textArea.value.substr(selection.end, textArea.value.length), endCmd, '', 0, endNo);
            textArea.value = repStartText + selection.text + repEndText;
            this.restore(textArea, start - startLength, end - startLength, e);
            return;
        }
        if (selection.text !== '' && !this.isApplied(selection, e.subCommand)) {
            addedLength = (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') ? 0 :
                this.syntax[e.subCommand].length;
            var repStart = textArea.value.substr(selection.start - this.syntax[e.subCommand].length, this.syntax[e.subCommand].length);
            var repEnd = void 0;
            if ((repStart === e.subCommand) || ((selection.start - this.syntax[e.subCommand].length ===
                textArea.value.indexOf(this.syntax[e.subCommand])) && (selection.end === textArea.value.lastIndexOf(this.syntax[e.subCommand]) || selection.end === textArea.value.lastIndexOf('</' + this.syntax[e.subCommand].substring(1, 5))))) {
                if (e.subCommand === 'SubScript' || e.subCommand === 'SuperScript') {
                    repEnd = textArea.value.substr(selection.end, this.syntax[e.subCommand].length + 1);
                }
                else {
                    repEnd = textArea.value.substr(selection.end, this.syntax[e.subCommand].length);
                }
                var repStartText = this.replaceAt(textArea.value.substr(0, selection.start), repStart, '', selection.start - this.syntax[e.subCommand].length, selection.start);
                var repEndText = this.replaceAt(textArea.value.substr(selection.end, textArea.value.length), repEnd, '', 0, repEnd.length);
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
    };
    MDSelectionFormats.prototype.replaceAt = function (input, search, replace, start, end) {
        return input.slice(0, start)
            + input.slice(start, end).replace(search, replace)
            + input.slice(end);
    };
    MDSelectionFormats.prototype.restore = function (textArea, start, end, event) {
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
    };
    MDSelectionFormats.prototype.textReplace = function (text, command) {
        var regx = this.singleCharRegx(this.syntax[command]);
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
                    var regxB = this.multiCharRegx(this.syntax[command].substr(0, 1));
                    var repText = text;
                    repText = repText.replace(regxB, '$%@').replace(regx, '');
                    var regxTemp = new RegExp('\\$%@', 'g');
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
    };
    MDSelectionFormats.prototype.isApplied = function (line, command) {
        var regx = this.singleCharRegx(this.syntax[command]);
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
                var regTest = void 0;
                var regxB = this.multiCharRegx(this.syntax[command].substr(0, 1));
                if (regxB.test(line.text)) {
                    var repText = line.text;
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
    };
    return MDSelectionFormats;
}());

/**
 * Default Markdown formats config for adapter
 */
var markdownFormatTags = {
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
var markdownSelectionTags = {
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
var markdownListsTags = {
    'OL': '1. ',
    'UL': '- ',
};
/**
 * Default html key config for adapter
 */
var htmlKeyConfig = {
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
var markdownKeyConfig = {
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
var pasteCleanupGroupingTags = {
    'b': ['strong'],
    'strong': ['b'],
    'i': ['emp', 'cite'],
    'emp': ['i', 'cite'],
    'cite': ['i', 'emp']
};
/**
 * PasteCleanup Grouping of similar functionality tags
 */
var listConversionFilters = {
    'first': 'MsoListParagraphCxSpFirst',
    'middle': 'MsoListParagraphCxSpMiddle',
    'last': 'MsoListParagraphCxSpLast'
};
/**
 * Dom-Node Grouping of self closing tags
 * @hidden
 */
var selfClosingTags = [
    'BR',
    'IMG'
];

/**
 * `Undo` module is used to handle undo actions.
 */
var UndoRedoCommands = /** @__PURE__ @class */ (function () {
    function UndoRedoCommands(parent, options) {
        this.undoRedoStack = [];
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    UndoRedoCommands.prototype.addEventListener = function () {
        var debounceListener = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(KEY_UP_HANDLER, debounceListener, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(ACTION, this.onAction, this);
        this.parent.observer.on(MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
    };
    UndoRedoCommands.prototype.onPropertyChanged = function (props) {
        for (var _i = 0, _a = Object.keys(props.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'undoRedoSteps':
                    this.undoRedoSteps = props.newProp.undoRedoSteps;
                    break;
                case 'undoRedoTimer':
                    this.undoRedoTimer = props.newProp.undoRedoTimer;
                    break;
            }
        }
    };
    UndoRedoCommands.prototype.removeEventListener = function () {
        var debounceListener = debounce(this.keyUp, 300);
        this.parent.observer.off(KEY_UP_HANDLER, debounceListener);
        this.parent.observer.off(KEY_DOWN_HANDLER, this.keyDown);
        this.parent.observer.off(ACTION, this.onAction);
        this.parent.observer.off(MODEL_CHANGED_PLUGIN, this.onPropertyChanged);
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoCommands.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * onAction method
     * @hidden
     * @deprecated
     */
    UndoRedoCommands.prototype.onAction = function (e) {
        if (e.subCommand === 'Undo') {
            this.undo(e);
        }
        else {
            this.redo(e);
        }
    };
    UndoRedoCommands.prototype.keyDown = function (e) {
        var event = e.event;
        var proxy = this;
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
    };
    UndoRedoCommands.prototype.keyUp = function (e) {
        if (e.event.keyCode !== 17 && !e.event.ctrlKey) {
            this.saveData(e);
        }
    };
    /**
     * MD collection stored string format.
     * @method saveData
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoCommands.prototype.saveData = function (e) {
        var textArea = this.parent.element;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var textValue = this.parent.element.value;
        var changEle = { text: textValue, start: start, end: end };
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
    };
    /**
     * Undo the editable text.
     * @method undo
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoCommands.prototype.undo = function (e) {
        if (this.steps > 0) {
            this.currentAction = 'Undo';
            var start = this.undoRedoStack[this.steps - 1].start;
            var end = this.undoRedoStack[this.steps - 1].end;
            var removedContent = this.undoRedoStack[this.steps - 1].text;
            this.parent.element.value = removedContent;
            this.parent.element.focus();
            this.steps--;
            this.restore(this.parent.element, start, end, e);
        }
    };
    /**
     * Redo the editable text.
     * @method redo
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoCommands.prototype.redo = function (e) {
        if (this.undoRedoStack[this.steps + 1] != null) {
            this.currentAction = 'Redo';
            var start = this.undoRedoStack[this.steps + 1].start;
            var end = this.undoRedoStack[this.steps + 1].end;
            this.parent.element.value = this.undoRedoStack[this.steps + 1].text;
            this.parent.element.focus();
            this.steps++;
            this.restore(this.parent.element, start, end, e);
        }
    };
    UndoRedoCommands.prototype.restore = function (textArea, start, end, event) {
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
    };
    /**
     * getUndoStatus method
     * @hidden
     * @deprecated
     */
    UndoRedoCommands.prototype.getUndoStatus = function () {
        var status = { undo: false, redo: false };
        if (this.steps > 0) {
            status.undo = true;
        }
        if (this.undoRedoStack[this.steps + 1] != null) {
            status.redo = true;
        }
        return status;
    };
    return UndoRedoCommands;
}());

/**
 * Link internal component
 * @hidden
 * @deprecated
 */
var MDLink = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function MDLink(parent) {
        this.parent = parent;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    MDLink.prototype.addEventListener = function () {
        this.parent.observer.on(LINK_COMMAND, this.createLink, this);
    };
    MDLink.prototype.createLink = function (e) {
        var textArea = this.parent.element;
        textArea.focus();
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var text = (e.subCommand === 'Image') ? this.selection.getSelectedText(textArea) : e.item.text;
        var startOffset = (e.subCommand === 'Image') ? (start + 2) : (start + 1);
        var endOffset = (e.subCommand === 'Image') ? (end + 2) : (end + 1);
        text = (e.subCommand === 'Image') ? '![' + text + '](' + e.item.url + ')' : '[' + text + '](' + e.item.url + ')';
        textArea.value = textArea.value.substr(0, start)
            + text + textArea.value.substr(end, textArea.value.length);
        this.parent.markdownSelection.setSelection(textArea, startOffset, endOffset);
        this.restore(textArea, startOffset, endOffset, e);
    };
    MDLink.prototype.restore = function (textArea, start, end, event) {
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
    };
    return MDLink;
}());

/**
 * Link internal component
 * @hidden
 * @deprecated
 */
var MDTable = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function MDTable(options) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    MDTable.prototype.addEventListener = function () {
        this.parent.observer.on(MD_TABLE, this.createTable, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    MDTable.prototype.removeEventListener = function () {
        this.parent.observer.off(MD_TABLE, this.createTable);
        this.parent.observer.off(KEY_DOWN_HANDLER, this.onKeyDown);
    };
    /**
     * markdown destroy method
     * @hidden
     * @deprecated
     */
    MDTable.prototype.destroy = function () {
        this.removeEventListener();
    };
    MDTable.prototype.onKeyDown = function (e) {
        if (e.event.action === 'insert-table') {
            e.item = e.value;
            this.createTable(e);
        }
    };
    MDTable.prototype.createTable = function (e) {
        this.element = this.parent.element;
        var start = this.element.selectionStart;
        var end = this.element.selectionEnd;
        var textAreaInitial;
        textAreaInitial = this.element.value;
        this.locale = e;
        this.selection.save(start, end);
        this.restore(this.element.selectionStart, this.element.selectionEnd, null);
        this.insertTable(start, end, textAreaInitial, e);
    };
    MDTable.prototype.getTable = function () {
        var table = '';
        table += this.textNonEmpty();
        table += this.tableHeader(this.locale);
        table += this.tableCell(this.locale);
        return table;
    };
    MDTable.prototype.tableHeader = function (e) {
        var text = '';
        for (var i = 1; i <= 2; i++) {
            text += '|';
            for (var j = 1; j <= 2; j++) {
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
    };
    MDTable.prototype.tableCell = function (e) {
        var text = '';
        for (var i = 1; i <= 2; i++) {
            text += '|';
            for (var j = 1; j <= 2; j++) {
                text += e.item.colText + ' ' + this.convertToLetters(i) + j + '|';
            }
            text += this.insertLine();
        }
        text += this.insertLine();
        return text;
    };
    MDTable.prototype.insertLine = function () {
        var dummyElement = document.createElement('div');
        dummyElement.innerHTML = '\n';
        return dummyElement.textContent;
    };
    MDTable.prototype.insertTable = function (start, end, textAreaInitial, e) {
        var parentText = this.selection.getSelectedParentPoints(this.element);
        var lastLineSplit = parentText[parentText.length - 1].text.split(' ', 2);
        var syntaxArr = this.getFormatTag();
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
    };
    MDTable.prototype.makeSelection = function (textAreaInitial, start, end) {
        end = start + (textAreaInitial.length > 0 ? 12 : 10); //end is added 12 or 10 because to make the table heading selected
        start += textAreaInitial.length > 0 ? 3 : 1; // Start is added 3 or 1 because new lines are added when inserting table
        this.selection.setSelection(this.element, start, end);
    };
    MDTable.prototype.getFormatTag = function () {
        var syntaxFormatKey = Object.keys(this.syntaxTag.Formats);
        var syntaxListKey = Object.keys(this.syntaxTag.List);
        var syntaxArr = [];
        for (var i = 0; i < syntaxFormatKey.length; i++) {
            syntaxArr.push(this.syntaxTag.Formats[syntaxFormatKey[i]]);
        }
        for (var j = 0; j < syntaxListKey.length; j++) {
            syntaxArr.push(this.syntaxTag.List[syntaxListKey[j]]);
        }
        return syntaxArr;
    };
    MDTable.prototype.ensureFormatApply = function (line) {
        var formatTags = this.getFormatTag();
        var formatSplitZero = line.trim().split(' ', 2)[0] + ' ';
        for (var i = 0; i < formatTags.length; i++) {
            if (formatSplitZero === formatTags[i] || /^[\d.]+[ ]+$/.test(formatSplitZero)) {
                return true;
            }
        }
        return false;
    };
    MDTable.prototype.ensureStartValid = function (firstLine, parentText) {
        var firstLineSplit = parentText[0].text.split(' ', 2);
        for (var i = firstLine + 1; i <= firstLine + firstLineSplit[0].length + 1; i++) {
            if (this.element.selectionStart === i || this.element.selectionEnd === i) {
                return false;
            }
        }
        return true;
    };
    MDTable.prototype.ensureEndValid = function (lastLine, formatSplitLength) {
        for (var i = lastLine + 1; i <= lastLine + formatSplitLength + 1; i++) {
            if (this.element.selectionEnd === i) {
                return false;
            }
        }
        return true;
    };
    MDTable.prototype.updateValueWithFormat = function (formatSplit, text) {
        var textApplyFormat = this.element.value.substring(this.element.selectionEnd, this.element.value.length);
        text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
        return this.element.value.substr(0, this.element.selectionStart) + text;
    };
    MDTable.prototype.updateValue = function (text) {
        return this.element.value.substr(0, this.element.selectionStart) + text +
            this.element.value.substr(this.element.selectionEnd, this.element.value.length);
    };
    MDTable.prototype.checkValid = function (start, end, text, textAreaInitial, e, formatSplit, parentText, syntaxArr) {
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
    };
    MDTable.prototype.convertToLetters = function (rowNumber) {
        var baseChar = ('A').charCodeAt(0);
        var letters = '';
        do {
            rowNumber -= 1;
            letters = String.fromCharCode(baseChar + (rowNumber % 26)) + letters;
            rowNumber = (rowNumber / 26) >> 0;
        } while (rowNumber > 0);
        return letters;
    };
    MDTable.prototype.textNonEmpty = function () {
        var emptyText = '';
        if (this.isCursorBased() || this.isSelectionBased()) {
            if (this.element.value.length > 0) {
                emptyText += this.insertLine();
                emptyText += this.insertLine(); // to append two new line when textarea having content.               
            }
        }
        return emptyText;
    };
    MDTable.prototype.isCursorBased = function () {
        return this.element.selectionStart === this.element.selectionEnd;
    };
    MDTable.prototype.isSelectionBased = function () {
        return this.element.selectionStart !== this.element.selectionEnd;
    };
    MDTable.prototype.restore = function (start, end, event) {
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
    };
    return MDTable;
}());

/**
 * Link internal component
 * @hidden
 * @deprecated
 */
var ClearFormat = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the clear format plugin
     * @hidden
     * @deprecated
     */
    function ClearFormat(parent) {
        this.parent = parent;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    ClearFormat.prototype.addEventListener = function () {
        this.parent.observer.on(CLEAR_COMMAND, this.clear, this);
    };
    ClearFormat.prototype.replaceRegex = function (data) {
        return data.replace(/\*/ig, '\\*').replace(/\&/ig, '\\&')
            .replace(/\-/ig, '\\-').replace(/\^/ig, '\\^')
            .replace(/\$/ig, '\\$').replace(/\./ig, '\\.')
            .replace(/\|/ig, '\\|').replace(/\?/ig, '\\?')
            .replace(/\+/ig, '\\+').replace(/\-/ig, '\\-')
            .replace(/\&/ig, '\\&');
    };
    ClearFormat.prototype.clearSelectionTags = function (text) {
        var data = this.parent.selectionTags;
        var keys = Object.keys(data);
        for (var num = 0; num < keys.length; num++) {
            var key = keys[num];
            if (data.hasOwnProperty(key) && data[key] !== '') {
                var expString = this.replaceRegex(data[key]);
                var regExp = void 0;
                var startExp = void 0;
                var endExp = void 0;
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
                var val = text.match(regExp);
                for (var index = 0; val && index < val.length && val[index] !== ''; index++) {
                    text = text.replace(val[index], val[index].substr(startExp, val[index].length - endExp - startExp));
                }
            }
        }
        return text;
    };
    ClearFormat.prototype.clearFormatTags = function (text) {
        var lines = text.split('\n');
        return this.clearFormatLines(lines);
    };
    ClearFormat.prototype.clearFormatLines = function (lines) {
        var tags = [this.parent.formatTags, this.parent.listTags];
        var str = '';
        for (var len = 0; len < lines.length; len++) {
            for (var num = 0; num < tags.length; num++) {
                var data = tags[num];
                var keys = Object.keys(data);
                for (var index = 0; index < keys.length; index++) {
                    var key = keys[index];
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
    };
    ClearFormat.prototype.clear = function (e) {
        var textArea = this.parent.element;
        textArea.focus();
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var text = this.selection.getSelectedText(textArea);
        text = this.clearSelectionTags(text);
        text = this.clearFormatTags(text);
        textArea.value = textArea.value.substr(0, start)
            + text + textArea.value.substr(end, textArea.value.length);
        this.parent.markdownSelection.setSelection(textArea, start, start + text.length);
        this.restore(textArea, start, start + text.length, e);
    };
    ClearFormat.prototype.restore = function (textArea, start, end, event) {
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
    };
    return ClearFormat;
}());

/**
 * MarkdownParser internal component
 * @hidden
 * @deprecated
 */
var MarkdownParser = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the component
     * @hidden
     * @deprecated
     */
    function MarkdownParser(options) {
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
    MarkdownParser.prototype.initialize = function () {
        this.formatTags = markdownFormatTags;
        this.listTags = markdownListsTags;
        this.selectionTags = markdownSelectionTags;
    };
    MarkdownParser.prototype.wireEvents = function () {
        this.observer.on(KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(KEY_UP, this.editorKeyUp, this);
        this.observer.on(MODEL_CHANGED, this.onPropertyChanged, this);
    };
    MarkdownParser.prototype.onPropertyChanged = function (props) {
        this.observer.notify(MODEL_CHANGED_PLUGIN, props);
    };
    MarkdownParser.prototype.editorKeyDown = function (e) {
        this.observer.notify(KEY_DOWN_HANDLER, e);
    };
    MarkdownParser.prototype.editorKeyUp = function (e) {
        this.observer.notify(KEY_UP_HANDLER, e);
    };
    /**
     * markdown execCommand method
     * @hidden
     * @deprecated
     */
    MarkdownParser.prototype.execCommand = function (command, value, event, callBack, text, exeValue) {
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
    };
    return MarkdownParser;
}());

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
 * Markdown adapter
 * @hidden
 * @deprecated
 */
var MarkdownFormatter = /** @__PURE__ @class */ (function (_super) {
    __extends$1(MarkdownFormatter, _super);
    function MarkdownFormatter(options) {
        var _this = _super.call(this) || this;
        _this.initialize();
        extend(_this, _this, options, true);
        if (options && _this.element) {
            _this.updateFormatter(_this.element, document, options.options);
        }
        return _this;
    }
    MarkdownFormatter.prototype.initialize = function () {
        this.keyConfig = markdownKeyConfig;
        this.formatTags = markdownFormatTags;
        this.listTags = markdownListsTags;
        this.selectionTags = markdownSelectionTags;
    };
    /**
     * Update the formatter of RichTextEditor
     * @param  {Element} editElement
     * @param  {Document} doc
     * @hidden
     * @deprecated
     */
    MarkdownFormatter.prototype.updateFormatter = function (editElement, doc, options) {
        if (editElement) {
            this.editorManager = new MarkdownParser({
                element: editElement,
                formatTags: this.formatTags,
                listTags: this.listTags,
                selectionTags: this.selectionTags,
                options: options
            });
        }
    };
    return MarkdownFormatter;
}(Formatter));

/**
 * Markdown module is used to render RichTextEditor as Markdown editor content
 * @hidden
 * @deprecated
 */
var MarkdownRender = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for content renderer module
     */
    function MarkdownRender(parent) {
        this.parent = parent;
    }
    /**
     * The function is used to render RichTextEditor content div
     * @hidden
     * @deprecated
     */
    MarkdownRender.prototype.renderPanel = function () {
        var rteObj = this.parent;
        var div = this.parent.createElement('div', { id: this.parent.getID() + '_view', className: 'e-rte-content' });
        this.editableElement = this.parent.createElement('textarea', {
            className: 'e-content',
            id: this.parent.getID() + '_editable-content'
        });
        div.appendChild(this.editableElement);
        this.setPanel(div);
        rteObj.element.appendChild(div);
    };
    /**
     * Get the content div element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    MarkdownRender.prototype.getPanel = function () {
        return this.contentPanel;
    };
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    MarkdownRender.prototype.getEditPanel = function () {
        return this.editableElement;
    };
    /**
     * Returns the text content as string.
     * @return {string}
     */
    MarkdownRender.prototype.getText = function () {
        return this.getEditPanel().value;
    };
    /**
     * Set the content div element of RichTextEditor
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    MarkdownRender.prototype.setPanel = function (panel) {
        this.contentPanel = panel;
    };
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     * @hidden
     * @deprecated
     */
    MarkdownRender.prototype.getDocument = function () {
        return this.getEditPanel().ownerDocument;
    };
    return MarkdownRender;
}());

/**
 * `MarkdownEditor` module is used to markdown editor
 */
var MarkdownEditor = /** @__PURE__ @class */ (function () {
    function MarkdownEditor(parent, serviceLocator) {
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
     * @deprecated
     */
    MarkdownEditor.prototype.destroy = function () {
        this.removeEventListener();
    };
    MarkdownEditor.prototype.addEventListener = function () {
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
    };
    MarkdownEditor.prototype.updateReadOnly = function () {
        if (this.parent.readonly) {
            this.parent.contentModule.getEditPanel().setAttribute('readonly', 'readonly');
            addClass([this.parent.element], CLS_RTE_READONLY);
        }
        else {
            this.parent.contentModule.getEditPanel().removeAttribute('readonly');
            removeClass([this.parent.element], CLS_RTE_READONLY);
        }
    };
    MarkdownEditor.prototype.onSelectionSave = function () {
        var textArea = this.parent.contentModule.getEditPanel();
        this.saveSelection.save(textArea.selectionStart, textArea.selectionEnd);
    };
    MarkdownEditor.prototype.onSelectionRestore = function (e) {
        this.contentRenderer.getEditPanel().focus();
        var textArea = this.parent.contentModule.getEditPanel();
        this.saveSelection.restore(textArea);
    };
    MarkdownEditor.prototype.onToolbarClick = function (args) {
        var text;
        var startOffset;
        var endOffset;
        var item = args.item;
        var textArea = this.parent.contentModule.getEditPanel();
        textArea.focus();
        startOffset = textArea.selectionStart;
        endOffset = textArea.selectionEnd;
        text = textArea.value.substring(startOffset, endOffset);
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
                var tableConstant = {
                    'headingText': this.parent.localeObj.getConstant('TableHeadingText'),
                    'colText': this.parent.localeObj.getConstant('TableColText')
                };
                this.parent.formatter.process(this.parent, args, args.originalEvent, tableConstant);
                break;
            default:
                this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                break;
        }
    };
    MarkdownEditor.prototype.instantiateRenderer = function () {
        this.renderFactory.addRenderer(RenderType.Content, new MarkdownRender(this.parent));
    };
    MarkdownEditor.prototype.removeEventListener = function () {
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
    };
    MarkdownEditor.prototype.render = function () {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        var editElement = this.contentRenderer.getEditPanel();
        var option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
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
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    MarkdownEditor.prototype.onPropertyChanged = function (e) {
        // On property code change here
        if (!isNullOrUndefined(e.newProp.formatter)) {
            var editElement = this.contentRenderer.getEditPanel();
            var option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
    };
    /**
     * For internal use only - Get the module name.
     */
    MarkdownEditor.prototype.getModuleName = function () {
        return 'markdownEditor';
    };
    /**
     * For selecting all content in RTE
     * @private
     */
    MarkdownEditor.prototype.selectAll = function () {
        this.parent.formatter.editorManager.markdownSelection.setSelection(this.parent.contentModule.getEditPanel(), 0, this.parent.contentModule.getEditPanel().value.length);
    };
    /**
     * For get a selected text in RTE
     * @private
     */
    MarkdownEditor.prototype.getSelectedHtml = function (e) {
        e.callBack(this.parent.formatter.editorManager.markdownSelection.getSelectedText(this.parent.contentModule.getEditPanel()));
    };
    return MarkdownEditor;
}());

/**
 * Constant values for EditorManager
 */
/**
 * Image plugin events
 * @hidden
 */
var IMAGE = 'INSERT-IMAGE';
var TABLE = 'INSERT-TABLE';
var LINK = 'INSERT-LINK';
var INSERT_ROW = 'INSERT-ROW';
var INSERT_COLUMN = 'INSERT-COLUMN';
var DELETEROW = 'DELETE-ROW';
var DELETECOLUMN = 'DELETE-COLUMN';
var REMOVETABLE = 'REMOVE-TABLE';
var TABLEHEADER = 'TABLE-HEADER';
var TABLE_VERTICAL_ALIGN = 'TABLE_VERTICAL_ALIGN';
/**
 * Alignments plugin events
 * @hidden
 */
var ALIGNMENT_TYPE = 'alignment-type';
/**
 * Indents plugin events
 * @hidden
 */
var INDENT_TYPE = 'indent-type';
/** Constant tag names
 * @hidden
 */
var DEFAULT_TAG = 'p';
/**
 * @hidden
 */
var BLOCK_TAGS = ['address', 'article', 'aside', 'audio', 'blockquote',
    'canvas', 'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav',
    'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr', 'ul', 'video'];
/**
 * @hidden
 */
var IGNORE_BLOCK_TAGS = ['td', 'th'];
/**
 * @hidden
 */
var TABLE_BLOCK_TAGS = ['table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr'];
/**
 * Selection plugin events
 * @hidden
 */
var SELECTION_TYPE = 'selection-type';
/**
 * Insert HTML plugin events
 * @hidden
 */
var INSERTHTML_TYPE = 'inserthtml-type';
/**
 * Insert Text plugin events
 * @hidden
 */
var INSERT_TEXT_TYPE = 'insert-text-type';
/**
 * Clear Format HTML plugin events
 * @hidden
 */
var CLEAR_TYPE = 'clear-type';

/**
 * `Selection` module is used to handle RTE Selections.
 */
var NodeSelection = /** @__PURE__ @class */ (function () {
    function NodeSelection() {
        this.startNodeName = [];
        this.endNodeName = [];
    }
    NodeSelection.prototype.saveInstance = function (range, body) {
        this.range = range.cloneRange();
        this.rootNode = this.documentFromRange(range);
        this.body = body;
        this.startContainer = this.getNodeArray(range.startContainer, true);
        this.endContainer = this.getNodeArray(range.endContainer, false);
        this.startOffset = range.startOffset;
        this.endOffset = range.endOffset;
        this.html = this.body.innerHTML;
        return this;
    };
    NodeSelection.prototype.documentFromRange = function (range) {
        return (9 === range.startContainer.nodeType) ? range.startContainer : range.startContainer.ownerDocument;
    };
    NodeSelection.prototype.getRange = function (docElement) {
        var select$$1 = this.get(docElement);
        var range = select$$1 && select$$1.rangeCount > 0 ? select$$1.getRangeAt(select$$1.rangeCount - 1) : docElement.createRange();
        return (range.startContainer !== docElement || range.endContainer !== docElement
            || range.startOffset || range.endOffset || (range.setStart(docElement.body, 0), range.collapse(!0)), range);
    };
    /**
     * get method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.get = function (docElement) {
        return docElement.defaultView.getSelection();
    };
    /**
     * save method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.save = function (range, docElement) {
        range = (range) ? range.cloneRange() : this.getRange(docElement);
        return this.saveInstance(range, docElement.body);
    };
    /**
     * getIndex method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getIndex = function (node) {
        var index;
        var num = 0;
        node = !node.previousSibling && node.tagName === 'BR' ? node : node.previousSibling;
        if (node) {
            for (var type = node.nodeType; node; null) {
                index = node.nodeType;
                num++;
                type = index;
                node = node.previousSibling;
            }
        }
        return num;
    };
    NodeSelection.prototype.isChildNode = function (nodeCollection, parentNode) {
        for (var index = 0; index < parentNode.childNodes.length; index++) {
            if (nodeCollection.indexOf(parentNode.childNodes[index]) > -1) {
                return true;
            }
        }
        return false;
    };
    NodeSelection.prototype.getNode = function (startNode, endNode, nodeCollection) {
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
    };
    /**
     * getNodeCollection method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getNodeCollection = function (range) {
        var startNode = range.startContainer.childNodes[range.startOffset]
            || range.startContainer;
        var endNode = range.endContainer.childNodes[(range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer;
        if (startNode === endNode && startNode.childNodes.length === 0) {
            return [startNode];
        }
        if (range.startOffset === range.endOffset && range.startOffset !== 0 && range.startContainer.nodeName === 'PRE') {
            return [startNode.nodeName === 'BR' || startNode.nodeName === '#text' ? startNode : startNode.childNodes[0]];
        }
        var nodeCollection = [];
        do {
            if (nodeCollection.indexOf(startNode) === -1) {
                nodeCollection.push(startNode);
            }
            startNode = this.getNode(startNode, endNode, nodeCollection);
        } while (startNode);
        return nodeCollection;
    };
    /**
     * getParentNodeCollection method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getParentNodeCollection = function (range) {
        return this.getParentNodes(this.getNodeCollection(range), range);
    };
    /**
     * getParentNodes method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getParentNodes = function (nodeCollection, range) {
        nodeCollection = nodeCollection.reverse();
        for (var index = 0; index < nodeCollection.length; index++) {
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
    };
    /**
     * getSelectionNodeCollection method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getSelectionNodeCollection = function (range) {
        return this.getSelectionNodes(this.getNodeCollection(range));
    };
    /**
     * getParentNodes method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getSelectionNodes = function (nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        for (var index = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeType !== 3 || nodeCollection[index].textContent.trim() === '') {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    };
    /**
     * getInsertNodeCollection method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getInsertNodeCollection = function (range) {
        return this.getInsertNodes(this.getNodeCollection(range));
    };
    /**
     * getInsertNodes method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getInsertNodes = function (nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        for (var index = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection[index].childNodes.length !== 0 &&
                nodeCollection[index].nodeType !== 3) ||
                (nodeCollection[index].nodeType === 3 &&
                    nodeCollection[index].textContent === '')) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    };
    /**
     * getNodeArray method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getNodeArray = function (node, isStart, root) {
        var array = [];
        ((isStart) ? (this.startNodeName = []) : (this.endNodeName = []));
        for (; node !== (root ? root : this.rootNode); null) {
            (isStart) ? this.startNodeName.push(node.nodeName.toLowerCase()) : this.endNodeName.push(node.nodeName.toLowerCase());
            array.push(this.getIndex(node));
            node = node.parentNode;
        }
        return array;
    };
    NodeSelection.prototype.setRangePoint = function (range, isvalid, num, size) {
        var node = this.rootNode;
        var index = num.length;
        var constant = size;
        for (; index--; null) {
            node = node && node.childNodes[num[index]];
        }
        if (node && constant >= 0) {
            range[isvalid ? 'setStart' : 'setEnd'](node, constant);
        }
        return range;
    };
    /**
     * restore method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.restore = function () {
        var range = this.range.cloneRange();
        range = this.setRangePoint(range, true, this.startContainer, this.startOffset);
        range = this.setRangePoint(range, false, this.endContainer, this.endOffset);
        this.selectRange(this.rootNode, range);
        return range;
    };
    NodeSelection.prototype.selectRange = function (docElement, range) {
        this.setRange(docElement, range);
        this.save(range, docElement);
    };
    /**
     * setRange method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.setRange = function (docElement, range) {
        var selection = this.get(docElement);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    /**
     * setSelectionText method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.setSelectionText = function (docElement, startNode, endNode, startIndex, endIndex) {
        var range = docElement.createRange();
        range.setStart(startNode, startIndex);
        range.setEnd(endNode, endIndex);
        this.setRange(docElement, range);
    };
    /**
     * setSelectionContents method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.setSelectionContents = function (docElement, element) {
        var range = docElement.createRange();
        range.selectNode(element);
        this.setRange(docElement, range);
    };
    /**
     * setSelectionNode method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.setSelectionNode = function (docElement, element) {
        var range = docElement.createRange();
        range.selectNodeContents(element);
        this.setRange(docElement, range);
    };
    /**
     * getSelectedNodes method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.getSelectedNodes = function (docElement) {
        return this.getNodeCollection(this.getRange(docElement));
    };
    /**
     * Clear method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.Clear = function (docElement) {
        this.get(docElement).removeAllRanges();
    };
    /**
     * insertParentNode method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.insertParentNode = function (docElement, newNode, range) {
        range.surroundContents(newNode);
        this.selectRange(docElement, range);
    };
    /**
     * setCursorPoint method
     * @hidden
     * @deprecated
     */
    NodeSelection.prototype.setCursorPoint = function (docElement, element, point) {
        var range = docElement.createRange();
        var selection = docElement.defaultView.getSelection();
        range.setStart(element, point);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    return NodeSelection;
}());

/**
 * `Selection` module is used to handle RTE Selections.
 */

var markerClassName = {
    startSelection: 'e-editor-select-start',
    endSelection: 'e-editor-select-end'
};
/**
 * DOMNode internal plugin
 * @hidden
 * @deprecated
 */
var DOMNode = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the DOMNode plugin
     * @hidden
     * @deprecated
     */
    function DOMNode(parent, currentDocument) {
        this.parent = parent;
        this.nodeSelection = new NodeSelection();
        this.currentDocument = currentDocument;
    }
    /**
     * contents method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.contents = function (element) {
        return (element && 'IFRAME' !== element.tagName ? Array.prototype.slice.call(element.childNodes || []) : []);
    };
    /**
     * isBlockNode method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.isBlockNode = function (element) {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) >= 0));
    };
    /**
     * isLink method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.isLink = function (element) {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && 'a' === element.tagName.toLowerCase()));
    };
    /**
     * blockParentNode method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.blockParentNode = function (element) {
        for (; element && element.parentNode !== this.parent && ((!element.parentNode ||
            !this.hasClass(element.parentNode, 'e-node-inner'))); null) {
            element = element.parentNode;
            if (this.isBlockNode(element)) {
                return element;
            }
        }
        return element;
    };
    /**
     * rawAttributes method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.rawAttributes = function (element) {
        var rawAttr = {};
        var attributes$$1 = element.attributes;
        if (attributes$$1.length > 0) {
            for (var d = 0; d < attributes$$1.length; d++) {
                var e = attributes$$1[d];
                rawAttr[e.nodeName] = e.value;
            }
        }
        return rawAttr;
    };
    /**
     * attributes method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.attributes = function (element) {
        if (!element) {
            return '';
        }
        var attr = '';
        var rawAttr = this.rawAttributes(element);
        var orderRawAttr = Object.keys(rawAttr).sort();
        for (var e = 0; e < orderRawAttr.length; e++) {
            var attrKey = orderRawAttr[e];
            var attrValue = rawAttr[attrKey];
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
    };
    /**
     * clearAttributes method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.clearAttributes = function (element) {
        for (var attr = element.attributes, c = attr.length - 1; c >= 0; c--) {
            var key = attr[c];
            element.removeAttribute(key.nodeName);
        }
    };
    /**
     * openTagString method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.openTagString = function (element) {
        return '<' + element.tagName.toLowerCase() + this.attributes(element) + '>';
    };
    /**
     * closeTagString method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.closeTagString = function (element) {
        return '</' + element.tagName.toLowerCase() + '>';
    };
    /**
     * createTagString method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.createTagString = function (tagName, relativeElement, innerHTML) {
        return '<' + tagName.toLowerCase() + this.attributes(relativeElement) + '>' + innerHTML + '</' + tagName.toLowerCase() + '>';
    };
    /**
     * isList method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.isList = function (element) {
        return !!element && ['UL', 'OL'].indexOf(element.tagName) >= 0;
    };
    /**
     * isElement method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.isElement = function (element) {
        return element === this.parent;
    };
    /**
     * isEditable method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.isEditable = function (element) {
        return ((!element.getAttribute || element.getAttribute('contenteditable') === 'true')
            && ['STYLE', 'SCRIPT'].indexOf(element.tagName) < 0);
    };
    /**
     * hasClass method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.hasClass = function (element, className) {
        return element && element.classList && element.classList.contains(className);
    };
    /**
     * replaceWith method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.replaceWith = function (element, value) {
        var parentNode = element.parentNode;
        parentNode.insertBefore(this.parseHTMLFragment(value), element);
        detach(element);
    };
    /**
     * parseHTMLFragment method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.parseHTMLFragment = function (value) {
        /* tslint:disable */
        var temp = createElement('template');
        temp.innerHTML = value;
        if (temp.content instanceof DocumentFragment) {
            return temp.content;
        }
        else {
            return document.createRange().createContextualFragment(value);
        }
        /* tslint:enable */
    };
    /**
     * wrap method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.wrap = function (element, wrapper) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper = element.previousSibling;
        wrapper.appendChild(element);
        return wrapper;
    };
    /**
     * insertAfter method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.insertAfter = function (newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };
    /**
     * wrapInner method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.wrapInner = function (parent, wrapper) {
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
    };
    /**
     * unWrap method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.unWrap = function (element) {
        var parent = element.parentNode;
        var unWrapNode = [];
        while (element.firstChild) {
            unWrapNode.push(element.firstChild);
            parent.insertBefore(element.firstChild, element);
        }
        unWrapNode = unWrapNode.length > 0 ? unWrapNode : [element.parentNode];
        parent.removeChild(element);
        return unWrapNode;
    };
    /**
     * getSelectedNode method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.getSelectedNode = function (element, index) {
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
    };
    /**
     * nodeFinds method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.nodeFinds = function (element, elements) {
        var existNodes = [];
        for (var i = 0; i < elements.length; i++) {
            if (element.contains(elements[i]) && element !== elements[i]) {
                existNodes.push(elements[i]);
            }
        }
        return existNodes;
    };
    /**
     * isEditorArea method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.isEditorArea = function () {
        var range = this.getRangePoint(0);
        var element;
        for (element = range.commonAncestorContainer; element && !this.isElement(element); null) {
            element = element.parentNode;
        }
        return !!this.isElement(element);
    };
    /**
     * getRangePoint method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.getRangePoint = function (point) {
        var selection = this.getSelection();
        var ranges = [];
        if (selection && selection.getRangeAt && selection.rangeCount) {
            ranges = [];
            for (var f = 0; f < selection.rangeCount; f++) {
                ranges.push(selection.getRangeAt(f));
            }
        }
        else {
            ranges = [this.currentDocument.createRange()];
        }
        return 'undefined' !== typeof point ? ranges[point] : ranges;
    };
    DOMNode.prototype.getSelection = function () {
        return this.nodeSelection.get(this.currentDocument);
    };
    /**
     * getPreviousNode method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.getPreviousNode = function (element) {
        element = element.previousElementSibling;
        for (; element && element.textContent === '\n'; null) {
            element = element.previousElementSibling;
        }
        return element;
    };
    /**
     * encode method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.encode = function (value) {
        var divNode = document.createElement('div');
        divNode.innerText = value;
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    };
    /**
     * saveMarker method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.saveMarker = function (save, action) {
        var start = this.parent.querySelector('.' + markerClassName.startSelection);
        var end = this.parent.querySelector('.' + markerClassName.endSelection);
        var startTextNode;
        var endTextNode;
        if (start.textContent === '' && isNullOrUndefined(end) && action !== 'tab') {
            if (start.childNodes.length === 1 && start.childNodes[0].nodeName === 'BR') {
                start.innerHTML = '&#65279;&#65279;<br>';
            }
            else {
                start.innerHTML = '&#65279;&#65279;';
            }
        }
        if (this.hasClass(start, markerClassName.startSelection) && start.classList.length > 1) {
            var replace = this.createTagString(DEFAULT_TAG, start, this.encode(start.textContent));
            this.replaceWith(start, replace);
            start = this.parent.querySelector('.' + markerClassName.startSelection);
            start.classList.remove(markerClassName.startSelection);
            startTextNode = start.childNodes[0];
        }
        else {
            startTextNode = this.unWrap(start)[0];
        }
        if (this.hasClass(end, markerClassName.endSelection) && end.classList.length > 1) {
            var replace = this.createTagString(DEFAULT_TAG, end, this.encode(end.textContent));
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
    };
    DOMNode.prototype.marker = function (className, textContent) {
        return '<span class="' + className + '">' + textContent + '</span>';
    };
    /**
     * setMarker method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.setMarker = function (save) {
        var range = save.range;
        var start = (range.startContainer.childNodes[range.startOffset]
            || range.startContainer);
        var end = (range.endContainer.childNodes[(range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer);
        if ((start.nodeType === Node.ELEMENT_NODE && end.nodeType === Node.ELEMENT_NODE) && (start.contains(end) || end.contains(start))) {
            var existNode = start.contains(end) ? start : end;
            var isElement = existNode.nodeType !== Node.TEXT_NODE;
            if (isElement) {
                var nodes = [];
                var textNodes = [];
                for (var node = existNode; existNode.contains(node); null) {
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
                var markerStart = range.startContainer.querySelector('.' + markerClassName.startSelection);
                markerStart.appendChild(start);
            }
            else {
                this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
            }
            if (end.nodeType !== Node.TEXT_NODE && end.tagName === 'BR' &&
                IGNORE_BLOCK_TAGS.indexOf(end.parentNode.tagName.toLocaleLowerCase()) >= 0) {
                this.replaceWith(end, this.marker(markerClassName.endSelection, this.encode(end.textContent)));
                var markerEnd = range.endContainer.querySelector('.' + markerClassName.endSelection);
                markerEnd.appendChild(end);
            }
            else {
                this.ensureSelfClosingTag(end, markerClassName.endSelection, range);
            }
        }
        else {
            this.ensureSelfClosingTag(start, markerClassName.startSelection, range);
        }
    };
    /**
     * ensureSelfClosingTag method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.ensureSelfClosingTag = function (start, className, range) {
        var isTable = false;
        if (start.nodeType === 3) {
            this.replaceWith(start, this.marker(className, this.encode(start.textContent)));
        }
        else if (start.tagName === 'BR') {
            this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
            var markerStart = range.startContainer.querySelector('.' + markerClassName.startSelection);
            markerStart.appendChild(start);
        }
        else {
            if (start.tagName === 'IMG') {
                var parNode = document.createElement('p');
                start.parentElement.insertBefore(parNode, start);
                parNode.appendChild(start);
                start = parNode.children[0];
            }
            if (start.tagName === 'TABLE') {
                isTable = true;
                if (start.textContent === '') {
                    var tdNode = start.querySelectorAll('td');
                    start = tdNode[tdNode.length - 1];
                    start = !isNullOrUndefined(start.childNodes[0]) ? start.childNodes[0] : start;
                }
                else {
                    var lastNode = start.lastChild;
                    while (lastNode.nodeType !== 3 && lastNode.nodeName !== '#text') {
                        lastNode = lastNode.lastChild;
                    }
                    start = lastNode;
                }
            }
            for (var i = 0; i < selfClosingTags.length; i++) {
                start = (start.tagName === selfClosingTags[i] && !isTable) ? start.parentNode : start;
            }
            if (start.nodeType === 3 && start.nodeName === '#text') {
                this.replaceWith(start, this.marker(className, this.encode(start.textContent)));
            }
            else if (start.nodeName === 'BR') {
                this.replaceWith(start, this.marker(markerClassName.endSelection, this.encode(start.textContent)));
                var markerEnd = range.endContainer.querySelector('.' + markerClassName.endSelection);
                markerEnd.appendChild(start);
            }
            else {
                var marker = this.marker(className, '');
                append([this.parseHTMLFragment(marker)], start);
            }
        }
    };
    /**
     * createTempNode method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.createTempNode = function (element) {
        var textContent = element.textContent;
        if (element.tagName === 'BR') {
            var wrapper = '<' + DEFAULT_TAG + '></' + DEFAULT_TAG + '>';
            var node = element.parentNode;
            if (IGNORE_BLOCK_TAGS.indexOf(node.tagName.toLocaleLowerCase()) >= 0) {
                element = this.wrap(element, this.parseHTMLFragment(wrapper));
            }
        }
        else if (((element.nodeType !== Node.TEXT_NODE &&
            (element.classList.contains(markerClassName.startSelection) ||
                element.classList.contains(markerClassName.endSelection))) ||
            textContent.replace(/\n/g, '').replace(/(^ *)|( *$)/g, '').length > 0 ||
            textContent.length && textContent.indexOf('\n') < 0)) {
            var wrapper = '<' + DEFAULT_TAG + '></' + DEFAULT_TAG + '>';
            var target = element;
            element = this.wrap(element, this.parseHTMLFragment(wrapper));
            var ignoreBr = target.nodeType === Node.ELEMENT_NODE && target.firstChild && target.firstChild.nodeName === 'BR'
                && (target.classList.contains(markerClassName.startSelection) ||
                    target.classList.contains(markerClassName.endSelection));
            if (!ignoreBr && element.nextElementSibling && element.nextElementSibling.tagName === 'BR') {
                element.appendChild(element.nextElementSibling);
            }
        }
        return element;
    };
    /**
     * getImageTagInSelection method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.getImageTagInSelection = function () {
        var selection = this.getSelection();
        if (this.isEditorArea() && selection.rangeCount) {
            return selection.focusNode.querySelectorAll('img');
        }
        return null;
    };
    /**
     * blockNodes method
     * @hidden
     * @deprecated
     */
    DOMNode.prototype.blockNodes = function () {
        var collectionNodes = [];
        var selection = this.getSelection();
        if (this.isEditorArea() && selection.rangeCount) {
            var ranges = this.getRangePoint();
            for (var j = 0; j < ranges.length; j++) {
                var parentNode = void 0;
                var range = ranges[j];
                var startNode = this.getSelectedNode(range.startContainer, range.startOffset);
                var endNode = this.getSelectedNode(range.endContainer, range.endOffset);
                if (this.isBlockNode(startNode) && collectionNodes.indexOf(startNode) < 0) {
                    collectionNodes.push(startNode);
                }
                parentNode = this.blockParentNode(startNode);
                if (parentNode && collectionNodes.indexOf(parentNode) < 0) {
                    if (IGNORE_BLOCK_TAGS.indexOf(parentNode.tagName.toLocaleLowerCase()) >= 0 && (startNode.tagName === 'BR' ||
                        startNode.nodeType === Node.TEXT_NODE ||
                        startNode.classList.contains(markerClassName.startSelection) ||
                        startNode.classList.contains(markerClassName.endSelection))) {
                        var tempNode = startNode.previousSibling &&
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
                var nodes = [];
                for (var node = startNode; node !== endNode && node !== this.parent; null) {
                    if (nodes.indexOf(node) < 0 && node.childNodes && node.childNodes.length) {
                        nodes.push(node);
                        node = node.childNodes[0];
                    }
                    else if (node && node.nodeType !== 8 && (node.tagName === 'BR' || (node.nodeType === Node.TEXT_NODE &&
                        node.textContent.trim() !== '') || (node.nodeType !== Node.TEXT_NODE &&
                        (node.classList.contains(markerClassName.startSelection) ||
                            node.classList.contains(markerClassName.endSelection)))) &&
                        IGNORE_BLOCK_TAGS.indexOf(node.parentNode.tagName.toLocaleLowerCase()) >= 0) {
                        node = this.createTempNode(node);
                    }
                    else if (node.nextSibling && node.nextSibling.nodeType !== 8 &&
                        (node.nextSibling.tagName === 'BR' ||
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
                    (!isNullOrUndefined(parentNode.previousElementSibling) && parentNode.previousElementSibling.tagName !== 'IMG')) {
                    collectionNodes.push(parentNode);
                }
            }
        }
        for (var i = collectionNodes.length - 1; i > 0; i--) {
            var nodes = this.nodeFinds(collectionNodes[i], collectionNodes);
            if (nodes.length) {
                var listNodes = collectionNodes[i].querySelectorAll('ul, ol');
                if (collectionNodes[i].tagName === 'LI' && listNodes.length > 0) {
                    continue;
                }
                else {
                    collectionNodes.splice(i, 1);
                }
            }
        }
        return collectionNodes;
    };
    DOMNode.prototype.ignoreTableTag = function (element) {
        return !(TABLE_BLOCK_TAGS.indexOf(element.tagName.toLocaleLowerCase()) >= 0);
    };
    return DOMNode;
}());

/**
 * Exports common util methods used by RichTextEditor.
 */
function isIDevice$1() {
    var result = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}
function setEditFrameFocus(editableElement, selector) {
    if (editableElement.nodeName === 'BODY' && !isNullOrUndefined(selector)) {
        var iframe = top.window.document.querySelector(selector);
        if (!isNullOrUndefined(iframe)) {
            iframe.contentWindow.focus();
        }
    }
}

/**
 * Lists internal component
 * @hidden
 * @deprecated
 */
var Lists = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Lists plugin
     * @hidden
     * @deprecated
     */
    function Lists(parent) {
        this.parent = parent;
        this.domNode = this.parent.domNode;
        this.addEventListener();
    }
    Lists.prototype.addEventListener = function () {
        this.parent.observer.on(LIST_TYPE, this.applyListsHandler, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
    };
    Lists.prototype.testList = function (elem) {
        var olListRegex = [/^[\d]+[.]+$/,
            /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})[.]$/gi,
            /^[a-zA-Z][.]+$/];
        var elementStart = !isNullOrUndefined(elem) ? elem.innerText.trim().split('.')[0] + '.' : null;
        if (!isNullOrUndefined(elementStart)) {
            for (var i = 0; i < olListRegex.length; i++) {
                if (olListRegex[i].test(elementStart)) {
                    return true;
                }
            }
        }
        return false;
    };
    Lists.prototype.testCurrentList = function (range) {
        var olListStartRegex = [/^[1]+[.]+$/, /^[i]+[.]+$/, /^[a]+[.]+$/];
        if (!isNullOrUndefined(range.startContainer.textContent.slice(0, range.startOffset))) {
            for (var i = 0; i < olListStartRegex.length; i++) {
                if (olListStartRegex[i].test(range.startContainer.textContent.slice(0, range.startOffset))) {
                    return true;
                }
            }
        }
        return false;
    };
    Lists.prototype.spaceList = function (e) {
        var range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        var startNode = this.parent.domNode.getSelectedNode(range.startContainer, range.startOffset);
        var endNode = this.parent.domNode.getSelectedNode(range.endContainer, range.endOffset);
        var preElement = startNode.previousElementSibling;
        var nextElement = startNode.nextElementSibling;
        var preElemULStart = !isNullOrUndefined(preElement) ?
            preElement.innerText.trim().substring(0, 1) : null;
        var nextElemULStart = !isNullOrUndefined(nextElement) ?
            nextElement.innerText.trim().substring(0, 1) : null;
        var startElementOLTest = this.testCurrentList(range);
        var preElementOLTest = this.testList(preElement);
        var nextElementOLTest = this.testList(nextElement);
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
    };
    Lists.prototype.keyDownHandler = function (e) {
        if (e.event.which === 32) {
            this.spaceList(e);
        }
        if (e.event.which === 9) {
            var range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            if (!(e.event.action && e.event.action === 'indent')) {
                this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
            }
            var blockNodes = void 0;
            var startOffset = range.startOffset;
            var endOffset = range.endOffset;
            var startNode = this.parent.domNode.getSelectedNode(range.startContainer, range.startOffset);
            var endNode = this.parent.domNode.getSelectedNode(range.endContainer, range.endOffset);
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
            var nodes = [];
            var isNested = true;
            for (var i = 0; i < blockNodes.length; i++) {
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
    };
    Lists.prototype.getAction = function (element) {
        var parentNode = element.parentNode;
        return (parentNode.nodeName === 'OL' ? 'OL' : 'UL');
    };
    Lists.prototype.revertClean = function () {
        var collectionNodes = this.parent.editableElement.querySelectorAll('ul, ol');
        for (var i = 0; i < collectionNodes.length; i++) {
            var listNodes = collectionNodes[i].querySelectorAll('ul, ol');
            if (listNodes.length > 0) {
                for (var j = 0; j < listNodes.length; j++) {
                    var prevSibling = listNodes[j].previousSibling;
                    if (prevSibling && prevSibling.tagName === 'LI') {
                        prevSibling.appendChild(listNodes[j]);
                    }
                }
            }
        }
    };
    Lists.prototype.noPreviousElement = function (elements) {
        var firstNode;
        var firstNodeOL;
        var siblingListOL = elements.querySelectorAll('ol, ul');
        var siblingListLI = elements
            .querySelectorAll('li');
        var siblingListLIFirst = this.domNode.contents(siblingListLI[0])[0];
        if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
            firstNode = siblingListLI[0];
        }
        else {
            firstNodeOL = siblingListOL[0];
        }
        if (firstNode) {
            for (var h = this.domNode.contents(elements)[0]; h && !this.domNode.isList(h); null) {
                var nextSibling = h.nextSibling;
                prepend([h], firstNode);
                setStyleAttribute(elements, { 'list-style-type': 'none' });
                setStyleAttribute(firstNode, { 'list-style-type': '' });
                h = nextSibling;
            }
        }
        else if (firstNodeOL) {
            var nestedElement = createElement('li');
            prepend([nestedElement], firstNodeOL);
            for (var h = this.domNode.contents(elements)[0]; h && !this.domNode.isList(h); null) {
                var nextSibling = h.nextSibling;
                nestedElement.appendChild(h);
                h = nextSibling;
            }
            prepend([firstNodeOL], elements.parentNode);
            detach(elements);
            var nestedElementLI = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], firstNodeOL.parentNode);
            append([firstNodeOL], nestedElementLI);
        }
        else {
            var nestedElementLI = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], elements.parentNode);
            var nestedElement = createElement(elements.parentNode.tagName);
            prepend([nestedElement], nestedElementLI);
            append([elements], nestedElement);
        }
    };
    Lists.prototype.nestedList = function (elements) {
        var isNested = false;
        for (var i = 0; i < elements.length; i++) {
            var prevSibling = this.domNode.getPreviousNode(elements[i]);
            if (prevSibling) {
                isNested = true;
                var firstNode = void 0;
                var firstNodeLI = void 0;
                var siblingListOL = elements[i].querySelectorAll('ol, ul');
                var siblingListLI = elements[i]
                    .querySelectorAll('li');
                var siblingListLIFirst = this.domNode.contents(siblingListLI[0])[0];
                if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
                    firstNodeLI = siblingListLI[0];
                }
                else {
                    firstNode = siblingListOL[0];
                }
                if (firstNode) {
                    var nestedElement = createElement('li');
                    prepend([nestedElement], firstNode);
                    for (var h = this.domNode.contents(elements[i])[0]; h && !this.domNode.isList(h); null) {
                        var nextSibling = h.nextSibling;
                        nestedElement.appendChild(h);
                        h = nextSibling;
                    }
                    append([firstNode], prevSibling);
                    detach(elements[i]);
                }
                else if (firstNodeLI) {
                    if (prevSibling.tagName === 'LI') {
                        for (var h = this.domNode.contents(elements[i])[0]; h && !this.domNode.isList(h); null) {
                            var nextSibling = h.nextSibling;
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
                        var nestedElement = createElement(elements[i].parentNode.tagName);
                        append([nestedElement], prevSibling);
                        append([elements[i]], nestedElement);
                    }
                }
            }
            else {
                var element = elements[i];
                isNested = true;
                this.noPreviousElement(element);
            }
        }
        return isNested;
    };
    Lists.prototype.applyListsHandler = function (e) {
        var range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.currentAction = e.subCommand;
        this.domNode.setMarker(this.saveSelection);
        var listsNodes = this.domNode.blockNodes();
        for (var i = 0; i < listsNodes.length; i++) {
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
    };
    Lists.prototype.applyLists = function (elements, type, selector) {
        if (this.isRevert(elements, type)) {
            this.revertList(elements);
            this.removeEmptyListElements();
        }
        else {
            this.checkLists(elements, type);
            for (var i = 0; i < elements.length; i++) {
                if ('LI' !== elements[i].tagName) {
                    var elemAtt = elements[i].tagName === 'IMG' ? '' : this.domNode.attributes(elements[i]);
                    var openTag = '<' + type + '>';
                    var closeTag = '</' + type + '>';
                    var newTag = 'li' + elemAtt;
                    var replaceHTML = (elements[i].tagName.toLowerCase() === DEFAULT_TAG ? elements[i].innerHTML :
                        elements[i].outerHTML);
                    var innerHTML = this.domNode.createTagString(newTag, null, replaceHTML);
                    var collectionString = openTag + innerHTML + closeTag;
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
    };
    Lists.prototype.removeEmptyListElements = function () {
        var listElem = this.parent.editableElement.querySelectorAll('ol, ul');
        for (var i = 0; i < listElem.length; i++) {
            if (listElem[i].textContent.trim() === '') {
                detach(listElem[i]);
            }
        }
    };
    Lists.prototype.isRevert = function (nodes, tagName) {
        var isRevert = true;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName !== 'LI') {
                return false;
            }
            if (nodes[i].parentNode.tagName !== tagName) {
                isRevert = false;
            }
        }
        return isRevert;
    };
    Lists.prototype.checkLists = function (nodes, tagName) {
        var nodesTemp = [];
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i].parentNode;
            if (nodes[i].tagName === 'LI' && node.tagName !== tagName && nodesTemp.indexOf(node) < 0) {
                nodesTemp.push(node);
            }
        }
        for (var j = nodesTemp.length - 1; j >= 0; j--) {
            var h = nodesTemp[j];
            var replace = '<' + tagName.toLowerCase() + ' '
                + this.domNode.attributes(h) + '>' + h.innerHTML + '</' + tagName.toLowerCase() + '>';
            this.domNode.replaceWith(nodesTemp[j], replace);
        }
    };
    Lists.prototype.cleanNode = function () {
        var liParents = this.parent.editableElement.querySelectorAll('ol + ol, ul + ul');
        for (var c = 0; c < liParents.length; c++) {
            var node = liParents[c];
            if (this.domNode.isList(node.previousElementSibling) &&
                this.domNode.openTagString(node) === this.domNode.openTagString(node.previousElementSibling)) {
                var contentNodes = this.domNode.contents(node);
                for (var f = 0; f < contentNodes.length; f++) {
                    node.previousElementSibling.appendChild(contentNodes[f]);
                }
                node.parentNode.removeChild(node);
            }
        }
    };
    Lists.prototype.findUnSelected = function (temp, elements) {
        temp = temp.slice().reverse();
        if (temp.length > 0) {
            var rightIndent = [];
            var indentElements = [];
            var lastElement = elements[elements.length - 1];
            var lastElementChild = [];
            var childElements = [];
            lastElementChild = (lastElement.childNodes);
            for (var z = 0; z < lastElementChild.length; z++) {
                if (lastElementChild[z].tagName === 'OL' || lastElementChild[z].tagName === 'UL') {
                    var childLI = lastElementChild[z]
                        .querySelectorAll('li');
                    if (childLI.length > 0) {
                        for (var y = 0; y < childLI.length; y++) {
                            childElements.push(childLI[y]);
                        }
                    }
                }
            }
            for (var i = 0; i < childElements.length; i++) {
                var count = 0;
                for (var j = 0; j < temp.length; j++) {
                    if (!childElements[i].contains((temp[j]))) {
                        count = count + 1;
                    }
                }
                if (count === temp.length) {
                    indentElements.push(childElements[i]);
                }
            }
            if (indentElements.length > 0) {
                for (var x = 0; x < indentElements.length; x++) {
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
    };
    Lists.prototype.revertList = function (elements) {
        var temp = [];
        for (var i = elements.length - 1; i >= 0; i--) {
            for (var j = i - 1; j >= 0; j--) {
                if (elements[j].contains((elements[i])) || elements[j] === elements[i]) {
                    temp.push(elements[i]);
                    elements.splice(i, 1);
                    break;
                }
            }
        }
        this.findUnSelected(temp, elements);
        var viewNode = [];
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (this.domNode.contents(element)[0].nodeType === 3 && this.domNode.contents(element)[0].textContent.trim().length === 0) {
                detach(this.domNode.contents(element)[0]);
            }
            var parentNode = elements[i].parentNode;
            var className = element.getAttribute('class');
            if (temp.length === 0) {
                var siblingList = elements[i].querySelectorAll('ul, ol');
                var firstNode = siblingList[0];
                if (firstNode) {
                    var child = firstNode
                        .querySelectorAll('li');
                    if (child) {
                        var nestedElement = createElement(firstNode.tagName);
                        append([nestedElement], firstNode.parentNode);
                        var nestedElementLI = createElement('li', { styles: 'list-style-type: none;' });
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
                    var wrapperclass = isNullOrUndefined(className) ? ' class="e-rte-wrap-inner"' :
                        ' class="' + className + ' e-rte-wrap-inner"';
                    var wrapper = '<' + DEFAULT_TAG + wrapperclass +
                        this.domNode.attributes(parentNode) + '></' + DEFAULT_TAG + '>';
                    this.domNode.wrapInner(element, this.domNode.parseHTMLFragment(wrapper));
                }
                else if (this.domNode.contents(element)[0].nodeType === 3) {
                    var replace = this.domNode.createTagString(DEFAULT_TAG, parentNode, this.parent.domNode.encode(this.domNode.contents(element)[0].textContent));
                    this.domNode.replaceWith(this.domNode.contents(element)[0], replace);
                }
                else if (this.domNode.contents(element)[0].classList.contains(markerClassName.startSelection) ||
                    this.domNode.contents(element)[0].classList.contains(markerClassName.endSelection)) {
                    var replace = this.domNode.createTagString(DEFAULT_TAG, parentNode, this.domNode.contents(element)[0].outerHTML);
                    this.domNode.replaceWith(this.domNode.contents(element)[0], replace);
                }
                else {
                    var childNode = element.firstChild;
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
        for (var i = 0; i < viewNode.length; i++) {
            var node = viewNode[i];
            var nodeInnerHtml = node.innerHTML;
            var closeTag = /<span class="e-rte-list-close-([a-z]*)"><\/span>/g;
            var openTag = /<span class="e-rte-list-open-([a-z]*)"><\/span>/g;
            nodeInnerHtml = nodeInnerHtml.replace(closeTag, '</$1>');
            nodeInnerHtml = nodeInnerHtml.replace(openTag, '<$1 ' + this.domNode.attributes(node) + '>');
            this.domNode.replaceWith(node, this.domNode.openTagString(node) + nodeInnerHtml.trim() + this.domNode.closeTagString(node));
        }
        var emptyUl = this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (var i = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
        var emptyLi = this.parent.editableElement.querySelectorAll('li:empty');
        for (var i = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
    };
    Lists.prototype.openTag = function (type) {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-open-' + type.toLowerCase() + '"></span>');
    };
    Lists.prototype.closeTag = function (type) {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-close-' + type.toLowerCase() + '"></span>');
    };
    return Lists;
}());

/**
 * Node appending methods.
 * @hidden
 */
var InsertMethods = /** @__PURE__ @class */ (function () {
    function InsertMethods() {
    }
    /**
     * WrapBefore method
     * @hidden
     * @deprecated
     */
    InsertMethods.WrapBefore = function (textNode, parentNode, isAfter) {
        parentNode.innerText = textNode.textContent;
        (!isAfter) ? this.AppendBefore(parentNode, textNode) : this.AppendBefore(parentNode, textNode, true);
        if (textNode.parentNode) {
            textNode.parentNode.removeChild(textNode);
        }
        return parentNode.childNodes[0];
    };
    /**
     * Wrap method
     * @hidden
     * @deprecated
     */
    InsertMethods.Wrap = function (childNode, parentNode) {
        this.AppendBefore(parentNode, childNode);
        parentNode.appendChild(childNode);
        return childNode;
    };
    /**
     * unwrap method
     * @hidden
     * @deprecated
     */
    InsertMethods.unwrap = function (node) {
        var parent = node.parentNode;
        var child = [];
        for (; node.firstChild; null) {
            child.push(parent.insertBefore(node.firstChild, node));
        }
        parent.removeChild(node);
        return child;
    };
    /**
     * AppendBefore method
     * @hidden
     * @deprecated
     */
    InsertMethods.AppendBefore = function (textNode, parentNode, isAfter) {
        return (parentNode.parentNode) ? ((!isAfter) ? parentNode.parentNode.insertBefore(textNode, parentNode)
            : parentNode.parentNode.insertBefore(textNode, parentNode.nextSibling)) :
            parentNode;
    };
    return InsertMethods;
}());

/**
 * Split the Node based on selection
 * @hidden
 * @deprecated
 */
var NodeCutter = /** @__PURE__ @class */ (function () {
    function NodeCutter() {
        this.position = -1;
        this.nodeSelection = new NodeSelection();
    }
    // Split Selection Node
    /**
     * GetSpliceNode method
     * @hidden
     * @deprecated
     */
    NodeCutter.prototype.GetSpliceNode = function (range, node) {
        node = this.SplitNode(range, node, true);
        node = this.SplitNode(range, node, false);
        return node;
    };
    /**
     * @hidden
     * @deprecated
     */
    NodeCutter.prototype.SplitNode = function (range, node, isCollapsed) {
        if (node) {
            var clone = range.cloneRange();
            var parent_1 = node.parentNode;
            var index = this.nodeSelection.getIndex(node);
            clone.collapse(isCollapsed);
            (isCollapsed) ? clone.setStartBefore(node) : clone.setEndAfter(node);
            var fragment = clone.extractContents();
            if (isCollapsed) {
                node = parent_1.childNodes[index];
                fragment = this.spliceEmptyNode(fragment, false);
                if (fragment && fragment.childNodes.length > 0) {
                    var isEmpty = (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName !== 'IMG'
                        && isNullOrUndefined(fragment.querySelector('img')) && fragment.textContent === '') ? true : false;
                    if (!isEmpty) {
                        if (node) {
                            InsertMethods.AppendBefore(fragment, node);
                        }
                        else {
                            parent_1.appendChild(fragment);
                            var divNode = document.createElement('div');
                            divNode.innerHTML = '&#65279;&#65279;';
                            node = divNode.firstChild;
                            parent_1.appendChild(node);
                        }
                    }
                }
            }
            else {
                node = parent_1.childNodes.length > 1 ? parent_1.childNodes[index] :
                    parent_1.childNodes[0];
                fragment = this.spliceEmptyNode(fragment, true);
                if (fragment && fragment.childNodes.length > 0) {
                    var isEmpty = (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName !== 'IMG'
                        && isNullOrUndefined(fragment.querySelector('img')) && fragment.textContent === '') ? true : false;
                    if (!isEmpty) {
                        if (node) {
                            InsertMethods.AppendBefore(fragment, node, true);
                        }
                        else {
                            parent_1.appendChild(fragment);
                            var divNode = document.createElement('div');
                            divNode.innerHTML = '&#65279;&#65279;';
                            parent_1.insertBefore(divNode.firstChild, parent_1.firstChild);
                            node = parent_1.firstChild;
                        }
                    }
                }
            }
            return node;
        }
        else {
            return null;
        }
    };
    NodeCutter.prototype.spliceEmptyNode = function (fragment, isStart) {
        var len;
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
    };
    // Cursor Position split
    NodeCutter.prototype.GetCursorStart = function (indexes, index, isStart) {
        indexes = (isStart) ? indexes : indexes.reverse();
        var position = indexes[0];
        for (var num = 0; num < indexes.length && ((isStart) ? (indexes[num] < index) : (indexes[num] >= index)); num++) {
            position = indexes[num];
        }
        return position;
    };
    /**
     * GetCursorRange method
     * @hidden
     * @deprecated
     */
    NodeCutter.prototype.GetCursorRange = function (docElement, range, node) {
        var cursorRange = docElement.createRange();
        var indexes = [];
        indexes.push(0);
        var str = this.TrimLineBreak(node.data);
        var index = str.indexOf(' ', 0);
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
            var startOffset = this.GetCursorStart(indexes, range.startOffset, true);
            this.position = range.startOffset - startOffset;
            cursorRange.setStart(range.startContainer, startOffset);
            cursorRange.setEnd(range.startContainer, this.GetCursorStart(indexes, range.startOffset, false));
        }
        return cursorRange;
    };
    /**
     * GetCursorNode method
     * @hidden
     * @deprecated
     */
    NodeCutter.prototype.GetCursorNode = function (docElement, range, node) {
        return this.GetSpliceNode(this.GetCursorRange(docElement, range, node), node);
    };
    /**
     * TrimLineBreak method
     * @hidden
     * @deprecated
     */
    NodeCutter.prototype.TrimLineBreak = function (line) {
        return line.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
    };
    return NodeCutter;
}());

/**
 * Formats internal component
 * @hidden
 * @deprecated
 */
var Formats = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function Formats(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Formats.prototype.addEventListener = function () {
        this.parent.observer.on(FORMAT_TYPE, this.applyFormats, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    Formats.prototype.getParentNode = function (node) {
        for (; node.parentNode && node.parentNode !== this.parent.editableElement; null) {
            node = node.parentNode;
        }
        return node;
    };
    Formats.prototype.onKeyDown = function (e) {
        if (e.event.which === 13) {
            var range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            var startCon = (range.startContainer.textContent.length === 0 || range.startContainer.nodeName === 'PRE')
                ? range.startContainer : range.startContainer.parentElement;
            var endCon = (range.endContainer.textContent.length === 0 || range.endContainer.nodeName === 'PRE')
                ? range.endContainer : range.endContainer.parentElement;
            var preElem = closest(startCon, 'pre');
            var endPreElem = closest(endCon, 'pre');
            var liParent = !isNullOrUndefined(preElem) && !isNullOrUndefined(preElem.parentElement) && preElem.parentElement.tagName === 'LI';
            if (liParent) {
                return;
            }
            if (((isNullOrUndefined(preElem) && !isNullOrUndefined(endPreElem)) || (!isNullOrUndefined(preElem) && isNullOrUndefined(endPreElem)))) {
                e.event.preventDefault();
                this.deleteContent(range);
                this.removeCodeContent(range);
                range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, endCon, 0);
            }
            if (e.event.which === 13 && !isNullOrUndefined(preElem) && !isNullOrUndefined(endPreElem)) {
                e.event.preventDefault();
                this.deleteContent(range);
                this.removeCodeContent(range);
                range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
                var lastEmpty = range.startContainer.childNodes[range.endOffset];
                var lastBeforeBr = range.startContainer.childNodes[range.endOffset - 1];
                var startParent = range.startContainer;
                if (!isNullOrUndefined(lastEmpty) && !isNullOrUndefined(lastBeforeBr) && isNullOrUndefined(lastEmpty.nextSibling) &&
                    lastEmpty.nodeName === 'BR' && lastBeforeBr.nodeName === 'BR') {
                    this.paraFocus(range.startContainer);
                }
                else if ((startParent.textContent.charCodeAt(0) === 8203 &&
                    startParent.textContent.length === 1) || startParent.textContent.length === 0) {
                    //Double enter with any parent tag for the node
                    while (startParent.parentElement.nodeName !== 'PRE' &&
                        (startParent.textContent.length === 1 || startParent.textContent.length === 0)) {
                        startParent = startParent.parentElement;
                    }
                    if (!isNullOrUndefined(startParent.previousSibling) && startParent.previousSibling.nodeName === 'BR' &&
                        isNullOrUndefined(startParent.nextSibling)) {
                        this.paraFocus(startParent.parentElement);
                    }
                    else {
                        this.isNotEndCursor(preElem, range);
                    }
                }
                else {
                    //Cursor at start and middle
                    this.isNotEndCursor(preElem, range);
                }
            }
        }
    };
    Formats.prototype.removeCodeContent = function (range) {
        var regEx = new RegExp(String.fromCharCode(65279), 'g');
        if (!isNullOrUndefined(range.endContainer.textContent.match(regEx))) {
            var pointer = range.endContainer.textContent.charCodeAt(range.endOffset - 1) === 65279 ?
                range.endOffset - 2 : range.endOffset;
            range.endContainer.textContent = range.endContainer.textContent.replace(regEx, '');
            if (range.endContainer.textContent === '') {
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, range.endContainer.parentElement, 0);
            }
            else {
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, range.endContainer, pointer);
            }
        }
    };
    Formats.prototype.deleteContent = function (range) {
        if (range.startContainer !== range.endContainer || range.startOffset !== range.endOffset) {
            range.deleteContents();
        }
    };
    Formats.prototype.paraFocus = function (referNode) {
        var pTag = createElement('p');
        pTag.innerHTML = '<br>';
        this.parent.domNode.insertAfter(pTag, referNode);
        this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, pTag, 0);
    };
    Formats.prototype.isNotEndCursor = function (preElem, range) {
        var nodeCutter = new NodeCutter();
        var isEnd = range.startOffset === preElem.lastChild.textContent.length &&
            preElem.lastChild.textContent === range.startContainer.textContent;
        //Cursor at start point
        if (preElem.textContent.indexOf(range.startContainer.textContent) === 0 &&
            ((range.startOffset === 0 && range.endOffset === 0) || range.startContainer.nodeName === 'PRE')) {
            this.insertMarker(preElem, range);
            var brTag = createElement('br');
            preElem.childNodes[range.endOffset].parentElement.insertBefore(brTag, preElem.childNodes[range.endOffset]);
        }
        else {
            //Cursor at middle
            var cloneNode = nodeCutter.SplitNode(range, preElem, true);
            this.insertMarker(preElem, range);
            var previousSib = preElem.previousElementSibling;
            if (previousSib.tagName === 'PRE') {
                previousSib.insertAdjacentHTML('beforeend', '<br>' + cloneNode.innerHTML);
                detach(preElem);
            }
        }
        //To place the cursor position          
        this.setCursorPosition(isEnd, preElem);
    };
    Formats.prototype.setCursorPosition = function (isEnd, preElem) {
        var isEmpty = false;
        var markerElem = this.parent.editableElement.querySelector('.tempSpan');
        var mrkParentElem = markerElem.parentElement;
        markerElem.parentNode.textContent === '' ? isEmpty = true :
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, markerElem, 0);
        if (isEnd) {
            if (isEmpty) {
                //Enter press when pre element is empty
                if (mrkParentElem === preElem) {
                    this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, markerElem, 0);
                    detach(markerElem);
                }
                else {
                    this.focusSelectionParent(markerElem, mrkParentElem);
                }
            }
            else {
                var brElm = createElement('br');
                this.parent.domNode.insertAfter(brElm, markerElem);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, markerElem, 0);
                detach(markerElem);
            }
        }
        else {
            isEmpty ? this.focusSelectionParent(markerElem, mrkParentElem) : detach(markerElem);
        }
    };
    Formats.prototype.focusSelectionParent = function (markerElem, tempSpanPElem) {
        detach(markerElem);
        tempSpanPElem.innerHTML = '\u200B';
        this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, tempSpanPElem, 0);
    };
    Formats.prototype.insertMarker = function (preElem, range) {
        var tempSpan = createElement('span', { className: 'tempSpan' });
        if (range.startContainer.nodeName === 'PRE') {
            preElem.childNodes[range.endOffset].parentElement.insertBefore(tempSpan, preElem.childNodes[range.endOffset]);
        }
        else {
            range.startContainer.parentElement.insertBefore(tempSpan, range.startContainer);
        }
    };
    Formats.prototype.applyFormats = function (e) {
        var range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        var isSelectAll = false;
        if (this.parent.editableElement === range.endContainer &&
            !isNullOrUndefined(this.parent.editableElement.children[range.endOffset - 1]) &&
            this.parent.editableElement.children[range.endOffset - 1].tagName === 'TABLE') {
            isSelectAll = true;
        }
        var save = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        var formatsNodes = this.parent.domNode.blockNodes();
        for (var i = 0; i < formatsNodes.length; i++) {
            var parentNode = void 0;
            var replaceHTML = void 0;
            if (e.subCommand.toLowerCase() === 'blockquote') {
                parentNode = this.getParentNode(formatsNodes[i]);
                replaceHTML = this.parent.domNode.isList(parentNode) ||
                    parentNode.tagName === 'TABLE' ? parentNode.outerHTML : parentNode.innerHTML;
            }
            else {
                parentNode = formatsNodes[i];
                replaceHTML = parentNode.innerHTML;
            }
            if ((e.subCommand.toLowerCase() === parentNode.tagName.toLowerCase() &&
                (e.subCommand.toLowerCase() !== 'pre' ||
                    (!isNullOrUndefined(e.exeValue) && e.exeValue.name === 'dropDownSelect'))) ||
                isNullOrUndefined(parentNode.parentNode) ||
                (parentNode.tagName === 'LI' && e.subCommand.toLowerCase() !== 'pre') ||
                (parentNode.tagName === 'TABLE' && e.subCommand.toLowerCase() === 'pre')) {
                continue;
            }
            this.cleanFormats(parentNode, e.subCommand);
            var replaceNode = (e.subCommand.toLowerCase() === 'pre' && parentNode.tagName.toLowerCase() === 'pre') ?
                'p' : e.subCommand;
            var replaceTag = this.parent.domNode.createTagString(replaceNode, parentNode, replaceHTML.replace(/>\s+</g, '><'));
            if (parentNode.tagName === 'LI') {
                parentNode.innerHTML = '';
                parentNode.insertAdjacentHTML('beforeend', replaceTag);
            }
            else {
                this.parent.domNode.replaceWith(parentNode, replaceTag);
            }
        }
        this.preFormatMerge();
        var startNode = this.parent.editableElement.querySelector('.' + markerClassName.startSelection);
        var endNode = this.parent.editableElement.querySelector('.' + markerClassName.endSelection);
        if (!isNullOrUndefined(startNode) && !isNullOrUndefined(endNode)) {
            startNode = startNode.lastChild;
            endNode = endNode.lastChild;
        }
        save = this.parent.domNode.saveMarker(save, null);
        if (isIDevice$1()) {
            setEditFrameFocus(this.parent.editableElement, e.selector);
        }
        if (isSelectAll) {
            this.parent.nodeSelection.setSelectionText(this.parent.currentDocument, startNode, endNode, 0, endNode.textContent.length);
        }
        else {
            save.restore();
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes()
            });
        }
    };
    Formats.prototype.preFormatMerge = function () {
        var preNodes = this.parent.editableElement.querySelectorAll('PRE');
        if (!isNullOrUndefined(preNodes)) {
            for (var i = 0; i < preNodes.length; i++) {
                var previousSib = preNodes[i].previousElementSibling;
                if (!isNullOrUndefined(previousSib) && previousSib.tagName === 'PRE') {
                    previousSib.insertAdjacentHTML('beforeend', '<br>' + preNodes[i].innerHTML);
                    detach(preNodes[i]);
                }
            }
        }
    };
    Formats.prototype.cleanFormats = function (element, tagName) {
        var ignoreAttr = ['display', 'font-size', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-weight'];
        tagName = tagName.toLowerCase();
        for (var i = 0; i < ignoreAttr.length && (tagName !== 'p' && tagName !== 'blockquote' && tagName !== 'pre'); i++) {
            element.style.removeProperty(ignoreAttr[i]);
        }
    };
    return Formats;
}());

/**
 * Insert a HTML Node or Text
 * @hidden
 * @deprecated
 */
var InsertHtml = /** @__PURE__ @class */ (function () {
    function InsertHtml() {
    }
    /**
     * Insert method
     * @hidden
     * @deprecated
     */
    InsertHtml.Insert = function (docElement, insertNode, editNode) {
        var node;
        if (typeof insertNode === 'string') {
            var divNode = document.createElement('div');
            divNode.innerHTML = insertNode;
            node = divNode.firstChild;
        }
        else {
            node = insertNode;
        }
        var nodeSelection = new NodeSelection();
        var nodeCutter = new NodeCutter();
        var range = nodeSelection.getRange(docElement);
        var isCursor = range.startOffset === range.endOffset && range.startOffset === 0 &&
            range.startContainer === range.endContainer;
        var isCollapsed = range.collapsed;
        var nodes = nodeSelection.getInsertNodeCollection(range);
        var closestParentNode = (node.nodeName.toLowerCase() === 'table') ? this.closestEle(nodes[0].parentNode, editNode) : nodes[0];
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) === -1))) {
            var preNode = nodeCutter.GetSpliceNode(range, closestParentNode);
            var sibNode = preNode.previousSibling;
            var parentNode = preNode.parentNode;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            }
            else {
                var lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement);
                lasNode = isNullOrUndefined(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            range.extractContents();
            if (insertNode.tagName === 'TABLE') {
                this.removeEmptyElements(editNode);
            }
            for (var index = 0; index < nodes.length; index++) {
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
                var previousNode = null;
                while (parentNode !== editNode && parentNode.firstChild &&
                    (parentNode.textContent.trim() === '')) {
                    var parentNode1 = parentNode.parentNode;
                    previousNode = parentNode;
                    parentNode = parentNode1;
                }
                if (previousNode !== null) {
                    parentNode = previousNode;
                }
                if (parentNode.firstChild && (parentNode !== editNode ||
                    (node.nodeName === 'TABLE' && isCursor && parentNode === range.startContainer &&
                        parentNode === range.endContainer))) {
                    if (parentNode.textContent.trim() === '' && parentNode !== editNode) {
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
                var frag = docElement.createDocumentFragment();
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
        if (!isNullOrUndefined(node) && !isNullOrUndefined(node.classList) && node.classList.contains('pasteContent')) {
            var lastNode = node.lastChild;
            lastNode = lastNode.nodeName === 'BR' ? lastNode.previousSibling : lastNode;
            while (!isNullOrUndefined(lastNode) && lastNode.nodeName !== '#text' && lastNode.nodeName !== 'IMG' &&
                lastNode.nodeName !== 'BR') {
                lastNode = lastNode.lastChild;
            }
            lastNode = isNullOrUndefined(lastNode) ? node : lastNode;
            nodeSelection.setSelectionText(docElement, lastNode, lastNode, lastNode.textContent.length, lastNode.textContent.length);
        }
    };
    InsertHtml.findDetachEmptyElem = function (element) {
        var removableElement;
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
    };
    InsertHtml.removeEmptyElements = function (element) {
        var emptyElements = element.querySelectorAll(':empty');
        for (var i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR') {
                var detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNullOrUndefined(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    };
    InsertHtml.closestEle = function (element, editNode) {
        var el = element;
        while (el && el.nodeType === 1) {
            if (el.parentNode === editNode ||
                (!isNullOrUndefined(el.parentNode.tagName) &&
                    IGNORE_BLOCK_TAGS.indexOf(el.parentNode.tagName.toLocaleLowerCase()) !== -1)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    };
    return InsertHtml;
}());

/**
 * Link internal component
 * @hidden
 * @deprecated
 */
var LinkCommand = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function LinkCommand(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    LinkCommand.prototype.addEventListener = function () {
        this.parent.observer.on(LINK, this.linkCommand, this);
    };
    LinkCommand.prototype.linkCommand = function (e) {
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
    };
    LinkCommand.prototype.createLink = function (e) {
        var closestAnchor = (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent.length > 0) &&
            closest(e.item.selectParent[0], 'a');
        closestAnchor = !isNullOrUndefined(closestAnchor) ? closestAnchor :
            (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent.length > 0) ? (e.item.selectParent[0]) : null;
        if (!isNullOrUndefined(closestAnchor) && closestAnchor.tagName === 'A') {
            var anchorEle = closestAnchor;
            anchorEle.setAttribute('href', e.item.url);
            anchorEle.setAttribute('title', e.item.title);
            var linkText = anchorEle.innerText;
            anchorEle.innerText = e.item.text;
            if (!isNullOrUndefined(e.item.target)) {
                anchorEle.setAttribute('target', e.item.target);
            }
            else {
                anchorEle.removeAttribute('target');
            }
            if (linkText === e.item.text) {
                e.item.selection.setSelectionText(this.parent.currentDocument, anchorEle, anchorEle, 1, 1);
                e.item.selection.restore();
            }
            else {
                var startIndex = e.item.action === 'Paste' ? anchorEle.childNodes[0].textContent.length : 0;
                e.item.selection.setSelectionText(this.parent.currentDocument, anchorEle.childNodes[0], anchorEle.childNodes[0], startIndex, anchorEle.childNodes[0].textContent.length);
            }
        }
        else {
            var domSelection = new NodeSelection();
            var range = domSelection.getRange(this.parent.currentDocument);
            var text = isNullOrUndefined(e.item.text) ? true : e.item.text.replace(/ /g, '').localeCompare(range.toString()
                .replace(/\n/g, ' ').replace(/ /g, '')) < 0;
            if (e.event && e.event.type === 'keydown' && (e.event.keyCode === 32
                || e.event.keyCode === 13) || e.item.action === 'Paste' || range.collapsed || text) {
                var anchor = this.createAchorNode(e);
                anchor.innerText = e.item.text === '' ? e.item.url : e.item.text;
                e.item.selection.restore();
                InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
                if (e.event && e.event.type === 'keydown' && (e.event.keyCode === 32
                    || e.event.keyCode === 13)) {
                    var startContainer = e.item.selection.range.startContainer;
                    startContainer.textContent = this.removeText(startContainer.textContent, e.item.text);
                }
                else {
                    var startIndex = e.item.action === 'Paste' ? anchor.childNodes[0].textContent.length : 0;
                    e.item.selection.setSelectionText(this.parent.currentDocument, anchor.childNodes[0], anchor.childNodes[0], startIndex, anchor.childNodes[0].textContent.length);
                }
            }
            else {
                this.createLinkNode(e);
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
    };
    
    LinkCommand.prototype.createLinkNode = function (e) {
        var domSelection = new NodeSelection();
        var nodeCutter = new NodeCutter();
        var range = domSelection.getRange(this.parent.currentDocument);
        var nodes = this.getSelectionNodes(domSelection.getNodeCollection(range));
        var save = domSelection.save(range, this.parent.currentDocument);
        var txtArray = [];
        var inlineNodes = [];
        var currentNode;
        var removeNodes = [];
        var anchorNodes = [];
        var finalinlineNodes = [];
        var cloneNode;
        for (var index = 0; index < nodes.length; index++) {
            nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index]);
            txtArray[index] = nodes[index];
        }
        for (var i = 0; i < txtArray.length; i++) {
            var check = true;
            currentNode = txtArray[i];
            while (check === true) {
                if (currentNode.parentElement.nodeName === 'A') {
                    var anchorEle = currentNode.parentElement;
                    currentNode.parentElement.parentElement.insertBefore(anchorEle.firstChild, anchorEle);
                    currentNode.parentElement.removeChild(anchorEle);
                }
                if (this.isBlockNode(currentNode.parentElement) || txtArray.length === 0 || i === 0 || i === txtArray.length - 1) {
                    inlineNodes[i] = currentNode;
                    check = false;
                }
                else {
                    currentNode = currentNode.parentElement;
                }
            }
        }
        for (var i = 0, j_1 = 0; i < inlineNodes.length; i++) {
            if (i === 0) {
                finalinlineNodes[j_1] = inlineNodes[i];
            }
            if (inlineNodes.length > 1 && i < inlineNodes.length - 1) {
                if ((inlineNodes[i].parentElement === inlineNodes[i + 1].parentElement) && (inlineNodes[i] === inlineNodes[i + 1])) {
                    continue;
                }
                else {
                    finalinlineNodes[j_1 + 1] = inlineNodes[i + 1];
                    j_1++;
                }
            }
        }
        var j = 0;
        anchorNodes[j] = this.createAchorNode(e);
        for (var i = 0; i < finalinlineNodes.length; i++) {
            if (i === 0) {
                cloneNode = finalinlineNodes[i].cloneNode(true);
                anchorNodes[i].appendChild(cloneNode);
            }
            if (i < finalinlineNodes.length - 1) {
                if (finalinlineNodes[i].parentNode === finalinlineNodes[i + 1].parentNode) {
                    var cln = finalinlineNodes[i + 1].cloneNode(true);
                    anchorNodes[j].appendChild(cln);
                }
                else {
                    j = j + 1;
                    anchorNodes[j] = this.createAchorNode(e);
                    cloneNode = finalinlineNodes[i + 1].cloneNode(true);
                    anchorNodes[j].appendChild(cloneNode);
                }
            }
        }
        this.parent.nodeSelection.setRange(document, save.range);
        for (var i = 0, j_2 = 0, k = 0; i <= finalinlineNodes.length; i++) {
            if (i === 0) {
                finalinlineNodes[i].parentNode.insertBefore(anchorNodes[j_2], finalinlineNodes[i].nextSibling);
                if (this.parent.domNode.blockNodes().length === 1) {
                    this.parent.nodeSelection.setSelectionNode(this.parent.currentDocument, anchorNodes[j_2]);
                }
                removeNodes[k] = finalinlineNodes[i];
                k++;
            }
            if (i < finalinlineNodes.length - 1) {
                if (finalinlineNodes[i].parentNode === finalinlineNodes[i + 1].parentNode) {
                    removeNodes[k] = finalinlineNodes[i + 1];
                    k++;
                }
                else {
                    j_2 = j_2 + 1;
                    finalinlineNodes[i + 1].parentNode.insertBefore(anchorNodes[j_2], finalinlineNodes[i + 1]);
                    removeNodes[k] = finalinlineNodes[i + 1];
                    k++;
                }
            }
        }
        for (var i = 0; i < removeNodes.length; i++) {
            if (removeNodes[i].parentNode) {
                removeNodes[i].parentNode.removeChild(removeNodes[i]);
            }
        }
    };
    LinkCommand.prototype.createAchorNode = function (e) {
        var anchorEle = createElement('a', {
            className: 'e-rte-anchor',
            attrs: {
                href: e.item.url,
                title: isNullOrUndefined(e.item.title) || e.item.title === '' ? e.item.url : e.item.title
            }
        });
        if (!isNullOrUndefined(e.item.target)) {
            anchorEle.setAttribute('target', e.item.target);
        }
        return anchorEle;
    };
    LinkCommand.prototype.getSelectionNodes = function (nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        for (var index = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeType !== 3 || nodeCollection[index].textContent.trim() === '') {
                if (nodeCollection[index].nodeName !== 'IMG') {
                    nodeCollection.splice(index, 1);
                    index--;
                }
            }
        }
        return nodeCollection.reverse();
    };
    LinkCommand.prototype.isBlockNode = function (element) {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) >= 0));
    };
    LinkCommand.prototype.removeText = function (text, val) {
        var arr = text.split(' ');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr.join(' ') + ' ';
    };
    LinkCommand.prototype.openLink = function (e) {
        document.defaultView.open(e.item.url, e.item.target);
        this.callBack(e);
    };
    LinkCommand.prototype.removeLink = function (e) {
        var blockNodes = this.parent.domNode.blockNodes();
        if (blockNodes.length < 2) {
            this.parent.domNode.setMarker(e.item.selection);
            var closestAnchor = closest(e.item.selectParent[0], 'a');
            var selectParent = closestAnchor ? closestAnchor : e.item.selectParent[0];
            var parent_1 = selectParent.parentNode;
            var child = [];
            for (; selectParent.firstChild; null) {
                child.push(parent_1.insertBefore(selectParent.firstChild, selectParent));
            }
            parent_1.removeChild(selectParent);
            if (child && child.length === 1) {
                e.item.selection.startContainer = e.item.selection.getNodeArray(child[child.length - 1], true);
                e.item.selection.endContainer = e.item.selection.startContainer;
            }
            e.item.selection = this.parent.domNode.saveMarker(e.item.selection);
        }
        else {
            for (var i = 0; i < blockNodes.length; i++) {
                var linkNode = blockNodes[i].querySelectorAll('a');
                for (var j = 0; j < linkNode.length; j++) {
                    if (document.getSelection().containsNode(linkNode[j], true)) {
                        linkNode[j].outerHTML = linkNode[j].innerHTML;
                    }
                }
            }
        }
        e.item.selection.restore();
        this.callBack(e);
    };
    LinkCommand.prototype.callBack = function (e) {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    return LinkCommand;
}());

/**
 * Formats internal component
 * @hidden
 * @deprecated
 */
var Alignments = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function Alignments(parent) {
        this.alignments = {
            'JustifyLeft': 'left',
            'JustifyCenter': 'center',
            'JustifyRight': 'right',
            'JustifyFull': 'justify'
        };
        this.parent = parent;
        this.addEventListener();
    }
    Alignments.prototype.addEventListener = function () {
        this.parent.observer.on(ALIGNMENT_TYPE, this.applyAlignment, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    Alignments.prototype.onKeyDown = function (e) {
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
    };
    Alignments.prototype.getTableNode = function (range) {
        var startNode = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer : range.startContainer.parentNode;
        var cellNode = closest(startNode, 'td,th');
        return [cellNode];
    };
    Alignments.prototype.applyAlignment = function (e) {
        var isTableAlign = e.value === 'Table' ? true : false;
        var range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        var save = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        if (!isTableAlign) {
            this.parent.domNode.setMarker(save);
            var alignmentNodes = this.parent.domNode.blockNodes();
            for (var i = 0; i < alignmentNodes.length; i++) {
                var parentNode = alignmentNodes[i];
                setStyleAttribute(parentNode, { 'text-align': this.alignments[e.subCommand] });
            }
            var imageTags = this.parent.domNode.getImageTagInSelection();
            for (var i = 0; i < imageTags.length; i++) {
                var elementNode = [];
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
    };
    return Alignments;
}());

/**
 * Indents internal component
 * @hidden
 * @deprecated
 */
var Indents = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function Indents(parent) {
        this.indentValue = 20;
        this.parent = parent;
        this.addEventListener();
    }
    Indents.prototype.addEventListener = function () {
        this.parent.observer.on(INDENT_TYPE, this.applyIndents, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    Indents.prototype.onKeyDown = function (e) {
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
    };
    Indents.prototype.applyIndents = function (e) {
        var range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        var save = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        var indentsNodes = this.parent.domNode.blockNodes();
        var parentNodes = indentsNodes.slice();
        var listsNodes = [];
        for (var i = 0; i < parentNodes.length; i++) {
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
                    preventDefault: function () { return; },
                    stopPropagation: function () { return; },
                    shiftKey: (e.subCommand === 'Indent' ? false : true),
                    which: 9,
                    action: 'indent'
                },
                ignoreDefault: true
            });
        }
        for (var i = 0; i < indentsNodes.length; i++) {
            var parentNode = indentsNodes[i];
            var marginLeft = parentNode.style.marginLeft;
            var indentsValue = void 0;
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
    };
    return Indents;
}());

/**
 * RichTextEditor classes defined here.
 */
/**
 * @hidden
 * @deprecated
 */
var CLASS_IMAGE_RIGHT = 'e-imgright';
var CLASS_IMAGE_LEFT = 'e-imgleft';
var CLASS_IMAGE_CENTER = 'e-imgcenter';
var CLASS_IMAGE_BREAK = 'e-imgbreak';
var CLASS_CAPTION = 'e-img-caption';
var CLASS_RTE_CAPTION = 'e-rte-img-caption';
var CLASS_CAPTION_INLINE = 'e-caption-inline';
var CLASS_IMAGE_INLINE = 'e-imginline';

/**
 * Link internal component
 * @hidden
 * @deprecated
 */
var ImageCommand = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function ImageCommand(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    ImageCommand.prototype.addEventListener = function () {
        this.parent.observer.on(IMAGE, this.imageCommand, this);
    };
    /**
     * imageCommand method
     * @hidden
     * @deprecated
     */
    ImageCommand.prototype.imageCommand = function (e) {
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
    };
    ImageCommand.prototype.createImage = function (e) {
        e.item.url = isNullOrUndefined(e.item.url) || e.item.url === 'undefined' ? e.item.src : e.item.url;
        if (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent[0].tagName === 'IMG') {
            var imgEle = e.item.selectParent[0];
            imgEle.setAttribute('src', e.item.url);
            imgEle.setAttribute('alt', e.item.altText);
        }
        else {
            var imgElement = createElement('img', {
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
    };
    ImageCommand.prototype.insertImageLink = function (e) {
        var anchor = createElement('a', {
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
    };
    ImageCommand.prototype.openImageLink = function (e) {
        document.defaultView.open(e.item.url, e.item.target);
        this.callBack(e);
    };
    ImageCommand.prototype.removeImageLink = function (e) {
        var selectParent = e.item.selectParent[0];
        if (selectParent.classList.contains('e-img-caption')) {
            var capImgWrap = select('.e-img-wrap', selectParent);
            var textEle = select('.e-img-inner', selectParent);
            var newTextEle = textEle.cloneNode(true);
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
    };
    ImageCommand.prototype.editImageLink = function (e) {
        e.item.selectNode[0].parentElement.href = e.item.url;
        if (isNullOrUndefined(e.item.target)) {
            e.item.selectNode[0].parentElement.removeAttribute('target');
        }
        else {
            e.item.selectNode[0].parentElement.target = e.item.target;
        }
        this.callBack(e);
    };
    ImageCommand.prototype.removeImage = function (e) {
        if (closest(e.item.selectNode[0], 'a')) {
            if (e.item.selectNode[0].parentElement.nodeName === 'A' && !isNullOrUndefined(e.item.selectNode[0].parentElement.innerText)) {
                detach(e.item.selectNode[0]);
            }
            else {
                detach(closest(e.item.selectNode[0], 'a'));
            }
        }
        else if (!isNullOrUndefined(closest(e.item.selectNode[0], '.' + CLASS_CAPTION))) {
            detach(closest(e.item.selectNode[0], '.' + CLASS_CAPTION));
        }
        else {
            detach(e.item.selectNode[0]);
        }
        this.callBack(e);
    };
    ImageCommand.prototype.insertAltTextImage = function (e) {
        e.item.selectNode[0].setAttribute('alt', e.item.altText);
        this.callBack(e);
    };
    ImageCommand.prototype.imageDimension = function (e) {
        var selectNode = e.item.selectNode[0];
        selectNode.style.height = '';
        selectNode.style.width = '';
        selectNode.width = e.item.width;
        selectNode.height = e.item.height;
        this.callBack(e);
    };
    ImageCommand.prototype.imageCaption = function (e) {
        InsertHtml.Insert(this.parent.currentDocument, e.item.insertElement, this.parent.editableElement);
        this.callBack(e);
    };
    ImageCommand.prototype.imageJustifyLeft = function (e) {
        var selectNode = e.item.selectNode[0];
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
    };
    ImageCommand.prototype.imageJustifyCenter = function (e) {
        var selectNode = e.item.selectNode[0];
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
            addClass([selectNode], CLASS_IMAGE_CENTER);
        }
        else {
            addClass([selectNode], CLASS_IMAGE_CENTER);
        }
        this.callBack(e);
    };
    ImageCommand.prototype.imageJustifyRight = function (e) {
        var selectNode = e.item.selectNode[0];
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
    };
    ImageCommand.prototype.imageInline = function (e) {
        var selectNode = e.item.selectNode[0];
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
    };
    ImageCommand.prototype.imageBreak = function (e) {
        var selectNode = e.item.selectNode[0];
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
    };
    ImageCommand.prototype.callBack = function (e) {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    return ImageCommand;
}());

/**
 * Link internal component
 * @hidden
 * @deprecated
 */
var TableCommand = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function TableCommand(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    TableCommand.prototype.addEventListener = function () {
        this.parent.observer.on(TABLE, this.createTable, this);
        this.parent.observer.on(INSERT_ROW, this.insertRow, this);
        this.parent.observer.on(INSERT_COLUMN, this.insertColumn, this);
        this.parent.observer.on(DELETEROW, this.deleteRow, this);
        this.parent.observer.on(DELETECOLUMN, this.deleteColumn, this);
        this.parent.observer.on(REMOVETABLE, this.removeTable, this);
        this.parent.observer.on(TABLEHEADER, this.tableHeader, this);
        this.parent.observer.on(TABLE_VERTICAL_ALIGN, this.tableVerticalAlign, this);
    };
    TableCommand.prototype.createTable = function (e) {
        var table = createElement('table', { className: 'e-rte-table' });
        var tblBody = createElement('tbody');
        table.style.width = e.item.width.width;
        var tdWid = parseInt(e.item.width.width, 10) / e.item.columns;
        for (var i = 0; i < e.item.row; i++) {
            var row = createElement('tr');
            for (var j = 0; j < e.item.columns; j++) {
                var cell = createElement('td');
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
    };
    TableCommand.prototype.removeEmptyNode = function () {
        var emptyUl = this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (var i = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
        var emptyLiChild = this.parent.editableElement.querySelectorAll('li *:empty');
        for (var i = 0; i < emptyLiChild.length; i++) {
            detach(emptyLiChild[i]);
            if (emptyLiChild.length === i + 1) {
                emptyLiChild = this.parent.editableElement.querySelectorAll('li *:empty');
                i = -1;
            }
        }
        var emptyLi = this.parent.editableElement.querySelectorAll('li:empty');
        for (var i = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
    };
    TableCommand.prototype.insertAfter = function (newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };
    TableCommand.prototype.insertRow = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        if (selectedCell.nodeName.toLowerCase() === 'th' && e.item.subCommand === 'InsertRowBefore') {
            return;
        }
        var curRow = closest(selectedCell, 'tr');
        var newRow;
        if (selectedCell.nodeName.toLowerCase() !== 'th') {
            newRow = closest(selectedCell, 'tr').cloneNode(true);
            var tabCell = Array.prototype.slice.call(newRow.querySelectorAll('td'));
            Array.prototype.forEach.call(tabCell, function (cell) {
                cell.innerHTML = '';
                cell.appendChild(createElement('br'));
                cell.removeAttribute('class');
            });
        }
        else {
            var childNodes = curRow.childNodes;
            newRow = createElement('tr');
            for (var i = 0; i < childNodes.length; i++) {
                var tdElement = createElement('td');
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
    };
    TableCommand.prototype.insertColumn = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        selectedCell = (selectedCell.nodeName !== 'TD') ? closest(selectedCell, 'td,th') : selectedCell;
        var curRow = closest(selectedCell, 'tr');
        var curCell;
        var allRows = closest((curRow), 'table').rows;
        var colIndex = Array.prototype.slice.call(curRow.querySelectorAll('th,td')).indexOf(selectedCell);
        var width = parseInt(e.item.width, 10) / (curRow.querySelectorAll('td,th').length + 1);
        for (var j = 0; j < closest(curRow, 'table').querySelectorAll('th,td').length; j++) {
            closest(curRow, 'table').querySelectorAll('th,td')[j].style.width = width + '%';
        }
        for (var i = 0; i < allRows.length; i++) {
            curCell = allRows[i].querySelectorAll('th,td')[colIndex];
            var colTemplate = curCell.cloneNode(true);
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
    };
    TableCommand.prototype.deleteColumn = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var selectedCellIndex = selectedCell.cellIndex;
        var parentTable = closest(selectedCell, 'table');
        var curRow = closest(selectedCell, 'tr');
        var allRows = closest(curRow, 'table').rows;
        if (curRow.querySelectorAll('th,td').length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        }
        else {
            for (var i = 0; i < allRows.length; i++) {
                allRows[i].deleteCell(selectedCellIndex);
                if (Browser.isIE) {
                    e.item.selection.setSelectionText(this.parent.currentDocument, parentTable.querySelector('td'), parentTable.querySelector('td'), 0, 0);
                    parentTable.querySelector('td, th').classList.add('e-cell-select');
                }
            }
        }
        if (e.callBack) {
            var sContainer = this.parent.nodeSelection.getRange(this.parent.currentDocument).startContainer;
            if (sContainer.nodeName !== 'TD') {
                var startChildLength = this.parent.nodeSelection.getRange(this.parent.currentDocument).startOffset;
                var focusNode = sContainer.children[startChildLength];
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, focusNode, 0);
            }
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    TableCommand.prototype.deleteRow = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var selectedRowIndex = selectedCell.parentNode.rowIndex;
        var parentTable = closest(selectedCell, 'table');
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
    };
    TableCommand.prototype.removeTable = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var seletedTable = closest(selectedCell.parentElement, 'table');
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
    };
    TableCommand.prototype.tableHeader = function (e) {
        var headerExit = false;
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var table = closest(selectedCell.parentElement, 'table');
        [].slice.call(table.childNodes).forEach(function (el) {
            if (el.nodeName === 'THEAD') {
                headerExit = true;
            }
        });
        if (table && !headerExit) {
            var cellCount = table.querySelector('tr').childElementCount;
            var header = table.createTHead();
            var row = header.insertRow(0);
            for (var i = 0; i < cellCount; i++) {
                var th = createElement('th');
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
    };
    TableCommand.prototype.tableVerticalAlign = function (e) {
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
    };
    return TableCommand;
}());

/**
 * Is formatted or not.
 * @hidden
 * @deprecated
 */
var IsFormatted = /** @__PURE__ @class */ (function () {
    function IsFormatted() {
    }
    /**
     * getFormattedNode method
     * @hidden
     * @deprecated
     */
    IsFormatted.prototype.getFormattedNode = function (node, format, endNode) {
        var parentNode = this.getFormatParent(node, format, endNode);
        if (parentNode !== null && parentNode !== endNode) {
            return parentNode;
        }
        return null;
    };
    IsFormatted.prototype.getFormatParent = function (node, format, endNode) {
        do {
            node = node.parentNode;
        } while (node && (node !== endNode) && !this.isFormattedNode(node, format));
        return node;
    };
    IsFormatted.prototype.isFormattedNode = function (node, format) {
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
    };
    /**
     * isBold method
     * @hidden
     * @deprecated
     */
    IsFormatted.isBold = function (node) {
        var validTags = ['strong', 'b'];
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
    };
    /**
     * isItalic method
     * @hidden
     * @deprecated
     */
    IsFormatted.isItalic = function (node) {
        var validTags = ['em', 'i'];
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
    };
    /**
     * isUnderline method
     * @hidden
     * @deprecated
     */
    IsFormatted.isUnderline = function (node) {
        var validTags = ['u'];
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
    };
    /**
     * isStrikethrough method
     * @hidden
     * @deprecated
     */
    IsFormatted.isStrikethrough = function (node) {
        var validTags = ['del', 'strike'];
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
    };
    /**
     * isSuperscript method
     * @hidden
     * @deprecated
     */
    IsFormatted.isSuperscript = function (node) {
        var validTags = ['sup'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * isSubscript method
     * @hidden
     * @deprecated
     */
    IsFormatted.isSubscript = function (node) {
        var validTags = ['sub'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isFontColor = function (node) {
        var color = node.style && node.style.color;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            color !== null && color !== '' && color !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isBackgroundColor = function (node) {
        var backColor = node.style && node.style.backgroundColor;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            backColor !== null && backColor !== '' && backColor !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isFontSize = function (node) {
        var size = node.style && node.style.fontSize;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            size !== null && size !== '' && size !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isFontName = function (node) {
        var name = node.style && node.style.fontFamily;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            name !== null && name !== '' && name !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
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
    return IsFormatted;
}());

/**
 * `Selection` module is used to handle RTE Selections.
 */
var SelectionCommands = /** @__PURE__ @class */ (function () {
    function SelectionCommands() {
    }
    /**
     * applyFormat method
     * @hidden
     * @deprecated
     */
    SelectionCommands.applyFormat = function (docElement, format, endNode, value, selector) {
        var validFormats = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase', 'fontcolor', 'fontname', 'fontsize', 'backgroundcolor'];
        if (validFormats.indexOf(format) > -1) {
            var domSelection = new NodeSelection();
            var nodeCutter = new NodeCutter();
            var isFormatted = new IsFormatted();
            var range = domSelection.getRange(docElement);
            var save = domSelection.save(range, docElement);
            var nodes = domSelection.getSelectionNodeCollection(range);
            var isCollapsed = false;
            var isFormat = false;
            var isCursor = false;
            var isFontStyle = (['fontcolor', 'fontname', 'fontsize', 'backgroundcolor'].indexOf(format) > -1);
            if (range.collapsed) {
                if (nodes.length > 0) {
                    isCollapsed = true;
                    range = nodeCutter.GetCursorRange(docElement, range, nodes[0]);
                }
                else if (range.startContainer.nodeName.toLowerCase() !== 'td') {
                    var cursorNode = this.insertCursorNode(docElement, domSelection, range, isFormatted, nodeCutter, format, value, endNode);
                    domSelection.endContainer = domSelection.startContainer = domSelection.getNodeArray(cursorNode, true);
                    domSelection.endOffset = domSelection.startOffset = 1;
                }
            }
            isCursor = range.collapsed;
            for (var index = 0; index < nodes.length; index++) {
                var formatNode = isFormatted.getFormattedNode(nodes[index], format, endNode);
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
    };
    SelectionCommands.insertCursorNode = function (docElement, domSelection, range, isFormatted, nodeCutter, format, value, endNode) {
        var cursorNodes = domSelection.getNodeCollection(range);
        var cursorFormat = (cursorNodes.length > 0) ? isFormatted.getFormattedNode(cursorNodes[0], format, endNode) : null;
        var cursorNode = null;
        if (cursorFormat) {
            cursorNode = cursorNodes[0];
            InsertMethods.unwrap(cursorFormat);
            cursorNodes[0] = InsertMethods.Wrap(cursorNodes[0], this.GetFormatNode(format, value));
        }
        else {
            cursorNode = this.getInsertNode(docElement, range, format, value).firstChild;
        }
        return cursorNode;
    };
    SelectionCommands.removeFormat = function (nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value, domSelection) {
        var splitNode = null;
        if (!(range.startContainer === range.endContainer && range.startOffset === 0
            && range.endOffset === range.startContainer.length)) {
            var nodeIndex = [];
            var cloneNode = nodes[index];
            do {
                nodeIndex.push(domSelection.getIndex(cloneNode));
                cloneNode = cloneNode.parentNode;
            } while (cloneNode && (cloneNode !== formatNode));
            cloneNode = splitNode = (isCursor && (formatNode.textContent.length - 1) === range.startOffset) ?
                nodeCutter.SplitNode(range, formatNode, true)
                : nodeCutter.GetSpliceNode(range, formatNode);
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
                    var divNode = document.createElement('div');
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
                var lastNode = splitNode;
                for (; lastNode.firstChild !== null && lastNode.firstChild.nodeType !== 3; null) {
                    lastNode = lastNode.firstChild;
                }
                lastNode.innerHTML = '&#65279;&#65279;';
                nodes[index] = lastNode.firstChild;
            }
        }
        var child = InsertMethods.unwrap(formatNode);
        if (child.length > 0 && isFontStyle) {
            for (var num = 0; num < child.length; num++) {
                child[num] = InsertMethods.Wrap(child[num], this.GetFormatNode(format, value));
            }
            if (format === 'fontsize') {
                var liElement = nodes[index].parentElement;
                var parentElement = nodes[index].parentElement;
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
    };
    SelectionCommands.insertFormat = function (docElement, nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value) {
        if (!isCursor) {
            if ((formatNode === null && isFormat) || isFontStyle) {
                nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index]);
                nodes[index].textContent = nodeCutter.TrimLineBreak(nodes[index].textContent);
                if (format === 'uppercase' || format === 'lowercase') {
                    nodes[index].textContent = (format === 'uppercase') ? nodes[index].textContent.toLocaleUpperCase()
                        : nodes[index].textContent.toLocaleLowerCase();
                }
                else if (!(isFontStyle === true && value === '')) {
                    var element = this.GetFormatNode(format, value);
                    if (format === 'fontsize') {
                        var liElement = nodes[index].parentElement;
                        var parentElement = nodes[index].parentElement;
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
                var element = this.getInsertNode(docElement, range, format, value);
                nodes[index] = element.firstChild;
                nodeCutter.position = 1;
            }
            else {
                nodeCutter.position = range.startOffset;
            }
        }
        return nodes[index];
    };
    SelectionCommands.applyStyles = function (nodes, index, element) {
        nodes[index] = (index === (nodes.length - 1)) ? InsertMethods.Wrap(nodes[index], element)
            : InsertMethods.WrapBefore(nodes[index], element, true);
        nodes[index] = this.getChildNode(nodes[index], element);
        return nodes[index];
    };
    SelectionCommands.getInsertNode = function (docElement, range, format, value) {
        var element = this.GetFormatNode(format, value);
        element.innerHTML = '&#65279;&#65279;';
        if (Browser.isIE) {
            var frag = docElement.createDocumentFragment();
            frag.appendChild(element);
            range.insertNode(frag);
        }
        else {
            range.insertNode(element);
        }
        return element;
    };
    SelectionCommands.getChildNode = function (node, element) {
        if (node === undefined || node === null) {
            element.innerHTML = '&#65279;';
            node = element.firstChild;
        }
        return node;
    };
    SelectionCommands.applySelection = function (nodes, domSelection, nodeCutter, index, isCollapsed) {
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
    };
    SelectionCommands.GetFormatNode = function (format, value) {
        var node;
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
    };
    return SelectionCommands;
}());

/**
 * Selection EXEC internal component
 * @hidden
 * @deprecated
 */
var SelectionBasedExec = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function SelectionBasedExec(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    SelectionBasedExec.prototype.addEventListener = function () {
        this.parent.observer.on(SELECTION_TYPE, this.applySelection, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDownHandler, this);
    };
    SelectionBasedExec.prototype.keyDownHandler = function (e) {
        var validFormats = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase'];
        if (e.event.ctrlKey && validFormats.indexOf(e.event.action) > -1) {
            e.event.preventDefault();
            SelectionCommands.applyFormat(this.parent.currentDocument, e.event.action, this.parent.editableElement);
            this.callBack(e, e.event.action);
        }
    };
    SelectionBasedExec.prototype.applySelection = function (e) {
        SelectionCommands.applyFormat(this.parent.currentDocument, e.subCommand.toLocaleLowerCase(), this.parent.editableElement, e.value, e.selector);
        this.callBack(e, e.subCommand);
    };
    SelectionBasedExec.prototype.callBack = function (event, action) {
        if (event.callBack) {
            event.callBack({
                requestType: action,
                event: event.event,
                editorMode: 'HTML',
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    return SelectionBasedExec;
}());

/**
 * Selection EXEC internal component
 * @hidden
 * @deprecated
 */
var InsertHtmlExec = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function InsertHtmlExec(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    InsertHtmlExec.prototype.addEventListener = function () {
        this.parent.observer.on(INSERTHTML_TYPE, this.applyHtml, this);
    };
    InsertHtmlExec.prototype.applyHtml = function (e) {
        InsertHtml.Insert(this.parent.currentDocument, e.value, this.parent.editableElement);
        if (e.subCommand === 'pasteCleanup') {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                elements: e.value
            });
        }
        else {
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
    };
    return InsertHtmlExec;
}());

/**
 * `Clear Format` module is used to handle Clear Format.
 */
var ClearFormat$1 = /** @__PURE__ @class */ (function () {
    function ClearFormat() {
    }
    /**
     * clear method
     * @hidden
     * @deprecated
     */
    ClearFormat.clear = function (docElement, endNode, selector) {
        var nodeSelection = new NodeSelection();
        var nodeCutter = new NodeCutter();
        var range = nodeSelection.getRange(docElement);
        var isCollapsed = range.collapsed;
        var nodes = nodeSelection.getInsertNodeCollection(range);
        var save = nodeSelection.save(range, docElement);
        if (!isCollapsed) {
            var preNode = nodeCutter.GetSpliceNode(range, nodes[0]);
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            }
            else {
                var lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1]);
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            var exactNodes = nodeSelection.getNodeCollection(range);
            var cloneSelectNodes = exactNodes.slice();
            this.clearInlines(nodeSelection.getSelectionNodes(cloneSelectNodes), cloneSelectNodes, nodeSelection.getRange(docElement), nodeCutter, endNode);
            this.reSelection(docElement, save, exactNodes);
            range = nodeSelection.getRange(docElement);
            exactNodes = nodeSelection.getNodeCollection(range);
            var cloneParentNodes = exactNodes.slice();
            this.clearBlocks(docElement, cloneParentNodes, endNode, nodeCutter, nodeSelection);
            if (isIDevice$1()) {
                setEditFrameFocus(endNode, selector);
            }
            this.reSelection(docElement, save, exactNodes);
        }
    };
    ClearFormat.reSelection = function (docElement, save, exactNodes) {
        var selectionNodes = save.getInsertNodes(exactNodes);
        save.startContainer = save.getNodeArray(selectionNodes[0], true, docElement);
        save.startOffset = 0;
        save.endContainer = save.getNodeArray(selectionNodes[selectionNodes.length - 1], false, docElement);
        var endIndexNode = selectionNodes[selectionNodes.length - 1];
        save.endOffset = (endIndexNode.nodeType === 3) ? endIndexNode.textContent.length
            : endIndexNode.childNodes.length;
        save.restore();
    };
    ClearFormat.clearBlocks = function (docElement, nodes, endNode, nodeCutter, nodeSelection) {
        var parentNodes = [];
        for (var index = 0; index < nodes.length; index++) {
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
    };
    ClearFormat.spliceParent = function (parentNodes, nodes) {
        for (var index1 = 0; index1 < parentNodes.length; index1++) {
            var len = parentNodes[index1].childNodes.length;
            for (var index2 = 0; index2 < len; index2++) {
                if ((nodes.indexOf(parentNodes[index1].childNodes[index2]) > 0)
                    && (parentNodes[index1].childNodes[index2].childNodes.length > 0)) {
                    nodes = this.spliceParent([parentNodes[index1].childNodes[index2]], nodes)[1];
                }
                if ((nodes.indexOf(parentNodes[index1].childNodes[index2]) <= -1) &&
                    (parentNodes[index1].childNodes[index2].textContent.trim() !== '')) {
                    for (var index3 = 0; index3 < len; index3++) {
                        if (nodes.indexOf(parentNodes[index1].childNodes[index3]) > -1) {
                            nodes.splice(nodes.indexOf(parentNodes[index1].childNodes[index3]), 1);
                        }
                    }
                    index2 = parentNodes[index1].childNodes.length;
                    var parentIndex = parentNodes.indexOf(parentNodes[index1].parentNode);
                    var nodeIndex = nodes.indexOf(parentNodes[index1].parentNode);
                    if (parentIndex > -1) {
                        parentNodes.splice(parentIndex, 1);
                    }
                    if (nodeIndex > -1) {
                        nodes.splice(nodeIndex, 1);
                    }
                    var elementIndex = nodes.indexOf(parentNodes[index1]);
                    if (elementIndex > -1) {
                        nodes.splice(elementIndex, 1);
                    }
                    parentNodes.splice(index1, 1);
                    index1--;
                }
            }
        }
        return [parentNodes, nodes];
    };
    ClearFormat.removeChild = function (parentNodes, parentNode) {
        var count = parentNode.childNodes.length;
        if (count > 0) {
            for (var index = 0; index < count; index++) {
                if (parentNodes.indexOf(parentNode.childNodes[index]) > -1) {
                    parentNodes = this.removeChild(parentNodes, parentNode.childNodes[index]);
                    parentNodes.splice(parentNodes.indexOf(parentNode.childNodes[index]), 1);
                }
            }
        }
        return parentNodes;
    };
    ClearFormat.removeParent = function (parentNodes) {
        for (var index = 0; index < parentNodes.length; index++) {
            if (parentNodes.indexOf(parentNodes[index].parentNode) > -1) {
                parentNodes = this.removeChild(parentNodes, parentNodes[index]);
                parentNodes.splice(index, 1);
                index--;
            }
        }
        return parentNodes;
    };
    ClearFormat.unWrap = function (docElement, parentNodes, nodeCutter, nodeSelection) {
        for (var index1 = 0; index1 < parentNodes.length; index1++) {
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
                var childNodes = InsertMethods.unwrap(parentNodes[index1]);
                if (childNodes.length === 1
                    && childNodes[0].parentNode.nodeName.toLocaleLowerCase() === 'p') {
                    InsertMethods.Wrap(parentNodes[index1], docElement.createElement('p'));
                    InsertMethods.unwrap(parentNodes[index1]);
                }
                for (var index2 = 0; index2 < childNodes.length; index2++) {
                    if (this.NONVALID_TAGS.indexOf(childNodes[index2].nodeName.toLowerCase()) > -1) {
                        this.unWrap(docElement, [childNodes[index2]], nodeCutter, nodeSelection);
                    }
                    else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].nodeName.toLocaleLowerCase() !== 'p') {
                        var blockNodes = this.removeParent([childNodes[index2]]);
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
    };
    ClearFormat.clearInlines = function (textNodes, nodes, range, nodeCutter, endNode) {
        for (var index = 0; index < textNodes.length; index++) {
            if (textNodes[index].parentNode &&
                IsFormatted.inlineTags.indexOf(textNodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1) {
                nodeCutter.GetSpliceNode(range, textNodes[index].parentNode);
                this.removeInlineParent(textNodes[index].parentNode);
            }
        }
    };
    ClearFormat.removeInlineParent = function (textNodes) {
        var nodes = InsertMethods.unwrap(textNodes);
        for (var index = 0; index < nodes.length; index++) {
            if (nodes[index].parentNode.childNodes.length === 1
                && IsFormatted.inlineTags.indexOf(nodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index].parentNode);
            }
            else if (IsFormatted.inlineTags.indexOf(nodes[index].nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index]);
            }
        }
    };
    ClearFormat.BLOCK_TAGS = ['address', 'article', 'aside', 'blockquote',
        'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
        'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'li', 'main', 'nav',
        'noscript', 'ol', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
        'thead', 'tr', 'ul'];
    ClearFormat.NONVALID_PARENT_TAGS = ['thead', 'tbody', 'ul', 'ol', 'table', 'tfoot', 'tr'];
    ClearFormat.IGNORE_PARENT_TAGS = ['ul', 'ol', 'table'];
    ClearFormat.NONVALID_TAGS = ['thead', 'tbody', 'figcaption', 'td', 'tr',
        'th', 'tfoot', 'figcaption', 'li'];
    return ClearFormat;
}());

/**
 * Clear Format EXEC internal component
 * @hidden
 * @deprecated
 */
var ClearFormatExec = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function ClearFormatExec(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    ClearFormatExec.prototype.addEventListener = function () {
        this.parent.observer.on(CLEAR_TYPE, this.applyClear, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    ClearFormatExec.prototype.onKeyDown = function (e) {
        switch (e.event.action) {
            case 'clear-format':
                this.applyClear({ subCommand: 'ClearFormat', callBack: e.callBack });
                e.event.preventDefault();
                break;
        }
    };
    ClearFormatExec.prototype.applyClear = function (e) {
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
    };
    return ClearFormatExec;
}());

/**
 * `Undo` module is used to handle undo actions.
 */
var UndoRedoManager = /** @__PURE__ @class */ (function () {
    function UndoRedoManager(parent, options) {
        this.undoRedoStack = [];
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.addEventListener();
    }
    UndoRedoManager.prototype.addEventListener = function () {
        var debounceListener = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(KEY_UP_HANDLER, debounceListener, this);
        this.parent.observer.on(KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(ACTION, this.onAction, this);
        this.parent.observer.on(MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
    };
    UndoRedoManager.prototype.onPropertyChanged = function (props) {
        for (var _i = 0, _a = Object.keys(props.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'undoRedoSteps':
                    this.undoRedoSteps = props.newProp.undoRedoSteps;
                    break;
                case 'undoRedoTimer':
                    this.undoRedoTimer = props.newProp.undoRedoTimer;
                    break;
            }
        }
    };
    UndoRedoManager.prototype.removeEventListener = function () {
        this.parent.observer.off(KEY_UP_HANDLER, this.keyUp);
        this.parent.observer.off(KEY_DOWN_HANDLER, this.keyDown);
        this.parent.observer.off(ACTION, this.onAction);
    };
    /**
     * onAction method
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.onAction = function (e) {
        if (e.subCommand === 'Undo') {
            this.undo(e);
        }
        else {
            this.redo(e);
        }
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.destroy = function () {
        this.removeEventListener();
    };
    UndoRedoManager.prototype.keyDown = function (e) {
        var event = e.event;
        var proxy = this;
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
    };
    UndoRedoManager.prototype.keyUp = function (e) {
        if (e.event.keyCode !== 17 && !e.event.ctrlKey) {
            this.saveData(e);
        }
    };
    /**
     * RTE collection stored html format.
     * @method saveData
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.saveData = function (e) {
        var range = new NodeSelection().getRange(this.parent.currentDocument);
        var save = new NodeSelection().save(range, this.parent.currentDocument);
        var htmlText = this.parent.editableElement.innerHTML;
        var changEle = { text: htmlText, range: save };
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
    };
    /**
     * Undo the editable text.
     * @method undo
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.undo = function (e) {
        if (this.steps > 0) {
            var range = this.undoRedoStack[this.steps - 1].range;
            var removedContent = this.undoRedoStack[this.steps - 1].text;
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
    };
    /**
     * Redo the editable text.
     * @method redo
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.redo = function (e) {
        if (this.undoRedoStack[this.steps + 1] != null) {
            var range = this.undoRedoStack[this.steps + 1].range;
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
    };
    /**
     * getUndoStatus method
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.getUndoStatus = function () {
        var status = { undo: false, redo: false };
        if (this.steps > 0) {
            status.undo = true;
        }
        if (this.undoRedoStack[this.steps + 1] != null) {
            status.redo = true;
        }
        return status;
    };
    return UndoRedoManager;
}());

/**
 * PasteCleanup for MsWord content
 * @hidden
 * @deprecated
 */
var MsWordPaste = /** @__PURE__ @class */ (function () {
    function MsWordPaste(parent) {
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
    MsWordPaste.prototype.addEventListener = function () {
        this.parent.observer.on(MS_WORD_CLEANUP_PLUGIN, this.wordCleanup, this);
    };
    MsWordPaste.prototype.wordCleanup = function (e) {
        var wordPasteStyleConfig = e.allowedStylePropertiesArray;
        var listNodes = [];
        var tempHTMLContent = e.args.clipboardData.getData('text/HTML');
        var rtfData = e.args.clipboardData.getData('text/rtf');
        var elm = createElement('p');
        elm.setAttribute('id', 'MSWord-Content');
        elm.innerHTML = tempHTMLContent;
        var patern = /class='?Mso|style='[^ ]*\bmso-/i;
        var patern2 = /class="?Mso|style="[^ ]*\bmso-/i;
        var patern3 = /(class="?Mso|class='?Mso|class="?Xl|class='?Xl|class=Xl|style="[^"]*\bmso-|style='[^']*\bmso-|w:WordDocument)/gi;
        if (patern.test(tempHTMLContent) || patern2.test(tempHTMLContent) || patern3.test(tempHTMLContent)) {
            this.imageConversion(elm, rtfData);
            tempHTMLContent = tempHTMLContent.replace(/<img[^>]+>/i, '');
            listNodes = this.cleanUp(elm, listNodes);
            if (!isNullOrUndefined(listNodes[0]) && listNodes[0].parentElement.tagName !== 'UL' &&
                listNodes[0].parentElement.tagName !== 'OL') {
                this.listConverter(listNodes);
            }
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
    };
    MsWordPaste.prototype.imageConversion = function (elm, rtfData) {
        this.checkVShape(elm);
        var imgElem = elm.querySelectorAll('img');
        var imgSrc = [];
        var base64Src = [];
        var imgName = [];
        if (imgElem.length > 0) {
            for (var i = 0; i < imgElem.length; i++) {
                imgSrc.push(imgElem[i].getAttribute('src'));
                imgName.push(imgElem[i].getAttribute('src').split('/')[imgElem[i].getAttribute('src').split('/').length - 1].split('.')[0]);
            }
            var hexValue = this.hexConversion(rtfData);
            for (var i = 0; i < hexValue.length; i++) {
                base64Src.push(this.convertToBase64(hexValue[i]));
            }
            for (var i = 0; i < imgElem.length; i++) {
                imgElem[i].setAttribute('src', base64Src[i]);
                imgElem[i].setAttribute('id', 'msWordImg-' + imgName[i]);
            }
        }
    };
    MsWordPaste.prototype.checkVShape = function (elm) {
        var allNodes = elm.querySelectorAll('*');
        for (var i = 0; i < allNodes.length; i++) {
            switch (allNodes[i].nodeName) {
                case 'V:SHAPETYPE':
                    detach(allNodes[i]);
                    break;
                case 'V:SHAPE':
                    if (allNodes[i].firstElementChild.nodeName === 'V:IMAGEDATA') {
                        var src = allNodes[i].firstElementChild.getAttribute('src');
                        var imgElement = createElement('img');
                        imgElement.setAttribute('src', src);
                        allNodes[i].parentElement.insertBefore(imgElement, allNodes[i]);
                        detach(allNodes[i]);
                    }
                    break;
            }
        }
    };
    MsWordPaste.prototype.convertToBase64 = function (hexValue) {
        var base64;
        var byteArr = this.conHexStringToBytes(hexValue.hex);
        var base64String = this.conBytesToBase64(byteArr);
        base64 = hexValue.type ? 'data:' + hexValue.type + ';base64,' + base64String : null;
        return base64;
    };
    MsWordPaste.prototype.conBytesToBase64 = function (byteArr) {
        var base64Str = '';
        var base64Char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var byteArrLen = byteArr.length;
        for (var i = 0; i < byteArrLen; i += 3) {
            var array3 = byteArr.slice(i, i + 3);
            var array3length = array3.length;
            var array4 = [];
            if (array3length < 3) {
                for (var j = array3length; j < 3; j++) {
                    array3[j] = 0;
                }
            }
            array4[0] = (array3[0] & 0xFC) >> 2;
            array4[1] = ((array3[0] & 0x03) << 4) | (array3[1] >> 4);
            array4[2] = ((array3[1] & 0x0F) << 2) | ((array3[2] & 0xC0) >> 6);
            array4[3] = array3[2] & 0x3F;
            for (var j = 0; j < 4; j++) {
                if (j <= array3length) {
                    base64Str += base64Char.charAt(array4[j]);
                }
                else {
                    base64Str += '=';
                }
            }
        }
        return base64Str;
    };
    MsWordPaste.prototype.conHexStringToBytes = function (hex) {
        var byteArr = [];
        var byteArrLen = hex.length / 2;
        for (var i = 0; i < byteArrLen; i++) {
            byteArr.push(parseInt(hex.substr(i * 2, 2), 16));
        }
        return byteArr;
    };
    MsWordPaste.prototype.hexConversion = function (rtfData) {
        var picHead = /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/;
        var pic = new RegExp('(?:(' + picHead.source + '))([\\da-fA-F\\s]+)\\}', 'g');
        var fullImg = rtfData.match(pic);
        var imgType;
        var result = [];
        for (var i = 0; i < fullImg.length; i++) {
            if (picHead.test(fullImg[i])) {
                if (fullImg[i].indexOf('\\pngblip') !== -1) {
                    imgType = 'image/png';
                }
                else if (fullImg[i].indexOf('\\jpegblip') !== -1) {
                    imgType = 'image/jpeg';
                }
                else {
                    continue;
                }
                result.push({
                    hex: imgType ? fullImg[i].replace(picHead, '').replace(/[^\da-fA-F]/g, '') : null,
                    type: imgType
                });
            }
        }
        return result;
    };
    MsWordPaste.prototype.removeClassName = function (elm) {
        var elmWithClass = elm.querySelectorAll('*[class]');
        for (var i = 0; i < elmWithClass.length; i++) {
            elmWithClass[i].removeAttribute('class');
        }
    };
    MsWordPaste.prototype.breakLineAddition = function (elm) {
        var allElements = elm.querySelectorAll('*');
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].children.length === 0 && allElements[i].innerHTML === '&nbsp;' &&
                (allElements[i].innerHTML === '&nbsp;' && !allElements[i].closest('li'))) {
                var detachableElement = this.findDetachElem(allElements[i]);
                var brElement = createElement('br');
                if (!isNullOrUndefined(detachableElement.parentElement)) {
                    detachableElement.parentElement.insertBefore(brElement, detachableElement);
                    detach(detachableElement);
                }
            }
        }
    };
    MsWordPaste.prototype.findDetachElem = function (element) {
        var removableElement;
        if (!isNullOrUndefined(element.parentElement) &&
            element.parentElement.textContent.trim() === '' && element.parentElement.tagName !== 'TD') {
            removableElement = this.findDetachElem(element.parentElement);
        }
        else {
            removableElement = element;
        }
        return removableElement;
    };
    MsWordPaste.prototype.removeUnwantedElements = function (elm) {
        var innerElement = elm.innerHTML;
        for (var i = 0; i < this.removableElements.length; i++) {
            var regExpStartElem = new RegExp('<' + this.removableElements[i] + '>', 'g');
            var regExpEndElem = new RegExp('</' + this.removableElements[i] + '>', 'g');
            innerElement = innerElement.replace(regExpStartElem, '');
            innerElement = innerElement.replace(regExpEndElem, '');
        }
        elm.innerHTML = innerElement;
        elm.querySelectorAll(':empty');
    };
    MsWordPaste.prototype.findDetachEmptyElem = function (element) {
        var removableElement;
        if (!isNullOrUndefined(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' &&
                element.parentElement.getAttribute('id') !== 'MSWord-Content' &&
                isNullOrUndefined(element.parentElement.querySelector('img'))) {
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
    };
    MsWordPaste.prototype.removeEmptyElements = function (element) {
        var emptyElements = element.querySelectorAll(':empty');
        for (var i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR') {
                var detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNullOrUndefined(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    };
    MsWordPaste.prototype.styleCorrection = function (elm, wordPasteStyleConfig) {
        var styleElement = elm.querySelectorAll('style');
        if (styleElement.length > 0) {
            var styles = styleElement[0].innerHTML.match(/[\S ]+\s+{[\s\S]+?}/gi);
            var styleClassObject_1 = !isNullOrUndefined(styles) ? this.findStyleObject(styles) : null;
            var keys = Object.keys(styleClassObject_1);
            var values = keys.map(function (key) { return styleClassObject_1[key]; });
            values = this.removeUnwantedStyle(values, wordPasteStyleConfig);
            this.filterStyles(elm, wordPasteStyleConfig);
            var resultElem = void 0;
            for (var i = 0; i < keys.length; i++) {
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
                for (var j = 0; j < resultElem.length; j++) {
                    var styleProperty = resultElem[j].getAttribute('style');
                    if (!isNullOrUndefined(styleProperty) && styleProperty.trim() !== '') {
                        var valueSplit = values[i].split(';');
                        for (var k = 0; k < valueSplit.length; k++) {
                            if (styleProperty.indexOf(valueSplit[k].split(':')[0]) >= 0) {
                                valueSplit.splice(k, 1);
                                k--;
                            }
                        }
                        values[i] = valueSplit.join(';') + ';';
                        var changedValue = values[i] + styleProperty;
                        resultElem[j].setAttribute('style', changedValue);
                    }
                    else {
                        resultElem[j].setAttribute('style', values[i]);
                    }
                }
            }
        }
    };
    MsWordPaste.prototype.filterStyles = function (elm, wordPasteStyleConfig) {
        var elmWithStyles = elm.querySelectorAll('*[style]');
        for (var i = 0; i < elmWithStyles.length; i++) {
            var elemStyleProperty = elmWithStyles[i].getAttribute('style').split(';');
            var styleValue = '';
            for (var j = 0; j < elemStyleProperty.length; j++) {
                if (wordPasteStyleConfig.indexOf(elemStyleProperty[j].split(':')[0].trim()) >= 0) {
                    styleValue += elemStyleProperty[j] + ';';
                }
            }
            elmWithStyles[i].setAttribute('style', styleValue);
        }
    };
    MsWordPaste.prototype.removeUnwantedStyle = function (values, wordPasteStyleConfig) {
        for (var i = 0; i < values.length; i++) {
            var styleValues = values[i].split(';');
            values[i] = '';
            for (var j = 0; j < styleValues.length; j++) {
                if (wordPasteStyleConfig.indexOf(styleValues[j].split(':')[0]) >= 0) {
                    values[i] += styleValues[j] + ';';
                }
            }
        }
        return values;
    };
    MsWordPaste.prototype.findStyleObject = function (styles) {
        var styleClassObject = {};
        for (var i = 0; i < styles.length; i++) {
            var tempStyle = styles[i];
            var classNameCollection = tempStyle.replace(/([\S ]+\s+){[\s\S]+?}/gi, '$1');
            var stylesCollection = tempStyle.replace(/[\S ]+\s+{([\s\S]+?)}/gi, '$1');
            classNameCollection = classNameCollection.replace(/^[\s]|[\s]$/gm, '');
            stylesCollection = stylesCollection.replace(/^[\s]|[\s]$/gm, '');
            classNameCollection = classNameCollection.replace(/\n|\r|\n\r/g, '');
            stylesCollection = stylesCollection.replace(/\n|\r|\n\r/g, '');
            for (var classNames = classNameCollection.split(', '), j = 0; j < classNames.length; j++) {
                styleClassObject[classNames[j]] = stylesCollection;
            }
        }
        return styleClassObject;
    };
    MsWordPaste.prototype.removingComments = function (elm) {
        var innerElement = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    };
    MsWordPaste.prototype.cleanUp = function (node, listNodes) {
        var tempCleaner = [];
        var prevflagState;
        var allNodes = node.querySelectorAll('*');
        for (var index = 0; index < allNodes.length; index++) {
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
    };
    MsWordPaste.prototype.listConverter = function (listNodes) {
        var level;
        var data = [];
        var collection = [];
        var content = '';
        var stNode;
        for (var i = 0; i < listNodes.length; i++) {
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
            var type = void 0;
            if (!isNullOrUndefined(this.listContents[0])) {
                type = this.listContents[0].trim().length > 1 ? 'ol' : 'ul';
                var tempNode = [];
                for (var j = 1; j < this.listContents.length; j++) {
                    tempNode.push(this.listContents[j]);
                }
                collection.push({ listType: type, content: tempNode, nestedLevel: level });
            }
        }
        stNode = listNodes.shift();
        while (stNode) {
            var elemColl = [];
            for (var temp1 = 0; temp1 < data.length; temp1++) {
                if (data[temp1].node === stNode) {
                    for (var index = 0; index < data[temp1].content.childNodes.length; index++) {
                        elemColl.push(data[temp1].content.childNodes[index]);
                    }
                    for (var index = 0; index < elemColl.length; index++) {
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
    };
    MsWordPaste.prototype.makeConversion = function (collection) {
        var root = createElement('div');
        var temp;
        var pLevel = 1;
        var prevList;
        var listCount = 0;
        var elem;
        for (var index = 0; index < collection.length; index++) {
            var pElement = createElement('p');
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
                if (!isNullOrUndefined(prevList)) {
                    for (var j = 0; j < collection[index].nestedLevel - pLevel; j++) {
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
                else {
                    root.appendChild(temp = createElement(collection[index].listType));
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                    temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                }
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
    };
    MsWordPaste.prototype.getListStyle = function (listType, nestedLevel) {
        nestedLevel = (nestedLevel > 0) ? nestedLevel - 1 : nestedLevel;
        if (listType === 'ol') {
            return (nestedLevel < this.olData.length ? this.olData[nestedLevel] : this.olData[0]);
        }
        else {
            return (nestedLevel < this.ulData.length ? this.ulData[nestedLevel] : this.ulData[0]);
        }
    };
    MsWordPaste.prototype.getListContent = function (elem) {
        var pushContent = '';
        if (elem.firstElementChild.textContent.trim() === '' &&
            !isNullOrUndefined(elem.firstElementChild.firstElementChild) &&
            elem.firstElementChild.firstElementChild.nodeName === 'IMG') {
            pushContent = elem.innerHTML.trim();
            this.listContents.push('');
            this.listContents.push(pushContent);
        }
        else {
            pushContent = elem.firstElementChild.textContent.trim();
            this.listContents.push(pushContent);
        }
        detach(elem.firstElementChild);
        this.listContents.push(elem.innerHTML);
    };
    return MsWordPaste;
}());

/**
 * Insert a Text Node or Text
 * @hidden
 * @deprecated
 */
var InsertTextExec = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the InsertText plugin
     * @hidden
     * @deprecated
     */
    function InsertTextExec(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    InsertTextExec.prototype.addEventListener = function () {
        this.parent.observer.on(INSERT_TEXT_TYPE, this.insertText, this);
    };
    InsertTextExec.prototype.insertText = function (e) {
        var node = document.createTextNode(e.value);
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
    };
    return InsertTextExec;
}());

/**
 * EditorManager internal component
 * @hidden
 * @deprecated
 */
var EditorManager = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for creating the component
     * @hidden
     * @deprecated
     */
    function EditorManager(options) {
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
    EditorManager.prototype.wireEvents = function () {
        this.observer.on(KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(KEY_UP, this.editorKeyUp, this);
        this.observer.on(KEY_UP, this.editorKeyUp, this);
        this.observer.on(MODEL_CHANGED, this.onPropertyChanged, this);
        this.observer.on(MS_WORD_CLEANUP, this.onWordPaste, this);
    };
    EditorManager.prototype.onWordPaste = function (e) {
        this.observer.notify(MS_WORD_CLEANUP_PLUGIN, e);
    };
    EditorManager.prototype.onPropertyChanged = function (props) {
        this.observer.notify(MODEL_CHANGED_PLUGIN, props);
    };
    EditorManager.prototype.editorKeyDown = function (e) {
        this.observer.notify(KEY_DOWN_HANDLER, e);
    };
    EditorManager.prototype.editorKeyUp = function (e) {
        this.observer.notify(KEY_UP_HANDLER, e);
    };
    /**
     * execCommand
     * @hidden
     * @deprecated
     */
    EditorManager.prototype.execCommand = function (command, value, event, callBack, text, exeValue, selector) {
        switch (command.toLocaleLowerCase()) {
            case 'lists':
                this.observer.notify(LIST_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'formats':
                this.observer.notify(FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack,
                    selector: selector, exeValue: exeValue
                });
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
    };
    return EditorManager;
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
 * HTML adapter
 * @hidden
 * @deprecated
 */
var HTMLFormatter = /** @__PURE__ @class */ (function (_super) {
    __extends$2(HTMLFormatter, _super);
    function HTMLFormatter(options) {
        var _this = _super.call(this) || this;
        _this.initialize();
        extend(_this, _this, options, true);
        if (_this.currentDocument && _this.element) {
            _this.updateFormatter(_this.element, _this.currentDocument, options.options);
        }
        return _this;
    }
    HTMLFormatter.prototype.initialize = function () {
        this.keyConfig = htmlKeyConfig;
    };
    /**
     * Update the formatter of RichTextEditor
     * @param  {Element} editElement
     * @param  {Document} doc
     * @hidden
     * @deprecated
     */
    HTMLFormatter.prototype.updateFormatter = function (editElement, doc, options) {
        if (editElement && doc) {
            this.editorManager = new EditorManager({
                document: doc,
                editableElement: editElement,
                options: options
            });
        }
    };
    return HTMLFormatter;
}(Formatter));

/**
 * Update Toolbar Status
 * @hidden
 * @deprecated
 */
var statusCollection = {
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
    createlink: false,
    insertcode: false
};
var ToolbarStatus = /** @__PURE__ @class */ (function () {
    function ToolbarStatus() {
    }
    /**
     * get method
     * @hidden
     * @deprecated
     */
    ToolbarStatus.get = function (docElement, targetNode, formatNode, fontSize, fontName, documentNode) {
        var formatCollection = JSON.parse(JSON.stringify(statusCollection));
        var nodeCollection = JSON.parse(JSON.stringify(statusCollection));
        var nodeSelection = new NodeSelection();
        var nodes = documentNode ? [documentNode] : nodeSelection.getNodeCollection(nodeSelection.getRange(docElement));
        var nodesLength = nodes.length;
        for (var index = 0; index < nodes.length; index++) {
            if ((nodes[index].nodeName !== 'BR' && nodes[index].nodeType !== 3) ||
                (nodesLength > 1 && nodes[index].nodeType === 3 && nodes[index].textContent.trim() === '')) {
                nodes.splice(index, 1);
                index--;
            }
        }
        for (var index = 0; index < nodes.length; index++) {
            formatCollection = this.getFormatParent(docElement, formatCollection, nodes[index], targetNode, formatNode, fontSize, fontName);
            if ((index === 0 && formatCollection.bold) || !formatCollection.bold) {
                nodeCollection.bold = formatCollection.bold;
            }
            if ((index === 0 && formatCollection.insertcode) || !formatCollection.insertcode) {
                nodeCollection.insertcode = formatCollection.insertcode;
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
    };
    ToolbarStatus.getFormatParent = function (docElement, formatCollection, node, targetNode, formatNode, fontSize, fontName) {
        if (targetNode.contains(node) ||
            (node.nodeType === 3 && targetNode.nodeType !== 3 && targetNode.contains(node.parentNode))) {
            do {
                formatCollection = this.isFormattedNode(docElement, formatCollection, node, formatNode, fontSize, fontName);
                node = node.parentNode;
            } while (node && (node !== targetNode));
        }
        return formatCollection;
    };
    ToolbarStatus.isFormattedNode = function (docElement, formatCollection, node, formatNode, fontSize, fontName) {
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
            if (formatCollection.formats === 'pre') {
                formatCollection.insertcode = true;
            }
        }
        if (!formatCollection.createlink) {
            formatCollection.createlink = this.isLink(node);
        }
        return formatCollection;
    };
    ToolbarStatus.isFontColor = function (docElement, node) {
        var color = node.style && node.style.color;
        if ((color === null || color === undefined || color === '') && node.nodeType !== 3) {
            color = this.getComputedStyle(docElement, node, 'color');
        }
        if (color !== null && color !== '' && color !== undefined) {
            return color;
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isLink = function (node) {
        if (node.nodeName.toLocaleLowerCase() === 'a') {
            return true;
        }
        else {
            return false;
        }
    };
    ToolbarStatus.isBackgroundColor = function (node) {
        var backColor = node.style && node.style.backgroundColor;
        if (backColor !== null && backColor !== '' && backColor !== undefined) {
            return backColor;
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isFontSize = function (node, fontSize) {
        var size = node.style && node.style.fontSize;
        if ((size !== null && size !== '' && size !== undefined)
            && (fontSize === null || fontSize === undefined || (fontSize.indexOf(size) > -1))) {
            return size;
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isFontName = function (docElement, node, fontName) {
        var name = node.style && node.style.fontFamily;
        if ((name === null || name === undefined || name === '') && node.nodeType !== 3) {
            name = this.getComputedStyle(docElement, node, 'font-family');
        }
        var index = null;
        if ((name !== null && name !== '' && name !== undefined)
            && (fontName === null || fontName === undefined || (fontName.filter(function (value, pos) {
                var pattern = new RegExp(name, 'i');
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
    };
    ToolbarStatus.isOrderedList = function (node) {
        if (node.nodeName.toLocaleLowerCase() === 'ol') {
            return true;
        }
        else {
            return false;
        }
    };
    ToolbarStatus.isUnorderedList = function (node) {
        if (node.nodeName.toLocaleLowerCase() === 'ul') {
            return true;
        }
        else {
            return false;
        }
    };
    ToolbarStatus.isAlignment = function (node) {
        var align = node.style && node.style.textAlign;
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
    };
    ToolbarStatus.isFormats = function (node, formatNode) {
        if (((formatNode === undefined || formatNode === null)
            && BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) > -1)
            || (formatNode !== null && formatNode !== undefined
                && formatNode.indexOf(node.nodeName.toLocaleLowerCase()) > -1)) {
            return node.nodeName.toLocaleLowerCase();
        }
        else {
            return null;
        }
    };
    ToolbarStatus.getComputedStyle = function (docElement, node, prop) {
        return docElement.defaultView.getComputedStyle(node, null).getPropertyValue(prop);
    };
    return ToolbarStatus;
}());

/**
 * HtmlToolbarStatus module for refresh the toolbar status
 */
var HtmlToolbarStatus = /** @__PURE__ @class */ (function () {
    function HtmlToolbarStatus(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    HtmlToolbarStatus.prototype.addEventListener = function () {
        this.parent.on(toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(destroy, this.removeEventListener, this);
    };
    HtmlToolbarStatus.prototype.removeEventListener = function () {
        this.parent.off(toolbarRefresh, this.onRefreshHandler);
    };
    HtmlToolbarStatus.prototype.onRefreshHandler = function (args) {
        if (this.parent.readonly) {
            return;
        }
        var fontsize = [];
        var fontName = [];
        var formats = [];
        this.parent.fontSize.items.forEach(function (item) { fontsize.push(item.value); });
        this.parent.fontFamily.items.forEach(function (item) { fontName.push(item.value); });
        this.parent.format.types.forEach(function (item) {
            formats.push(item.value.toLocaleLowerCase());
        });
        this.toolbarStatus = ToolbarStatus.get(this.parent.contentModule.getDocument(), this.parent.contentModule.getEditPanel(), formats, fontsize, fontName, args.documentNode);
        this.parent.notify(toolbarUpdated, this.toolbarStatus);
    };
    return HtmlToolbarStatus;
}());

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 * @deprecated
 */
var ContentRender = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for content renderer module
     */
    function ContentRender(parent, serviceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
    }
    /**
     * The function is used to render RichTextEditor content div
     * @hidden
     * @deprecated
     */
    ContentRender.prototype.renderPanel = function () {
        var rteObj = this.parent;
        var div = this.parent.createElement('div', { className: 'e-rte-content', id: this.parent.getID() + 'rte-view' });
        var rteContent = getEditValue(rteObj.value, rteObj);
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
    };
    /**
     * Get the content div element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    ContentRender.prototype.getPanel = function () {
        return this.contentPanel;
    };
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    ContentRender.prototype.getEditPanel = function () {
        return this.editableElement;
    };
    /**
     * Returns the text content as string.
     * @return {string}
     */
    ContentRender.prototype.getText = function () {
        return this.getEditPanel().textContent;
    };
    /**
     * Set the content div element of RichTextEditor
     * @param {Element} panel
     * @hidden
     * @deprecated
     */
    ContentRender.prototype.setPanel = function (panel) {
        this.contentPanel = panel;
    };
    /**
     * Get the document of RichTextEditor
     * @return {Document}
     * @hidden
     * @deprecated
     */
    ContentRender.prototype.getDocument = function () {
        return this.getEditPanel().ownerDocument;
    };
    return ContentRender;
}());

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
/* tslint:disable */
var IFRAMEHEADER = "\n<!DOCTYPE html> \n    <html>\n         <head>\n            <meta charset='utf-8' /> \n            <style>\n                @charset \"UTF-8\";\n                body {\n                    font-family: \"Roboto\", sans-serif;\n                    font-size: 14px;\n                }\n                html, body{height: 100%;margin: 0;}\n                body.e-cursor{cursor:default}\n                span.e-selected-node\t{background-color: #939393;color: white;}\n                span.e-selected-node.e-highlight {background-color: #1d9dd8;}\n                body{color:#333;word-wrap:break-word;padding: 8px;box-sizing: border-box;}\n                .e-rte-image {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}\n                .e-img-caption { display: inline-block; float: none; margin: 5px auto; max-width: 100%;position: relative;}\n                .e-img-caption.e-caption-inline {display: inline-block;float: none;margin: 5px auto;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));position: relativetext-align: center;vertical-align: bottom;}\n                .e-img-inner {box-sizing: border-box;display: block;font-size: 16px;font-weight: initial;margin: auto;opacity: .9;text-align: center;width: 100%;}\n                .e-img-wrap {display: inline-block;margin: auto;padding: 0;text-align: center;width: 100%;}\n                .e-imgleft {float: left;margin: 0 5px 0 0;text-align: left;}\n                .e-imgright {float: right;margin: 0 0 0 5px;text-align: right;}\n                .e-imgcenter {cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}\n                .e-control img:not(.e-resize) {border: 2px solid transparent; z-index: 1000}\n                .e-imginline {display: inline-block;float: none;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));vertical-align: bottom;}\n                .e-imgbreak {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}\n                .e-rte-image.e-img-focus:not(.e-resize) {border: solid 2px #4a90e2;}\n                img::selection { background: transparent;color: transparent;}\n                span.e-rte-imageboxmark {  width: 10px; height: 10px; position: absolute; display: block; background: #4a90e2; border: 1px solid #fff; z-index: 1000;}\n                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }\n                .e-mob-rte span.e-rte-imageboxmark { background: #fff; border: 1px solid #4a90e2; border-radius: 15px; height: 20px; width: 20px; }\n                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }\n                .e-rte-content .e-content img.e-resize { z-index: 1000; }\n                .e-img-caption .e-img-inner { outline: 0; }\n                .e-img-caption .e-rte-image.e-imgright, .e-img-caption .e-rte-image.e-imgleft { float: none; margin: 0;}\n                body{box-sizing: border-box;min-height: 100px;outline: 0 solid transparent;overflow-x: auto;padding: 16px;position: relative;text-align: inherit;z-index: 2;}\n                p{margin: 0 0 10px;margin-bottom: 10px;}\n                li{margin-bottom: 10px;}\n                h1{font-size: 2.17em;font-weight: 400;line-height: 1;margin: 10px 0;}\n                h2{font-size: 1.74em;font-weight: 400;margin: 10px 0;}\n                h3{font-size: 1.31em;font-weight: 400;margin: 10px 0;}\n                h4{font-size: 1em;font-weight: 400;margin: 0;}\n                h5{font-size: 00.8em;font-weight: 400;margin: 0;}\n                h6{font-size: 00.65em;font-weight: 400;margin: 0;}\n                blockquote{margin: 10px 0;margin-left: 0;padding-left: 5px;border-left: solid 2px #5c5c5c;}\n                pre{background-color: inherit;border: 0;border-radius: 0;color: #333;font-size: inherit;line-height: inherit;margin: 0 0 10px;overflow: visible;padding: 0;white-space: pre-wrap;word-break: inherit;word-wrap: break-word;}\n                strong, b{font-weight: 700;}\n                a{text-decoration: none;user-select: auto;}\n                a:hover{text-decoration: underline;};\n                p:last-child, pre:last-child, blockquote:last-child{margin-bottom: 0;}\n                h3+h4, h4+h5, h5+h6{margin-top: 00.6em;}\n                ul:last-child{margin-bottom: 0;}\n                table { border-collapse: collapse; empty-cells: show;}\n                table td,table th {border: 1px solid #BDBDBD; height: 20px; vertical-align: middle;}\n                table.e-alternate-border tbody tr:nth-child(2n) {background-color: #F5F5F5;}\n                table th {background-color: #E0E0E0;}\n                table.e-dashed-border td,table.e-dashed-border th { border: 1px dashed #BDBDBD} \n                table .e-cell-select {border: 1px double #4a90e2;}\n                span.e-table-box { cursor: nwse-resize; display: block; height: 10px; position: absolute; width: 10px; }\n                span.e-table-box.e-rmob {height: 14px;width: 14px;}\n                .e-row-resize, .e-column-resize { background-color: transparent; background-repeat: repeat; bottom: 0;cursor: col-resize;height: 1px;overflow: visible;position: absolute;width: 1px; }\n                .e-row-resize { cursor: row-resize; height: 1px;}\n                .e-table-rhelper { cursor: col-resize; opacity: .87;position: absolute;}\n                .e-table-rhelper.e-column-helper { width: 1px; }\n                .e-table-rhelper.e-row-helper {height: 1px;}\n                .e-reicon::before { border-bottom: 6px solid transparent; border-right: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; position: absolute; right: 4px; top: 4px; width: 20px; }\n                .e-reicon::after { border-bottom: 6px solid transparent; border-left: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; left: 4px; position: absolute; top: 4px; width: 20px; z-index: 3; }\n                .e-row-helper.e-reicon::after { top: 10px; transform: rotate(90deg); }\n                .e-row-helper.e-reicon::before { left: 4px; top: -20px; transform: rotate(90deg); }\n                span.e-table-box { background-color: #ffffff; border: 1px solid #BDBDBD; }\n                span.e-table-box.e-rbox-select { background-color: #BDBDBD; border: 1px solid #BDBDBD; }\n                .e-table-rhelper { background-color: #4a90e2;}\n            </style>\n        </head>";
/* tslint:enable */
/**
 * Content module is used to render RichTextEditor content
 * @hidden
 * @deprecated
 */
var IframeContentRender = /** @__PURE__ @class */ (function (_super) {
    __extends$3(IframeContentRender, _super);
    function IframeContentRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * The function is used to render RichTextEditor iframe
     * @hidden
     * @deprecated
     */
    IframeContentRender.prototype.renderPanel = function () {
        var rteObj = this.parent;
        var rteContent = getEditValue(rteObj.value, rteObj);
        var iFrameBodyContent = '<body spellcheck="false" autocorrect="off" contenteditable="true">' +
            rteContent + '</body></html>';
        var iFrameContent = IFRAMEHEADER + iFrameBodyContent;
        var iframe = this.parent.createElement('iframe', {
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
    };
    IframeContentRender.prototype.setThemeColor = function (content, styles) {
        var fontColor = getComputedStyle(this.parent.element, '.e-richtexteditor').getPropertyValue('color');
        return content.replace(styles.color, fontColor);
    };
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    IframeContentRender.prototype.getEditPanel = function () {
        var editNode;
        if (!isNullOrUndefined(this.contentPanel.contentDocument)) {
            editNode = this.contentPanel.contentDocument.body;
        }
        else {
            editNode = this.parent.inputElement;
        }
        return editNode;
    };
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     * @hidden
     * @deprecated
     */
    IframeContentRender.prototype.getDocument = function () {
        return this.getEditPanel().ownerDocument;
    };
    return IframeContentRender;
}(ContentRender));

/**
 * XhtmlValidation module called when set enableXhtml as true
 */
var XhtmlValidation = /** @__PURE__ @class */ (function () {
    function XhtmlValidation(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    XhtmlValidation.prototype.addEventListener = function () {
        this.parent.on(xhtmlValidation, this.enableXhtmlValidation, this);
    };
    XhtmlValidation.prototype.enableXhtmlValidation = function () {
        if (this.parent.enableXhtml) {
            this.clean(this.parent.inputElement);
            this.AddRootElement();
            this.ImageTags();
            this.removeTags();
            this.RemoveUnsupported();
            this.parent.setProperties({ value: this.parent.inputElement.innerHTML }, true);
        }
    };
    XhtmlValidation.prototype.AddRootElement = function () {
        if ((this.parent.inputElement.childNodes.length === 1 && this.parent.inputElement.firstChild.nodeName !== 'DIV') ||
            this.parent.inputElement.childNodes.length > 1) {
            var parentEle = this.parent.createElement('div');
            while (this.parent.inputElement.childNodes.length > 0) {
                parentEle.appendChild(this.parent.inputElement.childNodes[0]);
            }
            this.parent.inputElement.appendChild(parentEle);
        }
    };
    
    XhtmlValidation.prototype.clean = function (node) {
        for (var n = 0; n < node.childNodes.length; n++) {
            var child = node.childNodes[n];
            if (child.nodeType === 8 || child.nodeName === 'V:IMAGE') {
                node.removeChild(child);
                n--;
            }
            else if (child.nodeType === 1) {
                this.clean(child);
            }
        }
        return this.parent.inputElement.innerHTML;
    };
    XhtmlValidation.prototype.ImageTags = function () {
        var imgNodes = this.parent.inputElement.querySelectorAll('IMG');
        for (var i = imgNodes.length - 1; i >= 0; i--) {
            if (!imgNodes[i].hasAttribute('alt')) {
                var img = imgNodes[i];
                img.setAttribute('alt', '');
            }
        }
    };
    
    XhtmlValidation.prototype.removeTags = function () {
        var removeAttribute = [['br', 'ul'], ['br', 'ol'], ['table', 'span'], ['div', 'span'], ['p', 'span']];
        for (var i = 0; i < removeAttribute.length; i++) {
            this.RemoveElementNode(removeAttribute[i][0], removeAttribute[i][1]);
        }
    };
    
    XhtmlValidation.prototype.RemoveElementNode = function (rmvNode, parentNode) {
        var parentArray = this.parent.inputElement.querySelectorAll(parentNode);
        for (var i = 0; i < parentArray.length; i++) {
            var rmvArray = parentArray[i].querySelectorAll(rmvNode);
            for (var j = rmvArray.length; j > 0; j--) {
                detach(rmvArray[j - 1]);
            }
        }
    };
    
    XhtmlValidation.prototype.RemoveUnsupported = function () {
        var underlineEle = this.parent.inputElement.querySelectorAll('u');
        for (var i = underlineEle.length - 1; i >= 0; i--) {
            var spanEle = this.parent.createElement('span');
            spanEle.style.textDecoration = 'underline';
            spanEle.innerHTML = underlineEle[i].innerHTML;
            underlineEle[i].parentNode.insertBefore(spanEle, underlineEle[i]);
            detach(underlineEle[i]);
        }
        var strongEle = this.parent.inputElement.querySelectorAll('strong');
        for (var i = strongEle.length - 1; i >= 0; i--) {
            var boldEle = this.parent.createElement('b');
            boldEle.innerHTML = strongEle[i].innerHTML;
            strongEle[i].parentNode.insertBefore(boldEle, strongEle[i]);
            detach(strongEle[i]);
        }
        var attrArray = ['language', 'role', 'target', 'contenteditable', 'cellspacing',
            'cellpadding', 'border', 'valign', 'colspan'];
        for (var i = 0; i <= attrArray.length; i++) {
            this.RemoveAttributeByName(attrArray[i]);
        }
    };
    
    XhtmlValidation.prototype.RemoveAttributeByName = function (attrName) {
        if (this.parent.inputElement.firstChild !== null) {
            if (this.parent.inputElement.firstChild.nodeType !== 3) {
                for (var i = 0; i < this.parent.inputElement.childNodes.length; i++) {
                    var ele = this.parent.inputElement.childNodes[i];
                    if (ele.nodeType !== 3 && ele.nodeName !== 'TABLE' && ele.nodeName !== 'TBODY' && ele.nodeName !== 'THEAD' &&
                        ele.nodeName !== 'TH' && ele.nodeName !== 'TR' && ele.nodeName !== 'TD') {
                        if (ele.hasAttribute(attrName)) {
                            ele.removeAttribute(attrName);
                        }
                        if (ele.hasChildNodes()) {
                            for (var j = 0; j < ele.childNodes.length; j++) {
                                var childEle = ele.childNodes[j];
                                if (childEle.nodeType !== 3 && childEle.nodeName !== 'TABLE' && childEle.nodeName !== 'TBODY' &&
                                    childEle.nodeName !== 'THEAD' && childEle.nodeName !== 'TH' && childEle.nodeName !== 'TR' &&
                                    childEle.nodeName !== 'TD' && childEle.hasAttribute(attrName)) {
                                    childEle.removeAttribute(attrName);
                                }
                                if (childEle.hasChildNodes()) {
                                    for (var k = 0; k < childEle.childNodes.length; k++) {
                                        if (childEle.childNodes[k].nodeType !== 3 && childEle.childNodes[k].nodeName !== 'TABLE' &&
                                            childEle.childNodes[k].nodeName !== 'TBODY' && childEle.childNodes[k].nodeName !== 'THEAD' &&
                                            childEle.childNodes[k].nodeName !== 'TH' && childEle.childNodes[k].nodeName !== 'TR'
                                            && childEle.childNodes[k].nodeName !== 'TD'
                                            && childEle.childNodes[k].hasAttribute(attrName)) {
                                            childEle.childNodes[k].removeAttribute(attrName);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    
    return XhtmlValidation;
}());

/**
 * `HtmlEditor` module is used to HTML editor
 */
var HtmlEditor = /** @__PURE__ @class */ (function () {
    function HtmlEditor(parent, serviceLocator) {
        this.rangeCollection = [];
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.xhtmlValidation = new XhtmlValidation(parent);
        this.addEventListener();
    }
    /**
     * Destroys the Markdown.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    HtmlEditor.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     * @deprecated
     */
    HtmlEditor.prototype.sanitizeHelper = function (value) {
        value = sanitizeHelper(value, this.parent);
        return value;
    };
    HtmlEditor.prototype.addEventListener = function () {
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
    };
    HtmlEditor.prototype.updateReadOnly = function () {
        if (this.parent.readonly) {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'false' });
            addClass([this.parent.element], CLS_RTE_READONLY);
        }
        else {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'true' });
            removeClass([this.parent.element], CLS_RTE_READONLY);
        }
    };
    HtmlEditor.prototype.onSelectionSave = function () {
        var currentDocument = this.contentRenderer.getDocument();
        var range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    };
    HtmlEditor.prototype.onSelectionRestore = function (e) {
        this.parent.isBlur = false;
        this.contentRenderer.getEditPanel().focus();
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    };
    HtmlEditor.prototype.onKeyDown = function (e) {
        if (e.args.keyCode === 9 && this.parent.enableTabKey) {
            var range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
            var parentNode = this.nodeSelectionObj.getParentNodeCollection(range);
            if (!((parentNode[0].nodeName === 'LI' || closest(parentNode[0], 'li') ||
                closest(parentNode[0], 'table')) && range.startOffset === 0)) {
                e.args.preventDefault();
                if (!e.args.shiftKey) {
                    InsertHtml.Insert(this.contentRenderer.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.rangeCollection.push(this.nodeSelectionObj.getRange(this.contentRenderer.getDocument()));
                }
                else if (this.rangeCollection.length > 0 &&
                    this.rangeCollection[this.rangeCollection.length - 1].startContainer.textContent.length === 4) {
                    var textCont = this.rangeCollection[this.rangeCollection.length - 1].startContainer;
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
    };
    HtmlEditor.prototype.onPaste = function (e) {
        var regex = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (e.text.match(regex)) {
            e.args.preventDefault();
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            var saveSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            var httpRegex = new RegExp(/([^\S]|^)(((https?\:\/\/)))/gi);
            var wwwRegex = new RegExp(/([^\S]|^)(((www\.))(\S+))/gi);
            var enterSplitText = e.text.split('\n');
            var contentInnerElem = '';
            for (var i = 0; i < enterSplitText.length; i++) {
                if (enterSplitText[i].trim() === '') {
                    contentInnerElem += '<p><br></p>';
                }
                else {
                    var contentWithSpace = '';
                    var spaceBetweenContent = true;
                    var spaceSplit = enterSplitText[i].split(' ');
                    for (var j = 0; j < spaceSplit.length; j++) {
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
            var divElement = this.parent.createElement('div');
            divElement.innerHTML = contentInnerElem;
            var paraElem = divElement.querySelectorAll('p');
            for (var i = 0; i < paraElem.length; i++) {
                var splitTextContent = paraElem[i].innerHTML.split(' ');
                var resultSplitContent = '';
                for (var j = 0; j < splitTextContent.length; j++) {
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
    };
    HtmlEditor.prototype.spaceLink = function (e) {
        var range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
        var selectNodeEle = this.nodeSelectionObj.getParentNodeCollection(range);
        var text = range.startContainer.textContent.substr(0, range.endOffset);
        var splitText = text.split(' ');
        var urlText = splitText[splitText.length - 1];
        var urlTextRange = range.startOffset - (text.length - splitText[splitText.length - 1].length);
        urlText = urlText.slice(0, urlTextRange);
        var regex = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
            var selection = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
            var url = urlText.indexOf('http') > -1 ? urlText : 'http://' + urlText;
            var selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            var value = {
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
    };
    HtmlEditor.prototype.onToolbarClick = function (args) {
        var save;
        var selectNodeEle;
        var selectParentEle;
        var item = args.item;
        var closestElement = closest(args.originalEvent.target, '.e-rte-quick-popup');
        if (closestElement && !closestElement.classList.contains('e-rte-inline-popup')) {
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                if (isIDevice$1() && item.command === 'Images') {
                    this.nodeSelectionObj.restore();
                }
                var range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
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
            var linkDialog = this.parent.element.querySelector('#' + this.parent.getID() + '_rtelink');
            var imageDialog = this.parent.element.querySelector('#' + this.parent.getID() + '_image');
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                var range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
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
    };
    HtmlEditor.prototype.renderColorPicker = function (args) {
        this.colorPickerModule.renderColorPickerInput(args);
    };
    HtmlEditor.prototype.instantiateRenderer = function () {
        if (this.parent.iframeSettings.enable) {
            this.renderFactory.addRenderer(RenderType.Content, new IframeContentRender(this.parent, this.locator));
        }
        else {
            this.renderFactory.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));
        }
    };
    HtmlEditor.prototype.removeEventListener = function () {
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
    };
    HtmlEditor.prototype.render = function () {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        var editElement = this.contentRenderer.getEditPanel();
        var option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.formatter)) {
            var formatterClass = new HTMLFormatter({
                currentDocument: this.contentRenderer.getDocument(),
                element: editElement,
                options: option
            });
            this.parent.setProperties({ formatter: formatterClass }, true);
        }
        else {
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
        if (this.parent.enableXhtml) {
            this.parent.notify(xhtmlValidation, {});
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
        this.parent.notify(bindOnEnd, {});
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    HtmlEditor.prototype.onPropertyChanged = function (e) {
        // On property code change here
        if (!isNullOrUndefined(e.newProp.formatter)) {
            var editElement = this.contentRenderer.getEditPanel();
            var option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
    };
    /**
     * For internal use only - Get the module name.
     */
    HtmlEditor.prototype.getModuleName = function () {
        return 'htmlEditor';
    };
    /**
     * For selecting all content in RTE
     * @private
     */
    HtmlEditor.prototype.selectAll = function () {
        var nodes = getTextNodesUnder(this.parent.contentModule.getDocument(), this.parent.contentModule.getEditPanel());
        if (nodes.length > 0) {
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.parent.contentModule.getDocument(), nodes[0], nodes[nodes.length - 1], 0, nodes[nodes.length - 1].textContent.length);
        }
    };
    /**
     * For selecting all content in RTE
     * @private
     */
    HtmlEditor.prototype.selectRange = function (e) {
        this.parent.formatter.editorManager.nodeSelection.setRange(this.parent.contentModule.getDocument(), e.range);
    };
    /**
     * For get a selected text in RTE
     * @private
     */
    HtmlEditor.prototype.getSelectedHtml = function (e) {
        e.callBack(this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument()).toString());
    };
    return HtmlEditor;
}());

/**
 * PasteCleanup module called when pasting content in RichTextEditor
 */
var PasteCleanup = /** @__PURE__ @class */ (function () {
    function PasteCleanup(parent, serviceLocator) {
        this.inlineNode = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
            'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
            'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
            'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
            'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
        this.blockNode = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
            'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
            'object', 'ol', 'pre', 'td', 'tr', 'th', 'tbody', 'tfoot', 'thead', 'table', 'ul',
            'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
        this.isNotFromHtml = false;
        this.containsHtml = false;
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.i10n = serviceLocator.getService('rteLocale');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
        this.addEventListener();
    }
    PasteCleanup.prototype.addEventListener = function () {
        this.nodeSelectionObj = new NodeSelection();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(pasteClean, this.pasteClean, this);
        this.parent.on(destroy, this.destroy, this);
    };
    PasteCleanup.prototype.destroy = function () {
        this.removeEventListener();
    };
    PasteCleanup.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(pasteClean, this.pasteClean);
        this.parent.off(destroy, this.destroy);
    };
    PasteCleanup.prototype.pasteClean = function (e) {
        var _this = this;
        var args = {
            requestType: 'Paste',
            editorMode: this.parent.editorMode,
            event: e
        };
        var value = null;
        var imageproperties;
        if (e.args && !isNullOrUndefined(e.args.clipboardData)) {
            value = e.args.clipboardData.getData('text/html');
        }
        if (e.args && value !== null && this.parent.editorMode === 'HTML') {
            if (value.length === 0) {
                var htmlRegex = new RegExp(/<\/[a-z][\s\S]*>/i);
                value = e.args.clipboardData.getData('text/plain');
                this.isNotFromHtml = value !== '' ? true : false;
                value = value.replace(/</g, '&lt;');
                value = value.replace(/>/g, '&gt;');
                this.containsHtml = htmlRegex.test(value);
                var file = e && e.args.clipboardData &&
                    e.args.clipboardData.items.length > 0 ?
                    e.args.clipboardData.items[0].getAsFile() : null;
                this.parent.notify(paste, {
                    file: file,
                    args: e.args,
                    text: value,
                    callBack: function (b) {
                        imageproperties = b;
                        if (typeof (imageproperties) === 'object') {
                            _this.parent.formatter.editorManager.execCommand('Images', 'Image', e.args, _this.imageFormatting.bind(_this, args), 'pasteCleanup', imageproperties, 'pasteCleanupModule');
                        }
                        else {
                            value = imageproperties;
                        }
                    }
                });
                if (!htmlRegex.test(value)) {
                    var divElement = this.parent.createElement('div');
                    divElement.innerHTML = this.splitBreakLine(value);
                    value = divElement.innerHTML;
                }
            }
            else if (value.length > 0) {
                this.parent.formatter.editorManager.observer.notify(MS_WORD_CLEANUP, {
                    args: e.args,
                    text: e.text,
                    allowedStylePropertiesArray: this.parent.pasteCleanupSettings.allowedStyleProps,
                    callBack: function (a) {
                        value = a;
                    }
                });
            }
            this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
            var currentDocument = this.contentRenderer.getDocument();
            var range = this.nodeSelectionObj.getRange(currentDocument);
            this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
            if (this.parent.pasteCleanupSettings.prompt) {
                e.args.preventDefault();
                var tempDivElem = this.parent.createElement('div');
                tempDivElem.innerHTML = value;
                if (tempDivElem.textContent !== '' || !isNullOrUndefined(tempDivElem.querySelector('img')) ||
                    !isNullOrUndefined(tempDivElem.querySelector('table'))) {
                    this.pasteDialog(value, args);
                }
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
    };
    PasteCleanup.prototype.splitBreakLine = function (value) {
        var enterSplitText = value.split('\n');
        var contentInnerElem = '';
        for (var i = 0; i < enterSplitText.length; i++) {
            if (enterSplitText[i].trim() === '') {
                contentInnerElem += '<p><br></p>';
            }
            else {
                var contentWithSpace = this.makeSpace(enterSplitText[i]);
                contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
            }
        }
        return contentInnerElem;
    };
    PasteCleanup.prototype.makeSpace = function (enterSplitText) {
        var contentWithSpace = '';
        var spaceBetweenContent = true;
        var spaceSplit = enterSplitText.split(' ');
        for (var j = 0; j < spaceSplit.length; j++) {
            if (spaceSplit[j].trim() === '') {
                contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
            }
            else {
                spaceBetweenContent = false;
                contentWithSpace += spaceSplit[j] + ' ';
            }
        }
        return contentWithSpace;
    };
    PasteCleanup.prototype.imgUploading = function (elm) {
        var allImgElm = elm.querySelector('#' + this.parent.getID() + '_pasteContent').querySelectorAll('img');
        if (this.parent.insertImageSettings.saveUrl && allImgElm.length > 0) {
            var base64Src = [];
            var imgName = [];
            var uploadImg = [];
            for (var i = 0; i < allImgElm.length; i++) {
                if (allImgElm[i].getAttribute('src').split(',')[0].indexOf('base64') >= 0) {
                    base64Src.push(allImgElm[i].getAttribute('src'));
                    imgName.push(getUniqueID('rte_image'));
                    uploadImg.push(allImgElm[i]);
                }
            }
            var fileList = [];
            for (var i = 0; i < base64Src.length; i++) {
                fileList.push(this.base64ToFile(base64Src[i], imgName[i]));
            }
            for (var i = 0; i < fileList.length; i++) {
                this.uploadMethod(fileList[i], uploadImg[i]);
            }
            if (isNullOrUndefined(this.parent.insertImageSettings.path) &&
                this.parent.insertImageSettings.saveFormat === 'Blob') {
                this.getBlob(allImgElm);
            }
        }
        else if (this.parent.insertImageSettings.saveFormat === 'Blob') {
            this.getBlob(allImgElm);
        }
        elm.querySelector('#' + this.parent.getID() + '_pasteContent').removeAttribute('id');
    };
    PasteCleanup.prototype.getBlob = function (allImgElm) {
        for (var i = 0; i < allImgElm.length; i++) {
            if (!isNullOrUndefined(allImgElm[i].getAttribute('src')) &&
                allImgElm[i].getAttribute('src').split(',')[0].indexOf('base64') >= 0) {
                var blopUrl = URL.createObjectURL(convertToBlob(allImgElm[i].getAttribute('src')));
                allImgElm[i].setAttribute('src', blopUrl);
            }
        }
    };
    PasteCleanup.prototype.uploadMethod = function (fileList, imgElem) {
        var _this = this;
        var uploadEle = document.createElement('div');
        document.body.appendChild(uploadEle);
        uploadEle.setAttribute('display', 'none');
        imgElem.style.opacity = '0.5';
        var popupEle = this.parent.createElement('div');
        this.parent.element.appendChild(popupEle);
        var contentEle = this.parent.createElement('input', {
            id: this.parent.element.id + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        var offsetY = this.parent.iframeSettings.enable ? -50 : -90;
        var popupObj = new Popup(popupEle, {
            relateTo: imgElem,
            height: '85px',
            width: '300px',
            offsetY: offsetY,
            content: contentEle,
            viewPortElement: this.parent.element,
            position: { X: 'center', Y: 'top' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: function (event) {
                _this.parent.isBlur = false;
                popupObj.destroy();
                detach(popupObj.element);
            }
        });
        popupObj.element.style.display = 'none';
        addClass([popupObj.element], [CLS_POPUP_OPEN, CLS_RTE_UPLOAD_POPUP]);
        var timeOut = fileList.size > 1000000 ? 300 : 100;
        setTimeout(function () { _this.refreshPopup(imgElem, popupObj); }, timeOut);
        var uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl
            },
            cssClass: CLS_RTE_DIALOG_UPLOAD,
            dropArea: this.parent.inputElement,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            success: function (e) {
                setTimeout(function () { _this.popupClose(popupObj, uploadObj, imgElem, e); }, 900);
            },
            failure: function (e) {
                if (popupObj) {
                    popupObj.close();
                }
                _this.parent.trigger(imageUploadFailed, e);
            }
        });
        uploadObj.appendTo(popupObj.element.childNodes[0]);
        /* tslint:disable */
        var fileData = [{
                name: fileList.name,
                rawFile: fileList,
                size: fileList.size,
                type: fileList.type,
                validationMessages: { minSize: "", maxSize: "" },
                statusCode: '1'
            }];
        uploadObj.createFileList(fileData);
        uploadObj.filesData.push(fileData[0]);
        /* tslint:enable */
        uploadObj.upload(fileData);
        popupObj.element.getElementsByClassName('e-file-select-wrap')[0].style.display = 'none';
        detach(popupObj.element.querySelector('.e-rte-dialog-upload .e-file-select-wrap'));
    };
    PasteCleanup.prototype.popupClose = function (popupObj, uploadObj, imgElem, e) {
        var _this = this;
        this.parent.trigger(imageUploadSuccess, e, function (e) {
            if (!isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                var url = _this.parent.insertImageSettings.path + e.file.name + '.' +
                    e.file.type.split('image/')[1];
                imgElem.src = url;
                imgElem.setAttribute('alt', e.file.name);
            }
        });
        popupObj.close();
        imgElem.style.opacity = '1';
        uploadObj.destroy();
    };
    PasteCleanup.prototype.refreshPopup = function (imageElement, popupObj) {
        var imgPosition = this.parent.iframeSettings.enable ? this.parent.element.offsetTop +
            imageElement.offsetTop : imageElement.offsetTop;
        var rtePosition = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            popupObj.relateTo = this.parent.inputElement;
            popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            popupObj.element.style.display = 'block';
        }
        else {
            if (popupObj) {
                popupObj.refreshPosition(imageElement);
                popupObj.element.style.display = 'block';
            }
        }
    };
    PasteCleanup.prototype.base64ToFile = function (base64, filename) {
        var baseStr = base64.split(',');
        var typeStr = baseStr[0].match(/:(.*?);/)[1];
        var decodeStr = atob(baseStr[1]);
        var strLen = decodeStr.length;
        var decodeArr = new Uint8Array(strLen);
        while (strLen--) {
            decodeArr[strLen] = decodeStr.charCodeAt(strLen);
        }
        return new File([decodeArr], filename, { type: typeStr });
    };
    /**
     * Method for image formatting when pasting
     * @hidden
     * @deprecated
     */
    PasteCleanup.prototype.imageFormatting = function (pasteArgs, imgElement) {
        var imageElement = this.parent.createElement('span');
        imageElement.appendChild(imgElement.elements[0]);
        var imageValue = imageElement.innerHTML;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        var currentDocument = this.contentRenderer.getDocument();
        var range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        if (this.parent.pasteCleanupSettings.prompt) {
            this.pasteDialog(imageValue, pasteArgs);
        }
        else if (this.parent.pasteCleanupSettings.plainText) {
            this.plainFormatting(imageValue, pasteArgs);
        }
        else if (this.parent.pasteCleanupSettings.keepFormat) {
            this.formatting(imageValue, false, pasteArgs);
        }
        else {
            this.formatting(imageValue, true, pasteArgs);
        }
    };
    PasteCleanup.prototype.radioRender = function () {
        var keepRadioButton = new RadioButton({ label: this.i10n.getConstant('keepFormat'), name: 'pasteOption', checked: true });
        keepRadioButton.isStringTemplate = true;
        var keepFormatElement = this.parent.element.querySelector('#keepFormating');
        keepRadioButton.appendTo(keepFormatElement);
        var cleanRadioButton = new RadioButton({ label: this.i10n.getConstant('cleanFormat'), name: 'pasteOption' });
        cleanRadioButton.isStringTemplate = true;
        var cleanFormatElement = this.parent.element.querySelector('#cleanFormat');
        cleanRadioButton.appendTo(cleanFormatElement);
        var plainTextRadioButton = new RadioButton({ label: this.i10n.getConstant('plainText'), name: 'pasteOption' });
        plainTextRadioButton.isStringTemplate = true;
        var plainTextElement = this.parent.element.querySelector('#plainTextFormat');
        plainTextRadioButton.appendTo(plainTextElement);
    };
    PasteCleanup.prototype.selectFormatting = function (value, args, keepChecked, cleanChecked) {
        if (keepChecked) {
            this.formatting(value, false, args);
        }
        else if (cleanChecked) {
            this.formatting(value, true, args);
        }
        else {
            this.plainFormatting(value, args);
        }
    };
    PasteCleanup.prototype.pasteDialog = function (value, args) {
        var _this = this;
        var dialogModel = {
            buttons: [
                {
                    click: function () {
                        if (!dialog.isDestroyed) {
                            var keepChecked = _this.parent.element.querySelector('#keepFormating').checked;
                            var cleanChecked = _this.parent.element.querySelector('#cleanFormat').checked;
                            dialog.hide();
                            var argument = isBlazor() ? null : dialog;
                            _this.dialogRenderObj.close(argument);
                            dialog.destroy();
                            _this.selectFormatting(value, args, keepChecked, cleanChecked);
                        }
                    },
                    buttonModel: {
                        isPrimary: true,
                        cssClass: 'e-flat ' + CLS_RTE_PASTE_OK,
                        content: this.i10n.getConstant('pasteDialogOk')
                    }
                },
                {
                    click: function () {
                        if (!dialog.isDestroyed) {
                            dialog.hide();
                            var args_1 = isBlazor() ? null : dialog;
                            _this.dialogRenderObj.close(args_1);
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
        var dialog = this.dialogRenderObj.render(dialogModel);
        var rteDialogWrapper = this.parent.element.querySelector('#' + this.parent.getID()
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
    };
    PasteCleanup.prototype.destroyDialog = function (rteDialogWrapper) {
        var rteDialogContainer = this.parent.element.querySelector('.e-dlg-container');
        detach(rteDialogContainer);
        var rteDialogWrapperChildLength = rteDialogWrapper.children.length;
        for (var i = 0; i < rteDialogWrapperChildLength; i++) {
            detach(rteDialogWrapper.children[0]);
        }
    };
    PasteCleanup.prototype.formatting = function (value, clean, args) {
        var _this = this;
        var clipBoardElem = this.parent.createElement('div', { className: 'pasteContent', styles: 'display:inline;' });
        if (this.isNotFromHtml && this.containsHtml) {
            value = this.splitBreakLine(value);
        }
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
        clipBoardElem.innerHTML = this.sanitizeHelper(clipBoardElem.innerHTML);
        clipBoardElem.setAttribute('id', this.parent.getID() + '_pasteContent');
        if (clipBoardElem.textContent !== '' || !isNullOrUndefined(clipBoardElem.querySelector('img')) ||
            !isNullOrUndefined(clipBoardElem.querySelector('table'))) {
            this.parent.formatter.editorManager.execCommand('inserthtml', 'pasteCleanup', args, function (returnArgs) {
                extend(args, { elements: [returnArgs.elements] }, true);
                _this.parent.formatter.onSuccess(_this.parent, args);
            }, clipBoardElem);
            this.parent.notify(toolbarRefresh, {});
            this.imgUploading(this.parent.inputElement);
        }
    };
    PasteCleanup.prototype.sanitizeHelper = function (value) {
        value = sanitizeHelper(value, this.parent);
        return value;
    };
    //Plain Formatting
    PasteCleanup.prototype.plainFormatting = function (value, args) {
        var _this = this;
        var clipBoardElem = this.parent.createElement('div', { className: 'pasteContent', styles: 'display:inline;' });
        clipBoardElem.innerHTML = value;
        this.detachInlineElements(clipBoardElem);
        this.getTextContent(clipBoardElem);
        if (clipBoardElem.textContent.trim() !== '') {
            if (!isNullOrUndefined(clipBoardElem.firstElementChild) && clipBoardElem.firstElementChild.tagName !== 'BR') {
                var firstElm = clipBoardElem.firstElementChild;
                if (!isNullOrUndefined(clipBoardElem.firstElementChild)) {
                    var spanElm = this.parent.createElement('span');
                    for (var i = 0, j = 0; i < firstElm.childNodes.length; i++, j++) {
                        if (firstElm.childNodes[i].nodeName === '#text') {
                            spanElm.appendChild(firstElm.childNodes[i]);
                            clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
                            i--;
                        }
                        else if (firstElm.childNodes[i].nodeName !== '#text' && j === 0) {
                            for (var k = 0; k < firstElm.childNodes[i].childNodes.length; k++) {
                                spanElm.appendChild(firstElm.childNodes[i].childNodes[k]);
                                clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
                                k--;
                            }
                            i--;
                        }
                        else {
                            break;
                        }
                    }
                    if (!firstElm.hasChildNodes()) {
                        detach(firstElm);
                    }
                }
            }
            this.removeEmptyElements(clipBoardElem);
            this.saveSelection.restore();
            clipBoardElem.innerHTML = this.sanitizeHelper(clipBoardElem.innerHTML);
            this.parent.formatter.editorManager.execCommand('inserthtml', 'pasteCleanup', args, function (returnArgs) {
                extend(args, { elements: [] }, true);
                _this.parent.formatter.onSuccess(_this.parent, args);
            }, clipBoardElem);
        }
        else {
            this.saveSelection.restore();
            extend(args, { elements: [] }, true);
            this.parent.formatter.onSuccess(this.parent, args);
        }
    };
    PasteCleanup.prototype.getTextContent = function (clipBoardElem) {
        for (var i = 0; i < this.blockNode.length; i++) {
            var inElem = clipBoardElem.querySelectorAll(this.blockNode[i]);
            for (var j = 0; j < inElem.length; j++) {
                var parElem = void 0;
                for (var k = 0, l = 0, preNode = void 0; k < inElem[j].childNodes.length; k++, l++) {
                    if (inElem[j].childNodes[k].nodeName === 'DIV' || inElem[j].childNodes[k].nodeName === 'P' ||
                        (inElem[j].childNodes[k].nodeName === '#text' && (inElem[j].childNodes[k].nodeValue.replace(/\u00a0/g, '&nbsp;') !== '&nbsp;') &&
                            inElem[j].childNodes[k].textContent.trim() === '')) {
                        parElem = inElem[j].childNodes[k].parentElement;
                        inElem[j].childNodes[k].parentElement.parentElement.insertBefore(inElem[j].childNodes[k], inElem[j].childNodes[k].parentElement);
                        k--;
                    }
                    else {
                        parElem = inElem[j].childNodes[k].parentElement;
                        if (preNode === 'text') {
                            var previousElem = parElem.previousElementSibling;
                            previousElem.appendChild(inElem[j].childNodes[k]);
                        }
                        else {
                            var divElement = this.parent.createElement('div', { id: 'newDiv' });
                            divElement.appendChild(inElem[j].childNodes[k]);
                            parElem.parentElement.insertBefore(divElement, parElem);
                        }
                        k--;
                        preNode = 'text';
                    }
                }
                if (!isNullOrUndefined(parElem)) {
                    detach(parElem);
                }
            }
        }
        var allElems = clipBoardElem.querySelectorAll('*');
        for (var i = 0; i < allElems.length; i++) {
            var allAtr = allElems[i].attributes;
            for (var j = 0; j < allAtr.length; j++) {
                allElems[i].removeAttribute(allAtr[j].name);
                j--;
            }
        }
    };
    PasteCleanup.prototype.detachInlineElements = function (clipBoardElem) {
        for (var i = 0; i < this.inlineNode.length; i++) {
            var inElem = clipBoardElem.querySelectorAll(this.inlineNode[i]);
            for (var j = 0; j < inElem.length; j++) {
                var parElem = void 0;
                for (var k = 0; k < inElem[j].childNodes.length; k++) {
                    parElem = inElem[j].childNodes[k].parentElement;
                    inElem[j].childNodes[k].parentElement.parentElement.insertBefore(inElem[j].childNodes[k], inElem[j].childNodes[k].parentElement);
                    k--;
                }
                if (!isNullOrUndefined(parElem)) {
                    detach(parElem);
                }
            }
        }
    };
    PasteCleanup.prototype.findDetachEmptyElem = function (element) {
        var removableElement;
        if (!isNullOrUndefined(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' &&
                element.parentElement.getAttribute('class') !== 'pasteContent') {
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
    };
    PasteCleanup.prototype.removeEmptyElements = function (element) {
        var emptyElements = element.querySelectorAll(':empty');
        for (var i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'BR') {
                var detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNullOrUndefined(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    };
    //GroupingTags
    PasteCleanup.prototype.tagGrouping = function (deniedTags) {
        var groupingTags = deniedTags.slice();
        var keys = Object.keys(pasteCleanupGroupingTags);
        var values = keys.map(function (key) { return pasteCleanupGroupingTags[key]; });
        var addTags = [];
        for (var i = 0; i < groupingTags.length; i++) {
            //The value split using '[' because to reterive the tag name from the user given format which may contain tag with attributes
            if (groupingTags[i].split('[').length > 1) {
                groupingTags[i] = groupingTags[i].split('[')[0].trim();
            }
            if (keys.indexOf(groupingTags[i]) > -1) {
                for (var j = 0; j < values[keys.indexOf(groupingTags[i])].length; j++) {
                    if (groupingTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0 &&
                        addTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0) {
                        addTags.push(values[keys.indexOf(groupingTags[i])][j]);
                    }
                }
            }
        }
        return deniedTags = deniedTags.concat(addTags);
    };
    //Filter Attributes in Denied Tags
    PasteCleanup.prototype.attributesfilter = function (deniedTags) {
        for (var i = 0; i < deniedTags.length; i++) {
            if (deniedTags[i].split('[').length > 1) {
                var userAttributes = deniedTags[i].split('[')[1].split(']')[0].split(',');
                var allowedAttributeArray = [];
                var deniedAttributeArray = [];
                for (var j = 0; j < userAttributes.length; j++) {
                    userAttributes[j].indexOf('!') < 0 ? allowedAttributeArray.push(userAttributes[j].trim())
                        : deniedAttributeArray.push(userAttributes[j].split('!')[1].trim());
                }
                var allowedAttribute = allowedAttributeArray.length > 1 ?
                    (allowedAttributeArray.join('][')) : (allowedAttributeArray.join());
                var deniedAttribute = deniedAttributeArray.length > 1 ? deniedAttributeArray.join('][') : (deniedAttributeArray.join());
                if (deniedAttribute.length > 0) {
                    var select$$1 = allowedAttribute !== '' ? deniedTags[i].split('[')[0] +
                        '[' + allowedAttribute + ']' : deniedTags[i].split('[')[0];
                    deniedTags[i] = select$$1 + ':not([' + deniedAttribute + '])';
                }
                else {
                    deniedTags[i] = deniedTags[i].split('[')[0] + '[' + allowedAttribute + ']';
                }
            }
        }
        return deniedTags;
    };
    //Denied Tags
    PasteCleanup.prototype.deniedTags = function (clipBoardElem) {
        var deniedTags = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedTags) ? [] : this.parent.pasteCleanupSettings.deniedTags.slice();
        deniedTags = this.attributesfilter(deniedTags);
        deniedTags = this.tagGrouping(deniedTags);
        for (var i = 0; i < deniedTags.length; i++) {
            var removableElement = clipBoardElem.querySelectorAll(deniedTags[i]);
            for (var j = removableElement.length - 1; j >= 0; j--) {
                var parentElem = removableElement[j].parentNode;
                while (removableElement[j].firstChild) {
                    parentElem.insertBefore(removableElement[j].firstChild, removableElement[j]);
                }
                parentElem.removeChild(removableElement[j]);
            }
        }
        return clipBoardElem;
    };
    //Denied Attributes
    PasteCleanup.prototype.deniedAttributes = function (clipBoardElem, clean) {
        var deniedAttrs = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedAttrs) ? [] : this.parent.pasteCleanupSettings.deniedAttrs.slice();
        if (clean) {
            deniedAttrs.push('style');
        }
        for (var i = 0; i < deniedAttrs.length; i++) {
            var removableAttrElement = clipBoardElem.
                querySelectorAll('[' + deniedAttrs[i] + ']');
            for (var j = 0; j < removableAttrElement.length; j++) {
                removableAttrElement[j].removeAttribute(deniedAttrs[i]);
            }
        }
        return clipBoardElem;
    };
    //Allowed Style Properties
    PasteCleanup.prototype.allowedStyle = function (clipBoardElem) {
        var allowedStyleProps = isNullOrUndefined(this.parent.pasteCleanupSettings.allowedStyleProps) ? [] : this.parent.pasteCleanupSettings.allowedStyleProps.slice();
        allowedStyleProps.push('list-style-type', 'list-style');
        var styleElement = clipBoardElem.querySelectorAll('[style]');
        for (var i = 0; i < styleElement.length; i++) {
            var allowedStyleValue = '';
            var allowedStyleValueArray = [];
            var styleValue = styleElement[i].getAttribute('style').split(';');
            for (var k = 0; k < styleValue.length; k++) {
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
    };
    /**
     * For internal use only - Get the module name.
     */
    PasteCleanup.prototype.getModuleName = function () {
        return 'pasteCleanup';
    };
    return PasteCleanup;
}());

/**
 * `Resize` module is used to resize the editor
 */
var Resize = /** @__PURE__ @class */ (function () {
    function Resize(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Resize.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initialEnd, this.renderResizable, this);
        this.parent.on(destroy, this.destroy, this);
    };
    Resize.prototype.renderResizable = function () {
        this.resizer = this.parent.createElement('div', {
            id: this.parent.getID() + '-resizable', className: 'e-icons'
                + ' ' + CLS_RTE_RES_HANDLE + ' ' + CLS_RTE_RES_EAST
        });
        this.parent.element.classList.add(CLS_RTE_RES_CNT);
        this.parent.element.appendChild(this.resizer);
        this.touchStartEvent = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
        EventHandler.add(this.resizer, 'mousedown', this.resizeStart, this);
        EventHandler.add(this.resizer, this.touchStartEvent, this.resizeStart, this);
    };
    Resize.prototype.resizeStart = function (e) {
        var _this = this;
        if (e.cancelable) {
            e.preventDefault();
        }
        this.wireResizeEvents();
        var args = isBlazor() ? { requestType: 'editor' } : { event: e, requestType: 'editor' };
        this.parent.trigger(resizeStart, args, function (resizeStartArgs) {
            if (resizeStartArgs.cancel) {
                _this.unwireResizeEvents();
            }
        });
    };
    Resize.prototype.performResize = function (e) {
        var _this = this;
        var args = isBlazor() ? { requestType: 'editor' } : { event: e, requestType: 'editor' };
        this.parent.trigger(onResize, args, function (resizingArgs) {
            if (resizingArgs.cancel) {
                _this.unwireResizeEvents();
            }
        });
        var boundRect = this.parent.element.getBoundingClientRect();
        if (this.isMouseEvent(e)) {
            this.parent.element.style.height = e.clientY - boundRect.top + 'px';
            this.parent.element.style.width = e.clientX - boundRect.left + 'px';
        }
        else {
            var eventType = Browser.info.name !== 'msie' ? e.touches[0] : e;
            this.parent.element.style.height = eventType.clientY - boundRect.top + 'px';
            this.parent.element.style.width = eventType.clientX - boundRect.left + 'px';
        }
        this.parent.refreshUI();
    };
    Resize.prototype.stopResize = function (e) {
        this.parent.refreshUI();
        this.unwireResizeEvents();
        var args = isBlazor() ? { requestType: 'editor' } : { event: e, requestType: 'editor' };
        this.parent.trigger(resizeStop, args);
    };
    Resize.prototype.getEventType = function (e) {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    };
    Resize.prototype.isMouseEvent = function (e) {
        var isMouse = false;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined(e.pointerType) &&
            this.getEventType(e.pointerType) === 'mouse')) {
            isMouse = true;
        }
        return isMouse;
    };
    Resize.prototype.wireResizeEvents = function () {
        EventHandler.add(document, 'mousemove', this.performResize, this);
        EventHandler.add(document, 'mouseup', this.stopResize, this);
        this.touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        this.touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.add(document, this.touchMoveEvent, this.performResize, this);
        EventHandler.add(document, this.touchEndEvent, this.stopResize, this);
    };
    Resize.prototype.unwireResizeEvents = function () {
        EventHandler.remove(document, 'mousemove', this.performResize);
        EventHandler.remove(document, 'mouseup', this.stopResize);
        EventHandler.remove(document, this.touchMoveEvent, this.performResize);
        EventHandler.remove(document, this.touchEndEvent, this.stopResize);
    };
    Resize.prototype.destroy = function () {
        this.removeEventListener();
    };
    Resize.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialEnd, this.renderResizable);
        this.parent.element.classList.remove(CLS_RTE_RES_CNT);
        EventHandler.remove(this.resizer, 'mousedown', this.resizeStart);
        EventHandler.remove(this.resizer, this.touchStartEvent, this.resizeStart);
        if (this.resizer) {
            detach(this.resizer);
        }
        this.parent.off(destroy, this.destroy);
    };
    /**
     * For internal use only - Get the module name.
     */
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    return Resize;
}());

/**
 * `FullScreen` module is used to maximize and minimize screen
 */
var FullScreen = /** @__PURE__ @class */ (function () {
    function FullScreen(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * showFullScreen method
     * @hidden
     * @deprecated
     */
    FullScreen.prototype.showFullScreen = function (event) {
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
    };
    /**
     * hideFullScreen method
     * @hidden
     * @deprecated
     */
    FullScreen.prototype.hideFullScreen = function (event) {
        if (this.parent.toolbarSettings.enable === true && this.parent.editorMode !== 'Markdown') {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        if (this.parent.element.classList.contains(CLS_FULL_SCREEN)) {
            this.parent.element.classList.remove(CLS_FULL_SCREEN);
            var elem = document.querySelectorAll('.e-rte-overflow');
            for (var i = 0; i < elem.length; i++) {
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
    };
    FullScreen.prototype.toggleParentOverflow = function (isAdd) {
        if (isNullOrUndefined(this.scrollableParent)) {
            return;
        }
        for (var i = 0; i < this.scrollableParent.length; i++) {
            if (this.scrollableParent[i].nodeName === '#document') {
                var elem = document.querySelector('body');
                addClass([elem], ['e-rte-overflow']);
            }
            else {
                var elem = this.scrollableParent[i];
                addClass([elem], ['e-rte-overflow']);
            }
        }
    };
    FullScreen.prototype.onKeyDown = function (event) {
        var originalEvent = event.args;
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
    };
    FullScreen.prototype.addEventListener = function () {
        this.parent.on(keyDown, this.onKeyDown, this);
        this.parent.on(destroy, this.destroy, this);
    };
    FullScreen.prototype.removeEventListener = function () {
        this.parent.off(keyDown, this.onKeyDown);
        this.parent.off(destroy, this.destroy);
    };
    /**
     * destroy method
     * @hidden
     * @deprecated
     */
    FullScreen.prototype.destroy = function () {
        if (this.parent.element.classList.contains(CLS_FULL_SCREEN)) {
            this.toggleParentOverflow(false);
        }
        var elem = document.querySelectorAll('.e-rte-overflow');
        for (var i = 0; i < elem.length; i++) {
            removeClass([elem[i]], ['e-rte-overflow']);
        }
        this.removeEventListener();
    };
    return FullScreen;
}());

function setAttributes(htmlAttributes, rte, isFrame, initial) {
    var target;
    if (isFrame) {
        var iFrame = rte.contentModule.getDocument();
        target = iFrame.querySelector('body');
    }
    else {
        target = rte.element;
    }
    if (Object.keys(htmlAttributes).length) {
        for (var _i = 0, _a = Object.keys(htmlAttributes); _i < _a.length; _i++) {
            var htmlAttr = _a[_i];
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
                var validateAttr = ['name', 'required'];
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
 * Action export
 */

/**
 * Formatter
 */

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 * @deprecated
 */
var Render = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for render module
     */
    function Render(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.renderer = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    /**
     * To initialize RichTextEditor header, content and footer rendering
     * @hidden
     * @deprecated
     */
    Render.prototype.render = function () {
        var rteObj = this.parent;
        this.contentRenderer = this.renderer.getRenderer(RenderType.Content);
        this.contentRenderer.renderPanel();
    };
    /**
     * Refresh the entire RichTextEditor.
     * @return {void}
     */
    Render.prototype.refresh = function (e) {
        if (e === void 0) { e = { requestType: 'refresh' }; }
        this.parent.notify(e.requestType + "-begin", e);
    };
    /**
     * Destroy the entire RichTextEditor.
     * @return {void}
     */
    Render.prototype.destroy = function () {
        this.removeEventListener();
    };
    Render.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(modelChanged, this.refresh, this);
        this.parent.on(keyUp, this.keyUp, this);
    };
    Render.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(modelChanged, this.refresh);
        this.parent.off(keyUp, this.keyUp);
    };
    Render.prototype.keyUp = function (e) {
        if (this.parent.editorMode === 'HTML') {
            switch (e.args.which) {
                case 46:
                case 8:
                    var childNodes = this.parent.contentModule.getEditPanel().childNodes;
                    if ((childNodes.length === 0) ||
                        (childNodes.length === 1 && ((childNodes[0].tagName === 'BR') ||
                            (childNodes[0].tagName === 'P' &&
                                (childNodes[0].childNodes.length === 0 || childNodes[0].textContent === ''))))) {
                        var node = this.parent.contentModule.getEditPanel();
                        node.innerHTML = '<p><br/></p>';
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.contentModule.getDocument(), node.childNodes[0], 0);
                    }
                    break;
            }
        }
    };
    return Render;
}());

/**
 * `Link` module is used to handle undo actions.
 */
var Link = /** @__PURE__ @class */ (function () {
    function Link(parent, serviceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService('rteLocale');
        this.addEventListener();
        this.serviceLocator = serviceLocator;
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
    }
    Link.prototype.addEventListener = function () {
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
    };
    Link.prototype.onToolbarAction = function (args) {
        var item = args.args.item;
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
    };
    Link.prototype.removeEventListener = function () {
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
    };
    Link.prototype.onIframeMouseDown = function () {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
        }
    };
    Link.prototype.showLinkQuickToolbar = function (e) {
        if (e.args.action !== 'enter' && e.args.action !== 'space') {
            var pageX = void 0;
            var pageY = void 0;
            if (e.type !== 'Links' || isNullOrUndefined(this.parent.quickToolbarModule) ||
                isNullOrUndefined(this.parent.quickToolbarModule.linkQTBar)) {
                return;
            }
            this.quickToolObj = this.parent.quickToolbarModule;
            var parentTop = this.parent.element.getBoundingClientRect().top;
            var parentLeft = this.parent.element.getBoundingClientRect().left;
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            var target_1;
            [].forEach.call(e.elements, function (element, index) {
                if (index === 0) {
                    target_1 = ((element.nodeName === '#text') ? (element.parentNode) : element);
                }
            });
            if (e.isNotify) {
                var tbElement = this.parent.toolbarModule.getToolbarElement();
                var linkTop = target_1.getBoundingClientRect().top;
                var linkLeft = target_1.getBoundingClientRect().left;
                var linkPos = linkTop - parentTop;
                var tbHeight = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
                pageX = (this.parent.iframeSettings.enable) ? parentLeft + linkLeft : target_1.getBoundingClientRect().left;
                pageY = window.pageYOffset + ((this.parent.iframeSettings.enable) ?
                    (parentTop + tbHeight + linkTop) : (parentTop + linkPos));
            }
            else {
                var args = void 0;
                args = e.args.touches ? e.args.changedTouches[0] : args = e.args;
                pageX = (this.parent.iframeSettings.enable) ? window.pageXOffset + parentLeft + args.clientX : args.pageX;
                pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset + parentTop + args.clientY : args.pageY;
            }
            if (this.quickToolObj.linkQTBar) {
                this.quickToolObj.linkQTBar.showPopup(pageX, pageY, range.endContainer);
            }
        }
    };
    Link.prototype.hideLinkQuickToolbar = function () {
        if (this.quickToolObj && this.quickToolObj.linkQTBar && document.body.contains(this.quickToolObj.linkQTBar.element)) {
            this.quickToolObj.linkQTBar.hidePopup();
        }
    };
    Link.prototype.editAreaClickHandler = function (e) {
        if (this.parent.readonly) {
            this.hideLinkQuickToolbar();
            return;
        }
        var args = e.args;
        var showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.linkQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            var target = args.target;
            target = this.getAnchorNode(target);
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            var isPopupOpen = this.quickToolObj.linkQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'A' && (target.childNodes.length > 0 && target.childNodes[0].nodeName !== 'IMG') &&
                e.args.target.nodeName !== 'IMG') {
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
    };
    Link.prototype.onKeyDown = function (event) {
        var originalEvent = event.args;
        switch (originalEvent.action) {
            case 'escape':
                if (!isNullOrUndefined(this.dialogObj)) {
                    this.dialogObj.close();
                }
                break;
            case 'insert-link':
                if (this.parent.editorMode === 'HTML') {
                    var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
                    var save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
                    var selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
                    var selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
                    var eventArgs = {
                        args: event.args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    };
                    this.linkDialog(eventArgs);
                }
                else {
                    var textArea = this.parent.contentModule.getEditPanel();
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
    };
    Link.prototype.linkDialog = function (e, inputDetails) {
        var _this = this;
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
        var selectText;
        var linkWebAddress = this.i10n.getConstant('linkWebUrl');
        var linkDisplayText = this.i10n.getConstant('linkText');
        var linkTooltip = this.i10n.getConstant('linkTooltipLabel');
        var urlPlace = this.i10n.getConstant('linkurl');
        var textPlace = this.i10n.getConstant('textPlaceholder');
        var title = this.i10n.getConstant('linkTitle');
        var linkDialogEle = this.parent.createElement('div', { className: 'e-rte-link-dialog', id: this.rteID + '_rtelink' });
        this.parent.element.appendChild(linkDialogEle);
        var linkContent = this.parent.createElement('div', {
            className: 'e-rte-linkcontent', id: this.rteID + '_linkContent'
        });
        var htmlTextbox = (this.parent.editorMode === 'HTML') ? '<label>' + linkTooltip +
            '</label></div><div class="e-rte-field">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder = "' + title + '" class="e-input e-rte-linkTitle"></div>' +
            '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
            '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>' : '';
        var content = '<div class="e-rte-label"><label>' + linkWebAddress + '</label></div>' + '<div class="e-rte-field">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder="' + urlPlace + '" class="e-input e-rte-linkurl"/></div>' +
            '<div class="e-rte-label">' + '<label>' + linkDisplayText + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" spellcheck="false" class="e-input e-rte-linkText" placeholder="' + textPlace + '">' +
            '</div><div class="e-rte-label">' + htmlTextbox;
        var contentElem = parseHtml(content);
        linkContent.appendChild(contentElem);
        var linkTarget = linkContent.querySelector('.e-rte-linkTarget');
        var linkUrl = linkContent.querySelector('.e-rte-linkurl');
        var linkText = linkContent.querySelector('.e-rte-linkText');
        var linkTitle = linkContent.querySelector('.e-rte-linkTitle');
        var linkOpenLabel = this.i10n.getConstant('linkOpenInNewWindow');
        this.checkBoxObj = new CheckBox({ label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl });
        this.checkBoxObj.isStringTemplate = true;
        this.checkBoxObj.createElement = this.parent.createElement;
        this.checkBoxObj.appendTo(linkTarget);
        selectText = (this.parent.editorMode === 'HTML') ? e.selection.getRange(this.parent.contentModule.getDocument()).toString() :
            e.text;
        var linkInsert = this.i10n.getConstant('dialogInsert');
        var linkCancel = this.i10n.getConstant('dialogCancel');
        var selection = e.selection;
        var selectObj = { selfLink: this, selection: e.selection, selectParent: e.selectParent, args: e.args };
        var dialogModel = {
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
            close: function (event) {
                _this.parent.isBlur = false;
                if (event && event.event.returnValue) {
                    if (_this.parent.editorMode === 'HTML') {
                        selection.restore();
                    }
                    else {
                        _this.parent.formatter.editorManager.markdownSelection.restore(_this.parent.contentModule.getEditPanel());
                    }
                }
                _this.dialogObj.destroy();
                detach(_this.dialogObj.element);
                var args = isBlazor() ? null : _this.dialogObj;
                _this.dialogRenderObj.close(args);
                _this.dialogObj = null;
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
        if ((this.parent.editorMode === 'HTML' && isNullOrUndefined(inputDetails) && ((!isNullOrUndefined(selectText)
            && selectText !== '') && (e.selection.range.startOffset === 0) || e.selection.range.startOffset !==
            e.selection.range.endOffset)) || e.module === 'Markdown') {
            linkText.value = selectText;
        }
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
        if (this.quickToolObj) {
            this.hideLinkQuickToolbar();
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    };
    Link.prototype.insertlink = function (e) {
        var linkEle = this.selfLink.dialogObj.element;
        var linkUrl = linkEle.querySelector('.e-rte-linkurl').value;
        var linkText = linkEle.querySelector('.e-rte-linkText').value;
        var linkTitle;
        if (this.selfLink.parent.editorMode === 'HTML') {
            linkTitle = linkEle.querySelector('.e-rte-linkTitle').value;
        }
        var target = (this.selfLink.checkBoxObj.checked) ? '_blank' : null;
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
        var proxy = this.selfLink;
        if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(closest(this.selection.range.startContainer.parentNode, '#' + proxy.parent.contentModule.getPanel().id))) {
            proxy.parent.contentModule.getEditPanel().focus();
            if (Browser.isIE && proxy.parent.iframeSettings.enable) {
                this.selection.restore();
            }
            var range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
            this.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.parent.contentModule.getDocument());
            this.selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        var value = {
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
    };
    Link.prototype.isUrl = function (url) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    };
    Link.prototype.checkUrl = function (e) {
        var linkEle = this.dialogObj.element;
        var linkUrl = linkEle.querySelector('.e-rte-linkurl');
        if (e) {
            addClass([linkUrl], 'e-error');
            linkUrl.setSelectionRange(0, linkUrl.value.length);
            linkUrl.focus();
        }
        else {
            removeClass([linkUrl], 'e-error');
        }
    };
    Link.prototype.removeLink = function (e) {
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
    };
    Link.prototype.openLink = function (e) {
        var selectParentEle = this.getAnchorNode(e.selectParent[0]);
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            this.parent.formatter.process(this.parent, e.args, e.args, {
                url: selectParentEle.href,
                target: selectParentEle.target === '' ? '_self' : '_blank', selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
        }
    };
    Link.prototype.getAnchorNode = function (element) {
        var selectParent = closest(element, 'a');
        return (selectParent ? selectParent : element);
    };
    Link.prototype.editLink = function (e) {
        var selectedNode = this.getAnchorNode(e.selectNode[0]);
        var selectParentEle = this.getAnchorNode(e.selectParent[0]);
        selectParentEle = selectedNode.nodeName === 'A' ? selectedNode : selectParentEle;
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var inputDetails = {
                url: selectParentEle.getAttribute('href'), text: selectParentEle.innerText,
                title: selectParentEle.title, target: selectParentEle.target,
                header: this.i10n.getConstant('editLink'), btnText: linkUpdate
            };
            this.linkDialog(e, inputDetails);
        }
    };
    Link.prototype.cancelDialog = function (e) {
        this.selfLink.parent.isBlur = false;
        this.selfLink.dialogObj.hide({ returnValue: true });
        if (isIDevice$1()) {
            this.selection.restore();
        }
        else {
            this.selfLink.parent.contentModule.getEditPanel().focus();
        }
    };
    Link.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (!isNullOrUndefined(this.dialogObj) && ((!closest(target, '#' + this.dialogObj.element.id) && this.parent.toolbarSettings.enable &&
            this.parent.getToolbarElement() && !this.parent.getToolbarElement().contains(e.target)) ||
            (((this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target)) ||
                this.parent.inlineMode.enable && !closest(target, '#' + this.parent.getID() + '_rtelink')) &&
                !closest(target, '#' + this.parent.getID() + '_toolbar_CreateLink') &&
                !target.querySelector('#' + this.parent.getID() + '_toolbar_CreateLink')))) {
            this.dialogObj.hide({ returnValue: true });
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    Link.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     */
    Link.prototype.getModuleName = function () {
        return 'link';
    };
    return Link;
}());

/**
 * `Image` module is used to handle image actions.
 */
var Image = /** @__PURE__ @class */ (function () {
    function Image(parent, serviceLocator) {
        this.pageX = null;
        this.pageY = null;
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService('rteLocale');
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
        this.addEventListener();
    }
    Image.prototype.addEventListener = function () {
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
    };
    Image.prototype.removeEventListener = function () {
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
        var dropElement = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument
            : this.parent.inputElement;
        dropElement.removeEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.removeEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.removeEventListener('dragenter', this.dragEnter.bind(this), true);
        dropElement.removeEventListener('dragover', this.dragOver.bind(this), true);
        if (!isNullOrUndefined(this.contentModule)) {
            EventHandler.remove(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick);
            this.parent.formatter.editorManager.observer.off(checkUndo, this.undoStack);
            if (this.parent.insertImageSettings.resize) {
                EventHandler.remove(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
            }
        }
    };
    Image.prototype.onIframeMouseDown = function () {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
        }
    };
    Image.prototype.afterRender = function () {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        EventHandler.add(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick, this);
        if (this.parent.insertImageSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
        }
        var dropElement = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument :
            this.parent.inputElement;
        dropElement.addEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.addEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.addEventListener('dragenter', this.dragOver.bind(this), true);
        dropElement.addEventListener('dragover', this.dragOver.bind(this), true);
    };
    Image.prototype.undoStack = function (args) {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (var i = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                var temp = this.parent.createElement('div');
                var contentElem = parseHtml(this.parent.formatter.getUndoRedoStack()[i].text);
                temp.appendChild(contentElem);
                var img = temp.querySelectorAll('img');
                if (temp.querySelector('.e-img-resize') && img.length > 0) {
                    for (var j = 0; j < img.length; j++) {
                        img[j].style.outline = '';
                    }
                    detach(temp.querySelector('.e-img-resize'));
                    this.parent.formatter.getUndoRedoStack()[i].text = temp.innerHTML;
                }
            }
        }
    };
    Image.prototype.resizeEnd = function (e) {
        this.resizeBtnInit();
        this.imgEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) {
            removeClass([e.target.parentElement], 'e-mob-span');
        }
        var args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(resizeStop, args);
        var pageX = this.getPointX(e);
        var pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + e.clientY : e.pageY;
        this.parent.formatter.editorManager.observer.on(checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
    };
    Image.prototype.resizeStart = function (e, ele) {
        var _this = this;
        if (this.parent.readonly) {
            return;
        }
        var target = ele ? ele : e.target;
        if (target.tagName === 'IMG') {
            this.parent.preventDefaultResize(e);
            var img = target;
            if (this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
                detach(this.imgResizeDiv);
            }
            this.imageResize(img);
        }
        if (target.classList.contains('e-rte-imageboxmark')) {
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
            if (target.classList.contains('e-rte-topLeft')) {
                this.resizeBtnStat.topLeft = true;
            }
            if (target.classList.contains('e-rte-topRight')) {
                this.resizeBtnStat.topRight = true;
            }
            if (target.classList.contains('e-rte-botLeft')) {
                this.resizeBtnStat.botLeft = true;
            }
            if (target.classList.contains('e-rte-botRight')) {
                this.resizeBtnStat.botRight = true;
            }
            if (Browser.isDevice && this.contentModule.getEditPanel().contains(this.imgResizeDiv) &&
                !this.imgResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.imgResizeDiv], 'e-mob-span');
            }
            else {
                var args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
                this.parent.trigger(resizeStart, args, function (resizeStartArgs) {
                    if (resizeStartArgs.cancel) {
                        _this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    };
    Image.prototype.imageClick = function (e) {
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
    };
    Image.prototype.imageResize = function (e) {
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
    };
    Image.prototype.getPointX = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    };
    Image.prototype.getPointY = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageY;
        }
        else {
            return e.pageY;
        }
    };
    Image.prototype.imgResizePos = function (e, imgResizeDiv) {
        var pos = this.calcPos(e);
        var top = pos.top;
        var left = pos.left;
        var imgWid = e.width;
        var imgHgt = e.height;
        var borWid = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + image outline width
        var devWid = ((Browser.isDevice) ? 0 : 2); // span border width
        imgResizeDiv.querySelector('.e-rte-botLeft').style.left = (left - borWid) + 'px';
        imgResizeDiv.querySelector('.e-rte-botLeft').style.top = ((imgHgt - borWid) + top) + 'px';
        imgResizeDiv.querySelector('.e-rte-botRight').style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        imgResizeDiv.querySelector('.e-rte-botRight').style.top = ((imgHgt - borWid) + top) + 'px';
        imgResizeDiv.querySelector('.e-rte-topRight').style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        imgResizeDiv.querySelector('.e-rte-topRight').style.top = (top - (borWid)) + 'px';
        imgResizeDiv.querySelector('.e-rte-topLeft').style.left = (left - borWid) + 'px';
        imgResizeDiv.querySelector('.e-rte-topLeft').style.top = (top - borWid) + 'px';
    };
    Image.prototype.calcPos = function (elem) {
        var ignoreOffset = ['TD', 'TH', 'TABLE', 'A'];
        var parentOffset = { top: 0, left: 0 };
        var offset = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var offsetParent = ((elem.offsetParent && (elem.offsetParent.classList.contains('e-img-caption') ||
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
    };
    Image.prototype.setAspectRatio = function (img, expectedX, expectedY) {
        if (isNullOrUndefined(img.width)) {
            return;
        }
        var width = img.style.width !== '' ? parseInt(img.style.width, 10) : img.width;
        var height = img.style.height !== '' ? parseInt(img.style.height, 10) : img.height;
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
    };
    Image.prototype.pixToPerc = function (expected, parentEle) {
        return expected / parseFloat(getComputedStyle(parentEle).width) * 100;
    };
    Image.prototype.imgDupMouseMove = function (width, height, e) {
        var _this = this;
        var args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(onResize, args, function (resizingArgs) {
            if (resizingArgs.cancel) {
                _this.cancelResizeAction();
            }
            else {
                if ((parseInt(_this.parent.insertImageSettings.minWidth, 10) >= parseInt(width, 10) ||
                    parseInt(_this.parent.insertImageSettings.maxWidth, 10) <= parseInt(width, 10))) {
                    return;
                }
                if (!_this.parent.insertImageSettings.resizeByPercent &&
                    (parseInt(_this.parent.insertImageSettings.minHeight, 10) >= parseInt(height, 10) ||
                        parseInt(_this.parent.insertImageSettings.maxHeight, 10) <= parseInt(height, 10))) {
                    return;
                }
                _this.imgEle.parentElement.style.cursor = 'pointer';
                _this.setAspectRatio(_this.imgEle, parseInt(width, 10), parseInt(height, 10));
                _this.resizeImgDupPos(_this.imgEle);
                _this.imgResizePos(_this.imgEle, _this.imgResizeDiv);
                _this.parent.setContentHeight('', false);
            }
        });
    };
    Image.prototype.resizing = function (e) {
        var pageX = this.getPointX(e);
        var pageY = this.getPointY(e);
        var mouseX = (this.resizeBtnStat.botLeft || this.resizeBtnStat.topLeft) ? -(pageX - this.pageX) : (pageX - this.pageX);
        var mouseY = (this.resizeBtnStat.topLeft || this.resizeBtnStat.topRight) ? -(pageY - this.pageY) : (pageY - this.pageY);
        var width = parseInt(this.imgDupPos.width, 10) + mouseX;
        var height = parseInt(this.imgDupPos.height, 10) + mouseY;
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
    };
    Image.prototype.cancelResizeAction = function () {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.imgEle && this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            detach(this.imgResizeDiv);
            this.imgEle.style.outline = '';
            this.imgResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
        }
    };
    Image.prototype.resizeImgDupPos = function (e) {
        this.imgDupPos = {
            width: (e.style.height !== '') ? this.imgEle.style.width : e.width + 'px',
            height: (e.style.height !== '') ? this.imgEle.style.height : e.height + 'px'
        };
    };
    Image.prototype.resizeBtnInit = function () {
        return this.resizeBtnStat = { botLeft: false, botRight: false, topRight: false, topLeft: false };
    };
    Image.prototype.onToolbarAction = function (args) {
        if (isIDevice$1()) {
            this.parent.notify(selectionRestore, {});
        }
        var item = args.args.item;
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
    };
    Image.prototype.openImgLink = function (e) {
        var target = e.selectParent[0].parentNode.target === '' ? '_self' : '_blank';
        this.parent.formatter.process(this.parent, e.args, e.args, {
            url: e.selectParent[0].parentNode.href, target: target, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand
        });
    };
    Image.prototype.editImgLink = function (e) {
        var selectParentEle = e.selectParent[0].parentNode;
        var linkUpdate = this.i10n.getConstant('dialogUpdate');
        var inputDetails = {
            url: selectParentEle.href, target: selectParentEle.target,
            header: 'Edit Link', btnText: linkUpdate
        };
        this.insertImgLink(e, inputDetails);
    };
    Image.prototype.removeImgLink = function (e) {
        if (Browser.isIE) {
            this.contentModule.getEditPanel().focus();
        }
        e.selection.restore();
        var isCapLink = (this.contentModule.getEditPanel().contains(this.captionEle) && select('a', this.captionEle)) ?
            true : false;
        var selectParent = isCapLink ? [this.captionEle] : [e.selectNode[0].parentElement];
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
    };
    Image.prototype.onKeyDown = function (event) {
        var originalEvent = event.args;
        var range;
        var save;
        var selectNodeEle;
        var selectParentEle;
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection)) {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                (selectParentEle[0].tagName === 'IMG') && selectParentEle[0].parentElement) {
                var prev = selectParentEle[0].parentElement.childNodes[0];
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
                var event_1 = {
                    selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                    args: {
                        item: { command: 'Images', subCommand: 'Remove' },
                        originalEvent: originalEvent
                    }
                };
                this.deleteImg(event_1);
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
    };
    Image.prototype.alignmentSelect = function (e) {
        var item = e.item;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Images') {
            return;
        }
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        var selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (selectNodeEle[0].nodeName === 'IMG') ? selectNodeEle : [this.imgEle];
        var args = { args: e, selectNode: selectNodeEle };
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
    };
    Image.prototype.imageWithLinkQTBarItemUpdate = function () {
        var separator;
        var items = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
        for (var i = 0; i < items.length; i++) {
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
        var newItems = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item:not(.e-link-groups)');
        this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
    };
    Image.prototype.showImageQuickToolbar = function (e) {
        var _this = this;
        if (e.type !== 'Images' || isNullOrUndefined(this.parent.quickToolbarModule)
            || isNullOrUndefined(this.parent.quickToolbarModule.imageQTBar)) {
            return;
        }
        this.quickToolObj = this.parent.quickToolbarModule;
        var args = e.args;
        var target = e.elements;
        [].forEach.call(e.elements, function (element, index) {
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
        var pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
        if (this.parent.quickToolbarModule.imageQTBar) {
            if (e.isNotify) {
                setTimeout(function () { _this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target); }, 400);
            }
            else {
                this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target);
            }
        }
    };
    Image.prototype.hideImageQuickToolbar = function () {
        if (!isNullOrUndefined(this.contentModule.getEditPanel().querySelector('.e-img-focus'))) {
            removeClass([this.contentModule.getEditPanel().querySelector('.e-img-focus')], 'e-img-focus');
            if (this.quickToolObj && this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
            }
        }
    };
    Image.prototype.editAreaClickHandler = function (e) {
        if (this.parent.readonly) {
            this.hideImageQuickToolbar();
            return;
        }
        var args = e.args;
        var showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNullOrUndefined(args.target) &&
                args.target.tagName === 'IMG') {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), args.target);
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.imageQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            var target = args.target;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            var isPopupOpen = this.quickToolObj.imageQTBar.element.classList.contains('e-rte-pop');
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
                var items = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
                var separator = void 0;
                if (closest(target, 'a')) {
                    for (var i = 0; i < items.length; i++) {
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
                    var newItems = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item:not(.e-link-groups)');
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
    };
    Image.prototype.insertImgLink = function (e, inputDetails) {
        var _this = this;
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            var linkWrap = this.parent.createElement('div', { className: 'e-img-linkwrap' });
            var linkUrl = this.i10n.getConstant('linkurl');
            var content = '<div class="e-rte-field">' +
                '<input type="text" data-role ="none" class="e-input e-img-link" spellcheck="false" placeholder="' + linkUrl + '"/></div>' +
                '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
                '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>';
            var contentElem = parseHtml(content);
            linkWrap.appendChild(contentElem);
            var linkTarget = linkWrap.querySelector('.e-rte-linkTarget');
            var inputLink = linkWrap.querySelector('.e-img-link');
            var linkOpenLabel = this.i10n.getConstant('linkOpenInNewWindow');
            this.checkBoxObj = new CheckBox({
                label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl, change: function (e) {
                    if (e.checked) {
                        target_1 = '_blank';
                    }
                    else {
                        target_1 = null;
                    }
                }
            });
            this.checkBoxObj.isStringTemplate = true;
            this.checkBoxObj.createElement = this.parent.createElement;
            this.checkBoxObj.appendTo(linkTarget);
            var target_1 = this.checkBoxObj.checked ? '_blank' : null;
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var linkargs_1 = {
                args: e.args,
                selfImage: this, selection: e.selection,
                selectNode: e.selectNode, selectParent: e.selectParent, link: inputLink, target: target_1
            };
            this.dialogObj.setProperties({
                height: 'inherit',
                width: '290px',
                header: this.parent.localeObj.getConstant('imageInsertLinkHeader'),
                content: linkWrap,
                position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: function (e) { _this.insertlink(linkargs_1); },
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
    };
    Image.prototype.insertAltText = function (e) {
        var _this = this;
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        var altText = this.i10n.getConstant('altText');
        if (!isNullOrUndefined(this.dialogObj)) {
            var altWrap = this.parent.createElement('div', { className: 'e-img-altwrap' });
            var altHeader = this.i10n.getConstant('alternateHeader');
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var getAlt = (e.selectNode[0].getAttribute('alt') === null) ? '' :
                e.selectNode[0].getAttribute('alt');
            var content = '<div class="e-rte-field">' +
                '<input type="text" spellcheck="false" value="' + getAlt + '" class="e-input e-img-alt" placeholder="' + altText + '"/>' +
                '</div>';
            var contentElem = parseHtml(content);
            altWrap.appendChild(contentElem);
            var inputAlt = altWrap.querySelector('.e-img-alt');
            var altArgs_1 = {
                args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode,
                alt: inputAlt
            };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: altHeader, content: altWrap, position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: function (e) { _this.insertAlt(altArgs_1); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-alt', isPrimary: true
                        }
                    }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    };
    Image.prototype.insertAlt = function (e) {
        if (!isNullOrUndefined(e.alt)) {
            e.selection.restore();
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            var altText = e.alt.value;
            this.parent.formatter.process(this.parent, e.args, e.args, {
                altText: altText, selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
            this.dialogObj.hide({ returnValue: false });
        }
    };
    Image.prototype.insertlink = function (e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        var url = e.link.value;
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
        var proxy = e.selfImage;
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
        var captionEle = closest(e.selectNode[0], '.e-img-caption');
        if (captionEle) {
            select('.e-img-inner', captionEle).focus();
        }
        proxy.dialogObj.hide({ returnValue: false });
    };
    Image.prototype.isUrl = function (url) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    };
    Image.prototype.deleteImg = function (e) {
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
    };
    Image.prototype.caption = function (e) {
        var selectNode = e.selectNode[0];
        if (selectNode.nodeName !== 'IMG') {
            return;
        }
        e.selection.restore();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.cancelResizeAction();
        addClass([selectNode], 'e-rte-image');
        var subCommand = (e.args.item) ?
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
                className: CLS_CAPTION + ' ' + CLS_RTE_CAPTION,
                attrs: { contenteditable: 'false', draggable: 'false' }
            });
            var imgWrap = this.parent.createElement('span', { className: 'e-img-wrap' });
            var imgInner = this.parent.createElement('span', { className: 'e-img-inner', attrs: { contenteditable: 'true' } });
            var parent_1 = e.selectNode[0].parentElement;
            if (parent_1.tagName === 'A') {
                parent_1.setAttribute('contenteditable', 'true');
            }
            imgWrap.appendChild(parent_1.tagName === 'A' ? parent_1 : e.selectNode[0]);
            imgWrap.appendChild(imgInner);
            var imgCaption = this.i10n.getConstant('imageCaption');
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
    };
    Image.prototype.imageSize = function (e) {
        var _this = this;
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            var imgSizeHeader = this.i10n.getConstant('imageSizeHeader');
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var dialogContent = this.imgsizeInput(e);
            var selectObj_1 = { args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: imgSizeHeader, content: dialogContent, position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: function (e) { _this.insertSize(selectObj_1); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-size', isPrimary: true
                        }
                    }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    };
    Image.prototype.break = function (e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.inline = function (e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.justifyImageLeft = function (e) {
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyLeft';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.justifyImageRight = function (e) {
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyRight';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.justifyImageCenter = function (e) {
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyCenter';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.imagDialog = function (e) {
        var _this = this;
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
            return;
        }
        var imgDialog = this.parent.createElement('div', { className: 'e-rte-img-dialog', id: this.rteID + '_image' });
        this.parent.element.appendChild(imgDialog);
        var imgInsert = this.i10n.getConstant('dialogInsert');
        var imglinkCancel = this.i10n.getConstant('dialogCancel');
        var imgHeader = this.i10n.getConstant('imageHeader');
        var selection = e.selection;
        var selectObj = { selfImage: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        var dialogModel = {
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
                    click: function (e) { _this.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: imglinkCancel }
                }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: function (event) {
                _this.parent.isBlur = false;
                if (event && event.event.returnValue) {
                    if (_this.parent.editorMode === 'HTML') {
                        selection.restore();
                    }
                    else {
                        _this.parent.formatter.editorManager.markdownSelection.restore(_this.parent.contentModule.getEditPanel());
                    }
                }
                _this.dialogObj.destroy();
                detach(_this.dialogObj.element);
                _this.dialogRenderObj.close(event);
                _this.dialogObj = null;
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
    };
    Image.prototype.cancelDialog = function (e) {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true });
    };
    Image.prototype.onDocumentClick = function (e) {
        var target = e.target;
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
    };
    Image.prototype.remvoeResizEle = function () {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.contentModule.getEditPanel().querySelector('.e-img-resize'));
    };
    Image.prototype.imageUrlPopup = function (e) {
        var imgUrl = this.parent.createElement('div', { className: 'imgUrl' });
        var placeUrl = this.i10n.getConstant('imageUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-img-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false' }
        });
        imgUrl.appendChild(this.inputUrl);
        return imgUrl;
    };
    Image.prototype.insertImageUrl = function (e) {
        var proxy = this.selfImage;
        var url = proxy.inputUrl.value;
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
                var range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
                this.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.contentModule.getDocument());
                this.selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            var regex = /[\w-]+.(jpg|png|jpeg|gif)/g;
            var matchUrl = (!isNullOrUndefined(url.match(regex)) && proxy.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            var value = {
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
    };
    Image.prototype.imgsizeInput = function (e) {
        var selectNode = e.selectNode[0];
        var imgHeight = this.i10n.getConstant('imageHeight');
        var imgWidth = this.i10n.getConstant('imageWidth');
        var imgSizeWrap = this.parent.createElement('div', { className: 'e-img-sizewrap' });
        var widthVal = (selectNode.getAttribute('width') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('width'))) ? selectNode.width : selectNode.getClientRects()[0].width;
        var heightVal = (selectNode.getAttribute('height') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('height'))) ? selectNode.height : selectNode.getClientRects()[0].height;
        var content = '<div class="e-rte-label"><label>' + imgWidth +
            '</label></div><div class="e-rte-field"><input type="text" data-role ="none" id="imgwidth" class="e-img-width" value=' +
            widthVal
            + ' /></div>' +
            '<div class="e-rte-label">' + '<label>' + imgHeight + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" id="imgheight" class="e-img-height" value=' +
            heightVal
            + ' /></div>';
        var contentElem = parseHtml(content);
        imgSizeWrap.appendChild(contentElem);
        var widthNum = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minWidth,
            max: this.parent.insertImageSettings.maxWidth,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.isStringTemplate = true;
        widthNum.createElement = this.parent.createElement;
        widthNum.appendTo(imgSizeWrap.querySelector('#imgwidth'));
        var heightNum = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minHeight,
            max: this.parent.insertImageSettings.maxHeight,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        heightNum.isStringTemplate = true;
        heightNum.createElement = this.parent.createElement;
        heightNum.appendTo(imgSizeWrap.querySelector('#imgheight'));
        return imgSizeWrap;
    };
    Image.prototype.insertSize = function (e) {
        e.selection.restore();
        var proxy = e.selfImage;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        var dialogEle = proxy.dialogObj.element;
        var width = parseFloat(dialogEle.querySelector('.e-img-width').value);
        var height = parseFloat(dialogEle.parentElement.querySelector('.e-img-height').value);
        proxy.parent.formatter.process(this.parent, e.args, e.args, {
            width: width, height: height, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand
        });
        if (this.imgResizeDiv) {
            proxy.imgResizePos(e.selectNode[0], this.imgResizeDiv);
        }
        proxy.dialogObj.hide({ returnValue: true });
    };
    Image.prototype.insertImage = function (e) {
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            var dialogContent = this.parent.createElement('div', { className: 'e-img-content' });
            if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
                || this.parent.editorMode === 'HTML') {
                dialogContent.appendChild(this.imgUpload(e));
            }
            var linkHeader = this.parent.createElement('div', { className: 'e-linkheader' });
            var linkHeaderText = this.i10n.getConstant('imageLinkHeader');
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
    };
    Image.prototype.imgUpload = function (e) {
        var _this = this;
        var save;
        var selectParent;
        var proxy = this;
        var iframe = proxy.parent.iframeSettings.enable;
        if (proxy.parent.editorMode === 'HTML' &&
            (!iframe && isNullOrUndefined(closest(e.selection.range.startContainer.parentNode, '#' + this.contentModule.getPanel().id))
                || (iframe && !hasClass(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'), 'e-lib')))) {
            this.contentModule.getEditPanel().focus();
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        else {
            save = e.selection;
            selectParent = e.selectParent;
        }
        var uploadParentEle = this.parent.createElement('div', { className: 'e-img-uploadwrap e-droparea' });
        var deviceImgUpMsg = this.i10n.getConstant('imageDeviceUploadMessage');
        var imgUpMsg = this.i10n.getConstant('imageUploadMessage');
        var span = this.parent.createElement('span', { className: 'e-droptext' });
        var spanMsg = this.parent.createElement('span', {
            className: 'e-rte-upload-text', innerHTML: ((Browser.isDevice) ? deviceImgUpMsg : imgUpMsg)
        });
        span.appendChild(spanMsg);
        var btnEle = this.parent.createElement('button', {
            className: 'e-browsebtn', id: this.rteID + '_insertImage',
            attrs: { autofocus: 'true', type: 'button' }
        });
        span.appendChild(btnEle);
        uploadParentEle.appendChild(span);
        var browserMsg = this.i10n.getConstant('browse');
        var button = new Button({ content: browserMsg, enableRtl: this.parent.enableRtl });
        button.isStringTemplate = true;
        button.createElement = this.parent.createElement;
        button.appendTo(btnEle);
        var btnClick = (Browser.isDevice) ? span : btnEle;
        EventHandler.add(btnClick, 'click', this.fileSelect, this);
        var uploadEle = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        uploadParentEle.appendChild(uploadEle);
        var altText;
        this.uploadObj = new Uploader({
            asyncSettings: { saveUrl: this.parent.insertImageSettings.saveUrl, },
            dropArea: span, multiple: false, enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            selected: function (e) {
                _this.parent.trigger(imageSelected, e, function (e) {
                    _this.checkExtension(e.filesData[0]);
                    altText = e.filesData[0].name;
                    if (_this.parent.editorMode === 'HTML' && isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                        var reader_1 = new FileReader();
                        reader_1.addEventListener('load', function (e) {
                            var url = _this.parent.insertImageSettings.saveFormat === 'Base64' ? reader_1.result :
                                URL.createObjectURL(convertToBlob(reader_1.result));
                            proxy.uploadUrl = {
                                url: url, selection: save, altText: altText,
                                selectParent: selectParent,
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
                        reader_1.readAsDataURL(e.filesData[0].rawFile);
                    }
                });
            },
            uploading: function (e) {
                _this.parent.trigger(imageUploading, e);
            },
            success: function (e) {
                _this.parent.trigger(imageUploadSuccess, e, function (e) {
                    if (!isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                        var url = _this.parent.insertImageSettings.path + e.file.name;
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
                    }
                });
            },
            failure: function (e) {
                _this.parent.trigger(imageUploadFailed, e);
            },
            removing: function () {
                _this.parent.trigger(imageRemoving, e, function (e) {
                    proxy.inputUrl.removeAttribute('disabled');
                    if (proxy.uploadUrl) {
                        proxy.uploadUrl.url = '';
                    }
                    _this.dialogObj.getButtons(0).element.removeAttribute('disabled');
                });
            }
        });
        this.uploadObj.isStringTemplate = true;
        this.uploadObj.createElement = this.parent.createElement;
        this.uploadObj.appendTo(uploadEle);
        return uploadParentEle;
    };
    Image.prototype.checkExtension = function (e) {
        if (this.uploadObj.allowedExtensions) {
            if (this.uploadObj.allowedExtensions.toLocaleLowerCase().indexOf(('.' + e.type).toLocaleLowerCase()) === -1) {
                this.dialogObj.getButtons(0).element.setAttribute('disabled', 'disabled');
            }
        }
    };
    Image.prototype.fileSelect = function () {
        this.dialogObj.element.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
    };
    Image.prototype.dragStart = function (e) {
        if (e.target.nodeName === 'IMG') {
            this.parent.trigger(actionBegin, e, function (actionBeginArgs) {
                if (actionBeginArgs.cancel) {
                    e.preventDefault();
                }
                else {
                    e.dataTransfer.effectAllowed = 'copyMove';
                    e.target.classList.add(CLS_RTE_DRAG_IMAGE);
                }
            });
        }
        else {
            return true;
        }
    };
    
    Image.prototype.dragEnter = function (e) {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
    };
    
    Image.prototype.dragOver = function (e) {
        if ((Browser.info.name === 'edge' && e.dataTransfer.items[0].type.split('/')[0].indexOf('image') > -1) ||
            (Browser.isIE && e.dataTransfer.types[0] === 'Files')) {
            e.preventDefault();
        }
        else {
            return true;
        }
    };
    
    /**
     * USed to set range When drop an image
     */
    Image.prototype.dragDrop = function (e) {
        var _this = this;
        var imgElement = this.parent.inputElement.ownerDocument.querySelector('.' + CLS_RTE_DRAG_IMAGE);
        if ((imgElement && imgElement.tagName === 'IMG') || e.dataTransfer.files.length > 0) {
            this.parent.trigger(actionBegin, e, function (actionBeginArgs) {
                if (actionBeginArgs.cancel) {
                    e.preventDefault();
                }
                else {
                    if (closest(e.target, '#' + _this.parent.getID() + '_toolbar')) {
                        e.preventDefault();
                        return;
                    }
                    if (_this.parent.element.querySelector('.' + CLS_IMG_RESIZE)) {
                        detach(_this.imgResizeDiv);
                    }
                    e.preventDefault();
                    var range = void 0;
                    if (_this.contentModule.getDocument().caretRangeFromPoint) { //For chrome
                        range = _this.contentModule.getDocument().caretRangeFromPoint(e.clientX, e.clientY);
                    }
                    else if ((e.rangeParent)) { //For mozilla firefox
                        range = _this.contentModule.getDocument().createRange();
                        range.setStart(e.rangeParent, e.rangeOffset);
                    }
                    else {
                        range = _this.getDropRange(e.clientX, e.clientY); //For internet explorer
                    }
                    _this.parent.notify(selectRange, { range: range });
                    var uploadArea = _this.parent.element.querySelector('.' + CLS_DROPAREA);
                    if (uploadArea) {
                        return;
                    }
                    _this.insertDragImage(e);
                }
            });
        }
        else {
            return true;
        }
    };
    /**
     * Used to calculate range on internet explorer
     */
    Image.prototype.getDropRange = function (x, y) {
        var startRange = this.contentModule.getDocument().createRange();
        this.parent.formatter.editorManager.nodeSelection.setRange(this.contentModule.getDocument(), startRange);
        var elem = this.contentModule.getDocument().elementFromPoint(x, y);
        var startNode = (elem.childNodes.length > 0 ? elem.childNodes[0] : elem);
        var startCharIndexCharacter = 0;
        if (this.parent.inputElement.firstChild.innerHTML === '<br>') {
            startRange.setStart(startNode, startCharIndexCharacter);
            startRange.setEnd(startNode, startCharIndexCharacter);
        }
        else {
            var rangeRect = void 0;
            do {
                startCharIndexCharacter++;
                startRange.setStart(startNode, startCharIndexCharacter);
                startRange.setEnd(startNode, startCharIndexCharacter + 1);
                rangeRect = startRange.getBoundingClientRect();
            } while (rangeRect.left < x && startCharIndexCharacter < startNode.length - 1);
        }
        return startRange;
    };
    Image.prototype.insertDragImage = function (e) {
        e.preventDefault();
        var activePopupElement = this.parent.element.querySelector('' + CLS_POPUP_OPEN);
        this.parent.notify(drop, { args: e });
        if (activePopupElement) {
            activePopupElement.classList.add(CLS_HIDE);
        }
        if (e.dataTransfer.files.length > 0) { //For external image drag and drop
            if (e.dataTransfer.files.length > 1) {
                return;
            }
            var imgFiles = e.dataTransfer.files;
            var fileName = imgFiles[0].name;
            var imgType = fileName.substring(fileName.lastIndexOf('.'));
            var allowedTypes = this.parent.insertImageSettings.allowedTypes;
            for (var i = 0; i < allowedTypes.length; i++) {
                if (imgType.toLocaleLowerCase() === allowedTypes[i].toLowerCase()) {
                    if (this.parent.insertImageSettings.saveUrl) {
                        this.onSelect(e);
                    }
                    else {
                        var args = { args: e, text: '', file: imgFiles[0] };
                        e.preventDefault();
                        this.imagePaste(args);
                    }
                }
            }
        }
        else { //For internal image drag and drop
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            var imgElement = this.parent.inputElement.ownerDocument.querySelector('.' + CLS_RTE_DRAG_IMAGE);
            if (imgElement && imgElement.tagName === 'IMG') {
                if (imgElement.nextElementSibling) {
                    if (imgElement.nextElementSibling.classList.contains(CLS_IMG_INNER)) {
                        range.insertNode(imgElement.parentElement.parentElement);
                    }
                    else {
                        range.insertNode(imgElement);
                    }
                }
                else {
                    range.insertNode(imgElement);
                }
                imgElement.classList.remove(CLS_RTE_DRAG_IMAGE);
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                var args = e;
                this.resizeStart(args, imgElement);
                this.hideImageQuickToolbar();
            }
        }
    };
    Image.prototype.onSelect = function (args) {
        var proxy = this;
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        var parentElement = this.parent.createElement('ul', { className: CLS_UPLOAD_FILES });
        this.parent.element.appendChild(parentElement);
        var validFiles = {
            name: '',
            size: 0,
            status: '',
            statusCode: '',
            type: '',
            rawFile: args.dataTransfer.files[0],
            validationMessages: {}
        };
        var imageTag = this.parent.createElement('IMG');
        imageTag.style.opacity = '0.5';
        imageTag.classList.add(CLS_RTE_IMAGE);
        imageTag.classList.add(CLS_IMGINLINE);
        imageTag.classList.add(CLS_RESIZE);
        var file = validFiles.rawFile;
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            var url = URL.createObjectURL(convertToBlob(reader.result));
            imageTag.src = proxy.parent.insertImageSettings.saveFormat === 'Blob' ? url : reader.result;
        });
        if (file) {
            reader.readAsDataURL(file);
        }
        range.insertNode(imageTag);
        this.uploadMethod(args, imageTag);
    };
    /**
     * Rendering uploader and popup for drag and drop
     */
    Image.prototype.uploadMethod = function (dragEvent, imageElement) {
        var _this = this;
        var proxy = this;
        var popupEle = this.parent.createElement('div');
        this.parent.element.appendChild(popupEle);
        var uploadEle = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        var offsetY = this.parent.iframeSettings.enable ? -50 : -90;
        this.popupObj = new Popup(popupEle, {
            relateTo: imageElement,
            height: '85px',
            width: '300px',
            offsetY: offsetY,
            content: uploadEle,
            viewPortElement: this.parent.element,
            position: { X: 'center', Y: 'top' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: function (event) {
                _this.parent.isBlur = false;
                _this.popupObj.destroy();
                detach(_this.popupObj.element);
                _this.popupObj = null;
            }
        });
        this.popupObj.element.style.display = 'none';
        addClass([this.popupObj.element], CLS_POPUP_OPEN);
        addClass([this.popupObj.element], CLS_RTE_UPLOAD_POPUP);
        var timeOut = dragEvent.dataTransfer.files[0].size > 1000000 ? 300 : 100;
        setTimeout(function () { proxy.refreshPopup(imageElement); }, timeOut);
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        this.uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl,
            },
            cssClass: CLS_RTE_DIALOG_UPLOAD,
            dropArea: this.parent.inputElement,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            removing: function () {
                detach(imageElement);
                _this.popupObj.close();
            },
            canceling: function () {
                detach(imageElement);
                _this.popupObj.close();
            },
            uploading: function (e) {
                _this.parent.trigger(imageUploading, e);
            },
            failure: function (e) {
                var args = {
                    args: dragEvent,
                    type: 'Images',
                    isNotify: undefined,
                    elements: imageElement
                };
                setTimeout(function () { _this.uploadFailure(imageElement, args, e); }, 900);
            },
            success: function (e) {
                var args = {
                    args: dragEvent,
                    type: 'Images',
                    isNotify: undefined,
                    elements: imageElement
                };
                setTimeout(function () { _this.uploadSuccess(imageElement, dragEvent, args, e); }, 900);
            }
        });
        this.uploadObj.appendTo(this.popupObj.element.childNodes[0]);
        detach(this.popupObj.element.querySelector('.e-rte-dialog-upload .e-file-select-wrap'));
        range.selectNodeContents(imageElement);
        this.parent.formatter.editorManager.nodeSelection.setRange(this.contentModule.getDocument(), range);
    };
    Image.prototype.refreshPopup = function (imageElement) {
        var imgPosition = this.parent.iframeSettings.enable ? this.parent.element.offsetTop +
            imageElement.offsetTop : imageElement.offsetTop;
        var rtePosition = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            this.popupObj.relateTo = this.parent.inputElement;
            this.popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            this.popupObj.element.style.display = 'block';
        }
        else {
            if (this.popupObj) {
                this.popupObj.refreshPosition(imageElement);
                this.popupObj.element.style.display = 'block';
            }
        }
    };
    /**
     * Called when drop image upload was failed
     */
    Image.prototype.uploadFailure = function (imgEle, args, e) {
        detach(imgEle);
        if (this.popupObj) {
            this.popupObj.close();
        }
        this.parent.trigger(imageUploadFailed, e);
    };
    /**
     * Called when drop image upload was successful
     */
    Image.prototype.uploadSuccess = function (imageElement, dragEvent, args, e) {
        var _this = this;
        imageElement.style.opacity = '1';
        imageElement.classList.add(CLS_IMG_FOCUS);
        this.parent.trigger(imageUploadSuccess, e, function (e) {
            if (!isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                var url = _this.parent.insertImageSettings.path + e.file.name;
                imageElement.src = url;
                imageElement.setAttribute('alt', e.file.name);
            }
        });
        this.popupObj.close();
        this.showImageQuickToolbar(args);
        this.resizeStart(dragEvent, imageElement);
        this.uploadObj.destroy();
    };
    Image.prototype.imagePaste = function (args) {
        var _this = this;
        if (args.text.length === 0 && !isNullOrUndefined(args.file)) {
            var proxy_1 = this;
            var reader_2 = new FileReader();
            args.args.preventDefault();
            reader_2.addEventListener('load', function (e) {
                var url = {
                    cssClass: (proxy_1.parent.insertImageSettings.display === 'inline' ? CLS_IMGINLINE : CLS_IMGBREAK),
                    url: _this.parent.insertImageSettings.saveFormat === 'Base64' || !isNullOrUndefined(args.callBack) ?
                        reader_2.result : URL.createObjectURL(convertToBlob(reader_2.result)),
                    width: {
                        width: proxy_1.parent.insertImageSettings.width, minWidth: proxy_1.parent.insertImageSettings.minWidth,
                        maxWidth: proxy_1.parent.insertImageSettings.maxWidth
                    },
                    height: {
                        height: proxy_1.parent.insertImageSettings.height, minHeight: proxy_1.parent.insertImageSettings.minHeight,
                        maxHeight: proxy_1.parent.insertImageSettings.maxHeight
                    }
                };
                if (!isNullOrUndefined(args.callBack)) {
                    args.callBack(url);
                    return;
                }
                else {
                    proxy_1.parent.formatter.process(proxy_1.parent, { item: { command: 'Images', subCommand: 'Image' } }, args.args, url);
                    _this.showPopupToolBar(args, url);
                }
            });
            reader_2.readAsDataURL(args.file);
        }
    };
    Image.prototype.showPopupToolBar = function (e, url) {
        var _this = this;
        var imageSrc = 'img[src="' + url.url + '"]';
        var imageElement = this.parent.inputElement.querySelector(imageSrc);
        this.parent.quickToolbarModule.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        var args = {
            args: e.args,
            type: 'Images',
            isNotify: undefined,
            elements: imageElement
        };
        if (imageElement) {
            setTimeout(function () { _this.showImageQuickToolbar(args); _this.resizeStart(e.args, imageElement); }, 0);
        }
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    Image.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     */
    Image.prototype.getModuleName = function () {
        return 'image';
    };
    return Image;
}());

/**
 * Content module is used to render RichTextEditor content
 * @hidden
 * @deprecated
 */
var ViewSource = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for view source module
     */
    function ViewSource(parent, locator) {
        this.parent = parent;
        var serviceLocator = locator;
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.addEventListener();
    }
    ViewSource.prototype.addEventListener = function () {
        this.parent.on(sourceCode, this.sourceCode, this);
        this.parent.on(initialEnd, this.onInitialEnd, this);
        this.parent.on(updateSource, this.updateSourceCode, this);
    };
    ViewSource.prototype.onInitialEnd = function () {
        this.parent.formatter.editorManager.observer.on(KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    ViewSource.prototype.removeEventListener = function () {
        this.unWireEvent();
        this.parent.off(sourceCode, this.sourceCode);
        this.parent.off(updateSource, this.updateSourceCode);
        this.parent.off(initialEnd, this.onInitialEnd);
        this.parent.formatter.editorManager.observer.off(KEY_DOWN_HANDLER, this.onKeyDown);
    };
    ViewSource.prototype.getSourceCode = function () {
        return this.parent.createElement('textarea', { className: 'e-rte-srctextarea' });
    };
    ViewSource.prototype.wireEvent = function (element) {
        this.keyboardModule = new KeyboardEvents$1(element, {
            keyAction: this.previewKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
        EventHandler.add(this.previewElement, 'mousedown', this.mouseDownHandler, this);
    };
    ViewSource.prototype.unWireEvent = function () {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        if (this.previewElement) {
            EventHandler.remove(this.previewElement, 'mousedown', this.mouseDownHandler);
        }
    };
    ViewSource.prototype.wireBaseKeyDown = function () {
        this.parent.keyboardModule = new KeyboardEvents$1(this.contentModule.getEditPanel(), {
            keyAction: this.parent.keyDown.bind(this.parent), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
    };
    ViewSource.prototype.unWireBaseKeyDown = function () {
        this.parent.keyboardModule.destroy();
    };
    ViewSource.prototype.mouseDownHandler = function (e) {
        this.parent.notify(sourceCodeMouseDown, { args: e });
    };
    ViewSource.prototype.previewKeyDown = function (event) {
        switch (event.action) {
            case 'html-source':
                this.updateSourceCode(event);
                event.preventDefault();
                break;
            case 'toolbar-focus':
                if (this.parent.toolbarSettings.enable) {
                    var selector = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
                    this.parent.toolbarModule.baseToolbar.toolbarObj.element.querySelector(selector).focus();
                }
                break;
        }
    };
    ViewSource.prototype.onKeyDown = function (e) {
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
    };
    /**
     * sourceCode method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.sourceCode = function (args) {
        this.parent.isBlur = false;
        this.parent.trigger(actionBegin, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        var tbItems = selectAll('.' + CLS_TB_ITEM, this.parent.element);
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
            var rteContent = void 0;
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
            var placeHolderWrapper = this.parent.element.querySelector('.rte-placeholder');
            placeHolderWrapper.style.display = 'none';
        }
        this.parent.trigger(actionComplete, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        this.parent.invokeChangeEvent();
    };
    /**
     * updateSourceCode method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.updateSourceCode = function (args) {
        this.parent.isBlur = false;
        this.parent.trigger(actionBegin, { requestType: 'Preview', targetItem: 'Preview', args: args });
        var editHTML = this.getPanel();
        this.parent.notify(updateToolbarItem, {
            targetItem: 'Preview', updateItem: 'SourceCode',
            baseToolbar: this.parent.getBaseToolbarObject()
        });
        var serializeValue = this.parent.serializeValue(editHTML.value);
        var value = (serializeValue === null || serializeValue === '') ? '<p><br/></p>' : serializeValue;
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
            var placeHolderWrapper = this.parent.element.querySelector('.rte-placeholder');
            placeHolderWrapper.style.display = 'block';
        }
        this.parent.trigger(actionComplete, { requestType: 'Preview', targetItem: 'Preview', args: args });
        this.parent.formatter.enableUndo(this.parent);
        this.parent.invokeChangeEvent();
    };
    ViewSource.prototype.getTextAreaValue = function () {
        return (this.contentModule.getEditPanel().innerHTML === '<p><br></p>' ||
            this.contentModule.getEditPanel().innerHTML.length === 12) ||
            (this.contentModule.getEditPanel().childNodes.length === 1 &&
                this.contentModule.getEditPanel().childNodes[0].tagName === 'P' &&
                this.contentModule.getEditPanel().innerHTML.length === 7) ? '' : this.parent.value;
    };
    /**
     * getPanel method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.getPanel = function () {
        return this.parent.element.querySelector('.e-rte-srctextarea');
    };
    /**
     * getViewPanel method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.getViewPanel = function () {
        return (this.parent.iframeSettings.enable && this.getPanel()) ? this.getPanel().parentElement : this.getPanel();
    };
    /**
     * Destroy the entire RichTextEditor.
     * @return {void}
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.destroy = function () {
        this.removeEventListener();
    };
    return ViewSource;
}());

/**
 * `Table` module is used to handle table actions.
 */
var Table = /** @__PURE__ @class */ (function () {
    function Table(parent, serviceLocator) {
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
    Table.prototype.addEventListener = function () {
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
    };
    Table.prototype.removeEventListener = function () {
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
    };
    Table.prototype.afterRender = function () {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        this.parent.on(tableColorPickerChanged, this.setBGColor, this);
        this.parent.on(mouseDown, this.cellSelect, this);
        if (this.parent.tableSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
        }
        if (!Browser.isDevice && this.parent.tableSettings.resize) {
            EventHandler.add(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper, this);
        }
    };
    Table.prototype.dropdownSelect = function (e) {
        var item = e.item;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Table') {
            return;
        }
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        var args = {
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
    };
    Table.prototype.keyDown = function (e) {
        var event = e.args;
        var proxy = this;
        switch (event.action) {
            case 'escape':
                break;
            case 'insert-table':
                if (this.parent.editorMode === 'HTML') {
                    var docElement = this.parent.contentModule.getDocument();
                    var range = this.parent.formatter.editorManager.nodeSelection.getRange(docElement);
                    var selection = this.parent.formatter.editorManager.nodeSelection.save(range, docElement);
                    var args = {
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
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            var selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
            var ele = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)[0];
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
                var closestTd = closest(ele, 'td');
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
    };
    Table.prototype.onToolbarAction = function (args) {
        var item = args.args.item;
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
    };
    Table.prototype.verticalAlign = function (args, e) {
        var tdEle = closest(args.selectParent[0], 'td') || closest(args.selectParent[0], 'th');
        if (tdEle) {
            this.parent.formatter.process(this.parent, e, e, { tableCell: tdEle, subCommand: e.item.subCommand });
        }
    };
    Table.prototype.tableStyles = function (args, command) {
        var table = closest(args.selectParent[0], 'table');
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
    };
    Table.prototype.insideList = function (range) {
        var blockNodes = this.parent.formatter.editorManager.domNode.blockNodes();
        var nodes = [];
        for (var i = 0; i < blockNodes.length; i++) {
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
    };
    Table.prototype.tabSelection = function (event, selection, ele) {
        var insideList = this.insideList(selection.range);
        if ((event.keyCode === 37 || event.keyCode === 39) && selection.range.startContainer.nodeType === 3 ||
            insideList) {
            return;
        }
        event.preventDefault();
        ele.classList.remove(CLS_TABLE_SEL);
        if (!event.shiftKey && event.keyCode !== 37) {
            var nextElement = (!isNullOrUndefined(ele.nextSibling)) ? ele.nextSibling :
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
            var prevElement = (!isNullOrUndefined(ele.previousSibling)) ? ele.previousSibling :
                (!isNullOrUndefined(closest(ele, 'tr').previousSibling) ?
                    closest(ele, 'tr').previousSibling.childNodes[closest(ele, 'tr').previousSibling.childNodes.length - 1] :
                    (!isNullOrUndefined(closest(ele, 'table').previousSibling)) ?
                        (closest(ele, 'table').previousSibling.nodeName.toLowerCase() === 'td') ? closest(ele, 'table').previousSibling :
                            ele : ele);
            if (ele === prevElement && ele.cellIndex === 0 &&
                closest(ele, 'table').tHead) {
                var clsTble = closest(ele, 'table');
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
    };
    Table.prototype.tableArrowNavigation = function (event, selection, ele) {
        var selText = selection.range.startContainer;
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
    };
    Table.prototype.setBGColor = function (args) {
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
        var selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
        var selectedCell = selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? closest(selectedCell.parentNode, 'td,th') : closest(selectedCell, 'td, th');
        if (selectedCell && (selectedCell.nodeName === 'TD' || selectedCell.nodeName === 'TH')) {
            var items = closest(selectedCell, 'table').querySelectorAll('.' + CLS_TABLE_SEL);
            for (var i = 0; i < items.length; i++) {
                items[i].style.backgroundColor = args.item.value;
            }
            this.parent.formatter.saveData();
        }
    };
    Table.prototype.hideTableQuickToolbar = function () {
        if (this.quickToolObj && this.quickToolObj.tableQTBar && document.body.contains(this.quickToolObj.tableQTBar.element)) {
            this.quickToolObj.tableQTBar.hidePopup();
        }
    };
    Table.prototype.tableHeader = function (selection, e) {
        this.parent.formatter.process(this.parent, e, e.originalEvent, { selection: selection, subCommand: e.item.subCommand });
    };
    Table.prototype.editAreaClickHandler = function (e) {
        if (this.parent.readonly) {
            return;
        }
        var args = e.args;
        var showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.tableQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            var target = args.target;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            var isPopupOpen = this.quickToolObj.tableQTBar.element.classList.contains('e-rte-pop');
            if (isPopupOpen) {
                return;
            }
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
            var closestTable = closest(target, 'table');
            if (target && target.nodeName !== 'A' && target.nodeName !== 'IMG' && (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable)))
                && !(range.startContainer.nodeType === 3 && !range.collapsed)) {
                var range_1 = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.save(range_1, this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                var pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
                    this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
                this.quickToolObj.tableQTBar.showPopup(args.pageX, pageY, target);
                this.parent.formatter.editorManager.nodeSelection.restore();
            }
            else {
                this.hideTableQuickToolbar();
            }
        }
    };
    Table.prototype.tableCellSelect = function (e) {
        var target = e.target;
        var row = Array.prototype.slice.call(target.parentElement.parentElement.children).indexOf(target.parentElement);
        var col = Array.prototype.slice.call(target.parentElement.children).indexOf(target);
        var list = this.dlgDiv.querySelectorAll('.e-rte-tablecell');
        Array.prototype.forEach.call(list, function (item) {
            var parentIndex = Array.prototype.slice.call(item.parentElement.parentElement.children).indexOf(item.parentElement);
            var cellIndex = Array.prototype.slice.call(item.parentElement.children).indexOf(item);
            removeClass([item], 'e-active');
            if (parentIndex <= row && cellIndex <= col) {
                addClass([item], 'e-active');
            }
        });
        this.tblHeader.innerHTML = (col + 1) + 'x' + (row + 1);
    };
    Table.prototype.tableCellLeave = function (e) {
        removeClass(this.dlgDiv.querySelectorAll('.e-rte-tablecell'), 'e-active');
        addClass([this.dlgDiv.querySelector('.e-rte-tablecell')], 'e-active');
        this.tblHeader.innerHTML = 1 + 'x' + 1;
    };
    Table.prototype.tableCellClick = function (e) {
        var target = e.target;
        var row = Array.prototype.slice.call(target.parentElement.parentElement.children).indexOf(target.parentElement) + 1;
        var col = Array.prototype.slice.call(target.parentElement.children).indexOf(target) + 1;
        this.self.tableInsert(row, col, e, this);
    };
    Table.prototype.tableInsert = function (row, col, e, selectionObj) {
        var proxy = (selectionObj.self) ? selectionObj.self : this;
        var startContainer = selectionObj.selection.range.startContainer;
        if (startContainer.nodeName === 'P' && startContainer.textContent.trim() === '' && !(startContainer.childNodes.length > 0)) {
            startContainer.innerHTML = '<br />';
        }
        var parentNode = startContainer.parentNode;
        if (proxy.parent.editorMode === 'HTML' &&
            ((proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')) ||
                (!proxy.parent.iframeSettings.enable && isNullOrUndefined(closest(parentNode, '#' + proxy.contentModule.getPanel().id))))) {
            proxy.contentModule.getEditPanel().focus();
            var range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
            selectionObj.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.contentModule.getDocument());
        }
        var value = {
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
    };
    Table.prototype.cellSelect = function (e) {
        var target = e.args.target;
        var tdNode = closest(target, 'td,th');
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
    };
    Table.prototype.resizeHelper = function (e) {
        if (this.parent.readonly) {
            return;
        }
        var target = e.target || e.targetTouches[0].target;
        var closestTable = closest(target, 'table');
        if (target.nodeName === 'TABLE' || target.nodeName === 'TD' || target.nodeName === 'TH') {
            this.curTable = (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable))
                && (target.nodeName === 'TD' || target.nodeName === 'TH') ?
                closestTable : target;
            this.removeResizeEle();
            this.tableResizeEleCreation(this.curTable, e);
        }
    };
    Table.prototype.tableResizeEleCreation = function (table, e) {
        this.parent.preventDefaultResize(e);
        var columns = Array.prototype.slice.call(table.rows[0].cells, 1);
        var rows = [];
        for (var i = 0; i < table.rows.length; i++) {
            rows.push(Array.prototype.slice.call(table.rows[i].cells, 0, 1)[0]);
        }
        var height = parseInt(getComputedStyle(table).height, 10);
        var width = parseInt(getComputedStyle(table).width, 10);
        var pos = this.calcPos(table);
        for (var i = 0; columns.length > i; i++) {
            var colReEle = this.parent.createElement('span', {
                className: CLS_TB_COL_RES, attrs: {
                    'data-col': (i + 1).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            colReEle.style.cssText = 'height: ' + height + 'px; width: 4px; top: ' + pos.top +
                'px; left:' + (pos.left + this.calcPos(columns[i]).left) + 'px;';
            this.contentModule.getEditPanel().appendChild(colReEle);
        }
        for (var i = 0; rows.length > i; i++) {
            var rowReEle = this.parent.createElement('span', {
                className: CLS_TB_ROW_RES, attrs: {
                    'data-row': (i).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            var rowPosLeft = !isNullOrUndefined(table.getAttribute('cellspacing')) || table.getAttribute('cellspacing') !== '' ?
                0 : this.calcPos(rows[i]).left;
            rowReEle.style.cssText = 'width: ' + width + 'px; height: 4px; top: ' +
                (this.calcPos(rows[i]).top + pos.top + rows[i].offsetHeight - 2) +
                'px; left:' + (rowPosLeft + pos.left) + 'px;';
            this.contentModule.getEditPanel().appendChild(rowReEle);
        }
        var tableReBox = this.parent.createElement('span', {
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
    };
    Table.prototype.removeResizeEle = function () {
        var item = this.contentModule.getEditPanel().querySelectorAll('.e-column-resize, .e-row-resize, .e-table-box');
        if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {
                detach(item[i]);
            }
        }
    };
    Table.prototype.calcPos = function (elem) {
        var parentOffset = {
            top: 0,
            left: 0
        };
        var offset = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var offsetParent = elem.offsetParent || doc.documentElement;
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
    };
    Table.prototype.getPointX = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    };
    Table.prototype.getPointY = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageY;
        }
        else {
            return e.pageY;
        }
    };
    Table.prototype.resizeStart = function (e) {
        var _this = this;
        if (this.parent.readonly) {
            return;
        }
        if (Browser.isDevice) {
            this.resizeHelper(e);
        }
        var target = e.target;
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
                var args = isBlazor() ? { requestType: 'Table' } : { event: e, requestType: 'Table' };
                this.parent.trigger(resizeStart, args, function (resizeStartArgs) {
                    if (resizeStartArgs.cancel) {
                        _this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    };
    Table.prototype.removeHelper = function (e) {
        var cls = e.target.classList;
        if (!(cls.contains('e-reicon')) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper);
            }
            this.pageX = null;
            this.helper = null;
        }
    };
    Table.prototype.appendHelper = function () {
        this.helper = this.parent.createElement('div', {
            className: 'e-table-rhelper'
        });
        if (Browser.isDevice) {
            this.helper.classList.add('e-reicon');
        }
        this.contentModule.getEditPanel().appendChild(this.helper);
        this.setHelperHeight();
    };
    Table.prototype.setHelperHeight = function () {
        var pos = this.calcPos(this.curTable);
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
    };
    Table.prototype.updateHelper = function () {
        var pos = this.calcPos(this.curTable);
        if (this.resizeBtnStat.column) {
            var left = pos.left + this.calcPos(this.columnEle).left - 1;
            this.helper.style.left = left + 'px';
        }
        else {
            var top_1 = this.calcPos(this.rowEle).top + pos.top + this.rowEle.offsetHeight;
            this.helper.style.top = top_1 + 'px';
        }
    };
    Table.prototype.resizing = function (e) {
        var _this = this;
        var pageX = this.getPointX(e);
        var pageY = this.getPointY(e);
        var mouseX = (this.parent.enableRtl) ? -(pageX - this.pageX) : (pageX - this.pageX);
        var mouseY = (this.parent.enableRtl) ? -(pageY - this.pageY) : (pageY - this.pageY);
        this.pageX = pageX;
        this.pageY = pageY;
        var args = isBlazor() ? { requestType: 'table' } : { event: e, requestType: 'table' };
        this.parent.trigger(onResize, args, function (resizingArgs) {
            if (resizingArgs.cancel) {
                _this.cancelResizeAction();
            }
            else {
                var tableReBox = _this.contentModule.getEditPanel().querySelector('.e-table-box');
                var tableWidth = parseInt(getComputedStyle(_this.curTable).width, 10);
                var tableHeight = parseInt(getComputedStyle(_this.curTable).height, 10);
                var paddingSize = +getComputedStyle(_this.contentModule.getEditPanel()).paddingRight.match(/\d/g).join('');
                var rteWidth = _this.contentModule.getEditPanel().offsetWidth - paddingSize * 2;
                if (_this.resizeBtnStat.column) {
                    var cellColl = _this.curTable.rows[0].cells;
                    var width = parseFloat(_this.columnEle.offsetWidth.toLocaleString());
                    var actualwid = width - mouseX;
                    var totalwid = parseFloat(_this.columnEle.offsetWidth.toLocaleString()) +
                        parseFloat(cellColl[_this.colIndex - 1].offsetWidth.toLocaleString());
                    for (var i = 0; i < _this.curTable.rows.length; i++) {
                        if ((totalwid - actualwid) > 20 && actualwid > 20) {
                            var leftColumnWidth = totalwid - actualwid;
                            var rightColWidth = actualwid;
                            _this.curTable.rows[i].cells[_this.colIndex - 1].style.width =
                                _this.convertPixelToPercentage(leftColumnWidth, tableWidth) + '%';
                            _this.curTable.rows[i].cells[_this.colIndex].style.width =
                                _this.convertPixelToPercentage(rightColWidth, tableWidth) + '%';
                        }
                    }
                    _this.updateHelper();
                }
                else if (_this.resizeBtnStat.row) {
                    _this.parent.preventDefaultResize(e);
                    var height = parseFloat(_this.rowEle.clientHeight.toString()) + mouseY;
                    if (height > 20) {
                        _this.rowEle.style.height = height + 'px';
                    }
                    _this.curTable.style.height = '';
                    tableReBox.style.cssText = 'top: ' + (_this.calcPos(_this.curTable).top + tableHeight - 4) +
                        'px; left:' + (_this.calcPos(_this.curTable).left + tableWidth - 4) + 'px;';
                    _this.updateHelper();
                }
                else if (_this.resizeBtnStat.tableBox) {
                    if (!Browser.isDevice) {
                        EventHandler.remove(_this.contentModule.getEditPanel(), 'mouseover', _this.resizeHelper);
                    }
                    var widthType = _this.curTable.style.width.indexOf('%') > -1;
                    _this.curTable.style.width = widthType ? _this.convertPixelToPercentage(tableWidth + mouseX, rteWidth) + '%'
                        : tableWidth + mouseX + 'px';
                    _this.curTable.style.height = tableHeight + mouseY + 'px';
                    tableReBox.classList.add('e-rbox-select');
                    tableReBox.style.cssText = 'top: ' + (_this.calcPos(_this.curTable).top + tableHeight - 4) +
                        'px; left:' + (_this.calcPos(_this.curTable).left + tableWidth - 4) + 'px;';
                }
            }
        });
    };
    Table.prototype.convertPixelToPercentage = function (value, offsetValue) {
        return (value / offsetValue) * 100;
    };
    Table.prototype.cancelResizeAction = function () {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        this.removeResizeEle();
    };
    Table.prototype.resizeEnd = function (e) {
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
        var args = isBlazor() ? { requestType: 'table' } : { event: e, requestType: 'table' };
        this.parent.trigger(resizeStop, args);
        this.parent.formatter.saveData();
    };
    Table.prototype.resizeBtnInit = function () {
        return this.resizeBtnStat = { column: false, row: false, tableBox: false };
    };
    Table.prototype.addRow = function (selectCell, e, tabkey) {
        var cmd;
        if (tabkey) {
            cmd = {
                item: { command: 'Table', subCommand: 'InsertRowAfter' }
            };
        }
        var value = {
            selection: selectCell,
            subCommand: (tabkey) ? cmd.item.subCommand : e.item.subCommand
        };
        this.parent.formatter.process(this.parent, (tabkey) ? cmd : e, e, value);
    };
    Table.prototype.addColumn = function (selectCell, e) {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, width: this.parent.tableSettings.width, subCommand: e.item.subCommand });
    };
    Table.prototype.removeRowColumn = function (selectCell, e) {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: e.item.subCommand });
        this.hideTableQuickToolbar();
    };
    Table.prototype.removeTable = function (selection, args, delKey) {
        var cmd;
        if (delKey) {
            cmd = { item: { command: 'Table', subCommand: 'TableRemove' } };
        }
        var value = {
            selection: selection,
            subCommand: (delKey) ? cmd.item.subCommand : args.item.subCommand
        };
        this.parent.formatter.process(this.parent, (delKey) ? cmd : args, args.originalEvent, value);
        this.contentModule.getEditPanel().focus();
        this.removeResizeEle();
        this.hideTableQuickToolbar();
    };
    Table.prototype.renderDlgContent = function (args) {
        var _this = this;
        if (Browser.isDevice || this.parent.inlineMode.enable) {
            this.insertTableDialog(args);
            return;
        }
        if (this.popupObj) {
            this.popupObj.hide();
            return;
        }
        this.hideTableQuickToolbar();
        var header = '1X1';
        var insertbtn = this.l10n.getConstant('inserttablebtn');
        this.dlgDiv = this.parent.createElement('div', { className: 'e-rte-table-popup', id: this.rteID + '_table' });
        this.tblHeader = this.parent.createElement('div', { className: 'e-rte-popup-header' });
        this.tblHeader.innerHTML = header;
        this.dlgDiv.appendChild(this.tblHeader);
        var tableDiv = this.parent.createElement('div', { className: 'e-rte-table-span' });
        this.drawTable(tableDiv, args);
        this.dlgDiv.appendChild(tableDiv);
        this.dlgDiv.appendChild(this.parent.createElement('span', { className: 'e-span-border' }));
        var btnEle = this.parent.createElement('button', {
            className: 'e-insert-table-btn', id: this.rteID + '_insertTable',
            attrs: { type: 'button', tabindex: '0' }
        });
        if (!isNullOrUndefined(this.parent.getToolbarElement().querySelector('.e-expended-nav'))) {
            this.parent.getToolbarElement().querySelector('.e-expended-nav').setAttribute('tabindex', '1');
        }
        this.dlgDiv.appendChild(btnEle);
        var button = new Button({
            iconCss: 'e-icons e-create-table', content: insertbtn, cssClass: 'e-flat',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        button.isStringTemplate = true;
        button.appendTo(btnEle);
        EventHandler.add(btnEle, 'click', this.insertTableDialog, { self: this, args: args.args, selection: args.selection });
        this.parent.getToolbar().appendChild(this.dlgDiv);
        var target = args.args.originalEvent.target;
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
            close: function (event) {
                _this.parent.isBlur = false;
                _this.popupObj.destroy();
                detach(_this.popupObj.element);
                _this.popupObj = null;
            }
        });
        addClass([this.popupObj.element], 'e-popup-open');
        this.popupObj.refreshPosition(target);
    };
    Table.prototype.docClick = function (e) {
        var target = e.args.target;
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
        var closestEle = closest(target, 'td');
        var isExist = closestEle && this.parent.contentModule.getEditPanel().contains(closestEle) ? true : false;
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
    };
    Table.prototype.drawTable = function (tableDiv, args) {
        var rowDiv;
        var tableCell;
        for (var row = 0; row < 3; row++) {
            rowDiv = this.parent.createElement('div', { className: 'e-rte-table-row', attrs: { 'data-column': '' + row } });
            for (var col = 0; col < 10; col++) {
                var display = (row > 2) ? 'none' : 'inline-block';
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
    };
    Table.prototype.editTable = function (args) {
        var _this = this;
        this.createDialog(args);
        var editContent = this.tableDlgContent(args);
        var update = this.l10n.getConstant('dialogUpdate');
        var cancel = this.l10n.getConstant('dialogCancel');
        var editHeader = this.l10n.getConstant('tableEditHeader');
        this.editdlgObj.setProperties({
            height: 'initial', width: '290px', content: editContent, header: editHeader,
            buttons: [{
                    click: this.applyProperties.bind(this, args),
                    buttonModel: { content: update, cssClass: 'e-flat e-size-update', isPrimary: true }
                },
                {
                    click: function (e) { _this.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
                }]
        });
        this.editdlgObj.element.style.maxHeight = 'none';
        this.editdlgObj.content.querySelector('input').focus();
        this.hideTableQuickToolbar();
    };
    Table.prototype.insertTableDialog = function (args) {
        var proxy = (this.self) ? this.self : this;
        if (proxy.popupObj) {
            proxy.popupObj.hide();
        }
        proxy.createDialog(args);
        var dlgContent = proxy.tableCellDlgContent();
        var insert = proxy.l10n.getConstant('dialogInsert');
        var cancel = proxy.l10n.getConstant('dialogCancel');
        proxy.editdlgObj.setProperties({
            height: 'initial', width: '290px', content: dlgContent,
            buttons: [{
                    click: proxy.customTable.bind(this, args),
                    buttonModel: { content: insert, cssClass: 'e-flat e-insert-table', isPrimary: true }
                },
                {
                    click: function (e) { proxy.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
                }]
        });
        proxy.editdlgObj.element.style.maxHeight = 'none';
        proxy.editdlgObj.content.querySelector('input').focus();
    };
    Table.prototype.tableCellDlgContent = function () {
        var tableColumn = this.l10n.getConstant('columns');
        var tableRow = this.l10n.getConstant('rows');
        var tableWrap = this.parent.createElement('div', { className: 'e-cell-wrap' });
        var content = '<div class="e-rte-field"><input type="text" '
            + ' data-role ="none" id="tableColumn" class="e-table-column"/></div>'
            + '<div class="e-rte-field"><input type="text" data-role ="none" id="tableRow" class="e-table-row" /></div>';
        var contentElem = parseHtml(content);
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
    };
    Table.prototype.createDialog = function (args) {
        var _this = this;
        if (this.editdlgObj) {
            this.editdlgObj.hide({ returnValue: true });
            return;
        }
        var tableDialog = this.parent.createElement('div', { className: 'e-rte-edit-table', id: this.rteID + '_tabledialog' });
        this.parent.element.appendChild(tableDialog);
        var insert = this.l10n.getConstant('dialogInsert');
        var cancel = this.l10n.getConstant('dialogCancel');
        var header = this.l10n.getConstant('tabledialogHeader');
        var dialogModel = {
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
                    click: function (e) { _this.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
                }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: function (event) {
                _this.parent.isBlur = false;
                _this.editdlgObj.destroy();
                detach(_this.editdlgObj.element);
                _this.dialogRenderObj.close(event);
                _this.editdlgObj = null;
            }
        };
        this.editdlgObj = this.dialogRenderObj.render(dialogModel);
        this.editdlgObj.appendTo(tableDialog);
        if (this.quickToolObj && this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
            this.quickToolObj.inlineQTBar.hidePopup();
        }
    };
    Table.prototype.customTable = function (args, e) {
        var proxy = (this.self) ? this.self : this;
        if (proxy.rowTextBox.value && proxy.columnTextBox.value) {
            var argument = ((Browser.isDevice || (!isNullOrUndefined(args.args)
                && !isNullOrUndefined(args.args.originalEvent) &&
                args.args.originalEvent.action === 'insert-table')
                || proxy.parent.inlineMode.enable) ? args : this);
            proxy.tableInsert(proxy.rowTextBox.value, proxy.columnTextBox.value, e, argument);
        }
    };
    Table.prototype.cancelDialog = function (e) {
        this.parent.isBlur = false;
        this.editdlgObj.hide({ returnValue: true });
    };
    Table.prototype.applyProperties = function (args, e) {
        var dialogEle = this.editdlgObj.element;
        var table = closest(args.selectNode[0], 'table');
        table.style.width = dialogEle.querySelector('.e-table-width').value + 'px';
        if (dialogEle.querySelector('.e-cell-padding').value !== '') {
            var tdElm = table.querySelectorAll('td');
            for (var i = 0; i < tdElm.length; i++) {
                var padVal = '';
                if (tdElm[i].style.padding === '') {
                    padVal = tdElm[i].getAttribute('style') + ' padding:' +
                        dialogEle.querySelector('.e-cell-padding').value + 'px;';
                }
                else {
                    tdElm[i].style.padding = dialogEle.querySelector('.e-cell-padding').value + 'px';
                    padVal = tdElm[i].getAttribute('style');
                }
                tdElm[i].setAttribute('style', padVal);
            }
        }
        table.cellSpacing = dialogEle.querySelector('.e-cell-spacing').value;
        if (!isNullOrUndefined(table.cellSpacing) || table.cellSpacing !== '0') {
            addClass([table], CLS_TABLE_BORDER);
        }
        else {
            removeClass([table], CLS_TABLE_BORDER);
        }
        this.parent.formatter.saveData();
        this.editdlgObj.hide({ returnValue: true });
    };
    Table.prototype.tableDlgContent = function (e) {
        var selectNode = e.selectParent[0];
        var tableWidth = this.l10n.getConstant('tableWidth');
        var cellPadding = this.l10n.getConstant('cellpadding');
        var cellSpacing = this.l10n.getConstant('cellspacing');
        var tableWrap = this.parent.createElement('div', { className: 'e-table-sizewrap' });
        var widthVal = closest(selectNode, 'table').getClientRects()[0].width;
        var padVal = closest(selectNode, 'td').style.padding;
        var brdSpcVal = closest(selectNode, 'table').getAttribute('cellspacing');
        var content = '<div class="e-rte-field"><input type="text" data-role ="none" id="tableWidth" class="e-table-width" '
            + ' /></div>' + '<div class="e-rte-field"><input type="text" data-role ="none" id="cellPadding" class="e-cell-padding" />'
            + ' </div><div class="e-rte-field"><input type="text" data-role ="none" id="cellSpacing" class="e-cell-spacing" /></div>';
        var contentElem = parseHtml(content);
        tableWrap.appendChild(contentElem);
        var widthNum = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: widthVal,
            placeholder: tableWidth,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.isStringTemplate = true;
        widthNum.appendTo(tableWrap.querySelector('#tableWidth'));
        var padding = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: padVal !== '' ? parseInt(padVal, null) : 0,
            placeholder: cellPadding,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        padding.isStringTemplate = true;
        padding.appendTo(tableWrap.querySelector('#cellPadding'));
        var spacing = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: brdSpcVal !== '' && !isNullOrUndefined(brdSpcVal) ? parseInt(brdSpcVal, null) : 0,
            placeholder: cellSpacing,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        spacing.isStringTemplate = true;
        spacing.appendTo(tableWrap.querySelector('#cellSpacing'));
        return tableWrap;
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    Table.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     */
    Table.prototype.getModuleName = function () {
        return 'table';
    };
    return Table;
}());

/**
 * Dialog Renderer
 */
var DialogRenderer = /** @__PURE__ @class */ (function () {
    function DialogRenderer(parent) {
        this.parent = parent;
    }
    /**
     * dialog render method
     * @hidden
     * @deprecated
     */
    DialogRenderer.prototype.render = function (e) {
        var dlgObj;
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
    };
    DialogRenderer.prototype.beforeOpen = function (args) {
        this.parent.trigger(beforeDialogOpen, args);
    };
    DialogRenderer.prototype.open = function (args) {
        this.parent.trigger(dialogOpen, args);
    };
    /**
     * dialog close method
     * @hidden
     * @deprecated
     */
    DialogRenderer.prototype.close = function (args) {
        this.parent.trigger(dialogClose, args);
    };
    return DialogRenderer;
}());

/**
 * Renderer
 */

/**
 * @hidden
 * @deprecated
 */
var executeGroup = {
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
    'insertCode': {
        command: 'Formats',
        subCommand: 'Pre',
        value: 'pre'
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
    'insertTable': {
        command: 'Table',
        subCommand: 'CreateTable'
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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var predefinedItems = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments',
    'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo'];
var fontFamily = [
    { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
    { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
    { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' },
    { text: 'Impact', value: 'Impact,Charcoal,sans-serif', cssClass: 'e-impact' },
    { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif', cssClass: 'e-tahoma' },
    { text: 'Times New Roman', value: 'Times New Roman,Times,serif', cssClass: 'e-times-new-roman' },
    { text: 'Verdana', value: 'Verdana,Geneva,sans-serif', cssClass: 'e-verdana' }
];
var fontSize = [
    { text: '8 pt', value: '8pt' },
    { text: '10 pt', value: '10pt' },
    { text: '12 pt', value: '12pt' },
    { text: '14 pt', value: '14pt' },
    { text: '18 pt', value: '18pt' },
    { text: '24 pt', value: '24pt' },
    { text: '36 pt', value: '36pt' }
];
var formatItems = [
    { text: 'Paragraph', value: 'P', cssClass: 'e-paragraph' },
    { text: 'Code', value: 'Pre', cssClass: 'e-code' },
    { text: 'Quotation', value: 'BlockQuote', cssClass: 'e-quote' },
    { text: 'Heading 1', value: 'H1', cssClass: 'e-h1' },
    { text: 'Heading 2', value: 'H2', cssClass: 'e-h2' },
    { text: 'Heading 3', value: 'H3', cssClass: 'e-h3' },
    { text: 'Heading 4', value: 'H4', cssClass: 'e-h4' }
];
var fontColor = {
    'Custom': [
        '', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
        '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
        '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
        '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
        '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
        '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000'
    ]
};
var backgroundColor = {
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
var ToolbarSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$5(ToolbarSettings, _super);
    function ToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ToolbarSettings;
}(ChildProperty));
/**
 * Configures the image settings of the RichTextEditor.
 */
var ImageSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$5(ImageSettings, _super);
    function ImageSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ImageSettings;
}(ChildProperty));
var TableSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$5(TableSettings, _super);
    function TableSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return TableSettings;
}(ChildProperty));
/**
 * Configures the quick toolbar settings of the RichTextEditor.
 */
var QuickToolbarSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$5(QuickToolbarSettings, _super);
    function QuickToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return QuickToolbarSettings;
}(ChildProperty));
/**
 * Configures the Paste Cleanup settings of the RichTextEditor.
 */
var PasteCleanupSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$5(PasteCleanupSettings, _super);
    function PasteCleanupSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return PasteCleanupSettings;
}(ChildProperty));
/**
 * Configures the font family settings of the RichTextEditor.
 */
var FontFamily = /** @__PURE__ @class */ (function (_super) {
    __extends$5(FontFamily, _super);
    function FontFamily() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return FontFamily;
}(ChildProperty));
/**
 * Configures the font size settings of the RichTextEditor.
 */
var FontSize = /** @__PURE__ @class */ (function (_super) {
    __extends$5(FontSize, _super);
    function FontSize() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return FontSize;
}(ChildProperty));
/**
 * Configures the format settings of the RichTextEditor.
 */
var Format = /** @__PURE__ @class */ (function (_super) {
    __extends$5(Format, _super);
    function Format() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Format;
}(ChildProperty));
/**
 * Configures the font Color settings of the RichTextEditor.
 */
var FontColor = /** @__PURE__ @class */ (function (_super) {
    __extends$5(FontColor, _super);
    function FontColor() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return FontColor;
}(ChildProperty));
/**
 * Configures the background Color settings of the RichTextEditor.
 */
var BackgroundColor = /** @__PURE__ @class */ (function (_super) {
    __extends$5(BackgroundColor, _super);
    function BackgroundColor() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return BackgroundColor;
}(ChildProperty));

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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Objects used for configuring the iframe resources properties.
 */
var Resources = /** @__PURE__ @class */ (function (_super) {
    __extends$6(Resources, _super);
    function Resources() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        Property([])
    ], Resources.prototype, "styles", void 0);
    __decorate$3([
        Property([])
    ], Resources.prototype, "scripts", void 0);
    return Resources;
}(ChildProperty));
/**
 * Configures the iframe settings of the RTE.
 */
var IFrameSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$6(IFrameSettings, _super);
    function IFrameSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return IFrameSettings;
}(ChildProperty));

var __extends$7 = (undefined && undefined.__extends) || (function () {
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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the inlineMode property of the RTE.
 */
var InlineMode = /** @__PURE__ @class */ (function (_super) {
    __extends$7(InlineMode, _super);
    function InlineMode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        Property(false)
    ], InlineMode.prototype, "enable", void 0);
    __decorate$4([
        Property(true)
    ], InlineMode.prototype, "onSelection", void 0);
    return InlineMode;
}(ChildProperty));

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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var RichTextEditor = /** @__PURE__ @class */ (function (_super) {
    __extends$4(RichTextEditor, _super);
    function RichTextEditor(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.defaultResetValue = null;
        /**
         * @hidden
         * @deprecated
         */
        _this.isFocusOut = false;
        /**
         * @hidden
         * @deprecated
         */
        _this.isRTE = false;
        /**
         * @hidden
         * @deprecated
         */
        _this.isBlur = true;
        _this.needsID = true;
        return _this;
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.requiredModules = function () {
        var modules = [];
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
        if (this.enableResize) {
            modules.push({ member: 'resize', args: [this] });
        }
        return modules;
    };
    RichTextEditor.prototype.updateEnable = function () {
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
    };
    /**
     * setEnable method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.setEnable = function () {
        this.updateEnable();
        (this.enabled) ? this.eventInitializer() : this.unWireEvents();
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    RichTextEditor.prototype.preRender = function () {
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
    };
    RichTextEditor.prototype.persistData = function () {
        if (this.enablePersistence && this.originalElement.tagName === 'TEXTAREA') {
            this.element.id = this.originalElement.id + '_wrapper';
            var data = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(isNullOrUndefined(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        }
    };
    
    RichTextEditor.prototype.setContainer = function () {
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
        var invalidAttr = ['class', 'style', 'id', 'ejs-for'];
        var htmlAttr = {};
        for (var a = 0; a < this.element.attributes.length; a++) {
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
            var rteOuterWrapper = this.createElement('div', {
                className: this.element.getAttribute('class')
            });
            if (!this.isBlazor()) {
                this.element.innerHTML = '';
            }
            this.element.parentElement.insertBefore(rteOuterWrapper, this.element);
            if (isBlazor()) {
                rteOuterWrapper.appendChild(this.element);
                this.valueContainer = this.createElement('textarea', {
                    id: this.element.id + '-value'
                });
            }
            else {
                this.valueContainer = this.element;
            }
            removeClass([this.valueContainer], this.element.getAttribute('class').split(' '));
            if (this.isBlazor()) {
                addClass([this.element], CLS_RTE_HIDDEN);
            }
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
    };
    /**
     * getPersistData method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    /**
     * Focuses the RichTextEditor component
     * @public
     */
    RichTextEditor.prototype.focusIn = function () {
        if (this.enabled) {
            this.inputElement.focus();
            this.focusHandler({});
        }
    };
    /**
     * Blurs the RichTextEditor component
     * @public
     */
    RichTextEditor.prototype.focusOut = function () {
        if (this.enabled) {
            this.inputElement.blur();
            this.blurHandler({});
        }
    };
    /**
     * Selects all the content in RichTextEditor
     * @public
     */
    RichTextEditor.prototype.selectAll = function () {
        this.notify(selectAll$1, {});
    };
    /**
     * Selects a content range or an element
     * @param {Range} range - Specify the range which you want to select within the content.
     * The method used to select a particular sentence or word or entire document.
     * @public
     */
    RichTextEditor.prototype.selectRange = function (range) {
        this.notify(selectRange, { range: range });
    };
    /**
     * Retrieves the HTML markup content from currently selected content of RichTextEditor.
     * @public
     */
    RichTextEditor.prototype.getSelection = function () {
        var str = '';
        this.notify(getSelectedHtml, {
            callBack: function (txt) {
                str = txt;
            }
        });
        return str;
    };
    /**
     * Executes the commands
     * @param {CommandName} CommandName - Specifies the name of the command to be executed.
     * @param {string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs} value - Specifies the value that you want to execute.
     * @public
     */
    RichTextEditor.prototype.executeCommand = function (commandName, value) {
        value = this.htmlPurifier(commandName, value);
        if (this.editorMode === 'HTML') {
            var range = this.getRange();
            if (this.iframeSettings.enable) {
                this.formatter.editorManager.nodeSelection.Clear(this.element.ownerDocument);
            }
            var toFocus = (this.iframeSettings.enable &&
                range.startContainer === this.inputElement) ? true : !this.inputElement.contains(range.startContainer);
            if (toFocus) {
                this.focusIn();
            }
        }
        var tool = executeGroup[commandName];
        this.formatter.editorManager.execCommand(tool.command, tool.subCommand ? tool.subCommand : (value ? value : tool.value), null, null, (value ? value : tool.value), (value ? value : tool.value));
        this.setPlaceHolder();
    };
    RichTextEditor.prototype.htmlPurifier = function (command, value) {
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
                case 'insertTable':
                    value.width = { minWidth: this.tableSettings.minWidth,
                        maxWidth: this.tableSettings.maxWidth, width: this.tableSettings.width };
                    break;
                case 'insertImage':
                    var temp = this.createElement('img', {
                        attrs: {
                            src: value.url
                        }
                    });
                    var imageValue = this.htmlEditorModule.sanitizeHelper(temp.outerHTML);
                    var url = (imageValue !== '' && (this.createElement('div', {
                        innerHTML: imageValue
                    }).firstElementChild).getAttribute('src')) || null;
                    url = !isNullOrUndefined(url) ? url : '';
                    value.url = url;
                    break;
                case 'createLink':
                    var tempNode = this.createElement('a', {
                        attrs: {
                            href: value.url
                        }
                    });
                    var linkValue = this.htmlEditorModule.sanitizeHelper(tempNode.outerHTML);
                    var href = (linkValue !== '' && (this.createElement('div', {
                        innerHTML: linkValue
                    }).firstElementChild).getAttribute('href')) || null;
                    href = !isNullOrUndefined(href) ? href : '';
                    value.url = href;
                    break;
            }
        }
        return value;
    };
    RichTextEditor.prototype.encode = function (value) {
        var divNode = this.createElement('div');
        divNode.innerText = value.trim();
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    };
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     * @deprecated
     */
    RichTextEditor.prototype.render = function () {
        if (this.value && !this.valueTemplate) {
            this.setProperties({ value: this.serializeValue(this.value) }, true);
        }
        this.renderModule = new Render(this, this.serviceLocator);
        this.sourceCodeModule = new ViewSource(this, this.serviceLocator);
        this.notify(initialLoad, {});
        this.trigger(load);
        this.RTERender();
        var execCommandCallBack$$1 = new ExecCommandCallBack(this);
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
    };
    /**
     * For internal use only - Initialize the event handler
     * @private
     * @deprecated
     */
    RichTextEditor.prototype.eventInitializer = function () {
        this.wireEvents();
    };
    /**
     * For internal use only - keydown the event handler;
     * @private
     * @deprecated
     */
    RichTextEditor.prototype.keyDown = function (e) {
        this.notify(keyDown, { member: 'keydown', args: e });
        this.restrict(e);
        if (this.editorMode === 'HTML' && ((e.which === 8 && e.code === 'Backspace') || (e.which === 46 && e.code === 'Delete'))) {
            var range = this.getRange();
            var startNode = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement :
                range.startContainer;
            if (closest(startNode, 'pre') &&
                (e.which === 8 && range.startContainer.textContent.charCodeAt(range.startOffset - 1) === 8203) ||
                (e.which === 46 && range.startContainer.textContent.charCodeAt(range.startOffset) === 8203)) {
                var regEx = new RegExp(String.fromCharCode(8203), 'g');
                var pointer = e.which === 8 ? range.startOffset - 1 : range.startOffset;
                range.startContainer.textContent = range.startContainer.textContent.replace(regEx, '');
                this.formatter.editorManager.nodeSelection.setCursorPoint(this.contentModule.getDocument(), range.startContainer, pointer);
            }
        }
        if (this.formatter.getUndoRedoStack().length === 0) {
            this.formatter.saveData();
        }
        if (e.action && e.action !== 'paste' || e.which === 9) {
            this.formatter.process(this, null, e);
            switch (e.action) {
                case 'toolbar-focus':
                    if (this.toolbarSettings.enable) {
                        var selector = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
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
    };
    RichTextEditor.prototype.keyUp = function (e) {
        this.notify(keyUp, { member: 'keyup', args: e });
        var allowedKeys = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46;
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
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.serializeValue = function (value) {
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
    };
    /**
     * This method will clean up the HTML against cross-site scripting attack and return the HTML as string.
     * It's only applicable to editorMode as `HTML`.
     * @param {string} value - Specifies the value that you want to sanitize.
     * @return {string}
     */
    RichTextEditor.prototype.sanitizeHtml = function (value) {
        return this.serializeValue(value);
    };
    /**
     * updateValue method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.updateValue = function (value) {
        if (isNullOrUndefined(value)) {
            var inputVal = this.inputElement.innerHTML;
            this.setProperties({ value: isEditableValueEmpty(inputVal) ? null : inputVal });
        }
        else {
            this.setProperties({ value: value });
        }
    };
    RichTextEditor.prototype.triggerEditArea = function (e) {
        if (!isIDevice()) {
            this.notify(editAreaClick, { member: 'editAreaClick', args: e });
        }
        else {
            var touch = (e.touches ? e.changedTouches[0] : e);
            if (this.clickPoints.clientX === touch.clientX && this.clickPoints.clientY === touch.clientY) {
                this.notify(editAreaClick, { member: 'editAreaClick', args: e });
            }
        }
    };
    RichTextEditor.prototype.notifyMouseUp = function (e) {
        var touch = (e.touches ? e.changedTouches[0] : e);
        this.notify(mouseUp, { member: 'mouseUp', args: e,
            touchData: { prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && this.inputElement.textContent.length !== 0) ||
            (this.editorMode === 'Markdown' && this.inputElement.value.length !== 0))) {
            this.notify(toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
    };
    RichTextEditor.prototype.mouseUp = function (e) {
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            var target = e.target;
            var closestTable = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.contentModule.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.ensureModuleInjected = function (module) {
        return this.getInjectedModules().indexOf(module) >= 0;
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.onCopy = function () {
        this.contentModule.getDocument().execCommand('copy', false, null);
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.onCut = function () {
        this.contentModule.getDocument().execCommand('cut', false, null);
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.onPaste = function (e) {
        var _this = this;
        var evenArgs = {
            originalEvent: e,
            cancel: false,
            requestType: 'Paste'
        };
        this.trigger(actionBegin, evenArgs, function (pasteArgs) {
            var currentLength = _this.getText().length;
            var selectionLength = _this.getSelection().length;
            var pastedContentLength = (isNullOrUndefined(e) || isNullOrUndefined(e.clipboardData))
                ? 0 : e.clipboardData.getData('text/plain').length;
            var totalLength = (currentLength - selectionLength) + pastedContentLength;
            if (!pasteArgs.cancel && (_this.maxLength === -1 || totalLength < _this.maxLength)) {
                if (!isNullOrUndefined(_this.pasteCleanupModule)) {
                    _this.notify(pasteClean, { args: e });
                }
                else {
                    var args_1 = { requestType: 'Paste', editorMode: _this.editorMode, event: e };
                    var value = null;
                    if (e && !isNullOrUndefined(e.clipboardData)) {
                        value = e.clipboardData.getData('text/plain');
                    }
                    var file = e && e.clipboardData && e.clipboardData.items.length > 0 ?
                        e.clipboardData.items[0].getAsFile() : null;
                    if (value !== null) {
                        _this.notify(paste, {
                            file: file,
                            args: e,
                            text: value
                        });
                    }
                    setTimeout(function () { _this.formatter.onSuccess(_this, args_1); }, 0);
                }
            }
            else {
                e.preventDefault();
            }
        });
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.clipboardAction = function (action, event) {
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
    };
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    RichTextEditor.prototype.destroy = function () {
        this.notify(destroy, {});
        this.destroyDependentModules();
        if (!isNullOrUndefined(this.timeInterval)) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        this.unWireEvents();
        if (this.originalElement.tagName === 'TEXTAREA') {
            if (isBlazor()) {
                detach(this.valueContainer);
                this.valueContainer = this.element.querySelector('.e-blazor-hidden.e-control.e-richtexteditor');
            }
            this.element.parentElement.insertBefore(this.valueContainer, this.element);
            this.valueContainer.id = this.getID();
            this.valueContainer.removeAttribute('name');
            detach(this.element);
            if (this.originalElement.innerHTML.trim() !== '') {
                this.valueContainer.value = this.originalElement.innerHTML.trim();
                if (!isBlazor()) {
                    this.setProperties({ value: (!isNullOrUndefined(this.initialValue) ? this.initialValue : null) }, true);
                }
            }
            else {
                this.valueContainer.value = !this.isBlazor() ? this.valueContainer.defaultValue : this.defaultResetValue;
            }
            this.element = this.valueContainer;
            for (var i = 0; i < this.originalElement.classList.length; i++) {
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
        _super.prototype.destroy.call(this);
        if (this.enablePersistence) {
            window.localStorage.removeItem(this.getModuleName() + this.element.id);
        }
    };
    RichTextEditor.prototype.removeHtmlAttributes = function () {
        if (this.htmlAttributes) {
            var keys = Object.keys(this.htmlAttributes);
            for (var i = 0; i < keys.length && this.element.hasAttribute(keys[i]); i++) {
                this.element.removeAttribute(keys[i]);
            }
        }
    };
    RichTextEditor.prototype.removeAttributes = function () {
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
    };
    RichTextEditor.prototype.destroyDependentModules = function () {
        /* destroy dependent modules */
        this.renderModule.destroy();
        this.formatter.editorManager.undoRedoManager.destroy();
        this.sourceCodeModule.destroy();
    };
    /**
     * Returns the HTML or Text inside the RichTextEditor.
     * @return {Element}
     */
    RichTextEditor.prototype.getContent = function () {
        if (this.iframeSettings.enable && isBlazor()) {
            return this.inputElement;
        }
        else {
            return this.contentModule.getPanel();
        }
    };
    /**
     * Returns the text content as string.
     * @return {string}
     */
    RichTextEditor.prototype.getText = function () {
        return this.contentModule.getText();
    };
    /**
     * Returns the html value of the selected content as string.
     * @return {string}
     */
    RichTextEditor.prototype.getSelectedHtml = function () {
        var range;
        var wrapperElm = this.createElement('div');
        var selection = this.contentModule.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var selectedHtml = range.cloneContents();
            wrapperElm.appendChild(selectedHtml);
        }
        return wrapperElm.innerHTML;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     * @deprecated
     */
    RichTextEditor.prototype.getModuleName = function () {
        return 'richtexteditor';
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'value':
                    var val = void 0;
                    var nVal = newProp[prop];
                    val = this.editorMode === 'HTML' ? getEditValue(nVal, this) : nVal;
                    if (!isNullOrUndefined(nVal) && nVal !== '') {
                        this.value = this.serializeValue(((this.enableHtmlEncode) ? this.encode(decode(val)) : val));
                    }
                    this.updatePanelValue();
                    this.setPlaceHolder();
                    this.notify(xhtmlValidation, { module: 'XhtmlValidation', newProp: newProp, oldProp: oldProp });
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
                    var frameSetting = oldProp[prop];
                    if (frameSetting.resources) {
                        var iframe = this.contentModule.getDocument();
                        var header = iframe.querySelector('head');
                        var files = void 0;
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
                    _super.prototype.refresh.call(this);
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
                case 'enableXhtml':
                    this.notify(xhtmlValidation, { module: 'XhtmlValidation', newProp: newProp, oldProp: oldProp });
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
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.updateValueData = function () {
        if (this.enableHtmlEncode) {
            this.setProperties({ value: this.encode(decode(this.inputElement.innerHTML)) }, true);
        }
        else {
            this.setProperties({
                value: /<[a-z][\s\S]*>/i.test(this.inputElement.innerHTML) ? this.inputElement.innerHTML :
                    decode(this.inputElement.innerHTML)
            });
        }
    };
    RichTextEditor.prototype.removeSheets = function (srcList) {
        var i;
        for (i = 0; i < srcList.length; i++) {
            detach(srcList[i]);
        }
    };
    RichTextEditor.prototype.updatePanelValue = function () {
        var value = this.value;
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
    };
    RichTextEditor.prototype.setHeight = function (height) {
        if (height !== 'auto') {
            this.element.style.height = formatUnit(height);
        }
        else {
            this.element.style.height = 'auto';
        }
    };
    /**
     * setPlaceHolder method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.setPlaceHolder = function () {
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
                if (this.inputElement.textContent.length === 0 &&
                    !isNullOrUndefined(this.inputElement.firstChild) && this.inputElement.firstChild.nodeName === 'P' &&
                    !isNullOrUndefined(this.inputElement.firstChild.firstChild) && this.inputElement.firstChild.firstChild.nodeName === 'BR') {
                    this.placeHolderWrapper.style.display = 'block';
                }
                else {
                    this.placeHolderWrapper.style.display = 'none';
                }
            }
            else {
                this.inputElement.setAttribute('placeholder', this.placeholder);
            }
        }
    };
    RichTextEditor.prototype.setWidth = function (width) {
        if (width !== 'auto') {
            setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        }
        else {
            this.element.style.width = 'auto';
        }
    };
    RichTextEditor.prototype.setCssClass = function (cssClass) {
        if (!isNullOrUndefined(cssClass)) {
            this.element.classList.add(cssClass);
        }
    };
    RichTextEditor.prototype.updateRTL = function () {
        this.notify(rtlMode, { enableRtl: this.enableRtl });
        if (this.enableRtl) {
            this.element.classList.add(CLS_RTL);
        }
        else {
            this.element.classList.remove(CLS_RTL);
        }
    };
    RichTextEditor.prototype.updateReadOnly = function () {
        this.notify(readOnlyMode, { editPanel: this.inputElement, mode: this.readonly });
    };
    /**
     * setReadOnly method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.setReadOnly = function (initial) {
        this.updateReadOnly();
        if (!initial) {
            if (this.readonly && this.enabled) {
                this.unbindEvents();
            }
            else if (this.enabled) {
                this.bindEvents();
            }
        }
    };
    /**
     * By default, prints all the pages of the RichTextEditor.
     * @return {void}
     */
    RichTextEditor.prototype.print = function () {
        var _this = this;
        var printWind;
        var printArgs = {
            element: this.inputElement,
            requestType: 'print',
            cancel: false
        };
        this.trigger(actionBegin, printArgs, function (printingArgs) {
            printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
            if (Browser.info.name === 'msie') {
                printWind.resizeTo(screen.availWidth, screen.availHeight);
            }
            printWind = print(_this.inputElement, printWind);
            if (!printingArgs.cancel) {
                var actionArgs = {
                    requestType: 'print'
                };
                _this.trigger(actionComplete, actionArgs);
            }
        });
    };
    /**
     * Refresh the view of the editor.
     * @public
     */
    RichTextEditor.prototype.refreshUI = function () {
        this.renderModule.refresh();
    };
    /**
     * Shows the RichTextEditor component in full-screen mode.
     */
    RichTextEditor.prototype.showFullScreen = function () {
        if (this.readonly) {
            return;
        }
        this.fullScreenModule.showFullScreen();
    };
    /**
     * Enables the give toolbar items in the RichTextEditor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be enable in Rich Text Editor’s Toolbar.
     * @public
     */
    RichTextEditor.prototype.enableToolbarItem = function (items, muteToolbarUpdate) {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, true, muteToolbarUpdate);
    };
    /**
     * Disables the given toolbar items in the RichTextEditor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be disable in Rich Text Editor’s Toolbar.
     * @public
     */
    RichTextEditor.prototype.disableToolbarItem = function (items, muteToolbarUpdate) {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, false, muteToolbarUpdate);
    };
    /**
     * Removes the give toolbar items from the RichTextEditor component.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be remove from Rich Text Editor’s Toolbar.
     * @public
     */
    RichTextEditor.prototype.removeToolbarItem = function (items) {
        this.toolbarModule.removeTBarItems(items);
    };
    /**
     * Get the selected range from the RichTextEditor's content.
     * @public
     * @deprecated
     */
    RichTextEditor.prototype.getRange = function () {
        return this.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
    };
    RichTextEditor.prototype.initializeServices = function () {
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('rteLocale', this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale));
        this.serviceLocator.register('dialogRenderObject', new DialogRenderer(this));
    };
    RichTextEditor.prototype.RTERender = function () {
        var rendererFactory = this.serviceLocator.getService('rendererFactory');
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
    };
    RichTextEditor.prototype.setIframeSettings = function () {
        if (this.iframeSettings.resources) {
            var styleSrc = this.iframeSettings.resources.styles;
            var scriptSrc = this.iframeSettings.resources.scripts;
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
    };
    RichTextEditor.prototype.InjectSheet = function (scriptSheet, srcList) {
        try {
            if (srcList && srcList.length > 0) {
                var iFrame = this.contentModule.getDocument();
                var target = iFrame.querySelector('head');
                for (var i = 0; i < srcList.length; i++) {
                    if (scriptSheet) {
                        var scriptEle = this.createScriptElement();
                        scriptEle.src = srcList[i];
                        target.appendChild(scriptEle);
                    }
                    else {
                        var styleEle = this.createStyleElement();
                        styleEle.href = srcList[i];
                        target.appendChild(styleEle);
                    }
                }
            }
        }
        catch (e) {
            return;
        }
    };
    RichTextEditor.prototype.createScriptElement = function () {
        var scriptEle = this.createElement('script', {
            className: CLS_SCRIPT_SHEET
        });
        scriptEle.type = 'text/javascript';
        return scriptEle;
    };
    RichTextEditor.prototype.createStyleElement = function () {
        var styleEle = this.createElement('link', {
            className: CLS_STYLE_SHEET
        });
        styleEle.rel = 'stylesheet';
        return styleEle;
    };
    RichTextEditor.prototype.isBlazor = function () {
        return ((Object.keys(window).indexOf('ejsInterop') === -1) ? false : true);
    };
    RichTextEditor.prototype.setValue = function () {
        if (this.valueTemplate) {
            if (typeof this.valueTemplate === 'string') {
                this.setProperties({ value: this.valueTemplate });
            }
            else {
                var compiledString = void 0;
                compiledString = compile(this.valueTemplate);
                var compiledTemplate = compiledString({});
                for (var i = 0; i < compiledTemplate.length; i++) {
                    var item = compiledTemplate[i];
                    append([item], this.element);
                }
                this.setProperties({ value: this.element.innerHTML.trim() });
            }
        }
        else {
            var innerHtml = !isNullOrUndefined(this.element.innerHTML) && this.element.innerHTML.replace(/<(\/?|\!?)(!--!--)>/g, '').trim();
            if (innerHtml !== '') {
                if (this.element.tagName === 'TEXTAREA') {
                    this.setProperties({ value: decode(innerHtml) });
                }
                else {
                    this.setProperties({ value: innerHtml });
                }
            }
        }
    };
    /**
     * setContentHeight method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.setContentHeight = function (target, isExpand) {
        var heightValue;
        var topValue = 0;
        var cntEle = (this.sourceCodeModule.getPanel() &&
            this.sourceCodeModule.getPanel().parentElement.style.display === 'block') ? this.sourceCodeModule.getPanel().parentElement :
            this.contentModule.getPanel();
        var rteHeight = this.element.offsetHeight;
        var tbHeight = this.getToolbar() ? this.toolbarModule.getToolbarHeight() : 0;
        var rzHeight = this.enableResize ?
            this.element.querySelector('.' + CLS_RTE_RES_HANDLE).offsetHeight + 8 : 0;
        var expandPopHeight = this.getToolbar() ? this.toolbarModule.getExpandTBarPopHeight() : 0;
        if (this.toolbarSettings.type === ToolbarType.Expand && isExpand && target !== 'preview') {
            heightValue = (this.height === 'auto' && rzHeight === 0) ? 'auto' : rteHeight - (tbHeight + expandPopHeight + rzHeight) + 'px';
            topValue = (!this.toolbarSettings.enableFloating) ? expandPopHeight : 0;
        }
        else {
            if (this.height === 'auto' && !(this.element.classList.contains('e-rte-full-screen'))) {
                heightValue = 'auto';
            }
            else {
                heightValue = rteHeight - (tbHeight + rzHeight) + 'px';
            }
        }
        setStyleAttribute(cntEle, { height: heightValue, marginTop: topValue + 'px' });
        if (this.iframeSettings.enable && target === 'sourceCode') {
            var codeElement = select('.' + CLS_RTE_CONTENT, this.element);
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
        if (rzHeight === 0) {
            this.autoResize();
        }
    };
    /**
     * Retrieves the HTML from RichTextEditor.
     * @public
     */
    RichTextEditor.prototype.getHtml = function () {
        return this.value;
    };
    /**
     * Shows the source HTML/MD markup.
     * @public
     */
    RichTextEditor.prototype.showSourceCode = function () {
        if (this.readonly) {
            return;
        }
        this.notify(sourceCode, {});
    };
    /**
     * Returns the maximum number of characters in the Rich Text Editor.
     * @public
     */
    RichTextEditor.prototype.getCharCount = function () {
        var htmlText = this.editorMode === 'Markdown' ? this.inputElement.value.trim() :
            this.inputElement.textContent.trim();
        return htmlText.length;
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.getBaseToolbarObject = function () {
        var tbObj;
        if (this.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            tbObj = this.quickToolbarModule && this.quickToolbarModule.getInlineBaseToolbar();
        }
        else {
            tbObj = this.toolbarModule && this.toolbarModule.getBaseToolbar();
        }
        return tbObj;
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.getToolbar = function () {
        return this.toolbarModule ? this.toolbarModule.getToolbarElement() : null;
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.getToolbarElement = function () {
        return this.toolbarModule && this.toolbarModule.getToolbarElement();
    };
    /**
     * getID method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.getID = function () {
        return (this.originalElement.tagName === 'TEXTAREA' ? this.valueContainer.id : this.element.id);
    };
    RichTextEditor.prototype.mouseDownHandler = function (e) {
        var touch = (e.touches ? e.changedTouches[0] : e);
        addClass([this.element], [CLS_FOCUS]);
        this.preventDefaultResize(e);
        this.notify(mouseDown, { args: e });
        this.clickPoints = { clientX: touch.clientX, clientY: touch.clientY };
    };
    RichTextEditor.prototype.preventImgResize = function (e) {
        if (e.target.nodeName.toLocaleLowerCase() === 'img') {
            e.preventDefault();
        }
    };
    /**
     * preventDefaultResize method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.preventDefaultResize = function (e) {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().addEventListener('mscontrolselect', this.preventImgResize);
        }
        else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', false, 'false');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', false, 'false');
        }
    };
    RichTextEditor.prototype.defaultResize = function (e) {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().removeEventListener('mscontrolselect', this.preventImgResize);
        }
        else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', true, 'true');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', true, 'true');
        }
    };
    RichTextEditor.prototype.resizeHandler = function () {
        var isExpand = false;
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            this.toolbarModule.refreshToolbarOverflow();
            isExpand = this.toolbarModule.baseToolbar.toolbarObj.element.classList.contains(CLS_EXPAND_OPEN);
        }
        this.setContentHeight('', isExpand);
    };
    RichTextEditor.prototype.scrollHandler = function (e) {
        this.notify(scroll, { args: e });
    };
    RichTextEditor.prototype.contentScrollHandler = function (e) {
        this.notify(contentscroll, { args: e });
    };
    RichTextEditor.prototype.focusHandler = function (e) {
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
            var active = document.activeElement;
            if (active === this.element || active === this.getToolbarElement() || active === this.contentModule.getEditPanel()
                || ((this.iframeSettings.enable && active === this.contentModule.getPanel()) &&
                    e.target && !e.target.classList.contains('e-img-inner')
                    && (e.target && e.target.parentElement
                        && !e.target.parentElement.classList.contains('e-img-wrap')))
                || closest(active, '.e-rte-toolbar') === this.getToolbarElement()) {
                this.contentModule.getEditPanel().focus();
                if (!isNullOrUndefined(this.getToolbarElement())) {
                    this.getToolbarElement().setAttribute('tabindex', '-1');
                    var items = this.getToolbarElement().querySelectorAll('[tabindex="0"]');
                    for (var i = 0; i < items.length; i++) {
                        items[i].setAttribute('tabindex', '-1');
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
            var toolbarItem = this.getToolbarElement().querySelectorAll('input,select,button,a,[tabindex]');
            for (var i = 0; i < toolbarItem.length; i++) {
                if ((!toolbarItem[i].classList.contains('e-rte-dropdown-btn') &&
                    !toolbarItem[i].classList.contains('e-insert-table-btn')) &&
                    (!toolbarItem[i].hasAttribute('tabindex') ||
                        toolbarItem[i].getAttribute('tabindex') !== '-1')) {
                    toolbarItem[i].setAttribute('tabindex', '-1');
                }
            }
        }
    };
    RichTextEditor.prototype.getUpdatedValue = function () {
        var value;
        if (this.editorMode === 'HTML') {
            value = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
        }
        else {
            value = this.inputElement.value === '' ? null :
                this.inputElement.value;
        }
        return value;
    };
    RichTextEditor.prototype.updateIntervalValue = function () {
        this.setProperties({ value: this.getUpdatedValue() }, true);
        this.valueContainer.value = this.value;
        this.invokeChangeEvent();
    };
    RichTextEditor.prototype.onDocumentClick = function (e) {
        var target = e.target;
        var rteElement = closest(target, '.' + CLS_RTE);
        if (!this.element.contains(e.target) && document !== e.target && rteElement !== this.element &&
            !closest(target, '[aria-owns="' + this.getID() + '"]')) {
            this.isBlur = true;
            this.isRTE = false;
        }
        this.notify(docClick, { args: e });
    };
    RichTextEditor.prototype.blurHandler = function (e) {
        var trg = e.relatedTarget;
        if (trg) {
            var rteElement = closest(trg, '.' + CLS_RTE);
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
            var value = this.getUpdatedValue();
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
    };
    /**
     * invokeChangeEvent method
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.invokeChangeEvent = function () {
        var eventArgs = {
            value: this.value
        };
        if (this.value !== this.cloneValue) {
            this.trigger('change', eventArgs);
            this.cloneValue = this.value;
        }
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.wireScrollElementsEvents = function () {
        this.scrollParentElements = getScrollableParent(this.element);
        for (var _i = 0, _a = this.scrollParentElements; _i < _a.length; _i++) {
            var element = _a[_i];
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.add(this.contentModule.getPanel(), 'scroll', this.contentScrollHandler, this);
        }
    };
    RichTextEditor.prototype.wireContextEvent = function () {
        if (this.quickToolbarSettings.showOnRightClick) {
            EventHandler.add(this.inputElement, 'contextmenu', this.contextHandler, this);
            if (Browser.isDevice) {
                this.touchModule = new Touch(this.inputElement, { tapHold: this.touchHandler.bind(this), tapHoldThreshold: 500 });
            }
        }
    };
    RichTextEditor.prototype.unWireContextEvent = function () {
        EventHandler.remove(this.inputElement, 'contextmenu', this.contextHandler);
        if (Browser.isDevice && this.touchModule) {
            this.touchModule.destroy();
        }
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.unWireScrollElementsEvents = function () {
        this.scrollParentElements = getScrollableParent(this.element);
        for (var _i = 0, _a = this.scrollParentElements; _i < _a.length; _i++) {
            var element = _a[_i];
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.remove(this.contentModule.getPanel(), 'scroll', this.contentScrollHandler);
        }
    };
    RichTextEditor.prototype.touchHandler = function (e) {
        this.notifyMouseUp(e.originalEvent);
        this.triggerEditArea(e.originalEvent);
    };
    RichTextEditor.prototype.contextHandler = function (e) {
        var closestElem = closest(e.target, 'a, table, img');
        if (this.inlineMode.onSelection === false || (!isNullOrUndefined(closestElem) && this.inputElement.contains(closestElem)
            && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A'))) {
            e.preventDefault();
        }
    };
    RichTextEditor.prototype.resetHandler = function () {
        var defaultValue = this.valueContainer.defaultValue.trim();
        this.setProperties({ value: defaultValue === '' ? null : (this.isBlazor() ? this.defaultResetValue : defaultValue) });
    };
    /**
     * @hidden
     * @deprecated
     */
    RichTextEditor.prototype.autoResize = function () {
        var _this = this;
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                setTimeout(function () { _this.setAutoHeight(_this.inputElement); }, 0);
            }
            else if (this.iframeSettings.enable) {
                var iframeElement_1 = this.element.querySelector('#' + this.getID() + '_rte-view');
                setTimeout(function () { _this.setAutoHeight(iframeElement_1); }, 100);
                this.inputElement.style.overflow = 'hidden';
            }
        }
        else {
            this.inputElement.style.overflow = null;
        }
    };
    RichTextEditor.prototype.setAutoHeight = function (element) {
        element.style.height = '';
        element.style.height = this.inputElement.scrollHeight + 'px';
        element.style.overflow = 'hidden';
    };
    RichTextEditor.prototype.wireEvents = function () {
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        if (this.readonly && this.enabled) {
            return;
        }
        this.bindEvents();
    };
    RichTextEditor.prototype.restrict = function (e) {
        if (this.maxLength >= 0) {
            var element = this.editorMode === 'Markdown' ? this.contentModule.getText() :
                e.currentTarget.textContent.trim();
            var array = [8, 16, 17, 37, 38, 39, 40, 46, 65];
            var arrayKey = void 0;
            for (var i = 0; i <= array.length - 1; i++) {
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
    };
    RichTextEditor.prototype.bindEvents = function () {
        this.keyboardModule = new KeyboardEvents$1(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs: __assign({}, this.formatter.keyConfig, this.keyConfig), eventName: 'keydown'
        });
        var formElement = closest(this.valueContainer, 'form');
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
            EventHandler.add(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown, this);
        }
        this.wireScrollElementsEvents();
    };
    RichTextEditor.prototype.onIframeMouseDown = function (e) {
        this.isBlur = false;
        this.notify(iframeMouseDown, e);
    };
    RichTextEditor.prototype.editorKeyDown = function (e) {
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
    };
    RichTextEditor.prototype.unWireEvents = function () {
        this.element.removeEventListener('focusin', this.onFocusHandler, true);
        this.element.removeEventListener('focusout', this.onBlurHandler, true);
        if (this.readonly && this.enabled) {
            return;
        }
        this.unbindEvents();
    };
    RichTextEditor.prototype.unbindEvents = function () {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        var formElement = closest(this.valueContainer, 'form');
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
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
        }
        this.unWireScrollElementsEvents();
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
        Property(false)
    ], RichTextEditor.prototype, "enableResize", void 0);
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
        Property(true)
    ], RichTextEditor.prototype, "enableHtmlSanitizer", void 0);
    __decorate$1([
        Property(false)
    ], RichTextEditor.prototype, "enableHtmlEncode", void 0);
    __decorate$1([
        Property(false)
    ], RichTextEditor.prototype, "enableXhtml", void 0);
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
    return RichTextEditor;
}(Component));

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

export { Toolbar$1 as Toolbar, KeyboardEvents$1 as KeyboardEvents, BaseToolbar, BaseQuickToolbar, QuickToolbar, Count, ColorPickerInput, MarkdownToolbarStatus, ExecCommandCallBack, ToolbarAction, MarkdownEditor, HtmlEditor, PasteCleanup, Resize, DropDownButtons, FullScreen, setAttributes, HtmlToolbarStatus, XhtmlValidation, HTMLFormatter, Formatter, MarkdownFormatter, ContentRender, Render, ToolbarRenderer, Link, Image, ViewSource, Table, DialogRenderer, IframeContentRender, MarkdownRender, PopupRenderer, RichTextEditor, RenderType, ToolbarType, executeGroup, created, destroyed, load, initialLoad, initialEnd, iframeMouseDown, destroy, toolbarClick, toolbarRefresh, refreshBegin, toolbarUpdated, bindOnEnd, renderColorPicker, htmlToolbarClick, markdownToolbarClick, destroyColorPicker, modelChanged, keyUp, keyDown, mouseUp, toolbarCreated, toolbarRenderComplete, enableFullScreen, disableFullScreen, dropDownSelect, beforeDropDownItemRender, execCommandCallBack, imageToolbarAction, linkToolbarAction, resizeStart, onResize, resizeStop, undo, redo, insertLink, unLink, editLink, openLink, actionBegin, actionComplete, toolbarStatusUpdate, actionSuccess, updateToolbarItem, insertImage, insertCompleted, imageLeft, imageRight, imageCenter, imageBreak, imageInline, imageLink, imageAlt, imageDelete, imageCaption, imageSize, sourceCode, updateSource, toolbarOpen, beforeDropDownOpen, selectionSave, selectionRestore, expandPopupClick, count, contentFocus, contentBlur, mouseDown, sourceCodeMouseDown, editAreaClick, scroll, contentscroll, colorPickerChanged, tableColorPickerChanged, focusChange, selectAll$1 as selectAll, selectRange, getSelectedHtml, renderInlineToolbar, paste, imgModule, rtlMode, createTable, docClick, tableToolbarAction, checkUndo, readOnlyMode, pasteClean, beforeDialogOpen, dialogOpen, dialogClose, beforeQuickToolbarOpen, quickToolbarOpen, quickToolbarClose, popupHide, imageSelected, imageUploading, imageUploadSuccess, imageUploadFailed, imageRemoving, drop, xhtmlValidation, CLS_RTE, CLS_RTL, CLS_CONTENT, CLS_DISABLED, CLS_SCRIPT_SHEET, CLS_STYLE_SHEET, CLS_TOOLBAR, CLS_TB_FIXED, CLS_TB_FLOAT, CLS_TB_ABS_FLOAT, CLS_INLINE, CLS_TB_INLINE, CLS_RTE_EXPAND_TB, CLS_FULL_SCREEN, CLS_QUICK_TB, CLS_POP, CLS_QUICK_POP, CLS_QUICK_DROPDOWN, CLS_IMAGE_POP, CLS_INLINE_POP, CLS_INLINE_DROPDOWN, CLS_DROPDOWN_POPUP, CLS_DROPDOWN_ICONS, CLS_DROPDOWN_ITEMS, CLS_DROPDOWN_BTN, CLS_RTE_CONTENT, CLS_TB_ITEM, CLS_TB_EXTENDED, CLS_TB_WRAP, CLS_POPUP, CLS_SEPARATOR, CLS_MINIMIZE, CLS_MAXIMIZE, CLS_BACK, CLS_SHOW, CLS_HIDE, CLS_VISIBLE, CLS_FOCUS, CLS_RM_WHITE_SPACE, CLS_IMGRIGHT, CLS_IMGLEFT, CLS_IMGCENTER, CLS_IMGBREAK, CLS_CAPTION, CLS_RTE_CAPTION, CLS_CAPINLINE, CLS_IMGINLINE, CLS_COUNT, CLS_WARNING, CLS_ERROR, CLS_ICONS, CLS_ACTIVE, CLS_EXPAND_OPEN, CLS_RTE_ELEMENTS, CLS_TB_BTN, CLS_HR_SEPARATOR, CLS_TB_IOS_FIX, CLS_TB_STATIC, CLS_FORMATS_TB_BTN, CLS_FONT_NAME_TB_BTN, CLS_FONT_SIZE_TB_BTN, CLS_FONT_COLOR_TARGET, CLS_BACKGROUND_COLOR_TARGET, CLS_COLOR_CONTENT, CLS_FONT_COLOR_DROPDOWN, CLS_BACKGROUND_COLOR_DROPDOWN, CLS_COLOR_PALETTE, CLS_FONT_COLOR_PICKER, CLS_BACKGROUND_COLOR_PICKER, CLS_RTE_READONLY, CLS_TABLE_SEL, CLS_TB_DASH_BOR, CLS_TB_ALT_BOR, CLS_TB_COL_RES, CLS_TB_ROW_RES, CLS_TB_BOX_RES, CLS_RTE_HIDDEN, CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT, CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL, CLS_RTE_DIALOG_MIN_HEIGHT, CLS_RTE_RES_HANDLE, CLS_RTE_RES_EAST, CLS_RTE_IMAGE, CLS_RESIZE, CLS_IMG_FOCUS, CLS_RTE_DRAG_IMAGE, CLS_RTE_UPLOAD_POPUP, CLS_POPUP_OPEN, CLS_IMG_RESIZE, CLS_DROPAREA, CLS_IMG_INNER, CLS_UPLOAD_FILES, CLS_RTE_DIALOG_UPLOAD, CLS_RTE_RES_CNT, CLS_CUSTOM_TILE, CLS_NOCOLOR_ITEM, CLS_TABLE_BORDER, getIndex, hasClass, getDropDownValue, isIDevice, getFormattedFontSize, pageYOffset, getTooltipText, setToolbarStatus, getCollection, getTBarItemsIndex, updateUndoRedoStatus, dispatchEvent, parseHtml, getTextNodesUnder, toObjectLowerCase, getEditValue, updateTextNode, isEditableValueEmpty, decode, sanitizeHelper, convertToBlob, ServiceLocator, RendererFactory, EditorManager, IMAGE, TABLE, LINK, INSERT_ROW, INSERT_COLUMN, DELETEROW, DELETECOLUMN, REMOVETABLE, TABLEHEADER, TABLE_VERTICAL_ALIGN, ALIGNMENT_TYPE, INDENT_TYPE, DEFAULT_TAG, BLOCK_TAGS, IGNORE_BLOCK_TAGS, TABLE_BLOCK_TAGS, SELECTION_TYPE, INSERTHTML_TYPE, INSERT_TEXT_TYPE, CLEAR_TYPE, CLASS_IMAGE_RIGHT, CLASS_IMAGE_LEFT, CLASS_IMAGE_CENTER, CLASS_IMAGE_BREAK, CLASS_CAPTION, CLASS_RTE_CAPTION, CLASS_CAPTION_INLINE, CLASS_IMAGE_INLINE, Lists, markerClassName, DOMNode, Alignments, Indents, Formats, LinkCommand, InsertMethods, InsertTextExec, InsertHtmlExec, InsertHtml, IsFormatted, MsWordPaste, NodeCutter, ImageCommand, SelectionCommands, SelectionBasedExec, ClearFormatExec, UndoRedoManager, TableCommand, statusCollection, ToolbarStatus, NodeSelection, MarkdownParser, LISTS_COMMAND, selectionCommand, LINK_COMMAND, CLEAR_COMMAND, MD_TABLE, ClearFormat, MDLists, MDFormats, MarkdownSelection, UndoRedoCommands, MDSelectionFormats, MDLink, MDTable, markdownFormatTags, markdownSelectionTags, markdownListsTags, htmlKeyConfig, markdownKeyConfig, pasteCleanupGroupingTags, listConversionFilters, selfClosingTags, KEY_DOWN, ACTION, FORMAT_TYPE, KEY_DOWN_HANDLER, LIST_TYPE, KEY_UP_HANDLER, KEY_UP, MODEL_CHANGED_PLUGIN, MODEL_CHANGED, MS_WORD_CLEANUP_PLUGIN, MS_WORD_CLEANUP };
//# sourceMappingURL=ej2-richtexteditor.es5.js.map
