import { debounce, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import { IHtmlSubCommands, IHtmlUndoRedoData } from './../base/interface';
import { NodeSelection } from './../../selection/selection';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { KeyboardEventArgs } from './../../rich-text-editor/actions/keyboard';
import * as EVENTS from './../../common/constant';
import { IUndoCallBack } from '../../common/interface';
import { isIDevice, setEditFrameFocus } from '../../common/util';
/**
 * `Undo` module is used to handle undo actions.
 */
export class UndoRedoManager {
    public element: HTMLElement;
    private parent: EditorManager;
    public steps: number;
    public undoRedoStack: IHtmlUndoRedoData[] = [];
    public undoRedoSteps: number;
    public undoRedoTimer: number;
    public constructor(parent?: EditorManager, options?: { [key: string]: number }) {
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.addEventListener();
    }
    protected addEventListener(): void {
        const debounceListener: Function = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(EVENTS.KEY_UP_HANDLER, debounceListener, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(EVENTS.ACTION, this.onAction, this);
        this.parent.observer.on(EVENTS.MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
    }
    private onPropertyChanged(props: { [key: string]: Object }): void {
        for (const prop of Object.keys(props.newProp)) {
            switch (prop) {
            case 'undoRedoSteps':
                this.undoRedoSteps = (props.newProp as { [key: string]: number }).undoRedoSteps;
                break;
            case 'undoRedoTimer':
                this.undoRedoTimer = (props.newProp as { [key: string]: number }).undoRedoTimer;
                break;
            }
        }
    }
    protected removeEventListener(): void {
        this.parent.observer.off(EVENTS.KEY_UP_HANDLER, this.keyUp);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.keyDown);
        this.parent.observer.off(EVENTS.ACTION, this.onAction);
    }

    /**
     * onAction method
     *
     * @param {IHtmlSubCommands} e - specifies the sub command
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public onAction(e: IHtmlSubCommands): void {
        if (e.subCommand === 'Undo') {
            this.undo(e);
        } else {
            this.redo(e);
        }
    }
    /**
     * Destroys the ToolBar.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        this.removeEventListener();
    }
    private keyDown(e: IHtmlKeyboardEvent): void {
        const event: KeyboardEvent = e.event as KeyboardEvent;
        // eslint-disable-next-line
        const proxy: this = this;
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
    private keyUp(e: IHtmlKeyboardEvent): void {
        if ((e.event as KeyboardEvent).keyCode !== 17 && !(e.event as KeyboardEventArgs).ctrlKey) {
            this.saveData(e);
        }
    }
    /**
     * RTE collection stored html format.
     *
     * @function saveData
     * @param {KeyboardEvent} e - specifies the keyboard event
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public saveData(e?: KeyboardEvent | MouseEvent | IUndoCallBack): void {
        let range: Range = new NodeSelection().getRange(this.parent.currentDocument);
        const currentContainer: Node = this.parent.editableElement === range.startContainer.parentElement ?
            range.startContainer.parentElement : range.startContainer;
        for (let i = currentContainer.childNodes.length - 1; i >= 0; i--) {
            if (!isNullOrUndefined(currentContainer.childNodes[i]) && currentContainer.childNodes[i].nodeName === '#text' &&
            currentContainer.childNodes[i].textContent.length === 0 && currentContainer.childNodes[i].nodeName !== 'IMG' &&
            currentContainer.childNodes[i].nodeName !== 'BR' && currentContainer.childNodes[i].nodeName && 'HR') {
                detach(currentContainer.childNodes[i]);
            }
        }
        range = new NodeSelection().getRange(this.parent.currentDocument);
        const save: NodeSelection = new NodeSelection().save(range, this.parent.currentDocument);
        const htmlText: string = this.parent.editableElement.innerHTML;
        const changEle: { [key: string]: string | Object} = { text: htmlText, range: save };
        if (this.undoRedoStack.length >= this.steps) {
            this.undoRedoStack = this.undoRedoStack.slice(0, this.steps + 1);
        }
        if (this.undoRedoStack.length > 1 && (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.collapsed === range.collapsed)
            && (this.undoRedoStack[this.undoRedoStack.length - 1].range.startOffset === save.range.startOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.endOffset === save.range.endOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.startContainer === save.range.startContainer) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].text.trim() === (changEle.text as string).trim())) {
            return;
        }
        this.undoRedoStack.push(changEle);
        this.steps = this.undoRedoStack.length - 1;
        if (this.steps > this.undoRedoSteps) {
            this.undoRedoStack.shift();
            this.steps--;
        }
        if (e && (e as IHtmlKeyboardEvent).callBack) {
            (e as IHtmlKeyboardEvent).callBack();
        }
    }
    /**
     * Undo the editable text.
     *
     * @function undo
     * @param {IHtmlSubCommands} e - specifies the sub commands
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public undo(e?: IHtmlSubCommands | IHtmlKeyboardEvent): void {
        if (this.steps > 0) {
            const range: string | object = this.undoRedoStack[this.steps - 1].range;
            const removedContent: string = this.undoRedoStack[this.steps - 1].text as string;
            this.parent.editableElement.innerHTML = removedContent;
            (this.parent.editableElement as HTMLElement).focus();
            if (isIDevice()) {
                setEditFrameFocus(this.parent.editableElement, (e as IHtmlSubCommands).selector);
            }
            (range as NodeSelection).restore();
            this.steps--;
            if (e.callBack) {
                e.callBack({
                    requestType: 'Undo',
                    editorMode: 'HTML',
                    range: range as Range,
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[],
                    event: e.event
                });
            }
        }
    }
    /**
     * Redo the editable text.
     *
     * @param {IHtmlSubCommands} e - specifies the sub commands
     * @function redo
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public redo(e?: IHtmlSubCommands | IHtmlKeyboardEvent): void {
        if (this.undoRedoStack[this.steps + 1] != null) {
            const range: string | object = this.undoRedoStack[this.steps + 1].range;
            this.parent.editableElement.innerHTML = this.undoRedoStack[this.steps + 1].text as string;
            (this.parent.editableElement as HTMLElement).focus();
            if (isIDevice()) {
                setEditFrameFocus(this.parent.editableElement, (e as IHtmlSubCommands).selector);
            }
            (range as NodeSelection).restore();
            this.steps++;
            if (e.callBack) {
                e.callBack({
                    requestType: 'Redo',
                    editorMode: 'HTML',
                    range: range as Range,
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[],
                    event: e.event
                });
            }
        }
    }

    /**
     * getUndoStatus method
     *
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public getUndoStatus(): { [key: string]: boolean } {
        const status: { [key: string]: boolean } = { undo: false, redo: false };
        if (this.steps > 0) {
            status.undo = true;
        }
        if (this.undoRedoStack[this.steps + 1] != null) {
            status.redo = true;
        }
        return status;
    }
}
