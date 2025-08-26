import { createElement, remove } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';

/**
 * `ErrorDialog` module to create error dialog.
 */
/** @hidden */
export class ErrorDialog {
    /** @hidden */
    public parent: PivotCommon;
    /** @hidden */
    public errorPopUp: Dialog;
    /**
     * Constructor for the dialog action.
     *
     * @param {PivotCommon} parent - parent.
     * @hidden
     */
    constructor(parent: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Creates the error dialog for the unexpected action done.
     *
     * @function createErrorDialog
     * @param {string} title - title.
     * @param {string} description - description.
     * @returns {void}
     * @hidden
     */
    public createErrorDialog(title: string, description: string): void {
        const errorDialog: HTMLElement = createElement('div', {
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
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.closeErrorDialog.bind(this),
                    isFlat: false,
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                }
            ],
            cssClass: this.parent.cssClass,
            closeOnEscape: true,
            target: document.body,
            close: this.removeErrorDialog.bind(this)
        });
        this.errorPopUp.isStringTemplate = true;
        this.errorPopUp.appendTo(errorDialog);
    }
    private closeErrorDialog(): void {
        this.errorPopUp.close();
    }

    /** @hidden */

    public removeErrorDialog(): void {
        if (this.errorPopUp && !this.errorPopUp.isDestroyed) {
            this.errorPopUp.destroy();
            this.errorPopUp = null;
        }
        if (document.getElementById(this.parent.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parent.parentID + '_ErrorDialog'));
        }
    }
}
