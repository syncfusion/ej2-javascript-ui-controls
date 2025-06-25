import { KeyboardEventArgs, removeClass, selectAll, isNullOrUndefined as isNOU, EventHandler } from '@syncfusion/ej2-base';
import { IRichTextEditor, IRenderer } from '../base/interface';
import { ActionBeginEventArgs } from '../../common/interface';
import * as events from '../base/constant';
import { CLS_EXPAND_OPEN, CLS_TB_ITEM, CLS_ACTIVE, CLS_RTE_SOURCE_CODE_TXTAREA } from '../base/classes';
import * as CONSTANT from '../../common/constant';
import { IHtmlKeyboardEvent } from '../../editor-manager/base/interface';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { KeyboardEvents } from '../actions/keyboard';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { cleanHTMLString, resetContentEditableElements, cleanupInternalElements } from '../../common/util';

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
        if (this.previewElement) {
            EventHandler.remove(this.previewElement, 'mousedown', this.mouseDownHandler);
        }
        if (this.keyboardModule && !this.keyboardModule.isDestroyed) {
            this.keyboardModule.destroy();
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
        this.parent.trigger(events.actionBegin, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args, cancel: false }, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                const tbItems: HTMLElement[] = selectAll('.' + CLS_TB_ITEM, this.parent.element);
                this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
                const height: number = this.parent.inputElement.getBoundingClientRect().height;
                this.parent.rootContainer.classList.add('e-source-code-enabled');
                this.parent.notify(events.updateToolbarItem, {
                    targetItem: 'SourceCode', updateItem: 'Preview',
                    baseToolbar: this.parent.getBaseToolbarObject()
                });
                if (isNOU(this.previewElement)) {
                    this.previewElement = this.getSourceCode() as HTMLElement;
                }
                this.parent.inputElement.innerHTML = cleanupInternalElements(this.replaceAmpersand(this.parent.inputElement.innerHTML),
                                                                             this.parent.editorMode);
                this.parent.updateValueData();
                let rteContent: HTMLElement;
                if (isNOU(this.parent.element.querySelector('#' + this.parent.getID() + '_source-view'))) {
                    rteContent = this.parent.createElement('div', {
                        className: 'e-source-content', id: this.parent.getID() + '_source-view',
                        attrs: { style: 'height:' + height + 'px'}
                    });
                } else {
                    rteContent = this.parent.element.querySelector('#' + this.parent.getID() + '_source-view') as HTMLElement;
                    rteContent.style.height = height + 'px';
                }
                rteContent.appendChild(this.previewElement);
                this.parent.rootContainer.appendChild(rteContent);
                (this.getPanel() as HTMLTextAreaElement).value = cleanupInternalElements(this.getTextAreaValue(), this.parent.editorMode);
                this.parent.isBlur = false;
                this.parent.disableToolbarItem(this.parent.toolbarSettings.items as string[]);
                this.parent.enableToolbarItem('SourceCode');
                if (this.parent.getToolbar()) {
                    removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
                }
                removeClass(tbItems, [CLS_ACTIVE]);
                this.wireEvent(this.previewElement);
                this.unWireBaseKeyDown();
                this.previewElement.focus();
                this.parent.inputElement.innerHTML = cleanupInternalElements(this.replaceAmpersand(this.parent.inputElement.innerHTML),
                                                                             this.parent.editorMode);
                this.parent.updateValue();
                this.parent.trigger(events.actionComplete, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
                this.parent.invokeChangeEvent();
                if (!isNOU(this.parent.saveInterval) && this.parent.saveInterval > 0 && this.parent.autoSaveOnIdle) {
                    this.codeViewTimeInterval = setInterval(() =>
                    {this.parent.notify(events.updateValueOnIdle, {}); }, this.parent.saveInterval);
                }
            }
        });
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
        this.parent.trigger(events.actionBegin, { requestType: 'Preview', targetItem: 'Preview', args: args, cancel: false }, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                this.parent.rootContainer.classList.remove('e-source-code-enabled');
                const editHTML: HTMLTextAreaElement = this.getPanel() as HTMLTextAreaElement;
                this.parent.notify(events.updateToolbarItem, {
                    targetItem: 'Preview', updateItem: 'SourceCode',
                    baseToolbar: this.parent.getBaseToolbarObject()
                });
                if (!isNOU(editHTML)) {
                    editHTML.value = cleanHTMLString(editHTML.value, this.parent.element);
                    editHTML.value = resetContentEditableElements(this.replaceAmpersand(editHTML.value), this.parent.editorMode);
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
                this.contentModule.getEditPanel().innerHTML = resetContentEditableElements(this.replaceAmpersand(value),
                                                                                           this.parent.editorMode);
                this.parent.isBlur = false;
                this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
                if (this.parent.getToolbar()) {
                    removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
                }
                this.unWireEvent();
                this.wireBaseKeyDown();
                (this.contentModule.getEditPanel() as HTMLElement).focus();
                this.parent.updateValue();
                this.parent.trigger(events.actionComplete, { requestType: 'Preview', targetItem: 'Preview', args: args });
                this.parent.formatter.enableUndo(this.parent);
                this.parent.addAudioVideoWrapper();
                clearTimeout(this.codeViewTimeInterval);
                this.parent.invokeChangeEvent();
                this.parent.notify(events.tableclass, {});
                if (this.parent.editorMode === 'HTML' && !isNOU(this.parent.codeBlockModule)) {
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
     * @returns {HTMLTextAreaElement} - Specifies the Souce codetext area element.
     * @hidden
     * @deprecated
     */
    public getPanel(): HTMLTextAreaElement {
        return this.parent.element && this.parent.element.querySelector('.e-rte-srctextarea');
    }

    /**
     * Destroy the entire RichTextEditor.
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (isNOU(this.parent)) { return; }
        this.removeEventListener();
    }
}
