/**
 * RTE - Color-picker action spec
 */
import { Browser } from "@syncfusion/ej2-base";
import { RichTextEditor } from './../../../src/index';
import { renderRTE, destroy, dispatchKeyEvent, dispatchEvent } from "./../render.spec";

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