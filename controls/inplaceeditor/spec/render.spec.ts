import { createElement, detach, getUniqueID } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../src/inplace-editor/base/index';
import { InPlaceEditorModel } from '../src/inplace-editor/base/inplace-editor-model';

export let safariMobileUA: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X)' +
    'AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1';

export function renderEditor(options: InPlaceEditorModel): InPlaceEditor {
    let element: HTMLElement = createElement('div', { id: getUniqueID('ej2Editor') });
    document.body.appendChild(element);
    let editorObj: InPlaceEditor = new InPlaceEditor(options);
    editorObj.appendTo(element);
    return editorObj;
}

export function destroy(editorObj: InPlaceEditor): void {
    editorObj.destroy();
    detach(editorObj.element);
    document.body.innerHTML = '';
}

export function triggerKeyBoardEvent(ele: HTMLElement, code: number): void {
    let eve: any = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: code.toString(), shiftKey: true });
    Object.defineProperty(eve, "keyCode", { "value": code });
    Object.defineProperty(eve, "which", { "value": code });
    ele.dispatchEvent(eve);
}