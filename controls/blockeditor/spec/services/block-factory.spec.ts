import { BlockFactory } from '../../src/blockeditor/services/block-factory';
import { BlockType, ContentType, SaveFormat } from '../../src/blockeditor/base/enums';
import {
    BaseStylesProp,
    BlockModel,
    BulletListProps,
    CalloutProps,
    ChecklistProps,
    CodeLanguageModel,
    CodeProps,
    CollapsibleHeadingProps,
    CollapsibleProps,
    HeadingProps,
    ImageProps,
    LabelContentProps,
    LinkContentProps,
    MentionContentProps,
    NumberedListProps,
    ParagraphProps,
    QuoteProps,
    TextContentProps
} from '../../src/blockeditor/models/index';
import * as constants from '../../src/blockeditor/base/constant';

describe('BlockFactory', () => {

    describe('createBlockFromPartial method', () => {
        it('should create a paragraph block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Paragraph
            });

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Paragraph);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.indent).toBe(0);
            expect(block.parentId).toBe('');
            expect(block.cssClass).toBe('');
            expect(block.props).toBeDefined();
        });

        it('should create a paragraph block with custom values', () => {
            const block = BlockFactory.createBlockFromPartial({
                id: 'custom-id',
                type: BlockType.Paragraph,
                indent: 2,
                cssClass: 'custom-class',
                content: [{ id: 'content-id', type: ContentType.Text, content: 'Sample content' }],
                props: { placeholder: 'Type something...' }
            });

            expect(block.id).toBe('custom-id');
            expect(block.type).toBe(BlockType.Paragraph);
            expect(block.indent).toBe(2);
            expect(block.cssClass).toBe('custom-class');
            expect(block.content.length).toBe(1);
            expect(block.content[0].content).toBe('Sample content');
            expect((block.props as ParagraphProps).placeholder).toBe('Type something...');
        });

        it('should create a heading block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Heading
            });

            expect(block.type).toBe(BlockType.Heading);
            expect((block.props as HeadingProps).level).toBe(1);
        });

        it('should create a heading block with custom level', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Heading,
                props: { level: 3 }
            });

            expect(block.type).toBe(BlockType.Heading);
            expect((block.props as HeadingProps).level).toBe(3);
        });

        it('should create a checklist block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Checklist
            });

            expect(block.type).toBe(BlockType.Checklist);
            expect((block.props as ChecklistProps).isChecked).toBe(false);
        });

        it('should create a checklist block with custom checked state', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Checklist,
                props: { isChecked: true, placeholder: 'Check me' }
            });

            expect(block.type).toBe(BlockType.Checklist);
            expect((block.props as ChecklistProps).isChecked).toBe(true);
            expect((block.props as ChecklistProps).placeholder).toBe('Check me');
        });

        it('should create a bullet list block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.BulletList
            });

            expect(block.type).toBe(BlockType.BulletList);
            expect((block.props as BulletListProps).placeholder).toBe('');
        });

        it('should create a bullet list block with custom placeholder', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.BulletList,
                props: { placeholder: 'List item' }
            });

            expect(block.type).toBe(BlockType.BulletList);
            expect((block.props as BulletListProps).placeholder).toBe('List item');
        });

        it('should create a numbered list block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.NumberedList
            });

            expect(block.type).toBe(BlockType.NumberedList);
            expect((block.props as NumberedListProps).placeholder).toBe('');
        });

        it('should create a numbered list block with custom placeholder', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.NumberedList,
                props: { placeholder: 'Numbered item' }
            });

            expect(block.type).toBe(BlockType.NumberedList);
            expect((block.props as NumberedListProps).placeholder).toBe('Numbered item');
        });

        it('should create a code block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Code
            });

            expect(block.type).toBe(BlockType.Code);
            expect((block.props as CodeProps).defaultLanguage).toBe('javascript');
            expect((block.props as CodeProps).languages).toEqual([]);
        });

        it('should create a code block with custom language settings', () => {
            const languages: CodeLanguageModel[] = [
                { language: 'javascript', label: 'JavaScript' },
                { language: 'python', label: 'Python' }
            ];

            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Code,
                props: {
                    defaultLanguage: 'python',
                    languages: languages
                }
            });

            expect(block.type).toBe(BlockType.Code);
            expect((block.props as CodeProps).defaultLanguage).toBe('python');
            expect((block.props as CodeProps).languages).toEqual(languages);
            expect((block.props as CodeProps).languages.length).toBe(2);
        });

        it('should create a quote block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Quote
            });

            expect(block.type).toBe(BlockType.Quote);
            expect((block.props as QuoteProps).placeholder).toBe('');
        });

        it('should create a quote block with custom placeholder', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Quote,
                props: { placeholder: 'Quote text' }
            });

            expect(block.type).toBe(BlockType.Quote);
            expect((block.props as QuoteProps).placeholder).toBe('Quote text');
        });

        it('should create a callout block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Callout
            });

            expect(block.type).toBe(BlockType.Callout);
            expect((block.props as CalloutProps).children).toEqual([]);
        });

        it('should create a callout block with child blocks', () => {
            const childBlock: BlockModel = {
                id: 'child-block',
                type: BlockType.Paragraph,
                content: [{ id: 'child-content', type: ContentType.Text, content: 'Child content' }],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createBlockFromPartial({
                id: 'parent-id',
                type: BlockType.Callout,
                props: {
                    children: [childBlock]
                }
            });

            expect(block.type).toBe(BlockType.Callout);
            expect((block.props as CalloutProps).children.length).toBe(1);
            expect((block.props as CalloutProps).children[0].id).toBe('child-block');
            expect((block.props as CalloutProps).children[0].parentId).toBe('parent-id');
        });

        it('should create a divider block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Divider
            });

            expect(block.type).toBe(BlockType.Divider);
            expect(block.props).toEqual({});
        });

        it('should create a collapsible paragraph block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.CollapsibleParagraph
            });

            expect(block.type).toBe(BlockType.CollapsibleParagraph);
            expect((block.props as CollapsibleProps).isExpanded).toBe(false);
            expect((block.props as CollapsibleProps).children).toEqual([]);
            expect((block.props as CollapsibleProps).placeholder).toBe('');
        });

        it('should create a collapsible paragraph block with custom values', () => {
            const childBlock: BlockModel = {
                id: 'child-block',
                type: BlockType.Paragraph,
                content: [{ id: 'child-content', type: ContentType.Text, content: 'Child content' }],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createBlockFromPartial({
                id: 'parent-id',
                type: BlockType.CollapsibleParagraph,
                props: {
                    isExpanded: true,
                    placeholder: 'Collapsible content',
                    children: [childBlock]
                }
            });

            expect(block.type).toBe(BlockType.CollapsibleParagraph);
            expect((block.props as CollapsibleProps).isExpanded).toBe(true);
            expect((block.props as CollapsibleProps).placeholder).toBe('Collapsible content');
            expect((block.props as CollapsibleProps).children.length).toBe(1);
            expect((block.props as CollapsibleProps).children[0].id).toBe('child-block');
        });

        it('should create a collapsible heading block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.CollapsibleHeading
            });

            expect(block.type).toBe(BlockType.CollapsibleHeading);
            expect((block.props as CollapsibleHeadingProps).isExpanded).toBe(false);
            expect((block.props as CollapsibleHeadingProps).level).toBe(1);
            expect((block.props as CollapsibleHeadingProps).children).toEqual([]);
        });

        it('should create a collapsible heading block with custom values', () => {
            const childBlock: BlockModel = {
                id: 'child-block',
                type: BlockType.Paragraph,
                content: [{ id: 'child-content', type: ContentType.Text, content: 'Child content' }],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createBlockFromPartial({
                id: 'parent-id',
                type: BlockType.CollapsibleHeading,
                props: {
                    isExpanded: true,
                    level: 2,
                    placeholder: 'Collapsible heading',
                    children: [childBlock]
                }
            });

            expect(block.type).toBe(BlockType.CollapsibleHeading);
            expect((block.props as CollapsibleHeadingProps).isExpanded).toBe(true);
            expect((block.props as CollapsibleHeadingProps).level).toBe(2);
            expect((block.props as CollapsibleHeadingProps).placeholder).toBe('Collapsible heading');
            expect((block.props as CollapsibleHeadingProps).children.length).toBe(1);
        });

        it('should create an image block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Image
            });

            expect(block.type).toBe(BlockType.Image);
            expect((block.props as ImageProps).src).toBe('');
            expect((block.props as ImageProps).saveFormat).toBe('Base64');
            expect((block.props as ImageProps).allowedTypes).toEqual(['.jpg', '.jpeg', '.png']);
            expect((block.props as ImageProps).minWidth).toBe(40);
            expect((block.props as ImageProps).minHeight).toBe(40);
            expect((block.props as ImageProps).readOnly).toBe(false);
        });

        it('should create an image block with custom values', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Image,
                props: {
                    src: 'image.png',
                    saveFormat: 'Blob' as SaveFormat,
                    allowedTypes: ['.png', '.gif'],
                    width: '200px',
                    height: '100px',
                    minWidth: 50,
                    maxWidth: 500,
                    minHeight: 50,
                    maxHeight: 300,
                    altText: 'Sample image',
                    cssClass: 'img-custom',
                    readOnly: true
                }
            });

            expect(block.type).toBe(BlockType.Image);
            expect((block.props as ImageProps).src).toBe('image.png');
            expect((block.props as ImageProps).saveFormat).toBe('Blob');
            expect((block.props as ImageProps).allowedTypes).toEqual(['.png', '.gif']);
            expect((block.props as ImageProps).width).toBe('200px');
            expect((block.props as ImageProps).height).toBe('100px');
            expect((block.props as ImageProps).minWidth).toBe(50);
            expect((block.props as ImageProps).maxWidth).toBe(500);
            expect((block.props as ImageProps).minHeight).toBe(50);
            expect((block.props as ImageProps).maxHeight).toBe(300);
            expect((block.props as ImageProps).altText).toBe('Sample image');
            expect((block.props as ImageProps).cssClass).toBe('img-custom');
            expect((block.props as ImageProps).readOnly).toBe(true);
        });

        it('should create a template block with custom properties', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: BlockType.Template
            });

            expect(block.type).toBe('Template');
        });

        it('should return null for unknown block type', () => {
            const block = BlockFactory.createBlockFromPartial({
                type: 'UnknownType' as BlockType
            });

            expect(block).toBeNull();
        });
    });

    describe('createContentFromPartial method', () => {
        it('should create text content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Text
            });

            expect(content.type).toBe(ContentType.Text);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.props as TextContentProps).styles).toEqual({});
        });

        it('should create text content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                id: 'custom-content-id',
                type: ContentType.Text,
                content: 'Sample text',
                props: {
                    styles: {
                        bold: true,
                        italic: true,
                        color: '#FF0000'
                    }
                }
            });

            expect(content.id).toBe('custom-content-id');
            expect(content.type).toBe(ContentType.Text);
            expect(content.content).toBe('Sample text');
            expect((content.props as TextContentProps).styles.bold).toBe(true);
            expect((content.props as TextContentProps).styles.italic).toBe(true);
            expect((content.props as TextContentProps).styles.color).toBe('#FF0000');
        });

        it('should create link content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Link
            });

            expect(content.type).toBe(ContentType.Link);
            expect((content.props as LinkContentProps).url).toBe('');
            expect((content.props as LinkContentProps).openInNewWindow).toBe(true);
            expect((content.props as LinkContentProps).styles).toEqual({});
        });

        it('should create link content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Link,
                content: 'Link text',
                props: {
                    url: 'https://example.com',
                    openInNewWindow: false,
                    styles: { underline: true }
                }
            });

            expect(content.type).toBe(ContentType.Link);
            expect(content.content).toBe('Link text');
            expect((content.props as LinkContentProps).url).toBe('https://example.com');
            expect((content.props as LinkContentProps).openInNewWindow).toBe(false);
            expect((content.props as LinkContentProps).styles.underline).toBe(true);
        });

        it('should create mention content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Mention
            });

            expect(content.type).toBe(ContentType.Mention);
            expect((content.props as MentionContentProps).userId).toBe('');
        });

        it('should create mention content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Mention,
                content: '@username',
                props: {
                    userId: 'user123'
                }
            });

            expect(content.type).toBe(ContentType.Mention);
            expect(content.content).toBe('@username');
            expect((content.props as MentionContentProps).userId).toBe('user123');
        });

        it('should create label content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Label
            });

            expect(content.type).toBe(ContentType.Label);
            expect((content.props as LabelContentProps).labelId).toBe('');
        });

        it('should create label content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Label,
                content: 'Label text',
                props: {
                    labelId: 'label123'
                }
            });

            expect(content.type).toBe(ContentType.Label);
            expect(content.content).toBe('Label text');
            expect((content.props as LabelContentProps).labelId).toBe('label123');
        });

        it('should create code content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Code
            });

            expect(content.type).toBe(ContentType.Code);
            expect((content.props as BaseStylesProp).styles).toEqual({});
        });

        it('should create code content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                type: ContentType.Code,
                content: 'let x = 10;',
                props: {
                    styles: {
                        color: '#0000FF'
                    }
                }
            });

            expect(content.type).toBe(ContentType.Code);
            expect(content.content).toBe('let x = 10;');
            expect((content.props as BaseStylesProp).styles.color).toBe('#0000FF');
        });
        it('should return null for unknown content type', () => {
            const content = BlockFactory.createContentFromPartial({
                type: 'UnknownType' as ContentType
            });

            expect(content).toBeNull();
        });
    });

    describe('Individual creation methods', () => {
        it('should create a paragraph block using createParagraphBlock', () => {
            const block = BlockFactory.createParagraphBlock({
                id: 'para-id',
                cssClass: 'custom-para'
            }, {
                placeholder: 'Type here...'
            });

            expect(block.id).toBe('para-id');
            expect(block.type).toBe(BlockType.Paragraph);
            expect(block.cssClass).toBe('custom-para');
            expect((block.props as ParagraphProps).placeholder).toBe('Type here...');
        });

        it('should create a heading block using createHeadingBlock', () => {
            const block = BlockFactory.createHeadingBlock({
                cssClass: 'heading-style'
            }, {
                level: 2,
                placeholder: 'Heading'
            });

            expect(block.type).toBe(BlockType.Heading);
            expect(block.cssClass).toBe('heading-style');
            expect((block.props as HeadingProps).level).toBe(2);
            expect((block.props as HeadingProps).placeholder).toBe('Heading');
        });

        it('should create a checklist block using createChecklistBlock', () => {
            const block = BlockFactory.createChecklistBlock({
                indent: 1
            }, {
                isChecked: true
            });

            expect(block.type).toBe(BlockType.Checklist);
            expect(block.indent).toBe(1);
            expect((block.props as ChecklistProps).isChecked).toBe(true);
        });

        it('should create a bullet list block using createBulletListBlock', () => {
            const block = BlockFactory.createBulletListBlock({
                indent: 1
            }, {
                placeholder: 'Bullet item'
            });

            expect(block.type).toBe(BlockType.BulletList);
            expect(block.indent).toBe(1);
            expect((block.props as BulletListProps).placeholder).toBe('Bullet item');
        });

        it('should create a numbered list block using createNumberedListBlock', () => {
            const block = BlockFactory.createNumberedListBlock({
                indent: 1
            }, {
                placeholder: 'Numbered item'
            });

            expect(block.type).toBe(BlockType.NumberedList);
            expect(block.indent).toBe(1);
            expect((block.props as NumberedListProps).placeholder).toBe('Numbered item');
        });

        it('should create a quote block using createQuoteBlock', () => {
            const block = BlockFactory.createQuoteBlock({
                cssClass: 'quote-style'
            }, {
                placeholder: 'Quote text'
            });

            expect(block.type).toBe(BlockType.Quote);
            expect(block.cssClass).toBe('quote-style');
            expect((block.props as QuoteProps).placeholder).toBe('Quote text');
        });

        it('should create a code block using createCodeBlock', () => {
            const languages: CodeLanguageModel[] = [
                { language: 'javascript', label: 'JavaScript' },
                { language: 'python', label: 'Python' }
            ];

            const block = BlockFactory.createCodeBlock({
                cssClass: 'code-block'
            }, {
                defaultLanguage: 'python',
                languages: languages
            });

            expect(block.type).toBe(BlockType.Code);
            expect(block.cssClass).toBe('code-block');
            expect((block.props as CodeProps).defaultLanguage).toBe('python');
            expect((block.props as CodeProps).languages).toEqual(languages);
        });

        it('should create a divider block using createDividerBlock', () => {
            const block = BlockFactory.createDividerBlock({
                cssClass: 'divider-style'
            });

            expect(block.type).toBe(BlockType.Divider);
            expect(block.cssClass).toBe('divider-style');
        });

        it('should create a collapsible paragraph block using createCollapsibleParagraphBlock', () => {
            const childBlock: BlockModel = {
                id: 'child-id',
                type: BlockType.Paragraph,
                content: [],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createCollapsibleParagraphBlock({
                id: 'parent-id'
            }, {
                isExpanded: true,
                children: [childBlock]
            });

            expect(block.type).toBe(BlockType.CollapsibleParagraph);
            expect(block.id).toBe('parent-id');
            expect((block.props as CollapsibleProps).isExpanded).toBe(true);
            expect((block.props as CollapsibleProps).children.length).toBe(1);
            expect((block.props as CollapsibleProps).children[0].id).toBe('child-id');
        });

        it('should create a collapsible heading block using createCollapsibleHeadingBlock', () => {
            const childBlock: BlockModel = {
                id: 'child-id',
                type: BlockType.Paragraph,
                content: [],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createCollapsibleHeadingBlock({
                id: 'parent-id'
            }, {
                isExpanded: true,
                level: 3,
                children: [childBlock]
            });

            expect(block.type).toBe(BlockType.CollapsibleHeading);
            expect(block.id).toBe('parent-id');
            expect((block.props as CollapsibleHeadingProps).isExpanded).toBe(true);
            expect((block.props as CollapsibleHeadingProps).level).toBe(3);
            expect((block.props as CollapsibleHeadingProps).children.length).toBe(1);
        });

        it('should create a callout block using createCalloutBlock', () => {
            const childBlock: BlockModel = {
                id: 'child-id',
                type: BlockType.Paragraph,
                content: [],
                parentId: 'callout-id'
            };

            const block = BlockFactory.createCalloutBlock({
                id: 'callout-id'
            }, {
                children: [childBlock]
            });

            expect(block.type).toBe(BlockType.Callout);
            expect(block.id).toBe('callout-id');
            expect((block.props as CalloutProps).children.length).toBe(1);
            expect((block.props as CalloutProps).children[0].id).toBe('child-id');
        });

        it('should create an image block using createImageBlock', () => {
            const block = BlockFactory.createImageBlock({
                cssClass: 'img-container'
            }, {
                src: 'image.jpg',
                width: '300px',
                height: '200px',
                altText: 'Sample image',
                readOnly: true
            });

            expect(block.type).toBe(BlockType.Image);
            expect(block.cssClass).toBe('img-container');
            expect((block.props as ImageProps).src).toBe('image.jpg');
            expect((block.props as ImageProps).width).toBe('300px');
            expect((block.props as ImageProps).height).toBe('200px');
            expect((block.props as ImageProps).altText).toBe('Sample image');
            expect((block.props as ImageProps).readOnly).toBe(true);
        });

        it('should create a template block using createTemplateBlock', () => {
            const block = BlockFactory.createTemplateBlock({
                id: 'template-id',
                cssClass: 'template-style'
            });

            expect(block.type).toBe('Template');
            expect(block.id).toBe('template-id');
            expect(block.cssClass).toBe('template-style');
        });

        it('should create text content using createTextContent', () => {
            const content = BlockFactory.createTextContent({
                content: 'Sample text'
            }, {
                styles: {
                    bold: true,
                    color: '#FF0000'
                }
            });

            expect(content.type).toBe(ContentType.Text);
            expect(content.content).toBe('Sample text');
            expect((content.props as TextContentProps).styles.bold).toBe(true);
            expect((content.props as TextContentProps).styles.color).toBe('#FF0000');
        });

        it('should create link content using createLinkContent', () => {
            const content = BlockFactory.createLinkContent({
                content: 'Link text'
            }, {
                url: 'https://example.com',
                openInNewWindow: false,
                styles: {
                    underline: true
                }
            });

            expect(content.type).toBe(ContentType.Link);
            expect(content.content).toBe('Link text');
            expect((content.props as LinkContentProps).url).toBe('https://example.com');
            expect((content.props as LinkContentProps).openInNewWindow).toBe(false);
            expect((content.props as LinkContentProps).styles.underline).toBe(true);
        });

        it('should create mention content using createMentionContent', () => {
            const content = BlockFactory.createMentionContent({
                content: '@username'
            }, {
                userId: 'user123'
            });

            expect(content.type).toBe(ContentType.Mention);
            expect(content.content).toBe('@username');
            expect((content.props as MentionContentProps).userId).toBe('user123');
        });

        it('should create label content using createLabelContent', () => {
            const content = BlockFactory.createLabelContent({
                content: 'Label text'
            }, {
                labelId: 'label123'
            });

            expect(content.type).toBe(ContentType.Label);
            expect(content.content).toBe('Label text');
            expect((content.props as LabelContentProps).labelId).toBe('label123');
        });

        it('should create code content using createCodeContent', () => {
            const content = BlockFactory.createCodeContent({
                content: 'const x = 10;'
            }, {
                styles: {
                    color: '#0000FF'
                }
            });

            expect(content.type).toBe(ContentType.Code);
            expect(content.content).toBe('const x = 10;');
            expect((content.props as BaseStylesProp).styles.color).toBe('#0000FF');
        });
    });

    describe('creation methods with no parameters', () => {
        it('should create paragraph block', () => {
            const block = BlockFactory.createParagraphBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Paragraph);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.indent).toBe(0);
            expect(block.parentId).toBe('');
            expect(block.cssClass).toBe('');
            expect(block.props).toBeDefined();
            expect((block.props as ParagraphProps).placeholder).toBe('');
        });

        it('should create heading block', () => {
            const block = BlockFactory.createHeadingBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Heading);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as HeadingProps).level).toBe(1);
            expect((block.props as HeadingProps).placeholder).toBe('');
        });

        it('should create checklist block', () => {
            const block = BlockFactory.createChecklistBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Checklist);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as ChecklistProps).isChecked).toBe(false);
            expect((block.props as ChecklistProps).placeholder).toBe('');
        });

        it('should create bullet list block', () => {
            const block = BlockFactory.createBulletListBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.BulletList);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as BulletListProps).placeholder).toBe('');
        });

        it('should create numbered list block', () => {
            const block = BlockFactory.createNumberedListBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.NumberedList);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as NumberedListProps).placeholder).toBe('');
        });

        it('should create code block', () => {
            const block = BlockFactory.createCodeBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Code);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as CodeProps).defaultLanguage).toBe('javascript');
            expect((block.props as CodeProps).languages).toEqual([]);
        });

        it('should create quote block', () => {
            const block = BlockFactory.createQuoteBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Quote);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as QuoteProps).placeholder).toBe('');
        });

        it('should create callout block', () => {
            const block = BlockFactory.createCalloutBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Callout);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as CalloutProps).children).toEqual([]);
        });

        it('should create divider block', () => {
            const block = BlockFactory.createDividerBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Divider);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.props).toEqual({});
        });

        it('should create collapsible paragraph block', () => {
            const block = BlockFactory.createCollapsibleParagraphBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.CollapsibleParagraph);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as CollapsibleProps).isExpanded).toBe(false);
            expect((block.props as CollapsibleProps).children).toEqual([]);
            expect((block.props as CollapsibleProps).placeholder).toBe('');
        });

        it('should create collapsible heading block', () => {
            const block = BlockFactory.createCollapsibleHeadingBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.CollapsibleHeading);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as CollapsibleHeadingProps).isExpanded).toBe(false);
            expect((block.props as CollapsibleHeadingProps).level).toBe(1);
            expect((block.props as CollapsibleHeadingProps).children).toEqual([]);
            expect((block.props as CollapsibleHeadingProps).placeholder).toBe('');
        });

        it('should create image block', () => {
            const block = BlockFactory.createImageBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe(BlockType.Image);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.props as ImageProps).src).toBe('');
            expect((block.props as ImageProps).saveFormat).toBe('Base64');
            expect((block.props as ImageProps).allowedTypes).toEqual(['.jpg', '.jpeg', '.png']);
            expect((block.props as ImageProps).minWidth).toBe(40);
            expect((block.props as ImageProps).maxWidth).toBe('');
            expect((block.props as ImageProps).minHeight).toBe(40);
            expect((block.props as ImageProps).maxHeight).toBe('');
            expect((block.props as ImageProps).readOnly).toBe(false);
        });

        it('should create template block', () => {
            const block = BlockFactory.createTemplateBlock();

            expect(block).not.toBeNull();
            expect(block.type).toBe('Template');
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.props).toEqual({});
        });

        it('should create text content', () => {
            const content = BlockFactory.createTextContent();

            expect(content).not.toBeNull();
            expect(content.type).toBe(ContentType.Text);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.props as TextContentProps).styles).toEqual({});
        });

        it('should create link content', () => {
            const content = BlockFactory.createLinkContent();

            expect(content).not.toBeNull();
            expect(content.type).toBe(ContentType.Link);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.props as LinkContentProps).url).toBe('');
            expect((content.props as LinkContentProps).openInNewWindow).toBe(true);
            expect((content.props as LinkContentProps).styles).toEqual({});
        });

        it('should create mention content', () => {
            const content = BlockFactory.createMentionContent();

            expect(content).not.toBeNull();
            expect(content.type).toBe(ContentType.Mention);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.props as MentionContentProps).userId).toBe('');
        });

        it('should create label content', () => {
            const content = BlockFactory.createLabelContent();

            expect(content).not.toBeNull();
            expect(content.type).toBe(ContentType.Label);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.props as LabelContentProps).labelId).toBe('');
        });

        it('should create code content', () => {
            const content = BlockFactory.createCodeContent();

            expect(content).not.toBeNull();
            expect(content.type).toBe(ContentType.Code);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.props as BaseStylesProp).styles).toEqual({});
        });
    });
});