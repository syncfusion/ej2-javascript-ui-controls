import { createElement, detach, getUniqueID } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../src/rich-text-editor/base/rich-text-editor';
import {RichTextEditorModel } from './../../src/rich-text-editor/base/rich-text-editor-model';

export function renderRTE(options: RichTextEditorModel): RichTextEditor {
    let element: HTMLElement = createElement('div', { id: getUniqueID('rte-test') });
    document.body.appendChild(element);
    let rteObj: RichTextEditor = new RichTextEditor(options);
    rteObj.appendTo(element);
    return rteObj;
}

export function destroy(rteObj: RichTextEditor): void {
    rteObj.destroy();
    detach(rteObj.element);
    document.body.innerHTML = '';
}


export function setCursorPoint(element: Element, point: number) {
    let range: Range = document.createRange();
    let sel: Selection = document.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
export function dispatchEvent(element: Element, type: string) {
    let evt: any = document.createEvent('MouseEvents');
    evt.initEvent(type, true, true);
    element.dispatchEvent(evt);
}

export function dispatchKeyEvent(element: Element, type: string, args?: Object) {
    element.dispatchEvent(new KeyboardEvent(type, args));
}