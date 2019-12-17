/**
 * Content renderer spec
 */
import { isNullOrUndefined, detach, Browser } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar, Link } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { renderRTE, destroy, dispatchEvent, androidUA, iPhoneUA, currentBrowserUA } from "./../render.spec";
import { QuickToolbar, MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar);
RichTextEditor.Inject(Link);

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
describe('insert Link', () => {
    describe('div content mobile ui', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({});
            rteEle = rteObj.element;
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

        it('show link quick toolbar testing', () => {
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
            let eventArgs: any = { args: evnArg, isNotify: true, type: 'Links', elements: [document.querySelector('.e-toolbar-item'), document.body] };
            (<any>rteObj).linkModule.showLinkQuickToolbar(eventArgs);
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
            (<any>rteObj).linkModule.editAreaClickHandler({ args: evnArg });
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
        });

        it('show link quick toolbar with touch event arguments testing', () => {
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
            let eventArgs: any = { args: evnArg, isNotify: true, type: 'Links', elements: [document.querySelector('.e-toolbar-item'), document.body] };
            (<any>rteObj).linkModule.showLinkQuickToolbar(eventArgs);
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
            (<any>rteObj).linkModule.editAreaClickHandler({ args: evnArg });
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
        });

        it('iframe - show link quick toolbar testing', () => {
            rteObj.destroy();
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
            let args: any = { preventDefault: function () { }, originalEvent: { target: rteObj.toolbarModule.getToolbarElement() }, item: { command: 'Links', subCommand: 'CreateLink' } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let selectParent: any = new NodeSelection().getParentNodeCollection(range)
            let selectNode: any = new NodeSelection().getNodeCollection(range);
            let evnArg = {
                target: '', args: args, event: MouseEvent, selfLink: (<any>rteObj).linkModule, selection: save,
                selectParent: selectParent, selectNode: selectNode
            };
            dispatchEvent(rteObj.inputElement, 'mousedown');
            rteObj.inputElement.click();
            dispatchEvent(rteObj.inputElement, 'mouseup');
            let eventArgs: any = { args: evnArg, isNotify: true, type: 'Links', elements: [document.querySelector('.e-toolbar-item'), document.body] };
           (<any>rteObj).linkModule.showLinkQuickToolbar(eventArgs);
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
        });
    });
    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '<p>test</p>' });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('insert link, editlink, openlink', () => {
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
            evnArg.args.item = {command: 'Links', subCommand: 'OpenLink'};
            (<any>rteObj).linkModule.openLink(evnArg);
            evnArg.args.item = { command: 'Links', subCommand: 'CreateLink'};
            (<any>rteObj).contentModule.getEditPanel().querySelector('.e-rte-anchor').target = '';
            (<any>rteObj).linkModule.linkDialog(evnArg);
            evnArg.target = (<any>rteObj).linkModule.dialogObj.primaryButtonEle.nextElementSibling;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.nextElementSibling.click(evnArg);
            (<any>rteObj).linkModule.linkDialog(evnArg);
            let eventArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).linkModule.onIframeMouseDown();
        });
    });

    describe('Link actions with LinkPath API property set as Relative', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ 
                value: '<p>test</p>',
                enableAutoUrl: true
             });
            rteEle = rteObj.element;
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
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ value: '' });
            rteEle = rteObj.element;
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
            expect((<any>rteObj).contentModule.getEditPanel().innerText === `Provides <IFRAME> and <DIV> modes Value\n`).toBe(true);
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
            expect(rteObj.toolbarSettings.items[9]).toBe("CreateLink");
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
            evnArg.args.item = {command: 'Links', subCommand: 'OpenLink'};
            (<any>rteObj).linkModule.openLink(evnArg);
            evnArg.args.item = {command: 'Links', subCommand: 'CreateLink'};
            (<any>rteObj).linkModule.editLink(evnArg);
            expect(isNullOrUndefined((<any>rteObj).linkModule.dialogObj)).toBe(true);
            (rteObj.toolbarModule.getToolbarElement().querySelectorAll('.e-toolbar-item button')[7] as HTMLElement).click();
            expect((<any>rteObj).linkModule.dialogObj.headerEle.innerHTML === 'Insert Link').toBe(true);
            (rteObj.toolbarModule.getToolbarElement().querySelectorAll('.e-toolbar-item button')[7] as HTMLElement).click();
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
            (rteObj.toolbarModule.getToolbarElement().querySelectorAll('.e-toolbar-item button')[7] as HTMLElement).click();
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
            eventsArgs = { pageX: 50, pageY: 300, target: selectParent[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).linkModule.editAreaClickHandler({ args: eventsArgs });
            eventsArgs = { pageX: 50, pageY: 300, target: rteObj.element, preventDefault: function () { } };
            (<any>rteObj).linkModule.editAreaClickHandler({ args: eventsArgs });
            eventsArgs = { pageX: 50, pageY: 300, target: selectParent[0], preventDefault: function () { } };
            (<any>rteObj).linkModule.editAreaClickHandler({ args: eventsArgs });
            let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems: NodeList = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
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
            eventsArgs = { which: 2, pageX: 50, pageY: 300, target: selectParent[0], preventDefault: function () { } };
            (<any>rteObj).linkModule.editAreaClickHandler({ args: eventsArgs });
        });
    });

    describe('link dialog open - Short cut key', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
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
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
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

            eventsArgs = { target: document.querySelector('[title="Insert Hyperlink"]'), preventDefault: function () { } };
            (<any>rteObj).linkModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).linkModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Hyperlink"]').parentElement, preventDefault: function () { } };
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
        it('check link text', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
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
        it('check display text', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let selObj: any = new NodeSelection();
            selObj.setSelectionNode(rteObj.contentModule.getDocument(), rteObj.contentModule.getEditPanel().childNodes[0]);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'syncfusion').toBe(true);
            let target: any = (<any>rteObj).linkModule.dialogObj.primaryButtonEle;
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelector('a').text === 'syncfusion').toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect((rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value === 'https://www.syncfusion.com').toBe(true);
            expect((rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkText').value === 'syncfusion').toBe(true);
            expect((rteObj as any).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkTitle').value).toBe('https://www.syncfusion.com');
            (<any>rteObj).linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function () { } });
            expect(document.getElementsByTagName('a')[0].firstChild.textContent).toBe("syncfusion");          
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
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
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
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<span id="rte">RTE</span>'
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Test - Click the CreateLink item - set the disable the new window option', () => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_CreateLink');
            item.click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-rte-linkurl') as HTMLInputElement).value = 'https://ej2.syncfusion.com';
            let check: HTMLInputElement = dialogEle.querySelector('.e-rte-linkTarget');
            check.click();
            (document.querySelector('.e-insertLink.e-primary') as HTMLElement).click();
            pEle = rteObj.element.querySelector('#rte');
            let anchor: HTMLAnchorElement = pEle.querySelector('a');
            expect(anchor.hasAttribute('target')).toBe(false);
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
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 0, 3);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
            item.click();
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_EditLink");
                expect(!isNullOrUndefined(linkBtn)).toBe(true);
                done();
            }, 100);
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
                let update: HTMLButtonElement = dialog.querySelector('.e-insertLink');
                update.click();
                let link: HTMLAnchorElement = rteObj.element.querySelector("#link");
                expect(link.hasAttribute("target")).toBe(false);
                done();
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

        it(' Test - link toolbar - and dialog hide', (done) => {
            let link: HTMLElement = rteObj.element.querySelector("#link");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, link.childNodes[0].childNodes[0], link.childNodes[0].childNodes[0], 1, 2);
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(() => {
                let linkBtn: HTMLElement = document.getElementById(controlId + "_quick_EditLink");
                console.log(linkBtn.innerHTML);
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
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
        it('insert link, editlink, openlink', () => {
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
            let quickPop: any = document.querySelector('.e-rte-quick-popup');
            expect(isNullOrUndefined(quickPop)).toBe(false);
            (quickPop.querySelectorAll('.e-toolbar-item button')[1] as HTMLElement).click();
            (rteEle.querySelector('.e-rte-link-dialog .e-rte-linkurl') as HTMLInputElement).value = 'https://www.testing.com';
            (rteEle.querySelector('.e-rte-link-dialog .e-insertLink.e-primary') as HTMLButtonElement).click();
            expect(rteEle.querySelectorAll('.e-rte-content .e-content a').length).toBe(1);
            expect((rteEle.querySelector('.e-rte-content .e-content a') as HTMLAnchorElement).href).toBe('https://www.testing.com/');
            quickPop = document.querySelector('.e-rte-quick-popup');
            expect(isNullOrUndefined(quickPop)).toBe(false);
            (quickPop.querySelectorAll('.e-toolbar-item button')[2] as HTMLElement).click();
            quickPop = document.querySelector('.e-rte-quick-popup');
            expect(isNullOrUndefined(quickPop)).toBe(true);
            expect(rteEle.querySelectorAll('.e-rte-content .e-content a').length).toBe(0);
        });
    });
    describe('Checking tags while applying link', function() {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(function() {
            rteObj = renderRTE({
                value: '<p>sync<strong>fusion</strong></p><p><strong>Chennai</strong></p>',
                toolbarSettings: {
                    items: ['CreateLink', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(function() {
            destroy(rteObj);
        });
        it('For Multiple block elements', function() {
            let pEle : HTMLElement= rteObj.inputElement;
            rteObj.contentModule.getEditPanel().focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[1], 0, 1);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target : HTMLElement= rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function() {} });
            let firstChild : string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank">sync<strong>fusion</strong></a>';
            expect((pEle.childNodes[0] as HTMLElement).innerHTML === firstChild).toBe(true);
            let secondChild : string = '<strong><a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank">Chennai</a></strong>';
            expect((pEle.childNodes[1] as HTMLElement).innerHTML === secondChild).toBe(true);
        });
        it('For single element with bold and image', function() {
            rteObj.value = '<p style="cursor: auto;">Sync<strong>fusion</strong><img class="e-rte-image e-imginline e-resize" width="109" height="42" alt="undefined"' +
                'src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"> RichTextEditor</p>';
            rteObj.dataBind();
            rteObj.contentModule.getEditPanel().focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0], rteObj.inputElement.childNodes[0], 0, 3);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target : string = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function() {} });
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let firstChild : string= '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank">Sync<strong>fusion</strong>' +
                '<img class="e-rte-image e-imginline e-resize" width="109" height="42" alt="undefined" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"></a> RichTextEditor';
            expect(rteObj.inputElement.childNodes[0].innerHTML === firstChild).toBe(true);
        });
    });
    describe('Checking tags while applying link-Iframe', function() {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(function() {
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
        afterAll(function() {
            destroy(rteObj);
        });
        it('For Multiple block elements-Iframe', function() {
            let pEle : HTMLElement = rteObj.inputElement;
            rteObj.contentModule.getEditPanel().focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), rteObj.inputElement.childNodes[0], rteObj.inputElement.childNodes[1], 0, 1);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target : HTMLElement= rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function() {} });
            let firstChild : string = '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank">sync<strong>fusion</strong></a>';
            expect((pEle.childNodes[0] as HTMLElement).innerHTML === firstChild).toBe(true);
            let secondChild : string = '<strong><a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank">Chennai</a></strong>';
            expect((pEle.childNodes[1] as HTMLElement).innerHTML === secondChild).toBe(true);
        });
        it('For single element with bold and image-Iframe', function() {
            rteObj.value = '<p style="cursor: auto;">Sync<strong>fusion</strong><img class="e-rte-image e-imginline e-resize" width="109" height="42" alt="undefined"' +
                'src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"> RichTextEditor</p>';
            rteObj.dataBind();
            rteObj.contentModule.getEditPanel().focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), rteObj.inputElement.childNodes[0], rteObj.inputElement.childNodes[0], 0, 3);
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            rteObj.linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value = 'https://www.syncfusion.com';
            let target : string = rteObj.linkModule.dialogObj.primaryButtonEle;
            rteObj.linkModule.dialogObj.primaryButtonEle.click({ target: target, preventDefault: function() {} });
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let firstChild : string= '<a class="e-rte-anchor" href="https://www.syncfusion.com" title="https://www.syncfusion.com" target="_blank">Sync<strong>fusion</strong>' +
                '<img class="e-rte-image e-imginline e-resize" width="109" height="42" alt="undefined" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="min-width: 0px; min-height: 0px;"></a> RichTextEditor';
            expect(rteObj.inputElement.childNodes[0].innerHTML === firstChild).toBe(true);
        });
    });
    describe(' quickToolbarSettings property - link quick toolbar - ', function() {
        let rteObj: any;
        let controlId : any;
        beforeEach(function(done) {
            rteObj = renderRTE({
                value: "<p><a id=\"link\" href=\"https://ej2.syncfusion.com/home/\" target='_blank'><strong>HTML</strong></a></p><p><a href=\"https://ej2.syncfusion.com/home/\" target='_blank'>sync</a></p>"
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach(function(done) {
            destroy(rteObj);
            done();
        });
        it(' Test - open quickToolbar after applied selection command (italic)', function(done) {
            let link : HTMLElement = rteObj.element.querySelector("#link");
            let linkNodes : Node[] = rteObj.element.querySelectorAll('a');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, linkNodes[0].childNodes[0].childNodes[0], linkNodes[1].childNodes[0], 0, 3);
            let item : any= rteObj.element.querySelector('#' + controlId + '_toolbar_Italic');
            item.click();
            dispatchEvent(link, 'mousedown');
            link.click();
            dispatchEvent(link, 'mouseup');
            setTimeout(function() {
                let linkBtn : HTMLElement= document.getElementById(controlId + "_quick_RemoveLink");
                linkBtn.click();
                let link : Element= rteObj.element.querySelector("#link");
                expect(isNullOrUndefined(link)).toBe(true);
                done();
            }, 100);
        });
    });
});