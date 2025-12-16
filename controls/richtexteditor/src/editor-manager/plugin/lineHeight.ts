import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection';
import { IHtmlSubCommands } from './../base/interface';
import { isNullOrUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
import { setEditFrameFocus } from '../../common/util';
import { ILineHeightProperties } from './../base/interface';

/**
 * LineHeight internal component
 *
 * @hidden
 * @private
 */
export class LineHeight {
    private parent: EditorManager;

    /**
     * Constructor for creating the LineHeight plugin
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
        this.parent.observer.on(CONSTANT.LINE_HEIGHT_TYPE, this.applyLineHeight, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.LINE_HEIGHT_TYPE, this.applyLineHeight);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private applyLineHeight(e: IHtmlSubCommands): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let save: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        let blocks: Node[] = this.parent.domNode.blockNodes(); // Get block nodes in the selection
        // Filter out table related elements if line-height should not apply directly to them
        blocks = blocks.filter((node: Node) => node.nodeType === Node.ELEMENT_NODE &&
            ['TD', 'TH', 'TABLE'].indexOf((node as HTMLElement).tagName) === -1);
        if (e.enterAction === 'BR') {
            blocks = this.parent.domNode.convertToBlockNodes(blocks, false);
        }
        for (let i: number = 0; i < blocks.length; i++) {
            const blockElement: HTMLElement = blocks[i as number] as HTMLElement;
            if (!isNullOrUndefined(e.value) && !isNullOrUndefined((e.value as ILineHeightProperties).selectedValue) && (e.value as ILineHeightProperties).selectedValue === '') {
                setStyleAttribute(blockElement, { 'line-height': '' });
                if ((blockElement.getAttribute('style') === '')) {
                    blockElement.removeAttribute('style');
                }
            }
            else {
                // Apply line-height style to the block-level elements
                if ( !isNullOrUndefined(e.value) && !isNullOrUndefined((e.value as ILineHeightProperties).selectedValue)) {
                    setStyleAttribute(blockElement, { 'line-height': (e.value as ILineHeightProperties).selectedValue });
                }
            }
        }
        (this.parent.editableElement as HTMLElement).focus({ preventScroll: true });
        save = this.parent.domNode.saveMarker(save);
        if (this.parent.userAgentData.isMobileDevice()) {
            setEditFrameFocus(this.parent.editableElement, e.selector);
        }
        save.restore();
        if (e.callBack) {
            e.callBack({
                requestType: 'LineHeight',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: blocks as Element[] // Return the modified block elements
            });
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
