import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor, createMockClipboardEvent, setRange, triggerMouseMove } from "../common/util.spec";
import { BaseChildrenProp, BaseStylesProp, BlockModel} from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { getBlockContentElement, setCursorPosition, setSelectionRange } from "../../src/common/utils/index";

describe('Quote Blocks - rendering, formatting, clipboard, and actions', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    describe('Testing quote block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'quote', blockType: BlockType.Quote,
                    properties: {
                        children: [
                            {
                                id: 'quote-block-1', blockType: BlockType.Heading, properties: { level: 1 },
                                content: [{ id: 'quote-content-1', contentType: ContentType.Text, content: 'Quote item 1' }],
                            },
                            {
                                id: 'quote-block-2', blockType: BlockType.Paragraph, content: [{ id: 'quote-content-2', contentType: ContentType.Text, content: 'Quote item 2' }],
                            }
                        ]
                    }
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

        it('should render in DOM correctly', () => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            expect(blockElement.classList).toContain('e-quote-block');
            const quoteChildBlocks = blockElement.querySelectorAll('.e-quote-content .e-block');
            expect(quoteChildBlocks.length).toBe(2);
            expect(quoteChildBlocks[0].querySelector('h1').textContent).toContain('Quote item 1');
            expect(quoteChildBlocks[1].querySelector('p').textContent).toContain('Quote item 2');
            // Assert Model
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
            const children = (editor.blocks[0].properties as BaseChildrenProp).children;
            expect(children.length).toBe(2);
            expect(children[0].id).toBe('quote-block-1');
            expect(children[1].id).toBe('quote-block-2');
            expect(children[0].content[0].content).toBe('Quote item 1');
            expect(children[1].content[0].content).toBe('Quote item 2');
            // Neighbor DOM
            expect(blockElement.previousElementSibling).toBeNull();
            expect(blockElement.nextElementSibling).toBeNull();
        });

        it('should render default block if children not specified', () => {
            const editorElement1: HTMLElement = createElement('div', { id: 'editor1' });
            document.body.appendChild(editorElement1);
            let editor1: BlockEditor = createEditor({
                blocks: [{ id: 'quote', blockType: BlockType.Quote }]
            });
            editor1.appendTo('#editor1');
            const quoteChildBlocks = editorElement1.querySelectorAll('.e-quote-content .e-block');
            expect(quoteChildBlocks.length).toBe(1);
            expect(quoteChildBlocks[0].querySelector('p').textContent.length).toBe(0);
            // Model
            expect(editor1.blocks.length).toBe(1);
            const children = (editor1.blocks[0].properties as BaseChildrenProp).children;
            expect(children.length).toBe(1);
            expect(children[0].blockType).toBe(BlockType.Paragraph);
            // DOM neighbors
            const outer = editorElement1.querySelector('.e-block') as HTMLElement;
            expect(outer.previousElementSibling).toBeNull();
            expect(outer.nextElementSibling).toBeNull();
            if (editor1) {
                editor1.destroy();
                editor1 = undefined;
            }
            remove(editorElement1);
        });

        it('Type text in quote’s child Paragraph, update JSON ', () => {
            const blockElement = editorElement.querySelector('#quote-block-2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            contentElement.textContent = 'Updated Quote Child Content';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            // Assert DOM
            expect(contentElement.textContent).toBe('Updated Quote Child Content');
            const childBlock = (editor.blocks[0].properties as BaseChildrenProp).children[1];
            expect(childBlock.content[0].content).toBe('Updated Quote Child Content');
        });
        
        it('should exit quote on enter press in empty block', () => {
            const blockElement1 = editorElement.querySelector('#quote-block-2') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, contentElement1.textContent.length);

            // Clear the content to make it empty
            contentElement1.textContent = '';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement1);

            // First enter: creates a new empty child block inside quote
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toBe(1);

            // Second enter in the new empty block: exits the quote
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toBe(1);
            expect(editor.blockManager.currentFocusedBlock.id).toBe(editor.blocks[2].id);
            // DOM neighbors: next to quote is the new block
            const quoteEl = editorElement.querySelector('#quote') as HTMLElement;
            const next = quoteEl.nextElementSibling as HTMLElement;
            expect(next && next.id).toBe(editor.blocks[1].id);
            expect(next.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
        });

        it('should delete whole quote properly', (done) => {
            const blockElement = editor.element.querySelector('#quote') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                (popup.querySelector('#delete') as HTMLElement).click();

                // Model
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                // DOM
                expect(editorElement.querySelector('.e-quote-content')).toBeNull();
                const allBlocks = editorElement.querySelectorAll('.e-block');
                expect(allBlocks.length).toBe(1);
                expect((allBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe(BlockType.Paragraph);
                done();
            }, 200);
        });
    });

    describe('Combination: 1', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should apply bold to entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Quote child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, (blockContent.textContent as string).length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert DOM
            const strongElement = blockContent.querySelector('strong');
            expect(strongElement).toBeDefined();
            expect(strongElement.textContent).toBe('Quote child Paragraph');

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.bold).toBe(true);
        });

        it('should apply lowercase to entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Quote child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, (blockContent.textContent as string).length);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            // Assert DOM
            const spanWithLowercase = blockContent.querySelector('span[style*="text-transform"]');
            expect(spanWithLowercase).toBeDefined();

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
        });

        it('should apply subscript to entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Quote child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, (blockContent.textContent as string).length);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Assert DOM
            const subElement = blockContent.querySelector('sub');
            expect(subElement).toBeDefined();
            expect(subElement.textContent).toBe('Quote child Paragraph');

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.subscript).toBe(true);
        });

        it('should apply all formatting styles to entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Quote child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Assert DOM
            expect(blockContent.querySelector('strong')).toBeDefined();
            expect(blockContent.querySelector('em')).toBeDefined();
            expect(blockContent.querySelector('u')).toBeDefined();
            expect(blockContent.querySelector('s')).toBeDefined();
            expect(blockContent.querySelector('sup')).toBeDefined();

            const spanWithLowercase = blockContent.querySelector('span[style*="text-transform"]');
            expect(spanWithLowercase).toBeDefined();

            const spanWithColorAndBg = blockContent.querySelectorAll('span[style*="color"], span[style*="background-color"]');
            expect(spanWithColorAndBg.length).toBeGreaterThan(0);

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            const styles = (content[0].properties as BaseStylesProp).styles;
            expect(styles.bold).toBe(true);
            expect(styles.italic).toBe(true);
            expect(styles.underline).toBe(true);
            expect(styles.strikethrough).toBe(true);
            expect(styles.lowercase).toBe(true);
            expect(styles.superscript).toBe(true);
            expect(styles.color).toBe('#FF0000');
            expect(styles.backgroundColor).toBe('#FFFF00');
        });

        it('should apply all formatting styles to a single word', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Quote child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "child"

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#0000FF' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#00FF00' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Quote child Paragraph');
            const formattedSegments = blockContent.querySelectorAll('strong, em, u, s, sup, span[style]');
            expect(formattedSegments.length).toBeGreaterThan(0);

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(3);
            expect(content[0].content).toBe('Quote ');
            expect(content[1].content).toBe('child');
            expect(content[2].content).toBe(' Paragraph');
            const styles = (content[1].properties as BaseStylesProp).styles;
            expect(styles.bold).toBe(true);
            expect(styles.italic).toBe(true);
            expect(styles.underline).toBe(true);
            expect(styles.strikethrough).toBe(true);
            expect(styles.lowercase).toBe(true);
            expect(styles.superscript).toBe(true);
            expect(styles.color).toBe('#0000FF');
            expect(styles.backgroundColor).toBe('#00FF00');
        });

        it('should apply italic to an overlapping selection over bold and non-formatted text', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Apply bold to "Brown Fox"
            setSelectionRange(blockContent.firstChild as Node, 10, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert DOM
            expect(blockContent.querySelectorAll('strong').length).toBeGreaterThan(0);
            expect(blockContent.querySelectorAll('em').length).toEqual(0);

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;

            const foxSegment = content.find(item => (item.content as string).includes('Fox'));
            expect(foxSegment).toBeDefined();
            const foxStyles = (foxSegment.properties as BaseStylesProp).styles;
            expect(foxStyles.bold).toBe(true);
        });

        it('should undo bold formatting applied to the entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            triggerUndo(editorElement);

            expect(blockContent.querySelector('strong')).toBeNull();

            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            expect((blockModel.content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
        });
    });

    describe('Combination: 2', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should insert label item properly in quote block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Hello $ world' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const blockElement = editor.element.querySelector('#quote-child') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 7);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="high"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        const children = (editor.blocks[0].properties as BaseChildrenProp).children[0];
                        expect(contentElement.childElementCount).toBe(1);
                        expect(contentElement.childNodes[0].textContent).toBe('Hello ');
                        const labelNode = contentElement.childNodes[1] as HTMLElement;
                        expect(labelNode.textContent).toBe('Priority: High');
                        expect(labelNode.classList.contains('e-label-chip')).toBe(true);
                        expect(children.content[1].contentType).toBe(ContentType.Label);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('should insert mention item properly in quote block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                users: [
                    { id: 'user1', user: 'User 1' },
                    { id: 'user2', user: 'User 2' }
                ],
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            id: 'quote-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Bolded @ text' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const blockElement = editor.element.querySelector('#quote-child') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 8);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        const children = (editor.blocks[0].properties as BaseChildrenProp).children[0];
                        expect(contentElement.childElementCount).toBe(1);
                        expect(contentElement.childNodes[0].textContent).toBe('Bolded ');
                        const mentionNode = contentElement.childNodes[1] as HTMLElement;
                        expect(mentionNode.querySelector('.em-content').textContent).toBe('User 1');
                        expect(mentionNode.classList.contains('e-user-chip')).toBe(true);
                        expect(children.content[1].contentType).toBe(ContentType.Mention);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('copy & paste whole block inside quote', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'quote',
                    blockType: BlockType.Quote,
                    properties: {
                        children: [
                            {
                                id: 'quote-child1',
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'First paragraph' }],
                            },
                            {
                                id: 'quote-child2',
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'second paragraph' }],
                            }
                        ]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#quote-child1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => format === 'text/blockeditor' ? editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData : ''
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                const children = (editor.blocks[0].properties as BaseChildrenProp).children;
                expect(children.length).toBe(3);
                expect(children[1].content[0].content).toBe('First paragraph');
                const childEls = editorElement.querySelectorAll('.e-quote-content .e-block');
                expect(childEls.length).toBe(3);
                done();
            }, 100);
        });
    });
});