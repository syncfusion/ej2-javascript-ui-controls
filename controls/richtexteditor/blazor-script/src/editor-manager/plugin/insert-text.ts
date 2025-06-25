import * as CONSTANT from '../base/constant';
import { EditorManager } from '../base/editor-manager';
import { IHtmlSubCommands } from '../base/interface';
import { InsertHtml } from './inserthtml';
import * as EVENTS from './../../common/constant';

/**
 * Insert a Text Node or Text
 *
 * @hidden
 * @deprecated
 */
export class InsertTextExec {
    private parent: EditorManager;
    /**
     * Constructor for creating the InsertText plugin
     *
     * @param {EditorManager} parent - specifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.INSERT_TEXT_TYPE, this.insertText, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.INSERT_TEXT_TYPE, this.insertText);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }
    private insertText(e: IHtmlSubCommands): void {
        const node: Node =  document.createTextNode(e.value as string);
        InsertHtml.Insert(this.parent.currentDocument, node as Node, this.parent.editableElement);
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
