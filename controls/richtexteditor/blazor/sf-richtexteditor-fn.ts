import { select, closest, Browser, debounce, detach, extend, Observer, addClass, removeClass, formatUnit } from '@syncfusion/ej2-base';
import { EventHandler, TapEventArgs, createElement, BlazorDotnetObject, setStyleAttribute } from '@syncfusion/ej2-base';
import { Touch as EJ2Touch, print as printWindow, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import { BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import * as classes from './classes';
import * as events from './constant';
import { Count } from './actions/count';
import { Resize } from './actions/resize';
import { IFRAME_HEADER } from './constant';
import { Toolbar } from './actions/toolbar';
import { Link } from './renderer/link-module';
import { Table } from './renderer/table-module';
import { Image } from './renderer/image-module';
import { HtmlEditor } from './actions/html-editor';
import { FullScreen } from './actions/full-screen';
import { ViewSource } from './renderer/view-source';
import { QuickToolbar } from './actions/quick-toolbar';
import { PasteCleanup } from './actions/paste-clean-up';
import { MarkdownEditor } from './actions/markdown-editor';
import { MarkdownFormatter } from './formatter/markdown-formatter';
import { KeyboardEvents, KeyboardEventArgs } from './actions/keyboard';
import { ExecCommandCallBack } from './actions/execute-command-callback';
import { IHtmlKeyboardEvent } from '../src/editor-manager/base/interface';
import { ToolbarClickEventArgs, FocusBlurEventArgs, FormatModel } from './interfaces';
import { LinkFormModel, IFormatter, FormatterMode, ToolsItem, BlazorRteElement, EditTableModel } from './interfaces';
import { getEditValue, isIDevice, decode, dispatchEvent, hasClass, setAttributes, executeGroup } from './util';
import { IFrameSettingsModel, TableSettingsModel } from '../src';
import { ImageSettingsModel, PasteCleanupSettingsModel, QuickToolbarSettingsModel, ToolbarSettingsModel } from '../src';
import { FontFamilyModel, FontSizeModel, FontColorModel, BackgroundColorModel, InlineModeModel } from '../src';
import { IImageCommandsArgs, ITableCommandsArgs, ExecuteCommandOption } from '../src/rich-text-editor/base/interface';
import { PrintEventArgs, IExecutionGroup, NotifyArgs, CommandName, ILinkCommandsArgs } from '../src/rich-text-editor/base/interface';
import { IDropDownClickArgs, IToolsItems, ActionCompleteEventArgs, IDropDownItemModel } from '../src/rich-text-editor/base/interface';

/**
 * RichTextEditor base
 */
export class SfRichTextEditor {
    //#region Component properties
    public value: string;
    public enabled: boolean;
    public cssClass: string;
    public maxLength: number;
    public readonly: boolean;
    public enableRtl: boolean;
    public editorMode: string;
    public placeholder: string;
    public format: FormatModel;
    public saveInterval: number;
    public enableXhtml: boolean;
    public formatter: IFormatter;
    public enableTabKey: boolean;
    public enableResize: boolean;
    public adapter: FormatterMode;
    public showCharCount: boolean;
    public enableAutoUrl: boolean;
    public autoSaveOnIdle: boolean;
    public fontSize: FontSizeModel;
    private width: string | number;
    public height: string | number;
    public fontColor: FontColorModel;
    public enablePersistence: boolean;
    public undoRedoSteps: number = 30;
    public undoRedoTimer: number = 300;
    public inlineMode: InlineModeModel;
    public fontFamily: FontFamilyModel;
    public enableHtmlSanitizer: boolean;
    public alignments: IDropDownItemModel[];
    public floatingToolbarOffset: number = 0;
    public tableSettings: TableSettingsModel;
    public enableHtmlEncode: boolean = false;
    public iframeSettings: IFrameSettingsModel;
    public keyConfig: { [key: string]: string };
    public backgroundColor: BackgroundColorModel;
    public localeData: { [key: string]: string };
    public toolbarSettings: ToolbarSettingsModel;
    public insertImageSettings: ImageSettingsModel;
    private htmlAttributes: { [key: string]: string; };
    public quickToolbarSettings: QuickToolbarSettingsModel;
    public pasteCleanupSettings: PasteCleanupSettingsModel;
    //#endregion

    //#region Number variables
    private timeInterval: number;
    private idleInterval: number;
    //#endregion

    //#region String variables
    public id: string;
    private cloneValue: string;
    //#endregion

    //#region Boolean variables
    public isRTE: boolean;
    public isBlur: boolean;
    public isFocusOut: boolean;
    private isInitial: boolean = false;
    private isResizeInitialized: boolean;
    public undoRedoStatus: boolean = false;
    //#endregion

    //#region HtmlElement variables
    public contentPanel: Element;
    public inputElement: HTMLElement;
    public placeHolderContainer: HTMLElement;
    public valueContainer: HTMLTextAreaElement;
    private scrollParentElements: HTMLElement[];
    //#endregion

    //#region Complex variables
    public observer: Observer;
    private clickPoints: { [key: string]: number };
    private inlineCloseItems: string[] = ['CreateLink', 'Image', 'CreateTable', 'Maximize', 'Minimize'];
    //#endregion

    //#region Common variables
    public element: BlazorRteElement;
    public dotNetRef: BlazorDotnetObject;
    //#endregion

    //#region Event handler variables
    private onBlurHandler: EventListenerOrEventListenerObject;
    private onFocusHandler: EventListenerOrEventListenerObject;
    private onResizeHandler: EventListenerOrEventListenerObject;
    //#endregion

    //#region Modules variables
    public linkModule: Link;
    public countModule: Count;
    public tableModule: Table;
    public imageModule: Image;
    public resizeModule: Resize;
    public toolbarModule: Toolbar;
    private touchModule: EJ2Touch;
    public fullScreenModule: FullScreen;
    public htmlEditorModule: HtmlEditor;
    public viewSourceModule: ViewSource;
    private keyboardModule: KeyboardEvents;
    public quickToolbarModule: QuickToolbar;
    public pasteCleanupModule: PasteCleanup;
    public markdownEditorModule: MarkdownEditor;
    //#endregion

    constructor(element: BlazorRteElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject) {
        if (isNOU(element)) { return; }
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.observer = new Observer(this);
        this.dotNetRef.invokeMethodAsync('UpdateDeviceData', { isDevice: Browser.isDevice, isIDevice: isIDevice() });
        this.initModules();
    }
    //#region Internal methods
    public updateContext(rteObj: { [key: string]: Object }): void {
        extend(this, this, rteObj);
    }
    private initModules(): void {
        if (this.editorMode === 'HTML') {
            this.htmlEditorModule = new HtmlEditor(this);
            this.pasteCleanupModule = new PasteCleanup(this);
        } else {
            this.markdownEditorModule = new MarkdownEditor(this);
        }
        if (this.toolbarSettings.enable) {
            this.isUndoRedoStatus();
            this.toolbarModule = new Toolbar(this);
        }
        this.fullScreenModule = new FullScreen(this);
        this.viewSourceModule = new ViewSource(this);
        this.countModule = new Count(this);
        this.resizeModule = new Resize(this);
        this.linkModule = new Link(this);
        this.imageModule = new Image(this);
        this.tableModule = new Table(this);
        this.quickToolbarModule = new QuickToolbar(this);
    }
    public initialize(): void {
        this.isInitial = true;
        this.onBlurHandler = this.blurHandler.bind(this);
        this.onFocusHandler = this.focusHandler.bind(this);
        this.onResizeHandler = this.resizeHandler.bind(this);
        let execCommandCallBack: ExecCommandCallBack = new ExecCommandCallBack(this);
        this.id = this.element.id;
        this.clickPoints = { clientX: 0, clientY: 0 };
        this.updateContentElements();
        this.inputElement = this.getEditPanel() as HTMLElement;
        this.valueContainer = this.element.querySelector('textarea');
        if (this.readonly) { this.setReadOnly(true); }
        this.setHeight(this.height);
        this.setWidth(this.width);
        // setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        this.setContentHeight();
        if (this.iframeSettings && this.iframeSettings.enable) {
            this.setIframeSettings();
        }
        if (isNOU(this.value) || this.value === '') {
            this.value = this.valueContainer.innerHTML.replace(/<!--!-->/gi, '').trim();
        }
        this.setPanelValue(this.value);
        this.observer.notify(events.initialEnd, {});
        this.wireEvents();
        this.dotNetRef.invokeMethodAsync('CreatedEvent');
    }

    private isUndoRedoStatus(): void {
        for (let i: number = 0; i < this.toolbarSettings.items.length; i++) {
            if (!isNOU(this.toolbarSettings.items[i]) && ((this.toolbarSettings.items[i] as ToolsItem).subCommand === 'Undo'
                || (this.toolbarSettings.items[i] as ToolsItem).subCommand === 'Redo')) {
                this.undoRedoStatus = true;
                break;
            }
        }
    }

    public setPanelValue(value: string): void {
        value = this.serializeValue(value);
        if (this.editorMode === 'HTML' && this.enableXhtml) {
            this.inputElement.innerHTML = value;
            this.observer.notify(events.xhtmlValidation, {});
            value = this.inputElement.innerHTML;
        }
        if (this.editorMode === 'HTML') {
            this.value = getEditValue(isNOU(value) ? '' : value, this);
        }
        this.updatePanelValue();
        if (this.value !== this.cloneValue) {
            dispatchEvent(this.valueContainer, 'change');
            if (!this.isInitial) {
                this.dotNetRef.invokeMethodAsync('UpdateValue', this.value);
            } else {
                this.isInitial = false;
            }
            this.cloneValue = this.value;
        }
        this.setPlaceHolder();
    }
    private updateContentElements(): void {
        if ((this.editorMode === 'HTML' && (isNOU(this.iframeSettings) || !this.iframeSettings.enable)) || this.editorMode === 'Markdown') {
            this.contentPanel = this.element.querySelector('.e-rte-content');
        } else if (this.editorMode === 'HTML' && (this.iframeSettings && this.iframeSettings.enable)) {
            this.contentPanel = this.element.querySelector('iframe');
            this.updateIframeHtmlContents();
        }
    }
    private updateIframeHtmlContents(): void {
        let iFrameBodyContent: string = '<body spellcheck="false" autocorrect="off" contenteditable="true"></body></html>';
        let iFrameContent: string = IFRAME_HEADER + iFrameBodyContent;
        let iframe: HTMLIFrameElement = this.contentPanel as HTMLIFrameElement;
        iframe.innerHTML = iFrameContent;
        iframe.contentDocument.body.id = this.id + '_rte-edit-view';
        iframe.contentDocument.body.setAttribute('aria-owns', this.id);
        iframe.contentDocument.open();
        iFrameContent = this.setThemeColor(iFrameContent, { color: '#333' });
        iframe.contentDocument.write(iFrameContent);
        iframe.contentDocument.close();
        if (this.enableRtl) {
            iframe.contentDocument.body.setAttribute('class', 'e-rtl');
        }
    }
    private setThemeColor(content: string, styles: { [key: string]: string }): string {
        let fontColor: string = getComputedStyle(this.element, '.e-richtexteditor').getPropertyValue('color');
        return content.replace(styles.color, fontColor);
    }
    public refresh(e: NotifyArgs = { requestType: 'refresh' }): void {
        this.observer.notify(`${e.requestType}-begin`, e);
    }
    private setWidth(width: string | number): void {
        if (width !== 'auto') {
            setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        } else {
            this.element.style.width = 'auto';
        }
    }
    private setHeight(height: string | number): void {
        if (height !== 'auto') {
            this.element.style.height = formatUnit(height);
        } else {
            this.element.style.height = 'auto';
        }
        if (this.toolbarSettings.type === 'Expand' && (typeof (this.height) === 'string' &&
            this.height.indexOf('px') > -1 || typeof (this.height) === 'number')) {
            this.element.classList.add(classes.CLS_RTE_FIXED_TB_EXPAND);
        } else {
            this.element.classList.remove(classes.CLS_RTE_FIXED_TB_EXPAND);
        }
    }
    public openPasteDialog(): void {
        this.dotNetRef.invokeMethodAsync('PasteDialog');
    }
    public setContentHeight(target?: string, isExpand?: boolean): void {
        let heightValue: string = '';
        let topValue: number = 0;
        let rteHeightPercent: string = '';
        let heightPercent: boolean;
        // let cntEle: HTMLElement = (this.sourceCodeModule.getPanel() &&
        //     this.sourceCodeModule.getPanel().parentElement.style.display === 'block') ? this.sourceCodeModule.getPanel().parentElement :
        //     <HTMLElement>this.getPanel();
        let cntEle: HTMLElement = <HTMLElement>this.getPanel();
        let rteHeight: number = this.element.offsetHeight;
        if (this.element.offsetHeight === 0 && this.height !== 'auto' && !this.getToolbar()) {
            rteHeight = parseInt(this.height as string, 10);
            heightPercent = typeof (this.height) === 'string' && this.height.indexOf('%') > -1;
            if (heightPercent) {
                rteHeightPercent = this.height as string;
            }
        }
        let tbHeight: number = this.getToolbar() ? this.toolbarModule.getToolbarHeight() : 0;
        let rzHandle: HTMLElement = this.element.querySelector('.' + classes.CLS_RTE_RES_HANDLE) as HTMLElement;
        let rzHeight: number = this.enableResize ? (!isNOU(rzHandle) ? (rzHandle.offsetHeight + 8) : 0) : 0;
        let expandPopHeight: number = this.getToolbar() ? this.toolbarModule.getExpandTBarPopHeight() : 0;
        if (this.toolbarSettings.type === 'Expand' && isExpand && target !== 'preview') {
            heightValue = (this.height === 'auto' && rzHeight === 0) ? 'auto' : rteHeight - (tbHeight + expandPopHeight + rzHeight) + 'px';
            topValue = (!this.toolbarSettings.enableFloating) ? expandPopHeight : 0;
        } else {
            if (this.height === 'auto' && !(this.element.classList.contains('e-rte-full-screen')) && !this.isResizeInitialized) {
                heightValue = 'auto';
            } else {
                heightValue = heightPercent ? rteHeightPercent : rteHeight - (tbHeight + rzHeight) + 'px';
            }
        }
        setStyleAttribute(cntEle, { height: heightValue, marginTop: topValue + 'px' });
        if (this.iframeSettings.enable && target === 'sourceCode') {
            let codeElement: HTMLElement = <HTMLElement>select('.' + classes.CLS_RTE_CONTENT, this.element);
            setStyleAttribute(codeElement, { height: heightValue, marginTop: topValue + 'px' });
        }
        if (this.toolbarSettings.enableFloating && this.getToolbar() && !this.inlineMode.enable) {
            let isExpandOpened: boolean = !isNOU(this.element.querySelector('.e-rte-toolbar .e-hor-nav.e-nav-active'));
            let tbContainerHeight: string = (isExpandOpened ? (tbHeight + expandPopHeight) : tbHeight) + 'px';
            setStyleAttribute(this.getToolbar().parentElement, { height: tbContainerHeight });
        }
        if (rzHeight === 0) {
            this.autoResize();
        }
    }
    public getPanel(): Element {
        return this.contentPanel;
    }
    public saveSelection(): void {
        this.formatter.editorManager.nodeSelection.save(this.getRange(), this.getDocument());
    }
    public restoreSelection(): void {
        this.formatter.editorManager.nodeSelection.restore();
    }
    public getEditPanel(): Element {
        let editNode: Element;
        if (this.iframeSettings && this.iframeSettings.enable) {
            if (!isNOU((this.contentPanel as HTMLIFrameElement).contentDocument)) {
                editNode = (this.contentPanel as HTMLIFrameElement).contentDocument.body;
            } else {
                editNode = this.inputElement;
            }
        } else {
            editNode = this.element.querySelector('.e-rte-content .e-content');
        }
        return editNode;
    }
    public getText(): string {
        return (this.getEditPanel() as HTMLElement).innerText;
    }
    public getDocument(): Document {
        return this.getEditPanel().ownerDocument;
    }
    public getRange(): Range {
        return this.formatter.editorManager.nodeSelection.getRange(this.getDocument());
    }
    private updateValueContainer(val: string): void {
        this.valueContainer.value = val;
        dispatchEvent(this.valueContainer, 'change');
    }
    private getInputInnerHtml(): string {
        return this.inputElement.innerHTML.replace(/<!--!-->/gi, '');
    }
    public refreshUI(): void {
        this.refresh();
    }
    private getUpdatedValue(): string {
        let value: string;
        if (this.editorMode === 'HTML') {
            let inputContent: string = this.getInputInnerHtml();
            value = (inputContent === '<p><br></p>') ? null : this.enableHtmlEncode ?
                this.encode(decode(inputContent)) : inputContent;
        } else {
            value = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                (this.inputElement as HTMLTextAreaElement).value;
        }
        return value;
    }
    public countCalculate(): void {
        this.countModule.renderCount();
    }
    private updateEnable(): void {
        if (this.enabled) {
            removeClass([this.element], classes.CLS_DISABLED);
            this.element.setAttribute('aria-disabled', 'false');
            if (!isNOU(this.htmlAttributes.tabindex)) {
                this.inputElement.setAttribute('tabindex', this.htmlAttributes.tabindex);
            } else {
                this.inputElement.setAttribute('tabindex', '0');
            }
        } else {
            if (this.getToolbar()) {
                removeClass(this.getToolbar().querySelectorAll('.' + classes.CLS_ACTIVE), classes.CLS_ACTIVE);
                removeClass([this.getToolbar()], [classes.CLS_TB_FLOAT, classes.CLS_TB_ABS_FLOAT]);
            }
            addClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
            this.inputElement.setAttribute('tabindex', '-1');
        }
    }
    public setEnable(): void {
        this.updateEnable();
        (this.enabled) ? this.wireEvents() : this.unWireEvents();
    }
    public executeCommand(
        commandName: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
            IImageCommandsArgs | ITableCommandsArgs,
        option?: ExecuteCommandOption): void {
        value = this.htmlPurifier(commandName, value);
        if (this.editorMode === 'HTML') {
            let range: Range = this.getRange();
            if (this.iframeSettings.enable) {
                this.formatter.editorManager.nodeSelection.Clear(this.element.ownerDocument);
            }
            let toFocus: boolean = (this.iframeSettings.enable &&
                range.startContainer === this.inputElement) ? true : !this.inputElement.contains(range.startContainer);
            if (toFocus) {
                this.focusIn();
            }
        }
        let tool: IExecutionGroup = executeGroup[commandName];
        if (option && option.undo) {
            if (option.undo && this.formatter.getUndoRedoStack().length === 0) {
                this.formatter.saveData();
            }
        }
        this.formatter.editorManager.execCommand(
            tool.command,
            tool.subCommand ? tool.subCommand : (value ? value : tool.value),
            null,
            null,
            (value ? value : tool.value),
            (value ? value : tool.value)
        );
        if (option && option.undo) {
            this.formatter.saveData();
            this.formatter.enableUndo(this);
        }
        this.setPlaceHolder();
        this.observer.notify(events.contentChanged, {});
    }
    private htmlPurifier(
        command: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
            IImageCommandsArgs | ITableCommandsArgs): string {
        if (this.editorMode === 'HTML') {
            switch (command) {
                case 'insertTable':
                    if (isNOU((value as { [key: string]: object }).width)) {
                        (value as { [key: string]: object }).width = {
                            minWidth: this.tableSettings.minWidth,
                            maxWidth: this.tableSettings.maxWidth, width: this.tableSettings.width
                        };
                    }
                    (value as ITableCommandsArgs).selection = this.formatter.editorManager.nodeSelection.save(
                        this.getRange(), this.getDocument());
                    break;
                case 'insertImage':
                    let temp: HTMLElement = createElement('img', {
                        attrs: {
                            src: (value as IImageCommandsArgs).url as string
                        }
                    });
                    let imageValue: string = temp.outerHTML;
                    let url: string = (imageValue !== '' && (createElement('div', {
                        innerHTML: imageValue
                    }).firstElementChild).getAttribute('src')) || null;
                    url = !isNOU(url) ? url : '';
                    (value as IImageCommandsArgs).url = url;
                    if (isNOU((value as { [key: string]: object }).width)) {
                        (value as { [key: string]: object }).width = {
                            minWidth: this.insertImageSettings.minWidth,
                            maxWidth: this.insertImageSettings.maxWidth, width: this.insertImageSettings.width
                        };
                    }
                    if (isNOU((value as { [key: string]: object }).height)) {
                        (value as { [key: string]: object }).height = {
                            minHeight: this.insertImageSettings.minHeight,
                            maxHeight: this.insertImageSettings.maxHeight, height: this.insertImageSettings.height
                        };
                    }
                    (value as IImageCommandsArgs).selection = this.formatter.editorManager.nodeSelection.save(
                        this.getRange(), this.getDocument());
                    break;
                case 'createLink':
                    let tempNode: HTMLElement = createElement('a', {
                        attrs: {
                            href: (value as ILinkCommandsArgs).url as string
                        }
                    });
                    let linkValue: string = tempNode.outerHTML;
                    let href: string = (linkValue !== '' && (createElement('div', {
                        innerHTML: linkValue
                    }).firstElementChild).getAttribute('href')) || null;
                    href = !isNOU(href) ? href : '';
                    (value as ILinkCommandsArgs).url = href;
                    (value as ILinkCommandsArgs).selection = this.formatter.editorManager.nodeSelection.save(
                        this.getRange(), this.getDocument());
                    break;
            }
        }
        return value as string;
    }
    public serializeValue(value: string): string {
        if (this.editorMode === 'HTML' && !isNOU(value)) {
            if (this.enableHtmlEncode) {
                value = this.htmlEditorModule.sanitizeHelper(decode(value));
                value = this.encode(value);
            } else {
                value = this.htmlEditorModule.sanitizeHelper(value);
            }
        }
        return value;
    }
    public selectAll(): void {
        this.observer.notify(events.selectAll, {});
    }
    public selectRange(range: Range): void {
        this.observer.notify(events.selectRange, { range: range });
    }
    public showFullScreen(): void {
        this.fullScreenModule.showFullScreen();
    }
    public sanitizeHtml(value: string): string {
        return this.serializeValue(value);
    }
    public updateValue(value?: string): void {
        if (isNOU(value)) {
            let inputVal: string = this.inputElement.innerHTML;
            //this.setProperties({ value: isEditableValueEmpty(inputVal) ? null : inputVal });
        } else {
            //this.setProperties({ value: value });
        }
    }
    public clipboardAction(action: string, event: MouseEvent | KeyboardEvent): void {
        switch (action.toLowerCase()) {
            case 'cut':
                this.onCut();
                this.formatter.onSuccess(this, {
                    requestType: 'Cut',
                    editorMode: this.editorMode,
                    event: event
                });
                break;
            case 'copy':
                this.onCopy();
                this.formatter.onSuccess(this, {
                    requestType: 'Copy',
                    editorMode: this.editorMode,
                    event: event
                });
                break;
            case 'paste':
                this.onPaste(event as KeyboardEvent);
                break;
        }
    }
    public getContent(): Element {
        if (this.iframeSettings.enable) {
            return this.inputElement;
        } else {
            return this.getPanel();
        }
    }
    public getSelectedHtml(): string {
        let range: Range;
        let containerElm: HTMLElement = createElement('div');
        let selection: Selection = this.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            let selectedHtml: DocumentFragment = range.cloneContents();
            containerElm.appendChild(selectedHtml);
        }
        return containerElm.innerHTML;
    }
    public getSelection(): string {
        let str: string = '';
        this.observer.notify(events.getSelectedHtml, {
            callBack: (txt: string): void => {
                str = txt;
            }
        });
        return str;
    }
    public showInlineToolbar(): void {
        if (this.inlineMode.enable) {
            let currentRange: Range = this.getRange();
            let targetElm: HTMLElement = currentRange.endContainer.nodeName === '#text' ?
                currentRange.endContainer.parentElement : currentRange.endContainer as HTMLElement;
            let x: number = currentRange.getClientRects()[0].left;
            let y: number = currentRange.getClientRects()[0].top;
            this.quickToolbarModule.showInlineQTBar(x, y, (targetElm as HTMLElement));
        }
    }
    public hideInlineToolbar(): void {
        this.quickToolbarModule.hideInlineQTBar();
    }
    public updateValueData(): void {
        if (this.enableHtmlEncode) {
            this.setPanelValue(this.encode(decode(this.inputElement.innerHTML)));
        } else {
            let value: string = /<[a-z][\s\S]*>/i.test(this.inputElement.innerHTML) ? this.inputElement.innerHTML :
                decode(this.inputElement.innerHTML);
            this.setPanelValue(value);
        }
    }
    private removeSheets(srcList: Element[]): void {
        let i: number;
        for (i = 0; i < srcList.length; i++) {
            detach(srcList[i]);
        }
    }
    private updateReadOnly(): void {
        this.observer.notify(events.readOnlyMode, { editPanel: this.inputElement, mode: this.readonly });
    }
    public setReadOnly(initial?: boolean): void {
        this.updateReadOnly();
        if (!initial) {
            if (this.readonly && this.enabled) {
                this.unBindEvents();
            } else if (this.enabled) {
                this.bindEvents();
            }
        }
    }
    private setIframeSettings(): void {
        if (this.iframeSettings.resources) {
            let styleSrc: string[] = this.iframeSettings.resources.styles;
            let scriptSrc: string[] = this.iframeSettings.resources.scripts;
            if (this.iframeSettings.resources.scripts.length > 0) {
                this.InjectSheet(true, scriptSrc);
            }
            if (this.iframeSettings.resources.styles.length > 0) {
                this.InjectSheet(false, styleSrc);
            }
        }
        if (this.iframeSettings.attributes) {
            setAttributes(this.iframeSettings.attributes, this, true, false);
        }
    }
    private InjectSheet(scriptSheet: boolean, srcList: string[]): void {
        try {
            if (srcList && srcList.length > 0) {
                let iFrame: HTMLDocument = this.getDocument();
                let target: HTMLElement = iFrame.querySelector('head');
                for (let i: number = 0; i < srcList.length; i++) {
                    if (scriptSheet) {
                        let scriptEle: HTMLScriptElement = this.createScriptElement();
                        scriptEle.src = srcList[i];
                        target.appendChild(scriptEle);
                    } else {
                        let styleEle: HTMLLinkElement = this.createStyleElement();
                        styleEle.href = srcList[i];
                        target.appendChild(styleEle);
                    }
                }
            }

        } catch (e) {
            return;
        }
    }
    private createScriptElement(): HTMLScriptElement {
        let scriptEle: HTMLScriptElement = createElement('script', {
            className: classes.CLS_SCRIPT_SHEET
        }) as HTMLScriptElement;
        scriptEle.type = 'text/javascript';
        return scriptEle;
    }

    private createStyleElement(): HTMLLinkElement {
        let styleEle: HTMLLinkElement = createElement('link', {
            className: classes.CLS_STYLE_SHEET
        }) as HTMLLinkElement;
        styleEle.rel = 'stylesheet';
        return styleEle;
    }

    private setValue(): void {
        let innerHtml: string = !isNOU(this.element.innerHTML) && this.element.innerHTML.replace(/<(\/?|\!?)(!--!--)>/g, '').trim();
        if (innerHtml !== '') {
            if (this.element.tagName === 'TEXTAREA') {
                // this.setProperties({ value: decode(innerHtml) });
            } else {
                //  this.setProperties({ value: innerHtml });
            }
        }
    }

    private updateResizeFlag(): void {
        this.isResizeInitialized = true;
    }
    public getHtml(): string {
        return this.value;
    }
    public showSourceCode(): void {
        if (this.readonly) { return; }
        this.observer.notify(events.sourceCode, {});
    }
    public getCharCount(): number {
        let htmlText: string = this.editorMode === 'Markdown' ? (this.getEditPanel() as HTMLTextAreaElement).value.trim() :
            (this.getEditPanel() as HTMLElement).textContent.trim();
        return htmlText.length;
    }
    public focusOut(): void {
        if (this.enabled) {
            this.inputElement.blur();
            this.blurHandler({} as FocusEvent);
        }
    }
    // public getBaseToolbarObject(): BaseToolbar {
    //     let tbObj: BaseToolbar;
    //     if (this.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
    //         tbObj = this.quickToolbarModule && this.quickToolbarModule.getInlineBaseToolbar();
    //     } else {
    //         tbObj = this.toolbarModule && this.toolbarModule.getBaseToolbar();
    //     }
    //     return tbObj;
    // }
    public getToolbar(): HTMLElement {
        return this.toolbarSettings.enable ? this.element.querySelector('#' + this.id + '_toolbar') : null;
    }
    public getToolbarElement(): Element {
        return this.toolbarSettings.enable ? this.element.querySelector('#' + this.id + '_toolbar') : null;
    }
    private updateIntervalValue(): void {
        clearTimeout(this.idleInterval);
        this.idleInterval = setTimeout(this.updateValueOnIdle.bind(this), 0);
    }
    private updateValueOnIdle(): void {
        this.value = this.getUpdatedValue();
        this.updateValueContainer(this.value);
        this.invokeChangeEvent();
    }
    public invokeChangeEvent(): void {
        if (this.value !== this.cloneValue) {
            if (this.enablePersistence) {
                window.localStorage.setItem(this.id, this.value);
            }
            this.dotNetRef.invokeMethodAsync('ChangeEvent');
            this.cloneValue = this.value;
        }
    }
    private preventImgResize(e: FocusEvent | MouseEvent): void {
        if ((e.target as HTMLElement).nodeName.toLocaleLowerCase() === 'img') {
            e.preventDefault();
        }
    }
    public defaultResize(e: FocusEvent | MouseEvent, isDefault: boolean): void {
        if (Browser.info.name === 'msie') {
            if (isDefault) {
                this.getEditPanel().removeEventListener('mscontrolselect', this.preventImgResize);
            } else {
                this.getEditPanel().addEventListener('mscontrolselect', this.preventImgResize);
            }
        } else if (Browser.info.name === 'mozilla') {
            let value: string = isDefault ? 'true' : 'false';
            this.getDocument().execCommand('enableObjectResizing', isDefault, value);
            this.getDocument().execCommand('enableInlineTableEditing', isDefault, value);
        }
    }
    public encode(value: string): string {
        let divNode: HTMLElement = document.createElement('div');
        divNode.innerText = value.trim();
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }
    public print(): void {
        let printWind: Window;
        let printArgs: PrintEventArgs = {
            requestType: 'print',
            cancel: false
        };
        // @ts-ignore-start
        this.dotNetRef.invokeMethodAsync('ActionBeginEvent', printArgs).then((printingArgs: PrintEventArgs) => {
            // @ts-ignore-end
            printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
            if (Browser.info.name === 'msie') { printWind.resizeTo(screen.availWidth, screen.availHeight); }
            printWind = printWindow(this.inputElement, printWind);
            if (!printingArgs.cancel) {
                let actionArgs: ActionCompleteEventArgs = {
                    requestType: 'print'
                };
                this.dotNetRef.invokeMethodAsync('ActionCompleteEvent', actionArgs);
            }
        });
    }
    public autoResize(): void {
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                setTimeout(() => { this.setAutoHeight(this.inputElement); }, 0);
            } else if (this.iframeSettings.enable) {
                let iframeElement: HTMLIFrameElement = this.element.querySelector('#' + this.element.id + '_rte-view');
                setTimeout(() => { this.setAutoHeight(iframeElement); }, 100);
                this.inputElement.style.overflow = 'hidden';
            }
        } else {
            this.inputElement.style.overflow = null;
        }
    }
    private setAutoHeight(element: HTMLElement): void {
        if (!isNOU(element)) {
            element.style.height = '';
            element.style.height = this.inputElement.scrollHeight + 'px';
            element.style.overflow = 'hidden';
        }
    }
    public restrict(e: MouseEvent | KeyboardEvent): void {
        if (this.maxLength >= 0) {
            let element: string = this.editorMode === 'Markdown' ? this.getText() :
                ((e as MouseEvent).currentTarget as HTMLElement).textContent.trim();
            let array: number[] = [8, 16, 17, 37, 38, 39, 40, 46, 65];
            let arrayKey: number;
            for (let i: number = 0; i <= array.length - 1; i++) {
                if ((e as MouseEvent).which === array[i]) {
                    if ((e as MouseEvent).ctrlKey && (e as MouseEvent).which === 65) {
                        return;
                    } else if ((e as MouseEvent).which !== 65) {
                        arrayKey = array[i];
                        return;
                    }
                }
            }
            if ((element.length >= this.maxLength && this.maxLength !== -1) && (e as MouseEvent).which !== arrayKey) {
                (e as MouseEvent).preventDefault();
            }
        }
    }
    public setPlaceHolder(): void {
        if (this.inputElement && this.placeholder && this.iframeSettings.enable !== true) {
            if (this.editorMode !== 'Markdown') {
                if (!this.placeHolderContainer) {
                    this.placeHolderContainer = this.element.querySelector('.e-rte-placeholder');
                }
                this.placeHolderContainer.innerHTML = this.placeholder;
                if (this.inputElement.textContent.length === 0 &&
                    !isNOU(this.inputElement.firstChild) && this.inputElement.firstChild.nodeName === 'P' &&
                    !isNOU(this.inputElement.firstChild.firstChild) && this.inputElement.firstChild.firstChild.nodeName === 'BR') {
                    this.placeHolderContainer.style.display = 'block';
                } else {
                    this.placeHolderContainer.style.display = 'none';
                }
            } else {
                this.inputElement.setAttribute('placeholder', this.placeholder);
            }
        }
    }
    public updatePanelValue(): void {
        let value: string = this.value;
        value = (this.enableHtmlEncode && this.value) ? decode(value) : value;
        let getTextArea: HTMLInputElement = this.element.querySelector('.e-rte-srctextarea');
        if (value) {
            if (getTextArea && getTextArea.style.display === 'block') {
                getTextArea.value = this.value;
            }
            if (this.valueContainer) {
                this.valueContainer.value = (this.enableHtmlEncode) ? this.value : value;
            }
            if (this.editorMode === 'HTML' && this.inputElement && this.inputElement.innerHTML.trim() !== value.trim()) {
                this.inputElement.innerHTML = value;
            } else if (this.editorMode === 'Markdown' && this.inputElement
                && (this.inputElement as HTMLTextAreaElement).value.trim() !== value.trim()) {
                (this.inputElement as HTMLTextAreaElement).value = value;
            }
        } else {
            if (getTextArea && getTextArea.style.display === 'block') {
                getTextArea.value = '';
            }
            if (this.editorMode === 'HTML') {
                this.inputElement.innerHTML = '<p><br/></p>';
            } else {
                (this.inputElement as HTMLTextAreaElement).value = '';
            }
            if (this.valueContainer) {
                this.valueContainer.value = '';
            }
        }
        if (this.showCharCount) {
            this.countModule.refresh();
        }
    }
    public contentChanged(): void {
        if (this.autoSaveOnIdle) {
            if (!isNOU(this.saveInterval)) {
                clearTimeout(this.timeInterval);
                this.timeInterval = setTimeout(this.updateIntervalValue.bind(this), this.saveInterval);
            }
        }
    }
    private notifyMouseUp(e: MouseEvent | TouchEvent): void {
        let touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        this.observer.notify(events.mouseUp, {
            member: 'mouseUp', args: e,
            touchData: {
                prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY
            }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && this.inputElement.textContent.length !== 0) ||
            (this.editorMode === 'Markdown' && (this.inputElement as HTMLTextAreaElement).value.length !== 0))) {
            this.observer.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
    }
    private triggerEditArea(e: MouseEvent | TouchEvent): void {
        if (!isIDevice()) {
            this.observer.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
        } else {
            let touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
            if (this.clickPoints.clientX === touch.clientX && this.clickPoints.clientY === touch.clientY) {
                this.observer.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
            }
        }
    }
    //#endregion
    //#region Interop interaction methods
    public toolbarItemClick(args: ToolbarClickEventArgs, id: string, targetType: string): void {
        if (isNOU(args)) { return; }
        let target: Element;
        if (targetType === 'Root' && !this.inlineMode.enable) {
            target = select('#' + id, this.element);
        } else {
            target = select('#' + id, document.body);
        }
        args.originalEvent = { ...args.originalEvent, target: target };
        if (this.inlineCloseItems.indexOf(args.item.subCommand) > -1) {
            this.quickToolbarModule.hideInlineQTBar();
        }
        if (this.editorMode === 'HTML') {
            this.observer.notify(events.htmlToolbarClick, args);
        } else {
            this.observer.notify(events.markdownToolbarClick, args);
        }
    }
    public toolbarClick(id: string): void {
        let trg: Element = select('#' + id + ' .e-hor-nav', this.element);
        if (trg && this.toolbarSettings.type === 'Expand' && !isNOU(trg)) {
            if (!trg.classList.contains('e-nav-active')) {
                removeClass([this.getToolbar()], [classes.CLS_EXPAND_OPEN]);
                this.setContentHeight('toolbar', false);
            } else {
                addClass([this.getToolbar()], [classes.CLS_EXPAND_OPEN]);
                this.setContentHeight('toolbar', true);
            }
        } else if (Browser.isDevice || this.inlineMode.enable) {
            //this.isToolbar = true;
        }
        if (isNOU(trg) && this.toolbarSettings.type === 'Expand') {
            removeClass([this.getToolbar()], [classes.CLS_EXPAND_OPEN]);
        }
    }
    public dropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        this.observer.notify(events.selectionSave, args);
        this.observer.notify(events.beforeDropDownOpen, args);
    }
    public dropDownClose(args: MenuEventArgs): void {
        this.observer.notify(events.selectionRestore, args);
    }
    public dropDownSelect(e: IDropDownClickArgs): void {
        e.name = 'dropDownSelect';
        if (!(document.body.contains(document.body.querySelector('.e-rte-quick-toolbar'))
            && e.item && (e.item.command === 'Images' || e.item.command === 'Display' || e.item.command as string === 'Table'))) {
            this.observer.notify(events.selectionRestore, {});
            let value: string = null;
            // let value: string = e.item.controlParent && this.quickToolbarModule && this.quickToolbarModule.tableQTBar
            //     && this.quickToolbarModule.tableQTBar.element.contains(e.item.controlParent.element) ? 'Table' : null;
            this.formatter.process(this, e, e.originalEvent, value);
            this.observer.notify(events.selectionSave, {});
        }
        this.observer.notify(events.dropDownSelect, e);
    }
    public colorDropDownBeforeOpen(): void {
        this.observer.notify(events.selectionSave, {});
    }
    public colorIconSelected(args: IToolsItems, value: string): void {
        this.observer.notify(events.selectionSave, {});
        this.observer.notify(events.selectionRestore, {});
        args.value = isNOU(value) ? args.value : value;
        let range: Range = this.formatter.editorManager.nodeSelection.getRange(this.getDocument());
        let parentNode: Node = range.startContainer.parentNode;
        if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
            (closest(range.startContainer.parentNode, 'td,th')) || (this.iframeSettings.enable &&
                !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib'))) && range.collapsed &&
            args.subCommand === 'BackgroundColor') {
            this.observer.notify(events.tableColorPickerChanged, { item: args, name: 'colorPickerChanged' });
        } else {
            this.observer.notify(events.selectionRestore, {});
            this.formatter.process(this, { item: args, name: 'colorPickerChanged' }, undefined, null);
            this.observer.notify(events.selectionSave, {});
        }
    }
    public colorChanged(args: IToolsItems, value: string): void {
        this.observer.notify(events.selectionRestore, {});
        args.value = isNOU(value) ? args.value : value;
        let range: Range = this.formatter.editorManager.nodeSelection.getRange(this.getDocument());
        if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
            closest(range.startContainer.parentNode, 'td,th')) && range.collapsed && args.subCommand === 'BackgroundColor') {
            this.observer.notify(events.tableColorPickerChanged, { item: args, name: 'colorPickerChanged' });
        } else {
            this.observer.notify(events.selectionRestore, {});
            this.formatter.process(this, { item: args, name: 'colorPickerChanged' }, undefined, null);
            this.observer.notify(events.selectionSave, {});
        }
    }
    public cancelLinkDialog(): void {
        this.isBlur = false;
        this.linkModule.cancelDialog();
    }
    public cancelImageDialog(): void {
        this.isBlur = false;
    }
    public linkDialogClosed(): void {
        this.isBlur = false;
        this.linkModule.linkDialogClosed();
    }
    public dialogClosed(type: string): void {
        this.isBlur = false;
        if (type === 'restore') { this.observer.notify(events.selectionRestore, {}); }
    }
    public insertLink(args: LinkFormModel): void {
        this.linkModule.insertLink(args);
    }
    public invokeImageBrowse(): void {
        this.imageModule.invokeImageBrowse();
    }
    public imageRemoving(): void {
        this.imageModule.removing();
    }
    public uploadSuccess(url: string, altText: string): void {
        this.imageModule.imageUploadSuccess(url, altText);
    }
    public imageSelected(): void {
        this.imageModule.imageSelected();
    }
    public imageUploadComplete(base64Str: string, altText: string): void {
        this.imageModule.imageUploadComplete(base64Str, altText);
    }
    public imageUploadChange(url: string, isStream: boolean): void {
        this.imageModule.imageUploadChange(url, isStream);
    }
    public dropUploadChange(url: string, isStream: boolean): void {
        this.imageModule.dropUploadChange(url, isStream);
    }
    public insertImage(): void {
        this.imageModule.insertImageUrl();
    }
    public imageDialogOpened(): void {
        this.imageModule.dialogOpened();
    }
    public imageDialogClosed(): void {
        this.isBlur = false;
        this.imageModule.dialogClosed();
    }
    public insertTable(row: number, column: number): void {
        this.tableModule.customTable(row, column);
    }
    public applyTableProperties(model: EditTableModel): void {
        this.tableModule.applyTableProperties(model);
    }
    public createTablePopupOpened(): void {
        this.tableModule.createTablePopupOpened();
    }
    public pasteContent(pasteOption: string): void {
        this.pasteCleanupModule.selectFormatting(pasteOption);
    }
    public imageDropInitialized(isStream: boolean): void {
        this.imageModule.imageDropInitialized(isStream);
    }
    public preventEditable(): void {
        this.inputElement.contentEditable = 'false';
    }
    public enableEditable(): void {
        this.inputElement.contentEditable = 'true';
    }
    public removeDroppedImage(): void {
        this.imageModule.removeDroppedImage();
    }
    public dropUploadSuccess(url: string, altText: string): void {
        this.imageModule.dropUploadSuccess(url, altText);
    }
    public focusIn(): void {
        if (this.enabled) {
            this.inputElement.focus();
            this.focusHandler({} as FocusEvent);
        }
    }
    public insertAlt(altText: string): void {
        this.imageModule.insertAlt(altText);
    }
    public insertSize(width: number, height: number): void {
        this.imageModule.insertSize(width, height);
    }
    public insertImageLink(url: string, target: string): void {
        this.imageModule.insertLink(url, target);
    }
    //#endregion
    //#region Event binding and unbinding function
    private wireEvents(): void {
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        this.observer.on(events.contentChanged, this.contentChanged, this);
        this.observer.on(events.modelChanged, this.refresh, this);
        this.observer.on(events.resizeInitialized, this.updateResizeFlag, this);
        if (!this.readonly && !this.enabled) {
            this.bindEvents();
        }
    }
    private bindEvents(): void {
        this.keyboardModule = new KeyboardEvents(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs:
                { ...this.formatter.keyConfig, ...this.keyConfig }, eventName: 'keydown'
        });
        let formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30), this);
        EventHandler.add(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler, this);
        this.wireContextEvent();
        this.formatter.editorManager.observer.on('keydown-handler', this.editorKeyDown, this);
        this.element.ownerDocument.defaultView.addEventListener('resize', this.onResizeHandler, true);
        if (this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'focusin', this.focusHandler, this);
            EventHandler.add(this.inputElement, 'focusout', this.blurHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown, this);
        }
        this.wireScrollElementsEvents();
    }
    private wireContextEvent(): void {
        if (this.quickToolbarSettings.showOnRightClick) {
            EventHandler.add(this.inputElement, 'contextmenu', this.contextHandler, this);
            if (Browser.isDevice) {
                this.touchModule = new EJ2Touch(this.inputElement, { tapHold: this.touchHandler.bind(this), tapHoldThreshold: 500 });
            }
        }
    }
    private wireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.add(this.getPanel(), 'scroll', this.contentScrollHandler, this);
        }
    }
    private unWireEvents(): void {
        this.element.removeEventListener('focusin', this.onFocusHandler, true);
        this.element.removeEventListener('focusout', this.onBlurHandler, true);
        this.observer.off(events.contentChanged, this.contentChanged);
        this.observer.off(events.resizeInitialized, this.updateResizeFlag);
        this.unBindEvents();
    }
    private unBindEvents(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        let formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30));
        EventHandler.remove(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler);
        this.unWireContextEvent();
        if (this.formatter) {
            this.formatter.editorManager.observer.off('keydown-handler', this.editorKeyDown);
        }
        this.element.ownerDocument.defaultView.removeEventListener('resize', this.onResizeHandler, true);
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
        }
        this.unWireScrollElementsEvents();
    }
    private unWireContextEvent(): void {
        EventHandler.remove(this.inputElement, 'contextmenu', this.contextHandler);
        if (Browser.isDevice && this.touchModule) { this.touchModule.destroy(); }
    }
    private unWireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (let element of this.scrollParentElements) {
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.remove(this.getPanel(), 'scroll', this.contentScrollHandler);
        }
    }
    //#endregion
    //#region Event handler methods
    private focusHandler(e: FocusEvent): void {
        if ((!this.isRTE || this.isFocusOut)) {
            this.isRTE = this.isFocusOut ? false : true;
            this.isFocusOut = false;
            addClass([this.element], [classes.CLS_FOCUS]);
            if (this.editorMode === 'HTML') {
                this.cloneValue = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                    this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
            } else {
                this.cloneValue = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                    (this.inputElement as HTMLTextAreaElement).value;
            }
            let active: Element = document.activeElement;
            if (active === this.element || active === this.getToolbarElement() || active === this.getEditPanel()
                || ((this.iframeSettings.enable && active === this.getPanel()) &&
                    e.target && !(e.target as HTMLElement).classList.contains('e-img-inner')
                    && (e.target && (e.target as HTMLElement).parentElement
                        && !(e.target as HTMLElement).parentElement.classList.contains('e-img-wrap')))
                || closest(active, '.e-rte-toolbar') === this.getToolbarElement()) {
                (this.getEditPanel() as HTMLElement).focus();
                if (!isNOU(this.getToolbarElement())) {
                    this.getToolbarElement().setAttribute('tabindex', '-1');
                    let items: NodeList = this.getToolbarElement().querySelectorAll('[tabindex="0"]');
                    for (let i: number = 0; i < items.length; i++) {
                        (items[i] as HTMLElement).setAttribute('tabindex', '-1');
                    }
                }
            }
            this.defaultResize(e, false);
            let args: FocusBlurEventArgs = { isInteracted: Object.keys(e).length === 0 ? false : true };
            this.dotNetRef.invokeMethodAsync('FocusEvent', args);
            if (!isNOU(this.saveInterval) && this.saveInterval > 0 && !this.autoSaveOnIdle) {
                this.timeInterval = setInterval(this.updateValueOnIdle.bind(this), this.saveInterval);
            }
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
        if (!isNOU(this.getToolbarElement())) {
            let toolbarItem: NodeList = this.getToolbarElement().querySelectorAll('input,select,button,a,[tabindex]');
            for (let i: number = 0; i < toolbarItem.length; i++) {
                if ((!(toolbarItem[i] as HTMLElement).classList.contains('e-rte-dropdown-btn') &&
                    !(toolbarItem[i] as HTMLElement).classList.contains('e-insert-table-btn')) &&
                    (!(toolbarItem[i] as HTMLElement).hasAttribute('tabindex') ||
                        (toolbarItem[i] as HTMLElement).getAttribute('tabindex') !== '-1')) {
                    (toolbarItem[i] as HTMLElement).setAttribute('tabindex', '-1');
                }
            }
        }
    }
    private blurHandler(e: FocusEvent): void {
        let trg: Element = e.relatedTarget as Element;
        if (trg) {
            let rteElement: Element = closest(trg, '.' + classes.CLS_RTE);
            if (rteElement && rteElement === this.element) {
                this.isBlur = false;
                if (trg === this.getToolbarElement()) { trg.setAttribute('tabindex', '-1'); }
            } else if (closest(trg, '[aria-owns="' + this.element.id + '"]')) {
                this.isBlur = false;
            } else {
                this.isBlur = true;
                trg = null;
            }
        }
        if (this.isBlur && isNOU(trg)) {
            removeClass([this.element], [classes.CLS_FOCUS]);
            this.observer.notify(events.focusChange, {});
            this.value = this.getUpdatedValue();
            this.updateValueContainer(this.value);
            this.observer.notify(events.toolbarRefresh, { args: e, documentNode: document });
            this.invokeChangeEvent();
            this.isFocusOut = true;
            this.isBlur = false;
            dispatchEvent(this.valueContainer, 'focusout');
            this.defaultResize(e, true);
            let args: FocusBlurEventArgs = { isInteracted: Object.keys(e).length === 0 ? false : true };
            this.dotNetRef.invokeMethodAsync('BlurEvent', args);
            if (!isNOU(this.timeInterval)) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        } else {
            this.isRTE = true;
        }
    }
    private resizeHandler(): void {
        let isExpand: boolean = false;
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            this.dotNetRef.invokeMethodAsync('RefreshToolbarOverflow');
            let tbElement: HTMLElement = this.element.querySelector('.e-rte-toolbar');
            isExpand = tbElement && tbElement.classList.contains(classes.CLS_EXPAND_OPEN);
        }
        this.setContentHeight('', isExpand);
    }
    private touchHandler(e: TapEventArgs): void {
        this.notifyMouseUp(e.originalEvent);
        this.triggerEditArea(e.originalEvent);
    }
    private resetHandler(): void {
        let defaultValue: string = this.valueContainer.defaultValue.trim().replace(/<!--!-->/gi, '');
        this.value = defaultValue;
        this.setPanelValue(this.value);
    }
    private contextHandler(e: MouseEvent): void {
        let closestElem: Element = closest((e.target as HTMLElement), 'a, table, img');
        if (this.inlineMode.onSelection === false || (!isNOU(closestElem) && this.inputElement.contains(closestElem)
            && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A'))) {
            e.preventDefault();
        }
    }
    private scrollHandler(e: Event): void {
        this.observer.notify(events.scroll, { args: e });
    }
    private contentScrollHandler(e: Event): void {
        this.observer.notify(events.contentscroll, { args: e });
    }
    private mouseUp(e: MouseEvent | TouchEvent): void {
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            let target: Element = e.target as Element;
            let closestTable: Element = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
    }
    private mouseDownHandler(e: MouseEvent | TouchEvent): void {
        let touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        addClass([this.element], [classes.CLS_FOCUS]);
        this.defaultResize(e as MouseEvent, false);
        this.observer.notify(events.mouseDown, { args: e });
        this.clickPoints = { clientX: touch.clientX, clientY: touch.clientY };
    }
    private onIframeMouseDown(e: MouseEvent): void {
        this.isBlur = false;
        this.observer.notify(events.iframeMouseDown, e);
    }
    public keyDown(e: KeyboardEvent): void {
        this.observer.notify(events.keyDown, { member: 'keydown', args: e });
        this.restrict(e);
        if (this.editorMode === 'HTML' && ((e.which === 8 && e.code === 'Backspace') || (e.which === 46 && e.code === 'Delete'))) {
            let range: Range = this.getRange();
            let startNode: Element = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement :
                range.startContainer as Element;
            if (closest(startNode, 'pre') &&
                (e.which === 8 && range.startContainer.textContent.charCodeAt(range.startOffset - 1) === 8203) ||
                (e.which === 46 && range.startContainer.textContent.charCodeAt(range.startOffset) === 8203)) {
                let regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
                let pointer: number = e.which === 8 ? range.startOffset - 1 : range.startOffset;
                range.startContainer.textContent = range.startContainer.textContent.replace(regEx, '');
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.getDocument(), range.startContainer as Element, pointer);
            } else if ((e.code === 'Backspace' && e.which === 8) &&
                range.startContainer.textContent.charCodeAt(0) === 8203 && range.collapsed) {
                let parentEle: Element = range.startContainer.parentElement;
                let index: number;
                let i: number;
                for (i = 0; i < parentEle.childNodes.length; i++) { if (parentEle.childNodes[i] === range.startContainer) { index = i; } }
                let bool: boolean = true;
                let removeNodeArray: number[] = [];
                for (i = index; i >= 0; i--) {
                    if (parentEle.childNodes[i].nodeType === 3 && parentEle.childNodes[i].textContent.charCodeAt(0) === 8203 && bool) {
                        removeNodeArray.push(i);
                    } else {
                        bool = false;
                    }
                }
                if (removeNodeArray.length > 0) {
                    for (i = removeNodeArray.length - 1; i > 0; i--) {
                        parentEle.childNodes[removeNodeArray[i]].textContent = '';
                    }
                }
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.getDocument(), range.startContainer as Element, range.startOffset);
            }
        }
        if (this.formatter.getUndoRedoStack().length === 0) {
            this.formatter.saveData();
        }
        if ((e as KeyboardEventArgs).action !== 'insert-link' &&
            ((e as KeyboardEventArgs).action && (e as KeyboardEventArgs).action !== 'paste' || e.which === 9 ||
                (e.code === 'Backspace' && e.which === 8))) {
            this.formatter.process(this, null, e);
            switch ((e as KeyboardEventArgs).action) {
                case 'toolbar-focus':
                    if (this.toolbarSettings.enable) {
                        let selector: string = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
                        (this.getToolbar().querySelector(selector) as HTMLElement).focus();
                    }
                    break;
                case 'escape':
                    (this.getEditPanel() as HTMLElement).focus();
                    break;
            }
        }
        if (!isNOU(this.placeholder)) {
            if ((!isNOU(this.placeHolderContainer)) && (this.inputElement.textContent.length !== 1)) {
                this.placeHolderContainer.style.display = 'none';
            } else {
                this.setPlaceHolder();
            }
        }
        this.autoResize();
    }
    private editorKeyDown(e: IHtmlKeyboardEvent): void {
        switch (e.event.action) {
            case 'copy':
                this.onCopy();
                break;
            case 'cut':
                this.onCut();
                break;
        }
        if (e.callBack && (e.event.action === 'copy' || e.event.action === 'cut' || e.event.action === 'delete')) {
            e.callBack({
                requestType: e.event.action,
                editorMode: 'HTML',
                event: e.event
            });
        }
    }
    private keyUp(e: KeyboardEvent): void {
        if (this.editorMode === 'HTML') {
            switch (e.which) {
                case 46:
                case 8:
                    let childNodes: Element[] = <NodeListOf<Element> & Element[]>this.getEditPanel().childNodes;
                    if ((childNodes.length === 0) ||
                        (childNodes.length === 1 && (((childNodes[0] as Element).tagName === 'BR') ||
                            ((childNodes[0] as Element).tagName === 'P' &&
                                (childNodes[0].childNodes.length === 0 || childNodes[0].textContent === ''))))) {
                        let node: Element = this.getEditPanel();
                        node.innerHTML = '<p><br/></p>';
                        this.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.getDocument(), node.childNodes[0] as Element, 0);
                    }
                    break;
            }
        }
        this.observer.notify(events.keyUp, { member: 'keyup', args: e });
        if (e.code === 'KeyX' && e.which === 88 && e.keyCode === 88 && e.ctrlKey && (this.inputElement.innerHTML === '' ||
            this.inputElement.innerHTML === '<br>')) {
            this.inputElement.innerHTML = getEditValue('<p><br></p>', this);
        }
        let allowedKeys: boolean = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46;
        if (((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys) || (this.editorMode === 'Markdown'
            && ((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys)) && !this.inlineMode.enable) {
            this.formatter.onKeyHandler(this, e);
        }
        if (this.inputElement && this.inputElement.textContent.length !== 0) {
            this.observer.notify(events.toolbarRefresh, { args: e });
        }
        if (!isNOU(this.placeholder)) {
            this.setPlaceHolder();
        }
    }
    private onCut(): void {
        this.getDocument().execCommand('cut', false, null);
    }
    private onCopy(): void {
        this.getDocument().execCommand('copy', false, null);
    }
    private onPaste(e?: KeyboardEvent | ClipboardEvent): void {
        let evenArgs: { [key: string]: Object } = {
            originalEvent: e,
            requestType: 'Paste'
        };
        let currentLength: number = this.getText().length;
        let selectionLength: number = this.getSelection().length;
        let pastedContentLength: number = (isNOU(e as ClipboardEvent) || isNOU((e as ClipboardEvent).clipboardData))
            ? 0 : (e as ClipboardEvent).clipboardData.getData('text/plain').length;
        let totalLength: number = (currentLength - selectionLength) + pastedContentLength;
        if (this.editorMode === 'Markdown') {
            if (!(this.maxLength === -1 || totalLength < this.maxLength)) {
                e.preventDefault();
            }
            return;
        }
        if (this.inputElement.contentEditable === 'true' &&
            (this.maxLength === -1 || totalLength < this.maxLength)) {
            this.observer.notify(events.pasteClean, { args: e as ClipboardEvent });
        } else {
            e.preventDefault();
        }
    }
    private onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        let rteElement: Element = closest(target, '.' + classes.CLS_RTE);
        if (!this.element.contains(e.target as Node) && document !== e.target && rteElement !== this.element &&
            !closest(target, '[aria-owns="' + this.element.id + '"]')) {
            this.isBlur = true;
            this.isRTE = false;
        }
        this.observer.notify(events.docClick, { args: e });
    }
    public propertyChangeHandler(newProps: { [key: string]: Object }): void {
        let oldProps: { [key: string]: Object } = {};
        for (let prop of Object.keys(newProps)) {
            /* tslint:disable */
            oldProps[prop] = (this as any)[prop];
            /* tslint:enable */
        }
        this.updateContext(newProps);
        for (let prop of Object.keys(newProps)) {
            switch (prop) {
                case 'enableXhtml':
                case 'enableHtmlSanitizer':
                case 'value':
                    this.setPanelValue(this.value);
                    break;
                case 'height':
                    this.setHeight(this.height);
                    this.setContentHeight();
                    this.autoResize();
                    break;
                case 'width':
                    this.setWidth(this.width);
                    if (this.toolbarSettings.enable) {
                        this.dotNetRef.invokeMethodAsync('RefreshToolbarOverflow');
                        //this.toolbarModule.refreshToolbarOverflow();
                        this.resizeHandler();
                    }
                    break;
                case 'readonly': this.setReadOnly(false); break;
                case 'enabled': this.setEnable(); break;
                case 'placeholder':
                    this.placeholder = this.placeholder;
                    this.setPlaceHolder();
                    break;
                case 'showCharCount':
                    if (this.showCharCount && this.countModule) {
                        this.countModule.renderCount();
                    } else if (this.showCharCount === false && this.countModule) {
                        this.countModule.destroy();
                    }
                    break;
                case 'maxLength':
                    if (this.showCharCount) { this.countModule.refresh(); }
                    break;
                case 'enableHtmlEncode':
                    this.updateValueData(); this.updatePanelValue(); this.setPlaceHolder();
                    if (this.showCharCount) { this.countModule.refresh(); }
                    break;
                case 'undoRedoSteps':
                case 'undoRedoTimer':
                    this.formatter.editorManager.observer.notify('model_changed', { newProp: newProps });
                    break;
                case 'adapter':
                    let editElement: HTMLTextAreaElement = this.getEditPanel() as HTMLTextAreaElement;
                    let option: { [key: string]: number } = { undoRedoSteps: this.undoRedoSteps, undoRedoTimer: this.undoRedoTimer };
                    if (this.editorMode === 'Markdown') {
                        this.formatter = new MarkdownFormatter(extend({}, this.adapter, {
                            element: editElement,
                            options: option
                        }));
                    }
                    break;
                case 'iframeSettings':
                    let frameSetting: IFrameSettingsModel = oldProps[prop];
                    if (frameSetting.resources) {
                        let iframe: HTMLDocument = this.getDocument();
                        let header: HTMLHeadElement = iframe.querySelector('head');
                        let files: Element[];
                        if (frameSetting.resources.scripts) {
                            files = <NodeListOf<Element> & Element[]>header.querySelectorAll('.' + classes.CLS_SCRIPT_SHEET);
                            this.removeSheets(files);
                        }
                        if (frameSetting.resources.styles) {
                            files = <NodeListOf<Element> & Element[]>header.querySelectorAll('.' + classes.CLS_STYLE_SHEET);
                            this.removeSheets(files);
                        }
                    }
                    this.setIframeSettings();
                    break;
                case 'quickToolbarSettings':
                    this.quickToolbarSettings.showOnRightClick ? this.wireContextEvent() : this.unWireContextEvent();
                    break;
                default:
                    //this.observer.notify('model-changed', { newProp: newProp, oldProp: oldProp });
                    break;
            }
        }
        //#endregion
    }
}