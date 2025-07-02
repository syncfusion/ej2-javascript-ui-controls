import { createElement, EventHandler, isNullOrUndefined, KeyboardEventArgs, removeClass, selectAll } from '../../../base'; /*externalscript*/
import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/
import { IHtmlKeyboardEvent } from '../../src/editor-manager/base/interface';
import { ActionBeginEventArgs, ActionCompleteEventArgs } from '../../src/common/interface';
import { KeyboardEvents } from '../actions/keyboard';
import { CLS_ACTIVE, CLS_EXPAND_OPEN, CLS_RTE_SOURCE_CODE_TXTAREA, CLS_RTE_SRC_CONTENT, CLS_TB_ITEM } from '../classes';
import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { decode } from './../util';
import { cleanupInternalElements, resetContentEditableElements} from '../../src/common/util';
import { cleanHTMLString } from '../../src/common/util';

/**
 * Content module is used to render Rich Text Editor content
 */
export class ViewSource {
    private parent: SfRichTextEditor;
    private previewElement: HTMLElement;
    private keyboardModule: KeyboardEvents;
    private codeViewTimeInterval: number;
    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(events.sourceCode, this.sourceCode, this);
        this.parent.observer.on(events.initialEnd, this.onInitialEnd, this);
        this.parent.observer.on(events.updateSource, this.updateSourceCode, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }
    private onInitialEnd(): void {
        this.parent.formatter.editorManager.observer.on('keydown-handler', this.onKeyDown, this);
    }
    private removeEventListener(): void {
        this.unWireEvent();
        this.parent.observer.off(events.sourceCode, this.sourceCode);
        this.parent.observer.off(events.updateSource, this.updateSourceCode);
        this.parent.observer.off(events.initialEnd, this.onInitialEnd);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.formatter.editorManager.observer.off('keydown-handler', this.onKeyDown);
    }
    private getSourceCode(): HTMLElement | HTMLTextAreaElement | void {
        return createElement('textarea', { className: CLS_RTE_SOURCE_CODE_TXTAREA, attrs: { 'aria-labelledby': this.parent.element.id + '_rte-edit-view' } });
    }
    private wireEvent(element: HTMLElement): void {
        this.keyboardModule = new KeyboardEvents(element, {
            keyAction: this.previewKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
        EventHandler.add(this.previewElement, 'mousedown', this.mouseDownHandler, this);
    }
    private unWireEvent(): void {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        if (this.previewElement) {
            EventHandler.remove(this.previewElement, 'mousedown', this.mouseDownHandler);
        }
    }
    private wireBaseKeyDown(): void {
        this.parent.keyboardModule = new KeyboardEvents(
            this.parent.getEditPanel() as HTMLElement, {
                keyAction: this.parent.keyDown.bind(this.parent), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
            });
    }
    private unWireBaseKeyDown(): void {
        this.parent.keyboardModule.destroy();
    }
    private mouseDownHandler(e: MouseEvent): void {
        this.parent.observer.notify(events.sourceCodeMouseDown, { args: e });
    }
    private previewKeyDown(event: KeyboardEventArgs): void {
        switch (event.action) {
        case 'html-source':
            this.parent.dotNetRef.invokeMethodAsync('PreviewCodeClient');
            this.updateSourceCode(event);
            event.preventDefault();
            break;
        case 'toolbar-focus':
            if (this.parent.toolbarSettings.enable && this.parent.getToolbarElement()) {
                const firstActiveItem: HTMLElement = this.parent.getToolbarElement().querySelector('.e-toolbar-item:not(.e-overlay)[title]');
                (firstActiveItem.firstElementChild as HTMLElement).removeAttribute('tabindex');
                (firstActiveItem.firstElementChild as HTMLElement).focus();
            }
            break;
        case 'escape':
            if (this.parent.element.classList.contains('e-rte-full-screen')) {
                this.parent.dotNetRef.invokeMethodAsync('HideFullScreenClient');
                this.parent.fullScreenModule.hideFullScreen(event);
                event.preventDefault();
            }
            break;
        case 'full-screen':
            this.parent.dotNetRef.invokeMethodAsync('ShowFullScreenClient');
            this.parent.fullScreenModule.showFullScreen(event);
            event.preventDefault();
            break;
        }
    }
    private onKeyDown(e: IHtmlKeyboardEvent): void {
        switch (e.event.action) {
        case 'html-source':
            e.event.preventDefault();
            this.parent.dotNetRef.invokeMethodAsync('ViewSourceClient');
            this.sourceCode(e);
            e.callBack({
                requestType: 'SourceCode',
                editorMode: 'HTML',
                event: e.event
            });
            break;
        }
    }
    public sourceCode(args?: ClickEventArgs | IHtmlKeyboardEvent): void {
        this.parent.isBlur = false;
        if (!isNullOrUndefined(this.parent.quickToolbarModule.textQTBar) &&
            !isNullOrUndefined(this.parent.quickToolbarModule.textQTBar.element) &&
            this.parent.quickToolbarModule.textQTBar.element.classList.contains('e-popup-open')) {
            this.parent.quickToolbarModule.hideTextQTBar();
        }
        (this.parent.dotNetRef.invokeMethodAsync('ActionBeginEvent', { requestType: 'SourceCode', cancel: false }) as unknown as Promise<ActionBeginEventArgs>).then(
            (sourceArgs: ActionBeginEventArgs) => {
                if (!sourceArgs.cancel) {
                    const tbItems: HTMLElement[] = selectAll('.' + CLS_TB_ITEM, this.parent.element);
                    if (isNullOrUndefined(this.previewElement)) {
                        this.previewElement = this.getSourceCode() as HTMLElement;
                    }
                    this.parent.inputElement.innerHTML = cleanupInternalElements(
                        this.replaceAmpersand(this.parent.inputElement.innerHTML), this.parent.editorMode);
                    this.parent.updateValueData();
                    let rteContent: HTMLElement;
                    const height: number = this.parent.inputElement.getBoundingClientRect().height;
                    if (isNullOrUndefined(this.parent.element.querySelector('#' + this.parent.element.id + '_source-view'))) {
                        rteContent = createElement('div', {
                            className: 'e-source-content', id: this.parent.element.id + '_source-view',
                            attrs: { style: 'height:' + height + 'px' }
                        });
                    } else {
                        rteContent = this.parent.element.querySelector('#' + this.parent.element.id + '_source-view') as HTMLElement;
                        rteContent.style.height = height + 'px';
                    }
                    rteContent.appendChild(this.previewElement);
                    // Check if toolbar should be at the bottom
                    const isToolbarBottom: boolean = this.parent.toolbarSettings && (this.parent.toolbarSettings.position === 'Bottom');
                    const toolbarWrapper: HTMLElement = this.parent.element.querySelector('.e-toolbar-container') as HTMLElement;
                    // Handle toolbar positioning
                    if (isToolbarBottom && toolbarWrapper) {
                        // If toolbar is at bottom, insert rteContent before the toolbar
                        this.parent.rootContainer.insertBefore(rteContent, toolbarWrapper);
                    } else {
                        // If toolbar is at top or not present, append rteContent at the end
                        this.parent.rootContainer.appendChild(rteContent);
                    }
                    this.parent.rootContainer.classList.add('e-source-code-enabled');
                    (this.getPanel() as HTMLTextAreaElement).value = cleanupInternalElements(
                        this.getTextAreaValue(this.parent.getEditPanel() as HTMLElement), this.parent.editorMode);
                    this.parent.isBlur = false;
                    if (this.parent.getToolbar()) { removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]); }
                    removeClass(tbItems, [CLS_ACTIVE]);
                    this.wireEvent(this.previewElement);
                    this.unWireBaseKeyDown();
                    this.previewElement.focus();
                    this.parent.inputElement.innerHTML = cleanupInternalElements(this.replaceAmpersand(
                        this.parent.inputElement.innerHTML), this.parent.editorMode);
                    (this.parent.dotNetRef.invokeMethodAsync(
                        'ActionCompleteEvent', { requestType: 'SourceCode' }) as unknown as Promise<ActionCompleteEventArgs>).then((completeArgs: ActionCompleteEventArgs) => {
                        this.parent.invokeChangeEvent();
                    });
                    if (!isNullOrUndefined(this.parent.saveInterval) && this.parent.saveInterval > 0 && this.parent.autoSaveOnIdle) {
                        this.codeViewTimeInterval = setInterval(() => { this.parent.observer.notify(events.updateValueOnIdle, {}); },
                                                                this.parent.saveInterval);
                    }
                }
            });
    }
    public updateSourceCode(args?: ClickEventArgs | KeyboardEventArgs): void {
        this.parent.isBlur = false;
        (this.parent.dotNetRef.invokeMethodAsync('ActionBeginEvent', { requestType: 'Preview', cancel: false }) as unknown as Promise<ActionBeginEventArgs>).then(
            (previewArgs: ActionBeginEventArgs) => {
                if (!previewArgs.cancel) {
                    const editHTML: HTMLTextAreaElement = this.getPanel() as HTMLTextAreaElement;
                    if (!isNullOrUndefined(editHTML)) {
                        editHTML.value = this.parent.enableHtmlSanitizer ? cleanHTMLString(this.parent.htmlEditorModule.sanitizeHelper(
                            editHTML.value), this.parent.element) : cleanHTMLString(editHTML.value, this.parent.element);
                        editHTML.value = this.replaceAmpersand(editHTML.value);
                    }
                    const serializeValue: string = this.parent.serializeValue(editHTML.value);
                    let value: string;
                    if (serializeValue === null || serializeValue === '') {
                        if (this.parent.enterKey === 'DIV') {
                            value = '<div><br/></div>';
                        } else if (this.parent.enterKey === 'BR') {
                            value = '<br/>';
                        } else {
                            value = '<p><br/></p>';
                        }
                    } else {
                        value = serializeValue;
                    }
                    value = resetContentEditableElements(value, this.parent.editorMode);
                    this.parent.rootContainer.classList.remove('e-source-code-enabled');
                    this.parent.getEditPanel().innerHTML = this.replaceAmpersand(value);
                    this.parent.isBlur = false;
                    if (this.parent.getToolbar()) { removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]); }
                    this.unWireEvent();
                    this.wireBaseKeyDown();
                    (this.parent.getEditPanel() as HTMLElement).focus();
                    this.parent.updateValueData();
                    this.parent.addAudioVideoWrapper();
                    clearTimeout(this.codeViewTimeInterval);
                    (this.parent.dotNetRef.invokeMethodAsync(
                        'ActionCompleteEvent', { requestType: 'Preview' })  as unknown as Promise<ActionCompleteEventArgs>).then((previewArgs: ActionCompleteEventArgs) => {
                        this.parent.invokeChangeEvent();
                    });
                    this.parent.observer.notify(events.tableclass, {});
                    if (this.parent.editorMode === 'HTML') {
                        this.parent.codeBlockModule.disableToolbarItems();
                    }
                }
            });
    }
    private replaceAmpersand(value: string): string {
        if (this.parent.editorMode === 'HTML') {
            const entities: string[] = ['times', 'divide', 'ne'];
            entities.forEach((entity: string) => {
                // eslint-disable-next-line security/detect-non-literal-regexp
                const regex: RegExp = new RegExp(`&(amp;)*(${entity})`, 'g');
                if (this.parent.enableHtmlSanitizer) {
                    const ampEntity: string = this.parent.enableHtmlEncode ? `&amp;amp;amp;amp;${entity}` : `&amp;amp;${entity}`;
                    value = value.replace(regex, ampEntity);
                } else {
                    value = value.replace(regex, `&amp;${entity}`);
                }
            });
        }
        return value;
    }
    private getTextAreaValue(element: HTMLElement): string {
        const currentValue: string = this.parent.enableXhtml ? this.parent.getXhtmlString(this.parent.value) : this.parent.value;
        return (element.innerHTML === '<p><br></p>') || (element.innerHTML === '<div><br></div>') ||
            (element.innerHTML === '<br>') ||
            (element.childNodes.length === 1 &&
                (((element.childNodes[0] as HTMLElement).tagName === 'P' &&
                    element.innerHTML.length === 7) || ((element.childNodes[0] as HTMLElement).tagName === 'DIV' &&
                        element.innerHTML.length === 11))) ? '' : currentValue;
    }
    public getPanel(): HTMLTextAreaElement | Element {
        return this.parent.element.querySelector('.' + CLS_RTE_SOURCE_CODE_TXTAREA);
    }
    public getViewPanel(): HTMLTextAreaElement | Element {
        return this.parent.element.querySelector('.' + CLS_RTE_SRC_CONTENT);
    }
    public destroy(): void {
        this.removeEventListener();
    }
}
