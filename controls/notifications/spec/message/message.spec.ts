import { Message } from "../../src/index";
import { Browser, createElement, isNullOrUndefined as isNOU, L10n } from "@syncfusion/ej2-base";

let msgObj: Message;
let ele: HTMLElement;
let i: number; let j: number; let k: number;

describe("Message control", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'msg' });
        ele.innerText = "Hello message";
        document.body.appendChild(ele);
        msgObj = new Message();
        msgObj.appendTo('#msg');
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    it("With base class", () => {
        expect(document.getElementById('msg').classList.contains('e-control')).toEqual(true);
        expect(document.getElementById('msg').classList.contains('e-message')).toEqual(true);
        expect(document.getElementById('msg').firstElementChild.classList.contains('e-msg-icon')).toEqual(true);
        expect(document.getElementById('msg').children[1].classList.contains('e-msg-content')).toEqual(true);
        expect((document.getElementById('msg').children[1] as HTMLElement).innerText).toEqual("Hello message");
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(false);
        expect(document.getElementById('msg').getAttribute('role')).toEqual("alert");
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
});

describe("Methods Testing", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'msg' });
        document.body.appendChild(ele);
        msgObj = new Message({cssClass: "custom multiple"});
        msgObj.appendTo('#msg');
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
    it("get module name", () => {
        expect(msgObj.getModuleName()).toBe('message');
    });
    it("persistance testing", () => {
        expect(msgObj.getPersistData()).toBe("{}");
    })
    it("destroy", () => {
        msgObj.destroy();
        expect(msgObj.element.childElementCount).toBe(0);
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(false);
        expect(msgObj.element.classList.contains('e-filled')).toEqual(false);
        expect(msgObj.element.classList.contains('e-success')).toEqual(false);
        expect(msgObj.element.classList.contains('e-warning')).toEqual(false);
        expect(msgObj.element.classList.contains('e-error')).toEqual(false);
        expect(msgObj.element.classList.contains('e-info')).toEqual(false);
        expect(msgObj.element.classList.contains('e-show')).toEqual(false);
        expect(msgObj.element.classList.contains('e-filled')).toEqual(false);
        expect(msgObj.element.classList.contains('custom')).toEqual(false);
        expect(msgObj.element.classList.contains('multiple')).toEqual(false);
    })
});

describe("Property Testing", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'msg' });
        document.body.appendChild(ele);
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
    it("cssClass", () => {
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        expect(msgObj.cssClass).toBe('');
        msgObj.destroy();
        msgObj = new Message({ cssClass: null });
        msgObj.appendTo('#msg');
        expect(msgObj.cssClass).toBe(null);
        msgObj.destroy();
        msgObj = new Message({ cssClass: 'custom' });
        msgObj.appendTo('#msg');
        expect(msgObj.cssClass).toBe('custom');
        expect(msgObj.element.classList.contains('custom')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ cssClass: 'custom multiple-class' });
        msgObj.appendTo('#msg');
        expect(msgObj.cssClass).toBe('custom multiple-class');
        expect(msgObj.element.classList.contains('custom')).toEqual(true);
        expect(msgObj.element.classList.contains('multiple-class')).toEqual(true);
        msgObj.destroy();
    });
    it('RTL', () => {
        msgObj = new Message({ enableRtl: true });
        msgObj.appendTo('#msg');
        expect(msgObj.enableRtl).toBe(true);
        expect(msgObj.element.classList.contains('e-rtl')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ enableRtl: false });
        msgObj.appendTo('#msg');
        expect(msgObj.enableRtl).toBe(false);
        expect(msgObj.element.classList.contains('e-rtl')).toEqual(false);
        msgObj.destroy();
    })
    it('severity', () => {
        msgObj = new Message({ severity: 'Warning' });
        msgObj.appendTo('#msg');
        expect(msgObj.severity).toBe('Warning');
        expect(msgObj.element.classList.contains('e-warning')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ severity: 'Success' });
        msgObj.appendTo('#msg');
        expect(msgObj.severity).toBe('Success');
        expect(msgObj.element.classList.contains('e-success')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ severity: 'Info' });
        msgObj.appendTo('#msg');
        expect(msgObj.severity).toBe('Info');
        expect(msgObj.element.classList.contains('e-info')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ severity: 'Error' });
        msgObj.appendTo('#msg');
        expect(msgObj.severity).toBe('Error');
        expect(msgObj.element.classList.contains('e-error')).toEqual(true);
        msgObj.destroy();
    })
    it('variant', () => {
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        expect(msgObj.variant).toBe('Text');
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(false);
        expect(msgObj.element.classList.contains('e-filled')).toEqual(false);
        msgObj.destroy();
        msgObj = new Message({ variant: "Outlined" });
        msgObj.appendTo('#msg');
        expect(msgObj.variant).toBe('Outlined');
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ variant: "Filled" });
        msgObj.appendTo('#msg');
        expect(msgObj.variant).toBe('Filled');
        expect(msgObj.element.classList.contains('e-filled')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ variant: 'Text' });
        msgObj.appendTo('#msg');
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(false);
        expect(msgObj.element.classList.contains('e-filled')).toEqual(false);
        msgObj.destroy();
    })
    it('show icon', () => {
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        expect(msgObj.showIcon).toBe(true);
        expect(document.getElementById('msg').firstElementChild.classList.contains('e-msg-icon')).toEqual(true);
        msgObj.destroy();
        msgObj = new Message({ showIcon: false });
        msgObj.appendTo('#msg');
        expect(msgObj.showIcon).toBe(false);
        expect(document.getElementById('msg').firstElementChild.classList.contains('e-msg-icon')).toEqual(false);
        msgObj.destroy();
    })
    it('show close icon', () => {
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        expect(msgObj.showCloseIcon).toBe(false);
        expect(isNOU(document.getElementById('msg').children[2])).toBe(true);
        msgObj.destroy();
        msgObj = new Message({ showCloseIcon: true });
        msgObj.appendTo('#msg');
        expect(msgObj.showIcon).toBe(true);
        expect(document.getElementById('msg').children[2].classList.contains('e-msg-close-icon')).toEqual(true);
        expect(document.getElementById('msg').children[2].getAttribute('title')).toEqual('Close');
        expect(document.getElementById('msg').children[2].getAttribute('aria-label')).toEqual('Close');
        (<HTMLElement>msgObj.element.children[2]).click();
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(true);
        expect(msgObj.visible).toBe(false);
        msgObj.destroy();
    })
    it('visible', () => {
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        expect(msgObj.visible).toBe(true);
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(false);
        msgObj.destroy();
        msgObj = new Message({ visible: false });
        msgObj.appendTo('#msg');
        expect(msgObj.visible).toBe(false);
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(true);
        msgObj.destroy();
    })
    it('content', () => {
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        expect(msgObj.content).toBe(null);
        expect(document.getElementById('msg').children[1].classList.contains('e-msg-content')).toEqual(true);
        expect(document.getElementById('msg').children[1].innerHTML).toBe('');
        msgObj.destroy();
        msgObj = new Message({ content: 'Message component rendered' });
        msgObj.appendTo('#msg');
        expect(msgObj.content).toBe('Message component rendered');
        expect(document.getElementById('msg').children[1].classList.contains('e-msg-content')).toEqual(true);
        expect(document.getElementById('msg').children[1].innerHTML).toBe('Message component rendered');
        msgObj.destroy();
        msgObj = new Message({ content: '<div>Message component rendered</div>' });
        msgObj.appendTo('#msg');
        expect(msgObj.content).toBe('<div>Message component rendered</div>');
        expect(document.getElementById('msg').children[1].classList.contains('e-msg-content')).toEqual(true);
        expect(document.getElementById('msg').children[1].childElementCount).toBe(1);
        expect(document.getElementById('msg').children[1].innerHTML).toBe('<div>Message component rendered</div>');
        msgObj.destroy();
    })
});

describe("Property change", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'msg' });
        document.body.appendChild(ele);
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        L10n.load({
            'de-DE': {
                'message': {
                    'close': 'schlieen',
                }
            }
        });
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
    it("cssClass", () => {
        expect(msgObj.cssClass).toEqual('');
        msgObj.cssClass = 'e-new-class';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-success')).toEqual(false);
        expect(msgObj.element.classList.contains('e-new-class')).toEqual(true);
        msgObj.cssClass = 'e-multiple-class e-multiple';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-new-class')).toEqual(false);
        expect(msgObj.element.classList.contains('e-multiple-class')).toEqual(true);
        expect(msgObj.element.classList.contains('e-multiple-class')).toEqual(true);
    });
    it('RTL', () => {
        expect(msgObj.element.classList.contains('e-rtl')).toEqual(false);
        msgObj.enableRtl = true;
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-rtl')).toEqual(true);
        msgObj.enableRtl = false;
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-rtl')).toEqual(false);
    })
    it('severity', () => {
        expect(msgObj.severity).toBe('Normal');
        msgObj.severity = 'Warning';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-warning')).toEqual(true);
        msgObj.severity = 'Error';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-warning')).toEqual(false);
        expect(msgObj.element.classList.contains('e-error')).toEqual(true);
        msgObj.severity = 'Info';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-error')).toEqual(false);
        expect(msgObj.element.classList.contains('e-info')).toEqual(true);
        msgObj.severity = 'Success';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-info')).toEqual(false);
        expect(msgObj.element.classList.contains('e-success')).toEqual(true);
        msgObj.severity = 'Normal';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-success')).toEqual(false);
    })
    it('variant', () => {
        expect(msgObj.variant).toBe('Text');
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(false);
        expect(msgObj.element.classList.contains('e-filled')).toEqual(false);
        msgObj.variant = 'Filled';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(false);
        expect(msgObj.element.classList.contains('e-filled')).toEqual(true);
        msgObj.variant = 'Outlined';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(true);
        expect(msgObj.element.classList.contains('e-filled')).toEqual(false);
        msgObj.variant = 'Filled';
        msgObj.dataBind();
        expect(msgObj.element.classList.contains('e-outlined')).toEqual(false);
    })
    it('show icon', () => {
        expect(document.getElementById('msg').firstElementChild.classList.contains('e-msg-icon')).toEqual(true);
        msgObj.showIcon = false;
        msgObj.dataBind();
        expect(document.getElementById('msg').firstElementChild.classList.contains('e-msg-icon')).toEqual(false);
        msgObj.showIcon = true;
        msgObj.dataBind();
        expect(document.getElementById('msg').firstElementChild.classList.contains('e-msg-icon')).toEqual(true);
    })
    it('show close icon', () => {
        expect(isNOU(document.getElementById('msg').children[2])).toBe(true);
        msgObj.showCloseIcon = true;
        msgObj.dataBind();
        expect(document.getElementById('msg').children[2].classList.contains('e-msg-close-icon')).toEqual(true);
        expect(document.getElementById('msg').children[2].getAttribute('title')).toEqual('Close');
        expect(document.getElementById('msg').children[2].getAttribute('aria-label')).toEqual('Close');
        (<HTMLElement>msgObj.element.children[2]).click();
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(true);
        msgObj.showCloseIcon = false;
        msgObj.dataBind();
        expect(isNOU(document.getElementById('msg').children[2])).toBe(true);
        msgObj.destroy();
    })
    it('visible', () => {
        msgObj = new Message({});
        msgObj.appendTo('#msg');
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(false);
        msgObj.visible = false;
        msgObj.dataBind();
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(true);
    })
    it('content', () => {
        expect(msgObj.content).toBe(null);
        expect(document.getElementById('msg').children[1].classList.contains('e-msg-content')).toEqual(true);
        expect(document.getElementById('msg').children[1].innerHTML).toBe('');
        msgObj.content = 'Message component rendered';
        msgObj.dataBind();
        expect(msgObj.content).toBe('Message component rendered');
        expect(document.getElementById('msg').children[1].classList.contains('e-msg-content')).toEqual(true);
        expect(document.getElementById('msg').children[1].innerHTML).toBe('Message component rendered');
        msgObj.content = '<div>Message component rendered</div>';
        msgObj.dataBind();
        expect(msgObj.content).toBe('<div>Message component rendered</div>');
        expect(document.getElementById('msg').children[1].classList.contains('e-msg-content')).toEqual(true);
        expect(document.getElementById('msg').children[1].childElementCount).toBe(1);
        expect(document.getElementById('msg').children[1].innerHTML).toBe('<div>Message component rendered</div>');
    })
    it('locale', () => {
        msgObj.showCloseIcon = true;
        msgObj.dataBind();
        expect((document.getElementById('msg').children[2]).getAttribute('title')).toEqual("Close");
        msgObj.locale = 'de-DE';
        msgObj.dataBind();
        expect((document.getElementById('msg').children[2]).getAttribute('title')).toEqual("schlieen");
    })
});

describe("Keyboard navigation testing", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'msg' });
        document.body.appendChild(ele);
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
    it("enter key", () => {
        msgObj = new Message({ content:"Message component rendered", showCloseIcon: true });
        msgObj.appendTo('#msg');
        (msgObj as any).keyboardHandler({
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            code: 'Enter',
            keyCode: 13
        });
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(true);
        expect(msgObj.visible).toBe(false);
        msgObj.destroy();
    });
    it("space key", () => {
        msgObj = new Message({ content:"Message component rendered", showCloseIcon: true });
        msgObj.appendTo('#msg');
        (msgObj as any).keyboardHandler({
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            code: 'Space',
            keyCode: 32
        });
        expect(document.getElementById('msg').classList.contains('e-hidden')).toEqual(true);
        expect(msgObj.visible).toBe(false);
    });
});

describe("Events Testing", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'msg' });
        document.body.appendChild(ele);
        
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
        i = 0, j = 0; k=0;
        function created(): void {
            i++;
        }
        function closed(): void {
            j++;
        }
        function destroyed(): void {
            k++;
        }
        msgObj = new Message({ created: created, closed: closed, destroyed: destroyed, showCloseIcon: true });
        msgObj.appendTo('#msg');
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
    it("created event", () => {
        expect(i).toEqual(1);
    });
    it("closed event", () => {
        (<HTMLElement>msgObj.element.children[2]).click();
        expect(j).toEqual(1);
        msgObj.destroy();
        msgObj = new Message({closed: () => {
            j++;
        }});
        msgObj.appendTo('#msg');
        msgObj.visible = false;
        msgObj.dataBind();
        expect(j).toEqual(2);
    });
    it('destroyed event', () => {
        msgObj.destroy();
        expect(k).toEqual(1);
    })
});
