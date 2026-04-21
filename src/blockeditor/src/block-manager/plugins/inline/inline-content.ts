import { FieldSettingsModel, MentionChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { IInlineContentInsertionOptions } from '../../../common/interface';
import { ContentType } from '../../../models/enums';
import { BlockModel, ContentModel, LabelItemModel, UserModel } from '../../../models/index';
import { convertInlineElementsToContentModels, decoupleReference, getBlockModelById, getContentModelByNode, getSelectedRange, setCursorPosition } from '../../../common/utils/index';
import * as constants from '../../../common/constant';
import { BlockFactory } from '../../../block-manager/services/block-factory';
import { events } from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';

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
