import { NodeSelection } from './../../selection/index';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';

/**
 * Split the Node based on selection
 *
 * @hidden
 * @deprecated
 */
export class NodeCutter {
    public enterAction: string = 'P'
    public position: number = -1;
    private nodeSelection: NodeSelection = new NodeSelection();
    // Split Selection Node
    /**
     * GetSpliceNode method
     *
     * @param {Range} range - specifies the range
     * @param {HTMLElement} node - specifies the node element.
     * @returns {Node} - returns the node value
     * @hidden
     * @deprecated
     */
    public GetSpliceNode(range: Range, node: HTMLElement): Node {
        node = this.SplitNode(range, node, true);
        node = this.SplitNode(range, node, false);
        return node;
    }

    /**
     * @param {Range} range - specifies the range
     * @param {HTMLElement} node - specifies the node element.
     * @param {boolean} isCollapsed - specifies the boolean value
     * @returns {HTMLElement} - returns the element
     * @hidden
     * @deprecated
     */
    public SplitNode(range: Range, node: HTMLElement, isCollapsed: boolean): HTMLElement {
        if (node) {
            const clone: Range = range.cloneRange();
            const parent: HTMLElement = node.parentNode as HTMLElement;
            const index: number = this.nodeSelection.getIndex(node);
            clone.collapse(isCollapsed);
            // eslint-disable-next-line
            (isCollapsed) ? clone.setStartBefore(node) : clone.setEndAfter(node);
            let fragment : DocumentFragment = clone.extractContents();
            if ( isCollapsed ) {
                node = parent.childNodes[index as number] as HTMLElement;
                fragment = this.spliceEmptyNode(fragment, false) as DocumentFragment;
                if (fragment && fragment.childNodes.length > 0) {
                    const isEmpty: boolean = (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName !== 'IMG' && !(fragment.querySelectorAll('img').length > 0)
                        && this.isRteElm(fragment) && fragment.textContent.trim() === '' && fragment.textContent.charCodeAt(0) !== 32 && fragment.textContent.charCodeAt(0) !== 160) ? true : false;
                    if (!isEmpty) {
                        if (node) {
                            InsertMethods.AppendBefore(fragment, node);
                        } else {
                            parent.appendChild(fragment);
                            const divNode: HTMLDivElement = document.createElement('div');
                            divNode.innerHTML = '&#65279;&#65279;';
                            node = divNode.firstChild as HTMLElement;
                            parent.appendChild(node);
                        }
                    }
                }
            } else {
                node = parent.childNodes.length > 1 ? parent.childNodes[index as number] as HTMLElement :
                    parent.childNodes[0] as HTMLElement;
                fragment = this.spliceEmptyNode(fragment, true) as DocumentFragment;
                if (fragment && fragment.childNodes.length > 0) {
                    const isEmpty: boolean = (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName !== 'IMG'
                        && this.isRteElm(fragment) && fragment.textContent.trim() === '' && fragment.textContent.charCodeAt(0) !== 32 && fragment.textContent.charCodeAt(0) !== 160) ? true : false;
                    if (!isEmpty) {
                        if (node) {
                            InsertMethods.AppendBefore(fragment, node, true);
                        } else if (parent.childNodes.length > 1 && parent.childNodes.length !== index) {
                            node = parent.childNodes[parent.childNodes.length - 1] as HTMLElement;
                            InsertMethods.AppendBefore(fragment, node, true);
                            node = node.nextSibling as HTMLElement;
                        } else {
                            parent.appendChild(fragment);
                            const divNode: HTMLDivElement = document.createElement('div');
                            divNode.innerHTML = '&#65279;&#65279;';
                            parent.insertBefore(divNode.firstChild, parent.firstChild);
                            node = parent.firstChild as HTMLElement;
                        }
                    }
                }
            }
            return node;
        } else {
            return null;
        }
    }
    private isRteElm(fragment: DocumentFragment): boolean {
        let result: boolean = true;
        if (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName !== 'IMG') {
            const firstChild: Node = fragment.childNodes[0];
            for (let i: number = 0; !isNOU(firstChild.childNodes) && i < firstChild.childNodes.length; i++) {
                if (firstChild.childNodes[i as number].nodeName === 'IMG' || (firstChild.childNodes[i as number].nodeName === 'SPAN' &&
                ((firstChild.childNodes[i as number] as HTMLElement).classList.contains('e-video-wrap') ||
                (firstChild.childNodes[i as number] as HTMLElement).classList.contains('e-embed-video-wrap') ||
                (firstChild.childNodes[i as number] as HTMLElement).classList.contains('e-audio-wrap')))) {
                    result = false;
                }
            }
        } else {
            result = true;
        }
        return result;
    }
    private spliceEmptyNode(fragment: DocumentFragment | Node, isStart: boolean): DocumentFragment | Node {
        let len: number;
        if (fragment.childNodes.length === 1 && fragment.childNodes[0].nodeName === '#text' &&
            fragment.childNodes[0].textContent === '' || fragment.textContent === '') {
            len = -1;
        } else {
            len = fragment.childNodes.length - 1;
        }
        if (len > -1 && !isStart) {
            this.spliceEmptyNode(fragment.childNodes[len as number], isStart);
        } else if (len > -1) {
            this.spliceEmptyNode(fragment.childNodes[0], isStart);
        } else if (fragment.nodeType !== 3 && fragment.nodeType !== 11 && fragment.nodeName !== 'IMG' && !((fragment as Element).querySelectorAll('img').length > 0 ) && !((fragment as Element).classList.contains('e-video-wrap')) && !((fragment as Element).classList.contains('e-audio-wrap'))) {
            fragment.parentNode.removeChild(fragment);
        }
        return fragment;
    }

    // Cursor Position split

    private GetCursorStart(indexes: number[], index: number, isStart: boolean): number {
        indexes = (isStart) ? indexes : indexes.reverse();
        let position: number = indexes[0];
        for (let num: number = 0;
            num < indexes.length && ((isStart) ? (indexes[num as number] < index) : (indexes[num as number] >= index) );
            num++ ) {
            position = indexes[num as number];
        }
        return position;
    }

    /**
     * GetCursorRange method
     *
     * @param {Document} docElement - specifies the document
     * @param {Range} range - specifies the range
     * @param {Node} node - specifies the node.
     * @returns {Range} - returns the range value
     * @hidden
     * @deprecated
     */
    public GetCursorRange(docElement: Document, range: Range, node: Node): Range {
        let cursorRange: Range = docElement.createRange();
        const indexes: number[] = [];
        indexes.push(0);
        const str: string = this.TrimLineBreak((node as Text).data);
        let index: number = str.indexOf(' ', 0);
        while ( index !== -1) {
            if (indexes.indexOf(index) < 0) {
                indexes.push(index);
            }
            if ( new RegExp('\\s').test(str[index - 1]) && (indexes.indexOf(index - 1) < 0) ) {
                indexes.push(index - 1);
            }
            if ( new RegExp('\\s').test(str[index + 1]) ) {
                indexes.push(index + 1);
            }
            index = str.indexOf(' ', (index + 1));
        }
        indexes.push(str.length);
        if ( (indexes.indexOf(range.startOffset) >= 0)
        || ( (indexes.indexOf(range.startOffset - 1) >= 0) && ( range.startOffset !== 1
        ||  ( range.startOffset === 1 && new RegExp('\\s').test(str[0])) )
        || (((indexes[indexes.length - 1] - 1 ) === range.startOffset) && range.endOffset !== (str.length - 1) && !new RegExp('\\s').test(str[0])))) {
            cursorRange = range;
            this.position = 1;
        } else {
            let startOffset: number = this.GetCursorStart(indexes , range.startOffset, true);
            this.position = range.startOffset - startOffset;
            if (startOffset !== 0 && str[startOffset as number] && str[startOffset as number] === ' ') {
                startOffset = startOffset + 1;
            }
            cursorRange.setStart(range.startContainer, startOffset);
            cursorRange.setEnd(range.startContainer, this.GetCursorStart(indexes, range.startOffset, false));
        }
        return cursorRange;
    }

    /**
     * GetCursorNode method
     *
     * @param {Document} docElement - specifies the document
     * @param {Range} range - specifies the range
     * @param {Node} node - specifies the node.
     * @returns {Node} - returns the node value
     * @hidden
     * @deprecated
     */
    public GetCursorNode(docElement: Document, range: Range, node: Node): Node {
        return this.GetSpliceNode(this.GetCursorRange(docElement, range, node), node as HTMLElement);
    }

    /**
     * TrimLineBreak method
     *
     * @param {string} line - specifies the string value.
     * @returns {string} - returns the string
     * @hidden
     * @deprecated
     */
    public TrimLineBreak(line: string): string {
        return line.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
    }
}
