import { PivotView } from '../../pivotview/base/pivotview';
import { Dialog } from '@syncfusion/ej2-popups';
import { createElement, remove, extend, select, SanitizeHtmlHelper, getInstance } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import { IAction, NumberFormattingEventArgs, PivotActionInfo } from '../base/interface';
import * as events from '../../common/base/constant';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { FormatSettingsModel } from '../../model/datasourcesettings-model';
import { IFormatSettings } from '../../base/engine';
import { PivotUtil } from '../../base/util';

/**
 * Module to render NumberFormatting Dialog
 */

export class NumberFormatting implements IAction {
    /** @hidden */
    public parent: PivotView;
    /** @hidden */
    public dialog: Dialog;
    private customText: HTMLInputElement;
    private customLable: HTMLElement;
    private newFormat: IFormatSettings[];
    private lastFormattedValue: IFormatSettings[];
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.parent.numberFormattingModule = this;
        this.removeEventListener();
        this.addEventListener();
        this.newFormat = [];
        this.lastFormattedValue = [];
    }

    /**
     * To get module name.
     *
     * @returns {string} - It returns Module Name
     */
    protected getModuleName(): string {
        return 'numberFormatting';
    }

    /**
     * To show Number Formatting dialog.
     *
     * @returns {void}
     * @hidden
     */
    public showNumberFormattingDialog(): void {
        const valueDialog: HTMLElement = createElement('div', {
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
            locale: this.parent.locale,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: '320px',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateFormatting.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('apply'), isPrimary: true }
                },
                {
                    click: () => {
                        this.dialog.hide();
                    },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            cssClass: this.parent.cssClass,
            target: this.parent.element,
            overlayClick: () => {
                this.removeDialog();
            },
            close: this.removeDialog.bind(this)
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo(valueDialog);
        (this.dialog.element.querySelector('.' + cls.DIALOG_HEADER) as HTMLElement).innerText = this.parent.localeObj.getConstant('numberFormat');
        let formatObject: FormatSettingsModel;
        this.newFormat = [{ name: this.parent.localeObj.getConstant('AllValues'), format: 'N0', useGrouping: true, type: undefined }];
        const format: string[] = [];
        for (let i: number = 0; i < this.parent.dataSourceSettings.formatSettings.length; i++) {
            formatObject = {
                name: this.parent.dataSourceSettings.formatSettings[i as number].name,
                format: this.parent.dataSourceSettings.formatSettings[i as number].format,
                useGrouping: this.parent.dataSourceSettings.formatSettings[i as number].useGrouping,
                type: this.parent.dataSourceSettings.formatSettings[i as number].type
            };
            this.newFormat.push(formatObject);
        }
        for (let i: number = 0; i < this.newFormat.length; i++) {
            format.push(this.newFormat[i as number].name);
        }
        for (let j: number = 0; j < this.parent.dataSourceSettings.values.length; j++) {
            if (format.indexOf(this.parent.dataSourceSettings.values[j as number].name) === -1) {
                formatObject = {
                    name: this.parent.dataSourceSettings.values[j as number].name, format: 'N0',
                    useGrouping: true
                };
                this.newFormat.push(formatObject);
            }
        }
        this.renderControls();
    }

    private getDialogContent(): HTMLElement {
        const outerElement: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatDialogOuter',
            className: cls.FORMATTING_DIALOG_OUTER
        });
        const table: HTMLElement = createElement('table', {
            id: this.parent.element.id + '_FormatTable',
            className: cls.FORMATTING_TABLE,
            attrs: { 'role': 'tableItems' }
        });
        let tRow: HTMLElement = createElement('tr');
        let tValue: HTMLElement = createElement('td');
        const valueLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatValueLable',
            className: cls.FORMATTING_VALUE_LABLE
        });
        valueLable.innerText = this.parent.localeObj.getConstant('values');
        const valueDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatValueDrop'
        });
        tValue.appendChild(valueLable);
        tValue.appendChild(valueDrop);
        tRow.appendChild(tValue);
        table.appendChild(tRow);
        tRow = createElement('tr');
        tValue = createElement('td');
        const formatLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatLable',
            className: cls.FORMATTING_FORMAT_LABLE
        });
        formatLable.innerText = this.parent.localeObj.getConstant('formatType');
        const formatDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FormatDrop'
        });
        tValue.appendChild(formatLable);
        tValue.appendChild(formatDrop);
        tRow.appendChild(tValue);
        table.appendChild(tRow);
        tRow = createElement('tr');
        tValue = createElement('td');
        const groupingLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_GroupingLable',
            className: cls.FORMATTING_GROUPING_LABLE
        });
        groupingLable.innerText = this.parent.localeObj.getConstant('grouping');
        const groupingDrop: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_GroupingDrop'
        });
        tValue.appendChild(groupingLable);
        tValue.appendChild(groupingDrop);
        tRow.appendChild(tValue);
        table.appendChild(tRow);
        tRow = createElement('tr');
        tValue = createElement('td');
        const decimalLable: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_DecimalLable',
            className: cls.FORMATTING_DECIMAL_LABLE
        });
        decimalLable.innerText = this.parent.localeObj.getConstant('decimalPlaces');
        const decimalDrop: HTMLElement = createElement('div', {
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
            className: cls.FORMATTING_CUSTOM_LABLE
        });
        this.customLable.innerText = this.parent.localeObj.getConstant('customFormatString');
        this.customText = createElement('input', {
            id: this.parent.element.id + '_CustomText',
            attrs: {
                'type': 'text', 'tabindex': '0'
            },
            className: cls.INPUT + ' ' + cls.FORMATTING_CUSTOM_TEXT
        }) as HTMLInputElement;
        tValue.appendChild(this.customLable);
        tValue.appendChild(this.customText);
        tRow.appendChild(tValue);
        table.appendChild(tRow);
        tRow = createElement('tr');
        table.appendChild(tRow);
        outerElement.appendChild(table);
        return outerElement;
    }

    private renderControls(): void {
        let valuesDropDown: DropDownList;
        let formatDropDown: DropDownList;
        let groupingDropDown: DropDownList;
        if (select('#' + this.parent.element.id + '_FormatValueDrop', this.dialog.element)) {
            const valueFields: { [key: string]: Object }[] = [];
            valueFields.push({
                index: 0, name: this.parent.localeObj.getConstant('AllValues'), field: this.parent.localeObj.getConstant('AllValues')
            });
            for (let i: number = 0; i < this.parent.dataSourceSettings.values.length; i++) {
                let caption: string = this.parent.dataSourceSettings.values[i as number].caption ||
                this.parent.dataSourceSettings.values[i as number].name;
                caption = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(caption) : caption;
                valueFields.push({
                    index: i + 1, name: caption,
                    field: this.parent.dataSourceSettings.values[i as number].name
                });
            }
            valuesDropDown = new DropDownList({
                dataSource: valueFields, fields: { text: 'name', value: 'field' }, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                index: 0, cssClass: cls.FORMATTING_VALUE_DROP + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), change: this.valueChange.bind(this), width: '100%',
                open: this.customUpdate.bind(this)
            });
            valuesDropDown.isStringTemplate = true;
            valuesDropDown.appendTo('#' + this.parent.element.id + '_FormatValueDrop');
        }
        if (select('#' + this.parent.element.id + '_FormatDrop', this.dialog.element)) {
            const fields: { [key: string]: Object }[] = [
                { index: 0, name: this.parent.localeObj.getConstant('number') },
                { index: 1, name: this.parent.localeObj.getConstant('currency') },
                { index: 2, name: this.parent.localeObj.getConstant('percentage') },
                { index: 3, name: this.parent.localeObj.getConstant('Custom') }
            ];
            formatDropDown = new DropDownList({
                dataSource: fields, fields: { text: 'name', value: 'name' },
                index: 0, change: this.dropDownChange.bind(this), enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                cssClass: cls.FORMATTING_FORMAT_DROP + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%'
            });
            formatDropDown.isStringTemplate = true;
            formatDropDown.appendTo('#' + this.parent.element.id + '_FormatDrop');
        }
        if (select('#' + this.parent.element.id + '_GroupingDrop', this.dialog.element)) {
            const fields: { [key: string]: Object }[] = [
                { index: 0, name: this.parent.localeObj.getConstant('true') },
                { index: 1, name: this.parent.localeObj.getConstant('false') }
            ];
            groupingDropDown = new DropDownList({
                dataSource: fields, fields: { text: 'name', value: 'name' }, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                index: 0, cssClass: cls.FORMATTING_GROUPING_DROP + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%', change: this.groupingChange.bind(this)
            });
            groupingDropDown.isStringTemplate = true;
            groupingDropDown.appendTo('#' + this.parent.element.id + '_GroupingDrop');
        }
        if (select('#' + this.parent.element.id + '_DecimalDrop', this.dialog.element)) {
            const fields: { [key: string]: Object }[] = [
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
                { index: 10, name: 10 }
            ];
            const decimalDropDown: DropDownList = new DropDownList({
                dataSource: fields, fields: { text: 'name', value: 'name' }, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                index: 0, cssClass: cls.FORMATTING_DECIMAL_DROP + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), popupHeight: 150, width: '100%', change: this.decimalChange.bind(this)
            });
            decimalDropDown.isStringTemplate = true;
            decimalDropDown.appendTo('#' + this.parent.element.id + '_DecimalDrop');
        }
        if (formatDropDown.value !== this.parent.localeObj.getConstant('Custom')) {
            this.customText.disabled = true;
        }
        if (this.lastFormattedValue.length !== 0) {
            valuesDropDown.value = this.lastFormattedValue[0].name;
            const fString: string = this.lastFormattedValue[0].format;
            const first: string = fString === '' ? '' : fString.split('')[0].toLowerCase();
            const group: string = this.lastFormattedValue[0].useGrouping ? this.parent.localeObj.getConstant('true') :
                this.parent.localeObj.getConstant('false');
            this.updateFormattingDialog(fString, first, group);
        }
    }

    private valueChange(args: ChangeEventArgs): void {
        const format: FormatSettingsModel[] = this.newFormat;
        let isExist: boolean = false;
        for (let i: number = 0; i < format.length; i++) {
            if (format[i as number].name === args.value) {
                const fString: string = format[i as number].format;
                const first: string = fString === '' ? '' : fString.split('')[0].toLowerCase();
                const group: string = format[i as number].useGrouping ? this.parent.localeObj.getConstant('true') :
                    this.parent.localeObj.getConstant('false');
                this.updateFormattingDialog(fString, first, group);
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            const formatDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_FormatDrop', this.parent.element), DropDownList) as DropDownList;
            formatDropDown.value = this.parent.localeObj.getConstant('number');
            const decimalDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_DecimalDrop', this.parent.element), DropDownList) as DropDownList;
            decimalDropDown.value = 0;
            const groupingDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_GroupingDrop', this.parent.element), DropDownList) as DropDownList;
            groupingDropDown.value = this.parent.localeObj.getConstant('true');
        }
    }

    private updateFormattingDialog(fString: string, first: string, group: string): void {
        const formatDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_FormatDrop', this.parent.element), DropDownList) as DropDownList;
        if (fString.length === 2 && ['n', 'p', 'c'].indexOf(first) > -1) {
            formatDropDown.value = first === 'n' ? this.parent.localeObj.getConstant('number') : first === 'p' ?
                this.parent.localeObj.getConstant('percentage') : first === 'c' ? this.parent.localeObj.getConstant('currency') :
                    this.parent.localeObj.getConstant('number');
            const decimalDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_DecimalDrop', this.parent.element), DropDownList) as DropDownList;
            decimalDropDown.value = Number(fString.split('')[1]);
            const groupingDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_GroupingDrop', this.parent.element), DropDownList) as DropDownList;
            groupingDropDown.value = group;
        } else {
            formatDropDown.value = this.parent.localeObj.getConstant('Custom');
            this.customText.value = fString;
        }
    }

    private customUpdate(): void {
        const formatDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_FormatDrop', this.parent.element), DropDownList) as DropDownList;
        if (formatDropDown.value === this.parent.localeObj.getConstant('Custom')) {
            const index: number = this.getIndexValue();
            this.newFormat[index as number].format = this.customText.value;
        }
    }

    private dropDownChange(args: ChangeEventArgs): void {
        const index: number = this.getIndexValue();
        const groupingDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_GroupingDrop', this.parent.element), DropDownList) as DropDownList;
        const decimalDropDown: DropDownList =  getInstance(select('#' + this.parent.element.id + '_DecimalDrop', this.parent.element), DropDownList) as DropDownList;
        if (args.value === this.parent.localeObj.getConstant('Custom')) {
            this.customText.disabled = false;
            groupingDropDown.enabled = false;
            decimalDropDown.enabled = false;
            this.newFormat[index as number].format = this.customText.value;
        } else {
            const text: string = this.formattedText();
            this.newFormat[index as number].format = text;
            this.customText.disabled = true;
            groupingDropDown.enabled = true;
            decimalDropDown.enabled = true;
            this.customText.value = '';
        }
    }

    private groupingChange(): void {
        const index: number = this.getIndexValue();
        const groupingDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_GroupingDrop', this.parent.element), DropDownList) as DropDownList;
        this.newFormat[index as number].useGrouping = groupingDropDown.value === this.parent.localeObj.getConstant('true') ? true : false;
    }

    private getIndexValue(): number {
        const format: string[] = [];
        for (let i: number = 0; i < this.newFormat.length; i++) {
            format.push(this.newFormat[i as number].name);
        }
        const valuesDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_FormatValueDrop', this.parent.element), DropDownList) as DropDownList;
        const index: number = format.indexOf(valuesDropDown.value.toString());
        return index;
    }

    private decimalChange(): void {
        const index: number = this.getIndexValue();
        const text: string = this.formattedText();
        this.newFormat[index as number].format = text;
    }

    private formattedText(): string {
        let text: string;
        const formatDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_FormatDrop', this.parent.element), DropDownList) as DropDownList;
        const decimalDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_DecimalDrop', this.parent.element), DropDownList) as DropDownList;
        if (formatDropDown.value === this.parent.localeObj.getConstant('number') ||
            formatDropDown.value === this.parent.localeObj.getConstant('percentage') ||
            formatDropDown.value === this.parent.localeObj.getConstant('currency')) {
            text = formatDropDown.value === this.parent.localeObj.getConstant('number') ? 'N' :
                formatDropDown.value === this.parent.localeObj.getConstant('currency') ? 'C' : 'P';
            return text += decimalDropDown.value;
        } else {
            return text = this.customText.value;
        }
    }

    private removeDialog(): void {
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.destroy();
        }
        if (document.getElementById(this.parent.element.id + '_FormatDialog')) {
            remove(document.getElementById(this.parent.element.id + '_FormatDialog'));
        }
    }

    private updateFormatting(): void {
        const text: string = this.formattedText();
        const index: number = this.getIndexValue();
        this.newFormat.splice(index, 1);
        const format: FormatSettingsModel[] = extend([], this.newFormat, true) as FormatSettingsModel[];
        const formatSettings: FormatSettingsModel[] = this.parent.dataSourceSettings.formatSettings;
        for (let i: number = 0; i < formatSettings.length; i++) {
            this.insertFormat(formatSettings[i as number].name, formatSettings[i as number].format, formatSettings[i as number].type);
        }
        const valuesDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_FormatValueDrop', this.parent.element), DropDownList) as DropDownList;
        if (valuesDropDown.value === this.parent.localeObj.getConstant('AllValues')) {
            for (let i: number = 0; i < this.parent.dataSourceSettings.values.length; i++) {
                this.insertFormat(this.parent.dataSourceSettings.values[i as number].name, text);
            }
        } else {
            this.insertFormat(valuesDropDown.value.toString(), text);
        }
        const eventArgs: NumberFormattingEventArgs = {
            formatSettings: PivotUtil.cloneFormatSettings(this.newFormat),
            formatName: valuesDropDown.value.toString(),
            cancel: false
        };
        this.parent.trigger(events.numberFormatting, eventArgs, (observedArgs: NumberFormattingEventArgs) => {
            if (!observedArgs.cancel) {
                this.parent.setProperties({ dataSourceSettings: { formatSettings: observedArgs.formatSettings } }, true);
                const actionInfo: PivotActionInfo = {
                    numberFormattingInfo: this.parent.dataSourceSettings.formatSettings as IFormatSettings[]
                };
                this.parent.actionObj.actionInfo = actionInfo;
                try {
                    this.parent.updateDataSource();
                    this.dialog.close();
                } catch (exception) {
                    this.parent.setProperties({ dataSourceSettings: { formatSettings: format } }, true);
                    this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormat'), this.dialog.element);
                    this.parent.hideWaitingPopup();
                }
            } else {
                this.dialog.close();
                this.parent.setProperties({ dataSourceSettings: { formatSettings: format } }, true);
            }
        });
    }

    private insertFormat(fieldName: string, text: string, formatType?: string): void {
        let isExist: boolean = false;
        const groupingDropDown: DropDownList = getInstance(select('#' + this.parent.element.id + '_GroupingDrop', this.parent.element), DropDownList) as DropDownList;
        const newFormat: FormatSettingsModel = {
            name: fieldName, format: text,
            useGrouping: groupingDropDown.value === this.parent.localeObj.getConstant('true') ? true : false,
            type: formatType
        };
        const format: FormatSettingsModel[] = this.newFormat;
        for (let i: number = 0; i < format.length; i++) {
            if (format[i as number].name === fieldName) {
                format[i as number] = newFormat;
                isExist = true;
            }
        }
        if (!isExist) {
            format.push(newFormat);
        }
        this.lastFormattedValue = [];
        this.lastFormattedValue.push(newFormat);
    }

    /**
     * To add event listener.
     *
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initFormatting, this.showNumberFormattingDialog, this);
    }

    /**
     * To remove event listener.
     *
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initFormatting, this.showNumberFormattingDialog);
    }

    /**
     * To destroy the calculated field dialog
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.destroy();
        }
        this.removeEventListener();
    }
}
