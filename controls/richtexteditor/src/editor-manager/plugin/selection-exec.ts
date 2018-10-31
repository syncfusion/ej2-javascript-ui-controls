import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { SelectionCommands } from './selection-commands';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import * as EVENTS from './../../common/constant';
/**
 * Selection EXEC internal component
 * @hidden
 */
export class SelectionBasedExec {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.SELECTION_TYPE, this.applySelection, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDownHandler, this);
    }
    private keyDownHandler(e: IHtmlKeyboardEvent): void {
        let validFormats: string[] = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase'];
        if (e.event.ctrlKey && validFormats.indexOf(e.event.action) > -1) {
            e.event.preventDefault();
            SelectionCommands.applyFormat(
                this.parent.currentDocument,
                e.event.action,
                this.parent.editableElement);
            this.callBack(e, e.event.action);
        }
    }

    private applySelection(e: IHtmlSubCommands): void {
        SelectionCommands.applyFormat(
            this.parent.currentDocument,
            e.subCommand.toLocaleLowerCase(),
            this.parent.editableElement,
            e.value as string);
        this.callBack(e, e.subCommand);
    }

    private callBack(event: IHtmlKeyboardEvent | IHtmlSubCommands, action: string): void {
        if (event.callBack) {
            event.callBack({
                requestType: action,
                event: event.event,
                editorMode: 'HTML',
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }
}