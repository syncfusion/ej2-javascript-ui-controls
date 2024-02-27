/**
 * CR-Issues RTE spec
 */
import { createElement, L10n, isNullOrUndefined, Browser, detach, isVisible } from '@syncfusion/ej2-base';
import { FormValidator } from "@syncfusion/ej2-inputs";
import { dispatchEvent } from '../../src/rich-text-editor/base/util';
import { RichTextEditor } from '../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy, setCursorPoint, dispatchEvent as dispatchEve } from './../rich-text-editor/render.spec';
import { SelectionCommands } from '../../src/editor-manager/plugin/selection-commands';
import { NodeSelection } from '../../src/selection/selection';
import { IRenderer, QuickToolbar } from '../../src/index';

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

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

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
            expect(span.parentElement.style.color === 'rgb(255, 0, 0)').toBe(true);
            expect(span.parentElement.style.textDecoration === 'inherit').toBe(true);
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
            expect( defaultRTE.inputElement.textContent.length ).toBe( 423 );
            ( defaultRTE as any ).keyDown( keyBoardEvent );
            expect( defaultRTE.inputElement.textContent.length ).toBe( 423 );
            style = ( defaultRTE as any ).inputElement.querySelector( '.FocusNode1' ).style.textDecoration;
            expect( style == "line-through" ).toBe( true );
        } );
    } );
    describe(' EJ2-62704  -  Rich Text Editor unique Id is not generated automatically when we do not set the Id property ', () => {
        let rteObj: RichTextEditor;
        const divElement: HTMLElement = createElement('div', {
            className: 'defaultRTE' });
        beforeEach((done: Function) => {
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
            done();
        });
        afterEach((done: Function) => {
            rteObj.destroy();
            detach(divElement);
            done();
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

    describe(' EJ2-65988 - Code block doesnt work properly when pasting contents into the pre tag in RTE' , () => {
        let rteObj: RichTextEditor ;
        let keyBoardEvent: any = {
            preventDefault: () => { },
            type: "keydown",
            stopPropagation: () => { },
            ctrlKey: false,
            shiftKey: false,
            action: null,
            which: 64,
            key: ""
          };
        const targetElm: HTMLElement = createElement('div', { className: 'target' });
        beforeEach( () => {
            rteObj = new RichTextEditor({
                toolbarSettings : {
                    items: ['Formats']
                }, value : '<pre>```<br><br><br>```</pre>'
            });
            document.body.appendChild(targetElm);
            rteObj.appendTo(targetElm);
        });
        afterEach(() => {
            rteObj.destroy();
            detach(targetElm);
        })
        it('Test for PRE Node Should add code block inside the <pre> tag', (done: Function) => {
            rteObj.focusIn();
            let firstPre: Element = (rteObj as any).inputElement.querySelector('pre');
            setCursorPoint(firstPre, 4);
            keyBoardEvent.clipboardData = {
                getData: (e: any) => {
                  if (e === "text/plain") {
                    return `// With strictBindCallApply off
                    function fn(x: string) {
                      return parseInt(x);
                    }
                     
                    // Note: No error; return type is any
                    const n = fn.call(undefined, false);`;
                  } else {
                    return '';
                  }
                },
                items: []
            }
            rteObj.onPaste(keyBoardEvent);
            expect( rteObj.element.querySelectorAll('pre').length ).toEqual(1);
            done();
        });
        it('Test for #text node, Should add code block inside the <pre> tag', (done: Function) => {
            rteObj.inputElement.innerHTML = '<pre><span style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255); display: inline !important; float: none;">The label </span><strong data-renderer-mark="true" style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">ProductPlanner_pid_1758</strong><span style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255); display: inline !important; float: none;"> was removed from the task since the added release plan label is not mapped under the fix version(s) </span><strong data-renderer-mark="true" style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">20.4-sp1</strong><span style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255); display: inline !important; float: none;">.</span>﻿﻿<br></pre>';
            rteObj.value = '<pre><span style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255); display: inline !important; float: none;">The label </span><strong data-renderer-mark="true" style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">ProductPlanner_pid_1758</strong><span style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255); display: inline !important; float: none;"> was removed from the task since the added release plan label is not mapped under the fix version(s) </span><strong data-renderer-mark="true" style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">20.4-sp1</strong><span style="color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: pre-wrap; background-color: rgb(255, 255, 255); display: inline !important; float: none;">.</span>﻿﻿<br></pre>';
            rteObj.focusIn();
            let firstStrong: Element = (rteObj as any).inputElement.querySelector('strong').nextSibling;
            setCursorPoint(firstStrong, 0);
            keyBoardEvent.clipboardData = {
                getData: (e: any) => {
                  if (e === "text/plain") {
                    return `// With strictBindCallApply off
                    function fn(x: string) {
                      return parseInt(x);
                    }
                     
                    // Note: No error; return type is any
                    const n = fn.call(undefined, false);`;
                  } else {
                    return '';
                  }
                },
                items: []
            }
            rteObj.onPaste(keyBoardEvent);
            expect( rteObj.element.querySelectorAll('pre').length ).toEqual(1);
            done();
        });
    });

    describe('EJ2-68037- Numbering list not applied properly after applying indents to the pasted list content in RichTextEditor', () => {
        let rteObj: RichTextEditor ;
        const targetElm: HTMLElement = createElement('div', { className: 'target' });
        beforeEach( () => {
            rteObj = new RichTextEditor({
                toolbarSettings : {
                    items: ['Indent', '|', 'Outdent', 'UnorderedList', 'OrderedList']
                }, value : `<ol level="1" style="list-style-type: decimal;margin-bottom:0in;"><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><strong><span style="font-size:10.5pt;
                line-height:107%;font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:
                white;">Lorem Ipsum</span></strong><span style="font-size:10.5pt;line-height:
                107%;font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">&nbsp;is
                simply dummy text of the printing and typesetting industry.</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
                font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">Lorem Ipsum
                has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen
                book. It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
                font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">It is a long
                established fact that a reader will be distracted by the readable content of a
                page when looking at its layout.</span></p><ul level="2" style="list-style-type: disc;margin-bottom:0in;"><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
                font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">There are many
                variations of passages of Lorem Ipsum available, but the majority have suffered
                alteration in some form, by injected humour, or randomised words which don't
                look even slightly believable.</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
                font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">Contrary to
                popular belief, Lorem Ipsum is not simply random text</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
                font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">The standard
                chunk of Lorem Ipsum used since the 1500s is reproduced below for those
                interested.</span></p></li></ul></li><li style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
                font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">There are many
                variations of passages of Lorem Ipsum available, but the majority have suffered
                alteration in some form, by injected humour, or randomised words which don't
                look even slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing hidden in the
                middle of text.</span></p></li></ol>`
            });
            document.body.appendChild(targetElm);
            rteObj.appendTo(targetElm);
        });
        afterEach(() => {
            destroy(rteObj);
        })
        it('Should not remove the list after clicking the outdent', (done: Function) => {
            rteObj.focusIn();
            const range: Range = document.createRange();
            const contentDiv : NodeList = document.querySelectorAll('.e-content');
            range.setStart(contentDiv[0].childNodes[0].firstChild, 0);
            range.setEnd(contentDiv[0].childNodes[0].lastChild, 1);
            rteObj.formatter.editorManager.nodeSelection.setRange(document ,range );
            (document.querySelector('.e-outdent') as HTMLElement).click();
            (document.querySelector('.e-order-list') as HTMLElement).click();
            expect(rteObj.element.querySelectorAll('li').length ).toEqual(7);
            expect(rteObj.element.querySelectorAll('ol').length ).toEqual(3);           
            done();
        });
        it('Should not remove the list after clicking the outdent Multiple times', (done: Function) => {
            const secondValue: string = `<ul level="1" style="list-style-type: disc;margin-bottom:0in;"><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><strong><span style="font-size:10.5pt;
            line-height:107%;font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:
            white;">Lorem Ipsum</span></strong><span style="font-size:10.5pt;line-height:
            107%;font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">&nbsp;is
            simply dummy text of the printing and typesetting industry.</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
            font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a type specimen
            book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
            font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">It is a long
            established fact that a reader will be distracted by the readable content of a
            page when looking at its layout.</span></p><ul level="2" style="list-style-type: circle;margin-bottom:0in;"><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
            font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">There are many
            variations of passages of Lorem Ipsum available, but the majority have suffered
            alteration in some form, by injected humour, or randomised words which don't
            look even slightly believable.</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
            font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">Contrary to
            popular belief, Lorem Ipsum is not simply random text</span></p></li><li style="margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
            font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">The standard
            chunk of Lorem Ipsum used since the 1500s is reproduced below for those
            interested.</span></p></li></ul></li><li style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:.5in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><p><span style="font-size:10.5pt;line-height:107%;
            font-family:&quot;Open Sans&quot;,sans-serif;color:black;background:white;">There are many
            variations of passages of Lorem Ipsum available, but the majority have suffered
            alteration in some form, by injected humour, or randomised words which don't
            look even slightly believable. If you are going to use a passage of Lorem
            Ipsum, you need to be sure there isn't anything embarrassing hidden in the
            middle of text.</span></p></li></ul>`;
            rteObj.value = secondValue;
            document.querySelector('.e-content').innerHTML = secondValue;
            rteObj.focusIn();
            const range: Range = document.createRange();
            const contentDiv : NodeList = document.querySelectorAll('.e-content');
            range.setStart(contentDiv[0].childNodes[0].firstChild, 0);
            range.setEnd(contentDiv[0].childNodes[0].lastChild, 1);
            rteObj.formatter.editorManager.nodeSelection.setRange(document ,range );
            (document.querySelector('.e-outdent') as HTMLElement).click();
            (document.querySelector('.e-unorder-list') as HTMLElement).click();
            expect(rteObj.element.querySelectorAll('li').length ).toEqual(7);
            expect(rteObj.element.querySelectorAll('ul').length ).toEqual(3);
            done();
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
        afterEach( () => {
            destroy(rteObject);
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
            (dropItems[6] as HTMLElement).click(); // Apply 34 pt
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
            (dropItems[6] as HTMLElement).click();
            const correctElementString : string = `<p><span style="font-size: 36pt;">Testing</span></p>`;
            expect( rteObject.inputElement.innerHTML === correctElementString ).toBe( true );
            done();
        });
    });

    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 2' , () => {
        let rteObject : RichTextEditor ;
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value:'Testing'
            });
        })
        afterEach( () => {
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
            ( dropItems[1] as HTMLElement ).click(); // Apply font
            ( dropButton[2] as HTMLElement ).click(); // Font color
            const row : NodeList= document.body.querySelectorAll('.e-row');
            const tileItems: NodeList = ( row[0] as HTMLElement ).querySelectorAll('.e-tile');
            ( tileItems[9] as HTMLElement ).click();
            // Background color
            (document.querySelectorAll('.e-control.e-colorpicker')[1] as any).ej2_instances[0].inline = true;
            (document.querySelectorAll('.e-control.e-colorpicker')[1] as any).ej2_instances[0].dataBind();
            ( document.body.querySelector('.e-apply') as HTMLElement).click();
            ( dropButton[1] as HTMLElement ).click(); // Font Size
            const fontDropItems : NodeList= document.body.querySelectorAll('.e-item');
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
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
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterEach( () => {
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            expect((range.startContainer.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
        });
    } );
    
    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 4 Link Element' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<p><span><a classname="e-rte-anchor" href="https://syncfusion.atlassian.net/browse/EJ2-65567" title="https://syncfusion.atlassian.net/browse/EJ2-65567" target="_blank"><span style="text-decoration: underline;">https://syncfusion.atlassian.net/browse/EJ2-65567</span> </a></span><br></p>';
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterEach( () => {
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            expect((range.startContainer.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
        });
    } );
    
    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 5 Code Block' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<pre><span style="text-decoration: line-through;"><span style="text-decoration: underline;">Testing﻿﻿</span></span><br></pre>';
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterEach( () => {
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            expect((contentElem.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
        } );
        
    } );

    describe(' EJ2-65567 - Underline and Strikethrough toolbar styles doesnt work properly CASE 7 Image Element Alt Text' , () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = '<p><span class="e-img-caption e-rte-img-caption null e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap null"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" alt="RTEImage-Feather.png" width="auto" height="auto" style="min-width: 0px; max-width: 1277px; min-height: 0px;"><span class="e-img-inner null" contenteditable="true">Caption</span></span></span> </p>';
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                } ,value: innerHTML
            });
        })
        afterEach( () => {
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
            ( fontDropItems[6] as HTMLElement ).click(); // Apply Font size
            expect((range.startContainer.childNodes[0] as HTMLElement).style.fontSize).toEqual('36pt');
            done();
        });
    } );

    describe('EJ2-68448 - Alignment issue occurs when copy and pasting contents from word to RTE', () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = `<html xmlns:v="urn:schemas-microsoft-com:vml"\r\nxmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n<link rel=Edit-Time-Data\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_editdata.mso">\r\n\x3C!--[if !mso]>\r\n<style>\r\nv\\:* {behavior:url(#default#VML);}\r\no\\:* {behavior:url(#default#VML);}\r\nw\\:* {behavior:url(#default#VML);}\r\n.shape {behavior:url(#default#VML);}\r\n</style>\r\n<![endif]-->\x3C!--[if gte mso 9]><xml>\r\n <o:OfficeDocumentSettings>\r\n  <o:AllowPNG/>\r\n </o:OfficeDocumentSettings>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves>false</w:TrackMoves>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n\x3C!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\r\n@font-face\r\n\t{font-family:"Open Sans";\r\n\tmso-font-alt:"Segoe UI";\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536870161 1073750107 40 0 415 0;}\r\n@font-face\r\n\t{font-family:"Noto Sans";\r\n\tmso-font-alt:"Nirmala UI";\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-536837377 1073772799 33 0 415 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\np.li, li.li, div.li\r\n\t{mso-style-name:li;\r\n\tmso-style-unhide:no;\r\n\tmso-style-parent:"";\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:7.5pt;\r\n\tmargin-left:30.0pt;\r\n\tmso-pagination:widow-orphan lines-together;\r\n\tfont-size:9.0pt;\r\n\tfont-family:"Noto Sans",sans-serif;\r\n\tmso-fareast-font-family:"Noto Sans";\r\n\tmso-ansi-language:DA;\r\n\tmso-fareast-language:DA;}\r\np.p1, li.p1, div.p1\r\n\t{mso-style-name:p_1;\r\n\tmso-style-unhide:no;\r\n\tmso-style-parent:"";\r\n\tmargin-top:10.05pt;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:10.05pt;\r\n\tmargin-left:30.0pt;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:9.0pt;\r\n\tfont-family:"Noto Sans",sans-serif;\r\n\tmso-fareast-font-family:"Noto Sans";\r\n\tmso-ansi-language:DA;\r\n\tmso-fareast-language:DA;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:107%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:1.0in 1.0in 1.0in 1.0in;\r\n\tmso-header-margin:.5in;\r\n\tmso-footer-margin:.5in;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:2020347421;\r\n\tmso-list-template-ids:633142248;}\r\n@list l0:level1\r\n\t{mso-level-tab-stop:0in;\r\n\tmso-level-number-position:right;\r\n\tmargin-left:0in;\r\n\ttext-indent:-10.5pt;\r\n\tmso-pagination:widow-orphan lines-together;\r\n\tmso-ansi-font-size:9.0pt;\r\n\tmso-bidi-font-size:9.0pt;\r\n\tcolor:black;}\r\n@list l0:level2\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\n@list l0:level3\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\n@list l0:level4\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\n@list l0:level5\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\n@list l0:level6\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\n@list l0:level7\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\n@list l0:level8\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\n@list l0:level9\r\n\t{mso-level-start-at:0;\r\n\tmso-level-text:"";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:0in;\r\n\ttext-indent:0in;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n\x3C!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style='tab-interval:.5in;word-wrap:break-word'>\r\n\x3C!--StartFragment-->\r\n\r\n<p class=li style='margin-top:8.0pt;text-indent:-30.0pt;mso-text-indent-alt:\r\n-10.5pt;mso-list:l0 level1 lfo1;tab-stops:list 0in'><![if !supportLists]><span\r\nlang=DA style='color:black'><span style='mso-list:Ignore'><span\r\nstyle='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><strong><span lang=DA style='font-size:10.5pt;\r\nfont-family:"Open Sans",sans-serif;color:black;background:white'>Lorem Ipsum</span></strong><span\r\nlang=DA style='font-size:10.5pt;font-family:"Open Sans",sans-serif;color:black;\r\nbackground:white'>&nbsp;is simply dummy text of the printing and typesetting\r\nindustry.</span><span lang=DA><o:p></o:p></span></p>\r\n\r\n<p class=p1><span lang=DA style='mso-no-proof:yes'>\x3C!--[if gte vml 1]><v:shapetype\r\n id="_x0000_t75" coordsize="21600,21600" o:spt="75" o:preferrelative="t"\r\n path="m@4@5l@4@11@9@11@9@5xe" filled="f" stroked="f">\r\n <v:stroke joinstyle="miter"/>\r\n <v:formulas>\r\n  <v:f eqn="if lineDrawn pixelLineWidth 0"/>\r\n  <v:f eqn="sum @0 1 0"/>\r\n  <v:f eqn="sum 0 0 @1"/>\r\n  <v:f eqn="prod @2 1 2"/>\r\n  <v:f eqn="prod @3 21600 pixelWidth"/>\r\n  <v:f eqn="prod @3 21600 pixelHeight"/>\r\n  <v:f eqn="sum @0 0 1"/>\r\n  <v:f eqn="prod @6 1 2"/>\r\n  <v:f eqn="prod @7 21600 pixelWidth"/>\r\n  <v:f eqn="sum @8 21600 0"/>\r\n  <v:f eqn="prod @7 21600 pixelHeight"/>\r\n  <v:f eqn="sum @10 21600 0"/>\r\n </v:formulas>\r\n <v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/>\r\n <o:lock v:ext="edit" aspectratio="t"/>\r\n</v:shapetype><v:shape id="Picture_x0020_9" o:spid="_x0000_i1025" type="#_x0000_t75"\r\n alt="Open the Settings window in Siveillance Video Client." style='width:153pt;\r\n height:87.75pt;visibility:visible;mso-wrap-style:square'>\r\n <v:imagedata src="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png"\r\n  o:title="Open the Settings window in Siveillance Video Client"/>\r\n <o:lock v:ext="edit" aspectratio="f"/>\r\n</v:shape><![endif]--><![if !vml]><img width=204 height=117\r\nsrc="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_image002.png"\r\nalt="Open the Settings window in Siveillance Video Client." v:shapes="Picture_x0020_9"><![endif]></span><span\r\nlang=DA><o:p></o:p></span></p>\r\n\r\n<p class=li style='text-indent:-30.0pt;mso-text-indent-alt:-10.5pt;mso-list:\r\nl0 level1 lfo1;tab-stops:list 0in'><![if !supportLists]><span lang=DA\r\nstyle='color:black'><span style='mso-list:Ignore'><span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span>2.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=DA style='font-size:10.5pt;\r\nfont-family:"Open Sans",sans-serif;color:black;background:white'>It was\r\npopularised in the 1960s with the release of Letraset sheets containing Lorem\r\nIpsum passages, and more recently with desktop publishing software like Aldus\r\nPageMaker including versions of Lorem Ipsum</span><span lang=DA\r\nstyle='color:black'>.</span><span lang=DA><o:p></o:p></span></p>\r\n\r\n<p class=li style='text-indent:-30.0pt;mso-text-indent-alt:-10.5pt;mso-list:\r\nl0 level1 lfo1;tab-stops:list 0in'><![if !supportLists]><span lang=DA\r\nstyle='color:black'><span style='mso-list:Ignore'><span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span>3.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=DA style='font-size:10.5pt;\r\nfont-family:"Open Sans",sans-serif;color:black;background:white'>Contrary to\r\npopular belief, Lorem Ipsum is not simply random text</span><span lang=DA><o:p></o:p></span></p>\r\n\r\n<p class=li style='margin-bottom:10.05pt;text-indent:-30.0pt;mso-text-indent-alt:\r\n-10.5pt;mso-list:l0 level1 lfo1;tab-stops:list 0in'><![if !supportLists]><span\r\nlang=DA style='color:black'><span style='mso-list:Ignore'><span\r\nstyle='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span>4.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=DA style='font-size:10.5pt;\r\nfont-family:"Open Sans",sans-serif;color:black;background:white'>The first line\r\nof Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in\r\nsection 1.10.32.</span><span lang=DA><o:p></o:p></span></p>\r\n\r\n\x3C!--EndFragment-->\r\n</body>\r\n\r\n</html>\r\n`;
        beforeEach( () => {
            rteObject = renderRTE({
                pasteCleanupSettings: {
                    prompt: true
                }, value: ''
        });
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Test for margin-left and start attribute', (done : Function) => {
            let keyBoardEvent: any = {
                preventDefault: () => { },
                type: 'keydown',
                stopPropagation: () => { },
                ctrlKey: false,
                shiftKey: false,
                action: null,
                which: 64,
                key: ''
              };
            rteObject.dataBind();
            keyBoardEvent.clipboardData = {
            getData: () => {
                return innerHTML;
            },
            items: []
            };
            setCursorPoint((rteObject as any).inputElement.firstElementChild, 0);
            rteObject.onPaste(keyBoardEvent);
            setTimeout(() => {
                if (rteObject.pasteCleanupSettings.prompt) {
                    let keepFormat: any = document.getElementById(rteObject.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-keepformat');
                    keepFormat[0].click();
                    let pasteOK: any = document.getElementById(rteObject.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-pasteok');
                    pasteOK[0].click();
                }
                expect(rteObject.element.querySelector('li').style.marginLeft === '').toEqual(true);
                expect(rteObject.element.querySelectorAll('ol')[1].start === 2).toEqual(true);
                done();
            }, 400);
        });
    });

    describe(' EJ2-68542: Font size not applied properly for the Numbered lists in RichTextEditor' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = '<p style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br /></p><p style="text-align:center; margin-bottom: 5px; "><font face="Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></font><br /></p><p style="text-align: center; margin-bottom: 2px; "><font face="Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br/></font></p><p style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;"></span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></p><p style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; "></span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></p>';
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'FontSize','OrderedList']
                } ,value: innerHTML
            });
        })
        afterEach( () => {
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
            expect(rteObject.inputElement.innerHTML===`<ol><li style="text-align: center; margin-bottom: 15px; font-size: 36pt;"><span style="font-size: 36pt;"><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><span style="font-size: 36pt;"><br></span></li><li style="text-align: center; margin-bottom: 5px; font-size: 36pt;"><font face="Calibri"><span style="font-size: 36pt;"><b>&lt;#districtname#&gt;</b></span></font><span style="font-size: 36pt;"><br></span></li><li style="text-align: center; margin-bottom: 2px; font-size: 36pt;"><font face="Calibri"><span style="font-size: 36pt;"><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><span style="font-size: 36pt;"><br></span></font></li><li style="text-align: center; margin-bottom: 2px; font-size: 36pt;"><span style="font-size: 12pt;">​</span><span style="font-size: 36pt;"><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></li><li style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></li></ol>`)
            done();
        });
    });
    describe(' EJ2-68542: Font size not applied properly for the Numbered lists in RichTextEditor' , () => {
        let rteObject : RichTextEditor ;
        const innerHTML: string = '<ol><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">&lt;#meetingtitle#&gt;</span></strong></span><br><ol><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">r﻿ichtexteditor</span></strong></span></li><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">WYSIWYG&nbsp;</span></strong></span><ol><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; ">create and edit</span></strong></span></li><li style="text-align:center; margin-bottom: 15px; "><span style="font-size: 17pt; "><strong><span style="font-family: Calibri; "><b style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 14px; text-align: start;">Toolbar</b>﻿<br></span></strong></span></li></ol></li></ol></li><li style="text-align:center; margin-bottom: 5px; "><font face="Calibri"><span style="font-size: 17pt; "><b>&lt;#districtname#&gt;</b></span></font><br></li><li style="text-align: center; margin-bottom: 2px; "><font face="Calibri"><span style="font-size: 12pt; "><b><em>Policy Site:</em> ##&lt;#policysitelink#&gt;##</b></span><br></font></li><li style="text-align: center; margin-bottom: 2px; "><span style="font-size: 12pt;">​</span><span style="font-size: 14pt; "><span style="font-family: Calibri; ">&lt;#locationcity#&gt;, &lt;#locationstate#&gt;</span></span></li><li style="text-align: center; "><span style="font-size: 14pt; "><span style="font-family: Calibri; ">​</span><span style="font-size: 14pt;"><span style="font-family: Calibri; ">&lt;#meetingdatelong#&gt; at &lt;#meetingtime#&gt;</span></span></span></li></ol>';
        beforeEach( () => {
            rteObject = renderRTE({ 
                toolbarSettings : { items: [ 'FontSize','OrderedList']
                } ,value: innerHTML
            });
        })
        afterEach( () => {
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
            expect((nodeList[0] as HTMLElement).style.fontSize === '36pt')
            expect((nodeList[1] as HTMLElement).style.fontSize === '36pt')
            done();
        });
    });

    describe("EJ2-69957: Quick toolbar tooltip remains in the open state after close the toolbar", () => {
        let rteObj: RichTextEditor;
        let originalTimeout: number;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
            done();
        });
    
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            destroy(rteObj);
        });
    
        it('check undo tooltip content', (done: Function) => {
            const undoEle = document.querySelectorAll('.e-toolbar-item')[0];
            let mouseEve = new MouseEvent("mouseover", {bubbles: true,cancelable: true,view: window});
            undoEle.dispatchEvent(mouseEve);
            setTimeout(() => {
                // expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                // expect((document.querySelector('.e-tooltip-wrap').childNodes[0] as HTMLElement).innerHTML === 'Undo (Ctrl+Z)').toBe(true);
                dispatchEvent(undoEle, 'mouseleave');
                done();
            }, 1000);
        });
    });

    describe('BLAZ-6889 - RichTextEditor value changes are not maintained in source code view after focusing out', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        beforeAll((done: Function) => {
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
            setTimeout(() => {
                expect(rteObj.value === '<p>rich text editor</p>').toBe(true);
                expect(item.value === '<p>rich text editor</p>').toBe(true);
                done();
              }, 800);
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
    });
    describe('838394 - Updated values not sent to the server when we dynamically change the readOnly in RichTextEditor', function () {
        let rteObj: RichTextEditor;
        beforeAll(function (done) {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                },
                value : "Rich Text Editor",
                readonly : true 
            });
            rteObj.dataBind();
            done();
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
        afterAll(function (done) {
            destroy(rteObj);
            done();
        });
    });
    describe('841892 - CTRL + Enter triggers the enter action in the Editor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'Enter', keyCode: 13, stopPropagation: () => { }, shiftKey: false, which: 8};
        it('Pressing Crt + enter key after ', (done: Function) => {
            rteObj = renderRTE({
                value: `<p>Testing</p>`,
            });
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 4, 4);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            keyBoardEvent.code = 'Enter';
            keyBoardEvent.action = 'enter';
            keyBoardEvent.which = 13;
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj as any).inputElement.innerHTML === `<p>Testing</p>`).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    
    describe('844614 - The enableHtmlSanitizer property is not working properly in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll((done)=> {
            rteObj = renderRTE({
                value : "Rich Text Editor"
            });
            done();
        });
        it('Sanitize the value if update dynamically ', (done: Function) => {
            rteObj.value = '<p><img src=x onerror=alert(document.domain)></p>';
            rteObj.dataBind();
            expect((rteObj as any).inputElement.innerHTML === `<p><img src="x" class="e-rte-image e-imginline"></p>`).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('844717 - The toolbar Button Tooltip not get destroyed when the dialog is opened and closed issue resolved', () => {
        let rteObj: RichTextEditor;
        beforeAll((done)=> {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'FullScreen']
                },
                value : "Rich Text Editor"
            });
            done();
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

    describe('846923 - The heading colour is set to blue after copying and pasting inside the editor.', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = {
            preventDefault: () => { },
            type: 'keydown',
            stopPropagation: () => { },
            ctrlKey: false,
            shiftKey: false,
            action: null,
            which: 64,
            key: ''
          };
        const data = `<html xmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:w="urn:schemas-microsoft-com:office:word"\r\nxmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Word.Document>\r\n<meta name=Generator content="Microsoft Word 15">\r\n<meta name=Originator content="Microsoft Word 15">\r\n<link rel=File-List\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n<link rel=Preview\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_preview.wmf">\r\n\x3C!--[if gte mso 9]><xml>\r\n <o:DocumentProperties>\r\n  <o:Version>16.00</o:Version>\r\n </o:DocumentProperties>\r\n</xml><![endif]-->\r\n<link rel=themeData\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\r\n<link rel=colorSchemeMapping\r\nhref="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\r\n\x3C!--[if gte mso 9]><xml>\r\n <w:WordDocument>\r\n  <w:View>Normal</w:View>\r\n  <w:Zoom>0</w:Zoom>\r\n  <w:TrackMoves/>\r\n  <w:TrackFormatting/>\r\n  <w:PunctuationKerning/>\r\n  <w:ValidateAgainstSchemas/>\r\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\r\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\r\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\r\n  <w:DoNotPromoteQF/>\r\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\r\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\r\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\r\n  <w:Compatibility>\r\n   <w:BreakWrappedTables/>\r\n   <w:SnapToGridInCell/>\r\n   <w:WrapTextWithPunct/>\r\n   <w:UseAsianBreakRules/>\r\n   <w:DontGrowAutofit/>\r\n   <w:SplitPgBreakAndParaMark/>\r\n   <w:EnableOpenTypeKerning/>\r\n   <w:DontFlipMirrorIndents/>\r\n   <w:OverrideTableStyleHps/>\r\n  </w:Compatibility>\r\n  <m:mathPr>\r\n   <m:mathFont m:val="Cambria Math"/>\r\n   <m:brkBin m:val="before"/>\r\n   <m:brkBinSub m:val="&#45;-"/>\r\n   <m:smallFrac m:val="off"/>\r\n   <m:dispDef/>\r\n   <m:lMargin m:val="0"/>\r\n   <m:rMargin m:val="0"/>\r\n   <m:defJc m:val="centerGroup"/>\r\n   <m:wrapIndent m:val="1440"/>\r\n   <m:intLim m:val="subSup"/>\r\n   <m:naryLim m:val="undOvr"/>\r\n  </m:mathPr></w:WordDocument>\r\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\r\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\r\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\r\n  LatentStyleCount="376">\r\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\r\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\r\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index 9"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 1"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 2"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 3"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 4"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 5"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 6"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 7"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 8"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="toc 9"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="header"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footer"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="index heading"/>\r\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of figures"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="envelope return"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="footnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="line number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="page number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote reference"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="endnote text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="table of authorities"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="macro"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="toa heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Bullet 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Number 5"/>\r\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Closing"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Signature"/>\r\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="List Continue 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Message Header"/>\r\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Salutation"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Date"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text First Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Note Heading"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Body Text Indent 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Block Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="FollowedHyperlink"/>\r\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\r\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Document Map"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Plain Text"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="E-mail Signature"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Top of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Bottom of Form"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal (Web)"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Acronym"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Address"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Cite"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Code"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Definition"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Keyboard"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Preformatted"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Sample"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Typewriter"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="HTML Variable"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Normal Table"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="annotation subject"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="No List"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Outline List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Simple 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Classic 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Colorful 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Columns 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Grid 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 4"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 5"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 7"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table List 8"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table 3D effects 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Contemporary"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Elegant"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Professional"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Subtle 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 2"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Web 3"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Balloon Text"/>\r\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Table Theme"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\r\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\r\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\r\n   Name="List Paragraph"/>\r\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\r\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\r\n   Name="Intense Quote"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\r\n   Name="Subtle Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\r\n   Name="Intense Emphasis"/>\r\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\r\n   Name="Subtle Reference"/>\r\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\r\n   Name="Intense Reference"/>\r\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\r\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\r\n   UnhideWhenUsed="true" Name="Bibliography"/>\r\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\r\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\r\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\r\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\r\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\r\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\r\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\r\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="Grid Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="Grid Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="Grid Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\r\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 1"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 2"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 3"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 4"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 5"/>\r\n  <w:LsdException Locked="false" Priority="46"\r\n   Name="List Table 1 Light Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="51"\r\n   Name="List Table 6 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" Priority="52"\r\n   Name="List Table 7 Colorful Accent 6"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Hyperlink"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Hashtag"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Unresolved Mention"/>\r\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\r\n   Name="Smart Link"/>\r\n </w:LatentStyles>\r\n</xml><![endif]-->\r\n<style>\r\n\x3C!--\r\n /* Font Definitions */\r\n @font-face\r\n\t{font-family:Wingdings;\r\n\tpanose-1:5 0 0 0 0 0 0 0 0 0;\r\n\tmso-font-charset:2;\r\n\tmso-generic-font-family:auto;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:0 268435456 0 0 -2147483648 0;}\r\n@font-face\r\n\t{font-family:"Cambria Math";\r\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:roman;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:3 0 0 0 1 0;}\r\n@font-face\r\n\t{font-family:Calibri;\r\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\r\n@font-face\r\n\t{font-family:Verdana;\r\n\tpanose-1:2 11 6 4 3 5 4 4 2 4;\r\n\tmso-font-charset:0;\r\n\tmso-generic-font-family:swiss;\r\n\tmso-font-pitch:variable;\r\n\tmso-font-signature:-1610610945 1073750107 16 0 415 0;}\r\n /* Style Definitions */\r\n p.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{mso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-parent:"";\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;\r\n\tmso-no-proof:yes;}\r\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;\r\n\tmso-no-proof:yes;}\r\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;\r\n\tmso-no-proof:yes;}\r\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:0in;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;\r\n\tmso-no-proof:yes;}\r\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\r\n\t{mso-style-priority:34;\r\n\tmso-style-unhide:no;\r\n\tmso-style-qformat:yes;\r\n\tmso-style-type:export-only;\r\n\tmargin-top:0in;\r\n\tmargin-right:0in;\r\n\tmargin-bottom:8.0pt;\r\n\tmargin-left:.5in;\r\n\tmso-add-space:auto;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;\r\n\tmso-no-proof:yes;}\r\n.MsoChpDefault\r\n\t{mso-style-type:export-only;\r\n\tmso-default-props:yes;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-fareast-font-family:Calibri;\r\n\tmso-fareast-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;}\r\n.MsoPapDefault\r\n\t{mso-style-type:export-only;\r\n\tmargin-bottom:8.0pt;\r\n\tline-height:107%;}\r\n@page WordSection1\r\n\t{size:8.5in 11.0in;\r\n\tmargin:70.85pt 70.85pt 70.85pt 70.85pt;\r\n\tmso-header-margin:35.45pt;\r\n\tmso-footer-margin:35.45pt;\r\n\tmso-paper-source:0;}\r\ndiv.WordSection1\r\n\t{page:WordSection1;}\r\n /* List Definitions */\r\n @list l0\r\n\t{mso-list-id:146942170;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-884861090 67698711 67698691 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}\r\n@list l0:level1\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-text:"%1\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:1.0in;\r\n\ttext-indent:-.25in;}\r\n@list l0:level2\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:1.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l0:level3\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:2.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l0:level4\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:2.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l0:level5\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:3.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l0:level6\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:3.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l0:level7\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:4.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l0:level8\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:4.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l0:level9\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:5.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l1\r\n\t{mso-list-id:580409392;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-870579216 69009423 69009433 69009435 69009423 69009433 69009435 69009423 69009433 69009435;}\r\n@list l1:level1\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:.75in;\r\n\ttext-indent:-.25in;}\r\n@list l1:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:1.25in;\r\n\ttext-indent:-.25in;}\r\n@list l1:level3\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\tmargin-left:1.75in;\r\n\ttext-indent:-9.0pt;}\r\n@list l1:level4\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:2.25in;\r\n\ttext-indent:-.25in;}\r\n@list l1:level5\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:2.75in;\r\n\ttext-indent:-.25in;}\r\n@list l1:level6\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\tmargin-left:3.25in;\r\n\ttext-indent:-9.0pt;}\r\n@list l1:level7\r\n\t{mso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:3.75in;\r\n\ttext-indent:-.25in;}\r\n@list l1:level8\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:4.25in;\r\n\ttext-indent:-.25in;}\r\n@list l1:level9\r\n\t{mso-level-number-format:roman-lower;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:right;\r\n\tmargin-left:4.75in;\r\n\ttext-indent:-9.0pt;}\r\n@list l2\r\n\t{mso-list-id:654146057;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:-33259496 67698689 67698711 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}\r\n@list l2:level1\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l2:level2\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-text:"%2\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;}\r\n@list l2:level3\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l2:level4\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l2:level5\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l2:level6\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l2:level7\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l2:level8\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l2:level9\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l3\r\n\t{mso-list-id:1284770410;\r\n\tmso-list-type:hybrid;\r\n\tmso-list-template-ids:1544960842 515659710 67698691 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}\r\n@list l3:level1\r\n\t{mso-level-number-format:alpha-lower;\r\n\tmso-level-text:"%1\\)";\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:1.0in;\r\n\ttext-indent:-.25in;}\r\n@list l3:level2\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:1.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l3:level3\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:2.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l3:level4\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:2.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l3:level5\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:3.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l3:level6\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:3.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\n@list l3:level7\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:4.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Symbol;}\r\n@list l3:level8\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:o;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:4.5in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:"Courier New";}\r\n@list l3:level9\r\n\t{mso-level-number-format:bullet;\r\n\tmso-level-text:;\r\n\tmso-level-tab-stop:none;\r\n\tmso-level-number-position:left;\r\n\tmargin-left:5.0in;\r\n\ttext-indent:-.25in;\r\n\tfont-family:Wingdings;}\r\nol\r\n\t{margin-bottom:0in;}\r\nul\r\n\t{margin-bottom:0in;}\r\n-->\r\n</style>\r\n\x3C!--[if gte mso 10]>\r\n<style>\r\n /* Style Definitions */\r\n table.MsoNormalTable\r\n\t{mso-style-name:"Table Normal";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-noshow:yes;\r\n\tmso-style-priority:99;\r\n\tmso-style-parent:"";\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-para-margin-top:0in;\r\n\tmso-para-margin-right:0in;\r\n\tmso-para-margin-bottom:8.0pt;\r\n\tmso-para-margin-left:0in;\r\n\tline-height:107%;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;}\r\ntable.MsoTableGrid\r\n\t{mso-style-name:"Table Grid";\r\n\tmso-tstyle-rowband-size:0;\r\n\tmso-tstyle-colband-size:0;\r\n\tmso-style-priority:39;\r\n\tmso-style-unhide:no;\r\n\tborder:solid windowtext 1.0pt;\r\n\tmso-border-alt:solid windowtext .5pt;\r\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\r\n\tmso-border-insideh:.5pt solid windowtext;\r\n\tmso-border-insidev:.5pt solid windowtext;\r\n\tmso-para-margin:0in;\r\n\tmso-pagination:widow-orphan;\r\n\tfont-size:11.0pt;\r\n\tfont-family:"Calibri",sans-serif;\r\n\tmso-ascii-font-family:Calibri;\r\n\tmso-ascii-theme-font:minor-latin;\r\n\tmso-hansi-font-family:Calibri;\r\n\tmso-hansi-theme-font:minor-latin;\r\n\tmso-bidi-font-family:"Times New Roman";\r\n\tmso-bidi-theme-font:minor-bidi;\r\n\tmso-ansi-language:ES;\r\n\tmso-fareast-language:ES;\r\n\tmso-bidi-language:ES;}\r\n</style>\r\n<![endif]-->\r\n</head>\r\n\r\n<body lang=EN-US style='tab-interval:.5in;word-wrap:break-word'>\r\n\x3C!--StartFragment-->\r\n\r\n<p class=MsoNormal><a name="_Toc31786183"><b><span lang=ES style='font-size:\r\n14.0pt;line-height:107%'>15.1.5 Protocolos de pruebas<span\r\nstyle='mso-spacerun:yes'>                                                                 \r\n</span></span></b></a><b><span lang=ES style='font-size:14.0pt;line-height:\r\n107%'><o:p></o:p></span></b></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Arial'>Las reclamaciones relativas a las áreas que se\r\nenumeran a continuación requieren protocolos/informes de prueba rellenados por\r\ncompleto y archivados por un concesionario autorizado y que se envíen copias\r\nadjuntas con las devoluciones de material de la garantía de TMA o a petición de\r\nVolvo (un Informe del inspector no sustituye a los protocolos/informes de\r\nprueba).</span><span lang=ES><o:p></o:p></span></p>\r\n\r\n<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0\r\n style='border-collapse:collapse;mso-table-layout-alt:fixed;border:none;\r\n mso-border-alt:solid windowtext .5pt;mso-yfti-tbllook:1184;mso-padding-alt:\r\n 0in 5.4pt 0in 5.4pt'>\r\n <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:14.25pt'>\r\n  <td width=179 style='width:134.25pt;border:solid windowtext 1.0pt;background:\r\n  #EEECE1;padding:0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial;color:black;mso-color-alt:windowtext'>ÁREA</span></b><span lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=425 style='width:318.75pt;border:solid windowtext 1.0pt;border-left:\r\n  none;mso-border-left-alt:solid windowtext 1.0pt;background:#EEECE1;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial;color:black;mso-color-alt:windowtext'>INSTRUCCIÓN</span></b><span\r\n  lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:1;height:14.25pt'>\r\n  <td width=179 style='width:134.25pt;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext 1.0pt;background:#EEECE1;padding:\r\n  0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial;color:black;mso-color-alt:windowtext'>Batería de 12&nbsp;V</span><span\r\n  lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=425 style='width:318.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial'>Consulte los detalles a continuación </span><span lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:2;height:14.25pt'>\r\n  <td width=179 style='width:134.25pt;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext 1.0pt;background:#EEECE1;padding:\r\n  0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial;color:black;mso-color-alt:windowtext'>Consumo de aceite</span><span\r\n  lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=425 style='width:318.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial'>Consulte los detalles a continuación</span><span lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:3;mso-yfti-lastrow:yes;height:14.25pt'>\r\n  <td width=179 style='width:134.25pt;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext 1.0pt;background:#EEECE1;padding:\r\n  0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial;color:black;mso-color-alt:windowtext'>Alineación de las ruedas</span><span\r\n  lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=425 style='width:318.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.25pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  Arial'>Informe generado por la herramienta aprobada descrita en IMPACT</span><span\r\n  lang=ES><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n</table>\r\n\r\n<p class=MsoNormal><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Arial'>Nota: si el protocolo/informe no está disponible\r\nen el idioma local, se debe utilizar la versión en inglés.</span><span lang=ES><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal><b><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Arial'>Batería de 12&nbsp;V</span></b><span lang=ES><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Arial'>Al analizar las baterías de 12&nbsp;voltios, es\r\nobligatorio utilizar el comprobador de baterías aprobado que se describe en\r\nIMPACT (func gr 31). El resultado de la prueba ”Bad Cell” (Celda defectuosa) es\r\nel único mensaje que justifica una reclamación de reparación cubierta por\r\ngarantía. </span><span lang=ES><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Arial'>Si se presenta una reclamación de reparación\r\ncubierta por garantía:</span><span lang=ES><o:p></o:p></span></p>\r\n\r\n<p class=MsoListParagraph style='margin-top:0in;margin-right:0in;margin-bottom:\r\n0in;margin-left:.25in;mso-add-space:auto;text-indent:-.25in;line-height:normal;\r\nmso-list:l2 level1 lfo2'><![if !supportLists]><span lang=ES style='font-family:\r\nSymbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-no-proof:\r\nno'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri'>Al usar la herramienta Tech Tool (solo VT: FH,\r\nFM y FMX)</span><span lang=ES style='font-family:"Arial",sans-serif;mso-fareast-font-family:\r\nCalibri;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;text-indent:-.25in;line-height:normal;mso-list:l0 level1 lfo3'><![if !supportLists]><span\r\nlang=ES style='font-family:"Times New Roman",serif;mso-ascii-theme-font:minor-fareast;\r\nmso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:minor-fareast;\r\nmso-hansi-theme-font:minor-fareast;mso-bidi-theme-font:minor-fareast;\r\nmso-no-proof:no'><span style='mso-list:Ignore'>a)<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman"'>Realice la prueba de la batería y\r\nasegúrese de que se guarden los resultados</span><span lang=ES\r\nstyle='font-family:"Times New Roman",serif;mso-ascii-theme-font:minor-fareast;\r\nmso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:minor-fareast;\r\nmso-hansi-theme-font:minor-fareast;mso-bidi-theme-font:minor-fareast;\r\nmso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;text-indent:-.25in;line-height:normal;mso-list:l0 level1 lfo3'><![if !supportLists]><span\r\nlang=ES style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;\r\nmso-no-proof:no'><span style='mso-list:Ignore'>b)<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman"'>El resultado de la prueba “Bad Cell”\r\n(Celda defectuosa) para el par de baterías medido, disponible en PHV, justifica\r\nla sustitución de ambas baterías bajo garantía</span><span lang=ES><br\r\nstyle='mso-special-character:line-break'>\r\n<![if !supportLineBreakNewLine]><br style='mso-special-character:line-break'>\r\n<![endif]></span><span lang=ES style='mso-fareast-font-family:"Times New Roman";\r\nmso-fareast-theme-font:minor-fareast;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoListParagraph style='margin-top:0in;margin-right:0in;margin-bottom:\r\n0in;margin-left:.25in;mso-add-space:auto;text-indent:-.25in;line-height:normal;\r\nmso-list:l2 level1 lfo2'><![if !supportLists]><span lang=ES style='font-family:\r\nSymbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-no-proof:\r\nno'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri'>Al usar la herramienta Midtronic</span><span\r\nlang=ES style='mso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:\r\nminor-fareast;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;text-indent:-.25in;line-height:normal;mso-list:l3 level1 lfo4'><![if !supportLists]><span\r\nlang=ES style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;\r\nmso-no-proof:no'><span style='mso-list:Ignore'>a)<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Arial'>Asegúrese de que el par de baterías está\r\nequilibrado. Si después de sustituir solo una batería debido a una ”Bad Cell”\r\n(Celda defectuosa) y al volver a probarlo se comprueba que las baterías no\r\nestán equilibradas, ambas baterías serán aceptadas por la garantía. </span><span\r\nlang=ES style='mso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:\r\nminor-fareast;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;text-indent:-.25in;line-height:normal;mso-list:l3 level1 lfo4'><![if !supportLists]><span\r\nlang=ES style='mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin;\r\nmso-no-proof:no'><span style='mso-list:Ignore'>b)<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman"'>Introduzca el resultado del código\r\nde prueba del comprobador de baterías, uno por batería, en la ficha de\r\nobservaciones</span><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri'>.</span><span lang=ES style='mso-no-proof:\r\nno'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;text-indent:-.25in;line-height:normal;mso-list:l3 level1 lfo4'><![if !supportLists]><span\r\nlang=ES style='font-family:"Arial",sans-serif;mso-fareast-font-family:Arial;\r\nmso-no-proof:no'><span style='mso-list:Ignore'>c)<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman"'>Imprima el formulario de resultados\r\ndel comprobador de baterías, uno por batería, y archívelo con la orden de\r\nreparación</span><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b\r\nstyle='mso-bidi-font-weight:normal'><span lang=EN-GB style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri;mso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></b></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b\r\nstyle='mso-bidi-font-weight:normal'><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri'>Consumo de aceite</span></b><b\r\nstyle='mso-bidi-font-weight:normal'><span lang=EN-GB style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri;mso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></b></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman"'>Para\r\nque se acepte la reclamación, deben cumplirse las condiciones siguientes:</span><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;mso-add-space:auto;text-indent:-.25in;line-height:normal;\r\nmso-list:l1 level1 lfo1'><![if !supportLists]><span lang=ES style='font-family:\r\n"Arial",sans-serif;mso-fareast-font-family:Arial;mso-no-proof:no'><span\r\nstyle='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman"'>El motor debe haber pasado el\r\nrodaje, es decir, debe haber alcanzado su primer intervalo de drenaje de aceite\r\nantes de iniciar el seguimiento.</span><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman";mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;mso-add-space:auto;text-indent:-.25in;line-height:normal;\r\nmso-list:l1 level1 lfo1'><![if !supportLists]><span lang=ES style='font-family:\r\n"Arial",sans-serif;mso-fareast-font-family:Arial;mso-no-proof:no'><span\r\nstyle='mso-list:Ignore'>2.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;\r\n</span></span></span><![endif]><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman"'>El conductor (o la persona\r\nresponsable) deberá anotar el consumo de aceite durante al menos un ciclo\r\ncompleto de cambio de aceite después del rodaje del motor. Deben rellenarse\r\natentamente todos los puntos del informe de consumo de aceite/combustible. </span><span\r\nlang=ES style='font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\nmso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.75in;mso-add-space:auto;line-height:normal'><span lang=ES\r\nstyle='font-size:8.5pt;font-family:"Verdana",sans-serif;mso-fareast-font-family:\r\n"Times New Roman";mso-bidi-font-family:Calibri;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0\r\n style='margin-left:-.25pt;border-collapse:collapse;border:none;mso-border-alt:\r\n solid windowtext .5pt;mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt'>\r\n <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:19.85pt'>\r\n  <td width=595 colspan=2 style='width:446.55pt;border:solid windowtext 1.0pt;\r\n  mso-border-alt:solid windowtext .5pt;background:#EEECE1;padding:0in 5.4pt 0in 5.4pt;\r\n  height:19.85pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman";color:black;mso-color-alt:windowtext'>Consumo de aceite en\r\n  proporción con el consumo de combustible</span><span lang=ES\r\n  style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman";mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:1;height:14.15pt'>\r\n  <td width=494 style='width:5.15in;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;margin-bottom:0in;margin-top:\r\n  0in;mso-margin-bottom-alt:12.75pt;mso-margin-top-alt:0in;mso-add-space:auto;\r\n  line-height:normal'><span lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;\r\n  mso-fareast-font-family:"Times New Roman"'>D11K, D13K, D16K</span><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman";mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=101 style='width:75.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\r\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>0,10&nbsp;%</span><span lang=ES style='font-size:9.0pt;\r\n  font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\n  mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:2;height:14.15pt'>\r\n  <td width=494 style='width:5.15in;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>D5K, D8K, D9A/B, D11 A/B/C, D12D/F, D13A/C/H, D13B (EGR),\r\n  D16C/E/G</span><span lang=PT-BR style='font-size:9.0pt;font-family:"Arial",sans-serif;\r\n  mso-fareast-font-family:"Times New Roman";mso-ansi-language:PT-BR;mso-no-proof:\r\n  no'><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=101 style='width:75.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\r\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>0,20&nbsp;%</span><span lang=ES style='font-size:9.0pt;\r\n  font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\n  mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:3;height:14.15pt'>\r\n  <td width=494 style='width:5.15in;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>D4, D6, D7, D10, D12A/B/C, DH12D, D16A/B</span><span\r\n  lang=PT-BR style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman";mso-ansi-language:PT-BR;mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=101 style='width:75.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\r\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>0,30 %</span><span lang=ES style='font-size:9.0pt;\r\n  font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\n  mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:4;height:14.15pt'>\r\n  <td width=494 style='width:5.15in;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>D7E/F</span><span lang=ES style='font-size:9.0pt;\r\n  font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\n  mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=101 style='width:75.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\r\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>0,30 %</span><span lang=ES style='font-size:9.0pt;\r\n  font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\n  mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:5;height:14.15pt'>\r\n  <td width=494 style='width:5.15in;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>VME</span><span lang=ES style='font-size:9.0pt;font-family:\r\n  "Arial",sans-serif;mso-fareast-font-family:"Times New Roman";mso-no-proof:\r\n  no'><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=101 style='width:75.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\r\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>0,20&nbsp;%</span><span lang=ES style='font-size:9.0pt;\r\n  font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\n  mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n <tr style='mso-yfti-irow:6;mso-yfti-lastrow:yes;height:14.15pt'>\r\n  <td width=494 style='width:5.15in;border:solid windowtext 1.0pt;border-top:\r\n  none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;\r\n  padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>Otros tipos de motores</span><span lang=ES\r\n  style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman";mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n  <td width=101 style='width:75.75pt;border-top:none;border-left:none;\r\n  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\r\n  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;\r\n  mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:14.15pt'>\r\n  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\n  lang=ES style='font-size:9.0pt;font-family:"Arial",sans-serif;mso-fareast-font-family:\r\n  "Times New Roman"'>0,50&nbsp;%</span><span lang=ES style='font-size:9.0pt;\r\n  font-family:"Arial",sans-serif;mso-fareast-font-family:"Times New Roman";\r\n  mso-no-proof:no'><o:p></o:p></span></p>\r\n  </td>\r\n </tr>\r\n</table>\r\n\r\n<p class=MsoNormal style='margin-top:0in;margin-right:0in;margin-bottom:0in;\r\nmargin-left:.25in;line-height:normal'><span lang=ES style='font-size:8.5pt;\r\nfont-family:"Verdana",sans-serif;mso-fareast-font-family:"Times New Roman";\r\nmso-bidi-font-family:Calibri;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Al\r\ntérmino del seguimiento, se calculará el consumo de aceite en proporción al\r\nconsumo de combustible de acuerdo con la fórmula del formulario de informe de\r\nconsumo de aceite y combustible.</span><span lang=EN-GB style='font-family:\r\n"Arial",sans-serif;mso-fareast-font-family:Calibri;mso-ansi-language:EN-GB;\r\nmso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Si el\r\nmotor es objeto de reparación, la referencia del pistón será la REFERENCIA\r\nCAUSANTE y en la información de la reclamación deberá consignarse el código de\r\nmotivo/defecto 25 (consumo elevado de aceite).</span><span lang=EN-GB\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Solamente\r\nlos casos de garantía documentados que superen los límites descritos anteriormente\r\npodrán reclamarse bajo los códigos de débito de la garantía 10, 16 o 18.</span><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Guarde\r\nsiempre el informe completo de consumo de combustible y aceite en una bolsa de\r\nplástico con el material sustituido.</span><span lang=EN-GB style='font-family:\r\n"Arial",sans-serif;mso-fareast-font-family:Calibri;mso-ansi-language:EN-GB;\r\nmso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Para los\r\nintervalos de cambio de aceite, consulte “Service and maintenance” (Servicio y\r\nmantenimiento), Preventive maintenance intervals (Intervalos de mantenimiento\r\npreventivo), en Impact.</span><span lang=EN-GB style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri;mso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Debe\r\nenviarse una copia de la reclamación y del formulario de consumo de\r\naceite/combustible al importador, que los comprobará y archivará. El importador\r\ndeberá guardar dicho informe durante al menos 12 meses.</span><span lang=EN-GB\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Nota: no\r\nse tendrán en consideración las reclamaciones que no estén respaldadas por el\r\ninforme de consumo de aceite y combustible.</span><span lang=EN-GB\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span\r\nlang=EN-GB style='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri;\r\nmso-ansi-language:EN-GB;mso-no-proof:no'><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span lang=ES\r\nstyle='font-family:"Arial",sans-serif;mso-fareast-font-family:Calibri'>Para\r\nobtener información sobre el seguimiento del consumo de aceite, consulte en\r\nImpact “Service tab” (Ficha Servicio), Forms (Formularios), grupo de funciones\r\n200, Oil and fuel consumption follow up (Seguimiento del consumo de aceite y\r\ncombustible).</span><span lang=EN-GB style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:Calibri;mso-ansi-language:EN-GB;mso-no-proof:no'><o:p></o:p></span></p>\r\n\r\n<p class=MsoNormal><span lang=ES><o:p>&nbsp;</o:p></span></p>\r\n\r\n<p class=MsoNormal><i><span lang=ES style='font-family:"Arial",sans-serif'>X<span\r\nstyle='mso-spacerun:yes'>    </span>Encabezado “Batería 12 V”: A partir del <b>1\r\nde mayo de 2022 </b>(Repair_Date) los resultados de la prueba de batería deben\r\nestar disponibles en PHV para reclamaciones relacionadas con vehículos FH, FM y\r\nFMX. </span></i><i><span lang=ES style='font-family:"Arial",sans-serif;\r\nmso-fareast-font-family:"Times New Roman";mso-no-proof:no'><o:p></o:p></span></i></p>\r\n\r\n\x3C!--EndFragment-->\r\n</body>\r\n\r\n</html>\r\n`;
        beforeAll(()=> {
            rteObj = renderRTE({
                pasteCleanupSettings: {
                    prompt: true,
                }
            }); 
        });
        it('CASE 1: Test for console error on paste action', (done: DoneFn) => {
            rteObj.dataBind();
            keyBoardEvent.clipboardData = {
                getData: () => {
                    return data;
                },
                items: []
            };
            setCursorPoint((rteObj as any).inputElement.firstElementChild, 0);
            rteObj.onPaste(keyBoardEvent);
            setTimeout(() => {
                expect(rteObj.element.querySelector('.e-dlg-header-content').textContent === 'Paste Format');
                done();
            }, 200);
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
            let trg = document.querySelector('[title="Number Format List (Ctrl+Shift+O)"]').childNodes[0].childNodes[0] as HTMLElement
            let event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            trg.dispatchEvent(event);
            (document.querySelector('[title="Number Format List (Ctrl+Shift+O)"]').childNodes[0] as HTMLElement).click();
            (document.querySelector('.e-dropdown-popup').childNodes[0].childNodes[1] as HTMLElement).click();
            let result = true;
            expect((editNode.querySelector('.first-p') as HTMLElement).innerHTML == `<li>description</li>`).toBe(true)
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('847101 - The image focus and resize class names are not removed when the editor in focused out. - ', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<p><img id="rteImageID" style="width: 300px; height: 300px;" alt="Logo" src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png"></p>'
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
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
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'Formats']
                },
            });
        });
        afterEach(() => {
            destroy(rteObj);
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
        it('CASE 2 - Check the toolbar values after selecting multiple font size in multiple line', () => {
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

    describe('EJ2-858344 - The pastecleanup is to remove spaces while pasting from the document', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                pasteCleanupSettings: {
                    keepFormat: true,
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should not remove the &nbsp and span element while pasting the content', (done: DoneFn) => { 
            editor.focusIn();
            const clipBoardData: string = '\n\n\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<meta name="ProgId" content="Word.Document">\n<meta name="Generator" content="Microsoft Word 15">\n<meta name="Originator" content="Microsoft Word 15">\n<link rel="File-List" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\n<link rel="Preview" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_preview.wmf">\n\x3C!--[if gte mso 9]><xml>\n <o:DocumentProperties>\n  <o:Version>16.00</o:Version>\n </o:DocumentProperties>\n</xml><![endif]-->\n<link rel="themeData" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\n<link rel="colorSchemeMapping" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\n\x3C!--[if gte mso 9]><xml>\n <w:WordDocument>\n  <w:View>Normal</w:View>\n  <w:Zoom>0</w:Zoom>\n  <w:TrackMoves/>\n  <w:TrackFormatting/>\n  <w:PunctuationKerning/>\n  <w:ValidateAgainstSchemas/>\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\n  <w:DoNotPromoteQF/>\n  <w:LidThemeOther>SV</w:LidThemeOther>\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\n  <w:Compatibility>\n   <w:BreakWrappedTables/>\n   <w:SnapToGridInCell/>\n   <w:WrapTextWithPunct/>\n   <w:UseAsianBreakRules/>\n   <w:DontGrowAutofit/>\n   <w:SplitPgBreakAndParaMark/>\n   <w:EnableOpenTypeKerning/>\n   <w:DontFlipMirrorIndents/>\n   <w:OverrideTableStyleHps/>\n  </w:Compatibility>\n  <m:mathPr>\n   <m:mathFont m:val="Cambria Math"/>\n   <m:brkBin m:val="before"/>\n   <m:brkBinSub m:val="&#45;-"/>\n   <m:smallFrac m:val="off"/>\n   <m:dispDef/>\n   <m:lMargin m:val="0"/>\n   <m:rMargin m:val="0"/>\n   <m:defJc m:val="centerGroup"/>\n   <m:wrapIndent m:val="1440"/>\n   <m:intLim m:val="subSup"/>\n   <m:naryLim m:val="undOvr"/>\n  </m:mathPr></w:WordDocument>\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\n  LatentStyleCount="376">\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 9"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 1"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 2"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 3"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 4"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 5"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 6"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 7"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 8"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="header"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footer"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index heading"/>\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of figures"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope return"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="line number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="page number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of authorities"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="macro"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="toa heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 5"/>\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Closing"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Signature"/>\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Message Header"/>\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Salutation"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Date"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Note Heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Block Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="FollowedHyperlink"/>\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Document Map"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Plain Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="E-mail Signature"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Top of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Bottom of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal (Web)"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Acronym"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Cite"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Code"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Definition"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Keyboard"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Preformatted"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Sample"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Typewriter"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Variable"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Table"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation subject"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="No List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Contemporary"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Elegant"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Professional"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Balloon Text"/>\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Theme"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\n   Name="List Paragraph"/>\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\n   Name="Intense Quote"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\n   Name="Subtle Emphasis"/>\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\n   Name="Intense Emphasis"/>\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\n   Name="Subtle Reference"/>\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\n   Name="Intense Reference"/>\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Bibliography"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hashtag"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Unresolved Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Link"/>\n </w:LatentStyles>\n</xml><![endif]-->\n<style>\n\x3C!--\n /* Font Definitions */\n @font-face\n\t{font-family:"Cambria Math";\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:roman;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-536869121 1107305727 33554432 0 415 0;}\n@font-face\n\t{font-family:Calibri;\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:swiss;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\n@font-face\n\t{font-family:"Nunito Sans";\n\tmso-font-charset:0;\n\tmso-generic-font-family:auto;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-1610611969 1342185547 0 0 407 0;}\n /* Style Definitions */\n p.MsoNormal, li.MsoNormal, div.MsoNormal\n\t{mso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-parent:"";\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:0in;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-ansi-language:SV;\n\tmso-fareast-language:SV;\n\tmso-bidi-language:SV;}\n.MsoChpDefault\n\t{mso-style-type:export-only;\n\tmso-default-props:yes;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-ansi-language:SV;\n\tmso-fareast-language:SV;\n\tmso-bidi-language:SV;}\n.MsoPapDefault\n\t{mso-style-type:export-only;\n\tmargin-bottom:8.0pt;\n\tline-height:107%;}\n@page WordSection1\n\t{size:8.5in 11.0in;\n\tmargin:1.0in 1.0in 1.0in 1.0in;\n\tmso-header-margin:.5in;\n\tmso-footer-margin:.5in;\n\tmso-paper-source:0;}\ndiv.WordSection1\n\t{page:WordSection1;}\n-->\n</style>\n\x3C!--[if gte mso 10]>\n<style>\n /* Style Definitions */\n table.MsoNormalTable\n\t{mso-style-name:"Table Normal";\n\tmso-tstyle-rowband-size:0;\n\tmso-tstyle-colband-size:0;\n\tmso-style-noshow:yes;\n\tmso-style-priority:99;\n\tmso-style-parent:"";\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\n\tmso-para-margin-top:0in;\n\tmso-para-margin-right:0in;\n\tmso-para-margin-bottom:8.0pt;\n\tmso-para-margin-left:0in;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;\n\tmso-ansi-language:SV;\n\tmso-fareast-language:SV;\n\tmso-bidi-language:SV;}\n</style>\n<![endif]-->\n\n\n\n\x3C!--StartFragment-->\n\n<p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><span lang="SV" style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;\ncolor:black">dokument.</span><span lang="DA" style="font-size:12.0pt;font-family:\n&quot;Nunito Sans&quot;;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:\n&quot;Times New Roman&quot;;color:black;mso-ansi-language:DA"><o:p></o:p></span></p>\n\n<p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><span lang="SV" style="font-size:12.0pt;font-family:&quot;Nunito Sans&quot;;mso-fareast-font-family:&quot;Times New Roman&quot;;\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:black">&nbsp;</span><span lang="DA" style="font-size:12.0pt;font-family:&quot;Nunito Sans&quot;;mso-fareast-font-family:&quot;Times New Roman&quot;;\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:black;mso-ansi-language:DA"><o:p></o:p></span></p>\n\n<p class="MsoNormal" style="margin-bottom:0in;line-height:normal"><b><span lang="SV" style="font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;\ncolor:black">HUR ASSISTANS SKA UTFÖRAS</span></b><span lang="DA" style="font-size:12.0pt;font-family:&quot;Nunito Sans&quot;;mso-fareast-font-family:&quot;Times New Roman&quot;;\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:black;mso-ansi-language:DA"><o:p></o:p></span></p>\n\n\x3C!--EndFragment-->\n\n\n\n';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                expect(editor.contentModule.getEditPanel().querySelectorAll('p')[1].childElementCount === 1).toBe(true);
                expect(editor.contentModule.getEditPanel().querySelectorAll('p')[1].firstElementChild.textContent.length).toBe(1); // &nbsp;
                done();
            }, 100);
        });
    });

    describe('EJ2-855260 - The font family is not applied properly when pasted from a Word document.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                pasteCleanupSettings: {
                    keepFormat: true,
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should have font family of Calibri set to the paragraph element', (done: DoneFn) => { 
            editor.focusIn();
            const clipBoardData: string = '\n\n\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<meta name="ProgId" content="Word.Document">\n<meta name="Generator" content="Microsoft Word 15">\n<meta name="Originator" content="Microsoft Word 15">\n<link rel="File-List" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\n<link rel="Preview" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_preview.wmf">\n\x3C!--[if gte mso 9]><xml>\n <o:DocumentProperties>\n  <o:Version>16.00</o:Version>\n </o:DocumentProperties>\n <o:OfficeDocumentSettings>\n  <o:AllowPNG/>\n </o:OfficeDocumentSettings>\n</xml><![endif]-->\n<link rel="themeData" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_themedata.thmx">\n<link rel="colorSchemeMapping" href="file:///C:/Users/GOKULR~1/AppData/Local/Temp/msohtmlclip1/01/clip_colorschememapping.xml">\n\x3C!--[if gte mso 9]><xml>\n <w:WordDocument>\n  <w:View>Normal</w:View>\n  <w:Zoom>0</w:Zoom>\n  <w:TrackMoves/>\n  <w:TrackFormatting/>\n  <w:PunctuationKerning/>\n  <w:ValidateAgainstSchemas/>\n  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\n  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\n  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\n  <w:DoNotPromoteQF/>\n  <w:LidThemeOther>EN-US</w:LidThemeOther>\n  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\n  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\n  <w:Compatibility>\n   <w:BreakWrappedTables/>\n   <w:SnapToGridInCell/>\n   <w:WrapTextWithPunct/>\n   <w:UseAsianBreakRules/>\n   <w:DontGrowAutofit/>\n   <w:SplitPgBreakAndParaMark/>\n   <w:EnableOpenTypeKerning/>\n   <w:DontFlipMirrorIndents/>\n   <w:OverrideTableStyleHps/>\n  </w:Compatibility>\n  <m:mathPr>\n   <m:mathFont m:val="Cambria Math"/>\n   <m:brkBin m:val="before"/>\n   <m:brkBinSub m:val="&#45;-"/>\n   <m:smallFrac m:val="off"/>\n   <m:dispDef/>\n   <m:lMargin m:val="0"/>\n   <m:rMargin m:val="0"/>\n   <m:defJc m:val="centerGroup"/>\n   <m:wrapIndent m:val="1440"/>\n   <m:intLim m:val="subSup"/>\n   <m:naryLim m:val="undOvr"/>\n  </m:mathPr></w:WordDocument>\n</xml><![endif]-->\x3C!--[if gte mso 9]><xml>\n <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\n  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\n  LatentStyleCount="376">\n  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\n  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\n  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index 9"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 1"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 2"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 3"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 4"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 5"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 6"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 7"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 8"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" Name="toc 9"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="header"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footer"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="index heading"/>\n  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of figures"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="envelope return"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="footnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="line number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="page number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote reference"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="endnote text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="table of authorities"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="macro"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="toa heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Bullet 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Number 5"/>\n  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Closing"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Signature"/>\n  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="List Continue 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Message Header"/>\n  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Salutation"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Date"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text First Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Note Heading"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Body Text Indent 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Block Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="FollowedHyperlink"/>\n  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\n  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Document Map"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Plain Text"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="E-mail Signature"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Top of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Bottom of Form"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal (Web)"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Acronym"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Address"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Cite"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Code"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Definition"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Keyboard"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Preformatted"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Sample"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Typewriter"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="HTML Variable"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Normal Table"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="annotation subject"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="No List"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Outline List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Simple 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Classic 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Colorful 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Columns 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Grid 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 4"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 5"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 7"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table List 8"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table 3D effects 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Contemporary"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Elegant"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Professional"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Subtle 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 2"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Web 3"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Balloon Text"/>\n  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Table Theme"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\n  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\n  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\n  <w:LsdException Locked="false" Priority="34" QFormat="true"\n   Name="List Paragraph"/>\n  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\n  <w:LsdException Locked="false" Priority="30" QFormat="true"\n   Name="Intense Quote"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\n  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\n  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\n  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\n  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\n  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\n  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\n  <w:LsdException Locked="false" Priority="19" QFormat="true"\n   Name="Subtle Emphasis"/>\n  <w:LsdException Locked="false" Priority="21" QFormat="true"\n   Name="Intense Emphasis"/>\n  <w:LsdException Locked="false" Priority="31" QFormat="true"\n   Name="Subtle Reference"/>\n  <w:LsdException Locked="false" Priority="32" QFormat="true"\n   Name="Intense Reference"/>\n  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\n  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\n   UnhideWhenUsed="true" Name="Bibliography"/>\n  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\n  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\n  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\n  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\n  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\n  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\n  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\n  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="Grid Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="Grid Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="Grid Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\n  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\n  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 1"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 1"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 2"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 2"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 3"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 3"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 4"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 4"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 5"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 5"/>\n  <w:LsdException Locked="false" Priority="46"\n   Name="List Table 1 Light Accent 6"/>\n  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\n  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\n  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\n  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\n  <w:LsdException Locked="false" Priority="51"\n   Name="List Table 6 Colorful Accent 6"/>\n  <w:LsdException Locked="false" Priority="52"\n   Name="List Table 7 Colorful Accent 6"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Hyperlink"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Hashtag"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Unresolved Mention"/>\n  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n   Name="Smart Link"/>\n </w:LatentStyles>\n</xml><![endif]-->\n<style>\n\x3C!--\n /* Font Definitions */\n @font-face\n\t{font-family:Wingdings;\n\tpanose-1:5 0 0 0 0 0 0 0 0 0;\n\tmso-font-charset:2;\n\tmso-generic-font-family:auto;\n\tmso-font-pitch:variable;\n\tmso-font-signature:0 268435456 0 0 -2147483648 0;}\n@font-face\n\t{font-family:"Cambria Math";\n\tpanose-1:2 4 5 3 5 4 6 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:roman;\n\tmso-font-pitch:variable;\n\tmso-font-signature:3 0 0 0 1 0;}\n@font-face\n\t{font-family:Calibri;\n\tpanose-1:2 15 5 2 2 2 4 3 2 4;\n\tmso-font-charset:0;\n\tmso-generic-font-family:swiss;\n\tmso-font-pitch:variable;\n\tmso-font-signature:-469750017 -1073732485 9 0 511 0;}\n /* Style Definitions */\n p.MsoNormal, li.MsoNormal, div.MsoNormal\n\t{mso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-parent:"";\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:0in;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\np\n\t{mso-style-priority:99;\n\tmso-margin-top-alt:auto;\n\tmargin-right:0in;\n\tmso-margin-bottom-alt:auto;\n\tmargin-left:0in;\n\tmso-pagination:widow-orphan;\n\tfont-size:12.0pt;\n\tfont-family:"Times New Roman",serif;\n\tmso-fareast-font-family:"Times New Roman";}\np.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\np.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-type:export-only;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:0in;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\np.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-type:export-only;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:0in;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\np.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast\n\t{mso-style-priority:34;\n\tmso-style-unhide:no;\n\tmso-style-qformat:yes;\n\tmso-style-type:export-only;\n\tmargin-top:0in;\n\tmargin-right:0in;\n\tmargin-bottom:8.0pt;\n\tmargin-left:.5in;\n\tmso-add-space:auto;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\n.MsoChpDefault\n\t{mso-style-type:export-only;\n\tmso-default-props:yes;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-fareast-font-family:Calibri;\n\tmso-fareast-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\n.MsoPapDefault\n\t{mso-style-type:export-only;\n\tmargin-bottom:8.0pt;\n\tline-height:107%;}\n@page WordSection1\n\t{size:8.5in 11.0in;\n\tmargin:1.0in 1.0in 1.0in 1.0in;\n\tmso-header-margin:.5in;\n\tmso-footer-margin:.5in;\n\tmso-paper-source:0;}\ndiv.WordSection1\n\t{page:WordSection1;}\n /* List Definitions */\n @list l0\n\t{mso-list-id:1316035350;\n\tmso-list-type:hybrid;\n\tmso-list-template-ids:1911435242 67698693 67698691 67698693 67698689 67698691 67698693 67698689 67698691 67698693;}\n@list l0:level1\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Wingdings;}\n@list l0:level2\n\t{mso-level-number-format:bullet;\n\tmso-level-text:o;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:"Courier New";}\n@list l0:level3\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Wingdings;}\n@list l0:level4\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Symbol;}\n@list l0:level5\n\t{mso-level-number-format:bullet;\n\tmso-level-text:o;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:"Courier New";}\n@list l0:level6\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Wingdings;}\n@list l0:level7\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Symbol;}\n@list l0:level8\n\t{mso-level-number-format:bullet;\n\tmso-level-text:o;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:"Courier New";}\n@list l0:level9\n\t{mso-level-number-format:bullet;\n\tmso-level-text:;\n\tmso-level-tab-stop:none;\n\tmso-level-number-position:left;\n\ttext-indent:-.25in;\n\tfont-family:Wingdings;}\nol\n\t{margin-bottom:0in;}\nul\n\t{margin-bottom:0in;}\n-->\n</style>\n\x3C!--[if gte mso 10]>\n<style>\n /* Style Definitions */\n table.MsoNormalTable\n\t{mso-style-name:"Table Normal";\n\tmso-tstyle-rowband-size:0;\n\tmso-tstyle-colband-size:0;\n\tmso-style-noshow:yes;\n\tmso-style-priority:99;\n\tmso-style-parent:"";\n\tmso-padding-alt:0in 5.4pt 0in 5.4pt;\n\tmso-para-margin-top:0in;\n\tmso-para-margin-right:0in;\n\tmso-para-margin-bottom:8.0pt;\n\tmso-para-margin-left:0in;\n\tline-height:107%;\n\tmso-pagination:widow-orphan;\n\tfont-size:11.0pt;\n\tfont-family:"Calibri",sans-serif;\n\tmso-ascii-font-family:Calibri;\n\tmso-ascii-theme-font:minor-latin;\n\tmso-hansi-font-family:Calibri;\n\tmso-hansi-theme-font:minor-latin;\n\tmso-bidi-font-family:"Times New Roman";\n\tmso-bidi-theme-font:minor-bidi;}\n</style>\n<![endif]-->\n\n\n\n\x3C!--StartFragment-->\n\n<p><a name="_Hlk148457735"><span style="font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;\nmso-ascii-theme-font:minor-latin;mso-hansi-theme-font:minor-latin;mso-bidi-theme-font:\nminor-latin;color:black">Please see below for our updated ESG Assessment Note\non ITX.&nbsp; <b>Post engagement, we upgraded our rating to ESG-Perform with\nStable Outlook</b> (previously ESG-Perform with Outlook).&nbsp; <o:p></o:p></span></a></p>\n\n<p><span style="mso-bookmark:_Hlk148457735"><span style="font-size:11.0pt;\nfont-family:&quot;Calibri&quot;,sans-serif;mso-ascii-theme-font:minor-latin;mso-hansi-theme-font:\nminor-latin;mso-bidi-theme-font:minor-latin;color:black">The upgrade is a\nresult of a <b>change in the S assessment to Stable</b> (previously Neutral\nDeteriorating).<o:p></o:p></span></span></p>\n\n<p class="MsoNormal"><span style="mso-bookmark:_Hlk148457735"><u><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">Sector ESG\nKey Issue Exposure</span></u></span><span style="mso-bookmark:_Hlk148457735"><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">: Labor\nconditions in the supply chain; Raw materials sourcing; Product quality &amp;\nsafety (chemicals management); Environmental impacts in the supply chain.<o:p></o:p></span></span></p>\n\n<p class="MsoNormal"><span style="mso-bookmark:_Hlk148457735"><u><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">Jennison\nESG Assessment</span></u></span><span style="mso-bookmark:_Hlk148457735"><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"> – <b style="mso-bidi-font-weight:normal">We rate ITX as ESG-Perform with Stable\nOutlook</b>. ITX’s E performance is solid and exemplified through its raw\nmaterials sourcing practices and supplier management<b>. </b><o:p></o:p></span></span></p>\n\n<p class="MsoNormal"><span style="mso-bookmark:_Hlk148457735"><u><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">Environmental\n(20%)</span></u></span><span style="mso-bookmark:_Hlk148457735"><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">: ITX has\na 2040 net zero target, with an interim 2030 target to reduce emissions by over\n50% (2018 baseline).<span style="mso-spacerun:yes">&nbsp; </span>The company’s <b>clear\nfocus on creating products with improved E profiles</b> is evident through its <b>various\nraw material targets</b>:<o:p></o:p></span></span></p>\n\n<p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><span style="mso-bookmark:_Hlk148457735">\x3C!--[if !supportLists]--><span style="font-family:\nWingdings;mso-fareast-font-family:Wingdings;mso-bidi-font-family:Wingdings"><span style="mso-list:Ignore">§<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp; </span></span></span>\x3C!--[endif]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">2023\ngoals:<o:p></o:p></span></span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="margin-left:1.0in;mso-add-space:\nauto;text-indent:-.25in;mso-list:l0 level2 lfo1"><span style="mso-bookmark:\n_Hlk148457735">\x3C!--[if !supportLists]--><span style="font-family:&quot;Courier New&quot;;\nmso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">100%\norganic cotton, recycled cotton or Better Cotton (92% in 2022)<o:p></o:p></span></span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="margin-left:1.0in;mso-add-space:\nauto;text-indent:-.25in;mso-list:l0 level2 lfo1"><span style="mso-bookmark:\n_Hlk148457735">\x3C!--[if !supportLists]--><span style="font-family:&quot;Courier New&quot;;\nmso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">100%\nsustainable man-made cellulosic preferent fibers (96% in 2022)<o:p></o:p></span></span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><span style="mso-bookmark:_Hlk148457735">\x3C!--[if !supportLists]--><span style="font-family:\nWingdings;mso-fareast-font-family:Wingdings;mso-bidi-font-family:Wingdings"><span style="mso-list:Ignore">§<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp; </span></span></span>\x3C!--[endif]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">2025\ngoals:<o:p></o:p></span></span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="margin-left:1.0in;mso-add-space:\nauto;text-indent:-.25in;mso-list:l0 level2 lfo1"><span style="mso-bookmark:\n_Hlk148457735">\x3C!--[if !supportLists]--><span style="font-family:&quot;Courier New&quot;;\nmso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp; </span></span></span>\x3C!--[endif]--><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">100% linen\nand polyester from preferent sources (74% linen, 31% polyester in 2022)<o:p></o:p></span></span></p>\n\n<p class="MsoListParagraphCxSpLast" style="margin-left:1.0in;mso-add-space:auto;\ntext-indent:-.25in;mso-list:l0 level2 lfo1"><span style="mso-bookmark:_Hlk148457735">\x3C!--[if !supportLists]--><span style="font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;\n</span></span></span>\x3C!--[endif]--><span style="mso-bidi-font-family:Calibri;\nmso-bidi-theme-font:minor-latin">25% reduction of water consumption in supply\nchain<o:p></o:p></span></span></p>\n\n<p class="MsoNormal"><span style="mso-bookmark:_Hlk148457735"><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin">Cotton is\na key input, accounting for over 40% of total raw materials.<span style="mso-spacerun:yes">&nbsp; </span><o:p></o:p></span></span></p>\n\n<span style="mso-bookmark:_Hlk148457735"></span>\n\n<p class="MsoNormal"><i style="mso-bidi-font-style:normal"><span style="mso-bidi-font-family:Calibri;mso-bidi-theme-font:minor-latin"><o:p>&nbsp;</o:p></span></i></p>\n\n\x3C!--EndFragment-->\n\n\n\n';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                expect((editor.contentModule.getEditPanel().querySelectorAll('ul p')[0] as HTMLElement).style.fontFamily).toEqual('Calibri, sans-serif');
                done();
            }, 100);
        });
    });

    describe('EJ2-847108 - When pasting contents into the RichTextEditor, the focus gets lost and script error thrown', () => {
        let rteObject : RichTextEditor ;
        let innerHTML: string = `<html>\r\n<body>\r\n\x3C!--StartFragment--><table class="table-container" style="box-sizing: border-box; border-collapse: collapse; overflow-y: hidden; table-layout: fixed; width: 998.4px; border-bottom: 0px !important; border-right: 0px !important; border-top: 0px !important; color: rgb(0, 0, 0); font-family: Roboto, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><tbody style="box-sizing: border-box;"><tr class="public-comment-border" style="box-sizing: border-box; border-radius: 0px; border-left: 4px solid rgb(203, 210, 224) !important;"><td class="width-2 flex-horizontal bd-table-td py-1" style="box-sizing: border-box; padding: 0px 0px 0px 36px; align-items: center; display: flex; flex-direction: row; border: 0px; height: auto; width: 947.4px; color: rgb(45, 55, 72) !important;"><div class="user-detail-container flex-vertical" style="box-sizing: border-box; display: flex; flex-direction: column; width: 656.2px;"><div class="app-user-name primary flex-horizontal" style="box-sizing: border-box; color: var(--primary-color); font-family: var(--font-style) !important; align-items: center; display: flex; flex-direction: row; font-weight: 400; overflow-wrap: anywhere;"><div class="ellipsis no-wrap font-14 font-500 user-preview-section" style="box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; font-size: 14px !important; max-width: 40%;"><span data-title="Divya Ananthanathan" style="box-sizing: border-box;">Divya Ananthanathan</span></div><div class="ellipsis no-wrap" style="box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span class="secondary-text-color font-13 pl-1 user-detail-container-label" data-title="<span>replied via Customer Portal</span>" style="box-sizing: border-box; padding-left: 0.25rem !important; font-size: 13px !important; color: rgb(96, 111, 133); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="replied-text" style="box-sizing: border-box; color: rgb(96, 111, 133);">replied<span> </span></span>via Customer Portal</span></div></div><div class="date-detail secondary-text-color font-13 ellipsis no-wrap" style="box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px !important; color: rgb(96, 111, 133); width: auto;"><span style="box-sizing: border-box;"><app-date-time suffixstring=")" _nghost-mil-c21="" style="box-sizing: border-box;"><span _ngcontent-mil-c21="" data-non-elliptical="true" data-title="Created on : Sep 07, 2023 05:26 PM (UTC +05:30)" style="box-sizing: border-box;">Sep 07, 2023 05:26 PM ( 3 weeks ago )</span></app-date-time></span></div></div><div id="comments-options" class="align-right flex-horizontal" style="box-sizing: border-box; align-items: center; display: flex; flex-direction: row; float: right; margin-left: auto;"><span class="parma-link mt-1" style="box-sizing: border-box; margin-top: 0.25rem !important;"><i class="bd-icon bd-icon-link action-square-button cursor-pointer padding-8" data-title="Copy Link" style="box-sizing: border-box; cursor: pointer; padding: 6px; align-items: center; color: rgb(74, 85, 104); font-size: 16px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 1; speak: none; text-transform: none; font-family: &quot;Bold desk&quot; !important; list-style-type: none; border-radius: 20px;"></i></span><span class="parma-link flex-horizontal" style="box-sizing: border-box; align-items: center; display: flex; flex-direction: row;"><span style="box-sizing: border-box;"><span class="e-btn e-flat icon-design e-icon-btn more-option-button no-padding no-border" style="box-sizing: border-box; -webkit-font-smoothing: antialiased; border: 1px solid rgb(160, 174, 192); border-radius: 50%; cursor: pointer; display: inline-block; font-family: Roboto, &quot;open sans&quot;, sans-serif, -apple-system, BlinkMacSystemFont; font-size: 14px; font-weight: 500; justify-content: center; line-height: 34px; outline: 0px; padding: 0px 11px; text-align: center; text-decoration: none; text-transform: none; user-select: none; vertical-align: middle; white-space: nowrap; -webkit-tap-highlight-color: transparent; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: inherit; box-shadow: none; color: rgb(45, 55, 72); transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0s; letter-spacing: 0.3px; height: 32px; width: 32px;"><i class="hd-icon hd-vertical-menu" style="box-sizing: border-box; align-items: center; color: rgba(0, 0, 0, 0.54); font-size: 13px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 1; padding: 5px; speak: none; text-transform: none; font-family: hd-icon !important;"></i></span></span></span></div></td></tr><tr class="public-comment-border" style="box-sizing: border-box; border-radius: 0px; border-left: 4px solid rgb(203, 210, 224) !important;"><td class="width-1 bd-table-td align-baseline" style="box-sizing: border-box; vertical-align: baseline !important; width: 45px; border: 0px; height: auto; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 24px !important;"><span style="box-sizing: border-box;"></span></td><td class="width-2 bd-table-td" style="box-sizing: border-box; border: 0px; height: auto; padding: 0px 0px 0px 36px; width: 949.4px; color: rgb(45, 55, 72) !important;"><div appimageloader="" appimagepreview="" class="detail-summary" style="box-sizing: border-box; padding-top: 10px; padding-right: 10px; padding-bottom: 0px !important; padding-left: 0px; overflow-x: auto;"><div class="table-content" style="box-sizing: border-box; padding-top: 10px;"><div class="comments-description show-more-description primary font-14 e-rte-content" style="box-sizing: border-box; color: var(--primary-color); font-family: var(--font-style) !important; font-size: 14px !important; font-weight: 400;"><p class="show-more-description-child-element" style="box-sizing: border-box; margin: 0px 0px 10px; color: rgb(45, 55, 72); position: relative;"><p style="box-sizing: border-box; margin: 0px 0px 10px;">Hi Team, <br style="box-sizing: border-box;"><br style="box-sizing: border-box;">We are facing an issue while pasting elements into RTE. We have attached a sample and video for your reference.</p></p></div></div></div></td></tr></tbody></table>\x3C!--EndFragment-->\r\n</body>\r\n</html>`;
        beforeEach( () => {
            rteObject = renderRTE({
                pasteCleanupSettings: {
                    prompt: true
                }, value: ''
            });
        });
        afterEach( () => {
            destroy(rteObject);
        });
        it('Test for pasteCleanup', (done : Function) => {
            let keyBoardEvent: any = {
                preventDefault: () => { },
                type: 'keydown',
                stopPropagation: () => { },
                ctrlKey: false,
                shiftKey: false,
                action: null,
                which: 64,
                key: ''
              };
            rteObject.dataBind();
            keyBoardEvent.clipboardData = {
            getData: () => {
                return innerHTML;
            },
            items: []
            };
            setCursorPoint((rteObject as any).inputElement.firstElementChild, 0);
            rteObject.onPaste(keyBoardEvent);
            setTimeout(() => {
                if (rteObject.pasteCleanupSettings.prompt) {
                    let keepFormat: any = document.getElementById(rteObject.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-keepformat');
                    keepFormat[0].click();
                    let pasteOK: any = document.getElementById(rteObject.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-pasteok');
                    pasteOK[0].click();
                }
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'BR').toEqual(true);
                expect(window.getSelection().getRangeAt(0).endContainer.nodeName === 'BR').toEqual(true);
                done();
            }, 400);
        });
    });
    
    describe('847097 - Image get duplicated when we press enter key next to the copy pasted image content from Word', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 13, which: 13, shiftKey: false, code : 'Enter'
        };
        it('Image gets duplicate paste from ms word ', () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Formats']
                },
                value: '<p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><span lang="EN-IN" style="font-size:16.0pt;line-height:107%;">Quote 1 -</span></b></p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span id="msWordImg-clip_image001"><img width="624" height="196" src="blob:http://127.0.0.1:5500/a11f1f65-5f82-4231-bac2-2370d08635d0" v:shapes="Picture_x0020_1" id="msWordImg-clip_image002" class="e-rte-image e-imginline" style="opacity: 1;"></span></p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><b><span lang="EN-IN" style="font-size:18.0pt;line-height:107%;">Explore 1 -</span></b></p><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;"><span><img width="624" height="163" src="blob:http://127.0.0.1:5500/fd4c90de-5cb5-4ef0-89ba-2105a769bfb5" v:shapes="Picture_x0020_2" id="msWordImg-clip_image004" class="e-rte-image e-imginline" style="opacity: 1;"> </span></p>'
            });
            rteEle = rteObj.element;
            let start: HTMLElement = document.getElementById('msWordImg-clip_image001');;
            setCursorPoint(start, 1);
            (rteObj as any).keyDown(keyboardEventArgs);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('p').length === 5).toBe(true);
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('853088 - Script error throws when clicking preview toolbar while using itemConfigs with ToolbarSettings in RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        it('click the preview toolbar while using itemConfigs with ToolbarSettings ', () => {
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
            rteEle = rteObj.element;
            let previewEle: HTMLElement = document.querySelector('[title= "Code View (Ctrl+Shift+H)"]');
            previewEle.click();
            expect(rteObj.value === '<p><b>Description:</b></p>').toBe(true); 
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });
    describe('853677 - The image alternate text is not shown properly in the Rich Text Editor.', () => {
        let rteObj: RichTextEditor;
        it('ensure insert image on Alternate text', () => {
            rteObj = renderRTE({
                height: '200px',
                width: '400px'
            });
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
        afterEach(() => {
            destroy(rteObj);
        });
    });
    describe('852541 -ToolbarClick event should trigger before the opening of emoji picker popup in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let toolbarClick: any;
        beforeEach((done: Function) => {
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
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
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
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: ''
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Not able to insert the SVG or Canvas elements', () => {
            rteObj.executeCommand('insertHTML', `<div>
            <p>test</p>
            <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>
              <circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' />
            </svg>
          </div><p>text</p>`);
          expect(rteObj.contentModule.getEditPanel().innerHTML === '<div>\n            <p>test</p>\n            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n              <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow"></circle>\n            </svg>\n          </div><p>text</p>').toBe(true);
        });
    });
    describe('854718 - Need to add the aria label attribute to the link in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '' });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
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
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<p><span style="color: rgb(0, 0, 0); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Copy the text from this</span><span style="color: rgb(0, 0, 0); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);">&nbsp;</span><a href="https://support.syncfusion.com/kb/article/7218/download-excel-from-ajax-call-in-asp-net-mvc?isInternalRefresh=False" style="text-decoration: underline; color: var(--communication-foreground,rgba(0, 90, 158, 1)); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); cursor: pointer;">link</a><span style="color: rgb(0, 0, 0); font-family: &quot;Segoe UI VSS (Regular)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">, which has a link and an underline.</span></p>'
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
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
        beforeEach(() => {
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
        afterEach(() => {
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
        it('table creation of row more than 50 ', () => {
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
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 51).toBe(true);
        });
    });
    describe("855947 - Table creation popup doesn't get closed when clicking Esc key in RichTextEditor", () => {
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            key: "Escape",
            charCode: 0,
            keyCode: 27,
            which: 27,
            code: "Escape",
        };
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="MsoNormal"><b><span lang="EN-IN"><a href="https://en.wikipedia.org/wiki/Forest_ecology"><i><span class="targetSpan"style="font-size: 10.5pt; line-height: 107%; font-family: Arial, sans-serif; color: rgb(51, 102, 204); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Forest ecology</span></i></a><o:p></o:p></span></b></p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>  `;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the create table popup open', () => {
            (document.querySelector('[title="Create Table (Ctrl+Shift+E)"]') as HTMLElement).click();
            let target =  document.querySelector('.e-content');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("keyup", false, true);
            clickEvent.key = "escape";
            target.dispatchEvent(clickEvent);
            expect(document.querySelectorAll('.e-rte-table-popup').length == 0).toBe(true);
        });
    });
    describe("857980 - The rich text editor content is removed when the enter key is in BR mode ", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                enterKey: 'BR',
                value:`Hello Andrew,<br><br><p class="currentStartMark">Test.<br><br><br><br>test<br><br>dumy</p><span></span>Regards<br>Andrew`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it("enter key br mode", () => {
            rteObj.focusIn();
            rteObj.focusIn();
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.querySelector('.currentStartMark').childNodes[5] as Element, 0);
            (rteObj as any).keyDown({ keyCode: 13, which: 13, shiftkey: false, key: 'Enter',code: 'Enter', preventDefault: function () { } });
            expect(rteObj.inputElement.querySelector('.currentStartMark').childNodes.length === 11).toBe(true);
        });
    });
    describe('854667 - The table styles are not preselected in the quick toolbar in the Rich Text Editor.', function () {
        let rteObj : RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        let div: HTMLElement;
        beforeEach(function () {
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
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Dashed borders', function (done) {
            rteObj.focusIn()
            var tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            setCursorPoint(tbElement, 0);
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
            setTimeout(function () {
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                (document.querySelector(".e-dropdown-popup .e-item.e-dashed-borders") as any).click();
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                expect(document.querySelector(".e-dropdown-popup .e-item.e-dashed-borders").classList.contains('e-active')).toBe(true);
                detach(div);
                done();
            },0);
        });
        it('Alternate rows', function (done) {
            rteObj.focusIn()
            var tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            setCursorPoint(tbElement, 0);
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
            setTimeout(function () {
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                (document.querySelector(".e-dropdown-popup .e-item.e-alternate-rows") as any).click();
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                expect(document.querySelector(".e-dropdown-popup .e-item.e-alternate-rows").classList.contains('e-active')).toBe(true);
                detach(div);
                done();
            },0);
        });
        it('Alignments', function (done) {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments');
            dispatchEve(item, 'mousedown');
            dispatchEve(item, 'mouseup');
            item.click();
            setTimeout(() => {
                let items: any = document.querySelectorAll('#' + controlId + '_toolbar_Alignments-popup .e-item');
                expect(items[0].classList.contains('e-active')).toBe(true);
                done();
            }, 200)
        });
    });
    describe('854667 - The table styles are not preselected in the quick toolbar in the Rich Text Editor. for image', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IRenderer;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false },
                value: `<p>rte sample</p>`
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
            curDocument = rteObj.contentModule.getDocument();
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('edit image', (done) => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
            dispatchEvent((rteObj.element.querySelector('.e-rte-image') as HTMLElement), 'mouseup');
            setTimeout(() => {
                let nodObj: NodeSelection = new NodeSelection();
                var range = nodObj.getRange(document);
                var save = nodObj.save(range, document);
                let target = rteObj.element.querySelector('.e-rte-image') as HTMLElement;
                (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
                var args = {
                    item: { url: 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png', selection: save, selectParent: [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)] },
                    preventDefault: function () { }
                };
                (<any>rteObj).formatter.editorManager.imgObj.createImage(args);
                (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
                (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
                dispatchEvent((rteObj.element.querySelector('.e-rte-image') as HTMLElement), 'mouseup');
                setTimeout(() => {
                    (<any>QTBarModule).renderQuickToolbars();
                    QTBarModule.imageQTBar.showPopup(10, 131, (rteObj.element.querySelector('.e-rte-image') as HTMLElement));
                    let imgPop: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                    let imgTBItems: NodeList = imgPop.querySelectorAll('.e-toolbar-item');
                    let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                    let mouseEventArgs = {
                        item: { command: 'Images', subCommand: 'JustifyLeft' }
                    };
                    let img: HTMLElement = rteObj.element.querySelector('.e-rte-image') as HTMLElement;
                    ((<HTMLElement>imgTBItems.item(9)).firstElementChild as HTMLElement).click();
                    popupElement = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[1];
                    mouseEventArgs.item.subCommand = 'Inline';
                    (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
                    QTBarModule.imageQTBar.hidePopup();
                    QTBarModule.imageQTBar.showPopup(10, 131, (rteObj.element.querySelector('.e-rte-image') as HTMLElement));
                    ((<HTMLElement>imgTBItems.item(9)).firstElementChild as HTMLElement).click();
                    expect(img.classList.contains('e-imginline')).toBe(true);
                    expect(document.querySelector('.e-inline').classList.contains('e-active')).toBe(true);
                    mouseEventArgs.item.subCommand = 'Break';
                    (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
                    expect(img.classList.contains('e-imgbreak')).toBe(true);
                    QTBarModule.imageQTBar.hidePopup();
                    QTBarModule.imageQTBar.showPopup(10, 131, (rteObj.element.querySelector('.e-rte-image') as HTMLElement));
                    ((<HTMLElement>imgTBItems.item(9)).firstElementChild as HTMLElement).click();
                    expect(document.querySelector('.e-break').classList.contains('e-active')).toBe(true);
                    done();
                }, 40);
            }, 40);
        });
    });
    describe('857054 - MaxLength property is not working properly in RichTextEditor, when pasting contents into the Editor', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = {
            preventDefault: () => { },
            type: "keydown",
            stopPropagation: () => { },
            ctrlKey: false,
            shiftKey: false,
            action: null,
            which: 64,
            key: ""
        };
        const targetElm: HTMLElement = createElement('div', { className: 'target' });
        beforeEach(() => {
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['Formats'],
                }, value: '',
                inlineMode: {
                    enable: true,
                    onSelection: true,
                },
                maxLength: 1000,
                showCharCount: true,
            });
            document.body.appendChild(targetElm);
            rteObj.appendTo(targetElm);
        });
        afterEach(() => {
            rteObj.destroy();
            detach(targetElm);
        })
        it("The MaxLength property doesn't count the character correctly.", (done: Function) => {
            rteObj.focusIn();
            keyBoardEvent.clipboardData = {
                getData: (e: any) => {
                    if (e === "text/plain") {
                        return `This is the one note test description gikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn,\r\n\r\nThisis the one note test descriptiongikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn\r\n\r\nThisis the one note test descriptiongikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn\r\n\r\n \r\n\r\nThis is the one note test description gikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn,\r\n\r\nThisis the one note test descriptiongikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn\r\n\r\nThisis the one note test descriptiongikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn\r\n\r\n \r\n\r\nThis is the one note test description gikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn,\r\n\r\nThisis the one note test descriptiongikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn\r\n\r\nThisis the one note test descriptiongikhdkkaegdhyfgfkahlakhoalhkwjadea,adtgfiakhleduhieygeuqgdiekdheqodn\r\n\r\nrfuwyeouwehrfyiwhowrufiwufwoiyrfgiwr`;
                    } else {
                        return '';
                    }
                },
                items: []
            }
            rteObj.onPaste(keyBoardEvent);
            expect(rteObj.maxLength >= rteObj.getCharCount()).toBe(true);
            done();
        });
    });
    describe('859382 - ImageRemoving event arguments are not properly passed in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        let propertyCheck: boolean;
        beforeEach((done: Function) => {
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
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
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
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic','FontName']
                },
                value: `<ol><li>normal</li><li>list</li><li>normal</li><li>list</li></ol>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('check Bold', () => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelectorAll('li')[0].firstChild, rteObj.element.querySelectorAll('li')[3].firstChild, 3, 3);
            (rteObj.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click();
            expect(rteEle.querySelectorAll('li')[1].style.fontWeight === "bold").toBe(true);
        });
        it('check Italic', () => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelectorAll('li')[0].firstChild, rteObj.element.querySelectorAll('li')[3].firstChild, 3, 3);
            (rteObj.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement).click();
            expect(rteEle.querySelectorAll('li')[1].style.fontStyle === "italic").toBe(true);
        });
        it('check fontname', () => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelectorAll('li')[0].firstChild, rteObj.element.querySelectorAll('li')[3].firstChild, 3, 3);
            let node: HTMLElement = (rteObj.element.querySelectorAll('.e-toolbar-item')[2] as HTMLElement);
            (node.firstChild  as HTMLElement).click();
            (document.querySelectorAll('.e-dropdown-popup.e-rte-elements li')[3] as HTMLElement).click();
            expect((document.querySelectorAll('.e-content li')[2] as HTMLElement).style.fontFamily === 'Impact, Charcoal, sans-serif').toBe(true);
        });
    });
    describe("863459 - Applying different text styles format out of focus Leads to Issues in RichTextEditor.", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let toolbarEle: HTMLElement;
        beforeEach(() => {
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
        afterEach(() => {
            destroy(rteObj);
            detach(toolbarEle);
        });
        it("Focus leads to a console error in the Rich Text Editor.", () => {
            (document.querySelector(".e-rte-test-elements div") as any).click();
            (rteObj.element.querySelectorAll(".e-rte-toolbar .e-toolbar-item button")[0] as any).click();
            (document.querySelector(".e-rte-test-elements div") as any).click();
            (rteObj.element.querySelectorAll(".e-rte-toolbar .e-toolbar-item button")[1] as any).click();
            expect(rteObj.inputElement.innerHTML == '<p><strong>​<em>​</em></strong>Rich Text Editor</p>').toBe(true);
        });
    });
    describe("863440: Too many times applying bold to a text, sometimes the text got deleted in RichTextEditor.", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let domSelection: NodeSelection = new NodeSelection();
        let parentDiv: HTMLDivElement;
        beforeEach(() => {
            rteObj = renderRTE({
                enterKey: 'BR',
                value:`<div id="div1"><p id="paragraph1">second rtec</p></div>`
            });
            rteEle = rteObj.element;
            parentDiv = document.getElementById('div1') as HTMLDivElement;
        });
        afterEach(() => {
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
        beforeEach(() => {
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
        afterEach((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe('866230 - Script error throws when using click event with custom toolbar template in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
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
        afterEach((done) => {
            destroy(rteObj);
            done();
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
            expect(rteObj2.inputElement.innerHTML === '<p><strong></strong>second RTEC</p>').toBe(true);
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
    describe('870038 - Pasted image tag added inside the link tag in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><a class="e-rte-anchor" href="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" title="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" target="_blank" aria-label="Open in new window">link</a></p>`
            });
        });

        it('image after the link', () => {
            rteObj.executeCommand('insertImage', { url: 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png', cssClass: 'rte-img'});
            expect(rteObj.inputElement.innerHTML).toBe('<p><a class="e-rte-anchor" href="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" title="https://www.grouptechedge.com/Reminders/TechEdgeServiceMaintenanceWindow521.ics" target="_blank" aria-label="Open in new window">link</a><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image rte-img" width="auto" height="auto" style="min-width: 0px; min-height: 0px;"> </p>');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('870180: Copy pasted text to override an existing text pastes at wrong position in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span style="color: rgb(22, 22, 22); font-family: &quot;Segoe UI&quot;, SegoeUI, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">Executes Data Analysis Expressions (DAX) queries against the provided dataset. The dataset must reside in<span>&nbsp;</span></span><strong style=" font-weight: 600; color: rgb(22, 22, 22); font-family: &quot;Segoe UI&quot;, SegoeUI, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; font-style: normal; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);">My workspace</strong><span style="color: rgb(22, 22, 22); font-family: &quot;Segoe UI&quot;, SegoeUI, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><span>&nbsp;</span>or another workspace.</span></p><p style=" margin: 1rem 0px 0px; padding: 0px; color: rgb(22, 22, 22); font-family: &quot;Segoe UI&quot;, SegoeUI, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);">DAX query errors will result in:</p><ul style=" margin: 16px 0px 16px 38px; padding: 0px; list-style: none; color: rgb(22, 22, 22); font-family: &quot;Segoe UI&quot;, SegoeUI, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; white-space: normal; background-color: rgb(255, 255, 255);"><li style=" margin: 0px; padding: 0px; list-style: none;">A response error, such as<span>&nbsp;</span><code style=" font-family: SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace; font-size: 13.6px; direction: ltr; background-color: var(--theme-inline-code); border-radius: 3px; padding: 0.1em 0.2em;">DAX query failure</code>.</li><li style=" margin: 0px; padding: 0px; list-style: none;">A failure HTTP status code (400).</li></ul><p><br></p>`,
                pasteCleanupSettings: {
                    keepFormat: true,
                }
            });
        });

        it('copy and paste text', () => {
            rteObj.focusIn();
            const clipBoardData: string = `<html>\r\n<body>\r\n\x3C!--StartFragment--><span style="color: rgb(22, 22, 22); font-family: &quot;Segoe UI&quot;, SegoeUI, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">A query that requests more than one table, or more than the allowed number of table rows, will result in:</span>\x3C!--EndFragment-->\r\n</body>\r\n</html>`;
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.firstChild, rteObj.inputElement.firstChild, 0, 3);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            expect((rteObj.inputElement.firstChild as HTMLElement).innerText === 'A query that requests more than one table, or more than the allowed number of table rows, will result in:').toBe(true);
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
        it('Checking the backspace on list', (done: Function) => {
            rteObj = renderRTE({
                value: '<ol><li id="firstli">list1</li><li>list2</li><li>list3</li><li id="lastli">list4</li></ol>',
            });
            let startNode: any = (rteObj as any).inputElement.querySelector('#firstli');
            let endNode: any = (rteObj as any).inputElement.querySelector('#lastli');
            let sel = new NodeSelection().setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 5);
            (rteObj as any).mouseUp({ target: rteObj.inputElement, isTrusted: true });
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((rteObj as any).inputElement.querySelectorAll('ol').length).toBe(0);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});
