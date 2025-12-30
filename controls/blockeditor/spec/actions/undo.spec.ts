import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../src/models/enums';
import { BaseChildrenProp, BaseStylesProp, BlockModel, ICalloutBlockSettings, IChecklistBlockSettings, ICollapsibleBlockSettings, IHeadingBlockSettings, IImageBlockSettings, ILinkContentSettings, UserModel } from '../../src/models/index';
import { setSelectionRange, getBlockContentElement, setCursorPosition, getSelectedRange } from '../../src/common/utils/index';
import { createEditor } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { measurePerformanceSync } from '../common/common.spec';
import { IClipboardPayloadOptions } from '../../src/common/index';

describe('UndoRedo', () => {
    let editor: BlockEditor;
    let block1: HTMLElement, block2: HTMLElement, block3: HTMLElement, block4: HTMLElement, block5: HTMLElement;
    let editorElement: HTMLElement;

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    describe('ContentChanged', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content1', contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content2', contentType: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content3', contentType: ContentType.Text, content: 'Block 3 content' }] }
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

        it('Undo & Redo action for paragraph content changed', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const paragraph = editorElement.querySelector('#paragraph-content1');
            paragraph.textContent = 'Updated content';
            editor.blockManager.stateManager.updateContentOnUserTyping((paragraph.closest('.e-block') as HTMLElement));

            setTimeout(() => {
                editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');

                // check updated block content before undo action
                expect(modelBlocks.length).toBe(3);
                expect(domBlocks.length).toBe(3);
                expect(paragraph.textContent).toBe('Updated content');
                expect(modelBlocks[0].content[0].content).toBe('Updated content');
                
                //undo
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                //undo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(domBlocks.length).toBe(3);
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(modelBlocks[0].content[0].content).toBe('Block 1 content');

                //redo
                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);

                //redo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(domBlocks.length).toBe(3);
                expect(paragraph.textContent).toBe('Updated content');
                expect(modelBlocks[0].content[0].content).toBe('Updated content');
                done();
            }, 10);
        });

        it('Undo action when stack length is 0', (done) => {
            const paragraph = editorElement.querySelector('#paragraph-content1');
            setTimeout(() => {
                editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                done();
            }, 10);
        });

        it('Redo action when stack length is 0', (done) => {
            const paragraph = editorElement.querySelector('#paragraph-content1');
            setTimeout(() => {
                editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // no content changes after undo as stack is empty
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                // no content changes after redo as stack is empty
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                done();
            }, 10);
        });

        it('Undo action for content split', (done) => {
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            setTimeout(() => {
                editor.blockManager.setFocusToBlock(blockElement);
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
                expect(editor.blocks[1].content[0].content).toBe('Block 2 content');
                expect(editor.blocks[2].content[0].content).toBe('Block 3 content');
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
                editor.blockManager.setFocusToBlock(blockElement);
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
                expect(editor.blocks[1].content[0].content).toBe('Block 2 content');
                expect(editor.blocks[2].content[0].content).toBe('Block 3 content');
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

        it('Check Floating icons position during Undo & Redo action for paragraph content changed', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const paragraph = editorElement.querySelector('#paragraph-content1');
            paragraph.textContent = 'Updated content';
            editor.blockManager.stateManager.updateContentOnUserTyping((paragraph.closest('.e-block') as HTMLElement));

            setTimeout(() => {
                editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');

                // check updated block content before undo action
                expect(modelBlocks.length).toBe(3);
                expect(domBlocks.length).toBe(3);
                expect(paragraph.textContent).toBe('Updated content');
                expect(modelBlocks[0].content[0].content).toBe('Updated content');
                
                //undo
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // check floating icon present inside focused block
                let floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
                let floatingIconsRect = floatingIcons.getBoundingClientRect();
                let focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
                expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
                expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);

                //undo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(domBlocks.length).toBe(3);
                expect(paragraph.textContent).toBe('Block 1 content');
                expect(modelBlocks[0].content[0].content).toBe('Block 1 content');

                //redo
                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);

                // check floating icon present inside focused block
                floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
                floatingIconsRect = floatingIcons.getBoundingClientRect();
                focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
                expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
                expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);

                //redo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(domBlocks.length).toBe(3);
                expect(paragraph.textContent).toBe('Updated content');
                expect(modelBlocks[0].content[0].content).toBe('Updated content');
                done();
            }, 10);
        });
    });

    describe('Single-Block Formatting Action', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content1', contentType: ContentType.Text, content: 'Block 1 content' }] },
                {
                    id: 'callout', blockType: BlockType.Callout, properties: {
                        children: [
                            {
                                id: 'callout-block-1', blockType: BlockType.Paragraph, content: [{ id: 'callout-content-1', contentType: ContentType.Text, content: 'Callout item 1' }],
                            }
                        ]
                    }
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
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Block ');
                expect(contentElement.querySelector('span').textContent).toBe('1 content');
                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Block 1 content');
                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
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
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Block ');
                expect(contentElement.querySelector('span').textContent).toBe('1 content');
                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Block 1 content');
                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();

                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                // check updated block content after redo action
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Block ');
                expect(contentElement.querySelector('span').textContent).toBe('1 content');
                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
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
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Callout ');
                expect(contentElement.querySelector('span').textContent).toBe('item 1');
                expect(((editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Callout item 1');
                expect(((editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
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
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Callout ');
                expect(contentElement.querySelector('span').textContent).toBe('item 1');
                expect(((editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // check updated block content after undo action
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('Callout item 1');
                expect(((editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();

                const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.querySelector('strong').textContent).toBe('Callout ');
                expect(contentElement.querySelector('span').textContent).toBe('item 1');
                expect(((editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                done();
            }, 10);
        });
    });

    describe('Multi-Block Formatting Action', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    blockType: BlockType.Paragraph,
                    content: [{
                        id: 'p1-content',
                        contentType: ContentType.Text,
                        content: 'First paragraph text'
                    }]
                },
                {
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: { level: 2 },
                    content: [{
                        id: 'h1-content',
                        contentType: ContentType.Text,
                        content: 'Heading text content'
                    }]
                },
                {
                    id: 'quote1',
                    blockType: BlockType.Quote,
                    content: [{
                        id: 'q1-content',
                        contentType: ContentType.Text,
                        content: 'Quote text content'
                    }]
                }
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

        it('should undo multi-block bold formatting', (done) => {
            setTimeout(() => {
                // Create multi-block selection
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;

                const firstContent = getBlockContentElement(firstBlock);
                const secondContent = getBlockContentElement(secondBlock);

                const range = document.createRange();
                range.setStart(firstContent.firstChild, 6); // Start from "paragraph"
                range.setEnd(secondContent.firstChild, 7); // End at "Heading"

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply bold formatting
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                // Verify bold was applied
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);

                // Verify DOM changes
                expect(firstContent.querySelector('strong')).not.toBeNull();
                expect(secondContent.querySelector('strong')).not.toBeNull();

                // Trigger undo
                triggerUndo(editorElement);

                // Verify bold was removed
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);

                // Verify DOM was restored
                expect(firstContent.textContent).toBe('First paragraph text');
                expect(secondContent.textContent).toBe('Heading text content');
                expect(firstContent.querySelector('strong')).toBeNull();
                expect(secondContent.querySelector('strong')).toBeNull();

                done();
            }, 100);
        });

        it('should redo multi-block bold formatting', (done) => {
            setTimeout(() => {
                // Create multi-block selection
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;
                const thirdBlock = editorElement.querySelector('#quote1') as HTMLElement;

                const firstContent = getBlockContentElement(firstBlock);
                const secondContent = getBlockContentElement(secondBlock);
                const thirdContent = getBlockContentElement(thirdBlock);

                const range = document.createRange();
                range.setStart(firstContent.firstChild, 0);
                range.setEnd(thirdContent.firstChild, 5); // End at "Quote"

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply italic formatting
                editor.blockManager.formattingAction.execCommand({ command: 'italic' });

                // Verify italic was applied
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[2].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);

                expect(firstContent.querySelector('em')).not.toBeNull();
                expect(secondContent.querySelector('em')).not.toBeNull();
                expect(thirdContent.querySelector('em')).not.toBeNull();

                // Trigger undo
                triggerUndo(editorElement);

                // Verify italic was removed
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[2].content.every(c => !(c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);

                expect(firstContent.querySelector('em')).toBeNull();
                expect(secondContent.querySelector('em')).toBeNull();
                expect(thirdContent.querySelector('em')).toBeNull();
                // Trigger redo
                triggerRedo(editorElement);

                // Verify italic was reapplied
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[2].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);

                // Verify DOM updates
                expect(firstContent.querySelector('em')).not.toBeNull();
                expect(getBlockContentElement(editorElement.querySelector('#heading1')).querySelector('em')).not.toBeNull();
                expect(thirdContent.querySelector('em')).not.toBeNull();

                done();
            }, 100);
        });

        it('should handle undo/redo for multiple formatting operations on multi-block selection', (done) => {
            setTimeout(() => {
                // Create multi-block selection
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;

                const firstContent = getBlockContentElement(firstBlock);
                const secondContent = getBlockContentElement(secondBlock);

                const range = document.createRange();
                range.setStart(firstContent.firstChild, 0);
                range.setEnd(secondContent.firstChild, secondContent.firstChild.textContent.length);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply multiple formats
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });
                editor.blockManager.formattingAction.execCommand({ command: 'italic' });
                editor.blockManager.formattingAction.execCommand({ command: 'underline' });

                // Verify all formats were applied
                expect(editor.blocks[0].content.some(c => {
                    const styles = (c.properties as BaseStylesProp).styles;
                    return (styles.bold || styles.italic || styles.underline) as boolean;
                })).toBe(true);

                expect(editor.blocks[1].content.some(c => {
                    const styles = (c.properties as BaseStylesProp).styles;
                    return (styles.bold || styles.italic || styles.underline) as boolean;
                })).toBe(true);

                expect(firstContent.querySelector('strong')).not.toBeNull();
                expect(firstContent.querySelector('em')).not.toBeNull();
                expect(firstContent.querySelector('u')).not.toBeNull();

                expect(secondContent.querySelector('strong')).not.toBeNull();
                expect(secondContent.querySelector('em')).not.toBeNull();
                expect(secondContent.querySelector('u')).not.toBeNull();

                // Undo underline
                triggerUndo(editorElement);
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.underline as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.underline as boolean)).toBe(true);
                expect(firstContent.querySelector('u')).toBeNull();
                expect(secondContent.querySelector('u')).toBeNull();

                // Undo italic
                triggerUndo(editorElement);
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(firstContent.querySelector('em')).toBeNull();
                expect(secondContent.querySelector('em')).toBeNull();

                // Undo bold
                triggerUndo(editorElement);
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(firstContent.querySelector('strong')).toBeNull();
                expect(secondContent.querySelector('strong')).toBeNull();

                // Redo all operations
                triggerRedo(editorElement); // bold
                triggerRedo(editorElement); // italic  
                triggerRedo(editorElement); // underline

                // Verify all formats were reapplied
                expect(firstContent.querySelector('strong')).not.toBeNull();
                expect(firstContent.querySelector('em')).not.toBeNull();
                expect(firstContent.querySelector('u')).not.toBeNull();

                expect(secondContent.querySelector('strong')).not.toBeNull();
                expect(secondContent.querySelector('em')).not.toBeNull();
                expect(secondContent.querySelector('u')).not.toBeNull();

                done();
            }, 100);
        });

        it('should handle undo/redo for color formatting on multi-block selection', (done) => {
            setTimeout(() => {
                // Create multi-block selection
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;
                const firstContent = getBlockContentElement(firstBlock);
                const secondContent = getBlockContentElement(secondBlock);

                const range = document.createRange();
                range.setStart(getBlockContentElement(firstBlock).firstChild, 5);
                range.setEnd(getBlockContentElement(secondBlock).firstChild, 7);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply color formatting
                editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });

                // Verify color was applied
                expect(editor.blocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.color as string) === '#FF0000')).toBe(true);
                expect(editor.blocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.color as string) === '#FF0000')).toBe(true);
                expect(firstContent.querySelector('[style*="color: rgb(255, 0, 0)"]')).not.toBeNull();
                expect(secondContent.querySelector('[style*="color: rgb(255, 0, 0)"]')).not.toBeNull();
                // Trigger undo
                triggerUndo(editorElement);

                // Verify color was removed
                expect(editor.blocks[0].content.every(c => !((c.properties as BaseStylesProp).styles.color as string))).toBe(true);
                expect(editor.blocks[1].content.every(c => !((c.properties as BaseStylesProp).styles.color as string))).toBe(true);
                expect(firstContent.querySelector('[style*="color: rgb(255, 0, 0)"]')).toBeNull();
                expect(secondContent.querySelector('[style*="color: rgb(255, 0, 0)"]')).toBeNull();

                // Trigger redo
                triggerRedo(editorElement);

                // Verify color was reapplied
                expect(editor.blocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.color as string) === '#FF0000')).toBe(true);
                expect(editor.blocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.color as string) === '#FF0000')).toBe(true);
                expect(firstContent.querySelector('[style*="color: rgb(255, 0, 0)"]')).not.toBeNull();
                expect(secondContent.querySelector('[style*="color: rgb(255, 0, 0)"]')).not.toBeNull();
                done();
            }, 100);
        });

        it('should handle undo/redo for superscript/subscript toggle on multi-block selection', (done) => {
            setTimeout(() => {
                // Create multi-block selection
                const blocks = [
                    editorElement.querySelector('#paragraph1') as HTMLElement,
                    editorElement.querySelector('#heading1') as HTMLElement
                ];

                const firstContent = getBlockContentElement(blocks[0]);
                const secondContent = getBlockContentElement(blocks[1]);

                const range = document.createRange();
                range.setStart(getBlockContentElement(blocks[0]).firstChild, 0);
                range.setEnd(getBlockContentElement(blocks[1]).firstChild, 5);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply superscript
                editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

                // Verify superscript was applied
                expect(editor.blocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);
                expect(editor.blocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);
                expect(firstContent.querySelector('sup')).not.toBeNull();
                expect(secondContent.querySelector('sup')).not.toBeNull();

                // Apply subscript (should toggle off superscript)
                editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

                // Verify subscript was applied and superscript removed
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.subscript as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.subscript as boolean)).toBe(true);
                expect(editor.blocks[0].content.every(c => !((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);
                expect(editor.blocks[1].content.every(c => !((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);

                expect(firstContent.querySelector('sub')).not.toBeNull();
                expect(secondContent.querySelector('sub')).not.toBeNull();

                expect(firstContent.querySelector('sup')).toBeNull();
                expect(secondContent.querySelector('sup')).toBeNull();
                            
                // Undo subscript
                triggerUndo(editorElement);

                // Verify subscript removed and superscript restored
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.subscript as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.subscript as boolean)).toBe(true);
                expect(editor.blocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);
                expect(editor.blocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);

                expect(firstContent.querySelector('sub')).toBeNull();
                expect(secondContent.querySelector('sub')).toBeNull();

                expect(firstContent.querySelector('sup')).not.toBeNull();
                expect(secondContent.querySelector('sup')).not.toBeNull();


                // Undo superscript
                triggerUndo(editorElement);

                // Verify all formatting removed
                expect(editor.blocks[0].content.every(c => !((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);
                expect(editor.blocks[1].content.every(c => !((c.properties as BaseStylesProp).styles.superscript as boolean))).toBe(true);
                expect(firstContent.querySelector('sup')).toBeNull();
                expect(secondContent.querySelector('sup')).toBeNull();

                done();
            }, 100);
        });

        it('should preserve selection state during multi-block formatting undo/redo', (done) => {
            setTimeout(() => {
                // Create multi-block selection
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;

                const range = document.createRange();
                range.setStart(getBlockContentElement(firstBlock).firstChild, 3);
                range.setEnd(getBlockContentElement(secondBlock).firstChild, 8);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Store initial selection info
                const initialRangeText = range.toString();

                // Apply formatting
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                triggerUndo(editorElement);
                triggerRedo(editorElement);

                // Verify formatting was reapplied
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);

                expect(initialRangeText === getSelectedRange().toString()).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Single and Multi-Block Addition', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content1', contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content2', contentType: ContentType.Text, content: 'Block 2 content' }] },
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

            const newBlock: BlockModel = {
                id: 'block3',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content3', contentType: ContentType.Text, content: 'Block 3 content' }
                ]
            };

            setTimeout(() => {
                editor.blockManager.editorMethods.addBlock(newBlock, 'block2', true);
                // Check if block was added
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');
                let updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[2].id).toBe('block3');
                // Undo the block addition
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);
                // Check if block was removed after undo
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[2]).toBeUndefined();

                // Check DOM update
                updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(initialBlockCount);
                expect(updatedBlocks[0].id).toBe('block1');
                expect(updatedBlocks[1].id).toBe('block2');
                expect(document.getElementById('block3')).toBeNull();
                done();
            }, 10);
        });

        it('Redo action for single block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            const newBlock: BlockModel = {
                id: 'block3',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content3', contentType: ContentType.Text, content: 'Block 3 content' }
                ]
            };

            setTimeout(() => {
                editor.blockManager.editorMethods.addBlock(newBlock, 'block2', true);
                // Check if block was added
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');
                let updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[2].id).toBe('block3');
                // Undo the block addition
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // Check if block was removed after undo
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[2]).toBeUndefined();
                // Redo the block addition
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);

                // Check if block was added back after redo
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');

                // Check DOM update
                updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(initialBlockCount + 1);
                expect(updatedBlocks[0].id).toBe('block1');
                expect(updatedBlocks[1].id).toBe('block2');
                expect(updatedBlocks[2].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');

                done();
            }, 10);
        });

        it('Check Floating icons position during Undo & Redo action for block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            const newBlock: BlockModel = {
                id: 'block3',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content3', contentType: ContentType.Text, content: 'Block 3 content' }
                ]
            };

            setTimeout(() => {
                editor.blockManager.editorMethods.addBlock(newBlock, 'block2', true);
                // Check if block was added
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');
                let updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(3);
                expect(updatedBlocks[2].id).toBe('block3');
                // Undo the block addition
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // check floating icon present inside focused block
                let floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
                let floatingIconsRect = floatingIcons.getBoundingClientRect();
                let focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
                expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
                expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);

                // Check if block was removed after undo
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[2]).toBeUndefined();
                // Redo the block addition
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);

                // check floating icon present inside focused block
                floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
                floatingIconsRect = floatingIcons.getBoundingClientRect();
                focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
                expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
                expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);

                // Check if block was added back after redo
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');

                // Check DOM update
                updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(initialBlockCount + 1);
                expect(updatedBlocks[0].id).toBe('block1');
                expect(updatedBlocks[1].id).toBe('block2');
                expect(updatedBlocks[2].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();
                expect(updatedBlocks[2].textContent).toContain('Block 3 content');

                done();
            }, 10);
        });

        it('Undo action for multiple block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            const newBlock1: BlockModel = {
                id: 'block3',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content3', contentType: ContentType.Text, content: 'Block 3 content' }
                ]
            };

            setTimeout(() => {
                editor.blockManager.editorMethods.addBlock(newBlock1, 'block2', true);
                const newBlock2: BlockModel = {
                    id: 'block4',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'content4', contentType: ContentType.Text, content: 'Block 4 content' }
                    ]
                };

                editor.blockManager.editorMethods.addBlock(newBlock2, 'block3', true);
                // Check if both blocks were added
                expect(editor.blocks.length).toBe(initialBlockCount + 2);
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');

                let updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(4);
                expect(updatedBlocks[2].id).toBe('block3');
                expect(updatedBlocks[3].id).toBe('block4');
                // Undo the last block addition (block4)
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                // Check if block4 was removed
                updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[3]).toBeUndefined();
                expect(updatedBlocks.length).toBe(3);
                expect(document.getElementById('block4')).toBeNull();

                // Undo the first block addition (block3)
                editorElement.dispatchEvent(undoEvent);

                // Check if block3 was removed
                updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(editor.blocks[2]).toBeUndefined();
                expect(updatedBlocks.length).toBe(2);
                expect(document.getElementById('block3')).toBeNull();
                done();
            }, 10);
        });

        it('Redo action for multiple block addition', (done) => {
            // Initial block count
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(2);

            // Add block3
            const newBlock1: BlockModel = {
                id: 'block3',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content3', contentType: ContentType.Text, content: 'Block 3 content' }
                ]
            };

            setTimeout(() => {
                editor.blockManager.editorMethods.addBlock(newBlock1, 'block2', true);
                const newBlock2: BlockModel = {
                    id: 'block4',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'content4', contentType: ContentType.Text, content: 'Block 4 content' }
                    ]
                };

                editor.blockManager.editorMethods.addBlock(newBlock2, 'block3', true);
                // Check if both blocks were added
                expect(editor.blocks.length).toBe(initialBlockCount + 2);
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');

                let updatedBlocks = editorElement.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(4);
                expect(updatedBlocks[2].id).toBe('block3');
                expect(updatedBlocks[3].id).toBe('block4');
                // Undo twice to remove both blocks
                const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
                editorElement.dispatchEvent(undoEvent);

                editorElement.dispatchEvent(undoEvent);

                // Check if both blocks were removed
                expect(editor.blocks.length).toBe(initialBlockCount);
                expect(document.getElementById('block3')).toBeNull();
                expect(document.getElementById('block4')).toBeNull();
                expect(editor.blocks[3]).toBeUndefined();
                expect(editor.blocks[4]).toBeUndefined();

                // Redo to add block3 back
                const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
                editorElement.dispatchEvent(redoEvent);

                // Check if block3 was added back
                expect(editor.blocks.length).toBe(initialBlockCount + 1);
                expect(editor.blocks[2].id).toBe('block3');
                expect(document.getElementById('block3')).not.toBeNull();

                // Redo to add block4 back
                editorElement.dispatchEvent(redoEvent);

                // Check final DOM state
                const blocks = editorElement.querySelectorAll('.e-block');
                expect(blocks.length).toBe(initialBlockCount + 2);
                expect(blocks[0].id).toBe('block1');
                expect(blocks[1].id).toBe('block2');
                expect(blocks[2].id).toBe('block3');
                expect(blocks[3].id).toBe('block4');

                expect(editor.blocks.length).toBe(initialBlockCount + 2);
                expect(editor.blocks[0].id).toBe('block1');
                expect(editor.blocks[1].id).toBe('block2');
                expect(editor.blocks[2].id).toBe('block3');
                expect(editor.blocks[3].id).toBe('block4');
                done();
            }, 10);
        });

        it('Enter first, perform UndoRedo, Enter again', (done) => {
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            setTimeout(() => {
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 6);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('Block ');
                expect(editor.blocks[1].content[0].content).toBe('1 content');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Block ');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('1 content');

                //Undo
                triggerUndo(editorElement);

                //Model
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Block 1 content');
                expect(editor.blocks[1].content[0].content).toBe('Block 2 content');

                //DOM
                const updatedBlocks = editor.element.querySelectorAll('.e-block');
                expect(updatedBlocks.length).toBe(2);
                expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                expect(updatedBlocks[1].textContent).toContain('Block 2 content');

                // Enter again
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('Block ');
                expect(editor.blocks[1].content[0].content).toBe('1 content');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Block ');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('1 content');
                done();
            }, 10);
        });
    });

    describe('Single and Multi-Block Deletion', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content1', contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content2', contentType: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content3', contentType: ContentType.Text, content: 'Block 3 content' }] },
                { id: 'block4', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content4', contentType: ContentType.Text, content: 'Block 4 content' }] },
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

        it('Undo & Redo action for single block deletion', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            //before removal
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);

            editor.blockManager.editorMethods.removeBlock('block4');

            //after removal
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[3]).toBeUndefined();
            expect(domBlocks.length).toBe(3);
            expect(document.getElementById('block4')).toBeNull();

            //undo
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);

            //redo
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[3]).toBeUndefined();
            expect(domBlocks.length).toBe(3);
            expect(document.getElementById('block4')).toBeNull();
            done();
        });

        it('Check Floating icons position during Undo & Redo for block deletion', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            //before removal
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);

            editor.blockManager.editorMethods.removeBlock('block4');

            //after removal
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[3]).toBeUndefined();
            expect(domBlocks.length).toBe(3);
            expect(document.getElementById('block4')).toBeNull();

            //undo
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            // check floating icon present inside focused block
            let floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
            let floatingIconsRect = floatingIcons.getBoundingClientRect();
            let focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
            expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
            expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);

            //redo
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            // check floating icon present inside focused block
            floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
            floatingIconsRect = floatingIcons.getBoundingClientRect();
            focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
            expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
            expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[3]).toBeUndefined();
            expect(domBlocks.length).toBe(3);
            expect(document.getElementById('block4')).toBeNull();
            done();
        });

        it('Undo & Redo action for multiple block deletion', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            //before removal
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);

            // remove block3 and block4
            editor.blockManager.editorMethods.removeBlock('block4');
            editor.blockManager.editorMethods.removeBlock('block3');

            //after removal
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks.find(b => b.id === 'block4')).toBeUndefined();
            expect(modelBlocks.find(b => b.id === 'block3')).toBeUndefined();
            expect(domBlocks.length).toBe(2);
            expect(document.getElementById('block4')).toBeNull();
            expect(document.getElementById('block3')).toBeNull();

            //undo1
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[2].id).toBe('block3');
            expect(modelBlocks.find(b => b.id === 'block4')).toBeUndefined();
            expect(modelBlocks.find(b => b.id === 'block3')).not.toBeUndefined();
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[2].id).toBe('block3');
            expect(document.getElementById('block3')).not.toBeNull();
            expect(document.getElementById('block4')).toBeNull();

            //undo2
            editorElement.dispatchEvent(undoEvent);

            //undo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks.find(b => b.id === 'block4')).not.toBeUndefined();
            expect(domBlocks.length).toBe(4);
            expect(document.getElementById('block4')).not.toBeNull();

            //redo1
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks.find(b => b.id === 'block3')).not.toBeUndefined();
            expect(modelBlocks.find(b => b.id === 'block4')).toBeUndefined();
            expect(domBlocks.length).toBe(3);
            expect(document.getElementById('block3')).not.toBeNull();
            expect(document.getElementById('block4')).toBeNull();

            //redo2
            editorElement.dispatchEvent(redoEvent);

            //redo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks.find(b => b.id === 'block3')).toBeUndefined();
            expect(modelBlocks.find(b => b.id === 'block4')).toBeUndefined();
            expect(domBlocks.length).toBe(2);
            expect(document.getElementById('block3')).toBeNull();
            expect(document.getElementById('block4')).toBeNull();
            done();
        });
    });

    describe('Single and Multi-Block Move action', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content1', contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content2', contentType: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content3', contentType: ContentType.Text, content: 'Block 3 content' }] },
                { id: 'block4', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content4', contentType: ContentType.Text, content: 'Block 4 content' }] },
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

        it('Undo & Redo action for single block Move', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');

            //before blockmove
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);

            editor.blockManager.blockCommand.moveBlock({
                fromBlockIds: ['block1'],
                toBlockId: 'block2'
            });

            //after blockmove
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].id).toBe('block2');
            expect(modelBlocks[1].id).toBe('block1');
            expect(modelBlocks[2].id).toBe('block3');
            expect(domBlocks.length).toBe(4);
            expect(domBlocks[0].id).toBe('block2');
            expect(domBlocks[1].id).toBe('block1');
            expect(domBlocks[2].id).toBe('block3');

            //undo
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].id).toBe('block1');
            expect(modelBlocks[1].id).toBe('block2');
            expect(modelBlocks[2].id).toBe('block3');
            expect(domBlocks.length).toBe(4);
            expect(domBlocks[0].id).toBe('block1');
            expect(domBlocks[1].id).toBe('block2');
            expect(domBlocks[2].id).toBe('block3');

            //redo
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].id).toBe('block2');
            expect(modelBlocks[1].id).toBe('block1');
            expect(modelBlocks[2].id).toBe('block3');
            expect(domBlocks.length).toBe(4);
            expect(domBlocks[0].id).toBe('block2');
            expect(domBlocks[1].id).toBe('block1');
            expect(domBlocks[2].id).toBe('block3');
            done();
        });

        it('Undo & Redo action for multiple block move', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');

            //before blockmove
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);

            editor.blockManager.blockCommand.moveBlock({
                fromBlockIds: ['block1', 'block2'],
                toBlockId: 'block3'
            });

            //after blockmove
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].id).toBe('block3');
            expect(modelBlocks[1].id).toBe('block1');
            expect(modelBlocks[2].id).toBe('block2');
            expect(modelBlocks[3].id).toBe('block4');
            expect(domBlocks.length).toBe(4);
            expect(domBlocks[0].id).toBe('block3');
            expect(domBlocks[1].id).toBe('block1');
            expect(domBlocks[2].id).toBe('block2');
            expect(domBlocks[3].id).toBe('block4');

            //undo
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].id).toBe('block1');
            expect(modelBlocks[1].id).toBe('block2');
            expect(modelBlocks[2].id).toBe('block3');
            expect(modelBlocks[3].id).toBe('block4');
            expect(domBlocks.length).toBe(4);
            expect(domBlocks[0].id).toBe('block1');
            expect(domBlocks[1].id).toBe('block2');
            expect(domBlocks[2].id).toBe('block3');
            expect(domBlocks[3].id).toBe('block4');

            //redo
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].id).toBe('block3');
            expect(modelBlocks[1].id).toBe('block1');
            expect(modelBlocks[2].id).toBe('block2');
            expect(modelBlocks[3].id).toBe('block4');
            expect(domBlocks.length).toBe(4);
            expect(domBlocks[0].id).toBe('block3');
            expect(domBlocks[1].id).toBe('block1');
            expect(domBlocks[2].id).toBe('block2');
            expect(domBlocks[3].id).toBe('block4');
            done();
        });
    });

    describe('Transform blocks using slash command', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }]
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

        it('Undo & Redo of transforming block paragraph to heading', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = block1;
            editor.blockManager.setFocusToBlock(blockElement);
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const headingElement = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
            expect(headingElement).not.toBeNull();
            headingElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            //transform check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');

            //undo
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1')).toBeNull();
            expect(domBlocks[0].querySelector('p').textContent).toBe('Hello world');

            //redo
            expect(editorElement.querySelector('.e-block').querySelector('p').textContent).toBe('Hello world');
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });

        it('Undo & Redo of transforming empty paragraph into Divider', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, blockElement.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            //ui change
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].textContent).toBe('Hello world');
            expect(domBlocks[1].textContent).toBe('');
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const transFormBlockElement = domBlocks[1] as HTMLElement;
            expect(transFormBlockElement).not.toBeNull();
            const newContentElement = getBlockContentElement(transFormBlockElement);
            setCursorPosition(newContentElement, 0);
            newContentElement.textContent = '/' + newContentElement.textContent;
            setCursorPosition(newContentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(transFormBlockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();

            // click heading li element inside the popup
            const dividerEle = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
            expect(dividerEle).not.toBeNull();
            dividerEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            //after transform
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('hr')).not.toBeNull(); // Divider
            expect(domBlocks[2].querySelector('p')).not.toBeNull();

            //undo1
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();

            //undo2
            editorElement.dispatchEvent(undoEvent);

            //undo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('hr')).toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull();

            //undo3
            editorElement.dispatchEvent(undoEvent);

            //undo3 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull()

            // Redo1 to remove the last added empty paragraph block
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull()

            // Redo2 to transform paragraph into divider block
            editorElement.dispatchEvent(redoEvent);

            //redo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).toBeNull();
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();

            // Redo3 to add a new paragraph block
            editorElement.dispatchEvent(redoEvent);

            //redo3 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).toBeNull();
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            done();
        });

        it('Undo & Redo of transforming empty paragraph into Callout', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, blockElement.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            //ui change
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].textContent).toBe('Hello world');
            expect(domBlocks[1].textContent).toBe('');
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const transFormBlockElement = domBlocks[1] as HTMLElement;
            expect(transFormBlockElement).not.toBeNull();
            const newContentElement = getBlockContentElement(transFormBlockElement);
            setCursorPosition(newContentElement, 0);
            newContentElement.textContent = '/' + newContentElement.textContent;
            setCursorPosition(newContentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(transFormBlockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();

            // click heading li element inside the popup
            const calloutEle = slashCommandElement.querySelector('li[data-value="Callout"]') as HTMLElement;
            expect(calloutEle).not.toBeNull();
            calloutEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            //after transform
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull(); // Divider
            expect(domBlocks[2].querySelector('p')).not.toBeNull();

            //undo1
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();

            //undo2
            editorElement.dispatchEvent(undoEvent);

            //undo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('.e-callout-content')).toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull();

            //undo3
            editorElement.dispatchEvent(undoEvent);

            //undo3 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull()

            // Redo1 to remove the last added empty paragraph block
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull()

            // Redo2 to transform paragraph into divider block
            editorElement.dispatchEvent(redoEvent);

            //redo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();

            // Redo3 to add a new paragraph block
            editorElement.dispatchEvent(redoEvent);

            //redo3 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            done();
        });

        it('Undo & Redo of transforming empty paragraph into Table', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#block1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, blockElement.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            //ui change
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].textContent).toBe('Hello world');
            expect(domBlocks[1].textContent).toBe('');
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const transFormBlockElement = domBlocks[1] as HTMLElement;
            expect(transFormBlockElement).not.toBeNull();
            const newContentElement = getBlockContentElement(transFormBlockElement);
            setCursorPosition(newContentElement, 0);
            newContentElement.textContent = '/' + newContentElement.textContent;
            setCursorPosition(newContentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(transFormBlockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();

            // click heading li element inside the popup
            const tableEle = slashCommandElement.querySelector('li[data-value="Table"]') as HTMLElement;
            expect(tableEle).not.toBeNull();
            tableEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            //after transform
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('table')).not.toBeNull(); // Divider
            expect(domBlocks[2].querySelector('p')).not.toBeNull();

            //undo1
            const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' });
            editorElement.dispatchEvent(undoEvent);

            //undo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('table')).not.toBeNull();

            //undo2
            editorElement.dispatchEvent(undoEvent);

            //undo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('table')).toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull();

            //undo3
            editorElement.dispatchEvent(undoEvent);

            //undo3 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull()

            // Redo1 to remove the last added empty paragraph block
            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' });
            editorElement.dispatchEvent(redoEvent);

            //redo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull()

            // Redo2 to transform paragraph into divider block
            editorElement.dispatchEvent(redoEvent);

            //redo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('table')).not.toBeNull();

            // Redo3 to add a new paragraph block
            editorElement.dispatchEvent(redoEvent);

            //redo3 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll('.e-block-container >.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            done();
        });
    });

    describe('Single & Multi-Block Clipboard actions', () => {
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
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph1-content', contentType: ContentType.Text, content: 'First paragraph' }
                    ]
                },
                {
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph2-content', contentType: ContentType.Text, content: 'Second paragraph' }
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
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('First paragraph');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[1].textContent).toBe('First paragraph');
                expect(blockElement.nextElementSibling.id).toBe(editor.blocks[1].id);

                //undo
                triggerUndo(editorElement);
                //undo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[1].textContent).toBe('Second paragraph');

                //redo
                triggerRedo(editorElement);
                //redo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('First paragraph');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[1].textContent).toBe('First paragraph');
                expect(blockElement.nextElementSibling.id).toBe(editor.blocks[1].id);
                done();
        });

        it('cut & paste whole block', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboard));

            //cut check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks.find(b => b.id === 'paragraph1')).toBeUndefined();
            expect(domBlocks.length).toBe(1);
            expect(editorElement.querySelector('#paragraph1')).toBeNull();
            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement2);
            setCursorPosition(getBlockContentElement(blockElement2), 0);
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            //paste check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[1].content[0].content).toBe('First paragraph');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[1].textContent).toBe('First paragraph');
            expect(blockElement2.nextElementSibling.id).toBe(modelBlocks[1].id);

            //undo1, the pasted block should be removed
            triggerUndo(editorElement);

            //undo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Second paragraph');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].textContent).toBe('Second paragraph');

            //undo2, the cut block should be restored at the original position
            triggerUndo(editorElement);

            //undo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].textContent).toBe('First paragraph');
            expect(domBlocks[1].textContent).toBe('Second paragraph');

            //redo1, the block should be cut again
            triggerRedo(editorElement);
            //redo1 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Second paragraph');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].textContent).toBe('Second paragraph');

            //redo2, the block should be pasted again
            triggerRedo(editorElement);
            //redo2 check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Second paragraph');
            expect(modelBlocks[1].content[0].content).toBe('First paragraph');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].textContent).toBe('Second paragraph');
            expect(domBlocks[1].textContent).toBe('First paragraph');
            done();
        });

        it('copy & paste partial content', (done) => {
            if (editor) editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'block1',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'bold', contentType: ContentType.Text, content: 'Boldedtext', properties: { styles: { bold: true } } },
                            { id: 'italic', contentType: ContentType.Text, content: 'Italictext', properties: { styles: { italic: true } } },
                            { id: 'underline', contentType: ContentType.Text, content: 'Underlinedtext', properties: { styles: { underline: true } } }
                        ]
                    },
                    {
                        id: 'block2',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'test', contentType: ContentType.Text, content: 'TestContent', properties: { styles: { bold: true } } }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            editor.blockManager.setFocusToBlock(editor.element.querySelector('#block1'));
            //create range
            var range = document.createRange();
            var startNode = editor.element.querySelector('#italic').firstChild;
            var endNode = editor.element.querySelector('#underline').firstChild;
            range.setStart(startNode, 0);
            range.setEnd(endNode, 6);
            var selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 4);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks[1].content.length).toBe(4);
                expect(modelBlocks[1].content[0].content).toBe('Test');
                expect(modelBlocks[1].content[1].content).toBe('Italictext');
                expect((modelBlocks[1].content[1].properties as BaseStylesProp).styles.italic).toBe(true);
                expect(modelBlocks[1].content[2].content).toBe('Underl');
                expect((modelBlocks[1].content[2].properties as BaseStylesProp).styles.underline).toBe(true);
                expect(modelBlocks[1].content[3].content).toBe('Content');
                expect(contentElement.childNodes.length).toBe(4);
                expect(contentElement.childNodes[1].textContent).toBe('Italictext');
                expect((contentElement.childNodes[1] as HTMLElement).tagName).toBe('EM');
                expect((contentElement.childNodes[2] as HTMLElement).textContent).toBe('Underl');
                expect((contentElement.childNodes[2] as HTMLElement).tagName).toBe('U');

                //undo
                triggerUndo(editorElement);
                //undo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks[1].content.length).toBe(1);
                expect(modelBlocks[1].content[0].content).toBe('TestContent');
                expect(getBlockContentElement(blockElement).childNodes.length).toBe(1);

                //redo
                triggerRedo(editorElement);
                //redo check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks[1].content.length).toBe(4);
                expect(modelBlocks[1].content[0].content).toBe('Test');
                expect(modelBlocks[1].content[1].content).toBe('Italictext');
                expect((modelBlocks[1].content[1].properties as BaseStylesProp).styles.italic).toBe(true);
                expect(modelBlocks[1].content[2].content).toBe('Underl');
                expect((modelBlocks[1].content[2].properties as BaseStylesProp).styles.underline).toBe(true);
                expect(modelBlocks[1].content[3].content).toBe('Content');
                expect(contentElement.childNodes.length).toBe(4);
                expect(contentElement.childNodes[1].textContent).toBe('Italictext');
                expect((contentElement.childNodes[1] as HTMLElement).tagName).toBe('EM');
                expect((contentElement.childNodes[2] as HTMLElement).textContent).toBe('Underl');
                expect((contentElement.childNodes[2] as HTMLElement).tagName).toBe('U');
                done();
            }, 100);
        });

        it('multi block paste when cursor is at middle', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            setCursorPosition(getBlockContentElement(blockElement), 6);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // First block will be splitted at cursor and clipboard's first block content gets merged here
            // Remaining clipboard blocks will be added after this block
            // So, total blocks will be 4
            //paste check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('First ');
            expect(modelBlocks[0].content[1].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(modelBlocks[2].content[0].content).toBe('paragraph');
            expect(modelBlocks[3].content[0].content).toBe('Second paragraph');
            expect(domBlocks[0].querySelector('p').textContent).toBe('First First paragraph');
            expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');
            expect(domBlocks[2].querySelector('p').textContent).toBe('paragraph');
            expect(domBlocks[3].querySelector('p').textContent).toBe('Second paragraph');

            //undo
            triggerUndo(editorElement);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('p').textContent).toBe('First paragraph');
            expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');

            //redo
            triggerRedo(editorElement);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('First ');
            expect(modelBlocks[0].content[1].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(modelBlocks[2].content[0].content).toBe('paragraph');
            expect(modelBlocks[3].content[0].content).toBe('Second paragraph');
            expect(domBlocks[0].querySelector('p').textContent).toBe('First First paragraph');
            expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');
            expect(domBlocks[2].querySelector('p').textContent).toBe('paragraph');
            expect(domBlocks[3].querySelector('p').textContent).toBe('Second paragraph');
            done();
        });

        it('multi block paste when cursor is at start', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            setCursorPosition(getBlockContentElement(blockElement), 0);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // All Clipboard blocks will be pasted after the focused block
            // So, total blocks will be 4
            //paste check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(modelBlocks[2].content[0].content).toBe('First paragraph');
            expect(modelBlocks[3].content[0].content).toBe('Second paragraph');
            expect(domBlocks[0].querySelector('p').textContent).toBe('First paragraph');
            expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');
            expect(domBlocks[2].querySelector('p').textContent).toBe('First paragraph');
            expect(domBlocks[3].querySelector('p').textContent).toBe('Second paragraph');

            //undo
            triggerUndo(editorElement);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(domBlocks[0].querySelector('p').textContent).toBe('First paragraph');
            expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');

            //redo
            triggerRedo(editorElement);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(domBlocks.length).toBe(4);
            expect(modelBlocks[0].content[1].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(modelBlocks[2].content[0].content).toBe('First paragraph');
            expect(modelBlocks[3].content[0].content).toBe('Second paragraph');
            expect(domBlocks[0].querySelector('p').textContent).toBe('First paragraph');
            expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');
            expect(domBlocks[2].querySelector('p').textContent).toBe('First paragraph');
            expect(domBlocks[3].querySelector('p').textContent).toBe('Second paragraph');
            done();
        });

        //src level issue
        it('multi block paste when cursor is at empty block', function (done) {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 0);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            //paste check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(domBlocks.length).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('First paragraph');
            expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            expect(modelBlocks[2].content[0].content).toBe('Second paragraph');
            expect(domBlocks[0].querySelector('p').textContent).toBe('First paragraph');
            expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');
            expect(domBlocks[2].querySelector('p').textContent).toBe('Second paragraph');

            //undo
            triggerUndo(editorElement);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(domBlocks.length).toBe(2);
            // expect(modelBlocks[0].content[0]).toBeUndefined();
            // expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            // expect(domBlocks[0].querySelector('p').textContent).toBe('');
            // expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');

            //redo
            triggerRedo(editorElement);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(domBlocks.length).toBe(3);
            // expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
            // expect(modelBlocks[2].content[0].content).toBe('Second paragraph');
            // expect(domBlocks[0].querySelector('p').textContent).toBe('First paragraph');
            // expect(domBlocks[1].querySelector('p').textContent).toBe('Second paragraph');
            // expect(domBlocks[2].querySelector('p').textContent).toBe('Second paragraph');
            done();
        });
    });

    describe('Selective Deletion of blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function triggerUndo(editorElement: HTMLElement): void {
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
        }

        function triggerRedo(editorElement: HTMLElement): void {
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph', blockType: BlockType.Paragraph, content: [
                        { id: 'p-content', contentType: ContentType.Text, content: 'Paragraph ' },
                        { id: 'bolded-content', contentType: ContentType.Text, content: 'content', properties: { styles: { bold: true } } },
                    ]
                },
                {
                    id: 'heading', blockType: BlockType.Heading, properties: { level: 3 }, content: [
                        { id: 'h-content', contentType: ContentType.Text, content: 'Heading ' },
                        { id: 'italic-content', contentType: ContentType.Text, content: 'content', properties: { styles: { italic: true } } },
                    ]
                },
                {
                    id: 'bullet-list', blockType: BlockType.BulletList, content: [
                        { id: 'bullet-list-content', contentType: ContentType.Text, content: 'Bullet list ' },
                        { id: 'underline-content', contentType: ContentType.Text, content: 'content', properties: { styles: { underline: true } } },
                    ]
                },
                {
                    id: 'quote', blockType: BlockType.Quote, content: [
                        { id: 'q-content', contentType: ContentType.Text, content: 'Quote ' },
                        { id: 'strike-content', contentType: ContentType.Text, content: 'content', properties: { styles: { strikethrough: true } } },
                    ]
                }
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
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            editor.blockManager.setFocusToBlock(editorElement.querySelector('#paragraph'));
            editor.selectAllBlocks();
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));

            //backspace check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();

            const emptyModelBlockId = modelBlocks[0].id;
            const emptyDomBlockId = domBlocks[0].id;

            //undo
            triggerUndo(editorElement);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
            expect(modelBlocks[2].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[3].blockType).toBe(BlockType.Quote);

            expect(domBlocks.length).toBe(4);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('h3')).not.toBeNull();
            expect(domBlocks[2].querySelector('ul')).not.toBeNull();
            expect(domBlocks[3].querySelector('blockquote')).not.toBeNull();

            //redo
            triggerRedo(editorElement);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].id === emptyModelBlockId).toBe(true);

            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].id === emptyDomBlockId).toBe(true);
            done();
        });

        it('Partial deletion using backspace', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
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

            editor.blockManager.setFocusToBlock(startBlockElement);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));

            //backspace check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Paragraph');
            expect(modelBlocks[0].content[1].content).toBe('content');
            expect((modelBlocks[0].content[1].properties as BaseStylesProp).styles.strikethrough).toBe(true);

            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');
            expect(domBlocks[0].querySelector('s')).not.toBeNull();

            //undo
            triggerUndo(editorElement);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].content.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Paragraph ');
            expect(modelBlocks[0].content[1].content).toBe('content');

            expect(domBlocks.length).toBe(4);
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph ');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');

            //redo
            triggerRedo(editorElement);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content.length).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Paragraph');
            expect(modelBlocks[0].content[1].content).toBe('content');
            expect((modelBlocks[0].content[1].properties as BaseStylesProp).styles.strikethrough).toBe(true);

            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');
            expect(domBlocks[0].querySelector('s')).not.toBeNull();
            done();
        });
    });

    describe('Entire Deletion of blocks when first block is toggle type', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function triggerUndo(editorElement: HTMLElement): void {
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
        }

        function triggerRedo(editorElement: HTMLElement): void {
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'toggleParagraph', blockType: BlockType.CollapsibleParagraph, content: [
                        { id: 'p-content', contentType: ContentType.Text, content: 'Paragraph ' },
                    ],
                    properties: {
                        children: [
                            {
                                blockType: BlockType.Paragraph,
                                content: [{
                                    id: 'p-child-content',
                                    contentType: ContentType.Text,
                                    content: 'child content.',
                                }],
                            }
                        ]
                    }
                },
                {
                    id: 'heading', blockType: BlockType.Heading, properties: { level: 3 }, content: [
                        { id: 'h-content', contentType: ContentType.Text, content: 'Heading ' },
                        { id: 'italic-content', contentType: ContentType.Text, content: 'content', properties: { styles: { italic: true } } },
                    ]
                },
                {
                    id: 'bullet-list', blockType: BlockType.BulletList, content: [
                        { id: 'bullet-list-content', contentType: ContentType.Text, content: 'Bullet list ' },
                        { id: 'underline-content', contentType: ContentType.Text, content: 'content', properties: { styles: { underline: true } } },
                    ]
                },
                {
                    id: 'quote', blockType: BlockType.Quote, content: [
                        { id: 'q-content', contentType: ContentType.Text, content: 'Quote ' },
                        { id: 'strike-content', contentType: ContentType.Text, content: 'content', properties: { styles: { strikethrough: true } } },
                    ]
                }
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
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            editor.blockManager.setFocusToBlock(editorElement.querySelector('#toggleParagraph'));
            editor.selectAllBlocks();
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));

            //backspace check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();

            const emptyModelBlockId = modelBlocks[0].id;
            const emptyDomBlockId = domBlocks[0].id;

            //undo
            triggerUndo(editorElement);

            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(4);
            expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
            expect(modelBlocks[2].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[3].blockType).toBe(BlockType.Quote);

            expect(domBlocks.length).toBe(5);
            expect(domBlocks[0].querySelector('.e-toggle-header')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull();
            expect(domBlocks[2].querySelector('h3')).not.toBeNull();
            expect(domBlocks[3].querySelector('ul')).not.toBeNull();
            expect(domBlocks[4].querySelector('blockquote')).not.toBeNull();

            //redo
            triggerRedo(editorElement);

            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].id === emptyModelBlockId).toBe(true);

            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].id === emptyDomBlockId).toBe(true);
            done();
        });
    });

    describe('Other actions', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content1', contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content2', contentType: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content3', contentType: ContentType.Text, content: 'Block 3 content' }] }
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
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            editor.blockManager.blockCommand.handleBlockIndentation({
                blockIDs: [blockElement.id],
                shouldDecrease: false
            });

            //indent check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].indent).toBe(1);
            expect(domBlocks[1].style.getPropertyValue('--block-indent')).toBe('20');

            triggerUndo(editorElement);
            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].indent).toBe(0);
            expect(domBlocks[1].style.getPropertyValue('--block-indent')).toBe('0');

            triggerRedo(editorElement);
            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].indent).toBe(1);
            expect(domBlocks[1].style.getPropertyValue('--block-indent')).toBe('20');
            done();
        });

        it('Line breaks addition removal', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 8);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, code: 'Enter' }));

            //line addition check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].content[0].content).toContain('\n');

            triggerUndo(editorElement);
            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].content[0].content).not.toContain('\n');

            triggerRedo(editorElement);
            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].content[0].content).toContain('\n');
            done();
        });

        it('Check Floating icons position during Undo & Redo Line breaks addition removal', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 8);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, code: 'Enter' }));

            //line addition check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].content[0].content).toContain('\n');

            triggerUndo(editorElement);
            //undo check
            // check floating icon present inside focused block
            let floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
            let floatingIconsRect = floatingIcons.getBoundingClientRect();
            let focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
            expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
            expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);

            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].content[0].content).not.toContain('\n');

            triggerRedo(editorElement);
            //redo check

            // check floating icon present inside focused block
            floatingIcons = document.getElementById(`${editorElement.id}_floatingicons`);
            floatingIconsRect = floatingIcons.getBoundingClientRect();
            focusedBlockRect = editor.blockManager.currentFocusedBlock.getBoundingClientRect();
            expect(floatingIconsRect.top).toBeGreaterThanOrEqual(focusedBlockRect.top);
            expect(floatingIconsRect.bottom).not.toBeGreaterThanOrEqual(focusedBlockRect.bottom);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[1].content[0].content).toContain('\n');
            done();
        });

        it('Should shift the stack when limit exceeds', (done) => {
            editor.undoRedoStack = 1;
            editor.dataBind();
            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(blockElement.querySelector('.e-block-content'), 8);

            //Record first action
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, code: 'Enter' }));

            //Record second action - first action should be shifted out of the stack
            editor.blockManager.blockCommand.handleBlockIndentation({
                blockIDs: [blockElement.id],
                shouldDecrease: false
            });

            expect(editor.blockManager.undoRedoAction.undoRedoStack.length).toBe(1);
            expect(editor.blockManager.undoRedoAction.undoRedoStack[0].action).toBe('indent');

            done();
        });

        it('should splice stack when undoStack limit decreases dynamically', function (done) {
            (editor.blockManager.undoRedoAction.undoRedoStack as any) = [ '1', '2', '3', '4', '5' ];
            (editor.blockManager.undoRedoAction.undoRedoStack as any) = [ '1', '2', '3', '4', '5' ];
            editor.undoRedoStack = 2;

            setTimeout(() => {
                expect(editor.blockManager.undoRedoAction.undoRedoStack.length).toBe(2);
                expect(editor.blockManager.undoRedoAction.undoRedoStack.length).toBe(2);
                done();
            }, 100);
        });
    });

    describe('Undo/Redo for Character and Word Deletion', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        const initialContent = 'Syncfusion Block Editor';
        
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'paragraph',
                blockType: BlockType.Paragraph,
                content: [{ id: 'p-content', contentType: ContentType.Text, content: initialContent }]
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should UNDO and REDO a single character deletion using Backspace', (done) => {
            const blockElement = editor.element.querySelector('#paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            const initialText = 'Syncfusion Block Editor';
            const expectedText = 'Syncfusion Block Edito';
            contentElement.textContent = initialText;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, initialText.length);
            contentElement.textContent = expectedText;
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            expect(editor.blocks[0].content[0].content).toBe(expectedText);

            triggerUndo(editor.element);
            expect(editor.blocks[0].content[0].content).toBe(initialText);
            expect(contentElement.textContent).toBe(initialText);

            triggerRedo(editor.element);
            expect(editor.blocks[0].content[0].content).toBe(expectedText);
            expect(contentElement.textContent).toBe(expectedText);
            done();
        });

        it('should UNDO and REDO a word deletion using Ctrl+Backspace', (done) => {
            const blockElement = editor.element.querySelector('#paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            const initialText = 'Syncfusion Block Editor';
            const expectedText = 'Syncfusion Block ';
            contentElement.textContent = initialText;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, initialText.length);
            contentElement.textContent = expectedText;
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            expect(editor.blocks[0].content[0].content).toBe(expectedText);

            triggerUndo(editor.element);
            expect(editor.blocks[0].content[0].content).toBe(initialText);
            expect(contentElement.textContent).toBe(initialText);

            triggerRedo(editor.element);
            expect(editor.blocks[0].content[0].content).toBe(expectedText);
            expect(contentElement.textContent).toBe(expectedText);
            done();
        });
    });

    describe('Undo/Redo for Inline Style Formatting', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should UNDO and REDO bold on overlapping text', (done) => {
            const blocks: BlockModel[] = [{
                id: 'paragraph',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'c1', contentType: ContentType.Text, content: 'Part one, ' },
                ]
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            const range = document.createRange();
            const textNode = contentElement.firstChild as Text;
            range.setStart(textNode, 3);
            range.setEnd(textNode, 6);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            //bold check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].content.length).toBe(3);
            expect((modelBlocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(domBlocks[0].querySelector('strong')).not.toBeNull();

            triggerUndo(editorElement);
            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].content.length).toBe(1);
            expect((modelBlocks[0].content[0].properties as BaseStylesProp).styles.bold).not.toBe(true);
            expect(domBlocks[0].querySelector('strong')).toBeNull();

            triggerRedo(editorElement);
            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].content.length).toBe(3);
            expect((modelBlocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(domBlocks[0].querySelector('strong')).not.toBeNull();
            done();
        });
    });

    describe('Undo/Redo for Multiple Formatting on a Single Paragraph', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        const initialContent = 'This is a paragraph with multiple styles';

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'paragraph1',
                blockType: BlockType.Paragraph,
                content: [{ id: 'p-content', contentType: ContentType.Text, content: initialContent }]
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should undo & redo all styles applied sequentially to a single paragraph selection', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            const textNode = contentElement.firstChild;
            const range = document.createRange();
            range.setStart(textNode, 10);
            range.setEnd(textNode, 36);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#E53935' }); // Red

            expect(editor.blocks[0].content.length).toBe(3);
            let styledPart = editor.blocks[0].content[1];
            let styles = (styledPart.properties as BaseStylesProp).styles;
            expect(styles.color).toBe('#E53935');
            expect(styles.bold).toBe(true);
            expect(styles.italic).toBe(true);
            expect(styles.underline).toBe(true);
            expect(styles.strikethrough).toBe(true);
            expect(styles.color).toBe('#E53935');

            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const spans = domBlocks[0].querySelectorAll('span');
            expect(spans.length).toBe(3); 
            const styledSpan = spans[1];
            expect(styledSpan).not.toBeNull();
            expect(styledSpan.style.color).toBe('rgb(229, 57, 53)');
            expect(styledSpan.querySelector('strong')).not.toBeNull();       // bold
            expect(styledSpan.querySelector('em')).not.toBeNull();           // italic
            expect(styledSpan.querySelector('u')).not.toBeNull();            // underline
            expect(styledSpan.querySelector('s')).not.toBeNull();            // strikethrough

            triggerUndo(editorElement);
            triggerUndo(editorElement);
            triggerUndo(editorElement);
            triggerUndo(editorElement);
            triggerUndo(editorElement);
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const propsAfterUndo = editor.blocks[0].content[0].properties as BaseStylesProp;
            const stylesAreEmpty = !propsAfterUndo || !propsAfterUndo.styles || Object.keys(propsAfterUndo.styles).length === 0;
            expect(stylesAreEmpty).toBe(true);
            expect(domBlocks[0].querySelector('span')).toBeNull();
        
            triggerRedo(editorElement);
            triggerRedo(editorElement);
            triggerRedo(editorElement);
            triggerRedo(editorElement);
            triggerRedo(editorElement);
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].content.length).toBe(3);
            styledPart = editor.blocks[0].content[1];
            styles = (styledPart.properties as BaseStylesProp).styles;
            expect(styles.bold).toBe(true);
            expect(styles.italic).toBe(true);
            expect(styles.underline).toBe(true);
            expect(styles.strikethrough).toBe(true);
            expect(styles.color).toBe('#E53935');
            const styledSpanAfterRedo = domBlocks[0].querySelectorAll('span')[1];
            expect(styledSpanAfterRedo).not.toBeNull();
            expect(styledSpanAfterRedo.style.color).toBe('rgb(229, 57, 53)');
            expect(contentElement.querySelector('strong')).not.toBeNull();
            expect(contentElement.querySelector('em')).not.toBeNull();
            expect(contentElement.querySelector('u')).not.toBeNull();
            expect(contentElement.querySelector('s')).not.toBeNull();
            done();
        });
    });

    describe('Undo/Redo for Mention and Label Insertion', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'paragraph',
                blockType: BlockType.Paragraph,
                content: [{ id: 'p-content', contentType: ContentType.Text, content: 'Initial text' }]
            }];
            const users: UserModel[] = [
                { id: 'user1', user: 'John Paul' },
                { id: 'user2', user: 'John Snow' }
            ];
            editor = createEditor({
                blocks: blocks,
                users: users, 
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should UNDO and REDO a mention insertion', (done) => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '@';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            contentElement.dispatchEvent(new KeyboardEvent('keyup', { key: '@', bubbles: true }));
            const mentionMenu = document.querySelector('.e-content.e-dropdownbase') as HTMLElement;
            expect(mentionMenu).not.toBeNull();
            (mentionMenu.querySelector('li') as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelector('.e-mention-chip')).not.toBeNull();
            expect(contentElement.querySelector('.e-mention-chip').nextElementSibling).not.toBeNull();

            triggerUndo(editorElement);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('');
            expect(contentElement.querySelector('.e-mention-chip')).toBeNull();

            triggerRedo(editorElement);
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelector('.e-mention-chip')).not.toBeNull();
            expect(contentElement.querySelector('.e-mention-chip').nextElementSibling).not.toBeNull();
            done();
        });

        it('should UNDO and REDO a label insertion', (done) => {
            const blockElement = editor.element.querySelector('#paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent = '$';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));
            const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
            expect(popup).not.toBeNull();
            const labelItem = popup.querySelector('li[data-value="progress"]') as HTMLElement;
            expect(labelItem).not.toBeNull();
            labelItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Label);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelector('.e-label-chip')).not.toBeNull();
            expect(contentElement.querySelector('.e-label-chip').nextElementSibling).not.toBeNull();
            
            triggerUndo(editorElement);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('');
            expect(contentElement.querySelector('.e-label-chip')).toBeNull();

            triggerRedo(editorElement);
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Label);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelector('.e-label-chip')).not.toBeNull();
            expect(contentElement.querySelector('.e-label-chip').nextElementSibling).not.toBeNull();
            done();
        });

        it('should UNDO and REDO multiple mention insertion', function (done) {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '@';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            contentElement.dispatchEvent(new KeyboardEvent('keyup', { key: '@', bubbles: true }));
            const mentionMenu1 = document.querySelector('.e-content.e-dropdownbase');
            expect(mentionMenu1).not.toBeNull();
            mentionMenu1.querySelector('li').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            contentElement.childNodes[1].textContent = '@';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            contentElement.dispatchEvent(new KeyboardEvent('keyup', { key: '@', bubbles: true }));
            const mentionMenu2 = document.querySelector('.e-content.e-dropdownbase');
            expect(mentionMenu2).not.toBeNull();
            mentionMenu2.querySelector('li').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[2].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelectorAll('.e-mention-chip').length).toBe(2);

            triggerUndo(editorElement);
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelectorAll('.e-mention-chip').length).toBe(1);

            triggerUndo(editorElement);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('');
            expect(contentElement.querySelector('.e-mention-chip')).toBeNull();
            triggerRedo(editorElement);
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelector('.e-mention-chip')).not.toBeNull();
            expect(contentElement.querySelector('.e-mention-chip').nextElementSibling).not.toBeNull();
            done();
        });
    });

    describe('Link Operations', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'paragraph',
                blockType: BlockType.Paragraph,
                content: [{ id: 'p-content', contentType: ContentType.Text, content: 'Initial text' }]
            }];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO link insertion on text from a Paragraph', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editor.element.querySelector('#paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            const range = document.createRange();
            range.setStart(contentElement.firstChild, 0);
            range.setEnd(contentElement.firstChild, 12);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const linkTitle = popup.querySelector('#linkTitle') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');
                linkUrl.value = 'https://www.syncfusion.com';
                linkTitle.value = 'Syncfusion';
                insertBtn.dispatchEvent(new MouseEvent('click'));
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    const linkedContent = editor.blocks[0].content[0];
                    expect(linkedContent.contentType).toBe(ContentType.Link);
                    expect((linkedContent.properties as ILinkContentSettings).url).toContain('https://www.syncfusion.com');

                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    const linkElement = domBlocks[0].querySelector('a');
                    expect(linkElement).not.toBeNull();
                    expect(linkElement.getAttribute('href')).toBe('https://www.syncfusion.com');
                    expect(linkElement.getAttribute('target')).toBe('_blank');
                
                    triggerUndo(editor.element);
                    expect(editor.blocks[0].content.length).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    const linkAfterUndo = domBlocks[0].querySelector('a');

                    expect(linkAfterUndo).toBeNull(); // link should be removed
                
                    triggerRedo(editor.element);
                    expect(editor.blocks[0].content.length).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);

                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    const linkAfterRedo = domBlocks[0].querySelector('a');
                            
                    expect(linkAfterRedo).not.toBeNull();
                    expect(linkAfterRedo.getAttribute('href')).toBe('https://www.syncfusion.com');
                    expect(linkAfterRedo.getAttribute('target')).toBe('_blank');
                    done();
                }, 400);
            }, 100);
        });
    });

    describe('Block Transformations', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'block1',
                blockType: BlockType.Paragraph,
                content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }]
            }];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should transform paragraph to BulletList and handle UNDO/REDO', (done) => {
            const blockElement = block1;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const mentionElement = editorElement.querySelector('.e-mention.e-editable-element');
            mentionElement.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList, 'Block type should be BulletList after transform');
            let domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            const listElement = domBlocks[0].querySelector('ul');
            const listItem = listElement.querySelector('li');
            expect(listElement).not.toBeNull();
            expect(listItem).not.toBeNull();   
            expect(listItem.textContent).toBe('Hello world'); 

            triggerUndo(editorElement);

            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph, 'Block type should revert to Paragraph after undo');
            expect(editorElement.querySelector('p').textContent).toBe('Hello world');
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            const paragraphElement = domBlocks[0].querySelector('p');
            expect(paragraphElement).not.toBeNull(); 
            expect(paragraphElement.textContent).toBe('Hello world');
            expect(domBlocks[0].querySelector('ul')).toBeNull(); 

            triggerRedo(editorElement);

            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList, 'Block type should be restored to BulletList after redo');
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            const listElementAfterRedo = domBlocks[0].querySelector('ul');
            const listItemAfterRedo = listElementAfterRedo.querySelector('li');
            expect(listElementAfterRedo).not.toBeNull();
            expect(listItemAfterRedo).not.toBeNull();
            expect(listItemAfterRedo.textContent).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).toBeNull(); 
            done();
        });

        it('should transform paragraph to NumberedList and handle UNDO/REDO', (done) => {
            const blockElement = block1;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const mentionElement = editorElement.querySelector('.e-mention.e-editable-element');
            mentionElement.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const numberedListElement = slashCommandElement.querySelector('li[data-value="Numbered List"]') as HTMLElement;
            expect(numberedListElement).not.toBeNull();
            numberedListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            let domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            let orderedList = domBlocks[0].querySelector('ol');
            let listItem = orderedList.querySelector('li');

            expect(orderedList).not.toBeNull(); // <ol> should exist
            expect(listItem).not.toBeNull();    // <li> should exist
            expect(listItem.textContent).toBe('Hello world'); 

            triggerUndo(editorElement);

            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            const paragraphElement = domBlocks[0].querySelector('p');
                    
            expect(paragraphElement).not.toBeNull(); // <p> should be restored
            expect(paragraphElement.textContent).toBe('Hello world'); // content should match original
            expect(domBlocks[0].querySelector('ol')).toBeNull(); 
            triggerRedo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            orderedList = domBlocks[0].querySelector('ol');
            listItem = orderedList.querySelector('li');

            expect(orderedList).not.toBeNull(); // <ol> should exist
            expect(listItem).not.toBeNull();    // <li> should exist
            expect(listItem.textContent).toBe('Hello world'); 
            done();
        });

        it('should transform paragraph to Quote and handle UNDO/REDO', (done) => {
            const blockElement = block1;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const mentionElement = editorElement.querySelector('.e-mention.e-editable-element');
            mentionElement.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const quoteElement = slashCommandElement.querySelector('li[data-value="Quote"]') as HTMLElement;
            expect(quoteElement).not.toBeNull();
            quoteElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
            let domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(domBlocks[0].querySelector('p')).toBeNull(); 

            triggerUndo(editorElement);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            const paragraphElement = domBlocks[0].querySelector('p');
            expect(paragraphElement).not.toBeNull(); 
            expect(domBlocks[0].querySelector('blockquote')).toBeNull(); 

            triggerRedo(editorElement);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            const quoteElementAfterRedo = domBlocks[0].querySelector('blockquote');
            expect(quoteElementAfterRedo).not.toBeNull(); 
            expect(domBlocks[0].querySelector('p')).toBeNull();
            done();
        });

        it('should transform paragraph to Checklist and handle UNDO/REDO', (done) => {
            const blockElement = block1;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const mentionElement = editorElement.querySelector('.e-mention.e-editable-element');
            mentionElement.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const checklistElement = slashCommandElement.querySelector('li[data-value="Checklist"]') as HTMLElement;
            expect(checklistElement).not.toBeNull();
            checklistElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(false);
            let domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');

            triggerUndo(editorElement);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Paragraph');
            
            triggerRedo(editorElement);
            domBlocks = editorElement.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(false);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            done();
        });
    });

    describe('Special Block Addition', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'block1',
                blockType: BlockType.Paragraph,
                content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }]
            }];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should UNDO and REDO adding a Callout block', (done) => {
            const initialBlockCount = editor.blocks.length;
            expect(initialBlockCount).toBe(1);
            const newCalloutBlock: BlockModel = {
                id: 'callout-1',
                blockType: BlockType.Callout,
                properties: {
                    children: [
                        {
                            id: 'callout-child-para', 
                            blockType: BlockType.Paragraph, 
                            content: [{ id: 'callout-content-2', contentType: ContentType.Text, content: 'Callout item 2' }]
                        }
                    ]
                }
            };
            editor.blockManager.editorMethods.addBlock(newCalloutBlock, 'block1', true);
            expect(editor.blocks.length).toBe(initialBlockCount + 1);
            expect(editor.blocks[1].id).toBe('callout-1');
            expect(editor.blocks[1].blockType).toBe(BlockType.Callout);
            const calloutElement = document.getElementById('callout-1');
            expect(calloutElement).not.toBeNull('The Callout DOM element should be created');
                   
            triggerUndo(editorElement);
            expect(editor.blocks.length).toBe(initialBlockCount);
            expect(document.getElementById('callout-1')).toBeNull();
        
            triggerRedo(editorElement);
            expect(editor.blocks.length).toBe(initialBlockCount + 1);
            expect(editor.blocks[1].id).toBe('callout-1');
            const restoredCalloutElement = document.getElementById('callout-1');
            expect(restoredCalloutElement).not.toBeNull();
            done();
        });

        it('should UNDO and REDO adding a CollapsibleParagraph block', (done) => {
            const collapsibleBlock: BlockModel = {
                id: 'collapse-para',
                blockType: BlockType.CollapsibleParagraph,
                content: [{ contentType: ContentType.Text, content: 'Collapsible Title' }],
                properties: {
                    children: [{
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Child content' }]
                    }]
                }
            };
            editor.blockManager.editorMethods.addBlock(collapsibleBlock, 'initial-block', true);
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
            expect(editor.blocks[1].id).toBe('collapse-para');
            expect(collapsibleBlock).not.toBeNull();
            triggerUndo(editorElement);
            expect(editor.blocks.length).toBe(1);
            expect(document.getElementById('collapse-para')).toBeNull();
            triggerRedo(editorElement);
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].id).toBe('collapse-para');
            done();
        });

        it('should UNDO and REDO adding a CollapsibleHeading block (level 1)', (done) => {
            const collapsibleHeadingBlock: BlockModel = {
                blockType: BlockType.CollapsibleHeading,
                content: [{ contentType: ContentType.Text, content: 'Collapsible Heading Title' }],
                properties: {
                    level: 1,
                    isExpanded: true,
                    children: [{
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Child content for heading' }]
                    }]
                }
            };
            editor.blockManager.editorMethods.addBlock(collapsibleHeadingBlock, 'initial-block', true);
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].blockType).toBe(BlockType.CollapsibleHeading);
            triggerUndo(editorElement);
            expect(editor.blocks.length).toBe(1);
            triggerRedo(editorElement);
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].blockType).toBe(BlockType.CollapsibleHeading);
            expect((editor.blocks[1].properties as (ICollapsibleBlockSettings & IHeadingBlockSettings)).level).toBe(1);
            expect((editor.blocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            done();
        });
    });

    describe('Undo/Redo for Operations within a Callout Block', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'callout-block',
                blockType: BlockType.Callout,
                properties: {
                    children: [
                        { id: 'child-para-1', blockType: BlockType.Paragraph, content: [{ id: 'p1-content', contentType: ContentType.Text, content: 'Initial child text.' }] },
                        { id: 'child-para-2', blockType: BlockType.Paragraph, content: [{ id: 'p2-content', contentType: ContentType.Text, content: 'Second child text.' }] },
                    ]
                }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO typing text in a Callout’s child Paragraph', (done) => {
            const childBlockElement = editorElement.querySelector('#child-para-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(childBlockElement);
            const contentElement = getBlockContentElement(childBlockElement);
            const initialText = contentElement.textContent;
            const newText = initialText + ' More text.';
            contentElement.textContent = newText;
            editor.blockManager.stateManager.updateContentOnUserTyping(childBlockElement);
            const calloutChildren = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            expect(calloutChildren[0].content[0].content).toBe(newText);
            triggerUndo(editorElement);
            expect(calloutChildren[0].content[0].content).toBe(initialText);
            expect(contentElement.textContent).toBe(initialText);
            triggerRedo(editorElement);
            expect(calloutChildren[0].content[0].content).toBe(newText);
            expect(contentElement.textContent).toBe(newText);
            done();
        });

        it('should UNDO and REDO adding a child Paragraph to a Callout', (done) => {
            const lastChildBlock = editorElement.querySelector('#child-para-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastChildBlock);
            setCursorPosition(getBlockContentElement(lastChildBlock), 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            const calloutChildren = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            expect(calloutChildren.length).toBe(3);
            triggerUndo(editorElement);
            expect(calloutChildren.length).toBe(2);
            triggerRedo(editorElement);
            expect(calloutChildren.length).toBe(3);
            done();
        });

        it('should UNDO and REDO deleting a Callout’s child Paragraph', (done) => {
            const lastChildBlock = editorElement.querySelector('#child-para-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastChildBlock);
            editor.blockManager.editorMethods.removeBlock('child-para-2');
            const calloutChildren = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            expect(calloutChildren.length).toBe(1);
            triggerUndo(editorElement);
            expect(calloutChildren.length).toBe(2);
            expect(calloutChildren[1].id).toBe('child-para-2');
            expect(editor.element.querySelector('#callout-block #child-para-2')).not.toBeNull();
            expect(editor.element.querySelector('#callout-block #child-para-2').textContent).toBe('Second child text.');
            triggerRedo(editorElement);
            expect(calloutChildren.length).toBe(1);
            expect(editor.element.querySelector('#callout-block #child-para-2')).toBeNull();
            done();
        });
    });

    describe('Undo/Redo for Operations within a CollapsibleParagraph Block', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'collapsible-block',
                blockType: BlockType.CollapsibleParagraph,
                content: [{ id: 'cp-title', contentType: ContentType.Text, content: 'Collapsible Title' }],
                properties: {
                    isExpanded: false,
                    children: [{ id: 'cp-child-1', blockType: BlockType.Paragraph, content: [{ id: 'cp-child-content1', contentType: ContentType.Text, content: 'Child content' }] },
                { id: 'cp-child-2', blockType: BlockType.Paragraph, content: [{ id: 'cp-child-content2', contentType: ContentType.Text, content: 'Child2 content' }] }]
                }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO typing text in a CollapsibleParagraph’s content', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#collapsible-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            const initialText = contentElement.textContent;
            const newText = initialText + ' - Edited';
            contentElement.textContent = newText;
            setCursorPosition(contentElement, newText.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].content[0].content).toBe(newText);
            // const headingContent = domBlocks[0].querySelector('.e-toggle-header .e-block-content') as HTMLElement;
            // expect(headingContent.textContent).toBe(newText);
            expect(contentElement.textContent).toBe(newText);


            triggerUndo(editorElement);
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].content[0].content).toBe(initialText);
            expect(contentElement.textContent).toBe(initialText);

            triggerRedo(editorElement);
            expect(editor.blocks[0].content[0].content).toBe(newText);
            expect(contentElement.textContent).toBe(newText);
            done();
        });

        it('should UNDO and REDO expanding a CollapsibleParagraph', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const toggleContent = blockElement.querySelector('.e-toggle-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect((editor.blocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            expect(blockElement.getAttribute('data-collapsed')).toBe('false');
            expect(toggleContent.style.display).toBe('block');

            triggerUndo(editorElement);
            expect((editor.blocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(false);
            expect(blockElement.getAttribute('data-collapsed')).toBe('true');
            expect(toggleContent.style.display).toBe('none');

            triggerRedo(editorElement);
            expect((editor.blocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            expect(blockElement.getAttribute('data-collapsed')).toBe('false');
            expect(toggleContent.style.display).toBe('block');
            done();
        });

        it('should UNDO and REDO adding a child Paragraph to a CollapsibleParagraph', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('#collapsible-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            const lastChildBlock = editorElement.querySelector('#cp-child-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastChildBlock);
            setCursorPosition(getBlockContentElement(lastChildBlock), lastChildBlock.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            const collapsibleChildren = (editor.blocks[0].properties as ICollapsibleBlockSettings).children;
            expect(collapsibleChildren.length).toBe(3);

            const collapsibleBlock = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocks = collapsibleBlock.querySelectorAll('.e-toggle-content .e-block');

            expect(childBlocks.length).toBe(3); 
            expect(childBlocks[2].textContent).toBe(''); 

            triggerUndo(editorElement);
            expect(collapsibleChildren.length).toBe(2);
            const collapsibleBlockAfterUndo = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocksAfterUndo = collapsibleBlockAfterUndo.querySelectorAll('.e-toggle-content .e-block');    
            expect(childBlocksAfterUndo.length).toBe(2); 
            
            triggerRedo(editorElement);
            expect(collapsibleChildren.length).toBe(3);
            const collapsibleBlockAfterRedo = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocksAfterRedo = collapsibleBlockAfterRedo.querySelectorAll('.e-toggle-content .e-block');     
            expect(childBlocksAfterRedo.length).toBe(3); 
            expect(childBlocksAfterRedo[2].textContent).toBe(''); 
            done();
        });

        it('should UNDO and REDO deleting a CollapsibleParagraph’s child', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            editor.blockManager.editorMethods.removeBlock('cp-child-2');

            const collapsibleChildren = (editor.blocks[0].properties as ICollapsibleBlockSettings).children;
            expect(collapsibleChildren.length).toBe(1);
            const collapsibleBlock = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocks = collapsibleBlock.querySelectorAll('.e-toggle-content .e-block');    
            expect(childBlocks.length).toBe(1); // Only one child should remain
            expect(collapsibleBlock.querySelector('#cp-child-2')).toBeNull(); 

            triggerUndo(editorElement);
            expect(collapsibleChildren.length).toBe(2);
            expect(collapsibleChildren[1].id).toBe('cp-child-2');
            const collapsibleBlockAfterUndo = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocksAfterUndo = collapsibleBlockAfterUndo.querySelectorAll('.e-toggle-content .e-block');    
            expect(childBlocksAfterUndo.length).toBe(2); // Child should be restored
            expect(collapsibleBlockAfterUndo.querySelector('#cp-child-2')).not.toBeNull();

            triggerRedo(editorElement);
            expect(collapsibleChildren.length).toBe(1);
            const collapsibleBlockAfterRedo = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocksAfterRedo = collapsibleBlockAfterRedo.querySelectorAll('.e-toggle-content .e-block');      
            expect(childBlocksAfterRedo.length).toBe(1); // Child should be removed again
            expect(collapsibleBlockAfterRedo.querySelector('#cp-child-2')).toBeNull();
            done();
        });
    });

    describe('Undo/Redo for Operations within a CollapsibleHeading Block', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'collapsible-heading',
                blockType: BlockType.CollapsibleHeading,
                content: [{ id: 'ch-title', contentType: ContentType.Text, content: 'Heading Title' }],
                properties: {
                    level: 1,
                    isExpanded: false,
                    children: [{ id: 'ch-child-1', blockType: BlockType.Paragraph, content: [{ id: 'cp-child-content1', contentType: ContentType.Text, content: 'Child content' }] },
                    { id: 'ch-child-2', blockType: BlockType.Paragraph, content: [{ id: 'cp-child-content2', contentType: ContentType.Text, content: 'Child2 content' }] }]

                
                },
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO typing text in a CollapsibleHeading’s content', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            const initialText = contentElement.textContent;
            const newText = initialText + ' - Updated';
            contentElement.textContent = newText;
            setCursorPosition(contentElement, newText.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            expect(editor.blocks[0].content[0].content).toBe(newText);
            expect(contentElement.textContent).toBe(newText);
            
            triggerUndo(editorElement);
            expect(editor.blocks[0].content[0].content).toBe(initialText);
            expect(contentElement.textContent).toBe(initialText);

            triggerRedo(editorElement);
            expect(editor.blocks[0].content[0].content).toBe(newText);
            expect(contentElement.textContent).toBe(newText);
            done();
        });

        it('should UNDO and REDO adding a child Paragraph to a CollapsibleHeading', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            const lastChildBlock = editorElement.querySelector('#ch-child-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastChildBlock);
            setCursorPosition(getBlockContentElement(lastChildBlock), lastChildBlock.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            const collapsibleHeadingBlock = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocks = collapsibleHeadingBlock.querySelectorAll('.e-toggle-content .e-block');       
            expect(childBlocks.length).toBe(3);
            expect(childBlocks[2].textContent).toBe('');

            const collapsibleChildren = (editor.blocks[0].properties as ICollapsibleBlockSettings).children;
            expect(collapsibleChildren.length).toBe(3);

            triggerUndo(editorElement);
            expect(collapsibleChildren.length).toBe(2);
            const collapsibleHeadingAfterUndo = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocksAfterUndo = collapsibleHeadingAfterUndo.querySelectorAll('.e-toggle-content .e-block');     
            expect(childBlocksAfterUndo.length).toBe(2);
            expect(collapsibleHeadingAfterUndo.querySelector('#ch-child-3')).toBeNull();

            triggerRedo(editorElement);
            expect(collapsibleChildren.length).toBe(3);
            const collapsibleHeadingAfterRedo = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocksAfterRedo = collapsibleHeadingAfterRedo.querySelectorAll('.e-toggle-content .e-block'); 
            expect(childBlocksAfterRedo.length).toBe(3);
            expect(childBlocksAfterRedo[2].textContent).toBe('');
            done();
        });

        it('should UNDO and REDO expanding a CollapsibleHeading', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const toggleContent = blockElement.querySelector('.e-toggle-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            expect((editor.blocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            expect(blockElement.getAttribute('data-collapsed')).toBe('false');
            expect(toggleContent.style.display).toBe('block');

            triggerUndo(editorElement);
            expect((editor.blocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(false);
            expect(blockElement.getAttribute('data-collapsed')).toBe('true');
            expect(toggleContent.style.display).toBe('none');

            triggerRedo(editorElement);
            expect((editor.blocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            expect(blockElement.getAttribute('data-collapsed')).toBe('false');
            expect(toggleContent.style.display).toBe('block');
            done();
        });

        it('should UNDO and REDO deleting a CollapsibleHeading child', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            editor.blockManager.editorMethods.removeBlock('ch-child-2');

            const collapsibleChildren = (editor.blocks[0].properties as ICollapsibleBlockSettings).children;
            expect(collapsibleChildren.length).toBe(1);
            const collapsibleHeadingBlock = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocks = collapsibleHeadingBlock.querySelectorAll('.e-toggle-content .e-block');   
            expect(childBlocks.length).toBe(1); // Only one child should remain
            expect(collapsibleHeadingBlock.querySelector('#ch-child-2')).toBeNull();

            triggerUndo(editorElement);
            expect(collapsibleChildren.length).toBe(2);
            expect(collapsibleChildren[1].id).toBe('ch-child-2');
            const collapsibleHeadingAfterUndo = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocksAfterUndo = collapsibleHeadingAfterUndo.querySelectorAll('.e-toggle-content .e-block');    
            expect(childBlocksAfterUndo.length).toBe(2);
            expect(collapsibleHeadingAfterUndo.querySelector('#ch-child-2')).not.toBeNull();

            triggerRedo(editorElement);
            expect(collapsibleChildren.length).toBe(1);
            const collapsibleHeadingAfterRedo = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocksAfterRedo = collapsibleHeadingAfterRedo.querySelectorAll('.e-toggle-content .e-block');  
            expect(childBlocksAfterRedo.length).toBe(1);
            expect(collapsibleHeadingAfterRedo.querySelector('#ch-child-2')).toBeNull();
            done();
        });
    });

    describe('Undo/Redo for Enter key on callout', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'callout-block',
                blockType: BlockType.Callout,
                properties: {
                    children: [
                        { id: 'child-para-1', blockType: BlockType.Paragraph, content: [{ id: 'p1-content', contentType: ContentType.Text, content: '' }] },
                        
                    ]
                }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO on Enter key action on empty child Paragraph of a Callout', (done) => {
            const lastChildBlock = editorElement.querySelector('#child-para-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastChildBlock);
            setCursorPosition(getBlockContentElement(lastChildBlock), lastChildBlock.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            const calloutChildren = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            expect(calloutChildren.length).toBe(2);
            const calloutBlock = editorElement.querySelector('.e-block[data-block-type="Callout"]') as HTMLElement;
            const childBlocks = calloutBlock.querySelectorAll('.e-block');

            expect(childBlocks.length).toBe(2); // DOM should reflect 2 child blocks
            expect(childBlocks[1].textContent).toBe('');

            triggerUndo(editorElement);
            expect(calloutChildren.length).toBe(1);
            const calloutBlockAfterUndo = editorElement.querySelector('.e-block[data-block-type="Callout"]') as HTMLElement;
            const childBlocksAfterUndo = calloutBlockAfterUndo.querySelectorAll('.e-block');   
            expect(childBlocksAfterUndo.length).toBe(1); // DOM should reflect removal of the new child

            triggerRedo(editorElement);
            expect(calloutChildren.length).toBe(2);
            const calloutBlockAfterRedo = editorElement.querySelector('.e-block[data-block-type="Callout"]') as HTMLElement;
            const childBlocksAfterRedo = calloutBlockAfterRedo.querySelectorAll('.e-block');
            expect(childBlocksAfterRedo.length).toBe(2); // DOM should reflect re-addition of the child
            expect(childBlocksAfterRedo[1].textContent).toBe('');
            done();
        });
    });

    describe('Undo/Redo for Enter key on Collapsible Paragraph', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'collapsible-block',
                blockType: BlockType.CollapsibleParagraph,
                content: [{ id: 'cp-title', contentType: ContentType.Text, content: 'Collapsible Title' }],
                properties: {
                    isExpanded: false,
                    children: [{ id: 'cp-child-1', blockType: BlockType.Paragraph, content: [{ id: 'cp-child-content1', contentType: ContentType.Text, content: '' }] }]
                }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO Enter key action on empty child Paragraph of a CollapsibleParagraph', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            const lastChildBlock = editorElement.querySelector('#cp-child-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastChildBlock);
            setCursorPosition(getBlockContentElement(lastChildBlock), 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            const collapsibleChildren = (editor.blocks[0].properties as ICollapsibleBlockSettings).children;
            expect(collapsibleChildren.length).toBe(2);
            const collapsibleBlock = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocks = collapsibleBlock.querySelectorAll('.e-toggle-content .e-block');
            expect(childBlocks.length).toBe(2); // DOM should reflect 2 child blocks
            expect(childBlocks[1].textContent).toBe('');
        
            triggerUndo(editorElement);
            expect(collapsibleChildren.length).toBe(1);
            const collapsibleBlockAfterUndo = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocksAfterUndo = collapsibleBlockAfterUndo.querySelectorAll('.e-toggle-content .e-block');
            expect(childBlocksAfterUndo.length).toBe(1); // DOM should reflect removal of the new child
        
            triggerRedo(editorElement);
            expect(collapsibleChildren.length).toBe(2);
            const collapsibleBlockAfterRedo = editorElement.querySelector('#collapsible-block') as HTMLElement;
            const childBlocksAfterRedo = collapsibleBlockAfterRedo.querySelectorAll('.e-toggle-content .e-block');
            expect(childBlocksAfterRedo.length).toBe(2); // DOM should reflect re-addition of the child
            expect(childBlocksAfterRedo[1].textContent).toBe('');
            done();
        });
    });

    describe('Undo/Redo for Enter key on Collapsible Heading', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'collapsible-heading',
                blockType: BlockType.CollapsibleHeading,
                content: [{ id: 'ch-title', contentType: ContentType.Text, content: 'Heading Title' }],
                properties: {
                    level: 1,
                    isExpanded: false,
                    children: [{ id: 'ch-child-1', blockType: BlockType.Paragraph, content: [{ id: 'cp-child-content1', contentType: ContentType.Text, content: '' }] }]
                },
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO Enter key action on empty child  of a CollapsibleHeading', (done) => {
            const blockElement = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const expanderIcon = blockElement.querySelector('.e-toggle-icon') as HTMLElement;
            expanderIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            const lastChildBlock = editorElement.querySelector('#ch-child-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastChildBlock);
            setCursorPosition(getBlockContentElement(lastChildBlock), 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            const collapsibleChildren = (editor.blocks[0].properties as ICollapsibleBlockSettings).children;
            expect(collapsibleChildren.length).toBe(2);
            const collapsibleHeadingBlock = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocks = collapsibleHeadingBlock.querySelectorAll('.e-toggle-content .e-block');
            expect(childBlocks.length).toBe(2); // DOM should reflect 2 child blocks
            expect(childBlocks[1].textContent).toBe('');

            triggerUndo(editorElement);
            expect(collapsibleChildren.length).toBe(1);
            const collapsibleHeadingAfterUndo = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocksAfterUndo = collapsibleHeadingAfterUndo.querySelectorAll('.e-toggle-content .e-block');    
            expect(childBlocksAfterUndo.length).toBe(1); // DOM should reflect removal of the new child

            triggerRedo(editorElement);
            expect(collapsibleChildren.length).toBe(2);
            const collapsibleHeadingAfterRedo = editorElement.querySelector('#collapsible-heading') as HTMLElement;
            const childBlocksAfterRedo = collapsibleHeadingAfterRedo.querySelectorAll('.e-toggle-content .e-block');
            expect(childBlocksAfterRedo.length).toBe(2); // DOM should reflect re-addition of the child
            expect(childBlocksAfterRedo[1].textContent).toBe('');
            done();
        });
    });

    describe('Undo/Redo for Deleting a Callout Block', () => {
        const calloutBlockId = 'callout-block-to-delete';
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            // Initialize with a complex Callout block
            const blocks: BlockModel[] = [{
                id: calloutBlockId,
                blockType: BlockType.Callout,
                properties: {
                    children: [
                        { id: 'child-h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ id: 'h1-content', contentType: ContentType.Text, content: 'Child Heading' }] },
                        { id: 'child-p1', blockType: BlockType.Paragraph, content: [{ id: 'p1-content', contentType: ContentType.Text, content: 'Child paragraph.' }] }
                    ]
                }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            remove(editorElement);
        });
        it('should UNDO and REDO deleting an entire Callout block', (done) => {
            const initialChildrenLength = (editor.blocks[0].properties as BaseChildrenProp).children.length;
            expect(editor.blocks.length).toBe(1);
            editor.blockManager.execCommand({ command: 'DeleteBlock', state: { blockElement: editorElement.querySelector("#" + calloutBlockId) }});
            
            setTimeout(() => {
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe('Paragraph');
                const calloutBlockElement = editorElement.querySelector("#" + calloutBlockId);
                expect(calloutBlockElement).toBeNull();

                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].blockType).toBe('Callout');
                expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toEqual(initialChildrenLength);

                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe('Paragraph');
                const calloutBlockElement1 = editorElement.querySelector("#" + calloutBlockId);
                expect(calloutBlockElement1).toBeNull();

                done();
            }, 100);
        });
    });

    describe('Undo/Redo for Deleting a CollapsibleParagraph Block', () => {
        const collapsibleBlockId = 'collapsible-paragraph-to-delete';
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            // Initialize with a CollapsibleParagraph block with content and children
            const blocks: BlockModel[] = [{
                id: collapsibleBlockId,
                blockType: BlockType.CollapsibleParagraph,
                content: [{ id: 'cp-content', contentType: ContentType.Text, content: 'Main Content' }],
                properties: {
                    isExpanded: true,
                    children: [
                        { id: 'cp-child-1', blockType: BlockType.Paragraph, content: [{ id: 'cp-child-content', contentType: ContentType.Text, content: 'Child Content' }] }
                    ]
                }
            }  ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            remove(editorElement);
        });
        it('should UNDO and REDO deleting an entire CollapsibleParagraph block', (done) => {
            const initialChildrenLength = (editor.blocks[0].properties as BaseChildrenProp).children.length;
            expect(editor.blocks.length).toBe(1);
            editor.blockManager.execCommand({ command: 'DeleteBlock', state: { blockElement: editorElement.querySelector("#" + collapsibleBlockId) }});
            
            setTimeout(() => {
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe('Paragraph');
                const collapsible = editorElement.querySelector("#" + collapsibleBlockId);
                expect(collapsible).toBeNull();

                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].blockType).toBe('CollapsibleParagraph');
                expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toEqual(initialChildrenLength);

                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe('Paragraph');
                const collapsible1 = editorElement.querySelector("#" + collapsibleBlockId);
                expect(collapsible1).toBeNull();

                done();
            }, 100);
        });
    });


    describe('Undo/Redo for Deleting a CollapsibleHeading Block', () => {
        const collapsibleHeadingId = 'collapsible-heading-to-delete';
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            // Initialize with a CollapsibleHeading block with content and children
            const blocks: BlockModel[] = [{
                id: collapsibleHeadingId,
                blockType: BlockType.CollapsibleHeading,
                content: [{ id: 'ch-content', contentType: ContentType.Text, content: 'Heading Content' }],
                properties: {
                    level: 2,
                    isExpanded: false,
                    children: [
                        { id: 'ch-child-1', blockType: BlockType.Paragraph, content: [{ id: 'ch-child-content', contentType: ContentType.Text, content: 'Child Content' }] }
                    ]
                }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            remove(editorElement);
        });

        it('should UNDO and REDO deleting an entire CollapsibleHeading block', (done) => {
            const initialChildrenLength = (editor.blocks[0].properties as BaseChildrenProp).children.length;
            expect(editor.blocks.length).toBe(1);
            editor.blockManager.execCommand({ command: 'DeleteBlock', state: { blockElement: editorElement.querySelector("#" + collapsibleHeadingId) }});
            
            setTimeout(() => {
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe('Paragraph');
                const collapsible = editorElement.querySelector("#" + collapsibleHeadingId);
                expect(collapsible).toBeNull();

                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].blockType).toBe('CollapsibleHeading');
                expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toEqual(initialChildrenLength);

                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe('Paragraph');
                const collapsible1 = editorElement.querySelector("#" + collapsibleHeadingId);
                expect(collapsible1).toBeNull();

                done();
            }, 100);
        });
    });

    describe('Mention in a Callout child Paragraph', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'callout-block',
                blockType: BlockType.Callout,
                properties: {
                    children: [{ 
                        id: 'callout-child', 
                        blockType: BlockType.Paragraph, 
                        content: [{ id: 'cc-content', contentType: ContentType.Text, content: 'Initial text' }] 
                    }]
                }
            }];
            const users: UserModel[] = [{ id: 'user1', user: 'Mentus' }];
            editor = createEditor({
                blocks: blocks,
                users: users, 
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });
        // on mention insertion, on empty callout child block content, undo redo not working
        it('should UNDO and REDO applying a Mention', (done) => {
            const childBlock = editorElement.querySelector('#callout-child') as HTMLElement;
            editor.blockManager.setFocusToBlock(childBlock);
            const contentElement = getBlockContentElement(childBlock);
            contentElement.textContent = '@';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(childBlock);
            contentElement.dispatchEvent(new KeyboardEvent('keyup', { key: '@', bubbles: true }));
            const mentionMenu = document.querySelector('.e-content.e-dropdownbase') as HTMLElement;
            expect(mentionMenu).not.toBeNull();
            (mentionMenu.querySelector('li') as HTMLElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            const calloutChildren = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            
            expect(calloutChildren[0].content[0].contentType).toBe(ContentType.Mention);
            expect(calloutChildren[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelector('.e-mention-chip')).not.toBeNull();
            expect(contentElement.querySelector('.e-mention-chip').nextElementSibling).not.toBeNull();
            
            triggerUndo(editorElement);
            expect(calloutChildren[0].content.length).toBe(1);
            expect(calloutChildren[0].content[0].content).toBe('');
            expect(contentElement.querySelector('.e-mention-chip')).toBeNull();

            triggerRedo(editorElement);
            expect(calloutChildren[0].content[0].contentType).toBe(ContentType.Mention);
            expect(calloutChildren[0].content[1].contentType).toBe(ContentType.Text);
            expect(contentElement.querySelector('.e-mention-chip')).not.toBeNull();
            expect(contentElement.querySelector('.e-mention-chip').nextElementSibling).not.toBeNull();
            done();
        });
    });

    describe('Label in a CollapsibleParagraph content', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'collapsible-para',
                blockType: BlockType.CollapsibleParagraph,
                content: [{ id: 'cp-content', contentType: ContentType.Text, content: 'Collapsible text ' }],
                properties: {
                    isExpanded: true,
                    children: []
                }
            }];
            editor = createEditor({
                blocks: blocks
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        // Undo Redo not handled on src lvl
        it('should UNDO and REDO applying a Label', (done) => {
            const blockElement = editor.element.querySelector('#collapsible-para') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent += '$';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));
            const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
            expect(popup).not.toBeNull();
            const labelItem = popup.querySelector('li[data-value="progress"]') as HTMLElement;
            expect(labelItem).not.toBeNull();
            labelItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
            expect(contentElement.querySelector('.e-label-chip')).not.toBeNull();

            triggerUndo(editor.element);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
            expect(editor.blocks[0].content[0].content).toContain('Collapsible text ');
            expect(contentElement.querySelector('.e-label-chip')).toBeNull();

            triggerRedo(editor.element);
            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
            expect(contentElement.querySelector('.e-label-chip')).not.toBeNull();
            done();
        });
    });

    describe('Link in a CollapsibleHeading content', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'collapsible-head',
                blockType: BlockType.CollapsibleHeading,
                content: [{ id: 'ch-content', contentType: ContentType.Text, content: 'Linkable heading text' }],
                properties: { level: 2, isExpanded: true, children: [] }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO applying a Link', (done) => {
            const blockElement = editor.element.querySelector('#collapsible-head') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            const range = document.createRange();
            range.setStart(contentElement.firstChild, 9);
            range.setEnd(contentElement.firstChild, 21);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const linkTitle = popup.querySelector('#linkTitle') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');
                linkUrl.value = 'https://www.syncfusion.com';
                linkTitle.value = 'Syncfusion';
                insertBtn.dispatchEvent(new MouseEvent('click'));
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    const linkedContent = editor.blocks[0].content[1];
                    expect(linkedContent.contentType).toBe(ContentType.Link);
                    expect((linkedContent.properties as ILinkContentSettings).url).toContain('https://www.syncfusion.com');
                    const domBlock = editor.element.querySelector('#collapsible-head') as HTMLElement;
                    const linkElement = domBlock.querySelector('a');
                    expect(linkElement).not.toBeNull(); // Link should exist
                    expect(linkElement.getAttribute('href')).toBe('https://www.syncfusion.com'); // Correct URL
                    expect(linkElement.getAttribute('target')).toBe('_blank'); // Should open in new window
    
                    triggerUndo(editor.element);
                    expect(editor.blocks[0].content.length).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    const domBlockAfterUndo = editor.element.querySelector('#collapsible-head') as HTMLElement;
                    const linkAfterUndo = domBlockAfterUndo.querySelector('a');
                    expect(linkAfterUndo).toBeNull(); // Link should be removed
    
                    triggerRedo(editor.element);
                    expect(editor.blocks[0].content.length).toBeGreaterThan(1);
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Link);
                    const domBlockAfterRedo = editor.element.querySelector('#collapsible-head') as HTMLElement;
                    const linkAfterRedo = domBlockAfterRedo.querySelector('a');
                    expect(linkAfterRedo).not.toBeNull(); // Link should be restored
                    expect(linkAfterRedo.getAttribute('href')).toBe('https://www.syncfusion.com');
                    expect(linkAfterRedo.getAttribute('target')).toBe('_blank');
                    done();
                }, 300);
            }, 100);
        });

    });

    describe('Undo/Redo for Multi-Style Formatting in a Callout Child', () => {
        const initialChildContent = 'This is the child content inside the callout.';
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'callout-block',
                blockType: BlockType.Callout,
                properties: {
                    children: [{
                        id: 'child-paragraph',
                        blockType: BlockType.Paragraph,
                        content: [{ id: 'child-content', contentType: ContentType.Text, content: initialChildContent }]
                    }]
                }
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should undo and redo all styles applied sequentially to a Callout child', (done) => {
            const childBlockElement = editorElement.querySelector('#child-paragraph') as HTMLElement;
            const contentElement = getBlockContentElement(childBlockElement);
            editor.blockManager.setFocusToBlock(childBlockElement);
            const textNode = contentElement.firstChild;
            const range = document.createRange();
            range.setStart(textNode, 12);
            range.setEnd(textNode, 25);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#007BFF' }); // Blue

            let calloutChildren = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            expect(calloutChildren[0].content.length).toBe(3);
            let styledPart = calloutChildren[0].content[1];
            let styles = (styledPart.properties as BaseStylesProp).styles;
            expect(styles.bold).toBe(true);
            expect(styles.italic).toBe(true);
            expect(styles.color).toBe('#007BFF');
            let allSpans = contentElement.querySelectorAll('span');
            let styledSpan = allSpans[1]; // The span with all styles applied
            expect(styledSpan).not.toBeNull(); // Styled span should exist
            expect(styledSpan.style.color).toBe('rgb(0, 123, 255)'); 

            triggerUndo(editorElement);
            triggerUndo(editorElement);
            triggerUndo(editorElement);

            const childrenAfterUndo = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            expect(childrenAfterUndo[0].content.length).toBe(1);
            const finalProps = childrenAfterUndo[0].content[0].properties as BaseStylesProp;
            const stylesAreEmpty = !finalProps || !finalProps.styles || Object.keys(finalProps.styles).length === 0;
            expect(stylesAreEmpty).toBe(true);
            allSpans = contentElement.querySelectorAll('span');
            styledSpan = allSpans[1];
            expect(styledSpan).toBeUndefined();

            triggerRedo(editorElement);
            triggerRedo(editorElement);
            triggerRedo(editorElement);

            const childrenAfterRedo = (editor.blocks[0].properties as ICalloutBlockSettings).children;
            expect(childrenAfterRedo[0].content.length).toBe(3);
            const newStyledPart = childrenAfterRedo[0].content[1];
            const newStyles = (newStyledPart.properties as BaseStylesProp).styles;
            expect(newStyles.bold).toBe(true);
            expect(newStyles.italic).toBe(true);
            expect(newStyles.color).toBe('#007BFF');
            allSpans = contentElement.querySelectorAll('span');
            styledSpan = allSpans[1]; // The span with all styles applied
            expect(styledSpan).not.toBeNull(); // Styled span should exist
            expect(styledSpan.style.color).toBe('rgb(0, 123, 255)'); 
            done();
        });
    });

    describe('Undo/Redo for Splitting a Paragraph with a Link', () => {
        const initialLinkText = 'This is a single link';
         beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [{
                id: 'link-block',
                blockType: BlockType.Paragraph,
                content: [{
                    id: 'link-content',
                    contentType: ContentType.Link,
                    content: initialLinkText,
                    properties: { url: 'https://www.syncfusion.com' }
                }]
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should split, undo the split, and redo the split correctly', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editorElement.querySelector('#link-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            const linkElement = contentElement.querySelector('a');
            setCursorPosition(linkElement, 11); 
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            //split check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].contentType).toBe(ContentType.Link);
            expect(modelBlocks[0].content[0].content).toBe('This is a s');
            expect(modelBlocks[1].content[0].contentType).toBe(ContentType.Link);
            expect(modelBlocks[1].content[0].content).toBe('ingle link');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('a')).not.toBeNull();
            expect(domBlocks[1].querySelector('a')).not.toBeNull();
            expect(domBlocks[0].querySelector('a').textContent).toBe('This is a s');
            expect(domBlocks[1].querySelector('a').textContent).toBe('ingle link');

            triggerUndo(editorElement);
            //undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].content.length).toBe(1);
            expect(modelBlocks[0].content[0].contentType).toBe(ContentType.Link);
            expect(modelBlocks[0].content[0].content).toBe(initialLinkText);
            expect(contentElement.textContent).toBe(initialLinkText);
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].querySelector('a')).not.toBeNull();
            expect(domBlocks[0].querySelector('a').textContent).toBe(initialLinkText);

            triggerRedo(editorElement);
            //redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].content[0].contentType).toBe(ContentType.Link);
            expect(modelBlocks[0].content[0].content).toBe('This is a s');
            expect(modelBlocks[1].content[0].contentType).toBe(ContentType.Link);
            expect(modelBlocks[1].content[0].content).toBe('ingle link');

            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].querySelector('a')).not.toBeNull();
            expect(domBlocks[1].querySelector('a')).not.toBeNull();
            expect(domBlocks[0].querySelector('a').textContent).toBe('This is a s');
            expect(domBlocks[1].querySelector('a').textContent).toBe('ingle link');
            done();
        });
    });

    describe('Pasting into a Callout child', () => {
        const targetChildId = 'paste-target';

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
                    id: 'list-to-copy',
                    blockType: BlockType.NumberedList,
                    content: [{ contentType: ContentType.Text, content: 'List Item 1' }]
                },
                {
                    id: 'callout-container',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{ id: targetChildId, blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paste here' }] }]
                    }
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            if (editorElement) remove(editorElement);
        });

        it('should UNDO and REDO pasting a NumberedList', (done) => {
            const blockElement = editorElement.querySelector('#list-to-copy') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            const pasteTarget = editorElement.querySelector('#'+ targetChildId) as HTMLElement;
            editor.blockManager.setFocusToBlock(pasteTarget);
            setCursorPosition(getBlockContentElement(pasteTarget), 0);
            // ACTION: Paste the list
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                const calloutChildren = (editor.blocks[1].properties as ICalloutBlockSettings).children;
                // Pasting a block into a callout child adds as new block below.
                expect(calloutChildren.length).toBe(2);
                expect(calloutChildren[0].blockType).toBe(BlockType.Paragraph);
                expect(calloutChildren[1].blockType).toBe(BlockType.NumberedList);
                const calloutChildrenDOM = editorElement.querySelector('#callout-container').querySelectorAll('.e-block');
                expect(calloutChildrenDOM.length).toBe(2);
                expect(calloutChildrenDOM[0].textContent).toBe('Paste here');
                expect(calloutChildrenDOM[1].textContent).toBe('List Item 1');

                // UNDO
                triggerUndo(editorElement);
                const childrenAfterUndo = (editor.blocks[1].properties as ICalloutBlockSettings).children;
                expect(childrenAfterUndo.length).toBe(1);
                expect(childrenAfterUndo[0].id).toBe(targetChildId);
                expect(childrenAfterUndo[0].blockType).toBe('Paragraph');
                const childrenAfterUndoDOM = editorElement.querySelector('#callout-container').querySelectorAll('.e-block');
                expect(childrenAfterUndoDOM.length).toBe(1);
                expect(childrenAfterUndoDOM[0].textContent).toBe('Paste here');

                // REDO
                triggerRedo(editorElement);
                const childrenAfterRedo = (editor.blocks[1].properties as ICalloutBlockSettings).children;
                expect(childrenAfterRedo.length).toBe(2);
                expect(childrenAfterRedo[0].blockType).toBe(BlockType.Paragraph);
                expect(childrenAfterRedo[1].blockType).toBe(BlockType.NumberedList);
                const childrenAfterRedoDOM = editorElement.querySelector('#callout-container').querySelectorAll('.e-block');
                expect(childrenAfterRedoDOM.length).toBe(2);
                expect(childrenAfterRedoDOM[0].textContent).toBe('Paste here');
                expect(childrenAfterRedoDOM[1].textContent).toBe('List Item 1');

                done();
            }, 100);
        });
    });

    describe('Image paste-HTML -> UNDO REDO', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);

            const blocks: BlockModel[] = [
                {
                    id: 'p1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 't1', contentType: ContentType.Text, content: 'Start here ' }]
                },
                {
                    id: 'p2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 't2', contentType: ContentType.Text, content: '' }]
                }
            ];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) editor.destroy();
            remove(editorElement);
        });

        // Helper to simulate HTML paste
        function simulateHtmlPaste(html: string, targetBlockId: string = 'p1') {
            const targetBlock = editorElement.querySelector(`#${targetBlockId}`) as HTMLElement;
            const content = getBlockContentElement(targetBlock);
            editor.blockManager.setFocusToBlock(targetBlock);
            setCursorPosition(content, content.textContent.length);

            const payload: IClipboardPayloadOptions = {
                html,
                text: '',
                file: null,
                blockeditorData: null
            };

            editor.blockManager.clipboardAction.performPasteOperation(payload);
        }

        it('Paste image into empty paragraph, UNDO REDO', () => {
            const html = `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="transparent">`;

            simulateHtmlPaste(html, 'p2');

            // After paste
            let imageBlock = editor.blocks.find(b => b.id === 'p2');
            expect(imageBlock.blockType).toBe(BlockType.Image);
            expect((imageBlock.properties as IImageBlockSettings).src).toContain('data:image/gif;base64,');

            const imgEl = editorElement.querySelector('#p2 img') as HTMLImageElement;
            expect(imgEl.src).toContain('data:image/gif;base64,');

            // UNDO
            triggerUndo(editorElement);

            const restoredBlock = editor.blocks.find(b => b.id === 'p2');
            expect(restoredBlock.blockType).toBe(BlockType.Paragraph);
            expect(restoredBlock.content[0].content).toBe(''); // empty paragraph restored

            const restoredEl = editorElement.querySelector('#p2') as HTMLElement;
            expect(restoredEl.classList.contains('e-image-block')).toBe(false);
            expect(restoredEl.querySelector('img')).toBeNull();

            expect(getBlockContentElement(restoredEl).textContent).toBe('');

            // REDO
            triggerRedo(editorElement)

            imageBlock = editor.blocks.find(b => b.id === 'p2');
            expect(imageBlock.blockType).toBe(BlockType.Image);
            expect((imageBlock.properties as IImageBlockSettings).src).toContain('data:image/gif;base64,');

            const redoImgEl = editorElement.querySelector('#p2 img') as HTMLImageElement;
            expect(redoImgEl.src).toContain('data:image/gif;base64,');
        });

        it('Paste image into non-empty paragraph, UNDO REDO', () => {
            const html = `<img src="https://picsum.photos/200/300" alt="Random photo">`;

            simulateHtmlPaste(html, 'p1');

            // After paste: new image block inserted after p1
            const p1Index = editor.blocks.findIndex(b => b.id === 'p1');
            const imageBlock = editor.blocks[p1Index + 1];
            expect(imageBlock.blockType).toBe(BlockType.Image);
            expect((imageBlock.properties as IImageBlockSettings).src).toBe('https://picsum.photos/200/300');

            const imageEl = editorElement.querySelector('#p1').nextElementSibling as HTMLElement;
            expect(imageEl.querySelector('img').src).toBe('https://picsum.photos/200/300');

            // UNDO
            triggerUndo(editorElement);

            expect(editor.blocks.length).toBe(2); // back to original
            expect(editor.blocks.find(b => b.blockType === BlockType.Image)).toBeUndefined();

            expect(editorElement.querySelector('.e-image-block')).toBeNull();
            expect(editorElement.querySelector('#p1').nextElementSibling.id).toBe(editorElement.querySelector('#p2').id); // p2

            // REDO
            triggerRedo(editorElement)

            const redoImageBlock = editor.blocks[p1Index + 1];
            expect(redoImageBlock.blockType).toBe(BlockType.Image);
            expect((redoImageBlock.properties as IImageBlockSettings).src).toBe('https://picsum.photos/200/300');

            const redoImageEl = editorElement.querySelector('#p1').nextElementSibling as HTMLElement;
            expect(redoImageEl.querySelector('img').src).toBe('https://picsum.photos/200/300');
        });

        it('Paste multiple images in one paste, UNDO REDO', () => {
            const html = `
                <img src="https://example.com/img1.jpg" alt="First">
                <img src="https://example.com/img2.jpg" alt="Second">
            `;

            simulateHtmlPaste(html);

            // After paste
            const imageBlocks = editor.blocks.filter(b => b.blockType === BlockType.Image);
            expect(imageBlocks.length).toBe(2);
            expect((imageBlocks[0].properties as IImageBlockSettings).src).toContain('img1.jpg');
            expect((imageBlocks[1].properties as IImageBlockSettings).src).toContain('img2.jpg');

            const imgs: NodeListOf<HTMLImageElement> = editorElement.querySelectorAll('img');
            expect(imgs.length).toBe(2);
            expect(imgs[0].alt).toBe('First');
            expect(imgs[1].alt).toBe('Second');

            // UNDO - both images removed at once
            triggerUndo(editorElement);

            expect(editor.blocks.filter(b => b.blockType === BlockType.Image).length).toBe(0);
            expect(editorElement.querySelector('.e-image-block')).toBeNull();

            // REDO - both restored
            triggerRedo(editorElement)

            const restoredImages = editor.blocks.filter(b => b.blockType === BlockType.Image);
            expect(restoredImages.length).toBe(2);
            expect((restoredImages[0].properties as IImageBlockSettings).src).toContain('img1.jpg');

            const restoredImgs: NodeListOf<HTMLImageElement> = editorElement.querySelectorAll('img');
            expect(restoredImgs.length).toBe(2);
            expect(restoredImgs[0].alt).toBe('First');
        });
    });

    // describe('Rapid Undo/Redo Performance (mixed block types)', () => {
    //     let editor: BlockEditor;
    //     let editorElement: HTMLElement;

    //     function triggerUndo(el: HTMLElement): void {
    //         el.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
    //     }
    //     function triggerRedo(el: HTMLElement): void {
    //         el.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY', bubbles: true }));
    //     }

    //     function createVariedBlock(i: number): BlockModel {
    //         const t = i % 7;
    //         switch (t) {
    //             case 0:
    //                 return {
    //                     id: `blk-paragraph-${i}`,
    //                     blockType: BlockType.Paragraph,
    //                     content: [{ id: `c-p-${i}`, contentType: ContentType.Text, content: `Paragraph ${i}` }]
    //                 };
    //             case 1:
    //                 return {
    //                     id: `blk-heading-${i}`,
    //                     blockType: BlockType.Heading,
    //                     properties: { level: (i % 3) + 1 },
    //                     content: [{ id: `c-h-${i}`, contentType: ContentType.Text, content: `Heading ${i}` }]
    //                 };
    //             case 2:
    //                 return {
    //                     id: `blk-bullet-${i}`,
    //                     blockType: BlockType.BulletList,
    //                     content: [{ id: `c-bu-${i}`, contentType: ContentType.Text, content: `Bullet item ${i}` }]
    //                 };
    //             case 3:
    //                 return {
    //                     id: `blk-numbered-${i}`,
    //                     blockType: BlockType.NumberedList,
    //                     content: [{ id: `c-nl-${i}`, contentType: ContentType.Text, content: `Numbered item ${i}` }]
    //                 };
    //             case 4:
    //                 return {
    //                     id: `blk-code-${i}`,
    //                     blockType: BlockType.Code,
    //                     properties: { language: (i % 2 === 0 ? 'javascript' : 'typescript') },
    //                     content: [{ id: `c-code-${i}`, contentType: ContentType.Text, content: `const v${i} = ${i};` }]
    //                 };
    //             case 5:
    //                 return {
    //                     id: `blk-quote-${i}`,
    //                     blockType: BlockType.Quote,
    //                     content: [{ id: `c-q-${i}`, contentType: ContentType.Text, content: `Quote ${i}` }]
    //                 };
    //             case 6:
    //                 return {
    //                     id: `blk-callout-${i}`,
    //                     blockType: BlockType.Callout,
    //                     properties: {
    //                         children: [{
    //                             id: `blk-callout-child-${i}`,
    //                             blockType: BlockType.Paragraph,
    //                             content: [{ id: `c-callout-${i}`, contentType: ContentType.Text, content: `Callout child ${i}` }]
    //                         }]
    //                     }
    //                 };
    //             default:
    //                 return {
    //                     id: `blk-fallback-${i}`,
    //                     blockType: BlockType.Paragraph,
    //                     content: [{ id: `c-f-${i}`, contentType: ContentType.Text, content: `Fallback ${i}` }]
    //                 };
    //         }
    //     }

    //     beforeEach(() => {
    //         editorElement = createElement('div', { id: 'editor-rapid-undo-redo-mixed' });
    //         document.body.appendChild(editorElement);

    //         const initialBlocks: BlockModel[] = [
    //             { id: 'initial', blockType: BlockType.Paragraph, content: [{ id: 'init-c', contentType: ContentType.Text, content: 'Initial' }] }
    //         ];
    //         editor = createEditor({ blocks: initialBlocks });
    //         editor.appendTo('#editor-rapid-undo-redo-mixed');

    //         editor.undoRedoStack = 500;
    //         editor.dataBind();
    //     });

    //     afterEach(() => {
    //         if (editor) {
    //             editor.destroy();
    //             editor = undefined;
    //         }
    //         if (editorElement && editorElement.parentNode) {
    //             remove(editorElement);
    //         }
    //     });

    //     it('should handle rapid UNDO/REDO after adding 100 different blocks', () => {
    //         const initialCount = editor.blocks.length;
    //         const ops = 100;
    //         let modelBlocks = editor.blocks;
    //         for (let i = 0; i < ops; i++) {
    //             const newBlock = createVariedBlock(i);
    //             const anchorId = editor.blocks[editor.blocks.length - 1].id; 
    //             editor.blockManager.editorMethods.addBlock(newBlock, anchorId, true);
    //         }
    //         modelBlocks = editor.blocks;
    //         expect(modelBlocks.length).toBe(initialCount + ops);
    //         measurePerformanceSync(`Rapid UNDO x${ops} (mixed block types)`, () => {
    //             for (let i = 0; i < ops; i++) {
    //                 triggerUndo(editorElement);
    //             }
    //             modelBlocks = editor.blocks;
    //             expect(modelBlocks.length).toBe(initialCount);
    //             expect(document.getElementById('initial')).not.toBeNull();
    //         }, 1500);

    //         measurePerformanceSync(`Rapid REDO x${ops} (mixed block types)`, () => {
    //             for (let i = 0; i < ops; i++) {
    //                 triggerRedo(editorElement);
    //             }
    //             modelBlocks = editor.blocks;
    //             expect(modelBlocks.length).toBe(initialCount + ops);

    //             expect(modelBlocks.find(b => b.id === 'blk-paragraph-0')).not.toBeUndefined();
    //             expect(modelBlocks.find(b => b.id === 'blk-heading-1')).not.toBeUndefined();
    //             expect(modelBlocks.find(b => b.id === 'blk-code-4')).not.toBeUndefined();
    //             expect(modelBlocks.find(b => b.id === 'blk-callout-6')).not.toBeUndefined();

    //             expect(document.getElementById('blk-paragraph-0')).not.toBeNull();
    //             expect(document.getElementById('blk-heading-1')).not.toBeNull();
    //             expect(document.getElementById('blk-code-4')).not.toBeNull();
    //             expect(document.getElementById('blk-callout-6')).not.toBeNull();
    //         }, 700);
    //     }, 500);
    // }); 
});
