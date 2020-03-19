import { Spreadsheet } from '../base/index';
import { findDlg, locale, dialog, gotoDlg, replace, findHandler, beginAction, BeforeReplaceEventArgs } from '../common/index';
import { ReplaceEventArgs, completeAction, ReplaceAllEventArgs } from '../common/index';
import { L10n, getComponent, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { ToolbarFind, goto, FindOptions, showDialog, findUndoRedo, count, replaceAllDialog, findKeyUp } from '../../workbook/index';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DialogModel } from '@syncfusion/ej2-popups';

/**
 * `FindAndReplace` module is used to handle the search action in Spreadsheet.
 */

export class FindAndReplace {
    private parent: Spreadsheet;
    private shortValue: string = '';
    /**
     * Constructor for FindAndReplace module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(findDlg, this.renderFindDlg, this);
        this.parent.on(gotoDlg, this.renderGotoDlg, this);
        this.parent.on(goto, this.gotoHandler, this);
        this.parent.on(findHandler, this.findHandler, this);
        this.parent.on(replace, this.replaceHandler, this);
        this.parent.on(showDialog, this.showDialog, this);
        this.parent.on(replaceAllDialog, this.replaceAllDialog, this);
        this.parent.on(findUndoRedo, this.findUndoRedo, this);
        this.parent.on(findKeyUp, this.findKeyUp, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(findDlg, this.renderFindDlg);
            this.parent.off(gotoDlg, this.renderGotoDlg);
            this.parent.off(goto, this.gotoHandler);
            this.parent.off(findHandler, this.findHandler);
            this.parent.off(replace, this.replaceHandler);
            this.parent.off(showDialog, this.showDialog);
            this.parent.off(replaceAllDialog, this.replaceAllDialog);
            this.parent.off(findUndoRedo, this.findUndoRedo);
            this.parent.off(findKeyUp, this.findKeyUp);
        }
    }
    private findUndoRedo(options: { [key: string]: string }): void {
        let eventArgs: BeforeReplaceEventArgs = { address: options.address, compareVal: options.compareVal, cancel: false };
        if (options.undoRedoOpt === 'before') {
            this.parent.notify(beginAction, { action: 'beforeReplace', eventArgs: eventArgs });
        } else if (options.undoRedoOpt === 'after') {
            if (!eventArgs.cancel) {
                let eventArgs: ReplaceEventArgs = { address: options.address, compareVal: options.compareVal };
                this.parent.notify(completeAction, { action: 'replace', eventArgs: eventArgs });
            }
        } else if (options.undoRedoOpt === 'beforeReplaceAll') {
            if (!eventArgs.cancel) {
                let eventArgs: ReplaceAllEventArgs = { replace: options.replace, replaceFor: options.replaceFor };
                this.parent.notify(beginAction, { action: 'beforeReplaceAll', eventArgs });
            }
        } else if (options.undoRedoOpt === 'afterReplaceAll') {
            if (!eventArgs.cancel) {
                let eventArgs: ReplaceAllEventArgs = { replace: options.replace, replaceFor: options.replaceFor };
                this.parent.notify(completeAction, { action: 'undoRedo', eventArgs });
            }
        }
    }
    private renderFindDlg(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let findOpt: string;
        let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        let cancelBtn: boolean = false;
        let dlg: DialogModel = {
            isModal: false, showCloseIcon: true, cssClass: 'e-find-dlg', allowDragging: true,
            header: l10n.getConstant('FindAndReplace'), closeOnEscape: true,
            beforeOpen: (): void => {
                dialogInst.dialogInstance.content = this.findandreplaceContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('FindPreviousBtn'), isPrimary: true, cssClass: 'e-btn-findPrevious', disabled: true
                },
                click: (): void => {
                    findOpt = 'prev';
                    this.findDlgClick(findOpt);
                }
            }, {
                buttonModel: {
                    content: l10n.getConstant('FindNextBtn'), isPrimary: true, cssClass: 'e-btn-findNext', disabled: true

                },
                click: (): void => {
                    findOpt = 'next';
                    this.findDlgClick(findOpt);
                }
            }, {
                buttonModel: {
                    content: l10n.getConstant('ReplaceBtn'), isPrimary: true, cssClass: 'e-btn-replace', disabled: true
                },
                click: (): void => {
                    let replace: string = 'replace';
                    this.findDlgClick(replace);
                }
            }, {
                buttonModel: {
                    content: l10n.getConstant('ReplaceAllBtn'), isPrimary: true, cssClass: 'e-btn-replaceAll', disabled: true
                },
                click: (): void => {
                    let replace: string = 'replaceAll';
                    this.findDlgClick(replace);
                }
            }], open: (): void => {
                let findInput: string = (this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement).value;
                if (findInput) {
                    let prevButton: HTMLElement = this.parent.element.querySelector('.e-btn-findPrevious') as HTMLElement;
                    let prevButtonObj: Button = getComponent(prevButton, 'btn') as Button;
                    prevButtonObj.disabled = false;
                    (getComponent(this.parent.element.querySelector('.e-btn-findNext') as HTMLElement, 'btn') as Button).disabled = false;
                }
            },
        };
        dialogInst.show(dlg, cancelBtn);
    }
    private renderGotoDlg(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        let cancelBtn: boolean = false;
        let dlg: DialogModel = {
            width: 300, isModal: false, showCloseIcon: true, cssClass: 'e-goto-dlg', allowDragging: true,
            header: l10n.getConstant('GotoHeader'),
            beforeOpen: (): void => {
                dialogInst.dialogInstance.content = this.GotoContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true, cssClass: 'e-btn-goto-ok'
                },
                click: (): void => {
                    this.gotoHandler();
                }
            }]
        };
        dialogInst.show(dlg, cancelBtn);
    }
    private findDlgClick(findDlgArgs: string): void {
        if (findDlgArgs === 'prev') {
            this.findHandler({ findOption: findDlgArgs });
        } else if (findDlgArgs === 'next') {
            this.findHandler({ findOption: findDlgArgs });
        } else {
            this.replaceHandler({ findDlgArgs: findDlgArgs });
        }
    }
    private findHandler(findOpt?: ToolbarFind): void {
        let findInput: HTMLInputElement = (this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement);
        if (!findInput) {
            findInput = document.querySelector('.e-text-findNext-short') as HTMLInputElement;
            if (!findInput) {
                this.gotoAlert();
            }
        }
        let value: string = findInput.value;
        if (findInput.value !== '') {
        let sheetIndex: number = this.parent.activeSheetTab;
        let checkCase: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkcase') as HTMLElement;
        let isCSen: boolean;
        if (!checkCase) {
            isCSen = false;
        } else {
            let caseCheckbox: CheckBox = getComponent(checkCase, 'checkbox') as CheckBox;
            isCSen = caseCheckbox.checked;
        }
        let checkmatch: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkmatch') as HTMLElement;
        let isEMatch: boolean;
        if (!checkmatch) {
            isEMatch = false;
        } else {
            let entireMatchCheckbox: CheckBox = getComponent(checkmatch, 'checkbox') as CheckBox;
            isEMatch = entireMatchCheckbox.checked;
        }
        let searchitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchby') as HTMLElement;
        let searchBy: string;
        if (!searchitem) {
            searchBy = 'By Row';
        } else {
            let searchDDL: DropDownList = getComponent(searchitem, 'dropdownlist') as DropDownList;
            searchBy = searchDDL.value.toString();
        }
        let modeitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchwithin') as HTMLElement;
        let mode: string;
        if (!modeitem) {
            mode = 'Sheet';
        } else {
            let modeDDL: DropDownList = getComponent(modeitem, 'dropdownlist') as DropDownList;
            mode = modeDDL.value.toString();
        }
        let args: FindOptions = {
            value: value, sheetIndex: sheetIndex, findOpt: findOpt.findOption, mode: mode, isCSen: isCSen,
            isEMatch: isEMatch, searchBy: searchBy
        };
        if (findOpt.findOption === 'next' || findOpt.findOption === 'prev') {
            this.parent.find(args);
        } else if (findOpt.countArgs.countOpt === 'count') {
            this.parent.notify(count, args);
            findOpt.countArgs.findCount = args.findCount;
        }
    }
    }
    private replaceHandler(replace: { [key: string]: string }): void {
        let sheetIndex: number = this.parent.activeSheetTab;
        let findInput: HTMLInputElement = this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement;
        let replaceWith: HTMLInputElement = this.parent.element.querySelector('.e-text-replaceInp') as HTMLInputElement;
        let checkCase: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkcase') as HTMLElement;
        let caseCheckbox: CheckBox = getComponent(checkCase, 'checkbox') as CheckBox;
        let checkmatch: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkmatch') as HTMLElement;
        let eMatchCheckbox: CheckBox = getComponent(checkmatch, 'checkbox') as CheckBox;
        let searchitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchby') as HTMLElement;
        let searchDDL: DropDownList = getComponent(searchitem, 'dropdownlist') as DropDownList;
        let modeitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchwithin') as HTMLElement;
        let modeDDL: DropDownList = getComponent(modeitem, 'dropdownlist') as DropDownList;
        let findOption: string = 'next';
        let args: FindOptions = {
            value: findInput.value, mode: modeDDL.value.toString(), isCSen: caseCheckbox.checked,
            isEMatch: eMatchCheckbox.checked, searchBy: searchDDL.value.toString(), findOpt: findOption, replaceValue: replaceWith.value,
            replaceBy: replace.findDlgArgs ? replace.findDlgArgs : replace.replaceMode, sheetIndex: sheetIndex
        };
        this.parent.replace(args);
    }

    private gotoHandler(address?: { [key: string]: string }): void {
        if (address) {
            this.parent.goTo(address.address);
        } else {
            let item: HTMLInputElement = this.parent.element.querySelector('.e-text-goto') as HTMLInputElement;
            let gotoaddress: string = item.value;
            let splitAddress: string[] = gotoaddress.split('');
            if ((gotoaddress === '') || isNaN(parseInt(splitAddress[1], 10))) {
                this.gotoAlert();
                return;
            } else {
                let address: string = gotoaddress.toString().toUpperCase();
                this.parent.goTo(address);
            }
        }
    }

    private gotoAlert(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        let dlg: DialogModel = {
            width: 300, isModal: true, showCloseIcon: true, cssClass: 'e-goto-alert-dlg',
            beforeOpen: (): void => {
                dialogInst.dialogInstance.content = l10n.getConstant('InsertingEmptyValue'); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            }
        };
        dialogInst.show(dlg);
    }

    private showDialog(): void {
        (this.parent.serviceLocator.getService(dialog) as Dialog).show({
            width: 300, isModal: true, showCloseIcon: true, cssClass: 'e-find-alert-dlg',
            content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('NoElements')
        });
    }
    private replaceAllDialog(options: { [key: string]: number | string }): void {
        let l10n: L10n = (this.parent.serviceLocator.getService(locale));
        (this.parent.serviceLocator.getService(dialog) as Dialog).show({
            height: 160, width: 300, isModal: true, showCloseIcon: true,
            content: options.count + l10n.getConstant('ReplaceAllEnd') + options.replaceValue
        });
    }

    private findKeyUp(e: KeyboardEvent): void {
        if (e.target as HTMLElement, 'e-text-findNext') {
            let findValue: string = (document.querySelector('.e-text-findNext') as HTMLInputElement).value;
            if (!isNullOrUndefined(findValue) && findValue !== '') {
                let prevButton: HTMLElement = this.parent.element.querySelector('.e-btn-findPrevious') as HTMLElement;
                let prevButtonObj: Button = getComponent(prevButton, 'btn') as Button;
                prevButtonObj.disabled = false;
                (getComponent(this.parent.element.querySelector('.e-btn-findNext') as HTMLElement, 'btn') as Button).disabled = false;
            } else {
                (getComponent(this.parent.element.querySelector('.e-btn-findPrevious') as HTMLElement, 'btn') as Button).disabled = true;
                (getComponent(this.parent.element.querySelector('.e-btn-findNext') as HTMLElement, 'btn') as Button).disabled = true;
            }
        }
        let findValue: string = (document.querySelector('.e-text-findNext') as HTMLInputElement).value;
        let replaceValue: string = (document.querySelector('.e-text-replaceInp') as HTMLInputElement).value;
        if (!isNullOrUndefined(findValue) && !isNullOrUndefined(replaceValue) && (findValue !== '') && (replaceValue !== '')) {
                (getComponent(this.parent.element.querySelector('.e-btn-replace') as HTMLElement, 'btn') as Button).disabled = false;
                (getComponent(this.parent.element.querySelector('.e-btn-replaceAll') as HTMLElement, 'btn') as Button).disabled = false;
            } else {
                (getComponent(this.parent.element.querySelector('.e-btn-replace') as HTMLElement, 'btn') as Button).disabled = true;
                (getComponent(this.parent.element.querySelector('.e-btn-replaceAll') as HTMLElement, 'btn') as Button).disabled = true;
        }
    }

    private findandreplaceContent(): HTMLElement {
        if (document.querySelector('.e-text-findNext-short') as HTMLInputElement) {
            this.shortValue = (document.querySelector('.e-text-findNext-short') as HTMLInputElement).value;
        }
        let dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-link-dialog' });
        let findElem: HTMLElement = this.parent.createElement('div', { className: 'e-find' });
        let findCheck: HTMLElement = this.parent.createElement('div', { className: 'e-findCheck' });
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        dialogElem.appendChild(findElem);
        let findTextE: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let findTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('FindWhat') });
        let findTextIp: HTMLElement = this.parent.createElement('input', {
            className: 'e-input e-text-findNext', attrs: {
                'type': 'Text', 'placeholder': l10n.getConstant('FindValue'),
                'value': this.shortValue
            }
        });
        findTextE.appendChild(findTextIp);
        findTextE.insertBefore(findTextH, findTextIp);
        findElem.appendChild(findTextE);
        let findTextBox: TextBox = new TextBox({ width: '70%' });
        findTextBox.createElement = this.parent.createElement;
        findTextBox.appendTo(findTextIp);
        let replaceTextE: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let replaceTextH: HTMLElement =
            this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('ReplaceWith') });
        let replaceTextIp: HTMLElement = this.parent.createElement('input', {
            className: 'e-input e-text-replaceInp', attrs: { 'type': 'Text', 'placeholder': l10n.getConstant('ReplaceValue') }
        });
        replaceTextE.appendChild(replaceTextIp);
        replaceTextE.insertBefore(replaceTextH, replaceTextIp);
        findElem.appendChild(replaceTextE);
        let replaceTextBox: TextBox = new TextBox({ width: '70%' });
        replaceTextBox.createElement = this.parent.createElement;
        replaceTextBox.appendTo(replaceTextIp);
        let withinData: { [key: string]: Object }[] = [
            { Id: 'Sheet', Within: l10n.getConstant('Sheet') },
            { Id: 'Workbook', Within: l10n.getConstant('Workbook') }
        ];
        let withInDDL: DropDownList = new DropDownList(
            {
                dataSource: withinData,
                cssClass: 'e-searchby',
                fields: { value: 'Id', text: 'Within' }, width: '50%', index: 0
            });
        let withIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchwithin', attrs: { type: 'select', label: l10n.getConstant('SearchBy') }
        });
        let withinTextH: HTMLElement =
            this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('SearchWithin') });
        findElem.appendChild(withinTextH);
        findElem.appendChild(withIn);
        withInDDL.createElement = this.parent.createElement;
        withInDDL.appendTo(withIn);
        let searchData: { [key: string]: Object }[] = [
            { Id: 'By Row', Search: l10n.getConstant('ByRow') },
            { Id: 'By Column', Search: l10n.getConstant('ByColumn') }
        ];
        let searchDDL: DropDownList = new DropDownList(
            {
                dataSource: searchData,
                cssClass: 'e-searchby',
                fields: { value: 'Id', text: 'Search' }, width: '50%', index: 0
            });
        let searchIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchby', attrs: { type: 'select', label: l10n.getConstant('SearchBy') }
        });
        let searchTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('SearchBy') });
        findElem.appendChild(searchTextH);
        findElem.appendChild(searchIn);
        searchDDL.createElement = this.parent.createElement;
        searchDDL.appendTo(searchIn);

        let isCSen: CheckBox = new CheckBox({
            label: l10n.getConstant('MatchCase'), checked: false,
            cssClass: 'e-findnreplace-casecheckbox'
        });
        let caaseCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-checkcase', attrs: { type: 'checkbox' }
        });
        findCheck.appendChild(caaseCheckbox);
        isCSen.createElement = this.parent.createElement;
        isCSen.appendTo(caaseCheckbox);
        let isEMatch: CheckBox = new CheckBox({
            label: l10n.getConstant('MatchExactCellElements'), checked: false,
            cssClass: 'e-findnreplace-exactmatchcheckbox',
        });
        let entirematchCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-checkmatch', attrs: { type: 'checkbox' }
        });
        findCheck.appendChild(entirematchCheckbox);
        isEMatch.createElement = this.parent.createElement;
        isEMatch.appendTo(entirematchCheckbox);
        findElem.appendChild(findCheck);
        return dialogElem;
    }
    private GotoContent(): HTMLElement {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-link-dialog' });
        let gotoElem: HTMLElement = this.parent.createElement('div', { className: 'e-goto' });
        dialogElem.appendChild(gotoElem);
        let gotoTextE: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let gotoTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('Reference') });
        let gotoTextBox: TextBox = new TextBox({
            placeholder: l10n.getConstant('EntercellAddress')
        });
        let gotoTextIp: HTMLElement = this.parent.createElement('input', { className: 'e-text-goto', attrs: { 'type': 'Text' } });
        gotoTextE.appendChild(gotoTextIp);
        gotoTextE.insertBefore(gotoTextH, gotoTextIp);
        gotoElem.appendChild(gotoTextE);
        gotoTextBox.createElement = this.parent.createElement;
        gotoTextBox.appendTo(gotoTextIp);
        return dialogElem;
    }

    /**
     * To destroy the find-and-replace module.
     * @return {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'findAndReplace';
    }
}