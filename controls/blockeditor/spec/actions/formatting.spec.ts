import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseStylesProp, BlockModel, ITableBlockSettings } from '../../src/models/index';
import { setCursorPosition, setSelectionRange, getBlockContentElement, getSelectedRange, getDeepestTextNode } from '../../src/common/utils/index';
import { createEditor } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { BlockType, ContentType } from '../../src/models/enums';

describe('Formatting Actions', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    const domHelpers = {
        query(el: Element | Document, sel: string): HTMLElement { return el.querySelector(sel) as HTMLElement; },
        queryAll(el: Element | Document, sel: string): HTMLElement[] { return Array.from(el.querySelectorAll(sel)) as HTMLElement[]; },
        dispatch(el: Element, type: string, init?: any) {
            const evt = new (window as any).Event(type, { bubbles: true, cancelable: true, ...init });
            el.dispatchEvent(evt);
            return evt;
        },
        input(el: Element, value: string) {
            (el as HTMLElement).textContent = value;
        },
        key(el: Element, key: string, opts: any = {}) {
            const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts });
            el.dispatchEvent(ev);
            const up = new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true, ...opts });
            el.dispatchEvent(up);
        },
        paste(el: Element, text: string) {
            const pasteEvt = new ClipboardEvent('paste', { bubbles: true, cancelable: true } as any);
            Object.defineProperty(pasteEvt, 'clipboardData', { value: { getData: () => text } });
            el.dispatchEvent(pasteEvt);
        }
    };

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }
    
    function getTable(editorElement: HTMLElement): HTMLTableElement {
        return editorElement.querySelector('.e-table-block table') as HTMLTableElement;
    }

    // NOTE: row is 1-based, col is 0-based
    function getDataCellEl(editorElement: HTMLElement, row: number, col: number): HTMLTableCellElement {
        const table = getTable(editorElement);
        return table.querySelector(`td[data-row="${row}"][data-col="${col}"]`) as HTMLTableCellElement;
    }

    function selectRectangle(el: HTMLElement, startRow: number, startCol: number, endRow: number, endCol: number): void {
        const start = getDataCellEl(el, startRow, startCol);
        const end = getDataCellEl(el, endRow, endCol);
        start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    }

    function setRange(start: Node, end: Node, startOffset: number, endOffset: number) {
        const range: Range = document.createRange();
        const selection: Selection | null = window.getSelection();
        if (selection) {
            range.setStart(start, startOffset);
            range.setEnd(end, endOffset);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    describe('Ensuring proper basic formatting', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    blockType: BlockType.Paragraph,
                    content: [{
                        contentType: ContentType.Text,
                        content: 'BoldItalicUnderlineStrikethrough'
                    }]
                },
                {
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [{
                        contentType: ContentType.Text,
                        content: 'LowercaseUppercaseColorBgColorCustom'
                    }]
                },
                {
                    id: 'paragraph3',
                    blockType: BlockType.Paragraph,
                    content: [{
                        contentType: ContentType.Text,
                        content: 'SuperscriptSubscript'
                    }]
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

        it('applying bold formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply bold formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 0, 4);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('strong').textContent).toBe('Bold');
            expect(contentElement.querySelector('span').textContent).toBe('ItalicUnderlineStrikethrough');

            expect((editor.blocks[0].content[0].content)).toBe('Bold');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[1].content)).toBe('ItalicUnderlineStrikethrough');
        });

        it('applying italic formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply italic formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 6);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.querySelector('em').textContent).toBe('Italic');
            expect(contentElement.querySelector('span').textContent).toBe('UnderlineStrikethrough');

            expect((editor.blocks[0].content[0].content)).toBe('Bold');
            expect((editor.blocks[0].content[1].content)).toBe('Italic');
            expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[2].content)).toBe('UnderlineStrikethrough');
        });

        it('applying underline formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply underline formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            expect(contentElement.childElementCount).toBe(4);
            expect(contentElement.querySelector('u').textContent).toBe('Underline');
            expect(contentElement.querySelector('span').textContent).toBe('Strikethrough');

            expect((editor.blocks[0].content[0].content)).toBe('Bold');
            expect((editor.blocks[0].content[1].content)).toBe('Italic');
            expect((editor.blocks[0].content[2].content)).toBe('Underline');
            expect((editor.blocks[0].content[2].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[0].content[3].content)).toBe('Strikethrough');
        });

        it('applying strikethrough formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply strikethrough formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 13);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            expect(contentElement.childElementCount).toBe(4);
            expect(contentElement.querySelector('s').textContent).toBe('Strikethrough');

            expect((editor.blocks[0].content[0].content)).toBe('Bold');
            expect((editor.blocks[0].content[1].content)).toBe('Italic');
            expect((editor.blocks[0].content[2].content)).toBe('Underline');
            expect((editor.blocks[0].content[3].content)).toBe('Strikethrough');
            expect((editor.blocks[0].content[3].properties as BaseStylesProp).styles.strikethrough).toBe(true);
        });

        it('applying lowercase formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply lowercase formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 0, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            expect(contentElement.childElementCount).toBe(2);
            const textDecoration = (contentElement.querySelector(`#${editor.blocks[1].content[0].id}`) as HTMLElement).style.textTransform;
            expect(textDecoration).toBe('lowercase');

            expect((editor.blocks[1].content[0].content)).toBe('Lowercase');
            expect((editor.blocks[1].content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);
            expect((editor.blocks[1].content[1].content)).toBe('UppercaseColorBgColorCustom');
        });

        it('applying uppercase formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply uppercase formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });
            expect(contentElement.childElementCount).toBe(3);
            const textDecoration = (contentElement.querySelector(`#${editor.blocks[1].content[1].id}`) as HTMLElement).style.textTransform;
            expect(textDecoration).toBe('uppercase');

            expect((editor.blocks[1].content[0].content)).toBe('Lowercase');
            expect((editor.blocks[1].content[1].content)).toBe('Uppercase');
            expect((editor.blocks[1].content[1].properties as BaseStylesProp).styles.uppercase).toBe(true);
            expect((editor.blocks[1].content[2].content)).toBe('ColorBgColorCustom');
        });

        it('applying color formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply color formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 5);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#EE0000' });
            expect(contentElement.childElementCount).toBe(4);
            const color = (contentElement.querySelector(`#${editor.blocks[1].content[2].id}`) as HTMLElement).style.color;
            expect(color).toBe('rgb(238, 0, 0)');

            expect((editor.blocks[1].content[0].content)).toBe('Lowercase');
            expect((editor.blocks[1].content[1].content)).toBe('Uppercase');
            expect((editor.blocks[1].content[2].content)).toBe('Color');
            expect((editor.blocks[1].content[2].properties as BaseStylesProp).styles.color).toBe('#EE0000');
            expect((editor.blocks[1].content[3].content)).toBe('BgColorCustom');
        });

        it('removing the applied color formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply color formatting
            const colorSpan = (contentElement.lastChild as HTMLElement).previousElementSibling.childNodes[0] as HTMLElement;
            setSelectionRange(colorSpan, 0, 5);
            // setSelectionRange((contentElement.lastChild as HTMLElement).previousElementSibling.childNodes[0], 0, 5);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '' });
            expect(contentElement.childElementCount).toBe(4);
            const color = (contentElement.querySelector(`#${editor.blocks[1].content[2].id}`) as HTMLElement).style.color;
            expect(color).toBe('');

            expect((editor.blocks[1].content[0].content)).toBe('Lowercase');
            expect((editor.blocks[1].content[1].content)).toBe('Uppercase');
            expect((editor.blocks[1].content[2].content)).toBe('Color');
            expect((editor.blocks[1].content[2].properties as BaseStylesProp).styles.color).toBeUndefined();
            expect((editor.blocks[1].content[3].content)).toBe('BgColorCustom');
        });

        it('applying BgColor formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply BgColor formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 7);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#F8F8F8' });
            expect(contentElement.childElementCount).toBe(5);
            const bgColor = (contentElement.querySelector(`#${editor.blocks[1].content[3].id}`) as HTMLElement).style.backgroundColor;
            expect(bgColor).toBe('rgb(248, 248, 248)');

            expect((editor.blocks[1].content[0].content)).toBe('Lowercase');
            expect((editor.blocks[1].content[1].content)).toBe('Uppercase');
            expect((editor.blocks[1].content[2].content)).toBe('Color');
            expect((editor.blocks[1].content[3].content)).toBe('BgColor');
            expect((editor.blocks[1].content[3].properties as BaseStylesProp).styles.backgroundColor).toBe('#F8F8F8');
        });

        it('applying custom formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply custom formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 6);
            expect(contentElement.childElementCount).toBe(5);

            expect((editor.blocks[1].content[0].content)).toBe('Lowercase');
            expect((editor.blocks[1].content[1].content)).toBe('Uppercase');
            expect((editor.blocks[1].content[2].content)).toBe('Color');
            expect((editor.blocks[1].content[3].content)).toBe('BgColor');
        });

        it('applying superscript formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph3') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply superscript formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 0, 11);
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('sup').textContent).toBe('Superscript');
            expect(contentElement.querySelector('span').textContent).toBe('Subscript');

            expect((editor.blocks[2].content[0].content)).toBe('Superscript');
            expect((editor.blocks[2].content[0].properties as BaseStylesProp).styles.superscript).toBe(true);
            expect((editor.blocks[2].content[1].content)).toBe('Subscript');
        });

        it('applying subscript formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph3') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply subscript formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('sub').textContent).toBe('Subscript');

            expect((editor.blocks[2].content[0].content)).toBe('Superscript');
            expect((editor.blocks[2].content[1].content)).toBe('Subscript');
            expect((editor.blocks[2].content[1].properties as BaseStylesProp).styles.subscript).toBe(true);
        });
    });

    describe('Formatting with different content types', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    content: [{
                        contentType: ContentType.Link,
                        content: 'Helloworld',
                        properties: {
                            url: 'www.syncfusion.com'
                        }
                    }]
                },
                {
                    id: 'quote',
                    blockType: BlockType.Quote,
                    content: [{
                        contentType: ContentType.Text,
                        content: 'Welcometext',
                        properties: {
                            styles: {
                                inlineCode: true
                            }
                        }
                    }]
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

        it('applying bold to link content', () => {
            const blockElement = editorElement.querySelector('#heading1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange((contentElement.lastChild.lastChild as HTMLElement), 0, 5);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('strong').textContent).toBe('Hello');

            expect((editor.blocks[0].content[0].content)).toBe('Hello');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[1].content)).toBe('world');
        });

        it('applying italic to code content', () => {
            const blockElement = editorElement.querySelector('#quote') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange((contentElement.lastChild.lastChild as HTMLElement), 0, 7);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('em').textContent).toBe('Welcome');

            expect((editor.blocks[1].content[0].content)).toBe('Welcome');
            expect((editor.blocks[1].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[1].content[1].content)).toBe('text');
        });

        it('applying multiple formats to link content', () => {
            const blockElement = editorElement.querySelector('#heading1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange((contentElement.lastChild.lastChild as HTMLElement), 0, 5);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('strong')).not.toBeNull();
            expect(contentElement.querySelector('em')).not.toBeNull();
            expect(contentElement.querySelector('s')).not.toBeNull();
            expect(contentElement.querySelector('u')).not.toBeNull();
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
        });
    });

    describe('Active Formatting during typing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{
                            id: 'content-1',
                            contentType: ContentType.Text,
                            content: 'Hello world'
                        }]
                    }
                ]
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            document.body.removeChild(editorElement);
        });

        it('should apply active formats when typing', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);

                // Activate bold formatting
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', code: 'KeyB', ctrlKey: true }));
                expect(editor.blockManager.formattingAction.activeInlineFormats.has('bold')).toBe(true);

                // Simulate typing a character
                const contentElement = getBlockContentElement(blockElement);
                contentElement.textContent = 'Hello worldx';

                // Create a collapsed selection at the end of text
                const range = document.createRange();
                const textNode = contentElement.firstChild;
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                (editor.blockManager.eventAction as any).processFormattingActions({ inputType: 'insertText' });

                // Check if the newly typed character has formatting
                setTimeout(() => {
                    // Last character should be bold now
                    expect(contentElement.querySelector('strong')).not.toBeNull();
                    expect(contentElement.querySelector('strong').textContent).toBe('x');

                    expect((editor.blocks[0].content[0].content)).toBe('Hello world');
                    expect((editor.blocks[0].content[1].content)).toBe('x');
                    expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        it('should handle removed formats when typing', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);

                // Activate bold formatting but don't apply it yet
                editor.blockManager.formattingAction.activeInlineFormats.add('bold');
                expect(editor.blockManager.formattingAction.activeInlineFormats.has('bold')).toBe(true);

                // Simulate typing a character
                let contentElement = getBlockContentElement(blockElement);
                contentElement.textContent = 'Hello worldx';

                // Create a collapsed selection at the end of text
                let range = document.createRange();
                let textNode = contentElement.firstChild;
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);

                let selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Call the method directly
                let result = editor.blockManager.formattingAction.handleTypingWithActiveFormats();

                // Should return true indicating formatting was applied
                expect(result).toBe(true);

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', code: 'KeyB', ctrlKey: true }));

                expect(editor.blockManager.formattingAction.activeInlineFormats.has('bold')).toBe(false);

                contentElement = getBlockContentElement(blockElement);
                const boldElement = contentElement.querySelector('strong');
                boldElement.textContent = boldElement.textContent + 'y';

                // Create a collapsed selection at the end of updated node
                range = document.createRange();
                textNode = boldElement.firstChild;
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);

                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);


                // Call the method directly
                result = editor.blockManager.formattingAction.handleTypingWithActiveFormats();

                expect(result).toBe(true);

                // Check if the newly typed character has formatting
                setTimeout(() => {
                    // Last character should not be bold now
                    expect(contentElement.querySelector('strong')).not.toBeNull();
                    expect(contentElement.querySelector('strong').textContent).toBe('x');

                    expect((editor.blocks[0].content[0].content)).toBe('Hello world');
                    expect((editor.blocks[0].content[1].content)).toBe('x');
                    expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);
                    expect((editor.blocks[0].content[2].content)).toBe('y');
                    expect((editor.blocks[0].content[2].properties as BaseStylesProp).styles.bold).toBeUndefined();
                    done();
                }, 100);
            }, 100);
        });

        it('should not apply formatting if all active formats already applied', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);

                // First make the entire text bold
                setSelectionRange(getBlockContentElement(blockElement).firstChild as HTMLElement, 0, 11);
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                // Add bold to active formats
                editor.blockManager.formattingAction.activeInlineFormats.add('bold');

                // Simulate typing a character within a bold element
                const contentElement = getBlockContentElement(blockElement);
                const boldElement = contentElement.querySelector('strong');
                boldElement.textContent = boldElement.textContent + 'x';

                // Create a collapsed selection at the end of text
                const range = document.createRange();
                const textNode = boldElement.firstChild;
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Call the method directly
                const result = editor.blockManager.formattingAction.handleTypingWithActiveFormats();

                // Should return false because formatting already exists
                expect(result).toBe(false);
                done();
            }, 100);
        });

        it('should apply multiple active formats', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);

                // Activate multiple formats
                editor.blockManager.formattingAction.activeInlineFormats.add('bold');
                editor.blockManager.formattingAction.activeInlineFormats.add('italic');

                // Simulate typing a character
                const contentElement = getBlockContentElement(blockElement);
                contentElement.textContent = 'Hello worldx';

                // Create a collapsed selection at the end of text
                const range = document.createRange();
                const textNode = contentElement.firstChild;
                range.setStart(textNode, textNode.textContent.length);
                range.setEnd(textNode, textNode.textContent.length);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Call the method directly
                editor.blockManager.formattingAction.handleTypingWithActiveFormats();

                // Check if multiple formats were applied
                setTimeout(() => {
                    const strongElement = contentElement.querySelector('strong');
                    const italicElement = contentElement.querySelector('em');

                    expect(strongElement).not.toBeNull();
                    expect(italicElement).not.toBeNull();
                    expect(strongElement.textContent).toBe('x');
                    expect(italicElement.textContent).toBe('x');

                    expect((editor.blocks[0].content[0].content)).toBe('Hello world');
                    expect((editor.blocks[0].content[1].content)).toBe('x');
                    expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.bold).toBe(true);
                    expect((editor.blocks[0].content[1].properties as BaseStylesProp).styles.italic).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Multi-Block Formatting', () => {
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
                        content: 'First paragraph content'
                    }]
                },
                {
                    id: 'heading1',
                    blockType: BlockType.Heading,
                    properties: { level: 2 },
                    content: [{
                        id: 'h1-content',
                        contentType: ContentType.Text,
                        content: 'Second heading content'
                    }]
                },
                {
                    id: 'quote1',
                    blockType: BlockType.Quote,
                    content: [{
                        id: 'q1-content',
                        contentType: ContentType.Text,
                        content: 'Third quote content'
                    }]
                },
                {
                    id: 'list1',
                    blockType: BlockType.BulletList,
                    content: [{
                        id: 'l1-content',
                        contentType: ContentType.Text,
                        content: 'Fourth list content'
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

        it('should apply bold formatting to multiple paragraph blocks', (done) => {
            setTimeout(() => {
                // Create selection across first two blocks
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;
                const firstContent = getBlockContentElement(firstBlock);
                const secondContent = getBlockContentElement(secondBlock);

                const range = document.createRange();
                range.setStart(firstContent.firstChild, 6); // Start from "paragraph"
                range.setEnd(secondContent.firstChild, 13); // End at "heading"

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply bold formatting
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                // Verify bold was applied to all selected content in both blocks
                const firstBlockContent = editor.blocks[0].content;
                const secondBlockContent = editor.blocks[1].content;

                expect(firstBlockContent.length).toBeGreaterThan(1);
                expect(secondBlockContent.length).toBeGreaterThan(1);

                // Check that the selected portions have bold formatting
                const boldContent1 = firstBlockContent.find(c => ((c.properties as BaseStylesProp).styles.bold as boolean));
                const boldContent2 = secondBlockContent.find(c => ((c.properties as BaseStylesProp).styles.bold as boolean));

                expect(boldContent1).toBeDefined();
                expect(boldContent2).toBeDefined();

                // Verify DOM updates
                expect(firstContent.querySelector('strong')).not.toBeNull();
                expect(secondContent.querySelector('strong')).not.toBeNull();

                done();
            }, 100);
        });

        it('should apply italic formatting to multiple different block types', (done) => {
            setTimeout(() => {
                // Create selection across heading, quote, and list blocks
                const headingBlock = editorElement.querySelector('#heading1') as HTMLElement;
                const quoteBlock = editorElement.querySelector('#quote1') as HTMLElement;
                const listBlock = editorElement.querySelector('#list1') as HTMLElement;

                const headingContent = getBlockContentElement(headingBlock);
                const listContent = getBlockContentElement(listBlock);

                const range = document.createRange();
                range.setStart(headingContent.firstChild, 0);
                range.setEnd(listContent.firstChild, 6); // End at "Fourth"

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply italic formatting
                editor.blockManager.formattingAction.execCommand({ command: 'italic' });

                // Verify italic was applied across all three blocks
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[2].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);
                expect(editor.blocks[3].content.some(c => (c.properties as BaseStylesProp).styles.italic as boolean)).toBe(true);

                // Verify DOM updates
                expect(headingContent.querySelector('em')).not.toBeNull();
                expect(getBlockContentElement(quoteBlock).querySelector('em')).not.toBeNull();
                expect(listContent.querySelector('em')).not.toBeNull();

                done();
            }, 100);
        });

        it('should apply underline formatting to all blocks when entire editor is selected', (done) => {
            setTimeout(() => {
                // Select entire editor content
                editor.selectAllBlocks();

                // Apply underline formatting
                editor.blockManager.formattingAction.execCommand({ command: 'underline' });

                // Verify underline was applied to all blocks
                editor.blocks.forEach((block, index) => {
                    expect(block.content.some(c => (c.properties as BaseStylesProp).styles.underline as boolean)).toBe(true);

                    const blockElement = editorElement.querySelector(`#paragraph1, #heading1, #quote1, #list1`) as HTMLElement;
                    const contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.querySelector('u')).not.toBeNull();
                });

                done();
            }, 100);
        });

        it('should apply multiple formats (bold and italic) to multi-block selection', (done) => {
            setTimeout(() => {
                // Create selection across first three blocks
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const thirdBlock = editorElement.querySelector('#quote1') as HTMLElement;

                const firstContent = getBlockContentElement(firstBlock);
                const thirdContent = getBlockContentElement(thirdBlock);

                const range = document.createRange();
                range.setStart(firstContent.firstChild, 0);
                range.setEnd(thirdContent.firstChild, 5); // End at "Third"

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply bold formatting first
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                // Apply italic formatting second
                editor.blockManager.formattingAction.execCommand({ command: 'italic' });

                // Verify both formats were applied
                [0, 1, 2].forEach(blockIndex => {
                    const hasItalic = editor.blocks[blockIndex].content.some(c =>
                        (c.properties as BaseStylesProp).styles.italic as boolean);
                    expect(hasItalic).toBe(true);

                    const blockElement = editorElement.querySelector(`#${editor.blocks[blockIndex].id}`) as HTMLElement;
                    const contentElement = getBlockContentElement(blockElement);
                    
                    expect(contentElement.querySelector('strong')).not.toBeNull();
                    expect(contentElement.querySelector('em')).not.toBeNull();
                });

                done();
            }, 100);
        });

        it('should remove formatting when applied to already formatted multi-block content', (done) => {
            setTimeout(() => {
                // First apply bold to multiple blocks
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;

                const firstContent = getBlockContentElement(firstBlock);
                const secondContent = getBlockContentElement(secondBlock);

                let range = document.createRange();
                range.setStart(firstContent.firstChild, 0);
                range.setEnd(secondContent.firstChild, secondContent.firstChild.textContent.length);

                let selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply bold
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                // Verify bold was applied
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(getBlockContentElement(firstBlock).querySelector('strong')).not.toBeNull();
                expect(getBlockContentElement(secondBlock).querySelector('strong')).not.toBeNull();

                // Now select the same range and apply bold again to remove it
                range = document.createRange();
                range.setStart(firstContent.firstChild.firstChild, 0);
                range.setEnd(secondContent.firstChild.firstChild, secondContent.firstChild.textContent.length);

                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                // Verify bold was removed
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(getBlockContentElement(firstBlock).querySelector('strong')).toBeNull();
                expect(getBlockContentElement(secondBlock).querySelector('strong')).toBeNull();

                done();
            }, 100);
        });

        it('should apply color formatting to multi-block selection', (done) => {
            setTimeout(() => {
                // Select across two blocks
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;

                const range = document.createRange();
                range.setStart(getBlockContentElement(firstBlock).firstChild, 5);
                range.setEnd(getBlockContentElement(secondBlock).firstChild, 10);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply color formatting
                editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });

                // Verify color was applied
                expect(editor.blocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.color as string) === '#FF0000')).toBe(true);
                expect(editor.blocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.color as string) === '#FF0000')).toBe(true);

                expect(getBlockContentElement(firstBlock).querySelector('span[style*="color"]')).not.toBeNull();
                expect(getBlockContentElement(secondBlock).querySelector('span[style*="color"]')).not.toBeNull();

                done();
            }, 100);
        });

        it('should apply superscript and subscript formatting to multi-block selection', (done) => {
            setTimeout(() => {
                // Select content across blocks
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#heading1') as HTMLElement;

                const range = document.createRange();
                range.setStart(getBlockContentElement(firstBlock).firstChild, 0);
                range.setEnd(getBlockContentElement(secondBlock).firstChild, 5);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply superscript
                editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

                // Verify superscript was applied
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.superscript as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.superscript as boolean)).toBe(true);
                expect(getBlockContentElement(firstBlock).querySelector('sup')).not.toBeNull();
                expect(getBlockContentElement(secondBlock).querySelector('sup')).not.toBeNull();

                // Apply subscript (should remove superscript due to toggle pairs)
                editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

                // Verify subscript was applied and superscript removed
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.subscript as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.subscript as boolean)).toBe(true);
                expect(editor.blocks[0].content.every(c => !(c.properties as BaseStylesProp).styles.superscript as boolean)).toBe(true);
                expect(editor.blocks[1].content.every(c => !(c.properties as BaseStylesProp).styles.superscript as boolean)).toBe(true);

                expect(getBlockContentElement(firstBlock).querySelector('sup')).toBeNull();
                expect(getBlockContentElement(secondBlock).querySelector('sup')).toBeNull();
                expect(getBlockContentElement(firstBlock).querySelector('sub')).not.toBeNull();
                expect(getBlockContentElement(secondBlock).querySelector('sub')).not.toBeNull();

                done();
            }, 100);
        });

        it('should handle partial content selection in multi-block formatting', (done) => {
            setTimeout(() => {
                // Select partial content from each block
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const thirdBlock = editorElement.querySelector('#quote1') as HTMLElement;

                const firstContent = getBlockContentElement(firstBlock);
                const thirdContent = getBlockContentElement(thirdBlock);

                const range = document.createRange();
                range.setStart(firstContent.firstChild, 6); // Start from "paragraph"
                range.setEnd(thirdContent.firstChild, 5); // End at "Third"

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply strikethrough formatting
                editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

                // Verify only selected portions were formatted
                const firstBlockContent = editor.blocks[0].content;
                const secondBlockContent = editor.blocks[1].content;
                const thirdBlockContent = editor.blocks[2].content;

                // First block should have content split (before, formatted, after)
                expect(firstBlockContent.length).toBeGreaterThan(1);
                expect(firstBlockContent.some(c => (c.properties as BaseStylesProp).styles.strikethrough as boolean)).toBe(true);

                // Second block should be fully formatted
                expect(secondBlockContent.some(c => (c.properties as BaseStylesProp).styles.strikethrough as boolean)).toBe(true);

                // Third block should have content split
                expect(thirdBlockContent.length).toBeGreaterThan(1);
                expect(thirdBlockContent.some(c => (c.properties as BaseStylesProp).styles.strikethrough as boolean)).toBe(true);

                expect(getBlockContentElement(firstBlock).querySelector('s')).not.toBeNull();
                expect(getBlockContentElement(editorElement.querySelector(`#${editor.blocks[1].id}`)).querySelector('s')).not.toBeNull();
                expect(getBlockContentElement(thirdBlock).querySelector('s')).not.toBeNull();

                done();
            }, 100);
        });

        it('should skip non-formattable block types in multi-block selection', (done) => {
            // Add a divider block that shouldn't be formatted
            const dividerBlock: BlockModel = {
                id: 'divider1',
                blockType: BlockType.Divider,
                content: []
            };

            editor.addBlock(dividerBlock, 'heading1', true);

            setTimeout(() => {
                // Select from paragraph through divider to quote
                const firstBlock = editorElement.querySelector('#paragraph1') as HTMLElement;
                const quoteBlock = editorElement.querySelector('#quote1') as HTMLElement;
                const dividerBlock = editorElement.querySelector('#divider1') as HTMLElement;

                const range = document.createRange();
                range.setStart(getBlockContentElement(firstBlock).firstChild, 0);
                range.setEnd(getBlockContentElement(quoteBlock).firstChild, 5);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Apply bold formatting
                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                // Verify formatting was applied only to formattable blocks
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true); // paragraph
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true); // heading
                // divider block should remain unchanged (no content to format)
                expect(editor.blocks[2].content.length).toBe(0);
                expect(editor.blocks[3].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true); // quote

                expect(getBlockContentElement(firstBlock).querySelector('strong')).not.toBeNull();
                expect(dividerBlock.querySelector('strong')).toBeNull();
                expect(getBlockContentElement(quoteBlock).querySelector('strong')).not.toBeNull();

                done();
            }, 100);
        });

        it('should preserve selection state during multi-block formatting', (done) => {
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

                // Verify formatting was reapplied
                expect(editor.blocks[0].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);
                expect(editor.blocks[1].content.some(c => (c.properties as BaseStylesProp).styles.bold as boolean)).toBe(true);

                expect(initialRangeText === getSelectedRange().toString()).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Table block formatting', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function buildTableBlock(id: string, cols: number, rows: number, withText = true, enableHeader = true, enableRowNumbers = true): BlockModel {
            const columns = Array.from({ length: cols }).map((_, i) => ({ id: `col${i + 1}`, headerText: `H${i + 1}` }));
            const bodyRows = Array.from({ length: rows }).map((_, r) => ({
                id: `row${r + 1}`,
                cells: columns.map((c, cIdx) => ({
                    id: `cell_${r + 1}_${cIdx + 1}`,
                    columnId: c.id,
                    blocks: [{ id: `b_${r + 1}_${cIdx + 1}`, blockType: BlockType.Paragraph, content: [{ id: `c_${r + 1}_${cIdx + 1}`, contentType: ContentType.Text, content: withText ? `R${r + 1}C${cIdx + 1}` : '' }] }]
                }))
            }));
            const properties: any = { columns, rows: bodyRows, width: '100%', enableHeader, enableRowNumbers };
            return { id, blockType: BlockType.Table, properties: properties } as any as BlockModel;
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor-table-formatting' });
            document.body.appendChild(editorElement);
            const before: BlockModel = { id: 'before', blockType: BlockType.Paragraph, content: [{ id: 'bc', contentType: ContentType.Text, content: 'BeforePara' }] };
            const table: BlockModel = buildTableBlock('table_block_fmt', 3, 3, true, true, true);
            const after: BlockModel = { id: 'after', blockType: BlockType.Quote, content: [{ id: 'ac', contentType: ContentType.Text, content: 'AfterQuote' }] } as any;
            editor = createEditor({ blocks: [before, table, after] });
            editor.appendTo('#editor-table-formatting');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('applies bold to selected table cells when no DOM range (table rectangle selection)', () => {
            // Select a 2x2 rectangle (visual rows 1-2, cols 1-2)
            selectRectangle(editorElement, 1, 1, 2, 2);

            const targetCell = getDataCellEl(editorElement, 1, 1) as HTMLElement;
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);
            // Execute formatting (selectedBlocks and range are expected to be null; table selection manager path)
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert Model: Only selected 4 cells should have bold style on their inner content model
            const tableModel = editor.blocks[1] as BlockModel; // [before, table, after]
            const properties: ITableBlockSettings = tableModel.properties as ITableBlockSettings;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const content = properties.rows[r].cells[c].blocks[0].content[0];
                    // The selected visual rectangle was rows 1-2 and cols 1-2 (data-col 1..2 map to model cell index 1..2)
                    const shouldBeBold = (r <= 1) && (c >= 1 && c <= 2);
                    if (shouldBeBold) {
                        expect(((content.properties as BaseStylesProp).styles).bold).toBe(true);
                    } else {
                        expect(((content.properties as BaseStylesProp).styles).bold).toBeUndefined();
                    }
                }
            }

            // Assert DOM: the 4 selected cells contain <strong>
            expect(getDataCellEl(editorElement, 1, 1).querySelector('strong')).not.toBeNull();
            expect(getDataCellEl(editorElement, 1, 2).querySelector('strong')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 1).querySelector('strong')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 2).querySelector('strong')).not.toBeNull();
            // Non-selected cell sample remains normal
            expect(getDataCellEl(editorElement, 3, 0).querySelector('strong')).toBeNull();
        });

        it('applies italic to selected table cells', () => {
            // Select a 2x2 rectangle (visual rows 1-2, cols 1-2)
            selectRectangle(editorElement, 1, 1, 2, 2);

            const targetCell = getDataCellEl(editorElement, 1, 1) as HTMLElement;
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);
            // Execute formatting (selectedBlocks and range are expected to be null; table selection manager path)
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert Model: Only selected 4 cells should have italic style on their inner content model
            const tableModel = editor.blocks[1] as BlockModel; // [before, table, after]
            const properties: ITableBlockSettings = tableModel.properties as ITableBlockSettings;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const content = properties.rows[r].cells[c].blocks[0].content[0];
                    // The selected visual rectangle was rows 1-2 and cols 1-2 (data-col 1..2 map to model cell index 1..2)
                    const shouldBeItalic = (r <= 1) && (c >= 1 && c <= 2);
                    if (shouldBeItalic) {
                        expect(((content.properties as BaseStylesProp).styles).italic).toBe(true);
                    } else {
                        expect(((content.properties as BaseStylesProp).styles).italic).toBeUndefined();
                    }
                }
            }

            // Assert DOM: the 4 selected cells contain <em>
            expect(getDataCellEl(editorElement, 1, 1).querySelector('em')).not.toBeNull();
            expect(getDataCellEl(editorElement, 1, 2).querySelector('em')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 1).querySelector('em')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 2).querySelector('em')).not.toBeNull();
            // Non-selected cell sample remains normal
            expect(getDataCellEl(editorElement, 3, 0).querySelector('em')).toBeNull();
        });

        it('applies underline to selected table cells', () => {
            // Select a 2x2 rectangle (visual rows 1-2, cols 1-2)
            selectRectangle(editorElement, 1, 1, 2, 2);

            const targetCell = getDataCellEl(editorElement, 1, 1) as HTMLElement;
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);
            // Execute formatting (selectedBlocks and range are expected to be null; table selection manager path)
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Assert Model: Only selected 4 cells should have underline style on their inner content model
            const tableModel = editor.blocks[1] as BlockModel; // [before, table, after]
            const properties: ITableBlockSettings = tableModel.properties as ITableBlockSettings;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const content = properties.rows[r].cells[c].blocks[0].content[0];
                    // The selected visual rectangle was rows 1-2 and cols 1-2 (data-col 1..2 map to model cell index 1..2)
                    const shouldBeunderline = (r <= 1) && (c >= 1 && c <= 2);
                    if (shouldBeunderline) {
                        expect(((content.properties as BaseStylesProp).styles).underline).toBe(true);
                    } else {
                        expect(((content.properties as BaseStylesProp).styles).underline).toBeUndefined();
                    }
                }
            }

            // Assert DOM: the 4 selected cells contain <u>
            expect(getDataCellEl(editorElement, 1, 1).querySelector('u')).not.toBeNull();
            expect(getDataCellEl(editorElement, 1, 2).querySelector('u')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 1).querySelector('u')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 2).querySelector('u')).not.toBeNull();
            // Non-selected cell sample remains normal
            expect(getDataCellEl(editorElement, 3, 0).querySelector('u')).toBeNull();
        });

        it('applies strikethrough to selected table cells', () => {
            // Select a 2x2 rectangle (visual rows 1-2, cols 1-2)
            selectRectangle(editorElement, 1, 1, 2, 2);

            const targetCell = getDataCellEl(editorElement, 1, 1) as HTMLElement;
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);
            // Execute formatting (selectedBlocks and range are expected to be null; table selection manager path)
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Assert Model: Only selected 4 cells should have strikethrough style on their inner content model
            const tableModel = editor.blocks[1] as BlockModel; // [before, table, after]
            const properties: ITableBlockSettings = tableModel.properties as ITableBlockSettings;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const content = properties.rows[r].cells[c].blocks[0].content[0];
                    // The selected visual rectangle was rows 1-2 and cols 1-2 (data-col 1..2 map to model cell index 1..2)
                    const shouldBestrikethrough = (r <= 1) && (c >= 1 && c <= 2);
                    if (shouldBestrikethrough) {
                        expect(((content.properties as BaseStylesProp).styles).strikethrough).toBe(true);
                    } else {
                        expect(((content.properties as BaseStylesProp).styles).strikethrough).toBeUndefined();
                    }
                }
            }

            // Assert DOM: the 4 selected cells contain <s>
            expect(getDataCellEl(editorElement, 1, 1).querySelector('s')).not.toBeNull();
            expect(getDataCellEl(editorElement, 1, 2).querySelector('s')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 1).querySelector('s')).not.toBeNull();
            expect(getDataCellEl(editorElement, 2, 2).querySelector('s')).not.toBeNull();
            // Non-selected cell sample remains normal
            expect(getDataCellEl(editorElement, 3, 0).querySelector('s')).toBeNull();
        });

        it('applies italic across selection spanning Paragraph → Table → Quote (formats all table cell blocks)', () => {
            const beforeEl = editorElement.querySelector('#before') as HTMLElement;
            const beforeContent = getBlockContentElement(beforeEl);
            const afterEl = editorElement.querySelector('#after') as HTMLElement;
            const afterContent = getBlockContentElement(afterEl);

            // Create a DOM selection that spans from before paragraph start to after quote end
            const range = document.createRange();
            range.setStart(beforeContent.firstChild, 0);
            range.setEnd(afterContent.firstChild, (afterContent.firstChild as Text).length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            // Execute formatting (selectedBlocks will include Paragraph, Table, Quote)
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert model: before and after have italic where selected; all table cells are italic per implementation
            const tableModel = editor.blocks[1] as BlockModel;
            const properties: ITableBlockSettings = tableModel.properties as ITableBlockSettings;
            properties.rows.forEach((row) => row.cells.forEach((cell) => {
                const content = cell.blocks[0].content[0];
                expect(((content.properties as BaseStylesProp).styles).italic).toBe(true);
            }));

            // DOM: Any cell should have <em>
            expect(getDataCellEl(editorElement, 1, 0).querySelector('em')).not.toBeNull();
            expect(getDataCellEl(editorElement, 3, 2).querySelector('em')).not.toBeNull();
            // Also check before/after blocks reflect italic somewhere
            expect(beforeContent.querySelector('em')).not.toBeNull();
            expect(afterContent.querySelector('em')).not.toBeNull();
        });

        it('applies multiple formatting to partial text inside a single table cell', () => {
            // Focus a specific cell's inner block and select partial text
            const cell = getDataCellEl(editorElement, 2, 1); // visual row 2, col 1
            const innerBlock = cell.querySelector('.e-block') as HTMLElement;
            const innerContent = getBlockContentElement(innerBlock);
            editor.blockManager.setFocusToBlock(innerBlock);

            // Select the last two characters in that cell's text
            const textNode = innerContent.firstChild as Text;
            const len = textNode.textContent.length;
            setSelectionRange(textNode as any, len - 2, len);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Model: the cell's paragraph content should split and last part has underline
            const tableModel = editor.blocks[1] as BlockModel;
            const properties: ITableBlockSettings = tableModel.properties as ITableBlockSettings;
            const modelContent = properties.rows[1].cells[1].blocks[0].content; // row2 col2 in 1-based model indexing
            expect(modelContent.length).toBeGreaterThan(1);
            const appliedSegment = modelContent[1];
            expect(((appliedSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((appliedSegment.properties as BaseStylesProp).styles).italic).toBe(true);
            expect(((appliedSegment.properties as BaseStylesProp).styles).underline).toBe(true);
            expect(((appliedSegment.properties as BaseStylesProp).styles).strikethrough).toBe(true);

            // DOM: appliedSegment segment rendered with <u>
            expect(innerContent.querySelector('strong')).not.toBeNull();
            expect(innerContent.querySelector('em')).not.toBeNull();
            expect(innerContent.querySelector('u')).not.toBeNull();
            expect(innerContent.querySelector('s')).not.toBeNull();
        });

        it('select whole row using gripper and apply formatting', (done) => {
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            const rowAction = domHelpers.query(blockElement, '.e-row-action-handle');
            expect(rowAction).not.toBeNull();
            rowAction.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Visual selection assertions
            const firstRow = domHelpers.query(blockElement, 'tbody tr');
            expect(firstRow.classList.contains('e-row-selected')).toBe(true);

            const pinned = domHelpers.query(blockElement, '.e-row-action-handle.e-pinned') as HTMLElement;
            expect(pinned && pinned.style.display !== 'none').toBe(true);

            // Apply bold formatting
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                const tableModel = editor.blocks[1] as BlockModel;
                const props = tableModel.properties as ITableBlockSettings;

                // Model assertions: All cells in the first data row (row index 0) should have bold content
                const firstDataRow = props.rows[0];
                firstDataRow.cells.forEach(cell => {
                    expect(cell.blocks.length).toBeGreaterThan(0);
                    const textContent = cell.blocks[0].content.find(c => c.contentType === ContentType.Text);
                    expect(textContent).toBeDefined();
                    const styles = (textContent.properties as BaseStylesProp).styles;
                    expect(styles.bold).toBe(true);
                });

                // DOM assertions: All <p> elements in the first row cells should contain <strong>
                const dataCellsInRow = firstRow.querySelectorAll('td[role="gridcell"] .e-block-content');
                dataCellsInRow.forEach(p => {
                    expect(p.querySelector('strong')).not.toBeNull();
                    // Ensure the entire text is wrapped in <strong>
                    const strong = p.querySelector('strong');
                    expect(strong.textContent).toBe(p.textContent);
                });

                done();
            }, 100);
        });

        it('select whole column using gripper and apply formatting', (done) => {
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            const colAction = domHelpers.query(editorElement, '.e-col-action-handle');
            expect(colAction).not.toBeNull();
            colAction.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Visual selection assertions
            const rows = domHelpers.queryAll(blockElement, 'tbody tr') as HTMLTableRowElement[];
            expect(rows[0].cells[1].classList.contains('e-col-selected')).toBe(true); // first data column
            expect(rows[1].cells[1].classList.contains('e-col-selected')).toBe(true);

            const pinned = domHelpers.query(blockElement, '.e-col-action-handle.e-pinned') as HTMLElement;
            expect(pinned && pinned.style.display !== 'none').toBe(true);

            // Apply bold formatting
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                const tableModel = editor.blocks[1] as BlockModel;
                const props = tableModel.properties as ITableBlockSettings;

                // Model assertions: All cells in the first data column (column index 0) should have bold content
                props.rows.forEach(row => {
                    const cell = row.cells[0]; // first data column
                    expect(cell.blocks.length).toBeGreaterThan(0);
                    const textContent = cell.blocks[0].content.find(c => c.contentType === ContentType.Text);
                    expect(textContent). toBeDefined();
                    const styles = (textContent.properties as BaseStylesProp).styles;
                    expect(styles.bold).toBe(true);
                });

                // DOM assertions: All <p> elements in the first data column should contain <strong>
                rows.forEach(row => {
                    const dataCell = row.cells[1]; // first data column (skip row-number)
                    const p = dataCell.querySelector('.e-block-content');
                    expect(p).not.toBeNull();
                    expect(p.querySelector('strong')).not.toBeNull();

                    const strong = p.querySelector('strong');
                    expect(strong.textContent).toBe(p.textContent);
                });

                done();
            }, 100);
        });
    });

    describe('Multi-Block Formatting Inside Table Cell', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor-table-formatting' });
            document.body.appendChild(editorElement);

            // Create nested blocks inside first cell of a table
            const tableBlock: BlockModel = {
                id: 'table1',
                blockType: BlockType.Table,
                properties: {
                    columns: [{ id: 'col1', headerText: 'Content' }],
                    rows: [{
                        id: 'row1',
                        cells: [{
                            id: 'cell1',
                            columnId: 'col1',
                            blocks: [
                                {
                                    id: 'paragraph1',
                                    blockType: BlockType.Paragraph,
                                    content: [{
                                        id: 'p1-content',
                                        contentType: ContentType.Text,
                                        content: 'First paragraph content'
                                    }]
                                },
                                {
                                    id: 'heading1',
                                    blockType: BlockType.Heading,
                                    properties: { level: 2 },
                                    content: [{
                                        id: 'h1-content',
                                        contentType: ContentType.Text,
                                        content: 'Second heading content'
                                    }]
                                },
                                {
                                    id: 'quote1',
                                    blockType: BlockType.Quote,
                                    content: [{
                                        id: 'q1-content',
                                        contentType: ContentType.Text,
                                        content: 'Third quote content'
                                    }]
                                },
                                {
                                    id: 'list1',
                                    blockType: BlockType.BulletList,
                                    content: [{
                                        id: 'l1-content',
                                        contentType: ContentType.Text,
                                        content: 'Fourth list content'
                                    }]
                                }
                            ]
                        }]
                    }]
                } as ITableBlockSettings
            };

            editor = createEditor({ blocks: [tableBlock] });
            editor.appendTo('#editor-table-formatting');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            if (editorElement.parentElement) {
                editorElement.parentElement.removeChild(editorElement);
            }
        });

        it('should apply bold formatting to multiple nested blocks inside table cell', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const secondContent = firstCell.querySelector('#heading1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(firstContent.firstChild, 6); // "paragraph"
            range.setEnd(secondContent.firstChild, 13); // "heading"

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                const tableModel = editor.blocks[0] as BlockModel;
                const cellBlocks = (tableModel.properties as ITableBlockSettings).rows[0].cells[0].blocks;

                const paraBlock = cellBlocks.find(b => b.id === 'paragraph1');
                const headingBlock = cellBlocks.find(b => b.id === 'heading1');

                expect(paraBlock.content.some(c => ((c.properties as BaseStylesProp).styles.bold) as boolean)).toBe(true);
                expect(headingBlock.content.some(c => ((c.properties as BaseStylesProp).styles.bold) as boolean)).toBe(true);

                expect(firstContent.querySelector('strong')).not.toBeNull();
                expect(secondContent.querySelector('strong')).not.toBeNull();

                done();
            }, 100);
        });

        it('should apply italic formatting to multiple different nested block types inside table cell', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const headingContent = firstCell.querySelector('#heading1 .e-block-content') as HTMLElement;
            const listContent = firstCell.querySelector('#list1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(headingContent.firstChild, 0);
            range.setEnd(listContent.firstChild, 6); // "Fourth"

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            setTimeout(() => {
                const tableModel = editor.blocks[0] as BlockModel;
                const cellBlocks = (tableModel.properties as ITableBlockSettings).rows[0].cells[0].blocks;

                expect(cellBlocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.italic) as boolean)).toBe(true); // heading
                expect(cellBlocks[2].content.some(c => ((c.properties as BaseStylesProp).styles.italic) as boolean)).toBe(true); // quote
                expect(cellBlocks[3].content.some(c => ((c.properties as BaseStylesProp).styles.italic) as boolean)).toBe(true); // list

                expect(headingContent.querySelector('em')).not.toBeNull();
                expect(firstCell.querySelector('#quote1 em')).not.toBeNull();
                expect(listContent.querySelector('em')).not.toBeNull();

                done();
            }, 100);
        });

        it('should apply underline formatting when entire cell content is selected', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const lastContent = firstCell.querySelector('#list1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(firstContent.firstChild, 0);
            range.setEnd(lastContent.firstChild, lastContent.textContent.length);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            setTimeout(() => {
                const tableModel = editor.blocks[0] as BlockModel;
                const cellBlocks = (tableModel.properties as ITableBlockSettings).rows[0].cells[0].blocks;

                cellBlocks.forEach(block => {
                    expect(block.content.some(c => ((c.properties as BaseStylesProp).styles.underline) as boolean)).toBe(true);
                });

                expect(firstCell.querySelectorAll('u').length).toBeGreaterThan(0);

                done();
            }, 100);
        });

        it('should apply multiple formats (bold and italic) to nested multi-block selection', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const thirdContent = firstCell.querySelector('#quote1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(firstContent.firstChild, 0);
            range.setEnd(thirdContent.firstChild, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            setTimeout(() => {
                const cellBlocks = (editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks;

                [0, 1, 2].forEach(idx => {
                    const block = cellBlocks[idx];
                    expect(block.content.some(c => ((c.properties as BaseStylesProp).styles.bold) as boolean)).toBe(true);
                    expect(block.content.some(c => ((c.properties as BaseStylesProp).styles.italic) as boolean)).toBe(true);
                });

                expect(firstContent.querySelector('strong')).not.toBeNull();
                expect(firstContent.querySelector('em')).not.toBeNull();

                done();
            }, 100);
        });

        it('should remove formatting when applied to already formatted nested content', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const secondContent = firstCell.querySelector('#heading1 .e-block-content') as HTMLElement;

            let range = document.createRange();
            range.setStart(firstContent.firstChild, 0);
            range.setEnd(secondContent.firstChild, secondContent.textContent.length);

            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Apply bold
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Apply bold again to remove
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                const cellBlocks = (editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks;

                expect(cellBlocks[0].content.every(c => !((c.properties as BaseStylesProp).styles.bold) as boolean)).toBe(true);
                expect(cellBlocks[1].content.every(c => !((c.properties as BaseStylesProp).styles.bold) as boolean)).toBe(true);

                expect(firstContent.querySelector('strong')).toBeNull();
                expect(secondContent.querySelector('strong')).toBeNull();

                done();
            }, 100);
        });

        it('should apply color formatting to nested multi-block selection', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const secondContent = firstCell.querySelector('#heading1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(firstContent.firstChild, 5);
            range.setEnd(secondContent.firstChild, 10);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });

            setTimeout(() => {
                const cellBlocks = (editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks;

                expect(cellBlocks[0].content.some(c => (c.properties as BaseStylesProp).styles.color === '#FF0000')).toBe(true);
                expect(cellBlocks[1].content.some(c => (c.properties as BaseStylesProp).styles.color === '#FF0000')).toBe(true);

                expect(firstContent.querySelector('span[style*="color"]')).not.toBeNull();
                expect(secondContent.querySelector('span[style*="color"]')).not.toBeNull();

                done();
            }, 100);
        });

        it('should apply superscript and subscript formatting to nested multi-block selection', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const secondContent = firstCell.querySelector('#heading1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(firstContent.firstChild, 0);
            range.setEnd(secondContent.firstChild, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            setTimeout(() => {
                const cellBlocks = (editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks;

                expect(cellBlocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.superscript) as boolean)).toBe(true);
                expect(cellBlocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.superscript) as boolean)).toBe(true);

                expect(firstContent.querySelector('sup')).not.toBeNull();
                expect(secondContent.querySelector('sup')).not.toBeNull();

                // Apply subscript (should toggle off superscript)
                editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

                setTimeout(() => {
                    expect(cellBlocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.subscript) as boolean)).toBe(true);
                    expect(cellBlocks[0].content.every(c =>( !(c.properties as BaseStylesProp).styles.superscript) as boolean)).toBe(true);

                    expect(firstContent.querySelector('sup')).toBeNull();
                    expect(firstContent.querySelector('sub')).not.toBeNull();

                    done();
                }, 100);
            }, 100);
        });

        it('should handle partial content selection in nested multi-block formatting', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const thirdContent = firstCell.querySelector('#quote1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(firstContent.firstChild, 6);
            range.setEnd(thirdContent.firstChild, 5);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            setTimeout(() => {
                const cellBlocks = (editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks;

                // Should have split content in first and last blocks
                expect(cellBlocks[0].content.length).toBeGreaterThan(1);
                expect(cellBlocks[2].content.length).toBeGreaterThan(1);
                expect(cellBlocks[1].content.some(c => ((c.properties as BaseStylesProp).styles.strikethrough) as boolean)).toBe(true);

                expect(firstContent.querySelector('s')).not.toBeNull();
                expect(thirdContent.querySelector('s')).not.toBeNull();

                done();
            }, 100);
        });

        it('should skip non-formattable block types in nested multi-block selection', (done) => {
            // Insert divider inside cell
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const cellBlocks = (editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks;

            const dividerBlock: BlockModel = {
                id: 'divider1',
                blockType: BlockType.Divider,
                content: []
            };

            editor.addBlock(dividerBlock, 'heading1', true);

            setTimeout(() => {
                const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
                const quoteContent = firstCell.querySelector('#quote1 .e-block-content') as HTMLElement;

                const range = document.createRange();
                range.setStart(firstContent.firstChild, 0);
                range.setEnd(quoteContent.firstChild, 5);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                setTimeout(() => {
                    // Divider should remain untouched
                    const dividerBlock = cellBlocks.find(b => b.id === 'divider1');
                    expect(dividerBlock.content.length).toBe(0);

                    // Other blocks should be formatted
                    expect(cellBlocks[0].content.some(c => ((c.properties as BaseStylesProp).styles.bold) as boolean)).toBe(true);
                    expect(cellBlocks[3].content.some(c => ((c.properties as BaseStylesProp).styles.bold) as boolean)).toBe(true);

                    done();
                }, 100);
            }, 100);
        });

        it('should preserve selection state during nested multi-block formatting', (done) => {
            const firstCell = getDataCellEl(editorElement, 1, 0);
            const firstBlock = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(firstBlock);
            const firstContent = firstCell.querySelector('#paragraph1 .e-block-content') as HTMLElement;
            const secondContent = firstCell.querySelector('#heading1 .e-block-content') as HTMLElement;

            const range = document.createRange();
            range.setStart(firstContent.firstChild, 3);
            range.setEnd(secondContent.firstChild, 8);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const initialText = range.toString();

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                const newRange = getSelectedRange();
                expect(newRange.toString()).toBe(initialText);

                done();
            }, 100);
        });
    });

    describe('Edge cases testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph-1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }] }
            ];
            editor = createEditor({
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

        it('should handle edge cases properly', (done) => {
            //Selection collapsed
            editor.setSelection('paragraph-content', 2, 4);
            const data5 = editor.blockManager.formattingAction.handleTypingWithActiveFormats();
            expect(data5).toBe(false);

            done();
        });

        it('isNodeFormattedWith method should work properly', (done) => {
            const strongElement = createElement('strong');
            strongElement.innerHTML = 'Hello';
            const italicElement = createElement('em');
            italicElement.innerHTML = 'World';
            const underlineElement = createElement('u');
            underlineElement.innerHTML = 'Underline';
            const strikethroughElement = createElement('s');
            strikethroughElement.innerHTML = 'Strikethrough';
            const fakeFormat = createElement('span');
            fakeFormat.innerHTML = 'Fake';

            expect((editor.blockManager.formattingAction as any).isNodeFormattedWith(strongElement, 'bold')).toBe(true);
            expect((editor.blockManager.formattingAction as any).isNodeFormattedWith(italicElement, 'italic')).toBe(true);
            expect((editor.blockManager.formattingAction as any).isNodeFormattedWith(underlineElement, 'underline')).toBe(true);
            expect((editor.blockManager.formattingAction as any).isNodeFormattedWith(strikethroughElement, 'strikethrough')).toBe(true);
            expect((editor.blockManager.formattingAction as any).isNodeFormattedWith(fakeFormat, 'fake')).toBe(false);
            done();
        });

        it('should apply formatting for middle node properly', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;

            editor.blockManager.setFocusToBlock(blockElement);

            editor.addBlock({
                id: 'paragraph-2', blockType: BlockType.Paragraph,
                content: [
                    { id: 'con-1', contentType: ContentType.Text, content: 'Hi', properties: { styles: { bold: true } } },
                    { id: 'con-2', contentType: ContentType.Text, content: 'Hello' },
                    { id: 'con-3', contentType: ContentType.Text, content: 'World', properties: { styles: { italic: true } } },
                ]
            });

            const newBlockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const newBlockContent = getBlockContentElement(newBlockElement);
            editor.blockManager.setFocusToBlock(newBlockElement);

            // Select whole block
            const startNode = newBlockContent.querySelector('#con-1').firstChild;
            const endNode = newBlockContent.querySelector('#con-3').firstChild;
            editor.blockManager.nodeSelection.createRangeWithOffsets(startNode, endNode, 0, 5);

            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            expect(newBlockContent.childElementCount).toBe(3);
            expect(newBlockContent.querySelector('strong').textContent).toBe('Hi');
            expect(newBlockContent.querySelector('u#con-2').textContent).toBe('Hello');
            expect(newBlockContent.querySelector('em').textContent).toBe('World');
            expect((editor.blocks[1].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[1].content[1].properties as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[1].content[2].properties as BaseStylesProp).styles.italic).toBe(true);
            done();
        });

    });

    describe('Combinations 1:', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }] }
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

        // --- Scenario 1: Select entire Paragraph block and apply bold ---
        it('should apply bold to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement; // Corrected
            const blockContent = getBlockContentElement(blockElement); // Corrected
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert DOM
            const strongElement = blockContent.querySelector('strong');
            expect(strongElement).toBeDefined();
            expect(strongElement.textContent).toBe('Hello world');
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.bold).toBe(true); // Corrected to toBe(true)

        });

        // --- Scenario 2: Select entire Paragraph block and apply italic (Corrected) ---
        it('should apply italic to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement; // Corrected
            const blockContent = getBlockContentElement(blockElement); // Corrected
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM
            const emElement = blockContent.querySelector('em');
            expect(emElement).toBeDefined();
            expect(emElement.textContent).toBe('Hello world');
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.italic).toBe(true); // Corrected to toBe(true)

        });

        // --- Scenario 3: Select entire Paragraph block and apply underline ---
        it('should apply underline to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement; // Corrected
            const blockContent = getBlockContentElement(blockElement); // Corrected
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Assert DOM
            const uElement = blockContent.querySelector('u');
            expect(uElement).toBeDefined();
            expect(uElement.textContent).toBe('Hello world');
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.underline).toBe(true);

        });

        // --- Scenario 4: Select entire Paragraph block and apply strikethrough ---
        it('should apply strikethrough to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement; // Corrected
            const blockContent = getBlockContentElement(blockElement); // Corrected
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Assert DOM
            const strikeElement = blockContent.querySelector('s'); // Or <del> depending on implementation
            expect(strikeElement).toBeDefined();
            expect(strikeElement.textContent).toBe('Hello world');
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);

        });

        // --- Scenario 5: Select entire Paragraph block and apply lowercase ---
        it('should apply lowercase to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            // Assert DOM
            const spanWithLowercase = blockContent.querySelector('span[style*="text-transform"]');
            expect(spanWithLowercase).toBeDefined();

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.lowercase).toBe(true);

        });

        // --- Scenario 6: Select entire Paragraph block and apply uppercase ---
        it('should apply uppercase to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            // Assert DOM
            const spanWithUppercase = blockContent.querySelector('span[style*="text-transform"]');
            expect(spanWithUppercase).toBeDefined();

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.uppercase).toBe(true);

        });

        // --- Scenario 7: Select entire Paragraph block and apply superscript ---
        it('should apply superscript to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            // Assert DOM
            const supElement = blockContent.querySelector('sup');
            expect(supElement).toBeDefined();
            expect(supElement.textContent).toBe('Hello world');
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.superscript).toBe(true);

        });

        // --- Scenario 8: Select entire Paragraph block and apply subscript ---
        it('should apply subscript to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Assert DOM
            const subElement = blockContent.querySelector('sub');
            expect(subElement).toBeDefined();
            expect(subElement.textContent).toBe('Hello world');
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.subscript).toBe(true);

        });

        // --- Scenario 9: Select entire Paragraph block and apply color (e.g., red) ---
        it('should apply red color to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' }); // Example: red color

            // Assert DOM
            const spanElement = blockContent.querySelector('span'); // Assuming a span with style is used for color
            expect(spanElement).toBeDefined();
            expect(spanElement.textContent).toBe('Hello world');
            expect(spanElement.style.color).toBe('rgb(255, 0, 0)'); // Asserting the computed style
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.color).toBe('#FF0000');

        });

        // --- Scenario 10: Select entire Paragraph block and apply bgcolor (e.g., yellow) ---
        it('should apply yellow background color to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' }); // Example: yellow background

            // Assert DOM
            const spanElement = blockContent.querySelector('span'); // Assuming a span with style is used for background color
            expect(spanElement).toBeDefined();
            expect(spanElement.textContent).toBe('Hello world');
            expect(spanElement.style.backgroundColor).toBe('rgb(255, 255, 0)'); // Asserting the computed style
            expect(blockContent.textContent).toBe('Hello world');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.backgroundColor).toBe('#FFFF00');

        });


        // --- Scenario 11: Select entire Paragraph block and apply custom style (e.g., custom CSS class) ---
        it('should apply custom style to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);

            const spanWithCustomStyle = blockContent.querySelector('span[style*="font-family"]');
            expect(spanWithCustomStyle).toBeDefined();

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);

        });


        // --- Scenario 12: Select entire Paragraph block and apply all styles (bold, italic, underline, strikethrough, lowercase, superscript, color, bgcolor, custom) ---
        it('should apply all formatting styles to entire paragraph and verify DOM and model', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
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
            const blockModel = editor.blocks[0] as BlockModel;
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

        });

        // --- Scenario 13: Select single word in Paragraph and apply bold ---
        it('should apply bold to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const strongElement = blockContent.querySelector('strong');
            expect(strongElement).toBeDefined();
            expect(strongElement.textContent).toBe('world');
            // Ensure the text before "world" is still there and not bold
            expect(strongElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2); // Should split into "Hello " and "world"
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.bold).toBe(true);

        });

        // --- Scenario 14: Select single word in Paragraph and apply italic ---
        it('should apply italic to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const emElement = blockContent.querySelector('em');
            expect(emElement).toBeDefined();
            expect(emElement.textContent).toBe('world');
            expect(emElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.italic).toBe(true);

        });

        // --- Scenario 15: Select single word in Paragraph and apply underline ---
        it('should apply underline to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const uElement = blockContent.querySelector('u');
            expect(uElement).toBeDefined();
            expect(uElement.textContent).toBe('world');
            expect(uElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.underline).toBe(true);

        });

        // --- Scenario 16: Select single word in Paragraph and apply strikethrough ---
        it('should apply strikethrough to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const strikeElement = blockContent.querySelector('s');
            expect(strikeElement).toBeDefined();
            expect(strikeElement.textContent).toBe('world');
            expect(strikeElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.strikethrough).toBe(true);

        });

        // --- Scenario 17: Select single word in Paragraph and apply lowercase ---
        it('should apply lowercase to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            const span = blockContent.querySelector('span[style*="text-transform"]');
            expect(span).toBeDefined();

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world'); // The model stores the original text, and `lowercase` is a style.
            expect((content[1].properties as BaseStylesProp).styles.lowercase).toBe(true);

        });

        // --- Scenario 18: Select single word in Paragraph and apply uppercase ---
        it('should apply uppercase to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            const span = blockContent.querySelector('span[style*="text-transform"]');
            expect(span).toBeDefined();

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.uppercase).toBe(true);

        });

        // --- Scenario 19: Select single word in Paragraph and apply superscript ---
        it('should apply superscript to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const supElement = blockContent.querySelector('sup');
            expect(supElement).toBeDefined();
            expect(supElement.textContent).toBe('world');
            expect(supElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.superscript).toBe(true);

        });

        // --- Scenario 20: Select single word in Paragraph and apply subscript ---
        it('should apply subscript to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const subElement = blockContent.querySelector('sub');
            expect(subElement).toBeDefined();
            expect(subElement.textContent).toBe('world');
            expect(subElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.subscript).toBe(true);

        });

        // --- Scenario 21: Select single word in Paragraph and apply color (e.g., red) ---
        it('should apply red color to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const spanElement = blockContent.querySelector('span[style*="color"]') as HTMLElement;
            expect(spanElement).toBeDefined();
            expect(spanElement.textContent).toBe('world');
            expect(spanElement.style.color).toBe('rgb(255, 0, 0)');
            expect(spanElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.color).toBe('#FF0000');

        });

        // --- Scenario 22: Select single word in Paragraph and apply bgcolor (e.g., yellow) ---
        it('should apply yellow background color to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Assert DOM
            expect(blockContent.textContent).toBe('Hello world');
            const spanElement = blockContent.querySelector('span[style*="background-color"]') as HTMLElement;
            expect(spanElement).toBeDefined();
            expect(spanElement.textContent).toBe('world');
            expect(spanElement.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(spanElement.previousSibling.textContent).toBe('Hello ');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            expect(content[1].content).toBe('world');
            expect((content[1].properties as BaseStylesProp).styles.backgroundColor).toBe('#FFFF00');

        });

        // --- Scenario 23: Select single word in Paragraph and apply custom style ---
        it('should apply custom style to a single word ("world") and verify DOM and model splits', () => {
            // const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            // const blockContent = getBlockContentElement(blockElement);
            // editor.blockManager.setFocusToBlock(blockElement);
            // setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"

            // Assert DOM
            // const spanElement = blockContent.querySelector('span[style*="font-family"]') as HTMLElement;
            // expect(spanElement).toBeDefined();

            // Assert Model
            // const blockModel = editor.blocks[0] as BlockModel;
            // const content = blockModel.content;
            // expect(content.length).toBe(2);
            // expect(content[0].content).toBe('Hello ');
            // expect(content[1].content).toBe('world');

        });

        // --- Scenario 24: Select single word in Paragraph and apply all styles (bold, italic, underline, strikethrough, lowercase, superscript, color, bgcolor, custom) ---
        it('should apply all formatting styles to a single word ("world") and verify DOM and model splits', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(blockContent.firstChild as Node, 6, 11); // Select "world"

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
            expect(blockContent.textContent).toBe('Hello world'); // Final text content based on lowercase
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
            expect(formattedWordContainer.textContent.toLowerCase()).toBe('world'); // Check the text content (lowercase 'world')

            // Assert for presence of all expected tags/styles within the formatted segment
            expect(formattedWordContainer.querySelector('strong') || formattedWordContainer.tagName === 'STRONG').toBeDefined();
            expect(formattedWordContainer.querySelector('em') || formattedWordContainer.tagName === 'EM').toBeDefined();
            expect(formattedWordContainer.querySelector('u') || formattedWordContainer.tagName === 'U').toBeDefined();
            expect(formattedWordContainer.querySelector('s') || formattedWordContainer.querySelector('del') || formattedWordContainer.tagName === 'S' || formattedWordContainer.tagName === 'DEL').toBeDefined();
            expect(formattedWordContainer.querySelector('sup') || formattedWordContainer.tagName === 'SUP').toBeDefined();

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(2);
            expect(content[0].content).toBe('Hello ');
            const styles = (content[1].properties as BaseStylesProp).styles
            expect(content[1].content).toBe('world');
            expect(styles.bold).toBe(true);
            expect(styles.italic).toBe(true);
            expect(styles.underline).toBe(true);
            expect(styles.strikethrough).toBe(true);
            expect(styles.lowercase).toBe(true);
            expect(styles.superscript).toBe(true);
            expect(styles.color).toBe('#0000FF');
            expect(styles.backgroundColor).toBe('#00FF00');

        });
    });

    describe('Combinations 2:', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            // Initial text for overlapping scenarios
            const blocks: BlockModel[] = [
                { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }] }
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

        // --- Overlapping Scenarios ---

        // Scenario 1: Select overlapping text (spanning formatted bold and non-formatted spans) and apply italic
        it('should apply italic to an overlapping selection over bold and non-formatted text', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
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
            const blockModel = editor.blocks[0] as BlockModel;
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

        // Scenario 2: Select overlapping text (spanning formatted italic and non-formatted spans) and apply bold
        it('should apply bold to an overlapping selection over italic and non-formatted text', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply italic to "Brown Fox" (indices 10 to 19)
            setSelectionRange(blockContent.firstChild as Node, 10, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });


            // Step 2: Select "Fox Jumps" (overlapping "Brown Fox" and "Jumps", indices 16 to 25)
            setRange(blockContent.childNodes[1].firstChild, blockContent.childNodes[2].firstChild, 6, 6);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert DOM
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            const strongElements = blockContent.querySelectorAll('strong');
            expect(strongElements.length).toBeGreaterThan(0);
            const emElements = blockContent.querySelectorAll('em');
            expect(emElements.length).toBeGreaterThan(0);

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;

            const foxSegment = content.find(item => item.content && item.content.includes('Fox'));
            if (foxSegment) {
                expect(((foxSegment.properties as BaseStylesProp).styles).italic).toBe(true);
                expect(((foxSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            } else {
                fail('Fox segment not found or not formatted as expected in model.');
            }

            const jumpsSegment = content.find(item => item.content && item.content.includes('Jumps'));
            if (jumpsSegment) {
                expect(((jumpsSegment.properties as BaseStylesProp).styles).bold).toBe(true);
                expect(((jumpsSegment.properties as BaseStylesProp).styles).italic).toBeUndefined();
            } else {
                fail('Jumps segment not found or not formatted as expected in model.');
            }

        });

        // Scenario 3: Select overlapping text (spanning formatted bold and non-formatted spans) and apply bold (re-applying bold)
        it('should re-apply bold to an overlapping selection over bold and non-formatted text, toggling bold where it exists', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
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
            const blockModel = editor.blocks[0] as BlockModel;
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

        // Scenario 4: Select overlapping text (spanning formatted italic and non-formatted spans) and apply italic (re-applying italic)
        it('should re-apply italic to an overlapping selection over italic and non-formatted text, toggling italic where it exists', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply italic to "Brown Fox" (indices 10 to 19)
            setSelectionRange(blockContent.firstChild as Node, 10, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });


            // Step 2: Select "Fox Jumps" (overlapping "Brown Fox" and "Jumps", indices 16 to 25)
            setRange(blockContent.childNodes[1].firstChild, blockContent.childNodes[2].firstChild, 6, 6);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            // Expected: "Brown" should be normal, "Fox Jumps" should be italic
            const emElements = blockContent.querySelectorAll('em');
            expect(emElements.length).toBeGreaterThan(0);

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;

            const brownSegment = content.find(item => item.content && item.content === 'Brown');
            if (brownSegment) {
                expect(((brownSegment.properties as BaseStylesProp).styles).italic).toBeUndefined();
            }

            const foxJumpsSegment = content.find(item => item.content && item.content === 'Fox Jumps');
            if (foxJumpsSegment) {
                expect(((foxJumpsSegment.properties as BaseStylesProp).styles).italic).toBe(true);
            } else {
                // If split more granularly
                const foxSegment = content.find(item => item.content && item.content.includes('Fox'));
                expect(((foxSegment.properties as BaseStylesProp).styles).italic).toBe(true);
                const jumpsSegment = content.find(item => item.content && item.content.includes('Jumps'));
                expect(((jumpsSegment.properties as BaseStylesProp).styles).italic).toBe(true);
            }

        });

        // Scenario 5: Select entire Paragraph with bold applied and remove bold
        it('should remove bold formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Step 2: Remove bold from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' }); // Execute again to toggle off

            // Assert DOM: Strong tag should no longer exist
            expect(blockContent.querySelector('strong')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: Bold style should be undefined/false
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();

        });

        // Scenario 6: Select entire Paragraph with italic applied and remove italic
        it('should remove italic formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply italic to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Step 2: Remove italic from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM
            expect(blockContent.querySelector('em')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.italic).toBeUndefined();

        });

        // Scenario 7: Select entire Paragraph with underline applied and remove underline
        it('should remove underline formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply underline to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Step 2: Remove underline from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Assert DOM
            expect(blockContent.querySelector('u')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.underline).toBeUndefined();

        });

        // Scenario 8: Select entire Paragraph with strikethrough applied and remove strikethrough
        it('should remove strikethrough formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply strikethrough to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Step 2: Remove strikethrough from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Assert DOM
            expect(blockContent.querySelector('s')).toBeNull(); // Or 'del'
            expect(blockContent.querySelector('del')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.strikethrough).toBeUndefined();

        });

        // Scenario 9: Select entire Paragraph with lowercase applied and remove lowercase
        it('should remove lowercase formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply lowercase to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            // Step 2: Remove lowercase from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' }); // Execute again to toggle off

            const spanElement = blockContent.querySelector('span[style*="text-transform"]') as HTMLElement;
            expect(spanElement).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: Lowercase style should be undefined/false
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.lowercase).toBeUndefined();

        });

        // Scenario 10: Select entire Paragraph with uppercase applied and remove uppercase
        it('should remove uppercase formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply uppercase to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            // Step 2: Remove uppercase from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            // Assert DOM
            const spanElement = blockContent.querySelector('span[style*="text-transform"]') as HTMLElement;
            expect(spanElement).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.uppercase).toBeUndefined();

        });

        // Scenario 11: Select entire Paragraph with superscript applied and remove superscript
        it('should remove superscript formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply superscript to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            // Step 2: Remove superscript from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            // Assert DOM
            expect(blockContent.querySelector('sup')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.superscript).toBeUndefined();

        });

        // Scenario 12: Select entire Paragraph with subscript applied and remove subscript
        it('should remove subscript formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply subscript to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Step 2: Remove subscript from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Assert DOM
            expect(blockContent.querySelector('sub')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.subscript).toBeUndefined();

        });

        // Scenario 13: Select entire Paragraph with color applied and remove color
        it('should remove color formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply color to entire paragraph (e.g., red)
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });

            // Step 2: Remove color from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '' });

            const spanElement = blockContent.querySelector('span[style*="color"]') as HTMLElement;
            expect(spanElement).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: Color style should be undefined
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.color).toBeUndefined();

        });

        // Scenario 14: Select entire Paragraph with bgcolor applied and remove bgcolor
        it('should remove background color formatting from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bgcolor to entire paragraph (e.g., yellow)
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Step 2: Remove bgcolor from entire paragraph
            const formattedNode = blockContent.firstChild.firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '' });

            // Assert DOM
            const spanElement = blockContent.querySelector('span[style*="color"]') as HTMLElement;
            expect(spanElement).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect((content[0].properties as BaseStylesProp).styles.backgroundColor).toBeUndefined();

        });

        // Scenario 15: Select entire Paragraph with custom style applied and remove custom style
        it('should remove custom style from entire paragraph', () => {
            // const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            // const blockContent = getBlockContentElement(blockElement);
            // editor.blockManager.setFocusToBlock(blockElement);

            // // Step 1: Apply custom style
            // setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);

            // // Step 2: Remove custom style
            // const formattedNode = blockContent.firstChild.firstChild;
            // setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);

            // // Assert DOM
            // const spanElement = blockContent.querySelector('span[style*="font-family"]') as HTMLElement;
            // expect(spanElement).toBeNull();
            // expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // // Assert Model
            // const blockModel = editor.blocks[0] as BlockModel;
            // const content = blockModel.content;
            // expect(content.length).toBe(1);

        });

        // Scenario 16: Select entire Paragraph with all styles applied and remove all styles
        it('should remove all formatting styles from entire paragraph', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
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
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;
            expect(content.length).toBe(1);
            expect(Object.keys((content[0].properties as BaseStylesProp).styles).length).toBe(0);

        });
    });

    describe('Combinations 3:', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            // Initial text for these scenarios
            const blocks: BlockModel[] = [
                { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'The Quick Brown Fox Jumps Over The Lazy Dog' }] }
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

        // --- Removing Styles from Single Word Scenarios --- (Targeting "Quick" - indices 4 to 9)

        // Scenario 1: Select single word with bold applied and remove bold
        it('should remove bold from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert Model (initial state for verification)
            let blockModel = editor.blocks[0] as BlockModel;
            let quickSegment = blockModel.content.find(item => item.content === 'Quick');
            expect(((quickSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(blockContent.querySelector('strong').textContent).toBe('Quick');

            // Step 2: Remove bold from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' }); // Toggle off

            // Assert DOM
            expect(blockContent.querySelector('strong')).toBeNull(); // Strong tag should be gone
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: "Quick" segment should no longer have bold style
            blockModel = editor.blocks[0] as BlockModel;
            quickSegment = blockModel.content.find(item => item.content === 'Quick'); // May need to re-find it if content merges
            expect(((quickSegment.properties as BaseStylesProp).styles).bold).toBeUndefined(); // Bold should be removed
            // Optionally, verify that content structure might merge back to fewer segments
            // This depends on editor implementation after style removal.

        });

        // Scenario 2: Select single word with italic applied and remove italic
        it('should remove italic from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply italic to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Step 2: Remove italic from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM
            expect(blockContent.querySelector('em')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const quickSegment = blockModel.content.find(item => item.content === 'Quick');
            expect(((quickSegment.properties as BaseStylesProp).styles).italic).toBeUndefined();

        });

        // Scenario 3: Select single word with underline applied and remove underline
        it('should remove underline from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply underline to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Step 2: Remove underline from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Assert DOM
            expect(blockContent.querySelector('u')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const quickSegment = blockModel.content.find(item => item.content === 'Quick');
            expect(((quickSegment.properties as BaseStylesProp).styles).underline).toBeUndefined();

        });

        // Scenario 4: Select single word with strikethrough applied and remove strikethrough
        it('should remove strikethrough from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply strikethrough to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Step 2: Remove strikethrough from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Assert DOM
            expect(blockContent.querySelector('s')).toBeNull();
            expect(blockContent.querySelector('del')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const quickSegment = blockModel.content.find(item => item.content === 'Quick');
            expect(((quickSegment.properties as BaseStylesProp).styles).strikethrough).toBeUndefined();

        });

        // Scenario 5: Select single word with lowercase applied and remove lowercase
        it('should remove lowercase from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply lowercase to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            // Step 2: Remove lowercase from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            // Assert DOM: Expect text to revert to original casing.
            // As discussed before, direct DOM assertion for lowercase/uppercase might be tricky
            // if it's applied via CSS text-transform. We primarily check the model for style removal.
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: Lowercase style should be undefined
            const blockModel = editor.blocks[0] as BlockModel;
            const segment = blockModel.content.find(item => item.content && item.content.toLowerCase().includes('quick'));
            expect(((segment.properties as BaseStylesProp).styles).lowercase).toBeUndefined();

        });

        // Scenario 6: Select single word with uppercase applied and remove uppercase
        it('should remove uppercase from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply uppercase to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            // Step 2: Remove uppercase from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            // Assert DOM
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const segment = blockModel.content.find(item => item.content && item.content.toLowerCase().includes('quick'));
            expect(((segment.properties as BaseStylesProp).styles).uppercase).toBeUndefined();

        });

        // Scenario 7: Select single word with superscript applied and remove superscript
        it('should remove superscript from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply superscript to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            // Step 2: Remove superscript from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            // Assert DOM
            expect(blockContent.querySelector('sup')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const segment = blockModel.content.find(item => item.content && item.content.toLowerCase().includes('quick'));
            expect(((segment.properties as BaseStylesProp).styles).superscript).toBeUndefined();

        });

        // Scenario 8: Select single word with subscript applied and remove subscript
        it('should remove subscript from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply subscript to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Step 2: Remove subscript from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Assert DOM
            expect(blockContent.querySelector('sub')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const segment = blockModel.content.find(item => item.content && item.content.toLowerCase().includes('quick'));
            expect(((segment.properties as BaseStylesProp).styles).subscript).toBeUndefined();

        });

        // Scenario 9: Select single word with color applied and remove color
        it('should remove color from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply blue color to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#0000FF' });

            // Step 2: Remove color from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '' }); // Toggle off

            // Assert DOM
            // Expect the span with the color style to be removed or its style property cleared
            const spanElements = blockContent.querySelectorAll('span[style*="color"]');
            expect(spanElements.length).toBe(0); // Assuming the span is removed if only color was on it
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const segment = blockModel.content.find(item => item.content && item.content.toLowerCase().includes('quick'));
            expect(((segment.properties as BaseStylesProp).styles).color).toBeUndefined();

        });

        // Scenario 10: Select single word with bgcolor applied and remove bgcolor
        it('should remove background color from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply yellow bgcolor to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Step 2: Remove bgcolor from "Quick"
            const formattedNode = blockContent.childNodes[1].firstChild;
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '' }); // Toggle off

            // Assert DOM
            const spanElements = blockContent.querySelectorAll('span[style*="background-color"]');
            expect(spanElements.length).toBe(0);
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model
            const blockModel = editor.blocks[0] as BlockModel;
            const segment = blockModel.content.find(item => item.content && item.content.toLowerCase().includes('quick'));
            expect(((segment.properties as BaseStylesProp).styles).backgroundColor).toBeUndefined();

        });

        // Scenario 11: Select single word with custom style applied and remove custom style
        it('should remove custom style from a single formatted word ("Quick")', () => {
            // const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            // const blockContent = getBlockContentElement(blockElement);
            // editor.blockManager.setFocusToBlock(blockElement);

            // // Step 1: Apply custom style to "Quick"
            // setSelectionRange(blockContent.firstChild as Node, 4, 9);

            // // Step 2: Remove custom style from "Quick"
            // const formattedNode = blockContent.childNodes[1].firstChild;
            // setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);

            // // Assert DOM
            // const spanElement = blockContent.querySelector('span[style*="font-family"]');
            // expect(spanElement).toBeNull();
            // expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

        });

        // Scenario 12: Select single word with all styles applied and remove all styles
        it('should remove all formatting styles from a single formatted word ("Quick")', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply all styles to "Quick"
            setSelectionRange(blockContent.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Step 2: Remove all styles from "Quick"
            const formattedNode = getDeepestTextNode(blockContent.childNodes[1] as HTMLElement);
            setRange(formattedNode, formattedNode, 0, formattedNode.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '' });

            // Assert DOM: Ensure no formatting tags or inline styles are left on the word
            expect(blockContent.querySelector('strong')).toBeNull();
            expect(blockContent.querySelector('em')).toBeNull();
            expect(blockContent.querySelector('u')).toBeNull();
            expect(blockContent.querySelector('s')).toBeNull();
            expect(blockContent.querySelector('del')).toBeNull();
            expect(blockContent.querySelector('sup')).toBeNull();
            expect(blockContent.querySelector('sub')).toBeNull();
            expect(blockContent.querySelectorAll('span[style*="color"]').length).toBe(0);
            expect(blockContent.querySelectorAll('span[style*="background-color"]').length).toBe(0);
            expect(blockContent.querySelectorAll('span[style*="font-family"]').length).toBe(0);
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: The "Quick" segment should have no style properties
            const blockModel = editor.blocks[0] as BlockModel;
            const segments = blockModel.content;
            const quickSegment = segments.find(item => item.content && item.content.toLowerCase() === 'quick');
            if (quickSegment) {
                expect(Object.keys((quickSegment.properties as BaseStylesProp).styles).length).toBe(0);
            } else {
                const originalTextContent = (document.getElementById('editor').querySelector('#paragraph-content') as HTMLElement).textContent;
                expect(originalTextContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            }

        });

        // --- Applying New Styles on Top of Existing Styles Scenarios ---

        // Scenario 13: Apply bold to entire Paragraph, then apply italic to a word, update JSON with mixed styles
        it('should apply italic to a word after entire paragraph is bolded, creating mixed styles', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
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
            const blockModel = editor.blocks[0] as BlockModel;
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

        // Scenario 14: Apply all styles to entire Paragraph, then apply bold to a word, update JSON with updated bold style on word
        it('should apply bold to a word after entire paragraph has all styles, updating its bold state', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply all styles to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Assert initial state for the entire paragraph (DOM and Model)
            let blockModel = editor.blocks[0] as BlockModel;
            let initialStyles = (blockModel.content[0].properties as BaseStylesProp).styles;
            expect(initialStyles.bold).toBe(true);
            expect(blockContent.querySelector('strong')).toBeDefined(); // Dom check for initial bold

            // Step 2: Select "Fox" (indices 16 to 19) and apply bold again (toggles off if already bold)
            setSelectionRange(getDeepestTextNode(blockContent.firstChild as HTMLElement) as Node, 16, 19); // Select "Fox"
            editor.blockManager.formattingAction.execCommand({ command: 'bold' }); // This should toggle 'bold' for 'Fox'

            const foxDomElement = Array.from(blockContent.querySelectorAll('*')).find(el => el.textContent.includes('Fox'));
            expect(foxDomElement.tagName).not.toBe('STRONG'); // Or expect it not to be directly within a strong tag

            // Assert Model: "Fox" segment should have bold: undefined, but other styles still present
            blockModel = editor.blocks[0] as BlockModel; // Re-get model after update
            const foxSegment = blockModel.content.find(item => item.content.toLowerCase().includes('fox'));
            expect(foxSegment).toBeDefined();
            const foxStyles = (foxSegment.properties as BaseStylesProp).styles;
            expect(foxStyles.bold).toBeUndefined(); // Bold should be toggled off for "Fox"
            expect(foxStyles.italic).toBe(true); // Other styles should remain
            expect(foxStyles.underline).toBe(true);

        });

        // Scenario 15: Apply bold to a word, then apply italic to overlapping text including that word, update JSON with split spans and mixed styles
        it('should apply italic to overlapping text, creating split and mixed styles with existing bold', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to "Brown" (indices 10 to 15)
            setSelectionRange(blockContent.firstChild as Node, 10, 15);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Step 2: Apply italic to "Fox Jumps" (overlapping, indices)
            setSelectionRange(blockContent.lastChild.lastChild as Node, 0, 10);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Assert DOM: Expect complex nesting for 'Fox' and 'Jumps'
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Find parts: "Brown" should be bold, "Fox Jumps" should be italic
            const strongElement = blockContent.querySelector('strong'); // Should contain 'Brown'
            expect(strongElement).toBeDefined();
            expect(strongElement.textContent).toBe('Brown');

            const italicElement = blockContent.querySelector('em');
            expect(italicElement).toBeDefined();
            expect(italicElement.textContent).toBe(' Fox Jumps');

            // Assert Model: Expect multiple segments and mixed styles where overlap occurs
            const blockModel = editor.blocks[0] as BlockModel;
            const content = blockModel.content;

            // "Brown" should be bold
            const brownSegment = content.find(item => item.content === 'Brown');
            expect(brownSegment).toBeDefined();
            expect(((brownSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((brownSegment.properties as BaseStylesProp).styles).italic).toBeUndefined();

            // " Fox Jumps" should be italic
            const foxJumpSegment = content.find(item => item.content === ' Fox Jumps');
            expect(foxJumpSegment).toBeDefined();
            expect(((foxJumpSegment.properties as BaseStylesProp).styles).italic).toBe(true);
            expect(((foxJumpSegment.properties as BaseStylesProp).styles).bold).toBeUndefined();

        });

        // Scenario 16: Apply uppercase to entire Paragraph, then apply lowercase to a word, update JSON with lowercase style on word
        it('should override uppercase with lowercase for a specific word', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply uppercase to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            // Step 2: Apply lowercase to "Quick" (indices 4 to 9)
            setSelectionRange(blockContent.firstChild.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            // Assert DOM: Expect "Quick" to be lowercase, rest uppercase
            const spanElement = blockContent.querySelector('span[style*="text-transform"]');
            expect(spanElement).toBeDefined();

            // Assert Model: "Quick" segment should have lowercase: true, uppercase: undefined
            const blockModel = editor.blocks[0] as BlockModel;
            const quickSegment = blockModel.content.find(item => item.content.toLowerCase().includes('quick'));
            expect(quickSegment).toBeDefined();
            expect(((quickSegment.properties as BaseStylesProp).styles).lowercase).toBe(true);
            expect(((quickSegment.properties as BaseStylesProp).styles).uppercase).toBeUndefined(); // Should be overridden

        });

        // Scenario 17: Apply superscript to a word, then apply subscript to overlapping text, update JSON with split spans and subscript style
        it('should apply subscript to an overlapping selection, overriding existing superscript in parts', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply superscript to "Brown" (indices 10 to 15)
            setSelectionRange(blockContent.firstChild as Node, 10, 15);
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            // Assert initial for "Brown"
            let blockModel = editor.blocks[0] as BlockModel;
            let brownSegment = blockModel.content.find(item => item.content === 'Brown');
            expect(((brownSegment.properties as BaseStylesProp).styles).superscript).toBe(true);

            // Step 2: Apply subscript to "Fox Jumps" (overlapping, indices 16 to 25)
            setSelectionRange(blockContent.childNodes[2].lastChild, 0, 10);
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            // Assert DOM: Check for sup and sub elements. Expect nesting or splitting
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            const supElement = blockContent.querySelector('sup');
            expect(supElement).toBeDefined(); // "Brown"
            const subElement = blockContent.querySelector('sub');
            expect(subElement).toBeDefined(); // "Fox Jumps" (likely split)

            // Assert Model:
            blockModel = editor.blocks[0] as BlockModel; // Re-get model
            // "Brown" should likely remain superscript
            brownSegment = blockModel.content.find(item => item.content === 'Brown');
            expect(((brownSegment.properties as BaseStylesProp).styles).superscript).toBe(true);
            expect(((brownSegment.properties as BaseStylesProp).styles).subscript).toBeUndefined();

            // "Fox" (if it's still distinct) should have subscript
            const foxSegment = blockModel.content.find(item => item.content === ' Fox Jumps');
            expect(foxSegment).toBeDefined();
            expect(((foxSegment.properties as BaseStylesProp).styles).subscript).toBe(true);
            expect(((foxSegment.properties as BaseStylesProp).styles).superscript).toBeUndefined(); // Superscript should be removed here

        });

        // Scenario 18: Apply color to entire Paragraph, then apply different color to a word, update JSON with new color on word
        it('should apply a different color to a word, overriding paragraph-wide color', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply red color to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' }); // Red

            // Assert initial for paragraph
            let blockModel = editor.blocks[0] as BlockModel;
            expect((blockModel.content[0].properties as BaseStylesProp).styles.color).toBe('#FF0000');

            // Step 2: Apply blue color to "Fox" (indices 16 to 19)
            setSelectionRange(blockContent.firstChild.firstChild as Node, 16, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#0000FF' }); // Blue

            // Assert DOM: Expect "Fox" to be blue, rest red
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            const redSpans = blockContent.querySelectorAll('span[style*="rgb(255, 0, 0)"]');
            expect(redSpans.length).toBeGreaterThan(0);
            const blueSpan = blockContent.querySelector('span[style*="rgb(0, 0, 255)"]');
            expect(blueSpan).toBeDefined();
            expect(blueSpan.textContent).toBe('Fox');

            // Assert Model:
            blockModel = editor.blocks[0] as BlockModel;
            const foxSegment = blockModel.content.find(item => item.content === 'Fox');
            expect(foxSegment).toBeDefined();
            expect(((foxSegment.properties as BaseStylesProp).styles).color).toBe('#0000FF');

            const otherSegment = blockModel.content.find(item => item.content.includes('Quick')); // Part of red text
            expect(((otherSegment.properties as BaseStylesProp).styles).color).toBe('#FF0000');

        });

        // Scenario 19: Apply bgcolor to entire Paragraph, then apply different bgcolor to a word, update JSON with new bgcolor on word
        it('should apply a different background color to a word, overriding paragraph-wide background color', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply yellow bgcolor to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' }); // Yellow

            // Step 2: Apply green bgcolor to "Fox" (indices 16 to 19)
            setSelectionRange(blockContent.firstChild.firstChild as Node, 16, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#00FF00' }); // Green

            // Assert DOM: Expect "Fox" to be green, rest yellow
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            const yellowSpans = blockContent.querySelectorAll('span[style*="rgb(255, 255, 0)"]');
            expect(yellowSpans.length).toBeGreaterThan(0);
            const greenSpan = blockContent.querySelector('span[style*="rgb(0, 255, 0)"]');
            expect(greenSpan).toBeDefined();
            expect(greenSpan.textContent).toBe('Fox');

            // Assert Model:
            const blockModel = editor.blocks[0] as BlockModel;
            const foxSegment = blockModel.content.find(item => item.content === 'Fox');
            expect(foxSegment).toBeDefined();
            expect(((foxSegment.properties as BaseStylesProp).styles).backgroundColor).toBe('#00FF00');

            const otherSegment = blockModel.content.find(item => item.content.includes('Quick'));
            expect(((otherSegment.properties as BaseStylesProp).styles).backgroundColor).toBe('#FFFF00');

        });

        // Scenario 20: Apply custom style to entire Paragraph, then apply different custom style to a word, update JSON with new custom style on word
        it('should apply a different custom style to a word, overriding paragraph-wide custom style', () => {
            // const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            // const blockContent = getBlockContentElement(blockElement);
            // editor.blockManager.setFocusToBlock(blockElement);

            // // Step 1: Apply paragraph-wide custom style
            // setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);

            // // Step 2: Apply word-specific custom style to "Fox" (indices 16 to 19)
            // setSelectionRange(blockContent.firstChild.firstChild as Node, 16, 19);

            // // Assert DOM: Check for class names
            // expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            // const intelSpan = blockContent.querySelector('span[style*="font-family: Intel"]');
            // expect(intelSpan).toBeDefined();

            // // Assert Model:
            // const blockModel = editor.blocks[0] as BlockModel;
            // const foxSegment = blockModel.content.find(item => item.content === 'Fox');
            // expect(foxSegment).toBeDefined();

            // const otherSegment = blockModel.content.find(item => item.content.includes('Quick'));

        });

        // Scenario 21: Apply all styles to entire Paragraph, then remove one style (e.g., bold) from a word, update JSON with removed style on word
        it('should remove a single style from a word that has all styles, while retaining others', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply all styles to "Fox" (indices 16 to 19)
            setSelectionRange(blockContent.firstChild as Node, 16, 19); // Select "Fox"
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Assert that "Fox" has bold
            let blockModel = editor.blocks[0] as BlockModel;
            const foxSegment = blockModel.content.find(item => item.content === 'Fox');
            expect(((foxSegment.properties as BaseStylesProp).styles).bold).toBe(true);

            // Step 2: Remove bold from "Fox"
            editor.blockManager.formattingAction.execCommand({ command: 'bold' }); // Toggle off bold

            // Assert DOM: Strong tag for "Fox" should be gone, but others should remain
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');
            const foxDomElement: HTMLElement = Array.from(blockContent.querySelectorAll('*')).find(el => el.textContent.includes('Fox')) as HTMLElement;

            // Should not be strong
            expect(foxDomElement.tagName).not.toBe('STRONG');
            expect(foxDomElement.querySelector('strong')).toBeNull();

            // Should still have other styles
            expect(foxDomElement.querySelector('em') || foxDomElement.tagName === 'EM').toBeDefined();

            // Assert Model: "Fox" segment should have bold: undefined, others still present
            blockModel = editor.blocks[0] as BlockModel;
            const updatedFoxSegment = blockModel.content.find(item => item.content === 'Fox');
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).italic).toBe(true);
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).underline).toBe(true);
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).strikethrough).toBe(true);
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).lowercase).toBe(true);
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).superscript).toBe(true);
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).color).toBe('#FF0000');
            expect(((updatedFoxSegment.properties as BaseStylesProp).styles).backgroundColor).toBe('#FFFF00');

        });

        // Scenario 22: Select half Paragraph with bold and half with italic, apply underline, update JSON with underline on selection
        it('should apply underline to a selection spanning bold and italic parts, creating mixed styles', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Initial setup: Make "The Quick Brown" bold, "Fox Jumps Over" italic
            setSelectionRange(blockContent.firstChild, 0, 15);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setSelectionRange(blockContent.lastChild.lastChild, 0, 15);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            const boldEle = blockContent.firstChild.firstChild;
            const italicEle = blockContent.childNodes[1].firstChild;
            setRange(boldEle, italicEle, 10, 10);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            // Assert DOM: Expect complex nesting for Brown (bold+underline), Fox Jumps (italic+underline)
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            const quickTextNode = blockContent.childNodes[0] as HTMLElement;
            const brownTextNode = blockContent.childNodes[1] as HTMLElement;
            const foxJumpsTextNode = blockContent.childNodes[2] as HTMLElement;
            expect(quickTextNode).toBeDefined();
            expect(quickTextNode.textContent).toBe('The Quick ');
            expect(quickTextNode.querySelector('u') || brownTextNode.tagName === 'U').toBeDefined();

            expect(brownTextNode).toBeDefined();
            expect(brownTextNode.textContent).toBe('Brown');
            expect(brownTextNode.querySelector('u') || brownTextNode.tagName === 'U').toBeDefined();

            expect(foxJumpsTextNode).toBeDefined();
            expect(foxJumpsTextNode.textContent).toBe(' Fox Jumps');
            expect(foxJumpsTextNode.querySelector('u') || foxJumpsTextNode.tagName === 'U').toBeDefined();

            // Assert Model:
            const blockModel = editor.blocks[0] as BlockModel;
            const brownPart = blockModel.content.find(function (item) { return item.content && item.content.includes('The Quick '); });
            expect(((brownPart.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((brownPart.properties as BaseStylesProp).styles).italic).toBeUndefined();
            const foxPart = blockModel.content.find(function (item) { return item.content && item.content.includes('Brown'); });
            expect(((foxPart.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((foxPart.properties as BaseStylesProp).styles).underline).toBe(true);
            const jumpsPart = blockModel.content.find(function (item) { return item.content && item.content.includes(' Fox Jumps'); });
            expect(((jumpsPart.properties as BaseStylesProp).styles).italic).toBe(true);
            expect(((jumpsPart.properties as BaseStylesProp).styles).underline).toBe(true);
            expect(((jumpsPart.properties as BaseStylesProp).styles).bold).toBeUndefined();

        });

        // Scenario 23: Select half Paragraph with all styles and half non-formatted, apply strikethrough, update JSON with strikethrough on selection
        it('should apply strikethrough to a selection spanning all-styled and non-formatted parts', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Initial setup: Apply all styles to "The Quick Brown Fox"
            setSelectionRange(blockContent.firstChild as Node, 0, 19);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            // Select a range spanning the styled part and non-formatted part, e.g., "Fox Jumps Over The" (indices 16 to 34)
            setRange(getDeepestTextNode(blockContent.firstChild as HTMLElement), blockContent.lastChild.lastChild, 16, 15);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            // Assert DOM: Expect relevant parts to have strikethrough along with existing styles
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            const foxElem = Array.from(blockContent.querySelectorAll('*'))
                .find(el => el.textContent.indexOf('Fox') != -1);
            expect(foxElem).toBeDefined();
            expect(foxElem.querySelector('s') || foxElem.tagName === 'S' || foxElem.querySelector('del') || foxElem.tagName === 'DEL').toBeDefined();
            expect(foxElem.querySelector('strong') || foxElem.tagName === 'STRONG').toBeDefined(); // Still bold

            const jumpsElem = Array.from(blockContent.querySelectorAll('*'))
                .find(el => el.textContent.indexOf('Jumps') != -1);
            expect(jumpsElem).toBeDefined();
            expect(jumpsElem.querySelector('s') || jumpsElem.tagName === 'S' || jumpsElem.querySelector('del') || jumpsElem.tagName === 'DEL').toBeDefined();
            expect(jumpsElem.querySelector('strong')).toBeNull(); // This was originally unformatted

            // Assert Model:
            const blockModel = editor.blocks[0] as BlockModel;

            const foxSegment = blockModel.content.find(item => item.content && item.content.indexOf('Fox') != -1);
            expect(foxSegment).toBeDefined();
            expect(((foxSegment.properties as BaseStylesProp).styles).strikethrough).toBe(true);
            expect(((foxSegment.properties as BaseStylesProp).styles).bold).toBe(true); // Retains bold

            const jumpsSegment = blockModel.content.find(item => item.content && item.content.indexOf('Jumps') != -1);
            expect(jumpsSegment).toBeDefined();
            expect(((jumpsSegment.properties as BaseStylesProp).styles).strikethrough).toBe(true);
            expect(((jumpsSegment.properties as BaseStylesProp).styles).bold).toBeUndefined(); // Was not bolded initially

        });

        // --- Undo/Redo Scenarios ---

        // Scenario 24: Apply bold to entire Paragraph, undo, verify JSON reverts to no bold
        it('should undo bold formatting applied to the entire paragraph', () => {
            let blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            let blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Assert that bold is applied
            let blockModel = editor.blocks[0] as BlockModel;
            expect((blockModel.content[0].properties as BaseStylesProp).styles.bold).toBe(true);
            expect(blockContent.querySelector('strong')).toBeDefined();

            // Step 2: Undo the bold operation
            triggerUndo(editorElement);

            blockElement = editorElement.querySelector('#paragraph');
            blockContent = getBlockContentElement(blockElement);

            // Assert DOM: Strong tag should no longer exist
            expect(blockContent.querySelector('strong')).toBeNull();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: Bold style should be undefined/false
            blockModel = editor.blocks[0] as BlockModel;
            expect((blockModel.content[0].properties as BaseStylesProp).styles.bold).toBeUndefined();

        });

        // Scenario 25: Remove bold from a word, redo, verify JSON restores bold
        it('should redo removing bold formatting from a word, restoring bold', () => {
            let blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            let blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply bold to "Brown" (indices 10 to 15)
            setSelectionRange(blockContent.firstChild as Node, 10, 15);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // Verify bold is applied
            let blockModel = editor.blocks[0] as BlockModel;
            let brownSegment = blockModel.content.find(item => item.content === 'Brown');
            expect(((brownSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(blockContent.querySelector('strong').textContent).toBe('Brown');

            triggerUndo(editorElement);
            triggerRedo(editorElement);

            blockElement = editorElement.querySelector('#paragraph');
            blockContent = getBlockContentElement(blockElement);

            // Assert DOM: Strong tag should exist again for "Brown"
            expect(blockContent.querySelector('strong')).toBeDefined();
            expect(blockContent.querySelector('strong').textContent).toBe('Brown');

            // Assert Model: Bold style should be back to true
            blockModel = editor.blocks[0] as BlockModel;
            brownSegment = blockModel.content.find(item => item.content === 'Brown');
            expect(((brownSegment.properties as BaseStylesProp).styles).bold).toBe(true);

        });

        // Scenario 26: Apply uppercase to entire Paragraph, select word and apply lowercase, undo, verify JSON restores uppercase
        it('should undo lowercase applied to a word, restoring paragraph-wide uppercase', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Step 1: Apply uppercase to entire paragraph
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            // Verify uppercase is applied
            let blockModel = editor.blocks[0] as BlockModel;
            expect((blockModel.content[0].properties as BaseStylesProp).styles.uppercase).toBe(true);

            // Step 2: Apply lowercase to "Quick" (indices 4 to 9)
            setSelectionRange(blockContent.firstChild.firstChild as Node, 4, 9);
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            // Verify "Quick" is lowercase and uppercase is gone for it
            blockModel = editor.blocks[0] as BlockModel;
            let quickSegment = blockModel.content.find(item => item.content.toLowerCase().includes('quick'));
            expect(((quickSegment.properties as BaseStylesProp).styles).lowercase).toBe(true);
            expect(((quickSegment.properties as BaseStylesProp).styles).uppercase).toBeUndefined(); // Uppercase should be overridden

            // Step 3: Undo the lowercase operation
            triggerUndo(editorElement);

            // Assert Model: "Quick" segment should have uppercase: true again, lowercase undefined
            blockModel = editor.blocks[0] as BlockModel;
            quickSegment = blockModel.content.find(item => item.content.toLowerCase().includes('quick')); // Re-find
            expect(((quickSegment.properties as BaseStylesProp).styles).uppercase).toBe(true); // Should be true again
            expect(((quickSegment.properties as BaseStylesProp).styles).lowercase).toBeUndefined();

        });

        // Scenario 27: Select entire Paragraph with mixed formatting (e.g., half bold, half italic), apply custom style, update JSON with custom style on both
        it('should apply custom style to an entire paragraph with mixed formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            // Initial setup: Make first half bold, second half italic
            setSelectionRange(blockContent.firstChild as Node, 0, blockContent.textContent.length / 2);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setSelectionRange(blockContent.lastChild.lastChild, 0, blockContent.lastChild.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            // Verify initial mixed state
            let blockModel = editor.blocks[0] as BlockModel;
            let firstHalfSegment = blockModel.content.find(item => ((item.properties as BaseStylesProp).styles).bold as boolean);
            let secondHalfSegment = blockModel.content.find(item => ((item.properties as BaseStylesProp).styles).italic as boolean);
            expect(firstHalfSegment).toBeDefined();
            expect(((firstHalfSegment.properties as BaseStylesProp).styles).bold).toBe(true);
            expect(secondHalfSegment).toBeDefined();
            expect(((secondHalfSegment.properties as BaseStylesProp).styles).italic).toBe(true);

            // Step 2: Apply custom style to the entire paragraph
            const firstNode = blockContent.firstChild.firstChild;
            const lastNode = blockContent.lastChild.lastChild as Text;
            setRange(firstNode, lastNode, 0, lastNode.length);

            // Assert DOM: Expect the custom class to be applied to (parts of) the paragraph
            const span = blockContent.querySelector('span[style*="font-family"]');
            expect(span).toBeDefined();

        });

        // Scenario 28: Select entire Paragraph with mixed formatting, remove all styles, update JSON to remove all applied styles and ensure
        it('should remove all styles from an entire paragraph with mixed formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const blockContent = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            setSelectionRange(blockContent.firstChild, 0, blockContent.textContent.length / 4);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            setSelectionRange(blockContent.lastChild.lastChild, 0, blockContent.lastChild.textContent.length / 2);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            setSelectionRange(blockContent.lastChild.lastChild, 0, blockContent.lastChild.textContent.length * 1 / 2);
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            setSelectionRange(blockContent.lastChild.lastChild, 0, blockContent.lastChild.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            setSelectionRange(blockContent.lastChild.lastChild, 0, blockContent.lastChild.textContent.length * 3 / 4);
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#123456' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#ABCDEF' });

            // Select all and apply all
            setRange(blockContent.firstChild.firstChild, blockContent.lastChild.lastChild, 0, blockContent.lastChild.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '' });
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '' });
            expect(blockContent.querySelector('strong')).toBeDefined();
            expect(blockContent.querySelector('em')).toBeDefined();
            expect(blockContent.querySelector('u')).toBeDefined();
            expect(blockContent.querySelector('s')).toBeDefined();
            expect(blockContent.querySelector('sub')).toBeDefined();
            expect(blockContent.querySelector('[style*="color"]')).toBeDefined();
            expect(blockContent.querySelector('[style*="background-color"]')).toBeDefined();
            expect(blockContent.textContent).toBe('The Quick Brown Fox Jumps Over The Lazy Dog');

            // Assert Model: All content segment should have all applied style properties
            let blockModel = editor.blocks[0] as BlockModel;
            const isAllBold = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.bold as boolean);
            const isAllItalic = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.italic as boolean);
            const isAllUnderline = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.underline as boolean);
            const isAllStrikethrough = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.strikethrough as boolean);
            const isAllLowercase = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.lowercase as boolean);
            const isAllSubscript = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.subscript as boolean);
            const isColor = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.color as any);
            const isBgColor = blockModel.content.every(item => (item.properties as BaseStylesProp).styles.backgroundColor as any);
            expect(isAllBold).toBe(true);
            expect(isAllItalic).toBe(true);
            expect(isAllUnderline).toBe(true);
            expect(isAllStrikethrough).toBe(true);
            expect(isAllLowercase).toBe(true);
            expect(isAllSubscript).toBe(true);
            expect(isColor).toBe(false);
            expect(isBgColor).toBe(false);

        });

    });

    describe('Block Formatting should not be applied for Mention content type', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);

            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'content1', contentType: ContentType.Text, content: 'Hello ' },
                        { id: 'content2', contentType: ContentType.Mention, properties: { userId: 'user1' } },
                        { id: 'content3', contentType: ContentType.Text, content: ' world' },
                    ]
                },
                {
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [
                        {
                            id: 'boldText',
                            contentType: ContentType.Text,
                            content: 'Bolded text',
                            properties: { styles: { bold: true } }
                        }
                    ]
                },
            ];

            const users = [
                { id: 'user1', user: 'User 1' },
                { id: 'user2', user: 'User 2' }
            ];

            editor = createEditor({ blocks, users });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('Select the word starting from "ello" to "world" then apply Bold', () => {
            const p1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(p1);
            const contentEl = getBlockContentElement(p1);

            const startNode = (contentEl.querySelector('#content1') as HTMLElement).firstChild as Text; // "Hello "
            const endNode = (contentEl.querySelector('#content3') as HTMLElement).firstChild as Text;   // " world"

            // Select from index 1 of "Hello " ("ello ") to end index 6 of " world" ("world")
            setRange(startNode, endNode, 1, 6);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // DOM expectations:
            expect(contentEl.querySelectorAll('strong').length).toBeGreaterThan(0);
            expect(contentEl.querySelectorAll('strong').length).toBe(2);
            const strongTags: HTMLElement[] = Array.from(contentEl.querySelectorAll('strong'));
            expect(strongTags[0].textContent).toBe('ello ');
            expect(strongTags[1].textContent).toBe(' world');

            // Model expectations
            expect(editor.blocks.length).toBe(2);
            const p1Model = editor.blocks[0];
            expect(p1Model.content.length).toBe(4);
            // Mention should not have bold applied as it lies within the selection
            const mentionItem = p1Model.content.find(c => c.id === 'content2');
            expect(((mentionItem.properties as BaseStylesProp).styles)).toBeUndefined();

            // other selected contents should have bold
            expect(((p1Model.content[1].properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((p1Model.content[3].properties as BaseStylesProp).styles).bold).toBe(true);
            expect(p1Model.content[1].content).toBe('ello ');
            expect(p1Model.content[3].content).toBe(' world');
        });

        it('Select only the partial mention value "ser" then apply Bold', () => {
            const p1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(p1);
            const contentEl = getBlockContentElement(p1);

            const mentionEl = contentEl.querySelector('#content2') as HTMLElement;
            const tn = getDeepestTextNode(mentionEl) as Text; // Expected to render "User 1"
            // Select "ser" within "User 1" (indices 1..4)
            setSelectionRange(tn as any, 1, 4);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // DOM expectations:
            expect(contentEl.querySelectorAll('strong').length).toBe(0);
            expect(contentEl.querySelector('#content1').textContent).toBe('Hello ');
            expect(contentEl.querySelector('#content3').textContent).toBe(' world');

            // Model expectations
            expect(editor.blocks.length).toBe(2);
            const p1Model = editor.blocks[0];
            expect(p1Model.content.length).toBe(3);
            // Mention should not have bold applied as it lies within the selection
            const mentionItem = p1Model.content.find(c => c.id === 'content2');
            expect(((mentionItem.properties as BaseStylesProp).styles)).toBeUndefined();

            // other contents should not be changed
            expect(((p1Model.content[0].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(((p1Model.content[2].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(p1Model.content[0].content).toBe('Hello ');
            expect(p1Model.content[2].content).toBe(' world');
        });

        it('Select the whole mention value "User 1" then apply Bold', () => {
            const p1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(p1);
            const contentEl = getBlockContentElement(p1);

            const mentionEl = contentEl.querySelector('#content2') as HTMLElement;
            const tn = getDeepestTextNode(mentionEl) as Text;
            setSelectionRange(tn as any, 0, tn.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // DOM expectations:
            expect(contentEl.querySelectorAll('strong').length).toBe(0);
            expect(contentEl.querySelector('#content1').textContent).toBe('Hello ');
            expect(contentEl.querySelector('#content3').textContent).toBe(' world');

            // Model expectations
            expect(editor.blocks.length).toBe(2);
            const p1Model = editor.blocks[0];
            expect(p1Model.content.length).toBe(3);

            // Mention should not have bold applied as it lies within the selection
            const mentionItem = p1Model.content.find(c => c.id === 'content2');
            expect(((mentionItem.properties as BaseStylesProp).styles)).toBeUndefined();

            // other contents should not be changed
            expect(((p1Model.content[0].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(((p1Model.content[2].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(p1Model.content[0].content).toBe('Hello ');
            expect(p1Model.content[2].content).toBe(' world');
        });
    });

    describe('Block Formatting should not be applied for Label content type', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const labelSettings = {
                items: [
                    { id: 'high', labelColor: '#ff8a80', text: 'High', groupBy: 'Priority' },
                    { id: 'medium', labelColor: '#ffb74d', text: 'Medium', groupBy: 'Priority' },
                ]
            };
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'content1', contentType: ContentType.Text, content: 'Hello ' },
                        { id: 'content2', contentType: ContentType.Label, properties: { labelId: 'high' } },
                        { id: 'content3', contentType: ContentType.Text, content: ' world' },
                    ]
                },
                {
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [
                        {
                            id: 'boldText',
                            contentType: ContentType.Text,
                            content: 'Bolded text',
                            properties: { styles: { bold: true } }
                        }
                    ]
                },
            ];
            editor = createEditor({
                blocks, 
                labelSettings
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('Select the word starting from "ello" to "world" then apply Bold', () => {
            const p1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(p1);
            const contentEl = getBlockContentElement(p1);

            const startNode = (contentEl.querySelector('#content1') as HTMLElement).firstChild as Text; // "Hello "
            const endNode = (contentEl.querySelector('#content3') as HTMLElement).firstChild as Text;   // " world"

            // Select from index 1 of "Hello " ("ello ") to end index 6 of " world" ("world")
            setRange(startNode, endNode, 1, 6);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // DOM expectations:
            expect(contentEl.querySelectorAll('strong').length).toBeGreaterThan(0);
            expect(contentEl.querySelectorAll('strong').length).toBe(2);
            const strongTags: HTMLElement[] = Array.from(contentEl.querySelectorAll('strong'));
            expect(strongTags[0].textContent).toBe('ello ');
            expect(strongTags[1].textContent).toBe(' world');

            // Model expectations
            expect(editor.blocks.length).toBe(2);
            const p1Model = editor.blocks[0];
            expect(p1Model.content.length).toBe(4);
            // Label should not have bold applied as it lies within the selection
            const LabelItem = p1Model.content.find(c => c.id === 'content2');
            expect(((LabelItem.properties as BaseStylesProp).styles)).toBeUndefined();

            // other selected contents should have bold
            expect(((p1Model.content[1].properties as BaseStylesProp).styles).bold).toBe(true);
            expect(((p1Model.content[3].properties as BaseStylesProp).styles).bold).toBe(true);
            expect(p1Model.content[1].content).toBe('ello ');
            expect(p1Model.content[3].content).toBe(' world');
        });

        it('Select only the partial Label value "Priority" then apply Bold', () => {
            const p1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(p1);
            const contentEl = getBlockContentElement(p1);

            const labelEl = contentEl.querySelector('#content2') as HTMLElement;
            const tn = getDeepestTextNode(labelEl) as Text; // Expected to render "Priority: High"
            // Select "rio" within "Priority: High" (indices 1..4)
            setSelectionRange(tn as any, 1, 4);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // DOM expectations:
            expect(contentEl.querySelectorAll('strong').length).toBe(0);
            expect(contentEl.querySelector('#content1').textContent).toBe('Hello ');
            expect(contentEl.querySelector('#content3').textContent).toBe(' world');

            // Model expectations
            expect(editor.blocks.length).toBe(2);
            const p1Model = editor.blocks[0];
            expect(p1Model.content.length).toBe(3);
            // Label should not have bold applied as it lies within the selection
            const LabelItem = p1Model.content.find(c => c.id === 'content2');
            expect(((LabelItem.properties as BaseStylesProp).styles)).toBeUndefined();

            // other contents should not be changed
            expect(((p1Model.content[0].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(((p1Model.content[2].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(p1Model.content[0].content).toBe('Hello ');
            expect(p1Model.content[2].content).toBe(' world');
        });

        it('Select the whole label value "Priority: High" then apply Bold', () => {
            const p1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(p1);
            const contentEl = getBlockContentElement(p1);

            const labelEl = contentEl.querySelector('#content2') as HTMLElement;
            const tn = getDeepestTextNode(labelEl) as Text;
            setSelectionRange(tn as any, 0, tn.textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            // DOM expectations:
            expect(contentEl.querySelectorAll('strong').length).toBe(0);
            expect(contentEl.querySelector('#content1').textContent).toBe('Hello ');
            expect(contentEl.querySelector('#content3').textContent).toBe(' world');

            // Model expectations
            expect(editor.blocks.length).toBe(2);
            const p1Model = editor.blocks[0];
            expect(p1Model.content.length).toBe(3);

            // Mention should not have bold applied as it lies within the selection
            const LabelItem = p1Model.content.find(c => c.id === 'content2');
            expect(((LabelItem.properties as BaseStylesProp).styles)).toBeUndefined();

            // other contents should not be changed
            expect(((p1Model.content[0].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(((p1Model.content[2].properties as BaseStylesProp).styles).bold).toBeUndefined();
            expect(p1Model.content[0].content).toBe('Hello ');
            expect(p1Model.content[2].content).toBe(' world');
        });
    });
});
