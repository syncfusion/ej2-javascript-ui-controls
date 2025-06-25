import { MenuEventArgs } from '../../navigations/src'; /*externalscript*/
import { BeforeOpenCloseMenuEventArgs, DropDownButtonModel, OpenCloseMenuEventArgs } from '../../splitbuttons/src'; /*externalscript*/
import { SfRichTextEditor } from './sf-richtexteditor-fn';
import { ToolbarClickEventArgs, LinkFormModel } from './interfaces';
import { IDropDownClickArgs, ITableCommandsArgs, ExecuteCommandOption } from '../src/common/interface';
import { IToolsItems, ILinkCommandsArgs, IImageCommandsArgs, EditTableModel } from '../src/common/interface';
import { CommandName } from '../src/common/enum';

/**
 * Interop handler
 */
// eslint-disable-next-line
export const RichTextEditorInterop: object = {
    initialize(options: { [key: string]: Object }): void {
        if (options.dataId) {
            new SfRichTextEditor(options);
        }
    },
    updateProperties(options: { [key: string]: Object }): void {
        if (options.dataId) { (window as any).sfBlazor.instances[options.dataId as string].updateContext(options); }
    },
    setPanelValue(dataId: string, value: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].setPanelValue(value); }
    },
    toolbarCreated(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].toolbarCreated(); }
    },
    toolbarItemClick(dataId: string, args: ToolbarClickEventArgs, id: string, targetType: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].toolbarItemClick(args, id, targetType); }
    },
    splitButtonClicked(dataId: string, args: ToolbarClickEventArgs): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].splitButtonClicked(args); }
    },
    splitButtonAfterOpen(dataId: string, args: BeforeOpenCloseMenuEventArgs): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].splitButtonAfterOpen(args); }
    },
    dropDownBeforeOpen(dataId: string, args: BeforeOpenCloseMenuEventArgs): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dropDownBeforeOpen(args); }
    },
    dropDownAfterOpen(dataId: string, args: OpenCloseMenuEventArgs, items: DropDownButtonModel): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dropDownAfterOpen(args, items); }
    },
    dropDownClose(dataId: string, args: MenuEventArgs): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dropDownClose(args); }
    },
    dropDownBeforeClose: function (dataId: string, args: BeforeOpenCloseMenuEventArgs): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dropDownBeforeClose(args); }
    },
    dropDownButtonItemSelect(dataId: string, args: IDropDownClickArgs): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dropDownSelect(args); }
    },
    colorIconSelected(dataId: string, args: IToolsItems, value: string, container: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].colorIconSelected(args, value, container); }
    },
    colorPickerAfterOpen(dataId: string, args: IToolsItems, value: string, container: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].colorPickerAfterOpen(args, value, container); }
    },
    colorPickerChanged(dataId: string, args: IToolsItems, value: string, container: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].colorChanged(args, value, container); }
    },
    cancelLinkDialog(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].cancelLinkDialog(); }
    },
    cancelImageDialog(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].cancelImageDialog(); }
    },
    linkDialogClosed(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].linkDialogClosed(); }
    },
    dialogClosed(dataId: string, type: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dialogClosed(type); }
    },
    insertLink(dataId: string, args: LinkFormModel): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].insertLink(args); }
    },
    imageRemoving(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].imageRemoving(); }
    },
    audioRemoving(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].audioRemoving(); }
    },
    videoRemoving(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].videoRemoving(); }
    },
    uploadSuccess(dataId: string, url: string, altText: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].uploadSuccess(url, altText); }
    },
    audioUploadSuccess(dataId: string, url: string, altText: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].audioUploadSuccess(url, altText); }
    },
    videoUploadSuccess(dataId: string, url: string, fileName: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].videoUploadSuccess(url, fileName); }
    },
    imageSelected(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].imageSelected(); }
    },
    audioSelected(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].audioSelected(); }
    },
    videoSelected(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].videoSelected(); }
    },
    imageUploadComplete(options: { [key: string]: string }): void {
        if (options.dataId) {
            (window as any).sfBlazor.instances[options.dataId as string].imageUploadComplete(options.base64Str, options.altText);
        }
    },
    audioUploadComplete(options: { [key: string]: string }): void {
        if (options.dataId) {
            (window as any).sfBlazor.instances[options.dataId as string].audioUploadComplete(options.base64Str, options.fileName);
        }
    },
    videoUploadComplete(options: { [key: string]: string }): void {
        if (options.dataId) {
            (window as any).sfBlazor.instances[options.dataId as string].videoUploadComplete(options.base64Str, options.fileName);
        }
    },
    imageUploadChange(dataId: string, url: string, isStream: boolean): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].imageUploadChange(url, isStream); }
    },
    audioUploadChange(dataId: string, url: string, isStream: boolean): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].audioUploadChange(url, isStream); }
    },
    videoUploadChange(dataId: string, url: string, isStream: boolean): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].videoUploadChange(url, isStream); }
    },
    dropUploadChange(dataId: string, url: string, isStream: boolean): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dropUploadChange(url, isStream); }
    },
    insertImage(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].insertImage(); }
    },
    insertAudio(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].insertAudio(); }
    },
    insertVideo(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].insertVideo(); }
    },
    imageDialogOpened(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].imageDialogOpened(); }
    },
    imageDialogClosed(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].imageDialogClosed(); }
    },
    audioDialogOpened(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].audioDialogOpened(); }
    },
    audioDialogClosed(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].audioDialogClosed(); }
    },
    videoDialogOpened(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].videoDialogOpened(); }
    },
    videoDialogClosed(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].videoDialogClosed(); }
    },
    propertyChangeHandler(options: { [key: string]: Object }): void {
        if (options.dataId) { (window as any).sfBlazor.instances[options.dataId as string].propertyChangeHandler(options); }
    },
    insertTable(dataId: string, row: number, column: number): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].insertTable(row, column); }
    },
    applyTableProperties(dataId: string, model: EditTableModel): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].applyTableProperties(model); }
    },
    createTablePopupOpened(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].createTablePopupOpened(); }
    },
    pasteContent(dataId: string, pasteOption: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].pasteContent(pasteOption); }
    },
    updatePasteContent(dataId: string, value: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].updatePasteContent(value); }
    },
    imageDropInitialized(dataId: string, isStream: boolean): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].imageDropInitialized(isStream); }
    },
    preventEditable(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].preventEditable(); }
    },
    enableEditable(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].enableEditable(); }
    },
    removeDroppedImage(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].removeDroppedImage(); }
    },
    dropUploadSuccess(dataId: string, url: string, altText: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].dropUploadSuccess(url, altText); }
    },
    executeCommand(
        dataId: string, commandName: CommandName,
        value?: string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs | ITableCommandsArgs,
        option?: ExecuteCommandOption): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].executeCommand(commandName, value, option); }
    },
    getCharCount(dataId: string): number {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getCharCount();
    },
    focusIn(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].focusIn();
    },
    focusOut(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].focusOut();
    },
    getContent(dataId: string): Element {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getContent();
    },
    getHtml(dataId: string): string {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getHtml();
    },
    getSelectedHtml(dataId: string): string {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getSelectedHtml();
    },
    getSelection(dataId: string): string {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getSelection();
    },
    getText(dataId: string): string {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getText();
    },
    print(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].print();
    },
    refreshUI(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].refreshUI();
    },
    sanitizeHtml(dataId: string, value: string): string {
        return dataId && (window as any).sfBlazor.instances[dataId as string].sanitizeHtml(value);
    },
    selectAll(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].selectAll();
    },
    selectRange(dataId: string, range: Range): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].selectRange(range);
    },
    showFullScreen(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].showFullScreen();
    },
    showSourceCode(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].showSourceCode();
    },
    insertAlt(dataId: string, altText: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].insertAlt(altText);
    },
    insertSize(dataId: string, width: number, height: number): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].insertSize(width, height);
    },
    insertVideoSize(dataId: string, width: number, height: number): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].insertVideoSize(width, height);
    },
    insertImageLink(dataId: string, url: string, target: string, ariaLabel: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].insertImageLink(url, target, ariaLabel);
    },
    saveSelection(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].saveSelection(); }
    },
    restoreSelection(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].restoreSelection(); }
    },
    getXhtml(dataId: string): string {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getXhtml();
    },
    changeTooltipText(dataId: string, id: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].changeTooltipText(id); }
    },
    showLinkDialog(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].showLinkDialog(); }
    },
    showImageDialog(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].showImageDialog(); }
    },
    showAudioDialog(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].showAudioDialog(); }
    },
    showVideoDialog(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].showVideoDialog(); }
    },
    showTableDialog(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].showTableDialog(); }
    },
    showInlineToolbar(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].showInlineToolbar(); }
    },
    hideInlineToolbar(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].hideInlineToolbar(); }
    },
    destroy(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].destroy(); }
    },
    resizeElement(dataId: string, value: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].removeResizeElement(value);
    },
    getDialogPosition(dataId: string): void {
        return dataId && (window as any).sfBlazor.instances[dataId as string].getDialogPosition();
    },
    beforeSlashMenuApply(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].beforeSlashMenuApply(); }
    },
    clearUndoRedo(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].clearUndoRedo(); }
    },
    closePopup(dataId: string): void {
        if (dataId) { (window as any).sfBlazor.instances[dataId as string].closePopup(); }
    }
};
