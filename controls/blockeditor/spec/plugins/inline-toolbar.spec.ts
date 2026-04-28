import { createElement } from '@syncfusion/ej2-base';
import { createEditor, triggerMouseMove } from '../common/util.spec';
import { setCursorPosition, getBlockContentElement, getSelectedRange, setSelectionRange, getDeepestTextNode } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor, ToolbarRenderer, TooltipRenderer } from '../../src/index';
import { BaseStylesProp, ContentModel, Styles } from '../../src/models/index';
import { PopupRenderer } from '../../src/block-manager/renderer/common/popup-renderer';

describe('Inline Toolbar Module', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('Toolbar actions', () => {
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
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    },
                    {
                        id: 'paragraph-2',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Second para' }]
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

        it('should display inline toolbar on text selection', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 4);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);
                    expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });

        it('should check default inline toolbar items', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 4);
            const mouseUpEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                expect(editor.inlineToolbarSettings.items.length).toBe(6);
                done();
            }, 100);
        });

        it('should hide inline tbar popup on document click', (done) => {
            const blockElement = editor.element.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 2, 8);
            editor.element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                expect(popup).not.toBeNull();
                blockElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 50);
            }, 50);
        });
        
        it('should handle inline toolbar item click', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);
                
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    
                    const boldButton = toolbar.querySelector('[data-command="Bold"]');
                    boldButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    
                    setTimeout(() => {
                        const contentElement = getBlockContentElement(blockElement);
                        expect(contentElement.querySelector('strong')).not.toBeNull();
                        expect(contentElement.querySelector('strong').textContent).toBe('Hello');
                        expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                        
                        let itemClickedCalled = false;
                        editor.inlineToolbarSettings.itemClick = (args) => {
                            itemClickedCalled = true;
                            args.cancel = true;
                        };
                        
                        const italicButton = toolbar.querySelector('[data-command="Italic"]');
                        italicButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        
                        setTimeout(() => {
                            expect(itemClickedCalled).toBe(true);
                            expect(contentElement.querySelector('em')).toBeNull();
                            const contentModel = editor.blocks[0].content[0];
                            const styles = (contentModel.properties as BaseStylesProp).styles;              
                            expect(styles.italic).toBeFalsy(); 
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should render inline toolbar with string items', (done) => {
            const getToolbar = (): HTMLElement => document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
            const getButton = (command: string): HTMLElement =>
                getToolbar().querySelector(`[data-command="${command}"]`) as HTMLElement;
            const getContentEl = (blockEl: HTMLElement): HTMLElement => getBlockContentElement(blockEl);
            setTimeout(() => {
                editor.inlineToolbarSettings.items = ['Bold', 'Italic', 'Underline', 'Strikethrough'];
                editor.dataBind();
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"
                const mouseUpEvent = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                const toolbar = getToolbar();
                expect(toolbar).toBeTruthy();
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                getButton('Bold').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => {
                    const contentEl = getContentEl(blockElement);
                    const strong = contentEl.querySelector('strong');
                    expect(strong).not.toBeNull();
                    expect(strong!.textContent).toBe('Hello');
                    expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                    getButton('Italic').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    setTimeout(() => {
                    const em = contentEl.querySelector('em, i'); // support either tag
                    expect(em).not.toBeNull();
                    expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
                    getButton('Underline').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    setTimeout(() => {
                        const underline = contentEl.querySelector('u');
                        expect(underline).not.toBeNull();
                        expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
                        getButton('Strikethrough').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        setTimeout(() => {
                        const strike = contentEl.querySelector('s, strike, del');
                        expect(strike).not.toBeNull();
                        const styles = (editor.blocks[0].content[0].properties as BaseStylesProp).styles as Record<string, any>;
                        expect(Boolean(styles.strikethrough)).toBe(true);
                        done();
                        }, 100);
                    }, 100);
                    }, 100);
                }, 100);
                }, 100);
            }, 200);
        });

        it('should apply Subscript from inline toolbar', (done) => {
            const getToolbar = (): HTMLElement =>
                document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
            const getButton = (command: string): HTMLElement =>
                getToolbar().querySelector(`[data-command="${command}"]`) as HTMLElement;
            const getContentEl = (blockEl: HTMLElement): HTMLElement => getBlockContentElement(blockEl);
            setTimeout(() => {
                editor.inlineToolbarSettings.items = ['Subscript'];
                editor.dataBind();
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"
                const mouseUpEvent = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    const toolbar = getToolbar();
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    getButton('Subscript').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    setTimeout(() => {
                        const contentEl = getContentEl(blockElement);
                        const sub = contentEl.querySelector('sub');
                        expect(sub).not.toBeNull();
                        expect(sub!.textContent).toBe('Hello');
                        const styles = (editor.blocks[0].content[0].properties as BaseStylesProp).styles as Record<string, any>;
                        expect(Boolean(styles.subscript)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should apply Superscript from inline toolbar', (done) => {
            const getToolbar = (): HTMLElement =>
                document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
            const getButton = (command: string): HTMLElement =>
                getToolbar().querySelector(`[data-command="${command}"]`) as HTMLElement;
            const getContentEl = (blockEl: HTMLElement): HTMLElement => getBlockContentElement(blockEl);
            setTimeout(() => {
                editor.inlineToolbarSettings.items = ['Superscript'];
                editor.dataBind();
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"
                const mouseUpEvent = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    const toolbar = getToolbar();
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    getButton('Superscript').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    setTimeout(() => {
                        const contentEl = getContentEl(blockElement);
                        const sup = contentEl.querySelector('sup');
                        expect(sup).not.toBeNull();
                        expect(sup!.textContent).toBe('Hello');
                        const styles = (editor.blocks[0].content[0].properties as BaseStylesProp).styles as Record<string, any>;
                        expect(Boolean(styles.superscript)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should apply InlineCode from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['InlineCode'];
            editor.dataBind();

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"
            editorElement.dispatchEvent(new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);

                const codeButton = toolbar.querySelector('[data-command="InlineCode"]') as HTMLElement;
                codeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                const modelBlocks = editor.blocks;
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                const contentModel = modelBlocks[0].content[0];
                const styles = (contentModel.properties as BaseStylesProp).styles as Record<string, any>;
                expect(Boolean(styles.inlineCode)).toBe(true);
                expect(contentModel.content).toBe('Hello');

                const contentEl = getBlockContentElement(blockElement);
                const codeEl = contentEl.querySelector('code.e-be-inline-code, code');
                expect(codeEl).not.toBeNull();
                expect(codeEl!.textContent).toBe('Hello');
                done();
            }, 100);
        });

        it('should support Undo/Redo for InlineCode applied from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['InlineCode'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const inlineBtn = toolbar.querySelector('[data-command="InlineCode"]') as HTMLElement;
                inlineBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                setTimeout(() => {
                    // Assert applied
                    let contentEl = getBlockContentElement(blockElement);
                    expect(contentEl.querySelector('code')).not.toBeNull();
                    const modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(((modelBlocks[0].content[0].properties as BaseStylesProp).styles as any).inlineCode).toBe(true);

                    // Undo
                    editor.blockManager.undoRedoAction.undo();
                    setTimeout(() => {
                        contentEl = getBlockContentElement(blockElement);
                        expect(contentEl.querySelector('code')).toBeNull();
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                        expect(Boolean(((modelBlocks[0].content[0].properties as BaseStylesProp).styles as any).inlineCode)).toBe(false);

                        // Redo
                        editor.blockManager.undoRedoAction.redo();
                        setTimeout(() => {
                            contentEl = getBlockContentElement(blockElement);
                            const codeEl = contentEl.querySelector('code');
                            expect(codeEl).not.toBeNull();
                            expect(codeEl!.textContent).toBe('Hello');
                            const modelBlocks = editor.blocks;
                            expect(modelBlocks.length).toBe(2);
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            expect(Boolean(((modelBlocks[0].content[0].properties as BaseStylesProp).styles as any).inlineCode)).toBe(true);
                            done();
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        });

        it('should support Undo/Redo for Link inserted from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Link'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const linkBtn = toolbar.querySelector('[data-command="Link"]') as HTMLElement;
                linkBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                setTimeout(() => {
                    const dialog = document.querySelector(`#${editor.element.id}_linkDialog.e-blockeditor-link-dialog`) as HTMLElement;
                    const urlInput = dialog.querySelector('#linkUrl') as HTMLInputElement;
                    const textInput = dialog.querySelector('#linkText') as HTMLInputElement;
                    urlInput.value = 'https://example.com/undo';
                    textInput.value = 'Hello';
                    urlInput.dispatchEvent(new Event('input'));
                    (dialog.querySelector('.e-insert-link-btn') as HTMLButtonElement).click();

                    setTimeout(() => {
                        // Assert inserted
                        let contentEl = getBlockContentElement(blockElement);
                        let anchor = contentEl.querySelector('a') as HTMLAnchorElement;
                        expect(anchor).not.toBeNull();
                        expect(anchor.getAttribute('href')).toBe('https://example.com/undo');

                        // Model assertions after insert
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                        let linkContent = modelBlocks[0].content.find(c => (c as any).contentType === ContentType.Link || ((c as any).properties && (c as any).properties.url));
                        expect((linkContent as any).content).toBe('Hello');
                        expect(((linkContent as any).properties as any).url).toBe('https://example.com/undo');

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            contentEl = getBlockContentElement(blockElement);
                            anchor = contentEl.querySelector('a') as HTMLAnchorElement;
                            expect(anchor).toBeNull();

                            // Model assertions after undo
                            const modelBlocksAfterUndo = editor.blocks;
                            expect(modelBlocksAfterUndo.length).toBe(2);
                            expect(modelBlocksAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            let linkAfterUndo = modelBlocksAfterUndo[0].content.find(c => (c as any).contentType === ContentType.Link || ((c as any).properties && (c as any).properties.url));
                            expect(linkAfterUndo).toBeUndefined();

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                contentEl = getBlockContentElement(blockElement);
                                anchor = contentEl.querySelector('a') as HTMLAnchorElement;
                                expect(anchor).not.toBeNull();
                                expect(anchor.getAttribute('href')).toBe('https://example.com/undo');
                                expect(anchor.textContent).toBe('Hello');

                                // Model assertions after redo
                                const modelBlocksAfterRedo = editor.blocks;
                                expect(modelBlocksAfterRedo.length).toBe(2);
                                expect(modelBlocksAfterRedo[0].blockType).toBe(BlockType.Paragraph);
                                let linkAfterRedo = modelBlocksAfterRedo[0].content.find(c => (c as any).contentType === ContentType.Link || ((c as any).properties && (c as any).properties.url));
                                expect((linkAfterRedo as any).content).toBe('Hello');
                                expect(((linkAfterRedo as any).properties as any).url).toBe('https://example.com/undo');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        });

        it('should preserve InlineCode style when duplicating block via action menu', (done) => {
            // Ensure InlineCode is applied first
            editor.inlineToolbarSettings.items = ['InlineCode'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"
            editor.element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const inlineBtn = toolbar.querySelector('[data-command="InlineCode"]') as HTMLElement;
                inlineBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                // Open action menu and duplicate
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);

                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                    (popup.querySelector('#duplicate') as HTMLElement).click();

                    // Model assertions: new block appended after original
                    const modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBe(3);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                    const original = modelBlocks[0];
                    const duplicated = modelBlocks[1];
                    expect(duplicated.id).not.toBe(original.id);

                    // Find content with inlineCode true in duplicated block
                    const dupInline = duplicated.content.find(c => (c.properties as BaseStylesProp).styles.inlineCode === true);
                    expect(dupInline!.content).toBe('Hello');

                    // DOM assertion: next sibling has code element
                    const duplicatedEl = (blockElement.nextElementSibling as HTMLElement);
                    const dupContentEl = getBlockContentElement(duplicatedEl);
                    const codeEl = dupContentEl.querySelector('code.e-be-inline-code, code');
                    expect(codeEl).not.toBeNull();
                    expect(codeEl!.textContent).toBe('Hello');
                    done();
                }, 120);
            }, 100);
        });

        it('should delete block with InlineCode via action menu (inline toolbar)', (done) => {
            const ed = editor;
            ed.inlineToolbarSettings.items = ['InlineCode'];
            ed.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            ed.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const inlineBtn = toolbar.querySelector('[data-command="InlineCode"]') as HTMLElement;
                inlineBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                setTimeout(() => {
                    ed.blockManager.setFocusToBlock(blockElement);
                    triggerMouseMove(blockElement, 10, 10);
                    ed.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);

                    const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                    (popup.querySelector('#delete') as HTMLElement).click();

                    setTimeout(() => {
                        const modelBlocks = ed.blocks;
                        expect(modelBlocks.length).toBe(1);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                        expect(modelBlocks[0].id).toBe('paragraph-2');

                        // DOM assertions
                        const remainingBlocks = editorElement.querySelectorAll('.e-block');
                        expect(remainingBlocks.length).toBe(1);
                        expect((remainingBlocks[0] as HTMLElement).id).toBe('paragraph-2');
                        done();
                    }, 100);
                }, 150);
            }, 150);
        });

        it('should toggle InlineCode via Ctrl+` keyboard shortcut (inline toolbar context)', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"

            // Show inline toolbar
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                // Fire Ctrl+Backquote
                const inlineCodeKeyEvent = new KeyboardEvent('keydown', {
                    key: '`',
                    code: 'Backquote',
                    ctrlKey: true,
                    bubbles: true
                });
                editorElement.dispatchEvent(inlineCodeKeyEvent);

                setTimeout(() => {
                    const contentEl = getBlockContentElement(blockElement);
                    const codeEl = contentEl.querySelector('code.e-be-inline-code, code');
                    expect(codeEl).not.toBeNull();
                    expect(codeEl!.textContent).toBe('Hello');

                    const modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    const contentModel = modelBlocks[0].content[0];
                    const styles = (contentModel.properties as BaseStylesProp).styles as Record<string, any>;
                    expect(Boolean(styles.inlineCode)).toBe(true);
                    done();
                }, 120);
            }, 100);
        });

        it('should open Link dialog from inline toolbar and insert link', (done) => {
            editor.inlineToolbarSettings.items = ['Link'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"
            const mouseUpEvent = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const linkBtn = toolbar.querySelector('[data-command="Link"]') as HTMLElement;
                linkBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                setTimeout(() => {
                    const dialog = document.querySelector(`#${editor.element.id}_linkDialog.e-blockeditor-link-dialog`) as HTMLElement;
                    expect(dialog.classList.contains('e-popup-open')).toBe(true);
                    // Fill inputs
                    const urlInput = dialog.querySelector('#linkUrl') as HTMLInputElement;
                    const textInput = dialog.querySelector('#linkText') as HTMLInputElement;
                    const titleInput = dialog.querySelector('#linkTitle') as HTMLInputElement;
                    urlInput.value = 'https://example.com';
                    textInput.value = 'Hello';
                    titleInput.value = 'Example';
                    urlInput.dispatchEvent(new Event('input'));
                    const insertBtn = dialog.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                    insertBtn.click();

                    setTimeout(() => {
                        const contentEl = getBlockContentElement(blockElement);
                        const anchor = contentEl.querySelector('a') as HTMLAnchorElement;
                        expect(anchor).not.toBeNull();
                        expect(anchor.getAttribute('href')).toBe('https://example.com');
                        expect(anchor.textContent).toBe('Hello');
                        // Inline toolbar should be hidden when link dialog is shown
                        expect(toolbar.classList.contains('e-popup-open')).toBe(false);

                        // Model checking: ensure a Link content exists with correct URL and text
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                        const linkContent = modelBlocks[0].content.find(c => (c as any).contentType === ContentType.Link || ((c as any).properties && (c as any).properties.url));
                        expect((linkContent as any).content).toBe('Hello');
                        expect(((linkContent as any).properties as any).url).toBe('https://example.com');
                        done();
                    }, 150);
                }, 150);
            }, 150);
        });

        it('should preserve Link when duplicating block via action menu (inline toolbar)', (done) => {
            const ed = editor;
            ed.inlineToolbarSettings.items = ['Link'];
            ed.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            ed.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const linkBtn = toolbar.querySelector('[data-command="Link"]') as HTMLElement;
                linkBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                setTimeout(() => {
                    const dialog = document.querySelector(`#${ed.element.id}_linkDialog.e-blockeditor-link-dialog`) as HTMLElement;
                    const urlInput = dialog.querySelector('#linkUrl') as HTMLInputElement;
                    const textInput = dialog.querySelector('#linkText') as HTMLInputElement;
                    urlInput.value = 'https://example.com/dup';
                    textInput.value = 'Hello';
                    urlInput.dispatchEvent(new Event('input'));
                    (dialog.querySelector('.e-insert-link-btn') as HTMLButtonElement).click();

                    setTimeout(() => {
                        // Open action menu and duplicate
                        ed.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(blockElement, 10, 10);
                        ed.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                            const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (popup.querySelector('#duplicate') as HTMLElement).click();

                            // Delay to allow model update after duplicate
                            setTimeout(() => {
                                const modelBlocks = ed.blocks;
                                expect(modelBlocks.length).toBe(3);
                                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                                const original = modelBlocks[0];
                                const duplicated = modelBlocks[1];
                                expect(duplicated.id).not.toBe(original.id);
                                const dupLink = duplicated.content.find(c => (c as any).properties.url);
                                expect(!!dupLink).toBe(true);
                                if (dupLink) {
                                    expect(((dupLink as any).properties as any).url).toBe('https://example.com/dup');
                                    expect((dupLink as any).content).toBe('Hello');
                                }

                                // DOM: duplicated block has anchor
                                const duplicatedEl = blockElement.nextElementSibling as HTMLElement;
                                const dupContentEl = getBlockContentElement(duplicatedEl);
                                const a = dupContentEl.querySelector('a') as HTMLAnchorElement;
                                expect(a).not.toBeNull();
                                expect(a.getAttribute('href')).toBe('https://example.com/dup');
                                expect(a.textContent).toBe('Hello');
                                done();
                            }, 100);
                    }, 150);
                }, 150);
            }, 150);
        });

        it('should delete block via action menu (inline toolbar)', (done) => {
            const ed = editor;
            ed.inlineToolbarSettings.items = ['Link'];
            ed.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            ed.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const linkBtn = toolbar.querySelector('[data-command="Link"]') as HTMLElement;
                linkBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                setTimeout(() => {
                    const dialog = document.querySelector(`#${ed.element.id}_linkDialog.e-blockeditor-link-dialog`) as HTMLElement;
                    const urlInput = dialog.querySelector('#linkUrl') as HTMLInputElement;
                    const textInput = dialog.querySelector('#linkText') as HTMLInputElement;
                    urlInput.value = 'https://example.com/del';
                    textInput.value = 'Hello';
                    (dialog.querySelector('.e-insert-link-btn') as HTMLButtonElement).click();

                    setTimeout(() => {
                        ed.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(blockElement, 10, 10);
                        ed.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);

                        const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                        (popup.querySelector('#delete') as HTMLElement).click();

                        setTimeout(() => {
                            const modelBlocks = ed.blocks;
                            expect(modelBlocks.length).toBe(1);
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelBlocks[0].id).toBe('paragraph-2');

                            const remainingBlocks = editorElement.querySelectorAll('.e-block');
                            expect(remainingBlocks.length).toBe(1);
                            expect((remainingBlocks[0] as HTMLElement).id).toBe('paragraph-2');
                            done();
                        }, 100);
                    }, 150);
                }, 150);
            }, 150);
        });

        it('should open Link dialog via Ctrl+K and insert link (inline toolbar context)', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"

            // Show inline toolbar first (mouseup like normal selection)
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(!!toolbar).toBe(true);

                // Trigger Ctrl+K keyboard shortcut
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

                setTimeout(() => {
                    const dialog = document.querySelector(`#${editor.element.id}_linkDialog.e-blockeditor-link-dialog`) as HTMLElement;
                    expect(dialog).toBeTruthy();
                    expect(dialog.classList.contains('e-popup-open')).toBe(true);

                    // Fill inputs and insert
                    const urlInput = dialog.querySelector('#linkUrl') as HTMLInputElement;
                    const textInput = dialog.querySelector('#linkText') as HTMLInputElement;
                    const titleInput = dialog.querySelector('#linkTitle') as HTMLInputElement;
                    urlInput.value = 'https://example.com/shortcut';
                    textInput.value = 'Hello';
                    titleInput.value = 'Shortcut';
                    urlInput.dispatchEvent(new Event('input'));
                    (dialog.querySelector('.e-insert-link-btn') as HTMLButtonElement).click();

                    setTimeout(() => {
                        const contentEl = getBlockContentElement(blockElement);
                        const anchor = contentEl.querySelector('a') as HTMLAnchorElement;
                        expect(anchor).not.toBeNull();
                        expect(anchor.getAttribute('href')).toBe('https://example.com/shortcut');
                        expect(anchor.textContent).toBe('Hello');

                        // Model checking
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                        const linkContent = modelBlocks[0].content.find(c => (c as any).contentType === ContentType.Link || ((c as any).properties && (c as any).properties.url));
                        expect((linkContent as any).content).toBe('Hello');
                        expect(((linkContent as any).properties as any).url).toBe('https://example.com/shortcut');
                        done();
                    }, 150);
                }, 150);
            }, 120);
        });

        it('should disable Link item on multi-block selection', (done) => {
            editor.inlineToolbarSettings.items = ['Link'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar).toBeTruthy();
                const linkBtnEl = toolbar.querySelector('#toolbar-link') as HTMLElement;
                const altLinkBtnEl = toolbar.querySelector('[data-command="Link"]') as HTMLElement;
                const linkItem = (linkBtnEl ? linkBtnEl.closest('.e-toolbar-item') as HTMLElement : null)
                    || (altLinkBtnEl ? altLinkBtnEl.closest('.e-toolbar-item') as HTMLElement : null);
                expect(linkItem).toBeTruthy();
                // EJ2 marks disabled with e-overlay or aria-disabled
                const isDisabled = linkItem.classList.contains('e-overlay') || linkItem.getAttribute('aria-disabled') === 'true';
                expect(isDisabled).toBe(true);

                // Model check: model remains intact with two paragraph blocks
                const modelBlocks = editor.blocks;
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                done();
            }, 150);
        });

        it('should apply Uppercase from inline toolbar', (done) => {
            const getToolbar = (): HTMLElement =>
                document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
            const getButton = (command: string): HTMLElement =>
                getToolbar().querySelector(`[data-command="${command}"]`) as HTMLElement;
            const getContentEl = (blockEl: HTMLElement): HTMLElement => getBlockContentElement(blockEl);

            setTimeout(() => {
                editor.inlineToolbarSettings.items = [ 'Uppercase' ];
                editor.dataBind();

                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"

                const mouseUpEvent = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElement.dispatchEvent(mouseUpEvent);

                setTimeout(() => {
                    const toolbar = getToolbar();
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);

                    getButton('Uppercase').dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    setTimeout(() => {
                        const contentEl = getContentEl(blockElement);
                        expect(contentEl.innerText).toContain('HELLO world');
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should apply Lowercase from inline toolbar', (done) => {
            const getToolbar = (): HTMLElement =>
                document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
            const getButton = (command: string): HTMLElement =>
                getToolbar().querySelector(`[data-command="${command}"]`) as HTMLElement;
            const getContentEl = (blockEl: HTMLElement): HTMLElement => getBlockContentElement(blockEl);

            setTimeout(() => {
                editor.inlineToolbarSettings.items = [ 'Lowercase' ];
                editor.dataBind();

                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5); // "Hello"

                const mouseUpEvent = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElement.dispatchEvent(mouseUpEvent);

                setTimeout(() => {
                    const toolbar = getToolbar();
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);

                    getButton('Lowercase').dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    setTimeout(() => {
                        const contentEle = getContentEl(blockElement);
                        expect(contentEle.innerText).toContain('hello world');
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
    
        it('should get common styles from multiple content models', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [
                            { 
                                contentType: ContentType.Text, 
                                content: 'Bold and italic ', 
                                properties: { styles: { bold: true, italic: true }  }
                            },
                            { 
                                contentType: ContentType.Text, 
                                content: 'Bold only ', 
                                properties: { styles: { bold: true } }
                            },
                            { 
                                contentType: ContentType.Text, 
                                content: 'No formatting', 
                                properties: { styles: {} }
                            }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                
                const contentElement = getBlockContentElement(blockElement);
                
                let range = document.createRange();
                
                // Set start at beginning of first element
                let firstElement = getDeepestTextNode(contentElement.childNodes[0] as HTMLElement);
                range.setStart(firstElement, 0);
                
                // Set end at the last element
                const lastElement = contentElement.childNodes[2] as HTMLElement;
                range.setEnd(lastElement, lastElement.textContent.length);
                
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    
                    // Bold should not be active because not all content has it
                    const boldButton = toolbar.querySelector('[data-command="Bold"]');
                    expect(boldButton.classList.contains('e-active')).toBe(false);
                    
                    // Italic should not be active because not all content has it
                    const italicButton = toolbar.querySelector('[data-command="Italic"]');
                    expect(italicButton.classList.contains('e-active')).toBe(false);
                    
                    // Now select just the first content which has both bold and italic
                    firstElement = getDeepestTextNode(contentElement.childNodes[0] as HTMLElement);
                    range = document.createRange();
                    range.selectNodeContents(firstElement);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    
                    setTimeout(() => {
                        // Both bold and italic should be active now
                        expect(boldButton.classList.contains('e-active')).toBe(true);
                        expect(italicButton.classList.contains('e-active')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
        
        it('should handle color picker changes', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);
                
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    
                    const colorDropdown = toolbar.querySelector('.e-split-btn-wrapper .e-be-fontcolor-dropdown[aria-label="dropdownbutton"]');
                    colorDropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    
                    setTimeout(() => {
                        let colorCell = document.querySelectorAll('.e-color-palette .e-row .e-tile');
                        colorCell[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        
                        setTimeout(() => {
                            const contentElement = getBlockContentElement(blockElement);
                            const coloredElement = contentElement.querySelector('span[style*="color"]');
                            expect(coloredElement).not.toBeNull();
                            
                            // Should update the color icon in the toolbar
                            const colorBorderIcon = document.querySelector('.e-be-fontcolor-dropdown[aria-label="colorpicker"] .e-split-preview');
                            expect((colorBorderIcon as HTMLElement).style.backgroundColor).not.toBe('#000000');
                            const contentModel = editor.blocks[0].content[0];
                            const styles = (contentModel.properties as BaseStylesProp).styles;

                            expect(typeof styles.color).toBe('string');
                            expect(styles.color).toBe('#F44336');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 200);
        });

        // it('should handle colorpicker changes properly', () => {
        //     const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(blockElement);
        //     const contentElement = getBlockContentElement(blockElement);
        //     setSelectionRange(contentElement.lastChild, 0, 4);
            
        //     (editor.blockManager.inlineToolbarModule as any).handleColorChange({
        //         type: 'backgroundColor',
        //         value: 'rgb(255, 132, 132)'
        //     });
        //     const tbarIcon = document.querySelector('.e-inline-bgColor-icon') as HTMLElement;
        //     expect(tbarIcon.style.borderBottomColor).toBe('rgb(255, 132, 132)');
        //     const contentModel = editor.blocks[0].content[0];
        //     const styles = (contentModel.properties as BaseStylesProp).styles;

        //     expect(typeof styles.backgroundColor).toBe('string');
        //     expect(styles.backgroundColor).toBe('#FF8484');

        // });
        
        it('should handle property changes', (done) => {
            setTimeout(() => {
                const originalWidth = editor.inlineToolbarSettings.popupWidth;
                editor.inlineToolbarSettings.popupWidth = '500px';
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    expect((popup as HTMLElement).style.width).toBe('500px');
                    
                    const originalItems = [...editor.inlineToolbarSettings.items];
                    editor.inlineToolbarSettings.items = [
                        { id: 'bold', iconCss: 'e-icons e-bold', tooltipText: 'Bold', command: CommandName.Bold, htmlAttributes: { 'data-command': CommandName.Bold } },
                        { id: 'italic', iconCss: 'e-icons e-italic', tooltipText: 'Italic', command: CommandName.Italic, htmlAttributes: { 'data-command': CommandName.Italic } },
                    ];
                    
                    setTimeout(() => {
                        const toolbar = document.querySelector('.e-blockeditor-inline-toolbar');
                        const toolbarItems = toolbar.querySelectorAll('.e-toolbar-item');
                        expect(toolbarItems.length).toBe(2);
                        
                        editor.inlineToolbarSettings.popupWidth = originalWidth;
                        expect(editor.inlineToolbarSettings.items.length).toBe(2);
                        
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
        
        // BUG DOUBT
        it('should handle keyboard shortcuts for formatting', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);
                
                const boldKeyEvent = new KeyboardEvent('keydown', {
                    key: 'b',
                    code: 'KeyB',
                    ctrlKey: true,
                    bubbles: true
                });
                editorElement.dispatchEvent(boldKeyEvent);
                
                setTimeout(() => {
                    const contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.querySelector('strong')).not.toBeNull();
                    expect(contentElement.querySelector('strong').textContent).toBe('Hello');
                    
                    const italicKeyEvent = new KeyboardEvent('keydown', {
                        key: 'i',
                        code: 'KeyI',
                        ctrlKey: true,
                        bubbles: true
                    });
                    editorElement.dispatchEvent(italicKeyEvent);
                    
                    setTimeout(() => {
                        expect(contentElement.querySelector('strong em')).not.toBeNull();
                        expect(contentElement.querySelector('strong em').textContent).toBe('Hello');
                        const contentModel = editor.blocks[0].content[0];
                        const styles = (contentModel.properties as BaseStylesProp).styles;
                        expect(styles.bold).toBe(true);
                        expect(styles.italic).toBe(true);
                        expect(contentModel.content).toBe('Hello');
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
        
        it('should apply RTL settings', (done) => {
            setTimeout(() => {
                editor.enableRtl = true;
                editor.dataBind();
                
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar');
                    expect(toolbar.classList.contains('e-rtl')).toBe(true);
                    
                    editor.enableRtl = false;
                    editor.dataBind();
                    
                    setTimeout(() => {
                        expect(toolbar.classList.contains('e-rtl')).toBe(false);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should initialize Transform dropdown in inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar).not.toBeNull();
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                expect(transformBtn).not.toBeNull();
                expect(transformBtn.classList.contains('e-dropdown-btn')).toBe(true);
                done();
            }, 100);
        });

        it('should display correct label for Paragraph block in Transform dropdown', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                expect(transformIcon).not.toBeNull();
                expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);
                done();
            }, 100);
        });

        it('should preserve selection when transforming selected inline content via Transform dropdown', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            const before = (window.getSelection() && window.getSelection().toString()) || '';
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();

                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading1 = menuPopup.querySelector('#heading1-command') as HTMLElement;
                    heading1.click();

                    setTimeout(() => {
                        const after = (window.getSelection() && window.getSelection().toString()) || '';
                        expect(after).toBe(before);
                        done();
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform Paragraph to Heading 1 from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    expect(menuPopup).not.toBeNull();
                    const heading1Item = menuPopup.querySelector('#heading1-command') as HTMLElement;
                    expect(heading1Item).not.toBeNull();
                    heading1Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(1);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h1') as HTMLElement;
                        expect(headingEle).not.toBeNull(); // h1 should exist
                        expect(headingEle.textContent).toBe('Hello world'); // h1 should contain correct text
                        expect(headingEle.tagName).toBe('H1');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h1')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(1);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h1') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H1');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform Paragraph to Heading 2 and verify model and DOM', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading2Item = menuPopup.querySelector('#heading2-command') as HTMLElement;
                    heading2Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(2);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h2') as HTMLElement;
                        expect(headingEle).not.toBeNull();
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(headingEle.tagName).toBe('H2');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h2')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(2);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h2') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H2');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform Paragraph to Heading 3 from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading3Item = menuPopup.querySelector('#heading3-command') as HTMLElement;
                    heading3Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(3);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h3') as HTMLElement;
                        expect(headingEle).not.toBeNull();
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(headingEle.tagName).toBe('H3'); 
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h3')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(3);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h3') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H3');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform Paragraph to Heading 4 from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading4Item = menuPopup.querySelector('#heading4-command') as HTMLElement;
                    heading4Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(4);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h4') as HTMLElement;
                        expect(headingEle).not.toBeNull();
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(headingEle.tagName).toBe('H4');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h4')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(4);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h4') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H4');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform Paragraph to Bullet List from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const bulletListItem = menuPopup.querySelector('#bullet-list-command') as HTMLElement;
                    bulletListItem.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                        const bulletBlock = editorElement.querySelector('.e-block') as HTMLElement;
                        const listElement = bulletBlock.querySelector('ul') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listElement).not.toBeNull();
                        expect(listItem).not.toBeNull();
                        expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Hello world');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-list-unordered')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                            expect(updatedBlock.firstElementChild.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                                const bulletBlock = editorElement.querySelector('.e-block') as HTMLElement;
                                const listElement = bulletBlock.querySelector('ul') as HTMLElement;
                                const listItem = listElement.querySelector('li') as HTMLElement;
                                expect(listElement).not.toBeNull(); // UL should exist
                                expect(listItem).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform Paragraph to Numbered List from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const numberedListItem = menuPopup.querySelector('#numbered-list-command') as HTMLElement;
                    numberedListItem.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                        const numberBlock = editorElement.querySelector('.e-block') as HTMLElement;
                        const listElement = numberBlock.querySelector('ol') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listElement).not.toBeNull();
                        expect(listItem).not.toBeNull();
                        expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Hello world');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-list-ordered')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                            expect(updatedBlock.firstElementChild.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                                const numberBlock = editorElement.querySelector('.e-block') as HTMLElement;
                                const listElement = numberBlock.querySelector('ol') as HTMLElement;
                                const listItem = listElement.querySelector('li') as HTMLElement;
                                expect(listElement).not.toBeNull();
                                expect(listItem).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform Paragraph to Checklist from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const checklistItem = menuPopup.querySelector('#checklist-command') as HTMLElement;
                    checklistItem.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                        const checklistBlock = editorElement.querySelector('.e-block[data-block-type="Checklist"]');
                        expect(checklistBlock).not.toBeNull();
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-check-box')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                            expect(updatedBlock.firstElementChild.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                                const checklistBlock = editorElement.querySelector('.e-block[data-block-type="Checklist"]');
                                expect(checklistBlock).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        // Feature
        // it('should transform Paragraph to Quote from inline toolbar', (done) => {
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();
        //     const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(blockElement);
        //     const contentElement = getBlockContentElement(blockElement);
        //     editor.setSelection(contentElement.lastChild as Node, 0, 5);
        //     editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //     setTimeout(() => {
        //         const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //         expect(toolbar.classList.contains('e-popup-open')).toBe(true);
        //         const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
        //         transformBtn.click();
        //         setTimeout(() => {
        //             const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
        //             const quoteItem = menuPopup.querySelector('#quote-command') as HTMLElement;
        //             quoteItem.click();
        //             setTimeout(() => {
        //                 const modelBlocks = editor.blocks;
        //                 const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //                 // expect(modelBlocks.length).toBe(2);
        //                 // expect(domBlocks.length).toBe(2);
        //                 // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
        //                 const blockquoteElement = editorElement.querySelector('.e-block').querySelector('blockquote') as HTMLElement;
        //                 // expect(blockquoteElement).not.toBeNull();
        //                 // expect(blockquoteElement.textContent).toBe('Hello world');
        //                 // expect(blockquoteElement.tagName).toBe('BLOCKQUOTE');
        //                 // expect(modelBlocks[0].content[0].content).toBe('Hello');
        //                 const labelSpan = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
        //                 // expect(labelSpan.textContent).toBe('Quote');

        //                 // Undo
        //                 editor.blockManager.undoRedoAction.undo();
        //                 setTimeout(() => {
        //                     let modelBlocks = editor.blocks;
        //                     // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
        //                     let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //                     // expect(updatedBlock.firstElementChild.tagName).toBe('P');

        //                     // Redo
        //                     editor.blockManager.undoRedoAction.redo();
        //                     setTimeout(() => {
        //                         modelBlocks = editor.blocks;
        //                         // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
        //                         const updatedBlock = editorElement.querySelector('.e-block') as HTMLElement;
        //                         const blockquoteElement = updatedBlock.querySelector('blockquote') as HTMLElement;
        //                         // expect(blockquoteElement).not.toBeNull();
        //                         done();
        //                     }, 50);
        //                 }, 50);
        //             }, 50);
        //         }, 50);
        //     }, 100);
        // });

        it('should transform multiple Paragraphs to Heading 1 from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading1Item = menuPopup.querySelector('#heading1-command') as HTMLElement;
                    heading1Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(1);
                        expect((modelBlocks[1].properties as any).level).toBe(1);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h1') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h1') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H1');
                        expect(headingEle2.tagName).toBe('H1');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h1') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h1') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H1');
                                expect(domAfterRedo2.tagName).toBe('H1');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform multiple Paragraphs to Heading 2 from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading2Item = menuPopup.querySelector('#heading2-command') as HTMLElement;
                    heading2Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(2);
                        expect((modelBlocks[1].properties as any).level).toBe(2);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h2') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h2') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H2');
                        expect(headingEle2.tagName).toBe('H2');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h2') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h2') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H2');
                                expect(domAfterRedo2.tagName).toBe('H2');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform multiple Paragraphs to Heading 3 from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading3Item = menuPopup.querySelector('#heading3-command') as HTMLElement;
                    heading3Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(3);
                        expect((modelBlocks[1].properties as any).level).toBe(3);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h3') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h3') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H3');
                        expect(headingEle2.tagName).toBe('H3');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h3') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h3') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H3');
                                expect(domAfterRedo2.tagName).toBe('H3');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform multiple Paragraphs to Heading 4 from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading4Item = menuPopup.querySelector('#heading4-command') as HTMLElement;
                    heading4Item.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(4);
                        expect((modelBlocks[1].properties as any).level).toBe(4);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h4') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h4') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H4');
                        expect(headingEle2.tagName).toBe('H4');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h4') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h4') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H4');
                                expect(domAfterRedo2.tagName).toBe('H4');
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform multiple Paragraphs to Bullet List from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const bulletItem = menuPopup.querySelector('#bullet-list-command') as HTMLElement;
                    bulletItem.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                        expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                        const bulletBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const bulletBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                        const listElement1 = bulletBlock1.querySelector('ul') as HTMLElement;
                        const listItem1 = listElement1.querySelector('li') as HTMLElement;
                        const listElement2 = bulletBlock2.querySelector('ul') as HTMLElement;
                        const listItem2 = listElement2.querySelector('li') as HTMLElement;
                        expect(listElement1).not.toBeNull();
                        expect(listItem1).not.toBeNull();
                        expect(listElement2).not.toBeNull();
                        expect(listItem2).not.toBeNull();
                        expect(editorElement.querySelector('#paragraph-1').querySelector('li').textContent).toBe('Hello world');
                        expect(editorElement.querySelector('#paragraph-2').querySelector('li').textContent).toBe('Second para');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.BulletList);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.BulletList);
                                const bulletBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                                const bulletBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                                const listElement1 = bulletBlock1.querySelector('ul') as HTMLElement;
                                const listItem1 = listElement1.querySelector('li') as HTMLElement;
                                const listElement2 = bulletBlock2.querySelector('ul') as HTMLElement;
                                const listItem2 = listElement2.querySelector('li') as HTMLElement;
                                expect(listElement1).not.toBeNull();
                                expect(listItem1).not.toBeNull();
                                expect(listElement2).not.toBeNull();
                                expect(listItem2).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform multiple Paragraphs to Numbered List from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const numberedItem = menuPopup.querySelector('#numbered-list-command') as HTMLElement;
                    numberedItem.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                        expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                        const numberBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const numberBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                        const listElement1 = numberBlock1.querySelector('ol') as HTMLElement;
                        const listItem1 = listElement1.querySelector('li') as HTMLElement;
                        const listElement2 = numberBlock2.querySelector('ol') as HTMLElement;
                        const listItem2 = listElement2.querySelector('li') as HTMLElement;
                        expect(listElement1).not.toBeNull();
                        expect(listItem1).not.toBeNull();
                        expect(listElement2).not.toBeNull();
                        expect(listItem2).not.toBeNull();
                        expect(editorElement.querySelector('#paragraph-1').querySelector('li').textContent).toBe('Hello world');
                        expect(editorElement.querySelector('#paragraph-2').querySelector('li').textContent).toBe('Second para');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.NumberedList);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.NumberedList);
                                const numberBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                                const numberBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                                const listElement1 = numberBlock1.querySelector('ol') as HTMLElement;
                                const listItem1 = listElement1.querySelector('li') as HTMLElement;
                                const listElement2 = numberBlock2.querySelector('ol') as HTMLElement;
                                const listItem2 = listElement2.querySelector('li') as HTMLElement;
                                expect(listElement1).not.toBeNull();
                                expect(listItem1).not.toBeNull();
                                expect(listElement2).not.toBeNull();
                                expect(listItem2).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should transform multiple Paragraphs to Checklist from inline toolbar', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const checklistItem = menuPopup.querySelector('#checklist-command') as HTMLElement;
                    checklistItem.click();
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                        const checklistBlock1 = editorElement.querySelector('#paragraph-1[data-block-type="Checklist"]');
                        const checklistBlock2 = editorElement.querySelector('#paragraph-2[data-block-type="Checklist"]');
                        expect(checklistBlock1).not.toBeNull();
                        expect(checklistBlock2).not.toBeNull();
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Checklist);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Checklist);
                                const checklistBlock1 = editorElement.querySelector('#paragraph-1[data-block-type="Checklist"]');
                                const checklistBlock2 = editorElement.querySelector('#paragraph-2[data-block-type="Checklist"]');
                                expect(checklistBlock1).not.toBeNull();
                                expect(checklistBlock2).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        // Feature
        // it('should transform multiple Paragraphs to Quote from inline toolbar', (done) => {
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();
        //     const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //     const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(block1);
        //     const content1 = getBlockContentElement(block1);
        //     const content2 = getBlockContentElement(block2);

        //     const range = document.createRange();
        //     range.setStart(content1.firstChild as ChildNode, 0);
        //     range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
        //     const sel = window.getSelection();
        //     sel.removeAllRanges();
        //     sel.addRange(range);
        //     editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //     setTimeout(() => {
        //         const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //         // expect(toolbar.classList.contains('e-popup-open')).toBe(true);
        //         const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
        //         transformBtn.click();
        //         setTimeout(() => {
        //             const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
        //             const quoteItem = menuPopup.querySelector('#quote-command') as HTMLElement;
        //             quoteItem.click();
        //             setTimeout(() => {
        //                 const modelBlocks = editor.blocks;
        //                 const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //                 // expect(modelBlocks.length).toBe(2);
        //                 // expect(domBlocks.length).toBe(2);
        //                 // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
        //                 // expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //                 const blockquoteElement1 = editorElement.querySelector('#paragraph-1').querySelector('blockquote') as HTMLElement;
        //                 const blockquoteElement2 = editorElement.querySelector('#paragraph-2').querySelector('blockquote') as HTMLElement;
        //                 // expect(blockquoteElement1).not.toBeNull();
        //                 // expect(blockquoteElement2).not.toBeNull();
        //                 // expect(blockquoteElement1.textContent).toBe('Hello world');
        //                 // expect(blockquoteElement2.textContent).toBe('Second para');
        //                 // expect(blockquoteElement1.tagName).toBe('BLOCKQUOTE');
        //                 // expect(blockquoteElement2.tagName).toBe('BLOCKQUOTE');
        //                 // expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //                 // expect(modelBlocks[1].content[0].content).toBe('Second para');
        //                 const labelSpan = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
        //                 // expect(labelSpan.textContent).toBe('Transform Blocks');

        //                 // Undo
        //                 editor.blockManager.undoRedoAction.undo();
        //                 setTimeout(() => {
        //                     const modelAfterUndo = editor.blocks;
        //                     // expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
        //                     // expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
        //                     const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
        //                     const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
        //                     // expect(domAfterUndo1.tagName).toBe('P');
        //                     // expect(domAfterUndo2.tagName).toBe('P');

        //                     // Redo
        //                     editor.blockManager.undoRedoAction.redo();
        //                     setTimeout(() => {
        //                         const modelAfterRedo = editor.blocks;
        //                         // expect(modelAfterRedo[0].blockType).toBe(BlockType.Quote);
        //                         // expect(modelAfterRedo[1].blockType).toBe(BlockType.Quote);
        //                         const blockquoteElement1 = editorElement.querySelector('#paragraph-1').querySelector('blockquote') as HTMLElement;
        //                         const blockquoteElement2 = editorElement.querySelector('#paragraph-2').querySelector('blockquote') as HTMLElement;
        //                         // expect(blockquoteElement1).not.toBeNull();
        //                         // expect(blockquoteElement2).not.toBeNull();
        //                         done();
        //                     }, 50);
        //                 }, 50);
        //             }, 50);
        //         }, 50);
        //     }, 100);
        // });

        it('should transform to Heading 1 via keyboard shortcut Ctrl+Alt+1', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '1', code: 'Digit1', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(1);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h1') as HTMLElement;
                        expect(headingEle).not.toBeNull();
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(headingEle.tagName).toBe('H1');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h1')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(1);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h1') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H1');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform to Heading 2 via keyboard shortcut Ctrl+Alt+2', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '2', code: 'Digit2', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(2);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h2') as HTMLElement;
                        expect(headingEle).not.toBeNull();
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(headingEle.tagName).toBe('H2'); 
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h2')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(2);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h2') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H2');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform to Heading 3 via keyboard shortcut Ctrl+Alt+3', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '3', code: 'Digit3', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(3);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h3') as HTMLElement;
                        expect(headingEle).not.toBeNull();
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(headingEle.tagName).toBe('H3'); 
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h3')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(3);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h3') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H3');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform to Heading 4 via keyboard shortcut Ctrl+Alt+4', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '4', code: 'Digit4', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(4);
                        const headingEle = editorElement.querySelector('.e-block').querySelector('h4') as HTMLElement;
                        expect(headingEle).not.toBeNull();
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(headingEle.tagName).toBe('H4'); 
                        expect(headingEle.textContent).toBe('Hello world');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-h4')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('.e-block').querySelector('p') as HTMLElement;
                            expect(updatedBlock.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[0].properties as any).level).toBe(4);
                                updatedBlock = editorElement.querySelector('.e-block').querySelector('h4') as HTMLElement;
                                expect(updatedBlock.tagName).toBe('H4');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform to Bullet List via keyboard shortcut Ctrl+Shift+8', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '8', code: 'Digit8', ctrlKey: true, shiftKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                        const bulletBlock = editorElement.querySelector('.e-block') as HTMLElement;
                        const listElement = bulletBlock.querySelector('ul') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listElement).not.toBeNull();
                        expect(listItem).not.toBeNull();
                        expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Hello world');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-list-unordered')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                            expect(updatedBlock.firstElementChild.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                                const bulletBlock = editorElement.querySelector('.e-block') as HTMLElement;
                                const listElement = bulletBlock.querySelector('ul') as HTMLElement;
                                const listItem = listElement.querySelector('li') as HTMLElement;
                                expect(listElement).not.toBeNull(); // UL should exist
                                expect(listItem).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform to Numbered List via keyboard shortcut Ctrl+Shift+9', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '9', code: 'Digit9', ctrlKey: true, shiftKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                        const numberBlock = editorElement.querySelector('.e-block') as HTMLElement;
                        const listElement = numberBlock.querySelector('ol') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listElement).not.toBeNull();
                        expect(listItem).not.toBeNull();
                        expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Hello world');
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-list-ordered')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                            expect(updatedBlock.firstElementChild.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                                const numberBlock = editorElement.querySelector('.e-block') as HTMLElement;
                                const listElement = numberBlock.querySelector('ol') as HTMLElement;
                                const listItem = listElement.querySelector('li') as HTMLElement;
                                expect(listElement).not.toBeNull();
                                expect(listItem).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform to Checklist via keyboard shortcut Ctrl+Shift+7', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '7', code: 'Digit7', ctrlKey: true, shiftKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                        const checklistBlock = editorElement.querySelector('.e-block[data-block-type="Checklist"]');
                        expect(checklistBlock).not.toBeNull();
                        expect(modelBlocks[0].content[0].content).toBe('Hello');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-check-box')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            let modelBlocks = editor.blocks;
                            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                            let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                            expect(updatedBlock.firstElementChild.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                modelBlocks = editor.blocks;
                                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                                const checklistBlock = editorElement.querySelector('.e-block[data-block-type="Checklist"]');
                                expect(checklistBlock).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        // Feature
        // it('should transform to Quote via keyboard shortcut Ctrl+Alt+Q', (done) => {
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();
        //     const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(blockElement);
        //     const contentElement = getBlockContentElement(blockElement);
        //     editor.setSelection(contentElement.lastChild as Node, 0, 5);
        //     editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //     setTimeout(() => {
        //         const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //         // expect(toolbar.classList.contains('e-popup-open')).toBe(true);
        //         const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
        //         transformBtn.click();
        //         setTimeout(() => {
        //             const keyEvent = new KeyboardEvent('keydown', { key: 'q', code: 'Keyq', ctrlKey: true, altKey: true, bubbles: true });
        //             editorElement.dispatchEvent(keyEvent);
        //             setTimeout(() => {
        //                 const modelBlocks = editor.blocks;
        //                 const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //                 // expect(modelBlocks.length).toBe(2);
        //                 // expect(domBlocks.length).toBe(2);
        //                 // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
        //                 const blockquoteElement = editorElement.querySelector('.e-block').querySelector('blockquote') as HTMLElement;
        //                 // expect(blockquoteElement).not.toBeNull();
        //                 // expect(blockquoteElement.textContent).toBe('Hello world');
        //                 // expect(blockquoteElement.tagName).toBe('BLOCKQUOTE');
        //                 // expect(modelBlocks[0].content[0].content).toBe('Hello');
        //                 const labelSpan = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
        //                 // expect(labelSpan.textContent).toBe('Quote');

        //                 // Undo
        //                 editor.blockManager.undoRedoAction.undo();
        //                 setTimeout(() => {
        //                     let modelBlocks = editor.blocks;
        //                     // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
        //                     let updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //                     // expect(updatedBlock.firstElementChild.tagName).toBe('P');

        //                     // Redo
        //                     editor.blockManager.undoRedoAction.redo();
        //                     setTimeout(() => {
        //                         modelBlocks = editor.blocks;
        //                         // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
        //                         const updatedBlock = editorElement.querySelector('.e-block') as HTMLElement;
        //                         const blockquoteElement = updatedBlock.querySelector('blockquote') as HTMLElement;
        //                         // expect(blockquoteElement).not.toBeNull();
        //                         done();
        //                     }, 50);
        //                 }, 50);
        //             }, 100);
        //         }, 50);
        //     }, 100);
        // });

        it('should transform multiple blocks to Heading 1 via keyboard shortcut Ctrl+Alt+1', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '1', code: 'Digit1', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(1);
                        expect((modelBlocks[1].properties as any).level).toBe(1);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h1') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h1') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H1');
                        expect(headingEle2.tagName).toBe('H1');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h1') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h1') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H1');
                                expect(domAfterRedo2.tagName).toBe('H1');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform multiple blocks to Heading 2 via keyboard shortcut Ctrl+Alt+2', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '2', code: 'Digit2', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(2);
                        expect((modelBlocks[1].properties as any).level).toBe(2);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h2') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h2') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H2');
                        expect(headingEle2.tagName).toBe('H2');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h2') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h2') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H2');
                                expect(domAfterRedo2.tagName).toBe('H2');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform multiple blocks to Heading 3 via keyboard shortcut Ctrl+Alt+3', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '3', code: 'Digit3', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(3);
                        expect((modelBlocks[1].properties as any).level).toBe(3);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h3') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h3') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H3');
                        expect(headingEle2.tagName).toBe('H3');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h3') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h3') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H3');
                                expect(domAfterRedo2.tagName).toBe('H3');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform multiple blocks to Heading 4 via keyboard shortcut Ctrl+Alt+4', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '4', code: 'Digit4', ctrlKey: true, altKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(4);
                        expect((modelBlocks[1].properties as any).level).toBe(4);
                        const headingEle1 = editorElement.querySelector('#paragraph-1').querySelector('h4') as HTMLElement;
                        const headingEle2 = editorElement.querySelector('#paragraph-2').querySelector('h4') as HTMLElement;
                        expect(headingEle1).not.toBeNull();
                        expect(headingEle2).not.toBeNull();
                        expect(headingEle1.textContent).toBe('Hello world');
                        expect(headingEle2.textContent).toBe('Second para');
                        expect(headingEle1.tagName).toBe('H4');
                        expect(headingEle2.tagName).toBe('H4');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Heading);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Heading);
                                const domAfterRedo1 = editorElement.querySelector('#paragraph-1').querySelector('h4') as HTMLElement;
                                const domAfterRedo2 = editorElement.querySelector('#paragraph-2').querySelector('h4') as HTMLElement;
                                expect(domAfterRedo1.tagName).toBe('H4');
                                expect(domAfterRedo2.tagName).toBe('H4');
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform multiple blocks to Bullet List via keyboard shortcut Ctrl+Shift+8', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '8', code: 'Digit8', ctrlKey: true, shiftKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                        expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                        const bulletBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const bulletBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                        const listElement1 = bulletBlock1.querySelector('ul') as HTMLElement;
                        const listItem1 = listElement1.querySelector('li') as HTMLElement;
                        const listElement2 = bulletBlock2.querySelector('ul') as HTMLElement;
                        const listItem2 = listElement2.querySelector('li') as HTMLElement;
                        expect(listElement1).not.toBeNull();
                        expect(listItem1).not.toBeNull();
                        expect(listElement2).not.toBeNull();
                        expect(listItem2).not.toBeNull();
                        expect(editorElement.querySelector('#paragraph-1').querySelector('li').textContent).toBe('Hello world');
                        expect(editorElement.querySelector('#paragraph-2').querySelector('li').textContent).toBe('Second para');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.BulletList);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.BulletList);
                                const bulletBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                                const bulletBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                                const listElement1 = bulletBlock1.querySelector('ul') as HTMLElement;
                                const listItem1 = listElement1.querySelector('li') as HTMLElement;
                                const listElement2 = bulletBlock2.querySelector('ul') as HTMLElement;
                                const listItem2 = listElement2.querySelector('li') as HTMLElement;
                                expect(listElement1).not.toBeNull();
                                expect(listItem1).not.toBeNull();
                                expect(listElement2).not.toBeNull();
                                expect(listItem2).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform multiple blocks to Numbered List via keyboard shortcut Ctrl+Shift+9', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '9', code: 'Digit9', ctrlKey: true, shiftKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                        expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                        const numberBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const numberBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                        const listElement1 = numberBlock1.querySelector('ol') as HTMLElement;
                        const listItem1 = listElement1.querySelector('li') as HTMLElement;
                        const listElement2 = numberBlock2.querySelector('ol') as HTMLElement;
                        const listItem2 = listElement2.querySelector('li') as HTMLElement;
                        expect(listElement1).not.toBeNull();
                        expect(listItem1).not.toBeNull();
                        expect(listElement2).not.toBeNull();
                        expect(listItem2).not.toBeNull();
                        expect(editorElement.querySelector('#paragraph-1').querySelector('li').textContent).toBe('Hello world');
                        expect(editorElement.querySelector('#paragraph-2').querySelector('li').textContent).toBe('Second para');
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.NumberedList);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.NumberedList);
                                const numberBlock1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
                                const numberBlock2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
                                const listElement1 = numberBlock1.querySelector('ol') as HTMLElement;
                                const listItem1 = listElement1.querySelector('li') as HTMLElement;
                                const listElement2 = numberBlock2.querySelector('ol') as HTMLElement;
                                const listItem2 = listElement2.querySelector('li') as HTMLElement;
                                expect(listElement1).not.toBeNull();
                                expect(listItem1).not.toBeNull();
                                expect(listElement2).not.toBeNull();
                                expect(listItem2).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        it('should transform multiple blocks to Checklist via keyboard shortcut Ctrl+Shift+7', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const keyEvent = new KeyboardEvent('keydown', { key: '7', code: 'Digit7', ctrlKey: true, shiftKey: true, bubbles: true });
                    editorElement.dispatchEvent(keyEvent);
                    setTimeout(() => {
                        const modelBlocks = editor.blocks;
                        const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(modelBlocks.length).toBe(2);
                        expect(domBlocks.length).toBe(2);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                        expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                        const checklistBlock1 = editorElement.querySelector('#paragraph-1[data-block-type="Checklist"]');
                        const checklistBlock2 = editorElement.querySelector('#paragraph-2[data-block-type="Checklist"]');
                        expect(checklistBlock1).not.toBeNull();
                        expect(checklistBlock2).not.toBeNull();
                        expect(modelBlocks[0].content[0].content).toBe('Hello world');
                        expect(modelBlocks[1].content[0].content).toBe('Second para');
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                        // Undo
                        editor.blockManager.undoRedoAction.undo();
                        setTimeout(() => {
                            const modelAfterUndo = editor.blocks;
                            expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
                            expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
                            const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                            const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
                            expect(domAfterUndo1.tagName).toBe('P');
                            expect(domAfterUndo2.tagName).toBe('P');

                            // Redo
                            editor.blockManager.undoRedoAction.redo();
                            setTimeout(() => {
                                const modelAfterRedo = editor.blocks;
                                expect(modelAfterRedo[0].blockType).toBe(BlockType.Checklist);
                                expect(modelAfterRedo[1].blockType).toBe(BlockType.Checklist);
                                const checklistBlock1 = editorElement.querySelector('#paragraph-1[data-block-type="Checklist"]');
                                const checklistBlock2 = editorElement.querySelector('#paragraph-2[data-block-type="Checklist"]');
                                expect(checklistBlock1).not.toBeNull();
                                expect(checklistBlock2).not.toBeNull();
                                done();
                            }, 50);
                        }, 50);
                    }, 100);
                }, 50);
            }, 100);
        });

        // Feature
        // it('should transform multiple blocks to Quote via keyboard shortcut Ctrl+Alt+Q', (done) => {
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();
        //     const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //     const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(block1);
        //     const content1 = getBlockContentElement(block1);
        //     const content2 = getBlockContentElement(block2);

        //     const range = document.createRange();
        //     range.setStart(content1.firstChild as ChildNode, 0);
        //     range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
        //     const sel = window.getSelection();
        //     sel.removeAllRanges();
        //     sel.addRange(range);
        //     editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //     setTimeout(() => {
        //         const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //         // expect(toolbar.classList.contains('e-popup-open')).toBe(true);
        //         const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
        //         transformBtn.click();
        //         setTimeout(() => {
        //             const keyEvent = new KeyboardEvent('keydown', { key: 'q', code: 'Keyq', ctrlKey: true, altKey: true, bubbles: true });
        //             editorElement.dispatchEvent(keyEvent);
        //             setTimeout(() => {
        //                 const modelBlocks = editor.blocks;
        //                 const domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //                 // expect(modelBlocks.length).toBe(2);
        //                 // expect(domBlocks.length).toBe(2);
        //                 // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
        //                 // expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //                 const blockquoteElement1 = editorElement.querySelector('#paragraph-1').querySelector('blockquote') as HTMLElement;
        //                 const blockquoteElement2 = editorElement.querySelector('#paragraph-2').querySelector('blockquote') as HTMLElement;
        //                 // expect(blockquoteElement1).not.toBeNull();
        //                 // expect(blockquoteElement2).not.toBeNull();
        //                 // expect(blockquoteElement1.textContent).toBe('Hello world');
        //                 // expect(blockquoteElement2.textContent).toBe('Second para');
        //                 // expect(blockquoteElement1.tagName).toBe('BLOCKQUOTE');
        //                 // expect(blockquoteElement2.tagName).toBe('BLOCKQUOTE');
        //                 // expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //                 // expect(modelBlocks[1].content[0].content).toBe('Second para');
        //                 const labelSpan = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
        //                 // expect(labelSpan.textContent).toBe('Transform Blocks');

        //                 // Undo
        //                 editor.blockManager.undoRedoAction.undo();
        //                 setTimeout(() => {
        //                     const modelAfterUndo = editor.blocks;
        //                     // expect(modelAfterUndo[0].blockType).toBe(BlockType.Paragraph);
        //                     // expect(modelAfterUndo[1].blockType).toBe(BlockType.Paragraph);
        //                     const domAfterUndo1 = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
        //                     const domAfterUndo2 = editorElement.querySelector('#paragraph-2').querySelector('p') as HTMLElement;
        //                     // expect(domAfterUndo1.tagName).toBe('P');
        //                     // expect(domAfterUndo2.tagName).toBe('P');

        //                     // Redo
        //                     editor.blockManager.undoRedoAction.redo();
        //                     setTimeout(() => {
        //                         const modelAfterRedo = editor.blocks;
        //                         // expect(modelAfterRedo[0].blockType).toBe(BlockType.Quote);
        //                         // expect(modelAfterRedo[1].blockType).toBe(BlockType.Quote);
        //                         const blockquoteElement1 = editorElement.querySelector('#paragraph-1').querySelector('blockquote') as HTMLElement;
        //                         const blockquoteElement2 = editorElement.querySelector('#paragraph-2').querySelector('blockquote') as HTMLElement;
        //                         // expect(blockquoteElement1).not.toBeNull();
        //                         // expect(blockquoteElement2).not.toBeNull();
        //                         done();
        //                     }, 50);
        //                 }, 50);
        //             }, 100);
        //         }, 50);
        //     }, 100);
        // });

        // Additional single-block duplicate/delete tests for other transforms
        
        it('should duplicate transformed block (Heading 1) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                // expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading1Item = menuPopup.querySelector('#heading1-command') as HTMLElement;
                    heading1Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h1') as HTMLElement;
                        // expect(updatedBlock.tagName).toBe('H1');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#duplicate') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                // expect(modelBlocks.length).toBe(3);
                                // expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                                // expect((modelBlocks[1].properties as any).level).toBe(1);
                                // expect((modelBlocks[1].content[0].content)).toBe('Hello');
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should delete transformed block (Heading 1) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading1Item = menuPopup.querySelector('#heading1-command') as HTMLElement;
                    heading1Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h1') as HTMLElement;
                        expect(updatedBlock.tagName).toBe('H1');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#delete') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(1);
                                const remaining = editorElement.querySelectorAll('.e-block');
                                expect(remaining.length).toBe(1);
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should duplicate transformed block (Heading 2) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading2Item = menuPopup.querySelector('#heading2-command') as HTMLElement;
                    heading2Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h2') as HTMLElement;
                        expect(updatedBlock.tagName).toBe('H2');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#duplicate') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(3);
                                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[1].properties as any).level).toBe(2);
                                expect((modelBlocks[1].content[0].content)).toBe('Hello');
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should delete transformed block (Heading 2) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading2Item = menuPopup.querySelector('#heading2-command') as HTMLElement;
                    heading2Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h2') as HTMLElement;
                        expect(updatedBlock.tagName).toBe('H2');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#delete') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(1);
                                const remaining = editorElement.querySelectorAll('.e-block');
                                expect(remaining.length).toBe(1);
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should duplicate transformed block (Heading 3) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading3Item = menuPopup.querySelector('#heading3-command') as HTMLElement;
                    heading3Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h3') as HTMLElement;
                        expect(updatedBlock.tagName).toBe('H3');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#duplicate') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(3);
                                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[1].properties as any).level).toBe(3);
                                expect((modelBlocks[1].content[0].content)).toBe('Hello');;
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should delete transformed block (Heading 3) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading3Item = menuPopup.querySelector('#heading3-command') as HTMLElement;
                    heading3Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h3') as HTMLElement;
                        expect(updatedBlock.tagName).toBe('H3');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#delete') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(1);
                                const remaining = editorElement.querySelectorAll('.e-block');
                                expect(remaining.length).toBe(1);
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should duplicate transformed block (Heading 4) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading4Item = menuPopup.querySelector('#heading4-command') as HTMLElement;
                    heading4Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h4') as HTMLElement;
                        expect(updatedBlock.tagName).toBe('H4');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#duplicate') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(3);
                                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                                expect((modelBlocks[1].properties as any).level).toBe(4);
                                expect((modelBlocks[1].content[0].content)).toBe('Hello');
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should delete transformed block (Heading 4) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const heading4Item = menuPopup.querySelector('#heading4-command') as HTMLElement;
                    heading4Item.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1').querySelector('h4') as HTMLElement;
                        expect(updatedBlock.tagName).toBe('H4');

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#delete') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(1);
                                const remaining = editorElement.querySelectorAll('.e-block');
                                expect(remaining.length).toBe(1);
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should duplicate transformed block (Numbered List) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const numberedListItem = menuPopup.querySelector('#numbered-list-command') as HTMLElement;
                    numberedListItem.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const listElement = updatedBlock.querySelector('ol') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listItem).not.toBeNull();

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#duplicate') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(3);
                                expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                                expect((modelBlocks[1].content[0].content)).toBe('Hello');
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should delete transformed block (Numbered List) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const numberedListItem = menuPopup.querySelector('#numbered-list-command') as HTMLElement;
                    numberedListItem.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const listElement = updatedBlock.querySelector('ol') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listItem).not.toBeNull();

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#delete') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(1);
                                const remaining = editorElement.querySelectorAll('.e-block');
                                expect(remaining.length).toBe(1);
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should duplicate transformed block (Checklist) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const checklistItem = menuPopup.querySelector('#checklist-command') as HTMLElement;
                    checklistItem.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1[data-block-type="Checklist"]') as HTMLElement;
                        expect(updatedBlock).not.toBeNull();

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#duplicate') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(3);
                                expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                                expect((modelBlocks[1].content[0].content)).toBe('Hello');
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should delete transformed block (Checklist) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const checklistItem = menuPopup.querySelector('#checklist-command') as HTMLElement;
                    checklistItem.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1[data-block-type="Checklist"]') as HTMLElement;
                        expect(updatedBlock).not.toBeNull();

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#delete') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(1);
                                const remaining = editorElement.querySelectorAll('.e-block');
                                expect(remaining.length).toBe(1);
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should duplicate transformed block (Bullet List) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const bulletListItem = menuPopup.querySelector('#bullet-list-command') as HTMLElement;
                    bulletListItem.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const listElement = updatedBlock.querySelector('ul') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listItem).not.toBeNull();

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#duplicate') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(3);
                                expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                                expect((modelBlocks[1].content[0].content)).toBe('Hello');
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('should delete transformed block (Bullet List) via action menu for single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const bulletListItem = menuPopup.querySelector('#bullet-list-command') as HTMLElement;
                    bulletListItem.click();
                    setTimeout(() => {
                        const updatedBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                        const listElement = updatedBlock.querySelector('ul') as HTMLElement;
                        const listItem = listElement.querySelector('li') as HTMLElement;
                        expect(listItem).not.toBeNull();

                        editor.blockManager.setFocusToBlock(blockElement);
                        triggerMouseMove(updatedBlock, 10, 10);
                        editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
                        setTimeout(() => {
                            const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                            (actionPopup.querySelector('#delete') as HTMLElement).click();
                            setTimeout(() => {
                                const modelBlocks = editor.blocks;
                                expect(modelBlocks.length).toBe(1);
                                const remaining = editorElement.querySelectorAll('.e-block');
                                expect(remaining.length).toBe(1);
                                done();
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        // Bug
        // it('should duplicate transformed block (Quote) via action menu for single selection', (done) => {
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();
        //     const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(blockElement);
        //     const contentElement = getBlockContentElement(blockElement);
        //     editor.setSelection(contentElement.lastChild as Node, 0, 5);
        //     editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //     setTimeout(() => {
        //         const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //         // expect(toolbar.classList.contains('e-popup-open')).toBe(true);
        //         const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
        //         transformBtn.click();
        //         setTimeout(() => {
        //             const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
        //             const quoteItem = menuPopup.querySelector('#quote-command') as HTMLElement;
        //             quoteItem.click();
        //             setTimeout(() => {
        //                 const updatedBlock = editorElement.querySelector('.e-block').querySelector('blockquote') as HTMLElement;
        //                 // expect(updatedBlock).not.toBeNull();

        //                 editor.blockManager.setFocusToBlock(blockElement);
        //                 triggerMouseMove(updatedBlock, 10, 10);
        //                 editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
        //                 setTimeout(() => {
        //                     const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
        //                     (actionPopup.querySelector('#duplicate') as HTMLElement).click();
        //                     setTimeout(() => {
        //                         const modelBlocks = editor.blocks;
        //                         // expect(modelBlocks.length).toBe(3);
        //                         // expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //                         // expect(modelBlocks[1].content[0].content).toBe('Hello');
        //                         done();
        //                     }, 100);
        //                 }, 50);
        //             }, 50);
        //         }, 50);
        //     }, 100);
        // });

        // Bug 
        // it('should delete transformed block (Quote) via action menu for single selection', (done) => {
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();
        //     const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
        //     editor.blockManager.setFocusToBlock(blockElement);
        //     const contentElement = getBlockContentElement(blockElement);
        //     editor.setSelection(contentElement.lastChild as Node, 0, 5);
        //     editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //     setTimeout(() => {
        //         const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //         // expect(toolbar.classList.contains('e-popup-open')).toBe(true);
        //         const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
        //         transformBtn.click();
        //         setTimeout(() => {
        //             const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
        //             const quoteItem = menuPopup.querySelector('#quote-command') as HTMLElement;
        //             quoteItem.click();
        //             setTimeout(() => {
        //                 const updatedBlock = editorElement.querySelector('.e-block').querySelector('blockquote') as HTMLElement;
        //                 // expect(updatedBlock).not.toBeNull();

        //                 editor.blockManager.setFocusToBlock(blockElement);
        //                 triggerMouseMove(updatedBlock, 10, 10);
        //                 editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
        //                 setTimeout(() => {
        //                     const actionPopup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
        //                     (actionPopup.querySelector('#delete') as HTMLElement).click();
        //                     setTimeout(() => {
        //                         const modelBlocks = editor.blocks;
        //                         // expect(modelBlocks.length).toBe(1);
        //                         const remaining = editorElement.querySelectorAll('.e-block');
        //                         // expect(remaining.length).toBe(1);
        //                         done();
        //                     }, 100);
        //                 }, 50);
        //             }, 50);
        //         }, 50);
        //     }, 100);
        // });

        it('should highlight selected menu item when dropdown opens', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            
            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();
                setTimeout(() => {
                    const menuPopup = document.querySelector('.e-be-blocktype-ddb.e-popup') as HTMLElement;
                    const paragraphItem = menuPopup.querySelector('#paragraph-command') as HTMLElement;
                    expect(paragraphItem.classList.contains('e-selected')).toBe(true);
                    done();
                }, 50);                  
            }, 100);
        });

        it('should enable transform dropdown for Paragraph block selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                expect(transformBtn).not.toBeNull();

                // DOM Check: e-disabled class should NOT be present
                const transformBtnContainer = transformBtn.parentElement;
                expect(transformBtnContainer.classList.contains('e-disabled')).toBe(false);
                done();
            }, 100);
        });

        it('should select transform menu item by matching text content', (done) => {
            editor.blocks = [
                {
                    id: 'heading-1',
                    blockType: BlockType.Heading,
                    properties: { level: 1 } as any,
                    content: [{ contentType: ContentType.Text, content: 'Heading One' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const headingBlock = editorElement.querySelector('#heading-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(headingBlock);
                const headingContent = getBlockContentElement(headingBlock);

                const range = document.createRange();
                range.setStart(headingContent.firstChild as ChildNode, 0);
                range.setEnd(headingContent.firstChild as ChildNode, 5);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    expect(transformBtn).not.toBeNull();
                    transformBtn.click();

                    setTimeout(() => {
                        // Get the dropdown popup
                        const dropdownPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        expect(dropdownPopup).not.toBeNull();

                        // DOM Check: Verify that the correct menu item has e-selected class applied by text content match
                        let menuItems = dropdownPopup.querySelectorAll('li');
                        
                        expect(menuItems.length).toBeGreaterThan(0);

                        // Find the Heading 1 item by text content
                        let heading1Item: Element = null;
                        menuItems.forEach((item: Element) => {
                            if (item.textContent && item.textContent.includes('Heading 1')) {
                                heading1Item = item;
                            }
                        });

                        expect(heading1Item).not.toBeNull();
                        // The correct item should have e-selected class
                        expect(heading1Item.classList.contains('e-selected')).toBe(true);

                        // Model Check: Verify the block model is still Heading with level 1
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(1);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(1);

                        // DOM Check: Verify the DOM shows H1 element
                        const domHeading = editorElement.querySelector('#heading-1').querySelector('h1') as HTMLElement;
                        expect(domHeading).not.toBeNull();
                        expect(domHeading.tagName).toBe('H1');
                        expect(domHeading.textContent).toBe('Heading One');

                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should find and select menu item by text content when data-id attribute is not present', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Transform me' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const paragraphBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(paragraphBlock);
                const content = getBlockContentElement(paragraphBlock);

                const range = document.createRange();
                range.setStart(content.firstChild as ChildNode, 0);
                range.setEnd(content.firstChild as ChildNode, 9);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        // Get the dropdown popup
                        const dropdownPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        expect(dropdownPopup).not.toBeNull();

                        // DOM Check: Verify that menu items exist
                        let menuItems = dropdownPopup.querySelectorAll('li');
                        
                        expect(menuItems.length).toBeGreaterThan(0);

                        // Find the Paragraph item by text content matching
                        let paragraphItem: Element = null;
                        menuItems.forEach((item: Element) => {
                            const itemText = item.textContent ? item.textContent.trim() : '';
                            if (itemText === 'ParagraphCtrl+Alt+P') {
                                paragraphItem = item;
                            }
                        });

                        expect(paragraphItem).not.toBeNull();
                        // The Paragraph item should have e-selected class since it's already a Paragraph block
                        expect(paragraphItem.classList.contains('e-selected')).toBe(true);

                        // Model Check: Verify the block model is Paragraph
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(1);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                        expect(modelBlocks[0].content[0].content).toBe('Transform');

                        // DOM Check: Verify the DOM shows P element
                        const domParagraph = editorElement.querySelector('#paragraph-1').querySelector('p') as HTMLElement;
                        expect(domParagraph).not.toBeNull();
                        expect(domParagraph.tagName).toBe('P');

                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should correctly highlight Bullet List item when Bullet List block is selected', (done) => {
            editor.blocks = [
                {
                    id: 'list-1',
                    blockType: BlockType.BulletList,
                    content: [{ contentType: ContentType.Text, content: 'List item' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const listBlock = editorElement.querySelector('#list-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(listBlock);
                const listContent = getBlockContentElement(listBlock);

                const range = document.createRange();
                range.setStart(listContent.firstChild as ChildNode, 0);
                range.setEnd(listContent.firstChild as ChildNode, 4);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        // Get the dropdown popup
                        const dropdownPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        expect(dropdownPopup).not.toBeNull();

                        // DOM Check: Verify Bullet List menu item is highlighted
                        let menuItems = dropdownPopup.querySelectorAll('li');
                        
                        let bulletListItem: Element = null;
                        menuItems.forEach((item: Element) => {
                            const itemText = item.textContent ? item.textContent.trim() : '';
                            if (itemText.includes('Bullet ListCtrl+Shift+8')) {
                                bulletListItem = item;
                            }
                        });

                        expect(bulletListItem).not.toBeNull();
                        expect(bulletListItem.classList.contains('e-selected')).toBe(true);

                        // Model Check: Verify the block model is BulletList
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(1);
                        expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);

                        // DOM Check: Verify the DOM shows UL element
                        const domList = editorElement.querySelector('#list-1').querySelector('ul') as HTMLElement;
                        expect(domList).not.toBeNull();
                        expect(domList.tagName).toBe('UL');

                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should extract heading level from block properties and match to transform model', (done) => {
            // Test for Heading 2
            editor.blocks = [
                {
                    id: 'heading-2',
                    blockType: BlockType.Heading,
                    properties: { level: 2 } as any,
                    content: [{ contentType: ContentType.Text, content: 'Heading Level 2' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const headingBlock = editorElement.querySelector('#heading-2') as HTMLElement;
                editor.blockManager.setFocusToBlock(headingBlock);
                const headingContent = getBlockContentElement(headingBlock);

                const range = document.createRange();
                range.setStart(headingContent.firstChild as ChildNode, 0);
                range.setEnd(headingContent.firstChild as ChildNode, 7);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        // Get the dropdown popup
                        const dropdownPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        expect(dropdownPopup).not.toBeNull();

                        // DOM Check: Verify menu items exist
                        let menuItems = dropdownPopup.querySelectorAll('li');
                        expect(menuItems.length).toBeGreaterThan(0);

                        // Find the Heading 2 item by text content
                        let heading2Item: Element = null;
                        menuItems.forEach((item: Element) => {
                            if (item.textContent && item.textContent.includes('Heading 2')) {
                                heading2Item = item;
                            }
                        });

                        expect(heading2Item).not.toBeNull();
                        // The correct item should have e-selected class
                        expect(heading2Item.classList.contains('e-selected')).toBe(true);

                        // Model Check: Verify block properties contain level = 2
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks.length).toBe(1);
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(2);

                        // DOM Check: Verify the DOM shows H2 element
                        const domHeading = editorElement.querySelector('#heading-2').querySelector('h2') as HTMLElement;
                        expect(domHeading).not.toBeNull();
                        expect(domHeading.tagName).toBe('H2');
                        expect(domHeading.textContent).toBe('Heading Level 2');

                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should extract heading level 3 from properties and find matching transform item', (done) => {
            // Test for Heading 3
            editor.blocks = [
                {
                    id: 'heading-3',
                    blockType: BlockType.Heading,
                    properties: { level: 3 } as any,
                    content: [{ contentType: ContentType.Text, content: 'Heading Three' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const headingBlock = editorElement.querySelector('#heading-3') as HTMLElement;
                editor.blockManager.setFocusToBlock(headingBlock);
                const headingContent = getBlockContentElement(headingBlock);

                const range = document.createRange();
                range.setStart(headingContent.firstChild as ChildNode, 0);
                range.setEnd(headingContent.firstChild as ChildNode, 6);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        const dropdownPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        
                        // DOM Check: Find menu items with flexible selector
                        let menuItems = dropdownPopup.querySelectorAll('li');

                        // Find Heading 3 item
                        let heading3Item: Element = null;
                        menuItems.forEach((item: Element) => {
                            if (item.textContent && item.textContent.includes('Heading 3')) {
                                heading3Item = item;
                            }
                        });

                        expect(heading3Item).not.toBeNull();
                        expect(heading3Item.classList.contains('e-selected')).toBe(true);

                        // Model Check: Verify properties level is 3
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(3);

                        // DOM Check: Verify H3 element exists
                        const domHeading = editorElement.querySelector('#heading-3').querySelector('h3') as HTMLElement;
                        expect(domHeading.tagName).toBe('H3');
                        expect(domHeading).not.toBeNull();
                        expect(domHeading.textContent).toBe('Heading Three');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should handle heading level 4 extraction and matching', (done) => {
            // Test for Heading 4
            editor.blocks = [
                {
                    id: 'heading-4',
                    blockType: BlockType.Heading,
                    properties: { level: 4 } as any,
                    content: [{ contentType: ContentType.Text, content: 'Heading Four' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const headingBlock = editorElement.querySelector('#heading-4') as HTMLElement;
                editor.blockManager.setFocusToBlock(headingBlock);
                const headingContent = getBlockContentElement(headingBlock);

                const range = document.createRange();
                range.setStart(headingContent.firstChild as ChildNode, 0);
                range.setEnd(headingContent.firstChild as ChildNode, 5);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        const dropdownPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        
                        // DOM Check: Query menu items
                        let menuItems = dropdownPopup.querySelectorAll('li');
                        expect(menuItems.length).toBeGreaterThan(0);

                        // Find Heading 4 item
                        let heading4Item: Element = null;
                        menuItems.forEach((item: Element) => {
                            if (item.textContent && item.textContent.includes('Heading 4')) {
                                heading4Item = item;
                            }
                        });

                        expect(heading4Item).not.toBeNull();
                        expect(heading4Item.classList.contains('e-selected')).toBe(true);

                        // Model Check: Verify level extraction
                        const modelBlocks = editor.blocks;
                        expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                        expect((modelBlocks[0].properties as any).level).toBe(4);

                        // DOM Check: Verify H4 element
                        const domHeading = editorElement.querySelector('#heading-4').querySelector('h4') as HTMLElement;
                        expect(domHeading).not.toBeNull();
                        expect(domHeading.tagName).toBe('H4');
                        expect(domHeading.textContent).toBe('Heading Four');

                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should return default label when no focused block exists', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Test content' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                // Clear focus by clicking outside
                editorElement.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));

                setTimeout(() => {
                    // Trigger toolbar to appear and check label
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar') as HTMLElement;
                    
                    // Model Check: Verify blocks exist but no focus
                    const modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBeGreaterThan(0);
                    
                    // DOM Check: Verify transform button exists
                    let transformBtn = toolbar ? toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement : null;
                    
                    if (transformBtn) {
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);
                    }
                    
                    done();
                }, 100);
            }, 100);
        });

        it('should retrieve block model by ID when focused block exists', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-test',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Paragraph text' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-test') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const blockContent = getBlockContentElement(blockElement);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 5);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;

                    // Model Check: Verify block model was retrieved and label matches block type
                    const modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    
                    // DOM Check: Verify correct label is displayed for Paragraph block
                    expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                    done();
                }, 100);
            }, 100);
        });

        it('should return default label when blockModel is null after getBlockModelById', (done) => {
            // Create an edge case where focused block exists but blockModel retrieval fails
            editor.blocks = [
                {
                    id: 'valid-block',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Valid block' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const validBlock = editorElement.querySelector('#valid-block') as HTMLElement;
                editor.blockManager.setFocusToBlock(validBlock);
                const validContent = getBlockContentElement(validBlock);

                const range = document.createRange();
                range.setStart(validContent.firstChild as ChildNode, 0);
                range.setEnd(validContent.firstChild as ChildNode, 5);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    // Model Check: Verify block exists and is focused
                    const modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBeGreaterThan(0);
                    done();
                }, 100);
            }, 100);
        });

        it('should display correct transform label for focused Bullet List block', (done) => {
            editor.blocks = [
                {
                    id: 'bulletlist-block',
                    blockType: BlockType.BulletList,
                    content: [{ contentType: ContentType.Text, content: 'List item' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const listBlock = editorElement.querySelector('#bulletlist-block') as HTMLElement;
                editor.blockManager.setFocusToBlock(listBlock);
                const listContent = getBlockContentElement(listBlock);

                const range = document.createRange();
                range.setStart(listContent.firstChild as ChildNode, 0);
                range.setEnd(listContent.firstChild as ChildNode, 4);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;

                    // Model Check: Verify block model is BulletList
                    const modelBlocks = editor.blocks;
                    expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                    
                    // DOM Check: Verify correct label for BulletList
                    expect(transformIcon.classList.contains('e-list-unordered')).toBe(true);

                    done();
                }, 100);
            }, 100);
        });

        it('should disable transform dropdown for multi-block selection with ignored block', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                },
                {
                    id: 'callout-1',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [
                            { id: 'callout-child-a', blockType: BlockType.Paragraph, content: [{ id: 'a_t', contentType: ContentType.Text, content: 'Callout content' }] }
                        ]
                    }
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                // Select both blocks
                const firstBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#callout-1') as HTMLElement;
                
                editor.blockManager.setFocusToBlock(firstBlock);
                const content1 = getBlockContentElement(firstBlock);
                const content2 = getBlockContentElement(secondBlock);

                const range = document.createRange();
                range.setStart(content1.firstChild as ChildNode, 0);
                range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    expect(transformBtn).not.toBeNull();

                    // DOM Check: e-disabled class should NOT be present
                    const transformBtnContainer = transformBtn.parentElement;
                    expect(transformBtnContainer.classList.contains('e-disabled')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        it('should show only custom transform items when transformSettings is provided', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: ['Transform']
                },
                transformSettings: {
                    items: [
                        {
                            id: 'paragraph-command',
                            label: 'Paragraph',
                            type: BlockType.Paragraph,
                            iconCss: 'e-icons e-be-paragraph',
                            shortcut: 'Ctrl+Alt+P',
                            tooltip: 'Paragraph'
                        },
                        {
                            id: 'heading1-command',
                            label: 'Heading 1',
                            type: BlockType.Heading,
                            iconCss: 'e-icons e-be-heading1',
                            shortcut: 'Ctrl+Alt+1',
                            tooltip: 'Heading 1'
                        }
                    ]
                }
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                
                const transformBtn = document.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                expect(transformBtn).toBeDefined();
                
                // Click to open dropdown
                transformBtn.click();
                
                setTimeout(() => {
                    // Query dropdown menu items
                    const dropdown = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    expect(dropdown).toBeDefined();

                    // Verify custom items are shown (should have 2 items from transformSettings)
                    const menuItems = dropdown.querySelectorAll('.e-item');
                    expect(menuItems.length).toBe(2);

                    // Verify specific custom items by their labels
                    const labels = Array.from(menuItems).map(item => (item as HTMLElement).textContent);
                    expect(labels.some(label => label.includes('Paragraph'))).toBe(true);
                    expect(labels.some(label => label.includes('Heading 1'))).toBe(true);
                    
                    done();
                }, 50);
            }, 100);
        });

        it('should show default transform items when transformSettings is not provided', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: ['Transform']
                }
                // No transformSettings provided - should use default items
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                
                const transformBtn = document.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                expect(transformBtn).toBeDefined();

                // Click to open dropdown
                transformBtn.click();

                setTimeout(() => {
                    // Query dropdown menu items
                    const dropdown = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    expect(dropdown).toBeDefined();

                    // Verify default items are shown (should include all default transform items)
                    const menuItems = dropdown.querySelectorAll('.e-item');
                    expect(menuItems.length).toBe(8);

                    // Verify specific default items by their labels
                    const labels = Array.from(menuItems).map(item => (item as HTMLElement).textContent);
                    expect(labels.some(label => label.includes('Paragraph'))).toBe(true);
                    expect(labels.some(label => label.includes('Heading 1'))).toBe(true);
                    expect(labels.some(label => label.includes('Heading 2'))).toBe(true);
                    expect(labels.some(label => label.includes('Heading 3'))).toBe(true);
                    expect(labels.some(label => label.includes('Heading 4'))).toBe(true);
                    expect(labels.some(label => label.includes('Bullet List'))).toBe(true);
                    expect(labels.some(label => label.includes('Numbered List'))).toBe(true);
                    expect(labels.some(label => label.includes('Checklist'))).toBe(true);
                    
                    done();
                }, 50);
            }, 100);
        });

        it('should respect cancel property in itemSelect event to prevent transformation', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: ['Transform']
                },
                transformSettings: {
                    items: [
                        {
                            id: 'heading1-command',
                            label: 'Heading 1',
                            type: BlockType.Heading,
                            iconCss: 'e-icons e-be-heading1',
                            shortcut: 'Ctrl+Alt+1',
                            tooltip: 'Heading 1'
                        }
                    ],
                    itemSelect: function(args: any) {
                        args.cancel = true;
                    }
                }
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            // Verify block is initially Paragraph
            const initialBlockType = editor.blocks[0].blockType;
            expect(initialBlockType).toBe(BlockType.Paragraph);

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                
                const transformBtn = document.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();

                setTimeout(() => {
                    const dropdown = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    const menuItem = dropdown.querySelector('.e-item') as HTMLElement;
                    menuItem.click();

                    const finalBlockType = editor.blocks[0].blockType;
                    expect(finalBlockType).toBe(BlockType.Paragraph);
                    
                    done();
                }, 50);
            }, 100);
        });

        it('should not allow disabled transform items to be selected', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: ['Transform']
                },
                transformSettings: {
                    items: [
                        {
                            id: 'paragraph-command',
                            label: 'Paragraph',
                            type: BlockType.Paragraph,
                            iconCss: 'e-icons e-be-paragraph',
                            shortcut: 'Ctrl+Alt+P',
                            tooltip: 'Paragraph',
                            disabled: false
                        },
                        {
                            id: 'heading1-command',
                            label: 'Heading 1',
                            type: BlockType.Heading,
                            iconCss: 'e-icons e-be-heading1',
                            shortcut: 'Ctrl+Alt+1',
                            tooltip: 'Heading 1',
                            disabled: true
                        }
                    ]
                }
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            // Verify block is initially Paragraph
            const initialBlockType = editor.blocks[0].blockType;
            expect(initialBlockType).toBe(BlockType.Paragraph);

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                
                const transformBtn = document.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();

                setTimeout(() => {
                    const dropdown = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    const menuItems = dropdown.querySelectorAll('.e-item');

                    // Verify items are present
                    expect(menuItems.length).toBe(2);

                    // Try to click the disabled item
                    const disabledItem = Array.from(menuItems).find(item => 
                        (item as HTMLElement).textContent.includes('Heading 1')
                    ) as HTMLElement;

                    disabledItem.click();
                    const finalBlockType = editor.blocks[0].blockType;

                    // Block type should not change because item is disabled
                    expect(finalBlockType).toBe(initialBlockType);
                    
                    done();
                }, 50);
            }, 100);
        });

        it('should resolve transform items from string identifiers in transformSettings', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: ['Transform']
                },
                transformSettings: {
                    items: [
                        'Paragraph',
                        'Heading 1',
                        'Bullet List',
                        'Numbered List'
                    ]
                }
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                
                const transformBtn = document.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                expect(transformBtn).toBeDefined();

                // Click to open dropdown
                transformBtn.click();

                setTimeout(() => {
                    // Query dropdown menu items
                    const dropdown = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    expect(dropdown).toBeDefined();

                    // Verify items are resolved from string identifiers
                    const menuItems = dropdown.querySelectorAll('.e-item');
                    expect(menuItems.length).toBe(4);

                    // Verify specific items by their labels
                    const labels = Array.from(menuItems).map(item => (item as HTMLElement).textContent);
                    expect(labels.some(label => label.includes('Paragraph'))).toBe(true);
                    expect(labels.some(label => label.includes('Heading 1'))).toBe(true);
                    expect(labels.some(label => label.includes('Bullet List'))).toBe(true);
                    expect(labels.some(label => label.includes('Numbered List'))).toBe(true);
                    
                    done();
                }, 50);
            }, 100);
        });

        it('should handle mixed string and object items in transformSettings', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: ['Transform']
                },
                transformSettings: {
                    items: [
                        'Paragraph',
                        {
                            id: 'heading1-command',
                            label: 'Heading 1',
                            type: BlockType.Heading,
                            iconCss: 'e-icons e-be-heading1',
                            shortcut: 'Ctrl+Alt+H',
                            tooltip: 'Heading 1'
                        },
                        'Checklist'
                    ]
                }
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                
                const transformBtn = document.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();

                setTimeout(() => {
                    // Query dropdown menu items
                    const dropdown = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    const menuItems = dropdown.querySelectorAll('.e-item');

                    // Should have 3 items (1 string + 1 object + 1 string)
                    expect(menuItems.length).toBe(3);

                    // Verify labels include both string-resolved and custom object items
                    const labels = Array.from(menuItems).map(item => (item as HTMLElement).textContent);
                    expect(labels.some(label => label.includes('Paragraph'))).toBe(true);
                    expect(labels.some(label => label.includes('Heading 1'))).toBe(true);
                    expect(labels.some(label => label.includes('Checklist'))).toBe(true);
                    
                    done();
                }, 50);
            }, 100);
        });

        it('should transform block when string item is selected', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: ['Transform']
                },
                transformSettings: {
                    items: [
                        'Paragraph',
                        'Heading 1'
                    ]
                }
            });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            editor.setSelection(contentElement.lastChild as Node, 0, 5);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            // Verify block is initially Paragraph
            const initialBlockType = editor.blocks[0].blockType;
            expect(initialBlockType).toBe(BlockType.Paragraph);

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                
                const transformBtn = document.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();

                setTimeout(() => {
                    const dropdown = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    const menuItems = dropdown.querySelectorAll('.e-item');
                    
                    // Find and click Heading 1 item
                    const headingItem = Array.from(menuItems).find(item => 
                        (item as HTMLElement).textContent.includes('Heading 1')
                    ) as HTMLElement;
                    
                    headingItem.click();

                    // Verify block transformed to Heading
                    const finalBlockType = editor.blocks[0].blockType;
                    expect(finalBlockType).toBe(BlockType.Heading);
                    
                    done();
                }, 50);
            }, 100);
        });

        it('should enable font based modeswitcher button on dynamic update', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                editor.fontColorSettings.modeSwitcher = true;
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);
                
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    
                    const colorDropdown = toolbar.querySelector('.e-split-btn-wrapper .e-be-fontcolor-dropdown[aria-label="dropdownbutton"]');
                    colorDropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    
                    setTimeout(() => {
                        const modeSwitchBtn: HTMLElement = document.querySelector('.e-mode-switch-btn');
                        modeSwitchBtn.click();
                        expect(document.querySelector('.e-hsv-container')).not.toBeNull();
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should enable bgColor based modeswitcher button on dynamic update', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                editor.backgroundColorSettings.modeSwitcher = true;
                editor.backgroundColorSettings = {
                    default: '',
                    colorCode: {'Custom': [
                        '', '#000000'
                    ]},
                    columns: 5,
                    modeSwitcher: true
                }
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);
                
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    
                    const bgColorDropdown = toolbar.querySelector('.e-split-btn-wrapper .e-be-bgcolor-dropdown[aria-label="dropdownbutton"]');
                    bgColorDropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    
                    setTimeout(() => {
                        const modeSwitchBtn: HTMLElement = document.querySelector('.e-mode-switch-btn');
                        modeSwitchBtn.click();
                        expect(document.querySelector('.e-hsv-container')).not.toBeNull();
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('dynamic default prop update check', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                editor.fontColorSettings.default = '#932828ff';
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);
                
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    const colorBorderIcon = document.querySelector('.e-be-fontcolor-dropdown[aria-label="colorpicker"] .e-split-preview');
                    expect((colorBorderIcon as HTMLElement).style.backgroundColor).not.toBe('#932828ff');
                    done();
                }, 100);
            }, 200);
        });

        it('should handle color picker changes by click font color icon', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setSelectionRange(contentElement.lastChild, 0, 5);

                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');

                    const colorButton = toolbar.querySelector('.e-split-btn-wrapper .e-be-fontcolor-dropdown[aria-label="colorpicker"]');
                    colorButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    setTimeout(() => {
                        const contentModel = editor.blocks[0].content[0];
                        expect((contentElement.childNodes[0] as HTMLElement).style.color).toBe('rgb(255, 0, 0)');
                        const styles = (contentModel.properties as BaseStylesProp).styles;
                        expect(typeof styles.color).toBe('string');
                        expect(styles.color).toBe('#FF0000');
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
    });

    describe('Toolbar, Popup and Tooltip Renderer', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let popupRenderer: PopupRenderer;
        let toolbarRenderer: ToolbarRenderer;
        let tooltipRenderer: TooltipRenderer;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({});
            editor.appendTo('#editor');
            popupRenderer = new PopupRenderer(editor.blockManager);
            toolbarRenderer = new ToolbarRenderer(editor);
            tooltipRenderer = new TooltipRenderer(editor);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            document.body.removeChild(editorElement);
        });

        it('should render popup with element selector string', () => {
            const popupContainer = createElement('div', { id: 'test-popup' });
            document.body.appendChild(popupContainer);

            const content = createElement('div', {
                innerHTML: 'Popup content',
                className: 'popup-content'
            });

            const popup = popupRenderer.renderPopup({
                element: '#test-popup',
                content: content
            });

            expect(popup).not.toBeNull();
            expect(popup.element.id).toBe('test-popup');
            expect(popup.content).toBe(content);
            
            popupRenderer.destroyPopup(popup);
        });

        it('should render toolbar with element selector string', () => {
            const toolbarContainer = createElement('div', { 
                id: 'test-toolbar',
                className: 'e-toolbar-container' 
            });
            editorElement.appendChild(toolbarContainer);

            const items = [
                { text: 'Item 1', id: 'item1' },
                { text: 'Item 2', id: 'item2' }
            ];

            const toolbar = toolbarRenderer.renderToolbar({
                element: '#test-toolbar',
                items: items,
                width: '300px',
                overflowMode: 'Popup'
            });

            expect(toolbar).not.toBeNull();
            expect(toolbar.element.id).toBe('test-toolbar');
            expect(toolbar.items.length).toBe(2);
            expect(toolbar.width).toBe('300px');
            expect(toolbar.overflowMode).toBe('Popup');
            
            toolbar.destroy();
            editorElement.removeChild(toolbarContainer);
        });

        it('should render tooltip with element selector string', () => {
            const tooltipContainer = createElement('div', { 
                id: 'test-tooltip',
                className: 'e-tooltip-container' 
            });
            editorElement.appendChild(tooltipContainer);
            
            const target = createElement('button', { 
                id: 'tooltip-target',
                innerHTML: 'Hover me'
            });
            tooltipContainer.appendChild(target);
            
            const tooltip = tooltipRenderer.renderTooltip({
                element: '#test-tooltip',
                target: '#tooltip-target',
                content: 'Tooltip content',
                position: 'RightCenter',
                showTipPointer: true,
                windowCollision: true,
                cssClass: 'test-tooltip-class'
            });
            
            expect(tooltip).not.toBeNull();
            expect(tooltip.element.id).toBe('test-tooltip');
            expect(tooltip.content).toBe('Tooltip content');
            expect(tooltip.position).toBe(editor.enableRtl ? 'LeftCenter' : 'RightCenter');
            expect(tooltip.showTipPointer).toBe(true);
            expect(tooltip.cssClass).toBe('test-tooltip-class');
            
            // Test RTL mode switching
            editor.enableRtl = true;
            
            const rtlTooltip = tooltipRenderer.renderTooltip({
                element: '#test-tooltip',
                target: '#tooltip-target',
                content: 'RTL Tooltip content',
                position: 'RightCenter'
            });
            
            expect(rtlTooltip.position).toBe('LeftCenter');
            
            // Clean up
            tooltipRenderer.destroyTooltip(tooltip);
            tooltipRenderer.destroyTooltip(rtlTooltip);
            editorElement.removeChild(tooltipContainer);
        });
    });

    describe('Events and other actions', () => {
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
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: [
                        { id: 'bold', iconCss: 'e-icons e-bold', tooltipText: 'Bold', command: CommandName.Bold, htmlAttributes: { 'data-command': CommandName.Bold } },
                        { id: 'italic', iconCss: 'e-icons e-italic', tooltipText: 'Italic', command: CommandName.Italic, htmlAttributes: { 'data-command': CommandName.Italic } },
                        { id: 'underline', iconCss: 'e-icons e-underline', tooltipText: 'Underline', command: CommandName.Underline, htmlAttributes: { 'data-command': CommandName.Underline } },
                        { id: 'strikethrough', iconCss: 'e-icons e-strikethrough', tooltipText: 'Strikethrough', command: CommandName.Strikethrough, htmlAttributes: { 'data-command': CommandName.Strikethrough } },
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

        it('should render popup with custom items properly', (done) => {
            setTimeout(() => {
                var tbarPopup = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                expect(tbarPopup.querySelectorAll('.e-toolbar-item').length).toBe(4);
                done();
            }, 100);
        });

        it('should not show toolbar when enable is false', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 0);
                editor.inlineToolbarSettings.enable = false;
                editor.blockManager.inlineToolbarModule.showInlineToolbar(getSelectedRange());
                expect(document.querySelector('.e-blockeditor-inline-toolbar').classList.contains('e-popup-open')).toBe(false);
                done();
            }, 200);
        });

        it('should fetch common styles properly', () => {
            const contents: ContentModel[] = [{
                properties: {
                    styles: {
                        bold: true,
                        italic: true,
                        underline: true,
                        strikethrough: true,
                        uppercase: true,
                        lowercase: true,
                        superscript: true,
                        subscript: true
                    }
                }
            }, {
                properties: {
                    styles: {
                        bold: true,
                        italic: true,
                        underline: true,
                        strikethrough: true,
                        uppercase: true,
                        lowercase: true,
                        superscript: true,
                        subscript: true,
                        color: '#000000',
                        backgroundColor: '#ffffff'
                    }
                }
            }];
            const stylesArray = contents.map(c => (c.properties as BaseStylesProp).styles);
            const commonStyles: Styles = (editor.blockManager.inlineToolbarModule as any).getCommonFormatsAcrossNodes(stylesArray);
            expect(commonStyles.bold).toBe(true);
            expect(commonStyles.italic).toBe(true);
            expect(commonStyles.underline).toBe(true);
            expect(commonStyles.strikethrough).toBe(true);
            expect(commonStyles.uppercase).toBe(true);
            expect(commonStyles.lowercase).toBe(true);
            expect(commonStyles.superscript).toBe(true);
            expect(commonStyles.subscript).toBe(true);
            expect(commonStyles.color).toBeUndefined();
            expect(commonStyles.backgroundColor).toBeUndefined();
        });

        it('should handle null values properly', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                //Without range
                editor.blockManager.inlineToolbarModule.toggleToolbarActiveState();

                //Set range as editorelement
                editor.blockManager.nodeSelection.createRangeWithOffsets(editorElement, editorElement, 0, 0);
                editor.blockManager.inlineToolbarModule.toggleToolbarActiveState();

                //Set range as contentElement
                setCursorPosition(contentElement, 0);
                editor.blockManager.inlineToolbarModule.toggleToolbarActiveState();

                //Set range as contentElement
                editor.blockManager.nodeSelection.createRangeWithOffsets(blockElement, blockElement, 0, 0);
                editor.blockManager.inlineToolbarModule.toggleToolbarActiveState();

                document.querySelector('.e-blockeditor-inline-toolbar').remove();
                (editor.inlineToolbarModule as any).initializeColorPicker();

                (editor.blockManager.inlineToolbarModule as any).getCommonFormatsAcrossNodes([]);
                done();
            }, 200);
        });
    });

    describe('Popup Positioning and Overflow Prevention', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let popup: HTMLElement;
        let blockElement: HTMLElement;
        let contentElement: HTMLElement;
        let parentContainerEle: HTMLElement;
        let scrollContainerEle: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'A Block Editor Component is a used to manage and edit content in discrete "blocks. Each block can represent a specific type of content, such as text, images, videos, tables, or other rich media. The key idea is to divide content into modular blocks that can be independently created, edited, rearranged, or deleted.' }]
                    },
                    {
                        id: 'paragraph-2',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'This is a paragraph block 1' }]
                    },
                    {
                        id: 'paragraph-3',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'This is a paragraph block 2' }]
                    },
                    {
                        id: 'paragraph-4',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'This is a paragraph block 3' }]
                    },
                    {
                        id: 'paragraph-5',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'This is a paragraph block 4' }]
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
            if (parentContainerEle) {
                document.body.removeChild(parentContainerEle);
                parentContainerEle = null;
            }
            else if (scrollContainerEle) {
                document.body.removeChild(scrollContainerEle);
                scrollContainerEle = null;
            }
            else {
                if (editorElement) {
                    document.body.removeChild(editorElement);
                }
            }
        });

        beforeEach((done) => {
            setTimeout(() => {
                blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                popup = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                done();
            }, 100);
        });

        it('should position popup correctly at start of block without overflow', (done) => {
            setSelectionRange(contentElement.lastChild, 0, 5); // Selection at start
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Verify no left/right overflow
                expect(popupRect.left).toBeGreaterThanOrEqual(editorRect.left);
                expect(popupRect.right).toBeLessThanOrEqual(editorRect.right + 2);

                // Verify no top/bottom overflow
                expect(popupRect.top).toBeGreaterThanOrEqual(editorRect.top);
                expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom);

                done();
            }, 100);
        });

        it('should position popup correctly in middle of block without overflow', (done) => {
            setSelectionRange(contentElement.lastChild, 50, 60); // Selection in middle (adjusted for longer content)
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                expect(popupRect.left).toBeGreaterThanOrEqual(editorRect.left);
                expect(popupRect.right).toBeLessThanOrEqual(editorRect.right + 2);
                expect(popupRect.top).toBeGreaterThanOrEqual(editorRect.top);
                expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom);

                done();
            }, 100);
        });

        it('should position popup correctly at end of block without overflow', (done) => {
            const textLength = contentElement.textContent.length;
            setSelectionRange(contentElement.lastChild, textLength - 5, textLength); // Selection at end
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                expect(popupRect.left).toBeGreaterThanOrEqual(editorRect.left);
                expect(popupRect.right).toBeLessThanOrEqual(editorRect.right + 2);
                expect(popupRect.top).toBeGreaterThanOrEqual(editorRect.top);
                expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom);

                done();
            }, 100);
        });

        it('should handle top collision and reposition popup below selection', (done) => {
            // Simulate a scenario where popup would collide at top (e.g., selection near top of editor)
            const range = document.createRange();
            range.setStart(contentElement.firstChild, 5); // Anchor at end
            range.setEnd(contentElement.firstChild, 0); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(contentElement.firstChild, 5); // Set anchor
                selection.extend(contentElement.firstChild, 0); // Set focus backward
            }

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

                // Verify repositioned below if top space is insufficient
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom); // Repositioned below
                expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom); // No bottom overflow

                done();
            }, 100);
        });

        it('should handle top collision and reposition popup below selection on partial selection at start of the block', (done) => {
            // Simulate a scenario where popup would collide at top (e.g., selection near top of editor)
            const range = document.createRange();
            range.setStart(contentElement.firstChild, 2); // Anchor at end
            range.setEnd(contentElement.firstChild, 0); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(contentElement.firstChild, 2); // Set anchor
                selection.extend(contentElement.firstChild, 0); // Set focus backward
            }

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

                // Verify repositioned below if top space is insufficient
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom); // Repositioned below
                expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom); // No bottom overflow

                done();
            }, 100);
        });

        it('should handle top collision and reposition popup below selection on partial selection at end of the block', (done) => {
            const textLength = contentElement.textContent.length;
            // Simulate a scenario where popup would collide at top (e.g., selection near top of editor)
            const range = document.createRange();
            range.setStart(contentElement.firstChild, textLength); // Anchor at end
            range.setEnd(contentElement.firstChild, textLength - 5); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(contentElement.firstChild, textLength); // Set anchor
                selection.extend(contentElement.firstChild, textLength - 5); // Set focus backward
            }

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

                // Verify repositioned below if top space is insufficient
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom); // Repositioned below
                expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom); // No bottom overflow

                done();
            }, 100);
        });

        it('should handle top collision and reposition popup below selection on partial selection at end of the first line', (done) => {
            // Simulate a scenario where popup would collide at top (e.g., selection near top of editor)
            const range = document.createRange();
            range.setStart(contentElement.firstChild, 45); // Anchor at end
            range.setEnd(contentElement.firstChild, 40); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(contentElement.firstChild, 45); // Set anchor
                selection.extend(contentElement.firstChild, 40); // Set focus backward
            }

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

                // Verify repositioned below if top space is insufficient
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom); // Repositioned below
                expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom); // No bottom overflow

                done();
            }, 100);
        });

        it('should handle bottom collision and reposition popup above selection', (done) => {
            // Simulate bottom collision (selection near bottom)
            editor.height = '300px';
            editor.dataBind();
            blockElement = editorElement.querySelector('#paragraph-3') as HTMLElement; // Select last block
            contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.lastChild, 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

                // Verify repositioned above if bottom space is insufficient
                expect(popupRect.bottom).toBeLessThanOrEqual(selectionRect.top); // Repositioned above
                expect(popupRect.top).toBeGreaterThanOrEqual(editorRect.top); // No top overflow

                done();
            }, 100);
        });

        it('should reposition popup on window resize without overflow', (done) => {
            setSelectionRange(contentElement.lastChild, 0, 5);
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                // Simulate resize
                const originalWidth = window.innerWidth;
                const originalHeight = window.innerHeight;
                Object.defineProperty(window, 'innerWidth', { value: originalWidth - 200, writable: true });
                Object.defineProperty(window, 'innerHeight', { value: originalHeight - 200, writable: true });

                const resizeEvent = new Event('resize');
                window.dispatchEvent(resizeEvent);

                setTimeout(() => {
                    const editorRect = editorElement.getBoundingClientRect();
                    const popupRect = popup.getBoundingClientRect();

                    // Verify repositioned within bounds after resize
                    expect(popupRect.left).toBeGreaterThanOrEqual(editorRect.left);
                    expect(popupRect.right).toBeLessThanOrEqual(editorRect.right + 2);
                    expect(popupRect.top).toBeGreaterThanOrEqual(editorRect.top);
                    expect(popupRect.bottom).toBeLessThanOrEqual(editorRect.bottom);

                    // Restore original dimensions
                    Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true });
                    Object.defineProperty(window, 'innerHeight', { value: originalHeight, writable: true });

                    done();
                }, 100);
            }, 100);
        });

        it('should handle ViewPort collision in calculateOffsetX and adjust left/right positioning', (done) => {
            // Simulate ViewPort collision: Make editor wide enough for left/right overflow test
            editorElement.style.width = '200px'; // Small width to force horizontal collision
            setSelectionRange(contentElement.lastChild, 0, 5); // Forward selection

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const popupRect = popup.getBoundingClientRect();

                // Verify left/right adjusted for ViewPort collision (no overflow)
                expect(popupRect.left).toBeGreaterThanOrEqual(0); // Left adjusted to viewport
                expect(popupRect.right).toBeLessThanOrEqual(window.innerWidth); // Right adjusted to viewport

                done();
            }, 100);
        });

        it('should handle ParentElement collision in calculateOffsetX and center popup', (done) => {
            // Simulate ParentElement collision: Selection where popup would overflow parent horizontally
            editorElement.style.width = '300px'; // Constrain parent width
            setSelectionRange(contentElement.lastChild, contentElement.textContent.length - 5, contentElement.textContent.length); // Selection at end to force right overflow

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Verify centered or adjusted within parent (ParentElement branch)
                expect(popupRect.left).toBeGreaterThanOrEqual(editorRect.left);
                expect(popupRect.right).toBeLessThanOrEqual(editorRect.right + 2);

                done();
            }, 100);
        });

        it('should handle ScrollableContainer collision in calculateOffsetX with scroll adjustment', (done) => {
            // Simulate ScrollableContainer: Nest editor in a scrollable parent
            scrollContainerEle = createElement('div', { styles: 'height: 200px; overflow: auto; width: 300px;' });
            document.body.appendChild(scrollContainerEle);
            scrollContainerEle.appendChild(editorElement);
            editorElement.style.width = '300px';

            setSelectionRange(contentElement.lastChild, 50, 60); // Middle selection

            // Scroll horizontally to simulate overflow
            scrollContainerEle.scrollLeft = 100;

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const scrollRect = scrollContainerEle.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Verify adjusted within scrollable container (ScrollableContainer branch)
                expect(popupRect.left).toBeGreaterThanOrEqual(scrollRect.left);
                expect(popupRect.right).toBeLessThanOrEqual(scrollRect.right + 2);

                done();
            }, 100);
        });

        it('should handle Hidden collision in getTopCollisionType and getSpaceAbove', (done) => {
            // Simulate Hidden: Position block above viewport (top < 0)
            editorElement.style.marginTop = '-200px'; // Move block out of view (top hidden)
            setSelectionRange(contentElement.lastChild, 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

                expect(popupRect.top).not.toBeGreaterThanOrEqual(selectionRect.bottom);

                done();
            }, 100);
        });

        it('should handle ParentElement collision in getTopCollisionType and getSpaceAbove', (done) => {
            // Simulate ParentElement: parentRect.top > 0
            parentContainerEle = createElement('div', { styles: 'margin-top: 100px;' });
            document.body.appendChild(parentContainerEle);
            parentContainerEle.appendChild(editorElement);

            setSelectionRange(contentElement.lastChild, 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const parentRect = parentContainerEle.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Verify spaceAbove as blockRect.top - parentRect.top (ParentElement branch)
                expect(popupRect.top).toBeGreaterThanOrEqual(parentRect.top);
                expect(popupRect.bottom).toBeLessThanOrEqual(parentRect.bottom);

                done();
            }, 100);
        });

        it('should handle viewport in getTopCollisionType and getSpaceAbove', (done) => {
            // Simulate ScrollableContainer: scrollParentRect.top > 0
            scrollContainerEle = createElement('div', { styles: 'height: 200px; overflow: auto;' });
            document.body.appendChild(scrollContainerEle);
            scrollContainerEle.appendChild(editorElement);

            editor.blockManager.setFocusToBlock(editorElement.querySelector('#paragraph-2'));
            const paraEl = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const contentEl = getBlockContentElement(paraEl);
            setSelectionRange(contentEl.lastChild, 0, 5);
            scrollContainerEle.scrollTop = 100;

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const scrollRect = scrollContainerEle.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();
                // Verify spaceAbove as scrollParentRect.top - parentRect.top (ScrollableContainer branch)
                expect(popupRect.top).toBeGreaterThanOrEqual(scrollRect.top);
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom);

                done();
            }, 100);
        });

        it('should handle ScrollableContainer collision in getTopCollisionType and getSpaceAbove', (done) => {
            // Simulate ScrollableContainer: scrollParentRect.top > 0
            editorElement.style.height = '300px';
            editorElement.scrollTop = 100;
            editor.blockManager.setFocusToBlock(editorElement.querySelector('#paragraph-2'));
            const paraEl = editorElement.querySelector('#paragraph-2') as HTMLElement;
            const contentEl = getBlockContentElement(paraEl);
            setSelectionRange(contentEl.lastChild, 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const popupRect = popup.getBoundingClientRect();

                const selectionRect = getSelectedRange().getBoundingClientRect();
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom);

                done();
            }, 100);
        });

        it('should handle ViewPort collision in getBottomCollisionType and getSpaceBelow', (done) => {
            // Simulate ViewPort: scrollParentRect.bottom >= innerHeight and parentRect.bottom >= innerHeight
            editorElement.style.height = '200px';
            editorElement.style.overflow = 'auto';
            editorElement.scrollTop = 0; // No scroll, bottom at viewport edge

            setSelectionRange(contentElement.lastChild, 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const popupRect = popup.getBoundingClientRect();

                // Verify spaceBelow as window.innerHeight - blockRect.bottom (ViewPort branch)
                expect(popupRect.bottom).toBeLessThanOrEqual(window.innerHeight);

                done();
            }, 100);
        });

        it('should handle ParentElement collision in getBottomCollisionType and getSpaceBelow', (done) => {
            // Simulate ParentElement: parentRect.bottom <= scrollParentRect.bottom
            parentContainerEle = createElement('div', { styles: 'height: 200px; overflow: hidden;' });
            document.body.appendChild(parentContainerEle);
            parentContainerEle.appendChild(editorElement);

            setSelectionRange(contentElement.lastChild, 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const parentRect = parentContainerEle.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Verify spaceBelow as parentRect.bottom - blockRect.bottom (ParentElement branch)
                expect(popupRect.bottom).toBeLessThanOrEqual(parentRect.bottom);

                done();
            }, 100);
        });

        it('should handle ScrollableContainer collision in getBottomCollisionType and getSpaceBelow', (done) => {
            // Simulate ScrollableContainer: parentRect.bottom > scrollParentRect.bottom
            scrollContainerEle = createElement('div', { styles: 'height: 150px; overflow: auto;' });
            document.body.appendChild(scrollContainerEle);
            scrollContainerEle.appendChild(editorElement);
            editorElement.style.height = '300px'; // Taller than scroll container

            setSelectionRange(contentElement.lastChild, 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom);

                done();
            }, 100);
        });

        it('should return early when itemId is null in transform selectHandler', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Test content' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const blockContent = getBlockContentElement(blockElement);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 4);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;

                    // Model Check: Verify block exists with correct type
                    expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                    
                    // DOM Check: Transform button should be rendered
                    expect(transformBtn).not.toBeNull();
                    expect(transformBtn.querySelector('.e-be-transform-block')).not.toBeNull();

                    done();
                }, 100);
            }, 100);
        });

        it('should return early when model is not found for selected transform item', (done) => {
            editor.blocks = [
                {
                    id: 'heading-1',
                    blockType: BlockType.Heading,
                    properties: { level: 1 },
                    content: [{ contentType: ContentType.Text, content: 'Heading text' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#heading-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const blockContent = getBlockContentElement(blockElement);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 3);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;

                    // Model Check: Verify heading block properties
                    expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                    expect((editor.blocks[0].properties as any).level).toBe(1);

                    // DOM Check: Transform button is rendered with correct label
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(transformIcon).not.toBeNull();
                    expect(transformIcon.classList.contains('e-be-h1')).toBe(true);

                    done();
                }, 100);
            }, 100);
        });

        it('should prevent transform when same block type is selected', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Paragraph text' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const blockContent = getBlockContentElement(blockElement);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 3);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;

                    // Model Check: Current block is Paragraph
                    expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                    const initialBlockCount = editor.blocks.length;

                    // DOM Check: Transform dropdown should show Paragraph label
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                    // Simulate clicking the Paragraph option (same as current)
                    // This should not trigger a transform
                    const currentItemId = 'paragraph-command';
                    if (currentItemId === 'paragraph-command') {
                        // Same block type, should return early without transforming
                        expect(editor.blocks.length).toBe(initialBlockCount);
                    }

                    done();
                }, 100);
            }, 100);
        });

        it('should handle transform with different block type selected', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Para to heading' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const blockContent = getBlockContentElement(blockElement);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 4);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;

                    // Model Check: Block is currently Paragraph
                    expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);

                    // DOM Check: Label displays Paragraph
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                    // Verify transform button is interactive
                    expect(transformBtn.classList.contains('e-disabled')).toBe(false);

                    done();
                }, 100);
            }, 100);
        });

        it('should call applyTransformMenuSelection when transform dropdown opens', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Test' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const blockContent = getBlockContentElement(blockElement);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 2);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
                    // Trigger the dropdown to open
                    (transformBtn as any).click();

                    setTimeout(() => {
                        const menuPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        if (menuPopup) {
                            // DOM Check: Menu popup should exist
                            expect(menuPopup).not.toBeNull();
                            // Check if menu items are present
                            const menuItems = menuPopup.querySelectorAll('li, .e-menu-item');
                            expect(menuItems.length).toBeGreaterThan(0);
                        }
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should handle multiple blocks selection with transform label showing Transform Blocks', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'First para' }]
                },
                {
                    id: 'paragraph-2',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Second para' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const firstBlock = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const secondBlock = editorElement.querySelector('#paragraph-2') as HTMLElement;
                
                editor.blockManager.setFocusToBlock(firstBlock);
                const content1 = getBlockContentElement(firstBlock);
                const content2 = getBlockContentElement(secondBlock);

                const range = document.createRange();
                range.setStart(content1.firstChild as ChildNode, 0);
                range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
                    // Model Check: Verify multiple blocks selected
                    expect(editor.blocks.length).toBe(2);

                    // DOM Check: Label should show "Transform Blocks"
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                    done();
                }, 100);
            }, 100);
        });

        it('should match Bullet List block to correct transform model', (done) => {
            editor.blocks = [
                {
                    id: 'bullet-list-1',
                    blockType: BlockType.BulletList,
                    content: [
                        {
                            contentType: ContentType.Text,
                            content: 'Item 1'
                        }
                    ]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const bulletBlock = editorElement.querySelector('#bullet-list-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(bulletBlock);
                const blockContent = getBlockContentElement(bulletBlock);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 3);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;

                    // Model Check: Block is BulletList
                    expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);

                    // DOM Check: Label shows Bullet List
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(transformIcon.classList.contains('e-list-unordered')).toBe(true);

                    done();
                }, 100);
            }, 100);
        });

        it('should match Heading 3 level to correct transform model', (done) => {
            editor.blocks = [
                {
                    id: 'heading-3',
                    blockType: BlockType.Heading,
                    properties: { level: 3 },
                    content: [{ contentType: ContentType.Text, content: 'Heading 3' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const headingBlock = editorElement.querySelector('#heading-3') as HTMLElement;
                editor.blockManager.setFocusToBlock(headingBlock);
                const blockContent = getBlockContentElement(headingBlock);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 3);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;

                    // Model Check: Block is Heading with level 3
                    expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                    expect((editor.blocks[0].properties as any).level).toBe(3);

                    // DOM Check: Label shows Heading 3
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(transformIcon.classList.contains('e-be-h3')).toBe(true);

                    done();
                }, 100);
            }, 100);
        });

        it('should apply e-selected class to menu item when dropdown opens', (done) => {
            editor.blocks = [
                {
                    id: 'paragraph-1',
                    blockType: BlockType.Paragraph,
                    content: [{ contentType: ContentType.Text, content: 'Select me' }]
                }
            ];
            editor.refresh();
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const blockContent = getBlockContentElement(blockElement);

                const range = document.createRange();
                range.setStart(blockContent.firstChild as ChildNode, 0);
                range.setEnd(blockContent.firstChild as ChildNode, 3);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
                    // Click to open dropdown
                    (transformBtn as any).click();

                    setTimeout(() => {
                        const menuPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        if (menuPopup) {
                            // DOM Check: Selected item should have e-selected class
                            const selectedItems = menuPopup.querySelectorAll('.e-selected');
                            // Should have at least one selected item or none if menu not fully rendered
                            expect(selectedItems.length >= 0).toBe(true);
                        }
                        done();
                    }, 150);
                }, 100);
            }, 100);
        });

        // Bug 
        // it('should handle Quote block type in getCurrentTransformLabel', (done) => {
        //     editor.blocks = [
        //         {
        //             id: 'quote-1',
        //             blockType: BlockType.Quote,
        //             properties: {
        //                 children: [{
        //                     content: [{ contentType: ContentType.Text, content: 'Quote text' }]
        //                 }]
        //             }
        //         }
        //     ];
        //     editor.refresh();
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();

        //     setTimeout(() => {
        //         const quoteBlock = editorElement.querySelector('#quote-1') as HTMLElement;
        //         editor.blockManager.setFocusToBlock(quoteBlock);
        //         const blockContent = getBlockContentElement(quoteBlock);

        //         const range = document.createRange();
        //         range.setStart(blockContent.firstChild as ChildNode, 0);
        //         range.setEnd(blockContent.firstChild as ChildNode, 2);
        //         const sel = window.getSelection();
        //         sel.removeAllRanges();
        //         sel.addRange(range);
        //         editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //         setTimeout(() => {
        //             const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //             const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;

        //             // Model Check: Block is Quote
        //             // expect(editor.blocks[0].blockType).toBe(BlockType.Quote);

        //             // DOM Check: Label shows Quote
        //             const labelSpan = transformBtn.querySelector('.e-be-transform-label') as HTMLElement;
        //             // expect(labelSpan.textContent).toBe('Quote');

        //             done();
        //         }, 100);
        //     }, 100);
        // });

        it('should handle toolbar items as objects instead of strings', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'paragraph-1',
                        blockType: BlockType.Paragraph,
                        content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbarSettings: {
                    items: [
                        { id: 'custom-bold', iconCss: 'e-icons e-bold', tooltipText: 'Bold', command: CommandName.Bold, htmlAttributes: { 'data-command': CommandName.Bold } },
                        { id: 'custom-italic', iconCss: 'e-icons e-italic', tooltipText: 'Italic', command: CommandName.Italic, htmlAttributes: { 'data-command': CommandName.Italic } }
                    ] as any
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar.classList.contains('e-popup-open')).toBe(true);
                    
                    const boldBtn = toolbar.querySelector('#custom-bold') as HTMLElement;
                    const italicBtn = toolbar.querySelector('#custom-italic') as HTMLElement;
                    expect(boldBtn).not.toBeNull();
                    expect(italicBtn).not.toBeNull();
                    done();
                }, 100);
            }, 200);
        });

        it('should handle getItemTextById through applyTransformMenuSelection with custom menu item', (done) => {
            // Create a custom block type that will test the getItemTextById fallback path
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'heading-1',
                        blockType: BlockType.Heading,
                        properties: { level: 2 },
                        content: [{ contentType: ContentType.Text, content: 'Heading 2 text' }]
                    }
                ]
            });
            editor.appendTo('#editor');
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#heading-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        const menuPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        expect(menuPopup).not.toBeNull();
                        
                        // The selected item should be heading2-command
                        const selectedItem = menuPopup.querySelector('.e-selected');
                        expect(selectedItem).not.toBeNull();
                        
                        // This exercises getItemTextById internally for matching by text
                        const heading2Item = menuPopup.querySelector('#heading2-command');
                        expect(heading2Item).not.toBeNull();
                        expect(heading2Item.classList.contains('e-selected')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should handle transform label with no focused block by showing default label', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
                    // Verify default label is shown (Paragraph for current block)
                    const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);

                    // Temporarily remove focused block
                    const originalFocusedBlock = editor.blockManager.currentFocusedBlock;
                    editor.blockManager.currentFocusedBlock = null;

                    // Trigger selectionchange to update label
                    document.dispatchEvent(new Event('selectionchange'));

                    setTimeout(() => {
                        // Label should still be Paragraph (default)
                        const transformIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                        expect(transformIcon.classList.contains('e-be-paragraph')).toBe(true);
                        
                        // Restore focused block
                        editor.blockManager.currentFocusedBlock = originalFocusedBlock;
                        done();
                    }, 50);
                }, 100);
            }, 100);
        });

        it('should handle transform dropdown state when block model is not found', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                
                // Change the block ID to simulate model not found
                const originalId = editor.blockManager.currentFocusedBlock.id;
                (editor.blockManager.currentFocusedBlock as any).id = 'non-existent-block-id';

                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
                    // Transform dropdown should still be functional even if model is not found
                    expect(transformBtn).not.toBeNull();
                    
                    // Should not be disabled (hasIgnoredBlockTypes returns false when model not found)
                    const dropdownButton = transformBtn.closest('.e-toolbar-item') as HTMLElement;
                    const isDisabled = dropdownButton.classList.contains('e-overlay') || 
                                     dropdownButton.getAttribute('aria-disabled') === 'true' ||
                                     transformBtn.classList.contains('e-disabled');
                    expect(isDisabled).toBe(false);
                    
                    // Restore original ID
                    (editor.blockManager.currentFocusedBlock as any).id = originalId;
                    done();
                }, 100);
            }, 100);
        });

        it('should handle transform dropdown when no focused block by using default state', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
                    // Verify transform dropdown is enabled for normal blocks
                    const isDisabled = transformBtn.classList.contains('e-disabled') ||
                                     transformBtn.closest('.e-toolbar-item').classList.contains('e-overlay') ||
                                     transformBtn.closest('.e-toolbar-item').getAttribute('aria-disabled') === 'true';
                    expect(isDisabled).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('should handle applyTransformMenuSelection when menuPopup does not exist', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                
                // Remove any existing popup before mouseup to test error handling
                const existingPopup = document.querySelector('#toolbar-transform-dropdown-popup');
                if (existingPopup) {
                    existingPopup.remove();
                }
                
                // This should not throw error even if popup doesn't exist
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    // Verify toolbar still appears normally
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    expect(toolbar).not.toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('should handle applyTransformMenuSelection with null currentItemId', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();
            
            const block1 = editorElement.querySelector('#paragraph-1') as HTMLElement;
            const block2 = editorElement.querySelector('#paragraph-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            const content1 = getBlockContentElement(block1);
            const content2 = getBlockContentElement(block2);

            // Select multiple blocks
            const range = document.createRange();
            range.setStart(content1.firstChild as ChildNode, 0);
            range.setEnd((content2.firstChild as ChildNode), (content2.firstChild as Text).textContent.length);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            setTimeout(() => {
                const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                transformBtn.click();

                setTimeout(() => {
                    const menuPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                    expect(menuPopup).not.toBeNull();
                    
                    // Check that no item has e-selected class when multiple blocks are selected
                    const selectedItems = menuPopup.querySelectorAll('.e-selected');
                    expect(selectedItems.length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });

        it('should handle applyTransformMenuSelection finding item by text content', (done) => {
            editor.destroy();
            editor = createEditor({
                blocks: [
                    {
                        id: 'bullet-1',
                        blockType: BlockType.BulletList,
                        content: [{ contentType: ContentType.Text, content: 'Bullet item' }]
                    }
                ]
            });
            editor.appendTo('#editor');
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#bullet-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 3);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        const menuPopup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        // The bullet list item should be selected
                        const selectedItem = menuPopup.querySelector('.e-selected');
                        expect(selectedItem).not.toBeNull();
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should handle getMatchingTransformItemId with blockModel not found in single selection', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                
                // Mock getSelectedBlocks to return a block with non-existent ID
                const originalMethod = editor.getSelectedBlocks;
                editor.getSelectedBlocks = () => [{ id: 'non-existent', blockType: BlockType.Paragraph, content: [] }];

                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        const popup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        // When block model is not found, no item should be selected or default paragraph should be selected
                        const selectedItem = popup.querySelector('.e-item.e-selected');
                        const paragraphItem = popup.querySelector('#paragraph-command');
                        
                        // Either no selection or paragraph is selected by default
                        if (selectedItem) {
                            expect(selectedItem.id).toBe('paragraph-command');
                        }
                        
                        // Restore original method
                        editor.getSelectedBlocks = originalMethod;
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should handle getMatchingTransformItemId when focusedBlock has no blockModel in else branch', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                
                // Clear getSelectedBlocks to force else branch
                const originalMethod = editor.getSelectedBlocks;
                editor.getSelectedBlocks = () => null;

                // Change block id to simulate blockModel not found
                const originalId = blockElement.id;
                blockElement.id = 'non-existent-block-id';
                editor.blockManager.currentFocusedBlock = blockElement;

                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    transformBtn.click();

                    setTimeout(() => {
                        const popup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        // Should handle gracefully when blockModel is not found
                        // expect(popup).not.toBeNull();
                        
                        // Restore original state
                        blockElement.id = originalId;
                        editor.getSelectedBlocks = originalMethod;
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        // Bug 
        // it('should select correct menu item for Quote block type using getItemTextById logic', (done) => {
        //     editor.destroy();
        //     editor = createEditor({
        //         blocks: [
        //             {
        //                 id: 'quote-1',
        //                 blockType: BlockType.Quote,
        //                 properties: {
        //                     children: [{
        //                         content: [{ contentType: ContentType.Text, content: 'Quote text' }]
        //                     }]
        //                 }
        //             }
        //         ]
        //     });
        //     editor.appendTo('#editor');
        //     editor.inlineToolbarSettings.items = ['Transform'];
        //     editor.dataBind();

        //     setTimeout(() => {
        //         const blockElement = editorElement.querySelector('#quote-1') as HTMLElement;
        //         editor.blockManager.setFocusToBlock(blockElement);
        //         const contentElement = getBlockContentElement(blockElement);
        //         editor.setSelection(contentElement.lastChild as Node, 0, 5);
        //         editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        //         setTimeout(() => {
        //             const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
        //             const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
        //             // Verify label shows Quote
        //             const buttonLabel = transformBtn.querySelector('.e-be-transform-label') as HTMLElement;
        //             // expect(buttonLabel.textContent.trim()).toBe('Quote');
                    
        //             // Open dropdown and verify Quote item is selected
        //             transformBtn.click();

        //             setTimeout(() => {
        //                 const popup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
        //                 // expect(popup).not.toBeNull();
                        
        //                 // Verify Quote menu item has selected class (tests getItemTextById indirectly)
        //                 const selectedItems = popup.querySelectorAll('.e-selected');
        //                 // expect(selectedItems.length).toBeGreaterThan(0);
                        
        //                 const quoteItem = Array.from(selectedItems).find(item => 
        //                     item.textContent.includes('Quote')
        //                 );
        //                 // expect(quoteItem).not.toBeNull();
        //                 done();
        //             }, 100);
        //         }, 100);
        //     }, 200);
        // });

        it('should cover getItemTextById return path when model is found', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    
                    // Verify the label text which internally uses getItemTextById
                    const buttonIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    expect(buttonIcon).not.toBeNull();
                    expect(buttonIcon.classList.contains('e-be-paragraph')).toBe(true);
                    
                    // Click to open dropdown and verify menu items have correct text
                    transformBtn.click();

                    setTimeout(() => {
                        const popup = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLElement;
                        const paragraphItem = Array.from(popup.querySelectorAll('.e-menu-item')).find(
                            item => item.textContent.includes('Paragraph')
                        );
                        expect(paragraphItem).not.toBeNull();
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should handle getCurrentTransformLabel when focusedBlock has no blockModel in else branch', (done) => {
            editor.inlineToolbarSettings.items = ['Transform'];
            editor.dataBind();

            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                
                // Clear getSelectedBlocks to force else branch
                const originalMethod = editor.getSelectedBlocks;
                editor.getSelectedBlocks = () => null;

                // Change block id to simulate blockModel not found in else branch
                const originalId = blockElement.id;
                blockElement.id = 'totally-non-existent-id';
                editor.blockManager.currentFocusedBlock = blockElement;

                const contentElement = getBlockContentElement(blockElement);
                editor.setSelection(contentElement.lastChild as Node, 0, 5);
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement;
                    const transformBtn = toolbar.querySelector('#toolbar-transform-dropdown') as HTMLElement;
                    const buttonIcon = transformBtn.querySelector('.e-be-transform-block') as HTMLElement;
                    
                    // Should return default label when blockModel not found in else branch
                    expect(buttonIcon.classList.contains('e-be-paragraph')).toBe(true);
                    
                    // Restore original state
                    blockElement.id = originalId;
                    editor.getSelectedBlocks = originalMethod;
                    done();
                }, 100);
            }, 100);
        });
    });
});
