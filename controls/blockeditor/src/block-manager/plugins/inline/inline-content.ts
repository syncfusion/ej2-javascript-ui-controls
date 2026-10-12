import { FieldSettingsModel, MentionChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { IInlineContentInsertionOptions } from '../../../common/interface';
import { ContentType } from '../../../models/enums';
import { BlockModel, ContentModel, LabelItemModel, UserModel } from '../../../models/index';
import { convertInlineElementsToContentModels, decoupleReference, getBlockContentElement, getBlockModelById, getContentModelByNode, getSelectedRange, setCursorPosition } from '../../../common/utils/index';
import * as constants from '../../../common/constant';
import { BlockFactory } from '../../../block-manager/services/block-factory';
import { events } from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';
/* Collaboration Start */
import { findTextNodeAtOffset } from '../../../collaboration/y-blockeditor/utils/dom-offset';
import { TextNodePosition } from '../../../collaboration/y-blockeditor/base/interface';
/* Collaboration End */

export class InlineContentInsertionModule {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on('inlineContentInsertion', this.handleInlineContentInsertion, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off('inlineContentInsertion', this.handleInlineContentInsertion);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /* Collaboration Start */
    /**
     * Inserts a Mention or Label inline content at a specific character offset in a block.
     * Used for both local insertion and remote collaborative insertion.
     *
     * @param {string} blockId - ID of the target block
     * @param {number} startOffset - 0-based character offset in the concatenated text content
     * @param {string} contentType - ContentType.Mention or ContentType.Label
     * @param {string} itemId - userId (for Mention) or labelId (for Label)
     * @param {boolean} isRemote - Optional: true if this is from collab sync (avoids duplicate events)
     * @returns {void}
     */
    public insertInlineContentAtOffset(
        blockId: string,
        startOffset: number,
        contentType: ContentType.Mention | ContentType.Label,
        itemId: string,
        isRemote: boolean = false
    ): void {
        const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const contentElement: HTMLElement = getBlockContentElement(this.parent.getBlockElementById(blockId));

        // Step 3: Create the new inline content model
        let insertedContent: ContentModel;
        if (contentType === ContentType.Mention) {
            const user: UserModel = this.parent.users.find((u: UserModel) => u.id === itemId);
            if (!user) { return; }
            insertedContent = BlockFactory.createMentionContent(
                { content: user.user },
                { userId: user.id }
            );
        } else if (contentType === ContentType.Label) {
            const label: LabelItemModel = this.parent.labelSettings.items.find((l: LabelItemModel) => l.id === itemId);
            if (!label) { return; }
            insertedContent = BlockFactory.createLabelContent(
                { content: label.text },
                { labelId: label.id }
            );
        }

        const newInlineNode: Node = this.parent.blockRenderer.contentRenderer.invokeContentRenderer(block, insertedContent);
        const found: TextNodePosition = findTextNodeAtOffset(contentElement, startOffset);
        const childLength: number = contentElement ? contentElement.childNodes.length : 0;
        const isEmpty: boolean = childLength === 0 || (childLength === 1 && contentElement.childNodes[0].textContent === '');
        if (!found && isEmpty) {
            // On a table, if a cell is empty, we need to replace the <br> tag with the new inline content.
            if (contentElement.firstChild && contentElement.firstChild.nodeName === 'BR') {
                contentElement.firstChild.replaceWith(newInlineNode);
            } else {
                contentElement.appendChild(newInlineNode);
            }
        }
        else {
            const range: Range = document.createRange();
            range.setStart(found.node, found.offsetInNode);
            const splitNode: Node = this.parent.nodeCutter.getSpliceNode(range, found.node);
            splitNode.parentElement.insertBefore(newInlineNode, splitNode);
        }

        const newContents: ContentModel[] = convertInlineElementsToContentModels(contentElement, true);
        this.parent.blockService.updateContent(block.id, newContents);
    }
    /* Collaboration End */

    private handleInlineContentInsertion(args: MentionChangeEventArgs): void {
        const contentType: string = (args.value.toString().indexOf('e-user-mention-item-template')) > 0
            ? ContentType.Mention
            : ContentType.Label;
        const options: IInlineContentInsertionOptions = {
            block: getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks()),
            blockElement: this.parent.currentFocusedBlock,
            range: getSelectedRange().cloneRange(),
            contentType: contentType,
            itemData: args.itemData as FieldSettingsModel,
            mentionChar: contentType === ContentType.Mention ? '@' : this.parent.labelSettings.triggerChar
        };

        this.processInsertion(options);
    }

    private processInsertion(options: IInlineContentInsertionOptions): void {
        const { range, contentType, blockElement, mentionChar }: IInlineContentInsertionOptions = options;
        if (!range || !blockElement) { return; }

        const rangeParent: HTMLElement = this.getRangeParent(range);
        const insertedNode: HTMLElement = this.findInsertedNode(contentType, rangeParent);

        // Remove the trigger char from the block model first
        this.parent.mentionAction.removeMentionQueryKeysFromModel(mentionChar);

        // Split the DOM and update model
        this.splitAndReorganizeContent(insertedNode, contentType, rangeParent, options);
    }

    private splitAndReorganizeContent(
        insertedNode: HTMLElement,
        contentType: string | ContentType,
        rangeParent: HTMLElement,
        options: IInlineContentInsertionOptions
    ): void {
        const { block }: IInlineContentInsertionOptions = options;
        const blockContentElement: HTMLElement = rangeParent.closest('.' + constants.CONTENT_CLS) as HTMLElement;
        if (!blockContentElement || !insertedNode) { return null; }

        const oldBlock: BlockModel = decoupleReference(block);
        const isCurrBlkEmpty: boolean = blockContentElement.textContent === '';
        const insertedContent: ContentModel = this.createInlineContentModel(insertedNode, contentType, options);

        // DOM Update
        const newInlineNode: Node = this.parent.blockRenderer.contentRenderer.invokeContentRenderer(block, insertedContent);
        insertedNode.replaceWith(newInlineNode);

        // Normalize empty nodes
        const validNodes: Node[] = [...Array.from(blockContentElement.childNodes)].filter((n: Node) => n.textContent.trim());
        const isAtEnd: boolean = validNodes.indexOf(newInlineNode) === validNodes.length - 1;
        if (!isAtEnd && !isCurrBlkEmpty) { blockContentElement.normalize(); }

        // Model update
        const newContents: ContentModel[] = convertInlineElementsToContentModels(blockContentElement, true);
        this.parent.blockService.updateContent(block.id, newContents);
        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: block, oldBlock: oldBlock } ],
            excludeDomUpdate: true
        }});
        this.parent.undoRedoAction.trackContentChangedForUndoRedo(oldBlock, decoupleReference(block));

        /* Utilize suffix node appended by mention control for cursor, if null-create and append */
        let nextSibling: Node = newInlineNode.nextSibling as Node;
        if (!nextSibling) {
            nextSibling = document.createTextNode('');
            newInlineNode.parentNode.appendChild(nextSibling);
        }
        setCursorPosition(nextSibling as HTMLElement, 0);
    }

    private createInlineContentModel(
        element: HTMLElement,
        contentType: string | ContentType,
        options: IInlineContentInsertionOptions
    ): ContentModel {
        const user: UserModel = options.itemData as UserModel;
        const labelItem: LabelItemModel = options.itemData as LabelItemModel;

        const contentValue: string = contentType === ContentType.Mention ? user.user : element.innerText;
        let newContent: ContentModel;
        if (contentType === ContentType.Mention) {
            newContent = BlockFactory.createMentionContent({ content: contentValue }, { userId: user.id });
        }
        else if (contentType === ContentType.Label) {
            newContent = BlockFactory.createLabelContent({ content: contentValue }, { labelId: labelItem.id });
        }
        return newContent;
    }

    private getRangeParent(range: Range): HTMLElement {
        return range.startContainer.nodeType === Node.TEXT_NODE
            ? range.startContainer.parentElement
            : (range.startContainer as HTMLElement);
    }

    private findInsertedNode(contentType: string | ContentType, rangeParent: HTMLElement): HTMLElement | null {
        const contentClassMap: { [key: string]: string } = {
            [ContentType.Mention]: 'e-mention-chip',
            [ContentType.Label]: 'e-mention-chip'
        };
        return rangeParent.querySelector(`span[class='${contentClassMap[`${contentType}`]}`) as HTMLElement;
    }

    /**
     * Destroys the inline content module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
    }
}
