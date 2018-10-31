/**
 * dialog spec document
 */
import { createElement, addClass, EmitType } from '@syncfusion/ej2-base'
import { Dialog, DialogUtility } from '../../src/dialog/dialog';
import '../../node_modules/es6-promise/dist/es6-promise';
import { EventHandler, L10n } from '@syncfusion/ej2-base';
import { Touch, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';

function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}

function setMouseCoordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}

export function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

// utility dialog spec
describe('create alert utility dialog with button click as typeof function', () => {
    beforeAll(() => {
        DialogUtility.alert({
            okButton: {click: function(event: Event) {
                // your code here!
            } }
         });
});
it('alert utility dialog footer button click',() => {
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    expect(document.getElementsByClassName('e-btn')[0].textContent == 'OK').toBe(true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// utility dialog specification
describe('create alert utility dialog with modal', () => {
    beforeAll(() => {
        DialogUtility.alert({
            isModal: true,
            okButton: {text: 'new button'}
         });
});
it('alert utility dialog to test modal behavior and destroy functionality',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    expect(document.getElementsByClassName('e-btn')[0].textContent == 'new button').toBe(true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// utility dialog without modal
describe('default alert utility dialog without modal', () => {
    beforeAll(() => {
        DialogUtility.alert({
            isModal: false
         });
});
it('to test alert dialog with modal and default button interaction ',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    expect(document.getElementsByClassName('e-btn')[0].textContent == 'OK').toBe(true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// utility dialog without modal
describe('alert utility dialog with closeICon and custom footer button', () => {
    beforeAll(() => {
        DialogUtility.alert({
            isModal: false,
            showCloseIcon: true,
            okButton: {text: 'Ok btn', click: footerbtnClick}
         });
         function footerbtnClick(){
             // your code here
        };
});
it('alert dialog should remove from DOM',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
    expect(isNullOrUndefined(document.getElementsByClassName('e-btn')[0])).toBe(false);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// confirm
// utility dialog without modal
describe('create confirm utility dialog without modal', () => {
    beforeAll(() => {
        DialogUtility.confirm({
            isModal: false
         });
});
it('non-modal dialog with default button functionalities',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// utility dialog without modal and default button actions
describe('confirm utility dialog without modal and default button actions', () => {
    beforeAll(() => {
        DialogUtility.confirm({
            isModal: false,
            showCloseIcon: false,
            okButton: {text: 'Ok btn', click: footerbtnClick},
            cancelButton: {text: 'cancel button', click: function() {
                // test dialog
            }}
         });
         function footerbtnClick(){
             // your code here
        };
});
it('close event will trigger on closeicon click',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
    (<HTMLElement>document.getElementsByClassName('e-btn')[1]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// utility dialog without modal
describe('create alert utility dialog', () => {
    beforeAll(() => {
        DialogUtility.confirm({
            isModal: false,
            showCloseIcon: true,
            okButton: {text: 'Ok btn', click: footerbtnClick},
            cancelButton: {text: 'cancel button', click: function() {
                // test dialog
            }}
         });
         function footerbtnClick(){
             // your code here
        };
});
it('close event will trigger on clik closeicon',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
    (<HTMLElement>document.getElementsByClassName('e-btn')[1]).dispatchEvent(clickEvent);
    (<HTMLElement>document.getElementsByClassName('e-btn')[2]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});


// utility dialog without modal
describe('create alert utility dialog', () => {
    beforeAll(() => {
        DialogUtility.confirm({
            isModal: true,
            showCloseIcon: true,
            okButton: {text: 'Ok btn', click: footerbtnClick},
            cancelButton: {text: 'cancel button'}
         });
         function footerbtnClick(){
             // your code here
        };
});
it('close event will trigger on clik closeicon',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[2]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// utility dialog without modal
describe('create alert utility dialog', () => {
    beforeAll(() => {
        DialogUtility.confirm({
            isModal: false,
            showCloseIcon: true,
            okButton: {text: 'Ok btn', click: footerbtnClick},
            cancelButton: {text: 'cancel button'}
         });
         function footerbtnClick(){
             // your code here
        };
});
it('close event will trigger on clik closeicon',()=>{
    let clickEvent: any = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", false, true);
    (<HTMLElement>document.getElementsByClassName('e-btn')[2]).dispatchEvent(clickEvent);
})
afterAll(() => {
    document.body.innerHTML = '';
});
});

// default rendering confirm dialog
describe('create confirm utility dialog', () => {
    beforeAll(() => {
        DialogUtility.confirm({});
    });
    it('Dialog utility confirm dialog default rendering', () => {
        expect(document.getElementsByClassName('e-confirm-dialog')[0].classList.contains('e-confirm-dialog')).toBe(true);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
});
// alert utility dialog with options
describe('create alert utility dialog', () => {
    beforeAll(() => {
        DialogUtility.alert({
        title: 'dialog Header!',
        showCloseIcon: false,
        isModal: true,
        content: "dialog content Updated!!!",
        okButton: { text: 'Okbtn' }});
    });
    it('alert utility dialog with api default rendering', () => {
        expect(document.getElementsByClassName('e-alert-dialog')[0].classList.contains('e-popup-open')).toBe(false);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
});

// create confirm dialog utility with options
describe('create alert utility dialog', () => {
    beforeAll(() => {
        DialogUtility.confirm({
        title: 'dialog Header!',
        showCloseIcon: false,
        isModal: true,
        content: "dialog content Updated!!!",
        okButton: { text: 'Okbtn' },
        cancelButton: {text: 'cancel btn'}
    });
    });
    it('alert utility dialog with api default rendering', () => {
        expect(document.getElementsByClassName('e-confirm-dialog')[0].classList.contains('e-popup-close')).toBe(true);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
});

describe('closeOnEscape property', () => {
    let events: any;
    let ele: HTMLElement = createElement('div', { id: 'dialog1' });
    document.body.appendChild(ele);
    let eventArgs: any;
    beforeAll(() => {
        events = new Dialog({header:'Demo', content:'First demo content', animationSettings: { effect: 'None' }, closeOnEscape: true });
        events.appendTo(ele);
        spyOn(events, 'hide');
    });
    /**
     * Escape key press
     */
    it('Any other key press- testing ', () => {
        eventArgs = { keyCode: 0, altKey: false, ctrlKey: false, shiftKey: false };
        events.keyDown(eventArgs);
        expect(document.getElementById("dialog1").classList.contains('e-popup-open')).toEqual(true);
        events.destroy()
        document.body.innerHTML = '';
    });
});

describe('closeOnEscape property', () => {
    let events: any;
    let ele: HTMLElement = createElement('div', { id: 'dialog2' });
    document.body.appendChild(ele);
    let eventArgs: any;
    beforeAll(() => {
        events = new Dialog({header:'Demo', zIndex: 1200, content:'First demo content', animationSettings: { effect: 'None' }, closeOnEscape: true });
        // spyOn(events, 'hide');
        events.appendTo(ele);
    });

    it('Esc key press to hide testing ', () => {
        eventArgs = { keyCode: 27, altKey: false, ctrlKey: false, shiftKey: false };
        events.keyDown(eventArgs);
        expect(document.getElementById("dialog2").classList.contains('e-popup-close')).toEqual(true);
        events.destroy()
        document.body.innerHTML = '';
    });
});


describe('Dialog Control', () => {
    describe('Dom Dialog element', () => {
        let dialog: Dialog;
        beforeEach((): void => {
            dialog = undefined;
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (dialog) {
                dialog.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Control class testing', () => {
            dialog = new Dialog({ header: 'Dialog' });
            dialog.appendTo('#dialog');
            expect(document.getElementById('dialog').classList.contains('e-dialog')).toEqual(true);
        });

        it('Empty options testing', () => {
            window.localStorage.setItem('dialogdialog', '');
            dialog = new Dialog({ enablePersistence: true });
            expect(dialog.element).toEqual(undefined);
            dialog.appendTo('#dialog');
            expect(document.getElementById('dialog').classList.contains('e-dialog')).toEqual(true);
        });
        it("Destroy Method testing", () => {
            function buttonClick() {
            }
            dialog = new Dialog({ header: "Dialog", buttons: [{ buttonModel: { content: "Ok" }, click: buttonClick },{ buttonModel: { content: "Cancel" }, click: buttonClick }], content: "Your information is updated successfully" }, '#dialog');
            dialog.destroy();
            expect(document.getElementById("dialog").classList.contains("e-dialog")).toEqual(false);
            dialog.show();
            expect(document.getElementById("dialog").classList.contains("e-popup-open")).toEqual(false);
            dialog.hide();
            expect(document.getElementById("dialog").classList.contains("e-popup-close")).toEqual(false);
        })
        it("Show Method and visible: propery value testing", () => {
            dialog = new Dialog({ animationSettings: { effect: 'None', duration: 0, delay: 0 }, header: "Dialog", visible: false, content: "Your information is updated successfully" }, '#dialog');
            dialog.show();
            expect(document.getElementById("dialog").classList.contains('e-popup-open')).toEqual(true);
            expect(dialog.visible).toEqual(true);
        })

        it("Modal dialog Show Method testing", () => {
            dialog = new Dialog({ target: document.body, isModal: true, animationSettings: { effect: 'None', duration: 0, delay: 0 }, header: "Dialog", visible: false, content: "Your information is updated successfully" }, '#dialog');
            dialog.show();
            dialog.refreshPosition();
            expect(document.getElementById("dialog").classList.contains('e-popup-open')).toEqual(true);
        })

        it("Full screen:true/false Method Testing", () => {
            dialog = new Dialog({ header: "Dialog", width: "200px", animationSettings: { effect: 'None' }, content: "Your information is updated successfully" }, '#dialog');
            dialog.show(true);
            expect(document.getElementById('dialog').classList.contains("e-dlg-fullscreen")).toEqual(true);
            dialog.show(false);
            expect(document.getElementById('dialog').classList.contains("e-dlg-fullscreen")).toEqual(false);
        })

        it("Full screen:true/false method testing with allowDragging true", () => {
            dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, allowDragging: true, width: "200px", content: "Your information is updated successfully" }, '#dialog');
            dialog.show(true);
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(false);
            dialog.show(false);
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
        })

        it("visible property:true testing", () => {
            dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: "Your information is updated successfully" }, '#dialog');
            expect(document.getElementById("dialog").classList.contains('e-popup-open')).toEqual(true);
        })

        it('cssClass testing', () => {
            dialog = new Dialog({ header: "Dialog", cssClass: "class1 class2" }, '#dialog');
            expect(document.getElementById('dialog').classList.contains('class1')).toEqual(true);
            expect(document.getElementById('dialog').classList.contains('class2')).toEqual(true);
        })

        it('showCloseIcon testing', () => {
            dialog = new Dialog({ header: "Dialog", showCloseIcon: true }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        })

        it('showCloseIcon without header testing', () => {
            dialog = new Dialog({ showCloseIcon: true }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        })

        it('showCloseIcon with header given as Template testing', () => {
            let headerTemplateContent = "<div>Template content</div>";
            dialog = new Dialog({ showCloseIcon: true, header: headerTemplateContent }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        })

        it('showCloseIcon with header given as Template notify property testing', () => {
            let headerTemplateContent = "<div>Template content</div>";
            dialog = new Dialog({ header: headerTemplateContent }, '#dialog');
            dialog.showCloseIcon = true;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        });

        it('header given as Template notify property with showCloseIcon testing', () => {
            let headerTemplateContent = "<div>Template content</div>";
            dialog = new Dialog({ showCloseIcon: true }, '#dialog');
            dialog.header = headerTemplateContent;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-header').length).toBe(1);
        });

        it('showCloseIcon notify property changes testing if header and content is given to empty', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl11' });
            document.body.appendChild(ele);
            dialog = new Dialog({ showCloseIcon: false }, '#dialogCtrl11');
            let element: HTMLElement = document.getElementById('dialogCtrl11');
            dialog.header = '';
            dialog.content = null;
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl11').querySelectorAll(".e-dlg-header").length).toBe(0);
            expect(document.getElementById('dialogCtrl11').querySelectorAll(".e-dlg-content").length).toBe(0);
            dialog.showCloseIcon = true;
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl11').querySelectorAll(".e-icon-dlg-close").length).toBe(1);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('getZindexPartial testing', () => {
            let wrapper: HTMLElement = createElement('div', { id: 'wrapper' });
            wrapper.style.zIndex = "10000";
            wrapper.style.position = "absolute";
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl12' });
            wrapper.appendChild(ele);
            document.body.appendChild(wrapper);
            dialog = new Dialog({ showCloseIcon: false }, '#dialogCtrl12');
            let element: HTMLElement = document.getElementById('dialogCtrl12');
            dialog.header = 'Dialog header';
            expect(document.getElementById('dialogCtrl12').style.zIndex).toEqual("10001");
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('Width and Height- property testing', () => {
            dialog = new Dialog({ header: "Dialog", width: "250px", height: "250px" }, '#dialog');
            expect(document.getElementById("dialog").style.width).toEqual("250px");
            expect(document.getElementById("dialog").style.height).toEqual("250px");
        });

        it('Height and width property declared as % testing', () => {
            dialog = new Dialog({ header: "Dialog", width: "30%", height: "10%" }, '#dialog');
            expect(document.getElementById("dialog").style.height).toEqual("10%");
        });

        it('Height and width property declared as integer testing', () => {
            dialog = new Dialog({ header: "Dialog", width: 250, height: 200 }, '#dialog');
            expect(document.getElementById("dialog").style.height).toEqual("200px");
        });

        it('header property and aria attribute testing', () => {
            dialog = new Dialog({ header: "Dialog" }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-header").length).toBe(1);
            expect(document.getElementById('dialog').getAttribute('aria-modal')).toEqual('false');
            expect(document.getElementById('dialog').getAttribute('aria-labelledby')).toEqual('dialog_title');
        });

        it('position property offset value for x and y testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: 100, Y: 200 } }, '#dialog');
            expect((dialog.element as HTMLElement).style.left).toBe('100px');
            expect((dialog.element as HTMLElement).style.top).toBe('200px');
        });

        it('dynamic change on position property value testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: 100, Y: 200 } }, '#dialog');
            expect((dialog.element as HTMLElement).style.left).toBe('100px');
            expect((dialog.element as HTMLElement).style.top).toBe('200px');
            dialog.position = { X: 200, Y: 400 };
            dialog.dataBind();
        });

        it('dynamic change on position property value testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: 100, Y: 200 } }, '#dialog');
            expect((dialog.element as HTMLElement).style.left).toBe('100px');
            expect((dialog.element as HTMLElement).style.top).toBe('200px');
            dialog.position = { X: 100, Y: 400 };
            dialog.dataBind();
            expect((dialog.element as HTMLElement).style.left).toBe('100px');
        });

        it('dialog header given as Template testing', () => {
            let headerTemplateContent = "<div>Template content</div>";
            dialog = new Dialog({ content: "Your information is updated successfully", header: headerTemplateContent }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-header').length).toBe(1);
        });
        it('dialog footertemplate testing', () => {
            let footerTemplateContent = "<div>Footer Template content</div>";
            dialog = new Dialog({ content: "Your information is updated successfully", footerTemplate: footerTemplateContent }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content').length).toBe(1);
            dialog.footerTemplate = '';
            dialog.dataBind();            
            expect(isNullOrUndefined(document.getElementById('dialog').querySelector('.e-footer-content'))).toBe(true);
            dialog.footerTemplate = null;
            dialog.dataBind();            
            expect(isNullOrUndefined(document.getElementById('dialog').querySelector('.e-footer-content'))).toBe(true);
        });

        it('header given by initially testing', () => {
            dialog = new Dialog({ header: "Dialog" }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-header").length).toBe(1);
        });

        it('header given at notify property change testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl13' });
            document.body.appendChild(ele);
            dialog = new Dialog({}, '#dialogCtrl13');
            let element: HTMLElement = document.getElementById('dialogCtrl13');
            dialog.header = 'New Dialog';
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl13').querySelectorAll(".e-dlg-header").length).toBe(1);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('dialog content testing', () => {
            dialog = new Dialog({ header: "Dialog", content: "Your information is updated successfully" }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-content').length).toBe(1);
        });
        it('dialog content as element testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-content').length).toBe(1);
        });

        it('dialog content declared as null testing', () => {
            dialog = new Dialog({ header: "Dialog", content: null }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-content').length).toBe(1);
        });

        it('dialog allowdragging testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, allowDragging: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
        });

        it('dialog allowdragging without header testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ content: dlgcontent, allowDragging: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(false);
        });
        
        it('allowdragging:false notify property with modal dialog and aria attribute testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ content: dlgcontent, height: '200px',
            width: '300px',
            header: 'Dialog Header',
            isModal: true,
            visible : true,
            allowDragging: false });
            dialog.appendTo('#dialog');
            expect(document.getElementById('dialog').getAttribute('aria-modal')).toEqual('true');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(false);
            expect(parseInt(dialog.element.style.zIndex)).toBe(parseInt(dialog.element.parentElement.style.zIndex) + 1);
            expect(parseInt(dialog.element.style.zIndex) - 1).toBe(parseInt((dialog.element.nextSibling as HTMLElement).style.zIndex)+1);
        });

        it('allowdragging:true notify property with modal dialog and aria attribute testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ content: dlgcontent, height: '200px',
            width: '300px',
            header: 'Dialog Header',
            isModal: true,
            visible : true,
            allowDragging: true });
            dialog.appendTo('#dialog');
            expect(document.getElementById('dialog').getAttribute('aria-modal')).toEqual('true');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
            expect(parseInt(dialog.element.style.zIndex)).toBe(parseInt(dialog.element.parentElement.style.zIndex) + 1);
            expect(parseInt(dialog.element.style.zIndex) - 1).toBe(parseInt((dialog.element.nextSibling as HTMLElement).style.zIndex)+1);
        });

        it('dragStop events testing in modal dialog', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({
                allowDragging: true,
                header: "Draggable dialog",
                isModal: true,
                target: target,
                animationSettings: { effect: 'None' }
            }, '#dialog');
            expect(document.getElementById("dialog").classList.contains("e-draggable")).toEqual(true);
            expect(document.getElementById("dialog").getAttribute('aria-modal')).toEqual('true');
            (dialog as any).dragObj.trigger('dragStop');
            expect(document.getElementById("block").children[0].classList.contains('e-dlg-center-center')).toEqual(false);
            expect((dialog.element as HTMLElement).style.position = "relative" );
            dialog.position = { X: 'right', Y: 'top' };
            dialog.dataBind();
            expect(document.getElementById("block").children[0].classList.contains('e-dlg-right-top')).toEqual(true);
            expect(document.getElementById("block").children[0].classList.contains('e-dlg-container')).toEqual(true);
            expect((dialog.element as HTMLElement).style.position = "relative" );
        });

        it('dialog events testing', (done) => {
            let dlgcontent: HTMLElement = createElement("div");
            let dialog = new Dialog({
                content: dlgcontent,
                animationSettings: { effect: 'None' },
                created: created, open: open, beforeOpen: beforeOpen, close: close, beforeClose: beforeClose
            }, '#dialog');
            dialog.hide();
            function created() {
                addClass([document.getElementById('dialog')], 'created');
            }
            function open() {
                addClass([document.getElementById('dialog')], 'open');
            }
            function beforeOpen() {
                addClass([document.getElementById('dialog')], 'beforeopen');
            }
            function close() {
                addClass([document.getElementById('dialog')], 'close');
            }
            function beforeClose() {
                addClass([document.getElementById('dialog')], 'beforeclose');
            }
            expect(document.getElementById('dialog').classList.contains("created")).toEqual(true);
            setTimeout(() => {
                expect(document.getElementById('dialog').classList.contains("open")).toEqual(true);
                done();
            });
            expect(document.getElementById('dialog').classList.contains("beforeopen")).toEqual(true);
            expect(document.getElementById('dialog').classList.contains("close")).toEqual(true);
            expect(document.getElementById('dialog').classList.contains("beforeclose")).toEqual(true);
            expect(dialog.visible).toEqual(false);
        });

        it('dialog allowdragging with target testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, target: target, allowDragging: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
        });

        it('dialog target declared as string testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, target: "#block", allowDragging: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
        });

        it('dialog without target testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, allowDragging: true }, '#dialog');
            expect(dialog.target).not.toEqual(null);
        });

        it('dialog allowdragging with header given as Template testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            let headerTemplateContent = "<div>Template content</div>";
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: headerTemplateContent, content: dlgcontent, allowDragging: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
        });

        it('dialog allowdragging - notify property testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent }, '#dialog');
            dialog.allowDragging = true;
            dialog.dataBind();
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
            dialog.allowDragging = false;
            dialog.dataBind();
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(false);
        });

        it('dialog RTL testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, enableRtl: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-rtl")).toEqual(true);
        });

        it('dialog buttons testing', () => {
            let dialog1: any;
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog1 = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(2);
            expect(dialog1.btnObj.length).toBe(2);
        });

        it('dialog getButtons testing', () => {
            let dialog1: any;
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog1 = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(dialog1.getButtons().length).toBe(2);
        });

        it('dialog button type testing', () => {
            let dialog1: any;
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog1 = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" }, type:'Submit' }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(dialog1.getButtons(0).element.type).toEqual('submit');
            expect(dialog1.getButtons(1).element.type).toEqual('button');
        });

        it('dialog getButtons testing', () => {
            let dialog1: any;
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog1 = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(dialog1.getButtons(0).content).toEqual('left');
        });

        it('dialog Button Model property testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, buttons: [{ buttonModel: { cssClass: 'e-success', content: 'left' } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn')[0].classList.contains('e-success'));
        });

        it('dialog buttons and footerTemplate combination testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            let footerTemplateContent = "<div>Footer Template content</div>";
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, footerTemplate: footerTemplateContent, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(0);
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content').length).toBe(1);
        });

        it('dialog with one button testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, buttons: [{ buttonModel: { content: "left" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(1);
        });

        it('dialog button empty options testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, buttons: [{}], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content').length).toBe(0);
        });

        it('dialog with three button testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, buttons: [{ buttonModel: { content: "ok" } }, { buttonModel: { content: "cancel" } }, { buttonModel: { content: "Goto" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(3);
        });

        it('dialog primary button testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: dlgcontent, buttons: [{ buttonModel: { isPrimary: true, content: 'ok' } }, { buttonModel: { content: "cancel" } }, { buttonModel: { content: "Goto" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-primary').length).toBe(1);
            expect(document.getElementById('dialog').querySelectorAll('.e-flat').length).toBe(3);
        });

        it('checking for the presence of e-flat class', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dlgcontent.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: dlgcontent, buttons: [{ buttonModel: { isPrimary: true, content: 'ok' } }, { buttonModel: { content: "cancel" } }, { buttonModel: { content: "Goto" } }], }, '#dialog');
            let buttonElements: NodeListOf <HTMLButtonElement> = document.querySelectorAll('.e-footer-content > button')
            expect(buttonElements[1].classList.contains('e-flat')).toBe(true);
            expect(buttonElements[2].classList.contains('e-flat')).toBe(true);
        });

        it('Header with initial rendering and notify property property testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl9' });
            document.body.appendChild(ele);
            let headerTemplateContent = "<div class='templateclass'>Template content</div>";
            dialog = new Dialog({ header: 'Dialog' }, '#dialogCtrl9');
            let element: HTMLElement = document.getElementById('dialogCtrl9');
            dialog.header = headerTemplateContent;
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl9').querySelectorAll('.e-dlg-header .templateclass').length).toBe(1);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('notify property change testing combination of header-content-footerTemplate', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl8' });
            document.body.appendChild(ele);
            let footerTemplateContent = "<div>Footer Template content</div>";
            dialog = new Dialog({}, '#dialogCtrl8');
            let element: HTMLElement = document.getElementById('dialogCtrl8');
            dialog.header = 'New Dialog';
            dialog.content = 'New content updated successfully';
            dialog.footerTemplate = footerTemplateContent;
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl8').querySelectorAll('.e-dlg-content').length).toBe(1);
            expect(document.getElementById('dialogCtrl8').querySelectorAll('.e-dlg-header').length).toBe(1);
            expect(document.getElementById('dialogCtrl8').querySelectorAll('.e-footer-content').length).toBe(1);
            expect(document.getElementById('dialogCtrl8').querySelectorAll('.e-icon-dlg-close').length).toBe(0);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('notify property changes testing combination of showCloseIcon and cssClass property', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl7' });
            document.body.appendChild(ele);
            dialog = new Dialog({ header: "Dialog", showCloseIcon: false }, '#dialogCtrl7');
            let element: HTMLElement = document.getElementById('dialogCtrl7');
            dialog.showCloseIcon = true;
            dialog.cssClass = "css-classname";
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl7').querySelectorAll(".e-dlg-header").length).toBe(1);
            expect(document.getElementById('dialogCtrl7').classList.contains('css-classname')).toEqual(true);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('notify property testing-showCloseIcon:true if header is not given,cssClass and dialog buttons Testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl6' });
            document.body.appendChild(ele);
            dialog = new Dialog({ header: "Dialog", buttons: [{ buttonModel: { content: 'Confirm' } }, { buttonModel: { content: 'Cancel' } }], showCloseIcon: true, cssClass: "oldCssClass" }, '#dialogCtrl6');
            let element: HTMLElement = document.getElementById('dialogCtrl6');
            dialog.header = '';
            dialog.cssClass = 'newCssClass css-classname';
            dialog.buttons = [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }],
                dialog.dataBind();
            expect(document.getElementById('dialogCtrl6').querySelectorAll(".e-dlg-header").length).toBe(0);
            expect(document.getElementById('dialogCtrl6').querySelectorAll('.e-footer-content .e-btn').length).toBe(2);
            expect(document.getElementById('dialogCtrl6').classList.contains('newCssClass')).toEqual(true);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('header given as Template testing and content property given as string-notify property changes', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl5' });
            document.body.appendChild(ele);
            let headerTemplateContent = "<div>Template content</div>";
            let newheaderTemplateContent = "<div class='newhdrtemplate'>New Template content</div>";
            dialog = new Dialog({ showCloseIcon: false, header: headerTemplateContent }, '#dialogCtrl5');
            let element: HTMLElement = document.getElementById('dialogCtrl5');
            dialog.header = newheaderTemplateContent;
            dialog.content = "New content";
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl5').querySelectorAll(".e-dlg-content").length).toBe(1);
            expect(document.getElementById('dialogCtrl5').querySelectorAll('.e-dlg-header .newhdrtemplate').length).toBe(1);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('Content notify property changes ', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl4' });
            document.body.appendChild(ele);
            dialog = new Dialog({ header: "Dialog", content: "Dialog content", showCloseIcon: false }, '#dialogCtrl4');
            let element: HTMLElement = document.getElementById('dialogCtrl4');
            dialog.content = "New content";
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl4').querySelectorAll(".e-dlg-content")[0].innerHTML).toEqual("New content");
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('Content notify property initialization ', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl3' });
            document.body.appendChild(ele);
            dialog = new Dialog({ header: "Dialog", showCloseIcon: false }, '#dialogCtrl3');
            let element: HTMLElement = document.getElementById('dialogCtrl3');
            dialog.content = "New content";
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl3').querySelectorAll(".e-dlg-content")[0].innerHTML).toEqual("New content");
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('Content as null in notify property changes', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            dialog = new Dialog({ header: "Dialog", content: "Dialog content", showCloseIcon: false }, '#dialog');
            let element: HTMLElement = document.getElementById('dialog');
            dialog.content = null;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-content").length).toBe(0);
            dialog.destroy();
            document.body.innerHTML = '';
        });

        it('Modal dialog:true notify property and aria attr testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl2' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            dialog = new Dialog({}, '#dialogCtrl2');
            dialog.overlayClick = function () {
                dialog.hide();
            }
            dialog.isModal = true;
            dialog.dataBind();
            dialog.zIndex = 3000;
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl2').classList.contains("e-dlg-modal")).toBe(true);
            expect(document.getElementById('dialogCtrl2').getAttribute('aria-modal')).toEqual('true');
            expect((<any>document.getElementsByClassName('e-dlg-container')[0]).style.display).not.toEqual('none');
            expect(dialog.element.parentElement.style.zIndex).toEqual("3000");
        });

        it('Modal dialog:false notify property and aria attr testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl1' });
            document.body.appendChild(ele);
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, isModal: true }, '#dialogCtrl1');
            dialog.isModal = false;
            dialog.dataBind();
            expect(document.getElementById("dialogCtrl1").classList.contains('e-popup-open')).toEqual(true);
            expect(document.getElementsByClassName('e-dlg-overlay').length).toEqual(0);
            expect(document.getElementById('dialogCtrl1').getAttribute('aria-modal')).toEqual('false');
        });

        it('Modal dialog:true body scroll disabled testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, isModal: true }, '#dialog');
            dialog.dataBind();
            expect(document.body.classList.contains('e-scroll-disabled')).toBe(true);
        });

        it('Header notify property testing with Draggable', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl' });
            document.body.appendChild(ele);
            dialog = new Dialog({ showCloseIcon: true, isModal: false, allowDragging: true }, '#dialogCtrl');
            dialog.header = "Draggable Dialog";
            dialog.dataBind();
            expect(document.getElementById('dialogCtrl').classList.contains("e-draggable")).toEqual(true);
        });

        it('showCloseIcon notify property testing when header is given to empty', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            dialog = new Dialog({ showCloseIcon: true, isModal: false }, '#dialog');
            dialog.showCloseIcon = false;
            dialog.dataBind();
            expect(document.getElementById('dialog').classList.contains("e-dlg-header-content")).toEqual(false);
        });

        it('Modal dialog:false with target-notify  property testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({ showCloseIcon: true, isModal: true, animationSettings: { effect: 'None' }, target: target }, '#dialog');
            dialog.isModal = false;
            dialog.dataBind();
            expect(document.getElementById("block").children[0].classList.contains('e-dialog')).toEqual(true);;
        });

        it('Modal dialog:true and position with target-notify property testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, target: target }, '#dialog');
            dialog.isModal = true;
            dialog.position = { X: 'right', Y: 'top' };
            dialog.dataBind();
            expect(document.getElementById("block").children[0].classList.contains('e-dlg-right-top')).toEqual(true);;
            expect(document.getElementById("block").children[0].classList.contains('e-dlg-container')).toEqual(true);;
            dialog.target = document.body;
            dialog.dataBind();
            expect((dialog as any).popupObj.relateTo === document.body).toEqual(true);;
        });

        it('Modal dialog:false and position for enum type with target-notify property testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogpos' });
            document.body.appendChild(ele);
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, target: target }, '#dialog');
            dialog.isModal = false;
            dialog.position = { X: 'center', Y: 100 };
            dialog.dataBind();
            expect(document.getElementById("dialog").style.left).toEqual("8px");
            expect(document.getElementById("dialog").style.top).toEqual("100px");
            dialog.target = document.body;
            dialog.dataBind();
            expect(document.getElementById("dialog").style.left).toEqual("8px");
            expect(document.getElementById("dialog").style.top).toEqual("100px");
        });

        it('Modal dialog:true and position for enum type with target-notify property testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialogpos' });
            document.body.appendChild(ele);
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, target: target }, '#dialog');
            dialog.isModal = true;
            dialog.position = { X: 100, Y: 'top' };
            dialog.dataBind();
            expect(document.getElementById("dialog").style.left).toEqual("100px");
            expect(document.getElementById("dialog").style.top).toEqual("8px");
            dialog.target = document.body;
            dialog.dataBind();
            expect(document.getElementById("dialog").style.left).toEqual("100px");
            expect(document.getElementById("dialog").style.top).toEqual("8px");
        });

        it('Modal dialog with target property- testing', () => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, isModal: true, target: target }, '#dialog');
            expect(document.getElementById("block").children[0].classList.contains('e-dlg-container')).toEqual(true);;
        });

        describe("getZindexPartial-", function () {
            beforeEach(() => {
                document.body.innerHTML = '';
                let wrapper: HTMLElement = createElement('div', { id: 'wrapper' });
                wrapper.style.zIndex = "10000";
                wrapper.style.position = "absolute";
                let ele: HTMLElement = createElement('div', { id: 'dialog' });
                wrapper.appendChild(ele);
                document.body.appendChild(wrapper);
                dialog = new Dialog({ showCloseIcon: false }, '#dialog');
                let element: HTMLElement = document.getElementById('dialog');
                dialog.header = 'Dialog header';
            });
            it('getZindexPartial upto body element testing', () => {
                expect(document.getElementById('dialog').style.zIndex).toEqual("10001");
            });
        });

        describe('Drag related events testing', () => {
            let dragEle: HTMLElement;
            let mousemove: any;
            let instance: any;
            let mouseUp: any;
            beforeEach(() => {
                dragEle = createElement('div', { id: 'dialog' });
                document.body.appendChild(dragEle);
                dialog = new Dialog({
                    allowDragging: true,
                    header: "Draggable dialog",
                    animationSettings: { effect: 'None' }
                }, '#dialog');

                mousemove = getEventObject('MouseEvents', 'mousemove');
                mousemove = setMouseCoordinates(mousemove, 17, 14);
                let mousedown: any = getEventObject('MouseEvents', 'mousedown');
                mousedown = setMouseCoordinates(mousedown, 5, 5);
                mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-dlg-header-content")[0];
                EventHandler.trigger(document.getElementsByClassName("e-dlg-header-content")[0] as HTMLElement, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-dlg-header-content");
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCoordinates(mousemove, 5, 5);
                mouseUp = getEventObject('MouseEvents', 'mouseup');
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-dlg-header-content")[0];
            });
            it('drag,dragStart and dragEnd events testing', () => {
                dialog = new Dialog({
                    allowDragging: true,
                    header: "Draggable dialog",
                    animationSettings: { effect: 'None' }
                }, '#dialog');
                mousemove = setMouseCoordinates(mousemove, 5, 5);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                expect((dialog.element as HTMLElement).style.left).toBe('8px');
                expect((dialog.element as HTMLElement).style.top).toBe('8px');
            });
            afterEach(() => {
                document.body.innerHTML = '';
            });
        });
    });
})

describe('Isprimary Button Action while focus on form element', () => {
    describe('Application side ', () => {
        let events: any;
        let eventArgs: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            events = new Dialog({
                closeOnEscape: false,
                animationSettings: { effect: 'None' },
                open: () => {
                    document.getElementById("pwd").focus();
                },
                buttons: [{
                    buttonModel: { isPrimary: true, content: 'Confirm' }, click: function () {
                        this.hide();
                    }
                }, { buttonModel: { content: 'Close' } }],
                content: "<form><div class='form-group'><label for='email'>Email address:</label>" +
                "<input type='email' class='form-control' id='email'>" +
                "</div><div class='form-group'><label for='pwd'>Password:</label>" +
                "<input type='password' class='form-control' id='pwd'>" +
                "</div><div class='form-group'><label for='comment'>Comment:</label>" +
                "<textarea class='form-control' rows='5' id='comment'></textarea> <div>" +
                "</div><div class='checkbox'><label><input type='checkbox'> Remember me</label>" +
                "</div>" +
                "</form>"
            });
            events.appendTo(ele);
        });
        /**
         * Enter key press
         */
        it('primary action trigger while press a enter key ', (done) => {
            eventArgs = { keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });

        /**
         * Ctrl + Enter key press
         */
        it('primary action trigger while press a ctrl+enter key ', (done) => {
            events.show();
            document.getElementById("comment").focus();
            eventArgs = { keyCode: 13, altKey: false, ctrlKey: true, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });
        afterAll((): void => {
            if (events) {
                events.destroy();
            }
            document.body.innerHTML = '';
        });
    });

    describe('Set the primary Button to second button element', () => {
        let events: any;
        let eventArgs: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            events = new Dialog({
                closeOnEscape: false,
                animationSettings: { effect: 'None' },
                buttons: [{
                    buttonModel: { content: 'Confirm' }, click: function () {
                        this.hide();
                    }
                }, { buttonModel: { content: 'Close', isPrimary: true } }],
                content: "Content here"
            });
            events.appendTo(ele);
        });
        /**
        * Enter key press
        */
        it('focus the primary second button', () => {
            expect(document.activeElement.textContent === 'Close').toEqual(true);
        });

        afterAll((): void => {
            if (events) {
                events.destroy();
            }
            document.body.innerHTML = '';
        });
    });

    describe('Ensure the focus element after tab key press', () => {
        let events: any;
        let eventArgs: any;
        let document1: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            events = new Dialog({
                closeOnEscape: false,
                animationSettings: { effect: 'None' },
                buttons: [{
                    buttonModel: { isPrimary: true, content: "confirm" }, click: function () {
                        this.hide();
                    }
                }, { buttonModel: { content: "close" } }],
                isModal: true,
                content: "<form><div class='form-group'><label for='email'>Email address:</label>" +
                "<input type='email' autofocus='true' class='form-control' id='email'>" +
                "</div><div class='form-group'><label for='pwd'>Password:</label>" +
                "<input type='password' class='form-control' id='pwd'>" +
                "</div><div class='form-group'><label for='comment'>Comment:</label>" +
                "<textarea class='form-control' rows='5' id='comment'></textarea> </div> <div>" +
                "<div class='form-group'><label for='feedback'>Feedback:</label>" +
                "<div contenteditable='true' rows='5' id='feedback'>Feedback here</div> <div>" +
                "</div><div class='checkbox'><label><input type='checkbox'> Remember me</label>" +
                "</div>" +
                "<div class='disable'><label><select aria-disabled='true'><option> select</option></select></label>" +
                "</div> <a href='https://www.w3schools.com'>Visit W3Schools.com! </a>" +
                "</form>"
            });
            events.appendTo(ele);
        });

        afterAll((): void => {
            if (events) {
                events.destroy();
            }
            document.body.innerHTML = '';
        });

        /**
         * Tab key press
         */
        it('Tab key press on the last button element ', (done) => {
            eventArgs = { keyCode: 9, altKey: false, ctrlKey: false, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                //expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });
    });


    describe('Autofocus attribute to focus an element', () => {
        let events: any;
        let eventArgs: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            events = new Dialog({
                closeOnEscape: false,
                animationSettings: { effect: 'None' },
                buttons: [{
                    buttonModel: { isPrimary: true, content: "confirm" }, click: function () {
                        this.hide();
                    }
                }, { buttonModel: { content: "close" } }],
                content: "<form><div class='form-group'><label for='email'>Email address:</label>" +
                "<input type='email' autofocus='true' class='form-control' id='email'>" +
                "</div><div class='form-group'><label for='pwd'>Password:</label>" +
                "<input type='password' class='form-control' id='pwd'>" +
                "</div><div class='form-group'><label for='comment'>Comment:</label>" +
                "<textarea class='form-control' rows='5' id='comment'></textarea> </div> <div>" +
                "<div class='form-group'><label for='feedback'>Feedback:</label>" +
                "<div contenteditable='true' rows='5' id='feedback'>Feedback here</div> <div>" +
                "</div><div class='checkbox'><label><input type='checkbox'> Remember me</label>" +
                "</div>" +
                "<div class='disable'><label><select aria-disabled='true'><option> select</option></select></label>" +
                "</div> <a href='https://www.w3schools.com'>Visit W3Schools.com! </a>" +
                "</form>"
            });
            events.appendTo(ele);
        });
        /**
         * Enter key press
         */
        it('primary action trigger while press a enter key in input and select element ', (done) => {
            eventArgs = { keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });

        /**
         * Ctrl + Enter key press
         */
        it('primary action trigger while press a ctrl+enter key in textarea element ', (done) => {
            events.show();
            document.getElementById("comment").focus();
            eventArgs = { keyCode: 13, altKey: false, ctrlKey: true, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });
        it('primary action trigger while press a ctrl+enter key in content editable element ', (done) => {
            events.show();
            document.getElementById("feedback").focus();
            eventArgs = { keyCode: 13, altKey: false, ctrlKey: true, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });
        it('primary action trigger while press a ctrl+enter key in autofocus attribute to content editable element ', (done) => {
            events.content = "<form><div class='form-group'><label for='email'>Email address:</label>" +
                "<input type='email'class='form-control' id='email'>" +
                "</div><div class='form-group'><label for='pwd'>Password:</label>" +
                "<input type='password' class='form-control' id='pwd'>" +
                "</div><div class='form-group'><label for='comment'>Comment:</label>" +
                "<textarea class='form-control' rows='5' id='comment'></textarea> </div> <div>" +
                "<div class='form-group'><label for='feedback'>Feedback:</label>" +
                "<div contenteditable='true'  autofocus='true' rows='5' id='feedback'>Feedback here</div> <div>" +
                "</div><div class='checkbox'><label><input type='checkbox'> Remember me</label>" +
                "</div>" +
                "</form>";
            events.dataBind();
            events.show();
            document.getElementById("feedback").focus();
            eventArgs = { keyCode: 13, altKey: false, ctrlKey: true, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });
        afterAll((): void => {
            if (events) {
                events.destroy();
            }
            document.body.innerHTML = '';
        });
    });
    
    describe('focus action', () => {
        let events: any;
        let eventArgs: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            events = new Dialog({
                closeOnEscape: true,
                animationSettings: { effect: 'None' }
            });
            events.appendTo(ele);
        });

        it('Esc key press to hide testing ', (done) => {
            eventArgs = { keyCode: 27, altKey: false, ctrlKey: false, shiftKey: false };
            events.keyDown(eventArgs);
            setTimeout(() => {
                expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
                done();
            });
        });

        it('focus close icon button at initially', () => {
            events.hide();
            expect(events.visible).toBe(false);
            events.showCloseIcon = true;
            events.dataBind();
            events.show();
            expect(events.visible).toBe(true);
            expect((document.activeElement as HTMLElement).classList.contains('e-dlg-closeicon-btn')).toBe(true);
        });

        it('focus primary button', () => {
            events.hide();
            events.buttons = [{
                buttonModel: { isPrimary: true, content: "confirm" }, click: function () {
                    this.hide();
                }
            }];
            events.dataBind();
            events.show();
            expect((document.activeElement as HTMLElement).classList.contains('e-primary')).toBe(true);
        });

        it('focus first form element in dialog content', () => {
            events.hide();
            events.content = "<form><div class='form-group'><label for='email'>Email address:</label>" +
                "<input type='email' class='form-control email' id='email'>" +
                "</div><div class='form-group'><label for='pwd'>Password:</label>" +
                "<input type='password' class='form-control pwd' id='pwd'>" +
                "</div><div class='form-group'><label for='comment'>Comment:</label>" +
                "<textarea class='form-control comment' rows='5' id='comment'></textarea> <div>" +
                "</div><div class='checkbox'><label><input type='checkbox' class='check'> Remember me</label>" +
                "</div>" +
                "</form>";
            events.dataBind();
            events.show();
            expect((document.activeElement as HTMLElement).classList.contains('email')).toBe(true);
        });

        it('focus first form element in dialog content-when set first input element as display:none', () => {
            events.hide();
            events.content = "<form><div class='form-group'><label for='email'>Email address:</label>" +
                "<input type='email' class='form-control email' id='email' style='display:none;'>" +
                "</div><div class='form-group'><label for='pwd'>Password:</label>" +
                "<input type='password' class='form-control pwd' id='pwd'>" +
                "</div><div class='form-group'><label for='comment'>Comment:</label>" +
                "<textarea class='form-control comment' rows='5' id='comment'></textarea> <div>" +
                "</div><div class='checkbox'><label><input type='checkbox' class='check'> Remember me</label>" +
                "</div>" +
                "</form>";
            events.dataBind();
            events.show();
            expect((document.activeElement as HTMLElement).classList.contains('pwd')).toBe(true);
        });

        it('focus autofocus attribute form element in dialog content', (done) => {
            events.hide();
            events.content = "<form><div class='form-group'><label for='email'>Email address:</label>" +
                "<input type='email' class='form-control email' id='email'>" +
                "</div><div class='form-group'><label for='pwd'>Password:</label>" +
                "<input type='password' class='form-control pwd' id='pwd'>" +
                "</div><div class='form-group'><label for='comment'>Comment:</label>" +
                "<textarea autofocus class='form-control comment' rows='5' id='comment'></textarea> <div>" +
                "</div><div class='checkbox'><label><input type='checkbox' class='check'> Remember me</label>" +
                "</div>" +
                "</form>";
            events.dataBind();
            events.show();
            setTimeout(()=>{
                expect((document.activeElement as HTMLElement).classList.contains('comment')).toBe(true);
                done();
            },200);
        });

        afterAll((): void => {
            if (events) {
                events.destroy();
            }
            document.body.innerHTML = '';
        });
    });

    describe('focus action innerHTML', () => {
        let events: any;
        let eventArgs: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog', innerHTML: '<input type="text" class="text"/>' });
            document.body.appendChild(ele);
            events = new Dialog({
                closeOnEscape: true,
                animationSettings: { effect: 'None' },
                buttons: [{
                    buttonModel: { isPrimary: true, content: "confirm" }, click: function () {
                        this.hide();
                    }
                }]
            });
            events.appendTo(ele);
        });

        it('Focus inner html textbox', () => {
            expect((document.activeElement as HTMLElement).classList.contains('text')).toBe(true);
        });

        afterAll((): void => {
            if (events) {
                events.destroy();
            }
            document.body.innerHTML = '';
        });
    });
});


describe('visible:false Property ', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialogctrl' });
        document.body.appendChild(ele);
        let footerTemplateContent = "<div>Footer Template content</div>";
        let dialog: Dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, visible: false, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialog');
        let element: HTMLElement = document.getElementById('dialogctrl');
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('visible property:false testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialogctrl15' });
        document.body.appendChild(ele);
        let dialog: Dialog = new Dialog({ visible: false }, '#dialogctrl15');
        expect(document.getElementById("dialogctrl15").classList.contains('e-popup-close')).toEqual(true);
        expect(dialog.visible).toEqual(false);
    });
    it('visible property:false on dynamic change testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialogctrl25' });
        document.body.appendChild(ele);
        let dialog: Dialog = new Dialog({ visible: true }, '#dialogctrl25');
        expect(dialog.visible).toEqual(true);
        dialog.visible = false;
        dialog.dataBind();
        expect(document.getElementById("dialogctrl25").classList.contains('e-popup-close')).toEqual(true);
        expect(dialog.visible).toEqual(false);
    });
    it('visible property:false with modal enabled testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialogctrl14' });
        document.body.appendChild(ele);
        let dialog: Dialog = new Dialog({ visible: false, isModal: true }, '#dialogctrl14');
        expect((document.getElementsByClassName("e-dlg-overlay")[0] as HTMLElement).style.display).toEqual('none');
        expect(document.getElementById("dialogctrl14").classList.contains('e-popup-close')).toEqual(true);
        expect(dialog.visible).toEqual(false);
        dialog.visible = true;
        dialog.dataBind();
        expect((document.getElementsByClassName("e-dlg-overlay")[0] as HTMLElement).style.display).toEqual('block');
    });

    it('visible property:false with modal enabled testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialogctrl31' });
        document.body.appendChild(ele);
        let dialog: Dialog = new Dialog({ visible: false, target: document.body, isModal: true  }, '#dialogctrl31');
        dialog.isModal = false;
        dialog.dataBind();
        expect(document.getElementById("dialogctrl31").classList.contains('e-popup-close')).toEqual(true);
        expect(dialog.visible).toEqual(false);
        expect(dialog.isModal).toEqual(false);
    });
});

describe('visible:false:notify Property ', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialogctrl' });
        document.body.appendChild(ele);
        let footerTemplateContent = "<div>Footer Template content</div>";
        let dialog: Dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialog');
        let element: HTMLElement = document.getElementById('dialogctrl');
        dialog.visible = false;
        dialog.dataBind();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('visible notify property testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let dialog: Dialog = new Dialog({ visible: false }, '#dialog');
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('visible:true:notify Property ', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialogctrl' });
        document.body.appendChild(ele);
        let footerTemplateContent = "<div>Footer Template content</div>";
        let dialog: Dialog = new Dialog({ header: "Dialog", visible: false, animationSettings: { effect: 'None' }, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialogctrl');
        let element: HTMLElement = document.getElementById('dialogctrl');
        dialog.visible = true;
        dialog.dataBind();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('visible:true notify property testing', () => {
        expect(document.getElementById("dialogctrl").classList.contains('e-popup-open')).toEqual(true);
    });
});

describe('Close icon ', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let footerTemplateContent = "<div>Footer Template content</div>";
        let clickFn: Function = jasmine.createSpy('click');
        let dialog: Dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialog');
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-icon-dlg-close'))[0];
        ele1.click();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('click event testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});


describe('Modal Dialog Testing ', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let clickFn: Function = jasmine.createSpy('click');
        let dialog: Dialog = new Dialog({ animationSettings: { effect: 'None' }, showCloseIcon: true, isModal: true }, '#dialog');
        dialog.overlayClick = function () {
            dialog.hide();
        }
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-dlg-overlay'))[0];
        ele1.click();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('Overlay click event testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});


describe('Dialog Modal', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let clickFn: Function = jasmine.createSpy('click');
        function buttonClick() {
        }
        let dialog: Dialog = new Dialog({ animationSettings: { effect: 'None' }, buttons: [{ buttonModel: { content: "Confirm" }, click: buttonClick }, { buttonModel: { content: "close" } }], showCloseIcon: true, isModal: true }, '#dialog');
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-btn'))[0];
        ele1.click();
        dialog.hide();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('Left Button click event testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('Dialog', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        L10n.load({
            'de-DE': {
                'dialog': {
                    'close': 'schlieen',
                }
            }
        });
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it("locale property testing", () => {
        let dialog: Dialog = new Dialog({ header: "Dialog", locale: 'en-US', showCloseIcon: true, animationSettings: { effect: 'None' }, content: "Your information is updated successfully" }, '#dialog');
        dialog.locale = 'de-DE';
        dialog.dataBind();
        expect(document.getElementsByClassName('e-dlg-closeicon-btn')[0].getAttribute('title')).toEqual("schlieen");
    })

    it('isDevice Condition check', () => {
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidUserAgent;
        let dialog = new Dialog({ content: "Your information is updated successfully" }, '#dialog');
        expect(document.getElementById('dialog').classList.contains('e-device')).toBe(true);
    });


});

describe('Dialog Modal', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let target: HTMLElement = createElement('div', { id: 'block' });
        document.body.appendChild(target);
        let clickFn: Function = jasmine.createSpy('click');
        let dialog: Dialog = new Dialog({ animationSettings: { effect: 'None' }, target: target, showCloseIcon: true, isModal: true }, '#dialog');
        dialog.overlayClick = function () {
            dialog.hide();
        }
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-dlg-overlay'))[0];
        ele1.click();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('with target testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('Dialog', () => {
    let ele: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let clickFn: Function = jasmine.createSpy('click');
        let dialog: Dialog = new Dialog({ showCloseIcon: true, content: 'Dialog content', position: { X: 'center', Y: 'center' } }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('with Position testing', () => {
        expect(document.getElementById("dialog").style.left).toEqual("8px");
    });
});

describe('Dynamically change', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let clickFn: Function = jasmine.createSpy('click');
        dialog = new Dialog({ showCloseIcon: true, content: 'Dialog content' }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
   
    it('dialog content', () => {
        dialog.content = '';
        dialog.dataBind();
        expect(isNullOrUndefined(document.querySelector('.e-dlg-content'))).toBe(true);
        dialog.content = 'Syncfusion';
        dialog.dataBind();
        expect(isNullOrUndefined(document.querySelector('.e-dlg-content'))).toBe(false);
    });

    it('showcloseIcon', () => {
        dialog.content = '';
        dialog.header = '';
        dialog.showCloseIcon = false;
        dialog.dataBind();
        expect(isNullOrUndefined(document.querySelector('.e-dlg-header-content'))).toBe(true);
        dialog.showCloseIcon = true;
        dialog.dataBind();
        expect(isNullOrUndefined(document.querySelector('.e-dlg-header-content'))).toBe(false);
    });
});

describe('Position for modal dialog', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let clickFn: Function = jasmine.createSpy('click');
        dialog = new Dialog({ showCloseIcon: true, content: 'Dialog content',  position: { X: 200, Y: 300 }, isModal: true }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
   
    it('On Initial rendering', () => {
        expect(document.getElementById("dialog").style.top).toEqual("300px");
        expect(document.getElementById("dialog").style.left).toEqual("200px");
    });

    it('OnProperty change', () => {
        dialog.position = {X: 100, Y: 150};
        dialog.dataBind();
        expect(document.getElementById("dialog").style.top).toEqual("150px");
        expect(document.getElementById("dialog").style.left).toEqual("100px");
    });
});

describe('Cancel', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let clickFn: Function = jasmine.createSpy('click');
        function cancelEvents(args: any) {
            args.cancel = true;
        }
        dialog = new Dialog({ showCloseIcon: true, beforeOpen: cancelEvents, beforeClose: cancelEvents, content: 'Dialog content',  position: { X: 200, Y: 300 }, isModal: true }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
   
    it('On before Open event', () => {
        dialog.show();
        expect(document.getElementById('dialog').classList.contains('e-popup-open')).toBe(false)
    });

    it('On before Close event', () => {
        dialog.hide();
        expect(document.getElementById('dialog').classList.contains('e-popup-close')).toBe(true)
    });
});


describe('Hide() method', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let clickFn: Function = jasmine.createSpy('click');
        function closeEvents(args: any) {
            expect((document.getElementsByClassName("e-dlg-overlay")[0] as HTMLElement).style.display).toEqual('block');
            expect((document.getElementsByClassName("e-dlg-container")[0] as HTMLElement).style.display).toEqual('none');
        }
        dialog = new Dialog({ isModal: true, close: closeEvents, content: 'Dialog content' }, '#dialog');
        dialog.hide();
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
});

describe("Dialog with animation", function () {
    let value: number;

    beforeEach(function (done) {
        setTimeout(function () {
            let footerTemplateContent = "<div>Footer Template content</div>";
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            let dialog: Dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'Fade', delay: 0, duration: 0 }, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialog');
            dialog.hide();
            value = 0;
            done();
        }, 1);
    });
    describe("", function () {
        let originalTimeout: number;
        beforeEach(function () {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;
        });

        it("Fade-In and Out animation", function (done) {
            expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
            setTimeout(function () {
                done();
            }, 100);
        });

        it(' Dialog control notify property testig-All properties combination', (done) => {
            let ele1: HTMLElement = createElement('div', { id: 'dialog1' });
            document.body.appendChild(ele1);
            let footerTemplateContent1 = "<div>Footer Template content</div>";
            let newfooterTemplateContent1 = "<div class='newftrtemplate'>Footer Template content</div>";
            let dialog1 = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: "Dialog content", footerTemplate: footerTemplateContent1, showCloseIcon: true }, '#dialog1');
            let element: HTMLElement = document.getElementById('dialog');
            dialog1.header = 'New Dialog';
            dialog1.footerTemplate = newfooterTemplateContent1;
            dialog1.showCloseIcon = false;
            dialog1.height = "400px";
            dialog1.width = "300px";
            dialog1.zIndex = 2000;
            dialog1.enableRtl = true;
            dialog1.animationSettings = { duration: 2000 };
            dialog1.position = { X: "center", Y: "center" };
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog1.content = dlgcontent1;
            dialog1.dataBind();
            setTimeout(() => {
                expect(document.getElementById('dialog1').style.height).toEqual("400px");
                expect(document.getElementById('dialog1').style.width).toEqual("300px");
                done();
            });
            expect(document.getElementById('dialog1').classList.contains("e-rtl")).toEqual(true);
            expect(document.getElementById('dialog1').querySelectorAll(".e-dlg-header").length).toBe(1);
            expect(document.getElementById('dialog1').querySelectorAll('.e-footer-content .newftrtemplate').length).toBe(1);
            expect(document.getElementById('dialog1').querySelectorAll('.e-icon-dlg-close').length).toBe(0);
            dialog1.showCloseIcon = true;
            dialog1.dataBind();
            expect(document.getElementById('dialog1').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        });

        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
        });
    });
});

describe('Maximum Zindex value testing for modal dialog', () => {
    let dialog: any;
    beforeAll(() => {
        let mazIndexElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(mazIndexElement);
        mazIndexElement.style.zIndex = '2147483647';
        mazIndexElement.style.position = 'relative';
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        dialog = new Dialog({header:'Demo', isModal: true, content:'First demo content' });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('dialog zindex', () => {
        expect(dialog.zIndex).toEqual(2147483647);
        expect(dialog.element.style.zIndex).toEqual('2147483647');
        expect((document.querySelector('.e-dlg-container .e-dlg-overlay') as HTMLElement).style.zIndex).toEqual('2147483646');
    });
});


describe('Maximum Zindex value testing for non modal dialog', () => {
    let dialog: any;
    
    beforeAll(() => {
        let mazIndexElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(mazIndexElement);
        mazIndexElement.style.zIndex = '2147483647';
        mazIndexElement.style.position = 'relative';
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        dialog = new Dialog({header:'Demo', content:'First demo content' });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('dialog z-index', () => {
        expect(dialog.zIndex).toEqual(2147483647);
        expect(dialog.element.style.zIndex).toEqual('2147483647');
    });
});

