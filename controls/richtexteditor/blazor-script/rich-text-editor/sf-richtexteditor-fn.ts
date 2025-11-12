import { select, closest, Browser, debounce, detach, extend, Observer, addClass, removeClass, isNullOrUndefined } from '../../base'; /*externalscript*/
import { EventHandler, TapEventArgs, createElement, BlazorDotnetObject } from '../../base'; /*externalscript*/
import { Touch as EJ2Touch, print as printWindow, isNullOrUndefined as isNOU } from '../../base'; /*externalscript*/
import { MenuEventArgs } from '../../navigations/src'; /*externalscript*/
import { getScrollableParent } from '../../popups/src'; /*externalscript*/
import { OpenEventArgs } from '../../inputs/src'; /*externalscript*/
import { BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '../../splitbuttons/src'; /*externalscript*/
import * as classes from './classes';
import * as events from './constant';
import { Count } from './actions/count';
import { Resize } from './actions/resize';
import { Toolbar } from './actions/toolbar';
import { Link } from './renderer/link-module';
import { Table } from './renderer/table-module';
import { Image } from './renderer/image-module';
import { Audio } from './renderer/audio-module';
import { Video } from './renderer/video-module';
import { HtmlEditor } from './actions/html-editor';
import { FullScreen } from './actions/full-screen';
import { EnterKeyAction } from './actions/enter-key';
import { ViewSource } from './renderer/view-source';
import { QuickToolbar } from './actions/quick-toolbar';
import { PasteCleanup } from './actions/paste-clean-up';
import { MarkdownEditor } from './actions/markdown-editor';
import { MarkdownFormatter } from './formatter/markdown-formatter';
import { FormatPainter } from './actions/format-painter';
import { KeyboardEvents, KeyboardEventArgs } from './actions/keyboard';
import { ExecCommandCallBack } from './actions/execute-command-callback';
import { BeforeInputEvent, IHtmlKeyboardEvent, IHtmlUndoRedoData } from '../editor-scripts/editor-manager/base/interface';
import { ToolbarClickEventArgs, FocusBlurEventArgs, FormatModel, AdditionalSanitizeAttributes, ImportWordSettingsModel } from './interfaces';
import { LinkFormModel, IFormatter, FormatterMode, ToolsItem } from './interfaces';
import { getEditValue, decode, dispatchEvent, hasClass, setAttributes, executeGroup, getDefaultValue } from './util';
import { cleanHTMLString, scrollToCursor, getStructuredHtml, alignmentHtml } from '../editor-scripts/common/util';
import { IFrameSettingsModel } from '../editor-scripts/models/iframe-settings-model';
import { InlineModeModel } from '../editor-scripts/models/inline-mode-model';
import { ImageSettingsModel, AudioSettingsModel, VideoSettingsModel, PasteCleanupSettingsModel, QuickToolbarSettingsModel, ToolbarSettingsModel, FormatPainterSettingsModel, CodeBlockSettingsModel } from '../editor-scripts/models/toolbar-settings-model';
import { FontFamilyModel, FontSizeModel, FontColorModel, BackgroundColorModel, TableSettingsModel } from '../editor-scripts/models/toolbar-settings-model';
import { IImageCommandsArgs, ITableCommandsArgs, ExecuteCommandOption, StatusArgs, CleanupResizeElemArgs, ICodeBlockLanguageModel, IListCommandArgs, IToolbarItems } from '../editor-scripts/common/interface';
import { PrintEventArgs, IExecutionGroup, NotifyArgs, ILinkCommandsArgs, MetaTag } from '../editor-scripts/common/interface';
import { CommandName } from '../editor-scripts/common/enum';
import { IDropDownClickArgs, IToolsItems, ActionCompleteEventArgs, IDropDownItemModel, IAudioCommandsArgs, IVideoCommandsArgs, ICodeBlockCommandsArgs } from '../editor-scripts/common/interface';
import { IBaseQuickToolbar } from './interfaces';
import { IAdvanceListItem, ICodeBlockItem, IToolbarStatus, EditTableModel, SelectionChangedEventArgs } from '../editor-scripts/common/interface';
import { HtmlToolbarStatus } from './actions/html-toolbar-status';
import { ToolbarStatus } from '../editor-scripts/editor-manager';
import { mentionRestrictKeys } from '../editor-scripts/common/config';
import { cleanupInternalElements, removeSelectionClassStates, resetContentEditableElements } from '../editor-scripts/common/util';
import { CustomUserAgentData } from '../editor-scripts/common/user-agent';
import { ToolbarType } from '../editor-scripts/common/enum';
import * as CONSTANT from '../editor-scripts/common/constant';
import { MarkdownUndoRedoData } from '../editor-scripts/markdown-parser/base/interface';
import { NodeSelection } from '../editor-scripts/selection/selection';
import { CodeBlock } from './actions/code-block';
import { IFRAME_EDITOR_DARK_THEME_STYLES, IFRAME_EDITOR_LIGHT_THEME_STYLES, IFRAME_EDITOR_STYLES } from '../editor-scripts/common/editor-styles';
import { ImportWord } from './renderer/word-module';


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
    public enterKey: string;
    public shiftEnterKey: string;
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
    public deniedSanitizeSelectors: string[];
    public additionalSanitizeTags: string[];
    public additionalSanitizeAttributes: AdditionalSanitizeAttributes[];
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
    public insertAudioSettings: AudioSettingsModel;
    public insertVideoSettings: VideoSettingsModel;
    private htmlAttributes: { [key: string]: string; };
    public quickToolbarSettings: QuickToolbarSettingsModel;
    public pasteCleanupSettings: PasteCleanupSettingsModel;
    public formatPainterSettings: FormatPainterSettingsModel;
    public codeBlockSettings: CodeBlockSettingsModel;
    private mutationObserver: MutationObserver;
    public importWordValue: ImportWordSettingsModel = {};

    /**
     * First immediate container from the Rich Text Editor Root element.
     */
    public rootContainer: HTMLElement
    //#endregion

    //#region Number variables
    private timeInterval: number;
    private idleInterval: number;
    //#endregion

    //#region String variables
    public id: string;
    private dataId: string;
    private cloneValue: string;
    private defaultResetValue: string = null;
    //#endregion

    //#region Boolean variables
    public isRTE: boolean;
    public isBlur: boolean;
    public isFocusOut: boolean;
    private isInitial: boolean = true;
    public blurEnabled: boolean = false;
    public focusEnabled: boolean = false;
    private isResizeInitialized: boolean;
    public undoRedoStatus: boolean = false;
    public createdEnabled: boolean = false;
    private isIframeRteElement: boolean = true;
    public actionBeginEnabled: boolean = false;
    public imageDeleteEnabled: boolean = false;
    public mediaDeleteEnabled: boolean = false;
    public onResizeStopEnabled: boolean = false;
    public quickTbClosedEnabled: boolean = false;
    public quickTbOpenedEnabled: boolean = false;
    public onQuickTbOpenEnabled: boolean = false;
    public onResizeStartEnabled: boolean = false;
    public actionCompleteEnabled: boolean = false;
    public beforeUploadImageEnabled: boolean = false;
    public onImageUploadFailedEnabled: boolean = false;
    public onImageUploadSuccessEnabled: boolean = false;
    public beforeUploadMediaEnabled: boolean = false;
    public onMediaUploadFailedEnabled: boolean = false;
    public onMediaUploadSuccessEnabled: boolean = false;
    public beforePasteCleanupEnabled: boolean = false;
    public afterPasteCleanupEnabled: boolean = false;
    public selectionChangedEnabled: boolean = false;
    private isPlainPaste: boolean = false;
    private hasContentChanged: boolean = false;
    private isSelecting: boolean = false;
    private isSelectionStartInRTE: boolean = false;
    private selectionTimeout: number;
    private previousRange: Range | null;
    //#endregion

    //#region HtmlElement variables
    public contentPanel: Element;
    public inputElement: HTMLElement;
    public placeHolderContainer: HTMLElement;
    public valueContainer: HTMLTextAreaElement;
    public scrollParentElements: HTMLElement[];
    //#endregion

    //#region Complex variables
    public observer: Observer;
    public isSelectAll: boolean = false;
    private clickPoints: { [key: string]: number } = { clientX: 0, clientY: 0 };
    private inlineCloseItems: string[] = ['CreateLink', 'Image', 'CreateTable', 'Maximize', 'Minimize', 'Video', 'Audio'];
    //#endregion

    //#region Common variables
    public element: HTMLElement;
    public dotNetRef: BlazorDotnetObject;
    private sfBlazor: any = (window as any).sfBlazor;
    //#endregion

    //#region Event handler variables
    private onBlurHandler: EventListenerOrEventListenerObject;
    private onFocusHandler: EventListenerOrEventListenerObject;
    private onResizeHandler: Function;
    private mouseUpDebListener: Function;
    //#endregion

    //#region Modules variables
    public linkModule: Link;
    public countModule: Count;
    public tableModule: Table;
    public imageModule: Image;
    public audioModule: Audio;
    public videoModule: Video;
    public resizeModule: Resize;
    public toolbarModule: Toolbar;
    private touchModule: EJ2Touch;
    public fullScreenModule: FullScreen;
    public enterKeyModule: EnterKeyAction;
    public htmlEditorModule: HtmlEditor;
    public viewSourceModule: ViewSource;
    public keyboardModule: KeyboardEvents;
    public quickToolbarModule: QuickToolbar;
    public pasteCleanupModule: PasteCleanup;
    public markdownEditorModule: MarkdownEditor;
    public userAgentData: CustomUserAgentData;
    public formatPainterModule: FormatPainter;
    public codeBlockModule: CodeBlock;
    public wordModule: ImportWord;

    private onLoadHandler: () => void;
    private onClickBoundfn: () => void;
    //#endregion

    constructor(options: { [key: string]: Object }) {
        this.updateContext(options);
        if (this.sfBlazor) {
            if (isNOU(this.sfBlazor.instances)) {
                this.sfBlazor.instances = [];
            }
            this.sfBlazor.instances[this.dataId] = this;
        }
        this.observer = new Observer(this);
        this.userAgentData = new CustomUserAgentData(Browser.userAgent, false);
        this.onClickBoundfn = this.clickHandler.bind(this);
        this.initModules();
        this.initialize();
    }
    //#region Internal methods
    public updateContext(rteObj: { [key: string]: Object }): void {
        extend(this, this, rteObj);
    }
    private initModules(): void {
        this.id = this.element.id;
        this.updateContentElements();
        this.rootContainer = this.element.firstChild as HTMLElement;
        this.inputElement = this.getEditPanel() as HTMLElement;
        if (!isNOU(this.fontFamily.default)) {
            this.inputElement.style.fontFamily = this.fontFamily.default;
        }
        if (!isNOU(this.fontSize.default)) {
            this.inputElement.style.fontSize = this.fontSize.default;
        }
        this.valueContainer = this.element.querySelector('textarea');
        if (this.toolbarSettings.enable) {
            this.isUndoRedoStatus();
            this.toolbarModule = new Toolbar(this);
        }
        this.linkModule = new Link(this);
        this.imageModule = new Image(this);
        if (this.editorMode === 'HTML') {
            this.audioModule = new Audio(this);
            this.videoModule = new Video(this);
        }
        if (this.showCharCount) { this.countModule = new Count(this); }
        if (this.quickToolbarSettings.enable) {
            this.quickToolbarModule = new QuickToolbar(this);
        }
        if (this.editorMode === 'HTML') {
            this.htmlEditorModule = new HtmlEditor(this);
        } else {
            this.markdownEditorModule = new MarkdownEditor(this);
        }
        this.tableModule = new Table(this);
        if (this.editorMode === 'HTML') {
            this.pasteCleanupModule = new PasteCleanup(this);
        }
        if (this.enableResize) { this.resizeModule = new Resize(this); }
        if (this.editorMode === 'HTML') {
            this.formatPainterModule = new FormatPainter(this);
            this.viewSourceModule = new ViewSource(this);
        }
        this.fullScreenModule = new FullScreen(this);
        if (this.editorMode === 'HTML') {
            this.enterKeyModule = new EnterKeyAction(this);
            this.codeBlockModule = new CodeBlock(this);
        }
        if (this.editorMode === 'HTML') {
            this.wordModule = new ImportWord(this);
        }
    }
    public initialize(): void {
        this.value = this.replaceEntities(this.value);
        this.onBlurHandler = this.blurHandler.bind(this);
        this.onFocusHandler = this.focusHandler.bind(this);
        this.onResizeHandler = this.resizeHandler.bind(this, false);
        const execCommandCallBack: ExecCommandCallBack = new ExecCommandCallBack(this);
        if (this.readonly) { this.setReadOnly(true); }
        if (this.iframeSettings && this.iframeSettings.enable) {
            this.setIframeSettings();
        }
        if (isNOU(this.value) || this.value === '') {
            this.value = this.element.querySelector('.e-rte-value-wrapper').innerHTML.replace(/<!--!-->/gi, '').trim();
        }
        this.setPanelValue(this.value);
        this.observer.notify(events.initialEnd, {});
        if (this.enableXhtml) {
            this.value = this.getXhtml();
        }
        if (this.value !== null) {
            this.defaultResetValue = this.value;
        }
        if (this.enabled && !this.readonly) {
            this.wireEvents();
        } else {
            this.unWireEvents();
        }
        this.observer.notify(events.tableclass, {});
        this.addAudioVideoWrapper();
        this.autoResize();
        if (this.createdEnabled) { this.dotNetRef.invokeMethodAsync('CreatedEvent'); }
    }
    public addAnchorAriaLabel(value: string): string {
        const valueElementWrapper: HTMLElement = document.createElement('div');
        valueElementWrapper.innerHTML = value;
        const item: NodeListOf<Element> = valueElementWrapper.querySelectorAll('a');
        if (item.length > 0) {
            for (let i: number = 0; i < item.length; i++) {
                if (item[i as number].hasAttribute('target') && item[i as number].getAttribute('target') === '_blank') {
                    if (!item[i as number].hasAttribute('aria-label') || item[i as number].getAttribute('aria-label') === '') {
                        item[i as number].setAttribute('aria-label', this.localeData.linkAriaLabel);
                    }
                }
            }
        }
        return valueElementWrapper.innerHTML;
    }
    public addAudioVideoWrapper(): void {
        let insertElem: HTMLElement;
        const audioElm: NodeListOf<HTMLElement> = this.element.querySelectorAll('audio');
        for (let i: number = 0; i < audioElm.length; i++) {
            if (!audioElm[i as number].classList.contains('e-rte-audio')) {
                audioElm[i as number].classList.add('e-rte-audio');
                audioElm[i as number].classList.add(classes.CLS_AUDIOINLINE);
            }
            if (!audioElm[i as number].parentElement.classList.contains(classes.CLS_CLICKELEM) &&
                !audioElm[i as number].parentElement.classList.contains(classes.CLS_AUDIOWRAP)) {
                const audioWrapElem: HTMLElement = createElement('span', { className: classes.CLS_AUDIOWRAP });
                audioWrapElem.contentEditable = 'false';
                const audioInnerWrapElem: HTMLElement = createElement('span', { className: classes.CLS_CLICKELEM });
                audioWrapElem.appendChild(audioInnerWrapElem);
                audioElm[i as number].parentNode.insertBefore(audioWrapElem, audioElm[i as number].nextSibling);
                audioInnerWrapElem.appendChild(audioElm[i as number]);
                if (audioWrapElem.nextElementSibling === null) {
                    insertElem = createElement('br');
                    audioWrapElem.parentNode.insertBefore(insertElem, audioWrapElem.nextSibling);
                }
            }
        }
        const videoElm: NodeListOf<HTMLElement> = this.element.querySelectorAll('video');
        for (let i: number = 0; i < videoElm.length; i++) {
            if (!videoElm[i as number].classList.contains('e-rte-video')) {
                videoElm[i as number].classList.add('e-rte-video');
                videoElm[i as number].classList.add(classes.CLS_VIDEOINLINE);
            }
            if (!videoElm[i as number].parentElement.classList.contains(classes.CLS_CLICKELEM) &&
                !videoElm[i as number].parentElement.classList.contains(classes.CLS_VIDEOWRAP)) {
                const videoWrapElem: HTMLElement = createElement('span', { className: classes.CLS_VIDEOWRAP });
                videoWrapElem.contentEditable = 'false';
                videoElm[i as number].parentNode.insertBefore(videoWrapElem, videoElm[i as number].nextSibling);
                videoWrapElem.appendChild(videoElm[i as number]);
                if (videoWrapElem.nextElementSibling === null) {
                    insertElem = createElement('br');
                    videoWrapElem.parentNode.insertBefore(insertElem, videoWrapElem.nextSibling);
                }
            }
            if (Browser.userAgent.indexOf('Firefox') !== -1) {
                videoElm[i as number].addEventListener('play', (args: Event) => {
                    this.observer.notify(events.mouseDown, { args: args });
                    this.observer.notify('editAreaClick', { args: args });
                });
                videoElm[i as number].addEventListener('pause', (args: Event) => {
                    this.observer.notify(events.mouseDown, { args: args });
                    this.observer.notify('editAreaClick', { args: args });
                });
            }
        }
    }

    private isUndoRedoStatus(): void {
        for (let i: number = 0; i < this.toolbarSettings.items.length; i++) {
            if (!isNOU(this.toolbarSettings.items[i as number]) && ((this.toolbarSettings.items[i as number] as ToolsItem).subCommand === 'Undo'
                || (this.toolbarSettings.items[i as number] as ToolsItem).subCommand === 'Redo')) {
                this.undoRedoStatus = true;
                break;
            }
        }
    }

    public setPanelValue(value: string, isReset?: boolean): void {
        value = this.serializeValue(value);
        this.value = this.editorMode === 'HTML' && !isNOU(value) ? this.addAnchorAriaLabel(value) : value;
        if (this.editorMode === 'HTML' && this.enableXhtml) {
            this.inputElement.innerHTML = resetContentEditableElements(value, this.editorMode);
            this.observer.notify(events.xhtmlValidation, {});
            value = this.inputElement.innerHTML;
            value = getStructuredHtml(cleanHTMLString(value, this.element), this.enterKey, this.enableHtmlEncode);
        }
        let emptyContainer: string;
        if (this.editorMode === 'HTML' && !isReset) {
            if (isNOU(value) || value === '') {
                emptyContainer = '';
            }
            value = getEditValue(isNOU(value) ? '' : value, this);
            value = this.enableXhtml ? this.htmlEditorModule.xhtmlValidation.selfEncloseValidation(value) : value;
        }
        this.updatePanelValue(value, emptyContainer);
        this.value = emptyContainer === '' ? emptyContainer : this.valueContainer.value;
        if (this.value !== cleanupInternalElements(this.cloneValue, this.editorMode)) {
            if (this.enableXhtml) {
                this.valueContainer.value = this.getXhtmlString(this.valueContainer.value);
            }
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
        if (this.editorMode === 'HTML' && (this.iframeSettings && this.iframeSettings.enable)) {
            this.contentPanel = this.element.querySelector('iframe');
            this.updateIframeHtmlContents();
        } else {
            this.contentPanel = this.element.querySelector('.e-rte-content');
        }
    }
    private iframeHeader(): string {
        return `
            <!DOCTYPE html> 
            <html>
                 <head>
                    <meta charset='utf-8' /> 
                    <style> ` +
            this.getEditorStyles() + `
                    </style>
                </head>
        `;
    }
    /* Gets editor styles with theme-specific styling */
    private getEditorStyles(): string {
        // Get base editor styles
        const baseStyles: string = IFRAME_EDITOR_STYLES.replace(/[\n\t]/g, '');
        // Detect theme
        const themeStyle: CSSStyleDeclaration = window.getComputedStyle(this.element.querySelector('.e-rte-container'));
        const isDarkTheme: boolean = themeStyle.content.includes('dark-theme');
        // Select theme styles based on current theme
        const themeStyles: string = (isDarkTheme ?
            IFRAME_EDITOR_DARK_THEME_STYLES :
            IFRAME_EDITOR_LIGHT_THEME_STYLES).replace(/[\n\t]/g, '');
        // Return combined styles
        return baseStyles + themeStyles;
    }
    private updateIframeHtmlContents(): void {
        let iFrameContent: string = this.iframeHeader() + '<body contenteditable="true"></body></html>';
        const iframe: HTMLIFrameElement = this.contentPanel as HTMLIFrameElement;
        iframe.srcdoc = iFrameContent;
        iframe.setAttribute('role', 'none');
        iframe.contentDocument.open();
        iFrameContent = this.setThemeColor(iFrameContent, { color: '#333' });
        iframe.contentDocument.write(iFrameContent);
        iframe.contentDocument.close();
        iframe.contentDocument.body.id = this.id + '_rte-edit-view';
        iframe.contentDocument.body.className = 'e-content';
        if (!isNOU(iframe.contentDocument.head) && (this.iframeSettings.metaTags as Array<MetaTag>).length > 0) {
            const head: HTMLHeadElement = iframe.contentDocument.head;
            const metaData: Array<MetaTag> = this.iframeSettings.metaTags;
            metaData.forEach((tag: MetaTag) => {
                const meta: HTMLElement = document.createElement('meta');
                for (const key in tag) {
                    if (!isNOU(tag[key as keyof MetaTag])) {
                        meta.setAttribute((key === 'httpEquiv') ? 'http-equiv' : key, tag[key as keyof MetaTag] as string);
                    }
                }
                head.appendChild(meta);
            });
        }
    }
    private setThemeColor(content: string, styles: { [key: string]: string }): string {
        return content.replace(styles.color, getComputedStyle(this.element, '.e-richtexteditor').getPropertyValue('color'));
    }
    public refresh(e: NotifyArgs = { requestType: 'refresh' }): void {
        this.observer.notify(`${e.requestType}-begin`, e);
    }
    public openPasteDialog(): void {
        this.dotNetRef.invokeMethodAsync('PasteDialog');
    }
    public getXhtml(): string {
        let currentValue: string = cleanupInternalElements(this.value, this.editorMode);
        if (this.enableXhtml) {
            currentValue = this.htmlEditorModule.xhtmlValidation.selfEncloseValidation(currentValue);
        }
        return currentValue;
    }
    public getXhtmlString(val: string): string {
        return this.htmlEditorModule.xhtmlValidation.selfEncloseValidation(val);
    }
    public getPanel(): Element {
        return this.contentPanel;
    }
    public removeResizeElement(value: string): string {
        return cleanupInternalElements(value, this.editorMode);
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
        if (this.enableXhtml && !isNOU(val)) {
            val = this.getXhtmlString(val);
        }
        this.valueContainer.value = val;
        if (this.value !== cleanupInternalElements(this.cloneValue, this.editorMode)) {
            dispatchEvent(this.valueContainer, 'change');
        }
    }
    private getInputInnerHtml(): string {
        return this.inputElement.innerHTML.replace(/<!--!-->/gi, '');
    }
    public refreshUI(): void {
        this.refresh();
        // when the editor mode is markdown or iframe, need to set the height manually
        if (this.editorMode === 'Markdown' || this.iframeSettings.enable) {
            this.autoResize();
        }
    }
    private getUpdatedValue(): string {
        let value: string;
        const getTextArea: HTMLInputElement = this.element.querySelector('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA);
        if (this.editorMode === 'HTML') {
            const inputContent: string = this.getInputInnerHtml();
            value = (inputContent === getDefaultValue(this)) ? null : this.enableHtmlEncode ?
                this.encode(decode(this.removeResizeElement(inputContent))) : inputContent;
            if (this.enableHtmlSanitizer && !isNOU(value) && /&(amp;)*((times)|(divide)|(ne))/.test(this.value)) {
                value = value.replace(/&(amp;)*(times|divide|ne)/g, '&amp;amp;$2');
            }
            if (!isNOU(getTextArea) && this.rootContainer.classList.contains('e-source-code-enabled')) {
                const textAreaValue: string = this.enableHtmlSanitizer ? this.htmlEditorModule.sanitizeHelper(
                    getTextArea.value) : getTextArea.value;
                value = cleanHTMLString((/&(amp;)*((times)|(divide)|(ne))/.test(textAreaValue) ? textAreaValue.replace(/&(amp;)*(times|divide|ne)/g, '&amp;amp;$2') : textAreaValue), this.element);
            }
            value = cleanupInternalElements(value, this.editorMode);
        } else {
            value = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                (this.inputElement as HTMLTextAreaElement).value;
        }
        if (value != null && !this.enableHtmlEncode) {
            value = this.removeResizeElement(value);
        }
        return value;
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
                removeClass([this.getToolbar().parentElement], [classes.CLS_TB_FLOAT]);
            }
            addClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
            this.inputElement.setAttribute('tabindex', '-1');
        }
    }
    public setEnable(): void {
        this.updateEnable();
        if (this.enabled) {
            this.wireEvents();
        } else {
            this.unWireEvents();
        }
    }
    public executeCommand(
        commandName: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | IAudioCommandsArgs | IVideoCommandsArgs | ICodeBlockCommandsArgs,
        option?: ExecuteCommandOption): void {
        if (commandName === 'importWord') {
            const importContainer: HTMLElement = createElement('div');
            importContainer.innerHTML = value as string;
            const tableElement: NodeListOf<HTMLElement> = importContainer.querySelectorAll('table:not(.e-rte-table):not(.e-rte-paste-table)');
            for (let i: number = 0; i < tableElement.length; i++) {
                tableElement[i as number].classList.add('e-rte-paste-table');
            }
            value = importContainer.innerHTML;
            importContainer.remove();
            commandName = 'insertHTML';
        }
        value = this.htmlPurifier(commandName, value);
        let internalValue: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | FormatPainterSettingsModel |
        ICodeBlockCommandsArgs | IListCommandArgs;
        if (this.editorMode === 'HTML') {
            const range: Range = this.getRange();
            if (this.iframeSettings.enable) {
                this.formatter.editorManager.nodeSelection.Clear(this.element.ownerDocument);
            }
            const toFocus: boolean = (this.iframeSettings.enable &&
                range.startContainer === this.inputElement) ? true : !this.inputElement.contains(range.startContainer);
            if (toFocus) {
                this.focusIn();
            }
        }
        const tool: IExecutionGroup = executeGroup[commandName as CommandName];
        if (option && option.undo) {
            if (option.undo && this.formatter.getUndoRedoStack().length === 0) {
                this.formatter.saveData();
            }
        }
        internalValue = value;
        if (tool.command === 'CodeBlock' && !isNOU(value)) {
            (value as ICodeBlockItem).action = 'createCodeBlock';
        }
        if ((tool.subCommand === 'NumberFormatList' || tool.subCommand === 'BulletFormatList')) {
            internalValue = { listStyle: value, type: tool.subCommand };
        }
        this.formatter.editorManager.execCommand(
            tool.command,
            tool.subCommand ? tool.subCommand : (value ? value : tool.value),
            null,
            null,
            (value ? value : tool.value),
            (internalValue ? internalValue : (tool.value === 'UL' || tool.value === 'OL') ? null : tool.value)
        );
        scrollToCursor(this.getDocument(), this.inputElement);
        if (option && option.undo) {
            this.formatter.saveData();
            this.formatter.enableUndo(this);
        }
        this.setPlaceHolder();
        this.observer.notify(events.contentChanged, {});
        this.value = this.inputElement.innerHTML;
        this.dotNetRef.invokeMethodAsync('UpdateValue', this.value);
    }
    private htmlPurifier(
        command: CommandName, value?: string | HTMLElement | ILinkCommandsArgs |
        IImageCommandsArgs | ITableCommandsArgs | ICodeBlockCommandsArgs): string {
        let href: string;
        let linkValue: string;
        let tempNode: HTMLElement;
        let imageValue: string;
        let url: string;
        let temp: HTMLElement;
        if (this.editorMode === 'HTML') {
            switch (command) {
            case 'insertHTML':
                if (this.enableHtmlSanitizer) {
                    if (typeof value === 'string') {
                        value = value.replace(/&(times|divide|ne)/g, '&amp;amp;$1');
                        value = this.htmlEditorModule.sanitizeHelper(value);
                    } else {
                        value = this.htmlEditorModule.sanitizeHelper((value as HTMLElement).outerHTML);
                    }
                }
                break;
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
                temp = createElement('img', {
                    attrs: {
                        src: (value as IImageCommandsArgs).url as string
                    }
                });
                imageValue = temp.outerHTML;
                url = (imageValue !== '' && (createElement('div', {
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
                tempNode = createElement('a', {
                    attrs: {
                        href: (value as ILinkCommandsArgs).url as string
                    }
                });
                linkValue = tempNode.outerHTML;
                href = (linkValue !== '' && (createElement('div', {
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
    /**
     * Image max width calculation method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getInsertImgMaxWidth(): string | number {
        const maxWidth: string | number = this.insertImageSettings.maxWidth;
        // eslint-disable-next-line
        const imgPadding: number = 12
        const imgResizeBorder: number = 2;
        let editEle: HTMLElement = this.getEditPanel() as HTMLElement;
        if (this.editorMode === 'HTML' && !isNOU(this.formatter.editorManager.nodeSelection) && !isNOU(this.formatter.editorManager.nodeSelection.range)) {
            const currentRange: Range = this.formatter.editorManager.nodeSelection.range;
            if (currentRange.startContainer.nodeType !== 3 && (currentRange.startContainer as HTMLElement).closest &&
                !isNOU((currentRange.startContainer as HTMLElement).closest('TD'))) {
                editEle = currentRange.startContainer as HTMLElement;
            }
        }
        const eleStyle: CSSStyleDeclaration = window.getComputedStyle(editEle);
        const editEleMaxWidth: number = editEle.offsetWidth - (imgPadding + imgResizeBorder +
            parseFloat(eleStyle.paddingLeft.split('px')[0]) + parseFloat(eleStyle.paddingRight.split('px')[0]) +
            parseFloat(eleStyle.marginLeft.split('px')[0]) + parseFloat(eleStyle.marginRight.split('px')[0]));
        return isNOU(maxWidth) ? editEleMaxWidth : maxWidth;
    }
    public serializeValue(value: string): string {
        if (this.editorMode === 'HTML' && !isNOU(value)) {
            value = cleanHTMLString(value, this.element);
            if (!this.enableXhtml) {
                value = getStructuredHtml(value, this.enterKey, this.enableHtmlEncode);
            }
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
    public clipboardAction(action: string, event: MouseEvent | KeyboardEvent | ClipboardEvent): void {
        switch (action.toLowerCase()) {
        case 'cut':
            this.onCut(event);
            this.formatter.onSuccess(this, {
                requestType: 'Cut',
                editorMode: this.editorMode,
                event: event
            });
            break;
        case 'copy':
            this.onCopy(event);
            this.formatter.onSuccess(this, {
                requestType: 'Copy',
                editorMode: this.editorMode,
                event: event
            });
            break;
        case 'paste':
            this.onPaste(event as ClipboardEvent);
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
        const containerElm: HTMLElement = createElement('div');
        const selection: Selection = this.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            const selectedHtml: DocumentFragment = range.cloneContents();
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
            if (isNOU(closest(currentRange.startContainer.parentNode, '.e-content'))) {
                this.inputElement.focus();
                currentRange = this.getRange();
            }
            const targetElm: HTMLElement = currentRange.endContainer.nodeName === '#text' ?
                currentRange.endContainer.parentElement : currentRange.endContainer as HTMLElement;
            let rects: DOMRect[] = Array.from(currentRange.getClientRects(), (rect: DOMRect) => rect as DOMRect);
            if (rects.length === 0) {
                rects = [(currentRange.startContainer as HTMLElement).getBoundingClientRect() as DOMRect];
            }
            if (rects.length > 0) {
                this.quickToolbarModule.showInlineQTBar(targetElm, null);
            }
        }
    }
    public hideInlineToolbar(): void {
        this.quickToolbarModule.hideInlineQTBar();
    }
    public updateValueData(): void {
        if (this.enableHtmlEncode) {
            this.setPanelValue(this.encode(decode(this.inputElement.innerHTML)));
        } else {
            const value: string = /<[a-z][\s\S]*>/i.test(this.inputElement.innerHTML) ? this.inputElement.innerHTML :
                decode(this.inputElement.innerHTML);
            this.setPanelValue(value);
        }
    }
    private removeSheets(srcList: Element[]): void {
        let i: number;
        for (i = 0; i < srcList.length; i++) {
            detach(srcList[i as number]);
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
                this.unBindEvents();
                this.bindEvents();
            }
        }
    }
    private setIframeSettings(): void {
        if (this.iframeSettings.resources) {
            const styleSrc: string[] = this.iframeSettings.resources.styles;
            const scriptSrc: string[] = this.iframeSettings.resources.scripts;
            if (!isNOU(this.iframeSettings.resources.styles) && this.iframeSettings.resources.styles.length > 0) {
                this.InjectSheet(false, styleSrc);
            }
            if (!isNOU(this.iframeSettings.resources.scripts) && this.iframeSettings.resources.scripts.length > 0) {
                this.InjectSheet(true, scriptSrc);
            }
        }
        if (this.iframeSettings.attributes) {
            setAttributes(this.iframeSettings.attributes, this, true, false);
        }
        if (this.iframeSettings.enable && this.enableRtl) {
            this.inputElement.classList.add('e-rtl');
        } else if (this.iframeSettings.enable && !this.enableRtl) {
            if (this.inputElement.hasAttribute('class')) {
                if (this.inputElement.classList.contains('e-rtl')) {
                    this.inputElement.classList.remove('e-rtl');
                }
            }
        }
    }
    private InjectSheet(scriptSheet: boolean, srcList: string[]): void {
        try {
            if (srcList && srcList.length > 0) {
                const iFrame: HTMLDocument = this.getDocument();
                const target: HTMLElement = iFrame.querySelector('head');
                for (let i: number = 0; i < srcList.length; i++) {
                    if (scriptSheet) {
                        const scriptEle: HTMLScriptElement = this.createScriptElement();
                        scriptEle.src = srcList[i as number];
                        target.appendChild(scriptEle);
                    } else {
                        const styleEle: HTMLLinkElement = this.createStyleElement();
                        styleEle.href = srcList[i as number];
                        target.appendChild(styleEle);
                    }
                }
            }
        } catch (e) {
            return;
        }
    }
    private createScriptElement(): HTMLScriptElement {
        const scriptEle: HTMLScriptElement = createElement('script', {
            className: classes.CLS_SCRIPT_SHEET
        }) as HTMLScriptElement;
        scriptEle.type = 'text/javascript';
        return scriptEle;
    }

    private createStyleElement(): HTMLLinkElement {
        const styleEle: HTMLLinkElement = createElement('link', {
            className: classes.CLS_STYLE_SHEET
        }) as HTMLLinkElement;
        styleEle.rel = 'stylesheet';
        return styleEle;
    }

    private updateResizeFlag(): void {
        this.isResizeInitialized = true;
    }
    public getHtml(): string {
        return this.serializeValue(cleanupInternalElements((this.getEditPanel() as HTMLElement).innerHTML, this.editorMode));
    }
    public showSourceCode(): void {
        if (this.readonly) { return; }
        this.observer.notify(events.sourceCode, {});
    }
    public getCharCount(): number {
        const htmlText: string = this.editorMode === 'Markdown' ? (this.getEditPanel() as HTMLTextAreaElement).value.trim() :
            (this.getEditPanel() as HTMLElement).textContent.trim();
        let htmlLength: number;
        if (this.editorMode !== 'Markdown' && htmlText.indexOf('\u200B') !== -1) {
            htmlLength = htmlText.replace(/\u200B/g, '').length;
        } else {
            htmlLength = htmlText.length;
        }
        return htmlLength;
    }
    public focusOut(): void {
        if (this.enabled) {
            this.inputElement.blur();
            this.blurHandler({} as FocusEvent);
        }
    }
    public getToolbar(): HTMLElement {
        if (this.inlineMode.enable) {
            return this.element.querySelector('#' + this.id + '_Inline_Quick_Popup');
        } else {
            return this.toolbarSettings.enable ? this.element.querySelector('#' + this.id + '_toolbar') : null;
        }
    }
    public getToolbarElement(): Element {
        if (this.inlineMode.enable) {
            return this.element.querySelector('#' + this.id + '_Inline_Quick_Popup');
        } else {
            return this.toolbarSettings.enable ? this.element.querySelector('#' + this.id + '_toolbar') : null;
        }
    }
    private updateIntervalValue(): void {
        clearTimeout(this.idleInterval);
        this.idleInterval = setTimeout(this.updateValueOnIdle.bind(this), 0);
    }
    private updateValueOnIdle(): void {
        if (!isNOU(this.tableModule) && !isNOU(this.inputElement.querySelector('.e-table-box.e-rbox-select'))) { return; }
        this.value = this.getUpdatedValue();
        this.updateValueContainer(this.value);
        this.invokeChangeEvent();
    }
    public invokeChangeEvent(): void {
        if (this.enableXhtml && !isNOU(this.value)) {
            this.value = this.getXhtml();
        }
        if (this.value !== cleanupInternalElements(this.cloneValue, this.editorMode)) {
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
    /**
     * Returns the CSS class.
     *
     * @param {boolean} [isSpace] - Specifies whether to include a space before the CSS class.
     * @returns {string} The CSS class.
     * @hidden
     * @deprecated
     */
    public getCssClass(isSpace?: boolean): string {
        return (isNOU(this.cssClass) ? '' : isSpace ? ' ' + this.cssClass : this.cssClass);
    }
    public preventDefaultResize(e: FocusEvent | MouseEvent, isDefault: boolean): void {
        if (Browser.info.name === 'msie') {
            if (isDefault) {
                this.getEditPanel().removeEventListener('mscontrolselect', this.preventImgResize);
            } else {
                this.getEditPanel().addEventListener('mscontrolselect', this.preventImgResize);
            }
        } else if (Browser.info.name === 'mozilla') {
            const value: string = isDefault ? 'true' : 'false';
            this.getDocument().execCommand('enableObjectResizing', isDefault, value);
            this.getDocument().execCommand('enableInlineTableEditing', isDefault, value);
        }
    }
    public encode(value: string): string {
        const divNode: HTMLElement = document.createElement('div');
        divNode.innerText = value.trim();
        return divNode.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    }
    public print(): void {
        let printWind: Window;
        const printArgs: PrintEventArgs = {
            requestType: 'print',
            cancel: false
        };
        (this.dotNetRef.invokeMethodAsync('ActionBeginEvent', printArgs) as unknown as Promise<PrintEventArgs>).then((printingArgs: PrintEventArgs) => {
            printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
            if (Browser.info.name === 'msie') { printWind.resizeTo(screen.availWidth, screen.availHeight); }
            printWind = printWindow(this.inputElement, printWind);
            if (!printingArgs.cancel) {
                const actionArgs: ActionCompleteEventArgs = {
                    requestType: 'print'
                };
                this.dotNetRef.invokeMethodAsync('ActionCompleteEvent', actionArgs);
            }
        });
    }
    public autoResize(): void {
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                this.setAutoHeight(this.inputElement);
            } else if (this.iframeSettings.enable) {
                const iframeElement: HTMLIFrameElement = this.contentPanel as HTMLIFrameElement;
                if (iframeElement) {
                    this.setAutoHeight(iframeElement);
                }
            }
        } else {
            if (this.editorMode === 'Markdown') {
                const textArea: HTMLTextAreaElement = this.inputElement as HTMLTextAreaElement;
                const otherElemHeight: number = (this.enableResize || this.showCharCount) ? 20 : 0;
                // Three added because of border top of the e-rte-container, bottom of the toolbar wrapper and then bottom of the e-rte-container.
                if (textArea) {
                    textArea.style.height = this.element.clientHeight - (this.toolbarModule.getToolbarHeight() + otherElemHeight + 3) + 'px';
                }
            } else if (this.iframeSettings.enable) {
                const iframe: HTMLIFrameElement = this.contentPanel as HTMLIFrameElement;
                const otherElemHeight: number = (this.enableResize || this.showCharCount) ? 20 : 0;
                // Three added because of border top of the e-rte-container, bottom of the toolbar wrapper and then bottom of the e-rte-container.
                if (iframe) {
                    iframe.style.height = this.element.clientHeight - (this.toolbarModule.getToolbarHeight() + otherElemHeight + 3) + 'px';
                }
            }
        }
    }
    private setAutoHeight(element: HTMLElement): void {
        if (element.nodeName === 'TEXTAREA') {
            element.style.height = 'auto';
            element.style.height = (this.inputElement.scrollHeight + 16) + 'px';
            element.style.overflow = 'hidden';
        } else if (element.nodeName === 'IFRAME') {
            element.style.height = this.inputElement.parentElement.offsetHeight + 'px';
        }
    }
    public restrict(e: MouseEvent | KeyboardEvent): void {
        if (this.maxLength >= 0) {
            const element: string = this.editorMode === 'Markdown' ? this.getText() :
                (this.getText().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, ''));
            const array: number[] = [8, 16, 17, 37, 38, 39, 40, 46, 65];
            let arrayKey: number;
            for (let i: number = 0; i <= array.length - 1; i++) {
                if ((e as MouseEvent).which === array[i as number]) {
                    if ((e as MouseEvent).ctrlKey && (e as MouseEvent).which === 65) {
                        return;
                    } else if ((e as MouseEvent).which !== 65) {
                        arrayKey = array[i as number];
                        return;
                    }
                }
            }
            if ((element.length >= this.maxLength && this.maxLength !== -1) && (e as MouseEvent).which !== arrayKey) {
                (e as MouseEvent).preventDefault();
            }
        }
    }
    private beforeInputHandler(e: BeforeInputEvent): void {
        if (this.maxLength >= 0) {
            const element: string = this.editorMode === 'Markdown' ? this.getText() :
                (this.getText().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, ''));
            if (e.data && element.length >= this.maxLength && !this.isSpecialInputType(e)) {
                e.preventDefault();
            }
        }
    }
    private isSpecialInputType(e: BeforeInputEvent): boolean {
        const allowedKeys: number[] = [8, 16, 17, 37, 38, 39, 40, 46, 65];
        if (e.inputType) {
            return (
                e.inputType.indexOf('delete') !== -1 ||
                e.inputType.indexOf('backward') !== -1 ||
                e.inputType === 'insertLineBreak'
            );
        }
        return allowedKeys.indexOf((e as any).which) !== -1;
    }
    public setPlaceHolder(): void {
        if (this.inputElement && this.placeholder && this.iframeSettings.enable !== true) {
            if (this.editorMode !== 'Markdown') {
                if (!this.placeHolderContainer) {
                    this.placeHolderContainer = this.element.querySelector('.e-rte-placeholder');
                }
                this.placeHolderContainer.innerHTML = this.placeholder;
                if (this.inputElement.textContent.length === 0 && this.inputElement.childNodes.length < 2 && !isNOU(this.inputElement.firstChild) && (this.inputElement.firstChild.nodeName === 'BR' ||
                    ((this.inputElement.firstChild.nodeName === 'P' || this.inputElement.firstChild.nodeName === 'DIV') && !isNOU(this.inputElement.firstChild.firstChild) &&
                        this.inputElement.firstChild.firstChild.nodeName === 'BR'))) {
                    this.placeHolderContainer.classList.add('e-placeholder-enabled');
                    EventHandler.add(this.inputElement as HTMLElement, 'input', this.setPlaceHolder, this);
                } else {
                    this.placeHolderContainer.classList.remove('e-placeholder-enabled');
                    EventHandler.remove(this.inputElement as HTMLElement, 'input', this.setPlaceHolder);
                }
            } else {
                this.inputElement.setAttribute('placeholder', this.placeholder);
            }
        }
        if (this.placeholder && this.iframeSettings.enable && this.inputElement) {
            if (this.inputElement.textContent.length === 0 && this.inputElement.childNodes.length < 2 && !isNOU(this.inputElement.firstChild) && (this.inputElement.firstChild.nodeName === 'BR' ||
                ((this.inputElement.firstChild.nodeName === 'P' || this.inputElement.firstChild.nodeName === 'DIV') && !isNOU(this.inputElement.firstChild.firstChild) &&
                    this.inputElement.firstChild.firstChild.nodeName === 'BR'))) {
                addClass([this.inputElement], 'e-rte-placeholder');
                this.inputElement.setAttribute('placeholder', this.placeholder);
                EventHandler.add(this.inputElement as HTMLElement, 'input', this.setPlaceHolder, this);
            } else {
                removeClass([this.inputElement], 'e-rte-placeholder');
                EventHandler.remove(this.inputElement as HTMLElement, 'input', this.setPlaceHolder);
            }
        }
    }
    private replaceEntities(value: string): string {
        if (this.editorMode !== 'HTML' || isNOU(value) || !/&(amp;)*((times)|(divide)|(ne))/.test(value)) {
            return value === ' ' ? '<p><br></p>' : value;
        }
        const isEncodedOrSanitized: boolean = this.enableHtmlEncode || this.enableHtmlSanitizer;
        const createReplacement: (entity: string) => [string, RegExp] = (entity: string): [string, RegExp] => {
            const replacement: string = isEncodedOrSanitized ? `&amp;amp;${entity}` : `&amp;${entity}`;
            const regexPattern: string = (!this.enableHtmlEncode && this.enableHtmlSanitizer)
                ? `&(${entity})`
                : `&(amp;)*(${entity})`;
            const regExp: RegExpConstructor = RegExp;
            const regex: RegExp = new regExp(regexPattern, 'g');
            return [replacement, regex];
        };
        const entities: string[] = ['times', 'divide', 'ne'];
        const replacementsAndRegexes: [string, RegExp][] = entities.map(createReplacement);
        for (const [replacement, regex] of replacementsAndRegexes) {
            if (regex.test(value)) {
                value = value.replace(regex, replacement);
            }
        }
        return value;
    }
    public updatePanelValue(rtevalue: string, containerValue: string): void {
        let value: string = this.replaceEntities(this.value);
        value = (this.enableHtmlEncode && rtevalue) ? decode(value) : value;
        value = cleanupInternalElements(value, this.editorMode);
        const getTextArea: HTMLInputElement = this.element.querySelector('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA);
        if (value) {
            if (!isNOU(getTextArea) && this.rootContainer.classList.contains('e-source-code-enabled')) {
                getTextArea.value = alignmentHtml(rtevalue);
            }
            if (this.valueContainer) {
                this.valueContainer.value = containerValue === '' ? '' : (this.enableHtmlEncode) ? rtevalue : value;
            }
            if (this.editorMode === 'HTML' && this.inputElement && this.inputElement.innerHTML.trim() !== value.trim()) {
                this.inputElement.innerHTML = resetContentEditableElements(value, this.editorMode);
            } else if (this.editorMode === 'Markdown' && this.inputElement
                && (this.inputElement as HTMLTextAreaElement).value.trim() !== value.trim()) {
                (this.inputElement as HTMLTextAreaElement).value = value;
            }
        } else {
            if (!isNOU(getTextArea) && this.rootContainer.classList.contains('e-source-code-enabled')) {
                getTextArea.value = '';
            }
            if (this.editorMode === 'HTML') {
                this.inputElement.innerHTML = resetContentEditableElements(getDefaultValue(this), this.editorMode);
            } else {
                (this.inputElement as HTMLTextAreaElement).value = '';
            }
            if (this.valueContainer) {
                this.valueContainer.value = '';
            }
        }
        if (this.showCharCount && this.countModule) {
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
        const touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        this.observer.notify(events.mouseUp, {
            member: 'mouseUp', args: e,
            touchData: {
                prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY
            }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && ((this.inputElement.textContent.length !== 0) || (e.target && !isNOU((e.target as HTMLElement).querySelector('li'))))) ||
            (this.editorMode === 'Markdown' && (this.inputElement as HTMLTextAreaElement).value.length !== 0))) {
            this.observer.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
        if (this.editorMode === 'HTML') {
            this.focusHR(e);
        }
    }
    private triggerEditArea(e: MouseEvent | TouchEvent): void {
        if (!(Browser.isDevice && Browser.isIos)) {
            this.observer.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
        } else {
            const touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
            if (this.clickPoints.clientX === touch.clientX && this.clickPoints.clientY === touch.clientY) {
                this.observer.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
            }
        }
    }
    private focusHR(e: MouseEvent | TouchEvent): void {
        if ((e.target as HTMLElement).tagName === 'HR') {
            (e.target as HTMLElement).classList.add('e-rte-hr-focus');
        }
    }
    private updateStatus(e: StatusArgs): void {
        if (!isNOU(e.html) || !isNOU(e.markdown)) {
            const status: { [key: string]: boolean } = this.formatter.editorManager.undoRedoManager.getUndoStatus();
            this.dotNetRef.invokeMethodAsync(events.updatedToolbarStatusEvent, {
                undo: status.undo,
                redo: status.redo,
                html: e.html,
                markdown: e.markdown
            });
        }
    }
    //#endregion
    //#region Interop interaction methods
    public splitButtonClicked(args: ToolbarClickEventArgs): void {
        if (isNOU(args)) {
            return;
        }
        if (this.editorMode === 'HTML') {
            this.observer.notify(events.htmlToolbarClick, args);
        }
    }
    public toolbarCreated(): void {
        if (this.userAgentData.isSafari()) {
            setTimeout((): void => {
                const extendedToolbarElement: HTMLElement = this.getToolbarElement() ? this.getToolbarElement().querySelector('#' + this.id + '_toolbar_nav') : null;
                if (extendedToolbarElement) {
                    if (this.toolbarSettings.type === 'Expand' || this.toolbarSettings.type === 'Popup') {
                        EventHandler.add(extendedToolbarElement, 'mousedown', this.extendedToolbarMouseDownHandler, this);
                        EventHandler.add(extendedToolbarElement, 'click', this.extendedToolbarClickHandler, this);
                    } else {
                        EventHandler.remove(extendedToolbarElement, 'mousedown', this.extendedToolbarMouseDownHandler);
                        EventHandler.remove(extendedToolbarElement, 'click', this.extendedToolbarClickHandler);
                    }
                }
            }, 40);
        }
    }
    private extendedToolbarMouseDownHandler(): void {
        if (this.userAgentData.isSafari()) {
            this.observer.notify(events.selectionSave, {});
        }
    }
    private extendedToolbarClickHandler(): void {
        if (this.userAgentData.isSafari()) {
            this.observer.notify(events.selectionRestore, {});
        }
    }
    public toolbarItemClick(args: ToolbarClickEventArgs, id: string, targetType: string): void {
        const isSourceCodeOrPreview: boolean = isNOU(args) ? true : !(args.requestType === 'Preview' || args.requestType === 'SourceCode');
        if (isSourceCodeOrPreview && this.userAgentData.isSafari() && this.formatter.editorManager.nodeSelection &&
            !this.inputElement.contains(this.getRange().startContainer)) {
            this.observer.notify(events.selectionRestore, {});
        }
        if (isNOU(args)) { return; }
        let target: Element;
        const hasTextQBT: boolean = !isNOU(this.quickToolbarModule.textQTBar) && !isNOU(this.quickToolbarModule.textQTBar.element)
            && this.quickToolbarModule.textQTBar.element &&
            this.quickToolbarModule.textQTBar.element.classList.contains('e-popup-open');
        if (targetType === 'Root' && !this.inlineMode.enable && !hasTextQBT) {
            target = select('#' + id, this.element);
        } else {
            target = select('#' + id, document.body);
            if (hasTextQBT && target && target.parentElement && target.parentElement.classList && target.parentElement.classList.contains('e-rte-text-popup')) {
                target = target.parentElement;
            }
        }
        args.originalEvent = { ...args.originalEvent, target: target };
        if (this.inlineCloseItems.indexOf(args.item.subCommand) > -1) {
            this.quickToolbarModule.hideInlineQTBar();
            if (hasTextQBT) {
                this.quickToolbarModule.hideTextQTBar();
            }
        }
        if (this.editorMode === 'HTML') {
            this.observer.notify(events.htmlToolbarClick, args);
        } else {
            this.observer.notify(events.markdownToolbarClick, args);
        }
    }
    public hideTableQuickToolbar(): void {
        this.quickToolbarModule.hideTableQTBar();
    }
    public dropDownBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if ((this.formatter.editorManager.markdownSelection && this.formatter.editorManager.markdownSelection.selectionStart) ||
            (this.formatter.editorManager.nodeSelection && this.inputElement.contains(this.getRange().startContainer))) {
            this.observer.notify(events.selectionSave, args);
        }
        this.observer.notify(events.beforeDropDownOpen, args);
        this.observer.notify(events.hideToolTip, { target: args.element });
    }
    public dropDownBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        if (args.element && (args.element.classList && args.element.classList.contains('e-quick-dropdown') || args.element.closest('.e-rte-quick-popup'))) {
            this.observer.notify(events.preventQuickToolbarClose, this.quickToolbarModule);
        }
        this.observer.notify(events.beforeDropDownClose);
    }
    public splitButtonAfterOpen(args: OpenCloseMenuEventArgs): void {
        const range: Range = this.getRange();
        const startContainer: Element = this.formatter.editorManager.codeBlockObj
            .isValidCodeBlockStructure(range.startContainer);
        const endContainer: Element = this.formatter.editorManager.codeBlockObj.
            isValidCodeBlockStructure(range.endContainer);
        const codeBlock: boolean = !isNOU(startContainer) || !isNOU(endContainer);
        const codeBlockElement: Element = startContainer || endContainer;
        let currentLanguage: string = '';
        if (codeBlock) {
            currentLanguage = (codeBlockElement as Element).getAttribute('data-language') || '';
            const listItems: NodeListOf<HTMLLIElement> = args.element.querySelectorAll('li');
            for (let i: number = 0; i < listItems.length; i++) {
                const itemLanguage: string = listItems[i as number].getAttribute('data-language') || listItems[i as number].textContent.toLowerCase();
                if (currentLanguage.toLowerCase() === itemLanguage) {
                    addClass([listItems[i as number] as HTMLElement], 'e-active');
                } else {
                    removeClass([listItems[i as number] as HTMLElement], 'e-active');
                }
            }
        }
    }
    public dropDownAfterOpen(args: OpenCloseMenuEventArgs, items: IDropDownItemModel[]): void {
        if (this.editorMode !== 'Markdown') {
            const startNode: HTMLElement = this.getRange().startContainer.parentElement;
            // Table styles
            const tableElement: HTMLTableElement | null = startNode.closest('table');
            const trElement: HTMLTableRowElement | null = startNode.closest('tr');
            const tabContainer: HTMLElement = args.element.firstChild as HTMLElement;
            if (tableElement !== null) {
                for (let index: number = 0; index < tabContainer.childNodes.length; index++) {
                    const childNode: HTMLElement = tabContainer.children[index as number] as HTMLElement;
                    if (tableElement.classList.contains('e-dashed-border') && childNode.classList.contains('e-dashed-borders')) {
                        addClass([childNode], 'e-active');
                    } else if (!tableElement.classList.contains('e-dashed-border') && childNode.classList.contains('e-dashed-borders')) {
                        removeClass([childNode], 'e-active');
                    }
                    if (tableElement.classList.contains('e-alternate-rows') && trElement !== null && window.getComputedStyle(trElement).backgroundColor !== ''
                        && childNode.classList.contains('e-alternate-rows')) {
                        addClass([childNode], 'e-active');
                    } else if (!tableElement.classList.contains('e-alternate-rows') && childNode.classList.contains('e-alternate-rows')) {
                        removeClass([childNode], 'e-active');
                    }
                }
            }
            //list preselect
            const listElem: Element = startNode.closest('LI');
            const currentLiElem: HTMLElement = !isNOU(listElem) ? listElem.parentElement : null;
            const currentAction: string = (items[0 as number] as IDropDownItemModel).subCommand;
            if (!isNOU(currentLiElem)) {
                const validNumberFormatAction: boolean = (currentAction === 'NumberFormatList' && currentLiElem.nodeName === 'OL');
                const validBulletFormatAction: boolean = (currentAction === 'BulletFormatList' && currentLiElem.nodeName === 'UL');
                if (validNumberFormatAction || validBulletFormatAction) {
                    let currentListStyle: string = currentLiElem.style.listStyleType.split('-').join('').toLocaleLowerCase();
                    currentListStyle = currentListStyle === 'decimal' ? 'number' : currentListStyle;
                    for (let index: number = 0; index < args.element.firstElementChild.childNodes.length; index++) {
                        if (currentListStyle === (args.element.firstElementChild.childNodes[index as number] as HTMLElement).innerHTML.split(' ').join('').toLocaleLowerCase()) {
                            addClass([args.element.firstElementChild.childNodes[index as number]] as Element[], 'e-active');
                            break;
                        } else if (currentListStyle === '' && ((args.element.firstElementChild.childNodes[index as number] as HTMLElement).innerHTML === 'Number' || (args.element.firstElementChild.childNodes[index as number] as HTMLElement).innerHTML === 'Disc') ) {
                            addClass([args.element.firstElementChild.childNodes[index as number]] as Element[], 'e-active');
                            break;
                        }
                    }
                }
            }
            //Alignments preselect
            let alignEle: Node = this.getRange().startContainer;
            while (alignEle !== this.inputElement && !isNOU(alignEle.parentElement)) {
                if (alignEle.nodeName === '#text') {
                    alignEle = alignEle.parentElement;
                }
                const alignStyle: string = window.getComputedStyle(alignEle as HTMLElement).textAlign;
                if ((items[0 as number]).command === 'Alignments') {
                    args.element.firstChild.childNodes.forEach((node: Element) => removeClass([node], 'e-active'));
                    if ((items[0 as number].text === 'Align Left' && (alignStyle === 'left') || alignStyle === 'start')) {
                        addClass([args.element.firstChild.childNodes[0 as number]] as Element[], 'e-active');
                        break;
                    }
                    else if (items[1 as number].text === 'Align Center' && alignStyle === 'center') {
                        addClass([args.element.firstChild.childNodes[1 as number]] as Element[], 'e-active');
                        break;
                    }
                    else if (items[2 as number].text === 'Align Right' && alignStyle === 'right') {
                        addClass([args.element.firstChild.childNodes[2 as number]] as Element[], 'e-active');
                        break;
                    }
                    else if (items[3 as number].text === 'Align Justify' && alignStyle === 'justify') {
                        addClass([args.element.firstChild.childNodes[3 as number]] as Element[], 'e-active');
                        break;
                    }
                }
                alignEle = alignEle.parentElement;
            }
            //Image preselect
            const closestNode: HTMLElement = startNode.closest('img');
            const imageEle: HTMLElement = closestNode ? closestNode : startNode.querySelector('.e-img-focus');
            if ((items[0 as number]).command === 'Images') {
                if (!isNOU(imageEle)) {
                    let index: number;
                    args.element.firstChild.childNodes.forEach((node: Element) => removeClass([node], 'e-active'));
                    if (imageEle.classList.contains('e-imgleft') || imageEle.classList.contains('e-imginline')) {
                        index = 0;
                    } else if (imageEle.classList.contains('e-imgcenter') || imageEle.classList.contains('e-imgbreak')) {
                        index = 1;
                    } else if (imageEle.classList.contains('e-imgright')) {
                        index = 2;
                    }
                    if (!isNOU(args.element.firstChild.childNodes[index as number] as HTMLElement)) {
                        addClass([args.element.firstChild.childNodes[index as number] as Element], 'e-active');
                    }
                }
            }
            //Video preselect
            const videoClosestNode: HTMLElement = startNode.closest('.e-video-wrap') as HTMLElement | null;
            const videoEle: HTMLElement = videoClosestNode ? videoClosestNode : startNode.querySelector('.e-video-focus') as HTMLElement | null;
            if (!isNOU(items[0 as number]) && (items[0 as number] as IDropDownItemModel).command === 'Videos') {
                if (!isNOU(videoEle)) {
                    let index: number;
                    args.element.firstChild.childNodes.forEach((node: Element) => removeClass([node], 'e-active'));
                    if (videoEle.classList.contains('e-video-left') || videoEle.classList.contains('e-video-inline')) {
                        index = 0;
                    } else if (videoEle.classList.contains('e-video-center') || videoEle.classList.contains('e-video-break')) {
                        index = 1;
                    } else if (videoEle.classList.contains('e-video-right')) {
                        index = 2;
                    }
                    if (!isNOU(args.element.firstChild.childNodes[index as number] as HTMLElement)) {
                        addClass([args.element.firstChild.childNodes[index as number] as Element], 'e-active');
                    }
                }
            }
            if ((items[0 as number] as IDropDownItemModel).command === 'Formats' || (items[0 as number] as IDropDownItemModel).command === 'Font') {
                const fontName: string[] = [];
                const formats: string[] = [];
                let hasUpdatedActive: boolean = false;
                this.format.items.forEach((item: IDropDownItemModel) => {
                    formats.push(item.value.toLocaleLowerCase());
                });
                this.fontFamily.items.forEach((item: IDropDownItemModel): void => {
                    fontName.push(item.value);
                });
                const toolbarStatus: IToolbarStatus = ToolbarStatus.get(
                    this.getDocument(),
                    this.getEditPanel(),
                    formats,
                    null,
                    fontName
                );
                for (let index: number = 0; index < args.element.firstChild.childNodes.length; index++) {
                    const baseSelector: string = this.inlineMode.enable ? `#${this.id}_Inline_Quick_Popup` : '';
                    const targetElement: HTMLElement | Document = this.inlineMode.enable ? this.element.ownerDocument : this.element;
                    const divNode: string = (items[0 as number]).command === 'Formats'
                        ? targetElement.querySelector(`${baseSelector} .e-formats-tbar-btn .e-rte-dropdown-btn-text`).textContent.trim()
                        : (items[0 as number]).subCommand === 'FontName'
                            ? targetElement.querySelector(`${baseSelector} .e-font-name-tbar-btn .e-rte-dropdown-btn-text`).textContent.trim()
                            : targetElement.querySelector(`${baseSelector} .e-font-size-tbar-btn .e-rte-dropdown-btn-text`).textContent.trim();
                    if (!hasUpdatedActive && ((divNode.trim() !== ''
                        && args.element.firstChild.childNodes[index as number].textContent.trim() === divNode.trim()) ||
                        (((items[0 as number]).command === 'Formats' && !isNOU(toolbarStatus.formats) && this.format.items[index as number].value.toLowerCase() === toolbarStatus.formats.toLowerCase() && ((args.element.firstChild.childNodes[index as number]) as HTMLElement).classList.contains(this.format.items[index as number].cssClass))
                            || ((items[0 as number]).subCommand === 'FontName' && (items[0 as number]).command === 'Font' && !isNOU(toolbarStatus.fontname) && !isNOU(this.fontFamily.items[index as number]) && this.fontFamily.items[index as number].value.toLowerCase() === toolbarStatus.fontname.toLowerCase() && ((args.element.firstChild.childNodes[index as number]) as HTMLElement).classList.contains(this.fontFamily.items[index as number].cssClass)))
                        || ((((items[0 as number]).subCommand === 'FontName') && this.fontFamily.items[index as number].value === '' && isNOU(toolbarStatus.fontname) && ((args.element.firstChild.childNodes[index as number]) as HTMLElement).classList.contains(this.fontFamily.items[index as number].cssClass)) ||
                            (((items[0 as number]).subCommand === 'FontSize') && args.element.firstChild.childNodes[index as number].textContent === 'Default' && divNode === 'Font Size' && this.fontSize.items[index as number].value === '')))
                    ) {
                        if (!((args.element.firstChild.childNodes[index as number]) as HTMLElement).classList.contains('e-active')) {
                            addClass([args.element.firstChild.childNodes[index as number] as Element], 'e-active');
                            hasUpdatedActive = true;
                        }
                    } else {
                        removeClass([args.element.firstChild.childNodes[index as number] as Element], 'e-active');
                    }
                }
            }
        }
        else if (this.editorMode === 'Markdown') {
            if ((items[0 as number] as IDropDownItemModel).command === 'Formats') {
                const formats: string[] = [];
                let hasUpdatedActive: boolean = false;
                this.format.items.forEach((item: IDropDownItemModel) => {
                    formats.push(item.value.toLocaleLowerCase());
                });
                const dropdownBtnText: HTMLElement = this.element.querySelector('.e-formats-tbar-btn .e-rte-dropdown-btn-text');
                const childNodes: NodeListOf<ChildNode> = args.element.firstChild.childNodes;
                for (let i: number = 0; i < childNodes.length; i++) {
                    const currentNode: Node = childNodes[i as number];
                    const nodeText: string = currentNode.textContent.trim();
                    if (!hasUpdatedActive && (nodeText === dropdownBtnText.textContent)) {
                        if (!((childNodes[i as number]) as HTMLElement).classList.contains('e-active')) {
                            addClass([childNodes[i as number] as Element], 'e-active');
                            hasUpdatedActive = true;
                        }
                    } else {
                        removeClass([childNodes[i as number] as Element], 'e-active');
                    }
                }
            }
        }
        if (args.element.querySelector('li').textContent === 'Merge cells') {
            const listEle: NodeListOf<HTMLElement> = args.element.querySelectorAll('li');
            const selectedEles: NodeListOf<HTMLElement> = this.inputElement.querySelectorAll('.e-cell-select');
            if (selectedEles.length === 1) {
                addClass([listEle[0]], 'e-disabled');
                removeClass([listEle[1], listEle[2]], 'e-disabled');
            } else if (selectedEles.length > 1) {
                if (!Array.from(selectedEles).every((element: HTMLElement) =>
                    element.tagName.toLowerCase() === selectedEles[0].tagName.toLowerCase()
                )) {
                    addClass([listEle[0]], 'e-disabled');
                } else {
                    removeClass([listEle[0]], 'e-disabled');
                }
                addClass([listEle[1], listEle[2]], 'e-disabled');
            }
        }
    }
    public dropDownClose(args: MenuEventArgs): void {
        this.observer.notify(events.selectionRestore, args);
    }
    public dropDownSelect(e: IDropDownClickArgs): void {
        e.name = 'dropDownSelect';
        if (!(document.body.contains(document.body.querySelector('.e-rte-quick-toolbar'))
            && e.item && (e.item.command === 'Images' || e.item.command === 'Audios' || e.item.command === 'Videos' || e.item.command === 'Display' || e.item.command as string === 'Table'))) {
            this.observer.notify(events.selectionRestore, {});
            const value: string = null;
            // let value: string = e.item.controlParent && this.quickToolbarModule && this.quickToolbarModule.tableQTBar
            //     && this.quickToolbarModule.tableQTBar.element.contains(e.item.controlParent.element) ? 'Table' : null;
            if (e.item.command === 'Lists') {
                const listItem: IAdvanceListItem = { listStyle: e.item.text.replace(/\s+/g, ''), listImage: e.item.listImage, type: e.item.subCommand };
                this.formatter.process(this, e, e.originalEvent, listItem);
            } else if (e.item.command === 'CodeBlock') {
                const selectedItem: ICodeBlockLanguageModel = this.codeBlockSettings.languages.find((args: ICodeBlockLanguageModel) =>
                    args.label.toLowerCase() === e.item.text.toLowerCase()
                );
                const codeBlockItems: ICodeBlockItem = {
                    language: selectedItem.language,
                    label: selectedItem.label,
                    action: 'createCodeBlock'
                };
                this.formatter.process(this, e, e.originalEvent, codeBlockItems);
            } else {
                this.formatter.process(this, e, e.originalEvent, value);
            }
            this.observer.notify(events.selectionSave, {});
        }
        this.observer.notify(events.dropDownSelect, e);
    }
    public colorPickerAfterOpen(args: OpenEventArgs): void {
        if (!isNullOrUndefined(args)) {
            const trgElement: HTMLElement = args.element.querySelector('.e-palette');
            if (trgElement) {
                trgElement.focus();
            }
        }
    }
    public colorIconSelected(args: IToolsItems, value: string, container: string): void {
        const currentDocument: Document = this.iframeSettings.enable ? this.getPanel().ownerDocument : this.getDocument();
        if (!currentDocument) { return; }
        const isIconBtnClicked: boolean = this.isColorIconBtnClicked(currentDocument);
        if (isIconBtnClicked) {
            if (this.inputElement.contains(this.getRange().startContainer)) {
                this.observer.notify(events.selectionSave, {});
            }
            this.observer.notify(events.selectionRestore, {});
            if (!isNOU(value) && value.startsWith('#')) {
                const hex: string = value.substring(1);
                const rgba: string = `rgba(${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}, 1)`;
                value = rgba;
            }
            args.value = isNOU(value) ? args.value : value;
            const range: Range = this.formatter.editorManager.nodeSelection.getRange(this.getDocument());
            const parentNode: Node = range.startContainer.parentNode;
            if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                (closest(range.startContainer.parentNode, 'td,th')) || (this.iframeSettings.enable &&
                    !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib'))) && range.collapsed &&
                args.subCommand === 'BackgroundColor' && container === 'quick') {
                args.command = 'Table';
                this.formatter.process(this, { item: args, name: 'colorPickerChanged' }, undefined, args.value);
            } else {
                this.observer.notify(events.selectionRestore, {});
                this.formatter.process(this, { item: args, name: 'colorPickerChanged' }, undefined, null);
                this.observer.notify(events.selectionSave, {});
            }
            const target: Element = currentDocument.querySelector('.' + args.icon);
            this.observer.notify(events.hideToolTip, { target: target, isButton: true });
        }
    }
    public colorChanged(args: IToolsItems, value: string, container: string): void {
        const currentDocument: Document = this.iframeSettings.enable ? this.getPanel().ownerDocument : this.getDocument();
        if (!currentDocument) { return; }
        const isIconBtnClicked: boolean = this.isColorIconBtnClicked(currentDocument);
        if (!isIconBtnClicked) {
            if (this.inputElement.contains(this.getRange().startContainer)) {
                this.observer.notify(events.selectionSave, {});
            }
            this.observer.notify(events.selectionRestore, {});
            args.value = isNOU(value) ? args.value : value;
            const range: Range = this.formatter.editorManager.nodeSelection.getRange(this.getDocument());
            const isMACSelection: boolean = this.userAgentData && this.userAgentData.getPlatform() === 'macOS' && !range.collapsed;
            const allowSelectionRange: boolean = isMACSelection ? true : range.collapsed;
            if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                closest(range.startContainer.parentNode, 'td,th')) && allowSelectionRange && args.subCommand === 'BackgroundColor'
                && container === 'quick') {
                args.command = 'Table';
                this.formatter.process(this, { item: args, name: 'colorPickerChanged' }, undefined, args.value);
            } else {
                this.observer.notify(events.selectionRestore, {});
                this.formatter.process(this, { item: args, name: 'colorPickerChanged' }, undefined, null);
                this.observer.notify(events.selectionSave, {});
            }
        }
    }

    private isColorIconBtnClicked(currentDocument: Document): boolean {
        if ((currentDocument.activeElement.querySelector('.e-active')) || (currentDocument.activeElement as HTMLElement).classList.contains('e-palette') ||
            (currentDocument.activeElement as HTMLElement).classList.contains('e-apply')) {
            return false;
        }
        return true;
    }
    private toolbarKeyDownHandler(e: KeyboardEvent): void {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const target: HTMLElement = e.target as HTMLElement;
            if (!isNOU(target)) {
                const hasSplitDropDownBtn: HTMLElement | null = target.querySelector('.e-dropdown-btn.e-icon-btn');
                if (!isNullOrUndefined(hasSplitDropDownBtn)) {
                    hasSplitDropDownBtn.click();
                    e.preventDefault();
                    return;
                }
            }
        }
        else if (e.key === 'Escape' || e.keyCode === 27) {
            const currentDocument: Document = this.iframeSettings.enable ? this.getPanel().ownerDocument : this.getDocument();
            if (currentDocument) {
                const IsColorPickerDropDownOpen: HTMLElement = currentDocument.querySelector('.e-rte-font-colorpicker.e-dropdown-btn.e-active') ||
                    currentDocument.querySelector('.e-rte-background-colorpicker.e-dropdown-btn.e-active');
                if (IsColorPickerDropDownOpen) {
                    IsColorPickerDropDownOpen.click();
                }
            }
        }
    }
    private changeTooltipText(id: string): void {
        const tooltipTarget: string = id.split('_')[2];
        switch (tooltipTarget) {
        case 'Minimize':
            document.querySelector('#' + id).setAttribute('sf-tooltip', 'Minimize (Esc)');
            break;
        case 'Maximize':
            document.querySelector('#' + id).setAttribute('sf-tooltip', 'Maximize (Ctrl+Shift+F)');
            break;
        case 'CreateLink':
            document.querySelector('#' + id).setAttribute('sf-tooltip', 'Insert link (Ctrl+K)');
            break;
        case 'InlineCode':
            document.querySelector('#' + id).setAttribute('sf-tooltip', 'Inline Code (Ctrl+`)');
            break;
        case 'FormatPainter':
            document.querySelector('#' + id).setAttribute('sf-tooltip', 'Format Painter (Alt+Shift+C,Alt+Shift+V)');
            break;
        }
    }
    public cancelLinkDialog(): void {
        this.isBlur = false;
        this.linkModule.cancelDialog();
    }
    public cancelImageDialog(): void {
        this.isBlur = false;
    }
    public cancelAudioDialog(): void {
        this.isBlur = false;
    }
    public cancelVideoDialog(): void {
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
    public audioRemoving(): void {
        this.audioModule.fileRemoving();
    }
    public audioUploadSuccess(url: string, fileName: string): void {
        this.audioModule.fileUploadSuccess(url, fileName);
    }
    public audioSelected(): void {
        this.audioModule.fileSelected();
    }
    public audioUploadComplete(base64Str: string, fileName: string): void {
        this.audioModule.fileUploadComplete(base64Str, fileName);
    }
    public audioUploadChange(url: string, isStream: boolean): void {
        this.audioModule.fileUploadChange(url, isStream);
    }
    public videoRemoving(): void {
        this.videoModule.fileRemoving();
    }
    public videoUploadSuccess(url: string, fileName: string): void {
        this.videoModule.fileUploadSuccess(url, fileName);
    }
    public videoSelected(): void {
        this.videoModule.fileSelected();
    }
    public videoUploadComplete(base64Str: string, fileName: string): void {
        this.videoModule.fileUploadComplete(base64Str, fileName);
    }
    public videoUploadChange(url: string, isStream: boolean): void {
        this.videoModule.fileUploadChange(url, isStream);
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
    public insertAudio(): void {
        this.audioModule.insertAudioUrl();
    }
    public audioDialogOpened(): void {
        this.audioModule.dialogOpened();
    }
    public audioDialogClosed(): void {
        this.isBlur = false;
        this.audioModule.dialogClosed();
    }
    public insertVideo(): void {
        this.videoModule.insertVideoUrl();
    }
    public videoDialogOpened(): void {
        this.videoModule.dialogOpened();
    }
    public videoDialogClosed(): void {
        this.isBlur = false;
        this.videoModule.dialogClosed();
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
    public updatePasteContent(value: string): void {
        this.observer.notify(events.afterPasteCleanUp, { text: value });
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
	        this.observer.notify(events.toolbarRefresh, {});
        }
    }
    public insertAlt(altText: string): void {
        this.imageModule.insertAlt(altText);
    }
    public insertSize(width: number, height: number): void {
        this.imageModule.insertSize(width, height);
    }
    public insertVideoSize(width: number, height: number): void {
        this.videoModule.insertVideoSize(width, height);
    }
    public insertImageLink(url: string, target: string, ariaLabel: string): void {
        this.imageModule.insertLink(url, target, ariaLabel);
    }
    public showLinkDialog(): void {
        this.linkModule.showDialog(true);
    }
    public showImageDialog(): void {
        this.imageModule.showDialog(true);
    }
    public showAudioDialog(): void {
        this.audioModule.showDialog(true);
    }
    public showVideoDialog(): void {
        this.videoModule.showDialog(true);
    }
    public showTableDialog(): void {
        this.tableModule.showDialog(true);
    }
    public beforeSlashMenuApply(): void {
        this.formatter.editorManager.beforeSlashMenuApplyFormat();
    }
    public showWordDialog(): void {
        this.wordModule.showDialog(true);
    }
    public slashMenuToolbarRefresh(): void {
        this.observer.notify(events.toolbarRefresh, {});
    }
    public destroy(): void {
        this.unWireEvents();
        this.observer.notify(events.destroy, {});
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).sfBlazor.disposeWindowsInstance(this.dataId);
        this.isSelecting = false;
        this.selectionTimeout = null;
        this.previousRange = null;
        if (!isNOU(this.timeInterval)) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
    }
    //#endregion
    //#region Event binding and unbinding function
    private wireEvents(): void {
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        if (this.editorMode === 'HTML') {
            this.mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
                if (mutations.length > 0 && !this.isFocusOut) {
                    if (this.checkContentChanged(mutations)) {
                        this.hasContentChanged = true;
                        // Only set up interval for non-autoSaveOnIdle mode
                        if (!this.autoSaveOnIdle && !isNOU(this.saveInterval) && this.saveInterval > 0) {
                            if (isNOU(this.timeInterval)) {
                                this.timeInterval = setInterval(() => {
                                    if (this.hasContentChanged) {
                                        this.updateValueOnIdle();
                                        this.hasContentChanged = false; // Reset after saving
                                    } else {
                                        clearInterval(this.timeInterval);
                                        this.timeInterval = null;
                                    }
                                }, this.saveInterval);
                            }
                        }
                    } else {
                        // If no changes detected and there's an active interval, clear it
                        if (!this.autoSaveOnIdle && !isNOU(this.timeInterval)) {
                            clearInterval(this.timeInterval);
                            this.timeInterval = null;
                        }
                    }
                }
            });
            this.mutationObserver.observe(this.inputElement, {
                attributes: true,
                childList: true,
                subtree: true,
                characterData: true,
                attributeOldValue: true
            });
        }
        this.observer.on(events.contentChanged, this.contentChanged, this);
        this.observer.on(events.modelChanged, this.refresh, this);
        this.wireResizeEvents();
        this.observer.on(events.updateTbItemsStatus, this.updateStatus, this);
        this.observer.on(events.updateValueOnIdle, this.updateValueOnIdle, this);
        this.observer.on(events.cleanupResizeElements, this.cleanupResizeElements, this);
        if (this.iframeSettings.enable) {
            this.onLoadHandler = this.iframeEditableElemLoad.bind(this);
            this.getEditPanel().addEventListener('load', this.onLoadHandler, true);
        }
        if (this.readonly && this.enabled) { return; }
        this.bindEvents();
    }
    private checkContentChanged(mutations: MutationRecord[]): boolean {
        return mutations.some((mutation: MutationRecord) => {
            // Check for text content changes
            if (mutation.type === 'characterData') {
                return true;
            }
            // Check for added or removed nodes
            if (mutation.type === 'childList' &&
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                return true;
            }
            // Check for relevant attribute changes (if needed)
            if (mutation.type === 'attributes') {
                const target: Node = mutation.target as HTMLElement;
                if ((target as HTMLElement).isContentEditable && this.inputElement === target) {
                    return false;
                }
                const attributeName: string = mutation.attributeName;
                const currentValue: string = (target as HTMLElement).getAttribute(attributeName);
                const previousValue: string = mutation.oldValue;
                return previousValue !== currentValue;
            }
            return false;
        });
    }
    private wireResizeEvents(): void {
        if (this.enableResize) {
            this.observer.on(events.resizeInitialized, this.updateResizeFlag, this);
        }
    }
    private bindEvents(): void {
        this.keyboardModule = new KeyboardEvents(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs:
                { ...this.formatter.keyConfig, ...this.keyConfig }, eventName: 'keydown'
        });
        if (this.userAgentData && this.userAgentData.getPlatform() === 'Android') {
            EventHandler.add(this.inputElement, 'beforeinput', this.beforeInputHandler, this);
        }
        const formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        if (this.toolbarSettings.enable && this.getToolbarElement()) {
            EventHandler.add(this.getToolbarElement(), 'keydown', this.toolbarKeyDownHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, 'UpdateEditorValue', this.updateEditorValue, this);
        EventHandler.add(this.inputElement, 'input', this.inputHandler, this);
        this.mouseUpDebListener = debounce(this.mouseUp, 30);
        EventHandler.add(this.inputElement, Browser.touchEndEvent, this.mouseUpDebListener, this);
        EventHandler.add(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler, this);
        EventHandler.add(this.inputElement, 'click', this.onClickBoundfn, this);
        this.wireContextEvent();
        this.formatter.editorManager.observer.on('keydown-handler', this.editorKeyDown, this);
        this.element.ownerDocument.defaultView.addEventListener('resize', debounce(this.onResizeHandler, 10) as EventListenerOrEventListenerObject, true);
        if (this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'focusin', this.focusHandler, this);
            EventHandler.add(this.inputElement, 'focusout', this.blurHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown, this);
            EventHandler.add(this.getPanel(), 'load', this.iframeLoadHandler, this);
        }
        this.wireScrollElementsEvents();
        //Handle selectionchange to update selection state
        EventHandler.add(this.inputElement.ownerDocument, 'selectionchange', this.selectionChangeHandler, this);
        //Handle mouseup (document-wide to capture outside RTE release)
        EventHandler.add(this.inputElement.ownerDocument, 'mouseup', this.mouseUpHandlerForSelection , this);
    }
    private clickHandler(e: MouseEvent): void {
        if (e.target && (e.target as Element).nodeName === 'A' && !e.ctrlKey) {
            e.stopPropagation();
        }
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
        for (const element of this.scrollParentElements) {
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'scroll', this.contentScrollHandler, this);
        }
    }
    private unWireEvents(): void {
        this.element.removeEventListener('focusin', this.onFocusHandler, true);
        this.element.removeEventListener('focusout', this.onBlurHandler, true);
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        this.observer.off(events.contentChanged, this.contentChanged);
        this.unWireResizeEvents();
        this.observer.off(events.updateTbItemsStatus, this.updateStatus);
        this.observer.off(events.updateValueOnIdle, this.updateValueOnIdle);
        this.observer.off(events.cleanupResizeElements, this.cleanupResizeElements);
        if (this.iframeSettings.enable) {
            this.getEditPanel().removeEventListener('load', this.onLoadHandler, true);
            this.onLoadHandler = null;
        }
        this.unBindEvents();
    }
    private unWireResizeEvents(): void {
        this.observer.off(events.resizeInitialized, this.updateResizeFlag);
    }
    private unBindEvents(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        const formElement: Element = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        if (this.toolbarSettings.enable && this.getToolbarElement()) {
            EventHandler.remove(this.getToolbarElement(), 'keydown', this.toolbarKeyDownHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, 'UpdateEditorValue', this.updateEditorValue);
        EventHandler.remove(this.inputElement, 'input', this.inputHandler);
        EventHandler.remove(this.inputElement, Browser.touchEndEvent, this.mouseUpDebListener);
        this.mouseUpDebListener = null;
        EventHandler.remove(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler);
        EventHandler.remove(this.inputElement, 'click', this.onClickBoundfn);
        this.unWireContextEvent();
        if (this.formatter) {
            this.formatter.editorManager.observer.off('keydown-handler', this.editorKeyDown);
        }
        this.element.ownerDocument.defaultView.removeEventListener('resize', debounce(this.onResizeHandler, 10) as EventListenerOrEventListenerObject, true);
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
            EventHandler.remove(this.getPanel(), 'load', this.iframeLoadHandler);
        }
        if (this.userAgentData && this.userAgentData.getPlatform() === 'Android') {
            EventHandler.remove(this.inputElement, 'beforeinput', this.beforeInputHandler);
        }
        this.unWireScrollElementsEvents();
        this.onClickBoundfn = null;
        if (this.userAgentData.isSafari() && this.toolbarSettings.type === 'Expand') {
            const extendedToolbarElement: HTMLElement = this.getToolbarElement().querySelector('.e-expended-nav');
            if (extendedToolbarElement) {
                EventHandler.remove(extendedToolbarElement, 'mousedown', this.extendedToolbarMouseDownHandler);
                EventHandler.remove(extendedToolbarElement, 'click', this.extendedToolbarClickHandler);
            }
        }
        //Handle selectionchange to update selection state
        EventHandler.remove(this.inputElement.ownerDocument, 'selectionchange', this.selectionChangeHandler);
        //Handle mouseup (document-wide to capture outside RTE release)
        EventHandler.remove(this.inputElement.ownerDocument, 'mouseup', this.mouseUpHandlerForSelection);
    }
    private unWireContextEvent(): void {
        EventHandler.remove(this.inputElement, 'contextmenu', this.contextHandler);
        if (Browser.isDevice && this.touchModule) { this.touchModule.destroy(); }
    }
    private unWireScrollElementsEvents(): void {
        this.scrollParentElements = getScrollableParent(this.element);
        for (const element of this.scrollParentElements) {
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
                this.cloneValue = (this.inputElement.innerHTML === getDefaultValue(this)) ? null : this.enableHtmlEncode ?
                    this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
            } else {
                this.cloneValue = (this.inputElement as HTMLTextAreaElement).value === '' ? null :
                    (this.inputElement as HTMLTextAreaElement).value;
            }
            const active: Element = document.activeElement;
            if (active === this.element || active === this.getToolbarElement() || active === this.getEditPanel()
                || ((this.iframeSettings.enable && active === this.getPanel()) &&
                    e.target && !(e.target as HTMLElement).classList.contains('e-img-inner')
                    && (e.target && (e.target as HTMLElement).parentElement
                        && !(e.target as HTMLElement).parentElement.classList.contains('e-img-wrap')))
                || closest(active, '.e-rte-toolbar') === this.getToolbarElement()) {
                (this.getEditPanel() as HTMLElement).focus();
                if (!isNOU(this.getToolbarElement())) {
                    this.getToolbarElement().setAttribute('tabindex', '-1');
                    const items: NodeList = this.getToolbarElement().querySelectorAll('[tabindex="0"]');
                    for (let i: number = 0; i < items.length; i++) {
                        (items[i as number] as HTMLElement).setAttribute('tabindex', '-1');
                    }
                }
            }
            this.preventDefaultResize(e, false);
            const args: FocusBlurEventArgs = { isInteracted: Object.keys(e).length === 0 ? false : true };
            if (this.focusEnabled) { this.dotNetRef.invokeMethodAsync('FocusEvent', args); }
            if (!isNOU(this.saveInterval) && this.saveInterval > 0 && !this.autoSaveOnIdle && isNOU(this.timeInterval) && this.editorMode === 'Markdown') {
                this.timeInterval = setInterval(this.updateValueOnIdle.bind(this), this.saveInterval);
            }
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
        if (!this.readonly) {
            const currentFocus: string = this.getCurrentFocus(e);
            if (currentFocus === 'editArea' || currentFocus === 'textArea' || currentFocus === 'sourceCode') {
                this.resetToolbarTabIndex();
            }
        }
    }
    private blurHandler(e: FocusEvent): void {
        let trg: Element = e.relatedTarget as Element;
        if (trg) {
            const rteElement: Element = closest(trg, '.' + classes.CLS_RTE);
            if (rteElement && rteElement === this.element) {
                this.isBlur = false;
                if (trg === this.getToolbarElement()) { trg.setAttribute('tabindex', '-1'); }
            } else if (closest(trg, '[aria-owns="' + this.element.id + '"]') || !isNOU(closest(trg, '.' + classes.CLS_RTE_ELEMENTS))) {
                this.isBlur = false;
            } else {
                this.isBlur = true;
                trg = null;
            }
        } else if (!this.isIframeRteElement) {
            this.isBlur = true;
            this.isIframeRteElement = true;
        }
        if (this.isBlur && isNOU(trg)) {
            removeClass([this.element], [classes.CLS_FOCUS]);
            removeSelectionClassStates(this.inputElement);
            this.observer.notify(events.focusChange, {});
            this.value = this.getUpdatedValue();
            this.updateValueContainer(this.value);
            this.invokeChangeEvent();
            this.isFocusOut = true;
            this.isBlur = false;
            if (this.enableXhtml) {
                this.valueContainer.value = this.getXhtmlString(this.valueContainer.value);
            }
            dispatchEvent(this.valueContainer, 'focusout');
            this.preventDefaultResize(e, true);
            const args: FocusBlurEventArgs = { isInteracted: Object.keys(e).length === 0 ? false : true };
            if (this.blurEnabled) { this.dotNetRef.invokeMethodAsync('BlurEvent', args); }
            if (!isNOU(this.timeInterval)) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        } else {
            this.isRTE = true;
        }
        if (!this.readonly && this.getCurrentFocus(e) === 'outside') { this.resetToolbarTabIndex(); }
        this.previousRange = null;
    }
    private resizeHandler(eventArgs: Event, ignoreRefresh: boolean): void {
        let isExpand: boolean = false;
        if (!document.body.contains(this.element)) {
            document.defaultView.removeEventListener('resize', debounce(this.onResizeHandler, 10) as EventListenerOrEventListenerObject, true);
            return;
        }
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            if (!ignoreRefresh) { this.dotNetRef.invokeMethodAsync('RefreshToolbarOverflow'); }
            const tbElement: HTMLElement = this.element.querySelector('.e-rte-toolbar');
            isExpand = tbElement && tbElement.classList.contains(classes.CLS_EXPAND_OPEN);
        }
        this.observer.notify(events.windowResize, { args: eventArgs });
    }
    private touchHandler(e: TapEventArgs): void {
        this.notifyMouseUp(e.originalEvent);
        this.triggerEditArea(e.originalEvent);
    }
    private resetHandler(): void {
        const defaultValue: string = this.valueContainer.defaultValue.trim().replace(/<!--!-->/gi, '');
        this.value = (defaultValue === '' ? null : this.defaultResetValue);
        this.setPanelValue(this.value, true);
    }
    private contextHandler(e: MouseEvent): void {
        let closestElem: Element = closest((e.target as HTMLElement), 'a, table, img, video, audio, .e-embed-video-wrap');
        if (!closestElem && (e.target as HTMLElement) && (e.target as HTMLElement).classList &&
            ((e.target as HTMLElement).classList.contains(classes.CLS_AUDIOWRAP) ||
                (e.target as HTMLElement).classList.contains(classes.CLS_CLICKELEM))) {
            closestElem = (e.target as HTMLElement).querySelector('audio');
        }
        if (this.inlineMode.onSelection === false || (!isNOU(closestElem) && this.inputElement.contains(closestElem)
            && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A' ||
                closestElem.tagName.toLowerCase() === 'video' || closestElem.tagName.toLowerCase() === 'audio' || closestElem.tagName === 'SPAN'))) {
            e.preventDefault();
        }
    }
    private scrollHandler(e: Event): void {
        this.observer.notify(events.scroll, { args: e });
    }
    private contentScrollHandler(e: Event): void {
        this.observer.notify(events.contentscroll, { args: e });
    }
    private inputHandler(e: Event): void {
        this.autoResize();
    }
    private mouseUp(e: MouseEvent | TouchEvent): void {
        this.isSelectionStartInRTE = false;
        if (this.isSelectionCollapsed()) {
            const selection: Selection = this.getDocument().getSelection();
            const range: Range = selection && selection.rangeCount !== 0 && selection.getRangeAt(0);
            this.previousRange = range && range.cloneRange();
        }
        const target: HTMLElement = e.target as HTMLElement;
        const mediaTags: string[] = ['IMG', 'VIDEO', 'AUDIO', 'TABLE', 'TH', 'TD', 'TR', 'TBODY'];
        const isNotMediaElement: boolean = !(target && mediaTags.indexOf(target.tagName) !== -1 || (target.nodeName !== '#text' &&
            (target.closest('.e-audio-wrap') || target.closest('.e-video-wrap'))));
        if (isNotMediaElement && this.editorMode === 'HTML' && !(Browser.isDevice)) {
            if (!this.isSelectionInRTE()) {
                return;
            }
        }
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            const target: Element = e.target as Element;
            const closestTable: Element = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
        this.updateUndoRedoStack(e);
        if (this.isSelectionInRTE()) {
            this.triggerOnSelectionChange();
            this.isSelecting = false;
        }
    }
    private mouseDownHandler(e: MouseEvent | TouchEvent): void {
        this.isSelectionStartInRTE = true;
        const touch: Touch = <Touch>((e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e);
        addClass([this.element], [classes.CLS_FOCUS]);
        this.preventDefaultResize(e as MouseEvent, false);
        this.observer.notify(events.mouseDown, { args: e });
        this.formatter.editorManager.observer.notify(events.mouseDown, { args: e });
        this.clickPoints = { clientX: touch.clientX, clientY: touch.clientY };
    }
    private onIframeMouseDown(e: MouseEvent): void {
        this.isBlur = false;
        this.observer.notify(events.iframeMouseDown, e);
        dispatchEvent(document.body, 'mousedown');
        this.removeHrFocus(e);
    }
    public cleanList(e: KeyboardEvent): void {
        const range: Range = this.getRange();
        const currentStartContainer: Node = range.startContainer;
        const currentEndContainer: Node = range.endContainer;
        const currentStartOffset: number = range.startOffset;
        const isSameContainer: boolean = currentStartContainer === currentEndContainer ? true : false;
        let currentEndOffset: number;
        const endNode: Element = range.endContainer.nodeName === '#text' ? range.endContainer.parentElement :
            range.endContainer as Element;
        const closestLI: Element = closest(endNode, 'LI');
        let isRTEEleAvail: boolean = true;
        if (!isNOU(closestLI)) {
            isRTEEleAvail = isNOU(closestLI.querySelector('#' + this.id));
        }
        if (!isNOU(closestLI) && endNode.textContent.trim().length === range.endOffset &&
            !range.collapsed && isNOU(endNode.nextElementSibling) && isRTEEleAvail && !endNode.classList.contains(classes.CLS_IMG_INNER)) {
            for (let i: number = 0; i < closestLI.childNodes.length; i++) {
                if (closestLI.childNodes[i as number].nodeName === '#text' && closestLI.childNodes[i as number].textContent.trim().length === 0) {
                    detach(closestLI.childNodes[i as number]);
                    i--;
                }
            }
            currentEndOffset = closestLI.textContent.length - 1;
            let currentLastElem: Element = closestLI;
            while (currentLastElem.lastChild !== null && currentLastElem.nodeName !== '#text') {
                currentLastElem = currentLastElem.lastChild as Element;
            }
            this.formatter.editorManager.nodeSelection.setSelectionText(
                this.getDocument(), isSameContainer ? currentLastElem : currentStartContainer, currentLastElem,
                currentStartOffset, currentLastElem.textContent.length);
        }
    }
    public keyDown(e: KeyboardEvent): void {
        this.isSelectionStartInRTE = true;
        const isMacDev: boolean = navigator.userAgent.indexOf('Mac') !== -1;
        if (((e.ctrlKey || (e.metaKey && isMacDev)) && e.shiftKey && e.keyCode === 86) ||
            (e.metaKey && isMacDev && e.altKey && e.shiftKey && e.keyCode === 86)) {
            this.isPlainPaste = true;
        }
        if (this.inputElement.classList.contains('e-mention')) {
            if (!isNOU(this.inputElement.getAttribute('aria-owns'))) {
                const mentionPopupId: string = this.inputElement.getAttribute('aria-owns').split('_options')[0];
                const mentionPopup: HTMLElement = this.element.ownerDocument.getElementById(mentionPopupId + '_popup');
                const mentionKeys: string[] = mentionRestrictKeys;
                if (mentionKeys.indexOf(e.key) !== -1 && mentionPopup && mentionPopup.classList.contains('e-popup-open')) {
                    return;
                }
            }
        }
        if (this.editorMode === 'HTML') {
            const rangeForCodeBlock: Range = this.getRange();
            if (this.formatter.editorManager.codeBlockObj.isActionDisallowedInCodeBlock(e, rangeForCodeBlock)) {
                e.preventDefault();
                return;
            }
        }
        if (this.enableTabKey) {
            if (this.quickToolbarModule && !e.altKey && e.key !== 'F10' && (e as KeyboardEventArgs).action !== 'toolbar-focus') {
                this.quickToolbarModule.hideQuickToolbars();
            }
            const isImageResize: boolean = this.imageModule && this.imageModule.imgResizeDiv ? true : false;
            const isVideoResize: boolean = this.videoModule && this.videoModule.vidResizeDiv ? true : false;
            if (isImageResize) {
                this.imageModule.cancelResizeAction();
            }
            if (isVideoResize) {
                this.videoModule.cancelResizeAction();
            }
        }
        let isCodeBlockEnter: boolean = false;
        if (this.editorMode === 'HTML') {
            const range: Range = this.getRange();
            isCodeBlockEnter = this.formatter.editorManager.codeBlockObj.isCodeBlockEnterAction(range, e);
        }
        this.observer.notify(events.keyDown, { member: 'keydown', args: e });
        this.restrict(e);
        if (this.editorMode === 'HTML') {
            this.cleanList(e);
        }
        if (this.iframeSettings.enable && !this.enableTabKey && (e.which === 9 && e.code === 'Tab')
            && (e.target as Element).nodeName === 'BODY') {
            this.isIframeRteElement = false;
        }
        if (this.editorMode === 'HTML' && ((e.which === 8 && e.code === 'Backspace') || (e.which === 46 && e.code === 'Delete'))) {
            const range: Range = this.getRange();
            const startNode: Element = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement :
                range.startContainer as Element;
            if (closest(startNode, 'pre') &&
                (e.which === 8 && range.startContainer.textContent.charCodeAt(range.startOffset - 1) === 8203) ||
                (e.which === 46 && range.startContainer.textContent.charCodeAt(range.startOffset) === 8203)) {
                const regEx: RegExp = new RegExp('\u200B', 'g');
                const pointer: number = e.which === 8 ? range.startOffset - 1 : range.startOffset;
                range.startContainer.textContent = range.startContainer.textContent.replace(regEx, '');
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.getDocument(), range.startContainer as Element, pointer);
            } else if ((e.code === 'Backspace' && e.which === 8) &&
                range.startContainer.textContent.charCodeAt(0) === 8203 && range.collapsed) {
                const parentEle: Element = range.startContainer.parentElement;
                let index: number;
                let i: number;
                for (i = 0; i < parentEle.childNodes.length; i++) {
                    if (parentEle.childNodes[i as number] === range.startContainer) { index = i; }
                }
                let bool: boolean = true;
                const removeNodeArray: number[] = [];
                for (i = index; i >= 0; i--) {
                    if (parentEle.childNodes[i as number].nodeType === 3 &&
                        parentEle.childNodes[i as number].textContent.charCodeAt(0) === 8203 && bool) {
                        removeNodeArray.push(i);
                    } else {
                        bool = false;
                    }
                }
                if (removeNodeArray.length > 0) {
                    for (i = removeNodeArray.length - 1; i > 0; i--) {
                        parentEle.childNodes[removeNodeArray[i as number]].textContent = '';
                    }
                }
                this.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.getDocument(), range.startContainer as Element, range.startOffset);
            }
        }
        if (this.formatter.getUndoRedoStack().length === 0) {
            this.formatter.saveData();
        }
        let allowInsideCodeBlock: boolean = true;
        if (this.editorMode === 'HTML') {
            const range: Range = this.getRange();
            const startInCodeBlock: HTMLElement =
                this.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(range.startContainer);
            const endInCodeBlock: HTMLElement = this.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(range.endContainer);
            const codeBlockElement: boolean = !isNOU(startInCodeBlock) || !isNOU(endInCodeBlock);
            if (codeBlockElement) {
                const currentAction: string = (e as KeyboardEventArgs).action;
                const allowActions: string[] = ['undo', 'redo', 'indents', 'outdents', 'ordered-list', 'unordered-list'];
                allowInsideCodeBlock = allowActions.indexOf(currentAction) !== -1;
            }
        }
        const keyboardEventAction: string[] = ['insert-link', 'format-copy', 'format-paste', 'insert-image', 'insert-table', 'insert-audio', 'insert-video'];
        if (keyboardEventAction.indexOf((e as KeyboardEventArgs).action) === -1 && (e as KeyboardEventArgs).action !== 'format-copy' &&
            (e as KeyboardEventArgs).action !== 'format-paste' &&
            ((e as KeyboardEventArgs).action && (e as KeyboardEventArgs).action !== 'paste' && (e as KeyboardEventArgs).action !== 'space'
                || e.which === 9 || (e.code === 'Backspace' && e.which === 8)) || (e as KeyboardEventArgs).action === 'undo' || (e as KeyboardEventArgs).action === 'redo') {
            let FormatPainterEscapeAction: boolean = false;
            if (!isNOU(this.formatPainterModule)) {
                FormatPainterEscapeAction = this.formatPainterModule.previousAction === 'escape';
            }
            const isUndoRedoAction: boolean = (e as KeyboardEventArgs).action === 'undo' || (e as KeyboardEventArgs).action === 'redo';
            if ((!FormatPainterEscapeAction || isUndoRedoAction) && allowInsideCodeBlock && !isCodeBlockEnter) {
                if (this.editorMode === 'HTML' && ((e as KeyboardEventArgs).action === 'increase-fontsize' || (e as KeyboardEventArgs).action === 'decrease-fontsize')) {
                    this.observer.notify(events.onHandleFontsizeChange, { member: 'onHandleFontsizeChange', args: e });
                } else {
                    this.formatter.process(this, null, e);
                }
            }
            switch ((e as KeyboardEventArgs).action) {
            case 'toolbar-focus':
                if (this.toolbarSettings.enable && this.getToolbarElement()) {
                    if (this.userAgentData.isSafari() && e.type === 'keydown' && this.formatter.editorManager.nodeSelection &&
                            this.formatter.editorManager.nodeSelection.get(this.getDocument()).rangeCount > 0 &&
                            this.inputElement.contains(this.getRange().startContainer)) {
                        this.observer.notify(events.selectionSave, {});
                    }
                    let firstActiveItem: HTMLElement = this.getToolbarElement().querySelector('.e-toolbar-item:not(.e-overlay)[title]');
                    const quickToolbarElem: HTMLElement | null = this.getRenderedQuickToolbarElem();
                    let toolbarFocusType: string = 'toolbar';
                    if (quickToolbarElem) {
                        firstActiveItem = quickToolbarElem.querySelector('.e-toolbar-item:not(.e-overlay)[title]');
                        toolbarFocusType = 'quickToolbar';
                    }
                    if (firstActiveItem) {
                        const firstChild: HTMLElement = firstActiveItem.firstElementChild as HTMLElement;
                        firstChild.removeAttribute('tabindex');
                        firstChild.focus();
                        if (this.userAgentData.isSafari() && (toolbarFocusType === 'toolbar' || toolbarFocusType === 'quickToolbar')) {
                            this.inputElement.ownerDocument.getSelection().removeAllRanges();
                        }
                    }
                }
                break;
            case 'escape':
                (this.getEditPanel() as HTMLElement).focus();
                break;
            }
        }
        if (!isNOU(this.placeholder)) {
            this.setPlaceHolder();
        }
        this.observer.notify(events.afterKeyDown, { member: 'afterKeyDown', args: e });
        this.autoResize();
        if (this.editorMode === 'HTML' && !isNOU(e) && !isNOU(e.code) && (e.code === 'Backspace' || e.code === 'Delete')) {
            const range: Range = this.getDocument().getSelection().getRangeAt(0);
            const div: HTMLElement = document.createElement('div');
            div.appendChild(range.cloneContents());
            const selectedHTML: string = div.innerHTML;
            if (selectedHTML === this.inputElement.innerHTML ||
                (range.commonAncestorContainer === this.inputElement && selectedHTML === this.inputElement.textContent.trim())) {
                this.isSelectAll = true;
            }
        }
        // Cmd + Backspace triggers only the keydown event; the keyup event is not triggered.
        if (e.metaKey && e.key === 'Backspace' && this.autoSaveOnIdle) {
            this.keyUp(e);
        }
        if (this.editorMode === 'HTML') {
            const selection: Selection = this.getDocument().getSelection();
            const range: Range = selection && selection.getRangeAt(0);
            this.previousRange = range && range.cloneRange();
        }

    }

    private editorKeyDown(e: IHtmlKeyboardEvent): void {
        switch (e.event.action) {
        case 'copy':
            this.onCopy(e.event);
            break;
        case 'cut':
            this.onCut(e.event);
            break;
        case 'print':
            e.event.preventDefault();
            this.print();
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
    // Clear selection timeout for keyup event triggering
    private clearSelectionTimeout(): void {
        if (this.selectionTimeout) {
            clearTimeout(this.selectionTimeout);
            this.selectionTimeout = null;
        }
    }

    // Triggers the onSelectionchange event
    private triggerOnSelectionChange(): void {
        const selection: Selection | null = this.getDocument().getSelection();
        const currentRange: Range = selection && selection.rangeCount > 0 && selection.getRangeAt(0);
        if (!this.isSelectionCollapsed()) {
            const isSamerange: boolean = this.previousRange &&
                (this.previousRange.startContainer === currentRange.startContainer
                    && this.previousRange.endContainer === currentRange.endContainer
                    && this.previousRange.startOffset === currentRange.startOffset
                    && this.previousRange.endOffset === currentRange.endOffset);
            if (!isSamerange) {
                const selectionArgs: SelectionChangedEventArgs = {
                    selectedContent: this.getSelectedHtml()
                };
                if (this.selectionChangedEnabled) {
                    this.dotNetRef.invokeMethodAsync('SelectionChanged', selectionArgs);
                }
                this.previousRange = currentRange.cloneRange();
            }
        }
    }
    private keyUp(e: KeyboardEvent): void {
        if (this.editorMode === 'HTML') {
            if (!isNOU(e) && !isNOU(e.code) && (e.code === 'Backspace' || e.code === 'Delete' || e.code === 'KeyX')) {
                // To prevent the reformatting the content removed browser behavior.
                const currentRange: Range = this.getRange();
                const selection: Selection = this.iframeSettings.enable ? this.getPanel().ownerDocument.getSelection() :
                    this.getDocument().getSelection();
                if (this.isSelectAll) {
                    const brElement: HTMLElement = document.createElement('br');
                    const newElement: HTMLElement = this.enterKey === 'BR' ? brElement : document.createElement(this.enterKey).appendChild(brElement).parentElement;
                    this.inputElement.innerHTML = '';
                    this.inputElement.appendChild(newElement);
                    this.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.getDocument(),
                        brElement,
                        0
                    );
                    this.isSelectAll = false;
                }
                if (selection.rangeCount > 0 && this.getDocument().activeElement.tagName !== 'INPUT' && this.inputElement.contains(this.getDocument().activeElement) && (currentRange.startContainer as HTMLElement).innerHTML === '<br>' && (currentRange.startContainer as HTMLElement).textContent === '') {
                    selection.removeAllRanges();
                    selection.addRange(currentRange);
                }
            }
            const range: Range = this.getRange();
            if (Browser.userAgent.indexOf('Firefox') !== -1 && range.startContainer.nodeName === '#text' &&
                range.startContainer.parentElement === this.inputElement && this.enterKey !== 'BR') {
                const range: Range = this.getRange();
                const tempElem: HTMLElement = createElement(this.enterKey);
                range.startContainer.parentElement.insertBefore(tempElem, range.startContainer);
                tempElem.appendChild(range.startContainer);
                this.formatter.editorManager.nodeSelection.setSelectionText(
                    this.getDocument(), tempElem.childNodes[0], tempElem.childNodes[0],
                    tempElem.childNodes[0].textContent.length, tempElem.childNodes[0].textContent.length);
            }
        }
        const currentStackIndex: number = this.formatter.getCurrentStackIndex();
        if (currentStackIndex === 0) {
            this.updateUndoRedoStack(e);
        }
        this.observer.notify(events.keyUp, { member: 'keyup', args: e });
        if (e.code === 'KeyX' && e.which === 88 && e.keyCode === 88 && e.ctrlKey && (this.inputElement.innerHTML === '' ||
            this.inputElement.innerHTML === '<br>')) {
            this.inputElement.innerHTML = resetContentEditableElements(getEditValue(getDefaultValue(this), this), this.editorMode);
        }
        const isMention: boolean = this.inputElement.classList.contains('e-mention');
        const allowedKeys: boolean = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46 || e.which === 9 && isMention;
        if (((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys) || (this.editorMode === 'Markdown'
            && ((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys)) || (this.autoSaveOnIdle && Browser.isDevice) && !this.inlineMode.enable) {
            this.formatter.onKeyHandler(this, e);
        }
        if (this.inputElement && this.inputElement.textContent.length !== 0
            || this.element.querySelectorAll('.e-toolbar-item.e-active').length > 0 || this.formatter.getUndoRedoStack().length > 0) {
            this.observer.notify(events.toolbarRefresh, { args: e });
        }
        if (!isNOU(this.placeholder)) {
            if (!(e.key === 'Enter' && e.keyCode === 13) && (this.inputElement.innerHTML === '<p><br></p>' || this.inputElement.innerHTML === '<div><br></div>' ||
                this.inputElement.innerHTML === '<br>')) {
                this.setPlaceHolder();
            }
        }
        this.autoResize();
        if (this.editorMode === 'HTML') {
            //Clears the selectionTimeout and triggers the onSelectionChange event.
            this.clearSelectionTimeout();
            this.selectionTimeout = window.setTimeout(() => {
                if (this.isSelecting) {
                    this.triggerOnSelectionChange();
                    this.isSelecting = false;
                    this.isSelectionStartInRTE = false;
                }
            }, 600);
        }
    }
    /*
     * Updates the undo/redo stack based on user interactions like mouse up or key up events.
     * It focuses on maintaining the initial selection range when the stack is at index 0.
     *
     * For HTML, it saves the initial range.
     * For Markdown, it records selection start and end.
     *
     * This is applied if the stack is empty or at the start index and navigation keys are involved.
     */
    private updateUndoRedoStack(e: MouseEvent | TouchEvent | KeyboardEvent): void {
        const undoRedoStack: IHtmlUndoRedoData[] | MarkdownUndoRedoData[] = this.formatter.getUndoRedoStack();
        const currentStackIndex: number = this.formatter.getCurrentStackIndex();
        const navigationKeys: string[] = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End', 'PageUp', 'PageDown'
        ];
        const isNavKey: boolean = navigationKeys.indexOf((e as KeyboardEvent).key) !== -1;
        const isNavigationKey: boolean = e.type === 'keyup' ? isNavKey : true;
        if (undoRedoStack.length === 0 || currentStackIndex === 0) {
            if (undoRedoStack.length === 0) {
                this.formatter.saveData();
            } else if (currentStackIndex === 0 && this.editorMode === 'HTML' && isNavigationKey) {
                const firstStackState: IHtmlUndoRedoData = undoRedoStack[0] as IHtmlUndoRedoData;
                const save: NodeSelection = new NodeSelection(this.inputElement as HTMLElement)
                    .save(this.getRange(), this.getDocument());
                firstStackState.range = save;
            } else if (currentStackIndex === 0 && this.editorMode === 'Markdown' && isNavigationKey) {
                const markdownFirstStackState: MarkdownUndoRedoData = undoRedoStack[0] as MarkdownUndoRedoData;
                const start: number = (this.inputElement as HTMLTextAreaElement).selectionStart;
                const end: number = (this.inputElement as HTMLTextAreaElement).selectionEnd;
                markdownFirstStackState.start = start;
                markdownFirstStackState.end = end;
            }
        }
    }
    private onCut(e: MouseEvent | KeyboardEvent | ClipboardEvent = null): void {
        if (e && this.editorMode === 'HTML' && this.handleTableCellCopy(true)) {
            // Cut was handled by table module
            e.preventDefault();
            return;
        }
        const range: Range = this.getDocument().getSelection().getRangeAt(0);
        const div: HTMLElement = document.createElement('div');
        div.appendChild(range.cloneContents());
        const selectedHTML: string = div.innerHTML;
        if (selectedHTML === this.inputElement.innerHTML ||
            (range.commonAncestorContainer === this.inputElement && selectedHTML === this.inputElement.textContent.trim())) {
            this.isSelectAll = true;
        }
        this.getDocument().execCommand('cut', false, null);
    }
    private onCopy(e: MouseEvent | KeyboardEvent | ClipboardEvent = null): void {
        if (e && this.editorMode === 'HTML' && this.handleTableCellCopy()) {
            // Copy was handled by table module
            e.preventDefault();
            return;
        }
        this.getDocument().execCommand('copy', false, null);
    }

    /*
    * Handles table cell copy operation when cells are selected.
    */
    private handleTableCellCopy(isCut: boolean = false): boolean {
        const range: Range = this.getRange();
        if (range &&
            range.startContainer &&
            this.tableModule &&
            this.tableModule.tableObj &&
            this.tableModule.tableObj.curTable &&
            this.tableModule.tableObj.curTable.contains(range.startContainer) &&
            this.tableModule.tableObj.curTable.querySelectorAll('.e-cell-select.e-multi-cells-select').length > 0) {
            this.tableModule.tableObj.copy(isCut);
            return true;
        }
        return false;
    }

    private updateEditorValue(e: CustomEvent): void {
        if (e.detail.click) {
            this.dotNetRef.invokeMethodAsync('UpdateValue', this.getUpdatedValue());
        }
    }
    private onPaste(e?: ClipboardEvent): void {
        if (!isNOU(select('.e-rte-img-dialog', this.element))) { return; }
        this.isPlainPaste = e && e.clipboardData && e.clipboardData.items && e.clipboardData.items.length
            && e.clipboardData.items.length === 1 && e.clipboardData.items[0].type === 'text/plain';
        const currentLength: number = this.getText().replace(/\u200B/g, '').replace(this.editorMode === 'HTML' ? /(\r\n|\n|\r|\t)/gm : '', '').length;
        const selectionLength: number = this.getSelection().length;
        const pastedContentLength: number = (isNOU(e) || isNOU(e.clipboardData))
            ? 0 : e.clipboardData.getData('text/plain').replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\u200B/g, '').length;
        const totalLength: number = (currentLength - selectionLength) + pastedContentLength;
        if (this.editorMode === 'Markdown') {
            const args: object = { requestType: 'Paste', editorMode: this.editorMode, event: e };
            this.formatter.onSuccess(this, args);
            if (!(this.maxLength === -1 || totalLength <= this.maxLength)) {
                e.preventDefault();
            }
            return;
        }
        if (this.inputElement.contentEditable === 'true' &&
            (this.maxLength === -1 || totalLength <= this.maxLength)) {
            const currentRange: Range = this.getRange();
            const codeBlockPasteAction: Element = (this.formatter.editorManager.codeBlockObj.
                isValidCodeBlockStructure(currentRange.startContainer)
                || this.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(currentRange.endContainer));
            if (isNOU(codeBlockPasteAction)) {
                this.observer.notify(events.pasteClean, { args: e as ClipboardEvent, isPlainPaste: this.isPlainPaste });
            } else {
                this.observer.notify(events.codeBlockPaste, { args: e });
            }
        } else {
            e.preventDefault();
        }
        this.isPlainPaste = false;
    }
    private onDocumentClick(e: MouseEvent): void {
        const target: HTMLElement = <HTMLElement>e.target;
        const rteElement: Element = closest(target, '.' + classes.CLS_RTE);
        if (!this.element.contains(e.target as Node) && document !== e.target && rteElement !== this.element &&
            !closest(target, '[aria-owns="' + this.element.id + '"]')) {
            this.isBlur = true;
            this.isRTE = false;
            if (!closest(target, '.' + classes.CLS_RTE_ELEMENTS)) {
                dispatchEvent(this.valueContainer, 'focusout');
            }
        }
        const hideQuickToolbarChecker: boolean = this.quickToolbarModule && !this.inlineMode.enable &&
            isNOU(this.quickToolbarModule.inlineQTBar);
        if ((hideQuickToolbarChecker && !isNOU(closest(target, '.' + 'e-toolbar-container'))) || (hideQuickToolbarChecker && (!isNOU(closest(target, '.e-rte-table-resize')) || !isNOU(closest(target, '.e-table-box'))))) {
            this.quickToolbarModule.hideQuickToolbars();
        }
        this.observer.notify(events.docClick, { args: e });
        this.removeHrFocus(e);
    }
    private removeHrFocus(e: MouseEvent): void {
        if (e.target && this.inputElement.querySelector('hr.e-rte-hr-focus')) {
            const hr: HTMLElement = this.inputElement.querySelector('hr.e-rte-hr-focus');
            hr.classList.remove('e-rte-hr-focus');
            if (hr.classList.length === 0) {
                hr.removeAttribute('class');
            }
        }
    }
    public propertyChangeHandler(newProps: { [key: string]: Object }): void {
        const oldProps: { [key: string]: Object } = {};
        let frameSetting: IFrameSettingsModel;
        let option: { [key: string]: number };
        let editElement: HTMLTextAreaElement;
        for (const prop of Object.keys(newProps)) {
            /* eslint-disable */
            oldProps[prop] = (this as any)[prop];
            /* eslint-enable */
        }
        const oldValue: string = this.value;
        this.updateContext(newProps);
        for (const prop of Object.keys(newProps)) {
            switch (prop) {
            case 'enableXhtml':
            case 'enableHtmlSanitizer':
            case 'value':
            case 'enterKey':
                if (prop === 'value' && oldValue === this.value) { break; }
                if (prop === 'enterKey' && (this.value === '<p><br/></p>' ||
                        this.value === '<div><br/></div>' || this.value === '<br/>' || this.value === '<p><br></p>' ||
                        this.value === '<div><br></div>' || this.value === '<br>')) {
                    this.value = getDefaultValue(this);
                }
                this.value = this.editorMode === 'HTML' ? this.replaceEntities(this.value) : this.value;
                this.setPanelValue(this.value);
                if (this.inputElement) {
                    this.observer.notify(events.tableclass, {});
                }
                if (this.enableXhtml) {
                    this.value = this.getXhtml();
                }
                this.addAudioVideoWrapper();
                break;
            case 'height':
                break;
            case 'width':
                this.resizeHandler(null, true);
                break;
            case 'readonly': this.setReadOnly(false); break;
            case 'enabled':
                if (this.enabled && !this.readonly) {
                    this.wireEvents();
                } else {
                    this.unWireEvents();
                }
                this.setEnable();
                break;
            case 'placeholder':
                this.setPlaceHolder();
                break;
            case 'enableResize':
                if (newProps[prop as string] && isNOU(this.resizeModule)) {
                    this.resizeModule = new Resize(this);
                    this.wireResizeEvents();
                } else if (this.resizeModule) {
                    this.resizeModule.destroy();
                    this.unWireResizeEvents();
                    this.resizeModule = null;
                }
                break;
            case 'showCharCount':
                if (this.showCharCount) {
                    if (isNOU(this.countModule)) { this.countModule = new Count(this); }
                } else if (this.showCharCount === false && this.countModule) {
                    this.countModule.destroy();
                    this.countModule = null;
                }
                break;
            case 'maxLength':
                if (this.showCharCount && this.countModule) { this.countModule.refresh(); }
                break;
            case 'enableHtmlEncode':
                this.updateValueData(); this.updatePanelValue(this.value, this.value); this.setPlaceHolder();
                if (this.showCharCount) { this.countModule.refresh(); }
                break;
            case 'undoRedoSteps':
            case 'undoRedoTimer':
                this.formatter.editorManager.observer.notify('model_changed', { newProp: newProps });
                break;
            case 'adapter':
                editElement = this.getEditPanel() as HTMLTextAreaElement;
                option = { undoRedoSteps: this.undoRedoSteps, undoRedoTimer: this.undoRedoTimer };
                if (this.editorMode === 'Markdown') {
                    this.formatter = new MarkdownFormatter(extend({}, this.adapter, {
                        element: editElement,
                        options: option
                    }));
                }
                break;
            case 'iframeSettings':
                frameSetting = oldProps[prop as string];
                if (frameSetting.resources) {
                    const iframe: HTMLDocument = this.getDocument();
                    const header: HTMLHeadElement = iframe.querySelector('head');
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
            case 'enableRtl':
                if (this.iframeSettings.enable && this.enableRtl) {
                    this.inputElement.classList.add('e-rtl');
                } else if (this.iframeSettings.enable && !this.enableRtl) {
                    if (this.inputElement.hasAttribute('class')) {
                        if (this.inputElement.classList.contains('e-rtl')) {
                            this.inputElement.classList.remove('e-rtl');
                        }
                    }
                }
                break;
            case 'quickToolbarSettings':
                if (this.quickToolbarSettings.enable) {
                    if (isNOU(this.quickToolbarModule)) { this.quickToolbarModule = new QuickToolbar(this); }
                    if (this.quickToolbarSettings.showOnRightClick) {
                        this.wireContextEvent();
                    } else {
                        this.unWireContextEvent();
                    }
                } else {
                    this.quickToolbarModule.destroy();
                    this.quickToolbarModule = null;
                }
                break;
            case 'toggleToolbar':
                this.toolbarSettings.enable = newProps[prop as string] as boolean;
                if (newProps[prop as string]) {
                    if (isNOU(this.toolbarModule)) {
                        this.isUndoRedoStatus();
                        this.toolbarModule = new Toolbar(this);
                        this.htmlEditorModule.toolbarUpdate = new HtmlToolbarStatus(this);
                    }
                } else {
                    this.toolbarModule.destroy();
                    this.toolbarModule = null;
                }
                break;
            case 'toolbarType':
                this.toolbarSettings.type = newProps[prop as string] as ToolbarType;
                this.toolbarCreated();
                break;
            case 'codeBlockSettings':
                this.codeBlockSettings = newProps[prop as string] as CodeBlockSettingsModel;
                break;
            case 'formatPainterSettings':
                this.formatter.editorManager.observer.notify(CONSTANT.MODEL_CHANGED, { module: 'formatPainter', newProp: newProps });
                break;
            }
        }
        this.autoResize();
        if (this.formatter) {
            this.formatter.editorManager.observer.notify(events.bindOnEnd, {});
            this.observer.notify(events.updateProperty, {});

        }
    }
    //#endregion

    /**
     *
     * @param {FocusEvent} e Focus event
     * @returns {string} Returns the current focus either `editArea` or `toolbar` or `textArea` or `sourceCode` or `outside` of the RichTextEditor.
     * @hidden
     * @private
     */
    private getCurrentFocus(e: FocusEvent): string {
        if (e.target === this.inputElement && document.activeElement === this.inputElement) {
            return 'editArea';
        } else if (e.target === this.getToolbarElement() || (!isNOU(e.relatedTarget) && closest(e.relatedTarget as Element, '.e-rte-toolbar') === this.getToolbarElement())) {
            return 'toolbar';
        } else if (e.target === this.valueContainer && document.activeElement === this.valueContainer) {
            return 'textArea';
        } else if (!isNOU(e.target) && (e.target as HTMLElement).classList.contains(classes.CLS_RTE_SOURCE_CODE_TXTAREA) &&
            document.activeElement === e.target) {
            return 'sourceCode';
        }
        return 'outside';
    }

    /**
     * @param {FocusEvent} e - specifies the event.
     * @returns {void}
     * @hidden
     */
    private resetToolbarTabIndex(): void {
        if (this.getToolbarElement()) {
            const toolbarItem: NodeList = this.getToolbarElement().querySelectorAll('input,select,button,a,[tabindex]');
            for (let i: number = 0; i < toolbarItem.length; i++) {
                if ((!(toolbarItem[i as number] as HTMLElement).classList.contains('e-rte-dropdown-btn') &&
                    !(toolbarItem[i as number] as HTMLElement).classList.contains('e-insert-table-btn')) &&
                    (!(toolbarItem[i as number] as HTMLElement).hasAttribute('tabindex') ||
                        (toolbarItem[i as number] as HTMLElement).getAttribute('tabindex') !== '-1')) {
                    (toolbarItem[i as number] as HTMLElement).setAttribute('tabindex', '-1');
                }
            }
        }
    }

    private cleanupResizeElements(args: CleanupResizeElemArgs): void {
        const value: string = cleanupInternalElements(args.value, this.editorMode);
        args.callBack(value);
    }

    public getDialogPosition(): string {
        let distanceFromVisibleTop: number = this.element.getBoundingClientRect().top;
        if (distanceFromVisibleTop < 0) {
            distanceFromVisibleTop = Math.abs(distanceFromVisibleTop);
            return distanceFromVisibleTop.toString();
        }
        else {
            return 'top';
        }
    }

    private getRenderedQuickToolbarElem(): HTMLElement | null {
        const quickToolbars: IBaseQuickToolbar[] = this.quickToolbarModule.getQuickToolbarInstance();
        for (let i: number = 0; i < quickToolbars.length; i++) {
            if (quickToolbars[i as number] && quickToolbars[i as number].isRendered) {
                return quickToolbars[i as number].element;
            }
        }
        return null;
    }

    private iframeLoadHandler(): void {
        this.autoResize();
    }

    private iframeEditableElemLoad(): void {
        this.autoResize();
    }

    /**
     * Clears the undo and redo stacks and resets the undo and redo toolbar status to disable the buttons.
     *
     * @returns {void}
     * @public
     */
    public clearUndoRedo(): void {
        if (!isNullOrUndefined(this.formatter)) {
            this.formatter.clearUndoRedoStack();
            this.formatter.enableUndo(this);
        }
    }

    public closePopup(): void {
        this.tableModule.closePopup();
    }

    // Utility to check if selection is within RTE
    private isSelectionInRTE(): boolean {
        const selection: Selection = this.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            const range: Range = selection.getRangeAt(0);
            if (range && (this.inputElement.contains(range.startContainer) &&
                this.inputElement.contains(range.endContainer))) {
                return true;
            }
        }
        return false;
    }

    // EventHandler for selectionchange event
    private selectionChangeHandler(event: Event): void {
        if (this.isSelectionInRTE() && !this.isSelectionCollapsed() && this.isSelectionStartInRTE) {
            this.isSelecting = true;
        }
    }

    // Checks the selection is within RTE
    private isMouseUpOutOfRTE(event: Event): boolean {
        const isTargetDocument: boolean = event.target && ((event.target as HTMLElement).nodeName === 'HTML' || (event.target as HTMLElement).nodeName === '#document');
        const isTargetNotRteElements: boolean = !(event.target && (event.target as HTMLElement).nodeName !== '#text' &&
            (event.target as HTMLElement).nodeName !== '#document' && (event.target as HTMLElement).nodeName !== 'HTML' &&
            ((event.target as HTMLElement).closest('.e-rte-elements') || (event.target as HTMLElement).closest('.e-rte-toolbar')));
        if (isTargetDocument || (!this.inputElement.contains(event.target as HTMLElement) && isTargetNotRteElements)) {
            return true;
        }
        return false;
    }

    // EventHandler for mouseup event
    private mouseUpHandlerForSelection(event: MouseEvent): void {
        if (this.isSelecting && this.isMouseUpOutOfRTE(event)) {
            this.endSelection(event);
        }
        this.isSelectionStartInRTE = false;
    }

    // End selection and trigger onTextSelection
    private endSelection(e: MouseEvent | KeyboardEvent): void {
        this.handleSelectionChange(e);
        this.isSelecting = false;
    }

    // Checks range is collapsed or not
    private isSelectionCollapsed(): boolean {
        const selection: Selection = this.getDocument().getSelection();
        const range: Range = selection && selection.rangeCount !== 0 && selection.getRangeAt(0);
        return (range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset);
    }

    // Handles selection changes and updates toolbar and quick toolbar based on user interaction
    private handleSelectionChange(e: MouseEvent | KeyboardEvent): void {
        // If selection was made and mouseup occurred (even outside the RTE), trigger quick toolbars
        if (this.inlineMode.enable === true) {
            this.observer.notify(events.selectionChangeMouseUp, { args: e });
        }
        // Determine if quick toolbar should be rendered based on settings and event type
        const shouldRenderQuickToolbar: boolean | (string | IToolbarItems)[] = (!this.inlineMode.enable && this.quickToolbarSettings && (this.quickToolbarSettings.text || (this.quickToolbarSettings.link && e.type === 'mouseup')));
        // Render quick toolbar and notify selectionChangeMouseUp for quicktoolbar functionalities
        if (shouldRenderQuickToolbar) {
            this.observer.notify(events.selectionChangeMouseUp, { args: e });
        }
        // Update the toolbar to reflect current selection state
        if (!(this.quickToolbarModule.linkQTBar && this.quickToolbarModule.linkQTBar.element && this.quickToolbarModule.linkQTBar.element.classList.contains('e-popup-open'))) {
            this.observer.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerOnSelectionChange();
    }
}
