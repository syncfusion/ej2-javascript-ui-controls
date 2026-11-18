import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../base/interface';
import { setStyleAttribute, KeyboardEventArgs, closest } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
import { isIDevice, setEditFrameFocus } from '../../common/util';
/**
 * Formats internal component
 *
 * @hidden
 * @private
 */
export class Alignments {
    private parent: EditorManager;
    private alignments: { [key: string]: string } = {
        'JustifyLeft': 'left',
        'JustifyCenter': 'center',
        'JustifyRight': 'right',
        'JustifyFull': 'justify'
    };
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {EditorManager} parent - specifies the parent element.
     * @returns {void}
     * @hidden
     * @private
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.ALIGNMENT_TYPE, this.applyAlignment, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.ALIGNMENT_TYPE, this.applyAlignment);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }
    private onKeyDown(e: IHtmlKeyboardEvent): void {
        switch ((e.event as KeyboardEventArgs).action) {
        case 'justify-center':
            this.applyAlignment({ subCommand: 'JustifyCenter', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'justify-full':
            this.applyAlignment({ subCommand: 'JustifyFull', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'justify-left':
            this.applyAlignment({ subCommand: 'JustifyLeft', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'justify-right':
            this.applyAlignment({ subCommand: 'JustifyRight', callBack: e.callBack });
            e.event.preventDefault();
            break;
        }
    }
    private getTableNode(range: Range): Node[] {
        const startNode: Node = range.startContainer.nodeType === Node.ELEMENT_NODE
            ? range.startContainer : range.startContainer.parentNode;
        const cellNode: Node = closest(startNode, 'td,th');
        return [cellNode];
    }

    private applyAlignment(e: IHtmlSubCommands): void {
        const isTableAlign: boolean = e.value === 'Table' ? true : false;
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let save: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        if (!isTableAlign) {
            this.parent.domNode.setMarker(save);
            let alignmentNodes: Node[] = this.parent.domNode.blockNodes();
            if (e.enterAction === 'BR') {
                alignmentNodes = this.parent.domNode.convertToBlockNodes(alignmentNodes, false);
            }
            for (let i: number = 0; i < alignmentNodes.length; i++) {
                const parentNode: Element = alignmentNodes[i as number] as Element;
                setStyleAttribute(parentNode as HTMLElement, { 'text-align': this.alignments[e.subCommand] });
            }
            const imageTags: NodeListOf<HTMLImageElement> = this.parent.domNode.getImageTagInSelection();
            for (let i: number = 0; i < imageTags.length; i++) {
                const elementNode: Node[] = [];
                elementNode.push(imageTags[i as number]);
                this.parent.imgObj.imageCommand({
                    item: {
                        selectNode: elementNode
                    },
                    subCommand: e.subCommand,
                    value: e.subCommand,
                    callBack: e.callBack,
                    selector: e.selector
                });
            }
            (this.parent.editableElement as HTMLElement).focus({ preventScroll: true });
            save = this.parent.domNode.saveMarker(save);
            if (isIDevice()) {
                setEditFrameFocus(this.parent.editableElement, e.selector);
            }
            save.restore();
        } else {
            const selectedTableCells: NodeListOf<HTMLElement> = this.parent.editableElement.querySelectorAll('.e-cell-select');
            if (selectedTableCells.length > 0) {
                for (let i: number = 0; i < selectedTableCells.length; i++) {
                    setStyleAttribute(selectedTableCells[i as number] as HTMLElement, { 'text-align': this.alignments[e.subCommand] });
                }
            }
            else {
                setStyleAttribute(this.getTableNode(range)[0] as HTMLElement, { 'text-align': this.alignments[e.subCommand] });
            }
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: (isTableAlign ? this.getTableNode(range) : this.parent.domNode.blockNodes()) as Element[]
            });
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
