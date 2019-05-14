import { createElement, detach, getUniqueID, extend } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../src/rich-text-editor/base/rich-text-editor';
import { RichTextEditorModel } from './../../src/rich-text-editor/base/rich-text-editor-model';

export let currentBrowserUA: string = navigator.userAgent;
export let androidUA: string = 'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>';
export let iPhoneUA: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465 Twitter for iPhone';

export function renderRTE(options: RichTextEditorModel): RichTextEditor {
    let element: HTMLElement = createElement('div', { id: getUniqueID('rte-test') });
    document.body.appendChild(element);
    extend(options, options, { saveInterval: 0 })
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

export function removeStyleElements(elements: any) {
    if (elements.length > 0) {
        [].slice.call(elements).forEach((ele: any) => { detach(ele); });
    }
}