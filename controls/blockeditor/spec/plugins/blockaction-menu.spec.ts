import { createElement } from '@syncfusion/ej2-base';
import { BlockActionItemClickEventArgs, BlockActionItemModel, BlockActionMenuCloseEventArgs, BlockActionMenuOpenEventArgs, BlockEditor, BlockType, ContentType, getBlockContentElement } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Block Action Menu', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
        const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
        node.dispatchEvent(event);
    }

    describe('Default actions testing', () => {
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
                            { id: 'content1', type: ContentType.Text, content: 'Test content 1' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content2', type: ContentType.Text, content: 'Test content 2' }
                        ]
                    },
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

        it('should open the popup on drag icon click', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 200);
        });

        it('should duplicate the block properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                (popup.querySelector('#duplicate') as HTMLElement).click();
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[1].content[0].content).toBe('Test content 1');
                expect(editor.blocks[0].id !== editor.blocks[1].id).toBe(true);
                expect(blockElement.nextElementSibling.textContent).toBe('Test content 1');
                expect(blockElement.id !== blockElement.nextElementSibling.id).toBe(true);
                done();
            }, 200);
        });

        it('should delete the block properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                (popup.querySelector('#delete') as HTMLElement).click();
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Test content 2');
                expect(editor.element.querySelector('#paragraph1')).toBeNull();
                done();
            }, 200);
        });

        it('should delete the last block properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                (popup.querySelector('#delete') as HTMLElement).click();
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Test content 1');
                expect(editor.element.querySelector('#paragraph2')).toBeNull();
                done();
            }, 200);
        });

        it('should move down the block properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                //Move down
                (popup.querySelector('#movedown') as HTMLElement).click();
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Test content 2');
                expect(editor.blocks[1].content[0].content).toBe('Test content 1');

                const allBlocks = editor.element.querySelectorAll('.e-block');
                expect(allBlocks[0].id).toBe('paragraph2');
                expect(allBlocks[1].id).toBe('paragraph1');
                done();
            }, 200);

        });

        it('should move up the block properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                //Move down
                (popup.querySelector('#moveup') as HTMLElement).click();
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Test content 2');
                expect(editor.blocks[1].content[0].content).toBe('Test content 1');

                const allBlocks = editor.element.querySelectorAll('.e-block');
                expect(allBlocks[0].id).toBe('paragraph2');
                expect(allBlocks[1].id).toBe('paragraph1');
                done();
            }, 200);

        });

        it('should trigger the action using shortcut key', () => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            //Trigger Ctrl + D to duplicate the block
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].content[0].content).toBe('Test content 1');
            expect(editor.blocks[1].content[0].content).toBe('Test content 1');
            expect(editor.blocks[0].id !== editor.blocks[1].id).toBe(true);
            expect(editor.blocks[2].content[0].content).toBe('Test content 2');

            expect(blockElement.nextElementSibling.textContent).toBe('Test content 1');
            expect(blockElement.id !== blockElement.nextElementSibling.id).toBe(true);
        });

        it('should display the tooltip properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                expect(popup).not.toBeNull();

                // Simulate hover on the item
                const item1 = popup.querySelector('#duplicate') as HTMLElement;
                item1.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

                setTimeout(() => {
                    const tooltip1 = document.querySelector('.e-blockeditor-blockaction-tooltip');
                    expect(tooltip1).not.toBeNull();
                    expect(tooltip1.textContent).toContain('Duplicates a block');

                    // Simulate hover on the another item
                    const item2 = popup.querySelector('#delete') as HTMLElement;
                    item2.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

                    setTimeout(() => {
                        const tooltip2 = document.querySelector('.e-blockeditor-blockaction-tooltip');
                        expect(tooltip2).not.toBeNull();
                        expect(tooltip2.textContent).toContain('Deletes a block');
                        done();
                    }, 10);
                }, 10);
            }, 200);
        });

        it('should recalculate markers for list items on move', function (done) {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const block1 = {
                id: 'list1',
                type: BlockType.NumberedList,
                content: [
                    { type: ContentType.Text, content: 'List 1' }
                ]
            };
            const block2 = {
                id: 'list2',
                type: BlockType.NumberedList,
                content: [
                    { type: ContentType.Text, content: 'List 2' }
                ]
            }
            editor.addBlock(block1);
            editor.addBlock(block2);
            const listBlock = editor.element.querySelector('#list1') as HTMLElement;
            editor.setFocusToBlock(listBlock);
            editor.currentHoveredBlock = listBlock;
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true  }));
            expect(getBlockContentElement(editor.element.querySelector('#list1')).style.getPropertyValue('list-style-type')).toBe('"2. "');
            expect(getBlockContentElement(editor.element.querySelector('#list2')).style.getPropertyValue('list-style-type')).toBe('"1. "');
            done();
        });
    });

    describe('Events and Custom items', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let isOpened = false;
        let isClosed = false;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);

            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph1',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content1', type: ContentType.Text, content: 'Test content 1' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content2', type: ContentType.Text, content: 'Test content 2' }
                        ]
                    },
                ],
                blockActionsMenu: {
                    enableTooltip: false,
                    items: [
                        {
                            id: 'highlight-action',
                            label: 'Highlight Block',
                            iconCss: 'e-icons e-highlight',
                            tooltip: 'Highlight this block'
                        },
                        {
                            id: 'copy-content-action',
                            label: 'Copy Content',
                            iconCss: 'e-icons e-copy',
                            tooltip: 'Copy block content to clipboard'
                        },
                        {
                            id: 'block-info-action',
                            label: 'Block Info',
                            tooltip: 'Show block information'
                        },
                        {
                            id: 'duplicate',
                            label: 'Duplicate',
                        }
                    ]
                }
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
                isOpened = false;
                isClosed = false;
            }
            document.body.removeChild(editorElement);
        });

        it('should render custom items properly', (done) => {
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                expect(popup).not.toBeNull();
                expect(popup.querySelectorAll('li').length).toBe(4);
                done();
            }, 200);
        });

        it('should not render tooltip when enableTooltip is false', (done) => {
            setTimeout(() => {
                expect((editor.blockActionMenuModule as any).blockActionTooltip).toBeUndefined();
                done();
            }, 200);
        });

        it('should trigger open and close events', (done) => {
            editor.blockActionsMenu.open = (args: BlockActionMenuOpenEventArgs) => {
                isOpened = true;
            },
            editor.blockActionsMenu.close = (args: BlockActionMenuCloseEventArgs) => {
                isClosed = true;
            },
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            expect(isOpened).toBe(true);

            editor.blockActionMenuModule.toggleBlockActionPopup(true);
            expect(isClosed).toBe(true);
            done();
        });

        it('should cancel open event', (done) => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup');
            editor.blockActionsMenu.open = (args: BlockActionMenuOpenEventArgs) => {
                args.cancel = true;
            },
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            expect(popup.classList.contains('e-popup-open')).toBe(false);
            done();
        });

        it('should cancel close event', (done) => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup');
            editor.blockActionsMenu.close = (args: BlockActionMenuCloseEventArgs) => {
                args.cancel = true;
            },
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                editor.blockActionMenuModule.toggleBlockActionPopup(true);
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        it('should cancel itemClick event', (done) => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup');
            editor.blockActionsMenu.itemClick = (args: BlockActionItemClickEventArgs) => {
                args.cancel = true;
            },
            (editor.blockActionMenuModule as any).handleBlockActionMenuSelect(
            {
                event: undefined,
                item: { id: 'duplicate', label: 'Duplicate' },
                element: popup.querySelector('.e-blockeditor-blockaction-item li:last-child') as HTMLElement
            });
            expect(popup.querySelectorAll('li').length).toBe(4);
            done();
        });
    });

    describe('Disable scenarios testing', () => {
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
                            { id: 'content1', type: ContentType.Text, content: 'Test content 1' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content2', type: ContentType.Text, content: 'Test content 2' }
                        ]
                    },
                    {
                        id: 'callout-block',
                        type: 'Callout',
                        children: [
                            {
                                id: 'callout-children',
                                type: BlockType.Paragraph,
                                content: [{
                                    id: 'callout-content',
                                    type: ContentType.Text,
                                    content: 'Important: Block Editor supports various content types including Text, Link, Code, Mention, and Label.',
                                    styles: {
                                        bold: true
                                    }
                                }]
                            }
                        ]
                    },
                    {
                        id: 'paragraph3',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content2', type: ContentType.Text, content: 'Test content 3' }
                        ]
                    },
                ]
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should disable move up for first block', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                expect((popup.querySelector('#moveup') as HTMLElement).classList.contains('e-disabled')).toBe(true);
                done();
            });

        });

        it('should disable move down for last block', (done) => {
            const blockElement = editor.element.querySelector('#paragraph3') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                expect((popup.querySelector('#movedown') as HTMLElement).classList.contains('e-disabled')).toBe(true);
                done();
            });

        });

        it('should enable both move up and move down for normal block', (done) => {
            const blockElement = editor.element.querySelector('#callout-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                expect((popup.querySelector('#moveup') as HTMLElement).classList.contains('e-disabled')).toBe(false);
                expect((popup.querySelector('#movedown') as HTMLElement).classList.contains('e-disabled')).toBe(false);
                done();
            });
        });

        it('should disable both move up and move down for children block', function (done) {
            var blockElement = editor.element.querySelector('#callout-children') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 50, 10);
            editor.currentHoveredBlock = blockElement;
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(function () {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                var popup = document.querySelector('.e-blockeditor-blockaction-popup');
                expect(popup.querySelector('#moveup').classList.contains('e-disabled')).toBe(true);
                expect(popup.querySelector('#movedown').classList.contains('e-disabled')).toBe(true);
                done();
            });
        });

        it('should return when blockelement is null', function (done) {
            (editor.blockActionMenuModule as any).toggleDisabledItems(null);
            done();
        });

        it('should disable all items when multiple blocks are selected', function (done) {
            var blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.selectAllBlocks();
            (editor.blockActionMenuModule as any).toggleDisabledItems(editor.element.querySelector('#paragraph1'));
            var popup = document.querySelector('.e-blockeditor-blockaction-popup');
            expect(popup.querySelector('#moveup').classList.contains('e-disabled')).toBe(true);
            expect(popup.querySelector('#movedown').classList.contains('e-disabled')).toBe(true);
            expect(popup.querySelector('#delete').classList.contains('e-disabled')).toBe(true);
            expect(popup.querySelector('#duplicate').classList.contains('e-disabled')).toBe(true);
            done();
        });

        it('should disable moveup firstblock when using shortcut key', function () {
            var blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true  }));
            expect(editor.blocks[0].content[0].content).toBe('Test content 1');
        });
    });

    describe('On property change', () => {
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
                            { id: 'content1', type: ContentType.Text, content: 'Test content 1' }
                        ]
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

        it('should not open popup when enable is set to false', (done) => {
            editor.blockActionsMenu.enable = false;
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(false);
                done();
            });
        });

        it('should update popup width and height', (done) => {
            editor.blockActionsMenu.popupWidth = '200px';
            editor.blockActionsMenu.popupHeight = '200px';
            setTimeout(() => {
                expect(editor.blockActionMenuModule.popupObj.element.style.width).toBe('200px');
                expect(editor.blockActionMenuModule.popupObj.element.style.height).toBe('200px');
                done()
            }, 200);
        });

        it('should update items dynamically', (done) => {
            const items: BlockActionItemModel[] = [
                { id: 'custom1', label: 'Custom Item 1', iconCss: 'e-icons e-copy' },
                { id: 'custom2', label: 'Custom Item 2', iconCss: 'e-icons e-paste' }
            ];
            editor.blockActionsMenu.items = items;
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                expect(popup.querySelectorAll('li').length).toBe(2);
                expect(popup.querySelector('#custom1') !== null).toBe(true);
                expect(popup.querySelector('#custom2') !== null).toBe(true);
                done();
            }, 200);
        });
    });

});
