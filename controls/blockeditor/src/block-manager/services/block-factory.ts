import { BaseChildrenProp, BlockModel, BlockProperties, IBulletListBlockSettings, ICalloutBlockSettings, IChecklistBlockSettings,
    ICodeBlockSettings, ICollapsibleHeadingBlockSettings, ICollapsibleBlockSettings, ContentModel, IDividerBlockSettings,
    IHeadingBlockSettings, IImageBlockSettings, ILabelContentSettings, ILinkContentSettings, IMentionContentSettings,
    INumberedListBlockSettings, IParagraphBlockSettings, IQuoteBlockSettings, TableCellModel,
    TableColumnModel, ITableBlockSettings, TableRowModel, ITextContentSettings } from '../../models/index';
import { generateUniqueId, isChildrenProp, isEmptyString, sanitizeBlock, sanitizeContent, sanitizeHeadingProps } from '../../common/utils/index';
import * as constants from '../../common/constant';
import { BlockType, ContentType } from '../../models/enums';

/**
 * Factory class for creating block models and content
 */
export class BlockFactory {

    private static defaultRootBlockProps: Partial<BlockModel> = {
        parentId: '',
        indent: 0,
        content: [],
        cssClass: '',
        template: ''
    };

    private static defaultInnerBlockProps: Partial<BlockProperties> = {
        placeholder: ''
    }

    private static defaultRootContentProps: Partial<ContentModel> = {
        content: ''
    };

    static createBlockFromPartial(
        block: Partial<BlockModel>
    ): BlockModel {
        switch (block.blockType) {
        case BlockType.Paragraph:
            return this.createParagraphBlock(block, block.properties as IParagraphBlockSettings);
        case BlockType.Heading:
            return this.createHeadingBlock(block, block.properties as IHeadingBlockSettings);
        case BlockType.Checklist:
            return this.createChecklistBlock(block, block.properties as IChecklistBlockSettings);
        case BlockType.BulletList:
            return this.createBulletListBlock(block, (block.properties as IBulletListBlockSettings));
        case BlockType.NumberedList:
            return this.createNumberedListBlock(block, (block.properties as INumberedListBlockSettings));
        case BlockType.Code:
            return this.createCodeBlock(block, block.properties as ICodeBlockSettings);
        case BlockType.Quote:
            return this.createQuoteBlock(block, block.properties as IQuoteBlockSettings);
        case BlockType.Callout:
            return this.createCalloutBlock(block, block.properties as ICalloutBlockSettings);
        case BlockType.Divider:
            return this.createDividerBlock(block, block.properties as IDividerBlockSettings);
        case BlockType.CollapsibleParagraph:
            return this.createCollapsibleParagraphBlock(block, block.properties as ICollapsibleBlockSettings);
        case BlockType.CollapsibleHeading:
            return this.createCollapsibleHeadingBlock(block, block.properties as ICollapsibleHeadingBlockSettings);
        case BlockType.Image:
            return this.createImageBlock(block, block.properties as IImageBlockSettings);
        case BlockType.Table:
            return this.createTableBlock(block, block.properties as ITableBlockSettings);
        case BlockType.Template:
            return this.createTemplateBlock(block, block.properties);
        default:
            return null;
        }
    }

    static createContentFromPartial(content: Partial<ContentModel>): ContentModel {
        switch (content.contentType) {
        case ContentType.Text:
            return this.createTextContent(content, content.properties as ITextContentSettings);
        case ContentType.Link:
            return this.createLinkContent(content, content.properties as ILinkContentSettings);
        case ContentType.Mention:
            return this.createMentionContent(content, content.properties as IMentionContentSettings);
        case ContentType.Label:
            return this.createLabelContent(content, content.properties as ILabelContentSettings);
        default:
            return null;
        }
    }

    /**
     * Creates a checklist block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block model
     * @param {Partial<IChecklistBlockSettings>} innerProps Optional props for the checklist
     * @returns {BlockModel} A new checklist block
     */
    static createChecklistBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<IChecklistBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.Checklist,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                isChecked: false,
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a paragraph block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block model
     * @param {Partial<IParagraphBlockSettings>} innerProps Optional props for the paragraph
     * @returns {BlockModel} A new paragraph block
     */
    static createParagraphBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<IParagraphBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.Paragraph,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a heading block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<IHeadingBlockSettings>} innerProps Optional content for the heading
     * @returns {BlockModel} new heading block
     */
    static createHeadingBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<IHeadingBlockSettings> = {}
    ): BlockModel {
        const sanitizedInnerProps: Partial<IHeadingBlockSettings> = sanitizeHeadingProps(innerProps);
        return {
            blockType: BlockType.Heading,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                level: 1,
                ...this.defaultInnerBlockProps,
                ...sanitizedInnerProps
            }
        };
    }

    /**
     * Creates an image block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<IImageBlockSettings>} innerProps Optional props for the image
     * @returns {BlockModel} A new image block
     */
    static createImageBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<IImageBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.Image,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            content: [],
            properties: {
                src: '',
                altText: '',
                width: '',
                height: '',
                ...innerProps
            }
        };
    }

    /**
     * Creates a code block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<ICodeBlockSettings>} innerProps Optional props for the code
     * @returns {BlockModel} A new code block
     */
    static createCodeBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ICodeBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.Code,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                language: 'javascript',
                ...innerProps
            }
        };
    }

    /**
     * Creates a bullet list block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<IBulletListBlockSettings>} innerProps Optional props for the bullet list
     * @returns {BlockModel} A new bullet list block
     */
    static createBulletListBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<IBulletListBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.BulletList,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a numbered list block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<INumberedListBlockSettings>} innerProps Optional props for the numbered list
     * @returns {BlockModel} A new bullet list block
     */
    static createNumberedListBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<INumberedListBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.NumberedList,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a quote block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<IQuoteBlockSettings>} innerProps Optional props for the quote
     * @returns {BlockModel} A new quote block
     */
    static createQuoteBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<IQuoteBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.Quote,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a Collapsible paragraph block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<ICollapsibleBlockSettings>} innerProps Optional props for the Collapsible paragraph
     * @returns {BlockModel} A new Collapsible paragraph block
     */
    static createCollapsibleParagraphBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ICollapsibleBlockSettings> = {}
    ): BlockModel {
        const blockId: string = isEmptyString(rootProps.id) ? generateUniqueId(constants.BLOCK_ID_PREFIX) : rootProps.id;
        return {
            blockType: BlockType.CollapsibleParagraph,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            id: blockId,
            properties: {
                isExpanded: false,
                children: [
                    BlockFactory.createParagraphBlock({
                        parentId: blockId,
                        content: [BlockFactory.createTextContent()]
                    })
                ],
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a collapsible heading block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<ICollapsibleHeadingBlockSettings>} innerProps Optional props for the collapsible heading
     * @returns {BlockModel} A new collapsible heading block
     */
    static createCollapsibleHeadingBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ICollapsibleHeadingBlockSettings> = {}
    ): BlockModel {
        const sanitizedInnerProps: Partial<ICollapsibleHeadingBlockSettings> = sanitizeHeadingProps(innerProps);
        const blockId: string = isEmptyString(rootProps.id) ? generateUniqueId(constants.BLOCK_ID_PREFIX) : rootProps.id;
        return {
            blockType: BlockType.CollapsibleHeading,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            id: blockId,
            properties: {
                isExpanded: false,
                level: 1,
                children: [
                    BlockFactory.createParagraphBlock({
                        parentId: blockId,
                        content: [BlockFactory.createTextContent()]
                    })
                ],
                ...this.defaultInnerBlockProps,
                ...sanitizedInnerProps
            }
        };
    }

    /**
     * Creates a callout block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<ICalloutBlockSettings>} innerProps Optional props for the callout
     * @returns {BlockModel} A new callout block
     */
    static createCalloutBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ICalloutBlockSettings> = {}
    ): BlockModel {
        const blockId: string = isEmptyString(rootProps.id) ? generateUniqueId(constants.BLOCK_ID_PREFIX) : rootProps.id;
        return {
            blockType: BlockType.Callout,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            id: blockId,
            content: [],
            properties: {
                children: [
                    BlockFactory.createParagraphBlock({
                        parentId: blockId,
                        content: [BlockFactory.createTextContent()]
                    })
                ],
                ...innerProps
            }
        };
    }

    /**
     * Creates a divider block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<IDividerBlockSettings>} innerProps Optional props for the divider
     * @returns {BlockModel} A new divider block
     */
    static createDividerBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<IDividerBlockSettings> = {}
    ): BlockModel {
        return {
            blockType: BlockType.Divider,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            content: [],
            properties: {
                ...innerProps
            }
        };
    }

    /**
     * Creates a template block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block model
     * @param {any} innerProps Optional props for the template
     * @returns {BlockModel} A new template block
     */
    static createTemplateBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: any = {}
    ): BlockModel {
        return {
            blockType: 'Template',
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            content: [],
            properties: {
                ...innerProps
            }
        };
    }

    /**
     * Creates an table block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<ITableBlockSettings>} innerProps Optional props for the image
     * @returns {BlockModel} A new image block
     */
    static createTableBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ITableBlockSettings> = {}
    ): BlockModel {
        // ParentIds for inner blocks will be assigned by the caller/state manager as needed
        const tableBlock: BlockModel = {
            blockType: BlockType.Table,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            properties: {
                width: '100%',
                cssClass: '',
                enableHeader: true,
                enableRowNumbers: true,
                readOnly: false,
                ...this.getDefaultRowsAndColumns(),
                ...innerProps
            }
        };
        (tableBlock.properties as ITableBlockSettings).columns.forEach((column: TableColumnModel, idx: number) => {
            if (!column.id) { column.id = generateUniqueId('col_'); }
            if (!column.type) { column.type = 'Text'; }
            if (!column.headerText) { column.headerText = `Column ${idx + 1}`; }
        });

        (tableBlock.properties as ITableBlockSettings).rows.forEach((r: TableRowModel) => {
            if (!r.id) { r.id = generateUniqueId('row_'); }
            r.cells.forEach((cell: TableCellModel, idx: number) => {
                if (!cell.id) { cell.id = generateUniqueId('cell_'); }
                if (!cell.columnId) { cell.columnId = (tableBlock.properties as ITableBlockSettings).columns[idx as number].id; }
                cell.blocks = this.populateBlockProperties(cell.blocks, cell.id);
            });
        });

        return tableBlock;
    }

    static getDefaultRowsAndColumns(): { rows: TableRowModel[], columns: TableColumnModel[] } {
        // Defaults for new table structure: 2 columns, 2 rows (data), header enabled
        const col1Id: string = generateUniqueId('col_');
        const col2Id: string = generateUniqueId('col_');
        const row1Id: string = generateUniqueId('row_');
        const row2Id: string = generateUniqueId('row_');
        const cell11Id: string = generateUniqueId('cell_');
        const cell12Id: string = generateUniqueId('cell_');
        const cell21Id: string = generateUniqueId('cell_');
        const cell22Id: string = generateUniqueId('cell_');
        return {
            columns: [
                { id: col1Id, type: 'Text', headerText: 'Column 1' },
                { id: col2Id, type: 'Text', headerText: 'Column 2' }
            ],
            rows: [
                {
                    id: row1Id,
                    cells: [
                        { id: cell11Id, columnId: col1Id, blocks: [this.createParagraphBlock({ content: [this.createTextContent()] })] },
                        { id: cell12Id, columnId: col2Id, blocks: [this.createParagraphBlock({ content: [this.createTextContent()] })] }
                    ]
                },
                {
                    id: row2Id,
                    cells: [
                        { id: cell21Id, columnId: col1Id, blocks: [this.createParagraphBlock({ content: [this.createTextContent()] })] },
                        { id: cell22Id, columnId: col2Id, blocks: [this.createParagraphBlock({ content: [this.createTextContent()] })] }
                    ]
                }
            ]
        };
    }

    /**
     * Populates blocks with missing properties if they don't have them
     *
     * @param {BlockModel[]} blocks Array of block models
     * @param {string} parentId The id of the parent block
     * @returns {BlockModel[]} Updated array of block models
     */
    static populateBlockProperties(blocks: BlockModel[], parentId?: string): BlockModel[] {
        const populatedBlocks: BlockModel[] = blocks.map((block: BlockModel) => {
            if (parentId) { block.parentId = parentId; }

            const updatedBlock: BlockModel = BlockFactory.createBlockFromPartial(block);

            if (updatedBlock.content && updatedBlock.content.length > 0) {
                updatedBlock.content = updatedBlock.content.map((originalContent: ContentModel) => {
                    return BlockFactory.createContentFromPartial(originalContent);
                });
            }

            const props: BaseChildrenProp = updatedBlock.properties as BaseChildrenProp;
            if ((isChildrenProp(updatedBlock)) && props.children.length > 0) {
                props.children = this.populateBlockProperties(props.children, block.id);
            }

            return updatedBlock;
        });

        return populatedBlocks;
    }

    /**
     * Creates a text content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<ITextContentSettings>} innerProps Optional props for the text content
     * @returns {ContentModel} A new text content
     */
    static createTextContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<ITextContentSettings> = {}
    ): ContentModel {
        return {
            contentType: ContentType.Text,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            properties: {
                styles: {},
                ...innerProps
            }
        };
    }

    /**
     * Creates a link content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<ILinkContentSettings>} innerProps Optional props for the link content
     * @returns {ContentModel} A new link content
     */
    static createLinkContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<ILinkContentSettings> = {}
    ): ContentModel {
        return {
            contentType: ContentType.Link,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            properties: {
                styles: {},
                url: '',
                ...innerProps
            }
        };
    }

    /**
     * Creates a mention content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<IMentionContentSettings>} innerProps Optional props for the mention content
     * @returns {ContentModel} A new mention content
     */
    static createMentionContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<IMentionContentSettings> = {}
    ): ContentModel {
        return {
            contentType: ContentType.Mention,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            properties: {
                userId: '',
                ...innerProps
            }
        };
    }

    /**
     * Creates a label content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<ILabelContentSettings>} innerProps Optional props for the label content
     * @returns {ContentModel} A new label content
     */
    static createLabelContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<ILabelContentSettings> = {}
    ): ContentModel {
        return {
            contentType: ContentType.Label,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            properties: {
                labelId: '',
                ...innerProps
            }
        };
    }
}
