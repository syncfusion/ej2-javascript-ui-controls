import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { InsertHtml } from './inserthtml';
import { IHtmlSubCommands } from './../base/interface';
import * as EVENTS from './../../common/constant';

/**
 * Selection EXEC internal component
 *
 * @hidden
 * @deprecated
 */
export class InsertHtmlExec {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {EditorManager} parent - sepcifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.INSERTHTML_TYPE, this.applyHtml, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.INSERTHTML_TYPE, this.applyHtml);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }
    private applyHtml(e: IHtmlSubCommands): void {
        InsertHtml.Insert(
            this.parent.currentDocument,
            e.value as Node, this.parent.editableElement, true, e.enterAction);
        if (e.subCommand === 'pasteCleanup') {
            const pastedElements: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('.pasteContent_RTE');
            const allPastedElements: Element[] = [].slice.call(pastedElements);
            const imgElements: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('.pasteContent_Img');
            const allImgElm: Element[] = [].slice.call(imgElements);
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                elements: allPastedElements,
                imgElem: allImgElm
            });
        } else {
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

    public destroy(): void {
        this.removeEventListener();
    }
}
