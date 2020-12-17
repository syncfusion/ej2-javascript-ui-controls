import { Dialog, DialogModel, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
/**
 * Dialog Renderer 
 */
export class DialogRenderer {
    public dialogObj: Dialog;
    private parent: IRichTextEditor;
    constructor(parent?: IRichTextEditor) {
        this.parent = parent;
    }
    /**
     * dialog render method
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
        dlgObj = new Dialog(e);
        dlgObj.isStringTemplate = true;
        return dlgObj;
    }
    private beforeOpen(args: BeforeOpenEventArgs): void {
        this.parent.trigger(events.beforeDialogOpen, args);
    }
    private open(args: Object): void {
        this.parent.trigger(events.dialogOpen, args);
    }
    private beforeClose(args: BeforeCloseEventArgs): void {
        this.parent.trigger(events.beforeDialogClose, args, (closeArgs: BeforeCloseEventArgs) => {
            if (!closeArgs.cancel) {
                if (closeArgs.container.classList.contains('e-popup-close')) { closeArgs.cancel = true; }
            }
        });
    }
    /**
     * dialog close method
     * @hidden
     * @deprecated
     */
    public close(args: Object): void {
        this.parent.trigger(events.dialogClose, args);
    }
}