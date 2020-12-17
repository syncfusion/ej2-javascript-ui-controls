import { BlazorDotnetObject } from '@syncfusion/ej2-base';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { SfRichTextEditor } from './sf-richtexteditor-fn';
import { BlazorRteElement, ToolbarClickEventArgs, LinkFormModel, EditTableModel } from './interfaces';
import { IDropDownClickArgs, ITableCommandsArgs, ExecuteCommandOption } from '../src/rich-text-editor/base/interface';
import { CommandName, IToolsItems, ILinkCommandsArgs, IImageCommandsArgs } from '../src/rich-text-editor/base/interface';

/**
 * Interop handler
 */
// tslint:disable-next-line
let RichTextEditor: object = {
    initialize(element: BlazorRteElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject): void {
        if (element) {
            new SfRichTextEditor(element, options, dotnetRef);
            element.blazor__instance.initialize();
        }
    },
    updateProperties(element: BlazorRteElement, options: { [key: string]: Object }): void {
        if (element) { element.blazor__instance.updateContext(options); }
    },
    setPanelValue(element: BlazorRteElement, value: string): void {
        if (element) { element.blazor__instance.setPanelValue(value); }
    },
    toolbarItemClick(element: BlazorRteElement, args: ToolbarClickEventArgs, id: string, targetType: string): void {
        if (element) { element.blazor__instance.toolbarItemClick(args, id, targetType); }
    },
    toolbarClick(element: BlazorRteElement, id: string): void {
        if (element) { element.blazor__instance.toolbarClick(id); }
    },
    dropDownBeforeOpen(element: BlazorRteElement, args: BeforeOpenCloseMenuEventArgs): void {
        if (element) { element.blazor__instance.dropDownBeforeOpen(args); }
    },
    dropDownClose(element: BlazorRteElement, args: MenuEventArgs): void {
        if (element) { element.blazor__instance.dropDownClose(args); }
    },
    dropDownButtonItemSelect(element: BlazorRteElement, args: IDropDownClickArgs): void {
        if (element) { element.blazor__instance.dropDownSelect(args); }
    },
    colorDropDownBeforeOpen(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.colorDropDownBeforeOpen(); }
    },
    colorIconSelected(element: BlazorRteElement, args: IToolsItems, value: string): void {
        if (element) { element.blazor__instance.colorIconSelected(args, value); }
    },
    colorPickerChanged(element: BlazorRteElement, args: IToolsItems, value: string): void {
        if (element) { element.blazor__instance.colorChanged(args, value); }
    },
    cancelLinkDialog(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.cancelLinkDialog(); }
    },
    cancelImageDialog(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.cancelImageDialog(); }
    },
    linkDialogClosed(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.linkDialogClosed(); }
    },
    dialogClosed(element: BlazorRteElement, type: string): void {
        if (element) { element.blazor__instance.dialogClosed(type); }
    },
    insertLink(element: BlazorRteElement, args: LinkFormModel): void {
        if (element) { element.blazor__instance.insertLink(args); }
    },
    invokeImageBrowse(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.invokeImageBrowse(); }
    },
    countCalculate(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.countCalculate(); }
    },
    imageRemoving(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.imageRemoving(); }
    },
    uploadSuccess(element: BlazorRteElement, url: string, altText: string): void {
        if (element) { element.blazor__instance.uploadSuccess(url, altText); }
    },
    imageSelected(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.imageSelected(); }
    },
    imageUploadComplete(element: BlazorRteElement, base64Str: string, altText: string): void {
        if (element) { element.blazor__instance.imageUploadComplete(base64Str, altText); }
    },
    imageUploadChange(element: BlazorRteElement, url: string, isStream: boolean): void {
        if (element) { element.blazor__instance.imageUploadChange(url, isStream); }
    },
    dropUploadChange(element: BlazorRteElement, url: string, isStream: boolean): void {
        if (element) { element.blazor__instance.dropUploadChange(url, isStream); }
    },
    insertImage(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.insertImage(); }
    },
    imageDialogOpened(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.imageDialogOpened(); }
    },
    imageDialogClosed(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.imageDialogClosed(); }
    },
    propertyChangeHandler(element: BlazorRteElement, option: { [key: string]: Object }): void {
        if (element) { element.blazor__instance.propertyChangeHandler(option); }
    },
    insertTable(element: BlazorRteElement, row: number, column: number): void {
        if (element) { element.blazor__instance.insertTable(row, column); }
    },
    applyTableProperties(element: BlazorRteElement, model: EditTableModel): void {
        if (element) { element.blazor__instance.applyTableProperties(model); }
    },
    createTablePopupOpened(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.createTablePopupOpened(); }
    },
    pasteContent(element: BlazorRteElement, pasteOption: string): void {
        if (element) { element.blazor__instance.pasteContent(pasteOption); }
    },
    imageDropInitialized(element: BlazorRteElement, isStream: boolean): void {
        if (element) { element.blazor__instance.imageDropInitialized(isStream); }
    },
    preventEditable(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.preventEditable(); }
    },
    enableEditable(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.enableEditable(); }
    },
    removeDroppedImage(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.removeDroppedImage(); }
    },
    dropUploadSuccess(element: BlazorRteElement, url: string, altText: string): void {
        if (element) { element.blazor__instance.dropUploadSuccess(url, altText); }
    },
    executeCommand(
        element: BlazorRteElement, commandName: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
            IImageCommandsArgs | ITableCommandsArgs,
        option?: ExecuteCommandOption): void {
        if (element) { element.blazor__instance.executeCommand(commandName, value, option); }
    },
    getCharCount(element: BlazorRteElement): number {
        return element && element.blazor__instance.getCharCount();
    },
    focusIn(element: BlazorRteElement): void {
        return element && element.blazor__instance.focusIn();
    },
    focusOut(element: BlazorRteElement): void {
        return element && element.blazor__instance.focusOut();
    },
    getContent(element: BlazorRteElement): Element {
        return element && element.blazor__instance.getContent();
    },
    getHtml(element: BlazorRteElement): string {
        return element && element.blazor__instance.getHtml();
    },
    getSelectedHtml(element: BlazorRteElement): string {
        return element && element.blazor__instance.getSelectedHtml();
    },
    getSelection(element: BlazorRteElement): string {
        return element && element.blazor__instance.getSelection();
    },
    getText(element: BlazorRteElement): string {
        return element && element.blazor__instance.getText();
    },
    print(element: BlazorRteElement): void {
        return element && element.blazor__instance.print();
    },
    refreshUI(element: BlazorRteElement): void {
        return element && element.blazor__instance.refreshUI();
    },
    sanitizeHtml(element: BlazorRteElement, value: string): string {
        return element && element.blazor__instance.sanitizeHtml(value);
    },
    selectAll(element: BlazorRteElement): void {
        return element && element.blazor__instance.selectAll();
    },
    selectRange(element: BlazorRteElement, range: Range): void {
        return element && element.blazor__instance.selectRange(range);
    },
    showFullScreen(element: BlazorRteElement): void {
        return element && element.blazor__instance.showFullScreen();
    },
    showSourceCode(element: BlazorRteElement): void {
        return element && element.blazor__instance.showSourceCode();
    },
    insertAlt(element: BlazorRteElement, altText: string): void {
        return element && element.blazor__instance.insertAlt(altText);
    },
    insertSize(element: BlazorRteElement, width: number, height: number): void {
        return element && element.blazor__instance.insertSize(width, height);
    },
    insertImageLink(element: BlazorRteElement, url: string, target: string): void {
        return element && element.blazor__instance.insertImageLink(url, target);
    },
    updateContentHeight(element: BlazorRteElement): void {
        return element && element.blazor__instance.setContentHeight();
    },
    saveSelection(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.saveSelection(); }
    },
    restoreSelection(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.restoreSelection(); }
    },
    getXhtml(element: BlazorRteElement): string {
        return element.blazor__instance.getXhtml();
    },
    destroy(element: BlazorRteElement): void {
        if (element) { element.blazor__instance.destroy(); }
    }
};
export default RichTextEditor;