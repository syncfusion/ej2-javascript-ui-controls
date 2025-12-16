import { FieldSettingsModel, MentionChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { IInlineContentInsertionOptions } from '../../../common/interface';
import { ContentType } from '../../../models/enums';
import { BlockModel, ContentModel, LabelItemModel, UserModel } from '../../../models/index';
import { decoupleReference, generateUniqueId, getBlockModelById, getClosestContentElementInDocument, getSelectedRange, sanitizeBlock, sanitizeContent, setCursorPosition } from '../../../common/utils/index';
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
        this.parent.mentionAction.cleanMentionArtifacts(this.parent.currentFocusedBlock);
        const contentType: string = (args.value.toString().indexOf('e-user-mention-item-template')) > 0 ? ContentType.Mention : ContentType.Label;
        const mentionChar: string = contentType === ContentType.Mention ? '@' : this.parent.labelSettings.triggerChar;
        this.parent.mentionAction.removeMentionQueryKeysFromModel(mentionChar);
        const options: IInlineContentInsertionOptions = {
            block: getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks()),
            blockElement: this.parent.currentFocusedBlock,
            range: getSelectedRange().cloneRange(),
            contentType: contentType,
            itemData: args.itemData as FieldSettingsModel
        };
        this.processInsertion(options);
    }

    private processInsertion(options: IInlineContentInsertionOptions): void {
        const { range, contentType, blockElement }: IInlineContentInsertionOptions = options;
        if (!range || !blockElement) { return; }

        const rangeParent: HTMLElement = this.getRangeParent(range);
        const insertedNode: HTMLElement = this.findInsertedNode(contentType, rangeParent);
        this.splitAndReorganizeContent(insertedNode, contentType, rangeParent, options);
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
        return rangeParent.querySelector(`.${contentClassMap[`${contentType}`]}`) as HTMLElement;
    }

    private splitAndReorganizeContent(
        insertedNode: HTMLElement,
        contentType: string | ContentType,
        rangeParent: HTMLElement,
        options: IInlineContentInsertionOptions
    ): void {
        const { block }: IInlineContentInsertionOptions = options;
        const blockContentElement: HTMLElement = rangeParent.closest('.' + constants.CONTENT_CLS) as HTMLElement;
        if (!blockContentElement) { return null; }

        const nodesToProcess: Node[] = Array.from(rangeParent.childNodes);
        const insertionIndex: number = nodesToProcess.indexOf(insertedNode);
        if (insertionIndex === -1) { return null; }

        const affectingContent: ContentModel = block.content.find(
            (content: ContentModel) => content.id === getClosestContentElementInDocument(rangeParent).id
        );
        if (!affectingContent) { return null; }

        const oldBlock: BlockModel = decoupleReference(sanitizeBlock(block));
        const beforeContents: ContentModel[] = this.processContents(
            nodesToProcess.slice(0, insertionIndex), affectingContent
        );
        const insertedContent: ContentModel = this.createInlineContentModel(insertedNode, contentType, options);
        const afterContents: ContentModel[] = this.processContents(
            nodesToProcess.slice(insertionIndex + 1), affectingContent, true
        );

        const affectingIndex: number = block.content.indexOf(affectingContent);
        const newContentModels: ContentModel[] = [...beforeContents, insertedContent, ...afterContents];
        block.content.splice(affectingIndex, 1, ...newContentModels);
        // If inserted at the end, add new empty content for cursor focus
        if (block.content.findIndex((c: ContentModel) => c.id === insertedContent.id) === block.content.length - 1) {
            block.content.push(BlockFactory.createTextContent());
        }
        this.parent.blockService.updateContent(block.id, block.content);
        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: block, oldBlock: oldBlock } ]
        }});
        this.parent.undoRedoAction.trackContentChangedForUndoRedo(oldBlock, decoupleReference(sanitizeBlock(block)));

        const nextSibling: HTMLElement = blockContentElement.querySelector('#' + insertedContent.id).nextElementSibling as HTMLElement;
        if (nextSibling) {
            setCursorPosition(nextSibling, 0);
        }
    }

    private processContents(
        nodes: Node[],
        baseContentModel: ContentModel,
        generateNewIds: boolean = false
    ): ContentModel[] {
        const contentModels: ContentModel[] = [];

        nodes.forEach((node: Node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent !== '') {
                const newContent: ContentModel = decoupleReference(sanitizeContent(baseContentModel));
                newContent.id = generateNewIds ? generateUniqueId(constants.CONTENT_ID_PREFIX) : newContent.id;
                newContent.content = node.textContent;

                contentModels.push(newContent);
            }
        });

        return contentModels;
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

    /**
     * Destroys the inline content module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
    }
}
