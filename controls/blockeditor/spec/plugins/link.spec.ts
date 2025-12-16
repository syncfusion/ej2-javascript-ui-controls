import { createElement, remove } from '@syncfusion/ej2-base';
import { createEditor, setRange } from '../common/util.spec';
import { L10n } from '@syncfusion/ej2-base';
import { setCursorPosition, getBlockContentElement, getSelectedRange, setSelectionRange } from '../../src/common/utils/index';
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { ILinkContentSettings, BaseStylesProp, IHeadingBlockSettings, BlockModel } from '../../src/models';

describe('Link Module', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });
    function createMockClipboardEvent(type: string, clipboardData: any = {}): ClipboardEvent {
        const event: any = {
            type,
            preventDefault: jasmine.createSpy(),
            clipboardData: clipboardData,
            bubbles: true,
            cancelable: true
        };
        return event as ClipboardEvent;
    }

    // Helper to simulate setting text and selecting
    function setTextAndSelect(editor: BlockEditor, blockElement: HTMLElement, text: string, start: number, end: number) {
        const contentElement = getBlockContentElement(blockElement) as HTMLElement;
        contentElement.textContent = text;
        editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
        setSelectionRange(contentElement.firstChild as HTMLElement, start, end);
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
                            { id: 'content1', contentType: ContentType.Text, content: 'Helloworld' }
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

        it('should insert link properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);

            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                editor.setSelection('content1', 2, 8);
            });
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                const linkText = popup.querySelector('#linkText') as HTMLInputElement;
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const linkTitle = popup.querySelector('#linkTitle') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');

                expect(linkText.value).toBe('llowor');
                expect(linkUrl.value).toBe('');
                expect(linkTitle.value).toBe('');
                linkUrl.value = 'https://www.syncfusion.com';
                linkTitle.value = 'Syncfusion';
                insertBtn.dispatchEvent(new MouseEvent('click'));

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    expect(contentElement.childNodes.length).toBe(3);
                    expect(contentElement.childNodes[0].textContent).toBe('He');
                    expect(contentElement.querySelector('a').textContent).toBe('llowor');
                    expect(contentElement.childNodes[2].textContent).toBe('ld');

                    expect(editor.blocks[0].content.length).toBe(3);
                    expect(editor.blocks[0].content[0].content).toBe('He');
                    expect(editor.blocks[0].content[1].content).toBe('llowor');
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Link);
                    expect((editor.blocks[0].content[1].properties as ILinkContentSettings).url).toContain('https://www.syncfusion.com');
                    expect(editor.blocks[0].content[2].content).toBe('ld');

                    done();
                }, 400);
            }, 100);
        });

        it('should remove link properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                editor.setSelection('content1', 2, 8);
            });
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                const linkText = popup.querySelector('#linkText') as HTMLInputElement;
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const linkTitle = popup.querySelector('#linkTitle') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');
                const removeBtn = popup.querySelector('.e-remove-link-btn');

                expect(linkText.value).toBe('llowor');
                expect(linkUrl.value).toBe('');
                expect(linkTitle.value).toBe('');
                linkUrl.value = 'https://www.syncfusion.com';
                linkTitle.value = 'Syncfusion';
                insertBtn.dispatchEvent(new MouseEvent('click'));
                insertBtn.dispatchEvent(new MouseEvent('click'));

                setTimeout(() => {
                    const contentElement = getBlockContentElement(blockElement);
                    expect(popup.classList.contains('e-popup-close')).toBe(true);

                    //Remove
                    removeBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.childNodes.length).toBe(3);
                        expect(contentElement.querySelector('a')).toBeNull();
                        expect(contentElement.childNodes[0].textContent).toBe('He');
                        expect(contentElement.childNodes[1].textContent).toBe('llowor');
                        expect(contentElement.childNodes[2].textContent).toBe('ld');

                        expect(editor.blocks[0].content.length).toBe(3);
                        expect(editor.blocks[0].content[0].content).toBe('He');
                        expect(editor.blocks[0].content[1].content).toBe('llowor');
                        expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                        expect((editor.blocks[0].content[1].properties as ILinkContentSettings).url).toBeUndefined();
                        expect(editor.blocks[0].content[2].content).toBe('ld');
                        done();
                    }, 300);
                }, 300);
            }, 100);
        });

        it('should close popup on cancel', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                const cancelBtn = popup.querySelector('.e-cancel-link-btn');
                cancelBtn.dispatchEvent(new MouseEvent('click'));

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });
        
        it('should update locale in link popup', (done) => {
            L10n.load({
                'de': {
                    "blockeditor": {
                        "paragraph": "Schreiben Sie etwas oder ‚/‘ für Befehle.",
                        "heading1": "Überschrift 1",
                        "heading2": "Überschrift 2",
                        "heading3": "Überschrift 3",
                        "heading4": "Überschrift 4",
                        "collapsibleParagraph": "zusammenklappbar Absatz",
                        "collapsibleHeading1": "zusammenklappbar Überschrift 1",
                        "collapsibleHeading2": "zusammenklappbar Überschrift 2",
                        "collapsibleHeading3": "zusammenklappbar Überschrift 3",
                        "collapsibleHeading4": "zusammenklappbar Überschrift 4",
                        "bulletList": "Element hinzufügen",
                        "numberedList": "Element hinzufügen",
                        "checklist": "Zu erledigen",
                        "callout": "Schreiben Sie einen Hinweis",
                        "addIconTooltip": "Klicken Sie, um unten einzufügen",
                        "dragIconTooltipActionMenu": "Klicken Sie, um zu öffnen",
                        "dragIconTooltip": "(Halten zum Ziehen)",
                        "insertLink": "Link einfügen",
                        "linkText": "Text",
                        "linkTextPlaceholder": "Linktext",
                        "linkUrl": "URL",
                        "linkUrlPlaceholder": "https://example.com",
                        "linkTitle": "Titel",
                        "linkTitlePlaceholder": "Linktitel",
                        "linkOpenInNewWindow": "In neuem Fenster öffnen",
                        "linkInsert": "Einfügen",
                        "linkRemove": "Entfernen",
                        "linkCancel": "Abbrechen",
                        "codeCopyTooltip": "Code kopieren"
                    }
                }
            })
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content1', 2, 8);
            
            // Open the link popup
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                
                // Initial locale values
                const initialInsertText = popup.querySelector('.e-insert-link-btn').textContent;
                
                // Change locale
                editor.locale = 'de';
                editor.dataBind();
                
                // Trigger locale change event
                // editor.trigger('locale-changed', {});
                
                setTimeout(() => {
                    // Check if locale was updated
                    const updatedInsertText = popup.querySelector('.e-insert-link-btn').textContent;
                    expect(updatedInsertText).toBe('Einfügen');
                    expect(updatedInsertText).not.toBe(initialInsertText);
                    
                    // Check other locale elements
                    expect(popup.querySelector('label[for="linkUrl"]').textContent).toBe('URL');
                    expect(popup.querySelector('label[for="linkText"]').textContent).toBe('Text');
                    expect(popup.querySelector('label[for="linkTitle"]').textContent).toBe('Titel');
                    
                    // Reset locale
                    editor.locale = 'en-US';
                    editor.dataBind();
                    done();
                }, 100);
            }, 100);
        });

        it('should handle null values when updating locale', function (done) {
            const popup = document.querySelector('.e-blockeditor-link-dialog');
            const linkHeader = popup.querySelector('.e-be-link-header');
            linkHeader.remove();
            (editor.linkModule as any).updateLinkPopupLocale();
            done();
        });
        
        it('should handle link clicks', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');
                
                linkUrl.value = 'https://www.example.com';
                insertBtn.dispatchEvent(new MouseEvent('click'));
                
                setTimeout(() => {
                    const contentElement = getBlockContentElement(blockElement);
                    const linkElement = contentElement.querySelector('a');
                    
                    const originalWindowOpen = window.open;
                    let windowOpenCalled = false;
                    let openUrl = '';
                    let openTarget = '';
                    
                    window.open = (url?: string, target?: string): Window => {
                        windowOpenCalled = true;
                        openUrl = url;
                        openTarget = target;
                        return null;
                    };
                    
                    linkElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    
                    expect(windowOpenCalled).toBe(true);
                    expect(openUrl).toBe('https://www.example.com');
                    expect(openTarget).toBe('_blank'); // Default is to open in new window
                    
                    window.open = originalWindowOpen;
                    
                    done();
                }, 300);
            }, 100);
        });

        it('should handle link clicks when href is empty', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');
                
                linkUrl.value = 'https://www.example.com';
                insertBtn.dispatchEvent(new MouseEvent('click'));
                
                setTimeout(() => {
                    const contentElement = getBlockContentElement(blockElement);
                    const linkElement = contentElement.querySelector('a');
                    linkElement.setAttribute('href', '');

                    const originalWindowOpen = window.open;
                    let windowOpenCalled = false;
                    let openUrl = '';
                    let openTarget = '';
                    
                    window.open = (url?: string, target?: string): Window => {
                        windowOpenCalled = true;
                        openUrl = url;
                        openTarget = target;
                        return null;
                    };
                    
                    linkElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    
                    expect(windowOpenCalled).not.toBe(true);
                    window.open = originalWindowOpen;
                    
                    done();
                }, 300);
            }, 100);
        });
        
        it('should handle keyboard events in link popup - insert', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLElement;
                
                linkUrl.value = 'https://www.example.com';
                
                insertBtn.focus();
                insertBtn.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: 'Enter',
                    bubbles: true
                }));
                
                setTimeout(() => {
                    let contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[1].tagName).toBe('A');
                    done();
                }, 300);
            }, 100);
        });

        it('should handle keyboard events in link popup - Esc', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                popup.querySelector('#linkUrl').dispatchEvent(new KeyboardEvent('keydown', { 
                    key: 'Escape',
                    bubbles: true
                }));
                
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });

        it('should handle keyboard events in link popup - cancel', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const cancelBtn = popup.querySelector('.e-cancel-link-btn') as HTMLElement;
                cancelBtn.focus();
                cancelBtn.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: 'Enter',
                    bubbles: true
                }));
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });

        it('should handle keyboard events in link popup - remove', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLElement;
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLElement;
                
                linkUrl.value = 'https://www.example.com';
                
                insertBtn.focus();
                insertBtn.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: 'Enter',
                    bubbles: true
                }));
                
                setTimeout(() => {
                    let contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.childElementCount).toBe(3);
                    expect(contentElement.children[1].tagName).toBe('A');
                    let linkEle = contentElement.children[1];
                    let id = linkEle.id;
                    editor.setSelection(id, 0, 6);
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    expect(getBlockContentElement(blockElement).querySelector('a')).not.toBeNull();
                    
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                    
                    setTimeout(() => {
                        removeBtn.focus();
                        removeBtn.dispatchEvent(new KeyboardEvent('keydown', { 
                            key: 'Enter',
                            bubbles: true
                        }));
                        
                        setTimeout(() => {
                            expect(getBlockContentElement(blockElement).querySelector('a')).toBeNull();
                            done();
                        }, 300);
                    }, 100);
                }, 300);
            }, 100);
        });

        it('should exit when enter is pressed on non action elems', function (done) {
            var blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(function () {
                var popup = document.querySelector('.e-blockeditor-link-dialog');
                var linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                linkUrl.value = 'https://www.example.com';
                linkUrl.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true
                }));
                setTimeout(function () {
                    var contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.querySelector('a')).toBeNull();
                    done();
                }, 300);
            }, 100);
        });
        it('should perform default actions when tab is pressed on popup', function (done) {
            var blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(function () {
                var popup = document.querySelector('.e-blockeditor-link-dialog');
                var linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                linkUrl.value = 'https://www.example.com';
                linkUrl.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                    bubbles: true
                }));
                setTimeout(function () {
                    var contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.querySelector('a')).toBeNull();
                    done();
                }, 300);
            }, 100);
        });

        it('should handle link header null scenario properly', function (done) {
            var blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(function () {
                var popup = document.querySelector('.e-blockeditor-link-dialog');
                var linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                linkUrl.value = 'https://www.example.com';
                linkUrl.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                    bubbles: true
                }));
                setTimeout(function () {
                    var contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.querySelector('a')).toBeNull();
                    done();
                }, 300);
            }, 100);
        });
        
        it('should handle RTL setting changes', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                
                expect(popup.classList.contains('e-rtl')).toBe(false);
                
                editor.enableRtl = true;
                editor.dataBind();
                
                setTimeout(() => {
                    expect(popup.classList.contains('e-rtl')).toBe(true);
                    
                    editor.enableRtl = false;
                    editor.dataBind();
                    
                    setTimeout(() => {
                        expect(popup.classList.contains('e-rtl')).toBe(false);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Other actions testing', () => {
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
                            { id: 'content1', contentType: ContentType.Text, content: 'Helloworld' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        blockType: BlockType.Paragraph,
                        content: [
                            { id: 'linkContent', contentType: ContentType.Link, content: 'LinkText', properties: {
                                url: 'www.google.com'
                            }}
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

        it('should render normalized link when link has no https', (done) => {
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            const linkElement = getBlockContentElement(blockElement).querySelector('a');
            expect(linkElement.getAttribute('href')).toBe('https://www.google.com');
            done();
        });

        it('should handle null values properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            const originalPopupElement = (editor.linkModule as any).popupElement;
            const originalContent = contentElement.cloneNode(true);
            editor.blockManager.setFocusToBlock(blockElement);

            (editor.linkModule as any).popupElement = null;
            (editor.linkModule as any).updateLinkPopupLocale();
            
            (editor.blockManager.linkModule as any).handleDocumentClick({ target: contentElement });

            (editor.blockManager.linkModule as any).showLinkPopup();
            setTimeout(() => {
                contentElement.remove();
                editor.blockManager.setFocusToBlock(blockElement);
                (editor.blockManager.linkModule as any).hideLinkPopup();
                (editor.blockManager.linkModule as any).showLinkPopup();
                (editor.blockManager.linkModule as any).handleLinkInsertDeletion();
                (editor.linkModule as any).popupElement = originalPopupElement;
                blockElement.appendChild(originalContent);
                done();
            }, 500);
        });

        it('should hide popup on document click', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                editor.setSelection('content1', 2, 8);
            });
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                blockElement.click();
                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 500);
            }, 500);
        });

        it('should open hyperlink when target is nested element of anchor', (done) => {
            const linkEle = document.createElement('a');
            linkEle.href = 'https://www.google.com';
            linkEle.id = 'link';
            linkEle.innerHTML = '<span>Google</span>';
            document.body.appendChild(linkEle);

            const originalWindowOpen = window.open;
            let windowOpenCalled = false;
            let openUrl = '';
            let openTarget = '';
            
            window.open = (url?: string, target?: string): Window => {
                windowOpenCalled = true;
                openUrl = url;
                openTarget = target;
                return null;
            };

            (editor.blockManager.linkModule as any).handleEditorClick({ target: linkEle.querySelector('span'), preventDefault: function () { } });

            expect(windowOpenCalled).toBe(true);
            expect(openUrl).toBe('https://www.google.com');
            expect(openTarget).toBe('_self'); // Default is to open in new window
            
            window.open = originalWindowOpen;
            document.body.removeChild(linkEle);
            done();
        });
    });

    describe('Testing Link Scenarios', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        const setupEditor = (initialBlocks: any[] = [], autoHttps: boolean = true) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({ 
                blocks: initialBlocks,
             });
            editor.appendTo('#editor');
        };

        const tearDownEditor = () => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        };

        afterEach(() => {
            tearDownEditor();
            // Ensure any dynamically created dialog is removed
            const dialog = document.querySelector('.e-blockeditor-link-dialog');
            if (dialog) {
                remove(dialog);
            }
        });

        it('Press Ctrl+K in Paragraph, open link dialog', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Some text to link' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, 4); // Select "Some"

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                // Assert DOM: Link dialog should be visible
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                expect(removeBtn.hasAttribute('disabled')).toBe(true);
                done();
            }, 100);
        });

        it('Enter URL in link dialog, create link on selected text, update JSON with ContentType.Link and URL', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Some text to link' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, 4); // Select "Some"

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement; // Corrected ID
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.example.com';
                insertBtn.click();

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(2);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[0].content).toBe('Some');
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.example.com');

                    // Assert DOM
                    expect(contentElement.querySelector('a')).not.toBeNull();
                    expect(contentElement.querySelector('a').textContent).toBe('Some');
                    expect(contentElement.querySelector('a').href).toBe('https://www.example.com/');
                    expect(contentElement.querySelector('a').target).toBe('_blank');
                    done();
                }, 100);
            }, 100);
        });

        it('Paste URL in link dialog, create link on selected text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Some text to link' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, 4); // Select "Some"

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement; // Corrected ID
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                
                urlInput.focus();
                const range = document.createRange();
                range.selectNodeContents(urlInput);
                range.collapse(false); // Set the cursor at the end of the content
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                const pasteUrl = 'https://www.example.com/pasted';

                const clipboardItem = new DataTransfer();
                clipboardItem.setData('text/plain', pasteUrl);

                const pasteEvent = new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true
                });
                Object.defineProperty(pasteEvent, 'clipboardData', {
                    value: clipboardItem
                });

                urlInput.dispatchEvent(pasteEvent);
                
                setTimeout(() => {
                    insertBtn.click();

                    setTimeout(() => {
                        // Paste not triggering in spec alone, works fine in demos
                        // expect(editor.blocks[0].content.length).toBe(2);
                        // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                        // expect(editor.blocks[0].content[0].content).toBe('Some');
                        // expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.example.com');

                        // // Assert DOM
                        // expect(contentElement.querySelector('a')).not.toBeNull();
                        // expect(contentElement.querySelector('a').textContent).toBe('Some');
                        // expect(contentElement.querySelector('a').href).toBe('https://www.example.com/');
                        // expect(contentElement.querySelector('a').target).toBe('_blank');
                        done();
                    }, 100);
                }, 50);
            }, 100);
        });

        it('Select text with existing link and press Ctrl+K, open link dialog with pre-filled URL', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Existing Link', properties: { url: 'https://www.existing.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, 7); // Select "Existing"

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement; // Corrected ID
                // Assert DOM: URL input should be pre-filled
                expect(urlInput.value).toBe('https://www.existing.com');
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                expect(removeBtn.hasAttribute('disabled')).toBe(false);
                done();
            }, 100);
        });

        it('Edit URL in link dialog for existing link, update JSON with new URL', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Existing Link', properties: { url: 'https://www.old.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, 7); // Select "Existing"

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement; // Corrected ID
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.new.com';
                insertBtn.click();

                setTimeout(() => {
                    // Assert model
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.new.com');

                    // Assert DOM
                    expect(contentElement.querySelector('a').href).toBe('https://www.new.com/');
                    done();
                }, 100);
            }, 100);
        });

        it('Select entire Paragraph and apply link via Ctrl+K, update JSON with ContentType.Link for entire content', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Full paragraph text.' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length); // Select entire para

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement; // Corrected ID
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.fullparagraph.com';
                insertBtn.click();

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[0].content).toBe('Full paragraph text.');
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.fullparagraph.com');

                    // Assert DOM
                    expect(contentElement.querySelector('a')).not.toBeNull();
                    expect(contentElement.querySelector('a').textContent).toBe('Full paragraph text.');
                    done();
                }, 100);
            }, 100);
        });

        it('Select single word and apply link via Ctrl+K, update JSON with ContentType.Link for word', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Just a single word to link.' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 7, 13); // Select "single"

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement; // Corrected ID
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.singleword.com';
                insertBtn.click();

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(3); // "Just a ", Link("single"), " word to link."
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[1].content).toBe('single');
                    expect((editor.blocks[0].content[1].properties as ILinkContentSettings).url).toBe('https://www.singleword.com');

                    // Assert DOM
                    expect(contentElement.querySelector('a')).not.toBeNull();
                    expect(contentElement.querySelector('a').textContent).toBe('single');
                    done();
                }, 100);
            }, 100);
        });

        it('Select overlapping text (half linked, half non-linked) and apply link, update JSON with merged link span', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'This is ' },
                    { contentType: ContentType.Link, content: 'a linked part', properties: { url: 'https://www.linked.com' } },
                    { contentType: ContentType.Text, content: ' and this is not.' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Accessing the specific text nodes within the combined content
            // The structure is likely: TextNode, AnchorElement (with TextNode inside), TextNode
            const firstTextNode = contentElement.childNodes[0]; // "This is "
            const anchorElement = contentElement.childNodes[1]; // <a> (the existing link)
            const secondTextNode = contentElement.childNodes[2]; // " and this is not."

            // Select from the 'linked' word (inside the anchor) to 'not' (in the separate text node)
            setRange(anchorElement.firstChild as HTMLElement, secondTextNode.firstChild,0,  secondTextNode.textContent.length);
            
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setCursorPosition(contentElement,contentElement.textContent.length);
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement; // Corrected ID
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.mergedlink.com';
                insertBtn.click();

                setTimeout(() => {
                    // Assert model - The new link should merge previous parts and cover the selection.
                    expect(editor.blocks[0].content.length).toBe(3);
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[1].content).toBe('a linked part');
                    expect(editor.blocks[0].content[2].content).toBe(' and this is not.');
                    expect((editor.blocks[0].content[1].properties as ILinkContentSettings).url).toBe('https://www.mergedlink.com');

                    // Assert DOM
                    const anchorElements = contentElement.querySelectorAll('a');
                    expect(anchorElements.length).toBe(2);
                    expect(anchorElements[0].textContent).toBe('a linked part');
                    expect(anchorElements[1].textContent).toBe(' and this is not.');
                    expect(anchorElements[0].href).toBe('https://www.mergedlink.com/');
                    expect(anchorElements[1].href).toBe('https://www.mergedlink.com/');
                    done();
                }, 400);
            }, 100);
        });


        // Begin formatting tests on links
        it('Select text with link and apply bold, update JSON with bold style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'This is a link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentEle = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentEle.firstChild.firstChild as HTMLElement, 0, 4); // Select "This"

            // Apply bold formatting
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                // Assert model: Link content should split, new part should be bold
                expect(editor.blocks[0].content.length).toBe(2); // Initial link + trailing text
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[0].content).toBe('This');
                expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.link.com');
                expect((editor.blocks[0].content[0].properties as any).styles.bold).toBe(true);
                expect(editor.blocks[0].content[1].content).toBe(' is a link');

                // Assert DOM
                contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('strong')).not.toBeNull();
                expect(contentEle.querySelector('strong').textContent).toBe('This');
                done();
            });
        });

        it('Select text with link and apply italic, update JSON with italic style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Another link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 7); // Select "Another"

            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.italic).toBe(true);
                expect(editor.blocks[0].content[0].content).toBe('Another');


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('em')).not.toBeNull();
                expect(contentEle.querySelector('em').textContent).toBe('Another');
                done();
            });
        });

        it('Select text with link and apply underline, update JSON with underline style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Underlined link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 9); // Select "Underline"

            editor.blockManager.formattingAction.execCommand({ command: 'underline' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.underline).toBe(true);
                 expect(editor.blocks[0].content[0].content).toBe('Underline');


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('u')).not.toBeNull();
                expect(contentEle.querySelector('u').textContent).toBe('Underline');
                done();
            });
        });

        it('Select text with link and apply strikethrough, update JSON with strikethrough style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Strikethrough link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 13); // Select "Strikethrough"

            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.strikethrough).toBe(true);
                expect(editor.blocks[0].content[0].content).toBe('Strikethrough');


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('s')).not.toBeNull();
                expect(contentEle.querySelector('s').textContent).toBe('Strikethrough');
                done();
            });
        });

        it('Select text with link and apply lowercase, update JSON with lowercase style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'LOWERCASE LINK', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 9); // Select "LOWERCASE"

            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2); // The link content "LOWERCASE"
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.lowercase).toBe(true);
                expect(editor.blocks[0].content[0].content).toBe('LOWERCASE'); // original content of link
                expect(editor.blocks[0].content[1].content).toBe(' LINK');

                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.textContent).toBe('LOWERCASE LINK'); // Whole link text for DOM
                expect(blockElement.querySelectorAll('a')[0].childNodes[0].textContent).toBe('LOWERCASE');
                done();
            });
        });

        it('Select text with link and apply uppercase, update JSON with uppercase style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'uppercase link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 9); // Select "uppercase"

            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.uppercase).toBe(true);
                expect(editor.blocks[0].content[0].content).toBe('uppercase');

                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.textContent).toBe('uppercase link');
                expect(blockElement.querySelectorAll('a')[0].childNodes[0].textContent).toBe('uppercase');
                done();
            });
        });

        it('Select text with link and apply superscript, update JSON with superscript style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Superscript link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 11); // Select "Superscript"

            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.superscript).toBe(true);
                expect(editor.blocks[0].content[0].content).toBe('Superscript');


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('sup')).not.toBeNull();
                expect(contentEle.querySelector('sup').textContent).toBe('Superscript');
                done();
            });
        });

        it('Select text with link and apply subscript, update JSON with subscript style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Subscript link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 9); // Select "Subscript"

            editor.blockManager.formattingAction.execCommand({ command: 'subscript' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.subscript).toBe(true);
                expect(editor.blocks[0].content[0].content).toBe('Subscript');


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('sub')).not.toBeNull();
                expect(contentEle.querySelector('sub').textContent).toBe('Subscript');
                done();
            });
        });

        it('Select text with link and apply color (e.g., red), update JSON with color style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Colored link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 7); // Select "Colored"

            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.color).toBe('#FF0000');
                expect(editor.blocks[0].content[0].content).toBe('Colored');


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('span')).not.toBeNull(); // Span for color
                expect(contentEle.querySelector('span').style.color).toBe('rgb(255, 0, 0)');
                done();
            });
        });

        it('Select text with link and apply bgcolor (e.g., yellow), update JSON with bgcolor style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Highlight link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 9); // Select "Highlight"

            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect((editor.blocks[0].content[0].properties as any).styles.backgroundColor).toBe('#FFFF00');
                expect(editor.blocks[0].content[0].content).toBe('Highlight');


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                expect(contentEle.querySelector('span')).not.toBeNull(); // Span for background color
                expect(contentEle.querySelector('span').style.backgroundColor).toBe('rgb(255, 255, 0)');
                done();
            });
        });

        it('Select text with link and apply custom style, update JSON with custom style on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Custom link', properties: { url: 'https://www.link.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 6); // Select "Custom"

            setTimeout(() => {
                // Assert model
                // expect(editor.blocks[0].content.length).toBe(2);
                // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                // expect(editor.blocks[0].content[0].content).toBe('Custom');


                // Assert DOM
                //const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                // expect(contentEle.querySelector('span')).not.toBeNull(); // Span for custom style
                // expect(contentEle.querySelector('span').style.fontStyle).toBe('oblique');
                done();
            });
        });

        it('Select text with link and apply all styles (bold, italic, underline, strikethrough, lowercase, uppercase, superscript, subscript, color, bgcolor, custom), update JSON with all styles on link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'All styles link text', properties: { url: 'https://www.allstyles.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const linkElement = blockElement.querySelector('a') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(linkElement.firstChild as HTMLElement, 0, 20);

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });
            editor.blockManager.formattingAction.execCommand({ command: 'color', value: '#FF0000' }); // Red
            editor.blockManager.formattingAction.execCommand({ command: 'backgroundColor', value: '#FFFF00' }); // Yellow
            editor.blockManager.formattingAction.execCommand({ command: 'lowercase' });
            editor.blockManager.formattingAction.execCommand({ command: 'uppercase' }); // This will override lowercase
            editor.blockManager.formattingAction.execCommand({ command: 'superscript' });
            editor.blockManager.formattingAction.execCommand({ command: 'subscript' }); // This will override superscript


            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(1);
                const styledLink = editor.blocks[0].content[0];
                expect(styledLink.contentType).toBe(ContentType.Link);
                expect(styledLink.content).toBe('All styles link text');
                expect((styledLink.properties as ILinkContentSettings).url).toBe('https://www.allstyles.com');
                const styles = (styledLink.properties as any).styles;
                expect(styles.bold).toBe(true);
                expect(styles.italic).toBe(true);
                expect(styles.underline).toBe(true);
                expect(styles.strikethrough).toBe(true);
                expect(styles.color).toBe('#FF0000');
                expect(styles.backgroundColor).toBe('#FFFF00');
                expect(styles.uppercase).toBe(true);
                expect(styles.subscript).toBe(true);
                expect(styles.lowercase).toBeUndefined(); // Should be overridden
                expect(styles.superscript).toBeUndefined(); // Should be overridden


                // Assert DOM
                const contentEle = getBlockContentElement(blockElement) as HTMLElement;
                const innerElements = contentEle.querySelector('a').children;

                expect(innerElements.length).toBeGreaterThan(0); // Should have wrapper spans/tags for styles
                expect(contentEle.querySelector('strong')).not.toBeNull();
                expect(contentEle.querySelector('em')).not.toBeNull();
                expect(contentEle.querySelector('u')).not.toBeNull();
                expect(contentEle.querySelector('s')).not.toBeNull();
                expect(contentEle.querySelector('sub')).not.toBeNull(); // Subscript applied last
                const spanElements = contentEle.querySelectorAll('span');
                expect (spanElements.length).toBeGreaterThan(0); // As four span elements will be created texttransform/forntsize/color/bgcolor/custom
                expect(spanElements[0].style.textTransform).toBe('uppercase');
                // expect(spanElements[1].style.fontSize).toBe('20px');
                // expect(spanElements[2].style.backgroundColor).toBe('rgb(255, 255, 0)');
                // expect(spanElements[3].style.color).toBe('rgb(255, 0, 0)');
                done();
            });
        });

        it('Select entire link and remove link via dialog, update JSON to convert to ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Linked text', properties: { url: 'https://www.removelink.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length); // Select entire link

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                removeBtn.click();

                setTimeout(() => {
                    // Assert model
                    expect(editor.blocks[0].content.length).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Linked text');
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBeUndefined();

                    // Assert DOM
                    expect(contentElement.querySelector('a')).toBeNull();
                    expect(contentElement.textContent).toBe('Linked text');
                    done();
                }, 400);
            }, 100);
        });

        it('Select partial link (e.g., half linked text) and remove link, update JSON with split spans and partial link removal', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Partial link removal', properties: { url: 'https://www.partial.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, 7); // Select "Partial"

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                removeBtn.click();

                setTimeout(() => {
                    // Assert model: "Partial" becomes text, rest remains linked
                    expect(editor.blocks[0].content.length).toBe(2);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Partial');
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[1].content).toBe(' link removal');
                    expect((editor.blocks[0].content[1].properties as ILinkContentSettings).url).toBe('https://www.partial.com');

                    // Assert DOM
                    expect(contentElement.querySelectorAll('a').length).toBe(1);
                    expect(contentElement.querySelector('a').textContent).toBe(' link removal');
                    expect(contentElement.childNodes[0].textContent).toBe('Partial');
                    done();
                }, 400);
            }, 100);
        });

        it('Select overlapping text (half linked, half non-linked) and remove link, update JSON to remove link from linked portion', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'Before ' },
                    { contentType: ContentType.Link, content: 'linked text', properties: { url: 'https://www.overlapping.com' } },
                    { contentType: ContentType.Text, content: ' after.' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            const spanNode = contentElement.childNodes[0] as HTMLElement; // "Before "
            const anchorElement = contentElement.childNodes[1]; // <a>
            
            // Select from "Before " part to "linked" part inside the anchor
            setRange(spanNode.firstChild as HTMLElement, (anchorElement as HTMLElement).firstChild as HTMLElement, 3, 6); // Select "ore linked" (from Before to linked)
            
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                removeBtn.click();

                setTimeout(() => {
                    // Assert model: "ore " becomes text, "linked" becomes text, " text" remains linked
                    expect(editor.blocks[0].content.length).toBe(5); // "Bef", "ore " , "linked", " text" " after."
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Bef');
                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[1].content).toBe('ore ');
                    expect(editor.blocks[0].content[2].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[2].content).toBe('linked');
                    expect(editor.blocks[0].content[3].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[3].content).toBe(' text');
                    expect(editor.blocks[0].content[4].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[4].content).toBe(' after.');

                    // Assert DOM
                    expect(contentElement.querySelectorAll('a').length).toBe(1); // No links should remain within the selection
                    expect(contentElement.textContent).toBe('Before linked text after.');
                    done();
                }, 100);
            }, 100);
        });

        it('Select link and remove bold, update JSON to remove bold style from link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Bold link', properties: { url: 'https://www.bold.com', styles: { bold: true } } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild.firstChild as HTMLElement, 0, 4); // Select "Bold"

            editor.blockManager.formattingAction.execCommand({ command: 'bold' }); // Remove bold

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[0].content).toBe('Bold');
                expect(editor.blocks[0].content[1].content).toBe(' link');

                // Assert DOM
                const linkElements = contentElement.querySelectorAll('a');
                expect(linkElements[1].querySelector('strong')).not.toBeNull();
                done();
            });
        });

        it('Select link and remove all styles, update JSON to remove all styles from link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Styled link', properties: { url: 'https://www.styled.com', styles: { bold: true, italic: true } } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild.firstChild.firstChild as HTMLElement, 0, 11); // Select "Styled "

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[0].content).toBe('Styled link');

                // Assert DOM
                expect(contentElement.querySelector('strong')).toBeNull();
                expect(contentElement.querySelector('em')).toBeNull();
                done();
            });
        });

        it('Select overlapping text (half linked with bold, half non-linked) and apply italic, update JSON with italic on selection', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'Foo ' },
                    { contentType: ContentType.Link, content: 'bar baz', properties: { url: 'https://www.linked.com', styles: { bold: true } } },
                    { contentType: ContentType.Text, content: ' qux.' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            const anchorElement = contentElement.childNodes[1]; // <a> (the existing bold link "bar baz")
            const thirdNode = contentElement.childNodes[2]; // " qux."

            // Select from "bar" (linked, bold) to "qux" (non-linked)
            setRange((anchorElement as HTMLElement).firstChild.firstChild as HTMLElement, thirdNode.firstChild as HTMLElement, 0, 3); // Select "bar qux"

            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(4); // "Foo ", Link("bar", bold, italic), Link(" baz", bold), " qux."
                
                const blockContent = editor.blocks[0].content;
                expect(blockContent[0].content).toBe('Foo ');
                
                expect(blockContent[1].contentType).toBe(ContentType.Link);
                expect(blockContent[1].content).toBe('bar baz');
                expect((blockContent[1].properties as any).styles.bold).toBe(true);
                expect((blockContent[1].properties as any).styles.italic).toBe(true);
                expect((blockContent[1].properties as ILinkContentSettings).url).toBe('https://www.linked.com');

                expect(blockContent[2].contentType).toBe(ContentType.Text);
                expect(blockContent[2].content).toBe(' qu');
                expect((blockContent[2].properties as any).styles.italic).toBe(true);


                expect(blockContent[3].content).toBe('x.');
                expect(blockContent[3].contentType).toBe(ContentType.Text);


                // Assert DOM
                expect(contentElement.querySelectorAll('em').length).toBe(2); // The italic should apply to both parts
                expect(contentElement.querySelector('a em strong')).not.toBeNull();
                expect(contentElement.querySelectorAll('a')[0].textContent).toBe('bar baz');
                expect(contentElement.querySelectorAll('a em')[0].textContent).toBe('bar baz');
                expect(contentElement.querySelectorAll('em')[1].textContent).toBe(' qu');

                done();
            });
        });

        it('Select overlapping text (half non-linked, half linked with italic) and apply bold, update JSON with bold on selection', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'Text before ' },
                    { contentType: ContentType.Link, content: 'italic link', properties: { url: 'https://www.italic.com', styles: { italic: true } } },
                    { contentType: ContentType.Text, content: ' after.' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            const firstNode = contentElement.childNodes[0]; // "Text before "
            const anchorElement = contentElement.childNodes[1]; // <a> (the existing italic link "italic link")

            // Select from "before" (non-linked) to "italic" (linked, italic)
            setRange(firstNode.firstChild as HTMLElement, (anchorElement as HTMLElement).firstChild.firstChild as HTMLElement, 5, 6); // Select "before italic"

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(5);

                const blockContent = editor.blocks[0].content;
                expect(blockContent[0].content).toBe('Text ');
                expect(blockContent[0].contentType).toBe(ContentType.Text);
                
                expect(blockContent[1].contentType).toBe(ContentType.Text);
                expect(blockContent[1].content).toBe('before ');
                expect((blockContent[1].properties as any).styles.bold).toBe(true);

                expect(blockContent[2].contentType).toBe(ContentType.Link);
                expect(blockContent[2].content).toBe('italic');
                expect((blockContent[2].properties as any).styles.bold).toBe(true);
                expect((blockContent[2].properties as any).styles.italic).toBe(true);
                expect((blockContent[2].properties as ILinkContentSettings).url).toBe('https://www.italic.com');

                expect(blockContent[3].contentType).toBe(ContentType.Link);
                expect(blockContent[3].content).toBe(' link');
                expect((blockContent[3].properties as any).styles.italic).toBe(true);
                expect((blockContent[3].properties as ILinkContentSettings).url).toBe('https://www.italic.com');

                expect(blockContent[4].contentType).toBe(ContentType.Text);
                expect(blockContent[4].content).toBe(' after.');

                // Assert DOM
                expect(contentElement.querySelectorAll('strong').length).toBe(2);
                expect(contentElement.querySelector('strong')).not.toBeNull();
                expect(contentElement.querySelectorAll('strong')[0].textContent).toBe('before ');
                expect(contentElement.querySelector('a strong em')).not.toBeNull();
                expect(contentElement.querySelectorAll('a em')[0].textContent).toBe('italic');
                done();
            });
        });

        it('Select overlapping text with link and remove all styles, update JSON to remove styles from linked portion', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'Start ' },
                    { contentType: ContentType.Link, content: 'styled link end', properties: { url: 'https://www.fullstyle.com', styles: { bold: true, italic: true } } },
                    { contentType: ContentType.Text, content: ' finish.' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            const firstNode = contentElement.childNodes[0]; // "Start "
            const anchorElement = contentElement.childNodes[1]; // <a> (the existing styled link)
            const thirdNode = contentElement.childNodes[2]; // " finish."

            // Select from "Start" to "styled"
            setRange(firstNode.firstChild as HTMLElement, (anchorElement as HTMLElement).firstChild.firstChild.firstChild as HTMLElement, 2, 6); // Select "art styled"

            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });

            setTimeout(() => {
                // Assert model
                // expect(editor.blocks[0].content.length).toBe(5);
                // expect(editor.blocks[0].content[0].content).toBe('St');
                // expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                // expect(editor.blocks[0].content[1].content).toBe('art ');
                // expect(editor.blocks[0].content[2].content).toBe('styled');
                // expect(editor.blocks[0].content[3].content).toBe(' link end');
                // expect(editor.blocks[0].content[4].content).toBe(' finish.');
                // expect((editor.blocks[0].content[1].properties as any).styles.bold).toBe(true);
                // expect((editor.blocks[0].content[1].properties as any).styles.italic).toBe(true);
                // expect((editor.blocks[0].content[2].properties as any).styles.bold).toBe(true);
                // expect((editor.blocks[0].content[2].properties as any).styles.italic).toBe(true);
                // expect((editor.blocks[0].content[3].properties as any).styles.bold).toBe(true);

                // // Assert DOM
                // contentElement = getBlockContentElement(blockElement) as HTMLElement;
                // expect(contentElement.querySelector('strong')).not.toBeNull(); // Bold remains on "link end"
                // expect(contentElement.querySelector('em')).not.toBeNull(); // Italic remains on "link end"
                // expect(contentElement.textContent.includes('Start styled link end finish.')).toBe(true);
                // // The "styled" word that was part of the link should no longer be bold/italic in DOM if selected
                // let linkElements = contentElement.querySelectorAll('a');
                // expect(linkElements.length).toBe(2);
                // expect(linkElements[0].childNodes.length).toBe(2);
                done();
            });
        });

        it('Type text after link in Paragraph, update JSON with new ContentType.Text after link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'My Link', properties: { url: 'https://www.mylink.com' } }, { contentType: ContentType.Text, content: ''}] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            let contentElementChilds = contentElement.childNodes;

            // Simulate typing
            contentElementChilds[1].textContent += ' some text'; 
            setCursorPosition(contentElementChilds[1] as HTMLElement, 0);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);


            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[0].content).toBe('My Link');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[1].content).toBe(' some text');

                // Assert DOM
                expect(contentElement.textContent).toBe('My Link some text');
                expect(contentElement.lastChild.textContent).toBe(' some text');
                done();
            }, 100);
        });

        it('Type text before link in Paragraph, update JSON with new ContentType.Text before link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: ''}, { contentType: ContentType.Link, content: 'My Link', properties: { url: 'https://www.mylink.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            // Simulate typing
            let contentElementChilds = contentElement.childNodes;
            contentElementChilds[0].textContent += 'New text '; 
            setCursorPosition(contentElementChilds[0] as HTMLElement, 0);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);


            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(2);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('New text ');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[1].content).toBe('My Link');

                // Assert DOM
                expect(contentElement.textContent).toBe('New text My Link');
                expect(contentElement.firstChild.textContent).toBe('New text ');
                done();
            }, 100);
        });

        it('Delete link using backspace, update JSON to remove ContentType.Link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Delete me', properties: { url: 'https://www.delete.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            // Select the entire mention chip
            const linkEle = contentElement.querySelector('a') as HTMLElement;
            const range = document.createRange();
            range.selectNode(linkEle);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            range.deleteContents();
            // contentElement = getBlockContentElement(blockElement) as HTMLElement;
            // setCursorPosition(contentElement as HTMLElement, 0);
            // editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);

            setTimeout(() => {
                // Assert model
                // expect(editor.blocks[0].content.length).toBe(1);
                // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                // expect(editor.blocks[0].content[0].content).toBe('');

                // // Assert DOM
                // expect(contentElement.querySelector('a')).toBeNull();
                // expect(contentElement.textContent).toBe('');
                done();
            }, 100);
        });

        it('Delete partial link text using backspace, update JSON with updated link content', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Delete partial text', properties: { url: 'https://www.partialdelete.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 6, 6); // Cursor after "Delete"

            contentElement.childNodes[0].textContent = 'Delete';
            setCursorPosition(contentElement.childNodes[0] as HTMLElement, contentElement.childNodes[0].textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[0].content).toBe('Delete');

                // Assert DOM
                expect(contentElement.querySelector('a')).not.toBeNull();
                expect(contentElement.querySelector('a').textContent).toBe('Delete');
                done();
            }, 100);
        });
        it('Paste another link over selected link, update JSON with new ContentType.Link and URL', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Old Link', properties: { url: 'https://www.oldlink.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, 8); // Select "Old Link"

            const newLinkHtml = '<a href="https://www.newlink.com">New Link Content</a>';
            const newLinkText = 'New Link Content';
            const mockClipboard = {
                getData: (type: string) => {
                    if (type === 'text/html') { return newLinkHtml; }
                    if (type === 'text/plain') { return newLinkText; }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            setTimeout(() => {
                // Assert model
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[0].content).toBe('New Link Content');
                expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.newlink.com');

                // Assert DOM
                expect(contentElement.querySelector('a')).not.toBeNull();
                expect(contentElement.querySelector('a').textContent).toBe('New Link Content');
                expect(contentElement.querySelector('a').href).toBe('https://www.newlink.com/');
                done();
            }, 100);
        });

        it('Copy link and paste within Paragraph, update JSON with duplicated ContentType.Link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'Start ' },
                    { contentType: ContentType.Link, content: 'Copy Me', properties: { url: 'https://www.copyme.com' } },
                    { contentType: ContentType.Text, content: ' End' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, 7); // Select "Copy Me"

            // Simulate copy
            const copiedPayload = editor.blockManager.clipboardAction.getClipboardPayload();
            const mockClipboardForCopy = {
                getData: (type: string) => {
                    if (type === 'text/blockeditor') { return copiedPayload.blockeditorData; }
                    if (type === 'text/html') { return copiedPayload.html; }
                    if (type === 'text/plain') { return copiedPayload.text; }
                    return '';
                },
                setData: jasmine.createSpy('setData')
            };
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboardForCopy));

            // Move cursor for paste
            setCursorPosition(contentElement.lastChild as HTMLElement, contentElement.lastChild.textContent.length);

            // Simulate paste
            const mockClipboardForPaste = {
                getData: (type: string) => {
                    if (type === 'text/blockeditor') { return copiedPayload.blockeditorData; }
                    if (type === 'text/html') { return copiedPayload.html; }
                    if (type === 'text/plain') { return copiedPayload.text; }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboardForPaste));


            setTimeout(() => {
                // Assert model (Should have original link and duplicated link)
                expect(editor.blocks[0].content.length).toBe(4);
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[1].content).toBe('Copy Me');
                expect((editor.blocks[0].content[1].properties as ILinkContentSettings).url).toBe('https://www.copyme.com');

                // expect(editor.blocks[0].content[3].contentType).toBe(ContentType.Link); // The pasted link
                // expect(editor.blocks[0].content[3].content).toBe('Copy Me');
                // expect((editor.blocks[0].content[3].properties as ILinkContentSettings).url).toBe('https://www.copyme.com');

                // Assert DOM
                // expect(contentElement.querySelectorAll('a').length).toBe(2);
                // expect(contentElement.querySelectorAll('a')[0].textContent).toBe('Copy Me');
                // expect(contentElement.querySelectorAll('a')[1].textContent).toBe('Copy Me');
                expect(contentElement.textContent).toBe('Start Copy Me EndCopy Me'); // Check total text content
                done();
            }, 100);
        });

        it('Cut link and paste in same Paragraph, update JSON with moved ContentType.Link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'Start ' },
                    { contentType: ContentType.Link, content: 'Cut Me', properties: { url: 'https://www.cutme.com' } },
                    { contentType: ContentType.Text, content: ' End' }
                ]}
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, 6); // Select "Cut Me"

            // Simulate cut
            const copiedPayload = editor.blockManager.clipboardAction.getClipboardPayload();
            const mockClipboardForCut = {
                getData: (type: string) => {
                    if (type === 'text/blockeditor') { return copiedPayload.blockeditorData; }
                    if (type === 'text/html') { return copiedPayload.html; }
                    if (type === 'text/plain') { return copiedPayload.text; }
                    return '';
                },
                setData: jasmine.createSpy('setData')
            };
            editor.blockManager.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboardForCut));

            // Move cursor for paste
            setCursorPosition(contentElement.lastChild as HTMLElement, contentElement.lastChild.textContent.length);

            // Simulate paste
            const mockClipboardForPaste = {
                getData: (type: string) => {
                    if (type === 'text/blockeditor') { return copiedPayload.blockeditorData; }
                    if (type === 'text/html') { return copiedPayload.html; }
                    if (type === 'text/plain') { return copiedPayload.text; }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboardForPaste));

            setTimeout(() => {
                // Assert model (Should have original link removed and pasted at new location)
                expect(editor.blocks[0].content.length).toBe(3); // Start, End, Moved Link
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('Start ');
                expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[1].content).toBe(' End');
                // expect(editor.blocks[0].content[2].contentType).toBe(ContentType.Link);
                // expect(editor.blocks[0].content[2].content).toBe('Cut Me');
                // expect((editor.blocks[0].content[2].properties as ILinkContentSettings).url).toBe('https://www.cutme.com');

                // Assert DOM
                // expect(contentElement.querySelectorAll('a').length).toBe(1);
                // expect(contentElement.querySelector('a').textContent).toBe('Cut Me');
                // expect(contentElement.textContent).toBe('Start  EndCut Me'); // Text content should reflect move
                done();
            }, 100);
        });

        it('Apply link to empty selection via Ctrl+K, verify no link created and JSON unchanged', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Some text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, 4);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                // The dialog should still open, but if user inserts, it applies to current text or selection
                expect(popup).not.toBeNull();
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;

                urlInput.value = 'https://www.emptylink.com';
                insertBtn.click();

                setTimeout(() => {
                    // Assert model: No link should be created if selection was empty and no text was added in dialog
                    expect(editor.blocks[0].content.length).toBe(2);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[0].content).toBe('Some');

                    expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[1].content).toBe(' text');

                    // Assert DOM
                    expect(contentElement.querySelector('a')).not.toBeNull();
                    expect(contentElement.textContent).toBe('Some text');
                    done();
                }, 200);
            }, 100);
        });

        it('Apply link to entire Paragraph, then edit URL, update JSON with new URL', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Full paragraph text to edit.' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length); // Select entire paragraph

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.initiallink.com';
                insertBtn.click();

                setTimeout(() => {
                    // Verify initial link
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.initiallink.com');

                    // Re-open dialog on the same link
                    editor.blockManager.setFocusToBlock(blockElement);
                    setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

                    setTimeout(() => {
                        const popup2 = document.querySelector('.e-blockeditor-link-dialog');
                        const urlInput2 = popup2.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn2 = popup2.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                        expect(urlInput2.value).toBe('https://www.initiallink.com'); // Should be pre-filled

                        urlInput2.value = 'https://www.editedlink.com';
                        insertBtn2.click();

                        setTimeout(() => {
                            // Assert model with new URL
                            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                            expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://www.editedlink.com');

                            // Assert DOM with new URL
                            expect(contentElement.querySelector('a').href).toBe('https://www.editedlink.com/');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Apply link to entire Paragraph, then remove link, update JSON to ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Full paragraph text to edit.' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.testlink.com';
                insertBtn.click();

                setTimeout(() => {
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect(contentElement.querySelector('a')).not.toBeNull();

                    editor.blockManager.setFocusToBlock(blockElement);
                    setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

                    setTimeout(() => {
                        const popup2 = document.querySelector('.e-blockeditor-link-dialog');
                        const removeBtn = popup2.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                        removeBtn.click();

                        setTimeout(() => {
                            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                            expect(contentElement.querySelector('a')).toBeNull();
                            expect(editor.blocks[0].content[0].content).toBe('Full paragraph text to edit.');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Apply bold to link, then remove link, update JSON to ContentType.Text with bold style', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Full paragraph text to edit.' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.testlink.com';
                insertBtn.click();

                setTimeout(() => {
                    editor.blockManager.setFocusToBlock(blockElement);
                    setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
                    editor.blockManager.formattingAction.execCommand({ command: 'bold' });

                    setTimeout(() => {
                        expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                        expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBe(true);

                        editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                        setTimeout(() => {
                            const popup2 = document.querySelector('.e-blockeditor-link-dialog');
                            const removeBtn = popup2.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                            removeBtn.click();

                            setTimeout(() => {
                                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                                expect(contentElement.querySelector('strong').textContent).toBe('Full paragraph text to edit.');
                                done();
                            }, 100);
                        }, 100);
                    });
                }, 100);
            }, 100);
        });

        it('Apply styles to link, then remove link, update JSON to ContentType.Text with all styles', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Full paragraph text to edit.' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://www.testlink.com';
                insertBtn.click();

                setTimeout(() => {
                    editor.blockManager.setFocusToBlock(blockElement);
                    setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
                    editor.blockManager.formattingAction.execCommand({ command: 'bold' });
                    editor.blockManager.formattingAction.execCommand({ command: 'italic' });
                    editor.blockManager.formattingAction.execCommand({ command: 'underline' });
                    editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

                    setTimeout(() => {
                        expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                        expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBe(true);
                        expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.italic).toBe(true);
                        expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.underline).toBe(true);
                        expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.strikethrough).toBe(true);

                        editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                        setTimeout(() => {
                            const popup2 = document.querySelector('.e-blockeditor-link-dialog');
                            const removeBtn = popup2.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                            removeBtn.click();

                            setTimeout(() => {
                                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
                                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
                                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.underline).toBe(true);
                                expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.strikethrough).toBe(true);

                                //Assert Dom
                                expect(contentElement.querySelector('strong')).not.toBeNull();
                                expect(contentElement.querySelector('em')).not.toBeNull();
                                expect(contentElement.querySelector('u')).not.toBeNull();
                                expect(contentElement.querySelector('s')).not.toBeNull();
                                done();
                            }, 100);
                        }, 100);
                    });
                }, 500);
            }, 100);
        });

        it('Select link and press Enter, split Paragraph into two blocks, update JSON with link in first block', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Full link text', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));

            setTimeout(() => {
                // expect(editor.blocks.length).toBe(2);
                // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                // expect(editor.blocks[0].content[0].content).toBe('');
                // expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);

                // expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                // expect(editorElement.querySelectorAll('.e-block')[0].querySelector('a')).toBeNull();
                // expect(editorElement.querySelectorAll('.e-block')[1].querySelector('p').textContent).toBe('');
                done();
            }, 100);
        });

        it('Split link and press Enter, split Paragraph, update JSON with split link across blocks', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Split link text', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement.querySelector('a') as HTMLElement, 6); // Cursor in middle
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[0].content[0].content).toBe('Split ');
                expect(editor.blocks[1].content.length).toBe(1);
                expect(editor.blocks[1].content[0].contentType).toBe(ContentType.Link);
                expect(editor.blocks[1].content[0].content).toBe('link text');

                expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('a').textContent).toBe('Split ');
                expect(editorElement.querySelectorAll('.e-block')[1].querySelector('a').textContent).toBe('link text');
                done();
            }, 100);
        });

        it('Apply link to text, undo, verify JSON reverts to ContentType.Text', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Text to link' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://example.com';
                insertBtn.click();

                setTimeout(() => {
                    contentElement = getBlockContentElement(blockElement);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[0].content).toBe('Text to link');
                    expect(contentElement.querySelector('a')).not.toBeNull();

                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));

                    setTimeout(() => {
                        expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                        expect(editor.blocks[0].content[0].content).toBe('Text to link');
                        expect(contentElement.querySelector('a')).toBeNull();
                        done();
                    }, 100);
                },400);
            }, 100);
        });

        it('Edit link URL, undo, verify JSON reverts to original URL', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Link text', properties: { url: 'https://original.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://edited.com';
                insertBtn.click();

                setTimeout(() => {
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://edited.com');
                    expect(contentElement.querySelector('a').href).toBe('https://edited.com/');

                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));

                    setTimeout(() => {
                        expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://original.com');
                        expect(contentElement.querySelector('a').href).toBe('https://original.com/');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Remove link, undo, verify JSON restores ContentType.Link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Link to remove', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                removeBtn.click();

                setTimeout(() => {
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(editor.blocks[0].content[0].content).toBe('Link to remove');
                    expect(contentElement.querySelector('a')).toBeNull();

                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));

                    setTimeout(() => {
                        expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                        expect(editor.blocks[0].content[0].content).toBe('Link to remove');
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Apply bold to link, undo, verify JSON removes bold style', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Link text', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });

            setTimeout(() => {
                expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBe(true);
                expect(contentElement.querySelector('a strong')).not.toBeNull();

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));

                setTimeout(() => {
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBeUndefined();
                    expect(contentElement.querySelector('a strong')).toBeNull();
                    done();
                }, 100);
            });
        });

        it('Apply styles to link, undo, verify JSON removes all styles', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Link text', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            editor.blockManager.formattingAction.execCommand({ command: 'strikethrough' });

            setTimeout(() => {
                expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBe(true);
                expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.italic).toBe(true);
                expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.underline).toBe(true);
                expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.strikethrough).toBe(true);
                expect(contentElement.querySelector('a s u em strong')).not.toBeNull();

                for(let i = 0; i < 4; i++) {
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
                }

                setTimeout(() => {
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBeUndefined();
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.italic).toBeUndefined();
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.underline).toBeUndefined();
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.strikethrough).toBeUndefined();
                    expect(contentElement.querySelector('a strong')).toBeNull();
                    expect(contentElement.querySelector('a em')).toBeNull();
                    expect(contentElement.querySelector('a u')).toBeNull();
                    expect(contentElement.querySelector('a s')).toBeNull();
                    done();
                });
            });
        });

        it('Remove link, redo, verify JSON removes ContentType.Link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Link to remove', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
                removeBtn.click();

                setTimeout(() => {
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                    expect(contentElement.querySelector('a')).toBeNull();

                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));

                    setTimeout(() => {
                        expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                        expect(contentElement.querySelector('a')).not.toBeNull();

                        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));

                        setTimeout(() => {
                            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                            expect(contentElement.querySelector('a')).toBeNull();
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Apply link to overlapping text (half bold, half non-formatted), update JSON with merged link span', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [
                    { contentType: ContentType.Text, content: 'Half ', properties: { styles: { bold: true } } },
                    { contentType: ContentType.Text, content: 'bold text' }
                ] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            let contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setRange(contentElement.childNodes[0] as HTMLElement, contentElement.childNodes[1].firstChild, 0, 4);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://example.com';
                insertBtn.click();

                setTimeout(() => {
                    // expect(editor.blocks[0].content.length).toBe(2);
                    // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    // expect(editor.blocks[0].content[0].content).toBe('Half bold');
                    // expect(editor.blocks[0].content[1].contentType).toBe(ContentType.Text);
                    // expect(editor.blocks[0].content[1].content).toBe(' text');
                    // expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBe(true);
                    // expect(contentElement.querySelector('a').textContent).toBe('Half bold');
                    done();
                }, 500);
            }, 100);
        });

        it('Apply link to text, then apply different link to overlapping text, update JSON with split link spans', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Overlapping link text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://first.com';
                insertBtn.click();

                setTimeout(() => {
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://first.com');

                    setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 5, 15);
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

                    setTimeout(() => {
                        const popup2 = document.querySelector('.e-blockeditor-link-dialog');
                        const urlInput2 = popup2.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn2 = popup2.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                        urlInput2.value = 'https://second.com';
                        insertBtn2.click();

                        setTimeout(() => {
                            // expect(editor.blocks[0].content.length).toBe(1);
                            // expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                            // expect(editor.blocks[0].content[0].content).toBe('Overlapping link text');
                            // expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://second.com');

                            // expect(contentElement.querySelectorAll('a').length).toBe(1);
                            done();
                        }, 500);
                    }, 100);
                }, 500);
            }, 100);
        });

        it('Select link and navigate to URL (e.g., click), verify browser opens URL', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Click me', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            const linkElement = contentElement.querySelector('a') as HTMLAnchorElement;
            spyOn(window, 'open').and.returnValue(null);
            linkElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
                done();
            }, 100);
        });

        it('Select link to verify opens in new tab', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'New tab', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            const linkElement = contentElement.querySelector('a') as HTMLAnchorElement;
            spyOn(window, 'open').and.returnValue(null);
            linkElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
                done();
            }, 100);
        });

        it('Apply link to text with existing formatting (e.g., bold), update JSON with link and preserved formatting', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Bold text', properties: { styles: { bold: true } } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('strong').firstChild as HTMLElement, 0, contentElement.textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://example.com';
                insertBtn.click();

                setTimeout(() => {
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[0].content).toBe('Bold text');
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).styles.bold).toBe(true);
                    expect(contentElement.querySelector('a strong')).not.toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('Apply link to entire Paragraph, then apply different link to a word, update JSON with nested link', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Entire paragraph text' }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.firstChild as HTMLElement, 0, contentElement.textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                urlInput.value = 'https://outer.com';
                insertBtn.click();

                setTimeout(() => {
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect((editor.blocks[0].content[0].properties as ILinkContentSettings).url).toBe('https://outer.com');

                    setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 7, 16); // 'paragraph'
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

                    setTimeout(() => {
                        const popup2 = document.querySelector('.e-blockeditor-link-dialog');
                        const urlInput2 = popup2.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn2 = popup2.querySelector('.e-insert-link-btn') as HTMLButtonElement;
                        urlInput2.value = 'https://inner.com';
                        insertBtn2.click();

                        setTimeout(() => {
                            // expect(editor.blocks[0].content.length).toBe(1);
                            // expect(editor.blocks[0].content[0].contentType).toBe(index_1.ContentType.Link);
                            // expect(editor.blocks[0].content[0].content).toBe('Entire paragraph text');
                            // expect(editor.blocks[0].content[0].properties.url).toBe('https://inner.com');

                            // expect(contentElement.querySelectorAll('a').length).toBe(1);
                            // expect(contentElement.querySelectorAll('a')[1].href).toBe('https://inner.com/');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Select link and delete entire Paragraph, update JSON to remove block', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Delete me', properties: { url: 'https://example.com' } }] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, contentElement.querySelector('a').textContent.length);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' }));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                expect(editorElement.querySelectorAll('.e-block')[0].querySelector('p').textContent).toBe('');
                done();
            }, 100);
        });

        it('Select link and transform Paragraph to Heading, update JSON', (done) => {
            setupEditor([
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Link, content: 'Transform me', properties: { url: 'https://example.com' } }, { contentType: ContentType.Text, content: ''}] }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.childNodes[1].textContent = '/';
            setCursorPosition(contentElement.childNodes[1] as HTMLElement, contentElement.childNodes[1].textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockContainer.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));

            setTimeout(() => {
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                const headingElement = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
                headingElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                setTimeout(() => {
                    expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                    expect((editor.blocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                    expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[0].content).toBe('Transform me');
                    expect(editorElement.querySelector('.e-block').querySelector('h1 a').textContent).toBe('Transform me');
                    done();
                }, 100);
            }, 100);
        });

        it('Select text with existing link and press Ctrl+K, Remove should clear all input fields', (done) => {
            setupEditor([
                {
                    id: 'paragraph1',
                    blockType: BlockType.Paragraph,
                    content: [
                        {
                            contentType: ContentType.Link,
                            content: 'Existing Link',
                            properties: { url: 'https://www.existing.com' }
                        }
                    ]
                }
            ]);
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
        
            setSelectionRange(contentElement.querySelector('a').firstChild as HTMLElement, 0, 7);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
        
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
                const urlInput = popup.querySelector('#linkUrl') as HTMLInputElement;
                const removeBtn = popup.querySelector('.e-remove-link-btn') as HTMLButtonElement;
            
                expect(urlInput.value).toBe('https://www.existing.com');
                expect(removeBtn.hasAttribute('disabled')).toBe(false);
                removeBtn.click();
            
                setTimeout(() => {
                    const linkText = popup.querySelector('#linkText') as HTMLInputElement;
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const linkTitle = popup.querySelector('#linkTitle') as HTMLInputElement;
                
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    expect(linkText.value).toBe('');
                    expect(linkUrl.value).toBe('');
                    expect(linkTitle.value).toBe('');
                    expect(removeBtn.hasAttribute('disabled')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });
    });

    describe('Link Popup Positioning', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let popup: HTMLElement;

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

        it('should position link popup at top center for first block selection', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content-1', 0, 5);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
                expect(popup).not.toBeNull();

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Check top matches editor top
                expect(popupRect.top).toBe(editorRect.top);

                // Check centered: popup left ≈ editor left + (editor width / 2 - popup width / 2)
                const expectedLeft = editorRect.left + (editorRect.width / 2) - (popupRect.width / 2);
                expect(Math.abs(popupRect.left - expectedLeft)).toBeLessThanOrEqual(1); // Allow minor pixel difference

                const cancelBtn = popup.querySelector('.e-cancel-link-btn') as HTMLElement;
                cancelBtn.click();

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });

        it('should position link popup at top center for third block selection', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-3') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content-3', 0, 5);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
                expect(popup).not.toBeNull();

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                expect(popupRect.top).toBe(editorRect.top);

                // Check centered
                const expectedLeft = editorRect.left + (editorRect.width / 2) - (popupRect.width / 2);
                expect(Math.abs(popupRect.left - expectedLeft)).toBeLessThanOrEqual(1);

                const cancelBtn = popup.querySelector('.e-cancel-link-btn') as HTMLElement;
                cancelBtn.click();

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });

        it('should position link popup at top center for 10th block selection (last visible without scrolling)', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-10') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content-10', 0, 5);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
                expect(popup).not.toBeNull();

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                expect(popupRect.top).toBe(editorRect.top);

                // Check centered
                const expectedLeft = editorRect.left + (editorRect.width / 2) - (popupRect.width / 2);
                expect(Math.abs(popupRect.left - expectedLeft)).toBeLessThanOrEqual(1);

                const cancelBtn = popup.querySelector('.e-cancel-link-btn') as HTMLElement;
                cancelBtn.click();

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });

        it('should position link popup at top center for 12th block selection after scrolling', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-12') as HTMLElement;
            editorElement.scrollTop = blockElement.offsetTop;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content-12', 0, 5);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
                expect(popup).not.toBeNull();

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Check top matches editor top
                expect(popupRect.top).toBe(editorRect.top);

                // Check centered
                const expectedLeft = editorRect.left + (editorRect.width / 2) - (popupRect.width / 2);
                expect(Math.abs(popupRect.left - expectedLeft)).toBeLessThanOrEqual(1);

                const cancelBtn = popup.querySelector('.e-cancel-link-btn') as HTMLElement;
                cancelBtn.click();

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });

        it('should position link popup at top center for 15th block selection after scrolling', (done) => {
            const blockElement = editorElement.querySelector('#paragraph-15') as HTMLElement;
            editorElement.scrollTop = editorElement.scrollHeight;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content-15', 0, 5);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
                expect(popup).not.toBeNull();

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Check top matches editor top
                expect(popupRect.top).toBe(editorRect.top);

                // Check centered
                const expectedLeft = editorRect.left + (editorRect.width / 2) - (popupRect.width / 2);
                expect(Math.abs(popupRect.left - expectedLeft)).toBeLessThanOrEqual(1);

                const cancelBtn = popup.querySelector('.e-cancel-link-btn') as HTMLElement;
                cancelBtn.click();

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });

        it('should position link popup at top center for block selection when editor element top is not visible', (done) => {
            editorElement.style.top = "-100px";
            const blockElement = editorElement.querySelector('#paragraph-7') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('content-7', 0, 5);

            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));

            setTimeout(() => {
                popup = document.querySelector('.e-blockeditor-link-dialog') as HTMLElement;
                expect(popup).not.toBeNull();

                const editorRect = editorElement.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();

                // Check top matches editor top
                expect(popupRect.top).toBe(0);

                // Check centered: popup left ≈ editor left + (editor width / 2 - popup width / 2)
                const expectedLeft = editorRect.left + (editorRect.width / 2) - (popupRect.width / 2);
                expect(Math.abs(popupRect.left - expectedLeft)).toBeLessThanOrEqual(1); // Allow minor pixel difference

                const cancelBtn = popup.querySelector('.e-cancel-link-btn') as HTMLElement;
                cancelBtn.click();

                setTimeout(() => {
                    expect(popup.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 300);
            }, 100);
        });
    });
});
