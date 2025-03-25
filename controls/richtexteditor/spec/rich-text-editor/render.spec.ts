import { createElement, detach, getUniqueID, extend, Browser } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../src/rich-text-editor/base/rich-text-editor';
import { RichTextEditorModel } from './../../src/rich-text-editor/base/rich-text-editor-model';
import { HtmlEditor, MarkdownEditor, Toolbar, QuickToolbar, SlashMenu } from "../../src/rich-text-editor/index";
import { Link, Image, Audio, Video, Table, PasteCleanup, Count, Resize, FileManager, FormatPainter, EmojiPicker, ImportExport } from "../../src/rich-text-editor/index";
import { CustomUserAgentData } from '../../src/common/user-agent';

RichTextEditor.Inject(HtmlEditor, MarkdownEditor, FormatPainter, Toolbar, QuickToolbar, Link, Image, Audio, Video, Table, PasteCleanup, Count, Resize, FileManager, EmojiPicker, SlashMenu, ImportExport);

export let currentBrowserUA: string = navigator.userAgent;
export let ieUA: string = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
export let androidUA: string = 'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>';
export let iPhoneUA: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465 Twitter for iPhone';
export const hostURL: string = 'https://ej2services.syncfusion.com/js/hotfix/';

export function renderRTE(options: RichTextEditorModel): RichTextEditor {
    let element: HTMLElement = createElement('div', { id: getUniqueID('rte-test') });
    document.body.appendChild(element);
    extend(options, options, { saveInterval: 0 })
    let rteObj: RichTextEditor = new RichTextEditor(options);
    rteObj.appendTo(element);
    (rteObj as any).userAgentData = new CustomUserAgentData(Browser.userAgent, true);
    (rteObj.formatter.editorManager as any).userAgentData = new CustomUserAgentData(Browser.userAgent, true);
    if (rteObj.quickToolbarModule) {
        rteObj.quickToolbarModule.debounceTimeout = 0;
    }
    return rteObj;
}

export function destroy(rteObj: RichTextEditor): void {
    rteObj.destroy();
    detach(rteObj.element);
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

export function clickImage(image: HTMLImageElement): void {
    const mouseDown: MouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
    image.dispatchEvent(mouseDown);
    const mouseUp: MouseEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
    image.dispatchEvent(mouseUp);
};

export function clickVideo(video: HTMLVideoElement): void {
    const mouseDown: MouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
    video.dispatchEvent(mouseDown);
    const mouseUp: MouseEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
    video.dispatchEvent(mouseUp);
};

export function clickAudio(audio: HTMLAudioElement): void {
    const mouseDown: MouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
    audio.dispatchEvent(mouseDown);
    const mouseUp: MouseEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
    audio.dispatchEvent(mouseUp);
};

export function clickGripper(gripper: HTMLElement): void {
    const domRect: DOMRect = gripper.getBoundingClientRect() as DOMRect;
    const mouseDown: MouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, clientX: domRect.left, clientY: domRect.top , screenX: domRect.left, screenY: domRect.top});
    gripper.dispatchEvent(mouseDown);
}

export function moveGripper(gripper: HTMLElement, x: number, y: number): void{
    const mouseMove: MouseEvent = new MouseEvent('mousemove', { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y });
    document.body.dispatchEvent(mouseMove);
}

export function leaveGripper(gripper: HTMLElement): void {
    const mouseUp: MouseEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
    document.body.dispatchEvent(mouseUp);
}

export type ImageResizeGripper = 'e-rte-botRight' | 'e-rte-botLeft' | 'e-rte-topRight' | 'e-rte-topLeft';

export type VideoResizeGripper = 'e-rte-botRight' | 'e-rte-botLeft' | 'e-rte-topRight' | 'e-rte-topLeft';

export function selectTableCell(table: HTMLTableElement, rowIndex: number, cellIndex: number): void {
    const rows: HTMLCollectionOf<HTMLTableRowElement> = table.rows;
    const row: HTMLTableRowElement = rows[rowIndex];
    const cell: HTMLTableCellElement = row.cells[cellIndex];
    const mouseEvent: MouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
    cell.dispatchEvent(mouseEvent);
}

export function drawCellSelection(table: HTMLTableElement, rowIndex: number, cellIndex: number): void {
    const rows: HTMLCollectionOf<HTMLTableRowElement> = table.rows;
    const row: HTMLTableRowElement = rows[rowIndex];
    const cell: HTMLTableCellElement = row.cells[cellIndex];
    const mouseMoveEvent: MouseEvent = new MouseEvent('mousemove', { bubbles: true, cancelable: true, view: window });
    cell.dispatchEvent(mouseMoveEvent);
    const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
    cell.dispatchEvent(mouseUpEvent);
}