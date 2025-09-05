import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { InsertHtml } from './inserthtml';
import { IHtmlSubCommands } from './../base/interface';
import * as EVENTS from './../../common/constant';
import { NodeSelection } from './../../selection/index';
import { closest } from '../../../../base'; /*externalscript*/
import { NotifyArgs } from '../../common/interface';

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
        const selectionRange: Range = this.getSelectionRange();
        const element: HTMLElement = e.value as HTMLElement;
        const firstChild: ChildNode = element.firstChild;
        if (firstChild && firstChild.nodeName === 'A' && selectionRange.startOffset !== selectionRange.endOffset) {
            const isTextNode: boolean = selectionRange.startContainer.nodeName === '#text';
            const notifyType: string = isTextNode ? CONSTANT.LINK : CONSTANT.IMAGE;
            const actionType: string = isTextNode ? 'CreateLink' : 'InsertLink';
            this.parent.observer.notify(notifyType, {
                value: actionType,
                item: this.extractHyperlinkDetails(e),
                callBack: e.callBack
            });
        }
        else {
            InsertHtml.Insert(
                this.parent.currentDocument,
                e.value as Node, this.parent.editableElement, true, e.enterAction, this.parent);
        }
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
    private extractHyperlinkDetails(e: IHtmlSubCommands): NotifyArgs {
        let selectedText: string;
        const selectionRange: Range = this.getSelectionRange();
        const selection: NodeSelection = this.parent.nodeSelection;
        const parentNodes: Node[] = selection.getParentNodeCollection(selectionRange);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anchor: any = (e.value as HTMLElement).querySelector('a');
        const anchorElement: HTMLElement = this.findAnchorElement(parentNodes);
        if (anchorElement && anchorElement.nodeName === 'A') {
            const rangeText: string = selectionRange.toString();
            const anchorText: string = anchorElement.innerText;
            selectedText = (rangeText.length < anchorText.length) ? anchorText : rangeText;
        } else {
            selectedText = selectionRange.toString();
        }
        return {
            url: anchor.href || '',
            text: selectedText,
            title: anchor.title || '',
            target: anchor.target || '',
            ariaLabel: anchor.ariaLabel || '',
            selection: this.parent.nodeSelection,
            selectNode: Array.from(this.getSelectionRange().startContainer.childNodes),
            selectParent: parentNodes
        };
    }
    private getSelectionRange(): Range {
        return this.parent.nodeSelection.getRange(this.parent.currentDocument);
    }
    private findAnchorElement(nodes: Node[]): HTMLElement {
        for (const node of nodes) {
            const anchor: HTMLElement | null = closest(node, 'a') as HTMLElement;
            if (anchor) {
                return anchor;
            }
        }
        return nodes[0] as HTMLElement;
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
