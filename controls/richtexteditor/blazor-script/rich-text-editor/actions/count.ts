import { detach, isNullOrUndefined, createElement } from '../../../base'; /*externalscript*/
import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { CLS_WARNING, CLS_ERROR, CLS_COUNT } from '../classes';
import { ToolbarPosition } from '../../src/editor-manager/base/enum';

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
        this.renderCount();
    }
    public renderCount(): void {
        if (this.parent.showCharCount) {
            this.addEventListener();
            this.appendCount();
            if (this.parent.maxLength !== -1) { this.charCountBackground(this.htmlLength); }
        }
    }
    private appendCount(): void {
        this.countElement = createElement('span', { className: CLS_COUNT, styles: 'display: block' });
        if (this.parent.toolbarSettings.position === 'Bottom') {
            // Find the content element to insert the count element after it
            const contentElement: HTMLElement = this.parent.inputElement.parentElement;
            if (contentElement && contentElement.parentNode) {
                // Insert after the content element
                contentElement.insertAdjacentElement('afterend', this.countElement);
            }
        } else {
            // Original behavior - append to root container
            this.parent.rootContainer.appendChild(this.countElement);
        }
        this.parent.rootContainer.classList.add('e-count-enabled');
        if (this.parent.iframeSettings.enable) {
            this.parent.inputElement.classList.add('e-count-enabled');
        }
        this.updateCount();
    }
    private updateCount(): void {
        const htmlText: string = this.parent.editorMode === 'Markdown' ? (this.parent.getEditPanel() as HTMLTextAreaElement).value :
            (isNullOrUndefined(this.parent.getText()) ? '' : (this.parent.getText().replace(/(\r\n|\n|\r|\t)/gm, '')));
        if (this.parent.editorMode !== 'Markdown' && htmlText.indexOf('\u200B') !== -1) {
            this.htmlLength = htmlText.replace(/\u200B/g, '').length;
        } else {
            this.htmlLength = htmlText.length;
        }
        const string: string | number = this.parent.maxLength === -1 ? this.htmlLength : this.htmlLength + ' / ' + this.parent.maxLength;
        this.countElement.innerHTML = string as string;
    }
    private charCountBackground(htmlLength: number): void {
        this.countElement = this.parent.element.querySelector('.' + CLS_COUNT) as HTMLElement;
        const percentage: number = (htmlLength / this.parent.maxLength) * 100;
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
            this.updateCount();
            if (this.parent.maxLength !== -1) { this.charCountBackground(this.htmlLength); }
        }
    }
    public destroy(): void {
        if (this.parent && this.parent.rootContainer && this.parent.rootContainer.classList.contains('e-count-enabled')) {
            this.parent.rootContainer.classList.remove('e-count-enabled');
        }
        if (this.parent.iframeSettings.enable && !isNullOrUndefined(this.parent.inputElement)) {
            this.parent.inputElement.classList.remove('e-count-enabled');
        }
        detach(this.countElement);
        this.countElement = null;
        this.removeEventListener();
    }
    private toggle(e: { member: string }): void {
        if (this.parent.showCharCount) {
            this.countElement.style.display = (e.member === 'viewSource') ? 'none' : 'block';
        }
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.keyUp, this.refresh, this);
        this.parent.observer.on(events.count, this.refresh, this);
        this.parent.observer.on(events.refreshBegin, this.refresh, this);
        this.parent.observer.on(events.mouseDown, this.refresh, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.sourceCode, this.toggle, this);
        this.parent.observer.on(events.updateSource, this.toggle, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.keyUp, this.refresh);
        this.parent.observer.off(events.refreshBegin, this.refresh);
        this.parent.observer.off(events.count, this.refresh);
        this.parent.observer.off(events.mouseDown, this.refresh);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.sourceCode, this.toggle);
        this.parent.observer.off(events.updateSource, this.toggle);
    }
}
