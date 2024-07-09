import { detach, isNullOrUndefined} from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { IRichTextEditor, IRenderer } from '../base/interface';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { CLS_COUNT, CLS_WARNING, CLS_ERROR } from '../base/classes';
import { KeyboardEventArgs } from '../actions/keyboard';

/**
 * `Count` module is used to handle Count actions.
 */
export class Count {
    protected parent: IRichTextEditor;
    protected maxLength: number;
    protected htmlLength: number;
    protected locator: ServiceLocator;
    protected renderFactory: RendererFactory;
    private editPanel: Element;
    private contentModule: IRenderer;
    private contentRenderer: IRenderer;
    private args: KeyboardEventArgs;
    private element: HTMLElement;
    private isDestroyed: boolean;

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
        this.isDestroyed = false;
    }

    private initializeInstance(): void {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.editPanel = this.contentRenderer.getEditPanel();
        this.addEventListener();
    }

    /**
     * renderCount method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderCount(): void {
        this.initializeInstance();
        this.element = this.parent.createElement('span', { className: CLS_COUNT });
        this.parent.rootContainer.appendChild(this.element);
        this.parent.rootContainer.classList.add('e-count-enabled');
        if (this.parent.iframeSettings.enable) {
            this.parent.inputElement.classList.add('e-count-enabled');
        }
        this.appendCount();
        if (this.parent.maxLength !== -1) {
            this.charCountBackground(this.htmlLength);
        }
    }

    private appendCount(): void {
        const htmlText: string = this.parent.editorMode === 'Markdown' ? (this.editPanel as HTMLTextAreaElement).value :
            (isNullOrUndefined(this.parent.getText()) ? '' : (this.parent.getText().replace(/(\r\n|\n|\r|\t)/gm, '')));
        if (this.parent.editorMode !== 'Markdown' && htmlText.indexOf('\u200B') !== -1) {
            this.htmlLength = htmlText.replace(/\u200B/g, '').length;
        } else {
            this.htmlLength = htmlText.length;
        }
        const string: string | number = this.parent.maxLength === -1 ? this.htmlLength : this.htmlLength + ' / ' + this.parent.maxLength;
        this.element.innerHTML = string as string;
    }

    private charCountBackground(htmlLength: number): void {
        const percentage: number = (htmlLength / this.parent.maxLength) * 100;
        if (percentage < 85) {
            this.element.classList.remove(CLS_WARNING);
            this.element.classList.remove(CLS_ERROR);
        } else if (percentage > 85 && percentage <= 90) {
            this.element.classList.remove(CLS_ERROR);
            this.element.classList.add(CLS_WARNING);
        } else if (percentage > 90) {
            this.element.classList.remove(CLS_WARNING);
            this.element.classList.add(CLS_ERROR);
        }
    }
    /**
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public refresh(): void {
        if (!isNullOrUndefined(this.editPanel)) {
            this.appendCount();
            if (this.parent.maxLength !== -1) {
                this.charCountBackground(this.htmlLength);
            }
        }
    }

    /**
     * Destroys the Count.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.parent && this.parent.rootContainer && this.parent.rootContainer.classList.contains('e-count-enabled')) {
            this.parent.rootContainer.classList.remove('e-count-enabled');
        }
        if (this.parent.iframeSettings.enable && !isNullOrUndefined(this.parent.inputElement)) {
            this.parent.inputElement.classList.remove('e-count-enabled');
        }
        if (this.element && !isNullOrUndefined(this.parent.element.querySelector('.' + CLS_COUNT))) {
            detach(this.element);
        }
        this.removeEventListener();
        if (this.editPanel) { this.editPanel = null; }
        if (this.element) {
            detach(this.element);
            this.element = null;
        }
        this.isDestroyed = true;
    }


    private toggle(e: { member: string }): void {
        this.element.style.display = (e.member === 'viewSource') ? 'none' : 'block';
    }

    protected addEventListener(): void {
        this.parent.on(events.initialEnd, this.renderCount, this);
        this.parent.on(events.keyUp, this.refresh, this);
        this.parent.on(events.count, this.refresh, this);
        this.parent.on(events.refreshBegin, this.refresh, this);
        this.parent.on(events.mouseDown, this.refresh, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.sourceCode, this.toggle, this);
        this.parent.on(events.updateSource, this.toggle, this);
    }

    protected removeEventListener(): void {
        this.parent.off(events.initialEnd, this.renderCount);
        this.parent.off(events.keyUp, this.refresh);
        this.parent.off(events.refreshBegin, this.refresh);
        this.parent.off(events.count, this.refresh);
        this.parent.off(events.mouseDown, this.refresh);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.sourceCode, this.toggle);
        this.parent.off(events.updateSource, this.toggle);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string value
     */
    private getModuleName(): string {
        return 'count';
    }
}
