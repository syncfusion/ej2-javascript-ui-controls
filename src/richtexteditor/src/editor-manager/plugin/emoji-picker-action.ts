import { EditorManager } from './../base/editor-manager';
import { IHtmlSubCommands } from './../base/interface';
import * as EVENTS from './../../common/constant';
import { InsertHtml } from './inserthtml';
export class EmojiPickerAction {
    private parent: EditorManager;

    public constructor(parent?: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.EMOJI_PICKER_ACTIONS, this.emojiInsert, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.EMOJI_PICKER_ACTIONS, this.emojiInsert);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private emojiInsert(args: IHtmlSubCommands): void {
        const node: Node = document.createTextNode(args.value as string);
        const selection: Selection = this.parent.currentDocument.getSelection();
        const range: Range = selection.getRangeAt(0);
        const cursorPos: number = range.startOffset;
        for (let i: number = cursorPos - 1; i >= cursorPos - 15; i--) {
            const prevChar: string = selection.focusNode.textContent.substring(i - 1, i);
            const isPrevSpace: boolean = /:$/.test(prevChar);
            if (isPrevSpace) {
                this.beforeApplyFormat(true);
                break;
            }
        }
        const colon: boolean = /:$/.test(selection.focusNode.textContent.charAt(cursorPos - 1));
        const prevChar: string = selection.focusNode.textContent.charAt(cursorPos - 2);
        const isPrevSpace: boolean = /\s/.test(prevChar);
        if (colon && (isPrevSpace || selection.focusOffset === 1)) {
            this.beforeApplyFormat(true);
        }
        InsertHtml.Insert(this.parent.currentDocument, node as Node, this.parent.editableElement);
        if (args.callBack) {
            args.callBack({
                requestType: args.subCommand,
                editorMode: 'HTML',
                event: args.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }
    private beforeApplyFormat(isBlockFormat: boolean): void {
        const range1: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const node: Node = this.parent.nodeSelection.getNodeCollection(range1)[0];
        const blockNewLine: boolean = !(node.parentElement.innerHTML.replace(/&nbsp;|<br>/g, '').trim() === ':' || node.textContent.trim().indexOf('/') === 0);
        let startNode: Node = node;
        if (blockNewLine && isBlockFormat) {
            while (startNode !== this.parent.editableElement) {
                startNode = startNode.parentElement;
            }
        }
        let startPoint: number = range1.startOffset;
        while (this.parent.nodeSelection.getRange(document).toString().indexOf(':') === -1) {
            this.parent.nodeSelection.setSelectionText(document, node, node, startPoint, range1.endOffset);
            startPoint--;
        }
        const range2: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const node2: Node = this.parent.nodeCutter.GetSpliceNode(range2, node as HTMLElement);
        node2.parentNode.removeChild(node2);
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
