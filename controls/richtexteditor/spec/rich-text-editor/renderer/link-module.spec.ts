/**
 * Content renderer spec
 */
import { isNullOrUndefined, detach, Browser } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar, Link } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { renderRTE, destroy, dispatchEvent } from "./../render.spec";
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

        it('iframe - show link quick toolbar testing', () => {
            rteObj.destroy();
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
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
            let eventArgs: any = { args: evnArg, isNotify: true, type: 'Links', elements: [document.querySelector('.e-toolbar-item'), document.body] };
            (<any>rteObj).linkModule.showLinkQuickToolbar(eventArgs);
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
            expect((<any>rteObj).linkModule.dialogObj.contentEle.querySelector('.e-rte-linkurl').value === 'http://data/').toBe(true);
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
            (<any>rteObj).linkModule.cancelDialog();
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
});