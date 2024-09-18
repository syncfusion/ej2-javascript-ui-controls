/**
 * RTE - CSS related spec in this file we have added the css in the document head.
 */
import { RichTextEditor, ToolbarConfigItems } from '../../src/rich-text-editor/index';
import { ENTERKEY_EVENT_INIT } from '../constant.spec';
import { renderRTE, destroy, clickImage, clickGripper, moveGripper, leaveGripper, ImageResizeGripper } from '../rich-text-editor/render.spec';

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
        document.head.appendChild(link);
        setTimeout(() => {
            done(); // Style should be loaded before done() called
        }, 1000);
    });

    afterAll((done: DoneFn) => {
        document.getElementById('materialTheme').remove();
        done();
    });

    describe('EJ2-15894 - RTE maximized window hide the bottom ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [ 'Bold', 'FullScreen' ]
                }
            });
            rteEle = rteObj.element;
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
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
        beforeEach((done: DoneFn) => {
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
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });

        it ('Check for the RTE Toolbar Height and Content Height on Initial rendering', (done: DoneFn) => {
            setTimeout(() => {
                const panelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getPanel());
                const editPanelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getEditPanel());
                const toolbarStyle: CSSStyleDeclaration = window.getComputedStyle(editor.toolbarModule.getToolbarElement());
                const rootContainerStyle: CSSStyleDeclaration = window.getComputedStyle(editor.rootContainer);
                expect(rootContainerStyle.display).toBe('flex');
                expect(panelStyle.marginBottom).toBe('20px');
                expect(editPanelStyle.paddingBottom).toBe('0px');
                expect(toolbarStyle.flexGrow).toBe('0');
                expect(panelStyle.flexGrow).toBe('1');
                expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('enabled'))).toBe(true);
                editor.value = content;
                editor.dataBind();
                setTimeout(() => {
                    expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('enabled'))).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it ('Check for the RTE Toolbar Height and Content Height after clicking the toolbar expand icon', (done: DoneFn) => {
            const expandBtn: HTMLElement = editor.element.querySelector('.e-hor-nav');
            toolbarHeight = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
            expandBtn.click();
            setTimeout(() => {
                const currentToolbarHeight: number = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
                expect(currentToolbarHeight).toBeGreaterThan(toolbarHeight);
                done();
            }, 100);
        });

        it ('Check for the RTE Toolbar Height and Content height on Source code view', (done: DoneFn) => {
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

        it ('Check for the RTE Toolbar Height and Content Height on Full screen mode', (done: DoneFn) => {
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
        beforeEach((done: DoneFn) => {
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
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });

        it ('Check for the RTE Toolbar Height and Content Height on Initial rendering', (done: DoneFn) => {
            setTimeout(() => {
                const panelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getPanel());
                const editPanelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getEditPanel());
                const toolbarStyle: CSSStyleDeclaration = window.getComputedStyle(editor.toolbarModule.getToolbarElement());
                const rootContainerStyle: CSSStyleDeclaration = window.getComputedStyle(editor.rootContainer);
                expect(rootContainerStyle.display).toBe('flex');
                expect(panelStyle.marginBottom).toBe('0px');
                expect(editPanelStyle.paddingBottom).toBe('16px');
                expect(toolbarStyle.flexGrow).toBe('0');
                expect(panelStyle.flexGrow).toBe('1');
                expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('enabled'))).toBe(true);
                editor.value = content;
                editor.dataBind();
                setTimeout(() => {
                    expect((editor.element.querySelector('.e-rte-placeholder').classList.contains('enabled'))).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('876912 - Use the flex to align the toolbar and editor area - 3 ', () => {
        let editor: RichTextEditor;
        let toolbarHeight: number;
        beforeEach((done: DoneFn) => {
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
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });

        it ('Check for the RTE Toolbar Height and Content Height on Initial rendering', (done: DoneFn) => {
            setTimeout(() => {
                const panelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getPanel());
                const editPanelStyle: CSSStyleDeclaration = window.getComputedStyle(editor.contentModule.getEditPanel());
                const toolbarStyle: CSSStyleDeclaration = window.getComputedStyle(editor.toolbarModule.getToolbarElement());
                const rootContainerStyle: CSSStyleDeclaration = window.getComputedStyle(editor.rootContainer);
                expect(rootContainerStyle.display).toBe('flex');
                expect(panelStyle.marginBottom).toBe('20px');
                expect(editPanelStyle.paddingBottom).toBe('0px');
                expect(toolbarStyle.flexGrow).toBe('0');
                expect(panelStyle.flexGrow).toBe('1');
                expect((editor.inputElement.getAttribute('placeholder'))).toBe('Type something');
                done();
            }, 100);
        });

        it ('Check for the RTE Toolbar Height and Content Height after clicking the toolbar expand icon', (done: DoneFn) => {
            const expandBtn: HTMLElement = editor.element.querySelector('.e-hor-nav');
            toolbarHeight = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
            expandBtn.click();
            setTimeout(() => {
                const currentToolbarHeight: number = editor.toolbarModule.getToolbarElement().getBoundingClientRect().height;
                expect(currentToolbarHeight).toBeGreaterThan(toolbarHeight);
                done();
            }, 100);
        });

        it ('Check for the RTE Toolbar Height and Content height on Source code view', (done: DoneFn) => {
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

        it ('Check for the RTE Toolbar Height and Content Height on Full screen mode', (done: DoneFn) => {
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
            expect((rteObj as any).placeHolderWrapper.classList.contains('enabled')).toBe(false);
            rteObj.value = ``;
            rteObj.dataBind();
            expect((rteObj as any).placeHolderWrapper.classList.contains('enabled')).toBe(true);
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(window.getComputedStyle(rteObj.contentModule.getPanel()).display).toBe('none');
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((rteObj as any).placeHolderWrapper.classList.contains('enabled')).toBe(true);
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
            expect((rteObj as any).placeHolderWrapper.classList.contains('enabled')).toBe(false);
            rteObj.value = ``;
            rteObj.updateValue(rteObj.value);
            rteObj.dataBind();
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(window.getComputedStyle(rteObj.contentModule.getPanel()).display).toBe('none');
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((rteObj as any).placeHolderWrapper.classList.contains('enabled')).toBe(true);
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

    describe('878382: The Iframe editor cursor is not focused and the scroll is improper. ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                height: 200,
                value: content,
                saveInterval: 0,
                undoRedoTimer: 0
            });
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });

        it('CASE 1: DIV Editor Height Static: Check for the Scroll position after the enter action', (done: DoneFn) => {
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

        it('CASE 2: DIV Editor Height Auto: Check for the Scroll position after the enter action', (done: DoneFn) => {
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
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                // Check the visibility of tha cursor
                // Only SUCCESS in Headlesschrome
                expect(document.body.scrollHeight > window.innerHeight).toBe(true);
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });
    });

    describe('878382: The Iframe editor cursor is not focused and the scroll is improper. ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                height: 200,
                value: content,
                iframeSettings: {
                    enable: true
                },
                saveInterval: 0,
                undoRedoTimer: 0
            });
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });

        it('CASE 1: IFRAME Editor Height Static: Check for the Scroll position after the enter action', (done: DoneFn) => {
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

        it('CASE 2: IFRAME Editor Height Auto: Check for the Scroll position after the enter action', (done: DoneFn) => {
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
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT));
            setTimeout(() => {
                // Check the visibility of tha cursor 
                // Only SUCCESS in Headlesschrome
                expect(document.body.scrollHeight > window.innerHeight).toBe(true);
                expect(editor.inputElement.lastElementChild.getBoundingClientRect().top).toBeGreaterThan(editor.inputElement.getBoundingClientRect().top);
                done();
            }, 100);
        });
    });

    describe('878382: The Iframe editor cursor is not focused and the scroll is improper. ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                value: `<p><img alt="Logo" src="/base/spec/content/image/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-imginline"></p>`,
                iframeSettings: {
                    enable: true
                },
                saveInterval: 0,
                undoRedoTimer: 0
            });
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });

        it('Should have proper height when the image is loaded.', (done: DoneFn) => {
            setTimeout(() => {
                expect((editor.contentModule.getPanel() as HTMLElement).style.height).toBe('244px');
                done();
            }, 400);
        });
    });

    describe('882278: Editor not scrolls to the cursor position when pasting contents into the RichTextEditor', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                height: 200,
                value: content,
                saveInterval: 0,
                undoRedoTimer: 0
            });
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
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
        beforeEach((done: Function) => {
            editor = renderRTE({
                value: `
                <p>Image with Width and Height</p>
                <p><img alt="image 1" src="/base/spec/content/image/RTE-Portrait.png" style="width: 450px;" /></p>`
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(editor);
            done();
        });
        it('Should resize the image properly Case 1 Top Right Increase size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
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
        beforeEach((done: Function) => {
            editor = renderRTE({
                value: `
                <p>Image with Width and Height</p>
                <p><img alt="image 1" src="/base/spec/content/image/RTE-Portrait.png" style="height: 450px;" /></p>`
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(editor);
            done();
        });
        it('Should resize the image properly Case 1 Top Right Increase size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
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
});
