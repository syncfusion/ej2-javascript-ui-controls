import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseStylesProp, BlockModel } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, setSelectionRange, getBlockContentElement, getSelectedRange } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Formatting Actions', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Ensuring proper basic formatting', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    type: BlockType.Paragraph,
                    content: [{
                        type: ContentType.Text,
                        content: 'BoldItalicUnderlineStrikethrough'
                    }]
                },
                {
                    id: 'paragraph2',
                    type: BlockType.Paragraph,
                    content: [{
                        type: ContentType.Text,
                        content: 'LowercaseUppercaseColorBgColorCustom'
                    }]
                },
                {
                    id: 'paragraph3',
                    type: BlockType.Paragraph,
                    content: [{
                        type: ContentType.Text,
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
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply bold formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 0, 4);
            editor.formattingAction.execCommand({ command: 'bold' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('strong').textContent).toBe('Bold');
            expect(contentElement.querySelector('span').textContent).toBe('ItalicUnderlineStrikethrough');
            expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
        });

        it('applying italic formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply italic formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 6);
            editor.formattingAction.execCommand({ command: 'italic' });
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.querySelector('em').textContent).toBe('Italic');
            expect(contentElement.querySelector('span').textContent).toBe('UnderlineStrikethrough');
            expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.italic).toBe(true);
        });

        it('applying underline formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply underline formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 9);
            editor.formattingAction.execCommand({ command: 'underline' });
            expect(contentElement.childElementCount).toBe(4);
            expect(contentElement.querySelector('u').textContent).toBe('Underline');
            expect(contentElement.querySelector('span').textContent).toBe('Strikethrough');
            expect((editor.blocks[0].content[2].props as BaseStylesProp).styles.underline).toBe(true);
        });

        it('applying strikethrough formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply strikethrough formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 13);
            editor.formattingAction.execCommand({ command: 'strikethrough' });
            expect(contentElement.childElementCount).toBe(4);
            expect(contentElement.querySelector('s').textContent).toBe('Strikethrough');
            expect((editor.blocks[0].content[3].props as BaseStylesProp).styles.strikethrough).toBe(true);
        });

        it('applying lowercase formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply lowercase formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 0, 9);
            editor.formattingAction.execCommand({ command: 'lowercase' });
            expect(contentElement.childElementCount).toBe(2);
            const textDecoration = (contentElement.querySelector(`#${editor.blocks[1].content[0].id}`) as HTMLElement).style.textTransform;
            expect(textDecoration).toBe('lowercase');
            expect((editor.blocks[1].content[0].props as BaseStylesProp).styles.lowercase).toBe(true);
        });

        it('applying uppercase formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply uppercase formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 9);
            editor.formattingAction.execCommand({ command: 'uppercase' });
            expect(contentElement.childElementCount).toBe(3);
            const textDecoration = (contentElement.querySelector(`#${editor.blocks[1].content[1].id}`) as HTMLElement).style.textTransform;
            expect(textDecoration).toBe('uppercase');
            expect((editor.blocks[1].content[1].props as BaseStylesProp).styles.uppercase).toBe(true);
        });

        it('applying color formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply color formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 5);
            editor.formattingAction.execCommand({ command: 'color', value: '#EE0000' });
            expect(contentElement.childElementCount).toBe(4);
            const color = (contentElement.querySelector(`#${editor.blocks[1].content[2].id}`) as HTMLElement).style.color;
            expect(color).toBe('rgb(238, 0, 0)');
            expect((editor.blocks[1].content[2].props as BaseStylesProp).styles.color).toBe('#EE0000');
        });

        it('removing the applied color formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply color formatting
            const colorSpan = (contentElement.lastChild as HTMLElement).previousElementSibling.childNodes[0] as HTMLElement;
            setSelectionRange(colorSpan, 0, 5);
            // setSelectionRange((contentElement.lastChild as HTMLElement).previousElementSibling.childNodes[0], 0, 5);
            editor.formattingAction.execCommand({ command: 'color', value: '' });
            expect(contentElement.childElementCount).toBe(4);
            const color = (contentElement.querySelector(`#${editor.blocks[1].content[2].id}`) as HTMLElement).style.color;
            expect(color).toBe('');
            expect((editor.blocks[1].content[2].props as BaseStylesProp).styles.color).toBeUndefined();
        });

        it('applying BgColor formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply BgColor formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 7);
            editor.formattingAction.execCommand({ command: 'bgColor', value: '#F8F8F8' });
            expect(contentElement.childElementCount).toBe(5);
            const bgColor = (contentElement.querySelector(`#${editor.blocks[1].content[3].id}`) as HTMLElement).style.backgroundColor;
            expect(bgColor).toBe('rgb(248, 248, 248)');
            expect((editor.blocks[1].content[3].props as BaseStylesProp).styles.bgColor).toBe('#F8F8F8');
        });

        it('applying custom formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply custom formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 6);
            editor.formattingAction.execCommand({ command: 'custom', value: 'box-shadow: 0 0 10px #000000;' });
            expect(contentElement.childElementCount).toBe(5);
            const custom = (contentElement.querySelector(`#${editor.blocks[1].content[4].id}`) as HTMLElement).style.boxShadow;
            expect(custom).toBe('rgb(0, 0, 0) 0px 0px 10px');
            expect((editor.blocks[1].content[4].props as BaseStylesProp).styles.custom).toBe('box-shadow: 0 0 10px #000000;');
        });

        it('applying superscript formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph3') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply superscript formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 0, 11);
            editor.formattingAction.execCommand({ command: 'superscript' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('sup').textContent).toBe('Superscript');
            expect((editor.blocks[2].content[0].props as BaseStylesProp).styles.superscript).toBe(true);
        });

        it('applying subscript formatting', () => {
            const blockElement = editorElement.querySelector('#paragraph3') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply subscript formatting
            setSelectionRange((contentElement.lastChild.childNodes[0] as HTMLElement), 0, 9);
            editor.formattingAction.execCommand({ command: 'subscript' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('sub').textContent).toBe('Subscript');
            expect((editor.blocks[2].content[1].props as BaseStylesProp).styles.subscript).toBe(true);
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
                    type: BlockType.Heading,
                    content: [{
                        type: ContentType.Link,
                        content: 'Helloworld',
                        props: {
                            url: 'www.syncfusion.com'
                        }
                    }]
                },
                {
                    id: 'quote',
                    type: BlockType.Quote,
                    content: [{
                        type: ContentType.Code,
                        content: 'Welcometext'
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
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange((contentElement.lastChild.lastChild as HTMLElement), 0, 5);
            editor.formattingAction.execCommand({ command: 'bold' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('strong').textContent).toBe('Hello');
            expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
        });

        it('applying italic to code content', () => {
            const blockElement = editorElement.querySelector('#quote') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange((contentElement.lastChild.lastChild as HTMLElement), 0, 7);
            editor.formattingAction.execCommand({ command: 'italic' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('em').textContent).toBe('Welcome');
            expect((editor.blocks[1].content[0].props as BaseStylesProp).styles.italic).toBe(true);
        });

        it('applying multiple formats to link content', () => {
            const blockElement = editorElement.querySelector('#heading1') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange((contentElement.lastChild.lastChild as HTMLElement), 0, 5);
            editor.formattingAction.execCommand({ command: 'bold' });
            editor.formattingAction.execCommand({ command: 'italic' });
            editor.formattingAction.execCommand({ command: 'strikethrough' });
            editor.formattingAction.execCommand({ command: 'underline' });
            expect(contentElement.childElementCount).toBe(2);
            expect(contentElement.querySelector('strong')).not.toBeNull();
            expect(contentElement.querySelector('em')).not.toBeNull();
            expect(contentElement.querySelector('s')).not.toBeNull();
            expect(contentElement.querySelector('u')).not.toBeNull();
            expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.italic).toBe(true);
            expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.strikethrough).toBe(true);
            expect((editor.blocks[0].content[0].props as BaseStylesProp).styles.underline).toBe(true);
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
                        type: BlockType.Paragraph,
                        content: [{ 
                            id: 'content-1', 
                            type: ContentType.Text, 
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
                editor.setFocusToBlock(blockElement);
                
                // Activate bold formatting
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', code: 'KeyB', ctrlKey: true }));
                expect(editor.formattingAction.activeInlineFormats.has('bold')).toBe(true);
                
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
                
                let result = editor.element.dispatchEvent(new Event('input'));
                
                // Check if the newly typed character has formatting
                setTimeout(() => {
                    // Last character should be bold now
                    expect(contentElement.querySelector('strong')).not.toBeNull();
                    expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.bold).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        it('should handle removed formats when typing', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                
                // Activate bold formatting but don't apply it yet
                editor.formattingAction.activeInlineFormats.add('bold');
                expect(editor.formattingAction.activeInlineFormats.has('bold')).toBe(true);
                
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
                let result = editor.formattingAction.handleTypingWithActiveFormats();
                
                // Should return true indicating formatting was applied
                expect(result).toBe(true);

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', code: 'KeyB', ctrlKey: true }));
                
                expect(editor.formattingAction.activeInlineFormats.has('bold')).toBe(false);
                
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
                result = editor.formattingAction.handleTypingWithActiveFormats();
                
                expect(result).toBe(true);

                // Check if the newly typed character has formatting
                setTimeout(() => {
                    // Last character should not be bold now
                    expect(contentElement.querySelector('strong')).not.toBeNull();
                    expect((editor.blocks[0].content[1].props as BaseStylesProp).styles.bold).toBe(true);
                    expect((editor.blocks[0].content[2].props as BaseStylesProp).styles.bold).toBeUndefined();
                    done();
                }, 100);
            }, 100);
        });

        it('should not apply formatting if all active formats already applied', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                
                // First make the entire text bold
                setSelectionRange(getBlockContentElement(blockElement).firstChild as HTMLElement, 0, 11);
                editor.formattingAction.execCommand({ command: 'bold' });
                
                // Add bold to active formats
                editor.formattingAction.activeInlineFormats.add('bold');
                
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
                const result = editor.formattingAction.handleTypingWithActiveFormats();
                
                // Should return false because formatting already exists
                expect(result).toBe(false);
                done();
            }, 100);
        });

        it('should apply multiple active formats', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                
                // Activate multiple formats
                editor.formattingAction.activeInlineFormats.add('bold');
                editor.formattingAction.activeInlineFormats.add('italic');
                
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
                editor.formattingAction.handleTypingWithActiveFormats();
                
                // Check if multiple formats were applied
                setTimeout(() => {
                    const strongElement = contentElement.querySelector('strong');
                    const italicElement = contentElement.querySelector('em');
                    
                    expect(strongElement).not.toBeNull();
                    expect(italicElement).not.toBeNull();
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Other actions testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph-1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }] }
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
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            const originalContentElement = contentElement.cloneNode(true);
            
            //Spy the getSelection method on utils
            const rangeSpy = jasmine.createSpy('getSelectedRange', getSelectedRange).and.returnValue(null);
            //Range test
            const data1 = (editor.formattingAction as any).handleFormatting();
            expect(data1).toBeUndefined();

            rangeSpy.calls.reset();

            // Invalid range
            editor.nodeSelection.createRangeWithOffsets(editorElement, editorElement, 0, 0);
            const data2 = (editor.formattingAction as any).handleFormatting();
            expect(data2).toBeUndefined();

            // Null content element
            contentElement.remove();
            editor.nodeSelection.createRangeWithOffsets(blockElement, blockElement, 0, 0);
            const data3 = (editor.formattingAction as any).handleFormatting();
            expect(data3).toBeUndefined();

            // Invalid block id
            blockElement.appendChild(originalContentElement);
            blockElement.id = 'fake'
            setCursorPosition(contentElement, 0);
            const data4 = (editor.formattingAction as any).handleFormatting();
            expect(data4).toBeUndefined();
            blockElement.id = 'paragraph-1';

            //Selection collapsed
            editor.setSelection('paragraph-content', 2, 4);
            const data5 = editor.formattingAction.handleTypingWithActiveFormats();
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

            expect((editor.formattingAction as any).isNodeFormattedWith(strongElement, 'bold')).toBe(true);
            expect((editor.formattingAction as any).isNodeFormattedWith(italicElement, 'italic')).toBe(true);
            expect((editor.formattingAction as any).isNodeFormattedWith(underlineElement, 'underline')).toBe(true);
            expect((editor.formattingAction as any).isNodeFormattedWith(strikethroughElement, 'strikethrough')).toBe(true);
            expect((editor.formattingAction as any).isNodeFormattedWith(fakeFormat, 'fake')).toBe(false);
            done();
        });

        it('should apply formatting for middle node properly', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;

            editor.setFocusToBlock(blockElement);

            editor.addBlock({ 
                id: 'paragraph-2', type: BlockType.Paragraph,
                content: [
                    { id: 'con-1', type: ContentType.Text, content: 'Hi', props: { styles: { bold: true } }},
                    { id: 'con-2', type: ContentType.Text, content: 'Hello' },
                    { id: 'con-3', type: ContentType.Text, content: 'World', props: { styles: { italic: true } } },
            ]});

            const newBlockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const newBlockContent = getBlockContentElement(newBlockElement);
            editor.setFocusToBlock(newBlockElement);

            // Select whole block
            const startNode = newBlockContent.querySelector('#con-1').firstChild;
            const endNode = newBlockContent.querySelector('#con-3').firstChild;
            editor.nodeSelection.createRangeWithOffsets(startNode, endNode, 0, 5);

            editor.formattingAction.execCommand({ command: 'underline' });
            expect(newBlockContent.childElementCount).toBe(3);
            expect(newBlockContent.querySelector('strong').textContent).toBe('Hi');
            expect(newBlockContent.querySelector('u#con-2').textContent).toBe('Hello');
            expect(newBlockContent.querySelector('em').textContent).toBe('World');
            expect((editor.blocks[1].content[0].props as BaseStylesProp).styles.bold).toBe(true);
            expect((editor.blocks[1].content[1].props as BaseStylesProp).styles.underline).toBe(true);
            expect((editor.blocks[1].content[2].props as BaseStylesProp).styles.italic).toBe(true);
            done();
        });
        
    });
});
