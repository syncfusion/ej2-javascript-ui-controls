import { debounce, KeyboardEventArgs, isNullOrUndefined } from '@syncfusion/ej2-base';
import { MarkdownParser } from './../base/markdown-parser';
import { IMarkdownSubCommands, IMDKeyboardEvent, MarkdownUndoRedoData } from './../base/interface';
import { MarkdownSelection } from './markdown-selection';
import * as EVENTS from './../../common/constant';
import { IUndoCallBack } from '../../common/interface';
/**
 * `Undo` module is used to handle undo actions.
 */

export class UndoRedoCommands {

    public steps: number;
    public undoRedoStack: MarkdownUndoRedoData[] = [];
    private parent: MarkdownParser;
    private selection: MarkdownSelection;
    private currentAction: string;
    public undoRedoSteps: number;
    public undoRedoTimer: number;
    constructor(parent?: MarkdownParser, options?: { [key: string]: number }) {
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    protected addEventListener(): void {
        let debounceListener: Function = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(EVENTS.KEY_UP_HANDLER, debounceListener, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(EVENTS.ACTION, this.onAction, this);
    }
    protected removeEventListener(): void {
        let debounceListener: Function = debounce(this.keyUp, 300);
        this.parent.observer.off(EVENTS.KEY_UP_HANDLER, debounceListener);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.keyDown);
        this.parent.observer.off(EVENTS.ACTION, this.onAction);
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }

    public onAction(e: IMarkdownSubCommands): void {
        if (e.subCommand === 'Undo') {
            this.undo(e);
        } else {
            this.redo(e);
        }
    }
    private keyDown(e: IMDKeyboardEvent): void {
        let event: KeyboardEvent = e.event as KeyboardEvent;
        let proxy: this = this;
        switch ((event as KeyboardEventArgs).action) {
            case 'undo':
                event.preventDefault();
                proxy.undo(e);
                break;
            case 'redo':
                event.preventDefault();
                proxy.redo(e);
                break;
        }
    }
    private keyUp(e: IMDKeyboardEvent): void {
        if ((e.event as KeyboardEvent).keyCode !== 17 && !(e.event as KeyboardEvent).ctrlKey) {
            this.saveData(e);
        }
    }
    /**
     * MD collection stored string format.
     * @method saveData
     * @return {void}
     */
    public saveData(e?: KeyboardEvent | MouseEvent | IUndoCallBack): void {
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let textValue: string = (this.parent.element as HTMLTextAreaElement).value;
        let changEle: { [key: string]: string | Object } = { text: textValue, start: start, end: end };
        if (this.undoRedoStack.length >= this.steps) {
            this.undoRedoStack = this.undoRedoStack.slice(0, this.steps + 1);
        }
        if (this.undoRedoStack.length > 1 && (this.undoRedoStack[this.undoRedoStack.length - 1].start === start) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].end === end)) {
            return;
        }
        this.undoRedoStack.push(changEle);
        this.steps = this.undoRedoStack.length - 1;
        if (this.undoRedoStack.length > this.undoRedoSteps) {
            this.undoRedoStack.shift();
        }
        if (e && (e as IUndoCallBack).callBack) {
            (e as IUndoCallBack).callBack();
        }
    }
    /**
     * Undo the editable text.
     * @method undo
     * @return {void}
     */
    public undo(e?: IMarkdownSubCommands | IMDKeyboardEvent): void {
        if (this.steps > 0) {
            this.currentAction = 'Undo';
            let start: number = this.undoRedoStack[this.steps - 1].start;
            let end: number = this.undoRedoStack[this.steps - 1].end;
            let removedContent: string = this.undoRedoStack[this.steps - 1].text as string;
            (this.parent.element as HTMLTextAreaElement).value = removedContent;
            (this.parent.element as HTMLTextAreaElement).focus();
            this.steps--;
            this.restore(this.parent.element as HTMLTextAreaElement, start, end, e);
        }
    }
    /**
     * Redo the editable text.
     * @method redo
     * @return {void}
     */
    public redo(e?: IMarkdownSubCommands | IMDKeyboardEvent): void {
        if (this.undoRedoStack[this.steps + 1] != null) {
            this.currentAction = 'Redo';
            let start: number = this.undoRedoStack[this.steps + 1].start;
            let end: number = this.undoRedoStack[this.steps + 1].end;
            (this.parent.element as HTMLTextAreaElement).value = this.undoRedoStack[this.steps + 1].text as string;
            (this.parent.element as HTMLTextAreaElement).focus();
            this.steps++;
            this.restore(this.parent.element as HTMLTextAreaElement, start, end, e);
        }
    }
    private restore(textArea: HTMLTextAreaElement, start: number, end: number, event?: IMarkdownSubCommands | IMDKeyboardEvent): void {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: this.currentAction,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
    public getUndoStatus(): { [key: string]: boolean } {
        let status: { [key: string]: boolean } = { undo: false, redo: false };
        if (this.steps > 0) {
            status.undo = true;
        }
        if (this.undoRedoStack[this.steps + 1] != null) {
            status.redo = true;
        }
        return status;
    }
}