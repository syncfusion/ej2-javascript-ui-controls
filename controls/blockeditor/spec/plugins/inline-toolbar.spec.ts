import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, BlockType, ContentType, BuiltInToolbar, getBlockContentElement, PopupRenderer, ToolbarRenderer, TooltipRenderer, getSelectionRange, setCursorPosition, ContentModel } from '../../src/index';
import { createEditor } from '../common/util.spec';

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
                        type: BlockType.Paragraph,
                        content: [{ id: 'paragraph-content-1', type: ContentType.Text, content: 'Hello world' }]
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
                editor.setFocusToBlock(blockElement);
                editor.setSelection('paragraph-content-1', 0, 4);
                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                editorElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(editorElement.querySelector('#' + editor.currentFocusedBlock.id)).toBe(blockElement);
                    expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });
        
        it('should handle inline toolbar item click', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
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
                        expect(editor.blocks[0].content[0].styles.bold).toBe(true);
                        
                        let itemClickedCalled = false;
                        editor.inlineToolbar.itemClicked = (args) => {
                            itemClickedCalled = true;
                            args.cancel = true;
                        };
                        
                        const italicButton = toolbar.querySelector('[data-command="Italic"]');
                        italicButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        
                        setTimeout(() => {
                            expect(itemClickedCalled).toBe(true);
                            expect(contentElement.querySelector('em')).toBeNull();
                            
                            done();
                        }, 100);
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
                        type: BlockType.Paragraph,
                        content: [
                            { 
                                id: 'content-1', 
                                type: ContentType.Text, 
                                content: 'Bold and italic ', 
                                styles: { bold: true, italic: true } 
                            },
                            { 
                                id: 'content-2', 
                                type: ContentType.Text, 
                                content: 'Bold only ', 
                                styles: { bold: true }
                            },
                            { 
                                id: 'content-3', 
                                type: ContentType.Text, 
                                content: 'No formatting', 
                                styles: {}
                            }
                        ]
                    }
                ]
            });
            editor.appendTo('#editor');
            
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                
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
                editor.setFocusToBlock(blockElement);
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
                            
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should handle colorpicker changes properly', () => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            editor.setSelection('paragraph-content-1', 0, 4);
            (editor.inlineToolbarModule as any).handleColorChange('bgColor', {
                currentValue: {
                    rgba: 'rgb(255, 132, 132)',
                }
            });
            const tbarIcon = document.querySelector('.e-inline-bgColor-icon') as HTMLElement;
            expect(tbarIcon.style.borderBottomColor).toBe('rgb(255, 132, 132)');
        });
        
        it('should handle property changes', (done) => {
            setTimeout(() => {
                const originalWidth = editor.inlineToolbar.width;
                editor.inlineToolbar.width = '500px';
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    expect((popup as HTMLElement).style.width).toBe('500px');
                    
                    const originalItems = [...editor.inlineToolbar.items];
                    editor.inlineToolbar.items = [
                        { id: 'bold', iconCss: 'e-icons e-bold', tooltip: 'Bold', item: BuiltInToolbar.Bold, htmlAttributes: { 'data-command': BuiltInToolbar.Bold } },
                        { id: 'italic', iconCss: 'e-icons e-italic', tooltip: 'Italic', item: BuiltInToolbar.Italic, htmlAttributes: { 'data-command': BuiltInToolbar.Italic } },
                    ];
                    
                    setTimeout(() => {
                        const toolbar = document.querySelector('.e-blockeditor-inline-toolbar');
                        const toolbarItems = toolbar.querySelectorAll('.e-toolbar-item');
                        expect(toolbarItems.length).toBe(2);
                        
                        editor.inlineToolbar.width = originalWidth;
                        expect(editor.inlineToolbar.items.length).toBe(2);
                        
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
        
        it('should show and hide toolbar programmatically', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                editor.setSelection('paragraph-content-1', 0, 5);
                
                // Get a range for testing
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                
                // Hide toolbar initially (if visible)
                editor.inlineToolbarModule.hideInlineToolbar();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                    expect(popup.classList.contains('e-popup-open')).toBe(false);
                    
                    // Show toolbar programmatically
                    editor.inlineToolbarModule.showInlineToolbar(range);
                    
                    setTimeout(() => {
                        expect(popup.classList.contains('e-popup-open')).toBe(true);
                        
                        // Add close handler and test cancellation
                        let closeCalled = false;
                        editor.inlineToolbar.close = (args) => {
                            closeCalled = true;
                            args.cancel = true;
                        };
                        
                        // Try to hide
                        editor.inlineToolbarModule.hideInlineToolbar();
                        
                        setTimeout(() => {
                            // Should still be open because we cancelled
                            expect(closeCalled).toBe(true);
                            expect(popup.classList.contains('e-popup-open')).toBe(true);
                            
                            // Remove cancel
                            editor.inlineToolbar.close = (args) => {
                                closeCalled = true;
                            };
                            
                            // Hide again
                            editor.inlineToolbarModule.hideInlineToolbar();
                            
                            setTimeout(() => {
                                expect(popup.classList.contains('e-popup-open')).toBe(false);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 200);
        });
        
        it('should handle keyboard shortcuts for formatting', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                editor.setFocusToBlock(blockElement);
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
                editor.setFocusToBlock(blockElement);
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
            popupRenderer = new PopupRenderer(editor);
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
                        type: BlockType.Paragraph,
                        content: [{ id: 'paragraph-content-1', type: ContentType.Text, content: 'Hello world' }]
                    }
                ],
                inlineToolbar: {
                    enableTooltip: false,
                    items: [
                        { id: 'bold', iconCss: 'e-icons e-bold', tooltip: 'Bold', item: BuiltInToolbar.Bold, htmlAttributes: { 'data-command': BuiltInToolbar.Bold } },
                        { id: 'italic', iconCss: 'e-icons e-italic', tooltip: 'Italic', item: BuiltInToolbar.Italic, htmlAttributes: { 'data-command': BuiltInToolbar.Italic } },
                        { id: 'underline', iconCss: 'e-icons e-underline', tooltip: 'Underline', item: BuiltInToolbar.Underline, htmlAttributes: { 'data-command': BuiltInToolbar.Underline } },
                        { id: 'strikethrough', iconCss: 'e-icons e-strikethrough', tooltip: 'Strikethrough', item: BuiltInToolbar.Strikethrough, htmlAttributes: { 'data-command': BuiltInToolbar.Strikethrough } },
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

        it('should not render tooltip when enabletooltip is false', () => {
            expect((editor.inlineToolbarModule as any).inlineToolbarTooltip).toBeUndefined();
        });

        it('should trigger open and close events', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 0);
                editor.inlineToolbar.open = (args) => {
                    isOpened = true;
                };
                editor.inlineToolbar.close = (args) => {
                    isClosed = true;
                };
                editor.inlineToolbarModule.showInlineToolbar(getSelectionRange());
                expect(isOpened).toBe(true);

                setTimeout(() => {
                    editor.inlineToolbarModule.hideInlineToolbar();
                    expect(isClosed).toBe(true);
                    done();
                }, 100);
            }, 200);
        });

        it('should cancel open event', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 0);
                const popup = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                editor.inlineToolbar.open = (args) => {
                    args.cancel = true;
                },
                editor.inlineToolbarModule.showInlineToolbar(getSelectionRange());
                expect(popup.classList.contains('e-popup-open')).toBe(false);
                done();
            }, 200);
        });

        it('should cancel close event', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 0);
                const popup = document.querySelector('.e-blockeditor-inline-toolbar-popup');
                editor.inlineToolbar.close = (args) => {
                    args.cancel = true;
                },
                editor.inlineToolbarModule.showInlineToolbar(getSelectionRange());
                setTimeout(() => {
                    editor.inlineToolbarModule.hideInlineToolbar();
                    setTimeout(() => {
                        expect(popup.classList.contains('e-popup-open')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should not show toolbar when enable is false', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 0);
                editor.inlineToolbar.enable = false;
                editor.inlineToolbarModule.showInlineToolbar(getSelectionRange())
                expect(document.querySelector('.e-blockeditor-inline-toolbar').classList.contains('e-popup-open')).toBe(false);
                done();
            }, 200);
        });

        it('should fetch common styles properly', () => {
            const contents: ContentModel[] = [{
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
            }, {
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
                    bgColor: '#ffffff',
                    custom: '',
                }
            }];
            expect((editor.inlineToolbarModule as any).getCommonStyles(contents)).toEqual(
                { bold: true, italic: true, underline: true, strikethrough: true,
                    uppercase: true, lowercase: true, superscript: true, subscript: true,
                    color: '', bgColor: '', custom: ''
                });
        });

        it('should handle null values properly', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.setFocusToBlock(blockElement);

                //Without range
                editor.inlineToolbarModule.toggleToolbarActiveState();

                //Set range as editorelement
                editor.nodeSelection.createRangeWithOffsets(editorElement, editorElement, 0, 0);
                editor.inlineToolbarModule.toggleToolbarActiveState();

                //Set range as contentElement
                setCursorPosition(contentElement, 0);
                editor.blocks[0].content = null;
                editor.inlineToolbarModule.toggleToolbarActiveState();

                //Set range as contentElement
                editor.nodeSelection.createRangeWithOffsets(blockElement, blockElement, 0, 0);
                contentElement.remove();
                editor.inlineToolbarModule.toggleToolbarActiveState();

                document.querySelector('.e-blockeditor-inline-toolbar').remove();
                (editor.inlineToolbarModule as any).initializeColorPickers();

                document.querySelector('.e-blockeditor-inline-toolbar-popup').remove();
                editor.inlineToolbarModule.toggleToolbarActiveState();

                (editor.inlineToolbarModule as any).getCommonStyles([]);
                done();
            }, 200);
        });
    });
});
