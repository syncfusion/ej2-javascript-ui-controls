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
export const toolbarClick: string = 'toolbarClick';
export const toolbarRefresh: string = 'toolbar-refresh';
export const refreshBegin: string = 'refresh-begin';
export const toolbarUpdated: string = 'toolbar-updated';
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
export const linkToolbarAction: string = 'link-toolbar-action';
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
export const toolbarStatusUpdate: string = 'toolbarStatusUpdate';
export const actionSuccess: string = 'actionSuccess';
export const updateToolbarItem: string = 'updateToolbarItem';
export const insertImage: string = 'insertImage';
export const insertCompleted: string = 'insertCompleted';
export const imageLeft: string = 'justifyLeft';
export const imageRight: string = 'justifyRight';
export const imageCenter: string = 'justifyCenter';
export const imageBreak: string = 'break';
export const imageInline: string = 'inline';
export const imageLink: string = 'insertImgLink';
export const imageAlt: string = 'imgAltText';
export const imageDelete: string = 'delete';
export const imageCaption: string = 'caption';
export const imageSize: string = 'imageSize';
export const sourceCode: string = 'sourceCode';
export const updateSource: string = 'updateSource';
export const toolbarOpen: string = 'toolbarOpen';
export const beforeDropDownOpen: string = 'beforeDropDownOpen';
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
export const drop: string = 'drop';
export const xhtmlValidation: string = 'xhtmlValidation';
export const beforeImageUpload: string = 'beforeImageUpload';
export const resizeInitialized: string = 'resizeInitialized';
export const MS_WORD_CLEANUP_PLUGIN: string = 'ms_word_cleanup_plugin';
export const MS_WORD_CLEANUP: string = 'ms_word_cleanup';

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

//Blazor Methods
export const updateClass: string = 'UpdateClass';
export const showFullScreenClient: string = 'ShowFullScreenClient';
export const hideFullScreenClient: string = 'HideFullScreenClient';
export const showImagePopup: string = 'ShowImagePopup';
export const hideImagePopup: string = 'HideImagePopup';
export const showLinkPopup: string = 'ShowLinkPopup';
export const hideLinkPopup: string = 'HideLinkPopup';
export const showTablePopup: string = 'ShowTablePopup';
export const hideTablePopup: string = 'HideTablePopup';
export const showInlinePopup: string = 'ShowInlinePopup';
export const hideInlinePopup: string = 'HideInlinePopup';
export const refreshToolbarOverflow: string = 'RefreshToolbarOverflow';
export const updateUndoRedoStatus: string = 'UpdateUndoRedoStatus';
export const showImageDialog: string = 'ShowImageDialog';
export const closeImageDialog: string = 'CloseImageDialog';

//Blazor ID
export const imageQuickPopup: string = '_Image_Quick_Popup';
export const linkQuickPopup: string = '_Link_Quick_Popup';
export const tableQuickPopup: string = '_Table_Quick_Popup';
export const inlineQuickPopup: string = '_Inline_Quick_Popup';
export const resizeID: string = '-resizable';
export const toolbarCreateTable: string = '_toolbar_CreateTable';
export const imgResizeId: string = '_imgResize';

/* tslint:disable */
export const IFRAME_HEADER: string = `
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
                h4{font-size: 16px;font-weight: 400;line-height: 1.5;margin: 0;}
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
                .e-rtl { direction: rtl; }
            </style>
        </head>`;
/* tslint:enable */