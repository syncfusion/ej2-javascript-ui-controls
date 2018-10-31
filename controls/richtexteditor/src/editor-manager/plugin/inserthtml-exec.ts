import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { InsertHtml } from './inserthtml';
import { IHtmlSubCommands } from './../base/interface';

/**
 * Selection EXEC internal component
 * @hidden
 */
export class InsertHtmlExec {
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
        this.parent.observer.on(CONSTANT.INSERTHTML_TYPE, this.applyHtml, this);
    }
    private applyHtml(e: IHtmlSubCommands): void {
        InsertHtml.Insert(
            this.parent.currentDocument,
            e.value as Node );
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
}