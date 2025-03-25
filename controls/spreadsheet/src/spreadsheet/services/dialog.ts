import { Spreadsheet } from '../base/index';
import { Dialog as DialogComponent, DialogModel, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { extend, remove, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { focus, locale } from '../common/index';

/**
 * Dialog Service.
 *
 * @hidden
 */
export class Dialog {
    private parent: Spreadsheet;
    public dialogInstance: DialogComponent;

    /**
     * Constructor for initializing dialog service.
     *
     * @param {Spreadsheet} parent - Specifies the Spreadsheet instance.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
    }

    /**
     * To show dialog.
     *
     * @param {DialogModel} dialogModel - Specifies the Dialog model.
     * @param {boolean} cancelBtn - Specifies the cancel button.
     * @returns {void}
     */
    public show(dialogModel: DialogModel, cancelBtn?: boolean): void {
        let btnContent: string;
        cancelBtn = isNullOrUndefined(cancelBtn) ? true : false;
        const beforeOpenHandler: Function = dialogModel.beforeOpen || null;
        const closeHandler: Function = dialogModel.close || null;
        const model: DialogModel = {
            header: 'Spreadsheet',
            cssClass: this.parent.cssClass,
            target: this.parent.element,
            buttons: [],
            allowDragging: true
        };
        dialogModel.beforeOpen = (args: BeforeOpenEventArgs) => {
            if (beforeOpenHandler) {
                beforeOpenHandler(args);
                if (args.cancel) {
                    this.hide(true);
                    if (!(args as { preventFocus?: boolean }).preventFocus) {
                        focus(this.parent.element);
                    }
                }
            }
        };
        dialogModel.close = () => {
            this.destroyDialog();
            if (closeHandler) {
                closeHandler();
            }
        };
        extend(model, dialogModel);
        if (cancelBtn) {
            btnContent = (this.parent.serviceLocator.getService(locale) as L10n).getConstant(model.buttons.length ? 'Cancel' : 'Ok');
            model.buttons.push({
                buttonModel: { content: btnContent, isPrimary: model.buttons.length === 0 },
                click: this.hide.bind(this)
            });
        }
        const div: HTMLElement = this.parent.createElement('div');
        document.body.appendChild(div);
        this.dialogInstance = new DialogComponent(model);
        this.dialogInstance.createElement = this.parent.createElement;
        this.dialogInstance.appendTo(div);
        if (this.dialogInstance) {
            this.dialogInstance.refreshPosition();
        }
    }

    /**
     * To destroy the dialog if it open is prevented by user.
     *
     * @returns {void}
     */
    public destroyDialog(): void {
        this.dialogInstance.destroy();
        remove(this.dialogInstance.element);
        this.dialogInstance = null;
    }

    /**
     * To hide dialog.
     *
     * @param {DialogModel} disableAnimation - To disable the animation while hiding the dialog.
     * @returns {void}
     */
    public hide(disableAnimation?: boolean): void {
        if (this.dialogInstance) {
            if (disableAnimation) {
                this.dialogInstance.animationSettings.effect = 'None';
                this.dialogInstance.dataBind();
            }
            this.dialogInstance.hide();
        }
    }

    /**
     * To clear private variables.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.parent = null;
    }
}
