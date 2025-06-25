/**
 * RTE - CSS related spec in this file we have added the css in the document head.
 */
import { RichTextEditor } from '../../src/rich-text-editor/index';
import { BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, ENTERKEY_EVENT_INIT } from '../constant.spec';
import { renderRTE, destroy, clickImage, clickGripper, moveGripper, leaveGripper, ImageResizeGripper, clickVideo, clickAudio, setCursorPoint } from '../rich-text-editor/render.spec';
import { getImageUniqueFIle } from '../rich-text-editor/online-service.spec';
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { MOBILE_USER_AGENT } from '../rich-text-editor/user-agent.spec';
import { ToolbarConfigItems } from '../../src/common/enum';

const content: string = `<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">HTML markup</a> or <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">markdown</a> of the content</p>
<p><strong>Toolbar</strong></p>
<ol>
<li>
<p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc</p>
</li>
<li>
<p>The Toolbar is fully customizable</p>
</li>
</ol>
<p><strong>Links</strong></p>
<ol>
<li>
<p>You can insert a hyperlink with its corresponding dialog</p>
</li>
<li>
<p>Attach a hyperlink to the displayed text.</p>
</li>
<li>
<p>Customize the quick toolbar based on the hyperlink</p>
</li>
</ol>
<p><strong>Image.</strong></p>
<ol>
<li>
<p>Allows you to insert images from an online source as well as the local computer</p>
</li>
<li>
<p>You can upload an image</p>
</li>
<li>
<p>Provides an option to customize the quick toolbar for an image</p>
</li>
</ol>
<p><br></p>`;
describe('UI Spec ', () => {

    beforeAll((done: DoneFn) => {
        const link: HTMLLinkElement = document.createElement('link');
        link.href = '/base/demos/themes/material.css';
        link.rel = 'stylesheet';
        link.id = 'materialTheme';
        link.onload = () => {
            done(); // Only call done when the stylesheet is fully loaded
        };
        link.onerror = (e) => {
            fail(`Failed to load stylesheet: ${link.href}`);
            done(); // still end the test run to avoid hanging
        };
        document.head.appendChild(link);
    });

    afterAll((done: DoneFn) => {
        document.getElementById('materialTheme').remove();
        done();
    });

    describe('EJ2-15894 - RTE maximized window hide the bottom ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'FullScreen']
                }
            });
            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('FullScreen toolbar click testing', (done: DoneFn) => {
            const trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item button')[1];
            trgEle.click();
            setTimeout((): void => {
                expect(window.getComputedStyle(rteEle.querySelector('.e-rte-content')).height).not.toEqual('100%');
                done();
            }, 100);
        });
    });

    describe('876912 - Use the flex to align the toolbar and editor area - 1 ', () => {
        let editor: RichTextEditor;
        let toolbarHeight: number;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'UnderLine', 'StrikeThrough', '|', 'CreateLink', 'CreateLink', 'EmojiPicker'
                        , 'FontColor', 'FontName', 'FontSize', 'BackgroundColor', '|', 'NumberFormatList', 'BulletFormatList', '|',
                        'FullScreen', 'SourceCode'] as ToolbarConfigItems[]
                },
                enableResize: true,
                height: 400,
                width: 600,
                showCharCount: true,
                placeholder: 'Type something'
            });
        });

        afterEach(() => {
            destroy(editor);
        });

        it('Check for the Panel flex grow on Initial rendering', (done: DoneFn) => {
            setTimeout(() => {
                const panelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getPanel());
                setTimeout(() => {
                    // expect(parseFloat(panelStyle.marginBottom)).toBeGreaterThan(19);
                    expect(panelStyle.flexGrow).toBe('1');
                    expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(true);
                    setTimeout(() => {
                        editor.value = content;
                        editor.dataBind();
                        setTimeout(() => {
                            expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(false);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Check for the padding bottom on Initial rendering', (done: DoneFn) => {
            setTimeout(() => {
                const editPanelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getEditPanel());
                setTimeout(() => {
                    expect(editPanelStyle.paddingBottom).toBe('0px');
                    expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(true);
                    setTimeout(() => {
                        editor.value = content;
                        editor.dataBind();
                        setTimeout(() => {
                            expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(false);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Check for the Toolbar flex grow on Initial rendering', (done: DoneFn) => {
            const toolbarStyle: CSSStyleDeclaration = window.getComputedStyle(editor.toolbarModule.getToolbarElement());
            setTimeout(() => {
                expect(toolbarStyle.flexGrow).toBe('0');
                expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(true);
                setTimeout(() => {
                    editor.value = content;
                    editor.dataBind();
                    setTimeout(() => {
                        expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(false);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Check for the rootcontainer display on Initial rendering', (done: DoneFn) => {
            const rootContainerStyle: CSSStyleDeclaration = window.getComputedStyle(editor.rootContainer);
            setTimeout(() => {
                expect(rootContainerStyle.display).toBe('flex');
                expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(true);
                setTimeout(() => {
                    editor.value = content;
                    editor.dataBind();
                    setTimeout(() => {
                        expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(false);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Check for the RTE Toolbar Height and Content Height after clicking the toolbar expand icon', (done: DoneFn) => {
            const expandBtn: HTMLElement = editor.element.querySelector('.e-hor-nav');
            toolbarHeight = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
            expandBtn.click();
            setTimeout(() => {
                const currentToolbarHeight: number = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
                expect(currentToolbarHeight).toBeGreaterThan(toolbarHeight);
                done();
            }, 100);
        });

        it('Check for the RTE Toolbar Height and Content height on Source code view', (done: DoneFn) => {
            const sourceCodeBtn: HTMLElement = editor.element.querySelector('.e-source-code');
            sourceCodeBtn.click();
            setTimeout(() => {
                expect(editor.element.querySelector('.e-source-content').parentElement).toBe(editor.rootContainer);
                expect(editor.rootContainer.classList.contains('e-source-code-enabled')).toBe(true);
                const previewBtn: HTMLElement = editor.element.querySelector('.e-preview');
                previewBtn.click();
                expect(editor.rootContainer.classList.contains('e-source-code-enabled')).toBe(false);
                done();
            }, 100);
        });

        it('Check for the RTE Toolbar Height and Content Height on Full screen mode', (done: DoneFn) => {
            let editorHeight: number = editor.element.getBoundingClientRect().height;
            const fullScreenBtn: HTMLElement = editor.element.querySelector('.e-maximize');
            fullScreenBtn.click();
            setTimeout(() => {
                expect(editor.element.getBoundingClientRect().height > editorHeight).toBe(true);
                editorHeight = editor.element.getBoundingClientRect().height;
                const minimizeBtn: HTMLElement = editor.element.querySelector('.e-minimize');
                minimizeBtn.click();
                expect(editor.element.getBoundingClientRect().height < editorHeight).toBe(true);
                done();
            }, 100);
        });
    });

    describe('876912 - Use the flex to align the toolbar and editor area - 2 ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'UnderLine', 'StrikeThrough', '|', 'CreateLink', 'CreateLink', 'EmojiPicker'
                        , 'FontColor', 'FontName', 'FontSize', 'BackgroundColor', '|', 'NumberFormatList', 'BulletFormatList', '|',
                        'FullScreen', 'SourceCode'] as ToolbarConfigItems[]
                },
                height: 400,
                width: 600,
                placeholder: 'Type something'
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it('Check for the RTE Toolbar Height and Content Height on Initial rendering', (done: DoneFn) => {
            const panelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getPanel());
            const editPanelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getEditPanel());
            const toolbarStyle: CSSStyleDeclaration = window.getComputedStyle(editor.toolbarModule.getToolbarElement());
            const rootContainerStyle: CSSStyleDeclaration = window.getComputedStyle(editor.rootContainer);
            setTimeout(() => {
                expect(rootContainerStyle.display).toBe('flex');
                expect(panelStyle.marginBottom).toBe('0px');
                expect(editPanelStyle.paddingBottom).toBe('16px');
                expect(toolbarStyle.flexGrow).toBe('0');
                expect(panelStyle.flexGrow).toBe('1');
                expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(true);
                editor.value = content;
                editor.dataBind();
                setTimeout(() => {
                    expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('e-placeholder-enabled'))).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('876912 - Use the flex to align the toolbar and editor area - 3 ', () => {
        let editor: RichTextEditor;
        let toolbarHeight: number;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'UnderLine', 'StrikeThrough', '|', 'CreateLink', 'CreateLink', 'EmojiPicker'
                        , 'FontColor', 'FontName', 'FontSize', 'BackgroundColor', '|', 'NumberFormatList', 'BulletFormatList', '|',
                        'FullScreen', 'SourceCode'] as ToolbarConfigItems[]
                },
                iframeSettings: {
                    enable: true
                },
                enableResize: true,
                height: 400,
                width: 600,
                showCharCount: true,
                placeholder: 'Type something'
            });
        });

        afterEach(() => {
            destroy(editor);
        });

        it('Check for the RTE Toolbar Height and Content Height on Initial rendering', (done: DoneFn) => {
            const panelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getPanel());
            const editPanelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getEditPanel());
            const toolbarStyle: CSSStyleDeclaration = window.getComputedStyle(editor.toolbarModule.getToolbarElement());
            const rootContainerStyle: CSSStyleDeclaration = window.getComputedStyle(editor.rootContainer);
            setTimeout(() => {
                expect(rootContainerStyle.display).toBe('flex');
                // expect(parseInt(panelStyle.marginBottom)).toBeGreaterThan(19);
                expect(editPanelStyle.paddingBottom).toBe('0px');
                expect(toolbarStyle.flexGrow).toBe('0');
                expect(panelStyle.flexGrow).toBe('1');
                expect((editor.inputElement.getAttribute('placeholder'))).toBe('Type something');
                done();
            }, 100);
        });

        it('Check for the RTE Toolbar Height and Content Height after clicking the toolbar expand icon', (done: DoneFn) => {
            const expandBtn: HTMLElement = editor.element.querySelector('.e-hor-nav');
            toolbarHeight = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
            expandBtn.click();
            setTimeout(() => {
                const currentToolbarHeight: number = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
                expect(currentToolbarHeight).toBeGreaterThan(toolbarHeight);
                done();
            }, 100);
        });

        it('Check for the RTE Toolbar Height and Content height on Source code view', (done: DoneFn) => {
            const sourceCodeBtn: HTMLElement = editor.element.querySelector('.e-source-code');
            sourceCodeBtn.click();
            setTimeout(() => {
                expect(editor.element.querySelector('.e-source-content').parentElement).toBe(editor.rootContainer);
                expect(editor.rootContainer.classList.contains('e-source-code-enabled')).toBe(true);
                const previewBtn: HTMLElement = editor.element.querySelector('.e-preview');
                previewBtn.click();
                expect(editor.rootContainer.classList.contains('e-source-code-enabled')).toBe(false);
                done();
            }, 100);
        });

        it('Check for the RTE Toolbar Height and Content Height on Full screen mode', (done: DoneFn) => {
            let editorHeight: number = editor.element.getBoundingClientRect().height;
            const fullScreenBtn: HTMLElement = editor.element.querySelector('.e-maximize');
            fullScreenBtn.click();
            setTimeout(() => {
                expect(editor.element.getBoundingClientRect().height > editorHeight).toBe(true);
                editorHeight = editor.element.getBoundingClientRect().height;
                const minimizeBtn: HTMLElement = editor.element.querySelector('.e-minimize');
                minimizeBtn.click();
                expect(editor.element.getBoundingClientRect().height < editorHeight).toBe(true);
                done();
            }, 100);
        });
    });

    describe('858234-Scrollbar appears when the Rich Text Editor is in the code view', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });

        it('Test - Code view height testing when height API is auto', () => {
            const contentElement: HTMLElement = rteEle.querySelector('.e-rte-content');
            const contentHeight: number = contentElement.offsetHeight;
            const trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0];
            trgEle.click();
            const textareaElement: HTMLElement = rteEle.querySelector('.e-rte-srctextarea');
            const textareaHeight: number = textareaElement.offsetHeight;
            expect(textareaHeight).toEqual(contentHeight);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('RTE Placeholder DIV', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value: `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`,
                placeholder: 'Type something'
            });
            rteEle = rteObj.element;
        });
        it("Ensuring placeholder property", () => {
            expect((rteObj as any).placeHolderWrapper.classList.contains('e-placeholder-enabled')).toBe(false);
            rteObj.value = ``;
            rteObj.dataBind();
            expect((rteObj as any).placeHolderWrapper.classList.contains('e-placeholder-enabled')).toBe(true);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(window.getComputedStyle(rteObj.contentModule.getPanel()).display).toBe('none');
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((rteObj as any).placeHolderWrapper.classList.contains('e-placeholder-enabled')).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('RTE Update Value', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value: `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`,
                placeholder: 'Type something'
            });
            rteEle = rteObj.element;
        });
        it("RTE Update Value testing", () => {
            expect((rteObj as any).placeHolderWrapper.classList.contains('e-placeholder-enabled')).toBe(false);
            rteObj.value = ``;
            rteObj.updateValue(rteObj.value);
            rteObj.dataBind();
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(window.getComputedStyle(rteObj.contentModule.getPanel()).display).toBe('none');
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((rteObj as any).placeHolderWrapper.classList.contains('e-placeholder-enabled')).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('880875: Font size of the Place holder text is so small.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                placeholder: 'Type something',
                fontSize: {
                    default: '18pt'
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should have font size from the default value.', () => {
            expect((editor.element.querySelector('.e-rte-placeholder') as HTMLElement).style.fontSize).toBe('18pt');
        });
    });

    describe('878382: The Iframe editor cursor is not focused and the scroll is improper. (DIV Editor) ', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                height: 200,
                value: content,
                saveInterval: 0,
                undoRedoTimer: 0
            });
        });

        afterEach(() => {
            destroy(editor);
        });

        it('CASE 1: Height Static: Check for the Scroll position after the enter action', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.lastElementChild, 0);
            range.collapse(true);
            const sel: Selection = document.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                // Check the visibility of tha cursor
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });

        it('CASE 2: Height Auto: Check for the Scroll position after the enter action', (done: DoneFn) => {
            editor.height = 'auto';
            editor.value = '<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">HTML markup</a> or <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">markdown</a> of the content</p><p><strong>Toolbar</strong></p><ol>\n<li>\n<p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc</p>\n</li>\n<li>\n<p>The Toolbar is fully customizable</p>\n</li>\n</ol><p><strong>Links</strong></p><ol>\n<li>\n<p>You can insert a hyperlink with its corresponding dialog</p>\n</li>\n<li>\n<p>Attach a hyperlink to the displayed text.</p>\n</li>\n<li>\n<p>Customize the quick toolbar based on the hyperlink</p>\n</li>\n</ol><p><strong>Image.</strong></p><ol>\n<li>\n<p>Allows you to insert images from an online source as well as the local computer</p>\n</li>\n<li>\n<p>You can upload an image</p>\n</li>\n<li>\n<p>Provides an option to customize the quick toolbar for an image</p>\n</li>\n</ol><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>'
            editor.dataBind();
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.lastElementChild, 0);
            range.collapse(true);
            const sel: Selection = document.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            const previousScrollHeight: number = document.body.scrollHeight;
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                // Check the visibility of tha cursor
                // Only SUCCESS in Headlesschrome
                expect(document.body.scrollHeight > previousScrollHeight).toBe(true);
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });
    });

    describe('878382: The Iframe editor cursor is not focused and the scroll is improper. (IFRAME Editor) ', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                height: 200,
                value: content,
                iframeSettings: {
                    enable: true
                },
                saveInterval: 0,
                undoRedoTimer: 0
            });
        });

        afterEach(() => {
            destroy(editor);
        });

        it('CASE 1: Height Static: Check for the Scroll position after the enter action', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.lastElementChild, 0);
            range.collapse(true);
            const sel: Selection = editor.contentModule.getDocument().getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                // Check the visibility of tha cursor
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });

        it('CASE 2: Height Auto: Check for the Scroll position after the enter action', (done: DoneFn) => {
            editor.height = 'auto';
            editor.value = '<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">HTML markup</a> or <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">markdown</a> of the content</p><p><strong>Toolbar</strong></p><ol>\n<li>\n<p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc</p>\n</li>\n<li>\n<p>The Toolbar is fully customizable</p>\n</li>\n</ol><p><strong>Links</strong></p><ol>\n<li>\n<p>You can insert a hyperlink with its corresponding dialog</p>\n</li>\n<li>\n<p>Attach a hyperlink to the displayed text.</p>\n</li>\n<li>\n<p>Customize the quick toolbar based on the hyperlink</p>\n</li>\n</ol><p><strong>Image.</strong></p><ol>\n<li>\n<p>Allows you to insert images from an online source as well as the local computer</p>\n</li>\n<li>\n<p>You can upload an image</p>\n</li>\n<li>\n<p>Provides an option to customize the quick toolbar for an image</p>\n</li>\n</ol><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>'
            editor.dataBind();
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.lastElementChild, 0);
            range.collapse(true);
            const sel: Selection = editor.contentModule.getDocument().getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            const previousScrollHeight: number = document.body.scrollHeight;
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                // Check the visibility of tha cursor 
                // Only SUCCESS in Headlesschrome
                expect(document.body.scrollHeight > previousScrollHeight).toBe(true);
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });
    });

    describe('878382: The Iframe editor cursor is not focused and the scroll is improper. ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p><img alt="Logo" src="/base/spec/content/image/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-imginline"></p>`,
                iframeSettings: {
                    enable: true
                },
                saveInterval: 0,
                undoRedoTimer: 0
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it('Should have proper height when the image is loaded.', (done: DoneFn) => {
            setTimeout(() => {
                expect((editor.contentModule.getPanel() as HTMLElement).style.height).toBe('233px');
                done();
            }, 500);
        });
    });

    describe('882278: Editor not scrolls to the cursor position when pasting contents into the RichTextEditor', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                height: 200,
                value: content,
                saveInterval: 0,
                undoRedoTimer: 0
            });
        });

        afterEach(() => {
            destroy(editor);
        });

        it('CASE 1: DIV Editor Height Static: Check for the Scroll position after the paste action', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.lastElementChild, 0);
            range.collapse(true);
            const sel: Selection = document.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            const clipBoardData: string = '\n\n\x3C!--StartFragment--><table class="ws-table-all" id="customers" style="box-sizing: inherit; border-collapse: collapse; border-spacing: 0px; width: 1232.56px; display: table; border: 1px solid rgb(204, 204, 204); margin: 20px 0px; font-family: arial, sans-serif; color: rgb(0, 0, 0); font-size: 15px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><tbody style="box-sizing: inherit;"><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Company</th><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Contact</th><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Country</th></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Alfreds Futterkiste</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Maria Anders</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Germany</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Centro comercial Moctezuma</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Francisco Chang</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Mexico</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Ernst Handel</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Roland Mendel</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Austria</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Island Trading</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Helen Bennett</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">UK</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Laughing Bacchus Winecellars</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Yoshi Tannamuri</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Canada</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Magazzini Alimentari Riuniti</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Giovanni Rovelli</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Italy</td></tr></tbody></table>\x3C!--EndFragment-->\n\n';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                // Check the visibility of tha cursor
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });

        it('CASE 2: DIV Editor Height Auto: Check for the Scroll position after the paste action', (done: DoneFn) => {
            editor.height = 'auto';
            editor.value = '<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">HTML markup</a> or <a href="https://ej2.syncfusion.com/home/" target="_blank" rel="noopener" aria-label="Open in new window">markdown</a> of the content</p><p><strong>Toolbar</strong></p><ol>\n<li>\n<p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc</p>\n</li>\n<li>\n<p>The Toolbar is fully customizable</p>\n</li>\n</ol><p><strong>Links</strong></p><ol>\n<li>\n<p>You can insert a hyperlink with its corresponding dialog</p>\n</li>\n<li>\n<p>Attach a hyperlink to the displayed text.</p>\n</li>\n<li>\n<p>Customize the quick toolbar based on the hyperlink</p>\n</li>\n</ol><p><strong>Image.</strong></p><ol>\n<li>\n<p>Allows you to insert images from an online source as well as the local computer</p>\n</li>\n<li>\n<p>You can upload an image</p>\n</li>\n<li>\n<p>Provides an option to customize the quick toolbar for an image</p>\n</li>\n</ol><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>'
            editor.dataBind();
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.lastElementChild, 0);
            range.collapse(true);
            const sel: Selection = document.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            const clipBoardData: string = '\n\n\x3C!--StartFragment--><table class="ws-table-all" id="customers" style="box-sizing: inherit; border-collapse: collapse; border-spacing: 0px; width: 1232.56px; display: table; border: 1px solid rgb(204, 204, 204); margin: 20px 0px; font-family: arial, sans-serif; color: rgb(0, 0, 0); font-size: 15px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><tbody style="box-sizing: inherit;"><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Company</th><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Contact</th><th style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Country</th></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Alfreds Futterkiste</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Maria Anders</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Germany</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Centro comercial Moctezuma</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Francisco Chang</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Mexico</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Ernst Handel</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Roland Mendel</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Austria</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Island Trading</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Helen Bennett</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">UK</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(231, 233, 235);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Laughing Bacchus Winecellars</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Yoshi Tannamuri</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Canada</td></tr><tr style="box-sizing: inherit; border-bottom: 1px solid rgb(221, 221, 221); background-color: rgb(255, 255, 255);"><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Magazzini Alimentari Riuniti</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Giovanni Rovelli</td><td style="box-sizing: inherit; padding: 8px; display: table-cell; text-align: left; vertical-align: top; border: 1px solid rgb(221, 221, 221);">Italy</td></tr></tbody></table>\x3C!--EndFragment-->\n\n';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                // Check the visibility of tha cursor
                // Only SUCCESS in Headlesschrome
                expect(document.body.scrollHeight > window.innerHeight).toBe(true);
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });
    });

    describe('832079 - Not able to resize the image propely Potrait image (Inline Width alone)', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                value: `
                <p>Image with Width and Height</p>
                <p><img alt="image 1" src="/base/spec/content/image/RTE-Portrait.png" style="width: 450px;" /></p>`
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Should resize the image properly Case 1 Top Right Increase size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 500, 100);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width > width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 1 Top Right Decrease size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 400, 60);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width < width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 3 Resize by percentage Top Right Increase size', (done: DoneFn) => {
            editor.insertImageSettings.resizeByPercent = true;
            editor.dataBind();
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 500, 100);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width > width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 4 Resize by percentage Top Right Decrease size', (done: DoneFn) => {
            editor.insertImageSettings.resizeByPercent = true;
            editor.dataBind();
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 400, 60);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width < width);
                done();
            }, 150);
        });
    });

    describe('832079 - Not able to resize the image propely Potrait image (Inline Height alone)', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                value: `
                <p>Image with Width and Height</p>
                <p><img alt="image 1" src="/base/spec/content/image/RTE-Portrait.png" style="height: 450px;" /></p>`
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Should resize the image properly Case 1 Top Right Increase size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 500, 100);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width > width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 1 Top Right Decrease size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 400, 60);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width < width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 3 Resize by percentage Top Right Increase size', (done: DoneFn) => {
            editor.insertImageSettings.resizeByPercent = true;
            editor.dataBind();
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 500, 100);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width > width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 4 Resize by percentage Top Right Decrease size', (done: DoneFn) => {
            editor.insertImageSettings.resizeByPercent = true;
            editor.dataBind();
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 400, 60);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width < width);
                done();
            }, 150);
        });
    });

    describe('832079 - Not able to resize the image propely Potrait image (Inline Height alone)', () => {
        let editor: RichTextEditor;
        let defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MOBILE_USER_AGENT.ANDROID.CHROME;
            editor = renderRTE({
                value: `
                <p>Image with Width and Height</p>
                <p><img alt="image 1" src="/base/spec/content/image/RTE-Portrait.png" style="height: 450px;" /></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Should resize the image properly Case 1 Top Right Increase size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 500, 100);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width > width);
                done();
            }, 150);
        });
    });

    describe('916902: The video quick toolbar not open in the table', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%" class="e-cell-select"><span class="e-video-wrap" contenteditable="false" title="RTE-Ocean-Waves.mp4"><video class="e-rte-video e-video-inline e-resize e-video-focus" controls="" width="auto" height="auto" style="min-width: 0px; max-width: 317px; min-height: 0px;"><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4"></video></span><br></td> <td style="width: 9.91501%" class="">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%" class="">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Quick toolbar should not be misaligned for video inside the table', (done: DoneFn) => {
            window.scrollTo(0, 400);
            const video: HTMLVideoElement = editor.element.querySelector('video');
            let target: HTMLElement = editor.contentModule.getEditPanel().querySelector('.e-video-wrap');
            editor.formatter.editorManager.nodeSelection.setSelectionText(document, target, target, 0, 1);
            clickVideo(video);
            setTimeout(() => {
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                const quickToolbarRect = quickToolbar.getBoundingClientRect();
                const videoRect = video.getBoundingClientRect();
                expect(quickToolbarRect.left).toBeGreaterThan(videoRect.left);
                expect(videoRect.right).toBeGreaterThan(quickToolbarRect.right);
                done();
            }, 500);
        });
    });

    describe('916652 - When resize is set to false in insertImageSettings, it doesnot prevent the resize element from appearing.', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                insertImageSettings: {
                    resize: false
                },
                value: `<p>Image with Width and Height</p>
                <p><img alt="image 1" src="/base/spec/content/image/RTE-Portrait.png" style="width: 450px;" /></p>`
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Should not add the resize gripper elements in DOM.', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            setTimeout(() => {
                expect(gripperElement).toBeNull();
                done();
            }, 100);
        });
        it('Should not add the resize gripper elements in DOM. When drag and dropped.', (done: DoneFn) => {
            const dataTransfer: DataTransfer = new DataTransfer();
            const file: File = getImageUniqueFIle();
            dataTransfer.items.add(file);
            const dropEvent: DragEvent = new DragEvent('drop', { dataTransfer: dataTransfer } as DragEventInit);
            editor.inputElement.dispatchEvent(dropEvent);
            setTimeout(() => {
                const gripper: ImageResizeGripper = 'e-rte-topRight';
                const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
                expect(gripperElement).toBeNull();
                done();
            }, 100);
        });
    });

    describe('921212: Image quick toolbar is misplaced for block display', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p><span class="e-img-caption e-rte-img-caption e-imgbreak" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="beach-1920x1080-high-definition-wallpaper-preview" width="730" height="412" style="min-width: 0px; max-width: 1456px; min-height: 0px;" class="e-imgbreak e-rte-image"><span class="e-img-inner" contenteditable="true">Caption</span></span></span> </p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Quick toolbar should not be misaligned for block display', (done: DoneFn) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const image: HTMLImageElement = editor.element.querySelector('img');
            setCursorPoint(image, 0);
            clickImage(image);
            setTimeout(() => {
                const quickToolbar = document.querySelector('.e-rte-elements.e-rte-quick-popup');
                const quickToolbarRect = quickToolbar.getBoundingClientRect();
                const imgRect = image.getBoundingClientRect();
                expect(quickToolbarRect.left).toBeGreaterThan(imgRect.left);
                expect(imgRect.right).toBeGreaterThan(quickToolbarRect.right);
                done();
            }, 150);
        });
    });

    describe('923365: Audio Quick Toolbar Positioned Incorrectly After Inserting Audio File in Table', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Audio'] as ToolbarConfigItems[]
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Quick toolbar should not be misaligned for block display', (done: DoneFn) => {
            let tdElement: HTMLElement = editor.inputElement.querySelector('td');
            editor.formatter.editorManager.nodeSelection.setCursorPoint(editor.inputElement.ownerDocument, tdElement, 0);
            let audioBtn: HTMLElement = editor.element.querySelector('#' + editor.getID() + '_toolbar_Audio');
            audioBtn.click();
            setTimeout(() => {
                let input: HTMLInputElement = document.querySelector('.e-input.e-audio-url');
                input.value = 'https://www.w3schools.com/html/horse.mp3';
                input.dispatchEvent(new Event("input"));
                let inserBtn: HTMLElement = document.querySelector('.e-primary');
                inserBtn.click();
                setTimeout(() => {
                    const clickelem: HTMLAudioElement = editor.inputElement.querySelector('.e-clickelem');
                    clickAudio(clickelem);
                    setTimeout(() => {
                        const quickToolbar = document.querySelector('.e-rte-quick-toolbar');
                        const quickToolbarRect = quickToolbar.getBoundingClientRect();
                        const audioElment: HTMLAudioElement = editor.inputElement.querySelector('.e-audio-wrap');
                        const audioRect = audioElment.getBoundingClientRect();
                        expect(quickToolbarRect.left).toBeGreaterThan(audioRect.left);
                        expect(audioRect.right).toBeGreaterThan(quickToolbarRect.right);
                        done();
                    }, 1000)
                }, 300);
            }, 350);
        });
    });


    describe('932198 - To resolve the CI failed on the Test stage with incomplete test runs - Phase 2. ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'OrderedList', 'UnorderedList']
                },
                value: `<table class="e-rte-table" style="width: 22.4037%; min-width: 0px; height: 50px;"><thead style="height: 49.0566%;"><tr style="height: 49.0566%;"><th class="" style="width: 2.85881%;">SNo</th><th class="" style="width: 97.0828%;">Issue</th></tr></thead><tbody><tr style="height: 49.0566%;"><td class="" style="width: 2.85881%;">1.</td><td style="width: 97.0828%;" class="">Coverage issue with the Rich Text Editor source.</td></tr></tbody></table><p><br/></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should delete the table. Enter key P', (done: DoneFn) => {
            editor.focusIn();
            const range = new Range();
            range.setStart(editor.inputElement, 2);
            range.collapse(true);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const backSpaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(backSpaceKeyDownEvent);
            setTimeout(() => {
                const backSpaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
                editor.inputElement.dispatchEvent(backSpaceKeyDownEvent);
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('table').length).toBe(0);
                    done();
                }, 100);
            }, 50);
        });
    });

    describe('932198 - To resolve the CI failed on the Test stage with incomplete test runs - Phase 2. ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'OrderedList', 'UnorderedList']
                },
                value: `<table class="e-rte-table" style="width: 22.4037%; min-width: 0px; height: 50px;"><thead style="height: 49.0566%;"><tr style="height: 49.0566%;"><th class="" style="width: 2.85881%;">SNo</th><th class="" style="width: 97.0828%;">Issue</th></tr></thead><tbody><tr style="height: 49.0566%;"><td class="" style="width: 2.85881%;">1.</td><td style="width: 97.0828%;" class="">Coverage issue with the Rich Text Editor source.</td></tr></tbody></table><div><br/></div>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should delete the table. Enter key div', (done: DoneFn) => {
            editor.focusIn();
            const range = new Range();
            range.setStart(editor.inputElement, 2);
            range.collapse(true);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const backSpaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(backSpaceKeyDownEvent);
            setTimeout(() => {
                const backSpaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
                editor.inputElement.dispatchEvent(backSpaceKeyDownEvent);
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('table').length).toBe(0);
                    done();
                }, 100);
            }, 50);
        });
    });

    describe('872197 - Multiple anchor added to the image - ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: `<p><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="googlelogo_color_272x92dp.png" width="auto" height="auto" style="min-width: 0px; min-height: 0px;" class="e-rte-image e-imginline"> </p>`
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it('Check the insert link item added in Quick toolbar', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            rteObj.inputElement.dispatchEvent(clickEvent);
            let imgEle: HTMLElement = rteObj.element.querySelector("img");
            imgEle.focus();
            setCursorPoint(imgEle, 0);
            var eventsArg = { pageX: 50, pageY: 300, target: imgEle };
            const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            eventsArg.target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let imageQTBarEle: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                expect(getComputedStyle(imageQTBarEle.querySelector("[title='Open Link']")).display === "none").toBe(true);
                expect(getComputedStyle(imageQTBarEle.querySelector("[title='Edit Link']")).display === "none").toBe(true);
                expect(getComputedStyle(imageQTBarEle.querySelector("[title='Remove Link']")).display === "none").toBe(true);
                (imageQTBarEle.querySelector("[title='Insert Link']") as HTMLElement).click();
                setTimeout(() => {
                    let dialog = document.querySelector('.e-rte-img-dialog');
                    dialog.querySelector('.e-img-link');
                    let urlInput: HTMLInputElement = dialog.querySelector(".e-input.e-img-link");
                    urlInput.value = "http://www.google.com";
                    let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                    insertButton.click();
                    setCursorPoint(imgEle, 0);
                    eventsArg.target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        expect(getComputedStyle(imageQTBarEle.querySelector("[title='Insert Link']") as HTMLElement).display === "none").toBe(true);
                        done();
                    }, 100);
                }, 500);
            }, 100)
        });
    });
});
