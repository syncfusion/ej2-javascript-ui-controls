import { createElement } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BaseStylesProp, BlockModel } from '../../src/models/index';
import { getBlockContentElement, getBlockText, IClipboardPayloadOptions, setCursorPosition } from '../../src/common/index';
import { createEditor } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { BlockType, ContentType } from '../../src/models/enums';

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
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph1-content', contentType: ContentType.Text, content: 'First paragraph' }
                    ]
                },
                {
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph2-content', contentType: ContentType.Text, content: 'Second paragraph' }
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
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(editor.blocks[2].content[0].content).toBe('Second paragraph');

                expect(blockElement.textContent).toBe('First paragraph');
                expect(blockElement.nextElementSibling.id).toBe(editor.blocks[1].id);
                expect(blockElement.nextElementSibling.textContent).toBe('First paragraph');
                expect(blockElement.nextElementSibling.nextElementSibling.textContent).toBe('Second paragraph');

                done();
            }, 100);
        });

        it('cut & paste whole block', (done) => {
            const initialBlockCount = editor.blocks.length;
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
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
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editorElement.querySelector('#paragraph1')).toBeNull();

                const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement2);
                setCursorPosition(getBlockContentElement(blockElement2), 0);
                editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(blockElement2.nextElementSibling.id).toBe(editor.blocks[1].id);
                expect(blockElement2.textContent).toBe('Second paragraph');
                expect(blockElement2.nextElementSibling.textContent).toBe('First paragraph');
                done();
            });
        });

        it('copy & paste partial content', (done) => {
            if (editor) editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'block1',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'bold', contentType: ContentType.Text, content: 'Boldedtext', properties: { styles: { bold: true } } },
                            { id: 'italic', contentType: ContentType.Text, content: 'Italictext', properties: { styles: { italic: true } } },
                            { id: 'underline', contentType: ContentType.Text, content: 'Underlinedtext', properties: { styles: { underline: true } } }
                        ]
                    },
                    {
                        id: 'block2',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'test', contentType: ContentType.Text, content: 'TestContent', properties: { styles: { bold: true } } }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            editor.blockManager.setFocusToBlock(editor.element.querySelector('#block1'));
            //create range
            var range = document.createRange();
            var startNode = editor.element.querySelector('#italic').firstChild;
            var endNode = editor.element.querySelector('#underline').firstChild;
            range.setStart(startNode, 0);
            range.setEnd(endNode, 6);
            var selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
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

            const blockElement = editorElement.querySelector('#block2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 4);
            const initialLength = editor.blocks[1].content.length;

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks[1].content.length).toBe(initialLength + 3);
                expect(editor.blocks[1].content[0].content).toBe('Test');
                expect(editor.blocks[1].content[1].content).toBe('Italictext');
                expect((editor.blocks[1].content[1].properties as BaseStylesProp).styles.italic).toBe(true);
                expect(editor.blocks[1].content[2].content).toBe('Underl');
                expect((editor.blocks[1].content[2].properties as BaseStylesProp).styles.underline).toBe(true);
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
            editor.blockManager.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            setCursorPosition(getBlockContentElement(blockElement), 6);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // First block will be splitted at cursor and clipboard's first block content gets merged here
            // Remaining clipboard blocks will be added after this block
            // So, total blocks will be 4
            setTimeout(() => {
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[0].content[0].content).toBe('First ');
                expect(editor.blocks[0].content[1].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[2].content[0].content).toBe('paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('multi block paste when cursor is at start', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            setCursorPosition(getBlockContentElement(blockElement), 0);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            // All Clipboard blocks will be pasted after the focused block
            // So, total blocks will be 4
            setTimeout(() => {
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('First paragraph');
                expect(editor.blocks[2].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[3].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[3].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('multi block paste when cursor is at empty block', function (done) {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 0);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(function () {
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].content[0].content).toBe('First paragraph');
                expect(editor.blocks[1].content[0].content).toBe('Second paragraph');
                expect(editor.blocks[2].content[0].content).toBe('Second paragraph');

                expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('First paragraph');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('Second paragraph');
                expect(editorElement.querySelectorAll('.e-block')[2].querySelector('p').textContent).toBe('Second paragraph');
                done();
            });
        });

        it('multi block paste in child type block when cursor is at empty', function (done) {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const initialOuterDOMBlocksCount = document.querySelectorAll('.e-block-container-wrapper > .e-block').length;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.selectAllBlocks();
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

            const lastBlockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(lastBlockElement);

            editor.addBlock({
                id: 'callout-block',
                blockType: BlockType.Callout,
                properties: {
                    children: [{
                        id: 'callout-child1',
                        blockType: BlockType.Paragraph,
                        content: [{ id: 'callout-child1-content', contentType: ContentType.Text, content: '' }]
                    }]
                }
            }, lastBlockElement.id);

            const initialOuterBlocksCount = editor.blocks.length;
            const calloutParentBlock = editorElement.querySelector('#callout-block') as HTMLElement;
            const calloutChildBlock = editorElement.querySelector('#callout-child1') as HTMLElement;
            editor.blockManager.setFocusToBlock(calloutChildBlock);

            const contentElement = getBlockContentElement(calloutChildBlock);
            setCursorPosition(contentElement, 0);

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(function () {
                expect(editor.blocks.length).toBe(initialOuterBlocksCount);
                expect(document.querySelectorAll('.e-block-container-wrapper > .e-block').length).toBe(initialOuterDOMBlocksCount);
                expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(2);
                expect((editor.blocks[2].properties as BaseChildrenProp).children[0].content[0].content).toBe('First paragraph');
                expect((editor.blocks[2].properties as BaseChildrenProp).children[1].content[0].content).toBe('Second paragraph');

                expect(calloutParentBlock.querySelectorAll('.e-block').length).toBe(2);
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
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'source-content', contentType: ContentType.Text, content: 'Source text to copy' }
                        ]
                    },
                    {
                        id: 'target-block',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'target-content', contentType: ContentType.Text, content: 'This text will be partially selected' }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');

            // Copy content from the first block
            const sourceBlock = editorElement.querySelector('#source-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(sourceBlock);
            const sourceRange = document.createRange();
            const sourceContent = sourceBlock.querySelector('#source-content') as HTMLElement;
            sourceRange.selectNodeContents(sourceContent);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(sourceRange);

            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload();

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
            editor.blockManager.setFocusToBlock(targetBlock);
            const targetRange = document.createRange();
            const targetContent = targetBlock.querySelector('#target-content') as HTMLElement;
            targetRange.setStart(targetContent.firstChild, 5); // 'This '
            targetRange.setEnd(targetContent.firstChild, 18); // 'This text will be'

            selection.removeAllRanges();
            selection.addRange(targetRange);

            //this should delete the selected content and paste new content
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

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
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'source-content', contentType: ContentType.Text, content: 'Source text to copy. This text will be' }
                        ]
                    },
                    {
                        id: 'target-block',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'target-content', contentType: ContentType.Text, content: 'partially selected' }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');

            // Copy content from the first block
            const sourceBlock = editorElement.querySelector('#source-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(sourceBlock);
            const sourceRange = document.createRange();
            const sourceContent = sourceBlock.querySelector('#source-content') as HTMLElement;
            sourceRange.setStart(sourceContent.firstChild, 0);
            sourceRange.setEnd(sourceContent.firstChild, 20);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(sourceRange);

            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload();

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
            editor.blockManager.setFocusToBlock(targetBlock);
            const targetRange = document.createRange();
            const targetContent = targetBlock.querySelector('#target-content') as HTMLElement;
            targetRange.setStart(sourceContent.firstChild, 21);
            targetRange.setEnd(targetContent.firstChild, 10);

            selection.removeAllRanges();
            selection.addRange(targetRange);

            //this should delete the selected content and paste new content
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

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
                { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }] }
            ];
            editor = createEditor({
                blocks: blocks,
                pasteCleanupSettings: {
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(4); // Original + 3 new lines
                expect(editor.blocks[0].content[0].content).toBe('Hello world');
                expect(editor.blocks[1].content[0].content).toBe('Line 1');
                expect(editor.blocks[2].content[0].content).toBe('Line 2');
                expect(editor.blocks[3].content[0].content).toBe('Line 3');

                const blockElements = editor.blockContainer.querySelectorAll('.e-block');
                expect(blockElements.length).toBe(4);
                expect(blockElements[0].textContent).toBe('Hello world');
                expect(blockElements[1].textContent).toBe('Line 1');
                expect(blockElements[2].textContent).toBe('Line 2');
                expect(blockElements[3].textContent).toBe('Line 3');
                done();
            }, 100);
        });

        it('should call handlePlainTextPaste with raw text when no html is present', (done) => {
            const plainText = 'This is some plain text directly passed.';
            // Mock clipboard event with only plain text and no HTML
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/plain') {
                        return plainText;
                    }
                    if (format === 'text/html') {
                        return ''; // No HTML data
                    }
                    return '';
                }
            });

            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            // Spy on handlePlainTextPaste to ensure it's called with the correct argument
            const handlePlainTextPasteSpy = spyOn(editor.blockManager.clipboardAction as any, 'handlePlainTextPaste').and.callThrough();

            // Trigger paste event
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                // Assert that handlePlainTextPaste was called
                expect(handlePlainTextPasteSpy).toHaveBeenCalledWith(plainText);

                // Verify the created blocks match the raw plain text
                // Since this will create a new block for the pasted content
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].content.length).toBe(1);
                expect(editor.blocks[1].content[0].content).toBe(plainText);
                
                const blockElements = editor.blockContainer.querySelectorAll('.e-block');
                expect(blockElements.length).toBe(2);
                expect(blockElements[1].textContent).toBe(plainText);
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            // Trigger paste event
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(4); // Original + 3 new list items
                expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);
                expect(editor.blocks[2].blockType).toBe(BlockType.BulletList);
                expect(editor.blocks[3].blockType).toBe(BlockType.BulletList);
                
                const blockElements = editor.blockContainer.querySelectorAll('.e-block');
                expect(blockElements.length).toBe(4);
                expect(blockElements[0].textContent).toBe('Hello world');
                expect(blockElements[1].textContent).toBe('Item 1');
                expect(blockElements[2].textContent).toBe('Item 2');
                expect(blockElements[3].textContent).toBe('Item 3');
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            // Trigger paste event
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(4); // Original + 3 new list items
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);

                const blockElements = editor.blockContainer.querySelectorAll('.e-block');
                expect(blockElements.length).toBe(4);
                expect(blockElements[0].textContent).toBe('Hello world');
                expect(blockElements[1].textContent).toBe('Item 1');
                expect(blockElements[2].textContent).toBe('Item 2');
                expect(blockElements[3].textContent).toBe('Item 3');
                done();
            }, 100);
        });
    });

    describe('Paste HTML Content', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        const blocks: BlockModel[] = [
            { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }] }
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
            let contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            // Trigger paste event
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].content.length).toBe(5);
                expect(editor.blocks[1].content[0].content).toBe('Formatted ');
                expect(editor.blocks[1].content[1].content).toBe('bold');
                expect((editor.blocks[1].content[1].properties as BaseStylesProp).styles.bold).toBe(true);
                expect(editor.blocks[1].content[2].content).toBe(' and ');
                expect(editor.blocks[1].content[3].content).toBe('italic');
                expect((editor.blocks[1].content[3].properties as BaseStylesProp).styles.italic).toBe(true);
                expect(editor.blocks[1].content[4].content).toBe(' text');

                const contentElement1 = getBlockContentElement(document.getElementById(editor.blocks[1].id));
                expect(contentElement1.childNodes.length).toBe(5);
                expect(contentElement1.childNodes[0].textContent).toBe('Formatted ');
                expect(contentElement1.childNodes[1].textContent).toBe('bold');
                expect((contentElement1.childNodes[1] as HTMLElement).tagName).toBe('STRONG');
                expect((contentElement1.childNodes[2] as HTMLElement).textContent).toBe(' and ');
                expect((contentElement1.childNodes[3] as HTMLElement).textContent).toBe('italic');
                expect((contentElement1.childNodes[3] as HTMLElement).tagName).toBe('EM');
                expect((contentElement1.childNodes[4] as HTMLElement).textContent).toBe(' text');
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
            let contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            // Trigger paste event
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(6); // Original + 5 list items
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[4].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[5].blockType).toBe(BlockType.NumberedList);

                expect(editor.blocks[1].content[0].content).toBe('Item 1');
                expect(editor.blocks[2].content[0].content).toBe('Item 2');
                expect(editor.blocks[3].indent).toBe(1);
                expect(editor.blocks[3].content[0].content).toBe('Subitem 2.1');
                expect(editor.blocks[4].indent).toBe(1);
                expect(editor.blocks[4].content[0].content).toBe('Subitem 2.2');
                expect(editor.blocks[5].content[0].content).toBe('Item 3');

                //DOm check
                const blockElements = editor.blockContainer.querySelectorAll('.e-block');
                expect(blockElements.length).toBe(6);
                expect(blockElements[0].textContent).toBe('Hello world');
                expect(blockElements[1].textContent).toBe('Item 1');
                expect(blockElements[2].textContent).toBe('Item 2');
                expect(blockElements[3].textContent).toBe('Subitem 2.1');
                expect((blockElements[3] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');
                expect(blockElements[4].textContent).toBe('Subitem 2.2');
                expect((blockElements[4] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');
                expect(blockElements[5].textContent).toBe('Item 3');

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
            let contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            // Trigger paste event
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('Inline element within block');
                expect(editor.blocks[0].content[1].content).toBe('Hello world');

                //DOM
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                contentElement = getBlockContentElement(blockElement);
                expect(contentElement.childNodes[0].textContent).toBe('Inline element within block');
                expect(contentElement.childNodes[1].textContent).toBe('Hello world');
                done();
            }, 100);
        });

        it('should strip out harmful tags when enableHtmlSanitizer is true', (done) => {
            // Mock clipboard event with HTML content
            const mockEvent = createMockClipboardEvent('paste', {
                getData: (format: string) => {
                    if (format === 'text/html') {
                        return '<p>This is a safe text</p><script> alert("xss")</script>';
                    }
                    return '';
                }
            });
            const blockElement: HTMLElement = editorElement.querySelector('#paragraph') as HTMLElement;
            let contentElement: HTMLElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            // Trigger paste event
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect(editor.blocks[1].content[0].content).not.toContain('script');
                expect(editor.blocks[2].content[0].content).not.toContain('script');

                contentElement = getBlockContentElement(blockElement);
                expect(contentElement.childNodes[0].textContent).not.toContain('script');
                expect(contentElement.childNodes[0].textContent).not.toContain('script');
                done();
            }, 100);
        });
    });

    describe('Copy to External Applications', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        const externalClipboardBlocks: BlockModel[] = [
            {
                id: 'heading-block',
                blockType: BlockType.Heading,
                properties: { level: 1 },
                content: [{
                    id: 'heading-content',
                    contentType: ContentType.Text,
                    content: 'Welcome to the Block Editor Demo!'
                }]
            },
            {
                id: 'intro-block',
                blockType: BlockType.Paragraph,
                content: [{
                    id: 'intro-content',
                    contentType: ContentType.Text,
                    content: 'Block Editor is a powerful rich text editor',
                }]
            },
            {
                id: 'styled-paragraph',
                blockType: BlockType.Paragraph,
                content: [
                    {
                        id: 'styled-text-1',
                        contentType: ContentType.Text,
                        content: 'Try selecting text to see '
                    },
                    {
                        id: 'styled-text-2',
                        contentType: ContentType.Text,
                        content: 'formatting options',
                        properties: {
                            styles: {
                                bold: true,
                                italic: true
                            }
                        }
                    },
                    {
                        id: 'styled-text-3',
                        contentType: ContentType.Text,
                        content: ', or type '
                    },
                    {
                        id: 'styled-text-4',
                        contentType: ContentType.Text,
                        content: '"/"',
                        properties: {
                            styles: {
                                backgroundColor: '#F0F0F0',
                                bold: true
                            }
                        }
                    },
                    {
                        id: 'styled-text-5',
                        contentType: ContentType.Text,
                        content: ' to access the command menu.'
                    }
                ]
            },
            {
                id: 'block-types-heading',
                blockType: BlockType.Heading,
                properties: { level: 2 },
                content: [{
                    id: 'block-types-heading-content',
                    contentType: ContentType.Text,
                    content: 'Block Types'
                }]
            },
            {
                id: 'quote-block',
                blockType: BlockType.Quote,
                content: [{
                    id: 'quote-content',
                    contentType: ContentType.Text,
                    content: 'The Block Editor makes document creation a seamless experience with its intuitive block-based approach.',
                    properties: {
                        styles: {
                            italic: true
                        }
                    }
                }]
            },
            {
                id: 'list-types-heading',
                blockType: BlockType.Heading,
                properties: { level: 3 },
                content: [{
                    id: 'list-types-heading-content',
                    contentType: ContentType.Text,
                    content: 'List Types'
                }]
            },
            {
                id: 'bullet-list-header',
                blockType: BlockType.BulletList,
                content: [{
                    id: 'bullet-list-header-content',
                    contentType: ContentType.Text,
                    content: 'Text blocks: Paragraph, Heading 1-4, Quote, Callout',
                    properties: {
                        styles: {
                            bold: true
                        }
                    }
                }]
            },
            {
                id: 'numbered-list',
                blockType: BlockType.NumberedList,
                content: [{
                    id: 'numbered-list-content',
                    contentType: ContentType.Text,
                    content: 'Lists: Bullet lists, Numbered lists, Check lists'
                }]
            },
            {
                id: 'check-list',
                blockType: BlockType.Checklist,
                properties: { isChecked: true },
                content: [{
                    id: 'check-list-content',
                    contentType: ContentType.Text,
                    content: 'Special blocks: Divider, Toggle, Code block'
                }]
            },
            {
                id: 'divider-block',
                blockType: BlockType.Divider,
                content: []
            },
            {
                id: 'formatting-heading',
                blockType: BlockType.Heading,
                properties: { level: 4 },
                content: [{
                    id: 'formatting-heading-content',
                    contentType: ContentType.Text,
                    content: 'Text Formatting Examples'
                }]
            },
            {
                id: 'formatting-examples',
                blockType: BlockType.Paragraph,
                content: [
                    {
                        id: 'format-bold',
                        contentType: ContentType.Text,
                        content: 'Bold ',
                        properties: {
                            styles: {
                                bold: true
                            }
                        }
                    },
                    {
                        id: 'format-italic',
                        contentType: ContentType.Text,
                        content: 'Italic ',
                        properties: {
                            styles: {
                                italic: true
                            }
                        }
                    },
                    {
                        id: 'format-underline',
                        contentType: ContentType.Text,
                        content: 'Underline ',
                        properties: {
                            styles: {
                                underline: true
                            }
                        }
                    },
                    {
                        id: 'format-strikethrough',
                        contentType: ContentType.Text,
                        content: 'Strikethrough ',
                        properties: {
                            styles: {
                                strikethrough: true
                            }
                        }
                    },
                    {
                        id: 'format-superscript',
                        contentType: ContentType.Text,
                        content: 'Superscript ',
                        properties: {
                            styles: {
                                superscript: true
                            }
                        }
                    },
                    {
                        id: 'format-subscript',
                        contentType: ContentType.Text,
                        content: 'Subscript ',
                        properties: {
                            styles: {
                                subscript: true
                            }
                        }
                    },
                    {
                        id: 'format-uppercase',
                        contentType: ContentType.Text,
                        content: 'uppercase ',
                        properties: {
                            styles: {
                                uppercase: true
                            }
                        }
                    },
                    {
                        id: 'format-lowercase',
                        contentType: ContentType.Text,
                        content: 'LOWERCASE',
                        properties: {
                            styles: {
                                lowercase: true
                            }
                        }
                    }
                ]
            },
            {
                id: 'link-block',
                blockType: BlockType.Paragraph,
                content: [
                    {
                        id: 'link-text',
                        contentType: ContentType.Text,
                        content: 'Visit '
                    },
                    {
                        id: 'link-content',
                        contentType: ContentType.Link,
                        content: 'Syncfusion',
                        properties: {
                            url: 'https://www.syncfusion.com/'
                        }
                    },
                    {
                        id: 'link-text-end',
                        contentType: ContentType.Text,
                        content: ' for more information.'
                    }
                ]
            },
            {
                id: 'table-block',
                blockType: BlockType.Table
            },
            {
                id: 'label-block',
                blockType: BlockType.Paragraph,
                content: [
                    {
                        id: 'label-text',
                        contentType: ContentType.Text,
                        content: 'This block contains a '
                    },
                    {
                        id: 'progress-label',
                        contentType: ContentType.Label,
                        properties: {
                            labelId: 'progress'
                        }
                    },
                    {
                        id: 'label-text-end',
                        contentType: ContentType.Text,
                        content: ' label.'
                    },
                    {
                        id: 'code-text',
                        contentType: ContentType.Text,
                        content: 'Add inline code '
                    },
                    {
                        id: 'inline-code-value',
                        contentType: ContentType.Text,
                        content: 'const x=10',
                        properties: {
                            styles: {
                                inlineCode: true
                            }
                        }
                    },
                ]
            },
            {
                id: 'try-it-block',
                blockType: BlockType.Paragraph,
                content: [{
                    id: 'try-it-content',
                    contentType: ContentType.Text,
                    content: 'Try it out! Click anywhere and start typing, or type "/" to see available commands.',
                    properties: {
                        styles: {
                            bold: true,
                            backgroundColor: '#F8F9FA'
                        }
                    }
                }]
            }
        ];

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({ blocks: externalClipboardBlocks });
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
            const { html, text, blockeditorData }: IClipboardPayloadOptions = editor.blockManager.clipboardAction.getClipboardPayload();
            expect(html).toContain('<h1>Welcome to the Block Editor Demo!</h1>');
            expect(html).toContain('<p>Block Editor is a powerful rich text editor</p>');
            expect(html).toContain('<p>Try selecting text to see <em><strong>formatting options</strong></em>, or type <strong><span style="background-color: #F0F0F0;">&quot;/&quot;</span></strong> to access the command menu.</p>');
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
            expect(html).toContain('<table><thead><tr><th>Column 1</th><th>Column 2</th></tr></thead><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>');
            expect(html).toContain('<p>This block contains a Progress: In-progress label.Add inline code <code>const x=10</code></p>');
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
                    blockType: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        contentType: ContentType.Text,
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
            editor.blockManager.setFocusToBlock(codeBlock);

            // Get the code content element
            const codeContent = codeBlock.querySelector('.e-code-content') as HTMLElement;
            setCursorPosition(codeContent, codeContent.textContent.length);

            // Paste the code
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

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
            editor.blockManager.setFocusToBlock(codeBlock);

            // Get the code content element
            const codeContent = codeBlock.querySelector('.e-code-content') as HTMLElement;
            setCursorPosition(codeContent, codeContent.textContent.length);

            // Paste the mixed content
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                // The content should be pasted as plain text in the code block
                expect(editor.blocks[0].blockType).toBe(BlockType.Code);
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

            spyOn((editor.blockManager.clipboardAction as any), 'handleCodeBlockContentPaste').and.callFake(() => { });

            // Select the code block
            const codeBlock = editorElement.querySelector('#code-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(codeBlock);

            // Get the code content element
            const codeContent = codeBlock.querySelector('.e-code-content') as HTMLElement;
            editor.blockManager.nodeSelection.createRangeWithOffsets(
                codeContent.firstChild, codeContent.firstChild, 0, codeContent.textContent.length
            );

            // Paste the code
            editor.blockManager.clipboardAction.handlePaste(mockEvent);

            setTimeout(() => {
                expect((editor.blockManager.clipboardAction as any).handleCodeBlockContentPaste).toHaveBeenCalled();
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
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph1-content', contentType: ContentType.Text, content: 'Context menu clipboard test' }
                    ]
                },
                {
                    id: 'paragraph2',
                    blockType: BlockType.Paragraph,
                    content: [
                        { id: 'paragraph2-content', contentType: ContentType.Text, content: 'Second paragraph' }
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
            const spy = spyOn(editor.blockManager.clipboardAction, 'getClipboardPayload').and.returnValue({
                html: '<p>Test HTML</p>',
                text: 'Test text',
                blockeditorData: JSON.stringify({ block: { id: 'test', content: [] } })
            });

            // Mock the clipboard.write method
            const writePromise = Promise.resolve();
            spyOn((navigator as any).clipboard, 'write').and.returnValue(writePromise);

            // Select content
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Call context copy
            editor.blockManager.clipboardAction.handleContextCopy().then(() => {
                expect(spy).toHaveBeenCalled();
                expect((navigator as any).clipboard.write).toHaveBeenCalled();
                done();
            }).catch(done.fail);
        });

        it('should handle context cut operation', (done) => {
            // Spy on related methods
            const copySpy = spyOn(editor.blockManager.clipboardAction, 'handleContextCopy').and.returnValue(Promise.resolve());
            const cutSpy = spyOn(editor.blockManager.clipboardAction as any, 'performCutOperation').and.callThrough();

            // Select content
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Create a selection range
            const range = document.createRange();
            const contentElement = blockElement.querySelector('#paragraph1-content');
            range.selectNodeContents(contentElement);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Call context cut
            editor.blockManager.clipboardAction.handleContextCut().then(() => {
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
            const pasteSpy = spyOn(editor.blockManager.clipboardAction as any, 'performPasteOperation').and.callThrough();

            // Set cursor in block
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            // Call context paste
            editor.blockManager.clipboardAction.handleContextPaste().then(() => {
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
            const pasteSpy = spyOn(editor.blockManager.clipboardAction as any, 'performPasteOperation').and.callThrough();
            const imagePasteHandler = spyOn(editor.blockManager.blockRenderer.imageRenderer, 'handleFilePaste').and.callFake(() => Promise.resolve());

            // Set cursor in block
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            // Call context paste
            editor.blockManager.clipboardAction.handleContextPaste().then(() => {
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

            editor.blockManager.clipboardAction.isClipboardEmpty().then((isEmpty) => {
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            const pasteSpy = spyOn(editor.blockManager.clipboardAction as any, 'performPasteOperation').and.callThrough();

            editor.blockManager.clipboardAction.handleContextPaste().then(() => {
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

    describe('Edge cases testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph-1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content-1', contentType: ContentType.Text, content: 'Hello world 1' }] },
                { id: 'paragraph-2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content-2', contentType: ContentType.Text, content: 'Hello world 2' }] }
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
            const blocks = (editor.blockManager.clipboardAction as any).createPartialBlockModels(document.createElement('div'), []);
            expect(blocks.length).toBe(0);

            // Invalid content element
            const container = document.createElement('div');
            container.innerHTML = '<p id="fakeelement">Test</p>';

            const contents = (editor.blockManager.clipboardAction as any).createPartialContentModels(container, editor.blocks[0]);
            expect(contents.length).toBe(0);

            // Sending null data for parse will be catched by try catch block
            const spyconsole = spyOn(console, 'error').and.callFake(() => { });
            const parsedData = (editor.blockManager.clipboardAction as any).handleBlockEditorPaste('this is not valid json', '');
            expect(parsedData).toBeUndefined();
            expect(console.error).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Error parsing Block Editor clipboard data:', jasmine.any(Error));
            spyconsole.calls.reset();

            //Pasting empty content
            const pasteData = (editor.blockManager.clipboardAction as any).handleContentPasteWithinBlock([]);
            expect(pasteData).toBeUndefined();

            var rangeSpy = spyOn(editor.blockManager.nodeSelection, 'getRange').and.returnValue(null);
            //Range test
            const pasteData1 = (editor.blockManager.clipboardAction as any).handleContentPasteWithinBlock([{ content: 'Fake' }]);
            expect(pasteData1).toBeUndefined();

            // Sending null data
            const data1 = (editor.blockManager.clipboardAction as any).handleMultiBlocksPaste([]);
            expect(data1).toBeUndefined();

            // Range test
            const data2 = (editor.blockManager.clipboardAction as any).handleMultiBlocksPaste([{ type: 'Fake' }]);
            expect(data2).toBeUndefined();

            const text = getBlockText({ content: null })
            expect(text).toBe('');
            rangeSpy.calls.reset();
            done();
        });

        it('should exit when before paste event is prevented', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);

            editor.beforePasteCleanup = (args) => {
                args.cancel = true;
            }

            (editor.blockManager.clipboardAction as any).performPasteOperation({
                html: '', text: '', file: null
            });

            expect(editor.blocks.length).toBe(2);
            done();
        });

        it('should focus prev block when cut performed on last block', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-2') as HTMLElement;
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
                    expect(editor.blocks.length).toBe(1);
                    expect(editor.blockManager.currentFocusedBlock.id).toBe('paragraph-1');
                    done();
                }, 300);
            }, 200);
        });

        it('should paste image from clipboard properly', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
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
                    getData: () => { },
                    items: mockItems
                };

                editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

                setTimeout(() => {
                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[1].blockType).toBe(BlockType.Image);
                    expect(editorElement.querySelector('img')).not.toBeNull();
                    done();
                }, 500);
            }, 200);
        });
    });
});
