/* eslint-disable @typescript-eslint/no-explicit-any */

import { BlockEditor } from "../../src/index";
import { BlockEditorModel } from "../../src/blockeditor/base/blockeditor-model";

export function createEditor(args: BlockEditorModel): BlockEditor {
    args.width = '400px';
    args.height = '400px';
    const editor: BlockEditor = new BlockEditor(args);
    return editor;
}

export function setRange(start: Node, end: Node, startOffset: number, endOffset: number) {
    const range: Range = document.createRange();
    const selection: Selection | null = window.getSelection();
    if (selection) {
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
export function createMockClipboardEvent(type: string, clipboardData: any = {}): ClipboardEvent {
    const event: any = {
        type,
        preventDefault: jasmine.createSpy(),
        clipboardData: clipboardData,
        bubbles: true,
        cancelable: true
    };
    return event as ClipboardEvent;
}
export function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
    const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
    node.dispatchEvent(event);
}