import { createElement, detach, isNullOrUndefined, L10n, Browser, isVisible } from "@syncfusion/ej2-base";
import { FormValidator } from "@syncfusion/ej2-inputs";
import { ENTERKEY_EVENT_INIT, NUMPAD_ENTER_EVENT_INIT, INSRT_IMG_EVENT_INIT, ESCAPE_KEY_EVENT_INIT, BASIC_MOUSE_EVENT_INIT } from "../constant.spec";
import { renderRTE, setCursorPoint, destroy, dispatchEvent } from "../rich-text-editor/render.spec";
import { RichTextEditor } from "../../src/rich-text-editor/base/rich-text-editor";
import { ActionBeginEventArgs } from "../../src/common/interface";
import { NodeSelection } from "../../src/selection/selection";
import { SelectionCommands } from "../../src/editor-manager/plugin/selection-commands";
import { ImageCommand } from '../../src/editor-manager/plugin/image';
import { cleanHTMLString, getStructuredHtml } from "../../src/common/util";

describe('Editor specs', ()=> {
    describe('EJ2-20672 - Full Screen not working properly when render inside the overflow element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        let divElem: HTMLTextAreaElement;
        let innerData: string = `<textarea style = "overflow: auto; width: 100%; height: 200px;"> In RichTextEditor , you click the toolbar buttons to format the words and the changes are visible immediately.
        Markdown is not like that. When you format the word in Markdown format, you need to add Markdown syntax to the word to indicate which words 
        and phrases should look different from each other.
        RichTextEditor supports markdown editing when the editorMode set as **markdown** and using both *keyboard interaction* and *toolbar action*, you can apply the formatting to text.Q
        We can add our own custom formation syntax for the Markdown formation, [sample link](https://ej2.syncfusion.com/home/).
        The third-party library <b>Marked</b> is used in this sample to convert markdown into HTML content. </textarea>`
        beforeAll(() => {
            divElem = <HTMLTextAreaElement>createElement('div', { styles: 'overflow: auto; border: 1px solid;' });
            elem = <HTMLTextAreaElement>createElement('textarea', { id: 'rte_test_EJ2_20672', attrs: { name: 'formName' } });
            document.body.appendChild(divElem);
            divElem.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
        });

        it('Full Screen Handler when render inside the overflow element', (done: DoneFn) => {
            rteObj.focusIn();
            (rteObj as any).inputElement.innerHTML = innerData;
            rteObj.showFullScreen();
            expect(divElem.classList.contains("e-rte-overflow")).toBe(true);
            expect(rteObj.element.classList.contains("e-rte-full-screen")).toBe(true);
            done();
        });

        afterAll(() => {
            destroy(rteObj);
            detach(divElem);
        });
    }); 

    describe('RTE - Incident issues', () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<ol>
        <li>
            <p>Provide
        the tool bar support, it’s also customizable.</p>
        </li>
        <li>
            <p>Options
            to get the HTML elements with styles.</p></li>
        <li>
            <p>Support
            to insert image from a defined path.</p></li>
        <li>
            <p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>
        <li>
            <p>Re-size
            the editor support.</p></li>
        <li>
            <p>Provide
            efficient public methods and client side events.</p></li>
        <li>
            <p>Keyboard
            navigation support.</p></li>
        </ol>`;
        beforeAll(() => {
            rteObj = renderRTE({
                value: innerHTML
            });
        });

        it('I213118 => EJ2-15261 - RTE removes spacing between words when content is pasted from a word document', () => {
            innerHTML = getStructuredHtml(cleanHTMLString(innerHTML, rteObj.inputElement), 'P', false);
            expect((rteObj as any).inputElement.innerHTML === innerHTML).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-18135 - name attribute of textarea element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        beforeAll(() => {
            elem = <HTMLTextAreaElement>createElement('textarea', { id: 'rte_test_EJ2_18135', attrs: { name: 'formName' } });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
        });

        it('name attribute to textarea element', () => {
            expect((rteObj as any).valueContainer.getAttribute('name') === 'formName').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-18135 - name attribute of div element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLDivElement;
        beforeAll(() => {
            elem = <HTMLDivElement>createElement('div', { id: 'rte_test_div_EJ2_18135', attrs: { name: 'formName' } });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
        });

        it('name attribute to div element', () => {
            expect((rteObj as any).valueContainer.getAttribute('name') === 'formName').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-18212 - RTE - Edited changes are not reflect using getHTML method through console window.', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something'
            });
            rteObj.saveInterval = 10;
            rteObj.dataBind();
            done();
        });
        it("AutoSave the value in interval time", (done) => {
            rteObj.focusIn();
            (rteObj as any).inputElement.innerHTML = `<div><p>First p node-1</p></div>`;
            expect(rteObj.value !== '<div><p>First p node-1</p></div>').toBe(true);
            setTimeout(() => {
                expect(rteObj.value === '<div><p>First p node-1</p></div>').toBe(true);
                (rteObj as any).inputElement.innerHTML = `<div><p>First p node-2</p></div>`;
                expect(rteObj.value !== '<div><p>First p node-2</p></div>').toBe(true);
                setTimeout(() => {
                    expect(rteObj.value === '<div><p>First p node-2</p></div>').toBe(true);
                    done();
                }, 400);
            }, 400);
        });
        it(" Clear the setInterval at component blur", (done) => {
            rteObj.focusOut();
            (rteObj as any).inputElement.innerHTML = `<div><p>First p node-1</p></div>`;
            expect(rteObj.value !== '<div><p>First p node-1</p></div>').toBe(true);
            setTimeout(() => {
                expect(rteObj.value === '<div><p>First p node-1</p></div>').toBe(false);
                done();
            }, 110);
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
  
    describe('EJ2-20436 - Changing font color of underlined text doesn’t changes the color of the line in RTE', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Underline', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Apply the underline and then apply the fontcolor', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
            dispatchEvent(item, 'mousedown');
            item = (item.nextElementSibling.childNodes[0] as HTMLElement);
            item.click();
            dispatchEvent(item, 'mousedown');
            setTimeout(() => {
                let span: HTMLSpanElement = pEle.querySelector('span span');
                expect(span.parentElement.style.color === 'rgb(255, 0, 0)').toBe(true);
                expect(span.parentElement.style.textDecoration === 'inherit').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-20463 - Change event is triggered on clicking into html source code view in Edge browser', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let triggerChange: boolean = false;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p id="rte">RichTextEditor</p>`,
                enableHtmlEncode: true,
                change: () => {
                    triggerChange = true;
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            rteObj.saveInterval = 100;
            rteObj.dataBind();
            done();
        });
        it(' change event not trigger while click on source code without edit ', (done) => {
            rteObj.focusIn();
            expect(triggerChange).toBe(false);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEvent(item, 'mousedown');
            item.click();
            expect(triggerChange).toBe(false);
            setTimeout(() => {
                expect(triggerChange).toBe(false);
                done();
            }, 110);
        });

        it(' change event trigger while click on source code with edit ', (done) => {
            rteObj.focusIn();
            expect(triggerChange).toBe(false);
            (rteObj as any).inputElement.innerHTML = `<p id="rte">RichTextEditor component</p>`;
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEvent(item, 'mousedown');
            item.click();
            expect(triggerChange).toBe(true);
            triggerChange = false;
            setTimeout(() => {
                expect(triggerChange).toBe(false);
                done();
            }, 110);
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

    describe('EJ2-21471  -  RTE data annotation validation is not worked', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement = createElement('div', {
            id: "form-element", innerHTML:
                ` <div class="form-group">
                    <textarea id="defaultRTE" ejs-for data-val="RTEValue">
                    </textarea>
                   </div>
                ` });
        beforeAll(() => {
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                placeholder: 'Type something'
            });
            rteObj.appendTo("#defaultRTE");
            rteObj.saveInterval = 0;
            rteObj.dataBind();
        })
        afterAll(() => {
            destroy(rteObj);
            detach(element);
        });

        it(' Set the data annotation attribute to textarea alone ', () => {
            expect(rteObj.element.hasAttribute('ejs-for')).toBe(false);
            expect(rteObj.element.hasAttribute('data-val')).toBe(false);
            expect((rteObj as any).valueContainer.hasAttribute('ejs-for')).toBe(true);
            expect((rteObj as any).valueContainer.hasAttribute('data-val')).toBe(true);
        });
    });

    describe('EJ2-21612  -  To prevent the table quick toolbar when render RTE inside the table ', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement = createElement('div', {
            id: "form-element", innerHTML:
                ` <table>
                <tbody>
                </tbody>
                <tbody>
                    <tr>
                        <td>
                            <div id="defaultRTE">
                            <p id="rte-p"><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                            client side.</p><table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p>&nbsp;Customer easy to edit the contents and get the HTML content for
                            the displayed content. </p>
                            </div>
    
                        </td>
                    </tr>
                </tbody>
            </table>
                ` });
        beforeEach((done: Function) => {
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                placeholder: 'Type something'
            });
            rteObj.appendTo("#defaultRTE");
            rteObj.saveInterval = 0;
            rteObj.dataBind();
            done();
        })
        afterEach((done: Function) => {
            rteObj.destroy();
            detach(element);
            done();
        });

        it(' click on inside of table content for prevent the quick toolbar ', (done) => {
            let firstP: Element = (rteObj as any).inputElement.querySelector('#rte-p');
            setCursorPoint(firstP, 0);
            dispatchEvent(firstP, 'mousedown');
            (firstP as HTMLElement).click();
            dispatchEvent(firstP, 'mouseup');
            setTimeout(() => {
                let popup: HTMLElement = document.querySelector("#defaultRTE_quick_TableRows");
                expect(!isNullOrUndefined(popup)).toBe(false);
                done();
            }, 100)
        });
        it(' click on outside of table content for prevent the quick toolbar ', (done) => {
            let firstP: Element = (rteObj as any).inputElement.querySelector('tr td');
            setCursorPoint(firstP, 0);
            dispatchEvent(firstP, 'mousedown');
            (firstP as HTMLElement).click();
            dispatchEvent(firstP, 'mouseup');
            setTimeout(() => {
                let popup: HTMLElement = document.querySelector("#defaultRTE_quick_TableRows");
                expect(!isNullOrUndefined(popup)).toBe(true);
                done();
            }, 100)
        });
    });

    describe('EJ2-21470 - RichTextEditor Font Size "px" not update in toolbar status and fontFamily "veranda" style not updated properly', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize']
                },
                fontSize: {
                    default: '10px',
                    items: [
                        { text: '8 px', value: '8px' },
                        { text: '10 px', value: '10px' },
                        { text: '12 px', value: '12px' },
                        { text: '14 px', value: '14px' },
                        { text: '18 px', value: '18px' },
                        { text: '24 px', value: '24px' },
                        { text: '36 px', value: '36px' }
                    ]
                },
                value: `<p id="rte"><span id="first-span">RichTextEditor</span><span id="rte-span" style="font-size: 14px;FONT-FAMILY: Verdana;FONT-WEIGHT: normal;FONT-STYLE: normal;">
                The rich text editor is WYSIWYG</span></p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Check the toolbar status while click on fontsize and fontName element ', (done) => {
            let spanEle: HTMLElement = rteObj.element.querySelector('#rte-span');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, spanEle.childNodes[0], spanEle.childNodes[0], 0, 3);
            dispatchEvent(spanEle, 'mousedown');
            dispatchEvent(spanEle, 'mouseup');
            spanEle.click();
            setTimeout(() => {
                let fontSize: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
                let fontName: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
                expect((fontSize.firstElementChild as HTMLElement).innerText.trim()).toBe('14 px');
                expect((fontName.firstElementChild as HTMLElement).innerText.trim()).toBe('Verdana');
                done();
            }, 50)
        });
        it(' Check the toolbar status while click without fontsize element ', (done) => {
            let spanEle: HTMLElement = rteObj.element.querySelector('#first-span');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, spanEle.childNodes[0], spanEle.childNodes[0], 0, 3);
            dispatchEvent(spanEle, 'mousedown');
            dispatchEvent(spanEle, 'mouseup');
            spanEle.click();
            setTimeout(() => {
                let fontSize: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontSize');
                let fontName: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
                expect((fontSize.firstElementChild as HTMLElement).innerText.trim()).toBe('10 px');
                done();
            }, 50)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-21814 - Clicking on view source code with single character inside textarea removes the character.', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>a</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Click the source code with single character ', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEvent(sourceCode, 'mousedown');
            dispatchEvent(sourceCode, 'mouseup');
            sourceCode.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = (rteObj as any).element.querySelector('.e-rte-srctextarea');
                expect(textarea.value === "<p>a</p>").toBe(true);
                done();
            }, 50)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('BLAZ-8584 - Clicking on view source code with small value', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>aaaaa</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Clicking on view source code with small value ', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEvent(sourceCode, 'mousedown');
            dispatchEvent(sourceCode, 'mouseup');
            sourceCode.click();
            setTimeout(() => {
                let textarea: HTMLTextAreaElement = (rteObj as any).element.querySelector('.e-rte-srctextarea');
                expect(textarea.value === "<p>aaaaa</p>").toBe(true);
                done();
            }, 50)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe(' EJ2-218412  -  htmlAttributes "id" is not set to the validation textarea element in RTE ', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement = createElement('div', {
            id: "form-element", innerHTML:
                ` <div class="rte-element"></div>
                ` });
        beforeAll(() => {
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                htmlAttributes: {
                    id: "htmlAttr-id"
                }
            });
            let target: HTMLElement = document.querySelector(".rte-element");
            rteObj.appendTo(target);
        })
        afterAll(() => {
            destroy(rteObj);
            detach(element);
        });

        it(' Render the RTE without ID and set the id via htmlAttributes property ', () => {
            expect(rteObj.element.id === 'htmlAttr-id').toBe(true);
            expect((rteObj as any).valueContainer.id === 'htmlAttr-id-value').toBe(true);
            expect((rteObj as any).inputElement.id === 'htmlAttr-id_rte-edit-view').toBe(true);
        })
    });

    describe('EJ2-22404 - Setting default font styles is not maintained on typing into RTE.', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        it(' Check the default value as null to format, fontSize, fontFamily', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontSize', 'FontName', 'Formats']
                },
                value: `<p>a</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            expect(rteObj.fontFamily.default).toBeNull();
            expect(rteObj.format.default).toBeNull();
            expect(rteObj.fontSize.default).toBeNull();
        });
        it(' Set default value to format, fontSize, fontFamily ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontSize', 'FontName', 'Formats']
                },
                fontSize: { default: '14pt' },
                fontFamily: { default: 'Arial' },
                format: {
                    default: 'Preformatted'
                },
                value: `<p>a</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            let fontSize: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontSize');
            let fontName: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontName');
            let format: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_Formats');
            expect(fontSize.querySelector(".e-rte-dropdown-btn-text").textContent === '14 pt').toBe(true);
            expect(fontName.querySelector(".e-rte-dropdown-btn-text").textContent === 'Arial').toBe(true);
            expect(format.querySelector(".e-rte-dropdown-btn-text").textContent === 'Preformatted').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontSize === '14pt').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontFamily === 'Arial').toBe(true);
        });

        it(' Dynamic Set the default value to format, fontSize, fontFamily', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontSize', 'FontName', 'Formats']
                },
                
                value: `<p>a</p>`
            });
            rteObj.fontSize = { default: '14pt' };
            rteObj.fontFamily = { default: 'Arial' };
            rteObj.format = {
                default: 'Preformatted'
            };
            rteObj.dataBind();
            rteEle = rteObj.element;
            controlId = rteEle.id;
            let fontSize: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontSize');
            let fontName: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontName');
            let format: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_Formats');
            expect(fontSize.querySelector(".e-rte-dropdown-btn-text").textContent === '14 pt').toBe(true);
            expect(fontName.querySelector(".e-rte-dropdown-btn-text").textContent === 'Arial').toBe(true);
            expect(format.querySelector(".e-rte-dropdown-btn-text").textContent === 'Preformatted').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontSize === '14pt').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontFamily === 'Arial').toBe(true);
        });

        it(' Dynamic Set the default value as null to format, fontSize, fontFamily ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontSize', 'FontName', 'Formats']
                },
                fontSize: { default: '14pt' },
                fontFamily: { default: 'Arial' },
                format: {
                    default: 'Preformatted'
                },
                value: `<p>a</p>`
            });
            rteObj.fontSize = { default: null };
            rteObj.fontFamily = { default: null };
            rteObj.format = {
                default: null
            };
            rteObj.dataBind();
            rteEle = rteObj.element;
            controlId = rteEle.id;
            let fontSize: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontSize');
            let fontName: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontName');
            let format: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_Formats');
            expect(fontSize.querySelector(".e-rte-dropdown-btn-text").textContent === 'Font Size').toBe(true);
            expect(fontName.querySelector(".e-rte-dropdown-btn-text").textContent === 'Font Name').toBe(true);
            expect(format.querySelector(".e-rte-dropdown-btn-text").textContent === 'Paragraph').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontSize === '').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontFamily === '').toBe(true);
        });

        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-22524 - Default value should be set while restting form - ', () => {
        let rteObj: RichTextEditor;
        let form: FormValidator;
        let editNode: HTMLElement;
        let containerEle: HTMLElement;
        let onChange: jasmine.Spy;
        let innerHtmlRule: string = `<form id="form-element" class="form-vertical">
        <div class="form-group">
            <textarea id="defaultRTE" name="defaultRTE"> 
            </textarea>
        </div>
        <div style="text-align: center">
            <button id="validateSubmit" class="samplebtn e-control e-btn" type="submit" data-ripple="true">Submit</button>
            <button id="resetbtn" class="samplebtn e-control e-btn" type="reset" data-ripple="true">Reset</button>
        </div>
        </form>`;
        beforeAll(() => {
            containerEle = document.createElement('div');
            containerEle.innerHTML = innerHtmlRule;
            onChange = jasmine.createSpy('change');
            document.body.appendChild(containerEle);
            rteObj = new RichTextEditor({
                showCharCount: true,
                maxLength: 100,
                saveInterval: 10,
                value: '<p>RichTextEditor</p>',
                change: onChange,
                placeholder: 'Type something'
            });
            rteObj.appendTo("#defaultRTE");
            editNode = (rteObj as any).inputElement;
            form = new FormValidator('#form-element', {
                rules: {
                    defaultRTE: {
                        required: true,
                        maxLength: "100",
                        minLength: "20"
                    }
                }
            });
            rteObj.focusIn();
            editNode.innerHTML = '<p>EJ2 RichTextEditor Component</p>';
        })
        afterAll(() => {
            rteObj.destroy();
            detach(containerEle);
        });

        it('Should reset the editor value on the form reset method call.', (done: DoneFn) => {
            rteObj.focusOut();
            let element: HTMLElement = rteObj.element.querySelector('#defaultRTE-info');
            expect(rteObj.value === '<p>EJ2 RichTextEditor Component</p>').toBe(true);
            expect(isNullOrUndefined(element)).toBe(true);
            expect(onChange).toHaveBeenCalled();
            form.reset();
            setTimeout(() => {
                expect(rteObj.value === '<p>RichTextEditor</p>').toBe(true);
                expect(onChange).toHaveBeenCalledTimes(1);
                done();
            }, 100);
        });
    });

    describe('EJ2-22972 - Editor content rendered twice in DOM when using RichTextEditorFor', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        beforeAll(() => {
            elem = <HTMLTextAreaElement>createElement('textarea',
                { id: 'rte_test_EJ2-22972', innerHTML: '<p class="test-paragraph">RichTextEditor</p>' });
            document.body.appendChild(elem);
            elem.setAttribute('ejs-for', '');
            rteObj = new RichTextEditor({
                value: '<p class="test-paragraph">RichTextEditor</p>'
            });
            rteObj.appendTo(elem);
        });

        it(' Check the edit area content in wrapper element', () => {
            expect(rteObj.element.querySelectorAll('.test-paragraph').length === 1).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-22988 - e-lib class not added into control root element, when render RTE using textarea element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        beforeAll(() => {
            elem = <HTMLTextAreaElement>createElement('textarea',
                { id: 'rte_test_EJ2-22988' });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                value: '<p class="test-paragraph">RichTextEditor</p>'
            });
            rteObj.appendTo(elem);
        });

        it(' Check the root element class', () => {
            expect(rteObj.element.classList.contains('e-control')).toBe(true);
            expect(rteObj.element.classList.contains('e-lib')).toBe(true);
            expect(rteObj.element.classList.contains('e-richtexteditor')).toBe(true);
            expect((rteObj as any).valueContainer.classList.contains('e-control')).toBe(false);
            expect((rteObj as any).valueContainer.classList.contains('e-lib')).toBe(false);
            expect((rteObj as any).valueContainer.classList.contains('e-richtexteditor')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    L10n.load({
        'de-DE': {
            'richtexteditor': {
                imageInsertLinkHeader: 'Link einfügen',
                editImageHeader: 'Bild bearbeiten',
                alignmentsDropDownLeft: 'Linksbündig',
                alignmentsDropDownCenter: 'Im Zentrum anordnen',
                alignmentsDropDownRight: 'Rechts ausrichten',
                alignmentsDropDownJustify: 'Justize ausrichten',
                imageDisplayDropDownInline: 'In der Reihe',
                imageDisplayDropDownBreak: 'Brechen',
                tableInsertRowDropDownBefore: 'Reihe vorher einfügen',
                tableInsertRowDropDownAfter: 'Zeile danach einfügen',
                tableInsertRowDropDownDelete: 'Zeile löschen',
                tableInsertColumnDropDownLeft: 'Spalte links einfügen',
                tableInsertColumnDropDownRight: 'Spalte rechts einfügen',
                tableInsertColumnDropDownDelete: 'Spalte löschen',
                tableVerticalAlignDropDownTop: 'Top ausrichten',
                tableVerticalAlignDropDownMiddle: 'Mitte ausrichten',
                tableVerticalAlignDropDownBottom: 'Unten ausrichten',
                tableStylesDropDownDashedBorder: 'Gestrichelte Grenzen',
                tableStylesDropDownAlternateRows: 'Alternative Zeilen'
            }
        }
    });

    describe('EJ2-23134 - Localization not applied to dropdown buttons and its item collections', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                locale: 'de-DE'
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Check the alignments dropdown items ', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments');
            dispatchEvent(item, 'mousedown');
            dispatchEvent(item, 'mouseup');
            item.click();
            setTimeout(() => {
                let items: any = document.querySelectorAll('#' + controlId + '_toolbar_Alignments-popup .e-item');
                expect(items[0].textContent === 'Linksbündig').toBe(true);
                expect(items[1].textContent === 'Im Zentrum anordnen').toBe(true);
                expect(items[2].textContent === 'Rechts ausrichten').toBe(true);
                expect(items[3].textContent === 'Justize ausrichten').toBe(true);
                done();
            }, 200)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-23588 - RichTextEditor inline mode error when color property is displayed in mobile view.', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultUserAgent= navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent="Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36"
            "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Mobile Safari/537.36";
            rteObj = renderRTE({
                value: '<span id="rte">RTE</span>',
                inlineMode: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor', 'Bold']
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it(' Check the fontColor and backgroundColor ', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = (document.querySelector('#' + controlId + '_quick_FontColor').nextElementSibling.childNodes[1] as HTMLElement);
                item.click();
                let popup: HTMLElement = document.querySelector('.e-color-palette');
                expect(!isNullOrUndefined(popup)).toBe(true);
                done();
            }, 200);
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent =defaultUserAgent;
        });
    });

    describe(' EJ2-27026  -  Issue on pressing the Tab key with Table module', () => {
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: 'Tab' };
        let rteObj: RichTextEditor;
        let element: HTMLElement = createElement('div', {
            id: "form-element", innerHTML:
                ` <table>
                <tbody>
                </tbody>
                <tbody>
                    <tr>
                        <td>
                            <div id="defaultRTE">
                            </div>
    
                        </td>
                    </tr>
                </tbody>
            </table>
                ` });
        beforeAll(() => {
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo("#defaultRTE");
            rteObj.saveInterval = 0;
            rteObj.dataBind();
        })
        afterAll(() => {
            destroy(rteObj);
            detach(element);
        });

        it(' press the tab key from edit area ', (done) => {
            rteObj.focusIn();
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(document.activeElement!== rteObj.inputElement).toBe(false);
                done();
            }, 100)
        });
    });

    describe('EJ2-29347 - RTE base refresh method testing', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Syncfusion</p>'
            });
            rteEle = rteObj.element;
        });
        it(' Check the alignments dropdown items ', (done) => {
            expect(rteObj.inputElement.innerHTML).toEqual('<p>Syncfusion</p>');
            rteObj.inputElement.innerHTML = '<p>RTE</p>';
            expect(rteObj.inputElement.innerHTML).toEqual('<p>RTE</p>');
            rteObj.disableToolbarItem(['Bold']);
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay').length).toEqual(3);
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[0].getAttribute('title')).toEqual('Bold (Ctrl+B)');
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[1].getAttribute('title')).toEqual('Undo (Ctrl+Z)');
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[2].getAttribute('title')).toEqual('Redo (Ctrl+Y)');
            rteObj.refresh();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-toolbar-item.e-overlay').length).toEqual(2);
                expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[0].getAttribute('title')).toEqual('Undo (Ctrl+Z)');
                expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[1].getAttribute('title')).toEqual('Redo (Ctrl+Y)');
                done();
            }, 200)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Check maxLength while showCharCount in false', () => {
        let rteObj: RichTextEditor;
      
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>syncfusion</p>',
                maxLength: 10  ,
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Adding letter K when maxLength is reached', () => {
            let keyboardEventArgs : any = {
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: '',
                charCode: 75,
                keyCode: 75,
                which: 75,
                code: 75,
                currentTarget: rteObj.inputElement
            };
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.keyDown(keyboardEventArgs);
            expect(rteObj.inputElement.innerText).toBe('syncfusion');
        });
        it('Check public method -getCharCount', () => {
            expect(rteObj.getCharCount()).toBe(10);
        });
    });

    describe('Change event triggered -readOnly enabled', () => {
        let rteObj: RichTextEditor;
        let changeEvent: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>syncfusion</p>',
                maxLength: 10  ,
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                saveInterval : 1,
                change : function() {
                    changeEvent = true ;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check change event when readonly is enabled', (done: Function) => {
            rteObj.inputElement.focus();
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                    expect(changeEvent).toBe(false);
                    done();
            }, 100);
        });
    });

    describe("Test the toolbar based on focus and blur events", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false,
                    enableFloating: false,
                    items: [
                        "Bold",
                        "Italic",
                        "Underline",
                        "StrikeThrough",
                        "FontName",
                        "FontSize",
                        "FontColor",
                        "BackgroundColor",
                        "LowerCase",
                        "UpperCase",
                        "SuperScript",
                        "SubScript",
                        "|",
                        "Formats",
                        "Alignments",
                        "OrderedList",
                        "UnorderedList",
                        "Outdent",
                        "Indent",
                        "|",
                        "CreateTable",
                        "CreateLink",
                        "Image",
                        "|",
                        "ClearFormat",
                        "Print",
                        "SourceCode",
                        "FullScreen",
                        "|",
                        "Undo",
                        "Redo"
                    ]
                },
                focus: function () {
                    rteObj.toolbarSettings.enable = true;
                    rteObj.dataBind();
                },
                blur: function () {
                    rteObj.toolbarSettings.enable = false;
                    rteObj.dataBind();
                }
            });

            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });
        it("Check toolbar", () => {
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            rteObj.focusIn();
            expect(rteEle.querySelectorAll(".e-toolbar").length).not.toBe(0);
            rteObj.focusOut();
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
        });
    });

    describe('RichTextEditor databinding not working in SourceCode view', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
        });
        it(' Check SourceCode view ', (done) => {
            rteObj.showSourceCode();
            let item: HTMLInputElement = rteObj.element.querySelector('.e-rte-srctextarea');
            rteObj.value = 'rich text editor';
            rteObj.dataBind();
            setTimeout(() => {
                expect((item as HTMLInputElement).value).toBe('<p>rich text editor</p>');
                done();
              }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('BLAZ-5932 - Cannot set font-style after inserting a table', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 13, which: 13, shiftKey: false
        };
        it(' Empty container with table insert after font style apply check ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Formats']
                }
            });
            rteEle = rteObj.element;
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj.tableModule as any).tableObj.tableCellSelect(event);
            (rteObj.tableModule as any).tableObj.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table).not.toBe(null);
            expect(table.querySelectorAll('tr').length === 2).toBe(true);
            expect(table.querySelectorAll('td').length === 8).toBe(true);
            let brTag: Element = document.createElement('br');
            rteObj.contentModule.getEditPanel().appendChild(brTag);
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.contentModule.getEditPanel(), 1);
            (rteObj.formatter.editorManager as any).formatObj.onKeyUp({ event: keyboardEventArgs });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p').length === 1).toBe(true);
        });
        it(' Text container with table insert after font style apply check ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Formats']
                },
                value: '<p>Sample content</p>'
            });
            rteEle = rteObj.element;
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj.tableModule as any).tableObj.tableCellSelect(event);
            (rteObj.tableModule as any).tableObj.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table).not.toBe(null);
            expect(table.querySelectorAll('tr').length === 2).toBe(true);
            expect(table.querySelectorAll('td').length === 8).toBe(true);
            let brTag: Element = document.createElement('br');
            rteObj.contentModule.getEditPanel().insertBefore(brTag, rteObj.contentModule.getEditPanel().querySelector('p'));
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.contentModule.getEditPanel(), 1);
            const enterKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(enterKeyDownEvent);
            const enterKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(enterKeyUpEvent);
            (rteObj.formatter.editorManager as any).formatObj.onKeyUp({ event: keyboardEventArgs });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().childNodes[1].textContent === '').toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p')[0].textContent === '').toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p')[1].textContent === 'Sample content').toBe(true);
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('BLAZ-7176 - Enter key press before the image in a paragraph', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 13, which: 13, shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Formats']
                },
                value: '<p id="p1">Paragraph <img src="blob:null/abfb97c2-cd30-4405-81e0-2993d05bfa35" class="e-rte-image e-imginline" alt="blazor.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>'
            });
        });
        it(' Enter key press before the image in a paragraph ', (done: DoneFn) => {
            rteEle = rteObj.element;
            let start: HTMLElement = document.getElementById('p1');
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, (start.childNodes[0] as Element), 10);
            (rteObj.formatter.editorManager as any).formatObj.onKeyUp({ event: keyboardEventArgs });
            setTimeout(() => {
                expect(rteObj.contentModule.getEditPanel().querySelectorAll('p').length === 1).toBe(true);
                done()
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-37997 - Lists all item selection with delete key action not remove the list completely', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 46, which: 46, shiftKey: false, action: 'delete'
        };
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                }
            });
            done();
        });
        it(' Ordered list with select all item with test ', (done:  DoneFn) => {
            rteObj.inputElement.innerHTML = '<ol><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ol>';
            expect(rteObj.inputElement.querySelectorAll('ol').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.selectAll();
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('ol').length === 0).toBe(true);
                done();
            }, 100);
        });
        it(' Ordered list with select some item with test ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<ol><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ol>';
            expect(rteObj.inputElement.querySelectorAll('ol').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('ol').childNodes[0], rteObj.element.querySelector('ol').childNodes[1], 0, 1);
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('ol').length === 0).toBe(false);
                done();
            }, 100);
        });
        it(' Unordered list with select all item with test ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<ul><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ul>';
            expect(rteObj.inputElement.querySelectorAll('ul').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.selectAll();
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('ul').length === 0).toBe(true);
                done();
            }, 100);
        });
        it(' Unordered list with select some item with test ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<ul><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ul>';
            expect(rteObj.inputElement.querySelectorAll('ul').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('ul').childNodes[0], rteObj.element.querySelector('ul').childNodes[1], 0, 1);
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('ul').length === 0).toBe(false);
                done();
            }, 100);
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

    describe('EJ2-41562 - Script error occurs with toolbar options, when placing the cursor before & after RichTextEditor table', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList']
                }
            });
            done();
        });
        it(' Before the table element ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>';
            rteEle = rteObj.element;
            expect(rteEle.querySelector('.e-content').childNodes.length === 1).toBe(true);
            rteObj.focusIn();
            let targetElm: HTMLElement = rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement;
            targetElm.click();
            setTimeout(() => {
                expect(rteEle.querySelector('.e-content').childNodes.length === 1).toBe(true);
                expect(rteObj.element.querySelectorAll('ol').length === 1).toBe(true);
                expect(rteEle.querySelector('.e-content').childNodes[0].nodeName === 'OL').toBe(true);
                done();
            }, 100);
        });
        it(' After the table element ', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>';
            rteEle = rteObj.element;
            expect(rteEle.querySelector('.e-content').childNodes.length === 1).toBe(true);
            rteObj.focusIn();
            let range: Range = document.createRange();
            range.setStart(rteObj.element.querySelector('.e-content'), 1);
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            //rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.element.querySelector('table'), 0);
            let targetElm: HTMLElement = rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement;
            targetElm.click();
            setTimeout(() => {
                expect(rteEle.querySelector('.e-content').childNodes.length === 2).toBe(true);
                expect(rteObj.element.querySelectorAll('ol').length === 1).toBe(true);
                expect(rteEle.querySelector('.e-content').childNodes[0].nodeName === 'TABLE').toBe(true);
                expect(rteEle.querySelector('.e-content').childNodes[1].nodeName === 'OL').toBe(true);
                done();
            }, 100);
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });

    describe('EJ2-41995 - RichTextEditor showFullscreen method call when read-only is enabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FullScreen']
                },
                readonly : true
            });
        });
        it('Checking Fullscreen view', (done) => {
            rteObj.showFullScreen();
            expect(rteObj.element.classList.contains("e-rte-full-screen")).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
 
    describe('EJ2-59866 - The getText public method returned \n when Rich Text Editor have empty content', () => {
        let rteObj:RichTextEditor;
        let innerHTML: string;
        beforeAll(() => {
            rteObj = renderRTE({ value: innerHTML });
            });
        afterAll(()=>{
            destroy(rteObj);
        })
        it('should return empty string when value is editor is empty ', () => {
            innerHTML= `<p><b></b></p>`;
            expect(rteObj.getText()==="").toBe(true);
        });
    });

    describe('EJ2-60381 - Image resize icon not shown properly when enabled iframe', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let innerHTML: string = `<p style="cursor: auto;"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize e-img-focus" alt="employee-icon.jpg" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px; width: 247px; height: 247px;"> </p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Image']
                },
                value:innerHTML
            });
        });
        afterAll(()=>{
            destroy(rteObj);
        })
        it('check resize element when click image in iframe mode', () => {
            let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            let trg = (iframeBody.querySelector('.e-rte-image') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
        });
    });

    describe('EJ2-60306 - EJ2-60307 - RTE render with empty p tag element', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '<div><p></p></div>'});
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check content div element', () => {
            expect(rteObj.inputElement.innerHTML === '<div><p><br></p></div>').toBe(true);
        });
    });

    describe('EJ2-60306 - EJ2-60307 - RTE render with empty p tag element', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<div><p></p></div>',
                iframeSettings: {
                    enable: true
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check content div element', () => {
            expect(rteObj.inputElement.innerHTML === '<div><p><br></p></div>').toBe(true);
        });
    });

    describe( 'EJ2-62151 - Strikethrough and underline are removed when we select and press shift key on lists in RTE', () =>{
        let defaultRTE: RichTextEditor;
        let innerHTML = `<ol><li><p>Provide
            the tool bar <span class='FocusNode1' style="text-decoration: line-through;">support </span >, its also customizable.</p></li><li><p>Options
            to get the HTML elements with styles.</p></li><li><p>Support
            to insert image from a defined path.</p></li><li><p>Footer
            elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
            the editor support.</p></li><li><p>Provide
            efficient public methods and client side events.</p></li><li><p>Keyboard
            navigation support.</p></li></ol>`;
        beforeAll( () =>{
            defaultRTE = renderRTE( {
                height: 400,
                toolbarSettings: {
                    items: [ 'Undo', 'Redo', '|',
                        'Underline', 'StrikeThrough', '|',
                    ]
                },
                value: innerHTML
            } );
        } );
        afterAll( () =>{
            destroy( defaultRTE );
        } );
        it( 'should not remove current focus of selected text after pressing SHIFT key', () =>{
            let startContainer: any = ( defaultRTE as any ).inputElement.querySelector( '.FocusNode1' ).childNodes[ 0 ];
            let endContainer: any = startContainer;
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'shift', stopPropagation: () => { }, shiftKey: true, which: 16 };
            defaultRTE.formatter.editorManager.nodeSelection.setSelectionText( document, startContainer, endContainer, 0, endContainer.textContent.length )
            keyBoardEvent.keyCode = 16;
            keyBoardEvent.code = 'Shift';
            let style = ( defaultRTE as any ).inputElement.querySelector( '.FocusNode1' ).style.textDecoration;
            expect( style == "line-through" ).toBe( true );
            expect( defaultRTE.inputElement.textContent.length ).toBe( 339 );
            ( defaultRTE as any ).keyDown( keyBoardEvent );
            expect( defaultRTE.inputElement.textContent.length ).toBe( 339 );
            style = ( defaultRTE as any ).inputElement.querySelector( '.FocusNode1' ).style.textDecoration;
            expect( style == "line-through" ).toBe( true );
        } );
    } );

    describe(' EJ2-62704  -  Rich Text Editor unique Id is not generated automatically when we do not set the Id property ', () => {
        let rteObj: RichTextEditor;
        const divElement: HTMLElement = createElement('div', {
            className: 'defaultRTE' });
        beforeAll(() => {
            document.body.appendChild(divElement);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: [ 'Undo', 'Redo', '|',
                        'Underline', 'StrikeThrough', '|'
                    ]
                }
            });
            const target: HTMLElement = document.querySelector('.defaultRTE');
            rteObj.appendTo(target);
        });
        afterAll(() => {
            rteObj.destroy();
            detach(divElement);
        });

        it(' check the id genarated or not ', () => {
            expect(rteObj.element.hasAttribute('id')).toBe(true);
        });
    });

    describe('EJ2-63042 - Tooltip not shown for NumberFormat and BulletFormat List in RTE Toolbar items', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [ 'NumberFormatList', 'BulletFormatList'
                    ]
                },
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check the tooltip', () => {
            expect(document.querySelectorAll('.e-toolbar-item.e-template').length).toEqual(2);
            expect(document.querySelectorAll('.e-toolbar-item.e-template')[0].getAttribute('title')).toEqual('Number Format List (Ctrl+Shift+O)');
            expect(document.querySelectorAll('.e-toolbar-item.e-template')[1].getAttribute('title')).toEqual('Bullet Format List (Ctrl+Alt+O)');
        });
    });

    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 1' , () => {
        let rteObject : RichTextEditor ;
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'FontSize','SuperScript', 'SubScript', 'FontColor']
                } ,value:'Testing'
            });
        })
        afterEach( (done: DoneFn) => {
            destroy(rteObject);
            done();
        })
        it('should add span element with font size to around the text node', (done: Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('.e-content');
            let range : Range = new Range();
            range.setStart( contentElem.firstChild.firstChild,0 );
            range.setEnd( contentElem.firstChild.firstChild,7 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const toolbarButtons : NodeList = document.body.querySelectorAll('.e-tbar-btn');
            ( toolbarButtons[0] as HTMLElement ).click(); // Bold
            ( toolbarButtons[1] as HTMLElement ).click(); // Italic
            ( toolbarButtons[2] as HTMLElement ).click(); // Underline
            ( toolbarButtons[3] as HTMLElement ).click(); // StrikeThrough
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            (dropButton[0] as HTMLElement).click(); // Font size
            const dropItems : NodeList= document.body.querySelectorAll('.e-item');
            (dropItems[7] as HTMLElement).click(); // Apply 34 pt
            const correctElementString : string = `<p><span style="font-size: 36pt;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">Testing</span></span></em></strong></span></p>`;
            expect(rteObject.inputElement.innerHTML === correctElementString).toBe(true);
            ( toolbarButtons[3] as HTMLElement ).click(); // Bold
            ( toolbarButtons[2] as HTMLElement ).click(); // Italic
            ( toolbarButtons[1] as HTMLElement ).click(); // Underline
            ( toolbarButtons[0] as HTMLElement ).click(); // StrikeThrough
            expect( rteObject.inputElement.innerHTML === '<p><span style="font-size: 36pt;">Testing</span></p>' ).toBe( true );
            done();
        });
        it('Test for only font size of selected text',(done: Function) =>{
            const contentElem : HTMLElement = rteObject.element.querySelector('.e-content');
            let range : Range = new Range();
            range.setStart( contentElem.firstChild.firstChild,0 );
            range.setEnd( contentElem.firstChild.firstChild,7 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn');
            (dropButton[0] as HTMLElement).click();
            const dropItems : NodeList= document.body.querySelectorAll('.e-item');
            (dropItems[7] as HTMLElement).click();
            const correctElementString : string = `<p><span style="font-size: 36pt;">Testing</span></p>`;
            expect( rteObject.inputElement.innerHTML === correctElementString ).toBe( true );
            done();
        });
    });

    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 2' , () => {
        let rteObject : RichTextEditor ;
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value:'Testing'
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it('should add span element with font size to around the text node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('.e-content');
            let range : Range = new Range();
            range.setStart( contentElem.firstChild.firstChild,0 );
            range.setEnd( contentElem.firstChild.firstChild,7 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const toolbarButtons : NodeList = document.body.querySelectorAll('.e-tbar-btn');
            ( toolbarButtons[0] as HTMLElement ).click(); // Bold
            ( toolbarButtons[1] as HTMLElement ).click(); // Italic
            ( toolbarButtons[2] as HTMLElement ).click(); // Underline
            ( toolbarButtons[3] as HTMLElement ).click(); // StrikeThrough
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[0] as HTMLElement ).click(); // Font 
            const dropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( dropItems[2] as HTMLElement ).click(); // Apply font
            ( dropButton[2] as HTMLElement ).click(); // Font color
            const row : NodeList= document.body.querySelectorAll('.e-row');
            const tileItems: NodeList = ( row[0] as HTMLElement ).querySelectorAll('.e-tile');
            ( tileItems[9] as HTMLElement ).click();
            // Background color
            (rteObject.element.querySelector('.e-rte-background-colorpicker .e-split-colorpicker .e-selected-color') as HTMLElement).click();
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            const correctElementString : string = `<p><span style="font-size: 36pt;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span style="background-color: rgb(255, 255, 0);"><span style="font-family: Arial, Helvetica, sans-serif;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">Testing</span></span></em></strong></span></span></span></span></p>`;
            expect(rteObject.inputElement.innerHTML === correctElementString).toBe(true);
            ( toolbarButtons[3] as HTMLElement ).click(); // Bold
            ( toolbarButtons[2] as HTMLElement ).click(); // Italic
            ( toolbarButtons[1] as HTMLElement ).click(); // Underline
            ( toolbarButtons[0] as HTMLElement ).click(); // StrikeThrough
            const correctString : string = `<p><span style="font-size: 36pt;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><span style="background-color: rgb(255, 255, 0);"><span style="font-family: Arial, Helvetica, sans-serif;">Testing</span></span></span></span></p>`;
            expect( rteObject.inputElement.innerHTML === correctString ).toBe( true );
            done();
        });
    });
    
    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 3 Table Element' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;" class=""><span style="text-decoration: underline;"><span style="text-decoration: line-through;">Testing</span></span></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>';
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it('should add span element with font size to around the span node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('span[style="text-decoration: underline;"],span[style="text-decoration: line-through;"]');
            let range : Range = new Range();
            range.setStart( contentElem.firstChild.firstChild,0 );
            range.setEnd( contentElem.firstChild.firstChild,7 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            expect((range.startContainer.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
        });
    } );
    
    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 4 Link Element' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<p><span><a classname="e-rte-anchor" href="https://syncfusion.atlassian.net/browse/EJ2-65567" title="https://syncfusion.atlassian.net/browse/EJ2-65567" target="_blank"><span style="text-decoration: underline;">https://syncfusion.atlassian.net/browse/EJ2-65567</span> </a></span><br></p>';
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it( 'should add span element with font size to around the span node', ( done: Function ) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('a');
            let range : Range = new Range();
            range.setStart( contentElem, 0 );
            range.setEnd( contentElem, 1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            expect((range.startContainer.childNodes[0].childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
        });
    } );
    
    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 5 Code Block' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<pre><span style="text-decoration: line-through;"><span style="text-decoration: underline;">Testing﻿﻿</span></span><br></pre>';
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it('should add span element with font size to around the span node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('pre');
            let range : Range = new Range();
            range.setStart( contentElem ,0 );
            range.setEnd( contentElem ,1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
        });
    } );

    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 6 Heading' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<h1><span style="text-decoration: line-through;"><strong>Testing 1</strong></span></h1><h2><span style="text-decoration: underline;"><strong>Testing 2</strong></span></h2><h3><span style="text-decoration: line-through;"><em><span style="text-decoration: underline;">Testing 3</span></em></span></h3><h4><strong><em><span style="text-decoration: underline;">Testing 4</span></em></strong></h4>';
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it('should wrap font size span element immediate to h1 node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('h1');
            let range : Range = new Range();
            range.setStart( contentElem, 0 );
            range.setEnd( contentElem ,1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            setTimeout(() => {
                expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
                done();
            }, 100);
        } );
        it('should wrap font size span element immediate to h2 node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('h2');
            let range : Range = new Range();
            range.setStart( contentElem, 0 );
            range.setEnd( contentElem ,1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            setTimeout(() => {
                expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
                done();
            }, 100);
        } );
        it('should wrap font size span element immediate to h3 node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('h3');
            let range : Range = new Range();
            range.setStart( contentElem, 0 );
            range.setEnd( contentElem ,1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            setTimeout(() => {
                expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
                done();
            }, 100);
        } );
        it('should wrap font size span element immediate to h4 node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('h4');
            let range : Range = new Range();
            range.setStart( contentElem, 0 );
            range.setEnd( contentElem ,1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            setTimeout(() => {
                expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
                done();
            }, 100);
        } );
        
    } );

    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 7 Image Element Alt Text' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<p><span class="e-img-caption e-rte-img-caption null e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap null"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1277px; min-height: 0px;"><span class="e-img-inner null" contenteditable="true">Caption</span></span></span> </p>';
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it('should wrap span element with font size to around the style span node', (done : Function) => {
            const contentElem : HTMLElement = rteObject.element.querySelector('.e-img-inner');
            let range : Range = new Range();
            range.setStart( contentElem, 0 );
            range.setEnd( contentElem, 1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[7] as HTMLElement ).click(); // Apply Font size
            setTimeout(() => {
                expect((range.startContainer.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
                done();
            }, 100);
        });
    });

    describe(' EJ2-68542: Font size not applied properly for the Numbered lists in RichTextEditor' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = '<p style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br /></p><p style="text-align:center; margin-bottom: 5px; "><font face="Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></font><br /></p><p style="text-align: center; margin-bottom: 2px; "><font face="Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br/></font></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;"></span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; "></span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p>';
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'FontSize','OrderedList']
                } ,value: innerHTML
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it('check the font size apply on list items', (done : Function) => {
            const nodeList : NodeList = rteObject.inputElement.querySelectorAll('p');
            let range : Range = new Range();
            range.setStart( nodeList[0], 0 );
            range.setEnd( nodeList[4], 1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            let orderNumberListBtn: HTMLElement = document.querySelectorAll(".e-toolbar-item")[1] as HTMLElement;
            orderNumberListBtn.click();
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[0] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            setTimeout(() => {
                expect(rteObject.inputElement.innerHTML===`<ol><li style="text-align: center; margin-bottom: 15px; font-size: 36pt;"><span style="font-size: 36pt;"><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><span style="font-size: 36pt;"><br></span></li><li style="text-align: center; margin-bottom: 5px; font-size: 36pt;"><font face="Calibri"><span style="font-size: 36pt;"><b>&lt;#districtname#&gt;</b></span></font><span style="font-size: 36pt;"><br></span></li><li style="text-align: center; margin-bottom: 2px; font-size: 36pt;"><font face="Calibri"><span style="font-size: 36pt;"><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><span style="font-size: 36pt;"><br></span></font></li><li style="text-align: center; margin-bottom: 2px; font-size: 36pt;"><span style="font-size: 12pt;">​</span><span style="font-size: 36pt;"><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></li><li style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></li></ol>`);
                done();
            }, 100);
        });
    });

    describe(' EJ2-68542: Font size not applied properly for the Numbered lists in RichTextEditor' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = '<ol><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br><ol><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">r﻿ichtexteditor</span></strong></span></li><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">WYSIWYG&nbsp;</span></strong></span><ol><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">create and edit</span></strong></span></li><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; "><b style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 14px; text-align: start;">Toolbar</b>﻿<br></span></strong></span></li></ol></li></ol></li><li style="text-align:center; margin-bottom: 5px; "><font face="Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></font><br></li><li style="text-align: center; margin-bottom: 2px; "><font face="Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br></font></li><li style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;">​</span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></li><li style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></li></ol>';
        beforeAll( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'FontSize','OrderedList']
                } ,value: innerHTML
            });
        })
        afterAll( () => {
            destroy( rteObject );
        })
        it('check the font size apply on nested list items', (done : Function) => {
            const nodeList : NodeList = rteObject.inputElement.querySelectorAll('li');
            let range : Range = new Range();
            range.setStart( nodeList[0], 0 );
            range.setEnd( nodeList[1], 1 );
            rteObject.formatter.editorManager.nodeSelection.setRange(document, range);
            const dropButton : NodeList= document.body.querySelectorAll('.e-dropdown-btn'); 
            ( dropButton[0] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            setTimeout(() => {
                expect((nodeList[0] as HTMLElement).style.fontSize === '36pt')
                expect((nodeList[1] as HTMLElement).style.fontSize === '36pt')
                done();
            }, 100);
        });
    });

    describe("EJ2-69957: Quick toolbar tooltip remains in the open state after close the toolbar", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|',
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'SubScript', 'SuperScript', '|',
                'LowerCase', 'UpperCase', '|', 
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|',
                'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode']
                },
                value:`<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href="https://ej2.syncfusion.com/home/" target="_blank">HTML markup</a> or <a href="https://ej2.syncfusion.com/home/" target="_blank">markdown</a> of the content</p><p><b>Toolbar</b></p><ol>
                <li> <p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p></li><li> <p>The Toolbar is fully customizable </p></li></ol>
                <p><b>Links</b></p><ol><li><p>You can insert a hyperlink with its corresponding dialog </p></li><li><p>Attach a hyperlink to the displayed text. </p></li><li><p>Customize the quick toolbar based on the hyperlink </p> </li></ol>
                <p><b>Image.</b></p><ol><li><p>Allows you to insert images from an online source as well as the local computer </p> </li><li><p>You can upload an image </p></li><li> 
                <p>Provides an option to customize the quick toolbar for an image </p> </li></ol><img alt="Logo" src="//ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;">`
            });
        });
    
        afterAll(() => {
            destroy(rteObj);
        });
    
        it('check undo tooltip content', (done: Function) => {
            const undoEle = document.querySelectorAll('.e-toolbar-item')[0];
            let mouseEve = new MouseEvent("mouseover", {bubbles: true,cancelable: true,view: window});
            undoEle.dispatchEvent(mouseEve);
            setTimeout(() => {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                expect((document.querySelector('.e-tooltip-wrap').childNodes[0] as HTMLElement).innerHTML === 'Undo (Ctrl+Z)').toBe(true);
                dispatchEvent(undoEle, 'mouseleave');
                done();
            }, 1000);
        });
    });

    describe('BLAZ-6889 - RichTextEditor value changes are not maintained in source code view after focusing out', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            rteObj.value = 'Initial Content';
            rteObj.dataBind();
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        it('Checking Source code value changes after focusing out', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            sourceCode.click();
            rteObj.focusIn();
            let item: HTMLInputElement = rteObj.element.querySelector('.e-rte-srctextarea');
            item.value = 'rich text editor'; 
            rteObj.isBlur = true; 
            rteObj.focusOut();
            setTimeout(() => {
                expect(rteObj.value === '<p>rich text editor</p>').toBe(true);
                expect(item.value === '<p>rich text editor</p>').toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('838394 - Updated values not sent to the server when we dynamically change the readOnly in RichTextEditor', function () {
        let rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value : "Rich Text Editor",
                readonly : true 
            });
        });
        it('Updated values not sent to the server when we dynamically change the readOnly in RichTextEditor', function (done) {
            rteObj.focusIn();
            rteObj.readonly = false;
            rteObj.dataBind();
            var rteValue = rteObj.value;
            rteObj.value = 'rich text editor new value';
            setTimeout(function () {
                expect(rteObj.value != rteValue).toBe(true);
                done();
            },0);
        });
        afterAll(function () {
            destroy(rteObj);
        });
    });

    describe('841892 - CTRL + Enter triggers the enter action in the Editor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8};
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Testing</p>`,
            });
        });
        it('Pressing Crt + enter key after ', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 4, 4);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            keyBoardEvent.code = 'Enter';
            keyBoardEvent.action = 'enter';
            keyBoardEvent.which = 13;
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML === `<p>Testing</p>`).toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    
    describe('844614 - The enableHtmlSanitizer property is not working properly in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(()=> {
            rteObj = renderRTE({
                value : "Rich Text Editor"
            });
        });
        it('Sanitize the value if update dynamically ', (done: Function) => {
            rteObj.value = '<p><img src=x onerror=alert(document.domain)></p>';
            rteObj.dataBind();
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML === `<p><img src="x" class="e-rte-image e-imginline"></p>`).toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('844717 - The toolbar Button Tooltip not get destroyed when the dialog is opened and closed issue resolved', () => {
        let rteObj: RichTextEditor;
        beforeAll(()=> {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'FullScreen']
                },
                value : "Rich Text Editor"
            });
        });
        it('Tooltip hide while click fullscreen', (done: Function) => {
            let event = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
            let toolbarEle = document.querySelector('[title="Maximize (Ctrl+Shift+F)"]')
            toolbarEle.dispatchEvent(event);
            expect(!isNullOrUndefined(document.querySelector('.e-tooltip-wrap'))).toBe(true);
            (document.querySelectorAll('.e-toolbar-item')[1] as HTMLElement).click();
            setTimeout( function () {
                (document.querySelectorAll('.e-toolbar-item')[1] as HTMLElement).click();
                setTimeout( function () {
                    expect(document.querySelector('.data-tooltip-id') === null).toBe(true);
                    done();
                },100)
            },100)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('848791 - The CMD + B Shortcut not working on the Safari browser', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let selectNode: Element;
        let editNode: HTMLElement;
        let curDocument: Document;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({ height: 200 });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.innerHTML = innerHTML;
        });

        it('Bold action in Mac machin : Command + b', () => {
            editNode.focus();
            selectNode = editNode.querySelector('.first-p');
            setCursorPoint(selectNode, 0);
            keyBoardEvent.ctrlKey = false;
            keyBoardEvent.metaKey = true;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'bold';
            (rteObj as any).keyDown(keyBoardEvent);
            expect( editNode.querySelector('.first-p').firstChild.nodeName === 'STRONG').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('846885 - NumberFormatList and BulletFormatList not apply in Safari browser', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let selectNode: HTMLElement;
        let editNode: HTMLElement;
        let curDocument: Document;
        let innerHTML: string = `<div><p class='first-p'>description</p><p>NumberFormatList</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({ 
                toolbarSettings: {
                    items: ['Undo','Redo','NumberFormatList','BulletFormatList']
                }
            });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.innerHTML = innerHTML;
        });

        it('list in acion in mac', () => {
            rteObj.focusIn()
            selectNode  = (editNode.querySelector('.first-p') as HTMLElement).firstChild as HTMLElement
            setCursorPoint(selectNode, 1);
            //Modified rendering from dropdown to split button
            let trg = document.querySelector('[title="Number Format List (Ctrl+Shift+O)"]').childNodes[0].childNodes[1] as HTMLElement
            let event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            trg.dispatchEvent(event);
            (document.querySelector('[title="Number Format List (Ctrl+Shift+O)"]').childNodes[0].childNodes[1] as HTMLElement).click();
            (document.querySelector('.e-dropdown-popup').childNodes[0].childNodes[1] as HTMLElement).click();
            let result = true;
            expect((editNode.querySelector('.first-p') as HTMLElement).innerHTML == `<li>description</li>`).toBe(true)
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('926827 - Without focusing the editor, changing the list type adds extra bullet points', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let editNode: HTMLElement;
        let curDocument: Document;
        let innerHTML: string = `<ul style="list-style-image: none; list-style-type: square"><li>cgvhj​</li></ul>`;
        beforeAll(() => {
            rteObj = renderRTE({ 
                toolbarSettings: {
                    items: ['BulletFormatList']
                }
            });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.innerHTML = innerHTML;
        });

        it('Without focusing the editor, changing the list type adds extra bullet points', () => {
            rteObj.focusIn()
            //Modified rendering from dropdown to split button
            let trg = document.querySelector('[title="Bullet Format List (Ctrl+Alt+O)"]').childNodes[0].childNodes[1] as HTMLElement
            let event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            trg.dispatchEvent(event);
            (document.querySelector('[title="Bullet Format List (Ctrl+Alt+O)"]').childNodes[0].childNodes[1] as HTMLElement).click();
            (document.querySelector('.e-dropdown-popup').childNodes[0].childNodes[1] as HTMLElement).click();
            expect(editNode.innerHTML == `<ul style="list-style-image: none; list-style-type: disc;"><li>cgvhj​</li></ul>`).toBe(true)
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('847101 - The image focus and resize class names are not removed when the editor in focused out. - ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p><img id="rteImageID" style="width: 300px; height: 300px;" alt="Logo" src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png"></p>'
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it('image focus out - while click on document', () => {
            let rteEle: HTMLElement = rteObj.element;
            rteObj.focusIn();
            let trg = (rteEle.querySelector('#rteImageID') as HTMLElement);
            let event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            trg.dispatchEvent(event);
            event = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            trg.dispatchEvent(event);
            event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            document.body.dispatchEvent(event);
            expect(trg.classList.contains('e-resize')).toBe(false);
            expect(trg.classList.contains('e-img-focus')).toBe(false);
            expect(trg.style.maxWidth === '').toBe(true);
        });
    });

    describe('849657 - Cancelling undo and redo actions using actionBegin events cancel argument is not working in RichTextEditor', () => {
        let isCancelled: boolean = false;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj= renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', 'Bold']
                },
                value: 'RichTextEditor',
                actionBegin: function (e: any) {
                    if ((e.requestType as string).toLowerCase() === 'undo' || (e.requestType as string).toLowerCase()=== 'redo') {
                        e.cancel = true;
                        isCancelled = true;
                    }
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Undo and Redo actions are cancelled', () => {
            // Bold action
            const range = new Range();
            range.setStart(rteObj.contentModule.getEditPanel().querySelector('p'), 0);
            range.setEnd(rteObj.contentModule.getEditPanel().querySelector('p'), 1);
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            const boldKeyAction = new KeyboardEvent('keydown', {
                cancelable: true,
                bubbles: true,
                shiftKey: false,
                ctrlKey: true,
                key: 'b',
                which: 66,
                keyCode: 66,
                code: 'KeyB',
            } as EventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(boldKeyAction);
            expect(rteObj.contentModule.getEditPanel().querySelector('strong') !== null).toBe(true);
            // Undo action
            const undoKeyAction = new KeyboardEvent('keydown', {
                cancelable: true,
                bubbles: true,
                shiftKey: false,
                ctrlKey: true,
                key: 'z',
                keyCode: 90,
                which: 90,
                code: 'KeyZ',
            } as EventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(undoKeyAction);
            expect(isCancelled).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelector('strong') !== null).toBe(true);
            isCancelled = false;
            // Redo action
            const redoKeyAction = new KeyboardEvent('keydown', {
                cancelable: true,
                bubbles: true,
                shiftKey: false,
                ctrlKey: true,
                key: 'y',
                keyCode: 89,
                which: 89,
                code: 'KeyY',
            } as EventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(redoKeyAction);
            expect(isCancelled).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelector('strong') !== null).toBe(true);
        });
    });

    describe('851908 - When selecting multiple fonts applied texts, the font family toolbar should not show the font name as empty', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'Formats']
                },
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('CASE 1 - Check the toolbar values after selecting multiple font size in singel line', (done: DoneFn) => {
            rteObj.value = `<h2 title="heading1">
            <span style="font-size: 24pt;">
                <span style="font-family: Tahoma, Geneva, sans-serif;">
                    <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
                        <span style="background-color: rgb(204, 255, 255);">
                            <b><u>FORMAT PAINTER:</u></b>
                        </span>
                    </span>
                </span>
            </span>
            is used to copy the <span style="font-family: Verdana, Geneva, sans-serif;">formatting</span> of a <span style="font-size: 24pt;">selected text or object and apply it to another text or object.
            </span> 
        </h2>`
            rteObj.dataBind();
            rteObj.selectAll();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'mouseup');
            setTimeout(() => {
                expect(rteObj.toolbarModule.getToolbarElement().querySelector('.e-font-size-tbar-btn').textContent).toBe('');
                done();
            }, 200);
        });
        it('CASE 2 - Check the toolbar values after selecting multiple font size in multiple line', (done: DoneFn) => {
            rteObj.value = `                <h2 title="heading1">
                <span style="font-size: 24pt;">
                    <span style="font-family: Tahoma, Geneva, sans-serif;">
                        <span style="color: rgb(68, 114, 196); text-decoration: inherit;">
                            <span style="background-color: rgb(204, 255, 255);">
                                <b><u>FORMAT PAINTER:</u></b>
                            </span>
                        </span>
                    </span>
                </span>
                is used to copy the <span style="font-family: Verdana, Geneva, sans-serif;">formatting</span> of a <span style="font-size: 24pt;">selected text or object and apply it to another text or object.
                </span> 
            </h2>
            <p><span style="background-color: rgb(255, 204, 204);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">
                <span style="font-size: 14pt;"><strong><em><span style="text-decoration: underline;">
                <span style="text-decoration: line-through;">Getting started with the format painter:</span></span></em>
            </strong></span></span></span></p>
            <p>The format painter toolbar button allows you to copy the <span style="font-size: 24pt;"><span
                        style="font-family: Arial, Helvetica, sans-serif;"><strong>formatting </strong></span></span>of a selected
                text or object and
                apply it to another text or object.
                This is a quick and easy way to ensure consistent formatting throughout your document or website.
            </p>
            <p><br></p>
            <h3>The format painter toolbar button allows you to copy the formatting of a selected text or object and 
                apply it to another text or object. 
                This is a quick and easy way to ensure consistent formatting throughout your document or website.
            </h3>`;
            rteObj.dataBind();
            rteObj.selectAll();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'mouseup');
            setTimeout(() => {
                if (rteObj.toolbarModule.getToolbarElement()) {
                    expect(rteObj.toolbarModule.getToolbarElement().querySelector('.e-font-size-tbar-btn').textContent).toBe('');
                    expect(rteObj.toolbarModule.getToolbarElement().querySelector('.e-font-name-tbar-btn').textContent).toBe('');
                    expect(rteObj.toolbarModule.getToolbarElement().querySelector('.e-formats-tbar-btn').textContent).toBe('');
                }
                done();
            }, 200);
        });
    });

    describe('855271 - Toolbar status not updated properly when we dynamically enable the toolbar in RichTextEditor', ()=> {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false,
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Testing the html toolbar status class is null or undefined', () => {
            expect((rteObj.htmlEditorModule as any).toolbarUpdate).toBe(undefined);;
            rteObj.toolbarSettings.enable = true;
            rteObj.dataBind();
            expect((rteObj.htmlEditorModule as any).toolbarUpdate).not.toBe(undefined);
        });
    });

    describe('904051: Number Pad Enter Key Does Not Trigger actionBegin Event in the Rich Text Editor.', () => {
        let editor: RichTextEditor;
        let isActionBegin: boolean = false;
        beforeAll(() => {
            editor = renderRTE({
                actionBegin: (args: ActionBeginEventArgs) => {
                    if (args.requestType === 'EnterAction') {
                        isActionBegin  = true;
                    }
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it ('Should trigger the action begin even on NUMPAD enter action', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', NUMPAD_ENTER_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', NUMPAD_ENTER_EVENT_INIT));
            setTimeout(() => {
                expect(isActionBegin).toBe(true);
                done();
            }, 100);
        });
    });
  
    describe('904558: Image action begin event args does not reflect after image is inserted.', () => {
        let editor: RichTextEditor;
        let url: string;
        beforeAll(() => {
            editor = renderRTE({
                actionBegin: function (e) {
                    if (e.requestType === 'Image') {
                        e.itemCollection.url = e.itemCollection.url  + 'api/UnauthorizedImage';
                        url = e.itemCollection.url;
                    }
                },
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it ('Should able to update edit the inserted image on action begin event.', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            setTimeout(() => {
                const inputElem: HTMLInputElement = editor.element.querySelector('.e-rte-img-dialog .e-input.e-img-url');
                inputElem.value = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Portrait.png';
                inputElem.dispatchEvent(new Event('input'));
                (editor.element.querySelector('.e-insertImage') as HTMLElement).click();
                setTimeout(() => {
                    expect((editor.inputElement.querySelector('img').src)).toBe(url);
                    done();
                }, 200);
            }, 100);
        });
    });
    
    describe('847097 - Image get duplicated when we press enter key next to the copy pasted image content from Word', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 13, which: 13, shiftKey: false, code : 'Enter'
        };
        beforeAll(()=> {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Formats']
                },
                value: '<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><span lang="EN-IN" style="font-size:16.0pt;line-height:107%;">Quote 1 -</span></b></p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span id="msWordImg-clip_image001"><img width="624" height="196" src="blob:http://127.0.0.1:5500/a11f1f65-5f82-4231-bac2-2370d08635d0" v:shapes="Picture_x0020_1" id="msWordImg-clip_image002" class="e-rte-image e-imginline" style="opacity: 1;"></span></p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><span lang="EN-IN" style="font-size:18.0pt;line-height:107%;">Explore 1 -</span></b></p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span><img width="624" height="163" src="blob:http://127.0.0.1:5500/fd4c90de-5cb5-4ef0-89ba-2105a769bfb5" v:shapes="Picture_x0020_2" id="msWordImg-clip_image004" class="e-rte-image e-imginline" style="opacity: 1;"> </span></p>'
            });
        });
        it('Image gets duplicate paste from ms word ', () => {
            rteEle = rteObj.element;
            let start: HTMLElement = document.getElementById('msWordImg-clip_image001');;
            setCursorPoint(start, 1);
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p').length === 5).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('853088 - Script error throws when clicking preview toolbar while using itemConfigs with ToolbarSettings in RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(()=> {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|', 
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|',
                    'CreateLink', '|', 'Image', '|', 'CreateTable', '|',
                    'SourceCode', '|', 'ClearFormat', 'Print', 'InsertCode'],
                    itemConfigs: {
                        undo: {
                            icon: 'undo',
                        },
                        redo: {
                            icon: 'redo',
                        },
                        justifyLeft: {
                            icon: 'justifyLeft',
                        },
                        alignments: {
                            icon: 'alignments',
                        },
                        bold: {
                            icon: 'bold',
                        },
                        italic: {
                            icon: 'italic',
                        },
                        underline: {
                            icon: 'underline',
                        },
                    },
                },  
                value: '<p><b>Description:</b></p>'
            });
        });
        it('click the preview toolbar while using itemConfigs with ToolbarSettings ', () => {
            rteEle = rteObj.element;
            let previewEle: HTMLElement = document.querySelector('[title= "Code View (Ctrl+Shift+H)"]');
            previewEle.click();
            expect(rteObj.value === '<p><b>Description:</b></p>').toBe(true); 
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('853677 - The image alternate text is not shown properly in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(()=> {
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
        });
        it('ensure insert image on Alternate text', () => {
            (rteObj as any).inputElement.focus();
            let curDocument: Document;
            curDocument = rteObj.contentModule.getDocument();
            setCursorPoint((rteObj as any).inputElement, 0);
            (rteObj as any).inputElement.focus();
            rteObj.executeCommand('insertImage', {
                url: 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png',
                cssClass: 'testingClass',
                width: { minWidth: '200px', maxWidth: '200px', width: 180 },
                height: { minHeight: '200px', maxHeight: '600px', height: 500 },
                altText: '<a href="javascript:alert(\'XSS\')">Click me</a>'
            });
            let imgElem: HTMLElement = (rteObj as any).inputElement.querySelector('img');
            expect(imgElem.getAttribute('alt') === '<a href="javascript:alert(\'XSS\')">Click me</a>').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('852541 -ToolbarClick event should trigger before the opening of emoji picker popup in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let toolbarClick: any;
        beforeAll(() => {
            toolbarClick = null;
            toolbarClick = jasmine.createSpy('toolbarClick');
            rteObj = renderRTE({
                toolbarClick: toolbarClick,
                value: '<span id="rte">RTE</span>',
                toolbarSettings: {
                    items: ['EmojiPicker']
                }
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('toolbarClick event should trigger', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent((rteObj as any).inputElement, 'focusin');
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_EmojiPicker');
            item.click();
            expect(toolbarClick).toHaveBeenCalled();
        });
    });
    
    describe('853717 - Not able to insert the SVG or Canvas elements using ExecuteCommand in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: ''
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Not able to insert the SVG or Canvas elements', () => {
            rteObj.executeCommand('insertHTML', `<div>
            <p>test</p>
            <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>
              <circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' />
            </svg>
          </div><p>text</p>`);
          expect(rteObj.contentModule.getEditPanel().innerHTML === '<div> <p>test</p> <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"> <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow"></circle> </svg> </div><p>text</p>').toBe(true);
        });
    });

    describe('854718 - Need to add the aria label attribute to the link in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '' });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('link with the aria-label attribute', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'http://data';
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = 'Rich Text Editor';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').focus();
            args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            event = { preventDefault: function () { } };
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            selectParent = new NodeSelection().getParentNodeCollection(range);
            selectNode = new NodeSelection().getNodeCollection(range);
            evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save, selectNode: selectNode,
                selectParent: selectParent
            };
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').target = '_blank';
            (<any>rteObj).linkModule.editLink(evnArg);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = 'Rich Text Editor';        
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector("a.e-rte-anchor").hasAttribute("aria-label")).toBe(true);
        });
    });

    describe('853959 - The anchor element was removed when removing the underline in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p><span style="color: rgb(0, 0, 0); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Copy the text from this</span><span style="color: rgb(0, 0, 0); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);">&nbsp;</span><a href="https://support.syncfusion.com/kb/article/7218/download-excel-from-ajax-call-in-asp-net-mvc?isInternalRefresh=False" style="text-decoration: underline; color: var(--communication-foreground,rgba(0, 90, 158, 1)); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); cursor: pointer;">link</a><span style="color: rgb(0, 0, 0); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">, which has a link and an underline.</span></p>'
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('The anchor element was removed', () => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.contentModule.getDocument().querySelector('a'), rteObj.contentModule.getDocument().querySelector('a'), 0, 1);
            rteObj.executeCommand('underline');
            expect(rteObj.contentModule.getDocument().querySelector('a').style.textDecoration === 'none').toBe(true);
        });
    });

    describe("849875 - Cursor position get lost when having empty span tag in RichTextEditor", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let toolbarEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: true,
                    enableFloating: false,
                    items: [
                        "Bold",
                        "Italic",
                        "Underline",
                    ]
                },
                blur: function () {
                    rteObj.toolbarSettings.enable = false;
                    rteObj.dataBind();
                }
            });
            rteEle = rteObj.element;
            toolbarEle = document.createElement('div');
            toolbarEle.className = 'e-rte-elements';
            toolbarEle.innerHTML = '<ul><li class="e-list1">Object1</li><li class="e-list2">Object2</li></ul>'
            document.body.appendChild(toolbarEle);
        });
        afterAll(() => {
            destroy(rteObj);
            detach(toolbarEle);
        });
        it("Custom toolbar", () => {
            rteObj.focusIn();
            const list: HTMLElement= document.querySelector('.e-list1');
            (rteObj as any).blurHandler({ relatedTarget: list });
            expect(rteObj.toolbarSettings.enable).toBe(true);
        });
    });

    describe('854639 - Need to remove the max row count for the table in the Rich Text Editor.', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('table creation of row more than 50 ', (done: DoneFn) => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            rteEle.querySelector('.e-table-row').setAttribute('aria-valuenow','51');
            rteEle.querySelector('.e-table-row').setAttribute('value','51');
            rteEle.querySelector('.e-table-row').setAttribute('aria-valuenow', '51');
            rteEle.querySelector('.e-table-row').setAttribute('value', '51');
            (rteEle.querySelector('.e-table-row') as HTMLInputElement).value = '51';
            rteEle.querySelectorAll('.e-numeric-hidden')[1].setAttribute('value', '51');
            (rteEle.querySelectorAll('.e-numeric-hidden')[1] as HTMLInputElement).value = '51';
            rteEle.querySelector('.e-table-row').dispatchEvent(new Event("change"));
            (rteEle.querySelector('.e-table-row') as HTMLInputElement).blur();
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            setTimeout(() => {
                let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(table.querySelectorAll('tr').length === 51).toBe(true);
                done();
            }, 200);
        }, 550);
    });

    describe("855947 - Table creation popup doesn't get closed when clicking Esc key in RichTextEditor", () => {
        let rteObj: RichTextEditor;
        let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="MsoNormal"><b><span lang="EN-IN"><a href="https://en.wikipedia.org/wiki/Forest_ecology"><i><span class="targetSpan"style="font-size: 10.5pt; line-height: 107%; font-family: Arial, sans-serif; color: rgb(51, 102, 204); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Forest ecology</span></i></a><o:p></o:p></span></b></p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>  `;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: innerHTML,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the create table popup open', (done: DoneFn) => {
            (document.querySelector('[title="Create Table (Ctrl+Shift+E)"]') as HTMLElement).click();
            setTimeout(() => {
                const insertButton: HTMLButtonElement = rteObj.element.querySelector('.e-rte-table-popup button');
                const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ESCAPE_KEY_EVENT_INIT);
                const escapeKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ESCAPE_KEY_EVENT_INIT);
                insertButton.dispatchEvent(escapeKeyDownEvent);
                insertButton.dispatchEvent(escapeKeyUpEvent);
                setTimeout(() => {
                    expect(rteObj.element.querySelector('.e-rte-table-popup')).toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe("857980 - The rich text editor content is removed when the enter key is in BR mode ", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enterKey: 'BR',
                value:`Hello Andrew,<br><br><p class="currentStartMark">Test.<br><br><br><br>test<br><br>dumy</p><span></span>Regards<br>Andrew`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it("enter key br mode", (done: DoneFn) => {
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelector('.currentStartMark').childNodes[5] as Element, 0);
            const enterKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(enterKeyEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.currentStartMark').childNodes.length === 11).toBe(true);
                done();
            }, 100);
        });
    });

    describe('854667 - The table styles are not preselected in the quick toolbar in the Rich Text Editor.', function () {
        let rteObj : RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        let div: HTMLElement;
        const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
        const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

        beforeEach(function (done: DoneFn) {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="tdElement" style="width: 25%;"><br></td><td style="width: 25%;" class=""><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;" class="e-cell-select"><br></td><td style="width: 25%;" class=""><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        afterEach(function (done: DoneFn) {
            destroy(rteObj);
            done();
        });
        it('Dashed borders', function (done) {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            setCursorPoint(tbElement, 0);
            tbElement.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                (document.querySelector(".e-dropdown-popup .e-item.e-dashed-borders") as any).click();
                detach(div);
                setCursorPoint(tbElement, 0);
                (rteObj as any).mouseDownHandler(eventsArg);
                (rteObj as any).mouseUp(eventsArg);
                div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                expect(document.querySelector(".e-dropdown-popup .e-item.e-dashed-borders").classList.contains('e-active')).toBe(true);
                detach(div);
                done();
            },100);
        });
        it('Alternate rows', function (done) {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            setCursorPoint(tbElement, 0);
            tbElement.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                (document.querySelector(".e-dropdown-popup .e-item.e-alternate-rows") as any).click();
                detach(div);
                setCursorPoint(tbElement, 0);
                (rteObj as any).mouseDownHandler(eventsArg);
                (rteObj as any).mouseUp(eventsArg);
                div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                expect(document.querySelector(".e-dropdown-popup .e-item.e-alternate-rows").classList.contains('e-active')).toBe(true);
                detach(div);
                done();
            },100);
        });
        it('Alignments', function (done) {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments');
            item.click();
            setTimeout(() => {
                let items: any = document.querySelectorAll('#' + controlId + '_toolbar_Alignments-popup .e-item');
                expect(items[0].classList.contains('e-active')).toBe(true);
                done();
            }, 100)
        });
    });

    xdescribe('854667 - The table styles are not preselected in the quick toolbar in the Rich Text Editor. for image', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false },
                value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imginline" /></p>`
            });
            editor.formatter.editorManager.imgObj = new ImageCommand(editor.formatter.editorManager);
        });
        afterAll(() => {
            destroy(editor);
        });

        it('Should have active class when the dropdown is opened.', (done) => {
            editor.focusIn();
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            expect(editor.quickToolbarSettings.image.length).toBe(14);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
                const caretIcon: HTMLElement = editor.quickToolbarModule.imageQTBar.element.querySelector('.e-justify-left').nextElementSibling as HTMLElement;
                caretIcon.click();
                setTimeout(() => {
                    const openDropDownPopup: HTMLElement = document.body.querySelector('.e-dropdown-popup.e-popup-open');
                    const listElements: NodeListOf<HTMLLIElement> = openDropDownPopup.querySelectorAll('li');
                    expect(listElements[0].classList.contains('e-active')).toBe(true);
                    expect(listElements[1].classList.contains('e-active')).not.toBe(true);
                    expect(listElements[2].classList.contains('e-active')).not.toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('859382 - ImageRemoving event arguments are not properly passed in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let propertyCheck: boolean;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                insertImageSettings: {
                    saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Images/"
                },
                imageRemoving: function (args) {
                    if (args.cancel != null && args.customFormData != null && args.event != null && args.filesData != null && args.postRawFile != null) {
                        propertyCheck = true;
                    }
                },
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it("The imageRemiving event doesn't have the args property.", (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector(".e-richtexteditor .e-upload-files .e-file-remove-btn") as any).click();
            setTimeout(() => {
                expect(propertyCheck).toBe(true);
                done();
            }, 300);
        });
    });

    describe('855622 - Font styles are not applied to the numbered and bullet format list items in RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic','FontName']
                },
                value: `<ol><li>normal</li><li>list</li><li>normal</li><li>list</li></ol>`
            });
            rteEle = rteObj.element;
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('check Bold', (done: DoneFn) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelectorAll('li')[0].firstChild, rteObj.element.querySelectorAll('li')[3].firstChild, 3, 3);
            (rteObj.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(rteEle.querySelectorAll('li')[1].style.fontWeight === "bold").toBe(true);
                done();
            }, 50);
        });
        it('check Italic', (done: DoneFn) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelectorAll('li')[0].firstChild, rteObj.element.querySelectorAll('li')[3].firstChild, 3, 3);
            (rteObj.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement).click();
            setTimeout(() => {
                expect(rteEle.querySelectorAll('li')[1].style.fontStyle === "italic").toBe(true);
                done();
            }, 50);
        });
        it('check fontname', (done: DoneFn) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelectorAll('li')[0].firstChild, rteObj.element.querySelectorAll('li')[3].firstChild, 3, 3);
            let node: HTMLElement = (rteObj.element.querySelectorAll('.e-toolbar-item')[2] as HTMLElement);
            (node.firstChild  as HTMLElement).click();
            (document.querySelectorAll('.e-dropdown-popup.e-rte-elements li')[4] as HTMLElement).click();
            setTimeout(() => {
                expect((document.querySelectorAll('.e-content li')[2] as HTMLElement).style.fontFamily === 'Impact, Charcoal, sans-serif').toBe(true);
                done();
            }, 50);
        });
    });

    describe("863459 - Applying different text styles format out of focus Leads to Issues in RichTextEditor.", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let toolbarEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: true,
                    enableFloating: false,
                    items: [
                        "Bold",
                        "Italic",
                        "Underline",
                    ]
                },
                value: "<p>Rich Text Editor</p>"
            });
            rteEle = rteObj.element;
            toolbarEle = document.createElement('div');
            toolbarEle.className = 'e-rte-test-elements';
            toolbarEle.innerHTML = '<div>Rich Text Editor</div>';
            document.body.appendChild(toolbarEle);
        });
        afterAll(() => {
            destroy(rteObj);
            detach(toolbarEle);
        });
        it("Focus leads to a console error in the Rich Text Editor.", () => {
            (document.querySelector(".e-rte-test-elements div") as any).click();
            (rteObj.element.querySelectorAll(".e-rte-toolbar .e-toolbar-item button")[0] as any).click();
            (document.querySelector(".e-rte-test-elements div") as any).click();
            (rteObj.element.querySelectorAll(".e-rte-toolbar .e-toolbar-item button")[1] as any).click();
            expect(rteObj.inputElement.innerHTML == '<p><strong><em>​</em></strong>Rich Text Editor</p>').toBe(true);
        });
    });

    describe("863440: Too many times applying bold to a text, sometimes the text got deleted in RichTextEditor.", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let domSelection: NodeSelection = new NodeSelection();
        let parentDiv: HTMLDivElement;
        beforeAll(() => {
            rteObj = renderRTE({
                enterKey: 'BR',
                value:`<div id="div1"><p id="paragraph1">second rtec</p></div>`
            });
            rteEle = rteObj.element;
            parentDiv = document.getElementById('div1') as HTMLDivElement;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Apply Bold tag for cursor position', () => {
            let node1: Node = document.getElementById('paragraph1');
            let text1: Text = node1.childNodes[0] as Text;
            domSelection.setSelectionText(document, text1, text1, 1, 1);
            SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
            expect(node1.childNodes[0].nodeName.toLowerCase()).toEqual('strong');
            domSelection.setSelectionText(document, text1, text1, 5, 5);
            SelectionCommands.applyFormat(document, 'bold', parentDiv, 'P');
            expect(rteObj.inputElement.innerHTML).toEqual('<div id="div1"><p id="paragraph1">second rtec</p></div>');
        });
    });

    describe('865055 - ValueChange event not triggered when we edit in Code view in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let previousValue: any;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                },
                autoSaveOnIdle: true,
            });
        });
        it('Value change event triger when editing in the Code view', (done) => {
            rteObj.value = "Rich Text Editor";
            rteObj.saveInterval = 100;
            rteObj.dataBind();
            (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as any).click();
            rteObj.value = "Rich Text Editor componnent";
            previousValue = rteObj.value;
            rteObj.dataBind();
            setTimeout(function () {
                rteObj.value = "Rich Text Editor";
                setTimeout(function () {
                    rteObj.value = "Rich Text Editor value";
                    expect(previousValue != rteObj.value).toBe(true);
                    done();
                }, 200);
            }, 200);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('866230 - Script error throws when using click event with custom toolbar template in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [{
                        click:function(){
                            rteObj.executeCommand('insertHTML','<div>testing</div>');
                    },
                    undo:true,
                    tooltipText: 'Insert Symbol',
                    template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">'
                    + '<div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div></button>'
                    },'Undo','Redo']
                },
                value:'RichTextEditor'
            });
        });
        it('check the value undo redo action in custom toolbar click', () => {
            (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as any).click();
            (rteObj.element.querySelectorAll(".e-toolbar-item")[1] as any).click();
            expect(rteObj.inputElement.innerHTML === '<p>RichTextEditor</p>').toBe(true);
            (rteObj.element.querySelectorAll(".e-toolbar-item")[2] as any).click();
            expect(rteObj.inputElement.innerHTML === '<div>testing</div><p>RichTextEditor</p>').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('865259: Script error throws and line breaks added when clicking Bold toolbar item in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let rteObj2: RichTextEditor;
        let defaultUserAgent= navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                value: `First RTEC`
            });
            rteObj2 = renderRTE({
                value: `second RTEC`
            });
        });

        it('Checking with firefox browser', () => {
            rteObj.value = "";
            rteObj.focusIn();
            let range: Range = document.createRange();
            range.setStart(rteObj2.element.querySelector('.e-content'), 1);
            rteObj2.formatter.editorManager.nodeSelection.setRange(document, range);
            rteObj2.executeCommand('bold');
            expect(rteObj2.inputElement.innerHTML === '<p><strong>​</strong>second RTEC</p>').toBe(true);
            rteObj2.value= `<p><strong></strong>second RTEC</p><p><strong></strong>second RTEC</p>`;
            range.setStart(rteObj2.element.querySelector('.e-content'), 1);
            rteObj2.formatter.editorManager.nodeSelection.setRange(document, range);
            rteObj2.executeCommand('bold');
            expect(rteObj2.inputElement.nodeName === 'DIV').toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
            destroy(rteObj2);
            Browser.userAgent =defaultUserAgent;
        });
    });

    describe('911996: Applying List or Alignment in Firefox Causes Scroll to Top When iFrame is Rendered', () => {
        let rteObj: RichTextEditor;
        let mouseEventArgs: { [key: string]: HTMLElement };
        let defaultUserAgent = navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        beforeAll(() => {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Alignments', 'OrderedList', 'UnorderedList', 'Indent', 'Outdent']
                },
                value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p><p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <b class="e-rte-anchor-test">here</b>.</p>`
            });
        });

        it(' Checking with firefox browser', () => {
            setCursorPoint(rteObj.inputElement.lastElementChild, 0);
            const iframe: HTMLIFrameElement = document.querySelector('iframe');
            const scrollTop = iframe.contentWindow.document.documentElement.scrollTop;
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[3] as HTMLElement).click();
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
                    (trgEle.childNodes[0] as HTMLElement).click();
            let popupElement: Element = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                    mouseEventArgs = {
                        target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                    };
                    (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[2] as HTMLElement).click();
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[3] as HTMLElement).click();
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[4] as HTMLElement).click();
            expect(scrollTop === iframe.contentWindow.document.documentElement.scrollTop).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUserAgent;
        });
    });

    describe('870038 - Pasted image tag added inside the link tag in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><a class="e-rte-anchor" href="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" title="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" target="_blank" aria-label="Open in new window">link</a></p>`
            });
        });

        it('image after the link', () => {
            rteObj.executeCommand('insertImage', { url: 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png', cssClass: 'rte-img'});
            expect(rteObj.inputElement.innerHTML).toBe('<p><a class="e-rte-anchor" href="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" title="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" target="_blank" aria-label="Open in new window">link</a><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image rte-img" width="auto" height="auto" style="min-width: 0px; min-height: 0px;">&nbsp;</p>');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('870485: Pressing Enter Key After Pasting an Image Removes the Image in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8};
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:106%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span style="font-size:10.0pt;line-height:106%;">Afterwards, a new option\n"InsertLoremIpsum" will show in the "plugin" menu entry. A\nrestart may be required. &gt;&gt; screenshots<u><br clear="all">\n</u></span><span><img width="476" height="220" src="blob:http://127.0.0.1:5501/a004d4d0-4153-44c9-8ce9-5b1bb5bd25d0" v:shapes="Picture_x0020_1" id="msWordImg-clip_image001" class="e-rte-image e-imginline" style="opacity: 1;"> </span></p>`
            });
        });
        it('img with enter key', () => {
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelector('img'), 0);
            keyBoardEvent.code = 'Enter';
            keyBoardEvent.action = 'enter';
            keyBoardEvent.which = 13;
            (rteObj as any).keyDown(keyBoardEvent);
            expect(rteObj.inputElement.querySelector('img') !== null).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('870298: Numbered list not removed when we delete the entire list using backspace key in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<ol><li id="firstli">list1</li><li>list2</li><li>list3</li><li id="lastli">list4</li></ol>',
            });
        });
        it('Checking the backspace on list', (done: Function) => {
            let startNode: any = (rteObj as any).inputElement.querySelector('#firstli');
            let endNode: any = (rteObj as any).inputElement.querySelector('#lastli');
            let sel = new NodeSelection().setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 5);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((rteObj as any).inputElement.querySelectorAll('ol').length).toBe(0);
                done();
            }, 50);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('896562 - Script error throws when using RichTextEditor inside the Grid', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({});
        });
        it('Should not call remove method for the input element and then should not set null for the input elemeent.', () => {
            destroy(editor);
            expect(editor.inputElement).not.toBe(null);
            // Setting null will not remove the event listener on the ngOnDestroy angular Base method focus and blur events.
        });
    });

    describe('898856 - Change event not triggered when we dynamically change the readOnly mode in the RichTextEditor.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({readonly: true});
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should re bind the focus event when the readonly is set to false.', () => {
            editor.readonly = false;
            editor.dataBind();
            expect(typeof (editor as any).onFocusHandler).toBe('function');
            expect(typeof (editor as any).onBlurHandler).toBe('function');
            expect(typeof (editor as any).onResizeHandler).toBe('function');
        });
    });

    describe('870298: Numbered list not removed when we delete the entire list using backspace key in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        beforeAll(()=> {
            rteObj = renderRTE({
                value: `<ol style=" margin-bottom: 1em; margin-top: 1em; font-size: 16.8px; line-height: 1.1; margin-left: 0px; padding-left: 2em; color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;, Georgia, &quot;SBL Greek&quot;, serif; font-style: normal; font-weight: 400; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(247, 247, 249);"><li style=" font-size: 0.95em; line-height: 1.1; margin-left: 0.75em; margin-top: 1em; margin-bottom: 1em;"><em>Report One</em>: an internal proposal written in Memo format</li><li style=" font-size: 0.95em; line-height: 1.1; margin-left: 0.75em; margin-top: 0.5em; margin-bottom: 1em;"><em>Report Two</em>: an internal proposal written in Short Report format</li><li style=" font-size: 0.95em; line-height: 1.1; margin-left: 0.75em; margin-top: 0.5em; margin-bottom: 1em;"><em>Report Three</em>: A comparative recommendation report written for an external client in Long Report format.</li></ol>`,
            });
        });
        it('Checking the backspace on list', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelectorAll('li')[2].querySelector('em'), 0);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('li').length).toBe(2);
                expect(rteObj.inputElement.querySelectorAll('li')[1].innerText).toBe('Report Two: an internal proposal written in Short Report formatReport Three: A comparative recommendation report written for an external client in Long Report format.');
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('878765 - Title attribute not added properly for the Audio element in RichTextEditor', function () {
        let rteObj: RichTextEditor;
        beforeEach(function (done) {
            rteObj = renderRTE({
                value: "<div><div id='videoElement'>Video Element</div><div id='audioElement'>Audio Element</div></div>"
            });
            done();
        });
        afterEach(function (done) {
            destroy(rteObj);
            done();
        });
        it('Use the executeCommand method to insert the video title attributes.', function (done) {
            (<any>rteObj).focusIn();
            setTimeout(function () {
                (<any>rteObj).formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelector('#videoElement'), 0);
                (<any>rteObj).executeCommand('insertVideo', {
                    url: 'https://www.w3schools.com/tags/movie.mp4',
                    cssClass: 'e-rte-video',
                    title: 'newVideo',
                });
                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap').getAttribute("title") === "newVideo").toBe(true);
                done();
            }, 100);
        });
        it('Use the executeCommand method to insert the audio title attributes.', function (done) {
            (<any>rteObj).focusIn();
            setTimeout(function () {
                (<any>rteObj).formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelector('#audioElement'), 0);
                (<any>rteObj).executeCommand('insertAudio', {
                    url: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3',
                    cssClass: 'e-rte-audio',
                    title: 'newAudio',
                });
                expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap').getAttribute("title") === "newAudio").toBe(true);
                done();
            }, 100);
        });
    });

    describe('879007 - Pressing enter key after inserting table, freezes the RichTextEditor.', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 65, which: 65, shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<table class="e-rte-table table-element" style="width: 41.3737%; min-width: 0px; height: 67px;"><tbody><tr style="height: 32.8358%;"><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr style="height: 32.8358%;"><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr style="height: 32.8358%;"><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>',
            });
        });
        it('Keydown in after the table element', function (done) {
            let focusElement = rteObj.inputElement.querySelector(".e-rte-table.table-element");
            focusElement.parentElement.append(document.createTextNode("RichTextEditor"));
            let range = document.createRange();
            let selection = window.getSelection();
            range.setStart(focusElement.nextSibling, 5);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            (rteObj as any).formatter.editorManager.formatObj.onKeyUp({ event: keyboardEventArgs, enterAction : rteObj.enterKey });
            setTimeout(() => {
                expect(focusElement.nextSibling.nodeName.toLocaleLowerCase() === 'p').toBe(true);
                done();
            }, 100);
        });
        it('Keydown with a text node', function (done) {
            let focusElement = rteObj.inputElement;
            focusElement.innerHTML = "RichTextEditor";
            let range = document.createRange();
            let selection = window.getSelection();
            range.setStart(focusElement.childNodes[0], 5);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            (rteObj as any).formatter.editorManager.formatObj.onKeyUp({ event: keyboardEventArgs, enterAction : rteObj.enterKey });
            setTimeout(() => {
                expect(focusElement.childNodes[0].nodeName.toLocaleLowerCase() === 'p').toBe(true);
                done();
            }, 100);
          });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe("881308: Script error throws when inserting table into the RichTextEditor", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<p>test<a class="e-rte-anchor" href="http://link" title="http://link" target="_blank" aria-label="Open in new window">link</a></p><p>test</p><p><br></p>'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' insert table ', (done) => {
            rteObj.focusIn();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            let node: Element[] = (rteObj as any).inputElement.querySelectorAll("p");
            setCursorPoint(node[2], 0);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(function () {
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                setTimeout(() => {
                    expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                    target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                    target.dispatchEvent(clickEvent);
                    setTimeout(() => {
                        let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                        expect(table.querySelectorAll('tr').length === 3).toBe(true);
                        expect(table.querySelectorAll('td').length === 9).toBe(true);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
    });

    describe('954014: To validate the RTE breaking issue in Bold Desk source', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'Initial value'
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should not focus in when the value property is set to NULL and there should not be any range.', (done: DoneFn)=> {
            editor.focusIn();
            expect(editor.element.ownerDocument.activeElement).toBe(editor.inputElement);
            editor.value = null;
            editor.focusOut();
            editor.dataBind();
            setTimeout(() => {
                expect(editor.element.ownerDocument.activeElement).not.toBe(editor.inputElement);
                done();
            }, 100);
        });
    });
});
