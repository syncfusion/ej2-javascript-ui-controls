import * as Y from '../yjs-types';
import { InternalYRuntime, TextNodePosition, UndoPluginOptions, YUndoManagerEvent } from '../base/interface';
import { ySyncPluginKey } from './keys';
import { BlockManager } from '../../../block-manager';
import { decoupleReference, getAbsoluteOffset } from '../../../common/utils/common';
import { getNodeFromPath } from '../../../common/utils/selection';
import { getBlockContentElement } from '../../../common/utils/block';
import { findTextNodeAtOffset } from '../utils/dom-offset';
import { findClosestParent } from '../../../common/utils/dom';
import { IBlockSelectionState, IUndoRedoState } from '../../../common/interface';
import { Collaboration } from '../base/collaboration';
import { BlockEditorBinding } from './sync-plugin';

export class UndoPlugin {
    /** @hidden */
    public undoManager: Y.UndoManager;
    private parent: Collaboration;
    private syncPlugin: BlockEditorBinding;
    private yFragment: Y.XmlFragment;
    private blockManager: BlockManager;
    private isDestroyed: boolean = false;
    private maxStackSize: number = 30;
    private YRuntime: InternalYRuntime;
    private previousSelection: IBlockSelectionState;
    private preActionSelection: {
        anchor: Y.RelativePosition,
        focus: Y.RelativePosition
    } | null = null;

    constructor(options: UndoPluginOptions) {
        this.parent = options.parent;
        this.blockManager = options.blockManager;
        this.syncPlugin = this.parent.syncBinding;
        this.yFragment = options.yXmlFragment;
        this.maxStackSize = options.maxStackSize;
        this.YRuntime = this.parent.getYRuntime();

        this.undoManager = new this.YRuntime.UndoManager(options.yXmlFragment, {
            trackedOrigins: options.trackedOrigins || new Set([ySyncPluginKey])
        });

        // Listen for stack changes to notify UI and enforce size limits
        this.undoManager.on('stack-item-added', this.onStackItemAdded);
        this.undoManager.on('stack-item-popped', this.onStackItemPopped);
        this.undoManager.on('stack-cleared', this.onStackChange);

        // Expose plugin to undo action for UI integration
        this.blockManager.undoRedoAction.setYjsUndoPlugin(this);
    }

    private onStackItemAdded = (event: YUndoManagerEvent): void => {
        this.notifyStateChange();
        this.saveSelection(event);
        this.preActionSelection = null;
    }

    private onStackItemPopped = (event: YUndoManagerEvent): void => {
        this.notifyStateChange();
        this.restoreSelection(event);
    }

    private onStackChange = (): void => {
        this.notifyStateChange();
    }

    private notifyStateChange(): void {
        // Notify any registered callbacks of the new state
    }

    /**
     * Performs undo operation if available
     *
     * @returns {boolean} True if undo was performed, false otherwise
     * @hidden
     */
    undo(): boolean {
        if (!this.undoManager.canUndo()) {
            return false;
        }

        this.undoManager.undo();
        return true;
    }

    /**
     * Performs redo operation if available
     *
     * @returns {boolean} True if redo was performed, false otherwise
     * @hidden
     */
    redo(): boolean {
        if (!this.undoManager.canRedo()) {
            return false;
        }

        this.undoManager.redo();
        return true;
    }

    /**
     * Checks if undo operation is available
     *
     * @returns {boolean} True if undo is available
     * @hidden
     */
    canUndo(): boolean {
        return this.undoManager.canUndo();
    }

    /**
     * Checks if redo operation is available
     *
     * @returns {boolean} True if redo is available
     * @hidden
     */
    canRedo(): boolean {
        return this.undoManager.canRedo();
    }

    /**
     * Clears all undo and redo history
     *
     * @hidden
     * @returns {void}
     */
    clear(): void {
        this.undoManager.clear();
        this.notifyStateChange();
    }

    /**
     * Stops capturing undo/redo transactions
     *
     * @hidden
     * @returns {void}
     */
    stopCapturing(): void {
        this.undoManager.stopCapturing();
    }

    /**
     * Capture current selection state before any action tekes place(eg: cut)
     *
     * @param {IBlockSelectionState} prevSelection - current selection before any action takes place
     * @returns {void}
     * @hidden
     */
    public capturePreActionSelection(prevSelection: IBlockSelectionState): void {
        this.previousSelection = decoupleReference(prevSelection);
        this.preActionSelection = this.captureSelectionSnapshot('before');
    }

    /**
     * Captures selection snapshot before or after undo/redo
     *
     * @param {string} state - 'before' for undo selection, 'after' for redo selection
     * @returns {Object|null} Relative position for anchor and focus, or null if unavailable
     * @hidden
     */
    public captureSelectionSnapshot(state: 'before' | 'after'): {
        anchor: Y.RelativePosition,
        focus: Y.RelativePosition
    } | null {
        // Fetch the last captured state in editor's undostack
        const stack: IUndoRedoState[] = this.blockManager.undoRedoAction.undoRedoStack;
        const lastState: IUndoRedoState = stack.length > 0 ? stack[stack.length - 1] : null;
        if ((state === 'before' && (!lastState && !this.previousSelection)) || (state === 'after' && !lastState)) { return null; }

        const selection: IBlockSelectionState = state === 'before' ? this.previousSelection ? this.previousSelection : lastState.undoSelection : lastState.redoSelection;
        if (!selection) { return null; }

        const startBlock: HTMLElement = this.blockManager.rootEditorElement.querySelector('#' + selection.startBlockId) as HTMLElement;
        const endBlock: HTMLElement = this.blockManager.rootEditorElement.querySelector('#' + selection.endBlockId) as HTMLElement;
        if (!startBlock || !endBlock) { return null; }

        const startNode: Node = getNodeFromPath(startBlock, selection.startContainerPath);
        const endNode: Node = getNodeFromPath(endBlock, selection.endContainerPath);
        const startOffset: number = selection.startOffset;
        const endOffset: number = selection.endOffset;

        const anchor: { yText: Y.XmlText, index: number } = this.mapDOMToYText(startNode, startOffset);
        const focus: { yText: Y.XmlText, index: number } = this.mapDOMToYText(endNode, endOffset);
        this.previousSelection = null;
        if (!anchor || !focus) { return null; }

        return {
            anchor: this.YRuntime.createRelativePositionFromTypeIndex(anchor.yText, anchor.index),
            focus: this.YRuntime.createRelativePositionFromTypeIndex(focus.yText, focus.index)
        };
    }

    /**
     * Saves current selection to undo manager metadata
     *
     * @param {YUndoManagerEvent} event - Undo manager event with stack item metadata
     * @hidden
     * @returns {void}
     */
    public saveSelection(event: YUndoManagerEvent): void {
        const beforeSel: { anchor: Y.RelativePosition, focus: Y.RelativePosition } = this.preActionSelection || this.captureSelectionSnapshot('before');
        const afterSel: { anchor: Y.RelativePosition, focus: Y.RelativePosition } = this.captureSelectionSnapshot('after');
        if (beforeSel) {
            event.stackItem.meta.set('selectionBefore', beforeSel);
        }
        if (afterSel) {
            event.stackItem.meta.set('selectionAfter', afterSel);
        }
    }

    private restoreSelection(event: YUndoManagerEvent): void {
        const isUndo: boolean = event.type === 'undo';
        const metaKey: string = isUndo ? 'selectionBefore' : 'selectionAfter';
        const meta: { anchor: Y.RelativePosition, focus: Y.RelativePosition } = event.stackItem.meta.get(metaKey);
        if (!meta) { return; }

        const { anchor, focus } = meta;
        const anchorAbs: Y.AbsolutePosition = this.YRuntime.createAbsolutePositionFromRelativePosition(
            anchor,
            this.yFragment.doc
        );
        const focusAbs: Y.AbsolutePosition = this.YRuntime.createAbsolutePositionFromRelativePosition(
            focus,
            this.yFragment.doc
        );

        if (!anchorAbs || !focusAbs) { return; }

        const anchorDom: { node: Node, offset: number } = this.mapYTextToDOM(anchorAbs.type as Y.XmlText, anchorAbs.index);
        const focusDom: { node: Node, offset: number } = this.mapYTextToDOM(focusAbs.type as Y.XmlText, focusAbs.index);
        if (!anchorDom || !focusDom) { return; }

        const sel: Selection = window.getSelection();
        const range: Range = document.createRange();
        range.setStart(anchorDom.node, anchorDom.offset);
        range.setEnd(focusDom.node, focusDom.offset);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    private mapDOMToYText(node: Node, offset: number): { yText: Y.XmlText, index: number } | null {
        const blockEl: HTMLElement = findClosestParent(node, '.e-block') as HTMLElement;
        if (!blockEl) { return null; }

        const contentEl: HTMLElement = getBlockContentElement(blockEl) as HTMLElement;
        if (!contentEl) { return null; }

        const yText: Y.XmlText = this.syncPlugin.yBlockHelper.getYTextByBlockId(blockEl.id, this.yFragment);
        if (!yText) { return null; }

        return {
            yText,
            index: getAbsoluteOffset(contentEl, node, offset)
        };
    }

    private mapYTextToDOM(yText: Y.XmlText, index: number): { node: Node, offset: number } | null {
        const blockId: string = this.syncPlugin.yBlockHelper.findBlockIdForYText(yText, this.yFragment);
        if (!blockId) { return null; }

        const blockEl: HTMLElement = this.blockManager.getBlockElementById(blockId) as HTMLElement;
        if (!blockEl) { return null; }

        const contentEl: HTMLElement = getBlockContentElement(blockEl) as HTMLElement;
        if (!contentEl) { return null; }

        const pos: TextNodePosition | null = findTextNodeAtOffset(contentEl, index);

        return pos ? { node: pos.node, offset: pos.offsetInNode } : null;
    }

    destroy(): void {
        if (this.isDestroyed) { return; }
        this.isDestroyed = true;

        // Remove all listeners
        this.undoManager.off('stack-item-added', this.onStackItemAdded);
        this.undoManager.off('stack-item-popped', this.onStackItemPopped);
        this.undoManager.off('stack-cleared', this.onStackChange);

        // Destroy undo manager
        this.undoManager.destroy();
    }
}
