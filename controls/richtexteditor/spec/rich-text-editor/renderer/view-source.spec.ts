import { Browser } from "@syncfusion/ej2-base";
import { Toolbar } from '../../../src/rich-text-editor/index';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy } from './../render.spec';
import { QuickToolbar, MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar);

describe('Toolbar - view html', () => {
    describe('div content source code', () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                },
                actionBegin: (e) => {
                    expect(e.name === 'actionBegin').toBe(true);
                },
                actionComplete: (e) => {
                    expect(e.name === 'actionComplete').toBe(true);
                },
                change: (e) => {
                    expect(e.value === rteObj.inputElement.innerHTML).toBe(true);
                }
            });
            rteEle = rteObj.element;
        });

        it('open view html', () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View");
            rteObj.contentModule.getEditPanel().innerHTML = '<p>data</p>';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '<p>data</p>').toBe(true);
            rteObj.enableHtmlEncode = true;
            rteObj.dataBind();
            expect((<any>rteObj).value === '&lt;p&gt;data&lt;/p&gt;').toBe(true);
            expect((<any>rteObj).getHtml() === '&lt;p&gt;data&lt;/p&gt;').toBe(true);
            rteObj.enableHtmlEncode = false;
            rteObj.dataBind();
            expect((<any>rteObj).getHtml() === '<p>data</p>').toBe(true);
            (<any>rteObj).element.querySelector('.e-rte-srctextarea').value = '<p>datamanager</p>';
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>datamanager</p>').toBe(true);
            rteObj.sourceCodeModule.mouseDownHandler();
        });

        it('Mobile - open view html', () => {
            Browser.userAgent = mobileUA;
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Source Code");
            rteObj.contentModule.getEditPanel().innerHTML = '<p>data</p>';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '<p>data</p>').toBe(true);
            (<any>rteObj).element.querySelector('.e-rte-srctextarea').value = '<p>datamanager</p>';
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>datamanager</p>').toBe(true);
            Browser.userAgent = defaultUA;
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('RTE iframe source code', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                }
            });
            elem = rteObj.element;
            done();
        });
        it('iframe open view html', () => {
            expect(rteObj.element.querySelector('iframe')).not.toBe(null);
            rteObj.contentModule.getEditPanel().innerHTML = '<p>data</p>';
            let trgEle: HTMLElement = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[0];
            let doc = rteObj.contentModule.getDocument();
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '<p>data</p>').toBe(true);
            rteObj.enableHtmlEncode = true;
            rteObj.dataBind();
            expect((<any>rteObj).value === '&lt;p&gt;data&lt;/p&gt;').toBe(true);
            expect((<any>rteObj).getHtml() === '&lt;p&gt;data&lt;/p&gt;').toBe(true);
            rteObj.enableHtmlEncode = false;
            rteObj.dataBind();
            expect((<any>rteObj).getHtml() === '<p>data</p>').toBe(true);
            (<any>rteObj).element.querySelector('.e-rte-srctextarea').value = '<p>datamanager</p>';
            rteObj.sourceCodeModule.updateSourceCode();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>datamanager</p>').toBe(true);
            rteObj.sourceCodeModule.sourceCode();
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Undo and redo toolbar status', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold', 'Undo', 'Redo']
                },
                value: '<p>data</p>'
            });
            elem = rteObj.element;
            done();
        });
        it(' toolbar status after open the preview mode - undo and redo', () => {
            let trgEle: HTMLElement = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            trgEle = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[1];
            expect(trgEle.classList.contains('e-overlay')).toBe(true);
            trgEle = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[2];
            expect(trgEle.classList.contains('e-overlay')).toBe(true);
            trgEle = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[3];
            expect(trgEle.classList.contains('e-overlay')).toBe(true);
            trgEle = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            trgEle = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[1];
            expect(trgEle.classList.contains('e-overlay')).toBe(false);
            trgEle = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[2];
            expect(trgEle.classList.contains('e-overlay')).toBe(true);
            trgEle = <HTMLElement>elem.querySelectorAll(".e-toolbar-item")[3];
            expect(trgEle.classList.contains('e-overlay')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('RTE value with HTML tag string', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let innerHTML: string = "<p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>";
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: innerHTML,
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            elem = rteObj.element;
            done();
        });

        it('EJ2-13499 - Inner text of element tag convert into the element after the change from source code to preview mode.', (done) => {
            let button: HTMLElement = rteObj.element.querySelector(".e-tbar-btn");
            button.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = rteObj.element.querySelector(".e-rte-srctextarea");
                expect(textarea.value === '<p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>').toBe(true);
                button.click();
                setTimeout(() => {
                    expect((rteObj as any).inputElement.innerHTML === '<p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>').toBe(true);
                    done();
                });
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
});