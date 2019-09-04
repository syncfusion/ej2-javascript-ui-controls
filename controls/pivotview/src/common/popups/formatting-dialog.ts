import { PivotView } from '../../pivotview/base/pivotview';
import { Dialog } from '@syncfusion/ej2-popups';
import { createElement, remove } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import { IAction } from '../base/interface';
import * as events from '../../common/base/constant';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { FormatSettingsModel } from '../../pivotview/model/datasourcesettings-model';
import { IFieldListOptions } from '../../base';

/**
 * Module to render NumberFormatting Dialog
 */

export class NumberFormatting implements IAction {
    public parent: PivotView;
    public dialog: Dialog;
    private valuesDropDown: DropDownList;
    private formatDropDown: DropDownList;
    private symbolDropDown: DropDownList;
    private groupingDropDown: DropDownList;
    private decimalDropDown: DropDownList;
    private customText: HTMLInputElement;
    private customLable: HTMLElement;
    private symbolLable: HTMLElement;
    private customRegex: RegExp =
        /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.parent.numberFormattingModule = this;
        this.removeEventListener();
        this.addEventListener();
    }

    /**
     * To get module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'numberformatting';
    }

    /**
     * To show Number Formatting dialog.
     * @returns void
     */
    public showNumberFormattingDialog(): void {
        let valueDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatDialog',
            className: cls.FORMATTING_DIALOG
        });
        this.parent.element.appendChild(valueDialog);
        this.dialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('numberFormat'),
            content: this.getDialogContent(),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateFormatting.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('apply'), isPrimary: true }
                },
                {
                    click: () => { this.dialog.hide(); },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: this.parent.element,
            overlayClick: () => { this.removeDialog(); },
            close: this.removeDialog.bind(this)
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo(valueDialog);
        this.dialog.element.querySelector('.' + cls.DIALOG_HEADER).innerHTML = this.parent.localeObj.getConstant('numberFormat');
        this.renderControls();
    }

    private getDialogContent(): HTMLElement {
        let outerElement: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatDialogOuter',
            className: cls.FORMATTING_DIALOG_OUTER
        });
        let table: HTMLElement = createElement('table', {
            id: this.parent.element.id + '_FormatTable',
            className: cls.FORMATTING_TABLE
        });
        let tRow: HTMLElement = createElement('tr');
        let tValue: HTMLElement = createElement('td');
        let valueLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatValueLable',
            className: cls.FORMATTING_VALUE_LABLE,
            innerHTML: this.parent.localeObj.getConstant('values')
        });
        let valueDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatValueDrop'
        });
        tValue.appendChild(valueLable);
        tValue.appendChild(valueDrop);
        tRow.appendChild(tValue);
        tValue = createElement('td');
        let groupingLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_GroupingLable',
            className: cls.FORMATTING_GROUPING_LABLE,
            innerHTML: this.parent.localeObj.getConstant('grouping')
        });
        let groupingDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_GroupingDrop'
        });
        tValue.appendChild(groupingLable);
        tValue.appendChild(groupingDrop);
        tRow.appendChild(tValue);
        table.appendChild(tRow);
        tRow = createElement('tr');
        tValue = createElement('td');
        let formatLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatLable',
            className: cls.FORMATTING_FORMAT_LABLE,
            innerHTML: this.parent.localeObj.getConstant('formatType')
        });
        let formatDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatDrop'
        });
        tValue.appendChild(formatLable);
        tValue.appendChild(formatDrop);
        tRow.appendChild(tValue);
        tValue = createElement('td');
        let decimalLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_DecimalLable',
            className: cls.FORMATTING_DECIMAL_LABLE,
            innerHTML: this.parent.localeObj.getConstant('decimalPlaces')
        });
        let decimalDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_DecimalDrop'
        });
        tValue.appendChild(decimalLable);
        tValue.appendChild(decimalDrop);
        tRow.appendChild(tValue);
        table.appendChild(tRow);
        tRow = createElement('tr');
        tValue = createElement('td');
        this.customLable = createElement('div', {
            id: this.parent.element.id + '_CustomLable',
            className: cls.FORMATTING_CUSTOM_LABLE,
            innerHTML: this.parent.localeObj.getConstant('customText')
        });
        this.customText = createElement('input', {
            id: this.parent.element.id + '_CustomText',
            attrs: {
                'type': 'text', 'tabindex': '1'
            },
            className: cls.INPUT + ' ' + cls.FORMATTING_CUSTOM_TEXT
        }) as HTMLInputElement;
        tValue.appendChild(this.customLable);
        tValue.appendChild(this.customText);
        tRow.appendChild(tValue);
        tValue = createElement('td');
        this.symbolLable = createElement('div', {
            id: this.parent.element.id + '_SymbolLable',
            className: cls.FORMATTING_SYMBOL_LABLE,
            innerHTML: this.parent.localeObj.getConstant('symbolPosition')
        });
        let symbolDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_SymbolDrop'
        });
        tValue.appendChild(this.symbolLable);
        tValue.appendChild(symbolDrop);
        tRow.appendChild(tValue);
        table.appendChild(tRow);
        outerElement.appendChild(table);
        return outerElement;
    }

    private renderControls(): void {
        if (this.dialog.element.querySelector('#' + this.parent.element.id + '_FormatValueDrop')) {
            let valueFields: { [key: string]: Object }[] = [];
            valueFields.push({
                index: 0, name: this.parent.localeObj.getConstant('AllValues'), field: this.parent.localeObj.getConstant('AllValues')
            });
            for (let i: number = 0; i < this.parent.dataSourceSettings.values.length; i++) {
                valueFields.push({
                    index: i + 1, name: this.parent.dataSourceSettings.values[i].caption || this.parent.dataSourceSettings.values[i].name,
                    field: this.parent.dataSourceSettings.values[i].name
                });
            }
            this.valuesDropDown = new DropDownList({
                dataSource: valueFields, fields: { text: 'name', value: 'field' }, enableRtl: this.parent.enableRtl,
                index: 0, cssClass: cls.FORMATTING_VALUE_DROP, change: this.valueChange.bind(this)
            });
            this.valuesDropDown.isStringTemplate = true;
            this.valuesDropDown.appendTo('#' + this.parent.element.id + '_FormatValueDrop');
        }
        if (this.dialog.element.querySelector('#' + this.parent.element.id + '_FormatDrop')) {
            let fields: { [key: string]: Object }[] = [
                { index: 0, name: this.parent.localeObj.getConstant('number') },
                { index: 1, name: this.parent.localeObj.getConstant('currency') },
                { index: 2, name: this.parent.localeObj.getConstant('percentage') }
            ];
            this.formatDropDown = new DropDownList({
                dataSource: fields, fields: { text: 'name', value: 'name' },
                index: 0, change: this.dropDownChange.bind(this), enableRtl: this.parent.enableRtl,
                cssClass: cls.FORMATTING_FORMAT_DROP
            });
            this.formatDropDown.isStringTemplate = true;
            this.formatDropDown.appendTo('#' + this.parent.element.id + '_FormatDrop');
        }
        if (this.formatDropDown.value !== this.parent.localeObj.getConstant('currency')) {
            if (this.customText) {
                this.customText.classList.add(cls.ICON_DISABLE);
            }
            if (this.customLable) {
                this.customLable.classList.add(cls.ICON_DISABLE);
            }
            if (this.symbolLable) {
                this.symbolLable.classList.add(cls.ICON_DISABLE);
            }
        }
        if (this.dialog.element.querySelector('#' + this.parent.element.id + '_SymbolDrop')) {
            let fields: { [key: string]: Object }[] = [
                { index: 0, name: this.parent.localeObj.getConstant('left') },
                { index: 1, name: this.parent.localeObj.getConstant('right') }
            ];
            this.symbolDropDown = new DropDownList({
                dataSource: fields, fields: { text: 'name', value: 'name' }, enableRtl: this.parent.enableRtl,
                index: 0, cssClass: cls.FORMATTING_SYMBOL_DROP +
                    (this.formatDropDown.value === this.parent.localeObj.getConstant('currency') ? '' : (' ' + cls.ICON_DISABLE))
            });
            this.symbolDropDown.isStringTemplate = true;
            this.symbolDropDown.appendTo('#' + this.parent.element.id + '_SymbolDrop');
        }
        if (this.dialog.element.querySelector('#' + this.parent.element.id + '_GroupingDrop')) {
            let fields: { [key: string]: Object }[] = [
                { index: 0, name: this.parent.localeObj.getConstant('true') },
                { index: 1, name: this.parent.localeObj.getConstant('false') }
            ];
            this.groupingDropDown = new DropDownList({
                dataSource: fields, fields: { text: 'name', value: 'name' }, enableRtl: this.parent.enableRtl,
                index: 0, cssClass: cls.FORMATTING_GROUPING_DROP
            });
            this.groupingDropDown.isStringTemplate = true;
            this.groupingDropDown.appendTo('#' + this.parent.element.id + '_GroupingDrop');
        }
        if (this.dialog.element.querySelector('#' + this.parent.element.id + '_DecimalDrop')) {
            let fields: { [key: string]: Object }[] = [
                { index: 0, name: 0 },
                { index: 1, name: 1 },
                { index: 2, name: 2 },
                { index: 3, name: 3 },
                { index: 4, name: 4 },
                { index: 5, name: 5 },
                { index: 6, name: 6 },
                { index: 7, name: 7 },
                { index: 8, name: 8 },
                { index: 9, name: 9 },
                { index: 10, name: 10 },
            ];
            this.decimalDropDown = new DropDownList({
                dataSource: fields, fields: { text: 'name', value: 'name' }, enableRtl: this.parent.enableRtl,
                index: 0, cssClass: cls.FORMATTING_DECIMAL_DROP, popupHeight: 150
            });
            this.decimalDropDown.isStringTemplate = true;
            this.decimalDropDown.appendTo('#' + this.parent.element.id + '_DecimalDrop');
        }
    }

    private valueChange(args: ChangeEventArgs): void {
        let format: FormatSettingsModel[] = this.parent.dataSourceSettings.formatSettings;
        let isExist: boolean = false;
        for (let i: number = 0; i < format.length; i++) {
            if (format[i].name === args.value) {
                let fString: string = format[i].format;
                let first: string = fString.split('')[0].toLowerCase();
                if (fString.length === 2 && ['n', 'p'].indexOf(first) > -1) {
                    this.formatDropDown.value = first === 'n' ? this.parent.localeObj.getConstant('number') : first === 'p' ?
                        this.parent.localeObj.getConstant('percentage') : this.parent.localeObj.getConstant('number');
                    this.decimalDropDown.value = Number(fString.split('')[1]);
                    this.groupingDropDown.value = format[i].useGrouping;
                } else {
                    this.formatDropDown.value = this.parent.localeObj.getConstant('currency');
                    let pattern: string[] = this.parent.globalize.formatNumber(11111, { format: fString }).split('1').join('#').
                        match(this.customRegex);
                    if (pattern && pattern.length > 0) {
                        this.symbolDropDown.value = pattern[10] === '' ? this.parent.localeObj.getConstant('left') :
                            this.parent.localeObj.getConstant('right');
                        this.customText.value = pattern[10] === '' ? pattern[1] : pattern[10];
                        this.decimalDropDown.value = (pattern[7] && pattern[7].lastIndexOf('0'));
                        this.groupingDropDown.value = (pattern[6] && pattern[6].indexOf(',') === -1) ?
                            this.parent.localeObj.getConstant('false') : this.parent.localeObj.getConstant('true');
                    }
                }
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            this.formatDropDown.value = this.parent.localeObj.getConstant('number');
            this.decimalDropDown.value = 0;
            this.groupingDropDown.value = this.parent.localeObj.getConstant('true');
        }
    }

    private dropDownChange(args: ChangeEventArgs): void {
        if (args.value === this.parent.localeObj.getConstant('currency')) {
            if (this.customText.classList.contains(cls.ICON_DISABLE)) {
                this.customText.classList.remove(cls.ICON_DISABLE);
            }
            if (this.customLable.classList.contains(cls.ICON_DISABLE)) {
                this.customLable.classList.remove(cls.ICON_DISABLE);
            }
            if (this.symbolLable.classList.contains(cls.ICON_DISABLE)) {
                this.symbolLable.classList.remove(cls.ICON_DISABLE);
            }
            if (this.dialog.element.querySelector('.' + cls.FORMATTING_SYMBOL_DROP).classList.contains(cls.ICON_DISABLE)) {
                this.dialog.element.querySelector('.' + cls.FORMATTING_SYMBOL_DROP).classList.remove(cls.ICON_DISABLE);
            }
        } else {
            if (!this.customText.classList.contains(cls.ICON_DISABLE)) {
                this.customText.classList.add(cls.ICON_DISABLE);
            }
            if (!this.customLable.classList.contains(cls.ICON_DISABLE)) {
                this.customLable.classList.add(cls.ICON_DISABLE);
            }
            if (!this.symbolLable.classList.contains(cls.ICON_DISABLE)) {
                this.symbolLable.classList.add(cls.ICON_DISABLE);
            }
            if (!this.dialog.element.querySelector('.' + cls.FORMATTING_SYMBOL_DROP).classList.contains(cls.ICON_DISABLE)) {
                this.dialog.element.querySelector('.' + cls.FORMATTING_SYMBOL_DROP).classList.add(cls.ICON_DISABLE);
            }
        }
    }

    private removeDialog(): void {
        if (this.dialog && !this.dialog.isDestroyed) { this.dialog.destroy(); }
        if (document.getElementById(this.parent.element.id + '_FormatDialog')) {
            remove(document.getElementById(this.parent.element.id + '_FormatDialog'));
        }
    }

    private repeatString(string: string, times: number): string {
        let repeatedString: string = '';
        while (times > 0) {
            repeatedString += string;
            times--;
        }
        return repeatedString;
    }

    private updateFormatting(): void {
        let text: string;
        if (this.formatDropDown.value === this.parent.localeObj.getConstant('number') ||
            this.formatDropDown.value === this.parent.localeObj.getConstant('percentage')) {
            text = this.formatDropDown.value === this.parent.localeObj.getConstant('number') ? 'N' : 'P';
            text += this.decimalDropDown.value;
        } else {
            if (this.symbolDropDown.value === this.parent.localeObj.getConstant('left')) {
                text = this.customText.value + '##,###' + (this.decimalDropDown.value === 0 ? '' : '.') +
                    this.repeatString('0', this.decimalDropDown.value as number);
            } else {
                text = '##,###' + (this.decimalDropDown.value === 0 ? '' : '.') +
                    this.repeatString('0', this.decimalDropDown.value as number) + this.customText.value;
            }
        }
        if (this.valuesDropDown.value === this.parent.localeObj.getConstant('AllValues')) {
            let fieldList: IFieldListOptions = this.parent.engineModule.fieldList;
            Object.keys(fieldList).forEach((key: string) => {
                if (fieldList[key].type === 'number') {
                    this.insertFormat(key, text);
                }
            });
        } else {
            this.insertFormat(this.valuesDropDown.value.toString(), text);
        }
        this.parent.updateDataSource(false);
        this.dialog.close();
    }

    private insertFormat(fieldName: string, text: string): void {
        let isExist: boolean = false;
        let newFormat: FormatSettingsModel = {
            name: fieldName, format: text,
            useGrouping: this.groupingDropDown.value === this.parent.localeObj.getConstant('true') ? true : false
        };
        let format: FormatSettingsModel[] = this.parent.dataSourceSettings.formatSettings;
        for (let i: number = 0; i < format.length; i++) {
            if (format[i].name === fieldName) {
                format[i] = newFormat;
                isExist = true;
            }
        }
        if (!isExist) {
            format.push(newFormat);
        }
    }

    /**
     * To add event listener.
     * @returns void
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initFormatting, this.showNumberFormattingDialog, this);
    }

    /**
     * To remove event listener.
     * @returns void
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initFormatting, this.showNumberFormattingDialog);
    }

    /**
     * To destroy the calculated field dialog
     * @returns void
     * @hidden
     */
    public destroy(): void {
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.destroy();
        }
        this.removeEventListener();
    }
}