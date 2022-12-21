import { createElement, remove } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';

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
     * @param {HTMLElement} target - target.
     * @returns {void}
     * @hidden
     */
    public createErrorDialog(title: string, description: string, target?: HTMLElement): void {
        const errorDialog: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        const zIndex: number = target ? Number(target.style.zIndex) + 1 : (this.parent.moduleName === 'pivotfieldlist' &&
            this.parent.renderMode === 'Popup' && this.parent.control ? (this.parent.control as PivotFieldList).dialogRenderer.fieldListDialog.zIndex + 1 :
            (this.parent.moduleName === 'pivotfieldlist' && this.parent.renderMode === 'Fixed' && this.parent.control ? 1000002 :
                (this.parent.moduleName === 'pivotview' && this.parent.control ? 1000002 : 1000001)));
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
            zIndex: zIndex,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.closeErrorDialog.bind(this),
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
    private removeErrorDialog(): void {
        if (this.errorPopUp && !this.errorPopUp.isDestroyed) {
            this.errorPopUp.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parent.parentID + '_ErrorDialog'));
        }
    }
}
