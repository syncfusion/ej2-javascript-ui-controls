import { EventHandler, Browser, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { IRichTextEditor, ResizeArgs } from '../base/interface';
/**
 * `Resize` module is used to resize the editor
 */
export class Resize {
    protected parent: IRichTextEditor;
    protected resizer: HTMLElement;
    protected touchStartEvent: string;
    protected touchMoveEvent: string;
    protected touchEndEvent: string;

    private constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialEnd, this.renderResizable, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private renderResizable(): void {
        this.resizer = this.parent.createElement('div', {
            id: this.parent.getID() + '-resizable', className: 'e-icons'
                + ' ' + classes.CLS_RTE_RES_HANDLE + ' ' + classes.CLS_RTE_RES_EAST
        });
        this.parent.element.classList.add(classes.CLS_RTE_RES_CNT);
        this.parent.element.appendChild(this.resizer);
        this.touchStartEvent = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
        EventHandler.add(this.resizer, 'mousedown', this.resizeStart, this);
        EventHandler.add(this.resizer, this.touchStartEvent, this.resizeStart, this);
    }

    private resizeStart(e?: MouseEvent | TouchEvent | PointerEvent): void {
        if (e.cancelable) {
            e.preventDefault();
        }
        this.wireResizeEvents();
        this.parent.notify(events.resizeInitialized, {});
        const args: ResizeArgs = { event: e, requestType: 'editor' };
        this.parent.trigger(events.resizeStart, args, (resizeStartArgs: ResizeArgs) => {
            if (resizeStartArgs.cancel) {
                this.unwireResizeEvents();
            }
        });
    }

    private performResize(e?: MouseEvent | TouchEvent | PointerEvent): void {
        const args: ResizeArgs = { event: e, requestType: 'editor' };
        this.parent.trigger(events.onResize, args, (resizingArgs: ResizeArgs) => {
            if (resizingArgs.cancel) {
                this.unwireResizeEvents();
            }
        });
        const boundRect: ClientRect = this.parent.element.getBoundingClientRect();
        if (this.isMouseEvent(e)) {
            this.parent.element.style.height = (<MouseEvent>e).clientY - boundRect.top + 'px';
            this.parent.element.style.width = (<MouseEvent>e).clientX - boundRect.left + 'px';
        } else {
            const eventType: MouseEvent | Touch = Browser.info.name !== 'msie' ? (<TouchEvent>e).touches[0] : (<MouseEvent>e);
            this.parent.element.style.height = eventType.clientY - boundRect.top + 'px';
            this.parent.element.style.width = eventType.clientX - boundRect.left + 'px';
        }
        if (!this.parent.toolbarSettings.enable) {
            this.parent.setContentHeight('', false);
        }
        this.parent.refreshUI();
    }

    private stopResize(e?: MouseEvent | TouchEvent | PointerEvent): void {
        this.parent.refreshUI();
        this.unwireResizeEvents();
        const args: ResizeArgs = { event: e, requestType: 'editor' };
        this.parent.trigger(events.resizeStop, args);
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
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.renderResizable);
        this.parent.element.classList.remove(classes.CLS_RTE_RES_CNT);
        EventHandler.remove(this.resizer, 'mousedown', this.resizeStart);
        EventHandler.remove(this.resizer, this.touchStartEvent, this.resizeStart);
        if (this.resizer) {
            detach(this.resizer);
        }
        this.parent.off(events.destroy, this.destroy);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'resize';
    }
}
