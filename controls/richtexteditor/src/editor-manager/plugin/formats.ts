import { EditorManager } from './../base/editor-manager';
import { NodeSelection } from './../../selection';
import { IHtmlSubCommands } from './../base/interface';
import * as EVENTS from './../../common/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Formats internal component
 * @hidden
 */
export class Formats {
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
        this.parent.observer.on(EVENTS.FORMAT_TYPE, this.applyFormats, this);
    }

    private getParentNode(node: Node): Node {
        for (; node.parentNode && node.parentNode !== this.parent.editableElement; null) {
            node = node.parentNode;
        }
        return node;
    }

    private applyFormats(e: IHtmlSubCommands): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let save: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        let formatsNodes: Node[] = this.parent.domNode.blockNodes();
        for (let i: number = 0; i < formatsNodes.length; i++) {
            let parentNode: Element;
            let replaceHTML: string;
            if (e.subCommand.toLowerCase() === 'blockquote') {
                parentNode = this.getParentNode(formatsNodes[i]) as Element;
                replaceHTML = this.parent.domNode.isList(parentNode) ? parentNode.outerHTML : parentNode.innerHTML;
            } else {
                parentNode = formatsNodes[i] as Element;
                replaceHTML = parentNode.innerHTML;
            }
            if (e.subCommand.toLowerCase() === parentNode.tagName.toLowerCase() ||
                isNullOrUndefined(parentNode.parentNode) || parentNode.tagName === 'LI') {
                continue;
            }
            this.cleanFormats(parentNode, e.subCommand);
            let replaceTag: string = this.parent.domNode.createTagString(
                e.subCommand, parentNode as Element, replaceHTML.replace(/>\s+</g, '><'));
            this.parent.domNode.replaceWith(parentNode, replaceTag);
        }
        (this.parent.editableElement as HTMLElement).focus();
        save = this.parent.domNode.saveMarker(save);
        save.restore();
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes() as Element[]
            });
        }
    }

    private cleanFormats(element: Element, tagName: string): void {
        let ignoreAttr: string[] = ['display', 'font-size', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-weight'];
        tagName = tagName.toLowerCase();
        for (let i: number = 0; i < ignoreAttr.length && (tagName !== 'p' && tagName !== 'blockquote' && tagName !== 'pre'); i++) {
            (element as HTMLElement).style.removeProperty(ignoreAttr[i]);
        }
    }
}

