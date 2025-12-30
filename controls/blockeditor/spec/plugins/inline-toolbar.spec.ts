import { createElement } from '@syncfusion/ej2-base';
import { createEditor } from '../common/util.spec';
import { setCursorPosition, getBlockContentElement, getSelectedRange } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor, ToolbarRenderer, TooltipRenderer } from '../../src/index';
import { BaseChildrenProp, BaseStylesProp, ContentModel, ILabelContentSettings, IMentionContentSettings, Styles } from '../../src/models/index';
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
                        content: [{ id: 'paragraph-content-1', contentType: ContentType.Text, content: 'Hello world' }]
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
                editor.setSelection('paragraph-content-1', 0, 4);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);
                    expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(true);
                    expect(editor.inlineToolbarSettings.items.length).toBe(6);
                    done();
                }, 100);
            }, 200);
        });

        it('should hide inline tbar popup on document click', (done) => {
            const blockElement = editor.element.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('paragraph-content-1', 2, 8);
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
                editor.setSelection('paragraph-content-1', 0, 5);
                
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
                editor.setSelection('paragraph-content-1', 0, 5); // "Hello"
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
                editor.setSelection('paragraph-content-1', 0, 5); // "Hello"
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
                editor.setSelection('paragraph-content-1', 0, 5); // "Hello"
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
                editor.setSelection('paragraph-content-1', 0, 5); // "Hello"

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
                editor.setSelection('paragraph-content-1', 0, 5); // "Hello"

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
                                id: 'content-1', 
                                contentType: ContentType.Text, 
                                content: 'Bold and italic ', 
                                properties: { styles: { bold: true, italic: true }  }
                            },
                            { 
                                id: 'content-2', 
                                contentType: ContentType.Text, 
                                content: 'Bold only ', 
                                properties: { styles: { bold: true } }
                            },
                            { 
                                id: 'content-3', 
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
                const firstElement = contentElement.querySelector('#content-1');
                range.setStart(firstElement.firstChild, 0);
                
                // Set end at the last element
                const lastElement = contentElement.querySelector('#content-3');
                range.setEndAfter(lastElement);
                
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
                    const firstContentElement = contentElement.querySelector('#content-1');
                    range = document.createRange();
                    range.selectNodeContents(firstContentElement);
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
                editor.setSelection('paragraph-content-1', 0, 5);
                
                editorElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                
                setTimeout(() => {
                    const toolbar = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    
                    const colorDropdown = toolbar.querySelector('#toolbar-color-dropdown');
                    colorDropdown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    
                    setTimeout(() => {
                        const colorPicker = document.querySelector('.e-be-color-picker');
                        expect(colorPicker).not.toBeNull();
                        
                        let colorCell = colorPicker.querySelectorAll('.e-color-palette .e-row .e-tile');
                        let color = colorCell[1].getAttribute('aria-label');
                        colorCell[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        
                        setTimeout(() => {
                            const contentElement = getBlockContentElement(blockElement);
                            const coloredElement = contentElement.querySelector('span[style*="color"]');
                            expect(coloredElement).not.toBeNull();
                            
                            // Should update the color icon in the toolbar
                            const colorIcon = colorDropdown.querySelector('.e-inline-color-icon');
                            expect((colorIcon as HTMLElement).style.borderBottomColor).not.toBe('#000000');
                            const contentModel = editor.blocks[0].content[0];
                            const styles = (contentModel.properties as BaseStylesProp).styles;

                            expect(typeof styles.color).toBe('string');
                            expect(styles.color).toBe('rgba(244,67,54,1)');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should handle colorpicker changes properly', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('paragraph-content-1', 0, 4);
            
            (editor.blockManager.inlineToolbarModule as any).handleColorChange({
                type: 'backgroundColor',
                value: 'rgb(255, 132, 132)'
            });
            const tbarIcon = document.querySelector('.e-inline-bgColor-icon') as HTMLElement;
            expect(tbarIcon.style.borderBottomColor).toBe('rgb(255, 132, 132)');
            const contentModel = editor.blocks[0].content[0];
            const styles = (contentModel.properties as BaseStylesProp).styles;

            expect(typeof styles.backgroundColor).toBe('string');
            expect(styles.backgroundColor).toBe('rgb(255, 132, 132)');

        });
        
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
        
        it('should handle keyboard shortcuts for formatting', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                editor.setSelection('paragraph-content-1', 0, 5);
                
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
                        expect(contentElement.querySelector('em strong')).not.toBeNull();
                        expect(contentElement.querySelector('em strong').textContent).toBe('Hello');
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
                editor.setSelection('paragraph-content-1', 0, 5);
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
                        content: [{ id: 'paragraph-content-1', contentType: ContentType.Text, content: 'Hello world' }]
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
                editor.blockManager.inlineToolbarModule.showInlineToolbar(getSelectedRange())
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
            const commonStyles: Styles = (editor.blockManager.inlineToolbarModule as any).getCommonStyles(contents);
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
                (editor.inlineToolbarModule as any).initializeColorPickerAndDropdown();

                (editor.blockManager.inlineToolbarModule as any).getCommonStyles([]);
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
                        content: [{ id: 'paragraph-content-1', contentType: ContentType.Text, content: 'A Block Editor Component is a used to manage and edit content in discrete "blocks. Each block can represent a specific type of content, such as text, images, videos, tables, or other rich media. The key idea is to divide content into modular blocks that can be independently created, edited, rearranged, or deleted.' }]
                    },
                    {
                        id: 'paragraph-2',
                        blockType: BlockType.Paragraph,
                        content: [{ id: 'paragraph-content-2', contentType: ContentType.Text, content: 'This is a paragraph block 1' }]
                    },
                    {
                        id: 'paragraph-3',
                        blockType: BlockType.Paragraph,
                        content: [{ id: 'paragraph-content-3', contentType: ContentType.Text, content: 'This is a paragraph block 2' }]
                    },
                    {
                        id: 'paragraph-4',
                        blockType: BlockType.Paragraph,
                        content: [{ id: 'paragraph-content-4', contentType: ContentType.Text, content: 'This is a paragraph block 3' }]
                    },
                    {
                        id: 'paragraph-5',
                        blockType: BlockType.Paragraph,
                        content: [{ id: 'paragraph-content-5', contentType: ContentType.Text, content: 'This is a paragraph block 4' }]
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
            editor.setSelection('paragraph-content-1', 0, 5); // Selection at start
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
            editor.setSelection('paragraph-content-1', 50, 60); // Selection in middle (adjusted for longer content)
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
            editor.setSelection('paragraph-content-1', textLength - 5, textLength); // Selection at end
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
            const paraEle1 = editorElement.querySelector('#paragraph-content-1');
            const range = document.createRange();
            range.setStart(paraEle1.firstChild, 5); // Anchor at end
            range.setEnd(paraEle1.firstChild, 0); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(paraEle1.firstChild, 5); // Set anchor
                selection.extend(paraEle1.firstChild, 0); // Set focus backward
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
            const paraEle1 = editorElement.querySelector('#paragraph-content-1');
            const range = document.createRange();
            range.setStart(paraEle1.firstChild, 2); // Anchor at end
            range.setEnd(paraEle1.firstChild, 0); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(paraEle1.firstChild, 2); // Set anchor
                selection.extend(paraEle1.firstChild, 0); // Set focus backward
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
            const paraEle1 = editorElement.querySelector('#paragraph-content-1');
            const range = document.createRange();
            range.setStart(paraEle1.firstChild, textLength); // Anchor at end
            range.setEnd(paraEle1.firstChild, textLength - 5); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(paraEle1.firstChild, textLength); // Set anchor
                selection.extend(paraEle1.firstChild, textLength - 5); // Set focus backward
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
            const paraEle1 = editorElement.querySelector('#paragraph-content-1');
            const range = document.createRange();
            range.setStart(paraEle1.firstChild, 45); // Anchor at end
            range.setEnd(paraEle1.firstChild, 40); // Focus at start
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Force backward direction using extend if supported
            if (selection.extend) {
                selection.collapse(paraEle1.firstChild, 45); // Set anchor
                selection.extend(paraEle1.firstChild, 40); // Set focus backward
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
            editor.setSelection('paragraph-content-3', 0, 5);

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
            editor.setSelection('paragraph-content-1', 0, 5);
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
            editor.setSelection('paragraph-content-1', 0, 5); // Forward selection

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
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
            editor.setSelection('paragraph-content-1', contentElement.textContent.length - 5, contentElement.textContent.length); // Selection at end to force right overflow

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

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

            editor.setSelection('paragraph-content-1', 50, 60); // Middle selection

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
            editor.setSelection('paragraph-content-1', 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
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

            editor.setSelection('paragraph-content-1', 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const parentRect = parentContainerEle.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();

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
            editor.setSelection('paragraph-content-2', 0, 5);
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
            editor.setSelection('paragraph-content-2', 0, 5);

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

            editor.setSelection('paragraph-content-1', 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const editorRect = editorElement.getBoundingClientRect();
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

            editor.setSelection('paragraph-content-1', 0, 5);

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

            editor.setSelection('paragraph-content-1', 0, 5);

            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
            editorElement.dispatchEvent(mouseUpEvent);

            setTimeout(() => {
                expect(popup.classList.contains('e-popup-open')).toBe(true);

                const scrollRect = scrollContainerEle.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                const selectionRect = getSelectedRange().getBoundingClientRect();
                expect(popupRect.top).toBeGreaterThanOrEqual(selectionRect.bottom);

                done();
            }, 100);
        });
    });
});
