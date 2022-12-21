/**
 * Audio module spec
 */
import { Browser, isNullOrUndefined, closest, detach, createElement } from '@syncfusion/ej2-base';
import { RichTextEditor, QuickToolbar, IRenderer, DialogType } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { renderRTE, destroy, setCursorPoint, dispatchEvent, androidUA, iPhoneUA, currentBrowserUA } from "./../render.spec";
import { SelectEventArgs } from '@syncfusion/ej2-navigations';

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

describe('insert Audio', () => {

    describe(' Quick Toolbar open testing after selecting some text', () => {
        let rteObj: any;
        let ele: HTMLElement;
        it(" selecting some text and then clicking on audio test ", () => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<div id='rte'><p><b>Syncfusion</b> Software</p><span id='audTag' class="e-audio-wrap" contenteditable="false" title="horse.mp3"><figure><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></figure></span><br>`
            });
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 2);
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#audTag');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    });

    describe('Open audio dialog and click cancel', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio']
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
            (document.querySelector('.e-cancel') as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            done();
        });
    });

    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('audio dialog Coverage', (done: Function) => {
            rteObj.value = '<p id="contentId">hello  </p>',
            rteObj.dataBind();
            let pTag: HTMLElement = rteObj.element.querySelector('#contentId') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[0], 0, 5);
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
                item: { url: 'https://www.w3schools.com/html/horse.mp3', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.audioObj.createAudio(args);
            (rteObj.element.querySelector('.e-rte-audio') as HTMLElement).focus();
            args = {
                item: { url: null, selection: null },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.audioObj.createAudio(args);
            let evnArg: any = { args, self: (<any>rteObj).audioModule, selection: save, selectNode: [''], link: null, target: '' };
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-audio')];
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: evnArg.selectNode[0] };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
            done();
        });
    });
    describe('div content', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        beforeAll((done: Function) => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                }
            });
            rteEle = rteObj.element;
            done();
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('mobile UI', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dlg-container')).toBe(false);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            Browser.userAgent = defaultUA;
        });
    });

    describe('Inserting audio and applying heading', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
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
                item: { url: 'https://www.w3schools.com/html/horse.mp3', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.audioObj.createAudio(args);
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
            done();
        });
    });


    describe('Inserting audio and applying heading in IE11', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            Browser.userAgent = 'msie';
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold', 'Formats']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting audio and applying heading in IE11', (done: Function) => {
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
                item: { url: 'https://www.w3schools.com/html/horse.mp3', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.audioObj.createAudio(args);
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
            done();
        });
    });
    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                insertAudioSettings: {
                    allowedTypes: ['mp3', 'wav', 'm4a', 'wma'],
                    layoutOption: 'Inline',
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox'
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('upload the audio while use save url', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let fileObj: File = new File(["Nice One"], "sample.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                expect((<any>rteObj).audioModule.uploadObj.fileList.length).toEqual(1);
                (document.getElementsByClassName('e-browsebtn')[0] as HTMLElement).click()
                done();
            }, 4700);
        });
    });

    describe('dialogOpen Event- Check dialog element', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio']
                },
                dialogOpen : function(e) {
                    expect((e as any).element.querySelector('.e-upload.e-control-wrapper')).not.toBe(null);
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Check uploader element in dialog content', function () {
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        });
});

    describe('audio dialog - documentClick', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            action: 'insert-audio',
            key: 's'
        };
        beforeAll(() => {
            rteObj = renderRTE({ 
                toolbarSettings: {
                    items: ['Audio']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('open audio dialog - click on audio item in toolbar', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<any>rteObj).audioModule.onKeyDown({ args: keyboardEventArgs });
            expect(document.body.contains((<any>rteObj).audioModule.dialogObj.element)).toBe(true);

            let eventsArgs: any = { target: rteObj.element.querySelector('.e-audio'), preventDefault: function () { } };
            (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).audioModule.dialogObj.element)).toBe(true);
 
            eventsArgs = { target: document.querySelector('[title="Insert Audio"]'), preventDefault: function () { } };
            (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).audioModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Audio"]').parentElement, preventDefault: function () { } };
            (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).audioModule.dialogObj.element)).toBe(true);
        });
        it('close audio dialog - while click on document', () => {
            let eventsArgs: any = { target: document, preventDefault: function () { } };
            (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
            expect((<any>rteObj).audioModule.dialogObj).toBe(null);
        });
     });
     describe('Removing the audio', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
            action: ''
        };
        let innerHTML1: string = `
            <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br></p>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('audio remove with quickToolbar check', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
            (<any>rteObj).audioModule.audEle = rteObj.contentModule.getEditPanel().querySelector('.e-audio-wrap audio');
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                quickTBItem.item(1).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-audio-wrap')).toBe(null);
                done();
            }, 200);
        });
     });
 
     describe('Audio deleting when press backspace button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let innerHTML1: string = `testing
        <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Audio delete action checking using backspace key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].lastChild;
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap')).toBe(null);
            done();
        });
     });
 
     describe('Audio deleting when press backspace button nodeType as 1', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let innerHTML1: string = `testing
        <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Audio delete action checking using backspace key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].childNodes[1];
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap')).toBe(null);
            done();
        });
     });
 
     describe('Audio deleting when press delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
        let innerHTML1: string = `testing<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Audio delete action checking using delete key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].firstChild;
            setCursorPoint(node, 7);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap')).toBe(null);
            done();
        });
     });
 
     describe('Audio deleting when press delete button as nodeType 1', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
        let innerHTML1: string = `testing<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Audio delete action checking using delete key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].childNodes[1];
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap')).toBe(null);
            done();
        });
     });
 
     describe('Audio with inline applied', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
            action: ''
        };
        let innerHTML1: string = `
            <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br></p>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('classList testing for inline', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
            (<any>rteObj).audioModule.audEle = rteObj.contentModule.getEditPanel().querySelector('.e-audio-wrap audio');
            setTimeout(function () {
                let mouseEventArgs = {
                    item: { command: 'Audios', subCommand: 'Inline' }
                };
                let audio: HTMLElement = rteObj.element.querySelector('.e-rte-audio') as HTMLElement;
                (<any>rteObj).audioModule.alignmentSelect(mouseEventArgs);
                expect(audio.classList.contains('e-audio-inline')).toBe(true);
                done();
            }, 200);
        });
     });
 
    describe('Audio with break applied ', () => {
         let rteEle: HTMLElement;
         let rteObj: RichTextEditor;
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
             action: ''
         };
         let innerHTML1: string = `
             <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br></p>
             `;
         beforeAll(() => {
             rteObj = renderRTE({
                 height: 400,
                 toolbarSettings: {
                     items: ['Audio', 'Bold']
                 },
                 value: innerHTML1
             });
             rteEle = rteObj.element;
         });
         afterAll(() => {
             destroy(rteObj);
         });
 
         it('classList testing for break', (done: Function) => {
             let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
             let clickEvent: any = document.createEvent("MouseEvents");
             let eventsArg: any = { pageX: 50, pageY: 300, target: target };
             clickEvent.initEvent("mousedown", false, true);
             target.dispatchEvent(clickEvent);
             target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
             (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
             eventsArg = { pageX: 50, pageY: 300, target: target };
             clickEvent.initEvent("mousedown", false, true);
             target.dispatchEvent(clickEvent);
             (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
             (<any>rteObj).audioModule.audEle = rteObj.contentModule.getEditPanel().querySelector('.e-audio-wrap audio');
             setTimeout(function () {
                 let mouseEventArgs = {
                     item: { command: 'Audios', subCommand: 'Break' }
                 };
                 let audio: HTMLElement = rteObj.element.querySelector('.e-rte-audio') as HTMLElement;
                 (<any>rteObj).audioModule.alignmentSelect(mouseEventArgs);
                 expect(audio.classList.contains('e-audio-break')).toBe(true);
                 done();
             }, 200);
         });
     });
     
     describe('Mouse Click for audio testing when showOnRightClick enabled', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p>Hi audio is<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>`,
                 quickToolbarSettings: {
                     enable: true,
                     showOnRightClick: true
                 }
             });
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         });
         it(" Test - for mouse click to focus audio element", (done) => {
             let target: HTMLElement = rteObj.element.querySelector(".e-audio-wrap");
             let clickEvent: any = document.createEvent("MouseEvents");
             let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
             clickEvent.initEvent("mousedown", false, true);
             target.dispatchEvent(clickEvent);
             (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
             setTimeout(() => {
                 let expectElem: HTMLElement[] = (rteObj as any).formatter.editorManager.nodeSelection.getSelectedNodes(document);
                 expect(expectElem[0].tagName === 'SPAN').toBe(true);
                 done();
             }, 100);
         });
     });
     
     describe(' quickToolbarSettings property - audio quick toolbar - ', () => {
         let rteObj: RichTextEditor;
         let controlId: string;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br></p>`
             });
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         });
         it(' Test - Replace the audio ', (done) => {
             let audio: HTMLElement = rteObj.element.querySelector(".e-audio-wrap");
             setCursorPoint(audio, 0);
             dispatchEvent(audio, 'mousedown');
             audio.click();
             dispatchEvent(audio, 'mouseup');
             setTimeout(() => {
                 let audioBtn: HTMLElement = document.getElementById(controlId + "_quick_AudioReplace");
                 audioBtn.parentElement.click();
                 let png = "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a";
                 let dialog: HTMLElement = document.getElementById(controlId + "_audio");
                 let urlInput: HTMLInputElement = dialog.querySelector('.e-audio-url');
                 urlInput.value = png;
                 let insertButton: HTMLElement = dialog.querySelector('.e-insertAudio.e-primary');
                 urlInput.dispatchEvent(new Event("input"));
                 insertButton.click();
                 let updateAudio: HTMLSourceElement = rteObj.element.querySelector(".e-audio-wrap source");
                 expect(updateAudio.src === png).toBe(true);
                 done();
             }, 200);
         });
     });
 
     describe(' ActionComplete event triggered twice when replace the inserted audio using quicktoolbar - ', () => {
         let rteObj: RichTextEditor;
         let controlId: string;
         let actionCompleteCalled: boolean = true;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br></p>`,
                 actionComplete: actionCompleteFun
             });
             function actionCompleteFun(args: any): void {
                 actionCompleteCalled = true;
             }
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         });
         it(' Testing audio Replace and acitonComplete triggering', (done) => {
             let audio: HTMLElement = rteObj.element.querySelector(".e-audio-wrap");
             setCursorPoint(audio, 0);
             dispatchEvent(audio, 'mousedown');
             audio.click();
             dispatchEvent(audio, 'mouseup');
             setTimeout(() => {
                 let audioBtn: HTMLElement = document.getElementById(controlId + "_quick_AudioReplace");
                 audioBtn.parentElement.click();
                 let audioFile = "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a";
                 let dialog: HTMLElement = document.getElementById(controlId + "_audio");
                 let urlInput: HTMLInputElement = dialog.querySelector('.e-audio-url');
                 urlInput.value = audioFile;
                 let insertButton: HTMLElement = dialog.querySelector('.e-insertAudio.e-primary');
                 urlInput.dispatchEvent(new Event("input"));
                 insertButton.click();
                 let updateAudio: HTMLSourceElement = rteObj.element.querySelector(".e-audio-wrap source");
                 expect(updateAudio.src === audioFile).toBe(true);
                 setTimeout(function () {
                     expect(actionCompleteCalled).toBe(true);
                     done();
                 }, 40);
                 done();
             }, 100);
         });
     });
 
     describe('Disable the insert Audio dialog button when the audio is uploading.', () => {
         let rteObj: RichTextEditor;
         let controlId: string;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p>Testing Audio Dialog</p>`,
                 toolbarSettings: {
                     items: ['Audio']
                 }
             });
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         });
         it(' Initial insert audio button disabled', (done) => {
             let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Audio');
             item.click();
             let dialog: HTMLElement = document.getElementById(controlId + "_audio");
             let insertButton: HTMLElement = dialog.querySelector('.e-insertAudio.e-primary');
             expect(insertButton.hasAttribute('disabled')).toBe(true);
             done();
         });
     });
     describe('Disable the insert audio dialog button when the audio is uploading', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertAudioSettings: {
                     allowedTypes: ['.png'],
                     saveUrl:"uploadbox/Save",
                     path: "../Audios/"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 }
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Button disabled with improper file extension', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp34';
             let fileObj: File = new File(["Horse"], "horse.mp34", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             setTimeout(() => {
                 expect((dialogEle.querySelector('.e-insertAudio') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                 done();
             }, 1000);
         });
     });
     describe('Disable the insert audio dialog button when the audio is uploading', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Audio']
                 },
                 insertAudioSettings: {
                     saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
                     path: "../Audios/"
                 }
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Button enabled with audio upload Success', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             setTimeout(() => {
                 expect((dialogEle.querySelector('.e-insertAudio') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
                 done();
             }, 4900);
         });
     });
     describe('Getting error while insert the audio after applied the  lower case or  upper case commands in Html Editor  - ', () => {
         let rteObj: RichTextEditor;
         let controlId: string;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p id='insert-audio'>RichTextEditor</p>`,
                 toolbarSettings: {
                     items: [
                         'LowerCase', 'UpperCase', '|',
                         'Audio']
                 },
             });
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         });
         it(" Apply uppercase and then insert an audio  ", (done) => {
             let pTag: HTMLElement = rteObj.element.querySelector('#insert-audio') as HTMLElement;
             rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[0], 4, 6);
             let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UpperCase');
             item.click();
             rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[2], 1, 2);
             item = rteObj.element.querySelector('#' + controlId + '_toolbar_Audio');
             item.click();
             setTimeout(() => {
                 let dialogEle: any = rteObj.element.querySelector('.e-dialog');
                 (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
                 (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                 expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                 (document.querySelector('.e-insertAudio.e-primary') as HTMLElement).click();
                 let trg = (rteObj.element.querySelector('.e-rte-audio') as HTMLElement);
                 expect(!isNullOrUndefined(trg)).toBe(true);
                 done();
             }, 100);
         });
     });
     describe(' Quick Toolbar showOnRightClick property testing', () => {
         let rteObj: any;
         let ele: HTMLElement;
         it(" leftClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
             rteObj = renderRTE({
                 quickToolbarSettings: {
                     showOnRightClick: false
                 },
                 value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>
                 </p>`
             });
             ele = rteObj.element;
             expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
             let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
             let clickEvent: any = document.createEvent("MouseEvents");
             clickEvent.initEvent("mousedown", false, true);
             cntTarget.dispatchEvent(clickEvent);
             let target: HTMLElement = ele.querySelector('#aud-container span');
             let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
             setCursorPoint(target, 0);
             rteObj.mouseUp(eventsArg);
             setTimeout(() => {
                 let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                 expect(isNullOrUndefined(quickPop)).toBe(true);
                 done();
             }, 400);
         });
         it(" leftClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
             rteObj = renderRTE({
                 quickToolbarSettings: {
                     showOnRightClick: false
                 },
                 value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>
                 </p>`
             });
             ele = rteObj.element;
             expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
             let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
             let clickEvent: any = document.createEvent("MouseEvents");
             clickEvent.initEvent("mousedown", false, true);
             cntTarget.dispatchEvent(clickEvent);
             let target: HTMLElement = ele.querySelector('#aud-container span');
             let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
             setCursorPoint(target, 0);
             rteObj.mouseUp(eventsArg);
             setTimeout(() => {
                 let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                 expect(isNullOrUndefined(quickPop)).toBe(true);
                 done();
             }, 400);
         });
         it(" leftClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
             rteObj = renderRTE({
                 quickToolbarSettings: {
                     showOnRightClick: false
                 },
                 value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>
                 </p>`
             });
             ele = rteObj.element;
             expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
             let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
             let clickEvent: any = document.createEvent("MouseEvents");
             clickEvent.initEvent("mousedown", false, true);
             cntTarget.dispatchEvent(clickEvent);
             let target: HTMLElement = ele.querySelector('#aud-container span');
             let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
             setCursorPoint(target, 0);
             target.click();
             dispatchEvent(target, 'mouseup');
             setTimeout(() => {
                 let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                 expect(quickPop.length > 0).toBe(true);
                 expect(isNullOrUndefined(quickPop[0])).toBe(false);
                 done();
             }, 400);
         });
         it(" rightClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
             rteObj = renderRTE({
                 quickToolbarSettings: {
                     showOnRightClick: true
                 },
                 value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>
                 </p>`
             });
             ele = rteObj.element;
             expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
             let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
             let clickEvent: any = document.createEvent("MouseEvents");
             clickEvent.initEvent("mousedown", false, true);
             cntTarget.dispatchEvent(clickEvent);
             let target: HTMLElement = ele.querySelector('#aud-container span');
             let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
             setCursorPoint(target, 0);
             target.click();
             dispatchEvent(target, 'mouseup');
             setTimeout(() => {
                 let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                 expect(isNullOrUndefined(quickPop)).toBe(true);
                 done();
             }, 400);
         });
         it(" rightClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
             rteObj = renderRTE({
                 quickToolbarSettings: {
                     showOnRightClick: true
                 },
                 value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>
                 </p>`
             });
             ele = rteObj.element;
             expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
             let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
             let clickEvent: any = document.createEvent("MouseEvents");
             clickEvent.initEvent("mousedown", false, true);
             cntTarget.dispatchEvent(clickEvent);
             let target: HTMLElement = ele.querySelector('#aud-container span');
             let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
             setCursorPoint(target, 0);
             target.click();
             dispatchEvent(target, 'mouseup');
             setTimeout(() => {
                 let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                 expect(isNullOrUndefined(quickPop)).toBe(true);
                 done();
             }, 400);
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         });
     });
 
     describe('Rename audios in success event- ', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileUploadSuccess: function (args : any) {
                     args.file.name = 'rte_audio';
                     var filename : any = document.querySelectorAll(".e-file-name")[0];
                     filename.innerHTML = args.file.name.replace(document.querySelectorAll(".e-file-type")[0].innerHTML, '');
                     filename.title = args.file.name;
                 },
                 insertAudioSettings: {
                     saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
                     path: "../Audios/"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it('Check name after renamed', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             setTimeout(() => {
                 expect(document.querySelectorAll(".e-file-name")[0].innerHTML).toBe('rte_audio');
                 done();
             }, 4900);
         });
     });
 
     describe('Inserting Audio as Base64 - ', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertAudioSettings: {
                     saveFormat: "Base64"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Test the inserted audio in the component ', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             (document.querySelector('.e-insertAudio') as HTMLElement).click();
             setTimeout(() => {
                 expect(rteObj.getContent().querySelector(".e-rte-audio.e-audio-inline source").getAttribute("src").indexOf("blob") == -1).toBe(true);
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).audioModule.deleteAudio(evnArg);
                 (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
 
     describe('Inserting Audio as Blob - ', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertAudioSettings: {
                     saveFormat: "Blob"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Test the inserted audio in the component ', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             (document.querySelector('.e-insertAudio') as HTMLElement).click();
             setTimeout(() => {
                 expect(rteObj.getContent().querySelector(".e-rte-audio.e-audio-inline source").getAttribute("src").indexOf("base64") == -1).toBe(true);
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).audioModule.deleteAudio(evnArg);
                 (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
     
     describe('Insert Audio mediaSelected, mediaUploading and mediaUploadSuccess event - ', () => {
         let rteObj: RichTextEditor;
         let mediaSelectedSpy: jasmine.Spy = jasmine.createSpy('onFileSelected');
         let mediaUploadingSpy: boolean = false;
         let mediaUploadSuccessSpy: jasmine.Spy = jasmine.createSpy('onFileUploadSuccess');
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileSelected: mediaSelectedSpy,
                 fileUploading: mediaUploading,
                 fileUploadSuccess: mediaUploadSuccessSpy,
                 insertAudioSettings: {
                     saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
                     path: "../Audios/"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 }
             });
             function mediaUploading() {
                mediaUploadingSpy = true;
             }
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Test the component insert audio events - case 1 ', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             expect(mediaSelectedSpy).toHaveBeenCalled();
             expect(mediaUploadingSpy).toBe(true);
             setTimeout(() => {
                 expect(mediaUploadSuccessSpy).toHaveBeenCalled();
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).audioModule.deleteAudio(evnArg);
                 (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
 
     describe('Insert audio mediaSelected event args cancel true - ', () => {
         let rteObj: RichTextEditor;
         let isMediaUploadSuccess: boolean = false;
         let isMediaUploadFailed: boolean = false;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileSelected: mediaSelectedEvent,
                 fileUploadSuccess: mediaUploadSuccessEvent,
                 fileUploadFailed: mediaUploadFailedEvent,
                 insertAudioSettings: {
                     saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
                     path: "../Audios/"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             function mediaSelectedEvent(e: any) {
                 e.cancel = true;
             }
             function mediaUploadSuccessEvent(e: any) {
                 isMediaUploadSuccess = true;
             }
             function mediaUploadFailedEvent(e: any) {
                 isMediaUploadFailed = true;
             }
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Test the component insert audio events - case 1 ', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             setTimeout(() => {
                 expect(isMediaUploadSuccess).toBe(false);
                 expect(isMediaUploadFailed).toBe(false);
                 done();
             }, 4200);
             
         });
     });
 
     describe('Insert audio mediaRemoving event - ', () => {
         let rteObj: RichTextEditor;
         let mediaRemovingSpy: jasmine.Spy = jasmine.createSpy('onFileRemoving');
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileRemoving: mediaRemovingSpy,
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Test the component insert audio events - case 2 ', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             (<any>rteObj).audioModule.uploadUrl = { url: "" };
             (document.querySelector('.e-icons.e-file-remove-btn') as HTMLElement).click();
             expect(mediaRemovingSpy).toHaveBeenCalled();
             setTimeout(() => {
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).audioModule.deleteAudio(evnArg);
                 (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
 
     describe('Insert audio mediaUploadFailed event - ', () => {
         let rteObj: RichTextEditor;
         let mediaUploadFailedSpy: jasmine.Spy = jasmine.createSpy('onFileUploadFailed');
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileUploadFailed: mediaUploadFailedSpy,
                 insertAudioSettings: {
                     saveUrl:"uploadbox/Save",
                     path: "../Audios/"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Test the component insert audio events - case 3 ', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             setTimeout(() => {
                 expect(mediaUploadFailedSpy).toHaveBeenCalled();
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).audioModule.deleteAudio(evnArg);
                 (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
 
     describe('Testing allowed extension in audio upload - ', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertAudioSettings: {
                     allowedTypes: ['.mp3'],
                     saveUrl:"uploadbox/Save",
                     path: "../Audios/"
                 },
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Test the component insert audio with allowedExtension property', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.m4a';
             let fileObj: File = new File(["Horse"], "horse.m4a", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             setTimeout(() => {
                 expect((dialogEle.querySelector('.e-insertAudio') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).audioModule.deleteAudio(evnArg);
                 (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
 
     describe('beforeMediaUpload event - ', () => {
         let rteObj: RichTextEditor;
         let beforeMediaUploadSpy: jasmine.Spy = jasmine.createSpy('onBeforeFileUpload');
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 beforeFileUpload: beforeMediaUploadSpy,
                 toolbarSettings: {
                     items: ['Audio']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         })
         it(' Event and arguments test ', (done) => {
             let rteEle: HTMLElement = rteObj.element;
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             let args = { preventDefault: function () { } };
             let range = new NodeSelection().getRange(document);
             let save = new NodeSelection().save(range, document);
             let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
             let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
             (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
             let fileObj: File = new File(["Header"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             expect(beforeMediaUploadSpy).toHaveBeenCalled();
             done();
         });
     });
 
     describe('BeforeDialogOpen eventArgs args.cancel testing', () => {
         let rteObj: RichTextEditor;
         let count: number = 0;
         beforeAll((done: Function) => {
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Audio'],
                 },
                 beforeDialogOpen(e: any): void {
                     e.cancel = true;
                     count = count + 1;
                 },
                 dialogClose(e: any): void {
                     count = count + 1;
                 }
             });
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
         });
         it('dialogClose event trigger testing', (done) => {
             expect(count).toBe(0);
             (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
             setTimeout(() => {
                 expect(count).toBe(1);
                 (rteObj.element.querySelector('.e-content') as HTMLElement).click();
                 expect(count).toBe(1);
                 done();
             }, 100);
         });
     });
     describe('BeforeDialogOpen event is not called for second time', () => {
         let rteObj: RichTextEditor;
         let count: number = 0;
         beforeAll((done: Function) => {
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Audio']
                 },
                 beforeDialogOpen(e: any): void {
                     e.cancel = true;
                     count = count + 1;
                 }
             });
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
         });
         it('beforeDialogOpen event trigger testing', (done) => {
             expect(count).toBe(0);
             (rteObj.element.querySelectorAll('.e-toolbar-item')[0].querySelector('button') as HTMLElement).click();
             setTimeout(() => {
                 expect(count).toBe(1);
                 done();
             }, 100);
         });
     });
     describe('Checking audio replace, using the audio dialog', () => {
         let rteEle: HTMLElement;
         let rteObj: RichTextEditor;
         beforeAll(() => {
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Audio']
                 },
                 value: `<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br>`
             });
             rteEle = rteObj.element;
         });
         afterAll(() => {
             destroy(rteObj);
         });
         it('audio dialog', (done) => {
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
             let fileObj: File = new File(["Testing"], "test.mp3", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
             (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
             (document.querySelector('.e-insertAudio.e-primary') as HTMLElement).click();
             expect((rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap')).not.toBe(null);
             done();
         });
     });
     describe('Audio outline style testing, while focus other content or audio', () => {
         let rteObj: RichTextEditor;
         let QTBarModule: IRenderer;
         beforeAll((done: Function) => {
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Audio'],
                 },
                 value: '<p>Sample Text</p> <p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br></p><p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span></p>'
             });
             QTBarModule = getQTBarModule(rteObj);
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
         });
         it('first audio click with focus testing', (done) => {
             (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
             dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-clickelem')[0] as HTMLElement, 'mouseup');
             let eventsArgs: any = { target: rteObj.element.querySelectorAll('.e-audio-wrap audio')[0], preventDefault: function () { } };
             (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
             (<any>rteObj).audioModule.prevSelectedAudioEle = rteObj.element.querySelectorAll('.e-audio-wrap audio')[0];
             setTimeout(() => {
                 expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                 done();
             }, 600);
         });
         it('second audio click with focus testing', (done) => {
             (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
             dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[1] as HTMLElement, 'mouseup');
             let eventsArgs: any = { target: rteObj.element.querySelectorAll('.e-audio-wrap audio')[1], preventDefault: function () { } };
             (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
             setTimeout(() => {
                 expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                 done();
             }, 1000);
         });
         it('first audio click after p click with focus testing', (done) => {
             (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
             dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[0] as HTMLElement, 'mouseup');
             let eventsArgs: any = { target: rteObj.element.querySelectorAll('.e-audio-wrap audio')[0], preventDefault: function () { } };
             (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
             setTimeout(() => {
                 expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                 done();
             }, 600);
         });
         it('second audio click after p click with focus testing', (done) => {
             (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
             dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[1] as HTMLElement, 'mouseup');
             setTimeout(() => {
                 expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                 done();
             }, 1000);
         });
     });
     describe('Audio focus not working after outside click then again click a audio', () => {
         let rteObj: RichTextEditor;
         let QTBarModule: IRenderer;
         beforeAll((done: Function) => {
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Audio'],
                 },
                 value: '<p>Sample Text</p> <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span><br><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mp3"></audio></span></span>'
             });
             QTBarModule = getQTBarModule(rteObj);
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
         });
         it('audio click with focus testing', (done) => {
             (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
             dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[0] as HTMLElement, 'mouseup');
             setTimeout(() => {
                 expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                 done();
             }, 500);
         });
         it('Again audio click with focus testing', (done) => {
             (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
             dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[0] as HTMLElement, 'mouseup');
             setTimeout(() => {
                 expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                 done();
             }, 500);
         });
     });
     describe('ShowDialog, CloseDialog method testing', () => {
         let rteObj: RichTextEditor;
         beforeAll((done: Function) => {
             rteObj = renderRTE({ });
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
         });
         it('show/hide dialog testing', (done) => {
             rteObj.showDialog(DialogType.InsertAudio);
             setTimeout(() => {
                 expect(document.body.querySelectorAll('.e-rte-audio-dialog.e-dialog').length).toBe(1);
                 rteObj.closeDialog(DialogType.InsertAudio);
                 setTimeout(() => {
                     expect(document.body.querySelectorAll('.e-rte-audio-dialog.e-dialog').length).toBe(0);
                     done();
                 }, 100);
             }, 100);
         });
     });

     describe('Quick tool bar appears while click out of the audio if audio change to break', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><audio controls><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3" /></audio></p>`,
                insertAudioSettings: {
                    layoutOption: 'Break'
                }
            });

            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(" Quick tool bar appears while click out of the audio if audio change to break", (done) => {
            let target = <HTMLElement>rteObj.element.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
            (<any>rteObj).audioModule.audEle = rteObj.contentModule.getEditPanel().querySelector('.e-audio-wrap audio');
            let mouseEventArgs = {
                item: { command: 'Audios', subCommand: 'Break' }
            };
            let audio: HTMLElement = rteObj.element.querySelector('.e-rte-audio') as HTMLElement;
            (<any>rteObj).audioModule.alignmentSelect(mouseEventArgs);
            expect(audio.classList.contains('e-audio-break')).toBe(true);
            let trg: any = <HTMLElement>rteObj.element.querySelectorAll(".e-content")[0];
            let clickEvent1: any = document.createEvent("MouseEvents");
            let eventsArg1: any = { pageX: 50, pageY: 300, target: document.querySelector('p')};
            clickEvent1.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg1 });
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
            done();
        });
    });
 });
 
