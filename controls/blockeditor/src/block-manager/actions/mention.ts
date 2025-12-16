import { RangePath } from '../../common/interface';
import { getSelectedRange } from '../../common/utils/selection';
import { getBlockModelById } from '../../common/utils/block';
import { BlockModel, ContentModel } from '../../models/index';
import { BlockManager } from '../base/block-manager';
import { events } from '../../common/constant';

export class MentionAction {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.wireEvents();
    }

    private wireEvents(): void {
        this.parent.observer.on('mentionOpened', this.onMentionOpen, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private unWireEvents(): void {
        this.parent.observer.off('mentionOpened', this.onMentionOpen);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    public onMentionOpen(): void {
        this.parent.nodeSelection.storeCurrentRange();
    }

    /**
     * Cleans the artifacts of mention control in BlockEditor such as mention chip and zero width space.
     *
     * @param {HTMLElement} element - specifies the element.
     * @param {boolean} isRemoveChip - specifies whether to remove the mention chip
     * @returns {void}
     * @hidden
     */
    public cleanMentionArtifacts(element: HTMLElement, isRemoveChip?: boolean): void {
        if (element) {
            const range: Range = getSelectedRange();
            if (!range) { return; }
            const rangeParent: HTMLElement = range.startContainer.nodeType === Node.TEXT_NODE
                ? range.startContainer.parentElement
                : (range.startContainer as HTMLElement);
            const mentionChips: NodeListOf<HTMLElement> = rangeParent.querySelectorAll('span.e-mention-chip');
            if (mentionChips && mentionChips.length > 0) {
                mentionChips.forEach((chip: HTMLElement) => {
                    const nextSibling: Node = chip.nextSibling as Node;
                    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent === '\u200B') {
                        nextSibling.parentNode.removeChild(nextSibling);
                    }
                    if (isRemoveChip) {
                        chip.remove();
                    }
                });
            }
        }
    }

    /**
     * Removes the mention query keys from the block model.
     * When triggering command such as '/' or the filter queries, this function effectively cleans it in the block model
     *
     * @param {string} mentionChar - specifies the mention character.
     * @param {boolean} isUndoRedoAction - specifies whether the action is undo/redo action.
     * @returns {void}
     * @hidden
     */
    public removeMentionQueryKeysFromModel(mentionChar: string, isUndoRedoAction?: boolean): void {
        const rangePath: RangePath = this.parent.nodeSelection.getStoredBackupRange();
        if ((!rangePath || isUndoRedoAction) ||
            (rangePath && (!rangePath.startContainer || !rangePath.endContainer))) {
            return;
        }
        const { startOffset, endOffset, parentElement }: RangePath = rangePath;
        const blockEl: HTMLElement = this.parent.currentFocusedBlock as HTMLElement;
        const block: BlockModel = getBlockModelById(blockEl.id, this.parent.getEditorBlocks());

        if (!block || !block.content || block.content.length === 0) { return; }

        const affectedContent: ContentModel = block.content.find((c: ContentModel) => c.id === parentElement.id);
        if (!affectedContent) { return; }
        const text: string = affectedContent.content;
        if (startOffset === endOffset) {
            let start: number = startOffset;
            while (start > 0 && text[start - 1] !== mentionChar) {
                start--;
            }
            // Adjust -1 to the start to remove the mention char as well.
            affectedContent.content = text.slice(0, start - 1) + text.slice(endOffset);

            // Remove contentchanged action triggered by typing '/'
            if (!isUndoRedoAction) {
                if (this.parent.undoRedoAction.undoRedoStack.length > 0) {
                    this.parent.undoRedoAction.undoRedoStack.pop();
                    this.parent.undoRedoAction.index = this.parent.undoRedoAction.undoRedoStack.length - 1;
                }
            }
        }
        this.parent.stateManager.updateManagerBlocks();
    }

    private destroy(): void {
        this.unWireEvents();
    }
}
