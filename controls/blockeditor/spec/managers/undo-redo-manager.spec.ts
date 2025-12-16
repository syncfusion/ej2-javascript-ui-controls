import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BaseStylesProp, BlockModel } from '../../src//models/index';
import { createEditor } from '../common/util.spec';
import { setCursorPosition, getBlockContentElement } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

describe('Undo/Redo Actions', () => {
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

    describe('Typing, moves, paste, transforms and splits - with undo/redo', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world 1' }] },
                { id: 'heading2', blockType: BlockType.Heading, properties: { level: 2 }, content: [{ id: 'heading2-content', contentType: ContentType.Text, content: 'Hello world 2' }] },
                {
                    id: 'calloutblock',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [
                            {
                                id: 'calloutchild1',
                                blockType: BlockType.Paragraph,
                                content: [{ id: 'callout-child1-content', contentType: ContentType.Text, content: 'Callout child 1' }]
                            },
                            {
                                id: 'calloutchild2',
                                blockType: BlockType.Paragraph,
                                content: [{ id: 'callout-child2-content', contentType: ContentType.Text, content: 'Callout child 2' }]
                            }
                        ]
                    }
                },
                {
                    id: 'toggleblock',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ id: 'toggle-content-1', contentType: ContentType.Text, content: 'Click here to expand' }],
                    properties: {
                        children: [
                            {
                                id: 'togglechild1',
                                blockType: BlockType.Checklist,
                                content: [{ contentType: ContentType.Text, content: 'Todo' }]
                            },
                            {
                                id: 'togglechild2',
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'Toggle child 2' }]
                            }
                        ]
                    }
                },
                { id: 'paragraph3', blockType: BlockType.Paragraph, content: [{ id: 'paragraph3-content', contentType: ContentType.Text, content: 'Hello world 3' }] },
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
                editor.blockManager.setFocusToBlock(blockElement);
                
                // Activate bold formatting
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', code: 'KeyB', ctrlKey: true }));
                
                // Simulate typing a character
                contentElement.textContent = 'Hello worldx';
                
                // Create a collapsed selection at the end of text
                setCursorPosition(contentElement, contentElement.textContent.length);
                
                editor.blockManager.formattingAction.handleTypingWithActiveFormats();

                // Assert Model after formatting
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe("Hello world");
                expect(editor.blocks[0].content[1].content).toBe("x");
                expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);

                // Assert Dom after formatting
                expect(contentElement.childNodes.length).toBe(2);
                expect(contentElement.querySelector('span')).not.toBeNull();
                expect(contentElement.querySelector('strong')).not.toBeNull();
                expect(contentElement.querySelector('span').textContent).toBe("Hello world");
                expect(contentElement.querySelector('strong').textContent).toBe("x");
                // Neighbor model/DOM intact
                expect(editor.blocks[1].id).toBe('heading2');
                const nextAfterPara1 = (blockElement.nextElementSibling as HTMLElement);
                expect(nextAfterPara1 && nextAfterPara1.id).toBe('heading2');
                
                triggerUndo(editorElement);
                // Assert Model after undo
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe("Hello world 1");

                // Assert Dom after undo
                expect(contentElement.childNodes.length).toBe(1);
                expect(contentElement.querySelector('span')).toBeNull();
                expect(contentElement.querySelector('strong')).toBeNull();
                expect(contentElement.textContent).toBe("Hello world 1");
                // Neighbor still intact after undo
                expect(editor.blocks[1].id).toBe('heading2');
                expect(((editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement).id).toBe('heading2');

                triggerRedo(editorElement);
                // Assert Model after redo
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe("Hello world");
                expect(editor.blocks[0].content[1].content).toBe("x");
                expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);

                // Assert Dom after redo
                expect(contentElement.childNodes.length).toBe(2);
                expect(contentElement.querySelector('span')).not.toBeNull();
                expect(contentElement.querySelector('strong')).not.toBeNull();
                expect(contentElement.querySelector('span').textContent).toBe("Hello world");
                expect(contentElement.querySelector('strong').textContent).toBe("x");
                // Neighbor still intact after redo
                expect(editor.blocks[1].id).toBe('heading2');
                expect(((editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement).id).toBe('heading2');
                done();
            }, 100);
        });

        it('move blocks within callout type - undo redo', () => {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.blockManager.blockCommand.moveBlock({
                fromBlockIds: ['calloutchild2'], toBlockId: 'calloutchild1'
            });
            // Model after move
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(2);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe('calloutchild2');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 2');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].id).toBe('calloutchild1');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].content[0].content).toBe('Callout child 1');
            // DOM after move
            const calloutEl = editorElement.querySelector('#calloutblock') as HTMLElement;
            const firstChild = calloutEl.querySelector('.e-block') as HTMLElement;
            expect(firstChild.id).toBe('calloutchild2');
            expect(firstChild.textContent).toBe('Callout child 2');
            expect((firstChild.nextElementSibling as HTMLElement).id).toBe('calloutchild1');
            expect((firstChild.nextElementSibling as HTMLElement).textContent).toBe('Callout child 1');
            // Neighbors of callout unchanged
            expect((calloutEl.previousElementSibling as HTMLElement).id).toBe('heading2');
            expect((calloutEl.nextElementSibling as HTMLElement).id).toBe('toggleblock');

            triggerUndo(editorElement);
            // Model after undo restores original order
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe('calloutchild1');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 1');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].id).toBe('calloutchild2');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].content[0].content).toBe('Callout child 2');

            // DOM after undo
            const firstUndo = (editorElement.querySelector('#calloutblock') as HTMLElement).querySelector('.e-block') as HTMLElement;
            // expect(firstUndo.id).toBe('calloutchild1');
            // expect(firstUndo.textContent).toBe('Callout child 1');
            // Neighbors remain unchanged after undo
            const calloutElUndo = editorElement.querySelector('#calloutblock') as HTMLElement;
            expect((calloutElUndo.previousElementSibling as HTMLElement).id).toBe('heading2');
            expect((calloutElUndo.nextElementSibling as HTMLElement).id).toBe('toggleblock');

            triggerRedo(editorElement);
            // Model after redo reapplies move
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe('calloutchild1');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].id).toBe('calloutchild2');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 1');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].content[0].content).toBe('Callout child 2');

            // DOM after redo
            const firstRedo = (editorElement.querySelector('#calloutblock') as HTMLElement).querySelector('.e-block') as HTMLElement;
            // expect(firstRedo.id).toBe('calloutchild2');
            // expect(firstRedo.textContent).toBe('Callout child 2');
            // Neighbors remain unchanged after redo
            const calloutElRedo = editorElement.querySelector('#calloutblock') as HTMLElement;
            expect((calloutElRedo.previousElementSibling as HTMLElement).id).toBe('heading2');
            expect((calloutElRedo.nextElementSibling as HTMLElement).id).toBe('toggleblock');
        });

        it('Selective paste action - undo redo', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('paragraph1-content', 0, 13);
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

            editor.setSelection('paragraph1-content', 1, 12);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                const contentElement = getBlockContentElement(blockElement);
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('H');
                expect(editor.blocks[0].content[1].content).toBe('Hello world 1');
                expect(editor.blocks[0].content[2].content).toBe('1');
                expect(contentElement.childNodes.length).toBe(3);
                expect(contentElement.textContent).toBe("HHello world 11");
                // Neighbors intact
                expect(editor.blocks[1].id).toBe('heading2');
                expect(((editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement).id).toBe('heading2');

                triggerUndo(editorElement);
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Hello world 1');
                expect(contentElement.childNodes.length).toBe(1);
                expect(editor.blocks[1].id).toBe('heading2');
                expect(contentElement.textContent).toBe("Hello world 1");

                triggerRedo(editorElement);
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('H');
                expect(editor.blocks[0].content[1].content).toBe('Hello world 1');
                expect(editor.blocks[0].content[2].content).toBe('1');
                expect(contentElement.childNodes.length).toBe(3);
                expect(contentElement.textContent).toBe("HHello world 11");
                expect(editor.blocks[1].id).toBe('heading2');
                done();
            }, 200);
        });

        it('Paste image block empty paragraph - undo redo', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = blockElement.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent = '';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 0);
            // Mock file blob for paste
            const imageBlob = new Blob(['fake-image-data'], { type: 'image/png' });
                        
            editor.blockManager.blockRenderer.imageRenderer.handleFilePaste(imageBlob).then(() => {
                setTimeout(() => {
                    // Should transform the empty paragraph to image
                    expect(editor.blocks[0].blockType).toBe(BlockType.Image);
                    const imgEl = editorElement.querySelector('.e-image-block') as HTMLElement;
                    expect(imgEl).not.toBeNull();
                    const imageBlock: HTMLElement = imgEl.closest('.e-block') as HTMLElement;
                    // Neighbor next should still be heading2
                    expect((imageBlock.nextElementSibling as HTMLElement).id).toBe('heading2');

                    triggerUndo(editorElement);
                    // expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                    // expect(editor.blocks[0].content[0].content).toBe("");
                    // expect(((editorElement.querySelector('#paragraph1') as HTMLElement).textContent)).toBe("")
                    expect(editorElement.querySelector('.e-image-block')).toBeNull();
                    // Neighbor still heading2
                    expect(((editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement).id).toBe('heading2');
                    // Model neighbor intact
                    expect(editor.blocks[1].id).toBe('heading2');

                    triggerRedo(editorElement);
                    setTimeout(() => {
                        // expect(editor.blocks[0].blockType).toBe(BlockType.Image);
                        // const imgEl2 = editorElement.querySelector('.e-image-block') as HTMLElement;
                        // expect(imgEl2).not.toBeNull();
                        // expect((imgEl2.nextElementSibling as HTMLElement).id).toBe('heading2');

                        done();
                    }, 200);
                }, 100);
            })
        });

        it('Partial deletion when start block is at 0th index - Undo redo', () => {
            editor.addBlock({
                id: 'paragraph2',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: 'Hello world new' }]
            }, 'heading2');
            const range = document.createRange();
            const selection = document.getSelection();
            const startBlockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const startNode = startBlockElement.querySelector('.e-block-content').firstChild;
            const startOffset = 0;
            const endBlockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            const endNode = endBlockElement.querySelector('.e-block-content').firstChild;
            const endOffset = endNode.textContent.length;

            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.setFocusToBlock(startBlockElement);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].id).toBe('paragraph2');
            expect(editor.blocks[0].content.length).toBe(0);
            expect(editorElement.querySelector('#paragraph2')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph2').textContent).toBe('');
            expect(editorElement.querySelector('#heading2')).toBeNull();
            expect(editorElement.querySelector('#paragraph1')).toBeNull();

            triggerUndo(editorElement);
            expect(editor.blocks.length).toBe(6);
            expect(editor.blocks[0].id).toBe('paragraph1');
            expect(editor.blocks[0].content[0].content).toBe('Hello world 1');
            expect(editor.blocks[1].id).toBe('heading2');
            expect(editor.blocks[1].content[0].content).toBe('Hello world 2');
            expect(editor.blocks[2].id).toBe('paragraph2');
            expect(editor.blocks[2].content[0].content).toBe('Hello world new');
            expect(editorElement.querySelector('#paragraph1')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph1').textContent).toBe('Hello world 1');
            expect(editorElement.querySelector('#heading2')).not.toBeNull();
            expect(editorElement.querySelector('#heading2').textContent).toBe('Hello world 2');
            expect(editorElement.querySelector('#paragraph2')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph2').textContent).toBe('Hello world new');

            triggerRedo(editorElement);
            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].id).toBe('paragraph2');
            expect(editor.blocks[0].content.length).toBe(0);
            expect(editorElement.querySelector('#paragraph2')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph2').textContent).toBe('');
            expect(editorElement.querySelector('#heading2')).toBeNull();
            expect(editorElement.querySelector('#paragraph1')).toBeNull();

            triggerUndo(editorElement);
            expect(editor.blocks.length).toBe(6);
            expect(editor.blocks[0].id).toBe('paragraph1');
            expect(editor.blocks[0].content[0].content).toBe('Hello world 1');
            expect(editor.blocks[1].id).toBe('heading2');
            expect(editor.blocks[1].content[0].content).toBe('Hello world 2');
            expect(editor.blocks[2].id).toBe('paragraph2');
            expect(editor.blocks[2].content[0].content).toBe('Hello world new');
            expect(editorElement.querySelector('#paragraph1')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph1').textContent).toBe('Hello world 1');
            expect(editorElement.querySelector('#heading2')).not.toBeNull();
            expect(editorElement.querySelector('#heading2').textContent).toBe('Hello world 2');
            expect(editorElement.querySelector('#paragraph2')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph2').textContent).toBe('Hello world new');

            triggerRedo(editorElement);
            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].id).toBe('paragraph2');
            expect(editor.blocks[0].content.length).toBe(0);
            expect(editorElement.querySelector('#paragraph2')).not.toBeNull();
            expect(editorElement.querySelector('#paragraph2').textContent).toBe('');
            expect(editorElement.querySelector('#heading2')).toBeNull();
            expect(editorElement.querySelector('#paragraph1')).toBeNull();
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

            editor.blockManager.setFocusToBlock(startBlockElement);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
            // Model: one child remains with content 'Callout child 2'
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(1);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].blockType).toBe(BlockType.Paragraph);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe("calloutchild1");
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content.length).toBe(1);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 2');
            // DOM: first child text reflects merged
            expect(getBlockContentElement(startBlockElement).childNodes[0].textContent).toBe('Callout child 2');
            // Neighbors of parent callout unchanged
            const calloutEl = editorElement.querySelector('#calloutblock') as HTMLElement;
            expect((calloutEl.previousElementSibling as HTMLElement).id).toBe('heading2');
            expect((calloutEl.nextElementSibling as HTMLElement).id).toBe('toggleblock');

            triggerUndo(editorElement);
            // Assert Model after undo
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(2);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].blockType).toBe(BlockType.Paragraph);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].blockType).toBe(BlockType.Paragraph);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe("calloutchild1");
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].id).toBe("calloutchild2");
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content.length).toBe(1);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 1');
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].content.length).toBe(1);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].content[0].content).toBe('Callout child 2');

            // Assert Dom after undo
            expect(editorElement.querySelector('#calloutblock').querySelectorAll('.e-block').length).toBe(2);
            const calloutEle1: HTMLElement = editorElement.querySelector('#calloutchild1');
            const calloutEle2: HTMLElement = editorElement.querySelector('#calloutchild2');
            expect(calloutEle1.textContent).toBe("Callout child 1");
            expect(calloutEle2.textContent).toBe("Callout child 2");
            // Neighbors unchanged after undo
            const calloutElUndo = editorElement.querySelector('#calloutblock') as HTMLElement;
            expect((calloutElUndo.previousElementSibling as HTMLElement).id).toBe('heading2');
            expect((calloutElUndo.nextElementSibling as HTMLElement).id).toBe('toggleblock');

            triggerRedo(editorElement);
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(1);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].blockType).toBe(BlockType.Paragraph);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe("calloutchild1");
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content.length).toBe(1);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content[0].content).toBe('Callout child 2');
            expect(getBlockContentElement(startBlockElement).childNodes[0].textContent).toBe('Callout child 2');
            // Neighbors unchanged after redo
            const calloutElRedo = editorElement.querySelector('#calloutblock') as HTMLElement;
            expect((calloutElRedo.previousElementSibling as HTMLElement).id).toBe('heading2');
            expect((calloutElRedo.nextElementSibling as HTMLElement).id).toBe('toggleblock');
        });

        it('Enter action on beggining of heading - undo redo', () => {
            const blockElement = editorElement.querySelector('#heading2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            editor.blockManager.blockCommand.splitBlock();

            // Model: paragraph inserted before heading2 with heading2 as id
            expect(editor.blocks[0].id).toBe('paragraph1');
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].id).toBe("heading2");
            expect(editor.blocks[2].blockType).toBe(BlockType.Heading);
            expect(editor.blocks[2].content[0].content).toBe("Hello world 2");

            // DOM 
            let transformedEle = editorElement.querySelector('#heading2') as HTMLElement;
            let prev = transformedEle.previousElementSibling as HTMLElement;
            expect(prev.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            expect(prev.id).toBe('paragraph1');
            let next = transformedEle.nextElementSibling as HTMLElement;
            expect(next.getAttribute('data-block-type')).toBe(BlockType.Heading);

            triggerUndo(editorElement);
            expect(editor.blocks[1].blockType).toBe(BlockType.Heading);
            expect(editor.blocks[1].id).toBe("heading2");
            expect(editor.blocks[1].content[0].content).toBe("Hello world 2");
            expect(((editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement).id).toBe('heading2');

            triggerRedo(editorElement);
            // Model: paragraph inserted before heading2 with heading2 as id
            expect(editor.blocks[0].id).toBe('paragraph1');
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].id).toBe("heading2");
            expect(editor.blocks[2].blockType).toBe(BlockType.Heading);
            expect(editor.blocks[2].content[0].content).toBe("Hello world 2");

            // DOM 
            transformedEle = editorElement.querySelector('#heading2') as HTMLElement;
            prev = transformedEle.previousElementSibling as HTMLElement;
            expect(prev.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            expect(prev.id).toBe('paragraph1');
            next = transformedEle.nextElementSibling as HTMLElement;
            expect(next.getAttribute('data-block-type')).toBe(BlockType.Heading);
        });

        it('Enter action on beggining of formatted block - undo redo', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('paragraph1-content', 0, 13);
            editor.executeToolbarAction(CommandName.Bold);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            editor.blockManager.blockCommand.splitBlock();

            // Model: paragraph split into two; heading2 shifts to index 2
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].id).toBe("paragraph1");
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].content[0].content).toBe("Hello world 1");
            expect((editor.blocks[1].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(editor.blocks[2].id).toBe('heading2');
            // DOM
            let transformedEle = editorElement.querySelector('#paragraph1') as HTMLElement;
            let nextAfterPara1 = transformedEle.nextElementSibling as HTMLElement;
            expect(nextAfterPara1.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            expect((nextAfterPara1.querySelector('strong'))).not.toBeNull();
            expect((nextAfterPara1.textContent)).toBe("Hello world 1");

            triggerUndo(editorElement);
            // Assert Model after undo
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].id).toBe("paragraph1");
            expect(editor.blocks[0].content[0].content).toBe("Hello world 1");

            // Assert Dom
            expect(((editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement).id).toBe('heading2');
            expect((editorElement.querySelector('#' + editor.blocks[0].id) as HTMLElement).querySelector('strong')).not.toBeNull();
            expect(((editorElement.querySelector('#paragraph1') as HTMLElement).textContent)).toBe('Hello world 1');

            triggerRedo(editorElement);
            // Assert Model after redo
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].id).toBe("paragraph1");
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].content[0].content).toBe("Hello world 1");
            expect((editor.blocks[1].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(editor.blocks[2].id).toBe('heading2');
            // DOM
            transformedEle = editorElement.querySelector('#paragraph1') as HTMLElement;
            nextAfterPara1 = transformedEle.nextElementSibling as HTMLElement;
            expect(nextAfterPara1.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            expect((nextAfterPara1.querySelector('strong'))).not.toBeNull();
            expect((nextAfterPara1.textContent)).toBe("Hello world 1");
        });

    });

    describe('Edge cases and null handling', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.BulletList, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
                { id: 'paragraph2', blockType: BlockType.BulletList, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: 'Paragraph 2' }] },
                { id: 'paragraph3', blockType: BlockType.Paragraph,
                    content: [
                        { id: 'bold', contentType: ContentType.Text, content: 'Bold', properties: { styles: { bold: true } } },
                        { id: 'italic', contentType: ContentType.Text, content: 'Italic', properties: { styles: { italic: true } } },
                    ]
                },
                { id: 'paragraph4', blockType: BlockType.Paragraph,
                    content: [
                        { id: 'underline', contentType: ContentType.Text, content: 'Underline', properties: { styles: { underline: true } } },
                        { id: 'strikethrough', contentType: ContentType.Text, content: 'Strikethrough', properties: { styles: { strikethrough: true } } },
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
            const beforeLen = editor.blocks.length;
            const beforeIds = editor.blocks.map(b => b.id);
            expect((editor.blockManager.undoRedoAction.undoRedoManager as any).restorePartialDeletion({ data: { deletedBlocks: [] }})).toBeUndefined();
            expect((editor.blockManager.undoRedoAction.undoRedoManager as any).createBlock({})).toBeUndefined();
            // Model unchanged
            expect(editor.blocks.length).toBe(beforeLen);
            expect(editor.blocks.map(b => b.id)).toEqual(beforeIds);
            expect((editor.blocks[0]).id).toBe('paragraph1');
            expect((editor.blocks[1]).id).toBe('paragraph2');
            expect((editor.blocks[0]).content[0].content).toBe('Hello world');
            expect((editor.blocks[1]).content[0].content).toBe('Paragraph 2');
            // DOM unchanged order
            const all = editorElement.querySelectorAll('.e-block');
            expect((all[0] as HTMLElement).id).toBe('paragraph1');
            expect((all[1] as HTMLElement).id).toBe('paragraph2');
            expect((all[0] as HTMLElement).textContent).toBe('Hello world');
            expect((all[1] as HTMLElement).textContent).toBe('Paragraph 2');
        });
        
    });
});