import { EventHandler, detach, L10n, isNullOrUndefined, KeyboardEventArgs, select, extend, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { closest, addClass, removeClass, Browser } from '@syncfusion/ej2-base';
import { IRichTextEditor, NotifyArgs, IRenderer, IImageNotifyArgs, IToolbarItemModel, IShowPopupArgs, ICssClassArgs } from './../base/interface';
import { IDropDownItemModel } from './../base/interface';
import { ServiceLocator } from './../services/service-locator';
import * as events from '../base/constant';
import { CLS_RTE_ELEMENTS } from '../base/classes';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { NodeSelection } from '../../selection/selection';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from '../base/enum';
import { dispatchEvent, parseHtml } from '../base/util';
import { DialogRenderer } from './dialog-renderer';
import { isIDevice } from '../../common/util';

/**
 * `Link` module is used to handle undo actions.
 */
export class Link {
    private rteID: string;
    private i10n: L10n;
    private parent: IRichTextEditor;
    public contentModule: IRenderer;
    private dialogObj: Dialog;
    private checkBoxObj: CheckBox;
    public serviceLocator: ServiceLocator;
    private rendererFactory: RendererFactory;
    private quickToolObj: IRenderer;
    private dialogRenderObj: DialogRenderer;
    private isDestroyed: boolean;
    private mouseDown: EventListenerOrEventListenerObject;

    private constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
        this.addEventListener();
        this.serviceLocator = serviceLocator;
        this.rendererFactory = serviceLocator.getService<RendererFactory>('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService<DialogRenderer>('dialogRenderObject');
        this.isDestroyed = false;
        this.mouseDown = this.onDocumentClick.bind(this);
    }
    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.insertLink, this.linkDialog, this);
        this.parent.on(events.showLinkDialog, this.showDialog, this);
        this.parent.on(events.closeLinkDialog, this.closeDialog, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.insertCompleted, this.showLinkQuickToolbar, this);
        this.parent.on(events.clearDialogObj, this.clearDialogObj, this);
        this.parent.on(events.linkToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.unLink, this.removeLink, this);
        this.parent.on(events.editLink, this.editLink, this);
        this.parent.on(events.openLink, this.openLink, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.destroy, this.destroy, this);
    }
    private onToolbarAction(args: NotifyArgs): void {
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
        case 'OpenLink':
            this.parent.notify(events.openLink, args);
            break;
        case 'EditLink':
            this.parent.notify(events.editLink, args);
            break;
        case 'RemoveLink':
            this.parent.notify(events.unLink, args);
            break;
        }
    }
    protected removeEventListener(): void {
        this.parent.off(events.insertLink, this.linkDialog);
        this.parent.off(events.showLinkDialog, this.showDialog);
        this.parent.off(events.closeLinkDialog, this.closeDialog);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.insertCompleted, this.showLinkQuickToolbar);
        this.parent.off(events.clearDialogObj, this.clearDialogObj);
        this.parent.off(events.linkToolbarAction, this.onToolbarAction);
        this.parent.off(events.unLink, this.removeLink);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.editLink, this.editLink);
        this.parent.off(events.openLink, this.openLink);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.destroy, this.destroy);
    }
    private onIframeMouseDown(): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
        }
    }

    private updateCss(currentObj: CheckBox | Dialog, e: ICssClassArgs) : void {
        if (currentObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                currentObj.setProperties({ cssClass: (currentObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                currentObj.setProperties({ cssClass: (currentObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/tslint/config
    private setCssClass(e: ICssClassArgs) {
        this.updateCss(this.checkBoxObj, e);
        this.updateCss(this.dialogObj, e);
    }
    private showLinkQuickToolbar(e: IShowPopupArgs): void {
        if (!isNullOrUndefined(e.args) && (e.args as KeyboardEventArgs).action !== 'enter' &&
            (e.args as KeyboardEventArgs).action !== 'space') {
            let pageX: number;
            let pageY: number;
            if (e.type !== 'Links' || isNullOrUndefined(this.parent.quickToolbarModule) ||
                isNullOrUndefined(this.parent.quickToolbarModule.linkQTBar)) {
                return;
            }
            this.quickToolObj = this.parent.quickToolbarModule;
            const parentTop: number = this.parent.element.getBoundingClientRect().top;
            const parentLeft: number = this.parent.element.getBoundingClientRect().left;
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            let target: HTMLElement;
            [].forEach.call(e.elements, (element: Element, index: number) => {
                if (index === 0) {
                    target = ((element.nodeName === '#text') ? (element.parentNode) : element) as HTMLElement;
                }
            });
            if (e.isNotify) {
                const tbElement: HTMLElement = this.parent.toolbarModule.getToolbarElement() as HTMLElement;
                const linkTop: number = target.getBoundingClientRect().top;
                const linkLeft: number = target.getBoundingClientRect().left;
                const linkPos: number = linkTop - parentTop;
                const tbHeight: number = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
                pageX = (this.parent.iframeSettings.enable) ? parentLeft + linkLeft : target.getBoundingClientRect().left;
                pageY = window.pageYOffset + ((this.parent.iframeSettings.enable) ?
                    (parentTop + tbHeight + linkTop) : (parentTop + linkPos));
            } else {
                let args: Touch | MouseEvent;
                args = (e.args as TouchEvent).touches ? (e.args as TouchEvent).changedTouches[0] : args = e.args as MouseEvent;
                pageX = (this.parent.iframeSettings.enable) ? window.pageXOffset + parentLeft + args.clientX : args.pageX;
                pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset + parentTop + args.clientY : args.pageY;
            }
            if (this.quickToolObj.linkQTBar) {
                this.quickToolObj.linkQTBar.showPopup(pageX, pageY, range.endContainer as Element, 'link');
            }
        }
    }

    private hideLinkQuickToolbar(): void {
        if (this.quickToolObj && this.quickToolObj.linkQTBar && document.body.contains(this.quickToolObj.linkQTBar.element)) {
            this.quickToolObj.linkQTBar.hidePopup();
        }
    }

    private editAreaClickHandler(e: IImageNotifyArgs): void {
        if (this.parent.readonly) {
            this.hideLinkQuickToolbar();
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.linkQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            let target: HTMLElement = args.target as HTMLElement;
            target = this.getAnchorNode(target);
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            const isPopupOpen: boolean = this.quickToolObj.linkQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'A' && (target.childNodes.length > 0 && target.childNodes[0].nodeName !== 'IMG') &&
            ((e.args as MouseEvent).target as HTMLElement).nodeName !== 'IMG' &&
            !isNOU(closest(this.parent.getRange().startContainer.parentElement, 'A')) && !isNOU(closest(this.parent.getRange().endContainer.parentElement, 'A'))) {
                if (isPopupOpen) {
                    return;
                }
                if ((e.args as MouseEvent).ctrlKey === false) {
                    this.showLinkQuickToolbar({
                        args: args,
                        isNotify: false,
                        type: 'Links',
                        elements: [args.target as Element]
                    } as IShowPopupArgs);
                }
                else {
                    const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection;
                    const range: Range = selection.getRange(this.parent.contentModule.getDocument());
                    const args: object = {
                        args: {
                            item: {
                                subCommand: 'OpenLink',
                                command: 'Links',
                                name: ''
                            },
                            originalEvent: e.args
                        },
                        selectNode: selection.getNodeCollection(range),
                        selectParent: selection.getParentNodeCollection(range),
                        selection: selection.save(range, this.parent.contentModule.getDocument())
                    };
                    this.parent.notify(events.openLink, args);
                }
            } else {
                this.hideLinkQuickToolbar();
            }
        }
    }
    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        switch (originalEvent.action) {
        case 'escape':
            if (!isNullOrUndefined(this.dialogObj)) {
                this.dialogObj.close();
            }
            break;
        case 'insert-link':
            this.openDialog(true, event);
            originalEvent.preventDefault();
            break;
        }
    }
    private openDialog(isInternal?: boolean, event?: NotifyArgs): void {
        if (!isInternal) {
            (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
        }
        if (this.parent.editorMode === 'HTML') {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            const save: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(
                range, this.parent.contentModule.getDocument());
            const selectNodeEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            const selectParentEle: Node[] = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            const eventArgs: NotifyArgs = {
                args: event ? event.args : {
                    item: { command: 'Links', subCommand: 'CreateLink' } as IToolbarItemModel,
                    originalEvent: undefined,
                    name: !isInternal ? 'showDialog' : null
                },
                selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
            };
            this.linkDialog(eventArgs);
        } else {
            const textArea: HTMLTextAreaElement = this.parent.contentModule.getEditPanel() as HTMLTextAreaElement;
            this.parent.formatter.editorManager.markdownSelection.save(textArea.selectionStart, textArea.selectionEnd);
            this.linkDialog({
                args: {
                    item: { command: 'Links', subCommand: 'Link' } as IToolbarItemModel,
                    originalEvent: event && event.args as KeyboardEventArgs
                },
                member: 'link',
                text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                    this.parent.contentModule.getEditPanel() as HTMLTextAreaElement),
                module: 'Markdown',
                name: 'insertLink'
            });
        }
    }
    private showDialog(): void {
        this.openDialog(false);
        this.setCssClass({cssClass: this.parent.getCssClass()});
    }
    private closeDialog(): void {
        if (this.dialogObj) { this.dialogObj.hide({ returnValue: true } as Event); }
    }
    private clearDialogObj(): void {
        if (this.dialogObj) {
            this.dialogObj.destroy();
            detach(this.dialogObj.element);
            this.dialogObj = null;
        }
    }
    private linkDialog(e?: NotifyArgs, inputDetails?: { [key: string]: string }): void {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true } as Event);
            return;
        }
        if (this.parent.editorMode === 'HTML' && (e.selectParent.length > 0 &&
            !isNullOrUndefined((e.selectParent[0] as HTMLElement).classList) &&
            (e.selectParent[0] as HTMLElement).classList.contains('e-rte-anchor')) && isNullOrUndefined(inputDetails)) {
            this.editLink(e); return;
        }
        const linkWebAddress: string = this.i10n.getConstant('linkWebUrl');
        const linkDisplayText: string = this.i10n.getConstant('linkText');
        const linkTooltip: string = this.i10n.getConstant('linkTooltipLabel');
        const urlPlace: string = this.i10n.getConstant('linkurl');
        const textPlace: string = this.i10n.getConstant('textPlaceholder');
        const title: string = this.i10n.getConstant('linkTitle');
        const linkDialogEle: HTMLElement = this.parent.createElement('div', {
            className: 'e-rte-link-dialog' + this.parent.getCssClass(true), id: this.rteID + '_rtelink' });
        this.parent.rootContainer.appendChild(linkDialogEle);
        const linkContent: HTMLElement = this.parent.createElement('div', {
            className: 'e-rte-linkcontent' + this.parent.getCssClass(true), id: this.rteID + '_linkContent'
        });
        const htmlTextbox: string = (this.parent.editorMode === 'HTML') ? '<label>' + linkTooltip +
            '</label></div><div class="e-rte-field' + this.parent.getCssClass(true) + '">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder = "' + title + '"aria-label="' + this.i10n.getConstant('linkTitle') + '" class="e-input e-rte-linkTitle' + this.parent.getCssClass(true) + '"></div>' +
            '<div class="e-rte-label' + this.parent.getCssClass(true) + '"></div>' + '<div class="e-rte-field' + this.parent.getCssClass(true) + '">' +
            '<input type="checkbox" class="e-rte-linkTarget' + this.parent.getCssClass(true) + '"  data-role ="none"></div>' : '';
        const content: string = '<div class="e-rte-label' + this.parent.getCssClass(true) + '"><label>' + linkWebAddress + '</label></div>' + '<div class="e-rte-field' + this.parent.getCssClass(true) + '">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder="' + urlPlace + '"aria-label="' + this.i10n.getConstant('linkWebUrl') + '" class="e-input e-rte-linkurl' + this.parent.getCssClass(true) + '"/></div>' +
            '<div class="e-rte-label' + this.parent.getCssClass(true) + '">' + '<label>' + linkDisplayText + '</label></div><div class="e-rte-field' + this.parent.getCssClass(true) + '"> ' +
            '<input type="text" data-role ="none" spellcheck="false" class="e-input e-rte-linkText' + this.parent.getCssClass(true) + '"aria-label="' + this.i10n.getConstant('linkText') + '" placeholder="' + textPlace + '">' +
            '</div><div class="e-rte-label' + this.parent.getCssClass(true) + '">' + htmlTextbox;
        const contentElem: DocumentFragment = parseHtml(content);
        linkContent.appendChild(contentElem);
        const linkTarget: HTMLInputElement = linkContent.querySelector('.e-rte-linkTarget') as HTMLInputElement;
        const linkUrl: HTMLInputElement = linkContent.querySelector('.e-rte-linkurl') as HTMLInputElement;
        const linkText: HTMLInputElement = linkContent.querySelector('.e-rte-linkText') as HTMLInputElement;
        const linkTitle: HTMLInputElement = linkContent.querySelector('.e-rte-linkTitle') as HTMLInputElement;
        const linkOpenLabel: string = this.i10n.getConstant('linkOpenInNewWindow');
        this.checkBoxObj = new CheckBox({ label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl,
            cssClass: this.parent.getCssClass() });
        this.checkBoxObj.isStringTemplate = true;
        this.checkBoxObj.createElement = this.parent.createElement;
        this.checkBoxObj.appendTo(linkTarget);
        const selectText: string = (this.parent.editorMode === 'HTML') ?
            e.selection.getRange (this.parent.contentModule.getDocument()).toString() : e.text;
        const linkInsert: string = this.i10n.getConstant('dialogInsert');
        const linkCancel: string = this.i10n.getConstant('dialogCancel');
        const selection: NodeSelection = e.selection;
        const selectObj: NotifyArgs = { selfLink: this, selection: e.selection, selectParent: e.selectParent, args: e.args as MouseEvent };
        const dialogModel: DialogModel = {
            header: this.i10n.getConstant('linkHeader'),
            content: linkContent,
            cssClass: CLS_RTE_ELEMENTS + this.parent.getCssClass(true),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '310px',
            isModal: (Browser.isDevice as boolean),
            buttons: [{
                click: this.insertlink.bind(selectObj),
                buttonModel: { content: linkInsert, cssClass: 'e-flat e-insertLink' + this.parent.getCssClass(true), isPrimary: true }
            },
            { click: this.cancelDialog.bind(selectObj), buttonModel: { cssClass: 'e-flat' + this.parent.getCssClass(true), content: linkCancel } }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: (event: { [key: string]: object }) => {
                this.parent.isBlur = false;
                if (event && (event.event as { [key: string]: string }).returnValue) {
                    if (this.parent.editorMode === 'HTML') {
                        selection.restore();
                    } else {
                        this.parent.formatter.editorManager.markdownSelection.restore(
                            this.parent.contentModule.getEditPanel() as HTMLTextAreaElement);
                    }
                }
                this.dialogObj.destroy();
                detach(this.dialogObj.element);
                const args: Dialog = this.dialogObj;
                this.dialogRenderObj.close(args);
                this.dialogObj = null;
            }
        };
        // eslint-disable-next-line
        
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(linkDialogEle);
        linkDialogEle.style.maxHeight = 'inherit';
        if (isNullOrUndefined(this.dialogObj)) { return; }
        if (!isNullOrUndefined(inputDetails)) {
            linkUrl.value = inputDetails.url;
            linkText.value = inputDetails.text;
            linkTitle.value = inputDetails.title;
            // eslint-disable-next-line
            (inputDetails.target) ? this.checkBoxObj.checked = true : this.checkBoxObj.checked = false;
            this.dialogObj.header = inputDetails.header;
            this.dialogObj.element.querySelector('.e-insertLink').textContent = inputDetails.btnText;
        }
        this.checkUrl(false);
        if ((this.parent.editorMode === 'HTML' && isNullOrUndefined(inputDetails) && ((!isNullOrUndefined(selectText)
            && selectText !== '') && (e.selection.range.startOffset === 0) || e.selection.range.startOffset !==
            e.selection.range.endOffset)) || e.module === 'Markdown') {
            linkText.value = selectText;
        }
        (this.parent.element.ownerDocument as Document).addEventListener('mousedown', this.mouseDown);
        if (this.quickToolObj) {
            this.hideLinkQuickToolbar();
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
            if (this.quickToolObj.textQTBar && this.parent.element.ownerDocument.body.contains(this.quickToolObj.textQTBar.element)) {
                this.quickToolObj.textQTBar.hidePopup();
            }
        }
    }

    // eslint-disable-next-line
    private insertlink(e: MouseEvent | KeyboardEvent): void {
        const linkEle: HTMLElement = (this as NotifyArgs).selfLink.dialogObj.element as HTMLElement;
        let linkUrl: string = (linkEle.querySelector('.e-rte-linkurl') as HTMLInputElement).value;
        let linkText: string = (linkEle.querySelector('.e-rte-linkText') as HTMLInputElement).value;
        let linkTitle: string;
        if ((this as NotifyArgs).selfLink.parent.editorMode === 'HTML') {
            linkTitle = (linkEle.querySelector('.e-rte-linkTitle') as HTMLInputElement).value;
        }
        const target: string = ((this as NotifyArgs).selfLink.checkBoxObj.checked) ? '_blank' : null;
        const linkLabel : string | null = ((this as NotifyArgs).selfLink.checkBoxObj.checked) ? (this as NotifyArgs).selfLink.i10n.getConstant('linkAriaLabel') : null;
        if ((this as NotifyArgs).selfLink.parent.editorMode === 'Markdown' && linkUrl === '') {
            linkUrl = 'http://';
        }
        if (linkUrl === '') {
            (this as NotifyArgs).selfLink.checkUrl(true);
            return;
        }
        if (!(this as NotifyArgs).selfLink.isUrl(linkUrl)) {
            if ((this as NotifyArgs).selfLink.parent.editorMode === 'Markdown') {
                linkText = (linkText !== '') ? linkText : '';
            } else {
                linkText = (linkText === '') ? linkUrl : linkText;
            }
            if (!(this as NotifyArgs).selfLink.parent.enableAutoUrl) {
                linkUrl = linkUrl.indexOf('http') > -1 ? linkUrl : 'http://' + linkUrl;
            } else {
                // eslint-disable-next-line
                linkUrl = linkUrl;
            }
        } else {
            (this as NotifyArgs).selfLink.checkUrl(false);
        }
        const proxy: Link = (this as NotifyArgs).selfLink;
        if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(
            closest(
                (this as IImageNotifyArgs).selection.range.startContainer.parentNode, '[id='
                // eslint-disable-next-line
                + "'" + proxy.parent.contentModule.getPanel().id + "'" + ']'))) {
            (proxy.parent.contentModule.getEditPanel() as HTMLElement).focus();
            if (Browser.isIE && proxy.parent.iframeSettings.enable) {
                (this as NotifyArgs).selection.restore();
            }
            const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
            (this as NotifyArgs).selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                range, proxy.parent.contentModule.getDocument());
            (this as NotifyArgs).selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        const value: NotifyArgs = {
            url: linkUrl, text: linkText, title: linkTitle, target: target, ariaLabel: linkLabel,
            selection: (this as NotifyArgs).selection, selectParent: (this as NotifyArgs).selectParent
        };
        if (document.body.contains(proxy.dialogObj.element)) {
            (this as NotifyArgs).selfLink.dialogObj.hide({ returnValue: false } as Event);
        }
        if (isIDevice() && proxy.parent.iframeSettings.enable) {
            (<HTMLIFrameElement>select('iframe', proxy.parent.element)).contentWindow.focus();
        }
        if (proxy.parent.editorMode === 'HTML') {
            (this as NotifyArgs).selection.restore();
        }
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        let argsValue: KeyboardEvent | MouseEvent | ClickEventArgs | ClipboardEvent | TouchEvent | Object;
        if (!isNullOrUndefined((this as NotifyArgs).args as KeyboardEvent) &&
            ((this as NotifyArgs).args as KeyboardEvent).code === 'KeyK') {
            const originalEvent: KeyboardEventArgs = (this as NotifyArgs).args as KeyboardEventArgs;
            extend(
                (this as NotifyArgs).args,
                { item: { command: 'Links', subCommand: 'CreateLink' } as IToolbarItemModel, originalEvent: originalEvent },
                true);
            const argsVal: Object = {
                item: { command: 'Links', subCommand: 'CreateLink' } as IToolbarItemModel, originalEvent: originalEvent };
            argsValue = argsVal;
        } else {
            argsValue = (this as NotifyArgs).args;
        }
        (this as NotifyArgs).selfLink.parent.formatter.process(
            (this as NotifyArgs).selfLink.parent, argsValue,
            (!isNullOrUndefined((this as NotifyArgs).args as ClickEventArgs) &&
            ((this as NotifyArgs).args as ClickEventArgs).originalEvent), value);
        ((this as NotifyArgs).selfLink.parent.contentModule.getEditPanel() as HTMLElement).focus();
    }
    private isUrl(url: string): boolean {
        const regExp: RegExpConstructor = RegExp;
        const regexp: RegExp = new regExp('(ftp|http|https)://(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(/|/([\\w#!:.?+=&%@\\-\\/]))?', 'gi');
        return regexp.test(url);
    }
    private checkUrl(e: boolean): void {
        const linkEle: HTMLElement = this.dialogObj.element as HTMLElement;
        const linkUrl: HTMLElement = linkEle.querySelector('.e-rte-linkurl') as HTMLElement;
        if (e) {
            addClass([linkUrl], 'e-error');
            (linkUrl as HTMLInputElement).setSelectionRange(0, (linkUrl as HTMLInputElement).value.length);
            (linkUrl as HTMLInputElement).focus();
        } else {
            removeClass([linkUrl], 'e-error');
        }
    }
    private removeLink(e: NotifyArgs): void {
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        const selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent[0] as HTMLElement);
        this.parent.formatter.process(
            this.parent, e.args, e.args,
            {
                selectNode: e.selectNode, selectParent: e.selectParent, selection: e.selection,
                text: selectParentEle.innerText,
                subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
            });
        if (isIDevice() && this.parent.iframeSettings.enable) {
            (<HTMLIFrameElement>select('iframe', this.parent.element)).contentWindow.focus();
        } else {
            (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
        }
        this.hideLinkQuickToolbar();
    }
    private openLink(e: NotifyArgs): void {
        const selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent[0] as HTMLElement);
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            this.parent.formatter.process(
                this.parent, e.args, e.args,
                {
                    url: (selectParentEle as HTMLAnchorElement).href, text: selectParentEle.innerText,
                    target: (selectParentEle as HTMLAnchorElement).target === '' ? '_self' : '_blank', selectNode: e.selectNode,
                    subCommand: ((e.args as ClickEventArgs).item as IDropDownItemModel).subCommand
                });
        }
    }
    private getAnchorNode(element: HTMLElement): HTMLElement {
        const selectParent: HTMLElement = closest(element, 'a') as HTMLElement;
        return <HTMLElement>(selectParent ? selectParent : element);
    }
    private editLink(e: NotifyArgs): void {
        const selectedNode: HTMLElement = this.getAnchorNode(e.selectNode[0] as HTMLElement);
        let selectParentEle: HTMLElement = this.getAnchorNode(e.selectParent[0] as HTMLElement);
        selectParentEle = selectedNode.nodeName === 'A' ? selectedNode : selectParentEle;
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            const linkUpdate: string = this.i10n.getConstant('dialogUpdate');
            const inputDetails: { [key: string]: string } = {
                url: (selectParentEle as HTMLAnchorElement).getAttribute('href'), text: selectParentEle.innerText,
                title: selectParentEle.title, target: (selectParentEle as HTMLAnchorElement).target,
                header: this.i10n.getConstant('editLink'), btnText: linkUpdate
            };
            this.linkDialog(e, inputDetails);
        }
    }

    // eslint-disable-next-line
    private cancelDialog(e: MouseEvent): void {
        (this as NotifyArgs).selfLink.parent.isBlur = false;
        (this as NotifyArgs).selfLink.dialogObj.hide({ returnValue: true } as Event);
        if (isIDevice()) {
            (this as NotifyArgs).selection.restore();
        } else {
            const x: number = window.scrollX;
            const y: number = window.scrollY;
            ((this as NotifyArgs).selfLink.parent.contentModule.getEditPanel() as HTMLElement).focus();
            window.scrollTo(x, y);
        }
    }

    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        if (!isNullOrUndefined(this.dialogObj) && ((
            // eslint-disable-next-line
            !closest(target, '[id=' + "'" + this.dialogObj.element.id + "'" + ']') && this.parent.toolbarSettings.enable &&
            this.parent.getToolbarElement() && !this.parent.getToolbarElement().contains(e.target as Node)) ||
            (((this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target as Node)) ||
            this.parent.inlineMode.enable && !closest(target, '#' + this.dialogObj.element.id)) &&
             !closest(target, '#' + this.parent.getID() + '_toolbar_CreateLink') &&
                !target.querySelector('#' + this.parent.getID() + '_toolbar_CreateLink')))
        ) {
            this.parent.notify(events.documentClickClosedBy, { closedBy: 'outside click' });
            this.dialogObj.hide({ returnValue: true } as Event);
            (this.parent.element.ownerDocument as Document).removeEventListener('mousedown', this.mouseDown);
            this.mouseDown = null;
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
    }
    /**
     * Destroys the ToolBar.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        (this.parent.element.ownerDocument as Document).removeEventListener('mousedown', this.mouseDown);
        this.mouseDown = null;
        this.removeEventListener();
        this.isDestroyed = true;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     */
    private getModuleName(): string {
        return 'link';
    }
}
