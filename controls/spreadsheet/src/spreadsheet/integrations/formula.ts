import { Spreadsheet, DialogBeforeOpenEventArgs } from '../index';
import { formulaOperation, keyUp, keyDown, click, refreshFormulaDatasource, formulaBarOperation, keyCodes, isNavigationKey } from '../common/index';
import { editOperation, dialog, locale, focus } from '../common/index';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { PopupEventArgs, SelectEventArgs, AutoCompleteModel } from '@syncfusion/ej2-dropdowns';
import { KeyboardEventArgs, L10n, detach, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { checkIsFormula, getSheet, SheetModel, getSheetName, DefineNameModel, getCellIndexes, isCellReference } from '../../workbook/index';
import { workbookFormulaOperation, Workbook } from '../../workbook/index';
import { Dialog } from '../services/index';

/**
 * @hidden
 * The `Formula` module is used to handle the formulas and its functionalities in Spreadsheet.
 */
export class Formula {
    private parent: Spreadsheet;

    private isFormulaBar: boolean = false;
    private isFormula: boolean = false;
    private isPopupOpened: boolean = false;
    private isPreventClose: boolean = false;
    private isSubFormula: boolean = false;

    public autocompleteInstance: AutoComplete;
    private acInputElement: HTMLInputElement;

    /**
     * Constructor for formula module in Spreadsheet.
     *
     * @private
     * @param {Spreadsheet} parent - Constructor for formula module in Spreadsheet.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookFormula);
    }

    /**
     * Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    public getModuleName(): string {
        return 'formula';
    }

    /**
     * To destroy the formula module.
     *
     * @returns {void} - To destroy the formula module.
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.autocompleteInstance) {
            this.autocompleteInstance.destroy();
            if (this.autocompleteInstance.element) {
                this.autocompleteInstance.element.remove();
                this.autocompleteInstance.element = null;
            }
        }
        this.autocompleteInstance = null;
        if (this.acInputElement) { this.acInputElement.remove(); this.acInputElement = null; }
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(formulaOperation, this.performFormulaOperation, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(click, this.formulaClick, this);
        this.parent.on(refreshFormulaDatasource, this.refreshFormulaDatasource, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(formulaOperation, this.performFormulaOperation);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(click, this.formulaClick);
            this.parent.off(refreshFormulaDatasource, this.refreshFormulaDatasource);
        }
    }

    private performFormulaOperation(args: { [key: string]: Object }): void {
        const action: string = <string>args.action;
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let dialogInst: Dialog;
        let dialogContent: string;
        switch (action) {
        case 'renderAutoComplete':
            this.renderAutoComplete();
            break;
        case 'endEdit':
            this.endEdit();
            break;
        case 'addDefinedName':
            args.isAdded = this.addDefinedName(<DefineNameModel>args.definedName);
            break;
        case 'getNames':
            if (!args.sheetName) {
                args.sheetName = getSheetName(this.parent as Workbook);
            }
            args.names = this.getNames(<string>args.sheetName);
            break;
        case 'getNameFromRange':
            args.definedName = this.getNameFromRange(<string>args.range);
            break;
        case 'isFormulaEditing':
            args.isFormulaEdit = this.isFormula;
            break;
        case 'isCircularReference':
            dialogInst = (this.parent.serviceLocator.getService(dialog) as Dialog);
            dialogContent = l10n.getConstant('CircularReference');
            if (!(dialogInst.dialogInstance && dialogInst.dialogInstance.visible && dialogInst.dialogInstance.content === dialogContent)) {
                dialogInst.show({
                    height: 180, width: 400, isModal: true, showCloseIcon: true,
                    content: l10n.getConstant('CircularReference'),
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        const dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'CircularReferenceDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                    }
                });
            }
            args.argValue = '0';
            break;

        }
    }

    private renderAutoComplete(): void {
        if (!select('#' + this.parent.element.id + '_ac', this.parent.element)) {
            const acElem: HTMLInputElement = this.parent.createElement(
                'input', { id: this.parent.element.id + '_ac', className: 'e-ss-ac' }) as HTMLInputElement;
            this.parent.element.appendChild(acElem);

            const eventArgs: { action: string, formulaCollection: string[] } = {
                action: 'getLibraryFormulas',
                formulaCollection: []
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            const autoCompleteOptions: AutoCompleteModel = {
                dataSource: eventArgs.formulaCollection,
                cssClass: 'e-ss-atc',
                popupWidth: '130px',
                allowFiltering: true,
                filterType: 'StartsWith',
                sortOrder: 'Ascending',
                open: this.onSuggestionOpen.bind(this),
                close: this.onSuggestionClose.bind(this),
                select: this.onSelect.bind(this),
                actionComplete: this.onSuggestionComplete.bind(this)
            };
            this.autocompleteInstance = new AutoComplete(autoCompleteOptions, acElem);
            this.autocompleteInstance.createElement = this.parent.createElement;
            this.acInputElement = acElem;
        }
    }

    private onSuggestionOpen(e: PopupEventArgs): void {
        this.isPopupOpened = true;
        e.popup.relateTo = this.getRelateToElem();
        (<HTMLElement>e.popup.element.firstChild).style.maxHeight = '180px';
        new Promise((resolve: Function) => {
            setTimeout(() => { resolve(); }, 100);
        }).then(() => {
            this.triggerKeyDownEvent(keyCodes.DOWN);
        });
    }

    private onSuggestionClose(e: PopupEventArgs): void {
        if (this.isPreventClose) {
            e.cancel = true;
        } else {
            this.isPopupOpened = false;
        }
    }

    private onSelect(e: SelectEventArgs): void {
        let updatedFormulaValue: string = '=' + e.itemData.value + '(';
        if (this.isSubFormula) {
            const editValue: string = this.getEditingValue();
            let parseIndex: number = editValue.lastIndexOf(this.parent.listSeparator);
            if (parseIndex > -1) {
                updatedFormulaValue = editValue.slice(0, parseIndex + 1);
            } else {
                parseIndex = editValue.lastIndexOf('(');
                if (parseIndex > -1) {
                    updatedFormulaValue = editValue.slice(0, parseIndex + 1);
                }
            }
            updatedFormulaValue += e.itemData.value + '(';
        }
        this.parent.notify(
            editOperation, {
                action: 'refreshEditor', value: updatedFormulaValue,
                refreshFormulaBar: true, refreshEditorElem: true, refreshCurPos: !this.isFormulaBar
            });
        if (this.isPopupOpened) {
            this.hidePopUp();
            const suggPopupElem: HTMLElement = select('#' + this.parent.element.id + '_ac_popup');
            if (suggPopupElem) {
                detach(suggPopupElem);
            }
            this.isPopupOpened = false;
        }
    }

    private onSuggestionComplete(args: { result: string[], cancel: boolean }): void {
        this.isPreventClose = args.result.length > 0;
        if (!this.isPreventClose) {
            args.cancel = true;
            this.hidePopUp();
        }
    }
    private refreshFormulaDatasource(): void {
        const eventArgs: { action: string, formulaCollection: string[] } = {
            action: 'getLibraryFormulas',
            formulaCollection: []
        };
        this.parent.notify(workbookFormulaOperation, eventArgs);
        if (this.autocompleteInstance) {
            this.autocompleteInstance.dataSource = eventArgs.formulaCollection;
        }
    }

    private keyUpHandler(e: KeyboardEventArgs): void {
        if (this.parent.isEdit) {
            let editValue: string = this.getEditingValue();
            this.isFormula = checkIsFormula(editValue);

            if (this.isFormula || this.isPopupOpened) {
                if (e.keyCode !== keyCodes.TAB && this.isFormula) {
                    editValue = this.getSuggestionKeyFromFormula(editValue);
                }
                this.refreshFormulaSuggestion(e, editValue);
            }
        } else if (this.isPopupOpened) {
            this.hidePopUp();
        }
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        const keyCode: number = e.keyCode;
        if (this.isFormula) {
            if (this.isPopupOpened) {
                switch (keyCode) {
                case keyCodes.UP:
                case keyCodes.DOWN:
                    e.preventDefault();
                    this.triggerKeyDownEvent(keyCode);
                    break;
                case keyCodes.TAB:
                    e.preventDefault();
                    this.triggerKeyDownEvent(keyCodes.ENTER);
                    break;
                }
            }
        } else {
            const trgtElem: HTMLInputElement = <HTMLInputElement>e.target;
            if (trgtElem.id === this.parent.element.id + '_name_box') {
                switch (keyCode) {
                case keyCodes.ENTER:
                    if (!document.querySelector('.e-name-box.e-popup-open')) {
                        this.addDefinedName({ name: trgtElem.value });
                        focus(this.parent.element);
                    }
                    break;
                case keyCodes.ESC:
                    focus(this.parent.element);
                    break;
                }
            }
        }
    }

    private formulaClick(e: MouseEvent & TouchEvent): void {
        if (this.parent.isEdit) {
            const trgtElem: HTMLElement = <HTMLElement>e.target;
            this.isFormulaBar = trgtElem.classList.contains('e-formula-bar');
        }
    }

    private refreshFormulaSuggestion(e: KeyboardEventArgs, formula: string): void {
        if (formula.length > 0) {
            const autoCompleteElem: HTMLInputElement = <HTMLInputElement>this.autocompleteInstance.element;
            const keyCode: number = e.keyCode;
            const isSuggestionAlreadyOpened: boolean = this.isPopupOpened;
            if (!isNavigationKey(keyCode)) {
                autoCompleteElem.value = formula;
                autoCompleteElem.dispatchEvent(new Event('input'));
                autoCompleteElem.dispatchEvent(new Event('keyup'));
                if (isSuggestionAlreadyOpened) {
                    this.triggerKeyDownEvent(keyCodes.DOWN);
                }
            }
        } else {
            if (this.isPopupOpened) {
                this.isPreventClose = false;
                this.hidePopUp();
            }
        }
    }

    private endEdit(): void {
        this.isSubFormula = false;
        this.isPreventClose = false;
        this.isFormula = false;
        this.isFormulaBar = false;
        if (this.isPopupOpened) {
            this.hidePopUp();
            const suggPopupElem: HTMLElement = select('#' + this.parent.element.id + '_ac_popup');
            if (suggPopupElem) {
                detach(suggPopupElem);
            }
            this.isPopupOpened = false;
        }
    }

    private hidePopUp(): void {
        this.autocompleteInstance.hidePopup();
    }

    private getSuggestionKeyFromFormula(formula: string): string {
        let suggestValue: string = '';
        formula = formula.substr(1); //remove = char.
        if (formula) {
            const bracketIndex: number = formula.lastIndexOf('(');
            formula = formula.substr(bracketIndex + 1);
            const fSplit: string[] = formula.split(this.parent.listSeparator);
            if (fSplit.length === 1) {
                suggestValue = fSplit[0];
                this.isSubFormula = bracketIndex > -1;
            } else {
                suggestValue = fSplit[fSplit.length - 1];
                this.isSubFormula = true;
            }
            const isAlphaNumeric: RegExpMatchArray = suggestValue.match(/\w/);
            if (!isAlphaNumeric || (isAlphaNumeric && isAlphaNumeric.index !== 0)) {
                suggestValue = '';
            }
        }
        return suggestValue;
    }

    private getRelateToElem(): HTMLElement {
        const eventArgs: { action: string, element?: HTMLElement } = { action: 'getElement' };
        if (this.isFormulaBar) {
            this.parent.notify(formulaBarOperation, eventArgs);
        } else {
            this.parent.notify(editOperation, eventArgs);
        }
        return eventArgs.element;
    }

    private getEditingValue(): string {
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        return eventArgs.editedValue;
    }

    private triggerKeyDownEvent(keyCode: number): void {
        const autoCompleteElem: HTMLInputElement = <HTMLInputElement>this.autocompleteInstance.element;
        autoCompleteElem.dispatchEvent(new Event('input'));
        const eventArg: Event = new Event('keydown');
        eventArg['keyCode'] = keyCode;
        eventArg['which'] = keyCode;
        eventArg['altKey'] = false;
        eventArg['shiftKey'] = false;
        eventArg['ctrlKey'] = false;
        /* eslint-enable @typescript-eslint/dot-notation */
        autoCompleteElem.dispatchEvent(eventArg);
    }

    private getNames(sheetName?: string): DefineNameModel[] {
        const names: DefineNameModel[] = this.parent.definedNames.filter(
            (name: DefineNameModel) => name.scope === 'Workbook' || name.scope === '' || name.scope === sheetName);
        return names;
    }

    private getNameFromRange(range: string): DefineNameModel {
        const singleRange: string = range.slice(0, range.indexOf(':'));
        const sRange: string[] = range.substring(range.lastIndexOf('!') + 1).split(':');
        const isSingleCell: boolean = sRange.length > 1 && sRange[0] === sRange[1];
        let sheetName: string; let referRange: string;
        const name: DefineNameModel[] = this.parent.definedNames.filter(
            (name: DefineNameModel) => {
                sheetName = name.refersTo.substring(0, name.refersTo.lastIndexOf('!'));
                referRange = name.refersTo.substring(name.refersTo.lastIndexOf('!') + 1);
                if (sheetName.includes('\'') && sheetName.match(/^='.*'$/)) {
                    sheetName = '=' + sheetName.slice(2, -1);
                }
                const referValue: string = sheetName + '!' + referRange.split('$').join('');
                if (isSingleCell && referValue === '=' + singleRange) {
                    return true;
                }
                return referValue === '=' + range;
            });
        return name && name[0];
    }

    private addDefinedName(definedName: DefineNameModel): boolean {
        const name: string = definedName.name;
        let isAdded: boolean = false;
        if (name && isCellReference(name.toUpperCase())) {
            this.parent.goTo(name);
            return isAdded;
        }
        if (!definedName.refersTo) {
            const sheet: SheetModel = getSheet(this.parent as Workbook, this.parent.activeSheetIndex);
            let sheetName: string = getSheetName(this.parent as Workbook);
            sheetName = sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName;
            let selectRange: string = sheet.selectedRange;
            if (!isNullOrUndefined(selectRange)) {
                const colIndex: number = selectRange.indexOf(':');
                let left: string = selectRange.substr(0, colIndex);
                let right: string = selectRange.substr(colIndex + 1, selectRange.length);
                if (parseInt(right.replace(/\D/g, ''), 10) === sheet.rowCount && parseInt(left.replace(/\D/g, ''), 10) === 1) {
                    right = right.replace(/[0-9]/g, '');
                    left = left.replace(/[0-9]/g, '');
                    selectRange = '$' + left + ':$' + right;
                } else if (getCellIndexes(right)[1] === sheet.colCount - 1 && getCellIndexes(left)[1] === 0) {
                    right = right.replace(/\D/g, '');
                    left = left.replace(/\D/g, '');
                    selectRange = '$' + left + ':$' + right;
                } else {
                    selectRange = left === right ? left : selectRange;
                }
            }
            definedName.refersTo = sheetName + '!' + selectRange;
            definedName.scope = 'Workbook';
        }
        if (name.length > 0 && (/^([a-zA-Z_0-9.]){0,255}$/.test(name))) {
            const eventArgs: { [key: string]: Object } = {
                action: 'addDefinedName', definedName: definedName, isAdded: false
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            isAdded = <boolean>eventArgs.isAdded;
            if (!eventArgs.isAdded) {
                (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                    content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('DefineNameExists'),
                    width: '300',
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        const dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'DefineNameExistsDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                    }
                });
            }
        } else {
            (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('DefineNameInValid'),
                width: '300',
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'DefineNameInValidDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                }
            });
        }
        return isAdded;
    }
}
