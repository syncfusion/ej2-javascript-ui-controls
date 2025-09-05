import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseStylesProp, BlockModel } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, setSelectionRange, getBlockContentElement, getSelectedRange } from '../../src/index';
import { createEditor } from '../common/util.spec';

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
            expect(editor.height).toBe('100%');
            expect(editor.width).toBe('100%');
            expect(editor.undoRedoStack).toBe(30);

            expect(editor.enableAutoHttps).toBe(true);
            expect(editor.enableDragAndDrop).toBe(true);
            expect(editor.enableHtmlSanitizer).toBe(true);
            expect(editor.enableHtmlEncode).toBe(false);
            expect(editor.readOnly).toBe(false);

            expect(editor.commandMenu.commands.length).toBeGreaterThan(0);
            expect(editor.inlineToolbar.items.length).toBeGreaterThan(0);
            expect(editor.blockActionsMenu.items.length).toBeGreaterThan(0);
            expect(editor.contextMenu.items.length).toBeGreaterThan(0);

            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
            expect(editor.element.id).toBeDefined();
        });
        it('Setting width and height as null', () => {
            editor.width = null;
            editor.height = null;
            editor.dataBind();
            expect(editorElement.style.height).toBe('100%');
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
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
            const blockElement = editorElement.querySelector('.e-block');
            expect(blockElement).not.toBeNull();
            const contentElement = blockElement.querySelector('p');
            expect(contentElement).not.toBeNull();
        });
    });

    describe('Testing block splitting and deleting', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph', type: BlockType.Paragraph, content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }] }
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
            editor.setFocusToBlock(blockElement);
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
            editor.setFocusToBlock(blockElement);
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
            editor.setFocusToBlock(blockElement);
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
            editor.setFocusToBlock(blockElement);
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
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 6);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editor.setFocusToBlock(blockElement);
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
            editor.formattingAction.execCommand({ command: 'bold' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('span').textContent).toBe('Hello ');
            expect(contentElement.querySelector('strong').textContent).toBe('world');
            expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.bold).toBe(true);

            //Split block at middle of text and check formatting applied correctly
            setCursorPosition(contentElement, 6);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Hello ');
            expect(editor.blocks[1].content[0].content).toBe('world');
            expect((editor.blocks[1].content[0].props as BaseStylesProp).styles.bold).toBe(true);
            expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
            expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Hello ');
            expect(editorElement.querySelectorAll('.e-block')[1].getElementsByTagName('strong')[0].textContent).toBe('world');
        });

        it('merging blocks(Backspace) with formatting applied', () => {
            const blockElement = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello ');
            expect(editor.blocks[0].content[1].content).toBe('world');
            expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.bold).toBe(true);
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
                    id: 'paragraph', type: BlockType.Paragraph, content: [
                        { id: 'p-content', type: ContentType.Text, content: 'Paragraph ' },
                        { id: 'bolded-content', type: ContentType.Text, content: 'content', props: { styles: { bold: true } } },
                    ]
                },
                {
                    id: 'heading', type: BlockType.Heading, props: { level: 3 },  content: [
                        { id: 'h-content', type: ContentType.Text, content: 'Heading ' },
                        { id: 'italic-content', type: ContentType.Text, content: 'content', props: { styles: { italic: true } } },
                    ]
                },
                {
                    id: 'bullet-list', type: BlockType.BulletList, content: [
                        { id: 'bullet-list-content', type: ContentType.Text, content: 'Bullet list ' },
                        { id: 'underline-content', type: ContentType.Text, content: 'content', props: { styles: { underline: true } } },
                    ]
                },
                {
                    id: 'quote', type: BlockType.Quote, content: [
                        { id: 'q-content', type: ContentType.Text, content: 'Quote ' },
                        { id: 'strike-content', type: ContentType.Text, content: 'content', props: { styles: { strikethrough: true } } },
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
            editor.setFocusToBlock(editorElement.querySelector('#paragraph'));
            editor.selectAllBlocks();
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(1);
            expect(editor.element.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
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

            editor.setFocusToBlock(startBlockElement);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', code: 'Delete', bubbles: true }));
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
        });
    });

    describe('Testing the sanitizer, decode and encode testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', type: ContentType.Text, content: '<p>Hello world</p>' }]
                }
            ];
            editor = new BlockEditor({
                blocks: blocks,
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

        it('checking the Sanitizer and dynamic HTML encode and decode', () => {
            editor.serializeValue(editor.blocks[0].content[0].content);
            expect(editor.blocks[0].content[0].content).toBe("<p>Hello world</p>");
            editor.enableHtmlEncode = true;
            editor.dataBind();
            const content: string = editor.serializeValue(editor.blocks[0].content[0].content);
            expect(content).toBe("&lt;p&gt;Hello world&lt;/p&gt;");
            expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
            expect(editor.element.id).toBeDefined();
        });
        it('should not sanitize when enableHTMLSanitizer is false', () => {
            editor.enableHtmlSanitizer = false;
            editor.dataBind();
            editor.serializeValue(editor.blocks[0].content[0].content);
            expect(editor.blocks[0].content[0].content).toBe("<p>Hello world</p>");
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
                    type: BlockType.Paragraph,
                    content: [{ type: ContentType.Text, content: 'Block 1' }],
                    cssClass: 'e-initial'
                },
                {
                    id: 'block2',
                    type: BlockType.Paragraph,
                    content: [{ type: ContentType.Text, content: 'Block 2' }]
                },
                {
                    id: 'block3',
                    type: BlockType.Checklist,
                    content: [{ type: ContentType.Text, content: 'Todo' }]
                },
                {
                    id: 'block4',
                    type: BlockType.CollapsibleParagraph,
                    content: [{ id: 'toggle-content-1', type: ContentType.Text, content: 'Click here to expand' }],
                    props: {
                        children: [
                            {
                                id: 'toggleChild',
                                type: BlockType.Checklist,
                                content: [{ type: ContentType.Text, content: 'Todo' }]
                            }
                        ]
                    }
                }
            ];
            editor = new BlockEditor({
                blocks: blocks,
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
            editor.enableAutoHttps = true;
            editor.readOnly = false;
            editor.dataBind();
            expect(editor.width).toBe('300px');
            expect(editor.height).toBe('500px');
            expect(editor.cssClass).toBe('e-test');
            expect(editor.enableAutoHttps).toBe(true);
            expect(editor.readOnly).toBe(false);
            editor.width = '200px';
            editor.dataBind();
            expect(editor.width).toBe('200px');
            editor.height = '700px';
            editor.dataBind();
            expect(editor.height).toBe('700px');
            editor.cssClass = 'e-modified';
            editor.dataBind();
            expect(editor.cssClass).toBe('e-modified');
            editor.enableAutoHttps = false;
            editor.dataBind();
            expect(editor.enableAutoHttps).toBe(false);
            editor.readOnly = true;
            editor.dataBind();
            expect(editor.readOnly).toBe(true);
        });

        it('Dynamic change for key config', function (done) {
            editor.keyConfig = {
                'bold': 'alt+b'
            }
            editor.dataBind();
            let blockElement: HTMLElement = editorElement.querySelector('#block1');
            editor.setFocusToBlock(blockElement);
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
                expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement);
                expect(editor.blocks[0].content[0].content).toBe('Bloc');
                expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
                expect(editor.blocks[0].content[1].content).toBe('k 1');
                done();
            }, 100);
        });

        it('checking block level props dynamic update', (done) => {
            const firstBlock = editorElement.querySelector('#block1') as HTMLElement;
            editor.setFocusToBlock(firstBlock);
            var contentElement = getBlockContentElement(firstBlock);
            contentElement.textContent = '';
            editor.blocks[0].type = BlockType.BulletList;
            editor.blocks[0].cssClass = 'e-test';
            editor.dataBind();

            expect(editor.blocks[0].type).toBe(BlockType.BulletList);
            expect(editor.blocks[0].cssClass).toBe('e-test');

            //Assert dom
            setTimeout(() => {
                const blocks = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
                expect(blocks[0].classList.contains('e-list-block')).toBe(true);
                expect(blocks[0].classList.contains('e-test')).toBe(true);
                done();
            }, 100);
        });

        it('should not update for non existing block', function (done) {
            editor.blocks[0].id = 'fake-id';
            editor.dataBind();

            expect(editorElement.querySelectorAll('.e-block')[0].id).toBe('block1');
            done();
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
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content-1', type: ContentType.Text, content: 'Hello world 1' }]
                },
                {
                    id: 'paragraph-2',
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content-2', type: ContentType.Text, content: 'Hello world 2' }]
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
                editor.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement);

                    // Different block
                    const blockElement2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                    editor.setFocusToBlock(blockElement2);
                    setCursorPosition(getBlockContentElement(blockElement2), 0);
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    editorElement.dispatchEvent(mouseUpEvent);
                    setTimeout(() => {
                        expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement2);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should handle line breaks on shift+enter', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
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
                editor.blockEditorMethods.addBlock({ id: 'empty-paragraph', type: BlockType.Paragraph, content: [] },
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

        it('should hide popup on scroll', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            // Ensure block action popup
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);

            // Trigger scroll
            setTimeout(() => {
                editorElement.dispatchEvent(new Event('scroll'));
                expect(document.querySelector('.e-blockeditor-blockaction-popup').classList.contains('e-popup-open')).toBe(false);
                done();
            }, 200);
        });

        it('should navigate bw blocks on arrow keys', (done) => {
            const blockElement1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block1Content = getBlockContentElement(blockElement1) as HTMLElement;
            const blockElement2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const block2Content = getBlockContentElement(blockElement2) as HTMLElement;

            // Cursor at end of block 1 and press right arrow
            editor.setFocusToBlock(blockElement1);
            setCursorPosition(block1Content, block1Content.textContent.length);
            const rightArrowEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                bubbles: true,
                cancelable: true
            });
            editorElement.dispatchEvent(rightArrowEvent);
            expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement2);

            // Cursor at start of block 2 and press left arrow
            editor.setFocusToBlock(blockElement2);
            setCursorPosition(block2Content, 0);
            const leftArrowEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                bubbles: true,
                cancelable: true
            });
            editorElement.dispatchEvent(leftArrowEvent);
            expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement1);
            done();
        });

        it('should display inline toolbar on text selection', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                editor.setSelection('paragraph-content-1', 0, 4);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement);
                    expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });

        it('should display inline toolbar on keyboard selection', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
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
                    expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement);
                    expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });

        it('should display slash menu on AddIcon click', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);

            const addIcon = editor.floatingIconContainer.querySelector('.e-block-add-icon') as HTMLElement;
            expect(addIcon).not.toBeNull();
            addIcon.click();
            setTimeout(() => {
                expect(editorElement.querySelector('#' + editor.currentHoveredBlock.id)).toBe(blockElement);
                expect(document.querySelector('.e-blockeditor-command-menu').classList.contains('e-popup-open')).toBe(true);
                editor.slashCommandModule.hidePopup();
                done();
            }, 100);
        });

        it('should handle entire selection and type any input', (done) => {
            setTimeout(() => {
                editor.selectAllBlocks();
                editor.isEntireEditorSelected = true;
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
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content-1', type: ContentType.Text, content: 'Hello world 1' }]
                },
                {
                    id: 'paragraph-2',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph-content-2', type: ContentType.Text, content: 'Hello world 2' },
                        { id: 'progress-label', type: ContentType.Label, props: { labelId: 'progress' } }
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
            const initialBlock = editor.getEditorBlocks()[0];

            editor.stateManager.updateContentOnUserTyping(null);

            expect(editor.getEditorBlocks()[0]).toBe(initialBlock);
            editor.destroy();
        });

        it('should do nothing if block model is not found', () => {
            const nonExistentBlockElement = createElement('div', { id: 'nonexistent' });
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const initialBlock = editor.getEditorBlocks()[0];

            editor.stateManager.updateContentOnUserTyping(nonExistentBlockElement);

            expect(editor.getEditorBlocks()[0]).toBe(initialBlock);
        });

        it('should do nothing if contentElement is not found', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.remove();

            editor.stateManager.updateContentOnUserTyping(blockElement);
        });

        it('should handle empty content array when updating', () => {
            editor.blocks[0].content = [];
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.stateManager.updateContentOnUserTyping(blockElement);
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

            editor.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                const updatedBlock = editor.getBlock('paragraph-2');
                expect(updatedBlock.content.length).toBe(3);
                expect(updatedBlock.content[2].type).toBe(ContentType.Text);
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

            editor.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                const updatedBlock = editor.getBlock('paragraph-2');
                expect(updatedBlock.content.length).toBe(3);
                expect(updatedBlock.content[2].type).toBe(ContentType.Text);
                expect(updatedBlock.content[2].id).toBe('custom-element');
                expect(updatedBlock.content[2].content).toBe('new element node');
                done();
            }, 10);
        });

        it('should clean up stale content models properly', () => {
            const blockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const content = [
                { id: 'content1', type: ContentType.Text, content: 'Text content' },
                { id: 'content2', type: ContentType.Text, content: 'Bold content - about to stale', styles: { bold: true } },
                { id: 'content3', type: ContentType.Text, content: 'Another text content' }
            ];

            editor.addBlock({ id: 'newblock', content: content, type: BlockType.Paragraph }, 'paragraph-2');

            const newblockElement = editorElement.querySelector('#newblock') as HTMLElement;
            const contentElement = getBlockContentElement(newblockElement);

            // Select range partially from content1 to content3
            editor.nodeSelection.createRangeWithOffsets(
                contentElement.childNodes[0].firstChild,
                contentElement.childNodes[2].firstChild,
                4, 13);
            const range = getSelectedRange();
            range.deleteContents();
            editor.stateManager.updateContentOnUserTyping(newblockElement);

            expect(editor.getEditorBlocks()[2].content.length).toBe(2);
            expect(editor.getEditorBlocks()[2].content[0].id).toBe('content1');
            expect(editor.getEditorBlocks()[2].content[0].content).toBe('Text');

            expect(editor.getEditorBlocks()[2].content[1].id).toBe('content3');
            expect(editor.getEditorBlocks()[2].content[1].content).toBe('content');
        });
    });
});
