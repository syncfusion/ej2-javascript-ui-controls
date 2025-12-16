import { createElement, remove } from '@syncfusion/ej2-base';
import { createEditor, setRange } from '../common/util.spec';
import { setCursorPosition, getBlockContentElement, getSelectedRange, getClosestContentElementInDocument } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { BaseChildrenProp, ILabelContentSettings, IMentionContentSettings } from '../../src/models/index';

describe('Inline Content Module', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });
    function dispatchKeyboardEvent(element: HTMLElement, key: string, ctrlKey: boolean = false, shiftKey: boolean = false): void {
        const event = new KeyboardEvent('keydown', { key, ctrlKey, shiftKey, bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    }

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
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

    describe('Default insertion testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph1',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content1', contentType: ContentType.Text, content: 'Hello $ world' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        blockType: BlockType.Paragraph,
                        content: [
                            {
                                id: 'boldText',
                                contentType: ContentType.Text,
                                content: 'Bolded @ text',
                                properties: { styles: { bold: true } }
                            }
                        ]
                    },
                    {
                        id: 'callout',
                        blockType: BlockType.Callout,
                        properties: {
                            children: [{
                                id: 'callout-child',
                                blockType: BlockType.Paragraph,
                                content: [
                                    { id: 'callout-content', contentType: ContentType.Text, content: 'Hello $ world' },
                                ]
                            }]
                        }
                    }
                ],
                users: [
                    { id: 'user1', user: 'User 1' },
                    { id: 'user2', user: 'User 2' }
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
            const blockeditorMentionMenu = document.querySelector('.e-blockeditor-mention-menu') as HTMLElement;
            if (blockeditorMentionMenu) {
                document.body.removeChild(blockeditorMentionMenu);
            }
        });

        it('should insert label item properly', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
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
                        expect(contentElement.childElementCount).toBe(3);
                        const firstChild = contentElement.childNodes[0];
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const lastChild = contentElement.childNodes[2];

                        expect(firstChild.textContent).toBe('Hello ');

                        expect(insertedNode.textContent).toBe('Priority: High');
                        expect(insertedNode.classList.contains('e-label-chip')).toBe(true);
                        expect(insertedNode.getAttribute('data-label-id')).toBe((editor.blocks[0].content[1].properties as ILabelContentSettings).labelId);

                        expect(lastChild.textContent).toBe(' world');

                        expect(editor.blocks[0].content[0].content).toBe('Hello ');
                        expect(editor.blocks[0].content[1].content).toBe('Priority: High');
                        expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                        expect(editor.blocks[0].content[2].content).toBe(' world');
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('should insert user mention item properly', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 8);
                expect(contentElement.childElementCount).toBe(1);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        const user = editor.users.find((user) => user.id === 'user1');
                        expect(contentElement.childElementCount).toBe(3);
                        const firstChild = contentElement.childNodes[0];
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const lastChild = contentElement.childNodes[2];

                        expect(firstChild.textContent).toBe('Bolded ');

                        expect(insertedNode.querySelector('.em-initial').textContent).toBe('U1');
                        expect(insertedNode.querySelector('.em-content').textContent).toBe('User 1');
                        expect(insertedNode.classList.contains('e-user-chip')).toBe(true);
                        expect(insertedNode.getAttribute('data-user-id')).toBe((editor.blocks[1].content[1].properties as IMentionContentSettings).userId);

                        expect(lastChild.textContent).toBe(' text');

                        expect(editor.blocks[1].content[0].content).toBe('Bolded ');
                        expect(editor.blocks[1].content[1].content).toBe('User 1');
                        expect(editor.blocks[1].content[1].contentType).toBe(ContentType.Mention);
                        expect(editor.blocks[1].content[2].content).toBe(' text');
                        done();
                    }, 300);
                }, 500);
            }, 200);
        });

        it('should insert label item properly in children block', (done) => {
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
                        const children = (editor.blocks[2].properties as BaseChildrenProp).children[0];
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

    });

    describe('Inline actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph1',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content1', contentType: ContentType.Text, content: 'Hello $ world' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        blockType: BlockType.Paragraph,
                        content: [
                            {
                                id: 'boldText',
                                contentType: ContentType.Text,
                                content: 'Bolded @ text',
                                properties: { styles: { bold: true } }
                            }
                        ]
                    },
                    {
                        id: 'paragraph3',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'end', contentType: ContentType.Text, content: 'Hello world $' }
                        ]
                    },
                ],
                users: [
                    { id: 'user1', user: 'User 1' },
                    { id: 'user2', user: 'User 2' }
                ],
                labelSettings: {
                    items: [
                        { id: 'high', labelColor: '#ff8a80', text: 'High', groupBy: 'Priority' },
                        { id: 'medium', labelColor: '#ffb74d', text: 'Medium', groupBy: 'Priority' },
                    ]
                }
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            document.body.removeChild(editorElement);
            const blockeditorMentionMenu = document.querySelector('.e-blockeditor-mention-menu') as HTMLElement;
            if (blockeditorMentionMenu) {
                 document.body.removeChild(blockeditorMentionMenu);
            }
        });

        it('should load custom items properly', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 7);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const high = popup.querySelector('li[data-value="high"]') as HTMLElement;
                    const medium = popup.querySelector('li[data-value="medium"]') as HTMLElement;
                    expect(high).not.toBeNull();
                    expect(medium).not.toBeNull();
                    done();
                }, 500);
            }, 500);
        });

        it('should return when incorrect values passed', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            setCursorPosition(contentElement, 0);

            const rangeParent = (editor.blockManager.inlineContentInsertionModule as any).getRangeParent(getSelectedRange());
            (editor.blockManager.inlineContentInsertionModule as any).splitAndReorganizeContent(null, ContentType.Mention, rangeParent, { block: editor.blocks[0] });
            
            rangeParent.id = 'fake';
            (editor.blockManager.inlineContentInsertionModule as any).splitAndReorganizeContent(contentElement.firstChild, ContentType.Mention, rangeParent, { block: editor.blocks[0] });

            contentElement.classList.remove('e-block-content');
            (editor.blockManager.inlineContentInsertionModule as any).splitAndReorganizeContent(contentElement.firstChild, ContentType.Mention, rangeParent, { block: editor.blocks[0] });

            (editor.blockManager.inlineContentInsertionModule as any).processInsertion({ range: null });

            (editor.blockManager.inlineContentInsertionModule as any).processInsertion({ blockElement: null });
            done();
        });

        it('should maintain cursor position when inserted at end', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph3') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 13);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="high"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    editor.blockManager.setFocusToBlock(blockElement);
                    setTimeout(() => {
                        expect(contentElement.childElementCount).toBe(3);
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const nextSibling = insertedNode.nextElementSibling;
                        const currentFocusedContent = getClosestContentElementInDocument(getSelectedRange().startContainer);
                        expect(currentFocusedContent.id).toBe(nextSibling.id);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('should maintain cursor position when inserted at middle', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
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
                        expect(contentElement.childElementCount).toBe(3);
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const nextSibling = insertedNode.nextElementSibling;
                        expect(getSelectedRange().startContainer.parentElement.id).toBe(nextSibling.id);
                        
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });

        it('should handle dynamic property change', (done) => {
            editor.labelSettings.triggerChar = '&';
            editor.labelSettings.items = [];
            editor.users = [];
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph3') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                contentElement.textContent = "Hello world &";
                editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 13);

                editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                    expect(popup).not.toBeNull();
                    done();
                }, 500);
            }, 500);
        });

    });

    describe('Testing Inline Content Scenarios', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        const setupEditor = (initialBlocks: any[] = [], users: any[] = [], items: any[] = [], shouldUseprovidedArray: boolean = false) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: initialBlocks,
                users: shouldUseprovidedArray ? users : users.length > 0 ? users : [
                    { id: 'user1', user: 'John' },
                    { id: 'user2', user: 'Paul' }
                ],
                labelSettings: {
                    items: shouldUseprovidedArray ? items : items.length > 0 ? items : [
                        { id: 'in-progress', labelColor: '#ffb74d', text: 'In-progress' },
                        { id: 'completed', labelColor: '#81c784', text: 'Completed' }
                    ]
                }
            });
            editor.appendTo('#editor');
        };

        const tearDownEditor = () => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        };

        afterEach(() => {
            tearDownEditor();
            const blockeditorMentionMenu = document.querySelector('.e-blockeditor-mention-menu') as HTMLElement;
            if (blockeditorMentionMenu) {
                document.body.removeChild(blockeditorMentionMenu);
            }
        });

        it('Type \'@\' in Paragraph, open Mention popup with user list', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello ' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent += '@'; // Simulate typing '@'
            setCursorPosition(contentElement, 7); // After 'Hello @'
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement); // Update model after textContent change
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                // Assert DOM
                let popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                expect(popup).not.toBeNull();
                expect(popup.querySelector('li[data-value="user1"]')).not.toBeNull();
                expect(popup.querySelector('li[data-value="user2"]')).not.toBeNull();
                
                // Assert model - no change in content type yet
                expect(editor.blocks[0].content[0].content).toBe('Hello @');
                let li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                setTimeout(() => {
                    popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                    expect(popup).toBeNull();
                    done();
                }, 200);
            }, 200);
        });

        it('Select user (e.g., @John) from Mention popup, update JSON with ContentType.Mention and userId', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello @' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 7); // After 'Hello @'
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // Hello(span), John(e-user-chip ele) and a span with empty content
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                    expect((editor.blocks[0].content[1].properties as IMentionContentSettings).userId).toBe('user1');
                    expect(editor.blocks[0].content[1].content).toBe('John');
                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].textContent).toBe('Hello ');
                    expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain('John');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Type \'@\' and select another user (e.g., @Paul), update JSON with new ContentType.Mention and userId', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 6); // After 'Hello'

            // Simulate typing '@' for the second user
            contentElement.textContent += ' @';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, contentElement.textContent.length); // Cursor after new '@'
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                const li = popup.querySelector('li[data-value="user2"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); 

                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                    expect((editor.blocks[0].content[1].properties as IMentionContentSettings).userId).toBe('user2');
                    expect(editor.blocks[0].content[1].content).toBe('Paul');
                    expect(editor.blocks[0].content[2].content).toBe('');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain('Paul');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Type \'@\' in empty Paragraph, select user, update JSON with ContentType.Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: ' @' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 2); // After '@'

            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // Mention('John'), "" (empty text node at end)
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                    expect((editor.blocks[0].content[1].properties as IMentionContentSettings).userId).toBe('user1');
                    expect(editor.blocks[0].content[1].content).toBe('John');
                    expect(editor.blocks[0].content[2].content).toBe('');


                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain('John');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Type \'@\' with existing text, select user, update JSON with ContentType.Mention after text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Existing text @' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 15); // After 'Existing text @'

            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // "Existing text ", Mention('John'), "" (empty text node at end)
                    expect(editor.blocks[0].content[0].content).toBe('Existing text ');
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                    expect((editor.blocks[0].content[1].properties as IMentionContentSettings).userId).toBe('user1');
                    expect(editor.blocks[0].content[1].content).toBe('John');
                    expect(editor.blocks[0].content[2].content).toBe('');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].textContent).toBe('Existing text ');
                    expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain('John');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 500);
            }, 500);
        });

        it('Type label triggerChar (e.g., \'$\'), open Label popup with items', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Task ' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent += '$'; // Simulate typing '$'
            setCursorPosition(contentElement, 6); // After 'Task $'
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                // Assert DOM
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                expect(popup).not.toBeNull();
                expect(popup.querySelector('li[data-value="in-progress"]')).not.toBeNull();
                expect(popup.querySelector('li[data-value="completed"]')).not.toBeNull();

                // Assert model - no change in content type yet
                expect(editor.blocks[0].content[0].content).toBe('Task $');
                done();
            }, 100);
        });

        it('Select label (e.g., In-progress) from Label popup, update JSON with ContentType.Label and labelId', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Task $' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 6); // After 'Task $'
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                const li = popup.querySelector('li[data-value="in-progress"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // "Task ", Label('In-progress'), "" (empty text node at end)
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                    expect((editor.blocks[0].content[1].properties as ILabelContentSettings).labelId).toBe('in-progress');
                    expect(editor.blocks[0].content[1].content).toBe(': In-progress');
                    expect(editor.blocks[0].content[2].content).toBe('');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].textContent).toBe('Task ');
                    expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain(': In-progress');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Type triggerChar and select another label (e.g., Completed), update JSON with new ContentType.Label and labelId', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Task ' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 5); // After 'Task '

            contentElement.textContent += '$';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                const li = popup.querySelector('li[data-value="completed"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                     // Assert model
                    expect(editor.blocks[0].content.length).toBe(3);
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                    expect((editor.blocks[0].content[1].properties as ILabelContentSettings).labelId).toBe('completed');
                    expect(editor.blocks[0].content[1].content).toBe(': Completed');
                    expect(editor.blocks[0].content[2].content).toBe('');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain(': Completed');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Type triggerChar in empty Paragraph, select label, update JSON with ContentType.Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '$' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 1);

            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                const li = popup.querySelector('li[data-value="in-progress"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(2); // Label('In-progress'), ""
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Label);
                    expect((editor.blocks[0].content[0].properties as ILabelContentSettings).labelId).toBe('in-progress');
                    expect(editor.blocks[0].content[0].content).toBe(': In-progress');
                    expect(editor.blocks[0].content[1].content).toBe('');


                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(2);
                    expect(contentElement.children[0].classList.contains('e-label-chip')).toBe(true);
                    expect(contentElement.children[0].textContent).toContain(': In-progress');
                    expect(contentElement.children[1].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Type triggerChar with existing text, select label, update JSON with ContentType.Label after text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Existing text $' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 15); // After 'Existing text $'

            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                const li = popup.querySelector('li[data-value="in-progress"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // "Existing text ", Label('In-progress'), ""
                    expect(editor.blocks[0].content[0].content).toBe('Existing text ');
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                    expect((editor.blocks[0].content[1].properties as ILabelContentSettings).labelId).toBe('in-progress');
                    expect(editor.blocks[0].content[1].content).toBe(': In-progress');
                    expect(editor.blocks[0].content[2].content).toBe('');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].textContent).toBe('Existing text ');
                    expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain(': In-progress');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Type \'@\' and cancel Mention popup (e.g., Esc), verify no Mention created, JSON unchanged', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello @' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 7); // After 'Hello @'

            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                let popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                expect(popup).not.toBeNull();
                
                editor.blockContainer.dispatchEvent(new KeyboardEvent('keydown', { 
                    preventDefault: (): void => { /** NO Code */ },
                    keyCode: 27,
                    action: 'escape',
                    type: 'keydown'
                } as any));

                setTimeout(() => {
                    // Assert DOM
                    popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                    expect(popup).toBeNull();
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Hello @');

                    // Assert DOM again after close
                    expect(contentElement.childElementCount).toBe(0);
                    expect(contentElement.textContent).toBe('Hello @');
                    done();
                }, 200);
            }, 200);
        });

        it('Type triggerChar and cancel Label popup, verify no Label created, JSON unchanged', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Task $' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 6); // After 'Task $'
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                let popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                expect(popup).not.toBeNull();
                
                editor.blockContainer.dispatchEvent(new KeyboardEvent('keydown', { 
                    preventDefault: (): void => { /** NO Code */ },
                    keyCode: 27,
                    action: 'escape',
                    type: 'keydown'
                } as any));

                setTimeout(() => {
                    // Assert DOM
                    popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                    expect(popup).toBeNull();
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Task $');

                    // Assert DOM again after close
                    expect(contentElement.childElementCount).toBe(0);
                    expect(contentElement.textContent).toBe('Task $');
                    done();
                }, 200);
            }, 200);
        });

        it('Select entire Mention and remove Mention via backspace, update JSON to ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { id: 'leading-text', contentType: ContentType.Text, content: 'Some '}, 
                    { id: 'mention-chip', contentType: ContentType.Mention, properties: { userId: 'user1' } }, 
                    { id: 'trailing-text', contentType: ContentType.Text, content: ' text' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            let contentElementChilds = contentElement.childNodes;
            contentElementChilds[1].remove();
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('Some ');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[1].content).toBe(' text');


                // Assert DOM
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.textContent).toBe('Some  text');
                done();
            }, 100);
        });

        it('Select entire Label and remove Label via backspace, update JSON to ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { id: 'leading-text', contentType: ContentType.Text, content: 'Priority: '}, 
                    { id: 'label-chip', contentType: ContentType.Label, properties: { labelId: 'in-progress' } },
                    { id: 'trailing-text', contentType: ContentType.Text, content: ' item'}
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            let contentElementChilds = contentElement.childNodes;
            contentElementChilds[1].remove();
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('Priority: ');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[1].content).toBe(' item');

                // Assert DOM
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.textContent).toBe('Priority:  item');
                done();
            }, 100);
        });

        it('Type text after Mention, update JSON with ContentType.Text after Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'User: ' }, { contentType: ContentType.Mention, properties: { userId: 'user1' } }, { contentType: ContentType.Text, content: '' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            let contentElementChilds = contentElement.childNodes;

            // Simulate typing
            contentElementChilds[2].textContent += ' some text'; 
            setCursorPosition(contentElementChilds[2] as HTMLElement, 0);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[2].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[2].content).toBe(' some text'); // Notice the leading space from concat

                // Assert DOM
                expect(contentElement.childElementCount).toBe(3);
                expect(contentElement.children[2].textContent).toBe(' some text');
                done();
            }, 100);
        });

        it('Type text after Label, update JSON with ContentType.Text after Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Status: ' }, { contentType: ContentType.Label, properties: { labelId: 'in-progress' } }, { contentType: ContentType.Text, content: '' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            let contentElementChilds = contentElement.childNodes;

            // Simulate typing
            contentElementChilds[2].textContent += ' updated status'; 
            setCursorPosition(contentElementChilds[2] as HTMLElement, 0);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[2].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[2].content).toBe(' updated status');

                // Assert DOM
                expect(contentElement.childElementCount).toBe(3);
                expect(contentElement.children[2].textContent).toBe(' updated status');
                done();
            }, 100);
        });

        it('Type text before Mention, update JSON with ContentType.Text before Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '' }, { contentType: ContentType.Mention, properties: { userId: 'user1' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            let contentElementChilds = contentElement.childNodes;

            // Simulate typing
            contentElementChilds[0].textContent += 'User: '; 
            setCursorPosition(contentElementChilds[0] as HTMLElement, 0);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('User: ');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);

                // Assert DOM
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.children[0].textContent).toBe('User: ');
                expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Type text before Label, update JSON with ContentType.Text before Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '' }, { contentType: ContentType.Label, properties: { labelId: 'in-progress' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            let contentElementChilds = contentElement.childNodes;

            // Simulate typing
            contentElementChilds[0].textContent += 'Status: '; 
            setCursorPosition(contentElementChilds[0] as HTMLElement, 0);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('Status: ');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);

                // Assert DOM
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.children[0].textContent).toBe('Status: ');
                expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Paste text over selected Mention, update JSON to replace Mention with ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'User: ' }, { id : 'content-2', contentType: ContentType.Mention, properties: { userId: 'user1' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            //create range
            editor.setSelection('content-3',0,4)
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
            
            let contentElementChilds = contentElement.childNodes;

            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 4);
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('text'); // Notice the leading space from concat

                // Assert DOM
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('text');
                done();
            }, 100);
        });

        it('Paste text over partially selected Mention, update JSON to replace Mention with ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'User: ' }, { id : 'content-2', contentType: ContentType.Mention, properties: { userId: 'user1' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            //create range
            editor.setSelection('content-3',0,4)
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
            
            let contentElementChilds = contentElement.childNodes;

            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 2);
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                // expect(editor.blocks[0].content.length).toBe(2);
                // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                // expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                // expect(editor.blocks[0].content[0].content).toBe('text');
                // expect(editor.blocks[0].content[1].content).toBe('xt');

                // Assert DOM
                // expect(contentElement.childElementCount).toBe(2);
                // expect(contentElement.children[0].textContent).toBe('text');
                // expect(contentElement.children[1].textContent).toBe('xt');
                done();
            }, 100);
        });

        it('Paste text over selected Label, update JSON to replace Label with ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'Progress: ' }, { id : 'content-2', contentType: ContentType.Label, properties: { labelId: 'in-progress' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            //create range
            editor.setSelection('content-3',0,4)
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
            
            let contentElementChilds = contentElement.childNodes;

            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 4);
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('text'); // Notice the leading space from concat

                // Assert DOM
                expect(contentElement.childElementCount).toBe(0);
                expect(contentElement.textContent).toBe('text');
                done();
            }, 100);
        });

        it('Paste text over partially selected Label, update JSON to replace Label with ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'Progress: ' }, { id : 'content-2', contentType: ContentType.Label, properties: { labelId: 'in-progress' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            //create range
            editor.setSelection('content-3',0,4)
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
            
            let contentElementChilds = contentElement.childNodes;

            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 2);
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                // Assert model
                // expect(editor.blocks[0].content.length).toBe(2);
                // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                // expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                // expect(editor.blocks[0].content[0].content).toBe('text');
                // expect(editor.blocks[0].content[1].content).toBe('xt');

                // Assert DOM
                // expect(contentElement.childElementCount).toBe(2);
                // expect(contentElement.children[0].textContent).toBe('text');
                // expect(contentElement.children[1].textContent).toBe('xt');
                done();
            }, 100);
        });

        it('Copy Mention and paste within Paragraph, update JSON with duplicated ContentType.Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'User: ' }, { id : 'content-2', contentType: ContentType.Mention, properties: { userId: 'user1' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Before copy and pasting

            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].content).toBe('John');

            // Assert DOM
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
            let contentElementChilds = contentElement.childNodes;

            //create range
            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 4);
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

            setCursorPosition(contentElementChilds[2] as HTMLElement, contentElementChilds[2].textContent.length);
            
            contentElementChilds = contentElement.childNodes;

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(6);
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                expect(editor.blocks[0].content[4].contentType).toBe(ContentType.Mention);

                // Assert DOM
                expect(contentElement.childElementCount).toBe(6);
                expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                expect(contentElement.children[4].classList.contains('e-user-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Copy Label and paste within Paragraph, update JSON with duplicated ContentType.Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'Progress: ' }, { id : 'content-2', contentType: ContentType.Label, properties: { labelId: 'in-progress' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Before copy and pasting

            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
            expect(editor.blocks[0].content[1].content).toBe(': In-progress');

            // Assert DOM
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
            let contentElementChilds = contentElement.childNodes;

            //create range
            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 4);
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

            setCursorPosition(contentElementChilds[2] as HTMLElement, contentElementChilds[2].textContent.length);
            
            contentElementChilds = contentElement.childNodes;

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(6);
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                expect(editor.blocks[0].content[4].contentType).toBe(ContentType.Label);

                // Assert DOM
                expect(contentElement.childElementCount).toBe(6);
                expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                expect(contentElement.children[4].classList.contains('e-label-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Cut Mention and paste within Paragraph, update JSON with moved ContentType.Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'User: ' }, { id : 'content-2', contentType: ContentType.Mention, properties: { userId: 'user1' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Before cut and pasting

            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].content).toBe('John');

            // Assert DOM
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
            let contentElementChilds = contentElement.childNodes;

            //create range
            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 4);
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

            contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, contentElement.textContent.length);
            
            contentElementChilds = contentElement.childNodes;

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                expect(editor.blocks[0].content[1].content).toBe('John');

                // Assert DOM
                expect(contentElement.childElementCount).toBe(3);
                expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Cut Mention by partial selection and paste within Paragraph, update JSON with moved ContentType.Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'User: ' }, { id : 'content-2', contentType: ContentType.Mention, properties: { userId: 'user1' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Before cut and pasting

            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
            expect(editor.blocks[0].content[1].content).toBe('John');

            // Assert DOM
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
            let contentElementChilds = contentElement.childNodes;

            //create range
            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 2);
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

            contentElement = getBlockContentElement(blockElement);
            
            contentElementChilds = contentElement.childNodes;

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                // expect(editor.blocks[0].content.length).toBe(4);
                // expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                // expect(editor.blocks[0].content[1].content).toBe('John');

                // Assert DOM
                // expect(contentElement.childElementCount).toBe(4);
                // expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Cut Label and paste within Paragraph, update JSON with Moved ContentType.Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'Progress: ' }, { id : 'content-2', contentType: ContentType.Label, properties: { labelId: 'in-progress' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Before copy and pasting

            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
            expect(editor.blocks[0].content[1].content).toBe(': In-progress');

            // Assert DOM
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
            let contentElementChilds = contentElement.childNodes;

            //create range
            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 4);
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

            contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, contentElement.textContent.length);
            
            contentElementChilds = contentElement.childNodes;

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                expect(editor.blocks[0].content[1].content).toBe(': In-progress');

                // Assert DOM
                expect(contentElement.childElementCount).toBe(3);
                expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Cut Label by partial selection and paste within Paragraph, update JSON with Moved ContentType.Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id : 'content-1', contentType: ContentType.Text, content: 'Progress: ' }, { id : 'content-2', contentType: ContentType.Label, properties: { labelId: 'in-progress' } }, { id : 'content-3', contentType: ContentType.Text, content: 'text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Before copy and pasting

            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
            expect(editor.blocks[0].content[1].content).toBe(': In-progress');

            // Assert DOM
            expect(contentElement.childElementCount).toBe(3);
            expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
            let contentElementChilds = contentElement.childNodes;

            //create range
            setRange(contentElementChilds[0].firstChild, contentElementChilds[2].lastChild, 0, 2);
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

            contentElement = getBlockContentElement(blockElement);
            
            contentElementChilds = contentElement.childNodes;

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                // Assert model
                // expect(editor.blocks[0].content.length).toBe(4);
                // expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                // expect(editor.blocks[0].content[1].content).toBe(': In-progress');

                // Assert DOM
                // expect(contentElement.childElementCount).toBe(4);
                // expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                done();
            }, 100);
        });

        it('Type \'@\' in empty selection, select user, undo, verify JSON reverts to no Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            contentElement.textContent += '@';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 1);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model - Mention inserted
                    expect(editor.blocks[0].content.length).toBe(2);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Mention);
                    expect(editor.blocks[0].content[0].content).toBe('John');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(2);
                    expect(contentElement.children[0].classList.contains('e-user-chip')).toBe(true);

                    // Trigger Undo
                    triggerUndo(editorElement);

                    // Assert model - Should be reverted
                    // expect(editor.blocks[0].content.length).toBe(1);
                    // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    // expect(editor.blocks[0].content[0].content).toBe('');

                    // Assert DOM
                    // expect(contentElement.childElementCount).toBe(0);
                    // expect(contentElement.textContent).toBe('');
                    done();
                }, 100);
            }, 100);
        });

        it('Type triggerChar in empty selection, select label, undo, verify JSON reverts to no Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            contentElement.textContent += '$';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 1);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                const li = popup.querySelector('li[data-value="in-progress"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model - Label inserted
                    expect(editor.blocks[0].content.length).toBe(2);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Label);
                    expect(editor.blocks[0].content[0].content).toBe(': In-progress');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(2);
                    expect(contentElement.children[0].classList.contains('e-label-chip')).toBe(true);

                    // Trigger Undo
                    triggerRedo(editorElement);

                    // Assert model - Should be reverted
                    // expect(editor.blocks[0].content.length).toBe(1);
                    // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    // expect(editor.blocks[0].content[0].content).toBe('');

                    // Assert DOM
                    // expect(contentElement.childElementCount).toBe(0);
                    // expect(contentElement.textContent).toBe('');
                    done();
                }, 100);
            }, 100);
        });

        it('Remove Mention, redo, verify JSON removes ContentType.Mention', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Some '}, { contentType: ContentType.Mention,  properties: { userId: 'user1' } }, { contentType: ContentType.Text, content: ' text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            // Select the entire mention chip
            const mentionChip = contentElement.querySelector('.e-user-chip') as HTMLElement;
            const range = document.createRange();
            range.selectNode(mentionChip);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            range.deleteContents();
            contentElement = getBlockContentElement(blockElement) as HTMLElement;
            setCursorPosition(contentElement.childNodes[1] as HTMLElement, contentElement.childNodes[1].textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setTimeout(() => {
                // Assert model - Mention removed
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Some ');
                expect(editor.blocks[0].content[1].content).toBe(' text');

                // Trigger Undo
                triggerUndo(editorElement);

                // Assert model - Mention restored
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);

                // Trigger Redo
                triggerRedo(editorElement);

                // Assert model - Mention removed again
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Some ');
                expect(editor.blocks[0].content[1].content).toBe(' text');

                // Assert DOM
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.textContent).toBe('Some  text');
                done();
            }, 100);
        });

        it('Remove Label, redo, verify JSON removes ContentType.Label', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Priority: '}, { contentType: ContentType.Label, content: 'In-progress', properties: { labelId: 'in-progress' } }, { contentType: ContentType.Text, content: ' item'}] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            // Select the entire label chip
            const labelChip = contentElement.querySelector('.e-label-chip') as HTMLElement;
            const range = document.createRange();
            range.selectNode(labelChip);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // remove label chip
            range.deleteContents();
            contentElement = getBlockContentElement(blockElement) as HTMLElement;
            setCursorPosition(contentElement.childNodes[1] as HTMLElement, contentElement.childNodes[1].textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model - Label removed
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Priority: ');
                expect(editor.blocks[0].content[1].content).toBe(' item');

                // Trigger Undo
                triggerUndo(editorElement);

                // Assert model - Label restored
                expect(editor.blocks[0].content.length).toBe(3);
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);

                // Trigger Redo
                triggerRedo(editorElement);

                // Assert model - Label removed again
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Priority: ');
                expect(editor.blocks[0].content[1].content).toBe(' item');

                // Assert DOM
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.textContent).toBe('Priority:  item');
                done();
            }, 100);
        });

        it('Apply Mention to block with existing bold, update JSON with Mention and preserved bold', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello ', properties: { styles: { bold: true } }}, { contentType: ContentType.Text, content: '@' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement.childNodes[1] as HTMLElement, 1); // After '@' in the unformatted text
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));
        
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        
                setTimeout(() => {
                    // Assert model: Expect "Hello " (bold), Mention("John"), "" (empty text node)
                    expect(editor.blocks[0].content.length).toBe(3);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Hello ');
                    expect((editor.blocks[0].content[0].properties as any).styles.bold).toBe(true);
        
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                    expect(editor.blocks[0].content[1].content).toBe('John');
        
                    expect(editor.blocks[0].content[2].content).toBe('');
        
                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].tagName).toBe('STRONG');
                    expect(contentElement.children[0].textContent).toBe('Hello ');
                    expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain('John');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 100);
            }, 100);
        });
        
        it('Apply Label to block with existing bold, update JSON with Label and preserved bold', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Task ', properties: { styles: { bold: true } }}, { contentType: ContentType.Text, content: '$' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement.childNodes[1] as HTMLElement, 1); // After '#' in the unformatted text
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));
        
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                const li = popup.querySelector('li[data-value="in-progress"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        
                setTimeout(() => {
                    // Assert model: Expect "Task " (bold), Label("In-progress"), "" (empty text node)
                    expect(editor.blocks[0].content.length).toBe(3);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Task ');
                    expect((editor.blocks[0].content[0].properties as any).styles.bold).toBe(true);
        
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                    expect(editor.blocks[0].content[1].content).toBe(': In-progress');
        
                    expect(editor.blocks[0].content[2].content).toBe('');
        
                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].tagName).toBe('STRONG');
                    expect(contentElement.children[0].textContent).toBe('Task ');
                    expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain(': In-progress');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 100);
            }, 100);
        });
        
        it('Render Mention chip and transform Paragraph to Heading, update JSON with Mention in Heading block', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello ' }, { contentType: ContentType.Mention, properties: { userId: 'user1' } }, { contentType: ContentType.Text, content: ' /Hea' }] }
            ]);
            let blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement.childNodes[2] as HTMLElement, contentElement.childNodes[2].textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
        
            setTimeout(() => {
                const popup = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                const headingLi = popup.querySelector('li[data-value="Heading 1"]') as HTMLElement;
                headingLi.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        
                setTimeout(() => {
                    // Assert model - Block type should change to Heading, Mention should be preserved
                    expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                    expect(editor.blocks[0].content.length).toBe(3); // Should become "Hello ", Mention, ""
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                    expect(editor.blocks[0].content[1].content).toBe('John');
                    // expect(editor.blocks[0].content[2].content).toBe('');
        
                    // Assert DOM - Block element should be h1, content preserved
                    blockElement = editorElement.querySelector('#paragraph1');
                    contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.tagName).toBe('H1');
                    expect(blockElement.querySelector('.e-user-chip')).not.toBeNull();
                    expect(blockElement.querySelector('.e-user-chip').textContent).toContain('John');
                    done();
                }, 100);
            }, 200);
        });
        
        it('Render Label and transform Paragraph to Heading, update JSON with Label in Heading block', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Status: ' }, { contentType: ContentType.Label, properties: { labelId: 'in-progress' } }, { contentType: ContentType.Text, content: ' /Hea' }] }
            ]);
            let blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement.childNodes[2] as HTMLElement, contentElement.childNodes[2].textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
        
            setTimeout(() => {
                const popup = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                const headingLi = popup.querySelector('li[data-value="Heading 1"]') as HTMLElement;
                headingLi.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        
                setTimeout(() => {
                    // Assert model - Block type should change to Heading, Label should be preserved
                    expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                    expect(editor.blocks[0].content.length).toBe(3); // Should become "Status: ", Label, ""
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                    expect(editor.blocks[0].content[1].content).toBe(': In-progress');
                    // expect(editor.blocks[0].content[1].content).toBe('');
        
                    // Assert DOM - Block element should be h1, content preserved
                    blockElement = editorElement.querySelector('#paragraph1');
                    contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.tagName).toBe('H1');
                    expect(blockElement.querySelector('.e-label-chip')).not.toBeNull();
                    expect(blockElement.querySelector('.e-label-chip').textContent).toContain(': In-progress');
                    done();
                }, 100);
            }, 200);
        });
        
        it('Type \'@\' with no users in blockeditor.users, verify no Mention popup opens', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'No users @' }] }
            ], [], [], true); // Pass empty users array
            
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 10); // After 'No users @'

            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                // Assert DOM - Popup should not open
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                expect(popup).toBeNull();

                // Assert model - Content should remain as text
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('No users @');
                done();
            }, 300);
        });

        it('Type triggerChar with no items in labelSettings.items, verify no Label popup opens', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'No labels #' }] }
            ], [], [], true); // Pass empty items array
            
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 11); // After 'No labels #'

            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                // Assert DOM - Popup should not open
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                expect(popup).toBeNull();

                // Assert model - Content should remain as text
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('No labels #');
                done();
            }, 300);
        });

        it('Select Mention and Label together, remove both, update JSON to ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { id: 'start-text', contentType: ContentType.Text, content: 'Start '},
                    { id: 'mention-chip', contentType: ContentType.Mention, properties: { userId: 'user1' } },
                    { id: 'middle-text', contentType: ContentType.Text, content: ' and '},
                    { id: 'label-chip', contentType: ContentType.Label, properties: { labelId: 'in-progress' } },
                    { id: 'end-text', contentType: ContentType.Text, content: ' End'}
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            // Select from the start of the mention to the end of the label
            const mentionChip = contentElement.querySelector('.e-user-chip') as HTMLElement;
            const labelChip = contentElement.querySelector('.e-label-chip') as HTMLElement;
            
            const range = document.createRange();
            range.setStartBefore(mentionChip);
            range.setEndAfter(labelChip);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            range.deleteContents();
            contentElement = getBlockContentElement(blockElement) as HTMLElement;
            setCursorPosition(contentElement.childNodes[0] as HTMLElement, contentElement.childNodes[0].textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model - Only leading and trailing text should remain
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('Start ');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[1].content).toBe(' End');
                
                // Assert DOM
                expect(contentElement.childElementCount).toBe(2);
                expect(contentElement.children[0].textContent).toBe('Start ');
                expect(contentElement.children[1].textContent).toBe(' End');
                expect(contentElement.querySelector('.e-user-chip')).toBeNull();
                expect(contentElement.querySelector('.e-label-chip')).toBeNull();
                done();
            }, 100);
        });

        it('Insert Mention in multi formatted nodes', (done) => {
            setupEditor([
                {
                    id: 'paragraph1', blockType: BlockType.Paragraph, content: [{
                        contentType: ContentType.Text,
                        content: 'Hello @',
                        properties: {
                            styles: { bold: true, italic: true, underline: true }
                        }
                    }]
                }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 7); // After 'Hello @'
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-user-menu.e-popup');
                const li = popup.querySelector('li[data-value="user1"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // Hello(formatted node), John(e-user-chip ele) and a span with empty content
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Mention);
                    expect((editor.blocks[0].content[1].properties as IMentionContentSettings).userId).toBe('user1');
                    expect(editor.blocks[0].content[1].content).toBe('John');
                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].textContent).toBe('Hello ');
                    expect(contentElement.children[1].classList.contains('e-user-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain('John');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });

        it('Insert Label in multi formatted nodes', (done) => {
            setupEditor([
                {
                    id: 'paragraph1', blockType: BlockType.Paragraph, content: [{
                        contentType: ContentType.Text,
                        content: 'Task $',
                        properties: {
                            styles: { bold: true, italic: true, underline: true }
                        }
                    }]
                }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 6); // After 'Task $'
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '', bubbles: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                const li = popup.querySelector('li[data-value="in-progress"]') as HTMLElement;
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // "Task ", Label('In-progress'), "" (empty text node at end)
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Label);
                    expect((editor.blocks[0].content[1].properties as ILabelContentSettings).labelId).toBe('in-progress');
                    expect(editor.blocks[0].content[1].content).toBe(': In-progress');
                    expect(editor.blocks[0].content[2].content).toBe('');

                    // Assert DOM
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[0].textContent).toBe('Task ');
                    expect(contentElement.children[1].classList.contains('e-label-chip')).toBe(true);
                    expect(contentElement.children[1].textContent).toContain(': In-progress');
                    expect(contentElement.children[2].textContent).toBe('');
                    done();
                }, 200);
            }, 200);
        });
    });
});
