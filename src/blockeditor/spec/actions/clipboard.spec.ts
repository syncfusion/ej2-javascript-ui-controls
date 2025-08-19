import { createElement } from '@syncfusion/ej2-base';
import { BlockModel } from '../../src/blockeditor/models/index';
import { BlockEditor, BlockType, ContentType, getBlockContentElement, getContentModelById, getSelectionRange, IClipboardPayload, setCursorPosition } from '../../src/index';
import { createEditor } from '../common/util.spec';
import { allBlockData } from '../common/data.spec';

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


describe('Clipboard Actions', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('Copy and Paste within Editor', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph1-content', type: ContentType.Text, content: 'First paragraph' }
                    ]
                },
                {
                    id: 'paragraph2',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph2-content', type: ContentType.Text, content: 'Second paragraph' }
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

        it('copy & paste whole block', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
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
            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(blockElement.nextElementSibling.id).toBe(editor.blocks[1].id);
                done();
            }, 100);
        });

        it('cut & paste whole block', (done) => {
            const initialBlockCount = editor.blocks.length;
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
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

            editor.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editorElement.querySelector('#paragraph1')).toBeNull();

                const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
                editor.setFocusToBlock(blockElement2);
                setCursorPosition(getBlockContentElement(blockElement2), 0);
                editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(blockElement2.nextElementSibling.id).toBe(editor.blocks[1].id);
                done();
            });
        });

        it('copy & paste partial content', (done) => {
            if (editor) editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'block1',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'bold', type: ContentType.Text, content: 'Boldedtext', styles: { bold: true } },
                            { id: 'italic', type: ContentType.Text, content: 'Italictext', styles: { italic: true } },
                            { id: 'underline', type: ContentType.Text, content: 'Underlinedtext', styles: { underline: true } }
                        ]
                    },
                    {
                        id: 'block2',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'test', type: ContentType.Text, content: 'TestContent', styles: { bold: true } }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            editor.setFocusToBlock(editor.element.querySelector('#block1'));
            //create range
            var range = document.createRange();
            var startNode = editor.element.querySelector('#italic').firstChild;
            var endNode = editor.element.querySelector('#underline').firstChild;
            range.setStart(startNode, 0);
            range.setEnd(endNode, 6);
            var selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
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

            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 4);
            const initialLength = editor.blocks[1].content.length;

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks[1].content.length).toBe(initialLength + 3);
                expect(editor.blocks[1].content[0].content).toBe('Test');
                expect(editor.blocks[1].content[1].content).toBe('Italictext');
                expect(editor.blocks[1].content[1].styles.italic).toBe(true);
                expect(editor.blocks[1].content[2].content).toBe('Underl');
                expect(editor.blocks[1].content[2].styles.underline).toBe(true);
                expect(editor.blocks[1].content[3].content).toBe('Content');
                expect(contentElement.childNodes.length).toBe(4);
                expect(contentElement.childNodes[1].textContent).toBe('Italictext');
                expect((contentElement.childNodes[1] as HTMLElement).tagName).toBe('EM');
                expect((contentElement.childNodes[2] as HTMLElement).textContent).toBe('Underl');
                expect((contentElement.childNodes[2] as HTMLElement).tagName).toBe('U');
                done();
            }, 100);
        });

        it('multi block paste when cursor is at middle', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            setCursorPosition(getBlockContentElement(blockElement), 6);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // First block will be splitted at cursor and clipboard's first block content gets merged here
            // Remaining clipboard blocks will be added after this block
            // So, total blocks will be 4
            setTimeout(() => {
                expect(editor.blocks.length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

                expect(editor.blocks[0].content[0].content).toBe('First ');
                expect(editor.blocks[0].content[1].content).toBe('First paragraph');

                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[2].content[0].content).toBe('paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('multi block paste when cursor is at start', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            setCursorPosition(getBlockContentElement(blockElement), 0);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // All Clipboard blocks will be pasted after the focused block
            // So, total blocks will be 4
            setTimeout(() => {
                expect(editor.blocks.length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

                expect(editor.blocks[0].content[0].content).toBe('First paragraph');

                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(editor.blocks[2].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('multi block paste when cursor is at empty block', function (done) {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '';
            editor.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 0);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
                setTimeout(function () {
                    expect(editor.blocks.length).toBe(3);
                    expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                    expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                    expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                    expect(editor.blocks[2].content[0].content).toBe('Second paragraph');
                    expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                    expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                    expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('Second paragraph');
                    done();
                });
        });

        it('multi block paste in child type block when cursor is at empty', function (done) {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            const lastBlockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            editor.setFocusToBlock(lastBlockElement);

            editor.addBlock({
                id: 'callout-block',
                type: 'Callout',
                children: [{
                    id: 'callout-child1',
                    type: 'Paragraph',
                    content: [{ id: 'callout-child1-content', type: ContentType.Text, content: '' }]
                }]
            }, lastBlockElement.id);

            const calloutParentBlock = editorElement.querySelector('#callout-block') as HTMLElement;
            const calloutChildBlock = editorElement.querySelector('#callout-child1') as HTMLElement;
            editor.setFocusToBlock(calloutChildBlock);

            const contentElement = getBlockContentElement(calloutChildBlock);
            setCursorPosition(contentElement, 0);

            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(function () {
                expect(editor.blocks[2].children.length).toBe(2);
                expect(calloutParentBlock.querySelectorAll('.e-block').length).toBe(2);
                expect(editor.blocks[2].children[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[2].children[1].content[0].content).toBe('Second paragraph');
                expect(calloutParentBlock.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(calloutParentBlock.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('should delete selected content and paste correctly - Single Block', (done) => {
            if (editor) editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'source-block',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'source-content', type: ContentType.Text, content: 'Source text to copy' }
                        ]
                    },
                    {
                        id: 'target-block',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'target-content', type: ContentType.Text, content: 'This text will be partially selected' }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');

            // Copy content from the first block
            const sourceBlock = editorElement.querySelector('#source-block') as HTMLElement;
            editor.setFocusToBlock(sourceBlock);
            const sourceRange = document.createRange();
            const sourceContent = sourceBlock.querySelector('#source-content') as HTMLElement;
            sourceRange.selectNodeContents(sourceContent);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(sourceRange);
            
            const copiedData = editor.clipboardAction.getClipboardPayload();

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData.blockeditorData;
                    } else if (format === 'text/html') {
                        return copiedData.html;
                    } else if (format === 'text/plain') {
                        return copiedData.text;
                    }
                    return '';
                }
            };

            // Select partial text in the second block
            const targetBlock = editorElement.querySelector('#target-block') as HTMLElement;
            editor.setFocusToBlock(targetBlock);
            const targetRange = document.createRange();
            const targetContent = targetBlock.querySelector('#target-content') as HTMLElement;
            targetRange.setStart(targetContent.firstChild, 5); // 'This '
            targetRange.setEnd(targetContent.firstChild, 18); // 'This text will be'
            
            selection.removeAllRanges();
            selection.addRange(targetRange);
            
            //this should delete the selected content and paste new content
            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                const updatedContent = editor.blocks[1].content;
                expect(updatedContent.length).toBe(3); // Should be split into three parts
                expect(updatedContent[0].content).toBe('This '); // Text before selection
                expect(updatedContent[1].content).toBe('Source text to copy'); // Pasted content
                expect(updatedContent[2].content).toBe('partially selected'); // Text after selection
                
                const updatedElement = editorElement.querySelector('#target-block .e-block-content');
                expect(updatedElement.textContent).toBe('This Source text to copypartially selected');
                done();
            }, 100);
        });

        it('should delete selected content and paste correctly - Multi Blocks', (done) => {
            if (editor) editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'source-block',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'source-content', type: ContentType.Text, content: 'Source text to copy. This text will be' }
                        ]
                    },
                    {
                        id: 'target-block',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'target-content', type: ContentType.Text, content: 'partially selected' }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');

            // Copy content from the first block
            const sourceBlock = editorElement.querySelector('#source-block') as HTMLElement;
            editor.setFocusToBlock(sourceBlock);
            const sourceRange = document.createRange();
            const sourceContent = sourceBlock.querySelector('#source-content') as HTMLElement;
            sourceRange.setStart(sourceContent.firstChild, 0);
            sourceRange.setEnd(sourceContent.firstChild, 20);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(sourceRange);
            
            const copiedData = editor.clipboardAction.getClipboardPayload();

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData.blockeditorData;
                    } else if (format === 'text/html') {
                        return copiedData.html;
                    } else if (format === 'text/plain') {
                        return copiedData.text;
                    }
                    return '';
                }
            };

            // Select partial text in first block and partial in the second block
            const targetBlock = editorElement.querySelector('#target-block') as HTMLElement;
            editor.setFocusToBlock(targetBlock);
            const targetRange = document.createRange();
            const targetContent = targetBlock.querySelector('#target-content') as HTMLElement;
            targetRange.setStart(sourceContent.firstChild, 21);
            targetRange.setEnd(targetContent.firstChild, 10);
            
            selection.removeAllRanges();
            selection.addRange(targetRange);
            
            //this should delete the selected content and paste new content
            editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(1);
                const updatedContent = editor.blocks[0].content;
                expect(updatedContent.length).toBe(3); // Should be split into three parts
                expect(updatedContent[0].content).toBe('Source text to copy. '); // Text before selection
                expect(updatedContent[1].content).toBe('Source text to copy.'); // Pasted content
                expect(updatedContent[2].content).toBe('selected'); // Text after selection
                
                const updatedElement = editorElement.querySelector('#source-block .e-block-content');
                expect(updatedElement.textContent).toBe('Source text to copy. Source text to copy.selected');
                done();
            }, 100);
        });
    });

    describe('Paste Plain Text', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph', type: BlockType.Paragraph, content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }] }
            ];
            editor = createEditor({
                blocks: blocks,
                pasteSettings: {
                    plainText: true
                }
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should paste plain text as paragraph blocks', (done) => {
            // Mock clipboard event with plain text
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/plain') {
                        return 'Line 1\n  \nLine 2\nLine 3';
                    }
                    return '';
                }
            });

            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            editor.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(4); // Original + 3 new lines
                expect(editor.blocks[0].content[0].content).toBe('Hello world');
                expect(editor.blocks[1].content[0].content).toBe('Line 1');
                expect(editor.blocks[2].content[0].content).toBe('Line 2');
                expect(editor.blocks[3].content[0].content).toBe('Line 3');
                expect(editor.blockWrapper.querySelectorAll('.e-block').length).toBe(4);
                done();
            }, 100);
        });

        it('should detect and convert bullet lists in plain text', (done) => {
            // Mock clipboard event with plain text containing bullet list markers
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/plain') {
                        return '* Item 1\n* Item 2\n* Item 3';
                    }
                    return '';
                }
            });
            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            // Trigger paste event
            editor.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(4); // Original + 3 new list items
                expect(editor.blocks[1].type).toBe(BlockType.BulletList);
                expect(editor.blocks[2].type).toBe(BlockType.BulletList);
                expect(editor.blocks[3].type).toBe(BlockType.BulletList);
                expect(editor.blockWrapper.querySelectorAll('.e-block').length).toBe(4);
                done();
            }, 100);
        });

        it('should detect and convert numbered lists in plain text', (done) => {
            // Mock clipboard event with plain text containing numbered list markers
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/plain') {
                        return '1. Item 1\n2. Item 2\n3. Item 3';
                    }
                    return '';
                }
            });
            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            // Trigger paste event
            editor.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(4); // Original + 3 new list items
                expect(editor.blocks[1].type).toBe(BlockType.NumberedList);
                expect(editor.blocks[2].type).toBe(BlockType.NumberedList);
                expect(editor.blocks[3].type).toBe(BlockType.NumberedList);
                expect(editor.blockWrapper.querySelectorAll('.e-block').length).toBe(4);
                done();
            }, 100);
        });
    });

    describe('Paste HTML Content', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        const blocks: BlockModel[] = [
            { id: 'paragraph', type: BlockType.Paragraph, content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }] }
        ];

        beforeEach((done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: blocks
            });
            editor.appendTo('#editor');
            done();
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should parse and paste HTML content with formatting', (done) => {
            // Mock clipboard event with HTML content
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/html') {
                        return '<p>Formatted <strong>bold</strong> and <em>italic</em> text</p>';
                    }
                    return '';
                }
            });
            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            // Trigger paste event
            editor.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].type).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].content.length).toBe(5);
                expect(editor.blocks[1].content[0].content).toBe('Formatted ');

                expect(editor.blocks[1].content[1].content).toBe('bold');
                expect(editor.blocks[1].content[1].styles.bold).toBe(true);

                expect(editor.blocks[1].content[2].content).toBe(' and ');

                expect(editor.blocks[1].content[3].content).toBe('italic');
                expect(editor.blocks[1].content[3].styles.italic).toBe(true);

                expect(editor.blocks[1].content[4].content).toBe(' text');
                done();
            }, 100);
        });

        it('should convert HTML lists to list blocks', (done) => {
            // Mock clipboard event with HTML list content
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/html') {
                        // Orderered list with nested case
                        return '<ol><li>Item 1</li><li>Item 2<ol><li>Subitem 2.1</li><li>Subitem 2.2</li></ol></li><li>Item 3</li></ol>';
                    }
                    return '';
                }
            });
            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            // Trigger paste event
            editor.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(6); // Original + 5 list items
                expect(editor.blocks[1].type).toBe(BlockType.NumberedList);
                expect(editor.blocks[2].type).toBe(BlockType.NumberedList);
                expect(editor.blocks[3].type).toBe(BlockType.NumberedList);
                expect(editor.blocks[4].type).toBe(BlockType.NumberedList);
                expect(editor.blocks[5].type).toBe(BlockType.NumberedList);

                expect(editor.blocks[1].content[0].content).toBe('Item 1');
                expect(editor.blocks[2].content[0].content).toBe('Item 2');
                expect(editor.blocks[3].indent).toBe(1);
                expect(editor.blocks[3].content[0].content).toBe('Subitem 2.1');
                expect(editor.blocks[4].indent).toBe(1);
                expect(editor.blocks[4].content[0].content).toBe('Subitem 2.2');
                expect(editor.blocks[5].content[0].content).toBe('Item 3');

                //DOm check
                expect(editorElement.querySelectorAll('.e-block').length).toBe(6);
                expect(editorElement.querySelectorAll('.e-list-block').length).toBe(5);
                done();
            }, 100);
        });

        it('should paste inline elements as contents within block', (done) => {
            // Mock clipboard event with HTML list content
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/html') {
                        // Orderered list with nested case
                        return '<span>Inline element within block</span>';
                    }
                    return '';
                }
            });
            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            // Trigger paste event
            editor.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('Inline element within block');
                expect(editor.blocks[0].content[1].content).toBe('Hello world');

                //DOM
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                expect(editorElement.querySelector('#paragraph').textContent).toBe('Inline element within blockHello world');
                done();
            }, 100);
        });
    });

    describe('Copy to External Applications', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({ blocks: allBlockData });
            editor.appendTo('#editor');
        });

        beforeEach((done: DoneFn) => done());

        afterAll(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should generate clean HTML for external clipboard', (done) => {
            // // Mock copy event
            editor.selectAllBlocks();
            const { html, text, blockeditorData }: IClipboardPayload = editor.clipboardAction.getClipboardPayload();
            expect(html).toContain('<h1>Welcome to the Block Editor Demo!</h1>');
            expect(html).toContain('<p>Block Editor is a powerful rich text editor</p>');
            expect(html).toContain('<p>Try selecting text to see <em><strong>formatting options</strong></em>, or type <span style="background-color: #F0F0F0;"><strong>&quot;/&quot;</strong></span> to access the command menu.</p>');
            expect(html).toContain('<h2>Block Types</h2>');
            expect(html).toContain('<blockquote><em>The Block Editor makes document creation a seamless experience with its intuitive block-based approach.</em></blockquote>');
            expect(html).toContain('<h3>List Types</h3>');
            expect(html).toContain('<ul><li><strong>Text blocks: Paragraph, Heading 1-4, Quote, Callout</strong></li></ul>');
            expect(html).toContain('<ol><li>Lists: Bullet lists, Numbered lists, Check lists</li></ol>');
            expect(html).toContain('<ul><li>Special blocks: Divider, Toggle, Code block</li></ul>');
            expect(html).toContain('<hr />');
            expect(html).toContain('<h4>Text Formatting Examples</h4>');
            expect(html).toContain('<p><strong>Bold </strong><em>Italic </em><u>Underline </u><s>Strikethrough </s><sup>Superscript </sup><sub>Subscript </sub><span style="text-transform: uppercase;">uppercase </span><span style="text-transform: lowercase;">LOWERCASE</span></p>');
            expect(html).toContain('<p>Visit <a href="https://www.syncfusion.com/" target="_blank">Syncfusion</a> for more information.</p>');
            expect(html).toContain('<p>This block contains a Progress: In-progress label.</p>');
            expect(html).toContain('<p><span style="background-color: #F8F9FA;"><strong>Try it out! Click anywhere and start typing, or type &quot;/&quot; to see available commands.</strong></span></p>');

            // Optionally validate structure
            expect(Array.isArray(JSON.parse(blockeditorData).blocks)).toBe(true);
            expect(typeof text).toBe('string');
            expect(typeof html).toBe('string');
            done();
        });
    });

    describe('Code Block Paste', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block', 
                    type: BlockType.Code, 
                    content: [{ 
                        id: 'code-content', 
                        type: ContentType.Text, 
                        content: '// JavaScript code\n' 
                    }] 
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

        it('should handle code block content paste correctly', (done) => {
            // Mock clipboard event with code content
            const codeToInsert = 'function hello() {\n  console.log("Hello world!");\n}';
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/plain') {
                        return codeToInsert;
                    }
                    return '';
                }
            });

            // Select the code block
            const codeBlock = editorElement.querySelector('#code-block') as HTMLElement;
            editor.setFocusToBlock(codeBlock);
            
            // Get the code content element
            const codeContent = codeBlock.querySelector('.e-code-content') as HTMLElement;
            setCursorPosition(codeContent, codeContent.textContent.length);
            
            // Paste the code
            editor.clipboardAction.handlePaste(mockEvent);
            
            setTimeout(() => {
                // Check if the code was correctly pasted
                expect(editor.blocks[0].content[0].content).toBe('// JavaScript code\n' + codeToInsert);
                expect(codeContent.textContent).toBe('// JavaScript code\n' + codeToInsert);
                done();
            }, 100);
        });

        it('should preserve code block type when pasting', (done) => {
            // Mock clipboard event with various content types
            const mixedContent = '<p>Regular text</p><pre><code>var x = 10;</code></pre>';
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/html') {
                        return mixedContent;
                    } else if (format === 'text/plain') {
                        return 'Regular text\nvar x = 10;';
                    }
                    return '';
                }
            });

            // Select the code block
            const codeBlock = editorElement.querySelector('#code-block') as HTMLElement;
            editor.setFocusToBlock(codeBlock);
            
            // Get the code content element
            const codeContent = codeBlock.querySelector('.e-code-content') as HTMLElement;
            setCursorPosition(codeContent, codeContent.textContent.length);
            
            // Paste the mixed content
            editor.clipboardAction.handlePaste(mockEvent);
            
            setTimeout(() => {
                // The content should be pasted as plain text in the code block
                expect(editor.blocks[0].type).toBe(BlockType.Code);
                expect(editor.blocks[0].content[0].content).toContain('var x = 10;');
                done();
            }, 100);
        });

        it('should preserve br when selecting whole content and paste', (done) => {
             // Mock clipboard event with code content
            const codeToInsert = 'function hello() {\n  console.log("Hello world!");\n}';
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/plain') {
                        return codeToInsert;
                    }
                    return '';
                }
            });

            spyOn((editor.clipboardAction as any), 'handleCodeBlockContentPaste').and.callFake(() => {});

            // Select the code block
            const codeBlock = editorElement.querySelector('#code-block') as HTMLElement;
            editor.setFocusToBlock(codeBlock);
            
            // Get the code content element
            const codeContent = codeBlock.querySelector('.e-code-content') as HTMLElement;
            editor.nodeSelection.createRangeWithOffsets(
                codeContent.firstChild, codeContent.firstChild, 0, codeContent.textContent.length
            );
            
            // Paste the code
            editor.clipboardAction.handlePaste(mockEvent);
            
            setTimeout(() => {
                expect((editor.clipboardAction as any).handleCodeBlockContentPaste).toHaveBeenCalled();
                done();
            }, 100);
        });
    });

    describe('Context Menu Clipboard Operations', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph1-content', type: ContentType.Text, content: 'Context menu clipboard test' }
                    ]
                },
                {
                    id: 'paragraph2',
                    type: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph2-content', type: ContentType.Text, content: 'Second paragraph' }
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

        it('should handle context copy operation', (done) => {
            // spy on the methods we call
            const spy = spyOn(editor.clipboardAction, 'getClipboardPayload').and.returnValue({
                html: '<p>Test HTML</p>',
                text: 'Test text',
                blockeditorData: JSON.stringify({ block: { id: 'test', content: [] } })
            });

            // Mock the clipboard.write method
            const writePromise = Promise.resolve();
            spyOn((navigator as any).clipboard, 'write').and.returnValue(writePromise);

            // Select content
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            
            // Call context copy
            editor.clipboardAction.handleContextCopy().then(() => {
                expect(spy).toHaveBeenCalled();
                expect((navigator as any).clipboard.write).toHaveBeenCalled();
                done();
            }).catch(done.fail);
        });

        it('should handle context cut operation', (done) => {
            // Spy on related methods
            const copySpy = spyOn(editor.clipboardAction, 'handleContextCopy').and.returnValue(Promise.resolve());
            const cutSpy = spyOn(editor.clipboardAction as any, 'performCutOperation').and.callThrough();
            
            // Select content
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            // Create a selection range
            const range = document.createRange();
            const contentElement = blockElement.querySelector('#paragraph1-content');
            range.selectNodeContents(contentElement);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Call context cut
            editor.clipboardAction.handleContextCut().then(() => {
                expect(copySpy).toHaveBeenCalled();
                expect(cutSpy).toHaveBeenCalled();
                done();
            }).catch(done.fail);
        });

        it('should handle context paste operation', (done) => {
            // Spy on clipboard.read and performPasteOperation
            const readPromise = Promise.resolve([{
                types: ['text/plain', 'text/html'],
                getType: (type: string) => {
                    return Promise.resolve({
                        text: () => Promise.resolve(type === 'text/plain' ? 'Test text' : '<p>Test HTML</p>')
                    });
                }
            }]);

            spyOn((navigator as any).clipboard, 'read').and.returnValue(readPromise);
            const pasteSpy = spyOn(editor.clipboardAction as any, 'performPasteOperation').and.callThrough();

            // Set cursor in block
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            
            // Call context paste
            editor.clipboardAction.handleContextPaste().then(() => {
                expect((navigator as any).clipboard.read).toHaveBeenCalled();
                expect(pasteSpy).toHaveBeenCalled();
                
                // Check if correct data was passed to performPasteOperation
                const args = pasteSpy.calls.mostRecent().args[0];
                expect(args.html).toBe('<p>Test HTML</p>');
                expect(args.text).toBe('Test text');
                
                done();
            }).catch(done.fail);
        });

        it('should handle image paste through context menu', (done) => {
            // Create a mock Blob that simulates an image file
            const mockImageBlob = new Blob(['image data'], { type: 'image/png' });
            
            // Spy on clipboard.read with mock image data
            const readPromise = Promise.resolve([{
                types: ['image/png', 'text/plain'],
                getType: (type: string) => {
                    if (type === 'image/png') {
                        return Promise.resolve(mockImageBlob);
                    }
                    return Promise.resolve({
                        text: () => Promise.resolve('Alt text for image')
                    });
                }
            }]);
            
            spyOn((navigator as any).clipboard, 'read').and.returnValue(readPromise);
            
            // Spy on performPasteOperation
            const pasteSpy = spyOn(editor.clipboardAction as any, 'performPasteOperation').and.callThrough();
            const imagePasteHandler = spyOn(editor.blockAction.imageRenderer, 'handleFilePaste').and.callFake(() => Promise.resolve());
            
            // Set cursor in block
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            
            // Call context paste
            editor.clipboardAction.handleContextPaste().then(() => {
                expect((navigator as any).clipboard.read).toHaveBeenCalled();
                
                expect(pasteSpy).toHaveBeenCalled();
                expect(imagePasteHandler).toHaveBeenCalled();
                const args = pasteSpy.calls.mostRecent().args[0];
                
                // Should include the file object
                expect(args.file).toBe(mockImageBlob);
                expect(args.text).toBe('Alt text for image');
                
                done();
            }).catch(done.fail);
        });

        it('should handle clipboard empty check', (done) => {
            // Test for empty clipboard
            spyOn((navigator as any).clipboard, 'read').and.returnValue(Promise.resolve([]));
            
            editor.clipboardAction.isClipboardEmpty().then((isEmpty) => {
                expect(isEmpty).toBe(true);
                done();
            }).catch(done.fail);
        });

        it('should handle context paste with fallback', (done) => {
            // Mock read to throw an error and readText to succeed
            spyOn((navigator as any).clipboard, 'read').and.returnValue(Promise.reject('Security error'));
            spyOn((navigator as any).clipboard, 'readText').and.returnValue(Promise.resolve('Fallback text'));
            
            // Set cursor in block
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            const pasteSpy = spyOn(editor.clipboardAction as any, 'performPasteOperation').and.callThrough();
            
            editor.clipboardAction.handleContextPaste().then(() => {
                expect((navigator as any).clipboard.read).toHaveBeenCalled();
                expect((navigator as any).clipboard.readText).toHaveBeenCalled();
                expect(pasteSpy).toHaveBeenCalled();
                
                // Check fallback data
                const args = pasteSpy.calls.mostRecent().args[0];
                expect(args.text).toBe('Fallback text');
                
                done();
            }).catch(done.fail);
        });
    });

    describe('Other actions testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph-1', type: BlockType.Paragraph, content: [{ id: 'paragraph-content-1', type: ContentType.Text, content: 'Hello world 1' }] },
                { id: 'paragraph-2', type: BlockType.Paragraph, content: [{ id: 'paragraph-content-2', type: ContentType.Text, content: 'Hello world 2' }] }
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
            // Empty block data
            const blocks = (editor.clipboardAction as any).createPartialBlockModels(document.createElement('div'), []);
            expect(blocks.length).toBe(0);

            // Invalid content element
            const container = document.createElement('div');
            container.innerHTML = '<p id="fakeelement">Test</p>';

            const contents = (editor.clipboardAction as any).createPartialContentModels(container, editor.blocks[0]);
            expect(contents.length).toBe(0);

            // Sending null data for parse will be catched by try catch block
            const spyconsole = spyOn(console, 'error').and.callFake(() => {});
            const parsedData = (editor.clipboardAction as any).handleBlockEditorPaste('this is not valid json');
            expect(parsedData).toBeUndefined();
            expect(console.error).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Error parsing Block Editor clipboard data:', jasmine.any(Error));
            spyconsole.calls.reset();

            //Pasting empty content
            const pasteData = (editor.clipboardAction as any).handleContentPasteWithinBlock([]);
            expect(pasteData).toBeUndefined();

            var rangeSpy = spyOn(editor.nodeSelection, 'getRange').and.returnValue(null);
            //Range test
            const pasteData1 = (editor.clipboardAction as any).handleContentPasteWithinBlock([ { content: 'Fake' } ]);
            expect(pasteData1).toBeUndefined();

            // Sending null data
            const data1 = (editor.clipboardAction as any).handleMultiBlocksPaste([]);
            expect(data1).toBeUndefined();

            // Range test
            const data2 = (editor.clipboardAction as any).handleMultiBlocksPaste([{ type: 'Fake' }]);
            expect(data2).toBeUndefined();

            const text = (editor.clipboardAction as any).getBlockText({ content: null })
            expect(text).toBe('');
            rangeSpy.calls.reset();
            done();
        });

        it('should unwrap the deepest block container', (done) => {
           const container = document.createElement('div');
           const span = document.createElement('span');
           span.innerHTML = '<div id="nestedContainer"> <p> Test </p> </div>';
           container.appendChild(span);

           const unwrapped = (editor.clipboardAction as any).unWrapContainer(container);
           expect(unwrapped).not.toBeNull();
           expect(unwrapped.firstChild.id).toBe('nestedContainer');
           done();
        });

        it('should exit when before paste event is prevented', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            editor.beforePaste = (args) => {
                args.cancel = true;
            }

            (editor.clipboardAction as any).performPasteOperation({
                html: '', text: '', file: null
            });

            expect(editor.blocks.length).toBe(2);
            done();
        });

        it('should focus prev block when cut performed on last block', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);
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

                editor.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboard));

                setTimeout(() => {
                    expect(editor.blocks.length).toBe(1);
                    expect(editor.currentFocusedBlock.id).toBe('paragraph-1');
                    done();
                }, 300);
            }, 200);
        });

        it('should paste image from clipboard properly', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                // Create a mock file that simulates an image
                const mockFile = new File([''], 'test-image.png', { type: 'image/png' });
                
                // Create a mock FileList-like object
                const mockItems = [{
                    kind: 'file',
                    type: 'image/png',
                    getAsFile: () => mockFile
                }];

                const mockClipboard: any = {
                    setData: jasmine.createSpy(),
                    getData: () => {},
                    items: mockItems
                };

                editor.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

                setTimeout(() => {
                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[1].type).toBe('Image');
                    expect(editorElement.querySelector('img')).not.toBeNull();
                    done();
                }, 500);
            }, 200);
        });
    });
});
