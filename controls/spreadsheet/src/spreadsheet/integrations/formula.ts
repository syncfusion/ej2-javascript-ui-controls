import { Spreadsheet, DialogBeforeOpenEventArgs } from '../index';
import { formulaOperation, keyUp, keyDown, click, refreshFormulaDatasource } from '../common/event';
import { editOperation, formulaBarOperation } from '../common/event';
import { workbookFormulaOperation } from '../../workbook/common/event';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { PopupEventArgs, SelectEventArgs, AutoCompleteModel } from '@syncfusion/ej2-dropdowns';
import { KeyboardEventArgs, L10n, detach, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { checkIsFormula, getSheet, SheetModel, getSheetName, DefineNameModel, getCellIndexes } from '../../workbook/index';
import { Dialog } from '../services/index';
import { dialog, locale } from '../common/index';

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
    private argumentSeparator: string;
    private keyCodes: { [key: string]: number } = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        FIRSTALPHABET: 65,
        LASTALPHABET: 90,
        SPACE: 32,
        BACKSPACE: 8,
        TAB: 9,
        DELETE: 46,
        ENTER: 13,
        ESC: 27
    };

    public autocompleteInstance: AutoComplete;

    /**
     * Constructor for formula module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookFormula);
    }

    /**
     * Get the module name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'formula';
    }

    /**
     * To destroy the formula module. 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.autocompleteInstance) {
            this.autocompleteInstance.destroy();
            if (this.autocompleteInstance.element) {
            this.autocompleteInstance.element.remove();
            }
        }
        this.autocompleteInstance = null;
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
        let action: string = <string>args.action;

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
                    args.sheetName = getSheetName(this.parent);
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
                let l10n: L10n = this.parent.serviceLocator.getService(locale);
                let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
                dialogInst.show({
                    height: 180, width: 400, isModal: true, showCloseIcon: true,
                    content: l10n.getConstant('CircularReference'),
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        let dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'CircularReferenceDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                    },
                });
                args.argValue = '0';
                break;

        }
    }

    private renderAutoComplete(): void {
        if (!select('#' + this.parent.element.id + '_ac', this.parent.element)) {
            let acElem: HTMLInputElement = this.parent.createElement(
                'input', { id: this.parent.element.id + '_ac', className: 'e-ss-ac' }) as HTMLInputElement;
            this.parent.element.appendChild(acElem);

            let eventArgs: { action: string, formulaCollection: string[] } = {
                action: 'getLibraryFormulas',
                formulaCollection: []
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            let autoCompleteOptions: AutoCompleteModel = {
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
        }
    }

    private onSuggestionOpen(e: PopupEventArgs): void {
        this.isPopupOpened = true;
        let position: ClientRect = this.getPopupPosition();
        e.popup.offsetX = position.left;
        e.popup.offsetY = (position.top + position.height);
        e.popup.refreshPosition();
        (<HTMLElement>e.popup.element.firstChild).style.maxHeight = '180px';
        new Promise((resolve: Function, reject: Function) => {
            setTimeout(() => { resolve(); }, 100);
        }).then(() => {
            this.triggerKeyDownEvent(this.keyCodes.DOWN);
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
            let editValue: string = this.getEditingValue();
            let parseIndex: number = editValue.lastIndexOf(this.getArgumentSeparator());
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
    }

    private onSuggestionComplete(args: { result: string[], cancel: boolean }): void {
        this.isPreventClose = args.result.length > 0;
        if (!this.isPreventClose) {
            args.cancel = true;
            this.hidePopUp();
        }
    }
    private refreshFormulaDatasource(): void {
        let eventArgs: { action: string, formulaCollection: string[] } = {
            action: 'getLibraryFormulas',
            formulaCollection: []
        };
        this.parent.notify(workbookFormulaOperation, eventArgs);
        this.autocompleteInstance.dataSource = eventArgs.formulaCollection;
    }

    private keyUpHandler(e: KeyboardEventArgs): void {
        if (this.parent.isEdit) {
            let editValue: string = this.getEditingValue();
            this.isFormula = checkIsFormula(editValue);

            if (this.isFormula || this.isPopupOpened) {
                if (e.keyCode !== this.keyCodes.TAB && this.isFormula) {
                    editValue = this.getSuggestionKeyFromFormula(editValue);
                }
                this.refreshFormulaSuggestion(e, editValue);
            }
        } else if (this.isPopupOpened) {
            this.hidePopUp();
        }
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        let keyCode: number = e.keyCode;
        if (this.isFormula) {
            if (this.isPopupOpened) {
                switch (keyCode) {
                    case this.keyCodes.UP:
                    case this.keyCodes.DOWN:
                        e.preventDefault();
                        this.triggerKeyDownEvent(keyCode);
                        break;
                    case this.keyCodes.TAB:
                        e.preventDefault();
                        this.triggerKeyDownEvent(this.keyCodes.ENTER);
                        break;
                }
            }
        } else {
            let trgtElem: HTMLInputElement = <HTMLInputElement>e.target;
            if (trgtElem.id === this.parent.element.id + '_name_box') {
                switch (keyCode) {
                    case this.keyCodes.ENTER:
                        this.addDefinedName({ name: trgtElem.value });
                        this.parent.element.focus();
                        break;
                    case this.keyCodes.ESC:
                        this.parent.element.focus();
                        break;
                }
            }
        }
    }

    private formulaClick(e: MouseEvent & TouchEvent): void {
        if (this.parent.isEdit) {
            let trgtElem: HTMLElement = <HTMLElement>e.target;
            this.isFormulaBar = trgtElem.classList.contains('e-formula-bar');
        }
    }

    private refreshFormulaSuggestion(e: KeyboardEventArgs, formula: string): void {
        if (formula.length > 0) {
            let autoCompleteElem: HTMLInputElement = <HTMLInputElement>this.autocompleteInstance.element;
            let keyCode: number = e.keyCode;
            let isSuggestionAlreadyOpened: boolean = this.isPopupOpened;
            if (!this.isNavigationKey(keyCode)) {
                autoCompleteElem.value = formula;
                autoCompleteElem.dispatchEvent(new Event('input'));
                autoCompleteElem.dispatchEvent(new Event('keyup'));
                if (isSuggestionAlreadyOpened) {
                    this.triggerKeyDownEvent(this.keyCodes.DOWN);
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
            let suggPopupElem: HTMLElement = select('#' + this.parent.element.id + '_ac_popup');
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
            let bracketIndex: number = formula.lastIndexOf('(');
            formula = formula.substr(bracketIndex + 1);
            let fSplit: string[] = formula.split(this.getArgumentSeparator());
            if (fSplit.length === 1) {
                suggestValue = fSplit[0];
                this.isSubFormula = bracketIndex > -1;
            } else {
                suggestValue = fSplit[fSplit.length - 1];
                this.isSubFormula = true;
            }
            let isAlphaNumeric: RegExpMatchArray = suggestValue.match(/\w/);
            if (!isAlphaNumeric || (isAlphaNumeric && isAlphaNumeric.index !== 0)) {
                suggestValue = '';
            }
        }
        return suggestValue;
    }

    private getPopupPosition(): ClientRect {
        let eventArgs: { action?: string, position: ClientRect } = { position: null };
        if (this.isFormulaBar) {
            eventArgs.action = 'getPosition';
            this.parent.notify(formulaBarOperation, eventArgs);
        } else {
            eventArgs.action = 'getPosition';
            this.parent.notify(editOperation, eventArgs);
        }
        return eventArgs.position;
    }

    private getEditingValue(): string {
        let eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        return eventArgs.editedValue;
    }

    private isNavigationKey(keyCode: number): boolean {
        return (keyCode === this.keyCodes.UP) || (keyCode === this.keyCodes.DOWN) || (keyCode === this.keyCodes.LEFT)
            || (keyCode === this.keyCodes.RIGHT);
    }

    private triggerKeyDownEvent(keyCode: number): void {
        let autoCompleteElem: HTMLInputElement = <HTMLInputElement>this.autocompleteInstance.element;
        autoCompleteElem.dispatchEvent(new Event('input'));
        let eventArg: Event = new Event('keydown');
        // tslint:disable:no-string-literal
        eventArg['keyCode'] = keyCode;
        eventArg['which'] = keyCode;
        eventArg['altKey'] = false;
        eventArg['shiftKey'] = false;
        eventArg['ctrlKey'] = false;
        // tslint:enable:no-string-literal
        autoCompleteElem.dispatchEvent(eventArg);
    }

    private getArgumentSeparator(): string {
        if (this.argumentSeparator) {
            return this.argumentSeparator;
        } else {
            let eventArgs: { action: string, argumentSeparator: string } = {
                action: 'getArgumentSeparator', argumentSeparator: ''
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            this.argumentSeparator = eventArgs.argumentSeparator;
            return eventArgs.argumentSeparator;
        }
    }

    private getNames(sheetName?: string): DefineNameModel[] {
        let names: DefineNameModel[] = this.parent.definedNames.filter(
            (name: DefineNameModel) => name.scope === 'Workbook' || name.scope === '' || name.scope === sheetName);
        return names;
    }

    private getNameFromRange(range: string): DefineNameModel {
        let singleRange: string = range.slice(0, range.indexOf(':'));
        let sRange: string[] = range.slice(range.indexOf('!') + 1).split(':');
        let isSingleCell: boolean = sRange.length > 1 && sRange[0] === sRange[1];
        let name: DefineNameModel[] = this.parent.definedNames.filter(
            (name: DefineNameModel, index: number) => {
                if (isSingleCell && name.refersTo === '=' + singleRange) {
                    return true;
                }
                return name.refersTo === '=' + range;
            });
        return name && name[0];
    }

    private addDefinedName(definedName: DefineNameModel): boolean {
        let name: string = definedName.name;
        let isAdded: boolean = false;
        if (!definedName.refersTo) {
            let sheet: SheetModel = getSheet(this.parent, this.parent.activeSheetIndex);
            let sheetName: string = getSheetName(this.parent);
            sheetName = sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName;
            let selectRange: string = sheet.selectedRange;
            if (!isNullOrUndefined(selectRange)) {
                let colIndex: number = selectRange.indexOf(':');
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
            let eventArgs: { [key: string]: Object } = {
                action: 'addDefinedName', definedName: definedName, isAdded: false
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            isAdded = <boolean>eventArgs.isAdded;
            if (!eventArgs.isAdded) {
                (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                    content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('DefineNameExists'),
                    width: '300',
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        let dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'DefineNameExistsDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                    },
                });
            }
        } else {
            (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('DefineNameInValid'),
                width: '300',
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    let dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'DefineNameInValidDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                },
            });
        }
        return isAdded;
    }
}