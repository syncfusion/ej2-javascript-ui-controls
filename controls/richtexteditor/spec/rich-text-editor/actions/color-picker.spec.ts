/**
 * RTE - Color-picker action spec
 */
import { Browser, isNullOrUndefined } from "@syncfusion/ej2-base";
import { RichTextEditor } from './../../../src/index';
import { renderRTE, destroy, dispatchKeyEvent, dispatchEvent, selectTableCell, drawCellSelection } from "./../render.spec";
import { BASIC_MOUSE_EVENT_INIT } from "../../constant.spec";

function setCursorPoint(curDocument: Document, element: Element, point: number) {
    let range: Range = curDocument.createRange();
    let sel: Selection = curDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

describe("'FontColor and BackgroundColor' - ColorPicker render testing", () => {
    let rteEle: HTMLElement;
    let rteObj: any;

    beforeEach(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            }
        });
        rteEle = rteObj.element;
    });

    afterEach(() => {
        destroy(rteObj);
    });

    it("Color Picker initial rendering testing", () => {
        expect(rteObj.toolbarSettings.items[0]).toBe("FontColor");
        expect(rteObj.toolbarSettings.items[1]).toBe("BackgroundColor");
        //expect(rteEle.querySelectorAll(".e-colorpicker-wrapper")[0].classList.contains("e-font-color")).toBe(true);
        //expect(rteEle.querySelectorAll(".e-colorpicker-wrapper")[1].classList.contains("e-background-color")).toBe(true);
    });
    it(" fontColor DropDown button target element as span", () => {
        let item:HTMLElement= rteEle.querySelector("#"+rteEle.id+"_toolbar_FontColor")
         expect(item.tagName==='SPAN').toBe(true);
         expect(item.hasAttribute('type')).toBe(false);
     });
});

describe(' RTE content selection with ', () => {
    let rteObj: RichTextEditor;
    let rteEle: Element;
    let mouseEventArgs: any;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;
    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
            
    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;

    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            }
        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
        curDocument = rteObj.contentModule.getDocument();
    });
    it("ColorPicker - Font selection", () => {
        selectNode = editNode.querySelector('.first-p-node');
        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        fontColorPicker.dispatchEvent(clickEvent);
        fontColorPicker.click();
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].showButtons = true;
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].dataBind();
        let fontColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: fontColorPickerItem
        };
        (rteObj.toolbarModule as any).colorPickerModule.fontColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.color === 'rgb(28, 188, 81)')
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe(' RTE content selection with ', () => {
    let rteObj: RichTextEditor;
    let rteEle: Element;
    let mouseEventArgs: any;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
            
    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;

    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            }
        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
        curDocument = rteObj.contentModule.getDocument();
    });
    it("ColorPicker - Background selection", () => {
        selectNode = editNode.querySelector('.first-p-node');
        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[1];
        backgroundColorPicker.click();
        (document.querySelectorAll('.e-control.e-colorpicker')[1] as any).ej2_instances[0].inline = true;
        (document.querySelectorAll('.e-control.e-colorpicker')[1]  as any).ej2_instances[0].showButtons = true;
        (document.querySelectorAll('.e-control.e-colorpicker')[1]  as any).ej2_instances[0].dataBind();
        let backgroundColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: backgroundColorPickerItem
        };
        (rteObj.toolbarModule as any).colorPickerModule.backgroundColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.backgroundColor === 'rgb(255, 255, 0)');
        backgroundColorPicker.click();
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe("'FontColor and BackgroundColor' - ColorPicker render testing using mobileUA", () => {
    let rteEle: HTMLElement;
    let rteObj: any;

    let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
    let defaultUA: string = navigator.userAgent;

    beforeAll(() => {
        Browser.userAgent = mobileUA;
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            }
        });
        rteEle = rteObj.element;
    });

    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent = defaultUA;
    });

    it("Color Picker initial rendering testing", () => {
        expect(rteObj.toolbarSettings.items[0]).toBe("FontColor");
        expect(rteObj.toolbarSettings.items[1]).toBe("BackgroundColor");
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[1].lastElementChild;
        backgroundColorPicker.click();
    });
});

describe(' Readonly ', () => {
    let rteObj: RichTextEditor;
    let rteEle: Element;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
            
    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;

    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor", 'FontName', 'Bold']
            },
            readonly: true
        });
        rteEle = rteObj.element;
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
    });
    it("ColorPicker - DropDown button Background selection", () => {
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[1];
        backgroundColorPicker.click();
        expect((backgroundColorPicker as HTMLElement).style.background === '');
    });
    it("font color -selection", () => {
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[2];
        backgroundColorPicker.click();
        expect((backgroundColorPicker as HTMLElement).style.background === '');
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe(' RTE content selection with ', () => {
    let rteObj: RichTextEditor;
    let rteEle: Element;
    let mouseEventArgs: any;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
            
    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;

    beforeAll(() => {
        Browser.info.name = 'msie';
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            }
        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
        curDocument = rteObj.contentModule.getDocument();
    });
    it("ColorPicker - Font selection in IE browser", () => {
        selectNode = editNode.querySelector('.first-p-node');
        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
        fontColorPicker.click();
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].showButtons = true;
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].dataBind();
        let fontColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: fontColorPickerItem
        };
        (rteObj.toolbarModule as any).colorPickerModule.fontColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.color === 'rgb(28, 188, 81)')
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe(' RTE content selection with ', () => {
    let rteObj: RichTextEditor;
    let rteEle: Element;
    let mouseEventArgs: any;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;

    let innerHTML: string = `<p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
            
    <p class='second-p-node'><label class='second-label'>label node</label></p>
    <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`;

    beforeAll(() => {
        Browser.info.name = 'edge';
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            }
        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
        curDocument = rteObj.contentModule.getDocument();
    });
    it("ColorPicker - Background selection in Edge browser", () => {
        selectNode = editNode.querySelector('.first-p-node');
        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[1];
        backgroundColorPicker.click();
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].inline = true;
        document.querySelector('.e-control.e-colorpicker' as any).ej2_instances[0].showButtons = true;
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].dataBind();
        let backgroundColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: backgroundColorPickerItem
        };
        (rteObj.toolbarModule as any).colorPickerModule.backgroundColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.backgroundColor === 'rgb(255, 255, 0)');
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe("'FontColor and BackgroundColor' - ColorPicker DROPDOWN", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let mouseEventArgs: any;
    let editNode: Element;
    let selectNode: Element;
    beforeEach(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            },
            fontColor: {
                mode: 'Picker',
                modeSwitcher: true
            },
            backgroundColor: {
                mode: 'Picker',
                modeSwitcher: true
            },
            value: `<p>First p node-0</p><p>First p node-1</p>

            <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
                    
            <p class='second-p-node'><label class='second-label'>label node</label></p>
            <p class='third-p-node'>dom node</p>
            <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`
        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
    });

    afterEach((done: DoneFn) => {
        destroy(rteObj);
        done();
    });

    it("Color Picker initial rendering testing - 1", (done) => {
        selectNode = editNode.querySelector('.third-p-node');
        setCursorPoint(document, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-split-btn-wrapper .e-dropdown-btn')[1];
        backgroundColorPicker.click();
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].inline = true;
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].showButtons = true;
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].dataBind();
        dispatchEvent(document.querySelectorAll('.e-control-wrapper.e-numeric.e-float-input.e-input-group')[7].firstElementChild, 'focusin');
        (document.querySelectorAll('.e-control-wrapper.e-numeric.e-float-input.e-input-group')[7].firstElementChild as any).value = '50';
        dispatchKeyEvent(document.querySelectorAll('.e-control-wrapper.e-numeric.e-float-input.e-input-group')[7].firstElementChild, 'input');
        dispatchKeyEvent(document.querySelectorAll('.e-control-wrapper.e-numeric.e-float-input.e-input-group')[7].firstElementChild, 'keyup', { 'key': 'a', 'keyCode': 65 });
        dispatchEvent(document.querySelectorAll('.e-control-wrapper.e-numeric.e-float-input.e-input-group')[7].firstElementChild, 'change');
        dispatchEvent(document.querySelectorAll('.e-control-wrapper.e-numeric.e-float-input.e-input-group')[7].firstElementChild, 'focusout');
        setTimeout(() => {
            let backgroundColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
            mouseEventArgs = {
                target: backgroundColorPickerItem
            };
            (rteObj.toolbarModule as any).colorPickerModule.backgroundColorPicker.btnClickHandler(mouseEventArgs);
            expect(selectNode.childNodes[0].nodeName.toLocaleLowerCase()).toBe("span");
            expect((selectNode.childNodes[0] as HTMLElement).getAttribute('style')).toBe('background-color: rgba(255, 255, 0, 0.5);');
            done();
        }, 200);
    });

    it("Color Picker initial rendering testing", () => {
        expect(rteObj.toolbarSettings.items[0]).toBe("FontColor");
        expect(rteObj.toolbarSettings.items[1]).toBe("BackgroundColor");
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-toolbar-item .e-dropdown-btn')[1];
        backgroundColorPicker.click();
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].inline = true;
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].showButtons = true;
        (document.querySelector('.e-control.e-colorpicker') as any).ej2_instances[0].dataBind();
        (document.querySelectorAll(".e-primary.e-apply")[0] as HTMLElement).click();
        (document.querySelectorAll(".e-mode-switch-btn")[1] as HTMLElement).click();
    });
    it("Color Picker initial rendering testing - 1", () => {
        selectNode = editNode.querySelector('.first-p-node');
        setCursorPoint(document, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector(".e-rte-background-colorpicker");
        backgroundColorPicker.click();
        (backgroundColorPicker.querySelector(".e-rte-background-colorpicker .e-split-colorpicker .e-selected-color") as HTMLElement).click();
        expect(selectNode.childNodes[0].nodeName.toLocaleLowerCase()).toBe("span");
    });
    it("Color Picker initial rendering testing - 2", () => {
        selectNode = editNode.querySelector('.first-label');
        setCursorPoint(document, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector('.e-split-btn-wrapper .e-split-colorpicker');
        backgroundColorPicker.click();
        expect(selectNode.childNodes[0].nodeName.toLocaleLowerCase()).toBe("span");
    });
});

describe("Bug 991469: Apply and Cancel buttons are hidden in the ColorPicker popup in RichTextEditor", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    beforeEach(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            },
            fontColor: {
                mode: 'Picker',
                modeSwitcher: true
            },
            backgroundColor: {
                mode: 'Picker',
                modeSwitcher: true
            }
        });
        rteEle = rteObj.element;
    });
    afterEach((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
    it(" The color picker buttons should only be shown when it's in picker mode, and not when it switches to palette mode dynamically", (done) => {
        rteObj.focusIn();
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll('.e-split-btn-wrapper .e-dropdown-btn')[1];
        backgroundColorPicker.click();
        setTimeout(() => {
            let backgroundColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
            expect(!isNullOrUndefined(backgroundColorPickerItem)).toBe(true);
            rteObj.backgroundColor.mode = 'Palette';
            rteObj.dataBind();
            setTimeout(() => {
                backgroundColorPickerItem = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
                expect(isNullOrUndefined(backgroundColorPickerItem)).toBe(true);
                done();
            }, 100);
        }, 200);
    });
});

describe("EJ2-16252: 'FontColor and BackgroundColor' - selection state", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let controlId: string;
    let curDocument: Document;
    let editNode: Element;
    let selectNode: Element;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            },
            value: `<p>First p node-0</p><p>First p node-1</p>

            <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
                    
            <p class='second-p-node'><label class='second-label'>label node</label></p>
            <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`
        });
        rteEle = rteObj.element;
        controlId = rteEle.id;
        curDocument = rteObj.contentModule.getDocument();
        editNode = rteObj.contentModule.getEditPanel();
    });

    afterAll(() => {
        destroy(rteObj);
    });

    it(" Test the default value selection in FontColor popup", () => {
        selectNode = editNode.querySelector('.first-label');
        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector('#' + controlId + '_toolbar_FontColor').nextElementSibling.childNodes[0];
        fontColorPicker.click();
        expect((selectNode.childNodes[0] as HTMLElement).style.color === 'rgb(255, 0, 0)').not.toBeNull();
    });
    it(" Test the default value selection in BackgroundColor popup", () => {
        selectNode = editNode.querySelector('.first-p-node');
        setCursorPoint(curDocument, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector('#' + controlId + '_toolbar_BackgroundColor').nextElementSibling.childNodes[0];
        fontColorPicker.click();
        expect((selectNode.childNodes[0] as HTMLElement).style.backgroundColor === 'rgb(255, 255, 0)').not.toBeNull();
    });
});

describe("EJ2-16252: 'FontColor and BackgroundColor' - Default value set", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let controlId: string;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["FontColor", "BackgroundColor"]
            },
            fontColor: {
                default: '#823b0b'
            },
            backgroundColor: {
                default: '#006666'
            },
            value: `<p>First p node-0</p><p>First p node-1</p>

            <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>
                    
            <p class='second-p-node'><label class='second-label'>label node</label></p>
            <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`
        });
        rteEle = rteObj.element;
        controlId = rteEle.id;
    });

    afterAll(() => {
        destroy(rteObj);
    });

    it(" Test the default value selection in FontColor popup", () => {
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector('#' + controlId + '_toolbar_FontColor').nextElementSibling.childNodes[0];
        let buttonEle: HTMLElement = (fontColorPicker.childNodes[0].childNodes[0] as HTMLElement);
        expect(buttonEle.style.backgroundColor === 'rgb(130, 59, 11)').not.toBeNull();
    });

    it(" Test the default value selection in BackgroundColor popup", () => {
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector('#' + controlId + '_toolbar_BackgroundColor').nextElementSibling.childNodes[0];
        let buttonEle: HTMLElement = (fontColorPicker.childNodes[0].childNodes[0] as HTMLElement);
        expect(buttonEle.style.backgroundColor === 'rgb(0, 102, 102)').not.toBeNull();
    });

    describe('854808 - Not able to open the Font and Background popup while pressing enter key ', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["FontColor", "BackgroundColor"]
                },
            });
        });

        it('The font dropdown is open when you click the enter key.', () => {
            rteObj.focusIn();
            (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as any).focus();
            keyBoardEvent.ctrlKey = false;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.target = rteObj.element.querySelector(".e-toolbar-item .e-rte-font-colorpicker");
            (rteObj.toolbarModule as any).toolBarKeyDown(keyBoardEvent);
            rteObj.dataBind();
            expect(document.querySelector(".e-popup-open .e-color-palette") != null).toBe(true);
        });

        it('The background dropdown is open when you click the enter key.', () => {
            rteObj.focusIn();
            (rteObj.element.querySelectorAll(".e-toolbar-item")[1] as any).focus();
            keyBoardEvent.ctrlKey = false;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.target = rteObj.element.querySelector(".e-toolbar-item .e-rte-background-colorpicker");
            (rteObj.toolbarModule as any).toolBarKeyDown(keyBoardEvent);
            rteObj.dataBind();
            expect(document.querySelector(".e-popup-open .e-color-palette") != null).toBe(true);
        });
        afterAll(() => {
            destroy(rteObj);
        });
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

describe('1032508: Mobile: Applying Background Color to Table Cell via Quick Toolbar causes page unresponsive', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
    let defaultUA: string = navigator.userAgent;

    beforeAll(() => {
        defaultUA = navigator.userAgent;
        Browser.userAgent = mobileUA;
        rteObj = renderRTE({
            quickToolbarSettings: {
                table: [ 'BackgroundColor']
            },
            value: `<table border="1" cellpadding="0" cellspacing="0" valign="top" title="" summary="" style="direction: ltr; border-style: solid; border-width: 1pt;" class="e-rte-paste-table">\n <tbody><tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Task</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7763in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Status</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/944774">Bug\n  944774</a>: MAC - Table Quick Toolbar Fails to Open After Selecting Two Cells</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7763in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Done</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/945054">Bug\n  945054</a>: MAC - Format Painter Pastes the content with formatting.</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7763in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Done</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/945123">Bug\n  945123</a>: Table cell background color fails to apply.</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.8458in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">In Progress</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6208in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/945130">Bug\n  945130</a>: MAC - Uppercase and Lowercase Formats Applied Properly, but\n  Selection Partially Cleared</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7569in; padding: 4pt;" class="">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Validated</p>\n  </td>\n </tr>\n</tbody></table>`
        });
        rteEle = rteObj.element;
    });

    afterAll(() => {
        destroy(rteObj);
        Browser.userAgent = defaultUA;
    });

    it('Should editor works properly after Applying Background Color to Table Cell via Quick Toolbar', (done) => {
        rteObj.focusIn();
        setCursorPoint(document, rteObj.contentModule.getEditPanel().querySelector('td').firstChild as HTMLElement, 0);
        const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
        rteObj.inputElement.dispatchEvent(mouseDownEvent);
        rteObj.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseDownEvent);
        const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
        rteObj.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
        setTimeout(() => {
            const colorDropDown: HTMLElement = document.querySelector('.e-popup-open .e-rte-background-colorpicker .e-split-colorpicker .e-selected-color');
            colorDropDown.click();
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('td').style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(rteObj.contentModule.getDocument().querySelector('.e-colorpicker.e-modal')).toBe(null);
                done();
            }, 100);
        }, 200);
    });
});