/**
 * Toolbar renderer spec
 */
import { Browser } from "@syncfusion/ej2-base";
import { renderRTE,dispatchEvent, destroy } from './../render.spec';
import { NodeSelection } from './../../../src/selection/index';
import { BaseQuickToolbar, RichTextEditor } from "../../../src";
import { BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, SHIFT_ARROW_DOWN_EVENT_INIT } from "../../constant.spec";

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
    
    describe('Checking the role attribute in div mode-', () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor',]
                }
            });
            rteEle = rteObj.element;
        });

        it(' FontCOlor and Backgroundcolor role resting', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            expect((trgEle.childNodes[0] as HTMLElement).hasAttribute('role')).toBe(true);
            let trgEle2: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            expect((trgEle2.childNodes[0] as HTMLElement).hasAttribute('role')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    
    describe('Checking the role attribute in iframe mode-', () => {
        let rteObj: any;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor',]
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
        });

        it(' FontCOlor and Backgroundcolor role resting', () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
            expect((trgEle.childNodes[0] as HTMLElement).hasAttribute('role')).toBe(true);
            let trgEle2: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            expect((trgEle2.childNodes[0] as HTMLElement).hasAttribute('role')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
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
            (trgEle.firstElementChild as HTMLElement).click();
            dispatchEvent(trgEle.firstElementChild, 'mousedown');
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
            (trgEle.firstElementChild as HTMLElement).click();
            dispatchEvent(trgEle.firstElementChild, 'mousedown');
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
            (trgEle.firstElementChild as HTMLElement).click();
            dispatchEvent(trgEle.firstElementChild, 'mousedown');
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
            const backgroundColorButton: HTMLElement = rteEle.querySelectorAll(".e-toolbar-item")[0];
            if (backgroundColorButton) {
                backgroundColorButton.click();
                const firstTile = document.querySelectorAll('.e-dropdown-popup .e-tile.e-rte-square-palette.e-custom-tile')[1] as HTMLElement;
                firstTile.click();
                const applyButton: HTMLElement  = document.querySelector('.e-apply');
                applyButton.click();
                backgroundColorButton.click();
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