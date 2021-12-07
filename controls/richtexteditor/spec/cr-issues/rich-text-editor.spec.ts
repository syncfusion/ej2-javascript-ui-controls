/**
 * CR-Issues RTE spec
 */
import { createElement, L10n, isNullOrUndefined, Browser, detach } from '@syncfusion/ej2-base';
import { FormValidator } from "@syncfusion/ej2-inputs";
import { dispatchEvent } from '../../src/rich-text-editor/base/util';
import { RichTextEditor } from '../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy, setCursorPoint, dispatchEvent as dispatchEve } from './../rich-text-editor/render.spec';

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
    type: 'keyup'
};

describe('RTE CR issues', () => {
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
        beforeEach((done: Function) => {
            done();
        });

        it('Full Screen Handler when render inside the overflow element', (done) => {
            divElem = <HTMLTextAreaElement>createElement('div', { styles: 'overflow: auto; border: 1px solid;' });
            elem = <HTMLTextAreaElement>createElement('textarea', { id: 'rte_test_EJ2_20672', attrs: { name: 'formName' } });
            document.body.appendChild(divElem);
            divElem.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
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
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: innerHTML
            });
            done();
        });

        it('I213118 => EJ2-15261 - RTE removes spacing between words when content is pasted from a word document', () => {
            expect((rteObj as any).inputElement.innerHTML === innerHTML).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-18135 - name attribute of textarea element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        beforeEach((done: Function) => {
            done();
        });

        it('name attribute to textarea element', (done) => {
            elem = <HTMLTextAreaElement>createElement('textarea', { id: 'rte_test_EJ2_18135', attrs: { name: 'formName' } });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
            expect((rteObj as any).valueContainer.getAttribute('name') === 'formName').toBe(true);
            done();
        });

        it('name attribute to div element', (done) => {
            elem = <HTMLTextAreaElement>createElement('div', { id: 'rte_test_div_EJ2_18135', attrs: { name: 'formName' } });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
            });
            rteObj.appendTo(elem);
            expect((rteObj as any).valueContainer.getAttribute('name') === 'formName').toBe(true);
            done();
        });

        afterEach((done) => {
            destroy(rteObj);
            done();
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
        afterAll(() => {
            destroy(rteObj);
        });
    });
  
    describe('EJ2-20436 - Changing font color of underlined text doesn’t changes the color of the line in RTE', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Underline', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor']
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Apply the underline and then apply the fontcolor', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Underline');
            dispatchEvent(item, 'mousedown');
            item.click();
            item = rteObj.element.querySelector('#' + controlId + '_toolbar_FontColor');
            dispatchEvent(item, 'mousedown');
            item = (item.querySelector('.e-rte-color-content') as HTMLElement);
            item.click();
            dispatchEvent(item, 'mousedown');
            let span: HTMLSpanElement = pEle.querySelector('span span');
            expect(span.style.color === 'rgb(255, 0, 0)').toBe(true);
            expect(span.style.textDecoration === 'inherit').toBe(true);
            done();
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

        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe(' EJ2-21471  -  RTE data annotation validation is not worked', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement = createElement('div', {
            id: "form-element", innerHTML:
                ` <div class="form-group">
                    <textarea id="defaultRTE" ejs-for data-val="RTEValue">
                    </textarea>
                   </div>
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

        it(' Set the data annotation attribute to textarea alone ', () => {
            expect(rteObj.element.hasAttribute('ejs-for')).toBe(false);
            expect(rteObj.element.hasAttribute('data-val')).toBe(false);
            expect((rteObj as any).valueContainer.hasAttribute('ejs-for')).toBe(true);
            expect((rteObj as any).valueContainer.hasAttribute('data-val')).toBe(true);
        });
    });

    describe(' EJ2-21612  -  To prevent the table quick toolbar when render RTE inside the table ', () => {
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
            dispatchEve(firstP, 'mousedown');
            (firstP as HTMLElement).click();
            dispatchEve(firstP, 'mouseup');
            setTimeout(() => {
                let popup: HTMLElement = document.querySelector("#defaultRTE_quick_TableRows");
                expect(!isNullOrUndefined(popup)).toBe(false);
                done();
            }, 100)
        });
        it(' click on outside of table content for prevent the quick toolbar ', (done) => {
            let firstP: Element = (rteObj as any).inputElement.querySelector('tr td');
            setCursorPoint(firstP, 0);
            dispatchEve(firstP, 'mousedown');
            (firstP as HTMLElement).click();
            dispatchEve(firstP, 'mouseup');
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
        beforeAll((done: Function) => {
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
            done();
        });
        it(' Check the toolbar status while click on fontsize and fontName element ', (done) => {
            let spanEle: HTMLElement = rteObj.element.querySelector('#rte-span');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, spanEle.childNodes[0], spanEle.childNodes[0], 0, 3);
            dispatchEve(spanEle, 'mousedown');
            dispatchEve(spanEle, 'mouseup');
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
            dispatchEve(spanEle, 'mousedown');
            dispatchEve(spanEle, 'mouseup');
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
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<p>a</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Click the source code with single character ', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEve(sourceCode, 'mousedown');
            dispatchEve(sourceCode, 'mouseup');
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
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<p>aaaaa</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Clicking on view source code with small value ', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            dispatchEve(sourceCode, 'mousedown');
            dispatchEve(sourceCode, 'mouseup');
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
        beforeEach((done: Function) => {
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                htmlAttributes: {
                    id: "htmlAttr-id"
                }
            });
            let target: HTMLElement = document.querySelector(".rte-element");
            rteObj.appendTo(target);
            rteObj.saveInterval = 0;
            rteObj.dataBind();
            done();
        })
        afterEach((done: Function) => {
            rteObj.destroy();
            detach(element);
            done();
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
                    default: 'Code'
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
            expect(format.querySelector(".e-rte-dropdown-btn-text").textContent === 'Code').toBe(true);
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
                default: 'Code'
            };
            rteObj.dataBind();
            rteEle = rteObj.element;
            controlId = rteEle.id;
            let fontSize: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontSize');
            let fontName: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_FontName');
            let format: HTMLElement = rteEle.querySelector('#' + controlId + '_toolbar_Formats');
            expect(fontSize.querySelector(".e-rte-dropdown-btn-text").textContent === '14 pt').toBe(true);
            expect(fontName.querySelector(".e-rte-dropdown-btn-text").textContent === 'Arial').toBe(true);
            expect(format.querySelector(".e-rte-dropdown-btn-text").textContent === 'Code').toBe(true);
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
                    default: 'Code'
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
            expect(fontSize.querySelector(".e-rte-dropdown-btn-text").textContent === '10 pt').toBe(true);
            expect(fontName.querySelector(".e-rte-dropdown-btn-text").textContent === 'Segoe UI').toBe(true);
            expect(format.querySelector(".e-rte-dropdown-btn-text").textContent === 'Paragraph').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontSize === '').toBe(true);
            expect(((rteObj as any).inputElement as HTMLElement).style.fontFamily === '').toBe(true);
        });

        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-22524 - Default value should be set while restting form - ', () => {

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
        describe(' reset  - ', () => {
            let rteObj: RichTextEditor;
            let form: FormValidator;
            let editNode: HTMLElement;
            let containerEle: HTMLElement;
            let onChange: jasmine.Spy;
            beforeEach((done: Function) => {
                containerEle = document.createElement('div');
                containerEle.innerHTML = innerHtmlRule;
                onChange = jasmine.createSpy('change');
                document.body.appendChild(containerEle);
                rteObj = new RichTextEditor({
                    showCharCount: true,
                    maxLength: 100,
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
                done();
            })
            afterEach((done: Function) => {
                rteObj.destroy();
                detach(containerEle);
                done();
            });

            it(' test the reset the form ', () => {
                editNode.focus();
                dispatchEvent(editNode, 'focusin');
                editNode.innerHTML = '<p>EJ2 RichTextEditor Component</p>';
                editNode.blur();
                dispatchEvent(editNode, 'focusout');
                let element: HTMLElement = rteObj.element.querySelector('#defaultRTE-info');
                expect(rteObj.value === '<p>EJ2 RichTextEditor Component</p>').toBe(true);
                expect(isNullOrUndefined(element)).toBe(true);
                expect(onChange).toHaveBeenCalled();
                form.reset();
                expect(rteObj.value === '<p>RichTextEditor</p>').toBe(true);
                expect(onChange).toHaveBeenCalledTimes(1);
            });
        });
    });
    describe('EJ2-22972 - Editor content rendered twice in DOM when using RichTextEditorFor', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        beforeEach((done: Function) => {
            done();
        });

        it(' Check the edit area content in wrapper element', (done) => {
            elem = <HTMLTextAreaElement>createElement('textarea',
                { id: 'rte_test_EJ2-22972', innerHTML: '<p class="test-paragraph">RichTextEditor</p>' });
            document.body.appendChild(elem);
            elem.setAttribute('ejs-for', '');
            rteObj = new RichTextEditor({
                value: '<p class="test-paragraph">RichTextEditor</p>'
            });
            rteObj.appendTo(elem);
            expect(rteObj.element.querySelectorAll('.test-paragraph').length === 1).toBe(true);
            done();
        });

        afterEach((done) => {
            destroy(rteObj);
            done();
        });
    });
    describe('EJ2-22988 - e-lib class not added into control root element, when render RTE using textarea element', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLTextAreaElement;
        beforeEach((done: Function) => {
            done();
        });

        it(' Check the root element class', (done) => {
            elem = <HTMLTextAreaElement>createElement('textarea',
                { id: 'rte_test_EJ2-22988' });
            document.body.appendChild(elem);
            rteObj = new RichTextEditor({
                value: '<p class="test-paragraph">RichTextEditor</p>'
            });
            rteObj.appendTo(elem);
            expect(rteObj.element.classList.contains('e-control')).toBe(true);
            expect(rteObj.element.classList.contains('e-lib')).toBe(true);
            expect(rteObj.element.classList.contains('e-richtexteditor')).toBe(true);
            expect((rteObj as any).valueContainer.classList.contains('e-control')).toBe(false);
            expect((rteObj as any).valueContainer.classList.contains('e-lib')).toBe(false);
            expect((rteObj as any).valueContainer.classList.contains('e-richtexteditor')).toBe(false);
            done();
        });

        afterEach((done) => {
            destroy(rteObj);
            done();
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
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                locale: 'de-DE'
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Check the alignments dropdown items ', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments');
            dispatchEve(item, 'mousedown');
            dispatchEve(item, 'mouseup');
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
        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-23588 - RichTextEditor inline mode error when color property is displayed in mobile view.', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let defaultUserAgent= navigator.userAgent;
        beforeEach((done: Function) => {
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
            done();
        });
        it(' Check the fontColor and backgroundColor ', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            dispatchEvent(pEle, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_FontColor');
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_quick_FontColor-popup');
                expect(!isNullOrUndefined(popup)).toBe(true);                
                done();
            }, 200);
        });
        afterEach(() => {
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
        beforeEach((done: Function) => {
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
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
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<p>Syncfusion</p>'
            });
            rteEle = rteObj.element;
            done();
        });
        it(' Check the alignments dropdown items ', (done) => {
            expect(rteObj.inputElement.innerHTML).toEqual('<p>Syncfusion</p>');
            rteObj.inputElement.innerHTML = '<p>RTE</p>';
            expect(rteObj.inputElement.innerHTML).toEqual('<p>RTE</p>');
            rteObj.disableToolbarItem(['Bold']);
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay').length).toEqual(3);
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[0].getAttribute('title')).toEqual('Bold');
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[1].getAttribute('title')).toEqual('Undo');
            expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[2].getAttribute('title')).toEqual('Redo');
            rteObj.refresh();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-toolbar-item.e-overlay').length).toEqual(2);
                expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[0].getAttribute('title')).toEqual('Undo');
                expect(document.querySelectorAll('.e-toolbar-item.e-overlay')[1].getAttribute('title')).toEqual('Redo');
                done();
            }, 200)
        });
        afterEach(() => {
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

        beforeEach(() => {
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

        afterEach(() => {
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
        let elem: any;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            done();
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
        afterEach(() => {
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
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
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
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
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
            (rteObj.formatter.editorManager as any).formatObj.onKeyUp({ event: keyboardEventArgs });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().childNodes[1].textContent === '').toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p')[0].textContent === '').toBe(true);
            expect(rteObj.contentModule.getEditPanel().childNodes[2].textContent === 'Sample content').toBe(true);
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
        it(' Enter key press before the image in a paragraph ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Formats']
                },
                value: '<p id="p1">Paragraph <img src="blob:null/abfb97c2-cd30-4405-81e0-2993d05bfa35" class="e-rte-image e-imginline" alt="blazor.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"> </p>'
            });
            rteEle = rteObj.element;
            let start: HTMLElement = document.getElementById('p1');
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, (start.childNodes[0] as Element), 10);
            (rteObj.formatter.editorManager as any).formatObj.onKeyUp({ event: keyboardEventArgs });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p').length === 1).toBe(true);
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-37997 - Lists all item selection with delete key action not remove the list completely', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 46, which: 46, shiftKey: false, action: 'delete'
        };
        it(' Ordered list with select all item with test ', () => {
            rteObj = renderRTE({
                value: '<ol><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ol>'
            });
            rteEle = rteObj.element;
            expect(document.querySelectorAll('ol').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.selectAll();
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            expect(document.querySelectorAll('ol').length === 0).toBe(true);
        });
        it(' Ordered list with select some item with test ', () => {
            rteObj = renderRTE({
                value: '<ol><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ol>'
            });
            rteEle = rteObj.element;
            expect(document.querySelectorAll('ol').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('ol').childNodes[0], rteObj.element.querySelector('ol').childNodes[1], 0, 1);
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            expect(document.querySelectorAll('ol').length === 0).toBe(false);
        });
        it(' Unordered list with select all item with test ', () => {
            rteObj = renderRTE({
                value: '<ul><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ul>'
            });
            rteEle = rteObj.element;
            expect(document.querySelectorAll('ul').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.selectAll();
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            expect(document.querySelectorAll('ul').length === 0).toBe(true);
        });
        it(' Unordered list with select some item with test ', () => {
            rteObj = renderRTE({
                value: '<ul><li>Test 1</li><li>Test 2</li><li>Test 3<br></li></ul>'
            });
            rteEle = rteObj.element;
            expect(document.querySelectorAll('ul').length === 1).toBe(true);
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('ul').childNodes[0], rteObj.element.querySelector('ul').childNodes[1], 0, 1);
            (rteObj.formatter.editorManager as any).listObj.keyDownHandler({ event: keyboardEventArgs });
            expect(document.querySelectorAll('ul').length === 0).toBe(false);
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-41562 - Script error occurs with toolbar options, when placing the cursor before & after RichTextEditor table', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        it(' Before the table element ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>'
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector('.e-content').childNodes.length === 1).toBe(true);
            rteObj.focusIn();
            let targetElm: HTMLElement = rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement;
            targetElm.click();
            expect(rteEle.querySelector('.e-content').childNodes.length === 1).toBe(true);
            expect(document.querySelectorAll('ol').length === 1).toBe(true);
            expect(rteEle.querySelector('.e-content').childNodes[0].nodeName === 'OL').toBe(true);
        });
        it(' After the table element ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>'
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector('.e-content').childNodes.length === 1).toBe(true);
            rteObj.focusIn();
            let range: Range = document.createRange();
            range.setStart(rteObj.element.querySelector('.e-content'), 1);
            rteObj.formatter.editorManager.nodeSelection.setRange(document, range);
            //rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.element.querySelector('table'), 0);
            let targetElm: HTMLElement = rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement;
            targetElm.click();
            expect(rteEle.querySelector('.e-content').childNodes.length === 2).toBe(true);
            expect(document.querySelectorAll('ol').length === 1).toBe(true);
            expect(rteEle.querySelector('.e-content').childNodes[0].nodeName === 'TABLE').toBe(true);
            expect(rteEle.querySelector('.e-content').childNodes[1].nodeName === 'OL').toBe(true);
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });
    describe('EJ2-41995 - RichTextEditor showFullscreen method call when read-only is enabled', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FullScreen']
                }
            });
            rteObj.readonly = true;
            rteObj.dataBind();
            done();
        });
        it('Checking Fullscreen view', (done) => {
            rteObj.showFullScreen();
            expect(rteObj.element.classList.contains("e-rte-full-screen")).toBe(true);
            done();
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });
    describe('BLAZ-6889 - RichTextEditor value changes are not maintained in source code view after focusing out', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            rteObj.value = 'Initial Content';
            rteEle = rteObj.element;
            controlId = rteEle.id;           
            rteObj.dataBind();
            done();
        });
        it('Checking Source code value changes after focusing out', (done) => {
            let sourceCode: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            sourceCode.click();
            rteObj.focusIn();
            let item: HTMLInputElement = rteObj.element.querySelector('.e-rte-srctextarea');
            item.value = 'rich text editor'; 
            rteObj.isBlur = true; 
            rteObj.focusOut();            
            rteObj.dataBind();                     
            setTimeout(() => {
                expect(rteObj.value === '<p>rich text editor</p>').toBe(true);
                expect(item.value === '<p>rich text editor</p>').toBe(true);
                done();
              }, 100);
            done();
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });
});