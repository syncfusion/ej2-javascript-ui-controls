import { NodeSelection } from './../../selection/index';

import { InsertMethods } from './insert-methods';

/**
 * Split the Node based on selection
 * @hidden
 */
export class NodeCutter {
    public position: number = -1;
    private nodeSelection: NodeSelection = new NodeSelection();
    // Split Selection Node
    public GetSpliceNode(range: Range, node: HTMLElement): Node {
        node = this.SplitNode(range, node, true);
        node = this.SplitNode(range, node, false);
        return node;
    }

    private SplitNode(range: Range, node: HTMLElement, isCollapsed: boolean): HTMLElement {
        if (node) {
            let clone: Range = range.cloneRange();
            let parent: HTMLElement = node.parentNode as HTMLElement;
            let index: number = this.nodeSelection.getIndex(node);
            clone.collapse(isCollapsed);
            (isCollapsed) ? clone.setStartBefore(node) : clone.setEndAfter(node);
            let fragment : DocumentFragment = clone.extractContents();
            if ( isCollapsed ) {
                node = parent.childNodes[index] as HTMLElement;
                fragment = this.spliceEmptyNode(fragment, false) as DocumentFragment;
                if (fragment && fragment.textContent !== '') {
                    if (node) {
                        InsertMethods.AppendBefore(fragment, node);
                    } else {
                        parent.appendChild(fragment);
                        let divNode: HTMLDivElement = document.createElement('div');
                        divNode.innerHTML = '&#65279;&#65279;';
                        node = divNode.firstChild as HTMLElement;
                        parent.appendChild(node);
                    }
                }
            } else {
                node = parent.childNodes.length > 1 ? parent.childNodes[index] as HTMLElement :
                parent.childNodes[0] as HTMLElement;
                fragment = this.spliceEmptyNode(fragment, true) as DocumentFragment;
                if (fragment && fragment.textContent !== '') {
                    if (node) {
                        InsertMethods.AppendBefore(fragment, node, true);
                    } else {
                        parent.appendChild(fragment);
                        let divNode: HTMLDivElement = document.createElement('div');
                        divNode.innerHTML = '&#65279;&#65279;';
                        parent.insertBefore(divNode.firstChild, parent.firstChild);
                        node = parent.firstChild as HTMLElement;
                    }
                }
            }
            return node;
        } else {
            return null;
        }
    }
    private spliceEmptyNode(fragment: DocumentFragment | Node, isStart: boolean): DocumentFragment | Node {
        let len: number = fragment.childNodes.length - 1;
        if (len > -1 && !isStart) {
            this.spliceEmptyNode(fragment.childNodes[len], isStart);
        } else if (len > -1) {
            this.spliceEmptyNode(fragment.childNodes[0], isStart);
        } else if (fragment.nodeType !== 3 && fragment.nodeType !== 11) {
            fragment.parentNode.removeChild(fragment);
        }
        return fragment;
    }

    // Cursor Position split

    private GetCursorStart(indexes: number[], index: number, isStart: boolean): number {
        indexes = (isStart) ? indexes : indexes.reverse();
        let position: number = indexes[0];
        for (let num: number = 0;
            num < indexes.length && ((isStart) ? (indexes[num] < index) : (indexes[num] >= index) );
            num++ ) {
            position = indexes[num];
        }
        return position;
    }

    public GetCursorRange(docElement: Document, range: Range, node: Node): Range {
        let cursorRange: Range = docElement.createRange();
        let indexes: number[] = [];
        indexes.push(0);
        let str: string = this.TrimLineBreak((node as Text).data);
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
        || ((indexes[indexes.length - 1] - 1 ) === range.startOffset ))) {
            cursorRange = range;
            this.position = 1;
        } else {
            let startOffset: number = this.GetCursorStart(indexes , range.startOffset, true);
            this.position = range.startOffset - startOffset;
            cursorRange.setStart(range.startContainer, startOffset);
            cursorRange.setEnd(range.startContainer, this.GetCursorStart(indexes, range.startOffset, false));
        }
        return cursorRange;
    }

    public GetCursorNode(docElement: Document, range: Range, node: Node): Node {
        return this.GetSpliceNode(this.GetCursorRange(docElement, range, node), node as HTMLElement);
    }

    public TrimLineBreak(line: string): string {
        return line.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
    }
}