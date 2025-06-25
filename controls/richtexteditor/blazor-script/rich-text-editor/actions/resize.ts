import { EventHandler, Browser, isNullOrUndefined, detach, createElement } from '../../../base'; /*externalscript*/
import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { ResizeArgs } from '../../src/common/interface';
import { CLS_RTE_RES_EAST, CLS_RTE_RES_HANDLE, CLS_RTE_RES_CNT, CLS_ICONS, CLS_RTE_RES_WEST, CLS_TB_FLOAT } from '../classes';

/**
 * `Resize` module is used to resize the editor
 */
export class Resize {
    protected resizer: HTMLElement;
    protected touchEndEvent: string;
    protected touchMoveEvent: string;
    protected touchStartEvent: string;
    protected parent: SfRichTextEditor;
    private isResizing: boolean;
    private iframeElement: NodeListOf<HTMLIFrameElement>;
    private iframeMouseUpBoundFn: () => void;

    constructor(parent?: SfRichTextEditor) {
        this.iframeMouseUpBoundFn = this.iframeMouseUp.bind(this);
        this.parent = parent;
        this.renderResizable();
        this.isResizing = false;
    }
    private addEventListener(): void {
        this.parent.observer.on(events.destroy, this.destroy, this);
    }
    private renderResizable(): void {
        if (this.parent.enableResize) {
            let resizeClass: string = CLS_ICONS + ' ' + CLS_RTE_RES_HANDLE + ' ';
            resizeClass += this.parent.enableRtl ? CLS_RTE_RES_WEST : CLS_RTE_RES_EAST;
            this.resizer = createElement('div', { id: this.parent.id + events.resizeID, className: resizeClass });
            this.parent.element.classList.add(CLS_RTE_RES_CNT);
            this.parent.rootContainer.classList.add('e-resize-enabled');
            if (this.parent.iframeSettings.enable) {
                this.parent.inputElement.classList.add('e-resize-enabled');
                this.parent.getDocument().addEventListener('mouseup', this.iframeMouseUpBoundFn);
            }
            this.parent.rootContainer.appendChild(this.resizer);
            this.iframeElement = this.parent.getDocument().querySelectorAll('iframe');
            if (!isNullOrUndefined(this.iframeElement)) {
                this.iframeElement.forEach((iframe: HTMLIFrameElement) => {
                    EventHandler.add(iframe, 'load', this.onIFrameLoad, this);
                });
            }
            this.touchStartEvent = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
            EventHandler.add(this.resizer, 'mousedown', this.resizeStart, this);
            EventHandler.add(this.resizer, this.touchStartEvent, this.resizeStart, this);
        }
        this.addEventListener();
    }

    private onIFrameLoad(e: Event): void {
        const iframe: HTMLIFrameElement = e.target as HTMLIFrameElement;
        if (iframe.nodeName === 'IFRAME' && iframe.contentDocument) {
            EventHandler.add(iframe.contentDocument, 'mouseup', this.stopResize, this);
        }
    }

    private removeMouseUpEventListener(iframe: HTMLIFrameElement): void {
        if (iframe.contentDocument) {
            EventHandler.remove(iframe.contentDocument, 'mouseup', this.stopResize);
        }
    }

    private resizeStart(e?: MouseEvent | TouchEvent | PointerEvent): void {
        this.isResizing = false;
        if (e.cancelable) {
            e.preventDefault();
        }
        this.wireResizeEvents();
        this.parent.observer.notify(events.resizeInitialized, {});
        const args: ResizeArgs = { requestType: 'editor' };
        if (this.parent.onResizeStartEnabled) {
            (this.parent.dotNetRef.invokeMethodAsync(events.resizeStartEvent, args) as unknown as
            Promise<ResizeArgs>).then((resizeStartArgs: ResizeArgs) => {
                if (resizeStartArgs.cancel) { this.unwireResizeEvents(); }
            });
        }
    }
    private performResize(e?: MouseEvent | TouchEvent | PointerEvent): void {
        this.isResizing = true;
        const boundRect: ClientRect = this.parent.element.getBoundingClientRect();
        if (this.isMouseEvent(e)) {
            this.parent.element.style.height = (<MouseEvent>e).clientY - boundRect.top + 'px';
            this.parent.element.style.width = (this.parent.enableRtl ? boundRect.right - (<MouseEvent>e).clientX :
                (<MouseEvent>e).clientX - boundRect.left) + 'px';
            const toolBarEle: HTMLElement  = this.parent.getToolbarElement() as HTMLElement;
            if (toolBarEle !== null) {
                if (toolBarEle.classList.contains(CLS_TB_FLOAT) && this.parent.toolbarSettings.enableFloating &&
                    this.parent.getToolbar() && !this.parent.inlineMode.enable) {
                    const contentPanel: HTMLElement = this.parent.contentPanel as HTMLElement;
                    const contentPanelWidth: number = contentPanel.getBoundingClientRect().width;
                    toolBarEle.style.width = contentPanelWidth + 'px';
                }
            }
        }
        else {
            const eventType: MouseEvent | Touch = Browser.info.name !== 'msie' ? (<TouchEvent>e).touches[0] : (<MouseEvent>e);
            this.parent.element.style.height = eventType.clientY - boundRect.top + 'px';
            this.parent.element.style.width = (this.parent.enableRtl ? boundRect.right - eventType.clientX :
                eventType.clientX - boundRect.left) + 'px';
        }
        const rteContent: HTMLElement = this.parent.element.querySelector('#' + this.parent.element.id + '_source-view') as HTMLElement;
        if (!isNullOrUndefined(rteContent)) {
            rteContent.style.height = this.parent.element.style.height;
        }
        this.parent.refresh();
    }
    private stopResize(e?: MouseEvent | TouchEvent | PointerEvent): void {
        this.isResizing = false;
        this.parent.refresh();
        this.unwireResizeEvents();
        const args: ResizeArgs = { requestType: 'editor' };
        if (this.parent.onResizeStopEnabled) { this.parent.dotNetRef.invokeMethodAsync(events.resizeStopEvent, args); }
    }
    private getEventType(e: string): string {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    }
    private isMouseEvent(e: MouseEvent | TouchEvent | PointerEvent): boolean {
        let isMouse: boolean = false;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined((<PointerEvent>e).pointerType) &&
            this.getEventType((<PointerEvent>e).pointerType) === 'mouse')) {
            isMouse = true;
        }
        return isMouse;
    }
    private wireResizeEvents(): void {
        EventHandler.add(document, 'mousemove', this.performResize, this);
        EventHandler.add(document, 'mouseup', this.stopResize, this);
        this.touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        this.touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.add(document, this.touchMoveEvent, this.performResize, this);
        EventHandler.add(document, this.touchEndEvent, this.stopResize, this);
    }
    private unwireResizeEvents(): void {
        EventHandler.remove(document, 'mousemove', this.performResize);
        EventHandler.remove(document, 'mouseup', this.stopResize);
        EventHandler.remove(document, this.touchMoveEvent, this.performResize);
        EventHandler.remove(document, this.touchEndEvent, this.stopResize);
    }
    public destroy(): void {
        this.removeEventListener();
    }
    private removeEventListener(): void {
        if (this.parent && this.parent.rootContainer && this.parent.rootContainer.classList.contains('e-resize-enabled')) {
            this.parent.rootContainer.classList.remove('e-resize-enabled');
        }
        if (this.parent.iframeSettings.enable && !isNullOrUndefined(this.parent.inputElement)) {
            this.parent.inputElement.classList.remove('e-resize-enabled');
            this.parent.getDocument().removeEventListener('mouseup', this.iframeMouseUpBoundFn);
        }
        this.iframeMouseUpBoundFn = null;
        this.parent.element.classList.remove(CLS_RTE_RES_CNT);
        EventHandler.remove(this.resizer, 'mousedown', this.resizeStart);
        EventHandler.remove(this.resizer, this.touchStartEvent, this.resizeStart);
        if (!isNullOrUndefined(this.iframeElement)) {
            this.iframeElement.forEach((iframe: HTMLIFrameElement) => {
                this.removeMouseUpEventListener(iframe);
                EventHandler.remove(iframe, 'load', this.onIFrameLoad);
            });
        }
        if (this.resizer) {
            detach(this.resizer);
        }
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private iframeMouseUp(e: MouseEvent): void {
        if (this.isResizing) {
            this.stopResize(e);
        }
    }
}
