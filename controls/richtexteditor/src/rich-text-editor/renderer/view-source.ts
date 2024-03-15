import { KeyboardEventArgs, removeClass, selectAll, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { IRichTextEditor, IRenderer } from '../base/interface';
import * as events from '../base/constant';
import { CLS_EXPAND_OPEN, CLS_TB_ITEM, CLS_ACTIVE, CLS_RTE_SOURCE_CODE_TXTAREA } from '../base/classes';
import * as CONSTANT from '../../common/constant';
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { KeyboardEvents } from '../actions/keyboard';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

/**
 * Content module is used to render Rich Text Editor content
 *
 * @hidden
 * @deprecated
 */
export class ViewSource {
    private parent: IRichTextEditor;
    private contentModule: IRenderer;
    private rendererFactory: RendererFactory;
    private keyboardModule: KeyboardEvents;
    private previewElement: HTMLElement;
    private codeViewTimeInterval: number;

    /**
     * Constructor for view source module
     *
     * @param {IRichTextEditor} parent - specifies the parent element.
     * @param {ServiceLocator} locator - specifies the locator.
     * @returns {void}
     */
    public constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        const serviceLocator: ServiceLocator = locator;
        this.rendererFactory = serviceLocator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on(events.sourceCode, this.sourceCode, this);
        this.parent.on(events.initialEnd, this.onInitialEnd, this);
        this.parent.on(events.updateSource, this.updateSourceCode, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.moduleDestroy, this.moduleDestroy, this);
    }

    private onInitialEnd(): void {
        this.parent.formatter.editorManager.observer.on(CONSTANT.KEY_DOWN_HANDLER, this.onKeyDown, this);
    }

    private removeEventListener(): void {
        this.unWireEvent();
        this.parent.off(events.sourceCode, this.sourceCode);
        this.parent.off(events.updateSource, this.updateSourceCode);
        this.parent.off(events.initialEnd, this.onInitialEnd);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.moduleDestroy, this.moduleDestroy);
        this.parent.formatter.editorManager.observer.off(CONSTANT.KEY_DOWN_HANDLER, this.onKeyDown);
    }

    private getSourceCode(): HTMLElement | HTMLTextAreaElement | void {
        return this.parent.createElement('textarea', { className: CLS_RTE_SOURCE_CODE_TXTAREA + this.parent.getCssClass(true) });
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
            this.contentModule.getEditPanel() as HTMLElement, {
                keyAction: this.parent.keyDown.bind(this.parent), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
            });
    }
    private unWireBaseKeyDown(): void {
        this.parent.keyboardModule.destroy();
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.parent.notify(events.sourceCodeMouseDown, { args: e });
    }

    private previewKeyDown(event: KeyboardEventArgs): void {
        switch (event.action) {
        case 'html-source':
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
        }
    }

    private onKeyDown(e: IHtmlKeyboardEvent): void {
        switch (e.event.action) {
        case 'html-source':
            e.event.preventDefault();
            this.sourceCode(e);
            e.callBack({
                requestType: 'SourceCode',
                editorMode: 'HTML',
                event: e.event
            });
            break;
        }
    }

    /**
     * sourceCode method
     *
     * @param {ClickEventArgs} args - specifies the click event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public sourceCode(args?: ClickEventArgs | IHtmlKeyboardEvent): void {
        this.parent.notify(events.hidePopup, {});
        this.parent.isBlur = false;
        this.parent.trigger(events.actionBegin, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        const tbItems: HTMLElement[] = selectAll('.' + CLS_TB_ITEM, this.parent.element);
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        this.parent.notify(events.updateToolbarItem, {
            targetItem: 'SourceCode', updateItem: 'Preview',
            baseToolbar: this.parent.getBaseToolbarObject()
        });
        if (isNullOrUndefined(this.previewElement)) {
            this.previewElement = this.getSourceCode() as HTMLElement;
        }
        this.parent.updateValueData();
        if (this.parent.iframeSettings.enable) {
            let rteContent: HTMLElement;
            if (isNullOrUndefined(this.parent.element.querySelector('#' + this.parent.getID() + '_source-view'))) {
                rteContent = this.parent.createElement('div', {
                    className: 'e-source-content', id: this.parent.getID() + '_source-view'
                });
            } else {
                rteContent = this.parent.element.querySelector('#' + this.parent.getID() + '_source-view') as HTMLElement;
            }
            rteContent.appendChild(this.previewElement);
            this.parent.element.appendChild(rteContent);
            rteContent.style.height = (this.contentModule.getPanel() as HTMLElement).style.height;
            (this.getPanel() as HTMLTextAreaElement).value = this.getTextAreaValue();
            (this.contentModule.getPanel() as HTMLElement).style.display = 'none';
            rteContent.style.display = 'block';
            (this.getPanel() as HTMLTextAreaElement).style.display = 'block';
        } else {
            const height: number = this.parent.inputElement.offsetHeight;
            this.contentModule.getPanel().appendChild(this.previewElement);
            (this.getPanel() as HTMLTextAreaElement).value = this.getTextAreaValue();
            this.previewElement.style.height = height + 'px';
            (this.contentModule.getEditPanel() as HTMLElement).style.display = 'none';
            this.previewElement.style.display = 'block';
        }
        this.parent.isBlur = false;
        this.parent.disableToolbarItem(this.parent.toolbarSettings.items as string[]);
        this.parent.enableToolbarItem('SourceCode');
        if (this.parent.getToolbar()) {
            removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
        }
        removeClass(tbItems, [CLS_ACTIVE]);
        const isExpand: boolean = this.parent.element.querySelectorAll('.e-toolbar-extended.e-popup-open').length > 0 ? true : false;
        this.parent.setContentHeight('SourceCode', isExpand);
        this.wireEvent(this.previewElement);
        this.unWireBaseKeyDown();
        this.previewElement.focus();
        this.parent.updateValue();
        if (!isNullOrUndefined(this.parent.placeholder) && !this.parent.iframeSettings.enable) {
            const placeHolderWrapper: HTMLElement = this.parent.element.querySelector('.rte-placeholder.e-rte-placeholder') as HTMLElement;
            if (placeHolderWrapper) {
                placeHolderWrapper.style.display = 'none';
            }
        }
        this.parent.trigger(events.actionComplete, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        this.parent.invokeChangeEvent();
        if (!isNullOrUndefined(this.parent.saveInterval) && this.parent.saveInterval > 0 && this.parent.autoSaveOnIdle) {
            this.codeViewTimeInterval = setInterval(()=>{this.parent.notify(events.updateValueOnIdle,{})}, this.parent.saveInterval);
        }
    }

    /**
     * updateSourceCode method
     *
     * @param {ClickEventArgs} args - specifies the click event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public updateSourceCode(args?: ClickEventArgs | KeyboardEventArgs): void {
        this.parent.isBlur = false;
        this.parent.trigger(events.actionBegin, { requestType: 'Preview', targetItem: 'Preview', args: args });
        const editHTML: HTMLTextAreaElement = this.getPanel() as HTMLTextAreaElement;
        this.parent.notify(events.updateToolbarItem, {
            targetItem: 'Preview', updateItem: 'SourceCode',
            baseToolbar: this.parent.getBaseToolbarObject()
        });
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
        if (this.parent.iframeSettings.enable) {
            editHTML.parentElement.style.display = 'none';
            editHTML.style.display = 'none';
            (this.contentModule.getPanel() as HTMLElement).style.display = 'block';
            this.contentModule.getEditPanel().innerHTML = value;
        } else {
            editHTML.style.display = 'none';
            (this.contentModule.getEditPanel() as HTMLElement).style.display = 'block';
            this.contentModule.getEditPanel().innerHTML = value;
        }
        this.parent.isBlur = false;
        this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
        if (this.parent.getToolbar()) {
            removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
        }
        const isExpand: boolean = this.parent.element.querySelectorAll('.e-toolbar-extended.e-popup-open').length > 0 ? true : false;
        this.parent.setContentHeight('Preview', isExpand);
        this.unWireEvent();
        this.wireBaseKeyDown();
        (this.contentModule.getEditPanel() as HTMLElement).focus();
        this.parent.updateValue();
        if (!isNullOrUndefined(this.parent.placeholder) && (this.contentModule.getEditPanel() as HTMLElement).innerText.length === 0) {
            const placeHolderWrapper: HTMLElement = this.parent.element.querySelector('.rte-placeholder.e-rte-placeholder') as HTMLElement;
            placeHolderWrapper.style.display = 'block';
        }
        this.parent.trigger(events.actionComplete, { requestType: 'Preview', targetItem: 'Preview', args: args });
        this.parent.formatter.enableUndo(this.parent);
        this.parent.addAudioVideoWrapper();
        clearTimeout(this.codeViewTimeInterval);
        this.parent.invokeChangeEvent();
        this.parent.notify(events.tableclass, {});
    }

    private getTextAreaValue(): string {
        return (this.contentModule.getEditPanel().innerHTML === '<p><br></p>') ||
        (this.contentModule.getEditPanel().innerHTML === '<div><br></div>') ||
        (this.contentModule.getEditPanel().innerHTML === '<br>') ||
            (this.contentModule.getEditPanel().childNodes.length === 1 &&
            ((this.contentModule.getEditPanel().childNodes[0] as HTMLElement).tagName === 'P' &&
            this.contentModule.getEditPanel().innerHTML.length === 7) ||
            ((this.contentModule.getEditPanel().childNodes[0] as HTMLElement).tagName === 'DIV' &&
            this.contentModule.getEditPanel().innerHTML.length === 11)) ? '' : this.parent.value;
    }

    /**
     * getPanel method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getPanel(): HTMLTextAreaElement | Element {
        return this.parent.element && this.parent.element.querySelector('.e-rte-srctextarea');
    }

    /**
     * getViewPanel method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getViewPanel(): HTMLTextAreaElement | Element {
        return (this.parent.iframeSettings.enable && this.getPanel()) ? this.getPanel().parentElement : this.getPanel();
    }

    /**
     * Destroy the entire RichTextEditor.
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (isNullOrUndefined(this.parent)) { return; }
        this.removeEventListener();
    }

    private moduleDestroy(): void {
        this.parent = null;
    }
}
