import { createElement, remove } from '@syncfusion/ej2-base';
import { createEditor } from '../common/util.spec';
import { BlockModel, CommandItemModel, IHeadingBlockSettings } from '../../src/models/index';
import { setCursorPosition, getBlockContentElement } from '../../src/common/utils/index';
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

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
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }]
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
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const headingElement = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
            expect(headingElement).not.toBeNull();
            headingElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            modelBlocks = editor.blocks;
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(domBlocks.length).toBe(1);
            const headingEle = editorElement.querySelector('.e-block').querySelector('h1') as HTMLElement;   
            expect(headingEle).not.toBeNull(); // h1 should exist
            expect(headingEle.textContent).toBe('Hello world'); // h1 should contain correct text
            expect(headingEle.tagName).toBe('H1'); 
            expect(headingEle.textContent).toBe('Hello world');
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            done();
        });

        it('transforming heading to quote', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const quoteElement = slashCommandElement.querySelector('li[data-value="Quote"]') as HTMLElement;
            expect(quoteElement).not.toBeNull();
            quoteElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
            const blockquoteElement = editorElement.querySelector('.e-block').querySelector('blockquote') as HTMLElement;
            expect(blockquoteElement.textContent).toBe('Hello world');
            expect(blockquoteElement).not.toBeNull();
            expect(blockquoteElement.tagName).toBe('BLOCKQUOTE');
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            done();
        });

        it('transforming quote to bullet list', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click heading li element inside the popup
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            const bulletBlock = editorElement.querySelector('.e-block') as HTMLElement;
            const listElement = bulletBlock.querySelector('ul') as HTMLElement;
            const listItem = listElement.querySelector('li') as HTMLElement;      
            expect(listElement).not.toBeNull(); // UL should exist
            expect(listItem).not.toBeNull();
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Hello world');
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            done();
        });

        it('transforming to divider when content is present', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = 'Hello world /';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click divider li element inside the popup
            const dividerLiElement = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
            expect(dividerLiElement).not.toBeNull();
            dividerLiElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(domBlocks.length).toBe(3);
            // Should create new divider block since content is present in the current block
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(editorElement.querySelector('.e-block').querySelector('p').textContent).toBe('Hello world ');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(modelBlocks[0].content[0].content).toBe('Hello world ');
            //Ensure focus is in next sibling of divider
            expect(editor.blockManager.currentFocusedBlock.id).toBe(modelBlocks[2].id);
            done();
        });

        it('transforming to divider when content is empty', (done) => {
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click divider li element inside the popup
            const dividerLiElement = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
            expect(dividerLiElement).not.toBeNull();
            dividerLiElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // Current bullet list block should be replaced with divider block since content is empty
            expect(modelBlocks[0].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks.length).toBe(2);
            expect(domBlocks.length).toBe(2);
            expect(editorElement.querySelector('.e-block').querySelector('p')).toBeNull();
            expect(domBlocks[0].querySelector('hr')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull();
            expect(modelBlocks[0].content.length).toBe(0);
            //Ensure focus is in next sibling of divider
            expect(editor.blockManager.currentFocusedBlock.id).toBe(modelBlocks[1].id);
            done();
        });
        
        it('transforming to collapsible when content is empty', (done) => {
            const newBlock: BlockModel = {
                id: 'paragraph2',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content2', contentType: ContentType.Text, content: '' }
                ]
            };
            editor.addBlock(newBlock, 'paragraph1', true);
            const blockElements = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
            const blockElement = blockElements[1];
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click collapsible paragraph li element inside the popup
            const collapsibleParaEle = slashCommandElement.querySelector('li[data-value="Collapsible Paragraph"]') as HTMLElement;
            expect(collapsibleParaEle).not.toBeNull();
            collapsibleParaEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(domBlocks.length).toBe(4);  //including child
            // Current bullet list block should be replaced with CollapsibleParagraph block since content is empty
            expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks[1].getAttribute('data-block-type')).toBe('CollapsibleParagraph'); 
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].classList.contains('e-toggle-block')).toBe(true);
            done();
        });

        it('transforming to callout when content is empty', (done) => {
            const newBlock: BlockModel = {
                id: 'paragraph2',
                blockType: BlockType.Paragraph,
                content: [
                    { id: 'content2', contentType: ContentType.Text, content: '' }
                ]
            };
            editor.addBlock(newBlock, 'paragraph1', true);
            const blockElements = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
            const blockElement = blockElements[1];
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // click callout li element inside the popup
            const calloutEle = slashCommandElement.querySelector('li[data-value="Callout"]') as HTMLElement;
            expect(calloutEle).not.toBeNull();
            calloutEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(3);
            expect(domBlocks.length).toBe(4);  //children included
            // Current bullet list block should be replaced with callout block since content is empty
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks[1].classList.contains('e-callout-block')).toBe(true);
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            done();
        });

        it('should execute command with keyboard shortcut', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            
            // Simulate the keyboard shortcut
            const keyEvent = new KeyboardEvent('keydown', {
                key: '1',
                code: 'Digit1',
                ctrlKey: true,
                altKey: true,
                bubbles: true
            });
            
            
            editor.element.dispatchEvent(keyEvent);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1); 
            expect(domBlocks.length).toBe(1); 
            // Check if block has been transformed
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            const headingBlock = editorElement.querySelector('.e-block') as HTMLElement;
            const headingElement = headingBlock.querySelector('h1') as HTMLElement;
            expect(headingElement).not.toBeNull();
            expect(headingElement.tagName).toBe('H1');
            done();
        });
        
        it('should filter commands and show filtered results', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            // Open slash command popup
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/head';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
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
            editor.blockManager.setFocusToBlock(blockElement);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
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
        
        it('should update popup properties when commandMenuSettings properties change', (done) => {
            
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { 
                key: '/', 
                code: 'Slash', 
                bubbles: true 
            }));
            editor.commandMenuSettings.popupWidth = '400px';
            editor.commandMenuSettings.popupHeight = '400px';
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-command-menu.e-popup');
                // once onprop change for slash command is fixed can uncomment below lines
                /* 981088 */
                const popupWidth = (popup as HTMLElement).style.width;
                const popupHeight = (popup as HTMLElement).style.maxHeight;
                
                // expect(popupWidth).toBe('400px');
                // expect(popupHeight).not.toBe('400px');
                done();
            }, 100);
        });
        
        it('should change commands when commandMenuSettings.commands is updated', (done) => {
            const customCommand: CommandItemModel = {
                label: 'Custom Command',
                type: BlockType.Paragraph,
                iconCss: 'e-custom-icon',
                tooltip: 'Custom tooltip'
            };
            
            editor.commandMenuSettings.commands = [customCommand];
            
            // Open popup
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/custom';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
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
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/';
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
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
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ 
                blocks: blocks,
                commandMenuSettings: {
                    commands: [
                        {
                            id: 'checklist-command',
                            type: BlockType.Checklist,
                            groupBy: 'General',
                            label: 'Checklist',
                            tooltip: 'Create a checklist',
                            iconCss: 'e-icons e-check-box',
                        },
                        {
                            id: 'bullet-list-command',
                            type: BlockType.BulletList,
                            groupBy: 'General',
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

        it('should handle args.cancel for tooltip properly', (done) => {
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
            spyOn(editor.blockManager.blockCommand, 'handleBlockTransformation').and.callThrough();
            (editor.blockManager.slashCommandModule as any).transformBlocks({
                type: null
            });

            expect(editor.blockManager.blockCommand.handleBlockTransformation).not.toHaveBeenCalled();
            done();
        });

        it('should handle queryfilter event', (done) => {
            editor.commandMenuSettings.filtering = (args) => {
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
            editor.blockManager.setFocusToBlock(blockElement);
            let itemClickedCalled = false;
            editor.commandMenuSettings.itemSelect = (args) => {
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
                    expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
                    const checklistBlock = editorElement.querySelector('.e-block[data-block-type="Checklist"]');
                    expect(checklistBlock).not.toBeNull();
                    expect(itemClickedCalled).toBe(true);
                    
                    done();
                }, 200);
            }, 300);
        });

        it('should adjust tooltip position when rtl is toggled', (done) => {
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
                expect(editor.blockManager.slashCommandModule.isPopupOpen()).toBe(true);

                editor.blockManager.slashCommandModule.hidePopup();
                setTimeout(() => {
                    expect(editor.blockManager.slashCommandModule.isPopupOpen()).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('should not open popup again when its already open', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            triggerSlashPopupOpen(blockElement, editorElement);
            setTimeout(() => {
                editor.blockManager.slashCommandModule.showPopup();
                expect(document.querySelectorAll('.e-blockeditor-command-menu').length).toBe(1);
                done();
            }, 100);
        });

        it('should filter command items properly', (done) => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editor.blockManager.slashCommandModule.showPopup();
            setTimeout(() => {
                contentElement.textContent = 'Check';
                setCursorPosition(contentElement, contentElement.textContent.length);
                editor.blockManager.isPopupOpenedOnAddIconClick = true;
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
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            editor.blockManager.slashCommandModule.showPopup();
            setTimeout(() => {
                (editor.blockManager.slashCommandModule as any).filterCommands(BlockType.Checklist, 10, 10);
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-command-menu');
                    expect(popup).toBeNull();
                    done();
                }, 200);
            }, 100);
        });
    });

});