/**
 * View source spec
 */
import { Browser, L10n } from "@syncfusion/ej2-base";
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from './../render.spec';

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
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
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
    describe("EJ2-67309 - Source Code and preview toolbar icon localization text are not shown properly when you hover the icons", () => {
        let rteObj : RichTextEditor;
        L10n.load({
            'de-DEF': {
                'richtexteditor': { 
                    "sourcecode": "Ver código",
                    "preview": "Vista previa", 
                   }
               }
        });
        beforeAll( () =>{
            rteObj = renderRTE({
                locale: 'de-DEF',
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value : `<p><b>Toolbar</b></p>
                <ol>
                    <li> 
                        <p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p>
                    </li>
                    <li> 
                        <p>The Toolbar is fully customizable </p>
                    </li>
                </ol>`
            });
        });
        it('check tooltiptext update with locale value', () => {
            rteObj.focusIn();
            let sourceCode: HTMLElement = <HTMLElement>document.body.querySelectorAll(".e-toolbar-items")[0].childNodes[0];
            expect(sourceCode.title === 'Ver código').toBe(true);
            sourceCode.click();
            const preview: HTMLElement = <HTMLElement>document.body.querySelectorAll(".e-toolbar-items")[0].childNodes[0];
            expect(preview.title === 'Vista previa').toBe(true);
            preview.click();
            sourceCode = <HTMLElement>document.body.querySelectorAll(".e-toolbar-items")[0].childNodes[0];
            expect(sourceCode.title === 'Ver código').toBe(true);
        });
        afterAll( () => {
            destroy(rteObj);
        });
    });
    describe('Toolbar focus testing', () => {
        let rteObj: any;
        let rteEle: HTMLElement;
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            char: '',
            key: '',
            charCode: 22,
            keyCode: 22,
            which: 22,
            code: 22,
            action: '',
            type: 'keydown'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        it('open source code and toolbar focus using keyboard event', () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
            rteObj.contentModule.getEditPanel().innerHTML = '<p>data</p>';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            keyboardEventArgs.action = 'toolbar-focus';
            (<any>rteObj).sourceCodeModule.previewKeyDown(keyboardEventArgs);
            let focusEle: HTMLElement = rteObj.toolbarModule.baseToolbar.toolbarObj.element.querySelector('button');
            expect(document.activeElement === focusEle).toBe(true);
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

    describe('Value null with textarea value testing', () => {
        /* EJ2-26270 - IE 11 Null is displayed when clicking on code view */
        let rteObj: any;
        let rteEle: HTMLElement;
        let trgEle: HTMLElement;

        it('DIV', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
            expect(rteObj.contentModule.getEditPanel().innerHTML).toBe("<p><br></p>");
            expect(rteObj.value).toBe(null);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '').toBe(true);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML).toBe("<p><br></p>");
            expect(rteObj.value).toBe(null);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '').toBe(true);
            ((<any>rteObj).element.querySelector('.e-rte-srctextarea') as HTMLTextAreaElement).value = '<p>datamanager</p>';
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '<p>datamanager</p>').toBe(true);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML).toBe("<p>datamanager</p>");
            expect(rteObj.value).toBe('<p>datamanager</p>');
        });

        it('IFrame', () => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
            expect(rteObj.contentModule.getEditPanel().innerHTML).toBe("<p><br></p>");
            expect(rteObj.value).toBe(null);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '').toBe(true);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML).toBe("<p><br></p>");
            expect(rteObj.value).toBe(null);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '').toBe(true);
            ((<any>rteObj).element.querySelector('.e-rte-srctextarea') as HTMLTextAreaElement).value = '<p>datamanager</p>';
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea').value === '<p>datamanager</p>').toBe(true);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML).toBe("<p>datamanager</p>");
            expect(rteObj.value).toBe('<p>datamanager</p>');
        });

        afterEach(() => {
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
        let innerHTML: string = "<p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>";
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: innerHTML,
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
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
    describe(' SourceCode item changes - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<span id="rte">RTE</span>',
                placeholder: 'Type something'
            });
            rteObj.toolbarSettings.items = ['Undo', 'Redo', '|',
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'SubScript', 'SuperScript', '|',
                'LowerCase', 'UpperCase', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
                '|', 'ClearFormat'];

            rteObj.dataBind();
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it(' Test - Click the SourceCode item and click the Preview item', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            item.click();
            expect((rteObj as any).inputElement.style.display === 'none').toBe(true);
            let tag: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
            expect(tag.value === '<p><span id="rte">RTE</span></p>').toBe(true);
            tag.value = '<p id="rte">RTE</p>';
            expect(rteObj.element.querySelectorAll(".e-toolbar-item:not(.e-overlay):not(.e-separator)").length === 1).toBe(true);
            item = rteObj.element.querySelector('#' + controlId + '_toolbar_Preview');
            item.click();
            expect((rteObj as any).inputElement.innerHTML === '<p id="rte">RTE</p>').toBe(true);
            (rteObj as any).inputElement.innerHTML = '<div id="rte">RTE</div>'
            item = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            item.click();
            tag = rteObj.element.querySelector('.e-rte-srctextarea');
            expect(tag.value === '<div id="rte">RTE</div>').toBe(true);
            tag.value = '';
            item = rteObj.element.querySelector('#' + controlId + '_toolbar_Preview');
            item.click();
            expect((rteObj as any).inputElement.innerHTML === '<p><br></p>').toBe(true);
        });
    });
    describe('Checking the placeholder for Iframe mode', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                placeholder: 'Type something',
                iframeSettings: { enable: true }
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('If the placeholder is null or set', () => {
            expect((rteObj as any).value).toBe(null);
            expect((rteObj as any).placeholder).toBe("Type something");
            rteObj.showSourceCode();
            expect((rteObj as any).element.querySelector("rte-placeholder")).toBe(null);
        });
    });

    describe("EJ2-62919 - Checking the table class is added in the preview mode to code view", () => {
        let rteObj: any;
        let rteEle: HTMLElement;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
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
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it('Test - Checking the table class is added in the preview to code view', () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
            rteObj.contentModule.getEditPanel().innerHTML = '<table><tbody><tr><td><p>Provide the tool bar support, its also customizable.</p></td></tr></tbody></table>';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            rteObj.enableHtmlEncode = true;
            rteObj.dataBind();
            expect((<any>rteObj).value === '&lt;table class="e-rte-table"&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;&lt;p&gt;Provide the tool bar support, its also customizable.&lt;/p&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;').toBe(true);
            expect((<any>rteObj).getHtml() === '&lt;table class="e-rte-table"&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;&lt;p&gt;Provide the tool bar support, its also customizable.&lt;/p&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;').toBe(true);
            rteObj.enableHtmlEncode = false;
            rteObj.dataBind();
            expect((<any>rteObj).getHtml() === '<table class="e-rte-table"><tbody><tr><td><p>Provide the tool bar support, its also customizable.</p></td></tr></tbody></table>').toBe(true);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<table class="e-rte-table"><tbody><tr><td><p>Provide the tool bar support, its also customizable.</p></td></tr></tbody></table>').toBe(true);
            rteObj.sourceCodeModule.mouseDownHandler();
        });
    });
    describe('858234-Scrollbar appears when the Rich Text Editor is in the code view', () => {
        let rteObj: any;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode','Bold']
                },
            });
            rteEle = rteObj.element;
        });

        it('Test - Code view height testing when height API is auto', () => {
            const contentElement = rteEle.querySelector('.e-rte-content') as HTMLElement | null;
            const contentHeight: number = contentElement.offsetHeight;
            const trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            const textareaElement = rteEle.querySelector('.e-rte-srctextarea') as HTMLElement | null;
            const textareaHeight: string | null = textareaElement.style.height;      
            expect(parseInt(textareaHeight)).toBe(contentHeight);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});