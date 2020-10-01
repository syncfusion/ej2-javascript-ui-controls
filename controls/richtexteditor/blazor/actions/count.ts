import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { CLS_WARNING, CLS_ERROR, CLS_COUNT } from '../classes';

/**
 * `Count` module is used to handle Count actions.
 */
export class Count {
    protected maxLength: number;
    protected htmlLength: number;
    private parent: SfRichTextEditor;
    private countElement: HTMLElement;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    public renderCount(): void {
        if (this.parent.showCharCount) {
            this.addEventListener();
            this.countElement = this.parent.element.querySelector('.' + CLS_COUNT) as HTMLElement;
            this.appendCount();
            if (this.parent.maxLength !== -1) { this.charCountBackground(this.htmlLength); }
        }
    }
    private appendCount(): void {
        this.countElement = this.parent.element.querySelector('.' + CLS_COUNT) as HTMLElement;
        let htmlText: string = this.parent.editorMode === 'Markdown' ? (this.parent.getEditPanel() as HTMLTextAreaElement).value.trim() :
            (this.parent.getEditPanel() as HTMLElement).textContent.trim();
        this.htmlLength = htmlText.length;
        let string: string | number = this.parent.maxLength === -1 ? this.htmlLength : this.htmlLength + ' / ' + this.parent.maxLength;
        this.countElement.innerHTML = string as string;
    }
    private charCountBackground(htmlLength: number): void {
        this.countElement = this.parent.element.querySelector('.' + CLS_COUNT) as HTMLElement;
        let percentage: number = (htmlLength / this.parent.maxLength) * 100;
        if (percentage < 85) {
            this.countElement.classList.remove(CLS_WARNING);
            this.countElement.classList.remove(CLS_ERROR);
        } else if (percentage > 85 && percentage <= 90) {
            this.countElement.classList.remove(CLS_ERROR);
            this.countElement.classList.add(CLS_WARNING);
        } else if (percentage > 90) {
            this.countElement.classList.remove(CLS_WARNING);
            this.countElement.classList.add(CLS_ERROR);
        }
    }
    public refresh(): void {
        if (!isNullOrUndefined(this.parent.element) && this.parent.showCharCount) {
            this.appendCount();
            if (this.parent.maxLength !== -1) { this.charCountBackground(this.htmlLength); }
        }
    }
    public destroy(): void {
        if (this.countElement && !isNullOrUndefined(this.parent.element.querySelector('.' + CLS_COUNT))) {
            detach(this.countElement);
        }
        this.removeEventListener();
    }
    private toggle(e: { member: string }): void {
        if (this.parent.showCharCount) {
            this.countElement.style.display = (e.member === 'viewSource') ? 'none' : 'block';
        }
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.initialEnd, this.renderCount, this);
        this.parent.observer.on(events.keyUp, this.refresh, this);
        this.parent.observer.on(events.count, this.refresh, this);
        this.parent.observer.on(events.refreshBegin, this.refresh, this);
        this.parent.observer.on(events.mouseDown, this.refresh, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.sourceCode, this.toggle, this);
        this.parent.observer.on(events.updateSource, this.toggle, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.initialEnd, this.renderCount);
        this.parent.observer.off(events.keyUp, this.refresh);
        this.parent.observer.off(events.refreshBegin, this.refresh);
        this.parent.observer.off(events.count, this.refresh);
        this.parent.observer.off(events.mouseDown, this.refresh);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.sourceCode, this.toggle);
        this.parent.observer.off(events.updateSource, this.toggle);
    }
}