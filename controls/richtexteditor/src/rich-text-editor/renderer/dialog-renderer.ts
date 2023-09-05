import { Dialog, DialogModel, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { closest, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
/**
 * Dialog Renderer
 */
export class DialogRenderer {
    public dialogObj: Dialog;
    private dialogEle: Element;
    private parent: IRichTextEditor;
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.moduleDestroy, this.moduleDestroy, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }
    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.destroy, this.removeEventListener);
        this.parent.off(events.moduleDestroy, this.moduleDestroy);
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
        if(args.element.classList.contains('e-dialog')) {
            const formEle = closest(args.target as HTMLElement,'form');
            if(!isNOU(formEle)) {
                this.dialogEle = args.element;
                this.dialogEle.addEventListener('keydown',this.handleEnterKeyDown)
            }
        }
        this.parent.trigger(events.beforeDialogOpen, args, this.beforeOpenCallback.bind(this, args));
    }
    private handleEnterKeyDown(args: any) {
        if (args.code === "Enter") {
            args.preventDefault();
        }

    }
    private beforeOpenCallback(args: BeforeOpenEventArgs): void {
        if (args.cancel) {
            this.parent.notify(events.clearDialogObj, null);
        }
    }
    private open(args: Object): void {
        this.parent.trigger(events.dialogOpen, args);
    }
    private beforeClose(args: BeforeCloseEventArgs): void {
        if (this.dialogEle) {
            this.dialogEle.removeEventListener('keydown', this.handleEnterKeyDown);
        }
        this.parent.trigger(events.beforeDialogClose, args, (closeArgs: BeforeCloseEventArgs) => {
            if (!closeArgs.cancel) {
                if (closeArgs.container.classList.contains('e-popup-close')) {
                    closeArgs.cancel = true;
                }
            }
        });
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

    private moduleDestroy(): void {
        this.parent = null;
    }
}
