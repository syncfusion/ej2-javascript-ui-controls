import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor, BlockType, ContentType, getBlockContentElement } from '../../src/index';
import { createEditor } from '../common/util.spec';
import { L10n } from '@syncfusion/ej2-base';

describe('Link Module', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

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
                            { id: 'content1', type: ContentType.Text, content: 'Helloworld' }
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
            editor.setFocusToBlock(blockElement);

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
                    expect(editor.blocks[0].content[1].type).toBe(ContentType.Link);
                    expect(editor.blocks[0].content[1].linkSettings.url).toContain('https://www.syncfusion.com');
                    expect(editor.blocks[0].content[1].linkSettings.openInNewWindow).toBe(true);
                    expect(editor.blocks[0].content[2].content).toBe('ld');

                    done();
                }, 300);
            }, 100);
        });

        it('should remove link properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);

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
                        expect(editor.blocks[0].content[1].type).toBe(ContentType.Text);
                        expect(editor.blocks[0].content[1].linkSettings.url).toBe('');
                        expect(editor.blocks[0].content[2].content).toBe('ld');
                        done();
                    }, 300);
                }, 300);
            }, 100);
        });

        it('should close popup on cancel', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);

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

        it('should normalize when autohtml is enabled', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);

            editor.setSelection('content1', 2, 8);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            setTimeout(() => {
                editor.setSelection('content1', 2, 8);
            });
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                expect(popup).not.toBeNull();
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const linkTitle = popup.querySelector('#linkTitle') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');

                linkUrl.value = 'www.syncfusion.com';
                linkTitle.value = 'Syncfusion';
                popup.querySelector('.e-checkbox-wrapper').dispatchEvent(new MouseEvent('click'));
                insertBtn.dispatchEvent(new MouseEvent('click'));

                setTimeout(() => {
                    const contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.querySelector('a').getAttribute('href')).toBe('https://www.syncfusion.com');
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
                        "toggleParagraph": "Umschaltbarer Absatz",
                        "toggleHeading1": "Umschaltbare Überschrift 1",
                        "toggleHeading2": "Umschaltbare Überschrift 2",
                        "toggleHeading3": "Umschaltbare Überschrift 3",
                        "toggleHeading4": "Umschaltbare Überschrift 4",
                        "bulletList": "Element hinzufügen",
                        "numberedList": "Element hinzufügen",
                        "checkList": "Zu erledigen",
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
            editor.setFocusToBlock(blockElement);
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
            const originalCheckBoxObj = (editor.linkModule as any).linkCheckBoxObj;
            linkHeader.remove();
            (editor.linkModule as any).linkCheckBoxObj = null;

            (editor.linkModule as any).updateLinkPopupLocale();

            (editor.linkModule as any).linkCheckBoxObj = originalCheckBoxObj;
            done();
        });
        
        it('should handle link clicks', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            
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
            editor.setFocusToBlock(blockElement);
            
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
        
        it('should handle auto-https conversion for links', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            
            editor.setSelection('content1', 0, 5);
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
            
            setTimeout(() => {
                const popup = document.querySelector('.e-blockeditor-link-dialog');
                const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                const insertBtn = popup.querySelector('.e-insert-link-btn');
                
                linkUrl.value = 'www.example1.com';
                insertBtn.dispatchEvent(new MouseEvent('click'));
                
                setTimeout(() => {
                    let contentElement = getBlockContentElement(blockElement);
                    expect(contentElement.childElementCount).toBe(2);
                    expect(contentElement.children[0].tagName).toBe('A');
                    expect(contentElement.children[1].tagName).toBe('SPAN');
                    let spanEle = contentElement.children[1] as HTMLElement;
                    let id = spanEle.id;
                    editor.setSelection(id, 2, 5);
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                    
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        
                        linkUrl.value = 'https://www.example2.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));
                        
                        setTimeout(() => {
                            const contentElement = getBlockContentElement(blockElement);
                            const links = contentElement.querySelectorAll('a');
                            
                            expect(links[0].getAttribute('href')).toBe('https://www.example1.com');
                            expect(links[1].getAttribute('href')).toBe('https://www.example2.com');
                            
                            editor.enableAutoHttps = false;
                            editor.dataBind();
                            editor.linkModule.handleAutoHttps();
                            
                            expect(links[0].getAttribute('href')).toBe('www.example1.com');
                            expect(links[1].getAttribute('href')).toBe('www.example2.com');
                            
                            editor.enableAutoHttps = true;
                            editor.dataBind();
                            editor.linkModule.handleAutoHttps();
                            
                            expect(links[0].getAttribute('href')).toBe('https://www.example1.com');
                            expect(links[1].getAttribute('href')).toBe('https://www.example2.com');
                            
                            done();
                        }, 300);
                    }, 100);
                }, 300);
            }, 100);
        });
        
        it('should handle keyboard events in link popup - insert', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            
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
            editor.setFocusToBlock(blockElement);
            
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
            editor.setFocusToBlock(blockElement);
            
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
            editor.setFocusToBlock(blockElement);
            
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
            editor.setFocusToBlock(blockElement);
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
            editor.setFocusToBlock(blockElement);
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
            editor.setFocusToBlock(blockElement);
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
            editor.setFocusToBlock(blockElement);
            
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

        it('should handle null values when updating RTL', function (done) {
            const originalLinkPopup = (editor.linkModule as any).linkPopup;
            const originalCheckBoxObj = (editor.linkModule as any).linkCheckBoxObj;

            (editor.linkModule as any).linkPopup = null;
            (editor.linkModule as any).linkCheckBoxObj = null;

            (editor.linkModule as any).applyRtlSettings();

            (editor.linkModule as any).linkPopup = originalLinkPopup;
            (editor.linkModule as any).linkCheckBoxObj = originalCheckBoxObj;
            done();
        });
    });

    describe('Other actions testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            editor = createEditor({
                enableAutoHttps: false,
                blocks: [
                    {
                        id: 'paragraph1',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'content1', type: ContentType.Text, content: 'Helloworld' }
                        ]
                    },
                    {
                        id: 'paragraph2',
                        type: BlockType.Paragraph,
                        content: [
                            { id: 'linkContent', type: ContentType.Link, content: 'LinkText', linkSettings: {
                                url: 'google.com'
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

        it('should render denormalized link when enableAutoHttps is false', (done) => {
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            const linkElement = getBlockContentElement(blockElement).querySelector('a');
            expect(linkElement.getAttribute('href')).toBe('google.com');
            done();
        });

        it('should handle null values properly', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            const originalPopupElement = (editor.linkModule as any).popupElement;
            const originalContent = contentElement.cloneNode(true);
            editor.setFocusToBlock(blockElement);

            (editor.linkModule as any).popupElement = null;
            (editor.linkModule as any).updateLinkPopupLocale();
            
            (editor.linkModule as any).handleDocumentClick({ target: contentElement });

            (editor.linkModule as any).showLinkPopup();
            setTimeout(() => {
                contentElement.remove();
                editor.setFocusToBlock(blockElement);
                (editor.linkModule as any).hideLinkPopup();
                (editor.linkModule as any).showLinkPopup();
                (editor.linkModule as any).handleLinkInsertDeletion();
                (editor.linkModule as any).popupElement = originalPopupElement;
                blockElement.appendChild(originalContent);
                done();
            }, 500);
        });

        it('should hide popup on document click', (done) => {
            const blockElement = editor.element.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(blockElement);
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

            (editor.linkModule as any).handleEditorClick({ target: linkEle.querySelector('span'), preventDefault: function () { } });

            expect(windowOpenCalled).toBe(true);
            expect(openUrl).toBe('https://www.google.com');
            expect(openTarget).toBe('_self'); // Default is to open in new window
            
            window.open = originalWindowOpen;
            document.body.removeChild(linkEle);
            done();
        });
    });
});