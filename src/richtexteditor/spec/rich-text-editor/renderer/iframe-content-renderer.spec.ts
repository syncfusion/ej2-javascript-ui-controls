/**
 * IFrame Content renderer spec
 */
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from './../render.spec';

describe('Iframe Content renderer module', () => {

    describe('rte Iframe content element testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
        });

        it('Content iframe testing', () => {
            expect(rteObj.element.querySelectorAll('iframe.e-rte-content').length).toBe(1);
        });

        it('Content inner body as contenteditable  testing', () => {
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').getAttribute('contenteditable') === 'true').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Value property content without parent tag to render', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                value: 'RichTextEdit'
            });
        });

        it('InnerHtml testing', () => {
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').innerHTML).toBe('<p>RichTextEdit</p>');
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Click action on readonly mode with RTE editpanel focus testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true,
                    attributes: {
                        readonly: 'readonly'
                    }
                },
                value: 'RichTextEdit'
            });
        });

        it('click action to editpanel focus testing', () => {
            expect(document.activeElement.nodeName).toBe('BODY');
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            expect(document.activeElement.classList.contains('e-rte-content')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('rte Iframe enableRtl testing if enabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: true,
                iframeSettings: {
                    enable: true
                }
            });
        });

        it('rtl Mode testing', () => {
            expect(rteObj.element.classList.contains('e-rtl')).toBe(true);
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').classList.contains('e-rtl')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('rte Iframe enableRtl testing if disabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                iframeSettings: {
                    enable: true
                }
            });
        });

        it('rtl Mode testing', () => {
            expect(rteObj.element.classList.contains('e-rtl')).toBe(false);
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').classList.contains('e-rtl')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    
    describe('EJ2-49376 - Table cell have different padding in HTML and Iframe mode', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                iframeSettings: {
                    enable: true
                },
                value: `<table class='e-rte-table' style='width: 100%; min-width: 0px;'>
                <tbody><tr><td class='' style='width: 33.3333%;'><br></td><td style='width: 33.3333%;' class=''><br></td><td style='width: 33.3333%;'><br></td></tr><tr><td style='width: 33.3333%;'><br></td><td style='width: 33.3333%;' class=''><br></td><td style='width: 33.3333%;'><br></td></tr><tr><td style='width: 33.3333%;'><br></td><td style='width: 33.3333%;'><br></td><td style='width: 33.3333%;' class=''><br></td></tr></tbody></table><p><br></p>`
            });
        });

        it('- Iframe mode table padding testing', () => {
            expect(getComputedStyle((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('table td')).padding === '2px 5px').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('903715 - Provide property to add CSP headers with the meta tag in RichTextEditor IFrameSettings - metaTags', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true,
                    metaTags: [
                        { name: "description", content: "This is a rich text editor" },
                        { charset: "UTF-8" },
                        { httpEquiv: "Content-Security-Policy", content: "default-src 'self'" },
                        { property: "og:title", content: "Rich Text Editor" }
                    ]
                },
                value: `<p>Rich Text Editor</p>`
            });
        });
        it('Check the meta tag added into the iframe header', (done) => {
            let content = (rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument;
            expect(content.head.querySelectorAll("meta").length >= rteObj.iframeSettings.metaTags.length).toBe(true);
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('903715 - Provide property to add CSP headers with the meta tag in RichTextEditor IFrameSettings - sandbox', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true,
                    sandbox: ["allow-forms", "allow-orientation-lock"],
                },
                value: `<p>Rich Text Editor</p>`
            });
        });
        it('Check the sandbox attribute added into the iframe element', (done) => {
            expect(rteObj.contentModule.getPanel().getAttribute('sandbox') === 'allow-forms allow-orientation-lock allow-same-origin').toBe(true);
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('913745 - Browser spell check is not working in the iframe editor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true,
                },
            });
        });
        it('Should have the spellcheck attribute to be true.', () => {
            expect(rteObj.inputElement.spellcheck).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('913812 - Iframe editor and mention integration popup lack proper IDs.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true,
                },
            });
        });
        it('Should have the id attribute for the body element.', () => {
            expect(editor.inputElement.id).toBe(editor.getID() + '_rte-edit-view');
        });
        afterAll(() => {
            destroy(editor);
        });
    });

    describe('913740 - Default Font size and Font family property not applied to the Iframe editor.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true,
                },
                fontSize: {
                    default: '12pt'
                },
                fontFamily: {
                    default: 'Segoe UI'
                },
            });
        });
        it('Should have the font size and font family attribute on initial rendering to the body element.', () => {
            expect(editor.inputElement.style.fontSize).toBe('12pt');
            expect(editor.inputElement.style.fontFamily).toBe('"Segoe UI"');
        });
        afterAll(() => {
            destroy(editor);
        });
    });

    describe('913748 - Iframe Editor content have line height style issues.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true,
                },
                fontSize: {
                    default: '12pt'
                },
                fontFamily: {
                    default: 'Segoe UI'
                },
            });
        });
        it('Should have the e-content classname on initial rendering to the body element.', () => {
            expect(editor.inputElement.classList.contains('e-content')).toBe(true);
        });
        afterAll(() => {
            destroy(editor);
        });
    });

    describe('913668 - Handle Class-Based Styles for the table in Iframe Mode.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true,
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        it('Should get the height from .', () => {
            const currentWindow: Window = editor.inputElement.ownerDocument.defaultView;
            const table: HTMLTableElement = editor.inputElement.querySelector('table') as HTMLTableElement;
            let tableBorder: string = currentWindow.getComputedStyle(table.rows[0].cells[1]).border;
            expect(tableBorder).toBe('1px solid rgb(189, 189, 189)');
            table.classList.remove('e-rte-table');
            expect(currentWindow.getComputedStyle(table.rows[0].cells[1]).border).toBe('0px none rgb(0, 0, 0)');
        });
        afterAll(() => {
            destroy(editor);
        });
    });

    describe('913830 - Page scrolls when the iframe mode is enabled. CASE 1', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true,
                },
            });
        });
        it('Should have the overflow-y to be hidden on initial rendering to the body element.', () => {
            expect(editor.inputElement.style.overflowY).toBe('hidden');
        });
        afterAll(() => {
            destroy(editor);
        });
    });

    describe('913830 - Page scrolls when the iframe mode is enabled. CASE 2', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true,
                },
                height: 400
            });
        });
        it('Should not have the overflow-y to be hidden on initial rendering to the body element.', () => {
            expect(editor.inputElement.style.overflowY).not.toBe('hidden');
        });
        afterAll(() => {
            destroy(editor);
        });
    });

    describe('917928 - Slow Image resizing in IFrame Editor is not smooth.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true,
                },
                value: `<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 100%; height: 400px;">`,
                height: 400
            });
        });
        it('Should have the box sizing border border box for the image.', () => {
            const image: HTMLImageElement = editor.inputElement.querySelector('img') as HTMLImageElement;
            const computedStyle: CSSStyleDeclaration = editor.inputElement.ownerDocument.defaultView.getComputedStyle(image);
            expect(computedStyle.boxSizing).toBe('border-box');
        });
        afterAll(() => {
            destroy(editor);
        });
    });
});
