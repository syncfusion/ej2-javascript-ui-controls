import { Dialog, DialogModel, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { closest, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
import { KeyboardEventArgs } from '../actions';
/**
 * Dialog Renderer
 */
export class DialogRenderer {
    public dialogObj: Dialog;
    private dialogEle: Element;
    private parent: IRichTextEditor;
    private outsideClickClosedBy: string;
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.destroy, this.removeEventListener, this);
        this.parent.on(events.documentClickClosedBy, this.documentClickClosedBy, this);
    }
    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.destroy, this.removeEventListener);
        this.parent.off(events.documentClickClosedBy, this.documentClickClosedBy);
    }
    /**
     * dialog render method
     *
     * @param {DialogModel} e - specifies the dialog model.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public render(e: DialogModel): Dialog {
        let dlgObj: Dialog;
        e.beforeOpen = this.beforeOpen.bind(this);
        e.open = this.open.bind(this);
        e.position = {
            X: 'center',
            Y: (e.target !== 'string' && (e.target as HTMLElement).nodeName === 'BODY' &&
                !isNOU(e.position)) ? e.position.Y : this.getDialogPosition()
        };
        if (isNOU(e.close)) {
            e.close = this.close.bind(this);
        }
        e.beforeClose = this.beforeClose.bind(this);
        // eslint-disable-next-line
        dlgObj = new Dialog(e);
        dlgObj.isStringTemplate = true;
        return dlgObj;
    }
    private beforeOpen(args: BeforeOpenEventArgs): void {
        if (args.element.classList.contains('e-dialog')) {
            const formEle: Element = closest(args.target as HTMLElement, 'form');
            if (!isNOU(formEle)) {
                this.dialogEle = args.element;
                this.dialogEle.addEventListener('keydown', this.handleEnterKeyDown);
            }
        }
        this.parent.trigger(events.beforeDialogOpen, args, this.beforeOpenCallback.bind(this, args));
    }
    private handleEnterKeyDown(args: KeyboardEventArgs): void {
        if (args.key === 'Enter') {
            args.preventDefault();
        }
    }
    private beforeOpenCallback(args: BeforeOpenEventArgs): void {
        if (args.cancel) {
            this.parent.notify(events.clearDialogObj, null);
        }
    }
    private open(args: Object): void {
        const isFileMangerDialog: boolean = !isNOU(((args as any).container as HTMLElement).querySelector('.e-rte-file-manager-dialog'));
        if (isFileMangerDialog) {
            ((args as any).preventFocus as boolean) = true;
        }
        this.parent.trigger(events.dialogOpen, args);
    }
    private documentClickClosedBy(args: { closedBy: string; }): void {
        this.outsideClickClosedBy = args.closedBy;
    }
    private beforeClose(args: BeforeCloseEventArgs): void {
        if (this.dialogEle) {
            this.dialogEle.removeEventListener('keydown', this.handleEnterKeyDown);
        }
        args.closedBy = this.outsideClickClosedBy === 'outside click' ? this.outsideClickClosedBy : args.closedBy;
        this.parent.trigger(events.beforeDialogClose, args, (closeArgs: BeforeCloseEventArgs) => {
            if (!closeArgs.cancel) {
                if (closeArgs.container.classList.contains('e-popup-close')) {
                    closeArgs.cancel = true;
                }
            }
        });
        this.outsideClickClosedBy = '';
    }

    private getDialogPosition(): string {
        let distanceFromVisibleTop: number = this.parent.element.getBoundingClientRect().top;
        if (distanceFromVisibleTop < 0) {
            let topHeight: number = 0;
            let parentElement: HTMLElement = this.parent.element;
            while (parentElement.nodeName !== 'BODY') {
                const top: number = parentElement.getBoundingClientRect().top;
                if (top > 0 ) {
                    topHeight = top;
                }
                parentElement = parentElement.parentElement as HTMLElement;
            }
            distanceFromVisibleTop = Math.abs(distanceFromVisibleTop) + topHeight;
            return distanceFromVisibleTop.toString();
        }
        else {
            return 'top';
        }
    }
    /**
     * dialog close method
     *
     * @param {Object} args - specifies the arguments.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public close(args: Object): void {
        this.parent.trigger(events.dialogClose, args);
    }
}
