import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../src/blockeditor/base/enums';
import { BaseChildrenProp, BaseStylesProp, BlockModel, HeadingProps } from '../../src/blockeditor/models';
import { BlockEditor, setSelectionRange, getBlockContentElement, setCursorPosition } from '../../src/index';
import { createEditor } from '../common/util.spec';


describe('UndoRedo', () => {
    let editor: BlockEditor;
    let block1: HTMLElement, block2: HTMLElement, block3: HTMLElement, block4: HTMLElement, block5: HTMLElement;
    let editorElement: HTMLElement;

    function triggerUndo(editorElement: HTMLElement) : void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement) : void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    describe('ContentChanged', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'paragraph-content2', type: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', type: BlockType.Paragraph, content: [{ id: 'paragraph-content3', type: ContentType.Text, content: 'Block 3 content' }] }
            ];
    
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            block3 = document.getElementById('block3');
        });
    
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
    
        it('Undo action for content changed', (done) => {

            const paragraph = editorElement.querySelector('#paragraph-content1');
            paragraph.textContent = 'Updated content';
            editor.stateManager.updateContentOnUserTyping((paragraph.closest('.e-block') as HTMLElement));
            
            setTimeout(() => {
                editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                // check updated block content before undo action
                expect(paragraph.textContent).toBe('Updated content');
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                const updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                done();
            }, 10);
        });

        it('Redo action for content changed', (done) => {

            const paragraph = editorElement.querySelector('#paragraph-content1');
            paragraph.textContent = 'Updated content';
            editor.stateManager.updateContentOnUserTyping((paragraph.closest('.e-block') as HTMLElement));
            
            setTimeout(() => {
                editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                // check updated block content before undo action
                expect(paragraph.textContent).toBe('Updated content');
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                let updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                // check updated block content after redo action
                expect(paragraph.textContent).toBe('Updated content');
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Updated content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                done();
            }, 10);
        });

        it('Undo action when stack length is 0', (done) => {
            const paragraph = editorElement.querySelector('#paragraph-content1');
            setTimeout(() => {
                editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                const updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                done();
            }, 10);
        });

        it('Redo action when stack length is 0', (done) => {
            const paragraph = editorElement.querySelector('#paragraph-content1');
            setTimeout(() => {
                editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // no content changes after undo as stack is empty
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                let updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                // no content changes after redo as stack is empty
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                done();
            }, 10);
        });

        it('Undo action for content split', (done) => {
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            setTimeout(() => {
                editor.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 6);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[0].content[0].content).toBe('Block ');
                expect(editor.blocks[1].content[0].content).toBe('1 content');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Block ');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('1 content');
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                const updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                done();
            }, 10);
        });

        it('Redo action for content split', (done) => {
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            setTimeout(() => {
                editor.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 6);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[0].content[0].content).toBe('Block ');
                expect(editor.blocks[1].content[0].content).toBe('1 content');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Block ');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('1 content');
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                const updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[0].content[0].content).toBe('Block ');
                expect(editor.blocks[1].content[0].content).toBe('1 content');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Block ');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('1 content');
                done();
            }, 10);
        });
    });

    describe('Formatting Action', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content1', type: ContentType.Text, content: 'Block 1 content' }] },
                {
                    id: 'callout', type: BlockType.Callout, props: { children: [
                        {
                            id: 'callout-block-1', type: BlockType.Paragraph, content: [{ id: 'callout-content-1', type: ContentType.Text, content: 'Callout item 1' }],
                        }
                    ]}
                }
            ];
    
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('callout');
        });
    
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('Undo action for paragraph content formatted to bold', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#block1') as HTMLElement;
                expect(blockElement).not.toBeNull();
                const contentElement = getBlockContentElement(blockElement);
                //Select range of text(world) and apply bold formatting
                setSelectionRange((contentElement.lastChild as HTMLElement), 0, 6);
                editor.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Block ');
                expect(contentElement.querySelector('span').textContent).toBe('1 content');
                expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Block 1 content');
                expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBeUndefined();
                done();
            }, 10);
        });

        it('Redo action for paragraph content formatted to bold', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#block1') as HTMLElement;
                expect(blockElement).not.toBeNull();
                const contentElement = getBlockContentElement(blockElement);
                //Select range of text(world) and apply bold formatting
                setSelectionRange((contentElement.lastChild as HTMLElement), 0, 6);
                editor.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Block ');
                expect(contentElement.querySelector('span').textContent).toBe('1 content');
                expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Block 1 content');
                expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBeUndefined();

                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                // check updated block content after redo action
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Block ');
                expect(contentElement.querySelector('span').textContent).toBe('1 content');
                expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
                done();
            }, 10);
        });

        it('Undo action for content formatted to bold in callout', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#callout') as HTMLElement;
                expect(blockElement).not.toBeNull();
                const contentElement = getBlockContentElement(blockElement);
                //Select range of text(world) and apply bold formatting
                setSelectionRange((contentElement.lastChild as HTMLElement), 0, 8);
                editor.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Callout ');
                expect(contentElement.querySelector('span').textContent).toBe('item 1');
                expect(((editor.blocks[1].props as BaseChildrenProp).children[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Callout item 1');
                expect(((editor.blocks[1].props as BaseChildrenProp).children[0].content[0].props as BaseStylesProp).styles.bold).toBeUndefined();
                done();
            }, 10);
        });

        it('Redo action for content formatted to bold in callout', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#callout') as HTMLElement;
                expect(blockElement).not.toBeNull();
                const contentElement = getBlockContentElement(blockElement);
                //Select range of text(world) and apply bold formatting
                setSelectionRange((contentElement.lastChild as HTMLElement), 0, 8);
                editor.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Callout ');
                expect(contentElement.querySelector('span').textContent).toBe('item 1');
                expect(((editor.blocks[1].props as BaseChildrenProp).children[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Callout item 1');
                expect(((editor.blocks[1].props as BaseChildrenProp).children[0].content[0].props as BaseStylesProp).styles.bold).toBeUndefined();

                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Callout ');
                expect(contentElement.querySelector('span').textContent).toBe('item 1');
                expect(((editor.blocks[1].props as BaseChildrenProp).children[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
                done();
            }, 10);
        });
    });

    describe('Block Addition', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'paragraph-content2', type: ContentType.Text, content: 'Block 2 content' }] },
            ];
    
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
        });
    
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
    
        it('Undo action for single block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            const newBlock: BlockModel= {
                id: 'block3',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content3', type: ContentType.Text, content: 'Block 3 content' }
                ]
            };
            
            setTimeout(() => {
                editor.blockEditorMethods.addBlock(newBlock, 'block2', true);
                // Check if block was added
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');

                // Undo the block addition
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // Check if block was removed after undo
                expect(editor.blocks.length).toBe(initialBlockCount);
                
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(document.getElementById('block3')).toBeNull();
                done();
            }, 10);
        });

        it('Redo action for single block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            const newBlock: BlockModel= {
                id: 'block3',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content3', type: ContentType.Text, content: 'Block 3 content' }
                ]
            };
            
            setTimeout(() => {
                editor.blockEditorMethods.addBlock(newBlock, 'block2', true);
                // Check if block was added
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');

                // Undo the block addition
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // Check if block was removed after undo
                expect(editor.blocks.length).toBe(initialBlockCount);
                
                // Redo the block addition
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                
                // Check if block was added back after redo
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');
                
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount + 1);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();
                expect(blocks[2].textContent).toContain('Block 3 content');
                
                done();
            }, 10);
        });

        it('Undo action for multiple block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            const newBlock1: BlockModel= {
                id: 'block3',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content3', type: ContentType.Text, content: 'Block 3 content' }
                ]
            };
            
            setTimeout(() => {
                editor.blockEditorMethods.addBlock(newBlock1, 'block2', true);
                const newBlock2: BlockModel = {
                    id: 'block4',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'content4', type: ContentType.Text, content: 'Block 4 content' }
                    ]
                };
                
                editor.blockEditorMethods.addBlock(newBlock2, 'block3', true);
                // Check if both blocks were added
                expect(editor.blocks.length).toBe(initialBlockCount + 2);
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');

                // Undo the last block addition (block4)
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // Check if block4 was removed
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');
                expect(document.getElementById('block4')).toBeNull();

                // Undo the first block addition (block3)
                editorElement.dispatchEvent(undoEvent);

                // Check if block3 was removed
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(document.getElementById('block3')).toBeNull();
                
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                
                done();
            }, 10);
        });

        it('Redo action for multiple block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            // Add block3
            const newBlock1: BlockModel= {
                id: 'block3',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content3', type: ContentType.Text, content: 'Block 3 content' }
                ]
            };
            
            setTimeout(() => {
                editor.blockEditorMethods.addBlock(newBlock1, 'block2', true);
                const newBlock2: BlockModel = {
                    id: 'block4',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'content4', type: ContentType.Text, content: 'Block 4 content' }
                    ]
                };
                
                editor.blockEditorMethods.addBlock(newBlock2, 'block3', true);
                // Check if both blocks were added
                expect(editor.blocks.length).toBe(initialBlockCount + 2);
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');

                // Undo twice to remove both blocks
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                
                editorElement.dispatchEvent(undoEvent);
                
                // Check if both blocks were removed
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(document.getElementById('block3')).toBeNull();
                expect(document.getElementById('block4')).toBeNull();
                
                // Redo to add block3 back
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                
                // Check if block3 was added back
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();
                expect(document.getElementById('block3').textContent).toContain('Block 3 content');
                
                // Redo to add block4 back
                editorElement.dispatchEvent(redoEvent);
                
                // Check if block4 was added back
                expect(editor.blocks.length).toBe(initialBlockCount + 2);
                expect(editor.blocks[3].id).toBe('block4');
                expect(document.getElementById('block4')).not.toBeNull();
                expect(document.getElementById('block4').textContent).toContain('Block 4 content');
                
                // Check final DOM state
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount + 2);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                done();
            }, 10);
        });
    });

    describe('Block Removal', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'paragraph-content2', type: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', type: BlockType.Paragraph, content: [{ id: 'paragraph-content3', type: ContentType.Text, content: 'Block 3 content' }] },
                { id: 'block4', type: BlockType.Paragraph, content: [{ id: 'paragraph-content4', type: ContentType.Text, content: 'Block 4 content' }] },
            ];
    
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            block3 = document.getElementById('block3');
            block4 = document.getElementById('block4');
        });
    
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
    
        it('Undo action for single block deletion', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);
            setTimeout(() => {
                editor.blockEditorMethods.removeBlock('block4');
                // Check if block was removed
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editor.blocks[editor.blocks.length - 1].id).toBe('block3');
                expect(document.getElementById('block4')).toBeNull();
                // Undo the block removed
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // Check if block was added after undo
                expect(editor.blocks.length).toBe(initialBlockCount);
                
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                expect(document.getElementById('block4')).not.toBeNull();
                done();
            }, 10);
        });

        it('Redo action for single block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);

            setTimeout(() => {
                editor.blockEditorMethods.removeBlock('block4');
                // Check if block was removed
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editor.blocks[editor.blocks.length - 1].id).toBe('block3');
                expect(document.getElementById('block4')).toBeNull();
                // Undo the block removed
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // Check if block was added after undo
                expect(editor.blocks.length).toBe(initialBlockCount);
                
                // again remove the block to test redo
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                
                // Check if block was removed after redo
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editor.blocks[editor.blocks.length - 1].id).toBe('block3');
                expect(document.getElementById('block4')).toBeNull();
                
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount - 1);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(document.getElementById('block4')).toBeNull();
                done();
            }, 10);
        });

        it('Undo action for multiple block deletion', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);
            
            setTimeout(() => {
                // remove block3 and block4
                editor.blockEditorMethods.removeBlock('block4');
                editor.blockEditorMethods.removeBlock('block3');
                // Check if both blocks were removed
                expect(editor.blocks.length).toBe(initialBlockCount - 2);
                expect(document.getElementById('block4')).toBeNull();
                expect(document.getElementById('block3')).toBeNull();

                // Undo it to add the last removed block
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // Check if block3 was added
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editor.blocks[2].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();
                expect(document.getElementById('block4')).toBeNull();

                // add the block4 again by undo
                editorElement.dispatchEvent(undoEvent);

                // Check if block4 was added
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(document.getElementById('block4')).not.toBeNull();
                
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                expect(document.getElementById('block4')).not.toBeNull();
                expect(document.getElementById('block3')).not.toBeNull();
                done();
            }, 10);
        });

        it('Redo action for multiple block deletion', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);
            
            setTimeout(() => {
                // remove block3 and block4
                editor.blockEditorMethods.removeBlock('block4');
                editor.blockEditorMethods.removeBlock('block3');
                // Check if both blocks were removed
                expect(editor.blocks.length).toBe(initialBlockCount - 2);
                expect(document.getElementById('block4')).toBeNull();
                expect(document.getElementById('block3')).toBeNull();

                // Undo it to add the last removed block
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // Check if block3 was added
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editor.blocks[2].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();
                expect(document.getElementById('block4')).toBeNull();

                // add the block4 again by undo
                editorElement.dispatchEvent(undoEvent);

                // Check if block4 was added
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(document.getElementById('block4')).not.toBeNull();

                onemptied
                // Redo it to remove the last added block
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);

                // Check if block4 was removed
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editor.blocks[editor.blocks.length - 1].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();
                expect(document.getElementById('block4')).toBeNull();

                // remove the block3 again by redo
                editorElement.dispatchEvent(redoEvent);

                // Check if block3 was removed
                expect(editor.blocks.length).toBe(initialBlockCount - 2);
                expect(document.getElementById('block3')).toBeNull();
                expect(document.getElementById('block4')).toBeNull();
                
                // Check final DOM state
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount - 2);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(document.getElementById('block3')).toBeNull();
                expect(document.getElementById('block4')).toBeNull();
                done();
            }, 10);
        });
    });

    describe('Block Move', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'paragraph-content2', type: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', type: BlockType.Paragraph, content: [{ id: 'paragraph-content3', type: ContentType.Text, content: 'Block 3 content' }] },
                { id: 'block4', type: BlockType.Paragraph, content: [{ id: 'paragraph-content4', type: ContentType.Text, content: 'Block 4 content' }] },
            ];
    
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            block3 = document.getElementById('block3');
            block4 = document.getElementById('block4');
        });
    
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
    
        it('Undo action for single block Move', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);
            setTimeout(() => {
                editor.blockCommandManager.moveBlock({
                    fromBlockIds: ['block1'],
                    toBlockId: 'block2'
                });
                // Check if block was moved
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('block2');
                expect(editor.blocks[1].id).toBe('block1');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');
                // Undo the block moved
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('block1');
                expect(editor.blocks[1].id).toBe('block2');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                done();
            }, 10);
        });

        it('Redo action for single block Move', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);

            setTimeout(() => {
                editor.blockCommandManager.moveBlock({
                    fromBlockIds: ['block1'],
                    toBlockId: 'block2'
                });
                // Check if block was moved
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('block2');
                expect(editor.blocks[1].id).toBe('block1');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');
                // Undo the block moved
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks.length).toBe(initialBlockCount);
                
                expect(editor.blocks[0].id).toBe('block1');
                expect(editor.blocks[1].id).toBe('block2');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');

                // Check DOM update
                let blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                
                // Redo action
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                
                // move blocks again by redoing it
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('block2');
                expect(editor.blocks[1].id).toBe('block1');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');
                
                // Check DOM update
                blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block2');
                expect(blocks[1].id).toBe('block1');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                done();
            }, 10);
        });

        it('Undo action for multiple block move', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);
            
            setTimeout(() => {
                editor.blockCommandManager.moveBlock({
                    fromBlockIds: ['block1', 'block2'],
                    toBlockId: 'block3'
                });
                // Check if block was moved
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('block3');
                expect(editor.blocks[1].id).toBe('block1');
                expect(editor.blocks[2].id).toBe('block2');
                expect(editor.blocks[3].id).toBe('block4');
                // Undo the block moved
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks.length).toBe(initialBlockCount);
                
                expect(editor.blocks[0].id).toBe('block1');
                expect(editor.blocks[1].id).toBe('block2');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');
                // Check DOM update
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                done();
            }, 10);
        });

        it('Redo action for multiple block move', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(4);
            
            setTimeout(() => {
                editor.blockCommandManager.moveBlock({
                    fromBlockIds: ['block1', 'block2'],
                    toBlockId: 'block3'
                });
                // Check if block was moved
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('block3');
                expect(editor.blocks[1].id).toBe('block1');
                expect(editor.blocks[2].id).toBe('block2');
                expect(editor.blocks[3].id).toBe('block4');
                // Undo the block moved
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks.length).toBe(initialBlockCount);
                
                expect(editor.blocks[0].id).toBe('block1');
                expect(editor.blocks[1].id).toBe('block2');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');

                // Check DOM update
                let blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');
                
                // Redo action
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                
                // move blocks again by redoing it
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[0].id).toBe('block3');
                expect(editor.blocks[1].id).toBe('block1');
                expect(editor.blocks[2].id).toBe('block2');
                expect(editor.blocks[3].id).toBe('block4');
                
                // Check DOM update
                blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount);
                expect(blocks[0].id).toBe('block3');
                expect(blocks[1].id).toBe('block1');
                expect(blocks[2].id).toBe('block2');
                expect(blocks[3].id).toBe('block4');
                done();
            }, 10);
        });
    });

    describe('Transform blocks using slash command', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
        });
        beforeEach((done: DoneFn) => done());
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('transforming block paragraph to heading -> Undo', (done) => {
            const blockElement = block1;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const headingElement = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
            expect(headingElement).not.toBeNull();
            headingElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].type).toBe(BlockType.Heading);
            expect((editor.blocks[0].props as HeadingProps).level).toBe(1);
            setTimeout(() => {
                expect(document.getElementById('block1').querySelector('h1').textContent).toBe('Hello world');
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                expect(document.getElementById('block1').querySelector('p').textContent).toBe('Hello world');
                done();
            }, 200)
        });

        it('transforming block paragraph to heading -> Redo', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const headingElement = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
            expect(headingElement).not.toBeNull();
            headingElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].type).toBe(BlockType.Heading);
            expect((editor.blocks[0].props as HeadingProps).level).toBe(1);
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('h1').textContent).toBe('Hello world');
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                expect(editorElement.querySelector('.e-block').querySelector('p').textContent).toBe('Hello world');
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                expect(editor.blocks[0].type).toBe(BlockType.Heading);
                expect((editor.blocks[0].props as HeadingProps).level).toBe(1);
                done();
            }, 200)
        });

        it('transforming block into specialType -> Undo', (done) => {
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setTimeout(() => {
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, blockElement.textContent.length);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Hello world');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello world');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('');
                let blocks = editorElement.querySelectorAll('.e-block');
                const transFormBlockElement = blocks[1] as HTMLElement;
                expect(transFormBlockElement).not.toBeNull();
                const newContentElement = getBlockContentElement(transFormBlockElement);
                setCursorPosition(newContentElement, 0);
                newContentElement.textContent = '/' + newContentElement.textContent;
                setCursorPosition(newContentElement, 1);
                editor.stateManager.updateContentOnUserTyping(transFormBlockElement);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(slashCommandElement).not.toBeNull();
                // click heading li element inside the popup
                const dividerEle = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
                expect(dividerEle).not.toBeNull();
                dividerEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].type).toBe(BlockType.Divider);
                expect(editor.blocks[2].type).toBe(BlockType.Paragraph);
                setTimeout(() => {
                    // undo to remove the last added empty paragraph block
                    const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                    editorElement.dispatchEvent(undoEvent);
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editor.blocks[1].type).toBe(BlockType.Divider);
                    // undo to transform divider into paragraph block
                    editorElement.dispatchEvent(undoEvent);
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editor.blocks[1].type).toBe(BlockType.Paragraph);
                    // undo to remove the new block added
                    editorElement.dispatchEvent(undoEvent);
                    expect(editor.blocks.length).toBe(1);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    done();
                }, 200)
            }, 10);
        });

        it('transforming block into specialType -> redo', (done) => {
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setTimeout(() => {
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, blockElement.textContent.length);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Hello world');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello world');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('');
                let blocks = editorElement.querySelectorAll('.e-block');
                const transFormBlockElement = blocks[1] as HTMLElement;
                expect(transFormBlockElement).not.toBeNull();
                const newContentElement = getBlockContentElement(transFormBlockElement);
                setCursorPosition(newContentElement, 0);
                newContentElement.textContent = '/' + newContentElement.textContent;
                setCursorPosition(newContentElement, 1);
                editor.stateManager.updateContentOnUserTyping(transFormBlockElement);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(slashCommandElement).not.toBeNull();
                // click heading li element inside the popup
                const dividerEle = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
                expect(dividerEle).not.toBeNull();
                dividerEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].type).toBe(BlockType.Divider);
                expect(editor.blocks[2].type).toBe(BlockType.Paragraph);
                setTimeout(() => {
                    // undo to remove the last added empty paragraph block
                    const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                    editorElement.dispatchEvent(undoEvent);
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editor.blocks[1].type).toBe(BlockType.Divider);
                    // undo to transform divider into paragraph block
                    editorElement.dispatchEvent(undoEvent);
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editor.blocks[1].type).toBe(BlockType.Paragraph);
                    // undo to remove the new block added
                    editorElement.dispatchEvent(undoEvent);
                    expect(editor.blocks.length).toBe(1);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);

                    // Redo to remove the last added empty paragraph block
                    const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                    editorElement.dispatchEvent(redoEvent);
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editor.blocks[1].type).toBe(BlockType.Paragraph);

                    // Redo to transform paragraph into divider block
                    editorElement.dispatchEvent(redoEvent);
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editor.blocks[1].type).toBe(BlockType.Divider);

                    // Redo to add a new paragraph block
                    editorElement.dispatchEvent(redoEvent);
                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editor.blocks[1].type).toBe(BlockType.Divider);
                    expect(editor.blocks[2].type).toBe(BlockType.Paragraph);
                    done();
                }, 200)
            }, 10);
        });
    });

    describe('Clipboard actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function createMockClipboardEvent(type: string, clipboardData: any = {}): ClipboardEvent {
            const event: any = {
                type,
                preventDefault: jasmine.createSpy(),
                clipboardData: clipboardData,
                bubbles: true,
                cancelable: true
            };
            return event as ClipboardEvent;
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph1-content', type: ContentType.Text, content: 'First paragraph' }
                    ]
                },
                {
                    id: 'paragraph2',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph2-content', type: ContentType.Text, content: 'Second paragraph' }
                    ]
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('copy & paste whole block - UNDO & REDO', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const copiedData = editor.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(blockElement.nextElementSibling.id).toBe(editor.blocks[1].id);

                //Trigger UNDO
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');

                //Trigger REDO
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(blockElement.nextElementSibling.id).toBe(editor.blocks[1].id);
                done();
            }, 100);
        });

        it('cut & paste whole block', (done) => {
            const initialBlockCount = editor.blocks.length;
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const copiedData = editor.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editorElement.querySelector('#paragraph1')).toBeNull();

                const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
                editor.setFocusToBlock(blockElement2);
                setCursorPosition(getBlockContentElement(blockElement2), 0);
                editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(blockElement2.nextElementSibling.id).toBe(editor.blocks[1].id);

                //On First undo, the pasted block should be removed
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Second paragraph');

                //On next undo, the cut block should be restored at the original position
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');

                //On First redo, the block should be cut again
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Second paragraph');

                //On next redo, the block should be pasted again
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');

                done();
            });
        });

        it('copy & paste partial content', (done) => {
            if (editor) editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'block1',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'bold', type: ContentType.Text, content: 'Boldedtext', props: { styles: { bold: true } } },
                            { id: 'italic', type: ContentType.Text, content: 'Italictext', props: { styles: { italic: true } } },
                            { id: 'underline', type: ContentType.Text, content: 'Underlinedtext', props: { styles: { underline: true } } }
                        ]
                    },
                    {
                        id: 'block2',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'test', type: ContentType.Text, content: 'TestContent', props: { styles: { bold: true } } }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            editor.setFocusToBlock(editor.element.querySelector('#block1'));
            //create range
            var range = document.createRange();
            var startNode = editor.element.querySelector('#italic').firstChild;
            var endNode = editor.element.querySelector('#underline').firstChild;
            range.setStart(startNode, 0);
            range.setEnd(endNode, 6);
            var selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const copiedData = editor.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 4);
            const initialLength = editor.blocks[1].content.length;

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks[1].content.length).toBe(initialLength + 3);
                expect(editor.blocks[1].content[0].content).toBe('Test');
                expect(editor.blocks[1].content[1].content).toBe('Italictext');
                expect((editor.blocks[1].content[1].props as BaseStylesProp).styles.italic).toBe(true);
                expect(editor.blocks[1].content[2].content).toBe('Underl');
                expect((editor.blocks[1].content[2].props as BaseStylesProp).styles.underline).toBe(true);
                expect(editor.blocks[1].content[3].content).toBe('Content');
                expect(contentElement.childNodes.length).toBe(4);
                expect(contentElement.childNodes[1].textContent).toBe('Italictext');
                expect((contentElement.childNodes[1] as HTMLElement).tagName).toBe('EM');
                expect((contentElement.childNodes[2] as HTMLElement).textContent).toBe('Underl');
                expect((contentElement.childNodes[2] as HTMLElement).tagName).toBe('U');

                //Trigger UNDO
                triggerUndo(editorElement);
                expect(editor.blocks[1].content.length).toBe(initialLength);
                expect(editor.blocks[1].content[0].content).toBe('TestContent');
                expect(getBlockContentElement(blockElement).childNodes.length).toBe(1);

                //Trigger REDO
                triggerRedo(editorElement);
                expect(editor.blocks[1].content.length).toBe(initialLength + 3);
                expect(editor.blocks[1].content[0].content).toBe('Test');
                expect(editor.blocks[1].content[1].content).toBe('Italictext');
                expect((editor.blocks[1].content[1].props as BaseStylesProp).styles.italic).toBe(true);
                expect(editor.blocks[1].content[2].content).toBe('Underl');
                expect((editor.blocks[1].content[2].props as BaseStylesProp).styles.underline).toBe(true);
                expect(editor.blocks[1].content[3].content).toBe('Content');
                expect(contentElement.childNodes.length).toBe(4);
                expect(contentElement.childNodes[1].textContent).toBe('Italictext');
                expect((contentElement.childNodes[1] as HTMLElement).tagName).toBe('EM');
                expect((contentElement.childNodes[2] as HTMLElement).textContent).toBe('Underl');
                expect((contentElement.childNodes[2] as HTMLElement).tagName).toBe('U');
                done();
            }, 100);
        });

        it('multi block paste when cursor is at middle', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
            const copiedData = editor.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            setCursorPosition(getBlockContentElement(blockElement), 6);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // First block will be splitted at cursor and clipboard's first block content gets merged here
            // Remaining clipboard blocks will be added after this block
            // So, total blocks will be 4
            setTimeout(() => {
                expect(editor.blocks.length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

                expect(editor.blocks[0].content[0].content).toBe('First ');
                expect(editor.blocks[0].content[1].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[2].content[0].content).toBe('paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');

                //Trigger UNDO
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');

                //Trigger REDO
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

                expect(editor.blocks[0].content[0].content).toBe('First ');
                expect(editor.blocks[0].content[1].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[2].content[0].content).toBe('paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('multi block paste when cursor is at start', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
            const copiedData = editor.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            setCursorPosition(getBlockContentElement(blockElement), 0);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // All Clipboard blocks will be pasted after the focused block
            // So, total blocks will be 4
            setTimeout(() => {
                expect(editor.blocks.length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(editor.blocks[2].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');

                //Trigger UNDO
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');

                //Trigger REDO
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(editor.blocks[2].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('multi block paste when cursor is at empty block', function (done) {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
            const copiedData = editor.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '';
            editor.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 0);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(function () {
                expect(editor.blocks.length).toBe(3);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[2].content[0].content).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('Second paragraph');

                //Trigger UNDO
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');

                //Trigger REDO
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(3);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                done();
            });
        });
    });

    describe('Selective Deletion of blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function triggerUndo(editorElement: HTMLElement) : void {
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
        }

        function triggerRedo(editorElement: HTMLElement) : void {
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph', type: BlockType.Paragraph, content: [
                    { id: 'p-content', type: ContentType.Text, content: 'Paragraph ' },
                    { id: 'bolded-content', type: ContentType.Text, content: 'content', props: { styles: { bold: true } } },
                ] },
                { id: 'heading', type: BlockType.Heading, props: { level: 3  }, content: [
                    { id: 'h-content', type: ContentType.Text, content: 'Heading ' },
                    { id: 'italic-content', type: ContentType.Text, content: 'content', props: { styles: { italic: true } } },
                ] },
                { id: 'bullet-list', type: BlockType.BulletList, content: [
                    { id: 'bullet-list-content', type: ContentType.Text, content: 'Bullet list ' },
                    { id: 'underline-content', type: ContentType.Text, content: 'content', props: { styles: { underline: true } } },
                ] },
                { id: 'quote', type: BlockType.Quote, content: [
                    { id: 'q-content', type: ContentType.Text, content: 'Quote ' },
                    { id: 'strike-content', type: ContentType.Text, content: 'content', props: { styles: { strikethrough: true } } },
                ] }
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

        it('Entire editor deletion using backspace', (done) => {
            editor.setFocusToBlock(editorElement.querySelector('#paragraph'));
            editor.selectAllBlocks();
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
            const emptyBlockId = editor.blocks[0].id;

            triggerUndo(editorElement);
            expect(editor.blocks.length).toBe(4);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(4);

            triggerRedo(editorElement);
            expect(editor.blocks.length).toBe(1);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].id === emptyBlockId).toBe(true);
            done();
        });

        it('Partial deletion using backspace', (done) => {
            const range = document.createRange();
            const selection = document.getSelection();
            const startBlockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const startNode = startBlockElement.querySelector('#p-content').firstChild;
            const startOffset = 9;
            const endBlockElement = editorElement.querySelector('#quote') as HTMLElement;
            const endNode = endBlockElement.querySelector('#q-content').firstChild;
            const endOffset = 6;

            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            selection.removeAllRanges();
            selection.addRange(range);

            editor.setFocusToBlock(startBlockElement);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Paragraph');
            expect(editor.blocks[0].content[1].content).toBe('content');
            expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.strikethrough).toBe(true);
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');

            triggerUndo(editorElement);
            expect(editor.blocks.length).toBe(4);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(4);
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph ');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');

            triggerRedo(editorElement);
            expect(editor.blocks.length).toBe(1);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Paragraph');
            expect(editor.blocks[0].content[1].content).toBe('content');
            expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.strikethrough).toBe(true);
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');
            done();
        });
    });

    describe('Other actions', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'paragraph-content2', type: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', type: BlockType.Paragraph, content: [{ id: 'paragraph-content3', type: ContentType.Text, content: 'Block 3 content' }] }
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
    
        it('Indent and outdent blocks', (done) => {
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            editor.blockCommandManager.handleBlockIndentation({
                blockIDs: [blockElement.id],
                shouldDecrease: false
            });
            expect(editor.blocks[1].indent).toBe(1);

            triggerUndo(editorElement);

            expect(editor.blocks[1].indent).toBe(0);

            triggerRedo(editorElement);

            expect(editor.blocks[1].indent).toBe(1);
            done();
        });

        it('Line breaks addition removal', (done) => {
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 8);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, code: 'Enter' }));
            expect(editor.blocks[1].content[0].content).toContain('\n');

            triggerUndo(editorElement);
            expect(editor.blocks[1].content[0].content).not.toContain('\n');

            triggerRedo(editorElement);
            expect(editor.blocks[1].content[0].content).toContain('\n');
            done();
        });

        it('Should shift the stack when limit exceeds', (done) => {
            editor.undoRedoStack = 1;
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(blockElement.querySelector('.e-block-content'), 8);

            //Record first action
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, code: 'Enter' }));

            //Record second action - first action should be shifted out of the stack
            editor.blockCommandManager.handleBlockIndentation({
                blockIDs: [blockElement.id],
                shouldDecrease: false
            });

            expect(editor.undoRedoAction.undoStack.length).toBe(1);
            expect(editor.undoRedoAction.undoStack[0].action).toBe('indent');

            done();
        });
    });
});
