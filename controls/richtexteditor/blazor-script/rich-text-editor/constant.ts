
/**
 * Event constants
 */
export const created: string = 'create';
export const destroyed: string = 'destroy';
export const load: string = 'load';
export const initialLoad: string = 'initial-load';
export const contentChanged: string = 'content-changed';
export const initialEnd: string = 'initial-end';
export const iframeMouseDown: string = 'iframe-click';
export const destroy: string = 'destroy';
export const afterPasteCleanUp: string = 'afterPasteCleanUp';
export const toolbarRefresh: string = 'toolbar-refresh';
export const refreshBegin: string = 'refresh-begin';
export const toolbarUpdated: string = 'toolbar-updated';
export const preventQuickToolbarClose: string = 'preventQuickToolbarClose';
export const bindOnEnd: string = 'bind-on-end';
export const renderColorPicker: string = 'render-color-picker';
export const htmlToolbarClick: string = 'html-toolbar-click';
export const markdownToolbarClick: string = 'markdown-toolbar-click';
export const destroyColorPicker: string = 'destroy-color-picker';
export const modelChanged: string = 'model-changed';
export const keyUp: string = 'keyUp';
export const keyDown: string = 'keyDown';
export const mouseUp: string = 'mouseUp';
export const toolbarCreated: string = 'toolbarCreated';
export const toolbarRenderComplete: string = 'toolbarRenderComplete';
export const enableFullScreen: string = 'enableFullScreen';
export const disableFullScreen: string = 'disableFullScreen';
export const dropDownSelect: string = 'dropDownSelect';
export const beforeDropDownItemRender: string = 'beforeDropDownItemRender';
export const execCommandCallBack: string = 'execCommandCallBack';
export const imageToolbarAction: string = 'image-toolbar-action';
export const audioToolbarAction: string = 'audio-toolbar-action';
export const videoToolbarAction: string = 'video-toolbar-action';
export const linkToolbarAction: string = 'link-toolbar-action';
export const windowResize: string = 'resize';
export const resizeStart: string = 'resizeStart';
export const onResize: string = 'resizing';
export const resizeStop: string = 'resizeStop';
export const undo: string = 'undo';
export const redo: string = 'redo';
export const insertLink: string = 'insertLink';
export const unLink: string = 'unLink';
export const editLink: string = 'editLink';
export const openLink: string = 'openLink';
export const actionBegin: string = 'actionBegin';
export const actionComplete: string = 'actionComplete';
export const actionSuccess: string = 'actionSuccess';
export const updateToolbarItem: string = 'updateToolbarItem';
export const insertImage: string = 'insertImage';
export const insertAudio: string = 'insertAudio';
export const insertVideo: string = 'insertVideo';
export const insertCompleted: string = 'insertCompleted';
export const imageLeft: string = 'justifyLeft';
export const imageRight: string = 'justifyRight';
export const imageCenter: string = 'justifyCenter';
export const imageBreak: string = 'break';
export const imageInline: string = 'inline';
export const audioBreak: string = 'break';
export const audioInline: string = 'inline';
export const videoLeft: string = 'justifyLeft';
export const videoRight: string = 'justifyRight';
export const videoCenter: string = 'justifyCenter';
export const videoBreak: string = 'break';
export const videoInline: string = 'inline';
export const imageLink: string = 'insertImgLink';
export const imageAlt: string = 'imgAltText';
export const imageDelete: string = 'delete';
export const audioDelete: string = 'delete';
export const videoDelete: string = 'delete';
export const imageCaption: string = 'caption';
export const imageSize: string = 'imageSize';
export const videoSize: string = 'videoSize';
export const sourceCode: string = 'sourceCode';
export const updateSource: string = 'updateSource';
export const toolbarOpen: string = 'toolbarOpen';
export const beforeDropDownOpen: string = 'beforeDropDownOpen';
export const hideToolTip: string = 'hideToolTip';
export const beforeDropDownClose: string = 'beforeDropDownClose';
export const selectionSave: string = 'selection-save';
export const selectionRestore: string = 'selection-restore';
export const expandPopupClick: string = 'expandPopupClick';
export const count: string = 'count';
export const contentFocus: string = 'contentFocus';
export const contentBlur: string = 'contentBlur';
export const mouseDown: string = 'mouseDown';
export const sourceCodeMouseDown: string = 'sourceCodeMouseDown';
export const editAreaClick: string = 'editAreaClick';
export const scroll: string = 'scroll';
export const contentscroll: string = 'contentscroll';
export const colorPickerChanged: string = 'colorPickerChanged';
export const tableColorPickerChanged: string = 'tableColorPickerChanged';
export const focusChange: string = 'focusChange';
export const selectAll: string = 'selectAll';
export const selectRange: string = 'selectRange';
export const getSelectedHtml: string = 'getSelectedHtml';
export const renderInlineToolbar: string = 'renderInlineToolbar';
export const paste: string = 'paste-content';
export const imgModule: string = 'imageModule';
export const audModule: string = 'audioModule';
export const vidModule: string = 'videoModule';
export const rtlMode: string = 'rtl-mode';
export const createTable: string = 'createTable';
export const docClick: string = 'docClick';
export const tableToolbarAction: string = 'table-toolbar-action';
export const checkUndo: string = 'checkUndoStack';
export const readOnlyMode: string = 'readOnlyMode';
export const pasteClean: string = 'pasteClean';
export const beforeDialogOpen: string = 'beforeDialogOpen';
export const dialogOpen: string = 'dialogOpen';
export const beforeDialogClose: string = 'beforeDialogClose';
export const dialogClose: string = 'dialogClose';
export const beforeQuickToolbarOpen: string = 'beforeQuickToolbarOpen';
export const quickToolbarOpen: string = 'quickToolbarOpen';
export const quickToolbarClose: string = 'quickToolbarClose';
export const popupHide: string = 'popupHide';
export const imageSelected: string = 'imageSelected';
export const imageUploading: string = 'imageUploading';
export const imageUploadSuccess: string = 'imageUploadSuccess';
export const imageUploadFailed: string = 'imageUploadFailed';
export const imageRemoving: string = 'imageRemoving';
export const afterImageDelete: string = 'afterImageDelete';
export const fileSelected: string = 'fileSelected';
export const fileUploading: string = 'fileUploading';
export const fileUploadSuccess: string = 'fileUploadSuccess';
export const fileUploadFailed: string = 'fileUploadFailed';
export const fileRemoving: string = 'fileRemoving';
export const afterMediaDelete: string = 'afterMediaDelete';
export const drop: string = 'drop';
export const xhtmlValidation: string = 'xhtmlValidation';
export const beforeImageUpload: string = 'beforeImageUpload';
export const beforeFileUpload: string = 'beforeFileUpload';
export const resizeInitialized: string = 'resizeInitialized';
export const MS_WORD_CLEANUP_PLUGIN: string = 'ms_word_cleanup_plugin';
export const MS_WORD_CLEANUP: string = 'ms_word_cleanup';
export const beforePasteUpload: string = 'beforePasteUpload';
export const beforePasteUploadCallBack: string = 'beforePasteUploadCallBack';
export const uploading: string = 'uploading';
export const success: string = 'success';
export const failure: string = 'failure';
export const canceling: string = 'canceling';
export const removing: string = 'removing';
export const selected: string = 'selected';
export const updateTbItemsStatus: string = 'updateTbItemsStatus';
export const outsideClicked: string = 'Outside Click';
export const ON_BEGIN: string = 'onBegin';
export const enterHandler: string = 'enterHandler';
export const tableclass: string = 'tableclass';
export const afterKeyDown: string = 'afterKeyDown';
export const updateValueOnIdle: string = 'updateValueOnIdle';
export const onHandleFontsizeChange: string = 'onHandleFontsizeChange';
export const cleanupResizeElements: string = 'cleanupResizeElements';
export const formatPainterClick: string = 'formatPainterClick';
export const formatPainterDoubleClick: string = 'formatPainterDoubleClick';
export const FORMAT_PAINTER_ACTIONS: string = 'format_painter_actions';
export const onCodeBlock: string = 'onCodeBlock';
export const codeBlockPaste: string = 'code-block-paste-content';
export const codeBlockEnter: string = 'code-block-enter';


//Blazor Event
export const beforeQuickToolbarOpenEvent: string = 'BeforeQuickToolbarOpenEvent';
export const quickToolbarCloseEvent: string = 'QuickToolbarCloseEvent';
export const actionBeginEvent: string = 'ActionBeginEvent';
export const actionCompleteEvent: string = 'ActionCompleteEvent';
export const beforeUpload: string = 'BeforeUpload';
export const pasteImageUploadFailed: string = 'PasteImageUploadFailed';
export const pasteImageUploadSuccess: string = 'PasteImageUploadSuccess';
export const resizeStartEvent: string = 'ResizeStartEvent';
export const resizeStopEvent: string = 'ResizeStopEvent';
export const updatedToolbarStatusEvent: string = 'UpdatedToolbarStatusEvent';

//Blazor Methods
export const updateClass: string = 'UpdateClass';
export const showFullScreenClient: string = 'ShowFullScreenClient';
export const hideFullScreenClient: string = 'HideFullScreenClient';
export const showImagePopup: string = 'ShowImagePopup';
export const hideImagePopup: string = 'HideImagePopup';
export const showAudioQuickToolbar: string = 'ShowAudioQuickToolbar';
export const hideAudioQuickToolbar: string = 'HideAudioQuickToolbar';
export const showVideoQuickToolbar: string = 'ShowVideoQuickToolbar';
export const hideVideoQuickToolbar: string = 'HideVideoQuickToolbar';
export const showLinkPopup: string = 'ShowLinkPopup';
export const hideLinkPopup: string = 'HideLinkPopup';
export const showTablePopup: string = 'ShowTablePopup';
export const hideTablePopup: string = 'HideTablePopup';
export const showInlinePopup: string = 'ShowInlinePopup';
export const hideInlinePopup: string = 'HideInlinePopup';
export const showTextPopup: string = 'ShowTextPopup';
export const hideTextPopup: string = 'HideTextPopup';
export const refreshToolbarOverflow: string = 'RefreshToolbarOverflow';
export const updateUndoRedoStatus: string = 'UpdateUndoRedoStatus';
export const showImageDialog: string = 'ShowImageDialog';
export const closeImageDialog: string = 'CloseImageDialog';
export const showAudioDialog: string = 'ShowAudioDialog';
export const closeAudioDialog: string = 'CloseAudioDialog';
export const showVideoDialog: string = 'ShowVideoDialog';
export const closeVideoDialog: string = 'CloseVideoDialog';

//Blazor ID
export const imageQuickPopup: string = '_Image_Quick_Popup';
export const audioQuickPopup: string = '_Audio_Quick_Popup';
export const videoQuickPopup: string = '_Video_Quick_Popup';
export const linkQuickPopup: string = '_Link_Quick_Popup';
export const tableQuickPopup: string = '_Table_Quick_Popup';
export const inlineQuickPopup: string = '_Inline_Quick_Popup';
export const textQuickPopup: string = '_Text_Quick_Popup';
export const resizeID: string = '-resizable';
export const toolbarCreateTable: string = '_toolbar_CreateTable';
export const imgResizeId: string = '_imgResize';
export const vidResizeId: string = '_vidResize';

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

export const supportedUnits: string[] = ['px', 'em', 'rem', 'pt', 'cm', 'mm', 'in', 'pc', 'vw', 'vh', 'vmin', 'vmax'];
