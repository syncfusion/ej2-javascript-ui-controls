import { debounce, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import { IHtmlSubCommands, IHtmlUndoRedoData } from './../base/interface';
import { NodeSelection } from './../../selection/selection';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { KeyboardEventArgs } from './../../rich-text-editor/actions/keyboard';
import * as EVENTS from './../../common/constant';
import { IUndoCallBack } from '../../common/interface';
import { isIDevice, scrollToCursor, setEditFrameFocus } from '../../common/util';
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
    private debounceListener: Function;
    public constructor(parent?: EditorManager, options?: { [key: string]: number }) {
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.addEventListener();
    }
    protected addEventListener(): void {
        this.debounceListener = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(EVENTS.KEY_UP_HANDLER, this.debounceListener, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(EVENTS.ACTION, this.onAction, this);
        this.parent.observer.on(EVENTS.MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
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
        this.parent.observer.off(EVENTS.MODEL_CHANGED_PLUGIN, this.onPropertyChanged);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
        this.debounceListener = null;
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
        this.element = null;
        this.steps = null;
        this.undoRedoStack = [];
        this.undoRedoSteps = null;
        this.undoRedoTimer = null;
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
    private getTextContentFromFragment(fragment: DocumentFragment | HTMLElement): string {
        let textContent: string = '';
        for (let i: number = 0; i < fragment.childNodes.length; i++) {
            const childNode: Node = fragment.childNodes[i as number];
            if (childNode.nodeType === Node.TEXT_NODE) {
                textContent += childNode.textContent;
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                textContent += this.getTextContentFromFragment(childNode as HTMLElement);
            }
        }
        return textContent;
    }
    private isElementStructureEqual(previousFragment: DocumentFragment | HTMLElement, currentFragment: DocumentFragment | HTMLElement):
    boolean {
        if (previousFragment.childNodes.length !== currentFragment.childNodes.length) {
            return false;
        }
        for (let i: number = 0; i < previousFragment.childNodes.length; i++) {
            const previousFragmentNode: ChildNode = previousFragment.childNodes[i as number];
            const currentFragmentNode: ChildNode = currentFragment.childNodes[i as number];

            if (!previousFragmentNode || !currentFragmentNode) {
                return false;
            }

            if (previousFragmentNode.nodeType !== currentFragmentNode.nodeType) {
                return false;
            }

            if ((previousFragmentNode as Element).outerHTML !== (currentFragmentNode as Element).outerHTML) {
                return false;
            }
        }
        return true;
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
        if (!this.parent.currentDocument) {
            return;
        }
        let range: Range = new NodeSelection().getRange(this.parent.currentDocument);
        const currentContainer: Node = this.parent.editableElement === range.startContainer.parentElement ?
            range.startContainer.parentElement : range.startContainer;
        for (let i: number = currentContainer.childNodes.length - 1 ; i >= 0; i--) {
            if (!isNullOrUndefined(currentContainer.childNodes[i as number]) && currentContainer.childNodes[i as number].nodeName === '#text' &&
            currentContainer.childNodes[i as number].textContent.length === 0 && currentContainer.childNodes[i as number].nodeName !== 'IMG' &&
            currentContainer.childNodes[i as number].nodeName !== 'BR' && currentContainer.childNodes[i as number].nodeName && 'HR') {
                detach(currentContainer.childNodes[i as number]);
            }
        }
        range = new NodeSelection().getRange(this.parent.currentDocument);
        const save: NodeSelection = new NodeSelection().save(range, this.parent.currentDocument);
        const clonedElement: HTMLElement = this.parent.editableElement.cloneNode(true) as HTMLElement;
        const fragment: DocumentFragment = document.createDocumentFragment();
        while (clonedElement.firstChild) {
            fragment.appendChild(clonedElement.firstChild);
        }
        const changEle: { [key: string]: DocumentFragment | Object } = { text: fragment, range: save };
        if (this.undoRedoStack.length >= this.steps) {
            this.undoRedoStack = this.undoRedoStack.slice(0, this.steps + 1);
        }
        if (this.undoRedoStack.length > 1 && (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.collapsed === range.collapsed)
            && (this.undoRedoStack[this.undoRedoStack.length - 1].range.startOffset === save.range.startOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.endOffset === save.range.endOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.startContainer === save.range.startContainer) &&
            (this.getTextContentFromFragment(this.undoRedoStack[this.undoRedoStack.length - 1].text).trim() ===
            this.getTextContentFromFragment(changEle.text as DocumentFragment).trim()) &&
            this.isElementStructureEqual(this.undoRedoStack[this.undoRedoStack.length - 1].text, changEle.text as DocumentFragment)) {
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
            const removedContent: DocumentFragment = this.undoRedoStack[this.steps - 1].text;
            this.parent.editableElement.innerHTML = '';
            this.parent.editableElement.appendChild(removedContent.cloneNode(true));
            (this.parent.editableElement as HTMLElement).focus();
            scrollToCursor(this.parent.currentDocument, this.parent.editableElement as HTMLElement);
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
            const addedContent: DocumentFragment = this.undoRedoStack[this.steps + 1].text;
            this.parent.editableElement.innerHTML = '';
            this.parent.editableElement.appendChild(addedContent.cloneNode(true));
            (this.parent.editableElement as HTMLElement).focus();
            scrollToCursor(this.parent.currentDocument, this.parent.editableElement as HTMLElement);
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
