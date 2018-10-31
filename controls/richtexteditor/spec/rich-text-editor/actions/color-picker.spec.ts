/**
 * RTE - Color-picker action spec
 */
import { Browser } from "@syncfusion/ej2-base";
import { RichTextEditor, Toolbar, HtmlEditor } from './../../../src/index';
import { detach } from '@syncfusion/ej2-base';
import { renderRTE, destroy } from "./../render.spec";
RichTextEditor.Inject(Toolbar, HtmlEditor);

describe("'FontColor and BackgroundColor' - ColorPicker render testing", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let mouseEventArgs: any;

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

});

function setCursorPoint(curDocument: Document, element: Element, point: number) {
    let range: Range = curDocument.createRange();
    let sel: Selection = curDocument.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

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
        let fontColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: fontColorPickerItem
        };
        (rteObj.htmlEditorModule as any).colorPickerModule.fontColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.color === 'rgb(28, 188, 81)')
    });
    afterAll(() => {
        destroy(rteObj);
        detach(rteEle);
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
        let backgroundColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: backgroundColorPickerItem
        };
        (rteObj.htmlEditorModule as any).colorPickerModule.backgroundColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.backgroundColor === 'rgb(255, 255, 0)');
        backgroundColorPicker.click();
    });
    afterAll(() => {
        destroy(rteObj);
        detach(rteEle);
    });
});

describe("'FontColor and BackgroundColor' - ColorPicker render testing using mobileUA", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let mouseEventArgs: any;

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
        Browser.userAgent = defaultUA;
        destroy(rteObj);
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
                items: ["FontColor", "BackgroundColor", 'FontName', 'Bold']
            },
            readonly: true
        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
        rteObj.contentModule.getEditPanel().innerHTML = innerHTML;
        curDocument = rteObj.contentModule.getDocument();
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
        detach(rteEle);
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
        let fontColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: fontColorPickerItem
        };
        (rteObj.htmlEditorModule as any).colorPickerModule.fontColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.color === 'rgb(28, 188, 81)')
    });
    afterAll(() => {
        destroy(rteObj);
        detach(rteEle);
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
        let backgroundColorPickerItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-primary.e-apply")[0];
        mouseEventArgs = {
            target: backgroundColorPickerItem
        };
        (rteObj.htmlEditorModule as any).colorPickerModule.backgroundColorPicker.btnClickHandler(mouseEventArgs);
        selectNode = editNode.querySelector('.first-p-node');
        expect((selectNode.childNodes[0] as HTMLElement).style.backgroundColor === 'rgb(255, 255, 0)');
    });
    afterAll(() => {
        destroy(rteObj);
        detach(rteEle);
    });
});

describe("'FontColor and BackgroundColor' - ColorPicker DROPDOWN", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let mouseEventArgs: any;
    let editNode: Element;
    let selectNode: Element;

    beforeAll(() => {
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
            <ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>`
        });
        rteEle = rteObj.element;
        editNode = rteObj.contentModule.getEditPanel();
    });

    afterAll(() => {
        destroy(rteObj);
    });

    it("Color Picker initial rendering testing", () => {
        expect(rteObj.toolbarSettings.items[0]).toBe("FontColor");
        expect(rteObj.toolbarSettings.items[1]).toBe("BackgroundColor");
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn .e-icons.e-icon-right")[1];
        backgroundColorPicker.click();
        (document.querySelector(".e-rte-backgroundcolor-colorpicker") as HTMLElement).click();
        (document.querySelector(".e-rte-backgroundcolor-colorpicker").querySelector(".e-cancel") as HTMLElement).click();
        (document.querySelectorAll(".e-mode-switch-btn")[1] as HTMLElement).click();
    });
    it("Color Picker initial rendering testing - 1", () => {
        selectNode = editNode.querySelector('.first-p-node');
        setCursorPoint(document, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector(".e-rte-backgroundcolor-dropdown");
        backgroundColorPicker.click();
        (backgroundColorPicker.querySelector(".e-background-color") as HTMLElement).click();
        expect(selectNode.childNodes[0].nodeName.toLocaleLowerCase()).toBe("span");
    });
    it("Color Picker initial rendering testing - 2", () => {
        selectNode = editNode.querySelector('.first-label');
        setCursorPoint(document, selectNode.childNodes[0] as Element, 1);
        rteObj.notify('selection-save', {});
        let backgroundColorPicker: HTMLElement = <HTMLElement>rteEle.querySelector(".e-background-color.e-rte-elements");
        backgroundColorPicker.innerText = "ABC";
        backgroundColorPicker.click();
        expect(selectNode.childNodes[0].nodeName.toLocaleLowerCase()).toBe("span");
    });
});

describe("EJ2-16252: 'FontColor and BackgroundColor' - selection state", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let mouseEventArgs: any;
    let editNode: Element;
    let selectNode: Element;
    let id: string;
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
        editNode = rteObj.contentModule.getEditPanel();
        id = rteEle.id;
    });

    afterAll(() => {
        destroy(rteObj);
    });

    it(" Test the default value selection in FontColor popup", () => {
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn .e-icons.e-icon-right")[0];
        fontColorPicker.click();
        let colorPickerPopup: HTMLElement = document.getElementById(id + "_toolbar_FontColor-popup");
        let selectPalette: HTMLElement = colorPickerPopup.querySelector('.e-selected');
        expect(selectPalette).not.toBeNull();
        expect(selectPalette.style.backgroundColor === 'rgb(255, 0, 0)').not.toBeNull();
    });
    it(" Test the default value selection in BackgroundColor popup", () => {
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn .e-icons.e-icon-right")[1];
        fontColorPicker.click();
        let colorPickerPopup: HTMLElement = document.getElementById(id + "_toolbar_BackgroundColor-popup");
        let selectPalette: HTMLElement = colorPickerPopup.querySelector('.e-selected');
        expect(selectPalette).not.toBeNull();
        expect(selectPalette.style.backgroundColor === 'rgb(255, 255, 0)').not.toBeNull();
    });
});

describe("EJ2-16252: 'FontColor and BackgroundColor' - Default value set", () => {
    let rteEle: HTMLElement;
    let rteObj: any;
    let mouseEventArgs: any;
    let editNode: Element;
    let selectNode: Element;
    let id: string;
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
        editNode = rteObj.contentModule.getEditPanel();
        id = rteEle.id;
    });

    afterAll(() => {
        destroy(rteObj);
    });

    it(" Test the default value selection in FontColor popup", () => {
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn .e-icons.e-icon-right")[0];
        fontColorPicker.click();
        let colorPickerPopup: HTMLElement = document.getElementById(id + "_toolbar_FontColor-popup");
        let selectPalette: HTMLElement = colorPickerPopup.querySelector('.e-selected');
        expect(selectPalette).not.toBeNull();
        expect(selectPalette.style.backgroundColor === 'rgb(130, 59, 11)').not.toBeNull();
    });

    it(" Test the default value selection in BackgroundColor popup", () => {
        rteObj.notify('selection-save', {});
        let fontColorPicker: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn .e-icons.e-icon-right")[1];
        fontColorPicker.click();
        let colorPickerPopup: HTMLElement = document.getElementById(id + "_toolbar_BackgroundColor-popup");
        let selectPalette: HTMLElement = colorPickerPopup.querySelector('.e-selected');
        expect(selectPalette).not.toBeNull();
        expect(selectPalette.style.backgroundColor === 'rgb(0, 102, 102)').not.toBeNull();
    });
});
