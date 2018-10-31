import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { IRichTextEditor, IRenderer, NotifyArgs } from '../base/interface';
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

    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    private initializeInstance(): void {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.editPanel = this.contentRenderer.getEditPanel();
    }

    public renderCount(): void {
        this.initializeInstance();
        this.element = this.parent.createElement('span', { className: CLS_COUNT });
        this.contentRenderer.getPanel().parentElement.appendChild(this.element);
        this.appendCount();
        if (this.parent.maxLength !== -1) { this.charCountBackground(this.htmlLength); }
    }

    private appendCount(): void {
        let htmlText: string = (this.editPanel as HTMLElement).textContent.trim();
        this.htmlLength = htmlText.length;
        let string: string | number = this.parent.maxLength === -1 ? this.htmlLength : this.htmlLength + ' / ' + this.parent.maxLength;
        this.element.innerHTML = string as string;
    }

    private charCountBackground(htmlLength: number): void {
        let percentage: number = (htmlLength / this.parent.maxLength) * 100;
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
     * @hidden
     */
    public refresh(): void {
        if (!isNullOrUndefined(this.editPanel)) {
            this.appendCount();
            if (this.parent.maxLength !== -1) { this.charCountBackground(this.htmlLength); }
        }
    }

    private restrict(e: NotifyArgs): void {
        if (this.parent.showCharCount) {
            let element: string = ((e.args as MouseEvent).currentTarget as HTMLElement).textContent.trim();
            let array: number[] = [8, 16, 17, 37, 38, 39, 40, 65];
            let arrayKey: number;
            for (let i: number = 0; i <= array.length - 1; i++) {
                if ((e.args as MouseEvent).which === array[i]) {
                    if ((e.args as MouseEvent).ctrlKey && (e.args as MouseEvent).which === 65) {
                        return;
                    } else if ((e.args as MouseEvent).which !== 65) {
                        arrayKey = array[i];
                        return;
                    }
                }
            }
            if ((element.length >= this.parent.maxLength && this.parent.maxLength !== -1) && (e.args as MouseEvent).which !== arrayKey) {
                (e.args as MouseEvent).preventDefault();
            }
        }
    }

    /**
     * Destroys the Count.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }


    private toggle(e: { member: string }): void {
        this.element.style.display = (e.member === 'viewSource') ? 'none' : 'block';
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.parent.showCharCount) {
            this.parent.on(events.initialEnd, this.renderCount, this);
            this.parent.on(events.keyUp, this.refresh, this);
            this.parent.on(events.keyDown, this.restrict, this);
            this.parent.on(events.count, this.refresh, this);
            this.parent.on(events.refreshBegin, this.refresh, this);
            this.parent.on(events.mouseDown, this.refresh, this);
            this.parent.on(events.destroy, this.destroy, this);
            this.parent.on(events.sourceCode, this.toggle, this);
            this.parent.on(events.updateSource, this.toggle, this);
        }
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        detach(this.element);
        this.parent.off(events.initialEnd, this.renderCount);
        this.parent.off(events.keyUp, this.refresh);
        this.parent.off(events.refreshBegin, this.refresh);
        this.parent.off(events.keyDown, this.restrict);
        this.parent.off(events.count, this.refresh);
        this.parent.off(events.mouseDown, this.refresh);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.sourceCode, this.toggle);
        this.parent.off(events.updateSource, this.toggle);
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'count';
    }
}