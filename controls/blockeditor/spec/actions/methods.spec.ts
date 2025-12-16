import { Base, createElement } from '@syncfusion/ej2-base';
import { BaseStylesProp, BlockModel, ICodeBlockSettings, ICollapsibleBlockSettings, IHeadingBlockSettings, IImageBlockSettings, ILinkContentSettings, IMentionContentSettings, ITableBlockSettings, ITextContentSettings } from '../../src/models/index';
import { createEditor } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { BlockType, CommandName, ContentType } from '../../src/models/enums';
import { getBlockContentElement } from '../../src/common/utils/index';

describe('BlockEditor Methods', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
        editor = createEditor({
            blocks: [
                {
                    id: 'paragraph1',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'content1', contentType: ContentType.Text, content: 'Initial content' }
                    ]
                }
            ]
        });
        editor.appendTo('#editor');
    });

    afterEach(() => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(editorElement);
    });

    describe('addBlock method', () => {
        it('should add a new block to the editor', (done) => {
            const initialBlockCount = editor.blocks.length;

            // Create a new block to add
            const newBlock: BlockModel = {
                id: 'paragraph2',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content2', contentType: ContentType.Text, content: 'New content' }
                ]
            };

            setTimeout(() => {
                // Add the block after the existing paragraph
                editor.addBlock(newBlock, 'paragraph1', true);

                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[1].id).toBe('paragraph2');
                expect(editor.blocks[1].content[0].content).toBe('New content');
                const addedElement = editorElement.querySelector('#paragraph2') as HTMLElement;

                expect(addedElement).toBeDefined();
                expect(addedElement.id).toBe('paragraph2');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(initialBlockCount + 1);
                const contentElement = getBlockContentElement(addedElement);
                expect(contentElement.textContent).toBe('New content');
                done();
            });
        });

        it('should add block at the beginning when isAfter is false', (done) => {
            const newBlock: BlockModel = {
                id: 'heading1',
                blockType: BlockType.Heading,
                properties: {
                    level: 1
                },
                content: [
                    { id: 'headingContent', contentType: ContentType.Text, content: 'New Heading' }
                ]
            };

            setTimeout(() => {
                editor.addBlock(newBlock, 'paragraph1', false);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].id).toBe('heading1');
                expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                expect((editor.blocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                const addedElement = editorElement.querySelector('#heading1') as HTMLElement;

                expect(addedElement.id).toBe('heading1');
                expect(editorElement.querySelector('.e-block').id).toBe('heading1');
                done();
            });
        });
    });

    describe('removeBlock method', () => {
        it('should remove a block from the editor', (done) => {
            const initialBlockCount = editor.blocks.length;

            // Add another block to remove
            const newBlock: BlockModel = {
                id: 'paragraph2',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content2', contentType: ContentType.Text, content: 'Block to remove' }
                ]
            };
            setTimeout(() => {
                editor.addBlock(newBlock, 'paragraph1', true);
                expect(editor.blocks.length).toBe(initialBlockCount + 1);

                // Remove the added block
                editor.removeBlock('paragraph2');

                // Check model update
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('paragraph1');

                // Check DOM update
                expect(editorElement.querySelectorAll('.e-block').length).toBe(initialBlockCount);
                expect(editorElement.querySelector('#paragraph2')).toBeNull();
                done();
            });
        });
    });

    describe('getBlock method', () => {
        it('should retrieve a block by ID', () => {
            const block = editor.getBlock('paragraph1');

            expect(block).not.toBeNull();
            expect(block.id).toBe('paragraph1');
            expect(block.blockType).toBe(BlockType.Paragraph);
            expect(block.content[0].content).toBe('Initial content');
        });

        it('should return null for nonexistent block ID', () => {
            const block = editor.getBlock('nonExistentId');

            expect(block).toBeNull();
        });
    });

    describe('moveBlock method', () => {
        it('should move a block to another position', (done) => {
            setTimeout(() => {
                // Add blocks to test moving
                editor.addBlock({
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: {
                        level: 1
                    },
                    content: [{ id: 'headingContent', contentType: ContentType.Text, content: 'Heading' }]
                }, 'paragraph1', false);

                editor.addBlock({
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'content2', contentType: ContentType.Text, content: 'Last paragraph' }]
                }, 'paragraph1', true);

                // Initial order should be: heading1, paragraph1, paragraph2
                expect(editor.blocks[0].id).toBe('heading1');
                expect(editor.blocks[1].id).toBe('paragraph1');
                expect(editor.blocks[2].id).toBe('paragraph2');

                // Move paragraph1 to the end (after paragraph2)
                editor.moveBlock('paragraph1', 'paragraph2');

                // New order should be: heading1, paragraph2, paragraph1
                expect(editor.blocks[0].id).toBe('heading1');
                expect(editor.blocks[1].id).toBe('paragraph2');
                expect(editor.blocks[2].id).toBe('paragraph1');

                // Check DOM update
                const blockElements = editorElement.querySelectorAll('.e-block');
                expect(blockElements[0].id).toBe('heading1');
                expect(blockElements[1].id).toBe('paragraph2');
                expect(blockElements[2].id).toBe('paragraph1');
                done();
            });
        });
    });

    describe('updateBlock method', () => {
        it('should update simple properties of a block', () => {
            // Update simple properties of paragraph1
            const result = editor.updateBlock('paragraph1', {
                cssClass: 'new-class',
                indent: 2,
            });

            expect(result).toBe(true);

            const updatedBlock = editor.getBlock('paragraph1');
            expect(updatedBlock.cssClass).toBe('new-class');
            expect(updatedBlock.indent).toBe(2);

            //DOM
            const blockElement = editor.blockManager.getBlockElementById('paragraph1');
            const contentElement = getBlockContentElement(blockElement);
            expect(blockElement.classList.contains('new-class')).toBe(true);
            expect(blockElement.style.getPropertyValue('--block-indent')).toBe('40');
        });

        it('should update properties of a child block', (done) => {
            setTimeout(() => {
                const parentBlock: BlockModel = {
                    id: 'parentBlock',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ id: 'parentContent', contentType: ContentType.Text, content: 'Toggle header' }],
                    properties: {
                        children: [{
                            id: 'childBlock',
                            blockType: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent', contentType: ContentType.Text, content: 'Child content' }],
                            indent: 0
                        }]
                    }
                };
                editor.addBlock(parentBlock);

                editor.updateBlock('parentBlock', {
                    properties: { isExpanded: true }
                });
                expect((editor.getBlock('parentBlock').properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                const parentBlockElement = editor.blockManager.getBlockElementById('parentBlock');
                const toggleContent = parentBlockElement.querySelector('.e-toggle-content') as HTMLElement;
                expect(toggleContent.style.display).toBe('block');

                // Update simple properties of childBlock
                const result = editor.updateBlock('childBlock', {
                    cssClass: 'new-class',
                    indent: 2
                });

                expect(result).toBe(true);

                const updatedBlock = editor.getBlock('childBlock');
                expect(updatedBlock.cssClass).toBe('new-class');
                expect(updatedBlock.indent).toBe(2);

                //DOM
                const blockElement = editor.blockManager.getBlockElementById('childBlock');
                const contentElement = getBlockContentElement(blockElement);
                expect(blockElement.classList.contains('new-class')).toBe(true);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('40');
                done()
            }, 300);
        });

        it('should update content properties', () => {
            // Update content of paragraph1
            const result = editor.updateBlock('paragraph1', {
                content: [
                    { id: 'content1', content: 'Updated content' }
                ]
            });

            expect(result).toBe(true);

            // Verify blocks array was updated
            const updatedBlock = editor.getBlock('paragraph1');
            expect(updatedBlock.content[0].content).toBe('Updated content');

            //DOM
            const blockElement = editor.blockManager.getBlockElementById('paragraph1');
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement.textContent).toBe('Updated content');
        });

        it('should replace whole content if id not specified', () => {
            // Update content of paragraph1
            const result = editor.updateBlock('paragraph1', {
                content: [
                    { content: 'Updated content', contentType: ContentType.Link, properties: { url: 'http://example.com' } }
                ]
            });

            expect(result).toBe(true);

            // Verify blocks array was updated
            const updatedBlock = editor.getBlock('paragraph1');
            expect(updatedBlock.content[0].id).not.toBe('');
            expect(updatedBlock.content[0].content).toBe('Updated content');
            expect(updatedBlock.content[0].contentType).toBe(ContentType.Link); // Should have updated type
            expect((updatedBlock.content[0].properties as ILinkContentSettings).url).toBe('http://example.com');

            //DOM
            const blockElement = editor.blockManager.getBlockElementById('paragraph1');
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement.querySelector('a').id).toBe(updatedBlock.content[0].id);
            expect(contentElement.querySelector('a').textContent).toBe('Updated content');
            expect(contentElement.querySelector('a').getAttribute('href')).toBe('http://example.com');
        });

        it('should merge styles in content model', () => {
            // Update styles of paragraph1's content
            const result = editor.updateBlock('paragraph1', {
                content: [
                    { id: 'content1', properties: { styles: { bold: true, italic: false } } }
                ]
            });

            expect(result).toBe(true);

            // Verify blocks array was updated
            const updatedBlock = editor.getBlock('paragraph1');
            expect((updatedBlock.content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((updatedBlock.content[0].properties as BaseStylesProp).styles.italic).toBeUndefined();

            //DOM
            const blockElement = editor.blockManager.getBlockElementById('paragraph1');
            const contentElement = getBlockContentElement(blockElement);
            expect(contentElement.querySelector('strong').id).toBe('content1');
            expect(contentElement.querySelector('strong').textContent).toBe('Initial content');
            expect(contentElement.querySelector('em')).toBeNull();
        });

        it('should handle null values properly', () => {
            // Test with null blockId
            const result1 = editor.updateBlock(null, { cssClass: 'new-class' });
            expect(result1).toBe(false);

            // Test with valid blockId but undefined properties
            const result2 = editor.updateBlock('paragraph1', undefined);
            expect(result2).toBe(false);

            const result3 = editor.updateBlock('nonExistentId', {
                blockType: BlockType.Heading,
                properties: {
                    level: 1
                },
            });
            expect(result3).toBe(false);
        });
    });

    describe('Inline Toolbar methods', () => {
        it('executeToolbarAction method', () => {
            // Select the content
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            editor.setSelection(contentElement.id, 0, 15);

            // Execute bold command
            editor.executeToolbarAction(CommandName.Bold);

            // Check if formatting is applied in the model
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);

            // Check DOM update (should have wrapped content in <strong> tag)
            const strongElement = contentElement.querySelector('strong');
            expect(strongElement).not.toBeNull();
            expect(strongElement.textContent).toBe('Initial content');
        });

        it('executeToolbarAction should handle invalid values', () => {
            // Select the content
            spyOn(editor.blockManager.formattingAction, 'execCommand').and.callThrough();

            // Execute bold command
            (editor.executeToolbarAction as any)('invalid');

            expect(editor.blockManager.formattingAction.execCommand).not.toHaveBeenCalled();
        });

        it('enableDisableToolbarItems method - DISABLE', () => {
            const popup = document.querySelector('.e-blockeditor-inline-toolbar');

            editor.disableToolbarItems(['bold', 'italic']);

            expect(popup.querySelector('#bold').getAttribute('aria-disabled')).toBe('true');
            expect(popup.querySelector('#italic').getAttribute('aria-disabled')).toBe('true');
        });

        it('enableDisableToolbarItems method - ENABLE', () => {
            const popup = document.querySelector('.e-blockeditor-inline-toolbar');

            editor.enableToolbarItems(['bold', 'italic']);

            expect(popup.querySelector('#bold').getAttribute('aria-disabled')).toBe('false');
            expect(popup.querySelector('#italic').getAttribute('aria-disabled')).toBe('false');
        });

        it('enableDisableToolbarItems method - DISABLE - SINGLE ITEM', () => {
            const popup = document.querySelector('.e-blockeditor-inline-toolbar');

            editor.disableToolbarItems('bold');

            expect(popup.querySelector('#bold').getAttribute('aria-disabled')).toBe('true');
        });

        it('enableDisableToolbarItems method - ENABLE - SINGLE ITEM', () => {
            const popup = document.querySelector('.e-blockeditor-inline-toolbar');

            editor.enableToolbarItems('bold');

            expect(popup.querySelector('#bold').getAttribute('aria-disabled')).toBe('false');
        });
    });

    describe('setSelection and setCursorPosition methods', () => {
        it('should set selection for a content element', (done) => {
            // Set selection for the content
            editor.setSelection('content1', 3, 7);

            const selection = window.getSelection();
            expect(selection.toString()).toBe('tial');
            done();
        });

        it('should set cursor position in a block', (done) => {
            // Set cursor position
            editor.setCursorPosition('paragraph1', 3);

            const selection = window.getSelection();
            expect(selection.rangeCount).toBe(1);
            const range = selection.getRangeAt(0);
            expect(range.startOffset).toBe(3);
            expect(range.collapsed).toBe(true);
            done();
        });

        it('setSelection should handle invalid content element', (done) => {
            // Set selection for the content
            editor.setSelection('fake', 0, 0);

            const selection = window.getSelection();
            expect(selection.toString()).toBe('');
            done();
        });

        it('setCursorPosition should handle invalid block element', (done) => {
            // Set selection for the content
            editor.setCursorPosition('invalid', 3);
            done();
        });
    });

    describe('getSelectedBlocks method', () => {
        it('should return selected blocks', (done) => {
            setTimeout(() => {
                // Add an extra block
                editor.addBlock({
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'content2', contentType: ContentType.Text, content: 'Second paragraph' }]
                }, 'paragraph1', true);

                // Create a range to select both blocks
                const range = document.createRange();
                const startNode = editorElement.querySelector('#paragraph1');
                const endNode = editorElement.querySelector('#paragraph2');
                range.setStartBefore(startNode);
                range.setEndAfter(endNode);

                // Set the selection
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Get selected blocks
                const selectedBlocks = editor.getSelectedBlocks();

                expect(selectedBlocks.length).toBe(2);
                expect(selectedBlocks[0].id).toBe('paragraph1');
                expect(selectedBlocks[1].id).toBe('paragraph2');
                done();
            });
        });

        it('should return selected blocks properly inside children type blocks', (done) => {
            setTimeout(() => {
                const parentBlock: BlockModel = {
                    id: 'toggle-block',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ contentType: ContentType.Text, content: 'Click here to expand' }],
                    properties: {
                        isExpanded: true,
                        children: [
                            {
                                id: 'toggleChild1',
                                parentId: 'toggle-block',
                                blockType: BlockType.BulletList,
                                content: [{ id: 'toggleChildContent', contentType: ContentType.Text, content: 'toggle content' }],
                            },
                            {
                                id: 'toggleChild2',
                                blockType: BlockType.Paragraph,
                                content: [{ id: 'content2', contentType: ContentType.Text, content: 'Second paragraph' }]
                            }
                        ]
                    }
                };
                editor.addBlock(parentBlock);

                // Create a range to select both blocks
                const range = document.createRange();
                const startNode = editorElement.querySelector('#toggleChild1');
                const endNode = editorElement.querySelector('#toggleChild2');
                range.setStartBefore(startNode);
                range.setEndAfter(endNode);

                // Set the selection
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Get selected blocks
                const selectedBlocks = editor.getSelectedBlocks();

                expect(selectedBlocks.length).toBe(2);
                expect(selectedBlocks[0].id).toBe('toggleChild1');
                expect(selectedBlocks[1].id).toBe('toggleChild2');
                done();
            });
        });

        it('should not select a block if it is not in editor', (done) => {
            setTimeout(() => {
                // Add an extra block
                editor.addBlock({
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'content2', contentType: ContentType.Text, content: 'Second paragraph' }]
                }, 'paragraph1', true);

                // Create a range to select both blocks
                const range = document.createRange();
                const startNode = editorElement.querySelector('#paragraph1');
                const endNode = editorElement.querySelector('#paragraph2');
                range.setStartBefore(startNode);
                range.setEndAfter(endNode);

                // Set the selection
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Make it invalid
                editorElement.querySelector('#paragraph2').id = 'invalid';

                // Get selected blocks
                const selectedBlocks = editor.getSelectedBlocks();

                expect(selectedBlocks.length).toBe(1);
                expect(selectedBlocks[0].id).toBe('paragraph1');
                done();
            });
        });
    });

    describe('selectBlock and selectAllBlocks methods', () => {
        it('should select a specific block', (done) => {
            setTimeout(() => {
                // Add an extra block
                editor.addBlock({
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'content2', contentType: ContentType.Text, content: 'Second paragraph' }]
                }, 'paragraph1', true);

                // Select the first block
                editor.selectBlock('paragraph1');

                // Check if selection is applied
                const selection = window.getSelection();
                expect(selection.toString()).toBe('Initial content');
                done();
            });
        });

        it('should select all blocks', (done) => {
            setTimeout(() => {
                // Add an extra block
                editor.addBlock({
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'content2', contentType: ContentType.Text, content: 'Second paragraph' }]
                }, 'paragraph1', true);

                // Select all blocks
                editor.selectAllBlocks();

                // Check if selection is applied to all content
                const selection = window.getSelection();
                expect(selection.toString().indexOf('Initial content')).not.toBe(-1);
                expect(selection.toString().indexOf('Second paragraph')).not.toBe(-1);
                done();
            });
        });

        it('should handle null values', (done) => {
            // Set selection for the content
            editor.selectBlock('invalid');
            done();
        });
    });

    describe('focusIn and focusOut methods', () => {
        it('should focus in and out of the editor', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            // Focus in
            editor.focusIn();

            // Check that editor has focus
            expect(editor.blockManager.currentFocusedBlock.id).toBe(blockElement.id);

            // Focus out again
            editor.focusOut();

            // Check that editor doesn't have focus
            expect(editor.blockManager.currentFocusedBlock).toBeNull();
        });
    });

    describe('getBlockCount method', () => {
        it('should return the correct number of blocks', (done) => {
            setTimeout(() => {
                expect(editor.getBlockCount()).toBe(1);

                // Add a new block
                editor.addBlock({
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'content2', contentType: ContentType.Text, content: 'New paragraph' }]
                }, 'paragraph1', true);

                expect(editor.getBlockCount()).toBe(2);

                // Remove a block
                editor.removeBlock('paragraph1');

                expect(editor.getBlockCount()).toBe(1);
                done();
            });
        });
    });

    describe('getDataAsJson method', () => {
        it('should return all blocks as JSON when no blockId is provided', (done) => {
            setTimeout(() => {
                // Add another block
                editor.addBlock({
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: {
                        level: 1
                    },
                    content: [{ id: 'headingContent', contentType: ContentType.Text, content: 'Heading' }]
                }, 'paragraph1', false);

                const json: BlockModel[] = editor.getDataAsJson() as BlockModel[];

                expect(Array.isArray(json)).toBe(true);
                expect(json.length).toBe(2);
                expect(json[0].id).toBe('heading1');
                expect(json[1].id).toBe('paragraph1');
                done();
            });
        });

        it('should return a specific block as JSON when blockId is provided', () => {
            const json: BlockModel = editor.getDataAsJson('paragraph1') as BlockModel;

            expect(json).not.toBeNull();
            expect(json.id).toBe('paragraph1');
            expect(json.blockType).toBe(BlockType.Paragraph);
            expect(json.content[0].content).toBe('Initial content');
        });

        it('should return null for non-existent block ID', () => {
            const json = editor.getDataAsJson('nonExistentId');

            expect(json).toBeNull();
        });
    });

    describe('getDataAsHtml method', function () {
        it('should return all blocks as HTML when no blockId is provided', function (done) {
            setTimeout(function () {
                editor.addBlock({
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: {
                        level: 1
                    },
                    content: [{ id: 'headingContent', contentType: ContentType.Text, content: 'Heading' }]
                }, 'paragraph1', false);
                const html = editor.getDataAsHtml();
                expect(html).toBe('<h1>Heading</h1><p>Initial content</p>');
                done();
            });
        });

        it('should return a specific block as html when blockId is provided', function () {
            const html = editor.getDataAsHtml('paragraph1');
            expect(html).not.toBeNull();
            expect(html).toBe('<p>Initial content</p>');
        });

        it('should return null for non-existent block ID', function () {
            const html = editor.getDataAsHtml('nonExistentId');
            expect(html).toBeNull();
        });

        it('should render quote blocks correctly', function (done) {
            setTimeout(function () {
                editor.addBlock({
                    id: 'quote1',
                    blockType: BlockType.Quote,
                    content: [{ id: 'quoteContent', contentType: ContentType.Text, content: 'Important quote' }]
                }, 'paragraph1', true);

                const html = editor.getDataAsHtml('quote1');
                expect(html).toBe('<blockquote>Important quote</blockquote>');
                done();
            });
        });

        it('should render divider blocks correctly', function (done) {
            setTimeout(function () {
                editor.addBlock({
                    id: 'divider1',
                    blockType: BlockType.Divider
                }, 'paragraph1', true);

                const html = editor.getDataAsHtml('divider1');
                expect(html).toBe('<hr />');
                done();
            });
        });

        it('should render code blocks correctly', function (done) {
            setTimeout(function () {
                editor.addBlock({
                    id: 'code1',
                    blockType: BlockType.Code,
                    content: [{ id: 'codeContent', contentType: ContentType.Text, content: 'function test() { return true; }' }]
                }, 'paragraph1', true);

                const html = editor.getDataAsHtml('code1');
                expect(html).toBe('<pre><code>function test() { return true; }</code></pre>');
                done();
            });
        });

        it('should render image blocks correctly', function (done) {
            setTimeout(function () {
                editor.addBlock({
                    id: 'image1',
                    blockType: BlockType.Image,
                    properties: {
                        src: 'https://example.com/image.jpg',
                        altText: 'Sample image'
                    }
                }, 'paragraph1', true);

                const html = editor.getDataAsHtml('image1');
                expect(html).toBe('<img src=\'https://example.com/image.jpg\' alt=\'Sample image\' />');
                done();
            });
        });

        it('should not render image blocks with empty src', function (done) {
            setTimeout(function () {
                editor.addBlock({
                    id: 'emptyImage',
                    blockType: BlockType.Image,
                    properties: {
                        src: '',
                        altText: 'Empty image'
                    }
                }, 'paragraph1', true);

                const html = editor.getDataAsHtml('emptyImage');
                expect(html).toBe('');
                done();
            });
        });

        it('should render callout blocks correctly', function (done) {
            setTimeout(function () {
                const calloutBlock: BlockModel = {
                    id: 'callout1',
                    blockType: BlockType.Callout,
                    content: [{ id: 'calloutTitle', contentType: ContentType.Text, content: 'Callout Title' }],
                    properties: {
                        children: [{
                            id: 'calloutPara',
                            blockType: BlockType.Paragraph,
                            content: [{ id: 'calloutContent', contentType: ContentType.Text, content: 'Callout content' }]
                        }]
                    }
                };

                editor.addBlock(calloutBlock, 'paragraph1', true);

                const html = editor.getDataAsHtml('callout1');
                expect(html).toBe('<div class="callout"><p>Callout content</p></div>');
                done();
            });
        });

        it('should render collapsible blocks correctly', function (done) {
            setTimeout(function () {
                const toggleBlock: BlockModel = {
                    id: 'toggle1',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ id: 'toggleTitle', contentType: ContentType.Text, content: 'Toggle Title' }],
                    properties: {
                        children: [{
                            id: 'togglePara',
                            blockType: BlockType.Paragraph,
                            content: [{ id: 'toggleContent', contentType: ContentType.Text, content: 'Toggle content' }]
                        }]
                    }
                };

                editor.addBlock(toggleBlock, 'paragraph1', true);

                const html = editor.getDataAsHtml('toggle1');
                expect(html).toBe('<div class="collapsible">Toggle Title <p>Toggle content</p></div>');
                done();
            });
        });

        it('should render collapsible heading blocks correctly', function (done) {
            setTimeout(function () {
                const toggleHeadingBlock: BlockModel = {
                    id: 'toggleHeading1',
                    blockType: BlockType.CollapsibleHeading,
                    content: [{ id: 'toggleHeadingTitle', contentType: ContentType.Text, content: 'Toggle Heading' }],
                    properties: {
                        level: 1,
                        children: [{
                            id: 'toggleHeadingPara',
                            blockType: BlockType.Paragraph,
                            content: [{ id: 'toggleHeadingContent', contentType: ContentType.Text, content: 'Toggle heading content' }]
                        }]
                    },
                };

                editor.addBlock(toggleHeadingBlock, 'paragraph1', true);

                const html = editor.getDataAsHtml('toggleHeading1');
                expect(html).toBe('<div class="collapsible">Toggle Heading <p>Toggle heading content</p></div>');
                done();
            });
        });

        it('should render links correctly in HTML', function (done) {
            setTimeout(function () {
                const linkBlock: BlockModel = {
                    id: 'link1',
                    blockType: BlockType.Paragraph,
                    content: [{
                        id: 'linkContent',
                        contentType: ContentType.Link,
                        content: 'Link text',
                        properties: {
                            url: 'https://example.com'
                        }
                    }]
                };

                editor.addBlock(linkBlock, 'paragraph1', true);

                const html = editor.getDataAsHtml('link1');
                expect(html).toBe('<p><a href="https://example.com" target="_blank">Link text</a></p>');
                done();
            });
        });

        it('should render bullet list blocks correctly', function (done) {
            setTimeout(function () {
                editor.addBlock({
                    id: 'bulletlist1',
                    blockType: BlockType.BulletList,
                    content: [{ id: 'bulletContent1', contentType: ContentType.Text, content: 'Bullet item 1' }]
                }, 'paragraph1', true);

                editor.addBlock({
                    id: 'bulletlist2',
                    blockType: BlockType.BulletList,
                    content: [{ id: 'bulletContent2', contentType: ContentType.Text, content: 'Bullet item 2' }]
                }, 'bulletlist1', true);

                const html = editor.getDataAsHtml();
                expect(html.includes('<ul><li>Bullet item 1</li><li>Bullet item 2</li></ul>')).toBe(true);
                done();
            });
        });

        it('should render numbered list blocks correctly', function (done) {
            setTimeout(function () {

                editor.addBlock({
                    id: 'numberedlist1',
                    blockType: BlockType.NumberedList,
                    content: [{ id: 'numberedContent1', contentType: ContentType.Text, content: 'Number item 1' }]
                });

                editor.addBlock({
                    id: 'numberedlist2',
                    blockType: BlockType.NumberedList,
                    content: [{ id: 'numberedContent2', contentType: ContentType.Text, content: 'Number item 2' }]
                }, 'numberedlist1', true);

                editor.removeBlock('paragraph1');

                const html = editor.getDataAsHtml();
                expect(html).toBe('<ol><li>Number item 1</li><li>Number item 2</li></ol>');
                done();
            });
        });

        it('should render formatted text correctly in HTML', function (done) {
            setTimeout(function () {
                const formattedBlock: BlockModel = {
                    id: 'formatted1',
                    blockType: BlockType.Paragraph,
                    content: [{
                        id: 'formattedContent',
                        contentType: ContentType.Text,
                        content: 'Formatted text',
                        properties: {
                            styles: { bold: true, italic: true, underline: true }
                        }
                    }]
                };

                editor.addBlock(formattedBlock, 'paragraph1', true);

                const html = editor.getDataAsHtml('formatted1');
                expect(html).toBe('<p><u><em><strong>Formatted text</strong></em></u></p>');
                done();
            });
        });
    });

    describe('getCurrentFocusedBlockModel method', () => {
        it('should return the current focused block model', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);

                const focusedBlockModel = editor.getCurrentFocusedBlockModel();
                expect(focusedBlockModel).not.toBeNull();
                expect(focusedBlockModel.id).toBe('paragraph1');
                expect(focusedBlockModel.blockType).toBe(BlockType.Paragraph);
                done();
            });
        });

        it('should return null when no block is focused', (done) => {
            setTimeout(() => {
                editor.blockManager.currentFocusedBlock = null;
                const focusedBlockModel = editor.getCurrentFocusedBlockModel();
                expect(focusedBlockModel).toBeNull();
                done();
            });
        });
    });

    describe('updateBlock method with parent blocks', () => {
        it('should update callout block properly', (done) => {
            setTimeout(() => {
                const parentBlock: BlockModel = {
                    id: 'callout1',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'calloutChild1',
                            blockType: BlockType.Paragraph,
                            content: [{ id: 'calloutChildContent', contentType: ContentType.Text, content: 'Callout content' }],
                            parentId: 'callout1'
                        }]
                    }
                };
                editor.addBlock(parentBlock);

                const updateResult = editor.updateBlock('calloutChild1', {
                    content: [{ id: 'calloutChildContent', contentType: ContentType.Text, content: 'Updated callout content' }]
                });

                expect(updateResult).toBe(true);

                const updatedBlock = editor.getBlock('calloutChild1');
                expect(updatedBlock).not.toBeNull();
                expect(updatedBlock.content[0].content).toBe('Updated callout content');

                const updatedElement = editorElement.querySelector('#calloutChild1');
                expect(updatedElement).not.toBeNull();
                const contentElement = getBlockContentElement(updatedElement as HTMLElement);
                expect(contentElement.textContent).toBe('Updated callout content');
                done();
            });
        });

        it('should update collapsible block properly', (done) => {
            setTimeout(() => {
                const parentBlock: BlockModel = {
                    id: 'toggle-block',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ contentType: ContentType.Text, content: 'Click here to expand' }],
                    properties: {
                        children: [{
                            id: 'toggleChild1',
                            parentId: 'toggle-block',
                            blockType: BlockType.BulletList,
                            content: [{ id: 'toggleChildContent', contentType: ContentType.Text, content: 'toggle content' }],
                        }]
                    }
                };
                editor.addBlock(parentBlock);

                const updateResult = editor.updateBlock('toggleChild1', {
                    indent: 1,
                });

                expect(updateResult).toBe(true);

                const updatedBlock = editor.getBlock('toggleChild1');
                expect(updatedBlock).not.toBeNull();
                expect(updatedBlock.indent).toBe(1);

                const updatedElement = editorElement.querySelector('#toggleChild1') as HTMLElement;
                expect(updatedElement).not.toBeNull();
                expect(updatedElement.style.getPropertyValue('--block-indent')).toBe('20');
                done();
            });
        });
    });

    describe('getRange and selectRange methods', () => {
        it('should get and set the range properly', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                editor.setSelection('content1', 0, 5);

                const range = editor.getRange();
                expect(range).not.toBeNull();
                expect(range.toString()).toBe('Initi');

                const newRange = document.createRange();
                const contentElement = blockElement.querySelector('#content1');
                newRange.setStart(contentElement.firstChild, 6);
                newRange.setEnd(contentElement.firstChild, 10);

                editor.selectRange(newRange);

                const newSelection = window.getSelection();
                expect(newSelection.toString()).toBe('l co');
                done();
            });
        });

        it('should handle null selection properly', function (done) {
            setTimeout(function () {
                var originalGetSelection = window.getSelection;
                window.getSelection = function () { return null; };
                expect(editor.selectRange(null)).toBeUndefined();
                window.getSelection = originalGetSelection;
                done();
            });
        });
    });

    describe('renderTemplate method', () => {
        it('should render a custom template for a block', (done) => {
            setTimeout(() => {
                const customBlock: BlockModel = {
                    id: 'templateBlock',
                    blockType: 'Template',
                    template: '<div class="custom-template">Template content</div>'
                };

                editor.addBlock(customBlock, 'paragraph1');

                const blockElement = editorElement.querySelector('#templateBlock') as HTMLElement;

                setTimeout(() => {
                    const customTemplateElement = blockElement.querySelector('.custom-template');
                    expect(customTemplateElement).not.toBeNull();
                    expect(customTemplateElement.textContent).toBe('Template content');
                    done();
                }, 100);
            });
        });
    });

    describe('print method', () => {
        it('should call print functionality', (done) => {
            setTimeout(() => {
                const originalOpen = window.open;
                const mockWindow = {
                    document: {
                        write: jasmine.createSpy('write'),
                        close: jasmine.createSpy('close')
                    },
                    focus: jasmine.createSpy('focus'),
                    print: jasmine.createSpy('print'),
                    close: jasmine.createSpy('close'),
                    resizeTo: jasmine.createSpy('resizeTo')
                };

                spyOn(window, 'open').and.returnValue(mockWindow as any);

                // Call print method
                editor.print();

                // Verify window.open was called
                expect(window.open).toHaveBeenCalled();

                // Restore original function
                window.open = originalOpen;
                done();
            });
        });
    });

    describe('renderBlocksFromJson method', () => {

        it('should render blocks from JSON array', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - JSON array of blocks
            const jsonBlocks = [
                {
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: {
                        level: 1
                    },
                    content: [{ contentType: ContentType.Text, content: 'New Heading' }]
                },
                {
                    id: 'paragraph1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'New Paragraph' }]
                }
            ];

            // Execute
            const result = editor.renderBlocksFromJson(jsonBlocks);

            // Assert
            expect(result).toBe(true);
            expect(editor.blocks.length).toBe(3); // Initial + 2 new blocks
            expect(editor.blocks[1].blockType).toBe(BlockType.Heading);
            expect((editor.blocks[1].properties as IHeadingBlockSettings).level).toBe(1);
            expect(editor.blocks[1].content[0].content).toBe('New Heading');
            expect(editor.blocks[2].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[2].content[0].content).toBe('New Paragraph');

            // Check DOM update
            const blockElements = editorElement.querySelectorAll('.e-block');
            expect(blockElements.length).toBe(3);
            expect(editorElement.querySelector('#heading1')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph1')).not.toBeNull();
        });

        it('should render blocks from JSON string', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - JSON string
            const jsonString = JSON.stringify([
                {
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: {
                        level: 1
                    },
                    content: [{ contentType: ContentType.Text, content: 'New Heading' }]
                }
            ]);

            const result = editor.renderBlocksFromJson(jsonString);

            expect(result).toBe(true);
            expect(editor.blocks.length).toBe(2); // Initial + new block
            expect(editor.blocks[1].blockType).toBe(BlockType.Heading);
            expect((editor.blocks[1].properties as IHeadingBlockSettings).level).toBe(1);

            const headingBlock = editorElement.querySelector('#heading1');
            expect(headingBlock).not.toBeNull();
            expect(headingBlock.textContent).toBe('New Heading');
        });

        it('should render blocks from object with blocks property', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - Object with blocks property
            const jsonObject = {
                blocks: [
                    {
                        id: 'bulletlist',
                        blockType: BlockType.BulletList,
                        content: [{ contentType: ContentType.Text, content: 'List Item' }]
                    }
                ]
            };

            const result = editor.renderBlocksFromJson(jsonObject);

            expect(result).toBe(true);
            expect(editor.blocks.length).toBe(2); // Initial + new block
            expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);

            const listBlock = editorElement.querySelector('#bulletlist');
            expect(listBlock).not.toBeNull();
            expect(listBlock.textContent).toBe('List Item');
        });

        it('should render a single block object', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - Single block object
            const singleBlock = {
                blockType: BlockType.Divider
            };

            // Execute
            const result = editor.renderBlocksFromJson(singleBlock);

            // Assert
            expect(result).toBe(true);
            expect(editor.blocks.length).toBe(2); // Initial + divider
            expect(editor.blocks[1].blockType).toBe(BlockType.Divider);

            // Check DOM update
            const dividerBlock = editorElement.querySelector('.e-divider-block');
            expect(dividerBlock).not.toBeNull();
        });

        it('should replace all blocks when replace is true', (done) => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup
            const newBlocks = [
                {
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: {
                        level: 1
                    },
                    content: [{ contentType: ContentType.Text, content: 'Replace All' }]
                }
            ];

            // Execute
            const result = editor.renderBlocksFromJson(newBlocks, true);

            setTimeout(() => {
                // Assert
                expect(result).toBe(true);
                expect(editor.blocks.length).toBe(1); // Only the new block
                expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                expect((editor.blocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Replace All');

                // Check DOM update - only new block should exist
                const blockElements = editorElement.querySelectorAll('.e-block');
                expect(blockElements.length).toBe(1);
                expect(editorElement.querySelector('#heading1')).not.toBeNull();
                done();
            }, 200);
        });

        it('should replace with default empty block when empty array provided with replace=true', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - Empty blocks array
            const emptyBlocks: any = [];

            // Spy on internal methods
            spyOn(editor.blockManager.blockCommand, 'createDefaultEmptyBlock').and.callThrough();

            // Execute
            const result = editor.renderBlocksFromJson(emptyBlocks, true);

            // Assert
            expect(result).toBe(true);
            expect(editor.blockManager.blockCommand.createDefaultEmptyBlock).toHaveBeenCalledWith(true);
            expect(editor.blocks.length).toBe(1); // Default empty block
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);

            expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
        });

        it('should insert blocks at specified target block', () => {
            // Setup - Add a second block to insert between
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block') as HTMLElement);
            editor.addBlock({
                id: 'paragraph2',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content2', contentType: ContentType.Text, content: 'Second paragraph' }
                ]
            }, 'paragraph1', true);

            const newBlocks = [
                {
                    id: 'heading2',
                    blockType: BlockType.Heading,
                    properties: { level: 2 },
                    content: [{ contentType: ContentType.Text, content: 'Inserted Heading' }]
                }
            ];

            // Execute - Insert after first paragraph
            const result = editor.renderBlocksFromJson(newBlocks, false, 'paragraph1');

            // Assert
            expect(result).toBe(true);
            expect(editor.blocks.length).toBe(3); // Two original + one inserted
            expect(editor.blocks[1].blockType).toBe(BlockType.Heading);
            expect((editor.blocks[1].properties as IHeadingBlockSettings).level).toBe(2);

            // Check DOM order
            const blockElements = editorElement.querySelectorAll('.e-block');
            expect(blockElements[0].id).toBe('paragraph1');
            expect(blockElements[1].id).toBe('heading2');
            expect(blockElements[2].id).toBe('paragraph2');
        });

        it('should insert blocks after focused block if no target provided', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block') as HTMLElement);
            // Setup - Add a second block and focus it
            editor.addBlock({
                id: 'paragraph2',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content2', contentType: ContentType.Text, content: 'Second paragraph' }
                ]
            }, 'paragraph1', true);

            const newBlocks = [
                {
                    id: 'heading2',
                    blockType: BlockType.Heading,
                    properties: { level: 2 },
                    content: [{ contentType: ContentType.Text, content: 'After Focused' }]
                }
            ];

            // Execute - No target specified, should insert after focused block
            const result = editor.renderBlocksFromJson(newBlocks);

            // Assert
            expect(result).toBe(true);
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[2].blockType).toBe(BlockType.Heading);
            expect((editor.blocks[2].properties as IHeadingBlockSettings).level).toBe(2);

            // Check DOM order
            const blockElements = editorElement.querySelectorAll('.e-block');
            expect(blockElements[0].id).toBe('paragraph1');
            expect(blockElements[1].id).toBe('paragraph2');
            expect(blockElements[2].id).toBe('heading2');
        });

        it('should insert blocks at the end if no focus and no target', () => {
            // Setup - Clear focus
            editor.blockManager.currentFocusedBlock = null;

            const newBlocks = [
                {
                    id: 'heading2',
                    blockType: BlockType.Heading,
                    properties: { level: 2 },
                    content: [{ contentType: ContentType.Text, content: 'At End' }]
                }
            ];

            // Execute - No target, no focus
            const result = editor.renderBlocksFromJson(newBlocks);

            // Assert
            expect(result).toBe(true);
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].blockType).toBe(BlockType.Heading)
            expect((editor.blocks[1].properties as IHeadingBlockSettings).level).toBe(2);

            // Check DOM order
            expect(editorElement.querySelector('#heading2')).not.toBeNull();
        });

        it('should handle error when invalid JSON string is provided', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - Invalid JSON string
            const invalidJson = '{ this is not valid JSON }';

            // Spy on console.error
            const spyconsole = spyOn(console, 'error').and.callFake(() => { });

            // Execute
            const result = editor.renderBlocksFromJson(invalidJson);

            // Assert
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Error rendering blocks from JSON:', jasmine.any(Error));
            spyconsole.calls.reset();
            expect(editor.blocks.length).toBe(1); // Should not change blocks
        });

        it('should handle error when providing unsupported object format', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - Object without type or blocks property
            const invalidObject: any = {
                something: 'else',
                notBlocks: []
            };

            // Execute
            const result = editor.renderBlocksFromJson(invalidObject);

            // Assert
            expect(result).toBe(false);
            expect(editor.blocks.length).toBe(1); // Original block remains
        });

        it('should set focus to last inserted block', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup
            const newBlocks = [
                {
                    blockType: BlockType.Heading,
                    properties: {
                        level: 1
                    },
                    content: [{ contentType: ContentType.Text, content: 'First' }]
                },
                {
                    blockType: BlockType.Heading,
                    properties: { level: 2 },
                    content: [{ contentType: ContentType.Text, content: 'Second' }]
                }
            ];

            // Execute
            editor.renderBlocksFromJson(newBlocks);

            // Assert
            const lastBlock = editorElement.querySelector('.e-heading2-block');
        });

        it('should return false when rendering empty blocks array without replace', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            // Setup - Empty blocks array
            const emptyBlocks: any = [];

            // Execute
            const result = editor.renderBlocksFromJson(emptyBlocks);

            // Assert
            expect(result).toBe(false);
            expect(editor.blocks.length).toBe(1); // Original block remains
        });
    });

    describe('parseHtmlToBlocks method', () => {

        it('should parse a simple paragraph block (P)', () => {
            const html = '<p>This is a plain paragraph.</p>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(blocks[0].content.length).toBe(1);
            expect(blocks[0].content[0].contentType).toBe(ContentType.Text);
            expect(blocks[0].content[0].content).toBe('This is a plain paragraph.');
        });

        it('should parse an H1 heading block', () => {
            const html = '<h1>Main Heading</h1>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Heading); // Generic Heading type
            const props = blocks[0].properties as IHeadingBlockSettings;
            expect(props).toBeDefined();
            expect(props.level).toBe(1);
            expect(blocks[0].content[0].content).toBe('Main Heading');
        });

        it('should parse multiple paragraph blocks', () => {
            const html = '<p>First para.</p><p>Second para.</p>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(2);
            expect(blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(blocks[0].content[0].content).toBe('First para.');
            expect(blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(blocks[1].content[0].content).toBe('Second para.');
        });

        it('should parse a paragraph with bold and italic text', () => {
            const html = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(blocks[0].content.length).toBe(5); // "This is ", "bold", " and ", "italic", " text."
            expect(blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect((blocks[0].content[1].properties as ITextContentSettings).styles).toEqual({ bold: true });
            expect(blocks[0].content[1].content).toBe('bold');
            expect(blocks[0].content[3].contentType).toBe(ContentType.Text);
            expect((blocks[0].content[3].properties as ITextContentSettings).styles).toEqual({ italic: true });
            expect(blocks[0].content[3].content).toBe('italic');
        });

        it('should parse a paragraph with a hyperlink', () => {
            const html = '<p>Visit <a href="https://example.com" target="_blank">Example</a> site.</p>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(blocks[0].content.length).toBe(3);
            expect(blocks[0].content[1].contentType).toBe(ContentType.Link);
            expect(blocks[0].content[1].content).toBe('Example');
            const linkProps = blocks[0].content[1].properties as ILinkContentSettings;
            expect(linkProps.url).toBe('https://example.com');
        });

        it('should parse an image block with src, altText', () => {
            const html = '<img src="/assets/image.png" alt="A test image" width="100px" height="50px">';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Image);
            const imgProps = blocks[0].properties as IImageBlockSettings;
            expect(imgProps.src).toContain('/assets/image.png');
            expect(imgProps.altText).toBe('A test image');
        });

        it('should parse a blockquote block', () => {
            const html = '<blockquote>This is a quote.</blockquote>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Quote);
            expect(blocks[0].content[0].content).toBe('This is a quote.');
        });

        it('should parse an unordered list (BulletList)', () => {
            const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(2);
            expect(blocks[0].blockType).toBe(BlockType.BulletList);
            expect(blocks[1].blockType).toBe(BlockType.BulletList);

            expect(blocks[0].content[0].content).toBe('Item 1');
            expect(blocks[1].content[0].content).toBe('Item 2');
        });

        it('should parse an ordered list (NumberedList)', () => {
            const html = '<ol><li>First item</li><li>Second item</li></ol>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(2);
            expect(blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(blocks[1].blockType).toBe(BlockType.NumberedList);

            expect(blocks[0].content[0].content).toBe('First item');
            expect(blocks[1].content[0].content).toBe('Second item');
        });

        it('should parse a code block (PRE element)', () => {
            const html = '<pre><code class="language-javascript">console.log("Hello, World!");</code></pre>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Code);
            const codeProps = blocks[0].properties as ICodeBlockSettings;
            expect(codeProps.language).toBe('javascript');
            expect(blocks[0].content[0].contentType).toBe(ContentType.Text);
            expect(blocks[0].content[0].content).toBe('console.log("Hello, World!");');
        });

        it('should parse a divider block (HR element)', () => {
            const html = '<hr>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Divider);
        });

        it('should parse a paragraph with an inline code snippet (CODE ContentType)', () => {
            const html = '<p>This is some <code class="e-content-code">inline code</code> in a paragraph.</p>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(blocks[0].content.length).toBe(3);
            expect(blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect((blocks[0].content[1].properties as ITextContentSettings).styles.inlineCode).toBe(true);
            expect(blocks[0].content[1].content).toBe('inline code');
        });

        it('should parse a paragraph with text color and background color', () => {
            const html = '<p><span style="color:red; background-color:yellow;">Colored Text</span></p>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(blocks[0].content[0].contentType).toBe(ContentType.Text);
            expect(blocks[0].content[0].content).toBe('Colored Text');
            const textProps = blocks[0].content[0].properties as ITextContentSettings;
            expect(textProps.styles).toEqual({ color: 'red', backgroundColor: 'yellow' });
        });

        it('should parse a complex structure with mixed block types and nested inline styles', () => {
            const html = `
            <h2>Section Title</h2>
            <p>A paragraph with <strong>bold and <em style="color:blue;">blue italic</em> text</strong></p>
            <hr>
            <ul class="my-list">
                <li>Item one</li>
                <li>Item two</li>
            </ul>
        `;
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(5);
            expect(blocks[0].blockType).toBe(BlockType.Heading);
            expect((blocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(blocks[0].content[0].content).toBe('Section Title');

            expect(blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(blocks[1].content.length).toBe(4); // "A paragraph with ", "bold and ", "blue italic", " text."
            expect(blocks[1].content[1].content).toBe('bold and ');
            expect((blocks[1].content[1].properties as ITextContentSettings).styles).toEqual({ bold: true });
            expect(blocks[1].content[2].content).toBe('blue italic');
            expect((blocks[1].content[2].properties as ITextContentSettings).styles).toEqual({ bold: true, italic: true, color: 'blue' });

            expect(blocks[2].blockType).toBe(BlockType.Divider);

            expect(blocks[3].blockType).toBe(BlockType.BulletList);
            expect(blocks[3].content[0].content).toBe('Item one');
            expect(blocks[4].blockType).toBe(BlockType.BulletList);
            expect(blocks[4].content[0].content).toBe('Item two');
        });

        it('should parse an empty HTML string as an empty array', () => {
            const html = '';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(0);
        });

        it('should parse HTML with only whitespace as an empty array', () => {
            const html = '   \n  \t   ';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(0);
        });

        it('should handle special characters and HTML entities in text content', () => {
            const html = '<p>&#x2014; Special &amp; characters &lt; here &#x201C;quoted&#x201D;</p>';
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(blocks[0].content[0].content).toBe('— Special & characters < here “quoted”'); // Expected decoded output
        });
    });

    describe('parseHtmlToBlocks method - Table Block', () => {

        it('should parse a basic table without header', () => {
            const html = `
            <table>
                <tr><td>Cell 1</td><td>Cell 2</td></tr>
                <tr><td>Cell 3</td><td>Cell 4</td></tr>
            </table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Table);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.enableHeader).toBe(false);
            expect(props.enableRowNumbers).toBe(true);
            expect(props.columns.length).toBe(2);
            expect(props.rows.length).toBe(2);

            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('Cell 1');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('Cell 4');
        });

        it('should parse table with <thead> as header row', () => {
            const html = `
            <table>
                <thead><tr><th>Header A</th><th>Header B</th></tr></thead>
                <tbody>
                    <tr><td>Data 1</td><td>Data 2</td></tr>
                </tbody>
            </table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.enableHeader).toBe(true);
            expect(props.columns[0].headerText).toBe('Header A');
            expect(props.columns[1].headerText).toBe('Header B');
            expect(props.rows.length).toBe(1); // only body rows
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('Data 1');
        });

        it('should handle empty cells gracefully', () => {
            const html = `<table><tr><td></td><td>   </td><td>Content</td></tr></table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const cellBlocks = (blocks[0].properties as ITableBlockSettings).rows[0].cells;
            expect(cellBlocks[0].blocks.length).toBe(1);
            expect(cellBlocks[0].blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(cellBlocks[0].blocks[0].content.length).toBe(0); // empty paragraph
            expect(cellBlocks[2].blocks[0].content[0].content).toBe('Content');
        });

        it('should normalize irregular row lengths by padding with empty cells', () => {
            const html = `
            <table>
                <tr><td>A1</td><td>A2</td></tr>
                <tr><td>B1</td></tr>
                <tr><td>C1</td><td>C2</td><td>C3</td></tr>
            </table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.columns.length).toBe(3);
            expect(props.rows.length).toBe(3);
            expect(props.rows[1].cells.length).toBe(3); // padded
            expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0); // empty
        });

        it('should parse nested blocks inside table cells (paragraphs, lists, etc.)', () => {
            const html = `
            <table>
                <tr>
                    <td><p>First para</p><ul><li>Item 1</li></ul></td>
                    <td>Simple text</td>
                </tr>
            </table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const cellBlocks = (blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks;
            expect(cellBlocks.length).toBe(2);
            expect(cellBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(cellBlocks[1].blockType).toBe(BlockType.BulletList);
        });

        it('should convert inline formatting inside cells (bold, italic, links)', () => {
            const html = `<table><tr><td>This is <strong>bold</strong> and <a href="https://example.com">link</a></td></tr></table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const content = (blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks[0].content;
            expect(content[0].content).toBe('This is ');
            expect(content[1].contentType).toBe(ContentType.Text);
            expect((content[1].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(content[2].content).toBe(' and ');
            expect(content[3].contentType).toBe(ContentType.Link);
            expect((content[3].properties as ILinkContentSettings).url).toBe('https://example.com');
        });

        it('should ignore row-number column if class e-row-number is present', () => {
            const html = `
            <table>
                <tr><td class="e-row-number">1</td><td>Real Data</td></tr>
            </table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.columns.length).toBe(1); // only real column
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('Real Data');
        });

        it('should return with no Table Block if no table found', function () {
            const html = "<div>No table here</div>";
            const blocks = editor.parseHtmlToBlocks(html);
            expect(blocks[0].blockType).not.toBe(BlockType.Table);
        });

        it('should handle table wrapped in div', () => {
            const html = `<div><table><tr><td>Hello</td></tr></table></div>`;
            const blocks = editor.parseHtmlToBlocks(html);
            expect(blocks.length).toBe(1);
            expect(blocks[0].blockType).toBe(BlockType.Table);
        });

        it('should handle colspan gracefully (flattened to single cell)', () => {
            const html = `<table><tr><td colspan="2">Wide Cell</td></tr><tr><td>A</td><td>B</td></tr></table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.columns.length).toBe(2);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('Wide Cell');
            expect(props.rows[1].cells.length).toBe(2);
        });

        it('should handle rowspan gracefully (cell duplicated in matrix)', () => {
            const html = `<table><tr><td rowspan="2">Tall</td><td>Top</td></tr><tr><td>Bottom</td></tr></table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.rows.length).toBe(2);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('Tall');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('Bottom');
        });

        it('should parse table with mixed <th> and <td> in body', () => {
            const html = `<table><tr><td>Normal</td><th>Header-like in body</th></tr></table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.enableHeader).toBe(false); // no real header
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('Header-like in body');
        });

        it('should handle table with only header row', () => {
            const html = `<table><thead><tr><th>Only Header</th></tr></thead></table>`;
            const blocks = editor.parseHtmlToBlocks(html);

            const props = blocks[0].properties as ITableBlockSettings;
            expect(props.enableHeader).toBe(true);
            expect(props.columns[0].headerText).toBe('Only Header');
            expect(props.rows.length).toBe(0); // no body rows
        });

        it('should handle completely empty table', () => {
            const html = `<table></table>`;
            const blocks = editor.parseHtmlToBlocks(html);
            expect(blocks.length).toBe(0);
        });
    });
});
