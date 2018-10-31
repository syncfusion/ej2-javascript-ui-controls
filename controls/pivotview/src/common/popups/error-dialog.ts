import { createElement, remove } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';

/**
 * `ErrorDialog` module to create error dialog.
 */
/** @hidden */
export class ErrorDialog {
    public parent: PivotCommon;
    /** @hidden */
    public errorPopUp: Dialog;
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Creates the error dialog for the unexpected action done.
     * @method createErrorDialog
     * @return {void}
     * @hidden
     */
    public createErrorDialog(title: string, description: string): void {
        let errorDialog: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        this.errorPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.closeErrorDialog.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                }
            ],
            closeOnEscape: true,
            target: document.body,
            close: this.removeErrorDialog.bind(this)
        });
        this.errorPopUp.appendTo(errorDialog);
    }
    private closeErrorDialog(): void {
        this.errorPopUp.hide();
    }
    private removeErrorDialog(): void {
        remove(document.getElementById(this.parent.parentID + '_ErrorDialog').parentElement);
    }
}