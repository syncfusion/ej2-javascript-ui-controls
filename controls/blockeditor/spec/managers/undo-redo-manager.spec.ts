import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BaseStylesProp, BlockModel } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, getBlockContentElement } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Undo Redo Manager:', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    function triggerUndo(editorElement: HTMLElement) : void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement) : void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

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

    describe('Main actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.Paragraph, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world 1' }] },
                { id: 'paragraph2', type: BlockType.Paragraph, content: [{ id: 'paragraph2-content', type: ContentType.Text, content: 'Hello world 2' }] },
                {
                    id: 'calloutblock',
                    type: BlockType.Callout,
                    props: {
                        children: [
                            {
                                id: 'calloutchild1',
                                type: BlockType.Paragraph,
                                content: [{ id: 'callout-child1-content', type: ContentType.Text, content: 'Callout child 1' }]
                            },
                            {
                                id: 'calloutchild2',
                                type: BlockType.Paragraph,
                                content: [{ id: 'callout-child2-content', type: ContentType.Text, content: 'Callout child 2' }]
                            }
                        ]
                    }
                },
                {
                    id: 'toggleblock',
                    type: BlockType.CollapsibleParagraph,
                    content: [{ id: 'toggle-content-1', type: ContentType.Text, content: 'Click here to expand' }],
                    props: {
                        children: [
                            {
                                id: 'togglechild1',
                                type: BlockType.Checklist,
                                content: [{ type: ContentType.Text, content: 'Todo' }]
                            },
                            {
                                id: 'togglechild2',
                                type: BlockType.Paragraph,
                                content: [{ type: ContentType.Text, content: 'Toggle child 2' }]
                            }
                        ]
                    }
                },
                { id: 'paragraph3', type: BlockType.Paragraph, content: [{ id: 'paragraph3-content', type: ContentType.Text, content: 'Hello world 3' }] },
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

        it('formatting on user typing - undo redo', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.setFocusToBlock(blockElement);
                
                // Activate bold formatting
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', code: 'KeyB', ctrlKey: true }));
                
                // Simulate typing a character
                contentElement.textContent = 'Hello worldx';
                
                // Create a collapsed selection at the end of text
                setCursorPosition(contentElement, contentElement.textContent.length);
                
                editor.formattingAction.handleTypingWithActiveFormats();

                // Last character should be bold now
                expect(contentElement.querySelector('strong')).not.toBeNull();
                expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.bold).toBe(true);
                
                triggerUndo(editorElement);
                expect(contentElement.querySelector('strong')).toBeNull();
                expect(editor.blocks[0].content.length).toBe(1);

                triggerRedo(editorElement);
                expect(contentElement.querySelector('strong')).not.toBeNull();
                expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.bold).toBe(true);
                done();
            }, 100);
        });

        it('move blocks within callout type - undo redo', () => {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.blockCommandManager.moveBlock({
                fromBlockIds: ['calloutchild2'], toBlockId: 'calloutchild1'
            });
            expect((editor.blocks[2].props as BaseChildrenProp).children.length).toBe(2);
            expect((editor.blocks[2].props as BaseChildrenProp).children[0].id).toBe('calloutchild2');
            expect((editor.blocks[2].props as BaseChildrenProp).children[1].id).toBe('calloutchild1');

            triggerUndo(editorElement);
            // expect(editor.blocks[2].children.length).toBe(2);
            // expect(editor.blocks[2].children[0].id).toBe('calloutchild1');
            // expect(editor.blocks[2].children[1].id).toBe('calloutchild2');

            triggerRedo(editorElement);
            // expect(editor.blocks[2].children.length).toBe(2);
            // expect(editor.blocks[2].children[0].id).toBe('calloutchild2');
            // expect(editor.blocks[2].children[1].id).toBe('calloutchild1');
        });

        it('Selective paste action - undo redo', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            
            editor.setSelection('paragraph1-content', 0, 13);
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

            editor.setSelection('paragraph1-content', 1, 12);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                const contentElement = getBlockContentElement(blockElement);
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('H');
                expect(editor.blocks[0].content[1].content).toBe('Hello world 1');
                expect(editor.blocks[0].content[2].content).toBe('1');
                expect(contentElement.childNodes.length).toBe(3);

                triggerUndo(editorElement);
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Hello world 1');
                expect(contentElement.childNodes.length).toBe(1);

                triggerRedo(editorElement);
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('H');
                expect(editor.blocks[0].content[1].content).toBe('Hello world 1');
                expect(editor.blocks[0].content[2].content).toBe('1');
                expect(contentElement.childNodes.length).toBe(3);
                done();
            }, 200);
        });

        it('transform into image block - undo redo', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = blockElement.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            contentElement.textContent = '';
            editor.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 0);
            // Mock file blob for paste
            const imageBlob = new Blob(['fake-image-data'], { type: 'image/png' });
                        
            editor.blockRendererManager.imageRenderer.handleFilePaste(imageBlob).then(() => {
                setTimeout(() => {
                    // Should transform the empty paragraph to image
                    expect(editor.blocks[0].type).toBe(BlockType.Image);
                    expect(editorElement.querySelector('.e-image-block')).not.toBeNull();

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                    expect(editorElement.querySelector('.e-image-block')).toBeNull();

                    triggerRedo(editorElement);
                    setTimeout(() => {
                        expect(editor.blocks[0].type).toBe(BlockType.Image);
                        expect(editorElement.querySelector('.e-image-block')).not.toBeNull();

                        done();
                    }, 200);
                }, 100);
            })
        });

        it('Partial deletion inside callout type - Undo redo', () => {
            const range = document.createRange();
            const selection = document.getSelection();
            const startBlockElement = editorElement.querySelector('#calloutchild1') as HTMLElement;
            const startNode = startBlockElement.querySelector('.e-block-content').firstChild;
            const startOffset = 8;
            const endBlockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            const endNode = endBlockElement.querySelector('.e-block-content').firstChild;
            const endOffset = 8;

            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            selection.removeAllRanges();
            selection.addRange(range);

            editor.setFocusToBlock(startBlockElement);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
            expect((editor.blocks[2].props as BaseChildrenProp).children.length).toBe(1);
            expect((editor.blocks[2].props as BaseChildrenProp).children[0].type).toBe(BlockType.Paragraph);
            expect((editor.blocks[2].props as BaseChildrenProp).children[0].content.length).toBe(1);
            expect((editor.blocks[2].props as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 2');
            expect(getBlockContentElement(startBlockElement).childNodes[0].textContent).toBe('Callout child 2');

            triggerUndo(editorElement);
            expect((editor.blocks[2].props as BaseChildrenProp).children.length).toBe(2);
            expect(editorElement.querySelector('#calloutblock').querySelectorAll('.e-block').length).toBe(2);

            triggerRedo(editorElement);
            expect((editor.blocks[2].props as BaseChildrenProp).children.length).toBe(1);
            expect((editor.blocks[2].props as BaseChildrenProp).children[0].type).toBe(BlockType.Paragraph);
            expect((editor.blocks[2].props as BaseChildrenProp).children[0].content.length).toBe(1);
            expect((editor.blocks[2].props as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 2');
            expect(getBlockContentElement(startBlockElement).childNodes[0].textContent).toBe('Callout child 2');
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
                        { id: 'bold', type: ContentType.Text, content: 'Bold', props: { styles: { bold: true } } },
                        { id: 'italic', type: ContentType.Text, content: 'Italic', props: { styles: { italic: true } } },
                    ]
                },
                { id: 'paragraph4', type: BlockType.Paragraph,
                    content: [
                        { id: 'underline', type: ContentType.Text, content: 'Underline', props: { styles: { underline: true } } },
                        { id: 'strikethrough', type: ContentType.Text, content: 'Strikethrough', props: { styles: { strikethrough: true } } },
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

        it('should handle null values properly', () => {
            expect((editor.undoRedoAction.undoRedoManager as any).restorePartialDeletion({ data: { deletedBlocks: [] }})).toBeUndefined();

            expect((editor.undoRedoAction.undoRedoManager as any).createBlock({})).toBeUndefined();
        });
        
    });
});