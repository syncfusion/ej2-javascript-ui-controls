import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseStylesProp, BlockModel, IHeadingBlockSettings } from '../../src/models/index';
import { setCursorPosition, setSelectionRange, getBlockContentElement, getSelectedRange, getDeepestTextNode, decoupleReference, sanitizeBlock, sanitizeContents } from '../../src/common/utils/index';
import { createEditor } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { BlockType, ContentType } from '../../src/models/enums';
import { measurePerformanceSync } from '../common/common.spec';
import { allTypesOfBlock } from '../common/data.spec';

function createMixedBlocks(count: number): BlockModel[] {
    const blocks: BlockModel[] = [];
    const blockTypes = [
        BlockType.Paragraph,
        BlockType.Heading,
        BlockType.BulletList,
        BlockType.NumberedList,
        BlockType.Code,
        BlockType.Quote,
        BlockType.Callout,
        BlockType.CollapsibleParagraph
    ];
    const baseContent = 'This is some sample text for a block item.';
    const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    for (let i = 0; i < count; i++) {
        const typeIndex = i % blockTypes.length;
        const blockType = blockTypes[typeIndex];
        const blockId = `mixed-block-${i}`;
        const contentId = `mixed-content-${i}`;

        let contentText = `${baseContent} Block ${i}. ${loremIpsum.substring(0, 50 + (i % 100))}`; // Vary content length

        switch (blockType) {
            case BlockType.Paragraph:
                blocks.push({
                    id: blockId,
                    blockType: BlockType.Paragraph,
                    content: [{ id: contentId, contentType: ContentType.Text, content: contentText }]
                });
                break;
            case BlockType.Heading:
                blocks.push({
                    id: blockId,
                    blockType: BlockType.Heading,
                    properties: { level: (i % 3) + 1 }, // H1, H2, H3
                    content: [{ id: contentId, contentType: ContentType.Text, content: `Heading ${i}: ${contentText.substring(0, 30)}` }]
                });
                break;
            case BlockType.BulletList:
            case BlockType.NumberedList:
                blocks.push({
                    id: blockId,
                    blockType: blockType,
                    content: [{ id: contentId, contentType: ContentType.Text, content: `${contentText.substring(0, 50)}` }]
                });
                break;
            case BlockType.Code:
                blocks.push({
                    id: blockId,
                    blockType: BlockType.Code,
                    properties: { language: (i % 2 === 0 ? 'javascript' : 'typescript') },
                    content: [{ id: contentId, contentType: ContentType.Text, content: `const x = ${i};\nconsole.log(x); // Code block ${i}` }]
                });
                break;
            case BlockType.Quote:
                blocks.push({
                    id: blockId,
                    blockType: BlockType.Quote,
                    content: [{ id: contentId, contentType: ContentType.Text, content: `Quote ${i}: "${contentText.substring(0, 80)}"` }]
                });
                break;
            case BlockType.Callout:
                blocks.push({
                    id: blockId,
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: `callout-child-${i}-1`,
                            blockType: BlockType.Paragraph,
                            content: [{ id: `callout-child-content-${i}-1` , contentType: ContentType.Text, content: `Callout child ${i}-1. ${contentText.substring(0, 30)}` }]
                        }, {
                            id: `callout-child-${i}-2`,
                            blockType: BlockType.Paragraph,
                            content: [{ id: `callout-child-content-${i}-2` , contentType: ContentType.Text, content: `Callout child ${i}-2. ${contentText.substring(0, 30)}` }]
                        }]
                    }
                });
                break;
            case BlockType.CollapsibleParagraph:
                blocks.push({
                    id: blockId,
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ id: contentId, contentType: ContentType.Text, content: `Collapsible Title ${i}: ${contentText.substring(0, 40)}` }],
                    properties: {
                        isExpanded: (i % 2 === 0), // Mix of expanded and collapsed
                        children: [{
                            id: `collapsible-child-${i}-1`,
                            blockType: BlockType.Paragraph,
                            content: [{ id: `collapsible-child-content-${i}-1` , contentType: ContentType.Text, content: `Collapsible child ${i}-1. ${contentText.substring(0, 30)}` }]
                        }]
                    }
                });
                break;
            default:
                // Fallback to Paragraph for any unhandled types
                blocks.push({
                    id: blockId,
                    blockType: BlockType.Paragraph,
                    content: [{ id: contentId, contentType: ContentType.Text, content: `${contentText} (default) ${i}.` }]
                });
                break;
        }
    }
    return blocks;
}

describe('Block Editor', () => {
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

    function triggerUndo(editorElement: HTMLElement) {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }
    function triggerRedo(editorElement: HTMLElement) {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    describe('Default testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = new BlockEditor();
            editor.appendTo('#editor');
        });

        beforeEach((done: DoneFn) => done());

        afterAll(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('default values of all properties', () => {
            expect(editor.height).toBe('auto');
            expect(editor.width).toBe('100%');
            expect(editor.undoRedoStack).toBe(30);

            expect(editor.enableDragAndDrop).toBe(true);
            expect(editor.enableHtmlSanitizer).toBe(true);
            expect(editor.enableHtmlEncode).toBe(false);
            expect(editor.readOnly).toBe(false);

            expect(editor.commandMenuSettings.commands.length).toBeGreaterThan(0);
            expect(editor.inlineToolbarSettings.items.length).toBeGreaterThan(0);
            expect(editor.blockActionMenuSettings.items.length).toBeGreaterThan(0);
            expect(editor.contextMenuSettings.items.length).toBeGreaterThan(0);

            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.element.id).toBeDefined();
        });
        it('Setting width and height as null', () => {
            editor.width = null;
            editor.height = null;
            editor.dataBind();
            expect(editorElement.style.height).toBe('auto');
            expect(editorElement.style.width).toBe('100%');
        });
        it('getPersistData checking', () => {
            expect(((<any>editorElement).ej2_instances[0] as any).getPersistData()).toContain('blocks');
        });

        it('getDirective  checking', () => {
            expect(((<any>editorElement).ej2_instances[0] as any).getDirective()).toEqual('EJS-BLOCKEDITOR');
        });

        it('preRender checking', () => {
            editorElement.id = '';
            expect(((<any>editorElement).ej2_instances[0] as any).preRender()).not.toEqual('');
        });

        it('should change the direction of editor when enableRtl is changed', () => {
            expect(editor.element.classList.contains('e-rtl')).toBe(false);
            editor.enableRtl = true;
            editor.dataBind();
            expect(editor.element.classList.contains('e-rtl')).toBe(true);
        });

        it('should render a default block if no blocks are provided', () => {
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            const blockElement = editorElement.querySelector('.e-block');
            expect(blockElement).not.toBeNull();
            const contentElement = blockElement.querySelector('p');
            expect(contentElement).not.toBeNull();
        });
    });

    describe('Always on Placeholders testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bulletlist', blockType: BlockType.BulletList },
                { id: 'numberedlist', blockType: BlockType.NumberedList },
                { id: 'checklist', blockType: BlockType.Checklist },
                { id: 'quote', blockType: BlockType.Quote },
                { id: 'callout', blockType: BlockType.Callout },
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

        it('should always display placeholders for specific blocks', () => {
            const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            domBlocks.forEach(block => {
                const content = getBlockContentElement(block);
                expect(content.getAttribute('placeholder') !== '').toBe(true);
            });
        });

        it('should not remove placeholders when focus is changed', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#bulletlist') as HTMLElement;
                const content = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(content, 0);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);
                    expect(content.getAttribute('placeholder') !== '').toBe(true);

                    // Different block
                    const blockElement2 = editorElement.querySelector('#numberedlist') as HTMLElement;
                    const content2 = getBlockContentElement(blockElement2);
                    editor.blockManager.setFocusToBlock(blockElement2);
                    setCursorPosition(content2, 0);
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    editorElement.dispatchEvent(mouseUpEvent);
                    setTimeout(() => {
                        expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement2);
                        expect(content.getAttribute('placeholder') !== '').toBe(true);
                        expect(content2.getAttribute('placeholder') !== '').toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
    });

    describe('Testing block splitting and deleting', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }] }
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

        it('should create new block on enter', () => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, blockElement.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Hello world');
            expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
            expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello world');
            expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('');
        });

        it('should delete block on backspace', () => {
            const blockElement = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello world');
            expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
            expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello world');
        });

        it('should split blocks when pressed enter at middle of text', () => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 6);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Hello ');
            expect(editor.blocks[1].content[0].content).toBe('world');
            expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
            expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello ');
            expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('world');
        });

        it('should merge blocks when pressed backspace at start of text', () => {
            const blockElement = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello world');
            expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
            expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello world');
        });

        it('should merge blocks when pressed delete at end of text', () => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 6);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, blockElement.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello world');
            expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
            expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello world');
        });

        it('splitting blocks(Enter) with formatting applied', () => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply bold formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 6, blockElement.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('span').textContent).toBe('Hello ');
            expect(contentElement.querySelector('strong').textContent).toBe('world');
            expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);

            //Split block at middle of text and check formatting applied correctly
            setCursorPosition(contentElement, 6);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Hello ');
            expect(editor.blocks[1].content[0].content).toBe('world');
            expect((editor.blocks[1].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
            expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello ');
            expect(editorElement.querySelectorAll('.e-block')[1].getElementsByTagName('strong')[0].textContent).toBe('world');
        });

        it('merging blocks(Backspace) with formatting applied', () => {
            const blockElement = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello ');
            expect(editor.blocks[0].content[1].content).toBe('world');
            expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);
            const contentElement2 = getBlockContentElement(editorElement.querySelector('.e-block'));
            expect(contentElement2.childElementCount).toBe(2);
            expect(contentElement2.querySelector('span').textContent).toBe('Hello ');
            expect(contentElement2.querySelector('strong').textContent).toBe('world');
        });
    });

    describe('Testing deletion of blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

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
                    id: 'heading', blockType: BlockType.Heading, properties: { level: 3 },  content: [
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

        it('Entire editor deletion using backspace', () => {
            editor.blockManager.setFocusToBlock(editorElement.querySelector('#paragraph'));
            editor.selectAllBlocks();
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.element.querySelectorAll('.e-block')[0].id).toBe(editor.blocks[0].id);
        });

        it('Partial deletion using backspace', () => {
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
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Paragraph');
            expect(editor.blocks[0].content[1].content).toBe('content');
            expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.strikethrough).toBe(true);

            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');
        });

        it('Partial deletion using delete', () => {
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

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', code: 'Delete', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Paragraph');
            expect(editor.blocks[0].content[1].content).toBe('content');
            expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.strikethrough).toBe(true);

            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(getBlockContentElement(startBlockElement).childElementCount).toBe(2);
            expect(getBlockContentElement(startBlockElement).children[0].textContent).toBe('Paragraph');
            expect(getBlockContentElement(startBlockElement).children[1].textContent).toBe('content');
        });
    });

    describe('Testing the sanitizer, decode, encode and readonly testing', () => {
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
            document.body.removeChild(editorElement);
        });

        it('checking the Sanitizer and dynamic HTML encode and decode', () => {
            const blocks: BlockModel[] = [
                {
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: '<p>Hello<script></script> world</p>' }]
                }
            ];
            editor = new BlockEditor({
                blocks: blocks,
                enableHtmlSanitizer: false
            });
            editor.appendTo('#editor');
            expect(editorElement.querySelector('.e-block').textContent).toBe('<p>Hello<script></script> world</p>');
            editor.enableHtmlSanitizer = true;
            editor.dataBind();
            expect(editor.blocks[0].content[0].content).toBe("<p>Hello world</p>");
            expect(editorElement.querySelector('.e-block').textContent).toBe("<p>Hello world</p>");
            editor.enableHtmlEncode = true;
            editor.dataBind();
            expect(editor.blocks[0].content[0].content).toBe("&lt;p&gt;Hello world&lt;/p&gt;");
            expect(editorElement.querySelector('.e-block').textContent).toBe('&lt;p&gt;Hello world&lt;/p&gt;');
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.element.id).toBeDefined();
        });
        it('should not sanitize when enableHTMLSanitizer is false', () => {
            const blocks: BlockModel[] = [
                {
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: '<p>Hello<script></script> world</p>' }]
                }
            ];
            editor = new BlockEditor({
                blocks: blocks,
                enableHtmlSanitizer: false
            });
            editor.appendTo('#editor');
            expect(editor.blocks[0].content[0].content).toBe('<p>Hello<script></script> world</p>');
            expect(editorElement.querySelector('.e-block').textContent).toBe('<p>Hello<script></script> world</p>');
        });

        it('non editable elements should maintain its state while toggling readonly mode', () => {
            editor = new BlockEditor({
                blocks: allTypesOfBlock,
            });
            editor.appendTo('#editor');
            const nonEditableClasses = [
                'e-callout-icon', 'e-toggle-icon', 'e-image-container',
                'e-checkmark-container', 'e-divider-block', 'e-code-block-toolbar',
                'e-code-block-copy-button', 'e-mention-chip'
            ];

            editor.readOnly = true;
            editor.dataBind();
            nonEditableClasses.forEach((className) => {
                const element = editorElement.querySelector(`.${className}`) as HTMLElement;
                expect(element.getAttribute('contenteditable')).toBe('false');
            });

            editor.readOnly = false;
            editor.dataBind();

            nonEditableClasses.forEach((className) => {
                const element = editorElement.querySelector(`.${className}`) as HTMLElement;
                expect(element.getAttribute('contenteditable')).toBe('false');
            });
        });
    });

    describe('Testing on property change', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Block 1' }],
                    cssClass: 'e-initial'
                },
                {
                    id: 'block2',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Block 2' }]
                },
                {
                    id: 'block3',
                    blockType: BlockType.Checklist,
                    content: [{ contentType: ContentType.Text, content: 'Todo' }]
                },
                {
                    id: 'block4',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ id: 'toggle-content-1', contentType: ContentType.Text, content: 'Click here to expand' }],
                    properties: {
                        children: [
                            {
                                id: 'toggleChild',
                                blockType: BlockType.Checklist,
                                content: [{ contentType: ContentType.Text, content: 'Todo' }]
                            }
                        ]
                    }
                }
            ];
            editor = new BlockEditor({
                blocks: blocks,
                cssClass: 'e-custom-editor',
                enableHtmlSanitizer: true
            });
            editor.appendTo('#editor');
        });

        beforeEach((done: DoneFn) => done());

        afterAll(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('checking root level props dynamic update', () => {
            editor.width = '300px';
            editor.height = '500px';
            editor.cssClass = 'e-test';
            
            editor.readOnly = false;
            editor.dataBind();
            expect(editor.width).toBe('300px');
            expect(editor.height).toBe('500px');
            expect(editor.cssClass).toBe('e-test');
            
            expect(editor.readOnly).toBe(false);
            expect(editorElement.style.width).toBe('300px');
            expect(editorElement.style.height).toBe('500px');
            expect(editorElement.classList.contains('e-test')).toBe(true);
            expect(editorElement.classList.contains('e-readonly')).toBe(false);

            editor.width = '200px';
            editor.height = '700px';
            editor.cssClass = 'e-modified';
            
            editor.readOnly = true;
            editor.dataBind();
            expect(editor.width).toBe('200px');
            expect(editor.height).toBe('700px');
            expect(editor.cssClass).toBe('e-modified');
            expect(editor.readOnly).toBe(true);
            expect(editorElement.style.width).toBe('200px');
            expect(editorElement.style.height).toBe('700px');
            expect(editorElement.classList.contains('e-modified')).toBe(true);
            expect(editorElement.classList.contains('e-readonly')).toBe(true);
        });

        it('Dynamic change for key config', function (done) {
            editor.keyConfig = {
                'bold': 'alt+b'
            }
            editor.dataBind();
            let blockElement: HTMLElement = editorElement.querySelector('#block1');
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection(blockElement.querySelector('.e-block-content').id, 0, 4);
            const keyDownEve = new KeyboardEvent('keydown', {
                key: 'b',
                code: 'Keyb',
                bubbles: true,
                cancelable: true,
                altKey: true,
            });
            editorElement.dispatchEvent(keyDownEve);
            setTimeout(function () {
                expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);
                expect(editor.blocks[0].content[0].content).toBe('Bloc');
                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                expect(editor.blocks[0].content[1].content).toBe('k 1');
                done();
            }, 100);
        });

        it('should return when prev prop is undefined', function (done) {
            expect((editor.onPropertyChanged as any)('newProp', undefined)).toBeUndefined();
            done();
        });
    });

    describe('Testing editor actions, ', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content-1', contentType: ContentType.Text, content: 'Hello world 1' }]
                },
                {
                    id: 'paragraph-2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content-2', contentType: ContentType.Text, content: 'Hello world 2' }]
                },
            ];
            editor = new BlockEditor({
                blocks: blocks
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });
        it('should update currentFocusedBlock on mouseup', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);

                    // Different block
                    const blockElement2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                    editor.blockManager.setFocusToBlock(blockElement2);
                    setCursorPosition(getBlockContentElement(blockElement2), 0);
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    editorElement.dispatchEvent(mouseUpEvent);
                    setTimeout(() => {
                        expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement2);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should handle line breaks on shift+enter', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 6);
                const shiftEnterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(shiftEnterEvent);
                setTimeout(() => {
                    expect(editor.blocks[0].content[0].content).toBe('Hello \nworld 1');
                    done();
                }, 200);
            }, 200);
        });

        it('should set cursor in empty block on mousedown', (done) => {
            setTimeout(() => {
                editor.blockManager.editorMethods.addBlock({ id: 'empty-paragraph', blockType: BlockType.Paragraph, content: [] },
                    null, false, true
                );
                const blockElement = editorElement.querySelector('#empty-paragraph') as HTMLElement;
                blockElement.dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true
                }));
                setTimeout(() => {
                    const range = getSelectedRange();
                    expect(blockElement.contains(range.startContainer)).toBe(true);
                    expect(range.startOffset).toBe(0);
                    done();
                }, 100);
            }, 200);
        });

        it('should not hide popup on scroll', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Ensure block action popup
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);

            // Trigger scroll
            setTimeout(() => {
                editorElement.dispatchEvent(new Event('scroll'));
                expect(document.querySelector('.e-blockeditor-blockaction-popup').classList.contains('e-popup-open')).toBe(true);
                done();
            }, 200);
        });

        it('should navigate bw blocks on arrow keys', (done) => {
            const blockElement1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block1Content = getBlockContentElement(blockElement1) as HTMLElement;
            const blockElement2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const block2Content = getBlockContentElement(blockElement2) as HTMLElement;

            // Cursor at end of block 1 and press right arrow
            editor.blockManager.setFocusToBlock(blockElement1);
            setCursorPosition(block1Content, block1Content.textContent.length);
            const rightArrowEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                bubbles: true,
                cancelable: true
            });
            editorElement.dispatchEvent(rightArrowEvent);
            expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement2);

            // Cursor at start of block 2 and press left arrow
            editor.blockManager.setFocusToBlock(blockElement2);
            setCursorPosition(block2Content, 0);
            const leftArrowEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                bubbles: true,
                cancelable: true
            });
            editorElement.dispatchEvent(leftArrowEvent);
            expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement1);
            done();
        });

        it('should display inline toolbar on text selection', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                editor.setSelection('paragraph-content-1', 0, 4);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);
                    expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });

        it('should display inline toolbar on keyboard selection', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                editor.setSelection('paragraph-content-1', 0, 4);
                const keyDownEve = new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true,
                    cancelable: true,
                    ctrlKey: true,
                    shiftKey: true
                });
                editorElement.dispatchEvent(keyDownEve);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);
                    expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });

        it('should display slash menu on AddIcon click', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);

            const addIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-add-icon') as HTMLElement;
            expect(addIcon).not.toBeNull();
            addIcon.click();
            setTimeout(() => {
                expect(editorElement.querySelector('#' + editor.blockManager.currentHoveredBlock.id)).toBe(blockElement);
                expect(document.querySelector('.e-blockeditor-command-menu').classList.contains('e-popup-open')).toBe(true);
                editor.slashCommandModule.hidePopup();
                done();
            }, 100);
        });

        it('should handle entire selection and type any input', (done) => {
            setTimeout(() => {
                editor.selectAllBlocks();
                editor.blockManager.isEntireEditorSelected = true;
                (editor.eventManager as any).handleEditorInputActions(new Event('input'));
                // Only one block should remain after input event
                setTimeout(() => {
                    expect(editor.blocks.length).toBe(1);
                    expect(editor.blocks[0].content[0].content).toBe('Hello world 1');
                    done();
                }, 200);
            }, 200);
        });
    });

    describe('Model updates - updateContentOnUserTyping', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content-1', contentType: ContentType.Text, content: 'Hello world 1' }]
                },
                {
                    id: 'paragraph-2',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph-content-2', contentType: ContentType.Text, content: 'Hello world 2' },
                        { id: 'progress-label', contentType: ContentType.Label, properties: { labelId: 'progress' } }
                    ]
                },
            ];
            editor = new BlockEditor({
                blocks: blocks
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should do nothing if blockElement is null', () => {
            const initialBlock = editor.blockManager.getEditorBlocks()[0];

            editor.blockManager.stateManager.updateContentOnUserTyping(null);

            expect(editor.blockManager.getEditorBlocks()[0]).toBe(initialBlock);
            editor.destroy();
        });

        it('should do nothing if block model is not found', () => {
            const nonExistentBlockElement = createElement('div', { id: 'nonexistent' });
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const initialBlock = editor.blockManager.getEditorBlocks()[0];

            editor.blockManager.stateManager.updateContentOnUserTyping(nonExistentBlockElement);

            expect(editor.blockManager.getEditorBlocks()[0]).toBe(initialBlock);
        });

        it('should do nothing if contentElement is not found', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.remove();

            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
        });

        it('should handle empty content array when updating', () => {
            editor.blocks[0].content = [];
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const updatedBlock = editor.getBlock('paragraph-1');
            expect(updatedBlock.content.length).toBe(1);
            expect(updatedBlock.content[0].content).toBe('Hello world 1');
        });

        it('should handle special elements and create content spans', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);

            // Add a text node after the label chip
            const textNode = document.createTextNode(' text after label');
            contentElement.appendChild(textNode);
            setCursorPosition(contentElement, contentElement.textContent.length);

            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                const updatedBlock = editor.getBlock('paragraph-2');
                expect(updatedBlock.content.length).toBe(3);
                expect(updatedBlock.content[2].contentType).toBe(ContentType.Text);
                expect(updatedBlock.content[2].content).toBe(' text after label');

                // Check DOM was updated
                const contentNodes = Array.from(contentElement.childNodes);
                expect(contentNodes.length).toBe(3);
                expect(contentNodes[0].textContent).toBe('Hello world 2');
                expect((contentNodes[1] as HTMLElement).classList.contains('e-label-chip')).toBe(true);
                expect(contentNodes[2].textContent).toBe(' text after label');
                done();
            }, 10);
        });

        it('should handle element nodes and create content models', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);

            // Add a element node after the label chip
            const elem = document.createElement('span');
            elem.id = 'custom-element';
            elem.textContent = 'new element node';
            contentElement.appendChild(elem);
            setCursorPosition(contentElement, contentElement.textContent.length);

            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                const updatedBlock = editor.getBlock('paragraph-2');
                expect(updatedBlock.content.length).toBe(3);
                expect(updatedBlock.content[2].contentType).toBe(ContentType.Text);
                expect(updatedBlock.content[2].id).toBe('custom-element');
                expect(updatedBlock.content[2].content).toBe('new element node');
                done();
            }, 10);
        });

        it('should clean up stale content models properly', () => {
            const blockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const content = [
                { id: 'content1', contentType: ContentType.Text, content: 'Text content' },
                { id: 'content2', contentType: ContentType.Text, content: 'Bold content - about to stale', styles: { bold: true } },
                { id: 'content3', contentType: ContentType.Text, content: 'Another text content' }
            ];

            editor.addBlock({ id: 'newblock', content: content, blockType: BlockType.Paragraph }, 'paragraph-2');

            const newblockElement = editorElement.querySelector('#newblock') as HTMLElement;
            const contentElement = getBlockContentElement(newblockElement);

            // Select range partially from content1 to content3
            editor.blockManager.nodeSelection.createRangeWithOffsets(
                contentElement.childNodes[0].firstChild,
                contentElement.childNodes[2].firstChild,
                4, 13);
            const range = getSelectedRange();
            range.deleteContents();
            editor.blockManager.stateManager.updateContentOnUserTyping(newblockElement);

            expect(editor.blockManager.getEditorBlocks()[2].content.length).toBe(2);
            expect(editor.blockManager.getEditorBlocks()[2].content[0].id).toBe('content1');
            expect(editor.blockManager.getEditorBlocks()[2].content[0].content).toBe('Text');

            expect(editor.blockManager.getEditorBlocks()[2].content[1].id).toBe('content3');
            expect(editor.blockManager.getEditorBlocks()[2].content[1].content).toBe('content');
        });
    });

    describe('Basic Level 1 Combination:', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content-1', contentType: ContentType.Text, content: '' }]
                }
            ];
            editor = new BlockEditor({
                blocks: blocks
            });
            editor.appendTo('#editor');
        });

        afterAll(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should prevent editor focus on initial render', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                expect(editor.blockManager.currentFocusedBlock).toBeUndefined()
                expect(contentElement.getAttribute('placeholder')).toBe('');
                done();
            }, 300);
        });

        it('Type in some input in the block', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            contentElement.textContent = "This is a sample content";
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            expect(editor.blocks[0].content[0].content).toBe('This is a sample content');
        });

        it('Apply bold & italic to a content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(getDeepestTextNode(contentElement as HTMLElement), 0, 4);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);

            expect(contentElement.querySelector('strong')).not.toBeNull();
            expect(contentElement.querySelector('em')).not.toBeNull();
        });

        it('Apply underline & strikethrough to same content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(getDeepestTextNode(contentElement.firstChild as HTMLElement), 0, 4);

            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);

            expect(contentElement.querySelector('u')).not.toBeNull();
            expect(contentElement.querySelector('s')).not.toBeNull();
        });

        it('Apply uppercase & superscript to same content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(getDeepestTextNode(contentElement.firstChild as HTMLElement), 0, 4);

            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.uppercase).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.superscript).toBe(true);

            expect(contentElement.querySelector('sup')).not.toBeNull();
            expect(contentElement.querySelector("span[style='text-transform: uppercase;']")).not.toBeNull();
        });

        it('Apply lowercase & subscript to same content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(getDeepestTextNode(contentElement.firstChild as HTMLElement), 0, 4);

            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);

            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.uppercase).toBeUndefined();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.superscript).toBeUndefined();
            expect(contentElement.querySelector('sup')).toBeNull();
            expect(contentElement.querySelector("span[style='text-transform: uppercase;']")).toBeNull();

            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.subscript).toBe(true);
            expect(contentElement.querySelector('sub')).not.toBeNull();
            expect(contentElement.querySelector("span[style='text-transform: lowercase;']")).not.toBeNull();
        });

        it('Apply color & bgColor to same content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(getDeepestTextNode(contentElement.firstChild as HTMLElement), 0, 4);

            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#Ff0000' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#efff0aff' });

            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.subscript).toBe(true);

            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.color).toBe('#Ff0000');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.backgroundColor).toBe('#efff0aff');
            expect(contentElement.querySelector("span[style='color: rgb(255, 0, 0);']")).not.toBeNull();
            expect(contentElement.querySelector("span[style='background-color: rgb(239, 255, 10);']")).not.toBeNull();
        });

        it('Remove bold on same content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(getDeepestTextNode(contentElement.firstChild as HTMLElement), 0, 4);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            expect(contentElement.querySelector('strong')).toBeNull();

            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.subscript).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.color).toBe('#Ff0000');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.backgroundColor).toBe('#efff0aff');
        });

        it('Remove color & bgColor on same content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(getDeepestTextNode(contentElement.firstChild as HTMLElement), 0, 4);

            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '' });

            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.color).toBeUndefined();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.backgroundColor).toBeUndefined();
            expect(contentElement.querySelector("span[style='color: rgb(255, 0, 0);']")).toBeNull();
            expect(contentElement.querySelector("span[style='background-color: rgb(239, 255, 10);']")).toBeNull();

            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.subscript).toBe(true);
        });

        it('Apply bold on overlapping content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const range: Range = document.createRange();
            const selection: Selection | null = window.getSelection();
            range.setStart(getDeepestTextNode(contentElement.firstChild as HTMLElement), 2);
            range.setEnd(getDeepestTextNode(contentElement.lastChild as HTMLElement), 12);
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            expect(editor.blocks[0].content[0].content).toBe('Th');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            
            expect(editor.blocks[0].content[1].content).toBe('is');
            expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);

            expect(editor.blocks[0].content[2].content).toBe(' is a sample');
            expect((editor.blocks[0].content[2].properties as BaseStylesProp).styles.bold).toBe(true);

            expect(contentElement.querySelector(`#${editor.blocks[0].content[2].id}`).tagName).toBe('STRONG');
        });

        it('Remove bold on same overlapping content', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const lastBoldedId = editor.blocks[0].content[2].id;
            const lastBoldedEle = contentElement.querySelector(`#${lastBoldedId}`) as HTMLElement;
            const range: Range = document.createRange();
            const selection: Selection | null = window.getSelection();
            range.setStart(getDeepestTextNode(contentElement.firstChild as HTMLElement), 2);
            range.setEnd(getDeepestTextNode(lastBoldedEle), 12);
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            expect(editor.blocks[0].content[0].content).toBe('Th');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            
            expect(editor.blocks[0].content[1].content).toBe('is');
            expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBeUndefined();

            expect(editor.blocks[0].content[2].content).toBe(' is a sample');
            expect((editor.blocks[0].content[2].properties as BaseStylesProp).styles.bold).toBeUndefined();

            expect(contentElement.querySelector(`#${editor.blocks[0].content[2].id}`).tagName).toBe('SPAN');
        });

        it('Undo last few actions', () => {
            var blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            var contentElement = getBlockContentElement(blockElement);
            triggerUndo(editorElement);
            expect((editor.blocks[0].content[2].properties as BaseStylesProp).styles.bold).toBe(true);

            triggerUndo(editorElement);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.color).toBeUndefined();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.backgroundColor).toBeUndefined();

            triggerUndo(editorElement);
            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            expect(contentElement.querySelector('strong')).toBeNull();

            triggerUndo(editorElement);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.color).toBe('#Ff0000');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.backgroundColor).toBe('#efff0aff');
            expect(contentElement.querySelector("span[style='color: rgb(255, 0, 0);']")).not.toBeNull();
            expect(contentElement.querySelector("span[style='background-color: rgb(239, 255, 10);']")).not.toBeNull();

            triggerUndo(editorElement);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.subscript).toBe(true);
            expect(contentElement.querySelector('sub')).not.toBeNull();
            expect(contentElement.querySelector("span[style='text-transform: lowercase;']")).not.toBeNull();
        });
        it('Redo last few actions', () => {
            var blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            var contentElement = getBlockContentElement(blockElement);

            triggerRedo(editorElement);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.subscript).toBe(true);
            expect(contentElement.querySelector('sub')).not.toBeNull();
            expect(contentElement.querySelector("span[style='text-transform: lowercase;']")).not.toBeNull();

            triggerRedo(editorElement);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.backgroundColor).toBe('#efff0aff');
            expect(contentElement.querySelector("span[style='background-color: rgb(239, 255, 10);']")).not.toBeNull();

            triggerRedo(editorElement);
            expect(editor.blocks[0].content[0].content).toBe('This');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            expect(contentElement.querySelector('strong')).toBeNull();

            triggerRedo(editorElement);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.color).toBeUndefined();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.backgroundColor).toBeUndefined();

            triggerRedo(editorElement);
            expect((editor.blocks[0].content[2].properties as BaseStylesProp).styles.bold).toBeUndefined();
        });

        it('Transforming paragraph to bulletlist', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.firstChild.textContent = '/' + contentElement.firstChild.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const contentJsonBeforeTransform = sanitizeContents(editor.blocks[0].content);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click list li element inside the popup
            const liElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(liElement).not.toBeNull();
            liElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            expect(document.querySelector('.e-block').querySelector('ul').textContent).toBe('This is a sample content');
        });

        it('Transform bulletlist back to paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.firstChild.textContent = '/' + contentElement.firstChild.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const contentJsonBeforeTransform = sanitizeContents(editor.blocks[0].content);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click paragraph li element inside the popup
            const liElement = slashCommandElement.querySelector('li[data-value="Paragraph"]') as HTMLElement;
            expect(liElement).not.toBeNull();
            liElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(document.querySelector('.e-block').querySelector('p').textContent).toBe('This is a sample content');
        });

        it('Transform paragraph back to quote', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.firstChild.textContent = '/' + contentElement.firstChild.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const contentJsonBeforeTransform = sanitizeContents(editor.blocks[0].content);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click paragraph li element inside the popup
            const liElement = slashCommandElement.querySelector('li[data-value="Quote"]') as HTMLElement;
            expect(liElement).not.toBeNull();
            liElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
            expect(document.querySelector('.e-block').querySelector('blockquote').textContent).toBe('This is a sample content');
        });

        it('Transform quote to checklist', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.firstChild.textContent = '/' + contentElement.firstChild.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const contentJsonBeforeTransform = sanitizeContents(editor.blocks[0].content);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click paragraph li element inside the popup
            const liElement = slashCommandElement.querySelector('li[data-value="Checklist"]') as HTMLElement;
            expect(liElement).not.toBeNull();
            liElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            expect(document.querySelector('.e-block').querySelector('ul').textContent).toBe('This is a sample content');
        });

        it('Transform checklist to heading level 1', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.firstChild.textContent = '/' + contentElement.firstChild.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            const contentJsonBeforeTransform = sanitizeContents(editor.blocks[0].content);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click paragraph li element inside the popup
            const liElement = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
            expect(liElement).not.toBeNull();
            liElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
            expect((editor.blocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(document.querySelector('.e-block').querySelector('h1').textContent).toBe('This is a sample content');
        });

        it('Undo last few actions', () => {
            triggerUndo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            expect(document.querySelector('.e-block').querySelector('ul').textContent).toBe('This is a sample content');

            triggerUndo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
            expect(document.querySelector('.e-block').querySelector('blockquote').textContent).toBe('This is a sample content');

            triggerUndo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(document.querySelector('.e-block').querySelector('p').textContent).toBe('This is a sample content');

            triggerUndo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            expect(document.querySelector('.e-block').querySelector('ul').textContent).toBe('This is a sample content');
        });
        it('Redo last few actions', () => {
            triggerRedo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(document.querySelector('.e-block').querySelector('p').textContent).toBe('This is a sample content');

            triggerRedo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
            expect(document.querySelector('.e-block').querySelector('blockquote').textContent).toBe('This is a sample content');

            triggerRedo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            expect(document.querySelector('.e-block').querySelector('ul').textContent).toBe('This is a sample content');

            triggerRedo(editorElement);
            expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
            expect(document.querySelector('.e-block').querySelector('h1').textContent).toBe('This is a sample content');
        });
    });

    describe('Initial Rendering Performance', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        const NUM_RENDER_WHOLE_BLOCKS = 365;

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            if (editorElement && editorElement.parentNode) {
                remove(editorElement);
            }
        });

        it(`should DOM for 500 mixed blocks (including children) within acceptable time limits`, () => {
            const blocksToRender = createMixedBlocks(NUM_RENDER_WHOLE_BLOCKS);
            editorElement = createElement('div', { id: 'editor-mixed-render-perf-sync' });
            document.body.appendChild(editorElement);

            measurePerformanceSync(`Synchronous DOM build for 500 mixed blocks(child included)`, () => {

                editor = createEditor({ blocks: blocksToRender });
                editor.appendTo('#editor-mixed-render-perf-sync');

                expect(editor.blocks.length).toBe(NUM_RENDER_WHOLE_BLOCKS);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(500);
                expect(editorElement.querySelector('#mixed-block-0')).not.toBeNull();
                expect(editorElement.querySelector(`#mixed-block-${NUM_RENDER_WHOLE_BLOCKS - 1}`)).not.toBeNull();
            }, 3400);
        }, 500);
    });
});
