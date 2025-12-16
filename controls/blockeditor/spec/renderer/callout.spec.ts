import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor, createMockClipboardEvent, setRange, triggerMouseMove } from "../common/util.spec";
import { BaseChildrenProp, BaseStylesProp, BlockModel, ILabelContentSettings, IMentionContentSettings} from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { getBlockContentElement, setCursorPosition, setSelectionRange } from "../../src/common/utils/index";

describe('Callout Blocks - rendering, formatting, clipboard, and actions', () => {
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

    describe('Testing callout block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'callout', blockType: BlockType.Callout,
                    properties: {
                        children: [
                            {
                                id: 'callout-block-1', blockType: BlockType.Heading, properties: { level: 1 },
                                content: [{ id: 'callout-content-1', contentType: ContentType.Text, content: 'Callout item 1' }],
                            },
                            {
                                id: 'callout-block-2', blockType: BlockType.Paragraph, content: [{ id: 'callout-content-2', contentType: ContentType.Text, content: 'Callout item 2' }],
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
            expect(blockElement.classList).toContain('e-callout-block');
            expect(blockElement.querySelector('.e-callout-icon')).toBeDefined();
            const calloutChildBlocks = blockElement.querySelectorAll('.e-callout-content .e-block');
            expect(calloutChildBlocks.length).toBe(2);
            expect(calloutChildBlocks[0].querySelector('h1').textContent).toContain('Callout item 1');
            expect(calloutChildBlocks[1].querySelector('p').textContent).toContain('Callout item 2');
            // Assert Model
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Callout);
            const children = (editor.blocks[0].properties as BaseChildrenProp).children;
            expect(children.length).toBe(2);
            expect(children[0].id).toBe('callout-block-1');
            expect(children[1].id).toBe('callout-block-2');
            expect(children[0].content[0].content).toBe('Callout item 1');
            expect(children[1].content[0].content).toBe('Callout item 2');
            // Neighbor DOM
            expect(blockElement.previousElementSibling).toBeNull();
            expect(blockElement.nextElementSibling).toBeNull();
        });

        it('should render default block if children not specified', () => {
            const editorElement1: HTMLElement = createElement('div', { id: 'editor1' });
            document.body.appendChild(editorElement1);
            let editor1: BlockEditor = createEditor({
                blocks: [{ id: 'callout', blockType: BlockType.Callout }]
            });
            editor1.appendTo('#editor1');
            const calloutChildBlocks = editorElement1.querySelectorAll('.e-callout-content .e-block');
            expect(calloutChildBlocks.length).toBe(1);
            expect(calloutChildBlocks[0].querySelector('p').textContent.length).toBe(0);
            // Model
            expect(editor1.blocks.length).toBe(1);
            const children = (editor1.blocks[0].properties as BaseChildrenProp).children;
            expect(children.length).toBe(1);
            expect(children[0].blockType).toBe(BlockType.Paragraph);
            // expect(children[0].content[0].content).toBe('');
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

        it('Type text in callout’s child Paragraph, update JSON ', () => {
            const blockElement = editorElement.querySelector('.e-callout-content .e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            contentElement.textContent = 'Updated Callout Child Content';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            // Assert DOM
            expect(contentElement.textContent).toBe('Updated Callout Child Content');
            // Assert Model
            const childBlock = (editor.blocks[0].properties as BaseChildrenProp).children[0];
            expect(childBlock.content[0].content).toBe('Updated Callout Child Content');
            // Neighbors
            const firstChildEl = (editorElement.querySelector('#callout') as HTMLElement).querySelector('.e-callout-content') as HTMLElement;
            expect(firstChildEl.querySelector('.e-block') as HTMLElement).not.toBeNull();
        });
        
        it('should exit callout on enter press in empty block', () => {
            const blockElement1 = editorElement.querySelector('#callout-block-2') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, contentElement1.textContent.length);

            // On first enter, a new child block should be created
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toBe(3);

            // On second enter, the callout should be exited since the block is empty
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toBe(2);
            expect(editor.blockManager.currentFocusedBlock.id).toBe(editor.blocks[1].id);
            // DOM neighbors: next to callout is the new block
            const calloutEl = editorElement.querySelector('#callout') as HTMLElement;
            const next = calloutEl.nextElementSibling as HTMLElement;
            expect(next && next.id).toBe(editor.blocks[1].id);
            expect(next.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
        });

        it('should delete whole callout properly', (done) => {
            const blockElement = editor.element.querySelector('#callout') as HTMLElement;
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
                expect(editorElement.querySelector('.e-callout-content')).toBeNull();
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
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Callout child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement; // Corrected
            const blockContent = getBlockContentElement(blockElement); // Corrected
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, (blockContent.textContent as string).length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert DOM
            const strongElement = blockContent.querySelector('strong');
            expect(strongElement).toBeDefined();
            expect(strongElement.textContent).toBe('Callout child Paragraph');
            expect(blockContent.textContent).toBe('Callout child Paragraph');

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.bold).toBe(true); // Corrected to toBe(true)
            // Neighbors
            const calloutEl = editorElement.querySelector('#callout') as HTMLElement;
            expect(calloutEl.previousElementSibling).toBeNull();
            expect(calloutEl.nextElementSibling).toBeNull();
        });

        it('should apply lowercase to entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Callout child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement; // Corrected
            const blockContent = getBlockContentElement(blockElement); // Corrected
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
            expect((content[0].properties as BaseStylesProp).styles.lowercase).toBe(true); // Corrected to toBe(true)
            // Neighbors
            const calloutEl = editorElement.querySelector('#callout') as HTMLElement;
            expect(calloutEl.previousElementSibling).toBeNull();
            expect(calloutEl.nextElementSibling).toBeNull();
        });

        it('should apply subscript to entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Callout child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement; // Corrected
            const blockContent = getBlockContentElement(blockElement); // Corrected
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, (blockContent.textContent as string).length);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Assert DOM
            const subElement = blockContent.querySelector('sub');
            expect(subElement).toBeDefined();
            expect(subElement.textContent).toBe('Callout child Paragraph');
            expect(blockContent.textContent).toBe('Callout child Paragraph');

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.subscript).toBe(true); // Corrected to toBe(true)
        });

        it('should apply all formatting styles to entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Callout child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);

            // Apply all commands sequentially. Your editor might handle combinations differently.
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

            const spanWithColorAndBgColor = blockContent.querySelectorAll('span[style*="color"]');
            expect(spanWithColorAndBgColor.length).toBe(2);

            const spanWithCustomStyle = blockContent.querySelector('span[style*="font-family"]');
            expect(spanWithCustomStyle).toBeDefined();

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            const styles = (content[0].properties as BaseStylesProp).styles
            expect(styles.bold).toBe(true);
            expect(styles.italic).toBe(true);
            expect(styles.underline).toBe(true);
            expect(styles.strikethrough).toBe(true);
            expect(styles.lowercase).toBe(true);
            expect(styles.superscript).toBe(true);
            expect(styles.color).toBe('#FF0000');
            expect(styles.backgroundColor).toBe('#FFFF00');
            // Neighbors
            const calloutEl = editorElement.querySelector('#callout') as HTMLElement;
            expect(calloutEl.previousElementSibling).toBeNull();
            expect(calloutEl.nextElementSibling).toBeNull();

        });

        it('should apply all formatting styles to a single word', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Callout child Paragraph' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 8, 13); // Select "child"

            // Apply all commands sequentially to the selection
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#0000FF' }); // Example: blue color
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#00FF00' }); // Example: green background

            // Assert DOM (complex due to nesting)
            expect(blockContent.textContent).toBe('Callout child Paragraph');
            const formattedWordContainer: HTMLElement = (blockContent.querySelector('span[style*="font-family"]') ||
                blockContent.querySelector('span[style*="background-color"]') ||
                blockContent.querySelector('span[style*="color"]') ||
                blockContent.querySelector('sup') ||
                blockContent.querySelector('sub') ||
                blockContent.querySelector('s') ||
                blockContent.querySelector('u') ||
                blockContent.querySelector('em') ||
                blockContent.querySelector('strong') as HTMLElement);

            expect(formattedWordContainer).toBeDefined();
            // Assuming the innermost element still presents the text content of the word
            expect(formattedWordContainer.textContent.toLowerCase()).toBe('child');

            // Assert for presence of all expected tags/styles within the formatted segment
            expect(formattedWordContainer.querySelector('strong') || formattedWordContainer.tagName === 'STRONG').toBeDefined();
            expect(formattedWordContainer.querySelector('em') || formattedWordContainer.tagName === 'EM').toBeDefined();
            expect(formattedWordContainer.querySelector('u') || formattedWordContainer.tagName === 'U').toBeDefined();
            expect(formattedWordContainer.querySelector('s') || formattedWordContainer.querySelector('del') || formattedWordContainer.tagName === 'S' || formattedWordContainer.tagName === 'DEL').toBeDefined();
            expect(formattedWordContainer.querySelector('sup') || formattedWordContainer.tagName === 'SUP').toBeDefined();

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(3);
            expect(content[0].content).toBe('Callout ');
            expect(content[1].content).toBe('child');
            expect(content[2].content).toBe(' Paragraph');
            const styles = (content[1].properties as BaseStylesProp).styles
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
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to "Brown Fox" (indices 10 to 19)
            setSelectionRange(blockContent.firstChild as Node, 10, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Step 2: Select "Fox Jumps" (overlapping "Brown Fox" and "Jumps", indices 16 to 25)
            setRange(blockContent.childNodes[1].firstChild, blockContent.childNodes[2].firstChild, 6, 6);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            const strongElements = blockContent.querySelectorAll('strong');
            expect(strongElements.length).toBeGreaterThan(0); // At least one bold segment

            const emElements = blockContent.querySelectorAll('em');
            expect(emElements.length).toBeGreaterThan(0); // At least one italic segment

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;

            const formattedContent = content.filter(item => item.properties && (item.properties as BaseStylesProp).styles);

            const foxSegment = formattedContent.find(item => item.content && item.content.includes('Fox'));
            if (foxSegment) {
                expect(((foxSegment.properties as BaseStylesProp).styles).bold).toBe(true);
                expect(((foxSegment.properties as BaseStylesProp).styles).italic).toBe(true);
            } else {
                fail('Fox segment not found or not formatted as expected in model.');
            }

            // Example assertion for italic only: "Jumps"
            const jumpsSegment = formattedContent.find(item => item.content && item.content.includes('Jumps'));
            if (jumpsSegment) {
                expect(((jumpsSegment.properties as BaseStylesProp).styles).italic).toBe(true);
                expect(((jumpsSegment.properties as BaseStylesProp).styles).bold).toBeUndefined(); // Should not be bold
            } else {
                fail('Jumps segment not found or not formatted as expected in model.');
            }

        });

        it('should re-apply bold to an overlapping selection over bold and non-formatted text, toggling bold where it exists', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to "Brown Fox" (indices 10 to 19)
            setSelectionRange(blockContent.firstChild as Node, 10, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });


            // Step 2: Select "Fox Jumps" (overlapping "Brown Fox" and "Jumps", indices 16 to 25)
            setRange(blockContent.childNodes[1].firstChild, blockContent.childNodes[2].firstChild, 6, 6);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert DOM
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            const strongElements = blockContent.querySelectorAll('strong');
            expect(strongElements.length).toBeGreaterThan(0); // Should be "Fox Jumps" in <strong> tag

            // Assert Model
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;

            // "Brown" segment should now be unbolded
            const brownSegment = content.find(item => item.content && item.content === 'Brown');
            if (brownSegment) {
                expect(((brownSegment.properties as BaseStylesProp).styles).bold).toBeUndefined();
            }

            // "Fox" and "Jumps" should be bold
            const foxJumpsSegment = content.find(item => item.content && (item.content.indexOf('Fox Jumps') != -1));
            if (foxJumpsSegment) {
                expect(((foxJumpsSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            } else {
                const foxSegment = content.find(item => item.content && item.content.includes('Fox'));
                expect(((foxSegment.properties as BaseStylesProp).styles).bold).toBe(true);
                const jumpsSegment = content.find(item => item.content && item.content.includes('Jumps'));
                expect(((jumpsSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            }


        });

        it('should remove bold formatting from entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Step 2: Remove bold from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' }); // Execute again to callout off

            // Assert DOM: Strong tag should no longer exist
            expect(blockContent.querySelector('strong')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: Bold style should be undefined/false
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();

        });

        it('should remove all formatting styles from entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply all styles
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Step 2: Remove all styles (by re-executing each command)
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '' });

            // Assert DOM: No formatting tags or inline styles should remain
            expect(blockContent.querySelector('strong')).toBeNull();
            expect(blockContent.querySelector('em')).toBeNull();
            expect(blockContent.querySelector('u')).toBeNull();
            expect(blockContent.querySelector('s')).toBeNull();
            expect(blockContent.querySelector('del')).toBeNull();
            expect(blockContent.querySelector('sup')).toBeNull();
            expect(blockContent.querySelector('sub')).toBeNull();
            expect(blockContent.querySelector('span[style*="color"]')).toBeNull();
            expect(blockContent.querySelector('span[style*="background-color"]')).toBeNull();
            expect(blockContent.querySelector('span[style*="font-family"]')).toBeNull();

            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog'); // Original casing

            // Assert Model: All styles should be undefined
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect(Object.keys((content[0].properties as BaseStylesProp).styles).length).toBe(0);

        });

        it('should apply italic to a word after entire paragraph is bolded, creating mixed styles', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Step 2: Apply italic to "Brown" (indices 10 to 15)
            setSelectionRange(blockContent.firstChild.firstChild as Node, 10, 15); // Select "Brown"
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM: Expect <strong> and <em> tags to be present, with nesting
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            expect(blockContent.querySelector('strong')).toBeDefined(); // Entire text is bold (or mostly)
            const emElement = blockContent.querySelector('em'); // "Brown" should be italic
            expect(emElement).toBeDefined();
            expect(emElement.textContent).toBe('Brown');

            // Assert Model: Expect split segments with combined styles
            const blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            const content = blockModel.content;

            // Expect segment for 'Brown' to have both bold and italic
            const brownSegment = content.find(item => item.content === 'Brown');
            expect(brownSegment).toBeDefined();
            expect(((brownSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((brownSegment.properties as BaseStylesProp).styles).italic).toBe(true);

            // Expect other segments to have just bold
            const otherSegment = content.find(item => item.content.includes('Quick'));
            expect(otherSegment).toBeDefined();
            expect(((otherSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((otherSegment.properties as BaseStylesProp).styles).italic).toBeUndefined(); // Italic should not be present

        });

        it('should undo bold formatting applied to the entire child paragraph', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert that bold is applied
            let blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            expect((blockModel.content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(blockContent.querySelector('strong')).toBeDefined();

            // Step 2: Undo the bold operation
            triggerUndo(editorElement);

            // Assert DOM: Strong tag should no longer exist
            expect(blockContent.querySelector('strong')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: Bold style should be undefined/false
            blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            expect((blockModel.content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();

        });

        it('should redo removing bold formatting from a word, restoring bold', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to "Brown" (indices 10 to 15)
            setSelectionRange(blockContent.firstChild as Node, 10, 15);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Verify bold is applied
            let blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            let brownSegment = blockModel.content.find(item => item.content === 'Brown');
            expect(((brownSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(blockContent.querySelector('strong').textContent).toBe('Brown');

            triggerUndo(editorElement);
            triggerRedo(editorElement);

            // Assert DOM: Strong tag should exist again for "Brown"
            expect(blockContent.querySelector('strong')).toBeDefined();
            expect(blockContent.querySelector('strong').textContent).toBe('Brown');

            // Assert Model: Bold style should be back to true
            blockModel = (editor.blocks[0].properties as BaseChildrenProp).children[0] as BlockModel;
            brownSegment = blockModel.content.find(item => item.content === 'Brown');
            expect(((brownSegment.properties as BaseStylesProp).styles).bold).toBe(true);

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

        it('should insert label item properly in callout block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Hello $ world' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const blockElement = editor.element.querySelector('#callout-child') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 7);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="high"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    editor.blockManager.setFocusToBlock(blockElement);
                    setTimeout(() => {
                        const labelItem = editor.labelSettings.items.find((item) => item.id === 'high');
                        const children = (editor.blocks[0].properties as BaseChildrenProp).children[0];
                        expect(contentElement.childElementCount).toBe(3);
                        const firstChild = contentElement.childNodes[0];
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const lastChild = contentElement.childNodes[2];

                        expect(firstChild.textContent).toBe('Hello ');

                        expect(insertedNode.textContent).toBe('Priority: High');
                        expect(insertedNode.classList.contains('e-label-chip')).toBe(true);
                        expect(insertedNode.getAttribute('data-label-id')).toBe((children.content[1].properties as ILabelContentSettings).labelId);

                        expect(lastChild.textContent).toBe(' world');

                        expect(children.content[0].content).toBe('Hello ');
                        expect(children.content[1].content).toBe('Priority: High');
                        expect(children.content[1].contentType).toBe(ContentType.Label);
                        expect(children.content[2].content).toBe(' world');
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('should insert mention item properly in callout block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                users: [
                    { id: 'user1', user: 'User 1' },
                    { id: 'user2', user: 'User 2' }
                ],
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'callout-child',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Bolded @ text' }],
                        }]
                    }
                }]
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const blockElement = editor.element.querySelector('#callout-child') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 8);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    editor.blockManager.setFocusToBlock(blockElement);
                    setTimeout(() => {
                        const user = editor.users.find((user) => user.id === 'user1');
                        const children = (editor.blocks[0].properties as BaseChildrenProp).children[0];
                        expect(contentElement.childElementCount).toBe(3);
                        const firstChild = contentElement.childNodes[0];
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const lastChild = contentElement.childNodes[2];

                        expect(firstChild.textContent).toBe('Bolded ');
                        
                        expect(insertedNode.querySelector('.em-initial').textContent).toBe('U1');
                        expect(insertedNode.querySelector('.em-content').textContent).toBe('User 1');
                        expect(insertedNode.classList.contains('e-user-chip')).toBe(true);
                        expect(insertedNode.getAttribute('data-user-id')).toBe((children.content[1].properties as IMentionContentSettings).userId);

                        expect(lastChild.textContent).toBe(' text');

                        expect(children.content[0].content).toBe('Bolded ');
                        expect(children.content[1].content).toBe('User 1');
                        expect(children.content[1].contentType).toBe(ContentType.Mention);
                        expect(children.content[2].content).toBe(' text');
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('copy & paste whole block inside collapsible paragraph child block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [
                            {
                                id: 'callout-child1',
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'First paragraph' }],
                            },
                            {
                                id: 'callout-child2',
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'second paragraph' }],
                            }
                        ]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child1') as HTMLElement;
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

            setTimeout(() => {
                const children = (editor.blocks[0].properties as BaseChildrenProp).children;
                // Model
                expect(editor.blocks.length).toBe(1);
                expect(children.length).toBe(3);
                expect(children[1].content[0].content).toBe('First paragraph');
                // DOM
                const calloutEl = editorElement.querySelector('#callout') as HTMLElement;
                const childEls = calloutEl.querySelectorAll('.e-callout-content .e-block');
                expect(childEls.length).toBe(3);
                expect((blockElement.nextElementSibling as HTMLElement).id).toBe(children[1].id);
                done();
            }, 100);
        });

        it('cut & paste whole block inside collapsible heading child block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [{
                    id: 'callout',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [
                            {
                                id: 'callout-child1',
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'First paragraph' }],
                            },
                            {
                                id: 'callout-child2',
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'second paragraph' }],
                            }
                        ]
                    }
                }]
            });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#callout-child1') as HTMLElement;
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

            setTimeout(() => {
                expect(editorElement.querySelector('#callout-child1')).toBeNull();
                expect((editor.blocks[0].properties as BaseChildrenProp).children.length).toBe(1);
                const blockElement2 = editorElement.querySelector('#callout-child2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement2);
                setCursorPosition(getBlockContentElement(blockElement2), 0);
                editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
                const children = (editor.blocks[0].properties as BaseChildrenProp).children;
                // Model
                expect(children.length).toBe(2);
                expect(children[1].content[0].content).toBe('First paragraph');
                // DOM
                const calloutEl = editorElement.querySelector('#callout') as HTMLElement;
                const childEls = calloutEl.querySelectorAll('.e-callout-content .e-block');
                expect(childEls.length).toBe(2);
                expect((blockElement2.nextElementSibling as HTMLElement).id).toBe(children[1].id);
                done();
            });
        });

        /* 981140 */
        // it('copy & paste partial content inside collapsible heading 2 child blocks', (done) => {
        //     editorElement = createElement('div', { id: 'editor' });
        //     document.body.appendChild(editorElement);
        //     editor = createEditor({
        //         blocks: [{
        //             id: 'callout',
        //             blockType: BlockType.Callout,
        //             properties: {
        //                 children: [
        //                     {
        //                         id: 'block1',
        //                         blockType: BlockType.Paragraph,
        //                         content: [
        //                             { id: 'bold', contentType: ContentType.Text, content: 'Boldedtext', properties: { styles: { bold: true } } },
        //                             { id: 'italic', contentType: ContentType.Text, content: 'Italictext', properties: { styles: { italic: true } } },
        //                             { id: 'underline', contentType: ContentType.Text, content: 'Underlinedtext', properties: { styles: { underline: true } } }
        //                         ]
        //                     },
        //                     {
        //                         id: 'block2',
        //                         blockType: BlockType.Paragraph,
        //                         content: [
        //                             { id: 'test', contentType: ContentType.Text, content: 'TestContent', properties: { styles: { bold: true } } }
        //                         ]
        //                     }
        //                 ]
        //             }
        //         }]
        //     });
        //     editor.appendTo('#editor');
        //     editor.blockManager.setFocusToBlock(editorElement.querySelector('#block1'));
        //     //create range
        //     var range = document.createRange();
        //     var startNode = editorElement.querySelector('#italic').firstChild;
        //     var endNode = editorElement.querySelector('#underline').firstChild;
        //     range.setStart(startNode, 0);
        //     range.setEnd(endNode, 6);
        //     var selection = document.getSelection();
        //     selection.removeAllRanges();
        //     selection.addRange(range);
        //     const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

        //     const mockClipboard: any = {
        //         setData: jasmine.createSpy(),
        //         getData: (format: string) => {
        //             if (format === 'text/blockeditor') {
        //                 return copiedData;
        //             }
        //             return '';
        //         }
        //     };

        //     editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

        //     const blockElement = editorElement.querySelector('#block2') as HTMLElement;
        //     const contentElement = getBlockContentElement(blockElement);
        //     editor.blockManager.setFocusToBlock(blockElement);
        //     setCursorPosition(contentElement, 4);
        //     let children = (editor.blocks[0].properties as BaseChildrenProp).children;
        //     const initialLength = children[1].content.length;

        //     editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

        //     setTimeout(() => {
        //         children = (editor.blocks[0].properties as BaseChildrenProp).children;
        //         expect(children[1].content.length).toBe(initialLength + 3);
        //         expect(children[1].content[0].content).toBe('Test');
        //         expect(children[1].content[1].content).toBe('Italictext');
        //         expect((children[1].content[1].properties as BaseStylesProp).styles.italic).toBe(true);
        //         expect(children[1].content[2].content).toBe('Underl');
        //         expect((children[1].content[2].properties as BaseStylesProp).styles.underline).toBe(true);
        //         expect(children[1].content[3].content).toBe('Content');
        //         expect(contentElement.childNodes.length).toBe(4);
        //         expect(contentElement.childNodes[1].textContent).toBe('Italictext');
        //         expect((contentElement.childNodes[1] as HTMLElement).tagName).toBe('EM');
        //         expect((contentElement.childNodes[2] as HTMLElement).textContent).toBe('Underl');
        //         expect((contentElement.childNodes[2] as HTMLElement).tagName).toBe('U');
        //         done();
        //     }, 100);
        // });
    });
});
