import { RichTextEditor, SlashMenuItemSelectArgs } from "../../../src/rich-text-editor/index";
import { SLASH_KEY_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE } from "../render.spec";

describe('Slash Menu ', () => {

    describe('Enable property testing ', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true
                }
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it ('Mention object should not be null', () => {
            expect(editor.slashMenuModule).not.toBeUndefined();
            expect((editor.slashMenuModule as any).mention).not.toBeNull();
        });
        it ('Mention object should be null', () => {
            editor.slashMenuSettings.enable = false;
            editor.dataBind();
            expect(editor.slashMenuModule).toBeUndefined();
            editor.slashMenuSettings.enable = true;
            editor.dataBind();
            expect(editor.slashMenuModule).not.toBeUndefined();
        });
        it ('Mention datasource should not be empty', () => {
            expect((editor.slashMenuModule as any).mention.dataSource.length).toBeGreaterThan(0);
        });
        it ('Mention datasource should be One. Should not add default items.', () => {
            editor.slashMenuSettings.items = ['Heading 1'];
            editor.dataBind();
            expect((editor.slashMenuModule as any).mention.dataSource.length).toBe(1);
        });
    });

    describe('Enable property testing ', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: false
                }
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it ('Mention object should be null', () => {
            expect(editor.slashMenuModule).toBeUndefined();
        });
    });

    describe('PopupHeight property testing ', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true,
                    popupHeight: 300
                }
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it ('Mention popup height should be 300', () => {
            expect((editor.slashMenuModule as any).mention.popupHeight).toBe(300);
        });
        it ('Mention popup height should be 350', () => {
            editor.slashMenuSettings.popupHeight = 350;
            editor.dataBind();
            expect((editor.slashMenuModule as any).mention.popupHeight).toBe(350);
        });
    });

    describe('PopupWidth property testing ', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true,
                    popupWidth: 300
                }
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it ('Mention popup width should be 300', () => {
            expect((editor.slashMenuModule as any).mention.popupWidth).toBe(300);
        });
        it ('Mention popup width should be 350', () => {
            editor.slashMenuSettings.popupWidth = 350;
            editor.dataBind();
            expect((editor.slashMenuModule as any).mention.popupWidth).toBe(350);
        });
    });

    describe('Opening of the Mention Popup ', () => {
        let editor: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true,
                },
                value: '/'
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should open the popup on the / character key up event', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            (editor.slashMenuModule as any).mention.showPopup();
            const mentionPopup: HTMLElement = document.querySelector('#' + editor.getID() + '_rte-edit-view_slash_menu_popup');
            setTimeout(() => {
                expect(document.body.contains(mentionPopup)).toBe(true);
                done();
            }, 150);
        });
    });

    describe('Filtering of the Mention items ', () => {
        let editor: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true,
                },
                value: '/H'
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should filter the items on the /h character key up event', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 2);
            range.setEnd(editor.inputElement.firstChild.firstChild, 2);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const eventInit = {
                "key": "h",
                "keyCode": 72,
                "which": 72,
                "code": "KeyH",
                "location": 0,
                "altKey": false,
                "ctrlKey": false,
                "metaKey": false,
                "shiftKey": false,
                "repeat": false,
                "bubbles": true,
                "cancelable": true,
                "view": window,
            }
            const hKeyEvent : KeyboardEvent = new KeyboardEvent('keydown', eventInit);
            editor.inputElement.dispatchEvent(hKeyEvent);
            const hKeyUpEvent : KeyboardEvent = new KeyboardEvent('keyup', eventInit);
            editor.inputElement.dispatchEvent(hKeyUpEvent);
            const mentionPopup: HTMLElement = document.querySelector('#' + editor.getID() + '_rte-edit-view_slash_menu_popup');
            setTimeout(() => {
                expect(document.body.contains(mentionPopup)).toBe(true);
                done();
            }, 150);
        });
    });

    describe('Applying Heading with the slash command', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true,
                },
                value: '/'
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should apply heading 1 on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const heading1: HTMLElement = document.querySelector('[data-value="Use this for a top level heading or title."]')
                heading1.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('h1').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
        it ('Should apply heading 2 on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const heading2: HTMLElement = document.querySelector('[data-value="Use this for key sections."]')
                heading2.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('h2').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
        it ('Should apply heading 3 on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const heading3: HTMLElement = document.querySelector('[data-value="Use this for sub sections and group headings."]')
                heading3.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('h3').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
        it ('Should apply heading 4 on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const heading4: HTMLElement = document.querySelector('[data-value="Use this for the key points of the sub topics."]')
                heading4.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('h4').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
        it ('Should apply Ordered list on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const olElem: HTMLElement = document.querySelector('[data-value="Create an ordered list."]')
                olElem.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('ol').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
        it ('Should apply Unordered list on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const ulElem: HTMLElement = document.querySelector('[data-value="Create an unordered list."]')
                ulElem.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('ul').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
        it ('Should apply Code Block on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const preElem: HTMLElement = document.querySelector('[data-value="Create a preformatted code block."]')
                preElem.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('pre').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
        it ('Should apply Blockquote on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const blocKElem: HTMLElement = document.querySelector('[data-value="Create a quote or citation."]')
                blocKElem.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('blockquote').length).toBe(1);
                    done();
                }, 50);
            }, 150);
        });
    });

    describe('Cancelling the select event ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true,
                },
                value: '/',
                slashMenuItemSelect: (args: SlashMenuItemSelectArgs) => {
                    args.cancel = true;
                }
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should not apply heading 1 on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const heading1: HTMLElement = document.querySelector('[data-value="Use this for a top level heading or title."]')
                heading1.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('h1').length).not.toBe(1);
                    done();
                }, 50);
            }, 150);
        });
    });

    describe('Cancelling the select event ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true, 
                    items: ['Heading 1', {
                            text: 'Insert canned response',
                            description: 'Use this to insert template response',
                            command: 'CannedResponse',
                            iconCss: 'e-description e-icons',
                            type: 'Custom'
                    }]
                },
                value: '/',
                slashMenuItemSelect: (args: SlashMenuItemSelectArgs) => {
                    args.cancel = true;
                }
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should not apply heading 1 on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const heading1: HTMLElement = document.querySelector('[data-value="Use this for a top level heading or title."]')
                heading1.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('h1').length).not.toBe(1);
                    done();
                }, 50);
            }, 150);
        });
    });


    describe('Testing the custom item. ', () => {
        let editor: RichTextEditor;
        let isApplied: boolean = false;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true, 
                    items: ['Heading 1', {
                            text: 'Insert canned response',
                            description: 'Use this to insert template response',
                            command: 'CannedResponse',
                            iconCss: 'e-description e-icons',
                            type: 'Custom'
                    }]
                },
                value: '/',
                slashMenuItemSelect: (args: SlashMenuItemSelectArgs) => {
                    if (args.itemData.command === 'CannedResponse') {
                        editor.executeCommand('insertHTML', '<p>Insert cannned response.</p>');
                        isApplied = true;
                    }
                }
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should call the execute command.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const customElem: HTMLElement = document.querySelector('[data-value="Use this to insert template response"]')
                customElem.click();
                setTimeout(() => {
                    expect(isApplied).toBe(true);
                    done();
                }, 50);
            }, 150);
        });
    });

    describe('Insert table, image, link, image, audio and video testing. ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                toolbarSettings: {
                    items: [ 'Undo', 'Redo', '|' ,'Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Formats', '|', 'NumberFormatList', 'BulletFormatList', '|', 'CreateTable', 'CreateLink', 'Image',
                        '|', 'Alignments', '|', 'Indent', 'Outdent', '|', 'ClearFormat', 'FormatPainter', '|', 'EmojiPicker', '|',
                        'Print', 'SourceCode', 'FullScreen', '|', 'Audio', 'Video']
                },
                slashMenuSettings: {
                    enable: true,
                    items: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Audio', 'Video', 'Image', 'Table', 'Link', 'CodeBlock',
                        'OrderedList', 'UnorderedList', 'Blockquote', 'Emojipicker']
                },
                value: '/'
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should open the audio dialog.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const audioIterm: HTMLElement = document.querySelector('[data-value="Insert an audio."]')
                audioIterm.click();
                setTimeout(() => {
                    expect(editor.element.querySelectorAll('.e-rte-audio-dialog').length).toBe(1);
                    done();
                }, 100);
            }, 150);
        });
        it ('Should open the video dialog.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const videoIterm: HTMLElement = document.querySelector('[data-value="Insert a video."]')
                videoIterm.click();
                setTimeout(() => {
                    expect(editor.element.querySelectorAll('.e-rte-video-dialog').length).toBe(1);
                    done();
                }, 100);
            }, 150);
        });
        it ('Should open the image dialog.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const imageIterm: HTMLElement = document.querySelector('[data-value="Insert an image."]')
                imageIterm.click();
                setTimeout(() => {
                    expect(editor.element.querySelectorAll('.e-rte-img-dialog').length).toBe(1);
                    done();
                }, 100);
            }, 150);
        });
        it ('Should open the link dialog.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const linkIterm: HTMLElement = document.querySelector('[data-value="Insert a link."]')
                linkIterm.click();
                setTimeout(() => {
                    expect(editor.element.querySelectorAll('.e-rte-link-dialog').length).toBe(1);
                    done();
                }, 100);
            }, 150);
        });
        it ('Should open the table dialog.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const tableIterm: HTMLElement = document.querySelector('[data-value="Insert a table."]')
                tableIterm.click();
                setTimeout(() => {
                    expect(editor.element.querySelectorAll('.e-rte-edit-table').length).toBe(1);
                    done();
                }, 100);
            }, 150);
        });
        it ('Should open the Emoji Popup.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const emojiItem: HTMLElement = document.querySelector('[data-value="Use emojis to express ideas and emoticons."]')
                emojiItem.click();
                setTimeout(() => {
                    expect(editor.element.querySelectorAll('.e-rte-emojipicker-popup').length).toBe(1);
                    done();
                }, 100);
            }, 150);
        });
    });

    describe('908869: Creating unwanted one line while pressing the slash key and select the heading 2 by enter key', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                slashMenuSettings: {
                    enable: true,
                },
                value: '/'
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Should apply heading 2 on select of the item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.firstChild.firstChild, 1);
            range.setEnd(editor.inputElement.firstChild.firstChild, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SLASH_KEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                const heading2: HTMLElement = document.querySelector('[data-value="Use this for key sections."]')
                heading2.click();
                setTimeout(() => {
                    expect(editor.inputElement.innerHTML).toBe('<h2><br></h2>');
                    done();
                }, 50);
            }, 150);
        });
    });
});
