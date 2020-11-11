import { EventHandler, Browser, isNullOrUndefined, detach, createElement } from '@syncfusion/ej2-base';
import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { ResizeArgs } from '../../src/rich-text-editor/base/interface';
import { CLS_RTE_RES_EAST, CLS_RTE_RES_HANDLE, CLS_RTE_RES_CNT, CLS_ICONS } from '../classes';

/**
 * `Resize` module is used to resize the editor
 */
export class Resize {
    protected resizer: HTMLElement;
    protected touchEndEvent: string;
    protected touchMoveEvent: string;
    protected touchStartEvent: string;
    protected parent: SfRichTextEditor;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(events.initialEnd, this.renderResizable, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }
    private renderResizable(): void {
        if (this.parent.enableResize) {
            this.resizer = createElement('div', {
                id: this.parent.id + events.resizeID, className: CLS_ICONS
                    + ' ' + CLS_RTE_RES_HANDLE + ' ' + CLS_RTE_RES_EAST
            });
            this.parent.element.classList.add(CLS_RTE_RES_CNT);
            this.parent.element.appendChild(this.resizer);
            this.parent.setContentHeight();
            this.touchStartEvent = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
            EventHandler.add(this.resizer, 'mousedown', this.resizeStart, this);
            EventHandler.add(this.resizer, this.touchStartEvent, this.resizeStart, this);
        }
    }
    private resizeStart(e?: MouseEvent | TouchEvent | PointerEvent): void {
        if (e.cancelable) {
            e.preventDefault();
        }
        this.wireResizeEvents();
        this.parent.observer.notify(events.resizeInitialized, {});
        let args: ResizeArgs = { requestType: 'editor' };
        if (this.parent.onResizeStartEnabled) {
            // @ts-ignore-start
            this.parent.dotNetRef.invokeMethodAsync(events.resizeStartEvent, args).then((resizeStartArgs: ResizeArgs) => {
                // @ts-ignore-end
                if (resizeStartArgs.cancel) { this.unwireResizeEvents(); }
            });
        }
    }
    private performResize(e?: MouseEvent | TouchEvent | PointerEvent): void {
        let args: ResizeArgs = { requestType: 'editor' };
        let boundRect: ClientRect = this.parent.element.getBoundingClientRect();
        if (this.isMouseEvent(e)) {
            this.parent.element.style.height = (<MouseEvent>e).clientY - boundRect.top + 'px';
            this.parent.element.style.width = (<MouseEvent>e).clientX - boundRect.left + 'px';
        } else {
            let eventType: MouseEvent | Touch = Browser.info.name !== 'msie' ? (<TouchEvent>e).touches[0] : (<MouseEvent>e);
            this.parent.element.style.height = eventType.clientY - boundRect.top + 'px';
            this.parent.element.style.width = eventType.clientX - boundRect.left + 'px';
        }
        this.parent.refresh();
    }
    private stopResize(e?: MouseEvent | TouchEvent | PointerEvent): void {
        this.parent.refresh();
        this.unwireResizeEvents();
        let args: ResizeArgs = { requestType: 'editor' };
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
    private destroy(): void {
        this.removeEventListener();
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.initialEnd, this.renderResizable);
        this.parent.element.classList.remove(CLS_RTE_RES_CNT);
        EventHandler.remove(this.resizer, 'mousedown', this.resizeStart);
        EventHandler.remove(this.resizer, this.touchStartEvent, this.resizeStart);
        if (this.resizer) {
            detach(this.resizer);
        }
        this.parent.observer.off(events.destroy, this.destroy);
    }
}