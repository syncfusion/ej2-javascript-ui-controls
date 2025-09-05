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
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
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
            expect(sourceCode.title === 'Ver código (Ctrl+Shift+H)').toBe(true);
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
    describe('957549: Improve the re-structuring of the editor input value for editor', () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = ``;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: innerHTML,
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            controlId = rteObj.element.id;
            done();
        });

        it('Formatting while source code to preview rendering', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            item.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = rteObj.element.querySelector(".e-rte-srctextarea");
                textarea.value = `<div>hello <p>World</p></div>`;
                let item = rteObj.element.querySelector('#' + controlId + '_toolbar_Preview') as HTMLElement;
                item.click();
                setTimeout(() => {
                    expect((rteObj as any).inputElement.innerHTML === `<div><p>hello </p><p>World</p></div>`).toBe(true);
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
            expect(rteObj.rootContainer.classList.contains('e-source-code-enabled')).toBe(true);
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
            expect((rteObj as any).element.querySelector("e-rte-placeholder")).toBe(null);
        });
    });

    describe('950769 Implement HTML Formatting and Indentation Logic for Source Code View for block element tags', () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br/></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline" /></p>`;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: innerHTML,
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            done();
        });

        it('Alignment and indentation while source code to preview rendering', (done) => {
            let button: HTMLElement = rteObj.element.querySelector(".e-tbar-btn");
            button.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = rteObj.element.querySelector(".e-rte-srctextarea");
                expect(textarea.value === `<h1>Welcome to the Syncfusion Rich Text Editor</h1>\n<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>\n<h2>Do you know the key features of the editor?</h2>\n<ul>\n   <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li>\n   <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li>\n   <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li>\n   <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li>\n   <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li>\n   <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li>\n</ul>\n<blockquote>\n   <p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p>\n</blockquote>\n<h2>Unlock the Power of Tables</h2>\n<p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p>\n<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px">\n   <thead style="height: 16.5563%">\n      <tr style="height: 16.5563%">\n         <th style="width: 12.1813%"><span>S No</span><br/></th>\n         <th style="width: 23.2295%"><span>Name</span><br/></th>\n         <th style="width: 9.91501%"><span>Age</span><br/></th>\n         <th style="width: 15.5807%"><span>Gender</span><br/></th>\n         <th style="width: 17.9887%"><span>Occupation</span><br/></th>\n         <th style="width: 21.1048%">Mode of Transport</th>\n      </tr>\n   </thead>\n   <tbody>\n      <tr style="height: 16.5563%">\n         <td style="width: 12.1813%">1</td>\n         <td style="width: 23.2295%">Selma Rose</td>\n         <td style="width: 9.91501%">30</td>\n         <td style="width: 15.5807%">Female</td>\n         <td style="width: 17.9887%"><span>Engineer</span><br/></td>\n         <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td>\n      </tr>\n      <tr style="height: 16.5563%">\n         <td style="width: 12.1813%">2</td>\n         <td style="width: 23.2295%"><span>Robert</span><br/></td>\n         <td style="width: 9.91501%">28</td>\n         <td style="width: 15.5807%">Male</td>\n         <td style="width: 17.9887%"><span>Graphic Designer</span></td>\n         <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td>\n      </tr>\n      <tr style="height: 16.5563%">\n         <td style="width: 12.1813%">3</td>\n         <td style="width: 23.2295%"><span>William</span><br/></td>\n         <td style="width: 9.91501%">35</td>\n         <td style="width: 15.5807%">Male</td>\n         <td style="width: 17.9887%">Teacher</td>\n         <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td>\n      </tr>\n      <tr style="height: 16.5563%">\n         <td style="width: 12.1813%">4</td>\n         <td style="width: 23.2295%"><span>Laura Grace</span><br/></td>\n         <td style="width: 9.91501%">42</td>\n         <td style="width: 15.5807%">Female</td>\n         <td style="width: 17.9887%">Doctor</td>\n         <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td>\n      </tr>\n      <tr style="height: 16.5563%">\n         <td style="width: 12.1813%">5</td>\n         <td style="width: 23.2295%"><span>Andrew James</span><br/></td>\n         <td style="width: 9.91501%">45</td>\n         <td style="width: 15.5807%">Male</td>\n         <td style="width: 17.9887%">Lawyer</td>\n         <td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td>\n      </tr>\n   </tbody>\n</table>\n<h2>Elevating Your Content with Images</h2>\n<p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p>\n<p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p>\n<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"/></p>`).toBe(true);
                button = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_Preview');
                button.click();
                const expectedValue: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li> </ul><blockquote> <p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p> </blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td> <td style="width: 23.2295%"><span>Andrew James</span><br></td> <td style="width: 9.91501%">45</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Lawyer</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td> </tr> </tbody> </table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"></p>`;
                setTimeout(() => {
                    expect((rteObj as any).inputElement.innerHTML === expectedValue ).toBe(true);
                    done();
                });
            });
        });

        it('table formatting while source code to preview rendering', (done) => {
            rteObj.focusIn();
            rteObj.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>`;
            rteObj.dataBind();
            let button: HTMLElement = rteObj.element.querySelector(".e-tbar-btn");
            button.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = rteObj.element.querySelector(".e-rte-srctextarea");
                expect(textarea.value === `<table class="e-rte-table" style="width: 100%; min-width: 0px;">\n   <colgroup>\n      <col style="width: 33.3333%;">\n      <col style="width: 33.3333%;">\n      <col style="width: 33.3333%;">\n   </colgroup>\n   <tbody>\n      <tr>\n         <td><br></td>\n         <td><br></td>\n         <td><br></td>\n      </tr>\n      <tr>\n         <td><br></td>\n         <td><br></td>\n         <td><br></td>\n      </tr>\n      <tr>\n         <td><br></td>\n         <td><br></td>\n         <td><br></td>\n      </tr>\n   </tbody>\n</table>\n<p><br></p>`);
                done();
            });
        });

        it('nested list formatting while source code to preview rendering', (done) => {
            rteObj.focusIn();
            rteObj.value = `<ul><li>list 1<ul><li>sublist 2</li><li>sublist 2<ul><li>nested 1</li><li>nested 2</li></ul></li></ul></li></ul>`;
            rteObj.dataBind();
            let button: HTMLElement = rteObj.element.querySelector(".e-tbar-btn");
            button.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = rteObj.element.querySelector(".e-rte-srctextarea");
                expect(textarea.value === `<ul>\n   <li>list 1\n      <ul>\n         <li>sublist 2</li>\n         <li>sublist 2\n            <ul>\n               <li>nested 1</li>\n               <li>nested 2</li>\n            </ul>\n         </li>\n      </ul>\n   </li>\n</ul>`);
                done();
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('975149 - Source Code Alignment in Syncfusion Rich Text Editor Collapses After click outside of the editor', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            rteObj.value = '<p>Initial Content</p><p>rich text editor</p>';
            rteObj.dataBind();
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('alignment and indentaion maintains while focusing out of the editor', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            sourceCode.click();
            rteObj.focusIn();
            let item: HTMLInputElement = rteObj.element.querySelector('.e-rte-srctextarea');
            expect(item.value === '<p>Initial Content</p>\n<p>rich text editor</p>').toBe(true);
            rteObj.isBlur = true;
            rteObj.focusOut();
            setTimeout(() => {
                expect(item.value === '<p>Initial Content</p>\n<p>rich text editor</p>').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('978168 - Font name not updated properly', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            rteObj.value = `<p><span style="font-family: &quot;Segoe UI&quot;;">RTE</span></p>
<p><span style="font-family: &quot;Times New Roman&quot;, Times, serif;">RTE</span></p>
<p><span style="font-family: Verdana, Geneva, sans-serif;">RTE</span></p>`;
            rteObj.dataBind();
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Font name should be updated', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            sourceCode.click();
            rteObj.focusIn();
            let item: HTMLInputElement = rteObj.element.querySelector('.e-rte-srctextarea');
            let expectedValue: string = `<p><span style="font-family: &quot;Segoe UI&quot;;">RTE</span></p>
<p><span style="font-family: &quot;Times New Roman&quot;, Times, serif;">RTE</span></p>
<p><span style="font-family: Verdana, Geneva, sans-serif;">RTE</span></p>`
            expect(item.value === expectedValue).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
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
            expect((<any>rteObj).value === '&lt;table class="e-rte-table"&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;Provide the tool bar support, its also customizable.&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;').toBe(true);
            expect((<any>rteObj).getHtml() === '&lt;table class="e-rte-table"&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;Provide the tool bar support, its also customizable.&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;').toBe(true);
            rteObj.enableHtmlEncode = false;
            rteObj.dataBind();
            expect((<any>rteObj).getHtml() === '<table class="e-rte-table"><tbody><tr><td>Provide the tool bar support, its also customizable.</td></tr></tbody></table>').toBe(true);
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<table class="e-rte-table"> <tbody> <tr> <td>Provide the tool bar support, its also customizable.</td> </tr> </tbody> </table>').toBe(true);
            rteObj.sourceCodeModule.mouseDownHandler();
        });
    });

     describe("EJ2-969879 - Character limit is not enforced in code view, allowing the user to exceed the maximum length in RichTextEditor", () => {
        let rteObj: any;
        let rteEle: HTMLElement;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                showCharCount: true,
                maxLength: 25
            });
            rteEle = rteObj.element;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it('Now, the Rich Text Editor works properly by enforcing the character limit in code view, preventing users from exceeding the maximum allowed length.', () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Code View (Ctrl+Shift+H)");
            rteObj.contentModule.getEditPanel().innerHTML = '<p>Provide a toolbar support</p>';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect((<any>rteObj).element.querySelector('.e-rte-srctextarea')).not.toBe(null);
            (<any>rteObj).element.querySelector('.e-rte-srctextarea').value = '<p>Provide a toolbar support</p>ggggg';
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p>Provide a toolbar support</p>').toBe(true);
        });
    });

    describe("977398 - Safari - Cursor position improper when going from source code to preview", () => {
        let rteObj: any;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Should maintain the cursor at the start of the editor when switching to code view and back to preview', (done) => {
            rteObj.contentModule.getEditPanel().innerHTML = '<p>Provide a toolbar support</p>';
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            trgEle = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            trgEle.click();
            expect(window.getSelection().getRangeAt(0).startContainer.parentElement.innerHTML === 'Provide a toolbar support').toBe(true);
            expect(window.getSelection().getRangeAt(0).startOffset === 0).toBe(true);
            expect(window.getSelection().getRangeAt(0).endOffset === 0).toBe(true);
            done();
        });
    });
});
