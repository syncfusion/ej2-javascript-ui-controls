import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { isNullOrUndefined as isNaN, createElement, extend, remove, addClass, select, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { IConditionalFormatSettings } from '../../base/engine';
import { PivotView } from '../../pivotview/base/pivotview';
import { Button } from '@syncfusion/ej2-buttons';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownArgs } from '@syncfusion/ej2-dropdowns';
import { ConditionalFormatSettingsModel } from '../../model/datasourcesettings-model';
import { Condition } from '../../base';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { PivotActionInfo } from '../base/interface';

/**
 * Module to render Conditional Formatting Dialog
 */

/** @hidden */
export class ConditionalFormatting {
    /** @hidden */
    public parent: PivotView;

    /**
     * Internal variables.
     */
    private dialog: Dialog;
    private parentID: string;
    private fieldsDropDown: DropDownList[];
    private conditionsDropDown: DropDownList[];
    private fontNameDropDown: DropDownList[];
    private fontSizeDropDown: DropDownList[];
    private fontColor: ColorPicker[];
    private backgroundColor: ColorPicker[];
    private newFormat: IConditionalFormatSettings[];

    /** Constructor for conditionalformatting module
     *
     * @param {PivotView} parent - Instance of pivot table.
     */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.conditionalFormattingModule = this;
        this.parentID = this.parent.element.id;
        this.dialog = null;
        this.fieldsDropDown = [];
        this.conditionsDropDown = [];
        this.fontNameDropDown = [];
        this.fontSizeDropDown = [];
        this.fontColor = [];
        this.backgroundColor = [];
        this.newFormat = [];
    }

    /**
     * To get module name.
     *
     * @returns {string} - Module name.
     */
    protected getModuleName(): string {
        return 'conditionalFormatting';
    }

    private createDialog(): void {
        if (select('#' + this.parentID + 'conditionalformatting', document) !== null) {
            remove(select('#' + this.parentID + 'conditionalformatting', document));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parentID + 'conditionalformatting',
            className: cls.FORMAT_DIALOG
        }));
        const buttonModel: ButtonPropsModel[] = [
            {
                click: this.addButtonClick.bind(this),
                buttonModel: {
                    cssClass: (this.parent.isAdaptive ? (cls.FORMAT_ROUND_BUTTON + ' ' + cls.FORMAT_CONDITION_BUTTON) :
                        cls.FORMAT_CONDITION_BUTTON) + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
                    content: this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('condition')
                }
            },
            {
                click: this.applyButtonClick.bind(this),
                isFlat: true,
                buttonModel: {
                    isPrimary: true, cssClass: cls.FORMAT_APPLY_BUTTON + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    content: this.parent.localeObj.getConstant('apply')
                }
            },
            {
                click: this.cancelButtonClick.bind(this),
                isFlat: true,
                buttonModel: {
                    cssClass: cls.FORMAT_CANCEL_BUTTON + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    content: this.parent.localeObj.getConstant('cancel')
                }
            }
        ];
        if (this.parent.isAdaptive) {
            this.dialog = new Dialog({
                animationSettings: { effect: 'Zoom' }, isModal: true, width: '100%', height: '100%',
                showCloseIcon: false, closeOnEscape: false, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                position: { X: 'center', Y: 'center' }, allowDragging: true, buttons: buttonModel,
                beforeOpen: this.beforeOpen.bind(this), close: this.removeDialog.bind(this),
                cssClass: this.parent.cssClass, header: this.parent.localeObj.getConstant('conditionalFormating'), target: document.body
            });
        } else {
            this.dialog = new Dialog({
                allowDragging: true, position: { X: 'center', Y: this.parent.element.offsetTop }, buttons: buttonModel,
                beforeOpen: this.beforeOpen.bind(this), close: this.removeDialog.bind(this),
                cssClass: this.parent.cssClass, isModal: true, closeOnEscape: true,
                enableRtl: this.parent.enableRtl, locale: this.parent.locale, enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                showCloseIcon: true, header: this.parent.localeObj.getConstant('conditionalFormating'), target: this.parent.element
            });
        }
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo('#' + this.parentID + 'conditionalformatting');
        // this.dialog.element.querySelector('.e-dlg-header').innerText = this.parent.localeObj.getConstant('conditionalFormating');
    }

    private beforeOpen(): void {
        this.dialog.element.querySelector('.' + cls.DIALOG_HEADER).
            setAttribute('title', this.parent.localeObj.getConstant('conditionalFormating'));
    }

    private addButtonClick(): void {
        const format: ConditionalFormatSettingsModel = {
            conditions: 'LessThan',
            value1: 0,
            applyGrandTotals: true,
            style: {
                backgroundColor: 'white',
                color: 'black',
                fontFamily: 'Arial',
                fontSize: '12px'
            }
        };  // eslint-disable-next-line @typescript-eslint/no-this-alias
        const conditionalFormating: ConditionalFormatting = this;
        this.parent.trigger(events.conditionalFormatting, format, (observedArgs: ConditionalFormatSettingsModel) => {
            conditionalFormating.refreshConditionValues();
            this.destroyColorPickers();
            conditionalFormating.newFormat.push(observedArgs);
            conditionalFormating.addFormat();
        });
    }

    private applyButtonClick(): void {
        if (this.refreshConditionValues()) {
            this.parent.setProperties({ dataSourceSettings: { conditionalFormatSettings: this.newFormat } }, true);
            const actionInfo: PivotActionInfo = {
                conditionalFormattingInfo: this.parent.dataSourceSettings.conditionalFormatSettings as IConditionalFormatSettings[]
            };
            this.parent.actionObj.actionInfo = actionInfo;
            if (this.parent.dataSourceSettings.values.length > 0) {
                this.parent.renderPivotGrid();
            }
            this.dialog.close();
        }
    }

    private cancelButtonClick(): void {
        this.dialog.close();
        this.newFormat = [];
    }

    private refreshConditionValues(): boolean {
        for (let i: number = 0; i < this.newFormat.length; i++) {
            if ((select('#' + this.parentID + 'conditionvalue1' + i, document) as HTMLInputElement).value === '' ||
                (select('#' + this.parentID + 'conditionvalue2' + i, document) as HTMLInputElement).value === '') {
                if ((select('#' + this.parentID + 'conditionvalue1' + i, document) as HTMLInputElement).value === '') {
                    (select('#' + this.parentID + 'conditionvalue1' + i, document) as HTMLInputElement).focus();
                } else {
                    (select('#' + this.parentID + 'conditionvalue2' + i, document) as HTMLInputElement).focus();
                }
                return false;
            }
            this.newFormat[i as number].value1 =
                Number((select('#' + this.parentID + 'conditionvalue1' + i, document) as HTMLInputElement).value);
            this.newFormat[i as number].value2 =
                Number((select('#' + this.parentID + 'conditionvalue2' + i, document) as HTMLInputElement).value);
        }
        return true;
    }

    private addFormat(): void {
        const format: HTMLElement = createElement('div', { id: this.parentID + 'formatDiv', className: cls.FORMAT_NEW });
        for (let i: number = 0; i < this.newFormat.length; i++) {
            format.appendChild(this.createDialogElements(i));
        }
        if (this.newFormat.length === 0) {
            const outerDiv: HTMLElement = this.createDialogElements();
            const element: HTMLElement = createElement('p', {
                id: this.parentID + 'emptyFormat',
                className: cls.EMPTY_FORMAT
            });
            element.innerText = this.parent.localeObj.getConstant('emptyFormat');
            outerDiv.appendChild(element);
            format.appendChild(outerDiv);
        }
        this.dialog.setProperties({ 'content': format }, false);
        for (let i: number = 0; i < this.newFormat.length; i++) {
            this.renderDropDowns(i);
            this.renderColorPicker(i);
        }
    }

    private createDialogElements(i?: number): HTMLElement {
        const outerDiv: HTMLElement = createElement('div', {
            id: this.parentID + 'outerDiv' + i, className: cls.FORMAT_OUTER
        });
        if (i !== undefined) {
            const format: ConditionalFormatSettingsModel = this.newFormat[i as number];
            const button: HTMLElement = createElement('button', {
                id: this.parentID + 'removeButton' + i, className: cls.FORMAT_DELETE_BUTTON,
                attrs: { type: 'button', 'title': this.parent.localeObj.getConstant('delete') }
            });
            outerDiv.appendChild(button);
            const innerDiv: HTMLElement = createElement('div', { id: this.parentID + 'innerDiv' + i, className: cls.FORMAT_INNER });
            let table: HTMLElement = createElement('table', { id: this.parentID + 'cftable' + i, className: cls.FORMAT_TABLE, attrs: { 'role': 'table' } });
            let tRow: HTMLElement = createElement('tr'); let td: HTMLElement = createElement('td');
            const valuelabel: HTMLElement = createElement('span', {
                id: this.parentID + 'valuelabel' + i, className: cls.FORMAT_VALUE_LABEL
            });
            valuelabel.innerText = this.parent.localeObj.getConstant('value');
            td.appendChild(valuelabel); tRow.appendChild(td);
            table.appendChild(tRow); tRow = createElement('tr'); td = createElement('td');
            const measureDropdown: HTMLElement = createElement('div', { id: this.parentID + 'measure' + i });
            const measureInput: HTMLInputElement = createElement('input', {
                id: this.parentID + 'measureinput' + i,
                attrs: { 'type': 'text', 'tabindex': '0' }
            }) as HTMLInputElement;
            measureDropdown.appendChild(measureInput); td.appendChild(measureDropdown); tRow.appendChild(td); td = createElement('td');
            const conditionDropdown: HTMLElement = createElement('div', { id: this.parentID + 'condition' + i });
            const conditionInput: HTMLInputElement = createElement('input', {
                id: this.parentID + 'conditioninput' + i,
                attrs: { 'type': 'text', 'tabindex': '0' }
            }) as HTMLInputElement;
            conditionDropdown.appendChild(conditionInput); td.appendChild(conditionDropdown); tRow.appendChild(td);
            td = createElement('td');
            const style: string = !(format.conditions === 'Between' || format.conditions === 'NotBetween') ? 'display:none; width:10px' : '';
            const value1: HTMLInputElement = createElement('input', {
                id: this.parentID + 'conditionvalue1' + i,
                attrs: {
                    'type': 'text', 'tabindex': '0', 'value': !isNaN(format.value1) ? format.value1.toString() : '0',
                    'placeholder': this.parent.localeObj.getConstant('emptyInput')
                },
                styles: this.parent.isAdaptive ? style === '' ? 'width: 35%' : 'width: 100%' : style === '' ? 'width: 45px' :
                    'width: 120px',
                className: cls.INPUT + ' ' + cls.FORMAT_VALUE1
            }) as HTMLInputElement;
            td.appendChild(value1);
            const valuespan: HTMLElement = createElement('span', {
                id: this.parentID + 'valuespan' + i, className: cls.FORMAT_VALUE_SPAN,
                innerHTML: '&', styles: style
            });
            td.appendChild(valuespan);
            const value2: HTMLInputElement = createElement('input', {
                id: this.parentID + 'conditionvalue2' + i,
                attrs: {
                    'type': 'text', 'tabindex': '0', 'value': !isNaN(format.value2) ? format.value2.toString() : '0',
                    'placeholder': this.parent.localeObj.getConstant('emptyInput')
                },
                styles: (this.parent.isAdaptive && style === '') ? 'width: 35%' : style === '' ? 'width: 45px' : style,
                className: cls.INPUT + ' ' + cls.FORMAT_VALUE2
            }) as HTMLInputElement;
            td.appendChild(value2); tRow.appendChild(td); table.appendChild(tRow);
            if (this.parent.isAdaptive) {
                innerDiv.appendChild(table); table = createElement('table', { id: this.parentID + 'cftable', className: cls.FORMAT_TABLE, attrs: { 'role': 'table' } });
            }
            tRow = createElement('tr'); td = createElement('td');
            const formatlabel: HTMLElement = createElement('span', {
                id: this.parentID + 'formatlabel' + i, className: cls.FORMAT_LABEL
            });
            formatlabel.innerText = this.parent.localeObj.getConstant('formatLabel');
            td.appendChild(formatlabel); tRow.appendChild(td); table.appendChild(tRow); tRow = createElement('tr');
            td = createElement('td'); const fontNameDropdown: HTMLElement = createElement('div', { id: this.parentID + 'fontname' + i });
            const fontNameInput: HTMLInputElement = createElement('input', {
                id: this.parentID + 'fontnameinput' + i, attrs: { 'type': 'text', 'tabindex': '0' }
            }) as HTMLInputElement;
            fontNameDropdown.appendChild(fontNameInput); td.appendChild(fontNameDropdown); tRow.appendChild(td); td = createElement('td');
            const fontSizeDropdown: HTMLElement = createElement('div', { id: this.parentID + 'fontsize' + i });
            const fontSizeInput: HTMLInputElement = createElement('input', {
                id: this.parentID + 'fontsizeinput' + i, attrs: { 'type': 'text', 'tabindex': '0' }
            }) as HTMLInputElement;
            fontSizeDropdown.appendChild(fontSizeInput); td.appendChild(fontSizeDropdown); tRow.appendChild(td);
            if (this.parent.isAdaptive) {
                table.appendChild(tRow); tRow = createElement('tr'); table.appendChild(tRow); tRow = createElement('tr');
            }
            td = createElement('td');
            const colorPicker1: HTMLInputElement = createElement('input', {
                id: this.parentID + 'fontcolor' + i, attrs: { 'type': 'color', 'tabindex': '0' }, className: cls.FORMAT_FONT_COLOR
            }) as HTMLInputElement;
            td.appendChild(colorPicker1);
            const colorPicker2: HTMLInputElement = createElement('input', {
                id: this.parentID + 'backgroundcolor' + i, attrs: { 'type': 'color', 'tabindex': '0' }, className: cls.FORMAT_BACK_COLOR
            }) as HTMLInputElement;
            td.appendChild(colorPicker2); tRow.appendChild(td); td = createElement('td');
            const valuePreview: HTMLInputElement = createElement('div', {
                id: this.parentID + 'valuepreview' + i, className: cls.INPUT + ' ' + cls.FORMAT_VALUE_PREVIEW,
                innerHTML: '123.45'
            }) as HTMLInputElement;
            td.appendChild(valuePreview); tRow.appendChild(td); table.appendChild(tRow); innerDiv.appendChild(table);
            outerDiv.appendChild(innerDiv);
        }
        return outerDiv;
    }

    private renderDropDowns(i: number): void {
        const format: ConditionalFormatSettingsModel = this.newFormat[i as number];
        const fields: { [key: string]: Object }[] = [];
        fields.push({
            index: 0, name: this.parent.localeObj.getConstant('AllValues'),
            field: this.parent.localeObj.getConstant('AllValues')
        });
        for (let i: number = 0; i < this.parent.dataSourceSettings.values.length; i++) {
            let caption: string = this.parent.dataSourceSettings.values[i as number].caption ||
                this.parent.dataSourceSettings.values[i as number].name;
            caption = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(caption) : caption;
            fields.push({
                index: i + 1,
                name: caption,
                field: this.parent.dataSourceSettings.values[i as number].name
            });
        }
        let value: string = isNaN(format.measure) ? this.parent.localeObj.getConstant('AllValues') : format.measure;
        this.fieldsDropDown[i as number] = new DropDownList({
            dataSource: fields, fields: { text: 'name', value: 'field' },
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            cssClass: this.parent.cssClass,
            popupHeight: '200px', popupWidth: 'auto', locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            change: this.measureChange.bind(this, i)
        });
        this.fieldsDropDown[i as number].isStringTemplate = true;
        this.fieldsDropDown[i as number].appendTo('#' + this.parentID + 'measureinput' + i);
        const conditions: { [key: string]: Object }[] = [
            { value: 'LessThan', name: this.parent.localeObj.getConstant('LessThan') },
            { value: 'LessThanOrEqualTo', name: this.parent.localeObj.getConstant('LessThanOrEqualTo') },
            { value: 'GreaterThan', name: this.parent.localeObj.getConstant('GreaterThan') },
            { value: 'GreaterThanOrEqualTo', name: this.parent.localeObj.getConstant('GreaterThanOrEqualTo') },
            { value: 'Equals', name: this.parent.localeObj.getConstant('Equals') },
            { value: 'NotEquals', name: this.parent.localeObj.getConstant('NotEquals') },
            { value: 'Between', name: this.parent.localeObj.getConstant('Between') },
            { value: 'NotBetween', name: this.parent.localeObj.getConstant('NotBetween') }
        ];
        value = isNaN(format.conditions) ? 'LessThan' : format.conditions;
        this.conditionsDropDown[i as number] = new DropDownList({
            dataSource: conditions, fields: { value: 'value', text: 'name' },
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            cssClass: this.parent.cssClass,
            popupHeight: '200px', popupWidth: 'auto', locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            change: this.conditionChange.bind(this, i)
        });
        this.conditionsDropDown[i as number].isStringTemplate = true;
        this.conditionsDropDown[i as number].appendTo('#' + this.parentID + 'conditioninput' + i);
        const fontNames: { [key: string]: Object }[] = [
            { index: 0, name: 'Arial' }, { index: 1, name: 'San Serif' }, { index: 2, name: 'Impact' },
            { index: 3, name: 'Trebuchet MS' }, { index: 4, name: 'Serif' }, { index: 5, name: 'Verdana' },
            { index: 6, name: 'Courier New' }, { index: 7, name: 'Times New Roman' }, { index: 8, name: 'Tahoma' },
            { index: 9, name: 'Gerogia' }
        ];
        value = isNaN(format.style.fontFamily) ? 'Arial' : format.style.fontFamily;
        this.fontNameDropDown[i as number] = new DropDownList({
            dataSource: fontNames, fields: { text: 'name' },
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            cssClass: this.parent.cssClass,
            popupWidth: '150px', popupHeight: '200px', locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            change: this.fontNameChange.bind(this, i)
        });
        this.fontNameDropDown[i as number].isStringTemplate = true;
        this.fontNameDropDown[i as number].appendTo('#' + this.parentID + 'fontnameinput' + i);
        const fontSize: { [key: string]: Object }[] = [
            { index: 0, name: '9px' }, { index: 1, name: '10px' }, { index: 2, name: '11px' }, { index: 3, name: '12px' },
            { index: 4, name: '13px' }, { index: 5, name: '14px' }, { index: 6, name: '15px' }, { index: 6, name: '16px' }
        ];
        value = isNaN(format.style.fontSize) ? '12px' : format.style.fontSize;
        this.fontSizeDropDown[i as number] = new DropDownList({
            dataSource: fontSize, fields: { text: 'name' }, popupHeight: '200px',
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            change: this.fontSizeChange.bind(this, i),
            locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            cssClass: this.parent.cssClass
        });
        this.fontSizeDropDown[i as number].isStringTemplate = true;
        this.fontSizeDropDown[i as number].appendTo('#' + this.parentID + 'fontsizeinput' + i);
    }

    private conditionChange(i: number, args: DropDownArgs): void {
        this.newFormat[i as number].conditions = args.value as Condition;
        if (args.value === 'Between' || args.value === 'NotBetween') {
            (select('#' + this.parentID + 'valuespan' + i, document) as HTMLElement).style.display = 'inline-block';
            (select('#' + this.parentID + 'valuespan' + i, document) as HTMLElement).style.width =
                this.parent.isAdaptive ? '10%' : '10px';
            (select('#' + this.parentID + 'conditionvalue2' + i, document) as HTMLElement).style.display = 'inline-block';
            (select('#' + this.parentID + 'conditionvalue2' + i, document) as HTMLElement).style.width =
                this.parent.isAdaptive ? '35%' : '45px';
            (select('#' + this.parentID + 'conditionvalue1' + i, document) as HTMLElement).style.width =
                this.parent.isAdaptive ? '35%' : '45px';
        } else {
            (select('#' + this.parentID + 'valuespan' + i, document) as HTMLElement).style.display = 'none';
            (select('#' + this.parentID + 'conditionvalue2' + i, document) as HTMLElement).style.display = 'none';
            (select('#' + this.parentID + 'conditionvalue1' + i, document) as HTMLElement).style.width =
                this.parent.isAdaptive ? '100%' : '120px';
        }
    }

    private fontNameChange(i: number, args: DropDownArgs): void {
        this.newFormat[i as number].style.fontFamily = args.value.toString();
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.fontFamily = args.value as string;
    }

    private fontSizeChange(i: number, args: DropDownArgs): void {
        this.newFormat[i as number].style.fontSize = args.value.toString();
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.fontSize = args.value as string;
    }

    private measureChange(i: number, args: DropDownArgs): void {
        this.newFormat[i as number].measure = args.value.toString() === this.parent.localeObj.getConstant('AllValues') ?
            undefined : args.value.toString();
    }

    private renderColorPicker(i: number): void {
        const format: ConditionalFormatSettingsModel = this.newFormat[i as number];
        let value: string = isNaN(format.style.color) ? 'black' : format.style.color;
        let color: string = this.isHex(value.substr(1)) ? value : this.colourNameToHex(value);
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.color = color;
        this.fontColor[i as number] = new ColorPicker({
            cssClass: cls.FORMAT_COLOR_PICKER + ' ' + cls.FORMAT_FONT_COLOR_PICKER + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            value: color, mode: 'Palette',
            change: this.fontColorChange.bind(this, i),
            locale: this.parent.locale, enableRtl: this.parent.enableRtl
        });
        this.fontColor[i as number].isStringTemplate = true;
        this.fontColor[i as number].appendTo('#' + this.parentID + 'fontcolor' + i);
        addClass([this.fontColor[i as number].element.nextElementSibling.querySelector('.' + cls.SELECTED_COLOR)], cls.ICON);
        value = isNaN(format.style.backgroundColor) ? 'white' : format.style.backgroundColor;
        color = this.isHex(value.substr(1)) ? value : this.colourNameToHex(value);
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.backgroundColor = color;
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.fontFamily = format.style.fontFamily;
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.fontSize = format.style.fontSize;
        this.backgroundColor[i as number] = new ColorPicker({
            cssClass: cls.FORMAT_COLOR_PICKER + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), value: color, mode: 'Palette',
            change: this.backColorChange.bind(this, i),
            locale: this.parent.locale, enableRtl: this.parent.enableRtl
        });
        this.backgroundColor[i as number].isStringTemplate = true;
        this.backgroundColor[i as number].appendTo('#' + this.parentID + 'backgroundcolor' + i);
        addClass([this.backgroundColor[i as number].element.nextElementSibling.querySelector('.e-selected-color')], cls.ICON);
        const toggleBtn: Button = new Button({
            iconCss: cls.ICON + ' ' + cls.FORMAT_DELETE_ICON,
            cssClass: cls.FLAT + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        toggleBtn.isStringTemplate = true;
        toggleBtn.appendTo('#' + this.parentID + 'removeButton' + i);
        toggleBtn.element.onclick = this.toggleButtonClick.bind(this, i);
    }

    private backColorChange(i: number, args: ColorPickerEventArgs): void {
        this.newFormat[i as number].style.backgroundColor = args.currentValue.hex;
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.backgroundColor =
            args.currentValue.hex;
    }

    private fontColorChange(i: number, args: ColorPickerEventArgs): void {
        this.newFormat[i as number].style.color = args.currentValue.hex;
        (select('#' + this.parentID + 'valuepreview' + i, document) as HTMLElement).style.color =
            args.currentValue.hex;
    }

    private toggleButtonClick(i: number): void {
        this.destroyColorPickers();
        this.newFormat.splice(i, 1);
        this.addFormat();
    }

    /**
     * To check is Hex or not.
     *
     * @param {string} h - It represent the hex value.
     * @returns {boolean} - It returns the isHex value as boolean.
     * @hidden
     */
    public isHex(h: string): boolean {
        const a: number = parseInt(h, 16);
        while (h.charAt(0) === '0') {
            h = h.substr(1);
        }
        return (a.toString(16) === h.toLowerCase() || (a === 0 && h === ''));
    }

    /**
     * To convert hex to RGB.
     *
     * @param {string} hex - hex value.
     * @returns { { r: number, g: number, b: number } | null } - Hex value.
     * @hidden
     */
    public hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * To convert color to hex.
     *
     * @param {string} colour - It contains the color value.
     * @returns {string} - It returns the colour Name To Hex.
     * @hidden
     */
    public colourNameToHex(colour: string): string {
        const colours: { [key: string]: string } = {
            'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4',
            'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000',
            'blanchedalmond': '#ffebcd', 'blue': '#0000ff',
            'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'cadetblue': '#5f9ea0',
            'chartreuse': '#7fff00', 'chocolate': '#d2691e',
            'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff',
            'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgreen': '#006400',
            'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f',
            'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f',
            'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dodgerblue': '#1e90ff',
            'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff',
            'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520',
            'gray': '#808080', 'green': '#008000',
            'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred ': '#cd5c5c',
            'indigo': '#4b0082', 'ivory': '#fffff0',
            'khaki': '#f0e68c', 'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd',
            'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2',
            'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6',
            'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3',
            'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee',
            'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970',
            'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080',
            'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500',
            'orchid': '#da70d6',
            'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093',
            'papayawhip': '#ffefd5',
            'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080',
            'rebeccapurple': '#663399', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
            'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57',
            'seashell': '#fff5ee', 'sienna': '#a0522d',
            'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'snow': '#fffafa',
            'springgreen': '#00ff7f',
            'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0',
            'violet': '#ee82ee', 'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00',
            'yellowgreen': '#9acd32'
        };

        if (typeof colours[colour.toLowerCase()] !== 'undefined') {
            return colours[colour.toLowerCase()];
        } else if (colour.search('rgba') === 0) {
            const value: string[] = colour.substr(5).split(')')[0].split(',');
            let rgb: string = '';
            let a: string = '';
            for (let i: number = 0; i < value.length - 1; i++) {
                value[i as number] = (+value[i as number]).toString(16);
                if (value[i as number].length === 1) {
                    value[i as number] = '0' + value[i as number];
                }
                rgb = rgb + value[i as number];
            }
            a = (Math.round(+value[3] * 255)).toString(16);
            return '#' + rgb + a;
        } else if (colour.search('rgb') === 0) {
            const value: string[] = colour.substr(4).split(')')[0].split(',');
            let rgb: string = '';
            for (let i: number = 0; i < value.length; i++) {
                value[i as number] = (+value[i as number]).toString(16);
                if (value[i as number].length === 1) {
                    value[i as number] = '0' + value[i as number];
                }
                rgb = rgb + value[i as number];
            }
            return '#' + rgb;
        }
        return '#d5d5d5';
    }
    private removeDialog(): void {
        if (this.dialog && !this.dialog.isDestroyed) {
            this.destroyColorPickers();
            this.dialog.destroy();
        }
        if (select('#' + this.parentID + 'conditionalformatting', document)) {
            remove(select('#' + this.parentID + 'conditionalformatting', document));
        }
    }
    private destroyColorPickers(): void {
        for (let i: number = 0; i < (this.newFormat ? this.newFormat.length : 0); i++) {
            if (this.fontColor && this.fontColor[i as number] && !this.fontColor[i as number].isDestroyed) {
                this.fontColor[i as number].destroy();
            }
            if (this.backgroundColor && this.backgroundColor[i as number] && !this.backgroundColor[i as number].isDestroyed) {
                this.backgroundColor[i as number].destroy();
            }
        }
    }

    /**
     * To create Conditional Formatting dialog.
     *
     * @returns {void}
     * @hidden
     */
    public showConditionalFormattingDialog(): void {
        this.newFormat = [];
        for (let i: number = 0; i < this.parent.dataSourceSettings.conditionalFormatSettings.length; i++) {
            this.newFormat.push(
                extend(
                    {},
                    (<{ [key: string]: Object }>this.parent.dataSourceSettings.conditionalFormatSettings[i as number]).properties,
                    null, true) as IConditionalFormatSettings);
        }
        this.createDialog();
        this.dialog.refresh();
        this.addFormat();
    }

    /**
     * To destroy the Conditional Formatting dialog
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.close();
        } else {
            return;
        }
    }
}
