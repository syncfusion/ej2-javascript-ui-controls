/**
 * Toolbar renderer spec
 */
import { Browser, isNullOrUndefined, closest, detach, createElement } from '@syncfusion/ej2-base';
import { renderRTE,dispatchEvent, destroy } from './../render.spec';
import { NodeSelection } from './../../../src/selection/index';
import { BaseQuickToolbar, RichTextEditor } from "../../../src";
import { ToolbarType } from "../../../src/common/enum";
import { BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, SHIFT_ARROW_DOWN_EVENT_INIT } from "../../constant.spec";
import { CLS_RTE_RES_HANDLE } from "../../../src/rich-text-editor/base/classes";
import { ImageCommand } from '../../../src/editor-manager/plugin/image';

describe('Toolbar - Renderer', () => {

    describe('div content ', () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Formats', 'Alignments']
                },
                value: "<h1>Rich Text Editor</h1>"
            });
            rteEle = rteObj.element;
        });

        it(' Open the DropDownButton with modal', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            expect(document.querySelectorAll('.e-item.e-active').length == 1).toBe(true);
            expect(document.querySelector(".e-popup-overlay")).toBe(null);
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });

    describe('Iframe content ', () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Formats', 'Alignments']
                }
            });
            rteEle = rteObj.element;
        });

        it(' Open the DropDownButton with modal', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            expect(document.querySelector(".e-popup-overlay")).toBe(null);
            rteObj.enabled = false;
            (trgEle.firstElementChild as HTMLElement).click();
            rteObj.enabled = true;
        });

        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });
    describe('Open dropdown button two times', function () {
        let rteObj : any;
        let rteEle : any;
        let mobileUA = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA = navigator.userAgent;
        beforeAll(function () {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Formats', 'FontColor']
                }
            });
            rteEle = rteObj.element;
        });
        it('Open fontColor dropdown button', function () {
            let trgEle : HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.querySelector('.e-dropdown-btn') as HTMLElement).click();
            dispatchEvent(trgEle.querySelector('.e-dropdown-btn'), 'mousedown');
            (document.querySelectorAll('.e-rte-square-palette')[1] as HTMLElement).click();
            expect(document.querySelector(".e-dropdown-popup.e-control.e-popup-close.e-popup-modal")).toBe(null);
        });
        afterAll(function () {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });
    describe('863259: dropdown active state not working when drop down is opened', function () {
        let rteObj: RichTextEditor;
        let rteEle: any;
        beforeEach(function (done: DoneFn) {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',]
                }
            });
            rteEle = rteObj.element;
            done();
        });
        it('Check the fontColor dropdown active element', function (done: DoneFn) {
            rteObj.focusIn();
            let trgEle : HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            setTimeout(() => {
                expect((document.activeElement.childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                done();
            }, 100);
        });
        it('Check the fontSize dropdown active element', function (done: DoneFn) {
            rteObj.focusIn();
            let trgEle : HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[1];
            (trgEle.firstElementChild as HTMLElement).click();
            setTimeout(() => {
                expect((document.activeElement.childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                done();
            }, 100);
        });
        afterEach(function (done: DoneFn) {
            destroy(rteObj);
            done();
        });
    });

    describe('876793: list dropdown active state not working when drop down is opened', function () {
        let rteObj : any;
        let rteEle : any;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                value: `<ol><li class="startFocus">List 1</li><li>List 2</li><li>List 3</li><li class="endFocus">List 4</li></ol>`
            });
            rteEle = rteObj.element;
        });
        it('Check the active state of the list dropdown ', function () {
            let startNode = rteObj.contentModule.getDocument().querySelector('.startFocus');
            let endNode = rteObj.contentModule.getDocument().querySelector('.endFocus');
            let selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), startNode.childNodes[0], endNode.childNodes[0], 0, 3);
            let saveSelection: NodeSelection;
            let ranges: Range;
            ranges = selection.getRange(document);
            saveSelection = selection.save(ranges, document);
            rteObj.htmlEditorModule.onSelectionSave();
            let trgEle : HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[0];
            //Modified rendering from dropdown to split button
            (trgEle.firstElementChild.childNodes[1] as HTMLElement).click();
            dispatchEvent((trgEle.firstElementChild.childNodes[1]) as HTMLElement, 'mousedown');
            expect((document.querySelector('.e-dropdown-popup .e-active') as HTMLElement).innerText === `Number`).toBe(true);
        });
        afterAll(function () {
            destroy(rteObj);
        });
    });

    describe('870342 - Need to remove "e-control" class added to the body when using RichTextEditor', () => {
        let rteObj: any;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'Formats', 'OrderedList', 'UnorderedList']
                },
                value: "Rich Text Editor"
            });
            done();
        });
        it('Checking the e-control class is removed in the body element', (done: Function) => {
            expect(document.body.classList.contains('.e-control')).toBe(false);
            done();
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('876802 - In Inline mode, after applying the format type, the applied format type does not remain in the active state.', () => {
        let rteObj: any;
        beforeAll((done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName', 'FontSize', 'Formats', 'OrderedList', 'UnorderedList']
                },
                inlineMode: {
                    enable: true
                },
                value: "<h1 id=\"rte-element1\"><span id='test-span'>Rich text Editor</span></h1><div id=\"rte-element2\">Ri<span id='test-span1' style=\"font-family: Impact, Charcoal, sans-serif;\">ch text Edit</span>or</div>"
            });
            done();
        });
        it('Format preselect in inline mode', (done: Function) => {
            (rteObj as any).focusIn();
            let headerElement: HTMLElement = rteObj.inputElement.querySelector('#rte-element1 #test-span');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionText(document, headerElement.childNodes[0], headerElement.childNodes[0], 2, 4);
            dispatchEvent(headerElement, 'mouseup');
            setTimeout(() => {
                (rteObj as any).element.ownerDocument.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[2].firstChild.click();
                let FormatsNameItem: HTMLElement = document.querySelector('#' + rteObj.getID() + '_quick_Formats-popup');
                expect(FormatsNameItem.querySelector('.e-item.e-h1[aria-label="Heading 1"]').classList.contains('e-active')).toBe(true);
                done();
            }, 200);
        });
        it('Font name preselect in the inline mode ', (done: Function) => {
            (rteObj as any).focusIn();
            let fontElement = (rteObj as any).inputElement.querySelector('#rte-element2 #test-span1');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, fontElement.childNodes[0], fontElement.childNodes[0], 5, 7);
            dispatchEvent(fontElement, 'mouseup');
            setTimeout(() => {
                rteObj.element.ownerDocument.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[0].firstChild.click();
                let fontNameItem = document.querySelector('#' + rteObj.getID() + '_quick_FontName-popup');
                expect(fontNameItem.querySelector('.e-item.e-impact').classList.contains('e-active')).toBe(true);
                done();
            }, 200);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('885590: dropdown active state not working when drop down is opened', function () {
        let rteObj : any;
        let rteEle : any;
        beforeAll(function () {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                toolbarSettings: {
                    items: ['Formats']
                },
                value: "<h1>Rich Text Editor</h1>"
            });
            rteEle = rteObj.element;
        });
        it('Check the format dropdown active element', function () {
            let trgEle : HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            dispatchEvent(trgEle.firstElementChild, 'mousedown');
            expect(document.querySelector('.e-item.e-paragraph').classList.contains('e-active')).toBe(true);
        });
        afterAll(function () {
            destroy(rteObj);
        });
    });

    describe('914425: The number and bullet format lists are not works properly in the overview and iframe samples', function () {
        let rteObj : any;
        let rteEle : any;
        let defaultUA: string = navigator.userAgent;
        let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
        beforeAll(function () {
            Browser.userAgent = safari;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                value: `<ol><li class="startFocus">List 1</li><li>List 2</li><li>List 3</li><li class="endFocus">List 4</li></ol>`
            });
            rteEle = rteObj.element;
        });
        it('Check the active state of the list dropdown ', function (done: DoneFn) {
            let startNode = rteObj.contentModule.getDocument().querySelector('.startFocus');
            let endNode = rteObj.contentModule.getDocument().querySelector('.endFocus');
            let selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), startNode.childNodes[0], endNode.childNodes[0], 0, 3);
            let saveSelection: NodeSelection;
            let ranges: Range;
            ranges = selection.getRange(document);
            saveSelection = selection.save(ranges, document);
            rteObj.htmlEditorModule.onSelectionSave();
            let trgEle : HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[0];
            //Modified rendering from dropdown to split button
            (trgEle.firstElementChild.childNodes[1] as HTMLElement).click();
            dispatchEvent((trgEle.firstElementChild.childNodes[1] as HTMLElement), 'mousedown');
            setTimeout(() => {
                expect((document.querySelector('.e-dropdown-popup .e-active') as HTMLElement).innerText === `Number`).toBe(true);
                done();
            }, 100);
        });
        afterAll(function () {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
    });
    describe('926936 - Toolbarclick cancel event not working', function () {
        let rteObj: any;
        beforeAll(function (done: DoneFn) {
            rteObj = renderRTE({
                value: `<p>Rich Text Editor</p>`,
                toolbarClick: function (args: any) {
                    args.cancel = true;
                }
            });
            done();
        });
        it('Clicked the toolbar item when args.cancel was set to true in the toolbarClick event.', function (done: DoneFn) {
            rteObj.focusIn();
            var trgEle: HTMLElement = rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            expect(rteObj.inputElement.innerHTML === "<p>Rich Text Editor</p>").toBe(true);
            var trgEle1 = rteObj.element.querySelectorAll(".e-toolbar-item")[1];
            (trgEle1.firstElementChild as HTMLElement).click();
            expect(rteObj.inputElement.innerHTML === "<p>Rich Text Editor</p>").toBe(true);
            var trgEle2 = rteObj.element.querySelectorAll(".e-toolbar-item")[1];
            (trgEle2.firstElementChild as HTMLElement).click();
            expect(rteObj.inputElement.innerHTML === "<p>Rich Text Editor</p>").toBe(true);
            rteObj.readonly = true;
            rteObj.dataBind();
            var trgEle3 = rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle3.firstElementChild as HTMLElement).click();
            expect(rteObj.inputElement.innerHTML === "<p>Rich Text Editor</p>").toBe(true);
            done();
        });
        afterAll(function (done: DoneFn) {
            destroy(rteObj);
            done();
        });
    });
    describe('927099: Applying background colors without focusing on the editor leads to a console error.', function () {
        let rteObj : any;
        let rteEle : any;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['BackgroundColor']
                },
            });
            rteEle = rteObj.element;
        });
        it('Check the format dropdown active element', function () {
            const backgroundColorButton: HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[0].querySelector('.e-dropdown-btn');
            if (backgroundColorButton) {
                backgroundColorButton.click();
                let firstTile = document.querySelectorAll('.e-dropdown-popup .e-tile.e-rte-square-palette.e-custom-tile')[1] as HTMLElement;
                firstTile.click();
                backgroundColorButton.click();
                firstTile = document.querySelectorAll('.e-dropdown-popup .e-tile.e-rte-square-palette.e-custom-tile')[1] as HTMLElement;
                const isTileSelected = firstTile.classList.contains('e-selected');
                expect(isTileSelected).toBe(true); 
            }
        });
        afterAll(function () {
            destroy(rteObj);
        });
    });

    describe('933195 - Backspace key action not working with Text Quick Toolbar.', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                enablePersistence: true,
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'FontColor', 'BackgroundColor']
                },
            })
        });
        afterAll(()=>{
            destroy(editor);
        });
        it('Should be able to type after opening the Quick toolbar and selecting the text.', (done: DoneFn)=>{
            editor.focusIn();
            editor.inputElement.innerHTML = `<p>Sample text content</p><h1>Sample Heading</h1>`;
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            editor.selectAll();
            const shiftKeyDownEvent: KeyboardEvent =  new KeyboardEvent('keydown', SHIFT_ARROW_DOWN_EVENT_INIT);
            const shiftKeyUpEvent: KeyboardEvent =  new KeyboardEvent('keyup', SHIFT_ARROW_DOWN_EVENT_INIT);
            editor.inputElement.dispatchEvent(shiftKeyDownEvent);
            editor.inputElement.dispatchEvent(shiftKeyUpEvent);
            expect(editor.inputElement.innerHTML).not.toBe('<p><br></p>');
            const backSpaceKeyDownEvent: KeyboardEvent =  new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUpEvent: KeyboardEvent =  new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(backSpaceKeyDownEvent);
            editor.inputElement.dispatchEvent(backSpaceKeyUpEvent);
            setTimeout(() => {
                const textBaseQuickToolbar: BaseQuickToolbar = editor.quickToolbarModule.textQTBar;
                expect(editor.inputElement.innerHTML).toBe('<p><br></p>');
                expect((textBaseQuickToolbar as any).colorPickerObj.fontColorPicker.enablePersistence).toBe(false);
                expect((textBaseQuickToolbar as any).colorPickerObj.backgroundColorPicker.enablePersistence).toBe(false);
                done();
            }, 100);
        });
    });

    describe('Apply FullScreen mode to RTE -', () => {
        let rteObj: any;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FullScreen', 'BackgroundColor',]
                }
            });
            rteEle = rteObj.element;
        });

        it(' Maximize and Minimize RTE testing', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            trgEle.setAttribute('title', 'Maximize');
            dispatchEvent(trgEle, 'mouseover');
            trgEle.click();
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            dispatchEvent(trgEle, 'mouseover');
            expect(rteEle.classList.contains('e-rte-full-screen')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
});

describe('Toolbar Bottom Position Testing', () => {

    function setCursorPoint(curDocument: Document, element: Element, point: number) {
        let range: Range = curDocument.createRange();
        let sel: Selection = curDocument.defaultView.getSelection();
        range.setStart(element, point);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    describe(' Checking the  Parent based Commands with bottom toolbar', () => {
                    let rteEle: Element;
                    let selectNode: Element;
                    let rteObj: RichTextEditor;
                    let curDocument: Document;
                    let mouseEventArgs: { [key: string]: HTMLElement };
                    let editNode: Element;
                    let nodeSelection: NodeSelection = new NodeSelection();
                    let action: boolean = false;
                    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: '' };
                    let innerHTMLStr: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <p class='third-p-node'>dom node<label class='third-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>
    <p id='convertPre'>converted to pre<p><p id='revertPre'>converted to pre<p>`;

                    beforeAll(() => {
                        rteObj = renderRTE({
                            toolbarSettings: {
                                position: 'Bottom',
                                items: ['|', 'Formats', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'Indent', 'Outdent', '|',
                                    'FontName', '|', 'InsertCode']
                            },
                            format: {
                                types: [
                                    { text: 'Paragraph', value: 'P' },
                                    { text: 'Code', value: 'Pre'},
                                    { text: 'Quotation', value: 'BlockQuote'},
                                    { text: 'Heading 1', value: 'H1' },
                                    { text: 'Heading 2', value: 'H2' },
                                    { text: 'Heading 3', value: 'H3' },
                                    { text: 'Heading 4', value: 'H4' }
                                ]
                            },
                            value: innerHTMLStr,
                            placeholder : 'Syncfusion RichTextEditor',
                            actionComplete: (): void => {
                                action = true;
                            }
                        });
                        rteEle = rteObj.element;
                        editNode = rteObj.contentModule.getEditPanel();
                        curDocument = rteObj.contentModule.getDocument();
                    });
                    afterAll(() => {
                        destroy(rteObj);
                    });
                    it("Font Name click", () => {
                        let nodeselection: NodeSelection = new NodeSelection();
                        selectNode = editNode.querySelector('.third-p-node');
                        nodeselection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[0], 0, 3);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.fontNameDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.third-p-node');
                        expect(selectNode.childNodes[0].nodeName.toLowerCase()).toBe('span');
                    });
                    it("Formats - P", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.tagName.toLowerCase() === 'p').toBe(true);
                    });
                    it("Formats - pre", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
                    });
                    it("Formats - P with selection", () => {
                        action = false;
                        selectNode = editNode.querySelector('.first-p-node');
                        //The selection type was changed because the previous code will select the element along with the space content after the element
                        nodeSelection.setSelectionText(curDocument, selectNode.childNodes[0], selectNode.childNodes[1].childNodes[0], 0, 9);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.nodeName.toLowerCase() === 'p').toBe(true);
                        expect(action).toBe(true);
                    });
                    it("Formats - h1", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.tagName.toLowerCase() === 'h1').toBe(true);
                    });
                    it("Formats - h2", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[4] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.tagName.toLowerCase() === 'h2').toBe(true);
                    });
                    it("Formats - h3", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[5] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.tagName.toLowerCase() === 'h3').toBe(true);
                    });
                    it("Formats - h4", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.tagName.toLowerCase() === 'h4').toBe(true);
                    });
    
                    it("Alignments - JustifyLeft", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[0] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect((selectNode as HTMLElement).style.textAlign === 'left')
                    });
                    it("Alignments - JustifyCenter", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[1] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect((selectNode as HTMLElement).style.textAlign === 'center')
                    });
                    it("Alignments - JustifyRight", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[2] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect((selectNode as HTMLElement).style.textAlign === 'right')
                    });
                    it("Alignments - JustifyFull", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[3];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[3] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.alignDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect((selectNode as HTMLElement).style.textAlign === 'justify').toBe(true);
                    });
    
                    it("Lists - OL", () => {
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[5];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.parentElement.tagName === 'OL').toBe(true);
                    });
                    it("Lists - UL", () => {
                        selectNode = editNode.querySelector('.second-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[6];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        selectNode = editNode.querySelector('.second-p-node');
                        expect(selectNode.parentElement.tagName === 'UL').toBe(true);
                    });
    
                    it(' tab key navigation from second li start point', () => {
                        selectNode = editNode.querySelector('.ul-third-node');
                        expect(selectNode.querySelector('ul')).toBeNull();
                        setCursorPoint(curDocument, selectNode.childNodes[2] as Element, 0);
                        (rteObj as any).keyDown(keyBoardEvent);
                        expect(selectNode.querySelector('ul')).not.toBeNull();
                    });
    
                    it("Indents - Indent", () => {
                        selectNode = editNode.querySelector('.third-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[8];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        (trgEle.childNodes[0] as HTMLElement).click();
                        selectNode = editNode.querySelector('.third-p-node');
                        expect((selectNode as HTMLElement).style.marginLeft === '40px').toBe(true);
                    });
                    it("Indents - Outdent", () => {
                        selectNode = editNode.querySelector('.third-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[9];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        selectNode = editNode.querySelector('.third-p-node');
                        expect((selectNode as HTMLElement).style.marginLeft === '20px').toBe(true);
                    });
                    it("check-placeholder", function () {
                        rteObj.value='';
                        rteObj.dataBind();
                        expect((document.getElementsByClassName('e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
                        var trgEle = rteEle.querySelectorAll(".e-toolbar-item")[5];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        expect((document.getElementsByClassName('e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(false);
                        expect((rteObj.inputElement.firstChild as HTMLElement).tagName).toBe('OL');
                    });
    
                    it("Formats - h4 by selecting all content and table at the last", () => {
                        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p id='p1'>Paragraph 1</p><p id='p2'>Paragraph 2</p><p id='p3'>Paragraph 3</p><table><tbody><tr><td>cell 1 1</td><td>cell 1 2</td></tr><tr><td>cell 2 1</td><td id="lastCell">Cell 2 2</td></tr></tbody></table></div>`;
                        rteObj.value = tableContent;
                        rteObj.dataBind();
                        rteObj.selectAll();
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[6] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        expect(rteObj.getSelection().trim() === 'Paragraph 1Paragraph 2Paragraph 3cell 1 1cell 1 2cell 2 1Cell 2 2').toBe(true);
                    });
                    it("Insert Code Format testing", () => {
                        rteObj.value = innerHTMLStr;
                        rteObj.dataBind();
                        selectNode = editNode.querySelector('#convertPre');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[13];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        selectNode = editNode.querySelector('#convertPre');
                        expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
                    });
                    it("Revert the pre when Insert Code Format click on pre applied tag testing", () => {
                        rteObj.value = innerHTMLStr;
                        rteObj.dataBind();
                        selectNode = editNode.querySelector('#revertPre');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[13];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        selectNode = editNode.querySelector('#revertPre');
                        expect(selectNode.tagName.toLowerCase() === 'pre').toBe(true);
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        (trgEle.childNodes[0] as HTMLElement).click();
                        selectNode = editNode.querySelector('#revertPre');
                        expect(selectNode.tagName.toLowerCase() === 'p').toBe(true);
                    });
                    
                    it("Formats - blockquote", () => {
                        rteObj.value = innerHTMLStr;
                        rteObj.dataBind();
                        selectNode = editNode.querySelector('.first-p-node');
                        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
                        let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
                        (trgEle.childNodes[0] as HTMLElement).click();
                        let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                        mouseEventArgs = {
                            target: (popupElement.childNodes[0].childNodes[2] as HTMLElement)
                        };
                        (rteObj.toolbarModule as any).dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
                        selectNode = editNode.querySelector('.first-p-node');
                        expect(selectNode.parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);
                    });
                });

    describe('Table Module with bottom toolbar', () => {
        let rteEle: HTMLElement;
                let rteObj: RichTextEditor;
                beforeAll(() => {
                    rteObj = renderRTE({
                        height: 400,
                        placeholder: 'Insert table here',
                        toolbarSettings: {
                            position: 'Bottom',
                            items: ['Bold', 'CreateTable']
                        },
                        resizeStart: (args) => {
                            expect(args.requestType.toLocaleLowerCase() === 'table');
                        },
                        resizeStop: (args) => {
                            expect(args.requestType.toLocaleLowerCase() === 'table');
                        },
                        resizing: (args) => {
                            expect(args.requestType.toLocaleLowerCase() === 'table');
                        }
                    });
                    rteEle = rteObj.element;
                });
                afterAll(() => {
                    destroy(rteObj);
                });
                it('table creation - dialog', () => {
                    expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
                    expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
                    (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                    let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                    let clickEvent: any = document.createEvent("MouseEvents");
                    clickEvent.initEvent("click", false, true);
                    target.dispatchEvent(clickEvent);
                    expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                    target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                    target.dispatchEvent(clickEvent);
                    let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                    expect(table.querySelectorAll('tr').length === 3).toBe(true);
                    expect(table.querySelectorAll('td').length === 9).toBe(true);
                    (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
                    expect(rteObj.contentModule.getPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
                    expect(rteObj.contentModule.getPanel().querySelectorAll('.e-row-resize').length === 3).toBe(true);
                    expect(rteObj.contentModule.getPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
                    let reCol: any = rteObj.contentModule.getPanel().querySelectorAll('.e-column-resize')[1];
                    clickEvent.initEvent("mousedown", false, true);
                    reCol.dispatchEvent(clickEvent);
                    (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
                    expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(false);
                });
    });

    describe('Table Popup with Bottom Toolbar', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    position: 'Bottom',
                    items: ['CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should position table dialog appropriately with bottom toolbar -- Coverage', (done) => {
            rteEle.style.position = 'absolute';
            rteEle.style.bottom = '-100px';
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                const tablePopup = document.querySelector('.e-rte-table-popup') as HTMLElement;
                const toolbar = rteObj.element.querySelector('.e-toolbar') as HTMLElement;
                expect(tablePopup).not.toBeNull();
                const popupRect = tablePopup.getBoundingClientRect();
                const toolbarRect = toolbar.getBoundingClientRect();
                expect(toolbarRect.top).toBeLessThanOrEqual(popupRect.bottom);
                done();
            }, 400); 
        });
    });

    describe('Image Module with bottom toolbar', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    position: 'Bottom',
                    items: ['Image', 'Bold', 'Formats']
                },
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
            rteObj.formatter.editorManager.imgObj = new ImageCommand(rteObj.formatter.editorManager);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting image and applying heading', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Image').toBe(true);
            expect(dialogEle.querySelector('.e-img-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            expect(dialogEle.querySelector('.imgUrl').firstElementChild.classList.contains('e-img-url')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let args: any = {
                item: { url: 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.imgObj.createImage(args);
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
        });
    });

    describe('Audio Module with bottom toolbar', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    position: 'Bottom',
                    items: ['Audio', 'Bold', 'Formats']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting audio and applying heading', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Audio').toBe(true);
            expect(dialogEle.querySelector('.e-aud-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            expect(dialogEle.querySelector('.audioUrl').firstElementChild.classList.contains('e-audio-url')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let args: any = {
                item: { url: window.origin + '/base/spec/content/audio/RTE-Audio.mp3', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.audioObj.createAudio(args);
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
            done();
        });
    });

    describe('Video Module with bottom toolbar', () => {
            let rteEle: HTMLElement;
            let rteObj: RichTextEditor;
            beforeAll(() => {
                rteObj = renderRTE({
                    height: 400,
                    toolbarSettings: {
                        position: 'Bottom',
                        items: ['Video', 'Bold']
                    },
                    insertVideoSettings: { resize: false },
                    actionBegin: function (e: any) {
                        if(e.item.subCommand === 'Video'){
                        expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                        expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                        }
                    },
                    actionComplete: function (e: any) {
                        if(e.requestType === 'Video'){ expect(e.requestType === 'Video').toBe(true);}
                    }
                });
                rteEle = rteObj.element;
            });
            afterAll(() => {
                destroy(rteObj);
                detach(document.querySelector('.e-video-inline'));
            });
            it('video dialog', (done: Function) => {
                expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Video').toBe(true);
                expect(dialogEle.querySelector('.e-vid-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
                expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                let range: any = new NodeSelection().getRange(document);
                let save: any = new NodeSelection().save(range, document);
                let args: any = {
                    item: { url: window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4', selection: save },
                    preventDefault: function () { }
                };
                (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
                (rteObj.element.querySelector('.e-rte-video') as HTMLElement).focus();
                args = {
                    item: { url: null, selection: null },
                    preventDefault: function () { }
                };
                (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
                let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
                evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-video')];
                let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                let clickEvent: any = document.createEvent("MouseEvents");
                let eventsArg: any = { pageX: 50, pageY: 300, target: evnArg.selectNode[0] };
                clickEvent.initEvent("mousedown", false, true);
                trg.dispatchEvent(clickEvent);
                (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
                setTimeout(() => {
                    let linkPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                    let linkTBItems: any = linkPop.querySelectorAll('.e-toolbar-item');
                    expect(linkPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                    (<HTMLElement>linkTBItems.item(0)).click();
                    let eventArgs: any = { target: document, preventDefault: function () { } };
                    (<any>rteObj).videoModule.onDocumentClick(eventArgs);
                    done();
                }, 400);
            });
            it('insert video url', () => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                let args: any = {
                    preventDefault: function () { },
                    originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
                    item: {},
                };
                let range: any = new NodeSelection().getRange(document);
                let save: any = new NodeSelection().save(range, document);
                let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[6] as HTMLElement).click();
                let dialogEle: any = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
                (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
                (rteObj.element.querySelector('.e-rte-video') as HTMLElement).click();
                evnArg.args = { preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }, item: {} };
                evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)];
                let trget: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                let clickEvent: any = document.createEvent("MouseEvents");
                let eventsArg: any = { pageX: 50, pageY: 300, target: evnArg.selectNode[0], preventDefault: function () { } };
                clickEvent.initEvent("mousedown", false, true);
                trget.dispatchEvent(clickEvent);
                (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
                let videoPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                videoPop.style.display = 'block';
                expect(videoPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                expect(videoPop.offsetLeft >= rteEle.offsetLeft).toBe(true);
                expect(videoPop.offsetTop > rteEle.offsetTop).toBe(true);
                (rteObj.element.querySelector('.e-rte-video') as HTMLElement).focus();
                evnArg.item = { command: 'Videos', subCommand: 'JustifyLeft' };
                evnArg.e = args;
                (<any>rteObj).videoModule.alignmentSelect(evnArg);
                evnArg.args.item = { command: 'Videos', subCommand: 'JustifyLeft' };
                (<any>rteObj).videoModule.alignVideo(evnArg, 'JustifyLeft');
                expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-left')).toBe(true);
                evnArg.item = { command: 'Videos', subCommand: 'JustifyRight' };
                evnArg.e = args;
                (<any>rteObj).videoModule.alignmentSelect(evnArg);
                evnArg.args.item = { command: 'Videos', subCommand: 'JustifyRight' };
                (<any>rteObj).videoModule.alignVideo(evnArg, 'JustifyRight');
                expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-right')).toBe(true);
                evnArg.item = { command: 'Videos', subCommand: 'JustifyCenter' };
                evnArg.e = args;
                (<any>rteObj).videoModule.alignmentSelect(evnArg);
                evnArg.args.item = { command: 'Videos', subCommand: 'JustifyCenter' };
                (<any>rteObj).videoModule.alignVideo(evnArg, 'JustifyCenter');
                expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-right')).not.toBe(true);
                expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-left')).not.toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).videoModule.break(evnArg);
                evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)];
                evnArg.item = { command: 'Videos', subCommand: 'Break' };
                evnArg.e = args;
                (<any>rteObj).videoModule.alignmentSelect(evnArg);
                evnArg.args.item = { command: 'Videos', subCommand: 'Break' };
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).videoModule.inline(evnArg);
                evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)];
                evnArg.item = { command: 'Videos', subCommand: 'Inline' };
                evnArg.e = args;
                (<any>rteObj).videoModule.alignmentSelect(evnArg);
                evnArg.args.item = { command: 'Videos', subCommand: 'Inline' };
                (rteObj.element.querySelector('.e-rte-video') as HTMLElement).click();
                evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-video')];
                let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                clickEvent = document.createEvent("MouseEvents");
                eventsArg = { pageX: 50, pageY: 300, target: evnArg.selectNode[0], preventDefault: function () { } };
                clickEvent.initEvent("mousedown", false, true);
                trg.dispatchEvent(clickEvent);
                rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-video'));
                (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            });
    });

    describe("Rendering Resizable RTE with Div element with Bottom Toolbar", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let clickEvent: any;
        let resizeStartSpy: jasmine.Spy = jasmine.createSpy('onresizeStart');
        let resizingSpy: jasmine.Spy = jasmine.createSpy('onresizing');
        let resizeStopSpy: jasmine.Spy = jasmine.createSpy('onresizeStop');

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    position: 'Bottom',
                    items: ['CreateTable']
                },
                enableResize: true,
                enableRtl: true,
                resizeStart: resizeStartSpy,
                resizing: resizingSpy,
                resizeStop: resizeStopSpy
            });
            rteEle = rteObj.element;
            done();
        });

        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it("Element availability testing", () => {
            expect(rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) != null).toBe(true);
        });

        it('resize start', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                expect(resizeStartSpy).toHaveBeenCalled();
                done();
            }, 400);
        });

        it('resizing - mousemove', (done) => {
            let trg = (rteObj.element.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mousemove", false, true);
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).performResize(clickEvent);
                setTimeout(() => {
                    expect(resizingSpy).toHaveBeenCalled();
                    done();
                }, 400);
            }, 400);
        });

        it('resize end', (done) => {
            let trg = (rteEle.querySelector('.' + CLS_RTE_RES_HANDLE) as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.resizeModule as any).resizeStart(clickEvent);
            setTimeout(() => {
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mouseup", false, true);
                trg.dispatchEvent(clickEvent);
                (rteObj.resizeModule as any).stopResize(clickEvent);
                setTimeout(() => {
                    expect(resizeStopSpy).toHaveBeenCalled();
                    done();
                }, 400);
            }, 400);
        });
    });

    describe(' Bottom toolbar test', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        
        beforeAll(() => {
            rteObj = renderRTE({
                showCharCount: true,
                toolbarSettings: {
                    position: 'Bottom',
                    items: ['Bold', 'Italic', 'Underline', '|', 'Formats', '|', 'Alignments', 'OrderedList',
                        'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', '|', 'Undo', 'Redo']
                },
                value: '<p>Rich Text Editor with bottom toolbar</p>'
            });
            rteEle = rteObj.element;
        });
        
        afterAll(() => {
            destroy(rteObj);
        });
        
        it('Bottom toolbar rendering test', () => {
            const toolbarWrapper: HTMLElement = rteObj.element.querySelector('.e-toolbar-wrapper') as HTMLElement;
            
            // Verify toolbar is at bottom
            expect(toolbarWrapper).not.toBeNull();
            expect(toolbarWrapper.classList.contains('e-rte-tb-bottom')).toBe(true);
        });
    });

});

describe('Popup toolbar testing',() => {
 let rteObj: RichTextEditor;
    let rteEle: HTMLElement;

     beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Bold', 'Italic', 'Underline', 'FontName', 'FontSize', 'Alignments', 'SourceCode']
            },
            width: '200px'
        });
        rteEle = rteObj.element;
    });

    it('Should display expand button and open popup toolbar on click', () => {
        (rteObj as any).toolbarSettings.type = 'Popup';
        rteObj.dataBind();
        const popupToolbar = document.querySelector('.e-popup-close') as HTMLElement;
        expect(popupToolbar).not.toBeNull();
        expect(popupToolbar.style.display).not.toBe('none');
    });

    it('Should open popup and toggle classes correctly for Formats', () => {
        const popupToolbar = document.querySelector('.e-popup-close');
        expect(popupToolbar).not.toBeNull();
            popupToolbar.classList.remove('e-popup-close');
            popupToolbar.classList.add('e-popup-open');
            const formatsButton = rteEle.querySelector('.e-font-name-tbar-btn');
            expect(formatsButton).not.toBeNull();
            (formatsButton as HTMLElement).click();
            expect(document.querySelector('.e-popup-open')).not.toBeNull();
    });

    it('SourceCode button should not have e-overlay class after click', () => {
        const sourceCodeButton = rteEle.querySelector('.e-source-code');
        expect(sourceCodeButton).not.toBeNull();
        (sourceCodeButton as HTMLElement).click();
        expect(sourceCodeButton.classList.contains('e-overlay')).toBe(false);
    });

    afterAll(() => {
        if (rteObj) {
            destroy(rteObj);
        }
    });
});

describe('963682: Incorrect list style highlighted in dropdown after applying numbered list to paragraph in Blazor Rich Text Editor', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let controlId: string;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['BulletFormatList', 'NumberFormatList']
            },
            bulletFormatList: {
                types: [
                    { text: 'None', value: 'none' },
                    { text: 'Disc', value: 'disc' },
                    { text: 'Circle', value: 'circle' },
                    { text: 'Square', value: 'square' }
                ]
            },
            numberFormatList: {
                types: [
                    { text: 'None', value: 'none' },
                    { text: 'UpperAlpha', value: 'upperAlpha' },
                    { text: 'Number', value: 'decimal' },
                ]
            },
            value: `
                <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>
            `
        });
        rteEle = rteObj.element;
        controlId = rteEle.id;
        done();
    });

    afterAll((done: Function) => {
        destroy(rteObj);
        done();
    });

    it('Should apply numberformat list and check the number item is active or not', () => {
        const content: HTMLParagraphElement = rteEle.querySelector('p')!;
        expect(content).not.toBeNull();
        const nodeSelection = rteObj.formatter.editorManager.nodeSelection;
        nodeSelection.setSelectionText(document, content, content, 0, 0);
        // clicking the number format list button
        let numberListBTn= document.querySelector('#' + controlId + '_toolbar_NumberFormatList') as HTMLElement;
        numberListBTn.click();
        expect(rteEle.querySelector('ol')).not.toBeNull();
        // clicking the number format dropdowm icon for opening dropdown
        const numberButton: HTMLElement = rteObj.element.querySelector(`#${controlId}_toolbar_NumberFormatList_dropdownbtn`) as HTMLElement;
            numberButton.click();
        // then check the number item is active or not
        let numberDropdownItems = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item')[2];
        expect(numberDropdownItems.classList.contains('e-active')).toBe(true);
    });
});

