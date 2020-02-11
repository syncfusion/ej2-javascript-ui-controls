/**
 * Dialog spec document
 */
import { createElement, addClass, detach, EventHandler, L10n, Browser, isNullOrUndefined } from '@syncfusion/ej2-base'
import '../../node_modules/es6-promise/dist/es6-promise';
import { Dialog, DialogUtility, BeforeCloseEventArgs, BeforeSanitizeHtmlArgs } from '../../src/dialog/dialog';

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

function destroyDialog(dialogObj: Dialog): void {
    if (dialogObj) {
        dialogObj.destroy();
        detach(dialogObj.element);
    }
}

// utility dialog spec
describe('create alert utility dialog with button click as typeof function', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        document.body.removeAttribute('style');
        dialogObj = DialogUtility.alert({
            okButton: {
                click: function (event: Event) {}
            }
        });
    });
    it('alert utility dialog footer button click', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        expect(document.getElementsByClassName('e-btn')[0].textContent == 'OK').toBe(true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// utility dialog specification
describe('create alert utility dialog with modal', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.alert({
            isModal: true,
            okButton: { text: 'new button', cssClass: 'syncfusion' }
        });
    });
    it('alert utility dialog to test modal behavior and destroy functionality', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        expect(document.getElementsByClassName('e-btn')[0].textContent == 'new button').toBe(true);
        expect(document.getElementsByClassName('e-btn')[0].classList.contains('syncfusion')).toBe(true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// utility dialog without modal
describe('default alert utility dialog without modal', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.alert({
            isModal: false
        });
    });
    it('to test alert dialog with modal and default button interaction ', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        expect(document.getElementsByClassName('e-btn')[0].textContent == 'OK').toBe(true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// utility dialog without modal
describe('alert utility dialog with closeICon and custom footer button', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.alert({
            isModal: false,
            showCloseIcon: true,
            okButton: { text: 'Ok btn', click: footerbtnClick },
            animationSettings: { effect: 'Zoom' }
        });
        function footerbtnClick() {
            // your code here
        };
    });
    it('alert dialog should remove from DOM', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
        expect(isNullOrUndefined(document.getElementsByClassName('e-btn')[0])).toBe(false);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// confirm utility dialog without modal
describe('create confirm utility dialog without modal', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.confirm({
            isModal: false
        });
    });
    it('non-modal dialog with default button functionalities', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// utility dialog without modal and default button actions
describe('confirm utility dialog without modal and default button actions', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.confirm({
            isModal: false,
            showCloseIcon: false,
            okButton: { text: 'Ok btn', click: footerbtnClick },
            animationSettings: { effect: 'Zoom' },
            cancelButton: {
                text: 'cancel button', click: function () {
                    // test dialog
                }
            }
        });
        function footerbtnClick() {
            // your code here
        };
    });
    it('close event will trigger on closeicon click', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName('e-btn')[1]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// utility dialog without modal
describe('create alert utility dialog', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.confirm({
            isModal: false,
            showCloseIcon: true,
            okButton: { text: 'Ok btn', click: footerbtnClick },
            cancelButton: {
                text: 'cancel button', click: function () {
                    // test dialog
                }
            }
        });
        function footerbtnClick() {
            // your code here
        };
    });
    it('close event will trigger on clik closeicon', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[0]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName('e-btn')[1]).dispatchEvent(clickEvent);
        (<HTMLElement>document.getElementsByClassName('e-btn')[2]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// utility dialog without modal
describe('create alert utility dialog', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.confirm({
            isModal: true,
            showCloseIcon: true,
            okButton: { text: 'Ok btn', click: footerbtnClick },
            cancelButton: { text: 'cancel button' }
        });
        function footerbtnClick() {
            // your code here
        };
    });
    it('close event will trigger on clik closeicon', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[2]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// utility dialog without modal
describe('create alert utility dialog', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.confirm({
            isModal: false,
            showCloseIcon: true,
            okButton: { text: 'Ok btn', click: footerbtnClick },
            cancelButton: { text: 'cancel button' }
        });
        function footerbtnClick() {
            // your code here
        };
    });
    it('close event will trigger on clik closeicon', () => {
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", false, true);
        (<HTMLElement>document.getElementsByClassName('e-btn')[2]).dispatchEvent(clickEvent);
    })
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// default rendering confirm dialog
describe('create confirm utility dialog', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.confirm({});
    });
    it('Dialog utility confirm dialog default rendering', () => {
        expect(document.getElementsByClassName('e-confirm-dialog')[0].classList.contains('e-confirm-dialog')).toBe(true);
    });
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// alert utility dialog with options
describe('create alert utility dialog', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.alert({
            title: 'dialog Header!',
            showCloseIcon: false,
            isModal: true,
            content: "dialog content Updated!!!",
            okButton: { text: 'Okbtn' }
        });
    });
    it('alert utility dialog with api default rendering', () => {
        expect(document.getElementsByClassName('e-alert-dialog')[0].classList.contains('e-popup-open')).toBe(false);
    });
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

// create confirm dialog utility with options
describe('create alert utility dialog', () => {
    let dialogObj: Dialog;
    beforeAll(() => {
        dialogObj = DialogUtility.confirm({
            title: 'dialog Header!',
            showCloseIcon: false,
            isModal: true,
            content: "dialog content Updated!!!",
            okButton: { text: 'Okbtn' },
            cancelButton: { text: 'cancel btn' }
        });
    });
    it('alert utility dialog with api default rendering', () => {
        expect(document.getElementsByClassName('e-confirm-dialog')[0].classList.contains('e-popup-close')).toBe(true);
    });
    afterAll(() => {
        destroyDialog(dialogObj);
    });
});

describe('closeOnEscape property', () => {
    let events: any;
    let eventArgs: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
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
    });
    afterAll(() => {
        destroyDialog(events);
    });
});

describe('closeOnEscape property', () => {
    let events: any;
    let eventArgs: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog2' });
        let inputField: HTMLElement = createElement('input', {id : 'dialogInput'});
        ele.appendChild(inputField);
        inputField.onblur = function() {
            expect(document.activeElement).not.toEqual(inputField);
        }
        document.body.appendChild(ele);
        events = new Dialog({header:'Demo', zIndex: 1200, content:'First demo content', animationSettings: { effect: 'None' }, closeOnEscape: true });
        // spyOn(events, 'hide');
        events.appendTo(ele);
    });

    it('Esc key press to hide testing ', () => {
        (document.getElementById('dialogInput') as HTMLInputElement).focus();
        eventArgs = { keyCode: 27, altKey: false, ctrlKey: false, shiftKey: false };
        events.keyDown(eventArgs);
        expect(document.getElementById("dialog2").classList.contains('e-popup-close')).toEqual(true);
    });
    afterAll(() => {
        destroyDialog(events);
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
            destroyDialog(dialog);
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
            function buttonClick() { }
            dialog = new Dialog({ header: "Dialog", buttons: [{ buttonModel: { content: "Ok" }, click: buttonClick },{ buttonModel: { content: "Cancel" }, click: buttonClick }], content: "Your information is updated successfully" }, '#dialog');
            dialog.destroy();
            expect(document.getElementById("dialog").classList.contains("e-dialog")).toEqual(false);
            dialog.show();
            expect(document.getElementById("dialog").classList.contains("e-popup-open")).toEqual(false);
            dialog.hide();
            expect(document.getElementById("dialog").classList.contains("e-popup-close")).toEqual(false);
        });

        it("Show Method and visible: propery value testing", () => {
            dialog = new Dialog({ animationSettings: { effect: 'None', duration: 0, delay: 0 }, header: "Dialog", visible: false, content: "Your information is updated successfully" }, '#dialog');
            dialog.show();
            expect(document.getElementById("dialog").classList.contains('e-popup-open')).toEqual(true);
            expect(dialog.visible).toEqual(true);
        });

        it("Modal dialog Show Method testing", () => {
            dialog = new Dialog({ target: document.body, isModal: true, animationSettings: { effect: 'None', duration: 0, delay: 0 }, header: "Dialog", visible: false, content: "Your information is updated successfully" }, '#dialog');
            dialog.show();
            dialog.refreshPosition();
            expect(document.getElementById("dialog").classList.contains('e-popup-open')).toEqual(true);
        });

        it("Full screen:true/false Method Testing", () => {
            dialog = new Dialog({ header: "Dialog", width: "200px", animationSettings: { effect: 'None' }, content: "Your information is updated successfully" }, '#dialog');
            dialog.show(true);
            expect(document.getElementById('dialog').classList.contains("e-dlg-fullscreen")).toEqual(true);
            dialog.show(false);
            expect(document.getElementById('dialog').classList.contains("e-dlg-fullscreen")).toEqual(false);
        });

        it("Full screen:true/false method testing with allowDragging true", () => {
            dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, allowDragging: true, width: "200px", content: "Your information is updated successfully" }, '#dialog');
            dialog.show(true);
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(false);
            dialog.show(false);
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
        });

        it("visible property:true testing", () => {
            dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: "Your information is updated successfully" }, '#dialog');
            expect(document.getElementById("dialog").classList.contains('e-popup-open')).toEqual(true);
        });

        it('cssClass testing', () => {
            dialog = new Dialog({ header: "Dialog", cssClass: "class1 class2" }, '#dialog');
            expect(document.getElementById('dialog').classList.contains('class1')).toEqual(true);
            expect(document.getElementById('dialog').classList.contains('class2')).toEqual(true);
        });

        it('showCloseIcon testing', () => {
            dialog = new Dialog({ header: "Dialog", showCloseIcon: true }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        });

        it('showCloseIcon without header testing', () => {
            dialog = new Dialog({ showCloseIcon: true }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        });

        it('showCloseIcon with header given as Template testing', () => {
            let headerTemplateContent = "<div>Template content</div>";
            dialog = new Dialog({ showCloseIcon: true, header: headerTemplateContent }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(1);
        });

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
            dialog = new Dialog({ showCloseIcon: false }, '#dialog');
            dialog.header = '';
            dialog.content = null;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-header").length).toBe(0);
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-content").length).toBe(0);
            dialog.showCloseIcon = true;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-icon-dlg-close").length).toBe(1);
        });

        it('getZindexPartial testing', () => {
            detach(document.querySelector('#dialog'));
            let wrapper: HTMLElement = createElement('div', { id: 'wrapper' });
            wrapper.style.zIndex = "10000";
            wrapper.style.position = "absolute";
            let ele: HTMLElement = createElement('div', { id: 'dialogCtrl12' });
            wrapper.appendChild(ele);
            document.body.appendChild(wrapper);
            dialog = new Dialog({ showCloseIcon: false }, '#dialogCtrl12');
            dialog.header = 'Dialog header';
            expect(document.getElementById('dialogCtrl12').style.zIndex).toEqual("10001");
            destroyDialog(dialog);
            dialog = undefined;
            detach(wrapper);
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

        it('position property offset value for x and y testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: '100', Y: '200' } }, '#dialog');
            expect((dialog.element as HTMLElement).style.left).toBe('100px');
            expect((dialog.element as HTMLElement).style.top).toBe('200px');
        });

        it('position property offset value for x and y testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: '100.5', Y: '200' } }, '#dialog');
            expect((dialog.element as HTMLElement).style.left).toBe('100.5px');
            expect((dialog.element as HTMLElement).style.top).toBe('200px');
        });

        it('position property offset value for x and y testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: '100', Y: '200.8' } }, '#dialog');
            expect((dialog.element as HTMLElement).style.left).toBe('100px');
            expect((dialog.element as HTMLElement).style.top).toBe('200.8px');
        });

        it('position property offset value for x and y testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: 'left', Y: '300' } }, '#dialog');
            expect(dialog.position.X).toBe('left');
            expect(dialog.position.Y).toBe(300);
        });

        it('position property offset value for x and y testing', () => {
            dialog = new Dialog({ header: "Dialog", position: { X: '300', Y: 'top' } }, '#dialog');
            expect(dialog.position.X).toBe(300);
            expect(dialog.position.Y).toBe('top');
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
            dialog = new Dialog({}, '#dialog');
            dialog.header = 'New Dialog';
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-header").length).toBe(1);
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
            dialog = new Dialog({
                content: dlgcontent, height: '200px',
                width: '300px',
                header: 'Dialog Header',
                isModal: true,
                visible: true,
                allowDragging: false
            });
            dialog.appendTo('#dialog');
            expect(document.getElementById('dialog').getAttribute('aria-modal')).toEqual('true');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(false);
            expect(parseInt(dialog.element.style.zIndex)).toBe(parseInt(dialog.element.parentElement.style.zIndex) + 1);
            expect(parseInt(dialog.element.style.zIndex) - 1).toBe(parseInt((dialog.element.nextSibling as HTMLElement).style.zIndex)+1);
        });

        it('allowdragging:true notify property with modal dialog and aria attribute testing', () => {
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({
                content: dlgcontent, height: '200px',
                width: '300px',
                header: 'Dialog Header',
                isModal: true,
                visible: true,
                allowDragging: true
            });
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
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });

        it('dialog events testing', (done) => {
            let dlgcontent: HTMLElement = createElement("div");
            let dialog = new Dialog({
                content: dlgcontent,
                animationSettings: { effect: 'None' },
                created: created, open: open, beforeOpen: beforeOpen, close: close, beforeClose: beforeClose,
                destroyed: onDestroy
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
            function onDestroy() {
                addClass([document.getElementById('dialog')], 'dlg-destroy');
            }
            expect(document.getElementById('dialog').classList.contains("created")).toEqual(true);
            expect(document.getElementById('dialog').classList.contains("open")).toEqual(true);
            expect(document.getElementById('dialog').classList.contains("beforeopen")).toEqual(true);
            expect(document.getElementById('dialog').classList.contains("close")).toEqual(true);
            expect(document.getElementById('dialog').classList.contains("beforeclose")).toEqual(true);
            expect(dialog.visible).toEqual(false);
            dialog.destroy();
            expect(document.getElementById('dialog').classList.contains("dlg-destroy")).toEqual(true);
            detach(dialog.element);
            done();
        });

        it('dialog isInteracted event testing', (done: Function) => {
            let dlgcontent: HTMLElement = createElement("div");
            let dialog = new Dialog({
                content: dlgcontent,
                animationSettings: { effect: 'None' },
                beforeClose: beforeClose
            }, '#dialog');
            dialog.hide();
            function beforeClose(args: BeforeCloseEventArgs) {
                expect(args.isInteracted).toEqual(false);
            }
            destroyDialog(dialog);
            dialog = undefined;
            done();
        });

        it('dialog allowdragging with target testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, target: target, allowDragging: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });

        it('dialog target declared as string testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, target: "#block", allowDragging: true }, '#dialog');
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });

        it('dialog without target testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            let dlgcontent: HTMLElement = createElement("div");
            dialog = new Dialog({ header: "Dialog", content: dlgcontent, allowDragging: true }, '#dialog');
            expect(dialog.target).not.toEqual(null);
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
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
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(2);
            expect((dialog as any).btnObj.length).toBe(2);
        });
        it('EJ2-22770-clear dialog buttons with empty object testing', () => {
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(2);
            dialog.buttons=[{}];
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(0);
        });
        it('EJ2-22770-clear dialog buttons  with empty array testing', () => {
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(2);
            dialog.buttons=[];
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(0);
        });
        it('EJ2-22770-dynamic dialog buttons testing', () => {
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent1, }, '#dialog');
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(0);
            dialog.buttons=[{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }]
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(2);
            expect((dialog as any).btnObj.length).toBe(2);
        });
        it('dialog getButtons testing', () => {
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect((dialog as any).getButtons().length).toBe(2);
            expect((dialog as any).getButtons(0).element.type).toEqual('button');
            expect((dialog as any).getButtons(1).element.type).toEqual('button');
        });

        it('dialog button type testing', () => {
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" }, type:'Submit' }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect((dialog as any).getButtons(0).element.type).toEqual('submit');
            expect((dialog as any).getButtons(1).element.type).toEqual('button');
        });

        it('dialog getButtons testing', () => {
            let dlgcontent1: HTMLElement = createElement("div");
            dlgcontent1.className = "samplecontent";
            dialog = new Dialog({ header: "Dialog", content: dlgcontent1, buttons: [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }], }, '#dialog');
            expect((dialog as any).getButtons(0).content).toEqual('left');
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
            let headerTemplateContent = "<div class='templateclass'>Template content</div>";
            dialog = new Dialog({ header: 'Dialog' }, '#dialog');
            dialog.header = headerTemplateContent;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-header .templateclass').length).toBe(1);
        });

        it('notify property change testing combination of header-content-footerTemplate', () => {
            let footerTemplateContent = "<div>Footer Template content</div>";
            dialog = new Dialog({}, '#dialog');
            dialog.header = 'New Dialog';
            dialog.content = 'New content updated successfully';
            dialog.footerTemplate = footerTemplateContent;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-content').length).toBe(1);
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-header').length).toBe(1);
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content').length).toBe(1);
            expect(document.getElementById('dialog').querySelectorAll('.e-icon-dlg-close').length).toBe(0);
        });

        it('Property change testing for footerTemplate as HTML element and string', () => {
            let footerTemplateContent: HTMLElement = createElement('div', {id: 'test'});
            footerTemplateContent.innerHTML = 'Footer Template content';
            document.body.appendChild(footerTemplateContent);
            dialog = new Dialog({ header: "New Dialog",content: "New content updated successfully" }, '#dialog');
            dialog.footerTemplate = document.getElementById('test');
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content').length).toBe(1);
            dialog.footerTemplate = "Footer template content";
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content').length).toBe(1);
        });

        it('Property change testing for header as HTML element and string', () => {
            let headerTemplateContent: HTMLElement = createElement('div', {id: 'test'});
            headerTemplateContent.innerHTML = 'Header Template content';
            document.body.appendChild(headerTemplateContent);
            dialog = new Dialog({ header: "New Dialog",content: "New content updated successfully" }, '#dialog');
            dialog.header = document.getElementById('test');
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-header-content').length).toBe(1);
            dialog.header = "Header template content";
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-header-content').length).toBe(1);
        });

        it('notify property changes testing combination of showCloseIcon and cssClass property', () => {
            dialog = new Dialog({ header: "Dialog", showCloseIcon: false }, '#dialog');
            dialog.showCloseIcon = true;
            dialog.cssClass = "css-classname";
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-header").length).toBe(1);
            expect(document.getElementById('dialog').classList.contains('css-classname')).toEqual(true);
        });

        it('notify property testing-showCloseIcon:true if header is not given,cssClass and dialog buttons Testing', () => {
            dialog = new Dialog({ header: "Dialog", buttons: [{ buttonModel: { content: 'Confirm' } }, { buttonModel: { content: 'Cancel' } }], showCloseIcon: true, cssClass: "oldCssClass" }, '#dialog');
            dialog.header = '';
            dialog.cssClass = 'newCssClass css-classname';
            dialog.buttons = [{ buttonModel: { content: "left" } }, { buttonModel: { content: "right" } }],
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-header").length).toBe(0);
            expect(document.getElementById('dialog').querySelectorAll('.e-footer-content .e-btn').length).toBe(2);
            expect(document.getElementById('dialog').classList.contains('newCssClass')).toEqual(true);
        });

        it('header given as Template testing and content property given as string-notify property changes', () => {
            let headerTemplateContent = "<div>Template content</div>";
            let newheaderTemplateContent = "<div class='newhdrtemplate'>New Template content</div>";
            dialog = new Dialog({ showCloseIcon: false, header: headerTemplateContent }, '#dialog');
            dialog.header = newheaderTemplateContent;
            dialog.content = "New content";
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-content").length).toBe(1);
            expect(document.getElementById('dialog').querySelectorAll('.e-dlg-header .newhdrtemplate').length).toBe(1);
        });

        it('Content notify property changes ', () => {
            dialog = new Dialog({ header: "Dialog", content: "Dialog content", showCloseIcon: false }, '#dialog');
            dialog.content = "New content";
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-content")[0].innerHTML).toEqual("New content");
        });

        it('Content notify property initialization ', () => {
            dialog = new Dialog({ header: "Dialog", showCloseIcon: false }, '#dialog');
            dialog.content = "New content";
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-content")[0].innerHTML).toEqual("New content");
        });

        it('Content as null in notify property changes', () => {
            dialog = new Dialog({ header: "Dialog", content: "Dialog content", showCloseIcon: false }, '#dialog');
            dialog.content = null;
            dialog.dataBind();
            expect(document.getElementById('dialog').querySelectorAll(".e-dlg-content").length).toBe(0);
        });

        it('Modal dialog:true notify property and aria attr testing', () => {
            dialog = new Dialog({}, '#dialog');
            dialog.overlayClick = function () {
                dialog.hide();
            }
            dialog.isModal = true;
            dialog.dataBind();
            dialog.zIndex = 3000;
            dialog.dataBind();
            expect(document.getElementById('dialog').classList.contains("e-dlg-modal")).toBe(true);
            expect(document.getElementById('dialog').getAttribute('aria-modal')).toEqual('true');
            expect((<any>document.getElementsByClassName('e-dlg-container')[0]).style.display).not.toEqual('none');
            expect(dialog.element.parentElement.style.zIndex).toEqual("3000");
        });

        it('Modal dialog:false notify property and aria attr testing', () => {
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, isModal: true }, '#dialog');
            dialog.isModal = false;
            dialog.dataBind();
            expect(document.getElementById("dialog").classList.contains('e-popup-open')).toEqual(true);
            expect(document.getElementsByClassName('e-dlg-overlay').length).toEqual(0);
            expect(document.getElementById('dialog').getAttribute('aria-modal')).toEqual('false');
        });

        it('Modal dialog:true body scroll disabled testing', () => {
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, isModal: true }, '#dialog');
            dialog.dataBind();
            expect(document.body.classList.contains('e-scroll-disabled')).toBe(true);
        });

        it('Header notify property testing with Draggable', () => {
            dialog = new Dialog({ showCloseIcon: true, isModal: false, allowDragging: true }, '#dialog');
            dialog.header = "Draggable Dialog";
            dialog.dataBind();
            expect(document.getElementById('dialog').classList.contains("e-draggable")).toEqual(true);
        });

        it('showCloseIcon notify property testing when header is given to empty', () => {
            dialog = new Dialog({ showCloseIcon: true, isModal: false }, '#dialog');
            dialog.showCloseIcon = false;
            dialog.dataBind();
            expect(document.getElementById('dialog').classList.contains("e-dlg-header-content")).toEqual(false);
        });

        it('Modal dialog:false with target-notify  property testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({ showCloseIcon: true, isModal: true, animationSettings: { effect: 'None' }, target: target }, '#dialog');
            dialog.isModal = false;
            dialog.dataBind();
            expect(document.getElementById("block").children[0].classList.contains('e-dialog')).toEqual(true);
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });

        it('Modal dialog:true and position with target-notify property testing', () => {
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
            expect((dialog as any).popupObj.relateTo === document.body).toEqual(true);
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });

        it('Modal dialog:false and position for enum type with target-notify property testing', () => {
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
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });

        it('Modal dialog:true and position for enum type with target-notify property testing', () => {
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
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });

        it('Modal dialog with target property- testing', () => {
            let target: HTMLElement = createElement('div', { id: 'block' });
            document.body.appendChild(target);
            dialog = new Dialog({ showCloseIcon: true, animationSettings: { effect: 'None' }, isModal: true, target: target }, '#dialog');
            expect(document.getElementById("block").children[0].classList.contains('e-dlg-container')).toEqual(true);;
            destroyDialog(dialog);
            dialog = undefined;
            detach(target);
        });
    });
});

describe("getZindexPartial-", function () {
    let dialog: Dialog;
    let wrapper: HTMLElement;
    beforeEach(() => {
        wrapper = createElement('div', { id: 'wrapper' });
        wrapper.style.zIndex = "10000";
        wrapper.style.position = "absolute";
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        wrapper.appendChild(ele);
        document.body.appendChild(wrapper);
        dialog = new Dialog({ showCloseIcon: false }, '#dialog');
        dialog.header = 'Dialog header';
    });
    it('getZindexPartial upto body element testing', () => {
        expect(document.getElementById('dialog').style.zIndex).toEqual("10001");
    });
    afterEach(() => {
        destroyDialog(dialog);
        detach(wrapper);
    });
});

describe('Drag related events testing', () => {
    let dragEle: HTMLElement;
    let dialog: Dialog;
    let mousemove: any;
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
        mousemove = setMouseCoordinates(mousemove, 5, 5);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
        expect((dialog.element as HTMLElement).style.left).toBe('8px');
        expect((dialog.element as HTMLElement).style.top).toBe('8px');
    });
    afterEach(() => {
        destroyDialog(dialog);
    });
});

describe('Position property testing using string type', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('Initial and dynamic change on position property using custom values', () => {
        dialog = new Dialog({ header: "Dialog", position: { X: "100", Y: "200" } }, '#dialog');
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
        expect((dialog.element as HTMLElement).style.top).toBe('200px');
        dialog.position = { X: "100", Y: "400" };
        dialog.dataBind();
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
    });
    it('Initial and dynamic change on position property using custom values', () => {
        dialog = new Dialog({ header: "Dialog", position: { X: 100, Y: 200 } }, '#dialog');
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
        expect((dialog.element as HTMLElement).style.top).toBe('200px');
        dialog.position = { X: 100, Y: 400 };
        dialog.dataBind();
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
    });
    it('Initial and dynamic change on position property default positions', () => {
        dialog = new Dialog({ header: "Dialog", position: { X: "center", Y: "center" } }, '#dialog');
        expect(document.getElementById("dialog").children[0].classList.contains('e-dlg-center-center')).toEqual(false);
        dialog.position = { X: "center", Y: "top" };
        dialog.dataBind();
        expect(document.getElementById("dialog").children[0].classList.contains('e-dlg-center-top')).toEqual(false);
    });
    it('Initial and dynamic change on position property using custom values for Modal dialog', () => {
        dialog = new Dialog({ header: "Dialog", position: { X: "100", Y: "200" }, isModal: true }, '#dialog');
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
        expect((dialog.element as HTMLElement).style.top).toBe('200px');
        dialog.position = { X: "100", Y: "400" };
        dialog.dataBind();
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
    });
    it('Initial and dynamic change on position property using custom values for Modal dialog', () => {
        dialog = new Dialog({ header: "Dialog", position: { X: 100, Y: 200 }, isModal: true }, '#dialog');
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
        expect((dialog.element as HTMLElement).style.top).toBe('200px');
        dialog.position = { X: 100, Y: 400 };
        dialog.dataBind();
        expect((dialog.element as HTMLElement).style.left).toBe('100px');
    });
    it('Initial and dynamic change on position property default position for Modal dialog', () => {
        dialog = new Dialog({ header: "Dialog", position: { X: "center", Y: "center" }, isModal: true }, '#dialog');
        expect(document.getElementById("dialog").parentElement.classList.contains('e-dlg-center-center')).toEqual(true);
        dialog.position = { X: "center", Y: "top" };
        dialog.dataBind();
        expect(document.getElementById("dialog").parentElement.classList.contains('e-dlg-center-top')).toEqual(true);
    });
});

describe('Dialog max-height testing', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('If the Max-height is empty', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent,
            beforeOpen: onBeforeOpen
        }, '#dialog');
        function onBeforeOpen(args: any) {
            args.maxHeight = '';
        }
        dialog.show();
        expect(document.getElementById('dialog').style.maxHeight).toEqual("");
    });
    it('If the Max-height is set', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent,
            beforeOpen: onBeforeOpen
        }, '#dialog');
        function onBeforeOpen(args: any) {
            args.maxHeight = '300px';
        }
        dialog.show();
        expect(document.getElementById('dialog').style.maxHeight).toEqual("300px");
    });
    it('If the Max-height is empty in modal dialog', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent, isModal: true,
            beforeOpen: onBeforeOpen
        }, '#dialog');
        function onBeforeOpen(args: any) {
            args.maxHeight = '';
        }
        dialog.show();
        expect(document.getElementById('dialog').style.maxHeight).toEqual("");
    });
    it('If the Max-height is set in modal dialog', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent, isModal: true,
            beforeOpen: onBeforeOpen
        }, '#dialog');
        function onBeforeOpen(args: any) {
            args.maxHeight = '300px';
        }
        dialog.show();
        expect(document.getElementById('dialog').style.maxHeight).toEqual("300px");
    });
});

describe('Dialog focus testing', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('If the Dialog is normal dialog with buttons', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent,
            open: onOpen, 
            buttons: [{
                buttonModel: { isPrimary: true, content: 'Confirm' } }, 
                { buttonModel: { content: 'Close' } }
            ]
        }, '#dialog');
        function onOpen(args: any) {
            args.preventFocus = true;
        }
        dialog.show();
        expect(document.activeElement).toEqual(document.body);
    });
    it('If the Dialog is modal dialog with buttons', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent, isModal: true,
            open: onOpen,
            buttons: [{
                buttonModel: { isPrimary: true, content: 'Confirm' } }, 
                { buttonModel: { content: 'Close' } }
            ]
        }, '#dialog');
        function onOpen(args: any) {
            args.preventFocus = true;
        }
        dialog.show();
        expect(document.activeElement).toEqual(document.body);
    });
    it('If the Dialog is modal dialog', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent,
            open: onOpen, showCloseIcon: true
        }, '#dialog');
        function onOpen(args: any) {
            args.preventFocus = true;
        }
        dialog.show();
        expect(document.activeElement).toEqual(document.body);
    });
    it('If the Dialog is modal dialog', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent, isModal: true,
            open: onOpen, showCloseIcon: true
        }, '#dialog');
        function onOpen(args: any) {
            args.preventFocus = true;
        }
        dialog.show();
        expect(document.activeElement).toEqual(document.body);
    });
});

describe('Dialog min height testing', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('Min - height testing', () => {
        let dlgcontent: HTMLElement = createElement("div");
        dialog = new Dialog({
            content: dlgcontent,
            minHeight: '200px',
            buttons: [{
                buttonModel: { isPrimary: true, content: 'Confirm' } }, 
                { buttonModel: { content: 'Close' } }
            ]
        }, '#dialog');
        dialog.show();
        expect(document.getElementById("dialog").style.minHeight === '200px').toBe(true);
    });
});

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
            destroyDialog(events);
        });
    });

    describe('Set the primary Button to second button element', () => {
        let events: any;
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
            destroyDialog(events);
        });
    });

    describe('Ensure the focus element after tab key press', () => {
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
            destroyDialog(events);
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
            destroyDialog(events);
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
               // expect((document.activeElement as HTMLElement).classList.contains('comment')).toBe(true);
                done();
            },200);
        });

        afterAll((): void => {
            destroyDialog(events);
        });
    });

    describe('focus action innerHTML', () => {
        let events: any;
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
            destroyDialog(events);
        });
    });

    describe('focus action in modal dialog overlayclick', () => {
        let events: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('div', { id: 'dialog', innerHTML: 'This is a dialog content' });
            document.body.appendChild(ele);
            events = new Dialog({
                closeOnEscape: true,
                animationSettings: { effect: 'None' },
                buttons: [{
                    buttonModel: { isPrimary: true, content: "confirm" }, click: function () {
                        this.hide();
                    }
                }],
                isModal: true
            });
            events.appendTo(ele);
        });

        it('Focus the primary button if overlayclicked', () => {
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-dlg-overlay'))[0];
            ele1.click();
            expect(document.activeElement.classList.contains("e-primary")).toBe(true);
        });

        afterAll((): void => {
            destroyDialog(events);
        });
    });
});

describe('visible:false Property ', () => {
    let dialog: Dialog;
    beforeEach(() => {
        dialog = undefined;
    });
    afterEach(() => {
        destroyDialog(dialog);
    });
    it('visible property:false testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialogctrl15' });
        document.body.appendChild(ele);
        dialog = new Dialog({ visible: false }, '#dialogctrl15');
        expect(document.getElementById("dialogctrl15").classList.contains('e-popup-close')).toEqual(true);
        expect(dialog.visible).toEqual(false);
    });
    it('visible property:false on dynamic change testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialogctrl25' });
        document.body.appendChild(ele);
        dialog = new Dialog({ visible: true }, '#dialogctrl25');
        expect(dialog.visible).toEqual(true);
        dialog.visible = false;
        dialog.dataBind();
        expect(document.getElementById("dialogctrl25").classList.contains('e-popup-close')).toEqual(true);
        expect(dialog.visible).toEqual(false);
    });
    it('visible property:false with modal enabled testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialogctrl14' });
        document.body.appendChild(ele);
        dialog = new Dialog({ visible: false, isModal: true }, '#dialogctrl14');
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
        dialog = new Dialog({ visible: false, target: document.body, isModal: true  }, '#dialogctrl31');
        dialog.isModal = false;
        dialog.dataBind();
        expect(document.getElementById("dialogctrl31").classList.contains('e-popup-close')).toEqual(true);
        expect(dialog.visible).toEqual(false);
        expect(dialog.isModal).toEqual(false);
    });
});

describe('visible:false:notify Property ', () => {
    let dialog: Dialog;
    beforeAll(() => {
        dialog = undefined;
    });
    afterAll(() => {
        destroyDialog(dialog);
    });
    it('visible notify property testing', () => {
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({ visible: false }, '#dialog');
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('visible:true:notify Property ', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialogctrl' });
        document.body.appendChild(ele);
        let footerTemplateContent = "<div>Footer Template content</div>";
        dialog = new Dialog({ header: "Dialog", visible: false, animationSettings: { effect: 'None' }, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialogctrl');
        dialog.visible = true;
        dialog.dataBind();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        destroyDialog(dialog);
    });
    it('visible:true notify property testing', () => {
        expect(document.getElementById("dialogctrl").classList.contains('e-popup-open')).toEqual(true);
    });
});

describe('Close icon ', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        let footerTemplateContent = "<div>Footer Template content</div>";
        dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialog');
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-icon-dlg-close'))[0];
        ele1.click();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        destroyDialog(dialog);
    });
    it('click event testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('Modal Dialog Testing ', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({ animationSettings: { effect: 'None' }, showCloseIcon: true, isModal: true }, '#dialog');
        dialog.overlayClick = function () {
            dialog.hide();
        }
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-dlg-overlay'))[0];
        ele1.click();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        destroyDialog(dialog);
    });
    it('Overlay click event testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('Dialog Modal', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        function buttonClick() { }
        dialog = new Dialog({ animationSettings: { effect: 'None' }, buttons: [{ buttonModel: { content: "Confirm" }, click: buttonClick }, { buttonModel: { content: "close" } }], showCloseIcon: true, isModal: true }, '#dialog');
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-btn'))[0];
        ele1.click();
        dialog.hide();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        destroyDialog(dialog);
    });
    it('Left Button click event testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('Dialog', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeEach((done: Function) => {
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
    afterEach(() => {
        destroyDialog(dialog);
    });
    it("locale property testing", () => {
        dialog = new Dialog({ header: "Dialog", locale: 'en-US', showCloseIcon: true, animationSettings: { effect: 'None' }, content: "Your information is updated successfully" }, '#dialog');
        dialog.locale = 'de-DE';
        dialog.dataBind();
        expect(document.getElementsByClassName('e-dlg-closeicon-btn')[0].getAttribute('title')).toEqual("schlieen");
    })

    it('isDevice Condition check', () => {
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidUserAgent;
        dialog = new Dialog({ content: "Your information is updated successfully" }, '#dialog');
        expect(document.getElementById('dialog').classList.contains('e-device')).toBe(true);
    });
});

describe('Dialog Modal', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    let target: HTMLElement;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        target = createElement('div', { id: 'block' });
        document.body.appendChild(target);
        dialog = new Dialog({ animationSettings: { effect: 'None' }, target: target, showCloseIcon: true, isModal: true }, '#dialog');
        dialog.overlayClick = function () {
            dialog.hide();
        }
        dialog.dataBind();
        let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-dlg-overlay'))[0];
        ele1.click();
        setTimeout(() => { done(); }, 500);
    });
    afterAll(() => {
        destroyDialog(dialog);
        detach(target);
    });
    it('with target testing', () => {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('Dialog', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({ showCloseIcon: true, content: 'Dialog content', position: { X: 'center', Y: 'center' } }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        destroyDialog(dialog);
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
        dialog = new Dialog({ showCloseIcon: true, content: 'Dialog content' }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        destroyDialog(dialog);
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
    it('Change isModal and showCloseIcon', function () {
        dialog.isModal=true;
        dialog.showCloseIcon=true;
        dialog.dataBind();
        expect(document.getElementsByClassName('e-dlg-modal').length).toBe(1);
        expect(document.getElementsByClassName('e-dlg-modal').length).toBe(1);
    });
});

describe('Position for modal dialog', () => {
    let ele: HTMLElement;
    let dialog: Dialog;
    beforeAll((done: Function) => {
        ele = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({ showCloseIcon: true, content: 'Dialog content',  position: { X: 200, Y: 300 }, isModal: true }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        destroyDialog(dialog);
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
        function cancelEvents(args: any) {
            args.cancel = true;
        }
        dialog = new Dialog({ showCloseIcon: true, beforeOpen: cancelEvents, beforeClose: cancelEvents, content: 'Dialog content',  position: { X: 200, Y: 300 }, isModal: true }, '#dialog');
        dialog.dataBind();
        setTimeout(() => { done(); }, 10);
    });
    afterAll(() => {
        destroyDialog(dialog);
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
        destroyDialog(dialog);
    });
});

describe("Dialog with animation", function () {
    let dialog: Dialog;
    beforeEach(function (done) {
        let footerTemplateContent = "<div>Footer Template content</div>";
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({ header: "Dialog", animationSettings: { effect: 'Fade', delay: 0, duration: 0 }, content: "Dialog content", footerTemplate: footerTemplateContent, showCloseIcon: true }, '#dialog');
        dialog.hide();
        done();
    });
    afterAll((): void => {
        destroyDialog(dialog);
    });
    it("Fade-In and Out animation", function () {
        expect(document.getElementById("dialog").classList.contains('e-popup-close')).toEqual(true);
    });
});

describe("notify property testig-All properties combination", function () {
    let originalTimeout: number;
    let dialog1: Dialog;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;
    });

    it(' Dialog control notify property testig-All properties combination', (done) => {
        let ele1: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele1);
        let footerTemplateContent1 = "<div>Footer Template content</div>";
        let newfooterTemplateContent1 = "<div class='newftrtemplate'>Footer Template content</div>";
        dialog1 = new Dialog({ header: "Dialog", animationSettings: { effect: 'None' }, content: "Dialog content", footerTemplate: footerTemplateContent1, showCloseIcon: true }, '#dialog1');
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
        destroyDialog(dialog1);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});

describe('Maximum Zindex value testing for modal dialog', () => {
    let dialog: any;
    let mazIndexElement: any;
    beforeAll(() => {
        mazIndexElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(mazIndexElement);
        mazIndexElement.style.zIndex = '2147483647';
        mazIndexElement.style.position = 'relative';
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        dialog = new Dialog({header:'Demo', isModal: true, content:'First demo content' });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
        detach(mazIndexElement);
    });
    it('dialog Zindex', () => {
        expect(dialog.zIndex).toEqual(2147483647);
        expect(dialog.element.style.zIndex).toEqual('2147483647');
        expect((document.querySelector('.e-dlg-container .e-dlg-overlay') as HTMLElement).style.zIndex).toEqual('2147483646');
    });
});

describe('Maximum Zindex value testing for non modal dialog', () => {
    let dialog: any;
    let mazIndexElement: any;
    beforeAll(() => {
        mazIndexElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(mazIndexElement);
        mazIndexElement.style.zIndex = '2147483647';
        mazIndexElement.style.position = 'relative';
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        dialog = new Dialog({header:'Demo', content:'First demo content' });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
        detach(mazIndexElement);
    });
    it('dialog Zindex', () => {
        expect(dialog.zIndex).toEqual(2147483647);
        expect(dialog.element.style.zIndex).toEqual('2147483647');
    });
});

describe('Testing resizing option with target body', () => {
    let dialog: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        dialog = new Dialog({header:'Demo', visible: false, content:'First demo content', enableResize: true });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
    });
    it('Checking handlers', () => {
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        dialog.enableResize = false;
        dialog.show();
        dialog.dataBind();
        expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
    });

    it('Enabling resize through onproperty change', () => {
        dialog.enableResize = true;
        dialog.dataBind();
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
    });
});

describe('Testing resizing option with selected target', () => {
    let dialog: any;
    let resizeTarget: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        resizeTarget = createElement('div', { id: 'resizeTarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '500px';
        resizeTarget.style.height = '500px';
        resizeTarget.style.position = 'relative';
        dialog = new Dialog({header:'Demo', target: '#resizeTarget', content:'First demo content', enableResize: true, animationSettings: {effect: 'Zoom'} });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
        detach(resizeTarget);
    });
    it('Checking handlers', () => {
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        expect(dialog.element.classList.contains('e-dlg-resizable')).toBe(true);
        dialog.enableResize = false;
        dialog.dataBind();
        expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        expect(dialog.element.classList.contains('e-dlg-resizable')).toBe(false);
    });

    it('Enabling resize through onproperty change', () => {
        dialog.enableResize = true;
        dialog.dataBind();
        expect(!isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        expect(dialog.element.classList.contains('e-dlg-resizable')).toBe(true);
        dialog.enableRtl = true;
        dialog.dataBind();
        expect(!isNullOrUndefined(document.querySelector('.e-south-west'))).toBe(true);
        expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
    });
});

describe('Testing resizing option without animation effects', () => {
    let dialog: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        dialog = new Dialog({header:'Demo',
        content:'First demo content',
        open: function() {
            expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(true);
        },
        enableResize: true,
        animationSettings: {effect: 'None'}
         });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
    });
    it('check handler element in DOM', (done) => {
        setTimeout(() => {
            expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(false);
            done()
        }, 100);
    });
});

describe('Testing resizing option with animation effects', () => {
    let dialog: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        dialog = new Dialog({header:'Demo',
        content:'First demo content',
        open: function() {
            expect(isNullOrUndefined(document.querySelector('.e-south-east'))).toBe(false);
        },
        enableResize: true,
        animationSettings: {effect: 'Zoom'}
         });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
    });
});

describe('Testing resizing option with RTL mode', () => {
    let dialog: any;
    let resizeTarget: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        resizeTarget = createElement('div', { id: 'resizeTarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '500px';
        resizeTarget.style.height = '500px';
        resizeTarget.style.position = 'relative';
        dialog = new Dialog({header:'Demo', target: document.body, isModal: true, content:'First demo content', enableResize: true });
        dialog.appendTo('#dialog1');
    });
    afterAll(() => {
        destroyDialog(dialog);
        detach(resizeTarget);
    });
    it('RTL Mode', (done) => {
        expect(!isNullOrUndefined(dialog.element.classList.contains('e-viewport'))).toBe(true);
        dialog.enableRtl = true;
        dialog.dataBind();
        expect(!isNullOrUndefined(dialog.element.classList.contains('e-resize-left'))).toBe(true);
        dialog.enableRtl = false;
        dialog.dataBind();
        expect(!isNullOrUndefined(dialog.element.classList.contains('e-viewport'))).toBe(true);
        done();
    });
});

describe('Testing resize Events', () => {
    let dialog: any;
    let resizeTarget: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        resizeTarget = createElement('div', { id: 'resizeTarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '500px';
        resizeTarget.style.height = '500px';
        resizeTarget.style.position = 'relative';
        dialog = new Dialog({
            header:'Demo',
            target: document.body,
            content:'First demo content',
            enableResize: true,
            resizeStart: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(true)
            }, 
            resizing: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(true)
            },
            resizeStop : function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(false)
            }
         });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
        detach(resizeTarget);
    });
    it('Mouse events', (done) => {
        let mouseEvent = document.createEvent ('MouseEvents');
        mouseEvent.initEvent ('mousedown', true, true);
        (document.querySelector('.e-south-east') as HTMLElement).dispatchEvent (mouseEvent);
        mouseEvent.initEvent ('mousemove', true, true);
        (document.querySelector('.e-south-east') as HTMLElement).dispatchEvent(mouseEvent);
        mouseEvent.initEvent ('mouseup', true, true);
        document.dispatchEvent(mouseEvent);
        done()
    });
});

describe('Testing args.cancel', () => {
    let dialog: any;
    let resizeTarget: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        resizeTarget = createElement('div', { id: 'resizeTarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '500px';
        resizeTarget.style.height = '500px';
        resizeTarget.style.position = 'relative';
        dialog = new Dialog({
            header:'Demo',
            target: document.body,
            content:'First demo content',
            enableResize: true,
            resizeStart: function (args : any) {
                args.cancel = true;
            }, 
         });
        dialog.appendTo('#dialog1');
    });
    afterAll(() => {
        destroyDialog(dialog);
        detach(resizeTarget);
    });
    it('Check args.cancel', (done) => {
        let mouseEvent = document.createEvent ('MouseEvents');
        mouseEvent.initEvent ('mousedown', true, true);
        expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(false);
        done()
    });
});

describe('Testing resizing option', () => {
    let dialog: any;
    let computedHeaderHeight: string;
    let headerHeight: number;
    let resizeTarget: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        resizeTarget = createElement('div', { id: 'resizeTarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '500px';
        resizeTarget.style.height = '500px';
        resizeTarget.style.position = 'relative';

        dialog = new Dialog({
            header:'Demo', 
            target: document.body, isModal: true, content:'First demo content', 
            enableResize: true,
            open: function() {
                computedHeaderHeight = getComputedStyle(dialog.headerContent).height;
                headerHeight = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
                expect(isNullOrUndefined(headerHeight)).toBe(false);
                expect(isNaN(headerHeight)).toBe(false);
            }
         });
        dialog.appendTo('#dialog1');
    });

    afterAll(() => {
        destroyDialog(dialog);
        detach(resizeTarget);
    });
    it('Check the minHeight issue', () => {
        dialog.hide();
        dialog.refresh();
        dialog.show();
        computedHeaderHeight = getComputedStyle(dialog.headerContent).height;
        headerHeight = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
        expect(isNullOrUndefined(headerHeight)).toBe(false);
        expect(isNaN(headerHeight)).toBe(false);
    });
});

describe('confirm utility dialog without modal and default button actions', () => {
    let dialog: Dialog;
    beforeAll(() => {
        dialog = DialogUtility.confirm({
            isModal: false,
            showCloseIcon: false,
            cssClass: 'sample',
            zIndex: 250,
            open: function () {
                addClass([document.querySelector('.e-confirm-dialog')], 'open');
            },
            close: function () {
                addClass([document.querySelector('.e-confirm-dialog')], 'close');
            }
        });
    });
    afterAll(() => {
        destroyDialog(dialog);
    });
    it('confirm utility - cssClass Checking', (done: Function) => {
        expect(document.getElementsByClassName('e-confirm-dialog')[0].classList.contains('sample')).toBe(true);
        (<HTMLElement>document.getElementsByClassName('e-confirm-dialog')[0]).style.zIndex === '250';
        setTimeout(() => {
            expect(document.querySelector('.e-confirm-dialog').classList.contains("open")).toEqual(true);
            expect(document.querySelector('.e-confirm-dialog').classList.contains("close")).toEqual(false);
            done();
        }, 500);
    });
});

describe('alert utility dialog without model', () => {
    let dialog: Dialog;
    beforeAll(() => {
        dialog = DialogUtility.alert({
            isModal: false,
            showCloseIcon: false,
            cssClass: 'sample',
            zIndex: 250,
            open: function () {
                addClass([document.querySelector('.e-alert-dialog')], 'open');
            },
            close: function () {
                addClass([document.querySelector('.e-alert-dialog')], 'close');
            }
        });
    });
    afterAll(() => {
        destroyDialog(dialog);
    });
    it('alert utility - cssClass Checking', (done: Function) => {
        expect(document.getElementsByClassName('e-alert-dialog')[0].classList.contains('sample')).toBe(true);
        (<HTMLElement>document.getElementsByClassName('e-alert-dialog')[0]).style.zIndex === '250';
        setTimeout(() => {
            expect(document.querySelector('.e-alert-dialog').classList.contains("open")).toEqual(true);
            expect(document.querySelector('.e-alert-dialog').classList.contains("close")).toEqual(false);
            done();
        }, 500);
    });
});

describe('F144624 - Issue with resizing when renders Grid inside the Dialog', () => {
    let dialog: any;
    let resizeTarget: any;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'dialog1' });
        document.body.appendChild(ele);
        resizeTarget = createElement('div', { id: 'resizeTarget' });
        document.body.appendChild(resizeTarget);
        resizeTarget.style.width = '500px';
        resizeTarget.style.height = '500px';
        resizeTarget.style.position = 'relative';
    });
    afterAll(() => {
        destroyDialog(dialog);
        detach(resizeTarget);
    });
    afterEach(() => {
        dialog.destroy();
    });
    it('Without footer element to getMinHeight testing', (done: Function) => {
        dialog = new Dialog({
            header: 'Delete Multiple Items',
            showCloseIcon: true,
            content: 'Test',
            enableResize: true,
            height: '400px',
            width: '300px',
            resizeStart: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(true)
            },
            resizing: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(true)
            },
            resizeStop: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(false)
            }
        });
        dialog.appendTo('#dialog1');
        let mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent('mousedown', true, true);
        (document.querySelector('.e-south-east') as HTMLElement).dispatchEvent(mouseEvent);
        mouseEvent.initEvent('mousemove', true, true);
        (document.querySelector('.e-south-east') as HTMLElement).dispatchEvent(mouseEvent);
        mouseEvent.initEvent('mouseup', true, true);
        document.dispatchEvent(mouseEvent);
        done();
    });
    it('With footer element to getMinHeight testing', (done: Function) => {
        dialog = new Dialog({
            header: 'Delete Multiple Items',
            showCloseIcon: true,
            content: 'Test',
            enableResize: true,
            height: '400px',
            width: '300px',
            buttons: [{ buttonModel: { content: "Ok" } }],
            resizeStart: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(true)
            },
            resizing: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(true)
            },
            resizeStop: function () {
                expect((document.querySelector('.e-south-east') as HTMLElement).classList.contains('e-focused-handle')).toBe(false)
            }
        });
        dialog.appendTo('#dialog1');
        let mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent('mousedown', true, true);
        (document.querySelector('.e-south-east') as HTMLElement).dispatchEvent(mouseEvent);
        mouseEvent.initEvent('mousemove', true, true);
        (document.querySelector('.e-south-east') as HTMLElement).dispatchEvent(mouseEvent);
        mouseEvent.initEvent('mouseup', true, true);
        document.dispatchEvent(mouseEvent);
        done();
    });
});

describe('EJ2-33264 - Contents are overflowed outside of Dialog element in IE browser', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('IE Height issue coverage', () => {
        (window as any).browserDetails['isIE'] = true;
        dialog = new Dialog({ header: "Dialog", width: "250px" }, '#dialog');
        expect(document.getElementById("dialog").style.width).toEqual("250px");
        (window as any).browserDetails['isIE'] = false;
    });
});

describe('EJ2-33526 XSS attack prevention', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({
            header: 'Demo', content: '<script>alert("1")</script>',
            beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                args.cancel = true;
                args.helper = (value: string) => {
                    return value;
                }
            }
        });
        dialog.appendTo('#dialog');
    });
    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('check the script element', () => {
        expect(((<any>dialog).contentEle.querySelectorAll('script')).length).toBeGreaterThan(0);
    });
});

describe('EJ2-33526 XSS attack prevention', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({
            header: 'Demo', content: '<style>bod{width:100px;}</style>',
            beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                args.selectors.tags.push('style');
            }
        });
        dialog.appendTo('#dialog');
    });

    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('check the style element', () => {
        expect(((<any>dialog).contentEle.querySelectorAll('style')).length).toBe(0);
    });
});

describe('EJ2-33526 prevent xss at initial render', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({
            header: 'Demo', content: '<style>bod{width:100px;}</style>'
        });
        dialog.appendTo('#dialog');
    });

    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('check the style element', () => {
        expect(((<any>dialog).contentEle.querySelectorAll('style')).length).toBe(0);
    });
});

describe('EJ2-33526 enableHtmlSanitizer as false', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({
            header: 'Demo', content: '<style>bod{width:100px;}</style>',
            enableHtmlSanitizer: false
        });
        dialog.appendTo('#dialog');
    });

    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('check the style element', () => {
        expect(((<any>dialog).contentEle.querySelectorAll('style')).length).toBe(1);
    });
});

describe('EJ2-34370- web accessebility issue', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        dialog = undefined;
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
        dialog = new Dialog({
            header: 'Demo', content: 'dialog content',
            showCloseIcon: true
        });
        dialog.appendTo('#dialog');
    });

    afterEach((): void => {
        destroyDialog(dialog);
    });
    it('check aria-attribute', () => {
        expect(document.querySelectorAll(".e-dlg-closeicon-btn")[0].getAttribute("aria-label")).toEqual("Close");
    });
});

describe('EJ2-34298 - Destroy method correction testing', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        document.body.appendChild(ele);
    });
    it('Modal Dialog - After destroy classlist availability testing', () => {
        dialog = undefined;
        dialog = new Dialog({
            header: 'Demo',
            content: 'dialog content',
            showCloseIcon: true,
            isModal: true,
            allowDragging: true,
            enableResize: true,
            enableRtl: true,
            cssClass: 'testClass'
        });
        dialog.appendTo('#dialog');
        dialog.destroy();
        let targetEle: HTMLElement = document.querySelector('#dialog') as HTMLElement;
        expect(targetEle.innerHTML).toEqual('');
        expect(targetEle.classList.contains('e-dialog')).toEqual(false);
        expect(targetEle.classList.contains('e-rtl')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-resizable')).toEqual(false);
        expect(targetEle.classList.contains('e-restrict-left')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-modal')).toEqual(false);
        expect(targetEle.classList.contains('testClass')).toEqual(false);
        expect(document.body.classList.contains('e-scroll-disabled')).toEqual(false);
        expect(targetEle.getAttribute('role')).toEqual(null);
        expect(targetEle.getAttribute('aria-modal')).toEqual(null);
        expect(targetEle.getAttribute('aria-labelledby')).toEqual(null);
        expect(targetEle.getAttribute('aria-describedby')).toEqual(null);
        expect(targetEle.getAttribute('aria-grabbed')).toEqual(null);
        expect(targetEle.getAttribute('tabindex')).toEqual(null);
        expect(targetEle.getAttribute('style')).toEqual(null);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        detach(dialog.element);
    });
    it('Normal Dialog - After destroy classlist availability testing', () => {
        dialog = undefined;
        dialog = new Dialog({
            header: 'Demo',
            content: 'dialog content',
            showCloseIcon: true,
            allowDragging: true,
            enableResize: true,
            enableRtl: true,
            cssClass: 'testClass'
        });
        dialog.appendTo('#dialog');
        dialog.destroy();
        let targetEle: HTMLElement = document.querySelector('#dialog') as HTMLElement;
        expect(targetEle.innerHTML).toEqual('');
        expect(targetEle.classList.contains('e-dialog')).toEqual(false);
        expect(targetEle.classList.contains('e-rtl')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-resizable')).toEqual(false);
        expect(targetEle.classList.contains('e-restrict-left')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-modal')).toEqual(false);
        expect(targetEle.classList.contains('testClass')).toEqual(false);
        expect(document.body.classList.contains('e-scroll-disabled')).toEqual(false);
        expect(targetEle.getAttribute('role')).toEqual(null);
        expect(targetEle.getAttribute('aria-modal')).toEqual(null);
        expect(targetEle.getAttribute('aria-labelledby')).toEqual(null);
        expect(targetEle.getAttribute('aria-describedby')).toEqual(null);
        expect(targetEle.getAttribute('aria-grabbed')).toEqual(null);
        expect(targetEle.getAttribute('tabindex')).toEqual(null);
        expect(targetEle.getAttribute('style')).toEqual(null);
        detach(dialog.element);
    });
});

describe('EJ2-34298 - Template - Destroy method correction testing', () => {
    let dialog: Dialog;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', { id: 'dialog' });
        ele.innerHTML = 'testing';
        document.body.appendChild(ele);
    });
    it('Modal Dialog - After destroy classlist, attribute availability testing', () => {
        dialog = undefined;
        dialog = new Dialog({
            header: 'Demo',
            showCloseIcon: true,
            isModal: true,
            allowDragging: true,
            enableResize: true,
            enableRtl: true,
            cssClass: 'testClass'
        });
        dialog.appendTo('#dialog');
        dialog.destroy();
        let targetEle: HTMLElement = document.querySelector('#dialog') as HTMLElement;
        expect(targetEle.innerHTML).toEqual('testing');
        expect(targetEle.classList.contains('e-dialog')).toEqual(false);
        expect(targetEle.classList.contains('e-rtl')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-resizable')).toEqual(false);
        expect(targetEle.classList.contains('e-restrict-left')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-modal')).toEqual(false);
        expect(targetEle.classList.contains('testClass')).toEqual(false);
        expect(document.body.classList.contains('e-scroll-disabled')).toEqual(false);
        expect(targetEle.getAttribute('role')).toEqual(null);
        expect(targetEle.getAttribute('aria-modal')).toEqual(null);
        expect(targetEle.getAttribute('aria-labelledby')).toEqual(null);
        expect(targetEle.getAttribute('aria-describedby')).toEqual(null);
        expect(targetEle.getAttribute('aria-grabbed')).toEqual(null);
        expect(targetEle.getAttribute('tabindex')).toEqual(null);
        expect(targetEle.getAttribute('style')).toEqual(null);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        detach(dialog.element);
    });
    it('Normal Dialog - After destroy classlist, attribute availability testing', () => {
        dialog = undefined;
        dialog = new Dialog({
            header: 'Demo',
            showCloseIcon: true,
            allowDragging: true,
            enableResize: true,
            enableRtl: true,
            cssClass: 'testClass'
        });
        dialog.appendTo('#dialog');
        dialog.destroy();
        let targetEle: HTMLElement = document.querySelector('#dialog') as HTMLElement;
        expect(targetEle.innerHTML).toEqual('testing');
        expect(targetEle.classList.contains('e-dialog')).toEqual(false);
        expect(targetEle.classList.contains('e-rtl')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-resizable')).toEqual(false);
        expect(targetEle.classList.contains('e-restrict-left')).toEqual(false);
        expect(targetEle.classList.contains('e-dlg-modal')).toEqual(false);
        expect(targetEle.classList.contains('testClass')).toEqual(false);
        expect(document.body.classList.contains('e-scroll-disabled')).toEqual(false);
        expect(targetEle.getAttribute('role')).toEqual(null);
        expect(targetEle.getAttribute('aria-modal')).toEqual(null);
        expect(targetEle.getAttribute('aria-labelledby')).toEqual(null);
        expect(targetEle.getAttribute('aria-describedby')).toEqual(null);
        expect(targetEle.getAttribute('aria-grabbed')).toEqual(null);
        expect(targetEle.getAttribute('tabindex')).toEqual(null);
        expect(targetEle.getAttribute('style')).toEqual(null);
        detach(dialog.element);
    });
});

describe('EJ2-34298 - Ref element testing', () => {
    let dialog: Dialog;
    let rootEle: HTMLElement;
    beforeEach((): void => {
        dialog = undefined;
        rootEle = createElement('div', { id: 'dialogRoot' });
        let dlgWrap: HTMLElement = createElement('div', { id: 'dialogWrapper' });
        let dlgEle: HTMLElement = createElement('div', { id: 'dialog' });
        dlgWrap.appendChild(dlgEle);
        rootEle.appendChild(dlgWrap);
        document.body.appendChild(rootEle);
    });
    afterEach((): void => {
        destroyDialog(dialog);
        detach(rootEle);
    });
    it('Default target with Ref element availability testing', () => {
        dialog = new Dialog({});
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('Remove Ref element before destroy - Default target with Ref element availability testing', () => {
        dialog = new Dialog({});
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        detach(document.querySelector('.e-dlg-ref-element'));
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dialog').length === 0).toEqual(true);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('BODY');
        detach(document.querySelector('#dialog'));
    });
    it('Target as `document.body` with Ref element availability testing', () => {
        dialog = new Dialog({
            target: document.body
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('Target as `dialogRoot` with Ref element availability testing', () => {
        dialog = new Dialog({
            target: '#dialogRoot'
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.id).toEqual('dialogRoot');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('`isModal: true` - Default target with Ref element availability testing', () => {
        dialog = new Dialog({ isModal: true });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('`isModal: true` - Target as `document.body` with Ref element availability testing', () => {
        dialog = new Dialog({
            isModal: true,
            target: document.body
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('`isModal: true` - Target as `dialogRoot` with Ref element availability testing', () => {
        dialog = new Dialog({
            isModal: true,
            target: '#dialogRoot'
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.id).toEqual('dialogRoot');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('Default target with Ref element availability testing', () => {
        dialog = new Dialog({});
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.isModal = true;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('Target as `document.body` with Ref element availability testing', () => {
        dialog = new Dialog({
            target: document.body
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.isModal = true;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('Target as `dialogRoot` with Ref element availability testing', () => {
        dialog = new Dialog({
            target: '#dialogRoot'
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.id).toEqual('dialogRoot');
        dialog.isModal = true;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('.e-dlg-container').parentElement.id).toEqual('dialogRoot');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-container').length > 0).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('`isModal: true` - Default target with Ref element availability testing', () => {
        dialog = new Dialog({ isModal: true });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.isModal = false;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('`isModal: true` - Target as `document.body` with Ref element availability testing', () => {
        dialog = new Dialog({
            isModal: true,
            target: document.body
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.isModal = false;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
    it('`isModal: true` - Target as `dialogRoot` with Ref element availability testing', () => {
        dialog = new Dialog({
            isModal: true,
            target: '#dialogRoot'
        });
        dialog.appendTo('#dialog');
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dlg-container').parentElement.id).toEqual('dialogRoot');
        expect(document.querySelectorAll('.e-dlg-overlay').length > 0).toEqual(true);
        dialog.isModal = false;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-ref-element').parentElement.id).toEqual('dialogWrapper');
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('.e-dialog').parentElement.id).toEqual('dialogRoot');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').parentElement.id).toEqual('dialogWrapper');
    });
});
describe('EJ2-34298 - Dialog render with virtual DOM testing', () => {
    let dialog: Dialog;
    let parentRoot: HTMLElement;
    let rootEle: HTMLElement;
    beforeEach((): void => {
        dialog = undefined;
    });
    afterEach((): void => {
        destroyDialog(dialog);
        if (rootEle) { detach(rootEle); }
        if (parentRoot) { detach(parentRoot); }
    });
    it('Default target with Ref element availability testing', () => {
        rootEle = createElement('div', { id: 'dialog' });
        dialog = new Dialog({});
        dialog.appendTo(rootEle);
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(false);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('BODY');
        expect(document.querySelector('#dialog').classList.length).toEqual(0);
    });
    it('OnPropertyChange - Default target with Ref element availability testing', () => {
        rootEle = createElement('div', { id: 'dialog' });
        dialog = new Dialog({});
        dialog.appendTo(rootEle);
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(false);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.isModal = true;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(false);
        expect(document.querySelectorAll('.e-dlg-container').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('BODY');
        expect(document.querySelector('#dialog').classList.length).toEqual(0);
    });
    it('With Parent element - Default target with Ref element availability testing', () => {
        parentRoot = createElement('div', { id: 'rootEle' });
        rootEle = createElement('div', { id: 'dialog' });
        parentRoot.appendChild(rootEle);
        dialog = new Dialog({});
        dialog.appendTo(rootEle);
        document.body.appendChild(parentRoot);
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').classList.length).toEqual(0);
    });
    it('OnPropertyChange - With Parent element - Default target with Ref element availability testing', () => {
        parentRoot = createElement('div', { id: 'rootEle' });
        rootEle = createElement('div', { id: 'dialog' });
        parentRoot.appendChild(rootEle);
        dialog = new Dialog({});
        dialog.appendTo(rootEle);
        document.body.appendChild(parentRoot);
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.isModal = true;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dlg-container').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').classList.length).toEqual(0);
    });
    it('With Parent element - isModal - Default target with Ref element availability testing', () => {
        parentRoot = createElement('div', { id: 'rootEle' });
        rootEle = createElement('div', { id: 'dialog' });
        parentRoot.appendChild(rootEle);
        dialog = new Dialog({ isModal: true });
        dialog.appendTo(rootEle);
        document.body.appendChild(parentRoot);
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dlg-container').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').classList.length).toEqual(0);
    });
    it('OnPropertyChange - With Parent element - isModal - Default target with Ref element availability testing', () => {
        parentRoot = createElement('div', { id: 'rootEle' });
        rootEle = createElement('div', { id: 'dialog' });
        parentRoot.appendChild(rootEle);
        dialog = new Dialog({ isModal: true });
        dialog.appendTo(rootEle);
        document.body.appendChild(parentRoot);
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dlg-container').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dlg-container').parentElement.tagName).toEqual('BODY');
        dialog.isModal = false;
        dialog.dataBind();
        expect(document.querySelectorAll('.e-dlg-ref-element').length === 1).toEqual(true);
        expect(document.querySelectorAll('.e-dlg-container').length === 1).toEqual(false);
        expect(document.querySelectorAll('.e-dialog').length === 1).toEqual(true);
        expect(document.querySelector('.e-dialog').parentElement.tagName).toEqual('BODY');
        dialog.destroy();
        dialog = undefined;
        expect(document.querySelectorAll('.e-dlg-ref-element').length > 0).toEqual(false);
        expect(document.querySelector('#dialog').parentElement.tagName).toEqual('DIV');
        expect(document.querySelector('#dialog').classList.length).toEqual(0);
    });
});