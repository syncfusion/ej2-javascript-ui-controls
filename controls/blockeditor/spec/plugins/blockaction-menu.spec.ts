import { createElement } from '@syncfusion/ej2-base';
import { BlockActionItemSelectEventArgs, BlockActionMenuClosingEventArgs, BlockActionMenuOpeningEventArgs } from '../../src/models/eventargs';
import { createEditor } from '../common/util.spec';
import { getBlockContentElement } from '../../src/common/utils/index';
import { BlockActionItemModel, BlockModel } from '../../src/models/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

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
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content1', contentType: ContentType.Text, content: 'Test content 1' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content2', contentType: ContentType.Text, content: 'Test content 2' }
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
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 200);
        });

        it('should hide action popup on document click', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                expect(popup).not.toBeNull();
                blockElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 50);
            }, 50);
        });

        it('should duplicate the block properly', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                (popup.querySelector('#duplicate') as HTMLElement).click();
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('Test content 1');
                expect(modelBlocks[0].id !== editor.blocks[1].id).toBe(true);
                expect(domBlocks.length).toBe(3);
                expect(blockElement.nextElementSibling.textContent).toBe('Test content 1');
                expect(blockElement.id !== blockElement.nextElementSibling.id).toBe(true);
                done();
            }, 200);
        });

        it('should delete the block properly', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                (popup.querySelector('#delete') as HTMLElement).click();

                //delete check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].content[0].content).toBe('Test content 2');
                expect(domBlocks[0].textContent).toBe('Test content 2');
                expect(editor.element.querySelector('#paragraph1')).toBeNull();
                done();
            }, 200);
        });

        it('should delete the last block properly', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                (popup.querySelector('#delete') as HTMLElement).click();

                //delete check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].content[0].content).toBe('Test content 1');
                expect(domBlocks[0].textContent).toBe('Test content 1');
                expect(editor.element.querySelector('#paragraph2')).toBeNull();
                done();
            }, 200);
        });

        it('should move down the block properly', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                //Move down
                (popup.querySelector('#movedown') as HTMLElement).click();

                //movedown check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('paragraph2');
                expect(modelBlocks[1].id).toBe('paragraph1');
                expect(modelBlocks[0].content[0].content).toBe('Test content 2');
                expect(modelBlocks[1].content[0].content).toBe('Test content 1');

                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('paragraph2');
                expect(domBlocks[1].id).toBe('paragraph1');
                expect(domBlocks[0].textContent).toBe('Test content 2');
                expect(domBlocks[1].textContent).toBe('Test content 1');
                done();
            }, 200);

        });

        it('should move up the block properly', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                //Move down
                (popup.querySelector('#moveup') as HTMLElement).click();

                //moveup check
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('paragraph2');
                expect(modelBlocks[1].id).toBe('paragraph1');
                expect(modelBlocks[0].content[0].content).toBe('Test content 2');
                expect(modelBlocks[1].content[0].content).toBe('Test content 1');

                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('paragraph2');
                expect(domBlocks[1].id).toBe('paragraph1');
                expect(domBlocks[0].textContent).toBe('Test content 2');
                expect(domBlocks[1].textContent).toBe('Test content 1');
                done();
            }, 200);

        });

        it('should trigger the action using shortcut key', () => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            //Trigger Ctrl + D to duplicate the block
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));

            //duplicate trigger check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Test content 1');
            expect(modelBlocks[1].content[0].content).toBe('Test content 1');
            expect(modelBlocks[0].id !== editor.blocks[1].id).toBe(true);
            expect(modelBlocks[2].content[0].content).toBe('Test content 2');

            expect(domBlocks.length).toBe(3);
            expect(blockElement.nextElementSibling.textContent).toBe('Test content 1');
            expect(blockElement.id !== blockElement.nextElementSibling.id).toBe(true);
            expect(blockElement.nextElementSibling.id).not.toBe('paragraph2');
        });

        it('should display the tooltip properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
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
            let modelBlocks = editor.blocks;
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const block1: BlockModel = {
                id: 'list1',
                blockType: BlockType.NumberedList,
                content: [
                    { contentType: ContentType.Text, content: 'List 1' }
                ]
            };
            const block2: BlockModel = {
                id: 'list2',
                blockType: BlockType.NumberedList,
                content: [
                    { contentType: ContentType.Text, content: 'List 2' }
                ]
            }
            editor.addBlock(block1);
            editor.addBlock(block2);
            const listBlock = editor.element.querySelector('#list1') as HTMLElement;
            editor.blockManager.setFocusToBlock(listBlock);
            editor.blockManager.currentHoveredBlock = listBlock;
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true  }));
            modelBlocks = editor.blocks;
            expect(getBlockContentElement(editor.element.querySelector('#list1')).style.getPropertyValue('list-style-type')).toBe('"2. "');
            expect(getBlockContentElement(editor.element.querySelector('#list2')).style.getPropertyValue('list-style-type')).toBe('"1. "');
            expect(modelBlocks[editor.blocks.length - 2].id).toBe('list2');
            expect(modelBlocks[editor.blocks.length - 1].id).toBe('list1');
            done();
        });
    });
    describe('Popup ID generation', () => {
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
                            { id: 'content1', contentType: ContentType.Text, content: 'Test content 1' }
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

        it('should generate a unique ID for the block action popup element', (done) => {
            setTimeout(() => {
                const popupElement = editor.blockManager.blockActionMenuModule.popupObj.element;
                expect(popupElement).not.toBeNull();
                expect(popupElement.id).not.toBeNull();
                expect(popupElement.id).not.toBe('');
                done();
            }, 100); 
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
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content1', contentType: ContentType.Text, content: 'Test content 1' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content2', contentType: ContentType.Text, content: 'Test content 2' }
                        ]
                    },
                ],
                blockActionMenuSettings: {
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

        it('should trigger open and close events', (done) => {
            editor.blockActionMenuSettings.opening = (args: BlockActionMenuOpeningEventArgs) => {
                isOpened = true;
            },
            editor.blockActionMenuSettings.closing = (args: BlockActionMenuClosingEventArgs) => {
                isClosed = true;
            },
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            expect(isOpened).toBe(true);

            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(true);
            expect(isClosed).toBe(true);
            done();
        });

        it('should cancel open event', (done) => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup');
            editor.blockActionMenuSettings.opening = (args: BlockActionMenuOpeningEventArgs) => {
                args.cancel = true;
            },
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            expect(popup.classList.contains('e-popup-open')).toBe(false);
            done();
        });

        it('should cancel close event', (done) => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup');
            editor.blockActionMenuSettings.closing = (args: BlockActionMenuClosingEventArgs) => {
                args.cancel = true;
            },
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(true);
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        it('should cancel itemClick event', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const popup = document.querySelector('.e-blockeditor-blockaction-popup');
            editor.blockActionMenuSettings.itemSelect = (args: BlockActionItemSelectEventArgs) => {
                args.cancel = true;
            },
            (editor.blockActionMenuModule as any).handleBlockActionMenuSelect(
            {
                event: undefined,
                item: { id: 'duplicate', label: 'Duplicate' },
                element: popup.querySelector('.e-blockeditor-blockaction-item li:last-child') as HTMLElement
            });
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(popup.querySelectorAll('li').length).toBe(4);
            expect(domBlocks.length).toBe(2);
            expect(editor.blocks.length).toBe(2); // itemclick canceled model lvl check
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
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content1', contentType: ContentType.Text, content: 'Test content 1' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content2', contentType: ContentType.Text, content: 'Test content 2' }
                        ]
                    },
                    {
                        id: 'callout-block',
                        blockType: BlockType.Callout,
                        properties: {
                            children: [
                                {
                                    id: 'callout-children',
                                    blockType: BlockType.Paragraph,
                                    content: [{
                                        id: 'callout-content',
                                        contentType: ContentType.Text,
                                        content: 'Important: Block Editor supports various content types including Text, Link, Code, Mention, and Label.',
                                        styles: {
                                            bold: true
                                        }
                                    }]
                                }
                            ]
                        }
                    },
                    {
                        id: 'paragraph3',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content2', contentType: ContentType.Text, content: 'Test content 3' }
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
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                expect((popup.querySelector('#moveup') as HTMLElement).classList.contains('e-disabled')).toBe(true);
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(editor.blocks[0].id).toBe('paragraph1');
                expect(domBlocks[0].id).toBe('paragraph1');
                done();
            });

        });

        it('should disable move down for last block', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editor.element.querySelector('#paragraph3') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                expect((popup.querySelector('#movedown') as HTMLElement).classList.contains('e-disabled')).toBe(true);
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(editor.blocks[3].id).toBe('paragraph3');
                expect(domBlocks[4].id).toBe('paragraph3'); //as callout child block involved
                done();
            });

        });

        it('should enable both move up and move down for normal block', (done) => {
            const blockElement = editor.element.querySelector('#callout-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                expect((popup.querySelector('#moveup') as HTMLElement).classList.contains('e-disabled')).toBe(false);
                expect((popup.querySelector('#movedown') as HTMLElement).classList.contains('e-disabled')).toBe(false);
                const index = editor.blocks.findIndex(b => b.id === 'callout-block');
                expect(index).toBeGreaterThan(0);
                expect(index).toBeLessThan(editor.blocks.length - 1);

                done();
            });
        });

        it('should disable both move up and move down for children block', function (done) {
            var blockElement = editor.element.querySelector('#callout-children') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 50, 10);
            editor.blockManager.currentHoveredBlock = blockElement;
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(function () {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                var popup = document.querySelector('.e-blockeditor-blockaction-popup');
                expect(popup.querySelector('#moveup').classList.contains('e-disabled')).toBe(true);
                expect(popup.querySelector('#movedown').classList.contains('e-disabled')).toBe(true);
                expect(editor.blocks.some(b => b.id === 'callout-children')).toBe(false); // checks if child block moves to top lvl block
                done();
            });
        });

        it('should return when blockelement is null', function (done) {
            (editor.blockManager.blockActionMenuModule as any).toggleDisabledItems(null);
            done();
        });

        it('should disable all items when multiple blocks are selected', function (done) {
            var blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.selectAllBlocks();
            (editor.blockManager.blockActionMenuModule as any).toggleDisabledItems(editor.element.querySelector('#paragraph1'));
            var popup = document.querySelector('.e-blockeditor-blockaction-popup');
            expect(popup.querySelector('#moveup').classList.contains('e-disabled')).toBe(true);
            expect(popup.querySelector('#movedown').classList.contains('e-disabled')).toBe(true);
            expect(popup.querySelector('#delete').classList.contains('e-disabled')).toBe(true);
            expect(popup.querySelector('#duplicate').classList.contains('e-disabled')).toBe(true);

            expect(editor.getSelectedBlocks().length).toBeGreaterThan(1);
            done();
        });

        it('should disable moveup firstblock when using shortcut key', function () {
            var blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true  }));
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].content[0].content).toBe('Test content 1');
            expect(domBlocks[0].textContent).toBe('Test content 1');
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
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content1', contentType: ContentType.Text, content: 'Test content 1' }
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

        /* Source issue */
        // it('should not open popup when enable is set to false', (done) => {
        //     editor.blockActionMenuSettings.enable = false;
        //     const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(blockElement);
        //     triggerMouseMove(blockElement, 10, 10);
        //     editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
        //     setTimeout(() => {
        //         expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(false);
        //         done();
        //     });
        // });

        it('should update popup width and height', (done) => {
            editor.blockActionMenuSettings.popupWidth = '200px';
            editor.blockActionMenuSettings.popupHeight = '200px';
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.style.width).toBe('200px');
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.style.height).toBe('200px');
                expect(editor.blockActionMenuSettings.popupWidth).toBe('200px');
                expect(editor.blockActionMenuSettings.popupHeight).toBe('200px');
                done()
            }, 200);
        });

        it('should update items dynamically', (done) => {
            const items: BlockActionItemModel[] = [
                { id: 'custom1', label: 'Custom Item 1', iconCss: 'e-icons e-copy' },
                { id: 'custom2', label: 'Custom Item 2', iconCss: 'e-icons e-paste' }
            ];
            editor.blockActionMenuSettings.items = items;
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                expect(popup.querySelectorAll('li').length).toBe(2);
                expect(popup.querySelector('#custom1') !== null).toBe(true);
                expect(popup.querySelector('#custom2') !== null).toBe(true);
                expect(editor.blockActionMenuSettings.items.length).toBe(2);
                expect(editor.blockActionMenuSettings.items[0].id).toBe('custom1');
                expect(editor.blockActionMenuSettings.items[1].id).toBe('custom2');
                done();
            }, 200);
        });
    });
    describe('Block Action Popup Positioning', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let popup: HTMLElement;
        let floatingIconContainer: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);

            const blocks: BlockModel[] = [];
            for (let i = 1; i <= 15; i++) {
                blocks.push({
                    id: `paragraph-${i}`,
                    blockType: BlockType.Paragraph,
                    content: [{ id: `content-${i}`, contentType: ContentType.Text, content: `Paragraph block ${i}` }]
                });
            }

            editor = createEditor({
                blocks: blocks
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

        it('should position popup for first block without top overflow', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            triggerMouseMove(blockElement, 10, 10);
            floatingIconContainer = editor.element.querySelector('.e-floating-icons') as HTMLElement;
            const dragIcon = floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                //focus must be p1 but got p15
                // expect(editor.blockManager.currentFocusedBlock.id).toBe('paragraph-1');

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                // Check popup.top is not lesser than editor.top
                expect(popupRect.top).toBeGreaterThanOrEqual(editorRect.top);
                done();
            }, 100);
        });

        it('should position popup below floating icon for middle (7th) block', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-7') as HTMLElement;
            triggerMouseMove(blockElement, 10, 10);
            floatingIconContainer = editor.element.querySelector('.e-floating-icons') as HTMLElement;
            const dragIcon = floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                const floatingRect = floatingIconContainer.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                // Check popup is below floating icon
                expect(popupRect.top).toBeGreaterThanOrEqual(floatingRect.bottom);
                done();
            }, 100);
        });

        it('should position popup above floating icon for last visible block without scrolling', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-11') as HTMLElement; // Adjust based on actual visibility
            triggerMouseMove(blockElement, 10, 10);
            floatingIconContainer = editor.element.querySelector('.e-floating-icons') as HTMLElement;
            const dragIcon = floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            const floatingRect = floatingIconContainer.getBoundingClientRect();
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                const popupRect = popup.getBoundingClientRect();
                // Check popup is above floating icon
                expect(popupRect.bottom).toBeLessThanOrEqual(floatingRect.top);
                done();
            }, 100);
        });

        it('should position popup above floating icon for last (15th) block after scrolling down', (done) => {
            // Scroll to the bottom
            editorElement.scrollTop = editorElement.scrollHeight;
            const blockElement = editorElement.querySelector('#paragraph-15') as HTMLElement;
            triggerMouseMove(blockElement, 10, 10);
            floatingIconContainer = editor.element.querySelector('.e-floating-icons') as HTMLElement;
            const dragIcon = floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            const floatingRect = floatingIconContainer.getBoundingClientRect();
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                const popupRect = popup.getBoundingClientRect();
                // Check popup is above floating icon
                expect(popupRect.bottom).toBeLessThanOrEqual(floatingRect.top);

                done();
            }, 100);
        });

        it('should position popup above floating icon for 14th block after scrolling down', (done) => {
            // Scroll down to make 14th block visible
            const block14 = editorElement.querySelector('#paragraph-14') as HTMLElement;
            editorElement.scrollTop = block14.offsetTop - 50;
            triggerMouseMove(block14, 10, 10);
            floatingIconContainer = editor.element.querySelector('.e-floating-icons') as HTMLElement;
            const dragIcon = floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            const floatingRect = floatingIconContainer.getBoundingClientRect();
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                const popupRect = popup.getBoundingClientRect();
                // Check popup is above floating icon
                expect(popupRect.bottom).toBeLessThanOrEqual(floatingRect.top);
                done();
            }, 100);
        });

        it('should position popup below floating icon for 8th block after scrolling down', (done) => {
            const block8 = editorElement.querySelector('#paragraph-8') as HTMLElement;
            editorElement.scrollTop = block8.offsetTop - 50;
            triggerMouseMove(block8, 10, 10);
            floatingIconContainer = editor.element.querySelector('.e-floating-icons') as HTMLElement;
            const dragIcon = floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            const floatingRect = floatingIconContainer.getBoundingClientRect();
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                const popupRect = popup.getBoundingClientRect();
                expect(popupRect.top).toBeGreaterThanOrEqual(floatingRect.bottom);
                done();
            }, 100);
        });
    });
});
