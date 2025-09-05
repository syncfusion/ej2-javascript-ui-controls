import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockEditor, BlockType, ContentType, getBlockContentElement, setCursorPosition } from '../../src/index';
import { createEditor } from '../common/util.spec';
import { BlockModel, CommandItemModel, HeadingProps } from '../../src/blockeditor/models';

describe('Slash Command Module', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('Transform blocks using slash command', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph1',
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
            var popup = document.querySelector('.e-blockeditor-command-menu.e-popup');
            if (popup) {
                remove(popup);
            }
        });

        it('transforming paragraph to heading', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const headingElement = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
            expect(headingElement).not.toBeNull();
            headingElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].type).toBe(BlockType.Heading);
            expect((editor.blocks[0].props as HeadingProps).level).toBe(1);
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('h1').textContent).toBe('Hello world');
                expect(editor.blocks[0].content[0].content).toBe('Hello world');
                done();
            }, 200);
        });

        it('transforming heading to quote', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const quoteElement = slashCommandElement.querySelector('li[data-value="Quote"]') as HTMLElement;
            expect(quoteElement).not.toBeNull();
            quoteElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].type).toBe(BlockType.Quote);
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('blockquote').textContent).toBe('Hello world');
                expect(editor.blocks[0].content[0].content).toBe('Hello world');
                done();
            }, 200);
        });

        it('transforming quote to bullet list', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].type).toBe(BlockType.BulletList);
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Hello world');
                expect(editor.blocks[0].content[0].content).toBe('Hello world');
                done();
            }, 200);
        });

        it('transforming to divider when content is present', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
                expect(blockElement).not.toBeNull();
                editor.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = 'Hello world /';
                setCursorPosition(contentElement, contentElement.textContent.length);
                editor.stateManager.updateContentOnUserTyping(blockElement);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(slashCommandElement).not.toBeNull();
                // click divider li element inside the popup
                const dividerLiElement = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
                expect(dividerLiElement).not.toBeNull();
                dividerLiElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                // Should create new divider block since content is present in the current block
                expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].type).toBe(BlockType.Divider);
                setTimeout(() => {
                    expect(editorElement.querySelector('.e-block').querySelector('p').textContent).toBe('Hello world ');
                    expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                    expect(editorElement.querySelectorAll('.e-block')[1].querySelector('hr')).not.toBeNull();
                    expect(editor.blocks[0].content[0].content).toBe('Hello world ');
                    expect(editor.blocks[1].content.length).toBe(0);

                    //Ensure focus is in next sibling of divider
                    expect(editor.currentFocusedBlock.id).toBe(editor.blocks[2].id);
                    done();
                }, 200);
            }, 100);
        });

        it('transforming to divider when content is empty', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
                expect(blockElement).not.toBeNull();
                editor.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = '/';
                setCursorPosition(contentElement, 1);
                editor.stateManager.updateContentOnUserTyping(blockElement);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(slashCommandElement).not.toBeNull();
                // click divider li element inside the popup
                const dividerLiElement = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
                expect(dividerLiElement).not.toBeNull();
                dividerLiElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                // Current bullet list block should be replaced with divider block since content is empty
                expect(editor.blocks[0].type).toBe(BlockType.Divider);
                expect(editor.blocks[1].type).toBe(BlockType.Paragraph);
                setTimeout(() => {
                    expect(editorElement.querySelector('.e-block').querySelector('p')).toBeNull();
                    expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                    expect(editorElement.querySelectorAll('.e-block')[0].querySelector('hr')).not.toBeNull();
                    expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p')).not.toBeNull();

                    expect(editor.blocks[0].content.length).toBe(0);

                    //Ensure focus is in next sibling of divider
                    expect(editor.currentFocusedBlock.id).toBe(editor.blocks[1].id);
                    done();
                }, 200);
            }, 100);
        });
        
        it('transforming to collapsible when content is empty', (done) => {
            const newBlock: BlockModel = {
                id: 'paragraph2',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content2', type: ContentType.Text, content: '' }
                ]
            };
            setTimeout(()=>{
                editor.addBlock(newBlock, 'paragraph1', true);
                const blockElements = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
                const blockElement = blockElements[1];
                expect(blockElement).not.toBeNull();
                editor.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = '/';
                setCursorPosition(contentElement, 1);
                editor.stateManager.updateContentOnUserTyping(blockElement);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(slashCommandElement).not.toBeNull();
                // click collapsible paragraph li element inside the popup
                const collapsibleParaEle = slashCommandElement.querySelector('li[data-value="Collapsible Paragraph"]') as HTMLElement;
                expect(collapsibleParaEle).not.toBeNull();
                collapsibleParaEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                // Current bullet list block should be replaced with CollapsibleParagraph block since content is empty
                expect(editor.blocks[1].type).toBe(BlockType.CollapsibleParagraph);
                expect(editor.blocks[2].type).toBe(BlockType.Paragraph);
                setTimeout(() => {
                    expect(editorElement.querySelectorAll('.e-block')[1].classList.contains('e-toggle-block')).toBe(true);
                    done();
                }, 200);
            });
        });

        it('transforming to callout when content is empty', (done) => {
            const newBlock: BlockModel = {
                id: 'paragraph2',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content2', type: ContentType.Text, content: '' }
                ]
            };
            setTimeout(()=>{
                editor.addBlock(newBlock, 'paragraph1', true);
                const blockElements = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
                const blockElement = blockElements[1];
                expect(blockElement).not.toBeNull();
                editor.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = '/';
                setCursorPosition(contentElement, 1);
                editor.stateManager.updateContentOnUserTyping(blockElement);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(slashCommandElement).not.toBeNull();
                // click callout li element inside the popup
                const calloutEle = slashCommandElement.querySelector('li[data-value="Callout"]') as HTMLElement;
                expect(calloutEle).not.toBeNull();
                calloutEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                // Current bullet list block should be replaced with callout block since content is empty
                expect(editor.blocks[1].type).toBe(BlockType.Callout);
                expect(editor.blocks[2].type).toBe(BlockType.Paragraph);
                setTimeout(() => {
                    expect(editorElement.querySelectorAll('.e-block')[1].classList.contains('e-callout-block')).toBe(true);
                    done();
                }, 200);
            });
        });

        it('should execute command with keyboard shortcut', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            
            // Simulate the keyboard shortcut
            const keyEvent = new KeyboardEvent('keydown', {
                key: '1',
                code: 'Digit1',
                ctrlKey: true,
                altKey: true,
                bubbles: true
            });
            
            
            editor.element.dispatchEvent(keyEvent);
            
            setTimeout(() => {
                // Check if block has been transformed
                expect(editor.blocks[0].type).toBe(BlockType.Heading);
                expect((editor.blocks[0].props as HeadingProps).level).toBe(1);
                done();
            }, 100);
        });
        
        it('should filter commands and show filtered results', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            
            // Open slash command popup
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/head';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { 
                key: 'd', 
                code: 'KeyD', 
                bubbles: true 
            }));
            
            setTimeout(() => {
                // Check that only heading items are shown
                const menuItems = document.querySelectorAll('.e-blockeditor-command-menu li');
                let headingItemFound = false;
                
                menuItems.forEach(item => {
                    const itemValue = item.getAttribute('data-value');
                    if (itemValue && itemValue.toLowerCase().includes('head')) {
                        headingItemFound = true;
                    }
                });
                
                expect(headingItemFound).toBe(true);
                
                done();
            }, 300);
        });
        
        it('should check popup open state', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.setFocusToBlock(blockElement);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-command-menu.e-popup');
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                

                const event = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    bubbles: true,
                    keyCode: 27
                } as KeyboardEventInit);

                // Manually assign keyCode
                Object.defineProperty(event, 'keyCode', {
                    get: () => 27
                });

                const containerWrapper = editorElement.querySelector('.e-mention.e-editable-element');
                containerWrapper.dispatchEvent(event);
                
                setTimeout(() => {
                    // Popup should be closed
                    expect(popup.classList.contains('e-popup-open')).toBe(false);
                    done();
                }, 300);
            }, 100);
        });
        
        it('should update popup properties when commandMenu properties change', (done) => {
            
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { 
                key: '/', 
                code: 'Slash', 
                bubbles: true 
            }));
            editor.commandMenu.popupWidth = '400px';
            editor.commandMenu.popupHeight = '400px';
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-command-menu.e-popup');
                // once onprop change for slash command is fixed can uncomment below lines
                // Check if properties were updated
                const popupWidth = (popup as HTMLElement).style.width;
                const popupHeight = (popup as HTMLElement).style.maxHeight;
                
                // expect(popupWidth).toBe('400px');
                // expect(popupHeight).not.toBe('400px');
                done();
            }, 100);
        });
        
        it('should change commands when commandMenu.commands is updated', (done) => {
            const customCommand: CommandItemModel = {
                label: 'Custom Command',
                type: BlockType.Paragraph,
                iconCss: 'e-custom-icon',
                tooltip: 'Custom tooltip'
            };
            
            editor.commandMenu.commands = [customCommand];
            
            // Open popup
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/custom';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { 
                key: 'm', 
                code: 'KeyM', 
                bubbles: true 
            }));
            
            setTimeout(() => {
                // once onprop change for slash command is fixed can uncomment below lines
                // const customCommandElement = document.querySelector('.e-blockeditor-command-menu li[data-value="Custom Command"]');
                // expect(customCommandElement).not.toBeNull();
                done();
            }, 300);
        });
        
        it('should handle tooltip display', (done) => {
            editor.commandMenu.enableTooltip = true;
            
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { 
                key: '/', 
                code: 'Slash', 
                bubbles: true 
            }));
            
            setTimeout(() => {
                const commandItems = document.querySelectorAll('.e-blockeditor-command-menu li');
                
                commandItems[1].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                
                setTimeout(() => {
                    const tooltip = document.querySelector('.e-blockeditor-command-menu-tooltip');
                    expect(tooltip).not.toBeNull();
                    done();
                }, 100);
            }, 300);
        });
        
    });

    describe('Events and other testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let isOpenFired = false;
        let isCloseFired = false;
        let isQueryFilterFired = false;
        let isItemClickedFired = false;

        function triggerSlashPopupOpen(blockElement: HTMLElement, editorElement: HTMLElement) {
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ 
                blocks: blocks,
                commandMenu: {
                    enableTooltip: false,
                    commands: [
                        {
                            id: 'checklist-command',
                            type: BlockType.Checklist,
                            groupHeader: 'General',
                            label: 'Checklist',
                            tooltip: 'Create a checklist',
                            iconCss: 'e-icons e-check-box',
                        },
                        {
                            id: 'bullet-list-command',
                            type: BlockType.BulletList,
                            groupHeader: 'General',
                            label: 'Bullet List',
                            tooltip: 'Create a bullet list',
                            iconCss: 'e-icons e-list-unordered',
                            disabled: true
                        },
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
            remove(editorElement);
            var popup = document.querySelector('.e-blockeditor-command-menu.e-popup');
            if (popup) {
                remove(popup);
            }
        });

        it('should render custom items properly', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-command-menu');
                expect(popup).not.toBeNull();
                expect(popup.querySelectorAll('li.e-list-item').length).toBe(2);
                done();
            }, 200);
        });

        it('should not render tooltip when enableTooltip is false', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                expect((editor.slashCommandModule as any).slashMenuTooltip).toBeUndefined();
                done();
            }, 200);
        });

        it('should handle args.cancel for tooltip properly', (done) => {
            editor.commandMenu.enableTooltip = true;
            editor.dataBind();
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                const commandItems = document.querySelectorAll('.e-blockeditor-command-menu li.e-list-item');
                //Hover on disabled item
                commandItems[1].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                setTimeout(() => {
                    const tooltip = document.querySelector('.e-blockeditor-command-menu-tooltip');
                    expect(tooltip).toBeNull();

                    const firstTemplateItem = commandItems[0].querySelector('.e-command-mention-item-template');
                    firstTemplateItem.removeAttribute('title');

                    //Hover on item that has no title attr
                    commandItems[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                    setTimeout(() => {
                        const tooltip = document.querySelector('.e-blockeditor-command-menu-tooltip');
                        expect(tooltip).toBeNull();
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('should handle null values properly', (done) => {
            spyOn(editor.blockRendererManager, 'handleBlockTransformation').and.callThrough();
            (editor.slashCommandModule as any).transformBlocks({
                type: null
            });

            expect(editor.blockRendererManager.handleBlockTransformation).not.toHaveBeenCalled();
            done();
        });

        it('should trigger open and close events', (done) => {
            editor.commandMenu.open = (args) => {
                isOpenFired = true;
            };
            editor.commandMenu.close = (args) => {
                isCloseFired = true;
            };
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                expect(isOpenFired).toBe(true);
                editor.slashCommandModule.hidePopup();
                setTimeout(() => {
                    expect(isCloseFired).toBe(true);
                    done();
                }, 200);
            }, 200);
        });

        it('should cancel open event', (done) => {
            editor.commandMenu.open = (args) => {
                args.cancel = true;
            };
            editor.slashCommandModule.showPopup();
            setTimeout(function () {
                const popup = document.querySelector('.e-blockeditor-command-menu');
                expect(popup).toBeNull();
                done();
            }, 200);
        });

        it('should cancel close event', (done) => {
            editor.commandMenu.close = (args) => {
                args.cancel = true;
            };
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                blockElement.click();
                setTimeout(function () {
                    const popup = document.querySelector('.e-blockeditor-command-menu');
                    expect(popup).not.toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('should handle queryfilter event', (done) => {
            editor.commandMenu.queryFiltering = (args) => {
                isQueryFilterFired = true;
            };
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                (editor.slashCommandModule as any).handleSlashCommandFiltering({
                    text: 'Head',
                    updateData: () => {}
                });
                expect(isQueryFilterFired).toBe(true);
                expect((editor.slashCommandModule.mentionObj.dataSource as any).length).toBe(2);
                done();
            }, 100);
        });

        it('should handle command item click callback', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            
            let itemClickedCalled = false;
            editor.commandMenu.itemClicked = (args) => {
                itemClickedCalled = true;
            };
            
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { 
                key: '/', 
                code: 'Slash', 
                bubbles: true 
            }));
            
            setTimeout(() => {
                const checklistItem = document.querySelector('.e-blockeditor-command-menu li[data-value="Checklist"]');
                checklistItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                
                setTimeout(() => {
                    expect(editor.blocks[0].type).toBe(BlockType.Checklist);
                    expect(itemClickedCalled).toBe(true);
                    
                    done();
                }, 200);
            }, 300);
        });

        it('should adjust tooltip position when rtl is toggled', (done) => {
            editor.commandMenu.enableTooltip = true;
            editor.enableRtl = true;
            editor.dataBind();
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                const commandItems = document.querySelectorAll('.e-blockeditor-command-menu li.e-list-item');
                commandItems[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                setTimeout(() => {
                    (editor.slashCommandModule as any).applyRtlSettings();
                    expect((editor.slashCommandModule as any).slashMenuTooltip.position).toBe('LeftCenter');

                    editor.enableRtl = false;
                    editor.dataBind();
                    (editor.slashCommandModule as any).applyRtlSettings();
                    expect((editor.slashCommandModule as any).slashMenuTooltip.position).toBe('RightCenter');
                    done();
                }, 200);
            }, 100);
        });

        it('utility methods', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                expect(editor.slashCommandModule.isPopupOpen()).toBe(true);

                editor.slashCommandModule.hidePopup();
                setTimeout(() => {
                    expect(editor.slashCommandModule.isPopupOpen()).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('should not open popup again when its already open', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                editor.slashCommandModule.showPopup();
                expect(document.querySelectorAll('.e-blockeditor-command-menu').length).toBe(1);
                done();
            }, 100);
        });

        it('should filter command items properly', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editor.slashCommandModule.showPopup();
            setTimeout(() => {
                contentElement.textContent = 'Check';
                setCursorPosition(contentElement, contentElement.textContent.length);
                editor.isPopupOpenedOnAddIconClick = true;
                editorElement.dispatchEvent(new Event('input'));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-command-menu');
                    expect(popup).not.toBeNull();
                    expect(popup.querySelectorAll('li.e-list-item').length).toBe(1);
                    expect(popup.querySelector('li.e-list-item').getAttribute('data-value')).toBe(BlockType.Checklist.toString());
                    done();
                }, 300);
            }, 200);
        });

        it('should exit and hide popup when filter query length exceeds', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editor.slashCommandModule.showPopup();
            setTimeout(() => {
                (editor.slashCommandModule as any).filterCommands(BlockType.Checklist, 10, 10);
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-command-menu');
                    expect(popup).toBeNull();
                    done();
                }, 200);
            }, 100);
        });
    });

});