import { removeClass, selectAll, createElement, EventHandler, KeyboardEvents } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { decode } from './../util';
import { ActionBeginEventArgs } from '../../src';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import * as events from '../../src/rich-text-editor/base/constant';
import { IHtmlKeyboardEvent } from '../../src/editor-manager/base/interface';
import { CLS_EXPAND_OPEN, CLS_TB_ITEM, CLS_ACTIVE } from '../../src/rich-text-editor/base/classes';

/**
 * Content module is used to render Rich Text Editor content
 */
export class ViewSource {
    private parent: SfRichTextEditor;
    private previewElement: HTMLElement;
    private keyboardModule: KeyboardEvents;
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
        return createElement('textarea', { className: 'e-rte-srctextarea' });
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
        this.keyboardModule = new KeyboardEvents(
            this.parent.getEditPanel() as HTMLElement, {
            keyAction: this.parent.keyDown.bind(this.parent), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
    }
    private unWireBaseKeyDown(): void {
        this.keyboardModule.destroy();
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
                if (this.parent.toolbarSettings.enable) {
                    let selector: string = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
                    (this.parent.getToolbar().querySelector(selector) as HTMLElement).focus();
                }
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
        // @ts-ignore-start
        this.parent.dotNetRef.invokeMethodAsync('ActionBeginEvent', { requestType: 'SourceCode', cancel: false }).then(
            (sourceArgs: ActionBeginEventArgs) => {
            // @ts-ignore-end
            if (!sourceArgs.cancel) {
                let tbItems: HTMLElement[] = selectAll('.' + CLS_TB_ITEM, this.parent.element);
                if (isNullOrUndefined(this.previewElement)) {
                    this.previewElement = this.getSourceCode() as HTMLElement;
                }
                this.parent.updateValueData();
                if (this.parent.iframeSettings.enable) {
                    let rteContent: HTMLElement;
                    if (isNullOrUndefined(this.parent.element.querySelector('#' + this.parent.element.id + '_source-view'))) {
                        rteContent = createElement('div', {
                            className: 'e-source-content', id: this.parent.element.id + '_source-view'
                        });
                    } else {
                        rteContent = this.parent.element.querySelector('#' + this.parent.element.id + '_source-view') as HTMLElement;
                    }
                    rteContent.appendChild(this.previewElement);
                    this.parent.element.appendChild(rteContent);
                    rteContent.style.height = (this.parent.getPanel() as HTMLElement).style.height;
                    rteContent.style.marginTop = (this.parent.getPanel() as HTMLElement).style.marginTop;
                    (this.getPanel() as HTMLTextAreaElement).value = this.getTextAreaValue(this.parent.getPanel() as HTMLElement);
                    (this.parent.getPanel() as HTMLElement).style.display = 'none';
                    rteContent.style.display = 'block';
                } else {
                    this.parent.inputElement.parentElement.appendChild(this.previewElement);
                    (this.getPanel() as HTMLTextAreaElement).value = this.getTextAreaValue(this.parent.getEditPanel() as HTMLElement);
                    this.parent.inputElement.style.display = 'none';
                    this.previewElement.style.display = 'block';
                }
                this.parent.isBlur = false;
                if (this.parent.getToolbar()) { removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]); }
                removeClass(tbItems, [CLS_ACTIVE]);
                this.parent.setContentHeight('sourceCode', true);
                this.wireEvent(this.previewElement);
                this.unWireBaseKeyDown();
                this.previewElement.focus();
                this.parent.updateValue();
                if (!isNullOrUndefined(this.parent.placeholder) && !this.parent.iframeSettings.enable) {
                    let placeHolderContainer: HTMLElement = this.parent.element.querySelector('.rte-placeholder') as HTMLElement;
                    placeHolderContainer.style.display = 'none';
                }
                this.parent.dotNetRef.invokeMethodAsync(
                    // @ts-ignore-start
                    'ActionCompleteEvent', { requestType: 'SourceCode' }).then((completeArgs: ActionCompleteEventArgs) => {
                    // @ts-ignore-end
                    this.parent.invokeChangeEvent();
                });
            }
        });
    }
    public updateSourceCode(args?: ClickEventArgs | KeyboardEventArgs): void {
        this.parent.isBlur = false;
        // @ts-ignore-start
        this.parent.dotNetRef.invokeMethodAsync('ActionBeginEvent', { requestType: 'Preview', cancel: false }).then(
            (previewArgs: ActionBeginEventArgs) => {
            // @ts-ignore-end
            if (!previewArgs.cancel) {
                let editHTML: HTMLTextAreaElement = this.getPanel() as HTMLTextAreaElement;
                let serializeValue: string = this.parent.serializeValue(editHTML.value);
                let value: string = (serializeValue === null || serializeValue === '') ? '<p><br/></p>' : serializeValue;
                if (this.parent.iframeSettings.enable) {
                    editHTML.parentElement.style.display = 'none';
                    (this.parent.contentPanel as HTMLElement).style.display = 'block';
                    this.parent.getEditPanel().innerHTML = this.parent.enableHtmlEncode ? decode(value) : value;
                } else {
                    editHTML.style.display = 'none';
                    (this.parent.getEditPanel() as HTMLElement).style.display = 'block';
                    (this.parent.getEditPanel() as HTMLElement).innerHTML = this.parent.enableHtmlEncode ? decode(value) : value;
                }
                this.parent.isBlur = false;
                if (this.parent.getToolbar()) { removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]); }
                this.parent.setContentHeight('preview', true);
                this.unWireEvent();
                this.wireBaseKeyDown();
                (this.parent.getEditPanel() as HTMLElement).focus();
                this.parent.updateValue();
                if (!isNullOrUndefined(this.parent.placeholder) && (this.parent.getEditPanel() as HTMLElement).innerText.length === 0) {
                    let placeHolderContainer: HTMLElement = this.parent.element.querySelector('.rte-placeholder') as HTMLElement;
                    placeHolderContainer.style.display = 'block';
                }
                this.parent.dotNetRef.invokeMethodAsync(
                    // @ts-ignore-start
                    'ActionCompleteEvent', { requestType: 'Preview' }).then((previewArgs: ActionCompleteEventArgs) => {
                    // @ts-ignore-end
                    this.parent.invokeChangeEvent();
                });
            }
        });
    }
    private getTextAreaValue(element: HTMLElement): string {
        return (element.innerHTML === '<p><br></p>') ||
            (element.childNodes.length === 1 &&
                (element.childNodes[0] as HTMLElement).tagName === 'P' &&
                element.innerHTML.length === 7) ? '' : this.parent.value;
    }
    public getPanel(): HTMLTextAreaElement | Element {
        return this.parent.element.querySelector('.e-rte-srctextarea');
    }
    public getViewPanel(): HTMLTextAreaElement | Element {
        return (this.parent.iframeSettings.enable && this.getPanel()) ? this.getPanel().parentElement : this.getPanel();
    }
    public destroy(): void {
        this.removeEventListener();
    }
}