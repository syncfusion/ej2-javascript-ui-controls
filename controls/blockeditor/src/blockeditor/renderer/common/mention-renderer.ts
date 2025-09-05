import { Mention, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { BlockEditor } from '../../base/index';
import { IMentionRenderOptions, IUndoRedoState, RangePath } from '../../base/interface';
import { getSelectedRange } from '../../utils/selection';
import { getBlockModelById } from '../../utils/block';
import { BlockModel, ContentModel } from '../../models/index';
import { NodeSelection } from '../../plugins/index';

/**
 * `Mention renderer` module is used to render Mention control in BlockEditor.
 *
 * @hidden
 */
export class MentionRenderer {
    protected editor: BlockEditor;
    public isPopupOpen: boolean;
    public nodeSelection: NodeSelection;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
        this.nodeSelection = new NodeSelection(this.editor);
    }

    /**
     * Renders the mention control in BlockEditor.
     *
     * @param {IMentionRenderOptions} args - specifies  the arguments.
     * @returns {Mention} - returns the mention object.
     * @hidden
     */
    public renderMention(args?: IMentionRenderOptions): Mention {
        return new Mention({
            locale: this.editor.locale,
            mentionChar: args.mentionChar,
            dataSource: args.dataSource,
            cssClass: args.cssClass,
            highlight: args.highlight,
            fields: args.fields,
            itemTemplate: args.itemTemplate,
            displayTemplate: args.displayTemplate,
            popupWidth: args.popupWidth,
            popupHeight: args.popupHeight,
            change: args.change,
            filtering: args.filtering,
            beforeOpen: args.beforeOpen,
            select: args.select,
            opened: (e: PopupEventArgs) => {
                this.nodeSelection.storeCurrentRange();
                this.isPopupOpen = true;
                if (args.opened) {
                    args.opened.call(this, e);
                }
            },
            closed: (e: PopupEventArgs) => {
                this.isPopupOpen = this.editor.isPopupOpenedOnAddIconClick = false;
                if (args.beforeClose) {
                    args.beforeClose.call(this, e);
                }
            }
        }, args.element);
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
        const rangePath: RangePath = this.nodeSelection.getStoredBackupRange();
        if ((!rangePath || isUndoRedoAction) ||
            (rangePath && (!rangePath.startContainer || !rangePath.endContainer))) {
            return;
        }
        const { startOffset, endOffset, parentElement }: RangePath = rangePath;
        const blockEl: HTMLElement = this.editor.currentFocusedBlock as HTMLElement;
        const block: BlockModel = getBlockModelById(blockEl.id, this.editor.getEditorBlocks());

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
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            affectedContent.content = text.slice(0, start - 1) + text.slice(endOffset);

            //Remove contentchanged action triggered by typing '/'
            const stack: IUndoRedoState[] = this.editor.undoRedoAction.undoStack;
            if (!isUndoRedoAction) {
                stack.pop();
            }
            this.editor.isProtectedOnChange = prevOnChange;
        }
        this.editor.stateManager.updatePropChangesToModel();
    }

    public destroy(): void {
        this.nodeSelection = null;
    }
}
