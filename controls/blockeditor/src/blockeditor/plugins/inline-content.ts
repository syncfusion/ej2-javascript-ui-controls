import { attributes, detach } from '@syncfusion/ej2-base';
import { BlockEditor, ContentType, IInlineContentInsertionOptions, IMentionRenderOptions } from '../base/index';
import { BlockModel, ContentModel, LabelItemModel, UserModel } from '../models/index';
import { isolateModel, generateUniqueId, getAccessibleTextColor, getAutoAvatarColor, getBlockModelById, getLabelMentionDisplayTemplate, getLabelMenuItems, getSelectedRange, getUserInitials, getUserMentionDisplayTemplate, removeEmptyTextNodes, sanitizeContent, sanitizeLabelItems, setCursorPosition } from '../utils/index';
import { Mention, MentionChangeEventArgs, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import * as constants from '../base/constant';
import { BlockFactory } from '../services/block-factory';
import { events } from '../base/constant';

export class InlineContentInsertionModule {
    private editor: BlockEditor;
    public userMenuObj: Mention;
    public labelMenuObj: Mention;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Initializes the user mention module.
     *
     * @returns {void}
     * @hidden
     */
    public initializeUserMention(): void {
        const mentionDataSource: UserModel[] = this.editor.users.map((user: UserModel) => ({
            id: user.id,
            user: user.user.trim(),
            avatarUrl: user.avatarUrl,
            avatarBgColor: user.avatarBgColor || getAutoAvatarColor(user.id),
            initials: getUserInitials(user.user)
        }));

        const mentionArgs: IMentionRenderOptions = {
            element: this.editor.blockWrapper,
            itemTemplate: '<div class="e-user-mention-item-template"><div class="em-avatar" style="background-color: ${avatarBgColor};">${if(avatarUrl)} <img src="${avatarUrl}" alt="${user}" class="em-img" /> ${else} <div class="em-initial">${initials}</div> ${/if} </div><div class="em-content"><div class="em-text">${user}</div></div></div>',
            displayTemplate: getUserMentionDisplayTemplate(),
            dataSource: mentionDataSource,
            popupWidth: '200px',
            cssClass: 'e-blockeditor-user-menu e-blockeditor-mention-menu',
            fields: { text: 'user', value: 'id' },
            change: this.handleInlineContentInsertion.bind(this),
            beforeOpen: (args: PopupEventArgs) => {
                args.cancel = this.editor.users.length === 0;
            }
        };
        this.userMenuObj = this.editor.mentionRenderer.renderMention(mentionArgs);
    }

    /**
     * Initializes the label mention module.
     *
     * @returns {void}
     * @hidden
     */
    public initializeLabelContent(): void {
        let items: LabelItemModel[];
        if (this.editor.labelSettings.labelItems.length > 0) {
            items = sanitizeLabelItems(this.editor.labelSettings.labelItems);
        }
        else {
            items = getLabelMenuItems();
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.labelSettings.labelItems = items;
            this.editor.isProtectedOnChange = prevOnChange;
        }

        const mentionArgs: IMentionRenderOptions = {
            element: this.editor.blockWrapper,
            mentionChar: this.editor.labelSettings.triggerChar,
            itemTemplate: '<div class="e-label-mention-item-template"><div class="em-avatar" style="background-color: ${labelColor};"> </div><div class="em-content"><span class="em-icon ${iconCss}"></span><div class="em-text">${text}</div></div></div>',
            displayTemplate: getLabelMentionDisplayTemplate(),
            dataSource: items,
            popupWidth: '200px',
            cssClass: 'e-blockeditor-label-menu e-blockeditor-mention-menu',
            fields: { text: 'text', value: 'id', groupBy: 'groupHeader', iconCss: 'iconCss' },
            change: this.handleInlineContentInsertion.bind(this)
        };
        this.labelMenuObj = this.editor.mentionRenderer.renderMention(mentionArgs);
    }

    private handleInlineContentInsertion(args: MentionChangeEventArgs): void {
        args.e.preventDefault();
        args.e.stopPropagation();
        this.editor.mentionRenderer.cleanMentionArtifacts(this.editor.currentFocusedBlock);
        const contentType: string = (args.value.toString().indexOf('e-user-mention-item-template')) > 0 ? ContentType.Mention : ContentType.Label;
        const mentionChar: string = contentType === ContentType.Mention ? '@' : this.editor.labelSettings.triggerChar;
        this.editor.mentionRenderer.removeMentionQueryKeysFromModel(mentionChar);
        const options: IInlineContentInsertionOptions = {
            block: getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks()),
            blockElement: this.editor.currentFocusedBlock,
            range: getSelectedRange().cloneRange(),
            contentType: contentType,
            itemData: args.itemData
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

        const affectingContent: ContentModel = block.content.find((content: ContentModel) => content.id === rangeParent.id);
        if (!affectingContent) { return null; }

        const beforeContents: ContentModel[] = this.processContents(
            nodesToProcess.slice(0, insertionIndex), affectingContent
        );
        const insertedContent: ContentModel = this.createInlineContentModel(insertedNode, contentType, options);
        const afterContents: ContentModel[] = this.processContents(
            nodesToProcess.slice(insertionIndex + 1), affectingContent, true
        );

        const affectingIndex: number = block.content.indexOf(affectingContent);
        const newContentModels: ContentModel[] = [...beforeContents, insertedContent, ...afterContents];
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        block.content.splice(affectingIndex, 1, ...newContentModels);

        this.editor.blockService.updateContent(block.id, block.content);

        this.editor.isProtectedOnChange = prevOnChange;
        this.editor.stateManager.updatePropChangesToModel();

        this.editor.blockRendererManager.reRenderBlockContent(block);

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
                const newContent: ContentModel = isolateModel(sanitizeContent(baseContentModel));
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
        if (this.userMenuObj) {
            this.userMenuObj.destroy();
        }
        if (this.labelMenuObj) {
            this.labelMenuObj.destroy();
        }
        this.removeEventListeners();
        this.editor = null;
        this.userMenuObj = null;
        this.labelMenuObj = null;
    }
}
