import { createElement } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../src/blockeditor/base/enums';
import {
    convertHtmlElementToBlocks,
    convertInlineElementsToContentModels,
    createBlockFromElement,
    extractStylesFromElement,
    getBlockDataAsHTML,
    renderContentAsHTML
} from '../../src/blockeditor/utils/html-parser';
import { BlockModel, ContentModel, StyleModel } from '../../src/blockeditor/models/index';
import { cleanCheckmarkElement, getAdjacentBlock, getBlockIndexById, getContentElementBasedOnId, isAtEndOfBlock, isAtStartOfBlock, isNonContentEditableBlock, normalizeBlockIntoContentElement, removeEmptyTextNodes } from '../../src/blockeditor/utils/block';
import { 
    generateUniqueId, 
    getTemplateFunction, 
    normalizeRange, 
    denormalizeUrl,
    isNodeAroundSpecialElements, 
    getAccessibleTextColor
} from '../../src/blockeditor/utils/common';

describe('Block utility functions', () => {
    describe('HTML Parser Utils', () => {
        describe('getBlockDataAsHTML function', () => {
            it('should return empty string for empty blocks array', () => {
                expect(getBlockDataAsHTML([])).toBe('');
                expect(getBlockDataAsHTML(null)).toBe('');
            });

            it('should convert paragraph block to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'para1',
                    type: BlockType.Paragraph,
                    content: [{
                        id: 'content1',
                        type: ContentType.Text,
                        content: 'Test paragraph'
                    }]
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<p>Test paragraph</p>');
            });

            it('should convert heading blocks to HTML', () => {
                const blocks: BlockModel[] = [
                    {
                        id: 'heading1',
                        type: BlockType.Heading1,
                        content: [{ id: 'h1', type: ContentType.Text, content: 'Heading 1' }]
                    },
                    {
                        id: 'heading2',
                        type: BlockType.Heading2,
                        content: [{ id: 'h2', type: ContentType.Text, content: 'Heading 2' }]
                    },
                    {
                        id: 'heading3',
                        type: BlockType.Heading3,
                        content: [{ id: 'h3', type: ContentType.Text, content: 'Heading 3' }]
                    },
                    {
                        id: 'heading4',
                        type: BlockType.Heading4,
                        content: [{ id: 'h4', type: ContentType.Text, content: 'Heading 4' }]
                    }
                ];

                expect(getBlockDataAsHTML(blocks)).toBe(
                    '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4>'
                );
            });

            it('should convert bullet list blocks to HTML', () => {
                const blocks: BlockModel[] = [
                    {
                        id: 'list1',
                        type: BlockType.BulletList,
                        content: [{ id: 'l1', type: ContentType.Text, content: 'Item 1' }]
                    },
                    {
                        id: 'list2',
                        type: BlockType.BulletList,
                        content: [{ id: 'l2', type: ContentType.Text, content: 'Item 2' }]
                    }
                ];

                expect(getBlockDataAsHTML(blocks)).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>');
            });

            it('should convert numbered list blocks to HTML', () => {
                const blocks: BlockModel[] = [
                    {
                        id: 'list1',
                        type: BlockType.NumberedList,
                        content: [{ id: 'l1', type: ContentType.Text, content: 'Item 1' }]
                    },
                    {
                        id: 'list2',
                        type: BlockType.NumberedList,
                        content: [{ id: 'l2', type: ContentType.Text, content: 'Item 2' }]
                    }
                ];

                expect(getBlockDataAsHTML(blocks)).toBe('<ol><li>Item 1</li><li>Item 2</li></ol>');
            });

            it('should convert nested list blocks to HTML', () => {
                const blocks: BlockModel[] = [
                    {
                        id: 'list1',
                        type: BlockType.BulletList,
                        content: [{ id: 'l1', type: ContentType.Text, content: 'Item 1' }],
                        indent: 0
                    },
                    {
                        id: 'list2',
                        type: BlockType.BulletList,
                        content: [{ id: 'l2', type: ContentType.Text, content: 'Item 1.1' }],
                        indent: 1
                    },
                    {
                        id: 'list3',
                        type: BlockType.BulletList,
                        content: [{ id: 'l3', type: ContentType.Text, content: 'Item 1.2' }],
                        indent: 1
                    },
                    {
                        id: 'list4',
                        type: BlockType.BulletList,
                        content: [{ id: 'l4', type: ContentType.Text, content: 'Item 2' }],
                        indent: 0
                    }
                ];

                const html = getBlockDataAsHTML(blocks);
                expect(html).toContain('<ul><li>Item 1<ul><li>Item 1.1</li><li>Item 1.2</li></ul></li></ul><ul><li>Item 2</li></ul>');
            });

            it('should convert mixed list types to HTML', () => {
                const blocks: BlockModel[] = [
                    {
                        id: 'list1',
                        type: BlockType.BulletList,
                        content: [{ id: 'l1', type: ContentType.Text, content: 'Bullet 1' }],
                        indent: 0
                    },
                    {
                        id: 'list2',
                        type: BlockType.NumberedList,
                        content: [{ id: 'l2', type: ContentType.Text, content: 'Number 1' }],
                        indent: 0
                    }
                ];

                expect(getBlockDataAsHTML(blocks)).toBe('<ul><li>Bullet 1</li></ul><ol><li>Number 1</li></ol>');
            });

            it('should convert image blocks to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'img1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://example.com/image.jpg',
                        altText: 'Test image'
                    }
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<img src=\'https://example.com/image.jpg\' alt=\'Test image\' />');
            });

            it('should handle empty image src', () => {
                const blocks: BlockModel[] = [{
                    id: 'img1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: '',
                        altText: 'Empty image'
                    }
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('');
            });

            it('should convert code blocks to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'code1',
                    type: BlockType.Code,
                    content: [{
                        id: 'c1',
                        type: ContentType.Text,
                        content: 'const x = 10;'
                    }]
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<pre><code>const x = 10;</code></pre>');
            });

            it('should convert quote blocks to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'quote1',
                    type: BlockType.Quote,
                    content: [{
                        id: 'q1',
                        type: ContentType.Text,
                        content: 'This is a quote'
                    }]
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<blockquote>This is a quote</blockquote>');
            });

            it('should convert callout blocks to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'callout1',
                    type: BlockType.Callout,
                    children: [{
                        id: 'para1',
                        type: BlockType.Paragraph,
                        content: [{ id: 'p1', type: ContentType.Text, content: 'Callout text' }]
                    }]
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<div class="callout"><p>Callout text</p></div>');
            });

            it('should convert toggle blocks to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'toggle1',
                    type: BlockType.ToggleParagraph,
                    content: [{ id: 't1', type: ContentType.Text, content: 'Toggle header' }],
                    children: [{
                        id: 'para1',
                        type: BlockType.Paragraph,
                        content: [{ id: 'p1', type: ContentType.Text, content: 'Toggle content' }]
                    }]
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<div class="toggle">Toggle header <p>Toggle content</p></div>');
            });

            it('should convert divider block to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'div1',
                    type: BlockType.Divider
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<hr />');
            });

            it('should convert blocks with styled content to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'styled1',
                    type: BlockType.Paragraph,
                    content: [{
                        id: 'style1',
                        type: ContentType.Text,
                        content: 'Styled text',
                        styles: {
                            bold: true,
                            italic: true,
                            underline: true,
                            strikethrough: true,
                            color: '#ff0000',
                            bgColor: '#00ff00'
                        }
                    }]
                }];

                const html = getBlockDataAsHTML(blocks);
                expect(html).toContain('<p>');
                expect(html).toContain('<strong>');
                expect(html).toContain('<em>');
                expect(html).toContain('<u>');
                expect(html).toContain('<s>');
                expect(html).toContain('style="color: #ff0000;"');
                expect(html).toContain('style="background-color: #00ff00;"');
            });

            it('should convert link content to HTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'link1',
                    type: BlockType.Paragraph,
                    content: [{
                        id: 'l1',
                        type: ContentType.Link,
                        content: 'Link text',
                        linkSettings: {
                            url: 'https://example.com',
                            openInNewWindow: true
                        }
                    }]
                }];

                expect(getBlockDataAsHTML(blocks)).toBe('<p><a href="https://example.com" target="_blank">Link text</a></p>');
            });
        });

        describe('renderContentAsHTML function', () => {
            it('should return empty string for empty content array', () => {
                expect(renderContentAsHTML([])).toBe('');
            });

            it('should render plain text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Plain text'
                }];

                expect(renderContentAsHTML(content)).toBe('Plain text');
            });

            it('should render bold text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Bold text',
                    styles: { bold: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<strong>Bold text</strong>');
            });

            it('should render italic text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Italic text',
                    styles: { italic: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<em>Italic text</em>');
            });

            it('should render underlined text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Underlined text',
                    styles: { underline: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<u>Underlined text</u>');
            });

            it('should render strikethrough text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Strikethrough text',
                    styles: { strikethrough: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<s>Strikethrough text</s>');
            });

            it('should render superscript text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Superscript text',
                    styles: { superscript: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<sup>Superscript text</sup>');
            });

            it('should render subscript text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Subscript text',
                    styles: { subscript: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<sub>Subscript text</sub>');
            });

            it('should render uppercase text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Uppercase text',
                    styles: { uppercase: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<span style="text-transform: uppercase;">Uppercase text</span>');
            });

            it('should render lowercase text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Lowercase text',
                    styles: { lowercase: true }
                }];

                expect(renderContentAsHTML(content)).toBe('<span style="text-transform: lowercase;">Lowercase text</span>');
            });

            it('should render colored text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Colored text',
                    styles: { color: '#ff0000' }
                }];

                expect(renderContentAsHTML(content)).toBe('<span style="color: #ff0000;">Colored text</span>');
            });

            it('should render background-colored text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'BG-Colored text',
                    styles: { bgColor: '#00ff00' }
                }];

                expect(renderContentAsHTML(content)).toBe('<span style="background-color: #00ff00;">BG-Colored text</span>');
            });

            it('should render custom-styled text content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Custom text',
                    styles: { custom: 'font-family: Arial' }
                }];

                expect(renderContentAsHTML(content)).toBe('<span style="font-family: Arial;">Custom text</span>');
            });

            it('should render multiple styles in the correct order', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: 'Multi-styled text',
                    styles: {
                        bold: true,
                        italic: true,
                        underline: true
                    }
                }];

                expect(renderContentAsHTML(content)).toBe('<u><em><strong>Multi-styled text</strong></em></u>');
            });

            it('should render link content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Link,
                    content: 'Link text',
                    linkSettings: {
                        url: 'https://example.com',
                        openInNewWindow: false
                    }
                }];

                expect(renderContentAsHTML(content)).toBe('<a href="https://example.com" >Link text</a>');
            });

            it('should render link content with new window target', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Link,
                    content: 'Link text',
                    linkSettings: {
                        url: 'https://example.com',
                        openInNewWindow: true
                    }
                }];

                expect(renderContentAsHTML(content)).toBe('<a href="https://example.com" target="_blank">Link text</a>');
            });

            it('should escape HTML in content', () => {
                const content: ContentModel[] = [{
                    id: 'c1',
                    type: ContentType.Text,
                    content: '<script>alert("XSS")</script>'
                }];

                const html = renderContentAsHTML(content);
                expect(html).not.toContain('<script>');
                expect(html).toContain('&lt;script&gt;');
            });
        });

        describe('convertHtmlElementToBlocks function', () => {
            it('should convert paragraph elements to blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<p>Test paragraph</p>'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(1);
                expect(blocks[0].type).toBe(BlockType.Paragraph);
                expect(blocks[0].content[0].content).toBe('Test paragraph');
            });

            it('should convert heading elements to blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4>'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(4);
                expect(blocks[0].type).toBe(BlockType.Heading1);
                expect(blocks[1].type).toBe(BlockType.Heading2);
                expect(blocks[2].type).toBe(BlockType.Heading3);
                expect(blocks[3].type).toBe(BlockType.Heading4);
            });

            it('should convert blockquote elements to blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<div><blockquote>Test quote</blockquote><div>'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(2);
                expect(blocks[0].type).toBe(BlockType.Quote);
                expect(blocks[0].content[0].content).toBe('Test quote');
            });

            it('should convert hr elements to divider blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<hr>'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(1);
                expect(blocks[0].type).toBe(BlockType.Divider);
            });

            it('should convert img elements to image blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<img src="test.jpg" alt="Test image">'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(1);
                expect(blocks[0].type).toBe(BlockType.Image);
                expect(blocks[0].imageSettings.src).toContain('test.jpg');
                expect(blocks[0].imageSettings.altText).toBe('Test image');
            });

            it('should convert pre code elements to code blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<pre><code>const x = 10;</code></pre>'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(1);
                expect(blocks[0].type).toBe(BlockType.Code);
                expect(blocks[0].content[0].content).toBe('const x = 10;');
            });

            it('should convert unordered lists to bullet list blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<ul><li>Item 1</li><li>Item 2</li></ul>'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(2);
                expect(blocks[0].type).toBe(BlockType.BulletList);
                expect(blocks[1].type).toBe(BlockType.BulletList);
                expect(blocks[0].content[0].content).toBe('Item 1');
                expect(blocks[1].content[0].content).toBe('Item 2');
            });

            it('should convert ordered lists to numbered list blocks', () => {
                const container = createElement('div', {
                    innerHTML: '<ol><li>Item 1</li><li>Item 2</li></ol>'
                });

                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(2);
                expect(blocks[0].type).toBe(BlockType.NumberedList);
                expect(blocks[1].type).toBe(BlockType.NumberedList);
                expect(blocks[0].content[0].content).toBe('Item 1');
                expect(blocks[1].content[0].content).toBe('Item 2');
            });
        });

        describe('extractStylesFromElement function', () => {
            it('should extract bold style', () => {
                const element = createElement('strong', { innerHTML: 'Bold text' });
                const styles = extractStylesFromElement(element);
                expect(styles.bold).toBe(true);
            });

            it('should extract italic style', () => {
                const element = createElement('em', { innerHTML: 'Italic text' });
                const styles = extractStylesFromElement(element);
                expect(styles.italic).toBe(true);
            });

            it('should extract underline style', () => {
                const element = createElement('u', { innerHTML: 'Underlined text' });
                const styles = extractStylesFromElement(element);
                expect(styles.underline).toBe(true);
            });

            it('should extract strikethrough style', () => {
                const element = createElement('s', { innerHTML: 'Strikethrough text' });
                const styles = extractStylesFromElement(element);
                expect(styles.strikethrough).toBe(true);
            });

            it('should extract superscript style', () => {
                const element = createElement('sup', { innerHTML: 'Superscript text' });
                const styles = extractStylesFromElement(element);
                expect(styles.superscript).toBe(true);
            });

            it('should extract subscript style', () => {
                const element = createElement('sub', { innerHTML: 'Subscript text' });
                const styles = extractStylesFromElement(element);
                expect(styles.subscript).toBe(true);
            });

            it('should extract color style', () => {
                const element = createElement('span', {
                    innerHTML: 'Colored text',
                    styles: 'color: #ff0000'
                });
                const styles = extractStylesFromElement(element);
                expect(styles.color).toBe('rgb(255, 0, 0)');
            });

            it('should extract background color style', () => {
                const element = createElement('span', {
                    innerHTML: 'BG Colored text',
                    styles: 'background-color: #00ff00'
                });
                const styles = extractStylesFromElement(element);
                expect(styles.bgColor).toBe('rgb(0, 255, 0)');
            });

            it('should merge with existing styles', () => {
                const element = createElement('strong', { innerHTML: 'Bold text' });
                const existingStyles: StyleModel = { italic: true };
                const styles = extractStylesFromElement(element, existingStyles);
                expect(styles.bold).toBe(true);
                expect(styles.italic).toBe(true);
            });
        });

        describe('convertInlineElementsToContentModels function', () => {
            it('should return a single content model with keepFormat=false', () => {
                const element = createElement('div', {
                    innerHTML: '<strong>Bold</strong> and <em>italic</em> text'
                });
                
                const contentModels = convertInlineElementsToContentModels(element, false);
                
                expect(contentModels.length).toBe(1);
                expect(contentModels[0].content).toBe('Bold and italic text');
                expect(contentModels[0].styles).toBeUndefined();
            });
            
            it('should handle empty element correctly', () => {
                const element = createElement('div', {
                    innerHTML: ''
                });
                
                const contentModels = convertInlineElementsToContentModels(element, false);
                expect(contentModels.length).toBe(0);
                
                const formattedContentModels = convertInlineElementsToContentModels(element, true);
                expect(formattedContentModels.length).toBe(0);
            });
            it ('should handle anchor elements correctly', () => {
                const element = createElement('div', {
                    innerHTML: 'Text with <a href="https://example.com" target="_blank">link</a>'
                });
                
                const contentModels = convertInlineElementsToContentModels(element, true);
                expect (contentModels.length).toBe(2);
                expect(contentModels[0].content).toBe('Text with ');
                expect(contentModels[1].type).toBe(ContentType.Link);

            });
            it('should handle code elements correctly', () => {
                const element = createElement('div', {
                    innerHTML: 'Text with <code>inline code</code>'
                });
                
                const contentModels = convertInlineElementsToContentModels(element, true);
                
                expect(contentModels.length).toBe(2);
                expect(contentModels[0].content).toBe('Text with ');
                expect(contentModels[1].type).toBe(ContentType.Code);
                expect(contentModels[1].content).toBe('inline code');
            });
            
            it('should handle nested formatting correctly', () => {
                const element = createElement('div', {
                    innerHTML: '<strong><em>Bold and italic</em></strong>'
                });
                
                const contentModels = convertInlineElementsToContentModels(element, true);
                
                expect(contentModels.length).toBe(1);
                expect(contentModels[0].content).toBe('Bold and italic');
                expect(contentModels[0].styles.bold).toBe(true);
                expect(contentModels[0].styles.italic).toBe(true);
            });
            
            it('should ignore UL/OL elements in the content', () => {
                const element = createElement('div', {
                    innerHTML: 'Text with <ul><li>list item</li></ul> in it'
                });
                
                const contentModels = convertInlineElementsToContentModels(element, true);
                
                // The UL should be skipped, so we should only see "Text with  in it"
                expect(contentModels.length).toBe(2);
                expect(contentModels[0].content).toBe('Text with ');
                expect(contentModels[1].content).toBe(' in it');
            });
        });

        describe('HTML conversion edge cases', () => {
            it('should handle null or empty content in renderContentAsHTML', () => {
                const nullContent = [{ id: 'c1', type: ContentType.Text }];
                expect(renderContentAsHTML(nullContent)).toBe('');
                
                const emptyContent = [{ id: 'c1', type: ContentType.Text, content: '' }];
                expect(renderContentAsHTML(emptyContent)).toBe('');
            });
            
            it('should handle text nodes in HTML conversion', () => {
                const container = createElement('div', {
                    innerHTML: 'Just a text node'
                });
                
                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(1);
                expect(blocks[0].type).toBe(BlockType.Paragraph);
                expect(blocks[0].content[0].content).toBe('Just a text node');
            });
            
            it('should handle empty text nodes in HTML conversion', () => {
                const container = createElement('div', {
                    innerHTML: '     '  // Just whitespace
                });
                
                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(0); // Should be ignored
            });
            
            it('should handle DIV elements without block elements', () => {
                const container = createElement('div', {
                    innerHTML: '<div>Simple div text</div>'
                });
                
                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(1);
                expect(blocks[0].type).toBe(BlockType.Paragraph);
                expect(blocks[0].content[0].content).toBe('Simple div text');
            });
            
            it('should handle nested lists in HTML to blocks conversion', () => {
                const container = createElement('div', {
                    innerHTML: '<ul><li>Item 1<ul><li>Nested item</li></ul></li></ul>'
                });
                
                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(2);
                expect(blocks[0].type).toBe(BlockType.BulletList);
                expect(blocks[0].indent).toBe(0);
                expect(blocks[1].type).toBe(BlockType.BulletList);
                expect(blocks[1].indent).toBe(1);
            });
            
            it('should handle table elements in HTML conversion', () => {
                const container = createElement('div', {
                    innerHTML: '<table><tbody><tr><td>Cell 1</td></tr><tr><td>Cell 2</td></tr></tbody></table>'
                });
                
                const blocks = convertHtmlElementToBlocks(container, true);
                expect(blocks.length).toBe(2);
                expect(blocks[0].type).toBe(BlockType.Paragraph);
                expect(blocks[0].content[0].content).toBe('Cell 1');
                expect(blocks[1].type).toBe(BlockType.Paragraph);
                expect(blocks[1].content[0].content).toBe('Cell 2');
            });
            
            it('should handle different block types in getBlockDataAsHTML', () => {
                const blocks: BlockModel[] = [{
                    id: 'unknown',
                    type: 'UnknownType' as BlockType,
                    content: [{ id: 'uc1', type: ContentType.Text, content: 'Unknown content' }]
                }];
                
                expect(getBlockDataAsHTML(blocks)).toBe('<div>Unknown content</div>');
            });
            
            it('should skip null blocks in getBlockDataAsHTML', () => {
                const blocks: BlockModel[] = [
                    null, 
                    {
                        id: 'para',
                        type: BlockType.Paragraph,
                        content: [{ id: 'c1', type: ContentType.Text, content: 'Valid content' }]
                    }
                ];
                
                expect(getBlockDataAsHTML(blocks)).toBe('<p>Valid content</p>');
            });
        });
    });
    describe('block utils', () => {
        describe('getBlockIndexById function', () => {
            it('should get the index of a block by id', () => {
                const blocks: BlockModel[] = [
                    { id: 'block1', type: BlockType.Paragraph },
                    { id: 'block2', type: BlockType.Paragraph },
                    { id: 'block3', type: BlockType.Paragraph }
                ];
                
                expect(getBlockIndexById('block1', blocks)).toBe(0);
                expect(getBlockIndexById('block2', blocks)).toBe(1);
                expect(getBlockIndexById('block3', blocks)).toBe(2);
            });
            
            it('should return -1 when block id is not found', () => {
                const blocks: BlockModel[] = [
                    { id: 'block1', type: BlockType.Paragraph },
                    { id: 'block2', type: BlockType.Paragraph }
                ];
                
                expect(getBlockIndexById('', blocks)).toBe(-1);
            });
            
            it('should return -1 for empty blocks array', () => {
                expect(getBlockIndexById('block1', [])).toBe(-1);
            });
            
            it('should return -1 for empty id', () => {
                const blocks: BlockModel[] = [
                    { id: 'block1', type: BlockType.Paragraph },
                    { id: 'block2', type: BlockType.Paragraph }
                ];
                
                expect(getBlockIndexById('', blocks)).toBe(-1);
            });
            
            it('should get the index of a child block within its parent', () => {
                const blocks: BlockModel[] = [
                    { 
                        id: 'parent1', 
                        type: BlockType.Callout,
                        children: [
                            { id: 'child1', type: BlockType.Paragraph, parentId: 'parent1' },
                            { id: 'child2', type: BlockType.Paragraph, parentId: 'parent1' }
                        ]
                    }
                ];
                
                expect(getBlockIndexById('child1', blocks)).toBe(0);
                expect(getBlockIndexById('child2', blocks)).toBe(1);
            });
        });
        
        describe('getAdjacentBlock function', () => {
            let container: HTMLElement;
            
            beforeEach(() => {
                container = createElement('div', { className: 'container' });
                document.body.appendChild(container);
            });
            
            afterEach(() => {
                container.remove();
            });
            
            it('should get the previous sibling block', () => {
                container.innerHTML = `
                    <div id="block1" class="e-block"></div>
                    <div id="block2" class="e-block"></div>
                `;
                
                const block1 = document.getElementById('block1');
                const block2 = document.getElementById('block2');
                
                expect(getAdjacentBlock(block2, 'previous')).toBe(block1);
            });
            
            it('should get the next sibling block', () => {
                container.innerHTML = `
                    <div id="block1" class="e-block"></div>
                    <div id="block2" class="e-block"></div>
                `;
                
                const block1 = document.getElementById('block1');
                const block2 = document.getElementById('block2');
                
                expect(getAdjacentBlock(block1, 'next')).toBe(block2);
            });
            
            it('should return null when no adjacent block exists', () => {
                container.innerHTML = `<div id="block1" class="e-block"></div>`;
                
                const block1 = document.getElementById('block1');
                
                expect(getAdjacentBlock(block1, 'previous')).toBeNull();
                expect(getAdjacentBlock(block1, 'next')).toBeNull();
            });
            
            it('should handle callout blocks correctly', () => {
                container.innerHTML = `
                    <div id="block1" class="e-block"></div>
                    <div id="callout" class="e-block e-callout-block">
                        <div class="e-callout-content">
                            <div id="child1" class="e-block"></div>
                            <div id="child2" class="e-block"></div>
                        </div>
                    </div>
                    <div id="block2" class="e-block"></div>
                `;
                
                const block1 = document.getElementById('block1');
                const child1 = document.getElementById('child1');
                const child2 = document.getElementById('child2');
                const block2 = document.getElementById('block2');
                
                expect(getAdjacentBlock(child1, 'previous')).toBe(block1);
                expect(getAdjacentBlock(child2, 'next')).toBe(block2);
            });
            
            it('should return null for null input', () => {
                expect(getAdjacentBlock(null, 'next')).toBeNull();
            });
        });
        
        describe('removeEmptyTextNodes function', () => {
            it('should remove empty text nodes from an element', () => {
                const element = createElement('div', {
                    innerHTML: '  <span>Text</span>  '
                });
                
                const initialChildNodes = element.childNodes.length;
                removeEmptyTextNodes(element);
                
                expect(element.childNodes.length).toBeLessThan(initialChildNodes);
                expect(element.childNodes.length).toBe(1);
            });
            
            it('should preserve non-empty text nodes', () => {
                const element = createElement('div', {
                    innerHTML: 'Text1<span>Text2</span>Text3'
                });
                
                const initialChildNodes = element.childNodes.length;
                removeEmptyTextNodes(element);
                
                expect(element.childNodes.length).toBe(initialChildNodes);
            });
        });
        
        describe('isNonContentEditableBlock function', () => {
            it('should return true for divider blocks', () => {
                expect(isNonContentEditableBlock(BlockType.Divider)).toBe(true);
            });
            
            it('should return true for image blocks', () => {
                expect(isNonContentEditableBlock(BlockType.Image)).toBe(true);
            });
            
            it('should return false for paragraph blocks', () => {
                expect(isNonContentEditableBlock(BlockType.Paragraph)).toBe(false);
            });
            
            it('should return false for heading blocks', () => {
                expect(isNonContentEditableBlock(BlockType.Heading1)).toBe(false);
                expect(isNonContentEditableBlock(BlockType.Heading2)).toBe(false);
                expect(isNonContentEditableBlock(BlockType.Heading3)).toBe(false);
            });
        });
        
        describe('getContentElementBasedOnId function', () => {
            let container: HTMLElement;
            
            beforeEach(() => {
                container = createElement('div', { className: 'container' });
                document.body.appendChild(container);
            });
            
            afterEach(() => {
                container.remove();
            });
            
            it('should get element by id', () => {
                container.innerHTML = `<span id="content1">Content</span>`;
                
                const content: ContentModel = {
                    id: 'content1',
                    type: ContentType.Text,
                    content: 'Content'
                };
                
                const element = getContentElementBasedOnId(content, container);
                expect(element).not.toBeNull();
                expect(element.id).toBe('content1');
            });
            
            it('should get element by dataId when id not found', () => {
                container.innerHTML = `<span id="data1">Content</span>`;
                
                const content: ContentModel = {
                    id: 'content1',
                    dataId: 'data1',
                    type: ContentType.Text,
                    content: 'Content'
                };
                
                const element = getContentElementBasedOnId(content, container);
                expect(element).not.toBeNull();
                expect(element.id).toBe('data1');
            });
            
            it('should return null when neither id nor dataId match', () => {
                container.innerHTML = `<span id="other">Content</span>`;
                
                const content: ContentModel = {
                    id: 'content1',
                    type: ContentType.Text,
                    content: 'Content'
                };
                
                const element = getContentElementBasedOnId(content, container);
                expect(element).toBeNull();
            });
            
            it('should return null when content is null', () => {
                container.innerHTML = `<span id="content1">Content</span>`;
                
                const element = getContentElementBasedOnId(null, container);
                expect(element).toBeNull();
            });
            
            it('should return null when wrapper is null', () => {
                const content: ContentModel = {
                    id: 'content1',
                    type: ContentType.Text,
                    content: 'Content'
                };
                
                const element = getContentElementBasedOnId(content, null);
                expect(element).toBeNull();
            });
        });
        
        describe('isAtStartOfBlock and isAtEndOfBlock functions', () => {
            let container: HTMLElement;
            let selection: Selection;
            let range: Range;
            
            beforeEach(() => {
                container = createElement('div', { className: 'container' });
                document.body.appendChild(container);
                selection = window.getSelection();
                range = document.createRange();
            });
            
            afterEach(() => {
                selection.removeAllRanges();
                container.remove();
            });
            
            it('should return false when block element is null for isAtStartOfBlock', () => {
                expect(isAtStartOfBlock(null)).toBe(false);
            });
            
            it('should return false when block element is null for isAtEndOfBlock', () => {
                expect(isAtEndOfBlock(null)).toBe(false);
            });
        });
        
        describe('normalizeBlockIntoContentElement function', () => {
            let container: HTMLElement;
            
            beforeEach(() => {
                container = createElement('div', { className: 'container' });
                document.body.appendChild(container);
            });
            
            afterEach(() => {
                container.remove();
            });
            
            it('should return content element when block element is passed', () => {
                container.innerHTML = `
                    <div id="block1" class="e-block">
                        <div id="content1" class="e-block-content">Content</div>
                    </div>
                `;
                
                const blockElement = document.getElementById('block1');
                const contentElement = document.getElementById('content1');
                
                const result = normalizeBlockIntoContentElement(blockElement);
                expect(result).toBe(contentElement);
            });
            
            it('should return the element itself if not a block element', () => {
                const element = createElement('div', { id: 'notBlock' });
                
                const result = normalizeBlockIntoContentElement(element);
                expect(result).toBe(element);
            });
        });
        
        describe('cleanCheckmarkElement function', () => {
            let container: HTMLElement;
            
            beforeEach(() => {
                container = createElement('div', { className: 'container' });
                document.body.appendChild(container);
            });
            
            afterEach(() => {
                container.remove();
            });
            
            it('should remove checkmark element from block', () => {
                container.innerHTML = `
                    <div id="block1" class="e-block">
                        <span class="e-checkmark"></span>
                        <div class="e-content">Content</div>
                    </div>
                `;
                
                const blockElement = document.getElementById('block1');
                const checkmark = blockElement.querySelector('.e-checkmark');
                
                expect(checkmark).not.toBeNull();
                cleanCheckmarkElement(blockElement);
                
                const checkmarkAfter = blockElement.querySelector('.e-checkmark');
                expect(checkmarkAfter).toBeNull();
            });
            
            it('should do nothing if no checkmark element exists', () => {
                container.innerHTML = `
                    <div id="block1" class="e-block">
                        <div class="e-content">Content</div>
                    </div>
                `;
                
                const blockElement = document.getElementById('block1');
                const initialHTML = blockElement.innerHTML;
                
                cleanCheckmarkElement(blockElement);
                
                expect(blockElement.innerHTML).toBe(initialHTML);
            });
        });
    });
    describe('Common utility functions', () => {
        describe('getTemplateFunction function', () => { 
            it('should handle function templates', () => {
                const templateFn = () => '<div>Function template</div>';
                const result = getTemplateFunction(templateFn);
                
                expect(typeof result).toBe('function');
            });
            
            it('should handle DOM selector templates', () => {
                // Create a script template
                const script = document.createElement('script');
                script.id = 'testTemplate';
                script.type = 'text/x-template';
                script.textContent = '<div>Script template</div>';
                document.body.appendChild(script);
                
                const templateFn = getTemplateFunction('#testTemplate');
                expect(typeof templateFn).toBe('function');
                
                // Clean up
                document.body.removeChild(script);
            });
            
            it('should handle DOM element templates', () => {
                const div = document.createElement('div');
                div.id = 'elementTemplate';
                div.innerHTML = 'Element template';
                document.body.appendChild(div);
                
                const templateFn = getTemplateFunction('#elementTemplate');
                expect(typeof templateFn).toBe('function');
                
                // Clean up
                document.body.removeChild(div);
            });
            
            it('should handle template errors gracefully', () => {
                // Non-existent selector should not throw an error
                const templateFn = getTemplateFunction('#nonExistentTemplate');
                expect(typeof templateFn).toBe('function');
            });
        });
        
        describe('normalizeRange function', () => {
            let container: HTMLElement;
            
            beforeEach(() => {
                container = document.createElement('div');
                container.innerHTML = `
                    <p id="p1">First paragraph</p>
                    <p id="p2">Second paragraph</p>
                `;
                document.body.appendChild(container);
            });
            
            afterEach(() => {
                document.body.removeChild(container);
            });
            
            it('should normalize range that starts at end of one element and ends at start of another', () => {
                const p1 = document.getElementById('p1');
                const p2 = document.getElementById('p2');
                
                const range = document.createRange();
                range.setStart(p1.firstChild, p1.firstChild.textContent.length); // End of first paragraph
                range.setEnd(p2.firstChild, 0); // Start of second paragraph
                
                const normalized = normalizeRange(range);
                
                // Should adjust to select only the end container
                expect(normalized.startContainer).toBe(p2.firstChild);
                expect(normalized.startOffset).toBe(0);
                expect(normalized.endContainer).toBe(p2.firstChild);
                expect(normalized.endOffset).toBe(p2.firstChild.textContent.length);
            });
            
            it('should normalize range that spans multiple elements with partial selection', () => {
                const p1 = document.getElementById('p1');
                const p2 = document.getElementById('p2');
                
                const range = document.createRange();
                range.setStart(p1.firstChild, 5); // Middle of first paragraph
                range.setEnd(p2.firstChild, 5); // Middle of second paragraph
                
                const normalized = normalizeRange(range);
                
                expect(normalized.startContainer).toBe(p1);
                expect(normalized.endContainer).toBe(p2);
            });
            
            it('should not modify range when selection is within a single element', () => {
                const p1 = document.getElementById('p1');
                
                const range = document.createRange();
                range.setStart(p1.firstChild, 2);
                range.setEnd(p1.firstChild, 5);
                
                const normalized = normalizeRange(range);
                
                expect(normalized.startContainer).toBe(p1.firstChild);
                expect(normalized.startOffset).toBe(2);
                expect(normalized.endContainer).toBe(p1.firstChild);
                expect(normalized.endOffset).toBe(5);
            });
        });
        
        describe('denormalizeUrl function', () => {
            it('should remove https:// from URLs', () => {
                expect(denormalizeUrl('https://example.com')).toBe('example.com');
            });
            
            it('should remove http:// from URLs', () => {
                expect(denormalizeUrl('http://example.com')).toBe('example.com');
            });
            
            it('should not modify URLs without protocol', () => {
                expect(denormalizeUrl('example.com')).toBe('example.com');
            });
            
            it('should not modify relative URLs', () => {
                expect(denormalizeUrl('/path/to/resource')).toBe('/path/to/resource');
            });
            
            it('should keep the path after removing protocol', () => {
                expect(denormalizeUrl('https://example.com/path?query=value')).toBe('example.com/path?query=value');
            });
        });
        
        describe('isNodeAroundSpecialElements function', () => {
            let container: HTMLElement;
            
            beforeEach(() => {
                container = document.createElement('div');
                document.body.appendChild(container);
            });
            
            afterEach(() => {
                document.body.removeChild(container);
            });
            
            it('should return true for node before an anchor element', () => {
                container.innerHTML = `Text<a href="#">Link</a>`;
                
                const textNode = container.firstChild;
                expect(isNodeAroundSpecialElements(textNode)).toBe(true);
            });
            
            it('should return true for node after an anchor element', () => {
                container.innerHTML = `<a href="#">Link</a>Text`;
                
                const textNode = container.lastChild;
                expect(isNodeAroundSpecialElements(textNode)).toBe(true);
            });
            
            it('should return true for node before a mention chip', () => {
                container.innerHTML = `Text<span class="e-mention-chip">@User</span>`;
                
                const textNode = container.firstChild;
                expect(isNodeAroundSpecialElements(textNode)).toBe(true);
            });
            
            it('should return true for node after a mention chip', () => {
                container.innerHTML = `<span class="e-mention-chip">@User</span>Text`;
                
                const textNode = container.lastChild;
                expect(isNodeAroundSpecialElements(textNode)).toBe(true);
            });
            
            it('should return true for node before a label chip', () => {
                container.innerHTML = `Text<span class="e-label-chip">Label</span>`;
                
                const textNode = container.firstChild;
                expect(isNodeAroundSpecialElements(textNode)).toBe(true);
            });
            
            it('should return true for node after a label chip', () => {
                container.innerHTML = `<span class="e-label-chip">Label</span>Text`;
                
                const textNode = container.lastChild;
                expect(isNodeAroundSpecialElements(textNode)).toBe(true);
            });
            
            it('should return false for node not adjacent to special elements', () => {
                container.innerHTML = `<p>Regular text</p>`;
                
                const textNode = container.querySelector('p').firstChild;
                expect(isNodeAroundSpecialElements(textNode)).toBe(null);
            });
        });
        
        describe('getAccessibleTextColor function', () => {
            it('should return black for light background colors', () => {
                expect(getAccessibleTextColor('#ffffff')).toBe('#000000'); // White
                expect(getAccessibleTextColor('#f0f0f0')).toBe('#000000'); // Light gray
                expect(getAccessibleTextColor('#ffff00')).toBe('#000000'); // Yellow
                expect(getAccessibleTextColor('#12')).toBe('#000000'); // invalid hex color
            });
            
            it('should return white for dark background colors', () => {
                expect(getAccessibleTextColor('#000000')).toBe('#ffffff'); // Black
                expect(getAccessibleTextColor('#333333')).toBe('#ffffff'); // Dark gray
                expect(getAccessibleTextColor('#0000ff')).toBe('#ffffff'); // Blue
                expect(getAccessibleTextColor('#f00')).toBe('#ffffff'); // Red
            });
            
            it('should handle RGB color format', () => {
                expect(getAccessibleTextColor('rgb(255, 255, 255)')).toBe('#000000'); // White
                expect(getAccessibleTextColor('rgb(0, 0, 0)')).toBe('#ffffff'); // Black
            });
            
            it('should return black for null RGB value', () => {
                const invalidColor = 'notacolor';
                expect(getAccessibleTextColor(invalidColor)).toBe('#000000');
            });
        });
    });
});
