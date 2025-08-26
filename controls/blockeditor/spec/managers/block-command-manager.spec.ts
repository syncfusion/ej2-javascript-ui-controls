import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockModel } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, getBlockContentElement, BuiltInToolbar } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Block Command Manager:', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Main actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.Paragraph, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' }] },
                {
                    id: 'calloutblock',
                    type: 'Callout',
                    children: [
                        {
                            id: 'calloutchild1',
                            type: 'Paragraph',
                            content: [{ id: 'callout-child1-content', type: ContentType.Text, content: 'Callout child 1' }]
                        },
                        {
                            id: 'calloutchild2',
                            type: 'Paragraph',
                            content: [{ id: 'callout-child2-content', type: ContentType.Text, content: 'Callout child 2' }]
                        }
                    ]
                },
                {
                    id: 'toggleblock',
                    type: BlockType.ToggleParagraph,
                    content: [{ id: 'toggle-content-1', type: ContentType.Text, content: 'Click here to expand' }],
                    children: [
                        {
                            id: 'togglechild1',
                            type: BlockType.CheckList,
                            content: [{ type: ContentType.Text, content: 'Todo' }]
                        },
                        {
                            id: 'togglechild2',
                            type: BlockType.Paragraph,
                            content: [{ type: ContentType.Text, content: 'Toggle child 2' }]
                        }
                    ]
                },
                { id: 'paragraph2', type: BlockType.Paragraph, content: [{ id: 'paragraph2-content', type: ContentType.Text, content: '' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('transformToggleBlocksAsRegular should transform properly', () => {
            const blockElement = editorElement.querySelector('#toggleblock') as HTMLElement;
            const contentElement = blockElement.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            editor.blockAction.deleteBlockAtCursor({
                blockElement: blockElement, mergeDirection: 'previous'
            });
            const toggleBlock = editor.blocks.find(block => block.type === 'ToggleParagraph');
            expect(toggleBlock).toBeUndefined();
            expect(editor.blocks[2].type).toBe('Paragraph');
        });

        it('single divider block in editor and deleting it should create paragraph block', () => {
            if (editor) editor.destroy();
            const blocks: BlockModel[] = [
                { id: 'divider', type: BlockType.Divider },
                { id: 'paragraph2', type: BlockType.Paragraph, content: [{ id: 'paragraph2-content', type: ContentType.Text, content: '' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#divider') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            editor.blockAction.deleteBlockAtCursor({
                blockElement, mergeDirection: 'previous'
            });
        });

        it('deleting a child block inside callout', () => {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            editor.blockAction.deleteBlock({
                blockElement, mergeDirection: 'previous'
            });

            expect(editor.blocks[1].children.length).toBe(1);
            expect(editorElement.querySelector('#calloutchild2')).toBeNull();
        });

        it('duplicating a child block inside callout', () => {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            editor.blockAction.duplicateBlock(blockElement);

            expect(editor.blocks[1].children.length).toBe(3);
        });

        it('moving a child block inside callout', function () {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.blockAction.moveBlock({
                fromBlockIds: ['calloutchild2'], toBlockId: 'calloutchild1'
            });
            expect(editor.blocks[1].children.length).toBe(2);
            expect(editor.blocks[1].children[0].id).toBe('calloutchild2');
            expect(editor.blocks[1].children[1].id).toBe('calloutchild1');
        });

        it('generateNewIdsForBlock should generate properly', () => {
            editor.blocks[0].content = [
                { id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' },
                { id: 'progress', type: ContentType.Label },
                { id: 'user1', type: ContentType.Mention },
            ];
            editor.reRenderBlockContent(editor.blocks[0]);
            const labelDataId = editor.blocks[0].content[1].dataId;
            const mentionDataId = editor.blocks[0].content[2].dataId;
            const firstBlockId = editor.blocks[0].id;
            const firstBlockContentId = editor.blocks[0].content[0].id;
            const newBlock = editor.blockAction.generateNewIdsForBlock(editor.blocks[0]);
            expect(newBlock.id).not.toBe(firstBlockId);
            expect(newBlock.content[0].id).not.toBe(firstBlockContentId);
            expect(newBlock.content[1].dataId).not.toBe(labelDataId);
            expect(newBlock.content[2].dataId).not.toBe(mentionDataId);

            const child1Id = editor.blocks[1].children[0].id;
            const child1ContentId = editor.blocks[1].children[0].content[0].id;
            const newChildBlock = editor.blockAction.generateNewIdsForBlock(editor.blocks[1].children[0]);
            expect(newChildBlock.id).not.toBe(child1Id);
            expect(newChildBlock.content[0].id).not.toBe(child1ContentId);
        });

        it('triggerWholeContentUpdate should update content model properly', () => {
            editor.blockAction.triggerWholeContentUpdate(
                editor.blocks[1], []
            );
            expect(editor.blocks[1].content.length).toBe(0);
            editor.blockAction.triggerWholeContentUpdate(
                editor.blocks[1].children[0], []
            );
            expect(editor.blocks[1].children[0].content.length).toBe(0);
        });
        
    });

    describe('splitContent method', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.Paragraph, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterAll(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        // Helper to create content elements for testing
        const setupContentElement = (html: string): HTMLElement => {
            const element = document.createElement('div');
            element.innerHTML = html;
            return element;
        };

        // Helper to verify fragment content
        const fragmentToHTML = (fragment: DocumentFragment): string => {
            const div = document.createElement('div');
            div.appendChild(fragment.cloneNode(true));
            return div.innerHTML;
        };

        it('should split simple text node correctly', () => {
            // Setup
            const contentElement = setupContentElement('Hello World');
            const splitNode = contentElement.firstChild;
            const splitOffset = 5;

            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);

            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('Hello');
            expect(fragmentToHTML(result.afterFragment)).toBe(' World');
        });

        it('should split at beginning of text node', () => {
            // Setup
            const contentElement = setupContentElement('Hello World');
            const splitNode = contentElement.firstChild;
            const splitOffset = 0; // Beginning of text

            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('');
            expect(fragmentToHTML(result.afterFragment)).toBe('Hello World');
        });

        it('should split at end of text node', () => {
            // Setup
            const contentElement = setupContentElement('Hello World');
            const splitNode = contentElement.firstChild;
            const splitOffset = 11; // End of text
            
            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('Hello World');
            expect(fragmentToHTML(result.afterFragment)).toBe('');
        });

        it('should split text within a single element node', () => {
            // Setup
            const contentElement = setupContentElement('<strong>Hello World</strong>');
            const strongElement = contentElement.querySelector('strong');
            const splitNode = strongElement.firstChild;
            const splitOffset = 5;
            
            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            expect(((result.beforeFragment.childNodes[0] as HTMLElement).tagName)).toBe('STRONG');
            expect(((result.beforeFragment.childNodes[0] as HTMLElement).textContent)).toBe('Hello');
            expect(((result.afterFragment.childNodes[0] as HTMLElement).tagName)).toBe('STRONG');
            expect(((result.afterFragment.childNodes[0] as HTMLElement).textContent)).toBe(' World');
        });

        it('should split between multiple element nodes', () => {
            // Setup
            const contentElement = setupContentElement('<span>Hi</span><strong>Hello</strong><em>World</em>');
            const strongElement = contentElement.querySelector('strong');
            const splitNode = strongElement.firstChild;
            const splitOffset = 3;

            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(result.beforeFragment.childNodes.length).toBe(2);
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[0] as HTMLElement).textContent).toBe('Hi');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).tagName).toBe('STRONG');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).textContent).toBe('Hel');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            expect((result.afterFragment.childNodes[0] as HTMLElement).textContent).toBe('lo');
            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });

    it('should handle nested element splitting', () => {
            // Setup
            const contentElement = setupContentElement('<span>Hi</span><strong><em>Hello</em></strong><em>World</em>');
            const emElement = contentElement.querySelector('em');
            const splitNode = emElement.firstChild;
            const splitOffset = 3;
            
            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(result.beforeFragment.childNodes.length).toBe(2);
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).tagName).toBe('STRONG');
            
            const beforeEm = (result.beforeFragment.childNodes[1] as HTMLElement).querySelector('em');
            expect(beforeEm.textContent).toBe('Hel');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            
            const afterEm = (result.afterFragment.childNodes[0] as HTMLElement).querySelector('em');
            expect(afterEm.textContent).toBe('lo');
            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });

        it('should handle case when splitNode is an element node itself', () => {
            // Setup
            const contentElement = setupContentElement('<span>Hi</span><strong>Hello</strong><em>World</em>');
            const strongElement = contentElement.querySelector('strong');
            // Split at the strong element itself
            const splitNode = strongElement.firstChild;
            const splitOffset = 0;
            
            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[0] as HTMLElement).textContent).toBe('Hi');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            expect((result.afterFragment.childNodes[0] as HTMLElement).textContent).toBe('Hello');
            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });

        it('should handle content element with no children', () => {
            // Setup
            const contentElement = document.createElement('div');
            // No children
            
            // Execute
            const result = editor.blockAction.splitContent(contentElement, contentElement, 0);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('');
            expect(fragmentToHTML(result.afterFragment)).toBe('');
        });

        it('should preserve inline styles in split elements', () => {
            // Setup
            const contentElement = setupContentElement('<span style="font-weight:bold;">Hi</span><strong style="color:red;">Hello</strong>');
            const strongElement = contentElement.querySelector('strong');
            const splitNode = strongElement.firstChild;
            const splitOffset = 3;
            
            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toContain('style="font-weight:bold;"');
            expect(fragmentToHTML(result.beforeFragment)).toContain('style="color:red;"');
            expect(fragmentToHTML(result.beforeFragment)).toContain('Hel');
            
            expect(fragmentToHTML(result.afterFragment)).toContain('style="color:red;"');
            expect(fragmentToHTML(result.afterFragment)).toContain('lo');
        });

        it('should handle deeply nested structures', () => {
            // Setup
            const contentElement = setupContentElement(
                '<span>Hi</span><strong id="rootid"><em><i> Hello </i></em></strong><em>World</em>'
            );
            const italic = contentElement.querySelector('i');
            const splitNode = italic.firstChild;
            const splitOffset = 4;
            
            // Execute
            const result = editor.blockAction.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(result.beforeFragment.childNodes.length).toBe(2);
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[0] as HTMLElement).textContent).toBe('Hi');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).tagName).toBe('STRONG');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).textContent).toBe(' Hel');
            expect((result.beforeFragment.childNodes[1].childNodes[0] as HTMLElement).tagName).toBe('EM');
            expect((result.beforeFragment.childNodes[1].childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('I');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            expect((result.afterFragment.childNodes[0] as HTMLElement).textContent).toBe('lo ');
            expect((result.afterFragment.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('I');

            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });
    });

    describe('Other actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.BulletList, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' }] },
                { id: 'paragraph2', type: BlockType.BulletList, content: [{ id: 'paragraph2-content', type: ContentType.Text, content: 'Paragraph 2' }] },
                { id: 'paragraph3', type: BlockType.Paragraph,
                    content: [
                        { id: 'bold', type: ContentType.Text, content: 'Bold', styles: { bold: true } },
                        { id: 'italic', type: ContentType.Text, content: 'Italic', styles: { italic: true } },
                    ]
                },
                { id: 'paragraph4', type: BlockType.Paragraph,
                    content: [
                        { id: 'underline', type: ContentType.Text, content: 'Underline', styles: { underline: true } },
                        { id: 'strikethrough', type: ContentType.Text, content: 'Strikethrough', styles: { strikethrough: true } },
                    ]
                },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should delete contents and merge into empty block properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            contentElement1.textContent = '';
            editor.updateContentOnUserTyping(blockElement1);
            editor.setFocusToBlock(blockElement2);
            setCursorPosition(contentElement2, 0);
            editor.blockAction.deleteBlockAtCursor({
                blockElement: blockElement2,
                mergeDirection: 'previous'
            });

            expect(editor.blocks[0].content[0].content).toBe('Paragraph 2');
            expect(editorElement.querySelector('#paragraph2')).toBeNull();
        });

        it('should delete contents and merge into formatted block properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            editor.setSelection('paragraph1-content', 6, 11);
            editor.executeToolbarAction(BuiltInToolbar.Bold);

            editor.setFocusToBlock(blockElement2);
            setCursorPosition(contentElement2, 0);
            editor.blockAction.deleteBlockAtCursor({
                blockElement: blockElement2,
                mergeDirection: 'previous'
            });

            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[0].content).toBe('Hello ');
            expect(editor.blocks[0].content[1].content).toBe('world');
            expect(editor.blocks[0].content[2].content).toBe('Paragraph 2');
            expect(editorElement.querySelector('#paragraph1').textContent).toBe('Hello worldParagraph 2');
        });

        it('should delete formatted contents and merge into unformatted block properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph3') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            editor.setFocusToBlock(blockElement2);
            setCursorPosition(contentElement2, 0);
            editor.blockAction.deleteBlockAtCursor({
                blockElement: blockElement2,
                mergeDirection: 'previous'
            });

            expect(editor.blocks[1].content.length).toBe(3);
            expect(editor.blocks[1].content[0].content).toBe('Paragraph 2');
            expect(editor.blocks[1].content[1].content).toBe('Bold');
            expect(editor.blocks[1].content[2].content).toBe('Italic');
            expect(editorElement.querySelector('#paragraph2').textContent).toBe('Paragraph 2BoldItalic');
        });

        it('should handle empty content model deletions properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            const originalContent = editor.blocks[1].content.slice();
            //Merging empty content into a block with content
            editor.blocks[1].content = [];
            (editor.blockAction as any).updateContentModelsAfterDeletion(
                contentElement1, contentElement2,
                editor.blocks[0], editor.blocks[1]
            );
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello world');

            editor.blocks[1].content = originalContent;
            //Merging a block with content into a empty content
            editor.blocks[0].content = [];
            (editor.blockAction as any).updateContentModelsAfterDeletion(
                contentElement1, contentElement2,
                editor.blocks[0], editor.blocks[1]
            );
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Paragraph 2');
        });

        it('should handle divider deletions properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement1);
            editor.selectAllBlocks();
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' }));
            expect(editor.blocks.length).toBe(1);

            // Add a divider block
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            // click divider li element inside the popup
            const dividerLiElement = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
            dividerLiElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            // Current bullet list block should be replaced with divider block since content is empty
            expect(editor.blocks[0].type).toBe(BlockType.Divider);
            expect(editor.blocks[1].type).toBe(BlockType.Paragraph);
            
            // Delete the divider block
            const dividerElement = editorElement.querySelector('.e-divider-block') as HTMLElement;
            editor.setFocusToBlock(dividerElement);
            editor.blockAction.deleteBlockAtCursor({
                blockElement: dividerElement,
                mergeDirection: 'previous'
            });

            //Deleting the divider, focus should be set to next block
            expect(editor.currentFocusedBlock.id).toBe(editor.blocks[0].id);
        });

        it('should handle null values properly', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = blockElement.querySelector('.e-block-content') as HTMLElement;
            expect(editor.blockAction.addBulkBlocks({ blocks: []})).toBeUndefined();

            expect(editor.blockAction.deleteBlock({ blockElement: null })).toBeUndefined();

            expect(editor.blockAction.deleteBlock({ blockElement: document.createElement('div') })).toBeUndefined();

            expect(editor.blockAction.moveBlock({ fromBlockIds: [] })).toBeUndefined();

            expect(editor.blockAction.moveBlock({ fromBlockIds: ['invalid'], toBlockId: 'invalid' })).toBeUndefined();

            expect(editor.blockAction.duplicateBlock(null, 'above')).toBeUndefined();

            expect(editor.blockAction.duplicateBlock(document.createElement('div'))).toBeUndefined();

            expect(editor.blockAction.getIndexToAdjust(document.createElement('div'))).toBe(editor.blocks.length);

            expect(editor.handleMultipleBlockDeletion([{ id: 'invalid' }, { id: 'invalid' }])).toBe(false);

            expect(editor.blockAction.splitBlockAtCursor(blockElement, { isUndoRedoAction: true, lastChild: null })).toBeNull();

            spyOn(editor.nodeSelection, 'getRange').and.returnValue({
                startContainer: null,
            });
            expect(editor.blockAction.splitBlockAtCursor(blockElement)).toBeNull();

            contentElement.remove();
            expect(editor.blockAction.splitBlockAtCursor(blockElement)).toBeNull();

            expect(editor.blockAction.deleteBlockAtCursor({ blockElement: null })).toBeUndefined();
            expect(editor.blockAction.deleteBlockAtCursor({ blockElement: blockElement, mergeDirection: 'next' })).toBeUndefined();

            expect((editor.blockAction as any).transformToggleBlocksAsRegular(document.createElement('div'))).toBeUndefined();

            const prevFocused = editor.currentFocusedBlock;
            editor.currentFocusedBlock = null;
            expect((editor.blockAction as any).adjustViewForFocusedBlock()).toBeUndefined();
            editor.currentFocusedBlock = prevFocused;
        });
        
    });
});