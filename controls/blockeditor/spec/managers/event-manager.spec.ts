import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, CollapsibleProps } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, getSelectedRange } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Event Manager:', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
        const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
        node.dispatchEvent(event);
    }

    describe('Main actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.Paragraph, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' }] },
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
                }
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

        it('should update focused blocks on mousemove', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement1);

            triggerMouseMove(blockElement2, 10, 10);
            expect(editor.currentHoveredBlock.id).toBe(blockElement2.id);

            triggerMouseMove(editorElement, 0, 0);
            expect(editor.currentHoveredBlock).toBeNull();
        });

        it('should update focused blocks on mouseup', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement1);

            blockElement2.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            expect(editor.currentFocusedBlock.id).toBe(blockElement2.id);
        });

        it('should update focused blocks on arrow keys', (done) => {
            setTimeout(() => {
                const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
                const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
                const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
                const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;
                editor.setFocusToBlock(blockElement2);
                setCursorPosition(contentElement1, 3);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp' }));
                setTimeout(() => {
                    expect(editor.currentFocusedBlock.id).toBe(blockElement1.id);
                    setCursorPosition(contentElement2, 3);
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown' }));
                    setTimeout(() => {
                        expect(editor.currentFocusedBlock.id).toBe(blockElement2.id);
                        done();
                    }, 300);
                }, 300);
            }, 200);
        });

        it('should handle home and end key actions properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, 5);

            //Trigger home key
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', code: 'Home' }));
            expect(editor.currentFocusedBlock.id).toBe(blockElement1.id);
            expect(editor.nodeSelection.getRange().startOffset).toBe(0);

            //Trigger end key
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', code: 'End' }));
            expect(editor.currentFocusedBlock.id).toBe(blockElement1.id);
            expect(editor.nodeSelection.getRange().startOffset).toBe(contentElement1.textContent.length)
        });

        it('should exit callout on enter press in empty block', () => {
            const blockElement1 = editorElement.querySelector('#calloutchild2') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, contentElement1.textContent.length);

            // On first enter, a new child block should be created
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[2].props as BaseChildrenProp).children.length).toBe(3);

            // On second enter, the callout should be exited since the block is empty
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[2].props as BaseChildrenProp).children.length).toBe(2);
            expect(editor.currentFocusedBlock.id).toBe(editor.blocks[3].id);
        });

        it('should expand the collapsible block on enter press when content is empty', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, contentElement1.textContent.length);

            editor.addBlock({
                id: 'newtoggle',
                type: BlockType.CollapsibleParagraph
            }, 'paragraph1');

            const newBlockElement = editorElement.querySelector('#newtoggle') as HTMLElement;
            const newBlockContent = newBlockElement.querySelector('.e-block-content') as HTMLElement;

            editor.setFocusToBlock(newBlockElement);
            setCursorPosition(newBlockContent, 0);

            // On enter, the collapsible block should be expanded and focus should be moved to children block
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[1].props as CollapsibleProps).isExpanded).toBe(true);
            expect((editor.blocks[1].props as BaseChildrenProp).children.length).toBe(1);
            expect(editor.currentFocusedBlock.id).toBe((editor.blocks[1].props as BaseChildrenProp).children[0].id);

            // On second enter, the collapsible should be exited since the block is empty
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[1].props as BaseChildrenProp).children.length).toBe(1);
            expect(editor.currentFocusedBlock.id).toBe(editor.blocks[2].id);
        });

        it('should reduce indent on empty block while enter press', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, 5);

            editor.blockCommandManager.handleBlockIndentation({
                blockIDs: ['paragraph1'],
                shouldDecrease: false,
            });
            expect(editor.blocks[0].indent).toBe(1);

            contentElement1.textContent = '';
            setCursorPosition(contentElement1, 0);

            // On enter, the indent should be reduced since the block is empty
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect(editor.blocks[0].indent).toBe(0);
        });
        
    });

    describe('Other actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
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

        afterAll(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should handle null values properly', (done) => {
            const rangeSpy1 = spyOn(editor.nodeSelection, 'getRange').and.returnValue(null);
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.setFocusToBlock(blockElement1);
            
            expect((editor.eventManager as any).handleEditorSelection()).toBeUndefined();
            expect((editor.eventManager as any).handleLineBreaksOnBlock(blockElement1)).toBeUndefined();
            rangeSpy1.calls.reset();

            editor.readOnly = true;
            expect((editor.eventManager as any).handleMouseUpActions()).toBeUndefined();
            expect((editor.eventManager as any).handleMouseDownActions()).toBeUndefined();
            editor.readOnly = false;

            let isExecuted = false;
            editor.keyActionExecuted = () => {
                isExecuted = true;
            };
            
            spyOn(editor, 'notify').and.callFake(function () { done(); });
            editorElement.dispatchEvent(new ClipboardEvent('copy'));
            editorElement.dispatchEvent(new ClipboardEvent('paste'));
            editorElement.dispatchEvent(new ClipboardEvent('cut'));

            expect(isExecuted).toBe(true);

            editor.getRange = jasmine.createSpy().and.returnValue({
                commonAncestorContainer: editorElement
            });
            spyOn(editor.inlineToolbarModule, 'hideInlineToolbar').and.callThrough();
            expect((editor.eventManager as any).handleTextSelection());
            expect(editor.inlineToolbarModule.hideInlineToolbar).toHaveBeenCalled();

            setCursorPosition(contentElement1, 0);
            const range = getSelectedRange();
            expect((editor.eventManager as any).handleArrowKeyActions({ key: 'ArrowUp' }, range, blockElement1 )).toBeUndefined();

            done();
        });
        
    });
});