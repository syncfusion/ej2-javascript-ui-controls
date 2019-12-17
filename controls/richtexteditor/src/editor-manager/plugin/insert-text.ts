import * as CONSTANT from '../base/constant';

import { EditorManager } from '../base/editor-manager';
import { IHtmlSubCommands } from '../base/interface';
import { InsertHtml } from './inserthtml';

/**
 * Insert a Text Node or Text
 * @hidden
 * @deprecated
 */
export class InsertTextExec {
    private parent: EditorManager;
    /**
     * Constructor for creating the InsertText plugin
     * @hidden
     * @deprecated
     */
    constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.INSERT_TEXT_TYPE, this.insertText, this);
    }
    private insertText(e: IHtmlSubCommands): void {
        let node: Node =  document.createTextNode(e.value as string);
        InsertHtml.Insert(this.parent.currentDocument, node as Node);
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