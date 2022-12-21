import { createElement, remove, extend, getInstance, select } from '@syncfusion/ej2-base';
import { MouseEventArgs } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import * as cls from '../../common/base/css-constant';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { ContextMenu as Menu, MenuItemModel, ContextMenuModel } from '@syncfusion/ej2-navigations';
import { SummaryTypes } from '../../base/types';
import { IFieldOptions, IDataOptions, FieldItemInfo } from '../../base/engine';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import * as events from '../../common/base/constant';
import { PivotUtil } from '../../base/util';
import { AggregateTypes } from '../base/enum';
import { AggregateMenuOpenEventArgs } from '../base/interface';

/**
 * `AggregateMenu` module to create aggregate type popup.
 */
/** @hidden */
export class AggregateMenu {
    public parent: PivotView | PivotFieldList;
    private menuInfo: Menu[] = [];
    private parentElement: HTMLElement;
    private buttonElement: HTMLElement;
    private currentMenu: Element;
    private valueDialog: Dialog;
    private summaryTypes: AggregateTypes[];
    private stringAggregateTypes: AggregateTypes[] = ['Count', 'DistinctCount'];

    /**
     * Constructor for the rener action.
     *
     * @param {PivotView | PivotFieldList} parent - It contains the value of parent.
     * @hidden
     */
    constructor(parent?: PivotView | PivotFieldList) {
        this.parent = parent;
    }

    /**
     * Initialize the pivot table rendering
     *
     * @param {MouseEventArgs} args - It contains the args value
     * @param {HTMLElement} parentElement - It contains the value of parentElement
     * @returns {void}
     * @private
     */
    public render(args: MouseEventArgs, parentElement: HTMLElement): void {
        this.parentElement = parentElement;
        this.openContextMenu(args);
    }
    private openContextMenu(args: MouseEventArgs): void {
        const fieldName: string = (args.target as HTMLElement).parentElement.getAttribute('data-uid');
        const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(fieldName, this.parent);
        this.buttonElement = (args.target as HTMLElement).parentElement;
        const isStringField: number = this.parent.engineModule.fieldList[fieldName as string].type !== 'number' ? 1 : 0;
        this.summaryTypes = [...this.getMenuItem(isStringField)];
        this.parent.actionObj.actionName = events.aggregateField;
        this.parent.actionObj.fieldInfo = fieldInfo.fieldItem;
        if (this.parent.actionBeginMethod()) {
            return;
        }
        const eventArgs: AggregateMenuOpenEventArgs = {
            cancel: false, fieldName: fieldName, aggregateTypes: this.summaryTypes, displayMenuCount: 7
        };
        const control: PivotView | PivotFieldList =
            this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).isPopupView ?
                (this.parent as PivotFieldList).pivotGridModule : this.parent;
        try {
            control.trigger(events.aggregateMenuOpen, eventArgs, (observedArgs: AggregateMenuOpenEventArgs) => {
                if (!observedArgs.cancel) {
                    this.summaryTypes = observedArgs.aggregateTypes;
                    this.createContextMenu(isStringField, observedArgs.displayMenuCount);
                    this.currentMenu = args.target as Element;
                    const pos: OffsetPosition = this.currentMenu.getBoundingClientRect();
                    if (this.parent.enableRtl) { /* eslint-disable security/detect-non-literal-fs-filename */
                        this.menuInfo[isStringField as number].open(
                            pos.top + (window.scrollY || document.documentElement.scrollTop), pos.left - 105);
                    } else {
                        this.menuInfo[isStringField as number].open(pos.top +
                            (window.scrollY || document.documentElement.scrollTop), pos.left);
                    } /* eslint-enable security/detect-non-literal-fs-filename */
                }
            });
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private createContextMenu(isStringField: number, displayMenuCount?: number): void {
        const menuItems: MenuItemModel[][] = [];
        menuItems[isStringField  as number] = [];
        if (this.menuInfo[isStringField as number] && !this.menuInfo[isStringField as number].isDestroyed) {
            this.menuInfo[isStringField as number].destroy();
        }
        const checkDuplicates: AggregateTypes[] = [];
        for (let i: number = 0; i < this.summaryTypes.length; i++) {
            const key: AggregateTypes = this.summaryTypes[i as number] as AggregateTypes;
            if (isStringField) {
                if ((this.stringAggregateTypes.indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                    menuItems[isStringField as number].push(
                        { text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + 'StringMenu_' + key });
                    checkDuplicates.push(key);
                }
            } else {
                if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                    menuItems[isStringField as number].push({ text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + '_' + key });
                    checkDuplicates.push(key);
                }
            }
        }
        if (menuItems[isStringField as number].length > displayMenuCount) {
            menuItems[isStringField as number].splice(displayMenuCount);
            menuItems[isStringField as number].push(
                {
                    text: this.parent.localeObj.getConstant('MoreOption'),
                    id: this.parent.element.id + '_' + 'MoreOption'
                });
        }
        const menuOptions: ContextMenuModel = {
            items: menuItems[isStringField as number],
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            cssClass: this.parent.cssClass,
            beforeOpen: this.beforeMenuOpen.bind(this, isStringField),
            onClose: () => {
                (select('#' + this.buttonElement.id, this.parentElement) as HTMLElement).focus();
            },
            select: this.selectOptionInContextMenu.bind(this)
        };
        let contextMenu: HTMLElement =
            document.getElementById(this.parent.element.id + (isStringField ? 'valueFieldStringContextMenu' : 'valueFieldContextMenu'));
        if (contextMenu !== null) {
            contextMenu.innerHTML = '';
        } else {
            contextMenu = createElement('ul', {
                id: this.parent.element.id + (isStringField ? 'valueFieldStringContextMenu' : 'valueFieldContextMenu')
            });
        }
        this.parent.element.appendChild(contextMenu);
        this.menuInfo[isStringField as number] = new Menu(menuOptions);
        this.menuInfo[isStringField as number].isStringTemplate = true;
        this.menuInfo[isStringField as number].appendTo(contextMenu);
    }
    private getMenuItem(isStringField: number): AggregateTypes[] {
        const menuItems: AggregateTypes[] = [];
        for (let i: number = 0; i < this.parent.aggregateTypes.length; i++) {
            const key: AggregateTypes = this.parent.aggregateTypes[i as number] as AggregateTypes;
            if (isStringField) {
                if ((this.stringAggregateTypes.indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            } else {
                if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            }
        }
        return menuItems;
    }
    private beforeMenuOpen(isString: number, args: BeforeOpenCloseMenuEventArgs): void {
        args.element.style.zIndex = (this.menuInfo[isString as number].element.style.zIndex + 3).toString();
        args.element.style.display = 'inline';
    }
    /**
     * create Value Settings Dialog
     *
     * @param {HTMLElement} target - It represent the target elament.
     * @param {HTMLElement} parentElement - It represent the parentElement.
     * @param {string} type -It represent the type.
     * @returns {void}
     * @hidden */
    public createValueSettingsDialog(target: HTMLElement, parentElement: HTMLElement, type?: string): void {
        this.parentElement = parentElement;
        const valueDialog: HTMLElement = createElement('div', {
            id: this.parentElement.id + '_ValueDialog',
            className: 'e-value-field-settings',
            attrs: { 'data-field': target.getAttribute('data-uid') }
        });
        this.parentElement.appendChild(valueDialog);
        this.valueDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('valueFieldSettings'),
            content: this.createFieldOptions(target, type),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateValueSettings.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: () => {
                        this.valueDialog.hide();
                    },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).renderMode === 'Popup') ? false : true,
            target: this.parentElement,
            overlayClick: () => {
                this.removeDialog();
            },
            close: this.removeDialog.bind(this),
            cssClass: this.parent.cssClass
        });
        this.valueDialog.isStringTemplate = true;
        this.valueDialog.appendTo(valueDialog);
        // this.valueDialog.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('valueFieldSettings');
    }
    private createFieldOptions(buttonElement: HTMLElement, type?: string): HTMLElement {
        const fieldCaption: string = buttonElement.getAttribute('data-caption');
        let summaryType: string = (type && type !== 'MoreOption') ? type : buttonElement.getAttribute('data-type');
        let baseField: string = buttonElement.getAttribute('data-basefield');
        let baseItem: string = buttonElement.getAttribute('data-baseitem');
        summaryType = (summaryType.toString() !== 'undefined' ? summaryType : 'Sum');
        const summaryDataSource: { [key: string]: Object }[] = [];
        const summaryItems: AggregateTypes[] = this.summaryTypes;
        const checkDuplicates: AggregateTypes[] = [];
        for (let i: number = 0; i < summaryItems.length; i++) {
            if (this.parent.getAllSummaryType().indexOf(summaryItems[i as number]) > -1 &&
                checkDuplicates.indexOf(summaryItems[i as number]) < 0) {
                summaryDataSource.push({
                    value: summaryItems[i as number],
                    text: this.parent.localeObj.getConstant(summaryItems[i as number]) });
                checkDuplicates.push(summaryItems[i as number]);
            }
        }
        const baseItemTypes: string[] = ['DifferenceFrom', 'PercentageOfDifferenceFrom'];
        const baseFieldTypes: string[] = ['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
        let dataFields: IFieldOptions[] = extend([], this.parent.dataSourceSettings.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.parent.dataSourceSettings.columns);
        const fieldDataSource: { [key: string]: Object }[] = [];
        let fieldItemDataSource: string[] = [];
        // let summaryDataSource: { [key: string]: Object }[] = [];
        // for (let type of summaryTypes) {
        //     summaryDataSource.push({ value: type, text: type });
        // }
        for (const field of dataFields) {
            const value: string = field.name;
            const text: string = (field.caption ? field.caption : field.name);
            fieldDataSource.push({ value: value, text: text });
        }
        if (Object.keys(fieldDataSource).length === 0) {
            fieldDataSource.push({ value: '', text: '' });
            baseField = '';
            fieldItemDataSource = [];
        }
        else {
            baseField = (baseField && (baseField.toString() !== 'undefined' && baseField.toString() !== 'null') ? baseField : fieldDataSource[0].value as string);
            fieldItemDataSource = Object.keys(this.parent.engineModule.fieldList[(baseField.toString() !== 'undefined' ?
                baseField : fieldDataSource[0].value as string)].formattedMembers);
        }
        baseItem = (baseItem.toString() !== 'undefined' ? baseItem : fieldItemDataSource[0]);
        const mainDiv: HTMLElement = createElement('div', {
            className: 'e-value-field-div-content', id: this.parentElement.id + '_field_div_content',
            attrs: { 'data-type': summaryType, 'data-caption': fieldCaption, 'data-basefield': baseField, 'data-baseitem': baseItem }
        });
        const textWrappper: HTMLElement = createElement('div', { className: 'e-field-name-text-container' });
        const filterWrapperDiv1: HTMLElement = createElement('div', { className: 'e-field-option-container' });
        const optionWrapperDiv1: HTMLElement = createElement('div', { className: 'e-type-option-container' });
        const optionWrapperDiv2: HTMLElement = createElement('div', { className: 'e-base-field-option-container' });
        const optionWrapperDiv3: HTMLElement = createElement('div', { className: 'e-base-item-option-container' });
        const texttitle: HTMLElement = createElement('div', { className: 'e-field-name-title', innerHTML: this.parent.localeObj.getConstant('sourceName') + '&nbsp;' });
        const textContent: HTMLElement = createElement('div', { className: 'e-field-name-content', innerHTML: buttonElement.getAttribute('data-uid') });
        const inputTextDiv1: HTMLElement = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('sourceCaption')
        });
        const optionTextDiv1: HTMLElement = createElement('div', {
            className: 'e-base-field-option-text', innerHTML: this.parent.localeObj.getConstant('summarizeValuesBy')
        });
        const optionTextDiv2: HTMLElement = createElement('div', {
            className: 'e-base-item-option-text', innerHTML: this.parent.localeObj.getConstant('baseField')
        });
        const optionTextDiv3: HTMLElement = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('baseItem')
        });
        const inputDiv1: HTMLElement = createElement('div', { className: 'e-caption-input-container' });
        const dropOptionDiv1: HTMLElement = createElement('div', { id: this.parentElement.id + '_type_option' });
        const dropOptionDiv2: HTMLElement = createElement('div', { id: this.parentElement.id + '_base_field_option' });
        const dropOptionDiv3: HTMLElement = createElement('div', { id: this.parentElement.id + '_base_item_option' });
        const inputField1: HTMLInputElement = createElement('input', {
            id: this.parentElement.id + 'type_input_option',
            className: 'e-caption-input-text',
            attrs: { 'type': 'text' }
        }) as HTMLInputElement;
        textWrappper.appendChild(texttitle);
        textWrappper.appendChild(textContent);
        inputDiv1.appendChild(inputTextDiv1);
        inputDiv1.appendChild(inputField1);
        optionWrapperDiv1.appendChild(optionTextDiv1);
        optionWrapperDiv2.appendChild(optionTextDiv2);
        optionWrapperDiv3.appendChild(optionTextDiv3);
        optionWrapperDiv1.appendChild(dropOptionDiv1);
        optionWrapperDiv2.appendChild(dropOptionDiv2);
        optionWrapperDiv3.appendChild(dropOptionDiv3);
        filterWrapperDiv1.appendChild(textWrappper);
        filterWrapperDiv1.appendChild(inputDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv1.appendChild(optionWrapperDiv3);
        mainDiv.appendChild(filterWrapperDiv1);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const popupInstance: AggregateMenu = this;
        const optionWrapper1: DropDownList = new DropDownList({
            dataSource: summaryDataSource, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: summaryType,
            // popupWidth: 'auto',
            cssClass: cls.VALUE_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: (args: ChangeEventArgs) => {
                optionWrapper2.enabled = baseFieldTypes.indexOf(args.value as string) !== -1 ? true : false;
                optionWrapper3.enabled = baseItemTypes.indexOf(args.value as string) !== -1 ? true : false;
                if (optionWrapper3.enabled && (optionWrapper3.dataSource as string[]).length === 1) {
                    optionWrapper3.dataSource = fieldItemDataSource;
                    optionWrapper3.dataBind();
                }
            }
        });
        optionWrapper1.isStringTemplate = true;
        optionWrapper1.appendTo(dropOptionDiv1);
        const optionWrapper2: DropDownList = new DropDownList({
            dataSource: fieldDataSource, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            fields: { value: 'value', text: 'text' },
            value: baseField,
            // popupWidth: 'auto',
            enabled: (baseFieldTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.VALUE_OPTIONS_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%',
            change: (args: ChangeEventArgs) => {
                fieldItemDataSource = Object.keys(popupInstance.parent.engineModule.fieldList[args.value as string].formattedMembers);
                optionWrapper3.dataSource = fieldItemDataSource;
                optionWrapper3.value = fieldItemDataSource[0];
                optionWrapper3.filterBarPlaceholder = popupInstance.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0];
                (optionWrapper3 as any).itemData = null; // eslint-disable-line @typescript-eslint/no-explicit-any
                optionWrapper3.dataBind();
            }
        });
        optionWrapper2.isStringTemplate = true;
        optionWrapper2.appendTo(dropOptionDiv2);
        const optionWrapper3: DropDownList = new DropDownList({
            dataSource: fieldItemDataSource, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            value: baseItem,
            // popupWidth: 'auto',
            allowFiltering: true,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0],
            enabled: (baseItemTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.FILTER_OPERATOR_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), width: '100%'
        });
        optionWrapper3.isStringTemplate = true;
        optionWrapper3.appendTo(dropOptionDiv3);
        const inputObj1: MaskedTextBox = new MaskedTextBox({
            placeholder: 'Enter field caption',
            // floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            value: fieldCaption, width: '100%',
            cssClass: this.parent.cssClass
        });
        inputObj1.isStringTemplate = true;
        inputObj1.appendTo(inputField1);
        return mainDiv;
    }
    private selectOptionInContextMenu(menu: MenuEventArgs): void {
        if (menu.item.text !== null) {
            const buttonElement: HTMLElement = this.currentMenu.parentElement as HTMLElement;
            const fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo((buttonElement ?
                buttonElement.getAttribute('data-uid') : ''), this.parent);
            this.parent.actionObj.actionName = events.aggregateField;
            this.parent.actionObj.fieldInfo = fieldInfo.fieldItem;
            if (this.parent.actionBeginMethod()) {
                return;
            }
            const type: string = menu.item.id.split('_').pop();
            try {
                if (type === 'MoreOption' || type === 'PercentageOfDifferenceFrom'
                    || type === 'PercentageOfParentTotal' || type === 'DifferenceFrom') {
                    this.createValueSettingsDialog(buttonElement, this.parentElement, type);
                } else {
                    const field: string = buttonElement.getAttribute('data-uid');
                    const valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
                    const contentElement: HTMLElement = buttonElement.querySelector('.e-content') as HTMLElement;
                    const captionName: string = menu.item.text + ' ' + this.parent.localeObj.getConstant('of') + ' ' +
                        this.parent.engineModule.fieldList[field as string].caption;
                    contentElement.innerHTML = captionName;
                    contentElement.setAttribute('title', captionName);
                    buttonElement.setAttribute('data-type', type as string);
                    for (let vCnt: number = 0; vCnt < this.parent.dataSourceSettings.values.length; vCnt++) {
                        if (this.parent.dataSourceSettings.values[vCnt as number].name === field) {
                            const dataSourceItem: IFieldOptions =
                            extend({}, (<{ [key: string]: IFieldOptions }>valuefields[vCnt as number]).properties ?
                                (<{ [key: string]: IFieldOptions }>valuefields[vCnt as number]).properties :
                                valuefields[vCnt as number], null, true);
                            dataSourceItem.type = type as SummaryTypes;
                            this.parent.engineModule.fieldList[field as string].aggregateType = type;
                            valuefields.splice(vCnt, 1, dataSourceItem);
                            this.parent.lastAggregationInfo = dataSourceItem;
                        }
                    }
                    this.updateDataSource();
                }
            } catch (execption) {
                this.parent.actionFailureMethod(execption);
            }
        }
    }
    private updateDataSource(isRefreshed?: boolean): void {
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshed);
        } else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).renderMode === 'Popup') {
                (this.parent as PivotFieldList).pivotGridModule.setProperties({
                    dataSourceSettings: (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties as IDataOptions
                }, true);
                (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
                (this.parent as PivotFieldList).pivotGridModule.engineModule = (this.parent as PivotFieldList).engineModule;
            } else {
                (this.parent as PivotFieldList).triggerPopulateEvent();
            }
        }
    }
    private updateValueSettings(): void {
        const dialogElement: HTMLElement = this.valueDialog.element;
        const captionInstance: MaskedTextBox = getInstance(select('#' + this.parentElement.id + 'type_input_option'), MaskedTextBox) as MaskedTextBox;
        const summaryInstance: DropDownList = getInstance(select('#' + this.parentElement.id + '_type_option'), DropDownList) as DropDownList;
        const baseFieldInstance: DropDownList = getInstance(select('#' + this.parentElement.id + '_base_field_option'), DropDownList) as DropDownList;
        const baseItemInstance: DropDownList = getInstance(select('#' + this.parentElement.id + '_base_item_option'), DropDownList) as DropDownList;
        const fieldName: string = dialogElement.getAttribute('data-field');
        let buttonElement: HTMLElement;
        if (this.parentElement.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            buttonElement = this.parentElement.
                querySelector('.' + cls.PIVOT_BUTTON_CLASS + '.' + fieldName.replace(/[^A-Z0-9]/ig, '')) as HTMLElement;
        }
        if (buttonElement) {
            const contentElement: HTMLElement = buttonElement.querySelector('.e-content') as HTMLElement;
            const captionName: string = this.parent.localeObj.getConstant(summaryInstance.value as string) + ' ' +
                this.parent.localeObj.getConstant('of') + ' ' + captionInstance.value;
            contentElement.innerHTML = captionName;
            contentElement.setAttribute('title', captionName);
            buttonElement.setAttribute('data-type', summaryInstance.value as string);
            buttonElement.setAttribute('data-caption', captionInstance.value);
            buttonElement.setAttribute('data-basefield', baseFieldInstance.value as string);
            buttonElement.setAttribute('data-baseitem', baseItemInstance.value as string);
        }
        let selectedField: IFieldOptions =
            PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.values) as IFieldOptions;
        selectedField = (<{ [key: string]: Object }>selectedField).properties ?
            (<{ [key: string]: Object }>selectedField).properties : selectedField;
        selectedField.caption = captionInstance.value;
        selectedField.type = summaryInstance.value as SummaryTypes;
        selectedField.baseField = baseFieldInstance.value as string;
        selectedField.baseItem = baseItemInstance.value as string;
        this.valueDialog.close();
        // this.parent.axisFieldModule.render();
        this.parent.lastAggregationInfo = selectedField;
        this.updateDataSource(true);
    }
    private removeDialog(): void {
        if (select('#' + this.buttonElement.id, this.parentElement)) {
            (select('#' + this.buttonElement.id, this.parentElement) as HTMLElement).focus();
        }
        if (this.valueDialog && !this.valueDialog.isDestroyed) { this.valueDialog.destroy(); }
        if (document.getElementById(this.parentElement.id + '_ValueDialog')) {
            remove(document.getElementById(this.parentElement.id + '_ValueDialog'));
        }
    }

    /**
     * To destroy the pivot button event listener
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.menuInfo) {
            if (this.menuInfo[1] !== undefined && !this.menuInfo[1].isDestroyed) { this.menuInfo[1].destroy(); }
            if (this.menuInfo[0] !== undefined && !this.menuInfo[0].isDestroyed) { this.menuInfo[0].destroy(); }
        } else {
            return;
        }
    }
}
