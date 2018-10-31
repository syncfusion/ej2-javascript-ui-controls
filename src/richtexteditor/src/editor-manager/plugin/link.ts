import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { IHtmlItem } from './../base/interface';
import { InsertHtml } from './inserthtml';
/**
 * Link internal component
 * @hidden
 */
export class LinkCommand {
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
        this.parent.observer.on(CONSTANT.LINK, this.createLink, this);
    }

    private createLink(e: IHtmlItem): void {
        if (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent.length > 0 &&
            (e.item.selectParent[0] as HTMLElement).tagName === 'A') {
            let anchorEle: HTMLElement = e.item.selectParent[0] as HTMLElement;
            anchorEle.setAttribute('href', e.item.url);
            anchorEle.setAttribute('title', e.item.title);
            anchorEle.innerHTML = e.item.text;
            anchorEle.setAttribute('target', e.item.target);
            e.item.selection.setSelectionText(this.parent.currentDocument, anchorEle, anchorEle, 1, 1);
        } else {
            let anchor: HTMLElement = createElement('a', {
                className: 'e-rte-anchor', attrs: {
                    href: e.item.url,
                    target: e.item.target,
                    title: e.item.title === '' ? e.item.url : e.item.title
                }
            });
            anchor.innerText = e.item.text === '' ? e.item.url : e.item.text;
            e.item.selection.restore();
            InsertHtml.Insert(this.parent.currentDocument, anchor);
            if (e.event && (e.event as KeyboardEvent).type === 'keydown' && (e.event as KeyboardEvent).keyCode === 32) {
                let startContainer: Node = e.item.selection.range.startContainer;
                startContainer.textContent = this.removeText(startContainer.textContent, e.item.url);
            } else {
                e.item.selection.setSelectionText(
                    this.parent.currentDocument, anchor.childNodes[0], anchor.childNodes[0], 0, anchor.childNodes[0].textContent.length);
            }
        }
        if (e.callBack) {
            e.callBack({
                requestType: 'Links',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }
    private removeText(text: string, val: string): string {
        let arr: string[] = text.split(' ');
        for (let i: number = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr.join(' ');
    }
}