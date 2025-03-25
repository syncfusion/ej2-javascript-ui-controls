import { dialog, Spreadsheet, focus, DialogBeforeOpenEventArgs, locale } from '../index';
import { beginSave, saveCompleted, saveError, exportDialog } from '../../workbook/common/event';
import { Dialog } from '../services/index';
import { getComponent, isNullOrUndefined, KeyboardEventArgs, L10n } from '@syncfusion/ej2-base';
import { DialogModel, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { SaveType } from '../../workbook';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';

/**
 * `Save` module is used to handle the save action in Spreadsheet.
 */
export class Save {
    private parent: Spreadsheet;

    /**
     * Constructor for Save module in Spreadsheet.
     *
     * @private
     * @param {Spreadsheet} parent - Specifies the Spreadsheet instance.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookSave);
    }

    /**
     * To destroy the Save module.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(beginSave, this.initiateSave, this);
        this.parent.on(saveCompleted, this.saveCompleted, this);
        this.parent.on(saveError, this.showErrorDialog, this);
        this.parent.on(exportDialog, this.exportDialog, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(beginSave, this.initiateSave);
            this.parent.off(saveCompleted, this.saveCompleted);
            this.parent.off(saveError, this.showErrorDialog);
            this.parent.off(exportDialog, this.exportDialog);
        }
    }

    /**
     * Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    public getModuleName(): string {
        return 'save';
    }

    /**
     * Initiate save process.
     *
     * @hidden
     * @returns {void} - Initiate save process.
     */
    private initiateSave(): void {
        this.parent.showSpinner();
    }

    /**
     * Save action completed.
     *
     * @hidden
     * @returns {void} - Save action completed.
     */
    private saveCompleted(): void {
        this.parent.hideSpinner();
    }

    private showErrorDialog(args: { content: string }): void {
        const dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
        dialogInst.show({
            isModal: true, showCloseIcon: true, height: 180, width: 400, content: args.content,
            beforeOpen: (): void => focus(this.parent.element)
        });
    }
    private exportDialog(args: MenuEventArgs): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        const type: string = args ? args.item.id.split(this.parent.element.id + '_')[1] : 'xlsx';
        if (isNullOrUndefined(this.parent.element.querySelector('.e-open-dlg'))) {
            const dlg: DialogModel = {
                isModal: true, showCloseIcon: true, cssClass: 'e-open-dlg',
                header: l10n.getConstant('SaveAs'),
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: l10n.getConstant('SaveAs'),
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    } else {
                        dialogInst.dialogInstance.content = this.OpenContent(type); dialogInst.dialogInstance.dataBind();
                        (this.parent.element.querySelector('.e-text-open') as HTMLInputElement).setSelectionRange(0, (
                            this.parent.element.querySelector('.e-text-open') as HTMLInputElement).value.length);
                        focus(this.parent.element);
                    }
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Save'), isPrimary: true, cssClass: 'e-btn-open-ok'
                    },
                    click: (): void => {
                        const name: string = (this.parent.element.querySelector('.e-text-open') as HTMLInputElement).value;
                        if (this.checkValidName(name)) {
                            dialogInst.hide();
                            const type: string = args ? args.item.id.split(`${this.parent.element.id}_`)[1] : 'Xlsx';
                            this.parent.save({ saveType: <SaveType>type , fileName: name});
                        } else {
                            const saveButton: HTMLElement = this.parent.element.querySelector('.e-btn-open-ok') as HTMLElement;
                            const saveButtonObj: { disabled: boolean } = getComponent(saveButton, 'btn') as { disabled: boolean };
                            saveButtonObj.disabled = true;
                            const l10n: L10n = this.parent.serviceLocator.getService(locale);
                            const error: string = name.length === 0 ? l10n.getConstant('EmptyFileName') :
                                (name.length > 218 ? l10n.getConstant('LargeName') : l10n.getConstant('FileNameError'));
                            const fileSpan: HTMLElement = this.parent.createElement('span', { className: 'e-file-alert-span' });
                            fileSpan.innerText = error;
                            if (this.parent.element.querySelector('.e-file-alert-span')) {
                                this.parent.element.querySelector('.e-file-alert-span').remove();
                            }
                            (this.parent.element.querySelector('.e-open-dlg').querySelector('.e-dlg-content')).appendChild(fileSpan);
                        }
                    }
                }]
            };
            dialogInst.show(dlg);
        } else {
            dialogInst.hide();
        }
    }
    private checkValidName(name: string): boolean {
        let isValidName: boolean = true;
        if (name.match(new RegExp('.*[\\[\\]\\*\\\\/\\?\\:\\<\\>\\|\\"].*')) || name.length < 1 || name.length > 218) {
            isValidName = false;
        }
        return isValidName;
    }

    private OpenContent(type: string): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-open-dialog' });
        const openTextHeader: HTMLElement = this.parent.createElement('div', { className: 'e-open-head' });
        const openTextE: HTMLElement = this.parent.createElement('div', { className: 'e-input-group' });
        dialogElem.appendChild(openTextHeader);
        dialogElem.appendChild(openTextE);
        const header: string = l10n.getConstant('FileName');
        const id: string = `${this.parent.element.id}_filename`;
        const openTextH: HTMLElement = this.parent.createElement(
            'p', { className: 'e-header', id: id, attrs: { 'aria-label': `${l10n.getConstant('SaveAs')} ${header}` } });
        openTextH.innerText = header;
        const openTextIp: HTMLElement = this.parent.createElement(
            'input', { className: 'e-input e-text-open', attrs: { 'type': 'Text', 'aria-labelledby': id }});
        const openTextSpan: HTMLElement = this.parent.createElement('span', { className: 'e-input-group-icon'});
        openTextIp.onkeyup = (e: KeyboardEventArgs): void => {
            if (this.parent.element.querySelector('.e-file-alert-span') && e.keyCode !== 13) {
                const saveButton: HTMLElement = this.parent.element.querySelector('.e-btn-open-ok') as HTMLElement;
                const buttonObj: { disabled: boolean } = getComponent(saveButton, 'btn') as { disabled: boolean };
                buttonObj.disabled = false;
                this.parent.element.querySelector('.e-file-alert-span').remove();
            }
        };
        openTextHeader.appendChild(openTextH);
        openTextSpan.textContent = '.' + type.toLowerCase();
        openTextE.appendChild(openTextIp);
        openTextIp.setAttribute('value', 'Sample');
        openTextE.appendChild(openTextSpan);
        return dialogElem;
    }
}
