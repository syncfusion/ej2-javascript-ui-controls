import { BlockFactory } from '../../src/block-manager/services/block-factory';
import { BlockType, ContentType } from '../../src/models/enums';
import { SaveFormat } from '../../src/models/types';

import {
    BaseStylesProp,
    BlockModel,
    IBulletListBlockSettings,
    ICalloutBlockSettings,
    IChecklistBlockSettings,
    CodeLanguageModel,
    ICodeBlockSettings,
    ICollapsibleHeadingBlockSettings,
    ICollapsibleBlockSettings,
    IHeadingBlockSettings,
    IImageBlockSettings,
    ILabelContentSettings,
    ILinkContentSettings,
    IMentionContentSettings,
    INumberedListBlockSettings,
    IParagraphBlockSettings,
    IQuoteBlockSettings,
    ITextContentSettings
} from '../../src/models/index';
import * as constants from '../../src/common/constant';

describe('BlockFactory', () => {

    describe('createBlockFromPartial method', () => {
        it('should create a paragraph block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Paragraph
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Paragraph);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.indent).toBe(0);
            expect(block.parentId).toBe('');
            expect(block.cssClass).toBe('');
            expect(block.properties).toBeDefined();
        });

        it('should create a paragraph block with custom values', () => {
            const block = BlockFactory.createBlockFromPartial({
                id: 'custom-id',
                blockType: BlockType.Paragraph,
                indent: 2,
                cssClass: 'custom-class',
                content: [{ id: 'content-id', contentType: ContentType.Text, content: 'Sample content' }],
                properties: { placeholder: 'Type something...' }
            });

            expect(block.id).toBe('custom-id');
            expect(block.blockType).toBe(BlockType.Paragraph);
            expect(block.indent).toBe(2);
            expect(block.cssClass).toBe('custom-class');
            expect(block.content.length).toBe(1);
            expect(block.content[0].content).toBe('Sample content');
            expect((block.properties as IParagraphBlockSettings).placeholder).toBe('Type something...');
        });

        it('should create a heading block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Heading
            });

            expect(block.blockType).toBe(BlockType.Heading);
            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
        });

        it('should create a heading block with custom level', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Heading,
                properties: { level: 3 }
            });

            expect(block.blockType).toBe(BlockType.Heading);
            expect((block.properties as IHeadingBlockSettings).level).toBe(3);
        });

        it('should create a checklist block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Checklist
            });

            expect(block.blockType).toBe(BlockType.Checklist);
            expect((block.properties as IChecklistBlockSettings).isChecked).toBe(false);
        });

        it('should create a checklist block with custom checked state', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Checklist,
                properties: { isChecked: true, placeholder: 'Check me' }
            });

            expect(block.blockType).toBe(BlockType.Checklist);
            expect((block.properties as IChecklistBlockSettings).isChecked).toBe(true);
            expect((block.properties as IChecklistBlockSettings).placeholder).toBe('Check me');
        });

        it('should create a bullet list block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.BulletList
            });

            expect(block.blockType).toBe(BlockType.BulletList);
            expect((block.properties as IBulletListBlockSettings).placeholder).toBe('');
        });

        it('should create a bullet list block with custom placeholder', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.BulletList,
                properties: { placeholder: 'List item' }
            });

            expect(block.blockType).toBe(BlockType.BulletList);
            expect((block.properties as IBulletListBlockSettings).placeholder).toBe('List item');
        });

        it('should create a numbered list block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.NumberedList
            });

            expect(block.blockType).toBe(BlockType.NumberedList);
            expect((block.properties as INumberedListBlockSettings).placeholder).toBe('');
        });

        it('should create a numbered list block with custom placeholder', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.NumberedList,
                properties: { placeholder: 'Numbered item' }
            });

            expect(block.blockType).toBe(BlockType.NumberedList);
            expect((block.properties as INumberedListBlockSettings).placeholder).toBe('Numbered item');
        });

        it('should create a code block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Code
            });

            expect(block.blockType).toBe(BlockType.Code);
            expect((block.properties as ICodeBlockSettings).language).toBe('javascript');
        });

        it('should create a quote block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Quote
            });

            expect(block.blockType).toBe(BlockType.Quote);
            expect((block.properties as IQuoteBlockSettings).placeholder).toBe('');
        });

        it('should create a quote block with custom placeholder', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Quote,
                properties: { placeholder: 'Quote text' }
            });

            expect(block.blockType).toBe(BlockType.Quote);
            expect((block.properties as IQuoteBlockSettings).placeholder).toBe('Quote text');
        });

        it('should create a callout block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Callout
            });

            expect(block.blockType).toBe(BlockType.Callout);
            expect((block.properties as ICalloutBlockSettings).children).not.toEqual([]);
            // create default paragraph block as its children
            const childProps = (block.properties as ICalloutBlockSettings).children;
            expect(childProps.length).toBe(1);
            expect(childProps[0].parentId).toBe(block.id);
            expect(childProps[0].blockType).toBe(BlockType.Paragraph);
            expect(childProps[0].content.length).toBe(1);
            expect(childProps[0].content[0].contentType).toBe(ContentType.Text);
        });

        it('should create a callout block with child blocks', () => {
            const childBlock: BlockModel = {
                id: 'child-block',
                blockType: BlockType.Paragraph,
                content: [{ id: 'child-content', contentType: ContentType.Text, content: 'Child content' }],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createBlockFromPartial({
                id: 'parent-id',
                blockType: BlockType.Callout,
                properties: {
                    children: [childBlock]
                }
            });

            expect(block.blockType).toBe(BlockType.Callout);
            expect((block.properties as ICalloutBlockSettings).children.length).toBe(1);
            expect((block.properties as ICalloutBlockSettings).children[0].id).toBe('child-block');
            expect((block.properties as ICalloutBlockSettings).children[0].parentId).toBe('parent-id');
        });

        it('should create a divider block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Divider
            });

            expect(block.blockType).toBe(BlockType.Divider);
            expect(block.properties).toEqual({});
        });

        it('should create a collapsible paragraph block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.CollapsibleParagraph
            });

            expect(block.blockType).toBe(BlockType.CollapsibleParagraph);
            expect((block.properties as ICollapsibleBlockSettings).isExpanded).toBe(false);
            // create default paragraph block as its children
            const childProps = (block.properties as ICollapsibleBlockSettings).children;
            expect(childProps.length).toBe(1);
            expect(childProps[0].parentId).toBe(block.id);
            expect(childProps[0].blockType).toBe(BlockType.Paragraph);
            expect(childProps[0].content.length).toBe(1);
            expect(childProps[0].content[0].contentType).toBe(ContentType.Text);
            expect((block.properties as ICollapsibleBlockSettings).placeholder).toBe('');
        });

        it('should create a collapsible paragraph block with custom values', () => {
            const childBlock: BlockModel = {
                id: 'child-block',
                blockType: BlockType.Paragraph,
                content: [{ id: 'child-content', contentType: ContentType.Text, content: 'Child content' }],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createBlockFromPartial({
                id: 'parent-id',
                blockType: BlockType.CollapsibleParagraph,
                properties: {
                    isExpanded: true,
                    placeholder: 'Collapsible content',
                    children: [childBlock]
                }
            });

            expect(block.blockType).toBe(BlockType.CollapsibleParagraph);
            expect((block.properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            expect((block.properties as ICollapsibleBlockSettings).placeholder).toBe('Collapsible content');
            expect((block.properties as ICollapsibleBlockSettings).children.length).toBe(1);
            expect((block.properties as ICollapsibleBlockSettings).children[0].id).toBe('child-block');
        });

        it('should create a collapsible heading block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.CollapsibleHeading
            });

            expect(block.blockType).toBe(BlockType.CollapsibleHeading);
            expect((block.properties as ICollapsibleHeadingBlockSettings).isExpanded).toBe(false);
            expect((block.properties as ICollapsibleHeadingBlockSettings).level).toBe(1);
            // create default paragraph block as its children
            const childProps = (block.properties as ICollapsibleHeadingBlockSettings).children;
            expect(childProps.length).toBe(1);
            expect(childProps[0].parentId).toBe(block.id);
            expect(childProps[0].blockType).toBe(BlockType.Paragraph);
            expect(childProps[0].content.length).toBe(1);
            expect(childProps[0].content[0].contentType).toBe(ContentType.Text);
        });

        it('should create a collapsible heading block with custom values', () => {
            const childBlock: BlockModel = {
                id: 'child-block',
                blockType: BlockType.Paragraph,
                content: [{ id: 'child-content', contentType: ContentType.Text, content: 'Child content' }],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createBlockFromPartial({
                id: 'parent-id',
                blockType: BlockType.CollapsibleHeading,
                properties: {
                    isExpanded: true,
                    level: 2,
                    placeholder: 'Collapsible heading',
                    children: [childBlock]
                }
            });

            expect(block.blockType).toBe(BlockType.CollapsibleHeading);
            expect((block.properties as ICollapsibleHeadingBlockSettings).isExpanded).toBe(true);
            expect((block.properties as ICollapsibleHeadingBlockSettings).level).toBe(2);
            expect((block.properties as ICollapsibleHeadingBlockSettings).placeholder).toBe('Collapsible heading');
            expect((block.properties as ICollapsibleHeadingBlockSettings).children.length).toBe(1);
        });

        it('should create an image block with default values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Image
            });

            expect(block.blockType).toBe(BlockType.Image);
            expect((block.properties as IImageBlockSettings).src).toBe('');
        });

        it('should create an image block with custom values', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Image,
                properties: {
                    src: 'image.png',
                    width: '200px',
                    height: '100px',
                    altText: 'Sample image',
                }
            });

            expect(block.blockType).toBe(BlockType.Image);
            expect((block.properties as IImageBlockSettings).src).toBe('image.png');
            expect((block.properties as IImageBlockSettings).width).toBe('200px');
            expect((block.properties as IImageBlockSettings).height).toBe('100px');
            expect((block.properties as IImageBlockSettings).altText).toBe('Sample image');
        });

        it('should create a template block with custom properties', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Template
            });

            expect(block.blockType).toBe('Template');
        });

        it('should return null for unknown block type', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: 'UnknownType' as BlockType
            });

            expect(block).toBeNull();
        });

        it('should return null when the type property is missing from the partial block', () => {
            const block = BlockFactory.createBlockFromPartial({
                id: 'no-type-id'
            });
            expect(block).toBeNull();
        });

        it('should return null when the type property is undefined in the partial block', () => {
            const block = BlockFactory.createBlockFromPartial({
                id: 'undefined-type-id',
                blockType: undefined
            });
            expect(block).toBeNull();
        });

        it('should return null when the type property is null in the partial block', () => {
     
            const block = BlockFactory.createBlockFromPartial({
                id: 'null-type-id',
                blockType: null
            });
            expect(block).toBeNull();
        });

        it('should use default props when props is explicitly undefined for a block type', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Paragraph,
                properties: undefined
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Paragraph);
            expect((block.properties as IParagraphBlockSettings).placeholder).toBe('');
        });

        it('should use default props when props is explicitly null for a block type', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Heading,
                properties: null
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Heading);
            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
            expect((block.properties as IHeadingBlockSettings).placeholder).toBe('');
        });

        it('should return null when an empty object is passed', () => {
            const block = BlockFactory.createBlockFromPartial({});
            expect(block).toBeNull();
        });

        it('should create a paragraph block with default values when props is an empty object', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Paragraph,
                properties: {}
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Paragraph);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.indent).toBe(0);
            expect(block.parentId).toBe('');
            expect(block.cssClass).toBe('');
            expect((block.properties as IParagraphBlockSettings).placeholder).toBe('');
        });

        it('should create a heading block with level 1 when a level less than 1 is provided', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Heading,
                properties: { level: 0 } // Invalid level
            });
            expect(block.blockType).toBe(BlockType.Heading);
            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
        });

        it('should create a heading block with level 1 when a negative level is provided', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Heading,
                properties: { level: -5 } // Invalid level
            });
            expect(block.blockType).toBe(BlockType.Heading);
            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
        });

        it('should create a heading block with level 1 when a level greater than 4 is provided', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Heading,
                properties: { level: 5 } // Invalid level
            });
            expect(block.blockType).toBe(BlockType.Heading);
            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
        });

        it('should pass through non-integer level for a heading block', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Heading,
                properties: { level: 3.5 } // Non-integer level
            });
            expect(block.blockType).toBe(BlockType.Heading);

            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
        });

        it('should handle width/height provided as numbers correctly', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Image,
                properties: {
                    width: 250, 
                    height: 150  
                }
            });

            expect(block.blockType).toBe(BlockType.Image);

            expect((block.properties as IImageBlockSettings).width).toBe(250);
            expect((block.properties as IImageBlockSettings).height).toBe(150);
        });

        it('should correctly propagate parentId for deeply nested children in a Callout block', () => {
            const grandChildBlock: BlockModel = {
                id: 'grandchild-paragraph',
                blockType: BlockType.Paragraph,
                content: [{ id: 'grandchild-content', contentType: ContentType.Text, content: 'Grandchild text' }],
                parentId: 'child-callout' // This will be overridden by the factory if it propagates
            };

            const childCalloutBlock: BlockModel = {
                id: 'child-callout',
                blockType: BlockType.Callout,
                content: [],
                properties: {
                    children: [grandChildBlock]
                },
                parentId: 'main-callout' // This will be overridden by the factory if it propagates
            };

            const mainCalloutBlock = BlockFactory.createBlockFromPartial({
                id: 'main-callout',
                blockType: BlockType.Callout,
                properties: {
                    children: [childCalloutBlock]
                }
            });

            expect(mainCalloutBlock).not.toBeNull();
            expect(mainCalloutBlock.id).toBe('main-callout');
            expect(mainCalloutBlock.blockType).toBe(BlockType.Callout);

            const firstLevelChild = (mainCalloutBlock.properties as ICalloutBlockSettings).children[0];
            expect(firstLevelChild).not.toBeNull();
            expect(firstLevelChild.id).toBe('child-callout');
            // Assert that the parentId of the first-level child is correctly set to the main block's id
            expect(firstLevelChild.parentId).toBe('main-callout');

            const secondLevelChild = (firstLevelChild.properties as ICalloutBlockSettings).children[0];
            expect(secondLevelChild).not.toBeNull();
            expect(secondLevelChild.id).toBe('grandchild-paragraph');
            // Assert that the parentId of the second-level child is correctly set to its direct parent's id
            expect(secondLevelChild.parentId).toBe('child-callout');
        });

        it('should initialize a Callout block with an empty children array when children is explicitly undefined', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Callout,
                properties: {
                    children: undefined // Explicitly undefined
                }
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Callout);

            // expect((block.properties as ICalloutBlockSettings).children).toEqual([]);
        });

        it('should initialize a Callout block with an empty children array when an empty array is explicitly provided', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Callout,
                properties: {
                    children: [] // Explicitly provided empty array
                }
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Callout);
            // Assert that the children array is truly empty
            expect((block.properties as ICalloutBlockSettings).children).toEqual([]);
            expect((block.properties as ICalloutBlockSettings).children.length).toBe(0);
        });

        it('should ignore non-object props (string) and use default properties for a block', () => {
             // @ts-ignore: Intentionally testing invalid 'props' type
            const block = (BlockFactory as any).createBlockFromPartial({
                blockType: BlockType.Paragraph,
                properties: 'invalid string props'
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Paragraph);
            // Expect default placeholder as the invalid string props should be ignored
            expect((block.properties as IParagraphBlockSettings).placeholder).toBe('');
        });

        it('should ignore non-object props (number) and use default properties for a block', () => {
             // @ts-ignore: Intentionally testing invalid 'props' type
            const block = (BlockFactory as any).createBlockFromPartial({
                blockType: BlockType.Heading,
                properties: 12345
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Heading);
            // Expect default heading level as the invalid number props should be ignored
            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
        });

        it('should ignore non-object props (boolean) and use default properties for a block', () => {
             // @ts-ignore: Intentionally testing invalid 'props' type
            const block = (BlockFactory as any).createBlockFromPartial({
                blockType: BlockType.Checklist,
                properties: true
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Checklist);
            // Expect default checked state as the invalid boolean props should be ignored
            expect((block.properties as IChecklistBlockSettings).isChecked).toBe(false);
        });

        it('should ignore array props and use default properties for a block', () => {
             // @ts-ignore: Intentionally testing invalid 'props' type
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Quote,
                properties: ['array', 'of', 'props']
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Quote);
            // Expect default placeholder as the invalid array props should be ignored
            expect((block.properties as IQuoteBlockSettings).placeholder).toBe('');
        });
    });

    describe('createContentFromPartial method', () => {
        it('should create text content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Text
            });

            expect(content.contentType).toBe(ContentType.Text);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.properties as ITextContentSettings).styles).toEqual({});
        });

        it('should create text content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                id: 'custom-content-id',
                contentType: ContentType.Text,
                content: 'Sample text',
                properties: {
                    styles: {
                        bold: true,
                        italic: true,
                        color: '#FF0000'
                    }
                }
            });

            expect(content.id).toBe('custom-content-id');
            expect(content.contentType).toBe(ContentType.Text);
            expect(content.content).toBe('Sample text');
            expect((content.properties as ITextContentSettings).styles.bold).toBe(true);
            expect((content.properties as ITextContentSettings).styles.italic).toBe(true);
            expect((content.properties as ITextContentSettings).styles.color).toBe('#FF0000');
        });

        it('should create link content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Link
            });

            expect(content.contentType).toBe(ContentType.Link);
            expect((content.properties as ILinkContentSettings).url).toBe('');
            expect((content.properties as ILinkContentSettings).styles).toEqual({});
        });

        it('should create link content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Link,
                content: 'Link text',
                properties: {
                    url: 'https://example.com',
                    styles: { underline: true }
                }
            });

            expect(content.contentType).toBe(ContentType.Link);
            expect(content.content).toBe('Link text');
            expect((content.properties as ILinkContentSettings).url).toBe('https://example.com');
            expect((content.properties as ILinkContentSettings).styles.underline).toBe(true);
        });

        it('should create mention content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Mention
            });

            expect(content.contentType).toBe(ContentType.Mention);
            expect((content.properties as IMentionContentSettings).userId).toBe('');
        });

        it('should create mention content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Mention,
                content: '@username',
                properties: {
                    userId: 'user123'
                }
            });

            expect(content.contentType).toBe(ContentType.Mention);
            expect(content.content).toBe('@username');
            expect((content.properties as IMentionContentSettings).userId).toBe('user123');
        });

        it('should create label content with default values', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Label
            });

            expect(content.contentType).toBe(ContentType.Label);
            expect((content.properties as ILabelContentSettings).labelId).toBe('');
        });

        it('should create label content with custom values', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Label,
                content: 'Label text',
                properties: {
                    labelId: 'label123'
                }
            });

            expect(content.contentType).toBe(ContentType.Label);
            expect(content.content).toBe('Label text');
            expect((content.properties as ILabelContentSettings).labelId).toBe('label123');
        });

        it('should return null for unknown content type', () => {
            const content = BlockFactory.createContentFromPartial({
                contentType: 'UnknownType' as ContentType
            });

            expect(content).toBeNull();
        });

        it('should return null when the type property is missing from the partial content', () => {
            const content = BlockFactory.createContentFromPartial({
                id: 'no-type-content-id',
                content: 'Some text'
            });
            expect(content).toBeNull();
        });

        it('should return null when the type property is null in the partial content', () => {
            const content = BlockFactory.createContentFromPartial({
                id: 'null-type-content-id',
                contentType: null,
                content: 'Some text'
            });
            expect(content).toBeNull();
        });

        it('should preserve whitespace-only string for text content', () => {
            const whitespaceContent = '     '; // String with only spaces
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Text,
                content: whitespaceContent
            });

            expect(content.contentType).toBe(ContentType.Text);
            expect(content.content).toBe(whitespaceContent);
            
        });

        it('should preserve multi-line string for text content', () => {
            const multiLineContent = 'First line\nSecond line\n\nThird line';
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Text,
                content: multiLineContent
            });

            expect(content.contentType).toBe(ContentType.Text);
            expect(content.content).toBe(multiLineContent); 
            expect(content.content.includes('\n')).toBeTruthy(); 
        });

        it('should preserve whitespace-only string for link content', () => {
            const whitespaceContent = '\t\t'; // String with only tabs
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Link,
                content: whitespaceContent,
                properties: { url: 'https://example.com/whitespace' }
            });

            expect(content.contentType).toBe(ContentType.Link);
            expect(content.content).toBe(whitespaceContent);
        });

        it('should preserve multi-line string for link content', () => {
            const multiLineContent = 'Link\nText\nHere';
            const content = BlockFactory.createContentFromPartial({
                contentType: ContentType.Link,
                content: multiLineContent,
                properties: { url: 'https://example.com/multiline' }
            });

            expect(content.contentType).toBe(ContentType.Link);
            expect(content.content).toBe(multiLineContent); // Should be exactly as provided
            expect(content.content.includes('\n')).toBeTruthy();
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
            expect(block.blockType).toBe(BlockType.Paragraph);
            expect(block.cssClass).toBe('custom-para');
            expect((block.properties as IParagraphBlockSettings).placeholder).toBe('Type here...');
        });

        it('should create a heading block using createHeadingBlock', () => {
            const block = BlockFactory.createHeadingBlock({
                cssClass: 'heading-style'
            }, {
                level: 2,
                placeholder: 'Heading'
            });

            expect(block.blockType).toBe(BlockType.Heading);
            expect(block.cssClass).toBe('heading-style');
            expect((block.properties as IHeadingBlockSettings).level).toBe(2);
            expect((block.properties as IHeadingBlockSettings).placeholder).toBe('Heading');
        });

        it('should create a checklist block using createChecklistBlock', () => {
            const block = BlockFactory.createChecklistBlock({
                indent: 1
            }, {
                isChecked: true
            });

            expect(block.blockType).toBe(BlockType.Checklist);
            expect(block.indent).toBe(1);
            expect((block.properties as IChecklistBlockSettings).isChecked).toBe(true);
        });

        it('should create a bullet list block using createBulletListBlock', () => {
            const block = BlockFactory.createBulletListBlock({
                indent: 1
            }, {
                placeholder: 'Bullet item'
            });

            expect(block.blockType).toBe(BlockType.BulletList);
            expect(block.indent).toBe(1);
            expect((block.properties as IBulletListBlockSettings).placeholder).toBe('Bullet item');
        });

        it('should create a numbered list block using createNumberedListBlock', () => {
            const block = BlockFactory.createNumberedListBlock({
                indent: 1
            }, {
                placeholder: 'Numbered item'
            });

            expect(block.blockType).toBe(BlockType.NumberedList);
            expect(block.indent).toBe(1);
            expect((block.properties as INumberedListBlockSettings).placeholder).toBe('Numbered item');
        });

        it('should create a quote block using createQuoteBlock', () => {
            const block = BlockFactory.createQuoteBlock({
                cssClass: 'quote-style'
            }, {
                placeholder: 'Quote text'
            });

            expect(block.blockType).toBe(BlockType.Quote);
            expect(block.cssClass).toBe('quote-style');
            expect((block.properties as IQuoteBlockSettings).placeholder).toBe('Quote text');
        });

        it('should create a code block using createCodeBlock', () => {
            const languages: CodeLanguageModel[] = [
                { language: 'javascript', label: 'JavaScript' },
                { language: 'python', label: 'Python' }
            ];

            const block = BlockFactory.createCodeBlock({
                cssClass: 'code-block'
            }, {
                language: 'python'
            });

            expect(block.blockType).toBe(BlockType.Code);
            expect(block.cssClass).toBe('code-block');
            expect((block.properties as ICodeBlockSettings).language).toBe('python');
        });

        it('should create a divider block using createDividerBlock', () => {
            const block = BlockFactory.createDividerBlock({
                cssClass: 'divider-style'
            });

            expect(block.blockType).toBe(BlockType.Divider);
            expect(block.cssClass).toBe('divider-style');
        });

        it('should create a collapsible paragraph block using createCollapsibleParagraphBlock', () => {
            const childBlock: BlockModel = {
                id: 'child-id',
                blockType: BlockType.Paragraph,
                content: [],
                parentId: 'parent-id'
            };

            const block = BlockFactory.createCollapsibleParagraphBlock({
                id: 'parent-id'
            }, {
                isExpanded: true,
                children: [childBlock]
            });

            expect(block.blockType).toBe(BlockType.CollapsibleParagraph);
            expect(block.id).toBe('parent-id');
            expect((block.properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            expect((block.properties as ICollapsibleBlockSettings).children.length).toBe(1);
            expect((block.properties as ICollapsibleBlockSettings).children[0].id).toBe('child-id');
        });

        it('should create a collapsible heading block using createCollapsibleHeadingBlock', () => {
            const childBlock: BlockModel = {
                id: 'child-id',
                blockType: BlockType.Paragraph,
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

            expect(block.blockType).toBe(BlockType.CollapsibleHeading);
            expect(block.id).toBe('parent-id');
            expect((block.properties as ICollapsibleHeadingBlockSettings).isExpanded).toBe(true);
            expect((block.properties as ICollapsibleHeadingBlockSettings).level).toBe(3);
            expect((block.properties as ICollapsibleHeadingBlockSettings).children.length).toBe(1);
        });

        it('should create a callout block using createCalloutBlock', () => {
            const childBlock: BlockModel = {
                id: 'child-id',
                blockType: BlockType.Paragraph,
                content: [],
                parentId: 'callout-id'
            };

            const block = BlockFactory.createCalloutBlock({
                id: 'callout-id'
            }, {
                children: [childBlock]
            });

            expect(block.blockType).toBe(BlockType.Callout);
            expect(block.id).toBe('callout-id');
            expect((block.properties as ICalloutBlockSettings).children.length).toBe(1);
            expect((block.properties as ICalloutBlockSettings).children[0].id).toBe('child-id');
        });

        it('should create an image block using createImageBlock', () => {
            const block = BlockFactory.createImageBlock({
                cssClass: 'img-container'
            }, {
                src: 'image.jpg',
                width: '300px',
                height: '200px',
                altText: 'Sample image'
            });

            expect(block.blockType).toBe(BlockType.Image);
            expect(block.cssClass).toBe('img-container');
            expect((block.properties as IImageBlockSettings).src).toBe('image.jpg');
            expect((block.properties as IImageBlockSettings).width).toBe('300px');
            expect((block.properties as IImageBlockSettings).height).toBe('200px');
            expect((block.properties as IImageBlockSettings).altText).toBe('Sample image');
        });

        it('should create a template block using createTemplateBlock', () => {
            const block = BlockFactory.createTemplateBlock({
                id: 'template-id',
                cssClass: 'template-style'
            });

            expect(block.blockType).toBe('Template');
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

            expect(content.contentType).toBe(ContentType.Text);
            expect(content.content).toBe('Sample text');
            expect((content.properties as ITextContentSettings).styles.bold).toBe(true);
            expect((content.properties as ITextContentSettings).styles.color).toBe('#FF0000');
        });

        it('should create link content using createLinkContent', () => {
            const content = BlockFactory.createLinkContent({
                content: 'Link text'
            }, {
                url: 'https://example.com',
                styles: {
                    underline: true
                }
            });

            expect(content.contentType).toBe(ContentType.Link);
            expect(content.content).toBe('Link text');
            expect((content.properties as ILinkContentSettings).url).toBe('https://example.com');
            expect((content.properties as ILinkContentSettings).styles.underline).toBe(true);
        });

        it('should create mention content using createMentionContent', () => {
            const content = BlockFactory.createMentionContent({
                content: '@username'
            }, {
                userId: 'user123'
            });

            expect(content.contentType).toBe(ContentType.Mention);
            expect(content.content).toBe('@username');
            expect((content.properties as IMentionContentSettings).userId).toBe('user123');
        });

        it('should create label content using createLabelContent', () => {
            const content = BlockFactory.createLabelContent({
                content: 'Label text'
            }, {
                labelId: 'label123'
            });

            expect(content.contentType).toBe(ContentType.Label);
            expect(content.content).toBe('Label text');
            expect((content.properties as ILabelContentSettings).labelId).toBe('label123');
        });
    });

    describe('creation methods with no parameters', () => {
        it('should create paragraph block', () => {
            const block = BlockFactory.createParagraphBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Paragraph);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.indent).toBe(0);
            expect(block.parentId).toBe('');
            expect(block.cssClass).toBe('');
            expect(block.properties).toBeDefined();
            expect((block.properties as IParagraphBlockSettings).placeholder).toBe('');
        });

        it('should create heading block', () => {
            const block = BlockFactory.createHeadingBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Heading);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as IHeadingBlockSettings).level).toBe(1);
            expect((block.properties as IHeadingBlockSettings).placeholder).toBe('');
        });

        it('should create checklist block', () => {
            const block = BlockFactory.createChecklistBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Checklist);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as IChecklistBlockSettings).isChecked).toBe(false);
            expect((block.properties as IChecklistBlockSettings).placeholder).toBe('');
        });

        it('should create bullet list block', () => {
            const block = BlockFactory.createBulletListBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.BulletList);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as IBulletListBlockSettings).placeholder).toBe('');
        });

        it('should create numbered list block', () => {
            const block = BlockFactory.createNumberedListBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.NumberedList);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as INumberedListBlockSettings).placeholder).toBe('');
        });

        it('should create code block', () => {
            const block = BlockFactory.createCodeBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Code);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as ICodeBlockSettings).language).toBe('javascript');
        });

        it('should create quote block', () => {
            const block = BlockFactory.createQuoteBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Quote);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as IQuoteBlockSettings).placeholder).toBe('');
        });

        it('should create callout block', () => {
            const block = BlockFactory.createCalloutBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Callout);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            // create default paragraph block as its children
            const childProps = (block.properties as ICalloutBlockSettings).children;
            expect(childProps.length).toBe(1);
            expect(childProps[0].parentId).toBe(block.id);
            expect(childProps[0].blockType).toBe(BlockType.Paragraph);
            expect(childProps[0].content.length).toBe(1);
            expect(childProps[0].content[0].contentType).toBe(ContentType.Text);
        });

        it('should create divider block', () => {
            const block = BlockFactory.createDividerBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Divider);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.properties).toEqual({});
        });

        it('should create collapsible paragraph block', () => {
            const block = BlockFactory.createCollapsibleParagraphBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.CollapsibleParagraph);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as ICollapsibleBlockSettings).isExpanded).toBe(false);
            // create default paragraph block as its children
            const childProps = (block.properties as ICollapsibleBlockSettings).children;
            expect(childProps.length).toBe(1);
            expect(childProps[0].parentId).toBe(block.id);
            expect(childProps[0].blockType).toBe(BlockType.Paragraph);
            expect(childProps[0].content.length).toBe(1);
            expect(childProps[0].content[0].contentType).toBe(ContentType.Text);
            expect((block.properties as ICollapsibleBlockSettings).placeholder).toBe('');
        });

        it('should create collapsible heading block', () => {
            const block = BlockFactory.createCollapsibleHeadingBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.CollapsibleHeading);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as ICollapsibleHeadingBlockSettings).isExpanded).toBe(false);
            expect((block.properties as ICollapsibleHeadingBlockSettings).level).toBe(1);
            // create default paragraph block as its children
            const childProps = (block.properties as ICollapsibleHeadingBlockSettings).children;
            expect(childProps.length).toBe(1);
            expect(childProps[0].parentId).toBe(block.id);
            expect(childProps[0].blockType).toBe(BlockType.Paragraph);
            expect(childProps[0].content.length).toBe(1);
            expect(childProps[0].content[0].contentType).toBe(ContentType.Text);
            expect((block.properties as ICollapsibleHeadingBlockSettings).placeholder).toBe('');
        });

        it('should create image block', () => {
            const block = BlockFactory.createImageBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Image);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect((block.properties as IImageBlockSettings).src).toBe('');
            expect((block.properties as IImageBlockSettings).altText).toBe('');
            expect((block.properties as IImageBlockSettings).width).toBe('');
            expect((block.properties as IImageBlockSettings).height).toBe('');
        });

        it('should create template block', () => {
            const block = BlockFactory.createTemplateBlock();

            expect(block).not.toBeNull();
            expect(block.blockType).toBe('Template');
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.properties).toEqual({});
        });

        it('should create text content', () => {
            const content = BlockFactory.createTextContent();

            expect(content).not.toBeNull();
            expect(content.contentType).toBe(ContentType.Text);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.properties as ITextContentSettings).styles).toEqual({});
        });

        it('should create link content', () => {
            const content = BlockFactory.createLinkContent();

            expect(content).not.toBeNull();
            expect(content.contentType).toBe(ContentType.Link);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.properties as ILinkContentSettings).url).toBe('');
            expect((content.properties as ILinkContentSettings).styles).toEqual({});
        });

        it('should create mention content', () => {
            const content = BlockFactory.createMentionContent();

            expect(content).not.toBeNull();
            expect(content.contentType).toBe(ContentType.Mention);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.properties as IMentionContentSettings).userId).toBe('');
        });

        it('should create label content', () => {
            const content = BlockFactory.createLabelContent();

            expect(content).not.toBeNull();
            expect(content.contentType).toBe(ContentType.Label);
            expect(content.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content.content).toBe('');
            expect((content.properties as ILabelContentSettings).labelId).toBe('');
        });
    });

    describe('ID generation uniqueness', () => {
        it('should generate unique IDs for multiple block creations without provided IDs', () => {
            const block1 = BlockFactory.createParagraphBlock();
            const block2 = BlockFactory.createParagraphBlock();
            const block3 = BlockFactory.createHeadingBlock(); // Test different types too

            expect(block1.id).not.toBe(block2.id);
            expect(block1.id).not.toBe(block3.id);
            expect(block2.id).not.toBe(block3.id);

            // Sanity check: ensure they still contain the prefix
            expect(block1.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block2.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block3.id).toContain(constants.BLOCK_ID_PREFIX);

        });

        it('should generate unique IDs for multiple content creations without provided IDs', () => {
            const content1 = BlockFactory.createTextContent();
            const content2 = BlockFactory.createTextContent();
            const content3 = BlockFactory.createLinkContent();

            expect(content1.id).not.toBe(content2.id);
            expect(content1.id).not.toBe(content3.id);
            expect(content2.id).not.toBe(content3.id);

            // Sanity check: ensure they still contain the prefix
            expect(content1.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content2.id).toContain(constants.CONTENT_ID_PREFIX);
            expect(content3.id).toContain(constants.CONTENT_ID_PREFIX);

        });
    });

    describe('Template Block specific checks', () => {

        it('should create a template block with default values including empty template and cssClass', () => {
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Template
            });

            expect(block).not.toBeNull();
            expect(block.blockType).toBe(BlockType.Template);
            expect(block.id).toContain(constants.BLOCK_ID_PREFIX);
            expect(block.content).toEqual([]);
            expect(block.indent).toBe(0);
            expect(block.parentId).toBe('');
            expect(block.cssClass).toBe(''); 
            expect(block.properties).toEqual({}); 
            expect(block.template).toBe(''); 
        });

        it('should store a string value in the template field of a Template block', () => {
            const templateString = '<div>This is a string template.</div>';
            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Template,
                template: templateString,
                cssClass: 'my-template-class'
            });

            expect(block.blockType).toBe(BlockType.Template);
            expect(block.template).toBe(templateString); 
            expect(block.cssClass).toBe('my-template-class');
            expect(block.properties).toEqual({}); 
        });

        it('should store an HTMLElement in the template field of a Template block', () => {
            const el = document.createElement('section');
            el.innerHTML = 'Template Content';
            el.id = 'dynamic-template-element';

            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Template,
                template: el
            });

            expect(block.blockType).toBe(BlockType.Template);
            expect(block.template).toBe(el);
            expect((block.template as HTMLElement).id).toBe('dynamic-template-element');
            expect((block.template as HTMLElement).innerHTML).toBe('Template Content');
        });

        it('should store a Function in the template field of a Template block', () => {
            const templateFunction = (data: { name: string }) => `Hello, ${data.name}!`;

            const block = BlockFactory.createBlockFromPartial({
                blockType: BlockType.Template,
                template: templateFunction
            });

            expect(block.blockType).toBe(BlockType.Template);
            expect(typeof block.template).toBe('function');
            expect(block.template).toBe(templateFunction);
            expect((block.template as Function)({ name: 'World' })).toBe('Hello, World!');
        });


        it('should create a template block using createTemplateBlock with a custom template string', () => {
            const customTemplate = 'Custom template via helper';
            const block = BlockFactory.createTemplateBlock({
                id: 'template-with-helper',
                template: customTemplate
            });

            expect(block.blockType).toBe('Template');
            expect(block.id).toBe('template-with-helper');
            expect(block.template).toBe(customTemplate);
            expect(block.content).toEqual([]);
            expect(block.properties).toEqual({});
        });

    });
});
