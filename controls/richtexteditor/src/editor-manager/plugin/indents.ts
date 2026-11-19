import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
import { isIDevice, setEditFrameFocus } from '../../common/util';
/**
 * Indents internal component
 *
 * @hidden
 * @private
 */
export class Indents {
    private parent: EditorManager;
    private indentValue: number = 20;
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {EditorManager} parent - specifies the parent element
     * @hidden
     * @private
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.INDENT_TYPE, this.applyIndents, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.INDENT_TYPE, this.applyIndents);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);

    }

    /**
     * Converts margin values with units (in, pt, px, etc.) to pixels.
     *
     * @param {string} marginValue - the margin value with unit (e.g., "1.0in", "20px", "12pt")
     * @returns {number} - the value in pixels
     * @private
     */
    private convertMarginToPixels(marginValue: string): number {
        if (!marginValue || marginValue === '') {
            return 0;
        }
        // Extract numeric value and unit
        const match: RegExpMatchArray | null = marginValue.match(/^([\d.]+)(.*)$/);
        if (!match) {
            return 0;
        }
        const numValue: number = parseFloat(match[1]);
        const unit: string = match[2].trim().toLowerCase();
        // Convert to pixels based on unit
        switch (unit) {
        case 'in': // inches: 1 inch = 96px
            return numValue * 96;
        case 'cm': // centimeters: 1cm = 37.8px
            return numValue * 37.8;
        case 'mm': // millimeters: 1mm = 3.78px
            return numValue * 3.78;
        case 'pt': // points: 1pt = 1.333px
            return numValue * 1.333;
        case 'em': // em units (relative to font size, assume 16px base)
            return numValue * 16;
        case 'px':
        default:
            return numValue;
        }
    }
    private onKeyDown(e: IHtmlKeyboardEvent): void {
        switch ((e.event as KeyboardEventArgs).action) {
        case 'indents':
            this.applyIndents({ subCommand: 'Indent', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'outdents':
            this.applyIndents({ subCommand: 'Outdent', callBack: e.callBack });
            e.event.preventDefault();
            break;
        }
    }
    private applyIndents(e: IHtmlSubCommands): void {
        const editEle: HTMLElement = this.parent.editableElement as HTMLElement;
        const isRtl: boolean = editEle.classList.contains('e-rtl');
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        if (!isNullOrUndefined(this.parent.codeBlockObj)) {
            const isWithinCodeBlock: boolean = this.parent.codeBlockObj.
                isSelectionWithinCodeBlock(range,  range.startContainer, range.endContainer);
            if (isWithinCodeBlock) {
                this.parent.observer.
                    notify(EVENTS.CODEBLOCK_INDENTATION, {e: e, event: e.event, subCommand: e.subCommand, callBack: e.callBack});
                return;
            }
        }
        let save: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        let indentsNodes: Node[] = this.parent.domNode.blockNodes();
        if (e.enterAction === 'BR') {
            indentsNodes = this.parent.domNode.convertToBlockNodes(indentsNodes, false);
        }
        const parentNodes: Node[] = indentsNodes.slice();
        const listsNodes: Node[] = [];
        for (let i: number = 0; i < parentNodes.length; i++) {
            if ((parentNodes[i as number] as Element).tagName !== 'LI' && 'LI' === (parentNodes[i as number].parentNode as Element).tagName) {
                indentsNodes.splice(indentsNodes.indexOf(parentNodes[i as number]), 1);
                listsNodes.push(parentNodes[i as number].parentNode);
            } else if ((parentNodes[i as number] as Element).tagName === 'LI') {
                indentsNodes.splice(indentsNodes.indexOf(parentNodes[i as number]), 1);
                listsNodes.push(parentNodes[i as number]);
            }
        }
        if (listsNodes.length > 0) {
            this.parent.observer.notify(EVENTS.KEY_DOWN_HANDLER, {
                event: {
                    preventDefault: () => {
                        return;
                    },
                    stopPropagation: () => {
                        return;
                    },
                    shiftKey: (e.subCommand === 'Indent' ? false : true),
                    which: 9,
                    action: 'indent'
                }
            });
        }
        for (let i: number = 0; i < indentsNodes.length; i++) {
            let parentNode: HTMLElement;
            if (indentsNodes[i as number] && (indentsNodes[i as number] as HTMLElement).classList.contains('e-table-fake-selection') &&
                editEle.querySelector('table.e-cell-select')) {
                parentNode = editEle.querySelector('table.e-cell-select');
            } else {
                parentNode = indentsNodes[i as number] as HTMLElement;
            }
            const marginLeftOrRight: string = isRtl ? parentNode.style.marginRight : parentNode.style.marginLeft;
            let indentsValue: string;
            if (parentNode.tagName !== 'HR') {
                if (e.subCommand === 'Indent') {
                    /* eslint-disable */
                    const currentMarginInPixels = this.convertMarginToPixels(marginLeftOrRight);
                    const newMarginInPixels = currentMarginInPixels + this.indentValue;
                    indentsValue = newMarginInPixels + 'px';
                    isRtl ? (parentNode.style.marginRight = indentsValue) : (parentNode.style.marginLeft = indentsValue);
                } else {
                    const currentMarginInPixels = this.convertMarginToPixels(marginLeftOrRight);
                    const newMarginInPixels = currentMarginInPixels - this.indentValue;
                    indentsValue = (marginLeftOrRight === '' || marginLeftOrRight === '0px' || marginLeftOrRight === '0in') ? '' : (newMarginInPixels < 0) ? '0px' : newMarginInPixels + 'px';
                    isRtl ? (parentNode.style.marginRight = indentsValue) : (parentNode.style.marginLeft = indentsValue);
                    /* eslint-enable */
                }
            }
        }
        editEle.focus({ preventScroll: true });
        if (isIDevice()) {
            setEditFrameFocus(editEle, e.selector);
        }
        if (indentsNodes.length === 0 || indentsNodes[0] && indentsNodes[0].nodeName !== 'TABLE') {
            save = this.parent.domNode.saveMarker(save);
            save.restore();
        }
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

    public destroy(): void {
        this.removeEventListener();
    }
}
