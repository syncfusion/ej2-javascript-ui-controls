/**
 * Link module spec
 */
import { isNullOrUndefined, Browser, createElement } from '@syncfusion/ej2-base';
import { RichTextEditor } from './../../../src/index';
import { DialogType } from "../../../src/common/enum";
import { NodeSelection } from './../../../src/selection/index';
import { renderRTE, destroy, dispatchEvent, androidUA, iPhoneUA, currentBrowserUA, setCursorPoint } from "./../render.spec";
import { BACKSPACE_EVENT_INIT, BASIC_CONTEXT_MENU_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, ENTERKEY_EVENT_INIT } from '../../constant.spec';

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
    action: 'insert-link'
};

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

const RIGHT_CLICK_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_CONTEXT_MENU_EVENT_INIT);

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);


describe('Link Module', () => {
    describe('div content mobile ui', () => {
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({});
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('mobile UI', () => {
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.headerEle.innerHTML === 'Insert Link').toBe(true);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'google';
            let eventArgs: any = { keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false };
            (<any>rteObj).linkModule.dialogObj.keyDown(eventArgs);
        });
    });

    describe('exe command', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link exe command', () => {
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.headerEle.innerHTML === 'Insert Link').toBe(true);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'http://www.google.com';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            args = {
                item: { url: 'https://www.google.com/', selection: save, target: '_blank' },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.linkObj.createLink(args);
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let eventsArgs: any = { target: document, preventDefault: function () { } };
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let clickEvent: any = document.createEvent("MouseEvents");
            eventsArgs = { pageX: 50, pageY: 300, target: selectParent[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).formatter.editorManager.linkObj.openLink(args);
        });

        it('show link quick toolbar testing', (done: Function) => {
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let anchorElement: Element = document.querySelector('.e-rte-anchor');
            let evnArg = {
                target: anchorElement, args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            const target: HTMLElement = rteObj.inputElement.querySelector('a.e-rte-anchor');
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
                (<any>rteObj).linkModule.editAreaClickHandler({ args: evnArg });
                expect(document.querySelector('.e-rte-quick-popup')).toBe(null);
                done();
            }, 500);
        });

        it('show link quick toolbar with touch event arguments testing', (done: Function) => {
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let anchorElement: Element = document.querySelector('.e-rte-anchor');
            let evnArg = {
                target: anchorElement, args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode, touches: { length: 0 }, changedTouches: [{ pageX: 0, pageY: 0, clientX: 0 }]
            };
            const target: HTMLElement = rteObj.inputElement.querySelector('a.e-rte-anchor');
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
                (<any>rteObj).linkModule.editAreaClickHandler({ args: evnArg });
                expect(document.querySelector('.e-rte-quick-popup')).toBe(null);
                done();
            }, 500);
        });

    });

    describe('927520 - The link is not applied to the entire selected text in the Rich Text Editor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Example <a class="e-rte-anchor" href="https://www.existing-link.com">link</a> text is here.</p>',
                toolbarSettings: {
                    items: ['CreateLink']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('The link is not applied to the entire selected text in the Rich Text Editor', (done) => {
            const editPanel: any = rteObj.contentModule.getEditPanel();
            editPanel.focus();
            const selObj = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), editPanel.firstChild.firstChild, editPanel.firstChild.childNodes[1].childNodes[0], 2, editPanel.firstChild.childNodes[1].childNodes[0].length);
            const linkButton: any = rteObj.element.querySelector('.e-toolbar-item button');
            linkButton.click();
            const input = (rteObj.linkModule as any).dialogObj.contentEle.querySelector('.e-rte-linkurl');
            expect(input.value).toBe("https://www.existing-link.com");
            const primaryButton = (rteObj.linkModule as any).dialogObj.primaryButtonEle;
            primaryButton.click();
            setTimeout(() => {
                const expectedContent = '<p>Ex<a class="e-rte-anchor" href="https://www.existing-link.com" title="https://www.existing-link.com">ample link</a> text is here.</p>';
                expect(editPanel.innerHTML).toBe(expectedContent);
                done();
            }, 100);
        });
    });

    describe('div content-rte testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '<p>test</p>' });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link, editlink, openlink', (done) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.headerEle.innerHTML === 'Insert Link').toBe(true);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.firstElementChild.classList.contains('e-rte-linkcontent')).toBe(true);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl')).not.toBe(null);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText')).not.toBe(null);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkTitle')).not.toBe(null);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-checkbox-wrapper')).not.toBe(null);
            expect((<any>rteObj).linkModule.dialogObj.primaryButtonEle.classList.contains('e-insertLink')).toBe(true);
            setTimeout(() => {
                (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = '';
                evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
                (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor')).toBe(null);
                (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'insertlink';
                evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
                (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor')).not.toBe(null);
                let eventsArgs: any = { target: document, preventDefault: function () { } };
                (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
                (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
                (rteObj as any).value = 'test';
                (rteObj as any).dataBind();
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
                event = { preventDefault: function () { } };
                range = new NodeSelection().getRange(document);
                save = new NodeSelection().save(range, document);
                selectParent = new NodeSelection().getParentNodeCollection(range)
                selectNode = new NodeSelection().getNodeCollection(range);
                evnArg = {
                    target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                    selectParent: selectParent, selectNode: selectNode
                };
                setTimeout(function () {
                    (<any>rteObj).linkModule.linkDialog(evnArg);
                    (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'http://data';
                    evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
                    (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
                    expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor')).not.toBe(null);
                    expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').title === 'http://data').toBe(true);
                    expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').innerHTML === 'http://data').toBe(true);
                    (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').focus();
                    args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
                    event = { preventDefault: function () { } };
                    range = new NodeSelection().getRange(document);
                    save = new NodeSelection().save(range, document);
                    selectParent = new NodeSelection().getParentNodeCollection(range);
                    selectNode = new NodeSelection().getNodeCollection(range);
                    evnArg = {
                        target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save, selectNode: selectNode,
                        selectParent: selectParent
                    };
                    (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').target = '_blank';
                    (<any>rteObj).linkModule.editLink(evnArg);
                    expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value === 'http://data').toBe(true);
                    expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'http://data').toBe(true);
                    expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkTitle').value === 'http://data').toBe(true);
                    evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
                    (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
                    evnArg.args.item = { command: 'Links', subCommand: 'OpenLink' };
                    (<any>rteObj).linkModule.openLink(evnArg);
                    evnArg.args.item = { command: 'Links', subCommand: 'CreateLink' };
                    (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').target = '';
                    (<any>rteObj).linkModule.linkDialog(evnArg);
                    setTimeout(() => {
                        evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle.nextElementSibling;
                        (<any>rteObj).linkModule.dialogObj.primaryButtonEle.nextElementSibling.click(evnArg);
                        (<any>rteObj).linkModule.linkDialog(evnArg);
                        setTimeout(() => {
                            let eventArgs = { target: document, preventDefault: function () { } };
                            (<any>rteObj).linkModule.onIframeMouseDown();
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Link actions with LinkPath API property set as Relative', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>test</p>',
                enableAutoUrl: true
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link, editlink, openlink', () => {
            (rteObj as any).value = 'test';
            (rteObj as any).dataBind();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg: any = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'relativelink/link';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor')).not.toBe(null);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').title === 'relativelink/link').toBe(true);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').innerHTML === 'relativelink/link').toBe(true);
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').focus();
            args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            event = { preventDefault: function () { } };
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            selectParent = new NodeSelection().getParentNodeCollection(range);
            selectNode = new NodeSelection().getNodeCollection(range);
            evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save, selectNode: selectNode,
                selectParent: selectParent
            };
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').target = '_blank';
            (<any>rteObj).linkModule.editLink(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value === 'relativelink/link').toBe(true);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'relativelink/link').toBe(true);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkTitle').value === 'relativelink/link').toBe(true);
        });
    });

    describe('Insert link in HTML Tag IFRAME throws error', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '' });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link, editlink, openlink in HTML Tag IFRAME', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'http://data';
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = 'Provides <IFRAME> and <DIV> modes';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').focus();
            args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            event = { preventDefault: function () { } };
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            selectParent = new NodeSelection().getParentNodeCollection(range);
            selectNode = new NodeSelection().getNodeCollection(range);
            evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save, selectNode: selectNode,
                selectParent: selectParent
            };
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').target = '_blank';
            (<any>rteObj).linkModule.editLink(evnArg);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = 'Provides <IFRAME> and <DIV> modes Value';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            expect((<any>rteObj).contentModule.getEditPanel().innerText === `Provides <IFRAME> and <DIV> modes Value`).toBe(true);
        });
    });

    describe('toobar click open', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '<p>test</p>' });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('link dialog', () => {
            expect(rteObj.toolbarSettings.items[10]).toBe("CreateLink");
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range);
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg: any = {
                target: '', args: args,
                selfLink: (<any>rteObj).linkModule, selection: save, selectParent: selectParent, selectNode: selectNode
            };
            evnArg.args.item = { command: 'Links', subCommand: 'OpenLink' };
            (<any>rteObj).linkModule.openLink(evnArg);
            evnArg.args.item = { command: 'Links', subCommand: 'CreateLink' };
            (<any>rteObj).linkModule.editLink(evnArg);
            expect(isNullOrUndefined((<any>rteObj).linkModule.dialogObj)).toBe(true);
            (rteObj.toolbarModule.getToolbarElement().querySelectorAll('.e-toolbar-item button')[8] as HTMLElement).click();
            expect((<any>rteObj).linkModule.dialogObj.headerEle.innerHTML === 'Insert Link').toBe(true);
            (rteObj.toolbarModule.getToolbarElement().querySelectorAll('.e-toolbar-item button')[8] as HTMLElement).click();
            expect((<any>rteObj).linkModule.dialogObj).toBe(null);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            event = { preventDefault: function () { } };
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            selectParent = new NodeSelection().getParentNodeCollection(range);
            selectNode = new NodeSelection().getNodeCollection(range);
            evnArg = {
                target: '', args: args,
                selfLink: (<any>rteObj).linkModule, selection: save, selectParent: selectParent, selectNode: selectNode
            };
            (rteObj.toolbarModule.getToolbarElement().querySelectorAll('.e-toolbar-item button')[8] as HTMLElement).click();
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'http://data';
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = 'data';
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkTitle').value = 'data';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            (<any>rteObj).contentModule.getEditPanel().focus();
            args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            event = { preventDefault: function () { } };
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            selectParent = new NodeSelection().getParentNodeCollection(range);
            selectNode = new NodeSelection().getNodeCollection(range);
            evnArg = {
                target: '', args: args,
                selfLink: (<any>rteObj).linkModule, selection: save, selectNode: selectNode,
                selectParent: selectParent
            };

            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let eventsArgs: any = { target: document, preventDefault: function () { } };
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let clickEvent: any = document.createEvent("MouseEvents");
            eventsArgs = { pageX: 50, pageY: 300, ctrlKey: false, target: selectParent[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            const target: HTMLElement = rteObj.inputElement.querySelector('a.e-rte-anchor');
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems: NodeList = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
            expect(linkTBItems.length).toBe(3);
            expect((<HTMLElement>linkTBItems.item(0)).title).toBe('Open Link');
            expect((<HTMLElement>linkTBItems.item(1)).title).toBe('Edit Link');
            expect((<HTMLElement>linkTBItems.item(2)).title).toBe('Remove Link');
            (<any>rteObj).linkModule.quickToolObj.linkQTBar.element.querySelectorAll('.e-toolbar-item')[0].click();
            (<any>rteObj).linkModule.quickToolObj.linkQTBar.element.querySelectorAll('.e-toolbar-item')[1].click();
            let cancelBtn: HTMLElement = rteObj.element.querySelectorAll('.e-rte-link-dialog .e-footer-content button')[1] as HTMLElement;
            cancelBtn.click();
            (<any>rteObj).formatter.getUndoRedoStack().length = 0;
            (<any>rteObj).linkModule.quickToolObj.linkQTBar.element.querySelectorAll('.e-toolbar-item')[2].click();
            let evesnArgs: any = { target: document, preventDefault: function () { } };
            (<any>rteObj).linkModule.onDocumentClick(evesnArgs);
            let node: any = rteObj.contentModule.getEditPanel().childNodes[0].childNodes[1];
            new NodeSelection().setSelectionText(document, node, node, 1, 3);
            evnArg.range = new NodeSelection().getRange(document);
            evnArg.selection = new NodeSelection().save(evnArg.range, document);
            evnArg.selectParent = new NodeSelection().getParentNodeCollection(range);
            evnArg.selectNode = new NodeSelection().getNodeCollection(range);
            (<any>rteObj).linkModule.linkDialog(evnArg);
            eventsArgs = { which: 2, pageX: 50, pageY: 300, ctrlKey: false, target: selectParent[0], preventDefault: function () { } };
            (<any>rteObj).linkModule.editAreaClickHandler({ args: eventsArgs });
        });
    });

    describe('IE 11 insert link', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let defaultUA: string = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            rteObj = renderRTE({ value: '<p>test</p>' });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('IE 11 insert link iframe', () => {
            rteObj.iframeSettings.enable = true;
            rteObj.dataBind();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.headerEle.innerHTML === 'Insert Link').toBe(true);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'http://www.google.com';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            args = {
                item: { url: 'https://www.google.com/', selection: save, target: '_blank' },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.linkObj.createLink(args);
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let eventsArgs: any = { target: document, preventDefault: function () { } };
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let clickEvent: any = document.createEvent("MouseEvents");
            eventsArgs = { pageX: 50, pageY: 300, target: selectParent[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).formatter.editorManager.linkObj.openLink(args);
        });
    });

    describe('link dialog open - Short cut key', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('open link dialog - ctrl+l', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<any>rteObj).linkModule.onKeyDown({ args: keyboardEventArgs });
            expect(document.body.contains((<any>rteObj).linkModule.dialogObj.element)).toBe(true);
        });
        it('close link dialog - escape', () => {
            keyboardEventArgs.action = 'escape';
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<any>rteObj).linkModule.onKeyDown({ args: keyboardEventArgs });
            expect(isNullOrUndefined((<any>rteObj).linkModule.dialogObj)).toBe(true);
        });
    });

    describe('link dialog - documentClick', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('open link dialog - click on link item in toolbar', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            keyboardEventArgs.action = 'insert-link';
            (<any>rteObj).linkModule.onKeyDown({ args: keyboardEventArgs });
            expect(document.body.contains((<any>rteObj).linkModule.dialogObj.element)).toBe(true);

            let eventsArgs: any = { target: rteObj.element.querySelector('.e-create-link'), preventDefault: function () { } };
            (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).linkModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Link (Ctrl+K)"]'), preventDefault: function () { } };
            (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).linkModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Link (Ctrl+K)"]').parentElement, preventDefault: function () { } };
            (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).linkModule.dialogObj.element)).toBe(true);

        });
        it('close link dialog - while click on document', () => {
            let eventsArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
            expect((<any>rteObj).linkModule.dialogObj).toBe(null);
        });
    });

    describe('insert link with selected text', () => {
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
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>syncfusion</p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check link text', (done: DoneFn) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let selObj: any = new NodeSelection();
            selObj.setSelectionNode(rteObj.contentModule.getDocument(), rteObj.contentModule.getEditPanel().childNodes[0]);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'syncfusion').toBe(true);
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                expect(rteObj.contentModule.getEditPanel().querySelector('a').text === 'syncfusion').toBe(true);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 90;
                keyboardEventArgs.action = 'undo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                setTimeout(() => {
                    expect(rteObj.contentModule.getEditPanel().querySelector('a')).toBe(null);
                    done();
                }, 100);
            }, 500);
        });

        it('check display text', (done: DoneFn) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let selObj: any = new NodeSelection();
            selObj.setSelectionNode(rteObj.contentModule.getDocument(), rteObj.contentModule.getEditPanel().childNodes[0]);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'syncfusion').toBe(true);
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                expect(rteObj.contentModule.getEditPanel().querySelector('a').text === 'syncfusion').toBe(true);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value === 'https://www.syncfusion.com').toBe(true);
                    expect((rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'syncfusion').toBe(true);
                    expect((rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkTitle').value).toBe('https://www.syncfusion.com');
                    (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
                    setTimeout(() => {
                        expect((rteObj as any).element.getElementsByTagName('a')[0].firstChild.textContent).toBe("syncfusion");
                        done();
                    }, 100);
                }, 100);
            }, 500);
        });
        it('Apply link to the link element along with extra text', (done: DoneFn) => {
            rteObj.value = '<p>hello<a>syncfusion</a>test</p>';
            rteObj.dataBind();
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let selObj: any = new NodeSelection();
            selObj.setSelectionNode(rteObj.contentModule.getDocument(), rteObj.contentModule.getEditPanel().childNodes[0]);
            rteObj.selectAll();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                expect(rteObj.contentModule.getEditPanel().querySelector('p').children[0].tagName === 'A').toBe(true);
                done();
            }, 500);
        });

        it('872981 - Apply link to the content with multipel link element along with extra text', (done: DoneFn) => {
            rteObj.value = `<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit c<strong class="startNode">ontent and return the valid </strong><a href="https://ej2.syncfusion.com/home/" target="_blank"><strong>HTML markup</strong></a><strong> or </strong><a href="https://ej2.syncfusion.com/home/" target="_blank"><strong>markdown</strong></a><strong class="endNode"> of the c</strong>ontent</p>`;
            rteObj.dataBind();
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let startNode = rteObj.element.querySelector('.startNode');
            let endNode = rteObj.element.querySelector('.endNode');
            let selObj: any = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), startNode.childNodes[0], endNode.childNodes[0], 0, 9);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                const expectedElem: string = `<p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit c<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank" aria-label="Open in new window"><strong class="startNode">ontent and return the valid </strong><strong>HTML markup</strong><strong> or </strong><strong>markdown</strong><strong class="endNode"> of the c</strong></a>ontent</p>`;
                expect(rteObj.contentModule.getEditPanel().innerHTML === expectedElem).toBe(true);
                expect(window.getSelection().anchorNode.nodeName === '#text').toBe(true);
                expect(window.getSelection().focusNode.nodeName === '#text').toBe(true);
                expect(window.getSelection().anchorOffset === 0).toBe(true);
                expect(window.getSelection().focusOffset === 9).toBe(true);
                done();
            }, 500);
        });
    });

    describe('EJ2-59865 - css class dependency component - Link Module', () => {
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
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>syncfusion</p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                },
                cssClass: 'customClass'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' css class dependency initial load and dynamic change ', () => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let selObj: any = new NodeSelection();
            selObj.setSelectionNode(rteObj.contentModule.getDocument(), rteObj.contentModule.getEditPanel().childNodes[0]);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(document.querySelector('.e-rte-link-dialog').classList.contains('customClass')).toBe(true);
            expect(document.querySelector('.e-checkbox-wrapper').classList.contains('customClass')).toBe(true);
            rteObj.cssClass = 'changedClass';
            rteObj.dataBind();
            expect(document.querySelector('.e-rte-link-dialog').classList.contains('changedClass')).toBe(true);
            expect(document.querySelector('.e-checkbox-wrapper').classList.contains('changedClass')).toBe(true);
        });
    });

    describe('EJ2-57822 - insert link to the content before link content issue', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p class="focusNode">The Rich Text Editor (RTE) control is an easy to render in the client side. Customer <a class="e-rte-anchor" href="http://fdbdfbdb" title="http://fdbdfbdb" target="_blank">easy</a> to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</p>`,
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link to the content before link content issue', () => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let focusNode = rteObj.element.querySelector('.focusNode');
            let selObj: any = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), focusNode.childNodes[0], focusNode.childNodes[0], 76, 84);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelector('a').text === 'Customer ').toBe(true);
        });
    });

    describe('EJ2-59194 - More space between the text and Inserting a new link removes the space between the words issue', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p class="focusNode">The Rich Text Editor (RTE) control is an easy to render in the client side.&nbsp;&nbsp;&nbsp;&nbsp;<a class="e-rte-anchor" href="http://fdbdfbdb" title="http://fdbdfbdb" target="_blank">Customer</a>easy to edit the contents and get the HTML content for the displayed content. A rich text editor control provides users with a toolbar that helps them to apply rich text formats to the text entered in the text area.</p>`,
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('More space between the text and Inserting a new link removes the space between the words issue', () => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let focusNode = rteObj.element.querySelector('.focusNode');
            let selObj: any = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), focusNode.childNodes[0], focusNode.childNodes[0], 70, 75);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelector('a').text === 'side.').toBe(true);
        });
    });

    describe('931011 - RTE insert link validation fails when display text is empty', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '',
                toolbarSettings: {
                    items: ['CreateLink']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('RTE insert link validation fails when display text is empty', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range);
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            let dialogInput = (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl');
            dialogInput.value = 'www.example.com';
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = ' ';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });

            const anchor: HTMLAnchorElement = rteObj.contentModule.getEditPanel().querySelector('a');
            expect(anchor.href).toBe('https://www.example.com/');
            expect(anchor.textContent).toBe('www.example.com');
        });
    });

    describe('EJ2-51959- Link is not generated properly, when pasteCleanUpModule is imported', () => {
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
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>syncfusion 1</p><p><span>syncfusion 2</span></p><p><span>syncfusion 3</span></p><p><span>syncfusion 4</span></p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Applying link for multiple nodes selected', (done: DoneFn) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.contentModule.getEditPanel().childNodes[0].firstChild, (rteObj.contentModule.getEditPanel().childNodes[3] as any).lastElementChild.firstChild, 0, 12);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'syncfusion 1syncfusion 2syncfusion 3syncfusion 4').toBe(true);
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                expect((rteObj.contentModule.getEditPanel().childNodes[0] as any).querySelector('a').text === 'syncfusion 1').toBe(true);
                expect((rteObj.contentModule.getEditPanel().childNodes[1] as any).querySelector('a').text === 'syncfusion 2').toBe(true);
                expect((rteObj.contentModule.getEditPanel().childNodes[2] as any).querySelector('a').text === 'syncfusion 3').toBe(true);
                expect((rteObj.contentModule.getEditPanel().childNodes[3] as any).querySelector('a').text === 'syncfusion 4').toBe(true);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 90;
                keyboardEventArgs.action = 'undo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                setTimeout(() => {
                    expect(rteObj.contentModule.getEditPanel().querySelector('a')).toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('iOS device - insert link with selected text', () => {
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
        beforeAll(() => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                value: '<p>syncfusion</p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = currentBrowserUA;
            destroy(rteObj);
        });
        it('check link text', () => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let selObj: any = new NodeSelection();
            selObj.setSelectionNode(rteObj.contentModule.getDocument(), rteObj.contentModule.getEditPanel().childNodes[0]);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'syncfusion').toBe(true);
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelector('a').text === 'syncfusion').toBe(true);
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 90;
            keyboardEventArgs.action = 'undo';
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            expect(rteObj.contentModule.getEditPanel().querySelector('a')).toBe(null);
        });
    });

    describe(' toolbarSettings property - Items - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<span id="rte">RTE</span>'
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Test - Click the CreateLink item - set the disable the new window option', (done) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_CreateLink');
            item.click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-rte-linkurl') as HTMLInputElement).value = 'https://ej2.syncfusion.com';
            let check: HTMLInputElement = dialogEle.querySelector('.e-rte-linkTarget');
            check.click();
            setTimeout(() => {
                (document.querySelector('.e-insertLink.e-primary') as HTMLElement).click();
                let anchor: HTMLAnchorElement = rteObj.inputElement.querySelector('a');
                expect(anchor.hasAttribute('target')).toBe(false);
                done();
            }, 100);

        });
    })

    describe(' quickToolbarSettings property - link quick toolbar - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Test - open quickToolbar after applied selection command (italic)', (done) => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let link: HTMLElement = rteObj.element.querySelector("#link");
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
            item.click();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[2], link.childNodes[0].childNodes[2], 0, 3);
            link.dispatchEvent(MOUSEUP_EVENT)
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_EditLink");
                expect(!isNullOrUndefined(linkBtn)).toBe(true);
                done();
            }, 100);
        });

        it(' Test - link toolbar - Update the link', (done) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.dispatchEvent(MOUSEUP_EVENT)
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_EditLink");
                linkBtn.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_rtelink");
                let text: HTMLInputElement = dialog.querySelector('.e-rte-linkurl');
                text.value = "";
                let title: HTMLInputElement = dialog.querySelector('.e-rte-linkTitle');
                title.value = 'ej-controls';
                let update: HTMLButtonElement = dialog.querySelector('.e-insertLink');
                update.click();
                expect(text.classList.contains('e-error')).toBe(true);
                text.value = "https://js.syncfusion.com/";
                update = dialog.querySelector('.e-insertLink');
                update.click();
                let link: HTMLAnchorElement = rteObj.element.querySelector("#link");
                expect(link.href === "https://js.syncfusion.com/").toBe(true);
                expect(link.title === 'ej-controls').toBe(true);
                done();
            }, 100);
        });

        it(' Test - link toolbar - remove link', (done) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.dispatchEvent(MOUSEUP_EVENT)
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_RemoveLink");
                linkBtn.click();
                let link: HTMLAnchorElement = rteObj.element.querySelector("#link");
                expect(isNullOrUndefined(link)).toBe(true);
                done();
            }, 100);
        });
    });

    describe('BLAZ-23495 - BLAZ-23469 - Open and remove link not working when max length is set issue - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`,
                showCharCount: true,
                maxLength: 1000
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            rteObj.showCharCount = false;
            rteObj.maxLength = -1;
            destroy(rteObj);
            done();
        });

        it(' Open the link', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_OpenLink");
                linkBtn.click();
                done();
            }, 100);
        });

        it(' remove link', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_RemoveLink");
                linkBtn.click();
                let link: HTMLAnchorElement = rteObj.element.querySelector("#link");
                expect(isNullOrUndefined(link)).toBe(true);
                done();
            }, 100);
        });

        it('EJ2 - The editor does not sanitize encoded tab character in JavaScript alert', (done) => {
            let anchor = createElement('a') as HTMLAnchorElement;
            anchor.className = 'e-rte-anchor';
            anchor.href = "jav\u0009ascript:alert('XSS')";
            anchor.title = 'http://qwef';
            anchor.target = '_blank';
            anchor.setAttribute('aria-label', 'Open in new window');
            anchor.textContent = 'qwef';
            const sanitizedHTML = (rteObj as any).htmlEditorModule.sanitizeHelper(anchor.outerHTML);
            expect(sanitizedHTML === `<a class="e-rte-anchor" title="http://qwef" target="_blank" aria-label="Open in new window">qwef</a>`).toBe(true);
            done();
        });
    });

    describe(' quickToolbarSettings property - inlineMode - link quick toolbar - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`,
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
        it(' Test - inline QuickToolbar while select the anchor tag', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 0, 3);
            (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let item: HTMLElement = document.querySelector('#' + controlId + '_quick_Italic');
                expect(isNullOrUndefined(item)).toBe(true);
                done();
            }, 200);
        });

        it(' Test - link toolbar - Update the link', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_EditLink");
                linkBtn.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_rtelink");
                let text: HTMLInputElement = dialog.querySelector('.e-rte-linkurl');
                text.value = "";
                let title: HTMLInputElement = dialog.querySelector('.e-rte-linkTitle');
                title.value = 'ej-controls';
                let update: HTMLButtonElement = dialog.querySelector('.e-insertLink');
                update.click();
                expect(text.classList.contains('e-error')).toBe(true);
                text.value = "https://js.syncfusion.com/";
                update = dialog.querySelector('.e-insertLink');
                update.click();
                let link: HTMLAnchorElement = rteObj.element.querySelector("#link");
                expect(link.href === "https://js.syncfusion.com/").toBe(true);
                expect(link.title === 'ej-controls').toBe(true);
                done();
            }, 100);
        });

        it(' EJ2-19934:  edit the link with open link in new window as disabled', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_EditLink");
                linkBtn.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_rtelink");
                let checkbox: HTMLInputElement = dialog.querySelector('.e-checkbox-wrapper label');
                checkbox.click();
                setTimeout(() => {
                    let update: HTMLButtonElement = dialog.querySelector('.e-insertLink');
                    update.click();
                    let link: HTMLAnchorElement = rteObj.element.querySelector("#link");
                    expect(link.hasAttribute("target")).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it(' Test - link toolbar - remove link', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_RemoveLink");
                linkBtn.click();
                let link: HTMLAnchorElement = rteObj.element.querySelector("#link");
                expect(isNullOrUndefined(link)).toBe(true);
                done();
            }, 100);
        });
    });

    describe('dialog hide when link on the link when inline mode is set true', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<p><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`,
                inlineMode: {
                    enable: true
                }
            });
            controlId = rteObj.element.id;
        });
        afterEach(() => {
            destroy(rteObj);
        });

        it(' Test - link toolbar - and dialog hide', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_EditLink");
                linkBtn.click();
                let linkelem: HTMLElement = rteObj.element.querySelector("#link");
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
                dispatchEvent(linkelem, 'mousedown');
                linkelem.click();
                dispatchEvent(linkelem, 'mouseup');
                let dialog: HTMLElement = document.getElementById(controlId + "_rtelink");
                expect(dialog).toBe(null);
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
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 2 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" leftClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 3 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" leftClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 2 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 3 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" Android - false with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - true with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 3 };
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - true with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 1 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - false with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 3 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - false with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - true with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - true with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - false with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id="link-container"><a id="link" href="https://ej2.syncfusion.com/home/" target='_blank'><strong>HTML</strong></a></p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#link-container a');
            new NodeSelection().setSelectionText(document, target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 0, 0);
            let eventsArg: any = { pageX: 50, pageY: 300, ctrlKey: false, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    });

    describe('EJ2-27228 - Remove link not working', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink']
                },
                value: '<p>test</p>'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link, editlink, openlink', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).dispatchEvent(clickEvent);
            rteObj.selectAll();
            (rteEle.querySelector('.e-toolbar-item button') as HTMLElement).click();
            (rteEle.querySelector('.e-rte-link-dialog .e-rte-linkurl') as HTMLInputElement).value = 'https://www.test.com';
            (rteEle.querySelector('.e-rte-link-dialog .e-insertLink.e-primary') as HTMLButtonElement).click();
            expect(rteEle.querySelectorAll('.e-rte-content .e-content a').length).toBe(1);
            expect((rteEle.querySelector('.e-rte-content .e-content a') as HTMLAnchorElement).href).toBe('https://www.test.com/');
            setTimeout(() => {
                let quickPop: any = document.querySelector('.e-rte-quick-popup');
                expect(isNullOrUndefined(quickPop)).toBe(false);
                (quickPop.querySelectorAll('.e-toolbar-item button')[1] as HTMLElement).click();
                (rteEle.querySelector('.e-rte-link-dialog .e-rte-linkurl') as HTMLInputElement).value = 'https://www.testing.com';
                (rteEle.querySelector('.e-rte-link-dialog .e-insertLink.e-primary') as HTMLButtonElement).click();
                setTimeout(() => {
                    expect(rteEle.querySelectorAll('.e-rte-content .e-content a').length).toBe(1);
                    expect((rteEle.querySelector('.e-rte-content .e-content a') as HTMLAnchorElement).href).toBe('https://www.testing.com/');
                    quickPop = document.querySelector('.e-rte-quick-popup');
                    expect(isNullOrUndefined(quickPop)).toBe(false);
                    (quickPop.querySelectorAll('.e-toolbar-item button')[2] as HTMLElement).click();
                    quickPop = document.querySelector('.e-rte-quick-popup');
                    expect(isNullOrUndefined(quickPop)).toBe(true);
                    expect(rteEle.querySelectorAll('.e-rte-content .e-content a').length).toBe(0);
                    done();
                }, 500);
            }, 600);
        });
    });

    describe('Checking tags while applying link', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(function () {
            rteObj = renderRTE({
                value: '<p>sync<strong>fusion</strong></p><p><strong>Chennai</strong></p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('For Multiple block elements', function (done: DoneFn) {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let pEle: HTMLElement = rteObj.inputElement;
            rteObj.contentModule.getEditPanel().focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[1], 0, 1);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: HTMLElement = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                let firstChild: string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank" aria-label="Open in new window">sync<strong>fusion</strong></a>';
                expect((pEle.childNodes[0] as HTMLElement).innerHTML === firstChild).toBe(true);
                let secondChild: string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank" aria-label="Open in new window"><strong>Chennai</strong></a>';
                expect((pEle.childNodes[1] as HTMLElement).innerHTML === secondChild).toBe(true);
                done();
            }, 500);
        });
        it('For single element with bold and image', function (done: DoneFn) {
            rteObj.inputElement.innerHTML = '<p style="cursor: auto;">Sync<strong>fusion</strong><img class="e-rte-image e-imginline e-resize" width="109" height="42" alt="undefined"' +
                'src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"> RichTextEditor</p>';
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0], rteObj.inputElement.childNodes[0], 0, 3);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: string = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
                let firstChild: string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank" aria-label="Open in new window">Sync<strong>fusion</strong></a><img class="e-rte-image e-imginline" width="109" height="42" alt="undefined" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"> RichTextEditor';
                expect(rteObj.inputElement.childNodes[0].innerHTML === firstChild).toBe(true);
                done();
            }, 500);
        });
    });

    describe('Checking tags while applying link-Iframe', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(function () {
            rteObj = renderRTE({
                value: '<p>sync<strong>fusion</strong></p><p><strong>Chennai</strong></p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('For Multiple block elements-Iframe', function (done: DoneFn) {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let pEle: HTMLElement = rteObj.inputElement;
            rteObj.contentModule.getEditPanel().focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), rteObj.inputElement.childNodes[0], rteObj.inputElement.childNodes[1], 0, 1);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: HTMLElement = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                let firstChild: string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank" aria-label="Open in new window">sync<strong>fusion</strong></a>';
                expect((pEle.childNodes[0] as HTMLElement).innerHTML === firstChild).toBe(true);
                let secondChild: string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank" aria-label="Open in new window"><strong>Chennai</strong></a>';
                expect((pEle.childNodes[1] as HTMLElement).innerHTML === secondChild).toBe(true);
                done();
            }, 500);
        });
        it('For single element with bold and image-Iframe', function (done: DoneFn) {
            rteObj.value = '<p style="cursor: auto;">Sync<strong>fusion</strong><img class="e-rte-image e-imginline e-resize" width="109" height="42" alt="undefined"' +
                'src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"> RichTextEditor</p>';
            rteObj.dataBind();
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), rteObj.inputElement.childNodes[0], rteObj.inputElement.childNodes[0], 0, 3);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: string = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            setTimeout(() => {
                (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
                let firstChild: string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank" aria-label="Open in new window">Sync<strong>fusion</strong></a><img class="e-rte-image e-imginline e-resize" width="109" height="42" alt="undefined" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"> RichTextEditor';
                expect(rteObj.inputElement.childNodes[0].innerHTML === firstChild).toBe(true);
                done();
            }, 500);
        });
    });

    describe('EJ2-40770 - Insert link on the already pasted link throws console error', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p><a href="https://www.syncfusion.com">https://www.syncfusion.com</a><br></p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('apply same url through inert link dialog', (done: DoneFn) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let selectioncursor: NodeSelection = new NodeSelection();
            let range: Range = document.createRange();
            range.setStart(rteObj.element.querySelector('a'), 1);
            selectioncursor.setRange(document, range);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect((rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value).toBe("https://www.syncfusion.com");
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value).toBe("");
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkTitle').value).toBe("");
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            setTimeout(() => {
                (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
                expect(rteObj.contentModule.getEditPanel().querySelector('a').text === 'https://www.syncfusion.com').toBe(true);
                expect(rteObj.contentModule.getEditPanel().querySelector('a').href === 'https://www.syncfusion.com/').toBe(true);
                done();
            }, 500);
        });
    });

    describe('EJ2-44372 - BeforeDialogOpen eventArgs args.cancel is not working properly', () => {
        let rteObj: RichTextEditor;
        let count: number = 0;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink'],
                },
                beforeDialogOpen(e: any): void {
                    e.cancel = true;
                    count = count + 1;
                },
                dialogClose(e: any): void {
                    count = count + 1;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
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

    describe('EJ2-48903 - BeforeDialogOpen event is not called for second time', () => {
        let rteObj: RichTextEditor;
        let count: number = 0;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink']
                },
                beforeDialogOpen(e: any): void {
                    e.cancel = true;
                    count = count + 1;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('beforeDialogOpen event trigger testing', (done) => {
            expect(count).toBe(0);
            (rteObj.element.querySelectorAll('.e-toolbar-item')[0].querySelector('button') as HTMLElement).click();
            setTimeout(() => {
                expect(count).toBe(1);
                (rteObj.element.querySelectorAll('.e-toolbar-item')[0].querySelector('button') as HTMLElement).click();
                setTimeout(() => {
                    expect(count).toBe(2);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('EJ2-49981 - ShowDialog, CloseDialog method testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('beforeDialogOpen event trigger testing', (done) => {
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            rteObj.showDialog(DialogType.InsertLink);
            setTimeout(() => {
                expect(document.body.querySelectorAll('.e-rte-link-dialog.e-dialog').length).toBe(1);
                rteObj.closeDialog(DialogType.InsertLink);
                setTimeout(() => {
                    expect(document.body.querySelectorAll('.e-rte-link-dialog.e-dialog').length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('EJ2-59978 - Insert link after Max char count - Link Module', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(function () {
            rteObj = renderRTE({
                value: '<p class="focusNode">RTE Content with RTE</p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                },
                maxLength: 20,
                showCharCount: true
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it(' - Insert link after Max char count - ', function () {
            rteObj.contentModule.getEditPanel().focus();
            let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), focusNode, focusNode, 0, 0);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target: HTMLElement = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            expect(rteObj.inputElement.textContent === `RTE Content with RTE`).toBe(true);
        });
    });

    describe('EJ2-71006 - Insert link in list ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<li>Testing</li>',
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link in list', () => {
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteObj.inputElement.lastElementChild.lastChild as Element, 7);
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.headerEle.innerHTML === 'Insert Link').toBe(true);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'http://www.google.com';
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = 'Google';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            expect(rteObj.inputElement.textContent == "TestingGoogle");
        });
    });

    describe('849561- Unable to do any formatting action for the link content in the RTE', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p><a href="https://www.google.com">google</a></p>',
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'CreateLink']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Should not disable the toolbar items after the link is clicked', (done: DoneFn) => {
            const link: HTMLElement = rteObj.inputElement.querySelector('a');
            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            rteObj.inputElement.dispatchEvent(mouseDownEvent);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.firstChild, link.firstChild, 0, 5);
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
            rteObj.inputElement.dispatchEvent(mouseUpEvent);
            link.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-open-link').length).toBe(1);
                expect(rteObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(0);
                done();
            }, 200);
        });
    });

    describe('849062 - The link should open in a new tab when the link is clicked with the ctrl key in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        let mouseUpEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: true,
            shiftKey: false,
            char: '',
            key: '',
            target: '',
        };

        beforeEach(() => {
            rteObj = renderRTE({
                value: '<p><a href="https://www.google.com" target="_blank">google</a></p>',
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'CreateLink']
                }
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('check the link open in new tab', () => {
            let target = <HTMLElement>rteObj.element.querySelectorAll(".e-content")[0];
            let mousedownEvent: any = document.createEvent("MouseEvents");
            mousedownEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(mousedownEvent);
            let trg = document.querySelector('a');
            (<any>rteObj).formatter.editorManager.nodeSelection.setCursorPoint(document, trg.firstChild, trg.firstChild, 0, 0);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            trg.dispatchEvent(clickEvent);
            mouseUpEventArgs.target = clickEvent.target;
            mouseUpEventArgs.ctrlKey = true;
            (<any>rteObj).mouseUp(mouseUpEventArgs)
            expect(rteObj.element.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
        });
    });

    describe('846359 - Need to allow to insertion of empty hyperlink/images in the markdown', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink', 'Image']
                },
                editorMode: 'Markdown',
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it(' Checking the insertion of empty hyperlink/images in the markdown - ', function () {
            rteObj.contentModule.getEditPanel().focus();
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = '';
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value = '';
            let target: HTMLElement = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            expect(rteObj.inputElement.value === `[](https://)`).toBe(true);
        });
    });

    describe('867370 - OnDialogClose event argument "ClosedBy" is not showing correct values in RichTextEditor for InsertLink', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        let outsideClickClosedBy: boolean = false;
        let divElement: any;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink', 'Image']
                },
                beforeDialogClose: function (e) {
                    if (e.closedBy == "outside click") {
                        outsideClickClosedBy = true;
                    }
                }
            });
            rteEle = rteObj.element;
            divElement = document.createElement("div");
            divElement.id = "customElement";
            divElement.innerHTML = "Element";
            document.querySelector("body").appendChild(divElement);
        });
        afterAll(function () {
            destroy(rteObj);
            divElement.remove();
        });
        it('The link dialog closes when you click out of the dialog in the Rich Text Editor', function () {
            rteObj.contentModule.getEditPanel().focus();
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            var myButton = document.querySelector("#customElement");
            var event = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
                view: window
            });
            myButton.dispatchEvent(event);
            (myButton as any).click();
            expect(outsideClickClosedBy).toBe(true);
        });
    });

    describe('876805 - Bold format reverted if we edit the link which has bold style', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink', 'Image']
                },
                value: `<p><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank" aria-label="Open in new window"><strong>RichTextEditor</strong></a></p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('edit the dispaly text of link using quick toolbar ', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('a');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), target.childNodes[0].childNodes[0], target.childNodes[0].childNodes[0], 3, 3);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const editlink: HTMLElement = document.querySelector('[title="Edit Link"]');
                (editlink.childNodes[0] as HTMLElement).click();
                (document.querySelector('.e-rte-linkText') as HTMLInputElement).value = 'Editor';
                let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
                (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
                let result: string = document.querySelector('a').childNodes[0].nodeName;
                expect(result === 'STRONG').toBe(true);
                done();
            }, 200);
        });
    });

    describe('After clicking on outside, link dialog still open state', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        let controlId: string;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink', 'Image']
                },
                value: `<p><strong>RichTextEditor</strong></p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('link dialog not closing when create link toolbar item is clicked for second time and then editorarea is clicked', (done: Function) => {
            let item: any = rteObj.element.querySelector('#' + controlId + '_toolbar_CreateLink');
            item.click();
            let eventsArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
            item.click();
            (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
            let dialogObj = document.querySelector('.e-rte-link-dialog.e-control.e-dialog.e-lib.e-rte-elements.e-popup.e-popup-open');
            expect(dialogObj).toBe(null);
            done();
        });
    });

    describe('916973: Unable to open the quick toolbar after inserting link', function () {
        let rteEle: HTMLElement;
        let rteObj: any;
        let defaultUA: string = navigator.userAgent;
        let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
        beforeAll(function () {
            Browser.userAgent = safari;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink', 'Image']
                },
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p><a class="e-rte-anchor" href="http://www.google.com" title="http://www.google.com" target="_blank" aria-label="Open in new window">RichTextEditor</a>text</p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
        it('Quicktoolbar open after right click on link', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('a');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), target.childNodes[0], target.parentElement.childNodes[1], 0, 4);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            let eventsArg: any = { target: target, which: 3, ctrlKey: false };
            setCursorPoint(target.firstChild, 1);
            target.dispatchEvent(RIGHT_CLICK_EVENT);
            setTimeout(() => {
                let quickPop: HTMLElement = document.querySelector('.e-rte-quick-toolbar.e-rte-quick-toolbar.e-control.e-toolbar.e-lib.e-keyboard');
                expect(!isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 100);
        });
    });

    describe('916970: Facing issue while inserting link in the list item', function () {
        let rteObj: any;
        let rteEle: HTMLElement;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink', 'Image']
                },
                value: `<ul><li>Testing</li></ul>`
            });
            rteEle = rteObj.element;
        })
        afterAll(function () {
            destroy(rteObj);
        });
        it('Insert link in list item', (done: Function) => {
            const elem: HTMLElement = rteEle.querySelector('li');
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(rteObj.contentModule.getDocument(), elem.childNodes[0], 0);
            const createLinkButton: HTMLElement = rteEle.querySelector('#' + rteObj.element.id + '_toolbar_CreateLink');
            createLinkButton.click();
            const linkUrlInput: HTMLInputElement = document.querySelector('.e-rte-linkurl');
            linkUrlInput.value = 'www.google.com';
            const linkInsertButton: HTMLElement = document.querySelector('.e-rte-link-dialog .e-primary');
            linkInsertButton.click();
            const listElem: HTMLElement = rteEle.querySelector('li');
            expect(listElem.childNodes[0].nodeName === 'A').toBe(true);
            const backSpaceKey: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKey);
            expect(listElem.childNodes[0].nodeName !== 'A').toBe(true);
            done();
        })
    })

    describe('913697: After inserting the link by pressing the enter key, the quick toolbar did not open', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateLink']
                },
                value: '<p><br></p>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Checking the quick toolbar', (done: Function) => {
            rteObj.focusIn();
            let clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            rteObj.contentModule.getEditPanel().dispatchEvent(clickEvent);
            let link = document.querySelector('#' + rteObj.element.id + '_toolbar_CreateLink') as HTMLElement;
            link.click();
            let input = rteObj.element.querySelector('.e-rte-linkurl') as HTMLInputElement;
            input.value = 'https://www.syncfusion.com';
            const enterKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
            input.dispatchEvent(enterKeyDownEvent);
            const enterKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT);
            input.dispatchEvent(enterKeyUpEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-quick-popup')).not.toBe(null);
                done();
            }, 500);
        });
    });
    describe('940236 -  Removing validation when the values are entered', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>test</p>',
                enableAutoUrl: true
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('link dialog', () => {
            (rteObj as any).value = 'test';
            (rteObj as any).dataBind();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg: any = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = ' ';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').classList.contains('e-error')).toBe(true);
            let inputElement = (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl');
            inputElement.value = 'h';
            let inputChangeEvent = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            inputElement.dispatchEvent(inputChangeEvent);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').classList.contains('e-error')).toBe(false);
        });
    });
    describe('Ensure inserted links default to HTTPS', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '' });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link, editlink, openlink in HTML Tag', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let event: any = { preventDefault: function () { } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            (<any>rteObj).linkModule.linkDialog(evnArg);
            (<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'Examplelink';
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click(evnArg);
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').focus();
            args = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            event = { preventDefault: function () { } };
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            selectParent = new NodeSelection().getParentNodeCollection(range);
            selectNode = new NodeSelection().getNodeCollection(range);
            evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save, selectNode: selectNode,
                selectParent: selectParent
            };
            (<any>rteObj).linkModule.editLink(evnArg);
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value === 'https://Examplelink').toBe(true);
        });
    });
});
