import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, BlockType, BuiltInToolbar, ContentType, getBlockContentElement, getBlockIndexById, getBlockModelById } from '../../src/index';
import { createEditor } from '../common/util.spec';

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
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'content1', type: ContentType.Text, content: 'Initial content' }
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
            const newBlock = {
                id: 'paragraph2',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content2', type: ContentType.Text, content: 'New content' }
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
            const newBlock = {
                id: 'heading1',
                type: BlockType.Heading1,
                content: [
                    { id: 'headingContent', type: ContentType.Text, content: 'New Heading' }
                ]
            };

            setTimeout(() => {
                editor.addBlock(newBlock, 'paragraph1', false);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].id).toBe('heading1');
                expect(editor.blocks[0].type).toBe(BlockType.Heading1);
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
            const newBlock = {
                id: 'paragraph2',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content2', type: ContentType.Text, content: 'Block to remove' }
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
            expect(block.type).toBe(BlockType.Paragraph);
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
                    type: BlockType.Heading1,
                    content: [{ id: 'headingContent', type: ContentType.Text, content: 'Heading' }]
                }, 'paragraph1', false);

                editor.addBlock({
                    id: 'paragraph2',
                    type: BlockType.Paragraph,
                    content: [{ id: 'content2', type: ContentType.Text, content: 'Last paragraph' }]
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
        it('should update block properties', () => {
            // Update the paragraph to heading
            const updateResult = editor.updateBlock('paragraph1', {
                type: BlockType.Heading2,
                content: [
                    { id: 'content1', type: ContentType.Text, content: 'Updated content' }
                ]
            });

            // Check update result
            expect(updateResult).toBe(true);

            // Check model update
            const updatedBlock = editor.getBlock('paragraph1');
            expect(updatedBlock.type).toBe(BlockType.Heading2);
            expect(updatedBlock.content[0].content).toBe('Updated content');

            // Check DOM update
            const blockElement = editorElement.querySelector('#paragraph1');
            expect(blockElement.getAttribute('data-block-type')).toBe(BlockType.Heading2);
            const contentElement = getBlockContentElement(blockElement as HTMLElement);
            expect(contentElement.tagName).toBe('H2');
            expect(contentElement.textContent).toBe('Updated content');
        });

        it('should return false when updating non-existent block', () => {
            const updateResult = editor.updateBlock('nonExistentId', {
                type: BlockType.Heading1
            });

            expect(updateResult).toBe(false);
        });
    });

    describe('Inline Toolbar methods', () => {
        it('executeToolbarAction method', () => {
            // Select the content
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);

            editor.setSelection(contentElement.id, 0, 15);

            // Execute bold command
            editor.executeToolbarAction(BuiltInToolbar.Bold);

            // Check if formatting is applied in the model
            expect(editor.blocks[0].content[0].styles.bold).toBe(true);

            // Check DOM update (should have wrapped content in <strong> tag)
            const strongElement = contentElement.querySelector('strong');
            expect(strongElement).not.toBeNull();
            expect(strongElement.textContent).toBe('Initial content');
        });

        it('executeToolbarAction should handle invalid values', () => {
            // Select the content
            spyOn(editor.formattingAction, 'execCommand').and.callThrough();

            // Execute bold command
            (editor.executeToolbarAction as any)('invalid');

            expect(editor.formattingAction.execCommand).not.toHaveBeenCalled();
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
                    type: BlockType.Paragraph,
                    content: [{ id: 'content2', type: ContentType.Text, content: 'Second paragraph' }]
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
                const parentBlock = {
                    id: 'toggle-block',
                    type: BlockType.ToggleParagraph,
                    content: [{ type: ContentType.Text, content: 'Click here to expand' }],
                    isExpanded: true,
                    children: [
                        {
                            id: 'toggleChild1',
                            parentId: 'toggle-block',
                            type: BlockType.BulletList,
                            content: [{ id: 'toggleChildContent', type: ContentType.Text, content: 'toggle content' }],
                        },
                        {
                            id: 'toggleChild2',
                            type: BlockType.Paragraph,
                            content: [{ id: 'content2', type: ContentType.Text, content: 'Second paragraph' }]
                        }
                    ]
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
                    type: BlockType.Paragraph,
                    content: [{ id: 'content2', type: ContentType.Text, content: 'Second paragraph' }]
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
                    type: BlockType.Paragraph,
                    content: [{ id: 'content2', type: ContentType.Text, content: 'Second paragraph' }]
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
                    type: BlockType.Paragraph,
                    content: [{ id: 'content2', type: ContentType.Text, content: 'Second paragraph' }]
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
            editor.setFocusToBlock(blockElement);
            // Focus out first
            editor.focusOut();

            // Check that editor doesn't have focus
            expect(document.activeElement).not.toBe(editor.blockWrapper);

            // Focus in
            editor.focusIn();

            // Check that editor has focus
            expect(document.activeElement).toBe(editor.blockWrapper);

            editor.setFocusToBlock(blockElement);

            // Focus out again
            editor.focusOut();

            // Check that editor doesn't have focus
            expect(document.activeElement).not.toBe(editor.blockWrapper);
        });
    });

    describe('getBlockCount method', () => {
        it('should return the correct number of blocks', (done) => {
            setTimeout(() => {
                expect(editor.getBlockCount()).toBe(1);

                // Add a new block
                editor.addBlock({
                    id: 'paragraph2',
                    type: BlockType.Paragraph,
                    content: [{ id: 'content2', type: ContentType.Text, content: 'New paragraph' }]
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
                    type: BlockType.Heading1,
                    content: [{ id: 'headingContent', type: ContentType.Text, content: 'Heading' }]
                }, 'paragraph1', false);

                const json = editor.getDataAsJson();

                expect(Array.isArray(json)).toBe(true);
                expect(json.length).toBe(2);
                expect(json[0].id).toBe('heading1');
                expect(json[1].id).toBe('paragraph1');
                done();
            });
        });

        it('should return a specific block as JSON when blockId is provided', () => {
            const json = editor.getDataAsJson('paragraph1');

            expect(json).not.toBeNull();
            expect(json.id).toBe('paragraph1');
            expect(json.type).toBe(BlockType.Paragraph);
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
                    type: BlockType.Heading1,
                    content: [{ id: 'headingContent', type: ContentType.Text, content: 'Heading' }]
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
                    type: BlockType.Quote,
                    content: [{ id: 'quoteContent', type: ContentType.Text, content: 'Important quote' }]
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
                    type: BlockType.Divider
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
                    type: BlockType.Code,
                    content: [{ id: 'codeContent', type: ContentType.Text, content: 'function test() { return true; }' }]
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
                    type: BlockType.Image,
                    imageSettings: {
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
                    type: BlockType.Image,
                    imageSettings: {
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
                const calloutBlock = {
                    id: 'callout1',
                    type: BlockType.Callout,
                    content: [{ id: 'calloutTitle', type: ContentType.Text, content: 'Callout Title' }],
                    children: [{
                        id: 'calloutPara',
                        type: BlockType.Paragraph,
                        content: [{ id: 'calloutContent', type: ContentType.Text, content: 'Callout content' }]
                    }]
                };
                
                editor.addBlock(calloutBlock, 'paragraph1', true);
                
                const html = editor.getDataAsHtml('callout1');
                expect(html).toBe('<div class="callout"><p>Callout content</p></div>');
                done();
            });
        });
        
        it('should render toggle blocks correctly', function (done) {
            setTimeout(function () {
                const toggleBlock = {
                    id: 'toggle1',
                    type: BlockType.ToggleParagraph,
                    content: [{ id: 'toggleTitle', type: ContentType.Text, content: 'Toggle Title' }],
                    children: [{
                        id: 'togglePara',
                        type: BlockType.Paragraph,
                        content: [{ id: 'toggleContent', type: ContentType.Text, content: 'Toggle content' }]
                    }]
                };
                
                editor.addBlock(toggleBlock, 'paragraph1', true);
                
                const html = editor.getDataAsHtml('toggle1');
                expect(html).toBe('<div class="toggle">Toggle Title <p>Toggle content</p></div>');
                done();
            });
        });
        
        it('should render toggle heading blocks correctly', function (done) {
            setTimeout(function () {
                const toggleHeadingBlock = {
                    id: 'toggleHeading1',
                    type: BlockType.ToggleHeading1,
                    content: [{ id: 'toggleHeadingTitle', type: ContentType.Text, content: 'Toggle Heading' }],
                    children: [{
                        id: 'toggleHeadingPara',
                        type: BlockType.Paragraph,
                        content: [{ id: 'toggleHeadingContent', type: ContentType.Text, content: 'Toggle heading content' }]
                    }]
                };
                
                editor.addBlock(toggleHeadingBlock, 'paragraph1', true);
                
                const html = editor.getDataAsHtml('toggleHeading1');
                expect(html).toBe('<div class="toggle">Toggle Heading <p>Toggle heading content</p></div>');
                done();
            });
        });
        
        it('should render links correctly in HTML', function (done) {
            setTimeout(function () {
                const linkBlock = {
                    id: 'link1',
                    type: BlockType.Paragraph,
                    content: [{
                        id: 'linkContent',
                        type: ContentType.Link,
                        content: 'Link text',
                        linkSettings: {
                            url: 'https://example.com',
                            openInNewWindow: true
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
                    type: BlockType.BulletList,
                    content: [{ id: 'bulletContent1', type: ContentType.Text, content: 'Bullet item 1' }]
                }, 'paragraph1', true);
                
                editor.addBlock({
                    id: 'bulletlist2',
                    type: BlockType.BulletList,
                    content: [{ id: 'bulletContent2', type: ContentType.Text, content: 'Bullet item 2' }]
                }, 'bulletlist1', true);
                
                const html = editor.getDataAsHtml();
                expect(html.includes('<ul><li>Bullet item 1</li><li>Bullet item 2</li></ul>')).toBe(true);
                done();
            });
        });
        
        it('should render numbered list blocks correctly', function (done) {
            setTimeout(function () {
                editor.removeBlock('paragraph1');
                
                editor.addBlock({
                    id: 'numberedlist1',
                    type: BlockType.NumberedList,
                    content: [{ id: 'numberedContent1', type: ContentType.Text, content: 'Number item 1' }]
                });
                
                editor.addBlock({
                    id: 'numberedlist2',
                    type: BlockType.NumberedList,
                    content: [{ id: 'numberedContent2', type: ContentType.Text, content: 'Number item 2' }]
                }, 'numberedlist1', true);
                
                const html = editor.getDataAsHtml();
                expect(html).toBe('<ol><li>Number item 1</li><li>Number item 2</li></ol>');
                done();
            });
        });

        it('should render formatted text correctly in HTML', function (done) {
            setTimeout(function () {
                const formattedBlock = {
                    id: 'formatted1',
                    type: BlockType.Paragraph,
                    content: [{
                        id: 'formattedContent',
                        type: ContentType.Text,
                        content: 'Formatted text',
                        styles: {
                            bold: true,
                            italic: true,
                            underline: true
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
                editor.setFocusToBlock(blockElement);
                
                const focusedBlockModel = editor.getCurrentFocusedBlockModel();
                expect(focusedBlockModel).not.toBeNull();
                expect(focusedBlockModel.id).toBe('paragraph1');
                expect(focusedBlockModel.type).toBe(BlockType.Paragraph);
                done();
            });
        });

        it('should return null when no block is focused', (done) => {
            setTimeout(() => {
                editor.currentFocusedBlock = null;
                const focusedBlockModel = editor.getCurrentFocusedBlockModel();
                expect(focusedBlockModel).toBeNull();
                done();
            });
        });
    });

    describe('updateBlock method with parent blocks', () => {
        it('should update callout block properly', (done) => {
            setTimeout(() => {
                const parentBlock = {
                    id: 'callout1',
                    type: BlockType.Callout,
                    children: [{
                        id: 'calloutChild1',
                        type: BlockType.Paragraph,
                        content: [{ id: 'calloutChildContent', type: ContentType.Text, content: 'Callout content' }],
                        parentId: 'callout1'
                    }]
                };
                editor.addBlock(parentBlock);
                
                const updateResult = editor.updateBlock('calloutChild1', {
                    content: [{ id: 'calloutChildContent', type: ContentType.Text, content: 'Updated callout content' }]
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

        it('should update toggle block properly', (done) => {
            setTimeout(() => {
                const parentBlock = {
                    id: 'toggle-block',
                    type: BlockType.ToggleParagraph,
                    content: [{ type: ContentType.Text, content: 'Click here to expand' }],
                    children: [{
                        id: 'toggleChild1',
                        parentId: 'toggle-block',
                        type: BlockType.BulletList,
                        content: [{ id: 'toggleChildContent', type: ContentType.Text, content: 'toggle content' }],
                    }]
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
                editor.setFocusToBlock(blockElement);
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
                const customBlock = {
                    id: 'templateBlock',
                    type: BlockType.Template,
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
});
