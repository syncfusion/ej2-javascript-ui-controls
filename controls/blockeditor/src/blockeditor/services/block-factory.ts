import { BlockModel, BlockProperties, BulletListProps, CalloutProps, ChecklistProps, CodeContentProps,
    CodeProps, CollapsibleHeadingProps, CollapsibleProps, ContentModel, DividerProps, HeadingProps, ImageProps, LabelContentProps,
    LinkContentProps, MentionContentProps, NumberedListProps, ParagraphProps, QuoteProps, TextContentProps } from '../models';
import { generateUniqueId, isEmptyString, sanitizeBlock, sanitizeContent } from '../utils/index';
import * as constants from '../base/constant';
import { BlockType, ContentType } from '../base/index';

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
        switch (block.type) {
        case BlockType.Paragraph:
            return this.createParagraphBlock(block, block.props as ParagraphProps);
        case BlockType.Heading:
            return this.createHeadingBlock(block, block.props as HeadingProps);
        case BlockType.Checklist:
            return this.createChecklistBlock(block, block.props as ChecklistProps);
        case BlockType.BulletList:
            return this.createBulletListBlock(block, (block.props as BulletListProps));
        case BlockType.NumberedList:
            return this.createNumberedListBlock(block, (block.props as NumberedListProps));
        case BlockType.Code:
            return this.createCodeBlock(block, block.props as CodeProps);
        case BlockType.Quote:
            return this.createQuoteBlock(block, block.props as QuoteProps);
        case BlockType.Callout:
            return this.createCalloutBlock(block, block.props as CalloutProps);
        case BlockType.Divider:
            return this.createDividerBlock(block, block.props as DividerProps);
        case BlockType.CollapsibleParagraph:
            return this.createCollapsibleParagraphBlock(block, block.props as CollapsibleProps);
        case BlockType.CollapsibleHeading:
            return this.createCollapsibleHeadingBlock(block, block.props as CollapsibleHeadingProps);
        case BlockType.Image:
            return this.createImageBlock(block, block.props as ImageProps);
        case BlockType.Template:
            return this.createTemplateBlock(block, block.props);
        default:
            return null;
        }
    }

    static createContentFromPartial(content: Partial<ContentModel>): ContentModel {
        switch (content.type) {
        case ContentType.Text:
            return this.createTextContent(content, content.props as TextContentProps);
        case ContentType.Link:
            return this.createLinkContent(content, content.props as LinkContentProps);
        case ContentType.Mention:
            return this.createMentionContent(content, content.props as MentionContentProps);
        case ContentType.Label:
            return this.createLabelContent(content, content.props as LabelContentProps);
        case ContentType.Code:
            return this.createCodeContent(content, content.props as CodeContentProps);
        default:
            return null;
        }
    }

    /**
     * Creates a checklist block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block model
     * @param {Partial<ChecklistProps>} innerProps Optional props for the checklist
     * @returns {BlockModel} A new checklist block
     */
    static createChecklistBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ChecklistProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Checklist,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
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
     * @param {Partial<ParagraphProps>} innerProps Optional props for the paragraph
     * @returns {BlockModel} A new paragraph block
     */
    static createParagraphBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ParagraphProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Paragraph,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a heading block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<HeadingProps>} innerProps Optional content for the heading
     * @returns {BlockModel} new heading block
     */
    static createHeadingBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<HeadingProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Heading,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                level: 1,
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates an image block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<ImageProps>} innerProps Optional props for the image
     * @returns {BlockModel} A new image block
     */
    static createImageBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<ImageProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Image,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            content: [],
            props: {
                saveFormat: 'Base64',
                allowedTypes: ['.jpg', '.jpeg', '.png'],
                src: '',
                width: '',
                height: '',
                minWidth: 40,
                maxWidth: '',
                minHeight: 40,
                maxHeight: '',
                cssClass: '',
                readOnly: false,
                ...innerProps
            }
        };
    }

    /**
     * Creates a code block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<CodeProps>} innerProps Optional props for the code
     * @returns {BlockModel} A new code block
     */
    static createCodeBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<CodeProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Code,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                defaultLanguage: 'javascript',
                languages: [],
                ...innerProps
            }
        };
    }

    /**
     * Creates a bullet list block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<BulletListProps>} innerProps Optional props for the bullet list
     * @returns {BlockModel} A new bullet list block
     */
    static createBulletListBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<BulletListProps> = {}
    ): BlockModel {
        return {
            type: BlockType.BulletList,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a numbered list block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<NumberedListProps>} innerProps Optional props for the numbered list
     * @returns {BlockModel} A new bullet list block
     */
    static createNumberedListBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<NumberedListProps> = {}
    ): BlockModel {
        return {
            type: BlockType.NumberedList,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a quote block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<QuoteProps>} innerProps Optional props for the quote
     * @returns {BlockModel} A new quote block
     */
    static createQuoteBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<QuoteProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Quote,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a Collapsible paragraph block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<CollapsibleProps>} innerProps Optional props for the Collapsible paragraph
     * @returns {BlockModel} A new Collapsible paragraph block
     */
    static createCollapsibleParagraphBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<CollapsibleProps> = {}
    ): BlockModel {
        return {
            type: BlockType.CollapsibleParagraph,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                isExpanded: false,
                children: [],
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a collapsible heading block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<CollapsibleHeadingProps>} innerProps Optional props for the collapsible heading
     * @returns {BlockModel} A new collapsible heading block
     */
    static createCollapsibleHeadingBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<CollapsibleHeadingProps> = {}
    ): BlockModel {
        return {
            type: BlockType.CollapsibleHeading,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            props: {
                isExpanded: false,
                level: 1,
                children: [],
                ...this.defaultInnerBlockProps,
                ...innerProps
            }
        };
    }

    /**
     * Creates a callout block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<CalloutProps>} innerProps Optional props for the callout
     * @returns {BlockModel} A new callout block
     */
    static createCalloutBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<CalloutProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Callout,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            content: [],
            props: {
                children: [],
                ...innerProps
            }
        };
    }

    /**
     * Creates a divider block
     *
     * @param {Partial<BlockModel>} rootProps Optional props for the block
     * @param {Partial<DividerProps>} innerProps Optional props for the divider
     * @returns {BlockModel} A new divider block
     */
    static createDividerBlock(
        rootProps: Partial<BlockModel> = {},
        innerProps: Partial<DividerProps> = {}
    ): BlockModel {
        return {
            type: BlockType.Divider,
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            content: [],
            props: {
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
            type: 'Template',
            ...this.defaultRootBlockProps,
            ...sanitizeBlock(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.BLOCK_ID_PREFIX) } : {}),
            content: [],
            props: {
                ...innerProps
            }
        };
    }

    /**
     * Creates a text content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<TextContentProps>} innerProps Optional props for the text content
     * @returns {ContentModel} A new text content
     */
    static createTextContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<TextContentProps> = {}
    ): ContentModel {
        return {
            type: ContentType.Text,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            props: {
                styles: {},
                ...innerProps
            }
        };
    }

    /**
     * Creates a link content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<LinkContentProps>} innerProps Optional props for the link content
     * @returns {ContentModel} A new link content
     */
    static createLinkContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<LinkContentProps> = {}
    ): ContentModel {
        return {
            type: ContentType.Link,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            props: {
                styles: {},
                url: '',
                openInNewWindow: true,
                ...innerProps
            }
        };
    }

    /**
     * Creates a mention content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<MentionContentProps>} innerProps Optional props for the mention content
     * @returns {ContentModel} A new mention content
     */
    static createMentionContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<MentionContentProps> = {}
    ): ContentModel {
        return {
            type: ContentType.Mention,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            props: {
                userId: '',
                ...innerProps
            }
        };
    }

    /**
     * Creates a label content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<LabelContentProps>} innerProps Optional props for the label content
     * @returns {ContentModel} A new label content
     */
    static createLabelContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<LabelContentProps> = {}
    ): ContentModel {
        return {
            type: ContentType.Label,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            props: {
                labelId: '',
                ...innerProps
            }
        };
    }

    /**
     * Creates a code content
     *
     * @param {Partial<ContentModel>} rootProps Optional props for the content
     * @param {Partial<CodeContentProps>} innerProps Optional props for the code content
     * @returns {ContentModel} A new code content
     */
    static createCodeContent(
        rootProps: Partial<ContentModel> = {},
        innerProps: Partial<CodeContentProps> = {}
    ): ContentModel {
        return {
            type: ContentType.Code,
            ...this.defaultRootContentProps,
            ...sanitizeContent(rootProps),
            ...(isEmptyString(rootProps.id) ? { id: generateUniqueId(constants.CONTENT_ID_PREFIX) } : {}),
            props: {
                styles: {},
                ...innerProps
            }
        };
    }
}
