import { Spreadsheet } from '../base/index';
import { Dialog as DialogComponent, DialogModel } from '@syncfusion/ej2-popups';
import { extend, remove, L10n } from '@syncfusion/ej2-base';
import { locale } from '../common/index';

/**
 * Dialog Service.
 * @hidden
 */
export class Dialog {
    private parent: Spreadsheet;
    public dialogInstance: DialogComponent;

    /**
     * Constructor for initializing dialog service.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
    }

    /**
     * To show dialog.
     */
    public show(dialogModel: DialogModel): void {
        let btnContent: string;
        let closeHandler: Function = dialogModel.close || null;
        let model: DialogModel = {
            header: 'Spreadsheet',
            cssClass: this.parent.cssClass,
            target: this.parent.element,
            buttons: []
        };
        dialogModel.close = () => {
            this.dialogInstance.destroy();
            remove(this.dialogInstance.element);
            this.dialogInstance = null;
            if (closeHandler) {
                closeHandler();
            }
        };
        extend(model, dialogModel);
        btnContent = (this.parent.serviceLocator.getService(locale) as L10n).getConstant(model.buttons.length ? 'Cancel' : 'Ok');
        model.buttons.push({
            buttonModel: { content: btnContent, isPrimary: model.buttons.length === 0 },
            click: this.hide.bind(this),
        });
        let div: HTMLElement = this.parent.createElement('div');
        document.body.appendChild(div);
        this.dialogInstance = new DialogComponent(model);
        this.dialogInstance.createElement = this.parent.createElement;
        this.dialogInstance.appendTo(div);
    }

    /**
     * To hide dialog.
     */
    public hide(): void {
        this.dialogInstance.hide();
    }

    /**
     * To clear private variables.
     */
    public destroy(): void {
        this.parent = null;
    }
}