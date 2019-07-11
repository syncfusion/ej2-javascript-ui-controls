/**
 * Exports common util methods used by RichTextEditor.
 */
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';

export function isIDevice(): boolean {
    let result: boolean = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}

export function setEditFrameFocus(editableElement: Element, selector: string): void {
    if (editableElement.nodeName === 'BODY' && !isNullOrUndefined(selector)) {
        let iframe: HTMLIFrameElement = <HTMLIFrameElement>top.window.document.querySelector(selector);
        if (!isNullOrUndefined(iframe)) { iframe.contentWindow.focus(); }
    }
}