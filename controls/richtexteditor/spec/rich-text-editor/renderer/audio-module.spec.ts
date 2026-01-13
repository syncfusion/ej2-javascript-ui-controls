/**
 * Audio module spec
 */
import { Browser, isNullOrUndefined, closest, detach, createElement } from '@syncfusion/ej2-base';
import { RichTextEditor, QuickToolbar, IQuickToolbar } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { DialogType } from "../../../src/common/enum";
import { renderRTE, destroy, setCursorPoint, dispatchEvent, androidUA, iPhoneUA, currentBrowserUA } from "./../render.spec";
import { BASIC_MOUSE_EVENT_INIT, DELETE_EVENT_INIT, BACKSPACE_EVENT_INIT } from '../../constant.spec';
import * as classes from '../../../src/rich-text-editor/base/classes';
import * as events from '../../../src/rich-text-editor/base/constant';
import { ActionBeginEventArgs } from "./../../../src/common/interface";

export function pointInside(el: Element, pad = 5) {
    const r = el.getBoundingClientRect();
    return {
        x: Math.floor(r.left + Math.min(pad, Math.max(1, r.width - 2))),
        y: Math.floor(r.top  + Math.min(pad, Math.max(1, r.height - 2)))
    };
}

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}
const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

describe('Audio Module', () => {

    describe(' Quick Toolbar open testing after selecting some text', () => {
        let rteObj: any;
        let ele: HTMLElement;
        it(" selecting some text and then clicking on audio test ", () => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<div id='rte'><p><b>Syncfusion</b> Software</p><span id='audTag' class="e-audio-wrap" contenteditable="false" title="horse.mp3"><figure><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></figure></span><br>`
            });
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 2);
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-audio');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, preventDefault: function () { } };
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
                item: { url: window.origin + '/base/spec/content/audio/RTE-Audio.mp3', selection: save },
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
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
            (<any>rteObj).readonly = true;
            let value = (<any>rteObj).audioModule.touchStart(null, null);
            expect(value).toBe(undefined);
            (<any>rteObj).readonly = false;
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

    describe('Audio Element Deletion Test', () => {
        let rteEle: HTMLElement;
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
        it('should upload and delete audio element, removing it from the DOM', (done: DoneFn) => {
            const rteEle: HTMLElement = rteObj.element;
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            const toolbarItem: HTMLElement = rteEle.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
            toolbarItem.click();
            const dialogEle: HTMLElement | null = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle).not.toBeNull();
            const audioUrlInput: HTMLInputElement = dialogEle!.querySelector('.e-audio-url') as HTMLInputElement;
            audioUrlInput.value = `${window.origin}/base/spec/content/audio/RTE-Audio.mp3`;
            const fileObj: File = new File(['Horse'], 'horse.mp3', { lastModified: 0, type: 'audio/mpeg' });
            const eventArgs = {
                type: 'click',
                target: { files: [fileObj] },
                preventDefault: (): void => { }
            };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            expect(rteObj.audioModule.uploadObj.fileList.length).toEqual(1);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const removeButton: HTMLElement | null = document.querySelector('.e-icons.e-file-remove-btn');
            expect(removeButton).not.toBeNull();
            removeButton!.click();
            expect(rteObj.audioModule.uploadObj.fileList.length).toEqual(0);
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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
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
            }, 1000);
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
                dialogOpen: function (e) {
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

            eventsArgs = { target: document.querySelector('[title="Insert Audio (Ctrl+Shift+A)"]'), preventDefault: function () { } };
            (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).audioModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Audio (Ctrl+Shift+A)"]').parentElement, preventDefault: function () { } };
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
        let rteObj: RichTextEditor;
        let innerHTML1: string = `<p>testing&nbsp;<audio controls><source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3" /></audio><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                insertAudioSettings: {
                    removeUrl: ''
                },
                value: innerHTML1
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('audio remove with quickToolbar check', (done: Function) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-clickelem');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            rteObj.inputElement.querySelector('.e-clickelem').dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(2).click();
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('.e-audio-wrap')).toBe(null);
                    expect(rteObj.inputElement.querySelector('.e-clickelem')).toBe(null);
                    expect(rteObj.inputElement.querySelector('audio')).toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('document click audio coverage', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `
            <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio']
                },
                value: innerHTML1,
                inlineMode: {
                    enable: true
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('document click audio coverage', (done: Function) => {
            let target: HTMLElement = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
            let eventsArgs: any = { target: target, preventDefault: function () { } };
            target.classList.add('e-audio-focus');
            (rteObj as any).audioModule.onDocumentClick(eventsArgs);
            (rteObj as any).audioModule.touchStart(eventsArgs);
            (rteObj as any).audioModule.onDocumentClick(eventsArgs);
            setCursorPoint(target, 0);
            dispatchEvent(target, 'mousedown');
            dispatchEvent(target, 'mouseup');
            setTimeout(function () {
                let audioBtn: HTMLElement = document.getElementById((rteObj as any).element.id + "_quick_AudioReplace");
                audioBtn.parentElement.click();
                let eventsArgs: any = { target: document, preventDefault: function () { } };
                (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
                done();
            }, 200);
        });
    });

    describe('Audio deleting when press backspace button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span>testing`;
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
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>testing`;
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
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>testing`;
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
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>testing`;
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
            <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>
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
             <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>
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

    describe('Audio with inline and break applied using break && inline method', () => {
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
            <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>
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
                let audio: HTMLElement = rteObj.element.querySelector('.e-rte-audio') as HTMLElement;
                let mouseEventArg = {
                    args: { item: { command: 'Audios', subCommand: '' } },
                    selectNode: [audio]
                };
                (<any>rteObj).audioModule.inline(mouseEventArg);
                (<any>rteObj).audioModule.break(mouseEventArg);
                expect(audio.classList.contains('e-audio-inline')).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Mouse Click for audio testing when showOnRightClick enabled', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p>Hi audio is<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>`,
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
                value: `<p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`,
                inlineMode: {
                    enable: true
                }
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
                value: `<p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`,
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
                    saveUrl: "https://services.syncfusion.com/angular/development/api/FileUploader/Save",
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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = '/base/spec/content/audio/RTE-Audio.mp34';
            let fileObj: File = new File(["Horse"], "horse.mp34", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertAudio') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                done();
            }, 1000);
        });
    });
    //  describe('Disable the insert audio dialog button when the audio is uploading', () => {
    //      let rteObj: RichTextEditor;
    //      beforeEach((done: Function) => {
    //          rteObj = renderRTE({
    //              toolbarSettings: {
    //                  items: ['Audio']
    //              },
    //              insertAudioSettings: {
    //                  saveUrl: "https://services.syncfusion.com/js/production/api/FileUploader/Save",
    //                  path: "../Audios/"
    //              }
    //          });
    //          done();
    //      })
    //      afterEach((done: Function) => {
    //          destroy(rteObj);
    //          done();
    //      })
    //      it(' Button enabled with audio upload Success', (done) => {
    //          let rteEle: HTMLElement = rteObj.element;
    //          (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //          let args = { preventDefault: function () { } };
    //          let range = new NodeSelection().getRange(document);
    //          let save = new NodeSelection().save(range, document);
    //          let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
    //          (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
    //          let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
    //          (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
    //          let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
    //          let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
    //          (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
    //          setTimeout(() => {
    //              expect((dialogEle.querySelector('.e-insertAudio') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
    //              done();
    //          }, 5500);
    //      });
    //  });
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
                (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
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
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>
                 </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#aud-container span');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2, preventDefault: function () { } };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 100);
        });
        it(" leftClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>
                 </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#aud-container span');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 , preventDefault: function () { } };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 100);
        });
        it(" leftClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>
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
            }, 100);
        });
        it(" rightClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>
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
            }, 100);
        });
        it(" rightClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='aud-container'>
                     <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>
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
            }, 100);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    });

    //  describe('Rename audios in success event- ', () => {
    //      let rteObj: RichTextEditor;
    //      beforeEach((done: Function) => {
    //          rteObj = renderRTE({
    //              fileUploadSuccess: function (args : any) {
    //                  args.file.name = 'rte_audio';
    //                  var filename : any = document.querySelectorAll(".e-file-name")[0];
    //                  filename.innerHTML = args.file.name.replace(document.querySelectorAll(".e-file-type")[0].innerHTML, '');
    //                  filename.title = args.file.name;
    //              },
    //              insertAudioSettings: {
    //                  saveUrl:"https://services.syncfusion.com/js/production/api/FileUploader/Save",
    //                  path: "../Audios/"
    //              },
    //              toolbarSettings: {
    //                  items: ['Audio']
    //              },
    //          });
    //          done();
    //      })
    //      afterEach((done: Function) => {
    //          destroy(rteObj);
    //          done();
    //      })
    //      it('Check name after renamed', (done) => {
    //          let rteEle: HTMLElement = rteObj.element;
    //          (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //          let args = { preventDefault: function () { } };
    //          let range = new NodeSelection().getRange(document);
    //          let save = new NodeSelection().save(range, document);
    //          let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
    //          (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
    //          let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
    //          (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
    //          (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
    //          let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
    //          let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
    //          (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
    //          setTimeout(() => {
    //              expect(document.querySelectorAll(".e-file-name")[0].innerHTML).toBe('rte_audio');
    //              done();
    //          }, 5500);
    //      });
    //  });

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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertAudio') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-audio.e-audio-inline source").getAttribute("src").indexOf("blob") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).audioModule.deleteAudio(evnArg);
                done();
            }, 100);
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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertAudio') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-audio.e-audio-inline source").getAttribute("src").indexOf("base64") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).audioModule.deleteAudio(evnArg);
                done();
            }, 100);
        });
    });

    //  describe('Insert Audio mediaSelected, mediaUploading and mediaUploadSuccess event - ', () => {
    //      let rteObj: RichTextEditor;
    //      let mediaSelectedSpy: jasmine.Spy = jasmine.createSpy('onFileSelected');
    //      let mediaUploadingSpy: boolean = false;
    //      let mediaUploadSuccessSpy: jasmine.Spy = jasmine.createSpy('onFileUploadSuccess');
    //      beforeEach((done: Function) => {
    //          rteObj = renderRTE({
    //              fileSelected: mediaSelectedSpy,
    //              fileUploading: mediaUploading,
    //              fileUploadSuccess: mediaUploadSuccessSpy,
    //              insertAudioSettings: {
    //                  saveUrl:"https://services.syncfusion.com/js/production/api/FileUploader/Save",
    //                  path: "../Audios/"
    //              },
    //              toolbarSettings: {
    //                  items: ['Audio']
    //              }
    //          });
    //          function mediaUploading() {
    //             mediaUploadingSpy = true;
    //          }
    //          done();
    //      })
    //      afterEach((done: Function) => {
    //          destroy(rteObj);
    //          done();
    //      })
    //      it(' Test the component insert audio events - case 1 ', (done) => {
    //          let rteEle: HTMLElement = rteObj.element;
    //          (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //          let args = { preventDefault: function () { } };
    //          let range = new NodeSelection().getRange(document);
    //          let save = new NodeSelection().save(range, document);
    //          let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
    //          (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
    //          let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
    //          (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
    //          (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
    //          let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
    //          let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
    //          (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
    //          expect(mediaSelectedSpy).toHaveBeenCalled();
    //          expect(mediaUploadingSpy).toBe(true);
    //          setTimeout(() => {
    //              expect(mediaUploadSuccessSpy).toHaveBeenCalled();
    //              evnArg.selectNode = [rteObj.element];
    //              (<any>rteObj).audioModule.deleteAudio(evnArg);
    //              (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
    //              done();
    //          }, 5500);
    //      });
    //  });

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
                    saveUrl: "https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(isMediaUploadSuccess).toBe(false);
                expect(isMediaUploadFailed).toBe(false);
                done();
            }, 1000);

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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
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
            }, 100);
        });
    });

    describe('Insert audio mediaUploadFailed event - ', () => {
        let rteObj: RichTextEditor;
        let mediaUploadFailedSpy: jasmine.Spy = jasmine.createSpy('onFileUploadFailed');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                fileUploadFailed: mediaUploadFailedSpy,
                insertAudioSettings: {
                    saveUrl: "uploadbox/Save",
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
        it(' Test the component insert audio events - case 3 File Upload failed test ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).audioModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(mediaUploadFailedSpy).toHaveBeenCalled();
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).audioModule.deleteAudio(evnArg);
                (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                done();
            }, 3000);
        });
    });

    describe('Testing allowed extension in audio upload - ', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                insertAudioSettings: {
                    allowedTypes: ['.mp3'],
                    saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            let fileObj: File = new File(["Horse"], "horse.m4a", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertAudio') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).audioModule.deleteAudio(evnArg);
                (<any>rteObj).audioModule.uploadObj.upload((<any>rteObj).audioModule.uploadObj.filesData[0]);
                done();
            }, 1000);
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
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
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
                value: `<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>`
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
        let QTBarModule: IQuickToolbar;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio'],
                },
                value: '<p>Sample Text</p> <p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p><p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span></p>'
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
            }, 300);
        });
        it('second audio click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[1] as HTMLElement, 'mouseup');
            let eventsArgs: any = { target: rteObj.element.querySelectorAll('.e-audio-wrap audio')[1], preventDefault: function () { } };
            (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 300);
        });
        it('first audio click after p click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[0] as HTMLElement, 'mouseup');
            let eventsArgs: any = { target: rteObj.element.querySelectorAll('.e-audio-wrap audio')[0], preventDefault: function () { } };
            (<any>rteObj).audioModule.onDocumentClick(eventsArgs);
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 300);
        });
        it('second audio click after p click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[1] as HTMLElement, 'mouseup');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 300);
        });
    });
    describe('Audio focus not working after outside click then again click a audio', () => {
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio'],
                },
                value: '<p>Sample Text</p> <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span>'
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
            }, 100);
        });
        it('Again audio click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content .e-audio-wrap')[0] as HTMLElement, 'mouseup');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content .e-audio-wrap audio')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 100);
        });
    });
    describe('ShowDialog, CloseDialog method testing', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({});
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
            let eventsArg1: any = { pageX: 50, pageY: 300, target: document.querySelector('p') };
            clickEvent1.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg1 });
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
            done();
        });
    });
    describe('Undo the Audio after delete', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>testing`;
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

        it('Undo the audio after delete action ', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].firstChild;
            setCursorPoint(node, 7);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap')).toBe(null);
            keyBoardEvent.keyCode = 90;
            (rteObj as any).keyDown(keyBoardEvent);
            done();
        });
    });
    describe('836851 - check the audio quick toolbar hide, while click the enterkey ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent = {
            type: 'keydown',
            preventDefault: function () { },
            ctrlKey: false,
            key: 'enter',
            stopPropagation: function () { },
            shiftKey: false,
            which: 13,
            keyCode: 13,
            action: 'enter'
        };
        let innerHTML: string = `<p>Testing<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('check the audio quick toolbar hide, while click the enterkey', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: clickEvent });
            (<any>rteObj).keyDown(keyBoardEvent);
            expect(document.querySelector('.e-rte-quick-popup')).toBe(null);
            done();
        });
    });

    describe('836851 - check auido remove', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent = {
            type: 'keydown',
            preventDefault: function () { },
            ctrlKey: false,
            key: 'enter',
            stopPropagation: function () { },
            shiftKey: false,
            which: 13,
            keyCode: 13,
            action: 'enter'
        };
        let innerHTML: string = `<p>Testing<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Remove audio using quick toolbar', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            let eventsArg = { target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
            expect(!isNullOrUndefined(document.querySelector('.e-audio-wrap') as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            let audioQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (audioQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-audio-wrap') as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            done();
        });
    });
    describe('836851 - check the audio quick toolbar hide', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Hide the audio quick toolbar', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-clickelem');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            let eventsArg = { target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.onDocumentClick(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventsArg });
            (<any>rteObj).audioModule.hideAudioQuickToolbar()
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            done();
        });
    });
    describe('Audio dialog - Short cut key', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            action: 'escape',
            key: 's'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('close audio dialog - escape', (done: Function) => {
            keyboardEventArgs.action = 'escape';
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(isNullOrUndefined((<any>rteObj).audioModule.dialogObj)).toBe(false);
            (<any>rteObj).audioModule.onKeyDown({ args: keyboardEventArgs });
            expect(isNullOrUndefined((<any>rteObj).audioModule.dialogObj)).toBe(true);
            done();
        });
    });
    describe('836851 - iOS device interaction', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`;
        beforeAll(() => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = currentBrowserUA;
            destroy(rteObj);
        });
        it('Remove the audio using quick toolbar ', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-audio-wrap');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: clickEvent });
            expect(!isNullOrUndefined(document.querySelector('.e-audio-wrap') as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            let audioQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (audioQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-audio-wrap') as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            done();
        });
    });
    describe('836851 - Remove the audio using audio quick toolbar ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Remove the audio using  audio quick toolbar ', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-clickelem');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).audioModule.editAreaClickHandler({ args: clickEvent });
            expect(!isNullOrUndefined(rteEle.querySelector('.e-rte-audio') as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            let audioQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (audioQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined(rteEle.querySelector('.e-rte-audio') as HTMLElement)).toBe(true);
                expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                done();
            }, 100);
        });
    });
    describe(' Mobile audio interaction', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        let innerHTML: string = `<p>Testing<span class="e-audio-wrap" contenteditable="false" title="mixkit-rain-and-thunder-storm-2390.mp3"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('check the audio click', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (rteObj.element.querySelector('.e-audio-wrap') as HTMLElement).click();
            dispatchEvent((rteObj.element.querySelector('.e-clickelem') as HTMLElement), 'mouseup');
            let eventsArgs: any = { target: (rteObj.element.querySelector('.e-clickelem') as HTMLElement), preventDefault: function () { } };
            (<any>rteObj).audioModule.audioClick(eventsArgs);
            expect(!isNullOrUndefined(rteObj.contentModule.getEditPanel().querySelector('.e-rte-audio'))).toBe(true);
            done();
        });
    });
    describe('836851 - Insert audio', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Close the dialog while audio insert', (done: Function) => {
            (<any>rteEle).querySelectorAll(".e-toolbar-item")[0].click();
            setTimeout(() => {
                expect(!isNullOrUndefined(document.querySelector('.e-rte-audio-dialog'))).toBe(true);
                (<any>rteEle).querySelector('.e-cancel').click();
                setTimeout(() => {
                    expect(!isNullOrUndefined(document.querySelector('.e-rte-audio-dialog'))).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('Insert audio dialog testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the dialog close using close icon', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let fileObj: File = new File(["Nice One"], "sample.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                expect((<any>rteObj).audioModule.uploadObj.fileList.length).toEqual(1);
                (document.getElementsByClassName('e-dlg-closeicon-btn')[0] as HTMLElement).click()
                done();
            }, 100);
        });
    });
    describe('836851 - Check the insert button - without input URL', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the insert button - without input URL', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.audioUrl .e-input.e-audio-url') as HTMLElement).click();
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = '';
            (dialogEle.querySelector('.e-audio-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-insertAudio') as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-audio-wrap'))).toBe(true);
            done();
        });
    });
    describe('836851 - insertAudioUrl', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                insertAudioSettings: {
                    layoutOption: 'Break'
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the insertAudioUrl', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
            (<any>rteObj).audioModule.uploadUrl = { url: "https://www.w3schools.com/html/mov_bbb.mp4" };
            (rteEle.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.audioUrl .e-input.e-audio-url') as HTMLElement).click();
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertAudio.e-primary') as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-rte-audio'))).toBe(true)
            done();
        });
    });
    describe('836851 - insertAudioUrl Inline', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                insertAudioSettings: {
                    layoutOption: 'Inline'
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the insertAudioUrl', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.audioModule);
            (<any>rteObj).audioModule.uploadUrl = { url: "https://www.w3schools.com/html/mov_bbb.mp4" };
            (rteEle.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.audioUrl .e-input.e-audio-url') as HTMLElement).click();
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertAudio.e-primary') as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-rte-audio'))).toBe(true)
            done();
        });
    });
    describe('836851 - Audio keyup', function () {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML: string = `testing<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check the audio keyup - backspace', function (done) {
            let startContainer = rteObj.contentModule.getEditPanel().querySelector('p').childNodes[0];
            let endContainer = rteObj.contentModule.getEditPanel().querySelector('p')
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startContainer, endContainer, 7, 2)
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (<any>rteObj).keyDown(keyBoardEvent);
            (<any>rteObj).audioModule.onKeyUp();
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-audio-wrap'))).toBe(true)
            done();
        });
    });
    // describe('836851 - Check the audio quick toolbar render after the insert the audio', function () {
    //     let rteObj: RichTextEditor;
    //     beforeAll((done: Function) => {
    //         rteObj = renderRTE({
    //             height: 400,
    //             toolbarSettings: {
    //                 items: ['Audio', 'Bold']
    //             },
    //         });
    //         done();
    //     });
    //     afterAll((done: Function) => {
    //         destroy(rteObj);
    //         done();
    //     });
    //     it('Check the audio quick toolbar render after the insert the audio', (done: Function) => {
    //         (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //         (rteObj.element.querySelectorAll('.e-toolbar-item')[0]as HTMLElement).click()
    //         expect(!isNullOrUndefined(rteObj.element.querySelector('.e-dialog'))).toBe(true);
    //         let dialogEle: any = rteObj.element.querySelector('.e-dialog');
    //         (dialogEle.querySelector('.audioUrl .e-input.e-audio-url')as HTMLElement).click();
    //         (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.mp3';
    //         (dialogEle.querySelector('.e-audio-url') as HTMLElement).dispatchEvent(new Event("input"));
    //         (document.querySelector('.e-insertAudio.e-primary')as HTMLElement).click();
    //         let target = (<any>rteObj).element.querySelectorAll(".e-content")[0];
    //         let clickEvent = document.createEvent("MouseEvents");
    //         clickEvent.initEvent("mousedown", false, true);
    //         target.dispatchEvent(clickEvent);
    //     });
    // });
    describe('859306 - Opus and M4a type audios are not supported in RichTextEditor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `<p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.ogg"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg"></audio></span></span><br></p>`;
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

        it('Checking the type of the audio', (done: Function) => {
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
                (<any>rteObj).audioModule.alignmentSelect(mouseEventArgs);
                let sourceElement = rteObj.contentModule.getEditPanel().querySelector('.e-audio-wrap audio source');
                expect(sourceElement.getAttribute('type')).toBe('audio/ogg');
                done();
            }, 200);
        });
    });
    describe('837380: The web url is empty when trying to edit after being inserted into the Rich Text Editor', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach(function (done) {
            rteObj = renderRTE({
                value: "<p><span class=\"e-audio-wrap\" contenteditable=\"false\" title=\"horse.mp3\"><span class=\"e-clickElem\"><audio class=\"e-rte-audio e-audio-inline\" controls=\"\"><source src=\"/base/spec/content/audio/RTE-Audio.mp3\" type=\"audio/mp3\"></audio></span></span><br></p>"
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach(function (done) {
            destroy(rteObj);
            done();
        });
        it('validating whether or not the audio web url is present', function (done) {
            let audio: HTMLElement = rteObj.element.querySelector(".e-audio-wrap");
            setCursorPoint(audio, 0);
            dispatchEvent(audio, 'mousedown');
            audio.click();
            dispatchEvent(audio, 'mouseup');
            setTimeout(function () {
                let audioBtn: HTMLElement = document.getElementById(controlId + "_quick_AudioReplace");
                audioBtn.parentElement.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_audio");
                let urlInput: HTMLInputElement = dialog.querySelector('.e-audio-url');
                expect(urlInput.value !== null && urlInput.value !== undefined && urlInput.value !== '').toBe(true);
                done();
            }, 100);
        });
    });

    describe('869663 - Inserted Audio is not shown ', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Audio']
                },
                insertAudioSettings: {
                    layoutOption: 'Break'
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it('Test the inserted audio in the component ', (done) => {
            let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            setTimeout(function () {
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
                (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                let fileObj: File = new File(["Horse"], "horse.mp3", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                (<any>rteObj).audioModule.uploadObj.onSelectFiles(eventArgs);
                (document.querySelector('.e-insertAudio') as HTMLElement).click();
                let trg = (iframeBody.querySelector('.e-rte-audio') as HTMLElement);
                expect(!isNullOrUndefined(trg)).toBe(true);
                done();
            }, 100);
        });
    });

    describe('907730 - After media delete not triggered after backspace and delete action of video', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let removeSuccess: boolean = false;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                value: innerHTML1,
                afterMediaDelete: (e: any) => {
                    removeSuccess = true;
                }
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
            (<any>rteObj).audioModule.onKeyUp();
            setTimeout(() => {
                expect(removeSuccess).toBe(true);
                done();
            }, 100);
        });
    });
    describe('921776-Script error occurs after changing display to break for audio file in insert media sample ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `
            <p>testing&nbsp;<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                iframeSettings: {
                    enable: true
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('921776-Script error occurs after changing display to break for audio file in insert media sample', (done: Function) => {
            let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            let target: HTMLElement = iframeBody.querySelector('.e-audio-wrap');
            dispatchEvent(target, 'mousedown');
            target.click();
            dispatchEvent(target, 'mouseup');
            expect(target.classList.contains('e-audio-wrap')).toBe(true);
            var eventArgs = { pageX: 50, pageY: 300, target: target };
            (<any>rteObj).audioModule.editAreaClickHandler({ args: eventArgs });
            (<any>rteObj).audioModule.audEle = rteObj.contentModule.getEditPanel().querySelector('.e-audio-wrap audio');
            setTimeout(function () {
                let commandArgs = {
                    item: { command: 'Audios', subCommand: 'Inline' }
                };
                let audio: HTMLElement = iframeBody.querySelector('.e-rte-audio') as HTMLElement;
                (<any>rteObj).audioModule.alignmentSelect(commandArgs);
                expect(audio.classList.contains('e-audio-inline')).toBe(true);
                done();
            }, 200);
        });
    });

    describe(' 923367- IFrame: Both Replaced and Original Audio Files Displayed After Replacing Web URL Audio File with an existing browsed audio file - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span><br></p>`,
                iframeSettings: {
                    enable: true
                },
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Test - Replace the audio ', (done) => {
            let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            let audio: HTMLElement = iframeBody.querySelector(".e-audio-wrap");
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
                let updateAudio: HTMLSourceElement = iframeBody.querySelector(".e-audio-wrap source");
                expect((iframeBody.querySelectorAll('audio').length)).toBe(1);
                expect(updateAudio.src === audioFile).toBe(true);
                done();
            }, 200);
        });
    });

    describe('939661: Audio progress bar event is not unbinding after playback in Safari', () => {
        let editor: RichTextEditor;
        const defaultUA: string = navigator.userAgent;
        const safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
        beforeAll(() => {
            Browser.userAgent = safari;
            editor = renderRTE({
                value: `<p><audio controls>
                            <source src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav" type="audio/mp3" />
                        </audio>
                        </p> `
            });
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });

        it('Should not call the prevent default for the click of the audio SAFARI.', (done: Function) => {
            editor.focusIn();
            const audioElem: HTMLAudioElement = editor.inputElement.querySelector('audio');
            let defaultPrevent: boolean = true;
            function onAudioClick(e: any) {
                defaultPrevent = e.defaultPrevented; // Will be true only if preventDefault() was called somewhere
            }
            audioElem.addEventListener('click', onAudioClick.bind(this));
            audioElem.click();
            setTimeout(() => {
                expect(defaultPrevent).toBe(false);
                audioElem.removeEventListener('click', onAudioClick)
                done();
            }, 100);
        });
    });

    describe('Bug-934076- Audio is not deleted when press delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `<ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert im<span class="e-audio-wrap" contenteditable="false" title="horse.mp3"><span class="e-clickElem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="/base/spec/content/audio/RTE-Audio.mp3" type="audio/mp3"></audio></span></span>ages, tables, audio, and video.</li><li>Inline styles include bold, italic, underline, strikethrough, hyperlinks, and more.</li></ul>`;
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
            let node: any = (rteObj as any).inputElement.childNodes[0].childNodes[0].childNodes[0];
            setCursorPoint(node, 101);
            const deleteKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDownEvent);
            setTimeout(() => {
                expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap')).toBe(null);
                expect((<any>rteObj).inputElement.childNodes[0].childNodes[0].childElementCount === 0).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Backspace behavior after inserting text following an audio element', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `
        <p>Testing</p>
        <span class="e-audio-wrap" contenteditable="false" title="audio.mp3">
            <audio class="e-rte-audio e-audio-inline" controls="">
                <source src="https://example.com/audio.mp3" type="audio/mp3">
            </audio>
        </span>
        <span class="text-node">Some text</span>`;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
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
        it('Audio backsapce action checking using backspace key', (done: Function) => {
            let node: any = rteObj.inputElement.querySelector('.text-node').childNodes[0];
            setCursorPoint(node, node.textContent.length);
            const backspaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backspaceKeyDownEvent);
            setTimeout(() => {
                expect((rteObj as any).inputElement.querySelector('.text-node').textContent !== 'Sometext').toBe(true);
                done();
            }, 200);
        });
    });
    describe('Audio Module insertDragAudio - drop scenarios', () => {
        let rteObj: any;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: { items: ['Audio'] },
                insertAudioSettings: { allowedTypes: ['.mp3'] }
            });
        });

        afterEach(() => destroy(rteObj));

        it('should insert audio only for single file drop, and not insert for multiple or no files', (done: DoneFn) => {
            // --- 1. Single audio file drop: should insert audio ---
            rteObj.value = `<p>This is a text content.</p>`;
            rteObj.dataBind();
            const paragraphForSingleDrop = rteObj.inputElement.querySelector('p');
            const audioFile = new File(['dummy'], 'test.mp3', { type: 'audio/mp3' });
            const singleTransfer = new DataTransfer();
            singleTransfer.items.add(audioFile);
            const singleDropEvent = new DragEvent('drop', { dataTransfer: singleTransfer, bubbles: true });
            paragraphForSingleDrop.dispatchEvent(singleDropEvent);

            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('.e-audio-wrap').length).toBe(1);

                // --- 2. Multiple file drop: should NOT insert audio ---
                while (rteObj.inputElement.querySelector('.e-audio-wrap')) {
                    rteObj.inputElement.querySelector('.e-audio-wrap').remove();
                }

                rteObj.value = `<p>This is a text content.</p>`;
                rteObj.dataBind();
                const paragraphForMultiDrop = rteObj.inputElement.querySelector('p');
                const audioFile2 = new File(['dummy2'], 'test2.mp3', { type: 'audio/mp3' });
                const multiTransfer = new DataTransfer();
                multiTransfer.items.add(audioFile);
                multiTransfer.items.add(audioFile2);
                const multiDropEvent = new DragEvent('drop', { dataTransfer: multiTransfer });
                paragraphForMultiDrop.dispatchEvent(multiDropEvent);

                setTimeout(() => {
                    expect(rteObj.inputElement.querySelectorAll('.e-audio-wrap').length).toBe(0);

                    // --- 3. Empty (no files) drop: should NOT insert audio ---
                    rteObj.value = `<p>This is a text content.</p>`;
                    rteObj.dataBind();
                    const paragraphForEmptyDrop = rteObj.inputElement.querySelector('p');
                    const emptyTransfer = new DataTransfer();
                    const emptyDropEvent = new DragEvent('drop', { dataTransfer: emptyTransfer });
                    paragraphForEmptyDrop.dispatchEvent(emptyDropEvent);

                    setTimeout(() => {
                        expect(rteObj.inputElement.querySelectorAll('.e-audio-wrap').length).toBe(0);
                        done();
                    }, 75);
                }, 75);
            }, 75);
        });
    });

    describe('RTE Drag and Drop Audio with paste restrictions', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        let element: HTMLElement;
        let audioSize: number;
        let size: number;
        let sizeInBytes: number;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element", innerHTML:
                    ` <div class="form-group">
                        <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                        </textarea>
                        <div id="dateError"></div>
                    </div>
                    ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    items: ['Audio']
                },
                insertAudioSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                fileUploading: function (args) {
                    expect(rteObj.toolbarModule.baseToolbar.toolbarObj.element.classList.contains('e-overlay')).toBe(true);
                    audioSize = size;
                    sizeInBytes = args.fileData.size;
                    if (audioSize < sizeInBytes) {
                        args.cancel = true;
                    }
                }
            });
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            detach(document.querySelector('.e-audio-inline'));
            done();
        });
        it(" Check audio after drop", function () {
            rteObj.focusIn();
            const {x, y} = pointInside(rteObj.contentModule.getEditPanel());
            let fileObj: File = new File(["Nice One"], "sample.mp3", { lastModified: 0, type: "audio/mp3" });
            let event: any = { clientX: x, clientY: y, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            (rteObj.audioModule as any).getDropRange(event.clientX, event.clientY);
            (rteObj.audioModule as any).dragDrop(event);
            ele = rteObj.element.getElementsByTagName('audio')[0];
            expect(rteObj.element.getElementsByTagName('audio').length).toBe(1);
            expect(ele.classList.contains('e-rte-audio')).toBe(true);
            expect(ele.classList.contains('e-audio-inline')).toBe(true);
        });
    });


    describe('Provide event to restrict the audio insertion when drag and drop', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        let element: HTMLElement;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element", innerHTML:
                    ` <div class="form-group">
                    <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                    </textarea>
                    <div id="dateError"></div>
                </div>
                ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                insertAudioSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                beforeMediaDrop: beforeMediaDropFunc
            });
            function beforeMediaDropFunc(args: any): void {
                args.cancel = true;
            }
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            detach(document.querySelector('.e-audio-inline'))
            done();
        });
        it("audioDrop event args.cancel as `true` check", function () {
            rteObj.focusIn();
            const {x, y} = pointInside(rteObj.contentModule.getEditPanel());
            let fileObj: File = new File(["Nice One"], "sample.mp3", { lastModified: 0, type: "audio/mp3" });
            let event: any = { clientX: x, clientY: y, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            (rteObj.audioModule as any).getDropRange(event.clientX, event.clientY);
            (rteObj.audioModule as any).dragDrop(event);
            ele = rteObj.element.getElementsByTagName('audio')[0];
            expect(rteObj.element.getElementsByTagName('audio').length).toBe(0);
        });
    });

    describe('Audio Module - External Drag and Drop', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement;
        let actionCompleteCalled: boolean = false;

        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element",
                innerHTML: `<div class="form-group">
                <textarea id="defaultRTE" name="defaultRTE"></textarea>
            </div>`
            });
            document.body.appendChild(element);

            rteObj = new RichTextEditor({
                insertAudioSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                actionComplete: function (args: any): void {
                    actionCompleteCalled = true;
                }
            });

            rteObj.appendTo('#defaultRTE');
            done();
        });

        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            done();
        });
        it("Should not insert audio if actionBegin callback sets cancel = true", function (done) {
            let fileObj = new File(["Audio content"], "sample.mp3", { type: "audio/mp3" });
            rteObj.inputElement.contentEditable = 'true';

            // Spy on parent.trigger to simulate actionBegin event and set cancel=true
            spyOn(rteObj, "trigger").and.callFake(function (eventName: any, args: any, callback: Function) {
                // If it's actionBegin and the callback exists, simulate cancel
                if (eventName === events.actionBegin && typeof callback === "function") {
                    args.cancel = true;
                    callback(args);
                }
                // For all other events, call original handler if present
                if (eventName === events.beforeMediaDrop && typeof callback === "function") {
                    callback(args);
                }
                return;
            });

            // Spy on formatter.process to make sure it's NOT called
            const processSpy = spyOn(rteObj.formatter, "process");

            let event = {
                clientX: 40,
                clientY: 294,
                target: rteObj.contentModule.getEditPanel(),
                dataTransfer: { files: [fileObj] },
                preventDefault: function () { }
            };

            (rteObj.audioModule as any).dragDrop(event);
            setTimeout(() => {
                // There should be no audio element inserted
                expect(rteObj.inputElement.querySelectorAll('audio').length).toBe(0);
                // Formatter should not be called
                expect(processSpy).not.toHaveBeenCalled();
                done();
            }, 150);
        });

        it("Should not insert audios when dropped on toolbar", function (done: Function) {
            // Create an audio file mock
            let fileObj: File = new File(["Audio content"], "sample.mp3", { lastModified: 0, type: "audio/mp3" });

            // Create drop event with external file targeting toolbar
            let event: any = {
                clientX: 40,
                clientY: 20, // Position at toolbar
                target: rteObj.element.querySelector('.e-toolbar'),
                dataTransfer: { files: [fileObj] },
                preventDefault: function () { return; }
            };

            // Count audios before drop
            const initialCount = rteObj.inputElement.querySelectorAll('audio').length;

            // Call the drag drop handler
            (rteObj.audioModule as any).dragDrop(event);

            // Check that no additional audio was inserted
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('audio').length).toBe(initialCount);
                done();
            }, 200);
        });

        it("Check audio after drop with file size validation", function (done: Function) {
            // Set up size validation in fileUploading event
            let size = 7; // Small size to force validation failure
            rteObj.fileUploading = function (args) {
                if (size < args.fileData.size) {
                    args.cancel = true;
                }
            };

            // Create an audio file mock
            let fileObj: File = new File(["Audio content that should be larger than size limit"], "sample.mp3", { lastModified: 0, type: "audio/mp3" });

            // Create drop event with external file
            let event: any = {
                clientX: 40,
                clientY: 294,
                target: rteObj.contentModule.getEditPanel(),
                dataTransfer: { files: [fileObj] },
                preventDefault: function () { return; }
            };

            // Count audios before drop
            const initialCount = rteObj.inputElement.querySelectorAll('audio').length;

            // Call the drag drop handler
            (rteObj.audioModule as any).dragDrop(event);

            // Should reject the file due to size
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('audio').length).toBe(initialCount);
                done();
            }, 200);
        });

        it("Should return early when uploadArea exists", function () {
            let fileObj = new File(["Audio content"], "sample.mp3", { type: "audio/mp3" });

            // Create a droparea element
            const dropArea = document.createElement('div');
            dropArea.className = classes.CLS_DROPAREA;
            rteObj.element.appendChild(dropArea);

            let event = {
                clientX: 40,
                clientY: 294,
                target: rteObj.contentModule.getEditPanel(),
                dataTransfer: { files: [fileObj] },
                preventDefault: function () { }
            };

            const spy = spyOn(rteObj.audioModule as any, 'insertDragAudio');

            (rteObj.audioModule as any).dragDrop(event);

            expect(spy).not.toHaveBeenCalled();

            // Clean up
            rteObj.element.removeChild(dropArea);
        });

        // Test for non-audio drop (isAudioOrFileDrop = false)
        it("Should handle non-audio drop", function () {
            // Create event with empty files array
            let event = {
                clientX: 40,
                clientY: 294,
                target: rteObj.contentModule.getEditPanel(),
                dataTransfer: { files: [] as File[] },
                preventDefault: function () { }
            };

            const spy = spyOn(rteObj.audioModule as any, 'insertDragAudio');

            (rteObj.audioModule as any).dragDrop(event);

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('Audio popup toolbar with null element', function () {
        let rteObj: RichTextEditor;
        let container: HTMLDivElement;

        beforeEach((done: DoneFn) => {
            container = document.createElement('div');
            document.body.appendChild(container);
            rteObj = new RichTextEditor({
                insertAudioSettings: { saveFormat: "Base64" },
                toolbarSettings: { items: ['Audio'] },
                quickToolbarSettings: { enable: true }
            });
            rteObj.appendTo(container);
            done();
        });

        afterEach((done: DoneFn) => {
            rteObj.destroy();
            document.body.removeChild(container);
            done();
        });

        it('should show audio popup toolbar when audio element exists', (done: DoneFn) => {
            const expectedAudioUrl = "/base/spec/content/audio/RTE-Audio.mp3";
            rteObj.value = `<audio class="e-rte-audio" src="${expectedAudioUrl}" controls>
            <source src="${expectedAudioUrl}" type="audio/mp3"></audio>`;
            rteObj.dataBind();

            const audioElem = rteObj.inputElement.querySelector(`audio[src="${expectedAudioUrl}"]`) as HTMLElement;
            expect(audioElem).not.toBeNull();

            setCursorPoint(audioElem, 0);

            // Simulate mousedown/mouseup to user interaction
            audioElem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            audioElem.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            // Call the editor's click handler
            (rteObj.audioModule as any).editAreaClickHandler({ args: { target: audioElem, which: 1 } });

            setTimeout(() => {
                // Check in both body and the editor element
                const quickPopup = document.body.querySelector('.e-rte-quick-popup') ||
                    rteObj.element.querySelector('.e-rte-quick-popup');
                expect(quickPopup).not.toBeNull();
                expect((quickPopup as HTMLElement).style.display).not.toBe('none');
                done();
            }, 150);
        });
        it('should NOT show audio popup toolbar when audio element is null', (done: DoneFn) => {
            // Create an audio element that is NOT in the RTE content
            const testAudioElem = document.createElement('audio');
            setCursorPoint(testAudioElem, 0);

            // Simulate mousedown/mouseup
            testAudioElem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            testAudioElem.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            (rteObj.audioModule as any).editAreaClickHandler({ args: { target: testAudioElem, which: 1 } });

            setTimeout(() => {
                // Check in both body and the editor element; expect null!
                const quickPopup = document.body.querySelector('.e-rte-quick-popup') ||
                    rteObj.element.querySelector('.e-rte-quick-popup');
                expect(quickPopup).toBeNull();
                done();
            }, 150);
        });
    });
    describe('onSelect drops audio file and triggers upload', () => {
        let rteObj: RichTextEditor;
        let dragFile: File;
        let dragDataTransfer: { files: File[] };
        let dragEvent: any;

        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({});
            dragFile = new File(["Audio Data"], "dragged-audio.mp3", { type: "audio/mp3" });
            dragDataTransfer = { files: [dragFile] };
            dragEvent = {
                dataTransfer: dragDataTransfer,
                preventDefault: jasmine.createSpy('preventDefault')
            };
            (rteObj as any).insertAudioSettings = { path: "", layoutOption: "Inline" };
            rteObj.contentModule.getEditPanel().innerHTML = '';
            done();
        });

        afterEach((done: DoneFn) => {
            rteObj.destroy();
            done();
        });

        it('should handle audio drop and upload when actionBeginArgs.cancel is false and audio is rendered with source', (done: DoneFn) => {
            spyOn(rteObj.formatter, 'process').and.callFake(() => {
                rteObj.contentModule.getEditPanel().innerHTML =
                    '<audio class="e-rte-audio" controls><source src="dragged-audio.mp3" type="audio/mp3"></audio>';
            });

            const uploadMethodSpy = spyOn(rteObj.audioModule as any, 'uploadMethod');
            spyOn(rteObj, 'trigger').and.callFake(function (_eventName: string, args: any, callback?: Function) {
                if (typeof callback === 'function') {
                    callback(Object.assign({}, args, {
                        cancel: false,
                        originalEvent: dragEvent
                    }));
                }
            });

            (rteObj.audioModule as any).onSelect(dragEvent as DragEvent);

            setTimeout(() => {
                expect(uploadMethodSpy).toHaveBeenCalled();
                const audio = rteObj.contentModule.getEditPanel().querySelector('audio');
                expect(audio).not.toBeNull();
                expect((audio as HTMLAudioElement).style.opacity).toBe('0.5');
                const source = audio!.querySelector('source');
                expect(source).not.toBeNull();
                expect((source as HTMLSourceElement).getAttribute('src')).toBe('dragged-audio.mp3');
                done();
            }, 10);
        });

        it('should call originalEvent.preventDefault when actionBeginArgs.cancel is true', () => {
            spyOn(rteObj, 'trigger').and.callFake(function (_eventName: string, args: any, callback?: Function) {
                if (typeof callback === 'function') {
                    callback(Object.assign({}, args, {
                        cancel: true,
                        originalEvent: dragEvent
                    }));
                }
            });

            (rteObj.audioModule as any).onSelect(dragEvent as DragEvent);
            expect(dragEvent.preventDefault).toHaveBeenCalled();
        });

        it('should skip upload if audio element is not available after drop', () => {
            spyOn(rteObj.formatter, 'process').and.callFake(() => {
            });

            const uploadMethodSpy = spyOn(rteObj.audioModule as any, 'uploadMethod');
            spyOn(rteObj, 'trigger').and.callFake(function (_eventName: string, args: any, callback?: Function) {
                if (typeof callback === 'function') {
                    callback(Object.assign({}, args, {
                        cancel: false,
                        originalEvent: dragEvent
                    }));
                }
            });
            (rteObj.audioModule as any).onSelect(dragEvent as DragEvent);
            expect(uploadMethodSpy).not.toHaveBeenCalled();
        });
    });
    describe('dragOver functionality across different browsers', () => {
        let rteObj: RichTextEditor;
        let dragEvent: any;
        let backupBrowserName: string;

        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({});
            dragEvent = {
                dataTransfer: {
                    items: [{ type: "audio/mp3" }],
                    types: ["Files"]
                },
                preventDefault: jasmine.createSpy('preventDefault')
            };
            // Backup the browser name (info.name)
            backupBrowserName = Browser.info.name;
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            // Restore the browser name
            Browser.info.name = backupBrowserName;
            done();
        });

        it('should call preventDefault for Edge browsers when dragging audio', () => {
            Browser.info.name = 'edge';
            dragEvent.dataTransfer.items = [{ type: 'audio/mp3' }];
            const result = (rteObj.audioModule as any).dragOver(dragEvent);
            expect(dragEvent.preventDefault).toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it('should call preventDefault for Internet Explorer when types contain Files', () => {
            Browser.info.name = 'ie';
            dragEvent.dataTransfer.types = ["Files"];
            const result = (rteObj.audioModule as any).dragOver(dragEvent);
            expect(result === undefined || result === true).toBe(true);
        });

        it('should return true for other browsers or types', () => {
            Browser.info.name = 'chrome';
            dragEvent.dataTransfer.items = [{ type: 'text/plain' }];
            dragEvent.dataTransfer.types = ["text"];
            const result = (rteObj.audioModule as any).dragOver(dragEvent);
            expect(dragEvent.preventDefault).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });
    });
    describe('Audio module undoStack coverage', () => {
        let rteObj: any;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: { items: ['Audio'] }
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should cover undoStack when subCommand is not undo/redo', () => {
            let undoCount = (rteObj as any).formatter.getUndoRedoStack().length;
            (rteObj as any).audioModule.undoStack({ subCommand: "audio" });
            expect((rteObj as any).formatter.getUndoRedoStack().length === undoCount).toBe(true);
        });
    });
    describe('AudioModule bindOnEnd else branch coverage', () => {
        let rteObj: any;
        beforeEach(() => {
            rteObj = renderRTE({ toolbarSettings: { items: ['Audio'] } });
        });
        afterEach(() => {
            destroy(rteObj);
        });

        it('should cover bindOnEnd else-branch when audioObj is already not null', () => {
            let manager = rteObj.formatter.editorManager;
            manager.audioObj = {};
            (rteObj.audioModule as any).bindOnEnd();
        });
    });
    describe('AudioModule addEventListener else path coverage', () => {
        let rteObj: any;
        beforeEach(() => {
            rteObj = renderRTE({ toolbarSettings: { items: ['Audio'] } });
        });
        afterEach(() => {
            destroy(rteObj);
        });

        it('should cover addEventListener when drop, drag, enter are null', () => {
            rteObj.audioModule.drop = () => { };
            rteObj.audioModule.drag = () => { };
            rteObj.audioModule.enter = () => { };
            (rteObj as any).audioModule.addEventListener();
        });
        it('should cover addEventListener early return when parent.isDestroyed is true', () => {
            rteObj.isDestroyed = true;
            (rteObj as any).audioModule.addEventListener();
            rteObj.isDestroyed = false;
        });
    });
    describe('978382 - Audio element is not deleted when pressing the Delete key', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, action: 'backspace', ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `<p>Using the quick toolbar, users can replace, display, and delete the selected audio.</p>
<p><span class="e-audio-wrap" contenteditable="false" style="width: 300px; margin: 0px auto;"><span class="e-clickelem"><audio controls="" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Audio.wav"  class="e-rte-audio e-audio-inline" style=""><source type="audio/mp3"/></audio></span></span><br/></p>`;
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
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('Audio delete action checking using backspace key', (done: Function) => {
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'backspace';
            const range = document.createRange();
            range.setEndAfter(document.querySelector('.e-clickelem'));
            range.setStartBefore(document.querySelector('.e-clickelem'));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-audio-wrap')).toBe(null);
            done();
        });
    });

    describe('Audio Drag and drop', () => {
    let rteObj: RichTextEditor;
    let ele: HTMLElement;
    let element: HTMLElement;
    let videoSize: number;
    let size: number;
    let sizeInBytes: number;

    beforeAll((done: Function) => {
        element = createElement('form', {
            id: "form-element", innerHTML:
                ` <div class="form-group">
                    <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                    </textarea>
                    <div id="dateError"></div>
                </div>
                ` });
        document.body.appendChild(element);

        rteObj = new RichTextEditor({
            insertAudioSettings: {
                saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save'
            },
            value: `<p>First p node-0</p>`,
            placeholder: 'Type something'
        });

        rteObj.appendTo('#defaultRTE');
        done();
    });

    afterAll((done: Function) => {
        destroy(rteObj);
        detach(element);
        const inlineAudio = document.querySelector('.e-audio-inline');
        if (inlineAudio) {
            detach(inlineAudio);
        }
        done();
    });

    it('Verified that the audio is dropping correctly and the target is set to the currently dropped audio', () => {
        rteObj.focusIn();
        const {x, y} = pointInside(rteObj.contentModule.getEditPanel());
        let fileObj: File = new File(["Nice One"], "sample.mp3", { lastModified: 0, type: "audio/mp3" });
        let event: any = { clientX: x, clientY: y, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
        (rteObj.audioModule as any).getDropRange(event.clientX, event.clientY);
        (rteObj.audioModule as any).dragDrop(event);
        ele = rteObj.element.getElementsByTagName('audio')[0];
        expect(rteObj.element.getElementsByTagName('audio').length).toBe(1);
        expect(ele.classList.contains('e-rte-audio')).toBe(true);
        expect(ele.classList.contains('e-audio-inline')).toBe(true);
    });
    });
    describe('976200: Backspace deletes only audio when video is before audio', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = {
            type: 'keydown',
            preventDefault: () => { },
            ctrlKey: false,
            key: 'Backspace',
            stopPropagation: () => { },
            shiftKey: false,
            which: 8,
            keyCode: 8,
            code: 'Backspace'
        };
        const innerHTML = `<h1>Welcome to the Sync<span class="e-video-wrap" contenteditable="false" title="Recording 2024-12-16 111248.mp4"><video class="e-rte-video e-video-inline e-resize" controls="" width="auto" height="auto" style="min-width: 0px; max-width: 1617px; min-height: 0px; width: 100px; height: 100px;"><source src="blob:http://127.0.0.1:5500/6ef6f056-052a-4fff-ae52-7bfb27ca0d3e" type="video/mp4"></video></span>fusion Rich Te<span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls="" style=""><source src="blob:http://127.0.0.1:5500/090750b3-225d-4ba7-a915-415f42f0efb1" type="audio/wav"></audio></span></span>xt Editor</h1>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Video', 'Bold']
                },
                value: innerHTML
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should delete only audio when backspace is pressed after audio', (done: Function) => {
            const audioNode = (rteObj as any).inputElement.querySelector('.e-audio-wrap');
            setCursorPoint(audioNode, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            const audioExists = (rteObj as any).inputElement.querySelector('.e-audio-wrap');
            const videoExists = (rteObj as any).inputElement.querySelector('.e-video-wrap');
            expect(audioExists).toBe(null);
            expect(videoExists).not.toBe(null);
            done();
        });
    });
    describe('976200: Delete deletes only audio when audio is before video', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        const innerHTML = `<h1>Welcome to the Sync<span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls=""><source src="blob:http://127.0.0.1:5500/090750b3-225d-4ba7-a915-415f42f0efb1" type="audio/wav"></audio></span></span>fusion Rich Te<span class="e-video-wrap" contenteditable="false" title="Recording 2024-12-16 111248.mp4"><video class="e-rte-video e-video-inline e-resize" controls="" width="auto" height="auto" style="min-width: 0px; max-width: 1617px; min-height: 0px; width: 100px; height: 100px;"><source src="blob:http://127.0.0.1:5500/6ef6f056-052a-4fff-ae52-7bfb27ca0d3e" type="video/mp4"></video></span>xt Editor</h1>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Video', 'Bold']
                },
                value: innerHTML
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should delete only audio when delete key is pressed after audio', (done: Function) => {
            const textNode: HTMLElement = (rteObj as any).inputElement.querySelector('h1').firstChild;
            setCursorPoint(textNode, textNode.textContent.length);
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            const audioExists = (rteObj as any).inputElement.querySelector('.e-audio-wrap');
            const videoExists = (rteObj as any).inputElement.querySelector('.e-video-wrap');
            expect(audioExists).toBe(null);
            expect(videoExists).not.toBe(null);
            done();
        });
    });
    describe('981296 - Inserted audio remains on the same line even after setting the layoutOption.', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Audio', 'Bold']
                },
                insertAudioSettings: {
                    layoutOption: 'Break'
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the audio is inserted in break style when layoutoption is in break', (done: Function) => {
            (<any>rteObj).audioModule.uploadUrl = { url: "https://www.w3schools.com/html/mov_bbb.mp4" };
            (rteEle.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.audioUrl .e-input.e-audio-url') as HTMLElement).click();
            (dialogEle.querySelector('.e-audio-url') as HTMLInputElement).value = window.origin + '/base/spec/content/audio/RTE-Audio.mp3';
            (dialogEle.querySelector('.e-audio-url') as HTMLElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertAudio.e-primary') as HTMLElement).click();
            expect(!isNullOrUndefined(rteObj.inputElement.querySelector('.e-rte-audio'))).toBe(true);
            expect((rteObj.inputElement.querySelector('.e-audio-wrap') as HTMLElement).style.display == 'block').toBe(true);
            done();
        });
    });
    describe('982989 - Backspace removes audio and preceding text character', () => {
        let rteObj: RichTextEditor;
        let innerHTML1: string = `<h1>Welcome to the Syncfusion R<span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls="" style=""><source src="blob:null/f9441d42-c695-4615-8d65-28cc0d19cb56" type="audio/wav"/></audio></span></span> ich Text Editor</h1>`;
        beforeEach(() => {
            rteObj = renderRTE({
                value: innerHTML1
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Audio backsapce action checking using backspace key with cursor position', (done: Function) => {
            let node: any = rteObj.inputElement.querySelector('h1').childNodes[2];
            setCursorPoint(node, 0);
            const backspaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backspaceKeyDownEvent);
            const expectedHTML: string = '<h1>Welcome to the Syncfusion R ich Text Editor</h1>';
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML === expectedHTML).toBe(true);
                done();
            }, 100);
        });
        it('Audio backsapce action checking using backspace key with selection', () => {
            let node: any = rteObj.inputElement.querySelector('h1').childNodes[2];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, node, node, 0, 3);
            const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
            const expectedHTML: string = '<h1>Welcome to the Syncfusion R<span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls="" style=""><source src="blob:null/f9441d42-c695-4615-8d65-28cc0d19cb56" type="audio/wav"></audio></span></span> ich Text Editor</h1>';
            expect((rteObj as any).inputElement.innerHTML === expectedHTML).toBe(true);
        });
        it('Audio delete action checking using delete key with cursor position', (done: Function) => {
            let node: any = rteObj.inputElement.querySelector('h1').childNodes[1];
            setCursorPoint(node, 0);
            const deleteKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDownEvent);
            const expectedHTML: string = '<h1>Welcome to the Syncfusion R ich Text Editor</h1>';
            setTimeout(() => {
                expect((rteObj as any).inputElement.innerHTML === expectedHTML).toBe(true);
                done();
            }, 100);
        });
        it('Audio delete action checking using delete key with selection', () => {
            let node: any = rteObj.inputElement.querySelector('h1').childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(
                document, node, node, (node.textContent.length - 3), node.textContent.length);
            const deleteKeyDown: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDown);
            const expectedHTML: string = '<h1>Welcome to the Syncfusion R<span class="e-audio-wrap" contenteditable="false" title="RTE-Audio.wav"><span class="e-clickelem"><audio class="e-rte-audio e-audio-inline" controls="" style=""><source src="blob:null/f9441d42-c695-4615-8d65-28cc0d19cb56" type="audio/wav"></audio></span></span> ich Text Editor</h1>';
            expect((rteObj as any).inputElement.innerHTML === expectedHTML).toBe(true);;
        });
    });
    describe('985160 - Coverage for dragEnter', () => {
        let rteObj: RichTextEditor;
        let dragEvent: any;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({});
            dragEvent = {
                dataTransfer: {
                    items: [{ type: "audio/mp3" }],
                    types: ["Files"]
                },
                preventDefault: jasmine.createSpy('preventDefault')
            };
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('should cover dragEnter', () => {
            dragEvent.dataTransfer.items = [{ type: 'audio/mp3' }];
            (rteObj.audioModule as any).dragEnter(dragEvent);
            expect(dragEvent.dataTransfer.dropEffect === 'copy').toBe(true);
            expect(dragEvent.preventDefault).toHaveBeenCalled();
        });
    });
    describe('985160 - Coverage for Audio Module insertDragAudio', () => {
        let rteObj: any;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: { items: ['Audio'] },
                insertAudioSettings: { allowedTypes: ['.mp3'] },
                actionBegin: (args: ActionBeginEventArgs) =>{
                    args.cancel = true
                }
            });
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('should not insert audio when multiple files are dropped', (done: DoneFn) => {
            rteObj.value = `<p>Drop multiple files here.</p>`;
            rteObj.dataBind();
            const paragraphForMultiDrop = rteObj.inputElement.querySelector('p');
            const audioFile1 = new File(['dummy'], 'test1.mp3', { type: 'audio/mp3' });
            const audioFile2 = new File(['dummy'], 'test2.mp3', { type: 'audio/mp3' });
            const multiTransfer = new DataTransfer();
            multiTransfer.items.add(audioFile1);
            multiTransfer.items.add(audioFile2);
            const multiDropEvent = new DragEvent('drop', { dataTransfer: multiTransfer, bubbles: true });
            paragraphForMultiDrop.dispatchEvent(multiDropEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('.e-audio-wrap').length).toBe(0);
                done();
            }, 100);
        });
        it('should not call audioPaste when actionBeginArgs.cancel is true', (done: DoneFn) => {
            rteObj.value = `<p>Drop audio here.</p>`;
            rteObj.actionBegin = (args: ActionBeginEventArgs) => {
                args.cancel = true
            };
            rteObj.dataBind();
            const paragraph = rteObj.inputElement.querySelector('p');
            const audioFile = new File(['dummy'], 'test.mp3', { type: 'audio/mp3' });
            const transfer = new DataTransfer();
            transfer.items.add(audioFile);
            const dropEvent = new DragEvent('drop', { dataTransfer: transfer, bubbles: true });
            paragraph.dispatchEvent(dropEvent);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('.e-audio-wrap').length).toBe(0);
                done();
            }, 100);
        });
    });
});