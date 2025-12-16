import { createElement } from '@syncfusion/ej2-base';
import { ContextMenuItemModel} from '../../src/models/index';
import { createEditor } from '../common/util.spec';
import { setCursorPosition, getBlockContentElement } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

describe('Context Menu', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    function triggerRightClick(element: HTMLElement) {
        element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    }

    describe('Default actions testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            document.body.removeChild(editorElement);
        });

        it('should open the contextmenu on right click', (done) => {
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
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();
            triggerRightClick(editorElement);
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                expect(editor.blockManager.currentFocusedBlock.id).toBe('paragraph1');
                done();
            }, 100);
        });

        it('should open the contextmenu and ensure enable / disable items', (done) => {
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
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();
            triggerRightClick(editorElement);
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                expect(menuElement.querySelector('#undo').classList.contains('e-disabled')).toBe(true);
                expect(menuElement.querySelector('#redo').classList.contains('e-disabled')).toBe(true);
                expect(menuElement.querySelector('#cut').classList.contains('e-disabled')).toBe(true);
                expect(menuElement.querySelector('#copy').classList.contains('e-disabled')).toBe(true);
                expect(menuElement.querySelector('#paste').classList.contains('e-disabled')).toBe(false);
                expect(menuElement.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);
                expect(menuElement.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(true);
                expect(menuElement.querySelector('#link').classList.contains('e-disabled')).toBe(true);
                expect(editor.blockManager.currentFocusedBlock.id).toBe('paragraph1');
                done();
            }, 100);
        });

        it('should trigger the action using shortcut key', (done) => {
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
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();

            //Trigger Ctrl + ] to indent the block
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));
            expect(editor.blocks[0].indent).toBe(1);
            expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
            expect(menuElement.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

            //Trigger Ctrl + [ to outdent the block
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));
            expect(editor.blocks[0].indent).toBe(0);
            expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

            //Trigger Ctrl + K to open the link dialog
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                expect(document.querySelector('.e-blockeditor-link-dialog')).not.toBeNull();
                expect(editor.blockManager.currentFocusedBlock.id).toBe('paragraph1');
                done();
            }, 100);
        });

        it('should load with user defined items initially', (done) => {
            const items: ContextMenuItemModel[] = [
                { id: 'custom1', text: 'Custom Item 1', iconCss: 'e-icons e-copy' },
                { id: 'custom2', text: 'Custom Item 2', iconCss: 'e-icons e-paste' }
            ];
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph1',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'content1', contentType: ContentType.Text, content: 'Test content 1' }
                        ]
                    }
                ],
                contextMenuSettings: { items: items }
            });
            editor.appendTo('#editor');
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-contextmenu');
                expect(editor.contextMenuSettings.items.length).toBe(2);
                expect(editor.contextMenuSettings.items[0].id).toBe('custom1');
                expect(editor.contextMenuSettings.items[1].id).toBe('custom2');
                expect(popup.querySelectorAll('li').length).toBe(2);
                expect(popup.querySelector('#custom1') !== null).toBe(true);
                expect(popup.querySelector('#custom2') !== null).toBe(true);
                done();
            }, 100);
        });

        it('should call cut, copy and paste handlers on item click', () => {
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
            spyOn(editor.blockManager.clipboardAction, 'handleContextCut').and.stub();
            spyOn(editor.blockManager.clipboardAction, 'handleContextCopy').and.stub();
            spyOn(editor.blockManager.clipboardAction, 'handleContextPaste').and.stub();
            
            (editor.blockManager.contextMenuModule as any).handleContextMenuActions({ id: 'cut' });
            expect(editor.blockManager.clipboardAction.handleContextCut).toHaveBeenCalled();
            
            (editor.blockManager.contextMenuModule as any).handleContextMenuActions({ id: 'copy' });
            expect(editor.blockManager.clipboardAction.handleContextCopy).toHaveBeenCalled();

            (editor.blockManager.contextMenuModule as any).handleContextMenuActions({ id: 'paste' });
            expect(editor.blockManager.clipboardAction.handleContextPaste).toHaveBeenCalled();
        });
    });

    describe('Redo shortcut display based on OS', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let originalUserAgent: string;

        beforeEach(() => {
            originalUserAgent = navigator.userAgent;
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            document.body.removeChild(editorElement);
            Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
        });

        it('should display "Ctrl+Y" for redo shortcut on non-macOS', (done) => {
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                configurable: true
            });

            editor = createEditor({ blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'Test' }] }] });
            editor.appendTo('#editor');
            
            editor.blockManager.setFocusToBlock(editor.element.querySelector('#p1') as HTMLElement);
            triggerRightClick(editorElement);
            setTimeout(() => {
                const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
                const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
                expect(menuElement.querySelector('#redo')).not.toBeNull();
                const redoItemTextElement = menuElement.querySelector('#redo .e-ctmenu-shortcut');
                expect(redoItemTextElement).not.toBeNull();
                expect(redoItemTextElement.textContent).toBe('Ctrl+Y');
                done();
            }, 200);
        });

        it('should display "Cmd+Shift+Z" for redo shortcut on macOS', (done) => {
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                configurable: true
            });
            editor = createEditor({ blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'Test' }] }] });
            editor.appendTo('#editor');

            editor.blockManager.setFocusToBlock(editor.element.querySelector('#p1') as HTMLElement);
            triggerRightClick(editorElement);
            setTimeout(() => {
                const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
                expect(menuElement.querySelector('#redo')).not.toBeNull();
                const redoItemTextElement = menuElement.querySelector('#redo .e-ctmenu-shortcut');
                expect(redoItemTextElement).not.toBeNull();
                expect(redoItemTextElement.textContent).toBe('Cmd+Shift+Z');
                done();
            }, 200);
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
                    }
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

        it('should enable disable indent options properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                expect(menuElement.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);
                expect(menuElement.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(true);

                //Increase the indent
                (menuElement.querySelector('#increaseindent') as HTMLElement).click();
                expect(editor.blocks[1].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                done();
            }, 200);
        });

        it('should enable disable clipboard options properly', (done) => {
            spyOn(editor.blockManager.clipboardAction, 'isClipboardEmpty').and.returnValue(Promise.resolve(true));
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                expect(menuElement.querySelector('#cut').classList.contains('e-disabled')).toBe(true);
                expect(menuElement.querySelector('#copy').classList.contains('e-disabled')).toBe(true);

                expect(menuElement.querySelector('#paste').classList.contains('e-disabled')).toBe(false);
                //Select any range of text
                editor.setSelection('content1', 2, 4);
                editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
                setTimeout(() => {
                    expect(menuElement.style.display).toBe('block');
                    expect(menuElement.querySelector('#cut').classList.contains('e-disabled')).toBe(false);
                    expect(menuElement.querySelector('#copy').classList.contains('e-disabled')).toBe(false);
                    done();
                }, 200);
            });
        });

        it('should enable disable undo redo properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                const canUndo = editor.blockManager.undoRedoAction.canUndo();
                const canRedo = editor.blockManager.undoRedoAction.canRedo();
                expect(menuElement.querySelector('#undo').classList.contains('e-disabled')).toBe(!canUndo);
                expect(menuElement.querySelector('#redo').classList.contains('e-disabled')).toBe(!canRedo);
                done();
            }, 200);
        });

        it('should enable disable link item properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editor.setSelection('content1', 2, 4);

            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                expect(menuElement.querySelector('#link').classList.contains('e-disabled')).toBe(false);
                done();
            }, 200);
        });

        it('should disable link item when multiple blocks are selected', (done) => {
            const firstBlockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            const secondBlockElement = editor.element.querySelector('#paragraph2') as HTMLElement;

            // Focus on the first block and set selection across both blocks
            editor.blockManager.setFocusToBlock(firstBlockElement);
            setCursorPosition(getBlockContentElement(firstBlockElement), 5);

            // Simulate selecting text from first block to second block
            const range = document.createRange();
            const startContent = getBlockContentElement(firstBlockElement).firstChild;
            const endContent = getBlockContentElement(secondBlockElement).firstChild;

            range.setStart(startContent, 5); // middle of "Test content 1"
            range.setEnd(endContent, 8);     // middle of "Test content 2"

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Trigger context menu
            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

            setTimeout(() => {
                const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
                const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
                expect(menuElement.style.display).toBe('block');

                const linkItem = menuElement.querySelector('#link');
                expect(linkItem.classList.contains('e-disabled')).toBe(true);

                // Clean up selection
                selection.removeAllRanges();
                done();
            }, 200);
        });

        it('should enable paste options properly for copy action', (done) => {
            spyOn(editor.blockManager.clipboardAction, 'handleContextCopy').and.stub();
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editor.setSelection('content2', 0, 4);

            (editor.blockManager.contextMenuModule as any).handleContextMenuActions({ id: 'copy' });
            expect(editor.blockManager.clipboardAction.handleContextCopy).toHaveBeenCalled();

            setTimeout(() => {
                editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
                setTimeout(() => {
                    expect(menuElement.style.display).toBe('block');
                    expect(menuElement.querySelector('#paste').classList.contains('e-disabled')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('should return when blockelement is null', function (done) {
            editor.blockManager.currentFocusedBlock = null;
            (editor.blockManager.contextMenuModule as any).toggleDisabledItems();
            done();
        });
    });

    describe('Events', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let isBeforeOpenFired = false;
        let isBeforeCloseFired = false;

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
                isBeforeOpenFired = false;
                isBeforeCloseFired = false;
            }
            document.body.removeChild(editorElement);
        });

        it('should trigger open and close related events', (done) => {
            editor.contextMenuSettings.opening = (args) => {
                isBeforeOpenFired = true;
            };
            editor.contextMenuSettings.closing = (args) => {
                isBeforeCloseFired = true;
            };
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            triggerRightClick(editorElement);
            setTimeout(() => {
                expect(isBeforeOpenFired).toBe(true);

                blockElement.click();
                
                setTimeout(() => {
                    expect(isBeforeCloseFired).toBe(true);
                    done();
                }, 400);
            }, 400);
        });

        it('should prevent contextmenu opening when editor is in readonly mode', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.currentFocusedBlock = blockElement;
            editor.readOnly = true;
            editor.dataBind();
            triggerRightClick(editorElement);
            setTimeout(() => {
                const menuWrapperElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
                const menuElement = menuWrapperElement.querySelector('ul') as HTMLElement;
                expect(menuElement.style.display).not.toBe('block');
                done();
            }, 200);
        });

        it('should cancel itemClick event', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.currentFocusedBlock = blockElement;
            editor.contextMenuSettings.itemSelect = (args) => {
                args.cancel = true;
            },
            (editor.contextMenuModule as any).handleContextMenuSelection(
            {
                item: { id: 'increaseindent', text: 'Increase Indent' }
            });
            expect(editor.blocks[0].indent).toBe(0);
            expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
            done();
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

        it('should handle showItemOnClick properly', (done) => {
            editor.contextMenuSettings.showItemOnClick = true;
            setTimeout(() => {
                expect(editor.contextMenuModule.contextMenuObj.showItemOnClick).toBe(true);
                done();
            }, 200);
        });

        it('should update item template', (done) => {
            editor.contextMenuSettings.itemTemplate = '<span>${text}</span>';
            setTimeout(() => {
                expect(editor.contextMenuModule.contextMenuObj.itemTemplate).toBe('<span>${text}</span>');
                done();
            }, 200);
        });

        it('should update items dynamically', (done) => {
            const items: ContextMenuItemModel[] = [
                { id: 'custom1', text: 'Custom Item 1', iconCss: 'e-icons e-copy' },
                { id: 'custom2', text: 'Custom Item 2', iconCss: 'e-icons e-paste' }
            ];
            editor.contextMenuSettings.items = items;
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-contextmenu');
                expect(popup.querySelectorAll('li').length).toBe(2);
                expect(popup.querySelector('#custom1') !== null).toBe(true);
                expect(popup.querySelector('#custom2') !== null).toBe(true);
                expect(editor.contextMenuSettings.items.length).toBe(2);
                expect(editor.contextMenuSettings.items[0].id).toBe('custom1');
                expect(editor.contextMenuSettings.items[1].id).toBe('custom2');
                done();
            }, 200);
        });
    });
});
