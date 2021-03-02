import { createElement, remove } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { PivotFieldList } from '../../pivotfieldlist';

/**
 * `ErrorDialog` module to create error dialog.
 */
/** @hidden */
export class ErrorDialog {
    public parent: PivotCommon;
    /** @hidden */
    public errorPopUp: Dialog;
    /* eslint-disable-next-line */
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent: PivotCommon) {  /* eslint-disable-line */
        this.parent = parent;
    }

    /* eslint-disable-next-line */
    /**
     * Creates the error dialog for the unexpected action done.
     * @function createErrorDialog
     * @returns {void}
     * @hidden
     */
    public createErrorDialog(title: string, description: string, target?: HTMLElement): void {
        let errorDialog: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        let zIndex: number = target ? Number(target.style.zIndex) + 1 : (this.parent.moduleName === 'pivotfieldlist' &&
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
            position: { X: 'center', Y: 'center' }, /* eslint-disable-line */
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
