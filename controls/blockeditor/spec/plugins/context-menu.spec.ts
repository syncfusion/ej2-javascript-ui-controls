import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, BlockType, ContentType, ContextMenuItemModel, getBlockContentElement, setCursorPosition } from '../../src/index';
import { createEditor } from '../common/util.spec';

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
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content1', type: ContentType.Text, content: 'Test content 1' }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            expect(menuElement).not.toBeNull();
            triggerRightClick(editorElement);
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                done();
            }, 100);
        });

        it('should trigger the action using shortcut key', (done) => {
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
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(getBlockContentElement(blockElement), 0);
            const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
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
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content1', type: ContentType.Text, content: 'Test content 1' }
                        ]
                    }
                ],
                contextMenu: { items: items }
            });
            editor.appendTo('#editor');
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-contextmenu');
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
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content1', type: ContentType.Text, content: 'Test content 1' }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            spyOn(editor.clipboardAction, 'handleContextCut').and.stub();
            spyOn(editor.clipboardAction, 'handleContextCopy').and.stub();
            spyOn(editor.clipboardAction, 'handleContextPaste').and.stub();
            
            (editor.contextMenuModule as any).handleContextMenuActions({ id: 'cut' });
            expect(editor.clipboardAction.handleContextCut).toHaveBeenCalled();
            
            (editor.contextMenuModule as any).handleContextMenuActions({ id: 'copy' });
            expect(editor.clipboardAction.handleContextCopy).toHaveBeenCalled();

            (editor.contextMenuModule as any).handleContextMenuActions({ id: 'paste' });
            expect(editor.clipboardAction.handleContextPaste).toHaveBeenCalled();
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
            editor.setFocusToBlock(blockElement);
            const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
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
            spyOn(editor.clipboardAction, 'isClipboardEmpty').and.returnValue(Promise.resolve(true));
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                expect(menuElement.querySelector('#cut').classList.contains('e-disabled')).toBe(true);
                expect(menuElement.querySelector('#copy').classList.contains('e-disabled')).toBe(true);

                expect(menuElement.querySelector('#paste').classList.contains('e-disabled')).toBe(true);
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
            editor.setFocusToBlock(blockElement);
            const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                const canUndo = editor.undoRedoAction.canUndo();
                const canRedo = editor.undoRedoAction.canRedo();
                expect(menuElement.querySelector('#undo').classList.contains('e-disabled')).toBe(!canUndo);
                expect(menuElement.querySelector('#redo').classList.contains('e-disabled')).toBe(!canRedo);
                done();
            }, 200);
        });

        it('should enable disable link item properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editor.setSelection('content1', 2, 4);

            editorElement.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(menuElement.style.display).toBe('block');
                expect(menuElement.querySelector('#link').classList.contains('e-disabled')).toBe(false);
                done();
            }, 200);
        });

        it('should enable paste options properly for copy action', (done) => {
            spyOn(editor.clipboardAction, 'handleContextCopy').and.stub();
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
            expect(menuElement).not.toBeNull();

            editor.setSelection('content2', 0, 4);

            (editor.contextMenuModule as any).handleContextMenuActions({ id: 'copy' });
            expect(editor.clipboardAction.handleContextCopy).toHaveBeenCalled();

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
            editor.currentFocusedBlock = null;
            (editor.contextMenuModule as any).toggleDisabledItems();
            done();
        });
    });

    describe('Events', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let isBeforeOpenFired = false;
        let isOpenFired = false;
        let isBeforeCloseFired = false;
        let isCloseFired = false;

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
                isBeforeOpenFired = false;
                isOpenFired = false;
                isBeforeCloseFired = false;
                isCloseFired = false;
            }
            document.body.removeChild(editorElement);
        });

        it('should trigger open and close related events', (done) => {
            editor.contextMenu.beforeOpen = (args) => {
                isBeforeOpenFired = true;
            };
            editor.contextMenu.beforeClose = (args) => {
                isBeforeCloseFired = true;
            };
            editor.contextMenu.open = (args) => {
                isOpenFired = true;
            };
            editor.contextMenu.close = (args) => {
                isCloseFired = true;
            };
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            triggerRightClick(editorElement);
            setTimeout(() => {
                expect(isBeforeOpenFired).toBe(true);
                expect(isOpenFired).toBe(true);

                blockElement.click();
                
                setTimeout(() => {
                    expect(isBeforeCloseFired).toBe(true);
                    expect(isCloseFired).toBe(true);
                    done();
                }, 400);
            }, 400);
        });

        it('should prevent contextmenu opening when editor is in readonly mode', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.currentFocusedBlock = blockElement;
            editor.readOnly = true;
            editor.dataBind();
            triggerRightClick(editorElement);
            setTimeout(() => {
                const menuElement = document.querySelector('.e-blockeditor-contextmenu') as HTMLElement;
                expect(menuElement.style.display).not.toBe('block');
                done();
            }, 200);
        });

        it('should cancel itemClick event', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.currentFocusedBlock = blockElement;
            editor.contextMenu.itemClick = (args) => {
                args.cancel = true;
            },
            (editor.contextMenuModule as any).handleContextMenuSelection(
            {
                item: { id: 'increaseindent', text: 'Increase Indent' }
            });
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

        it('should handle showItemOnClick properly', (done) => {
            editor.contextMenu.showItemOnClick = true;
            setTimeout(() => {
                expect(editor.contextMenuModule.contextMenuObj.showItemOnClick).toBe(true);
                done();
            }, 200);
        });

        it('should update item template', (done) => {
            editor.contextMenu.itemTemplate = '<span>${text}</span>';
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
            editor.contextMenu.items = items;
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-contextmenu');
                expect(popup.querySelectorAll('li').length).toBe(2);
                expect(popup.querySelector('#custom1') !== null).toBe(true);
                expect(popup.querySelector('#custom2') !== null).toBe(true);
                done();
            }, 200);
        });
    });

});
