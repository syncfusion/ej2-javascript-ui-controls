import { createElement } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockEditor, BlockType, ContentType, getBlockContentElement, getSelectedRange, LabelContentProps, MentionContentProps, setCursorPosition } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Inline Content Module', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

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
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content1', type: ContentType.Text, content: 'Hello $ world' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        type: BlockType.Paragraph,
                        content: [
                            {
                                id: 'boldText',
                                type: ContentType.Text,
                                content: 'Bolded @ text',
                                props: { styles: { bold: true } }
                            }
                        ]
                    },
                    {
                        id: 'callout',
                        type: BlockType.Callout,
                        props: {
                            children: [{
                                id: 'callout-child',
                                type: BlockType.Paragraph,
                                content: [
                                    { id: 'callout-content', type: ContentType.Text, content: 'Hello $ world' },
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
        });

        it('should insert label item properly', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 7);

                editor.blockWrapper.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="high"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    editor.setFocusToBlock(blockElement);
                    setTimeout(() => {
                        const labelItem = editor.labelSettings.labelItems.find((item) => item.id === 'high');
                        expect(contentElement.childElementCount).toBe(3);
                        const firstChild = contentElement.childNodes[0];
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const lastChild = contentElement.childNodes[2];

                        expect(firstChild.textContent).toBe('Hello ');

                        expect(insertedNode.textContent).toBe('Priority: High');
                        expect(insertedNode.classList.contains('e-label-chip')).toBe(true);
                        expect(insertedNode.getAttribute('data-label-id')).toBe((editor.blocks[0].content[1].props as LabelContentProps).labelId);

                        expect(lastChild.textContent).toBe(' world');

                        expect(editor.blocks[0].content[0].content).toBe('Hello ');
                        expect(editor.blocks[0].content[1].content).toBe('Priority: High');
                        expect(editor.blocks[0].content[1].type).toBe(ContentType.Label);
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
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 8);
                expect(contentElement.childElementCount).toBe(1);

                editor.blockWrapper.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
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
                        expect(insertedNode.getAttribute('data-user-id')).toBe((editor.blocks[1].content[1].props as MentionContentProps).userId);

                        expect(lastChild.textContent).toBe(' text');

                        expect(editor.blocks[1].content[0].content).toBe('Bolded ');
                        expect(editor.blocks[1].content[1].content).toBe('User 1');
                        expect(editor.blocks[1].content[1].type).toBe(ContentType.Mention);
                        expect(editor.blocks[1].content[2].content).toBe(' text');
                    editor.mentionRenderer.destroy();
                        done();
                    }, 300);
                }, 500);
            }, 200);
        });

        it('should insert label item properly in children block', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#callout-child') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 7);

                editor.blockWrapper.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-label-menu.e-popup');
                    expect(popup).not.toBeNull();
                    const li = popup.querySelector('li[data-value="high"]') as HTMLElement;
                    li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    editor.setFocusToBlock(blockElement);
                    setTimeout(() => {
                        const labelItem = editor.labelSettings.labelItems.find((item) => item.id === 'high');
                        const children = (editor.blocks[2].props as BaseChildrenProp).children[0];
                        expect(contentElement.childElementCount).toBe(3);
                        const firstChild = contentElement.childNodes[0];
                        const insertedNode = (contentElement.childNodes[1] as HTMLElement);
                        const lastChild = contentElement.childNodes[2];

                        expect(firstChild.textContent).toBe('Hello ');

                        expect(insertedNode.textContent).toBe('Priority: High');
                        expect(insertedNode.classList.contains('e-label-chip')).toBe(true);
                        expect(insertedNode.getAttribute('data-label-id')).toBe((children.content[1].props as LabelContentProps).labelId);

                        expect(lastChild.textContent).toBe(' world');

                        expect(children.content[0].content).toBe('Hello ');
                        expect(children.content[1].content).toBe('Priority: High');
                        expect(children.content[1].type).toBe(ContentType.Label);
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
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content1', type: ContentType.Text, content: 'Hello $ world' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        type: BlockType.Paragraph,
                        content: [
                            {
                                id: 'boldText',
                                type: ContentType.Text,
                                content: 'Bolded @ text',
                                props: { styles: { bold: true } }
                            }
                        ]
                    }
                ],
                users: [
                    { id: 'user1', user: 'User 1' },
                    { id: 'user2', user: 'User 2' }
                ],
                labelSettings: {
                    labelItems: [
                        { id: 'high', labelColor: '#ff8a80', text: 'High', groupHeader: 'Priority' },
                        { id: 'medium', labelColor: '#ffb74d', text: 'Medium', groupHeader: 'Priority' },
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
        });

        it('should load custom items properly', (done) => {
            setTimeout(() => {
                const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement) as HTMLElement;
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 7);

                editor.blockWrapper.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
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

            const rangeParent = (editor.inlineContentInsertionModule as any).getRangeParent(getSelectedRange());
            (editor.inlineContentInsertionModule as any).splitAndReorganizeContent(null, ContentType.Mention, rangeParent, { block: editor.blocks[0] });
            
            rangeParent.id = 'fake';
            (editor.inlineContentInsertionModule as any).splitAndReorganizeContent(contentElement.firstChild, ContentType.Mention, rangeParent, { block: editor.blocks[0] });

            contentElement.classList.remove('e-block-content');
            (editor.inlineContentInsertionModule as any).splitAndReorganizeContent(contentElement.firstChild, ContentType.Mention, rangeParent, { block: editor.blocks[0] });

            (editor.inlineContentInsertionModule as any).processInsertion({ range: null });

            (editor.inlineContentInsertionModule as any).processInsertion({ blockElement: null });
            done();
        });

    });

});
